---
id: module-deploy
type: module-design
status: active
title: Build and deploy to GitHub Pages
parent: site
references: [module-contributions]
tags: [ci]
---

## Responsibility

`workflows/deploy.yml` builds the static site and publishes it to GitHub Pages at `nikitar.dev`
(custom domain from `public/CNAME`).

## Boundary

- Triggers: a push to `master`, a manual run, and a daily run at 06:00 UTC that refreshes
  [[module-contributions]].
- Build: `nuxt build --preset github_pages` with `NUXT_GITHUB_TOKEN` set to the workflow's
  `GITHUB_TOKEN`; `.output/public` is the Pages artifact.
- CV PDF: `scripts/cv-pdf.mjs` (`pnpm cv:pdf`) then prints the prerendered `/cv/` with the runner's
  Chrome through `playwright-core` and writes the file named in `app/data/cv.json` next to the site. It
  opens the page at the real origin and serves it from disk, so relative links become full URLs in the
  PDF, and it logs the page count. Requests to other origins are aborted, so the print never loads the
  Umami script and counts no visit. The runner installs `fonts-inter`: SF Pro is Apple-only, and Inter is
  next in the font stack. A missing package is a warning, not a failed deploy.
- The build needs no secret beyond `GITHUB_TOKEN`.
- "Enforce HTTPS" is on in the repo's Pages settings, outside this repo's files. While it was off,
  `http://` answered 200 and Google indexed `http://nikitar.dev/oss`.

## Decisions

- **CV PDF at build time** (2026-11): one file for everyone, with real text and links, refreshed by the
  daily rebuild. Rejected: `window.print()` behind the button (a print dialog, browser headers and
  footers, poor on phones); a PDF made by hand (drifts from the page); downloading Chromium for
  Playwright (the runner already has Chrome).
