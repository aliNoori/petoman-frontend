<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div
              class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
            <i class="ti ti-shopping-cart text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">کل سفارشات</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">
            {{ orderStore.stats?.totalOrders || mappedOrders.length }}</h3>
          <p class="text-xs text-gray-500 mt-1">در سیستم</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div
              class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
            <i class="ti ti-clock text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">در انتظار</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ pendingCount }}</h3>
          <p class="text-xs text-gray-500 mt-1">نیاز به بررسی</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppSelect
            v-model="filters.status"
            :options="statusOptions"
            label="وضعیت"
            placeholder="همه"
        />
        <div class="sm:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
                v-model="filters.search"
                type="text"
                placeholder="کد سفارش، نام مشتری..."
                class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">کد سفارش</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مشتری</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">اقلام</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">زمان تحویل</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">روش ارسال</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مبلغ</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">وضعیت</th>
            <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <span class="font-mono font-bold text-gray-900">{{ order.code }}</span>
            </td>
            <td class="px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">{{ order.owner }}</p>
                <p class="text-xs text-gray-500">{{ order.phone || '---' }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-700 max-w-[200px] truncate">{{ order.items }}</p>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col text-sm">
                <span class="text-gray-900 font-medium">{{ order.deliveryDateFa }}</span>
                <span class="text-xs text-gray-500">{{ order.deliveryTime }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ getShippingMethod(order) }}
            </td>
            <td class="px-6 py-4">
              <span class="font-bold text-gray-900">{{ formatPrice(order.total) }}</span>
              <span class="text-xs text-gray-500 mr-1">تومان</span>
            </td>
            <td class="px-6 py-4">
              <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
              >
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <button @click="viewOrder(order)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="مشاهده">
                  <i class="ti ti-eye text-gray-600"></i>
                </button>

                <!-- دکمه تایید -->
                <button
                    v-if="order.status === 'CUSTOMER_PAID'"
                    @click="confirmOrder(order)"
                    class="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                    title="تایید و شروع پردازش"
                >
                  <i class="ti ti-check"></i>
                </button>

                <!-- دکمه ارسال -->
                <button
                    v-if="order.status === 'TENANT_PROCESSING'"
                    @click="openShippingModal(order)"
                    class="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                    title="ثبت کد رهگیری و ارسال"
                >
                  <i class="ti ti-truck"></i>
                </button>

                <!-- دکمه لغو سفارش (در مراحل قبل از ارسال نهایی) -->
                <button
                    v-if="order.status === 'CUSTOMER_PAID' || order.status === 'TENANT_PROCESSING'"
                    @click="handleCancelOrder(order)"
                    class="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                    title="لغو سفارش"
                >
                  <i class="ti ti-x"></i>
                </button>

                <!-- دکمه لغو ارسال (وقتی سفارش ارسال شده است) -->
                <button
                    v-if="order.status === 'TENANT_SHIPPED'"
                    @click="handleCancelShipment(order)"
                    class="p-2 hover:bg-orange-100 rounded-lg transition-colors text-orange-600"
                    title="لغو ارسال پستی"
                >
                  <i class="ti ti-ban"></i>
                </button>

              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-100">
        <div v-for="order in filteredOrders" :key="order.id" class="p-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="font-mono font-bold text-gray-900">{{ order.code }}</span>
              <p class="font-medium text-gray-900 mt-1">{{ order.owner }}</p>
            </div>
            <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-3 line-clamp-1">{{ order.items }}</p>
          <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div class="bg-gray-50 p-2 rounded-lg">
              <p class="text-xs text-gray-500">زمان تحویل</p>
              <p class="font-medium text-gray-800">{{ order.deliveryDateFa }}</p>
              <p class="text-xs text-gray-500">{{ order.deliveryTime }}</p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <p class="text-xs text-gray-500">روش ارسال</p>
              <p class="font-medium text-gray-800">{{ getShippingMethod(order) }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-900">{{ formatPrice(order.total) }} تومان</span>
            <div class="flex items-center gap-2">
              <button @click="viewOrder(order)" class="p-2 bg-gray-100 rounded-lg">
                <i class="ti ti-eye text-gray-600"></i>
              </button>

              <!-- دکمه تایید -->
              <button
                  v-if="order.status === 'CUSTOMER_PAID'"
                  @click="confirmOrder(order)"
                  class="p-2 bg-green-100 rounded-lg text-green-600"
              >
                <i class="ti ti-check"></i>
              </button>

              <!-- دکمه ارسال -->
              <button
                  v-if="order.status === 'TENANT_PROCESSING'"
                  @click="openShippingModal(order)"
                  class="p-2 bg-blue-100 rounded-lg text-blue-600"
              >
                <i class="ti ti-truck"></i>
              </button>

              <!-- دکمه لغو سفارش -->
              <button
                  v-if="order.status === 'CUSTOMER_PAID' || order.status === 'TENANT_PROCESSING'"
                  @click="handleCancelOrder(order)"
                  class="p-2 bg-red-100 rounded-lg text-red-600"
              >
                <i class="ti ti-x"></i>
              </button>

              <!-- دکمه لغو ارسال -->
              <button
                  v-if="order.status === 'TENANT_SHIPPED'"
                  @click="handleCancelShipment(order)"
                  class="p-2 bg-orange-100 rounded-lg text-orange-600"
              >
                <i class="ti ti-ban"></i>
              </button>

            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0 && !orderStore.loading" class="p-12 text-center">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-shopping-cart-off text-4xl text-gray-400"></i>
        </div>
        <p class="text-gray-600 font-medium">سفارشی یافت نشد</p>
        <p class="text-sm text-gray-500">فیلترها را تغییر دهید</p>
      </div>

      <!-- Pagination -->
      <div v-if="orderStore.pagination.totalPages > 1"
           class="p-4 border-t border-gray-200 flex items-center justify-between">
        <button
            @click="changePage(orderStore.pagination.page - 1)"
            :disabled="orderStore.pagination.page === 1"
            class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          قبلی
        </button>
        <span class="text-sm text-gray-600">
          صفحه {{ orderStore.pagination.page }} از {{ orderStore.pagination.totalPages }}
        </span>
        <button
            @click="changePage(orderStore.pagination.page + 1)"
            :disabled="orderStore.pagination.page === orderStore.pagination.totalPages"
            class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          بعدی
        </button>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal && selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeOrderModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 class="text-lg font-bold text-gray-900">جزئیات سفارش</h3>
            <p class="text-sm text-gray-500">کد: {{ selectedOrder.code }}</p>
          </div>
          <button @click="closeOrderModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-x text-xl text-gray-500"></i>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <!-- Status -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span class="text-gray-600">وضعیت:</span>
            <span class="px-3 py-1 rounded-lg text-sm font-bold" :class="getStatusClass(selectedOrder.status)">
              {{ getStatusText(selectedOrder.status) }}
            </span>
          </div>
          <!-- Customer Info -->
          <div class="p-4 bg-blue-50 rounded-xl space-y-3">
            <h4 class="font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-user text-blue-600"></i>
              اطلاعات مشتری
            </h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-500">نام:</span>
                <span class="font-medium text-gray-900 mr-2">{{ selectedOrder.owner }}</span>
              </div>
              <div>
                <span class="text-gray-500">تلفن:</span>
                <span class="font-medium text-gray-900 mr-2 font-mono">{{ selectedOrder.phone || '---' }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-gray-500">آدرس:</span>
                <span class="font-medium text-gray-900 mr-2">
                  {{ selectedOrder.address?.road }} .
                  {{ selectedOrder.address?.town }} .
                  {{ selectedOrder.address?.state }}
                </span>
              </div>
            </div>
          </div>
          <!-- Delivery Info (New) -->
          <div class="p-4 bg-indigo-50 rounded-xl space-y-3">
            <h4 class="font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-clock-hour-4 text-indigo-600"></i>
              زمان و نحوه ارسال
            </h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-500">تاریخ تحویل:</span>
                <span class="font-medium text-gray-900 mr-2">{{ selectedOrder.deliveryDateFa }}</span>
              </div>
              <div>
                <span class="text-gray-500">بازه زمانی:</span>
                <span class="font-medium text-gray-900 mr-2">{{ selectedOrder.deliveryTime }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-gray-500">روش ارسال:</span>
                <span class="font-medium text-gray-900 mr-2">{{ getShippingMethod(selectedOrder) }}</span>
              </div>
            </div>
          </div>
          <!-- Items -->
          <div class="p-4 bg-purple-50 rounded-xl space-y-3">
            <h4 class="font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-shopping-bag text-purple-600"></i>
              اقلام سفارش
            </h4>
            <p class="text-gray-700">{{ selectedOrder.items }}</p>
          </div>
          <!-- Price -->
          <div class="p-4 bg-teal-50 rounded-xl space-y-3">
            <h4 class="font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-receipt text-teal-600"></i>
              اطلاعات مالی
            </h4>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">مبلغ کل:</span>
              <span class="text-xl font-bold text-teal-700">{{ formatPrice(selectedOrder.total) }} تومان</span>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center gap-3 rounded-b-2xl">
          <button
              v-if="selectedOrder.status === 'CUSTOMER_PAID'"
              @click="confirmOrder(selectedOrder); closeOrderModal()"
              class="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-colors"
          >
            <i class="ti ti-check ml-2"></i>
            تایید سفارش
          </button>

          <button
              v-if="selectedOrder.status === 'TENANT_PROCESSING'"
              @click="openShippingModal(selectedOrder);closeOrderModal()"
              class="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
          >
            <i class="ti ti-truck ml-2"></i>
            ثبت کد رهگیری و ارسال
          </button>

          <!-- دکمه لغو سفارش در مودال جزئیات -->
          <button
              v-if="selectedOrder.status === 'CUSTOMER_PAID' || selectedOrder.status === 'TENANT_PROCESSING'"
              @click="handleCancelOrder(selectedOrder); closeOrderModal()"
              class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
          >
            <i class="ti ti-x ml-2"></i>
            لغو سفارش
          </button>

          <!-- دکمه لغو ارسال در مودال جزئیات -->
          <button
              v-if="selectedOrder.status === 'TENANT_SHIPPED'"
              @click="handleCancelShipment(selectedOrder); closeOrderModal()"
              class="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors"
          >
            <i class="ti ti-ban ml-2"></i>
            لغو ارسال
          </button>

          <button
              @click="closeOrderModal"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>

    <!-- Shipping Modal -->
    <div v-if="showShippingModal && shippingOrderData" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeShippingModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="bg-blue-600 p-6 text-white">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <i class="ti ti-truck-delivery"></i>
            ارسال سفارش
          </h3>
          <p class="text-blue-100 text-sm mt-1">ثبت کد رهگیری برای مشتری</p>
        </div>
        <div class="p-6 space-y-4">
          <!-- Order Info -->
          <div class="flex items-center justify-between border-b pb-4">
            <div>
              <p class="text-sm text-gray-500">کد سفارش</p>
              <p class="font-bold text-gray-900">{{ shippingOrderData.code }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm text-gray-500">مبلغ</p>
              <p class="font-bold text-gray-900">{{ formatPrice(shippingOrderData.total) }} <span
                  class="text-xs">تومان</span></p>
            </div>
          </div>

          <!-- نمایش وضعیت الوپیک اگر وجود داشته باشد -->
          <div v-if="alopeykStatus" class="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-2">
            <h4 class="font-bold text-indigo-900 flex items-center gap-2">
              <i class="ti ti-truck-delivery"></i>
              وضعیت در الوپیک
            </h4>
            <div class="flex items-center justify-between text-sm">
              <span class="text-indigo-700">وضعیت:</span>
              <span class="font-bold text-indigo-900" :class="getAlopeykStatusColor(alopeykStatus)">
                {{ getAlopeykStatusText(alopeykStatus) }}
              </span>
            </div>
            <div v-if="alopeykStatus === 'accepted' || alopeykStatus === 'picking' || alopeykStatus === 'delivering'"
                 class="text-xs text-indigo-600 mt-1">
              پیک در حال انجام ماموریت است.
            </div>
            <p v-if="['cancelled', 'expired', 'finished'].includes(alopeykStatus)" class="text-xs text-indigo-600 mt-1">
              این سفارش قبلاً درخواست شده است. برای ارسال مجدد دکمه پایین را بزنید.
            </p>
          </div>

          <!-- Shipping Details Display -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-500 uppercase">روش ارسال</span>
              <div class="flex items-center gap-2">
                <span class="font-bold text-blue-700">{{ getShippingMethod(shippingOrderData) }}</span>
                <!-- دکمه ثبت در الوپیک -->
                <button
                    v-if="isApiSupportedShipping(shippingOrderData) && !alopeykStatus"
                    @click="requestFromShippingAPI"
                    type="button"
                    :disabled="isApiLoading"
                    class="text-xs bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-200 disabled:cursor-not-allowed text-indigo-700 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                >
                  <i v-if="isApiLoading" class="ti ti-loader animate-spin"></i>
                  <i v-else class="ti ti-robot"></i>
                  ثبت در {{ getShippingMethod(shippingOrderData) }}
                </button>
                <button
                    v-if="isApiSupportedShipping(shippingOrderData) && ['cancelled', 'expired', 'finished'].includes(alopeykStatus)"
                    @click="retryAlopeykRequest"
                    type="button"
                    :disabled="isApiLoading"
                    class="text-xs bg-emerald-100 hover:bg-emerald-200 disabled:bg-gray-200 disabled:cursor-not-allowed text-emerald-700 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                >
                  <i v-if="isApiLoading" class="ti ti-loader animate-spin"></i>
                  <i v-else class="ti ti-refresh-dot"></i>
                  ارسال مجدد در {{ getShippingMethod(shippingOrderData) }}
                </button>
              </div>
            </div>
            <!-- سایر فیلدها (تاریخ، زمان) بدون تغییر -->
            <div class="h-px bg-gray-200"></div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-500 uppercase">تاریخ تحویل</span>
              <span class="font-medium text-gray-800">{{ shippingOrderData.deliveryDateFa }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-500 uppercase">بازه زمانی</span>
              <span class="font-medium text-gray-800">{{ shippingOrderData.deliveryTime }}</span>
            </div>
          </div>

          <!-- Tracking Code Input -->
          <!-- این ورودی فقط زمانی نمایش داده شود که وضعیت الوپیک وجود نداشته باشد -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کد پیگیری / باربری</label>
            <input
                v-model="trackingCode"
                type="text"
                placeholder="کد رهگیری به صورت خودکار از الوپیک دریافت می‌شود..."
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center font-mono text-lg tracking-widest bg-gray-50 text-gray-500"
                readonly
            />
            <p class="text-xs text-gray-500 mt-2">
              <i class="ti ti-info-circle"></i>
              برای دریافت کد رهگیری، دکمه "ثبت در {{ getShippingMethod(shippingOrderData) }}" را کلیک کنید.
            </p>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <!-- دکمه تایید و ارسال نهایی فقط زمانی که وضعیت الوپیک وجود ندارد -->
          <!-- دکمه تایید و ارسال نهایی -->
          <button
              @click="submitShipping"
              :disabled="!trackingCode"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30"
          >
            تایید و ارسال نهایی
          </button>

          <button
              @click="closeShippingModal"
              class="px-4 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-colors"
          >
            {{ alopeykStatus ? 'بستن' : 'انصراف' }}
          </button>

          <!-- دکمه لغو ارسال پستی -->
          <!-- فقط زمانی نمایش داده شود که وضعیت الوپیک وجود داشته باشد و اجازه لغو بدهد -->
          <button
              v-if="alopeykStatus && canCancelShipment(alopeykStatus)"
              @click="handleCancelShipment(shippingOrderData)"
              :disabled="orderStore.loading"
              class="px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <i class="ti ti-ban"></i>
            {{ orderStore.loading ? 'در حال لغو...' : 'لغو ارسال پستی' }}
          </button>

          <p v-else-if="shippingOrderData.metadata?.cancelledByService">
            این سفارش توسط سرویس پستی لغو شده است.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {OrderStatus, useOrderStore} from "@/stores/market/order.js"
import AppSelect from '@/components/AppSelect.vue'
import {storeToRefs} from "pinia"
import {useAuthStore} from "@/stores/auth.js"

const authStore = useAuthStore()
const {tenant} = storeToRefs(authStore)
const router = useRouter()
const orderStore = useOrderStore()

onMounted(() => {
  orderStore.fetchMarketOrders(1, 10)
})
onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
});

const filters = ref({
  status: '',
  search: ''
})

const showOrderModal = ref(false)
const selectedOrder = ref(null)

// Shipping Modal State
const showShippingModal = ref(false)
const shippingOrderData = ref(null)
const trackingCode = ref(null)
const alopeykStatus = ref('new') // وضعیت الوپیک

const statusOptions = [
  {value: '', label: 'همه', icon: 'ti ti-list'},
  {value: 'CUSTOMER_PENDING', label: 'در انتظار', icon: 'ti ti-clock', iconColor: 'text-orange-500'},
  {value: 'CUSTOMER_PAID', label: 'پرداخت شده', icon: 'ti ti-credit-card', iconColor: 'text-blue-500'},
  {value: 'TENANT_PROCESSING', label: 'در حال پردازش', icon: 'ti ti-loader', iconColor: 'text-yellow-500'},
  {value: 'TENANT_SHIPPED', label: 'ارسال شده', icon: 'ti ti-truck', iconColor: 'text-purple-500'},
  {value: 'CUSTOMER_DELIVERED', label: 'تحویل شده', icon: 'ti ti-circle-check', iconColor: 'text-green-500'},
  {value: 'CUSTOMER_CANCELLED', label: 'لغو شده', icon: 'ti ti-x', iconColor: 'text-red-500'}
]

const mappedOrders = computed(() => {
  return orderStore.orders.map(order => {
    const code = order.orderCode || `ORD-${order.id.slice(-6).toUpperCase()}`
    const owner = order.user?.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'نامشخص'
    const items = order.items?.map(item => item.name || item.marketProduct?.product?.name).join('، ') || 'بدون اقلام'
    const total = order.totalAmount || 0

    // استخراج اطلاعات متادیتا
    const metadata = order.metadata || {}

    // تبدیل تاریخ میلادی به شمسی برای نمایش
    let deliveryDateFa = 'نامشخص'
    if (metadata.deliveryDate) {
      try {
        deliveryDateFa = new Date(metadata.deliveryDate).toLocaleDateString('fa-IR')
      } catch (e) {
        deliveryDateFa = metadata.deliveryDate
      }
    }

    return {
      ...order,
      code,
      owner,
      items,
      total,
      phone: order.user?.phoneNumber,
      address: order.address?.detailedAddress,
      metadata: metadata,
      deliveryDateFa: deliveryDateFa,
      deliveryTime: metadata.deliveryTime || '---'
    }
  })
})

// بررسی امکان لغو ارسال پستی بر اساس وضعیت الوپیک
const canCancelShipment = (status) => {
  // وضعیت‌هایی که قابل لغو هستند: New, Searching, Expired
  const cancelableStatuses = ['new', 'searching', 'expired'];
  return cancelableStatuses.includes(status);
};

// ترجمه وضعیت الوپیک به فارسی
const getAlopeykStatusText = (status) => {
  // اگر ورودی نبود، خود وضعیت را برگردان
  if (!status) return status;

  // تبدیل ورودی به حروف کوچک برای جستجوی یکتا
  const key = status.toLowerCase();

  const texts = {
    'new': 'جدید',
    'scheduled': 'ارسال در زمان تعیین شده',
    'searching': 'در حال جستجوی پیک',
    'expired': 'منقضی شده',
    'accepted': 'پذیرفته شده',
    'picking': 'جمع‌آوری',
    'delivering': 'در حال ارسال',
    'delivered': 'تحویل شده',
    'finished': 'تکمیل شده',
    'cancelled': 'لغو شده'
  };

  return texts[key] || status; // اگر پیدا نشد، همان متن اصلی را برمی‌گرداند
};

// رنگ وضعیت الوپیک
const getAlopeykStatusColor = (status) => {
  // اگر ورودی نبود، رنگ پیش‌فرض خاکستری
  if (!status) return 'text-gray-600';

  // تبدیل ورودی به حروف کوچک برای جستجوی یکتا
  const key = status.toLowerCase();

  const colors = {
    'new': 'text-blue-600',
    'scheduled': 'text-yellow-600',
    'searching': 'text-yellow-600',
    'expired': 'text-red-600',
    'accepted': 'text-green-600',
    'picking': 'text-purple-600',
    'delivering': 'text-indigo-600',
    'delivered': 'text-green-700',
    'finished': 'text-green-700',
    'cancelled': 'text-red-600'
  };

  return colors[key] || 'text-gray-600';
};
// متغیر برای ذخیره ایندکس تایمر
let statusCheckInterval = null;
// متد برای چک کردن مداوم وضعیت
const startStatusPolling = (orderId) => {
  // اگر تایمر قبلی وجود دارد، آن را پاک کن
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }

  // چک کردن هر 30 ثانیه
  statusCheckInterval = setInterval(async () => {
    if (!showShippingModal.value) {
      // اگر مودال بسته شد، تایمر را متوقف کن
      clearInterval(statusCheckInterval);
      return;
    }

    try {
      const status = await orderStore.checkAlopeykStatus(orderId);
      alopeykStatus.value = status.status;

      // اگر وضعیت Finished شد، تایمر را متوقف کن و مودال را ببند
      if (status.status === 'finished') {
        clearInterval(statusCheckInterval);
        closeShippingModal();
        alert('سفارش توسط پیک تحویل داده شد و در سیستم ثبت گردید.');
      }
    } catch (error) {
      console.error('Error polling status:', error);
    }
  }, 30000); // 30000 میلی‌ثانیه = 30 ثانیه
};

// لغو سفارش توسط فروشنده (در مراحل اولیه)
const handleCancelOrder = async (order) => {
  const confirmCancel = confirm('آیا از لغو این سفارش اطمینان دارید؟');
  if (!confirmCancel) return;

  try {
    const res = await orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_CANCELLED);
    if (typeof window.showToast === 'function') {
      window.showToast(res.message, 'success', 5000);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    //alert('خطا در لغو سفارش.');
    if (typeof window.showToast === 'function') {
      window.showToast(error.response.data.message, 'warning', 5000);
    }
  }
};

// لغو ارسال توسط فروشنده (بعد از ارسال)
const handleCancelShipment = async (order) => {
  const confirmCancel = confirm('آیا از لغو ارسال این سفارش اطمینان دارید؟ در صورتی که پیک سفارش را پذیرفته باشد، ممکن است لغو با خطا مواجه شود.');
  if (!confirmCancel) return;

  try {
    const success = await orderStore.cancelShipment(order.id);
    if (success) {
      alert('سفارش با موفقیت از الوپیک لغو شد.');
      alopeykStatus.value = 'cancelled'; // به‌روزرسانی وضعیت لوکال
      const res = await orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_PROCESSING);
      trackingCode.value = null
      closeShippingModal();
    }
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    alert('خطا در لغو ارسال. ممکن است پیک سفارش را پذیرفته باشد.');
  }
};

const filteredOrders = computed(() => {
  return mappedOrders.value.filter(order => {
    if (filters.value.status && order.status !== filters.value.status) return false
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      if (!order.code.toLowerCase().includes(search) &&
          !order.owner.toLowerCase().includes(search) &&
          !order.items.toLowerCase().includes(search)) {
        return false
      }
    }
    return true
  })
})

