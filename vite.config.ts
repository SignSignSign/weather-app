import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 部署路径为 /<仓库名>/
  base: '/weather-app/',
  plugins: [react()],
})
