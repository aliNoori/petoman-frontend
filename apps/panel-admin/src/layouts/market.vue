<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Order Notification Banner -->
    <OrderNotificationBanner
      :show="showOrderBanner"
      :order="newOrder"
      :duration="120"
      @accept="handleAcceptOrder"
      @reject="handleRejectOrder"
      @timeout="handleOrderTimeout"
      @close="showOrderBanner = false"
    />

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
            to="/markets/faq"
            class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="سوالات متداول"
          >
            <i class="ti ti-help text-xl text-gray-700"></i>
          </router-link>

          <!-- Support -->
          <router-link
            to="/markets/support"
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
            <span v-if="unreadNotifications > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
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
              :class="!notif.read ? 'bg-orange-50/30' : ''"
            >
              <div class="flex gap-3">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  notif.type === 'order' ? 'bg-blue-100' :
                  notif.type === 'payment' ? 'bg-green-100' :
                  'bg-amber-100'
                ]">
                  <i :class="[
                    'text-xl',
                    notif.type === 'order' ? 'ti ti-shopping-cart text-blue-600' :
                    notif.type === 'payment' ? 'ti ti-credit-card text-green-600' :
                    'ti ti-alert-circle text-amber-600'
                  ]"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <p class="text-sm font-semibold text-gray-900">{{ notif.title }}</p>
                    <div v-if="!notif.read" class="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5"></div>
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
            class="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
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
            <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-orange-100">
              <img :src="tenantInfoSetting?.logo" class="w-full h-full rounded-full object-cover"/>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">پنل فروشگاه</h2>
              <p class="text-xs text-gray-500">{{ tenant?.name||tenant?.ownerName }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.path">
              <!-- Items with children (submenu) -->
              <div v-if="item.children">
                <button
                  @click="toggleSubmenu(item.path)"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                  :class="isActiveRoute(item.path) ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
                >
                  <i :class="item.icon" class="text-xl"></i>
                  <span>{{ item.label }}</span>
                  <i class="ti ti-chevron-left mr-auto transition-transform" :class="expandedMenus.includes(item.path) ? 'rotate-90' : ''"></i>
                  <span v-if="item.badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {{ item.badge }}
                  </span>
                </button>
                <!-- Submenu -->
                <Transition name="submenu">
                  <ul v-if="expandedMenus.includes(item.path)" class="mt-2 space-y-1">
                    <li v-for="child in item.children" :key="child.path">
                      <router-link
                        :to="child.path"
                        class="flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50"
                        :class="route.path === child.path ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
                      >
                        <span>{{ child.label }}</span>
                        <span v-if="child.badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {{ child.badge }}
                        </span>
                      </router-link>
                    </li>
                  </ul>
                </Transition>
              </div>
              <!-- Items without children -->
              <router-link
                v-else
                :to="item.path"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                :class="isActiveRoute(item.path) ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
              >
                <i :class="item.icon" class="text-xl"></i>
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {{ item.badge }}
                </span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- User Section -->
        <div class="p-4 border-t border-gray-200">
          <div
              @click="showProfileMenu = !showProfileMenu"
              class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              role="button"
          >
            <!-- نمایش آواتار -->
            <img
                v-if="user?.avatar && user.avatar.trim() !== ''"
                :src="user.avatar"
                class="w-10 h-10 rounded-full object-cover"
                alt="Avatar"
            />
            <div v-else class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <i class="ti ti-user text-orange-600"></i>
            </div>

            <div class="flex-1 text-right">
              <p class="text-sm font-medium text-gray-900">{{ user?.fullName || 'کاربر' }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
              <i class="ti ti-chevron-up text-gray-400" :class="showProfileMenu ? 'rotate-180' : ''"></i>
            </div>
          </div>
          <!-- Profile Dropdown -->
          <Transition name="slide-up">
            <div v-if="showProfileMenu" class="mt-2 p-2 bg-gray-50 rounded-lg space-y-1">
              <router-link to="/markets/settings" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                <i class="ti ti-settings text-base"></i>
                تنظیمات
              </router-link>
              <button @click="logout" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-white rounded-lg transition-colors">
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
      <div v-if="mobileSidebarOpen" @click="toggleMobileSidebar" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide-right">
      <aside v-if="mobileSidebarOpen" class="fixed top-0 right-0 w-64 h-screen bg-white z-[60] lg:hidden overflow-y-auto">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-orange-100">
                <img :src="tenantInfoSetting?.logo" class="w-full h-full rounded-full object-cover"/>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">پنل فروشگاه</h2>
                <p class="text-xs text-gray-500">{{ tenant?.name||tenant?.ownerName }}</p>
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
                <!-- Items with children (submenu) -->
                <div v-if="item.children">
                  <button
                    @click="toggleSubmenu(item.path)"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                    :class="isActiveRoute(item.path) ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                  >
                    <i :class="item.icon" class="text-xl"></i>
                    <span>{{ item.label }}</span>
                    <i class="ti ti-chevron-left mr-auto transition-transform" :class="expandedMenus.includes(item.path) ? 'rotate-90' : ''"></i>
                    <span v-if="item.badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {{ item.badge }}
                    </span>
                  </button>
                  <!-- Submenu -->
                  <Transition name="submenu">
                    <ul v-if="expandedMenus.includes(item.path)" class="mt-2 space-y-1">
                      <li v-for="child in item.children" :key="child.path">
                        <router-link
                          :to="child.path"
                          @click="toggleMobileSidebar"
                          class="flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200"
                          :class="route.path === child.path ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
                        >
                          <span>{{ child.label }}</span>
                          <span v-if="child.badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {{ child.badge }}
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </Transition>
                </div>
                <!-- Items without children -->
                <router-link
                  v-else
                  :to="item.path"
                  @click="toggleMobileSidebar"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  :class="isActiveRoute(item.path) ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <i :class="item.icon" class="text-xl"></i>
                  <span>{{ item.label }}</span>
                  <span v-if="item.badge" class="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {{ item.badge }}
                  </span>
                </router-link>
              </li>
            </ul>
          </nav>


          <!-- User Section -->
          <div class="p-4 border-t border-gray-200">
            <button @click="showProfileMenu = !showProfileMenu" class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">

              <!-- نمایش آواتار اگر وجود داشته باشد -->
              <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  class="w-10 h-10 rounded-full object-cover"
                  alt="User Avatar"
              />

              <!-- نمایش آیکون اگر آواتار وجود نداشته باشد -->
              <div v-else class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <i class="ti ti-user text-orange-600"></i>
              </div>

              <div class="flex-1 text-right">
                <!-- اصلاح شده: استفاده از متغیر -->
                <p class="text-sm font-medium text-gray-900">{{ user?.fullName || 'کاربر' }}</p>
                <p class="text-xs text-gray-500">{{ user?.email }}</p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="lg:mr-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
      <!-- Desktop Header -->
      <header class="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ getPageTitle() }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ getPageDescription() }}</p>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- FAQ -->
            <router-link
              to="/markets/faq"
              class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="سوالات متداول"
            >
              <i class="ti ti-help text-xl text-gray-600"></i>
            </router-link>

            <!-- Support -->
            <router-link
              to="/markets/support"
              class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="پشتیبانی"
            >
              <i class="ti ti-headset text-xl text-gray-600"></i>
            </router-link>

            <!-- Notifications -->
            <div class="relative">
              <button 
                @click="showNotifications = !showNotifications"
                class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i class="ti ti-bell text-xl text-gray-600"></i>
                <span v-if="unreadNotifications > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- Desktop Notifications Dropdown -->
              <Transition name="slide-down">
                <div v-if="showNotifications" class="absolute left-0 mt-2 w-80 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                      <h3 class="text-base font-bold text-gray-900">اعلان‌ها</h3>
                      <button @click="markAllAsRead" class="text-xs text-orange-600 font-medium">علامت خوانده شده</button>
                    </div>
                  </div>
                  
                  <div class="max-h-96 overflow-y-auto">
                    <div v-for="notif in notifications" :key="notif.id" class="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div class="flex gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                          notif.type === 'order' ? 'bg-blue-100' :
                          notif.type === 'payment' ? 'bg-green-100' :
                          'bg-amber-100'
                        ]">
                          <i :class="[
                            'text-lg',
                            notif.type === 'order' ? 'ti ti-shopping-cart text-blue-600' :
                            notif.type === 'payment' ? 'ti ti-credit-card text-green-600' :
                            'ti ti-alert-circle text-amber-600'
                          ]"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 mb-1">{{ notif.title }}</p>
                          <p class="text-xs text-gray-600 mb-2">{{ notif.message }}</p>
                          <p class="text-xs text-gray-400">{{ notif.time }}</p>
                        </div>
                        <div v-if="!notif.read" class="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                      </div>
                    </div>
                  </div>

                  <div class="p-3 bg-gray-50 text-center">
                    <router-link 
                      to="/markets/notifications" 
                      @click="showNotifications = false"
                      class="text-sm text-orange-600 font-medium"
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
        <router-view />
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
          :class="isActiveRoute(item.path) ? 'text-orange-600' : 'text-gray-600'"
        >
          <i :class="item.icon" class="text-2xl"></i>
          <span class="text-xs font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {storeToRefs} from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import OrderNotificationBanner from '@/components/OrderNotificationBanner.vue'