const pendingCount = computed(() => {
  return mappedOrders.value.filter(o => o.status === 'CUSTOMER_PAID').length
})

const getStatusText = (status) => {
  const texts = {
    'CUSTOMER_PENDING': 'در انتظار پرداخت',
    'CUSTOMER_PAID': 'پرداخت شده(در انتظار تایید)',
    'TENANT_PROCESSING': 'در حال پردازش',
    'TENANT_SHIPPED': 'ارسال شده',
    'CUSTOMER_DELIVERED': 'تحویل شده',
    'CUSTOMER_CANCELLED': 'لغو شده توسط کاربر',
    'TENANT_CANCELLED': 'لغو شده توسط قروشگاه'
  }
  return texts[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'CUSTOMER_PENDING': 'bg-orange-100 text-orange-700',
    'CUSTOMER_PAID': 'bg-blue-100 text-blue-700',
    'TENANT_PROCESSING': 'bg-yellow-100 text-yellow-700',
    'TENANT_SHIPPED': 'bg-purple-100 text-purple-700',
    'CUSTOMER_DELIVERED': 'bg-green-100 text-green-700',
    'CUSTOMER_CANCELLED': 'bg-red-100 text-red-700',
    'TENANT_CANCELLED': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const getShippingMethod = (order) => {
  if (order.metadata && order.metadata.shippingMethod) {
    // ترجمه نام روش ارسال برای نمایش زیباتر
    const methods = {
      'petomanCourier': 'پیک پتومن',
      'scheduled': 'تحویل زمان‌بندی شده',
      'post': 'پست پیشتاز',
      'tipax': 'تیپاکس',
      'alopeyk':'الوپیک',
      'shopCourier': 'پیک فروشگاه',
      'inPerson': 'دریافت حضوری'
    }
    return methods[order.metadata.shippingMethod] || order.metadata.shippingMethod
  }
  return 'پست پیشتاز'
}

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= orderStore.pagination.totalPages) {
    orderStore.fetchMarketOrders(newPage, 10);
  }
};

