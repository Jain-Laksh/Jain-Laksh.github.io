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
  // Relative base works automatically on both username.github.io and username.github.io/<repo-name>
  base: process.env.BASE_URL || './',
});
