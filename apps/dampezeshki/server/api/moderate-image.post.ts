/**
 * Image Moderation API
 * فیلتر تصاویر نامناسب با استفاده از NSFW Detection
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { imageUrl, imageBase64 } = body

    // اعتبارسنجی
    if (!imageUrl && !imageBase64) {
      return {
        allowed: false,
        reason: 'تصویر ارسال نشده است'
      }
    }

    console.log('🖼️ Checking image...')

    // =====================================
    // روش 1: استفاده از NSFW.js (Client-side)
    // =====================================
    // این باید در فرانت‌اند اجرا بشه چون به browser API نیاز داره
    // ما اینجا فقط یه placeholder میذاریم

    // =====================================
    // روش 2: چک کردن URL
    // =====================================
    if (imageUrl) {
      // چک کردن اینکه URL معتبر باشه
      try {
        const url = new URL(imageUrl)
        
        // چک کردن دامنه‌های مشکوک
        const suspiciousDomains = [
          'pornhub', 'xvideos', 'xnxx', 'redtube', 
          'youporn', 'tube8', 'spankbang', 'xhamster'
        ]
        
        const hostname = url.hostname.toLowerCase()
        for (const domain of suspiciousDomains) {
          if (hostname.includes(domain)) {
            console.log('⛔ Image BLOCKED - suspicious domain:', hostname)
            return {
              allowed: false,
              reason: '🚫 منبع تصویر نامعتبر است'
            }
          }
        }
      } catch (error) {
        console.log('⚠️ Invalid URL')
        return {
          allowed: false,
          reason: 'آدرس تصویر نامعتبر است'
        }
      }
    }

    // =====================================
    // روش 3: چک کردن حجم و نوع فایل
    // =====================================
    if (imageBase64) {
      // چک کردن اینکه base64 معتبر باشه
      const sizeInMB = (imageBase64.length * 3 / 4) / (1024 * 1024)
      
      // محدود کردن حجم فایل (مثلاً 10MB)
      if (sizeInMB > 10) {
        console.log('⛔ Image BLOCKED - too large:', sizeInMB, 'MB')
        return {
          allowed: false,
          reason: 'حجم تصویر بیش از حد مجاز است (حداکثر 10MB)'
        }
      }

      // چک کردن فرمت
      if (!imageBase64.startsWith('data:image/')) {
        console.log('⛔ File BLOCKED - not an image')
        return {
          allowed: false,
          reason: 'فایل ارسالی تصویر نیست'
        }
      }
    }

    console.log('✅ Image approved (basic checks passed)')
    return {
      allowed: true,
      warning: 'تصویر فقط با چک‌های ابتدایی بررسی شده. برای فیلتر دقیق‌تر، از NSFW.js در فرانت‌اند استفاده کنید.'
    }

  } catch (error: any) {
    console.error('❌ Error in image moderation:', error)
    return {
      allowed: false,
      reason: 'خطا در بررسی تصویر'
    }
  }
})
