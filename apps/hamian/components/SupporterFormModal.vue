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
                  عضویت در جمع حامیان
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
                <!-- Profile Photo Upload -->
                <div>
                  <label class="form-label">عکس پروفایل (اختیاری)</label>
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img v-if="profilePreview" :src="profilePreview" alt="preview" class="w-full h-full object-cover" />
                      <img v-else src="/assets/default-avatar.svg" alt="default" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <input type="file" accept="image/*" @change="onFileChange" class="text-sm" />
                      <p class="text-xs text-gray-500 mt-1">حداکثر اندازه تصویر: 2MB. فرمت‌های مجاز: JPG, PNG, WEBP</p>
                    </div>
                  </div>
                </div>
                <!-- Personal Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="form-label">
                      نام <span class="text-secondary-500">*</span>
                    </label>
                    <input
                      v-model="form.firstName"
                      type="text"
                      required
                      class="form-input"
                      placeholder="نام خود را وارد کنید"
                      :class="{ 'border-secondary-300': errors.firstName }"
                    />
                    <p v-if="errors.firstName" class="form-error">{{ errors.firstName }}</p>
                  </div>

                  <div>
                    <label class="form-label">
                      نام خانوادگی <span class="text-secondary-500">*</span>
                    </label>
                    <input
                      v-model="form.lastName"
                      type="text"
                      required
                      class="form-input"
                      placeholder="نام خانوادگی خود را وارد کنید"
                      :class="{ 'border-secondary-300': errors.lastName }"
                    />
                    <p v-if="errors.lastName" class="form-error">{{ errors.lastName }}</p>
                  </div>
                </div>

                <!-- Location: Province and City -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="form-label">
                      استان <span class="text-secondary-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="provinceSearch"
                        @input="onProvinceSearch"
                        @focus="provinceDropdownOpen = true"
                        type="text"
                        required
                        class="form-input"
                        placeholder="جستجوی استان..."
                        :class="{ 'border-secondary-300': errors.province }"
                        autocomplete="off"
                      />
                      <div
                        v-if="provinceDropdownOpen && filteredProvinces.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        <button
                          v-for="province in filteredProvinces"
                          :key="province.id"
                          type="button"
                          @click="selectProvince(province)"
                          class="w-full text-right px-4 py-2 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none transition-colors"
                        >
                          {{ province.name }}
                        </button>
                      </div>
                    </div>
                    <p v-if="errors.province" class="form-error">{{ errors.province }}</p>
                  </div>

                  <div>
                    <label class="form-label">
                      شهر <span class="text-secondary-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="citySearch"
                        @input="onCitySearch"
                        @focus="cityDropdownOpen = true"
                        type="text"
                        required
                        :disabled="!form.province"
                        class="form-input disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="ابتدا استان را انتخاب کنید"
                        :class="{ 'border-secondary-300': errors.city }"
                        autocomplete="off"
                      />
                      <div
                        v-if="cityDropdownOpen && filteredCities.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        <button
                          v-for="city in filteredCities"
                          :key="city.id"
                          type="button"
                          @click="selectCity(city)"
                          class="w-full text-right px-4 py-2 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none transition-colors"
                        >
                          {{ city.name }}
                        </button>
                      </div>
                    </div>
                    <p v-if="errors.city" class="form-error">{{ errors.city }}</p>
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label class="form-label">
                    بیوگرافی <span class="text-secondary-500">*</span>
                  </label>
                  <textarea
                    v-model="form.bio"
                    required
                    rows="4"
                    maxlength="500"
                    class="form-textarea"
                    placeholder="درباره خودتان و تجربه‌تان در کار با حیوانات بنویسید... (حداکثر ۵۰۰ کاراکتر)"
                    :class="{ 'border-secondary-300': errors.bio }"
                  ></textarea>
                  <div class="flex justify-between items-center mt-1">
                    <p v-if="errors.bio" class="form-error">{{ errors.bio }}</p>
                    <span class="text-xs text-gray-500">{{ form.bio.length }}/500</span>
                  </div>
                </div>

                <!-- Social Links -->
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">لینک‌های اجتماعی</h4>
                  <p class="text-sm text-gray-600 mb-4">
                    فقط پلتفرم‌های مجاز: Instagram, Telegram, WhatsApp, LinkedIn, X, YouTube
                  </p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="form-label">Instagram</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 text-sm">@</span>
                        </div>
                        <input
                          v-model="form.socialLinks.instagram"
                          type="text"
                          class="form-input pr-8"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="form-label">Telegram</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 text-sm">@</span>
                        </div>
                        <input
                          v-model="form.socialLinks.telegram"
                          type="text"
                          class="form-input pr-8"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="form-label">WhatsApp</label>
                      <input
                        v-model="form.socialLinks.whatsapp"
                        type="tel"
                        class="form-input"
                        placeholder="+989123456789"
                      />
                    </div>

                    <div>
                      <label class="form-label">LinkedIn</label>
                      <input
                        v-model="form.socialLinks.linkedin"
                        type="text"
                        class="form-input"
                        placeholder="profile-name"
                      />
                    </div>

                    <div>
                      <label class="form-label">X (Twitter)</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 text-sm">@</span>
                        </div>
                        <input
                          v-model="form.socialLinks.x"
                          type="text"
                          class="form-input pr-8"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="form-label">YouTube</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 text-sm">@</span>
                        </div>
                        <input
                          v-model="form.socialLinks.youtube"
                          type="text"
                          class="form-input pr-8"
                          placeholder="channel"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Terms Agreement -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="flex items-start space-x-reverse space-x-3">
                    <input
                      v-model="form.agreeToTerms"
                      id="agree-terms"
                      type="checkbox"
                      class="form-checkbox mt-1"
                      required
                    />
                    <label for="agree-terms" class="text-sm text-gray-700 leading-relaxed">
                      با قوانین عضویت در جمع حامیان موافقم و اجازه نمایش اطلاعاتم در سایت را می‌دهم.
                      <span class="text-secondary-500">*</span>
                    </label>
                  </div>
                  <p v-if="errors.agreeToTerms" class="form-error mt-2">{{ errors.agreeToTerms }}</p>
                </div>

                <!-- Status Info -->
                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div class="flex items-start space-x-reverse space-x-3">
                    <InformationCircleIcon class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div class="text-sm text-blue-800">
                      <p class="font-medium mb-1">نحوه بررسی درخواست:</p>
                      <ol class="space-y-1 text-xs">
                        <li>• درخواست شما ارسال می‌شود (Pending)</li>
                        <li>• توسط تیم مدیریت بررسی می‌شود (Reviewed)</li>
                        <li>• در صورت تأیید، در فهرست حامیان نمایش داده می‌شود (Approved)</li>
                      </ol>
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
                    :disabled="loading"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال ارسال...
                    </span>
                    <span v-else>
                      ارسال درخواست
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
import { XMarkIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { iranProvinces, getCitiesByProvince, type Province, type City } from '~/utils/iranCities'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  province: '',
  city: '',
  bio: '',
  socialLinks: {
    instagram: '',
    telegram: '',
    whatsapp: '',
    linkedin: '',
    x: '',
    youtube: ''
  },
  agreeToTerms: false
})

