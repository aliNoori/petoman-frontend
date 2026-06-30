<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
            <i class="ti ti-pill text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">کل سفارشات</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">156</h3>
          <p class="text-xs text-gray-500 mt-1">این ماه</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 mb-3">
            <i class="ti ti-check text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">تحویل شده</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">142</h3>
          <p class="text-xs text-gray-500 mt-1">91% موفقیت</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
            <i class="ti ti-clock text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">در انتظار</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">14</h3>
          <p class="text-xs text-gray-500 mt-1">نیاز به پیگیری</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <i class="ti ti-file-description text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">با نسخه</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">89</h3>
          <p class="text-xs text-gray-500 mt-1">57% از کل</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Status Filter -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
          <button
            @click="showStatusDropdown = !showStatusDropdown"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span class="text-sm text-gray-700">{{ getStatusFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-gray-400 transition-transform" :class="{ 'rotate-180': showStatusDropdown }"></i>
          </button>
          <Transition name="dropdown">
            <div v-if="showStatusDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <ul class="py-2">
                <li
                  @click="selectStatusFilter('')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === '' }"
                >
                  <span class="text-sm" :class="filters.status === '' ? 'text-teal-700 font-medium' : 'text-gray-700'">همه</span>
                  <i v-if="filters.status === ''" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectStatusFilter('pending')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === 'pending' }"
                >
                  <span class="text-sm" :class="filters.status === 'pending' ? 'text-teal-700 font-medium' : 'text-gray-700'">در انتظار</span>
                  <i v-if="filters.status === 'pending'" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectStatusFilter('processing')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === 'processing' }"
                >
                  <span class="text-sm" :class="filters.status === 'processing' ? 'text-teal-700 font-medium' : 'text-gray-700'">در حال پردازش</span>
                  <i v-if="filters.status === 'processing'" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectStatusFilter('waiting-customer')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === 'waiting-customer' }"
                >
                  <span class="text-sm" :class="filters.status === 'waiting-customer' ? 'text-teal-700 font-medium' : 'text-gray-700'">در انتظار تایید مشتری</span>
                  <i v-if="filters.status === 'waiting-customer'" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectStatusFilter('ready')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === 'ready' }"
                >
                  <span class="text-sm" :class="filters.status === 'ready' ? 'text-teal-700 font-medium' : 'text-gray-700'">آماده تحویل</span>
                  <i v-if="filters.status === 'ready'" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectStatusFilter('delivered')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === 'delivered' }"
                >
                  <span class="text-sm" :class="filters.status === 'delivered' ? 'text-teal-700 font-medium' : 'text-gray-700'">تحویل شده</span>
                  <i v-if="filters.status === 'delivered'" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectStatusFilter('rejected')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.status === 'rejected' }"
                >
                  <span class="text-sm" :class="filters.status === 'rejected' ? 'text-teal-700 font-medium' : 'text-gray-700'">رد شده</span>
                  <i v-if="filters.status === 'rejected'" class="ti ti-check text-teal-600"></i>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <!-- Type Filter -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">نوع سفارش</label>
          <button
            @click="showTypeDropdown = !showTypeDropdown"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span class="text-sm text-gray-700">{{ getTypeFilterLabel() }}</span>
            <i class="ti ti-chevron-down text-gray-400 transition-transform" :class="{ 'rotate-180': showTypeDropdown }"></i>
          </button>
          <Transition name="dropdown">
            <div v-if="showTypeDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <ul class="py-2">
                <li
                  @click="selectTypeFilter('')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.type === '' }"
                >
                  <span class="text-sm" :class="filters.type === '' ? 'text-teal-700 font-medium' : 'text-gray-700'">همه</span>
                  <i v-if="filters.type === ''" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectTypeFilter('prescription')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.type === 'prescription' }"
                >
                  <span class="text-sm" :class="filters.type === 'prescription' ? 'text-teal-700 font-medium' : 'text-gray-700'">با نسخه</span>
                  <i v-if="filters.type === 'prescription'" class="ti ti-check text-teal-600"></i>
                </li>
                <li
                  @click="selectTypeFilter('no-prescription')"
                  class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="{ 'bg-teal-50': filters.type === 'no-prescription' }"
                >
                  <span class="text-sm" :class="filters.type === 'no-prescription' ? 'text-teal-700 font-medium' : 'text-gray-700'">بدون نسخه</span>
                  <i v-if="filters.type === 'no-prescription'" class="ti ti-check text-teal-600"></i>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">از تاریخ</label>
          <PersianDatePicker v-model="filters.fromDate" placeholder="انتخاب تاریخ شروع" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">تا تاریخ</label>
          <PersianDatePicker v-model="filters.toDate" placeholder="انتخاب تاریخ پایان" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
          <div class="relative">
            <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="نام صاحب حیوان یا کد سفارش..."
              class="w-full pr-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Orders List -->
    <div class="lg:hidden space-y-3">
      <div
        v-for="order in allFilteredOrders"
        :key="order.id"
        class="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
              <i class="ti ti-pill text-white text-xl"></i>
            </div>
            <div>
              <p class="font-bold text-gray-900 font-mono">{{ order.code }}</p>
              <span 
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold mt-1"
                :class="order.hasPrescription ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'"
              >
                <i :class="order.hasPrescription ? 'ti ti-file-description' : 'ti ti-file-off'"></i>
                {{ order.hasPrescription ? 'با نسخه' : 'بدون نسخه' }}
              </span>
            </div>
          </div>
          <span 
            class="px-3 py-1.5 rounded-xl text-xs font-bold"
            :class="getStatusClass(order.status)"
          >
            {{ getStatusLabel(order.status) }}
          </span>
        </div>

        <!-- Customer Info -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <i class="ti ti-user text-gray-600 text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ order.owner }}</p>
              <p class="text-xs text-gray-500">{{ order.phone }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <i class="ti ti-paw text-teal-600 text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ order.pet }}</p>
              <p class="text-xs text-gray-500">{{ order.petType }}</p>
            </div>
          </div>
        </div>

        <!-- Medicine Info -->
        <div class="bg-gray-50 rounded-xl p-3 mb-4">
          <div class="flex items-start gap-2">
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <i class="ti ti-pill text-teal-600"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 text-sm">{{ order.medicine }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ order.dosage }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-200">
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <i class="ti ti-calendar"></i>
            <span>{{ order.date }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              v-if="order.hasPrescription"
              @click="downloadPrescription(order)"
              class="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
              title="دانلود نسخه"
            >
              <i class="ti ti-file-download"></i>
            </button>
            <button 
              @click="viewDetails(order)"
              class="p-2 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg transition-colors"
              title="مشاهده جزئیات"
            >
              <i class="ti ti-eye"></i>
            </button>
            <button 
              @click="downloadReceipt(order)"
              class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
              title="دانلود رسید پرداخت"
            >
              <i class="ti ti-receipt"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="allFilteredOrders.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-200">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-inbox text-4xl text-gray-400"></i>
        </div>
        <p class="text-gray-900 font-medium mb-1">سفارشی یافت نشد</p>
        <p class="text-sm text-gray-500">فیلترهای خود را تغییر دهید</p>
      </div>
    </div>

    <!-- Desktop Orders Table -->
    <div class="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">کد سفارش</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">صاحب حیوان</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">حیوان</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">دارو</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">مبلغ</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">نوع</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">وضعیت</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-mono text-sm text-gray-900">{{ order.code }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ order.owner }}</p>
                  <p class="text-sm text-gray-500">{{ order.phone }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <i class="ti ti-paw text-teal-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ order.pet }}</p>
                    <p class="text-xs text-gray-500">{{ order.petType }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ order.medicine }}</p>
                  <p class="text-sm text-gray-500">{{ order.dosage }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="order.price" class="text-sm">
                  <p class="font-bold text-green-600">{{ formatPrice(order.price) }}</p>
                  <p class="text-xs text-gray-500">تومان</p>
                </div>
                <span v-else class="text-xs text-gray-400">-</span>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="order.hasPrescription ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'"
                >
                  <i :class="order.hasPrescription ? 'ti ti-file-description' : 'ti ti-file-off'"></i>
                  {{ order.hasPrescription ? 'با نسخه' : 'بدون نسخه' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5 text-sm text-gray-600">
                  <i class="ti ti-calendar text-gray-400"></i>
                  <span>{{ order.date }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  <i :class="getStatusIcon(order.status)"></i>
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    v-if="order.hasPrescription"
                    @click="downloadPrescription(order)"
                    class="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                    title="دانلود نسخه"
                  >
                    <i class="ti ti-file-download"></i>
                  </button>
                  <button 
                    @click="viewDetails(order)"
                    class="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors" 
                    title="مشاهده جزئیات"
                  >
                    <i class="ti ti-eye"></i>
                  </button>
                  <button 
                    @click="downloadReceipt(order)"
                    class="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                    title="دانلود رسید پرداخت"
                  >
                    <i class="ti ti-receipt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div class="flex items-center gap-4">
          <p class="text-sm text-gray-600">نمایش {{ ((currentPage - 1) * pageSize) + 1 }} تا {{ Math.min(currentPage * pageSize, allFilteredOrders.length) }} از {{ allFilteredOrders.length }} سفارش</p>
          
          <!-- Page Size Selector -->
          <div class="flex items-center gap-2 relative">
            <span class="text-sm text-gray-600">تعداد در صفحه:</span>
            <button
              @click="showPageSizeDropdown = !showPageSizeDropdown"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-teal-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all flex items-center gap-2"
            >
              <span>{{ pageSize }}</span>
              <i class="ti ti-chevron-down text-gray-400 transition-transform" :class="{ 'rotate-180': showPageSizeDropdown }"></i>
            </button>
            
            <Transition name="dropdown">
              <div v-if="showPageSizeDropdown" class="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-[80px]">
                <ul class="py-2">
                  <li 
                    @click="selectPageSize(5)"
                    class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': pageSize === 5 }"
                  >
                    <span :class="pageSize === 5 ? 'text-teal-700 font-medium' : 'text-gray-700'">5</span>
                    <i v-if="pageSize === 5" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectPageSize(10)"
                    class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': pageSize === 10 }"
                  >
                    <span :class="pageSize === 10 ? 'text-teal-700 font-medium' : 'text-gray-700'">10</span>
                    <i v-if="pageSize === 10" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectPageSize(20)"
                    class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': pageSize === 20 }"
                  >
                    <span :class="pageSize === 20 ? 'text-teal-700 font-medium' : 'text-gray-700'">20</span>
                    <i v-if="pageSize === 20" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectPageSize(50)"
                    class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': pageSize === 50 }"
                  >
                    <span :class="pageSize === 50 ? 'text-teal-700 font-medium' : 'text-gray-700'">50</span>
                    <i v-if="pageSize === 50" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectPageSize(100)"
                    class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': pageSize === 100 }"
                  >
                    <span :class="pageSize === 100 ? 'text-teal-700 font-medium' : 'text-gray-700'">100</span>
                    <i v-if="pageSize === 100" class="ti ti-check text-teal-600"></i>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-right"></i>
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1.5 rounded-lg transition-colors"
            :class="currentPage === page ? 'bg-teal-600 text-white' : 'border border-gray-300 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Order Details Modal -->
  <OrderDetailsModal
    :show="showOrderModal"
    :order="selectedOrder"
    @close="showOrderModal = false"
    @approve="approveOrder"
    @reject="rejectOrder"
    @waiting-customer="setWaitingForCustomer"
    @download-prescription="downloadPrescription"
    @download-receipt="downloadReceipt"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment-jalaali'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()

// استفاده از notification
const notification = useNotification()

const filters = ref({
  status: '',
  type: '',
  fromDate: '',
  toDate: '',
  search: ''
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(5)
const showPageSizeDropdown = ref(false)

const selectPageSize = (size) => {
  pageSize.value = size
  currentPage.value = 1
  showPageSizeDropdown.value = false
}

// Dropdown states
const showStatusDropdown = ref(false)
const showTypeDropdown = ref(false)

// Modal state
const showOrderModal = ref(false)
const selectedOrder = ref({})

// Dropdown methods
const selectStatusFilter = (value) => {
  filters.value.status = value
  showStatusDropdown.value = false
}

const selectTypeFilter = (value) => {
  filters.value.type = value
  showTypeDropdown.value = false
}

const getStatusFilterLabel = () => {
  const labels = {
    '': 'همه',
    'pending': 'در انتظار',
    'processing': 'در حال پردازش',
    'ready': 'آماده تحویل',
    'delivered': 'تحویل شده'
  }
  return labels[filters.value.status] || 'همه'
}

const getTypeFilterLabel = () => {
  const labels = {
    '': 'همه',
    'prescription': 'با نسخه',
    'no-prescription': 'بدون نسخه'
  }
  return labels[filters.value.type] || 'همه'
}

const orders = ref([
  {
    id: 1,
    code: 'MED-1001',
    owner: 'علی محمدی',
    phone: '0912-345-6789',
    pet: 'ماکس',
    petType: 'سگ',
    medicine: 'آنتی‌بیوتیک آموکسی‌سیلین',
    dosage: '500mg - دو بار در روز',
    hasPrescription: true,
    date: '1403/07/22',
    status: 'pending',
    isPaid: false,
    note: ''
  },
  {
    id: 2,
    code: 'MED-1002',
    owner: 'فاطمه احمدی',
    phone: '0913-456-7890',
    pet: 'میلو',
    petType: 'گربه',
    medicine: 'شامپو ضد کک',
    dosage: 'هفته‌ای یکبار',
    hasPrescription: false,
    date: '1403/07/22',
    status: 'pending',
    isPaid: false,
    note: ''
  },
  {
    id: 3,
    code: 'MED-1003',
    owner: 'محمد رضایی',
    phone: '0914-567-8901',
    pet: 'راکی',
    petType: 'سگ',
    medicine: 'مسکن ترامادول',
    dosage: '50mg - سه بار در روز',
    hasPrescription: true,
    date: '1403/07/14',
    status: 'processing',
    isPaid: false,
    price: 250000,
    medicines: [
      {
        name: 'ترامادول 50mg',
        price: 150000,
        quantity: '20 قرص',
        expiryDate: '1405/06/15',
        dosage: 'روزی 3 بار، بعد از غذا',
        notes: 'در دمای اتاق نگهداری شود'
      },
      {
        name: 'ویتامین B کمپلکس',
        price: 100000,
        quantity: '1 بسته (30 قرص)',
        expiryDate: '1406/01/10',
        dosage: 'روزی یکبار صبح',
        notes: 'برای تقویت سیستم عصبی'
      }
    ]
  },
  {
    id: 4,
    code: 'MED-1004',
    owner: 'زهرا کریمی',
    phone: '0915-678-9012',
    pet: 'لونا',
    petType: 'گربه',
    medicine: 'ویتامین B12',
    dosage: 'ماهی یکبار تزریقی',
    hasPrescription: true,
    date: '1403/07/14',
    status: 'delivered',
    isPaid: true,
    price: 180000
  },
  {
    id: 5,
    code: 'MED-1005',
    owner: 'حسین نوری',
    phone: '0916-789-0123',
    pet: 'باکی',
    petType: 'سگ',
    medicine: 'قرص ضد انگل',
    dosage: 'ماهی یکبار',
    hasPrescription: false,
    date: '1403/07/13',
    status: 'pending',
    isPaid: false
  },
  {
    id: 6,
    code: 'MED-1006',
    owner: 'مریم حسینی',
    phone: '0917-890-1234',
    pet: 'چارلی',
    petType: 'گربه',
    medicine: 'آنتی‌هیستامین',
    dosage: '10mg - روزی یکبار',
    hasPrescription: true,
    date: '1403/07/13',
    status: 'ready',
    isPaid: true
  },
  {
    id: 7,
    code: 'MED-1007',
    owner: 'رضا احمدی',
    phone: '0918-901-2345',
    pet: 'دیزی',
    petType: 'سگ',
    medicine: 'قطره چشمی',
    dosage: 'دو بار در روز',
    hasPrescription: false,
    date: '1403/07/12',
    status: 'delivered',
    isPaid: true
  },
  {
    id: 8,
    code: 'MED-1008',
    owner: 'سارا مرادی',
    phone: '0919-012-3456',
    pet: 'کوکی',
    petType: 'گربه',
    medicine: 'آنتی‌بیوتیک سفالکسین',
    dosage: '250mg - سه بار در روز',
    hasPrescription: true,
    date: '1403/07/12',
    status: 'processing',
    isPaid: true
  },
  {
    id: 9,
    code: 'MED-1009',
    owner: 'امیر کاظمی',
    phone: '0910-123-4567',
    pet: 'رکس',
    petType: 'سگ',
    medicine: 'واکسن هاری',
    dosage: 'سالی یکبار',
    hasPrescription: true,
    date: '1403/07/11',
    status: 'delivered',
    isPaid: true
  },
  {
    id: 10,
    code: 'MED-1010',
    owner: 'نرگس امینی',
    phone: '0911-234-5678',
    pet: 'لئو',
    petType: 'گربه',
    medicine: 'قطره گوش',
    dosage: 'روزی دو بار',
    hasPrescription: false,
    date: '1403/07/11',
    status: 'ready',
    isPaid: true
  }
])

const allFilteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Filter by status
    if (filters.value.status && order.status !== filters.value.status) {
      return false
    }
    
    // Filter by type
    if (filters.value.type === 'prescription' && !order.hasPrescription) {
      return false
    }
    if (filters.value.type === 'no-prescription' && order.hasPrescription) {
      return false
    }
    
    // Filter by date range
    if (filters.value.fromDate || filters.value.toDate) {
      const orderDate = moment(order.date, 'jYYYY/jMM/jDD')
      
      if (filters.value.fromDate) {
        const fromDate = moment(filters.value.fromDate, 'jYYYY/jMM/jDD')
        if (orderDate.isBefore(fromDate, 'day')) {
          return false
        }
      }
      
      if (filters.value.toDate) {
        const toDate = moment(filters.value.toDate, 'jYYYY/jMM/jDD')
        if (orderDate.isAfter(toDate, 'day')) {
          return false
        }
      }
    }
    
    // Filter by search
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      return order.owner.toLowerCase().includes(search) || 
             order.code.toLowerCase().includes(search) ||
             order.pet.toLowerCase().includes(search)
    }
    
    return true
  })
})

const totalPages = computed(() => {
  return Math.ceil(allFilteredOrders.value.length / pageSize.value)
})

const displayedPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  
  if (totalPages.value <= maxPagesToShow) {
    // Show all pages if total is less than max
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Show current page with 2 pages before and after
    let startPage = Math.max(1, currentPage.value - 2)
    let endPage = Math.min(totalPages.value, currentPage.value + 2)
    
    // Adjust if we're near the beginning or end
    if (currentPage.value <= 3) {
      endPage = Math.min(maxPagesToShow, totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      startPage = Math.max(1, totalPages.value - maxPagesToShow + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const filteredOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allFilteredOrders.value.slice(start, end)
})

// Reset to page 1 when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-orange-50 text-orange-700',
    processing: 'bg-blue-50 text-blue-700',
    'waiting-customer': 'bg-amber-50 text-amber-700',
    ready: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700'
  }
  return classes[status] || 'bg-gray-50 text-gray-700'
}

const getStatusIcon = (status) => {
  const icons = {
    pending: 'ti ti-clock',
    processing: 'ti ti-loader',
    'waiting-customer': 'ti ti-user-check',
    ready: 'ti ti-package',
    delivered: 'ti ti-check',
    rejected: 'ti ti-x'
  }
  return icons[status] || 'ti ti-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'در انتظار تایید',
    processing: 'در انتظار پرداخت',
    'waiting-customer': 'در انتظار تایید مشتری',
    ready: 'آماده تحویل',
    delivered: 'تحویل شده',
    rejected: 'رد شده'
  }
  return labels[status] || 'نامشخص'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const downloadPrescription = (order) => {
  // Simulate download - در production باید از API واقعی استفاده شود
  console.log('Downloading prescription for:', order.code)
  // Example: window.open(`/api/prescriptions/${order.id}/download`, '_blank')
  
  // Mock download
  const link = document.createElement('a')
  link.href = '#'
  link.download = `prescription-${order.code}.pdf`
  link.click()
}

const viewDetails = (order) => {
  router.push(`/pharmacies/medicine-orders/${order.id}`)
}

const downloadReceipt = async (order) => {
  if (!order.isPaid) {
    notification.warning('پرداخت نشده', 'این سفارش هنوز پرداخت نشده است!')
    return
  }

  try {
    // Import libraries
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')
    
    // بارگذاری فونت Vazir
    const fontLink = document.createElement('link')
    fontLink.href = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)
    
    // صبر کنیم تا فونت لود بشه
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // ایجاد المنت HTML موقت برای فاکتور
    const receiptDiv = document.createElement('div')
    receiptDiv.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 800px;
      background: white;
      padding: 40px;
      font-family: Vazir, Tahoma, Arial, sans-serif;
      direction: rtl;
      color: #000;
    `
    
    receiptDiv.innerHTML = `
      <div style="border: 2px solid #000; padding: 30px;">
        <!-- لوگو و عنوان -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="/pet.png" alt="لوگو" style="width: 100px; height: 130px; object-fit: contain; margin: 0 auto 10px; display: block; border: 1px solid #ddd; border-radius: 8px; padding: 8px;">
        </div>
        
        <!-- هدر -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">داروخانه پتومن</h1>
          <h2 style="font-size: 18px; margin: 0; color: #666;">رسید سفارش دارو</h2>
        </div>
        
        <div style="border-top: 1px solid #000; margin: 20px 0;"></div>
        
        <!-- شماره و تاریخ -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px;">
          <div><strong>شماره فاکتور:</strong> ${order.code}</div>
          <div><strong>تاریخ:</strong> ${order.date}</div>
        </div>
        
        <div style="border-top: 1px solid #000; margin: 20px 0;"></div>
        
        <!-- مشخصات مشتری -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">مشخصات مشتری:</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
            <tr>
              <td style="border: 1px solid #000; padding: 10px; width: 50%;"><strong>نام:</strong> ${order.owner}</td>
              <td style="border: 1px solid #000; padding: 10px; width: 50%;"><strong>تلفن:</strong> ${order.phone}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 10px;"><strong>حیوان خانگی:</strong> ${order.pet}</td>
              <td style="border: 1px solid #000; padding: 10px;"><strong>نوع:</strong> ${order.petType}</td>
            </tr>
          </table>
        </div>
        
        <!-- مشخصات دارو -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">مشخصات دارو:</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
            <tr>
              <td style="border: 1px solid #000; padding: 10px;"><strong>نام دارو:</strong> ${order.medicine}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 10px;"><strong>دوز مصرف:</strong> ${order.dosage}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 10px;">${order.hasPrescription ? '<strong>✓ با نسخه پزشک</strong>' : 'بدون نسخه'}</td>
            </tr>
          </table>
        </div>
        

        
        <div style="border-top: 1px solid #000; margin: 20px 0;"></div>
        
        <!-- فوتر -->
        <div style="text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">این فاکتور به صورت الکترونیکی صادر شده است</p>
          <p style="margin: 5px 0;">تلفن: 021-12345678 | آدرس: تهران، خیابان مرکزی، پلاک 123</p>
        </div>
      </div>
    `
    
    document.body.appendChild(receiptDiv)
    
    // تبدیل HTML به Canvas
    const canvas = await html2canvas(receiptDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    // حذف المنت موقت
    document.body.removeChild(receiptDiv)
    
    // تبدیل Canvas به PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`receipt-${order.code}.pdf`)
    
    notification.success('دانلود موفق', 'رسید PDF با موفقیت دانلود شد!')
    
  } catch (error) {
    console.error('Error generating receipt:', error)
    notification.error('خطا', 'خطا در تولید رسید PDF')
  }
}

const approveOrder = (order, note, totalPrice, medicines, discountInfo) => {
  // Update order status
  const orderIndex = orders.value.findIndex(o => o.id === order.id)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'processing'
    orders.value[orderIndex].note = note
    orders.value[orderIndex].price = totalPrice || 0
    orders.value[orderIndex].medicines = medicines || []
    
    // ذخیره اطلاعات تخفیف
    if (discountInfo) {
      orders.value[orderIndex].discountInfo = discountInfo
    }
  }
  
  // Show success message
  let message = `سفارش ${order.code} تایید شد و در حال آماده‌سازی است.`
  
  if (medicines.length > 0) {
    message += `\nتعداد داروها: ${medicines.length}`
  }
  
  if (totalPrice) {
    message += `\nمبلغ کل: ${new Intl.NumberFormat('fa-IR').format(totalPrice)} تومان`
    
    // نمایش اطلاعات تخفیف در پیام
    if (discountInfo) {
      if (discountInfo.totalProductDiscount > 0) {
        message += `\nتخفیف محصولات: ${new Intl.NumberFormat('fa-IR').format(discountInfo.totalProductDiscount)} تومان`
      }
      if (discountInfo.hasOverallDiscount && discountInfo.overallDiscountAmount > 0) {
        message += `\nتخفیف کلی: ${new Intl.NumberFormat('fa-IR').format(discountInfo.overallDiscountAmount)} تومان`
      }
    }
  }
  
  if (note) {
    message += '\n' + note
  }
  
  notification.success('تایید سفارش', message)
  
  // Close modal
  showOrderModal.value = false
  
  // In production, send to API
  // await $fetch(`/api/orders/${order.id}/approve`, { method: 'POST', body: { note, totalPrice, medicines, discountInfo } })
}

const rejectOrder = (order, note) => {
  // Update order status to rejected instead of removing
  const orderIndex = orders.value.findIndex(o => o.id === order.id)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'rejected'
    orders.value[orderIndex].note = note
  }
  
  // Show rejection message
  notification.error('رد سفارش', `سفارش ${order.code} رد شد.${note ? '\nدلیل: ' + note : ''}`)
  
  // Close modal
  showOrderModal.value = false
  
  // In production, send to API
  // await $fetch(`/api/orders/${order.id}/reject`, { method: 'POST', body: { note } })
}

const setWaitingForCustomer = (order, note) => {
  // Update order status to waiting for customer confirmation
  const orderIndex = orders.value.findIndex(o => o.id === order.id)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'waiting-customer'
    if (note) {
      orders.value[orderIndex].note = note
    }
  }
  
  // Show success message
  notification.info('در انتظار تایید مشتری', `سفارش ${order.code} در انتظار تایید مشتری قرار گرفت.${note ? '\n' + note : ''}`)
  
  // Close modal
  showOrderModal.value = false
  
  // In production, send to API and notification to customer
  // await $fetch(`/api/orders/${order.id}/waiting-customer`, { method: 'POST', body: { note } })
}

const quickApproveOrder = (orderId) => {
  // تایید سریع سفارش بدون نیاز به باز کردن مودال
  const orderIndex = orders.value.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'processing'
  }
  
  // Show success message
  notification.success('تایید سریع', 'سفارش تایید شد و در حال آماده‌سازی است.')
  
  // In production, send to API
  // await $fetch(`/api/orders/${orderId}/approve`, { method: 'POST' })
}



</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
