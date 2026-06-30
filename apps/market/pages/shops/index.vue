<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Header -->
    <div class="relative bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div class="absolute bottom-10 left-10 w-24 h-24 border-4 border-white rounded-full"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
        <i class="ti ti-paw-filled absolute top-20 left-20 text-8xl text-white/20 rotate-12"></i>
        <i class="ti ti-paw-filled absolute bottom-16 right-32 text-6xl text-white/20 -rotate-12"></i>
        <i class="ti ti-bone absolute top-32 right-1/3 text-5xl text-white/20 rotate-45"></i>
      </div>

      <div class="container mx-auto px-4 py-8 md:py-12 relative">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <!-- Title Section -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <i class="ti ti-building-store text-white text-2xl md:text-3xl"></i>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-white">پت‌شاپ‌های پتومن</h1>
                <p class="text-blue-100 text-sm md:text-base">بهترین فروشگاه‌های حیوانات خانگی</p>
              </div>
            </div>
            <div class="flex items-center gap-4 mt-4">
              <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <i class="ti ti-building-store text-white"></i>
                <span class="text-white text-sm font-medium">{{ filteredShops.length }} فروشگاه</span>
              </div>
              <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <i class="ti ti-map-pin text-white"></i>
                <span class="text-white text-sm font-medium">{{ uniqueCities.length }} شهر</span>
              </div>
            </div>
          </div>

          <!-- Search Box -->
          <div class="w-full md:w-96">
            <div class="relative">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="جستجوی فروشگاه..."
                  class="w-full px-4 py-3.5 pr-12 bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:ring-4 focus:ring-white/30 text-gray-800 placeholder-gray-400"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                <i class="ti ti-search text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
      <div class="container mx-auto px-4 py-3">

        <!-- City Filters -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span class="text-gray-500 text-sm whitespace-nowrap ml-2">
            <i class="ti ti-map-pin"></i>
            شهر:
          </span>
          <button
              @click="selectedCity = null"
              :class="[
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              !selectedCity ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="ti ti-world ml-1"></i>
            همه شهرها
          </button>
          <button
              v-for="city in uniqueCities"
              :key="city"
              @click="selectedCity = city"
              :class="[
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              selectedCity === city ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ city }}
          </button>
        </div>

        <!-- Sort & Filter Buttons -->
        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
              @click="showFilters = true"
              class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i class="ti ti-adjustments-horizontal"></i>
            فیلترها
            <span v-if="activeFiltersCount > 0" class="w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">
              {{ activeFiltersCount }}
            </span>
          </button>
          <div class="w-48">
            <ClientOnly>
            <UiUSelectMenu
                v-model="sortBy"
                :options="sortOptions"
                placeholder="مرتب‌سازی"
            />
            </ClientOnly>
          </div>
          <div class="flex-1"></div>
          <span class="text-sm text-gray-500 hidden md:block">
            <i class="ti ti-list-check ml-1"></i>
            {{ filteredShops.length }} فروشگاه یافت شد
          </span>
        </div>
      </div>
    </div>

    <!-- Shops Grid -->
    <div class="container mx-auto px-3 md:px-4 py-4 md:py-6 pb-24 md:pb-6">
      <div v-if="!shopStore.loading" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        <NuxtLink
            v-for="shop in filteredShops"
            :key="shop.id"
            :to="`/shop/${shop.id}`"
            class="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
        >
          <!-- Shop Cover -->
          <div class="relative h-24 md:h-36 bg-gradient-to-br" :class="getCoverGradient(shop.id)">
            <div class="absolute inset-0 flex items-center justify-center">
              <!-- استفاده از لوگوی فروشگاه یا تصویر پیش‌فرض -->
              <img :src="shop.shopInfo.value?.logo?shop.shopInfo.value?.logo:shop.avatarBg" class="w-full h-full object-cover opacity-90"/>
            </div>
            <!-- Badges -->
            <div class="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1">
              <!-- فرض بر این است که فیلد verified در دیتابیس یا استور وجود دارد -->
              <span v-if="shop.status === 'active'" class="p-1.5 md:px-2 md:py-1 bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                <i class="ti ti-rosette-discount-check text-sm"></i>
                <span class="hidden md:inline">تایید شده</span>
              </span>
            </div>
            <!-- Rating -->
            <div class="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg">
              <i class="ti ti-star-filled text-amber-500 text-xs md:text-sm"></i>
              <span class="text-xs md:text-sm font-bold text-gray-900">{{ shop.rating }}</span>
              <span class="text-xs text-gray-500 hidden md:inline">({{ shop.reviewsCount }})</span>
            </div>
            <!-- City Badge - Hidden on mobile -->
            <div class="absolute bottom-2 left-2 md:bottom-3 md:left-3 hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <i class="ti ti-map-pin text-blue-500 text-sm"></i>
              <span class="text-xs font-medium text-gray-700">{{ shop.city || shop.province }}</span>
            </div>
          </div>

          <!-- Shop Info -->
          <div class="p-2.5 md:p-4">
            <div class="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
              <div class="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100">
                <i class="ti ti-building-store text-gray-600 text-base md:text-xl"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 text-sm md:text-base truncate">{{ shop.shopInfo.value?.name?shop.shopInfo.value?.name:shop.name }}</h3>
                <p class="text-xs text-gray-500 truncate">{{ shop.description }}</p>
              </div>
            </div>

            <!-- Mobile: City & Status -->
            <div class="flex items-center gap-1.5 text-xs text-gray-500 mb-2 md:hidden">
              <i class="ti ti-map-pin text-blue-500"></i>
              <span class="truncate">{{ shop.city || shop.province }}</span>
              <span class="text-gray-300">|</span>
              <span :class="getShopOpenStatus(shop) ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
                {{ getShopOpenStatus(shop) ? 'باز' : 'بسته' }}
              </span>
            </div>

            <!-- Desktop: Address -->
            <div class="hidden md:flex items-center gap-2 text-xs text-gray-500 mb-3">
              <i class="ti ti-map-pin text-blue-500"></i>
              {{ shop.address.city }} . {{shop.address.neighborhood}}. {{shop.address.suburb}}
            </div>

            <!-- Desktop: Badges -->
            <div class="hidden md:flex items-center gap-2">
              <span
                  class="px-2 py-1 rounded-lg text-xs font-medium"
                  :class="getShopOpenStatus(shop) ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
              >
                {{ getShopOpenStatus(shop) ? 'باز' : 'بسته' }}
              </span>
              <span v-if="shop.freeDelivery" class="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                ارسال رایگان
              </span>
              <span v-if="shop.fastDelivery" class="px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
                ارسال سریع
              </span>
            </div>

            <!-- Mobile: Delivery badges -->
            <div class="flex md:hidden items-center gap-1 flex-wrap">
              <span v-if="shop.freeDelivery" class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                ارسال رایگان
              </span>
              <span v-if="shop.fastDelivery" class="px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded text-xs">
                سریع
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="shopStore.loading" class="flex justify-center py-20">
        <i class="ti ti-loader animate-spin text-4xl text-blue-500"></i>
      </div>

      <!-- Empty State -->
      <div v-if="!shopStore.loading && filteredShops.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="ti ti-building-store-off text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">فروشگاهی یافت نشد</h3>
        <p class="text-gray-500">فیلترهای جستجو را تغییر دهید</p>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreShops" class="text-center mt-8">
        <button
            @click="loadMoreShops"
            :disabled="isLoadingMore"
            class="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          <i v-if="isLoadingMore" class="ti ti-loader animate-spin"></i>
          <i v-else class="ti ti-plus"></i>
          {{ isLoadingMore ? 'در حال بارگذاری...' : 'مشاهده فروشگاه‌های بیشتر' }}
        </button>
        <p class="text-sm text-gray-500 mt-2">
          {{ filteredShops.length }} از {{ allFilteredShops.length }} فروشگاه
        </p>
      </div>
    </div>

    <!-- Filter Drawer (Mobile) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showFilters"
            class="fixed inset-0 bg-black/50 z-50"
            @click="showFilters = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showFilters"
            class="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl max-h-[70vh] overflow-y-auto"
        >
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900">فیلترها</h3>
              <button @click="showFilters = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="ti ti-x text-xl text-gray-500"></i>
              </button>
            </div>
          </div>
          <div class="p-4 space-y-4">
            <!-- Status Filter -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">وضعیت فروشگاه</h4>
              <div class="flex flex-wrap gap-2">
                <button
                    @click="filterOpen = null"
                    :class="['px-4 py-2 rounded-xl text-sm', filterOpen === null ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700']"
                >
                  همه
                </button>
                <button
                    @click="filterOpen = true"
                    :class="['px-4 py-2 rounded-xl text-sm', filterOpen === true ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700']"
                >
                  باز
                </button>
                <button
                    @click="filterOpen = false"
                    :class="['px-4 py-2 rounded-xl text-sm', filterOpen === false ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700']"
                >
                  بسته
                </button>
              </div>
            </div>
            <!-- Verified Filter -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">وضعیت</h4>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="filterVerified" class="w-5 h-5 rounded text-blue-500 focus:ring-blue-500">
                <span class="text-gray-700">فقط فروشگاه‌های فعال (تایید شده)</span>
              </label>
            </div>
            <!-- Free Delivery Filter -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">ارسال</h4>
              <label class="flex items-center gap-3 cursor-pointer mb-2">
                <input type="checkbox" v-model="filterFreeDelivery" class="w-5 h-5 rounded text-blue-500 focus:ring-blue-500">
                <span class="text-gray-700">ارسال رایگان</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="filterFastDelivery" class="w-5 h-5 rounded text-blue-500 focus:ring-blue-500">
                <span class="text-gray-700">ارسال سریع</span>
              </label>
            </div>
          </div>
          <div class="p-4 border-t border-gray-100">
            <button
                @click="showFilters = false"
                class="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              اعمال فیلترها
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Mobile Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden safe-area-bottom">
      <div class="grid grid-cols-5 h-16">
        <!-- Home -->
        <NuxtLink to="/" class="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-blue-500">
          <i class="ti ti-home text-xl"></i>
          <span class="text-xs">خانه</span>
        </NuxtLink>

        <!-- Categories -->
        <NuxtLink to="/categories" class="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-blue-500">
          <i class="ti ti-category text-xl"></i>
          <span class="text-xs">دسته‌بندی</span>
        </NuxtLink>

        <!-- Shops (Active) -->
        <NuxtLink to="/shops" class="flex flex-col items-center justify-center gap-1 text-blue-500">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center -mt-4 shadow-lg shadow-blue-200">
            <i class="ti ti-building-store text-xl text-white"></i>
          </div>
          <span class="text-xs font-medium">فروشگاه‌ها</span>
        </NuxtLink>

        <!-- Cart -->
        <NuxtLink to="/cart" class="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-blue-500 relative">
          <i class="ti ti-shopping-cart text-xl"></i>
          <span class="text-xs">سبد</span>
          <span v-if="cartCount > 0" class="absolute top-2 right-1/4 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ cartCount > 9 ? '9+' : cartCount }}
          </span>
        </NuxtLink>

        <!-- Login/Profile -->
        <NuxtLink to="/login" class="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-blue-500">
          <i class="ti ti-user text-xl"></i>
          <span class="text-xs">ورود</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useShopStore } from "../../stores/shop.store";
