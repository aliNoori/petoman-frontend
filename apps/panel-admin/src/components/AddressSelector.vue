<template>
  <div>
    <!-- Address Selection Button -->
    <button
      @click="openModal"
      :class="buttonClass"
      class="w-full px-4 border border-gray-200 rounded-xl text-right hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-colors flex items-center"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <i class="ti ti-map-pin text-blue-500"></i>
          <span v-if="modelValue.city" class="text-gray-900">
            {{ modelValue.city }}
          </span>
          <span v-else class="text-gray-400">{{ placeholder }}</span>
        </div>
        <i class="ti ti-chevron-left text-gray-400"></i>
      </div>
    </button>

    <!-- Map Modal -->
    <Teleport to="body">
      <div v-if="showMapModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-4xl w-full h-[750px] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-500"></i>
            </button>
          </div>

          <!-- City Selector -->
          <div class="p-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center gap-3">

              <UiUSelectMenu
                v-model="selectedMapCity"
                :options="allCitiesOptions"
                placeholder="انتخاب شهر"
                :searchable="true"
                search-placeholder="جستجوی شهر..."
                @update:modelValue="onMapCityChange"
                class="flex-1"
              />
              <button
                @click="getCurrentLocation"
                class="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                <i class="ti ti-current-location ml-1"></i>
                موقعیت فعلی
              </button>
            </div>
          </div>

          <!-- Map Container -->
          <div class="flex-1 relative">
            <div :id="mapContainerId" :key="mapContainerId" class="w-full h-full"></div>

            <!-- Current Location Button -->
            <button
              @click="getCurrentLocation"
              class="absolute bottom-20 right-4 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
              title="موقعیت من"
            >
              <i class="ti ti-current-location text-xl text-blue-500"></i>
            </button>

            <div class="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 text-sm">
              <p class="text-gray-600 mb-1">برای انتخاب موقعیت، روی نقشه کلیک کنید</p>
              <p v-if="tempAddress" class="text-gray-900 font-medium">{{ tempAddress }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
            <button
              @click="closeModal"
              class="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
            <button
              @click="confirmLocation"
              :disabled="!tempLocation"
              class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تایید موقعیت
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { iranCitiesData } from '../data/iran-cities.js'
import UiUSelectMenu from '@/components/ui/USelectMenu.vue'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      address: '',
      province: '',
      city: '',
      location: null // {lat, lng}
    })
  },
  placeholder: {
    type: String,
    default: 'روی نقشه موقعیت را انتخاب کنید'
  },
  title: {
    type: String,
    default: 'انتخاب موقعیت'
  },
  buttonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Generate unique map container ID
const mapContainerId = ref(`address-map-${Math.random().toString(36).substr(2, 9)}`)

const showMapModal = ref(false)
const selectedMapCity = ref('')
const tempLocation = ref(null)
const tempAddress = ref('')
const addressParts=ref({})
const mapInstance = ref(null)

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
const openModal = () => {
  showMapModal.value = true
  tempLocation.value = null
  tempAddress.value = ''
  selectedMapCity.value = ''
}

const initMap = async () => {
  if (mapInstance.value || !showMapModal.value) return

  // ۱. صبر کن تا Vue کامپوننت را رندر کند
  //await nextTick()

  // ۲. صبر کن تا DOM کاملاً در صفحه قرار گیرد (چون Teleport دارد)
  await new Promise(resolve => setTimeout(resolve, 100))

  const container = document.getElementById(mapContainerId.value)

  if (!container) {
    console.error('Map container not found in DOM')
    return
  }

  // ۳. بررسی لود شدن اسکریپت
  if (!window.mapboxgl) {
    const script = document.createElement('script')
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
    script.onload = () => {
      const link = document.createElement('link')
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      createMap(container)
    }
    document.head.appendChild(script)
  } else {
    createMap(container)
  }
}

const createMap = (container) => {
  if (!window.mapboxgl || !container) return

  window.mapboxgl.accessToken = 'pk.eyJ1IjoiYmFiYXdlYiIsImEiOiJjazhwM201OXEweXU1M2VyeHozMHM3M3BrIn0.DuvjLzA_Knm6g4cjKzSVMQ'

  if (!window.mapboxgl.getRTLTextPluginStatus || window.mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
    window.mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true
    )
  }

  // پاکسازی قبلی
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }

  // *** تغییر مهم: ست کردن دستی ارتفاع و عرض قبل از ساخت نقشه ***
  // چون Teleport باعث قطع شدن زنجیره flex می‌شود، باید ابعاد را دستی بدهیم
  // مودال شما h-[600px] است، پس نقشه باید حدود ۶۰۰ پیکسل ارتفاع داشته باشد
  // (کمی کمتر از ۶۰۰ چون هدر و فوتر دارد)
  container.style.height = '500px'
  container.style.width = '100%'

  mapInstance.value = new window.mapboxgl.Map({
    container: container.id, // یا خود اشیاء container
    style: 'https://api.maptiler.com/maps/019a608b-fabf-7fcb-bcec-ff6e8a08b5ab/style.json?key=HTMa05qfktg8OBQdL2hA',
    center: [51.3378, 35.6997],
    zoom: 14,
    attributionControl: false,
    maxBounds: [[44.0, 25.0], [63.5, 39.8]]
  })

  // ریسایز نهایی برای اطمینان
  setTimeout(() => {
    if (mapInstance.value) {
      mapInstance.value.resize()
    }
  }, 50)

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

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`
    )
    const data = await response.json()

    if (data && data.address && data.display_name) {
      tempAddress.value=data.display_name

      addressParts.value = data || {}
      const city = data.city || data.address.city || data.address.town || data.address.village || ''
      if (city) selectedMapCity.value = city
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    tempAddress.value = `موقعیت: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

const onMapCityChange = (cityValue) => {
  if (!cityValue || !mapInstance.value) return

  const cityOption = allCitiesOptions.value.find(c => c.value === cityValue)
  if (!cityOption) return

  const coords = cityCoordinates[cityOption.value]
  if (coords) {
    mapInstance.value.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 12,
      essential: true
    })
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

const confirmLocation = () => {
  if (!tempLocation.value) return

  const cityOption = allCitiesOptions.value.find(c => c.value === selectedMapCity.value)

  emit('update:modelValue', {
    address: addressParts.value,
    province: cityOption?.province || '',
    city: selectedMapCity.value,
    location: tempLocation.value
  })

  closeModal()
}

const closeModal = () => {
  showMapModal.value = false
  tempLocation.value = null
  tempAddress.value = ''
  selectedMapCity.value = ''

  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }

  // Remove body scroll lock
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
}

// Watch for modal opening
watch(showMapModal, (newVal) => {
  if (newVal) {
    setTimeout(() => initMap(), 100)

    // Lock body scroll when modal opens
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    // Unlock body scroll when modal closes
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }
})

// Cleanup
onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
})
</script>

<style scoped>
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
