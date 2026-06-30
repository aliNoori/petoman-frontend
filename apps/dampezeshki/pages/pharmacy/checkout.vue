<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
              <i class="ti ti-arrow-right text-lg"></i>
              <span class="font-medium">بازگشت</span>
            </button>
            <div class="w-px h-6 bg-gray-200"></div>
            <h1 class="text-2xl font-bold text-gray-900">تکمیل خرید</h1>
          </div>
          
          <!-- Progress Steps -->
          <div class="hidden md:flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span class="text-sky-600 font-medium">اطلاعات و آدرس</span>
            </div>
            <div class="w-12 h-px bg-gray-200"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span class="text-gray-500">پرداخت</span>
            </div>
            <div class="w-12 h-px bg-gray-200"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span class="text-gray-500">تأیید</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Customer Information -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-user text-sky-500"></i>
              اطلاعات شخصی
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام</label>
                <input v-model="form.firstName" type="text" 
                       class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                       placeholder="نام خود را وارد کنید">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                <input v-model="form.lastName" type="text" 
                       class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                       placeholder="نام خانوادگی خود را وارد کنید">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input v-model="form.phone" type="tel" 
                       class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                       placeholder="09123456789">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل (اختیاری)</label>
                <input v-model="form.email" type="email" 
                       class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                       placeholder="example@email.com">
              </div>
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-map-pin text-sky-500"></i>
              آدرس تحویل
            </h2>
            
            <!-- Address Selection Tabs -->
            <div class="flex gap-2 mb-6">
              <button 
                @click="addressMode = 'saved'"
                class="flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                :class="addressMode === 'saved' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <i class="ti ti-bookmark"></i>
                آدرس‌های من
              </button>
              <button 
                @click="addressMode = 'map'"
                class="flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                :class="addressMode === 'map' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <i class="ti ti-map"></i>
                افزودن آدرس جدید
              </button>
            </div>

            <!-- Saved Addresses -->
            <div v-if="addressMode === 'saved'" class="space-y-3">
              <div v-if="addresses.length === 0" class="text-center py-8">
                <i class="ti ti-map-pin-off text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">شما هنوز آدرسی ثبت نکرده‌اید</p>
                <button @click="addressMode = 'map'" class="mt-4 text-sky-500 hover:text-sky-600 font-medium">
                  <i class="ti ti-plus ml-1"></i>
                  افزودن آدرس جدید
                </button>
              </div>
              
              <label 
                v-for="addr in addresses"
                :key="addr.id"
                class="flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all"
                :class="selectedAddressId === addr.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'"
              >
                <input 
                  v-model="selectedAddressId" 
                  :value="addr.id" 
                  type="radio" 
                  class="mt-1 text-sky-500"
                  @change="selectSavedAddress(addr)"
                >
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-gray-900">{{ addr.title }}</span>
                    <span v-if="addr.isDefault" class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">پیش‌فرض</span>
                  </div>
                  <p class="text-gray-600 text-sm">{{ addr?.fullAddress?.address?.road }} .
                    {{ addr.fullAddress?.address?.town??addr.fullAddress?.address?.suburb }} .
                    {{ addr.fullAddress?.address?.state }}
                  </p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span><i class="ti ti-user ml-1"></i>{{ addr.receiver }}</span>
                    <span><i class="ti ti-phone ml-1"></i>{{ addr.phone }}</span>
                  </div>
                </div>
              </label>
              
              <!-- Add New Address Button -->
              <button 
                v-if="addresses.length > 0"
                @click="addressMode = 'map'" 
                class="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-sky-500 hover:text-sky-500 transition-all flex items-center justify-center gap-2"
              >
                <i class="ti ti-plus text-lg"></i>
                افزودن آدرس جدید
              </button>
            </div>

            <!-- Map Selection (New Address) -->
            <div v-if="addressMode === 'map'" class="space-y-4">
              <ClientOnly>
              <AddressSelector
                  v-model="newDeliveryAddress"
                  placeholder="روی نقشه آدرس تحویل را انتخاب کنید"
                  title="انتخاب آدرس تحویل سفارش"
              />
              </ClientOnly>
              <!-- فیلد جدید: عنوان آدرس -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان آدرس (مثلاً: منزل، محل کار)</label>
                <input
                    v-model="newAddressTitle"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                    placeholder="عنوان آدرس"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام گیرنده</label>
                <input
                    v-model="newAddressReceiver"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                    placeholder="نام و نام خانوادگی گیرنده"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس گیرنده</label>
                <input
                    v-model="newAddressPhone"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                    placeholder="09123456789"
                >
              </div>

              <!-- دکمه جدید: ذخیره آدرس در استور -->
              <button
                  @click="saveNewAddress"
                  :disabled="isSavingAddress"
                  class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <i v-if="isSavingAddress" class="ti ti-loader animate-spin"></i>
                <span>{{ isSavingAddress ? 'در حال ذخیره...' : 'ذخیره و انتخاب این آدرس' }}</span>
              </button>
            </div>
          </div>

          <!-- Delivery Options -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-truck text-sky-500"></i>
              نحوه ارسال
            </h2>

            <div class="space-y-3">
              <!-- لیست پویا بر اساس تنظیمات داروخانه -->
              <label
                  v-for="method in pharmacyShippingMethods"
                  :key="method.type"
                  class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all"
                  :class="form.deliveryMethod === method.type ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'"
              >
                <input v-model="form.deliveryMethod" type="radio" :value="method.type" class="text-sky-500">

                <!-- آیکون و رنگ بر اساس نوع ارسال -->
                <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                     :class="{
                         'bg-sky-100': method.type === 'petomanCourier',
                         'bg-violet-100': method.type === 'scheduled',
                         'bg-amber-100': method.type === 'post' || method.type === 'tipax'|| method.type === 'alopeyk',
                         'bg-emerald-100': method.type === 'pharmacyCourier' || method.type === 'inPerson' || method.type === 'shopCourier'
                       }">
                  <i :class="{
                      'ti ti-bike text-sky-600': method.type === 'petomanCourier',
                      'ti ti-calendar-time text-violet-600': method.type === 'scheduled',
                      'ti ti-package text-amber-600': method.type === 'post' || method.type === 'tipax'|| method.type === 'alopeyk',
                      'ti ti-store text-emerald-600': method.type === 'pharmacyCourier' || method.type === 'shopCourier',
                      'ti ti-user text-emerald-600': method.type === 'inPerson'
                    }" class="text-2xl">

                  </i>
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-2">
          <span class="font-bold text-gray-900">
            {{ getMethodLabel(method.type) }}
          </span>
                    <span v-if="method.deliveryTime" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {{ method.deliveryTime }}
          </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ getMethodDescription(method.type) }}
                  </p>
                </div>

                <div class="text-left">
                  <div class="text-sky-600 font-bold">
                    {{ method.price === 0 ? 'رایگان' : formatPrice(Number(method.price)) }}
                  </div>
                  <div v-if="method.price !== 0" class="text-xs text-gray-500">تومان</div>
                </div>
              </label>

              <!-- پیام اگر متدی فعال نبود -->
              <div v-if="pharmacyShippingMethods.length === 0" class="text-center py-4 text-gray-500">
                روش ارسالی برای این داروخانه فعال نشده است.
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-message text-sky-500"></i>
              توضیحات (اختیاری)
            </h2>
            
            <textarea v-model="form.notes" rows="4" 
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-none"
                      placeholder="توضیحات اضافی برای سفارش..."></textarea>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-shopping-cart text-sky-500"></i>
              خلاصه سفارش
            </h2>

            <!-- Cart Items -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3 pb-4 border-b border-gray-100">
                <!-- Product Image -->
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" alt="product">
                  <i v-else class="ti ti-package text-gray-400"></i>
                </div>

                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 text-sm">{{ item.name }}</h4>
                  <p class="text-xs text-gray-600">{{ item.category }}</p>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-sky-600 font-bold text-sm">{{ formatPrice(item.price) }} تومان</span>
                    <span class="text-gray-500 text-sm">× {{ item.quantity }}</span>
                  </div>
                </div>
              </div>

              <!-- پیام در صورت خالی بودن سبد -->
              <div v-if="cartItems.length === 0" class="text-center py-4 text-gray-500 text-sm">
                سبد خرید خالی است
              </div>
            </div>
            
            <!-- Price Breakdown -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>جمع محصولات:</span>
                <span>{{ formatPrice(subtotal) }} تومان</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>هزینه ارسال:</span>
                <span>{{ formatPrice(deliveryFee) }} تومان</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-bold text-gray-900">
                  <span>مجموع:</span>
                  <span class="text-sky-600">{{ formatPrice(total) }} تومان</span>
                </div>
              </div>
            </div>
            
            <!-- Continue Button -->
            <button @click="continueToPayment" :disabled="!isFormValid" 
                    class="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors">
              ادامه و پرداخت
            </button>
            
            <div class="mt-4 text-center">
              <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
                <i class="ti ti-shield-check text-emerald-500"></i>
                <span>پرداخت امن و محافظت شده</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { iranCitiesData } from '~/data/iran-cities'
