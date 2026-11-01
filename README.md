<h1 align="center">🌐 nikitar.dev</h1>

<p align="center">
  Personal portfolio and blog built with Nuxt 3, Tailwind CSS, and Nuxt Content.
</p>

<p align="center">
  <a href="https://github.com/xtenzQ/nikitar.dev/actions/workflows/deploy.yml">
    <img src="https://github.com/xtenzQ/nikitar.dev/actions/workflows/deploy.yml/badge.svg" alt="Deploy to GitHub Pages" />
  </a>
  <a href="https://github.com/xtenzQ/nikitar.dev/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/xtenzQ/nikitar.dev" alt="License" />
  </a>
  <img src="https://img.shields.io/github/languages/top/xtenzQ/nikitar.dev" alt="Top Language" />
  <img src="https://img.shields.io/github/last-commit/xtenzQ/nikitar.dev" alt="Last Commit" />
</p>

<p align="center">
  <img src="docs/preview-dark.png" alt="Preview" />
</p>

## ✨ Features

- 🗂️ One-page index: a short bio and open source pull requests in a macOS-style grouped list
- 🐙 Open source section pulled from the GitHub API at build time, refreshed by a daily rebuild (curate it in `app/app.config.ts`)
- 📷 Photos: a featured set on the home page, all of them grouped by trip on `/photos`, with a native `<dialog>` viewer
- 📝 Markdown-based blog powered by [Nuxt Content](https://content.nuxt.com/)
- 🌗 Dark / light mode with system preference detection
- 🏷️ Tags with per-tag post listings
- 🔢 KaTeX math formula rendering
- 🎨 Syntax highlighting with [Shiki](https://shiki.style/) (GitHub Light & Dark themes)
- 📋 One-click code block copy button
- 🔗 Heading anchor links for easy sharing
- 📱 Fully responsive design
- 🔍 SEO optimized (Open Graph, structured data, sitemap)
- 🚀 Static site generation deployed to GitHub Pages

## 🛠️ Stack

- [Nuxt 4](https://nuxt.com/) — Vue.js meta-framework
- [Vue 3](https://vuejs.org/) — Progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Nuxt Content](https://content.nuxt.com/) — Git-based headless CMS
- [TypeScript](https://www.typescriptlang.org/) — Typed JavaScript
- [KaTeX](https://katex.org/) — LaTeX math typesetting
- [Shiki](https://shiki.style/) — Syntax highlighter

## 🏗️ How to Build and Run

**Prerequisites:** [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/)

```bash
# Install dependencies
pnpm install

# Start dev server at http://localhost:3000
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Process new photos from photos-src/<trip>/ (macOS; needs `brew install webp`)
pnpm photos
```

Agent and contributor docs: `AGENTS.md`, plus a `SPEC.md` per module (start with the root one).

## 📦 Third-Party Assets

- **Fonts:** the system font stack (SF Pro / SF Mono on Apple devices), no web fonts
- **Icons:** [Phosphor Icons](https://phosphoricons.com/) via [@nuxt/icon](https://nuxt.com/modules/icon)
- **Math rendering:** [KaTeX](https://katex.org/) CSS via [jsDelivr](https://www.jsdelivr.com/)

## 🎨 Credits

Earlier versions of this site were inspired by the [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) Jekyll theme by [cotes2020](https://github.com/cotes2020), licensed under the [MIT License](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE).

## 🤝 Contribution

I'd love to accept your contributions to this project. I use GitHub pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

## ⭐ Find this repository useful?

Like the website or got inspired by it? Please support it by joining [stargazers](https://github.com/xtenzQ/nikitar.dev/stargazers) for this repository. ⭐

## 📄 License

The source code is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

The MIT License does not cover the photos (`public/photos/`) or the written content (`content/`). They are © Nikita Rusetskii, all rights reserved, and may not be copied or reused without permission.
