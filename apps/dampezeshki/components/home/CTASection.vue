<template>
  <section class="py-16 bg-gradient-to-r from-primary-600 to-blue-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <!-- Main Heading -->
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4 font-vazir">
          همین حالا شروع کنید
        </h2>
        
        <!-- Description -->
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-vazir">
          حیوان خانگی شما منتظر بهترین مراقبت است. همین الان اولین قدم رو بردارید
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <NuxtLink
            to="/consult"
            class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-primary-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 font-vazir"
          >
            مشاوره رایگان
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </NuxtLink>
          
          <NuxtLink
            to="/home-visit"
            class="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-xl text-white bg-transparent hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl transition-all duration-300 font-vazir"
          >
            رزرو ویزیت در منزل
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </NuxtLink>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 text-white">
          <div class="text-center">
            <div class="text-3xl mb-3">⚡</div>
            <h3 class="text-lg font-semibold mb-2 font-vazir">پاسخ سریع</h3>
            <p class="text-blue-100 text-sm font-vazir">کمتر از ۳۰ دقیقه</p>
          </div>
          
          <div class="text-center">
            <div class="text-3xl mb-3">👨‍⚕️</div>
            <h3 class="text-lg font-semibold mb-2 font-vazir">متخصصان مجرب</h3>
            <p class="text-blue-100 text-sm font-vazir">بیش از ۱۲۰۰ دامپزشک</p>
          </div>
          
          <div class="text-center">
            <div class="text-3xl mb-3">🔒</div>
            <h3 class="text-lg font-semibold mb-2 font-vazir">امنیت کامل</h3>
            <p class="text-blue-100 text-sm font-vazir">حفاظت از اطلاعات شما</p>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="mt-12 p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
          <div class="flex flex-col sm:flex-row items-center justify-between">
            <div class="text-center sm:text-right mb-4 sm:mb-0">
              <h3 class="text-xl font-semibold text-white mb-2 font-vazir">اورژانس ۲۴ ساعته</h3>
              <p class="text-blue-100 font-vazir">برای مواقع ضروری با ما تماس بگیرید</p>
            </div>
            <div class="flex items-center space-x-4 space-x-reverse">
              <a 
                href="tel:+982112345678"
                class="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-vazir"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                تماس اورژانس
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No additional logic needed for now
</script>
