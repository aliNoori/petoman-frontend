<template>
  <div class="space-y-6">
    <!-- Medicine Search -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <i class="ti ti-medical-cross text-2xl text-white"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">جستجوی دارو</h3>
          <p class="text-sm text-gray-600">نام دارو را جستجو کنید تا آن را اضافه کنید</p>
        </div>
      </div>

      <div class="relative mb-4">
        <input
          v-model="searchKeyword"
          @input="handleSearch"
          type="text"
          placeholder="جستجوی دارو... (مثال: آنتی بیوتیک، واکسن، ضد انگل)"
          class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
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

      <!-- Initial State - Show Available Medicines -->
      <div v-else-if="searchKeyword.length === 0">
        <!-- Available Medicines List -->
        <div v-if="availableMedicines.length > 0" class="space-y-3">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-sm font-bold text-gray-700">
              <i class="ti ti-pill text-purple-600"></i>
              <span>{{ allMedicines.length }} دارو موجود در سیستم</span>
            </div>
            <button
              @click="handleCreateMedicine"
              class="px-4 py-2 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-bold transition-all inline-flex items-center gap-2 text-sm"
            >
              <i class="ti ti-plus"></i>
              ایجاد دارو جدید
            </button>
          </div>
          
          <div 
            v-for="medicine in availableMedicines" 
            :key="medicine.id"
            class="group p-4 bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all"
          >
            <div class="flex items-start gap-4">
              <!-- Image -->
              <div class="w-16 h-16 rounded-lg bg-white flex-shrink-0 overflow-hidden border border-gray-200">
                <img 
                  v-if="medicine.mainImage" 
                  :src="medicine.mainImage" 
                  :alt="medicine.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <i class="ti ti-pill text-2xl text-purple-400"></i>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-900 mb-1 line-clamp-1">
                  {{ medicine.name }}
                </h4>
                <p class="text-xs text-gray-500 mb-1">
                  کد: {{ medicine.code }}
                </p>
                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                    <i class="ti ti-category-2"></i>
                    {{ medicine.category }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <i class="ti ti-coins"></i>
                    قیمت پیشنهادی: {{ formatPrice(medicine.suggestedPrice) }} تومان
                  </span>
                </div>
              </div>

              <!-- Action -->
              <button
                @click="$emit('attach-medicine', medicine)"
                class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all"
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
                :class="currentPage === page ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-200 hover:bg-gray-50'"
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
          <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-pill-off text-4xl text-purple-400"></i>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">هنوز دارویی در سیستم نیست</h4>
          <p class="text-sm text-gray-600 mb-4">
            اولین دارو را ایجاد کنید
          </p>
          <button
            @click="handleCreateMedicine"
            class="px-6 py-3 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
          >
            <i class="ti ti-plus"></i>
            ایجاد اولین دارو
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-else-if="hasSearched && searchKeyword.length >= 3">
        <!-- Found Medicines -->
        <div v-if="searchResults.length > 0" class="space-y-3 mt-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-sm font-bold text-gray-700">
              <i class="ti ti-pill text-purple-600"></i>
              <span>{{ searchResults.length }} دارو مشابه یافت شد</span>
            </div>
            <button
              @click="handleCreateMedicine"
              class="px-4 py-2 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-bold transition-all inline-flex items-center gap-2 text-sm"
            >
              <i class="ti ti-plus"></i>
              ایجاد دارو جدید
            </button>
          </div>
          
          <div 
            v-for="medicine in searchResults" 
            :key="medicine.id"
            class="group p-4 bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all"
          >
            <div class="flex items-start gap-4">
              <!-- Image -->
              <div class="w-16 h-16 rounded-lg bg-white flex-shrink-0 overflow-hidden border border-gray-200">
                <img 
                  v-if="medicine.mainImage" 
                  :src="medicine.mainImage" 
                  :alt="medicine.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <i class="ti ti-pill text-2xl text-purple-400"></i>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-900 mb-1 line-clamp-1">
                  {{ medicine.name }}
                </h4>
                <p class="text-xs text-gray-500 mb-1">
                  کد: {{ medicine.code }}
                </p>
                <p v-if="medicine.category" class="text-xs text-gray-400 mb-2 line-clamp-1">
                  <i class="ti ti-category-2"></i>
                  {{ medicine.category }}
                </p>
                <div class="flex items-center gap-3 flex-wrap">
                  <span v-if="medicine.sellerCount" class="text-xs text-gray-600">
                    <i class="ti ti-users text-purple-600"></i>
                    {{ medicine.sellerCount }} فروشنده
                  </span>
                  <span v-if="medicine.avgPrice" class="text-xs font-bold text-purple-600">
                    از {{ medicine.avgPrice.toLocaleString() }} تومان
                  </span>
                  <span v-if="medicine.gallery?.length" class="text-xs text-blue-600">
                    <i class="ti ti-photo"></i>
                    {{ medicine.gallery.length + 1 }} عکس
                  </span>
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="handleAttachMedicine(medicine)"
                class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-bold transition-all flex-shrink-0"
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
                دارو مدنظر خود را پیدا نکردید؟ می‌توانید با کلیک بر روی دکمه "ایجاد دارو جدید" آن را به سیستم اضافه کنید.
              </p>
            </div>
          </div>
        </div>

        <!-- No Results - Create New Medicine -->
        <div v-else class="text-center py-12">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-pill-off text-4xl text-purple-600"></i>
          </div>
          <h4 class="font-bold text-gray-900 mb-2">داروی یافت نشد</h4>
          <p class="text-sm text-gray-600 mb-4">
            دارو "<span class="font-bold text-purple-600">{{ searchKeyword }}</span>" در سیستم ثبت نشده است
          </p>
          <button
            @click="handleCreateMedicine"
            class="px-6 py-3 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
          >
            <i class="ti ti-plus text-xl"></i>
            ایجاد دارو جدید
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
interface Medicine {
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
  'attach-medicine': [medicine: Medicine]
  'create-medicine': [categoryId: number | null, keyword: string]
}>()

// State
const isSearching = ref(false)
const hasSearched = ref(false)
const searchKeyword = ref('')
const searchResults = ref<Medicine[]>([])
const allMedicines = ref<Medicine[]>([])
const availableMedicines = ref<Medicine[]>([])
const currentPage = ref(1)
const perPage = 10
const isCreatingMode = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

// Pagination computed
const totalPages = computed(() => Math.ceil(allMedicines.value.length / perPage))
const paginatedMedicines = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return allMedicines.value.slice(start, end)
})

