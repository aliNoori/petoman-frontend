<template>
  <div class="space-y-3">
    <!-- Input Field -->
    <div class="relative">
      <div class="relative">
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          :disabled="isLocked"
          :placeholder="isLocked ? 'محصول موجود انتخاب شده' : 'نام محصول را وارد کنید...'"
          class="w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all outline-none"
          :class="[
            isLocked 
              ? 'border-teal-300 bg-teal-50 text-gray-700 cursor-not-allowed' 
              : 'border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
            showDropdown && 'rounded-b-none'
          ]"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
        />
        
        <!-- Icon -->
        <div class="absolute right-4 top-1/2 -translate-y-1/2">
          <i v-if="isLocked" class="ti ti-lock text-teal-600"></i>
          <i v-else-if="isSearching" class="ti ti-loader animate-spin text-gray-400"></i>
          <i v-else class="ti ti-search text-gray-400"></i>
        </div>

        <!-- Edit Button (when locked) -->
        <button
          v-if="isLocked"
          @click="unlock"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg font-bold transition-all"
        >
          <i class="ti ti-pencil text-xs"></i>
          ویرایش
        </button>
      </div>

      <!-- Suggestions Dropdown -->
      <transition name="dropdown">
        <div
          v-if="showDropdown"
          class="absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-gray-200 rounded-b-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          @mousedown.prevent
        >
          <!-- Existing Products -->
          <div v-if="suggestions.length > 0" class="py-2">
            <div class="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50">
              محصولات مشابه موجود
            </div>
            <button
              v-for="(item, index) in suggestions"
              :key="item.id"
              type="button"
              class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors flex items-center gap-3 group"
              :class="{ 'bg-teal-50': highlightedIndex === index }"
              @click="selectExisting(item)"
              @mouseenter="highlightedIndex = index"
            >
              <!-- Image -->
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                <img 
                  v-if="item.image" 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <i v-else class="ti ti-package text-xl text-gray-400 flex items-center justify-center h-full"></i>
              </div>
              
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 group-hover:text-teal-600 truncate">
                  {{ item.name }}
                </div>
                <div class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                  <span>کد: {{ item.code }}</span>
                  <span class="text-gray-300">•</span>
                  <span>{{ item.category }}</span>
                </div>
              </div>

              <!-- Badge -->
              <div class="flex-shrink-0">
                <span class="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-md font-bold">
                  موجود
                </span>
              </div>
            </button>
          </div>

          <!-- Create New Option -->
          <div v-if="canCreateNew" class="border-t-2 border-gray-100">
            <button
              type="button"
              class="w-full px-4 py-3 text-right hover:bg-purple-50 transition-colors flex items-center gap-3 group"
              :class="{ 'bg-purple-50': highlightedIndex === suggestions.length }"
              @click="confirmCreateNew"
              @mouseenter="highlightedIndex = suggestions.length"
            >
              <div class="w-10 h-10 rounded-lg bg-purple-100 flex-shrink-0 flex items-center justify-center">
                <i class="ti ti-plus text-xl text-purple-600"></i>
              </div>
              <div class="flex-1">
                <div class="font-bold text-gray-900 group-hover:text-purple-600">
                  ایجاد محصول جدید
                </div>
                <div class="text-xs text-gray-500 mt-0.5">
                  "{{ searchQuery }}" به عنوان محصول جدید اضافه شود
                </div>
              </div>
            </button>
          </div>

          <!-- No Results -->
          <div v-if="!isSearching && suggestions.length === 0 && searchQuery.length >= 2" class="py-4 text-center text-gray-500">
            <i class="ti ti-search-off text-3xl mb-2"></i>
            <div class="text-sm">محصول مشابهی یافت نشد</div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Slug Preview -->
    <div v-if="!isLocked && searchQuery" class="flex items-center gap-2 text-xs text-gray-500 px-2">
      <i class="ti ti-link"></i>
      <span class="font-bold">اسلاگ:</span>
      <code class="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono">{{ slugPreview }}</code>
    </div>

    <!-- Selected Product Info -->
    <div v-if="selectedProduct" class="p-4 bg-teal-50 border-2 border-teal-200 rounded-xl flex items-center gap-3">
      <div class="w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0">
        <img 
          v-if="selectedProduct.image" 
          :src="selectedProduct.image" 
          :alt="selectedProduct.name"
          class="w-full h-full object-cover"
        />
        <i v-else class="ti ti-package text-2xl text-teal-600 flex items-center justify-center h-full"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold text-teal-900">محصول موجود انتخاب شد</div>
        <div class="text-sm text-teal-700 truncate">{{ selectedProduct.name }}</div>
      </div>
      <button
        @click="unlock"
        type="button"
        class="flex-shrink-0 p-2 hover:bg-teal-100 rounded-lg transition-colors"
        title="تغییر انتخاب"
      >
        <i class="ti ti-x text-teal-600"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string | number
  name: string
  code: string
  category: string
  image?: string
  slug?: string
}

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'attach-existing', product: Product): void
  (e: 'create-new', name: string, slug: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs
const inputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref(props.modelValue)
const suggestions = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)
const isSearching = ref(false)
const isFocused = ref(false)
const highlightedIndex = ref(-1)
const isLocked = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Computed
const showDropdown = computed(() => {
  return isFocused.value && searchQuery.value.length >= 2 && !isLocked.value
})

