<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">پنل مدیریت</h1>
          <p class="text-gray-500 mt-1">مدیریت کامل سیستم پتومن</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <i class="ti ti-circle-filled text-xs ml-1"></i>
            آنلاین
          </span>
        </div>
      </div>
    </div>

    <!-- موارد در انتظار تایید -->
    <div v-if="pendingStats.total > 0" class="bg-gradient-to-l from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
          <i class="ti ti-clock-hour-4 text-white text-xl"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-900">موارد در انتظار تایید</h2>
          <p class="text-sm text-amber-700">{{ pendingStats.total }} مورد نیاز به بررسی دارد</p>
        </div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <router-link 
          to="/admin/pending?tab=pharmacies" 
          class="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <i class="ti ti-pill text-teal-600"></i>
            <span class="text-sm font-medium text-gray-900">داروخانه‌ها</span>
          </div>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendingStats.pharmacies }}</p>
        </router-link>
        <router-link 
          to="/admin/pending?tab=clinics" 
          class="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <i class="ti ti-building-hospital text-rose-600"></i>
            <span class="text-sm font-medium text-gray-900">کلینیک‌ها</span>
          </div>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendingStats.clinics }}</p>
        </router-link>
        <router-link 
          to="/admin/pending?tab=vets" 
          class="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <i class="ti ti-stethoscope text-emerald-600"></i>
            <span class="text-sm font-medium text-gray-900">دامپزشکان</span>
          </div>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendingStats.vets }}</p>
        </router-link>
        <router-link 
          to="/admin/pending?tab=markets" 
          class="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <i class="ti ti-building-store text-orange-600"></i>
            <span class="text-sm font-medium text-gray-900">فروشگاه‌ها</span>
          </div>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendingStats.markets }}</p>
        </router-link>
        <router-link 
          to="/admin/pending?tab=products" 
          class="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <i class="ti ti-package text-blue-600"></i>
            <span class="text-sm font-medium text-gray-900">محصولات</span>
          </div>
          <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendingStats.products }}</p>
        </router-link>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-users text-blue-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کل کاربران</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers.toLocaleString('fa-IR') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <i class="ti ti-building-store text-orange-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">فروشگاه‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalMarkets }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <i class="ti ti-pill text-teal-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">داروخانه‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalPharmacies }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
            <i class="ti ti-building-hospital text-rose-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کلینیک‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalClinics }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <i class="ti ti-stethoscope text-emerald-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">دامپزشکان</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalVets }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <i class="ti ti-shopping-cart text-purple-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کل سفارشات</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders.toLocaleString('fa-IR') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <i class="ti ti-currency-dollar text-indigo-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">درخواست برداشت</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingWithdrawals }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
            <i class="ti ti-messages text-cyan-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">مشاوره‌های امروز</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.todayConsults }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <router-link to="/admin/users" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-users text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">مدیریت کاربران</h3>
          <p class="text-sm text-gray-500 mt-1">لیست و ویرایش کاربران</p>
        </div>
      </router-link>

      <router-link to="/admin/markets" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-building-store text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">مدیریت فروشگاه‌ها</h3>
          <p class="text-sm text-gray-500 mt-1">تایید و ویرایش فروشگاه‌ها</p>
        </div>
      </router-link>

      <router-link to="/admin/pharmacies" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-pill text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">مدیریت داروخانه‌ها</h3>
          <p class="text-sm text-gray-500 mt-1">تایید و ویرایش داروخانه‌ها</p>
        </div>
      </router-link>

      <router-link to="/admin/clinics" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-rose-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-rose-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-building-hospital text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">مدیریت کلینیک‌ها</h3>
          <p class="text-sm text-gray-500 mt-1">کلینیک‌ها و دامپزشکان</p>
        </div>
      </router-link>

      <router-link to="/admin/finance" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-wallet text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">مدیریت مالی</h3>
          <p class="text-sm text-gray-500 mt-1">برداشت‌ها و تسویه‌ها</p>
        </div>
      </router-link>

      <router-link to="/admin/pending" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-clock-hour-4 text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">در انتظار تایید</h3>
          <p class="text-sm text-gray-500 mt-1">موارد نیازمند بررسی</p>
        </div>
      </router-link>

      <router-link to="/admin/faq" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-help text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">سوالات متداول</h3>
          <p class="text-sm text-gray-500 mt-1">مدیریت FAQ بخش‌ها</p>
        </div>
      </router-link>

      <router-link to="/admin/reports" class="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i class="ti ti-chart-bar text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900">گزارشات</h3>
          <p class="text-sm text-gray-500 mt-1">آمار و گزارشات سیستم</p>
        </div>
      </router-link>
    </div>

    <!-- Recent Orders (All Services) -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">آخرین سفارش‌ها</h2>
        <router-link to="/admin/orders" class="text-sm text-indigo-600 hover:underline">مشاهده همه</router-link>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">کد</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مشتری</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">ارائه‌دهنده</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">بخش</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مبلغ</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">وضعیت</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-mono font-bold text-gray-900">{{ order.code }}</td>
              <td class="px-6 py-4">
                <p class="text-gray-900">{{ order.customer }}</p>
                <p class="text-xs text-gray-500">{{ order.phone }}</p>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ order.seller }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-lg text-xs font-medium" :class="getTypeClass(order.type)">
                  {{ getTypeLabel(order.type) }}
                </span>
              </td>
              <td class="px-6 py-4 font-bold text-gray-900">{{ formatPrice(order.total) }} <span class="text-xs text-gray-500">تومان</span></td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ order.date }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-100">
        <div v-for="order in recentOrders" :key="order.id" class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-mono font-bold text-gray-900">{{ order.code }}</p>
              <p class="text-sm text-gray-600">{{ order.customer }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-gray-600">{{ getTypeLabel(order.type) }} • {{ order.seller }}</span>
            <span class="text-xs text-gray-500">{{ order.date }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-900">{{ formatPrice(order.total) }} تومان</span>
            <span class="text-xs text-gray-500">{{ order.phone }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">فعالیت‌های اخیر</h2>
        <button class="text-sm text-indigo-600 hover:underline">مشاهده همه</button>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="activity in recentActivities" :key="activity.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="activity.bgColor">
              <i :class="[activity.icon, activity.iconColor]"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.description }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import {useReviewStore} from "@/stores/market/reviews.js";
import {storeToRefs} from "pinia";
import {useCategoryStore} from "@/stores/market/category.js";
import {useTenantRequestStore} from "@/stores/tenant-request.js";
import {useMarketSettingsStore} from "@/stores/market/settings.js";
import {useVetClinicSettingsStore} from "@/stores/vet-clinic/settings.js";
import {useVetClinicServicesStore} from "@/stores/vet-clinic/service.js";
import {useAuthStore} from "@/stores/auth.js";
import {useRequestShopStore} from "@/stores/market/request-shop.js";
import {useNotificationStore} from "@/stores/notification.js";
import {useWalletStore} from "@/stores/wallet.js";
import {useWithdrawalStore} from "@/stores/withdrawal.js";
import {useTicketStore} from "@/stores/ticket.js";
import {useInfoStore} from "@/stores/admin/info.js";
import {useOrderStore} from "@/stores/admin/order.js";
import {useActivitiesStore} from "@/stores/admin/activities.js";

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
const orderStore=useOrderStore()
const orders = computed(() => {
  const rawOrders = orderStore.orders || []

  if (!rawOrders || !Array.isArray(rawOrders)) {
    return []
  }

  // مرتب‌سازی بر اساس تاریخ ایجاد (جدیدترین در بالا)
  // یک کپی از آرایه می‌سازیم تا اورجینال تغییر نکند
  const sortedOrders = [...rawOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA // نزولی (از بزرگ به کوچک)
  })

  return sortedOrders.map(order => {
    const user = order.user || {}
    const tenant = order.tenant || {}
    const firstName = user.firstName || ''
    const lastName = user.lastName || user.fullName || ''
    const fullName = `${firstName} ${lastName}`.trim() || 'نامشخص'

    let dateStr = '-'
    if (order.createdAt) {
      try {
        dateStr = new Date(order.createdAt).toLocaleDateString('fa-IR')
      } catch (e) {
        dateStr = order.createdAt
      }
    }

    return {
      id: order.id,
      code: order.orderCode || `ORD-${order.id}`,
      customer: fullName,
      phone: user.phoneNumber || '-',
      seller: tenant.name || tenant.ownerName || 'فروشنده حذف شده',
      type: tenant.type,
      total: order.totalAmount || 0,
      date: dateStr,
      status: order.status
    }
  })
})
const infoStore = useInfoStore();
onMounted(async () => {
  await infoStore.fetchStats();
});

const stats = computed(()=>({
  totalUsers: infoStore.stats.totalUsers,
  totalMarkets: infoStore.stats.totalMarkets,
  totalPharmacies: infoStore.stats.totalPharmacies,
  totalClinics: infoStore.stats.totalClinics,
  totalVets: infoStore.stats.totalVets,
  totalOrders: infoStore.stats.totalOrders,
  pendingWithdrawals: infoStore.stats.pendingWithdrawals,
  todayConsults: infoStore.stats.todayConsults
}))
///////
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
      pendingProducts.value.length //+
      //pendingEdits.value.length +
      //pendingShopReviews.value.length +
      //pendingProductReviews.value.length +
      //pendingWithdrawals.value.length +
      //pendingServices.value.length
  )
})
/////

