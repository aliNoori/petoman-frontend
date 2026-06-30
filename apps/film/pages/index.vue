<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-yellow-400">
    <HeaderFilm />

    <!-- Film Slider -->
    <div class="max-w-7xl mx-auto lg:px-4 pt-32 pb-8">
      <template v-if="sliderSettings.enabled">
        <FilmSlider :films="featuredFilmsFromStore" :settings="sliderSettings" />
      </template>

    </div>

    <main class="max-w-7xl mx-auto px-4 py-8">


      <!-- Categories Section -->
      <section class="mb-20 mt-20">

        <div class="flex items-center justify-between mb-8">

          <section class="mb-20">
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <NuxtLink
                  v-for="cat in categories"
                  :key="cat.id"
                  :to="`/categories?category=${cat.id}`"
                  class="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-700
             hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20
             transition-all duration-300 hover:-translate-y-1"
              >
                <div class="p-6 text-center">
                  <!-- Icon -->
                  <div
                      class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center
                 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  >
                    <i :class="[cat.icon, 'text-3xl text-black']"></i>
                  </div>

                  <!-- Title -->
                  <h3
                      class="text-xl font-bold text-white mb-2
                 group-hover:text-yellow-500 transition-colors"
                  >
                    {{ cat.name }}
                  </h3>

                  <!-- Description -->
                  <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {{ cat.description }}
                  </p>

                  <!-- Count -->
                  <div
                      class="mt-4 text-yellow-500 text-sm font-medium
                 bg-yellow-500/10 inline-block px-3 py-1 rounded-full"
                  >
                    {{ toPersian(cat.total) }} فیلم
                  </div>
                </div>
              </NuxtLink>

            </div>
          </section>

        </div>
      </section>

      <!-- Popular Films Section -->
      <section class="mb-20">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-yellow-500">محبوب‌ترین فیلم‌ها</h2>
            <p class="text-gray-400">پرتماشاترین محتوای این ماه</p>
          </div>
          <NuxtLink to="/movies" class="inline-flex items-center text-yellow-500 hover:text-yellow-500 transition-colors">
            مشاهده همه
            <i class="ti ti-arrow-left mr-2"></i>
          </NuxtLink>
        </div>

        <!-- Popular Films Slider -->
        <PopularFilmsSlider :films="popularFilms" />
      </section>

      <!-- Featured Film Banner -->
      <section v-if="featuredFilm" class="mb-20">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-zinc-900 to-black border border-film-yellow/30">

          <!-- Background Image -->
          <div class="absolute inset-0">
            <img
                :src="featuredFilm.poster"
                :alt="featuredFilm.title"
                class="w-full h-full object-cover opacity-30"
                loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 p-8 md:p-12">
            <div class="max-w-2xl">

              <!-- Badge & Rating -->
              <div class="flex items-center gap-4 mb-6">
          <span class="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            فیلم ویژه هفته
          </span>

                <div class="flex items-center gap-2 text-yellow-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="font-bold">{{ featuredFilm.rating ?? '4.9' }}</span>
                  <span class="text-gray-400">• {{ toPersian(featuredFilm.views ?? 25000) }} بازدید</span>
                </div>
              </div>

              <!-- Title -->
              <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {{ featuredFilm.title }}
              </h2>

              <!-- Description -->
              <p class="text-gray-300 text-lg mb-6 leading-relaxed">
                {{ featuredFilm.description }}
              </p>

              <!-- Meta -->
              <div class="flex items-center gap-4 mb-8 flex-wrap">
          <span class="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-lg text-sm">
            {{ featuredFilm.category }}
          </span>

                <span
                    v-if="featuredFilm.duration"
                    class="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-sm"
                >
            {{ toPersian(featuredFilm.duration) }} دقیقه
          </span>

                <span
                    v-if="featuredFilm.quality"
                    :class="getQualityClass(featuredFilm.quality)"
                >
            {{ featuredFilm.quality.toUpperCase() }}
          </span>

                <span class="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm">
            زیرنویس فارسی
          </span>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-4">
                <NuxtLink
                    :to="`/player/${featuredFilm.id}`"
                    class="group inline-flex items-center justify-center
                   bg-gradient-to-r from-yellow-500 to-orange-500 text-black
                   px-8 py-4 rounded-2xl font-bold
                   hover:from-orange-500 hover:to-red-500
                   transition-all duration-300 transform hover:scale-105
                   hover:shadow-xl hover:shadow-yellow-500/30"
                >
                  <svg class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  تماشا کن
                </NuxtLink>

                <button
                    @click="mediaStore.toggleFavorite(featuredFilm.id,featuredFilm.type)"
                    class="group inline-flex items-center justify-center
                   border-2 border-film-yellow text-yellow-500
                   px-8 py-4 rounded-2xl font-bold
                   hover:bg-yellow-500 hover:text-black
                   transition-all duration-300"
                >
                  <i :class="mediaStore.isFavorite(featuredFilm.id,featuredFilm.type) ? 'ti ti-heart-filled' : 'ti ti-heart'"></i>
                  افزودن به علاقه‌مندی‌ها
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>


      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
            v-for="item in newestContents"
            :key="item.id"
            class="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700
           hover:border-film-yellow hover:shadow-lg hover:shadow-film-yellow/20
           transition-all duration-300"
        >
          <div class="flex">
            <!-- Poster -->
            <div class="relative w-1/3">
              <img
                  :src="item.poster"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
              >
              <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

              <!-- Badge -->
              <div
                  v-if="item.isNew"
                  class="absolute top-2 right-2 bg-yellow-500 text-black
                 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                جدید
              </div>

              <div
                  v-else-if="item.quality"
                  :class="['absolute top-2 right-2', getQualityClass(item.quality)]"
              >
                {{ item.quality.toUpperCase() }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 p-5">
              <div class="flex items-center gap-2 mb-3">
          <span
              class="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full
                   text-xs font-medium border border-blue-500/30"
          >
            {{ item.category }}
          </span>
                <span class="text-gray-500 text-xs">•</span>
                <span class="text-gray-400 text-xs">
            {{ timeAgo(item.createdAt) }}
          </span>
              </div>

              <h3
                  class="text-lg font-bold text-white mb-2
                 group-hover:text-yellow-500 transition-colors"
              >
                {{ item.title }}
              </h3>

              <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                {{ item.description }}
              </p>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-xs">
            <span v-if="item.duration" class="text-gray-400">
              {{ toPersian(item.duration) }} دقیقه
            </span>

                  <span
                      class="flex items-center gap-1 text-yellow-500
                     bg-yellow-500/10 px-2 py-1 rounded-full"
                  >
              ⭐ {{ item.rating }}
            </span>
                </div>

                <div class="flex gap-2">
                  <button
                      @click="mediaStore.toggleWatchlist(item.id,item.type)"
                      class="px-4 py-2 rounded-lg transition-colors"
                      :class="mediaStore.isWatchlist(item.id,item.type)
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'"
                  >
                    <i :class="mediaStore.isWatchlist(item.id,item.type) ? 'ti ti-bookmark-filled' : 'ti ti-bookmark'"></i>
                  </button>

                  <NuxtLink
                      :to="`/player/${item.id}`"
                      class="bg-yellow-500 text-black px-4 py-2
                     rounded-lg font-bold text-sm
                     hover:shadow-lg transition-all
                     duration-200 transform hover:scale-105"
                  >
                    تماشا
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <FooterFilm />
  </div>
</template>

<script setup lang="ts">
import { onMounted,computed } from 'vue'
import {useCategoryTypeStore} from "~/stores/category-type";
import {useCategoryStore} from "~/stores/category";
import {useMediaStore} from "~/stores/media";
import {useFilmSettingStore} from "~/stores/setting";
//import {useOmdbApi} from "~/services/omdb";
//import {useCustomApis} from "~/services/custom-api";
const settingStore=useFilmSettingStore()

const metaTitle = computed(() => settingStore.settings?.seo.metaTitle ?? 'عنوان پیش‌فرض')
const metaDescription = computed(() => settingStore.settings?.seo.metaDescription ?? 'توضیحات پیش‌فرض')

export type SliderEffect =
    | 'slide'
    | 'fade'
    | 'cube'
    | 'coverflow'
    | 'flip'
interface Slide {
  title: string
  subtitle?: string
  description?: string
  image: string
  ctaText?: string
  ctaLink?: string
  active: boolean
}


export interface SliderSettings {
  enabled: boolean
  autoplay: boolean
  speed: number
  effect: SliderEffect
  loop: boolean
  height: number
  navigation: boolean
  pagination: boolean
  slides:Slide[]
}
const allowedEffects: SliderEffect[] = [
  'slide',
  'fade',
  'cube',
  'coverflow',
  'flip'
]

const general = computed(() => settingStore.settings?.general)
const slides = computed(() =>
    general.value?.slides?.filter(s => s.active) ?? []
)

const sliderSettings = computed<SliderSettings>(() => {
  const effect = general.value?.sliderEffect

  return {
    enabled: general.value?.sliderEnabled ?? true,
    autoplay: general.value?.sliderAutoplay ?? true,
    speed: (general.value?.sliderSpeed ?? 1) * 1000,
    effect: allowedEffects.includes(effect as SliderEffect)
        ? (effect as SliderEffect)
        : 'slide',
    loop: general.value?.sliderLoop ?? true,
    height: general.value?.sliderHeight ?? 400,
    navigation: general.value?.sliderNavigation ?? true,
    pagination: general.value?.sliderPagination ?? true,
    slides:slides.value
  }
})

// Page Configuration
onMounted(async () => {
  console.log('settings', settingStore.settings)

  document.title = metaTitle.value

  // Meta tags for SEO
  const metaTags = [
    {name: 'description', content: 'پلتفرم فیلم حیوانات - مجموعه‌ای غنی از مستندات، آموزش‌ها و محتوای سرگرم‌کننده درباره دنیای حیوانات و طبیعت. تماشای آنلاین با کیفیت بالا.'},
    {name: 'keywords', content: 'فیلم حیوانات، مستند طبیعت، آموزش حیوانات، ویدیو طبیعت، مستند حیات وحش، فیلم آموزشی، طبیعت ایران'},
    {name: 'author', content: 'فیلم حیوانات'},
    {name: 'robots', content: 'index, follow'},
    {property: 'og:title', content: 'فیلم حیوانات | بهترین پلتفرم مستندات طبیعت'},
    {property: 'og:description', content: 'دنیای شگفت‌انگیز مستندات، آموزش و سرگرمی حیوانات را کشف کنید'},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://petomanapp.com'},
    {property: 'og:image', content: 'https://petomanapp.com/images/home-og.jpg'},
    {property: 'og:site_name', content: 'فیلم حیوانات'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: 'فیلم حیوانات | مستندات طبیعت'},
    {name: 'twitter:description', content: 'پلتفرم تماشای آنلاین مستندات و آموزش‌های حیوانات'},
    {name: 'twitter:image', content: 'https://petomanapp.com/images/home-twitter.jpg'}
  ]

  metaTags.forEach(({name, property, content}) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
    let tag = document.querySelector(selector) as HTMLMetaElement
    if (!tag) {
      tag = document.createElement('meta')
      if (name) tag.setAttribute('name', name)
      if (property) tag.setAttribute('property', property)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  })
})
const toPersian = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return '۰'

  const persianNumbers = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']

  return value
      .toString()
      .replace(/\d/g, d => persianNumbers[Number(d)])
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  movie: number;
  series: number;
  animation: number;
  documentary: number;
  total: number;
}