const viewOrder = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

const confirmOrder = (order) => {
  orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_PROCESSING)
}

// مدیریت مودال ارسال
const openShippingModal = async (order) => {
  shippingOrderData.value = order;
  trackingCode.value = ''
  alopeykStatus.value = null // ریست کردن وضعیت الوپیک
  showShippingModal.value = true

  // اگر سفارش قبلاً در الوپیک ثبت شده، وضعیت آن را استعلام بگیر
  if (order.metadata?.alopeykOrderId) {
    try {
      const status = await orderStore.checkAlopeykStatus(order.id);
      alopeykStatus.value = status.status; // فرض بر این است که وضعیت در فیلد status برگردانده می‌شود

      // اگر وضعیت Finished بود، مودال را ببند و لیست را رفرش کن
      if (status.status === 'finished') {
        closeShippingModal();
      } else {
        // شروع چک کردن وضعیت هر 30 ثانیه یکبار
        startStatusPolling(order.id);
      }
    } catch (error) {
      console.error('Error fetching alopeyk status:', error);
      // اگر خطا داد، وضعیت را خالی می‌گذاریم
    }
  }
}

const closeShippingModal = () => {
  showShippingModal.value = false

  setTimeout(() => {
    shippingOrderData.value = null;
    trackingCode.value = '';
    alopeykStatus.value = null;
  }, 300);
}

