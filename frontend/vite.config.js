import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/DataService': {
        target: 'http://localhost:8080', // replace with your API server URL
        changeOrigin: true
      }
    }
  }
})
