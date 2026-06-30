<template>
  <!-- Desktop Header -->
  <header
      v-if="headerSection"
      :class="[
  'backdrop-blur-md border-b border-gray-200/50 z-50 hidden md:block',
  headerPositionClass
]"
      :style="headerStyle"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between px-6"
           :style="{ minHeight: headerSection?.data.logoSize + 24 + 'px' }">
        <!-- Logo -->
        <NuxtLink :to="headerSection?.data.logoLink || '/'" class="flex items-center space-x-3 space-x-reverse">
          <div
              class="relative rounded-lg flex items-center justify-center"
              :style="{
            width: headerSection?.data.logoSize + 'px',
                height: headerSection?.data.logoSize + 'px'
  }"
          >
            <img
                :src="headerSection?.data.logo || '/assets/img/pet.png'"
                :alt="headerSection?.data.logoAlt || 'لوگو'"
                class="w-full h-full object-contain"
            />
          </div>

          <div class="block">
            <h1 class="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
              {{ headerSection?.data.logoAlt || 'پت دانیم' }}
            </h1>
          </div>
        </NuxtLink>

        <!-- دکمه باز/بسته منوی داینامیک -->
        <div v-if="headerSection?.data.menuItems&&headerSection?.data.menuItems?.length>0" class="relative">
          <button
              @click="isMenuOpen = !isMenuOpen"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            منو
          </button>

          <!-- منوی داینامیک -->
          <div
              v-if="isMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
          >
            <NuxtLink
                v-for="(item, idx) in headerSection?.data.menuItems || []"
                :key="idx"
                :to="item.link"
                class="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                active-class="text-orange-600 font-medium"
            >
              {{ item.label || 'لینک' }}
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation: صفحات -->
        <nav class="flex items-center space-x-8 space-x-reverse">
          <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-gray-700 hover:text-orange-600 transition-colors flex items-center space-x-2 space-x-reverse"
              active-class="text-orange-600 font-medium"
          >
            <Icon :name="item.icon" size="sm"/>
            <span>{{ item.name }}</span>
          </NuxtLink>
        </nav>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <NuxtLink
              v-if="authStore.token"
              to="/profile"
              class="flex items-center space-x-2 space-x-reverse px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Icon name="user" size="sm"/>
            <span class="font-medium">پروفایل من</span>
          </NuxtLink>
          <button
              v-if="authStore.token"
              @click="authStore.logout()"
              class="auth-btn text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            خروج
          </button>
          <a
              v-else
              :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
              class="auth-btn px-4 py-2 text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
          >
            ورود به پت دانیم
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Header - Native Style (all pages) -->
  <header
      v-if="headerSection"
      class="md:hidden left-0 right-0 z-50"
      :class="mobileHeaderPositionClass"
      :style="mobileHeaderStyle"
  >
    <div class="px-4 py-4">
      <div class="flex items-center justify-between">

        <!-- Logo -->
        <NuxtLink
            :to="headerSection?.data.logoLink || '/'"
            class="flex items-center gap-3"
        >
          <div
              class="rounded-xl flex items-center justify-center backdrop-blur-sm"
              :style="{
            width: mobileLogoSize + 'px',
            height: mobileLogoSize + 'px',
            backgroundColor: 'rgba(255,255,255,0.2)'
          }"
          >
            <img
                :src="headerSection?.data.logo || '/assets/img/pet.png'"
                :alt="headerSection?.data.logoAlt || 'لوگو'"
                class="w-full h-full object-contain"
            />
          </div>
        </NuxtLink>

        <!-- Menu Button -->
        <button
            @click="toggleMenu"
            class="flex items-center justify-center rounded-xl backdrop-blur-sm active:scale-95 transition-transform"
            :style="{
          width: mobileLogoSize + 'px',
          height: mobileLogoSize + 'px',
          backgroundColor: 'rgba(255,255,255,0.2)'
        }"
        >
          <Icon name="menu-2" size="md" class="text-white" />
        </button>

      </div>
    </div>
  </header>

  <!-- Bottom Sheet Menu -->
  <Teleport to="body">
    <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isMenuOpen"
          class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          @click="closeMenu"
      ></div>
    </Transition>

    <Transition
        enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
        enter-from-class="translate-y-full opacity-0"
        leave-to-class="translate-y-full opacity-0"
    >
      <div
          v-if="isMenuOpen"
          class="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[101] overflow-hidden"
          style="height: 85vh;"
          @click.stop
      >
        <!-- Handle Bar -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