// اضافه کردن متغیر وضعیت لودینگ برای درخواست API
const isApiLoading = ref(false)

// متد کمکی برای تشخیص پشتیبانی از API
const isApiSupportedShipping = (order) => {
  const method = order.metadata?.shippingMethod?.toLowerCase()
  return method === 'tipax' || method === 'alopeyk'
}
// متد جدید برای ارسال مجدد درخواست به الوپیک
const retryAlopeykRequest = async () => {
  if (!shippingOrderData.value) return;
  const provider = shippingOrderData.value.metadata?.shippingMethod;

  if (!confirm(`آیا می‌خواهید درخواست ارسال مجدد را برای ${provider} ثبت کنید؟`)) return;

  try {
    isApiLoading.value = true;

    const result = await orderStore.requestShipment(shippingOrderData.value.id, provider, tenant.value);

    if (result.trackingCode) {
      trackingCode.value = result.trackingCode;
      // فرض می‌کنیم وضعیت جدید 'Searching' یا 'New' است
      alopeykStatus.value = 'new';

      // شروع پولینگ برای وضعیت جدید
      if (statusCheckInterval) clearInterval(statusCheckInterval);
      startStatusPolling(shippingOrderData.value.id);

      if (typeof window.showToast === 'function') {
        window.showToast(`درخواست ارسال مجدد ثبت شد. کد رهگیری: ${result.trackingCode}`, 'success', 5000);
      }
    } else {
      if (typeof window.showToast === 'function') {
        window.showToast('درخواست ثبت شد اما کدی دریافت نشد.', 'warning', 5000);
      }
    }
  } catch (error) {
    console.error('Retry API Error:', error);
    if (typeof window.showToast === 'function') {
      window.showToast('خطا در ثبت درخواست مجدد.', 'error', 5000);
    }
  } finally {
    isApiLoading.value = false;
  }
};

