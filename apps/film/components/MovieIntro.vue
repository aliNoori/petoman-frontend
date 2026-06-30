<template>
  <div class="bg-zinc-900 rounded-xl p-8 shadow-2xl max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-yellow-400 mb-4">معرفی فیلم جدید</h1>
      <p class="text-yellow-200 text-lg">اطلاعات کامل فیلم خود را وارد کنید</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">عنوان فیلم *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="عنوان فیلم را وارد کنید"
          />
        </div>
        
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">نام انگلیسی</label>
          <input
            v-model="formData.englishTitle"
            type="text"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="English Title"
          />
        </div>
      </div>

      <!-- Duration and Release Year -->
      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">مدت زمان *</label>
          <input
            v-model="formData.duration"
            type="text"
            required
            pattern="[0-9]{1,3}:[0-9]{2}"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="45:30"
          />
        </div>
        
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">سال تولید *</label>
          <input
            v-model="formData.releaseYear"
            type="number"
            required
            min="1300"
            max="1450"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="1403"
          />
        </div>
        
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">رده سنی</label>
          <select
            v-model="formData.ageRating"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">انتخاب کنید</option>
            <option value="G">عمومی</option>
            <option value="PG">راهنمایی والدین</option>
            <option value="PG-13">13+ سال</option>
            <option value="R">محدود</option>
          </select>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-yellow-300 font-semibold mb-2">خلاصه داستان *</label>
        <textarea
          v-model="formData.description"
          required
          rows="4"
          class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="خلاصه‌ای از داستان فیلم بنویسید..."
        ></textarea>
      </div>

      <!-- Genres -->
      <div>
        <label class="block text-yellow-300 font-semibold mb-2">دسته‌بندی‌ها *</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label
            v-for="genre in availableGenres"
            :key="genre"
            class="flex items-center space-x-2 space-x-reverse cursor-pointer"
          >
            <input
              v-model="formData.genres"
              :value="genre"
              type="checkbox"
              class="accent-yellow-400"
            />
            <span class="text-yellow-200">{{ genre }}</span>
          </label>
        </div>
      </div>

      <!-- Cast and Crew -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">کارگردان *</label>
          <input
            v-model="formData.director"
            type="text"
            required
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="نام کارگردان"
          />
        </div>
        
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">تهیه‌کننده</label>
          <input
            v-model="formData.producer"
            type="text"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="نام تهیه‌کننده"
          />
        </div>
      </div>

      <!-- Media Files -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">فایل ویدیو *</label>
          <input
            @change="handleVideoFile"
            type="file"
            accept="video/*"
            required
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <p class="text-xs text-yellow-200 mt-1">حداکثر حجم: 500 مگابایت</p>
        </div>
        
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">پوستر فیلم *</label>
          <input
            @change="handlePosterFile"
            type="file"
            accept="image/*"
            required
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <p class="text-xs text-yellow-200 mt-1">ابعاد توصیه شده: 1920x1080</p>
        </div>
      </div>

      <!-- Preview Images -->
      <div v-if="posterPreview" class="text-center">
        <h3 class="text-yellow-300 font-semibold mb-4">پیش‌نمایش پوستر</h3>
        <img
          :src="posterPreview"
          alt="پیش‌نمایش پوستر"
          class="max-w-xs mx-auto rounded-lg border-2 border-yellow-400"
        />
      </div>

      <!-- Additional Information -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">کشور سازنده</label>
          <input
            v-model="formData.country"
            type="text"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="ایران"
          />
        </div>
        
        <div>
          <label class="block text-yellow-300 font-semibold mb-2">زبان</label>
          <select
            v-model="formData.language"
            class="w-full px-4 py-3 bg-black text-yellow-400 border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">انتخاب کنید</option>
            <option value="fa">فارسی</option>
            <option value="en">انگلیسی</option>
            <option value="ar">عربی</option>
            <option value="other">سایر</option>
          </select>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center pt-6">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-8 py-4 bg-yellow-400 text-black font-bold text-lg rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">در حال ارسال...</span>
          <span v-else>ثبت فیلم</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const isSubmitting = ref(false)
const posterPreview = ref('')

const formData = reactive({
  title: '',
  englishTitle: '',
  duration: '',
  releaseYear: new Date().getFullYear(),
  ageRating: '',
  description: '',
  genres: [] as string[],
  director: '',
  producer: '',
  country: 'ایران',
  language: 'fa',
  videoFile: null as File | null,
  posterFile: null as File | null
})

const availableGenres = [
  'مستند',
  'طبیعت',
  'نجات حیوانات',
  'آموزشی',
  'انیمیشن',
  'درام',
  'کمدی',
  'ماجراجویی'
]

const handleVideoFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.videoFile = target.files[0]
  }
}

const handlePosterFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.posterFile = target.files[0]
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      posterPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(target.files[0])
  }
}

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Validate required fields
    if (!formData.title || !formData.duration || !formData.description || 
        !formData.director || !formData.videoFile || !formData.posterFile) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید')
      return
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('فیلم با موفقیت ثبت شد!')
    
    // Reset form
    Object.assign(formData, {
      title: '',
      englishTitle: '',
      duration: '',
      releaseYear: new Date().getFullYear(),
      ageRating: '',
      description: '',
      genres: [],
      director: '',
      producer: '',
      country: 'ایران',
      language: 'fa',
      videoFile: null,
      posterFile: null
    })
    posterPreview.value = ''
    
  } catch (error) {
    console.error('خطا در ثبت فیلم:', error)
    alert('خطا در ثبت فیلم. لطفاً دوباره تلاش کنید.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