import {useMarketProductStore} from "@/stores/market/product.ts";
import {useCategoryStore} from "@/stores/market/category.ts";
import {useReferenceStore} from "@/stores/market/reference.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {useOrderStore} from "@/stores/market/order.ts";
import {useNotificationStore} from "@/stores/notification.js";
import {useWalletStore} from "@/stores/wallet.ts";
import {useReviewStore} from "@/stores/market/reviews.js";

const productStore=useMarketProductStore()
const categoryStore=useCategoryStore()
const referenceStore=useReferenceStore()
const walletStore=useWalletStore()
const authStore=useAuthStore()
const {tenant}=storeToRefs(authStore)
const orderStore=useOrderStore()
const reviewsStore=useReviewStore()
const route = useRoute()
const router = useRouter()
const notificationStore=useNotificationStore()
// State
const mobileSidebarOpen = ref(false)
const showProfileMenu = ref(false)
const showNotifications = ref(false)
const expandedMenus = ref([])
const tenantInfoSetting = computed(()=>(tenant.value?.settings || []).find(item => item.key === 'shopInfo')?.value || {})
// Order Notification Banner State
const showOrderBanner = ref(false)
const newOrder = ref({
  id: 1,
  code: 'ORD-1234',
  customerName: 'علی محمدی',
  items: 'غذای خشک سگ رویال کنین 2 کیلویی، شامپو ضد کک',
  address: 'تهران، ونک',
  total: 850000
})

