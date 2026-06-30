<template>
  <div v-if="pharmacy.info" class="min-h-screen bg-gray-50 font-vazir">
    <!-- Breadcrumb - خارج از هدر -->
    <div class="container mx-auto px-4 pt-6">
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <NuxtLink to="/" class="hover:text-emerald-600 transition-colors">خانه</NuxtLink>
        <i class="ti ti-chevron-left text-xs"></i>
        <NuxtLink to="/pharmacy" class="hover:text-emerald-600 transition-colors">داروخانه‌ها</NuxtLink>
        <i class="ti ti-chevron-left text-xs"></i>
        <span class="text-emerald-600 font-medium">{{ pharmacy?.info?.name }}</span>
      </nav>
    </div>

    <!-- Hero Header - با رادیوس و عرض container -->
    <div class="container mx-auto px-4 pb-6">
      <div class="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 left-32 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        
        <div class="relative z-10">
          <div class="px-6 py-4">
            <nav class="flex items-center justify-between text-white">
              <button @click="$router.back()" class="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                <i class="ti ti-arrow-right text-lg"></i>
                <span class="font-medium">بازگشت</span>
              </button>
              <div class="flex items-center gap-3">
                <button @click="sharePharmacy" class="hover:bg-white/10 p-2 rounded-lg transition-colors" title="اشتراک‌گذاری"><i class="ti ti-share text-lg"></i></button>
                <button @click="showReviewModal = true" class="hover:bg-white/10 p-2 rounded-lg transition-colors" title="ثبت نظر"><i class="ti ti-message-circle text-lg"></i></button>
                <!-- سبد خرید -->
                <button 
                  @click="goToCart" 
                  class="hover:bg-white/10 p-2 rounded-lg transition-colors relative" 
                  title="سبد خرید"
                >
                  <i class="ti ti-shopping-cart text-lg"></i>
                  <span 
                    v-if="cartItemsCount > 0" 
                    class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {{ cartItemsCount }}
                  </span>
                </button>
              </div>
            </nav>
          </div>

          <div class="px-6 pb-8 pt-4">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div class="relative">
                <div class="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden">
                  <img
                      v-if="pharmacy.info.image"
                      :src="pharmacy.info.image"
                      :alt="pharmacy.info.name"
                      class="w-full h-full object-cover absolute inset-0"
                  >
                  <!-- اگر عکس نبود، حرف اول نام را نمایش بده -->
                  <span v-else class="text-4xl font-bold text-white relative z-10">{{ pharmacy.avatar }}</span>
                </div>
                <div v-if="pharmacy.info?.isOpen" class="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div class="flex-1 text-center md:text-right">
                <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ pharmacy.info?.name }}</h1>
                <p class="text-emerald-100 mb-3">{{ pharmacy.info?.about }}</p>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div class="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <i class="ti ti-star-filled text-yellow-400"></i>
                    <span class="text-white font-semibold">{{ pharmacy.info?.rating }}</span>
                    <span class="text-white/70">({{ pharmacy.info?.reviewCount }} نظر)</span>
                  </div>
                  <div :class="pharmacy.info?.isOpen ? 'bg-green-500' : 'bg-gray-500'" class="px-3 py-1 rounded-full text-white text-sm font-medium">
                    {{ pharmacy.info?.isOpen ? 'باز' : 'بسته' }}
                  </div>
                  <div v-if="pharmacy.info?.hasDelivery" class="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                    <i class="ti ti-truck-delivery"></i>
                    <span>ارسال سریع</span>
                  </div>
                  <div class="flex items-center gap-2 text-white/90 text-sm">
                    <i class="ti ti-clock"></i>
                    <span>{{ pharmacy.info?.workingHours }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-white/90 text-sm">
                    <i class="ti ti-map-pin"></i>
                    <span>{{ pharmacy.info?.city }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Medicine Section -->
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-6">سفارش دارو</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- Order with Prescription -->
        <div 
          @click="openOrderModal('prescription')"
          class="bg-white rounded-xl border-2 border-purple-100 p-6 cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all group"
        >
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <i class="ti ti-file-certificate text-3xl text-purple-600"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 mb-2">سفارش دارو با نسخه</h3>
              <p class="text-gray-600 text-sm mb-4">
                نسخه دامپزشک خود را آپلود کنید تا داروهای مورد نیاز برای شما ارسال شود
              </p>
              <div class="flex items-center gap-2 text-purple-600 font-medium">
                <span>ثبت سفارش</span>
                <i class="ti ti-arrow-left"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Order without Prescription -->
        <div 
          @click="openOrderModal('no-prescription')"
          class="bg-white rounded-xl border-2 border-teal-100 p-6 cursor-pointer hover:border-teal-400 hover:shadow-lg transition-all group"
        >
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
              <i class="ti ti-pill text-3xl text-teal-600"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 mb-2">سفارش دارو بدون نسخه</h3>
              <p class="text-gray-600 text-sm mb-4">
                داروهای OTC و مکمل‌ها را بدون نسخه سفارش دهید
              </p>
              <div class="flex items-center gap-2 text-teal-600 font-medium">
                <span>ثبت سفارش</span>
                <i class="ti ti-arrow-left"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Discounted Products Slider -->
      <div class="w-full overflow-x-auto pb-4 scrollbar-hide px-1">
        <div class="flex gap-4">
          <div
              v-for="product in discountedProducts"
              :key="'discount-' + product.id"
              class="w-[180px] md:w-[220px] lg:w-[240px] bg-white rounded-xl border border-red-100 overflow-hidden hover:shadow-md hover:border-red-300 transition-all flex-shrink-0 flex flex-col"
          >
            <!-- Product Image -->
            <div class="aspect-square bg-gray-100 flex items-center justify-center relative">
              <img :src="product.image" class="w-full h-full object-cover" />
              <span
                  v-if="product.discount"
                  class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
          {{ product.discount }}%
        </span>
            </div>

            <!-- Product Info -->
            <div class="p-3 flex flex-col flex-grow justify-between">
              <div class="mb-2">
                <h3 class="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight min-h-[2.5em]">{{ product.name }}</h3>
                <p class="text-xs text-gray-500 truncate">{{ product.category }}</p>
              </div>

              <div class="flex items-center justify-between">
                <div>
            <span v-if="product.originalPrice" class="text-xs text-gray-400 line-through block">
              {{ formatPrice(product.originalPrice) }}
            </span>
                  <span class="font-bold text-purple-600 text-sm">{{ formatPrice(product.price) }} تومان</span>
                </div>

                <button
                    v-if="getCartQuantity(product.id) === 0"
                    @click="addToCart(product)"
                    :disabled="!product.inStock"
                    :class="product.inStock ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                    class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <i class="ti ti-plus text-sm"></i>
                </button>

                <div v-else class="flex items-center gap-1">
                  <button
                      @click="decreaseQuantity(product.id)"
                      class="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <i class="ti ti-minus"></i>
                  </button>
                  <span class="text-sm font-medium w-5 text-center">{{ getCartQuantity(product.id) }}</span>
                  <button
                      @click="increaseQuantity(product.id)"
                      class="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <i class="ti ti-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shop Products Section -->
      <div id="products-section" class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">محصولات فروشگاه</h2>
          <div class="text-sm text-gray-500">{{ pharmacy.products.length }} محصول</div>
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
              <option v-for="cat in categories" :key="cat.name" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </ClientOnly>

        <!-- Products Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <!-- Product Image -->
            <div class="aspect-square bg-gray-100 flex items-center justify-center relative">
              <img :src="product.image" class="w-full h-full object-cover"/>
              <span 
                v-if="product.discount"
                class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {{ product.discount }}%
              </span>
            </div>
            
            <!-- Product Info -->
            <div class="p-3">
              <h3 class="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{{ product?.name }}</h3>
              <p class="text-xs text-gray-500 mb-2">{{ product?.category }}</p>
              
              <div class="flex items-center justify-between">
                <div>
                  <span v-if="product.originalPrice" class="text-xs text-gray-400 line-through block">
                    {{ formatPrice(product?.originalPrice) }}
                  </span>
                  <span class="font-bold text-purple-600 text-sm">{{ formatPrice(product?.price) }} تومان</span>
                </div>
                
                <button 
                  v-if="getCartQuantity(product.id) === 0"
                  @click="addToCart(product)"
                  :disabled="!product.inStock"
                  :class="product.inStock ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <i class="ti ti-plus text-sm"></i>
                </button>
                
                <div v-else class="flex items-center gap-1">
                  <button 
                    @click="decreaseQuantity(product.id)"
                    class="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <i class="ti ti-minus"></i>
                  </button>
                  <span class="text-sm font-medium w-5 text-center">{{ getCartQuantity(product.id) }}</span>
                  <button 
                    @click="increaseQuantity(product.id)"
                    class="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <i class="ti ti-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <i class="ti ti-package-off text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">محصولی یافت نشد</p>
        </div>
      </div>
    </div>

    <!-- Floating Cart Button -->
    <div v-if="cartItemsCount > 0" class="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 z-40">
      <button 
        @click="goToCart"
        class="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between md:justify-center gap-4 transition-all"
      >
        <div class="flex items-center gap-3">
          <i class="ti ti-shopping-cart text-xl"></i>
          <span class="font-medium">مشاهده سبد خرید</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-white/20 px-3 py-1 rounded-full text-sm">{{ cartItemsCount }} عدد</span>
          <span class="font-bold">{{ formatPrice(cartTotal) }} تومان</span>
        </div>
      </button>
    </div>

    <!-- Order Modal -->
    <Teleport to="body">
      <div v-if="showOrderModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="p-6 border-b sticky top-0 bg-white">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">
                {{ orderType === 'prescription' ? 'سفارش دارو با نسخه' : 'سفارش دارو بدون نسخه' }}
              </h3>
              <button @click="showOrderModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <!-- Prescription Upload (if with prescription) -->
            <div v-if="orderType === 'prescription'" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">آپلود نسخه دامپزشک</label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                @click="triggerFileUpload"
              >
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="image/*,.pdf"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <div v-if="!prescriptionFile">
                  <i class="ti ti-cloud-upload text-4xl text-gray-400 mb-2"></i>
                  <p class="text-gray-600 mb-1">کلیک کنید یا فایل را بکشید</p>
                  <p class="text-xs text-gray-400">فرمت‌های مجاز: JPG, PNG, PDF</p>
                </div>
                <div v-else class="flex items-center justify-center gap-3">
                  <i class="ti ti-file-check text-3xl text-green-500"></i>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ prescriptionFile?.name }}</p>
                    <p class="text-xs text-gray-500">فایل آپلود شد</p>
                  </div>
                  <button @click.stop="prescriptionFile = null" class="text-red-500 hover:text-red-600">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Medicine List (if without prescription) -->
            <div v-if="orderType === 'no-prescription'" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">لیست داروها</label>
              <textarea 
                v-model="medicineList"
                rows="4"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="نام داروهای مورد نیاز را بنویسید..."
              ></textarea>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات (اختیاری)</label>
              <textarea 
                v-model="orderDescription"
                rows="3"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="توضیحات تکمیلی..."
              ></textarea>
            </div>

            <!-- Contact Info -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام و نام‌خانوادگی</label>
                <input 
                  v-model="customerName"
                  type="text"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="نام شما"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input 
                  v-model="customerPhone"
                  type="tel"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="09xxxxxxxxx"
                />
              </div>
            </div>

            <!-- Address -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">آدرس تحویل</label>
              <textarea 
                v-model="customerAddress"
                rows="2"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="آدرس کامل..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button 
              @click="submitOrder"
              :disabled="!canSubmitOrder"
              class="w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ثبت سفارش
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-check text-4xl text-green-500"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">سفارش شما ثبت شد</h3>
          <p class="text-gray-600 mb-2">کد پیگیری: {{ orderTrackingCode }}</p>
          <p class="text-sm text-gray-500 mb-6">داروخانه به زودی با شما تماس خواهد گرفت</p>
          <div class="flex gap-3">
            <button 
              @click="showSuccessModal = false"
              class="flex-1 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              متوجه شدم
            </button>
            <NuxtLink 
              to="/"
              class="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
            >
              صفحه اصلی
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Review Modal -->
    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showReviewModal = false">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">ثبت نظر برای {{ pharmacy.info?.name }}</h3>
            <button @click="showReviewModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-500"></i>
            </button>
          </div>

          <!-- Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">امتیاز شما</label>
            <div class="flex items-center gap-2">
              <button 
                v-for="star in 5" 
                :key="star"
                @click="reviewForm.rating = star"
                class="text-3xl transition-transform hover:scale-110"
              >
                <i :class="star <= reviewForm.rating ? 'ti ti-star-filled text-yellow-400' : 'ti ti-star text-gray-300'"></i>
              </button>
              <span class="text-sm text-gray-500 mr-2">{{ reviewForm.rating > 0 ? reviewForm.rating + ' از 5' : '' }}</span>
            </div>
          </div>

          <!-- Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">نام شما</label>
            <input 
              v-model="reviewForm.name"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="نام خود را وارد کنید"
            />
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">شماره موبایل</label>
            <input 
              v-model="reviewForm.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="09xxxxxxxxx"
              maxlength="11"
            />
          </div>

          <!-- Comment -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">نظر شما</label>
            <textarea 
              v-model="reviewForm.comment"
              rows="4"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
              placeholder="نظر خود را درباره این داروخانه بنویسید..."
            ></textarea>
          </div>

          <!-- Submit -->
          <button 
            @click="submitReview"
            :disabled="!reviewForm.rating || !reviewForm.name || !reviewForm.comment"
            class="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ثبت نظر
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {useTenantStore} from "~/stores/tenant.store";
import {useUrlHelper} from "~/composables/useUrlHelper";
import {useCategoryStore} from "~/stores/category.store";
import {computed,ref} from "vue";

