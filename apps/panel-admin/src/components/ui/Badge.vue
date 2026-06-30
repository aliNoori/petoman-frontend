<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    neutral: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return [base, variants[props.variant], sizes[props.size]].join(' ')
})
</script>
