<template>
  <div class="address-selector w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/50">

    <!-- نوار جستجو -->
    <div class="relative z-20 bg-white p-3 border-b border-gray-100">
      <div class="relative flex items-center">
        <i class="ti ti-search absolute right-3 text-gray-400 text-lg"></i>
        <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="جستجوی آدرس، خیابان یا منطقه..."
            class="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
            @input="handleSearch"
        />
        <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute left-3 p-1 text-gray-400 hover:text-gray-600"
        >
          <i class="ti ti-x"></i>
        </button>
      </div>

      <!-- لیست نتایج جستجو -->
      <div v-if="searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
        <button
            v-for="result in searchResults"
            :key="result.place_id"
            @click="selectSearchResult(result)"
            class="w-full text-right px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors flex items-start gap-3 group"
        >
          <i class="ti ti-map-pin text-gray-400 group-hover:text-blue-500 mt-0.5"></i>
          <div>
            <p class="text-sm font-medium text-gray-900 group-hover:text-blue-700">{{ result.display_name }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ formatAddressDetails(result) }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- کانتینر نقشه -->
    <div class="relative h-[300px] md:h-[400px] bg-gray-100 w-full">
      <div id="map" ref="mapContainer" class="w-full h-full z-10"></div>

      <!-- نشانگر موقعیت فعلی -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-none">
        <div class="relative">
          <div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
            <i class="ti ti-map-pin text-white text-lg"></i>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>

      <!-- دکمه موقعیت مکانی من -->
      <button
          @click="locateUser"
          class="absolute bottom-4 right-4 z-[400] bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
          title="موقعیت فعلی من"
      >
        <i class="ti ti-current-location text-xl"></i>
      </button>
    </div>

    <!-- اطلاعات آدرس انتخاب شده -->
    <div class="p-4 bg-gray-50 border-t border-gray-100">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i class="ti ti-map-pin text-blue-600"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500 font-medium mb-1">آدرس دقیق انتخاب شده:</p>
          <p class="text-sm font-semibold text-gray-900 leading-relaxed break-words">
            {{ modelValue.address || 'روی نقشه کلیک کنید یا جستجو کنید...' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// --- Props & Emits ---
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

// --- State ---
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)
let mapInstance = null

// --- Methods ---

// 1. راه‌اندازی نقشه
const initMap = () => {
  if (!mapContainer.value) return

  // مختصات پیش‌فرض (تهران)
  const defaultLat = 35.6892
  const defaultLng = 51.3890

  mapInstance = L.map(mapContainer.value, {
    center: [defaultLat, defaultLng],
    zoom: 13,
    zoomControl: false // کنترل زوم را مخفی می‌کنیم تا تمیزتر باشد
  })

  // اضافه کردن لایه نقشه (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(mapInstance)

  // اضافه کردن کنترل زوم در مکان دلخواه
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(mapInstance)

  // رویداد کلیک روی نقشه
  mapInstance.on('click', (e) => {
    updateLocation(e.latlng.lat, e.latlng.lng)
  })

  // اگر موقعیت قبلی وجود دارد، مارکر را بگذار
  if (props.modelValue?.location?.lat && props.modelValue?.location?.lng) {
    updateLocation(props.modelValue.location.lat, props.modelValue.location.lng, false)
  }
}

// 2. بروزرسانی موقعیت و معکوس کردن جغرافیایی (Reverse Geocoding)
const updateLocation = async (lat, lng, moveMap = true) => {
  if (moveMap && mapInstance) {
    mapInstance.setView([lat, lng], 16)
  }

  // بروزرسانی مدل
  const newLocation = { lat, lng }
  emit('update:modelValue', {
    ...props.modelValue,
    location: newLocation,
    lat: lat, // برای سازگاری بیشتر
    lng: lng
  })

  // دریافت نام خیابان و منطقه از مختصات (Reverse Geocoding)
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=fa`)
    const data = await response.json()

    if (data && data.display_name) {
      emit('update:modelValue', {
        ...props.modelValue,
        location: newLocation,
        address: data.display_name,
        address_text: data.display_name, // فیلد پشتیبان
        city: data.address?.city || data.address?.town || data.address?.county || '',
        province: data.address?.state || ''
      })
    }
  } catch (error) {
    console.error('Error fetching address:', error)
  }
}

// 3. جستجو (Search)
let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=5&addressdetails=1&accept-language=fa&countrycodes=ir`)
      searchResults.value = await response.json()
    } catch (error) {
      console.error('Search error:', error)
    }
  }, 600) // تاخیر برای جلوگیری از درخواست‌های زیاد
}

const selectSearchResult = (result) => {
  searchResults.value = []
  searchQuery.value = result.display_name
  updateLocation(parseFloat(result.lat), parseFloat(result.lon))
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

// 4. موقعیت کاربر
const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          alert('دسترسی به موقعیت مکانی امکان‌پذیر نیست.')
        }
    )
  }
}

// 5. Helper
const formatAddressDetails = (item) => {
  const addr = item.address
  const parts = []
  if (addr.city) parts.push(addr.city)
  if (addr.state) parts.push(addr.state)
  return parts.join('، ')
}

// --- Lifecycle ---
onMounted(() => {
  nextTick(() => {
    initMap()
  })
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})

// واچر برای تغییرات خارجی (اگر از بیرون آدرس ست شد)
watch(() => props.modelValue?.location, (newVal) => {
  if (newVal && newVal.lat && newVal.lng && mapInstance) {
    // جلوگیری از لوپ بی‌نهایت
    const currentCenter = mapInstance.getCenter()
    if (currentCenter.lat !== newVal.lat || currentCenter.lng !== newVal.lng) {
      mapInstance.setView([newVal.lat, newVal.lng], 16)
    }
  }
}, { deep: true })

</script>

<style scoped>
/* اصلاح استایل‌های پیش‌فرض Leaflet برای راست‌چین */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
}
:deep(.leaflet-bar a) {
  background-color: white;
  color: #374151;
  border-radius: 8px;
  margin-bottom: 4px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
}
:deep(.leaflet-bar a:hover) {
  background-color: #f3f4f6;
  color: #2563eb;
}
</style>
