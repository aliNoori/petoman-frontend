<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-400/20 shadow-lg">
    <nav class="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
      <!-- Logo -->

      <img
          v-if="general?.logo"
          :src="general.logo"
          :alt="general.siteName"

          class="h-12"
      />
      <h1>{{ general?.siteName }}</h1>
      <p>{{ general?.tagline }}</p>
      <!-- Desktop Navigation -->
      <ul class="hidden lg:flex gap-6 text-lg font-semibold">
        <li>
          <NuxtLink to="/" class="group flex items-center px-3 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
            <i class="ti ti-home text-yellow-400 ml-2 group-hover:scale-110 transition-transform"></i>
            <span class="text-yellow-300 group-hover:text-yellow-400">خانه</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/movies" class="group flex items-center px-3 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
            <i class="ti ti-video text-yellow-400 ml-2 group-hover:scale-110 transition-transform"></i>
            <span class="text-yellow-300 group-hover:text-yellow-400">فیلم‌ها</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/categories" class="group flex items-center px-3 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
            <i class="ti ti-category text-yellow-400 ml-2 group-hover:scale-110 transition-transform"></i>
            <span class="text-yellow-300 group-hover:text-yellow-400">دسته‌بندی‌ها</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/faq" class="group flex items-center px-3 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
            <i class="ti ti-help-circle text-yellow-400 ml-2 group-hover:scale-110 transition-transform"></i>
            <span class="text-yellow-300 group-hover:text-yellow-400">سوالات متداول</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about" class="group flex items-center px-3 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
            <i class="ti ti-info-circle text-yellow-400 ml-2 group-hover:scale-110 transition-transform"></i>
            <span class="text-yellow-300 group-hover:text-yellow-400">درباره ما</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <!-- Search Button -->
          <template v-if="general?.showSearch">
            <button
                    @click="openSearchModal"
                    class="p-3 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300 group"
            >
              <i class="ti ti-search text-xl group-hover:scale-110 transition-transform"></i>
            </button>
          </template>
        
        <!-- Notifications -->
        <div class="relative">
          <button 
            @click="toggleNotifications"
            class="relative p-3 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300 group"
          >
            <i class="ti ti-bell text-xl group-hover:scale-110 transition-transform"></i>
            <div v-if="hasNewNotifications" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </button>
          
          <!-- Notifications Dropdown -->
          <div 
            v-show="showNotifications"
            class="absolute left-0 top-full mt-2 w-80 bg-zinc-900/95 backdrop-blur-md border border-yellow-400/20 rounded-2xl shadow-xl z-50"
          >
            <div class="p-4 border-b border-yellow-400/10">
              <h3 class="text-white font-bold">اعلان‌ها</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div v-if="notifications.length === 0" class="p-4 text-center text-yellow-200/70">
                اعلان جدیدی وجود ندارد
              </div>
              <div v-else>
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="p-4 border-b border-yellow-400/5 hover:bg-yellow-400/5 transition-colors"
                >
                  <div class="flex items-start gap-3">
                    <i :class="notification.icon" class="text-yellow-400 text-lg mt-1"></i>
                    <div class="flex-1">
                      <p class="text-white text-sm">{{ notification.message }}</p>
                      <p class="text-yellow-200/50 text-xs mt-1">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Toast Bubble -->
        <Transition name="fade">
          <div v-if="toastNotification"
               class="absolute left-4 top-4 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-50">
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
        
        <!-- User Profile -->
        <div class="relative">
          <button 
            @click="toggleUserMenu"
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 hover:from-yellow-400/20 hover:to-yellow-500/20 rounded-lg border border-yellow-400/20 transition-all duration-300 group"
          >
            <div class="w-8 h-8 rounded-full overflow-hidden bg-yellow-400 flex items-center justify-center">
              <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  alt="avatar"
                  class="w-full h-full object-cover"
              />
              <i v-else class="ti ti-user text-black text-sm"></i>
            </div>

            <span class="hidden md:block text-yellow-300 text-sm font-medium">
              {{ user ? user.firstName : 'ورود به پت فیلم' }}
            </span>

            <i class="ti ti-chevron-down text-yellow-400 text-sm group-hover:rotate-180 transition-transform"></i>
          </button>
          
          <!-- User Menu Dropdown -->
          <div 
            v-show="showUserMenu"
            class="absolute left-0 top-full mt-2 w-64 bg-zinc-900/95 backdrop-blur-md border border-yellow-400/20 rounded-2xl shadow-xl z-50"
          >
            <div class="p-4 border-b border-yellow-400/10">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <i class="ti ti-user text-black text-lg"></i>
                </div>
                <div>
                  <p class="text-white font-medium">
                    {{ user ? user.firstName + ' ' + user.lastName : 'کاربر مهمان' }}
                  </p>
                  <p class="text-yellow-200/70 text-sm">
                    {{ user?.email || 'وارد حساب خود شوید' }}
                  </p>

                </div>
              </div>
            </div>
            <ClientOnly>
            <div class="p-2">
              <template v-if="isAuthenticated">
              <NuxtLink to="/dashboard?activetab=profile"
                        @click="showUserMenu = false"
                        class="w-full flex items-center gap-3 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors">
                <i class="ti ti-user-circle"></i>
                پروفایل من
              </NuxtLink>
              <NuxtLink to="/dashboard?activetab=favorites"
                        @click="showUserMenu = false"
                        class="w-full flex items-center gap-3 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors">
                <i class="ti ti-heart"></i>
                علاقه‌مندی‌ها
              </NuxtLink>
                <NuxtLink to="/dashboard?activetab=history"
                          @click="showUserMenu = false"
                          class="w-full flex items-center gap-3 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors">
                  <i class="ti ti-bookmark"></i>
                  تاریخچه تماشا
                </NuxtLink>
              <NuxtLink to="/dashboard?activetab=settings"
                        @click="showUserMenu = false"
                        class="w-full flex items-center gap-3 px-3 py-2 text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors">
                <i class="ti ti-settings"></i>
                تنظیمات
              </NuxtLink>
              <hr class="my-2 border-yellow-400/10">
              <button @click="logout" class="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                <i class="ti ti-logout"></i>
                خروج
              </button>
              </template>

              <template v-else>
                <a
                    :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
                    class=""
                >
                  <i class="ti ti-login"></i>ورود
                </a>
              </template>
            </div>
            </ClientOnly>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="lg:hidden p-3 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300 relative">
          <div class="hamburger-icon">
            <span :class="['hamburger-line', showMobileMenu && 'hamburger-active-1']"></span>
            <span :class="['hamburger-line', showMobileMenu && 'hamburger-active-2']"></span>
            <span :class="['hamburger-line', showMobileMenu && 'hamburger-active-3']"></span>
          </div>
        </button>
      </div>
    </nav>

    <!-- Search Modal -->
    <SearchModal 
      :show="showSearchModal" 
      :films="allFilms" 
      @close="closeSearchModal" 
      @navigate="handleNavigation"
    />

    <!-- Mobile Navigation -->
    <div v-show="showMobileMenu" class="lg:hidden bg-black/95 backdrop-blur-md border-t border-yellow-400/20">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/" @click="closeMobileMenu" class="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
              <i class="ti ti-home text-yellow-400 ml-3"></i>
              <span class="text-yellow-300">خانه</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/movies" @click="closeMobileMenu" class="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
              <i class="ti ti-video text-yellow-400 ml-3"></i>
              <span class="text-yellow-300">فیلم‌ها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/categories" @click="closeMobileMenu" class="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
              <i class="ti ti-category text-yellow-400 ml-3"></i>
              <span class="text-yellow-300">دسته‌بندی‌ها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/faq" @click="closeMobileMenu" class="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
              <i class="ti ti-help-circle text-yellow-400 ml-3"></i>
              <span class="text-yellow-300">سوالات متداول</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" @click="closeMobileMenu" class="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-400/10 transition-all duration-300">
              <i class="ti ti-info-circle text-yellow-400 ml-3"></i>
              <span class="text-yellow-300">درباره ما</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hamburger-icon {
  width: 20px;
  height: 16px;
  position: relative;
  cursor: pointer;
}

