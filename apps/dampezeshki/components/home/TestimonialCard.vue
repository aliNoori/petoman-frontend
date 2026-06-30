<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <!-- Rating Stars -->
    <div class="flex items-center mb-4">
      <div class="flex">
        <span 
          v-for="i in 5" 
          :key="i"
          class="text-yellow-400"
          :class="i <= parseInt(rating) ? 'text-yellow-400' : 'text-gray-300'"
        >
          ⭐
        </span>
      </div>
    </div>

    <!-- Testimonial Text -->
    <blockquote class="text-gray-700 mb-6 leading-relaxed font-vazir">
      "{{ text }}"
    </blockquote>

    <!-- Customer Info -->
    <div class="flex items-center">
      <div class="text-3xl mr-3">{{ avatar }}</div>
      <div>
        <div class="font-semibold text-gray-900 font-vazir">{{ name }}</div>
        <div class="text-sm text-gray-600 font-vazir">{{ role }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  role: string
  avatar: string
  rating: string
  text: string
}

defineProps<Props>()
</script>