const pendingStats = computed(() => ({
  pharmacies: pendingPharmacies.value.length, // اصلاح: استفاده از لیست درست داروخانه‌ها
  clinics: pendingClinics.value.length,
  vets: pendingVets.value.length,
  markets: pendingMarkets.value.length,
  products: pendingProducts.value.length, // اصلاح: استفاده از لیست ترکیبی محصولات
  total: pendingCount.value // اصلاح: مقدار داینامیک
}))

/*const recentActivities = ref([
  {
    id: 1,
    icon: 'ti ti-user-plus',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    title: 'کاربر جدید ثبت‌نام کرد',
    description: 'علی محمدی - 09123456789',
    time: '5 دقیقه پیش'
  },
  {
    id: 2,
    icon: 'ti ti-stethoscope',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    title: 'درخواست ثبت دامپزشک جدید',
    description: 'دکتر سارا احمدی - در انتظار تایید',
    time: '10 دقیقه پیش'
  },
  {
    id: 3,
    icon: 'ti ti-building-store',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-100',
    title: 'درخواست ثبت فروشگاه جدید',
    description: 'پت‌شاپ ستاره - در انتظار تایید',
    time: '15 دقیقه پیش'
  },
  {
    id: 4,
    icon: 'ti ti-wallet',
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    title: 'درخواست برداشت وجه',
    description: 'داروخانه پارس - 5,000,000 تومان',
    time: '25 دقیقه پیش'
  },
  {
    id: 5,
    icon: 'ti ti-shopping-cart',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100',
    title: 'سفارش جدید ثبت شد',
    description: 'سفارش #1234 - 450,000 تومان',
    time: '30 دقیقه پیش'
  },
  {
    id: 6,
    icon: 'ti ti-pill',
    iconColor: 'text-teal-600',
    bgColor: 'bg-teal-100',
    title: 'داروخانه جدید تایید شد',
    description: 'داروخانه دامپزشکی پارس',
    time: '1 ساعت پیش'
  }
])*/

