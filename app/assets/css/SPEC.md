---
id: submodule-app-design
type: submodule-design
status: draft
title: Design system — tokens and shared look
parent: module-app
tags: [ui, design-system]
---

## Responsibility

The look every page shares: the tokens and shared classes in `main.css`, the icons, the preview card, and
the favicons. Blog diagrams ([[module-blog]]) and the CV print ([[submodule-app-cv]]) read these tokens
too. Tailwind finds class names by scanning every file in the repo, so `main.css` keeps the root docs and
the specs out of the scan (`@source not`); otherwise a word in a spec becomes a utility class.

## Tokens and colour

- **Tokens** (`:root` and `.dark` in `main.css`): `--bg` page and `--surface` groups; `--heading`,
  `--text`, `--text-muted` (secondary, at least 4.5:1) and `--text-tertiary` (decorative only, fails AA);
  alpha borders `--border` (dividers) and `--border-strong` (outlines); `--accent` for the focus ring and
  blog diagrams; `--link-underline`; `--open` and `--merged` for PR state. Blog diagrams read these names
  too, so renaming a token breaks them. A print block resets them to light on white, with rules a
  little darker, so printing in dark mode still gives a light page.
- **Theme switch** is instant: `colorMode.disableTransition` turns every transition off for the frame
  the `.dark` class changes, so every colour changes in the same frame and no hover fade runs on a
  switch.
- **Colour:** the interface is grey: text, icons, and links. Colour comes from content (org avatars,
  photos, diagrams) and PR state. A text link keeps its paragraph's colour with a `--link-underline`
  line; on hover it turns `--heading` and the line goes solid. Links styled as rows, buttons, or badges
  set `text-decoration: none`.
- **Exceptions** to tokens-only colour: the photo viewer's chrome, which sits on a fixed dark backdrop in
  both themes and uses white with alpha; the preview card, which copies the light tokens as hex because
  its renderer can't read CSS variables; and the favicons in `public/`, which a browser draws without
  the page's CSS, so they copy `--heading` and `--bg` as hex.

## Type

The system stack (SF Pro and SF Mono on Apple). The index is 15px; article prose is 17px. Weights
400/500/600. Dates and repo names are mono; dates are ISO (`2026-02`), except on the CV
([[submodule-app-cv]]).

## Shared parts

- **Status pill:** `StatusPill`, `profile.status.label` with a still `--open` dot.
- **Grouped list** (`.group`, `.group-row`): 12px radius, hairline dividers inset past the leading icon.
  An "All …" row ends a list and links out.
- **PR state** is an icon in the state colour (`ph:git-pull-request` open, `ph:git-merge` merged), with
  the word for screen readers only. On `/oss` the icon sits on the timeline; `/` shows only counts.
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

## Decisions

- **Look: macOS / Hugging Face** (2026-11). System fonts, alpha hairline borders, 12px radius, grouped
  lists, mono metadata. Replaced a Chirpy-derived blog theme.
- **System fonts** (2026-11): nothing to download and native on Apple. Rejected: Source Sans 3 + Lato
  (the old theme), an Inter web font.
- **Grey underlined links** (2026-11): blue links in the muted bio paragraphs pulled the eye to the least
  important text, and in light mode blue was about 2:1 against body text with no underline until hover.
  Rejected: blue accent links; a small company logo inline in the bio (the only image in the prose, and
  few people know the logo).
- **Instant theme switch** (2026-11): the body faded its colours over 0.2s while headings changed at
  once, so for 50–100ms text was nearly the colour of the background (down to 1:1). Rejected: every
  colour fading together (light and dark both pass through the same grey, so headings still drop below
  3:1 for about 40ms); the new theme spreading in a circle from the toggle through View Transitions (a
  script and a transition type for a small control, and the header's own transition name gets in the
  way).
- **PR state as icons** (2026-11): the dot's label was hidden on phones, so state was colour only.
  Rejected: dots with labels; icons with tooltips (no hover on touch); a count on the GitHub search link
  (it also shows closed pull requests, so the numbers would not match).
- **Own preview card** (2026-11): the stock `NuxtSeo` card had a green gradient the site doesn't use and
  an old tagline. Rejected: the stock card with a grey `theme` (still the stock layout); a card per
  colour mode (link previews show one image).
- **Favicon: a bare condensed `n.`** (2026-11): the largest and sharpest of the options at 16 px (12px
  tall), a shape of its own without a box, and still a grotesque like the system font. Replaced a blue
  Lato n. on a dark tile left from the old theme. Rejected: the n. on an icon-button tile (the most
  common favicon form, the smallest glyph, and it makes the site look like an app); a regular-width n.
  with a round period larger than the stem (closest to lowercase-and-dot startup logos).
