<template>
  <div class="min-h-screen bg-gray-50" dir="rtl">
    <!-- Desktop Header -->
    <header class="hidden lg:block fixed top-0 left-0 right-64 bg-white border-b border-gray-200 z-30">
      <div class="flex items-center justify-between px-6 py-3">
        <!-- Search -->
        <div class="relative w-80">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
              type="text"
              placeholder="جستجو در پنل..."
              class="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <!-- Tickets -->
          <router-link
              to="/admin/tickets"
              class="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              title="تیکت‌های پشتیبانی"
          >
            <i class="ti ti-ticket text-xl text-gray-600"></i>
            <span v-if="ticketStore.stats?.open > 0"
                  class="absolute -top-0.5 -left-0.5 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {{ ticketStore.stats?.open > 9 ? '9+' : ticketStore.stats?.open }}
            </span>
          </router-link>

          <!-- Notifications Dropdown (Desktop) -->
          <div class="relative" ref="notificationRef">
            <!-- دکمه را تغییر دادیم تا از تابع toggleNotifications استفاده کند -->
            <button
                @click.stop="toggleNotifications"
                class="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <i class="ti ti-bell text-xl text-gray-600"></i>
              <span v-if="notificationStore.stats?.unread > 0"
                    class="absolute -top-0.5 -left-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {{ notificationStore.stats?.unread > 9 ? '9+' : notificationStore.stats?.unread }}
              </span>
            </button>

            <!-- Notifications Panel -->
            <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
              <!-- z-index را به 100 تغییر دادیم -->
              <div v-if="showNotifications"
                   class="absolute left-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-[100]">
                <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 class="font-bold text-gray-900">اعلان‌ها</h3>
                  <button @click="markAllAsRead" class="text-xs text-indigo-600 hover:text-indigo-700">خواندن همه
                  </button>
                </div>
                <div class="max-h-80 overflow-y-auto">
                  <div
                      v-for="notif in notifications"
                      :key="notif.id"
                      class="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer"
                      :class="{ 'bg-indigo-50/50': !notif.read }"
                  >
                    <div class="flex gap-3">
                      <div
                          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          :class="notif.bgClass"
                      >
                        <i :class="[notif.icon, notif.iconClass]"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900 font-medium">{{ notif.title }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ notif.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ notif.time }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <router-link to="/admin/notifications"
                             class="block p-3 text-center text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100">
                  مشاهده همه اعلان‌ها
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- Divider -->
          <div class="w-px h-8 bg-gray-200 mx-2"></div>

          <!-- Logout -->
          <button @click="logout" class="p-2.5 hover:bg-red-50 rounded-xl transition-colors" title="خروج">
            <i class="ti ti-logout text-xl text-red-500"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="sidebarOpen = true" class="p-2 hover:bg-gray-100 rounded-lg">
          <i class="ti ti-menu-2 text-xl text-gray-700"></i>
        </button>
        <img src="/images/logo-petoman.svg" alt="پتومن" class="h-8"/>

        <!-- ref را اضافه کردیم -->
        <div class="flex items-center gap-1 relative" ref="notificationRef">
          <router-link to="/admin/tickets" class="relative p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-ticket text-lg text-gray-600"></i>
            <span v-if="ticketStore.stats?.open > 0"
                  class="absolute -top-0.5 -left-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {{ ticketStore.stats?.open }}
            </span>
          </router-link>

          <button @click.stop="toggleNotifications" class="relative p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-bell text-lg text-gray-600"></i>
            <span v-if="notificationStore.stats?.unread > 0"
                  class="absolute -top-0.5 -left-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {{ notificationStore.stats?.unread }}
            </span>
          </button>

          <!-- پنل موبایل -->
          <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
          >
            <!-- z-index را بالاتر از هدر موبایل (۴۰) کردیم -->
            <div v-if="showNotifications"
                 class="absolute left-0 top-12 w-72 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-[50]">
              <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-bold text-gray-900">اعلان‌ها</h3>
                <button @click="markAllAsRead" class="text-xs text-indigo-600 hover:text-indigo-700">خواندن همه</button>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    class="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer"
                    :class="{ 'bg-indigo-50/50': !notif.read }"
                >
                  <div class="flex gap-3">
                    <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        :class="notif.bgClass"
                    >
                      <i :class="[notif.icon, notif.iconClass]"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-900 font-medium">{{ notif.title }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ notif.message }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ notif.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <router-link to="/admin/notifications"
                           class="block p-3 text-center text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100">
                مشاهده همه اعلان‌ها
              </router-link>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="sidebarOpen" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside
        class="fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-50 transition-transform duration-300 w-64"
        :class="{ 'translate-x-full lg:translate-x-0': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <!-- Admin Profile -->
      <div class="p-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <!-- اگر آواتار وجود داشت -->
          <img
              v-if="adminUser.avatar"
              :src="adminUser.avatar"
              class="w-10 h-10 rounded-full  object-cover"
              alt="Avatar"
          >

          <!-- اگر آواتار وجود نداشت -->
          <div
              v-else
              class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold"
          >
            {{ adminUser.name.charAt(0) }}
          </div>

          <div class="flex-1 min-w-0">
            <h1 class="font-bold text-gray-900 truncate">{{ adminUser.name }}</h1>
            <p class="text-xs text-gray-500">{{ adminUser.role }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
        <router-link
            to="/admin"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path === '/admin' }"
        >
          <i class="ti ti-dashboard text-xl"></i>
          <span class="font-medium">داشبورد</span>
        </router-link>

        <!-- موارد در انتظار تایید -->
        <router-link
            to="/admin/pending"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/pending') }"
        >
          <i class="ti ti-clock-hour-4 text-xl"></i>
          <span class="font-medium">در انتظار تایید</span>
          <span v-if="pendingCount > 0"
                class="mr-auto px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">{{ pendingCount }}</span>
        </router-link>

        <div class="pt-2 pb-1">
          <p class="px-4 text-xs text-gray-400 font-medium">مدیریت</p>
        </div>

        <router-link
            to="/admin/users"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/users') }"
        >
          <i class="ti ti-users text-xl"></i>
          <span class="font-medium">مدیریت کاربران</span>
        </router-link>

        <router-link
            to="/admin/roles"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/roles') }"
        >
          <i class="ti ti-shield-check text-xl"></i>
          <span class="font-medium">مدیریت نقش‌ها</span>
        </router-link>

        <router-link
            to="/admin/clinics"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/clinics') }"
        >
          <i class="ti ti-building-hospital text-xl"></i>
          <span class="font-medium">کلینیک‌ها و دامپزشکان</span>
        </router-link>

        <router-link
            to="/admin/markets"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/markets') }"
        >
          <i class="ti ti-building-store text-xl"></i>
          <span class="font-medium">فروشگاه‌ها</span>
        </router-link>

        <router-link
            to="/admin/pharmacies"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/pharmacies') }"
        >
          <i class="ti ti-pill text-xl"></i>
          <span class="font-medium">داروخانه‌ها</span>
        </router-link>

        <router-link
            to="/admin/products"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/products') }"
        >
          <i class="ti ti-package text-xl"></i>
          <span class="font-medium">مدیریت محصولات</span>
          <span v-if="pendingProductsCount > 0"
                class="mr-auto px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">{{
              pendingProductsCount
            }}</span>
        </router-link>

        <router-link
            to="/admin/orders"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/orders') }"
        >
          <i class="ti ti-shopping-cart text-xl"></i>
          <span class="font-medium">سفارشات</span>
        </router-link>

        <div class="pt-2 pb-1">
          <p class="px-4 text-xs text-gray-400 font-medium">مالی و گزارشات</p>
        </div>

        <router-link
            to="/admin/finance"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/finance') }"
        >
          <i class="ti ti-wallet text-xl"></i>
          <span class="font-medium">مدیریت مالی</span>
        </router-link>

        <router-link
            to="/admin/reports"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/reports') }"
        >
          <i class="ti ti-chart-bar text-xl"></i>
          <span class="font-medium">گزارشات</span>
        </router-link>

        <div class="pt-2 pb-1">
          <p class="px-4 text-xs text-gray-400 font-medium">پشتیبانی</p>
        </div>

        <router-link
            to="/admin/tickets"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/tickets') }"
        >
          <i class="ti ti-ticket text-xl"></i>
          <span class="font-medium">تیکت‌های پشتیبانی</span>
          <span v-if="ticketStore.stats?.open > 0"
                class="mr-auto px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">{{
              ticketStore.stats?.open
            }}</span>
        </router-link>

        <div class="pt-2 pb-1">
          <p class="px-4 text-xs text-gray-400 font-medium">تنظیمات</p>
        </div>

        <router-link
            to="/admin/faq"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/faq') }"
        >
          <i class="ti ti-help text-xl"></i>
          <span class="font-medium">سوالات متداول</span>
        </router-link>

        <router-link
            to="/admin/settings"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-indigo-50 text-indigo-700': $route.path.includes('/admin/settings') }"
        >
          <i class="ti ti-settings text-xl"></i>
          <span class="font-medium">تنظیمات</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="lg:mr-64 min-h-screen pt-16 lg:pt-16">
      <div class="p-4 lg:p-6">
        <router-view/>
      </div>
    </main>

    <!-- Mobile Bottom Nav -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div class="flex items-center justify-around py-2">
        <router-link to="/admin" class="flex flex-col items-center p-2"
                     :class="$route.path === '/admin' ? 'text-indigo-600' : 'text-gray-500'">
          <i class="ti ti-dashboard text-xl"></i>
          <span class="text-xs mt-1">داشبورد</span>
        </router-link>
        <router-link to="/admin/users" class="flex flex-col items-center p-2"
                     :class="$route.path.includes('/admin/users') ? 'text-indigo-600' : 'text-gray-500'">
          <i class="ti ti-users text-xl"></i>
          <span class="text-xs mt-1">کاربران</span>
        </router-link>
        <router-link to="/admin/orders" class="flex flex-col items-center p-2"
                     :class="$route.path.includes('/admin/orders') ? 'text-indigo-600' : 'text-gray-500'">
          <i class="ti ti-shopping-cart text-xl"></i>
          <span class="text-xs mt-1">سفارشات</span>
        </router-link>
        <router-link to="/admin/settings" class="flex flex-col items-center p-2"
                     :class="$route.path.includes('/admin/settings') ? 'text-indigo-600' : 'text-gray-500'">
          <i class="ti ti-settings text-xl"></i>
          <span class="text-xs mt-1">تنظیمات</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useRequestShopStore} from "@/stores/market/request-shop.ts";
