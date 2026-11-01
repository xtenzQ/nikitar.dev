---
id: module-photos
type: module-design
status: active
title: Photo pipeline and photo data
parent: site
tags: [photos, privacy]
---

## Responsibility

Turn original photos into published files and keep `app/data/photos.json` in step with them.

## Flow

```text
photos-src/<group>/*.{heic,jpg,png,webp}     originals, gitignored
  └─ pnpm photos (process.mjs)
       ├─ resize.swift   ImageIO: applies orientation, downsizes, writes PNG without metadata
       ├─ cwebp -metadata none
       ├─ public/photos/<name>.webp          thumbnail, covers a 600×800 box
       ├─ public/photos/<name>-large.webp    viewer, fits 1600px on the long edge
       └─ app/data/photos.json               new entry appended to group <group>
```

- `<name>` is `<group>-<file slug>`. Names already in the data are skipped, so a rerun is safe.
- The thumbnail covers 600×800 so a 3:4 tile crop stays sharp at 2× density, landscape photos included.

## Data contract

`photos.json` holds `groups[]` of `{ id, title, photos[] }`; `id` matches the source folder and `title`
is what the page shows ("Korea, 2025"). A photo is `{ name, caption, alt, width, height, featured?,
focus? }`: `width`/`height` are the large file's, `focus` is an `object-position` for the tile crop.
File order is display order. New entries arrive with an empty caption and alt and the group title
defaults to the folder name; fill them in before publishing. Captions are "Place, year".

## Invariants

- Originals never enter git: they are full resolution and carry GPS.
- Published files hold only an image chunk: no EXIF, XMP, or ICC.
- Published sizes stay screen-only (≤1600px).
- Tooling is macOS-only: `swift` (Xcode command line tools) and `cwebp` (`brew install webp`).

## Decisions

- **ImageIO for orientation** (2026-11). `sips` writes the stored pixel layout and leaves rotation to
  metadata, which `cwebp -metadata none` then drops: photos came out sideways.
- **AI training crawlers are asked to skip `/photos`** (2026-11) through `robots` groups in
  `nuxt.config.ts`. The prefix covers the page and every image file, including the ones the home page
  shows. Search and AI search crawlers stay allowed so the site remains findable. Rejected:
  `blockAiBots` (closes the whole site, AI search included). `robots.txt` is a request that major AI
  crawlers honour; it does not stop scrapers that ignore it.
- **Photos live in the repo** (2026-11), about 0.3 MB each. Rejected: Git LFS (Pages builds need an LFS
  checkout and quota), an image CDN (another account and cost). Accepted cost: fully removing a photo
  later means rewriting history.
