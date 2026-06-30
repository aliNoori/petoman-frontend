import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@petoman/ui',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: process.env.NODE_ENV === 'production' ? ['vue'] : [],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})