<template>
  <div>
    <!-- Fixed Navigation Bar -->
    <nav
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        :class="isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white/0'"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
                class="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <i class="ti ti-paw-filled text-white text-xl"></i>
            </div>
            <div class="hidden sm:block">
              <span class="text-xl font-black text-gray-900">پتومن</span>
            </div>
          </NuxtLink>

          <!-- Desktop Menu -->
          <nav class="hidden md:flex items-center gap-2">
            <NuxtLink to="/"
                      class="px-4 py-2 text-gray-700 hover:text-sky-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              خانه
            </NuxtLink>
            <NuxtLink to="/vets"
                      class="px-4 py-2 text-gray-700 hover:text-sky-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              دامپزشکان
            </NuxtLink>
            <NuxtLink to="/clinics"
                      class="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              کلینیک‌ها
            </NuxtLink>
            <NuxtLink to="/pharmacy"
                      class="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              داروخانه
            </NuxtLink>
            <a
                href="http://localhost:6503"
                target="_blank"
                class="px-4 py-2 text-gray-700 hover:text-amber-600 font-medium rounded-lg hover:bg-white/50 transition-all"
            >
              پت‌شاپ
            </a>
          </nav>

          <!-- Right Side -->
          <div class="flex items-center gap-3">
            <!-- City Selector -->
            <div class="min-w-[200px]">
              <ClientOnly>
                <AddressSelector
                    v-model="cityLocationData"
                    placeholder="انتخاب شهر"
                    title="انتخاب موقعیت مکانی"
                    button-class="!bg-white/80 !border-gray-200 hover:!bg-white hover:!border-sky-300 !h-[42px]"
                    @update:modelValue="onCityLocationSelected"
                />
              </ClientOnly>
            </div>

            <ClientOnly>
              <div class="flex items-center gap-2 sm:gap-3">

                <!-- حالت ۱: کاربر لاگین کرده است -->
                <button
                    v-if="isAuthenticated"
                    @click="goToUserPanel"
                    class="group flex items-center gap-2 sm:px-3 sm:py-2 bg-white/90 border border-gray-200 rounded-full hover:border-blue-400 hover:shadow-md transition-all duration-200"
                >
                  <!-- آواتار یا حرف اول نام -->
                  <div
                      class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0"
                  >
                    <img
                        v-if="user?.avatar && resolveUrl(user.avatar)"
                        :src="resolveUrl(user.avatar)"
                        alt="Avatar"
                        class="w-full h-full object-cover"
                    />
                    <div
                        v-else
                        class="w-full h-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center"
                    >
                    <span class="text-white text-xs sm:text-sm font-bold">
                      {{ user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U' }}
                    </span>
                    </div>
                  </div>

                  <!-- نام کاربری (در موبایل کوتاه‌تر، در دسکتاپ کامل) -->
                  <span class="hidden sm:block text-gray-700 text-sm font-medium whitespace-nowrap max-w-[100px] truncate">
                    {{ user?.firstName || user?.fullName || 'پنل کاربری' }}
                  </span>

                  <!-- آیکون فلش برای راهنمایی (در موبایل فقط آیکون، در دسکتاپ آیکون + متن) -->
                  <i class="ti ti-chevron-left text-gray-400 text-xs sm:text-sm group-hover:text-blue-500 transition-colors hidden sm:block"></i>
                </button>

                <!-- حالت ۲: کاربر لاگین نکرده است -->
                <a
                    v-else
                    :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
                    class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full hover:from-blue-600 hover:to-teal-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                  <!-- آیکون قفل -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>

                  <!-- متن دکمه -->
                  <span class="text-xs sm:text-sm">
      {{ isAuthenticated ? 'پنل من' : 'ورود / ثبت‌نام' }}
    </span>
                </a>

              </div>
            </ClientOnly>

            <!-- Mobile Menu Button -->
            <button
                @click="toggleMobileMenu"
                class="md:hidden p-2 h-[42px] bg-white/80 border border-gray-200 rounded-xl hover:bg-white transition-colors"
            >
              <i class="ti ti-menu-2 text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer for fixed nav -->
    <div class="h-16"></div>

    <!-- Hero Section - Only on Home Page -->
    <header v-if="isHomePage"
            class="bg-gradient-to-br from-sky-50 via-white to-teal-50 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Wave Pattern -->
        <div class="absolute bottom-0 left-0 right-0 h-20 md:h-40 opacity-20">
          <svg viewBox="0 0 1440 120" class="w-full h-full" preserveAspectRatio="none">
            <path d="M0,60 C150,90 350,0 600,60 C850,120 1050,30 1200,60 C1350,90 1440,60 1440,60 L1440,120 L0,120 Z"
                  fill="url(#wave-gradient)"/>
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:0.4"/>
                <stop offset="50%" style="stop-color:#14b8a6;stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:0.4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <!-- Decorative Circles -->
        <div class="absolute top-10 left-10 w-32 md:w-64 h-32 md:h-64 bg-sky-200/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-40 md:w-80 h-40 md:h-80 bg-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative container mx-auto px-4 pt-6 md:pt-8 lg:pt-12 pb-6 md:pb-8 z-10">
        <div class="text-center max-w-3xl mx-auto">
          <!-- Badge -->
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-full text-xs md:text-sm mb-4 md:mb-6">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-sky-700 font-medium">+۱۰۰ دامپزشک آنلاین</span>
          </div>

          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-3 md:mb-4">
            <span class="text-transparent bg-clip-text bg-gradient-to-l from-sky-600 to-teal-500">پتومن</span> خدمات
            دامپزشکی آنلاین
          </h1>
          <p class="text-gray-600 text-sm md:text-lg max-w-xl mx-auto">
            مشاوره آنلاین، رزرو نوبت، خرید دارو و لوازم حیوانات
          </p>
        </div>

        <!-- Search Box -->
        <div class="max-w-4xl mx-auto mt-6 md:mt-8">
          <!-- Search Form -->
          <div
              class="bg-white rounded-xl md:rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 md:p-3">
            <div class="flex flex-col md:flex-row gap-2 md:gap-3">
              <!-- Search Input -->
              <div class="flex-1 relative">
                <input
                    v-model="searchQuery"
                    @input="onSearchInput"
                    @focus="showSearchResults = true"
                    type="text"
                    placeholder="جستجوی دامپزشک، کلینیک..."
                    class="w-full pr-10 md:pr-12 pl-4 py-3 md:py-4 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-right bg-gray-50/50 text-sm md:text-lg"
                />
                <div class="absolute right-3 md:right-4 top-3 md:top-4">
                  <i class="ti ti-search text-lg md:text-xl text-gray-400"></i>
                </div>

                <!-- Search Results Dropdown -->
                <div
                    v-if="showSearchResults && (searchResults.length > 0 || searchQuery.length >= 2)"
                    class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50"
                >
                  <div v-if="isSearching" class="p-4 text-center text-gray-500">
                    <i class="ti ti-loader animate-spin text-xl"></i>
                    <span class="mr-2">در حال جستجو...</span>
                  </div>
                  <div v-else-if="searchResults.length === 0 && searchQuery.length >= 2"
                       class="p-4 text-center text-gray-500">
                    نتیجه‌ای یافت نشد
                  </div>
                  <div v-else>
                    <!-- Vets Section -->
                    <div v-if="searchResults.filter(r => r.type === 'vet').length > 0" class="border-b border-gray-100">
                      <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500">دامپزشکان</div>
                      <button
                          v-for="result in searchResults.filter(r => r.type === 'vet')"
                          :key="result.id"
                          @click="selectSearchResult(result)"
                          class="w-full px-4 py-3 flex items-center gap-3 hover:bg-sky-50 transition-colors text-right"
                      >
                        <div class="w-10 h-10 rounded-full flex items-center justify-center"
                             :class="result.avatarBg || 'bg-sky-100'">
                          <span class="font-bold text-sm"
                                :class="result.avatarText || 'text-sky-700'">{{ result.initials }}</span>
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-gray-900">{{ result.name }}</div>
                          <div class="text-sm text-gray-500">{{ result.specialty }}</div>
                        </div>
                        <div class="flex items-center gap-1 text-amber-500">
                          <i class="ti ti-star-filled text-sm"></i>
                          <span class="text-sm">{{ result.rate }}</span>
                        </div>
                      </button>
                    </div>

                    <!-- Clinics Section -->
                    <div v-if="searchResults.filter(r => r.type === 'clinic').length > 0"
                         class="border-b border-gray-100">
                      <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500">کلینیک‌ها</div>
                      <button
                          v-for="result in searchResults.filter(r => r.type === 'clinic')"
                          :key="result.id"
                          @click="selectSearchResult(result)"
                          class="w-full px-4 py-3 flex items-center gap-3 hover:bg-teal-50 transition-colors text-right"
                      >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                             :class="result.cover || 'bg-teal-500'">
                          <i class="ti ti-building-hospital text-white"></i>
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-gray-900">{{ result.name }}</div>
                          <div class="text-sm text-gray-500">{{ result.addr }}</div>
                        </div>
                        <span :class="result.open ? 'text-green-500' : 'text-red-500'" class="text-sm">
                          {{ result.open ? 'باز' : 'بسته' }}
                        </span>
                      </button>
                    </div>

                    <!-- Pharmacies Section -->
                    <div v-if="searchResults.filter(r => r.type === 'pharmacy').length > 0">
                      <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500">داروخانه‌ها</div>
                      <button
                          v-for="result in searchResults.filter(r => r.type === 'pharmacy')"
                          :key="result.id"
                          @click="selectSearchResult(result)"
                          class="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-right"
                      >
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                             :class="result.cover || 'bg-purple-500'">
                          <i class="ti ti-pill text-white"></i>
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-gray-900">{{ result.name }}</div>
                          <div class="text-sm text-gray-500">{{ result.addr }}</div>
                        </div>
                        <span :class="result.open ? 'text-green-500' : 'text-red-500'" class="text-sm">
                          {{ result.open ? 'باز' : 'بسته' }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search Button -->
              <button
                  @click="performSearch"
                  class="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30"
              >
                <i class="ti ti-search text-lg"></i>
                <span>جستجو</span>
              </button>
            </div>
          </div>

          <!-- Services Cards (Mobile: 2x2, Desktop: 4) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-6 md:mt-8">
            <!-- دامپزشکان -->
            <NuxtLink
                to="/vets"
                class="group bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/50 hover:bg-white transition-all active:scale-95"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                  <i class="ti ti-stethoscope text-lg md:text-xl text-white"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-sm md:text-base group-hover:text-sky-600 transition-colors">
                    دامپزشکان</h3>
                  <p class="text-xs text-gray-500 truncate hidden sm:block">مشاوره آنلاین</p>
                </div>
              </div>
            </NuxtLink>

            <!-- کلینیک‌ها -->
            <NuxtLink
                to="/clinics"
                class="group bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/50 hover:bg-white transition-all active:scale-95"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                  <i class="ti ti-building-hospital text-lg md:text-xl text-white"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-sm md:text-base group-hover:text-teal-600 transition-colors">
                    کلینیک‌ها</h3>
                  <p class="text-xs text-gray-500 truncate hidden sm:block">نزدیک‌ترین کلینیک</p>
                </div>
              </div>
            </NuxtLink>

            <!-- داروخانه -->
            <NuxtLink
                to="/pharmacy"
                class="group bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/50 hover:bg-white transition-all active:scale-95"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <i class="ti ti-pill text-lg md:text-xl text-white"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-sm md:text-base group-hover:text-purple-600 transition-colors">
                    داروخانه</h3>
                  <p class="text-xs text-gray-500 truncate hidden sm:block">سفارش آنلاین دارو</p>
                </div>
              </div>
            </NuxtLink>

            <!-- پت‌شاپ -->
            <NuxtLink
                to="http://localhost:6503"
                @click.prevent="handleMarketClick"
                class="group bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/50 hover:bg-white transition-all active:scale-95"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <div
                    class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <i class="ti ti-shopping-bag text-lg md:text-xl text-white"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-sm md:text-base group-hover:text-amber-600 transition-colors">
                    پت‌شاپ</h3>
                  <p class="text-xs text-gray-500 truncate hidden sm:block">لوازم حیوانات</p>
                </div>
              </div>
            </NuxtLink>

            <!-- دکمه ثبت درخواست (اصلاح شده) -->
            <NuxtLink
                to="/register"
                @click.prevent="handleRegisterClick"
                class="group col-span-2 md:col-span-4 bg-gradient-to-r from-gray-50 to-white border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl md:rounded-2xl p-4 mt-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
            >
              <div
                  class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <i class="ti ti-plus text-2xl text-gray-500 group-hover:text-blue-600"></i>
              </div>
              <div class="text-center">
                <h3 class="font-bold text-gray-700 text-sm md:text-base group-hover:text-blue-600 transition-colors">ثبت
                  درخواست </h3>
                <p class="text-xs text-gray-500 mt-1">برای داروخانه، کلینیک یا دامپزشک</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Decorative Elements (Desktop Only) -->
      <div class="absolute left-8 top-24 hidden lg:block">
        <div
            class="w-20 h-20 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center rotate-12 shadow-lg border border-white/50">
          <i class="ti ti-stethoscope text-3xl text-sky-400"></i>
        </div>
      </div>
      <div class="absolute right-12 bottom-16 hidden lg:block">
        <div
            class="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center -rotate-12 shadow-lg border border-white/50">
          <i class="ti ti-paw-filled text-2xl text-teal-400"></i>
        </div>
      </div>
    </header>

    <!-- Mobile Menu (App-like) -->
    <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
    >
      <nav
          v-if="showMobileMenu"
          class="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto"
      >
        <!-- Header -->
        <div class="sticky top-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
              <i class="ti ti-paw-filled text-white text-lg"></i>
            </div>
            <span class="text-lg font-black text-gray-900">پتومن</span>
          </NuxtLink>
          <button @click="showMobileMenu = false" class="p-2 bg-gray-100 rounded-xl text-gray-700">
            <i class="ti ti-x text-lg"></i>
          </button>
        </div>

        <!-- User Section -->
        <!-- User/Login -->
        <ClientOnly>
          <button
              v-if="isAuthenticated"
              @click="goToUserPanel"
              class="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
          >
            <img
                v-if="user?.avatar && user.avatar !== 'null' && user.avatar.trim() !== ''"
                :src="resolveUrl(user.avatar)"
                class="w-7 h-7 rounded-full object-cover"
            />
            <div v-else
                class="w-7 h-7 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">{{ user?.firstName?.charAt(0) }}</span>
            </div>
            <span class="hidden sm:block text-gray-700 text-sm font-medium">پنل من</span>
          </button>
          <a
              v-else
              :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
              class="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            ورود / ثبت نام
          </a>
        </ClientOnly>

        <!-- Quick Actions Grid -->
        <div class="p-4 border-b border-gray-100">
          <div class="grid grid-cols-4 gap-3">
            <button @click="handleMobileNavClick('/vets')"
                    class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-50 active:bg-sky-100">
              <div
                  class="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                <i class="ti ti-stethoscope text-xl text-white"></i>
              </div>
              <span class="text-xs font-semibold text-gray-700">دامپزشکان</span>
            </button>
            <button @click="handleMobileNavClick('/clinics')"
                    class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-teal-50 active:bg-teal-100">
              <div
                  class="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <i class="ti ti-building-hospital text-xl text-white"></i>
              </div>
              <span class="text-xs font-semibold text-gray-700">کلینیک‌ها</span>
            </button>
            <button @click="handleMobileNavClick('/pharmacy')"
                    class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-purple-50 active:bg-purple-100">
              <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i class="ti ti-pill text-xl text-white"></i>
              </div>
              <span class="text-xs font-semibold text-gray-700">داروخانه</span>
            </button>
            <button @click="handleMobileNavClick('/market')"
                    class="flex flex-col items-center gap-2 p-3 rounded-2xl bg-amber-50 active:bg-amber-100">
              <div
                  class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <i class="ti ti-shopping-bag text-xl text-white"></i>
              </div>
              <span class="text-xs font-semibold text-gray-700">پت‌شاپ</span>
            </button>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="p-4">
          <div class="space-y-2">
            <button @click="handleMobileNavClick('/')"
                    class="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 active:bg-gray-100">
              <div class="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <i class="ti ti-home text-lg text-gray-600"></i>
              </div>
              <span class="font-semibold text-gray-700">صفحه اصلی</span>
              <i class="ti ti-chevron-left text-gray-400 mr-auto"></i>
            </button>

            <div class="p-4 rounded-2xl bg-gray-50">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <i class="ti ti-map-pin text-lg text-sky-600"></i>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-gray-700 block">انتخاب شهر</span>
                  <span class="text-xs text-gray-500">{{ currentCity || 'موقعیت خود را انتخاب کنید' }}</span>
                </div>
              </div>
              <ClientOnly>
                <AddressSelector
                    v-model="cityLocationData"
                    placeholder="انتخاب شهر از روی نقشه"
                    title="انتخاب موقعیت مکانی"
                    button-class="!bg-white !border-gray-200"
                    @update:modelValue="onCityLocationSelected"
                />
              </ClientOnly>
            </div>

            <button v-if="isAuthenticated" @click="handleMobileNavClick('/profile')"
                    class="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 active:bg-gray-100">
              <div class="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <i class="ti ti-user text-lg text-gray-600"></i>
              </div>
              <span class="font-semibold text-gray-700">پنل کاربری</span>
              <i class="ti ti-chevron-left text-gray-400 mr-auto"></i>
            </button>

            <button @click="handleMobileNavClick('/profile?showSupportModal=true')"
                    class="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 active:bg-gray-100">
              <div class="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <i class="ti ti-info-circle text-lg text-gray-600"></i>
              </div>
              <span class="font-semibold text-gray-700">درباره ما</span>
              <i class="ti ti-chevron-left text-gray-400 mr-auto"></i>
            </button>

            <button @click="handleMobileNavClick('/profile?showSupportModal=true')"
                    class="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 active:bg-gray-100">
              <div class="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <i class="ti ti-phone text-lg text-gray-600"></i>
              </div>
              <span class="font-semibold text-gray-700">تماس با ما</span>
              <i class="ti ti-chevron-left text-gray-400 mr-auto"></i>
            </button>
          </div>

          <!-- Logout Button -->
          <div v-if="isAuthenticated" class="mt-6 pt-4 border-t border-gray-100">
            <button
                @click="logout"
                class="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 active:bg-red-100"
            >
              <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <i class="ti ti-logout text-lg text-red-600"></i>
              </div>
              <span class="font-semibold text-red-600">خروج از حساب</span>
            </button>
          </div>
        </div>

        <!-- App Version -->
        <div class="p-4 text-center text-xs text-gray-400">
          نسخه ۱.۰.۰
        </div>
      </nav>
    </Transition>
    <!-- Toast Bubble -->
<!--    <Transition name="fade">
      <div v-if="toastNotification"
           class="fixed left-4 top-4 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-[60]">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
               :class="toastNotification.color">
            <i :class="toastNotification.icon" class="text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ toastNotification.title }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ toastNotification.message }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ toastNotification.time }}</p>
          </div>
          <button @click="toastNotification = null" class="text-gray-400 hover:text-gray-600">
            <i class="ti ti-x"></i>
          </button>
        </div>
      </div>
    </Transition>-->
  </div>
</template>

<script setup lang="ts">
// Route
import {computed, ref, onMounted} from "vue";
import {useRouter} from 'vue-router'
import {useNuxtApp, useRuntimeConfig} from "nuxt/app";
import {useAuthStore} from "~/stores/auth";
import {useNotificationStore} from "~/stores/notification.store";
import {useUrlHelper} from "~/composables/useUrlHelper";
import {useTenantStore} from "~/stores/tenant.store";
import {useAppointmentStore} from "~/stores/appointment.store";
// Scroll handler reference
let scrollHandler: (() => void) | null = null
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const toastNotification = ref(null)
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const cartStore = useCartStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const currentUrl = ref('')
const {resolveUrl} = useUrlHelper();
const {$toast} = useNuxtApp()
const goToUserPanel = () => {
  router.push('/profile')
}
const handleRegisterClick = () => {
  if (!isAuthenticated.value) {
    //$toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    // 1. Show Warning Toast
    // Note: Adjust the parameters based on your specific Toast implementation
    // Assuming $toast accepts (message, severity, life)
    if ($toast && typeof $toast === 'function') {
      $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    }

    // 2. Redirect to Login Page with redirect URL
    // This allows the user to come back to /register after login
    // If using NuxtLink behavior via router
    // router.push(`/login?redirect=${encodeURIComponent('/register')}`);

    // Since the login button elsewhere uses an external URL, we do the same here

    window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;
  }
};
const handleMarketClick = () => {
  window.location.href = `${config.public.marketBaseUrl}`;

};
// Navigation items
const navigationItems = [
  {label: 'خانه', path: '/'},
  {label: 'دامپزشکان', path: '/vets'},
  {label: 'کلینیک‌ها', path: '/clinics'},
  {label: 'داروخانه‌ها', path: '/pharmacy'},
  {label: 'مشاوره', path: '/consult'}
]

// State
const showNotifications = ref(false)
const showMobileMenu = ref(false)
const isScrolled = ref(false)
const currentCity = ref('تهران')

// City location data for AddressSelector
const cityLocationData = ref({
  address: '',
  province: '',
  city: currentCity.value,
  location: null
})

const onCityLocationSelected = (data) => {
  //TODO:change city option next step doing
  if (data.city&& data.city!=="تهران") {
    console.log('data.city',data.city)
    //currentCity.value = data.city
    cityLocationData.value.city=currentCity.value
    console.log('City selected:', data)
  }else {
    cityLocationData.value.city=data.city
  }
}
// Search state
const activeTab = ref('appointment')
const tenantStore=useTenantStore()
const searchQuery = ref('')
const showSearchResults = ref(false)
const isSearching = ref(false)
const searchResults = ref<any[]>([])
let searchTimeout: any = null
const vets = computed(() => {
  return tenantStore.tenants
      .filter(t => t.type === 'VET')
      .map(t => {
        const vetInfoSetting = (t.tenantSettings || []).find(item => item.key === 'clinic_info')?.value || {}

        return {
          id: t.id,
          type:t.type.toLowerCase(),
          name: t.name || t.ownerName || 'نامشخص',
          specialty: t.specialty || 'دامپزشک',
          rate: parseFloat(t.rating) || 0,
          initials:t.ownerName.charAt(0),
          avatarBg: 'bg-green-100',
          avatarText: 'text-green-700'
        };
      });
});
const appointmentStore = useAppointmentStore();
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}
const checkSlotAvailability = (time, dateStr) => {
  const timeInMinutes = timeToMinutes(time)

  // ۱. بررسی زمان‌های استراحت (Time Off Blocks)
  const isTimeOff = appointmentStore.timeOffBlocks.some(block => {
    const blockDate = block.date.replace(/-/g, '/')
    if (blockDate !== dateStr) return false

    const startM = timeToMinutes(block.startTime)
    const endM = timeToMinutes(block.endTime)

    return timeInMinutes >= startM && timeInMinutes < endM
  })

  if (isTimeOff) return {available: false, reason: 'time-off'}

  // ۲. بررسی نوبت‌های رزرو شده (Appointments)
  const isBooked = appointmentStore.timeAppointments.some(apt => {
    // دسترسی به تاریخ و زمان از داخل metadata
    // نکته: از اختیاری chaining (?.) استفاده می‌کنیم تا اگر order یا metadata خالی بود خطا ندهد
    const reservedDate = apt.order?.payment?.metadata?.reservedTime?.date
    const reservedTime = apt.order?.payment?.metadata?.reservedTime?.time

    // اگر داده‌ای موجود نبود، نادیده بگیر
    if (!reservedDate || !reservedTime) return false

    // نرمال‌سازی تاریخ (تبدیل - به /) و مقایسه
    const aptDate = reservedDate.replace(/-/g, '/')

    return aptDate === dateStr && reservedTime === time && apt.status !== 'cancelled'
  })

  if (isBooked) return {available: false, reason: 'booked'}

  return {available: true, reason: null}
}
const allTimes = computed(() => {
  const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
  const afternoonTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']

  return {
    morning: morningTimes.map(t => ({ value: t, label: t })),
    afternoon: afternoonTimes.map(t => ({ value: t, label: t }))
  }
})

const clinics = computed(() => {
  return tenantStore.tenants
      .filter(t => t.type === 'CLINIC')
      .map(t => {
        const clinicInfoSetting = (t.tenantSettings || []).find(item => item.key === 'clinic_info')?.value || {}

        // --- منطق بررسی نوبت در هفته جاری ---
        let hasAvailableSlots = false;

        const today = new Date();

        // بررسی ۷ روز آینده
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + i);

          // فرمت تاریخ: YYYY/MM/DD
          const dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '/');

          // ادغام تمام زمان‌های صبح و عصر برای بررسی
          const timesToCheck = [...allTimes.value.morning, ...allTimes.value.afternoon];

          // بررسی تک‌تک زمان‌ها
          for (const timeObj of timesToCheck) {
            const status = checkSlotAvailability(timeObj.value, dateStr);

            if (status.available) {
              hasAvailableSlots = true;
              break; // پیدا شد، نیازی به بررسی بقیه زمان‌ها نیست
            }
          }

          if (hasAvailableSlots) break; // پیدا شد، نیازی به بررسی بقیه روزها نیست
        }

        return {
          id: t.id,
          type:t.type.toLowerCase(),
          name: t.name || t.ownerName || 'نامشخص',
          specialty: clinicInfoSetting.specialties||t.specialty || 'کلینیک دامپزشکی',
          addr: [
            t.tenantAddress?.detailedAddress?.road,
            t.tenantAddress?.detailedAddress?.neighbourhood,
            t.tenantAddress?.detailedAddress?.suburb
          ]
              .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
              .join('. '),

          open: hasAvailableSlots,
          cover: 'bg-gradient-to-br from-amber-400 to-amber-600'
        };
      });
});

