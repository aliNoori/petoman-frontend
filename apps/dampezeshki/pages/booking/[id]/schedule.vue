<template>
  <div class="pb-24 md:pb-6">
    <!-- Header موبایل -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <NuxtLink :to="`/booking/${route.params.id}`" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-arrow-right text-xl text-gray-700"></i>
          </NuxtLink>
          <span class="font-bold text-gray-900">انتخاب زمان</span>
        </div>
      </div>
    </div>

    <div class="pt-16 lg:pt-0 px-4 lg:px-0">
      <!-- Back Button Desktop -->
      <div class="hidden lg:flex items-center gap-2 mb-6">
        <NuxtLink :to="`/booking/${route.params.id}`" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </NuxtLink>
        <span class="text-gray-500">برگشت به صفحه دکتر</span>
      </div>

      <div class="lg:grid lg:grid-cols-3 lg:gap-6">
        <!-- Calendar Section -->
        <div class="lg:col-span-2">
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div class="p-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">انتخاب تاریخ</h2>
            </div>

            <!-- Calendar -->
            <div class="p-4">
              <!-- Month Navigation -->
              <div class="flex items-center justify-between mb-4">
                <button 
                  @click="prevMonth"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i class="ti ti-chevron-right text-gray-600"></i>
                </button>
                <span class="font-bold text-gray-900">{{ currentMonthName }}</span>
                <button 
                  @click="nextMonth"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i class="ti ti-chevron-left text-gray-600"></i>
                </button>
              </div>

              <!-- Week Days -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in weekDays" :key="day" class="text-center text-xs text-gray-500 py-2">
                  {{ day }}
                </div>
              </div>

              <!-- Calendar Days -->
              <div class="grid grid-cols-7 gap-1">
                <button
                  v-for="day in calendarDays"
                  :key="day.date"
                  @click="selectDate(day)"
                  :disabled="!day.isAvailable || day.isEmpty"
                  class="aspect-square flex items-center justify-center rounded-lg text-sm transition-all"
                  :class="{
                    'opacity-0 pointer-events-none': day.isEmpty,
                    'text-gray-300 cursor-not-allowed': !day.isAvailable && !day.isEmpty,
                    'hover:bg-emerald-50 text-gray-700': day.isAvailable && selectedDate !== day.date,
                    'bg-emerald-600 text-white': selectedDate === day.date,
                    'bg-emerald-100 text-emerald-700': day.isToday && selectedDate !== day.date
                  }"
                >
                  {{ day.dayNumber }}
                </button>
              </div>
            </div>
          </div>

          <!-- Time Slots Section -->
          <div v-if="selectedDate" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">انتخاب ساعت</h2>
              <p class="text-sm text-gray-500 mt-1">{{ formatSelectedDate }}</p>
            </div>

            <!-- Time Period Tabs -->
            <div class="flex border-b border-gray-200 px-4">
              <button 
                v-for="period in timePeriods"
                :key="period.id"
                @click="selectedPeriod = period.id"
                class="flex-1 py-3 text-sm font-medium transition-colors relative"
                :class="selectedPeriod === period.id ? 'text-emerald-600' : 'text-gray-500'"
              >
                <i :class="period.icon" class="ml-1"></i>
                {{ period.label }}
                <span v-if="selectedPeriod === period.id" class="absolute bottom-0 right-0 left-0 h-0.5 bg-emerald-600"></span>
              </button>
            </div>

            <!-- Time Slots Grid -->
            <div class="p-4">
              <div class="grid grid-cols-3 lg:grid-cols-4 gap-2">
                <button
                  v-for="slot in filteredTimeSlots"
                  :key="slot.time"
                  @click="selectTimeSlot(slot)"
                  :disabled="!slot.isAvailable"
                  class="py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
                  :class="{
                    'bg-gray-100 text-gray-400 cursor-not-allowed': !slot.isAvailable,
                    'border border-gray-200 hover:border-emerald-400 text-gray-700': slot.isAvailable && selectedTimeSlot !== slot.time,
                    'bg-emerald-600 text-white border border-emerald-600': selectedTimeSlot === slot.time
                  }"
                >
                  {{ slot.time }}
                </button>
              </div>

              <div v-if="filteredTimeSlots.length === 0" class="text-center py-8">
                <i class="ti ti-clock-off text-3xl text-gray-300 mb-2"></i>
                <p class="text-gray-500">وقتی در این بازه موجود نیست</p>
              </div>
            </div>
          </div>

          <!-- Address Form for Home Visit -->
          <div v-if="service === 'homeVisit' && selectedTimeSlot" class="bg-white border border-gray-200 rounded-xl overflow-hidden mt-4">
            <div class="p-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">آدرس منزل</h2>
            </div>
            <div class="p-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">آدرس کامل</label>
                <textarea
                  v-model="homeAddress"
                  rows="3"
                  placeholder="آدرس محل مراجعه دکتر..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-4">
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-bold text-gray-900">خلاصه رزرو</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">نوع خدمت:</span>
                <span class="font-medium text-gray-900">{{ getServiceLabel(service) }}</span>
              </div>
              <div v-if="selectedDate" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">تاریخ:</span>
                <span class="font-medium text-gray-900">{{ formatSelectedDate }}</span>
              </div>
              <div v-if="selectedTimeSlot" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">ساعت:</span>
                <span class="font-medium text-gray-900">{{ selectedTimeSlot }}</span>
              </div>
              <hr class="border-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-gray-700 font-medium">مبلغ قابل پرداخت:</span>
                <span class="text-lg font-bold text-emerald-600">{{ servicePrice.toLocaleString('fa-IR') }} <span class="text-sm font-normal">تومان</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
      <div class="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p class="text-xs text-gray-500">مبلغ قابل پرداخت</p>
          <p class="text-lg font-bold text-emerald-600">{{ servicePrice.toLocaleString('fa-IR') }} <span class="text-sm font-normal">تومان</span></p>
        </div>
        <button 
          @click="proceedToCheckout"
          :disabled="!canProceed"
          class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          ادامه و پرداخت
          <i class="ti ti-chevron-left mr-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment-jalaali'

