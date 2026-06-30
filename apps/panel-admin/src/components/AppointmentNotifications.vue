<template>
  <div class="relative">
    <!-- دکمه نوتیفیکیشن -->
    <button 
      @click="isOpen = !isOpen"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <i class="ti ti-bell text-xl"></i>
      <!-- بج تعداد -->
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
      <!-- نشانگر اتصال -->
      <span 
        :class="[
          'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white',
          isConnected ? 'bg-green-500' : 'bg-gray-400'
        ]"
      ></span>
    </button>

    <!-- پنل نوتیفیکیشن‌ها -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div 
        v-if="isOpen"
        class="absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      >
        <!-- هدر -->
        <div class="p-4 border-b border-gray-100 bg-gradient-to-l from-emerald-500 to-emerald-600 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="ti ti-bell-ringing text-xl"></i>
              <h3 class="font-bold">اعلان‌ها</h3>
              <span v-if="unreadCount > 0" class="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {{ unreadCount }} جدید
              </span>
            </div>
            <button 
              v-if="notifications.length > 0"
              @click="markAllAsRead"
              class="text-xs text-emerald-100 hover:text-white"
            >
              علامت‌گذاری همه
            </button>
          </div>
        </div>

        <!-- لیست نوتیفیکیشن‌ها -->
        <div class="max-h-[400px] overflow-y-auto">
          <template v-if="notifications.length > 0">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              :class="[
                'p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50',
                !notification.read ? 'bg-emerald-50/50' : '',
                notification.priority === 'urgent' ? 'border-r-4 border-r-red-500' : '',
                notification.priority === 'high' ? 'border-r-4 border-r-amber-500' : ''
              ]"
            >
              <div class="flex gap-3">
                <!-- آیکون -->
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  getNotificationIconClass(notification.type)
                ]">
                  <i :class="['text-lg', getNotificationIcon(notification.type)]"></i>
                </div>
                
                <!-- محتوا -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h4 :class="['text-sm font-medium', !notification.read ? 'text-gray-900' : 'text-gray-600']">
                      {{ notification.title }}
                    </h4>
                    <button 
                      @click.stop="removeNotification(notification.id)"
                      class="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <i class="ti ti-x text-xs"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ notification.message }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-[10px] text-gray-400">{{ formatTime(notification.time) }}</span>
                    <span 
                      v-if="notification.priority === 'urgent'"
                      class="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-medium"
                    >
                      فوری
                    </span>
                  </div>
                </div>
              </div>

              <!-- دکمه‌های عملیات برای درخواست‌های فوری -->
              <div 
                v-if="notification.type === 'urgent-request' && !notification.read"
                class="flex gap-2 mt-3 pr-13"
              >
                <button 
                  @click.stop="acceptUrgentRequest(notification)"
                  class="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                >
                  <i class="ti ti-check"></i>
                  قبول
                </button>
                <button 
                  @click.stop="rejectUrgentRequest(notification)"
                  class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  <i class="ti ti-x"></i>
                  رد کردن
                </button>
              </div>
            </div>
          </template>

          <!-- حالت خالی -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ti ti-bell-off text-3xl text-gray-400"></i>
            </div>
            <p class="text-gray-500 text-sm">اعلان جدیدی ندارید</p>
          </div>
        </div>

        <!-- فوتر -->
        <div class="p-3 border-t border-gray-100 bg-gray-50">
          <router-link 
            to="/clinic/notifications"
            class="block w-full py-2 text-center text-sm text-emerald-600 font-medium hover:text-emerald-700"
            @click="isOpen = false"
          >
            مشاهده همه اعلان‌ها
          </router-link>
        </div>
      </div>
    </Transition>

    <!-- Overlay برای بستن -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40" 
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppointmentNotifications } from '@/composables/useAppointmentNotifications'

const props = defineProps({
  clinicId: {
    type: String,
    default: '1'
  }
})

const emit = defineEmits(['open-appointment', 'open-urgent-request', 'accept-urgent', 'reject-urgent'])

const isOpen = ref(false)

const {
  notifications,
  unreadCount,
  isConnected,
  connectWebSocket,
  markAsRead,
  markAllAsRead,
  removeNotification,
  startAppointmentCheck,
  disconnect
} = useAppointmentNotifications()

function getNotificationIcon(type) {
  const icons = {
    'appointment-reminder': 'ti ti-alarm',
    'urgent-request': 'ti ti-urgent',
    'new-appointment': 'ti ti-calendar-plus',
    'appointment-cancelled': 'ti ti-calendar-x',
    'daily-summary': 'ti ti-calendar-stats'
  }
  return icons[type] || 'ti ti-bell'
}

function getNotificationIconClass(type) {
  const classes = {
    'appointment-reminder': 'bg-amber-100 text-amber-600',
    'urgent-request': 'bg-red-100 text-red-600',
    'new-appointment': 'bg-emerald-100 text-emerald-600',
    'appointment-cancelled': 'bg-gray-100 text-gray-600',
    'daily-summary': 'bg-blue-100 text-blue-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

function formatTime(time) {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 1) return 'همین الان'
  if (minutes < 60) return `${minutes} دقیقه پیش`
  if (hours < 24) return `${hours} ساعت پیش`
  
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(time)
}

function handleNotificationClick(notification) {
  markAsRead(notification.id)
  
  if (notification.type === 'appointment-reminder' || notification.type === 'new-appointment') {
    emit('open-appointment', notification.appointment)
  } else if (notification.type === 'urgent-request') {
    emit('open-urgent-request', notification.request)
  }
}

function acceptUrgentRequest(notification) {
  markAsRead(notification.id)
  emit('accept-urgent', notification.request)
}

function rejectUrgentRequest(notification) {
  markAsRead(notification.id)
  emit('reject-urgent', notification.request)
}

// Event listeners برای نوتیفیکیشن‌ها
function handleOpenAppointment(event) {
  emit('open-appointment', event.detail)
}

function handleOpenUrgentRequest(event) {
  emit('open-urgent-request', event.detail)
}

onMounted(() => {
  // اتصال WebSocket
  connectWebSocket(props.clinicId)
  
  // گوش دادن به رویدادها
  window.addEventListener('open-appointment', handleOpenAppointment)
  window.addEventListener('open-urgent-request', handleOpenUrgentRequest)
})

onUnmounted(() => {
  disconnect()
  window.removeEventListener('open-appointment', handleOpenAppointment)
  window.removeEventListener('open-urgent-request', handleOpenUrgentRequest)
})
</script>
