<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Version -->
    <div v-if="isMobile">
      <!-- Mobile Header -->
      <section class="bg-gradient-to-br from-orange-500 to-red-600 text-white pt-20">
        <div class="px-4 py-4">
          <div class="flex flex-col items-center gap-3">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center overflow-hidden">
                <img
                  v-if="user.avatar" 
                  :src="user.avatar" 
                  :alt="user.firstName"
                  class="w-full h-full object-cover"
                />
                <Icon v-else name="user" :size="32" class="text-white" />
              </div>
              <!-- Edit Button -->
              <label
                  for="avatarUpload"
                  class="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Icon name="camera" size="sm" class="text-orange-600 text-xs" />
              </label>
              <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
              />
            </div>

            <!-- User Info -->
            <div class="flex-1 text-center">
              <h1 class="text-lg font-bold mb-0.5">{{ user.firstName }}</h1>
              <p class="text-sm text-white/90 mb-2">{{ user.email }}</p>
              
              <!-- Stats -->
              <div class="flex items-center justify-center gap-4">
                <div class="text-center">
                  <div class="text-lg font-bold">{{ likedPosts.length }}</div>
                  <div class="text-[10px] text-white/80">لایک‌ها</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold">{{ bookmarkedPosts.length }}</div>
                  <div class="text-[10px] text-white/80">ذخیره‌ها</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold">{{ user.posts || 0 }}</div>
                  <div class="text-[10px] text-white/80">پست‌ها</div>
                </div>
              </div>
            </div>

            <!-- Edit Button -->
            <button 
              @click="openEditModal"
              class="px-4 py-2 bg-white text-orange-600 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
            >
              ویرایش پروفایل
            </button>
          </div>
        </div>
      </section>

      <!-- Mobile Tabs -->
      <section class="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="px-4">
          <div class="flex gap-1 overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs.filter(t => t.id !== 'settings')"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-2 px-4 py-3 font-semibold whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600'
              ]"
            >
              <Icon :name="tab.icon" size="sm" />
              <span class="text-sm">{{ tab.label }}</span>
              <span 
                v-if="tab.count > 0"
                class="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- Mobile Content -->
      <section class="py-6">
        <div class="px-4">
          <!-- Liked Posts -->
          <div v-if="activeTab === 'liked'">
            <div v-if="likedPosts.length === 0" class="text-center py-16">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="heart" size="xl" class="text-gray-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز پستی لایک نکرده‌اید</h3>
              <p class="text-gray-600 mb-6">پست‌های مورد علاقه خود را لایک کنید</p>
              <NuxtLink 
                to="/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl"
              >
                مشاهده پست‌ها
                <Icon name="arrow-left" size="sm" />
              </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <PostCard 
                v-for="post in likedPostsData" 
                :key="post.id" 
                :post="post"
              />
            </div>
          </div>

          <!-- Bookmarked Posts -->
          <div v-if="activeTab === 'bookmarked'">
            <div v-if="bookmarkedPosts.length === 0" class="text-center py-16">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="bookmark" size="xl" class="text-gray-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز پستی ذخیره نکرده‌اید</h3>
              <p class="text-gray-600 mb-6">پست‌های مفید را ذخیره کنید</p>
              <NuxtLink 
                to="/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl"
              >
                مشاهده پست‌ها
                <Icon name="arrow-left" size="sm" />
              </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <PostCard 
                v-for="post in bookmarkedPostsData"
                :key="post.id" 
                :post="post"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Desktop Version -->
    <div v-if="isDesktop">
      <!-- Desktop Header -->
      <section class="bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
          <div class="flex items-center gap-6">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="user.avatar" 
                  :src="user.avatar" 
                  :alt="user.firstName"
                  class="w-full h-full object-cover"
                />
                <Icon v-else name="user" :size="48" class="text-white" />
              </div>
              <!-- Edit Button -->
              <label
                  for="avatarUpload"
                  class="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Icon name="camera" size="sm" class="text-orange-600 text-xs" />
              </label>
              <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
              />
            </div>

            <!-- User Info -->
            <div class="flex-1 text-right">
              <h1 class="text-3xl font-bold mb-2">{{ user.firstName }}</h1>
              <p class="text-base text-white/90 mb-4">{{ user.email }}</p>
              
              <!-- Stats -->
              <div class="flex items-center justify-start gap-8">
                <div class="text-center">
                  <div class="text-3xl font-bold">{{ likedPosts.length }}</div>
                  <div class="text-sm text-white/80">لایک‌ها</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold">{{ bookmarkedPosts.length }}</div>
                  <div class="text-sm text-white/80">ذخیره‌ها</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold">{{ user.posts || 0 }}</div>
                  <div class="text-sm text-white/80">پست‌ها</div>
                </div>
              </div>
            </div>

            <!-- Edit Button -->
            <button 
              @click="openEditModal"
              class="px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              ویرایش پروفایل
            </button>
          </div>
        </div>
      </section>

      <!-- Desktop Tabs -->
      <section class="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex gap-2">
            <button
              v-for="tab in tabs.filter(t => t.id !== 'settings')"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon :name="tab.icon" size="sm" />
              <span class="text-base">{{ tab.label }}</span>
              <span 
                v-if="tab.count > 0"
                class="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- Desktop Content -->
      <section class="py-8">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Liked Posts -->
          <div v-if="activeTab === 'liked'">
            <div v-if="likedPosts.length === 0" class="text-center py-16">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="heart" size="xl" class="text-gray-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز پستی لایک نکرده‌اید</h3>
              <p class="text-gray-600 mb-6">پست‌های مورد علاقه خود را لایک کنید تا اینجا نمایش داده شوند</p>
              <NuxtLink 
                to="/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all"
              >
                مشاهده پست‌ها
                <Icon name="arrow-left" size="sm" />
              </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <PostCard 
                v-for="post in likedPostsData"
                :key="post.id" 
                :post="post"
              />
            </div>
          </div>

          <!-- Bookmarked Posts -->
          <div v-if="activeTab === 'bookmarked'">
            <div v-if="bookmarkedPosts.length === 0" class="text-center py-16">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="bookmark" size="xl" class="text-gray-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز پستی ذخیره نکرده‌اید</h3>
              <p class="text-gray-600 mb-6">پست‌های مفید را ذخیره کنید تا بعداً به راحتی پیدا کنید</p>
              <NuxtLink 
                to="/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all"
              >
                مشاهده پست‌ها
                <Icon name="arrow-left" size="sm" />
              </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <PostCard 
                v-for="post in bookmarkedPostsData" 
                :key="post.id" 
                :post="post"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Edit Profile Modal / Bottom Sheet -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showEditModal" 
          class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          @click="showEditModal = false"
        ></div>
      </Transition>
      
      <!-- Modal/Sheet Container -->
      <Transition
        enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
        enter-from-class="translate-y-full opacity-0"
        leave-to-class="translate-y-full opacity-0"
      >
        <div 
          v-if="showEditModal" 
          :class="[
            'fixed z-[61]',
            isMobile 
              ? 'bottom-0 left-0 right-0 rounded-t-3xl' 
              : 'inset-0 flex items-center justify-center p-4'
          ]"
          @click="isMobile ? null : (isDesktop ? showEditModal = false : null)"
        >
        <div 
          :class="[
            'bg-white shadow-2xl overflow-hidden',
            isMobile 
              ? 'w-full rounded-t-3xl' 
              : 'rounded-2xl max-w-lg w-full max-h-[90vh]'
          ]"
          :style="isMobile ? 'height: 85vh;' : ''"
          @click.stop
        >
          <!-- Handle Bar (Mobile Only) -->
          <div v-if="isMobile" class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Modal Header -->
          <div :class="[
            'sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between z-10',
            isMobile ? 'pt-2' : 'rounded-t-2xl'
          ]">
            <button 
              v-if="isMobile"
              @click="showEditModal = false"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" size="sm" />
            </button>
            <h2 class="text-xl font-bold text-gray-800">ویرایش پروفایل</h2>
            <button 
              v-if="!isMobile"
              @click="showEditModal = false"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" size="sm" />
            </button>
            <div v-else class="w-8"></div>
          </div>

          <!-- Modal Body -->
          <div 
            :class="['overflow-y-auto']"
            :style="isMobile ? 'height: calc(85vh - 3rem);' : ''"
          >
            <div class="p-4 md:p-6 space-y-4">
              <!-- Avatar Upload -->
              <div class="flex flex-col items-center gap-3">
                <div class="relative">
                  <div class="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="user.avatar" 
                      :src="user.avatar" 
                      :alt="user.firstName"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="user" :size="32" class="text-white" />
                  </div>
                  <label
                      for="avatarUpload"
                      class="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Icon name="camera" size="sm" class="text-orange-600 text-xs" />
                  </label>
                  <input
                      id="avatarUpload"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarUpload"
                  />
                </div>
                <p class="text-sm text-gray-600">کلیک کنید تا عکس پروفایل را تغییر دهید</p>
              </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                <input 
                  v-model="editUser.firstName"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input 
                  v-model="editUser.phoneNumber"
                  type="tel"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="09123456789"
                />
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div :class="[
            'bg-white px-4 md:px-6 py-4 flex gap-3 border-t border-gray-200',
            isMobile ? 'rounded-b-3xl' : 'sticky bottom-0 rounded-b-2xl'
          ]">
            <button 
              @click="saveProfile"
              class="flex-1 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 active:scale-95 transition-all"
            >
              ذخیره تغییرات
            </button>
            <button 
              v-if="!isMobile"
              @click="showEditModal = false"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              انصراف
            </button>
          </div>
        </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const postStore=usePostStore()