import {useAddressStore} from "~/stores/address.store";
import {onMounted,reactive} from "vue";
import {useAuthStore} from "~/stores/auth";
import { useNuxtApp } from 'nuxt/app';
import {useRuntimeConfig} from "nuxt/app";
const {$toast}=useNuxtApp()
const authStore=useAuthStore()
const currentUser = computed(() => authStore.user);
const addressStore=useAddressStore()
const router = useRouter()
const { showInfo, showError } = useNotification()
const isSavingAddress = ref(false)
const newAddressTitle = ref('') // عنوان آدرس (مثلاً منزل، محل کار)
// Address selection - باید قبل از watch تعریف بشه
const addressMode = ref('saved') // 'saved', 'map'
const selectedAddressId = ref(null)
const selectedLocation = ref(null)
const config = useRuntimeConfig()
const isAuthenticated = computed(()=>authStore.isAuthenticated)

const saveNewAddress = async () => {
  // --- بررسی لاگین بودن کاربر ---
  if (!isAuthenticated.value) {

    // 1. Show Warning Toast
    // Note: Adjust the parameters based on your specific Toast implementation
    // Assuming $toast accepts (message, severity, life)
    if ($toast && typeof $toast === 'function') {
      $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    }

    // 2. Redirect to Login Page with redirect URL
    // This allows the user to come back to /register after login
    // If using NuxtLink behavior via router
    // router.push(`/login?redirect=${encodeURIComponent('/register')}`);

    // Since the login button elsewhere uses an external URL, we do the same here
    window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;
    return
  }

  // اعتبارسنجی
  if (!newDeliveryAddress.value.address || !newAddressReceiver.value || !newAddressPhone.value) {
    $toast('لطفاً آدرس، نام گیرنده و شماره تماس را وارد کنید', 'error',5000)
    return
  }

  isSavingAddress.value = true
  try {
    const rawAddressData = newDeliveryAddress.value?.address || {}
    const fullAddressDetails = JSON.parse(JSON.stringify(rawAddressData))

    const completeAddressPayload = {
      display_name: fullAddressDetails.display_name || '',
      lat: parseFloat(fullAddressDetails.lat),
      lon: parseFloat(fullAddressDetails.lon),
      ...fullAddressDetails
    }
    // ساخت آبجکت آدرس برای ارسال به استور
    const payload = {
      title: newAddressTitle.value || 'آدرس جدید',
      fullAddress: completeAddressPayload,
      receiver: newAddressReceiver.value,
      phone: newAddressPhone.value,
    }

    // فراخوانی اکشن استور
    const savedAddress = await addressStore.addUserAddress(payload)

    // انتخاب آدرس ذخیره شده به عنوان آدرس انتخابی
    selectedAddressId.value = savedAddress.id
    selectSavedAddress(savedAddress)

    // بازگشت به تب آدرس‌های ذخیره شده
    addressMode.value = 'saved'

    $toast('آدرس با موفقیت ذخیره شد', 'success',5000)

    // پاک کردن فرم
    newAddressTitle.value = ''
    newAddressReceiver.value = ''
    newAddressPhone.value = ''
  } catch (error) {
    console.error('Error saving address:', error)
    $toast('خطا در ذخیره آدرس', 'error',5000)
  } finally {
    isSavingAddress.value = false
  }
}