/*const orders = ref([
  // Market
  { id: 1, code: 'ORD-M-1042', customer: 'علی محمدی', phone: '09123456789', seller: 'فروشگاه ستاره', type: 'market', total: 450000, date: '1403/09/10', status: 'delivered' },
  // Pharmacy
  { id: 2, code: 'ORD-P-2211', customer: 'فاطمه احمدی', phone: '09132345678', seller: 'داروخانه پارس', type: 'pharmacy', total: 180000, date: '1403/09/10', status: 'pending' },
  // Clinic (Appointment)
  { id: 3, code: 'APP-C-778', customer: 'محمد رضایی', phone: '09143456789', seller: 'کلینیک مهر', type: 'clinic', total: 320000, date: '1403/09/10', status: 'confirmed' },
  // Vet (Consultation)
  { id: 4, code: 'APP-V-1192', customer: 'زهرا کریمی', phone: '09154567890', seller: 'دکتر سارا احمدی', type: 'vet', total: 250000, date: '1403/09/09', status: 'completed' },
  { id: 5, code: 'ORD-M-1043', customer: 'حسین نوری', phone: '09165678901', seller: 'فروشگاه گلستان', type: 'market', total: 620000, date: '1403/09/09', status: 'processing' },
  { id: 6, code: 'ORD-P-2212', customer: 'نگار امینی', phone: '09170001122', seller: 'داروخانه مهر', type: 'pharmacy', total: 295000, date: '1403/09/09', status: 'shipped' },
  { id: 7, code: 'APP-C-779', customer: 'رضا مرادی', phone: '09183334455', seller: 'کلینیک امید', type: 'clinic', total: 280000, date: '1403/09/08', status: 'pending' },
  { id: 8, code: 'APP-V-1193', customer: 'مریم شریفی', phone: '09195556677', seller: 'دکتر نوری', type: 'vet', total: 180000, date: '1403/09/08', status: 'cancelled' },
  { id: 9, code: 'ORD-M-1044', customer: 'سمیه جعفری', phone: '09121112233', seller: 'فروشگاه پت‌کو', type: 'market', total: 510000, date: '1403/09/08', status: 'delivered' },
])*/