// Device detection
const isMobile = ref(false)
const isDesktop = ref(false)

// Check device type
const checkDevice = () => {
  if (process.client) {
    isMobile.value = window.innerWidth < 768
    isDesktop.value = window.innerWidth >= 768
  }
}

// User data
const user = ref({
  id:'',
  firstName: 'کاربر پت دانیم',
  lastName: 'کاربر پت دانیم',
  email: 'user@petdanim.com',
  phoneNumber: '',
  avatar: '',
  posts: 0,
  role:'',
  createdAt:''
})
const selectedAvatarFile = ref<File | undefined>(undefined)

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  selectedAvatarFile.value = file

  // پیش‌نمایش فوری
  user.value.avatar = URL.createObjectURL(file)
}

const authStore=useAuthStore()
// Initialize and watch for resize
onMounted(async () => {
  await authStore.fetchUser()
  const savedUser = localStorage.getItem('auth_user')
  if (savedUser) {
    user.value = JSON.parse(savedUser) as {
      id:string
      firstName: string
      lastName:string
      email: string
      phoneNumber: string
      avatar: string
      posts: number
      role:string
      createdAt:string
    }
  }
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkDevice)
  }
})

// Edit modal state
const showEditModal = ref(false)
const editUser = ref({
  id:'',
  firstName: '',
  lastName:'',
  email: '',
  phoneNumber: '',
  avatar: '',
  posts:0,
  role:'',
  createdAt:''
})