// ============ MAP (Mapbox) ============
const mapContainerRef = ref(null)
const mapSearchQuery = ref('')
const selectedMapAddress = ref('')
const mapInstance = ref(null)
const mapboxgl = ref(null)
const isGettingLocation = ref(false)
const MAPBOX_TOKEN = 'pk.eyJ1IjoicGV0b21hbiIsImEiOiJjbTRvNnBhaDkwNTVsMmpzOGFld3d3OXZ5In0.Wq0VVUZ8YkFVmVjDSwrW1Q'

// Initialize map when switching to map mode
watch(() => addressMode.value, async (newMode) => {
  if (newMode === 'map' && process.client) {
    await nextTick()
    setTimeout(() => initMap(), 200)
  }
})

const initMap = async () => {
  if (!process.client) return
  if (mapInstance.value) return // Already initialized
  
  try {
    // Load Mapbox CSS first
    if (!document.getElementById('mapbox-css')) {
      const link = document.createElement('link')
      link.id = 'mapbox-css'
      link.rel = 'stylesheet'
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css'
      document.head.appendChild(link)
      // Wait for CSS to load
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Dynamic import
    const mb = await import('mapbox-gl')
    mapboxgl.value = mb.default
    mapboxgl.value.accessToken = MAPBOX_TOKEN
    
    // RTL plugin
    try {
      if (mapboxgl.value.getRTLTextPluginStatus() === 'unavailable') {
        mapboxgl.value.setRTLTextPlugin(
          'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
          null, true
        )
      }
    } catch (e) {
      // Ignore RTL plugin errors
    }
    
    const container = document.getElementById('checkout-map')
    if (!container) {
      console.error('Map container not found')
      return
    }
    
    mapInstance.value = new mapboxgl.value.Map({
      container: 'checkout-map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [51.3890, 35.6892], // Tehran
      zoom: 14,
      attributionControl: false
    })
    
    mapInstance.value.addControl(new mapboxgl.value.NavigationControl(), 'bottom-left')
    
    // Get address on map move
    mapInstance.value.on('moveend', () => {
      const center = mapInstance.value.getCenter()
      reverseGeocode(center.lat, center.lng)
    })
    
    // Initial reverse geocode
    mapInstance.value.on('load', () => {
      reverseGeocode(35.6892, 51.3890)
    })
    
  } catch (err) {
    console.error('Map init error:', err)
  }
}

const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=fa`
    )
    const data = await res.json()
    if (data.features?.length) {
      selectedMapAddress.value = data.features[0].place_name
      form.address = data.features[0].place_name
    }
  } catch (err) {
    console.error('Reverse geocode error:', err)
  }
}

const searchMapLocation = async () => {
  if (!mapSearchQuery.value || mapSearchQuery.value.length < 3) return
  
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mapSearchQuery.value)}.json?access_token=${MAPBOX_TOKEN}&country=ir&language=fa&limit=1`
    )
    const data = await res.json()
    if (data.features?.length && mapInstance.value) {
      const [lng, lat] = data.features[0].center
      mapInstance.value.flyTo({ center: [lng, lat], zoom: 16 })
    }
  } catch (err) {
    console.error('Search error:', err)
  }
}

