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

- **Pages.** `index` is the statement, the status, links, and doors. Every page but `cv` gets
  `AppHeader` (avatar, name, theme toggle); on `/` the name is the page's `h1`, elsewhere it links home.
  `photos` lists every group; `oss` lists every pull request, grouped by project; `blog/**` is
  [[module-blog]]. `cv` is the CV with an Open PDF link (a new tab); it uses the `cv` layout (a "nikitar.dev / cv"
  breadcrumb and the theme toggle), because its `h1` is the name: the avatar sits beside it, and the
  header's avatar and name grow into them on the way in.
- **Site data is config, not markup.** Profile (with the status), socials, and GitHub settings live in
  `app/app.config.ts`; photos in `app/data/photos.json` ([[module-photos]]); the CV in
  `app/data/cv.json`. Components read them through `useAppConfig()`, `usePhotos()`, and `useCv()` and
  never hardcode them. Open source counts and the CV's notable pull requests come from
  [[module-contributions]], so a notable one that is hidden or missing just isn't shown.
- **Click events.** Open PDF and every socials link carry `data-umami-event`, which Umami counts
  ([[site]] decision 12). A new link to a profile or file gets one too.
- **Forbidden:** raw colours outside the token blocks in `assets/css/main.css`, web fonts, and icons
  fetched at runtime. Three colour exceptions: the photo viewer's chrome, which sits on a fixed dark
  backdrop in both themes and uses white with alpha; the preview card, which copies the light tokens as
  hex because its renderer can't read CSS variables; and the favicons in `public/`, which a browser
  draws without the page's CSS, so they copy `--heading` and `--bg` as hex.

## Design system

- **Tokens** (`:root` and `.dark` in `main.css`): `--bg` page and `--surface` groups; `--heading`,
  `--text`, `--text-muted` (secondary, at least 4.5:1) and `--text-tertiary` (decorative only, fails AA);
  alpha borders `--border` (dividers) and `--border-strong` (outlines); `--accent` for the focus ring and
  blog diagrams; `--link-underline`; `--open` and `--merged` for PR state. Blog diagrams read these names
  too, so renaming a token breaks them. A print block resets them to light on white, with rules a
  little darker, so printing in dark mode still gives a light page.
- **Colour:** the interface is grey: text, icons, and links. Colour comes from content (org avatars,
  photos, diagrams) and PR state. A text link keeps its paragraph's colour with a `--link-underline`
  line; on hover it turns `--heading` and the line goes solid. Links styled as rows, buttons, or badges
  set `text-decoration: none`.
- **Type:** the system stack (SF Pro and SF Mono on Apple). The index is 15px; article prose is 17px.
  Weights 400/500/600. Dates and repo names are mono; dates are ISO (`2026-02`).
- **Statement** (`/`): the two bio sentences at 22–28px, weight 500, the first in `--heading` and the
  second in `--text-muted`. It is the largest text on the site; a future post title can reuse it.
- **Status pill:** `StatusPill`, `profile.status.label` with a still `--open` dot. `/` follows it with
  the note in `--text-muted`; `/cv` with the links.
- **CV** (`/cv`): one column on the grey page. The name has the 56px avatar beside it, the header's
  pair at CV size; the PDF leaves the avatar out. Section labels are 13px 600 in `--heading`, heavier than
  `.section-label`, because a reader scans a CV by section. Experience is a timeline: a circle with
  the company's monogram, a line down to the next one, and a dot per role when a company has more than
  one (filled for the current role). Dates read "May 2026 – now", not ISO: recruiters and résumé
  parsers expect that; they stay mono and right-aligned on screen. Education shows its first entry and
  folds the rest behind a row of small circles; they open and close in 300ms, at once under reduced
  motion. Research and awards are rows with years on the right.
  Type steps are 32 / 17 / 15 / 13 / 12 mono.
- **CV print** (the PDF): the same DOM with a print stylesheet, A4 with 12 mm / 15 mm margins. Sans
  dates with tabular figures, labels in small spaced capitals, no rules between sections, contacts
  spelled out in one line, a single role on its company's line, Languages as a Skills row, every
  education entry, and no letters in the circles (a parser would read "K KMS Lighthouse"). It must fit
  one page; `pnpm cv:pdf` prints the page count.
