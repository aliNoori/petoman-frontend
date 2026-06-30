<template>
  <div class="p-6">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">خوش آمدید به پتومن</h1>
      <p class="text-gray-600">نمای کلی سیستم مدیریت دامپزشکی</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- کل کاربران -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-sky-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
              <Icon name="tabler:users" class="h-6 w-6 text-sky-600" />
            </div>
          </div>
          <div class="mr-4 flex-1">
            <p class="text-sm font-medium text-gray-600">کل کاربران</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers.toLocaleString('fa-IR') }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <Icon name="tabler:trending-up" class="h-4 w-4 ml-1" />
              +{{ stats.userGrowth }}% این ماه
            </p>
          </div>
        </div>
      </div>

      <!-- کل دامپزشکان -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-emerald-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Icon name="tabler:stethoscope" class="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div class="mr-4 flex-1">
            <p class="text-sm font-medium text-gray-600">دامپزشکان فعال</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalVets.toLocaleString('fa-IR') }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <Icon name="tabler:trending-up" class="h-4 w-4 ml-1" />
              +{{ stats.vetGrowth }}% این ماه
            </p>
          </div>
        </div>
      </div>

      <!-- کل مشاوره‌ها -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-purple-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Icon name="tabler:message-circle" class="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div class="mr-4 flex-1">
            <p class="text-sm font-medium text-gray-600">مشاوره‌های امروز</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.todayConsultations.toLocaleString('fa-IR') }}</p>
            <p class="text-sm text-blue-600 flex items-center">
              <Icon name="tabler:clock" class="h-4 w-4 ml-1" />
              {{ stats.activeConsultations }} فعال
            </p>
          </div>
        </div>
      </div>

      <!-- درآمد -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:border-amber-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Icon name="tabler:coins" class="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div class="mr-4 flex-1">
            <p class="text-sm font-medium text-gray-600">درآمد این ماه</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.monthlyRevenue) }}</p>
            <p class="text-sm text-green-600 flex items-center">
              <Icon name="tabler:trending-up" class="h-4 w-4 ml-1" />
              +{{ stats.revenueGrowth }}% نسبت به ماه قبل
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- مشاوره‌های اخیر -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">مشاورات اخیر</h3>
            <router-link to="/consultations" class="text-sm text-sky-600 hover:text-sky-800 font-medium">مشاهده همه</router-link>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="consultation in recentConsultations" :key="consultation.id" class="flex items-center space-x-4 space-x-reverse">
              <img :src="consultation.petOwner.avatar" :alt="consultation.petOwner.name" class="h-10 w-10 rounded-full">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ consultation.petOwner.name }}</p>
                <p class="text-sm text-gray-500">{{ consultation.pet.name }} - {{ consultation.pet.type }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ consultation.vet.name }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(consultation.createdAt) }}</p>
              </div>
              <span :class="getConsultationStatusClass(consultation.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ getConsultationStatusLabel(consultation.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- نمودار درآمد -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">نمودار درآمد هفتگی</h3>
        </div>
        <div class="p-6">
          <div class="h-64 flex items-end justify-between space-x-2 space-x-reverse">
            <div v-for="(day, index) in weeklyRevenue" :key="index" class="flex flex-col items-center flex-1">
              <div class="w-full bg-sky-100 rounded-t-md relative" :style="{ height: (day.amount / Math.max(...weeklyRevenue.map(d => d.amount))) * 200 + 'px' }">
                <div class="w-full bg-sky-500 rounded-t-md" :style="{ height: '100%' }"></div>
              </div>
              <p class="text-xs text-gray-600 mt-2">{{ day.day }}</p>
              <p class="text-xs font-medium text-gray-900">{{ formatCurrencyShort(day.amount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- کاربران جدید -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">کاربران جدید</h3>
            <router-link to="/users" class="text-sm text-sky-600 hover:text-sky-800 font-medium">مشاهده همه</router-link>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="user in newUsers" :key="user.id" class="flex items-center space-x-3 space-x-reverse">
              <img :src="user.avatar" :alt="user.name" class="h-8 w-8 rounded-full">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
              <span class="text-xs text-gray-500">{{ formatTimeAgo(user.joinDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- وضعیت سیستم -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">وضعیت سیستم</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full ml-3"></div>
                <span class="text-sm text-gray-900">سرور وب</span>
              </div>
              <span class="text-sm text-green-600">عملیاتی</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full ml-3"></div>
                <span class="text-sm text-gray-900">پایگاه داده</span>
              </div>
              <span class="text-sm text-green-600">عملیاتی</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-400 rounded-full ml-3"></div>
                <span class="text-sm text-gray-900">سرور پیام</span>
              </div>
              <span class="text-sm text-yellow-600">هشدار</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full ml-3"></div>
                <span class="text-sm text-gray-900">درگاه پرداخت</span>
              </div>
              <span class="text-sm text-green-600">عملیاتی</span>
            </div>
          </div>
        </div>
      </div>

      <!-- آمار سریع -->
      <div class="bg-white rounded-xl border border-gray-200">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-medium text-gray-900">آمار سریع</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">مشاوره‌های در انتظار</span>
              <span class="text-sm font-medium text-gray-900">{{ stats.pendingConsultations }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">نوبت‌های امروز</span>
              <span class="text-sm font-medium text-gray-900">{{ stats.todayAppointments }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">کاربران آنلاین</span>
              <span class="text-sm font-medium text-gray-900">{{ stats.onlineUsers }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">پیام‌های پاسخ نداده</span>
              <span class="text-sm font-medium text-red-600">{{ stats.unansweredMessages }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'


// Sample Data
const stats = ref({
  totalUsers: 12485,
  userGrowth: 12.5,
  totalVets: 156,
  vetGrowth: 8.3,
  todayConsultations: 89,
  activeConsultations: 23,
  monthlyRevenue: 125750000,
  revenueGrowth: 15.2,
  pendingConsultations: 12,
  todayAppointments: 45,
  onlineUsers: 234,
  unansweredMessages: 7
})

const recentConsultations = ref([
  {
    id: 1,
    petOwner: { name: 'احمد رضایی', avatar: '/placeholder-avatar.svg' },
    pet: { name: 'میلو', type: 'سگ' },
    vet: { name: 'دکتر موسوی' },
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 2,
    petOwner: { name: 'فاطمه احمدی', avatar: '/placeholder-avatar.svg' },
    pet: { name: 'پرشین', type: 'گربه' },
    vet: { name: 'دکتر کریمی' },
    status: 'completed',
    createdAt: new Date(Date.now() - 1800000)
  },
  {
    id: 3,
    petOwner: { name: 'علی محمدی', avatar: '/placeholder-avatar.svg' },
    pet: { name: 'پیکو', type: 'پرنده' },
    vet: { name: 'دکتر رضایی' },
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000)
  }
])

const newUsers = ref([
  {
    id: 1,
    name: 'زهرا صادقی',
    email: 'zahra.sadeghi@example.com',
    avatar: '/placeholder-avatar.svg',
    joinDate: new Date()
  },
  {
    id: 2,
    name: 'محمد جوادی',
    email: 'mohammad.javadi@example.com',
    avatar: '/placeholder-avatar.svg',
    joinDate: new Date(Date.now() - 3600000)
  },
  {
    id: 3,
    name: 'نگین حسینی',
    email: 'negin.hosseini@example.com',
    avatar: '/placeholder-avatar.svg',
    joinDate: new Date(Date.now() - 7200000)
  }
])

const weeklyRevenue = ref([
  { day: 'شنبه', amount: 8500000 },
  { day: 'یکشنبه', amount: 12300000 },
  { day: 'دوشنبه', amount: 9800000 },
  { day: 'سه‌شنبه', amount: 15600000 },
  { day: 'چهارشنبه', amount: 11200000 },
  { day: 'پنج‌شنبه', amount: 13800000 },
  { day: 'جمعه', amount: 7900000 }
])

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const formatCurrencyShort = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K'
  }
  return amount.toString()
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'اکنون'
  if (minutes < 60) return `${minutes} دقیقه پیش`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ساعت پیش`
  
  const days = Math.floor(hours / 24)
  return `${days} روز پیش`
}

const getConsultationStatusClass = (status) => {
  const classes = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getConsultationStatusLabel = (status) => {
  const labels = {
    active: 'فعال',
    completed: 'تکمیل شده',
    pending: 'در انتظار',
    cancelled: 'لغو شده'
  }
  return labels[status] || 'نامشخص'
}
</script>
