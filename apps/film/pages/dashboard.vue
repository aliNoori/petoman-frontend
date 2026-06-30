<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
    <!-- Header -->
    <HeaderFilm />

    <!-- Dashboard Content -->
    <div class="container mx-auto px-4 pt-32 pb-12">
      <!-- Page Title -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-yellow-500 mb-4">داشبورد کاربری</h1>
        <p class="text-gray-400 text-lg">مدیریت پروفایل و تنظیمات حساب کاربری</p>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Sidebar - Profile Overview -->
        <div class="lg:col-span-1">
          <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8 text-center">
            <!-- Profile Avatar -->
            <div class="relative mb-6">
              <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  class="w-24 h-24 mx-auto rounded-full object-cover border border-yellow-500/40"
              />

              <div
                  v-else
                  class="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-3xl font-bold text-black"
              >
                {{ userInitials }}
              </div>
              <input type="file" accept="image/*" class="hidden" ref="avatarInput" @change="onAvatarChange" />
              <button
                  @click="avatarInput?.click()"
                  class="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-yellow-500 hover:bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >

                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <!-- User Info -->
            <h2 class="text-xl font-bold text-white mb-2">{{ fullName }}</h2>
            <p class="text-gray-400 mb-4">{{ user?.email }}</p>
            <div class="text-sm text-gray-500 space-y-1">
              <p>عضویت از: {{ formatDate(user?.createdAt||'') }}</p>
              <p>فیلم‌های مشاهده شده: {{ watchHistory.length }}</p>
              <p>علاقه‌مندی‌ها: {{ favoriteFilms.length }}</p>
            </div>

            <!-- Quick Actions -->
            <div class="mt-6 space-y-2">
              <button @click="activeTab = 'profile'" class="w-full py-2 px-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg transition-colors">
                ویرایش پروفایل
              </button>
              <button @click="activeTab = 'favorites'" class="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
                فیلم‌های مورد علاقه
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-2">
          <!-- Tab Navigation -->
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8">
            <!-- Profile Edit Tab -->
            <div v-if="activeTab === 'profile'" class="space-y-6">
              <h3 class="text-2xl font-bold text-yellow-500 mb-6">ویرایش اطلاعات شخصی</h3>
              
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">نام</label>
                    <input
                      v-model="editForm.firstName"
                      type="text"
                      class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:outline-none focus:border-yellow-500/60"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">نام خانوادگی</label>
                    <input
                      v-model="editForm.lastName"
                      type="text"
                      class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:outline-none focus:border-yellow-500/60"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:outline-none focus:border-yellow-500/60"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">شماره تلفن</label>
                  <input
                    v-model="editForm.phoneNumber"
                    type="tel"
                    class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:outline-none focus:border-yellow-500/60"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">بیو</label>
                  <textarea
                    v-model="editForm.bio"
                    rows="4"
                    class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:outline-none focus:border-yellow-500/60"
                    placeholder="چند کلمه درباره خودتان بنویسید..."
                  ></textarea>
                </div>

                <div class="flex gap-4">
                  <button
                    type="submit"
                    class="px-6 py-3 bg-yellow-500 hover:bg-amber-500 text-black font-medium rounded-xl transition-colors"
                  >
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    @click="resetForm"
                    class="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>

            <!-- Favorites Tab -->
            <div v-if="activeTab === 'favorites'" class="space-y-6">
              <h3 class="text-2xl font-bold text-yellow-500 mb-6">فیلم‌های مورد علاقه</h3>
              
              <div v-if="favoriteFilms.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p class="text-gray-400 text-lg mb-4">هنوز فیلمی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
                <NuxtLink to="/movies" class="inline-block px-6 py-3 bg-yellow-500 hover:bg-amber-500 text-black font-medium rounded-xl transition-colors">
                  مشاهده فیلم‌ها
                </NuxtLink>
              </div>

              <div v-else class="grid md:grid-cols-2 gap-6">
                <div
                  v-for="film in favoriteFilms"
                  :key="film.id"
                  class="flex gap-4 p-4 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-xl transition-all border border-transparent hover:border-yellow-500/20"
                >
                  <img
                    :src="film.poster"
                    :alt="film.title"
                    class="w-16 h-20 object-cover rounded-lg bg-zinc-700"
                  >
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-white truncate">{{ film.title }}</h4>
                    <p class="text-sm text-yellow-500 mb-1">{{ film.category }}</p>
                    <p class="text-xs text-gray-400">⭐ {{ film.rating }}/10</p>
                    <div class="flex gap-2 mt-2">
                      <NuxtLink :to="`/player/${film.id}`" class="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors">
                        تماشا
                      </NuxtLink>
                      <button @click="removeFavorite(film.id, film.type)">
                        حذف
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Tab -->
            <div v-if="activeTab === 'settings'" class="space-y-6">
              <h3 class="text-2xl font-bold text-yellow-500 mb-6">تنظیمات</h3>
              <div class="space-y-6">
                <!-- Notifications -->
                <div class="p-6 bg-zinc-800/30 rounded-xl">
                  <h4 class="text-lg font-semibold text-white mb-4">اعلان‌ها</h4>
                  <div class="space-y-4">
                    <label class="flex items-center justify-between">
                      <span class="text-gray-300">اعلان فیلم‌های جدید</span>
                      <input type="checkbox" v-model="settings.newFilmsNotification"
                             @change="settingsStore.saveSettings()"
                             class="toggle">
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-300">اعلان نظرات جدید</span>
                      <input type="checkbox" v-model="settings.commentsNotification"
                             @change="settingsStore.saveSettings()"
                             class="toggle">
                    </label>
                  </div>
                </div>

                <!-- Privacy -->
                <div class="p-6 bg-zinc-800/30 rounded-xl">
                  <h4 class="text-lg font-semibold text-white mb-4">حریم خصوصی</h4>
                  <div class="space-y-4">
                    <label class="flex items-center justify-between">
                      <span class="text-gray-300">نمایش پروفایل عمومی</span>
                      <input type="checkbox" v-model="settings.publicProfile"
                             @change="settingsStore.saveSettings()"
                             class="toggle">
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-300">نمایش لیست علاقه‌مندی‌ها</span>
                      <input type="checkbox" v-model="settings.showFavorites"
                             @change="settingsStore.saveSettings()"
                             class="toggle">
                    </label>
                  </div>
                </div>

                <!-- Account Actions -->
                <div class="p-6 bg-zinc-800/30 rounded-xl">
                  <h4 class="text-lg font-semibold text-white mb-4">عملیات حساب</h4>
                  <div class="space-y-4">
                    <div class="p-6 bg-zinc-800/30 rounded-xl">
                      <h4 class="text-lg font-semibold text-white mb-6">تغییر رمز عبور</h4>

                      <form @submit.prevent="submitChangePassword" class="space-y-4">
                        <div>
                          <label class="block text-sm text-gray-300 mb-1">رمز عبور فعلی</label>
                          <input
                              v-model="passwordForm.currentPassword"
                              type="password"
                              class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:border-yellow-500/60"
                          />
                        </div>

                        <div>
                          <label class="block text-sm text-gray-300 mb-1">رمز عبور جدید</label>
                          <input
                              v-model="passwordForm.newPassword"
                              type="password"
                              class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:border-yellow-500/60"
                          />
                        </div>

                        <div>
                          <label class="block text-sm text-gray-300 mb-1">تکرار رمز عبور جدید</label>
                          <input
                              v-model="passwordForm.confirmPassword"
                              type="password"
                              class="w-full px-4 py-3 bg-zinc-800/50 border border-yellow-500/20 rounded-xl text-white focus:border-yellow-500/60"
                          />
                        </div>

                        <button
                            type="submit"
                            :disabled="passwordLoading"
                            class="px-6 py-3 bg-yellow-500 hover:bg-amber-500 text-black font-medium rounded-xl transition-colors disabled:opacity-50"
                        >
                          {{ passwordLoading ? 'در حال تغییر...' : 'تغییر رمز عبور' }}
                        </button>
                      </form>
                    </div>

