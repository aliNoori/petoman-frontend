<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
      <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
        <i class="ti ti-sparkles text-xl text-purple-600"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-900">ساخت عنوان و کد محصول</h3>
      </div>
    </div>

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- نوع حیوان -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          <i class="ti ti-paw"></i>
          نوع حیوان
        </label>
        <div class="relative" data-dropdown>
          <button
            @click.stop="toggleDropdown('animal')"
            type="button"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
            :class="{ 'border-teal-500': selectedAnimal }"
          >
            <span :class="selectedAnimal ? 'text-gray-900' : 'text-gray-400'">
              <span v-if="selectedAnimal" class="ml-2">{{ selectedAnimal.icon }}</span>
              {{ selectedAnimal ? selectedAnimal.name : 'انتخاب کنید' }}
            </span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'animal'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <!-- Search -->
              <div class="p-3 border-b border-gray-100">
                <div class="relative">
                  <input
                    v-model="animalSearch"
                    type="text"
                    placeholder="جستجو..."
                    class="w-full px-3 py-2 pr-9 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    @click.stop
                  />
                  <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <!-- List -->
              <div class="max-h-60 overflow-y-auto">
                <button
                  v-for="animal in filteredAnimals"
                  :key="animal.id"
                  @click="selectAnimal(animal)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors flex items-center gap-3"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedAnimal?.id === animal.id }"
                >
                  <span class="text-2xl">{{ animal.icon }}</span>
                  <span>{{ animal.name }}</span>
                </button>
                <div v-if="filteredAnimals.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                  نتیجه‌ای یافت نشد
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- نوع محصول -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          <i class="ti ti-box"></i>
          نوع محصول
        </label>
        <div class="relative" data-dropdown>
          <button
            @click.stop="toggleDropdown('product')"
            type="button"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
            :class="{ 'border-teal-500': selectedProduct }"
          >
            <span :class="selectedProduct ? 'text-gray-900' : 'text-gray-400'">
              {{ selectedProduct ? selectedProduct.name : 'انتخاب کنید' }}
            </span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'product'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <!-- Search -->
              <div class="p-3 border-b border-gray-100">
                <div class="relative">
                  <input
                    v-model="productSearch"
                    type="text"
                    placeholder="جستجو..."
                    class="w-full px-3 py-2 pr-9 border border-gray-200 rounded-lg text-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
                    @click.stop
                  />
                  <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <!-- List -->
              <div class="max-h-60 overflow-y-auto">
                <div v-for="(items, category) in groupedFilteredProducts" :key="category">
                  <div class="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 sticky top-0">
                    {{ category }}
                  </div>
                  <button
                    v-for="product in items"
                    :key="product.id"
                    @click="selectProduct(product)"
                    type="button"
                    class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                    :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedProduct?.id === product.id }"
                  >
                    {{ product.name }}
                  </button>
                </div>
                <div v-if="Object.keys(groupedFilteredProducts).length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                  نتیجه‌ای یافت نشد
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- برند -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          <i class="ti ti-diamond"></i>
          برند (اختیاری)
        </label>
        <div class="relative" data-dropdown>
          <button
            @click.stop="toggleDropdown('brand')"
            type="button"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
            :class="{ 'border-teal-500': selectedBrand }"
          >
            <span :class="selectedBrand ? 'text-gray-900' : 'text-gray-400'">
              {{ selectedBrand ? selectedBrand.name : 'انتخاب کنید' }}
            </span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'brand'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <!-- Search -->
              <div class="p-3 border-b border-gray-100">
                <div class="relative">
                  <input
                    v-model="brandSearch"
                    type="text"
                    placeholder="جستجو..."
                    class="w-full px-3 py-2 pr-9 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    @click.stop
                  />
                  <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <!-- List -->
              <div class="max-h-60 overflow-y-auto">
                <button
                  v-for="brand in filteredBrands"
                  :key="brand.id"
                  @click="selectBrand(brand)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedBrand?.id === brand.id }"
                >
                  <span>{{ brand.name }}</span>
                </button>
                <div v-if="filteredBrands.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                  موردی یافت نشد
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- ویژگی‌ها (بر اساس حیوان انتخاب شده) -->
      <template v-if="selectedAnimal">
        <!-- وزن -->
        <div v-if="attributes.weight && attributes.weight.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-weight"></i>
            وزن/حجم
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('weight')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedWeight }"
            >
              <span :class="selectedWeight ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedWeight ? selectedWeight.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'weight'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.weight"
                  :key="item.id"
                  @click="selectWeight(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedWeight?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- طعم -->
        <div v-if="attributes.taste && attributes.taste.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-lemon"></i>
            طعم
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('taste')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedTaste }"
            >
              <span :class="selectedTaste ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedTaste ? selectedTaste.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'taste'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.taste"
                  :key="item.id"
                  @click="selectTaste(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedTaste?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- سن -->
        <div v-if="attributes.age && attributes.age.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-clock"></i>
            محدوده سنی
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('age')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedAge }"
            >
              <span :class="selectedAge ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedAge ? selectedAge.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'age'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.age"
                  :key="item.id"
                  @click="selectAge(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedAge?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- سایز نژاد (فقط برای سگ) -->
        <div v-if="attributes.size && attributes.size.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-ruler"></i>
            سایز نژاد
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('size')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedSize }"
            >
              <span :class="selectedSize ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedSize ? selectedSize.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'size'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.size"
                  :key="item.id"
                  @click="selectSize(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedSize?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- بسته‌بندی -->
        <div v-if="attributes.packaging && attributes.packaging.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-package"></i>
            نوع بسته‌بندی
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('packaging')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedPackaging }"
            >
              <span :class="selectedPackaging ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedPackaging ? selectedPackaging.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'packaging'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.packaging"
                  :key="item.id"
                  @click="selectPackaging(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedPackaging?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- ویژگی‌های خاص (Multi-select) -->
        <div v-if="attributes.special && attributes.special.length > 0" class="lg:col-span-2">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-star"></i>
            ویژگی‌های خاص (اختیاری)
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <button
              v-for="item in attributes.special"
              :key="item.id"
              @click="toggleSpecialAttribute(item)"
              type="button"
              class="px-3 py-2 border rounded-lg text-sm font-bold transition-all"
              :class="isSpecialSelected(item.id) 
                ? 'bg-teal-50 border-teal-500 text-teal-700' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300'"
            >
              <i v-if="isSpecialSelected(item.id)" class="ti ti-check text-xs ml-1"></i>
              {{ item.name }}
            </button>
          </div>
        </div>
      </template>

      <!-- پیام راهنما اگر حیوانی انتخاب نشده -->
      <div v-else class="lg:col-span-2 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
        <i class="ti ti-info-circle text-2xl text-gray-400"></i>
        <p class="text-sm text-gray-500 mt-2">ابتدا نوع حیوان را انتخاب کنید</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
