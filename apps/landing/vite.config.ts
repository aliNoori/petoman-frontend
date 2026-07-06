import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // <--- این خط باید وجود داشته باشد

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(), // <--- این خط باید وجود داشته باشد
    ],
})