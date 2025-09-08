// Minimal esbuild plugin that runs a transform step (Babel + react-refresh plugin).
// Usage:
//   npm install --save-dev @babel/core react-refresh
//   // or point `reactRefreshBabelPlugin` to a local implementation
//   const esbuild = require('esbuild');
//   const reactRefreshPlugin = require('./esbuild-react-refresh-plugin');
//   esbuild.build({
//     entryPoints: [...],
//     bundle: true,
//     plugins: [reactRefreshPlugin({ /* options */ })],
//     watch: true,
//   });

import * as fs from 'node:fs'
import * as path from 'node:path';

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

function createPlugin(opts = {}) {
    const {
        filter = /\.(j|t)sx?$/,
        // parser plugins to enable (tsx includes typescript + jsx)
        parserPlugins = ['jsx', 'classProperties', 'objectRestSpread', 'optionalChaining', 'nullishCoalescingOperator', 'decorators-legacy', 'typescript'],
        emitFullSignatures = false,
        skipEnvCheck = true, // not used here; user controls plugin load
    } = opts;

    let uidCounter = 0;
    function genUid(prefix = '_c') {
        uidCounter += 1;
        return `${prefix}${uidCounter}`;
    }

    function isComponentishName(name) {
        return typeof name === 'string' && name[0] >= 'A' && name[0] <= 'Z';
    }

    function isHookName(name) {
        return /^use[A-Z0-9].*/.test(name) || /^React\.use[A-Z0-9].*/.test(name);
    }

    return {
        name: 'esbuild-react-refresh-native',
        setup(build) {
            const readFile = fs.promises.readFile;
            const root = build.initialOptions.absWorkingDir || process.cwd();

            build.onLoad({ filter }, async (args) => {
                let source;
                try {
                    source = await readFile(args.path, 'utf8');
                } catch (err) {
                    return null;
                }

                // Parse to Babel AST
                let ast;
                try {
                    ast = parser.parse(source, {
                        sourceType: 'module',
                        plugins: parserPlugins,
                        errorRecovery: true,
                    });
                } catch (err) {
                    // If parse fails, return original so esbuild can try its own handling.
                    return { contents: source, loader: 'js', resolveDir: path.dirname(args.path) };
                }

                // Data structures
                const hookCalls = new WeakMap(); // functionNode -> [{name, key, calleeNode}]
                const registrations = []; // {handleId (Identifier), persistentID (string)}
                const seenForSignature = new WeakSet();
                const seenForRegistration = new WeakSet();

                // 1) Early pass: collect hook calls inside functions (simple heuristic)
                traverse(ast, {
                    CallExpression(path) {
                        const callee = path.node.callee;
                        let name = null;
                        if (t.isIdentifier(callee)) {
                            name = callee.name;
                        } else if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
                            name = callee.property.name;
                        }
                        if (!name || !isHookName(name)) return;

                        const fnPath = path.getFunctionParent();
                        if (!fnPath) return;
                        const fnNode = fnPath.node;
                        if (!hookCalls.has(fnNode)) hookCalls.set(fnNode, []);
                        const arr = hookCalls.get(fnNode);

                        let key = '';
                        // Heuristic: include simple args that affect signature.
                        const args = path.get('arguments');
                        if (name === 'useState' && args && args.length > 0) {
                            try {
                                key = '(' + args[0].getSource() + ')';
                            } catch (e) {
                                key = '(?)';
                            }
                        } else if (name === 'useReducer' && args && args.length > 1) {
                            try {
                                key = '(' + args[1].getSource() + ')';
                            } catch (e) {
                                key = '(?)';
                            }
                        }
                        arr.push({ name, key, callee: path.node.callee });
                    },
                });

                // Helper to compute signature object for a function node
                function getHookCallsSignatureFor(node) {
                    const calls = hookCalls.get(node);
                    if (!calls || calls.length === 0) return null;
                    const key = calls.map(c => c.name + '{' + c.key + '}').join('\n');
                    // custom hooks (not starting with use and capital?) Simplified: treat non-builtins as custom
                    const builtin = new Set([
                        'useState', 'useReducer', 'useEffect', 'useLayoutEffect', 'useMemo', 'useCallback', 'useRef', 'useContext', 'useImperativeHandle', 'useDebugValue', 'useId', 'useDeferredValue', 'useTransition', 'useInsertionEffect', 'useSyncExternalStore'
                    ]);
                    const customHooks = calls.filter(c => !builtin.has(c.name)).map(c => c.callee);
                    return { key, customHooks };
                }

                // 2) Find components and inject handles and signatures
                // We'll handle FunctionDeclaration, VariableDeclarator (init), and ExportDefaultDeclaration with CallExpression.
                traverse(ast, {
                    // export default memo(()=>{})
                    ExportDefaultDeclaration(path) {
                        const decl = path.get('declaration');
                        if (!decl || !decl.isCallExpression()) return;
                        if (seenForRegistration.has(path.node)) return;
                        seenForRegistration.add(path.node);
                        // Inferred name: %default%
                        const inferredName = '%default%';
                        // We'll try to find inner component: first argument
                        const firstArg = decl.get('arguments')[0];
                        if (!firstArg) return;
                        const target = firstArg.node;
                        // Only handle function or arrow for now
                        if (t.isFunctionExpression(target) || t.isArrowFunctionExpression(target) || t.isIdentifier(target)) {
                            const handleName = genUid('_c');
                            const handleId = t.identifier(handleName);
                            // replace firstArg with assignment (_cX = <arg>)
                            firstArg.replaceWith(t.assignmentExpression('=', handleId, firstArg.node));
                            const persistentID = inferredName;
                            registrations.push({ handle: handleId, persistentID });
                        }
                    },

                    FunctionDeclaration(path) {
                        const id = path.node.id;
                        if (!id || !isComponentishName(id.name)) return;
                        if (seenForRegistration.has(path.node)) return;
                        seenForRegistration.add(path.node);

                        // registration: create handle and insert after function declaration: _cX = Foo
                        const handleName = genUid('_c');
                        const handleId = t.identifier(handleName);
                        const programPath = path.findParent(p => p.isProgram());
                        if (!programPath) return;
                        // insert assignment after the function declaration
                        const assign = t.expressionStatement(t.assignmentExpression('=', handleId, id));
                        path.insertAfter(assign);
                        registrations.push({ handle: handleId, persistentID: id.name });
                    },

                    VariableDeclarator(path) {
                        // handle: const Foo = () => {}  or const Foo = function() {}
                        const id = path.node.id;
                        const init = path.node.init;
                        if (!t.isIdentifier(id)) return;
                        const inferredName = id.name;
                        if (!isComponentishName(inferredName)) return;
                        if (seenForRegistration.has(path.node)) return;
                        seenForRegistration.add(path.node);

                        if (t.isFunctionExpression(init) || t.isArrowFunctionExpression(init)) {
                            // We'll register on next line to preserve inferred names.
                            const handleName = genUid('_c');
                            const handleId = t.identifier(handleName);
                            const insertAfterPath = path.findParent(p => p.isVariableDeclaration()) || path;
                            const assign = t.expressionStatement(t.assignmentExpression('=', handleId, id));
                            insertAfterPath.insertAfter(assign);
                            registrations.push({ handle: handleId, persistentID: inferredName });
                        } else if (t.isCallExpression(init)) {
                            // const Foo = hoc(() => {})
                            // look inside first argument for function/arrow and replace it with (_cX = <arg>)
                            const firstArgPath = path.get('init').get('arguments')[0];
                            if (firstArgPath && (firstArgPath.isFunctionExpression() || firstArgPath.isArrowFunctionExpression())) {
                                const handleName = genUid('_c');
                                const handleId = t.identifier(handleName);
                                firstArgPath.replaceWith(t.assignmentExpression('=', handleId, firstArgPath.node));
                                registrations.push({ handle: handleId, persistentID: inferredName });
                            }
                        }
                    },

                    // Insert signatures for functions with hooks
                    FunctionDeclaration: {
                        exit(path) {
                            const node = path.node;
                            const sig = getHookCallsSignatureFor(node);
                            if (!sig) return;
                            if (seenForSignature.has(node)) return;
                            seenForSignature.add(node);

                            // create sig factory var: var _sX = $RefreshSig$();
                            const sigId = path.scope.generateUidIdentifier('_s');
                            const decl = t.variableDeclaration('var', [t.variableDeclarator(sigId, t.callExpression(t.identifier('$RefreshSig$'), []))]);
                            // insert decl into parent scope (program body)
                            const parentProgram = path.findParent(p => p.isProgram());
                            if (parentProgram) {
                                parentProgram.node.body.unshift(decl);
                            } else {
                                path.insertBefore(decl);
                            }

                            // insert _sX(); at top of function body
                            if (!t.isBlockStatement(node.body)) {
                                node.body = t.blockStatement([t.returnStatement(node.body)]);
                            }
                            node.body.body.unshift(t.expressionStatement(t.callExpression(sigId, [])));

                            // insert signature association after the function declaration
                            const args = [
                                node.id,
                                t.stringLiteral(emitFullSignatures ? sig.key : require('crypto').createHash('sha1').update(sig.key).digest('base64')),
                            ];
                            if (sig.customHooks && sig.customHooks.length > 0) {
                                // for simplicity always pass a function returning array of custom hook callee ASTs
                                args.push(t.booleanLiteral(false)); // forceReset=false (simplified)
                                const arrExpr = t.arrayExpression(sig.customHooks.map(c => c)); // might reference nodes not in scope — acceptable simplified case
                                const fnExpr = t.functionExpression(null, [], t.blockStatement([t.returnStatement(arrExpr)]));
                                args.push(fnExpr);
                            }
                            const callExpr = t.expressionStatement(t.callExpression(sigId, args));
                            path.insertAfter(callExpr);
                        },
                    },

                    'ArrowFunctionExpression|FunctionExpression': {
                        exit(path) {
                            const node = path.node;
                            const sig = getHookCallsSignatureFor(node);
                            if (!sig) return;
                            if (seenForSignature.has(node)) return;
                            seenForSignature.add(node);

                            // For function expressions assigned to variables, we will create a sig factory and insert calls.
                            const sigId = path.scope.generateUidIdentifier('_s');
                            const decl = t.variableDeclaration('var', [t.variableDeclarator(sigId, t.callExpression(t.identifier('$RefreshSig$'), []))]);
                            // Insert decl at top-level of file (simplified)
                            const parentProgram = path.findParent(p => p.isProgram());
                            if (parentProgram) {
                                parentProgram.node.body.unshift(decl);
                            } else {
                                path.insertBefore(decl);
                            }

                            // Ensure block body
                            if (!t.isBlockStatement(node.body)) {
                                node.body = t.blockStatement([t.returnStatement(node.body)]);
                            }
                            node.body.body.unshift(t.expressionStatement(t.callExpression(sigId, [])));

                            // Insert association appropriately:
                            if (path.parentPath.isVariableDeclarator()) {
                                const varId = path.parentPath.node.id;
                                const args = [varId, t.stringLiteral(emitFullSignatures ? sig.key : require('crypto').createHash('sha1').update(sig.key).digest('base64'))];
                                if (sig.customHooks && sig.customHooks.length > 0) {
                                    args.push(t.booleanLiteral(false));
                                    const arrExpr = t.arrayExpression(sig.customHooks.map(c => c));
                                    const fnExpr = t.functionExpression(null, [], t.blockStatement([t.returnStatement(arrExpr)]));
                                    args.push(fnExpr);
                                }
                                const callExpr = t.expressionStatement(t.callExpression(sigId, args));
                                // insert after parent variable declaration
                                const insertAfter = path.findParent(p => p.isVariableDeclaration()) || path;
                                insertAfter.insertAfter(callExpr);
                            } else if (path.parentPath.isCallExpression()) {
                                // wrap call expression: _sX(hoc(_sX((...)))) -- simplified: just call sig around the parent node
                                const parent = path.parentPath.node;
                                const args = [parent, t.stringLiteral(emitFullSignatures ? sig.key : require('crypto').createHash('sha1').update(sig.key).digest('base64'))];
                                const newNode = t.callExpression(sigId, args);
                                path.parentPath.replaceWith(newNode);
                            }
                        },
                    },
                });

                // 3) Program exit: inject declaration of handles and registration calls
                const programBody = ast.program.body;
                if (registrations.length > 0) {
                    // Insert a var declaration for handles at top
                    const declIds = registrations.map(r => t.variableDeclarator(r.handle));
                    const varDecl = t.variableDeclaration('var', declIds);
                    programBody.unshift(varDecl);

                    // Append registration calls at end
                    registrations.forEach(r => {
                        const call = t.expressionStatement(
                            t.callExpression(t.identifier('$RefreshReg$'), [
                                r.handle,
                                t.stringLiteral(r.persistentID),
                            ]),
                        );
                        programBody.push(call);
                    });
                }

                // Generate code
                const output = generate(ast, { /* options */ }, source);
                const code = output.code;
                // No source map handling here for brevity; you can add output.map if desired.
                return { contents: code, loader: 'js', resolveDir: path.dirname(args.path) };
            });
        },
    };
}

export const esbuildReactRefreshPlugin = createPlugin;