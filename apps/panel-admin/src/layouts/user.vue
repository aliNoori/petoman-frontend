<template>
  <div class="min-h-screen bg-gray-50" dir="rtl">
    <!-- Desktop Header -->
    <header class="hidden lg:block fixed top-0 right-72 left-0 bg-white border-b border-gray-200 z-30">
      <div class="flex items-center justify-between px-6 py-3">
        <!-- Upcoming Appointment -->
        <div v-if="upcomingAppointment" class="flex items-center gap-3 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getAppointmentTypeStyle(upcomingAppointment.type).bg">
            <i :class="[getAppointmentTypeStyle(upcomingAppointment.type).icon, getAppointmentTypeStyle(upcomingAppointment.type).color, 'text-sm']"></i>
          </div>
          <div>
            <p class="text-[10px] text-gray-500">رزرو آینده شما</p>
            <p class="text-sm font-medium text-gray-900">{{ upcomingAppointment.doctorName }} <span class="text-xs text-gray-500 font-normal">• {{ upcomingAppointment.date }} {{ upcomingAppointment.time }}</span></p>
          </div>
          <button @click="showAppointmentDetails(upcomingAppointment)" class="text-blue-600 text-xs hover:text-blue-700 mr-2">
            مشاهده
          </button>
        </div>
        <div v-else></div>

        <!-- Header Icons -->
        <div class="flex items-center gap-2">
          <!-- Messages -->
          <router-link to="/users/chat" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative">
            <i class="ti ti-message-dots text-xl"></i>
            <span v-if="unreadMessages > 0" class="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{{ unreadMessages }}</span>
          </router-link>

          <!-- Notifications -->
          <div class="relative">
            <button 
              @click.stop="showNotifications = !showNotifications" 
              class="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative"
            >
              <i class="ti ti-bell text-xl"></i>
              <span v-if="unreadNotifications > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{{ unreadNotifications }}</span>
            </button>

            <!-- Notifications Dropdown -->
            <div 
              v-if="showNotifications"
              class="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl overflow-hidden z-50"
            >
              <div class="p-3 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-bold text-gray-900">اعلان‌ها</h3>
                <button class="text-sm text-blue-600 hover:text-blue-700">خواندن همه</button>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div 
                  v-for="notif in notifications" 
                  :key="notif.id"
                  class="p-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer"
                  :class="{ 'bg-blue-50': !notif.read }"
                >
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="notif.iconBg">
                      <i :class="[notif.icon, notif.iconColor]"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900">{{ notif.title }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ notif.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <router-link to="/users/notifications" class="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 border-t border-gray-100">
                مشاهده همه اعلان‌ها
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </header>

    <!-- Mobile Header -->
    <div v-if="!pagesWithOwnHeader" class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="sidebarOpen = true" class="p-2 hover:bg-gray-100 rounded-lg">
          <i class="ti ti-menu-2 text-xl text-gray-700"></i>
        </button>
        <img src="/images/logo-petoman.svg" alt="پتومن" class="h-8" />
        <div class="flex items-center gap-1">
          <router-link to="/users/notifications" class="p-2 hover:bg-gray-100 rounded-lg relative">
            <i class="ti ti-bell text-xl text-gray-700"></i>
            <span v-if="unreadNotifications > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="sidebarOpen" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside 
      class="fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-50 transition-transform duration-300 w-72"
      :class="{ 'translate-x-full lg:translate-x-0': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <!-- Logo -->
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <img src="/images/logo-petoman.svg" alt="پتومن" class="h-8" />
        <button @click="sidebarOpen = false" class="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <i class="ti ti-x text-gray-500"></i>
        </button>
      </div>
      
      <!-- User Profile -->
      <div class="p-4 border-b border-gray-100 bg-gradient-to-l from-blue-50 to-white">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
            <i class="ti ti-user text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 class="font-bold text-gray-900">علی محمدی</h1>
            <p class="text-sm text-gray-500">09123456789</p>
            <div class="flex items-center gap-1 mt-1">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span class="text-xs text-green-600">فعال</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 200px);">
        
        <router-link 
          to="/users" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path === '/users' }"
          @click="sidebarOpen = false"
        >
          <i class="ti ti-home text-xl"></i>
          <span>خانه</span>
        </router-link>

        <router-link 
          to="/users/visits" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path.includes('/users/visits') || $route.path.includes('/users/chat') }"
          @click="sidebarOpen = false"
        >
          <i class="ti ti-stethoscope text-xl"></i>
          <span>ویزیت‌ها و مشاوره</span>
          <span v-if="activeChats > 0" class="mr-auto px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">{{ activeChats }}</span>
        </router-link>

        <router-link 
          to="/users/orders" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path.includes('/users/orders') }"
          @click="sidebarOpen = false"
        >
          <i class="ti ti-shopping-cart text-xl"></i>
          <span>سفارشات</span>
          <span class="mr-auto px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">6</span>
        </router-link>

        <router-link 
          to="/users/notifications" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path.includes('/users/notifications') }"
          @click="sidebarOpen = false"
        >
          <i class="ti ti-bell text-xl"></i>
          <span>اعلان‌ها</span>
          <span v-if="unreadNotifications > 0" class="mr-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{{ unreadNotifications }}</span>
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
        <button @click="logout" class="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <i class="ti ti-logout text-xl"></i>
          <span class="font-medium">خروج از حساب</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main 
      class="lg:mr-72 lg:pt-16 min-h-screen" 
      :class="fullScreenMobile ? 'pt-0' : 'pt-16'"
    >
      <div 
        class="lg:p-6 lg:pb-6" 
        :class="fullScreenMobile ? 'p-0 pb-0' : 'p-4 pb-24'"
      >
        <router-view />
      </div>
    </main>

    <!-- Mobile Bottom Nav -->
    <nav v-if="!pagesWithOwnHeader" class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div class="flex items-center justify-around py-1 px-2">
        <router-link 
          to="/users" 
          class="flex flex-col items-center py-2 px-3 rounded-xl transition-all"
          :class="$route.path === '/users' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'"
        >
          <i class="ti ti-home text-xl"></i>
          <span class="text-[10px] mt-0.5 font-medium">خانه</span>
        </router-link>
        
        <router-link 
          to="/users/visits" 
          class="flex flex-col items-center py-2 px-3 rounded-xl transition-all"
          :class="$route.path.includes('/users/visits') ? 'text-blue-600 bg-blue-50' : 'text-gray-400'"
        >
          <div class="relative">
            <i class="ti ti-stethoscope text-xl"></i>
            <span v-if="activeChats > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{{ activeChats }}</span>
          </div>
          <span class="text-[10px] mt-0.5 font-medium">ویزیت‌ها</span>
        </router-link>
        
        <router-link 
          to="/users/chat" 
          class="flex flex-col items-center py-2 px-3 rounded-xl transition-all"
          :class="$route.path.includes('/users/chat') ? 'text-blue-600 bg-blue-50' : 'text-gray-400'"
        >
          <div class="relative">
            <i class="ti ti-message-dots text-xl"></i>
            <span v-if="unreadMessages > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{{ unreadMessages }}</span>
          </div>
          <span class="text-[10px] mt-0.5 font-medium">پیام‌ها</span>
        </router-link>
        
        <router-link 
          to="/users/orders" 
          class="flex flex-col items-center py-2 px-3 rounded-xl transition-all"
          :class="$route.path.includes('/users/orders') ? 'text-blue-600 bg-blue-50' : 'text-gray-400'"
        >
          <i class="ti ti-shopping-cart text-xl"></i>
          <span class="text-[10px] mt-0.5 font-medium">سفارشات</span>
        </router-link>
      </div>
    </nav>
  </div>

  <!-- مودال جزئیات رزرو آینده -->
  <div 
    v-if="showAppointmentModal" 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
    @click.self="showAppointmentModal = false"
  >
    <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-gray-200 shadow-xl">
      <!-- هدر -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-50">
        <div class="flex items-center gap-2">
          <i class="ti ti-calendar-event text-emerald-600"></i>
          <h3 class="font-bold text-gray-900">رزرو آینده شما</h3>
        </div>
        <button @click="showAppointmentModal = false" class="p-2 hover:bg-emerald-100 rounded-lg">
          <i class="ti ti-x text-gray-500"></i>
        </button>
      </div>
      
      <!-- محتوا -->
      <div class="p-4 space-y-4" v-if="selectedAppointment">
        <!-- اطلاعات دکتر -->
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <i class="ti ti-user text-emerald-600 text-2xl"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-gray-900 text-lg">{{ selectedAppointment.doctorName }}</h4>
            <p class="text-sm text-gray-500">{{ selectedAppointment.specialty || 'دامپزشک' }}</p>
          </div>
        </div>
        
        <!-- اطلاعات نوبت -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">نوع ویزیت</p>
            <p class="font-medium text-gray-900 flex items-center gap-2">
              <i :class="[getAppointmentTypeStyle(selectedAppointment.type).icon, getAppointmentTypeStyle(selectedAppointment.type).color]"></i>
              {{ getAppointmentTypeStyle(selectedAppointment.type).label }}
            </p>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">هزینه</p>
            <p class="font-medium text-gray-900">{{ selectedAppointment.price?.toLocaleString('fa-IR') || '۱۴۰,۰۰۰' }} تومان</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">تاریخ</p>
            <p class="font-medium text-gray-900 flex items-center gap-2">
              <i class="ti ti-calendar text-gray-400"></i>
              {{ selectedAppointment.date }}
            </p>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">ساعت</p>
            <p class="font-medium text-gray-900 flex items-center gap-2">
              <i class="ti ti-clock text-gray-400"></i>
              {{ selectedAppointment.time }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- فوتر -->
      <div class="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
        <button 
          @click="showAppointmentModal = false"
          class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100"
        >
          بستن
        </button>
        <router-link 
          to="/users/visits"
          @click="showAppointmentModal = false"
          class="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 text-center"
        >
          همه نوبت‌ها
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment-jalaali'

// تنظیم moment-jalaali برای فارسی
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' })

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)
const showNotifications = ref(false)
const showAppointmentModal = ref(false)
const selectedAppointment = ref(null)

