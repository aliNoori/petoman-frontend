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
          v-for="toast in toasts"
          :key="toast.id"
          class="group pointer-events-auto flex w-full max-w-sm lg:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
          :class="getBorderClass(toast.type)"
      >
        <!-- آیکون و نوار پیشرفت -->
        <div class="flex items-center justify-center w-12 flex-shrink-0" :class="getIconBgClass(toast.type)">
          <div class="relative">
            <i
                :class="getIconClass(toast.type)"
                class="text-2xl text-white relative z-10"
                :style="{ animation: 'spin 3s linear infinite' }"
            ></i>
            <!-- آیکون داخل دایره -->
            <div class="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
          </div>
        </div>

        <!-- محتوای پیام -->
        <div class="flex-1 px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed" v-html="toast.message"></p>
            <button
                @click="removeToast(toast.id)"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none -mr-1 -mt-1"
            >
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>
        </div>

        <!-- نوار پیشرفت زمان -->
        <div
            v-if="toast.duration > 0"
            class="absolute bottom-0 left-0 h-1 bg-current transition-all duration-100 ease-linear"
            :class="getColorClass(toast.type)"
            :style="{ width: '100%' }"
            ref="progressBars"
        >
          <div
              class="h-full w-full"
              :class="getColorClass(toast.type)"
              :style="{ transitionDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const toasts = ref([]);
let idCounter = 0;

// پیکربندی رنگ‌ها و آیکون‌ها
const toastConfig = {
  success: {
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    icon: 'ti ti-check',
    border: 'border-l-4 border-emerald-500'
  },
  error: {
    color: 'text-rose-500',
    bg: 'bg-rose-500',
    icon: 'ti ti-alert-circle',
    border: 'border-l-4 border-rose-500'
  },
  warning: {
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    icon: 'ti ti-alert-triangle',
    border: 'border-l-4 border-amber-500'
  },
  info: {
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    icon: 'ti ti-info-circle',
    border: 'border-l-4 border-blue-500'
  },
  default: {
    color: 'text-slate-500',
    bg: 'bg-slate-500',
    icon: 'ti ti-message-circle',
    border: 'border-l-4 border-slate-500'
  }
};

const registerGlobalToast = () => {
  window.showToast = (message, type = 'info', duration = 3000, statusCode = null) => {
    // اگر status code داده شد، نوع را اصلاح کن
    if (statusCode) {
      if (statusCode >= 200 && statusCode < 300) type = 'success';
      else if (statusCode >= 400 && statusCode < 500) type = 'error';
      else if (statusCode >= 500) type = 'error';
    }

    const id = idCounter++;
    const newToast = { id, message, type, duration, createdAt: Date.now() };

    toasts.value.push(newToast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

// توابع کمکی برای استایل‌دهی
const getBorderClass = (type) => toastConfig[type]?.border || toastConfig.default.border;
const getIconBgClass = (type) => toastConfig[type]?.bg || toastConfig.default.bg;
const getIconClass = (type) => toastConfig[type]?.icon || toastConfig.default.icon;
const getColorClass = (type) => toastConfig[type]?.color || toastConfig.default.color;

onMounted(() => {
  registerGlobalToast();
});

onUnmounted(() => {
  delete window.showToast;
});
</script>

<style scoped>
/* انیمیشن چرخش برای آیکون */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* استایل‌های نوار پیشرفت */
div[ref="progressBars"] > div {
  animation: progress 3s linear forwards;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

/* استایل‌های Dark Mode (اختیاری) */
:deep(.dark) .group {
  background-color: rgba(30, 41, 59, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>