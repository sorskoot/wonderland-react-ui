import * as esbuild from 'esbuild';
import { esbuildReactRefreshPlugin } from './plugins/esbuild-react-refresh.js';

esbuild.build({
    entryPoints: ['js/index.js'],
    bundle: true,
    outfile: 'dist/ReactUi-bundle.js',
    sourcemap: true,
    inject: ['scripts/react-refresh-init.js'],
    //plugins: [esbuildReactRefreshPlugin()],
    minify: false,
})

