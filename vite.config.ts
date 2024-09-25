import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/RuioWrapper.tsx'),
      name: 'Ruio',
      fileName: (format) => `ruio.${format}.js`
    },
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
      '@styles': path.resolve(__dirname, './src/styles'),
      '@root': path.resolve(__dirname, './src'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    hmr: {
      overlay: true
    }
  }
})

// TODO: leverage HMR https://stackoverflow.com/questions/70996320/enable-hot-reload-for-vite-react-project-instead-of-page-reload