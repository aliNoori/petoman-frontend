<template>
  <div class="h-screen flex flex-col lg:flex-row bg-gray-50" dir="rtl">
    <!-- سایدبار دسکتاپ -->
    <aside class="hidden lg:flex flex-col w-80 bg-white border-l border-gray-200 h-screen">
      <!-- هدر سایدبار -->
      <div class="shrink-0 p-4 border-b border-gray-100 bg-gradient-to-l from-sky-50 to-white">
        <div class="flex items-center gap-3">
          <router-link to="/clinic" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-arrow-right text-xl text-gray-600"></i>
          </router-link>
          <div class="flex-1">
            <h1 class="font-bold text-gray-900">گفتگو با بیماران</h1>
            <p class="text-xs text-gray-500">مشاوره آنلاین</p>
          </div>
        </div>
      </div>

      <!-- تب‌ها -->
      <div class="shrink-0 p-2 border-b border-gray-100 flex gap-2">
        <button
            @click="activeTab = 'active'"
            :class="[
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
            activeTab === 'active' 
              ? 'bg-sky-100 text-sky-700' 
              : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          <i class="ti ti-message ml-1"></i>
          فعال
          <span v-if="pendingCount > 0" class="mr-1 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] rounded-full">
            {{ pendingCount }}
          </span>
        </button>
        <button
            @click="activeTab = 'closed'"
            :class="[
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
            activeTab === 'closed' 
              ? 'bg-gray-200 text-gray-700' 
              : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          <i class="ti ti-check ml-1"></i>
          بسته شده
        </button>
      </div>

      <!-- جستجو -->
      <div class="shrink-0 p-3">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو..."
              class="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          >
        </div>
      </div>

      <!-- لیست گفتگوها -->
      <div class="flex-1 overflow-y-auto px-2">
        <!-- گفتگوهای فعال -->
        <template v-if="activeTab === 'active'">
          <!-- در انتظار تایید -->
          <div v-if="pendingChats.length > 0" class="mb-4">
            <p class="text-xs text-orange-600 font-medium px-2 mb-2 flex items-center gap-1">
              <i class="ti ti-clock-hour-4"></i>
              در انتظار تایید شما
            </p>
            <div
                v-for="chat in pendingChats"
                :key="chat.id"
                @click="selectChat(chat)"
                :class="[
                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 border-2',
                selectedChatId === chat.id 
                  ? 'bg-orange-50 border-orange-300' 
                  : 'border-orange-200 hover:bg-orange-50'
              ]"
            >
              <div class="relative shrink-0">
                <img :src="resolveUrl(chat.avatar)" :alt="chat.customerName" class="w-12 h-12 rounded-xl object-cover">
                <span
                    class="absolute -bottom-1 -left-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                  <i class="ti ti-clock text-white text-[8px]"></i>
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-medium text-gray-900 text-sm">{{ chat.customerName }}</h3>
                  <span class="text-xs text-orange-500">{{ chat.waitingTime }}</span>
                </div>
                <p class="text-xs text-gray-500 truncate">{{ chat.petType }} - {{ chat.petName }}</p>
                <span class="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded-full mt-1 inline-block">
                  در انتظار تایید دکتر
                </span>
              </div>
            </div>
          </div>

          <!-- گفتگوهای فعال -->
          <p class="text-xs text-gray-400 font-medium px-2 mb-2">گفتگوهای فعال</p>
          <div
              v-for="chat in filteredActiveChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
              'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2',
              selectedChatId === chat.id ? 'bg-sky-50 border border-sky-200' : 'hover:bg-gray-50'
            ]"
          >
            <div class="relative shrink-0">
              <img :src="resolveUrl(chat.avatar)" :alt="chat.customerName" class="w-12 h-12 rounded-xl object-cover">
              <span
                  :class="[
                  'absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white',
                  chat.customerOnline ? 'bg-green-500' : 'bg-gray-300'
                ]"
              ></span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 text-sm">{{ chat.customerName }}</h3>
                <span class="text-xs text-gray-400">{{ chat.lastMessageTime }}</span>
              </div>
              <p class="text-xs text-gray-500 truncate">{{ chat.petType }} - {{ chat.petName }}</p>
              <div class="flex items-center gap-8 mt-1">
                <span v-if="chat.unreadCount"
                      class="px-1.5 py-0.5 mr-50 bg-sky-600 text-white text-[10px] rounded-full min-w-[18px] text-center">
                  {{ chat.unreadCount }}
                </span>
                <span v-if="chat.isTyping" class="text-xs text-sky-600">در حال تایپ...</span>
              </div>
            </div>
          </div>

          <div v-if="filteredActiveChats.length === 0 && pendingChats.length === 0" class="text-center py-8">
            <i class="ti ti-message-off text-4xl text-gray-300 mb-2"></i>
            <p class="text-sm text-gray-400">گفتگوی فعالی ندارید</p>
          </div>
        </template>

        <!-- گفتگوهای بسته شده -->
        <template v-else>
          <div
              v-for="chat in filteredClosedChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
              'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 opacity-70',
              selectedChatId === chat.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
            ]"
          >
            <img :src="resolveUrl(chat.avatar)" :alt="chat.customerName"
                 class="w-12 h-12 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-700 text-sm">{{ chat.customerName }}</h3>
              <p class="text-xs text-gray-400 truncate">{{ chat.petType }} - {{ chat.petName }}</p>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full mt-1 inline-block">
                {{ chat.closedAt }}
              </span>
            </div>
          </div>

          <div v-if="filteredClosedChats.length === 0" class="text-center py-8">
            <i class="ti ti-archive text-4xl text-gray-300 mb-2"></i>
            <p class="text-sm text-gray-400">آرشیو خالی است</p>
          </div>
        </template>
      </div>

      <!-- آمار سایدبار -->
      <div class="shrink-0 p-4 border-t border-gray-100 bg-gray-50">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <p class="text-lg font-bold text-sky-600">{{ stats.activeToday }}</p>
            <p class="text-[10px] text-gray-500">امروز</p>
          </div>
          <div>
            <p class="text-lg font-bold text-green-600">{{ stats.completedToday }}</p>
            <p class="text-[10px] text-gray-500">تکمیل شده</p>
          </div>
          <div>
            <p class="text-lg font-bold text-orange-600">{{ stats.pendingNow }}</p>
            <p class="text-[10px] text-gray-500">در انتظار</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- محتوای اصلی -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <router-view/>
    </main>

    <!-- سایدبار موبایل -->
    <Teleport to="body">
      <Transition name="sidebar">
        <div v-if="showMobileSidebar" class="lg:hidden fixed inset-0 z-50 flex">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50" @click="showMobileSidebar = false"></div>

          <!-- سایدبار -->
          <aside class="relative w-80 max-w-[85vw] bg-white h-full flex flex-col">
            <!-- هدر -->
            <div
                class="shrink-0 p-4 border-b border-gray-100 bg-gradient-to-l from-sky-50 to-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="ti ti-stethoscope text-sky-600 text-xl"></i>
                <h1 class="font-bold text-gray-900">گفتگوها</h1>
              </div>
              <button @click="showMobileSidebar = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="ti ti-x text-gray-600"></i>
              </button>
            </div>

            <!-- تب‌های موبایل -->
            <div class="shrink-0 p-2 border-b border-gray-100 flex gap-2">
              <button
                  @click="activeTab = 'active'"
                  :class="[
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  activeTab === 'active'
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-gray-500 hover:bg-gray-100'
                ]"
              >
                فعال
                <span v-if="pendingCount > 0"
                      class="mr-1 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] rounded-full">
                  {{ pendingCount }}
                </span>
              </button>
              <button
                  @click="activeTab = 'closed'"
                  :class="[
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  activeTab === 'closed'
                    ? 'bg-gray-200 text-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
                ]"
              >
                بسته شده
              </button>
            </div>

            <!-- لیست گفتگوها موبایل -->
            <div class="flex-1 overflow-y-auto p-3">
              <!-- گفتگوهای در انتظار -->
              <template v-if="activeTab === 'active'">
                <div v-if="pendingChats.length > 0" class="mb-4">
                  <p class="text-xs text-orange-600 font-medium px-2 mb-2 flex items-center gap-1">
                    <i class="ti ti-clock-hour-4"></i>
                    در انتظار تایید شما
                  </p>
                  <div
                      v-for="chat in pendingChats"
                      :key="chat.id"
                      @click="selectChatMobile(chat)"
                      class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 border-2 border-orange-200 hover:bg-orange-50"
                  >
                    <div class="relative shrink-0">
                      <img :src="resolveUrl(chat.avatar)" class="w-12 h-12 rounded-xl object-cover">
                      <span
                          class="absolute -bottom-1 -left-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-gray-900 text-sm">{{ chat.customerName }}</h3>
                      <p class="text-xs text-gray-500 truncate">{{ chat.petType }} - {{ chat.petName }}</p>
                      <span
                          class="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded-full mt-1 inline-block">
                        در انتظار تایید دکتر
                      </span>
                    </div>
                  </div>
                </div>

                <p class="text-xs text-gray-400 font-medium px-2 mb-2">گفتگوهای فعال</p>
                <div
                    v-for="chat in filteredActiveChats"
                    :key="chat.id"
                    @click="selectChatMobile(chat)"
                    :class="[
                    'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2',
                    selectedChatId === chat.id ? 'bg-sky-50 border border-sky-200' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="relative shrink-0">
                    <img :src="resolveUrl(chat.avatar)" class="w-12 h-12 rounded-xl object-cover">
                    <span
                        :class="[
                        'absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white',
                        chat.customerOnline ? 'bg-green-500' : 'bg-gray-300'
                      ]"
                    ></span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 text-sm">{{ chat.customerName }}</h3>
                    <p class="text-xs text-gray-500 truncate">{{ chat.petType }} - {{ chat.petName }}</p>
                    <span v-if="chat.unreadCount" class="px-1.5 py-0.5 bg-sky-600 text-white text-[10px] rounded-full">
                      {{ chat.unreadCount }}
                    </span>
                  </div>
                </div>
              </template>

              <!-- گفتگوهای بسته شده موبایل -->
              <template v-else>
                <div
                    v-for="chat in filteredClosedChats"
                    :key="chat.id"
                    @click="selectChatMobile(chat)"
                    class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 opacity-70 hover:bg-gray-50"
                >
                  <img :src="resolveUrl(chat.avatar)" class="w-12 h-12 rounded-xl object-cover shrink-0">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-700 text-sm">{{ chat.customerName }}</h3>
                    <p class="text-xs text-gray-400 truncate">{{ chat.petType }} - {{ chat.petName }}</p>
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full mt-1 inline-block">
                      {{ chat.closedAt }}
                    </span>
                  </div>
                </div>
              </template>
            </div>

            <!-- فوتر موبایل -->
            <div class="shrink-0 p-4 border-t border-gray-100 space-y-2">
              <router-link
                  to="/clinic"
                  class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  @click="showMobileSidebar = false"
              >
                <i class="ti ti-home"></i>
                <span class="font-medium">بازگشت به داشبورد</span>
              </router-link>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, provide, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useConsultationStore} from "@/stores/vet-clinic/consultation.js";
