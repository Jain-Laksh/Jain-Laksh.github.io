/**
 * Vite plugin: builds the blog post index from the Markdown files themselves.
 *
 * Each post is one file, `public/posts/<slug>.md`, starting with a frontmatter block:
 *
 *   ---
 *   title: My Post Title
 *   date: 2026-10-09
 *   tags: [Interviews, Software Engineering]
 *   excerpt: One or two sentences shown on the Posts page.
 *   draft: true            (optional — hidden from production builds)
 *   ---
 *
 * The slug comes from the file name, the year from the date, and the reading time
 * from the word count, so nothing has to be kept in sync by hand.
 * Import the index anywhere with `import posts from 'virtual:posts'`.
 */
import fs from 'node:fs';
import path from 'node:path';

const VIRTUAL_ID = 'virtual:posts';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const WORDS_PER_MINUTE = 150; // technical writing reads slower than prose

const FRONTMATTER_RE = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

function parseValue(raw) {
  let v = raw.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
}

export function parseFrontmatter(raw, file = 'post') {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`${file}: missing frontmatter block (--- ... ---) at the top of the file`);
  }
  const meta = {};
  match[1].split(/\r?\n/).forEach((line, idx) => {
    if (!line.trim() || line.trim().startsWith('#')) return;
    const colon = line.indexOf(':');
    if (colon === -1) {
      throw new Error(`${file}: frontmatter line ${idx + 2} is not "key: value" → "${line}"`);
    }
    meta[line.slice(0, colon).trim()] = parseValue(line.slice(colon + 1));
  });
  return { meta, body: raw.slice(match[0].length) };
}

function countWords(markdown) {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/<[^>]+>/g, ' ') // html tags
    .replace(/[#>*_`|~-]+/g, ' ');
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.+-]*/gu) || []).length;
}

function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function readPosts(dir, { includeDrafts = false } = {}) {
  if (!fs.existsSync(dir)) return [];
  const posts = [];

  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md')) continue;
    const slug = name.slice(0, -3);
    const file = `public/posts/${name}`;

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`${file}: file name must be lowercase words separated by hyphens (it becomes the URL)`);
    }

    const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(dir, name), 'utf8'), file);

    if (!meta.title || typeof meta.title !== 'string') throw new Error(`${file}: "title" is required`);
    if (!isValidDate(meta.date)) throw new Error(`${file}: "date" must be a real date written as YYYY-MM-DD`);
    if (meta.tags !== undefined && !Array.isArray(meta.tags)) {
      throw new Error(`${file}: "tags" must be a list like [Interviews, Research]`);
    }
    if (meta.draft === true && !includeDrafts) continue;

    const words = countWords(body);
    posts.push({
      slug,
      title: meta.title,
      date: meta.date,
      year: Number(meta.date.slice(0, 4)),
      tags: meta.tags || [],
      excerpt: typeof meta.excerpt === 'string' ? meta.excerpt : '',
      readMinutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
      draft: meta.draft === true,
    });
  }

  // Newest first; ties broken by title so the order is stable
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export default function postsPlugin({ dir = 'public/posts' } = {}) {
  let postsDir;
  let isBuild = false;

  return {
    name: 'portfolio-posts',

    configResolved(config) {
      postsDir = path.resolve(config.root, dir);
      isBuild = config.command === 'build';
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;
      if (fs.existsSync(postsDir)) {
        fs.readdirSync(postsDir)
          .filter((n) => n.endsWith('.md'))
          .forEach((n) => this.addWatchFile(path.join(postsDir, n)));
      }
      const posts = readPosts(postsDir, { includeDrafts: !isBuild });
      return `export default ${JSON.stringify(posts)};`;
    },

    configureServer(server) {
      server.watcher.add(postsDir);
      const onChange = (file) => {
        const abs = path.resolve(file);
        if (!abs.startsWith(postsDir) || !abs.endsWith('.md')) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', onChange);
      server.watcher.on('change', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}
