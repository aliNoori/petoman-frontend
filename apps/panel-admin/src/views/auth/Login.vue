<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="w-full max-w-md text-right">
      <!-- Logo -->
      <div class="flex justify-start mb-8">
        <img src="/images/logo-petoman.svg" alt="پتومن" class="h-12" />
      </div>

      <Transition name="fade" mode="out-in">
        <!-- Step 1: Phone Number Input -->
        <div v-if="currentStep === 'phone'" key="phone" class="w-full">
          <form @submit.prevent="handlePhoneSubmit">
            <!-- Country Selector -->
            <div class="w-full mb-4 relative">
              <label class="absolute right-4 top-[-10px] bg-white text-sm px-1 text-gray-700">
                کشور
              </label>
              <div class="flex items-center border border-gray-300 rounded-lg px-4 py-4">
                <span class="ml-2">
                  <img src="/images/iran-flag.svg" class="w-5 h-4" alt="ایران" />
                </span>
                <span class="flex-1 text-right text-gray-700">ایران</span>
                <svg class="w-4 h-4 mr-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </div>
            </div>

            <!-- Phone Input -->
            <div class="w-full mb-6 relative">
              <div class="absolute text-gray-500 left-2 top-0 h-full flex items-center px-2 border-r border-gray-300">
                <span>+۹۸</span>
              </div>
              <input
                v-model="phoneNumber"
                @input="handlePhoneInput"
                id="phoneInput"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="11"
                placeholder=" "
                class="peer block w-full px-4 py-4 pr-4 pl-16 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700"
              />
              <label
                for="phoneInput"
                class="absolute right-4 text-sm text-gray-500 bg-white px-1 z-10 transition-all duration-200 cursor-pointer"
                :class="phoneNumber ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                شماره موبایل
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-right">
              {{ errorMessage }}
            </div>
            <!-- فیلد شناسه فروشگاه (اختیاری برای ادمین، الزامی برای تننت) -->
            <div class="w-full mb-4 relative">
              <input
                  v-model="shopId"
                  id="shopIdInput"
                  type="text"
                  placeholder=" "
                  class="peer block w-full px-4 py-4 text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700"
              />
              <label
                  for="shopIdInput"
                  class="absolute right-4 text-sm text-gray-500 bg-white px-1 z-12 transition-all duration-200 cursor-pointer"
                  :class="shopId ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                شناسه فروشگاه (اختیاری)
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || !isPhoneValid"
              class="w-full bg-orange-500 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!isLoading" class="w-4 mr-auto text-white absolute left-4 pt-1 text-2xl border-l px-4 border-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span v-if="isLoading" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></span>
              <span>ادامه</span>
            </button>
          </form>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-else-if="currentStep === 'otp'" key="otp" class="w-full">
          <form @submit.prevent="handleOTPSubmit">
            <!-- OTP Boxes -->
            <div class="w-full mb-4 flex items-center justify-center gap-3" dir="ltr">
              <input
                v-for="(digit, idx) in otpDigits"
                :key="idx"
                :ref="el => (otpInputs[idx] = el)"
                v-model="otpDigits[idx]"
                @input="handleOtpInput(idx, $event)"
                @keydown="handleOtpKeydown(idx, $event)"
                @paste="handleOtpPaste($event)"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="1"
                class="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700"
              />
            </div>

            <!-- Resend Code -->
            <div class="flex items-center justify-between text-sm text-gray-600 mb-6">
              <button
                type="button"
                @click="resendCode"
                :disabled="timerActive"
                class="text-orange-600 hover:text-orange-700 disabled:text-gray-400"
              >
                ارسال مجدد کد
              </button>
              <span v-if="timerActive" class="font-mono">{{ formattedTimer }}</span>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-right">
              {{ errorMessage }}
            </div>

            <!-- Loading indicator (auto-submits, no confirm button needed) -->
            <div v-if="isLoading" class="flex justify-center py-2 mb-2">
              <span class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></span>
            </div>

            <button
              type="button"
              @click="goBack"
              class="w-full bg-white text-gray-700 text-center py-4 rounded-lg text-lg font-medium border border-gray-300 transition hover:bg-gray-50"
            >
              بازگشت
            </button>
          </form>
        </div>

        <!-- Step 3: Multi-shop selection (same phone manages more than one shop) -->
        <div v-else-if="currentStep === 'select-shop'" key="select-shop" class="w-full">
          <h2 class="text-lg font-medium text-gray-800 mb-4 text-right">فروشگاه مورد نظر را انتخاب کنید</h2>

          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-right">
            {{ errorMessage }}
          </div>

          <div class="space-y-3 mb-4">
            <button
              v-for="shop in availableShops"
              :key="shop.shopId"
              type="button"
              :disabled="isLoading"
              @click="selectShop(shop)"
              class="w-full flex items-center justify-between px-4 py-4 border border-gray-300 rounded-lg text-right transition hover:border-orange-500 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="text-xs text-gray-400">{{ shopTypeLabel(shop.type) }}</span>
              <span class="font-medium text-gray-800">{{ shop.name }}</span>
            </button>
          </div>

          <div v-if="isLoading" class="flex justify-center py-2 mb-2">
            <span class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></span>
          </div>

          <button
            type="button"
            @click="goBack"
            class="w-full bg-white text-gray-700 text-center py-4 rounded-lg text-lg font-medium border border-gray-300 transition hover:bg-gray-50"
          >
            بازگشت
          </button>
        </div>
      </Transition>
    </div>

    <!-- Toast Notification -->
    <Transition name="fade">
      <div v-if="toastMessage" class="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, nextTick, inject} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const currentStep = ref('phone') // 'phone' | 'otp' | 'select-shop'
