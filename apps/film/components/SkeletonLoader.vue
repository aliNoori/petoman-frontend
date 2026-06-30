<template>
  <div class="skeleton-loader">
    <div 
      v-for="index in count" 
      :key="index"
      class="skeleton-item bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-2xl overflow-hidden relative"
    >
      <!-- Skeleton Image -->
      <div class="aspect-[16/9] bg-zinc-700 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/30 to-transparent animate-shimmer"></div>
      </div>
      
      <!-- Skeleton Content -->
      <div class="p-4 space-y-3">
        <!-- Title -->
        <div class="h-4 bg-zinc-600 rounded animate-pulse"></div>
        
        <!-- Meta Info -->
        <div class="flex space-x-3 space-x-reverse">
          <div class="h-3 bg-zinc-600 rounded animate-pulse w-16"></div>
          <div class="h-3 bg-zinc-600 rounded animate-pulse w-12"></div>
          <div class="h-3 bg-zinc-600 rounded animate-pulse w-20"></div>
        </div>
        
        <!-- Rating -->
        <div class="flex items-center space-x-2 space-x-reverse">
          <div class="h-3 bg-zinc-600 rounded animate-pulse w-8"></div>
          <div class="h-3 bg-zinc-600 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  count: {
    type: Number,
    default: 5
  }
})
</script>

<style scoped>
.skeleton-loader {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .skeleton-loader {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
}

.skeleton-item {
  border: 1px solid rgba(250, 204, 21, 0.1);
}

/* Shimmer Animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>