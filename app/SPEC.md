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
  `AppHeader` (avatar and name linking home, theme toggle). `photos` lists every group; `oss` lists every
  pull request with a filter by organization; `blog/**` is [[module-blog]].
- **Site data is config, not markup.** Profile, socials, and GitHub settings live in `app/app.config.ts`;
  photos in `app/data/photos.json` ([[module-photos]]). Components read them through `useAppConfig()` and
  `usePhotos()` and never hardcode them.
- **Forbidden:** raw colours outside the token blocks in `assets/css/main.css`, web fonts, and icons
  fetched at runtime. Two colour exceptions: the photo viewer's chrome, which sits on a fixed dark
  backdrop in both themes and uses white with alpha; and the preview card, which copies the light
  tokens as hex because its renderer can't read CSS variables.

## Design system

- **Tokens** (`:root` and `.dark` in `main.css`): `--bg` page and `--surface` groups; `--heading`,
  `--text`, `--text-muted` (secondary, at least 4.5:1) and `--text-tertiary` (decorative only, fails AA);
  alpha borders `--border` (dividers) and `--border-strong` (outlines); `--accent` for the focus ring and
  blog diagrams; `--link-underline`; `--open` and `--merged` for PR state. Blog diagrams read these names
  too, so renaming a token breaks them.
- **Colour:** the interface is grey: text, icons, and links. Colour comes from content (org avatars,
  photos, diagrams) and PR state. A text link keeps its paragraph's colour with a `--link-underline`
  line; on hover it turns `--heading` and the line goes solid. Links styled as rows, buttons, or badges
  set `text-decoration: none`.
- **Type:** the system stack (SF Pro and SF Mono on Apple). The index is 15px; article prose is 17px.
  Weights 400/500/600. Dates and repo names are mono; dates are ISO (`2026-02`).
- **Grouped list** (`.group`, `.group-row`): 12px radius, hairline dividers inset past the leading icon.
  An "All …" row ends a list and links out.
- **PR state** is an icon in the state colour (`ph:git-pull-request` open, `ph:git-merge` merged), with
  the word for screen readers only. `PullRequestRow` is the one row for `/` and `/oss`. On `/` the list
  ends with an "All pull requests" row to `/oss`, with the total in it only when the list is cut.
- **Filter chips** (`/oss`): toggle buttons in the icon-button shape, with the org avatar, `@login`, and a
  mono count. Pressed is a `--heading` border; pressing it again shows all. Chips wrap, never scroll.
- **Icon buttons:** 32px, 8px radius. Icons are Phosphor (`ph:`). A name that comes from data (socials)
  is invisible to the scanner and must be listed in `icon.clientBundle.icons`; static hosting has no
  icon API, so a missing one 404s after client-side navigation.
- **Preview card** (`og:image`): `components/OgImage/Card.vue`, the default for every page. The light
  `--bg`, avatar and `nikitar.dev`, then the page title and its meta description, so the card says what
  the search snippet says. Inter is the only font the renderer has. Local builds reuse rendered cards
  from `node_modules/.cache/nuxt/.nuxt/cache/nuxt-og-image`; delete it to see a change (CI starts clean).
- **Photo grid:** 3:4 tiles, 3 columns from 640px, 2 below. One native `<dialog>` viewer per gallery;
  the arrows walk across groups. Home keeps 3 or 6 featured photos so rows are full.

## Decisions

- **System fonts** (2026-11): nothing to download and native on Apple. Rejected: Source Sans 3 + Lato
  (the old theme), an Inter web font.
- **Own preview card** (2026-11): the stock `NuxtSeo` card had a green gradient the site doesn't use and
  an old tagline. Rejected: the stock card with a grey `theme` (still the stock layout); a card per
  colour mode (link previews show one image).
- **Native `<dialog>` for the viewer** (2026-11): Esc, focus, and an inert page come with it. Rejected: a
  lightbox library.
- **Grey underlined links** (2026-11): blue links in the muted bio paragraphs pulled the eye to the least
  important text, and in light mode blue was about 2:1 against body text with no underline until hover.
  Rejected: blue accent links; a small company logo inline in the bio (the only image in the prose, and
  few people know the logo).
- **PR state as icons, count only when the list is cut** (2026-11): the dot's label was hidden on phones,
  so state was colour only, and a `2 merged · 4 open` header repeated the six rows below it. The total
  sits in the "All N pull requests" row, like "All N photos", because `/oss` shows exactly that many.
  Rejected: dots with labels; icons with tooltips (no hover on touch); `N merged` in the section header
  (replaced by the row once `/oss` existed); a count on the GitHub search link (it also shows closed
  pull requests, so the numbers would not match).
- **Organization filter on `/oss`** (2026-11): one chip per owner, like GitHub's org mentions, ordered by
  count; the subtitle reads "N of M" while one is pressed. Only page state, so the prerendered HTML is the
  full list. Rejected: a section per org (three short lists with a header each); an "All" chip (a pressed
  chip already toggles off); the filter in the URL query (a prerendered page can't read it without a
  hydration mismatch).
