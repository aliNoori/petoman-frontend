<template>
  <div class="relative">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <label
      v-if="label"
      :for="id"
      class="absolute right-3 -top-2 bg-white dark:bg-neutral-900 px-2 text-sm text-neutral-600 dark:text-neutral-400"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  type?: string
  modelValue?: string | number
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors dark:bg-neutral-800'
  const errorClass = props.error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
    : 'border-neutral-300 dark:border-neutral-600 focus:border-primary focus:ring-primary/20'
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return [base, errorClass, disabledClass].filter(Boolean).join(' ')
})
</script>