const pharmacies = computed(() => {
  return tenantStore.tenants
      .filter(t => t.type === 'PHARMACY')
      .map(t => {
        const pharmacyInfoSetting = (t.settings || []).find(item => item.key === 'pharmacyInfo')?.value || {}

        return {
          id: t.id,
          type:t.type.toLowerCase(),
          name: t.name || t.ownerName || 'نامشخص',
          addr: [
            t.tenantAddress?.detailedAddress?.road,
            t.tenantAddress?.detailedAddress?.neighbourhood,
            t.tenantAddress?.detailedAddress?.suburb
          ]
              .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
              .join('. '), // اتصال با نقطه و فاصله
          open: checkIsOpen(t,'pharmacy'),
          cover: 'bg-gradient-to-br from-pink-400 to-pink-600'
        };
      });
});

const checkIsOpen = (tenant, type = 'pharmacy') => {
  // تعیین کلید بر اساس نوع (توجه به حروف کوچک و بزرگ)
  const targetKey = type === 'pharmacy' ? 'pharmacyInfo' : 'clinic_info';

  // متغیر برای نگهداری تنظیمات پیدا شده
  let infoSetting = null;

  // اولویت اول: جستجو در tenantSettings (برای کلینیک‌ها)
  if (tenant.tenantSettings && tenant.tenantSettings.length > 0) {
    infoSetting = tenant.tenantSettings.find(s => s.key === targetKey);
  }

  // اولویت دوم: اگر در tenantSettings پیدا نشد، در settings جستجو کن (برای داروخانه‌ها)
  if (!infoSetting && tenant.settings && tenant.settings.length > 0) {
    infoSetting = tenant.settings.find(s => s.key === targetKey);
  }

  // اگر تنظیمات پیدا نشد یا مقدار value نداشت، false برگردان
  if (!infoSetting || !infoSetting.value) return false;

  const info = infoSetting.value;

  // بررسی ۲۴ ساعته بودن
  if (info.is24Hours) return true;

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // بررسی روزهای تعطیل
  if (info.closedDays && info.closedDays.includes(dayName)) return false;

  // بررسی وجود زمان باز و بسته شدن
  if (!info.openTime || !info.closeTime) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = info.openTime.split(':').map(Number);
  const [closeH, closeM] = info.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};
