<template>
  <div class="bg-zinc-900 rounded-2xl overflow-visible shadow-2xl relative z-20">
    <!-- Video Player -->
    <div class="relative w-full bg-black rounded-t-2xl overflow-hidden" style="aspect-ratio: 16/9;">
      <!-- Video Player -->
      <video
        ref="videoElement"
        class="w-full h-full object-cover"
        preload="metadata"
        :src="props.videoConfig.url"
        :poster="props.videoConfig.poster"
        @loadedmetadata="onVideoLoaded"
        @timeupdate="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @loadstart="onLoadStart"
        @canplay="onCanPlay"
        @progress="onProgress"
        @error="onError"
        crossorigin="anonymous"
      >
        <source :src="hlsSource" :type="getVideoType(hlsSource)">
        <p class="text-yellow-400 text-center py-8">
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </p>
      </video>

      <!-- Ad overlay -->
      <div v-if="isPlayingAd && currentAd" class="ad-overlay absolute inset-0 z-[100] transition-opacity duration-300">
        <!-- Ad info bar -->
        <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-[101]">
          <div class="flex items-center gap-3 px-4 py-2 bg-black/90 backdrop-blur-sm rounded-xl border border-red-500/50">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-red-400 font-bold text-sm">تبلیغات</span>
            <span class="text-red-200/80 text-sm">{{ adTimeFormatted }}</span>
          </div>

          <!-- Skip button -->
          <button
            v-if="showSkipButton"
            @click="skipAd"
            class="px-4 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all duration-300 text-sm shadow-lg"
          >
            <i class="ti ti-player-skip-forward mr-1"></i>
            رد کردن تبلیغ
          </button>
          <div v-else-if="currentAd?.skipAfter && !canSkipAd" class="px-4 py-2 bg-zinc-800/90 text-yellow-200 rounded-xl text-sm border border-zinc-600">
            رد کردن در {{ Math.max(0, Math.ceil((currentAd?.skipAfter || 0) - currentTime)) }} ثانیه
          </div>
        </div>

        <!-- Ad progress bar -->
        <div class="absolute bottom-4 left-4 right-4 z-[101]">
          <div class="w-full bg-zinc-700/90 rounded-full h-2 border border-red-500/30">
            <div
              class="h-full bg-gradient-to-l from-red-500 to-red-400 rounded-full transition-all duration-300"
              :style="{ width: `${adProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Controls -->
    <div class="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border-t border-yellow-400/10">
      <!-- Top Row Controls -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-6">
          <!-- Play/Pause -->
          <button
            @click="togglePlay"
            :disabled="isPlayingAd"
            :class="[
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg',
              isPlayingAd 
                ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400'
            ]"
          >
            <i :class="isPlaying ? 'ti ti-player-pause-filled' : 'ti ti-player-play-filled'" class="text-2xl"></i>
          </button>

          <!-- Time Display -->
          <div class="flex items-center gap-3 text-yellow-400 font-mono text-lg">
            <span>{{ formatTime(currentTime) }}</span>
            <span class="text-yellow-200/50">/</span>
            <span class="text-yellow-200/80">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Volume Control -->
          <div class="flex items-center gap-3">
            <button
              @click="toggleMute"
              class="text-yellow-400 hover:text-yellow-300 transition-colors p-2 hover:bg-yellow-400/10 rounded-lg"
            >
              <i :class="getVolumeIcon()" class="text-xl"></i>
            </button>
            <div class="relative group">
              <input
                v-model="volume"
                type="range"
                min="0"
                max="100"
                class="w-24 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                @input="updateVolume"
              />
            </div>
            <span class="text-yellow-400 text-sm font-medium min-w-[2.5rem]">{{ volume }}%</span>
          </div>

          <!-- Fullscreen -->
          <button
            @click="toggleFullscreen"
            class="text-yellow-400 hover:text-yellow-300 transition-colors p-2 hover:bg-yellow-400/10 rounded-lg"
          >
            <i :class="isFullscreen ? 'ti ti-minimize' : 'ti ti-maximize'" class="text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="!isPlayingAd" class="relative mb-6 group cursor-pointer" @click="seekToPosition">
        <div class="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
          <!-- Buffer Progress -->
          <div
            class="absolute top-0 right-0 h-full bg-zinc-600 transition-all duration-300"
            :style="{ width: `${bufferProgress}%` }"
          ></div>
          <!-- Play Progress -->
          <div
            class="relative h-full bg-gradient-to-l from-yellow-400 to-yellow-500 transition-all duration-100 rounded-full"
            :style="{ width: `${playProgress}%` }"
          >
            <!-- Progress Handle -->
            <div class="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
          </div>
        </div>

        <!-- Preview on hover -->
        <div
          v-if="showPreview"
          class="absolute bottom-full mb-2 px-3 py-1 bg-zinc-900/95 backdrop-blur-sm border border-yellow-400/30 rounded-lg text-yellow-400 text-sm font-medium pointer-events-none transform -translate-x-1/2"
          :style="{ left: `${previewPosition}%` }"
        >
          {{ formatTime(previewTime) }}
        </div>
      </div>

      <!-- Ad progress indicator -->
      <div v-else class="relative mb-6">
        <div class="text-center text-yellow-400 text-sm mb-2">
          تبلیغ در حال پخش - {{ adTimeFormatted }} باقی مانده
        </div>
        <div class="w-full bg-zinc-700 rounded-full h-2">
          <div
            class="h-full bg-gradient-to-l from-red-500 to-red-400 rounded-full transition-all duration-300"
            :style="{ width: `${adProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Bottom Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Quality Dropdown -->
          <div v-if="!isPlayingAd" class="relative" ref="qualityDropdownRef">
            <button
              @click="toggleQuality"
              class="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 border border-yellow-400/30 rounded-xl text-yellow-200 hover:border-yellow-400/60 transition-all duration-300 min-w-[120px]"
            >
              <i class="ti ti-settings text-yellow-400"></i>
              <span class="font-medium">{{ selectedQuality }}p</span>
              <i :class="['ti ti-chevron-down transition-transform duration-300', { 'rotate-180': showQuality }]" class="text-yellow-400"></i>
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
                v-if="showQuality"
                class="absolute z-[200] bottom-full left-0 mb-2 bg-zinc-900/98 backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl overflow-visible min-w-[180px] max-h-[300px] overflow-y-auto"
                style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); transform: translateZ(0); backdrop-filter: blur(20px);"
              >
                <ul class="py-2">
                  <li
                    v-for="quality in availableQualities"
                    :key="quality.value"
                    @click="selectQuality(quality.value)"
                    :class="[
                      'px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3',
                      selectedQuality === quality.value 
                        ? 'bg-yellow-400/20 text-yellow-400' 
                        : 'text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-400'
                    ]"
                  >
                    <i :class="quality.icon" class="text-lg"></i>
                    <span class="font-medium">{{ quality.label }}</span>
                    <i v-if="selectedQuality === quality.value" class="ti ti-check mr-auto text-yellow-400"></i>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>

          <!-- Speed Dropdown -->
          <div v-if="!isPlayingAd" class="relative" ref="speedDropdownRef">
            <button
              @click="toggleSpeed"
              class="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 border border-yellow-400/30 rounded-xl text-yellow-200 hover:border-yellow-400/60 transition-all duration-300 min-w-[100px]"
            >
              <i class="ti ti-player-track-next text-yellow-400"></i>
              <span class="font-medium">{{ selectedSpeed }}x</span>
              <i :class="['ti ti-chevron-down transition-transform duration-300', { 'rotate-180': showSpeed }]" class="text-yellow-400"></i>
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
                v-if="showSpeed"
                class="absolute z-[200] bottom-full left-0 mb-2 bg-zinc-900/98 backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl overflow-visible min-w-[140px] max-h-[250px] overflow-y-auto"
                style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); transform: translateZ(0); backdrop-filter: blur(20px);"
              >
                <ul class="py-2">
                  <li
                    v-for="speed in availableSpeeds"
                    :key="speed.value"
                    @click="selectSpeed(speed.value)"
                    :class="[
                      'px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3',
                      selectedSpeed === speed.value 
                        ? 'bg-yellow-400/20 text-yellow-400' 
                        : 'text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-400'
                    ]"
                  >
                    <i :class="speed.icon" class="text-lg"></i>
                    <span class="font-medium">{{ speed.label }}</span>
                    <i v-if="selectedSpeed === speed.value" class="ti ti-check mr-auto text-yellow-400"></i>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>

          <!-- Subtitle Toggle -->
          <div v-if="!isPlayingAd" class="relative" ref="subtitleDropdownRef">
            <button
              @click="toggleSubtitles"
              :class="[
                'flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-300',
                subtitlesEnabled 
                  ? 'bg-yellow-400/20 border-yellow-400/60 text-yellow-400' 
                  : 'bg-zinc-800/60 border-yellow-400/30 text-yellow-200 hover:border-yellow-400/60'
              ]"
            >
              <i class="ti ti-subtitles"></i>
              <span class="font-medium">زیرنویس</span>
              <i :class="['ti ti-chevron-down transition-transform duration-300', { 'rotate-180': showSubtitles }]" class="text-yellow-400"></i>
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
                v-if="showSubtitles"
                class="absolute z-[200] bottom-full left-0 mb-2 bg-zinc-900/98 backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl overflow-visible min-w-[160px] max-h-[200px] overflow-y-auto"
                style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); transform: translateZ(0); backdrop-filter: blur(20px);"
              >
                <ul class="py-2">
                  <li
                    @click="selectSubtitle(null)"
                    :class="[
                      'px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3',
                      selectedSubtitle === null 
                        ? 'bg-yellow-400/20 text-yellow-400' 
                        : 'text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-400'
                    ]"
                  >
                    <i class="ti ti-x text-lg"></i>
                    <span class="font-medium">بدون زیرنویس</span>
                    <i v-if="selectedSubtitle === null" class="ti ti-check mr-auto text-yellow-400"></i>
                  </li>
                  <li
                    v-for="subtitle in availableSubtitles"
                    :key="subtitle.id"
                    @click="selectSubtitle(subtitle.id)"
                    :class="[
                      'px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3',
                      selectedSubtitle === subtitle.id 
                        ? 'bg-yellow-400/20 text-yellow-400' 
                        : 'text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-400'
                    ]"
                  >
                    <i class="ti ti-language text-lg"></i>
                    <span class="font-medium">{{ subtitle.label }}</span>
                    <i v-if="selectedSubtitle === subtitle.id" class="ti ti-check mr-auto text-yellow-400"></i>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Additional Controls -->
        <div class="flex items-center gap-3">
          <!-- Download -->
          <button
            @click="downloadVideo"
            class="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 border border-yellow-400/30 rounded-xl text-yellow-200 hover:border-yellow-400/60 hover:text-yellow-400 transition-all duration-300"
          >
            <i class="ti ti-download text-lg"></i>
            <span class="font-medium">دانلود</span>
          </button>

          <!-- Picture in Picture -->
          <button
            @click="togglePiP"
            class="p-3 text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all duration-300"
            title="Picture in Picture"
          >
            <i class="ti ti-picture-in-picture text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, nextTick, computed, onBeforeUnmount} from 'vue'
