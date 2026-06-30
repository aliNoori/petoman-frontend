<template>
  <div class="animate-pulse rounded-2xl border bg-white overflow-hidden shadow-sm">
    <!-- Header Section -->
    <div class="p-4 pb-3">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex-1">
          <div class="h-5 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-12"></div>
            <div class="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <div class="h-6 bg-gray-200 rounded-full w-16"></div>
          <div class="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      <!-- Address -->
      <div class="flex items-start gap-1 mb-3">
        <div class="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
        <div class="flex-1 space-y-1">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Services Tags -->
      <div class="flex flex-wrap gap-1 mb-3">
        <div v-for="i in 3" :key="i" class="h-5 bg-gray-200 rounded-full w-16"></div>
        <div class="h-5 bg-gray-200 rounded-full w-8"></div>
      </div>

      <!-- Features Row -->
      <div class="flex items-center gap-3 mb-3">
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="bg-gray-50 px-4 py-3 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <div class="h-8 bg-gray-200 rounded-lg w-16"></div>
          <div class="h-8 bg-gray-200 rounded-lg w-20"></div>
        </div>
        <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Skeleton component - no props needed
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
