import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    open: true,
  },
  // Читать .env файлы из корня монорепо
  envDir: path.resolve(__dirname, '../../'),
  envPrefix: 'VITE_',
})

