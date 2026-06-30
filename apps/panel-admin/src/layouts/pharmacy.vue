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
            to="/pharmacies/faq"
            class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="سوالات متداول"
          >
            <i class="ti ti-help text-xl text-gray-700"></i>
          </router-link>

          <!-- Support -->
          <router-link
            to="/pharmacies/support"
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
              :class="!notif.read ? 'bg-teal-50/30' : ''"
            >
              <div class="flex gap-3">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  notif.type === 'appointment' ? 'bg-blue-100' :
                  notif.type === 'payment' ? 'bg-green-100' :
                  'bg-amber-100'
                ]">
                  <i :class="[
                    'text-xl',
                    notif.type === 'appointment' ? 'ti ti-calendar text-blue-600' :
                    notif.type === 'payment' ? 'ti ti-credit-card text-green-600' :
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
              <img :src="resolveUrl(tenantInfoSetting?.logo)" class="w-full h-full rounded-full object-cover"/>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">پنل داروخانه</h2>
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
                  :class="isActiveRoute(item.path) ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
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
                        v-if="!child.disabled"
                        :to="child.path"
                        class="flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50"
                        :class="route.path === child.path ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
                      >
                        <span>{{ child.label }}</span>
                        <span v-if="child.badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {{ child.badge }}
                        </span>
                      </router-link>
                      <div
                        v-else
                        class="flex items-center justify-between px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                      >
                        <span>{{ child.label }}</span>
                        <span v-if="child.badge" class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {{ child.badge }}
                        </span>
                      </div>
                    </li>
                  </ul>
                </Transition>
              </div>
              <!-- Items without children -->
              <router-link
                v-else
                :to="item.path"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                :class="isActiveRoute(item.path) ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700 hover:text-gray-900'"
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
            <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <img :src="resolveUrl(tenantInfoSetting?.logo)" class="w-full h-full rounded-full object-cover"/>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm font-medium text-gray-900">{{ tenant?.name || tenant?.ownerName }}</p>
              <p class="text-xs text-gray-500">{{ tenant?.email }}</p>
            </div>
            <i class="ti ti-chevron-up text-gray-400" :class="showProfileMenu ? 'rotate-180' : ''"></i>
          </button>
          
          <!-- Profile Dropdown -->
          <Transition name="slide-up">
            <div v-if="showProfileMenu" class="mt-2 p-2 bg-gray-50 rounded-lg space-y-1">
              <router-link to="/pharmacies/settings" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
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
              <div class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <img :src="resolveUrl(tenantInfoSetting?.logo)" class="w-full h-full rounded-full object-cover"/>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">پنل داروخانه</h2>
                <p class="text-xs text-gray-500">{{ tenant?.name || tenant?.ownerName }}</p>
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
                    :class="isActiveRoute(item.path) ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
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
                          v-if="!child.disabled"
                          :to="child.path"
                          @click="toggleMobileSidebar"
                          class="flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200"
                          :class="route.path === child.path ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
                        >
                          <span>{{ child.label }}</span>
                          <span v-if="child.badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {{ child.badge }}
                          </span>
                        </router-link>
                        <div
                          v-else
                          class="flex items-center justify-between px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                        >
                          <span>{{ child.label }}</span>
                          <span v-if="child.badge" class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {{ child.badge }}
                          </span>
                        </div>
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
                  :class="isActiveRoute(item.path) ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700 hover:bg-gray-50'"
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
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <img :src="resolveUrl(tenantInfoSetting?.logo)" class="w-full h-full rounded-full object-cover"/>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">مدیر داروخانه</p>
                <p class="text-xs text-gray-500">{{ tenantInfoSetting?.email }}</p>
              </div>
            </div>
            <div class="space-y-1">
              <router-link to="/pharmacies/settings" @click="toggleMobileSidebar" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <i class="ti ti-settings text-base"></i>
                تنظیمات
              </router-link>
              <button @click="logout" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              v-if="route.path !== '/pharmacies'"
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
              to="/pharmacies/faq"
              class="relative p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
              title="سوالات متداول فروشندگان"
            >
              <i class="ti ti-help text-xl text-gray-700 group-hover:text-purple-600"></i>
            </router-link>

            <!-- Support/Ticket Button -->
            <router-link
              to="/pharmacies/support"
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
                <span v-if="unreadNotifications > 0" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              <!-- Notifications Dropdown -->
              <Transition name="slide-down">
                <div v-if="showNotifications" class="absolute left-0 mt-2 w-80 bg-white rounded-xl overflow-hidden border border-gray-200">
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
                          'bg-amber-100'
                        ]">
                          <i :class="[
                            'text-lg',
                            notif.type === 'appointment' ? 'ti ti-calendar text-blue-600' :
                            notif.type === 'payment' ? 'ti ti-credit-card text-green-600' :
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
                      to="/pharmacies/notifications" 
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrderNotificationBanner from '@/components/OrderNotificationBanner.vue'
import {usePharmacyProductStore} from "@/stores/pharmacy/product.js";
import {useCategoryStore} from "@/stores/pharmacy/category.js";
import {useReferenceStore} from "@/stores/pharmacy/reference.js";
import {useMedicineStore} from "@/stores/pharmacy/medicine.store.js";
import {usePharmacyReviewStore} from "@/stores/pharmacy/reviews.js";
import {usePharmacyOrderStore} from "@/stores/pharmacy/order.js";
import {useAuthStore} from "@/stores/auth.js";
import {storeToRefs} from "pinia";
import { OrderStatus } from "@/stores/pharmacy/order.js";
import {useNotificationStore} from "@/stores/notification.js";
import {useWalletStore} from "@/stores/wallet.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";
import {useSocketStore} from "@/stores/socket.js";
// @ts-nocheck
const route = useRoute()
const router = useRouter()
///
const orderStore=usePharmacyOrderStore()
const walletStore=useWalletStore()
const referenceStore=useReferenceStore()
const productStore=usePharmacyProductStore()
const medicineStore=useMedicineStore()
const categoryStore=useCategoryStore()
const reviewsStore=usePharmacyReviewStore()
const authStore=useAuthStore()
const {tenant}=storeToRefs(authStore)
const { pendingOrders } = storeToRefs(orderStore)
const tenantInfoSetting = computed(()=>(tenant.value?.settings || []).find(item => item.key === 'pharmacyInfo')?.value || {})
const {resolveUrl} = useUrlHelper()

