<template>
  <div class="space-y-4">
    <!-- هدر -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-900">درخواست‌های فوری</h2>
          <p class="text-sm text-gray-500">گفتگوی آنلاین و تماس تلفنی - بدون نیاز به رزرو</p>
        </div>
        <div class="flex items-center gap-2">
          <span :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          ]">
            <span class="w-2 h-2 rounded-full inline-block ml-1" :class="isOnline ? 'bg-green-500' : 'bg-gray-400'"></span>
            {{ isOnline ? 'آنلاین' : 'آفلاین' }}
          </span>
          <button 
            @click="toggleOnlineStatus"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isOnline 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            ]"
          >
            {{ isOnline ? 'غیرفعال کردن' : 'فعال کردن' }}
          </button>
        </div>
      </div>
    </div>

    <!-- درخواست‌های در انتظار -->
    <div v-if="pendingRequests.length > 0" class="space-y-3">
      <h3 class="text-sm font-medium text-gray-700 px-1">درخواست‌های در انتظار ({{ pendingRequests.length }})</h3>
      
      <div 
        v-for="request in pendingRequests" 
        :key="request.id"
        class="bg-white rounded-xl p-4 border-r-4 animate-pulse-slow"
        :class="request.type === 'online-chat' ? 'border-r-indigo-500' : 'border-r-red-500'"
      >
        <div class="flex items-start gap-4">
          <!-- آواتار -->
          <div class="relative">
            <img :src="request.petAvatar" class="w-14 h-14 rounded-xl object-cover" />
            <div :class="[
              'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center',
              request.type === 'online-chat' ? 'bg-indigo-500' : 'bg-red-500'
            ]">
              <i :class="[
                'text-white text-xs',
                request.type === 'online-chat' ? 'ti ti-message-circle' : 'ti ti-phone'
              ]"></i>
            </div>
          </div>

          <!-- اطلاعات -->
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-bold text-gray-900">{{ request.petName }}</h4>
                <p class="text-sm text-gray-500">{{ request.ownerName }}</p>
              </div>
              <span :class="[
                'px-2 py-1 rounded-lg text-xs font-medium',
                request.type === 'online-chat' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'
              ]">
                {{ request.type === 'online-chat' ? '💬 گفتگوی آنلاین' : '📞 تماس فوری' }}
              </span>
            </div>

            <p v-if="request.description" class="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">
              {{ request.description }}
            </p>

            <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <i class="ti ti-clock"></i>
                {{ formatWaitTime(request.createdAt) }} در انتظار
              </span>
              <span class="flex items-center gap-1">
                <i class="ti ti-paw"></i>
                {{ request.petType }}
              </span>
            </div>

            <!-- دکمه‌های عملیات -->
            <div class="flex gap-2 mt-4">
              <button 
                @click="acceptRequest(request)"
                :class="[
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                  request.type === 'online-chat' 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                ]"
              >
                <i :class="request.type === 'online-chat' ? 'ti ti-message-circle' : 'ti ti-phone'"></i>
                {{ request.type === 'online-chat' ? 'شروع گفتگو' : 'برقراری تماس' }}
              </button>
              <button 
                @click="rejectRequest(request)"
                class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                رد کردن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- حالت خالی -->
    <div v-else class="bg-white rounded-xl p-8 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="ti ti-phone-off text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-gray-700 font-medium mb-2">درخواست فوری جدیدی ندارید</h3>
      <p class="text-sm text-gray-500">
        {{ isOnline ? 'منتظر درخواست‌های جدید باشید' : 'برای دریافت درخواست، وضعیت خود را فعال کنید' }}
      </p>
    </div>

    <!-- تاریخچه درخواست‌های امروز -->
    <div v-if="todayHistory.length > 0" class="bg-white rounded-xl p-4">
      <h3 class="font-medium text-gray-900 mb-4">تاریخچه امروز</h3>
      <div class="space-y-2">
        <div 
          v-for="item in todayHistory" 
          :key="item.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center',
              item.type === 'online-chat' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'
            ]">
              <i :class="item.type === 'online-chat' ? 'ti ti-message-circle' : 'ti ti-phone'"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ item.petName }} - {{ item.ownerName }}</p>
              <p class="text-xs text-gray-500">{{ item.duration }} دقیقه</p>
            </div>
          </div>
          <div class="text-left">
            <p class="text-sm text-gray-600">{{ item.time }}</p>
            <span :class="[
              'text-xs px-2 py-0.5 rounded',
              item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ item.status === 'completed' ? 'انجام شد' : 'رد شد' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال گفتگو/تماس در حال انجام -->
    <Teleport to="body">
      <div 
        v-if="activeSession" 
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
          <!-- هدر -->
          <div :class="[
            'p-4 text-white',
            activeSession.type === 'online-chat' ? 'bg-indigo-500' : 'bg-red-500'
          ]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img :src="activeSession.petAvatar" class="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 class="font-bold">{{ activeSession.petName }}</h3>
                  <p class="text-sm opacity-80">{{ activeSession.ownerName }}</p>
                </div>
              </div>
              <div class="text-left">
                <div class="text-2xl font-mono">{{ formatDuration(sessionDuration) }}</div>
                <p class="text-xs opacity-80">{{ activeSession.type === 'online-chat' ? 'گفتگوی آنلاین' : 'تماس تلفنی' }}</p>
              </div>
            </div>
          </div>

          <!-- محتوا -->
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500">نوع حیوان</p>
                <p class="font-medium text-gray-900">{{ activeSession.petType }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500">تلفن</p>
                <p class="font-medium text-gray-900 font-mono">{{ activeSession.phone }}</p>
              </div>
            </div>

            <div v-if="activeSession.description" class="bg-amber-50 rounded-lg p-3 mb-6">
              <p class="text-xs text-amber-600 mb-1">توضیحات بیمار</p>
              <p class="text-sm text-amber-800">{{ activeSession.description }}</p>
            </div>

            <!-- دکمه‌ها -->
            <div class="flex gap-3">
              <button 
                @click="endSession"
                class="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <i class="ti ti-check"></i>
                پایان و ثبت
              </button>
              <button 
                v-if="activeSession.type === 'online-chat'"
                @click="openChat"
                class="px-6 py-3 bg-indigo-100 text-indigo-600 rounded-xl font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2"
              >
                <i class="ti ti-message-circle"></i>
                چت
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['start-chat', 'start-call'])

