<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- هدر -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">اعلان‌های ویزیت</h1>
          <p class="text-sm text-gray-500">{{ unreadCount }} اعلان خوانده نشده</p>
        </div>
        <button 
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
        >
          علامت همه به عنوان خوانده شده
        </button>
      </div>

      <!-- فیلتر -->
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button 
          @click="filterType = 'all'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
            filterType === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
          ]"
        >
          همه ({{ notifications.length }})
        </button>
        <button 
          @click="filterType = 'unread'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
            filterType === 'unread' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
          ]"
        >
          خوانده نشده ({{ unreadCount }})
        </button>
        <button 
          @click="filterType = 'in-person'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
            filterType === 'in-person' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
          ]"
        >
          ویزیت حضوری
        </button>
        <button 
          @click="filterType = 'home-visit'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
            filterType === 'home-visit' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
          ]"
        >
          ویزیت در منزل
        </button>
        <button 
          @click="filterType = 'online'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
            filterType === 'online' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
          ]"
        >
          ویزیت آنلاین
        </button>
        <button 
          @click="filterType = 'phone'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap',
            filterType === 'phone' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
          ]"
        >
          مشاوره تلفنی
        </button>
      </div>
    </div>

    <!-- لیست اعلان‌ها -->
    <div class="space-y-3">
      <div v-if="filteredNotifications.length === 0" class="bg-white rounded-xl p-12 text-center">
        <i class="ti ti-bell-off text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">اعلانی وجود ندارد</p>
      </div>

      <div 
        v-for="notif in filteredNotifications" 
        :key="notif.id"
        @click="handleNotificationClick(notif)"
        class="bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
        :class="!notif.read ? 'border-r-4 border-emerald-500' : ''"
      >
        <div class="flex gap-4">
          <!-- آیکون -->
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
            notif.visitType === 'in-person' ? 'bg-emerald-100' :
            notif.visitType === 'home-visit' ? 'bg-amber-100' :
            notif.visitType === 'online' ? 'bg-blue-100' :
            notif.visitType === 'phone' ? 'bg-purple-100' :
            'bg-gray-100'
          ]">
            <i :class="[
              'text-2xl',
              notif.visitType === 'in-person' ? 'ti ti-building-hospital text-emerald-600' :
              notif.visitType === 'home-visit' ? 'ti ti-home-heart text-amber-600' :
              notif.visitType === 'online' ? 'ti ti-message-circle text-blue-600' :
              notif.visitType === 'phone' ? 'ti ti-phone text-purple-600' :
              'ti ti-bell text-gray-600'
            ]"></i>
          </div>

          <!-- محتوا -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 class="text-base font-bold text-gray-900">{{ notif.title }}</h3>
                <span :class="[
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                  notif.visitType === 'in-person' ? 'bg-emerald-100 text-emerald-700' :
                  notif.visitType === 'home-visit' ? 'bg-amber-100 text-amber-700' :
                  notif.visitType === 'online' ? 'bg-blue-100 text-blue-700' :
                  notif.visitType === 'phone' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                ]">
                  <i :class="[
                    'text-sm',
                    notif.visitType === 'in-person' ? 'ti ti-building-hospital' :
                    notif.visitType === 'home-visit' ? 'ti ti-home-heart' :
                    notif.visitType === 'online' ? 'ti ti-message-circle' :
                    notif.visitType === 'phone' ? 'ti ti-phone' :
                    'ti ti-bell'
                  ]"></i>
                  {{ getVisitTypeLabel(notif.visitType) }}
                </span>
              </div>
              <span v-if="!notif.read" class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ notif.message }}</p>
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <i class="ti ti-clock"></i>
                {{ notif.time }}
              </span>
              <span class="flex items-center gap-1">
                <i class="ti ti-calendar"></i>
                {{ notif.date }}
              </span>
              <span v-if="notif.patientName" class="flex items-center gap-1">
                <i class="ti ti-paw"></i>
                {{ notif.patientName }}
              </span>
            </div>
          </div>

          <!-- اکشن -->
          <div class="flex flex-col gap-2">
            <button 
              v-if="!notif.read"
              @click.stop="markAsRead(notif.id)"
              class="p-2 bg-gray-100 rounded-lg"
              title="علامت به عنوان خوانده شده"
            >
              <i class="ti ti-check text-gray-600"></i>
            </button>
            <button 
              @click.stop="deleteNotification(notif.id)"
              class="p-2 bg-red-50 rounded-lg"
              title="حذف اعلان"
            >
              <i class="ti ti-trash text-red-600"></i>
            </button>
          </div>
        </div>

        <!-- لینک سریع -->
        <div v-if="notif.action" class="mt-3 pt-3 border-t border-gray-100">
          <router-link 
            :to="notif.action.link"
            class="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium"
          >
            <span>{{ notif.action.label }}</span>
            <i class="ti ti-arrow-left"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- صفحه‌بندی -->
    <div v-if="totalPages > 1" class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="text-sm text-gray-600">
          {{ startItem }} - {{ endItem }} از {{ filteredNotifications.length }}
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="w-9 h-9 rounded-lg bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i class="ti ti-chevron-right text-gray-700"></i>
          </button>
          
          <div class="flex items-center gap-1">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium',
                currentPage === page 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="w-9 h-9 rounded-lg bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i class="ti ti-chevron-left text-gray-700"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const filterType = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Audio notification
const notificationSound = ref(null)

onMounted(() => {
  if (process.client) {
    // Create audio element for notification sound
    notificationSound.value = new Audio('/sounds/notification.mp3')
  }
})