// Open edit modal
const openEditModal = () => {
  editUser.value = { ...user.value }
  showEditModal.value = true
}

// Save profile changes
const saveProfile = async () => {
  user.value = {...user.value, ...editUser.value}

  await authStore.updateProfile(user.value.id,user.value,selectedAvatarFile.value)
  showEditModal.value = false
  // Here you would normally call an API to save the changes
  alert('تغییرات با موفقیت ذخیره شد!')
}

// Active tab - initialize from query parameter
const activeTab = ref((route.query.tab as string) || 'liked')

// Watch for query changes
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as string
  }
})

// Liked and bookmarked post IDs
const likedPosts = ref<string[]>([])
const bookmarkedPosts = ref<string[]>([])

// All posts data (mock)
/*const allPostsData = ref([
  {
    id: 1,
    title: 'راهنمای کامل آموزش فرمان "بشین" به سگ',
    excerpt: 'یکی از اولین و مهم‌ترین فرمان‌هایی که باید به سگ‌تان یاد دهید، فرمان "بشین" است.',
    author: 'دکتر احمد محمدی',
    date: '۲۳ مهر ۱۴۰۳',
    readTime: 8,
    views: 245,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
    category: 'dogs'
  },
  {
    id: 2,
    title: 'چگونه با گربه خود ارتباط بهتری برقرار کنیم؟',
    excerpt: 'گربه‌ها موجوداتی مستقل هستند اما با شناخت زبان بدن آن‌ها می‌توانید ارتباط عمیق‌تری برقرار کنید.',
    author: 'سارا کریمی',
    date: '۲۲ مهر ۱۴۰۳',
    readTime: 10,
    views: 312,
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0e3?w=600&h=400&fit=crop',
    category: 'cats'
  },
  {
    id: 3,
    title: 'بهترین غذاهای خشک برای سگ‌های بالغ',
    excerpt: 'انتخاب غذای مناسب برای سگ بالغ یکی از مهم‌ترین تصمیمات است.',
    author: 'مریم کریمی',
    date: '۲۱ مهر ۱۴۰۳',
    readTime: 12,
    views: 189,
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=600&h=400&fit=crop',
    category: 'dogs'
  }
])*/

const allPostsData=computed(()=>postStore.posts)

// Tabs configuration
const tabs = computed(() => [
  {
    id: 'liked',
    label: 'علاقه‌مندی‌ها',
    icon: 'heart',
    count: likedPosts.value.length
  },
  {
    id: 'bookmarked',
    label: 'ذخیره‌شده‌ها',
    icon: 'bookmark',
    count: bookmarkedPosts.value.length
  },
  {
    id: 'settings',
    label: 'تنظیمات',
    icon: 'settings',
    count: 0
  }
])

// Get liked posts data
const likedPostsData = computed(() => {
  return allPostsData.value.filter((post:any) => likedPosts.value.includes(post.id))
})

// Get bookmarked posts data
const bookmarkedPostsData = computed(() => {
  return allPostsData.value.filter((post:any) => bookmarkedPosts.value.includes(post.id))
})

// Load saved data from localStorage
onMounted(async () => {
  await postStore.fetchPosts()
  likedPosts.value = postStore.likedPostIds
  bookmarkedPosts.value = postStore.bookmarkedPostIds
})

// Meta tags
useHead({
  title: 'پروفایل کاربری - پت دانیم',
  meta: [
    { name: 'description', content: 'مشاهده و ویرایش پروفایل کاربری، علاقه‌مندی‌ها و ذخیره‌شده‌ها' }
  ]
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Toggle Switch */
.toggle {
  appearance: none;
  width: 48px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle:checked {
  background: #ea580c;
}

.toggle::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 2px;
  right: 2px;
  transition: transform 0.3s;
}

.toggle:checked::before {
  transform: translateX(-24px);
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}
</style>
