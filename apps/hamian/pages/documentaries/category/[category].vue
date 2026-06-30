<template>
  <div class="min-h-screen bg-gray-50 pt-[73px]">
    <!-- Category Not Found -->
    <div v-if="!category && !pending" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <i class="ti ti-folder-off text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">دسته‌بندی یافت نشد</h2>
        <p class="text-gray-600 mb-6">دسته‌بندی مورد نظر شما وجود ندارد.</p>
        <NuxtLink 
          to="/documentaries"
          class="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
        >
          <i class="ti ti-arrow-right text-lg ml-3"></i>
          بازگشت به مستندات
        </NuxtLink>
      </div>
    </div>

    <!-- Category Content -->
    <div v-else-if="category">
      <!-- Category Hero - Clean -->
      <section class="relative bg-gradient-to-b from-rose-50 to-white py-20 overflow-hidden min-h-[450px] flex items-center">
        <!-- Decorative Pattern -->
        <div class="absolute inset-0 overflow-hidden opacity-[0.05] pointer-events-none">
          <i class="ti ti-movie absolute top-12 left-20 text-rose-400 text-6xl rotate-6"></i>
          <i class="ti ti-heart absolute top-20 right-16 text-rose-400 text-7xl -rotate-12"></i>
          <i class="ti ti-paw absolute bottom-16 left-1/3 text-rose-300 text-5xl rotate-45"></i>
          <i class="ti ti-video absolute bottom-12 right-1/4 text-rose-400 text-6xl -rotate-6"></i>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
          <div class="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i :class="[category.icon, 'text-rose-600 text-3xl']"></i>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ category.name }}
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {{ category.description }}
          </p>
          <div class="flex items-center justify-center space-x-reverse space-x-8 text-sm text-gray-500">
            <span class="flex items-center">
              <i class="ti ti-video text-lg ml-2"></i>
              {{ filteredVideos.length }} مستند
            </span>
            <span class="flex items-center">
              <i class="ti ti-eye text-lg ml-2"></i>
              {{ totalViews.toLocaleString('fa-IR') }} بازدید
            </span>
          </div>
        </div>
      </section>

      <!-- Search and Sort -->
      <section class="py-8 bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex-1 max-w-md">
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="جستجو در این دسته‌بندی..."
                  class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                <i class="ti ti-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            
            <div class="flex items-center space-x-reverse space-x-4">
              <select v-model="sortBy" class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500">
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی‌ترین</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="duration">مدت زمان</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Videos Grid -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- No Results -->
          <div v-if="filteredVideos.length === 0" class="text-center py-16">
            <i class="ti ti-search-off text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-900 mb-2">نتیجه‌ای یافت نشد</h3>
            <p class="text-gray-600 mb-4">متأسفانه مستندی با این مشخصات پیدا نشد.</p>
            <button 
              @click="searchQuery = ''"
              class="text-rose-600 hover:text-rose-700 font-medium"
            >
              پاک کردن جستجو
            </button>
          </div>

          <!-- Videos -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              v-for="video in filteredVideos"
              :key="video.id"
              class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              <NuxtLink :to="`/documentaries/${video.id}`" class="block">
                <div class="relative aspect-video overflow-hidden">
                  <img
                    :src="video.thumbnail"
                    :alt="video.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  
                  <!-- Duration Badge -->
                  <div class="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {{ video.duration }}
                  </div>
                  
                  <!-- Play Button -->
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                      <i class="ti ti-player-play text-2xl text-gray-900 mr-1"></i>
                    </div>
                  </div>
                </div>
                
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-700 transition-colors line-clamp-2">
                    {{ video.title }}
                  </h3>
                  <p class="text-gray-600 mb-4 line-clamp-3">
                    {{ video.description }}
                  </p>
                  
                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span 
                      v-for="tag in video.tags.slice(0, 3)" 
                      :key="tag"
                      class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>{{ formatDate(video.publishDate) }}</span>
                    <div class="flex items-center space-x-reverse space-x-2">
                      <i class="ti ti-eye text-sm"></i>
                      <span>{{ video.views.toLocaleString('fa-IR') }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>

      <!-- Other Categories -->
      <section class="py-16 bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">سایر دسته‌بندی‌ها</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="cat in otherCategories"
              :key="cat.id"
              :to="`/documentaries/category/${cat.id}`"
              class="group p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 text-center"
            >
              <div class="w-12 h-12 bg-gray-100 group-hover:bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <i :class="[cat.icon, 'text-gray-600 group-hover:text-rose-600 text-lg transition-colors']"></i>
              </div>
              <h4 class="font-medium text-gray-900 text-sm mb-1">{{ cat.name }}</h4>
              <span class="text-xs text-gray-500">{{ cat.count }} ویدیو</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const route = useRoute()
const categoryId = computed(() => route.params.category as string)

const { 
  getCategoryById, 
  getVideosByCategory, 
  getCategoriesWithCount,
  searchVideos 
} = useVideoData()

const pending = ref(true)
const searchQuery = ref('')
const sortBy = ref('newest')

const category = computed(() => {
  if (categoryId.value === 'all') return null
  return getCategoryById(categoryId.value)
})

const categoryVideos = computed(() => {
  return getVideosByCategory(categoryId.value)
})

const filteredVideos = computed(() => {
  let videos = categoryVideos.value
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    videos = videos.filter(video => 
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Sort videos
  if (sortBy.value === 'newest') {
    videos = videos.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  } else if (sortBy.value === 'oldest') {
    videos = videos.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
  } else if (sortBy.value === 'popular') {
    videos = videos.sort((a, b) => b.views - a.views)
  } else if (sortBy.value === 'duration') {
    videos = videos.sort((a, b) => {
      const getDurationSeconds = (duration: string) => {
        const [minutes, seconds] = duration.split(':').map(Number)
        return minutes * 60 + seconds
      }
      return getDurationSeconds(b.duration) - getDurationSeconds(a.duration)
    })
  }
  
  return videos
})

const totalViews = computed(() => {
  return categoryVideos.value.reduce((total, video) => total + video.views, 0)
})

const otherCategories = computed(() => {
  return getCategoriesWithCount().filter(cat => 
    cat.id !== categoryId.value && cat.id !== 'all'
  )
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// SEO
useSeoMeta({
  title: () => category.value ? `${category.value.name} - مستندات پتومن` : 'مستندات - پتومن',
  description: () => category.value?.description || 'مشاهده مستندات نجات و مراقبت از حیوانات',
  ogTitle: () => category.value ? `${category.value.name} - مستندات پتومن` : 'مستندات - پتومن',
  ogDescription: () => category.value?.description || 'مشاهده مستندات نجات و مراقبت از حیوانات'
})

// Handle category not found
watch(categoryId, () => {
  if (categoryId.value !== 'all' && !category.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'دسته‌بندی یافت نشد'
    })
  }
}, { immediate: true })

onMounted(() => {
  setTimeout(() => {
    pending.value = false
  }, 500)
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
