<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <DialogTitle as="h3" class="text-2xl font-bold text-gray-900">
                  حمایت مالی از حیوانات
                </DialogTitle>
                <button
                  @click="closeModal"
                  class="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus-ring"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>

              <!-- Form -->
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Donation Type -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">نوع حمایت</h4>
                  <div class="flex space-x-reverse space-x-4">
                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="form.type"
                        type="radio"
                        value="one-time"
                        class="form-checkbox"
                      />
                      <span class="mr-2 text-gray-700">یک‌باره</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="form.type"
                        type="radio"
                        value="monthly"
                        class="form-checkbox"
                      />
                      <span class="mr-2 text-gray-700">ماهانه</span>
                    </label>
                  </div>
                </div>

                <!-- Predefined Amounts -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">انتخاب مبلغ</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <button
                      v-for="amount in predefinedAmounts"
                      :key="amount"
                      type="button"
                      @click="selectAmount(amount)"
                      class="p-4 border-2 rounded-xl text-center transition-all duration-200 focus-ring"
                      :class="{
                        'border-rose-500 bg-rose-50 text-rose-700': form.amount === amount,
                        'border-gray-200 hover:border-gray-300': form.amount !== amount
                      }"
                    >
                      <div class="font-bold text-lg">{{ formatCurrency(amount) }}</div>
                      <div class="text-xs text-gray-600 mt-1">{{ getAmountDescription(amount) }}</div>
                    </button>
                  </div>

                  <!-- Custom Amount -->
                  <div>
                    <label class="form-label">مبلغ دلخواه (تومان)</label>
                    <input
                      v-model="form.customAmount"
                      @input="onCustomAmountChange"
                      type="number"
                      min="10000"
                      step="1000"
                      class="form-input"
                      placeholder="مبلغ مورد نظر خود را وارد کنید"
                    />
                    <p class="text-xs text-gray-500 mt-1">حداقل مبلغ: ۱۰,۰۰۰ تومان</p>
                  </div>
                </div>

                <!-- Donation Purpose -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">مقصد کمک</h4>
                  <div class="space-y-3">
                    <label
                      v-for="purpose in donationPurposes"
                      :key="purpose.value"
                      class="flex items-start space-x-reverse space-x-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      :class="{ 'border-rose-500 bg-rose-50': form.purpose === purpose.value }"
                    >
                      <input
                        v-model="form.purpose"
                        :value="purpose.value"
                        type="radio"
                        class="form-checkbox mt-1"
                      />
                      <div class="flex-1">
                        <div class="font-medium text-gray-900">{{ purpose.title }}</div>
                        <div class="text-sm text-gray-600 mt-1">{{ purpose.description }}</div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Personal Message (Optional) -->
                <div>
                  <label class="form-label">پیام شخصی (اختیاری)</label>
                  <textarea
                    v-model="form.message"
                    rows="3"
                    maxlength="200"
                    class="form-textarea"
                    placeholder="پیام یا آرزوی خود را برای حیوانات بنویسید..."
                  ></textarea>
                  <div class="flex justify-between items-center mt-1">
                    <span class="text-xs text-gray-500">{{ form.message.length }}/200</span>
                  </div>
                </div>

                <!-- Donor Information -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">اطلاعات کمک‌کننده</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="form-label">نام</label>
                      <input
                        v-model="form.donorName"
                        type="text"
                        class="form-input"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label class="form-label">شماره تماس</label>
                      <input
                        v-model="form.donorPhone"
                        type="tel"
                        class="form-input"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="flex items-start space-x-reverse space-x-3 cursor-pointer">
                      <input
                        v-model="form.isAnonymous"
                        type="checkbox"
                        class="form-checkbox mt-1"
                      />
                      <span class="text-sm text-gray-700">
                        کمک من ناشناس باشد (نام شما در فهرست کمک‌کنندگان نمایش داده نخواهد شد)
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Terms Agreement -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="flex items-start space-x-reverse space-x-3">
                    <input
                      v-model="form.agreeToTerms"
                      id="agree-donation-terms"
                      type="checkbox"
                      class="form-checkbox mt-1"
                      required
                    />
                    <label for="agree-donation-terms" class="text-sm text-gray-700 leading-relaxed">
                      با قوانین کمک مالی موافقم و تأیید می‌کنم که این مبلغ صرف حمایت از حیوانات خواهد شد.
                      <span class="text-secondary-500">*</span>
                    </label>
                  </div>
                  <p v-if="errors.agreeToTerms" class="form-error mt-2">{{ errors.agreeToTerms }}</p>
                </div>

                <!-- Summary -->
                <div class="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <h5 class="font-semibold text-primary-900 mb-2">خلاصه کمک شما:</h5>
                  <div class="space-y-1 text-sm text-primary-800">
                    <div class="flex justify-between">
                      <span>مبلغ:</span>
                      <span class="font-bold">{{ formatCurrency(finalAmount) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>نوع:</span>
                      <span>{{ form.type === 'monthly' ? 'ماهانه' : 'یک‌باره' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>مقصد:</span>
                      <span>{{ getPurposeTitle(form.purpose) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end space-x-reverse space-x-4 pt-4">
                  <button
                    type="button"
                    @click="closeModal"
                    class="btn-secondary"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    :disabled="loading || finalAmount < 10000"
                    class="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال پردازش...
                    </span>
                    <span v-else>
                      <HeartIcon class="w-5 h-5 ml-2" />
                      پرداخت {{ formatCurrency(finalAmount) }}
                    </span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, HeartIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Predefined amounts and purposes
const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

const donationPurposes = [
  {
    value: 'food',
    title: 'تهیه غذا',
    description: 'خرید غذای مناسب برای حیوانات بی‌سرپناه'
  },
  {
    value: 'medical',
    title: 'درمان و دارو',
    description: 'هزینه‌های درمانی، واکسیناسیون و دارو'
  },
  {
    value: 'shelter',
    title: 'سرپناه',
    description: 'ایجاد و نگهداری محل امن برای حیوانات'
  },
  {
    value: 'rescue',
    title: 'عملیات نجات',
    description: 'هزینه‌های نجات حیوانات در معرض خطر'
  },
  {
    value: 'general',
    title: 'کمک عمومی',
    description: 'استفاده در موارد مختلف بر اساس اولویت'
  }
]

// Form data
const form = ref({
  type: 'one-time',
  amount: 0,
  customAmount: '',
  purpose: 'general',
  message: '',
  donorName: '',
  donorPhone: '',
  isAnonymous: false,
  agreeToTerms: false
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Computed
const finalAmount = computed(() => {
  return form.value.customAmount ? parseInt(form.value.customAmount) || 0 : form.value.amount
})

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const getAmountDescription = (amount: number) => {
  const descriptions: Record<number, string> = {
    50000: 'غذای یک هفته',
    100000: 'واکسن یک حیوان',
    200000: 'درمان ساده',
    500000: 'عمل جراحی کوچک',
    1000000: 'مراقبت کامل',
    2000000: 'عمل جراحی بزرگ'
  }
  return descriptions[amount] || 'کمک ارزشمند'
}

const getPurposeTitle = (value: string) => {
  const purpose = donationPurposes.find(p => p.value === value)
  return purpose?.title || 'عمومی'
}

const selectAmount = (amount: number) => {
  form.value.amount = amount
  form.value.customAmount = ''
}

const onCustomAmountChange = () => {
  form.value.amount = 0
}

const closeModal = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.value = {
    type: 'one-time',
    amount: 0,
    customAmount: '',
    purpose: 'general',
    message: '',
    donorName: '',
    donorPhone: '',
    isAnonymous: false,
    agreeToTerms: false
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (finalAmount.value < 10000) {
    errors.value.amount = 'حداقل مبلغ کمک ۱۰,۰۰۰ تومان است'
  }

  if (!form.value.agreeToTerms) {
    errors.value.agreeToTerms = 'پذیرش قوانین الزامی است'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const donationData = {
      amount: finalAmount.value,
      type: form.value.type,
      purpose: form.value.purpose,
      message: form.value.message.trim(),
      donorName: form.value.isAnonymous ? null : form.value.donorName.trim(),
      donorPhone: form.value.donorPhone.trim(),
      isAnonymous: form.value.isAnonymous,
      timestamp: new Date().toISOString()
    }

    console.log('Donation data:', donationData)

    // Show success message
    alert(`کمک شما با موفقیت ثبت شد! مبلغ ${formatCurrency(finalAmount.value)} ${form.value.type === 'monthly' ? 'ماهانه' : 'یک‌باره'} به حساب حمایت از حیوانات واریز خواهد شد.`)

    closeModal()
  } catch (error) {
    console.error('Error processing donation:', error)
    alert('خطا در پردازش کمک. لطفاً دوباره تلاش کنید.')
  } finally {
    loading.value = false
  }
}
</script>
