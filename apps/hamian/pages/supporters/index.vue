<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Clean -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white py-20 overflow-hidden min-h-[450px] flex items-center">
      <!-- Decorative Pattern -->
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
          <!-- Search -->
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
          
          <!-- Filters -->
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

    <!-- Supporters Slider -->
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
                <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img :src="supporter.avatar" :alt="supporter.firstName.charAt(0)" class="w-full h-full text-center content-center object-cover" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{{ supporter.firstName }} {{ supporter.lastName }}</h3>
                  <p class="text-rose-600 font-medium">{{ supporter.title }}</p>
                </div>
              </div>

              <p class="text-gray-600 mb-4 leading-relaxed line-clamp-3">{{ supporter.bio }}</p>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
                <div class="text-center">
                  <div class="font-bold text-rose-600">{{ formatDateToJalali(supporter.joinDate) }}</div>
                  <div class="text-xs text-gray-500 mt-1">عضو از</div>
                </div>
                <div class="text-center">
                  <div class="font-bold text-rose-600">{{ supporter.animalsSaved }}</div>
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
import {useSupporterStore} from "~/stores/supporter.ts";
import {toJalaliDate} from "~/utils/date.ts";
import { useSettingStore } from '~/stores/setting.ts'
// Types
interface SupporterData {
  id: string
  firstName: string
  lastName: string
  title: string
  bio: string
  avatar:string
  supportType: 'financial' | 'volunteer'
  joinDate: string
  animalsSaved: number
  profileImage?: string
  initial: string
}

// SEO
useSeoMeta({
  title: 'حامیان ما - پتومن | مشاهده حامیان حیوانات',
  description: 'آشنایی با حامیان پتومن که با عشق و مهربانی در نجات و حمایت از حیوانات بی‌سرپناه مشارکت می‌کنند.',
  ogTitle: 'حامیان ما - پتومن',
  ogDescription: 'آشنایی با حامیان پتومن که با عشق و مهربانی در نجات و حمایت از حیوانات بی‌سرپناه مشارکت می‌کنند.'
})

const settingStore = useSettingStore()

const perPage = computed(() => Number(settingStore.generalSetting.supportersPerPage) || 6)

// Get route and router
const route = useRoute()
const router = useRouter()
const formatDateToJalali=(date:string)=>{

  return toJalaliDate(date)

}
// State
const loading = ref(false)
const searchQuery = ref(route.query.search?.toString() || '')
const selectedType = ref(route.query.type?.toString() || '')
const currentPage = ref(parseInt(route.query.page?.toString() || '1'))

// Watch for query parameter changes
watch(() => route.query, (newQuery) => {
  searchQuery.value = newQuery.search?.toString() || ''
  selectedType.value = newQuery.type?.toString() || ''
  currentPage.value = parseInt(newQuery.page?.toString() || '1')
})

// Update URL when filters change
const updateURL = () => {
  const query: any = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedType.value) query.type = selectedType.value
  if (currentPage.value > 1) query.page = currentPage.value.toString()
  
  router.push({ query })
}

// Watch for filter changes
watch([searchQuery, selectedType], () => {
  currentPage.value = 1
  updateURL()
})

watch(currentPage, () => {
  updateURL()
})

const paginatedSupporters = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredSupporters.value.slice(start, end)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSupporters.value.length / perPage)))
const supporterStore=useSupporterStore()
const supporters=computed(()=>
    supporterStore.supporterCases.map((item)=>{

      const id=item.id
      const firstName=item.firstName
      const lastName=item.lastName
      const title=item.title
      const bio=item.bio
      const avatar=item.avatar
      const supportType=item.type
      const joinDate=item.joinDate
      const animalsSaved=item.animalsSaved
      const initial=item.initials

      return{
        id,
        firstName,
        lastName,
        title,
        bio,
        avatar,
        supportType,
        joinDate,
        animalsSaved,
        initial
      }

    }))
/*const supporters = ref<SupporterData[]>([
  {
    id: 1,
    firstName: 'فاطمه',
    lastName: 'رضایی',
    title: 'دامپزشک داوطلب',
    bio: 'پزشک دامپزشک و متخصص در درمان حیوانات. داوطلبانه خدمات درمانی ارائه می‌دهم و در برنامه‌های واکسیناسیون مشارکت دارم.',
    supportType: 'volunteer',
    joinDate: '1399/12/18',
    animalsSaved: 25,
    initial: 'ف'
  },
  {
    id: 2,
    firstName: 'علی',
    lastName: 'حسینی',
    title: 'عاشق حیوانات',
    bio: 'تاجر و فعال در زمینه حمایت از حیوانات بی‌سرپناه. سابقه ۳ سال فعالیت در این حوزه دارم و همیشه سعی می‌کنم به بهترین شکل کنار حیوانات باشم.',
    supportType: 'financial',
    joinDate: '1399/12/25',
    animalsSaved: 15,
    initial: 'ع'
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صالحی',
    title: 'مربی حیوانات',
    bio: 'مربی حیوانات و مدیر پناهگاه محلی. تخصص در تربیت و نگهداری حیوانات خانگی دارم و برنامه‌های آموزشی برگزار می‌کنم.',
    supportType: 'volunteer',
    joinDate: '1400/02/20',
    animalsSaved: 8,
    initial: 'م'
  },
  {
    id: 4,
    firstName: 'زهرا',
    lastName: 'محمدی',
    title: 'داوطلب پناهگاه',
    bio: 'دانشجوی دامپزشکی و داوطلب فعال در پناهگاه‌های حیوانات. هفته‌ای چند بار در پناهگاه حضور دارم و به مراقبت از حیوانات می‌پردازم.',
    supportType: 'volunteer',
    joinDate: '1401/06/01',
    animalsSaved: 6,
    initial: 'ز'
  },
  {
    id: 5,
    firstName: 'محسن',
    lastName: 'احمدی',
    title: 'حامی حیوانات',
    bio: 'مهندس و علاقه‌مند به حیوانات. در اوقات فراغت به کمک حیوانات بی‌سرپناه می‌پردازم و در شبکه‌های اجتماعی فعالیت می‌کنم.',
    supportType: 'financial',
    joinDate: '1401/09/25',
    animalsSaved: 4,
    initial: 'م'
  }
])*/

// Computed
const filteredSupporters = computed(() => {
  let filtered = [...supporters.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) || 
      s.title.toLowerCase().includes(query) ||
      s.bio.toLowerCase().includes(query)
    )
  }
  
  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter(s => s.supportType === selectedType.value)
  }
  
  return filtered
})

const hasMorePages = computed(() => {
  const totalPages = Math.ceil(filteredSupporters.value.length / perPage)
  return currentPage.value < totalPages
})

// Methods
const loadMore = () => {
  loading.value = true
  currentPage.value++
  loading.value = false
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .line-clamp-3 {
    -webkit-line-clamp: 4;
  }
}
</style>
