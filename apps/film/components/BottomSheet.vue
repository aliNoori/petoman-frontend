<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="closeBottomSheet"
      >
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div 
            v-if="isOpen"
            class="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg rounded-t-3xl border-t border-gray-700/50 max-h-[80vh] overflow-hidden"
            @click.stop
          >
            <!-- Handle -->
            <div class="flex justify-center pt-4 pb-2">
              <div class="w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>

            <!-- Header -->
            <div v-if="title" class="px-6 pb-4 border-b border-gray-700/50">
              <h3 class="text-lg font-semibold text-white text-center">{{ title }}</h3>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto custom-scrollbar" style="max-height: calc(80vh - 100px);">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
}

defineProps<Props>()

const emit = defineEmits<{
  'close': []
}>()

const closeBottomSheet = () => {
  emit('close')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(234, 179, 8, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 179, 8, 0.7);
}
</style>
