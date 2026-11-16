import tailwindcss from '@tailwindcss/vite'
import cv from './app/data/cv.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    '@nuxt/icon',
  ],

  icon: {
    // Static hosting has no /api/_nuxt_icon route, so ship every icon in the client bundle.
    // The scanner finds names in templates; list any it can't see here.
    clientBundle: {
      scan: true,
      icons: ['ph:x', 'ph:caret-left'],
    },
    customCollections: [
      {
        prefix: 'custom',
        dir: './public/icons',
      },
    ],
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.output/**', '**/.nuxt/**'],
      },
    },
  },

  site: {
    url: 'https://nikitar.dev',
    name: 'Nikita Rusetskii',
    description: 'Software engineer working on search, Lucene, RAG, and agent tooling',
    defaultLocale: 'en',
    // GitHub Pages answers /oss with a 301 to /oss/, so canonical, og:url, and the sitemap use the slash too
    trailingSlash: true,
  },

  experimental: {
    viewTransition: true,
    defaults: {
      nuxtLink: { trailingSlash: 'append' },
    },
  },

  ogImage: {
    defaults: { component: 'Card' },
  },

  // scripts/cv-pdf.mjs writes the CV PDF after the build, so the link checker can't see it yet
  linkChecker: {
    excludeLinks: [`/${cv.pdf}`],
  },

  // Crawlers that collect AI training data are asked to skip photos; search and AI search stay allowed
  robots: {
    groups: [
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'meta-externalagent',
          'Bytespider',
        ],
        disallow: ['/photos'],
      },
    ],
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['java', 'kotlin', 'typescript', 'javascript', 'bash', 'yaml', 'json', 'sql', 'python', 'xml', 'markdown'],
        },
        remarkPlugins: {
          'remark-math': {},
        },
        rehypePlugins: {
          'rehype-katex': {},
        },
      },
    },
  },

  // The about page was folded into the home page
  routeRules: {
    '/about': { redirect: '/' },
    // The github_pages preset writes an SPA fallback that GitHub Pages serves as a plain page
    '/200.html': { robots: false },
    '/blog/tags/**': { robots: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      // '/' links /oss only when GitHub answered
      routes: ['/', '/photos', '/oss', '/cv'],
      // The CV PDF's links carry utm_source; they are the same pages
      ignore: [/[?&]utm_/],
    },
    watchOptions: {
      usePolling: true,
      interval: 1000,
    },
  },

  app: {
    baseURL: '/',
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-96.png', sizes: '96x96' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css' },
      ],
      meta: [
        { name: 'theme-color', content: '#f5f5f7', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#111113', media: '(prefers-color-scheme: dark)' },
      ],
      script: [
        {
          'src': 'https://cloud.umami.is/script.js',
          'defer': true,
          'data-website-id': 'abaa2bca-a838-4899-be80-48d3282f33b4',
          'data-domains': 'nikitar.dev',
        },
      ],
    },
  },

  runtimeConfig: {
    // Set NUXT_GITHUB_TOKEN at build time to avoid GitHub API rate limits
    githubToken: '',
  },
})
