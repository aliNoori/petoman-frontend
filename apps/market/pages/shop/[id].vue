<template>
  <div v-if="shop" class="min-h-screen bg-gray-50">
    <!-- Shop Header -->
    <div class="bg-gradient-to-br relative overflow-hidden" :class="shop.coverGradient">
      <div class="absolute inset-0 flex items-center justify-center">
        <img :src="shop.shopInfo.value?.logo?shop.shopInfo.value?.logo:shop.avatarBg" class="w-full h-full object-cover"/>
      </div>
      <div class="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div class="flex flex-col md:flex-row items-start md:items-end gap-6">
          <!-- Shop Avatar -->
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center bg-white shadow-xl">
            <i class="ti ti-building-store text-4xl md:text-5xl" :class="shop.iconColor"></i>
          </div>

          <!-- Shop Info -->
          <div class="flex-1 text-white">
            <div class="flex items-center gap-2 mb-2">
              <h1 class="text-2xl md:text-3xl font-bold">{{ shop.shopInfo.value?.name?shop.shopInfo.value?.name:shop.name }}</h1>
              <span v-if="shop.verified"
                    class="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium flex items-center gap-1">
                <i class="ti ti-rosette-discount-check"></i>
                تایید شده
              </span>
            </div>
            <p class="text-white/80 mb-3">{{ shop.description }}</p>
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <div class="flex items-center gap-1">
                <i class="ti ti-star-filled text-amber-400"></i>
                <span class="font-bold">{{ shop.rating }}</span>
                <span class="text-white/60">({{ shop.reviewsCount }} نظر)</span>
              </div>
              <div class="flex items-center gap-1 text-white/80">
                <i class="ti ti-map-pin"></i>
                {{ shop.address.city }} . {{shop.address.neighborhood}}. {{shop.address.suburb}}
              </div>
              <span
                  class="px-2 py-1 rounded-lg text-xs font-medium"
                  :class="isOpenStatus ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ isOpenStatus ? 'باز' : 'بسته' }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
                @click="activeTab = 'reviews'"
                class="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                title="نظرات"
            >
              <i class="ti ti-message text-xl"></i>
            </button>
            <button
                @click="shareShop"
                class="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                title="اشتراک‌گذاری"
            >
              <i class="ti ti-share text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Shop Features -->
    <div class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div v-if="shop.freeDelivery"
               class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 text-sm whitespace-nowrap">
            <i class="ti ti-truck-delivery"></i>
            ارسال رایگان
          </div>
          <div v-if="shop.fastDelivery"
               class="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-xl text-teal-600 text-sm whitespace-nowrap">
            <i class="ti ti-bolt"></i>
            ارسال سریع
          </div>
          <div
              class="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl text-purple-600 text-sm whitespace-nowrap">
            <i class="ti ti-shield-check"></i>
            ضمانت اصالت
          </div>
          <div
              class="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-600 text-sm whitespace-nowrap">
            <i class="ti ti-refresh"></i>
            ۷ روز ضمانت بازگشت
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-30">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">

        <!-- Discounted Products Section -->
        <div v-if="discountedProducts.length > 0" class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <i class="ti ti-discount-2 text-2xl text-red-500"></i>
              </div>
              <div>
                <h2 class="text-lg md:text-xl font-bold text-gray-900">تخفیف‌خورده‌ها</h2>
                <p class="text-sm text-gray-500">محصولات با تخفیف ویژه</p>
              </div>
            </div>
            <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {{ discountedProducts.length }} محصول
            </span>
          </div>

          <!-- Discounted Products Slider -->
          <div class="relative group">
            <Swiper
                :modules="[SwiperAutoplay, SwiperNavigation]"
                :slides-per-view="2"
                :space-between="12"
                :autoplay="{ delay: 3000, disableOnInteraction: false }"
                :navigation="{ nextEl: '.swiper-discount-next', prevEl: '.swiper-discount-prev' }"
                :breakpoints="{
              640: {
                slidesPerView: 3,
                slidesPerGroup: 3
              },
              768: {
                slidesPerView: 4,
                slidesPerGroup: 4
              },
              1024: {
                slidesPerView: 5,
                slidesPerGroup: 5
              }
            }"
                class="!overflow-hidden"
            >
              <SwiperSlide
                  v-for="product in discountedProducts"
                  :key="'discount-' + product.id"
              >
                <div
                    class="bg-white rounded-2xl border-2 border-red-100 overflow-hidden hover:shadow-lg hover:border-red-300 transition-all h-full">
                  <!-- Product Image -->
                  <NuxtLink :to="`/product/${product.id}`"
                            class="block relative aspect-square bg-gradient-to-br from-red-50 to-orange-50">
                    <div class="w-full h-full flex items-center justify-center">
                      <img :src="product.image" class="w-full h-full object-cover"/>
                    </div>
                    <div
                        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <i class="ti ti-discount-2 text-xs"></i>
                      {{ product.discount }}%
                    </div>
                  </NuxtLink>

                  <!-- Product Info -->
                  <div class="p-3">
                    <p class="text-xs text-gray-500 mb-1">{{ product.category }}</p>
                    <h3 class="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">{{ product.name }}</h3>

                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xs text-gray-400 line-through">{{ formatPrice(product.originalPrice) }}</span>
                      <span class="font-bold text-red-600 text-sm">{{ formatPrice(product.price) }}</span>
                    </div>

                    <!-- دکمه افزودن به سبد خرید (زمانی که موجود است) -->
                    <button
                        v-if="product.available"
                        @click.prevent="handleAddToCart(product)"
                        class="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                    >
                      <i class="ti ti-shopping-cart-plus"></i>
                      افزودن
                    </button>

                    <!-- حالت ناموجود (هم‌اندازه با دکمه اصلی برای حفظ چیدمان) -->
                    <button
                        v-else
                        disabled
                        class="w-full py-2 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm font-medium"
                        title="ناموجود"
                    >
                      <i class="ti ti-shopping-cart-off"></i>
                      ناموجود
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <!-- Navigation Buttons -->
            <button
                class="swiper-discount-prev hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center text-gray-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 group-hover:-right-2">
              <i class="ti ti-chevron-right text-xl"></i>
            </button>
            <button
                class="swiper-discount-next hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center text-gray-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 group-hover:-left-2">
              <i class="ti ti-chevron-left text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Category Filter -->
        <ClientOnly>
          <div class="mb-6">
            <select
                v-model="selectedCategory"
                class="w-full sm:w-auto min-w-[200px] px-4 py-2.5 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none pr-10 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em]"
                style="background-image: url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e');"
            >
              <option value="">همه</option>
              <option v-for="cat in categories" :key="cat.name" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </ClientOnly>

        <!-- Products Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white rounded-2xl p-3 md:p-4 border border-gray-100 hover:shadow-lg transition-all group relative"
          >
            <!-- Product Image -->
            <NuxtLink :to="`/product/${product.id}`"
                      class="block relative aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden">
              <div class="w-full h-full flex items-center justify-center">
                <img :src="product.image" class="w-full h-full object-cover"/>
              </div>
              <span v-if="product.discount"
                    class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                {{ product.discount }}%
              </span>
              <button
                  @click.prevent="toggleFavorite(product.id)"
                  class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <i :class="['ti', product.isFavorite ? 'ti-heart-filled text-red-500' : 'ti-heart text-gray-600']"></i>
              </button>
            </NuxtLink>

            <!-- Product Info -->
            <div>
              <p class="text-xs text-gray-500 mb-1">{{ product.category }}</p>
              <h3 class="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">{{ product.name }}</h3>

              <div class="flex items-center gap-1 mb-2">
                <i class="ti ti-star-filled text-amber-500 text-xs"></i>
                <span class="text-xs font-semibold text-gray-700">{{ product.rating }}</span>
                <span class="text-xs text-gray-400">({{ product.reviews }})</span>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p v-if="product.originalPrice" class="text-xs text-gray-400 line-through">
                    {{ formatPrice(product.price) }}
                  </p>
                  <p class="text-sm font-bold text-blue-600">
                    {{ formatPrice(product.originalPrice) }}
                    <span class="text-xs font-normal text-gray-500">تومان</span>
                  </p>
                </div>
                <button
                    v-if="product.available"
                    @click.prevent="handleAddToCart(product)"
                    class="w-9 h-9 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <i class="ti ti-shopping-cart-plus text-lg"></i>
                </button>
                <!-- حالت ناموجود (اختیاری): اگر می‌خواهید جای دکمه چیز دیگری نمایش دهید -->
                <div
                    v-else
                    class="w-9 h-9 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center cursor-not-allowed"
                    title="ناموجود"
                >
                  <i class="ti ti-shopping-cart-off text-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="ti ti-package-off text-4xl text-gray-400"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">محصولی یافت نشد</h3>
          <p class="text-gray-500">در این دسته‌بندی محصولی وجود ندارد</p>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreProducts" class="text-center mt-8">
          <button
              @click="loadMoreProducts"
              :disabled="isLoadingMore"
              class="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <i v-if="isLoadingMore" class="ti ti-loader animate-spin"></i>
            <i v-else class="ti ti-plus"></i>
            {{ isLoadingMore ? 'در حال بارگذاری...' : 'مشاهده محصولات بیشتر' }}
          </button>
          <p class="text-sm text-gray-500 mt-2">
            {{ filteredProducts.length }} از {{ allFilteredProducts.length }} محصول
          </p>
        </div>
      </div>

      <!-- Info Tab -->
      <div v-if="activeTab === 'info'" class="max-w-3xl">
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <!-- Location Info -->
          <div class="p-6 border-b border-gray-100">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-map-pin text-red-500"></i>
              موقعیت مکانی
            </h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3 mb-4">
                <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-map-pin text-red-500"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">آدرس</p>
                  <p class="font-medium text-gray-900 leading-relaxed">{{ shop.address.city }} . {{shop.address.neighborhood}}. {{shop.address.suburb}}</p>
                </div>
              </div>

              <!-- Mapbox -->
              <div class="rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100"
                   style="height: 300px;">
                <div id="map" class="w-full h-full"></div>
              </div>

              <a
                  href="https://www.openstreetmap.org/?mlat=35.70&mlon=51.42#map=15/35.70/51.42"
                  target="_blank"
                  class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                <i class="ti ti-external-link"></i>
                مشاهده در نقشه
              </a>
            </div>
          </div>

          <!-- Working Hours -->
          <div class="p-6 border-b border-gray-100">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-clock text-blue-500"></i>
              ساعات کاری
            </h3>

            <div class="space-y-3">
              <!-- بررسی حالت ۲۴ ساعته -->
              <div v-if="settingsShop.shopInfo?.is24Hours" class="flex items-center justify-between">
                <span class="text-gray-600">همه روزه</span>
                <span class="font-medium text-green-600">۲۴ ساعته</span>
              </div>

              <!-- نمایش ساعات کاری عادی -->
              <template v-else>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">ساعت کاری</span>
                  <span class="font-medium text-gray-900">
          {{ settingsShop.shopInfo?.openTime || '-' }}
          تا
          {{ settingsShop.shopInfo?.closeTime || '-' }}
        </span>
                </div>
              </template>

              <!-- نمایش روزهای تعطیل -->
              <div v-if="settingsShop.shopInfo?.closedDays && settingsShop.shopInfo.closedDays.length > 0"
                   class="flex items-center justify-between">
                <span class="text-gray-600">تعطیلات</span>
                <span class="font-medium text-red-500">
                  <!-- تبدیل آرایه روزهای تعطیل به متن فارسی -->
                  {{ formatClosedDays(settingsShop.shopInfo.closedDays) }}
                </span>
              </div>

              <!-- اگر روز تعطیلی وجود نداشت -->
              <div v-else class="flex items-center justify-between">
                <span class="text-gray-600">تعطیلات</span>
                <span class="font-medium text-gray-900">بدون تعطیلی</span>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="p-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-info-circle text-blue-500"></i>
              درباره فروشگاه
            </h3>
            <p class="text-gray-600 leading-relaxed">
              فروشگاه {{ shop.shopInfo.value?.name?shop.shopInfo.value?.name:shop.name }}
              <br><br>
              {{ shop.description }}

            </p>
          </div>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div v-if="activeTab === 'reviews'" class="max-w-3xl">
        <!-- Add Review Form -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-edit-circle text-blue-500"></i>
            ثبت نظر جدید
          </h3>
          <div class="space-y-5">

            <!-- Rating Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">امتیاز شما</label>
              <div class="flex items-center gap-1">
                <button
                    v-for="n in 5"
                    :key="n"
                    @click="newReview.rating = n"
                    class="text-2xl transition-colors"
                    :class="n <= newReview.rating ? 'text-amber-400' : 'text-gray-300 hover:text-amber-200'"
                >
                  <i class="ti ti-star-filled"></i>
                </button>
              </div>
            </div>

            <!-- Tags Selection (Positive & Negative) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نکات مثبت و منفی (انتخابی)</label>

              <!-- Positive Tags -->
              <div class="mb-3">
                <span class="text-xs text-green-600 font-medium mb-1 block">نکات مثبت:</span>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="tag in availableTags.positive"
                      :key="tag"
                      @click="toggleTag(tag, 'positive')"
                      class="px-3 py-1.5 rounded-lg text-xs border transition-all"
                      :class="isTagSelected(tag, 'positive')
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'"
                  >
                    <i class="ti ti-thumb-up mr-1"></i> {{ tag }}
                  </button>
                </div>
              </div>

              <!-- Negative Tags -->
              <div>
                <span class="text-xs text-red-600 font-medium mb-1 block">نکات منفی:</span>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="tag in availableTags.negative"
                      :key="tag"
                      @click="toggleTag(tag, 'negative')"
                      class="px-3 py-1.5 rounded-lg text-xs border transition-all"
                      :class="isTagSelected(tag, 'negative')
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'"
                  >
                    <i class="ti ti-thumb-down mr-1"></i> {{ tag }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Comment Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات بیشتر</label>
              <textarea
                  v-model="newReview.comment"
                  rows="3"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  placeholder="تجربه خود را از این فروشگاه بنویسید..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
                @click="submitReview"
                :disabled="isSubmittingReview || !newReview.rating || !newReview.comment"
                class="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="isSubmittingReview" class="ti ti-loader animate-spin"></i>
              <span v-else>ثبت نظر</span>
            </button>
          </div>
        </div>
        <!-- Reviews Summary -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div class="flex items-center gap-6">
            <!-- بخش امتیاز کلی -->
            <div class="text-center">
              <div class="text-5xl font-bold text-gray-900">{{ shop.rating }}</div>
              <div class="flex items-center gap-1 justify-center mt-2">
                <!-- نمایش ستاره‌ها بر اساس امتیاز اعشاری -->
                <i v-for="n in 5" :key="n"
                   class="ti ti-star-filled text-amber-500"
                   :class="{ 'text-gray-200': n > Math.round(shop.rating) }">
                </i>
              </div>
              <p class="text-sm text-gray-500 mt-1">از {{ shop.reviewsCount }} نظر</p>
            </div>

            <!-- بخش نمودار میله‌ای -->
            <div class="flex-1 space-y-2">
              <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2">
                <span class="text-sm text-gray-500 w-3">{{ star }}</span>
                <i class="ti ti-star-filled text-amber-500 text-sm"></i>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <!-- استفاده از تابع محاسبه درصد -->
                  <div class="h-full bg-amber-500 rounded-full transition-all duration-500"
                       :style="{ width: calculateStarPercentage(star) + '%' }">
                  </div>
                </div>
                <span class="text-xs text-gray-500 w-10">{{ calculateStarPercentage(star) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="space-y-4">
          <div
              v-for="review in reviews"
              :key="review.id"
              class="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="ti ti-user text-gray-400 text-xl"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ review.userName }}</h4>
                    <div class="flex items-center gap-1 mt-1">
                      <i v-for="n in review.rating" :key="n" class="ti ti-star-filled text-amber-500 text-sm"></i>
                      <i v-for="n in (5 - review.rating)" :key="'empty-'+n"
                         class="ti ti-star text-gray-300 text-sm"></i>
                    </div>
                  </div>
                  <span class="text-sm text-gray-500">{{ review.date }}</span>
                </div>
                <p class="text-gray-600 leading-relaxed">{{ review.comment }}</p>
                <div v-if="review.reply" class="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div class="flex items-center gap-2 mb-2">
                    <i class="ti ti-building-store text-blue-500"></i>
                    <span class="font-semibold text-blue-600">پاسخ فروشگاه</span>
                  </div>
                  <p class="text-gray-600 text-sm">{{ review.reply }}</p>
                </div>
              </div>
            </div>
            <!-- فوتر نظر: دکمه مفید بودن -->
            <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
              <button
                  @click="toggleHelpful(review.id)"
                  class="flex items-center gap-1.5 text-xs transition-colors"
                  :class="review.isHelpfulByMe ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'"
              >
                <i :class="review.isHelpfulByMe ? 'ti ti-thumb-up-filled' : 'ti ti-thumb-up'"></i>
                مفید ({{ review.helpfulCount || 0 }})
              </button>

              <button class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
                <i class="ti ti-flag"></i>
                گزارش تخلف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Button (Fixed) -->
    <div v-if="cartItems.length > 0" class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40">
      <button
          @click="showCart = true"
          class="w-full flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-shopping-cart text-xl"></i>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium">{{ cartItems.length }} محصول</p>
            <p class="text-xs text-white/70">مشاهده سبد خرید</p>
          </div>
        </div>
        <div class="text-left">
          <p class="text-lg font-bold">{{ formatPrice(cartTotal) }}</p>
          <p class="text-xs text-white/70">تومان</p>
        </div>
      </button>
    </div>

    <!-- Cart Drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showCart"
            class="fixed inset-0 bg-black/50 z-50"
            @click="showCart = false"
        ></div>
      </Transition>
      <Transition name="slide-left">
        <div
            v-if="showCart"
            class="fixed top-0 left-0 bottom-0 w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col"
        >
          <!-- Cart Header -->
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">سبد خرید</h3>
            <button @click="showCart = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <i class="ti ti-x text-xl text-gray-500"></i>
            </button>
          </div>

          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-if="cartItems.length === 0" class="text-center py-16">
              <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-shopping-cart text-4xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">سبد خرید خالی است</h3>
              <p class="text-gray-500 text-sm">محصولات مورد نظر خود را اضافه کنید</p>
            </div>

            <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-3 bg-gray-50 rounded-xl p-3"
            >
              <div class="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-20 h-20 rounded-lg object-cover"
                >
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</h4>
                <p class="text-xs text-gray-500 mb-2">{{ item.category }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button
                        @click="decreaseQuantity(item.id)"
                        class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                    >
                      <i class="ti ti-minus text-sm"></i>
                    </button>
                    <span class="text-sm font-semibold w-6 text-center">{{ item.quantity }}</span>
                    <button
                        @click="increaseQuantity(item.id)"
                        class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                    >
                      <i class="ti ti-plus text-sm"></i>
                    </button>
                  </div>
                  <p class="text-sm font-bold text-blue-600">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
              <button
                  @click="removeFromCart(item.id)"
                  class="p-2 text-gray-400 hover:text-red-500"
              >
                <i class="ti ti-trash text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Cart Footer -->
          <div v-if="cartItems.length > 0" class="p-4 border-t border-gray-100 space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">جمع سبد خرید:</span>
              <span class="font-bold text-gray-900">{{ formatPrice(cartTotal) }} تومان</span>
            </div>
            <button
                @click="checkout"
                class="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-credit-card"></i>
              ادامه فرآیند
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

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
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Autoplay as SwiperAutoplay, Navigation as SwiperNavigation} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import {useShopStore} from "../../stores/shop.store.ts";

import {useProductStore} from "../../stores/product.store.ts";
const {$toast}=useNuxtApp()
const productStore=useProductStore()
const route = useRoute()
const router = useRouter()
const shopId = route.params.id
const categoryStore=useCategoryStore()
// Categories
const categories = computed(()=>categoryStore.categories)
// Use cart composable
const {addToCart: addItemToCart, cartItems, cartTotal, cartTotalWithDiscount, openCart} = useCart()
// نگاشت نام روزهای انگلیسی به فارسی
const dayMap = {
  saturday: 'شنبه',
  sunday: 'یکشنبه',
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنجشنبه',
  friday: 'جمعه'
};

// تابع فرمت کردن روزهای تعطیل
const formatClosedDays = (days) => {
  if (!days || days.length === 0) return '';
  // تبدیل هر روز به معادل فارسی و joining با کاما
  return days.map(day => dayMap[day] || day).join('، ');
};
const shopStore = useShopStore()
const shop = computed(() => shopStore.getShopById(route.params.id))

// نگاشت نام روزهای هفته به انگلیسی (برای تطبیق با closedDays)
const daysMap = {
  0: 'sunday',    // یکشنبه
  1: 'monday',    // دوشنبه
  2: 'tuesday',   // سه‌شنبه
  3: 'wednesday', // چهارشنبه
  4: 'thursday',  // پنجشنبه
  5: 'friday',    // جمعه
  6: 'saturday'   // شنبه
};

const isOpenStatus = computed(() => {
  const shopInfo = shopStore.rawSettings?.shopInfo;

  // اگر اطلاعات لود نشده باشد، پیش‌فرض بسته باشد
  if (!shopInfo) return false;

  // ۱. بررسی حالت ۲۴ ساعته
  if (shopInfo.is24Hours) return true;

  // ۲. دریافت روز و ساعت فعلی
  const now = new Date();
  const currentDayKey = daysMap[now.getDay()]; // مثلاً 'sunday'
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // تبدیل ساعت فعلی به عدد برای مقایسه راحت‌تر (مثلاً ۹:۳۰ می‌شود ۹.۵)
  const currentTimeInHours = currentHour + (currentMinute / 60);

  // ۳. بررسی اینکه آیا امروز در لیست تعطیلات است؟
  if (shopInfo.closedDays && shopInfo.closedDays.includes(currentDayKey)) {
    return false;
  }

  // ۴. بررسی بازه زمانی (openTime و closeTime)
  const openTimeStr = shopInfo.openTime; // مثلاً "09:00"
  const closeTimeStr = shopInfo.closeTime; // مثلاً "21:00"

  if (!openTimeStr || !closeTimeStr) return false;

  // تبدیل ساعت رشته‌ها به عدد
  const [openHour, openMinute] = openTimeStr.split(':').map(Number);
  const [closeHour, closeMinute] = closeTimeStr.split(':').map(Number);

  const openTimeInHours = openHour + (openMinute / 60);
  const closeTimeInHours = closeHour + (closeMinute / 60);

  // ۵. مقایسه زمان
  return currentTimeInHours >= openTimeInHours && currentTimeInHours <= closeTimeInHours;
});

// Shop Data
/*const shop = ref({
  id: 1,
  name: 'پت شاپ پارسیان',
  description: 'تخصصی سگ و گربه - بزرگترین فروشگاه لوازم و غذای حیوانات خانگی',
  address: 'تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۲۳',
  rating: 4.8,
  reviews: 234,
  isOpen: true,
  verified: true,
  freeDelivery: true,
  fastDelivery: true,
  coverGradient: 'from-blue-500 to-blue-600',
  iconColor: 'text-blue-500'
})*/

// Tabs
const tabs = [
  {id: 'products', name: 'محصولات'},
  {id: 'info', name: 'اطلاعات فروشگاه'},
  {id: 'reviews', name: 'نظرات'},
]
const activeTab = ref('products')

// Reviews Data
const reviews = computed(() => shop.value.reviews)

// Star percentage for reviews
const getStarPercentage = (star) => {
  const percentages = {5: 65, 4: 20, 3: 10, 2: 3, 1: 2}
  return percentages[star] || 0
}

// Share shop
const shareShop = async () => {
  const shareData = {
    title: shop.value.name,
    text: shop.value.description,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('لینک فروشگاه کپی شد')
    }
  } catch (err) {
    console.log('Error sharing:', err)
  }
}

const selectedCategory = ref('')

// Products
const products = computed(() => shop.value.products)

// Pagination
const productsPerPage = ref(8)
const isLoadingMore = ref(false)

// Filtered Products with pagination
const allFilteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter(p => p.categoryId === selectedCategory.value)
})

