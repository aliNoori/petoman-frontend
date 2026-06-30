<template>
  <div class="relative" dir="rtl">
    <div class="flex gap-3">
      <!-- Search Input -->
      <div class="relative group flex-1">
        <input
          v-model="searchQuery"
          @input="handleSearchInput"
          @focus="showResults = true"
          placeholder="جستجوی آدرس روی نقشه..."
          class="w-full pl-12 pr-5 py-5 rounded-2xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-300 shadow-sm outline-none border-none"
        >
        <i class="ti ti-map-search absolute left-5 top-5 text-xl text-gray-400 transition-colors group-hover:text-sky-500"></i>
        
        <!-- Loading Spinner -->
        <div v-if="isSearching" class="absolute left-14 top-6 animate-spin">
          <i class="ti ti-loader text-sky-500"></i>
        </div>
      </div>

      <!-- GPS Button -->
      <button 
        @click="getCurrentLocation"
        :disabled="isGettingLocation"
        class="px-5 py-5 rounded-2xl bg-white hover:bg-sky-50 transition-all duration-300 shadow-sm flex items-center gap-2 text-gray-700 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
        title="موقعیت من"
      >
        <i 
          class="ti ti-current-location text-xl"
          :class="{ 'animate-pulse': isGettingLocation }"
        ></i>
        <span class="text-sm font-medium hidden md:inline">موقعیت من</span>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <div 
      v-if="showResults && searchResults.length > 0" 
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <ul class="py-2">
        <li 
          v-for="(result, index) in searchResults" 
          :key="index"
          @click="selectLocation(result)"
          class="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
        >
          <div class="flex items-start gap-3">
            <i class="ti ti-map-pin text-sky-500 text-lg mt-1 flex-shrink-0"></i>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ result.title }}</p>
              <p class="text-xs text-gray-500 line-clamp-2 mt-1">{{ result.address }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- No Results Message -->
    <div 
      v-if="showResults && searchQuery && searchResults.length === 0 && !isSearching" 
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-50 p-6 text-center"
    >
      <i class="ti ti-search-off text-4xl text-gray-400 mb-2"></i>
      <p class="text-sm text-gray-600">نتیجه‌ای یافت نشد</p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['location-selected'])

const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const isSearching = ref(false)
const isGettingLocation = ref(false)
let searchTimeout = null

// API Key نشان
const NESHAN_API_KEY = 'service.30997e992bb8488689297ad4f15e8cc0'

const handleSearchInput = () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // If search query is empty, clear results
  if (!searchQuery.value || searchQuery.value.trim().length < 3) {
    searchResults.value = []
    showResults.value = false
    return
  }

  // Set new timeout for debouncing
  searchTimeout = setTimeout(() => {
    searchLocation()
  }, 500) // 500ms delay
}

const searchLocation = async () => {
  if (!searchQuery.value || searchQuery.value.trim().length < 3) {
    return
  }

  isSearching.value = true

  try {
    // جستجو با API نشان
    const response = await fetch(`https://api.neshan.org/v1/search?term=${encodeURIComponent(searchQuery.value)}&lat=35.7000&lng=51.4000`, {
      headers: {
        'Api-Key': NESHAN_API_KEY
      }
    })

    if (response.ok) {
      const data = await response.json()
      
      // Parse results
      if (data && data.items) {
        searchResults.value = data.items.map(item => ({
          title: item.title || item.neighbourhood || 'بدون عنوان',
          address: item.address || item.region || '',
          lat: item.location?.y || 0,
          lng: item.location?.x || 0,
          city: item.city || '',
          province: item.province || ''
        }))
        showResults.value = true
      } else {
        searchResults.value = []
      }
    } else {
      console.error('Neshan API error:', response.status)
      searchResults.value = []
    }
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const selectLocation = (location) => {
  // Emit selected location
  emit('location-selected', location)
  
  // Update search query
  searchQuery.value = location.title
  
  // Hide results
  showResults.value = false
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('مرورگر شما از GPS پشتیبانی نمی‌کند')
    return
  }

  isGettingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      try {
        // گرفتن آدرس از مختصات با API نشان
        const response = await fetch(`https://api.neshan.org/v1/reverse?lat=${lat}&lng=${lng}`, {
          headers: {
            'Api-Key': NESHAN_API_KEY
          }
        })

        if (response.ok) {
          const data = await response.json()
          
          let address = ''
          let title = 'موقعیت فعلی شما'
          
          if (data) {
            if (data.neighbourhood) title = data.neighbourhood
            if (data.address) address = data.address
            if (data.city && !address.includes(data.city)) {
              address += (address ? '، ' : '') + data.city
            }
          }
          
          const location = {
            title: title,
            address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat: lat,
            lng: lng,
            city: data.city || '',
            province: data.province || ''
          }
          
          emit('location-selected', location)
          searchQuery.value = title
        } else {
          // اگر نتوانست آدرس بگیرد، از مختصات استفاده کن
          const location = {
            title: 'موقعیت فعلی شما',
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat: lat,
            lng: lng,
            city: '',
            province: ''
          }
          
          emit('location-selected', location)
          searchQuery.value = 'موقعیت فعلی شما'
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error)
        
        // در صورت خطا، فقط مختصات را ارسال کن
        const location = {
          title: 'موقعیت فعلی شما',
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          lat: lat,
          lng: lng,
          city: '',
          province: ''
        }
        
        emit('location-selected', location)
        searchQuery.value = 'موقعیت فعلی شما'
      } finally {
        isGettingLocation.value = false
      }
    },
    (error) => {
      isGettingLocation.value = false
      
      let errorMessage = 'امکان دریافت موقعیت شما وجود ندارد'
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'دسترسی به موقعیت مکانی رد شد. لطفاً در تنظیمات مرورگر دسترسی را فعال کنید.'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'موقعیت مکانی در دسترس نیست'
          break
        case error.TIMEOUT:
          errorMessage = 'زمان دریافت موقعیت به پایان رسید'
          break
      }
      
      alert(errorMessage)
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  )
}

// Close results when clicking outside
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showResults.value = false
    }
  })
}
</script>

<style scoped>
/* Custom scrollbar for results */
.max-h-80::-webkit-scrollbar {
  width: 6px;
}

.max-h-80::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.max-h-80::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Pulse animation for GPS button */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
