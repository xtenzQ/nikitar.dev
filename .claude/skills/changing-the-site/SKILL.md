---
name: changing-the-site
description: Use before changing what the site shows or does — a feature, a change in look or behavior, or a bug fix, however small. Not for questions, edits that change no behavior (typos, wording or data the owner supplies, specs only), or adding photos.
---

# Changing the site

The specs are the site's ground truth. Every change settles its design with the owner first, then lands
in the code and the specs together. Depth scales with the change: a small one gets one short round of
questions and a few lines of task-spec, never zero.

## 1. Orient

Read the specs that own the area (the map is in `AGENTS.md`), then the code. Note each decision the change
touches whose *why* no spec records: it becomes a question in step 4. Done when you can name the owning
specs and the decisions the change would move.

## 2. Open a task-spec

Create `.tasks/<slug>.md` (gitignored) with frontmatter `id: task-<slug>`,
`type: task-spec`, `title`, `status: draft`, and `parent:` the nearest owning spec. Sections: **Request**,
**Product** (or **Bug**), **Design**, **Unconfirmed**, **Deferred**. It is the one working document;
update it as answers land.

## 3. Bug? Classify it first

When the request reports something that behaves wrongly:

1. Pin the symptom, the expected behavior, and how to trigger it. Reproduce it in a build or the preview
   when that is safe; if it won't reproduce, record that.
2. Classify it against the specs:
   - **Silent**: no spec covers it. The intended behavior is the owner's call: confirm it; step 7 adds it.
   - **Wrong**: a spec states the buggy behavior. Confirm the correction; step 7 fixes that spec.
   - **Right**: the spec already states the expected behavior and only the code is wrong. Go to step 6.
   - **Feature**: the code does what the specs intend. Say it is a new capability and go to step 4.
3. Record all of it under **Bug**. The confirmed intended behavior is the accepted design.

## 4. Interview: product, then technical

Ask in rounds with AskUserQuestion, each question with your inferred answer as the first option. Look up
facts instead of asking them.

- **Product first:** what the visitor sees and does — on a phone, in dark mode, in print where it
  applies, and when data is missing (GitHub down, no photos) — and how we'll know it is done. For a change
  in look, draw two to four directions side by side with your recommendation; the owner picks. Record
  the answers under **Product**.
- **Then technical:** where the change lives (build time or browser, data file or component), what it
  costs the static build, and the *why* behind each decision noted in step 1. Show the option you would
  reject next to the one you chose. Record **Design**: the approach, its trade-offs, the rejected options.

Done when no product or technical decision is left assumed. A skipped question goes under
**Unconfirmed** with your best assumption.

## 5. Review once

Clear the task-spec of contradictions and accidental scope, then present the design in one message sized
to the change. A decision stated in the request is already approved. Build once the owner accepts.

## 6. Build and verify

Implement the accepted design and verify it as `AGENTS.md` describes. Then read the whole diff: rationale
sits in the specs, the replaced pattern is gone everywhere, and the subtraction pass is done.

## 7. Amend the specs

Work from the task-spec and the actual diff, top-down:

- `goal-and-requirements.md` when a capability or principle changed;
- `architecture.md` when a module, an edge between modules, a build-wide decision, or an invariant moved;
- the owning spec for a boundary, behavior, or decision, and for a bug classified silent or wrong.

Write each decision once, dated, with its rejected options; link the rest by `[[id]]`. Mark anything
unconfirmed where it stands. A new spec is `status: draft` until the owner has read it. Update
`README.md` when a visible capability changed; when the change shows on the README GIF, offer to
re-record it (`record-readme-gif`). Run `pnpm check:specs`. A bug classified right, or a change
the specs already describe, changes no spec.

Done when every spec you touched matches what was built.

## 8. Retire the task-spec

Set its `status: done` and keep the file. Report in a line or two which specs changed and any
unconfirmed assumption left in them.
