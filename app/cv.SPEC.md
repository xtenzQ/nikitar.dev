---
id: submodule-app-cv
type: submodule-design
status: draft
title: CV page and PDF
parent: module-app
depends-on: [module-contributions]
references: [module-deploy, submodule-app-transitions]
tags: [cv]
---

## Responsibility

`/cv` and its PDF, both rendered from `app/data/cv.json`. The PDF is the same page printed by Chrome
(`scripts/cv-pdf.mjs`, `pnpm cv:pdf`); [[module-deploy]] runs it after every build.

## Data contract

`cv.json` follows the `Cv` type in `composables/useCv.ts`. Fields whose meaning isn't in the name:

- Dates are `"YYYY-MM"`; a role with no `end` is the current one.
- `{years}` in `headline` becomes the whole years since `careerStart` (the first full-time role), counted
  when the page renders and kept in `useState`, so the prerendered number is the one that hydrates.
- `monogram` is the letters in a company's or school's circle; `short` names an education entry in the
  folded "3 more: …" line.
- `pdf` is the file name the print writes next to the site.
- `notablePullRequests` are `"owner/repo#number"` keys, shown only while [[module-contributions]]
  returns that pull request.

## Page

- The `cv` layout has a "nikitar.dev / cv" breadcrumb and the theme toggle instead of `AppHeader`,
  because the page's `h1` is the name: the 56px avatar sits beside it, the header's pair at CV size, and
  the header's avatar and name grow into them on the way in ([[submodule-app-transitions]]). An Open
  PDF button opens the file in a new tab; the status pill follows, with the links after it.
- One column on the grey page. Section labels are 13px 600 in `--heading`, heavier than
  `.section-label`, because a reader scans a CV by section. Type steps are 32 / 17 / 15 / 13 / 12 mono.
- Experience is a timeline: a circle with the company's monogram, a line down to the next one, and a dot
  per role when a company has more than one (filled for the current role).
- Dates read "May 2026 – Present", not ISO: recruiters and résumé parsers expect month names and
  "Present"; they stay mono and right-aligned on screen. A range within one year writes the year once
  ("Feb – Apr 2020").
- Open source lists the repositories by pull request count; a repo whose owner and name match is
  written once (`humanlayer`).
- Education shows its first entry and folds the rest behind a row of small circles; they open and close
  in 300ms, at once under reduced motion. Research and awards are rows with years on the right.

## Print

- The same DOM with a print stylesheet, A4 with 12 mm / 15 mm margins. Sans dates with tabular figures,
  labels in small spaced capitals, no rules between sections, every education entry, and no letters in
  the circles (a parser would read "K KMS Lighthouse"). The PDF leaves the avatar out.
- Paper has no hover, so the contacts are spelled out in one line: email, the site, and the profiles.
  Google Scholar stays a link on the papers row: its URL is too long to print.
- A company with a single role puts it on the company's line. Languages is a Skills row.
- It must fit one page; `pnpm cv:pdf` prints the page count.
- The PDF's text runs in reading order, because some parsers read the file in order. Chrome paints
  positioned boxes, and boxes with a `view-transition-name`, after the rest of the flow, so in print every
  top-level block is positioned and the CV's transition names are off. `pdftotext -raw` shows the name
  first and the jobs under Experience.

## PDF script

`scripts/cv-pdf.mjs` prints the prerendered `/cv/` with the installed Chrome through `playwright-core`
and writes the file named in `cv.json` next to the site. It opens the page at the real origin and serves
it from disk, so relative links become full URLs in the PDF. Requests to other origins are aborted, so
the print never loads the Umami script and counts no visit. The link checker skips the PDF link, since
the file appears only after the build.

## Decisions

- **One data file, one page, printed** (2026-11). The look is the grey site with a timeline of company
  circles, labels above sections, and less important entries folded behind a row of circles. Chosen from
  four directions drawn on a canvas. Rejected: section labels in a left column (a ledger); the home
  page's statement, doors, and stacked cards; an A4 sheet on a grey desk; two columns (résumé parsers
  misread the order); a separate print template (the content twice).
- **PDF at build time** (2026-11): one file for everyone, with real text and links, refreshed by the
  daily rebuild. Rejected: `window.print()` behind the button (a print dialog, browser headers and
  footers, poor on phones); a PDF made by hand (drifts from the page); downloading Chromium for
  Playwright (the runner already has Chrome).
- **Print from the page's own DOM** (2026-11): print-only bits (contacts as text, the single-role line,
  the Languages row) are small, and one template can't drift from the PDF. Rejected: a separate print
  template or route (the whole CV twice); left section labels on paper (rejected on screen too); two
  pages (most of a second page would be empty).
- **The PDF opens in a new tab** (2026-11): on an iPhone a `download` link asks first and puts the file
  in Files; the browser's viewer shows it and has its own save, print, and share. The file name
  (`nikita-rusetskii-cv.pdf`) is the same either way. Rejected: `download` (a file before a look); Open
  and Download side by side (two buttons for one file).
- **Avatar beside the name** (2026-11): every page shows the avatar and name together, and the transition
  from home has one thing to carry. Chosen on a canvas. Replaced: a CV header with the name alone.
  Rejected: the site header on `/cv` (the name twice, one above the other); the transition without the
  avatar (it would vanish while the name moves).
- **Aimed at Senior Backend Engineer (Java) roles** (2026-11): the headline leads with Java and the years,
  and Backend leads Skills, because recruiters and AI rankers filter on stack and years. Titles stay as the
  employer gave them. Rejected: Kotlin and a Kotlin side project (the owner can't defend them in an
  interview); the work permit on the contact line (it is tied to the current job).
- **Years counted, not typed** (2026-11). Rejected: fixed text (stale every October); `new Date()` in the
  template (the prerendered and hydrated numbers could differ).
- **"Present" for the current role** (2026-11): résumé parsers look for it. Replaced: "now".
- **Print paints in tree order** (2026-11): the live PDF ran labels, the other sections, the footer, the
  header, and then every job, so a parser reading in file order filed the jobs under the wrong heading.
  Rejected: static timeline boxes in print (the line and dots need a positioned box).
- **Education folds by grid rows** (2026-11): each folded entry is a one-row grid that goes from `0fr` to
  `1fr`, which every current browser animates without JS. Replaced: `display: none` (it jumped).
  Rejected: `interpolate-size` with `height: auto` (Chromium only); a measured height in JS.
