import tailwindcss from '@tailwindcss/vite'

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
    // Icons named in app.config.ts are dynamic and invisible to the scanner, so list them here.
    clientBundle: {
      scan: true,
      icons: ['ph:github-logo', 'ph:linkedin-logo', 'ph:graduation-cap', 'ph:envelope-simple', 'ph:x', 'ph:caret-left'],
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
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      // '/' links /photos only when there are more photos than the featured set, and /oss only when GitHub answered
      routes: ['/', '/photos', '/oss'],
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
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css' },
      ],
      meta: [
        { name: 'theme-color', content: '#f5f5f7', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#111113', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },

  runtimeConfig: {
    // Set NUXT_GITHUB_TOKEN at build time to avoid GitHub API rate limits
    githubToken: '',
  },
})
