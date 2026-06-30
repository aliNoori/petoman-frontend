export default defineNuxtConfig({
    devtools: {enabled: false},

    // Modules
    modules: [
        '@pinia/nuxt',
    ],

    plugins: [
        //'~/plugins/auth.client.ts',
        '~/plugins/toast.client.ts',
        '~/plugins/axios.ts',
    ],

    // Development Server
    devServer: {
        port: 6503,
        host: '0.0.0.0',
    },

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
                {name: 'description', content: 'مارکت‌پلیس کامل حیوانات خانگی - فروشگاه، خدمات، دامپزشکی و سرگرمی'},
                {name: 'keywords', content: 'حیوانات خانگی, فروشگاه, خدمات, دامپزشک, پتومن'}
            ],
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css'
                },
                {
                    rel: 'stylesheet',
                    href: 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css'
                }
            ]
        }
    },

    // CSS Configuration
    css: ['~/assets/css/main.css'],

    // PostCSS
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            authBaseUrl: process.env.NUXT_AUTH_URL || 'http://localhost:6501',
            siteUrl: process.env.SITE_URL || 'http://localhost:3002'
        }
    },
});
