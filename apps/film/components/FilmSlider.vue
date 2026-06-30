<template>
  <div class="film-slider">
    <!-- Desktop Slider -->
    <div class="hidden lg:block">
      <Swiper
          :modules="[Navigation, Pagination, Autoplay, EffectCube]"
          :slides-per-view="1"
          :space-between="0"
          :loop="props.settings?.loop"
          :speed="props.settings?.speed"
          :effect="props.settings?.effect"
          :navigation="props.settings?.navigation"
          :pagination="props.settings?.pagination ? { clickable: true } : false"
          :autoplay="props.settings?.autoplay
              ? { delay: 4000, disableOnInteraction: false }
              : false"
          class="desktop-slider"
          :style="{ height: props.settings?.height + 'px' }"
      >
        <SwiperSlide v-for="film in featuredFilms" :key="film.id">
          <div class="relative h-full overflow-hidden rounded-3xl group cursor-pointer" @click="selectFilm(film)">
            <!-- Background Image -->
            <img
                :src="film.poster"
                :alt="film.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            <!-- Content -->
            <div class="absolute inset-0 flex items-center">
              <div class="max-w-2xl mx-auto px-8 text-center">
                <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {{ film.title }}
                </h2>
                <p class="text-xl text-yellow-200/90 mb-8 leading-relaxed">
                  {{ film.description }}
                </p>

                <button
                    @click.stop="playFilm(film)"
                    class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
                >
                  <i class="ti ti-player-play-filled text-xl"></i>
                  تماشای فیلم
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
<!--<SwiperSlide v-for="(slide, i) in props.settings?.slides" :key="i">
          <img :src="slide.image" />

          <h2>{{ slide.title }}</h2>
          <p>{{ slide.subtitle }}</p>

          <a
              v-if="slide.ctaLink"
              :href="slide.ctaLink"
              class="btn"
          >
            {{ slide.ctaText }}
          </a>
        </SwiperSlide>-->

      </Swiper>
    </div>

    <!-- Mobile Slider -->
    <div class="lg:hidden">
      <Swiper
          :modules="[Pagination, Autoplay]"
          :slides-per-view="1.2"
          :space-between="16"
          :centered-slides="true"
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :loop="featuredFilms.length > 2"
          class="mobile-slider"
      >
        <SwiperSlide v-for="film in featuredFilms" :key="film.id">
          <div
              class="relative aspect-[16/9] overflow-hidden rounded-2xl group cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-800 border border-yellow-400/20"
              @click="selectFilm(film)"
          >
            <!-- Background Image -->
            <img
                :src="film.poster"
                :alt="film.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            <!-- Play Button Overlay -->
            <div
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <i class="ti ti-player-play-filled text-black text-2xl"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">
                {{ film.title }}
              </h3>

              <p class="text-sm text-yellow-200/70 line-clamp-2">
                {{ film.description }}
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Navigation, Pagination, Autoplay, EffectCube} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type {SliderSettings} from "~/pages/index.vue";


interface Film {
  id: string
  title: string
  description: string
  poster: string
  releaseDate?: string
  type?: string
  category?: string
}
const props = defineProps<{
  films: Film[],
  settings?: SliderSettings
}>()

const featuredFilms = computed(() => props.films)
// Featured films data
/*const featuredFilms = ref([
  {
    id: 1,
    title: 'نجات گربه‌های خیابانی',
    description: 'مستندی تأثیرگذار درباره نجات و مراقبت از گربه‌های بی‌خانمان در شهرهای بزرگ',
    poster: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=600&fit=crop',
    category: 'rescue'
  },
  {
    id: 2,
    title: 'شیرهای آفریقا',
    description: 'مستندی شگفت‌انگیز از زندگی شیرها در طبیعت وحشی آفریقا و مبارزه برای بقا',
    poster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=600&fit=crop',
    category: 'nature'
  },
  {
    id: 3,
    title: 'دنیای دلفین‌ها',
    description: 'کشف دنیای زیرآبی دلفین‌ها و هوش شگفت‌انگیز این موجودات دریایی',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    category: 'education'
  },
  {
    id: 4,
    title: 'پرندگان مهاجر',
    description: 'سفر طولانی و خطرناک پرندگان مهاجر از قطب شمال تا جنوب کره زمین',
    poster: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&h=600&fit=crop',
    category: 'nature'
  }
])*/
const router = useRouter()
const selectFilm = (film: Film) => {
  console.log('Selected film:', film.title)
  // Navigate to film page
  router.push(`/player/${film.id}`)
}


const playFilm = (film: Film) => {
  console.log('Playing film:', film.title)
  router.push(`/player/${film.id}`)
}
</script>

<style scoped>
.film-slider {
  position: relative;
}

.desktop-slider :deep(.swiper-button-next),
.desktop-slider :deep(.swiper-button-prev) {
  color: rgb(250 204 21);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: color 0.3s ease;
}

.desktop-slider :deep(.swiper-button-next:hover),
.desktop-slider :deep(.swiper-button-prev:hover) {
  color: rgb(253 224 71);
}

.desktop-slider :deep(.swiper-button-next:after),
.desktop-slider :deep(.swiper-button-prev:after) {
  font-size: 18px;
}

.desktop-slider :deep(.swiper-pagination-bullet) {
  background-color: rgba(250, 204, 21, 0.5);
  width: 12px;
  height: 12px;
}

.desktop-slider :deep(.swiper-pagination-bullet-active) {
  background-color: rgb(250 204 21);
}

.mobile-slider :deep(.swiper-pagination-bullet) {
  background-color: rgba(250, 204, 21, 0.5);
  width: 8px;
  height: 8px;
}

.mobile-slider :deep(.swiper-pagination-bullet-active) {
  background-color: rgb(250 204 21);
}

.mobile-slider :deep(.swiper-pagination) {
  bottom: 10px;
}

</style>