import {useMessageStore} from "@/stores/message.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";

const consultationStore = useConsultationStore()
const router = useRouter()
const route = useRoute()
const {resolveUrl} = useUrlHelper();
const showMobileSidebar = ref(false)
const selectedChatId = ref(null)
const activeTab = ref('active')
const searchQuery = ref('')

// Provide برای دسترسی از صفحات child
provide('toggleMobileSidebar', () => {
  showMobileSidebar.value = !showMobileSidebar.value
})

// Socket connection
let socket = null
const isConnected = ref(false)

// آمار پویا (Dynamic Stats)
// محاسبه تعداد گفتگوهای فعال امروز
const stats = computed(() => {
  const consultations = consultationStore.consultations || []

  // ۱. فعال امروز (Active Today)
  // فرض می‌کنیم وضعیت active یعنی فعال. اگر نیاز به بررسی تاریخ دارید، اینجا اضافه کنید.
  const activeCount = consultations.filter(c => c.status === 'active').length

  // ۲. تکمیل شده امروز (Completed Today)
  // فرض می‌کنیم status بسته شده یعنی completed
  const completedCount = consultations.filter(c => c.status === 'closed' || c.status === 'completed').length

  // ۳. در انتظار (Pending Now)
  const pendingCount = consultations.filter(c => c.status === 'pending' || c.status === 'request_sent').length

  return {
    activeToday: activeCount,
    completedToday: completedCount,
    pendingNow: pendingCount
  }
})
const chats = computed(() => {
  // اگر استور هنوز خالی است، آرایه خالی برگردان
  if (!consultationStore.consultations || consultationStore.consultations.length === 0) {
    return [];
  }

  return consultationStore.consultations.map(item => {
    // ۱. استخراج نام کاربر
    const fullName = [item.user?.firstName, item.user?.lastName]
        .filter(Boolean)
        .join(' ');

    // ۲. نگاشت نوع حیوان به فارسی
    const petTypeMap = {
      'CAT': 'گربه',
      'DOG': 'سگ',
      'BIRD': 'پرنده'
    };
    const petTypeFa = petTypeMap[item.pet?.type] || item.pet?.type || 'حیوان';

    // ۳. تولید آواتار (اگر کاربر عکس ندارد)
    const avatar = item.user?.avatar
        ? item.user.avatar
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`;

    // ۴. تبدیل وضعیت سرور به وضعیت UI (در صورت نیاز)
    // اینجا فرض می‌کنیم status ها یکی هستند، اما اگر نیاز به تغییر دارید اینجا اعمال کنید
    // مثلا: const uiStatus = item.status === 'request_sent' ? 'pending' : item.status;

    return {
      id: item.id,
      customerName: fullName || 'کاربر',
      customerAvatar: avatar,
      customerOnline: item.user?.isOnline || false,
      petName: item.pet?.name || 'نامشخص',
      petType: petTypeFa,
      petBreed: item.pet?.breed || '-',
      status: item.status, // request_sent, active, closed
      closedAt: new Date(item.updatedAt).toLocaleDateString('fa-IR'), // یا فیلد مربوط به تاریخ بسته شدن
      unreadCount: item.unread || 0, // تعداد پیام‌های خوانده نشده
      specialty: item.specialty || 'عمومی' // تخصص دکتر
    };
  });
});

// --- تعریف جدید بر اساس استور ---

// ۱. گفتگوهای در انتظار تایید (Pending)
const pendingChats = computed(() => {
  if (!consultationStore.consultations) return [];
  return consultationStore.consultations
      .filter(item => item.status === 'pending' || item.status === 'request_sent')
      .map(item => ({
        id: item.id,
        customerName: [item.user?.firstName, item.user?.lastName].filter(Boolean).join(' ') || 'کاربر',
        avatar: item.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`,
        petType: item.pet?.type || 'حیوان',
        petName: item.pet?.name || 'نامشخص',
        waitingTime: 'الان', // می‌توانید از تفاوت زمان createdAt با الان محاسبه کنید
        status: 'pending'
      }));
});

