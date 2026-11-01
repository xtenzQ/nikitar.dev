---
id: module-contributions
type: module-design
status: active
title: Open source contributions from GitHub
parent: site
references: [module-deploy]
tags: [data, github]
---

## Responsibility

`/api/contributions` returns the owner's public pull requests to repos he doesn't own, newest first: open
and merged ones, with closed-unmerged dropped, filtered by `github.hidden` (a whole `owner/repo` or one
`owner/repo#123`). The list is capped at `github.limit`; the `merged` and `open` counts cover every
pull request that passes the filters, so they can exceed the list. Both settings live in
`app/app.config.ts`. The search reads the newest 100 pull requests.

## Boundary

- **Build time only.** Prerendering `/` calls the route; the result is inlined into the page and its
  `_payload.json`. GitHub Pages has no server, so the route itself is never served.
- **GitHub search API.** `NUXT_GITHUB_TOKEN` raises the rate limit; CI passes `GITHUB_TOKEN`.
- **Fails soft.** Any error returns `[]` and the section hides. A build never fails because GitHub is down.

## Decisions

- **Hide list, not allow list** (2026-11): new contributions show up on their own. Trivial ones (README
  list entries, edits to friends' repos) are hidden by repo.
- **Freshness is the last deploy**, so [[module-deploy]] rebuilds daily.
- **Counts show merged and open only** (2026-11). Closed-unmerged pull requests are left out of the list,
  so counting them would describe something the page doesn't show.