const canCreateNew = computed(() => {
  return searchQuery.value.length >= 2 && !isSearching.value
})

const slugPreview = computed(() => {
  return generateSlug(searchQuery.value)
})

// Methods
const generateSlug = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]/g, '')
    .toLowerCase()
}

const searchProducts = async (query: string) => {
  if (query.length < 2) {
    suggestions.value = []
    return
  }

  isSearching.value = true
  
  try {
    // Mock data for now - replace with real API call
    // const { data } = await useFetch(`/api/products/search?q=${encodeURIComponent(query)}`)
    
    // Simulated API response
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock results
    suggestions.value = [
      {
        id: 1,
        name: 'غذای خشک سگ رویال کنین 15 کیلوگرم',
        code: 'RC-001',
        category: 'غذای حیوانات',
        image: null
      },
      {
        id: 2,
        name: 'غذای خشک سگ پدیگری 10 کیلوگرم',
        code: 'PD-002',
        category: 'غذای حیوانات',
        image: null
      }
    ].filter(p => p.name.includes(query))
    
  } catch (error) {
    console.error('Search failed:', error)
    suggestions.value = []
  } finally {
    isSearching.value = false
  }
}

const debouncedSearch = (query: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    searchProducts(query)
  }, 400)
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  emit('update:modelValue', value)
  highlightedIndex.value = -1
  
  if (value.length >= 2) {
    debouncedSearch(value)
  } else {
    suggestions.value = []
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  // Delay to allow click on dropdown items
  setTimeout(() => {
    isFocused.value = false
  }, 200)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value) return

  const totalItems = suggestions.value.length + (canCreateNew.value ? 1 : 0)

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, totalItems - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        if (highlightedIndex.value < suggestions.value.length) {
          selectExisting(suggestions.value[highlightedIndex.value])
        } else {
          confirmCreateNew()
        }
      }
      break
    case 'Escape':
      event.preventDefault()
      isFocused.value = false
      inputRef.value?.blur()
      break
  }
}

const selectExisting = (product: Product) => {
  selectedProduct.value = product
  searchQuery.value = product.name
  isLocked.value = true
  isFocused.value = false
  emit('update:modelValue', product.name)
  emit('attach-existing', product)
}

const confirmCreateNew = () => {
  isFocused.value = false
  emit('create-new', searchQuery.value, slugPreview.value)
}

const unlock = () => {
  isLocked.value = false
  selectedProduct.value = null
  searchQuery.value = ''
  emit('update:modelValue', '')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Watch props
watch(() => props.modelValue, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal
  }
})
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

/* Smooth transitions */
input {
  transition: all 0.2s ease;
}
</style>
