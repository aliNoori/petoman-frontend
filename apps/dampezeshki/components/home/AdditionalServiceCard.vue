<template>
  <NuxtLink
    :to="link"
    class="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
  >
    <div class="flex items-center mb-3">
      <div class="text-2xl mr-3">{{ icon }}</div>
      <h4 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors font-vazir">
        {{ title }}
      </h4>
    </div>
    <p class="text-gray-600 text-sm font-vazir">
      {{ description }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  link: string
}

defineProps<Props>()
</script>
