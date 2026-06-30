<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      :class="[
        'flex items-center justify-between w-full transition-all duration-300 group',
        buttonClass || 'bg-zinc-900/60 backdrop-blur-sm text-white border border-yellow-400/30 rounded-2xl px-6 py-4 text-sm hover:border-yellow-400/60 focus:border-yellow-400/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/20'
      ]"
    >
      <span class="flex items-center space-x-3 space-x-reverse">
        <slot name="icon" />
        <span class="font-medium">{{ selectedLabel || placeholder }}</span>
      </span>
      <svg 
        class="w-5 h-5 transition-transform duration-300 text-yellow-400 group-hover:text-yellow-300" 
        :class="{ 'rotate-180': isOpen }" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    
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
          'absolute z-50 bg-black/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl overflow-hidden',
          dropdownClass || 'top-full left-0 right-0 mt-2'
        ]"
      >
        <ul class="py-2 max-h-60 overflow-y-auto custom-scrollbar">
          <li v-for="option in options" :key="option.value">
            <button
              @click="selectOption(option)"
              :class="[
                'w-full text-right px-6 py-4 text-sm transition-all duration-200 flex items-center justify-between hover:bg-yellow-400/10',
                option.value === selectedValue 
                  ? 'bg-yellow-400/20 text-yellow-400 border-r-4 border-yellow-400' 
                  : 'text-white hover:text-yellow-400'
              ]"
            >
              <span class="flex items-center space-x-3 space-x-reverse">
                <component v-if="option.icon" :is="option.icon" class="w-5 h-5" />
                <span class="font-medium">{{ option.label }}</span>
              </span>
              <div class="flex items-center space-x-2 space-x-reverse">
                <span v-if="option.badge" class="text-xs px-2 py-1 bg-gray-600/50 rounded-lg text-gray-300">{{ option.badge }}</span>
                <i v-if="option.value === selectedValue" class="ti ti-check text-yellow-400"></i>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface DropdownOption {
  value: string | number
  label: string
  badge?: string
  icon?: any
}

interface Props {
  options: DropdownOption[]
  modelValue?: string | number
  placeholder?: string
  buttonClass?: string
  dropdownClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'انتخاب کنید',
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'select': [option: DropdownOption]
}>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

const selectedValue = computed(() => props.modelValue)

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === selectedValue.value)
  return selected?.label || ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: DropdownOption) => {
  emit('update:modelValue', option.value)
  emit('select', option)
  isOpen.value = false
}

const closeDropdown = (event: Event) => {
  if (!dropdownRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(234, 179, 8, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 179, 8, 0.7);
}
</style>
