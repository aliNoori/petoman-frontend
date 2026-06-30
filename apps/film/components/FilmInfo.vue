<template>
  <div class="w-full space-y-8">
    
    <!-- Film Main Info - پوستر سمت راست، توضیحات سمت چپ -->
    <div class="bg-gradient-to-r from-zinc-900/95 to-black/95 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 shadow-2xl">
      <div class="flex flex-col lg:flex-row-reverse items-start gap-8">
        <!-- Poster - سمت راست -->
        <div class="w-64 h-96 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden shadow-xl flex-shrink-0">
          <img :src="filmInfo.poster" :alt="filmInfo.title" class="w-full h-full object-cover">
        </div>
        
        <!-- Film Details - سمت چپ -->
        <div class="flex-1 space-y-6">
          <div>
            <h1 class="text-4xl font-bold text-yellow-500 mb-3">{{ filmInfo.title }}</h1>
            <p class="text-gray-400 text-xl">فیلم حیوانات پت‌فیلم</p>
          </div>
          
          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-4 text-gray-300">
            <div class="flex items-center space-x-2 space-x-reverse bg-yellow-500/20 px-4 py-2 rounded-full">
              <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="font-bold text-yellow-500 text-lg">{{ filmInfo.rating }}/10</span>
            </div>
            <span class="bg-zinc-800 px-4 py-2 rounded-full text-lg">{{ filmInfo.releaseYear }}</span>
            <span class="bg-zinc-800 px-4 py-2 rounded-full text-lg">{{ filmInfo.duration }}</span>
            <span class="bg-zinc-700 text-zinc-300 px-4 py-2 rounded-full font-medium text-lg">HD</span>
          </div>
          
          <!-- Description -->
          <p class="text-gray-300 leading-relaxed text-xl">{{ filmInfo.description }}</p>
          
          <!-- Genres with circles -->
          <div class="flex flex-wrap gap-3">
            <div v-for="genre in filmInfo.genres" :key="genre" 
              class="flex items-center space-x-2 space-x-reverse text-zinc-300">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-lg">{{ genre }}</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-4 pt-4">
            <button class="flex items-center space-x-2 space-x-reverse bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span class="text-lg">علاقه‌مندی</span>
            </button>
            
            <button 
              @click="toggleShareModal"
              class="flex items-center space-x-2 space-x-reverse bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              <span class="text-lg">اشتراک‌گذاری</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Section - زیر فیلم -->
    <div class="bg-gradient-to-r from-zinc-900/95 to-black/95 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
      <h3 class="text-2xl font-bold text-yellow-500 mb-4 flex items-center">
        <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        دانلود فیلم
      </h3>
      
      <div class="flex flex-wrap items-center gap-4">
        <BaseDropdown
          v-model="selectedDownload"
          :options="downloadOptions"
          placeholder="انتخاب کیفیت"
          button-class="flex items-center space-x-2 space-x-reverse bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          dropdown-class="top-full left-0 mt-2 w-48"
          @select="downloadVideo"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </template>
          <span class="mr-2">دانلود</span>
        </BaseDropdown>
        
        <BaseDropdown
          v-model="selectedQuality"
          :options="qualityOptions"
          placeholder="کیفیت فیلم"
          button-class="flex items-center space-x-2 space-x-reverse bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          dropdown-class="top-full left-0 mt-2 w-48"
          @select="changeQuality"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </template>
          <span class="mr-2">کیفیت</span>
        </BaseDropdown>
      </div>
    </div>

    <!-- Film Stats -->
    <div class="bg-gradient-to-r from-zinc-900/95 to-black/95 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
      <h3 class="text-2xl font-bold text-yellow-500 mb-4 flex items-center">
        <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        آمار فیلم
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div class="text-yellow-500 text-2xl font-bold">{{ filmInfo.rating }}</div>
          <div class="text-gray-400 text-sm">امتیاز IMDb</div>
        </div>
        <div class="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div class="text-white text-2xl font-bold">{{ filmInfo.views?.toLocaleString() || '12,450' }}</div>
          <div class="text-gray-400 text-sm">تعداد بازدید</div>
        </div>
        <div class="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div class="text-white text-2xl font-bold">{{ filmInfo.releaseYear }}</div>
          <div class="text-gray-400 text-sm">سال انتشار</div>
        </div>
        <div class="bg-zinc-800/50 rounded-xl p-4 text-center">
          <div class="text-white text-2xl font-bold">{{ filmInfo.duration }}</div>
          <div class="text-gray-400 text-sm">مدت زمان</div>
        </div>
      </div>
    </div>

    <!-- Cast & Crew -->
    <div class="bg-gradient-to-r from-zinc-900/95 to-black/95 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
      <h3 class="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
        <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        عوامل ساخت
      </h3>
      
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="crew in filmInfo.crew" :key="crew.role" class="group text-center">
          <div class="w-20 h-20 bg-zinc-700 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-zinc-600 transition-all duration-300 shadow-lg">
            <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h4 class="font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">{{ crew.role }}</h4>
          <p class="text-gray-400 text-sm">{{ crew.name }}</p>
        </div>
      </div>
    </div>

    <!-- Related Films -->
    <div class="bg-gradient-to-r from-zinc-900/95 to-black/95 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
      <h3 class="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
        <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
        فیلم‌های مرتبط
      </h3>
      
      <div class="space-y-4">
        <div v-for="related in relatedFilms" :key="related.id" class="group cursor-pointer">
          <div class="flex items-center space-x-4 space-x-reverse bg-zinc-800/40 rounded-xl p-4 hover:bg-zinc-800/60 transition-all duration-300">
            <div class="relative w-20 h-28 bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
              <img :src="related.poster" :alt="related.title" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <h4 class="text-white font-bold text-lg mb-2 group-hover:text-yellow-500 transition-colors">
                {{ related.title }}
              </h4>
              <div class="flex items-center space-x-3 space-x-reverse text-gray-400 mb-2">
                <span>{{ related.year }}</span>
                <span>•</span>
                <span>{{ related.duration }}</span>
                <span>•</span>
                <div class="flex items-center space-x-1 space-x-reverse">
                  <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-yellow-500 font-medium">{{ related.rating }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2 space-x-reverse">
                <span class="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs font-medium">HD</span>
                <span class="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs font-medium">رایگان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click="closeShareModal">
      <div class="bg-zinc-900 rounded-2xl p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-bold text-yellow-500 mb-4">اشتراک‌گذاری فیلم</h3>
        <div class="grid grid-cols-2 gap-4">
          <button 
            v-for="share in shareOptions" 
            :key="share.value"
            class="flex flex-col items-center space-y-2 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all duration-300"
            @click="shareFilm(share.value)"
          >
            <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
            </div>
            <span class="text-white text-sm font-medium">{{ share.label }}</span>
          </button>
        </div>
        <button 
          @click="closeShareModal"
          class="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl transition-colors"
        >
          بستن
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import BaseDropdown from './BaseDropdown.vue'

