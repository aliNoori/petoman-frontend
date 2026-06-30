<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت سفارشات</h1>
        <p class="text-gray-500 mt-1">تمام سفارشات سیستم</p>
      </div>
      <button @click="exportOrders" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
        <i class="ti ti-file-spreadsheet text-green-600"></i>
        خروجی اکسل
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <i class="ti ti-shopping-cart text-blue-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کل سفارشات</p>
            <!-- نمایش تعداد کل آیتم‌های موجود در استور -->
            <p class="text-xl font-bold text-gray-900">{{ orders?.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <i class="ti ti-clock text-yellow-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">در انتظار</p>
            <!-- اصلاح شده: تطبیق با استاتوس API -->
            <p class="text-xl font-bold text-gray-900">{{ orders?.filter(o => o.status === 'CUSTOMER_PENDING').length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-green-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">تحویل شده</p>
            <!-- اصلاح شده: تطبیق با استاتوس API -->
            <p class="text-xl font-bold text-gray-900">{{ orders?.filter(o => o.status === 'CUSTOMER_DELIVERED').length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <i class="ti ti-currency-dollar text-purple-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">کل فروش</p>
            <p class="text-xl font-bold text-gray-900">{{ formatPrice(totalSales) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input v-model="filters.search" type="text" placeholder="کد سفارش، نام مشتری..." class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg" />
        </div>
        <AppSelect
            v-model="filters.type"
            :options="orderTypeOptions"
            placeholder="همه انواع"
            icon="ti ti-category"
        />
        <AppSelect
            v-model="filters.status"
            :options="orderStatusOptions"
            placeholder="همه وضعیت‌ها"
            icon="ti ti-filter"
        />
        <PersianDatePicker
            v-model="filters.date"
            type="text"
            placeholder="تاریخ (مثال: ۱۴۰۳/۰۱/۰۱)"
            class="border border-gray-300 rounded-lg text-right"
            dir="rtl"
        />
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Loading Overlay -->
      <div v-if="loading" class="min-h-[300px] flex items-center justify-center">
        <i class="ti ti-loader animate-spin text-3xl text-indigo-600"></i>
      </div>

      <div v-else>
        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">کد سفارش</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مشتری</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">فروشنده</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">نوع</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مبلغ</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">تاریخ</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">وضعیت</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">عملیات</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                موردی یافت نشد.
              </td>
            </tr>
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-mono font-bold text-gray-900">{{ order.code }}</td>
              <td class="px-6 py-4">
                <p class="text-gray-900">{{ order.customer }}</p>
                <p class="text-xs text-gray-500">{{ order.phone }}</p>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ order.seller }}</td>
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
              <td class="px-6 py-4">
                <button @click="viewOrder(order)" class="p-2 hover:bg-gray-100 rounded-lg">
                  <i class="ti ti-eye text-gray-600"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden divide-y divide-gray-100">
          <div v-if="filteredOrders.length === 0" class="p-8 text-center text-gray-500">
            موردی یافت نشد.
          </div>
          <div v-for="order in filteredOrders" :key="order.id" class="p-4">
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-mono font-bold text-gray-900">{{ order.code }}</p>
                <p class="text-sm text-gray-600">{{ order.customer }}</p>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900">{{ formatPrice(order.total) }} تومان</span>
              <span class="text-xs text-gray-500">{{ order.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <p class="text-sm text-gray-500">
          صفحه {{ currentPage }} از {{ totalPages || 1 }}
        </p>
        <div class="flex gap-2">
          <button
              @click="prevPage"
              :disabled="currentPage === 1 || loading || totalPages === 0"
              class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <i class="ti ti-chevron-right"></i>
            قبلی
          </button>
          <button
              @click="nextPage"
              :disabled="currentPage === totalPages || loading || totalPages === 0"
              class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            بعدی
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal: جزئیات سفارش -->
  <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">جزئیات سفارش {{ selectedOrder.code }}</h3>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <i class="ti ti-x text-gray-500"></i>
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- اطلاعات مشتری و فروشنده -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-xs text-gray-500 mb-1">مشتری</p>
            <p class="font-bold text-gray-900">{{ selectedOrder.customer }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ selectedOrder.phone }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-xs text-gray-500 mb-1">فروشنده</p>
            <p class="font-bold text-gray-900">{{ selectedOrder.seller }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium" :class="getTypeClass(selectedOrder.type)">
              {{ getTypeLabel(selectedOrder.type) }}
            </span>
          </div>
        </div>

        <!-- اطلاعات سفارش -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-gray-500">مبلغ کل</p>
            <p class="font-bold text-gray-900">{{ formatPrice(selectedOrder.total) }} <span class="text-xs font-normal">تومان</span></p>
          </div>
          <div>
            <p class="text-xs text-gray-500">تاریخ ثبت</p>
            <p class="font-medium text-gray-900">{{ selectedOrder.date }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-gray-500">وضعیت</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1" :class="getStatusClass(selectedOrder.status)">
              {{ getStatusLabel(selectedOrder.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import { useOrderStore } from "@/stores/admin/order.js";
import PersianDatePicker from "@/components/PersianDatePicker.vue";

const orderStore = useOrderStore()
// --- متغیرهای مودال ---
const selectedOrder = ref(null)

const viewOrder = (order) => {
  selectedOrder.value = order
}

const closeModal = () => {
  selectedOrder.value = null
}
// --- اصلاحیه مهم: تعریف ایمن orders ---
// این خط باعث می‌شود اگر استور خالی بود، ارور ندهد
const orders = computed(() => orderStore.orders || [])

// --- ۱. فیلترها ---
const filters = ref({
  search: '',
  type: '',
  status: '',
  date: ''
})

const orderTypeOptions = [
  { value: '', label: 'همه انواع' },
  { value: 'MARKET', label: 'پت‌شاپ', icon: 'ti ti-building-store' },
  { value: 'PHARMACY', label: 'داروخانه', icon: 'ti ti-pill' },
  { value: 'VET', label: 'دامپزشک', icon: 'ti ti-stethoscope' },
  { value: 'CLINIC', label: 'کلینیک', icon: 'ti ti-activity-heart' }
]

const orderStatusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'CUSTOMER_PENDING', label: 'در انتظار', icon: 'ti ti-clock' },
  { value: 'CUSTOMER_PAID', label: 'پرداخت شده', icon: 'ti ti-credit-card' },
  { value: 'TENANT_PROCESSING', label: 'در حال پردازش', icon: 'ti ti-loader' },
  { value: 'TENANT_SHIPPED', label: 'ارسال شده', icon: 'ti ti-truck' },
  { value: 'CUSTOMER_DELIVERED', label: 'تحویل شده', icon: 'ti ti-check' },
  { value: 'CUSTOMER_CANCELLED', label: 'لغو شده', icon: 'ti ti-x' },
]

// --- ۲. توابع کمکی ---
const getStatusLabel = (status) => {
  if (!status) return 'نامشخص'
  const map = {
    'CUSTOMER_PENDING': 'در انتظار',
    'CUSTOMER_PAID': 'پرداخت شده',
    'TENANT_PROCESSING': 'در حال پردازش',
    'TENANT_SHIPPED': 'ارسال شده',
    'CUSTOMER_DELIVERED': 'تحویل شده',
    'CUSTOMER_CANCELLED': 'لغو شده',
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700'
  const map = {
    'CUSTOMER_PENDING': 'bg-yellow-100 text-yellow-700',
    'CUSTOMER_PAID': 'bg-blue-100 text-blue-700',
    'TENANT_PROCESSING': 'bg-indigo-100 text-indigo-700',
    'TENANT_SHIPPED': 'bg-purple-100 text-purple-700',
    'CUSTOMER_DELIVERED': 'bg-green-100 text-green-700',
    'CUSTOMER_CANCELLED': 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const getTypeLabel = (type) => {
  const map = {
    'MARKET': 'پت‌شاپ',
    'PHARMACY': 'داروخانه',
    'VET': 'دامپزشک',
    'CLINIC': 'کلینیک'
  }
  return map[type] || type || 'نامشخص'
}

const getTypeClass = (type) => {
  const map = {
    'MARKET': 'bg-orange-100 text-orange-700',
    'PHARMACY': 'bg-teal-100 text-teal-700',
    'VET': 'bg-purple-100 text-purple-700',
    'CLINIC': 'bg-rose-100 text-rose-700'
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

// --- ۳. پردازش داده‌ها ---
const formattedOrders = computed(() => {
  // استفاده از orders.value که بالاتر تعریف کردیم
  if (!orders.value || !Array.isArray(orders.value)) {
    return []
  }
  return orders.value.map(order => {
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

// --- ۴. فیلترینگ ---
const filteredOrders = computed(() => {
  return formattedOrders.value.filter(o => {

    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      const matchCode = String(o.code).toLowerCase().includes(searchLower)
      const matchCustomer = o.customer.toLowerCase().includes(searchLower)
      if (!matchCode && !matchCustomer) return false
    }
    if (filters.value.type && o.type !== filters.value.type) return false
    if (filters.value.status && o.status !== filters.value.status) return false

    if (filters.value.date && o.date !== filters.value.date) return false


    return true
  })
})

const totalSales = computed(() => {
  if (orderStore.stats?.totalRevenue) {
    return orderStore.stats.totalRevenue
  }
  return filteredOrders.value.reduce((sum, o) => sum + Number(o.total || 0), 0)
})

const formatPrice = (p) => {
  return new Intl.NumberFormat('fa-IR').format(p)
}

// --- ۵. مدیریت صفحه‌بندی ---
const currentPage = computed(() => orderStore.pagination?.page || 1)
const totalPages = computed(() => orderStore.pagination?.totalPages || 0)
const loading = computed(() => orderStore.loading || false)

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    orderStore.fetchTenantAllOrders(currentPage.value + 1, 10)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    orderStore.fetchTenantAllOrders(currentPage.value - 1, 10)
  }
}

// --- ۶. خروجی اکسل ---
const exportOrders = () => {
  const data = filteredOrders.value.map(order => ({
    'کد سفارش': order.code,
    'مشتری': order.customer,
    'شماره موبایل': order.phone,
    'نوع': getTypeLabel(order.type),
    'مبلغ (تومان)': order.total,
    'تاریخ': order.date,
    'وضعیت': getStatusLabel(order.status)
  }))

  if (data.length === 0) {
    alert('داده‌ای برای خروجی وجود ندارد')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
        headers.map(h => {
          let val = row[h]
          if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
            val = `"${val.replace(/"/g, '""')}"`
          }
          return val
        }).join(',')
    )
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `سفارشات-${new Date().toLocaleDateString('fa-IR')}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// --- ۷. لایف‌سایکل ---
onMounted(() => {
  orderStore.fetchTenantAllOrders(1, 10)
})
</script>