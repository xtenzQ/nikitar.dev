---
id: architecture
type: architecture-design
status: draft
title: nikitar.dev — architecture
parent: goal-and-requirements
tags: [architecture]
---

## Topology

A Nuxt 4 app, prerendered to static files and served by GitHub Pages at `nikitar.dev`. Nothing runs on a
server after the build.

- [[module-app]]: pages, layouts, components, and the site data (`app/app.config.ts`, `app/data/`). Three
  parts have their own spec: [[submodule-app-design]] (tokens and shared look),
  [[submodule-app-transitions]] (page transitions), and [[submodule-app-cv]] (the CV and its PDF).
- [[module-contributions]]: Nitro routes that read GitHub while pages prerender.
- [[module-photos]]: a local macOS pipeline that turns originals into WebP files and
  `app/data/photos.json`.
- [[module-blog]]: Nuxt Content posts, dormant.
- [[module-deploy]]: the GitHub Actions build, the CV print, and the daily rebuild.

Edges: [[module-app]] renders the output of [[module-contributions]], [[module-photos]], and
[[module-blog]]. [[module-contributions]] reads its hide list from `app/app.config.ts`. Blog diagrams read
the [[submodule-app-design]] tokens. [[module-deploy]] runs the build, then the CV print.

## Build

- Prerender starts from `/`, `/photos`, `/oss`, and `/cv`, listed in `nuxt.config.ts`: `/` links `/oss`
  only when GitHub answered. Links with `utm_` parameters are skipped; they are the same pages.
- The link checker runs during prerender; a failing page fails the build. It skips the CV PDF, which
  [[submodule-app-cv]] writes after the build.

## Decisions

1. **URLs end with a slash** (2026-11). GitHub Pages serves `oss/index.html` at `/oss/` and 301s `/oss`
   there, so canonical, `og:url`, the sitemap, schema.org `url`s, and every `NuxtLink` use the slash form.
   Without it Search Console listed sitemap URLs as "Page with redirect". Rejected: flat `oss.html` files
   served at `/oss` (the slash URLs Google already indexed would 404).
   The sitemap lists only images on `nikitar.dev` (`server/plugins/sitemap.ts`): GitHub avatars and org
   logos are not ours to index, and the module mangled their URLs (`/?s=168&amp;amp;v=4`). The preset's
   SPA fallback `/200.html` is `noindex`. Rejected: `discoverImages: false` (drops the photos too).
2. **Visit counts: Umami Cloud** (2026-11). One script in `nuxt.config.ts`, free plan, EU data region.
   It sets no cookies, so there is no consent banner. `data-domains` limits it to `nikitar.dev`, so local
   previews and forks send nothing. Clicks on Open PDF and the socials are events (`data-umami-event`,
   named after the link). Links back to the site from the CV PDF and the GitHub profile README carry
   `utm_source` (`cv-pdf`, `github`): a PDF and mobile apps send no referrer, and GitHub sends only its
   domain. Rejected: Google Analytics 4 and Yandex Metrica (cookies need a consent banner for EU
   visitors; a heavy script); Cloudflare Web Analytics (page views only, no events).

## Invariants

- No runtime server. Anything under `server/` must be prerenderable.
- Photo originals never enter git, and published photos carry no metadata ([[module-photos]]).
- MIT covers the source code only. Photos and written content are all rights reserved, as `README.md`
  states. `LICENSE` stays the plain MIT text so GitHub keeps detecting it.
- Colours exist only as tokens in `app/assets/css/main.css`, except the cases [[submodule-app-design]]
  names.
