<template>
  <div class="min-h-screen bg-white">

    <!-- ===== Hero Section ===== -->
    <section class="py-12 md:py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div
              class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-lg mb-6">
            <span class="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-gray-700">بزرگترین مارکت آنلاین حیوانات خانگی</span>
          </div>

          <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            همه چیز برای
            <span class="bg-gradient-to-l from-blue-600 to-teal-500 bg-clip-text text-transparent">
              حیوان خانگی شما
            </span>
          </h1>

          <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            فروشگاه‌های معتبر نزدیک شما، غذا، اکسسوری، اسباب‌بازی و هزاران محصول با بهترین قیمت
          </p>

          <!-- Search Box -->
          <div class="max-w-xl mx-auto">
            <div class="relative">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="جستجوی محصول یا فروشگاه..."
                  class="w-full px-6 py-4 pr-14 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-lg"
              />
              <button
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                <i class="ti ti-search text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
                @click="scrollToShops"
                class="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <i class="ti ti-building-store text-xl"></i>
              فروشگاه‌های نزدیک من
            </button>
            <NuxtLink
                to="/shops/register"
                @click.prevent="handleRegisterClick"
                class="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2"
            >
              <i class="ti ti-plus text-xl"></i>
              ثبت فروشگاه
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Categories Section ===== -->
    <section class="py-10 md:py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">دسته‌بندی محصولات</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">انواع محصولات برای حیوانات خانگی</p>
          </div>

          <!-- دکمه نمایش منوی کشویی -->
          <div ref="dropdownRef" class="relative w-full sm:w-auto">
            <button
                @click="toggleCategories"
                class="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors shadow-md"
            >
              <span>دسته‌بندی‌ها</span>
              <!-- آیکون فلش چرخشی -->
              <i :class="['transform transition-transform duration-300', categoriesVisible ? 'rotate-180' : '']">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </i>
            </button>

            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >

            <!-- لیست کشویی -->
            <div
                v-if="categoriesVisible"
                class="absolute right-0 sm:left-0 sm:right-auto top-full mt-2
                 w-full sm:w-[400px]
                 bg-white border border-gray-100 rounded-2xl
                 shadow-2xl z-50 p-4
                 max-h-[70vh] sm:max-h-[400px]
                 overflow-y-auto custom-scrollbar-x"
                style="direction: rtl;"
            >
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NuxtLink
                    v-for="category in categories"
                    :key="category.id"
                    :to="`/category/${category.slug}`"
                    @click="categoriesVisible = false"
                    class="group flex flex-col items-center p-3
                     bg-gray-50 hover:bg-blue-50
                     rounded-xl transition-all duration-300
                     border border-transparent hover:border-blue-100
                     hover:shadow-md"
                >
                <div
                    class="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                    :class="category.bgColor"
                >
                  <i :class="[category.icon, 'text-lg md:text-xl', category.iconColor]"></i>
                </div>
                <h3 class="font-semibold text-gray-800 text-xs md:text-sm text-center">{{ category.name }}</h3>
                <p class="text-[10px] text-gray-500 mt-0.5">{{ category.count }} محصول</p>
                </NuxtLink>
              </div>
            </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Nearby Shops Section ===== -->
    <section id="shops" class="py-10 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">فروشگاه‌های نزدیک شما</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">
              <i class="ti ti-map-pin text-blue-500 ml-1"></i>
              <span v-if="userLocation">موقعیت شما شناسایی شد</span>
              <span v-else>در حال یافتن موقعیت...</span>
            </p>
          </div>
          <NuxtLink to="/shops" class="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
            همه فروشگاه‌ها
            <i class="ti ti-chevron-left text-xs"></i>
          </NuxtLink>
        </div>

        <!-- City Filter (Dynamic) -->
        <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
              v-for="city in uniqueCities"
              :key="city"
              @click="selectedCity = city"
              :class="[
          'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
          selectedCity === city
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        ]"
          >
            {{ city }}
          </button>
        </div>

        <!-- Shops Slider / Grid -->
        <div
            class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
          <div
              v-for="shop in filteredAndSortedShops"
              :key="shop.id"
              class="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <!-- Shop Cover -->
            <div class="relative h-32 md:h-36 bg-gradient-to-br">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="shop.shopInfo?.value?.logo?shop.shopInfo?.value?.logo:shop.avatarBg"
                     class="w-full h-full object-cover"/>
              </div>
              <!-- Badges -->
              <div class="absolute top-3 right-3 flex items-center gap-2">
            <span v-if="shop.verified"
                  class="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
              <i class="ti ti-rosette-discount-check"></i>
              تایید شده
            </span>
              </div>
              <!-- Rating -->
              <div
                  class="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                <i class="ti ti-star-filled text-amber-500 text-sm"></i>
                <span class="text-sm font-bold text-gray-900">{{ shop.rating }}</span>
                <span class="text-xs text-gray-500">({{ shop.reviewsCount }})</span>
              </div>
            </div>
            <!-- Shop Info -->
            <div class="p-4">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                     :class="shop.shopInfo?.value?.logo?shop.shopInfo?.value?.logo:shop.avatarBg">
                  <i class="ti ti-building-store text-white text-xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 truncate">{{ shop.shopInfo?.value?.name?shop.shopInfo?.value?.name:shop.name }}</h3>
                  <p class="text-xs text-gray-500 truncate">{{ shop.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <i class="ti ti-map-pin text-blue-500"></i>
                {{ shop.address?.city }} . {{shop.address?.neighborhood}} . {{shop.address?.suburb}}
              </div>
              <!-- Distance Badge -->
              <div v-if="shop.distance !== undefined"
                   class="flex items-center gap-1 text-xs text-blue-600 font-medium mb-3">
                <i class="ti ti-navigation"></i>
                فاصله: {{ formatDistance(shop.distance) }}
              </div>
              <div class="flex items-center gap-2 mb-4">
            <span
                class="px-2 py-1 rounded-lg text-xs font-medium"
                :class="getShopOpenStatus(shop) ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
            >
                  {{ getShopOpenStatus(shop) ? 'باز' : 'بسته' }}
                </span>
                <span v-if="shop.freeDelivery"
                      class="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
              ارسال رایگان
            </span>
                <span v-if="shop.fastDelivery"
                      class="px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
              ارسال سریع
            </span>
              </div>
              <NuxtLink
                  :to="`/shop/${shop.id}`"
                  class="w-full py-2.5 bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <i class="ti ti-shopping-bag"></i>
                ورود به فروشگاه
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Load More Button (Desktop Only) -->
        <div class="hidden md:flex justify-center mt-10">
          <NuxtLink
              to="/shops"
              class="inline-flex items-center gap-3 px-8 py-4 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-100 transition-all"
          >
            <span>مشاهده همه فروشگاه‌ها</span>
            <i class="ti ti-arrow-left"></i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== All Shops Section ===== -->
    <section class="py-10 md:py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">همه فروشگاه‌ها</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">{{ allShops.length }} فروشگاه فعال در سراسر کشور</p>
          </div>
          <NuxtLink to="/shops" class="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
            صفحه فروشگاه‌ها
            <i class="ti ti-chevron-left text-xs"></i>
          </NuxtLink>
        </div>

        <!-- All Shops Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <div
              v-for="shop in allShops"
              :key="shop.id"
              class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <!-- Shop Cover -->
            <div class="relative h-32 md:h-36 bg-gradient-to-br">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="shop.shopInfo?.value?.logo?shop.shopInfo?.value?.logo:shop.avatarBg" class="w-full h-full object-cover"/>
              </div>

              <!-- Badges -->
              <div class="absolute top-3 right-3 flex items-center gap-2">
                <span v-if="shop.verified"
                      class="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                  <i class="ti ti-rosette-discount-check"></i>
                  تایید شده
                </span>
              </div>

              <!-- Rating -->
              <div
                  class="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                <i class="ti ti-star-filled text-amber-500 text-sm"></i>
                <span class="text-sm font-bold text-gray-900">{{ shop.rating }}</span>
                <span class="text-xs text-gray-500">({{ shop.reviewsCount }})</span>
              </div>

              <!-- City Badge -->
              <div
                  class="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                <i class="ti ti-map-pin text-blue-500 text-sm"></i>
                <span class="text-xs font-medium text-gray-700">{{ shop.cityName }}</span>
              </div>
            </div>

            <!-- Shop Info -->
            <div class="p-4">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                     :class="shop.shopInfo?.value?.logo?shop.shopInfo?.value?.logo:shop.avatarBg">
                  <i class="ti ti-building-store text-white text-xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 truncate">{{ shop.shopInfo?.value?.name?shop.shopInfo?.value?.name:shop.name }}</h3>
                  <p class="text-xs text-gray-500 truncate">{{ shop.description }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <i class="ti ti-map-pin text-blue-500"></i>
                {{ shop.address?.city }} . {{shop.address?.neighborhood}}. {{shop.address?.suburb}}
              </div>

              <div class="flex items-center gap-2 mb-4">
                <span
                    class="px-2 py-1 rounded-lg text-xs font-medium"
                    :class="getShopOpenStatus(shop) ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
                >
                  {{ getShopOpenStatus(shop) ? 'باز' : 'بسته' }}
                </span>
                <span v-if="shop.freeDelivery"
                      class="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                  ارسال رایگان
                </span>
                <span v-if="shop.fastDelivery"
                      class="px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
                  ارسال سریع
                </span>
              </div>

              <NuxtLink
                  :to="`/shop/${shop.id}`"
                  class="w-full py-2.5 bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <i class="ti ti-shopping-bag"></i>
                ورود به فروشگاه
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Popular Products Section ===== -->
    <section class="py-10 md:py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">پرفروش‌ترین محصولات</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">محبوب‌ترین محصولات این هفته</p>
          </div>
          <NuxtLink to="/products" class="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
            همه محصولات
            <i class="ti ti-chevron-left text-xs"></i>
          </NuxtLink>
        </div>

        <!-- Products Slider (Mobile) / Grid (Desktop) -->
        <div
            class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible md:pb-0"
        >
          <div
              v-for="product in popularProducts"
              :key="product.id"
              class="flex-shrink-0 w-[200px] md:w-auto snap-start bg-white rounded-2xl p-3 md:p-4 border border-gray-100 hover:shadow-lg transition-all group"
          >
            <!-- Product Image -->
            <NuxtLink :to="`/product/${product.id}`"
                      class="block relative aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden">
              <div
                  class="relative aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden flex items-center justify-center"
              >
                <img v-if="product?.image" :src="product.image" class="w-full h-full object-cover"/>
                <i v-else class="ti ti-package text-4xl text-gray-300"></i>

                <span v-if="product.discount"
                      class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                    {{ product.discount }}%
                </span>

                <!-- دکمه لایک / دیسلایک -->
                <button
                    @click.prevent="handleLike(product.id)"
                    class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                >
                  <!-- حالت لایک شده (قلب قرمز پر) -->
                  <i
                      v-if="isProductLiked(product.id)"
                      class="ti ti-heart-filled text-red-500 text-lg transition-all duration-300 scale-110"
                  ></i>

                  <!-- حالت دیسلایک شده (قلب شکسته خاکستری) -->
                  <i
                      v-else-if="isProductDisliked(product.id)"
                      class="ti ti-heart-broken text-gray-500 text-lg transition-all duration-300"
                  ></i>

                  <!-- حالت عادی (قلب توخالی) -->
                  <i
                      v-else
                      class="ti ti-heart text-gray-400 hover:text-red-500 text-lg transition-all duration-300"
                  ></i>
                </button>
              </div>
            </NuxtLink>

            <!-- Product Info -->
            <div>
              <p class="text-xs text-gray-500 mb-1">{{ product.shop }}</p>
              <h3 class="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">{{ product.name }}</h3>
              <div class="flex items-center gap-1 mb-2">
                <i class="ti ti-star-filled text-amber-500 text-xs"></i>
                <span class="text-xs font-semibold text-gray-700">{{ product.rating }}</span>
                <span class="text-xs text-gray-400">({{ product.reviews }})</span>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p v-if="product.originalPrice" class="text-xs text-gray-400 line-through">
                    {{ formatPrice(product.originalPrice) }}
                  </p>
                  <p class="text-sm font-bold text-blue-600">
                    {{ formatPrice(product.price) }}
                    <span class="text-xs font-normal text-gray-500">تومان</span>
                  </p>
                </div>
                <button
                    @click.prevent="handleAddToCart(product)"
                    class="w-9 h-9 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <i class="ti ti-shopping-cart-plus text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Become Seller Section ===== -->
    <section class="py-10 md:py-16 bg-gradient-to-br from-blue-600 to-teal-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-6">
            <i class="ti ti-building-store text-xl"></i>
            <span class="text-sm font-medium">فروشنده شوید</span>
          </div>

          <h2 class="text-2xl md:text-4xl font-bold mb-6">
            فروشگاه خود را در پت مارکت ثبت کنید
          </h2>

          <p class="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            به هزاران فروشنده موفق بپیوندید و محصولات خود را به میلیون‌ها صاحب حیوان خانگی بفروشید
          </p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="text-3xl font-bold mb-1">۵۰۰+</div>
              <div class="text-sm text-white/70">فروشگاه فعال</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="text-3xl font-bold mb-1">۱۰K+</div>
              <div class="text-sm text-white/70">محصول</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="text-3xl font-bold mb-1">۵۰K+</div>
              <div class="text-sm text-white/70">مشتری فعال</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="text-3xl font-bold mb-1">۹۵%</div>
              <div class="text-sm text-white/70">رضایت مشتری</div>
            </div>
          </div>

          <NuxtLink
              to="/shops/register"
              class="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-xl transition-all"
          >
            <i class="ti ti-rocket text-xl"></i>
            <span>شروع فروشندگی</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== Features Section ===== -->
    <section class="py-10 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div class="bg-white rounded-2xl p-5 text-center border border-gray-100">
            <div class="w-14 h-14 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i class="ti ti-truck-delivery text-2xl text-blue-600"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">ارسال سریع</h3>
            <p class="text-sm text-gray-500">ارسال به سراسر کشور</p>
          </div>

          <div class="bg-white rounded-2xl p-5 text-center border border-gray-100">
            <div class="w-14 h-14 bg-teal-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i class="ti ti-shield-check text-2xl text-teal-600"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">ضمانت اصالت</h3>
            <p class="text-sm text-gray-500">تضمین کیفیت محصولات</p>
          </div>

          <div class="bg-white rounded-2xl p-5 text-center border border-gray-100">
            <div class="w-14 h-14 bg-amber-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i class="ti ti-coin text-2xl text-amber-600"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">بهترین قیمت</h3>
            <p class="text-sm text-gray-500">تضمین قیمت رقابتی</p>
          </div>

          <div class="bg-white rounded-2xl p-5 text-center border border-gray-100">
            <div class="w-14 h-14 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i class="ti ti-headset text-2xl text-purple-600"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">پشتیبانی ۲۴/۷</h3>
            <p class="text-sm text-gray-500">همیشه در کنار شما</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Toast Notification -->
    <Transition name="toast">
      <div
          v-if="showToast"
          class="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-lg z-50 flex items-center gap-2"
      >
        <i class="ti ti-check text-green-400"></i>
        {{ toastMessage }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import {computed, onMounted,onBeforeUnmount, ref} from 'vue'
import {useShopStore} from "../stores/shop.store.js";
import {useCategoryStore} from "../stores/category.store.ts";
import {useProductStore} from "../stores/product.store.ts";
import {useAuthStore} from "../stores/auth.ts";
import {useRuntimeConfig} from "nuxt/app";
const authStore=useAuthStore()
const config = useRuntimeConfig()
const {$toast}=useNuxtApp()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
// Search
const searchQuery = ref('')
const {addToCart: addItemToCart, cartItems, cartTotal, openCart} = useCart()

const categories = computed(() => categoryStore.categories)
const shopStore = useShopStore()
const shops = computed(() => shopStore.shops)
// All shops (for all shops section)
const allShops = computed(() => {
  return shops.value
})

// تابع کمکی برای محاسبه وضعیت باز/بسته بودن هر فروشگاه
const getShopOpenStatus = (shop) => {
  const shopInfoSetting = shop.shopInfo;
  // اگر تنظیمات shopInfo پیدا نشد، پیش‌فرض را بسته در نظر بگیر
  if (!shopInfoSetting || !shopInfoSetting.value) return false;

  const info = shopInfoSetting.value;

  // ۲. بررسی وجود فیلدهای زمانی در value
  if (!info.openTime || !info.closeTime) return false;

  // ۳. بررسی حالت ۲۴ ساعته
  if (info.is24Hours) return true;

  // ۴. دریافت روز و ساعت فعلی
  const now = new Date();
  const daysMap = {
    0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
    4: 'thursday', 5: 'friday', 6: 'saturday'
  };
  const currentDayKey = daysMap[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInHours = currentHour + (currentMinute / 60);

  // ۵. بررسی تعطیلی (closedDays)
  if (info.closedDays && info.closedDays.includes(currentDayKey)) {
    return false;
  }

  // ۶. تبدیل ساعت‌ها به عدد
  const [openHour, openMinute] = info.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = info.closeTime.split(':').map(Number);
  const openTimeInHours = openHour + (openMinute / 60);
  const closeTimeInHours = closeHour + (closeMinute / 60);

  // ۷. مقایسه زمان
  return currentTimeInHours >= openTimeInHours && currentTimeInHours <= closeTimeInHours;
};

// متد بررسی وضعیت لایک (بر اساس استور)
const isProductLiked = (productId) => {
  const product = productStore.products.find(p => p.id === productId);
  return product?.isFavorite || false;
};

// متد بررسی وضعیت دیسلایک (بر اساس استور)
const isProductDisliked = (productId) => {
  const product = productStore.products.find(p => p.id === productId);
  return product?.disliked || false;
};

// متد مدیریت کلیک روی دکمه لایک
const handleLike = async (productId) => {
  const currentLiked = isProductLiked(productId);
  const currentDisliked = isProductDisliked(productId);

  // منطق کلیک:
  // اگر لایک شده باشد: لایک را بردار (Unfavorite)
  // اگر لایک نشده باشد (چه دیسلایک باشد چه خالی): لایک کن

  const newLikeStatus = !currentLiked;

  try {
    // فراخوانی اکشن استور
    await productStore.toggleLike(productId, newLikeStatus);

    // پیام موفقیت (اختیاری)
    if (newLikeStatus) {
      showToastMessage('محصول به علاقه‌مندی‌ها اضافه شد');
    } else {
      showToastMessage('محصول از علاقه‌مندی‌ها حذف شد');
    }
  } catch (error) {
    console.error('خطا در ثبت لایک:', error);
    showToastMessage('عملیات با خطا مواجه شد');
  }
};

const popularProducts = computed(() => {
  const rawList = productStore.bestSellingProducts; // لیست پرفروش‌ها (شامل قیمت و موجودی خاص)
  const productDetails = productStore.products;     // لیست تمام محصولات (شامل نام، عکس و جزئیات)

  if (!rawList || rawList.length === 0) return [];

  return rawList.map((bestItem) => {

    // پیدا کردن اطلاعات کامل محصول بر اساس آیدی
    const fullProduct = productDetails.find((p) => p.id === bestItem.id);

    // اگر محصولی پیدا نشد، نادیده بگیر
    if (!fullProduct) return null;

    return {
      // ۱. ابتدا تمام اطلاعات کامل محصول را کپی کن (نام، عکس، برند، ویژگی‌ها و...)
      ...fullProduct,

      // ۲. سپس فقط فیلدهای مهم مالی و موجودی را از لیست پرفروش‌ها آپدیت کن
      // (این کار باعث می‌شود اطلاعات خالی bestItem اطلاعات کامل را پاک نکند)
      price: bestItem.price || fullProduct.price,
      stock: bestItem.stock || fullProduct.stock,
      totalSold: bestItem.totalSold || 0,
      activeVariant: bestItem.activeVariant || null, // اگر واریانت پرفروش وجود دارد
      // ۳. اصلاح فیلدها برای نمایش (Mapping)
      shop: fullProduct.seller?.name || fullProduct.shop || '',
      reviews: fullProduct.reviewCount || 0,
    };
  }).filter(item => item !== null);
});
/*const popularProducts = ref([
  {
    id: 1,
    name: 'غذای خشک سگ رویال کنین',
    shop: 'پت شاپ پارسیان',
    price: 850000,
    originalPrice: 950000,
    discount: 10,
    rating: 4.9,
    reviews: 234
  },
  {
    id: 2,
    name: 'غذای گربه ویسکاس',
    shop: 'پت لند',
    price: 320000,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 3,
    name: 'اسباب‌بازی توپ سگ',
    shop: 'حیوانات خانگی ایران',
    price: 85000,
    originalPrice: 120000,
    discount: 30,
    rating: 4.5,
    reviews: 89
  },
  {
    id: 4,
    name: 'شامپو ضد کک و کنه',
    shop: 'پت مارکت کرج',
    price: 195000,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 312
  },
  {
    id: 5,
    name: 'خاک گربه پرمیوم',
    shop: 'گربه‌سرا',
    price: 145000,
    originalPrice: 180000,
    discount: 20,
    rating: 4.6,
    reviews: 567
  },
])*/

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Scroll to shops section
const scrollToShops = () => {
  document.getElementById('shops')?.scrollIntoView({behavior: 'smooth'})
}
const showToast = ref(false)
const toastMessage = ref('')
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}
const handleAddToCart = (product) => {
  addItemToCart({
    productId: product.id, // مهم: برای پشتیبانی از ورینت‌ها
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    quantity: 1,
    category: product.category?.name,
    shopId: product.seller?.id,
    shopName: product.seller?.name,
    image: product.image, // اضافه کردن تصویر
    variantId: null // چون در لیست محصولات ورینتی انتخاب نشده، نال است
  })
  showToastMessage('محصول به سبد خرید اضافه شد')
}

// --- State ---
const userLocation = ref(null) // { lat: ..., lng: ... }
const selectedCity = ref('همه')

// --- 1. استخراج شهرهای یکتا از لیست فروشگاه‌ها ---
const uniqueCities = computed(() => {
  const cities = new Set(shops.value.map(s => s.cityName))
  return ['همه', ...Array.from(cities)]
})
const currentUrl = ref('')
// --- 2. دریافت موقعیت مکانی کاربر ---
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  currentUrl.value = window.location.href;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          // ✅ دریافت موفق لوکیشن از GPS مرورگر
          // بدون هیچ شرطی، مقادیر را مستقیماً ست می‌کنیم
          userLocation.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('✅ لوکیشن واقعی کاربر ست شد:', userLocation.value);
        },
        (error) => {
          // ❌ خطا در دریافت لوکیشن (مثلاً کاربر اجازه نداده یا GPS خاموش است)
          console.warn('⚠️ خطا در دریافت لوکیشن. استفاده از پیش‌فرض تهران.', error);

          // فقط در اینجا از پیش‌فرض تهران استفاده می‌کنیم
          userLocation.value = { lat: 35.6892, lng: 51.3890 };
        },
        {
          enableHighAccuracy: true, // استفاده از دقیق‌ترین حالت (GPS)
          timeout: 10000,           // حداکثر زمان انتظار: ۱۰ ثانیه
          maximumAge: 0             // عدم استفاده از لوکیشن کش شده (برای دقت بالا)
        }
    );
  } else {
    // مرورگر از Geolocation پشتیبانی نمی‌کند
    console.warn('⚠️ مرورگر از Geolocation پشتیبانی نمی‌کند. استفاده از پیش‌فرض تهران.');
    userLocation.value = { lat: 35.6892, lng: 51.3890 };
  }
});
const dropdownRef = ref(null)

