<template>
  <div class="relative select-menu-wrapper" ref="selectRef">
    <!-- Label -->
    <label
        v-if="label"
        :for="id"
        class="block text-gray-700 text-sm font-medium mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Trigger Button -->
    <button
        type="button"
        :id="id"
        @click="toggle"
        :disabled="disabled"
        :class="[
        'w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white transition-all focus:outline-none',
        isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-200 hover:border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer',
        error ? 'border-red-300 focus:border-red-500' : ''
      ]"
    >
      <span :class="hasValue ? 'text-gray-900' : 'text-gray-400'">
        {{ selectedLabel || placeholder }}
      </span>
      <i
          :class="[
          'ti ti-chevron-down text-gray-400 transition-transform duration-200',
          isOpen ? 'rotate-180' : ''
        ]"
      ></i>
    </button>

    <!-- Dropdown Menu -->
    <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
    >
      <div
          v-if="isOpen"
          :class="[
          'absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden',
          position === 'top' ? 'bottom-full mb-1' : 'top-full'
        ]"
      >
        <!-- Search Input -->
        <div v-if="searchable" class="p-2 border-b border-gray-100">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                :placeholder="searchPlaceholder"
                class="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            >
          </div>
        </div>

        <!-- Options List -->
        <div :class="['overflow-y-auto', maxHeight]">
          <div v-if="filteredOptions.length === 0" class="p-4 text-center text-gray-500 text-sm">
            {{ noResultsText }}
          </div>
          <button
              v-for="option in filteredOptions"
              :key="option[optionValue] || option.value"
              type="button"
              @click="selectOption(option)"
              :class="[
               'w-full flex items-center gap-3 px-4 py-3 text-right transition-colors',
               isSelected(option)
                 ? 'bg-blue-50 text-blue-600'
                 : 'hover:bg-gray-50 text-gray-700'
             ]"
          >
            <i v-if="option.icon" :class="[option.icon, 'text-lg']"></i>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ option.label }}</div>
              <div v-if="option.description" class="text-xs text-gray-500 truncate">
                {{ option.description }}
              </div>
            </div>
            <!-- Check Icon -->
            <i
                v-if="isSelected(option)"
                class="ti ti-check text-blue-500"
            ></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Error Message -->
    <div v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Option {
  value: string | number
  label: string
  icon?: string
  description?: string
}

interface Props {
  modelValue?: string | number | (string | number)[] | null
  options: Option[]
  optionValue?: string
  label?: string
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
  disabled?: boolean
  required?: boolean
  error?: string
  id?: string
  position?: 'top' | 'bottom'
  maxHeight?: string
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'انتخاب کنید',
  searchPlaceholder: 'جستجو...',
  noResultsText: 'نتیجه‌ای یافت نشد',
  disabled: false,
  required: false,
  optionValue: 'value',
  position: 'bottom',
  maxHeight: 'max-h-60',
  multiple: false,
  id: () => `select-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | null]
  change: [value: string | number | (string | number)[] | null]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()

// Computed: بررسی اینکه آیا مقداری انتخاب شده است یا خیر
const hasValue = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0
  }
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

// Computed: نمایش لیبل‌های انتخاب شده
const selectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return ''
    const selectedOptions = props.options.filter(opt => props.modelValue.includes(opt.value))
    return selectedOptions.map(opt => opt.label).join(', ')
  }
  // console.log('opt.value',props.options)
  // console.log('props.modelValue',props.modelValue)
  // // حالت تکی
  // const selected = props.options.find(opt => opt.value === props.modelValue)
  const selected = props.options.find(opt => opt[props.optionValue] === props.modelValue)
  return selected?.label || ''
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
      opt.label.toLowerCase().includes(query) ||
      opt.description?.toLowerCase().includes(query)
  )
})

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value

  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const close = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const isSelected = (option: Option) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option.value)
  }
  return props.modelValue === option.value
}

const selectOption = (option: Option) => {
  const key = props.optionValue || 'value'
  const selectedValue = option[key]

  if (props.multiple) {
    // حالت چندگانه
    const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValue.indexOf(selectedValue)
    if (index === -1) {
      currentValue.push(selectedValue)
    } else {
      currentValue.splice(index, 1)
    }
    emit('update:modelValue', currentValue)
    emit('change', currentValue)
  } else {
    // --- FIX 6: اطمینان از ارسال مقدار صحیح ---
    emit('update:modelValue', selectedValue)
    emit('change', selectedValue)
    close()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(isOpen, (newVal) => {
  if (!newVal) {
    searchQuery.value = ''
  }
})
</script>

<style scoped>
/* حذف بوردر پیش‌فرض مرورگر برای attribute multiple */
.select-menu-wrapper[multiple] {
  border: none !important;
}
</style>