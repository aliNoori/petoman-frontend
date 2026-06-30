<template>
  <div
      v-if="data.bannerType === 'gradient'"
      :style="{
      background: `linear-gradient(${data.gradientDirection}, ${data.gradientStart}, ${data.gradientEnd})`
    }"
      class="p-8 rounded-3xl text-center"
  >
    <h2 class="text-3xl font-bold">{{ data.title }}</h2>
    <p class="mt-2">{{ data.subtitle }}</p>

    <NuxtLink
        v-if="data.primaryButton"
        :to="data.primaryLink"
        class="btn-primary mt-4 inline-block"
    >
      {{ data.primaryButton }}
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({ data: Object })
</script>