import {useMediaStore} from "~/stores/media";
import {usePlayerStore} from "~/stores/player";
const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
}>()
// Interfaces
interface VideoJSPlayer {
  ready: (fn: () => void) => void
  on: (event: string, handler: () => void) => void
  play: () => Promise<void>
  pause: () => void
  currentTime: (time?: number) => number
  duration: () => number
  volume: (value?: number) => number
  muted: (value?: boolean) => boolean
  isFullscreen: () => boolean
  requestFullscreen: () => void
  exitFullscreen: () => void
  buffered: () => TimeRanges
  playbackRate: (rate?: number) => number
  dispose: () => void
  tech: () => any
  textTracks: () => any
  addRemoteTextTrack: (options: any, manualCleanup?: boolean) => any
  el: () => HTMLElement
}

interface VideoJSStatic {
  (element: HTMLVideoElement, options: any): VideoJSPlayer
  options: any
}

interface AdConfig {
  id: string
  url: string
  duration: number
  skipAfter?: number
  position: 'preroll' | 'midroll' | 'postroll'
  timing?: number // For midroll ads - when to show (in seconds)
}

interface VideoConfig {
  mediaId:string,
  mediaType:string
  url: string
  resumeTime?: number
  title: string
  poster?: string
  ads?: AdConfig[]
  subtitles?: SubtitleTrack[]
}

