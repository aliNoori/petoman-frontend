<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: boolean
  hover?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false,
  shadow: 'sm'
})

const cardClasses = computed(() => {
  const base = 'bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800'
  const hoverClass = props.hover ? 'hover:shadow-md transition-shadow' : ''
  const shadowClass = props.shadow !== 'none' ? `shadow-${props.shadow}` : ''
  
  return [base, hoverClass, shadowClass].filter(Boolean).join(' ')
})

const bodyClasses = computed(() => {
  return props.padding ? 'p-6' : ''
})
</script>
