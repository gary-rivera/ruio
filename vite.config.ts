import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
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
})

// TODO: leverage HMR https://stackoverflow.com/questions/70996320/enable-hot-reload-for-vite-react-project-instead-of-page-reload