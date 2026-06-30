<template>
  <div class="min-h-screen bg-gray-50 pt-[73px]">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-[73px] z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <NuxtLink :to="`/supporters/${route.params.id}`" class="flex items-center space-x-reverse space-x-3 text-gray-900 hover:text-rose-600 transition-colors">
            <i class="ti ti-chevron-right text-lg"></i>
            <span class="font-medium">بازگشت به پروفایل</span>
          </NuxtLink>
          <h1 class="text-lg font-bold text-gray-900">ویرایش اطلاعات حامی</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Info -->
        <div class="bg-white rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">اطلاعات شخصی</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نام</label>
              <input
                v-model="form.firstName"
                type="text"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="rtl"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
              <input
                v-model="form.lastName"
                type="text"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="rtl"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="rtl"
                placeholder="مثال: دامپزشک داوطلب"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع حمایت</label>
              <select
                v-model="form.supportType"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="volunteer">داوطلب</option>
                <option value="financial">حامی مالی</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">اطلاعات تماس</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="ltr"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-left"
                dir="ltr"
              >
            </div>
          </div>
        </div>

        <!-- Bio & Experience -->
        <div class="bg-white rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">درباره من</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">بیوگرافی</label>
              <textarea
                v-model="form.bio"
                rows="4"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="rtl"
                placeholder="درباره خودتان بنویسید..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تجربه و تخصص</label>
              <textarea
                v-model="form.experience"
                rows="4"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="rtl"
                placeholder="تجربیات و تخصص‌های خود را شرح دهید..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">انگیزه و هدف</label>
              <textarea
                v-model="form.motivation"
                rows="4"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                dir="rtl"
                placeholder="انگیزه و هدف خود را از حمایت از حیوانات بیان کنید..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="bg-white rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">شبکه‌های اجتماعی</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اینستاگرام</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">@</span>
                <input
                  v-model="form.socialLinks.instagram"
                  type="text"
                  class="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  dir="ltr"
                  placeholder="نام کاربری"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تلگرام</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">@</span>
                <input
                  v-model="form.socialLinks.telegram"
                  type="text"
                  class="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  dir="ltr"
                  placeholder="نام کاربری"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-8 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
            :disabled="loading"
          >
            <i v-if="loading" class="ti ti-loader animate-spin ml-2"></i>
            {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateSlug, extractIdFromSlug } from '../../../utils/slugUtils'
import useSupporters from '../../../composables/useSupporters'

const route = useRoute()
const router = useRouter()
const { getSupporterById, updateSupporter } = useSupporters()

interface SocialLinks {
  instagram?: string
  telegram?: string
  linkedin?: string
  twitter?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  supportType: 'financial' | 'volunteer'
  experience: string
  motivation: string
  bio: string
  socialLinks: SocialLinks
}

const loading = ref(false)
const form = ref<FormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  title: '',
  supportType: 'volunteer',
  experience: '',
  motivation: '',
  bio: '',
  socialLinks: {
    instagram: '',
    telegram: ''
  }
})

// Load current supporter data
onMounted(async () => {
  try {
    // Extract ID from URL
    const supporterId = extractIdFromSlug(route.params.id as string)
    
    // Get supporter data
    const supporter = getSupporterById(supporterId)
    if (supporter) {
      form.value = {
        firstName: supporter.firstName,
        lastName: supporter.lastName,
        email: supporter.email,
        phone: supporter.phone,
        title: supporter.title,
        supportType: supporter.supportType,
        experience: supporter.experience,
        motivation: supporter.motivation,
        bio: supporter.bio,
        socialLinks: {
          instagram: supporter.socialLinks?.instagram || '',
          telegram: supporter.socialLinks?.telegram || ''
        }
      }
    }
  } catch (error) {
    console.error('Error fetching supporter data:', error)
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const supporterId = extractIdFromSlug(route.params.id as string)

    // Update supporter data
    if (supporterId) {
      updateSupporter(supporterId, form.value)
      await new Promise(resolve => setTimeout(resolve, 500)) // شبیه‌سازی تأخیر شبکه
      
      // نمایش پیام موفقیت
      alert('اطلاعات با موفقیت ذخیره شد')
      
      // برگشت به صفحه پروفایل
      router.push(`/supporters/${route.params.id}`)
    }
  } catch (error) {
    console.error('Error updating supporter data:', error)
    alert('خطا در ذخیره اطلاعات')
  } finally {
    loading.value = false
  }
}
</script>
