<template>
  <section class="py-20 bg-gradient-to-r from-red-500 via-red-600 to-red-700 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-black bg-opacity-10"></div>
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
      <div class="absolute bottom-10 right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white bg-opacity-5 rounded-full"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="text-center lg:text-right text-white">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-8 backdrop-blur-sm">
            <i class="ti ti-phone text-white w-10 h-10 animate-pulse"></i>
          </div>
          
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            اورژانس ۲۴/۷
          </h2>
          <p class="text-xl sm:text-2xl mb-8 text-red-100 leading-relaxed">
            در شرایط اضطراری، ما همیشه در کنار شما هستیم
          </p>
          
          <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">۲۴/۷</div>
              <div class="text-red-100 text-sm">آماده‌باش</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">&lt; ۵ دقیقه</div>
              <div class="text-red-100 text-sm">زمان پاسخ</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">۱۰۰+</div>
              <div class="text-red-100 text-sm">متخصص اورژانس</div>
            </div>
          </div>
        </div>

        <!-- Action Card -->
        <div class="relative">
          <div class="bg-white rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white border-opacity-20">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="ti ti-heart-rate-monitor text-red-600 w-8 h-8"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                نیاز به کمک فوری؟
              </h3>
              <p class="text-gray-600">
                تیم اورژانس ما آماده کمک فوری است
              </p>
            </div>
            
            <div class="space-y-4">
              <!-- Emergency Call -->
              <a 
                href="tel:+989123456789" 
                class="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <i class="ti ti-phone ml-3 w-6 h-6"></i>
                تماس فوری اورژانس
              </a>
              
              <!-- Online Emergency -->
              <NuxtLink 
                to="/consult?urgent=true" 
                class="flex items-center justify-center w-full bg-white hover:bg-gray-50 text-red-600 border-2 border-red-200 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                <i class="ti ti-video ml-3 w-6 h-6"></i>
                مشاوره آنلاین فوری
              </NuxtLink>
              
              <!-- Find Clinic -->
              <NuxtLink 
                to="/clinics?emergency=true" 
                class="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300"
              >
                <i class="ti ti-map-pin ml-3 w-6 h-6"></i>
                نزدیک‌ترین کلینیک اورژانس
              </NuxtLink>
            </div>

            <!-- Emergency Tips -->
            <div class="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h4 class="font-bold text-gray-900 mb-4 flex items-center">
                <i class="ti ti-info-circle ml-2 w-5 h-5 text-blue-500"></i>
                نکات ضروری اورژانس
              </h4>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <i class="ti ti-circle-check ml-2 w-4 h-4 text-green-500 mt-0.5"></i>
                  حیوان را آرام نگه دارید
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check ml-2 w-4 h-4 text-green-500 mt-0.5"></i>
                  علائم را دقیق توضیح دهید
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check ml-2 w-4 h-4 text-green-500 mt-0.5"></i>
                  سوابق پزشکی را آماده کنید
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Professional emergency banner
</script>
