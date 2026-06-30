<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="w-full max-w-md text-right">
      <!-- Logo -->
      <div class="flex justify-start mb-8">
        <img src="../assets/logo-petoman.svg" alt="Patoman" class="h-12"/>
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
                  <img src="../assets/iran-flag.svg" class="w-5 h-4" alt="ایران"/>
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

            <!-- Submit Button -->
            <button
                type="submit"
                :disabled="localLoading || !isPhoneValid"
                class="w-full bg-orange-600 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!localLoading"
                   class="w-4 mr-auto text-white absolute left-4 pt-1 text-2xl border-l px-4 border-white/30"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span v-if="localLoading"
                    class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></span>
              <span>ادامه</span>
            </button>
          </form>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-else-if="currentStep === 'login'" key="login" class="w-full">
          <form @submit.prevent="handleLoginSubmit">
            <!-- OTP Input -->
            <div class="w-full mb-4 relative">
              <input
                  v-model="verificationCode"
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
                  :class="verificationCode ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                کد تایید
              </label>
            </div>

            <!-- Resend Code -->
            <div class="flex items-center justify-between text-sm text-gray-600 mb-6">
              <button
                  type="button"
                  @click="resendCode"
                  :disabled="timer.isActive.value"
                  class="text-orange-600 hover:text-orange-700 disabled:text-gray-400"
              >
                ارسال مجدد کد
              </button>
              <span v-if="timer.isActive.value" class="font-mono">{{ timer.formattedTime.value }}</span>
            </div>

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                  type="submit"
                  :disabled="isLoading || !verificationCode"
                  class="w-full bg-orange-600 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading"
                     class="w-4 mr-auto text-white absolute left-4 pt-1 text-2xl border-l px-4 border-white/30"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span v-if="isLoading"
                      class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></span>
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

        <!-- Step 3: Registration Form (New User) -->
        <div v-else-if="currentStep === 'register'" key="register" class="w-full">
          <form @submit.prevent="handleRegisterSubmit">
            <!-- First Name -->
            <div class="w-full mb-4 relative">
              <input
                  v-model="firstName"
                  id="firstNameInput"
                  type="text"
                  placeholder=" "
                  class="peer block w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700"
              />
              <label
                  for="firstNameInput"
                  class="absolute right-4 text-sm text-gray-500 bg-white px-1 z-10 transition-all duration-200 cursor-pointer"
                  :class="firstName ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                نام
              </label>
            </div>

            <!-- Last Name -->
            <div class="w-full mb-4 relative">
              <input
                  v-model="lastName"
                  id="lastNameInput"
                  type="text"
                  placeholder=" "
                  class="peer block w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700"
              />
              <label
                  for="lastNameInput"
                  class="absolute right-4 text-sm text-gray-500 bg-white px-1 z-10 transition-all duration-200 cursor-pointer"
                  :class="lastName ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                نام خانوادگی
              </label>
            </div>

            <!-- Phone Number (Display Only) -->
            <div class="w-full mb-4 relative">
              <div class="absolute text-gray-500 left-2 top-0 h-full flex items-center px-2 border-r border-gray-300">
                <span>+۹۸</span>
              </div>
              <input
                  :value="phoneNumber"
                  type="tel"
                  disabled
                  class="block w-full px-4 py-4 pr-4 pl-16 text-sm border border-gray-300 rounded-lg text-right bg-gray-50 text-gray-500"
              />
              <label class="absolute right-4 top-1 text-xs text-gray-500 bg-white px-1 z-10 -translate-y-1/2">
                شماره موبایل
              </label>
            </div>

            <!-- OTP Input -->
            <div class="w-full mb-4 relative">
              <input
                  v-model="verificationCode"
                  id="registerOtpInput"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="6"
                  placeholder=" "
                  class="peer block w-full px-4 py-4 text-sm border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-0 focus:border-orange-500 text-gray-700 text-2xl tracking-widest"
                  dir="ltr"
              />
              <label
                  for="registerOtpInput"
                  class="absolute right-4 text-sm text-gray-500 bg-white px-1 z-10 transition-all duration-200 cursor-pointer"
                  :class="verificationCode ? 'top-1 text-xs -translate-y-1/2' : 'top-1/2 -translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-600'"
              >
                کد تایید
              </label>
            </div>

            <!-- Resend Code -->
            <div class="flex items-center justify-between text-sm text-gray-600 mb-6">
              <button
                  type="button"
                  @click="resendCode"
                  :disabled="timer.isActive.value"
                  class="text-orange-600 hover:text-orange-700 disabled:text-gray-400"
              >
                ارسال مجدد کد
              </button>
              <span v-if="timer.isActive.value" class="font-mono">{{ timer.formattedTime.value }}</span>
            </div>

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                  type="submit"
                  :disabled="isLoading || !isRegisterFormValid"
                  class="w-full bg-orange-600 text-white text-center py-4 rounded-lg text-lg font-medium relative flex items-center justify-center transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!isLoading"
                     class="w-4 mr-auto text-white absolute left-4 pt-1 text-2xl border-l px-4 border-white/30"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span v-if="isLoading"
                      class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></span>
                <span>ثبت‌نام</span>
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
      <div v-if="toastMessage"
           class="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useAuth} from '@petoman/auth';