.hamburger-line {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: rgb(250 204 21);
  border-radius: 1px;
  opacity: 1;
  left: 0;
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hamburger-line:nth-child(1) {
  top: 0;
}

.hamburger-line:nth-child(2) {
  top: 7px;
}

.hamburger-line:nth-child(3) {
  top: 14px;
}

.hamburger-active-1 {
  top: 7px !important;
  transform: rotate(45deg);
}

.hamburger-active-2 {
  opacity: 0;
  transform: translateX(-20px);
}

.hamburger-active-3 {
  top: 7px !important;
  transform: rotate(-45deg);
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchModal from './SearchModal.vue'
import {useAuthStore} from "~/stores/auth";

import {useRouter, useRuntimeConfig} from "nuxt/app";
import {useNotificationStore} from "~/stores/notification";
import {computed} from "vue";
import {useSocketStore} from "~/stores/socket";
import {useFilmSettingStore} from "~/stores/setting";

const config = useRuntimeConfig()
const showMobileMenu = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showSearchModal = ref(false)
const hasNewNotifications = ref(true)


const auth = useAuthStore()
const { user, isAuthenticated } = storeToRefs(auth)
const router=useRouter()
const logout = () => {
  auth.logout()
  showUserMenu.value = false
  router.push('/')
}

// Mock notifications data
// const notifications = ref([
//   {
//     id: 1,
//     message: 'فیلم جدید "خرس‌های قطبی" اضافه شد',
//     time: '۲ ساعت پیش',
//     icon: 'ti ti-video'
//   },
//   {
//     id: 2,
//     message: 'امتیاز شما برای فیلم "دلفین‌ها" ثبت شد',
//     time: '۱ روز پیش',
//     icon: 'ti ti-star'
//   }
// ])
const notificationStore=useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const toastNotification = ref(null)
const socketStore = useSocketStore();
const isConnected = ref(false);
// Mock films data for search
const allFilms = ref([
  {
    id: 1,
    title: 'نجات گربه‌های خیابانی',
    description: 'مستندی درباره نجات و مراقبت از گربه‌های بی‌خانمان در شهر',
    poster: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=600&fit=crop',
    category: 'نجات',
    duration: '48',
    rating: 4.3
  },
  {
    id: 2,
    title: 'شیرهای آفریقا',
    description: 'مستندی شگفت‌انگیز از زندگی شیرها در طبیعت وحشی آفریقا',
    poster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=600&fit=crop',
    category: 'مستند',
    duration: '72',
    rating: 4.6
  },
  {
    id: 3,
    title: 'دنیای دلفین‌ها',
    description: 'کشف دنیای زیرآبی دلفین‌ها و هوش شگفت‌انگیز این موجودات',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop',
    category: 'آموزشی',
    duration: '60',
    rating: 4.5
  },
  {
    id: 4,
    title: 'خرس‌های قطبی',
    description: 'زندگی خرس‌های قطبی در عصر تغییرات اقلیمی',
    poster: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=600&fit=crop',
    category: 'طبیعت',
    duration: '54',
    rating: 4.2
  },
  {
    id: 5,
    title: 'پرندگان مهاجر',
    description: 'سفر شگفت‌انگیز پرندگان در مهاجرت‌های فصلی',
    poster: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=600&fit=crop',
    category: 'مستند',
    duration: '66',
    rating: 4.4
  },
  {
    id: 6,
    title: 'نجات فیل‌ها',
    description: 'داستان‌های الهام‌بخش از نجات فیل‌های آسیایی',
    poster: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=600&fit=crop',
    category: 'نجات',
    duration: '58',
    rating: 4.7
  }
])

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showNotifications.value = false
  showUserMenu.value = false
  showSearchModal.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
  showMobileMenu.value = false
  showSearchModal.value = false
  hasNewNotifications.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showMobileMenu.value = false
  showSearchModal.value = false
}

const openSearchModal = () => {
  showSearchModal.value = true
  showMobileMenu.value = false
  showNotifications.value = false
  showUserMenu.value = false
}

const closeSearchModal = () => {
  showSearchModal.value = false
}

const handleNavigation = (path: string) => {
  window.location.href = path
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
const settingStore=useFilmSettingStore()
const general = computed(() => settingStore.settings?.general)

const currentUrl = ref('')
// Close menus when clicking outside
onMounted(async () => {
  currentUrl.value = window.location.href
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('header')) {
      showMobileMenu.value = false
      showNotifications.value = false
      showUserMenu.value = false
    }
  })

  ////Socket
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
  const userId = user.id
  if(userId!==undefined){
    await notificationStore.fetchNotifications(userId, 'film')
  }

  ///
  socketStore.connect(auth.token);
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
});
onUnmounted(() => {
  socketStore.socket.off("notification");

})
</script>
