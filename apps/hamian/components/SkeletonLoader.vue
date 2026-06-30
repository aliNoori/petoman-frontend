<template>
  <div class="animate-pulse">
    <!-- Video Card Skeleton -->
    <div v-if="type === 'video-card'" class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="w-full h-48 bg-gray-200"></div>
      <div class="p-4">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="flex items-center justify-between">
          <div class="h-3 bg-gray-200 rounded w-20"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Category Card Skeleton -->
    <div v-else-if="type === 'category-card'" class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
        <div class="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div class="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-full"></div>
    </div>

    <!-- Text Block Skeleton -->
    <div v-else-if="type === 'text-block'" class="space-y-3">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Form Field Skeleton -->
    <div v-else-if="type === 'form-field'" class="space-y-2">
      <div class="h-4 bg-gray-200 rounded w-24"></div>
      <div class="h-12 bg-gray-200 rounded w-full"></div>
    </div>

    <!-- Button Skeleton -->
    <div v-else-if="type === 'button'" class="h-12 bg-gray-200 rounded-lg w-32"></div>

    <!-- Avatar Skeleton -->
    <div v-else-if="type === 'avatar'" class="w-12 h-12 bg-gray-200 rounded-full"></div>

    <!-- Header Skeleton -->
    <div v-else-if="type === 'header'" class="space-y-4">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list-item'" class="flex items-center space-x-reverse space-x-4 p-4">
      <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Grid Skeleton -->
    <div v-else-if="type === 'grid'" class="grid gap-6" :class="gridClass">
      <div 
        v-for="i in count" 
        :key="i" 
        class="bg-gray-200 rounded-lg h-48"
      ></div>
    </div>

    <!-- Full Page Skeleton -->
    <div v-else-if="type === 'page'" class="space-y-8">
      <!-- Header -->
      <div class="space-y-4">
        <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      
      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-gray-200 rounded-lg h-64"></div>
      </div>
      
      <!-- Bottom Content -->
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else class="space-y-3">
      <div 
        v-for="line in lines" 
        :key="line"
        class="h-4 bg-gray-200 rounded"
        :class="getLineWidth(line)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'video-card' | 'category-card' | 'text-block' | 'form-field' | 'button' | 'avatar' | 'header' | 'list-item' | 'grid' | 'page' | 'custom'
  lines?: number
  count?: number
  gridCols?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'custom',
  lines: 3,
  count: 6,
  gridCols: 3
})

const gridClass = computed(() => {
  const cols = props.gridCols
  if (cols === 1) return 'grid-cols-1'
  if (cols === 2) return 'grid-cols-1 md:grid-cols-2'
  if (cols === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  if (cols === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
})

const getLineWidth = (lineIndex: number) => {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/6', 'w-2/6']
  return widths[lineIndex % widths.length] || 'w-full'
}
</script>

<style scoped>
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
