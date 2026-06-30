<template>
  <div class="bg-black min-h-screen text-yellow-400">
    <HeaderFilm />
    <main class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-yellow-400 mb-4">سریال‌های حیوانات</h1>
        <p class="text-yellow-200 text-lg">مجموعه‌ای از بهترین سریال‌های مستند درباره حیوانات</p>
      </div>
      
      <!-- Filter Section -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="selectedFilter = filter.id"
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-300',
              selectedFilter === filter.id
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700'
            ]"
          >
            <i :class="filter.icon" class="ml-2"></i>
            {{ filter.name }}
          </button>
        </div>
      </div>

      <!-- Series Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="series in filteredSeries"
          :key="series.id"
          class="group bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="relative aspect-video overflow-hidden">
            <img
              :src="series.poster"
              :alt="series.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <button class="w-16 h-16 bg-yellow-400 bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <i class="ti ti-player-play text-black text-2xl mr-1"></i>
              </button>
            </div>
            <div class="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
              {{ series.episodes }} قسمت
            </div>
            <div class="absolute bottom-3 left-3 bg-black bg-opacity-75 text-yellow-400 text-sm px-2 py-1 rounded">
              فصل {{ series.season }}
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-bold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">
              {{ series.title }}
            </h3>
            <p class="text-yellow-200 text-sm mb-4 line-clamp-3">
              {{ series.description }}
            </p>
            
            <div class="flex items-center justify-between text-sm text-yellow-300 mb-4">
              <div class="flex items-center space-x-4 space-x-reverse">
                <span class="flex items-center">
                  <i class="ti ti-star text-yellow-400 ml-1"></i>
                  {{ series.rating }}
                </span>
                <span class="flex items-center">
                  <i class="ti ti-calendar text-yellow-400 ml-1"></i>
                  {{ series.year }}
                </span>
              </div>
            </div>

            <button class="w-full px-4 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
              <i class="ti ti-player-play ml-2"></i>
              شروع تماشا
            </button>
          </div>
        </div>
      </div>
    </main>
    <FooterFilm />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedFilter = ref('all')

const filters = [
  { id: 'all', name: 'همه', icon: 'ti ti-category' },
  { id: 'wildlife', name: 'حیات وحش', icon: 'ti ti-leaf' },
  { id: 'pets', name: 'حیوانات خانگی', icon: 'ti ti-home' },
  { id: 'rescue', name: 'نجات', icon: 'ti ti-heart' },
  { id: 'education', name: 'آموزشی', icon: 'ti ti-school' }
]

const series = [
  {
    id: 1,
    title: 'دنیای سگ‌ها',
    description: 'مستندی جامع درباره انواع نژادهای سگ و ویژگی‌های آن‌ها',
    poster: '/images/series1.jpg',
    episodes: 12,
    season: 1,
    rating: 4.7,
    year: 1403,
    category: 'pets'
  },
  {
    id: 2,
    title: 'نجات در طبیعت',
    description: 'داستان‌های واقعی از نجات حیوانات وحشی آسیب‌دیده',
    poster: '/images/series2.jpg',
    episodes: 8,
    season: 2,
    rating: 4.9,
    year: 1402,
    category: 'rescue'
  },
  {
    id: 3,
    title: 'پرندگان ایران',
    description: 'آشنایی با تنوع پرندگان بومی ایران و زیستگاه‌شان',
    poster: '/images/series3.jpg',
    episodes: 15,
    season: 1,
    rating: 4.8,
    year: 1403,
    category: 'wildlife'
  }
]

const filteredSeries = computed(() => {
  if (selectedFilter.value === 'all') {
    return series
  }
  return series.filter(s => s.category === selectedFilter.value)
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