const { resolveUrl } = useUrlHelper();
const route = useRoute()
const router = useRouter()
const tenantStore=useTenantStore()
//const pharmacy=computed(()=>tenantStore.getTenantById(String(route.params.id)))
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
const pharmacy = computed(() => {
  const ph = tenantStore.getTenantById(String(route.params.id))
  if (!ph) return null

  // 1. استخراج تنظیمات اختصاصی داروخانه (pharmacyInfo) از آرایه settings
  const pharmacyInfoSetting = (ph.settings || []).find(item => item.key === 'pharmacyInfo')?.value || {}

  // 2. ترکیب اطلاعات (اولویت با pharmacyInfo است)
  const info = {
    id: ph.id,
    // نام: اگر در pharmacyInfo بود همان، وگرنه از فیلد اصلی تننت
    name: pharmacyInfoSetting.ownerName || ph.name || 'نامشخص',

    // موقعیت مکانی
    city: pharmacyInfoSetting.city || ph.city,
    province: pharmacyInfoSetting.province || ph.province,
    fullAddress: [
      ph.tenantAddress?.detailedAddress?.road,
      ph.tenantAddress?.detailedAddress?.neighbourhood,
      ph.tenantAddress?.detailedAddress?.suburb
    ]
        .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
        .join('. '),

    // تماس
    phone: pharmacyInfoSetting.phone || ph.phone,
    mobile: pharmacyInfoSetting.mobile,
    email: pharmacyInfoSetting.email || ph.email,
    website: pharmacyInfoSetting.website,

    // امتیازات
    rating: Number(ph.rating) || 0,
    reviewCount: ph.reviewsCount || 0,

    // وضعیت
    isOpen: checkIsOpen(ph,'pharmacy'),
    isSuspended: ph.isSuspended || false,

    // لوگو: اولویت با pharmacyInfo، وگرنه از documents
    //image: pharmacyInfoSetting.logo || ph.documents?.logo?.thumbnail || null,
    image: resolveUrl(pharmacyInfoSetting.logo)  || resolveUrl(ph.documents?.logo?.thumbnail) || null,


    // مالک
    ownerName: pharmacyInfoSetting.ownerName || ph.ownerName,

    // توضیحات
    about: pharmacyInfoSetting.description || 'توضیحات موجود نیست',

    // تحویل
    hasDelivery: ph.freeDelivery || ph.fastDelivery || false,

    // --- ساخت ساعات کاری ---
    workingHours: '',
    is24Hours: pharmacyInfoSetting.is24Hours || false,
    openTime: pharmacyInfoSetting.openTime,
    closeTime: pharmacyInfoSetting.closeTime
  }

  // تنظیم متن ساعات کاری بر اساس داده‌ها
  if (info.is24Hours) {
    info.workingHours = '۲۴ ساعته'
  } else if (info.openTime && info.closeTime) {
    info.workingHours = `${info.openTime} تا ${info.closeTime}`
  } else {
    info.workingHours = 'ساعات کاری ثبت نشده'
  }

  // 3. پردازش محصولات (Market Products)
  const products = (ph.marketProducts || []).map(item => {
    // دسترسی به آبجکت محصول اصلی
    const mainProduct = item.product || {};

    // استخراج قیمت‌ها بر اساس ساختار جدید دیتابیس
    const basePrice = item.price || 0;
    const finalPrice = item.discountedPrice || basePrice; // قیمت نهایی از دیتابیس

    // محاسبه درصد تخفیف برای نمایش (اگر نوع درصد باشد)
    let discountPercent = 0;
    if (item.hasDiscount && item.discountType === 'percentage') {
      discountPercent = item.discountValue || 0;
    } else if (item.hasDiscount && item.discountType === 'fixed') {
      // اگر تخفیف از نوع مبلغ ثابت بود، درصد را محاسبه کن
      discountPercent = Math.round(((basePrice - finalPrice) / basePrice) * 100);
    }

    // استخراج دسته‌بندی از categoryBreadcrumb
    // فرمت: "پت شاپ > بهداشت > بهداشت سگ > شامپو"
    // ما آخرین بخش را به عنوان دسته‌بندی اصلی برمی‌داریم
    const breadcrumb = mainProduct.categoryBreadcrumb || '';
    const categoryParts = breadcrumb.split('>').map(p => p.trim());
    const categoryName = categoryParts.length > 0 ? categoryParts[categoryParts.length - 1] : 'عمومی';

    return {
      id: item.id,
      name: mainProduct.name || 'محصول بدون نام',
      category: categoryName, // دسته‌بندی استخراج شده
      // قیمت‌ها
      price: finalPrice,           // قیمت نهایی برای نمایش
      originalPrice: basePrice,    // قیمت اصلی
      discount: discountPercent,   // درصد تخفیف محاسبه شده
      // وضعیت موجودی
      inStock: (item.stock || 0) > 0,
      // تصویر
      //image: mainProduct.image || item.thumbnail || null,
      image: resolveUrl(mainProduct.image) || resolveUrl(item.thumbnail) || null,
      // سایر فیلدها
      stock: item.stock || 0,
      isActive: item.isActive // برای فیلتر کردن محصولات غیرفعال اگر نیاز بود
    };
  });

  // 4. پردازش داروها (Pharmacy Medicines)
  const medicines = (ph.pharmacyMedicines || []).map(item => ({
    id: item.id,
    name: item.name || item.medicine?.name || 'داروی بدون نام',
    genericName: item.genericName || item.medicine?.genericName || '',
    price: item.price || item.medicine?.price || 0,
    image: item.image || item.medicine?.image || item.thumbnail || null,
    description: item.description || item.medicine?.description || '',
    prescriptionRequired: item.prescriptionRequired || item.medicine?.prescriptionRequired || false
  }))

  return {
    info,
    products,
    medicines
  }
})

