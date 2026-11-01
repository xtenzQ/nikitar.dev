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
- The build needs no secret beyond `GITHUB_TOKEN`.