const handleClickOutside = (event) => {
  if (
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target)
  ) {
    categoriesVisible.value = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// تابع کمکی برای تبدیل درجه به رادیان
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// تابع محاسبه فاصله به کیلومتر (فرمول Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // شعاع زمین به کیلومتر

  // تبدیل ورودی‌ها به عدد (برای جلوگیری از خطاهای نوع داده)
  const dLat = deg2rad(Number(lat2) - Number(lat1));
  const dLon = deg2rad(Number(lon2) - Number(lon1));

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(Number(lat1))) * Math.cos(deg2rad(Number(lat2))) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // فاصله به کیلومتر
};

// --- 4. فیلتر و مرتب‌سازی ---
const filteredAndSortedShops = computed(() => {
  let result = [...shops.value];

  // الف) فیلتر بر اساس شهر
  if (selectedCity.value !== 'همه') {
    result = result.filter(shop => shop.cityName === selectedCity.value);
  }

  // ب) محاسبه فاصله
  if (userLocation.value) {
    const uLat = Number(userLocation.value.lat);
    const uLng = Number(userLocation.value.lng);

    result = result.map(shop => {
      // استخراج مختصات از ساختار دقیق JSON ارسالی شما
      // ساختار: shop.address.location
      const shopLoc = shop.address?.location;

      if (!shopLoc) {
        console.warn('مختصات آدرس برای فروشگاه یافت نشد:', shop.id);
        return { ...shop, distance: Infinity };
      }

      const sLat = Number(shopLoc.lat);
      const sLng = Number(shopLoc.lng);

      // اگر مختصات معتبر نبود
      if (isNaN(sLat) || isNaN(sLng)) {
        console.warn('مختصات نامعتبر برای فروشگاه:', shop.id, shopLoc);
        return { ...shop, distance: Infinity };
      }

      // محاسبه فاصله
      const dist = calculateDistance(uLat, uLng, sLat, sLng);

      // دیباگ برای اطمینان
      console.log(`Shop: ${shop.name}, Dist: ${dist.toFixed(3)} km`);

      return { ...shop, distance: dist };
    });

    // ج) مرتب‌سازی بر اساس فاصله (نزدیک‌ترین اول)
    result.sort((a, b) => a.distance - b.distance);
  }

  return result;
});

// فرمت کردن فاصله برای نمایش
const formatDistance = (km) => {
  if (isNaN(km)) return '-';
  if (km < 1) {
    return Math.round(km * 1000) + ' متر';
  }
  return km.toFixed(1) + ' کیلومتر';
};


const isAuthenticated = computed(()=>authStore.isAuthenticated)
const handleRegisterClick = () => {

  if (!isAuthenticated.value) {

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

// متغیر برای کنترل نمایش منو
const categoriesVisible = ref(false);

// متد برای باز و بسته کردن
const toggleCategories = () => {
  categoriesVisible.value = !categoriesVisible.value;
};

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.custom-scrollbar-x::-webkit-scrollbar {
  height: 6px; /* ارتفاع اسکرول‌بار افقی */
}

.custom-scrollbar-x::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar-x::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
/* اسکرول‌بار سفارشی برای داخل منوی کشویی */
.custom-scrollbar-x::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar-x::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar-x::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
