<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section - Clean -->
    <div class="relative bg-gradient-to-b from-rose-50 to-white py-20 overflow-hidden min-h-[450px] flex items-center">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
        <i class="ti ti-video absolute top-16 left-24 text-rose-400 text-7xl rotate-12"></i>
        <i class="ti ti-paw-filled absolute top-12 right-20 text-rose-400 text-6xl -rotate-6"></i>
        <i class="ti ti-heart-filled absolute bottom-20 left-1/4 text-rose-300 text-6xl rotate-45"></i>
        <i class="ti ti-play-card absolute bottom-16 right-1/3 text-rose-400 text-6xl -rotate-12"></i>
        <i class="ti ti-camera absolute top-1/2 left-12 text-rose-300 text-6xl rotate-6"></i>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            مستندات نجات حیوانات
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            شاهد داستان‌های واقعی نجات، درمان و بازگشت حیوانات به زندگی باشید
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Breadcrumb -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-rose-600 transition-colors">خانه</NuxtLink>
          <span>←</span>
          <span class="text-gray-900 font-medium">مستندات</span>
        </nav>
      </div>
    </div>

    <!-- Categories Filter -->
    <div class="bg-white border-b sticky top-16 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Desktop: Flex Wrap -->
        <div class="hidden md:flex flex-wrap gap-3">
          <button
            v-for="category in categoriesWithCount"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-300',
              selectedCategory === category.id
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
            ]"
          >
            <i :class="category.icon" class="text-lg ml-2"></i>
            {{ category.name }}
            <span class="mr-2 text-sm opacity-75">({{ category.count }})</span>
          </button>
        </div>
        
        <!-- Mobile: Horizontal Scroll -->
        <div class="md:hidden overflow-x-auto -mx-4 px-4">
          <div class="flex gap-3 pb-2" style="min-width: min-content;">
            <button
              v-for="category in categoriesWithCount"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="[
                'px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0',
                selectedCategory === category.id
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              ]"
            >
              <i :class="category.icon" class="text-lg ml-2"></i>
              {{ category.name }}
              <span class="mr-2 text-sm opacity-75">({{ category.count }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Videos Grid -->
    <div class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search Bar -->
        <div class="mb-8">
          <div class="relative max-w-md mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در مستندات..."
              class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
            <i class="ti ti-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Videos Swiper -->
        <div v-if="paginatedVideos.length === 0" class="text-center py-12">
          <i class="ti ti-video-off text-6xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 mb-2">مستندی یافت نشد</h3>
          <p class="text-gray-600">در این دسته‌بندی مستندی موجود نیست.</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="video in paginatedVideos"
              :key="video.id"
              class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
            >
              <div
                  class="relative aspect-video overflow-hidden cursor-pointer"
                  @click="activeVideo = video"
              >

              <img
                  :src="video.thumbnail"
                  :alt="video.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div class="w-16 h-16 bg-rose-600 bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <i class="ti ti-player-play text-white text-2xl mr-1"></i>
                  </div>
                </div>
                <div class="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {{ video.duration }}
                </div>
                <div class="absolute top-3 left-3">
                  <span class="px-2 py-1 bg-rose-600 text-white text-xs rounded-full">
                    {{ getCategoryName(video.category) }}
                  </span>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors">
                  {{ video.title }}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                  {{ video.description }}
                </p>

                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div class="flex items-center space-x-reverse space-x-4">
                    <span class="flex items-center">
                      <i class="ti ti-eye text-rose-600 ml-1"></i>
                      {{ video.views.toLocaleString('fa-IR') }}
                    </span>
                    <span class="flex items-center">
                      <i class="ti ti-calendar text-rose-600 ml-1"></i>
                      {{ formatDate(video.publishDate) }}
                    </span>
                  </div>
                </div>

                <NuxtLink
                  :to="`/documentaries/${video.id}`"
                  class="block w-full text-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
                >
                  مشاهده مستند
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 space-x-reverse space-x-2">
          <!-- Previous Button -->
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-300'
            ]"
          >
            <i class="ti ti-chevron-right"></i>
            قبلی
          </button>

          <!-- Page Numbers -->
          <div class="flex space-x-reverse space-x-1">
            <button
              v-for="page in getVisiblePages()"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                page === currentPage
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-300'
              ]"
            >
              {{ page.toLocaleString('fa-IR') }}
            </button>
          </div>

          <!-- Next Button -->
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-300'
            ]"
          >
            بعدی
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>

        <!-- Results Info -->
        <div v-if="filteredVideos.length > 0" class="text-center mt-8 text-sm text-gray-600">
          نمایش {{ ((currentPage - 1) * itemsPerPage + 1).toLocaleString('fa-IR') }} تا 
          {{ Math.min(currentPage * itemsPerPage, filteredVideos.length).toLocaleString('fa-IR') }} 
          از {{ filteredVideos.length.toLocaleString('fa-IR') }} مستند
        </div>
      </div>
    </div>
    <!-- Video Modal -->
    <Teleport to="body">
      <div
          v-if="activeVideo"
          class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          @click.self="activeVideo = null"
      >
        <div class="bg-black rounded-2xl w-full max-w-4xl overflow-hidden relative">

          <!-- Close -->
          <button
              class="absolute top-4 right-4 z-10 text-white bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black"
              @click="activeVideo = null"
          >
            <i class="ti ti-x"></i>
          </button>

          <!-- Video -->
          <video
              v-if="activeVideo?.videoUrl.endsWith('.mp4')"
              :src="activeVideo?.videoUrl"
              controls
              autoplay
              class="w-full h-auto max-h-[80vh]"
          />

          <!-- iframe (YouTube / Aparat / embed) -->
          <iframe
              v-else
              :src="activeVideo?.videoUrl"
              class="w-full aspect-video"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
          ></iframe>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
