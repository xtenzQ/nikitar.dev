---
id: module-app
type: module-design
status: active
title: Pages, components, and design system
parent: site
depends-on: [module-contributions, module-photos, module-blog]
tags: [ui, design-system]
---

## Responsibility

The Nuxt app: pages, the default layout, components, and the design system they share.

## Boundary

- **Pages.** `index` (bio, open source, featured photos) has no header bar; every other page gets
  `AppHeader` (avatar and name linking home, theme toggle). `photos` lists every group; `blog/**` is
  [[module-blog]].
- **Site data is config, not markup.** Profile, socials, and GitHub settings live in `app/app.config.ts`;
  photos in `app/data/photos.json` ([[module-photos]]). Components read them through `useAppConfig()` and
  `usePhotos()` and never hardcode them.
- **Forbidden:** raw colours outside the token blocks in `assets/css/main.css`, web fonts, and icons
  fetched at runtime. The one colour exception is the photo viewer's chrome, which sits on a fixed dark
  backdrop in both themes and uses white with alpha.

## Design system

- **Tokens** (`:root` and `.dark` in `main.css`): `--bg` page and `--surface` groups; `--heading`,
  `--text`, `--text-muted` (secondary, at least 4.5:1) and `--text-tertiary` (decorative only, fails AA);
  alpha borders `--border` (dividers) and `--border-strong` (outlines); one `--accent`; `--open` and
  `--merged` for PR state. Blog diagrams read these names too, so renaming a token breaks them.
- **Type:** the system stack (SF Pro and SF Mono on Apple). The index is 15px; article prose is 17px.
  Weights 400/500/600. Dates and repo names are mono; dates are ISO (`2026-02`).
- **Grouped list** (`.group`, `.group-row`): 12px radius, hairline dividers inset past the leading icon.
  An "All …" row ends a list and links out.
- **Icon buttons:** 32px, 8px radius. Icons are Phosphor (`ph:`). A name that comes from data (socials)
  is invisible to the scanner and must be listed in `icon.clientBundle.icons`; static hosting has no
  icon API, so a missing one 404s after client-side navigation.
- **Photo grid:** 3:4 tiles, 3 columns from 640px, 2 below. One native `<dialog>` viewer per gallery;
  the arrows walk across groups. Home keeps 3 or 6 featured photos so rows are full.

## Decisions

- **System fonts** (2026-11): nothing to download and native on Apple. Rejected: Source Sans 3 + Lato
  (the old theme), an Inter web font.
- **Native `<dialog>` for the viewer** (2026-11): Esc, focus, and an inert page come with it. Rejected: a
  lightbox library.
