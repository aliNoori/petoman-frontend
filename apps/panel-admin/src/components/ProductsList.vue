<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <i class="ti ti-package text-2xl text-white"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">محصولات موجود</h3>
            <p class="text-sm text-gray-500">برای افزودن، از بخش جستجوی بالا استفاده کنید</p>
          </div>
        </div>
        <button
          @click="$emit('add-new')"
          class="px-4 py-2 bg-gradient-to-l from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-bold transition-all inline-flex items-center gap-2"
        >
          <i class="ti ti-plus"></i>
          افزودن محصول جدید
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-package text-xl text-blue-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کل محصولات</p>
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

    <!-- Products List -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <i class="ti ti-loader animate-spin text-4xl text-gray-400 mb-2"></i>
        <p class="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-package-off text-4xl text-gray-400"></i>
        </div>
        <h4 class="font-bold text-gray-900 mb-2">هنوز محصولی اضافه نکرده‌اید</h4>
        <p class="text-sm text-gray-600 mb-4">
          برای شروع فروش، محصولات خود را به فروشگاه اضافه کنید
        </p>
        <button
          @click="$emit('add-new')"
          class="px-6 py-3 bg-gradient-to-l from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all inline-flex items-center gap-2"
        >
          <i class="ti ti-plus text-xl"></i>
          افزودن اولین محصول
        </button>
      </div>

      <!-- Products Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">محصول</th>
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
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Product Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                      v-if="product.mainImage"
                      :src="product.mainImage"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="ti ti-package text-xl text-gray-400 flex items-center justify-center h-full"></i>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 truncate">{{ product.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ product.description || 'بدون توضیحات' }}</p>
                  </div>
                </div>
              </td>

              <!-- Code -->
              <td class="px-6 py-4">
                <span class="text-sm font-mono text-gray-600">{{ product.code }}</span>
              </td>

              <!-- Category -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ getCategoryName(product.categoryId) }}</span>
              </td>

              <!-- Price -->
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-900">{{ formatPrice(product.price) }} تومان</span>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4">
                <span
                  class="text-sm font-bold"
                  :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ product.stock || 0 }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold"
                  :class="product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ product.isActive ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="$emit('edit', product)"
                    class="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                  >
                    <i class="ti ti-edit text-blue-600"></i>
                  </button>
                  <button
                    @click="$emit('delete', product)"
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
          نمایش {{ startIndex + 1 }} تا {{ endIndex }} از {{ products.length }} محصول
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import productCategories from '@/data/categories.json'

const emit = defineEmits(['add-new', 'edit', 'delete'])

// تابع برای پیدا کردن نام دسته بندی از ID
const getCategoryName = (categoryId) => {
  // جستجو در سطح اول (پت شاپ)
  for (const mainCat of productCategories.categories) {
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
            
            // جستجو در سطح چهارم
            if (subSubCat.children) {
              for (const subSubSubCat of subSubCat.children) {
                if (subSubSubCat.id === categoryId) {
                  return `${mainCat.name} › ${subCat.name} › ${subSubCat.name} › ${subSubSubCat.name}`
                }
              }
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
const products = ref([])
const currentPage = ref(1)
const perPage = 10

// Computed
const stats = computed(() => ({
  total: products.value.length,
  active: products.value.filter(p => p.isActive).length,
  inactive: products.value.filter(p => !p.isActive).length
}))

const totalPages = computed(() => Math.ceil(products.value.length / perPage))

const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, products.value.length))

const paginatedProducts = computed(() => {
  return products.value.slice(startIndex.value, endIndex.value)
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

const loadProducts = async () => {
  loading.value = true
  try {
    // TODO: فراخوانی API برای دریافت محصولات
    // const response = await $fetch('/api/pharmacy/products')
    // products.value = response
    
    // فعلا داده تستی با دسته‌بندی‌های پت شاپ واقعی
    products.value = [
      {
        id: 1,
        code: 'PRD-DOG-001',
        name: 'غذای خشک سگ رویال کنین',
        description: 'غذای خشک مخصوص سگ بالغ نژاد متوسط',
        categoryId: 'dog-dry', // پت شاپ › غذا › غذای سگ › غذای خشک
        price: 850000,
        stock: 12,
        mainImage: null,
        isActive: true
      },
      {
        id: 2,
        code: 'PRD-CAT-002',
        name: 'کنسرو گربه شبا',
        description: 'کنسرو ماکیان با طعم تن ماهی',
        categoryId: 'cat-canned', // پت شاپ › غذا › غذای گربه › کنسرو
        price: 45000,
        stock: 50,
        mainImage: null,
        isActive: true
      },
      {
        id: 3,
        code: 'PRD-CAT-003',
        name: 'خاک گربه بنتونیت',
        description: 'خاک گربه کلوخه شونده با رایحه لاوندر',
        categoryId: 'cat-litter', // پت شاپ › لوازم › گربه › خاک گربه
        price: 120000,
        stock: 0,
        mainImage: null,
        isActive: false
      },
      {
        id: 4,
        code: 'PRD-DOG-004',
        name: 'قلاده چرمی سگ',
        description: 'قلاده چرم طبیعی سایز M',
        categoryId: 'dog-collar', // پت شاپ › لوازم › سگ › قلاده و بند
        price: 180000,
        stock: 8,
        mainImage: null,
        isActive: true
      },
      {
        id: 5,
        code: 'PRD-CAT-005',
        name: 'اسکرچر گربه طرح موش',
        description: 'اسکرچر با پوشش سیزال طبیعی',
        categoryId: 'cat-scratch', // پت شاپ › لوازم › گربه › اسکرچر و اسباب بازی
        price: 250000,
        stock: 15,
        mainImage: null,
        isActive: true
      },
      {
        id: 6,
        code: 'PRD-BIRD-001',
        name: 'دانه مخلوط قناری',
        description: 'مخلوط دانه‌های مغذی برای قناری',
        categoryId: 'bird-seed', // پت شاپ › غذا › غذای پرنده › دانه
        price: 35000,
        stock: 25,
        mainImage: null,
        isActive: true
      },
      {
        id: 7,
        code: 'PRD-DOG-007',
        name: 'استخوان تشویقی سگ',
        description: 'استخوان جویدنی با طعم گوشت',
        categoryId: 'dog-treat', // پت شاپ › غذا › غذای سگ › تشویقی
        price: 55000,
        stock: 40,
        mainImage: null,
        isActive: true
      },
      {
        id: 8,
        code: 'PRD-CAT-008',
        name: 'ظرف غذای دوقلو',
        description: 'ظرف استیل ضد زنگ دوتایی',
        categoryId: 'cat-bowl', // پت شاپ › لوازم › گربه › ظرف غذا و آب
        price: 95000,
        stock: 18,
        mainImage: null,
        isActive: true
      },
      {
        id: 9,
        code: 'PRD-FISH-001',
        name: 'غذای ورقه‌ای ماهی',
        description: 'غذای ورقه‌ای برای ماهی‌های زینتی',
        categoryId: 'fish-flake', // پت شاپ › غذا › غذای ماهی › ورقه‌ای
        price: 28000,
        stock: 60,
        mainImage: null,
        isActive: true
      }
    ]
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
