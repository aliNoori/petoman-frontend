<template>
  <div :class="dropdownClasses">
    <button
      ref="triggerRef"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
      @keydown.escape="close"
      @keydown.arrow-down.prevent="focusFirstItem"
      :class="triggerClasses"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <slot name="trigger" :isOpen="isOpen">
        <span>{{ placeholder }}</span>
        <svg
          :class="['w-4 h-4 transition-transform duration-200', { 'rotate-180': isOpen }]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </slot>
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="menuRef"
        :class="menuClasses"
        role="menu"
        @keydown.escape="close"
        @keydown.arrow-down.prevent="focusNext"
        @keydown.arrow-up.prevent="focusPrevious"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  placeholder?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'انتخاب کنید',
  position: 'bottom-left',
  disabled: false,
  fullWidth: false
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()

const dropdownClasses = computed(() => {
  const base = 'relative'
  const width = props.fullWidth ? 'w-full' : 'inline-block'
  return `${base} ${width}`
})

const triggerClasses = computed(() => {
  const base = 'inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  return `${base} ${disabled}`
})

const menuClasses = computed(() => {
  const base = 'absolute z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-48'
  
  const positions = {
    'bottom-left': 'left-0 top-full',
    'bottom-right': 'right-0 top-full', 
    'top-left': 'left-0 bottom-full mb-2',
    'top-right': 'right-0 bottom-full mb-2'
  }
  
  return `${base} ${positions[props.position]}`
})

const toggle = () => {
  if (props.disabled) return
  
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const open = () => {
  isOpen.value = true
  emit('open')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const focusFirstItem = () => {
  if (!isOpen.value) {
    open()
  }
  // Focus first menu item
  setTimeout(() => {
    const firstItem = menuRef.value?.querySelector('[role="menuitem"]') as HTMLElement
    firstItem?.focus()
  }, 0)
}

const focusNext = () => {
  const items = menuRef.value?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>
  const currentIndex = Array.from(items).findIndex(item => item === document.activeElement)
  const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
  items[nextIndex]?.focus()
}

const focusPrevious = () => {
  const items = menuRef.value?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>
  const currentIndex = Array.from(items).findIndex(item => item === document.activeElement)
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
  items[prevIndex]?.focus()
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Node
  if (
    isOpen.value &&
    !triggerRef.value?.contains(target) &&
    !menuRef.value?.contains(target)
  ) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