interface SubtitleTrack {
  id: string
  label: string
  language: string
  url: string
  default?: boolean
}

// Props
interface Props {
  videoConfig: VideoConfig
}

const props = withDefaults(defineProps<Props>(), {
  videoConfig: () => ({
    mediaId:'',
    mediaType:'',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    resumeTime:0,
    title: 'ویدیوی آموزشی',
    subtitles: [
      {
        id: 'fa',
        label: 'فارسی',
        language: 'fa',
        url: '/subtitles/sample-fa.vtt',
        default: true
      },
      {
        id: 'en',
        label: 'English',
        language: 'en',
        url: '/subtitles/sample-en.vtt'
      }
    ],
    ads: [
      {
        id: 'ad1',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 30,
        skipAfter: 5,
        position: 'preroll'
      },
      {
        id: 'ad2',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        duration: 15,
        position: 'midroll',
        timing: 120 // Show at 2 minutes
      }
    ]
  })
})

watch(
    () => props.videoConfig?.url,
    async (newUrl, oldUrl) => {
      console.log('newUrl',newUrl)
      if (!newUrl || newUrl === oldUrl) return

      resumeApplied = false

      await nextTick()

      const video = videoElement.value
      if (!video) return

      video.pause()
      video.load()

      try {
        await video.play()
      } catch (e) {
        console.warn('Autoplay blocked:', e)
      }
    }
)

// Types
declare global {
  interface Window {
    videojs: VideoJSStatic
  }
}

// Video.js imports (will be loaded via CDN)
let videojs: VideoJSStatic | null = null
let player: VideoJSPlayer | null = null
let resumeApplied = false

// Reactive variables
const videoElement = ref<HTMLVideoElement>()
const isLoading = ref(true)
const loadingProgress = ref(0)
const isPlaying = ref(false)
const isPaused = ref(true)
const isMuted = ref(false)
const isFullscreen = ref(false)
const isLive = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(80)
const bufferProgress = ref(0)
const playProgress = ref(0)
const selectedQuality = ref(720)
const selectedSpeed = ref(1)
const subtitlesEnabled = ref(false)
const selectedSubtitle = ref<string | null>(null)
const availableSubtitles = ref<SubtitleTrack[]>([])

// Ad system variables
const isPlayingAd = ref(false)
const currentAd = ref<AdConfig | null>(null)
const adTimeRemaining = ref(0)
const canSkipAd = ref(false)
const adProgress = ref(0)
const playedAds = ref<string[]>([])
const adQueue = ref<AdConfig[]>([])

// Preview variables
const showPreview = ref(false)
const previewPosition = ref(0)
const previewTime = ref(0)

// Dropdown states
const showQuality = ref(false)
const showSpeed = ref(false)
const showSubtitles = ref(false)
const qualityDropdownRef = ref<HTMLElement>()
const speedDropdownRef = ref<HTMLElement>()
const subtitleDropdownRef = ref<HTMLElement>()


