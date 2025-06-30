import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const createConfig = (input, output, format) => ({
  input,
  output: {
    file: output,
    format,
    sourcemap: true,
    exports: 'auto'
  },
  plugins: [
    resolve({
      browser: format === 'es',
      preferBuiltins: format === 'cjs'
    }),
    typescript({
      declaration: false,
      outDir: './dist',
      rootDir: './src'
    }),
    terser({
      compress: {
        drop_console: true
      },
      mangle: true
    })
  ],
  external: ['@noble/hashes/scrypt', '@noble/hashes/utils']
});

export default [
  // Main bundle (ESM)
  createConfig('src/index.ts', 'dist/index.js', 'es'),
  
  // Main bundle (CommonJS)
  createConfig('src/index.ts', 'dist/index.cjs', 'cjs'),
  
  // Node.js specific (ESM)
  createConfig('src/node.ts', 'dist/node.js', 'es'),
  
  // Node.js specific (CommonJS)
  createConfig('src/node.ts', 'dist/node.cjs', 'cjs'),
  
  // Browser specific (ESM)
  createConfig('src/browser.ts', 'dist/browser.js', 'es'),
  
  // Browser specific (CommonJS for compatibility)
  createConfig('src/browser.ts', 'dist/browser.cjs', 'cjs')
];