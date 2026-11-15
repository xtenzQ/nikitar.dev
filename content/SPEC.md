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

Dormant since 2026-11: the only post (2026-02) is out of date. The routes stay prerendered and in the
sitemap so existing links work, but no page links to the blog. `draft: true` unpublishes a post.

When writing resumes, add a Writing door on the home page (the latest post's title and `yyyy-mm`); the
doors grid takes it without a layout change.

## Boundary

- The frontmatter schema lives in `content.config.ts`. `rawbody` must stay in it: reading time counts it.
- Diagrams are SVGs in `public/diagrams/`, inlined by `<Diagram>`. They read site tokens (`var(--text)`
  and others), so [[module-app]] token renames reach them.