import { useCart} from "../../composables/useCart.js";

// Use global cart
const { cartCount } = useCart()

// Store
const shopStore = useShopStore()

// State
const searchQuery = ref('')
const sortBy = ref('rating')
const showFilters = ref(false)
const filterOpen = ref(null)
const filterVerified = ref(false)
const filterFreeDelivery = ref(false)
const filterFastDelivery = ref(false)
const selectedCity = ref(null) // null means 'All'

// --- Computed ---

// دریافت لیست فروشگاه‌ها از استور
const shops = computed(() => shopStore.shops || [])

// استخراج شهرهای یکتا از لیست فروشگاه‌ها
const uniqueCities = computed(() => {
  if (!shops.value.length) return []
  const citySet = new Set(shops.value.map(s => s.cityName).filter(Boolean))
  return Array.from(citySet)
})

// Sort Options
const sortOptions = [
  { value: 'rating', label: 'بالاترین امتیاز', icon: 'ti ti-star' },
  { value: 'reviews', label: 'بیشترین نظر', icon: 'ti ti-message' },
  { value: 'name', label: 'نام فروشگاه', icon: 'ti ti-sort-ascending-letters' },
]

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (filterOpen.value !== null) count++
  if (filterVerified.value) count++
  if (filterFreeDelivery.value) count++
  if (filterFastDelivery.value) count++
  return count
})