// Review Modal
const showReviewModal = ref(false)
const reviewForm = ref({
  rating: 0,
  name: '',
  phone: '',
  comment: ''
})

// Order Modal State
const showOrderModal = ref(false)
const orderType = ref('')
const prescriptionFile = ref(null)
const medicineList = ref('')
const orderDescription = ref('')
const customerName = ref('')
const customerPhone = ref('')
const customerAddress = ref('')
const fileInput = ref(null)

// Success Modal
const showSuccessModal = ref(false)
const orderTrackingCode = ref('')

// Products State
const selectedCategory = ref('')
const cart = ref([])
const categoryStore=useCategoryStore()
// Categories
const categories = computed(()=>categoryStore.categories)

// Computed
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return pharmacy.value.products
  return pharmacy.value.products.filter(p => p.category === selectedCategory.value)
})

const discountedProducts = computed(() => {
  return pharmacy.value.products.filter(p => p.discount && p.discount > 0)
})

const cartItemsCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    const product = pharmacy.value.products.find(p => p.id === item.id)
    return total + (product?.price || 0) * item.quantity
  }, 0)
})

const canSubmitOrder = computed(() => {
  if (!customerName.value || !customerPhone.value || !customerAddress.value) return false
  if (orderType.value === 'prescription' && !prescriptionFile.value) return false
  if (orderType.value === 'no-prescription' && !medicineList.value) return false
  return true
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const openOrderModal = (type) => {
  // Save cart to localStorage before navigating
  const cartData = {
    pharmacyId: pharmacy.value.info.id,
    pharmacyName: pharmacy.value.info.name,
    items: cart.value.map(item => {
      const product = products.value.find(p => p.id === item.id)
      return { ...product, quantity: item.quantity }
    }),
    total: cartTotal.value
  }
  localStorage.setItem('pharmacyCart', JSON.stringify(cartData))

  // Navigate to new order page
  router.push(`/pharmacy/order/${pharmacy.value.info.id}?type=${type}`)
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    prescriptionFile.value = file
  }
}

const submitOrder = () => {
  // Generate tracking code
  orderTrackingCode.value = 'PHR-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  // Close order modal, show success
  showOrderModal.value = false
  showSuccessModal.value = true

  // Reset form
  prescriptionFile.value = null
  medicineList.value = ''
  orderDescription.value = ''
  customerName.value = ''
  customerPhone.value = ''
  customerAddress.value = ''
}

const getCartQuantity = (productId) => {
  const item = cart.value.find(i => i.id === productId)
  return item?.quantity || 0
}

const addToCart = (product) => {
  if (!product.inStock) return

  // بررسی اینکه آیا سبد خرید خالی است یا خیر
  if (cart.value.length > 0) {
    // پیدا کردن اولین آیتم در سبد برای بررسی داروخانه آن
    const firstItem = cart.value[0]

    // اگر آیتم‌های سبد متعلق به داروخانه دیگری باشند
    if (firstItem.pharmacyId !== pharmacy.value.info.id) {
      // پاک کردن سبد خرید قبلی
      cart.value = []
      // نمایش پیام به کاربر (اختیاری)
      alert('سبد خرید شما با محصولات داروخانه جدید جایگزین شد.')
    }
  }

  const existing = cart.value.find(i => i.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    // اضافه کردن شناسه داروخانه به آیتم سبد خرید
    cart.value.push({
      id: product.id,
      quantity: 1,
      pharmacyId: pharmacy.value.info.id // ذخیره شناسه داروخانه در آیتم
    })
  }
}

const increaseQuantity = (productId) => {
  const item = cart.value.find(i => i.id === productId)
  if (item) item.quantity++
}

const decreaseQuantity = (productId) => {
  const index = cart.value.findIndex(i => i.id === productId)
  if (index !== -1) {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity--
    } else {
      cart.value.splice(index, 1)
    }
  }
}