import {normalizePhoneNumber} from '@petoman/utils';

// Create a simple Vue timer
const createVueTimer = (duration: number) => {
  const timeLeft = ref(0);
  const isActive = ref(false);
  let intervalId: number | null = null;

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const start = () => {
    if (isActive.value) return;

    timeLeft.value = duration;
    isActive.value = true;

    intervalId = window.setInterval(() => {
      timeLeft.value--;

      if (timeLeft.value <= 0) {
        stop();
      }
    }, 1000);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isActive.value = false;
    timeLeft.value = 0;
  };

  return {
    timeLeft: computed(() => timeLeft.value),
    formattedTime,
    isActive: computed(() => isActive.value),
    start,
    stop,
  };
};

// Reactive state
const currentStep = ref<'phone' | 'register' | 'login'>('phone');
const phoneNumber = ref('');
const firstName = ref('');
const lastName = ref('');
const verificationCode = ref('');

// Filter phone number input - only allow digits
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Remove all non-digit characters
  phoneNumber.value = input.value.replace(/\D/g, '');
};

// Error states
const phoneError = ref('');
const firstNameError = ref('');
const lastNameError = ref('');
const codeError = ref('');
const localLoading = ref(false);
const toastMessage = ref('');

// Show toast notification
const showToast = (message: string) => {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};

// Auth composable
const {
  checkPhoneNumber,
  sendOTP,
  verifyOTP,
  register,
  isLoading,
  clearError
} = useAuth(import.meta.env.VITE_API_BASE);

// Timer for resend code
const timer = createVueTimer(120); // 2 minutes

// Computed properties
const isPhoneValid = computed(() => {
  // Simple validation: just check if has at least 10 digits for testing
  return phoneNumber.value.length >= 10;
});

const isRegisterFormValid = computed(() => {
  // Simple validation for testing
  return firstName.value.trim().length > 0 &&
      lastName.value.trim().length > 0 &&
      verificationCode.value.length >= 4; // Accept 4 or 5 digits for testing
});

// Methods
const validateForm = () => {
  // Skip validation for now - just return true for testing
  return true;
};

const clearErrors = () => {
  phoneError.value = '';
  firstNameError.value = '';
  lastNameError.value = '';
  codeError.value = '';
  clearError();
};

const handlePhoneSubmit = async () => {
  if (!validateForm()) return;

  try {
    localLoading.value = true;
    clearErrors();

    // Normalize phone number (add leading zero if missing)
    const normalizedPhone = normalizePhoneNumber(phoneNumber.value);

    const result = await checkPhoneNumber(normalizedPhone);
    const res = await sendOTP(normalizedPhone);

    // if(res.success){
      if (result.exists) {
        currentStep.value = 'login';
      } else {
        currentStep.value = 'register';
      }
      timer.start();
    // }

    showToast(res.message)

  } catch (err: any) {
    console.error('Phone submission error:', err);
    showToast(err.message || 'خطا در ارسال کد');
  } finally {
    localLoading.value = false;
  }
};

const handleRegisterSubmit = async () => {
  if (!validateForm()) return;

  try {
    // Normalize phone number (add leading zero if missing)
    const normalizedPhone = normalizePhoneNumber(phoneNumber.value);

    await verifyOTP({
      phoneNumber: normalizedPhone,
      code: verificationCode.value,
    });

    await register({
      phoneNumber: normalizedPhone,
      firstName: firstName.value,
      lastName: lastName.value,
      code: verificationCode.value,
    });

    // Redirect after successful registration
    redirectToApp();
  } catch (err: any) {
    console.error('Registration error:', err);
    showToast(err.message || 'خطا در ثبت نام');
  }
};

const handleLoginSubmit = async () => {
  if (!validateForm()) return;

  try {
    // Normalize phone number (add leading zero if missing)
    const normalizedPhone = normalizePhoneNumber(phoneNumber.value);

    await verifyOTP({
      phoneNumber: normalizedPhone,
      code: verificationCode.value,
    });

    // Redirect after successful login
    redirectToApp();
  } catch (err: any) {
    console.error('Login error:', err);
    showToast(err.message || 'خطا در ورود');
  }
};

const resendCode = async () => {
  try {
    clearErrors();
    // Normalize phone number (add leading zero if missing)
    const normalizedPhone = normalizePhoneNumber(phoneNumber.value);
    await sendOTP(normalizedPhone);
    timer.start();
    showToast('کد تایید مجدد ارسال شد');
  } catch (err: any) {
    console.error('Resend code error:', err);
    showToast(err.message || 'خطا در ارسال مجدد کد');
  }
};

const goBack = () => {
  currentStep.value = 'phone';
  verificationCode.value = '';
  timer.stop();
  clearErrors();
};

const redirectToApp = () => {
  // Get redirect URL from query params or default
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect') || 'http://localhost:3002';

  // Add token to redirect URL
  const authToken = localStorage.getItem('petoman_auth_token');
  const separator = redirectUrl.includes('?') ? '&' : '?';

  window.location.href = `${redirectUrl}${separator}token=${authToken}`;
};

// Lifecycle
onMounted(() => {
  // Clear any existing errors
  clearErrors();
});
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
