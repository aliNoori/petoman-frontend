<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-green-100">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-xl">🛒</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-green-800">پت مارکت</h1>
            <p class="text-sm text-gray-600">مرکز خرید حیوانات خانگی</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="bg-gradient-to-l from-green-600 to-emerald-600 text-white py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-5xl font-bold mb-6">🛒 پت مارکت</h2>
        <p class="text-2xl opacity-90 mb-8">مرکز جامع خرید حیوانات خانگی</p>
        <p class="text-lg opacity-80 mb-12">تمام نیازهای حیوان خانگی‌تان را از بهترین فروشگاه‌ها تهیه کنید</p>
      </div>
    </div>

    <!-- Store Categories -->
    <div class="max-w-6xl mx-auto px-4 py-16">
      <h3 class="text-4xl font-bold text-center mb-4">فروشگاه‌های ما</h3>
      <p class="text-xl text-gray-600 text-center mb-16">چهار اپ تخصصی برای تمام نیازهای شما</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Shop عمومی -->
        <div @click="redirectToShop" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
            <div class="text-6xl">🏪</div>
            <div class="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Nuxt 3
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-bold mb-3 text-blue-800">شاپ عمومی</h4>
            <p class="text-gray-600 mb-4 text-sm">همه چیز برای حیوانات خانگی</p>
            <button class="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 w-full font-medium">
              ورود به فروشگاه
            </button>
          </div>
        </div>

        <!-- Pet Store -->
        <div @click="redirectToPetStore" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center relative">
            <div class="text-6xl">🐾</div>
            <div class="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Nuxt 3
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-bold mb-3 text-purple-800">پت استور</h4>
            <p class="text-gray-600 mb-4 text-sm">برندهای معتبر سگ و گربه</p>
            <button class="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 w-full font-medium">
              ورود به فروشگاه
            </button>
          </div>
        </div>

        <!-- Pet Shop -->
        <div @click="redirectToPetShop" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center relative">
            <div class="text-6xl">🐕</div>
            <div class="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Nuxt 3
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-bold mb-3 text-orange-800">پت شاپ</h4>
            <p class="text-gray-600 mb-4 text-sm">خدمات تخصصی نگهداری</p>
            <button class="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 w-full font-medium">
              ورود به فروشگاه
            </button>
          </div>
        </div>

        <!-- Veterinary -->
        <div @click="redirectToVeterinary" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative">
            <div class="text-6xl">🩺</div>
            <div class="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Nuxt 3
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-bold mb-3 text-red-800">دامپزشکی</h4>
            <p class="text-gray-600 mb-4 text-sm">خدمات پزشکی و درمانی</p>
            <button class="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 w-full font-medium">
              ورود به کلینیک
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech Info -->
    <div class="bg-blue-50 py-12">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h3 class="text-2xl font-bold mb-6">تکنولوژی‌های استفاده شده</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-3xl mb-2">⚡</div>
            <h4 class="font-bold">Nuxt 3</h4>
            <p class="text-sm text-gray-600">فرامورک Vue.js</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-3xl mb-2">🎨</div>
            <h4 class="font-bold">Tailwind CSS</h4>
            <p class="text-sm text-gray-600">طراحی ریسپانسیو</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-3xl mb-2">🔍</div>
            <h4 class="font-bold">SEO Optimized</h4>
            <p class="text-sm text-gray-600">بهینه برای موتورها</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-3xl mb-2">📱</div>
            <h4 class="font-bold">RTL Support</h4>
            <p class="text-sm text-gray-600">پشتیبانی فارسی</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <div class="flex items-center justify-center space-x-4 space-x-reverse mb-8">
          <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-xl">🛒</span>
          </div>
          <h3 class="text-2xl font-bold">پت مارکت</h3>
        </div>
        <p class="text-gray-400 mb-6">
          مرکز جامع خرید حیوانات خانگی - همراه شما در نگهداری بهتر از دوستان خانگی‌تان
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Navigation methods - هر فروشگاه یک اپ Nuxt 3 جداگانه است
const redirectToShop = () => {
  // شاپ عمومی Nuxt 3 روی پورت 3001
  window.open('http://localhost:3001', '_blank');
};

const redirectToPetStore = () => {
  // پت استور Nuxt 3 روی پورت 3004 (changed from 3006)
  window.open('http://localhost:3004', '_blank');
};

const redirectToPetShop = () => {
  // پت شاپ Nuxt 3 روی پورت 3007
  window.open('http://localhost:3007', '_blank');
};

const redirectToVeterinary = () => {
  // دامپزشکی Nuxt 3 روی پورت 3008
  window.open('http://localhost:3008', '_blank');
};
</script>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}
</style>
