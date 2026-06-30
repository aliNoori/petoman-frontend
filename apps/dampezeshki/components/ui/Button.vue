<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <svg 
      v-if="loading" 
      class="animate-spin -mr-1 ml-3 h-5 w-5 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/20',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/20'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg'
  }
  
  const width = props.block ? 'w-full' : ''
  
  return [base, variants[props.variant], sizes[props.size], width].join(' ')
})
</script>
