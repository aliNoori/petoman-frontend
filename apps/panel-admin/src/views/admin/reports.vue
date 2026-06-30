<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">گزارشات و آمار</h1>
        <p class="text-gray-500 mt-1">تحلیل عملکرد سیستم و فروشگاه‌ها</p>
      </div>

      <!-- Time Range Filter -->
      <div class="flex items-center gap-2">
        <AppSelect
          v-model="selectedTimeRange"
          :options="timeRangeOptions"
          widthClass="min-w-[160px]"
          :fullWidth="false"
        />
        <button
          @click="exportToExcel"
          class="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="دانلود اکسل"
        >
          <i class="ti ti-file-spreadsheet text-green-600"></i>
          <span class="hidden md:inline text-sm text-gray-700">دانلود اکسل</span>
        </button>
        <button @click="refreshData" class="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <i class="ti ti-refresh text-gray-600"></i>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">درآمد کل</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(kpis.totalRevenue) }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i :class="kpis.revenueGrowth >= 0 ? 'ti ti-trending-up text-green-500' : 'ti ti-trending-down text-red-500'"></i>
              <span :class="kpis.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
                {{ Math.abs(kpis.revenueGrowth) }}%
              </span>
              <span class="text-xs text-gray-400">از ماه قبل</span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <i class="ti ti-currency-dollar text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">تراکنش‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(kpis.totalTransactions) }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i :class="kpis.transactionGrowth >= 0 ? 'ti ti-trending-up text-green-500' : 'ti ti-trending-down text-red-500'"></i>
              <span :class="kpis.transactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
                {{ Math.abs(kpis.transactionGrowth) }}%
              </span>
              <span class="text-xs text-gray-400">از ماه قبل</span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <i class="ti ti-receipt text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">کاربران فعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(kpis.activeUsers) }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i :class="kpis.userGrowth >= 0 ? 'ti ti-trending-up text-green-500' : 'ti ti-trending-down text-red-500'"></i>
              <span :class="kpis.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
                {{ Math.abs(kpis.userGrowth) }}%
              </span>
              <span class="text-xs text-gray-400">از ماه قبل</span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <i class="ti ti-users text-white text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">فروشگاه‌های فعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatNumber(kpis.activeStores) }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i :class="kpis.storeGrowth >= 0 ? 'ti ti-trending-up text-green-500' : 'ti ti-trending-down text-red-500'"></i>
              <span :class="kpis.storeGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
                {{ Math.abs(kpis.storeGrowth) }}%
              </span>
              <span class="text-xs text-gray-400">از ماه قبل</span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <i class="ti ti-building-store text-white text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Chart (Full Width) -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 class="font-bold text-gray-900 text-lg">نمودار درآمد</h3>
          <p class="text-sm text-gray-500">مقایسه درآمد داروخانه‌ها، پت‌شاپ‌ها و کلینیک‌ها</p>
        </div>
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-teal-500"></span>
            <span class="text-gray-600">داروخانه‌ها</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-orange-500"></span>
            <span class="text-gray-600">پت‌شاپ‌ها</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-sky-500"></span>
            <span class="text-gray-600">کلینیک‌ها</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            <span class="text-gray-600">دامپزشکان</span>
          </div>
        </div>
      </div>

      <!-- Chart Container with Chart.js -->
      <div class="h-80 relative">
        <canvas ref="revenueChartRef"></canvas>
      </div>
    </div>

    <!-- Two Column Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Store Types Distribution -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-900 text-lg mb-6">توزیع فروشگاه‌ها</h3>

        <!-- Pie Chart (CSS-based) -->
        <div class="flex items-center gap-8">
          <div class="relative w-40 h-40">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
              <!-- Pharmacies -->
              <circle
                cx="50" cy="50" r="40"
                fill="transparent"
                stroke="#14b8a6"
                stroke-width="20"
                :stroke-dasharray="`${storeDistribution.pharmacies * 2.51} 251`"
                stroke-dashoffset="0"
              />
              <!-- Markets -->
              <circle
                cx="50" cy="50" r="40"
                fill="transparent"
                stroke="#f97316"
                stroke-width="20"
                :stroke-dasharray="`${storeDistribution.markets * 2.51} 251`"
                :stroke-dashoffset="`${-storeDistribution.pharmacies * 2.51}`"
              />
              <!-- Clinics -->
              <circle
                cx="50" cy="50" r="40"
                fill="transparent"
                stroke="#0ea5e9"
                stroke-width="20"
                :stroke-dasharray="`${storeDistribution.clinics * 2.51} 251`"
                :stroke-dashoffset="`${-(storeDistribution.pharmacies + storeDistribution.markets) * 2.51}`"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ storeDistribution.total }}</p>
                <p class="text-xs text-gray-500">فروشگاه</p>
              </div>
            </div>
          </div>

          <div class="flex-1 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-teal-500"></span>
                <span class="text-gray-700">داروخانه‌ها</span>
              </div>
              <div class="text-left">
                <span class="font-bold text-gray-900">{{ storeDistribution.pharmaciesCount }}</span>
                <span class="text-gray-400 text-sm mr-1">({{ storeDistribution.pharmacies }}%)</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-orange-500"></span>
                <span class="text-gray-700">پت‌شاپ‌ها</span>
              </div>
              <div class="text-left">
                <span class="font-bold text-gray-900">{{ storeDistribution.marketsCount }}</span>
                <span class="text-gray-400 text-sm mr-1">({{ storeDistribution.markets }}%)</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-sky-500"></span>
                <span class="text-gray-700">کلینیک‌ها</span>
              </div>
              <div class="text-left">
                <span class="font-bold text-gray-900">{{ storeDistribution.clinicsCount }}</span>
                <span class="text-gray-400 text-sm mr-1">({{ storeDistribution.clinics }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performing Stores -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-900 text-lg">پرفروش‌ترین فروشگاه‌ها</h3>
          <AppSelect
            v-model="topStoresFilter"
            :options="storeTypeOptions"
            widthClass="min-w-[120px]"
            :fullWidth="false"
          />
        </div>

        <div class="space-y-4">
          <div
            v-for="(store, index) in topStores"
            :key="store.id"
            class="flex items-center gap-4"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              :class="index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ store.name }}</p>
              <p class="text-xs text-gray-500">{{ store.type }}</p>
            </div>
            <div class="text-left">
              <p class="font-bold text-gray-900">{{ formatCurrency(store.revenue) }}</p>
              <p class="text-xs" :class="store.growth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ store.growth >= 0 ? '+' : '' }}{{ store.growth }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Stats Table -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="font-bold text-gray-900 text-lg">جزئیات عملکرد فروشگاه‌ها</h3>
            <p class="text-sm text-gray-500">آمار تفصیلی تمام فروشگاه‌ها</p>
          </div>
          <div class="flex gap-2">
            <AppSelect
              v-model="detailsFilter.type"
              :options="storeTypeOptions"
              widthClass="min-w-[120px]"
              :fullWidth="false"
            />
            <AppSelect
              v-model="detailsFilter.city"
              :options="cityOptions"
              widthClass="min-w-[120px]"
              :fullWidth="false"
            />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">فروشگاه</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">نوع</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">شهر</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">درآمد ماهانه</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">تراکنش‌ها</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">رشد</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">امتیاز</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">وضعیت</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="store in paginatedStoreDetails" :key="store.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center"
                    :class="store.type === 'داروخانه' ? 'bg-teal-100' : store.type === 'پت‌شاپ' ? 'bg-orange-100' : 'bg-sky-100'"
                  >
                    <i
                      :class="[
                        store.type === 'داروخانه' ? 'ti ti-vaccine text-teal-600' :
                        store.type === 'پت‌شاپ' ? 'ti ti-building-store text-orange-600' :
                        'ti ti-stethoscope text-sky-600'
                      ]"
                    ></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ store.name }}</p>
                    <p class="text-xs text-gray-500">{{ store.owner }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ store.type }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ store.city }}</td>
              <td class="px-6 py-4 font-medium text-gray-900">{{ formatCurrency(store.revenue) }}</td>
              <td class="px-6 py-4 text-gray-700">{{ formatNumber(store.transactions) }}</td>
              <td class="px-6 py-4">
                <span
                  class="flex items-center gap-1"
                  :class="store.growth >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  <i :class="store.growth >= 0 ? 'ti ti-trending-up' : 'ti ti-trending-down'"></i>
                  {{ Math.abs(store.growth) }}%
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1">
                  <i class="ti ti-star-filled text-amber-400"></i>
                  <span class="font-medium text-gray-900">{{ store.rating }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="store.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ store.status === 'active' ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          نمایش {{ startIndex }} تا {{ endIndex }} از {{ filteredStoreDetails.length }} فروشگاه
        </p>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-right"></i>
          </button>

          <template v-for="page in totalPages" :key="page">
            <button
              v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="px-2 text-gray-400"
            >...</span>
          </template>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activities -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-900 text-lg mb-6">فعالیت‌های اخیر</h3>

        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex gap-4">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              :class="activity.bgClass"
            >
              <i :class="[activity.icon, activity.iconClass]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
            </div>
            <div class="text-sm text-gray-400 whitespace-nowrap">{{ activity.time }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-900 text-lg mb-6">آمار سریع</h3>

        <div class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">نرخ تبدیل</span>
              <span class="font-bold text-gray-900">{{ quickStats.conversionRate }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-full" :style="{ width: `${quickStats.conversionRate}%` }"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">رضایت مشتریان</span>
              <span class="font-bold text-gray-900">{{ quickStats.satisfaction }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full" :style="{ width: `${quickStats.satisfaction}%` }"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">پاسخگویی</span>
              <span class="font-bold text-gray-900">{{ quickStats.responseRate }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-l from-purple-500 to-purple-400 rounded-full" :style="{ width: `${quickStats.responseRate}%` }"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">تکمیل پروفایل</span>
              <span class="font-bold text-gray-900">{{ quickStats.profileCompletion }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-l from-orange-500 to-orange-400 rounded-full" :style="{ width: `${quickStats.profileCompletion}%` }"></div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ quickStats.avgOrderValue }}</p>
                <p class="text-xs text-gray-500">میانگین سفارش</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ quickStats.avgResponseTime }}</p>
                <p class="text-xs text-gray-500">زمان پاسخگویی</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import {Chart, registerables} from 'chart.js'
import moment from 'moment-jalaali' // اضافه کردن ایمپورت در بالای فایل
import {useTenantStore} from "@/stores/tenant.js";
import {useActivitiesStore} from "@/stores/admin/activities.js";

const tenantStore=useTenantStore()
// Register Chart.js components
Chart.register(...registerables)
// تابع کمکی برای تبدیل نوع به فارسی
const getTypeLabel = (type) => {
  const map = {
    'market': 'پت‌شاپ',
    'clinic': 'کلینیک',
    'pharmacy': 'داروخانه',
    'vet': 'دامپزشک'
  };
  return map[type]; // اصلاح شده: استفاده از براکت
};
// Chart reference
const revenueChartRef = ref(null)
let revenueChart = null

// Time Range
const selectedTimeRange = ref('month')
const timeRangeOptions = [
  { value: 'week', label: 'هفته گذشته', icon: 'ti ti-calendar' },
  { value: 'month', label: 'ماه گذشته', icon: 'ti ti-calendar' },
  { value: 'quarter', label: 'سه ماه گذشته', icon: 'ti ti-calendar' },
  { value: 'year', label: 'سال گذشته', icon: 'ti ti-calendar' }
]
// KPIs
// KPIs (تبدیل ref به computed برای واکنش‌گرا بودن)
const kpis = computed(() => ({
  totalRevenue: tenantStore.totalRevenue,
  revenueGrowth: 12.5, // مقدار ثابت یا فرمول محاسبه رشد
  totalTransactions: tenantStore.totalTransactions,
  transactionGrowth: 8.3, // مقدار ثابت یا فرمول محاسبه رشد
  activeUsers: 45600, // مقدار ثابت
  userGrowth: 15.2, // مقدار ثابت یا فرمول محاسبه رشد
  activeStores: tenantStore.activeStores,
  storeGrowth: 5.7 // مقدار ثابت یا فرمول محاسبه رشد
}))

// --- تغییرات نهایی: محاسبه داده نمودار از روی استور با moment-jalaali ---
const revenueData = computed(() => {
  const allTenants = tenantStore.tenants;

  // تعریف بازه‌های زمانی (Labels)
  const ranges = {
    week: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
    month: ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴'],
    quarter: ['ماه اول', 'ماه دوم', 'ماه سوم'],
    year: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  };

  const labels = ranges[selectedTimeRange.value] || ranges.month;

  // ساختار اولیه داده‌ها با صفر
  const dataStructure = labels.map(label => ({
    label,
    pharmacies: 0,
    markets: 0,
    clinics: 0,
    vets: 0
  }));

  const now = moment(); // تاریخ لحظه (شمسی/میلادی خودکار هندل می‌شود)

  // پردازش داده‌ها از استور
  allTenants.forEach(tenant => {
    tenant.orders?.forEach(order => {
      // بررسی وضعیت سفارش
      if (order.status === 'CUSTOMER_PAID' || order.status === 'CUSTOMER_DELIVERED') {

        const orderDate = moment(order.createdAt);

        // محاسبه اختلاف زمانی بر حسب روز
        const diffDays = now.diff(orderDate, 'days');

        let calculatedIndex = -1;

        // منطق تفکیک بر اساس فیلتر انتخاب شده
        if (selectedTimeRange.value === 'week') {
          // محاسبه روز هفته شمسی (۰=شنبه تا ۶=جمعه)
          calculatedIndex = orderDate.jDay();

        } else if (selectedTimeRange.value === 'month') {
          // محاسبه هفته از امروز به عقب
          if (diffDays >= 0 && diffDays < 7) calculatedIndex = 0;
          else if (diffDays >= 7 && diffDays < 14) calculatedIndex = 1;
          else if (diffDays >= 14 && diffDays < 21) calculatedIndex = 2;
          else if (diffDays >= 21 && diffDays < 28) calculatedIndex = 3;

        } else if (selectedTimeRange.value === 'quarter') {
          // محاسبه ماه از امروز به عقب
          const currentMonth = now.jMonth();
          const orderMonth = orderDate.jMonth();
          const yearDiff = now.jYear() - orderDate.jYear();

          const totalMonthsDiff = (yearDiff * 12) + (currentMonth - orderMonth);

          if (totalMonthsDiff >= 0 && totalMonthsDiff < 1) calculatedIndex = 0; // ماه جاری
          else if (totalMonthsDiff >= 1 && totalMonthsDiff < 2) calculatedIndex = 1; // ماه قبل
          else if (totalMonthsDiff >= 2 && totalMonthsDiff < 3) calculatedIndex = 2; // دو ماه قبل

        } else if (selectedTimeRange.value === 'year') {
          // محاسبه ماه شمسی (۰=فروردین تا ۱۱=اسفند)
          // ایندکس مستقیماً برابر با ماه شمسی سفارش است
          calculatedIndex = orderDate.jMonth();
        }

        // اگر ایندکس معتبر بود، مقدار را اضافه کن
        if (calculatedIndex >= 0 && calculatedIndex < labels.length) {
          if (tenant.type === 'PHARMACY') {
            dataStructure[calculatedIndex].pharmacies += order.totalAmount;
          } else if (tenant.type === 'MARKET') {
            dataStructure[calculatedIndex].markets += order.totalAmount;
          } else if (tenant.type === 'CLINIC') {
            dataStructure[calculatedIndex].clinics += order.totalAmount;
          } else if (tenant.type === 'VET') {
            dataStructure[calculatedIndex].vets += order.totalAmount;
          }
        }
      }
    });
  });

  return dataStructure;
});

// Store Distribution
const storeDistribution = computed(()=>tenantStore.storeDistribution)

// Top Stores Filter
const topStoresFilter = ref('')
const storeTypeOptions = [
  { value: '', label: 'همه', icon: 'ti ti-list' },
  { value: 'pharmacy', label: 'داروخانه', icon: 'ti ti-vaccine', iconColor: 'text-teal-500' },
  { value: 'market', label: 'پت‌شاپ', icon: 'ti ti-building-store', iconColor: 'text-orange-500' },
  { value: 'clinic', label: 'کلینیک', icon: 'ti ti-stethoscope', iconColor: 'text-sky-500' }
]

// Top Stores
const topStores = computed(() => {
  let stores = tenantStore.topStores
  if (topStoresFilter.value) {
    stores = stores.filter(s => s.type === getTypeLabel(topStoresFilter.value))
  }
  return stores
})

// Details Filter
const detailsFilter = ref({
  type: '',
  city: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
// Dynamic City Options (Extracted from Store Data)
const cityOptions = computed(() => {
  const cities = new Set(tenantStore.storeDetails.map(s => s.city).filter(Boolean))
  return [
    { value: '', label: 'همه شهرها', icon: 'ti ti-map-pin' },
    ...Array.from(cities).map(city => ({ value: city, label: city, icon: 'ti ti-map-pin' }))
  ]
})
// Store Details (Connected to Store)
const storeDetails = computed(() => tenantStore.storeDetails)

// Filtered Store Details Logic
const filteredStoreDetails = computed(() => {
  return storeDetails.value.filter(store => {

    // Filter by Type (Direct comparison with Persian labels from storeDetails)
    if (detailsFilter.value.type && store.type !==getTypeLabel(detailsFilter.value.type)) {
      return false
    }
    // Filter by City (Direct comparison)
    return !(detailsFilter.value.city && store.city !== detailsFilter.value.city);

  })
})

// Paginated data
const totalPages = computed(() => Math.ceil(filteredStoreDetails.value.length / itemsPerPage))

const paginatedStoreDetails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStoreDetails.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredStoreDetails.value.length))

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset page when filters change
watch([() => detailsFilter.value.type, () => detailsFilter.value.city], () => {
  currentPage.value = 1
})
const activitiesStore = useActivitiesStore();
// Recent Activities
const recentActivities = computed(()=>activitiesStore.recentActivities)/*ref([
  { id: 1, title: 'فروشگاه جدید ثبت شد', description: 'پت‌شاپ مهرآباد - تهران', time: '۵ دقیقه پیش', icon: 'ti ti-building-store', bgClass: 'bg-orange-100', iconClass: 'text-orange-600' },
  { id: 2, title: 'درخواست برداشت', description: 'داروخانه سلامت - ۱۵,۰۰۰,۰۰۰ تومان', time: '۱۵ دقیقه پیش', icon: 'ti ti-wallet', bgClass: 'bg-emerald-100', iconClass: 'text-emerald-600' },
  { id: 3, title: 'گزارش جدید', description: 'گزارش تخلف از کلینیک پارس', time: '۳۰ دقیقه پیش', icon: 'ti ti-alert-triangle', bgClass: 'bg-red-100', iconClass: 'text-red-600' },
  { id: 4, title: 'تأیید مدارک', description: 'مدارک داروخانه پت‌کر تأیید شد', time: '۱ ساعت پیش', icon: 'ti ti-certificate', bgClass: 'bg-blue-100', iconClass: 'text-blue-600' },
  { id: 5, title: 'کاربر جدید', description: 'دکتر سعیدی به سیستم پیوست', time: '۲ ساعت پیش', icon: 'ti ti-user-plus', bgClass: 'bg-purple-100', iconClass: 'text-purple-600' }
])*/

// Quick Stats
const quickStats = ref({
  conversionRate: 68,
  satisfaction: 92,
  responseRate: 85,
  profileCompletion: 78,
  avgOrderValue: '۱.۲M',
  avgResponseTime: '۴ دقیقه'
})

// Formatters
const formatCurrency = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B تومان`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M تومان`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K تومان`
  }
  return `${value} تومان`
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('fa-IR').format(value)
}

// Initialize Revenue Chart
const initRevenueChart = () => {
  if (!revenueChartRef.value) return
  // Destroy existing chart if exists
  if (revenueChart) {
    revenueChart.destroy()
  }
  const ctx = revenueChartRef.value.getContext('2d')

  // استفاده از revenueData.value که اکنون یک computed است
  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: revenueData.value.map(d => d.label),
      datasets: [
        {
          label: 'داروخانه‌ها',
          data: revenueData.value.map(d => d.pharmacies),
          backgroundColor: 'rgba(20, 184, 166, 0.8)',
          borderColor: 'rgb(20, 184, 166)',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        },
        {
          label: 'پت‌شاپ‌ها',
          data: revenueData.value.map(d => d.markets),
          backgroundColor: 'rgba(249, 115, 22, 0.8)',
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        },
        {
          label: 'کلینیک‌ها',
          data: revenueData.value.map(d => d.clinics),
          backgroundColor: 'rgba(14, 165, 233, 0.8)',
          borderColor: 'rgb(14, 165, 233)',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        },
        {
          label: 'دامپزشکان',
          data: revenueData.value.map(d => d.vets),
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          textDirection: 'rtl',
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: { family: 'Vazir', size: 12 },
          bodyFont: { family: 'Vazir', size: 11 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y
              return `${context.dataset.label}: ${value}M تومان`
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Vazir', size: 11 }, color: '#9ca3af' }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            font: { family: 'Vazir', size: 11 },
            color: '#9ca3af',
            callback: (value) => `${value}M`
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

// Watch for time range changes
watch(selectedTimeRange, () => {
  // چون revenueData اکنون computed است، با تغییر selectedTimeRange خودبه‌خود آپدیت می‌شود
  // فقط کافیست نمودار را دوباره بسازیم
  nextTick(() => {
    initRevenueChart()
  })
})

// Export to Excel
const exportToExcel = () => {
  // Prepare data for export
  const headers = ['فروشگاه', 'نوع', 'شهر', 'درآمد ماهانه', 'تراکنش‌ها', 'رشد', 'امتیاز', 'وضعیت']

  // Convert store details to CSV rows
  const rows = storeDetails.value.map(store => [
    store.name,
    store.type,
    store.city,
    store.revenue,
    store.transactions,
    `${store.growth}%`,
    store.rating,
    store.status === 'active' ? 'فعال' : 'غیرفعال'
  ])

  // Add summary rows
  const totalRevenue = storeDetails.value.reduce((sum, s) => sum + s.revenue, 0)
  const totalTransactions = storeDetails.value.reduce((sum, s) => sum + s.transactions, 0)
  const avgRating = (storeDetails.value.reduce((sum, s) => sum + s.rating, 0) / storeDetails.value.length).toFixed(1)

  rows.push([])
  rows.push(['خلاصه آماری'])
  rows.push(['کل درآمد', '', '', totalRevenue])
  rows.push(['کل تراکنش‌ها', '', '', '', totalTransactions])
  rows.push(['میانگین امتیاز', '', '', '', '', '', avgRating])

  // Revenue data
  rows.push([])
  rows.push(['درآمد ماهانه'])
  rows.push(['ماه', 'داروخانه‌ها', 'پت‌شاپ‌ها', 'کلینیک‌ها', 'دامپزشکان'])
  revenueData.value.forEach(month => {
    rows.push([month.label, `${month.pharmacies}M`, `${month.markets}M`, `${month.clinics}M`, `${month.vets}M`])
  })

  // Create CSV content with BOM for Persian support
  const BOM = '\uFEFF'
  const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `گزارش_آماری_${new Date().toLocaleDateString('fa-IR')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Refresh data
const refreshData = () => {
  // Simulate data refresh with animation
  if (revenueChart) {
    revenueChart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(v => v * (0.9 + Math.random() * 0.2))
    })
    revenueChart.update('active')
  }
}

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initRevenueChart()
  })
  activitiesStore.fetchActivities(5);
})

onUnmounted(() => {
  if (revenueChart) {
    revenueChart.destroy()
  }
})
</script>