- **Doors** (`/`): a link with →, a 112px visual (a number or thumbnails, bottom-aligned), and a mono
  caption, over a `--border-strong` hairline. The link's `::after` covers the door, so the door is one
  link. An auto-fit grid (min 12rem) takes a new door (Writing, CV) without a layout change; stacked
  doors drop the fixed visual height. A door with nothing to show is not rendered.
- **Page transitions:** route changes cross-fade in 180ms through the View Transitions API
  (`experimental.viewTransition`). `.site-header` (and the CV bar) has its own `view-transition-name`,
  so it holds still.
  Nuxt skips the transition under `prefers-reduced-motion`; browsers without the API just navigate.
- **Door to `/oss`:** the Open source door's label, number, and unit share `view-transition-name`s with
  the `/oss` header, so they move up in 0.4s and the number shrinks from 64 to 32px. The rest of `/oss`
  rises in once the number has landed (0.34s, then 40ms apart for the first three projects); going back,
  `/` appears after it. `plugins/view-transition-types.client.ts` tags these two navigations with view
  transition types (`oss-open`, `oss-close`), so the staging in `main.css` touches no other route. Sizes
  and line-heights of the shared pieces stay in em, so the scale doesn't distort them.
- **Header to `/cv`:** the header's avatar and name share `view-transition-name`s with the CV's, so going
  to `/cv` they move down and grow (0.4s, the door's curve) while the old page leaves in 0.12s; the CV
  header rises in at 0.34s and the rest of the page at 0.40s. Leaving `/cv` the name goes back into the
  header and the next page appears after it (0.34s). The plugin tags any navigation into `/cv` `cv-open`
  and out of it `cv-close`. Both names keep a 1.1em line-height, so the scale doesn't distort them.
- **Grouped list** (`.group`, `.group-row`): 12px radius, hairline dividers inset past the leading icon.
  An "All …" row ends a list and links out.
- **PR state** is an icon in the state colour (`ph:git-pull-request` open, `ph:git-merge` merged), with
  the word for screen readers only. On `/oss` the icon sits on the timeline; `/` shows only counts.
- **Open source** (`/oss`): the door's label and `OpenSourceCount` (64px on the door, 32px here) head the
  page, then a mono caption (projects and years) and a "Pull requests" label with the GitHub link. Below,
  a timeline like the CV's: per repository the org avatar (36px, 9px radius), its name linking to the repo,
  mono counts and years, the owner and the GitHub description; per pull request the state icon on the
  line, the title without its `fix(scope):` prefix, and a mono `#number`. Most pull requests first. Type
  steps are the CV's: 32 / 17 / 15 / 13 / 12 mono.
- **Icon buttons:** 32px, 8px radius. Icons are Phosphor (`ph:`). Static hosting has no icon API, so
  every icon ships in the client bundle; a name the scanner can't see in a template must be listed in
  `icon.clientBundle.icons`, or it 404s after client-side navigation.
- **Preview card** (`og:image`): `components/OgImage/Card.vue`, the default for every page. The light
  `--bg`, avatar and `nikitar.dev`, then the page title and its meta description, so the card says what
  the search snippet says. Inter is the only font the renderer has. Local builds reuse rendered cards
  from `node_modules/.cache/nuxt/.nuxt/cache/nuxt-og-image`; delete it to see a change (CI starts clean).
- **Favicon:** a condensed grotesque `n.`, drawn as one path and a square on a 32-unit grid with every
  stem edge on an even unit, so it is sharp at 16 and 32 px. `favicon.svg` has no container and swaps
  `--heading` light/dark through `prefers-color-scheme`. `favicon.png` (32px) and `apple-touch-icon.png`
  (180px) can't switch colour, so they put the same n. (3-unit stems) in light on a `--heading` tile;
  the PNG tile has the icon-button radius, the touch icon is full bleed because iOS rounds it.
  `favicon-96.png` is for Google Search, which wants a multiple of 48 px and crops it to a circle, so it
  is full bleed too.
- **Photo grid:** 3:4 tiles, 3 columns from 640px, 2 below. One native `<dialog>` viewer per gallery;
  the arrows walk across groups. The Photos door on `/` shows the first two featured photos.

## Decisions

- **System fonts** (2026-11): nothing to download and native on Apple. Rejected: Source Sans 3 + Lato
  (the old theme), an Inter web font.
- **Own preview card** (2026-11): the stock `NuxtSeo` card had a green gradient the site doesn't use and
  an old tagline. Rejected: the stock card with a grey `theme` (still the stock layout); a card per
  colour mode (link previews show one image).
- **Favicon: a bare condensed `n.`** (2026-11): the largest and sharpest of the options at 16 px (12px
  tall), a shape of its own without a box, and still a grotesque like the system font. Replaced a blue
  Lato n. on a dark tile left from the old theme. Rejected: the n. on an icon-button tile (the most
  common favicon form, the smallest glyph, and it makes the site look like an app); a regular-width n.
  with a round period larger than the stem (closest to lowercase-and-dot startup logos).
- **Native `<dialog>` for the viewer** (2026-11): Esc, focus, and an inert page come with it. Rejected: a
  lightbox library.
- **Grey underlined links** (2026-11): blue links in the muted bio paragraphs pulled the eye to the least
  important text, and in light mode blue was about 2:1 against body text with no underline until hover.
  Rejected: blue accent links; a small company logo inline in the bio (the only image in the prose, and
  few people know the logo).
- **PR state as icons** (2026-11): the dot's label was hidden on phones, so state was colour only.
  Rejected: dots with labels; icons with tooltips (no hover on touch); a count on the GitHub search link
  (it also shows closed pull requests, so the numbers would not match).
- **Counts, not rows, on `/`** (2026-11): the Open source door shows merged (and open) and a count per
  repository; `/oss` has the rows. Eight near-identical `fix(...)` titles hid the signal, which projects.
  Replaced the newest few rows and an "All N pull requests" row.
- **Labelled links instead of social icon buttons** (2026-11): four words read faster than four glyphs.
  CV comes first, then Email. Rejected: the icon row (it needed hover titles, which touch lacks); CV as
  a door (it has no number or picture to show).
- **The email address stays plain** (2026-11): it is already public in git history and on other
  profiles, so hiding it on the site would not stop scraping. Rejected: joining it in the browser from
  two parts; keeping the CV PDF out of `robots.txt`.
- **Cross-fade, not slide, between pages** (2026-11). Rejected: a horizontal slide on desktop (the pages
  have no left-to-right order, so a direction would mean nothing); scroll-reveal animations (content is
  hidden at rest); a pulsing status dot (it pulls the eye all the time).
- **CV print from the page's own DOM** (2026-11): print-only bits (contacts as text, the single-role
  line, the Languages row) are small, and one template can't drift from the PDF. Rejected: a separate
  print template or route (the whole CV twice); left section labels on paper (rejected on screen
  too); two pages (most of a second page would be empty).
