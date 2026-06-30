<template>
  <RouterView />

  <!-- بنر درخواست مجوز نوتیفیکیشن -->
  <Transition name="slide-up">
    <div
        v-if="showNotificationBanner"
        class="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50"
    >
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <i class="ti ti-bell-ringing text-2xl text-emerald-600"></i>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-900 mb-1">فعال‌سازی اعلان‌ها</h4>
          <p class="text-sm text-gray-500 mb-3">برای دریافت یادآوری نوبت‌ها و اطلاع‌رسانی‌های مهم، اعلان‌ها را فعال کنید.</p>
          <div class="flex gap-2">
            <button
                @click="requestPermission"
                :disabled="isLoading"
                class="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="isLoading" class="ti ti-loader animate-spin ml-1"></i>
              <i v-else class="ti ti-check ml-1"></i>
              {{ isLoading ? 'در حال پردازش...' : 'فعال‌سازی' }}
            </button>
            <button
                @click="dismissBanner"
                class="px-4 py-2 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              بعداً
            </button>
          </div>
        </div>
        <button @click="dismissBanner" class="p-1 hover:bg-gray-100 rounded-lg">
          <i class="ti ti-x text-gray-400"></i>
        </button>
      </div>
    </div>
  </Transition>
  <GlobalNotification/>
  <GlobalToast/>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import GlobalNotification from "@/components/ui/GlobalNotification.vue";
import {useAuthStore} from "@/stores/auth.js";
import GlobalToast from "@/components/GlobalToast.vue";

const authStore=useAuthStore()
// فرض بر این است که شما از سرویس ماساژینگ (مثل Firebase) استفاده می‌کنید
import { getToken } from "firebase/messaging";
import { messaging } from "@/plugins/firebase";
import { onMessage } from "firebase/messaging";
const showNotificationBanner = ref(false)
const isLoading = ref(false)

// بررسی وضعیت مجوز نوتیفیکیشن
const checkNotificationPermission = () => {
  if (!('Notification' in window)) return

  // اگه قبلاً بنر رو بسته یا مجوز داده/رد کرده
  let dismissed = false
  try {
    dismissed = localStorage.getItem('notificationBannerDismissed')
  } catch (e) {
    console.warn('localStorage not available')
  }

  if (Notification.permission === 'default' && !dismissed) {
    // با تاخیر نشون بده که کاربر صفحه رو ببینه
    setTimeout(() => {
      showNotificationBanner.value = true
    }, 2000)
  }
}

// تابع فرضی برای ارسال توکن به سرور
const saveTokenToServer = async (token) => {
  // اینجا باید به API خودتان درخواست بفرستید
  // مثال:
  await authStore.saveTokenToServer(token);
  console.log('Token saved to server:', token);
}

// درخواست مجوز
const requestPermission = async () => {

  isLoading.value = true
  try {
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {

      const token = await getToken(messaging)

      // ۲. ارسال توکن به بک‌اند (بسیار مهم)
      await saveTokenToServer(token);

      // نوتیفیکیشن تست
      new Notification('پتومن 🐾', {
        body: 'اعلان‌ها با موفقیت فعال شدند!',
        //icon: '/pet.png'
      })
    } else {
      // کاربر مجوز را رد کرد
      console.log('User denied notification permission');
    }
  } catch (e) {
    console.error('Error requesting notification permission:', e)
  } finally {
    isLoading.value = false
    showNotificationBanner.value = false
    try {
      localStorage.setItem('notificationBannerDismissed', 'true')
    } catch (e) {}
  }
}

// بستن بنر
const dismissBanner = () => {
  showNotificationBanner.value = false
  try {
    localStorage.setItem('notificationBannerDismissed', 'true')
  } catch (e) {}
}

onMounted(async () => {
  checkNotificationPermission()

  if (!messaging) {
    console.error("Firebase Messaging instance is not initialized!");
    return;
  }
  // گوش دادن به پیام‌های در حال اجرا (تب باز)
  onMessage(messaging, (payload) => {
    // console.log('Foreground message received:', payload);

    // نمایش دستی نوتیفیکیشن
    if (Notification.permission === 'granted') {
      new Notification(payload.data.title, {
        body: payload.data.body,
        icon: '🐾'
      });
    }
  });
})
</script>

<style>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>