<!--                    <button class="w-full text-left px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors">
                      دانلود اطلاعات شخصی
                    </button>
                    <button class="w-full text-left px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                      حذف حساب کاربری
                    </button>-->
                  </div>
                </div>
              </div>
            </div>

            <!-- Watch History Tab -->
            <div v-if="activeTab === 'history'" class="space-y-6">
              <h3 class="text-2xl font-bold text-yellow-500 mb-6">تاریخچه تماشا</h3>
              
              <div v-if="watchHistory.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-400 text-lg">تاریخچه تماشای شما خالی است</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="item in watchHistory"
                  :key="item.id"
                  class="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl"
                >
                  <img
                    :src="item.film.poster"
                    :alt="item.film.title"
                    class="w-16 h-20 object-cover rounded-lg bg-zinc-700"
                  >
                  <div class="flex-1">
                    <h4 class="font-semibold text-white">{{ item.film.title }}</h4>
                    <p class="text-sm text-gray-400 mb-1">{{ item.watchedAt }}</p>
                    <div class="w-full bg-zinc-700 rounded-full h-2">
                      <div
                        class="bg-yellow-500 h-2 rounded-full"
                        :style="{ width: `${item.progress}%` }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ item.progress }}% تماشا شده</p>
                  </div>
                  <NuxtLink :to="`/player/${item.film.id}`" class="px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors">
                    ادامه تماشا
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted ,watch} from 'vue'
import { storeToRefs } from "pinia"
import { useAuthStore } from "~/stores/auth"
import { useMediaStore } from "~/stores/media"
import HeaderFilm from '~/components/HeaderFilm.vue'
import {useSettingsStore} from "~/stores/user-setting";
import {useRoute} from "nuxt/app";


