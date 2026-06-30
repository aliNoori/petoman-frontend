<template>
  <div class="space-y-6">
    <!-- Product Search - Direct Like Digikala -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <i class="ti ti-search text-2xl text-white"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">جستجوی محصول</h3>
          <p class="text-sm text-gray-600">نام محصول را جستجو کنید تا آن را اضافه کنید</p>
        </div>
      </div>

      <div class="relative mb-4">
        <input
          v-model="searchKeyword"
          @input="handleSearch"
          type="text"
          placeholder="نام محصول را جستجو کنید... (مثال: کنسرو گورمت، رویال کنین)"
          class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
        />
        <i class="ti ti-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <div v-if="isSearching" class="absolute left-4 top-1/2 -translate-y-1/2">
          <i class="ti ti-loader animate-spin text-gray-400"></i>
        </div>
      </div>

      <!-- Search hint -->
      <div v-if="searchKeyword.length < 3 && searchKeyword.length > 0" class="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
        <div class="flex items-center gap-2 text-amber-700 text-sm">
          <i class="ti ti-info-circle"></i>
          <span>حداقل 3 حرف برای جستجو تایپ کنید</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching && searchKeyword.length >= 3" class="text-center py-12">
        <i class="ti ti-loader animate-spin text-4xl text-gray-400 mb-2"></i>
        <p class="text-sm text-gray-500">در حال جستجو...</p>
      </div>

      <!-- Initial State - Show Available Products -->
      <div v-else-if="searchKeyword.length === 0">
        <!-- Available Products List -->
        <div v-if="availableProducts.length > 0" class="space-y-3">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-sm font-bold text-gray-700">
              <i class="ti ti-package text-teal-600"></i>
              <span>{{ allProducts.length }} محصول موجود در سیستم</span>
            </div>
            <button
              @click="handleCreateProduct"
              class="px-4 py-2 bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-bold transition-all inline-flex items-center gap-2 text-sm"
            >
              <i class="ti ti-plus"></i>
              ایجاد محصول جدید
            </button>
          </div>
          
          <div 
            v-for="product in availableProducts" 
            :key="product.id"
            class="group p-4 bg-gray-50 hover:bg-teal-50 border-2 border-gray-200 hover:border-teal-500 rounded-xl transition-all"
          >
            <div class="flex items-start gap-4">
              <!-- Image -->
              <div class="w-16 h-16 rounded-lg bg-white flex-shrink-0 overflow-hidden border border-gray-200">
                <img 
                  v-if="product.mainImage"
                  :src="product.mainImage"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="ti ti-package text-2xl text-gray-300"></i>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-900 mb-1 line-clamp-1">
                  {{ product.name }}
                </h4>
                <p class="text-xs text-gray-500 mb-1">
                  کد: {{ product.code }}
                </p>
                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                    <i class="ti ti-category-2"></i>
                    {{ product.category }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <i class="ti ti-coins"></i>
                    قیمت پیشنهادی: {{ formatPrice(product.suggestedPrice) }} تومان
                  </span>
                </div>
              </div>

              <!-- Action -->
              <button
                @click="$emit('attach-product', product)"
                class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold transition-all"
              >
                <i class="ti ti-link ml-1"></i>
                من هم دارم
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevron-right"></i>
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                class="px-3 py-2 border-2 rounded-lg transition-colors font-bold"
                :class="currentPage === page ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-200 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevron-left"></i>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-package-off text-4xl text-blue-400"></i>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">هنوز محصولی در سیستم نیست</h4>
          <p class="text-sm text-gray-600 mb-4">
            اولین محصول را ایجاد کنید
          </p>
          <button
            @click="handleCreateProduct"
            class="px-6 py-3 bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            ایجاد اولین محصول
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-else-if="hasSearched && searchKeyword.length >= 3">
        <!-- Found Products -->
        <div v-if="searchResults.length > 0" class="space-y-3 mt-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-sm font-bold text-gray-700">
              <i class="ti ti-package text-teal-600"></i>
              <span>{{ searchResults.length }} محصول مشابه یافت شد</span>
            </div>
            <button
              @click="handleCreateProduct"
              class="px-4 py-2 bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-bold transition-all inline-flex items-center gap-2 text-sm"
            >
              <i class="ti ti-plus"></i>
              ایجاد محصول جدید
            </button>
          </div>
          
          <div 
            v-for="product in searchResults" 
            :key="product.id"
            class="group p-4 bg-gray-50 hover:bg-teal-50 border-2 border-gray-200 hover:border-teal-500 rounded-xl transition-all"
          >
            <div class="flex items-start gap-4">
              <!-- Image -->
              <div class="w-16 h-16 rounded-lg bg-white flex-shrink-0 overflow-hidden border border-gray-200">
                <img 
                  v-if="product.mainImage" 
                  :src="product.mainImage" 
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="ti ti-package text-2xl text-gray-300"></i>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-900 mb-1 line-clamp-1">
                  {{ product.name }}
                </h4>
                <p class="text-xs text-gray-500 mb-1">
                  کد: {{ product.code }}
                </p>
                <p v-if="product.category" class="text-xs text-gray-400 mb-2 line-clamp-1">
                  <i class="ti ti-category-2"></i>
                  {{ product.category }}
                </p>
                <div class="flex items-center gap-3 flex-wrap">
                  <span v-if="product.sellerCount" class="text-xs text-gray-600">
                    <i class="ti ti-users text-teal-600"></i>
                    {{ product.sellerCount }} فروشنده
                  </span>
                  <span v-if="product.avgPrice" class="text-xs font-bold text-teal-600">
                    از {{ product.avgPrice.toLocaleString() }} تومان
                  </span>
                  <span v-if="product.gallery?.length" class="text-xs text-blue-600">
                    <i class="ti ti-photo"></i>
                    {{ product.gallery.length + 1 }} عکس
                  </span>
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="handleAttachProduct(product)"
                class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-bold transition-all flex-shrink-0"
              >
                <i class="ti ti-link ml-1"></i>
                من هم دارم
              </button>
            </div>
          </div>

          <!-- Info Message -->
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div class="flex items-start gap-2 text-sm text-blue-700">
              <i class="ti ti-info-circle text-lg flex-shrink-0"></i>
              <p>
                محصول مدنظر خود را پیدا نکردید؟ می‌توانید با کلیک بر روی دکمه "ایجاد محصول جدید" آن را به سیستم اضافه کنید.
              </p>
            </div>
          </div>
        </div>

        <!-- No Results - Create New Product -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-package-off text-4xl text-orange-600"></i>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">محصولی یافت نشد</h4>
          <p class="text-sm text-gray-600 mb-4">
            محصول "<span class="font-bold text-teal-600">{{ searchKeyword }}</span>" در سیستم ثبت نشده است
          </p>
          <button
            @click="handleCreateProduct"
            class="px-6 py-3 bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
          >
            <i class="ti ti-plus text-xl"></i>
            ایجاد محصول جدید
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Types
interface Product {
  id: number
  name: string
  code: string
  category?: string
  categoryId?: string
  mainImage?: string
  gallery?: string[]
  sellerCount?: number
  suggestedPrice: number
  avgPrice?: number
  description?: string
  specifications?: Record<string, any>
}

// Emits
const emit = defineEmits<{
  'attach-product': [product: Product]
  'create-product': [categoryId: number | null, keyword: string]
}>()

// State
const isSearching = ref(false)
const hasSearched = ref(false)
const searchKeyword = ref('')
const searchResults = ref<Product[]>([])
const allProducts = ref<Product[]>([])
const availableProducts = ref<Product[]>([])
const currentPage = ref(1)
const perPage = 10
const isCreatingMode = ref(false) // حالت ایجاد محصول - جلوی re-search رو می‌گیره
let searchTimeout: NodeJS.Timeout | null = null

// Pagination computed
const totalPages = computed(() => Math.ceil(allProducts.value.length / perPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return allProducts.value.slice(start, end)
})

// Load available products on mount
const loadAvailableProducts = async () => {
  try {
    // TODO: باید از API مخصوص محصولات استفاده کنیم
    // const response = await $fetch<Product[]>('/api/products')
    
    // فعلا داده تستی - 15 محصول
    allProducts.value = [
      {
        id: 1,
        name: 'غذای خشک سگ رویال کنین Adult 15kg',
        code: 'PRD-RC-DOG-15',
        category: 'پت شاپ › غذا › غذای سگ › غذای خشک',
        categoryId: 'dog-dry',
        suggestedPrice: 3500000,
        avgPrice: 3450000,
        sellerCount: 5,
        mainImage: null,
        description: 'غذای خشک مخصوص سگ بالغ نژاد متوسط'
      },
      {
        id: 2,
        name: 'کنسرو گربه شبا طعم تن ماهی 85g',
        code: 'PRD-SHEBA-CAT-85',
        category: 'پت شاپ › غذا › غذای گربه › کنسرو',
        categoryId: 'cat-canned',
        suggestedPrice: 45000,
        avgPrice: 42000,
        sellerCount: 12,
        mainImage: null,
        description: 'کنسرو ماکیان با طعم تن ماهی'
      },
      {
        id: 3,
        name: 'خاک گربه بنتونیت Ever Clean 10kg',
        code: 'PRD-EC-LIT-10',
        category: 'پت شاپ › لوازم › گربه › خاک گربه',
        categoryId: 'cat-litter',
        suggestedPrice: 320000,
        avgPrice: 310000,
        sellerCount: 8,
        mainImage: null,
        description: 'خاک گربه کلوخه شونده با رایحه لاوندر'
      },
      {
        id: 4,
        name: 'غذای خشک گربه پرشین Royal Canin 2kg',
        code: 'PRD-RC-PER-2',
        category: 'پت شاپ › غذا › غذای گربه › غذای خشک',
        categoryId: 'cat-dry',
        suggestedPrice: 850000,
        avgPrice: 830000,
        sellerCount: 6,
        mainImage: null,
        description: 'غذای خشک مخصوص گربه پرشین'
      },
      {
        id: 5,
        name: 'قلاده چرمی سگ Hunter سایز M',
        code: 'PRD-HUN-COL-M',
        category: 'پت شاپ › لوازم › سگ › قلاده و بند',
        categoryId: 'dog-collar',
        suggestedPrice: 180000,
        avgPrice: 175000,
        sellerCount: 10,
        mainImage: null,
        description: 'قلاده چرم طبیعی با دوخت دستی'
      },
      {
        id: 6,
        name: 'اسکرچر گربه طرح موش Trixie',
        code: 'PRD-TRI-SCR-01',
        category: 'پت شاپ › لوازم › گربه › اسکرچر و اسباب بازی',
        categoryId: 'cat-scratch',
        suggestedPrice: 250000,
        avgPrice: 240000,
        sellerCount: 7,
        mainImage: null,
        description: 'اسکرچر با پوشش سیزال طبیعی'
      },
      {
        id: 7,
        name: 'غذای مرطوب سگ Pedigree 100g - بسته 12 عددی',
        code: 'PRD-PED-WET-100',
        category: 'پت شاپ › غذا › غذای سگ › غذای مرطوب',
        categoryId: 'dog-wet',
        suggestedPrice: 280000,
        avgPrice: 270000,
        sellerCount: 15,
        mainImage: null,
        description: 'غذای مرطوب با طعم گوشت و سبزیجات'
      },
      {
        id: 8,
        name: 'دانه مخلوط قناری Vitakraft 1kg',
        code: 'PRD-VIT-BIR-1',
        category: 'پت شاپ › غذا › غذای پرنده › دانه',
        categoryId: 'bird-seed',
        suggestedPrice: 95000,
        avgPrice: 90000,
        sellerCount: 9,
        mainImage: null,
        description: 'مخلوط دانه‌های مغذی برای قناری'
      },
      {
        id: 9,
        name: 'استخوان تشویقی سگ Dentastix 7 عددی',
        code: 'PRD-DEN-TRE-7',
        category: 'پت شاپ › غذا › غذای سگ › تشویقی',
        categoryId: 'dog-treat',
        suggestedPrice: 125000,
        avgPrice: 120000,
        sellerCount: 20,
        mainImage: null,
        description: 'استخوان جویدنی برای سلامت دندان'
      },
      {
        id: 10,
        name: 'پته گربه Gourmet Gold 85g',
        code: 'PRD-GOU-PAT-85',
        category: 'پت شاپ › غذا › غذای گربه › پته',
        categoryId: 'cat-pate',
        suggestedPrice: 38000,
        avgPrice: 35000,
        sellerCount: 18,
        mainImage: null,
        description: 'پته لوکس با طعم مرغ'
      },
      {
        id: 11,
        name: 'ظرف غذای دوقلو استیل ضد زنگ',
        code: 'PRD-STE-BOW-2',
        category: 'پت شاپ › لوازم › گربه › ظرف غذا و آب',
        categoryId: 'cat-bowl',
        suggestedPrice: 95000,
        avgPrice: 90000,
        sellerCount: 14,
        mainImage: null,
        description: 'ظرف استیل دوتایی با پایه ضد لغزش'
      },
      {
        id: 12,
        name: 'غذای ورقه‌ای ماهی TetraMin 100ml',
        code: 'PRD-TET-FLA-100',
        category: 'پت شاپ › غذا › غذای ماهی › ورقه‌ای',
        categoryId: 'fish-flake',
        suggestedPrice: 85000,
        avgPrice: 80000,
        sellerCount: 11,
        mainImage: null,
        description: 'غذای ورقه‌ای برای ماهی‌های زینتی'
      },
      {
        id: 13,
        name: 'مکمل اولترا اویل گربه 100ml',
        code: 'PRD-ULT-SUP-100',
        category: 'پت شاپ › غذا › غذای گربه › مکمل',
        categoryId: 'cat-supplement',
        suggestedPrice: 180000,
        avgPrice: 175000,
        sellerCount: 6,
        mainImage: null,
        description: 'مکمل روغنی برای سلامت پوست و مو'
      },
      {
        id: 14,
        name: 'خانه گربه چوبی طبقاتی Cat Tree',
        code: 'PRD-CAT-HOU-01',
        category: 'پت شاپ › لوازم › گربه › اسکرچر و اسباب بازی',
        categoryId: 'cat-scratch',
        suggestedPrice: 1200000,
        avgPrice: 1150000,
        sellerCount: 4,
        mainImage: null,
        description: 'خانه و اسکرچر سه طبقه'
      },
      {
        id: 15,
        name: 'بند قابل تنظیم سگ نایلونی 2 متری',
        code: 'PRD-LEA-NYL-2',
        category: 'پت شاپ › لوازم › سگ › قلاده و بند',
        categoryId: 'dog-collar',
        suggestedPrice: 85000,
        avgPrice: 80000,
        sellerCount: 16,
        mainImage: null,
        description: 'بند نایلونی قابل تنظیم با قفل ایمنی'
      }
    ]
    
    // Set first page products
    availableProducts.value = paginatedProducts.value
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

// Watch pagination changes
watch(currentPage, () => {
  availableProducts.value = paginatedProducts.value
})

// Initialize
loadAvailableProducts()

// Methods
const handleSearch = () => {
  // اگه در حال ایجاد محصولی، جستجو نکن
  if (isCreatingMode.value) {
    return
  }

  if (searchKeyword.value.length < 3) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    searchProducts()
  }, 400)
}

const handleCreateProduct = () => {
  // فعال کردن حالت Create تا جستجوی مجدد نشه
  isCreatingMode.value = true
  emit('create-product', null, searchKeyword.value)
}

const handleAttachProduct = (product: Product) => {
  // فعال کردن حالت Attach
  isCreatingMode.value = true
  emit('attach-product', product)
}

const searchProducts = async () => {
  isSearching.value = true
  
  try {
    const params = new URLSearchParams({
      q: searchKeyword.value,
      categoryId: '' // بدون دسته‌بندی - جستجو در همه
    })
    
    console.log('🔍 Searching with params:', {
      keyword: searchKeyword.value,
      url: `/api/products/search?${params}`
    })
    
    const response = await $fetch<Product[]>(`/api/products/search?${params}`)
    searchResults.value = response
    
    console.log('✅ Search response:', response.length, 'products')
    
    hasSearched.value = true
    
  } catch (error) {
    console.error('❌ Search failed:', error)
    searchResults.value = []
    hasSearched.value = true
  } finally {
    isSearching.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