const mediaStore=useMediaStore()

const route = useRoute()

const media = computed(() => ({
  id: props.videoConfig.mediaId as string,
  type: props.videoConfig.mediaType//route.params.type as 'movie' | 'series'
}))

let lastSavedProgress = 0

const saveProgress = (reason: 'play' | 'pause' | 'ended') => {
  if (!videoElement.value || !videoElement.value.duration) return

  const progress = Math.floor(
      (videoElement.value.currentTime / videoElement.value.duration) * 100
  )

  if (Math.abs(progress - lastSavedProgress) < 3) return

  lastSavedProgress = progress

  mediaStore.updateWatched(
      media.value.id,
      media.value.type,
      videoElement.value.currentTime,
      videoElement.value.duration,
  )
}


// Available options
const availableQualities = ref<Array<{value: number, label: string, icon: string, levelIndex?: number}>>([
  { value: 240, label: '240p', icon: 'ti ti-device-mobile' },
  { value: 360, label: '360p', icon: 'ti ti-device-tablet' },
  { value: 480, label: '480p SD', icon: 'ti ti-device-laptop' },
  { value: 720, label: '720p HD', icon: 'ti ti-device-desktop' },
  { value: 1080, label: '1080p FHD', icon: 'ti ti-device-tv' },
  { value: 1440, label: '1440p QHD', icon: 'ti ti-device-tv' },
  { value: 2160, label: '4K UHD', icon: 'ti ti-device-tv' }
])

const availableSpeeds = ref([
  { value: 0.25, label: '0.25x', icon: 'ti ti-player-track-prev' },
  { value: 0.5, label: '0.5x', icon: 'ti ti-player-track-prev' },
  { value: 0.75, label: '0.75x', icon: 'ti ti-player-track-prev' },
  { value: 1, label: 'عادی', icon: 'ti ti-player-play' },
  { value: 1.25, label: '1.25x', icon: 'ti ti-player-track-next' },
  { value: 1.5, label: '1.5x', icon: 'ti ti-player-track-next' },
  { value: 1.75, label: '1.75x', icon: 'ti ti-player-track-next' },
  { value: 2, label: '2x', icon: 'ti ti-player-track-next' }
])

// HLS source URL (example)
const hlsSource = computed(() =>
  isPlayingAd.value && currentAd.value
    ? currentAd.value.url
    : props.videoConfig.url
)

// Ad system computed properties
const adTimeFormatted = computed(() => formatTime(adTimeRemaining.value))
const showSkipButton = computed(() => canSkipAd.value && isPlayingAd.value)

// Initialize ad queue
const initializeAds = () => {
  if (!props.videoConfig.ads) return

  // Add preroll ads
  const prerollAds = props.videoConfig.ads.filter(ad => ad.position === 'preroll')
  adQueue.value = [...prerollAds]

  // Sort midroll ads by timing
  const midrollAds = props.videoConfig.ads
    .filter(ad => ad.position === 'midroll')
    .sort((a, b) => (a.timing || 0) - (b.timing || 0))

  // We'll add midroll ads to queue during playback
}

// Ad management functions
const playNextAd = async () => {
  if (adQueue.value.length === 0) {
    if (isPlayingAd.value) {
      // Finished all ads, return to main content
      await returnToMainContent()
    }
    return
  }

  const ad = adQueue.value.shift()!
  await playAd(ad)
}

const playAd = async (ad: AdConfig) => {
  console.log('Playing ad:', ad.id)

  // Set ad state first
  currentAd.value = ad
  isPlayingAd.value = true
  adTimeRemaining.value = ad.duration
  canSkipAd.value = false
  adProgress.value = 0

  // Set skip timer if applicable
  if (ad.skipAfter) {
    setTimeout(() => {
      canSkipAd.value = true
      console.log('Skip button enabled for ad:', ad.id)
    }, ad.skipAfter * 1000)
  }

  // Pause current content if playing
  if (player && isPlaying.value) {
    player.pause()
  }

  // Initialize player with ad content
  console.log('Loading ad URL:', ad.url)
  try {
    await initializePlayer()
    console.log('Ad player initialized successfully')
  } catch (error) {
    console.error('Failed to load ad:', error)
    // Skip this ad and continue
    skipAd()
  }
}

const skipAd = () => {
  if (!canSkipAd.value || !currentAd.value) return

  console.log('Skipping ad:', currentAd.value.id)
  playedAds.value.push(currentAd.value.id)

  // Clear ad state immediately
  const skippedAdId = currentAd.value.id
  currentAd.value = null
  isPlayingAd.value = false
  adTimeRemaining.value = 0
  canSkipAd.value = false
  adProgress.value = 0

  // Continue with next ad or return to main content
  setTimeout(() => {
    console.log('Ad skipped, continuing...')
    playNextAd()
  }, 100)
}

const returnToMainContent = async () => {
  console.log('Returning to main content')

  // Clear all ad state
  isPlayingAd.value = false
  currentAd.value = null
  adTimeRemaining.value = 0
  canSkipAd.value = false
  adProgress.value = 0

  // Reinitialize player with main content
  await initializePlayer()

  console.log('Main content loaded')
}

