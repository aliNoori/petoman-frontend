<template>
  <div class="space-y-6">
    <!-- فیلتر زمانی -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-4">
      <div class="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base lg:text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-calendar-stats text-teal-500 text-xl"></i>
            بازه زمانی گزارش
          </h2>
          <p class="text-xs text-gray-500 mt-1">انتخاب دوره زمانی مورد نظر</p>
        </div>
        <div class="grid grid-cols-3 gap-2 lg:flex lg:gap-2 w-full lg:w-auto">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="[
              'px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all',
              selectedPeriod === period.value 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            ]"
          >
            <i :class="period.icon + ' ml-1 text-base lg:text-sm'"></i>
            <span class="hidden lg:inline">{{ period.label }}</span>
            <span class="lg:hidden">{{ period.mobileLabel || period.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- کارت‌های آماری -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      <!-- کارت فروش کل -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-currency-toman text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+12%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل فروش</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatMoneyEnglish(stats.totalSales) }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت کارمزد پلتفرم (5%) -->
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
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatMoneyEnglish(stats.platformFee) }}</p>
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
              <span class="font-english">+12%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">خالص درآمد</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatMoneyEnglish(stats.netIncome) }}</p>
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
              <span class="font-english">+15%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل سفارشات</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatMoneyEnglish(stats.totalOrders) }}</p>
            <p class="text-xs text-gray-500">سفارش</p>
          </div>
        </div>
      </div>
    </div>

    <!-- دکمه‌های عملیات -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-file-analytics text-teal-500"></i>
            عملیات گزارش
          </h2>
          <p class="text-xs text-gray-500 mt-1">تولید و دریافت گزارش‌های مختلف</p>
        </div>
        <div class="flex items-center gap-2">
          <button disabled class="px-4 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2 text-sm font-medium shadow-sm opacity-60">
            <i class="ti ti-download"></i>
            دریافت گزارش
          </button>
          <button @click="refreshReports" class="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
            <i class="ti ti-refresh"></i>
            بروزرسانی
          </button>
        </div>
      </div>
    </div>

    <!-- محصولات پرفروش -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-star text-amber-500"></i>
        محصولات پرفروش
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">رتبه</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">محصول</th>
              <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">تعداد فروش</th>
              <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">درآمد</th>
              <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">سهم</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in topProducts" :key="product.name" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" 
                       :class="index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'">
                    {{ index + 1 }}
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-pill text-teal-600 text-lg"></i>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">دسته: دارو</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-sm font-bold text-gray-900 font-english">{{ product.sales }}</span>
                  <span class="text-xs text-gray-500">عدد</span>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-sm font-bold text-teal-600 font-english" dir="ltr">{{ formatMoneyEnglish(product.revenue) }}</span>
                  <span class="text-xs text-gray-500">تومان</span>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <div class="flex-1 max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all" 
                         :style="{ width: product.percentage + '%' }"></div>
                  </div>
                  <span class="text-sm font-semibold text-gray-700 font-english w-12">{{ product.percentage }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- نمودار فروش -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="ti ti-chart-bar text-teal-500"></i>
        نمودار فروش {{ timePeriods.find(p => p.value === selectedPeriod)?.label }}
      </h3>
      <div class="h-96">
        <canvas ref="salesChartCanvas"></canvas>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import * as XLSX from 'xlsx'


// Register Chart.js components
Chart.register(...registerables)

// فیلتر زمانی
const selectedPeriod = ref('monthly')
const timePeriods = [
  { value: 'weekly', label: 'هفتگی', icon: 'ti ti-calendar-week' },
  { value: 'monthly', label: 'ماهانه', icon: 'ti ti-calendar-month' },
  { value: 'quarterly', label: 'سه‌ماهه', icon: 'ti ti-calendar-stats' }
]

// داده‌های مختلف برای هر بازه زمانی
const statsData = {
  weekly: {
    totalOrders: 87,
    totalSales: 7200000,
    platformFee: 7200000 * 0.05,
    netIncome: 7200000 * 0.95,
    totalProducts: 320,
    averageOrder: 82758
  },
  monthly: {
    totalOrders: 342,
    totalSales: 28500000,
    platformFee: 28500000 * 0.05,
    netIncome: 28500000 * 0.95,
    totalProducts: 1250,
    averageOrder: 83275
  },
  quarterly: {
    totalOrders: 1024,
    totalSales: 85200000,
    platformFee: 85200000 * 0.05,
    netIncome: 85200000 * 0.95,
    totalProducts: 3750,
    averageOrder: 83203
  }
}

// آمار فعلی بر اساس بازه انتخابی
const stats = computed(() => statsData[selectedPeriod.value])

// تاریخ واقعی - 6 ماه اخیر
const getCurrentMonths = () => {
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  const now = new Date()
  const currentMonth = now.getMonth() // 0-11
  const result = []
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    result.push(months[monthIndex])
  }
  
  return result
}