const isOnline = ref(true)
const activeSession = ref(null)
const sessionDuration = ref(0)
let durationInterval = null

// درخواست‌های نمونه
const pendingRequests = ref([
  {
    id: 1,
    type: 'online-chat',
    petName: 'مکس',
    petType: 'سگ - گلدن رتریور',
    petAvatar: 'https://placedog.net/100/100?id=1',
    ownerName: 'علی محمدی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    description: 'سگم از دیشب غذا نمیخوره و بی‌حاله',
    createdAt: new Date(Date.now() - 5 * 60000)
  },
  {
    id: 2,
    type: 'phone-call',
    petName: 'لوسی',
    petType: 'گربه - پرشین',
    petAvatar: 'https://placekitten.com/100/100',
    ownerName: 'سارا احمدی',
    phone: '۰۹۱۲۸۷۶۵۴۳۲',
    description: 'گربه‌ام استفراغ میکنه، خیلی نگرانم',
    createdAt: new Date(Date.now() - 2 * 60000)
  }
])

const todayHistory = ref([
  {
    id: 101,
    type: 'online-chat',
    petName: 'راکی',
    ownerName: 'رضا کریمی',
    duration: 15,
    time: '۱۰:۳۰',
    status: 'completed'
  },
  {
    id: 102,
    type: 'phone-call',
    petName: 'بلا',
    ownerName: 'مریم حسینی',
    duration: 8,
    time: '۰۹:۱۵',
    status: 'completed'
  }
])

function toggleOnlineStatus() {
  isOnline.value = !isOnline.value
}

function formatWaitTime(date) {
  const minutes = Math.floor((Date.now() - date) / 60000)
  if (minutes < 1) return 'کمتر از یک دقیقه'
  return `${minutes} دقیقه`
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function acceptRequest(request) {
  activeSession.value = request
  sessionDuration.value = 0
  
  // حذف از لیست انتظار
  pendingRequests.value = pendingRequests.value.filter(r => r.id !== request.id)
  
  // شروع تایمر
  durationInterval = setInterval(() => {
    sessionDuration.value++
  }, 1000)

  if (request.type === 'online-chat') {
    emit('start-chat', request)
  } else {
    emit('start-call', request)
  }
}

function rejectRequest(request) {
  pendingRequests.value = pendingRequests.value.filter(r => r.id !== request.id)
  
  // اضافه به تاریخچه
  todayHistory.value.unshift({
    id: request.id,
    type: request.type,
    petName: request.petName,
    ownerName: request.ownerName,
    duration: 0,
    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    status: 'rejected'
  })
}

function endSession() {
  if (durationInterval) {
    clearInterval(durationInterval)
    durationInterval = null
  }

  // اضافه به تاریخچه
  todayHistory.value.unshift({
    id: activeSession.value.id,
    type: activeSession.value.type,
    petName: activeSession.value.petName,
    ownerName: activeSession.value.ownerName,
    duration: Math.floor(sessionDuration.value / 60),
    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  })

  activeSession.value = null
  sessionDuration.value = 0
}

function openChat() {
  // باز کردن پنجره چت
  emit('start-chat', activeSession.value)
}

onUnmounted(() => {
  if (durationInterval) {
    clearInterval(durationInterval)
  }
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>