const phoneNumber = ref('')
const otpDigits = ref(['', '', '', ''])
const otpInputs = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const toastMessage = ref('')
const shopId = ref('')
const availableShops = ref([])
// Timer
const timerActive = ref(false)
const timerSeconds = ref(120)
let timerInterval = null

const SHOP_TYPE_LABELS = {
  PHARMACY: 'داروخانه',
  MARKET: 'مارکت',
  VET: 'دامپزشکی',
  CLINIC: 'کلینیک',
}
const shopTypeLabel = (type) => SHOP_TYPE_LABELS[type] || type

// Computed
const isPhoneValid = computed(() => {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  return cleaned.length >= 10
})

const otpCode = computed(() => otpDigits.value.join(''))

const formattedTimer = computed(() => {
  const mins = Math.floor(timerSeconds.value / 60)
  const secs = timerSeconds.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// Methods
const handlePhoneInput = (event) => {
  const input = event.target
  const cleaned = input.value.replace(/\D/g, '')
  phoneNumber.value = cleaned
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const handlePhoneSubmit = async () => {
  if (!isPhoneValid.value) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    // Simulate API call
    //await new Promise(resolve => setTimeout(resolve, 1500))
    await authStore.sendOtpCode(phoneNumber.value)

    // Go to OTP step
    currentStep.value = 'otp'
    otpDigits.value = ['', '', '', '']
    startTimer()
    await nextTick()
    otpInputs.value[0]?.focus()
  } catch (error) {
    errorMessage.value = 'خطا در ارسال کد تایید'
  } finally {
    isLoading.value = false
  }
}

// یک نقطه واحد برای هدایت به پنل درست بر اساس نوع تشخیص داده‌شده
const goToPanel = async (adminPanelType) => {
  if (adminPanelType === 'ADMIN') {
    await router.push('/admin')
  } else if (adminPanelType === 'PHARMACY') {
    await router.push('/pharmacies')
  } else if (adminPanelType === 'MARKET') {
    await router.push('/markets')
  } else if (adminPanelType === 'VET' || adminPanelType === 'CLINIC') {
    await router.push('/clinic')
  }
}

const handleOTPSubmit = async () => {
  if (isLoading.value) return // جلوگیری از ارسال تکراری هنگام auto-submit
  if (otpCode.value.length < 4) return

  errorMessage.value = ''
  isLoading.value = true
  let result

  try {
    result = await authStore.loginWithPhone(phoneNumber.value, otpCode.value, shopId.value.trim())

    if (result.data.success) {
      if (result.data.needsShopSelection) {
        // همین شماره چند فروشگاه را مدیریت می‌کند - از کاربر بپرس کدام
        availableShops.value = result.data.shops || []
        currentStep.value = 'select-shop'
      } else {
        await goToPanel(result.data.adminPanelType)
      }
    } else {
      errorMessage.value = result.error || 'کد تایید اشتباه است'
      otpDigits.value = ['', '', '', '']
      await nextTick()
      otpInputs.value[0]?.focus()
    }
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'خطا در ورود'
    otpDigits.value = ['', '', '', '']
    await nextTick()
    otpInputs.value[0]?.focus()
  } finally {
    isLoading.value = false
  }
}

// ورودی هر خانه‌ی کد تایید: فقط رقم را نگه دار و به خانه بعدی برو
const handleOtpInput = (idx, event) => {
  const val = event.target.value.replace(/\D/g, '').slice(-1)
  otpDigits.value[idx] = val

  if (val && idx < otpDigits.value.length - 1) {
    otpInputs.value[idx + 1]?.focus()
  }

  if (otpDigits.value.every((d) => d !== '')) {
    handleOTPSubmit()
  }
}

const handleOtpKeydown = (idx, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[idx] && idx > 0) {
    otpInputs.value[idx - 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  const text = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '')
  if (!text) return
  event.preventDefault()

  const chars = text.slice(0, otpDigits.value.length).split('')
  chars.forEach((c, i) => {
    otpDigits.value[i] = c
  })

  const nextEmpty = otpDigits.value.findIndex((d) => d === '')
  if (nextEmpty === -1) {
    otpInputs.value[otpDigits.value.length - 1]?.focus()
    handleOTPSubmit()
  } else {
    otpInputs.value[nextEmpty]?.focus()
  }
}

const selectShop = async (shop) => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const result = await authStore.selectTenant(shop.shopId)
    if (result.success === false) {
      errorMessage.value = result.error || 'خطا در انتخاب فروشگاه'
    } else if (result.data?.adminPanelType) {
      await goToPanel(result.data.adminPanelType)
    } else {
      errorMessage.value = 'خطا در انتخاب فروشگاه'
    }
  } finally {
    isLoading.value = false
  }
}

const startTimer = () => {
  timerSeconds.value = 120
  timerActive.value = true

  timerInterval = setInterval(() => {
    timerSeconds.value--
    if (timerSeconds.value <= 0) {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerActive.value = false
}

const resendCode = async () => {
  if (timerActive.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    //await new Promise(resolve => setTimeout(resolve, 1000))
    await authStore.sendOtpCode(phoneNumber.value)
    otpDigits.value = ['', '', '', '']
    startTimer()
    showToast('کد تایید مجدد ارسال شد')
    await nextTick()
    otpInputs.value[0]?.focus()
  } catch (error) {
    errorMessage.value = 'خطا در ارسال مجدد کد'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  currentStep.value = 'phone'
  otpDigits.value = ['', '', '', '']
  availableShops.value = []
  errorMessage.value = ''
  stopTimer()
}

// Lifecycle
onMounted(() => {
  // Check if already logged in
  if (authStore.isAuthenticated) {
    const redirect = route.query.redirect || '/pharmacies'
    router.push(String(redirect))
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
