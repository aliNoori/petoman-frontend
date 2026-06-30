<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Header with Add Button -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">دسته‌بندی محصولات</h2>
          <p class="text-sm text-gray-500 mt-1">مدیریت دسته‌بندی‌های داروها و محصولات فروشگاه</p>
        </div>
        <button
          @click="openAddModal"
          class="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 flex items-center gap-2"
        >
          <i class="ti ti-plus text-xl"></i>
          افزودن دسته‌بندی
        </button>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              category.type === 'medicine' ? 'bg-teal-50' : 'bg-purple-50'
            ]">
              <i :class="[
                'text-2xl',
                category.type === 'medicine' ? 'ti ti-pill text-teal-600' : 'ti ti-shopping-bag text-purple-600'
              ]"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ category.name }}</h3>
              <span :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mt-1',
                category.type === 'medicine' ? 'bg-teal-50 text-teal-700' : 'bg-purple-50 text-purple-700'
              ]">
                {{ category.type === 'medicine' ? 'دارو' : 'فروشگاه' }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="editCategory(category)"
              class="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              title="ویرایش"
            >
              <i class="ti ti-edit text-lg"></i>
            </button>
            <button
              @click="deleteCategory(category)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <i class="ti ti-trash text-lg"></i>
            </button>
          </div>
        </div>

        <p v-if="category.description" class="text-sm text-gray-600 mb-4">{{ category.description }}</p>

        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p class="text-xs text-gray-500 mb-1">تعداد محصولات</p>
            <p class="font-bold text-gray-900 font-english">{{ category.productCount }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">وضعیت</p>
            <span :class="[
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
              category.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            ]">
              <i :class="category.isActive ? 'ti ti-check' : 'ti ti-x'"></i>
              {{ category.isActive ? 'فعال' : 'غیرفعال' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="categories.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="ti ti-category text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">هنوز دسته‌بندی نداری</h3>
      <p class="text-gray-500 text-sm mb-4">اولین دسته‌بندی خودت را ایجاد کن</p>
      <button
        @click="openAddModal"
        class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all"
      >
        افزودن دسته‌بندی
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="showModal"
          @click.self="showModal = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="bg-teal-600 px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="ti ti-category text-2xl text-white"></i>
                <h3 class="text-xl font-bold text-white">
                  {{ editMode ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی' }}
                </h3>
              </div>
              <button
                @click="showModal = false"
                class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1">
              <div class="space-y-4">
                <!-- نام دسته‌بندی -->
                <div>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="نام دسته‌بندی"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  />
                </div>

                <!-- نوع -->
                <AppSelect
                  v-model="formData.type"
                  :options="categoryTypeOptions"
                  placeholder="نوع دسته‌بندی"
                />

                <!-- توضیحات -->
                <div>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    placeholder="توضیحات دسته‌بندی (اختیاری)"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <!-- وضعیت -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p class="font-bold text-gray-900">وضعیت دسته‌بندی</p>
                    <p class="text-sm text-gray-500">فعال یا غیرفعال کردن این دسته‌بندی</p>
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
                        formData.isActive ? 'translate-x-1' : 'translate-x-7'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                @click="saveCategory"
                :disabled="!isFormValid"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
                  isFormValid
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]"
              >
                <i class="ti ti-check"></i>
                {{ editMode ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی' }}
              </button>
              <button
                @click="showModal = false"
                class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border-2 border-gray-200"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSelect from '@/components/AppSelect.vue'


// State
const showModal = ref(false)
const editMode = ref(false)

// Options
const categoryTypeOptions = [
  { value: 'medicine', label: 'دارو', icon: 'ti ti-pill', iconColor: 'text-teal-500' },
  { value: 'shop', label: 'محصول فروشگاه', icon: 'ti ti-shopping-bag', iconColor: 'text-purple-500' }
]

const formData = ref({
  name: '',
  type: '',
  description: '',
  isActive: true
})

// Sample Data
const categories = ref([
  {
    id: 1,
    name: 'آنتی‌بیوتیک',
    type: 'medicine',
    description: 'داروهای ضد باکتری و آنتی‌بیوتیک',
    productCount: 25,
    isActive: true
  },
  {
    id: 2,
    name: 'ضد انگل',
    type: 'medicine',
    description: 'داروهای ضد انگل داخلی و خارجی',
    productCount: 18,
    isActive: true
  },
  {
    id: 3,
    name: 'غذای حیوانات',
    type: 'shop',
    description: 'غذای خشک و تر برای سگ و گربه',
    productCount: 45,
    isActive: true
  },
  {
    id: 4,
    name: 'لوازم بهداشتی',
    type: 'shop',
    description: 'شامپو، برس، خمیر دندان و...',
    productCount: 32,
    isActive: true
  },
  {
    id: 5,
    name: 'واکسن',
    type: 'medicine',
    description: 'واکسن‌های پیشگیری از بیماری‌ها',
    productCount: 12,
    isActive: true
  },
  {
    id: 6,
    name: 'اسباب بازی',
    type: 'shop',
    description: 'اسباب بازی و سرگرمی حیوانات',
    productCount: 28,
    isActive: false
  },
])

// Computed
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.type !== ''
})

// Methods
const openAddModal = () => {
  editMode.value = false
  formData.value = {
    name: '',
    type: '',
    description: '',
    isActive: true
  }
  showModal.value = true
}

const editCategory = (category) => {
  editMode.value = true
  formData.value = { ...category }
  showModal.value = true
}

const saveCategory = () => {
  if (!isFormValid.value) return

  if (editMode.value) {
    // Update existing
    const index = categories.value.findIndex(c => c.id === formData.value.id)
    if (index !== -1) {
      categories.value[index] = { ...formData.value }
    }
  } else {
    // Add new
    const newCategory = {
      ...formData.value,
      id: Date.now(),
      productCount: 0
    }
    categories.value.push(newCategory)
  }

  showModal.value = false
}

const deleteCategory = (category) => {
  if (category.productCount > 0) {
    alert(`این دسته‌بندی ${category.productCount} محصول دارد. ابتدا محصولات را به دسته دیگری منتقل کنید.`)
    return
  }

  if (confirm(`آیا از حذف دسته‌بندی "${category.name}" اطمینان دارید؟`)) {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}

/* English Numbers */
.font-english {
  font-family: system-ui, -apple-system, sans-serif;
  direction: ltr;
  display: inline-block;
}
</style>