const getMyLocation = () => {
  if (!navigator.geolocation) {
    alert('مرورگر شما از GPS پشتیبانی نمی‌کند')
    return
  }
  
  isGettingLocation.value = true
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (mapInstance.value) {
        mapInstance.value.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 16
        })
      }
      isGettingLocation.value = false
    },
    (err) => {
      isGettingLocation.value = false
      if (err.code === err.PERMISSION_DENIED) {
        alert('دسترسی به موقعیت مکانی رد شد')
      } else if (err.code === err.TIMEOUT) {
        alert('زمان دریافت موقعیت به پایان رسید')
      } else {
        alert('خطا در دریافت موقعیت')
      }
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  )
}

// ============ FORM ============
// Form data - باید اول تعریف بشه
const form = reactive({
  firstName: currentUser.value?.firstName || '',
  lastName: currentUser.value?.lastName || '',
  phone: currentUser.value?.phoneNumber || '',
  email: currentUser.value?.email || '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  unit: '',
  floor: '',
  addressId:'',
  addressNote: '',
  addressTitle: '', // عنوان آدرس (مثلا: منزل، محل کار)
  saveAddress: false, // ذخیره در آدرس‌های من
  deliveryMethod: '',
  notes: ''
})

// لیست استان‌ها برای دراپ‌داون
const provincesOptions = computed(() => 
  Object.keys(iranCitiesData).map(p => ({ value: p, label: p }))
)

