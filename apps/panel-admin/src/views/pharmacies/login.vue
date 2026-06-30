<template>
  <div class="h-screen flex bg-gray-50 font-vazir overflow-hidden">
    <div class="w-full h-full flex">
      
      <!-- Right Side - Form Section -->
      <div class="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div class="w-full max-w-md">
          
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <img 
              src="/pet.png" 
              alt="PetoMan Logo" 
              class="w-24 h-24 md:w-28 md:h-28 object-contain"
            />
          </div>

          <!-- Title -->
          <div class="text-center mb-6">
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-2">ورود به پنل داروخانه</h2>
            <p class="text-sm text-gray-600">سیستم مدیریت هوشمند داروخانه</p>
          </div>

          <!-- Messages -->
          
          <!-- Success Message -->
          <Transition name="slide-down">
            <div v-if="successMessage" class="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-start gap-2">
              <i class="ti ti-circle-check text-teal-500 text-lg flex-shrink-0"></i>
              <p class="text-sm font-semibold text-teal-900">{{ successMessage }}</p>
            </div>
          </Transition>

          <!-- Error Message -->
          <Transition name="slide-down">
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <i class="ti ti-alert-circle text-red-600 text-lg flex-shrink-0"></i>
              <p class="text-sm font-semibold text-red-900">{{ errorMessage }}</p>
            </div>
          </Transition>

          <!-- Login Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
          
          <!-- کد ملی -->
          <div v-if="!showOtpInput">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              کد ملی (اختیاری)
            </label>
            <div class="relative">
              <input
                v-model="loginForm.nationalCode"
                type="text"
                maxlength="10"
                @input="formatNationalCode"
                class="w-full px-4 py-3 bg-gray-50 rounded-lg transition-all text-right text-sm outline-none border-none focus:ring-1 focus:ring-teal-500"
                placeholder="کد ملی 10 رقمی"
              />
            </div>
            <p v-if="errors.nationalCode" class="mt-1.5 text-xs text-red-600">
              {{ errors.nationalCode }}
            </p>
          </div>

          <!-- شماره موبایل -->
          <div v-if="!showOtpInput">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              شماره موبایل <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="loginForm.mobile"
                type="tel"
                maxlength="11"
                @input="formatMobile"
                class="w-full px-4 py-3 bg-gray-50 rounded-lg transition-all font-english text-left text-sm outline-none border-none focus:ring-1 focus:ring-teal-500"
                placeholder="09123456789"
              />
            </div>
            <p v-if="errors.mobile" class="mt-1.5 text-xs text-red-600">
              {{ errors.mobile }}
            </p>
          </div>

          <!-- کد تایید (OTP) -->
          <div v-if="showOtpInput">
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-center">
              کد تایید ارسال شده به {{ loginForm.mobile }} را وارد کنید
            </label>
            <div class="flex justify-center gap-2 mt-4" dir="ltr">
              <input
                v-for="(digit, index) in formData.otp"
                :key="index"
                :ref="(el) => { if (el) otpInputs[index] = el as HTMLInputElement }"
                v-model="formData.otp[index]"
                type="text"
                maxlength="1"
                @input="handleOtpInput(index, $event)"
                @keydown="handleOtpKeydown(index, $event)"
                @paste="handleOtpPaste"
                class="w-14 h-14 text-center text-2xl font-bold bg-gray-50 rounded-lg transition-all outline-none border-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <p v-if="errors.otpCode" class="mt-2 text-xs text-red-600 text-center">
              {{ errors.otpCode }}
            </p>
            <p class="mt-3 text-xs text-gray-600 text-center">
              کد تایید دریافت نکردید؟ 
              <button 
                type="button" 
                @click="resendOtp"
                :disabled="otpTimer > 0"
                class="text-xs text-teal-500 hover:text-teal-600 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {{ otpTimer > 0 ? `ارسال مجدد (${otpTimer}s)` : 'ارسال مجدد' }}
              </button>
            </p>
          </div>

          <!-- رمز عبور -->
          <div v-if="!showOtpInput">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              رمز عبور (اختیاری)
            </label>
            <div class="relative">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg transition-all text-sm outline-none border-none focus:ring-1 focus:ring-teal-500"
                placeholder="رمز عبور"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-lg"></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1.5 text-xs text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- مرا به خاطر بسپار -->
          <div v-if="!showOtpInput" class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-400 cursor-pointer"
              />
              <span class="text-gray-700 group-hover:text-gray-900 transition-colors">مرا به خاطر بسپار</span>
            </label>
            
            <button type="button" class="text-teal-500 hover:text-teal-600 font-medium transition-colors">
              فراموشی رمز عبور؟
            </button>
          </div>

          <!-- دکمه ورود / تایید -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 bg-gradient-to-l from-teal-500 to-teal-400 text-white rounded-lg font-bold hover:from-teal-600 hover:to-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-teal-500/30"
          >
            <span v-if="!isLoading && !showOtpInput" class="flex items-center justify-center gap-2">
              <i class="ti ti-login text-lg"></i>
              ارسال کد تایید
            </span>
            <span v-else-if="!isLoading && showOtpInput" class="flex items-center justify-center gap-2">
              <i class="ti ti-shield-check text-lg"></i>
              تایید و ورود
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <span class="animate-spin">
                <i class="ti ti-loader text-lg"></i>
              </span>
              در حال پردازش...
            </span>
          </button>

          <!-- Back to Form Button (when OTP is shown) -->
          <button
            v-if="showOtpInput"
            type="button"
            @click="backToForm"
            class="w-full py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i class="ti ti-arrow-right text-lg"></i>
            بازگشت به فرم ورود
          </button>
        </form>

        <!-- Footer Info -->
        <div class="mt-5 pt-5 border-t border-gray-200">
          <p class="text-xs text-gray-600 text-center mb-3">
            <i class="ti ti-info-circle ml-1"></i>
            برای ثبت‌نام یا دریافت اطلاعات بیشتر
          </p>
          <div class="flex items-center justify-center gap-3 flex-wrap text-xs">
            <a href="tel:02188888888" class="flex items-center gap-1.5 text-teal-500 hover:text-teal-600 transition-colors">
              <i class="ti ti-phone"></i>
              <span class="font-english">021-88888888</span>
            </a>
            <span class="text-gray-300">|</span>
            <a href="mailto:support@petoman.com" class="flex items-center gap-1.5 text-teal-500 hover:text-teal-600 transition-colors">
              <i class="ti ti-mail"></i>
              <span>پشتیبانی</span>
            </a>
          </div>
        </div>

        <!-- Mobile Footer -->
        <div class="lg:hidden text-center mt-4">
          <p class="text-xs text-gray-500">
            ساخته شده با 
            <i class="ti ti-heart-filled text-red-500 mx-1"></i>
            برای سلامت حیوانات
          </p>
        </div>
        </div>
        <!-- Close w-full max-w-md -->
      </div>
      <!-- Close Right Side Form Section -->

      <!-- Left Side - Brand/Image Section (Desktop Only) -->
      <div class="hidden lg:flex w-1/2 bg-gradient-to-r from-teal-400 to-teal-500 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); background-size: 60px 60px;"></div>
        </div>

        <!-- Content Container -->
        <div class="relative z-10 flex flex-col justify-between w-full p-12 h-full">

          <!-- Middle - Rotating Messages -->
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-center">
              
              <!-- Rotating Features -->
              <div class="min-h-[180px] flex items-center justify-center">
                <Transition name="slide-fade" mode="out-in">
                  <div :key="currentFeature" class="max-w-xl mx-auto">
                    <div class="flex items-center justify-center gap-4 mb-4">
                      <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <i :class="features[currentFeature].icon" class="text-3xl text-white"></i>
                      </div>
                    </div>
                    <h4 class="text-2xl font-bold text-white mb-3">{{ features[currentFeature].title }}</h4>
                    <p class="text-lg text-white/90 leading-relaxed">{{ features[currentFeature].description }}</p>
                  </div>
                </Transition>
              </div>

              <!-- Pagination Dots -->
              <div class="flex justify-center gap-1.5 mt-6">
                <button 
                  v-for="(feature, index) in features" 
                  :key="index"
                  @click="currentFeature = index"
                  class="transition-all duration-300"
                  :class="currentFeature === index ? 'w-8 h-2 bg-white rounded-full' : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'"
                ></button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <!-- Close Left Side -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'


