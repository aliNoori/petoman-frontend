<!-- @ts-nocheck -->
<template>
  <div class="fixed inset-0  flex font-vazir overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(16 185 129) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <!-- Two Column Grid - Full Screen -->
    <div class="relative w-full flex flex-col lg:flex-row">
      
      <!-- Right Side - Form Section -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div class="w-full max-w-md">
          <!-- Logo & Title (Mobile) -->
          <div class="lg:hidden text-center mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 mb-4">
              <img :src="petLogo" alt="PetoMan Logo" class="w-full h-full object-contain" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">ورود به پنل کلینیک</h1>
          </div>

          <!-- Logo & Title (Desktop) -->
          <div class="hidden lg:block text-center mb-8">
            <div class="inline-flex items-center justify-center w-28 h-28 mb-4">
              <img :src="petLogo" alt="PetoMan Logo" class="w-full h-full object-contain" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900">ورود به پنل کلینیک</h1>
          </div>
          
          <!-- Success Message -->
          <Transition name="slide-down">
            <div v-if="successMessage" class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
              <i class="ti ti-circle-check text-emerald-600 text-lg flex-shrink-0"></i>
              <p class="text-sm font-semibold text-emerald-900">{{ successMessage }}</p>
            </div>
          </Transition>

          <!-- Error Message -->
          <Transition name="slide-down">
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <i class="ti ti-alert-triangle text-red-600 text-lg flex-shrink-0"></i>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-red-900 mb-0.5">خطا در ورود</p>
                <p class="text-xs text-red-700">{{ errorMessage }}</p>
              </div>
              <button @click="errorMessage = ''" class="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0">
                <i class="ti ti-x text-red-600 text-sm"></i>
              </button>
            </div>
          </Transition>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
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
                class="w-full px-4 py-3 bg-gray-50 rounded-lg transition-all text-right text-sm outline-none border-none focus:ring-1 focus:ring-emerald-500"
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
              شماره موبایل
            </label>
            <div class="relative">
              <input
                v-model="loginForm.mobile"
                type="tel"
                maxlength="11"
                @input="formatMobile"
                class="w-full px-4 py-3 bg-gray-50 rounded-lg transition-all font-english text-left text-sm outline-none border-none focus:ring-1 focus:ring-emerald-500"
                placeholder="09123456789"
              />
            </div>
            <p v-if="errors.mobile" class="mt-1.5 text-xs text-red-600">
              {{ errors.mobile }}
            </p>
          </div>

          <!-- کد تایید (OTP) -->
          <div v-if="showOtpInput">
            <label class="block text-sm font-semibold text-gray-700 mb-3 text-center">
              کد تایید را وارد کنید
            </label>
            <div class="flex gap-3 justify-center mb-3" dir="ltr">
              <input
                v-for="(digit, index) in 4"
                :key="index"
                :ref="el => otpRefs[index] = el"
                v-model="otpDigits[index]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                @input="handleOtpInput(index, $event)"
                @keydown="handleOtpKeydown(index, $event)"
                @paste="handleOtpPaste"
                class="w-14 h-14 text-center text-2xl font-bold bg-gray-50 rounded-lg transition-all outline-none border-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <p v-if="errors.otpCode" class="mt-2 text-xs text-red-600 text-center">
              {{ errors.otpCode }}
            </p>
            <p class="mt-3 text-xs text-gray-600 text-center">
              کد تایید به شماره 
              <span class="font-english font-semibold">{{ loginForm.mobile }}</span>
              ارسال شد
            </p>
            <div class="mt-2 text-center">
              <button 
                type="button" 
                @click="resendOtp"
                :disabled="otpTimer > 0"
                class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {{ otpTimer > 0 ? `ارسال مجدد (${otpTimer}s)` : 'ارسال مجدد' }}
              </button>
            </div>
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
                class="w-full px-4 py-3 pl-12 bg-gray-50 rounded-lg transition-all text-sm outline-none border-none focus:ring-1 focus:ring-emerald-500"
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
                class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span class="text-gray-700 group-hover:text-gray-900 transition-colors">مرا به خاطر بسپار</span>
            </label>
            
            <button type="button" class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              فراموشی رمز عبور؟
            </button>
          </div>

          <!-- دکمه ورود / تایید -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 bg-gradient-to-l from-emerald-600 to-emerald-500 text-white rounded-lg font-bold hover:from-emerald-700 hover:to-emerald-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-600/30"
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

          <!-- دکمه بازگشت (هنگام نمایش OTP) -->
          <button
            v-if="showOtpInput"
            type="button"
            @click="resetForm"
            class="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <i class="ti ti-arrow-right ml-1"></i>
            بازگشت
          </button>
        </form>

        <!-- Footer Info -->
        <div class="mt-5 pt-5 border-t border-gray-200">
          <p class="text-xs text-gray-600 text-center mb-3">
            <i class="ti ti-info-circle ml-1"></i>
            برای ثبت‌نام یا دریافت اطلاعات بیشتر
          </p>
          <div class="flex items-center justify-center gap-3 flex-wrap text-xs">
            <a href="tel:02188888888" class="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors">
              <i class="ti ti-phone"></i>
              <span class="font-english">021-88888888</span>
            </a>
            <span class="text-gray-300">|</span>
            <a href="mailto:support@petoman.com" class="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors">
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
      <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 relative overflow-hidden">
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
                    <p class="text-lg text-emerald-50 leading-relaxed">{{ features[currentFeature].description }}</p>
                  </div>
                </Transition>
              </div>

              <!-- Dots Indicator -->
              <div class="flex items-center justify-center gap-1.5 mt-6">
                <button
                  v-for="(feature, index) in features"
                  :key="index"
                  @click="currentFeature = index"
                  class="transition-all duration-300"
                  :class="currentFeature === index ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'"
                  style="border-radius: 4px;"
                ></button>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div>
    <!-- Close Two Column Grid -->
  </div>
  <!-- Close Main Container -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const petLogo = '/pet.png'

