<template>
  <footer class="bg-white text-gray-800 border-t border-gray-100">
    <!-- Mobile App-like Footer -->
    <div class="md:hidden">
      <div class="px-4 py-6">
        <!-- Logo & Social -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <i class="ti ti-heart text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">پتومن</h2>
              <p class="text-sky-600 text-xs">مراقب حیوانات شما</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a href="#" class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
              <i class="ti ti-brand-instagram"></i>
            </a>
            <a href="#" class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
              <i class="ti ti-brand-telegram"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links Grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <NuxtLink to="/vets" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm">
            <i class="ti ti-stethoscope text-sky-500"></i>
            دامپزشکان
          </NuxtLink>
          <NuxtLink to="/clinics" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm">
            <i class="ti ti-building-hospital text-teal-500"></i>
            کلینیک‌ها
          </NuxtLink>
          <NuxtLink to="/pharmacy" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm">
            <i class="ti ti-pill text-purple-500"></i>
            داروخانه
          </NuxtLink>
          <NuxtLink to="/petshops" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm">
            <i class="ti ti-shopping-bag text-amber-500"></i>
            فروشگاه
          </NuxtLink>
        </div>

        <!-- Contact Info -->
        <div class="flex items-center justify-center gap-4 mb-4">
          <a href="tel:+989123456789" class="flex items-center gap-2 text-gray-500 text-sm">
            <i class="ti ti-phone text-sky-500"></i>
            ۰۹۱۲-۳۴۵-۶۷۸۹
          </a>
        </div>

        <!-- Copyright -->
        <div class="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
          © ۱۴۰۴ پتومن - تمامی حقوق محفوظ است
        </div>
      </div>
    </div>

    <!-- Desktop Footer -->
    <div class="hidden md:block">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <!-- Company Info -->
        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
              <i class="ti ti-heart text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">پتومن</h2>
              <p class="text-sky-600 text-sm">مراقب حیوانات شما</p>
            </div>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">
            پلتفرم جامع دامپزشکی برای مراقبت حرفه‌ای از حیوانات خانگی با بهترین متخصصان کشور
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
              <i class="ti ti-brand-instagram"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
              <i class="ti ti-brand-telegram"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
              <i class="ti ti-brand-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-5">
          <h3 class="text-base font-bold text-gray-900">دسترسی سریع</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/vets" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                دامپزشکان
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/clinics" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                کلینیک‌ها
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/pharmacy" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                داروخانه
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/petshops" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                فروشگاه حیوانات
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div class="space-y-5">
          <h3 class="text-base font-bold text-gray-900">خدمات</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/consult" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                مشاوره آنلاین
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/home-visit" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                ویزیت در منزل
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/emergency" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                اورژانس ۲۴/۷
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/articles" class="text-gray-500 hover:text-sky-600 transition-colors text-sm">
                مقالات آموزشی
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-5">
          <h3 class="text-base font-bold text-gray-900">تماس با ما</h3>
          <div class="space-y-3">
            <a href="tel:+989123456789" class="flex items-center gap-3 text-gray-500 hover:text-sky-600 transition-colors text-sm">
              <i class="ti ti-phone text-sky-500"></i>
              ۰۹۱۲-۳۴۵-۶۷۸۹
            </a>
            <a href="mailto:support@petoman.ir" class="flex items-center gap-3 text-gray-500 hover:text-sky-600 transition-colors text-sm">
              <i class="ti ti-mail text-sky-500"></i>
              support@petoman.ir
            </a>
            <div class="flex items-start gap-3 text-gray-500 text-sm">
              <i class="ti ti-map-pin text-sky-500 mt-0.5"></i>
              <span>تهران، سعادت‌آباد، مرکز نوآوری</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-gray-200 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-sm text-gray-400">
            © ۱۴۰۴ پتومن - تمامی حقوق محفوظ است
          </div>
          <div class="flex gap-6 text-sm">
            <NuxtLink to="/privacy" class="text-gray-500 hover:text-sky-600 transition-colors">
              حریم خصوصی
            </NuxtLink>
            <NuxtLink to="/terms" class="text-gray-500 hover:text-sky-600 transition-colors">
              شرایط استفاده
            </NuxtLink>
            <NuxtLink to="/about" class="text-gray-500 hover:text-sky-600 transition-colors">
              درباره ما
            </NuxtLink>
          </div>
        </div>
      </div>
      </div>
    </div>
  </footer>
</template>
