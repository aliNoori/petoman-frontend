<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Hero Section -->
    <section class="bg-gradient-to-bl from-rose-50 via-white to-rose-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-user text-5xl text-rose-600"></i>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          پروفایل من
        </h1>
        <p class="text-lg text-gray-600">
          مشاهده و مدیریت اطلاعات حامی
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="space-y-6">
        <!-- Profile Info Card -->
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
              <img :src="userProfile.avatar || '/assets/default-avatar.svg'" alt="avatar" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900">{{ userProfile.firstName }} {{ userProfile.lastName }}</h3>
              <p class="text-rose-600 font-medium">{{ userProfile.supportType === 'financial' ? 'حامی مالی' : 'داوطلب' }}</p>
            </div>
            <button 
              @click="showEditModal = true"
              class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <i class="ti ti-edit text-lg"></i>
              ویرایش پروفایل
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <i class="ti ti-phone text-rose-600 text-xl"></i>
              <div>
                <p class="text-xs text-gray-500">شماره تماس</p>
                <p class="font-medium text-gray-900">{{ userProfile.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <i class="ti ti-map-pin text-rose-600 text-xl"></i>
              <div>
                <p class="text-xs text-gray-500">استان و شهر</p>
                <p class="font-medium text-gray-900">{{ userProfile.province }}, {{ userProfile.city }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <i class="ti ti-calendar text-rose-600 text-xl"></i>
              <div>
                <p class="text-xs text-gray-500">تاریخ عضویت</p>
                <p class="font-medium text-gray-900">{{ userProfile.joinDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates Section -->
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-certificate text-rose-600"></i>
              گواهینامه‌های من
            </h3>
          </div>

          <div v-if="userProfile.status === 'approved'" class="space-y-4">
            <!-- Membership Certificate -->
            <div class="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 bg-rose-600 rounded-xl flex items-center justify-center">
                  <i class="ti ti-certificate text-white text-3xl"></i>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">گواهینامه حامی پتومن</h4>
                  <p class="text-sm text-gray-600">گواهینامه رسمی عضویت در جمع حامیان حیوانات</p>
                </div>
              </div>
              <button 
                @click="downloadCertificate"
                class="w-full px-6 py-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
              >
                <i class="ti ti-download text-2xl"></i>
                دانلود گواهینامه
              </button>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <i class="ti ti-clock text-5xl text-gray-400 mb-3"></i>
            <h4 class="font-semibold text-gray-900 mb-2">در انتظار تایید</h4>
            <p class="text-sm text-gray-600">
              پس از تایید درخواست توسط تیم پتومن، گواهینامه شما در اینجا قابل دانلود خواهد بود.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50">
      <div class="fixed inset-0 bg-black/50" @click="showEditModal = false"></div>

      <div class="relative max-w-xl w-full mx-auto mt-24 bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <!-- Close -->
        <button
            @click="showEditModal = false"
            class="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
        >
          <i class="ti ti-x text-2xl"></i>
        </button>

        <h3 class="text-2xl font-bold text-gray-900 text-center mb-6">
          ویرایش پروفایل
        </h3>

        <!-- Avatar -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div
                class="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-200 bg-gray-100"
            >
              <img
                  v-if="userProfile.avatar"
                  :src="userProfile.avatar"
                  class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="ti ti-user text-4xl text-gray-400"></i>
              </div>
            </div>

            <label
                for="avatarUpload"
                class="absolute bottom-1 right-1 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-700"
            >
              <i class="ti ti-camera text-sm"></i>
            </label>

            <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
            />
          </div>
        </div>

        <!-- Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              نام
            </label>
            <input
                v-model="editForm.firstName"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              نام خانوادگی
            </label>
            <input
                v-model="editForm.lastName"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <!-- Save -->
        <button
            @click="saveProfile"
            class="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {toJalaliDate} from "~/utils/date.ts";

// SEO
useSeoMeta({
  title: 'پروفایل من - پتومن',
  description: 'مشاهده و مدیریت پروفایل حامی حیوانات',
})

// State
const showEditModal = ref(false)

const userProfile = reactive({
  id:'',
  firstName: 'علی',
  lastName: 'محمدی',
  phone: '09123456789',
  province: 'تهران',
  city: 'تهران',
  supportType: 'financial',
  joinDate: '1403/08/10',
  status: 'approved', // 'pending' | 'approved'
  avatar: ''
})

const editForm = reactive({
  firstName: userProfile.firstName,
  lastName: userProfile.lastName
})
const selectedAvatarFile = ref<File | undefined>(undefined)

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  selectedAvatarFile.value = file

  // پیش‌نمایش فوری
  userProfile.avatar = URL.createObjectURL(file)
}

// Methods
const saveProfile = async () => {
  userProfile.firstName = editForm.firstName
  userProfile.lastName = editForm.lastName
  await authStore.updateProfile(userProfile.id, userProfile, selectedAvatarFile.value)
  showEditModal.value = false
  alert('تغییرات با موفقیت ذخیره شد!')
}

const downloadCertificate = () => {
  alert('در حال دانلود گواهینامه...')
  console.log('Downloading certificate for:', userProfile.firstName, userProfile.lastName)
  // اینجا می‌تونی کد تولید گواهینامه از join-supporters رو اضافه کنی
}
const authStore=useAuthStore()

onMounted(async () => {
  await authStore.fetchUser()
  const savedUser = localStorage.getItem('auth_user')
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser) as {
      id: string
      firstName: string
      lastName: string
      email: string
      phoneNumber: string
      avatar: string
      posts: number
      supporterProfile:{}
      role: string
      createdAt: string
    }

    // مقداردهی به فیلدهای reactive
    userProfile.id=parsedUser.id
    userProfile.firstName = parsedUser.firstName
    userProfile.lastName = parsedUser.lastName
    userProfile.phone = parsedUser.phoneNumber
    userProfile.avatar = parsedUser.avatar
    userProfile.joinDate = toJalaliDate(parsedUser.createdAt)
    userProfile.province=parsedUser.supporterProfile?.province
    userProfile.city=parsedUser.supporterProfile?.city

    // اگر استان/شهر/نوع حمایت هم در داده ذخیره شده بود، اینجا ست کن
  }
})

</script>
