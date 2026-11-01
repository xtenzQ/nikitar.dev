---
id: site
type: architecture-design
status: active
title: nikitar.dev — personal site
tags: [site]
---

## Goal

A one-page personal site for Nikita Rusetskii: who he is, what he contributes to, and a few photos. It
answers "who is this and what does he work on" in one screen and stays out of the way. Work history and
papers live on LinkedIn and Google Scholar; the site links there instead of repeating them.

## Principles

- **His words.** First-person prose is the owner's own; the bio is his GitHub profile README. English is
  his second language, so an agent never writes or polishes prose in his voice: it proposes, he decides.
- **Minimal.** One column, one accent, grouped lists. A section earns its place; a dormant one is removed
  from the page, not left thin.
- **Contributions over own projects.** Pull requests to other people's repos are the proof of work.
- **Static and free to host.** Everything is prerendered for GitHub Pages. Data that changes is fetched at
  build time and refreshed by a daily rebuild.
- **Nothing private ships.** Photos are downscaled and stripped of metadata before they enter the repo.

## Structure

```text
/          bio, open source pull requests, featured photos   app/pages/index.vue
/photos    all photos, grouped by trip                       app/pages/photos.vue
/blog/**   dormant blog, reachable by URL only               content/
/about     redirects to /                                    nuxt.config.ts routeRules
```

Modules: [[module-app]] (pages, components, design system), [[module-contributions]] (build-time GitHub
data), [[module-photos]] (photo pipeline and data), [[module-blog]] (posts), [[module-deploy]] (CI).

## Decisions

1. **One-page index** (2026-11). Rejected: blog-first (one post, out of date); a feed like
   my-contributions.nuxt.dev (most merged PRs are to his own repos, so an external-only merged feed is a
   few rows); a research "lab page" (the research is in the past).
2. **No About page** (2026-11). It repeated LinkedIn and Scholar and needed prose in his voice. `/about`
   redirects to `/` so old links keep working.
3. **No Projects or Writing sections on home** (2026-11). Personal repos aren't maintained and the blog is
   dormant ([[module-blog]]).
4. **Employment history stays on LinkedIn.** The site names only the current employer, in the bio.
5. **Photos: a featured set on home, the rest on `/photos`** (2026-11). Rejected: a "+N" overlay tile
   (hides a photo), a horizontal scroll strip (awkward with a mouse, breaks the column).
6. **Look: macOS / Hugging Face** (2026-11). System fonts, alpha hairline borders, 12px radius, grouped
   lists, mono metadata. Replaced a Chirpy-derived blog theme.

## Invariants

- No runtime server. Anything under `server/` must be prerenderable.
- Photo originals never enter git; published photo files carry no EXIF, XMP, or ICC data.
- Colours exist only as tokens in `app/assets/css/main.css` ([[module-app]]).
