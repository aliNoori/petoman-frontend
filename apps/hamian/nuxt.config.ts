// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Compatibility date
  compatibilityDate: '2025-08-11',
  
  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Aliases configuration
  alias: {
    '~': resolve(__dirname, './'),
    '@': resolve(__dirname, './')
  },


  // CSS framework
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],

  plugins: [
    //'~/plugins/auth.client.ts',
    '~/plugins/axios.ts',
    '~/plugins/dayjs.ts'
  ],

  // App configuration
  app: {

    baseURL: '/hamian/',
    buildAssetsDir: '_nuxt/',

    head: {
      title: 'حامیان حیوانات - پتومن',
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'پلتفرم حمایت از حیوانات و جمع‌آوری کمک‌های مالی برای درمان و نگهداری حیوانات بی‌سرپناه' },
        { name: 'keywords', content: 'حامیان حیوانات، کمک مالی، حیوانات بی‌سرپناه، نجات حیوانات' },
        { property: 'og:title', content: 'حامیان حیوانات - پتومن' },
        { property: 'og:description', content: 'به جمع حامیان حیوانات بپیوندید و در نجات جان‌های بی‌گناه مشارکت کنید' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS configuration for RTL and custom fonts
  css: [
    '~/assets/css/main.css',
    '~/assets/icon/tabler-icons.css'
  ],

  // Build configuration
  build: {
    transpile: ['@headlessui/vue', '@heroicons/vue', 'swiper']
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on the server-side)
    apiSecret: process.env.NUXT_API_SECRET,
    
    // Public keys (exposed to the client-side as well)
    public: {
      authBaseUrl:process.env.NUXT_AUTH_URL|| 'http://localhost:6501',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appName: 'حامیان حیوانات'
    }
  },

  // Server-side rendering
  ssr: true,

  // Development server
  devServer: {
    port: 3005
  }
})
