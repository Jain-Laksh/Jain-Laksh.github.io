import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postsPlugin from './scripts/vite-plugin-posts.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), postsPlugin({ dir: 'public/posts' })],
  server: {
    watch: {
      ignored: ['**/*.pdf'],
    },
  },
  // Root domain for Jain-Laksh.github.io
  base: '/',
});
