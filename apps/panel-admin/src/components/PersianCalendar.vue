<template>
  <div class="persian-calendar">
    <div class="flex items-center justify-between mb-4">
      <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded">
        <i class="ti ti-chevron-right w-4 h-4"></i>
      </button>
      <h3 class="font-semibold">{{ currentMonthName }} {{ currentYear }}</h3>
      <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded">
        <i class="ti ti-chevron-left w-4 h-4"></i>
      </button>
    </div>
    
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-gray-500 p-2">
        {{ day }}
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="date in calendarDates"
        :key="`${date.month}-${date.day}`"
        @click="selectDate(date)"
        :disabled="!date.isCurrentMonth"
        :class="[
          'p-2 text-sm rounded hover:bg-sky-100 transition-colors',
          date.isSelected ? 'bg-sky-500 text-white' : '',
          date.isToday ? 'bg-sky-100 text-sky-600 font-medium' : '',
          !date.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
        ]"
      >
        {{ date.day }}
      </button>
    </div>
    
    <div class="flex justify-between mt-4 pt-3 border-t border-gray-200">
      <button @click="selectToday" class="text-sm text-sky-600 hover:text-sky-700">
        امروز
      </button>
      <button @click="$emit('close')" class="text-sm text-gray-600 hover:text-gray-700">
        بستن
      </button>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment-jalaali'

const props = defineProps({
  selectedDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['date-selected', 'close'])

// Configure moment-jalaali
moment.loadPersian({
  usePersianDigits: false,
  dialect: 'persian-modern'
})

// Persian weekday names
const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

// Current calendar state
const currentDate = ref(moment())

const currentYear = computed(() => {
  return currentDate.value.format('jYYYY')
})

const currentMonthName = computed(() => {
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]
  return monthNames[currentDate.value.jMonth()]
})

// Calendar days computation
const calendarDates = computed(() => {
  const dates = []
  const startOfMonth = moment(currentDate.value).startOf('jMonth')
  const endOfMonth = moment(currentDate.value).endOf('jMonth')
  const startDate = moment(startOfMonth).startOf('week')
  
  // Add days from previous month
  let current = moment(startDate)
  while (current.isBefore(startOfMonth)) {
    dates.push({
      day: current.format('jDD'),
      month: current.format('jMM'),
      year: current.format('jYYYY'),
      jalali: current.format('jYYYY/jMM/jDD'),
      isCurrentMonth: false,
      isToday: current.isSame(moment(), 'day'),
      isSelected: props.selectedDate === current.format('jYYYY/jMM/jDD')
    })
    current.add(1, 'day')
  }
  
  // Add days from current month
  while (current.isSameOrBefore(endOfMonth)) {
    dates.push({
      day: current.format('jDD'),
      month: current.format('jMM'),
      year: current.format('jYYYY'),
      jalali: current.format('jYYYY/jMM/jDD'),
      isCurrentMonth: true,
      isToday: current.isSame(moment(), 'day'),
      isSelected: props.selectedDate === current.format('jYYYY/jMM/jDD')
    })
    current.add(1, 'day')
  }
  
  // Add days from next month to complete the grid
  const totalCells = 42 // 6 weeks × 7 days
  while (dates.length < totalCells) {
    dates.push({
      day: current.format('jDD'),
      month: current.format('jMM'),
      year: current.format('jYYYY'),
      jalali: current.format('jYYYY/jMM/jDD'),
      isCurrentMonth: false,
      isToday: current.isSame(moment(), 'day'),
      isSelected: props.selectedDate === current.format('jYYYY/jMM/jDD')
    })
    current.add(1, 'day')
  }
  
  return dates
})

// Navigation methods
const previousMonth = () => {
  currentDate.value = moment(currentDate.value).subtract(1, 'jMonth')
}

const nextMonth = () => {
  currentDate.value = moment(currentDate.value).add(1, 'jMonth')
}

// Date selection
const selectDate = (date) => {
  if (!date.isCurrentMonth) return
  emit('date-selected', date.jalali)
}

const selectToday = () => {
  const today = moment()
  currentDate.value = moment(today)
  emit('date-selected', today.format('jYYYY/jMM/jDD'))
}
</script>