import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative paths, so the same build works locally and on GitHub Pages
  // (https://<user>.github.io/leaflet-compare/).
  base: './',
})
