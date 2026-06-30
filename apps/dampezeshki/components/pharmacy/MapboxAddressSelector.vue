<template>
  <div class="space-y-4">
    <!-- Search Box -->
    <div class="relative">
      <div class="flex gap-3">
        <div class="relative group flex-1">
          <input
            v-model="searchQuery"
            @input="handleSearchInput"
            @focus="showResults = true"
            placeholder="جستجوی آدرس..."
            class="w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 transition-all duration-300 outline-none border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
          <i class="ti ti-map-search absolute left-4 top-4 text-xl text-gray-400 transition-colors group-hover:text-sky-500"></i>
          
          <div v-if="isSearching" class="absolute left-12 top-4 animate-spin">
            <i class="ti ti-loader text-sky-500"></i>
          </div>
        </div>

        <button 
          @click="getCurrentLocation"
          :disabled="isGettingLocation"
          class="px-4 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 transition-all text-white flex items-center gap-2 disabled:opacity-50"
          title="موقعیت من"
        >
          <i class="ti ti-current-location text-xl" :class="{ 'animate-pulse': isGettingLocation }"></i>
        </button>
      </div>

      <!-- Search Results -->
      <div 
        v-if="showResults && searchResults.length > 0" 
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200"
      >
        <ul class="py-2">
          <li 
            v-for="(result, index) in searchResults" 
            :key="index"
            @click="selectSearchResult(result)"
            class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
          >
            <div class="flex items-start gap-3">
              <i class="ti ti-map-pin text-sky-500 mt-0.5"></i>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ result.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5 truncate">{{ result.address }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Map Container -->
    <div class="relative rounded-xl overflow-hidden border border-gray-200" style="height: 350px;">
      <div ref="mapContainer" class="w-full h-full" :id="mapId"></div>
      
      <!-- Center Marker -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
        <div class="flex flex-col items-center">
          <i class="ti ti-map-pin-filled text-4xl text-red-500 drop-shadow-lg"></i>
          <div class="w-2 h-2 bg-red-500 rounded-full -mt-1 shadow-lg"></div>
        </div>
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="isLoadingMap || isLoadingAddress" class="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
        <div class="flex items-center gap-2 text-gray-600">
          <i class="ti ti-loader animate-spin text-xl"></i>
          <span>{{ isLoadingMap ? 'در حال بارگذاری نقشه...' : 'در حال دریافت آدرس...' }}</span>
        </div>
      </div>
    </div>

    <!-- Selected Address Display -->
    <div v-if="selectedAddress" class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div class="flex items-start gap-3">
        <i class="ti ti-check-circle text-emerald-500 text-xl mt-0.5"></i>
        <div class="flex-1">
          <p class="font-medium text-emerald-800">آدرس انتخاب شده:</p>
          <p class="text-sm text-emerald-700 mt-1">{{ selectedAddress }}</p>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <p class="text-sm text-gray-500 flex items-center gap-2">
      <i class="ti ti-info-circle"></i>
      نقشه را جابجا کنید تا مارکر روی موقعیت مورد نظر قرار گیرد
    </p>
  </div>
</template>

<script setup>
const emit = defineEmits(['location-selected'])

// Mapbox Access Token
const MAPBOX_TOKEN = 'pk.eyJ1IjoicGV0b21hbiIsImEiOiJjbTRvNnBhaDkwNTVsMmpzOGFld3d3OXZ5In0.Wq0VVUZ8YkFVmVjDSwrW1Q'

// State
const mapId = `map-${Math.random().toString(36).substr(2, 9)}`
const mapContainer = ref(null)
let map = null
let mapboxgl = null
const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const isSearching = ref(false)
const isGettingLocation = ref(false)
const isLoadingAddress = ref(false)
const isLoadingMap = ref(true)
const selectedAddress = ref('')
const currentLocation = ref({ lat: 35.6892, lng: 51.3890 }) // Tehran default

let searchTimeout = null
let moveEndTimeout = null

// Load Mapbox CSS dynamically
const loadMapboxCSS = () => {
  if (document.getElementById('mapbox-css')) return
  const link = document.createElement('link')
  link.id = 'mapbox-css'
  link.rel = 'stylesheet'
  link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css'
  document.head.appendChild(link)
}

