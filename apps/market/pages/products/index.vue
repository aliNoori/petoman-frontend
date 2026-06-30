<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div class="container mx-auto px-4 py-4">

        <!-- ردیف اول: عنوان و جستجو -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Title -->
          <div class="flex-1">
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">محصولات</h1>
            <p class="text-gray-500 text-sm mt-1">{{ filteredProducts.length }} محصول یافت شد</p>
          </div>

          <!-- Search -->
          <div class="relative w-full md:w-80">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی محصول..."
                class="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i class="ti ti-search absolute right-3 top-3 text-gray-400"></i>
          </div>
        </div>

        <!-- ردیف دوم: دسته‌بندی‌ها (جداسازی شده برای اسکرول مستقل) -->
        <div class="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide pb-2">
          <!-- استفاده از flex-nowrap و gap برای فاصله منظم -->
          <div class="flex items-center gap-2 min-w-max">
            <button
                @click="selectedCategory = null"
                :class="[
            'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
            !selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
            >
              همه
            </button>
            <button
                v-for="cat in categories"
                :key="cat.id"
                @click="selectedCategory = cat.id"
                :class="[
            'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
            selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
            >
              <i :class="cat.icon"></i>
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- ردیف سوم: مرتب‌سازی و فیلتر -->
        <div class="flex items-center gap-2 mt-3">
          <button
              @click="showFilters = true"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
          >
            <i class="ti ti-filter"></i>
            فیلترها
          </button>
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
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="bg-white rounded-2xl p-3 md:p-4 border border-gray-100 hover:shadow-lg transition-all group"
        >
          <!-- Product Image -->
          <NuxtLink :to="`/product/${product.id}`">
            <div class="relative aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden flex items-center justify-center">
              <img :src="product.image" class="w-full h-full object-cover"/>
              <span v-if="product.discount" class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                {{ product.discount }}%
              </span>
              <button 
                @click.prevent="toggleFavorite(product.id)"
                class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <i :class="['ti', product.isFavorite ? 'ti-heart-filled text-red-500' : 'ti-heart text-gray-600']"></i>
              </button>
            </div>
          </NuxtLink>
          
          <!-- Product Info -->
          <div>
            <NuxtLink :to="`/shop/${product.shopId}`" class="text-xs text-blue-600 hover:underline mb-1 block">
              {{ product.shop }}
            </NuxtLink>
            <NuxtLink :to="`/product/${product.id}`">
              <h3 class="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10 hover:text-blue-600">{{ product.name }}</h3>
            </NuxtLink>
            
            <div class="flex items-center gap-1 mb-2">
              <i class="ti ti-star-filled text-amber-500 text-xs"></i>
              <span class="text-xs font-semibold text-gray-700">{{ product.rating }}</span>
              <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
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

              <!-- دکمه افزودن به سبد خرید: فقط اگر موجودی بیشتر از 0 باشد نمایش داده می‌شود -->
              <button
                  v-if="product.available"
                  @click="addToCart(product)"
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
        <p class="text-gray-500">فیلترهای جستجو را تغییر دهید</p>
      </div>
    </div>

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
        {{ cartItems.length }}
      </span>
    </button>
    <!-- Filter Drawer -->
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
          <div class="p-4 space-y-6">
            <!-- Price Range -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">محدوده قیمت</h4>
              <div class="flex items-center gap-3">
                <input 
                  v-model="priceMin"
                  type="number"
                  placeholder="از"
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
                <span class="text-gray-400">تا</span>
                <input 
                  v-model="priceMax"
                  type="number"
                  placeholder="تا"
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <!-- Discount -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">تخفیف</h4>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="filterDiscount" class="w-5 h-5 rounded text-blue-500 focus:ring-blue-500">
                <span class="text-gray-700">فقط محصولات تخفیف‌دار</span>
              </label>
            </div>

            <!-- Rating -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">حداقل امتیاز</h4>
              <div class="flex items-center gap-2">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  @click="filterRating = star"
                  :class="['px-3 py-2 rounded-xl text-sm flex items-center gap-1', filterRating === star ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600']"
                >
                  <i class="ti ti-star-filled text-amber-500"></i>
                  {{ star }}+
                </button>
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-gray-100 flex gap-3">
            <button 
              @click="resetFilters"
              class="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              پاک کردن
            </button>
            <button 
              @click="showFilters = false"
              class="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              اعمال فیلترها
            </button>
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
                <p class="text-xs text-gray-500 mb-2">{{ item.shop }}</p>
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
              <span class="text-gray-500">جمع کل:</span>
              <span class="font-bold text-gray-900">{{ formatPrice(cartTotal) }} تومان</span>
            </div>
            <NuxtLink
              to="/cart"
              @click="showCart = false"
              class="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-credit-card"></i>
              ادامه خرید
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
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
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from "../../stores/product.store.ts";
import { useCategoryStore } from "../../stores/category.store.js";

