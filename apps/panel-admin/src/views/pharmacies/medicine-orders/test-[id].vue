<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold">Test Page</h1>
    <p>ID: {{ $route.params.id }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
</script>
