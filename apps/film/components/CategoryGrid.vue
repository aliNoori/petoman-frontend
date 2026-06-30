<template>
  <div class="w-full">
    <!-- Section Header -->
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
        دسته‌بندی محتوا
      </h2>
      <p class="text-yellow-200/80 max-w-2xl mx-auto">
        مجموعه‌ای متنوع از فیلم‌ها و مستندات در دسته‌بندی‌های مختلف
      </p>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
        class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25 aspect-square"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Category Content -->
        <div class="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
          <!-- Icon Container -->
          <div class="w-12 h-12 mb-4 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <i :class="category.icon" class="text-2xl text-yellow-400 group-hover:text-yellow-300 transition-colors"></i>
          </div>
          
          <!-- Category Name -->
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
            {{ category.name }}
          </h3>
          
          <!-- Count Badge -->
          <div class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-full text-yellow-400 text-xs font-medium transition-colors">
            <i class="ti ti-movie text-xs"></i>
            {{ category.count }}
          </div>
        </div>

        <!-- Hover Effect -->
        <div class="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Border Effect -->
        <div class="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/30 rounded-2xl transition-all duration-300"></div>
      </div>
    </div>

    <!-- View All Button -->
    <div class="text-center mt-12">
      <NuxtLink 
        to="/categories" 
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
      >
        <span>مشاهده همه دسته‌بندی‌ها</span>
        <i class="ti ti-arrow-left"></i>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string
  name: string
  icon: string
  count: number
}

const categories: Category[] = [
  {
    id: 'documentary',
    name: 'مستند',
    icon: 'ti ti-video',
    count: 25
  },
  {
    id: 'nature',
    name: 'طبیعت',
    icon: 'ti ti-leaf',
    count: 18
  },
  {
    id: 'rescue',
    name: 'نجات',
    icon: 'ti ti-heart',
    count: 32
  },
  {
    id: 'education',
    name: 'آموزشی',
    icon: 'ti ti-school',
    count: 14
  },
  {
    id: 'animation',
    name: 'انیمیشن',
    icon: 'ti ti-palette',
    count: 12
  },
  {
    id: 'series',
    name: 'سریال',
    icon: 'ti ti-device-tv',
    count: 8
  }
]

const selectCategory = (category: Category) => {
  // Navigate to category page or emit event
  console.log('Selected category:', category.name)
  // You can add navigation logic here
  // navigateTo(`/categories/${category.id}`)
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
