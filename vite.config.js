import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Clé API PrestaShop en base64
const apiKey = 'bxC84VD4fbTzndsNPHWDiCOi1ZWkhyDh'
const authHeader = 'Basic ' + Buffer.from(apiKey + ':').toString('base64')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/EVAL',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/img': {
        target: 'http://localhost/EVAL',
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', authHeader)
          })
        }
      }
    }
  }
})
