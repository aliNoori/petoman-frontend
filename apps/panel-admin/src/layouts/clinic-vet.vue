<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header - Fixed Top -->
    <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <button @click="toggleMobileSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-menu-2 text-xl text-gray-700"></i>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <!-- FAQ -->
          <router-link
              to="/clinic/faq"
              class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="سوالات متداول"
          >
            <i class="ti ti-help text-xl text-gray-700"></i>
          </router-link>

          <!-- Support -->
          <router-link
              to="/clinic/support"
              class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="پشتیبانی"
          >
            <i class="ti ti-headset text-xl text-gray-700"></i>
          </router-link>

          <!-- Notifications -->
          <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="ti ti-bell text-xl text-gray-700"></i>
            <span v-if="unreadNotifications > 0"
                  class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Notifications Full Screen -->
    <Transition name="slide-up-full">
      <div v-if="showNotifications" class="fixed inset-0 bg-white z-[60] lg:hidden">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">اعلان‌ها</h2>
            <button
                @click="showNotifications = false"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i class="ti ti-x text-xl text-gray-700"></i>
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="overflow-y-auto" style="height: calc(100vh - 65px);">
          <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
            <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="ti ti-bell-off text-4xl text-gray-400"></i>
            </div>
            <p class="text-gray-600 font-medium mb-1">اعلانی وجود ندارد</p>
            <p class="text-sm text-gray-500">همه اعلان‌های شما را مشاهده کرده‌اید</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
                v-for="notif in notifications"
                :key="notif.id"
                class="p-4 hover:bg-gray-50 transition-colors"
                :class="!notif.read ? 'bg-teal-50/30' : ''"
            >
              <div class="flex gap-3">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  notif.type === 'appointment' ? 'bg-blue-100' :
                  notif.type === 'payment' ? 'bg-green-100' :
                  notif.type === 'chat' ? 'bg-teal-100' :
                  'bg-amber-100'
                ]">
                  <i :class="[
                    'text-xl',
                    notif.type === 'appointment' ? 'ti ti-calendar text-blue-600' :
                    notif.type === 'payment' ? 'ti ti-credit-card text-green-600' :
                    notif.type === 'chat' ? 'ti ti-message text-teal-600' :
                    'ti ti-alert-circle text-amber-600'
                  ]"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <p class="text-sm font-semibold text-gray-900">{{ notif.title }}</p>
                    <div v-if="!notif.read" class="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ notif.message }}</p>
                  <p class="text-xs text-gray-400">{{ notif.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
              @click="markAllAsRead"
              class="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            علامت‌گذاری همه به عنوان خوانده شده
          </button>
        </div>
      </div>
    </Transition>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block fixed top-0 right-0 w-64 h-screen bg-white border-l border-gray-200 z-50">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img :src="resolveUrl(tenantInfoSetting?.logo)||resolveUrl(tenant?.documents?.logo?.thumbnail)"
                   class="w-full h-full rounded-full object-cover"/>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                {{ tenant?.type === 'VET' ? 'پنل دامپزشک' : 'پنل کلینیک' }}</h2>
              <p class="text-xs text-gray-500">{{ tenant?.ownerName || tenant?.name }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.path">
              <router-link
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                  :class="isActiveRoute(item.path) ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
              >
                <i :class="item.icon" class="text-xl"></i>
                <span>{{ item.label }}</span>
                <span v-if="item.badge"
                      class="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full items-center justify-center">
                  {{ item.badge }}
                </span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- User Section -->
        <div class="p-4 border-t border-gray-200">
          <button @click="showProfileMenu = !showProfileMenu"
                  class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <img :src="resolveUrl(tenantInfoSetting?.logo)||resolveUrl(tenant?.documents?.logo?.thumbnail)"
                   class="w-full h-full rounded-full object-cover"/>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm font-medium text-gray-900">{{ tenant?.ownerName || tenant?.name }}</p>
              <p class="text-xs text-gray-500">دامپزشک</p>
            </div>
            <i class="ti ti-chevron-up text-gray-400" :class="showProfileMenu ? 'rotate-180' : ''"></i>
          </button>

          <!-- Profile Dropdown -->
          <Transition name="slide-up">
            <div v-if="showProfileMenu" class="mt-2 p-2 bg-gray-50 rounded-lg space-y-1">
              <router-link to="/clinic/settings"
                           class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                <i class="ti ti-settings text-base"></i>
                تنظیمات
              </router-link>
              <button @click="logout"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-white rounded-lg transition-colors">
                <i class="ti ti-logout text-base"></i>
                خروج
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <Transition name="fade">
      <div v-if="mobileSidebarOpen" @click="toggleMobileSidebar"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide-right">
      <aside v-if="mobileSidebarOpen"
             class="fixed top-0 right-0 w-64 h-screen bg-white z-[60] lg:hidden overflow-y-auto">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <img :src="resolveUrl(tenantInfoSetting?.logo)||resolveUrl(tenant?.documents?.logo?.thumbnail)"
                     class="w-full h-full rounded-full object-cover"/>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">پنل کلینیک</h2>
                <p class="text-xs text-gray-500">{{ tenant?.ownerName || tenant?.name }}</p>
              </div>
            </div>
            <button @click="toggleMobileSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-700"></i>
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 p-4">
            <ul class="space-y-2">
              <li v-for="item in menuItems" :key="item.path">
                <router-link
                    :to="item.path"
                    @click="toggleMobileSidebar"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                    :class="isActiveRoute(item.path) ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <i :class="item.icon" class="text-xl"></i>
                  <span>{{ item.label }}</span>
                  <span v-if="item.badge"
                        class="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full items-center justify-center">
                    {{ item.badge }}
                  </span>
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- User Section -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <img :src="resolveUrl(tenantInfoSetting?.logo)||resolveUrl(tenant?.documents?.logo?.thumbnail)"
                     class="w-full h-full rounded-full object-cover"/>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ tenant?.ownerName || tenant?.name }}</p>
                <p class="text-xs text-gray-500">دامپزشک</p>
              </div>
            </div>
            <div class="space-y-1">
              <router-link to="/clinic/settings" @click="toggleMobileSidebar"
                           class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <i class="ti ti-settings text-base"></i>
                تنظیمات
              </router-link>
              <button @click="logout"
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <i class="ti ti-logout text-base"></i>
                خروج
              </button>
            </div>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="lg:mr-64 min-h-screen pt-16 lg:pt-0 pb-20 lg:pb-0">
      <!-- Desktop Header -->
      <header class="hidden lg:block sticky top-0 bg-white border-b border-gray-200 z-30">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <button
                v-if="route.path !== '/clinic'"
                @click="goBack"
                class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-teal-50 flex items-center justify-center transition-colors group"
            >
              <i class="ti ti-arrow-right text-xl text-gray-600 group-hover:text-teal-600"></i>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ getPageTitle() }}</h1>
              <p class="text-sm text-gray-500 mt-0.5">{{ getPageDescription() }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- FAQ Button -->
            <router-link
                to="/clinic/faq"
                class="relative p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                title="سوالات متداول"
            >
              <i class="ti ti-help text-xl text-gray-700 group-hover:text-teal-600"></i>
            </router-link>

            <!-- Support/Ticket Button -->
            <router-link
                to="/clinic/support"
                class="relative p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                title="پشتیبانی و تیکت"
            >
              <i class="ti ti-headset text-xl text-gray-700 group-hover:text-teal-600"></i>
            </router-link>

            <!-- Notifications -->
            <div class="relative">
              <button
                  @click="showNotifications = !showNotifications"
                  class="relative p-2.5 rounded-lg hover:bg-gray-50"
              >
                <i class="ti ti-bell text-xl text-gray-700"></i>
                <span v-if="unreadNotifications > 0"
                      class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              <!-- Notifications Dropdown -->
              <Transition name="slide-down">
                <div v-if="showNotifications"
                     class="absolute left-0 mt-2 w-80 bg-white rounded-xl overflow-hidden border border-gray-200">
                  <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                      <h3 class="text-base font-bold text-gray-900">اعلان‌ها</h3>
                      <button class="text-xs text-teal-600 font-medium">علامت خوانده شده</button>
                    </div>
                  </div>

                  <div class="max-h-96 overflow-y-auto">
                    <div v-for="notif in notifications" :key="notif.id" class="p-4 border-b border-gray-100">
                      <div class="flex gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                          notif.type === 'appointment' ? 'bg-blue-100' :
                          notif.type === 'payment' ? 'bg-green-100' :
                          notif.type === 'chat' ? 'bg-teal-100' :
                          'bg-amber-100'
                        ]">
                          <i :class="[
                            'text-lg',
                            notif.type === 'appointment' ? 'ti ti-calendar text-blue-600' :
                            notif.type === 'payment' ? 'ti ti-credit-card text-green-600' :
                            notif.type === 'chat' ? 'ti ti-message text-teal-600' :
                            'ti ti-alert-circle text-amber-600'
                          ]"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 mb-1">{{ notif.title }}</p>
                          <p class="text-xs text-gray-600 mb-2">{{ notif.message }}</p>
                          <p class="text-xs text-gray-400">{{ notif.time }}</p>
                        </div>
                        <div v-if="!notif.read" class="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-2"></div>
                      </div>
                    </div>
                  </div>

                  <div class="p-3 bg-gray-50 text-center">
                    <router-link
                        to="/clinic/notifications"
                        @click="showNotifications = false"
                        class="text-sm text-teal-600 font-medium"
                    >
                      مشاهده همه
                    </router-link>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="p-4 lg:p-6">
        <router-view/>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[50] lg:hidden safe-area-bottom">
      <div class="flex items-center justify-around px-2 py-2">
        <router-link
            v-for="item in bottomNavItems"
            :key="item.path"
            :to="item.path"
            class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]"
            :class="isActiveRoute(item.path) ? 'text-teal-600' : 'text-gray-600'"
        >
          <i :class="item.icon" class="text-2xl"></i>
          <span class="text-xs font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {useTenantReviewsStore} from "@/stores/tenant-reviews.js";