// لیست شهرهای استان انتخاب شده برای دراپ‌داون
const citiesOptions = computed(() => {
  if (!form.province || !iranCitiesData[form.province]) return []
  return iranCitiesData[form.province].cities.map(c => ({ value: c, label: c }))
})

/*// Sample cart data (در پروژه واقعی از store استفاده کنید)
const cartItems = ref([
  { id: 1, name: 'واکسن چهارگانه سگ', category: 'واکسن و سرم', price: 85000, quantity: 1 },
  { id: 2, name: 'مکمل مولتی ویتامین گربه', category: 'مکمل‌ها', price: 45000, quantity: 2 },
  { id: 4, name: 'آنتی‌بیوتیک آموکسی‌سیلین', category: 'آنتی‌بیوتیک', price: 28000, quantity: 1 }
])*/
// خواندن سبد خرید از LocalStorage
import {useTenantStore} from "~/stores/tenant.store";

const cartItems = ref([])
const tenantStore = useTenantStore();
const pharmacyData = ref(null); // نگهداری اطلاعات کامل داروخانه
onMounted(() => {
  const savedCart = localStorage.getItem('pharmacyCart');
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      cartItems.value = parsedCart.items || [];

      // دریافت اطلاعات داروخانه از استور یا LocalStorage
      // فرض بر این است که pharmacyId در سبد خرید ذخیره شده است
      const pharmacyId = parsedCart.pharmacyId;

      if (pharmacyId) {
        // روش اول: اگر استور تمام تننت‌ها را دارد
        const fullPharmacyData = tenantStore.getTenantById(pharmacyId);

        // روش دوم: اگر فقط آی‌دی را داریم و باید از سرور بگیریم (اگر استور خالی بود)
        // const fullPharmacyData = await $fetch(`/api/tenants/${pharmacyId}`);

        if (fullPharmacyData) {
          pharmacyData.value = fullPharmacyData;
        }
      }
    } catch (e) {
      console.error('Error loading cart or pharmacy:', e);
    }
  }
})
// استخراج متدهای ارسال فعال از تنظیمات داروخانه
const pharmacyShippingMethods = computed(() => {
  if (!pharmacyData.value?.settings) return [];

  // پیدا کردن تنظیمات shipping_methods
  const shippingSetting = pharmacyData.value.settings.find(
      s => s.key === 'shipping_methods'
  );

  if (!shippingSetting?.value?.methods) return [];

  // فیلتر کردن متدهایی که isActive هستند
  return shippingSetting.value.methods.filter(method => method.isActive !== false);
});