- **The CV PDF opens in a new tab** (2026-11): on an iPhone a `download` link asks first and puts the
  file in Files; the browser's viewer shows it and has its own save, print, and share. The file name
  (`nikita-rusetskii-cv.pdf`) is the same either way. Rejected: `download` (a file before a look); Open
  and Download side by side (two buttons for one file).
- **`/oss` by project** (2026-11): where and how much, with every title in view, in the CV's timeline.
  Chosen from four directions drawn on a canvas. Replaced a grouped list with an organization filter (the
  old settings-page look, the repo repeated on every row, a filter for three owners). Rejected: project
  doors that filter a flat list (a "2" set large reads as little); selected pull requests first (each
  needs a line in the owner's words); a table of counts that unfolds (titles hidden behind clicks); a log
  by month (12 of 14 merged in one month); a contribution heatmap (mostly empty, counts over work); star
  counts (other people's numbers).
- **The count shrinks on `/oss`** (2026-11): 64px there outweighed the projects and made the page about
  the number; 32px is the CV's name size, the largest type on a page other than `/`. Rejected: keeping
  64px for a pure move (a dashboard figure over a list); dropping the number (the transition has nothing
  to carry).
- **Avatar beside the CV name** (2026-11): every page shows the avatar and name together, and the
  transition from home has one thing to carry. Chosen on a canvas. Replaced: a CV header with the name
  alone. Rejected: the site header on `/cv` (the name twice, one above the other); the transition
  without the avatar (it would vanish while the name moves).
- **Staged door transition** (2026-11): the list waits for the number. Rejected: the list rising while the
  number moves (the number crossed the rows and the caption); delaying `/oss` on every route (from `/cv` it
  would wait for a number that doesn't move).
- **Education folds by grid rows** (2026-11): each folded entry is a one-row grid that goes from `0fr` to
  `1fr`, which every current browser animates without JS. Replaced: `display: none` (it jumped).
  Rejected: `interpolate-size` with `height: auto` (Chromium only); a measured height in JS.