import {useAuthStore} from "@/stores/auth.ts";
import {useVetClinicServicesStore} from "@/stores/vet-clinic/service.ts";
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js";
import {useConsultationStore} from "@/stores/vet-clinic/consultation.js";
import {useMessageStore} from "@/stores/message.js";
import {useRoute, useRouter} from 'vue-router'
import {usePushNotifications} from '@/composables/usePushNotifications'
import {io} from 'socket.io-client'
import {storeToRefs} from "pinia";
import {useSocketStore} from "@/stores/socket.js";
import {useNotificationStore} from "@/stores/notification.js";
import {useWalletStore} from "@/stores/wallet.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";
import {useVetClinicSettingsStore} from "@/stores/vet-clinic/settings.js";

const {resolveUrl} = useUrlHelper()
const walletStore = useWalletStore()
const consultationStore = useConsultationStore()
const authStore = useAuthStore()
const vetClinicServiceStore = useVetClinicServicesStore()
const appointmentStore = useAppointmentStore()
const {appointmentStats} = storeToRefs(appointmentStore)
const tenantReviews = useTenantReviewsStore()
const route = useRoute()
const router = useRouter()
const {tenant} = storeToRefs(authStore)
const tenantInfoSetting = computed(() => (tenant.value?.tenantSettings || []).find(item => item.key === 'clinic_info')?.value || {})

