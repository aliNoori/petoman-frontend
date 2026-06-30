<template>
  <div>
    <!-- Fixed Navigation Bar -->
    <nav 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/0'"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <i class="ti ti-paw-filled text-white text-xl"></i>
            </div>
            <div class="hidden sm:block">
              <span class="text-xl font-black text-gray-900">پت مارکت</span>
            </div>
          </NuxtLink>

          <!-- Desktop Menu -->
          <nav class="hidden md:flex items-center gap-2">
            <NuxtLink to="/" class="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              خانه
            </NuxtLink>
            <NuxtLink to="/shops" class="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              فروشگاه‌ها
            </NuxtLink>
            <NuxtLink to="/products" class="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              محصولات
            </NuxtLink>
            <NuxtLink to="/categories" class="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              دسته‌بندی‌ها
            </NuxtLink>
            <NuxtLink to="/offers" class="px-4 py-2 text-gray-700 hover:text-amber-600 font-medium rounded-lg hover:bg-white/50 transition-all">
              تخفیف‌ها
            </NuxtLink>
          </nav>

          <!-- Right Side -->
          <div class="flex items-center gap-3">
            <!-- City Selector with Map -->
<!--            <ClientOnly>
            <MapCitySelector
              v-model="currentCity"
              placeholder="انتخاب شهر"
              title="انتخاب شهر از روی نقشه"
              header-class="bg-blue-500 text-white"
              icon-color="text-blue-500"
              button-class="bg-white/80 text-gray-700 hover:bg-white hover:border-blue-300"
              map-style="maptiler"
              @city-selected="onCitySelected"
            />
            </ClientOnly>-->

            <!-- Cart -->
            <button 
              @click="goToCart"
              class="relative flex items-center gap-2 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg hover:bg-white hover:border-blue-300 transition-all"
            >
              <i class="ti ti-shopping-cart text-gray-700"></i>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </button>
            
            <!-- User/Login -->
            <ClientOnly>
            <button
              v-if="isAuthenticated"
              @click="goToUserPanel"
              class="flex items-center gap-2 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
            >
              <!-- آواتار یا حرف اول نام -->
              <div
                  class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0"
              >
                <img
                    v-if="user?.avatar && resolveUrl(user.avatar)"
                    :src="resolveUrl(user.avatar)"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                />
                <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center"
                >
                    <span class="text-white text-xs sm:text-sm font-bold">
                      {{ user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || 'U' }}
                    </span>
                </div>
              </div>

              <!-- نام کاربری (در موبایل کوتاه‌تر، در دسکتاپ کامل) -->
              <span class="hidden sm:block text-gray-700 text-sm font-medium whitespace-nowrap max-w-[100px] truncate">
                    {{ user?.firstName || user?.fullName || 'پنل کاربری' }}
                  </span>
            </button>
            <a
                v-else
                :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
                class="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              ورود به پت مارکت
            </a>
            </ClientOnly>
            
            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 bg-white/80 border border-gray-200 rounded-lg hover:bg-white transition-colors"
            >
              <i class="ti ti-menu-2 text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer for fixed nav -->
    <div class="h-16"></div>

    <!-- Mobile Menu Drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showMobileMenu" 
          class="fixed inset-0 bg-black/50 z-50 md:hidden"
          @click="showMobileMenu = false"
        ></div>
      </Transition>
      <Transition name="slide-right">
        <div 
          v-if="showMobileMenu"
          class="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-2xl overflow-y-auto"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <i class="ti ti-paw-filled text-white text-xl"></i>
              </div>
              <span class="text-xl font-black text-gray-900">پت مارکت</span>
            </div>
            <button @click="showMobileMenu = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <i class="ti ti-x text-xl text-gray-500"></i>
            </button>
          </div>

          <!-- Menu Items -->
          <div class="p-4 space-y-2">
            <NuxtLink 
              to="/" 
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all"
              @click="showMobileMenu = false"
            >
              <i class="ti ti-home text-xl"></i>
              خانه
            </NuxtLink>
            <NuxtLink 
              to="/shops" 
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all"
              @click="showMobileMenu = false"
            >
              <i class="ti ti-building-store text-xl"></i>
              فروشگاه‌ها
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-gray-700 hover:text-teal-600 transition-all"
              @click="showMobileMenu = false"
            >
              <i class="ti ti-package text-xl"></i>
              محصولات
            </NuxtLink>
            <NuxtLink 
              to="/categories" 
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all"
              @click="showMobileMenu = false"
            >
              <i class="ti ti-category text-xl"></i>
              دسته‌بندی‌ها
            </NuxtLink>
            <NuxtLink 
              to="/offers" 
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-600 transition-all"
              @click="showMobileMenu = false"
            >
              <i class="ti ti-discount-2 text-xl"></i>
              تخفیف‌ها
            </NuxtLink>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-100 mx-4"></div>

          <!-- Seller Section -->
          <div class="p-4">
            <NuxtLink 
              to="/shops/register"
              @click.prevent="handleRegisterClick"
              class="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl"
              @click="showMobileMenu = false"
            >
              <i class="ti ti-rocket text-xl"></i>
              فروشنده شوید
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Toast Bubble -->
    <Transition name="fade">
      <div v-if="toastNotification"
           class="fixed left-4 top-4 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-[60]">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
               :class="toastNotification.color">
            <i :class="toastNotification.icon" class="text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ toastNotification.title }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ toastNotification.message }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ toastNotification.time }}</p>
          </div>
          <button @click="toastNotification = null" class="text-gray-400 hover:text-gray-600">
            <i class="ti ti-x"></i>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {useRuntimeConfig} from "nuxt/app";
