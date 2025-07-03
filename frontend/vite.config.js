import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Jangan rewrite path, biarkan /api tetap ada
      },
      '/authentications': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/authentications/, '/api/authentications'),
      },
      '/users': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/users/, '/api/users'),
      },
      '/complaints': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/complaints/, '/api/complaints'),
      },
      '/subjects': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/subjects/, '/api/subjects'),
      },
      '/classes': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/classes/, '/api/classes'),
      },
    },
  },
});
