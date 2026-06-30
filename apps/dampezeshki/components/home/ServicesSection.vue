<template>
<template>
  <section class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">خدمات تخصصی پتومن</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          ارائه کامل‌ترین خدمات دامپزشکی با کیفیت برتر و دسترسی آسان
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Online Consultation -->
        <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-video text-white w-8 h-8"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <i class="ti ti-check text-white w-3 h-3"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">مشاوره آنلاین</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            دسترسی فوری به متخصصان دامپزشک با ویدیوکال HD
          </p>
          <NuxtLink 
            to="/consult" 
            class="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:underline"
          >
            شروع مشاوره
            <i class="ti ti-arrow-left mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>

        <!-- Home Visit -->
        <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-home text-white w-8 h-8"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <i class="ti ti-star text-white w-3 h-3"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">ویزیت در منزل</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            دامپزشک با تجهیزات کامل به منزل شما مراجعه می‌کند
          </p>
          <NuxtLink 
            to="/home-visit" 
            class="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group-hover:underline"
          >
            رزرو ویزیت
            <i class="ti ti-arrow-left mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>

        <!-- Clinics -->
        <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-building-hospital text-white w-8 h-8"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="ti ti-map-pin text-white w-3 h-3"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">کلینیک‌های معتبر</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            شبکه گسترده کلینیک‌های مجهز در سراسر کشور
          </p>
          <NuxtLink 
            to="/clinics" 
            class="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group-hover:underline"
          >
            یافتن کلینیک
            <i class="ti ti-arrow-left mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>

        <!-- Pharmacy -->
        <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-pill text-white w-8 h-8"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <i class="ti ti-truck text-white w-3 h-3"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">داروخانه آنلاین</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            سفارش آنلاین دارو و مکمل با ارسال رایگان
          </p>
          <NuxtLink 
            to="/pharmacy" 
            class="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group-hover:underline"
          >
            خرید آنلاین
            <i class="ti ti-arrow-left mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>

        <!-- Lab Tests -->
        <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-test-pipe text-white w-8 h-8"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <i class="ti ti-microscope text-white w-3 h-3"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">آزمایشگاه تخصصی</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            انجام آزمایشات دقیق با جدیدترین تکنولوژی
          </p>
          <NuxtLink 
            to="/lab" 
            class="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors group-hover:underline"
          >
            رزرو آزمایش
            <i class="ti ti-arrow-left mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>

        <!-- Vaccination -->
        <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-vaccine text-white w-8 h-8"></i>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <i class="ti ti-shield-check text-white w-3 h-3"></i>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">واکسیناسیون</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            برنامه کامل واکسیناسیون برای تمام سنین
          </p>
          <NuxtLink 
            to="/vaccination" 
            class="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition-colors group-hover:underline"
          >
            برنامه واکسن
            <i class="ti ti-arrow-left mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
</template>

<script setup lang="ts">
// No additional logic needed for now
</script>
