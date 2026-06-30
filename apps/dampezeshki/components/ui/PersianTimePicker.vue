<template>
  <div class="relative">
    <button
      type="button"
      @click="showPicker = !showPicker"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 transition-colors text-right bg-white"
      :class="ringColor"
    >
      <span :class="modelValue ? 'text-gray-900' : 'text-gray-400'">
        {{ displayTime || 'انتخاب ساعت' }}
      </span>
    </button>

    <div
      v-if="showPicker"
      class="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-72"
      @click.stop
    >
      <div class="flex items-center gap-2 mb-3">
        <!-- انتخاب ساعت -->
        <div class="flex-1">
          <label class="block text-xs text-gray-600 mb-1">ساعت</label>
          <select
            v-model="selectedHour"
            class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option v-for="h in 12" :key="h" :value="h">{{ h }}</option>
          </select>
        </div>

        <!-- انتخاب دقیقه -->
        <div class="flex-1">
          <label class="block text-xs text-gray-600 mb-1">دقیقه</label>
          <select
            v-model="selectedMinute"
            class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- قبل/بعد از ظهر -->
        <div class="flex-1">
          <label class="block text-xs text-gray-600 mb-1">زمان</label>
          <select
            v-model="selectedPeriod"
            class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="AM">قبل از ظهر</option>
            <option value="PM">بعد از ظهر</option>
          </select>
        </div>
      </div>

      <!-- دکمه‌های عمل -->
      <div class="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          type="button"
          @click="applyTime"
          class="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
        >
          تایید
        </button>
        <button
          type="button"
          @click="clearTime"
          class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
        >
          پاک کردن
        </button>
        <button
          type="button"
          @click="showPicker = false"
          class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
        >
          بستن
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  ringColor: {
    type: String,
    default: 'focus:ring-emerald-500'
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const selectedHour = ref(10)
const selectedMinute = ref('00')
const selectedPeriod = ref('AM')

// لیست دقیقه‌ها (0, 5, 10, 15, ..., 55)
const minutes = computed(() => {
  const mins = []
  for (let i = 0; i < 60; i += 5) {
    mins.push(i.toString().padStart(2, '0'))
  }
  return mins
})

// نمایش فرمت شده
const displayTime = computed(() => {
  if (!props.modelValue) return ''
  
  const [hours, mins] = props.modelValue.split(':')
  const hour = parseInt(hours)
  const isPM = hour >= 12
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const period = isPM ? 'بعد از ظهر' : 'قبل از ظهر'
  
  return `${hour12}:${mins} ${period}`
})

// بارگذاری مقدار اولیه
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const [hours, mins] = newValue.split(':')
    const hour = parseInt(hours)
    selectedPeriod.value = hour >= 12 ? 'PM' : 'AM'
    selectedHour.value = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    selectedMinute.value = mins
  }
}, { immediate: true })

// تبدیل به فرمت 24 ساعته
const applyTime = () => {
  let hour24 = parseInt(selectedHour.value)
  
  if (selectedPeriod.value === 'PM' && hour24 !== 12) {
    hour24 += 12
  } else if (selectedPeriod.value === 'AM' && hour24 === 12) {
    hour24 = 0
  }
  
  const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.value}`
  emit('update:modelValue', timeString)
  showPicker.value = false
}

const clearTime = () => {
  emit('update:modelValue', '')
  showPicker.value = false
}

// بستن با کلیک خارج
if (process.client) {
  onMounted(() => {
    const handleClickOutside = (e) => {
      if (showPicker.value && !e.target.closest('.relative')) {
        showPicker.value = false
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  })
}
</script>
