<template>
  <div v-if="settingStore.generalSetting?.enableSearch" class="bg-gray-50 md:bg-gray-50">
    <!-- Scrollable Search Bar and Background - Mobile Only -->
    <div class="md:hidden bg-gradient-to-b from-orange-600 to-orange-600 pt-10 pb-20 px-4 rounded-b-3xl">
      <NuxtLink to="/search"
                class="block bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <span class="text-gray-500 text-sm flex-1">جستجو در مقالات...</span>
      </NuxtLink>
    </div>

    <!-- Hero Slider Section -->
    <section class="md:relative bg-transparent md:bg-gray-50 md:py-8 -mt-12 md:mt-0 relative z-40 mb-6">
      <div class="max-w-7xl mx-auto px-4 md:px-4">
        <div class="hero-swiper rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-xl">
          <Swiper
              :modules="[SwiperAutoplay, SwiperPagination, SwiperEffectFade]"
              :loop="true"
              :autoplay="slider?.data?.autoPlay ? { delay: slider?.data?.speed * 1000 } : false"
              :speed="slider?.data?.speed?slider?.data?.speed * 1000:2000"
              :slides-per-view="1"
              :space-between="0"
              :pagination="slider?.data?.showDots ? { clickable: true } : false"
              :navigation="slider?.data?.showArrows??false"
              :effect="slider?.data?.transition || 'slide'"
              :style="{ height: slider?.data?.height + 'px' }"
              class="h-[250px] md:h-[400px]"
          >
            <!-- Slide 1 -->
            <SwiperSlide
                v-for="(slide, i) in slider?.data.slides ?? []"
                :key="i"
            >
              <div class="relative w-full h-full">
                <!-- تصویر -->
                <img
                    :src="slide.image"
                    :alt="slide.title ?? 'slide'"
                    class="w-full h-full object-cover object-center"
                />

                <!-- متن روی تصویر -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 p-6">
                  <h2 class="text-2xl font-bold mb-2">{{ slide.title }}</h2>
                  <p class="text-lg mb-4">{{ slide.subtitle }}</p>

                  <!-- دکمه -->
                  <a
                      v-if="slide.buttonText"
                      :href="resolveLink(slide)"
                      :target="slide.openInNewTab ? '_blank' : '_self'"
                      class="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold"
                  >
                    {{ slide.buttonText }}
                  </a>
                </div>
              </div>
            </SwiperSlide>

          </Swiper>
        </div>
      </div>
    </section>

    <!-- دسته‌بندی‌ها - اسکرول افقی موبایل / اسلایدر دسکتاپ -->
    <section class="relative z-20 md:my-16 mt-6 md:mt-0">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Mobile: Simple Horizontal Scroll -->
        <div class="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div class="flex gap-2 pb-2">
            <NuxtLink
                v-for="cat in categories"
                :key="cat.id"
                :to="cat.href"
                class="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 hover:border-orange-300 active:scale-95 transition-all whitespace-nowrap shadow-sm"
            >
              <span class="text-xl">{{ getCategoryEmoji(cat.icon) }}</span>
              <span class="text-sm font-semibold text-gray-800">{{ cat.name }}</span>
              <span v-if="'count' in cat && cat.count" class="text-xs text-gray-500">{{ cat.count }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop: Slider -->
        <div class="hidden md:block pt-16">
          <KeenSlider
              :slidesPerView="6"
              :spaceBetween="16"
              :breakpoints="{
              640: { slidesPerView: 3, spaceBetween: 12 },
              768: { slidesPerView: 4, spaceBetween: 14 },
              1024: { slidesPerView: 5, spaceBetween: 14 },
              1280: { slidesPerView: 6, spaceBetween: 16 }
            }"
              :showNavigation="true"
              :showPagination="false"
              :loop="false"
          >
            <div v-for="cat in selectedCategories" :key="cat.id" class="keen-slider__slide">
              <NuxtLink :to="cat.href" class="category-card block h-full">
                <div
                    class="category-card-inner bg-white border-2 border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center h-full shadow-sm hover:shadow-md transition-all">
                  <div class="category-icon-wrapper w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                    <span class="text-5xl">{{ getCategoryEmoji(cat.icon) }}</span>
                  </div>
                  <h3 class="category-title text-sm font-bold text-gray-800 leading-tight">
                    {{ cat.name }}
                  </h3>
                  <p v-if="'count' in cat && cat.count" class="text-xs text-gray-500 mt-1">
                    {{ cat.count }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </KeenSlider>
        </div>
      </div>
    </section>

    <!-- جدیدترین پست‌ها -->
    <section class="py-6 md:py-12 bg-transparent md:bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-4 md:mb-8">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Icon name="flame" size="md" class="text-orange-600"/>
            </div>
            <h2 class="text-xl md:text-3xl font-bold text-gray-800">جدیدترین</h2>
          </div>
          <NuxtLink to="/categories"
                    class="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 text-sm md:text-base">
            همه
            <Icon name="arrow-left" size="sm"/>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <PostCard v-for="post in latestPosts" :key="post.id" :post="post"/>
        </div>
      </div>
    </section>

    <section v-for="cat in selectedCategories" :key="cat.id" class="py-2 md:py-2">
      <div v-if="cat.count>0" class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-4 md:mb-8">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Icon :name="cat.icon" size="md" class="text-orange-600"/>
            </div>
            <h2 class="text-xl md:text-3xl font-bold text-gray-800">{{ cat.name }}</h2>
          </div>
          <NuxtLink :to="`/categories/${cat.slug}`"
                    class="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 text-sm md:text-base">
            همه
            <Icon name="arrow-left" size="sm"/>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <PostCard v-for="post in getPostsWithRandomBanners(cat.slug)" :key="post.id" :post="post"/>
        </div>
        <section v-if="bannerSection">
          <AdBanner v-bind="bannerProps"/>
        </section>
<!--
        <AdBanner
            v-for="banner in bannerStore.bannersByCategory(cat.slug)"
            :key="banner.id"
            v-bind="banner"
            class="w-full"
        />-->
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// Performance-optimized imports
import {computed, onMounted, ref, watch} from 'vue'
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Autoplay, Pagination, EffectFade} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import {usePostStore} from "~/stores/post";
import {useCategoryTypeStore} from "~/stores/category-type";
import {useCategoryStore} from "~/stores/category";
import { useBannerStore } from '~/stores/banner'
import {type SliderSection, useSettingStore} from "~/stores/setting";