// All Filtered & Sorted Shops (without pagination)
const allFilteredShops = computed(() => {
  let result = [...shops.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(shop =>
        shop.name.toLowerCase().includes(query) ||
        (shop.address && shop.address.toLowerCase().includes(query))
    )
  }

  // City filter
  if (selectedCity.value) {
    result = result.filter(shop => shop.cityName === selectedCity.value)
  }

  // Status filter
  if (filterOpen.value !== null) {
    result = result.filter(shop => getShopOpenStatus(shop) === filterOpen.value)
  }

  // Verified filter (Active status)
  if (filterVerified.value) {
    result = result.filter(shop => shop.status === 'active')
  }

  // Delivery filters
  if (filterFreeDelivery.value) {
    result = result.filter(shop => shop.freeDelivery)
  }
  if (filterFastDelivery.value) {
    result = result.filter(shop => shop.fastDelivery)
  }

  // Sort
  if (sortBy.value === 'rating') {
    result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
  } else if (sortBy.value === 'reviews') {
    result.sort((a, b) => b.reviewsCount - a.reviewsCount)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'fa'))
  }

  return result
})

// Paginated Filtered Shops
const shopsPerPage = ref(8)
const isLoadingMore = ref(false)

const filteredShops = computed(() => {
  return allFilteredShops.value.slice(0, shopsPerPage.value)
})

// Has More Shops
const hasMoreShops = computed(() => {
  return shopsPerPage.value < allFilteredShops.value.length
})

// --- Methods ---

// Helper for random gradient cover
const getCoverGradient = (id) => {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-teal-400 to-teal-600',
    'from-orange-400 to-orange-600',
    'from-pink-400 to-pink-600'
  ]
  // استفاده از کاراکتر آخر ID برای انتخاب تصادفی
  const index = id.charCodeAt(id.length - 1) % gradients.length
  return gradients[index]
}

// Load More Shops
const loadMoreShops = async () => {
  isLoadingMore.value = true
  // شبیه‌سازی تاخیر برای تجربه کاربری بهتر
  await new Promise(resolve => setTimeout(resolve, 500))
  shopsPerPage.value += 8
  isLoadingMore.value = false
}

// Lifecycle
onMounted(() => {
  if (!shopStore.fetched) {
    shopStore.fetchShops()
  }
})

// تابع کمکی برای محاسبه وضعیت باز/بسته بودن هر فروشگاه
const getShopOpenStatus = (shop) => {

  const shopInfoSetting =shop.shopInfo;

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
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>