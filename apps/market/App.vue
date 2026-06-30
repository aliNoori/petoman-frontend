<template>
  <NuxtLayout>
    <NuxtPage />
    <GlobalToast />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead} from "nuxt/app";

// فقط متا تگ‌های عمومی را اینجا تنظیم کنید
useHead({
  title: 'پت مارکت - فروشگاه آنلاین حیوانات خانگی',
  meta: [
    { name: 'description', content: 'بزرگترین فروشگاه آنلاین محصولات حیوانات خانگی در ایران' },
    { name: 'keywords', content: 'حیوانات خانگی، فروشگاه، غذای حیوانات' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
});
</script>