const settingStore=useSettingStore()
// Swiper modules
const SwiperAutoplay = Autoplay
const SwiperPagination = Pagination
const SwiperEffectFade = EffectFade
const postStore = usePostStore()
const bannerStore = useBannerStore()

// Type definitions for better TypeScript support
interface Category {
  id: number
  name: string
  icon: string
  count: string
  href: string
}

interface Post {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  readTime: number
  views: number
  image: string
  category: string
}

// Static data - moved outside reactive system for better performance
const categoryStore = useCategoryStore()
const categoryTypeStore = useCategoryTypeStore()
const categories = computed(() => categoryStore.categories || [])
const getPostsWithRandomBanners = (slug: string, limit = 3) => {
  const banners = bannerStore.bannersByCategory(slug)
  // پست‌های دسته
  const posts = postStore.posts
      .filter(post => post.categories?.some((c:any) => c.slug === slug))
      .slice(0, limit-banners.length)

  // بنرهای مرتبط با این دسته


  // کپی آرایه برای تغییر
  const mixed: any[] = [...posts]

  // درج تصادفی بنرها
  banners.forEach(banner => {
    const randomIndex = Math.floor(Math.random() * (mixed.length + 1))
    mixed.splice(randomIndex, 0, { __banner: true, data: banner })
  })

  return mixed
}
const allPosts = computed(() => postStore.posts)


const resolveLink = (slide:any) => {
  switch (slide.linkType) {
    case 'page':
      return `/page${slide.link}`
    case 'post':
      return `/post${slide.link}`
    case 'category':
      return `/categories${slide.link}`
    default:
      return slide.link // fallback
  }
}

// جدیدترین پست‌ها (4 تا)
//const latestPosts = computed(() => allPosts.value.slice(0, 4))
// تابع تبدیل نام آیکون به ایموجی
const getCategoryEmoji = (iconName: string): string => {
  const emojiMap: Record<string, string> = {
    'dogs': '🐕',
    'cats': '🐈',
    'birds': '🦜',
    'fishes': '🐠',
    'turtles': '🐢',
    'cows': '🐄',
    'rabbits': '🐰'
  }
  return emojiMap[iconName] || '🐾'
}
//const authStore=useAuthStore()