// Computed
const notificationCount = computed(() => 0)

// Store access


onMounted(() => {
  currentUrl.value = window.location.href
  //authStore.initAuth()

  // بررسی اسکرول برای تغییر پس‌زمینه هدر
  scrollHandler = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', scrollHandler)
  scrollHandler() // check initial state
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})

const toggleCart = () => {
  console.log('Toggle cart')
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

/*const goToUserPanel = () => {
  if (process.client) {
    const pharmacyUser = localStorage.getItem('pharmacyUser')
    if (pharmacyUser) {
      try {
        const user = JSON.parse(pharmacyUser)
        if (user.type === 'pharmacist') {
          navigateTo('/panel/pharmacies')
          return
        }
      } catch (error) {
        console.error('Error parsing pharmacy user:', error)
      }
    }
  }
  navigateTo('/panel/users')
}*/

const goToLogin = () => {
  navigateTo('/auth/login')
}

const handleMobileNavClick = (path: string) => {
  showMobileMenu.value = false
  navigateTo(path)
}

const logout = async () => {
  await authStore.logout()
  showMobileMenu.value = false
  navigateTo('/')
}

// Search functions
const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(() => {
    performLiveSearch()
  }, 300)
}

const performLiveSearch = () => {
  const query = searchQuery.value.toLowerCase()

  // Filter vets
  const filteredVets = vets.value.filter(v =>
      v.name.toLowerCase().includes(query) ||
      v.specialty.toLowerCase().includes(query)
  )

  // Filter clinics
  const filteredClinics = clinics.value.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.addr.toLowerCase().includes(query)
  )

  // Filter pharmacies
  const filteredPharmacies = pharmacies.value.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.addr.toLowerCase().includes(query)
  )

  searchResults.value = [...filteredVets, ...filteredClinics, ...filteredPharmacies]
  isSearching.value = false
}

const selectSearchResult = (result: any) => {
  showSearchResults.value = false
  searchQuery.value = result.name

  // Navigate based on type
  if (result.type === 'vet') {
    navigateTo(`/vet/${result.id}`)
  } else if (result.type === 'clinic') {
    navigateTo(`/clinic/${result.id}`)
  } else if (result.type === 'pharmacy') {
    navigateTo(`/pharmacy/${result.id}`)
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

// Close search results when clicking outside
if (process.client) {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showSearchResults.value = false
    }
  })
}
</script>