// OTP refs and digits
const otpRefs = ref([])
const otpDigits = ref(['', '', '', ''])

// Form state
const loginForm = ref({
  nationalCode: '',
  mobile: '',
  password: '',
  otpCode: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showOtpInput = ref(false)
const otpTimer = ref(0)
let otpInterval = null

// Rotating features
const currentFeature = ref(0)
const features = ref([
  {
    icon: 'ti ti-video',
    title: 'ویزیت آنلاین و حضوری',
    description: 'امکان ویزیت حضوری در کلینیک یا ویزیت آنلاین از راحتی منزل - انتخاب با شماست!'
  },
  {
    icon: 'ti ti-messages',
    title: 'گفتگوی آنلاین با دامپزشک',
    description: 'چت مستقیم با دامپزشک متخصص برای پاسخ سریع به سوالات و مشاوره فوری'
  },
  {
    icon: 'ti ti-phone-call',
    title: 'مشاوره تلفنی ۲۴ ساعته',
    description: 'تماس تلفنی با دامپزشک در هر ساعت از شبانه‌روز برای مواقع اضطراری'
  },
  {
    icon: 'ti ti-bell-ringing',
    title: 'یادآوری واکسن و قرار ویزیت',
    description: 'اعلان خودکار برای نوبت‌های ویزیت، واکسیناسیون و مراقبت‌های دوره‌ای'
  },
  {
    icon: 'ti ti-ambulance',
    title: 'درخواست ویزیت اورژانسی',
    description: 'امکان درخواست فوری ویزیت در منزل برای شرایط اضطراری حیوان خانگی'
  }
])

// Auto rotate features every 4 seconds
let featureInterval
onMounted(() => {
  featureInterval = setInterval(() => {
    currentFeature.value = (currentFeature.value + 1) % features.value.length
  }, 4000)
})

onUnmounted(() => {
  if (featureInterval) {
    clearInterval(featureInterval)
  }
  if (otpInterval) {
    clearInterval(otpInterval)
  }
})

// Validation errors
const errors = ref({
  nationalCode: '',
  mobile: '',
  password: '',
  otpCode: ''
})

// Validation functions
const validateNationalCode = (code) => {
  if (!code) return '' // اختیاری
  if (!/^\d{10}$/.test(code)) {
    return 'کد ملی باید 10 رقم باشد'
  }
  
  // الگوریتم بررسی کد ملی
  const check = parseInt(code[9])
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i)
  }
  const remainder = sum % 11
  const isValid = (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder)
  
  if (!isValid) {
    return 'کد ملی نامعتبر است'
  }
  
  return ''
}

const validateMobile = (mobile) => {
  if (!mobile) {
    return 'شماره موبایل الزامی است'
  }
  if (!/^09\d{9}$/.test(mobile)) {
    return 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد'
  }
  return ''
}

const validatePassword = (password) => {
  if (!password) return '' // اختیاری
  if (password.length < 6) {
    return 'رمز عبور باید حداقل 6 کاراکتر باشد'
  }
  return ''
}

