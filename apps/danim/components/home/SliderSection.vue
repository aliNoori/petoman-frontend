<template>
  <Swiper
      :modules="[Autoplay, Pagination, EffectFade]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: data.speed * 1000 }"
  >
    <SwiperSlide v-for="(slide, i) in data.slides" :key="i">
      <img :src="slide.image" class="w-full h-full object-cover" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Autoplay, Pagination, EffectFade} from 'swiper/modules'

defineProps({
  data: Object
})
</script>
