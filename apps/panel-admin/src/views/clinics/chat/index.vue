<template>
  <div class="flex flex-col h-full items-center justify-center bg-gradient-to-br from-gray-50 to-sky-50">
    <!-- هدر موبایل -->
    <div class="lg:hidden w-full px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-3 absolute top-0 right-0 left-0">
      <button @click="toggleSidebar" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <i class="ti ti-menu-2 text-xl text-gray-600"></i>
      </button>
      <div>
        <h1 class="font-bold text-gray-900">گفتگوها</h1>
        <p class="text-xs text-gray-500">مشاوره آنلاین با بیماران</p>
      </div>
    </div>

    <div class="max-w-md w-full px-6 text-center mt-16 lg:mt-0">
      <!-- آیکون -->
      <div class="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-200">
        <i class="ti ti-stethoscope text-5xl lg:text-6xl text-white"></i>
      </div>
      
      <!-- عنوان -->
      <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
        پنل مشاوره آنلاین
      </h2>
      
      <!-- توضیحات -->
      <p class="text-gray-500 text-sm lg:text-base mb-8 leading-relaxed">
        از لیست گفتگوها در سمت راست، یک بیمار را انتخاب کنید یا منتظر درخواست مشاوره جدید باشید.
      </p>
      
      <!-- راهنما -->
      <div class="bg-white rounded-2xl p-6 text-right space-y-4 shadow-sm">
        <h3 class="font-semibold text-gray-900 flex items-center gap-2 text-sm lg:text-base">
          <i class="ti ti-info-circle text-sky-500"></i>
          راهنمای سریع
        </h3>
        
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <i class="ti ti-clock text-orange-600 text-sm"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">درخواست‌های در انتظار</p>
              <p class="text-xs text-gray-500">درخواست‌های جدید که نیاز به تایید شما دارند</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <i class="ti ti-message text-green-600 text-sm"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">گفتگوهای فعال</p>
              <p class="text-xs text-gray-500">چت‌های جاری با بیماران</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <i class="ti ti-archive text-gray-600 text-sm"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">آرشیو گفتگوها</p>
              <p class="text-xs text-gray-500">گفتگوهای پایان یافته</p>
            </div>
          </div>
        </div>
      </div>

      <!-- آمار سریع -->
      <div class="mt-6 grid grid-cols-3 gap-3">
        <div class="bg-white rounded-xl p-4 text-center">
          <i class="ti ti-users text-sky-500 text-2xl mb-1"></i>
          <p class="text-lg font-bold text-gray-900">۱۲</p>
          <p class="text-[10px] text-gray-500">گفتگوی امروز</p>
        </div>
        <div class="bg-white rounded-xl p-4 text-center">
          <i class="ti ti-clock text-orange-500 text-2xl mb-1"></i>
          <p class="text-lg font-bold text-gray-900">۸ دقیقه</p>
          <p class="text-[10px] text-gray-500">میانگین پاسخ</p>
        </div>
        <div class="bg-white rounded-xl p-4 text-center">
          <i class="ti ti-star text-yellow-500 text-2xl mb-1"></i>
          <p class="text-lg font-bold text-gray-900">۴.۸</p>
          <p class="text-[10px] text-gray-500">امتیاز شما</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, onMounted, onUnmounted,watch } from 'vue'
import { useSocketStore} from "@/stores/socket.js";
import { useAuthStore} from "@/stores/auth.js";

const socketStore = useSocketStore()
const authStore = useAuthStore()

// دسترسی به تابع toggle سایدبار
const toggleMobileSidebar = inject('toggleMobileSidebar', () => {})
const toggleSidebar = () => {
  toggleMobileSidebar()
}

// لیست چت‌ها (فرض کنید این از API می‌آید)
const chats = ref([])

onMounted(() => {
  // اتصال به سوکت
 /* if (authStore.token) {
    socketStore.connect(authStore.token)
  }*/
})

// گوش دادن به پیام‌های جدید برای آپدیت لیست
// وقتی پیامی در استور اضافه شود، باید لیست چت‌ها را آپدیت کنید
watch(() => socketStore.messages, (newMessages) => {
  const lastMsg = newMessages[newMessages.length - 1]
  if (lastMsg) {
    // پیدا کردن چت مربوطه و آپدیت کردن آخرین پیام
    const chatIndex = chats.value.findIndex(c => c.consultationId === lastMsg.consultationId)
    if (chatIndex !== -1) {
      chats.value[chatIndex].lastMsg = lastMsg.text || 'فایل'
      chats.value[chatIndex].lastTime = lastMsg.time
      // آوردن چت به بالای لیست
      const updatedChat = chats.value.splice(chatIndex, 1)[0]
      chats.value.unshift(updatedChat)
    }
  }
})
</script>
