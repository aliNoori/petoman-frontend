<template>
  <!-- Bottom Navigation - Only on Mobile -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
    <div class="grid grid-cols-5 h-16">
      <!-- Home -->
      <NuxtLink 
        to="/"
        class="flex flex-col items-center justify-center gap-1 text-xs transition-colors"
        :class="isActive('/') ? 'text-rose-600' : 'text-gray-600'"
      >
        <i class="ti ti-home text-2xl"></i>
        <span class="font-medium">خانه</span>
      </NuxtLink>

      <!-- Kindness Events -->
      <NuxtLink 
        to="/kindness-events"
        class="flex flex-col items-center justify-center gap-1 text-xs transition-colors"
        :class="isActive('/kindness-events') ? 'text-rose-600' : 'text-gray-600'"
      >
        <i class="ti ti-calendar-heart text-2xl"></i>
        <span class="font-medium">قرارها</span>
      </NuxtLink>

      <!-- Documentaries -->
      <NuxtLink 
        to="/documentaries"
        class="flex flex-col items-center justify-center gap-1 text-xs transition-colors"
        :class="isActive('/documentaries') ? 'text-rose-600' : 'text-gray-600'"
      >
        <i class="ti ti-movie text-2xl"></i>
        <span class="font-medium">مستندات</span>
      </NuxtLink>

      <!-- Supporters -->
      <NuxtLink 
        to="/supporters"
        class="flex flex-col items-center justify-center gap-1 text-xs transition-colors"
        :class="isActive('/supporters') ? 'text-rose-600' : 'text-gray-600'"
      >
        <i class="ti ti-users text-2xl"></i>
        <span class="font-medium">حامیان</span>
      </NuxtLink>

      <!-- More / Menu -->
      <button
        @click="showMenu = !showMenu"
        class="flex flex-col items-center justify-center gap-1 text-xs text-gray-600 transition-colors"
        :class="showMenu ? 'text-rose-600' : ''"
      >
        <i class="ti ti-dots text-2xl"></i>
        <span class="font-medium">بیشتر</span>
      </button>
    </div>

    <!-- More Menu Popup - Sticks to bottom -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="showMenu" class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl border-gray-200 shadow-2xl pb-safe">
        <div class="max-w-md mx-auto p-4 space-y-2">
          <NuxtLink 
            to="/faq"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-rose-50 transition-colors"
            @click="showMenu = false"
          >
            <i class="ti ti-help text-xl text-rose-600"></i>
            <span class="font-medium text-gray-900">سوالات متداول</span>
          </NuxtLink>

          <NuxtLink 
            to="/terms"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-rose-50 transition-colors"
            @click="showMenu = false"
          >
            <i class="ti ti-file-text text-xl text-rose-600"></i>
            <span class="font-medium text-gray-900">قوانین و مقررات</span>
          </NuxtLink>

          <div class="pt-2 border-t border-gray-200">
            <NuxtLink 
              to="/join-supporters"
              class="flex items-center justify-center gap-2 p-3 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              @click="showMenu = false"
            >
              <i class="ti ti-user-plus text-xl"></i>
              <span class="font-semibold">عضویت در حامیان</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showMenu"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 "
        @click="showMenu = false"
      ></div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showMenu = ref(false)

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
/* Safe area for devices with notch */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