const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()

interface FilmSlider {
  id: string
  title: string
  description: string
  poster: string
  releaseDate?: string
  type?: string
  category?: string
}

interface FilmPopular {
  id: string
  title: string
  description: string
  poster: string
  category: string
  releaseDate?: string
  type?: string
  isNew?: boolean
  badge?: string
  quality?: string
  qualityClass?: string
  createdAt?: string
}
const mediaStore = useMediaStore()
const categories = computed<Category[]>(() => {
  const filmTypeId = categoryTypeStore.idBySlug('film')
  if (!filmTypeId) return []

  return categoryStore
      .getCategories(String(filmTypeId))
      .map((item: any) => ({
        id: item.slug,
        name: item.name,
        icon: item.icon ?? 'ti ti-tree',
        description: item.description ?? '',
        movie: item.movie ?? 0,
        series: item.series ?? 0,
        animation: item.animation ?? 0,
        documentary: item.documentary ?? 0,
        total: item.total ?? 0,
      }))
      .filter(item => item.total > 0)
})



const featuredFilmsFromStore = computed<FilmSlider[]>(() =>
    mediaStore.getAllMovieAndSeries.map(f => ({
      id: f.id,
      title: f.title,
      description: f.description ?? '',
      poster: f.poster,
      releaseDate: f.year?.toString(),
      type: f.type,
      category: f.category,
    }))
)
const getQualityClass = (quality?: string) => {
  if (!quality) return ''

  switch (quality.toLowerCase()) {
    case '260p':
    case '360p':
      return 'bg-zinc-500/20 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium border border-zinc-500/30'

    case '440p':
      return 'bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30'

    case '720p':
    case 'hd':
      return 'bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30'

    case '1080p':
    case 'fullhd':
      return 'bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30'

    case '1808p':
    case '4k':
      return 'bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30'

    default:
      return 'bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-medium border border-gray-500/30'
  }
}


