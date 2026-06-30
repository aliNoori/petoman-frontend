<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">

      <!-- حالت لودینگ -->
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h3 class="text-lg font-medium text-gray-700">در حال بررسی وضعیت پرداخت...</h3>
        <p class="text-sm text-gray-500">لطفاً چند لحظه صبر کنید.</p>
      </div>

      <!-- حالت موفق -->
      <div v-else-if="paymentStatus === 'SUCCESS'" class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">پرداخت موفق بود!</h2>
          <p class="mt-2 text-gray-600">
            {{ successMessage || 'سفارش شما با موفقیت ثبت شد.' }}
          </p>
          <p v-if="orderCode" class="mt-2 text-sm text-gray-500">
            کد پیگیری: <span class="font-mono font-bold text-gray-900">{{ orderCode }}</span>
          </p>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="space-y-3">
          <NuxtLink
              :to="redirectUrl"
              class="block w-full text-center rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            مشاهده جزئیات سفارش
          </NuxtLink>

          <NuxtLink
              to="/profile"
              class="block w-full text-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            بازگشت به لیست سفارشات
          </NuxtLink>
        </div>
      </div>

      <!-- حالت ناموفق -->
      <div v-else-if="paymentStatus === 'FAILED'" class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">پرداخت انجام نشد</h2>
          <p class="mt-2 text-gray-600">متاسفانه تراکنش با خطا مواجه شد یا لغو گردید.</p>
        </div>
        <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <NuxtLink
              to="/vet/checkout"
              class="flex-1 justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </NuxtLink>
          <NuxtLink
              :href="`tel:${supportPhone}`"
              class="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            تماس با پشتیبانی
          </NuxtLink>
        </div>
      </div>

      <!-- حالت نامشخص (نیاز به بررسی دستی) -->
      <div v-else-if="paymentStatus === 'UNKNOWN'" class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <svg class="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">وضعیت نامشخص</h2>
          <p class="mt-2 text-gray-600">
            سیستم ما موفقیت پرداخت را تایید نکرده است، اما ممکن است پول از حساب شما کسر شده باشد.
          </p>
          <p class="mt-2 text-sm text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
            نگران نباشید! اگر پول کسر شده باشد، نوبت به صورت خودکار ثبت می‌شود.
          </p>
        </div>
        <button
            @click="checkStatus"
            :disabled="isLoading"
            class="w-full flex justify-center items-center rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <span v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          بررسی مجدد وضعیت
        </button>
        <div v-if="orderCode" class="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          کد پیگیری: <span class="font-mono font-bold text-gray-900">{{ orderCode }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useNuxtApp } from 'nuxt/app';
import { type AxiosInstance } from 'axios';

const route = useRoute();
const router = useRouter();

// دریافت پارامترها از URL
const txId = computed(() => (route.query.txId as string) || '');
const orderCode = computed(() => (route.query.orderId as string) || '');
const supportPhone = '02112345678'; // شماره پشتیبانی خود را وارد کنید

const isLoading = ref(true);
const paymentStatus = ref<'SUCCESS' | 'FAILED' | 'UNKNOWN' | null>(null);
const redirectUrl = ref('/profile'); // پیش‌فرض به لیست نوبت‌ها
const successMessage = ref('');

const { $axios } = useNuxtApp();
const axios = $axios as AxiosInstance;

// تابع چک کردن وضعیت از بک‌اند
const checkStatus = async () => {
  isLoading.value = true;
  try {
    // فراخوانی API جدید برای بررسی وضعیت دستی
    const response = await axios.get('/payments/check-status', {
      params: { txId: txId.value }
    });

    // بررسی ساختار پاسخ API
    // فرض بر این است که پاسخ API شامل success, orderCode, appointment, message است
    if (response.data && response.data.success) {
      paymentStatus.value = 'SUCCESS';
      successMessage.value = response.data.message || 'نوبت شما با موفقیت ثبت شد.';

      // اگر appointment وجود داشت، می‌توانیم جزئیات بیشتری نشان دهیم
      // اما برای ریدایرکت، فعلاً به صفحه لیست نوبت‌ها یا صفحه تایید هدایت می‌کنیم

      // اگر می‌خواهید به صفحه خاصی با پارامترهای خاص ریدایرکت کنید:
      if (orderCode.value) {
        redirectUrl.value = `/vet/appointments?order=${orderCode.value}`;
      }
    } else {
      // اگر تراکنش در دیتابیس موفق نبود، وضعیت را UNKNOWN نگه می‌داریم
      paymentStatus.value = 'UNKNOWN';
    }
  } catch (error) {
    console.error('Error checking status:', error);
    // در صورت خطای شبکه، وضعیت را UNKNOWN می‌گذاریم
    paymentStatus.value = 'UNKNOWN';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // چک کردن اولیه
  checkStatus();

  // اگر وضعیت نامشخص بود، هر ۵ ثانیه چک کن (حداکثر تا ۱ دقیقه)
  if (paymentStatus.value === 'UNKNOWN') {
    let attempts = 0;
    const maxAttempts = 12; // 12 * 5 seconds = 60 seconds
    const interval = setInterval(() => {
      attempts++;
      checkStatus();
      if (paymentStatus.value !== 'UNKNOWN' || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 5000);
  }
});
</script>