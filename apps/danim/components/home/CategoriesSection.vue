<template>
  <div class="py-10">
    <h2 class="text-2xl font-bold mb-4">{{ data.title }}</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <NuxtLink
          v-for="id in data.selectedCategories"
          :key="id"
          :to="`/categories/${id}`"
          class="bg-white p-4 rounded-2xl shadow"
      >
        {{ id }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({ data: Object })
</script>
