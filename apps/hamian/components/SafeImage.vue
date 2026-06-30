<template>
  <div class="safe-image-wrapper" :class="wrapperClass">
    <img 
      v-if="!hasError"
      :src="src || fallbackSrc"
      :alt="alt"
      :class="imgClass"
      @error="handleError"
      @load="handleLoad"
    />
    <div 
      v-else
      class="fallback-placeholder"
      :class="imgClass"
      :style="{ backgroundColor: bgColor }"
    >
      <i :class="`ti ${icon} text-gray-400`" :style="{ fontSize: iconSize }"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  src?: string
  alt?: string
  fallbackSrc?: string
  icon?: string
  iconSize?: string
  bgColor?: string
  imgClass?: string
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  fallbackSrc: '/images/default-avatar.svg',
  icon: 'ti-photo',
  iconSize: '3rem',
  bgColor: '#f3f4f6',
  imgClass: '',
  wrapperClass: ''
})

const hasError = ref(false)
const isLoaded = ref(false)

const handleError = () => {
  hasError.value = true
}

const handleLoad = () => {
  isLoaded.value = true
}
</script>

<style scoped>
.safe-image-wrapper {
  position: relative;
  overflow: hidden;
}

.fallback-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
