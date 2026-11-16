---
id: goal-and-requirements
type: goal-and-requirements
status: draft
title: nikitar.dev — goal and scope
tags: [product, scope]
---

## Goal

A personal site for Nikita Rusetskii: who he is, what he works on now, and a way into his open source
work, his CV, and his photos. Home answers "who is this and what does he work on" in one screen and stays
out of the way. Papers stay on Google Scholar, and the site links there.

This document describes the site as it is and changes with it. It holds no roadmap.

## Who it's for

Unconfirmed, inferred from the decisions below: recruiters and hiring managers, who need a page to open
and a CV file to attach; engineers and maintainers looking at his open source work, through one link to
`/oss`; and people who know him, for the photos.

## Principles

- **His words.** First-person prose is the owner's own, and the site bio is where it lives. English is his
  second language, so an agent never writes or polishes prose in his voice: it proposes, he decides.
- **Minimal.** One column, a grey interface, grouped lists. A section earns its place; a dormant one is
  removed from the page, not left thin.
- **Contributions over own projects.** Pull requests to other people's repos are the proof of work.
- **Static and free to host.** Everything is prerendered for GitHub Pages. Data that changes is fetched at
  build time and refreshed by a daily rebuild.
- **Nothing private ships.** Photos are downscaled and stripped of metadata before they enter the repo.

## Capabilities

- **Home, `/`**: the two bio sentences as a statement, the availability status, labelled links (CV
  first), and one door each to open source and photos ([[module-app]]).
- **Open source, `/oss`**: every public pull request to repos he doesn't own, grouped by project, read
  from GitHub at build time ([[module-contributions]], [[module-app]]).
- **Photos, `/photos`**: all photos grouped by trip, with a viewer ([[module-photos]], [[module-app]]).
- **CV, `/cv`**: experience, open source, skills, and education, with a one-page PDF printed from the
  same page ([[submodule-app-cv]]).
- **Blog, `/blog/**`**: dormant and unlinked; old URLs still work ([[module-blog]]).
- **Visit counts** without cookies ([[architecture]]).

## Decisions

1. **One-page index** (2026-11). Rejected: blog-first (one post, out of date); a feed like
   my-contributions.nuxt.dev (most merged PRs are to his own repos, so an external-only merged feed is a
   few rows); a research "lab page" (the research is in the past).
2. **Work history on `/cv`** (2026-11). Replaced "employment history stays on LinkedIn": a recruiter
   needs a link to open and a file to attach. Home still names only the current employer, in the bio.
3. **Open source on its own page, `/oss`** (2026-11): one link to share, with its own title and preview
   card; home shows only counts. Rejected: a subdomain like `oss.nikitar.dev` (GitHub Pages serves one
   domain per repo, so it needs a second repo); an anchor `/#open-source` (no title or preview card of
   its own).
4. **The site is the bio's source** (2026-11). The GitHub profile README keeps the work and interests
   sentences and links to `/` and `/oss`; company and location sit in the GitHub sidebar. The status
   pill and its note are `profile.status`, and the README repeats them too. Rejected: the full bio in
   both places (every edit made twice, and it repeated the sidebar).

## Non-goals

Only these are excluded by decision. Anything not listed here or above is open, not forbidden.

- **An About page** (2026-11). It repeated LinkedIn and Scholar and needed prose in his voice. `/about`
  redirects to `/` so old links keep working.
- **Projects or Writing sections on home** (2026-11). Personal repos aren't maintained and the blog is
  dormant ([[module-blog]]).
