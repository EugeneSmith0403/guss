import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@guss/shared': path.resolve(__dirname, '../../shared'),
      '@shared/config': path.resolve(__dirname, '../../shared/config'),
    },
  },
  server: {
    port: 8080,
    open: true,
  },
})