const popularFilms = computed<FilmPopular[]>(() =>
    mediaStore.getAllMovieAndSeries.map(f => ({
      id: f.id,
      title: f.title,
      description: f.description ?? '',
      poster: f.poster,
      releaseDate: f.year?.toString(),
      type: f.type,
      category: f.category,
      createdAt: f.createdAt,
      isNew:f.isNew,
      badge:f.badge??'جدید',
      quality:f.quality,
      qualityClass:getQualityClass(f.quality)
    }))
)


const featuredFilm = computed(() => {
  return mediaStore.getAllMovieAndSeries.find(f => f.isFeatured)
      ?? mediaStore.getAllMovieAndSeries[0]
})

const timeAgo = (date?: string) => {
  if (!date) return 'نامشخص'

  const now = Date.now()
  const past = new Date(date).getTime()

  const diffMs = now - past
  if (diffMs < 0) return 'لحظاتی پیش' // برای اختلاف timezone

  const diffMinutes = Math.floor(diffMs / 1000 / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'همین الان'
  if (diffMinutes < 60) return `${toPersian(diffMinutes)} دقیقه پیش`
  if (diffHours < 24) return `${toPersian(diffHours)} ساعت پیش`
  if (diffDays < 7) return `${toPersian(diffDays)} روز پیش`

  return new Date(date).toLocaleDateString('fa-IR')
}



const newestContents = computed(() => {
  return [...mediaStore.getAllMovieAndSeries]
      .sort((a, b) => {
        const aDate = new Date(a.createdAt ?? 0).getTime()
        const bDate = new Date(b.createdAt ?? 0).getTime()
        return bDate - aDate
      })
      .slice(0, 2)
      .map(item => ({
        id: item.id,
        type:item.type,
        title: item.title,
        description: item.description ?? '',
        poster: item.poster,
        category: item.category,
        duration: item.duration,
        rating: item.rating ?? 4.5,
        quality: item.quality,
        createdAt: item.createdAt,
        isNew: true
      }))
})


</script>
