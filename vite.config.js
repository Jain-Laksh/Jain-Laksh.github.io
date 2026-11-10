import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import postsPlugin from './scripts/vite-plugin-posts.js';
import staticPagesPlugin from './scripts/vite-plugin-static-pages.js';

const SITE_URL = 'https://jain-laksh.github.io';
const CV_FILE = 'public/cv.pdf';

/** Date the CV was last changed: its last git commit, else the file's modified time. */
function cvUpdatedDate() {
  try {
    const date = execSync(`git log -1 --format=%cs -- ${CV_FILE}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch {
    /* not a git checkout */
  }
  try {
    return fs.statSync(CV_FILE).mtime.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    postsPlugin({ dir: 'public/posts' }),
    staticPagesPlugin({
      siteUrl: SITE_URL,
      siteName: 'Laksh Jain',
      pagesFile: 'src/data/pages.json',
      postsDir: 'public/posts',
    }),
  ],
  define: {
    'import.meta.env.VITE_CV_UPDATED': JSON.stringify(cvUpdatedDate()),
  },
  server: {
    watch: {
      ignored: ['**/*.pdf'],
    },
  },
  // Root domain for Jain-Laksh.github.io
  base: '/',
});
