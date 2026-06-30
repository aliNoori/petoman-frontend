<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-yellow-500/10">
          <h3 class="text-xl font-bold text-yellow-500">جستجوی فیلم</h3>
          <button @click="close" class="text-gray-400 hover:text-yellow-500 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search Input -->
        <div class="p-6 pb-4">
          <div class="relative">
            <input
              ref="searchInput"
              v-model="query"
              @input="liveSearch"
              type="text"
              placeholder="نام فیلم، دسته‌بندی یا توضیحات..."
              class="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/60 focus:ring-2 focus:ring-yellow-500/20 transition-all"
            >
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button v-if="query" @click="clearSearch" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="px-6 pb-6 max-h-96 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p class="text-gray-400 mt-3">در حال جستجو...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="query && !loading && results.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-gray-400 text-lg mb-2">نتیجه‌ای یافت نشد</p>
            <p class="text-gray-500 text-sm">کلمات کلیدی دیگری را امتحان کنید</p>
          </div>

          <!-- Initial State -->
          <div v-else-if="!query" class="text-center py-8">
            <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
            </svg>
            <p class="text-gray-400 text-lg mb-2">فیلم مورد نظر خود را جستجو کنید</p>
            <p class="text-gray-500 text-sm">حداقل ۲ کاراکتر تایپ کنید</p>
          </div>

          <!-- Results -->
          <div v-else-if="results.length > 0" class="space-y-3">
            <div 
              v-for="film in results.slice(0, 5)" 
              :key="film.id"
              @click="goToFilm(film.id)"
              class="flex items-center gap-4 p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-yellow-500/20"
            >
              <img 
                :src="film.poster" 
                :alt="film.title"
                class="w-16 h-20 object-cover rounded-lg bg-zinc-700"
              >
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-white truncate">{{ film.title }}</h4>
                <p class="text-sm text-yellow-500 mb-1">{{ getCategoryName(film.category) }}</p>
                <p class="text-xs text-gray-400 line-clamp-2">{{ film.description }}</p>
                <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>⭐ {{ film.rating }}/10</span>
                  <span>🕐 {{ film.duration }} دقیقه</span>
                  <span>📅 {{ film.year }}</span>
                </div>
              </div>
              <div class="text-gray-400">
                <i class="ti ti-arrow-left"></i>
              </div>
            </div>

            <!-- View All Results Button -->
            <button 
              v-if="results.length > 5"
              @click="viewAllResults"
              class="w-full mt-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-all border border-yellow-500/20 hover:border-yellow-500/40"
            >
              مشاهده {{ results.length }} نتیجه
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{ show: boolean, films: any[] }>()
const emit = defineEmits(['close', 'navigate'])

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const searchInput = ref<HTMLInputElement>()

const close = () => {
  emit('close')
  query.value = ''
  results.value = []
}

const clearSearch = () => {
  query.value = ''
  results.value = []
  searchInput.value?.focus()
}

const liveSearch = async () => {
  if (query.value.length === 0) {
    results.value = []
    return
  }
  
  loading.value = true
  await nextTick()
  
  setTimeout(() => {
    if (query.value.length < 2) {
      results.value = []
      loading.value = false
      return
    }
    const q = query.value.toLowerCase()
    results.value = props.films.filter(film =>
      film.title.toLowerCase().includes(q) ||
      film.description.toLowerCase().includes(q) ||
      film.category.toLowerCase().includes(q)
    )
    loading.value = false
  }, 300)
}

const goToFilm = (id: number) => {
  close()
  emit('navigate', `/player/${id}`)
}

const viewAllResults = () => {
  close()
  emit('navigate', `/movies?search=${encodeURIComponent(query.value)}`)
}

const getCategoryName = (category: string) => {
  const categories: Record<string, string> = {
    documentary: 'مستند',
    nature: 'طبیعت',
    rescue: 'نجات',
    education: 'آموزشی',
    animation: 'انیمیشن'
  }
  return categories[category] || category
}

watch(() => props.show, (val) => {
  if (val) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    query.value = ''
    results.value = []
  }
})
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
