<template>
  <article 
    class="bg-white rounded-xl md:rounded-2xl overflow-hidden active:scale-[0.98] transition-all duration-200 group border border-gray-100 shadow-sm hover:shadow-md"
    @click="goToPost(post.id)"
  >
    <!-- Post Image -->
    <div class="relative h-40 md:h-56 overflow-hidden">
      <img
        :src="post.image" 
        :alt="post.title" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      <!-- Action Buttons on Image (Mobile & Desktop) -->
      <div class="absolute top-2 left-2 md:top-3 md:left-3 flex gap-2">
        <button
            @click.prevent="toggleLike"
            :class="{ 'text-red-500': post.liked, 'text-gray-600': !post.liked }"
        >
          <Icon :name="post.liked ? 'heart-filled' : 'heart'" size="md" />
        </button>

        <button
            @click.prevent="toggleBookmark"
            :class="{ 'text-orange-500': post.bookmarked, 'text-gray-600': !post.bookmarked }"
        >
          <Icon :name="post.bookmarked ? 'bookmark-filled' : 'bookmark'" size="md" />
        </button>
      </div>

      <!-- Like Count Badge (if has likes) -->
      <div 
        v-if="post.likes > 0"
        class="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium flex items-center gap-1"
      >
        <Icon name="heart-filled" size="sm" class="text-red-500" />
        {{ formatNumber(post.likes) }}
      </div>
    </div>
    
    <!-- Post Content -->
    <div class="p-3 md:p-5">
      <h3 class="font-bold text-sm md:text-lg lg:text-xl mb-1 md:mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
        {{ shortTitle  }}
      </h3>
      <p class="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 leading-relaxed line-clamp-2">
        {{ shortExcerpt }}
      </p>
      
      <!-- Post Meta -->
      <div class="flex items-center justify-between text-[10px] md:text-xs text-gray-500 pt-2 md:pt-3 border-t border-gray-100">
        <div class="flex items-center gap-2">
          <span v-if="post.author" class="font-medium truncate">{{ post.author }}</span>
          <span v-if="post.date" class="hidden sm:inline">{{ post.date }}</span>
        </div>
        <div class="flex items-center gap-2 md:gap-3">
          <span v-if="post.readTime" class="flex items-center gap-1">
            <Icon name="clock" size="sm" />
            {{ post.readTime }} دقیقه
          </span>
          <span v-if="post.views" class="flex items-center gap-1">
            <Icon name="eye" size="sm" />
            {{ formatNumber(post.views) }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useRouter} from 'vue-router'
import {usePostStore} from "~/stores/post";
import {useSettingStore} from "~/stores/setting";

interface Post {
  id: number
  title: string
  excerpt: string
  author?: string
  date?: string
  readTime?: number
  views?: number
  image: string
  category?: string
}

const props = defineProps<{
  post: Post
}>()

// Reactive states for like and bookmark
const isBookmarked = ref(false)
const likeCount = ref(0)
const router = useRouter()
const postStore=usePostStore()
// Check if mobile on mount
onMounted(() => {
  // Load saved state from localStorage

})
const toggleLike = () => {
  postStore.toggleLike(props.post.id)
}

const toggleBookmark = () => {
  postStore.toggleBookmark(props.post.id)
}

// Format numbers (e.g., 1000 -> 1K)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const goToPost = (id: number) => {
  router.push(`/post/${id}`)
}

const settingStore=useSettingStore()
const maxTitle = Number(settingStore.generalSetting?.maxTitleLength || 100)
const maxExcerpt = Number(settingStore.generalSetting?.maxExcerptLength || 200)

const shortTitle = computed(() =>
    props.post.title.length > maxTitle
        ? props.post.title.slice(0, maxTitle) + '…'
        : props.post.title
)

const shortExcerpt = computed(() =>
    props.post.excerpt.length > maxExcerpt
        ? props.post.excerpt.slice(0, maxExcerpt) + '…'
        : props.post.excerpt
)


</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for buttons */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.9);
}

/* Heart animation when liked */
@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
}

.text-red-500 {
  animation: heartBeat 0.3s ease-out;
}
</style>