// Initialize Map (only on client)
onMounted(async () => {
  if (typeof window === 'undefined') return
  
  // Load CSS first
  loadMapboxCSS()
  
  try {
    // Dynamic import of mapbox-gl
    const mapboxModule = await import('mapbox-gl')
    mapboxgl = mapboxModule.default
    
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    // RTL plugin for Persian/Arabic support
    if (!mapboxgl.getRTLTextPluginStatus || mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true
      )
    }
    
    // Wait for container to be ready
    await nextTick()
    
    const container = document.getElementById(mapId)
    if (!container) {
      console.error('Map container not found')
      isLoadingMap.value = false
      return
    }
    
    map = new mapboxgl.Map({
      container: mapId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [currentLocation.value.lng, currentLocation.value.lat],
      zoom: 14,
      attributionControl: false
    })
    
    map.on('load', () => {
      isLoadingMap.value = false
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
    })
    
    map.on('error', (e) => {
      console.error('Map error:', e)
      isLoadingMap.value = false
    })
    
    // Get address when map stops moving
    map.on('moveend', () => {
      if (moveEndTimeout) clearTimeout(moveEndTimeout)
      moveEndTimeout = setTimeout(() => {
        const center = map.getCenter()
        currentLocation.value = { lat: center.lat, lng: center.lng }
        reverseGeocode(center.lat, center.lng)
      }, 500)
    })
    
  } catch (error) {
    console.error('Failed to load Mapbox:', error)
    isLoadingMap.value = false
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  document.removeEventListener('click', handleClickOutside)
})

// Search with Mapbox Geocoding
const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!searchQuery.value || searchQuery.value.trim().length < 3) {
    searchResults.value = []
    showResults.value = false
    return
  }
  
  searchTimeout = setTimeout(() => searchLocation(), 500)
}

const searchLocation = async () => {
  isSearching.value = true
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?` +
      `access_token=${MAPBOX_TOKEN}&country=ir&language=fa&limit=5`
    )
    
    if (response.ok) {
      const data = await response.json()
      searchResults.value = data.features.map(f => ({
        title: f.text,
        address: f.place_name,
        lat: f.center[1],
        lng: f.center[0]
      }))
      showResults.value = true
    }
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const selectSearchResult = (result) => {
  if (map) {
    map.flyTo({
      center: [result.lng, result.lat],
      zoom: 16
    })
  }
  
  searchQuery.value = result.title
  showResults.value = false
  selectedAddress.value = result.address
  
  emit('location-selected', {
    address: result.address,
    lat: result.lat,
    lng: result.lng,
    title: result.title
  })
}

// Reverse Geocode
const reverseGeocode = async (lat, lng) => {
  isLoadingAddress.value = true
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
      `access_token=${MAPBOX_TOKEN}&language=fa&limit=1`
    )
    
    if (response.ok) {
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        const place = data.features[0]
        selectedAddress.value = place.place_name
        
        // Extract province and city from context
        let province = ''
        let city = ''
        
        if (place.context) {
          for (const ctx of place.context) {
            if (ctx.id.startsWith('region')) province = ctx.text
            if (ctx.id.startsWith('place')) city = ctx.text
          }
        }
        
        emit('location-selected', {
          address: place.place_name,
          lat: lat,
          lng: lng,
          title: place.text,
          province,
          city
        })
      }
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
  } finally {
    isLoadingAddress.value = false
  }
}

// Get Current Location
const getCurrentLocation = () => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    alert('مرورگر شما از GPS پشتیبانی نمی‌کند')
    return
  }
  
  isGettingLocation.value = true
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      if (map) {
        map.flyTo({
          center: [lng, lat],
          zoom: 16
        })
      }
      
      isGettingLocation.value = false
    },
    (error) => {
      isGettingLocation.value = false
      let msg = 'امکان دریافت موقعیت وجود ندارد'
      if (error.code === error.PERMISSION_DENIED) {
        msg = 'دسترسی به موقعیت مکانی رد شد'
      }
      alert(msg)
    },
    { enableHighAccuracy: true, timeout: 15000 }
  )
}

// Close results when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showResults.value = false
  }
}
</script>

<style>
/* Mapbox RTL fixes */
.mapboxgl-ctrl-bottom-left {
  left: auto;
  right: 10px;
}

.mapboxgl-ctrl-bottom-right {
  display: none;
}
</style>
