import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const isDevServer = process.env.NODE_ENV !== 'production'
const exampleName = process.env.EXAMPLE || 'vite-simple'
const isTesting = process.env.VITEST === 'true'

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true }), cssInjectedByJsPlugin()],
  // For dev server, use the specified example's HTML as entry point
  root: isDevServer && !isTesting ? path.resolve(__dirname, `examples/${exampleName}`) : __dirname,
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
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@root': path.resolve(__dirname, './src'),
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@constants': path.resolve(__dirname, './src/constants/'),
      '@context': path.resolve(__dirname, './src/context'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@tests': path.resolve(__dirname, './src/tests'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
})