// صفحاتی که در موبایل هدر و bottom nav خودشون رو دارن
const pagesWithOwnHeader = computed(() => {
  const path = route.path
  return path.includes('/users/booking') || 
         path.includes('/users/chat/')
})

// صفحاتی که در موبایل باید بدون padding باشن (تمام صفحه)
const fullScreenMobile = computed(() => {
  const path = route.path
  return path.includes('/users/booking') || 
         path.includes('/users/chat/')
})

// نمایش جزئیات رزرو
const showAppointmentDetails = (appointment) => {
  selectedAppointment.value = appointment
  showAppointmentModal.value = true
}

// تعداد چت‌های فعال
const activeChats = ref(2)
const unreadNotifications = ref(3)
const unreadMessages = ref(4) // پیام‌های خوانده نشده چت

// نوبت آینده - تاریخ واقعی با moment
const upcomingAppointment = ref({
  id: 1,
  doctorName: 'دکتر احمدی',
  date: moment().add(1, 'days').format('jD jMMMM'),
  time: '۱۰:۳۰',
  type: 'phone'
})

// استایل انواع نوبت
const getAppointmentTypeStyle = (type) => {
  const styles = {
    'phone': {
      icon: 'ti ti-phone',
      bg: 'bg-blue-100',
      color: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
      label: 'تلفنی'
    },
    'video': {
      icon: 'ti ti-video',
      bg: 'bg-purple-100',
      color: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      label: 'ویدیویی'
    },
    'text': {
      icon: 'ti ti-message',
      bg: 'bg-green-100',
      color: 'text-green-600',
      badge: 'bg-green-100 text-green-700',
      label: 'متنی'
    },
    'in-person': {
      icon: 'ti ti-building-hospital',
      bg: 'bg-orange-100',
      color: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700',
      label: 'حضوری'
    },
    'home': {
      icon: 'ti ti-home',
      bg: 'bg-teal-100',
      color: 'text-teal-600',
      badge: 'bg-teal-100 text-teal-700',
      label: 'در منزل'
    }
  }
  return styles[type] || styles['phone']
}

// نوتیفیکیشن‌ها
const notifications = ref([
  {
    id: 1,
    title: 'نوبت شما فردا ساعت ۱۰:۳۰ است',
    time: '۱ ساعت پیش',
    icon: 'ti ti-calendar-event',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    read: false
  },
  {
    id: 2,
    title: 'دکتر احمدی به پیام شما پاسخ داد',
    time: '۲ ساعت پیش',
    icon: 'ti ti-message',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    read: false
  },
  {
    id: 3,
    title: 'سفارش شما ارسال شد',
    time: '۵ ساعت پیش',
    icon: 'ti ti-truck-delivery',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    read: false
  },
  {
    id: 4,
    title: 'نسخه جدید صادر شد',
    time: 'دیروز',
    icon: 'ti ti-prescription',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    read: true
  }
])

// Close dropdown on outside click
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // درخواست مجوز نوتیفیکیشن
  if ('Notification' in window && Notification.permission === 'default') {
    const dismissed = localStorage.getItem('notificationBannerDismissed')
    if (!dismissed) {
      setTimeout(() => {
        Notification.requestPermission()
      }, 3000)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const logout = () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    localStorage.removeItem('petoman_token')
    router.push('/login')
  }
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