//import seoData from '../data/seo-data.json'
import productTypesData from '../data/product-types.json'
import {useReferenceStore} from "@/stores/market/reference";

interface Animal {
  id: string
  name: string
  icon: string
  code: string
}

interface Product {
  id: string
  name: string
  category: string
  code: string
  animals?: string[] // حیواناتی که این محصول برایشان مناسب است
}

interface Brand {
  id: string
  name: string
  code: string
}

interface Attribute {
  id: string
  name: string
}

interface Emits {
  (e: 'update:title', title: string): void
  (e: 'update:code', code: string): void
  (e: 'update:brand',brand:any):void
}
const referenceStore=useReferenceStore()
const emit = defineEmits<Emits>()

// Data
const animals = computed(()=>referenceStore.animals)
const allBrands = computed(()=>referenceStore.brands) // برند‌های دسته‌بندی شده بر اساس حیوان
const allAttributes = computed(()=>referenceStore.attributes) // ویژگی‌های دسته‌بندی شده بر اساس حیوان
const products = ref<Product[]>(productTypesData.shopProducts)

// State
const selectedAnimal = ref<Animal | null>(null)
const selectedProduct = ref<Product | null>(null)
const selectedBrand = ref<Brand | null>(null)
const selectedAttributes = ref<Attribute[]>([])

