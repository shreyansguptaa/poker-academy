import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/poker-academy/',
  plugins: [
    react(),
    {
      name: 'spa-github-pages-fallback',
      closeBundle() {
        const index = resolve('dist/index.html')
        if (existsSync(index)) copyFileSync(index, resolve('dist/404.html'))
      },
    },
  ],
})
