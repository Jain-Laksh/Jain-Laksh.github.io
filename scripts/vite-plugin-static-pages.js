/**
 * Vite plugin (build only): after the app is built, write one HTML file per page and per
 * blog post, each with its own <title>, description, canonical URL and link-preview tags.
 *
 * Why: link previews (LinkedIn, WhatsApp, X, Slack) and many crawlers read the raw HTML and
 * never run JavaScript, so a single index.html would make every link look the same.
 * GitHub Pages serves dist/blog/<slug>/index.html for /blog/<slug>, so every URL also gets a
 * real 200 response instead of a 404. A 404.html copy covers unknown paths, and
 * sitemap.xml + robots.txt help search engines find every post.
 */
import fs from 'node:fs';
import path from 'node:path';
import { readPosts } from './vite-plugin-posts.js';

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`static-pages: index.html is missing ${pattern}`);
  return html.replace(pattern, replacement);
}

function renderPage(template, page) {
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);
  const url = escapeAttr(page.url);
  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, `$1${description}$2`);
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`);
  html = setTag(html, /(<meta property="og:type" content=")[^"]*(")/, `$1${page.type}$2`);
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);

  const extra = [];
  if (page.publishedTime) extra.push(`<meta property="article:published_time" content="${page.publishedTime}" />`);
  (page.tags || []).forEach((t) => extra.push(`<meta property="article:tag" content="${escapeAttr(t)}" />`));
  if (page.noindex) extra.push('<meta name="robots" content="noindex" />');
  if (extra.length) html = html.replace('</head>', `    ${extra.join('\n    ')}\n  </head>`);
  return html;
}

export default function staticPagesPlugin({ siteUrl, siteName, pagesFile, postsDir }) {
  let config;
  const site = siteUrl.replace(/\/+$/, '');
  // GitHub Pages redirects /blog/x to /blog/x/, so the trailing-slash form is canonical
  const urlFor = (route) => (route === '/' ? `${site}/` : `${site}${route}/`);

  return {
    name: 'portfolio-static-pages',
    apply: 'build',

    configResolved(resolved) {
      config = resolved;
    },

    writeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const pages = JSON.parse(fs.readFileSync(path.resolve(config.root, pagesFile), 'utf8'));
      const posts = readPosts(path.resolve(config.root, postsDir));

      const routes = [
        ...Object.entries(pages).map(([route, meta]) => ({
          route,
          title: route === '/' ? meta.title : `${meta.title} | ${siteName}`,
          description: meta.description,
          type: 'website',
        })),
        ...posts.map((post) => ({
          route: `/blog/${post.slug}`,
          title: `${post.title} | ${siteName}`,
          description: post.excerpt || `${post.title}, by ${siteName}.`,
          type: 'article',
          publishedTime: post.date,
          tags: post.tags,
          lastmod: post.date,
        })),
      ];

      for (const page of routes) {
        const html = renderPage(template, { ...page, url: urlFor(page.route) });
        const file = page.route === '/' ? path.join(outDir, 'index.html') : path.join(outDir, page.route, 'index.html');
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }

      // Unknown paths still load the app (which shows the home page) but aren't indexed
      const home = routes.find((r) => r.route === '/');
      fs.writeFileSync(path.join(outDir, '404.html'), renderPage(template, { ...home, url: urlFor('/'), noindex: true }));

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routes.map(
          (r) => `  <url><loc>${urlFor(r.route)}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ''}</url>`
        ),
        '</urlset>',
        '',
      ].join('\n');
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

      this.info?.(`wrote ${routes.length} pages, 404.html, sitemap.xml and robots.txt`);
    },
  };
}
