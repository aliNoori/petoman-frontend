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
            <!-- OTP Input -->
            <div class="w-full mb-4 relative">
              <input
                v-model="otpCode"
                id="otpInput"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                placeholder=" "
                class="peer block w-full px-4 py-4 text-sm border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700 text-2xl tracking-widest"
                dir="ltr"
              />
              <label
                for="otpInput"
                class="absolute right-4 text-sm text-gray-500 bg-white px-1 z-10 transition-all duration-200 cursor-pointer"
                :class="otpCode ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                کد تایید
              </label>
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

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                type="submit"
                :disabled="isLoading || otpCode.length < 5"
                class="w-full bg-orange-500 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading" class="w-4 mr-auto text-white absolute left-4 pt-1 text-2xl border-l px-4 border-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span v-if="isLoading" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></span>
                <span>ورود</span>
              </button>
              <button
                type="button"
                @click="goBack"
                class="w-full bg-white text-gray-700 text-center py-4 rounded-lg text-lg font-medium border border-gray-300 transition hover:bg-gray-50"
              >
                بازگشت
              </button>
            </div>
          </form>
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
import {ref, computed, onMounted, onUnmounted, inject} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const currentStep = ref('phone') // 'phone' | 'otp'
const phoneNumber = ref('')
const otpCode = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const toastMessage = ref('')
const shopId = ref('')
// Timer
const timerActive = ref(false)
const timerSeconds = ref(120)
let timerInterval = null

// Computed
const isPhoneValid = computed(() => {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  return cleaned.length >= 10
})

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
    const payload = {
      phone: phoneNumber.value,
      shopId: shopId.value || null // ارسال null اگر خالی بود
    }
    // Simulate API call
    //await new Promise(resolve => setTimeout(resolve, 1500))
    await authStore.sendOtpCode(phoneNumber.value)

    // Go to OTP step
    currentStep.value = 'otp'
    startTimer()
  } catch (error) {
    errorMessage.value = 'خطا در ارسال کد تایید'
  } finally {
    isLoading.value = false
  }
}

const handleOTPSubmit = async () => {
  if (otpCode.value.length < 5) return

  errorMessage.value = ''
  isLoading.value = true
  let result;

  try {
    // For testing: accept any 5-digit code
    result = await authStore.loginWithPhone(phoneNumber.value, otpCode.value,shopId.value.trim())

    if (result.data.success) {
      if (result.data.adminPanelType === 'ADMIN') {
        // Redirect to intended page or default
        await router.push('/admin')

      } else if (result.data.adminPanelType === 'PHARMACY') {
        await router.push('/pharmacies')

      } else if (result.data.adminPanelType === 'MARKET') {
        await router.push('/markets')

      } else if (result.data.adminPanelType === 'VET') {
        await router.push('/clinic')

      }else if (result.data.adminPanelType === 'CLINIC') {
        await router.push('/clinic')
      }

    } else {
      errorMessage.value = result.error || 'کد تایید اشتباه است'
    }
  } catch (error) {
    errorMessage.value = result.error||'خطا در ورود'
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
    startTimer()
    showToast('کد تایید مجدد ارسال شد')
  } catch (error) {
    errorMessage.value = 'خطا در ارسال مجدد کد'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  currentStep.value = 'phone'
  otpCode.value = ''
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
