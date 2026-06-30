<template>
  <Transition name="slide-down">
    <div 
      v-if="isVisible" 
      class="fixed top-0 left-0 right-0 z-[100] p-4 lg:p-0"
    >
      <div 
        class="max-w-2xl mx-auto lg:mt-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-2xl shadow-teal-500/30 overflow-hidden"
      >
        <!-- Progress Bar -->
        <div class="h-1 bg-teal-400/30">
          <div 
            class="h-full bg-white transition-all duration-1000 ease-linear"
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>

        <div class="p-4 lg:p-5">
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse-slow">
                <i class="ti ti-bell-ringing text-white text-2xl animate-wiggle"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">
                  سفارش جدید
                </span>
                <span class="text-white/80 text-xs">{{ order.code }}</span>
              </div>
              
              <h3 class="text-white font-bold text-lg mb-1">{{ order.customerName }}</h3>
              
              <p class="text-white/90 text-sm mb-2 line-clamp-1">
                {{ order.items }}
              </p>

              <div class="flex items-center gap-4 text-white/80 text-xs">
                <span class="flex items-center gap-1">
                  <i class="ti ti-map-pin"></i>
                  {{ order.address }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="ti ti-cash"></i>
                  {{ formatPrice(order.total) }} تومان
                </span>
              </div>
            </div>

            <!-- Timer & Actions -->
            <div class="flex flex-col items-center gap-3">
              <!-- Circular Timer -->
              <div class="relative w-16 h-16">
                <svg class="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="white"
                    stroke-width="4"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    class="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-white font-bold text-sm">{{ formatTime(remainingTime) }}</span>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex gap-2">
                <button
                  @click="showDetails = true"
                  class="px-4 py-2 bg-white text-teal-600 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg"
                >
                  <i class="ti ti-eye ml-1"></i>
                  جزئیات
                </button>
                <button
                  @click="rejectOrder"
                  class="px-3 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                >
                  <i class="ti ti-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sound indicator -->
        <div class="absolute top-4 left-4 flex items-center gap-2">
          <button 
            @click="toggleSound"
            class="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <i :class="soundEnabled ? 'ti ti-volume' : 'ti ti-volume-off'" class="text-white text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Order Details Modal -->
  <Transition name="fade">
    <div 
      v-if="showDetails" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      @click.self="showDetails = false"
    >
      <Transition name="scale">
        <div 
          v-if="showDetails"
          class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl"
        >
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-teal-500 to-teal-600 p-5 text-white">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <i class="ti ti-shopping-cart text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-lg">جزئیات سفارش</h3>
                  <p class="text-white/80 text-sm">{{ order.code }}</p>
                </div>
              </div>
              <button 
                @click="showDetails = false"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>
            
            <!-- Timer in modal -->
            <div class="flex items-center gap-3 bg-white/20 rounded-xl p-3">
              <i class="ti ti-clock text-xl"></i>
              <div class="flex-1">
                <p class="text-sm text-white/80">زمان باقی‌مانده برای پاسخ</p>
                <p class="font-bold text-lg">{{ formatTime(remainingTime) }}</p>
              </div>
              <div class="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-white transition-all duration-1000"
                  :style="{ width: progressWidth + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-5 overflow-y-auto max-h-[50vh]">
            <!-- Customer Info -->
            <div class="mb-5">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="ti ti-user text-teal-600"></i>
                اطلاعات مشتری
              </h4>
              <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-500 text-sm">نام</span>
                  <span class="font-medium text-gray-900">{{ order.customerName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 text-sm">تلفن</span>
                  <span class="font-medium text-gray-900 direction-ltr">{{ order.phone || '0912-XXX-XXXX' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 text-sm">آدرس</span>
                  <span class="font-medium text-gray-900 text-left max-w-[200px]">{{ order.address }}</span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mb-5">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="ti ti-package text-teal-600"></i>
                اقلام سفارش
              </h4>
              <div class="bg-gray-50 rounded-xl p-4">
                <div 
                  v-for="(item, index) in orderItems" 
                  :key="index"
                  class="flex items-center justify-between py-2"
                  :class="index !== orderItems.length - 1 ? 'border-b border-gray-200' : ''"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <i class="ti ti-pill text-teal-600"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 text-sm">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">تعداد: {{ item.quantity }}</p>
                    </div>
                  </div>
                  <span class="font-bold text-gray-900 text-sm">{{ formatPrice(item.price) }}</span>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-teal-50 rounded-xl p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">جمع کل</span>
                <span class="font-bold text-gray-900">{{ formatPrice(order.subtotal || order.total) }} تومان</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">هزینه ارسال</span>
                <span class="font-bold text-gray-900">{{ formatPrice(order.shipping || 25000) }} تومان</span>
              </div>
              <div class="border-t border-teal-200 pt-2 mt-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-teal-700">مبلغ قابل پرداخت</span>
                  <span class="font-bold text-teal-700 text-lg">{{ formatPrice(order.total) }} تومان</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="order.notes" class="mt-4">
              <h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="ti ti-notes text-teal-600"></i>
                یادداشت مشتری
              </h4>
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                {{ order.notes }}
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-5 bg-gray-50 border-t border-gray-200">
            <div class="flex gap-3">
              <button
                @click="rejectOrder"
                class="flex-1 px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
              >
                <i class="ti ti-x ml-2"></i>
                رد سفارش
              </button>
              <button
                @click="acceptOrder"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/30"
              >
                <i class="ti ti-check ml-2"></i>
                قبول سفارش
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      id: 1,
      code: 'ORD-1234',
      customerName: 'علی محمدی',
      items: 'غذای خشک سگ رویال کنین 2 کیلویی، شامپو ضد کک',
      address: 'تهران، ونک',
      total: 850000,
      phone: '0912-345-6789',
      notes: ''
    })
  },
  duration: {
    type: Number,
    default: 120 // 2 minutes in seconds
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['accept', 'reject', 'timeout', 'close'])

const isVisible = ref(false)
const showDetails = ref(false)
const remainingTime = ref(props.duration)
const soundEnabled = ref(true)
let timer = null
let audioContext = null

// Parse order items from string
const orderItems = computed(() => {
  if (props.order.orderItems && Array.isArray(props.order.orderItems)) {
    return props.order.orderItems
  }
  // Parse from items string
  const itemsStr = props.order.items || ''
  return itemsStr.split('،').map((item, index) => ({
    name: item.trim(),
    quantity: 1,
    price: Math.floor((props.order.total || 100000) / (itemsStr.split('،').length))
  }))
})

// Circular progress calculations
const circumference = 2 * Math.PI * 28
const strokeDashoffset = computed(() => {
  const progress = remainingTime.value / props.duration
  return circumference * (1 - progress)
})

const progressWidth = computed(() => {
  return (remainingTime.value / props.duration) * 100
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const playNotificationSound = () => {
  if (!soundEnabled.value) return
  
  try {
    // Create notification sound with multiple tones
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Play 3 beeps
    const playBeep = (startTime, frequency) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.5, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.15)
    }
    
    // Three ascending beeps
    const now = audioContext.currentTime
    playBeep(now, 700)
    playBeep(now + 0.2, 900)
    playBeep(now + 0.4, 1100)
    
  } catch (e) {
    console.log('Audio not supported')
  }
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
}

const startTimer = () => {
  remainingTime.value = props.duration
  timer = setInterval(() => {
    remainingTime.value--
    
    // Play warning sound at 30 seconds
    if (remainingTime.value === 30) {
      playNotificationSound()
    }
    
    if (remainingTime.value <= 0) {
      clearInterval(timer)
      emit('timeout')
      hideNotification()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const showNotification = () => {
  isVisible.value = true
  playNotificationSound()
  startTimer()
}

const hideNotification = () => {
  isVisible.value = false
  showDetails.value = false
  stopTimer()
  emit('close')
}

const acceptOrder = () => {
  showDetails.value = false
  emit('accept', props.order)
  hideNotification()
}

const rejectOrder = () => {
  showDetails.value = false
  //emit('reject', props.order)
  hideNotification()
}

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    showNotification()
  } else {
    hideNotification()
  }
})

onMounted(() => {
  if (props.show) {
    showNotification()
  }
})

onUnmounted(() => {
  stopTimer()
  if (audioContext) {
    audioContext.close()
  }
})

// Expose methods for parent component
defineExpose({
  show: showNotification,
  hide: hideNotification
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Fade transition for modal backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale transition for modal content */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.direction-ltr {
  direction: ltr;
}
</style>
