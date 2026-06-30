<template>
  <div class="min-h-screen bg-gray-50 pt-20 md:pt-0" dir="rtl">
    <div class="container mx-auto px-4 py-8">
      <!-- Search Input -->
      <div class="sticky top-20 md:top-4 bg-gray-50 pt-4 pb-6 z-30">
        <div class="relative max-w-2xl mx-auto">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="جستجو در مقالات..."
            class="w-full px-6 py-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
            @input="handleSearch"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Search Stats -->
        <div v-if="searchQuery" class="text-center mt-4 text-sm text-gray-600">
          {{ filteredResults.length }} نتیجه یافت شد
        </div>
      </div>

      <!-- Search Results -->
      <div class="max-w-4xl mx-auto">
        <!-- Loading State -->
        <div v-if="isSearching" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p class="mt-4 text-gray-600">در حال جستجو...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!searchQuery" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">چیزی جستجو کنید</h3>
          <p class="text-gray-500">مقالات، آموزش‌ها و اطلاعات مورد نظرتان را پیدا کنید</p>
        </div>

        <!-- No Results -->
        <div v-else-if="filteredResults.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">نتیجه‌ای یافت نشد</h3>
          <p class="text-gray-500">برای "{{ searchQuery }}" نتیجه‌ای پیدا نکردیم</p>
        </div>

        <!-- Results List -->
        <div v-else class="space-y-4">
          <div 
            v-for="result in filteredResults" 
            :key="result.id"
            class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToPost(result)"
          >
            <div class="flex items-start gap-4">
              <!-- Image -->
              <img 
                v-if="result.image"
                :src="result.image" 
                :alt="result.title"
                class="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              >
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  <span v-html="highlightText(result.title)"></span>
                </h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  <span v-html="highlightText(result.description)"></span>
                </p>
                
                <!-- Meta Info -->
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ result.views }} بازدید
                  </span>
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ result.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {usePostStore} from "~/stores/post.js";

const searchQuery = ref('')
const isSearching = ref(false)
const postStore=usePostStore()
// Sample data - این رو باید از API بگیری
const allPosts = computed(() => {
  return (postStore.posts || []).map(post => ({
    id: post.id,
    title: post.title,
    description: post.description ?? post.excerpt ?? '',
    image: typeof post.image === 'string' ? post.image : post.image?.url ?? null,
    category: post.category?.title ?? post.category ?? '',
    views: post.views ?? 0,
  }))
})


// Live Search
const filteredResults = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase().trim()

  console.log('post',(allPosts.value || []).filter(post => {
    const title = post?.title?.toLowerCase() || ''
    const description = post?.description?.toLowerCase() || ''
    const category = post?.category?.toLowerCase() || ''

    return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query)
    )
  }))

  return (allPosts.value || []).filter(post => {
    const title = post?.title?.toLowerCase() || ''
    const description = post?.description?.toLowerCase() || ''
    const category = post?.category?.toLowerCase() || ''

    return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query)
    )
  })
})


// Simulate search delay
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    isSearching.value = false
  }, 300)
}

// Highlight matched text
const highlightText = (text) => {
  if (!searchQuery.value) return text
  
  const query = searchQuery.value.trim()
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

// Navigate to post
const navigateToPost = (post) => {
  // به صفحه پست هدایت می‌کنیم
  navigateTo(`/post/${post.id}`)
}
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
