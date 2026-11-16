---
name: record-readme-gif
description: Re-record the README GIF (`docs/preview.gif`). Use when the owner asks to update it, or when a change shows on it: the home page, `/oss`, `/photos`, the transitions between them, or the theme toggle.
---

Each recording stays in git history at its full size (about 3 MB), so record once per change that
shows, on the owner's request or yes. Why it is a GIF and how it is made: `architecture.md`, Decisions.

1. Build as `AGENTS.md` describes, with `NUXT_GITHUB_TOKEN` set: without GitHub data the Open source door
   is missing and the script times out waiting for it.
2. Run `pnpm readme:gif` (needs Google Chrome and `ffmpeg`; about a minute). It prints the frame count,
   length, and size. Record while no other build runs: a rebuild of `.output` mid-recording leaves
   broken images in the GIF.
3. Lay every frame on one sheet and open it:
   `ffmpeg -v error -i docs/preview.gif -vf "scale=266:-1,tile=8x12" -frames:v 1 <scratchpad>/sheet.png`.
   Then list the frame times:
   `ffprobe -v error -show_entries packet=duration_time -of csv=p=0 docs/preview.gif`.
   Done when each page shows its data and photos, both door transitions run there and back, the light
   theme appears, every frame between the holds lasts 0.04 s, and the file is under 4 MB. Bring
   anything else to the owner.

The scenario (pages, clicks, holds) lives in `scripts/readme-gif.mjs`. Change it there when a door or a
page on the recording is added, renamed, or removed.
