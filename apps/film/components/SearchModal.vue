<template>
  <!-- Modal Backdrop -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="show" 
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-20"
        @click="closeModal"
      >
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div 
            v-if="show"
            @click.stop
            class="w-full max-w-2xl mx-4 bg-zinc-900/95 backdrop-blur-md border border-yellow-400/30 rounded-3xl shadow-2xl overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-yellow-400/20">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <i class="ti ti-search text-black text-lg"></i>
                </div>
                <h2 class="text-xl font-bold text-white">جستجو در فیلم‌ها</h2>
              </div>
              <button 
                @click="closeModal"
                class="w-10 h-10 flex items-center justify-center text-yellow-400 hover:bg-yellow-400/10 rounded-full transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Search Input -->
            <div class="p-6 border-b border-yellow-400/10">
              <div class="relative">
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="نام فیلم، دسته‌بندی یا توضیحات را جستجو کنید..."
                  class="w-full px-6 py-4 pl-14 bg-zinc-800/50 border border-yellow-400/30 rounded-2xl text-white placeholder-yellow-200/60 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  @keydown.escape="closeModal"
                />
                <i class="ti ti-search absolute left-5 top-1/2 transform -translate-y-1/2 text-yellow-400 text-lg"></i>
                
                <!-- Clear Button -->
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-yellow-400 hover:bg-yellow-400/10 rounded-full transition-colors"
                >
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
              
              <!-- Quick Filters -->
              <div v-if="!searchQuery" class="flex flex-wrap gap-2 mt-4">
                <span class="text-yellow-200/70 text-sm">جستجو سریع:</span>
                <button
                  v-for="tag in quickTags"
                  :key="tag"
                  @click="searchQuery = tag"
                  class="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs hover:bg-yellow-400/20 transition-colors"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <!-- Search Results -->
            <div class="search-results max-h-96 overflow-y-auto">
              <!-- Loading State -->
              <div v-if="isSearching" class="flex items-center justify-center py-12">
                <div class="flex items-center gap-3 text-yellow-400">
                  <div class="animate-spin w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                  <span>در حال جستجو...</span>
                </div>
              </div>

              <!-- No Query State -->
              <div v-else-if="!searchQuery" class="p-8 text-center">
                <i class="ti ti-search text-6xl text-yellow-400/30 mb-4"></i>
                <h3 class="text-lg font-medium text-white mb-2">جستجوی هوشمند فیلم‌ها</h3>
                <p class="text-yellow-200/70 text-sm mb-6">فیلم، دسته‌بندی یا کلمه کلیدی مورد نظر خود را تایپ کنید</p>
                
                <!-- Popular Searches -->
                <div class="text-right">
                  <h4 class="text-sm font-medium text-yellow-400 mb-3">جستجوهای محبوب:</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="popular in popularSearches"
                      :key="popular.query"
                      @click="searchQuery = popular.query"
                      class="flex items-center gap-2 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors text-right"
                    >
                      <i :class="popular.icon" class="text-yellow-400"></i>
                      <div class="flex-1 text-right">
                        <div class="text-white text-sm">{{ popular.query }}</div>
                        <div class="text-yellow-200/50 text-xs">{{ popular.count }} فیلم</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- No Results -->
              <div v-else-if="filteredFilms.length === 0" class="p-8 text-center">
                <i class="ti ti-search-off text-4xl text-yellow-400/50 mb-4"></i>
                <h3 class="text-lg font-medium text-white mb-2">نتیجه‌ای یافت نشد</h3>
                <p class="text-yellow-200/70 text-sm">متأسفانه فیلمی با این نام پیدا نشد. لطفاً کلمات دیگری امتحان کنید.</p>
              </div>

              <!-- Results List -->
              <div v-else class="divide-y divide-yellow-400/10">
                <div
                  v-for="film in filteredFilms.slice(0, 8)"
                  :key="film.id"
                  @click="selectFilm(film)"
                  class="flex items-center gap-4 p-4 hover:bg-yellow-400/5 transition-colors cursor-pointer group"
                >
                  <img 
                    :src="film.poster" 
                    :alt="film.title"
                    class="w-16 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  >
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                      <span v-html="highlightText(film.title)"></span>
                    </h3>
                    <p class="text-yellow-200/70 text-sm mt-1 line-clamp-2">
                      <span v-html="highlightText(film.description)"></span>
                    </p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-yellow-200/50">
                      <span class="flex items-center gap-1">
                        <i class="ti ti-clock"></i>
                        {{ film.duration }}
                      </span>
                      <span class="flex items-center gap-1">
                        <i class="ti ti-star"></i>
                        {{ film.rating }}
                      </span>
                      <span class="flex items-center gap-1">
                        <i class="ti ti-tag"></i>
                        {{ film.category }}
                      </span>
                    </div>
                  </div>
                  <i class="ti ti-arrow-left text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>

                <!-- Show More Button -->
                <div v-if="filteredFilms.length > 8" class="p-4 text-center border-t border-yellow-400/10">
                  <button 
                    @click="showAllResults"
                    class="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                  >
                    مشاهده {{ filteredFilms.length - 8 }} نتیجه دیگر
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 bg-zinc-800/30 border-t border-yellow-400/10">
              <div class="flex items-center justify-between text-xs text-yellow-200/60">
                <span>{{ filteredFilms.length }} نتیجه یافت شد</span>
                <div class="flex items-center gap-4">
                  <span>↵ Enter برای انتخاب</span>
                  <span>Esc برای خروج</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Film {
  id: number
  title: string
  description: string
  poster: string
  duration: string
  rating: number
  category: string
}

