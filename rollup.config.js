// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'index.js', // your entry point
  output: {
    file: 'dist/fujin-kit-lib.min.js',
    format: 'iife', // for use in <script src="...">
    name: 'FujinKit',
  },
  plugins: [resolve(), commonjs()],
};
