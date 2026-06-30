<!-- pages/vet/error.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
        <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">پرداخت ناموفق بود</h2>
        <div class="mt-4 space-y-2">
          <p v-if="errorMessage" class="text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
            {{ errorMessage }}
          </p>
          <p v-else class="text-gray-600">
            متاسفانه پرداخت شما با موفقیت انجام نشد. ممکن است موجودی کافی نبوده یا مشکلی در درگاه بانکی رخ داده است.
          </p>
        </div>
      </div>
      <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <NuxtLink
            to="/vet/checkout"
            class="flex-1 justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
        >
          تلاش مجدد
        </NuxtLink>
        <NuxtLink
            to="/vet/clinics"
            class="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          بازگشت به لیست کلینیک‌ها
        </NuxtLink>
      </div>
      <div v-if="orderCode" class="pt-4 border-t border-gray-100">
        <p class="text-sm text-gray-500">
          کد پیگیری سفارش: <span class="font-mono font-bold text-gray-900">{{ orderCode }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// دریافت پیام خطا از URL
const errorMessage = computed(() => {
  return (route.query.error as string) || '';
});

// دریافت کد سفارش (اختیاری)
const orderCode = computed(() => {
  return (route.query.order as string) || '';
});
</script>

<!-- اگر نیاز به استایل خاصی دارید، اینجا بنویسید. در غیر این صورت می‌توانید این بخش را حذف کنید -->
<style scoped>
/* استایل‌های سفارشی در اینجا */
</style>