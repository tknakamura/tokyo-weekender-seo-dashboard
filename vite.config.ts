import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production'
  
  return {
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
      // Only enable proxy in development mode
      ...(isProduction ? {} : {
        proxy: {
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
          },
        },
      }),
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
      // Explicitly disable proxy in preview mode
      proxy: undefined,
    },
  }
})
