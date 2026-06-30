<template>
  <footer
      class="py-10 text-center"
      :style="{ background: data.background || '#f8fafc' }"
  >
    <div class="container">

      <img v-if="data.logo" :src="data.logo" class="mx-auto h-14 mb-4" />

      <div v-if="data.menu?.length" class="flex justify-center space-x-6 mb-6">
        <NuxtLink
            v-for="item in data.menu"
            :key="item.text"
            :to="item.link"
            class="hover:text-primary-500"
        >
          {{ item.text }}
        </NuxtLink>
      </div>

      <p class="text-sm text-gray-500">
        {{ data.copyright }}
      </p>

    </div>
  </footer>
</template>

<script setup>
defineProps({ data: Object })
</script>
