<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <nav class="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-6">
    <NuxtLink 
      to="/" 
      class="flex items-center gap-1 hover:text-orange-600 transition-colors duration-200"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21l4-4 4 4"></path>
      </svg>
      خانه
    </NuxtLink>
    
    <template v-for="(item, index) in items" :key="index">
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      
      <NuxtLink 
        v-if="item.href && !item.current"
        :to="item.href"
        class="hover:text-orange-600 transition-colors duration-200"
      >
        {{ item.name }}
      </NuxtLink>
      
      <span 
        v-else
        :class="[
          'font-medium',
          item.current ? 'text-orange-600' : 'text-gray-900'
        ]"
      >
        {{ item.name }}
      </span>
    </template>
  </nav>
</template>
