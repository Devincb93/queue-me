import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      '/customers': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