// Profile image file and preview
const profileImageFile = ref<File | null>(null)
const profilePreview = ref<string | null>(null)

// Province and City search
const provinceSearch = ref('')
const citySearch = ref('')
const provinceDropdownOpen = ref(false)
const cityDropdownOpen = ref(false)
const selectedProvinceObj = ref<Province | null>(null)
const availableCities = ref<City[]>([])

const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Computed: filtered provinces based on search
const filteredProvinces = computed(() => {
  if (!provinceSearch.value) return iranProvinces
  const query = provinceSearch.value.toLowerCase()
  return iranProvinces.filter(p => p.name.includes(provinceSearch.value) || p.slug.includes(query))
})

// Computed: filtered cities based on search and selected province
const filteredCities = computed(() => {
  if (!citySearch.value) return availableCities.value
  const query = citySearch.value.toLowerCase()
  return availableCities.value.filter(c => c.name.includes(citySearch.value) || c.slug.includes(query))
})

// Methods
const closeModal = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    province: '',
    city: '',
    bio: '',
    socialLinks: {
      instagram: '',
      telegram: '',
      whatsapp: '',
      linkedin: '',
      x: '',
      youtube: ''
    },
    agreeToTerms: false
  }
  errors.value = {}
  if (profilePreview.value) {
    try { URL.revokeObjectURL(profilePreview.value) } catch (e) {}
  }
  profilePreview.value = null
  profileImageFile.value = null
  provinceSearch.value = ''
  citySearch.value = ''
  selectedProvinceObj.value = null
  availableCities.value = []
  provinceDropdownOpen.value = false
  cityDropdownOpen.value = false
}

