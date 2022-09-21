import minifyHtml from 'rollup-plugin-minify-html-literals';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import nodeResolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import babel from "rollup-plugin-babel";
import json from '@rollup/plugin-json';

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

  return [
    {
      input: './src/index.ts',
      output: [{
        ...sharedOutput,
        dir: 'dist',
        // file: './dist/index.js',
        format: 'es',
      }],
      plugins: [
        json(),
        nodeResolve({
          browser: true,
        }),
        commonjs({
          transformMixedEsModules: true,
          include: /node_modules/,
          extensions: ['.js', '.node']
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
          ]
        }),
        minifyHtml(),
        esBuildPlugin,
      ],
    },
    // {
    //   input: './src/index.ts',
    //   output: [{
    //     file: './dist/index.umd.js',
    //     format: 'umd',
    //     inlineDynamicImports: true,
    //     ...sharedOutput
    //   }],
    //   plugins: [
    //     minifyHtml(),
    //     nodePolyfills({
    //       include: [
    //         'events',
    //         'https',
    //         'http',
    //         'url',
    //         'zlib',
    //         'path',
    //         'os',
    //         'stream',
    //         'buffer',
    //         'util',
    //         'assert'
    //       ]
    //     }),
    //     nodeResolve({
    //       jsnext: true,
    //       main: true
    //     }),
    //     commonjs({
    //       transformMixedEsModules: true,
    //       include: /node_modules/,
    //     }),
    //     // globals(),
    //     // builtins(),
    //     json(),
    //     // babel({
    //     //   include: 'node_modules/**',
    //     //   presets: [
    //     //     ['@babel/preset-env', {useBuiltIns: 'entry', corejs: 3}]
    //     //   ]
    //     // }),
    //     esBuildPlugin,
    //   ],
    // },
  ];
}

export default createConfig(name);
