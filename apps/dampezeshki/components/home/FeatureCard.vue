<template>
  <div class="group">
    <div class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300 h-full">
      <!-- Icon -->
      <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {{ icon }}
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 mb-3 font-vazir">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 mb-4 leading-relaxed font-vazir">
        {{ description }}
      </p>

      <!-- Benefits List -->
      <ul class="space-y-2">
        <li 
          v-for="benefit in benefits" 
          :key="benefit"
          class="flex items-start text-sm text-gray-600 font-vazir"
        >
          <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          {{ benefit }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  benefits: string[]
}

defineProps<Props>()
</script>
