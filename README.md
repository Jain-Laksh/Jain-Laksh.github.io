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
  - Interactive Visitor Traffic map & real-time counter
  - Rotating random thought/quote widget
- **Research Tab**: Research interests with custom icons, research background narrative, searchable & tag-filterable publication catalog (paper, code, and slide links), and a collaboration CTA.
- **Projects Tab**: Square grid cards with GitHub about-section tags, GitHub repo links, live demo links, and report links. Searchable and filterable.
- **Work Experience Tab**: Vertical timeline detailing companies, roles, time periods, locations, bullet points, tags, and photo gallery support.
- **Posts/Blogs Tab**:
  - Grouped by year descending and sorted by date descending.
  - Tag filtering and search bar.
  - Dedicated post reader (`/blog/:slug`) with Table of Contents sidebar, reading time, and share button.
  - Powered by Markdown (`react-markdown` + GitHub flavored markdown support).
- **Connect/CV Tab**:
  - Direct social links (Email, GitHub, LinkedIn, Google Scholar, X/Twitter, Instagram).
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
The project is pre-configured with `gh-pages` and `HashRouter` for zero-configuration GitHub Pages hosting:
1. In `vite.config.js`, set `base: '/<your-repo-name>/'` (or `'/'` if your repo is `username.github.io`).
2. Run:
```bash
npm run deploy
```

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
| `src/data/posts.json` | Blog post metadata (slug, title, date, excerpt, tags) |

### Adding a New Blog Post:
1. Create a markdown file: `public/posts/my-new-post.md`.
2. Add an entry to `src/data/posts.json` with matching `slug: "my-new-post"`.
3. That's it! It will appear on your blog page automatically.

### Updating Your Resume:
Replace `public/cv.pdf` with your actual CV PDF.

### Updating Your Photo:
Drop your photo into `public/images/profile.jpg` (or `.png`/`.svg`) and update `profileImage` in `src/data/profile.json`.
