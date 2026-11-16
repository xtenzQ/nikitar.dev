# nikitar.dev

Nikita Rusetskii's personal site: a one-page index (bio, open source pull requests, photos, CV) built
with Nuxt 4 and Nuxt Content, prerendered to GitHub Pages.

## Read context proportionally

- `goal-and-requirements.md`: what the site is for, its principles, capabilities, and non-goals.
- `architecture.md`: the modules and the edges between them, build-wide decisions, and invariants.
- Read the owning spec when work touches its module: `app/SPEC.md` (pages), `app/assets/css/SPEC.md`
  (design system), `app/transitions.SPEC.md` (page transitions), `app/cv.SPEC.md` (CV and its PDF),
  `server/SPEC.md` (open source data), `scripts/photos/SPEC.md` (photo pipeline and data),
  `content/SPEC.md` (blog), `.github/SPEC.md` (deploy).
- Localized work does not need unrelated specs.
- A feature, a change in look or behavior, or a bug fix goes through the `changing-the-site` skill.

## Voice and content

- Never write or rewrite first-person prose for the owner. Propose wording and let him decide. The site
  bio is the source; his GitHub profile README (`xtenzQ/xtenzQ`) repeats two of its sentences and the
  status (`profile.status`) and links here, so a change to either goes to both.
- English is his second language. Prefer plain words; avoid idioms and flourishes ("keeps me hooked",
  "a few things I'm glad I did").
- Don't add sections or content to fill space.

## Specs and comments

Specs hold intent, decisions (dated, with the rejected options), and invariants. Keep them short and don't
restate code; say each thing once and link the rest by `[[id]]`. They describe the site as it is: an idea
for later goes back to the owner, not into a spec. Comments are near-zero: a rare one-line hazard note is
fine; rationale belongs in the owning spec. A change that moves a decision or boundary updates that spec
in the same change.

Frontmatter: `id`, `type` (`goal-and-requirements`, `architecture-design`, `module-design`,
`submodule-design`, or `task-spec`), `title`, `status`, `parent`, and `depends-on` / `references` for
real edges. A new or rewritten spec is `draft` until the owner has reviewed it, then `active`; later
`stale`, `done`, or `deprecated`.

## Verification

- `NUXT_GITHUB_TOKEN=$(gh auth token) npx nuxt build --preset github_pages` must report 0 failing pages
  (the link checker runs during prerender).
- Spec changes: `pnpm check:specs` must report 0 problems.
- Serve the output with the `static-preview` config in `.claude/launch.json` (`.output/public` on :4173)
  and check `/` plus every changed page in light, dark, and a 375px viewport, with no horizontal scroll.
- Photo changes: open the viewer (arrows, Esc, click outside) and confirm new files hold only a `VP8`
  chunk with `webpinfo -summary`.
- CV changes: run `pnpm cv:pdf` after the build; it must report 1 page. Look at the PDF too.
- There is no test suite; don't invent one for a localized change.

## Handoff hygiene

- Subtraction pass: remove dead components, tokens, config, and icon names in the same change.
- `README.md` is the repo's front page; update its feature claims when a user-visible capability changes.
- Commit only when asked. A push to `master` deploys the live site; never push without explicit approval.

## Stack

Nuxt 4 · Vue 3 · Nuxt Content 3 · Tailwind v4 + typography · `@nuxtjs/seo` · `@nuxt/icon` (Phosphor,
client-bundled) · pnpm · GitHub Pages. Photo pipeline: macOS `swift` (ImageIO) and `cwebp`. README GIF:
`ffmpeg`.
