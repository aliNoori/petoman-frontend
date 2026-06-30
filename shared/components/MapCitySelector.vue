<template>
  <div class="relative">
    <!-- City Button -->
    <button 
      @click="showDrawer = true"
      :class="buttonClass"
      class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
    >
      <i class="ti ti-map-pin text-base" :class="iconColor"></i>
      <span>{{ selectedCity || placeholder }}</span>
      <i 
        class="ti ti-chevron-down text-xs transition-transform duration-200"
        :class="{ 'rotate-180': showDrawer }"
      ></i>
    </button>

    <!-- Drawer Overlay -->
    <Teleport to="body">
      <div 
        class="fixed inset-0 z-50 overflow-hidden transition-all duration-300 ease-in-out"
        :class="showDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'"
        @click="closeDrawer"
      >
        <!-- Background Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Drawer Panel -->
        <div 
          class="absolute top-0 left-0 h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col"
          :class="showDrawer ? 'translate-x-0' : '-translate-x-full'"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200" :class="headerClass">
            <div class="flex items-center gap-2">
              <i class="ti ti-map-pin text-xl"></i>
              <h3 class="text-lg font-semibold">{{ title }}</h3>
            </div>
            <button @click="closeDrawer" class="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>

          <!-- City Selector & Map Container -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- City Search Dropdown -->
            <div class="p-3 bg-gray-50 border-b border-gray-200">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  placeholder="جستجوی شهر..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  @focus="showSearchResults = true"
                >
                <i class="ti ti-search absolute left-3 top-3.5 text-gray-400"></i>
              </div>
              
              <!-- Search Results Dropdown -->
              <div 
                v-if="showSearchResults && searchQuery"
                class="absolute left-3 right-3 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-10"
              >
                <button
                  v-for="city in filteredCities"
                  :key="city.value"
                  @click="selectCityFromSearch(city)"
                  class="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  <div>
                    <div class="text-gray-900 font-medium">{{ city.value }}</div>
                    <div class="text-xs text-gray-500">{{ city.province }}</div>
                  </div>
                  <i 
                    v-if="selectedCity === city.value" 
                    class="ti ti-check text-blue-500"
                  ></i>
                </button>
                <div v-if="filteredCities.length === 0" class="px-4 py-8 text-center text-gray-500">
                  <i class="ti ti-map-off text-3xl mb-2 block"></i>
                  <p>شهری یافت نشد</p>
                </div>
              </div>
            </div>

            <!-- Map Container -->
            <div class="flex-1 relative">
              <div id="map-city-selector" class="w-full h-full"></div>
              
              <!-- Current Location Button -->
              <button
                @click="getCurrentLocation"
                class="absolute bottom-20 right-4 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                title="موقعیت من"
              >
                <i class="ti ti-current-location text-xl text-blue-500"></i>
              </button>

              <!-- Selected Address Overlay -->
              <div 
                v-if="tempAddress"
                class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl"
              >
                <div class="flex items-start gap-3">
                  <i class="ti ti-map-pin text-blue-500 text-xl flex-shrink-0 mt-1"></i>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-500 mb-1">آدرس انتخاب شده:</p>
                    <p class="text-sm text-gray-900 font-medium line-clamp-2">{{ tempAddress }}</p>
                    <p v-if="tempCity" class="text-xs text-blue-600 mt-1">{{ tempCity }}</p>
                  </div>
                  <button
                    @click="confirmSelection"
                    class="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
                  >
                    تایید
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { iranCitiesData } from '~/data/iran-cities-complete'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'انتخاب شهر'
  },
  title: {
    type: String,
    default: 'انتخاب شهر از روی نقشه'
  },
  headerClass: {
    type: String,
    default: 'bg-blue-500 text-white'
  },
  iconColor: {
    type: String,
    default: 'text-blue-500'
  },
  buttonClass: {
    type: String,
    default: 'text-gray-600 hover:text-gray-900'
  },
  mapStyle: {
    type: String,
    default: 'maptiler' // or 'mapbox'
  }
})

const emit = defineEmits(['update:modelValue', 'citySelected'])

// State
const showDrawer = ref(false)
const showSearchResults = ref(false)
const searchQuery = ref('')
const mapInstance = ref(null)
const tempCity = ref('')
const tempProvince = ref('')
const tempAddress = ref('')
const tempLocation = ref(null)