import {storeToRefs} from "pinia";
import {useNotificationStore} from "@/stores/notification.js";
import {useAuthStore} from "@/stores/auth.js";
import {useMarketSettingsStore} from "@/stores/market/settings.js";

import {useWalletStore} from "@/stores/wallet.ts";
import {useWithdrawalStore} from "@/stores/withdrawal.js";
import {useTenantRequestStore} from "@/stores/tenant-request.js";
import {useVetClinicSettingsStore} from "@/stores/vet-clinic/settings.js";
import {useVetClinicServicesStore} from "@/stores/vet-clinic/service.js";
import {useTenantStore} from "@/stores/tenant.js";
import {useTicketStore} from "@/stores/ticket.js";
import {useCategoryStore} from "@/stores/market/category.js";
import {useReviewStore} from "@/stores/market/reviews.js";

const marketCategoryStore = useCategoryStore()
const tenantReqStore = useTenantRequestStore()
const settingStore = useMarketSettingsStore()
const vetClinicSettingStore = useVetClinicSettingsStore()
const vetClinicServiceStore = useVetClinicServicesStore()
const authStore = useAuthStore()
const requestShopStore = useRequestShopStore()
const notificationStore = useNotificationStore()
const walletStore = useWalletStore()
const withdrawalsStore = useWithdrawalStore()
const ticketStore = useTicketStore();
const router = useRouter()
const sidebarOpen = ref(false)
// محاسبه داینامیک تعداد محصولات در انتظار تأیید بر اساس تب فعال