// Documentaries page: using a grid + pagination (removed Swiper to keep a grid layout)

import {useCategoryStore} from "~/stores/category.ts";
import {useVideoData} from "~/composables/useVideoData.ts";

const { getCategoriesWithCount, getVideosByCategory, searchVideos } = useVideoData()

// Reactive state
const selectedCategory = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const activeVideo = ref<null | {
  id: string
  title: string
  videoUrl: string
}>(null)

// Computed properties
const categoriesWithCount = computed(() => getCategoriesWithCount())

const filteredVideos = computed(() => {
  let videos = getVideosByCategory(selectedCategory.value)
  if (searchQuery.value.trim()) {
    videos = searchVideos(searchQuery.value.trim())
  }

  return videos
})

const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / itemsPerPage.value)
})

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredVideos.value.slice(start, end)
})

// Watch for changes that should reset pagination
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

// SEO
useSeoMeta({
  title: 'مستندات - پتومن | مشاهده مستندات نجات حیوانات',
  description: 'مجموعه کاملی از مستندات واقعی نجات، درمان و مراقبت از حیوانات. شاهد داستان‌های الهام‌بخش و آموزنده از فعالیت‌های تیم پتومن باشید.',
  ogTitle: 'مستندات - پتومن',
  ogDescription: 'مجموعه کاملی از مستندات واقعی نجات، درمان و مراقبت از حیوانات',
  ogImage: '/images/documentaries-og.jpg'
})
const categoryStore=useCategoryStore()
const categories=computed(()=>categoryStore.categories)
// Functions
/*const categories = {
  'all': 'همه',
  'rescue': 'نجات اضطراری',
  'treatment': 'درمان و توانبخشی',
  'success': 'داستان‌های موفقیت',
  'shelter': 'پناهگاه و نگهداری',
  'training': 'آموزش و آگاهی'
}*/

const getCategoryName = (category:any): string => {
  return category?.title ?? category.id
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getVisiblePages = (): number[] => {
  const delta = 2 // Number of pages to show on each side of current page
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, currentPage.value - delta); 
       i <= Math.min(totalPages.value - 1, currentPage.value + delta); 
       i++) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, 0) // 0 represents dots
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push(0, totalPages.value) // 0 represents dots
  } else {
    if (totalPages.value > 1) {
      rangeWithDots.push(totalPages.value)
    }
  }

  return rangeWithDots.filter((page, index, array) => 
    page !== 0 && array.indexOf(page) === index
  )
}
</script>

<style scoped>
/* Line clamp utilities for grid layout */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