// Discounted Products
const discountedProducts = computed(() => {
  return products.value.filter(p => p.discount && p.discount > 0)
})


const filteredProducts = computed(() => {
  return allFilteredProducts.value.slice(0, productsPerPage.value)
})

const hasMoreProducts = computed(() => {
  return productsPerPage.value < allFilteredProducts.value.length
})

const loadMoreProducts = async () => {
  isLoadingMore.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  productsPerPage.value += 8
  isLoadingMore.value = false
}

// Cart - use global cart
const showCart = ref(false)

const handleAddToCart = (product) => {
  // شناسایی فروشنده محصول جدید
  const newProductShopId = product.seller?.id || product.shopId

  // بررسی اینکه آیا سبد خرید خالی است یا خیر
  if (cartItems.value.length > 0) {
    // دریافت شناسه فروشنده اولین محصول موجود در سبد خرید
    const existingShopId = cartItems.value[0].shopId || cartItems.value[0].shopName

    // بررسی مغایرت فروشنده
    if (existingShopId && existingShopId !== newProductShopId) {
      // نمایش پیام خطا یا هشدار به کاربر
      showToastMessage('لطفاً ابتدا سبد خرید فعلی را تسویه کنید، سپس از فروشگاه دیگر خرید نمایید.')
      // باز کردن سبد خرید برای اینکه کاربر متوجه شود باید تسویه کند
      showCart.value = true
      return // توقف عملیات افزودن
    }
  }
  console.log('p', product)

  addItemToCart({
    productId: product.id, // برای پشتیبانی از ورینت‌ها
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    originalPrice: product.originalPrice,
    image: product.image || product.images?.[0]?.url, // اضافه کردن تصویر
    category: product.category?.name,
    shopId: product.shopId,
    shopName: product.shopName,
    variantId: null // چون در لیست دسته‌بندی ورینتی انتخاب نشده
  })
  showToastMessage('محصول به سبد خرید اضافه شد')
}

