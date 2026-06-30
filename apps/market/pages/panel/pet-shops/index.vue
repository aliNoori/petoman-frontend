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
              ? 'bg-blue-600 text-white shadow-md' 
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
          <p class="text-sm font-bold text-gray-900 font-english">{{ rating.average.toFixed(1) }}/5</p>
        </div>
      </button>
    </div>

    <!-- کارت‌های آماری اصلی -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      <!-- کارت فروش -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-currency-toman text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+{{ stats.salesGrowth }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل فروش</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatNumber(stats.totalSales) }}</p>
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
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatNumber(stats.platformFee) }}</p>
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
              <span class="font-english">+{{ stats.salesGrowth }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">خالص درآمد</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ formatNumber(stats.netIncome) }}</p>
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
              <span class="font-english">+{{ stats.ordersGrowth }}%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل سفارشات</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ stats.totalOrders }}</p>
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
            <i class="ti ti-chart-line text-blue-500"></i>
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

        <!-- پرفروش امروز -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
              <i class="ti ti-star text-white text-2xl"></i>
            </div>
            <span class="text-xs px-2 py-1 bg-amber-500 text-white rounded-full font-medium">داغ</span>
          </div>
          <h4 class="text-sm font-medium text-amber-700 mb-2">پرفروش امروز</h4>
          <div class="space-y-2">
            <div v-for="(product, index) in topProductsToday.slice(0, 3)" :key="index" class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-900 truncate">{{ product.name }}</p>
              </div>
              <span class="text-xs font-bold text-amber-600 font-english">{{ product.sales }}</span>
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

    <!-- پرفروش‌ترین محصولات و سفارشات اخیر -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- پرفروش‌ترین محصولات -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-trophy text-amber-500"></i>
          پرفروش‌ترین محصولات
        </h3>
        <div class="space-y-2">
          <div v-for="(product, index) in topProducts" :key="index" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs flex-shrink-0" :class="[
              index === 0 ? 'bg-amber-100 text-amber-600' : 
              index === 1 ? 'bg-gray-200 text-gray-600' : 
              index === 2 ? 'bg-orange-100 text-orange-600' : 
              'bg-blue-50 text-blue-600'
            ]">
              {{ index + 1 }}
            </div>
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <i :class="[product.icon, 'text-blue-500 text-lg']"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-900">{{ product.name }}</p>
              <p class="text-xs text-gray-500">{{ product.category }}</p>
            </div>
            <div class="text-left flex-shrink-0">
              <p class="text-xs font-bold text-gray-900 font-english" dir="ltr">{{ product.sales.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">فروش</p>
            </div>
          </div>
        </div>
      </div>

      <!-- جدیدترین سفارشات -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-shopping-bag text-blue-500"></i>
          جدیدترین سفارشات
        </h3>
        <div class="space-y-2">
          <div v-for="(order, index) in weeklyOrders" :key="index" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50">
              <i class="ti ti-package text-blue-500 text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-900">{{ order.customer }}</p>
              <p class="text-xs text-gray-500">{{ order.items }}</p>
            </div>
            <div class="text-left flex-shrink-0">
              <p class="text-xs font-bold text-gray-900 font-english" dir="ltr">{{ order.amount.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">تومان</p>
            </div>
            <button 
              @click="showOrderDetails(order)"
              class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center flex-shrink-0"
              title="مشاهده جزئیات"
            >
              <i class="ti ti-eye text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal جزئیات سفارش -->
    <Transition name="fade">
      <div v-if="showOrderModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="showOrderModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold mb-1">جزئیات سفارش</h3>
                <p class="text-sm opacity-90">شماره سفارش: #{{ selectedOrder?.id || '12345' }}</p>
              </div>
              <button @click="showOrderModal = false" class="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <!-- اطلاعات مشتری -->
            <div class="border-b border-gray-200 pb-6">
              <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-user text-blue-500"></i>
                اطلاعات مشتری
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">نام مشتری</p>
                  <p class="text-sm font-semibold text-gray-900">{{ selectedOrder?.customer }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">تاریخ سفارش</p>
                  <p class="text-sm font-semibold text-gray-900">1403/08/04 - 14:23</p>
                </div>
              </div>
            </div>

            <!-- اقلام سفارش -->
            <div class="border-b border-gray-200 pb-6">
              <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-package text-blue-500"></i>
                اقلام سفارش
              </h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-700">{{ selectedOrder?.items }}</p>
              </div>
            </div>

            <!-- اطلاعات مالی -->
            <div>
              <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-receipt text-blue-500"></i>
                اطلاعات مالی
              </h4>
              <div class="space-y-3 bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">مبلغ سفارش</span>
                  <span class="text-sm font-bold text-gray-900 font-english" dir="ltr">{{ selectedOrder?.amount.toLocaleString() }} تومان</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">کارمزد پلتفرم (5%)</span>
                  <span class="text-sm font-semibold text-red-600 font-english" dir="ltr">{{ (selectedOrder?.amount * 0.05).toLocaleString() }} تومان</span>
                </div>
                <div class="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span class="text-sm font-bold text-gray-900">درآمد شما</span>
                  <span class="text-lg font-bold text-green-600 font-english" dir="ltr">{{ (selectedOrder?.amount * 0.95).toLocaleString() }} تومان</span>
                </div>
              </div>
            </div>

            <!-- دکمه‌ها -->
            <div class="flex gap-3 pt-4">
              <button @click="showOrderModal = false" class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                بستن
              </button>
              <button class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                مشاهده کامل
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Modal امتیاز و کارمزد -->
  <Transition name="fade">
    <div v-if="showRatingModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-0 lg:p-4" @click="showRatingModal = false">
      <div class="bg-white lg:rounded-2xl shadow-2xl max-w-md w-full h-full lg:h-auto overflow-y-auto" @click.stop>
        <div class="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 lg:rounded-t-2xl sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <i class="ti ti-award text-3xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold">عملکرد فروشگاه شما</h3>
                <p class="text-sm opacity-90">امتیاز و رتبه‌بندی</p>
              </div>
            </div>
            <button @click="showRatingModal = false" class="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
              <i class="ti ti-x text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- امتیاز و رتبه -->
          <div class="text-center pb-6 border-b border-gray-200">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 mb-4 relative">
              <span class="text-4xl font-bold text-amber-600 font-english">{{ rating.average.toFixed(1) }}</span>
              <div class="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                عالی
              </div>
            </div>
            <div class="flex items-center justify-center gap-1 mb-3">
              <i v-for="star in 5" :key="star" :class="[
                'ti text-3xl',
                star <= Math.floor(rating.average) ? 'ti-star-filled text-amber-500' : 
                star === Math.ceil(rating.average) && rating.average % 1 !== 0 ? 'ti-star-half-filled text-amber-500' : 
                'ti-star text-gray-300'
              ]"></i>
            </div>
            <p class="text-sm text-gray-600 mb-2">بر اساس <span class="font-bold text-gray-900">{{ rating.totalReviews }}</span> نظر مشتریان</p>
            
            <!-- نمایش رتبه -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 mt-2">
              <i class="ti ti-trophy text-amber-600 text-lg"></i>
              <div class="text-right">
                <p class="text-xs text-gray-600">رتبه شما</p>
                <p class="text-sm font-bold text-amber-600">رتبه 12 از 156 فروشگاه</p>
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
                  این امتیازات بر عملکرد فروشگاه شما تاثیر مستقیم دارد. با ارسال به‌موقع سفارشات، رفتار مناسب با مشتریان و ارائه خدمات با کیفیت، امتیاز و رتبه خود را بهبود دهید.
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

          <button @click="showRatingModal = false" class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
            بستن
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { Chart, registerables } from 'chart.js'

definePageMeta({
  layout: 'pet-shop'
})

// Register Chart.js
Chart.register(...registerables)

// Modal جزئیات سفارش
const showOrderModal = ref(false)
const selectedOrder = ref(null)

const showOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

// Modal امتیاز و کارمزد
const showRatingModal = ref(false)
const platformFee = 5 // درصد کارمزد

// فیلتر زمانی
const selectedPeriod = ref('weekly')
const timePeriods = [
  { value: 'weekly', label: 'هفتگی', icon: 'ti ti-calendar-week' },
  { value: 'monthly', label: 'ماهانه', icon: 'ti ti-calendar-month' },
  { value: 'quarterly', label: 'سه‌ماهه', icon: 'ti ti-calendar-stats' }
]

// داده‌های آماری برای هر بازه
const statsData = {
  weekly: {
    totalSales: 7200000,
    platformFee: 7200000 * 0.05,
    netIncome: 7200000 * 0.95,
    totalOrders: 87,
    salesGrowth: 12,
    ordersGrowth: 8
  },
  monthly: {
    totalSales: 28500000,
    platformFee: 28500000 * 0.05,
    netIncome: 28500000 * 0.95,
    totalOrders: 342,
    salesGrowth: 15,
    ordersGrowth: 12
  },
  quarterly: {
    totalSales: 85200000,
    platformFee: 85200000 * 0.05,
    netIncome: 85200000 * 0.95,
    totalOrders: 1024,
    salesGrowth: 18,
    ordersGrowth: 15
  }
}

// آمار فعلی بر اساس بازه انتخابی
const stats = computed(() => statsData[selectedPeriod.value])

// امتیاز فروشگاه
const rating = ref({
  average: 4.5,
  totalReviews: 412
})

// نمودار هفتگی
const weeklyChartCanvas = ref(null)
let weeklyChart = null

// داده‌های 7 روز اخیر
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

const getCurrentMonths = () => {
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  const now = new Date()
  const currentMonth = now.getMonth()
  const result = []
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    result.push(months[monthIndex])
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

// داده‌های نمودار برای بازه‌های مختلف
const chartDataByPeriod = {
  weekly: getDaysOfWeek().map((day, i) => ({ 
    label: day, 
    sales: [950000, 1100000, 980000, 1200000, 1050000, 1300000, 1620000][i] 
  })),
  monthly: getCurrentMonths().map((month, i) => ({ 
    label: month, 
    sales: [3200000, 4100000, 3800000, 4200000, 3900000, 4500000][i] 
  })),
  quarterly: getQuarterMonths().map((month, i) => ({ 
    label: month, 
    sales: [2800000, 3200000, 3500000, 4100000, 3800000, 4200000, 3900000, 4500000, 5200000, 6100000, 7300000, 8520000][i] 
  }))
}

const weeklyData = computed(() => chartDataByPeriod[selectedPeriod.value])

// داده‌های کارت‌های کناری
const newOrders = ref(8)
const shippedOrders = ref(15)
const deliveredOrders = ref(28)
const lowStockItems = ref(9)

const topProductsToday = ref([
  { name: 'قرص استامینوفن', sales: 24 },
  { name: 'شربت سرفه', sales: 18 },
  { name: 'ویتامین D3', sales: 15 }
])

// پرفروش‌ترین محصولات
const topProducts = ref([
  {
    name: 'غذای خشک سگ رویال کنین',
    category: 'غذای حیوانات',
    sales: 145,
    revenue: 43500000,
    icon: 'ti ti-bone'
  },
  {
    name: 'ماسه گربه بنتونیت',
    category: 'لوازم بهداشتی',
    sales: 132,
    revenue: 26400000,
    icon: 'ti ti-box'
  },
  {
    name: 'قلاده و لیش سگ',
    category: 'لوازم جانبی',
    sales: 98,
    revenue: 19600000,
    icon: 'ti ti-leash'
  },
  {
    name: 'اسنک تشویقی گربه',
    category: 'غذای حیوانات',
    sales: 87,
    revenue: 8700000,
    icon: 'ti ti-fish'
  },
  {
    name: 'قفس و لانه همستر',
    category: 'لوازم نگهداری',
    sales: 76,
    revenue: 15200000,
    icon: 'ti ti-home'
  }
])

// جدیدترین سفارشات
const weeklyOrders = ref([
  {
    id: '12458',
    customer: 'علی محمدی',
    items: 'غذای خشک سگ + قلاده',
    amount: 850000
  },
  {
    id: '12457',
    customer: 'سارا احمدی',
    items: 'ماسه گربه + اسنک',
    amount: 450000
  },
  {
    id: '12456',
    customer: 'رضا کریمی',
    items: 'قفس همستر + چرخ',
    amount: 620000
  },
  {
    id: '12455',
    customer: 'مریم رضایی',
    items: 'غذای پرنده + لانه',
    amount: 280000
  },
  {
    id: '12454',
    customer: 'حسین نوری',
    items: 'لوازم آکواریوم',
    amount: 1250000
  }
])

// فرمت کردن اعداد با کاما
const formatNumber = (num) => {
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
  
  // ایجاد gradient برای bar
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

// Watch برای تغییر بازه زمانی
// Watch برای تغییر بازه زمانی
watch(selectedPeriod, () => {
  nextTick(() => {
    initWeeklyChart()
  })
})

onMounted(() => {
  // ایجاد نمودار
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>




