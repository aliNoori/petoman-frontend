<template>
  <div class="pb-24 md:pb-6">
    <!-- Header موبایل -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-arrow-right text-xl text-gray-700"></i>
          </NuxtLink>
          <span class="font-bold text-gray-900">رزرو نوبت</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            {{ onlineDoctors }} آنلاین
          </span>
        </div>
      </div>
      
      <!-- جستجو موبایل -->
      <div class="px-4 pb-3">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="جستجو دکتر یا تخصص..."
            class="w-full pr-10 pl-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
        </div>
      </div>
      
      <!-- فیلترهای سریع -->
      <div class="px-4 pb-3 flex gap-2 overflow-x-auto" style="scrollbar-width: none;">
        <button 
          @click="selectedSpecialty = ''"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          :class="selectedSpecialty === '' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'"
        >
          همه
        </button>
        <button 
          v-for="spec in specialtyOptions.slice(1)" 
          :key="spec.value"
          @click="selectedSpecialty = spec.value"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
          :class="selectedSpecialty === spec.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'"
        >
          {{ spec.label }}
        </button>
      </div>
    </div>

    <!-- Header دسکتاپ -->
    <div class="hidden lg:block bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white mb-6">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-xl"></i>
        </NuxtLink>
        <h1 class="text-2xl font-bold">رزرو نوبت</h1>
      </div>
      <p class="text-emerald-100 mr-11">دامپزشک مورد نظر خود را انتخاب کنید</p>
    </div>

    <!-- محتوای اصلی -->
    <div class="pt-36 lg:pt-0">
      <!-- Search and Filters دسکتاپ -->
      <div class="hidden lg:block bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="جستجو نام دکتر یا تخصص..."
              class="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          
          <!-- Custom Dropdown - Specialty -->
          <div class="relative">
            <button 
              @click="toggleDropdown('specialty')"
              class="w-full md:w-48 px-4 py-3 border border-gray-200 rounded-xl bg-white text-right flex items-center justify-between gap-2 hover:border-gray-300 transition-colors"
            >
              <span class="text-gray-700">{{ getSpecialtyLabel(selectedSpecialty) }}</span>
              <i class="ti ti-chevron-down text-gray-400 transition-transform" :class="{ 'rotate-180': openDropdown === 'specialty' }"></i>
            </button>
            <div 
              v-if="openDropdown === 'specialty'"
              class="absolute top-full mt-1 right-0 w-full md:w-48 bg-white border border-gray-200 rounded-xl z-50 overflow-hidden"
            >
              <button 
                v-for="item in specialtyOptions" 
                :key="item.value"
                @click="selectSpecialty(item.value)"
                class="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors flex items-center justify-between"
                :class="selectedSpecialty === item.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'"
              >
                {{ item.label }}
                <i v-if="selectedSpecialty === item.value" class="ti ti-check text-blue-600"></i>
              </button>
            </div>
          </div>

          <!-- Custom Dropdown - Sort -->
          <div class="relative">
            <button 
              @click="toggleDropdown('sort')"
              class="w-full md:w-48 px-4 py-3 border border-gray-200 rounded-xl bg-white text-right flex items-center justify-between gap-2 hover:border-gray-300 transition-colors"
            >
              <span class="text-gray-700">{{ getSortLabel(sortBy) }}</span>
              <i class="ti ti-chevron-down text-gray-400 transition-transform" :class="{ 'rotate-180': openDropdown === 'sort' }"></i>
            </button>
            <div 
              v-if="openDropdown === 'sort'"
              class="absolute top-full mt-1 right-0 w-full md:w-48 bg-white border border-gray-200 rounded-xl z-50 overflow-hidden"
            >
              <button 
                v-for="item in sortOptions" 
                :key="item.value"
                @click="selectSort(item.value)"
                class="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors flex items-center justify-between"
                :class="sortBy === item.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'"
              >
                {{ item.label }}
                <i v-if="sortBy === item.value" class="ti ti-check text-blue-600"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Online Doctors Badge دسکتاپ -->
      <div class="hidden lg:flex items-center gap-2 mb-4">
        <span class="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {{ onlineDoctors }} دکتر آنلاین
        </span>
        <span class="text-gray-500 text-sm">از {{ doctors.length }} دکتر</span>
      </div>

      <!-- Doctors Grid موبایل -->
      <div class="lg:hidden grid grid-cols-2 gap-3 px-4">
        <div 
          v-for="doctor in filteredDoctors" 
          :key="doctor.id"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all active:scale-[0.98]"
          @click="selectDoctor(doctor.id)"
        >
          <!-- آواتار و وضعیت -->
          <div class="p-3 pb-2">
            <div class="flex items-start gap-2">
              <div class="relative shrink-0">
                <img 
                  :src="doctor.avatar" 
                  :alt="doctor.name"
                  class="w-12 h-12 rounded-xl object-cover"
                >
                <div 
                  class="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                  :class="doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <h3 class="font-bold text-gray-900 text-sm truncate">{{ doctor.name }}</h3>
                  <i v-if="doctor.isVerified" class="ti ti-circle-check-filled text-blue-500 text-xs"></i>
                </div>
                <p class="text-xs text-gray-500 truncate">{{ doctor.specialty }}</p>
              </div>
            </div>
          </div>
          
          <!-- امتیاز و آمار -->
          <div class="px-3 pb-2">
            <div class="flex items-center gap-2 text-xs">
              <div class="flex items-center gap-0.5 text-yellow-500">
                <i class="ti ti-star-filled text-[10px]"></i>
                <span class="text-gray-700 font-medium">{{ doctor.rating }}</span>
              </div>
              <span class="text-gray-300">|</span>
              <span class="text-gray-500">{{ doctor.experience }} سال</span>
            </div>
          </div>
          
          <!-- قیمت و دکمه -->
          <div class="px-3 pb-3 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[10px] text-gray-400">شروع از</p>
                <p class="text-sm font-bold text-emerald-600">{{ (doctor.minPrice / 1000).toLocaleString('fa-IR') }}ت</p>
              </div>
              <button class="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium">
                انتخاب
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Doctors Grid دسکتاپ -->
      <div class="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="doctor in filteredDoctors" 
          :key="doctor.id"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-400 cursor-pointer transition-all group"
          @click="selectDoctor(doctor.id)"
        >
          <!-- Doctor Header -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-start gap-4">
              <div class="relative shrink-0">
                <img 
                  :src="doctor.avatar" 
                  :alt="doctor.name"
                  class="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                >
                <div 
                  class="absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-white"
                  :class="doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900 truncate">{{ doctor.name }}</h3>
                  <i v-if="doctor.isVerified" class="ti ti-circle-check-filled text-blue-500"></i>
                </div>
                <p class="text-sm text-gray-600">{{ doctor.specialty }}</p>
                <div class="flex items-center gap-3 mt-2 text-sm">
                  <div class="flex items-center gap-1 text-yellow-500">
                    <i class="ti ti-star-filled"></i>
                    <span class="text-gray-700 font-medium">{{ doctor.rating }}</span>
                    <span class="text-gray-400">({{ doctor.reviewsCount }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Doctor Stats -->
          <div class="px-4 py-3 bg-gray-50 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p class="text-gray-500">تجربه</p>
              <p class="font-bold text-gray-900">{{ doctor.experience }} سال</p>
            </div>
            <div>
              <p class="text-gray-500">بیماران</p>
              <p class="font-bold text-gray-900">{{ doctor.patientsCount }}+</p>
            </div>
            <div>
              <p class="text-gray-500">پاسخ</p>
              <p class="font-bold text-gray-900">{{ doctor.responseTime }} دقیقه</p>
            </div>
          </div>

          <!-- Services Preview -->
          <div class="p-4">
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="service in doctor.services.slice(0, 3)" 
                :key="service"
                class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
              >
                {{ service }}
              </span>
              <span 
                v-if="doctor.services.length > 3"
                class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                +{{ doctor.services.length - 3 }}
              </span>
            </div>

            <!-- Price & Action -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-gray-500">شروع از</p>
                <p class="text-lg font-bold text-emerald-600">{{ doctor.minPrice.toLocaleString('fa-IR') }} <span class="text-sm font-normal">تومان</span></p>
              </div>
              <button class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors group-hover:scale-105 transform">
                انتخاب دکتر
                <i class="ti ti-chevron-left mr-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredDoctors.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200 mx-4 lg:mx-0">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-search text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">دکتری یافت نشد</h3>
        <p class="text-gray-500 mb-4 text-sm">لطفاً فیلترهای جستجو را تغییر دهید</p>
        <button @click="clearFilters" class="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium">
          پاک کردن فیلترها
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'رزرو نوبت دامپزشکی - پتومن',
  meta: [
    { name: 'description', content: 'رزرو نوبت آنلاین دامپزشکی، مشاوره تلفنی و حضوری با بهترین دامپزشکان' }
  ]
})

