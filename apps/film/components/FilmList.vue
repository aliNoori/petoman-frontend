<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="film in filteredFilms"
      :key="film.id"
      class="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-yellow-400/10 hover:border-yellow-400/30"
    >
      <div class="relative aspect-video overflow-hidden">
        <div class="w-full h-full bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
          <div class="text-center text-black">
            <i class="ti ti-movie text-5xl mb-3 opacity-80"></i>
            <span class="text-sm font-bold opacity-90">{{ film.title.substring(0, 25) }}...</span>
          </div>
        </div>
        
        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div class="text-center">
            <button class="w-16 h-16 bg-yellow-400 hover:bg-yellow-300 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg">
              <i class="ti ti-player-play text-black text-2xl mr-1"></i>
            </button>
            <p class="text-white text-sm mt-3 opacity-90">کلیک برای پخش</p>
          </div>
        </div>
        
        <!-- Badges -->
        <div class="absolute top-3 right-3 flex gap-2">
          <span class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold rounded-full shadow-lg">
            {{ film.category }}
          </span>
          <span v-if="film.isNew" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            جدید
          </span>
        </div>
        
        <div class="absolute bottom-3 left-3 flex gap-2">
          <div class="bg-black/70 backdrop-blur-sm text-yellow-400 text-sm px-2 py-1 rounded-lg flex items-center">
            <i class="ti ti-clock ml-1 text-xs"></i>
            {{ film.duration }}
          </div>
          <div class="bg-black/70 backdrop-blur-sm text-yellow-400 text-sm px-2 py-1 rounded-lg flex items-center">
            <i class="ti ti-star-filled ml-1 text-xs"></i>
            {{ film.rating }}
          </div>
        </div>
      </div>
      
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-bold text-yellow-400 line-clamp-2 group-hover:text-yellow-300 transition-colors leading-tight">
          {{ film.title }}
        </h3>
        <p class="text-yellow-200/80 text-sm line-clamp-3 leading-relaxed">
          {{ film.description }}
        </p>
        
        <div class="flex items-center justify-between text-sm text-yellow-300/70">
          <div class="flex items-center gap-4">
            <span class="flex items-center">
              <i class="ti ti-eye ml-1 text-yellow-400"></i>
              {{ film.views.toLocaleString('fa-IR') }}
            </span>
            <span class="flex items-center">
              <i class="ti ti-calendar ml-1 text-yellow-400"></i>
              {{ formatDate(film.releaseDate) }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button class="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <i class="ti ti-player-play ml-2"></i>
            پخش
          </button>
          <button class="px-4 py-3 bg-zinc-700/50 hover:bg-zinc-600/50 text-yellow-400 rounded-xl transition-all duration-300 transform hover:scale-105">
            <i class="ti ti-bookmark"></i>
          </button>
          <button class="px-4 py-3 bg-zinc-700/50 hover:bg-zinc-600/50 text-yellow-400 rounded-xl transition-all duration-300 transform hover:scale-105">
            <i class="ti ti-share"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Film {
  id: number
  title: string
  description: string
  poster: string
  duration: string
  category: string
  views: number
  rating: number
  releaseDate: string
  type: string
  isNew?: boolean
}

interface Props {
  type?: string
  category?: string
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'all',
  category: 'all',
  limit: 8
})

// Mock data - در حالت واقعی از API دریافت می‌شود
const allFilms: Film[] = [
  {
    id: 1,
    title: 'نجات گربه‌های خیابانی',
    description: 'مستندی درباره نجات و مراقبت از گربه‌های بی‌خانمان در شهر',
    poster: '/images/film1.jpg',
    duration: '45:30',
    category: 'مستند',
    views: 12500,
    rating: 4.8,
    releaseDate: '2024-01-15',
    type: 'new'
  },
  {
    id: 2,
    title: 'سگ‌های نجات',
    description: 'داستان آموزش سگ‌های نجات و خدماتشان به جامعه',
    poster: '/images/film2.jpg',
    duration: '52:15',
    category: 'مستند',
    views: 8900,
    rating: 4.6,
    releaseDate: '2024-02-10',
    type: 'popular'
  },
  {
    id: 3,
    title: 'حیوانات وحشی در خطر',
    description: 'بررسی وضعیت حیوانات وحشی در معرض انقراض',
    poster: '/images/film3.jpg',
    duration: '38:45',
    category: 'طبیعت',
    views: 15600,
    rating: 4.9,
    releaseDate: '2024-03-05',
    type: 'new'
  },
  {
    id: 4,
    title: 'پرندگان مهاجر',
    description: 'سفر شگفت‌انگیز پرندگان مهاجر در فصول مختلف',
    poster: '/images/film4.jpg',
    duration: '41:20',
    category: 'طبیعت',
    views: 11200,
    rating: 4.7,
    releaseDate: '2024-01-28',
    type: 'popular'
  }
]

const filteredFilms = computed(() => {
  let films = [...allFilms]
  
  if (props.type !== 'all') {
    films = films.filter(film => film.type === props.type)
  }
  
  if (props.category !== 'all') {
    films = films.filter(film => film.category === props.category)
  }
  
  return films.slice(0, props.limit)
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long'
  }).format(date)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
