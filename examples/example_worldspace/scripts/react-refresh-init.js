// This file wires the official react-refresh runtime into global scope.
// Place it in your dev-only code and ensure it runs before any module
// that may call $RefreshReg$ / $RefreshSig$.
//
// Usage options:
// 1) Import at the very top of your dev entry (src/main.jsx):
//      import './react-refresh-init';
// 2) Or configure esbuild to inject it (see example below).

import * as RefreshRuntime from 'react-refresh/runtime';

// Attach React Refresh into the global hook that React uses for dev tools:
RefreshRuntime.injectIntoGlobalHook(globalThis);

// Expose the globals that the transforms call:
globalThis.$RefreshReg$ = RefreshRuntime.register;
globalThis.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

// (Optional) export the runtime so other modules can use it directly
export default RefreshRuntime;