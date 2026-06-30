<template>
  <NuxtLayout>
    <NuxtPage />
    <GlobalToast />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead} from "nuxt/app"; // استفاده از import استاندارد نوست ۳

// تنظیمات سئو و متا تگ‌ها
useHead({
  title: 'پت دامپزشکی | نوبت‌دهی آنلاین، ویزیت دامپزشک و داروخانه',
  meta: [
    {
      name: 'description',
      content: 'بزرگترین پلتفرم آنلاین دامپزشکی، داروخانه و کلینیک حیوانات خانگی در ایران. رزرو نوبت، مشاوره آنلاین و خرید دارو.'
    },
    {
      name: 'keywords',
      content: 'دامپزشک آنلاین, نوبت دهی دامپزشکی, داروخانه آنلاین حیوانات, کلینیک دامپزشکی, ویزیت آنلاین گربه و سگ'
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    // تگ‌های امنیتی و Open Graph برای شبکه‌های اجتماعی
    { name: 'referrer', content: 'strict-origin-when-cross-origin' },
    { property: 'og:title', content: 'پت دامپزشکی | نوبت‌دهی و مشاوره آنلاین' },
    { property: 'og:description', content: 'رزرو نوبت دامپزشک، خرید دارو و لوازم حیوانات خانگی به صورت آنلاین.' },
    { property: 'og:type', content: 'website' },
    // آدرس لوگو یا تصویر پیش‌فرض برای اشتراک‌گذاری
    // { property: 'og:image', content: '/images/og-image.jpg' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    // اگر PWA دارید
    // { rel: 'manifest', href: '/manifest.json' },
  ],
});
</script>