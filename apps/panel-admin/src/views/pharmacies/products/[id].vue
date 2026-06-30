<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900">جزئیات محصول</h2>
          <p class="text-sm text-gray-500 mt-1">مشاهده اطلاعات کامل محصول</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl p-12 text-center">
      <i class="ti ti-loader animate-spin text-4xl text-gray-400 mb-2"></i>
      <p class="text-sm text-gray-500">در حال بارگذاری...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!product" class="bg-white rounded-2xl p-12 text-center">
      <i class="ti ti-alert-circle text-4xl text-red-500 mb-2"></i>
      <p class="text-sm text-gray-600">محصول مورد نظر یافت نشد</p>
    </div>

    <!-- Product Details -->
    <div v-else class="space-y-4">
      <!-- تصویر محصول -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('image')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <i class="ti ti-photo text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-800">تصویر محصول</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.image ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.image" class="p-5 pt-0 border-t border-gray-100">
          <div v-if="product.type === 'shop'" class="w-full h-64 rounded-xl overflow-hidden bg-gray-100">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover">
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="ti ti-photo text-gray-400 text-6xl"></i>
            </div>
          </div>
          <div v-else class="w-full h-32 rounded-xl overflow-hidden bg-teal-50 flex items-center justify-center">
            <i class="ti ti-pill text-teal-600 text-6xl"></i>
          </div>
        </div>
      </div>

      <!-- اطلاعات اصلی -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('basic')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <i class="ti ti-info-circle text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-800">اطلاعات اصلی</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.basic ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.basic" class="p-5 pt-0 space-y-4 border-t border-gray-100">
          <div>
            <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h4>
            <p class="text-sm text-gray-500">کد محصول: {{ product.code }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">نوع محصول</p>
              <p class="font-bold text-gray-900">
                {{ product.type === 'medicine' ? 'دارو' : 'محصول فروشگاه' }}
              </p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">دسته‌بندی</p>
              <p class="font-bold text-gray-900">{{ product.category }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- قیمت و موجودی -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('pricing')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <i class="ti ti-moneybag text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-800">قیمت و موجودی</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.pricing ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.pricing" class="p-5 pt-0 space-y-4 border-t border-gray-100">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">قیمت</p>
              <p class="font-bold text-gray-900">
                <span class="font-english">{{ formatMoney(product.price) }}</span>
                <span class="text-sm mr-1">تومان</span>
              </p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">موجودی</p>
              <p :class="[
                'font-bold font-english',
                product.stock < 10 ? 'text-red-600' : product.stock < 50 ? 'text-amber-600' : 'text-green-600'
              ]">
                {{ product.stock }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- توضیحات -->
      <div v-if="product.description" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('description')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <i class="ti ti-file-text text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-800">توضیحات</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.description ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.description" class="p-5 pt-0 border-t border-gray-100">
          <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
        </div>
      </div>

      <!-- مشخصات فنی -->
      <div v-if="product.specifications" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('specs')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
              <i class="ti ti-list-details text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-800">مشخصات فنی</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.specs ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.specs" class="p-5 pt-0 border-t border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(value, key) in product.specifications" 
              :key="key"
              class="bg-gray-50 rounded-lg p-3"
            >
              <p class="text-xs text-gray-500 mb-1">{{ formatSpecKey(key) }}</p>
              <p class="font-bold text-gray-900">{{ value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- وضعیت -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold text-gray-900">وضعیت محصول</p>
            <p class="text-sm text-gray-500">این محصول در لیست نمایش داده می‌شود</p>
          </div>
          <span :class="[
            'px-4 py-2 rounded-full text-sm font-bold',
            product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          ]">
            {{ product.isActive ? 'فعال' : 'غیرفعال' }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="editProduct"
          class="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <i class="ti ti-edit"></i>
          ویرایش محصول
        </button>
        <button
          @click="deleteProduct"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
        >
          <i class="ti ti-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

const loading = ref(true)
const product = ref(null)

const openSections = ref({
  image: true,
  basic: true,
  pricing: false,
  description: false,
  specs: false
})

const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section]
}

onMounted(() => {
  loadProduct()
})

const loadProduct = () => {
  try {
    const savedProducts = localStorage.getItem('pharmacy_products')
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      product.value = products.find(p => p.id === parseInt(route.params.id))
    }
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
}

const formatMoney = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('fa-IR').format(value)
}

const formatSpecKey = (key) => {
  const keyMap = {
    brand: 'برند',
    weight: 'وزن',
    origin: 'کشور سازنده',
    ingredients: 'مواد تشکیل دهنده',
    protein: 'پروتئین',
    fat: 'چربی',
    moisture: 'رطوبت',
    fiber: 'فیبر',
    omega3: 'امگا 3',
    ageRange: 'محدوده سنی',
    breedSize: 'سایز نژاد',
    calcium: 'کلسیم',
    activeIngredient: 'ماده موثره',
    volume: 'حجم',
    usage: 'نحوه مصرف',
    dosage: 'دوز مصرف',
    prescriptionRequired: 'نیاز به نسخه',
    storage: 'نحوه نگهداری'
  }
  return keyMap[key] || key
}

const editProduct = () => {
  router.push(`/pharmacies/products/edit/${product.value.id}`)
}

const deleteProduct = () => {
  if (confirm(`آیا از حذف محصول "${product.value.name}" اطمینان دارید؟`)) {
    try {
      const savedProducts = localStorage.getItem('pharmacy_products')
      if (savedProducts) {
        const products = JSON.parse(savedProducts)
        const index = products.findIndex(p => p.id === product.value.id)
        if (index !== -1) {
          products.splice(index, 1)
          localStorage.setItem('pharmacy_products', JSON.stringify(products))
          router.push('/pharmacies/products')
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('خطا در حذف محصول')
    }
  }
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
