<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @keydown.esc="close"
  >
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="close"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-xl transition-all"
        @click.stop
      >
        <!-- Close button -->
        <button
          v-if="closable"
          @click="close"
          class="absolute left-4 top-4 rounded-lg p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div v-if="$slots.header || title" class="mb-4">
          <slot name="header">
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
              {{ title }}
            </h3>
          </slot>
        </div>

        <!-- Body -->
        <div class="mb-6">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="flex justify-end space-x-3 space-x-reverse">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const isOpen = computed(() => props.modelValue)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Close on Escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      close()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
