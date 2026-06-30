<template>
  <div class="relative">
    <input
      type="text"
      :value="displayValue"
      @click="showPicker = !showPicker"
      :placeholder="placeholder"
      readonly
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-teal-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
    >
    
    <Transition name="dropdown">
      <div v-if="showPicker" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
        <!-- Month/Year Selector -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="changeMonth(-1)"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="ti ti-chevron-right text-gray-600"></i>
          </button>
          
          <div class="flex items-center gap-2">
            <select
              v-model="selectedMonth"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option v-for="(month, index) in persianMonths" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
            
            <select
              v-model="selectedYear"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option v-for="year in yearRange" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <button
            @click="changeMonth(1)"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="ti ti-chevron-left text-gray-600"></i>
          </button>
        </div>
        
        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="day in persianDays"
            :key="day"
            class="text-center text-xs font-medium text-gray-600 py-2"
          >
            {{ day }}
          </div>
          
          <div
            v-for="blank in firstDayOfMonth"
            :key="'blank-' + blank"
            class="aspect-square"
          ></div>
          
          <button
            v-for="day in daysInMonth"
            :key="day"
            @click="selectDate(day)"
            class="aspect-square rounded-lg hover:bg-gray-100 transition-colors text-sm"
            :class="{
              'bg-teal-600 text-white hover:bg-teal-700': isSelectedDate(day),
              'text-gray-900': !isSelectedDate(day)
            }"
          >
            {{ day }}
          </button>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            @click="clearDate"
            class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            پاک کردن
          </button>
          <button
            @click="setToday"
            class="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            امروز
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import moment from 'moment-jalaali'
import {ref,computed,watch,onMounted,onUnmounted} from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'انتخاب تاریخ'
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const selectedYear = ref(moment().jYear())
const selectedMonth = ref(moment().jMonth())
const selectedDay = ref(null)

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]

const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

const yearRange = computed(() => {
  const currentYear = moment().jYear()
  const years = []
  for (let i = currentYear - 10; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
})

const daysInMonth = computed(() => {
  return moment.jDaysInMonth(selectedYear.value, selectedMonth.value)
})

const firstDayOfMonth = computed(() => {
  const firstDay = moment(`${selectedYear.value}/${selectedMonth.value + 1}/1`, 'jYYYY/jM/jD')
  return firstDay.day()
})

const displayValue = computed(() => {
  if (props.modelValue) {
    return props.modelValue
  }
  return ''
})

// تابع کمکی برای تبدیل اعداد انگلیسی به فارسی
const toPersianDigits = (n) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return n.toString().replace(/\d/g, x => farsiDigits[x])
}

const isSelectedDate = (day) => {
  if (!props.modelValue) return false
  // برای مقایسه، تاریخ مدل را به انگلیسی تبدیل می‌کنیم چون متغیرهای selectedYear انگلیسی هستند
  const modelValueEn = props.modelValue.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  const selectedDate = `${selectedYear.value}/${String(selectedMonth.value + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`
  return modelValueEn === selectedDate
}

const selectDate = (day) => {
  selectedDay.value = day
  // ساخت تاریخ با اعداد انگلیسی
  const formattedDateEn = `${selectedYear.value}/${String(selectedMonth.value + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`

  // تبدیل به فارسی قبل از ارسال
  const formattedDateFa = toPersianDigits(formattedDateEn)

  emit('update:modelValue', formattedDateFa)
  showPicker.value = false
}

const changeMonth = (direction) => {
  selectedMonth.value += direction
  if (selectedMonth.value > 11) {
    selectedMonth.value = 0
    selectedYear.value++
  } else if (selectedMonth.value < 0) {
    selectedMonth.value = 11
    selectedYear.value--
  }
}

const setToday = () => {
  const today = moment()
  selectedYear.value = today.jYear()
  selectedMonth.value = today.jMonth()
  selectedDay.value = today.jDate()

  // دریافت تاریخ امروز به صورت انگلیسی
  const formattedDateEn = today.format('jYYYY/jMM/jDD')

  // تبدیل به فارسی قبل از ارسال
  const formattedDateFa = toPersianDigits(formattedDateEn)

  emit('update:modelValue', formattedDateFa)
  showPicker.value = false
}

const clearDate = () => {
  emit('update:modelValue', '')
  showPicker.value = false
}

// Initialize from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // تبدیل ورودی فارسی به انگلیسی برای اینکه moment بتواند آن را بخواند
    const newValueEn = newValue.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    const parsed = moment(newValueEn, 'jYYYY/jMM/jDD')
    if (parsed.isValid()) {
      selectedYear.value = parsed.jYear()
      selectedMonth.value = parsed.jMonth()
      selectedDay.value = parsed.jDate()
    }
  }
}, { immediate: true })

// Close picker when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    const picker = event.target.closest('.relative')
    if (!picker && showPicker.value) {
      showPicker.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