// Form Data
const loginForm = reactive({
  nationalCode: '',
  mobile: '',
  password: '',
  rememberMe: false
})

const formData = reactive({
  otp: ['', '', '', '', '']
})

// UI States
const showPassword = ref(false)
const showOtpInput = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const otpTimer = ref(0)

// Validation Errors
const errors = reactive({
  nationalCode: '',
  mobile: '',
  password: '',
  otpCode: ''
})

// OTP Input Refs
const otpInputs = ref<HTMLInputElement[]>([])

// Features for rotation
const features = ref([
  {
    icon: 'ti ti-pill',
    title: 'مدیریت موجودی دارو',
    description: 'کنترل لحظه‌ای موجودی، تاریخ انقضا و هشدار کمبود دارو'
  },
  {
    icon: 'ti ti-file-text',
    title: 'سفارش‌های آنلاین',
    description: 'دریافت و پردازش سریع سفارشات آنلاین از کلینیک‌ها'
  },
  {
    icon: 'ti ti-chart-line',
    title: 'گزارش‌های هوشمند',
    description: 'تحلیل فروش، سود و گزارشات مالی جامع'
  },
  {
    icon: 'ti ti-shield-check',
    title: 'امنیت بالا',
    description: 'حفاظت از اطلاعات با استانداردهای امنیتی پیشرفته'
  },
  {
    icon: 'ti ti-bell-ringing',
    title: 'اعلان‌های هوشمند',
    description: 'اطلاع‌رسانی لحظه‌ای سفارشات و موجودی کم'
  }
])

const currentFeature = ref(0)
let featureRotationInterval: ReturnType<typeof setInterval> | null = null

