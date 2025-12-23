import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  optimizeDeps: {
    include: ['@terrastruct/d2'],
  },
  resolve: {
    alias: {
      '@diagrams': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