const marketProducts = computed(() => requestShopStore.products)
const pharmacyProducts = computed(() => tenantReqStore.medicines)
const pendingProductsCount = computed(() => {
  const p = marketProducts.value.filter(p => p.status === 'pending').length
  const m = pharmacyProducts.value.filter(p => p.status === 'pending').length
  return p + m
})
// ۱. داروخانه‌ها
const pendingPharmacies = computed(() => {
  return tenantReqStore.requests
      .filter(req => req.type === 'pharmacy')
})

// ۲. کلینیک‌ها
const pendingClinics = computed(() => {
  return tenantReqStore.requests
      .filter(req => req.type === 'clinic')
})

// ۳. دامپزشکان
const pendingVets = computed(() => {
  return tenantReqStore.requests
      .filter(req => req.type === 'vet')
})

// ۴. فروشگاه‌ها (مارکت)
const pendingMarkets = computed(() => {
  return requestShopStore.requests || []
})

const pendingProducts = computed(() => {
  // فیلتر کردن محصولات با وضعیت pending
  const p = marketProducts.value.filter(p => p.status === 'pending')
  const m = pharmacyProducts.value.filter(p => p.status === 'pending')
  return [...p, ...m]
})

// ۶. ویرایش‌های تنظیمات
const pendingEdits = computed(() => {
  const market = settingStore.pendingEdits || [];
  const vet = vetClinicSettingStore.pendingEdits || [];
  return [...market, ...vet];
})
const reviewsStore=useReviewStore()
// ۷. نظرات
const {reviewsProductPending, reviewsShopPending} = storeToRefs(reviewsStore)
const pendingShopReviews = computed(() => reviewsShopPending.value || [])
const pendingProductReviews = computed(() => reviewsProductPending.value || [])

