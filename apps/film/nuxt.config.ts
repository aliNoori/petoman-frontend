// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Development Server
  devServer: {
    port: 6505
  },
  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Aliases configuration
  alias: {
    '~': resolve(__dirname, './'),
    '@': resolve(__dirname, './')
  },
  
  // Compatibility
  compatibilityDate: '2024-04-03',
  
  // Modules
  modules: [
    '@pinia/nuxt',
      '@nuxtjs/tailwindcss'],

  plugins: [
    //'~/plugins/auth.client.ts',
    '~/plugins/axios.ts',
  ],
  // Tailwind CSS Configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },
  
  // App Configuration
  app: {

     baseURL: '/film/',
     buildAssetsDir: '_nuxt/',

    head: {
      title: 'پت فیلم پتومن',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      meta: [
        { name: 'description', content: 'پلتفرم ویدیوهای آموزشی و سرگرمی حیوانات خانگی - آموزش، مراقبت و سرگرمی' },
        { name: 'keywords', content: 'فیلم حیوانات, آموزش حیوانات, ویدیو پتومن, سرگرمی حیوانات خانگی' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons-sprite.svg'
        },
        {
          rel: 'stylesheet',
          href: 'https://vjs.zencdn.net/8.6.1/video.min.css'
        }
      ],
      script: [
        {
          src: 'https://vjs.zencdn.net/8.6.1/video.min.js',
          defer: true
        },
        {
          src: 'https://vjs.zencdn.net/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js',
          defer: true
        }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    // Public keys (exposed to the client-side as well)
    public: {
      authBaseUrl:process.env.NUXT_AUTH_URL|| 'http://localhost:6501',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appName: 'فیلم حیوانات'
    }
  },

  // CSS Configuration
  css: ['~/assets/css/main.css']
});
