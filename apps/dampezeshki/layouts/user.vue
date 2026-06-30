<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div class="w-72 bg-white border-l border-gray-200 min-h-screen">
      <!-- User Profile Section -->
      <div class="p-6 bg-slate-800 text-white">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <i class="ti ti-user w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ user.name || 'کاربر عزیز' }}</h2>
            <p class="text-slate-300 text-sm">پنل کاربری پتومن</p>
          </div>
        </div>
      </div>
      
      <nav class="py-6">
        <div class="px-6 mb-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">خدمات درمانی</h3>
        </div>
        
        <ul class="space-y-1 px-4">
          <li>
            <NuxtLink 
              to="/panel/users" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-dashboard w-4 h-4 ml-3"></i>
              <span>داشبورد</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/panel/users/consultations" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-messages w-4 h-4 ml-3"></i>
              <span>مشاوره آنلاین</span>
              <span v-if="activeChats" class="mr-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{{ activeChats }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/panel/users/appointments" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-calendar-event w-4 h-4 ml-3"></i>
              <span>نوبت‌های من</span>
            </NuxtLink>
          </li>
        </ul>

        <div class="px-6 mt-8 mb-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">خدمات دارویی</h3>
        </div>
        
        <ul class="space-y-1 px-4">
          <li>
            <NuxtLink 
              to="/panel/users/prescriptions" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-pill w-4 h-4 ml-3"></i>
              <span>نسخه‌های من</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/panel/users/orders" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-shopping-cart w-4 h-4 ml-3"></i>
              <span>سفارشات من</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/panel/users/tracking" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-package w-4 h-4 ml-3"></i>
              <span>پیگیری سفارش</span>
            </NuxtLink>
          </li>
        </ul>

        <div class="px-6 mt-8 mb-4">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">حساب کاربری</h3>
        </div>
        
        <ul class="space-y-1 px-4">
          <li>
            <NuxtLink 
              to="/panel/users/notifications" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-bell w-4 h-4 ml-3"></i>
              <span>اعلان‌ها</span>
              <span v-if="unreadNotifications" class="mr-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{{ unreadNotifications }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink 
              to="/panel/users/settings" 
              class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              active-class="bg-gray-100 text-gray-800"
            >
              <i class="ti ti-settings w-4 h-4 ml-3"></i>
              <span>تنظیمات</span>
            </NuxtLink>
          </li>
        </ul>
        
        <!-- Logout Button -->
        <div class="px-4 mt-8 pt-6 border-t border-gray-200">
          <button 
            @click="logout"
            class="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100"
          >
            <i class="ti ti-logout w-4 h-4 ml-2"></i>
            <span>خروج از حساب</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-transparent">
      <!-- Page Content -->
      <main class="flex-1 p-6 lg:p-8">
        <NuxtPage />
      </main>
    </div>
    </div>
  </div>
</template>

<script setup>
// Mock user data
const user = ref({
  name: 'سارا احمدی',
  type: 'user',
  avatar: '/placeholder-avatar.svg'
})

// Mock notification counts
const activeChats = ref(2)
const unreadNotifications = ref(5)

const totalNotifications = computed(() => {
  return activeChats.value + unreadNotifications.value
})

// Page title based on route
const route = useRoute()
const pageTitle = computed(() => {
  const titles = {
    '/panel/users/': 'نوبت‌های من',
    '/panel/users': 'نوبت‌های من', 
    '/panel/users/consultations': 'مشاوره آنلاین',
    '/panel/users/pets': 'حیوانات من',
    '/panel/users/visits': 'سابقه درمان',
    '/panel/users/payments': 'سفارشات من',
    '/panel/users/prescriptions': 'نسخه‌های من',
    '/panel/users/notifications': 'اعلان‌ها',
    '/panel/users/settings': 'تنظیمات'
  }
  return titles[route.path] || 'پنل کاربری'
})

const logout = () => {
  // Handle logout
  navigateTo('/auth/login')
}
</script>