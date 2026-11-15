---
id: site
type: architecture-design
status: active
title: nikitar.dev — personal site
tags: [site]
---

## Goal

A one-page personal site for Nikita Rusetskii: who he is, what he works on now, and a way into his open
source work and photos. It answers "who is this and what does he work on" in one screen and stays out of
the way. Work history and
papers live on LinkedIn and Google Scholar; the site links there instead of repeating them.

## Principles

- **His words.** First-person prose is the owner's own, and the site bio is where it lives. English is his
  second language, so an agent never writes or polishes prose in his voice: it proposes, he decides.
- **Minimal.** One column, a grey interface, grouped lists. A section earns its place; a dormant one is
  removed from the page, not left thin.
- **Contributions over own projects.** Pull requests to other people's repos are the proof of work.
- **Static and free to host.** Everything is prerendered for GitHub Pages. Data that changes is fetched at
  build time and refreshed by a daily rebuild.
- **Nothing private ships.** Photos are downscaled and stripped of metadata before they enter the repo.

## Structure

```text
/          statement, status, links, doors to /oss, /photos   app/pages/index.vue
/photos    all photos, grouped by trip                       app/pages/photos.vue
/oss       every open source pull request                    app/pages/oss.vue
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
5. **Photos: a door on home, all of them on `/photos`** (2026-11). The door shows two featured
   thumbnails and the count. Replaced a featured grid of 3 or 6 that took about half of home. Rejected: a
   "+N" overlay tile (hides a photo), a horizontal scroll strip (awkward with a mouse, breaks the column).
6. **Look: macOS / Hugging Face** (2026-11). System fonts, alpha hairline borders, 12px radius, grouped
   lists, mono metadata. Replaced a Chirpy-derived blog theme.
7. **Open source on its own page, `/oss`** (2026-11): one link to share, with its own title and preview
   card; home shows only counts. Rejected: a subdomain like `oss.nikitar.dev` (GitHub Pages serves
   one domain per repo, so it needs a second repo; a Cloudflare redirect to `/oss` can come later); an
   anchor `/#open-source` (no title or preview card of its own).
8. **The site is the bio's source** (2026-11). The GitHub profile README keeps the work and interests
   sentences and links to `/` and `/oss`; company and location sit in the GitHub sidebar. The status
   pill and its note are `profile.status`, and the README repeats them too. Rejected: the
   full bio in both places (every edit made twice, and it repeated the sidebar).
9. **URLs end with a slash** (2026-11). GitHub Pages serves `oss/index.html` at `/oss/` and 301s `/oss`
   there, so canonical, `og:url`, the sitemap, and every `NuxtLink` use the slash form. Without it Search
   Console listed sitemap URLs as "Page with redirect". Rejected: flat `oss.html` files served at `/oss`
   (the slash URLs Google already indexed would 404).

10. **Home: a statement with doors** (2026-11). The two bio sentences set large, the status, labelled
   links, then one door per section. The PhD and hackathon lines left home: history belongs to LinkedIn
   and a CV page later, so home says only what is true now. Chosen from six directions drawn on a canvas.
   Rejected: a README-like profile with repo cards (the same settings-page look); a man page (mono
   paragraphs read worse, and outside engineering it reads as a joke); a label/value index (read as a
   CV); an activity log of PRs and photos (thin in a quiet month); a bento grid (the most common pattern
   of 2024–26, and fixed slots make a new section a re-layout).

## Invariants

- No runtime server. Anything under `server/` must be prerenderable.
- Photo originals never enter git; published photo files carry no EXIF, XMP, or ICC data.
- MIT covers the source code only. Photos and written content are all rights reserved, as `README.md`
  states. `LICENSE` stays the plain MIT text so GitHub keeps detecting it.
- Colours exist only as tokens in `app/assets/css/main.css`, except the cases [[module-app]] names.