// Load available medicines on mount
const loadAvailableMedicines = async () => {
  try {
    // TODO: باید از API مخصوص دارو استفاده کنیم
    // const response = await $fetch<Medicine[]>('/api/medicines')
    
    // فعلا داده تستی - 15 دارو
    allMedicines.value = [
      {
        id: 1,
        name: 'آنتی بیوتیک آموکسی سیلین تزریقی 100ml',
        code: 'MED-AB-AMOX-100',
        category: 'آنتی‌بیوتیک‌ها › پنی‌سیلین‌ها › آموکسی‌سیلین',
        categoryId: '10101',
        suggestedPrice: 430000,
        avgPrice: 425000,
        sellerCount: 2,
        mainImage: null,
        description: 'آنتی‌بیوتیک گروه پنی‌سیلین - نیاز به نسخه'
      },
      {
        id: 2,
        name: 'فنبندازول سوسپانسیون 10% - 100ml',
        code: 'MED-AP-FEN-100',
        category: 'ضد انگل‌ها › ضد انگل داخلی › فنبندازول',
        categoryId: '20101',
        suggestedPrice: 180000,
        avgPrice: 175000,
        sellerCount: 5,
        mainImage: null,
        description: 'ضد انگل داخلی طیف وسیع'
      },
      {
        id: 3,
        name: 'واکسن سه‌گانه گربه - ویال 1ml',
        code: 'VAC-CAT-TRI-1',
        category: 'واکسن‌ها › واکسن گربه › واکسن سه‌گانه گربه',
        categoryId: '30101',
        suggestedPrice: 500000,
        avgPrice: 490000,
        sellerCount: 8,
        mainImage: null,
        description: 'محافظت در برابر پانلوکوپنیا، کالیسی، رینوتراکیت'
      },
      {
        id: 4,
        name: 'ملوکسیکام 5mg/ml تزریقی - 20ml',
        code: 'MED-AI-MEL-20',
        category: 'ضد التهاب‌ها › NSAIDs › ملوکسیکام',
        categoryId: '40101',
        suggestedPrice: 320000,
        avgPrice: 315000,
        sellerCount: 4,
        mainImage: null,
        description: 'ضد التهاب غیر استروئیدی - نیاز به نسخه'
      },
      {
        id: 5,
        name: 'ویتامین B کمپلکس تزریقی - 50ml',
        code: 'VIT-BC-INJ-50',
        category: 'ویتامین‌ها › ویتامین‌های محلول در آب › ویتامین B کمپلکس',
        categoryId: '50201',
        suggestedPrice: 150000,
        avgPrice: 145000,
        sellerCount: 7,
        mainImage: null,
        description: 'مکمل ویتامین‌های گروه B'
      },
      {
        id: 6,
        name: 'واکسن هفت‌گانه سگ - ویال 1ml',
        code: 'VAC-DOG-HEP-1',
        category: 'واکسن‌ها › واکسن سگ › واکسن هفت‌گانه سگ',
        categoryId: '30201',
        suggestedPrice: 600000,
        avgPrice: 580000,
        sellerCount: 6,
        mainImage: null,
        description: 'محافظت کامل سگ در برابر بیماری‌های مهلک'
      },
      {
        id: 7,
        name: 'سفالکسین کپسول 500mg - بسته 20 عددی',
        code: 'MED-AB-CEF-500',
        category: 'آنتی‌بیوتیک‌ها › سفالوسپورین‌ها › سفالکسین',
        categoryId: '10201',
        suggestedPrice: 280000,
        avgPrice: 270000,
        sellerCount: 9,
        mainImage: null,
        description: 'آنتی‌بیوتیک گروه سفالوسپورین - نیاز به نسخه'
      },
      {
        id: 8,
        name: 'ایورمکتین 1% تزریقی - 50ml',
        code: 'MED-AP-IVE-50',
        category: 'ضد انگل‌ها › ضد انگل داخلی › ایورمکتین',
        categoryId: '20104',
        suggestedPrice: 350000,
        avgPrice: 340000,
        sellerCount: 3,
        mainImage: null,
        description: 'ضد انگل داخلی و خارجی - نیاز به نسخه'
      },
      {
        id: 9,
        name: 'قطره آنتی‌بیوتیک چشمی - 10ml',
        code: 'MED-EYE-AB-10',
        category: 'چشم و گوش › داروهای چشمی › قطره آنتی‌بیوتیک چشمی',
        categoryId: '110101',
        suggestedPrice: 120000,
        avgPrice: 115000,
        sellerCount: 12,
        mainImage: null,
        description: 'درمان عفونت‌های چشمی'
      },
      {
        id: 10,
        name: 'دگزامتازون تزریقی 2mg/ml - 50ml',
        code: 'MED-AI-DEX-50',
        category: 'ضد التهاب‌ها › کورتیکواستروئیدها › دگزامتازون',
        categoryId: '40201',
        suggestedPrice: 200000,
        avgPrice: 195000,
        sellerCount: 5,
        mainImage: null,
        description: 'کورتیکواستروئید قوی - نیاز به نسخه'
      },
      {
        id: 11,
        name: 'شامپو ضد قارچ کتوکونازول 2% - 200ml',
        code: 'MED-SKN-SHP-200',
        category: 'پوستی › شامپوهای درمانی › شامپو ضد قارچ',
        categoryId: '120201',
        suggestedPrice: 95000,
        avgPrice: 90000,
        sellerCount: 15,
        mainImage: null,
        description: 'شامپوی درمانی ضد قارچ'
      },
      {
        id: 12,
        name: 'امپرازول کپسول 20mg - بسته 14 عددی',
        code: 'MED-GAS-OMP-20',
        category: 'گوارشی › ضد اسید › امپرازول',
        categoryId: '80101',
        suggestedPrice: 85000,
        avgPrice: 80000,
        sellerCount: 10,
        mainImage: null,
        description: 'درمان زخم معده و رفلاکس'
      },
      {
        id: 13,
        name: 'کلسیم تزریقی 10% - 100ml',
        code: 'SUP-CAL-INJ-100',
        category: 'ویتامین‌ها › مکمل‌های معدنی › کلسیم',
        categoryId: '50301',
        suggestedPrice: 130000,
        avgPrice: 125000,
        sellerCount: 6,
        mainImage: null,
        description: 'مکمل کلسیم تزریقی'
      },
      {
        id: 14,
        name: 'انروفلوکساسین 10% خوراکی - 100ml',
        code: 'MED-AB-ENR-100',
        category: 'آنتی‌بیوتیک‌ها › فلوروکینولون‌ها › انروفلوکساسین',
        categoryId: '10301',
        suggestedPrice: 380000,
        avgPrice: 370000,
        sellerCount: 7,
        mainImage: null,
        description: 'آنتی‌بیوتیک طیف وسیع - نیاز به نسخه'
      },
      {
        id: 15,
        name: 'پماد چشمی ترامایسین - 5g',
        code: 'MED-EYE-OIN-5',
        category: 'چشم و گوش › داروهای چشمی › پماد چشمی',
        categoryId: '110102',
        suggestedPrice: 75000,
        avgPrice: 70000,
        sellerCount: 8,
        mainImage: null,
        description: 'پماد آنتی‌بیوتیکی چشمی'
      }
    ]
    
    // Set first page medicines
    availableMedicines.value = paginatedMedicines.value
  } catch (error) {
    console.error('Error loading medicines:', error)
  }
}

