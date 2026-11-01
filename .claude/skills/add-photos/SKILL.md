---
name: add-photos
description: Add photos to the site's gallery. Use when the owner hands over photos (HEIC, JPEG, PNG, WebP) to put on the site, or asks to add, replace, caption, or feature photos.
---

Read `scripts/photos/SPEC.md` first.

1. Copy the originals into `photos-src/<group>/`, where `<group>` is a trip id such as `korea-2025`. Never
   put originals under `public/` and never commit them.
2. Run `pnpm photos`. It prints each new entry it added to `app/data/photos.json`.
3. For each new entry:
   - `caption`: "Place, year". Ask the owner. You may suggest a place from the original's GPS, read
     locally (`mdls -name kMDItemLatitude -name kMDItemLongitude <file>`); never send coordinates to any
     service.
   - `alt`: one plain sentence describing the scene.
   - For a landscape photo or an off-centre subject, set `focus` (an `object-position` such as
     `"70% 50%"`) so the 3:4 tile keeps the subject in frame.
   - For a new group, set `title` ("Korea, 2025").
4. Ask which photos to feature on the home page; keep 3 or 6 `featured` so rows are full.
5. Verify as `AGENTS.md` describes: build, check `/` and `/photos` and the viewer, and confirm the new
   files hold only a `VP8` chunk with `webpinfo -summary public/photos/<name>*.webp`.
