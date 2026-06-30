<template>
  <div class="min-h-screen bg-white font-sans" dir="rtl">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
    <Notification />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useSocketStore } from '~/stores/socket';
/*
const authStore = useAuthStore();
const socketStore = useSocketStore();

// مدیریت سوکت در کلاینت
onMounted(() => {
  // اگر کاربر لاگین بود، سوکت را متصل کن
  if (authStore.isAuthenticated) {
    socketStore.connect(authStore.token);
  }
});

// گوش دادن به تغییرات توکن (لاگین/لاگ‌اوت)
watch(() => authStore.token, (newToken) => {
  if (newToken) {
    socketStore.connect(newToken);
  } else {
    socketStore.disconnect();
  }
}, { immediate: true });*/

// قطع سوکت هنگام خروج از صفحه (اختیاری - بستگی به نیاز شما دارد)
// onUnmounted(() => {
//   socketStore.disconnect();
// });
</script>