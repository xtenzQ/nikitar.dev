---
id: module-app
type: module-design
status: draft
title: Pages, layouts, and components
parent: architecture
depends-on: [module-contributions, module-photos, module-blog]
tags: [ui]
---

## Responsibility

The Nuxt app: pages, layouts, components, and the site data they render. Three parts have their own
spec: [[submodule-app-design]] (tokens and shared look), [[submodule-app-transitions]] (page
transitions), and [[submodule-app-cv]] (`/cv` and its PDF).

## Boundary

- **Pages.** `index` is the statement, the status, links, and doors. Every page but `cv` gets
  `AppHeader` (avatar, name, theme toggle); on `/` the name is the page's `h1`, elsewhere it links home.
  `photos` lists every group; `oss` lists every pull request, grouped by project; `blog/**` is
  [[module-blog]]; `cv` is [[submodule-app-cv]].
- **Site data is config, not markup.** Profile (with the status), socials, and GitHub settings live in
  `app/app.config.ts`; photos in `app/data/photos.json` ([[module-photos]]); the CV in
  `app/data/cv.json`. Components read them through `useAppConfig()`, `usePhotos()`, and `useCv()` and
  never hardcode them. Open source counts and the CV's notable pull requests come from
  [[module-contributions]], so a notable one that is hidden or missing just isn't shown.
- **Click events.** Open PDF and every socials link carry `data-umami-event`, which Umami counts
  ([[architecture]] decision 2). A new link to a profile or file gets one too. The PDF's links back to
  the site carry `?utm_source=cv-pdf`.
- **Forbidden:** raw colours outside the tokens ([[submodule-app-design]] names the exceptions), web
  fonts, and icons fetched at runtime.

## Pages

- **Statement** (`/`): the two bio sentences at 22–28px, weight 500, the first in `--heading` and the
  second in `--text-muted`. It is the largest text on the site; a future post title can reuse it. The
  status pill follows, then its note in `--text-muted`.
- **Doors** (`/`): a link with →, a 112px visual (a number or thumbnails, bottom-aligned), and a mono
  caption, over a `--border-strong` hairline. The link's `::after` covers the door, so the door is one
  link. An auto-fit grid (min 12rem) takes a new door (a Writing door) without a layout change; stacked
  doors drop the fixed visual height. A door with nothing to show is not rendered.
- **Open source** (`/oss`): the door's label and `OpenSourceCount` (64px on the door, 32px here) head the
  page, then a mono caption (projects and years) and a "Pull requests" label with the GitHub link. Below,
  a timeline like the CV's: per repository the org avatar (36px, 9px radius), its name linking to the
  repo, mono counts and years, the owner and the GitHub description; per pull request the state icon on
  the line, the title without its `fix(scope):` prefix (a key like `SOLR-6853:` stays), and a mono
  `#number`. The line ends at the last icon, even when its title wraps. Most pull requests first. Type
  steps are the CV's: 32 / 17 / 15 / 13 / 12 mono.
- **Photos** (`/photos`): 3:4 tiles, 3 columns from 640px, 2 below. One native `<dialog>` viewer per
  gallery; the arrows walk across groups. The viewer fills the viewport, so a click on the dialog itself,
  not the photo, closes it; the page behind stays still. The large file has the cached thumbnail as its
  background, so the photo shows at once while it loads. The Photos door on `/` shows the first two
  featured photos.

## Decisions

- **Home: a statement with doors** (2026-11). The two bio sentences set large, the status, labelled
  links, then one door per section. The PhD and hackathon lines left home: home says only what is true
  now, and history is on `/cv`. Chosen from six directions drawn on a canvas. Rejected: a README-like
  profile with repo cards (the same settings-page look); a man page (mono paragraphs read worse, and
  outside engineering it reads as a joke); a label/value index (read as a CV); an activity log of PRs and
  photos (thin in a quiet month); a bento grid (the most common pattern of 2024–26, and fixed slots make
  a new section a re-layout).
- **Photos: a door on home, all of them on `/photos`** (2026-11). The door shows two featured thumbnails
  and the count. Replaced a featured grid of 3 or 6 that took about half of home. Rejected: a "+N"
  overlay tile (hides a photo), a horizontal scroll strip (awkward with a mouse, breaks the column).
- **Counts, not rows, on `/`** (2026-11): the Open source door shows merged (and open) and a count per
  repository; `/oss` has the rows. Eight near-identical `fix(...)` titles hid the signal, which projects.
  Replaced the newest few rows and an "All N pull requests" row.
- **Labelled links instead of social icon buttons** (2026-11): four words read faster than four glyphs.
  CV comes first, then Email. Rejected: the icon row (it needed hover titles, which touch lacks); CV as
  a door (it has no number or picture to show).
- **The email address stays plain** (2026-11): it is already public in git history and on other
  profiles, so hiding it on the site would not stop scraping. Rejected: joining it in the browser from
  two parts; keeping the CV PDF out of `robots.txt`.
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
- **Native `<dialog>` for the viewer** (2026-11): Esc, focus, and an inert page come with it. Rejected: a
  lightbox library.