import {useAuthStore} from "../../stores/auth.ts";
//import MapCitySelector from "../MapCitySelector.vue";
import {useSocketStore} from "../../stores/socket.js";
import {useNotificationStore} from "../../stores/notification.store.js";
import {useUrlHelper} from "../../composables/useUrlHelper.js";

const config = useRuntimeConfig()
const {resolveUrl}=useUrlHelper()
const router = useRouter()
const socketStore = useSocketStore();
const isConnected = ref(false);
const notificationStore=useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const toastNotification = ref(null)

// Use global cart
const { cartCount, cartItems, cartTotal, isCartOpen, openCart, closeCart } = useCart()
const authStore=useAuthStore()
const user=computed(()=>authStore.user)
const {$toast}=useNuxtApp()
// State
const isScrolled = ref(false)
const showMobileMenu = ref(false)
const currentCity = ref('تهران')
const isAuthenticated = computed(()=>authStore.isAuthenticated)
const handleRegisterClick = () => {

  if (!isAuthenticated.value) {

    // 1. Show Warning Toast
    // Note: Adjust the parameters based on your specific Toast implementation
    // Assuming $toast accepts (message, severity, life)
    if ($toast && typeof $toast === 'function') {
      $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    }

    // 2. Redirect to Login Page with redirect URL
    // This allows the user to come back to /register after login
    // If using NuxtLink behavior via router
    // router.push(`/login?redirect=${encodeURIComponent('/register')}`);

    // Since the login button elsewhere uses an external URL, we do the same here
    window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;
  }
};
// Methods
const onCitySelected = (data) => {
  currentCity.value = data.city
  console.log('City selected:', data)
}

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const goToLogin = () => {
  router.push('/login')
}

const goToUserPanel = () => {
  router.push('/profile')
}

const goToCart = () => {
  router.push('/cart')
}
const currentUrl = ref('')
// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  currentUrl.value = window.location.href

  ///Socket
  ///
  socketStore.connect(authStore.token);
  socketStore.socket.on("connect", () => {
    console.log("✅ Connected to server");
    isConnected.value = true;
  });

  socketStore.socket.on("notification", (payload) => {
    console.log("📩 Notification received:", payload);
    const enrichedPayload = {
      ...payload,
      time: notificationStore.formatTime(new Date(payload.createdAt))
    }

    notifications.value.push(enrichedPayload)

    // نمایش به صورت Toast
    toastNotification.value = enrichedPayload

    // بستن خودکار بعد از چند ثانیه (اختیاری)
    setTimeout(() => {
      toastNotification.value = null
    }, 5000)

  });
  socketStore.socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  socketStore.socket.off("notification");
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