// Order Banner Handlers
const handleAcceptOrder = (order) => {
  console.log('سفارش قبول شد:', order)
  router.push('/markets/orders')
}

const handleRejectOrder = (order) => {
  console.log('سفارش رد شد:', order)
}

const handleOrderTimeout = () => {
  console.log('زمان پاسخدهی به اتمام رسید')
}

// Notifications
/*const notifications = ref([
  {
    id: 1,
    type: 'order',
    title: 'سفارش جدید',
    message: 'سارا احمدی یک سفارش ثبت کرد',
    time: '10 دقیقه پیش',
    read: false
  },
  {
    id: 2,
    type: 'payment',
    title: 'پرداخت موفق',
    message: 'مبلغ 500,000 تومان از محمد رضایی دریافت شد',
    time: '1 ساعت پیش',
    read: false
  },
  {
    id: 3,
    type: 'alert',
    title: 'یادآوری',
    message: 'موجودی غذای سگ رو به اتمام است',
    time: '2 ساعت پیش',
    read: true
  }
])*/

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})
// Menu Items
const menuItems = computed(() => [
  { path: '/markets', label: 'داشبورد', icon: 'ti ti-dashboard', exact: true },
  { path: '/markets/orders', label: 'سفارشات', icon: 'ti ti-shopping-cart', badge: orderStore.stats.paidOrders },
  { 
    path: '/markets/products', 
    label: 'محصولات', 
    icon: 'ti ti-package',
    children: [
      { path: '/markets/products', label: 'لیست محصولات' },
      { path: '/markets/products/add', label: 'افزودن محصول' },
    ]
  },
  { path: '/markets/reviews', label: 'دیدگاه‌ها', icon: 'ti ti-star', badge: reviewsStore.reviews.length },
  { path: '/markets/financial', label: 'امور مالی', icon: 'ti ti-coins' },
  { path: '/markets/settings', label: 'تنظیمات', icon: 'ti ti-settings' }
])