// ۲. گفتگوهای فعال (Active)
const activeChats = computed(() => {
  if (!consultationStore.consultations) return [];
  return consultationStore.consultations
      .filter(item => item.status === 'active')
      .map(item => ({
        id: item.id,
        customerName: [item.user?.firstName, item.user?.lastName].filter(Boolean).join(' ') || 'کاربر',
        avatar: item.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`,
        petType: item.pet?.type || 'حیوان',
        petName: item.pet?.name || 'نامشخص',
        customerOnline: item.user?.isOnline || false,
        lastMessageTime: item.lastMessageTime || 'الان', // باید در استور پر شده باشد
        unreadCount: item.unread || 0,
        isTyping: false, // این باید از طریق سوکت یا استور جداگانه مدیریت شود
        status: 'active'
      }));
});

// ۳. گفتگوهای بسته شده (Closed)
const closedChats = computed(() => {
  if (!consultationStore.consultations) return [];
  return consultationStore.consultations
      .filter(item => item.status === 'closed' || item.status === 'completed')
      .map(item => ({
        id: item.id,
        customerName: [item.user?.firstName, item.user?.lastName].filter(Boolean).join(' ') || 'کاربر',
        avatar: item.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`,
        petType: item.pet?.type || 'حیوان',
        petName: item.pet?.name || 'نامشخص',
        closedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('fa-IR') : 'نامشخص',
        status: 'closed'
      }));
});

