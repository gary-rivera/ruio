import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true }), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/RuioWrapper.tsx'),
      name: 'Ruio',
      fileName: (format) => {
        if (format === 'es') return 'ruio.esm.js'
        if (format === 'cjs') return 'ruio.cjs.js'
        return 'ruio.umd.js'
      },
      formats: ['es', 'cjs', 'umd'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@root': path.resolve(__dirname, './src'),
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
})
