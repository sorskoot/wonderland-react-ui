/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

import { loadRuntime } from '@wonderlandengine/api';
import RefreshRuntime from 'react-refresh/runtime';
console.log('RefreshRuntime', RefreshRuntime);
RefreshRuntime.injectIntoGlobalHook(globalThis);
// Expose the names the transforms call:
window.$RefreshReg$ = RefreshRuntime.register;
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
/* wle:auto-constants:start */
const Constants = {
    ProjectName: 'ReactUi',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','hand-tracking','hit-test',],
};
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    xrOfferSession: {
        mode: 'auto',
        features: Constants.WebXRRequiredFeatures,
        optionalFeatures: Constants.WebXROptionalFeatures,
    },
    canvas: 'canvas',
};
/* wle:auto-constants:end */

// if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
//     const runtime = require('react-refresh/runtime');
//     runtime.injectIntoGlobalHook(window);
//     window.$RefreshReg$ = () => { };
//     window.$RefreshSig$ = () => type => type;
// }

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
engine.onLoadingScreenEnd.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});
const oldReload = engine._reloadRequest?.bind(engine);
engine._reloadRequest = async function (filename) {
    console.log(`HMR: Reloading due to change in ${filename}`);
    // if (import.meta.hot) {
    //     import.meta.hot.accept(async () => {
    const runtime = await import('react-refresh/runtime');
    //     });
    // }
    let bundleURL = new URL(engine.scene.componentsBundle, document.baseURI);
    let url2 = bundleURL.href.split("?")[0];
    //await engine.registerBundle(url2, true);
    // await engine.scene._initialize()
    // await engine._reload(0)

    await oldReload?.(filename);

    runtime.performReactRefresh();
};
/* WebXR setup. */

function requestSession(mode) {
    engine
        .requestXRSession(mode, Constants.WebXRRequiredFeatures, Constants.WebXROptionalFeatures)
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.setAttribute('data-supported', engine.arSupported.toString());
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.setAttribute('data-supported', engine.vrSupported.toString());
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

/* Load main scene */
try {
    await engine.loadMainScene({ url: `${Constants.ProjectName}.bin`, nocache: true });
} catch (e) {
    console.error(e);
    window.alert(`Failed to load ${Constants.ProjectName}.bin:`, e);
}
/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
