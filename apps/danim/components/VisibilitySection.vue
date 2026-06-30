<template>
  <div ref="container" class="lazy-section">
    <div v-if="isVisible" class="animate-fade-in">
      <slot />
    </div>
    <div v-else class="skeleton-loader">
      <slot name="fallback">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref<HTMLElement>()
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && container.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer?.disconnect()
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )
    
    observer.observe(container.value)
  } else {
    // Fallback for SSR or browsers without IntersectionObserver
    isVisible.value = true
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.lazy-section {
  min-height: 100px;
}

.skeleton-loader {
  padding: 1rem;
}

@keyframes fadeIn {
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
  animation: fadeIn 0.5s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }
}
</style>