const bottomNavItems = ref([
  { path: '/markets', label: 'خانه', icon: 'ti ti-home', exact: true },
  { path: '/markets/orders', label: 'سفارشات', icon: 'ti ti-shopping-cart' },
  { path: '/markets/products', label: 'محصولات', icon: 'ti ti-package' },
  { path: '/markets/settings', label: 'تنظیمات', icon: 'ti ti-settings' }
])

// Methods
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const toggleSubmenu = (path) => {
  const index = expandedMenus.value.indexOf(path)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(path)
  }
}

const isActiveRoute = (path) => {
  if (path === '/markets') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const getPageTitle = () => {
  const path = route.path
  if (path === '/markets') return 'داشبورد'
  if (path.includes('/orders')) return 'سفارشات'
  if (path.includes('/products')) return 'محصولات'
  if (path.includes('/reviews')) return 'نظرات و دیدگاه‌ها'
  if (path.includes('/financial')) return 'امور مالی'
  if (path.includes('/settings')) return 'تنظیمات'
  if (path.includes('/notifications')) return 'اعلان‌ها'
  if (path.includes('/support')) return 'پشتیبانی'
  if (path.includes('/faq')) return 'سوالات متداول'
  return 'پنل فروشگاه'
}

const getPageDescription = () => {
  const path = route.path
  if (path === '/markets') return 'مدیریت و نظارت بر عملکرد فروشگاه'
  if (path.includes('/orders')) return 'مدیریت سفارشات محصولات'
  if (path.includes('/products')) return 'مدیریت محصولات فروشگاه'
  if (path.includes('/reviews')) return 'مدیریت نظرات و بازخوردهای مشتریان'
  if (path.includes('/financial')) return 'مدیریت تراکنش‌ها و درخواست تسویه'
  if (path.includes('/settings')) return 'تنظیمات فروشگاه'
  if (path.includes('/support')) return 'ارتباط با پشتیبانی'
  if (path.includes('/faq')) return 'پاسخ به سوالات متداول'
  return 'خوش آمدید'
}

const markAllAsRead = () => {
  notifications.value.forEach(notif => {
    notif.read = true
  })
}

const logout = () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    authStore.logout()
  }
}


// Close mobile sidebar on route change
watch(() => route.path, () => {
  mobileSidebarOpen.value = false
})

const user = computed(() => {
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
})
const notifications=computed(()=>notificationStore.notifications)
// Auto expand products menu if on products page
onMounted(async () => {
  try {
    const tenantId = localStorage.getItem('tenant_id')

    // 1. user-dependent requests
    if (user.value?.id) {
      await notificationStore.fetchNotifications(user.value.id, 'MARKET-ADMIN')
    } else {
      console.warn('User not found or ID missing')
    }

    // 2. parallel independent requests (important for performance)
    await Promise.all([
      orderStore.fetchMarketOrders(1, 10),
      authStore.fetchWalletTenant(),
      authStore.fetchTenant(tenantId),
      reviewsStore.fetchReviews(),
      walletStore.fetchBalance('SHOP'),
      walletStore.fetchTransactions('SHOP'),
      productStore.fetchProducts(),
      productStore.fetchGlobalProducts(),
      categoryStore.fetchCategories(),
      referenceStore.fetchAll(),
    ])

    // 3. UI state logic
    if (route.path.includes('/products')) {
      if (!expandedMenus.value.includes('/markets/products')) {
        expandedMenus.value.push('/markets/products')
      }
    }

  } catch (error) {
    console.error('Init error:', error)
  }
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

/* Submenu Animation */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Safe area for mobile devices */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
