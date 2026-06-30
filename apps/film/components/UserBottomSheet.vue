<template>
  <BottomSheet
    :is-open="isOpen"
    :title="title"
    @close="handleClose"
  >
    <slot></slot>
  </BottomSheet>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}
</script>
