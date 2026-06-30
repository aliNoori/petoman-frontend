export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Compatibility
  compatibilityDate: '2024-04-03',
  
  // App Configuration
  app: {
    head: {
      title: 'مارکت پتومن - مارکت‌پلیس کامل حیوانات خانگی',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      meta: [
        { name: 'description', content: 'مارکت‌پلیس کامل حیوانات خانگی - فروشگاه، خدمات، دامپزشکی و سرگرمی' },
        { name: 'keywords', content: 'حیوانات خانگی, فروشگاه, خدمات, دامپزشک, پتومن' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css'
        }
      ]
    }
  },

  // CSS Configuration
  css: ['~/assets/css/main.css']
});