// Format inputs
const formatNationalCode = (event) => {
  loginForm.value.nationalCode = event.target.value.replace(/\D/g, '')
  errors.value.nationalCode = ''
}

const formatMobile = (event) => {
  loginForm.value.mobile = event.target.value.replace(/\D/g, '')
  errors.value.mobile = ''
}

// OTP Inputs Handling
const handleOtpInput = (index, event) => {
  const value = event.target.value.replace(/\D/g, '')
  otpDigits.value[index] = value
  
  // Update combined OTP code
  loginForm.value.otpCode = otpDigits.value.join('')
  errors.value.otpCode = ''
  
  // Auto-focus next input
  if (value && index < 3) {
    otpRefs.value[index + 1]?.focus()
  }
}

const handleOtpKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
  // Handle arrow keys
  else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    otpRefs.value[index - 1]?.focus()
  }
  else if (event.key === 'ArrowRight' && index < 3) {
    event.preventDefault()
    otpRefs.value[index + 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
  
  for (let i = 0; i < pastedData.length; i++) {
    otpDigits.value[i] = pastedData[i]
  }
  
  loginForm.value.otpCode = otpDigits.value.join('')
  
  // Focus last filled input or first empty
  const lastIndex = Math.min(pastedData.length - 1, 3)
  otpRefs.value[lastIndex]?.focus()
}

// Start OTP timer
const startOtpTimer = () => {
  otpTimer.value = 120 // 2 minutes
  otpInterval = setInterval(() => {
    if (otpTimer.value > 0) {
      otpTimer.value--
    } else {
      clearInterval(otpInterval)
    }
  }, 1000)
}

// Resend OTP
const resendOtp = async () => {
  if (otpTimer.value > 0) return
  
  isLoading.value = true
  
  // Simulate API call - در اینجا باید کد واقعی ارسال OTP باشد
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('کد تایید مجدد ارسال شد به:', loginForm.value.mobile)
  successMessage.value = 'کد تایید مجدد ارسال شد'
  startOtpTimer()
  
  isLoading.value = false
}

// Reset form
const resetForm = () => {
  showOtpInput.value = false
  loginForm.value.otpCode = ''
  otpDigits.value = ['', '', '', '']
  errors.value.otpCode = ''
  if (otpInterval) {
    clearInterval(otpInterval)
    otpTimer.value = 0
  }
}

// Handle login
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // اگر در مرحله OTP هستیم
  if (showOtpInput.value) {
    if (!loginForm.value.otpCode || loginForm.value.otpCode.length !== 4) {
      errors.value.otpCode = 'کد تایید 4 رقمی الزامی است'
      return
    }
    
    isLoading.value = true
    
    // Simulate OTP verification - در اینجا باید API واقعی باشد
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('تایید OTP:', loginForm.value.otpCode)
    
    // فعلاً هر کدی را قبول می‌کنیم
    successMessage.value = 'ورود موفقیت‌آمیز! در حال انتقال...'
    
    setTimeout(() => {
      router.push('/panel/clinics')
    }, 1000)
    
    isLoading.value = false
    return
  }
  
  // مرحله اول: ارسال OTP
  errors.value.mobile = validateMobile(loginForm.value.mobile)
  
  if (loginForm.value.nationalCode) {
    errors.value.nationalCode = validateNationalCode(loginForm.value.nationalCode)
  }
  
  if (loginForm.value.password) {
    errors.value.password = validatePassword(loginForm.value.password)
  }

  if (errors.value.mobile || errors.value.nationalCode || errors.value.password) {
    errorMessage.value = 'لطفاً اطلاعات را به درستی وارد کنید'
    return
  }

  isLoading.value = true
  
  // Simulate API call - در اینجا باید کد واقعی ارسال OTP باشد
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  console.log('ارسال کد تایید به:', loginForm.value.mobile)
  
  // نمایش صفحه OTP
  showOtpInput.value = true
  successMessage.value = 'کد تایید 4 رقمی به شماره موبایل شما ارسال شد'
  startOtpTimer()
  
  // Focus first OTP input
  await nextTick()
  otpRefs.value[0]?.focus()
  
  isLoading.value = false
}

// Load saved credentials on mount
onMounted(() => {
  const savedUser = localStorage.getItem('clinic_user')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    loginForm.value.nationalCode = user.nationalCode || ''
    loginForm.value.mobile = user.mobile || ''
    loginForm.value.rememberMe = true
  }
})

</script>

<style scoped>
.font-vazir {
  font-family: 'Vazirmatn', sans-serif;
}

.font-english {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}



/* Slide Fade Transition for rotating features */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
