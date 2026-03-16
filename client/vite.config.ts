import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api-proxy': {
        target: 'https://preprodapisix.omnenest.com',
        changeOrigin: true,
        // This removes '/api-proxy' before sending it to the server
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
      },
    },
  },
});