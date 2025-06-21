
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    [react()],
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Your Express backend URL
    },
  },
})
