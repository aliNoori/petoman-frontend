<template>
  <div class="h-screen flex flex-col lg:flex-row bg-gray-50" dir="rtl">
    <!-- سایدبار دسکتاپ -->
    <aside class="hidden lg:flex flex-col w-80 bg-white border-l border-gray-200 h-screen">
      <!-- هدر سایدبار -->
      <div class="shrink-0 p-4 border-b border-gray-100 bg-gradient-to-l from-purple-50 to-white">
        <div class="flex items-center gap-3">
          <router-link to="/users" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-arrow-right text-xl text-gray-600"></i>
          </router-link>
          <div>
            <h1 class="font-bold text-gray-900">گفتگو با دکتر</h1>
            <p class="text-xs text-gray-500">مشاوره آنلاین</p>
          </div>
        </div>
      </div>

      <!-- لیست گفتگوها -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-3">
          <p class="text-xs text-gray-400 font-medium px-2 mb-2">گفتگوهای فعال</p>
          
          <div 
            v-for="chat in activeChats" 
            :key="chat.id"
            @click="selectChat(chat)"
            :class="[
              'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2',
              selectedChatId === chat.id ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
            ]"
          >
            <div class="relative shrink-0">
              <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <i class="ti ti-user text-purple-600 text-xl"></i>
              </div>
              <span 
                :class="[
                  'absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white',
                  chat.doctorOnline ? 'bg-green-500' : 'bg-gray-300'
                ]"
              ></span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 text-sm">{{ chat.doctorName }}</h3>
                <span class="text-xs text-gray-400">{{ chat.lastMessageTime }}</span>
              </div>
              <p class="text-xs text-gray-500 truncate">{{ chat.petName }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full">{{ chat.remainingTime }}</span>
                <span v-if="chat.unreadCount" class="px-1.5 py-0.5 bg-purple-600 text-white text-[10px] rounded-full min-w-[18px] text-center">
                  {{ chat.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="closedChats.length" class="p-3 border-t border-gray-100">
          <p class="text-xs text-gray-400 font-medium px-2 mb-2">گفتگوهای پایان یافته</p>
          
          <div 
            v-for="chat in closedChats" 
            :key="chat.id"
            @click="selectChat(chat)"
            :class="[
              'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 opacity-70',
              selectedChatId === chat.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
            ]"
          >
            <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <i class="ti ti-user text-gray-400 text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-700 text-sm">{{ chat.doctorName }}</h3>
              <p class="text-xs text-gray-400 truncate">{{ chat.petName }}</p>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full mt-1 inline-block">پایان یافته</span>
            </div>
          </div>
        </div>
      </div>

      <!-- فوتر سایدبار -->
      <div class="shrink-0 p-4 border-t border-gray-100">
        <router-link 
          to="/users/visits" 
          class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
        >
          <i class="ti ti-plus"></i>
          <span class="font-medium">رزرو مشاوره جدید</span>
        </router-link>
      </div>
    </aside>

    <!-- محتوای اصلی -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <router-view />
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
            <div class="shrink-0 p-4 border-b border-gray-100 bg-gradient-to-l from-purple-50 to-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="ti ti-messages text-purple-600 text-xl"></i>
                <h1 class="font-bold text-gray-900">گفتگوها</h1>
              </div>
              <button @click="showMobileSidebar = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="ti ti-x text-gray-600"></i>
              </button>
            </div>

            <!-- لیست گفتگوها -->
            <div class="flex-1 overflow-y-auto p-3">
              <p class="text-xs text-gray-400 font-medium px-2 mb-2">گفتگوهای فعال</p>
              
              <div 
                v-for="chat in activeChats" 
                :key="chat.id"
                @click="selectChatMobile(chat)"
                :class="[
                  'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2',
                  selectedChatId === chat.id ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
                ]"
              >
                <div class="relative shrink-0">
                  <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <i class="ti ti-user text-purple-600 text-xl"></i>
                  </div>
                  <span 
                    :class="[
                      'absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white',
                      chat.doctorOnline ? 'bg-green-500' : 'bg-gray-300'
                    ]"
                  ></span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="font-medium text-gray-900 text-sm">{{ chat.doctorName }}</h3>
                    <span class="text-xs text-gray-400">{{ chat.lastMessageTime }}</span>
                  </div>
                  <p class="text-xs text-gray-500 truncate">{{ chat.petName }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full">{{ chat.remainingTime }}</span>
                  </div>
                </div>
              </div>

              <div v-if="closedChats.length" class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-400 font-medium px-2 mb-2">گفتگوهای پایان یافته</p>
                <div 
                  v-for="chat in closedChats" 
                  :key="chat.id"
                  @click="selectChatMobile(chat)"
                  class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2 opacity-70 hover:bg-gray-50"
                >
                  <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <i class="ti ti-user text-gray-400 text-xl"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-700 text-sm">{{ chat.doctorName }}</h3>
                    <p class="text-xs text-gray-400 truncate">{{ chat.petName }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- فوتر -->
            <div class="shrink-0 p-4 border-t border-gray-100 space-y-2">
              <router-link 
                to="/users/visits" 
                class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                @click="showMobileSidebar = false"
              >
                <i class="ti ti-plus"></i>
                <span class="font-medium">رزرو مشاوره جدید</span>
              </router-link>
              <router-link 
                to="/users" 
                class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                @click="showMobileSidebar = false"
              >
                <i class="ti ti-home"></i>
                <span class="font-medium">بازگشت به پنل</span>
              </router-link>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const showMobileSidebar = ref(false)
const selectedChatId = ref(null)

// Provide برای دسترسی از صفحات child
provide('toggleMobileSidebar', () => {
  showMobileSidebar.value = !showMobileSidebar.value
})

// گفتگوهای فعال
const activeChats = ref([
  {
    id: 6,
    doctorId: 102,
    doctorName: 'دکتر محمدی',
    doctorOnline: true,
    petName: 'میلو - مشکل پوستی',
    remainingTime: '۲۰ ساعت',
    lastMessageTime: '۱۰ دقیقه پیش',
    unreadCount: 2
  },
  {
    id: 7,
    doctorId: 103,
    doctorName: 'دکتر نوری',
    doctorOnline: false,
    petName: 'مکس - مشکل گوارشی',
    remainingTime: '۲۳ ساعت',
    lastMessageTime: 'الان',
    unreadCount: 0
  }
])

// گفتگوهای پایان یافته
const closedChats = ref([
  {
    id: 4,
    doctorId: 101,
    doctorName: 'دکتر رضایی',
    petName: 'میلو - مشاوره تغذیه',
    endedAt: '۱۴۰۳/۰۹/۱۰'
  }
])

// انتخاب گفتگو
const selectChat = (chat) => {
  selectedChatId.value = chat.id
  router.push(`/users/chat/${chat.id}`)
}

const selectChatMobile = (chat) => {
  selectChat(chat)
  showMobileSidebar.value = false
}

// تنظیم چت انتخاب شده از URL
onMounted(() => {
  if (route.params.doctorId) {
    selectedChatId.value = parseInt(route.params.doctorId)
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
</style>
