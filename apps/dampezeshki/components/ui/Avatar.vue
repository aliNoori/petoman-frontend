<template>
  <div class="flex items-center space-x-3 space-x-reverse">
    <div class="flex-shrink-0">
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        :class="avatarClasses"
        @error="onImageError"
      />
      <div
        v-else
        :class="[avatarClasses, 'bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center']"
      >
        <span :class="initialsClasses">
          {{ initials }}
        </span>
      </div>
    </div>
    <div v-if="$slots.default" class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'Avatar'
})

const avatarClasses = computed(() => {
  const base = 'rounded-full object-cover'
  
  const sizes = {
    xs: 'h-8 w-8',
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const initialsClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  return `font-medium text-neutral-700 dark:text-neutral-300 ${sizes[props.size]}`
})

const initials = computed(() => {
  if (!props.name) return '?'
  
  return props.name
    .split(' ')
    .map(word => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const onImageError = () => {
  // Handle image loading error by showing initials
  // This could emit an event or set a local state
}
</script>
