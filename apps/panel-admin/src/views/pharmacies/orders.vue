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
              class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 mb-3">
            <i class="ti ti-pill text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">سفارشات دارو</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ orderStore.stats?.pharmacyTotal }}</h3>
          <p class="text-xs text-gray-500 mt-1">دارویی</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div
              class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <i class="ti ti-shopping-bag text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">سفارشات محصول</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ orderStore.stats?.productTotal }}</h3>
          <p class="text-xs text-gray-500 mt-1">محصولات</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div
              class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
            <i class="ti ti-clock text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">در انتظار بررسی</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ pendingCount }}</h3>
          <p class="text-xs text-gray-500 mt-1">نیاز به اقدام</p>
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
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <!-- Desktop Table (XL+) -->
      <div class="hidden xl:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">کد سفارش</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">نوع</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مشتری</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">اقلام</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">زمان تحویل</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مبلغ کل</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">وضعیت</th>
            <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">عملیات</th>
          </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">

            <td class="px-6 py-4">
            <span class="font-mono font-bold text-gray-900 break-all">
              {{ order.code }}
            </span>
            </td>

            <td class="px-6 py-4">
            <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="order.type === 'PRESCRIPTION'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'"
            >
              {{ order.type === 'PRESCRIPTION' ? 'با نسخه' : 'محصول' }}
            </span>
            </td>

            <td class="px-6 py-4">
              <div>
                <p class="font-semibold text-gray-900 truncate max-w-[180px]">
                  {{ order.owner }}
                </p>
                <p class="text-xs text-gray-500">{{ order.phone || '---' }}</p>
              </div>
            </td>

            <td class="px-6 py-4">
              <p class="text-sm text-gray-700 max-w-[220px] truncate">
                {{ order.items }}
              </p>
            </td>

            <td class="px-6 py-4">
              <div class="flex flex-col text-sm">
                <span class="text-gray-900 font-medium">{{ order.deliveryDateFa }}</span>
                <span class="text-xs text-gray-500">{{ order.deliveryTime }}</span>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex flex-col">
              <span class="font-bold text-gray-900">
                {{ formatPrice(order.total) }}
              </span>

                <span
                    v-if="order.isPrescription && order.remainingAmount > 0"
                    class="text-xs text-orange-600 font-medium"
                >
                باقی‌مانده: {{ formatPrice(order.remainingAmount) }}
              </span>
              </div>
            </td>

            <td class="px-6 py-4">
            <span
                class="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">

                <button
                    @click="viewOrder(order)"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="مشاهده"
                >
                  <i class="ti ti-eye text-gray-600"></i>
                </button>

                <button
                    v-if="order.type === 'PRESCRIPTION' && order.status === 'CUSTOMER_PAID'"
                    @click="openPrescriptionModal(order)"
                    class="p-2 hover:bg-purple-100 rounded-lg text-purple-600"
                    title="بررسی نسخه"
                >
                  <i class="ti ti-file-certificate"></i>
                </button>

                <button
                    v-if="(order.type !== 'PRESCRIPTION' || order.status === 'VERIFIED') && order.status === 'CUSTOMER_PAID'"
                    @click="confirmOrder(order)"
                    class="p-2 hover:bg-green-100 rounded-lg text-green-600"
                    title="تایید"
                >
                  <i class="ti ti-check"></i>
                </button>

                <button
                    v-if="order.status === 'TENANT_PROCESSING'"
                    @click="openShippingModal(order)"
                    class="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                    title="ارسال"
                >
                  <i class="ti ti-truck"></i>
                </button>

                <button
                    v-if="order.status === 'CUSTOMER_PAID' || order.status === 'TENANT_PROCESSING'"
                    @click="handleCancelOrder(order)"
                    class="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    title="لغو"
                >
                  <i class="ti ti-x"></i>
                </button>

                <button
                    v-if="order.status === 'TENANT_SHIPPED'"
                    @click="handleCancelShipment(order)"
                    class="p-2 hover:bg-orange-100 rounded-lg text-orange-600"
                    title="لغو ارسال"
                >
                  <i class="ti ti-ban"></i>
                </button>

              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Tablet + Mobile Cards -->
      <div class="xl:hidden divide-y divide-gray-100">

        <div v-for="order in filteredOrders" :key="order.id" class="p-4 sm:p-5">

          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">

            <div>
              <div class="flex items-center gap-2 mb-1">
            <span class="font-mono font-bold text-gray-900 break-all">
              {{ order.code }}
            </span>

                <span
                    v-if="order.type === 'PRESCRIPTION'"
                    class="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700"
                >
              نسخه
            </span>
              </div>

              <p class="font-semibold text-gray-900 truncate max-w-[220px]">
                {{ order.owner }}
              </p>

              <p class="text-xs text-gray-500">{{ order.phone || '---' }}</p>
            </div>

            <span
                class="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                :class="getStatusClass(order.status)"
            >
          {{ getStatusText(order.status) }}
        </span>

          </div>

          <!-- Items -->
          <p class="text-sm text-gray-600 mb-3 line-clamp-1">
            {{ order.items }}
          </p>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">

            <div class="bg-gray-50 p-2 rounded-lg">
              <p class="text-xs text-gray-500">زمان تحویل</p>
              <p class="font-medium text-gray-800">{{ order.deliveryDateFa }}</p>
              <p class="text-xs text-gray-500">{{ order.deliveryTime }}</p>
            </div>

            <div class="bg-gray-50 p-2 rounded-lg">
              <p class="text-xs text-gray-500">مبلغ</p>
              <p class="font-medium text-gray-800">
                {{ formatPrice(order.total) }}
              </p>

              <p
                  v-if="order.isPrescription && order.remainingAmount > 0"
                  class="text-xs text-orange-600 mt-1"
              >
                باقی مانده: {{ formatPrice(order.remainingAmount) }}
              </p>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="flex flex-wrap justify-end gap-2">

            <button
                @click="viewOrder(order)"
                class="w-10 h-10 flex items-center justify-center rounded-lg"
            >
              <i class="ti ti-eye text-gray-600"></i>
            </button>

            <button
                v-if="order.type === 'PRESCRIPTION' && order.status === 'CUSTOMER_PAID'"
                @click="openPrescriptionModal(order)"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-purple-600"
            >
              <i class="ti ti-file-certificate"></i>
            </button>

            <button
                v-if="(order.type !== 'PRESCRIPTION' || order.status === 'VERIFIED') && order.status === 'CUSTOMER_PAID'"
                @click="confirmOrder(order)"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-green-600"
            >
              <i class="ti ti-check"></i>
            </button>

            <!-- دکمه لغو ارسال (BAN) -->
            <button
                v-if="order.status === 'TENANT_SHIPPED'"
                @click="handleCancelShipment(order)"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-orange-600"
                title="لغو ارسال"
            >
              <i class="ti ti-ban"></i>
            </button>

            <button
                v-if="order.status === 'TENANT_PROCESSING'"
                @click="openShippingModal(order)"
                class="w-10 h-10 flex items-center justify-center rounded-lg text-blue-600"
            >
              <i class="ti ti-truck"></i>
            </button>

            <button
                v-if="order.status === 'CUSTOMER_PAID' || order.status === 'TENANT_PROCESSING'"
                @click="handleCancelOrder(order)"
                class="p-2 rounded-lg text-red-600"
                title="لغو"
            >
              <i class="ti ti-x"></i>
            </button>

          </div>

        </div>
      </div>

      <!-- Empty State -->
      <div
          v-if="filteredOrders.length === 0 && !orderStore.loading"
          class="p-6 sm:p-12 text-center"
      >
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-shopping-cart-off text-4xl text-gray-400"></i>
        </div>
        <p class="text-gray-600 font-medium">سفارشی یافت نشد</p>
        <p class="text-sm text-gray-500">فیلترها را تغییر دهید</p>
      </div>

      <!-- Pagination -->
      <div
          v-if="orderStore.pagination.total > 1"
          class="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <button
            @click="changePage(orderStore.pagination.page - 1)"
            :disabled="orderStore.pagination.page === 1"
            class="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          قبلی
        </button>

        <span class="text-sm text-gray-600 text-center">
      صفحه {{ orderStore.pagination.page }} از {{ orderStore.pagination.total }}
    </span>

        <button
            @click="changePage(orderStore.pagination.page + 1)"
            :disabled="orderStore.pagination.page === orderStore.pagination.total"
            class="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          بعدی
        </button>
      </div>

    </div>

    <!-- Prescription Review Modal -->
    <div v-if="showPrescriptionModal && prescriptionOrderData" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closePrescriptionModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h3 class="text-lg font-bold text-gray-900">بررسی نسخه و تایید سفارش</h3>
            <p class="text-sm text-gray-500">کد: {{ prescriptionOrderData.code }}</p>
          </div>
          <button @click="closePrescriptionModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors"><i class="ti ti-x text-xl text-gray-500"></i></button>
        </div>

        <div class="p-6 space-y-6 overflow-y-auto">
          <!-- Prescription Images -->
          <div>
            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2"><i class="ti ti-file-certificate text-purple-500"></i> تصاویر نسخه</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(url, index) in prescriptionOrderData.prescriptionUrls" :key="index" class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img :src="url" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Medicine Search & Selection -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2"><i class="ti ti-pills text-blue-500"></i> انتخاب داروها</h4>

            <!-- Search Input -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">جستجوی دارو (نام یا کد)</label>
              <div class="relative">
                <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    v-model="medicineSearchQuery"
                    type="text"
                    placeholder="نام دارو یا کد آن را تایپ کنید..."
                    class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Search Results Dropdown -->
            <div v-if="medicineSearchQuery.length > 1" class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white mb-4 z-20 relative">
              <div
                  v-for="med in filteredMedicines"
                  :key="med.id"
                  @click="selectMedicine(med)"
                  class="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center transition-colors"
              >
                <div>
                  <p class="font-medium text-gray-800">{{ med.medicine.name }}</p>
                  <p class="text-xs text-gray-500">کد: {{ med.medicine.code }} | {{ med.medicine.dosageForm }}</p>
                </div>
                <span class="text-sm font-bold text-blue-600">انتخاب +</span>
              </div>
              <div v-if="filteredMedicines.length === 0" class="p-3 text-center text-gray-500 text-sm">
                دارویی یافت نشد
              </div>
            </div>

            <!-- Selected Medicines List -->
            <div v-if="selectedMedicinesList.length > 0" class="mt-4">
              <h5 class="text-sm font-bold text-gray-700 mb-2">داروهای انتخاب شده:</h5>
              <div class="space-y-2">
                <div v-for="(med, index) in selectedMedicinesList" :key="med.id" class="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ med.medicine.name }}</p>
                    <p class="text-xs text-gray-500">قیمت واحد: {{ formatPrice(med.price) }}</p>
                  </div>
                  <button @click="removeMedicine(index)" class="text-red-500 hover:text-red-700 p-1">
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Manual Price Input (Fallback) -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">قیمت دستی (در صورت عدم یافتن دارو)</label>
              <input
                  v-model="medicinePriceInput"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="قیمت کل داروها را دستی وارد کنید"
              />
              <p class="text-xs text-gray-500 mt-1">اگر لیست داروها خالی است، قیمت نهایی از این مقدار استفاده می‌شود.</p>
            </div>
          </div>

          <!-- Calculation Summary -->
          <div class="mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm bg-white p-4 rounded-lg">
            <div class="flex justify-between">
              <span class="text-gray-600">پیش‌پرداخت کاربر:</span>
              <span class="font-medium">{{ formatPrice(prescriptionOrderData.total) }} تومان</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">قیمت داروهای تایید شده:</span>
              <span class="font-medium">{{ formatPrice(selectedMedicinesList.length > 0 ? selectedMedicinesTotalPrice : (Number(medicinePriceInput) || 0)) }} تومان</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">هزینه ارسال:</span>
              <span class="font-medium">{{ formatPrice(prescriptionOrderData.shippingCost || 0) }} تومان</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-200">
              <span class="font-bold text-gray-900">مبلغ کل نهایی:</span>
              <span class="font-bold text-lg text-gray-900">{{ formatPrice(finalTotal) }} تومان</span>
            </div>
            <div class="flex justify-between items-center text-base">
          <span class="font-bold" :class="remainingAmount >= 0 ? 'text-orange-600' : 'text-green-600'">
            {{ remainingAmount >= 0 ? 'مانده پرداختی کاربر:' : 'زیاد پرداختی کاربر:' }}
          </span>
              <span class="font-bold" :class="remainingAmount >= 0 ? 'text-orange-600' : 'text-green-600'">
            {{ formatPrice(Math.abs(remainingAmount)) }} تومان
          </span>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center gap-3 rounded-b-2xl">
          <button
              @click="verifyPrescription"
              :disabled="!medicinePriceInput && selectedMedicinesList.length === 0"
              class="flex-1 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
          >
            <i class="ti ti-check ml-2"></i> تایید نسخه و محاسبه مبلغ
          </button>
          <button @click="closePrescriptionModal" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">انصراف</button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal (Existing, kept for completeness) -->
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
                <span class="font-medium text-gray-900 mr-2">{{ selectedOrder.address || 'آدرس ثبت نشده' }}</span>
              </div>
            </div>
          </div>
          <!-- Delivery Info -->
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
            <div v-if="selectedOrder.isPrescription && selectedOrder.remainingAmount > 0"
                 class="flex items-center justify-between bg-orange-50 p-2 rounded">
              <span class="text-orange-700">مانده پرداختی:</span>
              <span class="text-lg font-bold text-orange-600">{{
                  formatPrice(selectedOrder.remainingAmount)
                }} تومان</span>
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
              @click="closeOrderModal(); openShippingModal(selectedOrder)"
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
    <div v-if="showShippingModal && shippingOrderData" class="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-2 sm:p-4">

      <!-- Backdrop -->
      <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeShippingModal"
      ></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">

        <!-- Header -->
        <div class="bg-gradient-to-l from-blue-600 to-indigo-600 p-4 sm:p-6 text-white">
          <h3 class="text-lg sm:text-xl font-bold flex items-center gap-2">
            <i class="ti ti-truck-delivery"></i>
            ارسال سفارش
          </h3>
          <p class="text-blue-100 text-sm mt-1">ثبت کد رهگیری برای مشتری</p>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          <!-- Order Info -->
          <div class="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p class="text-sm text-gray-500">کد سفارش</p>
              <p class="font-bold text-gray-900">{{ shippingOrderData.code }}</p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-sm text-gray-500">مبلغ</p>
              <p class="font-bold text-gray-900">
                {{ formatPrice(shippingOrderData.total) }}
                <span class="text-xs">تومان</span>
              </p>
            </div>
          </div>

          <!-- Alopeyk Status -->
          <div v-if="alopeykStatus" class="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-2">
            <h4 class="font-bold text-indigo-900 flex items-center gap-2">
              <i class="ti ti-truck-delivery"></i>
              وضعیت در سرویس پستی
            </h4>

            <div class="flex items-center justify-between text-sm">
              <span class="text-indigo-700">وضعیت:</span>
              <span class="font-bold" :class="getAlopeykStatusColor(alopeykStatus)">
            {{ getAlopeykStatusText(alopeykStatus) }}
          </span>
            </div>

            <p
                v-if="alopeykStatus === 'accepted' || alopeykStatus === 'picking' || alopeykStatus === 'delivering'"
                class="text-xs text-indigo-600"
            >
              پیک در حال انجام ماموریت است.
            </p>

            <p
                v-if="['cancelled', 'expired', 'finished'].includes(alopeykStatus)"
                class="text-xs text-indigo-600"
            >
              این سفارش قبلاً ثبت شده است. در صورت نیاز ارسال مجدد را انجام دهید.
            </p>
          </div>

          <!-- Shipping Info -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span class="text-xs font-bold text-gray-500 uppercase">روش ارسال</span>

              <div class="flex flex-wrap gap-2 items-center">
            <span class="font-bold text-blue-700">
              {{ getShippingMethod(shippingOrderData) }}
            </span>

                <button
                    v-if="isApiSupportedShipping(shippingOrderData) && !alopeykStatus"
                    @click="requestFromShippingAPI"
                    :disabled="isApiLoading"
                    class="text-xs bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-200 text-indigo-700 px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <i v-if="isApiLoading" class="ti ti-loader animate-spin"></i>
                  <i v-else class="ti ti-robot"></i>
                  ثبت در API
                </button>

                <button
                    v-if="isApiSupportedShipping(shippingOrderData) && ['cancelled','expired','finished'].includes(alopeykStatus)"
                    @click="retryAlopeykRequest"
                    :disabled="isApiLoading"
                    class="text-xs bg-emerald-100 hover:bg-emerald-200 disabled:bg-gray-200 text-emerald-700 px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <i v-if="isApiLoading" class="ti ti-loader animate-spin"></i>
                  <i v-else class="ti ti-refresh-dot"></i>
                  ارسال مجدد
                </button>
              </div>
            </div>

            <div class="h-px bg-gray-200"></div>

            <div class="flex justify-between">
              <span class="text-xs font-bold text-gray-500 uppercase">تاریخ تحویل</span>
              <span class="text-gray-800">{{ shippingOrderData.deliveryDateFa }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-xs font-bold text-gray-500 uppercase">بازه زمانی</span>
              <span class="text-gray-800">{{ shippingOrderData.deliveryTime }}</span>
            </div>

          </div>

          <!-- Tracking Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              کد پیگیری / باربری
            </label>

            <input
                v-model="trackingCode"
                type="text"
                readonly
                placeholder="کد رهگیری از سرویس دریافت می‌شود..."
                class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-center font-mono text-sm sm:text-lg tracking-normal sm:tracking-widest"
            />

            <p class="text-xs text-gray-500 mt-2">
              برای دریافت کد، ثبت در سرویس ارسال را انجام دهید.
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3">

          <button
              @click="closeShippingModal"
              class="w-full sm:w-auto px-4 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl font-bold"
          >
            {{ alopeykStatus ? 'بستن' : 'انصراف' }}
          </button>

          <button
              v-if="alopeykStatus && canCancelShipment(alopeykStatus)"
              @click="handleCancelShipment(shippingOrderData)"
              :disabled="orderStore.loading"
              class="w-full sm:w-auto px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <i class="ti ti-ban"></i>
            {{ orderStore.loading ? 'در حال لغو...' : 'لغو ارسال' }}
          </button>

          <button
              @click="submitShipping"
              :disabled="!trackingCode"
              class="w-full sm:flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold shadow-lg"
          >
            تایید و ارسال نهایی
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {OrderStatus, usePharmacyOrderStore} from "@/stores/pharmacy/order.js"
import AppSelect from '@/components/AppSelect.vue'
import {storeToRefs} from "pinia"
import {useAuthStore} from "@/stores/auth.js"
import {useMedicineStore} from "@/stores/pharmacy/medicine.store.js";
const alopeykStatus = ref('new') // وضعیت الوپیک
const authStore = useAuthStore()
const medicineStore=useMedicineStore()
const medicines=computed(()=>medicineStore.medicines)
const {tenant} = storeToRefs(authStore)
const router = useRouter()
const orderStore = usePharmacyOrderStore()
// --- State برای جستجوی دارو (تغییر یافته) ---
const medicineSearchQuery = ref('')
// لیست داروهای انتخاب شده به جای یک داروی تکی
const selectedMedicinesList = ref([])
// متغیر برای ذخیره ایندکس تایمر
let statusCheckInterval = null;
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

onMounted(async () => {
  await orderStore.fetchPharmacyOrders(1, 10)
  await medicineStore.fetchMedicines()
})
/*useHead({
  title: 'مدیریت سفارشات | داروخانه'
})*/

const filters = ref({
  status: '',
  search: ''
})

// --- فیلتر داروها برای نمایش در لیست جستجو ---
const filteredMedicines = computed(() => {
  if (!medicineSearchQuery.value || medicineSearchQuery.value.length < 1) return []
  const query = medicineSearchQuery.value.toLowerCase()
  // جستجو در داروهای موجود در استور
  return medicines.value.filter(med =>
      (med.medicine.name && med.medicine.name.toLowerCase().includes(query)) ||
      (med.medicine.code && med.medicine.code.toLowerCase().includes(query))
  )
})

// --- افزودن دارو به لیست ---
const selectMedicine = (med) => {
  // بررسی تکراری نبودن
  const exists = selectedMedicinesList.value.find(item => item.id === med.id)
  if (exists) {
    alert('این دارو قبلاً به لیست اضافه شده است.')
    return
  }

  // افزودن به لیست
  selectedMedicinesList.value.push({
    ...med,
    quantity: 1 // فرض بر تعداد ۱، می‌توانید ورودی تعداد هم اضافه کنید
  })

  // پاک کردن جستجو
  medicineSearchQuery.value = ''
}

// --- حذف دارو از لیست ---
const removeMedicine = (index) => {
  selectedMedicinesList.value.splice(index, 1)
}

// --- محاسبه قیمت کل داروهای انتخاب شده ---
const selectedMedicinesTotalPrice = computed(() => {
  return selectedMedicinesList.value.reduce((sum, item) => {
    // فرض می‌کنیم قیمت در فیلد price یا unitPrice ذخیره شده است.
    // اگر در دیتابیس شما فیلد دیگری است، آن را جایگزین کنید.
    const price = Number(item.price || 0)
    const qty = Number(item.quantity || 1)
    return sum + (price * qty)
  }, 0)
})

// --- محاسبه قیمت نهایی (داروها + ارسال) ---
const finalTotal = computed(() => {
  if (!prescriptionOrderData.value) return 0

  // اگر لیست دارو پر است، از قیمت محاسبه شده لیست استفاده کن
  // اگر لیست خالی است، از ورودی دستی استفاده کن
  const drugsPrice = selectedMedicinesList.value.length > 0
      ? selectedMedicinesTotalPrice.value
      : (Number(medicinePriceInput.value) || 0)

  const shipping = prescriptionOrderData.value.shippingCost || 0
  return drugsPrice + shipping
})

// --- محاسبه مانده حساب ---
const remainingAmount = computed(() => {
  if (!prescriptionOrderData.value) return 0
  const paid = prescriptionOrderData.value.total // مبلغی که کاربر قبلا داده
  const final = finalTotal.value
  return final - paid
})

// --- مدیریت مودال بررسی نسخه ---
const openPrescriptionModal = (order) => {
  prescriptionOrderData.value = order
  // ریست کردن لیست داروها و قیمت دستی هنگام باز شدن مودال جدید
  selectedMedicinesList.value = []
  medicinePriceInput.value = ''
  prescriptionNotes.value = ''
  showPrescriptionModal.value = true
}

const closePrescriptionModal = () => {
  showPrescriptionModal.value = false
  prescriptionOrderData.value = null
  selectedMedicinesList.value = []
  medicinePriceInput.value = ''
  prescriptionNotes.value = ''
}

const verifyPrescription = async () => {
  if (!prescriptionOrderData.value) return

  // محاسبه قیمت بر اساس لیست داروها یا ورودی دستی
  const drugsPrice = selectedMedicinesList.value.length > 0
      ? selectedMedicinesTotalPrice.value
      : (Number(medicinePriceInput.value) || 0)

  if (drugsPrice <= 0) {
    alert('لطفاً داروها را انتخاب کنید یا قیمت را وارد نمایید.')
    return
  }

  const shippingCost = prescriptionOrderData.value.shippingCost || 0
  const calcFinalTotal = drugsPrice + shippingCost
  const calcRemaining = calcFinalTotal - prescriptionOrderData.value.total

  try {
    // 1. آماده‌سازی متادیتا
    // تبدیل لیست داروها به فرمت مناسب برای ذخیره (اگر نیاز است)
    const selectedDrugsInfo = selectedMedicinesList.value.map(med => ({
      id: med.id,
      name: med.name,
      price: med.price || med.unitPrice,
      quantity: med.quantity
    }))

    const updatedMetadata = {
      ...prescriptionOrderData.value.metadata,
      selectedMedicines: selectedDrugsInfo, // ذخاریت لیست داروهای انتخاب شده
      verifiedMedicinePrice: drugsPrice,
      finalTotalAmount: calcFinalTotal,
      remainingAmount: calcRemaining,
      pharmacyNotes: prescriptionNotes.value,
      verifiedAt: new Date().toISOString()
    }

    // 2. آپدیت متادیتا
    await orderStore.updateOrderMetadata(prescriptionOrderData.value.id, updatedMetadata)

    // 3. تعیین وضعیت
    let nextStatus = ''
    if (calcRemaining > 0) {
      nextStatus = OrderStatus.PENDING_REMAINING_PAYMENT
    } else {
      nextStatus = OrderStatus.TENANT_PROCESSING
    }

    await orderStore.updateOrderStatus(prescriptionOrderData.value.id, nextStatus)

    // 4. پیام موفقیت
    if (calcRemaining > 0) {
      alert(`نسخه تایید شد. مبلغ کل: ${formatPrice(calcFinalTotal)} تومان. مبلغ باقی‌مانده: ${formatPrice(calcRemaining)} تومان.`)
    } else {
      alert(`نسخه تایید شد. مبلغ کل: ${formatPrice(calcFinalTotal)} تومان. سفارش وارد چرخه پردازش شد.`)
    }

    closePrescriptionModal()
    await orderStore.fetchPharmacyOrders(orderStore.pagination.page, 10)

  } catch (error) {
    console.error('Error verifying prescription:', error)
    alert('خطا در تایید نسخه. لطفاً مجددا تلاش کنید.')
  }
}

// Modal States
const showOrderModal = ref(false)
const selectedOrder = ref(null)
const showPrescriptionModal = ref(false)
const prescriptionOrderData = ref(null)
const medicinePriceInput = ref('')
const prescriptionNotes = ref('')
const showShippingModal = ref(false)
const shippingOrderData = ref(null)
const trackingCode = ref('')
const isApiLoading = ref(false)

// Status Options
const statusOptions = [
  {value: '', label: 'همه', icon: 'ti ti-list'},
  {value: 'CUSTOMER_PENDING', label: 'در انتظار', icon: 'ti ti-clock', iconColor: 'text-orange-500'},
  {value: 'CUSTOMER_PAID', label: 'پرداخت شده', icon: 'ti ti-credit-card', iconColor: 'text-blue-500'},
  {value: 'VERIFIED', label: 'نسخه تایید شده', icon: 'ti ti-check', iconColor: 'text-green-500'}, // وضعیت جدید
  {
    value: 'PENDING_REMAINING_PAYMENT',
    label: 'منتظر پرداخت مابقی',
    icon: 'ti ti-alert-circle',
    iconColor: 'text-yellow-500'
  }, // وضعیت جدید
  {value: 'TENANT_PROCESSING', label: 'در حال پردازش', icon: 'ti ti-loader', iconColor: 'text-yellow-500'},
  {value: 'TENANT_SHIPPED', label: 'ارسال شده', icon: 'ti ti-truck', iconColor: 'text-purple-500'},
  {value: 'CUSTOMER_DELIVERED', label: 'تحویل شده', icon: 'ti ti-circle-check', iconColor: 'text-green-500'},
  {value: 'CUSTOMER_CANCELLED', label: 'لغو شده', icon: 'ti ti-x', iconColor: 'text-red-500'}
]

// Mapped Orders
const mappedOrders = computed(() => {
  return orderStore.orders.map(order => {
    const code = order.orderCode || `ORD-${order.id.slice(-6).toUpperCase()}`
    const owner = order.user?.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'نامشخص'
    const items = order.items?.map(item => item.marketProduct?.product?.name || item.pharmacyMedicine?.medicine?.name || item.variant?.marketProduct?.product?.name).join('، ') || 'بدون اقلام'
    const total = order.totalAmount || 0

    const metadata = order.metadata || {}
    let deliveryDateFa = 'نامشخص'
    if (metadata.deliveryDate) {
      try {
        deliveryDateFa = new Date(metadata.deliveryDate).toLocaleDateString('fa-IR')
      } catch (e) {
        deliveryDateFa = metadata.deliveryDate
      }
    }

    // تشخیص نوع سفارش و محاسبات مالی
    const isPrescription = order.type === 'PRESCRIPTION'
    const prescriptionUrls = metadata.prescriptionUrls || []
    const shippingCost = Number(metadata.shippingCost) || 0
    const customerPaid = total // مبلغی که کاربر در ابتدا پرداخت کرده

    // اگر نسخه‌ای است، محاسبه مابقی
    let remainingAmount = 0
    if (isPrescription && medicinePriceInput.value) {
      // این مقدار داینامیک است و در زمان بررسی نسخه محاسبه می‌شود
      // برای نمایش در لیست، اگر در دیتابیس فیلد جداگانه برای price نهایی ذخیره نشده، نمی‌توانیم اینجا دقیق محاسبه کنیم
      // اما فرض می‌کنیم backend مقدار نهایی را در metadata.finalPrice نگه می‌دارد یا ما آن را محاسبه می‌کنیم
      // در اینجا برای سادگی، اگر status == VERIFIED بود، یعنی قیمت نهایی ثبت شده
    }

    return {
      ...order,
      code,
      owner,
      items,
      total,
      phone: order.user?.phoneNumber,
      address: [
        order.address.road??order.address.street,
        order.address.neighbourhood??order.address.city,
        order.address.suburb??order.address.province
      ]
          .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
          .join('. '),
      metadata: metadata,
      deliveryDateFa: deliveryDateFa,
      deliveryTime: metadata.deliveryTime || '---',
      type: order.type,
      isPrescription: isPrescription,
      prescriptionUrls: prescriptionUrls,
      shippingCost: shippingCost
    }
  })
})

// Filtering
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
  // سفارشات نیازمند بررسی: یا پرداخت شده و نسخه‌ای، یا تایید شده و منتظر پرداخت مابقی
  return mappedOrders.value.filter(o =>
      (o.status === 'CUSTOMER_PAID' && o.type === 'PRESCRIPTION') ||
      o.status === 'VERIFIED' ||
      o.status === 'PENDING_REMAINING_PAYMENT'||
      o.status==='CUSTOMER_PENDING'
  ).length
})

