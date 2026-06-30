<template>
  <div class="h-screen w-full bg-gray-50">
    <slot />
  </div>
</template>

<script setup>
// Full screen layout for chat pages - no header, no sidebar
definePageMeta({
  layout: false
})
</script>