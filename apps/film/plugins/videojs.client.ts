// plugins/videojs.client.ts
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  // پلاگین برای تنظیمات کلاینت ساید
  if (typeof window !== 'undefined') {
    // تنظیمات مربوط به ویدیو پلیر
    console.log('Video player client plugin loaded')
  }
})
