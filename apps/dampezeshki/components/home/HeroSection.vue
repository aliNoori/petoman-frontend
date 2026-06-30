<template>
<template>
  <section class="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-60"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="text-center">
        <!-- Main Heading -->
        <div class="mb-8">
          <div class="flex items-center justify-center mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i class="ti ti-heart-handshake text-white w-10 h-10"></i>
            </div>
          </div>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">پتومن</span>
          </h1>
          <p class="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            پلتفرم پیشرفته دامپزشکی برای مراقبت بهتر از حیوانات خانگی
          </p>
        </div>

        <!-- Main CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <NuxtLink 
            to="/consult"
            class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <i class="ti ti-video ml-3 w-6 h-6"></i>
            شروع مشاوره آنلاین
          </NuxtLink>
          <a 
            href="tel:+989123456789"
            class="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <i class="ti ti-phone ml-3 w-6 h-6 text-red-500"></i>
            تماس اورژانس
          </a>
        </div>

        <!-- Quick Access Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <NuxtLink to="/clinics" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <i class="ti ti-building-hospital text-green-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">کلینیک‌ها</h3>
            <p class="text-sm text-gray-500">نزدیک‌ترین کلینیک</p>
          </NuxtLink>
          
          <NuxtLink to="/pharmacy" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <i class="ti ti-pill text-purple-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">داروخانه</h3>
            <p class="text-sm text-gray-500">سفارش آنلاین</p>
          </NuxtLink>
          
          <NuxtLink to="/home-visit" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <i class="ti ti-home text-orange-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">ویزیت منزل</h3>
            <p class="text-sm text-gray-500">در محل شما</p>
          </NuxtLink>
          
          <NuxtLink to="/lab" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
              <i class="ti ti-test-pipe text-teal-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">آزمایشگاه</h3>
            <p class="text-sm text-gray-500">تست‌های دقیق</p>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">۱۲۰۰+</div>
            <div class="text-gray-600 text-sm">دامپزشک متخصص</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">۵۰K+</div>
            <div class="text-gray-600 text-sm">مشاوره موفق</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">۲۴/۷</div>
            <div class="text-gray-600 text-sm">پشتیبانی آنلاین</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Professional hero section
</script>

        <!-- Main CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <NuxtLink 
            to="/consult"
            class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <i class="ti ti-video ml-3 w-6 h-6"></i>
            شروع مشاوره آنلاین
          </NuxtLink>
          <a 
            href="tel:+989123456789"
            class="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <i class="ti ti-phone ml-3 w-6 h-6 text-red-500"></i>
            تماس اورژانس
          </a>
        </div>

        <!-- Quick Access Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <NuxtLink to="/clinics" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <i class="ti ti-building-hospital text-green-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">کلینیک‌ها</h3>
            <p class="text-sm text-gray-500">نزدیک‌ترین کلینیک</p>
          </NuxtLink>
          
          <NuxtLink to="/pharmacy" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <i class="ti ti-pill text-purple-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">داروخانه</h3>
            <p class="text-sm text-gray-500">سفارش آنلاین</p>
          </NuxtLink>
          
          <NuxtLink to="/home-visit" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <i class="ti ti-home text-orange-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">ویزیت منزل</h3>
            <p class="text-sm text-gray-500">در محل شما</p>
          </NuxtLink>
          
          <NuxtLink to="/lab" class="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
              <i class="ti ti-test-pipe text-teal-600 w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">آزمایشگاه</h3>
            <p class="text-sm text-gray-500">تست‌های دقیق</p>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">۱۲۰۰+</div>
            <div class="text-gray-600 text-sm">دامپزشک متخصص</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">۵۰K+</div>
            <div class="text-gray-600 text-sm">مشاوره موفق</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">۲۴/۷</div>
            <div class="text-gray-600 text-sm">پشتیبانی آنلاین</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Professional hero section
</script>
