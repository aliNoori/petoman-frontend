<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="ti ti-loader animate-spin text-4xl text-rose-600 mb-4"></i>
        <p class="text-gray-600">در حال بارگذاری مستند...</p>
      </div>
    </div>

    <!-- Video Not Found -->
    <div v-else-if="!video" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="ti ti-video-off text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">مستند یافت نشد</h2>
        <p class="text-gray-600 mb-6">مستند مورد نظر شما وجود ندارد یا حذف شده است.</p>
        <NuxtLink 
          to="/documentaries"
          class="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
        >
          <i class="ti ti-arrow-right text-lg ml-3"></i>
          بازگشت به مستندات
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="min-h-screen pt-[73px]">
      <!-- Back Button (در همان خط با ویدیو) -->
      <div class="bg-gradient-to-b from-black to-transparent absolute top-[73px] left-0 right-0 z-10 pt-6">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <NuxtLink 
            to="/documentaries" 
            class="inline-flex items-center space-x-reverse space-x-2 text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all px-4 py-2 rounded-xl"
          >
            <i class="ti ti-arrow-right text-lg"></i>
            <span class="font-medium">بازگشت</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Video Player Section -->
      <div class="py-8 bg-black">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
            <video
              ref="videoPlayer"
              class="w-full h-full"
              :poster="video.thumbnail"
              controls
              preload="metadata"
              @loadeddata="onVideoLoaded"
            >
              <source :src="video.videoUrl" type="video/mp4">
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
            <!-- Play Button Overlay -->
            <div v-if="!videoLoaded" class="absolute inset-0 flex items-center justify-center">
              <button class="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center text-white hover:bg-rose-700 transition-colors">
                <i class="ti ti-player-play text-2xl mr-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="py-16">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Title and Meta -->
              <div class="mb-8">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {{ video.title }}
                </h1>
                
                <div class="flex flex-wrap items-center gap-6 text-gray-600">
                  <div class="flex items-center space-x-reverse space-x-2">
                    <i class="ti ti-calendar text-rose-600"></i>
                    <span>{{ formatDate(video.publishDate) }}</span>
                  </div>
                  <div class="flex items-center space-x-reverse space-x-2">
                    <i class="ti ti-eye text-rose-600"></i>
                    <span>{{ video.views.toLocaleString('fa-IR') }} بازدید</span>
                  </div>
                  <div class="flex items-center space-x-reverse space-x-2">
                    <i class="ti ti-clock text-rose-600"></i>
                    <span>{{ video.duration }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-8">
                <h2 class="text-xl font-bold text-gray-900 mb-4">درباره این مستند</h2>
                <p class="text-gray-700 leading-relaxed text-lg mb-6">
                  {{ video.description }}
                </p>
                
                <!-- Story Section (if available) -->
                <div v-if="video.story" class="mt-6 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
                  <h3 class="text-lg font-bold text-rose-900 mb-3 flex items-center">
                    <i class="ti ti-heart text-rose-600 ml-2"></i>
                    داستان پشت صحنه
                  </h3>
                  <p class="text-rose-800 leading-relaxed">
                    {{ video.story }}
                  </p>
                </div>
              </div>

              <!-- Tags -->
              <div class="mb-8">
                <h3 class="text-lg font-bold text-gray-900 mb-4">برچسب‌ها</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in video.tags" 
                    :key="tag"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    # {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Share Section -->
              <div class="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 class="text-lg font-bold text-gray-900 mb-4">اشتراک‌گذاری</h3>
                <div class="flex items-center space-x-reverse space-x-4">
                  <button @click="shareVideo" class="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                    <i class="ti ti-share text-lg ml-2"></i>
                    اشتراک‌گذاری
                  </button>
                  <button @click="copyVideoLink" class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <i class="ti ti-copy text-lg ml-2"></i>
                    کپی لینک
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-8">
              <div v-if="relatedVideos.length > 0">
                <h3 class="text-xl font-bold text-gray-900 mb-6">ویدیوهای مرتبط</h3>
                <div class="space-y-4">
                  <NuxtLink
                    v-for="relatedVideo in relatedVideos"
                    :key="relatedVideo.id"
                    :to="`/documentaries/${relatedVideo.id}`"
                    class="group flex gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <div class="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        :src="relatedVideo.thumbnail"
                        :alt="relatedVideo.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div class="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                        {{ relatedVideo.duration }}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-semibold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2 mb-1">
                        {{ relatedVideo.title }}
                      </h4>
                      <p class="text-xs text-gray-500">
                        {{ relatedVideo.views.toLocaleString('fa-IR') }} بازدید
                      </p>
                    </div>
                  </NuxtLink>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCategoryStore} from "~/stores/category.ts";

const route = useRoute()
const videoId = computed(() => route.params.id as string)

const { getVideoById, getRelatedVideos } = useVideoData()

const pending = ref(true)
const videoPlayer = ref<HTMLVideoElement>()
const videoLoaded = ref(false)

// Get video data
const video = computed(() => {
  const foundVideo = getVideoById(videoId.value)
  console.log('Loading video with ID:', videoId.value, 'Found:', foundVideo)
  return foundVideo
})

const relatedVideos = computed(() => {
  if (!video.value) return []
  return getRelatedVideos(video.value.id, 4)
})
const categoryStore=useCategoryStore()
const categories=computed(()=>categoryStore.categories)
/*
const categories = {
  'all': 'همه',
  'rescue': 'نجات اضطراری',
  'treatment': 'درمان و توانبخشی',
  'success': 'داستان‌های موفقیت',
  'shelter': 'پناهگاه و نگهداری',
  'training': 'آموزش و آگاهی'
}
*/

// SEO
useSeoMeta({
  title: () => video.value ? `${video.value.title} - مستندات پتومن` : 'مستند - پتومن',
  description: () => video.value?.description || 'مشاهده مستندات نجات و مراقبت از حیوانات',
  ogTitle: () => video.value ? `${video.value.title} - مستندات پتومن` : 'مستند - پتومن',
  ogDescription: () => video.value?.description || 'مشاهده مستندات نجات و مراقبت از حیوانات',
  ogImage: () => video.value?.thumbnail || '',
  ogType: 'video.other'
})

// Functions
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

const onVideoLoaded = () => {
  videoLoaded.value = true
}

const shareVideo = async () => {
  if (!video.value) return
  
  const shareData = {
    title: video.value.title,
    text: video.value.description,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyVideoLink()
    }
  } catch (error) {
    console.log('Error sharing:', error)
  }
}

const copyVideoLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('لینک ویدیو کپی شد!')
  } catch (error) {
    console.log('Error copying to clipboard:', error)
    // Fallback
    const textArea = document.createElement('textarea')
    textArea.value = window.location.href
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('لینک ویدیو کپی شد!')
  }
}

// Lifecycle
onMounted(() => {
  // Simulate loading time
  setTimeout(() => {
    pending.value = false
  }, 800)
  
  // Log for debugging
  console.log('Video ID from route:', videoId.value)
  console.log('Video found:', video.value)
})

// Handle 404 for missing videos
watch(video, (newVideo) => {
  if (!pending.value && !newVideo) {
    throw createError({
      statusCode: 404,
      statusMessage: `مستند با شناسه ${videoId.value} یافت نشد`
    })
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