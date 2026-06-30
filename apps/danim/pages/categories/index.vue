<script setup lang="ts">
import { ref } from 'vue'
import {useCategoryStore} from "~/stores/category";
import {useCategoryTypeStore} from "~/stores/category-type";
import {computed, onMounted, watch} from "vue";

useSeoMeta({
  title: 'دسته‌بندی‌ها - پت دانیم',
  description: 'دسته‌بندی‌های مختلف محتوای آموزشی و اطلاعاتی حیوانات خانگی'
})

/*const categories = ref([
  {
    id: 'dogs',
    name: 'سگ‌ها',
    icon: 'dog',
    description: 'همه چیز درباره نژادها، مراقبت، آموزش و سلامت سگ‌ها',
    color: 'from-orange-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop'
  },
  {
    id: 'cats',
    name: 'گربه‌ها',
    icon: 'cat',
    description: 'راهنمای کامل نگهداری، رفتار و مراقبت از گربه‌های خانگی',
    color: 'from-orange-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop'
  },
  {
    id: 'birds',
    name: 'پرندگان',
    icon: 'bird',
    description: 'اطلاعات جامع درباره پرندگان زینتی و خانگی',
    color: 'from-orange-600 to-orange-700',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=400&fit=crop'
  },
  {
    id: 'fish',
    name: 'ماهی‌ها',
    icon: 'fish',
    description: 'راهنمای نگهداری آکواریوم و ماهی‌های زینتی',
    color: 'from-orange-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop'
  },
  {
    id: 'rabbits',
    name: 'خرگوش‌ها',
    icon: 'rabbit',
    description: 'نکات مهم نگهداری و مراقبت از خرگوش‌های خانگی',
    color: 'from-orange-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop'
  },
  {
    id: 'hamsters',
    name: 'همستر و جوندگان',
    icon: 'paw',
    description: 'راهنمای نگهداری همستر، خوکچه هندی و سایر جوندگان خانگی',
    color: 'from-orange-600 to-orange-700',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=400&fit=crop'
  }
])*/

const categoryStore = useCategoryStore()
const categoryTypeStore = useCategoryTypeStore()
const categories = computed(() => categoryStore.categories || [])


onMounted(async () => {

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
  <div class="min-h-screen bg-gray-50">
    <!-- Modern Header with Gradient Background -->
    <div class="bg-gradient-to-br from-orange-500 to-red-600 pt-20 md:pt-0">
      <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Icon name="category" size="md" class="md:hidden text-white" />
              <Icon name="category" size="lg" class="hidden md:block text-white" />
            </div>
            <div>
              <h1 class="text-lg md:text-2xl font-bold text-white drop-shadow-md">دسته‌بندی‌ها</h1>
              <p class="text-white/90 text-xs md:text-sm mt-0.5">انتخاب دسته مورد نظر</p>
            </div>
          </div>
          <!-- Counter Badge -->
          <div class="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span class="text-white text-sm font-medium">{{ categories.length }} دسته</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="max-w-7xl mx-auto px-4 py-6 md:py-8 -mt-4 md:-mt-6">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <NuxtLink 
          v-for="category in categories" 
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group block h-full"
        >
          <div class="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
            <!-- Category Image -->
            <div class="relative h-40 overflow-hidden flex-shrink-0">
              <img 
                :src="category.image" 
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div :class="['absolute inset-0 bg-gradient-to-t', category.color]" style="opacity: 0.75"></div>
            </div>

            <!-- Category Info - Over Image -->
            <div class="absolute inset-0 p-4 flex flex-col items-center justify-center text-center">
              <h3 class="font-bold text-base md:text-lg text-white drop-shadow-lg group-hover:scale-105 transition-transform">
                {{ category.name }}
              </h3>
            </div>
          </div>
        </NuxtLink>
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
</style>