// State برای فیلدهای جداگانه
const selectedWeight = ref<Attribute | null>(null)
const selectedTaste = ref<Attribute | null>(null)
const selectedAge = ref<Attribute | null>(null)
const selectedSize = ref<Attribute | null>(null)
const selectedPackaging = ref<Attribute | null>(null)
const selectedSpecialAttributes = ref<Attribute[]>([])

const openDropdown = ref<string | null>(null)
const copied = ref(false)
const codeCopied = ref(false)

// Search states
const animalSearch = ref('')
const productSearch = ref('')
const brandSearch = ref('')

// Computed - Filtered lists
const filteredAnimals = computed(() => {
  if (!animalSearch.value) return animals.value
  return animals.value.filter(a => 
    a.name.includes(animalSearch.value)
  )
})

const filteredProducts = computed(() => {
  let filtered = products.value
  
  // فیلتر بر اساس حیوان انتخاب شده
  if (selectedAnimal.value) {
    filtered = filtered.filter(p => 
      p.animals && p.animals.includes(selectedAnimal.value.slug)
    )
  }
  
  // فیلتر جستجو
  if (!productSearch.value) return filtered
  return filtered.filter(p => p.name.includes(productSearch.value))
})

const filteredBrands = computed(() => {
  // فیلتر بر اساس حیوان انتخاب شده
  let animalBrands: Brand[] = []
  
  if (selectedAnimal.value && allBrands.value[selectedAnimal.value.slug]) {
    animalBrands = allBrands.value[selectedAnimal.value.slug]
  } else if (!selectedAnimal.value) {
    // اگر حیوانی انتخاب نشده، همه برندها را نشان بده
    animalBrands = Object.values(allBrands.value).flat()
  }
  
  // فیلتر جستجو
  if (!brandSearch.value) return animalBrands
  return animalBrands.filter(b => 
    b.name.includes(brandSearch.value)
  )
})

// ویژگی‌های فیلتر شده بر اساس حیوان انتخاب شده
const attributes = computed(() => {
  if (selectedAnimal.value && allAttributes.value[selectedAnimal.value.slug]) {
    return allAttributes.value[selectedAnimal.value.slug]
  }
  // اگر حیوانی انتخاب نشده، ویژگی‌های گربه را نشان بده (پیش‌فرض)
  return allAttributes.value['cat'] || {}
})

const groupedFilteredProducts = computed(() => {
  const groups: Record<string, Product[]> = {}
  filteredProducts.value.forEach(product => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }
    groups[product.category].push(product)
  })
  return groups
})

// Computed
const groupedProducts = computed(() => {
  const groups: Record<string, Product[]> = {}
  products.value.forEach(product => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }
    groups[product.category].push(product)
  })
  return groups
})

const generatedTitle = computed(() => {
  if (!selectedProduct.value) {
    return ''
  }

  const parts: string[] = []
  
  // 1. نوع محصول (مثال: غذای خشک، کنسرو)
  parts.push(selectedProduct.value.name)
  
  // 2. نوع حیوان (مثال: گربه، سگ، طوطی)
  if (selectedAnimal.value) {
    parts.push(selectedAnimal.value.name)
  }
  
  // 3. وزن (از فیلد جداگانه)
  if (selectedWeight.value) {
    parts.push(selectedWeight.value.name)
  }
  
  // 4. برند با پیشوند "برند" (مثال: برند رویال کنین)
  if (selectedBrand.value) {
    parts.push(`برند ${selectedBrand.value.name}`)
  }
  
  // 5. طعم
  if (selectedTaste.value) {
    parts.push(selectedTaste.value.name)
  }
  
  // 6. محدوده سنی
  if (selectedAge.value) {
    parts.push(selectedAge.value.name)
  }
  
  // 7. سایز نژاد
  if (selectedSize.value) {
    parts.push(selectedSize.value.name)
  }
  
  // 8. بسته‌بندی
  if (selectedPackaging.value) {
    parts.push(selectedPackaging.value.name)
  }
  
  // 9. ویژگی‌های خاص
  selectedSpecialAttributes.value.forEach(attr => {
    parts.push(attr.name)
  })
  
  return parts.join(' ')
})