// Start feature rotation
onMounted(() => {
  featureRotationInterval = setInterval(() => {
    currentFeature.value = (currentFeature.value + 1) % features.value.length
  }, 4000)
})

onUnmounted(() => {
  if (featureRotationInterval) {
    clearInterval(featureRotationInterval)
  }
})

// Format National Code
const formatNationalCode = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  loginForm.nationalCode = input.value
  errors.nationalCode = ''
}

// Format Mobile
const formatMobile = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '')
  loginForm.mobile = input.value
  errors.mobile = ''
}

// Validate National Code (Iranian algorithm)
const validateNationalCode = (code: string): boolean => {
  if (!code || code.length !== 10) return false
  
  const check = parseInt(code[9])
  let sum = 0
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i)
  }
  
  const remainder = sum % 11
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder)
}

// Validate Form
const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  errors.nationalCode = ''
  errors.mobile = ''
  errors.password = ''
  
  // Validate National Code (if provided)
  if (loginForm.nationalCode && !validateNationalCode(loginForm.nationalCode)) {
    errors.nationalCode = 'کد ملی وارد شده معتبر نیست'
    isValid = false
  }
  
  // Validate Mobile (required)
  if (!loginForm.mobile) {
    errors.mobile = 'شماره موبایل الزامی است'
    isValid = false
  } else if (!/^09\d{9}$/.test(loginForm.mobile)) {
    errors.mobile = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد'
    isValid = false
  }
  
  // Validate Password (if provided)
  if (loginForm.password && loginForm.password.length < 6) {
    errors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد'
    isValid = false
  }
  
  return isValid
}

// Handle OTP Input
const handleOtpInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  
  formData.otp[index] = value
  
  // Auto-focus next input
  if (value && index < 3) {
    otpInputs.value[index + 1]?.focus()
  }
  
  errors.otpCode = ''
}

// Handle OTP Keydown
const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  // Backspace
  if (event.key === 'Backspace' && !formData.otp[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  
  // Arrow Left
  if (event.key === 'ArrowLeft' && index < 3) {
    event.preventDefault()
    otpInputs.value[index + 1]?.focus()
  }
  
  // Arrow Right
  if (event.key === 'ArrowRight' && index > 0) {
    event.preventDefault()
    otpInputs.value[index - 1]?.focus()
  }
}

// Handle OTP Paste
const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 4)
  
  if (pastedData) {
    for (let i = 0; i < pastedData.length; i++) {
      formData.otp[i] = pastedData[i]
    }
    // Focus last filled input
    otpInputs.value[Math.min(pastedData.length - 1, 3)]?.focus()
  }
}

// Start OTP Timer
const startOtpTimer = () => {
  otpTimer.value = 120 // 2 minutes
  const interval = setInterval(() => {
    otpTimer.value--
    if (otpTimer.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

// Resend OTP
const resendOtp = async () => {
  if (otpTimer.value > 0) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    successMessage.value = 'کد تایید مجدد ارسال شد'
    startOtpTimer()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = 'خطا در ارسال مجدد کد تایید'
  } finally {
    isLoading.value = false
  }
}

// Handle Submit
const handleSubmit = async () => {
  if (!showOtpInput.value) {
    // Step 1: Send OTP
    if (!validateForm()) return
    
    isLoading.value = true
    errorMessage.value = ''
    
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showOtpInput.value = true
      successMessage.value = `کد تایید به شماره ${loginForm.mobile} ارسال شد`
      startOtpTimer()
      
      // Auto-focus first OTP input
      setTimeout(() => {
        otpInputs.value[0]?.focus()
      }, 100)
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } catch (error) {
      errorMessage.value = 'خطا در ارسال کد تایید. لطفا مجددا تلاش کنید.'
    } finally {
      isLoading.value = false
    }
  } else {
    // Step 2: Verify OTP and Login
    const otpCode = formData.otp.join('')
    
    if (otpCode.length !== 4) {
      errors.otpCode = 'لطفا کد 4 رقمی را وارد کنید'
      return
    }
    
    isLoading.value = true
    errorMessage.value = ''
    
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful login
      const pharmacyUser = {
        name: 'داروخانه نمونه',
        mobile: loginForm.mobile,
        nationalCode: loginForm.nationalCode
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('pharmacy_user', JSON.stringify(pharmacyUser))
        
        successMessage.value = 'ورود موفقیت‌آمیز! در حال انتقال...'
        
        setTimeout(() => {
          window.location.href = '/pharmacies'
        }, 1000)
      }
    } catch (error) {
      errorMessage.value = 'کد تایید نامعتبر است'
      formData.otp = ['', '', '', '']
      otpInputs.value[0]?.focus()
    } finally {
      isLoading.value = false
    }
  }
}

// Back to Form
const backToForm = () => {
  showOtpInput.value = false
  formData.otp = ['', '', '', '']
  errors.otpCode = ''
  otpTimer.value = 0
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-down-leave-to {
  opacity: 0;
}

/* RTL Support */
[dir="rtl"] input {
  direction: rtl;
}

input.font-english {
  direction: ltr !important;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