const recentOrders = computed(() => orders.value.slice(0, 8))

const formatPrice = (p) => new Intl.NumberFormat('fa-IR').format(p)

const getTypeLabel = (t) => ({
  MARKET: 'فروشگاه',
  PHARMACY: 'داروخانه',
  CLINIC: 'کلینیک',
  VET: 'دامپزشک'
}[t] || t)

const getTypeClass = (t) => ({
  MARKET: 'bg-orange-100 text-orange-700',
  PHARMACY: 'bg-teal-100 text-teal-700',
  CLINIC: 'bg-rose-100 text-rose-700',
  VET: 'bg-emerald-100 text-emerald-700'
}[t] || 'bg-gray-100 text-gray-700')

const getStatusLabel = (s) => {
  // لیست وضعیت‌هایی که به معنی "در انتظار" هستند
  if (['CUSTOMER_PENDING', 'CUSTOMER_PAID'].includes(s)) {
    return 'در انتظار';
  }
  // لیست وضعیت‌هایی که به معنی "لغو شده" هستند
  if (['CUSTOMER_CANCELLED', 'TENANT_CANCELED', 'REJECTED'].includes(s)) {
    return 'لغو شده';
  }

  // نگاشت سایر وضعیت‌ها
  const labels = {
    'TENANT_PROCESSING': 'در حال پردازش',
    'TENANT_SHIPPED': 'ارسال شده',
    'CUSTOMER_DELIVERED': 'تحویل شده',
    'TENANT_CONFIRMED': 'تایید شده',
    'CONFIRMED': 'انجام شده',
  };

  return labels[s] || s; // اگر پیدا نشد، همان مقدار اصلی را برگردان
};

const getStatusClass = (s) => {
  // نگاشت وضعیت‌های مختلف به کلاس‌های CSS
  const map = {
    // زرد: در انتظار
    'CUSTOMER_PENDING': 'bg-yellow-100 text-yellow-700',
    'CUSTOMER_PAID': 'bg-yellow-100 text-yellow-700',

    // آبی: در حال پردازش
    'TENANT_PROCESSING': 'bg-blue-100 text-blue-700',

    // بنفش: ارسال شده
    'TENANT_SHIPPED': 'bg-purple-100 text-purple-700',
    // سبز: تحویل شده / تایید شده / انجام شده
    'CUSTOMER_DELIVERED': 'bg-green-100 text-green-700',
    'TENANT_CONFIRMED': 'bg-green-100 text-green-700',
    'COMPLETED': 'bg-green-100 text-green-700',


    // قرمز: لغو شده / رد شده
    'CUSTOMER_CANCELLED': 'bg-red-100 text-red-700',
    'TENANT_CANCELED': 'bg-red-100 text-red-700',
    'REJECTED': 'bg-red-100 text-red-700',

  };

  return map[s] || 'bg-gray-100 text-gray-700';
};

const activitiesStore = useActivitiesStore();
// Recent Activities
const recentActivities = computed(()=>activitiesStore.recentActivities)
</script>
