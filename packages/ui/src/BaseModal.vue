<template>
  <div :class="modalClasses">
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
    <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <!-- Header -->
      <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <slot name="header">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          </slot>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="px-6 py-4">
        <slot />
      </div>
      
      <!-- Footer -->
      <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 space-x-reverse">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  closeOnOverlay?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalClasses = computed(() => {
  const base = 'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300'
  const visible = props.modelValue ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  
  return `${base} ${visible}`
})

const closeModal = () => {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>
