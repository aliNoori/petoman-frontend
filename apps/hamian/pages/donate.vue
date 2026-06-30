<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Simplified -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white py-16 sm:py-20 overflow-hidden min-h-[500px] flex items-center">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
        <i class="ti ti-coin absolute top-16 left-20 text-rose-400 text-7xl rotate-12"></i>
        <i class="ti ti-heart-filled absolute top-10 right-24 text-rose-400 text-6xl -rotate-6"></i>
        <i class="ti ti-paw-filled absolute bottom-20 left-1/4 text-rose-300 text-6xl rotate-45"></i>
        <i class="ti ti-heart-handshake absolute bottom-16 right-20 text-rose-400 text-7xl -rotate-12"></i>
        <i class="ti ti-dog absolute top-1/2 right-12 text-rose-300 text-6xl rotate-6"></i>
        <i class="ti ti-cat absolute bottom-1/2 left-16 text-rose-400 text-6xl -rotate-6"></i>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6">
            <i class="ti ti-heart text-rose-600 text-3xl"></i>
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            با کمک شما، حیوانات امید به زندگی پیدا می‌کنند
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            هر کمک شما، چه کوچک یا بزرگ، در نجات و درمان حیوانات بی‌سرپناه تأثیر مستقیم خواهد داشت
          </p>
        </div>
      </div>
    </section>

    <!-- Donation Options -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Quick Amounts -->
        <div class="mb-8 sm:mb-12">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-xl mb-4">
              <i class="ti ti-coins text-rose-700 text-2xl"></i>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">مبلغ کمک خود را انتخاب کنید</h3>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              v-for="amount in quickAmounts"
              :key="amount.value"
              @click="selectedAmount = amount.value; customAmount = ''; showCustomAmount = false"
              type="button"
              class="p-4 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-md"
              :class="selectedAmount === amount.value ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 bg-white hover:border-rose-300'"
            >
              <div class="font-bold text-lg mb-1">{{ formatCurrency(amount.value) }}</div>
              <div class="text-xs text-gray-600">{{ amount.description }}</div>
            </button>
          </div>
          
          <!-- Custom Amount -->
          <div class="mt-6">
            <button
              @click="showCustomAmount = !showCustomAmount"
              type="button"
              class="w-full p-4 border-2 border-gray-200 rounded-xl text-center hover:border-rose-400 hover:bg-rose-50 transition-all duration-200 bg-white"
              :class="{ 'border-rose-500 bg-rose-50': showCustomAmount }"
            >
              <div class="flex items-center justify-center mb-2">
                <i class="ti ti-edit text-rose-500 text-xl ml-2"></i>
                <span class="font-semibold text-gray-900">مبلغ دلخواه</span>
              </div>
              <span class="text-sm text-gray-600">مبلغ مورد نظر خود را وارد کنید</span>
            </button>
            
            <!-- Custom Amount Input -->
            <div v-if="showCustomAmount" class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">مبلغ (تومان)</label>
              <div class="relative">
                <input
                  v-model="customAmount"
                  type="number"
                  min="10000"
                  step="10000"
                  class="w-full px-4 py-3 pl-20 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-left bg-white"
                  placeholder="مثال: ۱۰۰۰۰۰"
                  @input="selectedAmount = parseInt(customAmount) || 0"
                />
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="text-gray-500 text-sm font-medium">تومان</span>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">حداقل ۱۰,۰۰۰ تومان</p>
            </div>
          </div>
        </div>

        <!-- Donation Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form @submit.prevent="submitDonation" class="space-y-6">
            <!-- Purpose -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">هدف کمک</label>
              <div class="relative">
                <button
                  @click="showPurposeDropdown = !showPurposeDropdown"
                  type="button"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors bg-transparent flex items-center justify-between"
                >
                  <span :class="{ 'text-gray-400': !form.purpose }">
                    {{ getPurposeTitle(form.purpose) || 'انتخاب کنید' }}
                  </span>
                  <i class="ti ti-chevron-down text-gray-400 transform transition-transform" :class="{ 'rotate-180': showPurposeDropdown }"></i>
                </button>
                
                <div v-if="showPurposeDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                  <ul class="py-2">
                    <li>
                      <button
                        @click="selectPurpose('general')"
                        type="button"
                        class="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-rose-50 text-rose-700': form.purpose === 'general' }"
                      >
                        کمک عمومی
                      </button>
                    </li>
                    <li>
                      <button
                        @click="selectPurpose('medical')"
                        type="button"
                        class="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-rose-50 text-rose-700': form.purpose === 'medical' }"
                      >
                        درمان حیوانات
                      </button>
                    </li>
                    <li>
                      <button
                        @click="selectPurpose('food')"
                        type="button"
                        class="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-rose-50 text-rose-700': form.purpose === 'food' }"
                      >
                        تأمین غذا
                      </button>
                    </li>
                    <li>
                      <button
                        @click="selectPurpose('shelter')"
                        type="button"
                        class="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-rose-50 text-rose-700': form.purpose === 'shelter' }"
                      >
                        توسعه پناهگاه
                      </button>
                    </li>
                    <li>
                      <button
                        @click="selectPurpose('emergency')"
                        type="button"
                        class="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors"
                        :class="{ 'bg-rose-50 text-rose-700': form.purpose === 'emergency' }"
                      >
                        کمک‌های اضطراری
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Donor Information -->
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-6">اطلاعات کمک‌کننده</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="donorName" class="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                  <input
                    v-model="form.donorName"
                    type="text"
                    id="donorName"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors bg-transparent"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>
                
                <div>
                  <label for="donorPhone" class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                  <input
                    v-model="form.donorPhone"
                    type="tel"
                    id="donorPhone"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors bg-transparent"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <!-- Anonymous Option -->
              <div class="mt-6">
                <label class="flex items-center space-x-reverse space-x-3">
                  <input
                    v-model="form.isAnonymous"
                    type="checkbox"
                    class="w-5 h-5 text-secondary-600 border-gray-300 rounded focus:ring-secondary-500"
                  />
                  <span class="text-gray-700">می‌خواهم نام من در فهرست حامیان نمایش داده نشود (کمک ناشناس)</span>
                </label>
              </div>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">پیام (اختیاری)</label>
              <textarea
                v-model="form.message"
                id="message"
                rows="4"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors resize-none bg-transparent"
                placeholder="پیام تشویقی یا توضیحی برای تیم پتومن..."
              ></textarea>
            </div>

            <!-- Payment Summary -->
            <div class="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
              <h4 class="text-lg font-bold text-gray-900 mb-4">خلاصه کمک شما</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">مبلغ:</span>
                  <span class="font-bold text-xl text-primary-600">{{ formatCurrency(finalAmount) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">هدف:</span>
                  <span class="font-medium">{{ getPurposeTitle(form.purpose) || 'انتخاب نشده' }}</span>
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div class="bg-gray-50 rounded-xl p-4">
              <label class="flex items-start space-x-reverse space-x-3">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  required
                  class="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 mt-1"
                />
                <span class="text-sm text-gray-700 leading-relaxed">
                  <NuxtLink to="/terms" target="_blank" class="text-rose-600 hover:text-rose-700 font-medium underline">شرایط و قوانین</NuxtLink>
                  کمک‌های مالی را مطالعه کرده و با آن‌ها موافقم. 
                  تمام کمک‌ها صرف بهبود وضعیت حیوانات خواهد شد.
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submitting || finalAmount < 10000 || !form.purpose || !form.acceptTerms"
              class="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-rose-700 hover:to-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span v-if="submitting" class="flex items-center justify-center">
                <i class="ti ti-loader animate-spin text-xl ml-3"></i>
                در حال پردازش...
              </span>
              <span v-else class="flex items-center justify-center">
                <i class="ti ti-heart text-xl ml-3"></i>
                کمک {{ formatCurrency(finalAmount) }}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="ti ti-heart text-3xl text-green-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">متشکریم از کمک شما!</h3>
          <p class="text-gray-600 mb-6">
            کمک شما با موفقیت دریافت شد و به کمک حیوانات نیازمند خواهد رسید.
          </p>
          <button
            @click="closeSuccess"
            class="w-full bg-secondary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-secondary-700 transition-colors"
          >
            بازگشت به خانه
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type {AxiosInstance} from "axios";
import {useNuxtApp} from "nuxt/app";

// SEO
useSeoMeta({
  title: 'حمایت مالی - پتومن | کمک به حیوانات بی‌سرپناه',
  description: 'با کمک مالی خود در تأمین غذا، درمان و سرپناه حیوانات بی‌سرپناه مشارکت کنید. هر کمک شما می‌تواند تفاوت بزرگی ایجاد کند.',
  ogTitle: 'حمایت مالی - پتومن',
  ogDescription: 'با کمک مالی خود در تأمین غذا، درمان و سرپناه حیوانات بی‌سرپناه مشارکت کنید.'
})

const submitting = ref(false)
const showSuccess = ref(false)
const selectedAmount = ref(100000)
const customAmount = ref('')
const showPurposeDropdown = ref(false)
const showCustomAmount = ref(false)

const quickAmounts = ref([
  { value: 50000, description: 'غذای هفتگی' },
  { value: 100000, description: 'غذای دو هفته‌ای' },
  { value: 200000, description: 'درمان پایه' },
  { value: 500000, description: 'درمان کامل' }
])

const form = reactive({
  purpose: '',
  donorName: '',
  donorPhone: '',
  isAnonymous: false,
  message: '',
  acceptTerms: false
})

const finalAmount = computed(() => {
  return customAmount.value ? parseInt(customAmount.value) || 0 : selectedAmount.value
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const getPurposeTitle = (purpose: string): string => {
  const purposes: { [key: string]: string } = {
    'general': 'کمک عمومی',
    'medical': 'درمان حیوانات',
    'food': 'تأمین غذا',
    'shelter': 'توسعه پناهگاه',
    'emergency': 'کمک‌های اضطراری'
  }
  return purposes[purpose] || ''
}

const selectPurpose = (purpose: string) => {
  form.purpose = purpose
  showPurposeDropdown.value = false
}

const submitDonation = async () => {
  submitting.value = true

  try {
    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // سرور باید لینک redirectUrl رو برگردونه
    const { data } = await axios.post('/payments/pay', {
      supporterInfo: JSON.parse(JSON.stringify(form)),
      amount: finalAmount.value,   // ✅ مقدار واقعی
      meta: { mobile: form.donorPhone,email:'info@example.com' }
    }, {
      headers: { 'Content-Type': 'application/json' } // بهتره صریح ست بشه
    })

    // حالا کاربر رو به لینک زرین‌پال هدایت کن
    window.location.href = data   // اگر سرور فقط لینک رو برگردونه
    // یا اگر سرور آبجکت برگردونه:
    // window.location.href = data.redirectUrl

    // اگر بخوای قبل از هدایت مودال نشون بدی:
    // showSuccess.value = true

    // Reset form
    Object.assign(form, {
      purpose: '',
      donorName: '',
      donorPhone: '',
      isAnonymous: false,
      message: '',
      acceptTerms: false
    })
    selectedAmount.value = 100000
    customAmount.value = ''
  } catch (error) {
    console.error('خطا در پردازش پرداخت:', error)
    alert('خطا در پردازش پرداخت. لطفاً دوباره تلاش کنید.')
  } finally {
    submitting.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  navigateTo('/')
}
</script>
