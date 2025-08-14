import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/react-lari-converter/', // для GitHub Pages (repo name)
  build: { outDir: 'build' }, // чтобы gh-pages -d build нашёл каталог
  plugins: [react(), tailwindcss()],
})
