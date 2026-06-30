<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
      <!-- Success Icon -->
      <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
        <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-check text-4xl text-white"></i>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">رزرو شما تایید شد!</h1>
        <p class="text-emerald-100">پرداخت با موفقیت انجام شد</p>
      </div>

      <!-- Booking Details -->
      <div class="p-6 space-y-4">
        <!-- Tracking Code -->
        <div class="bg-emerald-50 rounded-xl p-4 text-center">
          <p class="text-sm text-gray-600 mb-1">کد پیگیری</p>
          <p class="text-2xl font-bold text-emerald-600 tracking-widest">{{ trackingCode }}</p>
        </div>

        <!-- Details -->
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">دکتر</span>
            <span class="font-medium text-gray-900">دکتر علی احمدی</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">نوع خدمت</span>
            <span class="font-medium text-gray-900">گفتگوی متنی</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500">مبلغ پرداختی</span>
            <span class="font-medium text-emerald-600">۱۲۶,۰۰۰ تومان</span>
          </div>
        </div>

        <!-- Notice -->
        <div class="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <i class="ti ti-info-circle text-blue-600 text-xl"></i>
          <p class="text-sm text-blue-700">
            پیامک تایید رزرو برای شما ارسال شد. در زمان مقرر وارد بخش چت شوید.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <NuxtLink 
            to="/consult"
            class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium text-center hover:bg-emerald-700 transition-colors"
          >
            رفتن به چت
          </NuxtLink>
          <NuxtLink 
            to="/"
            class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors"
          >
            صفحه اصلی
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'رزرو موفق - پتومن'
})

// Generate tracking code
const trackingCode = ref('')

onMounted(() => {
  // Generate random tracking code
  trackingCode.value = Math.random().toString(36).substring(2, 8).toUpperCase()
})
</script>