// Check for midroll ads during playback
const checkForMidrollAds = () => {
  if (!props.videoConfig.ads || isPlayingAd.value) return

  const midrollAds = props.videoConfig.ads.filter(ad =>
    ad.position === 'midroll' &&
    ad.timing &&
    Math.abs(currentTime.value - ad.timing) < 1 &&
    !playedAds.value.includes(ad.id)
  )

  if (midrollAds.length > 0) {
    adQueue.value = [...midrollAds]
    playNextAd()
  }
}

// HLS and Video Type Detection
const getVideoType = (url: string): string => {
  if (url.includes('.m3u8')) {
    return 'application/x-mpegURL'
  } else if (url.includes('.mp4')) {
    return 'video/mp4'
  } else if (url.includes('.webm')) {
    return 'video/webm'
  } else if (url.includes('.ogg')) {
    return 'video/ogg'
  }
  return 'video/mp4'
}
const playerStore = usePlayerStore()

watch(() => playerStore.currentTime, (time) => {
  if (videoElement.value) videoElement.value.currentTime = time
})


// Enhanced HTML5 Video Event Handlers
const onLoadStart = () => {
  console.log('Video load started')
  isLoading.value = true
  loadingProgress.value = 0
}

const onCanPlay = () => {
  console.log('Video can play')
  isLoading.value = false
  loadingProgress.value = 100
  // Apply resume time once
  applyResumeTime()
}

const onProgress = () => {
  if (videoElement.value && videoElement.value.buffered.length > 0) {
    const bufferedEnd = videoElement.value.buffered.end(videoElement.value.buffered.length - 1)
    bufferProgress.value = duration.value > 0 ? (bufferedEnd / duration.value) * 100 : 0
  }
}

const onError = (event: Event) => {
  console.error('Video error:', event)
  isLoading.value = false
  // Try to reload or show error message
}

const onVideoLoaded = () => {
  console.log('Video metadata loaded')
  if (videoElement.value) {
    duration.value = videoElement.value.duration
    isLoading.value = false
  }
}

const onTimeUpdate = () => {
  if (videoElement.value) {
    currentTime.value = videoElement.value.currentTime
    playProgress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0

  }
}

const onPlay = () => {
  console.log('Video playing')
  isPlaying.value = true
  isPaused.value = false

  saveProgress('play')
}

const onPause = () => {
  console.log('Video paused')
  isPlaying.value = false
  isPaused.value = true

  if (videoElement.value) {
    playerStore.setTime(videoElement.value.currentTime)
  }

  saveProgress('pause')
}

const onEnded = () => {
  console.log('Video ended')
  isPlaying.value = false
  isPaused.value = true

  saveProgress('ended')
}

// Types
declare global {
  interface Window {
    Hls: any
  }
}

// HLS Instance
let hls: any = null