// State
const mobileSidebarOpen = ref(false)
const showProfileMenu = ref(false)
const showNotifications = ref(false)
//const currentPharmacyName = ref('داروخانه مرکزی پتومن')
const expandedMenus = ref([]) // Auto-expand menus

// تغییر newOrder به computed برای دریافت اولین سفارش در انتظار
const newOrder = computed(() => {
  // اگر سفارشی در انتظار وجود داشت، اولین مورد را برگردان
  if (pendingOrders.value && pendingOrders.value.length > 0) {
    const order = pendingOrders.value[0];
    // ساخت آیتم‌ها به صورت متن (مشابه دمو)
    const itemsText = order.items.map(item => {
      const name = item.marketProduct?.product?.name || item.pharmacyMedicine?.medicine?.name ||
          item.variant?.marketProduct?.product?.name ||'محصول';
      return `${name} (${item.quantity})`;
    }).join('، ');

    return {
      id: order.id,
      code: order.orderCode, // یا order.orderCode اگر موجود باشد
      customerName: order.customerName,
      items: itemsText,
      phone:order.phone,
      shipping:order.shipping,
      address: [
        order.address.road??order.address.street,
        order.address.neighbourhood??order.address.city,
        order.address.suburb??order.address.province
      ]
          .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
          .join('. '),
      total: order.total
    };
  }
  return null; // اگر سفارشی نبود
});

// کنترل کننده نمایش بنر (فقط اگر سفارشی وجود داشته باشد نمایش داده شود)
const showOrderBanner = computed(() => !!newOrder.value);

// هندلر قبول سفارش
const handleAcceptOrder = async (order) => {
  try {
    // تغییر وضعیت به "پرداخت شده" (یا هر وضعیت منطقی بعد از تایید)
    await orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_PROCESSING);
    // نیازی به دستی رد کردن نیست، چون computed خودکار آپدیت می‌شود و بنر بسته می‌شود
    // هدایت به صفحه سفارشات (اختیاری)
    // router.push('/pharmacies/orders');
  } catch (error) {
    console.error('خطا در تایید سفارش:', error);
  }
};

// هندلر رد سفارش
const handleRejectOrder = async (order) => {
  try {
    // تغییر وضعیت به "لغو شده"
    await orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_CANCELLED);
  } catch (error) {
    console.error('خطا در رد سفارش:', error);
  }
};

const handleOrderTimeout = () => {
  console.log('زمان پاسخدهی به اتمام رسید')
  // TODO: Handle timeout - maybe send to next pharmacy
}

