<template>
  <div class="min-h-screen flex flex-col font-sans bg-gray-50">

    <!-- Navbar: شیشه‌ای و مدرن -->
    <nav class="fixed w-full z-50 top-0 start-0 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo -->
        <a href="#" class="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse" @click="scrollToTop">
          <svg class="w-8 h-8 text-pet-orange" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2M6 5C4.9 5 4 5.9 4 7C4 8.1 4.9 9 6 9C7.1 9 8 8.1 8 7C8 5.9 7.1 5 6 5M18 5C16.9 5 16 5.9 16 7C16 8.1 16.9 9 18 9C19.1 9 20 8.1 20 7C20 5.9 19.1 5 18 5M7 11C5.3 11 4 12.3 4 14C4 15.7 5.3 17 7 17C8.7 17 10 15.7 10 14C10 12.3 8.7 11 7 11M17 11C15.3 11 14 12.3 14 14C14 15.7 15.3 17 17 17C18.7 17 20 15.7 20 14C20 12.3 18.7 11 17 11M12 12C9.8 12 8 13.8 8 16V18C8 20.2 9.8 22 12 22C14.2 22 16 20.2 16 18V16C16 13.8 14.2 12 12 12Z"/>
          </svg>
          <span class="self-center text-2xl font-bold whitespace-nowrap text-gray-900">پتومـن</span>
        </a>

        <!-- Desktop Menu -->
        <div class="hidden w-full md:block md:w-auto">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <a href="#apps" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-pet-orange md:p-0 transition">اپلیکیشن‌ها</a>
            </li>
            <li>
              <a href="#about" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-pet-orange md:p-0 transition">درباره ما</a>
            </li>
            <li>
              <a href="#contact" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-pet-orange md:p-0 transition">تماس</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section: جذاب و دعوت‌کننده -->
    <section class="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <!-- Background Blob -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="text-center lg:text-right">
            <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              دنیای شاد <span class="text-pet-orange">حیوانات خانگی</span> در دستان شما
            </h1>
            <p class="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              با پتومان، سلامت، تفریح و نیازهای روزمره دوست چهارپایه خود را به ساده‌ترین شکل مدیریت کنید. همه چیز در یک اپلیکیشن.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#apps" class="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pet-orange rounded-full hover:bg-orange-700 transition shadow-xl shadow-orange-200 transform hover:-translate-y-1">
                شروع کنید
                <svg class="w-5 h-5 mr-2 -ml-1 rtl:ml-2 rtl:-mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </a>
              <a href="#features" class="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition transform hover:-translate-y-1">
                مشاهده ویژگی‌ها
              </a>
            </div>

            <!-- Stats -->
            <div class="mt-10 flex items-center justify-center lg:justify-start gap-8 text-gray-500">
              <div>
                <span class="block text-2xl font-bold text-gray-900">+۱۰k</span>
                <span class="text-sm">کاربر فعال</span>
              </div>
              <div>
                <span class="block text-2xl font-bold text-gray-900">+۵۰۰</span>
                <span class="text-sm">دامپزشک</span>
              </div>
            </div>
          </div>

          <!-- Image Content -->
          <div class="relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                  alt="Happy dog and owner"
                  class="w-full h-full object-cover transform hover:scale-105 transition duration-700"
              />
              <!-- Floating Card -->
              <div class="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs hidden md:block">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900">نوبت واکسیناسیون</p>
                    <p class="text-xs text-gray-500">فردا ساعت ۱۰:۰۰</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Apps Grid Section: کارت‌های شیشه‌ای و رنگی -->
    <section id="apps" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-pet-orange font-semibold tracking-wider uppercase text-sm">اکوسیستم هوشمند</span>
          <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            همه ابزارها در یک نگاه
          </h2>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            ما برای هر جنبه از زندگی پت شما، یک راه‌حل تخصصی و جذاب طراحی کرده‌ایم.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <!-- App Card Component Loop (Manual for now) -->

          <!-- 1. Market -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-100 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-orange-100 text-pet-orange rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pet-orange group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">فروشگاه آنلاین</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">خرید غذای مخصوص، اسباب‌بازی و لوازم بهداشتی با ارسال سریع و تضمین اصالت کالا.</p>
              <a href="/market" class="inline-flex items-center text-pet-orange font-bold hover:text-orange-700 transition group/link">
                ورود به مارکت
                <svg class="w-4 h-4 mr-2 transform rotate-180 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>

          <!-- 2. Dampezeshki -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-100 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">مشاوره دامپزشکی</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">ارتباط آنلاین با متخصصان، رزرو وقت و دریافت نسخه الکترونیک در کمترین زمان.</p>
              <a href="/dampezeshki" class="inline-flex items-center text-green-600 font-bold hover:text-green-800 transition group/link">
                مشاوره آنلاین
                <svg class="w-4 h-4 mr-2 transform rotate-180 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>

          <!-- 3. Hamian -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">همیار سلامت</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">یادآوری واکسن، ثبت وزن و قد، و مدیریت سوابق پزشکی پت شما به صورت هوشمند.</p>
              <a href="#" class="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition group/link">
                شروع ثبت اطلاعات
                <svg class="w-4 h-4 mr-2 transform rotate-180 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>

          <!-- 4. Film -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-100 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">دنیای سرگرمی</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">ویدیوهای آموزشی، بازی‌های تعاملی برای پت و محتوای جذاب درباره رفتارشناسی.</p>
              <a href="#" class="inline-flex items-center text-purple-600 font-bold hover:text-purple-800 transition group/link">
                تماشای ویدیوها
                <svg class="w-4 h-4 mr-2 transform rotate-180 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>

          <!-- 5. Danim -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-teal-100 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">دانشنامه حیوانات</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">مرجع کامل اطلاعات نژادها، تغذیه صحیح و نکات نگهداری از حیوانات خانگی.</p>
              <a href="#" class="inline-flex items-center text-teal-600 font-bold hover:text-teal-800 transition group/link">
                مطالعه مقالات
                <svg class="w-4 h-4 mr-2 transform rotate-180 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>

          <!-- 6. Panel Admin -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-100 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">پنل مدیریت</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">ورگاه اختصاصی برای مدیران و کارکنان جهت کنترل سفارشات، کاربران و محتوای سایت.</p>
              <a href="/admin" class="inline-flex items-center text-gray-600 font-bold hover:text-gray-800 transition group/link">
                ورود به پنل
                <svg class="w-4 h-4 mr-2 transform rotate-180 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Footer: مینیمال -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-pet-orange rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <span class="text-2xl font-bold">پتومـن</span>
          </div>

          <div class="text-gray-400 text-sm">
            © ۱۴۰۳ تمامی حقوق برای پتومان محفوظ است.
          </div>

          <div class="flex space-x-6 space-x-reverse">
            <a href="#" class="text-gray-400 hover:text-white transition transform hover:scale-110">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06h.63zm1.673 5.378a1.904 1.904 0 11-3.808 3.808 1.904 1.904 0 013.808-3.808z" clip-rule="evenodd"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition transform hover:scale-110">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* انیمیشن ساده برای حباب‌های پس‌زمینه */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>