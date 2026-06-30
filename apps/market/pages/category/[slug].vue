<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Category Header -->
    <div class="bg-gradient-to-l from-blue-500 to-teal-500 text-white">
      <div class="container mx-auto px-4 py-8 md:py-10">
        <div v-if="category" class="flex items-center gap-4">
          <div
              class="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <i :class="[category.icon, 'text-3xl md:text-4xl text-white']"></i>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">{{ category.name }}</h1>
            <p class="text-white/80 mt-1">{{ category.count }} محصول در این دسته</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Breadcrumb Section -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
            <i class="ti ti-home text-base"></i>
            <span>خانه</span>
          </NuxtLink>
          <i class="ti ti-chevron-left text-xs text-gray-400"></i>
          <NuxtLink to="/categories" class="text-gray-500 hover:text-blue-500 transition-colors">دسته‌بندی‌ها</NuxtLink>
          <i class="ti ti-chevron-left text-xs text-gray-400"></i>
          <span class="text-blue-600 font-medium">{{ category.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Filters & Products -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Filters (Desktop) -->
        <aside class="hidden lg:block w-72 flex-shrink-0">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 sticky top-36">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-filter text-blue-500"></i>
              فیلترها
            </h3>

            <!-- Sub Categories -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">زیردسته</h4>
              <div class="space-y-2">
                <label
                    v-for="sub in subCategories"
                    :key="sub.id"
                    class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                      type="checkbox"
                      v-model="selectedSubs"
                      :value="sub.id"
                      class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  >
                  <span class="text-gray-600 text-sm">{{ sub.name }}</span>
                  <span class="text-gray-400 text-xs mr-auto">({{ sub.count }})</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">محدوده قیمت</h4>
              <div class="flex gap-2">
                <input
                    type="number"
                    v-model="priceFrom"
                    placeholder="از"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                >
                <input
                    type="number"
                    v-model="priceTo"
                    placeholder="تا"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                >
              </div>
            </div>

            <!-- Brands -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">برند</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label
                    v-for="brand in brands"
                    :key="brand.id"
                    class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                      type="checkbox"
                      v-model="selectedBrands"
                      :value="brand.id"
                      class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  >
                  <span class="text-gray-600 text-sm">{{ brand.name }}</span>
                </label>
              </div>
            </div>

            <!-- Only Available -->
            <div class="mb-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="onlyAvailable"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                >
                <span class="text-gray-700 text-sm">فقط کالاهای موجود</span>
              </label>
            </div>

            <!-- Only Discount -->
            <div class="mb-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="onlyDiscount"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                >
                <span class="text-gray-700 text-sm">فقط کالاهای تخفیف‌دار</span>
              </label>
            </div>

            <button
                @click="applyFilters"
                class="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              اعمال فیلتر
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Top Bar -->
          <div
              class="bg-white rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center gap-4 border border-gray-100">
            <!-- Mobile Filter Button -->
            <button
                @click="showMobileFilter = true"
                class="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
            >
              <i class="ti ti-filter"></i>
              فیلترها
            </button>

            <!-- Sort -->
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-sm">مرتب‌سازی:</span>
              <div class="w-40">
                <ClientOnly>
                <UiUSelectMenu
                    v-model="sortBy"
                    :options="sortOptions"
                    placeholder="مرتب‌سازی"
                />
                </ClientOnly>
              </div>
            </div>

            <!-- View Toggle -->
            <div class="hidden md:flex items-center gap-2 mr-auto">
              <button
                  @click="viewMode = 'grid'"
                  :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'"
                  class="p-2 rounded-lg"
              >
                <i class="ti ti-grid-dots text-lg"></i>
              </button>
              <button
                  @click="viewMode = 'list'"
                  :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'"
                  class="p-2 rounded-lg"
              >
                <i class="ti ti-list text-lg"></i>
              </button>
            </div>

            <!-- Product Count -->
            <span class="text-gray-500 text-sm">{{ filteredProducts.length }} محصول</span>
          </div>

          <!-- Products Grid -->
          <div
              :class="viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4' 
              : 'space-y-4'"
          >
            <div
                v-for="product in filteredProducts"
                :key="product.id"
                :class="viewMode === 'grid'
                ? 'bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group' 
                : 'bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex'"
            >
              <!-- Product Image -->
              <div
                  :class="viewMode === 'grid'
                  ? 'relative aspect-square bg-gray-100' 
                  : 'relative w-40 h-40 flex-shrink-0 bg-gray-100'"
              >
                <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                >
                <div v-if="product.discount"
                     class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                  {{ product.discount }}% تخفیف
                </div>
                <button
                    @click.stop="toggleFavorite(product)"
                    class="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow"
                >
                  <i :class="product.isFavorite ? 'ti ti-heart-filled text-red-500' : 'ti ti-heart text-gray-400'"></i>
                </button>
                <div v-if="!product.available" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span class="text-white font-bold text-sm">ناموجود</span>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4 flex-1">
                <NuxtLink :to="`/product/${product.id}`" class="block">
                  <h3
                      :class="viewMode === 'grid'
                      ? 'font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-500 transition-colors' 
                      : 'font-semibold text-gray-900 hover:text-blue-500 transition-colors'"
                  >
                    {{ product.name }}
                  </h3>
                </NuxtLink>

                <p v-if="viewMode === 'list'" class="text-gray-500 text-sm mt-2 line-clamp-2">{{
                    product.description
                  }}</p>

                <div class="flex items-center gap-2 mt-2">
                  <span class="text-xs text-gray-500">{{ product.brand }}</span>
                  <div class="flex items-center gap-1">
                    <i class="ti ti-star-filled text-yellow-400 text-xs"></i>
                    <span class="text-xs text-gray-600">{{ product.rating }}</span>
                  </div>
                </div>

                <div class="mt-3 flex items-center justify-between">
                  <div>
                    <div v-if="product.discount" class="text-xs text-gray-400 line-through">
                      {{ product.originalPrice.toLocaleString() }}
                    </div>
                    <div class="font-bold text-blue-600">
                      {{ product.price.toLocaleString() }}
                      <span class="text-xs font-normal text-gray-500">تومان</span>
                    </div>
                  </div>
                  <button
                      v-if="product.available"
                      @click="handleAddToCart(product)"
                      class="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <i class="ti ti-shopping-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div class="text-center mt-8">
            <button
                class="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              مشاهده بیشتر
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showMobileFilter"
            class="fixed inset-0 bg-black/50 z-50 lg:hidden"
            @click="showMobileFilter = false"
        ></div>
      </Transition>
      <Transition name="slide-right">
        <div
            v-if="showMobileFilter"
            class="fixed inset-y-0 right-0 w-80 max-w-full bg-white z-50 lg:hidden overflow-y-auto"
        >
          <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-filter text-blue-500"></i>
              فیلترها
            </h3>
            <button @click="showMobileFilter = false" class="w-8 h-8 flex items-center justify-center">
              <i class="ti ti-x text-gray-500"></i>
            </button>
          </div>

          <div class="p-4">
            <!-- Sub Categories -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">زیردسته</h4>
              <div class="space-y-2">
                <label
                    v-for="sub in subCategories"
                    :key="sub.id"
                    class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                      type="checkbox"
                      v-model="selectedSubs"
                      :value="sub.id"
                      class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  >
                  <span class="text-gray-600 text-sm">{{ sub.name }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">محدوده قیمت</h4>
              <div class="flex gap-2">
                <input
                    type="number"
                    v-model="priceFrom"
                    placeholder="از"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                <input
                    type="number"
                    v-model="priceTo"
                    placeholder="تا"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
              </div>
            </div>

            <!-- Brands -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">برند</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label
                    v-for="brand in brands"
                    :key="brand.id"
                    class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                      type="checkbox"
                      v-model="selectedBrands"
                      :value="brand.id"
                      class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  >
                  <span class="text-gray-600 text-sm">{{ brand.name }}</span>
                </label>
              </div>
            </div>

            <!-- Toggles -->
            <div class="space-y-3 mb-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="onlyAvailable"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                >
                <span class="text-gray-700 text-sm">فقط کالاهای موجود</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="onlyDiscount"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                >
                <span class="text-gray-700 text-sm">فقط کالاهای تخفیف‌دار</span>
              </label>
            </div>

            <div class="flex gap-2">
              <button
                  @click="clearFilters"
                  class="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium"
              >
                پاک کردن
              </button>
              <button
                  @click="applyFilters(); showMobileFilter = false"
                  class="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                اعمال فیلتر
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
            class="fixed inset-y-0 left-0 w-96 max-w-full bg-white z-50 flex flex-col"
        >
          <!-- Cart Header -->
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-shopping-cart text-blue-500"></i>
              سبد خرید
              <span class="text-sm text-gray-500 font-normal">({{ cartItems.length }} کالا)</span>
            </h3>
            <button @click="showCart = false" class="w-8 h-8 flex items-center justify-center">
              <i class="ti ti-x text-gray-500"></i>
            </button>
          </div>

          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="cartItems.length === 0" class="text-center py-12">
              <i class="ti ti-shopping-cart-off text-6xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">سبد خرید شما خالی است</p>
            </div>
            <div v-else class="space-y-4">
              <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex gap-3 bg-gray-50 rounded-xl p-3"
              >
                <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-20 h-20 rounded-lg object-cover"
                >
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 text-sm line-clamp-2">{{ item.name }}</h4>
                  <div class="text-blue-600 font-bold text-sm mt-1">
                    {{ formatPrice(item.price * item.quantity) }} تومان
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <button
                        @click="decreaseQuantity(item.id)"
                        class="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <i class="ti ti-minus text-sm"></i>
                    </button>
                    <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                    <button
                        @click="increaseQuantity(item.id)"
                        class="w-7 h-7 bg-blue-500 text-white rounded-lg flex items-center justify-center"
                    >
                      <i class="ti ti-plus text-sm"></i>
                    </button>
                    <button
                        @click="removeFromCart(item.id)"
                        class="mr-auto text-red-500"
                    >
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Footer -->
          <div v-if="cartItems.length > 0" class="p-4 border-t border-gray-100 bg-gray-50">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-600">جمع سبد خرید:</span>
              <span class="font-bold text-lg text-gray-900">{{ cartTotal.toLocaleString() }} تومان</span>
            </div>
            <NuxtLink
                to="/cart"
                class="block w-full py-3 bg-blue-500 text-white rounded-xl text-center font-medium hover:bg-blue-600 transition-colors"
                @click="showCart = false"
            >
              ادامه فرایند خرید
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Cart Button (Fixed - Desktop Only) -->
    <!-- تغییر: hidden در موبایل و block در دسکتاپ (md:block) -->
    <div v-if="cartItems.length > 0" class="hidden md:block fixed bottom-6 left-6 z-40 w-72">
      <button
          @click="showCart = true"
          class="w-full flex items-center justify-between px-5 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all duration-300 border border-blue-400/20"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <i class="ti ti-shopping-cart text-2xl"></i>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold">{{ cartCount }} محصول</p>
            <p class="text-xs text-blue-100">مشاهده سبد خرید</p>
          </div>
        </div>
        <div class="text-left">
          <p class="text-lg font-bold">{{ formatPrice(cartTotal) }}</p>
          <p class="text-xs text-blue-100">تومان</p>
        </div>
      </button>
    </div>


    <!-- Floating Cart Button (Mobile) -->
    <button
        v-if="cartItems.length > 0"
        @click="showCart = true"
        class="fixed bottom-6 left-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center lg:hidden z-40"
    >

      <i class="ti ti-shopping-cart text-xl"></i>
      <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
        {{ cartCount }}
      </span>
    </button>
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
import {ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useCategoryStore} from "../../stores/category.store.ts";
import {useReferenceStore} from "../../stores/reference.store.js";
import {useProductStore} from "../../stores/product.store.ts";

const productsStore = useProductStore()
const categoryStore = useCategoryStore()
const referenceStore = useReferenceStore()
const route = useRoute()

// --- دریافت دسته‌بندی ---
const category = ref({});
watch(
    () => route.params.slug,
    (newSlug) => {
      const data = categoryStore.getCategoryBySlug(String(newSlug));
      category.value = data || {};
    },
    {immediate: true}
);

const subCategories = computed(() => categoryStore.getSubCategoriesBySlug(String(route.params.slug)))
const brands = computed(() => referenceStore.brands)
const products = computed(() => categoryStore.getProductsBySlug(String(route.params.slug)))

// --- فیلترها ---
const showMobileFilter = ref(false)
const selectedSubs = ref([])
const selectedBrands = ref([])
const priceFrom = ref(null)
const priceTo = ref(null)
const onlyAvailable = ref(false)
const onlyDiscount = ref(false)
const sortBy = ref('newest')
const viewMode = ref('grid')

const sortOptions = [
  {value: 'newest', label: 'جدیدترین', icon: 'ti ti-sparkles'},
  {value: 'bestselling', label: 'پرفروش‌ترین', icon: 'ti ti-flame'},
  {value: 'cheapest', label: 'ارزان‌ترین', icon: 'ti ti-sort-ascending'},
  {value: 'expensive', label: 'گران‌ترین', icon: 'ti ti-sort-descending'},
  {value: 'rating', label: 'بالاترین امتیاز', icon: 'ti ti-star'},
]

// --- محصولات فیلتر شده ---
const filteredProducts = computed(() => {
  let result = [...products.value]

  if (onlyAvailable.value) {
    result = result.filter(p => p.available)
  }
  if (onlyDiscount.value) {
    result = result.filter(p => p.discount > 0)
  }
  if (priceFrom.value) {
    result = result.filter(p => p.price >= priceFrom.value)
  }
  if (priceTo.value) {
    result = result.filter(p => p.price <= priceTo.value)
  }
  if (selectedBrands.value.length > 0) {
    const brandNames = brands.value.filter(b => selectedBrands.value.includes(b.id)).map(b => b.name)
    result = result.filter(p => brandNames.includes(p.brand))
  }

  // Sort
  switch (sortBy.value) {
    case 'cheapest':
      result.sort((a, b) => a.price - b.price)
      break
    case 'expensive':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'bestselling':
      // Would use sales count in real app
      break
  }
  return result
})

// --- سبد خرید ---
const showCart = ref(false)
const {
  addToCart: addItemToCart,
  cartItems,
  cartTotal,
  cartCount,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} = useCart()

// افزودن به سبد خرید (اصلاح شده با منطق بررسی فروشنده)
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

  // اگر فروشنده یکی بود یا سبد خالی بود، محصول اضافه می‌شود
  addItemToCart({
    productId: product.id,
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    originalPrice: product.originalPrice,
    image: product.image || product.images?.[0]?.url,
    category: product.category?.name,
    shopId: product.shopId,
    shopName: product.shopName,
    variantId: null
  })

  showToastMessage('محصول به سبد خرید اضافه شد')
}

// توابع کم و زیاد کردن (حالا مستقیماً از useCart استفاده می‌کنند)
// نیازی به تعریف مجدد نیست، چون در بالا از useCart دریافت کردیم.
// فقط باید در تمپلیت پارامتر درست (item.id) به آن‌ها داده شود.

// --- Toast ---
const showToast = ref(false)
const toastMessage = ref('')
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// --- علاقه‌مندی‌ها ---
const toggleFavorite = async (product) => {
  // ۱. محاسبه وضعیت جدید
  const newStatus = !product.isFavorite;

  try {
    // ۲. فراخوانی API
    await productsStore.toggleLike(product.id, newStatus);

    // ۳. پیدا کردن و آپدیت کردن محصول در استور دسته‌بندی (برای واکنش‌گرایی)
    // ما باید در آرایه اصلی categories بگردیم
    const categoryData = categoryStore.categories.find(c => c.slug === route.params.slug);

    if (categoryData) {
      // پیدا کردن محصول در لیست محصولات دسته‌بندی
      const targetPtc = categoryData.productTenantCategories.find(ptc => ptc.product.id === product.id);

      if (targetPtc && targetPtc.product) {
        // آپدیت کردن مقدار در منبع اصلی (استور)
        targetPtc.product.isFavorite = newStatus;
      }
    }

    // ۴. نمایش پیام
    showToastMessage(
        newStatus ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
        newStatus ? 'ti ti-heart-filled' : 'ti ti-heart'
    );

  } catch (error) {
    console.error('Error toggling favorite:', error);
    // در صورت خطا، وضعیت UI را برگردانید (چون در خط اول تغییر دادیم)
    // product.isFavorite = !newStatus;
  }
};
// --- فیلترها ---
const applyFilters = () => {
  // Filters are reactive, no action needed
}

const clearFilters = () => {
  selectedSubs.value = []
  selectedBrands.value = []
  priceFrom.value = null
  priceTo.value = null
  onlyAvailable.value = false
  onlyDiscount.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
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
