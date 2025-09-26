import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './frontend',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
    },
  },
  server: {
    port: 3001,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    host: '0.0.0.0',
    allowedHosts: [
      'tokyo-weekender-seo-dashboard.onrender.com',
      'localhost',
      '127.0.0.1',
      '.onrender.com'
    ],
    // Disable proxy in preview mode (production)
    proxy: {},
  },
})