<!--        <NotificationBell v-if="settingStore.generalSetting.enableNotifications" />-->


        <!-- Menu Content -->
        <div class="overflow-y-auto pb-safe" style="height: calc(85vh - 3rem);">
          <!-- Profile Section -->
          <div class="px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-4">
              <div
                  class="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <Icon name="user" size="xl" class="text-orange-600"/>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 text-lg">کاربر مهمان</h3>
                <p class="text-sm text-gray-500">به پت دانیم خوش آمدید</p>
              </div>
            </div>
            <a
                :href="`${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl)}`"
                class="mt-4 block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 rounded-xl font-medium active:scale-[0.98] transition-transform"
            >
              ورود / ثبت نام
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="py-2">
            <!-- Profile Link -->
            <NuxtLink
                to="/profile"
                class="flex items-center gap-4 px-6 py-4 text-gray-700 active:bg-gray-50 transition-colors border-b border-gray-100"
                active-class="text-orange-600 bg-orange-50"
                @click="closeMenu"
            >
              <div
                  class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <Icon name="user" size="md" class="text-orange-600"/>
              </div>
              <span class="font-bold text-base flex-1">پروفایل من</span>
              <Icon name="chevron-left" size="sm" class="text-gray-400"/>
            </NuxtLink>

            <!-- Other Navigation Links -->
            <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="flex items-center gap-4 px-6 py-4 text-gray-700 active:bg-gray-50 transition-colors"
                active-class="text-orange-600 bg-orange-50"
                @click="closeMenu"
            >
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon :name="item.icon" size="md"/>
              </div>
              <span class="font-medium text-base flex-1">{{ item.name }}</span>
              <Icon name="chevron-left" size="sm" class="text-gray-400"/>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {usePageStore} from "~/stores/page";
import Icon from "~/components/Icon.vue";
import {useSettingStore} from "~/stores/setting";
import {useRuntimeConfig} from "#app";

const config = useRuntimeConfig()
const isMenuOpen = ref(false)
const authStore = useAuthStore()
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Prevent body scroll when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
const pageStore = usePageStore()

// آیتم‌های ثابت
const staticNavigation = [
  {name: 'صفحه اصلی', href: '/', icon: 'home'},
  {name: 'دسته‌بندی‌ها', href: '/categories', icon: 'category'}
]

// آیتم‌های داینامیک از استور
const dynamicNavigation = computed(() => {
  return pageStore.pages.map((p: any) => ({
    name: p.title,
    href: `/page/${p.slug || p.id}`,
    icon: 'file-text'
  }))
})

// ترکیب آیتم‌ها
const navigation = computed(() => [...staticNavigation, ...dynamicNavigation.value])
const settingStore = useSettingStore()

const headerSection = computed(() =>
    settingStore.pageSections.find(s => s.type === "header" && s.visible)
)
const currentUrl = ref('')
onMounted(async () => {

  await pageStore.fetchPages()

  currentUrl.value = window.location.href
})

const headerPositionClass = computed(() => {
  switch (headerSection.value?.data.position) {
    case 'fixed':
      return 'fixed top-0 left-0 w-full'
    case 'sticky':
      return 'sticky top-0'
    default:
      return 'relative'
  }
})

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const headerStyle = computed(() => {
  if (!headerSection.value) return {}

  const opacity = (headerSection.value.data.opacity ?? 100) / 100
  const bg = headerSection.value.data.bgColor || '#ffffff'

  return {
    backgroundColor: hexToRgba(bg, opacity)
  }
})

const mobileLogoSize = computed(() => {
  const size = headerSection.value?.data.logoSize || 40
  return Math.max(36, Math.min(size, 56)) // محدودیت منطقی برای موبایل
})

const mobileHeaderPositionClass = computed(() => {
  return headerSection.value?.data.position === 'sticky'
      ? 'sticky top-0'
      : 'fixed top-0'
})

const mobileHeaderStyle = computed(() => {
  if (!headerSection.value) return {}

  const opacity = (headerSection.value.data.opacity ?? 100) / 100
  const bg = headerSection.value.data.bgColor || '#f97316'

  return {
    backgroundColor: hexToRgba(bg, opacity),
    backdropFilter: 'blur(12px)'
  }
})






</script>
