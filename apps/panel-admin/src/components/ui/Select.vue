<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder || 'انتخاب کنید...' }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
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
interface Option {
  value: string | number
  label: string
}

interface Props {
  id?: string
  modelValue?: string | number
  label?: string
  placeholder?: string
  options: Option[]
  disabled?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectClasses = computed(() => {
  const base = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 focus:outline-none transition-colors dark:bg-neutral-800 appearance-none'
  const errorClass = props.error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
    : 'border-neutral-300 dark:border-neutral-600 focus:border-primary focus:ring-primary/20'
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return [base, errorClass, disabledClass].filter(Boolean).join(' ')
})
</script>
