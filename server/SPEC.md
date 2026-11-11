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

`/api/contributions` returns the owner's public pull requests to repos he doesn't own: open ones first,
then merged, each newest first (open by creation date, merged by merge date). Closed-unmerged ones are
dropped. The list is filtered by `github.hidden` (a whole `owner/repo` or one `owner/repo#123`), set in
`app/app.config.ts`. The route returns the whole list; `/` shows the first `github.limit` and `/oss` shows
all of them. The search pages through every result, up to the API's 1000.

## Boundary

- **Build time only.** Prerendering `/` and `/oss` calls the route; the result is inlined into the page and its
  `_payload.json`. GitHub Pages has no server, so the route itself is never served.
- **GitHub search API.** `NUXT_GITHUB_TOKEN` raises the rate limit; CI passes `GITHUB_TOKEN`.
- **Fails soft.** Any error returns `[]` and the section hides. A build never fails because GitHub is down.

## Decisions

- **Hide list, not allow list** (2026-11): new contributions show up on their own. Trivial ones (README
  list entries, edits to friends' repos) are hidden by repo.
- **Freshness is the last deploy**, so [[module-deploy]] rebuilds daily.
- **Open before merged** (2026-11): the owner's call. The route sorts, so `/` and `/oss` agree, and the
  newest few on `/` can be all open ones. Rejected: one list by date with states mixed (the old order).
- **Page through all results** (2026-11): `/oss` lists every pull request, and one page of 100 also holds
  closed and hidden ones, so a single page would cut the list short.
- **Hidden repos stay hidden on GitHub too** (2026-11): the "All pull requests on GitHub" link on `/oss`
  adds `-repo:` for each hidden repo. A hidden single pull request has no search qualifier, so GitHub
  still shows it, and closed-unmerged ones show there as well.
