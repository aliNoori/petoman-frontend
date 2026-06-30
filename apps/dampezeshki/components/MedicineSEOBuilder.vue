<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-6">
    <div class="mb-6 flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <i class="ti ti-medical-cross text-xl text-white"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-900">ساخت عنوان و کد دارو</h3>
        <p class="text-sm text-gray-500">اطلاعات دارو را وارد کنید تا عنوان و کد به صورت خودکار ساخته شود</p>
      </div>
    </div>

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
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors flex items-center gap-2"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedAnimal?.id === animal.id }"
                >
                  <span class="text-xl">{{ animal.icon }}</span>
                  <span>{{ animal.name }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- نوع دارو -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          <i class="ti ti-pill"></i>
          نوع دارو
        </label>
        <div class="relative" data-dropdown>
          <button
            @click.stop="toggleDropdown('medicine')"
            type="button"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
            :class="{ 'border-teal-500': selectedMedicine }"
          >
            <span :class="selectedMedicine ? 'text-gray-900' : 'text-gray-400'">
              {{ selectedMedicine ? selectedMedicine.name : 'انتخاب کنید' }}
            </span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'medicine'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <!-- Search -->
              <div class="p-3 border-b border-gray-100">
                <div class="relative">
                  <input
                    v-model="medicineSearch"
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
                <div v-for="(items, category) in groupedFilteredMedicines" :key="category">
                  <div class="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 sticky top-0">
                    {{ category }}
                  </div>
                  <button
                    v-for="medicine in items"
                    :key="medicine.id"
                    @click="selectMedicine(medicine)"
                    type="button"
                    class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                    :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedMedicine?.id === medicine.id }"
                  >
                    {{ medicine.name }}
                  </button>
                </div>
                <div v-if="filteredMedicines.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                  نتیجه‌ای یافت نشد
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- نیاز به نسخه -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          <i class="ti ti-file-certificate"></i>
          نیاز به نسخه
        </label>
        <div class="relative" data-dropdown>
          <button
            @click.stop="toggleDropdown('prescription')"
            type="button"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
            :class="{ 'border-teal-500': selectedPrescription }"
          >
            <span :class="selectedPrescription ? 'text-gray-900' : 'text-gray-400'">
              {{ selectedPrescription ? selectedPrescription.name : 'انتخاب کنید' }}
            </span>
            <i class="ti ti-chevron-down text-gray-400"></i>
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'prescription'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <button
                v-for="option in prescriptionOptions"
                :key="option.id"
                @click="selectPrescription(option)"
                type="button"
                class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedPrescription?.id === option.id }"
              >
                {{ option.name }}
              </button>
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
        <!-- دوز -->
        <div v-if="attributes.dosage && attributes.dosage.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-droplet"></i>
            دوز
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('dosage')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedDosage }"
            >
              <span :class="selectedDosage ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedDosage ? selectedDosage.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'dosage'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.dosage"
                  :key="item.id"
                  @click="selectDosage(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedDosage?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- شکل دارویی -->
        <div v-if="attributes.form && attributes.form.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-forms"></i>
            شکل دارویی
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('form')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedForm }"
            >
              <span :class="selectedForm ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedForm ? selectedForm.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'form'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.form"
                  :key="item.id"
                  @click="selectForm(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedForm?.id === item.id }"
                >
                  {{ item.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- اندازه بسته -->
        <div v-if="attributes.packageSize && attributes.packageSize.length > 0">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-package"></i>
            اندازه بسته
          </label>
          <div class="relative" data-dropdown>
            <button
              @click.stop="toggleDropdown('packageSize')"
              type="button"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right flex items-center justify-between hover:border-teal-500 transition-all"
              :class="{ 'border-teal-500': selectedPackageSize }"
            >
              <span :class="selectedPackageSize ? 'text-gray-900' : 'text-gray-400'">
                {{ selectedPackageSize ? selectedPackageSize.name : 'انتخاب کنید' }}
              </span>
              <i class="ti ti-chevron-down text-gray-400"></i>
            </button>
            <transition name="dropdown">
              <div v-if="openDropdown === 'packageSize'" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                <button
                  v-for="item in attributes.packageSize"
                  :key="item.id"
                  @click="selectPackageSize(item)"
                  type="button"
                  class="w-full px-4 py-3 text-right hover:bg-teal-50 transition-colors"
                  :class="{ 'bg-teal-50 text-teal-600 font-bold': selectedPackageSize?.id === item.id }"
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
import seoData from '@/data/seo-data-medicine.json'
import medicineTypesData from '@/data/medicine-types.json'

const emit = defineEmits(['update:title', 'update:code'])

// Types
interface Animal {
  id: string
  name: string
  icon: string
}

interface Medicine {
  id: string
  name: string
  category: string
  type: string
  animals?: string[]
}

interface Attribute {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

// State
const openDropdown = ref<string | null>(null)
const animalSearch = ref('')
const medicineSearch = ref('')
const brandSearch = ref('')

const selectedAnimal = ref<Animal | null>(null)
const selectedMedicine = ref<Medicine | null>(null)
const selectedPrescription = ref<Attribute | null>(null)
const selectedBrand = ref<Brand | null>(null)
const selectedDosage = ref<Attribute | null>(null)
const selectedForm = ref<Attribute | null>(null)
const selectedPackageSize = ref<Attribute | null>(null)
const selectedSpecialAttributes = ref<Attribute[]>([])

// Data
const animals = ref<Animal[]>(seoData.animals)
const medicines = ref<Medicine[]>(medicineTypesData.medicines)
const prescriptionOptions = ref<Attribute[]>([
  { id: 'with-prescription', name: 'نیاز به نسخه' },
  { id: 'without-prescription', name: 'بدون نسخه' }
])

// Computed
const filteredAnimals = computed(() => {
  if (!animalSearch.value) return animals.value
  return animals.value.filter(animal =>
    animal.name.includes(animalSearch.value)
  )
})

const filteredMedicines = computed(() => {
  let filtered = medicines.value
  
  // فیلتر بر اساس حیوان انتخاب شده
  if (selectedAnimal.value) {
    filtered = filtered.filter(medicine => 
      medicine.animals && medicine.animals.includes(selectedAnimal.value!.id)
    )
  }
  
  // فیلتر بر اساس جستجو
  if (medicineSearch.value) {
    filtered = filtered.filter(medicine =>
      medicine.name.includes(medicineSearch.value)
    )
  }
  
  return filtered
})

const groupedFilteredMedicines = computed(() => {
  const grouped: Record<string, Medicine[]> = {}
  filteredMedicines.value.forEach(medicine => {
    if (!grouped[medicine.category]) {
      grouped[medicine.category] = []
    }
    grouped[medicine.category].push(medicine)
  })
  return grouped
})

const filteredBrands = computed(() => {
  if (!selectedAnimal.value) return []
  
  const brandsForAnimal = (seoData.brands as any)[selectedAnimal.value.id] || []
  
  if (!brandSearch.value) return brandsForAnimal
  
  return brandsForAnimal.filter((brand: Brand) =>
    brand.name.includes(brandSearch.value)
  )
})

const attributes = computed(() => {
  if (!selectedAnimal.value) return {}
  return (seoData.attributes as any)[selectedAnimal.value.id] || {}
})

const generatedTitle = computed(() => {
  const parts: string[] = []
  
  // 1. نوع دارو
  if (selectedMedicine.value) {
    parts.push(selectedMedicine.value.name)
  }
  
  // 2. نوع حیوان
  if (selectedAnimal.value) {
    parts.push(selectedAnimal.value.name)
  }
  
  // 3. دوز
  if (selectedDosage.value) {
    parts.push(selectedDosage.value.name)
  }
  
  // 4. شکل دارویی
  if (selectedForm.value) {
    parts.push(selectedForm.value.name)
  }
  
  // 5. اندازه بسته
  if (selectedPackageSize.value) {
    parts.push(selectedPackageSize.value.name)
  }
  
  // 6. ویژگی‌های خاص
  if (selectedSpecialAttributes.value.length > 0) {
    parts.push(...selectedSpecialAttributes.value.map(attr => attr.name))
  }
  
  return parts.join(' ')
})

const generatedCode = computed(() => {
  const parts: string[] = []
  
  // پیشوند دارو
  parts.push('MED')
  
  // حیوان
  if (selectedAnimal.value) {
    const animalCode = selectedAnimal.value.id.substring(0, 1).toUpperCase()
    parts.push(animalCode)
  }
  
  // دسته‌بندی دارو
  if (selectedMedicine.value) {
    const categoryMap: Record<string, string> = {
      'آنتی‌بیوتیک': 'AB',
      'ضد انگل': 'AP',
      'واکسن': 'VC',
      'ضد التهاب': 'AI',
      'ویتامین': 'VT',
      'مکمل': 'SP',
      'ضد درد': 'PK',
      'آرام‌بخش': 'SD',
      'قلب و عروق': 'CV',
      'گوارش': 'DG',
      'ضد قارچ': 'AF'
    }
    parts.push(categoryMap[selectedMedicine.value.category] || 'XX')
  }
  
  // برند (اختیاری)
  if (selectedBrand.value) {
    const brandCode = selectedBrand.value.id.substring(0, 2).toUpperCase()
    parts.push(brandCode)
  }
  
  // شناسه یکتا
  const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase()
  parts.push(uniqueId)
  
  return parts.join('-')
})

// Methods
const toggleDropdown = (dropdown: string) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown
}

const selectAnimal = (animal: Animal) => {
  selectedAnimal.value = animal
  openDropdown.value = null
  
  // ریست ویژگی‌ها
  selectedDosage.value = null
  selectedForm.value = null
  selectedPackageSize.value = null
  selectedSpecialAttributes.value = []
  selectedBrand.value = null
  selectedMedicine.value = null
}

const selectMedicine = (medicine: Medicine) => {
  selectedMedicine.value = medicine
  openDropdown.value = null
}

const selectPrescription = (option: Attribute) => {
  selectedPrescription.value = option
  openDropdown.value = null
}

const selectBrand = (brand: Brand) => {
  selectedBrand.value = brand
  openDropdown.value = null
}

const selectDosage = (item: Attribute) => {
  selectedDosage.value = item
  openDropdown.value = null
}

const selectForm = (item: Attribute) => {
  selectedForm.value = item
  openDropdown.value = null
}

const selectPackageSize = (item: Attribute) => {
  selectedPackageSize.value = item
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