// ۸. درخواست‌های برداشت وجه
const pendingWithdrawals = computed(() => {
  return withdrawalsStore.withdrawals.filter(w => w.status === 'pending' || w.status === 'processing')
})

// ۹. سرویس‌ها
const pendingServices = computed(() => vetClinicServiceStore.pendingServices || [])

// --- محاسبه نهایی pendingCount ---
const pendingCount = computed(() => {
  return (
      pendingPharmacies.value.length +
      pendingClinics.value.length +
      pendingVets.value.length +
      pendingMarkets.value.length +
      pendingProducts.value.length +
      pendingEdits.value.length +
      pendingShopReviews.value.length +
      pendingProductReviews.value.length +
      pendingWithdrawals.value.length +
      pendingServices.value.length
  )
})
const tenantStore = useTenantStore()
// متغیرهای قبلی را پاک کنید و این‌ها را جایگزین کنید:
const notificationRef = ref(null)
const showNotifications = ref(false)

// تابع کلیک بیرون (ساده شده)
const handleClickOutside = (event) => {
  // اگر پنل باز است و کلیک روی دکمه یا پنل نبوده، بسته شود
  if (showNotifications.value && notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotifications.value = false
  }
}

// تابع باز کردن پنل (برای تست)
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  console.log('Notification clicked. State:', showNotifications.value) // برای دیباگ در کنسول
}
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
// اصلاح شده: تبدیل به computed و حذف map (چون آبجکت تکی است)
const adminUser = computed(() => {
  // چون user یک آبجکت است، مستقیماً به پراپرتی‌های آن دسترسی داریم
  const u = user.value

  // اگر کاربر وجود نداشت، مقادیر پیش‌فرض را برگردان
  if (!u) {
    return {
      name: '',
      role: '',
      avatar: ''
    }
  }

  return {
    name: u.fullName ||(u.firstName + '.'+ u.lastName)||u.firstName|| '',
    // اگر role یک آبجکت است (مثل {name: 'admin'}) از u.role.name استفاده کنید
    role: u.roles[0]?.name==='SUPER_ADMIN'?'مدیر ارشد':'',
    avatar: u.avatar || ''
  }
})
const notifications = computed(() => notificationStore.notifications)


const markAllAsRead = () => {
  notifications.value?.forEach(n => n.read = true)
}

const logout = async () => {

  await authStore.logout()
  await router.push('/login')
}

onMounted(async () => {
  if (user.value && user.value.id) {
    await notificationStore.fetchNotifications(user.value.id, 'SUPER_ADMIN')
  } else {
    console.warn('User not found or ID missing')
  }
  await marketCategoryStore.fetchCategories()
  await settingStore.fetchPendingEdits()
  await vetClinicSettingStore.fetchPendingEdits()
  await vetClinicServiceStore.fetchPendingServices()
  await tenantStore.fetchTenants()
  await requestShopStore.fetchRequestShops()
  await tenantReqStore.fetchTenantRequest()
  await tenantReqStore.fetchRequestPendingMedicines()
  await requestShopStore.fetchRequestProducts()
  await withdrawalsStore.fetchShopsWithdrawals()

  //
  await requestShopStore.fetchAllShops()
  document.addEventListener('click', handleClickOutside)

  //fetch wallet
  await walletStore.fetchWallet()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
