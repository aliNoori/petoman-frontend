<!-- ~/components/GlobalToast.vue -->
<template>
  <div class="fixed top-0 right-0 bottom-0 lg:top-4 lg:bottom-auto z-[9999] flex flex-col justify-start items-end gap-3 p-4 w-full lg:w-auto pointer-events-none">
    <transition-group
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
    >
      <div
          v-for="t in toasts"
          :key="t.id"
          class="group pointer-events-auto flex w-full max-w-sm lg:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
          :class="getToastClass(t.type)"
      >
        <!-- آیکون و نوار پیشرفت -->
        <div class="flex items-center justify-center w-12 flex-shrink-0" :class="getIconBgClass(t.type)">
          <div class="relative">
            <i
                :class="getIconClass(t.type)"
                class="text-2xl text-white relative z-10"
                :style="{ animation: 'spin 3s linear infinite' }"
            ></i>
            <!-- افکت بلور پشت آیکون -->
            <div class="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
          </div>
        </div>

        <!-- محتوای پیام -->
        <div class="flex-1 px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed" v-html="t.message"></p>
            <button
                @click="removeToast(t.id)"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none -mr-1 -mt-1"
            >
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>
        </div>

        <!-- نوار پیشرفت زمان -->
        <div
            v-if="t.duration > 0"
            class="absolute bottom-0 left-0 h-1 bg-current transition-all duration-100 ease-linear"
            :class="getColorClass(t.type)"
            :style="{ width: '100%' }"
        >
          <div
              class="h-full w-full"
              :class="getColorClass(t.type)"
              :style="{ transitionDuration: `${t.duration}ms` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
// ✅ کد اسکریپت شما دست‌نخورده باقی مانده است
const nuxtApp = useNuxtApp()
const toasts = nuxtApp.$toasts || []
const removeToast = nuxtApp.$removeToast || (() => {})

const getToastClass = (type: string) => {
  const classes: Record<string, string> = {
    success: 'border-l-4 border-emerald-500',
    error: 'border-l-4 border-rose-500',
    warning: 'border-l-4 border-amber-500',
    info: 'border-l-4 border-blue-500',
  }
  return classes[type] || classes.info
}

const getIconClass = (type: string) => {
  const icons: Record<string, string> = {
    success: 'ti ti-check',
    error: 'ti ti-alert-circle',
    warning: 'ti ti-alert-triangle',
    info: 'ti ti-info-circle',
  }
  return icons[type] || icons.info
}

// توابع جدید برای استایل‌های جدید (اضافه شده بدون تغییر در منطق اصلی)
const getIconBgClass = (type: string) => {
  const bgClasses: Record<string, string> = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  }
  return bgClasses[type] || bgClasses.info
}

const getColorClass = (type: string) => {
  const colorClasses: Record<string, string> = {
    success: 'text-emerald-500',
    error: 'text-rose-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  }
  return colorClasses[type] || colorClasses.info
}
</script>

<style scoped>
/* انیمیشن چرخش برای آیکون */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* استایل‌های نوار پیشرفت */
/* نکته: در این استایل، نوار پیشرفت با استفاده از CSS Transition و زمان duration توست کنترل می‌شود */
</style>