<template>
  <div v-if="product" class="min-h-screen bg-gray-50">
    <!-- Breadcrumb Section -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <nav class="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
          <NuxtLink to="/" class="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap">
            <i class="ti ti-home text-base"></i>
            <span>خانه</span>
          </NuxtLink>
          <i class="ti ti-chevron-left text-xs text-gray-400 flex-shrink-0"></i>
          <NuxtLink to="/products" class="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap">محصولات</NuxtLink>
          <i class="ti ti-chevron-left text-xs text-gray-400 flex-shrink-0"></i>
          <NuxtLink :to="`/category/${product?.category.slug}`" class="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap">{{ product?.category.name }}</NuxtLink>
          <i class="ti ti-chevron-left text-xs text-gray-400 flex-shrink-0"></i>
          <span class="text-blue-600 font-medium truncate max-w-[200px] md:max-w-none">{{ product?.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Product Main Section -->
    <div class="container mx-auto px-4 py-6">
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">

          <!-- Product Images Section -->
          <div class="space-y-4">
            <!-- Main Image Display -->
            <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
              <img
                  :src="selectedImage"
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              >

              <!-- Discount Badge -->
              <div v-if="currentDiscount" class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold shadow-lg animate-pulse">
                {{ currentDiscountPercent }}% تخفیف
              </div>

              <!-- Action Buttons -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <button
                    @click.stop="toggleFavorite"
                    class="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                    title="افزودن به علاقه‌مندی"
                >
                  <i :class="product.isFavorite ? 'ti ti-heart-filled text-red-500' : 'ti ti-heart text-gray-600'" class="text-xl"></i>
                </button>
                <button
                    @click.stop="shareProduct"
                    class="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                    title="اشتراک‌گذاری"
                >
                  <i class="ti ti-share text-gray-600 text-xl"></i>
                </button>
              </div>
            </div>

            <!-- Thumbnail Gallery -->
            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <!-- Product Main Images -->
              <!-- Product Main Images -->
              <button
                  v-for="(img, index) in product.images"
                  :key="'main-'+index"
                  @click.stop="selectedImage = img.url; selectedVariant = null"
                  :class="selectedImage === img.url ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-70 hover:opacity-100'"
                  class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 transition-all"
              >
                <img :src="img.url" :alt="`تصویر ${index + 1}`" class="w-full h-full object-cover">
              </button>
              <!-- Variant Specific Images (if different) -->
              <button
                  v-for="variant in product.variants"
                  :key="'var-'+variant.id"
                  @click="selectVariant(variant)"
                  :class="selectedVariant?.id === variant.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-70 hover:opacity-100'"
                  class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 transition-all"
              >
                <img :src="variant.image" :alt="variant.name" class="w-full h-full object-cover">
              </button>
            </div>
          </div>

          <!-- Product Details Section -->
          <div class="flex flex-col h-full">
            <!-- Header: Brand & Title -->
            <div class="mb-4">
        <span v-if="product.brand && product.brand.name" class="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block border border-blue-100 inline-block px-2 py-1 rounded bg-blue-50">
          {{ product.brand.name }}
        </span>
              <h1 class="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
                {{ product.name }}
              </h1>

              <!-- Rating & Sales -->
              <div class="flex items-center gap-4 mt-3 text-sm">
                <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <i class="ti ti-star-filled text-yellow-400"></i>
                  <span class="font-bold text-gray-800">{{ product.rating || '0' }}</span>
                  <span class="text-gray-400 text-xs">({{ product.reviewCount }} نظر)</span>
                </div>
                <div class="flex items-center gap-1 text-gray-500">
                  <i class="ti ti-shopping-bag"></i>
                  <span>{{ product.soldCount }} فروش</span>
                </div>
              </div>
            </div>

            <!-- Price Box -->
            <div class="bg-gradient-to-l from-gray-50 to-white border border-gray-100 rounded-xl p-4 mb-6 relative overflow-hidden">
              <div class="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
              <div class="flex items-end justify-between">
                <div>
                  <div v-if="currentOriginalPrice > currentPrice" class="text-gray-400 text-sm line-through mb-1">
                    {{ currentOriginalPrice.toLocaleString() }} تومان
                  </div>
                  <div class="flex items-baseline gap-1">
              <span class="text-3xl font-black text-blue-600 tracking-tight">
                {{ currentPrice.toLocaleString() }}
              </span>
                    <span class="text-sm font-medium text-gray-500 mb-1">تومان</span>
                  </div>
                </div>
                <div v-if="currentOriginalPrice > currentPrice" class="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold">
                  {{ (currentOriginalPrice - currentPrice).toLocaleString() }} تومان تخفیف
                </div>
              </div>
            </div>

            <!-- Variants Selection -->
            <div v-if="product.variants && product.variants.length > 0" class="mb-6">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold text-gray-800 flex items-center gap-2">
                  <i class="ti ti-settings text-blue-500"></i>
                  {{ product.variantLabel }}
                </h3>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">الزامی</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    v-for="variant in product.variants"
                    :key="variant.id"
                    @click="selectVariant(variant)"
                    :disabled="variant.stock <= 0"
                    :class="[
              'relative p-3 border-2 rounded-xl text-right transition-all duration-200 group overflow-hidden',
              selectedVariant?.id === variant.id
                ? 'border-blue-500 bg-blue-50/50 shadow-md'
                : 'border-gray-100 hover:border-blue-200 bg-white hover:shadow-sm',
              variant.stock <= 0 ? 'opacity-60 cursor-not-allowed grayscale' : 'cursor-pointer'
            ]"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-sm" :class="selectedVariant?.id === variant.id ? 'text-blue-700' : 'text-gray-800'">
                    {{ variant.name }}
                  </span>
                        <!-- Variant Thumbnail Mini -->
                        <img :src="variant.image" class="w-6 h-6 rounded object-cover border border-gray-200" alt="">
                      </div>

                      <!-- Attributes -->
                      <div v-if="variant.attributes && Object.keys(variant.attributes).length > 0" class="flex flex-wrap gap-1.5 mb-2">
                  <span
                      v-for="(value, key) in variant.attributes"
                      :key="key"
                      class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200"
                  >
                    {{ key }}: {{ value }}
                  </span>
                      </div>

                      <!-- Price & Stock -->
                      <div class="flex items-center justify-between mt-2">
                  <span class="text-sm font-black text-gray-900">
                    {{ variant.price.toLocaleString() }} <span class="text-[10px] font-normal">تومان</span>
                  </span>
                        <span v-if="variant.stock > 0 && variant.stock < 10" class="text-[10px] text-orange-500 font-bold animate-pulse">
                    فقط {{ variant.stock }} عدد باقی‌مانده
                  </span>
                      </div>
                    </div>

                    <!-- Check Icon -->
                    <div v-if="selectedVariant?.id === variant.id" class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-2 shadow-lg shadow-blue-200">
                      <i class="ti ti-check text-white text-xs"></i>
                    </div>
                  </div>

                  <!-- Out of Stock Overlay -->
                  <div v-if="variant.stock <= 0" class="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-xl z-10">
              <span class="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full shadow-sm border border-gray-300">
                ناموجود
              </span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Quick Info / Features -->
            <div class="mb-6 flex-1">
              <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="ti ti-info-circle text-blue-500"></i>
                ویژگی‌های کلیدی
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-green-50 rounded-xl p-3 flex items-center gap-3 border border-green-100">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-package text-green-600 text-sm"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-green-800">موجود در انبار</span>
                    <span class="text-[10px] text-green-600">ارسال فوری</span>
                  </div>
                </div>
                <div class="bg-blue-50 rounded-xl p-3 flex items-center gap-3 border border-blue-100">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-truck-delivery text-blue-600 text-sm"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-blue-800">ارسال سریع</span>
                    <span class="text-[10px] text-blue-600">به سراسر کشور</span>
                  </div>
                </div>
                <div class="bg-purple-50 rounded-xl p-3 flex items-center gap-3 border border-purple-100">
                  <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-shield-check text-purple-600 text-sm"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-purple-800">ضمانت اصالت</span>
                    <span class="text-[10px] text-purple-600">کالای اورجینال</span>
                  </div>
                </div>
                <div class="bg-orange-50 rounded-xl p-3 flex items-center gap-3 border border-orange-100">
                  <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-refresh text-orange-600 text-sm"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-orange-800">۷ روز ضمانت</span>
                    <span class="text-[10px] text-orange-600">بازگشت وجه</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Seller Info -->
            <div class="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                  <i class="ti ti-building-store text-blue-500 text-lg"></i>
                </div>
                <div>
                  <NuxtLink :to="`/shop/${product.seller.id}`" class="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors">
                    {{ product.seller.name }}
                  </NuxtLink>
                  <div class="flex items-center gap-2 text-[10px] text-gray-500">
              <span class="flex items-center gap-0.5 text-yellow-500 font-bold">
                <i class="ti ti-star-filled text-[10px]"></i>
                {{ product.seller.rating }}
              </span>
                    <span class="text-gray-300">|</span>
                    <span>اعتماد شما</span>
                  </div>
                </div>
              </div>
              <NuxtLink
                  :to="`/shop/${product.seller.id}`"
                  class="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-blue-500 transition-colors font-medium"
              >
                فروشگاه
              </NuxtLink>
            </div>

            <!-- Actions: Quantity & Add to Cart -->
            <div class="mt-auto pt-4 border-t border-gray-100 hidden lg:block">
              <div class="flex items-center gap-3">
                <!-- Quantity Selector -->
                <div class="flex items-center bg-gray-100 rounded-xl border border-gray-200">
                  <button
                      @click="quantity > 1 && quantity--"
                      class="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-r-xl transition-all"
                  >
                    <i class="ti ti-minus"></i>
                  </button>
                  <span class="w-12 text-center font-bold text-gray-800">{{ quantity }}</span>
                  <button
                      @click="quantity++"
                      class="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-l-xl transition-all"
                  >
                    <i class="ti ti-plus"></i>
                  </button>
                </div>
                <!-- Add to Cart Button -->
                <button
                    @click="handleAddToCart(product)"
                    :disabled="isOutOfStock"
                    :class="isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'"
                    class="flex-1 py-3.5 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <i v-if="!isOutOfStock" class="ti ti-shopping-cart-plus text-lg"></i>
                  <span>{{ isOutOfStock ? 'ناموجود' : 'افزودن به سبد خرید' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="bg-white rounded-2xl border border-gray-100 mt-6 overflow-hidden">
        <!-- Tab Headers -->
        <div class="flex border-b border-gray-100 overflow-x-auto">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'"
              class="px-6 py-4 font-medium whitespace-nowrap transition-colors"
          >
            {{ tab.name }}
          </button>
        </div>
        <!-- Tab Content -->
        <div class="p-4 md:p-6">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="prose prose-sm max-w-none">
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

            <h3 class="text-lg font-bold text-gray-900 mt-6 mb-3">ویژگی‌های محصول</h3>
            <ul class="space-y-2">
              <li v-for="feature in product.features" :key="feature" class="flex items-start gap-2 text-gray-600">
                <i class="ti ti-check text-green-500 mt-0.5"></i>
                {{ feature.text }}
              </li>
            </ul>
          </div>

          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specs'" class="space-y-3">
            <div
                v-for="(spec, index) in product.specifications"
                :key="index"
                :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
                class="flex rounded-lg overflow-hidden"
            >
              <div class="w-1/3 md:w-1/4 p-3 font-medium text-gray-700">{{ spec.label }}</div>
              <div class="flex-1 p-3 text-gray-600">{{ spec.value }}</div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'">
            <!-- Rating Summary -->
            <div class="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
              <div class="text-center">
                <div class="text-5xl font-bold text-gray-900">{{ product.rating }}</div>
                <div class="flex items-center justify-center gap-1 my-2">
                  <i v-for="i in 5" :key="i"
                     :class="i <= Math.round(product.rating) ? 'ti ti-star-filled text-yellow-400' : 'ti ti-star text-gray-300'"
                  ></i>
                </div>
                <div class="text-gray-500 text-sm">از {{ product.reviewCount }} نظر</div>
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

            <!-- Reviews List -->
            <div class="space-y-5">
              <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
              >
                <div class="flex gap-4">
                  <!-- Avatar -->
                  <div class="flex-shrink-0 relative">
                    <div class="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg shadow-inner border border-gray-100">
                      {{ review.user.charAt(0) }}
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <!-- Header: Name & Date -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div class="flex items-center gap-2">
                        <h4 class="font-bold text-gray-900 text-sm">{{ review.user }}</h4>
                        <span class="text-xs text-gray-400">•</span>
                        <span class="text-xs text-gray-500">{{ new Date(review.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                      </div>

                      <!-- Star Rating -->
                      <div class="flex items-center gap-0.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                        <i v-for="i in 5" :key="i" class="text-xs">
                          <i :class="i <= review.rating ? 'ti ti-star-filled text-yellow-400' : 'ti ti-star text-gray-300'"></i>
                        </i>
                      </div>
                    </div>

                    <!-- Comment Text -->
                    <p class="text-gray-700 text-sm leading-relaxed mb-4 break-words">
                      {{ review.comment }}
                    </p>

                    <!-- Reactions Footer -->
                    <div class="flex items-center gap-3 pt-2 border-t border-gray-50">
                      <button
                          @click="handleReaction(review, 'like')"
                          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95"
                          :class="review.likesByUsers?.includes(currentUserId)
                          ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                          : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50/50 border border-transparent'">
                        <i :class="review.likesByUsers?.includes(currentUserId) ? 'ti ti-thumb-filled' : 'ti ti-thumb-up'" class="text-lg"></i>
                        <span class="text-xs font-bold">{{ review.likesCount || 0 }}</span>
                      </button>

                      <!-- Dislike Button -->
                      <button
                          @click="handleReaction(review, 'dislike')"
                          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95"
                          :class="review.dislikesByUsers?.includes(currentUserId)
                          ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm'
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50/50 border border-transparent'">
                        <i :class="review.dislikesByUsers?.includes(currentUserId) ? 'ti ti-thumb-down-filled' : 'ti ti-thumb-down'" class="text-lg"></i>
                        <span class="text-xs font-bold">{{ review.dislikesCount || 0 }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Write Review Button -->
            <button
                @click="showReviewModal = true"
                class="mt-6 w-full py-3 border border-blue-500 text-blue-500 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              ثبت نظر
            </button>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="mt-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">محصولات مرتبط</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
              v-for="related in relatedProducts"
              :key="related.id"
              class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
          >
            <div class="relative aspect-square bg-gray-100">
              <img
                  :src="related.image"
                  :alt="related.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              >
              <div v-if="related.discount" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                {{ related.discount }}%
              </div>
            </div>
            <div class="p-3">
              <NuxtLink :to="`/product/${related.id}`" class="block">
                <h3 class="font-medium text-gray-900 text-sm line-clamp-2 hover:text-blue-500 transition-colors">
                  {{ related.name }}
                </h3>
              </NuxtLink>
              <div class="mt-2">
                <div class="font-bold text-blue-600 text-sm">
                  {{ related.price.toLocaleString() }}
                  <span class="text-xs font-normal text-gray-500">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Bar (Mobile) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div class="flex items-center gap-4">
        <!-- Price Section -->
        <div class="flex-1 flex flex-col">
          <!-- نمایش قیمت اصلی اگر تخفیف دارد -->
          <div v-if="currentOriginalPrice > currentPrice" class="text-gray-400 line-through text-xs mb-0.5">
            {{ currentOriginalPrice.toLocaleString() }}
          </div>
          <!-- نمایش قیمت فعلی (تخفیف خورده یا ورینت انتخاب شده) -->
          <div class="font-black text-blue-600 text-lg leading-none">
            {{ currentPrice.toLocaleString() }}
          </div>
          <div class="text-[10px] text-gray-500 font-medium mt-0.5">تومان</div>
        </div>

        <!-- Add to Cart Button -->
        <button
            @click="handleAddToCart(product)"
            :disabled="isOutOfStock"
            :class="isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'"
            class="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200/50 transition-all flex items-center gap-2 min-w-[140px] justify-center"
        >
          <i v-if="!isOutOfStock" class="ti ti-shopping-cart-plus text-lg"></i>
          <span>{{ isOutOfStock ? 'ناموجود' : 'افزودن' }}</span>
        </button>
      </div>
    </div>

    <!-- Review Modal (پنجره ثبت نظر) -->
    <Transition name="modal">
      <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showReviewModal = false"></div>
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">ثبت نظر جدید</h3>
            <button @click="showReviewModal = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i class="ti ti-x text-gray-500"></i>
            </button>
          </div>
          <!-- Form -->
          <form @submit.prevent="submitReview" class="p-6 space-y-5">
            <!-- Rating Stars -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">امتیاز شما</label>
              <div class="flex items-center gap-2">
                <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="reviewForm.rating = star"
                    class="text-3xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <i
                      :class="star <= reviewForm.rating ? 'ti ti-star-filled text-yellow-400' : 'ti ti-star text-gray-300'"
                  ></i>
                </button>
              </div>
            </div>
            <!-- Comment Textarea -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نظر شما</label>
              <textarea
                  v-model="reviewForm.comment"
                  rows="4"
                  placeholder="تجربه خود را از این محصول بنویسید..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  required
              ></textarea>
            </div>
            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="isSubmittingReview"
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="isSubmittingReview" class="ti ti-loader animate-spin"></i>
              <span>{{ isSubmittingReview ? 'در حال ثبت...' : 'ثبت نظر' }}</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div
          v-if="toast.show"
          class="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
      >
        <i :class="toast.icon"></i>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Add bottom padding for mobile sticky bar -->
    <div class="h-20 lg:hidden"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import {useProductStore} from "../../stores/product.store.ts";
import {useAuthStore} from "../../stores/auth.ts";
import {useReviewStore} from "../../stores/reviews.store.js";
const reviewStore=useReviewStore()
const selectedImage = ref(null)
const selectedVariant = ref(null)
const router=useRouter()
const route = useRoute()
const { addToCart: addItemToCart, cartItems, cartTotal, openCart } = useCart()
const productStore=useProductStore()
const {$toast}=useNuxtApp()
// محصول انتخاب شده
const product = computed(() => productStore.getProductById(route.params.id))

// --- منطق قیمت بر اساس ورینت ---
const currentPrice = computed(() => {
  // اگر ورینتی انتخاب شده، قیمت ورینت را بگیر، وگرنه قیمت پیش‌فرض محصول
  return selectedVariant.value ? selectedVariant.value.price : product.value.price
})

const currentOriginalPrice = computed(() => {
  return selectedVariant.value ? selectedVariant.value.originalPrice : product.value.originalPrice
})

const currentDiscount = computed(() => {
  if (selectedVariant.value) {
    // اگر قیمت اصلی و فعلی برابر نیست یعنی تخفیف دارد
    return selectedVariant.value.originalPrice > selectedVariant.value.price
  }
  return product.value.discount > 0
})

// محاسبه درصد تخفیف برای نمایش در بج (Badge)
const currentDiscountPercent = computed(() => {
  if (!currentOriginalPrice.value || !currentPrice.value) return 0
  return Math.round(((currentOriginalPrice.value - currentPrice.value) / currentOriginalPrice.value) * 100)
})

// بررسی وضعیت موجودی کلی (برای غیرفعال کردن دکمه خرید)
const isOutOfStock = computed(() => {
  // اگر ورینت انتخاب شده، موجودی ورینت را چک کن
  if (selectedVariant.value) {
    return selectedVariant.value.stock <= 0
  }
  // وگرنه وضعیت کلی محصول را چک کن
  return !product.value.available
})

// --- تابع انتخاب ورینت ---
const selectVariant = (variant) => {
  if (variant.stock > 0) {
    selectedVariant.value = variant
    // تغییر تصویر اصلی با تصویر ورینت (اگر تصویر دارد)
    if (variant.image) {
      selectedImage.value = variant.image
    }
  }
}

// --- تنظیم اولیه هنگام لود شدن محصول ---
watch(
    () => product.value,
    (newProduct) => {
      if (newProduct) {
        // تنظیم تصویر اول (تصویر اصلی محصول)
        selectedImage.value = newProduct.images?.[0]?.url || newProduct.images?.[0] || null;

        // انتخاب اولین ورینت "موجود" به عنوان پیش‌فرض
        if (newProduct.variants && newProduct.variants.length > 0) {
          const firstAvailable = newProduct.variants.find(v => v.stock > 0)
          selectedVariant.value = firstAvailable || newProduct.variants[0]

          // اگر ورینت پیش‌فرض تصویر دارد، آن را به عنوان تصویر اصلی قرار بده
          if (selectedVariant.value && selectedVariant.value.image) {
            selectedImage.value = selectedVariant.value.image
          }
        } else {
          selectedVariant.value = null
        }
      }
    },
    {
      deep: true,
      immediate: true
    }
);

const quantity = ref(1)
const isFavorite = ref(false)
const activeTab = ref('description')
const showReviewModal = ref(false)

// Tabs
const tabs = [
  { id: 'description', name: 'توضیحات' },
  { id: 'specs', name: 'مشخصات' },
  { id: 'reviews', name: 'نظرات کاربران' },
]

// Reviews
const reviews =computed(()=>product.value.reviews)

// Related products
const relatedProducts = computed(()=>product.value.relatedProducts)

// Toast
const toast = ref({ show: false, message: '', icon: '' })
const showToast = (message, icon = 'ti ti-check') => {
  toast.value = { show: true, message, icon }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

// Actions
const toggleFavorite = async () => {
  product.value.isFavorite = !product.value.isFavorite

  // فراخوانی اکشن استور
  await productStore.toggleLike(product.value.id, product.value.isFavorite);
  showToast(
      product.value.isFavorite ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
      product.value.isFavorite ? 'ti ti-heart-filled' : 'ti ti-heart'
  )
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: product.value.name,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    showToast('لینک کپی شد', 'ti ti-clipboard')
  }
}

const handleAddToCart = (product) => {
  // بررسی اینکه آیا محصول موجود است یا خیر
  if (isOutOfStock.value) {
    showToast('این محصول موجود نیست', 'ti ti-alert-circle')
    return
  }

  // شناسایی فروشنده محصول جدید
  const newProductShopId = product.seller?.id || product.shopId

  // بررسی اینکه آیا سبد خرید خالی است یا خیر
  if (cartItems.value.length > 0) {
    // دریافت شناسه فروشنده اولین محصول موجود در سبد خرید
    const existingShopId = cartItems.value[0].shopId || cartItems.value[0].shopName

    // بررسی مغایرت فروشنده
    if (existingShopId && existingShopId !== newProductShopId) {
      // نمایش پیام خطا یا هشدار به کاربر
      $toast('لطفاً ابتدا سبد خرید فعلی را تسویه کنید، سپس از فروشگاه دیگر خرید نمایید.','warning',5000)
      // باز کردن سبد خرید برای اینکه کاربر متوجه شود باید تسویه کند
      router.push('/cart')
      return // توقف عملیات افزودن
    }
  }

  // استفاده از قیمت ورینت انتخاب شده
  const finalPrice = selectedVariant.value ? selectedVariant.value.price : product.price
  const finalOriginalPrice = selectedVariant.value ? selectedVariant.value.originalPrice : product.originalPrice
  const variantId = selectedVariant.value ? selectedVariant.value.id : null
  const image = selectedVariant.value ? selectedVariant.value.image : product.image || product.images?.[0]?.url

  addItemToCart({
    productId: product.id, // برای پشتیبانی از ورینت‌ها
    id: product.id,
    name: product.name,
    price: finalPrice,
    originalPrice: finalOriginalPrice,
    quantity: quantity.value,
    category: product.category.name,
    image: image,
    shopId: product.seller?.id,
    shopName: product.seller?.name,
    variantId: variantId
  })
  showToast(`${quantity.value} عدد به سبد خرید اضافه شد`, 'ti ti-shopping-cart-plus')
}

// محاسبه درصد ستاره‌ها
const starCounts = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (product.value && product.value.reviews && product.value.reviews.length > 0) {
    product.value.reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (counts[rating] !== undefined) {
        counts[rating]++;
      }
    });
  }
  return counts;
});

const calculateStarPercentage = (star) => {
  if (!product.value || !product.value.reviews || product.value.reviews.length === 0) {
    return 0;
  }
  const count = starCounts.value[star] || 0;
  const total = product.value.reviews.length;
  return total === 0 ? 0 : Math.round((count / total) * 100);
};

// مدیریت مودال ثبت نظر
const reviewForm = ref({
  rating: 0,
  name: '',
  comment: ''
})
const isSubmittingReview = ref(false)
const authStore=useAuthStore()

const submitReview = async () => {
  reviewForm.value.rating=2
  if (reviewForm.value.rating === 0) {
    showToast('لطفاً امتیاز خود را انتخاب کنید', 'ti ti-alert-circle')
    return
  }
  isSubmittingReview.value = true
  try {
    const payload={
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment
    }
    await productStore.submitProductReview(product.value.id, payload)
    const newReview = {
      id: Date.now(),
      user: reviewForm.value.name,
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment,
      date: new Date().toLocaleDateString('fa-IR')
    }
    reviews.value.unshift(newReview)
    showToast('نظر شما با موفقیت ثبت شد', 'ti ti-check')
    showReviewModal.value = false
    reviewForm.value = {
      rating: 0,
      name: '',
      comment: ''
    }
  } catch (error) {
    console.error('Error submitting review:', error)
    showToast('خطا در ثبت نظر. لطفاً دوباره تلاش کنید.', 'ti ti-x')
  } finally {
    isSubmittingReview.value = false
  }
}

const currentUserId = useAuthStore().user?.id; // یا هر متدی که آیدی کاربر فعلی را برمی‌گرداند

const handleReaction = async (review, type) => {
  // 1. جلوگیری از کلیک مکرر اگر کاربر همین واکنش را قبلاً داشته
  if (type === 'like' && review.likesByUsers?.includes(currentUserId)) {
    return; // کاربر قبلاً لایک کرده، کاری نکن (یا اگر می‌خواهید لغو شود، منطق لغو را اینجا بنویسید)
  }
  if (type === 'dislike' && review.dislikesByUsers?.includes(currentUserId)) {
    return;
  }

  try {
    // 2. فراخوانی متد استور
    await productStore.toggleReviewReaction({ product:product.value,reviewId: review.id, type });

  } catch (error) {
    console.error('Reaction failed:', error);
    $toast('خطا در ثبت نظر', 'ti ti-alert-circle');
  }
};

// محاسبه کلاس‌های CSS برای هر دکمه
const getReactionClasses = (review, type) => {
  const isActive = userReactionState.value[review.id] === type;

  if (isActive) {
    return type === 'like'
        ? 'text-blue-600 bg-blue-50 border-blue-200'
        : 'text-red-600 bg-red-50 border-red-200';
  }
  return 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-transparent';
};

</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
.prose {
  color: #374151;
  line-height: 1.75;
}
</style>