// Load HLS.js library
const loadHLS = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Hls) {
      resolve(window.Hls)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js'
    script.onload = () => {
      resolve(window.Hls)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Initialize HLS Player
const initializeHLS = async () => {
  const videoEl = videoElement.value
  if (!videoEl) return

  const sourceUrl = hlsSource.value
  console.log('Initializing player with source:', sourceUrl)

  try {
    if (sourceUrl.includes('.m3u8')) {
      // HLS Stream
      const HlsClass = await loadHLS()

      if (HlsClass.isSupported()) {
        hls = new HlsClass({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 3,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          enableSoftwareAES: true
        })

        hls.loadSource(sourceUrl)
        hls.attachMedia(videoEl)

        hls.on(HlsClass.Events.MANIFEST_PARSED, (event: any, data: any) => {
          console.log('HLS manifest parsed, qualities available:', data.levels)

          // Update available qualities
          availableQualities.value = data.levels.map((level: any, index: number) => ({
            value: level.height || level.bitrate,
            label: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}k`,
            icon: getQualityIcon(level.height || level.bitrate),
            levelIndex: index
          }))

          // Set default quality
          if (data.levels.length > 0) {
            selectedQuality.value = data.levels[Math.min(1, data.levels.length - 1)].height || data.levels[0].bitrate
          }
        })

        hls.on(HlsClass.Events.LEVEL_SWITCHED, (event: any, data: any) => {
          console.log('Quality switched to level:', data.level)
          const level = hls.levels[data.level]
          if (level) {
            selectedQuality.value = level.height || level.bitrate
          }
        })

        hls.on(HlsClass.Events.ERROR, (event: any, data: any) => {
          console.error('HLS error:', data)
          if (data.fatal) {
            switch (data.type) {
              case HlsClass.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...')
                hls.startLoad()
                break
              case HlsClass.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, trying to recover...')
                hls.recoverMediaError()
                break
              default:
                console.log('Fatal error, destroying HLS instance')
                hls.destroy()
                break
            }
          }
        })

        console.log('HLS player initialized successfully')
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoEl.src = sourceUrl
        console.log('Using native HLS support')
      } else {
        console.error('HLS not supported')
      }
    } else {
      // Regular MP4/WebM video
      videoEl.src = sourceUrl
      console.log('Using regular video source')
    }
  } catch (error) {
    console.error('Failed to initialize video player:', error)
  }
}

// Helper function for quality icons
const getQualityIcon = (quality: number): string => {
  if (quality >= 1080) return 'ti ti-device-tv'
  if (quality >= 720) return 'ti ti-device-desktop'
  if (quality >= 480) return 'ti ti-device-laptop'
  if (quality >= 360) return 'ti ti-device-tablet'
  return 'ti ti-device-mobile'
}

// Load Video.js
const loadVideoJS = (): Promise<VideoJSStatic> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.videojs) {
      resolve(window.videojs)
      return
    }

    // Load CSS
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://vjs.zencdn.net/8.6.1/video.min.css'
    document.head.appendChild(css)

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://vjs.zencdn.net/8.6.1/video.min.js'
    script.onload = () => {
      // Load HLS plugin
      const hlsScript = document.createElement('script')
      hlsScript.src = 'https://vjs.zencdn.net/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js'
      hlsScript.onload = () => {
        resolve(window.videojs)
      }
      hlsScript.onerror = reject
      document.head.appendChild(hlsScript)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Initialize player
const initializePlayer = async () => {
  try {
    isLoading.value = true
    loadingProgress.value = 0

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      if (loadingProgress.value < 90) {
        loadingProgress.value += Math.random() * 10
      }
    }, 200)

    videojs = await loadVideoJS()

    await nextTick()

    if (!videoElement.value) {
      clearInterval(progressInterval)
      isLoading.value = false
      return
    }

    // Dispose existing player
    if (player) {
      player.dispose()
    }

    // Get current source URL
    const sourceUrl = hlsSource.value
    const isHLS = sourceUrl.includes('.m3u8')

    console.log('Initializing player with source:', sourceUrl)

    player = videojs(videoElement.value, {
      controls: false, // We use custom controls
      fluid: true,
      responsive: true,
      fill: true,
      preload: 'auto',
      autoplay: false,
      muted: false,
      playsinline: true,
      sources: [{
        src: sourceUrl,
        type: 'video/mp4'
      }],
      tracks: props.videoConfig.subtitles?.map(subtitle => ({
        kind: 'subtitles',
        src: subtitle.url,
        srclang: subtitle.language,
        label: subtitle.label,
        id: subtitle.id,
        default: subtitle.default
      })) || []
    })

    // Player events
    player.ready(() => {
      console.log('Player is ready')
      clearInterval(progressInterval)
      loadingProgress.value = 100

      setTimeout(() => {
        isLoading.value = false
        duration.value = player?.duration() || 0

        console.log('Video ready for manual play')
      }, 500)
    })

    player.on('loadstart', () => {
      console.log('Load started')
      if (!loadingProgress.value) {
        isLoading.value = true
        loadingProgress.value = 10
      }
    })

    player.on('loadedmetadata', () => {
      console.log('Metadata loaded')
      duration.value = player?.duration() || 0
      loadingProgress.value = 70


    })

    player.on('canplay', () => {
      console.log('Can play')

      loadingProgress.value = 90

    })

    player.on('canplaythrough', () => {
      console.log('Can play through')
      clearInterval(progressInterval)
      loadingProgress.value = 100

      setTimeout(() => {
        isLoading.value = false
      }, 300)
    })

    player.on('play', () => {
      console.log('Play event')
      isPlaying.value = true
      isPaused.value = false
    })

    player.on('pause', () => {
      console.log('Pause event')
      isPlaying.value = false
      isPaused.value = true
    })

    player.on('timeupdate', () => {
      const time = player?.currentTime() || 0
      currentTime.value = time

      if (isPlayingAd.value && currentAd.value) {
        // Update ad progress
        adTimeRemaining.value = Math.max(0, currentAd.value.duration - time)
        adProgress.value = (time / currentAd.value.duration) * 100

        // Check if ad finished
        if (time >= currentAd.value.duration) {
          console.log('Ad finished:', currentAd.value.id)
          playedAds.value.push(currentAd.value.id)
          setTimeout(() => {
            playNextAd()
          }, 500)
        }
      } else {
        // Main content - check for midroll ads
        playProgress.value = duration.value > 0 ? (time / duration.value) * 100 : 0
        checkForMidrollAds()
      }
    })

    player.on('progress', () => {
      const buffered = player?.buffered()
      if (buffered && buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1)
        const totalDuration = isPlayingAd.value && currentAd.value
          ? currentAd.value.duration
          : duration.value
        bufferProgress.value = totalDuration > 0 ? (bufferedEnd / totalDuration) * 100 : 0
      }
    })

    player.on('volumechange', () => {
      volume.value = Math.round((player?.volume() || 0) * 100)
      isMuted.value = player?.muted() || false
    })

    player.on('fullscreenchange', () => {
      try {
        if (typeof player?.isFullscreen === 'function') {
          isFullscreen.value = player.isFullscreen()
        } else {
          // Fallback to native fullscreen detection
          isFullscreen.value = !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
          )
        }
      } catch (error) {
        console.error('Fullscreen detection error:', error)
        isFullscreen.value = false
      }
    })

    player.on('ended', () => {
      console.log('Video ended')
      if (isPlayingAd.value && currentAd.value) {
        // Ad ended
        console.log('Ad ended, playing next')
        playedAds.value.push(currentAd.value.id)
        playNextAd()
      } else {
        // Main content ended - play postroll ads
        const postrollAds = props.videoConfig.ads?.filter(ad =>
          ad.position === 'postroll' &&
          !playedAds.value.includes(ad.id)
        ) || []

        if (postrollAds.length > 0) {
          console.log('Playing postroll ads')
          adQueue.value = [...postrollAds]
          playNextAd()
        }
      }
    })

    player.on('error', () => {
      console.error('Player error occurred')
      clearInterval(progressInterval)
      isLoading.value = false

      // Try to reload after a short delay
      setTimeout(() => {
        if (player) {
          console.log('Attempting to recover from error')
          const tech = player.tech()
          if (tech && tech.load) {
            tech.load()
          }
        }
      }, 2000)
    })

    // Set initial volume
    player.volume(volume.value / 100)

  } catch (error) {
    console.error('Failed to initialize video player:', error)
    isLoading.value = false
    loadingProgress.value = 0
  }
}

// Control functions
const togglePlay = () => {
  if (!videoElement.value) {
    console.error('Video element not ready')
    return
  }

  console.log('Toggle play clicked, current state:', isPlaying.value)

  if (isPlaying.value) {
    videoElement.value.pause()
    console.log('Pausing video')
  } else {
    videoElement.value.play().then(() => {
      console.log('Video started playing')
    }).catch((error) => {
      console.error('Play failed:', error)
    })
  }
}

const applyResumeTime = () => {
  if (!resumeApplied && props.videoConfig.resumeTime && props.videoConfig.resumeTime > 0) {
    const time = props.videoConfig.resumeTime
    currentTime.value = time

    if (player) {
      player.currentTime(time)
    }
    if (videoElement.value) {
      videoElement.value.currentTime = time
    }

    resumeApplied = true
    console.log('Resume time applied:', time)
  }
}


const toggleMute = () => {
  if (!videoElement.value) return
  videoElement.value.muted = !videoElement.value.muted
  isMuted.value = videoElement.value.muted
}

const updateVolume = () => {
  if (!videoElement.value) return
  videoElement.value.volume = volume.value / 100
}

const toggleFullscreen = () => {
  if (!videoElement.value) return

  try {
    if (document.fullscreenElement) {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
      isFullscreen.value = false
    } else {
      // Enter fullscreen
      if (videoElement.value.requestFullscreen) {
        videoElement.value.requestFullscreen()
      } else if ((videoElement.value as any).webkitRequestFullscreen) {
        (videoElement.value as any).webkitRequestFullscreen()
      } else if ((videoElement.value as any).mozRequestFullScreen) {
        (videoElement.value as any).mozRequestFullScreen()
      } else if ((videoElement.value as any).msRequestFullscreen) {
        (videoElement.value as any).msRequestFullscreen()
      }
      isFullscreen.value = true
    }
  } catch (error) {
    console.error('Fullscreen toggle failed:', error)
  }
}

const togglePiP = () => {
  if (!videoElement.value) return

  try {
    if (document.pictureInPictureElement) {
      // Exit Picture-in-Picture
      document.exitPictureInPicture()
    } else {
      // Enter Picture-in-Picture
      if (videoElement.value.requestPictureInPicture) {
        videoElement.value.requestPictureInPicture()
      }
    }
  } catch (error) {
    console.error('Picture-in-Picture toggle failed:', error)
  }
}

const getVolumeIcon = () => {
  if (isMuted.value || volume.value === 0) return 'ti ti-volume-off'
  if (volume.value < 30) return 'ti ti-volume-2'
  if (volume.value < 70) return 'ti ti-volume'
  return 'ti ti-volume'
}

// Dropdown functions
const toggleQuality = () => {
  showQuality.value = !showQuality.value
  showSpeed.value = false
}

const toggleSpeed = () => {
  showSpeed.value = !showSpeed.value
  showQuality.value = false
}

const selectQuality = (quality: number) => {
  console.log(`Changing quality to ${quality}`)

  if (hls && hls.levels) {
    // Find the level index for HLS
    const levelIndex = availableQualities.value.find(q => q.value === quality)?.levelIndex
    if (levelIndex !== undefined) {
      hls.currentLevel = levelIndex
      selectedQuality.value = quality
      console.log(`HLS quality changed to level ${levelIndex}`)
    }
  } else if (videoElement.value) {
    // For non-HLS videos, we might need different sources
    console.log('Quality change for non-HLS video not implemented')
  }

  showQuality.value = false
}

const selectSpeed = (speed: number) => {
  selectedSpeed.value = speed
  showSpeed.value = false

  if (videoElement.value) {
    videoElement.value.playbackRate = speed
    console.log(`Playback speed changed to ${speed}x`)
  }
}

const toggleSubtitles = () => {
  showSubtitles.value = !showSubtitles.value
  showQuality.value = false
  showSpeed.value = false
}

const selectSubtitle = (subtitleId: string | null) => {
  selectedSubtitle.value = subtitleId
  showSubtitles.value = false

  if (player) {
    // Disable all text tracks
    const textTracks = player.textTracks()
    for (let i = 0; i < textTracks.length; i++) {
      textTracks[i].mode = 'disabled'
    }

    // Enable selected track
    if (subtitleId) {
      const selectedTrack = textTracks.getTrackById(subtitleId)
      if (selectedTrack) {
        selectedTrack.mode = 'showing'
      }
    }

    subtitlesEnabled.value = subtitleId !== null
  }
}

const initializeSubtitles = () => {
  if (!props.videoConfig.subtitles) return

  availableSubtitles.value = props.videoConfig.subtitles

  // Set default subtitle
  const defaultSub = props.videoConfig.subtitles.find(sub => sub.default)
  if (defaultSub) {
    selectedSubtitle.value = defaultSub.id
    subtitlesEnabled.value = true
  }
}

const downloadVideo = async () => {

  if (!videoElement.value) return

  try {
    const videoUrl = hlsSource.value
    const videoTitle = props.videoConfig.title || 'video'

    if (videoUrl.includes('.m3u8')) {
      // HLS streams need special handling
      alert('برای دانلود ویدیوهای HLS، از نرم‌افزارهای مخصوص مانند youtube-dl استفاده کنید.')

      // Copy HLS URL to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(videoUrl)
        alert('لینک HLS در clipboard کپی شد')
      }
      return
    }

    // Create download link for direct video files
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = `${videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`
    link.target = '_blank'

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('Download initiated for:', videoTitle)
  } catch (error) {
    console.error('Download failed:', error)
    alert('خطا در دانلود فایل')
  }
}

const seekToPosition = (event: MouseEvent) => {
  if (!videoElement.value || !duration.value) return

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const seekTime = percentage * duration.value

  videoElement.value.currentTime = seekTime
  console.log(`Seeking to ${seekTime.toFixed(2)}s (${(percentage * 100).toFixed(1)}%)`)
}

const closeDropdowns = (event: Event) => {
  if (!qualityDropdownRef.value?.contains(event.target as Node)) {
    showQuality.value = false
  }
  if (!speedDropdownRef.value?.contains(event.target as Node)) {
    showSpeed.value = false
  }
  if (!subtitleDropdownRef.value?.contains(event.target as Node)) {
    showSubtitles.value = false
  }
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (!videoElement.value) return

  switch (event.code) {
    case 'Space':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      event.preventDefault()
      videoElement.value.currentTime = Math.max(0, videoElement.value.currentTime - 10)
      break
    case 'ArrowRight':
      event.preventDefault()
      videoElement.value.currentTime = Math.min(duration.value, videoElement.value.currentTime + 10)
      break
    case 'ArrowUp':
      event.preventDefault()
      volume.value = Math.min(100, volume.value + 10)
      updateVolume()
      break
    case 'ArrowDown':
      event.preventDefault()
      volume.value = Math.max(0, volume.value - 10)
      updateVolume()
      break
    case 'KeyM':
      event.preventDefault()
      toggleMute()
      break
    case 'KeyF':
      event.preventDefault()
      toggleFullscreen()
      break
    case 'Digit1':
    case 'Digit2':
    case 'Digit3':
    case 'Digit4':
    case 'Digit5':
    case 'Digit6':
    case 'Digit7':
    case 'Digit8':
    case 'Digit9':
      event.preventDefault()
      const percentage = parseInt(event.code.slice(-1)) * 10
      videoElement.value.currentTime = (percentage / 100) * duration.value
      break
    case 'Digit0':
      event.preventDefault()
      videoElement.value.currentTime = 0
      break
  }
}

// Fullscreen detection
const handleFullscreenChange = () => {
  try {
    if (typeof player?.isFullscreen === 'function') {
      isFullscreen.value = player.isFullscreen()
    } else {
      // Fallback to native fullscreen detection
      isFullscreen.value = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
    }
  } catch (error) {
    console.error('Fullscreen detection error:', error)
    isFullscreen.value = false
  }
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(async () => {


  console.log('FilmPlayer mounted')
  // Initialize HLS player
  await initializeHLS()

  // Set initial volume
  if (videoElement.value) {
    videoElement.value.volume = volume.value / 100
    ///
    videoElement.value.addEventListener('play', () => emit('play'))
    videoElement.value.addEventListener('pause', () => emit('pause'))
  }

  document.addEventListener('click', closeDropdowns)
  document.addEventListener('keydown', handleKeydown)

  // Add fullscreen event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)

  console.log('Advanced video player with HLS support ready')
})
defineExpose({
  pause() {
    videoElement.value?.pause()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

  // Cleanup HLS
  if (hls) {
    hls.destroy()
  }
})
</script>

<style scoped>
/* Custom slider styles */
.slider {
  background: linear-gradient(to right, rgb(250 204 21) 0%, rgb(250 204 21) var(--value, 0%), rgb(63 63 70) var(--value, 0%), rgb(63 63 70) 100%);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(250 204 21);
  cursor: pointer;
  border: 2px solid rgb(0 0 0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(250 204 21);
  cursor: pointer;
  border: 2px solid rgb(0 0 0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Video.js custom theme */
:deep(.video-js) {
  font-family: inherit;
}

:deep(.vjs-big-play-button) {
  background: rgba(250, 204, 21, 0.9);
  border: none;
  border-radius: 1rem;
  width: 4rem;
  height: 4rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
}

:deep(.vjs-big-play-button:hover) {
  background: rgba(250, 204, 21, 1);
}
</style>
