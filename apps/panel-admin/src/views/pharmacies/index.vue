<template>
  <div class="space-y-6">
    <!-- Header با فیلتر و آیکون امتیاز -->
    <div class="flex items-center justify-between gap-4">
      <!-- فیلتر زمانی -->
      <div class="flex items-center gap-2">
        <button
            v-for="period in timePeriods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedPeriod === period.value
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          <i :class="period.icon + ' ml-1'"></i>
          {{ period.label }}
        </button>
      </div>
      <!-- آیکون امتیاز -->
      <button
          @click="showRatingModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors group"
      >
        <i class="ti ti-award text-amber-500 text-xl group-hover:scale-110 transition-transform"></i>
        <div class="text-right">
          <p class="text-xs text-gray-600">عملکرد شما</p>
          <p class="text-sm font-bold text-gray-900 font-english">{{ tenant?.rating }}/5</p>
        </div>
      </button>
    </div>

    <!-- کارت‌های آماری اصلی -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      <!-- کارت فروش -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-currency-toman text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+{{ currentStats?.salesGrowth }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل فروش</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatNumber(currentStats?.totalSales) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت کارمزد پلتفرم -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-percentage text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
              <span class="font-english">5%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کارمزد پلتفرم</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatNumber(currentStats?.platformFee) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت خالص درآمد -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-cash text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+{{ currentStats?.salesGrowth }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">خالص درآمد</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatNumber(currentStats?.netIncome) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت سفارشات -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-shopping-cart text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+{{ currentStats?.ordersGrowth }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل سفارشات</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ currentStats?.totalOrders }}</p>
            <p class="text-xs text-gray-500">سفارش</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid اصلی: نمودار و کارت‌ها -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- نمودار فروش (2 ستون) -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-chart-line text-teal-500"></i>
            نمودار فروش {{ timePeriods.find(p => p.value === selectedPeriod)?.label }}
          </h3>
          <div class="h-80">
            <canvas ref="weeklyChartCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- کارت‌های کناری (1 ستون) -->
      <div class="space-y-4">
        <!-- سفارشات جدید -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <i class="ti ti-shopping-bag text-white text-2xl"></i>
            </div>
            <span class="text-xs px-2 py-1 bg-blue-500 text-white rounded-full font-medium">جدید</span>
          </div>
          <h4 class="text-sm font-medium text-blue-700 mb-1">سفارشات جدید</h4>
          <p class="text-3xl font-bold text-blue-900 font-english mb-2" dir="ltr">{{ newOrders }}</p>
          <p class="text-xs text-blue-600">نیاز به بررسی</p>
        </div>

        <!-- آمار فروش امروز -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
              <i class="ti ti-chart-bar text-white text-2xl"></i>
            </div>
            <span class="text-xs px-2 py-1 bg-amber-500 text-white rounded-full font-medium">امروز</span>
          </div>
          <h4 class="text-sm font-medium text-amber-700 mb-2">آمار فروش امروز</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-600">تعداد سفارشات</span>
              <span class="text-sm font-bold text-amber-700 font-english">{{ todayStats?.orders }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-600">محصولات فروخته شده</span>
              <span class="text-sm font-bold text-amber-700 font-english">{{ todayStats?.products }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-600">مجموع فروش</span>
              <span class="text-sm font-bold text-amber-700 font-english">{{ formatNumber(todayStats?.revenue) }} <small class="text-gray-500">تومان</small></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ردیف دوم: وضعیت مرسوله‌ها -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- ارسال شده -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-truck-delivery text-purple-600 text-xl"></i>
          </div>
          <span class="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">در راه</span>
        </div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">مرسوله ارسال شده</h4>
        <p class="text-2xl font-bold text-gray-900 font-english mb-1" dir="ltr">{{ shippedOrders }}</p>
        <p class="text-xs text-gray-500">در حال ارسال</p>
      </div>

      <!-- تحویل داده شده -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-circle-check text-green-600 text-xl"></i>
          </div>
          <span class="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-medium">موفق</span>
        </div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">تحویل داده شده</h4>
        <p class="text-2xl font-bold text-gray-900 font-english mb-1" dir="ltr">{{ deliveredOrders }}</p>
        <p class="text-xs text-gray-500">تحویل موفق</p>
      </div>

      <!-- موجودی کم -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="ti ti-alert-triangle text-orange-600 text-xl"></i>
          </div>
          <span class="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">هشدار</span>
        </div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">موجودی کم</h4>
        <p class="text-2xl font-bold text-gray-900 font-english mb-1" dir="ltr">{{ lowStockItems }}</p>
        <p class="text-xs text-gray-500">نیاز به سفارش</p>
      </div>
    </div>

    <!-- سفارشات در انتظار تایید و محصولات پرفروش -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- سفارشات در انتظار تایید -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-clock-hour-4 text-amber-500"></i>
            سفارشات در انتظار تایید
          </h3>
          <router-link
              to="/pharmacies/orders"
              class="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium hover:bg-amber-200 transition-colors"
          >
            مشاهده همه
          </router-link>
        </div>
        <div class="space-y-3">
          <div
              v-for="(order, index) in pendingOrders.slice(0, 5)"
              :key="order.id"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer"
          >
            <div
                class="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600 flex-shrink-0"
            >
              <i class="ti ti-shopping-bag text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">{{ order.customerName }}</p>
              <p class="text-xs text-gray-500">{{ order.itemsCount }} قلم - {{ order.timeAgo }}</p>
            </div>
            <div class="text-left flex-shrink-0">
              <p class="text-sm font-bold text-amber-600 font-english">{{ formatNumber(order.total) }}</p>
              <p class="text-xs text-gray-500">تومان</p>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <button
                  @click.stop="approveOrder(order.id)"
                  class="w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                  title="تایید سفارش"
              >
                <i class="ti ti-check text-lg"></i>
              </button>
              <button
                  @click.stop="rejectOrder(order.id)"
                  class="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                  title="رد سفارش"
              >
                <i class="ti ti-x text-lg"></i>
              </button>
            </div>
          </div>
          <!-- اگر سفارشی نبود -->
          <div v-if="pendingOrders.length === 0" class="text-center py-8">
            <i class="ti ti-inbox text-4xl text-gray-300 mb-2"></i>
            <p class="text-sm text-gray-500">سفارش جدیدی وجود ندارد</p>
          </div>
        </div>
      </div>

      <!-- محصولات پرفروش -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-bottle text-blue-500"></i>
            محصولات پرفروش
          </h3>
          <span class="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            این ماه
          </span>
        </div>
        <div class="space-y-3">
          <div
              v-for="(product, index) in topHealthProducts"
              :key="index"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
          >
            <div
                class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                :class="[
                index === 0 ? 'bg-amber-500 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-orange-500 text-white' :
                'bg-blue-100 text-blue-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-500">{{ product.category }}</p>
            </div>
            <div class="text-left flex-shrink-0">
              <p class="text-sm font-bold text-blue-600 font-english">{{ product.sales }}</p>
              <p class="text-xs text-gray-500">فروش</p>
            </div>
            <div class="w-16 flex-shrink-0">
              <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    :style="{ width: product.percentage + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-600 text-center mt-0.5 font-english">{{ product.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- مودال امتیاز و کارمزد -->
  <Transition name="fade">
    <div
        v-if="showRatingModal"
        @click="showRatingModal = false"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-0 lg:p-4"
    >
      <div
          @click.stop
          class="bg-white lg:rounded-2xl shadow-2xl max-w-md w-full h-full lg:h-auto overflow-y-auto"
      >
        <!-- Header -->
        <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white overflow-hidden lg:rounded-t-2xl sticky top-0 z-10">
          <div class="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
          <div class="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <i class="ti ti-award text-3xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold">عملکرد داروخانه شما</h3>
                <p class="text-sm opacity-90">امتیاز و رتبه‌بندی</p>
              </div>
            </div>
            <button @click="showRatingModal = false" class="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
              <i class="ti ti-x text-xl"></i>
            </button>
          </div>
        </div>
        <!-- محتوای امتیاز -->
        <div class="p-6 space-y-6">
          <!-- امتیاز و رتبه -->
          <div class="text-center pb-6 border-b border-gray-200">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 mb-4 relative">
              <span class="text-4xl font-bold text-amber-600 font-english">{{ rating.average.toFixed(1) }}</span>
              <div class="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                عالی
              </div>
            </div>
            <!-- ستاره‌ها -->
            <div class="flex gap-1 justify-center mb-3">
              <i
                  v-for="star in 5"
                  :key="star"
                  :class="[
                    'ti text-3xl',
                    star <= Math.floor(rating.average) ? 'ti-star-filled text-amber-500' :
                    star === Math.ceil(rating.average) && rating.average % 1 !== 0 ? 'ti-star-half-filled text-amber-500' :
                    'ti-star text-gray-300'
                  ]"
              ></i>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              بر اساس <span class="font-bold text-gray-900 font-english">{{ rating.totalReviews }}</span> نظر مشتریان
            </p>
            <!-- نمایش رتبه -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 mt-2">
              <i class="ti ti-trophy text-amber-600 text-lg"></i>
              <div class="text-right">
                <p class="text-xs text-gray-600">رتبه شما</p>
                <p class="text-sm font-bold text-amber-600">رتبه 8 از 92 داروخانه</p>
              </div>
            </div>
          </div>
          <!-- توضیحات عملکرد -->
          <div class="bg-blue-50 rounded-xl p-5">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="ti ti-info-circle text-white text-xl"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 mb-2">تاثیر امتیازات بر عملکرد</h4>
                <p class="text-sm text-gray-700 leading-relaxed mb-3">
                  این امتیازات بر عملکرد داروخانه شما تاثیر مستقیم دارد. با ارسال به‌موقع سفارشات، رفتار مناسب با مشتریان و ارائه خدمات با کیفیت، امتیاز و رتبه خود را بهبود دهید.
                </p>
                <!-- نکات کلیدی -->
                <div class="space-y-2 mt-3">
                  <div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="ti ti-check text-green-600 text-base"></i>
                    <span>ارسال به‌موقع سفارشات</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="ti ti-check text-green-600 text-base"></i>
                    <span>رفتار مناسب با مشتریان</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="ti ti-check text-green-600 text-base"></i>
                    <span>کیفیت بالای محصولات</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-700">
                    <i class="ti ti-check text-green-600 text-base"></i>
                    <span>پاسخگویی سریع به سوالات</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- دکمه بستن -->
          <button
              @click="showRatingModal = false"
              class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import {usePharmacyOrderStore} from "@/stores/pharmacy/order.js";
import{storeToRefs} from "pinia";
import {useWalletStore} from "@/stores/wallet.js";
import { OrderStatus } from "@/stores/pharmacy/order.js";
import {useAuthStore} from "@/stores/auth.js";

const authStore=useAuthStore()
const {tenant}=storeToRefs(authStore)
const walletStore = useWalletStore()
const { transactions } = storeToRefs(walletStore)

const orderStore = usePharmacyOrderStore()

// دریافت تمام رفرنس‌های مورد نیاز از استور
const {
  pendingOrders,
  statsData,
  todayStats,
  chartData,
  ordersByStatus,
  selectedPeriod // <--- مهم: دریافت selectedPeriod از استور
} = storeToRefs(orderStore)

// Register Chart.js
Chart.register(...registerables)

// لیست دوره‌های زمانی (فقط برای نمایش دکمه‌ها)
const timePeriods = [
  { value: 'weekly', label: 'هفتگی', icon: 'ti ti-calendar-week' },
  { value: 'monthly', label: 'ماهانه', icon: 'ti ti-calendar-month' },
  { value: 'quarterly', label: 'سه‌ماهه', icon: 'ti ti-calendar-stats' }
]

// آمار فعلی بر اساس بازه انتخابی
const currentStats = computed(() => {
  return statsData.value[selectedPeriod.value]
})

// امتیاز داروخانه
const rating = ref({
  average: 4.7,
  totalReviews: 324
})

// مودال امتیاز و کارمزد
const showRatingModal = ref(false)
const platformFee = 5

// نمودار
const weeklyChartCanvas = ref(null)
let weeklyChart = null

// داده‌های نمودار (اکنون واکنش‌گرا به تغییر selectedPeriod استور خواهد بود)
const weeklyData = computed(() => chartData.value)

// داده‌های کارت‌های کناری
const newOrders = computed(() => ordersByStatus.value.pending)
const shippedOrders = computed(() => ordersByStatus.value.shippingOrders)
const deliveredOrders = computed(() => ordersByStatus.value.deliveredOrders)
const lowStockItems = ref(9)

// محصولات پرفروش
const topHealthProducts = computed(() => {
  const products = orderStore.topSellingProducts;
  if (!products || products.length === 0) return [];

  const maxSales = Math.max(...products.map(p => p.totalSales));

  return products.map(p => ({
    name: p.name,
    category: p.category,
    sales: p.totalSales,
    percentage: maxSales > 0 ? Math.round((p.totalSales / maxSales) * 100) : 0
  }));
});

// فرمت کردن اعداد
const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

// ایجاد نمودار
const initWeeklyChart = () => {
  if (!weeklyChartCanvas.value) return
  if (weeklyChart) {
    weeklyChart.destroy()
  }
  const ctx = weeklyChartCanvas.value.getContext('2d')
  const periodLabel = timePeriods.find(p => p.value === selectedPeriod.value)?.label || 'هفتگی'

  // ایجاد gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(20, 184, 166, 0.9)')
  gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.6)')
  gradient.addColorStop(1, 'rgba(20, 184, 166, 0.3)')

  const salesData = weeklyData.value.map(d => d.sales)

  weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeklyData.value.map(d => d.label),
      datasets: [
        {
          label: `فروش ${periodLabel}`,
          data: salesData,
          backgroundColor: gradient,
          borderColor: 'rgba(20, 184, 166, 1)',
          borderWidth: 2,
          borderRadius: 12,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          hoverBackgroundColor: 'rgba(20, 184, 166, 1)',
          hoverBorderColor: 'rgba(13, 148, 136, 1)',
          hoverBorderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          padding: 16,
          cornerRadius: 12,
          titleFont: {
            size: 14,
            family: 'Vazirmatn',
            weight: 'bold'
          },
          bodyFont: {
            size: 13,
            family: 'Vazirmatn',
            weight: '500'
          },
          displayColors: true,
          boxPadding: 6,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || ''
              const value = formatMoney(context.parsed.y) + ' تومان'
              return label + ': ' + value
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)',
            drawBorder: false
          },
          border: {
            display: false
          },
          ticks: {
            font: {
              family: 'Vazirmatn',
              size: 11
            },
            color: '#6B7280',
            padding: 10,
            callback: function(value) {
              return (value / 1000000).toFixed(1) + 'M'
            }
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: {
            display: false
          },
          ticks: {
            font: {
              family: 'Vazirmatn',
              size: 12,
              weight: '500'
            },
            color: '#374151',
            padding: 8
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  })
}

// توابع مدیریت سفارش
const approveOrder = async (orderId) => {
  try {
    await orderStore.updateOrderStatus(orderId, OrderStatus.TENANT_PROCESSING);
  } catch (error) {
    console.error('خطا در تایید سفارش:', error);
  }
};

const rejectOrder = async (orderId) => {
  try {
    await orderStore.updateOrderStatus(orderId, OrderStatus.TENANT_CANCELLED);
  } catch (error) {
    console.error('خطا در رد سفارش:', error);
  }
};

// Watch برای تغییر بازه زمانی
watch(selectedPeriod, () => {
  nextTick(() => {
    initWeeklyChart()
  })
})

onMounted(() => {
  nextTick(() => {
    initWeeklyChart()
  })
})

onUnmounted(() => {
  if (weeklyChart) {
    weeklyChart.destroy()
  }
})
</script>

<style scoped>
.ti {
  font-family: 'tabler-icons' !important;
}
.font-english {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  direction: ltr;
}
</style>