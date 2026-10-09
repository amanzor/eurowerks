import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

// The root HTML pages carry a small redirect so that GitHub Pages, which serves this
// branch's root, sends visitors to the built site in docs/. Built pages must not redirect.
function stripPagesRedirect(): Plugin {
  return {
    name: 'strip-pages-redirect',
    apply: 'build',
    transformIndexHtml: (html) => html.replace(/\s*<script data-pages-redirect>[\s\S]*?<\/script>/, ''),
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works at a domain root, under /eurowerks/ or under /eurowerks/docs/.
  base: './',
  // Built output is committed to docs/ so GitHub Pages can serve it straight from this branch.
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: { input: { main: 'index.html', gallery: 'gallery.html' } },
  },
  plugins: [react(), tailwindcss(), stripPagesRedirect()],
})
