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
    // Static hosting has no icon API: list icon names the scanner can't see in templates
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

  linkChecker: {
    excludeLinks: [`/${cv.pdf}`],
  },

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

  routeRules: {
    '/about': { redirect: '/' },
    '/200.html': { robots: false },
    '/blog/tags/**': { robots: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/photos', '/oss', '/cv'],
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
    githubToken: '',
  },
})
