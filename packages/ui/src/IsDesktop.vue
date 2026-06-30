<template>
  <div v-show="isDesktop" class="desktop-only">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isDesktop = ref(true);

const checkDesktop = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  checkDesktop();
  window.addEventListener('resize', checkDesktop);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop);
});
</script>
