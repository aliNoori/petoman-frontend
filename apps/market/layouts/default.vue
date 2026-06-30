<template>
  <div class="min-h-screen bg-white">
    <HeaderSiteHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
    <GlobalToast />
  </div>
</template>

<script setup lang="ts">
// Add any layout-specific logic here
import GlobalToast from "../components/GlobalToast.vue";
</script>
