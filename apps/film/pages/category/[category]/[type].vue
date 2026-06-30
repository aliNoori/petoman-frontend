<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
    <HeaderFilm />

    <!-- Hero -->
    <section class="pt-32 pb-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4"
        >
          {{ categoryTitle }} - {{ typeTitle }}
        </h1>

        <p class="text-yellow-200/70">
          نمایش محتواهای مربوط به این دسته‌بندی
        </p>
      </div>
    </section>

    <!-- Content Grid -->
    <section class="pb-20">
      <div class="max-w-7xl mx-auto px-4">

        <div
            v-if="items.length === 0"
            class="text-center text-yellow-200/60 py-20"
        >
          محتوایی برای نمایش وجود ندارد
        </div>

        <div
            v-else
            class="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <MediaCard
              v-for="item in items"
              :key="item.id"
              :item="item"
          />
        </div>

      </div>
    </section>

    <FooterFilm />
  </div>
</template>

<script setup lang="ts">
import { useRoute} from "nuxt/app";
import { computed } from 'vue'
import {type MediaItem, useMediaStore} from "~/stores/media";

type CategoryType = 'movie' | 'series' | 'animation' | 'documentary'

const route = useRoute()

const category = computed(() => {
  const c = route.params.category
  return Array.isArray(c) ? c[0] : c ?? ''
})

const type = computed<CategoryType>(() => {
  const t = route.params.type
  const value = Array.isArray(t) ? t[0] : t

  if (value === 'movie' || value === 'series' || value === 'animation' || value === 'documentary') {
    return value
  }

  return 'movie'
})

const typeTitleMap: Record<CategoryType, string> = {
  movie: 'فیلم',
  series: 'سریال',
  animation: 'انیمیشن',
  documentary: 'مستند',
}

const categoryTitle = computed(() => category.value)
const typeTitle = computed(() => {
  return typeTitleMap[type.value] ?? '—'
})
const mediaStore=useMediaStore()
const items = computed(() => {

  if(type.value === 'movie'){
    return mediaStore.films.filter(
        ( m:MediaItem) => m.slug === category.value
    )
  }

  if(type.value === 'series'){
    return mediaStore.series.filter(
        ( m:MediaItem) => m.slug === category.value
    )
  }


  if(type.value === 'animation'){
    return mediaStore.animations.filter(
        ( m:MediaItem) => m.slug === category.value
    )
  }

  if(type.value === 'documentary'){
    return mediaStore.documentaries.filter(
        ( m:MediaItem) => m.slug === category.value
    )
  }

})
</script>
