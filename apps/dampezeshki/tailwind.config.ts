import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    'app.vue',
    'components/**/*.{vue,ts}',
    'pages/**/*.{vue,ts}',
    'layouts/**/*.{vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // sky-500
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      fontFamily: {
        'vazir': ['Vazir', 'sans-serif'],
        'sans': ['Vazir', 'Inter', 'Tahoma', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