// Watch pagination changes
watch(currentPage, () => {
  availableMedicines.value = paginatedMedicines.value
})

// Initialize
loadAvailableMedicines()

// Methods
const handleSearch = () => {
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
    searchMedicines()
  }, 400)
}

const handleCreateMedicine = () => {
  isCreatingMode.value = true
  emit('create-medicine', null, searchKeyword.value)
}

const handleAttachMedicine = (medicine: Medicine) => {
  isCreatingMode.value = true
  emit('attach-medicine', medicine)
}

const searchMedicines = async () => {
  isSearching.value = true
  
  try {
    const params = new URLSearchParams({
      q: searchKeyword.value,
      categoryId: '' // بدون دسته‌بندی - جستجو در همه
    })
    
    console.log('🔍 Searching medicines with params:', {
      keyword: searchKeyword.value,
      url: `/api/products/search?${params}`
    })
    
    // فعلا از همون API محصولات استفاده می‌کنیم
    // بعدا باید API مخصوص دارو بسازیم
    const response = await $fetch<Medicine[]>(`/api/products/search?${params}`)
    searchResults.value = response
    
    console.log('✅ Medicine search response:', response.length, 'medicines')
    
    hasSearched.value = true
    
  } catch (error) {
    console.error('❌ Medicine search failed:', error)
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
