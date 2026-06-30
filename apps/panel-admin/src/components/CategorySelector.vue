<template>
  <div class="space-y-3">
    <label class="block text-sm font-bold text-gray-700">
      <i class="ti ti-category text-purple-600"></i>
      دسته‌بندی محصول
    </label>

    <!-- Breadcrumb -->
    <div v-if="selectedPath.length > 0" class="flex items-center gap-2 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
      <i class="ti ti-folder text-purple-600"></i>
      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-for="(item, index) in selectedPath"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <span class="text-sm font-bold text-purple-900">{{ item.name }}</span>
          <i v-if="index < selectedPath.length - 1" class="ti ti-chevron-left text-purple-400 text-xs"></i>
        </span>
      </div>
      <button
        @click="reset"
        type="button"
        class="mr-auto p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
        title="تغییر دسته‌بندی"
      >
        <i class="ti ti-x text-purple-600"></i>
      </button>
    </div>

    <!-- Category Selector -->
    <div v-if="!isFinalSelected" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <button
        v-for="category in currentLevel"
        :key="category.id"
        @click="selectCategory(category)"
        type="button"
        class="group p-4 bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all text-right"
      >
        <div class="flex items-center justify-between">
          <span class="font-bold text-gray-900 group-hover:text-purple-600">
            {{ category.name }}
          </span>
          <i 
            v-if="category.children && category.children.length > 0"
            class="ti ti-chevron-left text-gray-400 group-hover:text-purple-600"
          ></i>
          <i 
            v-else
            class="ti ti-check-circle text-gray-300 group-hover:text-purple-600"
          ></i>
        </div>
        <div v-if="category.children && category.children.length > 0" class="text-xs text-gray-500 mt-1">
          {{ category.children.length }} زیردسته
        </div>
      </button>
    </div>

    <!-- Back Button -->
    <button
      v-if="selectedPath.length > 0 && !isFinalSelected"
      @click="goBack"
      type="button"
      class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
    >
      <i class="ti ti-arrow-right"></i>
      بازگشت به مرحله قبل
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {useCategoryStore} from "@/stores/pharmacy/category.ts";
//import categoriesData from '@/data/categories.json'
const categoryStore=useCategoryStore()
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'market', // مقدار پیش‌فرض
    validator: (value) => ['market', 'pharmacy'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'update:breadcrumb'])

// State
const allCategories = computed(() => {
  const allCats = categoryStore.categories || []

  if (props.type === 'market') {
    // پیدا کردن ریشه "پت شاپ"
    const root = allCats.find(c => c.slug === 'petshop' || c.name === 'پت شاپ')
    return root ? root.children : []
  } else if (props.type === 'pharmacy') {
    // پیدا کردن ریشه "داروخانه"
    const root = allCats.find(c => c.slug === 'pharmacy' || c.name === 'داروخانه')
    return root ? root.children : []
  }

  return []
})
const selectedPath = ref([])

// Computed
const currentLevel = computed(() => {
  if (selectedPath.value.length === 0) {
    return allCategories.value
  }
  const lastSelected = selectedPath.value[selectedPath.value.length - 1]
  return lastSelected.children || []
})

const isFinalSelected = computed(() => {
  if (selectedPath.value.length === 0) return false
  const lastSelected = selectedPath.value[selectedPath.value.length - 1]
  return !lastSelected.children || lastSelected.children.length === 0
})

const breadcrumbText = computed(() => {
  return selectedPath.value.map(item => item.name).join(' > ')
})

const categoryId = computed(() => {
  if (selectedPath.value.length === 0) return ''
  return selectedPath.value[selectedPath.value.length - 1].id
})

// Methods
const selectCategory = (category) => {
  selectedPath.value.push(category)
  
  // اگر دسته نهایی بود، emit کن
  if (!category.children || category.children.length === 0) {
    emit('update:modelValue', category.id)
    emit('update:breadcrumb', breadcrumbText.value)
  }
}

const goBack = () => {
  selectedPath.value.pop()
}

const reset = () => {
  selectedPath.value = []
  emit('update:modelValue', '')
  emit('update:breadcrumb', '')
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    selectedPath.value = []
  }
})
</script>

<style scoped>
/* Add smooth transitions */
button {
  transition: all 0.2s ease;
}
</style>
