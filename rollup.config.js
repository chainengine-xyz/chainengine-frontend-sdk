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

  const esbuildPlugin = esbuild({
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
      plugins: [
        minifyHtml(),
        esbuildPlugin,
      ],
      output: [{ file: './dist/index.js', format: 'es', ...sharedOutput }],
    },
    {
      input: './src/index.ts',
      plugins: [
        minifyHtml(),
        // nodeResolve({ browser: true, preferBuiltins: true }),
        nodeResolve({
          jsnext: true,
          main: true,
          module: true
        }),
        commonjs({
          transformMixedEsModules: true,
          include: 'node_modules/**',
          browser: true,
          preferBuiltins: false,
          ignoreGlobal: false,
          sourceMap: false
        }),
        globals(),
        builtins(),
        json(),
        babel({
          exclude: 'node_modules/**',
          presets: [
            ['@babel/preset-env', {useBuiltIns: 'entry', corejs: 3}]
          ]
        }),
        esbuildPlugin,
        nodePolyfills({
          include: ['node_modules/**/*.js']
        }),
      ],
      output: [{
        file: './dist/index.umd.js',
        format: 'umd',
        inlineDynamicImports: true,
        ...sharedOutput
      }],
    },
  ];
}

export default createConfig(name);