// Status Helpers
const getStatusText = (status) => {
  const texts = {
    'CUSTOMER_PENDING': 'در انتظار',
    'CUSTOMER_PAID': 'پرداخت شده',
    'VERIFIED': 'نسخه تایید شده',
    'PENDING_REMAINING_PAYMENT': 'منتظر پرداخت مابقی',
    'TENANT_PROCESSING': 'در حال پردازش',
    'TENANT_SHIPPED': 'ارسال شده',
    'CUSTOMER_DELIVERED': 'تحویل شده',
    'CUSTOMER_CANCELLED': 'لغو شده',
    'TENANT_CANCELLED': 'لغو شده'
  }
  return texts[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'CUSTOMER_PENDING': 'bg-orange-100 text-orange-700',
    'CUSTOMER_PAID': 'bg-blue-100 text-blue-700',
    'VERIFIED': 'bg-green-100 text-green-700',
    'PENDING_REMAINING_PAYMENT': 'bg-yellow-100 text-yellow-700',
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
  if (newPage > 0 && newPage <= orderStore.pagination.total) {
    orderStore.fetchPharmacyOrders(newPage, 10);
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
  // تغییر وضعیت به در حال پردازش
  orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_PROCESSING)
}
// --- مدیریت مودال ارسال ---

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

const isApiSupportedShipping = (order) => {
  const method = order.metadata?.shippingMethod?.toLowerCase()
  return method === 'tipax' || method === 'alopeyk' || method === 'post'
}

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

// بررسی امکان لغو ارسال پستی بر اساس وضعیت الوپیک
const canCancelShipment = (status) => {
  // وضعیت‌هایی که قابل لغو هستند: New, Searching, Expired
  const cancelableStatuses = ['new', 'searching', 'expired'];
  return cancelableStatuses.includes(status);
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
      //const res = await orderStore.updateOrderStatus(order.id, OrderStatus.TENANT_PROCESSING);
      trackingCode.value = null
      closeShippingModal();
    }
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    alert('خطا در لغو ارسال. ممکن است پیک سفارش را پذیرفته باشد.');
  }
};

const submitShipping = async () => {

  const codeString = String(trackingCode.value ?? '').trim();
  if (!shippingOrderData.value || !codeString) return
  if (isApiLoading.value) return

  try {
    const provider = shippingOrderData.value.metadata?.shippingMethod || 'manual'

    // آپدیت کد رهگیری
    await orderStore.updateTrackingCode(
        shippingOrderData.value.id,
        codeString,
        provider
    )

    // تغییر وضعیت به ارسال شده
    await orderStore.updateOrderStatus(shippingOrderData.value.id, OrderStatus.TENANT_SHIPPED)

    alert(`سفارش با کد رهگیری ${codeString} با موفقیت ثبت شد.`)
    closeShippingModal()
    // رفرش لیست
    await orderStore.fetchPharmacyOrders(orderStore.pagination.page, 10)
  } catch (error) {
    console.error('Error in shipping:', error)
    alert('خطا در ثبت کد رهگیری.')
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* استایل‌های اضافی برای اسکرول‌بار و انیمیشن‌ها */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>