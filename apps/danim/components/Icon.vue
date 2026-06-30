<script setup lang="ts">
import { computed, onMounted } from 'vue'
// Generic Tabler Icon font component.
// Usage: <Icon name="home" size="sm" class="text-gray-600" />
// - name: Tabler icon name without leading ti-
// - size: preset token (sm|md|lg) or number (px)
// Automatically prefixes with ti- and applies fallback sizing.

defineOptions({ inheritAttrs: false })

interface Props { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' | number }
const props = defineProps<Props>()

const base = computed(() => props.name.startsWith('ti-') ? props.name : `ti-${props.name}`)
const isNumeric = computed(() => typeof props.size === 'number')
const sizeClass = computed(() => isNumeric.value ? '' : (props.size ? `icon-${props.size}` : 'icon-md'))
const style = computed(() => isNumeric.value ? { fontSize: props.size + 'px', lineHeight: 1 } : undefined)

// Fallback detection (dev only): if font not loaded, dev can see a warning once.
if (process.client) {
  onMounted(() => {
    const test = document.createElement('i')
    test.className = `ti ${base.value}`
    test.style.position = 'absolute'
    test.style.opacity = '0'
    document.body.appendChild(test)
    const before = getComputedStyle(test, ':before').content
    if (!before || before === 'none' || before === '""') {
      // eslint-disable-next-line no-console
      console.warn('[Icon] Tabler icon font seems missing. Check @import path & font files.')
    }
    document.body.removeChild(test)
  })
}
</script>
<template>
  <i
    :class="['ti', base, 'icon', sizeClass, $attrs.class]"
    v-bind="{ ...$attrs, class: undefined }"
    :style="style"
    aria-hidden="true"
  />
</template>
<style scoped></style>
