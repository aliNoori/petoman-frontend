<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i class="ti ti-pill text-2xl text-white"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">داروهای موجود</h3>
            <p class="text-sm text-gray-500">برای افزودن، از بخش جستجوی بالا استفاده کنید</p>
          </div>
        </div>
        <button
          @click="$emit('add-new')"
          class="px-4 py-2 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-bold transition-all inline-flex items-center gap-2"
        >
          <i class="ti ti-plus"></i>
          افزودن دارو جدید
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-pill text-xl text-blue-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کل داروها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-circle-check text-xl text-green-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">فعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-circle-x text-xl text-amber-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">غیرفعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.inactive }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Medicines List -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <i class="ti ti-loader animate-spin text-4xl text-gray-400 mb-2"></i>
        <p class="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="medicines.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-pill-off text-4xl text-purple-500"></i>
        </div>
        <h4 class="font-bold text-gray-900 mb-2">هنوز داروی اضافه نکرده‌اید</h4>
        <p class="text-sm text-gray-600 mb-4">
          برای شروع فروش، داروهای خود را به داروخانه اضافه کنید
        </p>
        <button
          @click="$emit('add-new')"
          class="px-6 py-3 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
        >
          <i class="ti ti-plus text-xl"></i>
          افزودن اولین دارو
        </button>
      </div>

      <!-- Medicines Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">دارو</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">کد</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">دسته‌بندی</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">قیمت</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">موجودی</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">وضعیت</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="medicine in paginatedMedicines"
              :key="medicine.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Medicine Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img
                      v-if="medicine.mainImage"
                      :src="medicine.mainImage"
                      :alt="medicine.name"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="ti ti-pill text-xl text-purple-400 flex items-center justify-center h-full"></i>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 truncate">{{ medicine.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ medicine.description || 'بدون توضیحات' }}</p>
                  </div>
                </div>
              </td>

              <!-- Code -->
              <td class="px-6 py-4">
                <span class="text-sm font-mono text-gray-600">{{ medicine.code }}</span>
              </td>

              <!-- Category -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ getCategoryName(medicine.categoryId) }}</span>
              </td>

              <!-- Price -->
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-900">{{ formatPrice(medicine.price) }} تومان</span>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4">
                <span
                  class="text-sm font-bold"
                  :class="medicine.stock > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ medicine.stock || 0 }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold"
                  :class="medicine.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ medicine.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="$emit('edit', medicine)"
                    class="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                  >
                    <i class="ti ti-edit text-blue-600"></i>
                  </button>
                  <button
                    @click="$emit('delete', medicine)"
                    class="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <i class="ti ti-trash text-red-600"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          نمایش {{ startIndex + 1 }} تا {{ endIndex }} از {{ medicines.length }} دارو
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <i class="ti ti-chevron-right"></i>
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import medicineCategories from '@/data/medicine-categories.json'

const emit = defineEmits(['add-new', 'edit', 'delete'])

// تابع برای پیدا کردن نام دسته بندی از ID
const getCategoryName = (categoryId) => {
  // جستجو در سطح اول
  for (const mainCat of medicineCategories.categories) {
    if (mainCat.id === categoryId) {
      return mainCat.name
    }
    
    // جستجو در سطح دوم
    if (mainCat.children) {
      for (const subCat of mainCat.children) {
        if (subCat.id === categoryId) {
          return `${mainCat.name} › ${subCat.name}`
        }
        
        // جستجو در سطح سوم
        if (subCat.children) {
          for (const subSubCat of subCat.children) {
            if (subSubCat.id === categoryId) {
              return `${mainCat.name} › ${subCat.name} › ${subSubCat.name}`
            }
          }
        }
      }
    }
  }
  return 'نامشخص'
}

// State
const loading = ref(true)
const medicines = ref([])
const currentPage = ref(1)
const perPage = 10

// Computed
const stats = computed(() => ({
  total: medicines.value.length,
  active: medicines.value.filter(m => m.isActive).length,
  inactive: medicines.value.filter(m => !m.isActive).length
}))