const route = useRoute()

// SEO
useHead({
  title: 'انتخاب زمان - رزرو نوبت | پتومن'
})

// Query params
const service = computed(() => route.query.service || 'scheduledCall')

// Service prices
const servicePrices = {
  scheduledCall: 140000,
  clinicVisit: 250000,
  homeVisit: 400000
}

const servicePrice = computed(() => servicePrices[service.value] || 140000)

// State
const selectedDate = ref(null)
const selectedTimeSlot = ref(null)
const selectedPeriod = ref('morning')
const homeAddress = ref('')
const phoneNumber = ref('')

// Calendar
const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const currentMonth = ref(moment())

const currentMonthName = computed(() => {
  return currentMonth.value.format('jMMMM jYYYY')
})

const calendarDays = computed(() => {
  const days = []
  const startOfMonth = moment(currentMonth.value).startOf('jMonth')
  const endOfMonth = moment(currentMonth.value).endOf('jMonth')
  const today = moment()

  // Get the day of week for the first day (0 = Saturday in Jalaali)
  let startDay = startOfMonth.day()
  // Adjust for Persian calendar (Saturday = 0)
  startDay = (startDay + 1) % 7

  // Add empty days for the beginning
  for (let i = 0; i < startDay; i++) {
    days.push({ isEmpty: true, date: `empty-${i}` })
  }

  // Add days of the month
  let day = moment(startOfMonth)
  while (day.isSameOrBefore(endOfMonth, 'day')) {
    const isPast = day.isBefore(today, 'day')
    days.push({
      dayNumber: day.jDate(),
      date: day.format('jYYYY/jMM/jDD'),
      isToday: day.isSame(today, 'day'),
      isAvailable: !isPast,
      isEmpty: false
    })
    day.add(1, 'day')
  }

  return days
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return moment(selectedDate.value, 'jYYYY/jMM/jDD').format('dddd jD jMMMM')
})

// Time periods
const timePeriods = [
  { id: 'morning', label: 'صبح', icon: 'ti ti-sun' },
  { id: 'afternoon', label: 'بعدازظهر', icon: 'ti ti-sun-low' },
  { id: 'evening', label: 'عصر', icon: 'ti ti-moon' }
]

// Time slots
const timeSlots = ref([
  { time: '08:00', period: 'morning', isAvailable: true },
  { time: '08:30', period: 'morning', isAvailable: true },
  { time: '09:00', period: 'morning', isAvailable: false },
  { time: '09:30', period: 'morning', isAvailable: true },
  { time: '10:00', period: 'morning', isAvailable: true },
  { time: '10:30', period: 'morning', isAvailable: true },
  { time: '11:00', period: 'morning', isAvailable: false },
  { time: '11:30', period: 'morning', isAvailable: true },
  { time: '14:00', period: 'afternoon', isAvailable: true },
  { time: '14:30', period: 'afternoon', isAvailable: true },
  { time: '15:00', period: 'afternoon', isAvailable: true },
  { time: '15:30', period: 'afternoon', isAvailable: false },
  { time: '16:00', period: 'afternoon', isAvailable: true },
  { time: '16:30', period: 'afternoon', isAvailable: true },
  { time: '18:00', period: 'evening', isAvailable: true },
  { time: '18:30', period: 'evening', isAvailable: false },
  { time: '19:00', period: 'evening', isAvailable: true },
  { time: '19:30', period: 'evening', isAvailable: true },
  { time: '20:00', period: 'evening', isAvailable: true },
  { time: '20:30', period: 'evening', isAvailable: true }
])

const filteredTimeSlots = computed(() => {
  return timeSlots.value.filter(slot => slot.period === selectedPeriod.value)
})

// Methods
const prevMonth = () => {
  currentMonth.value = moment(currentMonth.value).subtract(1, 'jMonth')
}

const nextMonth = () => {
  currentMonth.value = moment(currentMonth.value).add(1, 'jMonth')
}

const selectDate = (day) => {
  if (day.isAvailable && !day.isEmpty) {
    selectedDate.value = day.date
    selectedTimeSlot.value = null
  }
}

const selectTimeSlot = (slot) => {
  if (slot.isAvailable) {
    selectedTimeSlot.value = slot.time
  }
}

const getServiceLabel = (service) => {
  const labels = {
    scheduledCall: 'تماس با نوبت',
    clinicVisit: 'ویزیت در کلینیک',
    homeVisit: 'ویزیت در منزل'
  }
  return labels[service] || ''
}

// Validation
const canProceed = computed(() => {
  if (!selectedDate.value || !selectedTimeSlot.value) return false
  if (service.value === 'homeVisit') {
    return homeAddress.value.trim() !== '' && phoneNumber.value.trim() !== ''
  }
  return true
})

// Actions
const proceedToCheckout = () => {
  if (!canProceed.value) return
  
  const params = new URLSearchParams({
    service: service.value,
    date: selectedDate.value,
    time: selectedTimeSlot.value
  })
  
  if (service.value === 'homeVisit') {
    params.append('address', homeAddress.value)
    params.append('phone', phoneNumber.value)
  }
  
  navigateTo(`/booking/${route.params.id}/checkout?${params.toString()}`)
}
</script>