const generatedCode = computed(() => {
  if (!selectedProduct.value) {
    return ''
  }
  
  const parts: string[] = []
  
  // کد نوع محصول (مثلا FC برای کنسرو)
  parts.push(selectedProduct.value.code)
  
  // کد حیوان (مثلا C برای گربه) - اختیاری
  if (selectedAnimal.value) {
    parts.push(selectedAnimal.value.code)
  }
  
  // کد برند (مثلا GM برای گورمت) - اختیاری
  if (selectedBrand.value) {
    parts.push(selectedBrand.value.code)
  }
  
  // شماره یونیک (timestamp 6 رقم آخر)
  const timestamp = Date.now().toString().slice(-6)
  parts.push(timestamp)
  
  return parts.join('-')
})

const wordCount = computed(() => {
  return generatedTitle.value.split(' ').filter(w => w.length > 0).length
})

const charCount = computed(() => {
  return generatedTitle.value.length
})

// Methods
const toggleDropdown = (name: string) => {
  openDropdown.value = openDropdown.value === name ? null : name
  // Reset searches when opening
  if (openDropdown.value === name) {
    animalSearch.value = ''
    productSearch.value = ''
    brandSearch.value = ''
  }
}

const selectAnimal = (animal: Animal) => {
  selectedAnimal.value = animal
  openDropdown.value = null
  animalSearch.value = ''
  
  // پاک کردن محصول، برند و ویژگی‌ها چون حیوان تغییر کرد
  selectedProduct.value = null
  selectedBrand.value = null
  selectedAttributes.value = []
  
  // پاک کردن فیلدهای جداگانه
  selectedWeight.value = null
  selectedTaste.value = null
  selectedAge.value = null
  selectedSize.value = null
  selectedPackaging.value = null
  selectedSpecialAttributes.value = []
}

const selectProduct = (product: Product) => {
  selectedProduct.value = product
  openDropdown.value = null
  productSearch.value = ''
}

const selectBrand = (brand: Brand) => {
  emit('update:brand',brand)
  selectedBrand.value = brand
  openDropdown.value = null
  brandSearch.value = ''
}

const selectWeight = (item: Attribute) => {
  selectedWeight.value = item
  openDropdown.value = null
}

const selectTaste = (item: Attribute) => {
  selectedTaste.value = item
  openDropdown.value = null
}

const selectAge = (item: Attribute) => {
  selectedAge.value = item
  openDropdown.value = null
}

const selectSize = (item: Attribute) => {
  selectedSize.value = item
  openDropdown.value = null
}

const selectPackaging = (item: Attribute) => {
  selectedPackaging.value = item
  openDropdown.value = null
}

const toggleSpecialAttribute = (attr: Attribute) => {
  const index = selectedSpecialAttributes.value.findIndex(a => a.id === attr.id)
  if (index >= 0) {
    selectedSpecialAttributes.value.splice(index, 1)
  } else {
    selectedSpecialAttributes.value.push(attr)
  }
}

const isSpecialSelected = (id: string) => {
  return selectedSpecialAttributes.value.some(a => a.id === id)
}

const toggleAttribute = (attr: Attribute) => {
  const index = selectedAttributes.value.findIndex(a => a.id === attr.id)
  if (index >= 0) {
    selectedAttributes.value.splice(index, 1)
  } else {
    selectedAttributes.value.push(attr)
  }
}

const removeAttribute = (attr: Attribute) => {
  const index = selectedAttributes.value.findIndex(a => a.id === attr.id)
  if (index >= 0) {
    selectedAttributes.value.splice(index, 1)
  }
}

const isAttributeSelected = (id: string) => {
  return selectedAttributes.value.some(attr => attr.id === id)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedTitle.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    codeCopied.value = true
    setTimeout(() => {
      codeCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Watch for title changes
watch(generatedTitle, (newTitle) => {
  emit('update:title', newTitle)
})

// Watch for code changes
watch(generatedCode, (newCode) => {
  emit('update:code', newCode)
})

// Close dropdown when clicking outside
const closeDropdowns = () => {
  openDropdown.value = null
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-dropdown]')) {
      closeDropdowns()
    }
  })
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
</style>