// Demo: Show banner after 3 seconds (remove in production)
/*const demoShowBanner = () => {
  setTimeout(() => {
    newOrder.value = {
      id: Date.now(),
      code: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      customerName: 'سارا احمدی',
      phone: '0912-345-6789',
      items: 'داروی ضد انگل سگ، ویتامین D3، غذای تر گربه',
      address: 'تهران، سعادت آباد، خیابان علامه شمالی، پلاک 42',
      total: 1250000,
      subtotal: 1225000,
      shipping: 25000,
      notes: 'لطفاً زودتر ارسال شود، حیوان خانگی بیمار است.'
    }
    showOrderBanner.value = true
  }, 3000)
}*/
const notificationStore=useNotificationStore()
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
// Notifications
/*const notifications = ref([
  {
    id: 1,
    type: 'appointment',
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
    message: 'محصول کم موجود: داروی ضد انگل',
    time: '2 ساعت پیش',
    read: true
  },
  {
    id: 4,
    type: 'appointment',
    title: 'لغو سفارش',
    message: 'علی حسینی سفارش خود را لغو کرد',
    time: '3 ساعت پیش',
    read: true
  }
])*/

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Menu Items
const menuItems = computed(() => [
  { path: '/pharmacies', label: 'داشبورد', icon: 'ti ti-dashboard', exact: true },
  { path: '/pharmacies/orders', label: 'سفارشات', icon: 'ti ti-shopping-cart', badge: orderStore.stats?.pendingOrders},
  { path: '/pharmacies/products', label: 'محصولات', icon: 'ti ti-shopping-bag' },
  { path: '/pharmacies/reviews', label: 'دیدگاه‌ها', icon: 'ti ti-star', badge: reviewsStore.reviews.length },
  { path: '/pharmacies/financial', label: 'امور مالی', icon: 'ti ti-coins' },
  { path: '/pharmacies/settings', label: 'تنظیمات', icon: 'ti ti-settings' }
])

const bottomNavItems = ref([
  { path: '/pharmacies', label: 'خانه', icon: 'ti ti-home', exact: true },
  { path: '/pharmacies/orders', label: 'سفارشات', icon: 'ti ti-shopping-cart' },
  { path: '/pharmacies/reviews', label: 'دیدگاه‌ها', icon: 'ti ti-star' },
  { path: '/pharmacies/settings', label: 'تنظیمات', icon: 'ti ti-settings' }
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
  if (path === '/pharmacies') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const getPageTitle = () => {
  const path = route.path
  if (path === '/pharmacies') return 'داشبورد'
  if (path.includes('/orders')) return 'سفارشات'
  if (path.includes('/products')) return 'محصولات'
  if (path.includes('/reviews')) return 'نظرات و دیدگاه‌ها'
  if (path.includes('/financial')) return 'امور مالی'
  if (path.includes('/settings')) return 'تنظیمات'
  if (path.includes('/notifications')) return 'اعلان‌ها'
  return 'پنل داروخانه'
}

const getPageDescription = () => {
  const path = route.path
  if (path === '/pharmacies') return 'مدیریت و نظارت بر عملکرد داروخانه'
  if (path.includes('/orders')) return 'مدیریت سفارشات دارو و محصولات'
  if (path.includes('/products')) return 'مدیریت محصولات فروشگاه'
  if (path.includes('/reviews')) return 'مدیریت نظرات و بازخوردهای مشتریان'
  if (path.includes('/financial')) return 'مدیریت تراکنش‌ها، درخواست تسویه و اطلاعات بانکی'
  if (path.includes('/settings')) return 'تنظیمات عمومی داروخانه'
  if (path.includes('/notifications')) return 'اعلان‌ها و پیام‌ها'
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

const goBack = () => {
  router.back()
}

const connectSocket = async () => {
  try {
    const socketStore = useSocketStore();
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

  // 1. مدیریت کلیک بیرون برای بستن نوتیفیکیشن
  const handleDocumentClick = (e) => {
    if (showNotifications.value && !e.target.closest('.relative')) {
      showNotifications.value = false
    }
  }

  document.addEventListener('click', handleDocumentClick)

  // پاک کردن لیسنر هنگام خروج از کامپوننت
  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick)
  })

  // 2. دریافت نوتیفیکیشن‌ها (معمولاً باید قبل از بقیه یا مستقل باشد)
  if (user.value?.id) {
    try {
      await notificationStore.fetchNotifications(user.value.id, 'PHARMACY-ADMIN')
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // 3. دریافت اطلاعات تنانت
  try {
    await authStore.fetchTenant(localStorage.getItem('tenant_id'))
  } catch (error) {
    console.error('Error fetching tenant:', error)
  }

  // 4. اجرای موازی تمام درخواست‌های داده‌ها با Promise.all
  // نکته مهم: داخل آرایه فقط تابع را صدا می‌زنیم، بدون await
  const fetchDataPromises = [
    productStore.fetchProducts(),
    productStore.fetchGlobalProducts(),
    medicineStore.fetchMedicines(),
    medicineStore.fetchGlobalMedicines(),
    categoryStore.fetchCategories(),
    referenceStore.fetchAll(),
    walletStore.fetchBalance('SHOP'),
    walletStore.fetchTransactions('SHOP'),
    reviewsStore.fetchReviews(),
    orderStore.fetchPharmacyOrders()
  ]

  try {
    // اینجا فقط یک await داریم که صبر می‌کند تا همه تمام شوند
    await Promise.all(fetchDataPromises)
  } catch (error) {
    console.error('Some data fetches failed:', error)
  }
  await connectSocket()
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