// Province search and selection
const onProvinceSearch = () => {
  provinceDropdownOpen.value = true
}

const selectProvince = (province: Province) => {
  form.value.province = province.name
  provinceSearch.value = province.name
  selectedProvinceObj.value = province
  availableCities.value = getCitiesByProvince(province.name)
  provinceDropdownOpen.value = false
  
  // Reset city when province changes
  form.value.city = ''
  citySearch.value = ''
}

// City search and selection
const onCitySearch = () => {
  if (form.value.province) {
    cityDropdownOpen.value = true
  }
}

const selectCity = (city: City) => {
  form.value.city = city.name
  citySearch.value = city.name
  cityDropdownOpen.value = false
}

// Close dropdowns when clicking outside
if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      provinceDropdownOpen.value = false
      cityDropdownOpen.value = false
    }
  })
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'نام الزامی است'
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'نام خانوادگی الزامی است'
  }

  if (!form.value.province.trim()) {
    errors.value.province = 'انتخاب استان الزامی است'
  }

  if (!form.value.city.trim()) {
    errors.value.city = 'انتخاب شهر الزامی است'
  }

  if (!form.value.bio.trim()) {
    errors.value.bio = 'بیوگرافی الزامی است'
  } else if (form.value.bio.length > 500) {
    errors.value.bio = 'بیوگرافی نباید بیش از ۵۰۰ کاراکتر باشد'
  }

  if (!form.value.agreeToTerms) {
    errors.value.agreeToTerms = 'پذیرش قوانین الزامی است'
  }

  // Validate WhatsApp number format
  if (form.value.socialLinks.whatsapp && !/^\+?[1-9]\d{1,14}$/.test(form.value.socialLinks.whatsapp)) {
    errors.value.whatsapp = 'فرمت شماره WhatsApp صحیح نیست'
  }

  return Object.keys(errors.value).length === 0
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0] || null

  if (!file) {
    if (profilePreview.value) {
      try { URL.revokeObjectURL(profilePreview.value) } catch (e) {}
    }
    profileImageFile.value = null
    profilePreview.value = null
    return
  }

  // Simple size validation (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('حجم تصویر نباید بیش از 2MB باشد')
    // clear input
    const target = e.target as HTMLInputElement
    if (target) target.value = ''
    return
  }

  profileImageFile.value = file
  if (profilePreview.value) {
    try { URL.revokeObjectURL(profilePreview.value) } catch (e) {}
  }
  profilePreview.value = URL.createObjectURL(file)
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create supporter object
    const supporterData: any = {
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      province: form.value.province.trim(),
      city: form.value.city.trim(),
      bio: form.value.bio.trim(),
      socialLinks: Object.fromEntries(
        Object.entries(form.value.socialLinks).filter(([_, value]) => value.trim())
      ),
      status: 'pending'
    }

    // If user selected a profile image, include metadata or FormData (backend upload expected)
    if (profileImageFile.value) {
      // Example: create FormData (the actual upload endpoint may differ)
      const fd = new FormData()
      fd.append('firstName', supporterData.firstName)
      fd.append('lastName', supporterData.lastName)
      fd.append('bio', supporterData.bio)
      fd.append('status', supporterData.status)
      fd.append('profileImage', profileImageFile.value)
      // In this demo we just log that FormData would be sent
      console.log('Prepared FormData with image (demo):', fd)
      supporterData._profileImageProvided = true
    }

    console.log('Supporter data submitted:', supporterData)

    // Show success message
    alert('درخواست شما با موفقیت ارسال شد. پس از بررسی، نتیجه به اطلاع شما خواهد رسید.')

    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.')
  } finally {
    loading.value = false
  }
}
</script>
