---
id: module-deploy
type: module-design
status: active
title: Build and deploy to GitHub Pages
parent: architecture
references: [module-contributions, submodule-app-cv]
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
- CV PDF: after the build the workflow installs `fonts-inter` and runs the CV print
  ([[submodule-app-cv]]). SF Pro is Apple-only, and Inter is next in the font stack. A missing package is
  a warning, not a failed deploy.
- The build needs no secret beyond `GITHUB_TOKEN`.
- "Enforce HTTPS" is on in the repo's Pages settings, outside this repo's files. While it was off,
  `http://` answered 200 and Google indexed `http://nikitar.dev/oss`.