// Dropdown state
const openDropdown = ref(null)

// Dropdown options
const specialtyOptions = [
  { value: '', label: 'همه تخصص‌ها' },
  { value: 'general', label: 'عمومی' },
  { value: 'surgery', label: 'جراحی' },
  { value: 'internal', label: 'داخلی' },
  { value: 'exotic', label: 'حیوانات اگزوتیک' },
  { value: 'dermatology', label: 'پوست' }
]

const sortOptions = [
  { value: 'rating', label: 'بالاترین امتیاز' },
  { value: 'price', label: 'کمترین قیمت' },
  { value: 'response', label: 'سریع‌ترین پاسخ' },
  { value: 'patients', label: 'بیشترین بیمار' }
]

// Dropdown methods
const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectSpecialty = (value) => {
  selectedSpecialty.value = value
  openDropdown.value = null
}

const selectSort = (value) => {
  sortBy.value = value
  openDropdown.value = null
}

const getSpecialtyLabel = (value) => {
  return specialtyOptions.find(o => o.value === value)?.label || 'همه تخصص‌ها'
}

const getSortLabel = (value) => {
  return sortOptions.find(o => o.value === value)?.label || 'بالاترین امتیاز'
}

// Close dropdown on outside click
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    openDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Filters
const searchQuery = ref('')
const selectedSpecialty = ref('')
const sortBy = ref('rating')