const getDaysOfWeek = () => {
  const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
  const today = new Date().getDay()
  const result = []
  for (let i = 6; i >= 0; i--) {
    const dayIndex = (today - i + 7) % 7
    result.push(days[dayIndex])
  }
  return result
}

const getQuarterMonths = () => {
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  const now = new Date()
  const currentMonth = now.getMonth()
  const result = []
  
  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    result.push(months[monthIndex])
  }
  
  return result
}

// داده‌های فروش برای بازه‌های مختلف
const salesDataByPeriod = {
  weekly: getDaysOfWeek().map((day, i) => ({ 
    label: day, 
    amount: [950000, 1100000, 980000, 1200000, 1050000, 1300000, 1620000][i] 
  })),
  monthly: getCurrentMonths().map((month, i) => ({ 
    label: month, 
    amount: [3200000, 4100000, 3800000, 4200000, 3900000, 4500000][i] 
  })),
  quarterly: getQuarterMonths().map((month, i) => ({ 
    label: month, 
    amount: [2800000, 3200000, 3500000, 4100000, 3800000, 4200000, 3900000, 4500000, 5200000, 6100000, 7300000, 8520000][i] 
  }))
}

const monthlySales = computed(() => salesDataByPeriod[selectedPeriod.value])

const salesChartCanvas = ref(null)
let salesChart = null

const topProducts = ref([
  { name: 'آمپول ویتامین B12', sales: 145, revenue: 2900000, percentage: 12 },
  { name: 'قرص آنتی‌بیوتیک', sales: 98, revenue: 1960000, percentage: 8 },
  { name: 'سیراپ سرفه', sales: 87, revenue: 1740000, percentage: 7 },
  { name: 'کرم ضدآفتاب', sales: 76, revenue: 1520000, percentage: 6 },
  { name: 'ویتامین D3', sales: 65, revenue: 1300000, percentage: 5 }
])

const salesByCategory = ref([
  { name: 'داروهای عمومی', sales: 245, revenue: 12250000, percentage: 43, color: 'bg-blue-500' },
  { name: 'ویتامین‌ها', sales: 189, revenue: 9450000, percentage: 33, color: 'bg-green-500' },
  { name: 'لوازم پزشکی', sales: 98, revenue: 4900000, percentage: 17, color: 'bg-purple-500' },
  { name: 'بهداشت و مراقبت', sales: 67, revenue: 3350000, percentage: 7, color: 'bg-yellow-500' }
])

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const formatMoneyEnglish = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

// Initialize Chart
const initSalesChart = () => {
  if (!salesChartCanvas.value) return
  
  // Destroy existing chart if any
  if (salesChart) {
    salesChart.destroy()
  }
  
  const ctx = salesChartCanvas.value.getContext('2d')
  const periodLabel = timePeriods.find(p => p.value === selectedPeriod.value)?.label || 'ماهانه'
  
  // ایجاد gradient برای bar
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(20, 184, 166, 0.9)')
  gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.6)')
  gradient.addColorStop(1, 'rgba(20, 184, 166, 0.3)')
  
  const salesData = monthlySales.value.map(m => m.amount)
  
  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthlySales.value.map(m => m.label),
      datasets: [{
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
      }]
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
              return 'فروش: ' + formatMoney(context.parsed.y) + ' تومان'
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