const auth = useAuthStore()
const mediaStore = useMediaStore()

const { user, loading } = storeToRefs(auth)

let activeTab = ref<'profile' | 'favorites' | 'history' | 'settings'>('profile')
const showAvatarUpload = ref(false)
const avatarFile = ref<File | null>(null)
const formatDate = (iso: string) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fa-IR')
}
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordLoading = ref(false)
const submitChangePassword = async () => {
  if (passwordForm.value.newPassword.length < 6) {
    return alert('رمز جدید حداقل باید ۶ کاراکتر باشد')
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    return alert('رمز جدید و تکرار آن یکسان نیست')
  }

  try {
    passwordLoading.value = true

    await auth.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })

    alert('✅ رمز عبور با موفقیت تغییر کرد')

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (e: any) {
    console.error(e)
    alert(e?.response?.data?.message || '❌ خطا در تغییر رمز عبور')
  } finally {
    passwordLoading.value = false
  }
}

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)


// Tabs Configuration
const tabs = [
  { id: 'profile', label: 'پروفایل' },
  { id: 'favorites', label: 'علاقه‌مندی‌ها' },
  { id: 'history', label: 'تاریخچه تماشا' },
  { id: 'settings', label: 'تنظیمات' }
]

// User Profile Data
const userProfile = ref({
  name: 'کاربر تست',
  lastName: 'نمونه',
  email: 'user@example.com',
  phone: '09123456789',
  bio: 'علاقه‌مند به فیلم‌های مستند طبیعت',
  joinDate: '۱۴۰۲/۰۵/۱۵',
  watchedCount: 24,
  favoritesCount: 8
})
const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
)

// Edit Form
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  bio: ''
})

watch(
    user,
    (u) => {
      if (!u) return
      editForm.value = {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        bio: (u as any).bio ?? ''
      }
    },
    { immediate: true }
)

