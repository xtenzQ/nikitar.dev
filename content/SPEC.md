---
id: module-blog
type: module-design
status: dormant
title: Blog posts
parent: site
tags: [content]
---

## Responsibility

Markdown posts in `content/blog/`, rendered at `/blog/<slug>`, with per-tag listings under `/blog/tags/`.

## Status

Dormant since 2026-11: the only post (2026-02) is out of date. The routes stay prerendered so existing
links work, but no page links to the blog. `/blog/` and posts stay in the sitemap. `draft: true`
unpublishes a post.

When writing resumes, add a Writing door on the home page (the latest post's title and `yyyy-mm`); the
doors grid takes it without a layout change.

## Decisions

1. **Tag pages are `noindex`** (2026-11-16). A `robots: false` route rule on `/blog/tags/**` sets the
   meta tag, and the sitemap module drops those URLs. Five tag pages for one post are thin, and Search
   Console listed them as not indexed. Rejected: `Disallow` in `robots.txt` (Google could not read the
   `noindex` and may still index the bare URL); deleting the pages (old links would 404).

## Boundary

- The frontmatter schema lives in `content.config.ts`. `rawbody` must stay in it: reading time counts it.
- Diagrams are SVGs in `public/diagrams/`, inlined by `<Diagram>`. They read site tokens (`var(--text)`
  and others), so [[module-app]] token renames reach them.