const removeFromCart = (productId) => {
  const {removeFromCart: removeItem} = useCart()
  removeItem(productId)
}

const increaseQuantity = (productId) => {
  const {increaseQuantity: increase} = useCart()
  increase(productId)
}

const decreaseQuantity = (productId) => {
  const {decreaseQuantity: decrease} = useCart()
  decrease(productId)
}

// Checkout
const checkout = () => {
  router.push('/cart')
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Favorite toggle
const toggleFavorite = async (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.isFavorite = !product.isFavorite
    await productStore.toggleLike(productId, product.isFavorite)
    shop.value.products.map((p)=>{
      if(p.id===productId){
        p.isFavorite=product.isFavorite
      }

    })
    showToastMessage(product.isFavorite ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد')
  }
}

// Toast
const showToast = ref(false)
const toastMessage = ref('')

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}
const settingsShop = computed(() => shopStore.rawSettings)

// Initialize Mapbox on mount
onMounted(async () => {
  await shopStore.fetchShopSettings(String(route.params.id))
  await shopStore.fetchRatingAndReviews(String(route.params.id))
  // Load Mapbox GL JS
  const script = document.createElement('script')
  script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
  script.onload = initMap
  document.head.appendChild(script)

  const link = document.createElement('link')
  link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
})

const initMap = () => {
  if (typeof mapboxgl === 'undefined') return

  mapboxgl.accessToken = 'pk.eyJ1IjoiYmFiYXdlYiIsImEiOiJjazhwM201OXEweXU1M2VyeHozMHM3M3BrIn0.DuvjLzA_Knm6g4cjKzSVMQ'

  // Load RTL plugin for Persian text
  if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
    mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true
    )
  }

  // Iran bounds: [west, south, east, north]
  const iranBounds = [
    [44.0, 25.0], // Southwest coordinates
    [63.5, 39.8]  // Northeast coordinates
  ]

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019a608b-fabf-7fcb-bcec-ff6e8a08b5ab/style.json?key=HTMa05qfktg8OBQdL2hA',
    center: [51.3378, 35.6997], // Azadi Tower
    zoom: 16,
    attributionControl: false, // Remove attribution
    maxBounds: iranBounds // Restrict to Iran
  })

  // Add marker
  new mapboxgl.Marker({color: '#3b82f6'})
      .setLngLat([51.3378, 35.6997])
      .addTo(map)

  // Don't add navigation controls
}

