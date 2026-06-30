<template>
  <div class="relative" ref="selectRef">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggle"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-2.5 border rounded-lg bg-white transition-all flex items-center justify-between',
        disabled 
          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
          : isOpen 
            ? 'border-teal-500 ring-2 ring-teal-500/20' 
            : 'border-gray-300 hover:border-teal-400',
        buttonClass
      ]"
    >
      <!-- Selected Value -->
      <div class="flex items-center gap-2 text-right flex-1 min-w-0">
        <i v-if="selectedOption?.icon" :class="['text-lg', selectedOption.icon, selectedOption?.iconColor || 'text-gray-500']"></i>
        <span :class="[selectedOption ? 'text-gray-900' : 'text-gray-400']" class="truncate">
          {{ selectedOption?.label || placeholder }}
        </span>
      </div>
      
      <!-- Chevron Icon -->
      <i 
        :class="[
          'ti ti-chevron-down text-gray-400 transition-transform duration-200 mr-2',
          isOpen ? 'rotate-180' : ''
        ]"
      ></i>
    </button>
    
    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen" 
        :class="[
          'absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden',
          fullWidth ? 'left-0 right-0' : widthClass,
          positionClasses
        ]"
      >
        <!-- Search Input (optional) -->
        <div v-if="searchable" class="p-2 border-b border-gray-100">
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
        
        <!-- Options List -->
        <ul 
          class="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          role="listbox"
        >
          <!-- Empty State -->
          <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-center text-gray-500 text-sm">
            <i class="ti ti-search-off text-2xl text-gray-300 mb-1 block"></i>
            موردی یافت نشد
          </li>
          
          <!-- Options -->
          <li
            v-for="option in filteredOptions"
            :key="option.value"
            @click="selectOption(option)"
            :class="[
              'px-4 py-2.5 cursor-pointer transition-colors flex items-center gap-3',
              option.value === modelValue 
                ? 'bg-teal-50 text-teal-700' 
                : 'hover:bg-gray-50 text-gray-700',
              option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            ]"
            role="option"
            :aria-selected="option.value === modelValue"
          >
            <!-- Option Icon -->
            <i v-if="option.icon" :class="['text-lg', option.icon, option.iconColor || 'text-gray-500']"></i>
            
            <!-- Option Content -->
            <div class="flex-1 min-w-0">
              <span class="block truncate font-medium">{{ option.label }}</span>
              <span v-if="option.description" class="block text-xs text-gray-500 truncate">
                {{ option.description }}
              </span>
            </div>
            
            <!-- Check Icon for Selected -->
            <i 
              v-if="option.value === modelValue" 
              class="ti ti-check text-teal-600 text-lg"
            ></i>
            
            <!-- Badge -->
            <span 
              v-if="option.badge" 
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-medium',
                option.badgeColor || 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ option.badge }}
            </span>
          </li>
        </ul>
        
        <!-- Footer Slot -->
        <div v-if="$slots.footer" class="border-t border-gray-100 p-2">
          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, null],
    default: null
  },
  options: {
    type: Array,
    required: true,
    // Each option: { value: any, label: string, icon?: string, iconColor?: string, description?: string, badge?: string, badgeColor?: string, disabled?: boolean }
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'انتخاب کنید...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'جستجو...'
  },
  position: {
    type: String,
    default: 'bottom', // 'bottom', 'top'
    validator: (v) => ['bottom', 'top'].includes(v)
  },
  fullWidth: {
    type: Boolean,
    default: true
  },
  widthClass: {
    type: String,
    default: 'min-w-[200px]'
  },
  buttonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close'])

const selectRef = ref(null)
const searchInputRef = ref(null)
const isOpen = ref(false)
const searchQuery = ref('')

// Computed
const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query) ||
    opt.description?.toLowerCase().includes(query)
  )
})

const positionClasses = computed(() => {
  if (props.position === 'top') {
    return 'bottom-full mb-2'
  }
  return 'top-full'
})

// Methods
const toggle = () => {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

const open = () => {
  isOpen.value = true
  emit('open')

  if (props.searchable) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}

const close = () => {
  isOpen.value = false
  searchQuery.value = ''
  emit('close')
}

const selectOption = (option) => {
  if (option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option)
  close()
}

// Click outside handler
const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    close()
  }
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    close()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
