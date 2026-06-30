<template>
  <footer class="relative bg-gradient-to-t from-black via-zinc-900 to-zinc-800 border-t border-yellow-400/20 mt-20">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent"></div>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <!-- Brand Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
                <img src="https://ofilm.ir/ofilm-logo.png" alt="OFilm Logo" class="h-12">
          </div>
          <p class="text-yellow-200/80 leading-relaxed">
            بهترین پلتفرم برای تماشای مستندات و فیلم‌های آموزشی حیوانات. دنیای شگفت‌انگیز طبیعت را کشف کنید.
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <i class="ti ti-brand-instagram text-yellow-400 group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <i class="ti ti-brand-telegram text-yellow-400 group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <i class="ti ti-brand-youtube text-yellow-400 group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="#" class="w-10 h-10 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <i class="ti ti-brand-twitter text-yellow-400 group-hover:scale-110 transition-transform"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-yellow-400 flex items-center">
            <i class="ti ti-link ml-2"></i>
            دسترسی سریع
          </h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                صفحه اصلی
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/movies" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                فیلم‌ها
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/series" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                سریال‌ها
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/categories" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                دسته‌بندی‌ها
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-yellow-400 flex items-center">
            <i class="ti ti-help ml-2"></i>
            پشتیبانی
          </h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/about" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                درباره ما
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                تماس با ما
              </NuxtLink>
            </li>
            <li>
              <a href="#" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                سوالات متداول
              </a>
            </li>
            <li>
              <a href="#" class="text-yellow-200/80 hover:text-yellow-400 transition-colors flex items-center group">
                <i class="ti ti-chevron-left text-xs ml-2 group-hover:translate-x-1 transition-transform"></i>
                راهنمای استفاده
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-yellow-400 flex items-center">
            <i class="ti ti-phone ml-2"></i>
            اطلاعات تماس
          </h3>
          <div class="space-y-4">
            <div class="flex items-center text-yellow-200/80">
              <i class="ti ti-mail ml-3 text-yellow-400"></i>
              <span class="text-sm">info@Ofilm.ir</span>
            </div>
            <div class="flex items-center text-yellow-200/80">
              <i class="ti ti-phone ml-3 text-yellow-400"></i>
              <span class="text-sm">021-12345678</span>
            </div>
            <div class="flex items-start text-yellow-200/80">
              <i class="ti ti-map-pin ml-3 text-yellow-400 mt-1 flex-shrink-0"></i>
              <span class="text-sm leading-relaxed">تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 mb-8 border-y border-yellow-400/10">
        <div class="text-center">
        نماد الکترونیک
        </div>
        <div class="text-center">
         ساماندهی
        </div>
        <div class="text-center">
     اتحادیه
        </div>
        <div class="text-center">
لوگو تستی
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="flex flex-col md:flex-row items-center justify-between text-yellow-200/70 text-sm">
        <div class="mb-4 md:mb-0">
          © 2025 فیلم حیوانات. تمامی حقوق محفوظ است.
        </div>
        <div class="flex flex-wrap gap-6">
          <a href="#" class="hover:text-yellow-400 transition-colors">حریم خصوصی</a>
          <a href="#" class="hover:text-yellow-400 transition-colors">شرایط استفاده</a>
          <a href="#" class="hover:text-yellow-400 transition-colors">قوانین سایت</a>
        </div>
      </div>
    </div>
  </footer>
</template>
