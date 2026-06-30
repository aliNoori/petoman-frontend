<template>
  <header
      class="w-full py-4"
      :style="{ background: data.background || '#ffffff' }"
  >
    <div class="container flex justify-between items-center">
      <NuxtLink to="/">
        <img :src="data.logo" class="h-10" />
      </NuxtLink>

      <nav class="hidden md:flex space-x-6">
        <NuxtLink
            v-for="item in data.menu"
            :key="item.text"
            :to="item.link"
            class="hover:text-primary-500"
        >
          {{ item.text }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
defineProps({ data: Object })
</script>
