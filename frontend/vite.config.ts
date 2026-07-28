import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// El proxy de /api evita problemas de CORS en desarrollo: el navegador habla
// siempre con el dev server de Vite y éste reenvía al backend .NET local.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5035',
        changeOrigin: true,
      },
    },
  },
})