// Doctors data
const doctors = ref([
  {
    id: 1,
    name: 'دکتر علی احمدی',
    avatar: 'https://i.pravatar.cc/150?img=11',
    specialty: 'متخصص حیوانات خانگی',
    specialtyCode: 'general',
    rating: 4.9,
    reviewsCount: 246,
    experience: 12,
    patientsCount: 1850,
    responseTime: 5,
    isOnline: true,
    isVerified: true,
    services: ['گفتگوی متنی', 'تماس تلفنی', 'ویزیت حضوری', 'ویزیت در منزل'],
    minPrice: 120000
  },
  {
    id: 2,
    name: 'دکتر مریم رضایی',
    avatar: 'https://i.pravatar.cc/150?img=5',
    specialty: 'جراح دامپزشک',
    specialtyCode: 'surgery',
    rating: 4.8,
    reviewsCount: 189,
    experience: 8,
    patientsCount: 920,
    responseTime: 10,
    isOnline: true,
    isVerified: true,
    services: ['گفتگوی متنی', 'تماس تلفنی', 'ویزیت حضوری'],
    minPrice: 150000
  },
  {
    id: 3,
    name: 'دکتر حسن کریمی',
    avatar: 'https://i.pravatar.cc/150?img=12',
    specialty: 'متخصص بیماری‌های داخلی',
    specialtyCode: 'internal',
    rating: 4.7,
    reviewsCount: 312,
    experience: 15,
    patientsCount: 2100,
    responseTime: 8,
    isOnline: false,
    isVerified: true,
    services: ['گفتگوی متنی', 'تماس تلفنی'],
    minPrice: 100000
  },
  {
    id: 4,
    name: 'دکتر سارا موسوی',
    avatar: 'https://i.pravatar.cc/150?img=9',
    specialty: 'متخصص حیوانات اگزوتیک',
    specialtyCode: 'exotic',
    rating: 4.9,
    reviewsCount: 98,
    experience: 6,
    patientsCount: 450,
    responseTime: 15,
    isOnline: true,
    isVerified: true,
    services: ['گفتگوی متنی', 'ویزیت در منزل'],
    minPrice: 200000
  },
  {
    id: 5,
    name: 'دکتر محمد نوری',
    avatar: 'https://i.pravatar.cc/150?img=13',
    specialty: 'متخصص پوست',
    specialtyCode: 'dermatology',
    rating: 4.6,
    reviewsCount: 156,
    experience: 10,
    patientsCount: 780,
    responseTime: 12,
    isOnline: false,
    isVerified: false,
    services: ['گفتگوی متنی', 'تماس تلفنی', 'ویزیت حضوری'],
    minPrice: 130000
  },
  {
    id: 6,
    name: 'دکتر زهرا کاظمی',
    avatar: 'https://i.pravatar.cc/150?img=25',
    specialty: 'متخصص حیوانات خانگی',
    specialtyCode: 'general',
    rating: 4.8,
    reviewsCount: 203,
    experience: 9,
    patientsCount: 1200,
    responseTime: 7,
    isOnline: true,
    isVerified: true,
    services: ['گفتگوی متنی', 'تماس تلفنی', 'ویزیت در منزل'],
    minPrice: 110000
  }
])

// Computed
const onlineDoctors = computed(() => doctors.value.filter(d => d.isOnline).length)

const filteredDoctors = computed(() => {
  let result = doctors.value.filter(doctor => {
    const matchesSearch = !searchQuery.value || 
      doctor.name.includes(searchQuery.value) || 
      doctor.specialty.includes(searchQuery.value)
    
    const matchesSpecialty = !selectedSpecialty.value || 
      doctor.specialtyCode === selectedSpecialty.value
    
    return matchesSearch && matchesSpecialty
  })

  // Sorting
  switch (sortBy.value) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'price':
      result.sort((a, b) => a.minPrice - b.minPrice)
      break
    case 'response':
      result.sort((a, b) => a.responseTime - b.responseTime)
      break
    case 'patients':
      result.sort((a, b) => b.patientsCount - a.patientsCount)
      break
  }

  return result
})

// Actions
const selectDoctor = (doctorId) => {
  navigateTo(`/booking/${doctorId}`)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedSpecialty.value = ''
  sortBy.value = 'rating'
}
</script>
