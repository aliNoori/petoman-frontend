<template>
  <Teleport to="body">
    <div 
      v-if="item"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
      @click="handleBackdropClick"
    >
      <!-- Modal Container -->
      <div 
        ref="modalRef"
        class="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center space-x-reverse space-x-3">
            <span :class="getCategoryBadgeClass(item.category)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ getCategoryName(item.category) }}
            </span>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="item.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="item.type === 'image'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              {{ item.type === 'image' ? 'تصویر' : 'ویدیو' }}
            </span>
          </div>
          
          <button 
            @click="$emit('close')"
            class="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex flex-col lg:flex-row">
          <!-- Media Section -->
          <div class="flex-1 bg-gray-50 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
            <!-- Image -->
            <img
              v-if="item.type === 'image'"
              :src="item.url"
              :alt="item.title"
              class="max-w-full max-h-full object-contain"
              @load="handleImageLoad"
            />
            
            <!-- Video -->
            <video
              v-else
              :src="item.url"
              controls
              class="max-w-full max-h-full"
              @loadeddata="handleVideoLoad"
            >
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </div>

          <!-- Info Section -->
          <div class="w-full lg:w-96 border-t lg:border-t-0 lg:border-r border-gray-200">
            <div class="p-6 h-full overflow-y-auto">
              <!-- Title and Description -->
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900 mb-3">{{ item.title }}</h2>
                <p class="text-gray-600 leading-relaxed">{{ item.description }}</p>
              </div>

              <!-- Stats -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                <div class="text-center">
                  <div class="flex items-center justify-center text-red-500 mb-1">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ item.likes || 0 }}</div>
                  <div class="text-xs text-gray-600">لایک</div>
                </div>
                
                <div class="text-center">
                  <div class="flex items-center justify-center text-rose-500 mb-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                    </svg>
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ shareCount }}</div>
                  <div class="text-xs text-gray-600">اشتراک</div>
                </div>
                
                <div class="text-center">
                  <div class="flex items-center justify-center text-rose-600 mb-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                  <div class="text-lg font-semibold text-gray-900">{{ viewCount }}</div>
                  <div class="text-xs text-gray-600">بازدید</div>
                </div>
              </div>

              <!-- Date -->
              <div class="flex items-center text-sm text-gray-500 mb-6">
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(item.createdAt) }}
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button 
                  @click="toggleLike"
                  :class="[
                    'w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-colors',
                    isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  <svg class="w-5 h-5 ml-2" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  {{ isLiked ? 'لایک شده' : 'لایک کردن' }}
                </button>

                <button 
                  @click="shareItem"
                  class="w-full flex items-center justify-center px-4 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
                >
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  اشتراک‌گذاری
                </button>

                <button 
                  @click="downloadItem"
                  class="w-full flex items-center justify-center px-4 py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors"
                >
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  دانلود
                </button>
              </div>

              <!-- Tags -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-3">برچسب‌ها</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in tags" 
                    :key="tag"
                    class="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded-full"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface MediaItem {
  id: number
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title: string
  description: string
  category: string
  createdAt: string
  likes?: number
}

interface Props {
  item: MediaItem | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Reactive data
const isLiked = ref(false)
const shareCount = ref(42)
const viewCount = ref(1234)
const modalRef = ref<HTMLElement>()

// Tags (mock data)
const tags = ['نجات', 'درمان', 'حیوانات', 'پتومن', 'مهربانی']

// Categories
const categories = [
  { id: 'all', name: 'همه' },
  { id: 'rescue', name: 'نجات' },
  { id: 'medical', name: 'درمان' },
  { id: 'care', name: 'مراقبت' },
  { id: 'shelter', name: 'سرپناه' },
  { id: 'adoption', name: 'فرزندخواندگی' }
]

// Methods
const getCategoryName = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || 'نامشخص'
}

const getCategoryBadgeClass = (categoryId: string) => {
  const classes = {
    rescue: 'bg-green-100 text-green-800',
    medical: 'bg-red-100 text-red-800',
    care: 'bg-blue-100 text-blue-800',
    shelter: 'bg-yellow-100 text-yellow-800',
    adoption: 'bg-purple-100 text-purple-800'
  }
  return classes[categoryId as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('fa-IR', options)
}

const handleBackdropClick = () => {
  emit('close')
}

const handleImageLoad = () => {
  // Handle image load
}

const handleVideoLoad = () => {
  // Handle video load
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  // Here you would typically make an API call
}

const shareItem = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'عنوان محتوا',
        text: 'توضیحات محتوا',
        url: window.location.href
      })
    } catch (error) {
      console.log('خطا در اشتراک‌گذاری:', error)
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    await navigator.clipboard.writeText(window.location.href)
    // Show toast notification
  }
  shareCount.value++
}

const downloadItem = () => {
  // Create a temporary link and trigger download
  const link = document.createElement('a')
  link.href = 'item.url' // This should be the actual item URL
  link.download = 'filename' // This should be the actual filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  // Restore body scroll
  document.body.style.overflow = ''
})
</script>
