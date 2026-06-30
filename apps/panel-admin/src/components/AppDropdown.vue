<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button 
      @click="toggle"
      :class="[
        'flex items-center gap-2 transition-colors',
        buttonClass || 'p-2 hover:bg-gray-100 rounded-lg'
      ]"
      :disabled="disabled"
    >
      <slot name="trigger">
        <i class="ti ti-dots-vertical text-gray-500"></i>
      </slot>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        :class="[
          'absolute z-50 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden',
          positionClasses,
          widthClass || 'min-w-[180px]'
        ]"
      >
        <ul class="py-1">
          <li 
            v-for="(item, index) in items" 
            :key="index"
          >
            <!-- Divider -->
            <hr v-if="item.divider" class="my-1 border-gray-100" />
            
            <!-- Header -->
            <p 
              v-else-if="item.header" 
              class="px-4 py-2 text-xs font-medium text-gray-400 uppercase"
            >
              {{ item.header }}
            </p>
            
            <!-- Regular Item -->
            <button
              v-else
              @click="handleItemClick(item)"
              :disabled="item.disabled"
              :class="[
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-right',
                item.disabled 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : item.danger 
                    ? 'text-red-600 hover:bg-red-50' 
                    : item.warning
                      ? 'text-amber-600 hover:bg-amber-50'
                      : item.success
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <i v-if="item.icon" :class="[item.icon, 'text-lg']"></i>
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="item.badge" :class="['px-1.5 py-0.5 text-xs rounded-full', item.badgeClass || 'bg-gray-100 text-gray-600']">
                {{ item.badge }}
              </span>
              <i v-if="item.arrow" class="ti ti-chevron-left text-gray-400"></i>
            </button>
          </li>
        </ul>
        
        <!-- Custom Footer Slot -->
        <div v-if="$slots.footer" class="border-t border-gray-100">
          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
    // Item structure:
    // { label: string, icon?: string, action?: string|function, disabled?: boolean, danger?: boolean, warning?: boolean, success?: boolean, badge?: string, badgeClass?: string, arrow?: boolean }
    // { divider: true }
    // { header: string }
  },
  position: {
    type: String,
    default: 'bottom-start' // bottom-start, bottom-end, top-start, top-end
  },
  buttonClass: String,
  widthClass: String,
  disabled: Boolean,
  closeOnClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select', 'open', 'close'])

const dropdownRef = ref(null)
const isOpen = ref(false)

const positionClasses = computed(() => {
  switch (props.position) {
    case 'bottom-end':
      return 'left-0'
    case 'top-start':
      return 'bottom-full mb-2 right-0'
    case 'top-end':
      return 'bottom-full mb-2 left-0'
    default: // bottom-start
      return 'right-0'
  }
})

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleItemClick = (item) => {
  if (item.disabled) return
  
  // Emit action
  if (typeof item.action === 'function') {
    item.action()
  } else if (item.action) {
    emit('select', item.action, item)
  } else {
    emit('select', item.label, item)
  }
  
  // Close dropdown
  if (props.closeOnClick) {
    close()
  }
}

// Close on click outside
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

// Expose methods
defineExpose({ toggle, close })
</script>
