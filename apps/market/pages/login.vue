<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-l from-blue-500 to-teal-500 text-white">
      <div class="container mx-auto px-4 py-8 text-center">
        <h1 class="text-2xl md:text-3xl font-bold">ورود / ثبت‌نام</h1>
        <p class="text-white/80 mt-2">به پت‌مارکت خوش آمدید</p>
      </div>
    </div>

    <!-- Login Form -->
    <div class="container mx-auto px-4 py-8 max-w-md">
      <div class="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <!-- Tab Headers -->
        <div class="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button 
            @click="activeTab = 'login'"
            :class="activeTab === 'login' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'"
            class="flex-1 py-2 rounded-lg font-medium transition-all"
          >
            ورود
          </button>
          <button 
            @click="activeTab = 'register'"
            :class="activeTab === 'register' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'"
            class="flex-1 py-2 rounded-lg font-medium transition-all"
          >
            ثبت‌نام
          </button>
        </div>

        <!-- Login Tab -->
        <div v-if="activeTab === 'login'">
          <!-- Step 1: Phone Number -->
          <div v-if="loginStep === 1">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-device-mobile text-blue-500 text-3xl"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900">شماره موبایل خود را وارد کنید</h2>
              <p class="text-gray-500 text-sm mt-2">کد تأیید به این شماره ارسال می‌شود</p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">شماره موبایل</label>
              <div class="relative">
                <input 
                  type="tel" 
                  v-model="phoneNumber"
                  placeholder="09123456789"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-left ltr"
                  dir="ltr"
                >
                <i class="ti ti-phone absolute top-1/2 -translate-y-1/2 right-4 text-gray-400"></i>
              </div>
            </div>

            <button 
              @click="sendOTP"
              :disabled="!isValidPhone"
              :class="isValidPhone ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'"
              class="w-full py-3 text-white rounded-xl font-medium transition-colors"
            >
              ارسال کد تأیید
            </button>
          </div>

          <!-- Step 2: OTP Verification -->
          <div v-if="loginStep === 2">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-shield-check text-green-500 text-3xl"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900">کد تأیید را وارد کنید</h2>
              <p class="text-gray-500 text-sm mt-2">
                کد ۶ رقمی به شماره {{ phoneNumber }} ارسال شد
              </p>
            </div>

            <!-- OTP Input -->
            <div class="flex gap-2 justify-center mb-4" dir="ltr">
              <input 
                v-for="(digit, index) in 6" 
                :key="index"
                type="text" 
                maxlength="1"
                v-model="otpDigits[index]"
                @input="handleOTPInput(index, $event)"
                @keydown="handleOTPKeydown(index, $event)"
                :ref="el => otpRefs[index] = el"
                class="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              >
            </div>

            <!-- Timer -->
            <div class="text-center mb-4">
              <span v-if="resendTimer > 0" class="text-gray-500 text-sm">
                ارسال مجدد کد تا {{ resendTimer }} ثانیه دیگر
              </span>
              <button 
                v-else 
                @click="resendOTP"
                class="text-blue-500 text-sm hover:underline"
              >
                ارسال مجدد کد
              </button>
            </div>

            <button 
              @click="verifyOTP"
              :disabled="!isOTPComplete"
              :class="isOTPComplete ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'"
              class="w-full py-3 text-white rounded-xl font-medium transition-colors mb-3"
            >
              تأیید و ورود
            </button>

            <button 
              @click="loginStep = 1"
              class="w-full py-3 text-gray-600 hover:text-gray-900 text-sm"
            >
              تغییر شماره موبایل
            </button>
          </div>
        </div>

        <!-- Register Tab -->
        <div v-if="activeTab === 'register'">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i class="ti ti-user-plus text-teal-500 text-3xl"></i>
            </div>
            <h2 class="text-lg font-bold text-gray-900">ایجاد حساب کاربری</h2>
            <p class="text-gray-500 text-sm mt-2">اطلاعات خود را وارد کنید</p>
          </div>

          <form @submit.prevent="register" class="space-y-4">
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">نام و نام خانوادگی</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="registerForm.name"
                  placeholder="نام و نام خانوادگی"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 pr-12"
                >
                <i class="ti ti-user absolute top-1/2 -translate-y-1/2 right-4 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">شماره موبایل</label>
              <div class="relative">
                <input 
                  type="tel" 
                  v-model="registerForm.phone"
                  placeholder="09123456789"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-left ltr pr-12"
                  dir="ltr"
                >
                <i class="ti ti-phone absolute top-1/2 -translate-y-1/2 right-4 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">ایمیل (اختیاری)</label>
              <div class="relative">
                <input 
                  type="email" 
                  v-model="registerForm.email"
                  placeholder="example@email.com"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-left ltr pr-12"
                  dir="ltr"
                >
                <i class="ti ti-mail absolute top-1/2 -translate-y-1/2 right-4 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label class="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="registerForm.acceptTerms"
                  class="rounded border-gray-300 text-blue-500 focus:ring-blue-500 mt-1"
                >
                <span class="text-gray-600 text-sm">
                  <NuxtLink to="/terms" class="text-blue-500 hover:underline">قوانین و مقررات</NuxtLink>
                  سایت را مطالعه کردم و قبول دارم
                </span>
              </label>
            </div>

            <button 
              type="submit"
              :disabled="!isRegisterValid"
              :class="isRegisterValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'"
              class="w-full py-3 text-white rounded-xl font-medium transition-colors"
            >
              ثبت‌نام
            </button>
          </form>
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-gray-400 text-sm">یا</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Social Login -->
        <div class="space-y-3">
          <button class="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ورود با گوگل
          </button>
        </div>
      </div>

      <!-- Help Text -->
      <p class="text-center text-gray-500 text-sm mt-6">
        نیاز به کمک دارید؟
        <NuxtLink to="/contact" class="text-blue-500 hover:underline">تماس با پشتیبانی</NuxtLink>
      </p>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        :class="toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
      >
        <i :class="toast.icon"></i>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Tab state
