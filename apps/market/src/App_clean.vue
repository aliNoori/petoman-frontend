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
        
        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="جستجو در تمام فروشگاه‌ها..." 
            class="w-full px-6 py-4 pr-12 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-green-300"
          >
          <button class="absolute left-2 top-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
            🔍
          </button>
        </div>
      </div>
    </div>

    <!-- Store Categories -->
    <div class="max-w-6xl mx-auto px-4 py-16">
      <h3 class="text-4xl font-bold text-center mb-4">فروشگاه‌های ما</h3>
      <p class="text-xl text-gray-600 text-center mb-16">سه فروشگاه تخصصی برای تمام نیازهای شما</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <!-- Shop عمومی -->
        <div @click="redirectToShop" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-56 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
            <div class="text-8xl">🏪</div>
            <div class="absolute top-4 right-4 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              عمومی
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-3xl font-bold mb-4 text-blue-800">شاپ عمومی</h4>
            <p class="text-gray-600 mb-6 text-lg">همه چیز برای حیوانات خانگی - از غذا تا اسباب‌بازی</p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>🏷️ بیش از 5000 محصول</span>
              <span>⭐ 4.8 امتیاز</span>
            </div>
            <button class="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 w-full font-medium text-lg">
              ورود به فروشگاه
            </button>
          </div>
        </div>

        <!-- Pet Store -->
        <div @click="redirectToPetStore" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-56 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center relative">
            <div class="text-8xl">🐾</div>
            <div class="absolute top-4 right-4 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              تخصصی
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-3xl font-bold mb-4 text-purple-800">پت استور</h4>
            <p class="text-gray-600 mb-6 text-lg">فروشگاه تخصصی سگ و گربه با برندهای معتبر</p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>🏷️ برندهای مطرح</span>
              <span>⭐ 4.9 امتیاز</span>
            </div>
            <button class="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 w-full font-medium text-lg">
              ورود به فروشگاه
            </button>
          </div>
        </div>

        <!-- Pet Shop -->
        <div @click="redirectToPetShop" 
             class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3">
          <div class="h-56 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center relative">
            <div class="text-8xl">🐕</div>
            <div class="absolute top-4 right-4 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              حرفه‌ای
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-3xl font-bold mb-4 text-orange-800">پت شاپ</h4>
            <p class="text-gray-600 mb-6 text-lg">فروشگاه حرفه‌ای با خدمات تخصصی نگهداری</p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>🏷️ خدمات ویژه</span>
              <span>⭐ 4.7 امتیاز</span>
            </div>
            <button class="bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 w-full font-medium text-lg">
              ورود به فروشگاه
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-gray-100 py-16">
      <div class="max-w-6xl mx-auto px-4">
        <h3 class="text-3xl font-bold text-center mb-12">چرا پت مارکت؟</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl mb-4">🚚</div>
            <h4 class="font-bold mb-2">ارسال سریع</h4>
            <p class="text-gray-600">ارسال رایگان بالای 500 هزار تومان</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">🛡️</div>
            <h4 class="font-bold mb-2">تضمین کیفیت</h4>
            <p class="text-gray-600">تضمین اصالت تمام محصولات</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">💬</div>
            <h4 class="font-bold mb-2">مشاوره رایگان</h4>
            <p class="text-gray-600">مشاوره تخصصی از کارشناسان</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">📞</div>
            <h4 class="font-bold mb-2">پشتیبانی 24/7</h4>
            <p class="text-gray-600">پاسخگویی در تمام ساعات شبانه‌روز</p>
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
        <div class="flex justify-center space-x-8 space-x-reverse text-sm">
          <a href="#" class="hover:text-green-400">درباره ما</a>
          <a href="#" class="hover:text-green-400">تماس با ما</a>
          <a href="#" class="hover:text-green-400">قوانین و مقررات</a>
          <a href="#" class="hover:text-green-400">حریم خصوصی</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Navigation methods - هر فروشگاه یک اپ جداگانه است
const redirectToShop = () => {
  // فروشگاه عمومی روی پورت 3005
  window.open('http://localhost:3005', '_blank');
};

const redirectToPetStore = () => {
  // پت استور روی پورت 3006  
  window.open('http://localhost:3006', '_blank');
};

const redirectToPetShop = () => {
  // پت شاپ روی پورت 3007
  window.open('http://localhost:3007', '_blank');
};
</script>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}
</style>
