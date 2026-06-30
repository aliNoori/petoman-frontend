<template>
  <div class="map-city-selector w-full">
    <!-- دکمه باز کردن مودال -->
    <button
        @click="openModal"
        :class="[
        'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-right',
        modelValue ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      ]"
    >
      <div class="flex items-center gap-3">
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', modelValue ? 'bg-blue-100' : 'bg-gray-100']">
          <i :class="['ti ti-map-pin text-xl', modelValue ? iconColor : 'text-gray-500']"></i>
        </div>
        <div class="flex-1">
          <p class="text-xs font-medium mb-0.5" :class="modelValue ? 'text-blue-600' : 'text-gray-500'">{{ title }}</p>
          <p class="text-sm font-semibold text-gray-900 truncate">
            {{ modelValue ? modelValue.name : placeholder }}
          </p>
        </div>
      </div>
      <i class="ti ti-chevron-left text-gray-400"></i>
    </button>

    <!-- مودال نقشه -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="isOpen"
            class="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
            @click.self="closeModal"
        >
          <div class="bg-white w-full h-full md:h-[85vh] md:max-w-4xl md:rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">

            <!-- هدر -->
            <div :class="['px-6 py-4 flex items-center justify-between shadow-sm z-20', headerClass]">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white/20 rounded-lg">
                  <i class="ti ti-building-arch text-white text-xl"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">انتخاب شهر</h3>
                  <p class="text-xs text-white/80">روی نقشه شهر مورد نظر را انتخاب کنید</p>
                </div>
              </div>
              <button @click="closeModal" class="p-2 hover:bg-white/20 rounded-full transition-colors">
                <i class="ti ti-x text-white text-2xl"></i>
              </button>
            </div>

            <!-- نوار جستجوی شهر -->
            <div class="px-4 py-3 bg-white border-b border-gray-100 z-20">
              <div class="relative">
                <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="جستجوی نام شهر..."
                    class="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <!-- نتایج جستجو -->
              <div v-if="filteredCities.length > 0" class="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                <button
                    v-for="city in filteredCities"
                    :key="city.id"
                    @click="selectCityFromSearch(city)"
                    class="w-full text-right px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3"
                >
                  <i class="ti ti-map-pin text-gray-400"></i>
                  <span class="text-sm font-medium text-gray-900">{{ city.name }}</span>
                  <span class="text-xs text-gray-500 mr-auto">{{ city.province }}</span>
                </button>
              </div>
            </div>

            <!-- کانتینر نقشه -->
            <div class="flex-1 relative bg-gray-100 w-full">
              <div id="city-map" ref="mapContainer" class="w-full h-full z-10"></div>

              <!-- نشانگر مرکز -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-none">
                <div class="relative flex flex-col items-center">
                  <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg ring-4 ring-blue-500/30"></div>
                  <div class="w-0.5 h-8 bg-blue-500/50 mt-1"></div>
                  <div class="px-3 py-1 bg-white rounded-lg shadow-md text-xs font-bold text-gray-800 mt-1 whitespace-nowrap">
                    {{ selectedCityName || 'در حال انتخاب...' }}
                  </div>
                </div>
              </div>

              <!-- دکمه تایید -->
              <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[400] w-[90%] md:w-auto">
                <button
                    @click="confirmSelection"
                    :disabled="!tempSelectedCity"
                    :class="[
                    'w-full md:w-auto px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2',
                    buttonClass,
                    !tempSelectedCity ? 'opacity-50 cursor-not-allowed grayscale' : ''
                  ]"
                >
                  <i class="ti ti-check text-lg"></i>
                  انتخاب شهر {{ tempSelectedCity ? tempSelectedCity.name : '' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// --- Props ---
const props = defineProps({
  modelValue: {
    type: Object, // { id, name, province, lat, lng }
    default: null
  },
  placeholder: {
    type: String,
    default: 'انتخاب شهر'
  },
  title: {
    type: String,
    default: 'شهر خود را انتخاب کنید'
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
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
  },
  mapStyle: {
    type: String,
    default: 'osm' // 'osm' or 'maptiler'
  }
})

const emit = defineEmits(['update:modelValue', 'city-selected'])

// --- State ---
const isOpen = ref(false)
const mapContainer = ref(null)
const mapInstance = ref(null)
const searchQuery = ref('')
const tempSelectedCity = ref(null)
let map = null

// لیست شهرهای ایران (نمونه - می‌توانید از API بگیرید)
const citiesDatabase = ref([
  { id: 1, name: 'تهران', province: 'تهران', lat: 35.6892, lng: 51.3890 },
  { id: 2, name: 'اصفهان', province: 'اصفهان', lat: 32.6546, lng: 51.6679 },
  { id: 3, name: 'شیراز', province: 'فارس', lat: 29.5918, lng: 52.5837 },
  { id: 4, name: 'مشهد', province: 'خراسان رضوی', lat: 36.2605, lng: 59.6168 },
  { id: 5, name: 'تبریز', province: 'آذربایجان شرقی', lat: 38.0962, lng: 46.2765 },
  { id: 6, name: 'کرج', province: 'البرز', lat: 35.8327, lng: 50.9915 },
  { id: 7, name: 'اهواز', province: 'خوزستان', lat: 31.3183, lng: 48.6706 },
  { id: 8, name: 'رشت', province: 'گیلان', lat: 37.2808, lng: 49.5832 },
  { id: 9, name: 'قم', province: 'قم', lat: 34.6401, lng: 50.8763 },
  { id: 10, name: 'کاشان', province: 'اصفهان', lat: 33.9833, lng: 51.4333 },
  { id: 11, name: 'یزد', province: 'یزد', lat: 31.8974, lng: 54.3569 },
  { id: 12, name: 'زنجان', province: 'زنجان', lat: 36.6769, lng: 48.5086 },
  { id: 13, name: 'ارومیه', province: 'آذربایجان غربی', lat: 37.5527, lng: 45.0761 },
  { id: 14, name: 'همدان', province: 'همدان', lat: 34.7989, lng: 48.5146 },
  { id: 15, name: 'کرمانشاه', province: 'کرمانشاه', lat: 34.3277, lng: 47.0778 },
])

// --- Computed ---
const filteredCities = computed(() => {
  if (!searchQuery.value) return []
  return citiesDatabase.value.filter(city =>
      city.name.includes(searchQuery.value) ||
      city.province.includes(searchQuery.value)
  )
})

const selectedCityName = computed(() => {
  return tempSelectedCity.value ? tempSelectedCity.value.name : ''
})

// --- Methods ---

const openModal = () => {
  isOpen.value = true
  nextTick(() => {
    initMap()
  })
}

const closeModal = () => {
  isOpen.value = false
  if (map) {
    map.remove()
    map = null
  }
}

const initMap = () => {
  if (!mapContainer.value || map) return

  // مرکز پیش‌فرض (تهران)
  const startLat = props.modelValue?.lat || 35.6892
  const startLng = props.modelValue?.lng || 51.3890

  map = L.map(mapContainer.value, {
    center: [startLat, startLng],
    zoom: 6,
    zoomControl: false
  })

  // انتخاب استایل نقشه
  let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  let attribution = '&copy; OpenStreetMap'

  if (props.mapStyle === 'maptiler') {
    // اگر کلید MapTiler دارید اینجا جایگزین کنید
    // در غیر این صورت از یک استایل جایگزین رایگان استفاده می‌کنیم
    tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    // یا استایل CartoDB Voyager که رایگان و زیباست:
    tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    attribution = '&copy; OpenStreetMap &copy; CARTO'
  }

  L.tileLayer(tileUrl, {
    attribution: attribution,
    maxZoom: 19
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  // اضافه کردن مارکر برای شهرهای اصلی (اختیاری)
  citiesDatabase.value.forEach(city => {
    const circle = L.circleMarker([city.lat, city.lng], {
      radius: 6,
      fillColor: "#3b82f6",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map)

    circle.bindTooltip(`<b>${city.name}</b><br>${city.province}`, {
      permanent: false,
      direction: 'top',
      className: 'city-tooltip'
    })

    circle.on('click', () => {
      selectCity(city)
    })
  })

  // رویداد کلیک روی نقشه (برای پیدا کردن نزدیک‌ترین شهر)
  map.on('click', async (e) => {
    findNearestCity(e.latlng.lat, e.latlng.lng)
  })
}

const findNearestCity = (lat, lng) => {
  let minDist = Infinity
  let nearest = null

  citiesDatabase.value.forEach(city => {
    const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2))
    if (dist < minDist) {
      minDist = dist
      nearest = city
    }
  })

  // اگر فاصله خیلی زیاد بود (مثلاً کلیک روی دریا)، انتخاب نکن
  if (nearest && minDist < 2) { // حدود 2 درجه فاصله
    selectCity(nearest)
  }
}

const selectCity = (city) => {
  tempSelectedCity.value = city
  if (map) {
    map.flyTo([city.lat, city.lng], 10, {
      animate: true,
      duration: 1.5
    })
  }
}

const selectCityFromSearch = (city) => {
  searchQuery.value = ''
  selectCity(city)
}

const confirmSelection = () => {
  if (tempSelectedCity.value) {
    emit('update:modelValue', tempSelectedCity.value)
    emit('city-selected', tempSelectedCity.value)
    closeModal()
  }
}

// --- Lifecycle ---
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* استایل تولتیپ شهرها */
:deep(.city-tooltip) {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: #1f2937;
  font-size: 12px;
  padding: 4px 8px;
}
:deep(.city-tooltip:before) {
  border-top-color: rgba(255, 255, 255, 0.95);
}
</style>
