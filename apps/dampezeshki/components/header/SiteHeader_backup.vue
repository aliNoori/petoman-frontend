<template>
  <header class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2 space-x-reverse">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">پ</span>
            </div>
            <span class="text-xl font-bold text-neutral-900 dark:text-white">پتومن</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8 space-x-reverse relative z-10">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors font-medium cursor-pointer block relative z-10 pointer-events-auto"
            active-class="text-primary font-semibold"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right side items -->
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- City Selector -->
          <CitySelector />
          
          <!-- Cart -->
          <button
            @click="toggleCart"
            class="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <i class="ti ti-shopping-cart text-xl"></i>
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -left-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
            >
              {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
            </span>
          </button>
          
          <!-- Notifications -->
          <button
            @click="toggleNotifications"
            class="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <i class="ti ti-bell text-xl"></i>
            <span 
              v-if="notificationCount > 0"
              class="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
            >
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </button>

          <!-- Auth Section -->
          <div class="flex items-center gap-3">
            <!-- Simple Auth Button -->
            <button
              v-if="!authStore.isAuthenticated"
              @click="goToLogin"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
               <i class="ti ti-user-plus"></i>
              <span>ورود / عضویت</span>
            </button>
            
            <!-- User Button (After Login) -->
            <button
              v-else
              @click="goToUserPanel"
              class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i class="ti ti-user"></i>
              <span>{{ authStore.user?.name || 'کاربر' }}</span>
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-700">
        <nav class="flex flex-col space-y-4">
          <button
            v-for="item in navigationItems"
            :key="item.path"
            @click="handleMobileNavClick(item.path)"
            :class="$route.path === item.path ? 'text-primary font-medium' : 'text-neutral-700 dark:text-neutral-300'"
            class="hover:text-primary transition-colors px-4 py-2 cursor-pointer block text-right w-full"
          >
            {{ item.label }}
          </button>
          
          <!-- Mobile Actions -->
          <div class="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-2">
            <button
              @click="toggleCart(); showMobileMenu = false"
              class="flex items-center gap-3 w-full px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
            >
              <i class="ti ti-shopping-cart text-lg"></i>
              <span>سبد خرید</span>
              <span v-if="cartStore.totalItems > 0" class="mr-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartStore.totalItems }}
              </span>
            </button>
            
            <button
              @click="toggleNotifications(); showMobileMenu = false"
              class="flex items-center gap-3 w-full px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
            >
              <i class="ti ti-bell text-lg"></i>
              <span>اعلان‌ها</span>
              <span v-if="notificationCount > 0" class="mr-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ notificationCount }}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Try to use stores safely with fallbacks
let authStore: any = null
let cartStore: any = null
let router: any = null

try {
  authStore = useAuthStore?.()
} catch (e) {
  console.warn('Auth store not available')
}

try {
  cartStore = useCartStore?.()
} catch (e) {
  console.warn('Cart store not available')
}

try {
  router = useRouter?.()
} catch (e) {
  console.warn('Router not available')
}

// Initialize on client side
onMounted(() => {
  if (typeof window !== 'undefined' && cartStore?.loadFromStorage) {
    cartStore.loadFromStorage()
  }
})

// State
const showCitySelector = ref(false)
const showNotifications = ref(false) 
const showMobileMenu = ref(false)

// Computed values
const notificationCount = computed(() => 0) // TODO: Implement notification system

// Navigation items
const navigationItems = [
  { label: 'خانه', path: '/' },
  { label: 'دامپزشکان', path: '/vets' },
  { label: 'کلینیک‌ها', path: '/clinics' },
  { label: 'داروخانه‌ها', path: '/pharmacy' },
  { label: 'مشاوره', path: '/consult' },
  { label: 'پیگیری سفارش', path: '/tracking' }
]

// Methods
const toggleMobileMenu = () => {
  console.log('Toggle mobile menu clicked, current state:', showMobileMenu.value)
  showMobileMenu.value = !showMobileMenu.value
  console.log('New mobile menu state:', showMobileMenu.value)
}

const handleNavClick = (path: string) => {
  console.log('Navigation clicked:', path)
  router.push(path)
}

const handleMobileNavClick = (path: string) => {
  console.log('Mobile navigation clicked:', path)
  // بستن منو اول
  showMobileMenu.value = false
  console.log('Menu closed, navigating to:', path)
  // کمی تاخیر برای انیمیشن، سپس رفتن به مسیر
  setTimeout(() => {
    router.push(path)
    console.log('Navigation completed to:', path)
  }, 100)
}

const goToLogin = () => {
  router.push('/auth/login')
}

const goToUserPanel = () => {
  // بر اساس نقش کاربر به پنل مناسب برود
  if (authStore.user?.role?.toLowerCase() === 'vet') {
    router.push('/panel/vets')
  } else if (authStore.user?.role?.toLowerCase() === 'clinic') {
    router.push('/panel/clinics')
  } else if (authStore.user?.role?.toLowerCase() === 'pharmacy') {
    router.push('/panel/pharmacies')
  } else {
    // کاربران عادی به پنل کاربری بروند
    router.push('/panel/users')
  }
}

const toggleNotifications = () => {
  router.push('/notifications')
}

const toggleCart = () => {
  router.push('/cart')
}

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
