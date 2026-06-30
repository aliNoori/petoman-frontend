<template>
  <div class="p-6 space-y-4" dir="rtl">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">داشبورد کاربر</h1>
      <div class="flex items-center gap-2">
        <router-link
          to="/users/visits"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          رزروها
        </router-link>
        <router-link
          to="/users/orders"
          class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          سفارش‌ها
        </router-link>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <p class="text-sm text-gray-600">
        این بخش فعلاً صفحه‌ی پایه است (برای رفع خطای مسیرها). اگر بگید پنل کاربر دقیقاً چه قابلیت‌هایی باید داشته باشه، همین‌جا کاملش می‌کنم.
      </p>
    </div>
  </div>
</template>
