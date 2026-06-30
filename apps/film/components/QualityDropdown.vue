<template>
  <BaseDropdown
    v-model="modelValue"
    :options="options"
    :placeholder="placeholder"
    :button-class="buttonClass"
    :dropdown-class="dropdownClass"
    @select="handleSelect"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
  </BaseDropdown>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  options: Array<{ value: string | number; label: string; badge?: string }>
  placeholder?: string
  buttonClass?: string
  dropdownClass?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'select', option: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSelect = (option: any) => {
  emit('update:modelValue', option.value)
  emit('select', option)
}
</script>
