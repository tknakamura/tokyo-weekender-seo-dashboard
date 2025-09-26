import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production'
  const isPreview = command === 'serve' && process.env.PORT
  const isBuild = command === 'build'
  
  console.log('Vite Config - Mode:', mode, 'Command:', command, 'NODE_ENV:', process.env.NODE_ENV, 'IsProduction:', isProduction, 'IsPreview:', isPreview, 'IsBuild:', isBuild)
  
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
      // Only enable proxy in development mode (not production, preview, or build)
      ...(isProduction || isPreview || isBuild ? {} : {
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
      proxy: {},
    },
    build: {
      outDir: '../dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild', // terserより高速でメモリ効率が良い
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['chart.js', 'react-chartjs-2', 'd3'],
          },
          // Force cache busting
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000, // チャンクサイズの警告を調整
    },
  }
})