// Push Notifications
const {
  requestPermission,
  sendNotification,
  isSupported: pushSupported
} = usePushNotifications()

// Socket connection
let socket = null
const notificationStore = useNotificationStore()
// State
const mobileSidebarOpen = ref(false)
const showProfileMenu = ref(false)
const showNotifications = ref(false)
const currentClinicName = ref('کلینیک دامپزشکی پتومن')
const notifications = computed(() => notificationStore.notifications)
// Notifications
/*const notifications = ref([
  {
    id: 1,
    type: 'appointment',
    title: 'نوبت جدید',
    message: 'سارا احمدی برای گربه خود نوبت ویزیت گرفت',
    time: '10 دقیقه پیش',
    read: false
  },
  {
    id: 2,
    type: 'payment',
    title: 'پرداخت موفق',
    message: 'مبلغ 350,000 تومان از محمد رضایی دریافت شد',
    time: '1 ساعت پیش',
    read: false
  },
  {
    id: 3,
    type: 'alert',
    title: 'یادآوری',
    message: 'امروز 5 نوبت ویزیت دارید',
    time: '2 ساعت پیش',
    read: true
  }
])*/

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Menu Items
const menuItems = ref([
  {path: '/clinic', label: 'داشبورد', icon: 'ti ti-dashboard'},
  {path: '/clinic/appointments', label: 'نوبت‌دهی', icon: 'ti ti-calendar-event', badge: appointmentStats.value?.today},
  {path: '/clinic/services', label: 'خدمات درمانی', icon: 'ti ti-medical-cross'},
  {path: '/clinic/financial', label: 'امور مالی', icon: 'ti ti-report-money'},
  {path: '/clinic/reviews', label: 'نظرات', icon: 'ti ti-star'},
  {path: '/clinic/settings', label: 'تنظیمات', icon: 'ti ti-settings'}
])

