<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white py-20 overflow-hidden min-h-[450px] flex items-center">
      <div class="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
        <i class="ti ti-users-group absolute top-12 left-20 text-rose-400 text-7xl rotate-6"></i>
        <i class="ti ti-heart-filled absolute top-32 right-16 text-rose-400 text-6xl -rotate-12"></i>
        <i class="ti ti-paw absolute bottom-20 left-1/3 text-rose-300 text-6xl rotate-12"></i>
        <i class="ti ti-heart-handshake absolute bottom-12 right-1/4 text-rose-400 text-7xl -rotate-6"></i>
        <i class="ti ti-star-filled absolute top-20 left-1/2 text-rose-300 text-5xl rotate-45"></i>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          افراد فوق‌العاده‌ای که در کنار حیوانات هستند
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          آشنایی با حامیان پتومن که با عشق و مهربانی در نجات و حمایت از حیوانات بی‌سرپناه مشارکت می‌کنند
        </p>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="border-b border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="جستجوی حامی..."
                  class="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
              <i class="ti ti-search absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <select
              v-model="selectedType"
              class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">همه حامیان</option>
            <option value="financial">حامیان مالی</option>
            <option value="volunteer">داوطلبان</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Supporters Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <i class="ti ti-loader animate-spin text-4xl text-rose-600 mb-4"></i>
          <p class="text-gray-600">در حال بارگذاری حامیان...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSupporters.length === 0" class="text-center py-12">
          <i class="ti ti-mood-sad text-6xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 mb-2">حامی یافت نشد</h3>
          <p class="text-gray-600">هیچ حامی‌ای با معیارهای جستجوی شما پیدا نشد.</p>
        </div>

        <!-- Supporters Grid -->
        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
                v-for="supporter in paginatedSupporters"
                :key="supporter.id"
                :to="`/supporters/${supporter.id}`"
                class="block bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300 group h-full"
            >
              <div class="flex items-center space-x-reverse space-x-4 mb-4">
                <!-- ✅ آواتار با fallback به حرف اول -->
                <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center shrink-0">
                  <img
                      v-if="hasValidAvatar(supporter.avatar)"
                      :src="supporter.avatar"
                      :alt="`${supporter.firstName} ${supporter.lastName}`"
                      class="w-full h-full object-cover"
                  >
                  <span
                      v-else
                      class="text-rose-600 font-bold text-2xl select-none"
                  >
                    {{ supporter.initial || supporter.firstName?.charAt(0) }}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                    {{ supporter.firstName }} {{ supporter.lastName }}
                  </h3>
                  <!-- ✅ نمایش عنوان فقط در صورت وجود -->
                  <p
                      v-if="supporter.title"
                      class="text-rose-600 font-medium text-sm truncate"
                  >
                    {{ supporter.title }}
                  </p>
                  <!-- ✅ بج نوع حمایت (وقتی title خالیه) -->
                  <span
                      v-else
                      class="inline-block text-xs px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full"
                  >
                    {{ supporter.supportType === 'financial' ? 'حامی مالی' : 'داوطلب' }}
                  </span>
                </div>
              </div>

              <!-- ✅ نمایش بیو فقط در صورت وجود -->
              <p
                  v-if="supporter.bio"
                  class="text-gray-600 mb-4 leading-relaxed line-clamp-3"
              >
                {{ supporter.bio }}
              </p>
              <div v-else class="mb-4"></div>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
                <div class="text-center">
                  <div class="font-bold text-rose-600 text-sm">
                    {{ formatDateToJalali(supporter.joinDate) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">عضو از</div>
                </div>
                <div class="text-center">
                  <div class="font-bold text-rose-600">
                    {{ supporter.animalsSaved }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">حیوانات نجات یافته</div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center items-center mt-8 space-x-reverse space-x-2">
            <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-300'
              ]"
            >
              قبلی
            </button>
            <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                page === currentPage
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-300'
              ]"
            >
              {{ page }}
            </button>
            <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-300'
              ]"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { generateSlug } from '~/utils/slugUtils.ts'
import { useSupporterStore } from "~/stores/supporter.ts"
import { toJalaliDate } from "~/utils/date.ts"
import { useSettingStore } from '~/stores/setting.ts'

interface SupporterData {
  id: string
  firstName: string
  lastName: string
  title: string
  bio: string
  avatar: string | null
  supportType: 'financial' | 'volunteer'
  joinDate: string
  animalsSaved: number
  initial: string
}

useSeoMeta({
  title: 'حامیان ما - پتومن | مشاهده حامیان حیوانات',
  description: 'آشنایی با حامیان پتومن که با عشق و مهربانی در نجات و حمایت از حیوانات بی‌سرپناه مشارکت می‌کنند.',
  ogTitle: 'حامیان ما - پتومن',
  ogDescription: 'آشنایی با حامیان پتومن که با عشق و مهربانی در نجات و حمایت از حیوانات بی‌سرپناه مشارکت می‌کنند.'
})

const settingStore = useSettingStore()
const perPage = computed(() => Number(settingStore.generalSetting.supportersPerPage) || 6)

const route = useRoute()
const router = useRouter()

const formatDateToJalali = (date: string) => {
  return toJalaliDate(date)
}

// ✅ تابع بررسی معتبر بودن آواتار
const hasValidAvatar = (avatar: string | null | undefined): boolean => {
  if (!avatar) return false
  if (avatar === 'null') return false  // چون مقدار "null" به صورت استرینگ اومده
  if (avatar.trim() === '') return false
  return true
}

const loading = ref(false)
const searchQuery = ref(route.query.search?.toString() || '')
const selectedType = ref(route.query.type?.toString() || '')
const currentPage = ref(parseInt(route.query.page?.toString() || '1'))

watch(() => route.query, (newQuery) => {
  searchQuery.value = newQuery.search?.toString() || ''
  selectedType.value = newQuery.type?.toString() || ''
  currentPage.value = parseInt(newQuery.page?.toString() || '1')
})

const updateURL = () => {
  const query: any = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedType.value) query.type = selectedType.value
  if (currentPage.value > 1) query.page = currentPage.value.toString()
  router.push({ query })
}

watch([searchQuery, selectedType], () => {
  currentPage.value = 1
  updateURL()
})

watch(currentPage, () => {
  updateURL()
})

const supporterStore = useSupporterStore()

const supporters = computed(() =>
    supporterStore.supporterCases.map((item) => {
      return {
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        title: item.title,
        bio: item.bio,
        avatar: item.avatar && item.avatar !== 'null' ? item.avatar : null,
        supportType: item.type,
        joinDate: item.joinDate,
        animalsSaved: item.animalsSaved,
        initial: item.initials
      }
    })
)

const filteredSupporters = computed(() => {
  let filtered = [...supporters.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
        (s.title || '').toLowerCase().includes(query) ||
        (s.bio || '').toLowerCase().includes(query)
    )
  }
  if (selectedType.value) {
    filtered = filtered.filter(s => s.supportType === selectedType.value)
  }
  return filtered
})

const paginatedSupporters = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredSupporters.value.slice(start, end)
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredSupporters.value.length / perPage.value))
)

const hasMorePages = computed(() => currentPage.value < totalPages.value)

const loadMore = () => {
  loading.value = true
  currentPage.value++
  loading.value = false
}
</script>