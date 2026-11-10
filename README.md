# Personal Portfolio Website

A modern, responsive portfolio website built with **React 18**, **Vite**, and **Vanilla CSS**. Tailored for an AI Researcher and Software Engineer at IIT Gandhinagar, featuring a pastel theme with glassmorphism, smooth animations, and full dark/light mode support.

---

## 🌟 Highlights & Features

- **Theme Switcher**: Seamless toggle between Light (pastel lavender/mint/peach) and Dark (deep navy/slate) modes, saved to `localStorage`.
- **Home Tab**:
  - Hero introduction with social links & CTAs
  - About section with avatar and skill tags
  - Work experience summary (company & period)
  - Recent News feed with link to full archive (`/news`)
  - Featured peer-reviewed publications
  - Featured engineering projects
  - Achievements and honors
  - Rotating random thought/quote widget
- **Research Tab**: Research interests with custom icons, research background narrative, searchable & tag-filterable publication catalog (paper, code, and slide links), and a collaboration CTA.
- **Projects Tab**: Square grid cards with GitHub about-section tags, GitHub repo links, live demo links, and report links. Searchable and filterable.
- **Work Experience Tab**: Vertical timeline detailing companies, roles, time periods, locations, bullet points, tags, and photo gallery support.
- **Posts/Blogs Tab**:
  - Grouped by year descending and sorted by date descending.
  - Tag filtering and search bar.
  - Dedicated post reader (`/blog/:slug`) with table of contents, automatic reading time, likes, views, and share button.
  - Powered by Markdown (`react-markdown` + GitHub flavored markdown support).
- **Connect/CV Tab**:
  - Email (personal and college, with copy buttons) and social links (GitHub, LinkedIn, Google Scholar, X/Twitter, Instagram).
  - Embedded PDF CV viewer with one-click download and new tab viewer, plus an interactive web resume fallback.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to GitHub Pages
Push to `main`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and publishes it to https://jain-laksh.github.io.

The site uses clean URLs (`/blog/my-post`, not `/#/blog/my-post`). The build writes a separate HTML file for every page and post, each with its own title, description and link-preview image, plus `404.html`, `sitemap.xml` and `robots.txt`. Old `/#/...` links redirect automatically. To preview the production build locally, run `npm run build` then `npm run preview`.

If the site's address changes, update `SITE_URL` in `vite.config.js` and the URLs in `index.html`. Page titles and descriptions live in `src/data/pages.json`; the link-preview image is `public/og-image.png` (1200×630).

---

## 📁 How to Update Your Content

All data is decoupled into simple JSON files under `src/data/`. You never need to touch complex React code to update your profile:

| File | What to Update |
|---|---|
| `src/data/profile.json` | Name, title, university, bio, social links, research interests |
| `src/data/publications.json` | Paper titles, authors, venues, links to arXiv/PDF/code/slides |
| `src/data/projects.json` | Project names, descriptions, GitHub repo URLs, demo links |
| `src/data/workExperience.json` | Companies, roles, dates, locations, highlights, photos |
| `src/data/news.json` | Recent milestone announcements and dates |
| `src/data/achievements.json` | Honors, awards, and competitions |
| `src/data/quotes.json` | Inspirational quotes & thoughts |
| `public/posts/*.md` | Blog posts — each file holds its own title, date, tags and excerpt (see below) |

### Adding a New Blog Post:
Create one file, `public/posts/my-new-post.md`. The file name becomes the URL (`/blog/my-new-post`), so use lowercase words separated by hyphens. Start it with a frontmatter block:

```markdown
---
title: Company — Role Interview Experience
date: 2026-11-20
tags: [Interviews, Software Engineering]
excerpt: One or two sentences shown on the Posts page.
---

> Your post starts here. Don't repeat the title or date; the page shows them.

## First section
```

- `date` is written once, as `YYYY-MM-DD`; the year grouping, sort order and "Published" date all come from it.
- Reading time is calculated from the word count, so there's nothing to update when you edit a post.
- Add `draft: true` to see a post in `npm run dev` without publishing it.
- If a required field is missing or the date is invalid, `npm run build` stops with a message naming the file, so a broken post can't be deployed.
- Images go in `public/images/` and are referenced as `![Alt text](/images/photo.jpg)`.

### Likes & Views
Likes and views use the free [Abacus](https://abacus.jasoncameron.dev) counter API (see `src/hooks/usePostLikes.js` for how edge cases are handled). They only count on the deployed site — opening posts on `localhost` reads the live numbers but never changes them.

### Updating Your Resume:
Replace `public/cv.pdf` with your actual CV PDF.

### Updating Your Photo:
Drop your photo into `public/images/profile.jpg` (or `.png`/`.svg`) and update `profileImage` in `src/data/profile.json`.
