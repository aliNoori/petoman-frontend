import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig(<any>{
  devtools: { enabled: true },
  ssr: true,
  compatibilityDate: '2024-04-03',
  
  // Performance optimizations
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    viewTransition: true
  },

  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },
  plugins: [
    //'~/plugins/auth.client.ts',
    '~/plugins/axios.ts',
      '~/plugins/dayjs.ts'
  ],

  // Build optimizations
  build: {
    transpile: []
  },

  // Route rules for performance
  routeRules: {
    '/': { prerender: true, headers: { 'Cache-Control': 's-maxage=3600' } },
    '/blog/**': { headers: { 'Cache-Control': 's-maxage=1800' } },
    '/api/**': { headers: { 'Cache-Control': 's-maxage=300' } }
  },
  
  alias: {
    '@shared': resolve(__dirname, '../../shared')
  },

  vite: {
    optimizeDeps: {
      include: []
    },
    server: {
      fs: {
        allow: ['..', resolve(__dirname, '../../shared')]
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {}
        }
      }
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/content',
    '@vueuse/nuxt'
  ],

  // Image optimization
  image: {
    quality: 85,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    densities: [1, 2],
    presets: {
      hero: {
        modifiers: {
          format: 'webp',
          quality: 90,
          width: 800,
          height: 600
        }
      }
    }
  },

  imports: {
    autoImport: true
  },
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['vue', 'pinia', 'dayjs']
      }
    }
  },
  app: {

    baseURL: '/danim/',
    buildAssetsDir: '_nuxt/',

    head: {
      title: 'دانیم - مرکز اطلاع‌رسانی حیوانات',
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'پلتفرم جامع اطلاع‌رسانی، پرسش و پاسخ و مقالات درباره حیوانات خانگی' },
        { name: 'keywords', content: 'حیوانات, سگ, گربه, پرسش و پاسخ, مقاله, نگهداری' },
        { name: 'theme-color', content: '#f97316' },
        { name: 'color-scheme', content: 'light' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fa_IR' },
         //////
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        },
        { name: 'description', content: 'دانیم - مرکز اطلاع‌رسانی حیوانات' },
        { name: 'keywords', content: 'حیوانات , petoman ' },
        { name: 'author', content: 'Petoman Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'format-detection', content: 'telephone=no' },
        // رنگ متا برای اندروید (theme-color)
        { name: 'theme-color', content: '#000000', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        // رنگ نوار وضعیت iOS
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'دانیم - مرکز اطلاع‌رسانی حیوانات' },
        // رنگ برای ویندوز
        { name: 'msapplication-TileColor', content: '#000000' },
        // Mobile optimization
        { name: 'HandheldFriendly', content: 'true' },
        { name: 'MobileOptimized', content: '320' },
        // Geo tags
        { name: 'geo.region', content: 'IR' },
        { name: 'geo.country', content: 'Iran' },
        // Language and content
        { name: 'language', content: 'Persian' },
        { name: 'distribution', content: 'global' },
        { name: 'rating', content: 'general' },
        { name: 'revisit-after', content: '7 days' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'پت و من - petoman' },
        { property: 'og:title', content: 'پت و من - Petoman | دانیم - مرکز اطلاع‌رسانی حیوانات' },
        { property: 'og:description', content: 'دانیم - مرکز اطلاع‌رسانی حیوانات' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { property: 'og:url', content: 'https://petoman.com' },
        { property: 'og:locale', content: 'fa_IR' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@petoman' },
        { name: 'twitter:creator', content: '@petoman' },
        { name: 'twitter:title', content: 'پت و من - petoman | دانیم - مرکز اطلاع‌رسانی حیوانات' },
        { name: 'twitter:description', content: 'دانیم - مرکز اطلاع‌رسانی حیوانات'},
        { name: 'twitter:image', content: '/images/og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }
      ]
    }
  },

  css: ['~/assets/css/main.css', 'keen-slider/keen-slider.min.css',
    '@tabler/icons-webfont/dist/tabler-icons.min.css'],

  content: {
    highlight: {
      theme: 'github-light'
    }
  },

  runtimeConfig: {
    public: {
      authBaseUrl:process.env.NUXT_AUTH_URL|| 'http://localhost:6501',
      siteUrl: process.env.SITE_URL || 'http://localhost:3002'
    }
  }
})