interface Props {
  show: boolean
  films: Film[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  navigate: [path: string]
}>()

const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const isSearching = ref(false)

const quickTags = ref(['حیوانات وحشی', 'دلفین', 'نجات', 'مستند', 'آموزشی'])

const popularSearches = ref([
  { query: 'حیوانات وحشی', count: 25, icon: 'ti ti-deer' },
  { query: 'دلفین', count: 12, icon: 'ti ti-fish' },
  { query: 'نجات حیوانات', count: 18, icon: 'ti ti-heart' },
  { query: 'مستند طبیعت', count: 31, icon: 'ti ti-video' }
])

const filteredFilms = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  return props.films.filter(film =>
    film.title.toLowerCase().includes(query) ||
    film.description.toLowerCase().includes(query) ||
    film.category.toLowerCase().includes(query)
  )
})

const highlightText = (text: string) => {
  if (!searchQuery.value.trim()) return text
  
  const query = searchQuery.value.trim()
  // Escape special regex characters
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  
  // Only highlight if the text doesn't contain HTML-like patterns
  if (text.includes('<') || text.includes('>')) {
    return text
  }
  
  return text.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-300 rounded px-1">$1</mark>')
}

const closeModal = () => {
  emit('close')
  searchQuery.value = ''
}

const clearSearch = () => {
  searchQuery.value = ''
  searchInput.value?.focus()
}

const selectFilm = (film: Film) => {
  emit('navigate', `/player/${film.id}`)
  closeModal()
}

const showAllResults = () => {
  emit('navigate', `/movies?search=${encodeURIComponent(searchQuery.value)}`)
  closeModal()
}

// Simulate search loading
watch(searchQuery, () => {
  if (searchQuery.value.trim()) {
    isSearching.value = true
    setTimeout(() => {
      isSearching.value = false
    }, 300)
  }
})

// Focus input when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})
</script>

<style scoped>
/* Custom Scrollbar Styles */
.search-results {
  scrollbar-width: thin;
  scrollbar-color: rgba(250, 204, 21, 0.5) rgba(250, 204, 21, 0.1);
}

.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(250, 204, 21, 0.05);
  border-radius: 10px;
  margin: 8px 0;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(250, 204, 21, 0.3);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(250, 204, 21, 0.5);
}

.search-results::-webkit-scrollbar-thumb:active {
  background: rgba(250, 204, 21, 0.7);
}

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

:deep(mark) {
  background: rgba(250, 204, 21, 0.25);
  color: rgb(253, 230, 138);
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: 600;
}
</style>