const selectedCity = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Major cities coordinates
const cityCoordinates = {
  'تهران': { lat: 35.6892, lng: 51.3890 },
  'مشهد': { lat: 36.2605, lng: 59.6168 },
  'اصفهان': { lat: 32.6546, lng: 51.6680 },
  'شیراز': { lat: 29.5918, lng: 52.5836 },
  'تبریز': { lat: 38.0800, lng: 46.2919 },
  'کرج': { lat: 35.8327, lng: 50.9916 },
  'اهواز': { lat: 31.3183, lng: 48.6706 },
  'قم': { lat: 34.6416, lng: 50.8746 },
  'کرمان': { lat: 30.2839, lng: 57.0834 },
  'رشت': { lat: 37.2808, lng: 49.5832 },
  'زاهدان': { lat: 29.4963, lng: 60.8629 },
  'همدان': { lat: 34.7992, lng: 48.5146 },
  'یزد': { lat: 31.8974, lng: 54.3569 },
  'اردبیل': { lat: 38.2498, lng: 48.2933 },
  'بندرعباس': { lat: 27.1832, lng: 56.2666 },
  'ارومیه': { lat: 37.5527, lng: 45.0761 },
  'کرمانشاه': { lat: 34.3142, lng: 47.0650 },
  'قزوین': { lat: 36.2797, lng: 50.0034 },
  'ساری': { lat: 36.5633, lng: 53.0601 },
  'اراک': { lat: 34.0917, lng: 49.6892 },
}

// All cities for search
const allCitiesOptions = computed(() => {
  const allCities = []
  Object.entries(iranCitiesData).forEach(([province, data]) => {
    data.cities.forEach(city => {
      allCities.push({
        value: city,
        label: `${city} - ${province}`,
        province: province
      })
    })
  })
  return allCities.sort((a, b) => a.label.localeCompare(b.label, 'fa'))
})

// Filtered cities
const filteredCities = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase().trim()
  return allCitiesOptions.value.filter(city => 
    city.value.toLowerCase().includes(query) || 
    city.province.toLowerCase().includes(query)
  )
})

// Map API URLs and Keys
const mapConfig = computed(() => {
  if (props.mapStyle === 'mapbox') {
    return {
      scriptUrl: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js',
      cssUrl: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css',
      accessToken: 'pk.eyJ1IjoiYmFiYXdlYiIsImEiOiJjazhwM201OXEweXU1M2VyeHozMHM3M3BrIn0.DuvjLzA_Knm6g4cjKzSVMQ',
      style: 'mapbox://styles/mapbox/streets-v12'
    }
  } else {
    // MapTiler
    return {
      scriptUrl: 'https://cdn.maptiler.com/maptiler-sdk-js/v1.2.0/maptiler-sdk.umd.js',
      cssUrl: 'https://cdn.maptiler.com/maptiler-sdk-js/v1.2.0/maptiler-sdk.css',
      accessToken: 'HTMa05qfktg8OBQdL2hA',
      style: 'https://api.maptiler.com/maps/019a608b-fabf-7fcb-bcec-ff6e8a08b5ab/style.json?key=HTMa05qfktg8OBQdL2hA'
    }
  }
})

// Methods
const closeDrawer = () => {
  showDrawer.value = false
  searchQuery.value = ''
  showSearchResults.value = false
}

const selectCityFromSearch = (city) => {
  searchQuery.value = ''
  showSearchResults.value = false
  tempCity.value = city.value
  tempProvince.value = city.province
  
  // Zoom to city if coordinates available
  const coords = cityCoordinates[city.value]
  if (coords && mapInstance.value) {
    mapInstance.value.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 12,
      essential: true
    })
  }
}

const initMap = () => {
  if (mapInstance.value || !showDrawer.value) return
  
  const config = mapConfig.value
  
  // Load map library dynamically
  if (props.mapStyle === 'mapbox' && !window.mapboxgl) {
    const script = document.createElement('script')
    script.src = config.scriptUrl
    script.onload = () => {
      const link = document.createElement('link')
      link.href = config.cssUrl
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      setTimeout(() => createMapboxMap(), 100)
    }
    document.head.appendChild(script)
  } else if (props.mapStyle === 'maptiler' && !window.maptilersdk) {
    const script = document.createElement('script')
    script.src = config.scriptUrl
    script.onload = () => {
      const link = document.createElement('link')
      link.href = config.cssUrl
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      setTimeout(() => createMaptilerMap(), 100)
    }
    document.head.appendChild(script)
  } else {
    if (props.mapStyle === 'mapbox') createMapboxMap()
    else createMaptilerMap()
  }
}

