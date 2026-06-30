<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
    <HeaderFilm />
    
    <!-- Hero Section -->
    <section class="relative pt-32  overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
      
      <div class="relative z-10 max-w-6xl mx-auto px-4">
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-500 to-yellow-500 bg-clip-text text-transparent mb-6">
            فیلم‌ها
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            مجموعه کاملی از فیلم‌ها و مستندات دنیای حیوانات
          </p>
        </div>
      </div>
    </section>

    <!-- Search and Filters -->
    <section class="py-8 relative z-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20 mb-8 relative overflow-visible">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Search -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در فیلم‌ها..."
                class="w-full pl-12 pr-6 py-4 bg-zinc-900/60 border border-yellow-400/30 rounded-2xl text-yellow-200 placeholder-yellow-200/60 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              >
              <div class="absolute left-5 top-1/2 -translate-y-1/2">
                <i class="ti ti-search text-yellow-400 text-lg"></i>
              </div>
            </div>

            <!-- Category Filter -->
            <div class="relative" ref="categoryDropdownRef">
              <button
                @click="toggleCategory"
                class="flex items-center justify-between gap-3 w-full px-6 py-4 bg-zinc-900/60 border border-yellow-400/30 rounded-2xl text-yellow-200 hover:border-yellow-400/60 focus:border-yellow-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              >
                <span class="flex items-center gap-3">
                  <i class="ti ti-category text-yellow-400"></i>
                  <span class="font-medium">{{ getCategoryFilterLabel(selectedCategory) }}</span>
                </span>
                <i :class="['ti ti-chevron-down transition-transform duration-300 text-yellow-400', { 'rotate-180': showCategory }]"></i>
              </button>
              
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div 
                  v-if="showCategory" 
                  class="absolute z-[9999] top-full left-0 right-0 mt-2 bg-zinc-900/98 backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl overflow-hidden"
                  style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                >
                  <ul class="py-2">
                    <li 
                      v-for="option in categoryOptions"
                      :key="option.value"
                      @click="selectCategory(option.value)"
                      :class="[
                        'px-6 py-4 cursor-pointer transition-all duration-200 flex items-center gap-3',
                        selectedCategory === option.value 
                          ? 'bg-yellow-400/20 text-yellow-400 border-r-4 border-yellow-400' 
                          : 'text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-400'
                      ]"
                    >
                      <i :class="option.icon" class="text-lg"></i>
                      <span class="font-medium">{{ option.label }}</span>
                      <i v-if="selectedCategory === option.value" class="ti ti-check mr-auto text-yellow-400"></i>
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>

            <!-- Sort Filter -->
            <div class="relative" ref="sortDropdownRef">
              <button
                @click="toggleSort"
                class="flex items-center justify-between gap-3 w-full px-6 py-4 bg-zinc-900/60 border border-yellow-400/30 rounded-2xl text-yellow-200 hover:border-yellow-400/60 focus:border-yellow-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              >
                <span class="flex items-center gap-3">
                  <i class="ti ti-sort-descending text-yellow-400"></i>
                  <span class="font-medium">{{ getSortFilterLabel(sortBy) }}</span>
                </span>
                <i :class="['ti ti-chevron-down transition-transform duration-300 text-yellow-400', { 'rotate-180': showSort }]"></i>
              </button>
              
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div 
                  v-if="showSort" 
                  class="absolute z-[9999] top-full left-0 right-0 mt-2 bg-zinc-900/98 backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl overflow-hidden"
                  style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                >
                  <ul class="py-2">
                    <li 
                      v-for="option in sortOptions"
                      :key="option.value"
                      @click="selectSort(option.value)"
                      :class="[
                        'px-6 py-4 cursor-pointer transition-all duration-200 flex items-center gap-3',
                        sortBy === option.value 
                          ? 'bg-yellow-400/20 text-yellow-400 border-r-4 border-yellow-400' 
                          : 'text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-400'
                      ]"
                    >
                      <i :class="option.icon" class="text-lg"></i>
                      <span class="font-medium">{{ option.label }}</span>
                      <i v-if="sortBy === option.value" class="ti ti-check mr-auto text-yellow-400"></i>
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center justify-between mt-6">
            <div class="flex items-center gap-2">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div class="text-gray-400 text-sm">
              {{ filteredFilms.length }} فیلم یافت شد
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Films Grid/List -->
    <section class="pb-20 relative z-10">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="film in paginatedFilms"
            :key="film.id"
            class="group bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <div class="relative">
              <img 
                :src="film.poster" 
                :alt="film.title"
                class="w-full h-48 object-cover"
                loading="lazy"
              >
              <div class="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                {{ getCategoryName(film.category) }}
              </div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button class="w-12 h-12 bg-yellow-500/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ film.title }}</h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ film.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{{ film.duration }}</span>
                <span>⭐ {{ film.rating }}/10</span>
                <span>{{ film.year }}</span>
              </div>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/player/${film.id}`"
                  class="flex-1 px-4 py-2 bg-yellow-500 text-black text-center text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  تماشا
                </NuxtLink>
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
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="film in paginatedFilms"
            :key="film.id"
            class="flex items-center gap-6 p-6 bg-gradient-to-r from-zinc-900 to-black rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
          >
            <img 
              :src="film.poster" 
              :alt="film.title"
              class="w-24 h-32 object-cover rounded-lg"
              loading="lazy"
            >
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-white">{{ film.title }}</h3>
                <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  {{ getCategoryName(film.category) }}
                </span>
              </div>
              <p class="text-gray-400 mb-4 line-clamp-2">{{ film.description }}</p>
              <div class="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ film.duration }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {{ film.rating }}/10
                </span>
                <span>{{ film.year }}</span>
              </div>
              <div class="flex items-center gap-3">
                <NuxtLink 
                  :to="`/player/${film.id}`" 
                  class="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  تماشا کنید
                </NuxtLink>
                <button class="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 border border-yellow-500/20 transition-colors">
                  علاقه‌مندی
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-12">
          <div class="flex items-center gap-2">
            <button
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentPage === 1 
                  ? 'bg-zinc-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              ]"
            >
              قبلی
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-4 py-2 rounded-lg transition-colors',
                  currentPage === page 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentPage === totalPages 
                  ? 'bg-zinc-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              ]"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </section>

    <FooterFilm />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {useMovieStore} from "~/stores/movie";
import {useCategoryTypeStore} from "~/stores/category-type";
import {useCategoryStore} from "~/stores/category";
import {useSeriesStore} from "~/stores/series";
import {useMediaStore} from "~/stores/media";


// Page Configuration
onMounted(() => {
  document.title = 'فیلم‌ها - فیلم حیوانات | مجموعه کامل مستندات طبیعت'
  
  // Meta tags for SEO
  const metaTags = [
    { name: 'description', content: 'مشاهده مجموعه کامل فیلم‌ها و مستندات دنیای حیوانات - جستجو و فیلتر کردن بر اساس دسته‌بندی، امتیاز و محبوبیت' },
    { name: 'keywords', content: 'فیلم‌های حیوانات، مستندات طبیعت، ویدیو آموزشی، فیلم نجات حیوانات، مستند حیات وحش' },
    { property: 'og:title', content: 'فیلم‌ها - فیلم حیوانات' },
    { property: 'og:description', content: 'مجموعه کاملی از فیلم‌ها و مستندات دنیای حیوانات' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'فیلم‌ها - فیلم حیوانات' },
    { name: 'twitter:description', content: 'مشاهده آنلاین مستندات و فیلم‌های حیوانات' }
  ]
  
  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
    let tag = document.querySelector(selector) as HTMLMetaElement
    if (!tag) {
      tag = document.createElement('meta')
      if (name) tag.setAttribute('name', name)
      if (property) tag.setAttribute('property', property)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  })

  // Get URL parameters for initial filters
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('category')) {
    selectedCategory.value = urlParams.get('category') || ''
  }
  if (urlParams.get('search')) {
    searchQuery.value = urlParams.get('search') || ''
  }

  // Add click listener for dropdown close
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})

// Reactive Data
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = 12

// Dropdown states
const showCategory = ref(false)
const showSort = ref(false)
const categoryDropdownRef = ref<HTMLElement>()
const sortDropdownRef = ref<HTMLElement>()
const mediaStore=useMediaStore()
// Filter options
/*const categoryOptions = [
  { value: '', label: 'همه دسته‌بندی‌ها', icon: 'ti ti-category-2' },
  { value: 'documentary', label: 'مستند', icon: 'ti ti-video' },
  { value: 'nature', label: 'طبیعت', icon: 'ti ti-plant' },
  { value: 'rescue', label: 'نجات', icon: 'ti ti-heart' },
  { value: 'education', label: 'آموزشی', icon: 'ti ti-school' },
  { value: 'animation', label: 'انیمیشن', icon: 'ti ti-palette' }
]*/
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const filmTypeId = categoryTypeStore.idBySlug('film')
const categoryOptions = computed(() => {
  if (!filmTypeId) return []

  return categoryStore
      .getCategories(String(filmTypeId)).filter((c: any) => c.contentType === 'movie')
      .map((item: any) => ({
        value: item.slug,
        label: item.name,
        icon: item.icon,
      }))
})

const sortOptions = [
  { value: 'newest', label: 'جدیدترین', icon: 'ti ti-calendar-plus' },
  { value: 'oldest', label: 'قدیمی‌ترین', icon: 'ti ti-calendar-minus' },
  { value: 'rating', label: 'بالاترین امتیاز', icon: 'ti ti-star' },
  { value: 'popular', label: 'محبوب‌ترین', icon: 'ti ti-trending-up' },
  { value: 'duration', label: 'مدت زمان', icon: 'ti ti-clock' }
]

interface MediaItem {
  id: string
  type: 'movie' | 'series'
  title: string
  description: string
  poster: string
  category: string
  slug: string
  duration: number
  ageRating:number
  rating: number
  year: number
  views: number
  status: string
}

const movieStore=useMovieStore()
const films = computed<MediaItem[]>(() =>
    movieStore.movies.map((film: any) => ({
      id: film.id,
      type: 'movie',
      title: film.title,
      description: film.description,
      poster: film.poster,
      category: film.category.title,
      slug: film.category.slug,
      duration: film.duration,
      ageRating:film.ageRating,
      rating: film.rating,
      year: film.year,
      views: film.views ?? 0,
      status: film.views > 15000 ? 'پر بازدید' : 'کم بازدید'
    }))
)

const seriesStore=useSeriesStore()
const series = computed<MediaItem[]>(() =>
    seriesStore.seriesList.map((s: any) => ({
      id: s.id,
      type: 'series',
      title: s.title,
      description: s.description,
      poster: s.poster,
      category: s.category.title,
      slug: s.category.slug,
      duration: s.duration ?? 0,
      ageRating:s.ageRating,
      rating: s.rating,
      year: s.year,
      views: s.views ?? 0,
      status: s.views > 15000 ? 'پر بازدید' : 'کم بازدید'
    }))
)


const allContents = computed<MediaItem[]>(() => [
  ...films.value,
  ...series.value
])



// Mock Films Data
/*const films = ref([
  {
    id: 1,
    title: 'نجات گربه‌های خیابانی',
    description: 'مستندی درباره نجات و مراقبت از گربه‌های بی‌خانمان در شهر',
    poster: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=600&fit=crop',
    category: 'rescue',
    duration: '45 دقیقه',
    rating: 4.8,
    year: 1402,
    views: 12500
  },
  {
    id: 2,
    title: 'شیرهای آفریقا',
    description: 'مستندی شگفت‌انگیز از زندگی شیرها در طبیعت وحشی آفریقا',
    poster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=600&fit=crop',
    category: 'documentary',
    duration: '52 دقیقه',
    rating: 4.9,
    year: 1402,
    views: 18300
  },
  {
    id: 3,
    title: 'دنیای دلفین‌ها',
    description: 'کاوش در هوش و ارتباطات پیچیده دلفین‌ها در اقیانوس‌های آبی',
    poster: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop',
    category: 'education',
    duration: '38 دقیقه',
    rating: 4.7,
    year: 1401,
    views: 9800
  },
  {
    id: 4,
    title: 'پرندگان مهاجر',
    description: 'سفر هزاران کیلومتری پرندگان در جستجوی آب و هوای مناسب',
    poster: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=600&fit=crop',
    category: 'nature',
    duration: '62 دقیقه',
    rating: 4.6,
    year: 1401,
    views: 15600
  },
  {
    id: 5,
    title: 'نجات شیرهای دریایی',
    description: 'تلاش‌های محافظان برای نجات شیرهای دریایی در سواحل کالیفرنیا',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop',
    category: 'rescue',
    duration: '41 دقیقه',
    rating: 4.8,
    year: 1402,
    views: 11200
  },
  {
    id: 6,
    title: 'زندگی خرس‌های قطبی',
    description: 'نگاهی به زندگی خرس‌های قطبی در شرایط تغییرات اقلیمی',
    poster: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=600&fit=crop',
    category: 'documentary',
    duration: '55 دقیقه',
    rating: 4.9,
    year: 1402,
    views: 20100
  }
])*/

// Computed Properties
const filteredFilms = computed(() => {

  let result = [...allContents.value]

  // 🔍 Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    )
  }

  // 🏷 Category
  if (selectedCategory.value) {
    result = result.filter(item => item.slug === selectedCategory.value)
  }

  // 🔃 Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest': return b.year - a.year
      case 'oldest': return a.year - b.year
      case 'rating': return b.rating - a.rating
      case 'popular': return b.views - a.views
      case 'duration': return a.duration - b.duration
      default: return 0
    }
  })

  return result
})


const totalPages = computed(() => Math.ceil(filteredFilms.value.length / itemsPerPage))

const paginatedFilms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFilms.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Show max 5 pages
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  
  // Adjust start if we're near the end
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const getCategoryName = (category: string) => {
  const categories = {
    documentary: 'مستند',
    nature: 'طبیعت', 
    rescue: 'نجات',
    education: 'آموزشی',
    animation: 'انیمیشن'
  }
  return categories[category] || category
}

const getCategoryFilterLabel = (value: string) => {

  const option = categoryOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'همه دسته‌بندی‌ها'
}

const getSortFilterLabel = (value: string) => {
  const option = sortOptions.find(opt => opt.value === value)
  return option ? option.label : 'جدیدترین'
}

const toggleCategory = () => {
  showCategory.value = !showCategory.value
  showSort.value = false
}

const toggleSort = () => {
  showSort.value = !showSort.value
  showCategory.value = false
}

const selectCategory = (value: string) => {
  selectedCategory.value = value
  showCategory.value = false
}

const selectSort = (value: string) => {
  sortBy.value = value
  showSort.value = false
}

const closeDropdowns = (event: Event) => {
  if (!categoryDropdownRef.value?.contains(event.target as Node)) {
    showCategory.value = false
  }
  if (!sortDropdownRef.value?.contains(event.target as Node)) {
    showSort.value = false
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