const bottomNavItems = ref([
  {path: '/clinic', label: 'خانه', icon: 'ti ti-home'},
  {path: '/clinic/appointments', label: 'نوبت‌ها', icon: 'ti ti-calendar-event'},
  {path: '/clinic/settings', label: 'تنظیمات', icon: 'ti ti-settings'}
])

// Methods
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const isActiveRoute = (path) => {
  if (path === '/clinic') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const getPageTitle = () => {
  const path = route.path
  if (path === '/clinic') return 'داشبورد'
  if (path.includes('/appointments')) return 'نوبت‌دهی'
  if (path.includes('/urgent-requests')) return 'درخواست های فوری'
  if (path.includes('/services')) return 'خدمات درمانی'
  if (path.includes('/finance')) return 'امور مالی'
  if (path.includes('/reviews')) return 'نظرات'
  if (path.includes('/settings')) return 'تنظیمات'
  return 'پنل کلینیک'
}

const getPageDescription = () => {
  const path = route.path
  if (path === '/clinic') return 'مدیریت و نظارت بر عملکرد کلینیک'
  if (path.includes('/appointments')) return 'مدیریت نوبت‌های ویزیت بیماران'
  if (path.includes('/urgent-requests')) return 'گفتگوی آنلاین و تماس تلفنی - آنی و بدون نوبت'
  if (path.includes('/services')) return 'مدیریت خدمات درمانی و جراحی'
  if (path.includes('/finance')) return 'مدیریت تراکنش‌ها و درآمدها'
  if (path.includes('/reviews')) return 'نظرات و بازخوردهای مراجعین'
  if (path.includes('/settings')) return 'تنظیمات کلینیک'
  return 'خوش آمدید'
}

const markAllAsRead = () => {
  notifications.value.forEach(notif => {
    notif.read = true
  })
}

// اضافه کردن نوتیفیکیشن جدید
const addNotification = (notif) => {
  notifications.value.unshift({
    id: Date.now(),
    read: false,
    time: 'الان',
    ...notif
  })

  // Push notification
  if (pushSupported.value) {
    sendNotification(notif.title, {
      body: notif.message,
      icon: '/icons/icon-192x192.png',
      tag: `notif-${Date.now()}`
    })
  }
}

// اتصال به Socket
/*const connectSocket = () => {
  try {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      query: { 
        clinicId: localStorage.getItem('auth_token'), // باید از store بیاد
        role: 'clinic'
      }
    })

    socket.on('connect', () => {
      console.log('✅ Clinic dashboard socket connected')
    })

    // درخواست مشاوره جدید
    socket.on('new_chat_request', (data) => {
      addNotification({
        type: 'chat',
        title: 'درخواست مشاوره جدید',
        message: `${data.customerName} منتظر تایید شماست`,
        chatId: data.chatId
      })
    })

    // پیام جدید
    socket.on('new_message', (data) => {
      // فقط اگر در صفحه چت نباشیم
      if (!route.path.includes('/clinics/chat/')) {
        addNotification({
          type: 'chat',
          title: `پیام از ${data.senderName}`,
          message: data.text?.substring(0, 50) || 'تصویر ارسال شد',
          chatId: data.chatId
        })
      }
    })

    // نوبت جدید
    socket.on('new_appointment', (data) => {
      addNotification({
        type: 'appointment',
        title: 'نوبت جدید',
        message: `${data.customerName} برای ${data.petName} نوبت گرفت`,
        appointmentId: data.appointmentId
      })
    })

    // پرداخت جدید
    socket.on('payment_received', (data) => {
      addNotification({
        type: 'payment',
        title: 'پرداخت موفق',
        message: `مبلغ ${data.amount?.toLocaleString('fa-IR')} تومان دریافت شد`,
        paymentId: data.paymentId
      })
    })

  } catch (error) {
    console.warn('Socket.io not available:', error)
  }
}*/


const socketStore = useSocketStore();

const logout = () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    authStore.logout()
  }
}