// محاسبه هزینه ارسال بر اساس متد انتخاب شده
const deliveryFee = computed(() => {

  const selectedMethod = pharmacyShippingMethods.value.find(
      m => m.type === form.deliveryMethod
  );

  // اگر قیمت مشخص شده بود، همان را برمی‌گردانیم، وگرنه قیمت پیش‌فرض
  if (selectedMethod && typeof selectedMethod.price === 'number') {

    return selectedMethod.price;
  }
  return 0;
});

const addresses=computed(()=>addressStore.addresses)

// Saved addresses (در پروژه واقعی از API بگیرید)
/*const savedAddresses = ref([
  {
    id: 1,
    title: 'منزل',
    fullAddress: 'تهران، سعادت آباد، بلوار دریا، خیابان بهار، پلاک ۴۵، واحد ۳',
    receiverName: 'علی محمدی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    lat: 35.7749,
    lng: 51.4194,
    isDefault: true
  },
  {
    id: 2,
    title: 'محل کار',
    fullAddress: 'تهران، میدان ونک، برج همراه، طبقه ۱۲، واحد ۱۲۰۵',
    receiverName: 'علی محمدی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    lat: 35.7575,
    lng: 51.4091,
    isDefault: false
  }
])*/

// Scheduled delivery
const selectedDeliveryDay = ref(null)
const selectedTimeSlot = ref(null)

// تبدیل عدد به فارسی
const toPersianNum = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (d) => persianDigits[d])
}

// نام ماه‌های شمسی
const persianMonthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

// تبدیل تاریخ میلادی به شمسی
const toJalali = (gy, gm, gd) => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let jy = (gy <= 1600) ? 0 : 979
  gy -= (gy <= 1600) ? 621 : 1600
  const gy2 = (gm > 2) ? (gy + 1) : gy
  let days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1]
  jy += 33 * (Math.floor(days / 12053))
  days %= 12053
  jy += 4 * (Math.floor(days / 1461))
  days %= 1461
  jy += Math.floor((days - 1) / 365)
  if (days > 365) days = (days - 1) % 365
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30)
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30))
  return { year: jy, month: jm, day: jd }
}

// ساخت لیست روزهای قابل انتخاب (۵ روز آینده)
const deliveryDays = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 1; i <= 5; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // تبدیل به شمسی
    const jalali = toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())
    
    // روز هفته
    const dayIndex = date.getDay()
    const dayName = dayIndex === 0 ? 'یکشنبه' : 
                    dayIndex === 1 ? 'دوشنبه' :
                    dayIndex === 2 ? 'سه‌شنبه' :
                    dayIndex === 3 ? 'چهارشنبه' :
                    dayIndex === 4 ? 'پنج‌شنبه' :
                    dayIndex === 5 ? 'جمعه' : 'شنبه'
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: i === 1 ? 'فردا' : i === 2 ? 'پس‌فردا' : dayName,
      dateLabel: toPersianNum(jalali.day) + ' ' + persianMonthNames[jalali.month - 1],
      fullDate: toPersianNum(jalali.year) + '/' + toPersianNum(jalali.month) + '/' + toPersianNum(jalali.day),
      jsDate: date
    })
  }
  
  return days
})

// بازه‌های زمانی
const timeSlots = ref([
  { id: 1, label: '۹ تا ۱۱', start: '09:00', end: '11:00', available: true },
  { id: 2, label: '۱۱ تا ۱۳', start: '11:00', end: '13:00', available: true },
  { id: 3, label: '۱۳ تا ۱۵', start: '13:00', end: '15:00', available: false },
  { id: 4, label: '۱۵ تا ۱۷', start: '15:00', end: '17:00', available: true },
  { id: 5, label: '۱۷ تا ۱۹', start: '17:00', end: '19:00', available: true },
  { id: 6, label: '۱۹ تا ۲۱', start: '19:00', end: '21:00', available: true },
])

// Handle location from map
const newDeliveryAddress = ref({
  address: {},
  province: '',
  city: '',
  location: null
})

const newAddressReceiver = ref('')
const newAddressPhone = ref('')

