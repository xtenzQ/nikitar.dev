---
id: module-blog
type: module-design
status: active
title: Blog posts
parent: architecture
tags: [content]
---

## Responsibility

Markdown posts in `content/blog/`, rendered at `/blog/<slug>`, with per-tag listings under `/blog/tags/`.

## Status

Dormant since 2026-11: the only post (2026-02) is out of date. The routes stay prerendered so existing
links work, but no page links to the blog. `/blog/` and posts stay in the sitemap. `draft: true`
unpublishes a post.

A new post brings back a Writing door on the home page (the latest post's title and `yyyy-mm`); the
doors grid takes it without a layout change.

## Boundary

- The frontmatter schema lives in `content.config.ts`. `rawbody` must stay in it: reading time counts it.
- Diagrams are SVGs in `public/diagrams/`, inlined by `<Diagram>`. They read site tokens (`var(--text)`
  and others), so [[submodule-app-design]] token renames reach them.
- `plugins/copy-interactions.client.ts` wires the code blocks' copy button, folds blocks taller than
  300px, and copies heading anchor links. Copying falls back to `execCommand('copy')` when the Clipboard
  API is missing or hasn't answered in 200 ms.
- Shiki leaves plain text code blocks uncoloured, so they would take the muted prose colour; `main.css`
  sets them in `--heading`.

## Decisions

1. **Tag pages are `noindex`** (2026-11-16). A `robots: false` route rule on `/blog/tags/**` sets the
   meta tag, and the sitemap module drops those URLs. Five tag pages for one post are thin, and Search
   Console listed them as not indexed. Rejected: `Disallow` in `robots.txt` (Google could not read the
   `noindex` and may still index the bare URL); deleting the pages (old links would 404).
