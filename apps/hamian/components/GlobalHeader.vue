<template>
  <header
      class="border-b transition-all duration-300 fixed top-0 left-0 right-0 z-40"
      :class="[
      isScrolled 
        ? 'bg-white backdrop-blur-md border-gray-200 shadow-sm' 
        : 'bg-transparent border-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-4">

        <!-- Logo/Brand -->
        <NuxtLink to="/" class="flex items-center group">
          <img
              :src="settingStore.appearanceSetting?.logo || logo"
              alt="پتومن"
              class="h-10 lg:h-12 w-auto transition-transform group-hover:scale-105"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-reverse space-x-1">
          <NuxtLink to="/" class="nav-link" :class="{ 'nav-link-active': route.path === '/' }">
            <i class="ti ti-home text-lg ml-2"></i> خانه
          </NuxtLink>
          <NuxtLink to="/kindness-events" class="nav-link" :class="{ 'nav-link-active': route.path.startsWith('/kindness-events') }">
            <i class="ti ti-calendar-heart text-lg ml-2"></i> قرارهای مهربانی
          </NuxtLink>
          <NuxtLink to="/documentaries" class="nav-link" :class="{ 'nav-link-active': route.path.startsWith('/documentaries') }">
            <i class="ti ti-video text-lg ml-2"></i> مستندات
          </NuxtLink>
          <NuxtLink to="/supporters" class="nav-link" :class="{ 'nav-link-active': route.path.startsWith('/supporters') }">
            <i class="ti ti-users text-lg ml-2"></i> حامیان
          </NuxtLink>
          <NuxtLink to="/faq" class="nav-link" :class="{ 'nav-link-active': route.path === '/faq' }">
            <i class="ti ti-help text-lg ml-2"></i> سوالات متداول
          </NuxtLink>
        </nav>

        <!-- CTA Buttons -->
        <div class="flex items-center gap-3 lg:gap-4">
          <ClientOnly>
            <template #default>
              <NuxtLink
                  v-if="authStore.token"
                  to="/profile"
                  class="inline-flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  title="پروفایل من"
              >
                <i class="ti ti-user text-lg lg:text-xl"></i>
              </NuxtLink>
              <a
                  v-else
                  :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
                  class="auth-btn px-4 py-2 border-2 border-red-400 bg-gray-100 text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
              >
                ورود
              </a>
            </template>
          </ClientOnly>

          <NuxtLink
              to="/donate"
              class="inline-flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all shadow-sm"
              title="حمایت مالی"
          >
            <i class="ti ti-heart-filled text-lg lg:text-xl"></i>
          </NuxtLink>

          <NuxtLink
              to="/join-supporters"
              class="inline-flex items-center gap-2 px-3 py-2 lg:px-5 lg:py-2.5 text-rose-600 font-semibold text-xs lg:text-sm rounded-lg border-2 border-rose-600 hover:bg-rose-50 transition-all"
          >
            <i class="ti ti-user-plus"></i>
            <span class="hidden sm:inline">عضویت در حامیان</span>
            <span class="sm:hidden">عضویت</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from '~/assets/logo.png'
import { ref, onMounted, onUnmounted } from 'vue'
import {useRuntimeConfig} from "nuxt/app";
import { useSettingStore } from '~/stores/setting.ts'
const settingStore = useSettingStore()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const route = useRoute()
const isScrolled = ref(false)

// Handle scroll event
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}
const currentUrl = ref('')
onMounted(() => {
  currentUrl.value = typeof window !== 'undefined' ? window.location.href : '/'
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial state
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-lg text-sm font-medium transition-all;
}

.nav-link-active {
  @apply text-rose-600 bg-rose-50;
}
</style>

