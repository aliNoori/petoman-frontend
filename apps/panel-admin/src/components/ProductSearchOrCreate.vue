<template>
  <div class="space-y-6">
    <!-- Search Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
          <i class="ti ti-search text-xl sm:text-2xl text-white"></i>
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-bold text-gray-900">جستجوی محصول</h3>
          <p class="text-xs sm:text-sm text-gray-500">نام محصول را وارد کنید یا از لیست انتخاب نمایید</p>
        </div>
      </div>

      <!-- Input Area -->
      <div class="relative mb-4">
        <input
            v-model="searchKeyword"
            @input="handleSearch"
            type="text"
            placeholder="مثلاً: کنسرو گورمت، رویال کنین..."
            class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
        />

        <!-- Loading Spinner -->
        <div v-if="isSearching" class="absolute left-4 top-1/2 -translate-y-1/2">
          <i class="ti ti-loader animate-spin text-blue-600"></i>
        </div>

        <!-- Clear Button (Only if text exists and not searching) -->
        <button
            v-if="searchKeyword && !isSearching"
            @click="searchKeyword = ''; hasSearched = false"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="ti ti-x"></i>
        </button>

        <!-- Static Search Icon (Only if no text and not searching) -->
        <i v-if="!searchKeyword && !isSearching" class="ti ti-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      <!-- Hint Message -->
      <div v-if="searchKeyword.length > 0 && searchKeyword.length < 3" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p class="text-xs text-amber-700 flex items-center gap-2">
          <i class="ti ti-alert-circle"></i>
          لطفاً حداقل ۳ حرف تایپ کنید.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="flex flex-col items-center justify-center py-10">
        <i class="ti ti-loader animate-spin text-4xl text-gray-300 mb-3"></i>
        <p class="text-sm text-gray-500">در حال جستجو در پایگاه داده...</p>
      </div>

      <!-- Initial State (No Search) -->
      <div v-else-if="!hasSearched">
        <div v-if="availableProducts.length > 0" class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2 text-sm font-bold text-gray-700">
              <i class="ti ti-package text-teal-600"></i>
              <span>{{ availableProducts.length }} محصول موجود</span>
            </div>
            <button
                @click="handleCreateProduct"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-bold transition-all inline-flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
            >
              <i class="ti ti-plus"></i>
              محصول جدید
            </button>
          </div>

          <!-- Product List (Initial) -->
          <div v-for="product in availableProducts" :key="product.id" class="group relative p-3 sm:p-4 bg-white border border-gray-100 hover:border-teal-200 hover:shadow-md rounded-xl transition-all duration-200">
            <div class="flex gap-3 sm:gap-4">
              <!-- Image -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                <img v-if="product.image" :src="resolveUrl(product.image)" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <i class="ti ti-package text-2xl"></i>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">{{ product.name }}</h4>
                  <p class="text-xs text-gray-500 mb-2">کد: <span class="font-mono bg-gray-100 px-1 rounded">{{ product.code }}</span></p>

                  <div class="flex flex-wrap gap-1.5">
                    <span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] sm:text-xs rounded-md font-medium border border-blue-100">
                      {{ product.categoryBreadcrumb }}
                    </span>