// Watch newDeliveryAddress and update form
watch(newDeliveryAddress, (newVal) => {
  form.address = newVal.address
  form.province = newVal.province
  form.city = newVal.city
}, { deep: true })

const handleLocationSelected = (location) => {
  selectedLocation.value = location
  form.address = location.address
  form.province = location.province || ''
  form.city = location.city || ''
}

// Select saved address
const selectSavedAddress = (addr) => {
  selectedAddressId.value = addr.id
  form.address = addr.fullAddress
  form.addressId=addr.id
  // در صورت نیاز می‌توانید فیلدهای دیگر را هم پر کنید
}

// Computed values
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

/*const deliveryFee = computed(() => {
  // ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان
  if (subtotal.value >= 500000) return 0
  
  if (form.deliveryMethod === 'petoman-courier') return 35000
  if (form.deliveryMethod === 'scheduled') return 25000
  if (form.deliveryMethod === 'petoman-post') return 20000
  return 0
})*/

const total = computed(() => {
  return subtotal.value + deliveryFee.value
})

const isFormValid = computed(() => {
  const hasPersonalInfo = form.firstName && form.lastName && form.phone
  
  // Check address based on mode
  let hasAddress = false
  if (addressMode.value === 'saved') {
    hasAddress = selectedAddressId.value !== null
  } else if (addressMode.value === 'map') {
    hasAddress = selectedLocation.value !== null
  } else {
    hasAddress = form.province && form.city && form.address && form.postalCode
  }
  
  // Check scheduled delivery requirements
  let hasDeliveryInfo = true
  if (form.deliveryMethod === 'scheduled') {
    hasDeliveryInfo = selectedDeliveryDay.value !== null && selectedTimeSlot.value !== null
  }
  
  return hasPersonalInfo && hasAddress && hasDeliveryInfo
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const continueToPayment = () => {
  if (!isFormValid.value) {
    showError('لطفاً تمام فیلدهای اجباری را تکمیل کنید', 'خطا')
    return
  }
  
  // Save form data to localStorage or store
  localStorage.setItem('checkoutForm', JSON.stringify(form))
  localStorage.setItem('orderSummary', JSON.stringify({
    items: cartItems.value,
    subtotal: subtotal.value,
    deliveryFee: deliveryFee.value,
    total: total.value,
    deliveryMethod: form.deliveryMethod,
    scheduledDelivery: form.deliveryMethod === 'scheduled' ? {
      day: selectedDeliveryDay.value,
      timeSlot: selectedTimeSlot.value
    } : null
  }))
  
  router.push('/pharmacy/payment')
}

const getMethodLabel = (type) => {
  const labels = {
    'petomanCourier': 'پیک پتومن',
    'scheduled': 'ارسال زمان‌بندی شده',
    'post': 'پست پیشتاز',
    'tipax': 'تیپاکس',
    'alopeyk': 'الوپیک',
    'shopCourier': 'پیک داروخانه',
    'pharmacyCourier': 'پیک داروخانه',
    'inPerson': 'تحویل حضوری'
  };
  return labels[type] || type;
};

const getMethodDescription = (type) => {
  const descs = {
    'petomanCourier': 'تحویل سریع با پیک اپلیکیشن',
    'scheduled': 'انتخاب روز و بازه زمانی دلخواه',
    'post': 'ارسال با پست جمهوری اسلامی (۳ تا ۵ روز)',
    'tipax': 'ارسال سریع با تیپاکس',
    'alopeyk': 'ارسال سریع با الوپیک',
    'shopCourier': 'ارسال با پیک شخصی داروخانه',
    'pharmacyCourier': 'ارسال با پیک شخصی داروخانه',
    'inPerson': 'دریافت حضوری از داروخانه'
  };
  return descs[type] || '';
};

// SEO
useHead({
  title: 'تکمیل خرید | پتومن',
  meta: [
    { name: 'description', content: 'تکمیل اطلاعات و آدرس برای خرید محصولات دامپزشکی' }
  ]
})

</script>