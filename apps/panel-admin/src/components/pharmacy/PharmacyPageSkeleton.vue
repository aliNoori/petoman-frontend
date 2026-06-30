<template>
  <div class="space-y-4">
    <div class="animate-pulse">
      <!-- Header Skeleton -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div class="bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-8">
          <div class="flex items-center justify-between">
            <div>
              <div class="h-8 bg-gray-300 rounded-lg w-64 mb-3"></div>
              <div class="h-4 bg-gray-300 rounded w-48"></div>
            </div>
            <div class="hidden md:flex gap-4">
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-300 rounded-full mb-2 mx-auto"></div>
                <div class="h-3 bg-gray-300 rounded w-16"></div>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-300 rounded-full mb-2 mx-auto"></div>
                <div class="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Stats Cards Skeleton -->
        <div class="bg-white px-6 py-6">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <div class="h-6 bg-gray-300 rounded w-12 mx-auto mb-1"></div>
              <div class="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Skeleton -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex gap-4 mb-4">
          <div class="flex-1 h-12 bg-gray-200 rounded-lg"></div>
          <div class="w-32 h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>

      <!-- Interactive Features Bar Skeleton -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex gap-4">
            <div class="h-10 bg-gray-200 rounded-lg w-32"></div>
            <div class="h-10 bg-gray-200 rounded-lg w-28"></div>
          </div>
          <div class="flex bg-gray-100 rounded-lg p-1">
            <div class="w-10 h-10 bg-gray-200 rounded-md"></div>
            <div class="w-10 h-10 bg-gray-200 rounded-md ml-1"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PharmacyCardSkeleton v-for="i in count" :key="i" />
    </div>
  </div>
</template>

<script setup>
import PharmacyCardSkeleton from './PharmacyCardSkeleton.vue'

defineProps({
  count: {
    type: Number,
    default: 6
  }
})
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