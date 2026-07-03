import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En GitHub Pages el base se toma de VITE_BASE_PATH (ej. '/abet-dashboard/')
// En local queda './' automáticamente
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? './',
})
