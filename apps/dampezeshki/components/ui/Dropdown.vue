<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggle"
      class="w-full px-4 py-3 border rounded-lg flex items-center justify-between transition-all text-right"
      :class="[
        isOpen 
          ? 'border-sky-500 ring-2 ring-sky-100' 
          : 'border-gray-200 hover:border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white cursor-pointer'
      ]"
      :disabled="disabled"
    >
      <span :class="modelValue ? 'text-gray-900' : 'text-gray-400'">
        {{ displayValue || placeholder }}
      </span>
      <i 
        class="ti ti-chevron-down text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        :class="position === 'top' ? 'bottom-full mb-2' : 'top-full'"
      >
        <!-- Search Box -->
        <div v-if="searchable" class="p-3 border-b border-gray-100">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
              @click.stop
            >
            <i class="ti ti-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>

        <!-- Options List -->
        <ul class="max-h-60 overflow-y-auto py-2">
          <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
            <i class="ti ti-mood-empty text-xl mb-1 block"></i>
            موردی یافت نشد
          </li>
          <li
            v-for="option in filteredOptions"
            :key="option.value"
            @click="selectOption(option)"
            class="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors"
            :class="[
              modelValue === option.value 
                ? 'bg-sky-50 text-sky-600' 
                : 'hover:bg-gray-50 text-gray-700'
            ]"
          >
            <span class="text-sm">{{ option.label }}</span>
            <i 
              v-if="modelValue === option.value" 
              class="ti ti-check text-sky-500"
            ></i>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
    // [{ value: 'x', label: 'X' }]
  },
  placeholder: {
    type: String,
    default: 'انتخاب کنید'
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'جستجو...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'bottom' // 'bottom' or 'top'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const dropdownRef = ref(null)
const isOpen = ref(false)
const searchQuery = ref('')

// Display value
const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

// Filter options based on search
const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase().trim()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query)
  )
})

// Methods
const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchQuery.value = ''
  }
}

const close = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
}

// Click outside handler
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
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