// استفاده از کامپوزابل سبد خرید
const { addToCart: addItemToCart, cartItems, cartCount, openCart } = useCart()

const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const searchQuery = ref('')
const selectedCategory = ref(null)
const sortBy = ref('newest')
const showFilters = ref(false)
const showCart = ref(false)
const priceMin = ref(null)
const priceMax = ref(null)
const filterDiscount = ref(false)
const filterRating = ref(null)

// Products
const products = computed(() => productStore.products)

// Categories
const categories = computed(() => categoryStore.categories.map((c) => {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon,
  }
}))

// Sort Options
const sortOptions = [
  { value: 'newest', label: 'جدیدترین', icon: 'ti ti-sparkles' },
  { value: 'price-low', label: 'ارزان‌ترین', icon: 'ti ti-sort-ascending' },
  { value: 'price-high', label: 'گران‌ترین', icon: 'ti ti-sort-descending' },
  { value: 'rating', label: 'بالاترین امتیاز', icon: 'ti ti-star' },
  { value: 'popular', label: 'پرفروش‌ترین', icon: 'ti ti-flame' },
]

// Filtered Products
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(query))
  }

  // Category
  if (selectedCategory.value) {
    result = result.filter(p => p.category.id === selectedCategory.value)
  }

  // Price range
  if (priceMin.value) {
    result = result.filter(p => p.price >= priceMin.value)
  }
  if (priceMax.value) {
    result = result.filter(p => p.price <= priceMax.value)
  }

  // Discount
  if (filterDiscount.value) {
    result = result.filter(p => p.discount)
  }

  // Rating
  if (filterRating.value) {
    result = result.filter(p => p.rating >= filterRating.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'popular':
      result.sort((a, b) => b.reviews - a.reviews) // توجه کنید: در دیتای شما reviewCount بود، اینجا reviews بررسی شود
      break
  }

  return result
})

// Cart Total (محاسبه محلی برای نمایش سریع، هرچند useCart هم دارد)
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// --- تابع اصلاح شده افزودن به سبد ---
const addToCart = (product) => {
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

  addItemToCart({
    productId: product.id, // مهم: برای پشتیبانی از ورینت‌ها
    id: product.id,       // برای سازگاری با قدیم
    name: product.name,
    price: product.price,
    quantity:1,
    originalPrice: product.originalPrice,
    image: product.image, // اضافه کردن تصویر
    category: product.category?.name,
    shopId: product.seller?.id,
    shopName: product.seller?.name,
    variantId: null // چون در لیست محصولات ورینتی انتخاب نشده، نال است
  })

  showToastMessage('محصول به سبد خرید اضافه شد')
}

// توابع مدیریت سبد خرید (کاهش/افزایش/حذف)
// این توابع باید مستقیماً از useCart صدا زده شوند، نه اینکه اینجا دوباره تعریف شوند.
// اما چون در تمپلیت شما اینجا تعریف شده‌اند، آن‌ها را به useCart متصل می‌کنیم:

const removeFromCart = (uniqueId) => {
  // استفاده از تابع موجود در useCart
  // توجه: در useCart جدید پارامتر ورودی uniqueId (یا id) است
  const { removeFromCart: remove } = useCart()
  remove(uniqueId)
}

const increaseQuantity = (uniqueId) => {
  const { increaseQuantity: inc } = useCart()
  inc(uniqueId)
}

const decreaseQuantity = (uniqueId) => {
  const { decreaseQuantity: dec } = useCart()
  dec(uniqueId)
}

// Favorites
const toggleFavorite = async (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (product) {
    product.isFavorite = !product.isFavorite
    // فراخوانی اکشن استور
    await productStore.toggleLike(productId, product.isFavorite);
    showToastMessage(product.isFavorite ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد')
  }
}

// Reset filters
const resetFilters = () => {
  priceMin.value = null
  priceMax.value = null
  filterDiscount.value = false
  filterRating.value = null
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

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Fetch Data
onMounted(() => {
  productStore.fetchProducts()
})
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
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
/* در فایل CSS اصلی */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
