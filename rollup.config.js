import minifyHtml from 'rollup-plugin-minify-html-literals';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// eslint-disable-next-line import/no-named-as-default
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';

import { name } from './package.json';

function createConfig(packageName) {
  const sharedOutput = {
    exports: 'named',
    name: packageName,
    sourcemap: true,
  };

  const esBuildPlugin = esbuild({
    minify: true,
    tsconfig: './tsconfig.json',
    platform: 'browser',
    treeShaking: true,
    loaders: {
      '.json': 'json',
    },
  });

  // https://rollupjs.org/guide/en/#outputdir
  return [
    {
      input: './src/index.ts',
      output: [
        {
          ...sharedOutput,
          dir: 'dist',
        },
        {
          ...sharedOutput,
          file: './dist/index.umd.js',
          inlineDynamicImports: true,
          format: 'umd',
        },
      ],
      plugins: [
        json(),
        nodeResolve({
          browser: true,
        }),
        commonjs({
          transformMixedEsModules: true,
          include: /node_modules/,
          extensions: ['.js', '.node'],
        }),
        nodePolyfills({
          include: [
            'events',
            'https',
            'http',
            'url',
            'zlib',
            'path',
            'os',
            'stream',
            'buffer',
            'util',
          ],
        }),
        esBuildPlugin,
        minifyHtml(),
        image({ dom: true }),
      ],
    },
  ];
}

export default createConfig(name);
