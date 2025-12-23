import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['@terrastruct/d2'],
  },
})
