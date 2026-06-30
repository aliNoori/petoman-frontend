<script setup lang="ts">
import { ref, computed } from 'vue'
import {usePostStore} from "~/stores/post";
import {useCategoryStore} from "~/stores/category";
import {useCategoryTypeStore} from "~/stores/category-type";
import {onMounted, watch} from "vue";

const route = useRoute()
const categoryId = computed(() => route.params.id as string)
const postStore=usePostStore()
const categoryStore = useCategoryStore()
const categoryTypeStore = useCategoryTypeStore()
const categories = computed(() => categoryStore.categories || [])
// Category data
const categoryData = computed(() => {
  return categories.value.find((c:any) => c.slug === categoryId.value) || {}
})

useSeoMeta({
  title: `${categoryData.value.name} - پت دانیم`,
  description: categoryData.value.description
})

// Mock posts data
const posts = computed(() => postStore.posts.filter(p =>
    p.categories?.some((c:any) => c.slug === categoryId.value)
))
onMounted(async () => {
  await postStore.fetchPosts()

  await categoryTypeStore.fetchType('post')
})

watch(
    () => categoryTypeStore.selectedType,
    async (type:any) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id, contentType: 'danim'})
      }
    },
    {immediate: true}
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 md:pt-0">
    <div class="max-w-7xl mx-auto px-4 py-4 md:py-8">
      <!-- Category Header with Background Image -->
      <div class="relative overflow-hidden rounded-2xl md:rounded-3xl mb-6 md:mb-12 h-48 md:h-80">
        <!-- Background Image -->
        <img 
          :src="categoryData.image" 
          :alt="categoryData.name"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-br" :class="categoryData.color" style="opacity: 0.85"></div>
        <div class="absolute inset-0 bg-black/20"></div>
        
        <!-- Content -->
        <div class="relative h-full p-4 md:p-12 flex items-center">
          <div class="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full">
            <div class="text-4xl md:text-8xl filter drop-shadow-lg text-white flex items-center justify-center">
              <Icon :name="categoryData.icon" size="lg" class="md:hidden" />
              <Icon :name="categoryData.icon" size="xl" class="hidden md:block" />
            </div>
            <div class="text-center md:text-right flex-1">
              <h1 class="text-xl md:text-5xl font-bold mb-1 md:mb-4 text-white">{{ categoryData.name }}</h1>
              <p class="text-sm md:text-xl text-white/95 max-w-2xl drop-shadow-md">{{ categoryData.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        <article v-for="post in posts" :key="post.id" 
                 class="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100">
          
          <!-- Post Image -->
          <div class="relative h-48 overflow-hidden">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <div class="p-4 md:p-6">
            <h3 class="font-bold text-base md:text-xl mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
              {{ post.title }}
            </h3>
            
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span class="flex items-center gap-1">
                <Icon name="clock" size="sm" />
                {{ post.readTime }} دقیقه
              </span>
              <span>{{ post.date }}</span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-xs md:text-sm text-gray-600">{{ post.author }}</span>
              <NuxtLink :to="`/post/${post.id}`" class="text-orange-600 hover:text-orange-700 font-medium text-xs md:text-sm flex items-center gap-1">
                مطالعه
                <Icon name="arrow-left" size="sm" />
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-8 md:mt-12">
        <button class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="chevron-right" size="sm" />
        </button>
        
        <button class="w-10 h-10 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 active:scale-95 transition-all">
          1
        </button>
        <button class="w-10 h-10 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 active:scale-95 transition-all">
          2
        </button>
        <button class="w-10 h-10 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 active:scale-95 transition-all">
          3
        </button>
        <span class="text-gray-400">...</span>
        <button class="w-10 h-10 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 active:scale-95 transition-all">
          10
        </button>
        
        <button class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
          <Icon name="chevron-left" size="sm" />
        </button>
      </div>
    </div>
  </div>
</template>

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