// --- Computed Properties برای محاسبات ---

// ۱. محاسبه تعداد هر ستاره (مثلاً چند تا ۵ ستاره، چند تا ۴ ستاره و ...)
const starCounts = computed(() => {
  const counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};

  // اگر نظرات موجود باشند
  if (shop.value && shop.value.reviews && shop.value.reviews.length > 0) {
    shop.value.reviews.forEach((review) => {
      const rating = Math.round(review.rating); // گرد کردن امتیاز (مثلا 4.5 شود 5)
      if (counts[rating] !== undefined) {
        counts[rating]++;
      }
    });
  }
  return counts;
});

// ۲. تابع محاسبه درصد برای هر ستاره
const calculateStarPercentage = (star) => {
  // اگر نظری وجود ندارد، صفر برگردان
  if (!shop.value || !shop.value.reviews || shop.value.reviews.length === 0) {
    return 0;
  }

  const count = starCounts.value[star] || 0;
  const total = shop.value.reviews.length; // یا shop.value.reviewsCount اگر دقیق است

  // محاسبه درصد
  return total === 0 ? 0 : Math.round((count / total) * 100);
};

const reviewStore = useReviewStore()
const availableTags = ref({
  positive: ['کیفیت عالی', 'ارسال سریع', 'قیمت مناسب', 'بسته‌بندی خوب', 'پشتیبانی عالی'],
  negative: ['تاخیر در ارسال', 'کیفیت پایین', 'قیمت بالا', 'پشتیبانی ضعیف']
})
const isTagSelected = (tagText, type) => {
  return newReview.value.tags.some(t => t.text === tagText && t.type === type)
}