const goToCart = () => {
  if (cart.value.length === 0) return

  // بررسی نهایی تطابق داروخانه
  const firstItem = cart.value[0]
  if (firstItem.pharmacyId !== pharmacy.value.info.id) {
    cart.value = []
    return
  }

  // Save cart to localStorage and go to checkout
  const cartData = {
    pharmacyId: pharmacy.value.info.id,
    pharmacyName: pharmacy.value.info.name,
    items: cart.value.map(item => {
      const product = pharmacy.value.products.find(p => p.id === item.id)
      return { ...product, quantity: item.quantity }
    }),
    total: cartTotal.value
  }
  localStorage.setItem('pharmacyCart', JSON.stringify(cartData))
  router.push('/pharmacy/checkout')
}

// Share pharmacy
const sharePharmacy = async () => {
  const shareData = {
    title: pharmacy.value.info.name,
    text: `${pharmacy.value.info.name} - ${pharmacy.value.info.about}`,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Share cancelled')
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(window.location.href)
    alert('لینک کپی شد!')
  }
}

// Scroll to products section
const scrollToProducts = () => {
  const productsSection = document.getElementById('products-section')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// Submit review
const submitReview = () => {
  if (!reviewForm.value.rating || !reviewForm.value.name || !reviewForm.value.comment) return

  // Here you would send to API
  console.log('Review submitted:', reviewForm.value)

  // Update pharmacy review count
  pharmacy.value.info.reviewCount++

  // Reset form and close modal
  reviewForm.value = { rating: 0, name: '', phone: '', comment: '' }
  showReviewModal.value = false

  alert('نظر شما با موفقیت ثبت شد!')
}

// SEO
useHead({
  title: `${pharmacy.value.info?.name} | پتومن`||'داروخانه',
  meta: [
    { name: 'description', content: `سفارش دارو و محصولات دامپزشکی از ${pharmacy.value.info?.name}`||'سفارش' }
  ]
})
</script>
