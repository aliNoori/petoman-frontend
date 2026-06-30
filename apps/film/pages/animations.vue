<template>
  <div class="bg-black min-h-screen text-yellow-400">
    <HeaderFilm />
    <main class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-yellow-400 mb-4">انیمیشن‌های حیوانات</h1>
        <p class="text-yellow-200 text-lg">انیمیشن‌های آموزنده و سرگرم‌کننده برای کودکان و بزرگسالان</p>
      </div>
      
      <!-- Age Groups Filter -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="ageGroup in ageGroups"
            :key="ageGroup.id"
            @click="selectedAgeGroup = ageGroup.id"
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-300',
              selectedAgeGroup === ageGroup.id
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700'
            ]"
          >
            <i :class="ageGroup.icon" class="ml-2"></i>
            {{ ageGroup.name }}
          </button>
        </div>
      </div>

      <!-- Animations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="animation in filteredAnimations"
          :key="animation.id"
          class="group bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="relative aspect-video overflow-hidden">
            <img
              :src="animation.poster"
              :alt="animation.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <button class="w-16 h-16 bg-yellow-400 bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <i class="ti ti-player-play text-black text-2xl mr-1"></i>
              </button>
            </div>
            <div class="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
              {{ animation.ageRating }}
            </div>
            <div class="absolute bottom-3 left-3 bg-black bg-opacity-75 text-yellow-400 text-sm px-2 py-1 rounded">
              {{ animation.duration }}
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">
              {{ animation.title }}
            </h3>
            <p class="text-yellow-200 text-sm mb-3 line-clamp-2">
              {{ animation.description }}
            </p>
            
            <div class="flex items-center justify-between text-sm text-yellow-300 mb-4">
              <div class="flex items-center space-x-4 space-x-reverse">
                <span class="flex items-center">
                  <i class="ti ti-star text-yellow-400 ml-1"></i>
                  {{ animation.rating }}
                </span>
                <span class="flex items-center">
                  <i class="ti ti-users text-yellow-400 ml-1"></i>
                  {{ animation.ageGroup }}
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <button class="flex-1 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
                <i class="ti ti-player-play ml-1"></i>
                تماشا
              </button>
              <button class="px-3 py-2 bg-zinc-800 text-yellow-400 rounded-lg hover:bg-zinc-700 transition-colors">
                <i class="ti ti-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Educational Section -->
      <section class="mt-16">
        <div class="bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl p-8 border border-yellow-400/20">
          <h2 class="text-3xl font-bold text-yellow-400 mb-6 text-center">
            <i class="ti ti-school ml-3"></i>
            انیمیشن‌های آموزشی
          </h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div
              v-for="educational in educationalAnimations"
              :key="educational.id"
              class="text-center p-6 bg-zinc-900 rounded-xl"
            >
              <i :class="educational.icon" class="text-4xl text-yellow-400 mb-4"></i>
              <h3 class="text-xl font-bold text-yellow-400 mb-3">{{ educational.title }}</h3>
              <p class="text-yellow-200 text-sm">{{ educational.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <FooterFilm />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedAgeGroup = ref('all')

const ageGroups = [
  { id: 'all', name: 'همه سنین', icon: 'ti ti-users' },
  { id: 'kids', name: 'کودکان (3-8)', icon: 'ti ti-baby-carriage' },
  { id: 'children', name: 'نوجوانان (9-15)', icon: 'ti ti-user' },
  { id: 'family', name: 'خانوادگی', icon: 'ti ti-home-heart' },
  { id: 'educational', name: 'آموزشی', icon: 'ti ti-school' }
]

const animations = [
  {
    id: 1,
    title: 'ماجراهای گربه میمون',
    description: 'انیمیشن آموزنده درباره مراقبت از حیوانات خانگی',
    poster: '/images/animation1.jpg',
    duration: '22:15',
    ageRating: '3+',
    ageGroup: 'kids',
    rating: 4.6,
    type: 'educational'
  },
  {
    id: 2,
    title: 'دوستان جنگل',
    description: 'داستان دوستی بین حیوانات مختلف جنگل',
    poster: '/images/animation2.jpg',
    duration: '18:45',
    ageRating: '6+',
    ageGroup: 'children',
    rating: 4.8,
    type: 'adventure'
  },
  {
    id: 3,
    title: 'نجات پرنده کوچک',
    description: 'انیمیشن هیجان‌انگیز درباره نجات یک پرنده زخمی',
    poster: '/images/animation3.jpg',
    duration: '25:30',
    ageRating: 'همه',
    ageGroup: 'family',
    rating: 4.9,
    type: 'rescue'
  }
]

const educationalAnimations = [
  {
    id: 1,
    title: 'آموزش مراقبت',
    description: 'یادگیری نحوه مراقبت صحیح از حیوانات خانگی',
    icon: 'ti ti-heart-handshake'
  },
  {
    id: 2,
    title: 'حفاظت از طبیعت',
    description: 'اهمیت حفاظت از محیط زیست و حیوانات وحشی',
    icon: 'ti ti-leaf'
  },
  {
    id: 3,
    title: 'دوستی با حیوانات',
    description: 'نحوه برقراری ارتباط مناسب با حیوانات',
    icon: 'ti ti-paw'
  }
]

const filteredAnimations = computed(() => {
  if (selectedAgeGroup.value === 'all') {
    return animations
  }
  return animations.filter(animation => animation.ageGroup === selectedAgeGroup.value)
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
