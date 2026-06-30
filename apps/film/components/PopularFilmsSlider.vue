<template>
  <div class="popular-films-slider">
    <Swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="20"
      :navigation="true"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :loop="popularFilms.length > 1"
      :breakpoints="{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 30,
        }
      }"
      class="popular-swiper"
    >
      <SwiperSlide v-for="film in popularFilms" :key="film.id">
        <div class="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-2">
          <div class="relative">
            <img 
              :src="film.poster" 
              :alt="film.title"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            <!-- Badges -->
            <div class="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {{ film.badge }}
            </div>
            
            <!-- Bookmark Button -->
            <div class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                  @click="mediaStore.toggleWatchlist(film.id,film.type)"
                  class="px-4 py-2 rounded-lg transition-colors"
                  :class="mediaStore.isWatchlist(film.id,film.type)
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'"
              >
                <i :class="mediaStore.isWatchlist(film.id,film.type) ? 'ti ti-bookmark-filled' : 'ti ti-bookmark'"></i>
              </button>
            </div>
          </div>
          
          <div class="p-5">
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">{{ film.title }}</h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{{ film.description }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <span class="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">{{ film.category }}</span>
                <span :class="film.qualityClass">{{ film.quality }}</span>
              </div>
              
              <div class="flex gap-2">
                <button
                    @click="mediaStore.toggleFavorite(film.id,film.type)"
                    class="px-4 py-2 rounded-lg transition-colors"
                    :class="mediaStore.isFavorite(film.id,film.type)
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'"
                >
                  <i :class="mediaStore.isFavorite(film.id,film.type) ? 'ti ti-heart-filled' : 'ti ti-heart'"></i>
                </button>
                <button 
                  @click="navigateToFilm(film)"
                  class="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  تماشا
                </button>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Search Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click="closeModal">
      <div class="bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-xl w-full max-w-lg mx-4 border border-yellow-500/20" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">جستجوی فیلم</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="relative mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="نام فیلم یا توضیح را وارد کنید..."
              class="w-full border border-zinc-700 bg-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              @keyup.enter="performSearch"
            />
            <button 
              @click="performSearch"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>

          <div v-if="filteredFilms.length" class="max-h-60 overflow-y-auto">
            <div
              v-for="film in filteredFilms"
              :key="film.id"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-yellow-500/30"
              @click="navigateToFilm(film)"
            >
              <img :src="film.poster" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="font-bold text-white text-sm truncate">{{ film.title }}</div>
                <div class="text-xs text-gray-400 truncate">{{ film.description }}</div>
              </div>
            </div>
          </div>
          
          <div v-else-if="searchQuery" class="text-center text-gray-400 py-8">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p>فیلمی با این نام یافت نشد</p>
          </div>

          <div v-else class="text-center text-gray-500 py-8">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <p class="text-sm">برای جستجو، نام فیلم را وارد کنید</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {useMediaStore} from "~/stores/media";
import {useRouter} from "nuxt/app";

interface Film {
  id: string
  title: string
  description: string
  poster: string
  category: string
  releaseDate?: string
  type?: string
  isNew?: boolean
  badge?: string
  quality?: string
  qualityClass?: string
  createdAt?: string
}
const props = defineProps<{
  films: Film[]
}>()
const mediaStore=useMediaStore()
const popularFilms=computed(()=>props.films)
// Popular films data
/*const popularFilms = ref([
  {
    id: 1,
    title: 'نجات گربه‌های خیابانی',
    description: 'داستان تلاش‌های گروه‌های مردمی برای نجات گربه‌های بی‌خانمان در شهرهای بزرگ',
    poster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop',
    category: 'مستند',
    quality: 'HD',
    qualityClass: 'bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30',
    badge: 'جدید'
  },
  {
    id: 2,
    title: 'پرندگان مهاجر',
    description: 'سفر هزاران کیلومتری پرندگان در جستجوی زندگی بهتر و آب و هوای مناسب',
    poster: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
    category: 'طبیعت',
    quality: '4K',
    qualityClass: 'bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30',
    badge: 'داغ'
  },
  {
    id: 3,
    title: 'دنیای دلفین‌ها',
    description: 'هوش و ارتباطات پیچیده دلفین‌ها در اقیانوس‌های آبی و رفتارهای اجتماعی آنها',
    poster: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    category: 'آموزشی',
    quality: 'HD',
    qualityClass: 'bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30',
    badge: 'آموزشی'
  },
  {
    id: 4,
    title: 'حیات وحش آفریقا',
    description: 'سفری شگفت‌انگیز به قلب آفریقا و مشاهده حیوانات وحشی در زیستگاه طبیعی‌شان',
    poster: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400&h=300&fit=crop',
    category: 'حیات وحش',
    quality: '4K',
    qualityClass: 'bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30',
    badge: 'پرمیوم'
  },
  {
    id: 5,
    title: 'شیرهای آفریقا',
    description: 'مستندی شگفت‌انگیز از زندگی شیرها در طبیعت وحشی آفریقا و مبارزه برای بقا',
    poster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop',
    category: 'مستند',
    quality: '4K',
    qualityClass: 'bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30',
    badge: 'محبوب'
  },
  {
    id: 6,
    title: 'خرس‌های قطبی',
    description: 'نگاهی به زندگی خرس‌های قطبی در شرایط تغییرات اقلیمی و مبارزه برای بقا',
    poster: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=300&fit=crop',
    category: 'طبیعت',
    quality: 'HD',
    qualityClass: 'bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30',
    badge: 'جدید'
  }
])*/

// Modal state
const showModal = ref(false)
const searchQuery = ref('')
const selectedFilm = ref<Film | null>(null)

// Filtered films for search
const filteredFilms = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return popularFilms.value.filter(film =>
    film.title.toLowerCase().includes(query) ||
    film.description.toLowerCase().includes(query) ||
    film.category.toLowerCase().includes(query)
  )
})

const openSearchModal = (film: Film) => {
  selectedFilm.value = film
  showModal.value = true
  searchQuery.value = ''
}

const closeModal = () => {
  showModal.value = false
  selectedFilm.value = null
  searchQuery.value = ''
}

const performSearch = () => {
  // Perform search logic here
  console.log('Searching for:', searchQuery.value)
}
const router=useRouter()
const navigateToFilm = (film: Film) => {
  router.push(`/player/${film.id}`)
  closeModal()
}
</script>

<style scoped>
.popular-films-slider {
  position: relative;
}

.popular-swiper :deep(.swiper-button-next),
.popular-swiper :deep(.swiper-button-prev) {
  color: rgb(250 204 21);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  border: 2px solid rgba(250, 204, 21, 0.3);
  transition: all 0.3s ease;
}

.popular-swiper :deep(.swiper-button-next:hover),
.popular-swiper :deep(.swiper-button-prev:hover) {
  color: rgb(253 224 71);
  background: rgba(250, 204, 21, 0.2);
  border-color: rgb(250 204 21);
  transform: scale(1.1);
}

.popular-swiper :deep(.swiper-button-next:after),
.popular-swiper :deep(.swiper-button-prev:after) {
  font-size: 16px;
}

.popular-swiper :deep(.swiper-pagination-bullet) {
  background-color: rgba(250, 204, 21, 0.4);
  width: 10px;
  height: 10px;
  opacity: 1;
}

.popular-swiper :deep(.swiper-pagination-bullet-active) {
  background-color: rgb(250 204 21);
  transform: scale(1.2);
}

.popular-swiper :deep(.swiper-pagination) {
  bottom: -20px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
