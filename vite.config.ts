import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works at a domain root or under /eurowerks/ on GitHub Pages.
  base: './',
  plugins: [react(), tailwindcss()],
})