const goBack = () => {
  router.back()
}
/*const user = computed(() => {
  const userStr = localStorage.getItem('auth_user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (e) {
      console.error('Error parsing user from localStorage', e)
      return null
    }
  }
  return null
})*/

const fetchInitialData = async () => {
  try {
    // 1. دریافت اطلاعات کاربر و کلینیک (معمولاً باید اول لود شود چون بقیه داده‌ها به آن وابسته‌اند)
    const tenantId = localStorage.getItem('tenant_id')
    if (tenantId) {
      await authStore.fetchVetClinicTenant(tenantId)
    } else {
      console.warn('Tenant ID not found in localStorage')
    }

    // 2. دریافت اطلاعات نوتیفیکیشن (نیاز به User ID دارد)
    const userStr = localStorage.getItem('auth_user')
    let userId = null
    if (userStr) {
      try {
        userId = JSON.parse(userStr).id
      } catch (e) {
        console.error('Error parsing user from localStorage', e)
      }
    }

    if (userId) {
      await notificationStore.fetchNotifications(userId, 'VET-CLINIC-ADMIN')
    }

    // 3. دریافت داده‌های سایر بخش‌ها (می‌توان همزمان اجرا کرد)
    await Promise.all([
      walletStore.fetchTransactions(),
      walletStore.fetchPlatformFeeTransactions(),
      appointmentStore.fetchAppointments(),
      consultationStore.fetchConsultations(),
      vetClinicServiceStore.fetchServices(),
      useVetClinicSettingsStore().fetchSpecialties(),
      tenantReviews.fetchTenantReviews()
    ])

  } catch (error) {
    console.error('خطا در دریافت داده‌های اولیه:', error)
    // می‌توانید اینجا یک پیام خطا به کاربر نمایش دهید
  }
}

const connectSocket = async () => {
  try {
    // اتصال سوکت
    socketStore.connect(localStorage.getItem('auth_token'))

    // اگر از روش قدیمی io استفاده می‌کنید، کدهای مربوط به socket.on را اینجا قرار دهید
    // connectSocket() // تابع قبلی شما
  } catch (error) {
    console.warn('Socket connection failed:', error)
  }
}

// Close notifications when clicking outside
onMounted(async () => {
  // درخواست مجوز نوتیفیکیشن
  if (pushSupported.value) {
    await requestPermission()
  }

  // اجرای توابع جدا شده
  await fetchInitialData()
  await connectSocket()

  // بستن نوتیفیکیشن با کلیک بیرون
  document.addEventListener('click', (e) => {
    if (showNotifications.value && !e.target.closest('.relative')) {
      showNotifications.value = false
    }
  })
})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
})

// Close mobile sidebar on route change
watch(() => route.path, () => {
  mobileSidebarOpen.value = false
})
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-full-enter-active,
.slide-up-full-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-full-enter-from,
.slide-up-full-leave-to {
  transform: translateY(100%);
}

/* Safe area for mobile devices */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>