const createMapboxMap = () => {
  if (!window.mapboxgl) return
  
  window.mapboxgl.accessToken = mapConfig.value.accessToken
  
  // Load RTL plugin for Persian text
  if (!window.mapboxgl.getRTLTextPluginStatus || window.mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
    window.mapboxgl.setRTLTextPlugin(
      'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      null,
      true
    )
  }
  
  // Iran bounds: [west, south, east, north]
  const iranBounds = [
    [44.0, 25.0], // Southwest coordinates
    [63.5, 39.8]  // Northeast coordinates
  ]
  
  mapInstance.value = new window.mapboxgl.Map({
    container: 'map-city-selector',
    style: 'https://api.maptiler.com/maps/019a608b-fabf-7fcb-bcec-ff6e8a08b5ab/style.json?key=HTMa05qfktg8OBQdL2hA',
    center: [51.3378, 35.6997], // Azadi Tower
    zoom: 14,
    attributionControl: false, // Remove attribution
    maxBounds: iranBounds // Restrict to Iran
  })
  
  // Don't add navigation controls
  
  let marker = null
  
  mapInstance.value.on('click', async (e) => {
    const { lng, lat } = e.lngLat
    tempLocation.value = { lat, lng }
    
    if (marker) {
      marker.setLngLat([lng, lat])
    } else {
      marker = new window.mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([lng, lat])
        .addTo(mapInstance.value)
    }
    
    await reverseGeocode(lat, lng)
  })
}

const createMaptilerMap = () => {
  if (!window.maptilersdk) return
  
  window.maptilersdk.config.apiKey = mapConfig.value.accessToken
  
  // Iran bounds: [west, south, east, north]
  const iranBounds = [
    [44.0, 25.0], // Southwest coordinates
    [63.5, 39.8]  // Northeast coordinates
  ]
  
  mapInstance.value = new window.maptilersdk.Map({
    container: 'map-city-selector',
    style: mapConfig.value.style,
    center: [51.3378, 35.6997], // Azadi Tower
    zoom: 14,
    language: 'fa', // Persian language
    attributionControl: false, // Remove attribution
    maxBounds: iranBounds // Restrict to Iran
  })
  
  // Don't add navigation controls
  
  let marker = null
  
  mapInstance.value.on('click', async (e) => {
    const { lng, lat } = e.lngLat
    tempLocation.value = { lat, lng }
    
    if (marker) {
      marker.setLngLat([lng, lat])
    } else {
      marker = new window.maptilersdk.Marker({ color: '#3b82f6' })
        .setLngLat([lng, lat])
        .addTo(mapInstance.value)
    }
    
    await reverseGeocode(lat, lng)
  })
}

const reverseGeocode = async (lat, lng) => {
  try {
    // Using Nominatim (OpenStreetMap) for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`
    )
    const data = await response.json()
    
    if (data && data.display_name) {
      tempAddress.value = data.display_name
      
      const addressParts = data.address || {}
      const city = addressParts.city || addressParts.town || addressParts.village || ''
      const province = addressParts.state || ''
      
      if (city) tempCity.value = city
      if (province) tempProvince.value = province
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    tempAddress.value = `موقعیت: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('مرورگر شما از موقعیت یابی پشتیبانی نمی‌کند')
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      
      // Check if location is within Iran bounds
      const isInIran = latitude >= 25.0 && latitude <= 39.8 && 
                       longitude >= 44.0 && longitude <= 63.5
      
      if (!isInIran) {
        alert('⚠️ لطفاً VPN خود را خاموش کنید\n\nموقعیت شما خارج از ایران است. برای استفاده از نقشه، لطفاً VPN را خاموش کنید.')
        return
      }
      
      if (mapInstance.value) {
        mapInstance.value.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true
        })
        
        mapInstance.value.fire('click', {
          lngLat: { lat: latitude, lng: longitude }
        })
      }
    },
    (error) => {
      console.error('Geolocation error:', error)
      alert('دسترسی به موقعیت مکانی رد شد')
    }
  )
}

const confirmSelection = () => {
  if (!tempCity.value) return
  
  selectedCity.value = tempCity.value
  
  emit('citySelected', {
    city: tempCity.value,
    province: tempProvince.value,
    address: tempAddress.value,
    location: tempLocation.value
  })
  
  closeDrawer()
}

// Watch for drawer opening
watch(showDrawer, (newVal) => {
  if (newVal) {
    setTimeout(() => initMap(), 100)
  }
})

// Handle ESC key
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showDrawer.value) {
    closeDrawer()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hide Mapbox/MapTiler logo and attribution */
:deep(.mapboxgl-ctrl-logo),
:deep(.mapboxgl-ctrl-attrib),
:deep(.maplibregl-ctrl-logo),
:deep(.maplibregl-ctrl-attrib),
:deep(.maptiler-logo),
:deep(.maptiler-attribution) {
  display: none !important;
}

/* Hide all map controls */
:deep(.mapboxgl-ctrl-top-right),
:deep(.mapboxgl-ctrl-bottom-right),
:deep(.mapboxgl-ctrl-bottom-left),
:deep(.maplibregl-ctrl-top-right),
:deep(.maplibregl-ctrl-bottom-right),
:deep(.maplibregl-ctrl-bottom-left) {
  display: none !important;
}
</style>