// Watch برای تغییر بازه زمانی
watch(selectedPeriod, () => {
  nextTick(() => {
    initSalesChart()
  })
})

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initSalesChart()
  })
})

onUnmounted(() => {
  if (salesChart) {
    salesChart.destroy()
  }
})

const exportToExcel = () => {
  try {
    // تاریخ برای نام فایل
    const date = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')
    
    // ایجاد Workbook
    const wb = XLSX.utils.book_new()
    
    // صفحه 1: آمار کلی
    const statsData = [
      ['گزارش فروش داروخانه پتومن'],
      ['تاریخ گزارش: ' + date],
      [],
      ['آمار کلی'],
      ['عنوان', 'مقدار'],
      ['کل سفارشات', stats.value.totalOrders],
      ['کل فروش (تومان)', stats.value.totalSales],
      ['کارمزد پلتفرم 5% (تومان)', stats.value.platformFee],
      ['خالص درآمد (تومان)', stats.value.netIncome],
      ['محصولات فروخته شده', stats.value.totalProducts],
      ['میانگین سفارش (تومان)', stats.value.averageOrder],
    ]
    
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData)
    
    // عرض ستون‌ها
    statsSheet['!cols'] = [
      { wch: 30 },
      { wch: 20 }
    ]
    
    XLSX.utils.book_append_sheet(wb, statsSheet, 'آمار کلی')
    
    // صفحه 2: فروش بر اساس بازه زمانی
    const periodLabel = timePeriods.find(p => p.value === selectedPeriod.value)?.label || 'ماهانه'
    const monthlyData = [
      [`فروش ${periodLabel}`],
      [],
      ['دوره', 'مبلغ فروش (تومان)'],
      ...monthlySales.value.map(m => [m.label, m.amount])
    ]
    
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData)
    monthlySheet['!cols'] = [
      { wch: 20 },
      { wch: 20 }
    ]
    
    XLSX.utils.book_append_sheet(wb, monthlySheet, 'فروش ماهانه')
    
    // صفحه 3: محصولات پرفروش
    const productsData = [
      ['محصولات پرفروش'],
      [],
      ['نام محصول', 'تعداد فروش', 'درآمد (تومان)', 'درصد'],
      ...topProducts.value.map(p => [p.name, p.sales, p.revenue, p.percentage + '%'])
    ]
    
    const productsSheet = XLSX.utils.aoa_to_sheet(productsData)
    productsSheet['!cols'] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 10 }
    ]
    
    XLSX.utils.book_append_sheet(wb, productsSheet, 'محصولات پرفروش')
    
    // صفحه 4: دسته‌بندی
    const categoryData = [
      ['فروش بر اساس دسته‌بندی'],
      [],
      ['دسته‌بندی', 'تعداد فروش', 'درآمد (تومان)', 'درصد'],
      ...salesByCategory.value.map(c => [c.name, c.sales, c.revenue, c.percentage + '%'])
    ]
    
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData)
    categorySheet['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 10 }
    ]
    
    XLSX.utils.book_append_sheet(wb, categorySheet, 'دسته‌بندی')
    
    // دانلود فایل
    XLSX.writeFile(wb, `گزارش-فروش-${date}.xlsx`)
    
    console.log('Excel file downloaded successfully')
    
  } catch (error) {
    console.error('Error creating Excel file:', error)
    alert('خطا در ساخت فایل اکسل')
  }
}

const exportReport = () => {
  exportToExcel()
}

const refreshReports = () => {
  console.log('Refreshing reports data...')
  setTimeout(() => {
    initSalesChart()
    initCategoryChart()
    console.log('Reports refreshed')
  }, 500)
}
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
