<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-bold text-gray-700">
        <i class="ti ti-video"></i>
        ویدیوی محصول (اختیاری)
      </label>
      
      <!-- Toggle between upload and link -->
      <div class="flex gap-2 bg-gray-100 rounded-lg p-1">
        <button
          @click="uploadMode = 'file'"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-bold transition-all',
            uploadMode === 'file' 
              ? 'bg-white text-teal-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <i class="ti ti-upload text-xs"></i>
          آپلود
        </button>
        <button
          @click="uploadMode = 'link'"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-bold transition-all',
            uploadMode === 'link' 
              ? 'bg-white text-teal-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          <i class="ti ti-link text-xs"></i>
          لینک
        </button>
      </div>
    </div>

    <!-- Upload Mode -->
    <div v-if="uploadMode === 'file'">
      <div v-if="!videoFile" class="relative">
        <input
          ref="fileInput"
          type="file"
          accept="video/*"
          @change="handleFileUpload"
          class="hidden"
        />
        <button
          @click="$refs.fileInput.click()"
          type="button"
          class="w-full p-8 border-2 border-dashed border-gray-300 hover:border-teal-500 bg-gray-50 hover:bg-teal-50 rounded-xl transition-all flex flex-col items-center justify-center gap-3"
        >
          <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <i class="ti ti-video-plus text-3xl text-teal-600"></i>
          </div>
          <div class="text-center">
            <p class="font-bold text-gray-900">آپلود ویدیو</p>
            <p class="text-sm text-gray-500 mt-1">فرمت‌های مجاز: MP4, MOV, AVI (حداکثر 100MB)</p>
          </div>
        </button>
      </div>

      <!-- Video Preview -->
      <div v-else class="relative rounded-xl overflow-hidden border-2 border-gray-200">
        <video
          :src="videoPreview"
          controls
          class="w-full max-h-96 bg-black"
        ></video>
        <button
          @click="removeVideo"
          type="button"
          class="absolute top-3 left-3 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg"
        >
          <i class="ti ti-trash text-white"></i>
        </button>
        <div class="absolute bottom-3 left-3 px-3 py-1.5 bg-gray-900/80 backdrop-blur rounded-lg text-white text-sm">
          {{ formatFileSize(videoFile.size) }}
        </div>
      </div>
    </div>

    <!-- Link Mode -->
    <div v-if="uploadMode === 'link'" class="space-y-4">
      <!-- Platform Selector -->
      <div class="flex gap-2">
        <button
          v-for="platform in platforms"
          :key="platform.id"
          @click="selectedPlatform = platform.id"
          type="button"
          :class="[
            'flex-1 p-4 border-2 rounded-xl transition-all',
            selectedPlatform === platform.id
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex flex-col items-center gap-2">
            <i :class="['text-2xl', platform.icon]"></i>
            <span class="text-sm font-bold">{{ platform.name }}</span>
          </div>
        </button>
      </div>

      <!-- Link Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ selectedPlatformName }} لینک
        </label>
        <div class="relative">
          <input
            v-model="videoLink"
            type="url"
            :placeholder="getLinkPlaceholder()"
            class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            @input="validateLink"
          />
          <i class="ti ti-link absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <p v-if="linkError" class="mt-2 text-sm text-red-600 flex items-center gap-1">
          <i class="ti ti-alert-circle"></i>
          {{ linkError }}
        </p>
        <p v-else-if="videoLink && isValidLink" class="mt-2 text-sm text-teal-600 flex items-center gap-1">
          <i class="ti ti-check"></i>
          لینک معتبر است
        </p>
      </div>

      <!-- Video Preview from Link -->
      <div v-if="videoLink && isValidLink && videoEmbedUrl" class="rounded-xl overflow-hidden border-2 border-gray-200">
        <div class="relative pb-[56.25%] bg-black">
          <iframe
            :src="videoEmbedUrl"
            class="absolute top-0 left-0 w-full h-full"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start gap-2 text-sm text-blue-700">
        <i class="ti ti-info-circle flex-shrink-0 mt-0.5"></i>
        <div>
          <p class="font-bold mb-1">راهنما:</p>
          <ul class="space-y-1 text-xs">
            <li>• ویدیو محصول به مشتریان کمک می‌کند محصول را بهتر بشناسند</li>
            <li>• برای یوتیوب: لینک کامل ویدیو را وارد کنید</li>
            <li>• برای آپارات: لینک تماشای ویدیو را کپی کنید</li>
            <li>• برای آپلود مستقیم: ویدیوهای کوتاه و با حجم کم توصیه می‌شود</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

