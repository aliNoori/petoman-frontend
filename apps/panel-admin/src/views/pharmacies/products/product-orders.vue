<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
            <i class="ti ti-shopping-cart text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">کل سفارشات</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">89</h3>
          <p class="text-xs text-gray-500 mt-1">این ماه</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 mb-3">
            <i class="ti ti-check text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">تحویل شده</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">76</h3>
          <p class="text-xs text-gray-500 mt-1">85% موفقیت</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
            <i class="ti ti-loader text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">در انتظار پرداخت</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">13</h3>
          <p class="text-xs text-gray-500 mt-1">پرداخت نشده</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200 hover:shadow-lg transition-all">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3">
            <i class="ti ti-truck text-white text-2xl lg:text-3xl"></i>
          </div>
          <p class="text-xs lg:text-sm font-medium text-gray-600 mb-1">در حال ارسال</p>
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900">8</h3>
          <p class="text-xs text-gray-500 mt-1">در راه</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
          <div class="relative">
            <button
              @click="showStatusDropdown = !showStatusDropdown"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:border-teal-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all flex items-center justify-between text-right"
            >
              <span class="text-gray-900">{{ getStatusFilterLabel() }}</span>
              <i class="ti ti-chevron-down text-gray-400 transition-transform" :class="{ 'rotate-180': showStatusDropdown }"></i>
            </button>
            
            <Transition name="dropdown">
              <div v-if="showStatusDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <ul class="py-2">
                  <li 
                    @click="selectStatusFilter('')"
                    class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': filters.status === '' }"
                  >
                    <span :class="filters.status === '' ? 'text-teal-700 font-medium' : 'text-gray-700'">همه</span>
                    <i v-if="filters.status === ''" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectStatusFilter('processing')"
                    class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': filters.status === 'processing' }"
                  >
                    <span :class="filters.status === 'processing' ? 'text-teal-700 font-medium' : 'text-gray-700'">در انتظار پرداخت</span>
                    <i v-if="filters.status === 'processing'" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectStatusFilter('shipped')"
                    class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': filters.status === 'shipped' }"
                  >
                    <span :class="filters.status === 'shipped' ? 'text-teal-700 font-medium' : 'text-gray-700'">در حال ارسال</span>
                    <i v-if="filters.status === 'shipped'" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectStatusFilter('delivered')"
                    class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': filters.status === 'delivered' }"
                  >
                    <span :class="filters.status === 'delivered' ? 'text-teal-700 font-medium' : 'text-gray-700'">تحویل شده</span>
                    <i v-if="filters.status === 'delivered'" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectStatusFilter('cancelled')"
                    class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': filters.status === 'cancelled' }"
                  >
                    <span :class="filters.status === 'cancelled' ? 'text-teal-700 font-medium' : 'text-gray-700'">لغو شده</span>
                    <i v-if="filters.status === 'cancelled'" class="ti ti-check text-teal-600"></i>
                  </li>
                  <li 
                    @click="selectStatusFilter('rejected')"
                    class="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
                    :class="{ 'bg-teal-50': filters.status === 'rejected' }"
                  >
                    <span :class="filters.status === 'rejected' ? 'text-teal-700 font-medium' : 'text-gray-700'">رد شده</span>
                    <i v-if="filters.status === 'rejected'" class="ti ti-check text-teal-600"></i>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
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
              placeholder="نام مشتری یا کد سفارش..."
              class="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <i class="ti ti-shopping-cart text-white text-xl"></i>
            </div>
            <div>
              <p class="font-bold text-gray-900 font-mono">{{ order.code }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ order.items.length }} محصول</p>
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
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <i class="ti ti-user text-gray-600 text-sm"></i>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ order.customer }}</p>
            <p class="text-xs text-gray-500">{{ order.phone }}</p>
          </div>
        </div>

        <!-- Products List -->
        <div class="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
          <div 
            v-for="(item, index) in order.items.slice(0, 3)" 
            :key="index"
            class="flex items-center gap-2"
          >
            <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <i :class="`ti ${item.icon} text-purple-600 text-sm`"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-500">تعداد: {{ item.quantity }}</p>
            </div>
          </div>
          <p v-if="order.items.length > 3" class="text-xs text-purple-600 font-medium text-center pt-2 border-t border-gray-200">
            + {{ order.items.length - 3 }} محصول دیگر
          </p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-200">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <i class="ti ti-calendar"></i>
              <span>{{ order.date }}</span>
            </div>
            <div>
              <span v-if="order.isPaid" class="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                <i class="ti ti-check text-xs"></i>
                پرداخت شده
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                <i class="ti ti-x text-xs"></i>
                پرداخت نشده
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-left">
              <p class="text-lg font-bold text-gray-900">{{ formatMoney(order.total) }}</p>
              <p class="text-xs text-gray-500">تومان</p>
            </div>
            <div class="flex items-center gap-1">
              <button 
                @click="viewDetails(order)"
                class="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                title="مشاهده جزئیات"
              >
                <i class="ti ti-eye"></i>
              </button>
              <button 
                @click="printOrder(order)"
                class="p-2 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg transition-colors"
                title="دانلود فاکتور"
              >
                <i class="ti ti-printer"></i>
              </button>
            </div>
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
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">مشتری</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">محصولات</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">مبلغ</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">وضعیت</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">وضعیت پرداخت</th>
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
                  <p class="font-medium text-gray-900">{{ order.customer }}</p>
                  <p class="text-sm text-gray-500">{{ order.phone }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div v-for="(item, index) in order.items.slice(0, 2)" :key="index" class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <i :class="`ti ${item.icon} text-gray-600`"></i>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">تعداد: {{ item.quantity }}</p>
                    </div>
                  </div>
                  <p v-if="order.items.length > 2" class="text-xs text-teal-600 font-medium">
                    + {{ order.items.length - 2 }} محصول دیگر
                  </p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-right">
                  <p class="font-bold text-gray-900">{{ formatMoney(order.total) }}</p>
                  <p class="text-xs text-gray-500">تومان</p>
                </div>
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
                <span v-if="order.isPaid" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <i class="ti ti-check"></i>
                  پرداخت شده
                </span>
                <span v-else class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <i class="ti ti-x"></i>
                  پرداخت نشده
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="viewDetails(order)"
                    class="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors" 
                    title="جزئیات"
                  >
                    <i class="ti ti-eye"></i>
                  </button>
                  <button 
                    @click="printOrder(order)"
                    class="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors" 
                    title="دانلود فاکتور PDF"
                  >
                    <i class="ti ti-printer"></i>
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

  <!-- Product Order Details Modal -->
  <ProductOrderDetailsModal
    :show="showOrderModal"
    :order="selectedOrder"
    @close="showOrderModal = false"
    @change-status="changeStatus"
    @print="printOrder"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment-jalaali'
import { useNotification } from '@/composables/useNotification'

// استفاده از notification
const notification = useNotification()
const router = useRouter()

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
const selectedOrder = ref(null)

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
    'online': 'آنلاین',
    'phone': 'تلفنی',
    'in-person': 'حضوری'
  }
  return labels[filters.value.type] || 'همه'
}

