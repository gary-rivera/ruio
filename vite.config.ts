import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({ typescript: true }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/RuioWrapper.tsx'), // Adjust the entry point if necessary
      name: 'Ruio', // Name for the global variable in UMD builds
      fileName: (format) => {
        if (format === 'es') return 'ruio.esm.js' // Ensure ES module file name
        if (format === 'cjs') return 'ruio.cjs.js' // Ensure CJS file name
        return 'ruio.umd.js' // Fallback for UMD builds
      },
      formats: ['es', 'cjs', 'umd'], // Specify the formats you want to build
    },
    cssCodeSplit: false, // Required for css-injected-by-js plugin
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@root': path.resolve(__dirname, './src'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});