const avatarInput = ref<HTMLInputElement | null>(null)

const onAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  avatarFile.value = file

  user.value.avatar = URL.createObjectURL(file)
}
const favoriteFilms = computed(() =>
    mediaStore.allContents.filter(m => m.favorite)
)

const removeFavorite = (id: string, type: any) => {
  mediaStore.toggleFavorite(id, type)
}


// // Settings
// const settings = ref({
//   newFilmsNotification: true,
//   commentsNotification: false,
//   publicProfile: true,
//   showFavorites: true
// })

// Favorite Films
/*const favoriteFilms = ref([
  {
    id: 1,
    title: 'حیات وحش آفریقا',
    poster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
    category: 'مستند',
    rating: 9.2
  },
  {
    id: 2,
    title: 'نجات شیرهای دریایی',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    category: 'مستند',
    rating: 8.8
  }
])*/

// Watch History
/*const watchHistory = ref([
  {
    id: 1,
    film: {
      id: 1,
      title: 'حیات وحش آفریقا',
      poster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400'
    },
    watchedAt: '۱۴۰۲/۰۷/۲۰',
    progress: 75
  },
  {
    id: 2,
    film: {
      id: 3,
      title: 'پرندگان مهاجر',
      poster: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400'
    },
    watchedAt: '۱۴۰۲/۰۷/۱۸',
    progress: 100
  }
])*/
const watchHistory = computed(() =>
    (mediaStore.watchedList ?? []).map(item => ({
      id: item.id,
      film: {
        id: item.mediaId ?? item.id,
        title: item.title,
        poster: item.poster
      },
      watchedAt: formatDate(item.updatedAt ?? item.createdAt),
      progress: item.progress ?? 0
    }))
)



// Computed
const userInitials = computed(() => {
  if (!user.value) return ''
  return (
      user.value.firstName.charAt(0) +
      user.value.lastName.charAt(0)
  ).toUpperCase()
})


// Methods
const updateProfile = async () => {
  if (!user.value) return

  try {
    await auth.updateProfile(user.value.id,
        {...editForm.value,role:'film_subscriber',
          id:user.value.id,
          createdAt:user.value.createdAt,
          posts:0},
        avatarFile.value || undefined)

    alert('✅ پروفایل با موفقیت ذخیره شد')
  } catch (e) {
    console.error(e)
    alert('❌ خطا در ذخیره پروفایل')
  }
}


const resetForm = () => {
  if (!user.value) return

  Object.assign(editForm.value, {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
    phoneNumber: user.value.phoneNumber,
    bio: (user.value as any).bio ?? ''
  })
}
type TabType = 'profile' | 'favorites' | 'history' | 'settings'

const validTabs: TabType[] = ['profile', 'favorites', 'history', 'settings']

const route=useRoute()
const router = useRouter()
onMounted(async () => {
  const tab = route.query.activetab

  if (typeof tab === 'string' && validTabs.includes(tab as TabType)) {
    activeTab.value = tab as TabType
  } else {
    activeTab.value = 'profile'
  }

  await settingsStore.loadSettings()
  await mediaStore.fetchWatched()
})

watch(activeTab, (tab) => {
  if (route.query.activetab === tab) return

  router.replace({
    query: {
      ...route.query,
      activetab: tab
    }
  })
})
watch(
    () => route.query.activetab,
    (tab) => {
      if (typeof tab === 'string' && validTabs.includes(tab as TabType)) {
        activeTab.value = tab as TabType
      }
    }
)



</script>

<style scoped>
.toggle {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
  background-color: rgb(82 82 91);
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
  appearance: none;
}

.toggle:checked {
  background-color: #ffd700;
}

.toggle::before {
  content: '';
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 9999px;
  transition: transform 0.2s;
}

.toggle:checked::before {
  transform: translateX(1.5rem);
}
</style>