const orders = ref([
  {
    id: 1,
    code: 'ORD-2001',
    customer: 'رضا محمدی',
    phone: '0912-345-6789',
    type: 'online',
    items: [
      { name: 'غذای خشک سگ', icon: 'ti-package', quantity: 2 },
      { name: 'قلاده چرمی', icon: 'ti-circle', quantity: 1 }
    ],
    total: 850000,
    date: '1403/07/20',
    status: 'pending',
    isPaid: false,
    note: ''
  },
  {
    id: 2,
    code: 'ORD-2002',
    customer: 'سارا کریمی',
    phone: '0913-456-7890',
    type: 'phone',
    items: [
      { name: 'اسباب بازی گربه', icon: 'ti-ball-tennis', quantity: 3 },
      { name: 'ظرف غذا', icon: 'ti-bowl', quantity: 1 }
    ],
    total: 320000,
    date: '1403/07/20',
    status: 'pending',
    isPaid: false,
    note: ''
  },
  {
    id: 3,
    code: 'ORD-2003',
    customer: 'علی احمدی',
    phone: '0914-567-8901',
    type: 'in-person',
    items: [
      { name: 'شامپو سگ', icon: 'ti-bottle', quantity: 1 },
      { name: 'برس مخصوص', icon: 'ti-brush', quantity: 1 },
      { name: 'قیچی ناخن', icon: 'ti-scissors', quantity: 1 }
    ],
    total: 450000,
    date: '1403/07/19',
    status: 'processing',
    isPaid: false
  },
  {
    id: 4,
    code: 'ORD-2004',
    customer: 'فاطمه نوری',
    phone: '0915-678-9012',
    type: 'phone',
    items: [
      { name: 'غذای گربه', icon: 'ti-package', quantity: 4 }
    ],
    total: 680000,
    date: '1403/07/19',
    status: 'delivered',
    isPaid: true
  },
  {
    id: 5,
    code: 'ORD-2005',
    customer: 'محمد رضایی',
    phone: '0916-789-0123',
    type: 'online',
    items: [
      { name: 'جعبه حمل', icon: 'ti-briefcase', quantity: 1 },
      { name: 'بستر نرم', icon: 'ti-bed', quantity: 1 }
    ],
    total: 1250000,
    date: '1403/07/18',
    status: 'pending',
    isPaid: false
  },
  {
    id: 6,
    code: 'ORD-2006',
    customer: 'زهرا حسینی',
    phone: '0917-890-1234',
    type: 'in-person',
    items: [
      { name: 'توپ بازی', icon: 'ti-ball-tennis', quantity: 2 },
      { name: 'تشویقی', icon: 'ti-candy', quantity: 5 }
    ],
    total: 280000,
    date: '1403/07/18',
    status: 'ready',
    isPaid: true
  },
  {
    id: 7,
    code: 'ORD-2007',
    customer: 'حسین کاظمی',
    phone: '0918-901-2345',
    type: 'online',
    items: [
      { name: 'لباس زمستانی', icon: 'ti-shirt', quantity: 1 }
    ],
    total: 550000,
    date: '1403/07/17',
    status: 'delivered',
    isPaid: true
  },
  {
    id: 8,
    code: 'ORD-2008',
    customer: 'مریم امینی',
    phone: '0919-012-3456',
    type: 'phone',
    items: [
      { name: 'خاک گربه', icon: 'ti-box', quantity: 3 },
      { name: 'بیلچه', icon: 'ti-tool', quantity: 1 }
    ],
    total: 390000,
    date: '1403/07/17',
    status: 'processing',
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
    if (filters.value.type && order.type !== filters.value.type) {
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
      return order.customer.toLowerCase().includes(search) || 
             order.code.toLowerCase().includes(search)
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

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700'
  }
  return classes[status] || 'bg-gray-50 text-gray-700'
}

const getStatusIcon = (status) => {
  const icons = {
    processing: 'ti ti-loader',
    shipped: 'ti ti-truck',
    delivered: 'ti ti-check',
    cancelled: 'ti ti-x'
  }
  return icons[status] || 'ti ti-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    processing: 'در انتظار پرداخت',
    shipped: 'در حال ارسال',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده'
  }
  return labels[status] || 'نامشخص'
}

const viewDetails = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const changeStatus = (orderId, newStatus) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = newStatus
    notification.success('تغییر وضعیت', `وضعیت سفارش به "${getStatusLabel(newStatus)}" تغییر کرد`)
  }
}

const printOrder = (order) => {
  // ارسال داده‌های سفارش به صفحه چاپ
  try {
    const orderQuery = encodeURIComponent(JSON.stringify(order))
    router.push({
      path: '/pharmacies/products/print-invoice',
      query: { order: orderQuery }
    })
  } catch (error) {
    console.error('Error navigating to invoice:', error)
    notification.error('خطا', 'خطا در باز کردن صفحه فاکتور')
  }
}




const approveOrder = (order, note) => {
  // Update order status
  const orderIndex = orders.value.findIndex(o => o.id === order.id)
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = 'processing'
    orders.value[orderIndex].note = note
  }
  
  // Show success message
  notification.success('تایید سفارش', `سفارش ${order.code} تایید شد و در حال آماده‌سازی است.${note ? '\n' + note : ''}`)
  
  // Close modal
  showOrderModal.value = false
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