// انتخاب یا لغو انتخاب تگ
const toggleTag = (tagText, type) => {
  const index = newReview.value.tags.findIndex(t => t.text === tagText && t.type === type)

  if (index > -1) {
    // اگر قبلاً انتخاب شده، حذف کن
    newReview.value.tags.splice(index, 1)
  } else {
    // اگر انتخاب نشده، اضافه کن
    newReview.value.tags.push({ text: tagText, type: type })
  }
}
// تابع ثبت لایک/مفید بودن
const toggleHelpful = async (reviewId) => {
  try {
    // پیدا کردن نظر در لیست لوکال برای آپدیت سریع UI
    const review = reviews.value.find(r => r.id === reviewId)
    if (!review) return

    // اگر قبلاً لایک کرده، لایک را بردار (وگرنه اضافه کن)
    // این بخش منطق سمت کلاینت است. باید با API هماهنگ شود.
    if (review.isHelpfulByMe) {
      review.helpfulCount--
      review.isHelpfulByMe = false
      // await axios.delete(`/reviews/${reviewId}/helpful`) // کال API حذف
    } else {
      review.helpfulCount++
      review.isHelpfulByMe = true
      // await axios.post(`/reviews/${reviewId}/helpful`) // کال API ثبت
    }

    // نکته: در پروژه واقعی، باید این عملیات را از طریق استور یا سرویس مخصوص نظرات انجام دهید
    // تا با سرور همگام شود.

  } catch (error) {
    console.error('Error toggling helpful:', error)
  }
}
// State for new review
const newReview = ref({
  rating: 0,
  comment: '',
  tags: []
})
const isSubmittingReview = ref(false)

// Function to submit review
const submitReview = async () => {
  if (!newReview.value.rating || !newReview.value.comment) return

  isSubmittingReview.value = true

  try {

    const selectedPros = newReview.value.tags
        .filter(tag => tag.type === 'positive')
        .map(tag => tag.text)

    const selectedCons = newReview.value.tags
        .filter(tag => tag.type === 'negative')
        .map(tag => tag.text)

    const resp=await reviewStore.submitShopReview(shopId,
        {
          rating: newReview.value.rating,
          comment: newReview.value.comment,
          pros: selectedPros.length > 0 ? selectedPros : undefined, // ارسال فقط اگر مقداری وجود دارد
          cons: selectedCons.length > 0 ? selectedCons : undefined,
        }
    )
    $toast(resp.data.message,'success',5000)
  } catch (error) {
    console.error('Error submitting review:', error)
    //showToastMessage('خطا در ثبت نظر. لطفاً دوباره تلاش کنید.')
    $toast(error.response.data.message,'error',5000)
  } finally {
    isSubmittingReview.value = false
  }

  // Reset form
  newReview.value = {rating: 0, comment: '', tags: []}
  isSubmittingReview.value = false
}
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