// متد جدید برای درخواست به وب سرویس
const requestFromShippingAPI = async () => {
  if (!shippingOrderData.value) return
  const provider = shippingOrderData.value.metadata?.shippingMethod
  if (!confirm(`آیا می‌خواهید درخواست ارسال از طریق ${provider} ثبت کنید؟`)) return
  try {
    isApiLoading.value = true
    // فراخوانی اکشن استور برای اتصال به وب سرویس
    const result = await orderStore.requestShipment(shippingOrderData.value.id, provider, tenant.value)
    // اگر کد رهگیری از وب سرویس برگشت، آن را در اینپوت قرار بده

    if (result.trackingCode) {

      trackingCode.value = result.trackingCode

      // دریافت وضعیت الوپیک
      const status = await orderStore.checkAlopeykStatus(shippingOrderData.value.id, result.alopeykOrderId);

      alopeykStatus.value = status.status;
      //alert(`کد رهگیری از ${provider} دریافت شد: ${result.trackingCode}`)
      if (typeof window.showToast === 'function') {
        window.showToast(`کد رهگیری از ${provider} دریافت شد: ${result.trackingCode}`, 'success', 5000);
      }
    } else {
      //alert('درخواست با موفقیت ثبت شد اما کدی دریافت نشد.')
      if (typeof window.showToast === 'function') {
        window.showToast('درخواست با موفقیت ثبت شد اما کدی دریافت نشد.', 'success', 5000);
      }

    }
  } catch (error) {
    console.error('API Error:', error)

  } finally {
    isApiLoading.value = false
  }
}

// متد submitShipping
const submitShipping = async () => {
  if (!shippingOrderData.value) {
    alert('لطفاً یک سفارش را انتخاب کنید.');
    return;
  }

  const rawCode = trackingCode.value;
  const trackingCodeStr = typeof rawCode === 'string' ? rawCode.trim() : String(rawCode || '').trim();

  // ۳. بررسی خالی نبودن کد
  if (!trackingCodeStr) {
    alert('لطفاً کد رهگیری را وارد کنید یا از دکمه ثبت در سرویس پستی استفاده نمایید.');
    return;
  }

  if (isApiLoading.value) return;
  try {
    await orderStore.updateOrderStatus(shippingOrderData.value.id, OrderStatus.TENANT_SHIPPED);
    alert(`سفارش با کد رهگیری ${trackingCode.value} با موفقیت ثبت شد.`);
    closeShippingModal();
  } catch (error) {
    console.error('Error in shipping:', error);
    alert('خطا در ثبت کد رهگیری.');
  }
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>