// Performance monitoring (client-side only)
onMounted(async () => {

  await settingStore.fetchPageSections()

  await postStore.fetchPosts()
  await categoryTypeStore.fetchType('post')
  // Log performance metrics in development
  try {
    if (typeof window !== 'undefined' && window.performance) {
      const paintEntries = performance.getEntriesByType('paint')
      if (paintEntries.length > 0) {
        console.log('Paint metrics:', paintEntries)
      }
    }
  } catch (error) {
    // Silently handle any performance API errors
  }
})

watch(
    () => categoryTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await categoryStore.fetchCategories({typeId: type.id, contentType: 'danim'})
      }
    },
    {immediate: true}
)

const postSection = computed(() =>
    settingStore.pageSections.find(s => s.type === "posts")
)

const latestPosts = computed(() => {
  if (!postSection.value) return []

  const { count, categoryId } = postSection.value.data

  let posts = postStore.posts

  // اگر دسته خاصی انتخاب شده
  if (categoryId) {
    posts = posts.filter(p => p.categories?.some((c:any) => c.id === categoryId))
  }

  // محدود کردن تعداد
  return posts.slice(0, count)
})
const slider = computed<SliderSection | null>(() =>
    settingStore.pageSections.find(
        (s): s is SliderSection => s.type === 'slider'
    ) || null
)


const mapBannerSettings = (section: any) => {
  const d = section.data

  return {
    id: String(section.id),
    title: d.title,
    description: d.description,
    ctaText: d.primaryButton,
    link: d.primaryLink,
    badge: d.subtitle,
    icon: d.icon ?? "star",
    iconColor: "text-white",

    gradientFrom: `from-[${d.gradientStart}]`,
    gradientTo: `to-[${d.gradientEnd}]`,
    bgClass: `bg-gradient-${d.gradientDirection}`,

    image: d.image || null,
  }
}

const bannerSection = computed(() =>
    settingStore.pageSections.find(s => s.type === "banner")
)

const bannerProps = computed(() =>
    bannerSection.value ? mapBannerSettings(bannerSection.value) : {}
)

const categoriesSection = computed(() =>
    settingStore.pageSections.find(s => s.type === "categories")
)

const selectedCategories = computed(() => {
  if (!categoriesSection.value) return []
  const ids = categoriesSection.value.data.selectedCategories
  return categories.value.filter(cat => ids.includes(String(cat.id)))
})


</script>

<style scoped>
/* Hero Swiper Styles */
.hero-swiper {
  width: 100%;
  height: 100%;
}

.hero-swiper :deep(.swiper) {
  width: 100%;
  height: 100%;
}

.hero-swiper :deep(.swiper-wrapper) {
  width: 100%;
  height: 100%;
}

.hero-swiper :deep(.swiper-slide) {
  width: 100%;
  height: 100%;
}

.hero-swiper :deep(.swiper-pagination) {
  bottom: 20px !important;
}

.hero-swiper :deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: white;
  opacity: 0.5;
  transition: all 0.3s;
}

.hero-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 32px;
  border-radius: 6px;
  background: white;
}

/* Hide scrollbar for mobile categories */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Performance-optimized styles */
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

/* GPU acceleration for smooth animations */
.will-change-auto {
  will-change: auto;
}

/* Optimized transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:-translate-x-1 {
  transform: translateX(-0.25rem);
}

/* Enhanced animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

/* Button styles */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #ea580c, #dc2626);
  color: white;
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.btn-primary:hover {
  background: linear-gradient(to right, #c2410c, #b91c1c);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #ea580c;
  font-weight: 500;
  border-radius: 0.75rem;
  border: 2px solid #fed7aa;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.btn-secondary:hover {
  border-color: #fdba74;
  background: #fff7ed;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Enhanced animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(-5px) rotate(-1deg);
  }
}

@keyframes float-delay {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-15px) rotate(-1deg);
  }
  66% {
    transform: translateY(-8px) rotate(1deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 8s ease-in-out infinite;
  animation-delay: 2s;
}

/* Categories Slider Styles */
.category-card {
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none;
}

.category-card-inner {
  height: 100%;
  min-height: 140px;
}

.category-icon-wrapper {
  flex-shrink: 0;
}

.category-title {
  line-height: 1.3;
}

/* Focus states for accessibility */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .transition-all,
  .transition-colors,
  .transition-transform,
  .transition-opacity {
    transition: none;
  }
}

/* Print styles */
@media print {
  .animate-fade-in,
  .animate-slide-up {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .bg-gradient-to-br,
  .bg-gradient-to-r {
    background: #f97316 !important;
    color: white !important;
  }
}
</style>
