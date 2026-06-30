<template>
  <div
      @click="goToDetail"
      class="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900/80 to-zinc-800/60
           border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300
           hover:scale-[1.03] hover:shadow-xl hover:shadow-yellow-400/20"
  >
    <!-- Poster -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <img
          v-if="item.poster"
          :src="item.poster"
          :alt="item.title"
          class="w-full h-full object-cover"
      />

      <div v-else class="w-full h-full bg-zinc-800 flex items-center justify-center">
        <i class="ti ti-photo-off text-yellow-400 text-3xl"></i>
      </div>


      <!-- Overlay -->
      <div
          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
      ></div>

      <!-- Rating -->
      <div
          class="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm
               px-3 py-1 rounded-xl border border-yellow-400/30"
      >
        <i class="ti ti-star-filled text-yellow-400 text-sm"></i>
        <span class="text-yellow-400 font-bold text-sm">
          {{ item.rating ?? '—' }}
        </span>
      </div>

      <!-- Type badge -->
      <div
          class="absolute top-3 right-3 bg-yellow-400/90 text-black text-xs font-bold
               px-3 py-1 rounded-xl"
      >
        {{ typeLabel }}
      </div>

      <!-- Play Icon -->
      <div
          class="absolute inset-0 flex items-center justify-center opacity-0
               group-hover:opacity-100 transition-opacity"
      >
        <div
            class="w-16 h-16 rounded-full bg-yellow-400/90 flex items-center justify-center
                 shadow-lg"
        >
          <i class="ti ti-player-play-filled text-black text-3xl mr-[-2px]"></i>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4 space-y-2">
      <h3
          class="text-white font-bold text-sm line-clamp-2 group-hover:text-yellow-300 transition-colors"
      >
        {{ item.title }}
      </h3>

      <div class="flex items-center justify-between text-xs text-yellow-200/60">
        <span>{{ item.year }}</span>
        <span>{{ formattedDuration }}</span>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useRouter} from "nuxt/app";
import type {MediaItem} from "~/stores/media";

type MediaType = 'movie' | 'series' | 'animation' | 'documentary'


const props = defineProps<{
  item: MediaItem
}>()

const router = useRouter()

const typeLabelMap: Record<MediaType, string> = {
  movie: 'فیلم',
  series: 'سریال',
  animation: 'انیمیشن',
  documentary: 'مستند',
}

const typeLabel = computed(() => {
  return typeLabelMap[props.item?.type] ?? '—'
})


const formattedDuration = computed(() => {
  if (!props.item.duration) return '—'
  const h = Math.floor(props.item.duration / 60)
  const m = props.item.duration % 60
  return h > 0 ? `${h}س ${m}د` : `${m} دقیقه`
})

const goToDetail = () => {
  if (!props.item?.slug || !props.item?.type) return
  router.push(`/player/${props.item.id}`)
}

</script>