<!--                    <span class="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] sm:text-xs rounded-md font-medium border border-teal-100">
                      {{ formatPrice(product.suggestedPrice) }} تومان
                    </span>-->
                  </div>
                </div>

                <!-- Action -->
                <button
                    @click="$emit('attach-product', product)"
                    class="mt-3 w-full sm:w-auto px-4 py-2 bg-teal-50 hover:bg-teal-500 text-teal-700 hover:text-white border border-teal-200 hover:border-teal-500 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <i class="ti ti-link"></i>
                  <span>من هم دارم</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination (Initial) -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100 overflow-x-auto pb-2">
            <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
              <i class="ti ti-chevron-right"></i>
            </button>

            <!-- Show fewer pages on mobile -->
            <div class="flex gap-1">
              <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors"
                  :class="currentPage === page ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </div>

            <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
              <i class="ti ti-chevron-left"></i>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-10">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="ti ti-package-off text-3xl text-gray-400"></i>
          </div>
          <h4 class="font-bold text-gray-800 mb-1">لیست محصولات خالی است</h4>
          <p class="text-sm text-gray-500 mb-4">برای شروع، اولین محصول را اضافه کنید</p>
          <button @click="handleCreateProduct" class="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-200">
            ایجاد اولین محصول
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-else-if="hasSearched && searchKeyword.length >= 3">
        <div v-if="searchResults.length > 0" class="space-y-3">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-bold text-gray-700">
              <i class="ti ti-search text-blue-500 ml-1"></i>
              {{ searchResults.length }} نتیجه برای "{{ searchKeyword }}"
            </p>
            <button @click="handleCreateProduct" class="text-xs text-orange-600 hover:text-orange-700 font-bold underline">
              این محصول در لیست نیست؟
            </button>
          </div>

          <div v-for="product in searchResults" :key="product.id" class="group p-3 sm:p-4 bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md rounded-xl transition-all">
            <div class="flex gap-3 sm:gap-4">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                <img v-if="product.image" :src="resolveUrl(product.image)" :alt="product.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <i class="ti ti-package text-xl"></i>
                </div>
              </div>

              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">{{ product.name }}</h4>
                  <div class="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span v-if="product.sellerCount"><i class="ti ti-users text-blue-500 ml-1"></i>{{ product.sellerCount }} فروشنده</span>
                    <span v-if="product.avgPrice"><i class="ti ti-tag text-blue-500 ml-1"></i>از {{ product.avgPrice.toLocaleString() }}</span>
                  </div>
                </div>

                <button
                    @click="handleAttachProduct(product)"
                    class="mt-2 w-full sm:w-auto self-start px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <i class="ti ti-plus"></i>
                  افزودن به محصولات
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-10">
          <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="ti ti-ghost text-3xl text-orange-400"></i>
          </div>
          <h4 class="font-bold text-gray-800 mb-1">محصولی یافت نشد</h4>
<!--          <p class="text-sm text-gray-500 mb-4">آیا می‌خواهید "<span class="font-bold text-gray-800">{{ searchKeyword }}</span>" را ثبت کنید؟</p>-->
          <button @click="handleCreateProduct" class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-200">
            ثبت محصول جدید
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {useMarketProductStore} from "@/stores/market/product.js";
import {usePharmacyProductStore} from "@/stores/pharmacy/product.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";
const {resolveUrl}=useUrlHelper()
// Emits
const emit = defineEmits(['attach-product', 'create-product'])
const props=defineProps({tenantType:String})
// State
const isSearching = ref(false)
const hasSearched = ref(false)
const searchKeyword = ref('')
const searchResults = ref([])
const allProducts = ref([])
const availableProducts = ref([])
const productMarketStore=useMarketProductStore()
const productPharmacyStore=usePharmacyProductStore()
const currentPage = ref(1)
const perPage = 10
const isCreatingMode = ref(false) // حالت ایجاد محصول - جلوی re-search رو می‌گیره
let searchTimeout = null

// Pagination computed
const totalPages = computed(() => Math.ceil(allProducts.value.length / perPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return allProducts.value.slice(start, end)
})

// Load available products on mount
const loadAvailableProducts = async () => {
  if(props.tenantType==='PHARMACY'){
    try {
      const fetchProducts=computed(()=>productPharmacyStore.globalProducts)
      if (fetchProducts) {
        allProducts.value = fetchProducts.value
        availableProducts.value = paginatedProducts.value
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }
  if(props.tenantType==='MARKET'){
    try {
      const fetchProducts=computed(()=>productMarketStore.globalProducts)
      if (fetchProducts) {
        allProducts.value = fetchProducts.value
        availableProducts.value = paginatedProducts.value
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
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

const handleAttachProduct = (product) => {
  // فعال کردن حالت Attach
  isCreatingMode.value = true
  emit('attach-product', product)
}

const searchProducts = async () => {
  isSearching.value = true
  
  try {
    // جستجو در لیست محصولات موجود
    const keyword = searchKeyword.value.toLowerCase()
    searchResults.value = allProducts.value.filter(product => 
      product.name.toLowerCase().includes(keyword) ||
      product.code.toLowerCase().includes(keyword) ||
      (product.category && product.category.toLowerCase().includes(keyword))
    )
    
    console.log('✅ Search results:', searchResults.value.length, 'products')
    
    hasSearched.value = true
    
  } catch (error) {
    console.error('❌ Search failed:', error)
    searchResults.value = []
    hasSearched.value = true
  } finally {
    isSearching.value = false
  }
}

const formatPrice = (price) => {
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