// State
const uploadMode = ref('file') // 'file' | 'link'
const selectedPlatform = ref('youtube')
const videoFile = ref(null)
const videoPreview = ref(null)
const videoLink = ref('')
const linkError = ref('')
const isValidLink = ref(false)

const platforms = [
  { id: 'youtube', name: 'یوتیوب', icon: 'ti ti-brand-youtube text-red-600' },
  { id: 'aparat', name: 'آپارات', icon: 'ti ti-play-card text-purple-600' },
  { id: 'direct', name: 'لینک مستقیم', icon: 'ti ti-link text-blue-600' }
]

// Computed
const selectedPlatformName = computed(() => {
  return platforms.find(p => p.id === selectedPlatform.value)?.name || ''
})

const videoEmbedUrl = computed(() => {
  if (!videoLink.value || !isValidLink.value) return null
  
  const link = videoLink.value.trim()
  
  // YouTube
  if (selectedPlatform.value === 'youtube') {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = link.match(youtubeRegex)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }
  
  // Aparat
  if (selectedPlatform.value === 'aparat') {
    const aparatRegex = /aparat\.com\/v\/([a-zA-Z0-9]+)/
    const match = link.match(aparatRegex)
    if (match) {
      return `https://www.aparat.com/video/video/embed/videohash/${match[1]}/vt/frame`
    }
  }
  
  // Direct Link
  if (selectedPlatform.value === 'direct') {
    return link
  }
  
  return null
})

// Methods
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file size (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    alert('حجم فایل نباید بیشتر از 100 مگابایت باشد')
    return
  }
  
  videoFile.value = file
  videoPreview.value = URL.createObjectURL(file)
  
  emitValue()
}

const removeVideo = () => {
  if (videoPreview.value) {
    URL.revokeObjectURL(videoPreview.value)
  }
  videoFile.value = null
  videoPreview.value = null
  
  emitValue()
}

const validateLink = () => {
  const link = videoLink.value.trim()
  
  if (!link) {
    linkError.value = ''
    isValidLink.value = false
    emitValue()
    return
  }
  
  let regex
  let errorMsg
  
  switch (selectedPlatform.value) {
    case 'youtube':
      regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
      errorMsg = 'لینک یوتیوب معتبر نیست'
      break
    case 'aparat':
      regex = /^(https?:\/\/)?(www\.)?aparat\.com\/v\/[a-zA-Z0-9]+\/?$/
      errorMsg = 'لینک آپارات معتبر نیست. فرمت صحیح: aparat.com/v/xxxxx'
      break
    case 'direct':
      regex = /^https?:\/\/.+\.(mp4|mov|avi|webm)$/i
      errorMsg = 'لینک باید به فایل ویدیو (mp4, mov, avi, webm) ختم شود'
      break
  }
  
  if (regex.test(link)) {
    linkError.value = ''
    isValidLink.value = true
  } else {
    linkError.value = errorMsg
    isValidLink.value = false
  }
  
  emitValue()
}

const getLinkPlaceholder = () => {
  switch (selectedPlatform.value) {
    case 'youtube':
      return 'https://youtube.com/watch?v=...'
    case 'aparat':
      return 'https://aparat.com/v/xxxxx'
    case 'direct':
      return 'https://example.com/video.mp4'
    default:
      return ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const emitValue = () => {
  const value = {
    mode: uploadMode.value,
    file: videoFile.value,
    link: videoLink.value,
    platform: selectedPlatform.value,
    isValid: uploadMode.value === 'file' ? !!videoFile.value : isValidLink.value,
    embedUrl: videoEmbedUrl.value
  }
  emit('update:modelValue', value)
}

// Watch for platform changes
watch(selectedPlatform, () => {
  if (videoLink.value) {
    validateLink()
  }
})

// Watch for upload mode changes
watch(uploadMode, () => {
  emitValue()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
