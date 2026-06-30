<template>
  <div class="pb-24 md:pb-6">
    <!-- Header موبایل -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-arrow-right text-xl text-gray-700"></i>
          </button>
          <span class="font-bold text-gray-900">پرداخت</span>
        </div>
        <!-- Countdown -->
        <div class="flex items-center gap-1 text-orange-600 text-sm">
          <i class="ti ti-clock"></i>
          <span>{{ formatCountdown }}</span>
        </div>
      </div>
    </div>

    <div class="pt-16 lg:pt-0 px-4 lg:px-0">
      <!-- Back Button & Timer Desktop -->
      <div class="hidden lg:flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-arrow-right text-xl text-gray-700"></i>
          </button>
          <span class="text-gray-500">برگشت</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm">
          <i class="ti ti-clock"></i>
          <span>زمان باقی‌مانده: {{ formatCountdown }}</span>
        </div>
      </div>

      <div class="lg:grid lg:grid-cols-3 lg:gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Booking Summary -->
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">اطلاعات رزرو</h2>
            </div>
            <div class="p-4">
              <div class="flex items-start gap-4">
                <img 
                  src="https://i.pravatar.cc/150?img=11"
                  alt="Doctor"
                  class="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                >
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900">دکتر علی احمدی</h3>
                  <p class="text-sm text-gray-600">متخصص حیوانات خانگی</p>
                  <div class="flex items-center gap-3 mt-2 text-sm">
                    <span class="flex items-center gap-1 text-emerald-600">
                      <i :class="getServiceIcon(service)"></i>
                      {{ getServiceLabel(service) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Schedule Info -->
              <div v-if="date && time" class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-4 text-sm">
                  <div class="flex items-center gap-2 text-gray-600">
                    <i class="ti ti-calendar text-emerald-600"></i>
                    <span>{{ date }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <i class="ti ti-clock text-emerald-600"></i>
                    <span>{{ time }}</span>
                  </div>
                </div>
              </div>

              <!-- Home Visit Address -->
              <div v-if="service === 'homeVisit' && address" class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-start gap-2 text-sm">
                  <i class="ti ti-map-pin text-emerald-600 mt-0.5"></i>
                  <span class="text-gray-600">{{ address }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">روش پرداخت</h2>
            </div>
            <div class="p-4 space-y-3">
              <!-- Wallet -->
              <div 
                @click="paymentMethod = 'wallet'"
                class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                :class="paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <i class="ti ti-wallet text-xl text-emerald-600"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">کیف پول</h4>
                      <p class="text-sm text-gray-500">موجودی: {{ walletBalance.toLocaleString('fa-IR') }} تومان</p>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="paymentMethod === 'wallet' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'"
                  >
                    <i v-if="paymentMethod === 'wallet'" class="ti ti-check text-white text-xs"></i>
                  </div>
                </div>
                <p v-if="walletBalance < totalAmount" class="text-xs text-red-500 mt-2 mr-13">
                  موجودی کافی نیست. 
                  <NuxtLink to="/wallet/charge" class="text-emerald-600 hover:underline">افزایش موجودی</NuxtLink>
                </p>
              </div>

              <!-- Bank Gateway -->
              <div 
                @click="paymentMethod = 'bank'"
                class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                :class="paymentMethod === 'bank' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i class="ti ti-credit-card text-xl text-blue-600"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">درگاه بانکی</h4>
                      <p class="text-sm text-gray-500">پرداخت با کارت بانکی</p>
                    </div>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="paymentMethod === 'bank' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'"
                  >
                    <i v-if="paymentMethod === 'bank'" class="ti ti-check text-white text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Discount Code -->
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div class="p-4">
              <div class="flex gap-2">
                <input
                  v-model="discountCode"
                  type="text"
                  placeholder="کد تخفیف"
                  class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                <button 
                  @click="applyDiscount"
                  :disabled="!discountCode || isApplyingDiscount"
                  class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                >
                  <span v-if="isApplyingDiscount" class="flex items-center gap-2">
                    <i class="ti ti-loader-2 animate-spin"></i>
                  </span>
                  <span v-else>اعمال</span>
                </button>
              </div>
              <p v-if="discountError" class="text-sm text-red-500 mt-2">{{ discountError }}</p>
              <p v-if="discountApplied" class="text-sm text-green-600 mt-2 flex items-center gap-1">
                <i class="ti ti-check"></i>
                کد تخفیف اعمال شد
              </p>
            </div>
          </div>
        </div>

        <!-- Invoice Sidebar -->
        <div class="lg:col-span-1 mt-4 lg:mt-0">
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden lg:sticky lg:top-4">
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">فاکتور</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">{{ getServiceLabel(service) }}</span>
                <span class="text-gray-700">{{ basePrice.toLocaleString('fa-IR') }} تومان</span>
              </div>
              <div v-if="duration" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">مدت تماس</span>
                <span class="text-gray-700">{{ duration }} دقیقه</span>
              </div>
              <div v-if="discountApplied" class="flex items-center justify-between text-sm text-green-600">
                <span>تخفیف</span>
                <span>-{{ discountAmount.toLocaleString('fa-IR') }} تومان</span>
              </div>
              <hr class="border-gray-100">
              <div class="flex items-center justify-between">
                <span class="font-bold text-gray-900">مبلغ نهایی</span>
                <span class="text-xl font-bold text-emerald-600">{{ totalAmount.toLocaleString('fa-IR') }} <span class="text-sm font-normal">تومان</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
      <div class="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p class="text-xs text-gray-500">مبلغ نهایی</p>
          <p class="text-lg font-bold text-emerald-600">{{ totalAmount.toLocaleString('fa-IR') }} <span class="text-sm font-normal">تومان</span></p>
        </div>
        <button 
          @click="processPayment"
          :disabled="!canPay || isProcessing"
          class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center gap-2"
        >
          <i v-if="isProcessing" class="ti ti-loader-2 animate-spin"></i>
          <span>{{ isProcessing ? 'در حال پرداخت...' : 'پرداخت' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// SEO
useHead({
  title: 'پرداخت - رزرو نوبت | پتومن'
})

// Query params
const service = computed(() => route.query.service || 'chat')
const date = computed(() => route.query.date || null)
const time = computed(() => route.query.time || null)
const duration = computed(() => route.query.duration || null)
const address = computed(() => route.query.address || null)

// State
const paymentMethod = ref('wallet')
const discountCode = ref('')
const discountApplied = ref(false)
const discountAmount = ref(0)
const discountError = ref('')
const isApplyingDiscount = ref(false)
const isProcessing = ref(false)
const walletBalance = ref(250000)

// Countdown Timer
const countdown = ref(600) // 10 minutes in seconds
let countdownInterval = null

const formatCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownInterval)
      // Handle timeout - redirect back
      navigateTo('/booking')
    }
  }, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// Prices
const servicePrices = {
  chat: 126000,
  instantCall: 140000,
  scheduledCall: 140000,
  clinicVisit: 250000,
  homeVisit: 400000
}

const durationPrices = {
  10: 140000,
  15: 196000,
  20: 259000
}

const basePrice = computed(() => {
  if (service.value === 'instantCall' && duration.value) {
    return durationPrices[duration.value] || 140000
  }
  return servicePrices[service.value] || 140000
})

const totalAmount = computed(() => {
  return basePrice.value - discountAmount.value
})

// Validation
const canPay = computed(() => {
  if (!paymentMethod.value) return false
  if (paymentMethod.value === 'wallet' && walletBalance.value < totalAmount.value) return false
  return true
})

// Methods
const getServiceLabel = (service) => {
  const labels = {
    chat: 'گفتگوی متنی',
    instantCall: 'تماس فوری',
    scheduledCall: 'تماس با نوبت',
    clinicVisit: 'ویزیت در کلینیک',
    homeVisit: 'ویزیت در منزل'
  }
  return labels[service] || ''
}

const getServiceIcon = (service) => {
  const icons = {
    chat: 'ti ti-message-dots',
    instantCall: 'ti ti-phone',
    scheduledCall: 'ti ti-calendar-event',
    clinicVisit: 'ti ti-building-hospital',
    homeVisit: 'ti ti-home'
  }
  return icons[service] || 'ti ti-circle'
}

const goBack = () => {
  navigateTo(`/booking/${route.params.id}`)
}

const applyDiscount = async () => {
  if (!discountCode.value) return
  
  isApplyingDiscount.value = true
  discountError.value = ''
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (discountCode.value === 'TEST20') {
    discountApplied.value = true
    discountAmount.value = Math.floor(basePrice.value * 0.2)
  } else {
    discountError.value = 'کد تخفیف نامعتبر است'
  }
  
  isApplyingDiscount.value = false
}

const processPayment = async () => {
  if (!canPay.value) return
  
  isProcessing.value = true
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Navigate to success page
  navigateTo('/booking/success')
}
</script>
