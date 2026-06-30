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
          <h2 class="text-xl font-bold text-gray-900">ویرایش محصول</h2>
          <p class="text-sm text-gray-500 mt-1">ویرایش اطلاعات محصول</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl p-12 text-center">
      <i class="ti ti-loader animate-spin text-4xl text-gray-400 mb-2"></i>
      <p class="text-sm text-gray-500">در حال بارگذاری...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!formData" class="bg-white rounded-2xl p-12 text-center">
      <i class="ti ti-alert-circle text-4xl text-red-500 mb-2"></i>
      <p class="text-sm text-gray-600">محصول مورد نظر یافت نشد</p>
    </div>

    <!-- Edit Form -->
    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <!-- اطلاعات اصلی -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('basic')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
              <i class="ti ti-info-circle text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">اطلاعات اصلی</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform" 
             :class="openSections.basic ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.basic" class="p-5 pt-0 space-y-4 border-t border-gray-100">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">نام محصول *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">کد محصول *</label>
              <input
                v-model="formData.code"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی *</label>
              <input
                v-model="formData.category"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
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
            <h3 class="text-base font-bold text-gray-900">قیمت و موجودی</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.pricing ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.pricing" class="p-5 pt-0 space-y-4 border-t border-gray-100">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">قیمت (تومان) *</label>
              <input
                v-model="formData.price"
                @input="formatPrice"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">موجودی *</label>
              <input
                v-model.number="formData.stock"
                type="number"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- توضیحات -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('description')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <i class="ti ti-file-text text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">توضیحات</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.description ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.description" class="p-5 pt-0 border-t border-gray-100">
          <textarea
            v-model="formData.description"
            rows="4"
            placeholder="توضیحات محصول..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
          ></textarea>
        </div>
      </div>

      <!-- وضعیت -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold text-gray-900">فعال بودن محصول</p>
            <p class="text-sm text-gray-500">این محصول در لیست نمایش داده شود</p>
          </div>
          <button
            @click="formData.isActive = !formData.isActive"
            type="button"
            :class="[
              'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
              formData.isActive ? 'bg-teal-600' : 'bg-gray-300'
            ]"
          >
            <span
              :class="[
                'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                formData.isActive ? 'translate-x-7 rtl:-translate-x-7' : 'translate-x-1 rtl:translate-x-1'
              ]"
            ></span>
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          type="submit"
          class="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <i class="ti ti-check"></i>
          ذخیره تغییرات
        </button>
        <button
          @click="$router.back()"
          type="button"
          class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border-2 border-gray-200"
        >
          انصراف
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

const loading = ref(true)
const formData = ref(null)

const openSections = ref({
  basic: true,
  pricing: true,
  description: false
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
      const product = products.find(p => p.id === parseInt(route.params.id))
      if (product) {
        formData.value = { ...product }
        // Format price for display
        if (formData.value.price) {
          formData.value.price = new Intl.NumberFormat('fa-IR').format(formData.value.price)
        }
      }
    }
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (event) => {
  let value = event.target.value.replace(/,/g, '')
  if (value) {
    formData.value.price = new Intl.NumberFormat('fa-IR').format(value)
  }
}

const submitForm = async () => {
  try {
    const savedProducts = localStorage.getItem('pharmacy_products')
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      const index = products.findIndex(p => p.id === formData.value.id)
      
      if (index !== -1) {
        // Convert price back to number
        const priceValue = formData.value.price.replace(/,/g, '')
        products[index] = {
          ...formData.value,
          price: parseInt(priceValue)
        }
        
        localStorage.setItem('pharmacy_products', JSON.stringify(products))
        
        // Dispatch event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('product-updated', { detail: products[index] }))
        }
        
        alert('محصول با موفقیت بروزرسانی شد')
        router.push('/pharmacies/products')
      }
    }
  } catch (error) {
    console.error('Error updating product:', error)
    alert('خطا در بروزرسانی محصول')
  }
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