// Play sound for new notification
const playNotificationSound = () => {
  if (notificationSound.value) {
    notificationSound.value.play().catch(e => {
      console.log('Could not play notification sound:', e)
    })
  }
}

// لیست اعلان‌های ویزیت
const notifications = ref([
  {
    id: 1,
    visitType: 'in-person',
    title: 'ویزیت حضوری جدید',
    message: 'سارا احمدی برای ساعت 14:00 امروز نوبت گرفت',
    patientName: 'میلو (گربه)',
    time: '10 دقیقه پیش',
    date: '1403/07/29',
    read: false,
    action: {
      label: 'مشاهده نوبت',
      link: '/panel/clinics/appointments'
    }
  },
  {
    id: 2,
    visitType: 'online',
    title: 'درخواست گفتگوی آنلاین',
    message: 'محمد رضایی درخواست گفتگوی آنلاین دارد',
    patientName: 'چارلی (سگ)',
    time: '30 دقیقه پیش',
    date: '1403/07/29',
    read: false,
    action: {
      label: 'مشاهده درخواست',
      link: '/panel/clinics/appointments'
    }
  },
  {
    id: 3,
    visitType: 'phone',
    title: 'درخواست مشاوره تلفنی',
    message: 'فاطمه حسینی درخواست مشاوره تلفنی دارد',
    patientName: 'لاکی (سگ)',
    time: '1 ساعت پیش',
    date: '1403/07/29',
    read: false,
    action: {
      label: 'مشاهده درخواست',
      link: '/panel/clinics/appointments'
    }
  },
  {
    id: 4,
    visitType: 'home-visit',
    title: 'ویزیت در منزل جدید',
    message: 'علی محمدی برای ویزیت در منزل ساعت 16:00 نوبت گرفت',
    patientName: 'پرنسس (گربه)',
    time: '2 ساعت پیش',
    date: '1403/07/29',
    read: false,
    action: {
      label: 'مشاهده نوبت',
      link: '/panel/clinics/appointments'
    }
  },
  {
    id: 5,
    visitType: 'in-person',
    title: 'لغو ویزیت حضوری',
    message: 'زهرا کریمی نوبت ساعت 11:00 خود را لغو کرد',
    patientName: 'باکس (سگ)',
    time: '3 ساعت پیش',
    date: '1403/07/29',
    read: true
  },
  {
    id: 6,
    visitType: 'online',
    title: 'گفتگوی آنلاین تأیید شد',
    message: 'گفتگوی آنلاین با امیر احمدی شروع شد',
    patientName: 'فلافی (خرگوش)',
    time: '5 ساعت پیش',
    date: '1403/07/29',
    read: true,
    action: {
      label: 'ورود به چت',
      link: '/panel/clinics/chats'
    }
  },
  {
    id: 7,
    visitType: 'phone',
    title: 'مشاوره تلفنی تکمیل شد',
    message: 'مشاوره تلفنی با مریم رضایی به پایان رسید',
    patientName: 'پشمک (گربه)',
    time: '6 ساعت پیش',
    date: '1403/07/28',
    read: true
  },
  {
    id: 8,
    visitType: 'home-visit',
    title: 'ویزیت در منزل فردا',
    message: 'یادآوری: ویزیت در منزل برای فردا ساعت 10:00',
    patientName: 'رکس (سگ)',
    time: '1 روز پیش',
    date: '1403/07/28',
    read: true,
    action: {
      label: 'مشاهده جزئیات',
      link: '/panel/clinics/appointments'
    }
  },
  {
    id: 9,
    visitType: 'in-person',
    title: 'تغییر زمان ویزیت',
    message: 'حسن نوری زمان ویزیت را به ساعت 15:00 تغییر داد',
    patientName: 'توپی (همستر)',
    time: '2 روز پیش',
    date: '1403/07/27',
    read: true
  },
  {
    id: 10,
    visitType: 'online',
    title: 'درخواست گفتگو رد شد',
    message: 'درخواست گفتگوی آنلاین کاربر ناشناس رد شد',
    patientName: '-',
    time: '3 روز پیش',
    date: '1403/07/26',
    read: true
  }
])

// Watch for new unread notifications and play sound
watch(() => notifications.value.filter(n => !n.read).length, (newCount, oldCount) => {
  if (newCount > oldCount) {
    playNotificationSound()
  }
})

// Get visit type label
const getVisitTypeLabel = (type) => {
  const labels = {
    'in-person': 'حضوری',
    'home-visit': 'ویزیت در منزل',
    'online': 'آنلاین',
    'phone': 'تلفنی'
  }
  return labels[type] || 'نامشخص'
}

// فیلتر اعلان‌ها
const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (filterType.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (filterType.value !== 'all') {
    filtered = filtered.filter(n => n.visitType === filterType.value)
  }

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

// تعداد خوانده نشده
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// صفحه‌بندی
const totalPages = computed(() => {
  let filtered = notifications.value
  if (filterType.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (filterType.value !== 'all') {
    filtered = filtered.filter(n => n.visitType === filterType.value)
  }
  return Math.ceil(filtered.length / itemsPerPage)
})

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, filteredNotifications.value.length))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// متدها
const handleNotificationClick = (notif) => {
  markAsRead(notif.id)
  playNotificationSound()
  
  if (notif.action?.link) {
    router.push(notif.action.link)
  }
}

const markAsRead = (id) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) {
    notif.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const deleteNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

// ریست صفحه وقتی فیلتر تغییر می‌کنه
watch(filterType, () => {
  currentPage.value = 1
})
</script>
