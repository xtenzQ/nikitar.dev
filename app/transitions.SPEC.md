---
id: submodule-app-transitions
type: submodule-design
status: draft
title: Page transitions
parent: module-app
tags: [ui, motion]
---

## Responsibility

How one page turns into the next: a cross-fade on every route, and three transitions where pieces of one
page move into the next. The CSS is the Page Transitions part of `main.css`;
`plugins/view-transition-types.client.ts` names the navigations that get their own staging.

## How it works

- Route changes cross-fade in 180ms through the View Transitions API (`experimental.viewTransition`).
  `.site-header` (and the CV bar) has its own `view-transition-name`, so it holds still. Nuxt skips the
  transition under `prefers-reduced-motion`; browsers without the API just navigate.
- A piece that moves carries the same `view-transition-name` on both pages (the `vt-*` classes). The
  plugin tags each staged navigation with a type (`oss-open`/`oss-close`, `photos-open`/`photos-close`,
  `cv-open`/`cv-close`), and `main.css` stages only those types, so no other route changes.
- A moving piece keeps its shape: sizes, line-heights, and tracking stay in em, and its box is as wide as
  its text, so the scale doesn't distort it. A rule above a moving block is drawn by that block, so it
  arrives with it.
- On either door's route the other door's pieces have no partner, so they leave and arrive with the
  page (`:only-child`).

## The three transitions

- **Door to `/oss`:** the Open source door's label, number, and unit share names with the `/oss` header,
  so they move up in 0.4s and the number shrinks from 64 to 32px. The rest of `/oss` rises in once the
  number has landed (0.34s, then 40ms apart for the first three projects); going back, `/` appears after
  it.
- **Door to `/photos`:** the Photos door's label and two thumbnails share names with the `/photos` title
  and those photos' tiles, so the label grows from 14 to 28px and the thumbnails into their tiles (0.4s,
  the door's curve) while the old page leaves in 0.12s. The subtitle rises in at 0.34s and the rest of
  the page at 0.40s; going back, `/` appears after them (0.34s). `usePhotos().door` is the one list both
  pages name from.
- **Header to `/cv`:** the header's avatar and name share names with the CV's, so going to `/cv` they move
  down and grow (0.4s, the door's curve) while the old page leaves in 0.12s; the CV header rises in at
  0.34s and the rest of the page at 0.40s. Leaving `/cv` the name goes back into the header and the next
  page appears after it (0.34s). Any navigation into `/cv` is `cv-open`, and out of it `cv-close`. Both
  names keep a 1.1em line-height.

## Decisions

- **Cross-fade, not slide, between pages** (2026-11). Rejected: a horizontal slide on desktop (the pages
  have no left-to-right order, so a direction would mean nothing); scroll-reveal animations (content is
  hidden at rest); a pulsing status dot (it pulls the eye all the time).
- **Staged door transition** (2026-11): the list waits for the number. Rejected: the list rising while the
  number moves (the number crossed the rows and the caption); delaying `/oss` on every route (from `/cv` it
  would wait for a number that doesn't move).
- **Photos door moves like the Open source door** (2026-11): a thumbnail and its tile are the same file in
  the same 3:4 crop, so it scales without distortion. Replaced: the plain cross-fade. Rejected: sharing
  the caption (mono 12px and sans 15px don't scale into each other); naming every tile (each would be its
  own layer on every route from `/photos`).
