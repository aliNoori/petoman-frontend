<template>
  <footer class="bg-white text-gray-800 border-t border-gray-100">
    <!-- Mobile App-like Footer -->
    <div class="md:hidden">
      <div class="px-4 py-6">
        <!-- Logo & Social -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <i class="ti ti-paw-filled text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">پت مارکت</h2>
              <p class="text-blue-600 text-xs">همه چیز برای حیوانات خانگی</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a href="#" class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-colors">
              <i class="ti ti-brand-instagram"></i>
            </a>
            <a href="#" class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-colors">
              <i class="ti ti-brand-telegram"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links Grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <NuxtLink to="/shops" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm hover:bg-blue-50 transition-colors">
            <i class="ti ti-building-store text-blue-500"></i>
            فروشگاه‌ها
          </NuxtLink>
          <NuxtLink to="/products" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm hover:bg-teal-50 transition-colors">
            <i class="ti ti-package text-teal-500"></i>
            محصولات
          </NuxtLink>
          <NuxtLink to="/categories" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm hover:bg-purple-50 transition-colors">
            <i class="ti ti-category text-purple-500"></i>
            دسته‌بندی‌ها
          </NuxtLink>
          <NuxtLink to="/offers" class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 text-sm hover:bg-amber-50 transition-colors">
            <i class="ti ti-discount-2 text-amber-500"></i>
            تخفیف‌ها
          </NuxtLink>
        </div>

        <!-- Contact Info -->
        <div class="flex items-center justify-center gap-4 mb-4">
          <a href="tel:+989123456789" class="flex items-center gap-2 text-gray-500 text-sm">
            <i class="ti ti-phone text-blue-500"></i>
            ۰۲۱-۱۲۳۴۵۶۷۸
          </a>
        </div>

        <!-- Copyright -->
        <div class="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
          © ۱۴۰۴ پت مارکت - تمامی حقوق محفوظ است
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
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <i class="ti ti-paw-filled text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">پت مارکت</h2>
                <p class="text-blue-600 text-sm">همه چیز برای حیوانات خانگی</p>
              </div>
            </div>
            <p class="text-gray-500 text-sm leading-relaxed">
              بزرگترین مارکت آنلاین حیوانات خانگی با هزاران فروشگاه معتبر و میلیون‌ها محصول باکیفیت
            </p>
            <div class="flex gap-3">
              <a href="#" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
                <i class="ti ti-brand-instagram"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
                <i class="ti ti-brand-telegram"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">
                <i class="ti ti-brand-whatsapp"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-5">
            <h3 class="text-base font-bold text-gray-900">دسترسی سریع</h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/shops" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  فروشگاه‌ها
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/products" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  محصولات
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/categories" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  دسته‌بندی‌ها
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/offers" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  تخفیف‌ها
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="space-y-5">
            <h3 class="text-base font-bold text-gray-900">دسته‌بندی‌ها</h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/category/dog-food" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  غذای سگ
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/category/cat-food" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  غذای گربه
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/category/toys" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  اسباب‌بازی
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/category/accessories" class="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  لوازم جانبی
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-5">
            <h3 class="text-base font-bold text-gray-900">تماس با ما</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-phone text-blue-600 text-sm"></i>
                </div>
                <div>
                  <p class="text-gray-700 text-sm font-medium">تلفن پشتیبانی</p>
                  <p class="text-gray-500 text-sm">۰۲۱-۱۲۳۴۵۶۷۸</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-mail text-teal-600 text-sm"></i>
                </div>
                <div>
                  <p class="text-gray-700 text-sm font-medium">ایمیل</p>
                  <p class="text-gray-500 text-sm">info@petmarket.ir</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-map-pin text-purple-600 text-sm"></i>
                </div>
                <div>
                  <p class="text-gray-700 text-sm font-medium">آدرس</p>
                  <p class="text-gray-500 text-sm">تهران، خیابان ولیعصر</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Seller CTA -->
        <div class="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <i class="ti ti-building-store text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">فروشنده شوید</h3>
                <p class="text-gray-500 text-sm">فروشگاه خود را در پت مارکت ثبت کنید</p>
              </div>
            </div>
            <NuxtLink 
              to="/shops/register" 
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transition-all flex items-center gap-2"
            >
              <i class="ti ti-rocket"></i>
              شروع فروشندگی
            </NuxtLink>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="flex flex-wrap items-center justify-center gap-6 pb-10 border-b border-gray-100">
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <i class="ti ti-shield-check text-green-600"></i>
            </div>
            <span>ضمانت اصالت کالا</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <i class="ti ti-truck-delivery text-blue-600"></i>
            </div>
            <span>ارسال سراسری</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <i class="ti ti-credit-card text-purple-600"></i>
            </div>
            <span>پرداخت امن</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <i class="ti ti-headset text-amber-600"></i>
            </div>
            <span>پشتیبانی ۲۴/۷</span>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-gray-400 text-sm">
            © ۱۴۰۴ پت مارکت - تمامی حقوق محفوظ است
          </p>
          <div class="flex items-center gap-6">
            <NuxtLink to="/terms" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">
              قوانین و مقررات
            </NuxtLink>
            <NuxtLink to="/privacy" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">
              حریم خصوصی
            </NuxtLink>
            <NuxtLink to="/about" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">
              درباره ما
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no specific logic needed
</script>
