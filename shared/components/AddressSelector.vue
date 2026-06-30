<template>
  <div>
    <!-- Address Selection Button -->
    <button
        @click="openModal"
        :class="buttonClass"
        class="w-full min-h-[56px] px-4 py-3 border border-gray-200 rounded-xl text-right
             hover:border-blue-500 focus:outline-none focus:border-blue-500
             focus:ring-4 focus:ring-blue-500/10 transition-all
             flex items-center"
    >
      <div class="flex items-center justify-between w-full gap-3">
        <div class="flex items-center gap-2 overflow-hidden">
          <i class="ti ti-map-pin text-blue-500 text-xl shrink-0"></i>

          <span
              v-if="modelValue.city"
              class="text-gray-900 truncate"
          >
            {{ modelValue.city }}
          </span>

          <span
              v-else
              class="text-gray-400 truncate"
          >
            {{ placeholder }}
          </span>
        </div>

        <i class="ti ti-chevron-left text-gray-400 shrink-0"></i>
      </div>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <div
          v-if="showMapModal"
          class="fixed inset-0 z-[99999]
               bg-black/50 backdrop-blur-sm
               flex items-center justify-center
               p-2 sm:p-4"
      >
        <div
            class="bg-white
         w-full
         max-w-5xl
         h-screen
         sm:h-auto
         sm:max-h-[90vh]
         lg:h-[750px]
         overflow-hidden
         rounded-none
         sm:rounded-2xl
         flex flex-col"
        >

          <!-- Header -->
          <div
              class="sticky top-0 z-20
                   bg-white
                   border-b border-gray-200
                   px-4 py-4
                   flex items-center justify-between"
          >
            <h3 class="font-bold text-base sm:text-lg">
              {{ title }}
            </h3>

            <button
                @click="closeModal"
                class="w-10 h-10 rounded-xl hover:bg-gray-100 transition flex items-center justify-center"
            >
              <i class="ti ti-x text-xl"></i>
            </button>
          </div>

          <!-- City -->
          <div
              class="border-b border-gray-200
                   bg-gray-50
                   p-4"
          >
            <div
                class="flex flex-col
                     sm:flex-row
                     gap-3"
            >
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
                  class="w-full sm:w-auto
                       px-5 py-3
                       rounded-xl
                       bg-blue-500
                       text-white
                       hover:bg-blue-600
                       transition"
              >
                <i class="ti ti-current-location ml-1"></i>

                موقعیت فعلی
              </button>
            </div>
          </div>

          <!-- Map -->
          <div class="flex-1 relative min-h-0">

            <div
                :id="mapContainerId"
                :key="mapContainerId"
                class="absolute inset-0"
            ></div>

            <!-- Guide -->
            <div
                class="absolute
                     top-3
                     left-3
                     right-3
                     sm:left-4
                     sm:right-4
                     bg-white/95
                     backdrop-blur
                     rounded-xl
                     shadow-lg
                     p-3"
            >
              <p class="text-xs sm:text-sm text-gray-600">
                برای انتخاب موقعیت، روی نقشه کلیک کنید
              </p>

              <p
                  v-if="tempAddress"
                  class="mt-1
                       text-sm
                       font-medium
                       text-gray-900
                       break-words"
              >
                {{ tempAddress }}
              </p>
            </div>

            <!-- Floating Button -->
            <button
                @click="getCurrentLocation"
                class="absolute
                     bottom-5
                     right-4
                     sm:right-5
                     w-12
                     h-12
                     rounded-full
                     bg-white
                     border
                     shadow-xl
                     flex items-center justify-center
                     hover:bg-gray-50"
            >
              <i class="ti ti-current-location text-xl text-blue-500"></i>
            </button>

          </div>

          <!-- Footer -->
          <div
              class="sticky
                   bottom-0
                   bg-white
                   border-t border-gray-200
                   p-4"
          >
            <div
                class="flex
                     flex-col-reverse
                     sm:flex-row
                     gap-3
                     justify-end"
            >
              <button
                  @click="closeModal"
                  class="w-full sm:w-auto
                       px-6 py-3
                       rounded-xl
                       border
                       border-gray-300
                       hover:bg-gray-50"
              >
                انصراف
              </button>

              <button
                  @click="confirmLocation"
                  :disabled="!tempLocation"
                  class="w-full sm:w-auto
                       px-6 py-3
                       rounded-xl
                       bg-blue-500
                       text-white
                       hover:bg-blue-600
                       disabled:opacity-50
                       disabled:cursor-not-allowed"
              >
                تایید موقعیت
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { iranCitiesData } from '~/data/iran-cities-complete'
import UiUSelectMenu from '~/components/ui/USelectMenu.vue'
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
  await nextTick()

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
  if (process.client) {
    document.body.style.overflow = ''
  }
}

// Watch for modal opening
watch(showMapModal, (newVal) => {
  if (newVal) {
    setTimeout(() => initMap(), 100)

    // Lock body scroll when modal opens
    if (process.client) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    // Unlock body scroll when modal closes
    if (process.client) {
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
