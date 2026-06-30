<template>
  <div>
    <!-- Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">اعلان‌ها</h1>
          <p class="text-gray-600 mt-1">همه اعلان‌ها و اطلاعیه‌های شما</p>
        </div>
        <div class="flex items-center space-x-3 space-x-reverse">
          <button @click="markAllAsRead" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i class="ti ti-checks w-4 h-4 ml-2"></i>
            همه را خوانده شده علامت بزن
          </button>
          <button @click="clearAllNotifications" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <i class="ti ti-trash w-4 h-4 ml-2"></i>
            پاک کردن همه
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 space-x-reverse">
          <AppSelect
            v-model="filterType"
            :options="filterTypeOptions"
            placeholder="همه اعلان‌ها"
            icon="ti ti-filter"
          />
          <AppSelect
            v-model="filterDate"
            :options="filterDateOptions"
            placeholder="همه تاریخ‌ها"
            icon="ti ti-calendar"
          />
        </div>
        <div class="flex items-center space-x-3 space-x-reverse">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در اعلان‌ها..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="space-y-4">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        @click="markAsRead(notification)"
        class="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        :class="{ 'border-r-4 border-blue-500': !notification.read }"
      >
        <div class="p-6">
          <div class="flex items-start">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center ml-4"
                 :class="getNotificationIconClass(notification.type)">
              <i :class="getNotificationIcon(notification.type)" class="text-lg"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium text-gray-900">{{ notification.title }}</h3>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span class="text-sm text-gray-500">{{ formatDate(notification.date) }}</span>
                </div>
              </div>
              <p class="text-gray-600 mb-3">{{ notification.message }}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ notification.typeText }}</span>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button v-if="notification.action" @click.stop="handleAction(notification)" class="text-sm text-blue-600 hover:text-blue-700">
                    {{ notification.actionText }}
                  </button>
                  <button @click.stop="deleteNotification(notification)" class="text-sm text-red-600 hover:text-red-700">
                    <i class="ti ti-trash w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredNotifications.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-bell-off text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">اعلانی وجود ندارد</h3>
        <p class="text-gray-500">در حال حاضر اعلان جدیدی ندارید</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSelect from '@/components/AppSelect.vue'

const router = useRouter()

// Reactive data
const searchQuery = ref('')
const filterType = ref('all')
const filterDate = ref('all')

// Options for filters
const filterTypeOptions = [
  { value: 'all', label: 'همه اعلان‌ها' },
  { value: 'unread', label: 'خوانده نشده' },
  { value: 'orders', label: 'سفارشات' },
  { value: 'system', label: 'سیستمی' }
]

const filterDateOptions = [
  { value: 'all', label: 'همه تاریخ‌ها' },
  { value: 'today', label: 'امروز' },
  { value: 'week', label: 'این هفته' },
  { value: 'month', label: 'این ماه' }
]

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    title: 'سفارش جدید دریافت شد',
    message: 'یک سفارش جدید با شماره ۱۰۰۱ دریافت شده است. لطفا برای پردازش اقدام کنید.',
    type: 'orders',
    typeText: 'سفارشات',
    date: new Date(),
    read: false,
    action: 'view',
    actionText: 'مشاهده سفارش'
  },
  {
    id: 2,
    title: 'مدارک شما تایید شد',
    message: 'مدارک پروانه کسب شما با موفقیت تایید و فعال شد.',
    type: 'system',
    typeText: 'سیستمی',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    action: null,
    actionText: ''
  },
  {
    id: 4,
    title: 'به‌روزرسانی سیستم',
    message: 'سیستم با موفقیت به نسخه جدید بروزرسانی شد.',
    type: 'system',
    typeText: 'سیستمی',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    action: null,
    actionText: ''
  },
  {
    id: 5,
    title: 'سفارش آماده تحویل',
    message: 'سفارش شماره ۹۹۸ آماده تحویل به مشتری است.',
    type: 'orders',
    typeText: 'سفارشات',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    action: 'deliver',
    actionText: 'تحویل سفارش'
  }
])

// Computed
const filteredNotifications = computed(() => {
  return notifications.value.filter(notification => {
    // Filter by type
    if (filterType.value !== 'all' && notification.type !== filterType.value) {
      if (filterType.value === 'unread' && notification.read) return false
      if (filterType.value !== 'unread' && notification.type !== filterType.value) return false
    }

    // Filter by date
    if (filterDate.value !== 'all') {
      const now = new Date()
      const notificationDate = new Date(notification.date)

      switch (filterDate.value) {
        case 'today':
          if (notificationDate.toDateString() !== now.toDateString()) return false
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (notificationDate < weekAgo) return false
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (notificationDate < monthAgo) return false
          break
      }
    }

    // Filter by search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return notification.title.toLowerCase().includes(query) ||
             notification.message.toLowerCase().includes(query)
    }

    return true
  })
})

// Methods
const getNotificationIcon = (type) => {
  const icons = {
    orders: 'ti ti-shopping-cart',
    system: 'ti ti-info-circle'
  }
  return icons[type] || 'ti ti-bell'
}

const getNotificationIconClass = (type) => {
  const classes = {
    orders: 'bg-blue-100 text-blue-600',
    system: 'bg-green-100 text-green-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatDate = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'همین الان'
  if (minutes < 60) return `${minutes} دقیقه پیش`
  if (hours < 24) return `${hours} ساعت پیش`
  if (days < 7) return `${days} روز پیش`

  return new Date(date).toLocaleDateString('fa-IR')
}

const markAsRead = (notification) => {
  notification.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const deleteNotification = (notification) => {
  const index = notifications.value.findIndex(n => n.id === notification.id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAllNotifications = () => {
  if (confirm('آیا از پاک کردن همه اعلان‌ها اطمینان دارید؟')) {
    notifications.value = []
  }
}

const handleAction = (notification) => {
  switch (notification.action) {
    case 'view':
      // Navigate to orders page
      router.push('/markets/products/product-orders')
      break
    case 'deliver':
      // Navigate to orders page
      router.push('/markets/products/product-orders')
      break
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>