// Reactive data
const showShareModal = ref(false)
const selectedDownload = ref('')
const selectedQuality = ref('')

// Film information
const filmInfo = reactive({
  title: 'نمو حیوانات وحشی',
  poster: 'https://picsum.photos/280/380',
  description: 'فیلمی جذاب درباره زندگی حیوانات وحشی در طبیعت. این مستند به بررسی رفتار و زیستگاه حیوانات مختلف می‌پردازد و نگاهی عمیق به دنیای پر رمز و راز حیات وحش ارائه می‌دهد.',
  releaseYear: '2023',
  duration: '95 دقیقه',
  rating: 8.5,
  views: 12450,
  genres: ['طبیعت', 'مستند', 'حیوانات', 'ماجراجویی'],
  crew: [
    { role: 'کارگردان', name: 'احمد محمدی' },
    { role: 'تهیه‌کننده', name: 'فاطمه احمدی' },
    { role: 'فیلمبردار', name: 'علی رضایی' },
    { role: 'تدوینگر', name: 'مریم کریمی' }
  ]
})

// Download options
const downloadOptions = [
  { label: '720p - HD', value: '720p' },
  { label: '1080p - Full HD', value: '1080p' },
  { label: '4K - Ultra HD', value: '4k' }
]

// Quality options
const qualityOptions = [
  { label: 'پایین - 480p', value: '480p' },
  { label: 'متوسط - 720p', value: '720p' },
  { label: 'بالا - 1080p', value: '1080p' },
  { label: 'فوق‌العاده - 4K', value: '4k' }
]

// Share options
const shareOptions = [
  { label: 'تلگرام', value: 'telegram' },
  { label: 'واتساپ', value: 'whatsapp' },
  { label: 'توییتر', value: 'twitter' },
  { label: 'کپی لینک', value: 'copy' }
]

// Related films
const relatedFilms = reactive([
  {
    id: 1,
    title: 'حیوانات آفریقا',
    poster: 'https://picsum.photos/120/160',
    year: '2022',
    duration: '88 دقیقه',
    rating: 8.2
  },
  {
    id: 2,
    title: 'پرندگان مهاجر',
    poster: 'https://picsum.photos/121/161',
    year: '2023',
    duration: '102 دقیقه',
    rating: 8.7
  },
  {
    id: 3,
    title: 'اقیانوس آبی',
    poster: 'https://picsum.photos/122/162',
    year: '2021',
    duration: '110 دقیقه',
    rating: 9.1
  }
])

// Methods
const toggleShareModal = () => {
  showShareModal.value = !showShareModal.value
}

const closeShareModal = () => {
  showShareModal.value = false
}

const shareFilm = (platform: string) => {
  console.log('Sharing on:', platform)
  closeShareModal()
}

const downloadVideo = (option: any) => {
  console.log('Downloading video in quality:', option.value)
}

const changeQuality = (option: any) => {
  console.log('Changing video quality to:', option.value)
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
