<template>
  <section class="py-4 md:py-6">
    <div class="max-w-7xl mx-auto px-4">
      <NuxtLink 
        :to="link"
        class="block relative overflow-hidden rounded-2xl group"
      >
        <div
          :class="[
            'relative p-5 md:p-6 lg:p-8',
            bgClass,
            gradientFrom,
            gradientTo,
            'shadow-lg hover:shadow-xl transition-all duration-300',
            'overflow-hidden'
          ]"
        >
          <!-- Background Image (Mobile only) -->
          <div
            v-if="image"
            class="absolute inset-0 md:hidden"
          >
            <img
              :src="image"
              :alt="title"
              class="w-full h-full object-cover opacity-20"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
          </div>

          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" :style="backgroundPattern"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 grid md:grid-cols-2 gap-4 md:gap-6 items-center">
            <!-- Text Content -->
            <div :class="['text-center md:text-right', textAlign]">
              <!-- Badge/Label -->
              <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-2 md:mb-3">
                <Icon :name="icon" size="sm" :class="iconColor" />
                <span class="text-xs font-semibold text-white">{{ badge }}</span>
              </div>

              <!-- Title -->
              <h3 class="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-lg">
                {{ title }}
              </h3>

              <!-- Description -->
              <p v-if="description" class="text-white/90 text-xs md:text-sm lg:text-base mb-3 md:mb-4 leading-relaxed max-w-xl mx-auto md:mx-0">
                {{ description }}
              </p>

              <!-- CTA Button -->
              <button
                :class="[
                  'inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl',
                  !description ? 'mt-2 md:mt-3' : ''
                ]"
              >
                <span class="text-xs md:text-sm">{{ ctaText }}</span>
                <Icon name="arrow-left" size="sm" />
              </button>
            </div>

            <!-- Image/Icon (Desktop only) -->
            <div class="hidden md:flex justify-center md:justify-end">
              <div
                v-if="image"
                class="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden"
              >
                <img
                  :src="image"
                  :alt="title"
                  class="w-full h-full object-cover drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div
                v-else
                class="w-32 h-32 lg:w-40 lg:h-40 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
              >
                <Icon :name="icon" :size="60" class="text-white" />
              </div>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  id:string
  title: string
  description?: string
  ctaText: string
  link: string
  badge: string
  icon: string
  iconColor?: string
  gradientFrom: string
  gradientTo: string
  bgClass?: string
  textAlign?: string
  image?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'text-white',
  description: '',
  bgClass: 'bg-transparent',
  textAlign: 'md:text-right'
})
const backgroundPattern = {
  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
  backgroundSize: '30px 30px'
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.group:hover img {
  animation: float 3s ease-in-out infinite;
}
</style>
