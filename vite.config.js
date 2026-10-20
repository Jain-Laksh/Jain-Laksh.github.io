import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.pdf'],
    },
  },
  // Root domain for Jain-Laksh.github.io
  base: '/',
});
