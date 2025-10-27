import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8081'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- Вот это важно
    },
  }
})
