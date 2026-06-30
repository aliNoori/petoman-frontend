<template>
  <div class="h-screen bg-gray-50 flex font-vazir" dir="rtl">
    <!-- Sidebar with chats -->
    <div :class="[
      'bg-white border-l-2 border-gray-100 flex flex-col transition-all shadow-sm',
      selectedChat && isMobile ? 'hidden' : 'w-full md:w-96'
    ]">
      <div class="p-4 border-b-2 border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <NuxtLink to="/profile" class="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <i class="ti ti-arrow-right text-xl text-gray-600"></i>
            </NuxtLink>
            <h2 class="text-xl font-bold text-gray-900">گفتگوها</h2>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button v-if="selectedChat && isMobile"
                    @click="selected = null"
                    class="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- Search -->
        <div class="relative mb-4">
          <input v-model="searchQuery"
                 class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all"
                 placeholder="جستجوی دکتر...">
          <div class="absolute left-3 top-3.5">
            <i class="ti ti-search text-gray-400"></i>
          </div>
        </div>
        <!-- Tabs -->
        <ClientOnly>
        <div class="flex bg-gray-100 rounded-2xl p-1.5">
          <button @click="tab = 'active'"
                  :class="tab === 'active' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'"
                  class="flex-1 py-2.5 text-sm rounded-xl transition-all">
            فعال ({{ activeCount }})
          </button>
          <button @click="tab = 'inactive'"
                  :class="tab === 'inactive' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'"
                  class="flex-1 py-2.5 text-sm rounded-xl transition-all">
            غیرفعال ({{ inactiveCount }})
          </button>
        </div>
        </ClientOnly>
      </div>
      <!-- Chat list -->
      <div class="flex-1 overflow-y-auto">
        <NuxtLink
            v-for="chat in currentChats"
            :key="chat.id"
            :to="`/chat/${chat.id}`"
            :class="selected === chat.id ? 'bg-sky-50 border-r-4 border-sky-500' : 'hover:bg-gray-50'"
            class="flex p-4 border-b border-gray-100 cursor-pointer transition-all chat-item"
            @click.native="selectChat(chat.id)">
          <div class="relative shrink-0">
            <div class="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center ml-3">
              <img :src="resolveUrl(chat.avatar)" class="w-12 h-12 rounded-full">
            </div>
            <span :class="[
              chat.isOnline ? 'bg-green-500' : 'bg-gray-400',
              'absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white'
            ]"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-1">
                <h3 class="font-bold text-gray-900 text-sm">{{ chat.name }}</h3>
                <i v-if="chat.name.includes('دکتر')"
                   class="ti ti-rosette-discount-check-filled text-sky-500 text-xs"></i>
                <span v-if="chat.status === 'closed'"
                      class="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                  بسته شده
                </span>
              </div>
              <span class="text-xs text-gray-400">{{ chat.lastTime }}</span>
            </div>
            <p class="text-xs text-gray-600 truncate">{{ chat.lastMsg }}</p>
            <div v-if="chat.specialty" class="text-[10px] text-gray-400 mt-0.5">{{ chat.specialty }}</div>
          </div>
          <div class="flex flex-col items-center gap-2 shrink-0 mt-10">
            <!-- Badge برای تعداد پیام‌های خوانده نشده -->
            <div
                v-if="chat.unread > 0"
                class="bg-blue-500 text-white text-[11px] font-bold w-6 h-6 pt-0 pb-0 flex items-center justify-center rounded-full shadow-sm"
            >
              {{ chat.unread > 99 ? '99+' : chat.unread }}
            </div>
            <i v-if="chat.unread === 0 && chat.specialty" class="ti ti-pill text-sky-400 text-sm"></i>
            <i v-if="chat.status === 'closed'" class="ti ti-lock text-red-400 text-sm"></i>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State for Desktop -->
    <div v-if="!selectedChat && !isMobile" class="hidden md:flex flex-1 items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 class="text-xl text-gray-500 mb-2">گفتگویی انتخاب نشده</h3>
        <p class="text-gray-400">یکی از چت‌ها را انتخاب کنید</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useUrlHelper} from "~/composables/useUrlHelper";
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useSocketStore} from "~/stores/socket";
import {useConsultationStore} from "~/stores/consultation";
definePageMeta({
  layout: false
})
const {resolveUrl} = useUrlHelper();
const socketStore = useSocketStore();
const {onlineUsers} = storeToRefs(socketStore);

// Stores
const consultationStore = useConsultationStore();

// Reactive state
const tab = ref('active');
const selected = ref(null);
const searchQuery = ref('');
const windowWidth = ref(0);

const isMobile = computed(() => windowWidth.value < 768);

// Computed Properties
const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) return consultationStore.consultations;
  return consultationStore.consultations.filter(chat =>
      chat.name.includes(searchQuery.value) ||
      chat.specialty.includes(searchQuery.value) ||
      chat.lastMsg.includes(searchQuery.value)
  );
});

const currentChats = computed(() => {
  return filteredChats.value.filter(c => {
    if (tab.value === 'active') return c.status === 'active';
    if (tab.value === 'inactive') return c.status === 'closed' || c.status === 'pending' || c.status === 'waiting' || c.status === 'inactive';
    return true;
  });
});
console.log('ccc',filteredChats.value)
const activeCount = computed(() =>
    consultationStore.consultations.filter(c => c.status === 'active').length
);

const inactiveCount = computed(() =>
    consultationStore.consultations.filter(c => c.status === 'closed' || c.status === 'pending' || c.status === 'inactive').length
);

const selectedChat = computed(() => {
  if (selected.value) {
    return consultationStore.consultations.find(c => String(c.id) === String(selected.value));
  }
  return null;
});

// Methods
const selectChat = (chatId) => {
  selected.value = chatId;
};

const updateWindowWidth = () => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
  }
};

// Lifecycle Hooks
onMounted(async () => {
  updateWindowWidth();
  window.addEventListener('resize', updateWindowWidth);
  await consultationStore.fetchConsultations();
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', updateWindowWidth);
  }
});

// Watchers
watch(() => socketStore.onlineUsers, (newOnlineUsers) => {
  consultationStore.consultations.forEach(chat => {
    const targetUserId = chat.doctorId;
    if (targetUserId) {
      const isNowOnline = newOnlineUsers.has(targetUserId.toString());
      if (chat.isOnline !== isNowOnline) {
        consultationStore.updateConsultation(String(chat.id), {
          isOnline: isNowOnline
        });
      }
    }
  });
}, {deep: true});

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap'
    }
  ]
})
</script>

<style scoped>
.font-vazir {
  font-family: 'Vazirmatn', sans-serif;
}

.transition-all {
  transition: all 0.3s ease;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.chat-item {
  transition: all 0.2s ease;
}

.chat-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .w-80 {
    width: 100%;
    position: absolute;
    z-index: 10;
    height: 100%;
  }
}
</style>