/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {InputProfile} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {ReactUi} from './react-ui.tsx';
/* wle:auto-imports:end */

//}

// var prevRefreshReg = window.$RefreshReg$;
// var prevRefreshSig = window.$RefreshSig$;
// var RefreshRuntime = require('react-refresh/runtime');

// function debounce(func, wait) {
//     let timeout;
//     return function (...args) {
//         const context = this;
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(context, args), wait);
//     };
// }


// window.$RefreshReg$ = (type, id) => {
//     // Note module.id is webpack-specific, this may vary in other bundlers
//     const fullId = module.id + ' ' + id;
//     RefreshRuntime.register(type, fullId);
// }
// window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;




export default function (engine) {
    //    try {
    /* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(InputProfile);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(ReactUi);
/* wle:auto-register:end */
    // } finally {
    //     window.$RefreshReg$ = prevRefreshReg;
    //     window.$RefreshSig$ = prevRefreshSig;
    // }

    // const myExports = module.exports;
    // // Note: I think with ES6 exports you might also have to look at .__proto__, at least in webpack

    // if (isReactRefreshBoundary(myExports)) {
    //     module.hot.accept(); // Depends on your bundler

    // }

    // engine.onHotReloadRequest.add(() => {
    //     console.log('HMR: Hot reloading main scene');
    //     RefreshRuntime.performReactRefresh();
    // let enqueueUpdate = debounce(runtime.performReactRefresh, 30);
    // enqueueUpdate();
    //});
}