const activeTab = ref('login')

// Login states
const loginStep = ref(1)
const phoneNumber = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref([])
const resendTimer = ref(0)
let timerInterval = null

// Register form
const registerForm = ref({
  name: '',
  phone: '',
  email: '',
  acceptTerms: false
})

// Validations
const isValidPhone = computed(() => {
  return /^09\d{9}$/.test(phoneNumber.value)
})

const isOTPComplete = computed(() => {
  return otpDigits.value.every(d => d !== '')
})

const isRegisterValid = computed(() => {
  return registerForm.value.name.length >= 3 
    && /^09\d{9}$/.test(registerForm.value.phone)
    && registerForm.value.acceptTerms
})

// Toast
const toast = ref({ show: false, message: '', icon: '', type: 'success' })

const showToast = (message, icon = 'ti ti-check', type = 'success') => {
  toast.value = { show: true, message, icon, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Login methods
const sendOTP = () => {
  if (!isValidPhone.value) return
  
  // Simulate sending OTP
  loginStep.value = 2
  startResendTimer()
  showToast('کد تأیید ارسال شد', 'ti ti-send')
}

const startResendTimer = () => {
  resendTimer.value = 120
  timerInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const resendOTP = () => {
  startResendTimer()
  showToast('کد تأیید مجدداً ارسال شد', 'ti ti-send')
}

const handleOTPInput = (index, event) => {
  const value = event.target.value
  if (value && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

const handleOTPKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

const verifyOTP = () => {
  if (!isOTPComplete.value) return
  
  // Simulate verification
  const otp = otpDigits.value.join('')
  if (otp === '123456') {
    showToast('ورود موفق', 'ti ti-check')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } else {
    showToast('کد وارد شده صحیح نیست', 'ti ti-x', 'error')
    otpDigits.value = ['', '', '', '', '', '']
    otpRefs.value[0]?.focus()
  }
}

// Register method
const register = () => {
  if (!isRegisterValid.value) return
  
  // Simulate registration
  showToast('ثبت‌نام با موفقیت انجام شد', 'ti ti-check')
  activeTab.value = 'login'
  phoneNumber.value = registerForm.value.phone
}

// Cleanup
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.ltr {
  direction: ltr;
}
</style>