// ۴. تعداد در انتظار (نیازی به تغییر نیست چون روی pendingChats حساب می‌کند)
const pendingCount = computed(() => pendingChats.value.length);

// فیلتر شده‌ها
const filteredActiveChats = computed(() => {
  if (!searchQuery.value) return activeChats.value
  return activeChats.value.filter(chat =>
      chat.customerName.includes(searchQuery.value) ||
      chat.petName.includes(searchQuery.value)
  )
})

const filteredClosedChats = computed(() => {
  if (!searchQuery.value) return closedChats.value
  return closedChats.value.filter(chat =>
      chat.customerName.includes(searchQuery.value) ||
      chat.petName.includes(searchQuery.value)
  )
})
console.log('filteredClosedChats',filteredClosedChats)
// انتخاب گفتگو
const selectChat = (chat) => {
  selectedChatId.value = chat.id
  router.push(`/clinics/chat/${chat.id}`)
}

const selectChatMobile = (chat) => {
  selectChat(chat)
  showMobileSidebar.value = false
}

const messageStore = useMessageStore()
// تنظیم چت انتخاب شده از URL
onMounted(async () => {
  await consultationStore.fetchConsultations()
  if (route.params.id) {
    selectedChatId.value = parseInt(route.params.id)
    await messageStore.fetchConsultationMessages(route.params.id)
  }

})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
})

// Watch route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    selectedChatId.value = parseInt(String(newId))
    await messageStore.fetchConsultationMessages(String(newId))
  }
})
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-from aside,
.sidebar-leave-to aside {
  transform: translateX(100%);
}

.sidebar-enter-from .bg-black\/50,
.sidebar-leave-to .bg-black\/50 {
  opacity: 0;
}

.notification-panel-enter-active,
.notification-panel-leave-active {
  transition: all 0.3s ease;
}

.notification-panel-enter-from,
.notification-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