const totalPages = computed(() => Math.ceil(medicines.value.length / perPage))

const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, medicines.value.length))

const paginatedMedicines = computed(() => {
  return medicines.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const loadMedicines = async () => {
  loading.value = true
  try {
    // TODO: فراخوانی API برای دریافت داروها
    // const response = await $fetch('/api/pharmacy/medicines')
    // medicines.value = response
    
    // فعلا داده تستی با دسته‌بندی‌های دارویی واقعی
    medicines.value = [
      {
        id: 1,
        code: 'MED-DOG-001',
        name: 'آموکسی‌سیلین 250mg',
        description: 'آنتی‌بیوتیک گروه پنی‌سیلین',
        categoryId: 10101, // آنتی‌بیوتیک‌ها › پنی‌سیلین‌ها › آموکسی‌سیلین
        price: 250000,
        stock: 15,
        mainImage: null,
        isActive: true,
        prescriptionRequired: true
      },
      {
        id: 2,
        code: 'MED-CAT-002',
        name: 'فنبندازول سوسپانسیون',
        description: 'ضد انگل داخلی طیف وسیع',
        categoryId: 20101, // ضد انگل‌ها › ضد انگل داخلی › فنبندازول
        price: 180000,
        stock: 8,
        mainImage: null,
        isActive: true,
        prescriptionRequired: false
      },
      {
        id: 3,
        code: 'VAC-CAT-001',
        name: 'واکسن سه‌گانه گربه',
        description: 'محافظت در برابر پانلوکوپنیا، کالیسی، رینوتراکیت',
        categoryId: 30101, // واکسن‌ها › واکسن گربه › واکسن سه‌گانه گربه
        price: 500000,
        stock: 0,
        mainImage: null,
        isActive: false,
        prescriptionRequired: true
      },
      {
        id: 4,
        code: 'MED-DOG-004',
        name: 'ملوکسیکام 5mg/ml',
        description: 'ضد التهاب غیر استروئیدی',
        categoryId: 40101, // ضد التهاب‌ها › NSAIDs › ملوکسیکام
        price: 320000,
        stock: 12,
        mainImage: null,
        isActive: true,
        prescriptionRequired: true
      },
      {
        id: 5,
        code: 'VIT-ALL-001',
        name: 'ویتامین B کمپلکس',
        description: 'مکمل ویتامین‌های گروه B',
        categoryId: 50201, // ویتامین‌ها › ویتامین‌های محلول در آب › ویتامین B کمپلکس
        price: 150000,
        stock: 25,
        mainImage: null,
        isActive: true,
        prescriptionRequired: false
      },
      {
        id: 6,
        code: 'VAC-DOG-002',
        name: 'واکسن هفت‌گانه سگ',
        description: 'محافظت کامل سگ در برابر بیماری‌های مهلک',
        categoryId: 30201, // واکسن‌ها › واکسن سگ › واکسن هفت‌گانه سگ
        price: 600000,
        stock: 5,
        mainImage: null,
        isActive: true,
        prescriptionRequired: true
      },
      {
        id: 7,
        code: 'MED-CAT-005',
        name: 'قطره آنتی‌بیوتیک چشمی',
        description: 'درمان عفونت‌های چشمی',
        categoryId: 110101, // چشم و گوش › داروهای چشمی › قطره آنتی‌بیوتیک چشمی
        price: 120000,
        stock: 20,
        mainImage: null,
        isActive: true,
        prescriptionRequired: true
      },
      {
        id: 8,
        code: 'MED-DOG-006',
        name: 'شامپو ضد قارچ',
        description: 'شامپوی درمانی برای عفونت‌های قارچی پوست',
        categoryId: 120201, // پوستی › شامپوهای درمانی › شامپو ضد قارچ
        price: 95000,
        stock: 30,
        mainImage: null,
        isActive: true,
        prescriptionRequired: false
      }
    ]
  } catch (error) {
    console.error('Error loading medicines:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadMedicines()
})
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
