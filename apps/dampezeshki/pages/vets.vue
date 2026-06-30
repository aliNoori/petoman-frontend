<template>
  <div class="min-h-screen bg-gray-50">

    <div class="container mx-auto px-4 pt-6">
      <!-- Breadcrumb - Outside Header -->
      <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <NuxtLink to="/" class="hover:text-sky-600 transition-colors">خانه</NuxtLink>
        <i class="ti ti-chevron-left text-xs"></i>
        <span class="text-sky-600 font-medium">دامپزشکان</span>
      </div>

      <!-- Page Header - With Radius -->
      <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 mb-6 shadow-lg shadow-sky-500/10">
        <!-- Title Row -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <i class="ti ti-user-heart text-2xl text-white"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">دامپزشکان پتومن</h1>
              <p class="text-teal-100 text-sm">شبکه معتبر دامپزشکان حرفه‌ای</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-2">
            <div
                class="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>آنلاین</span>
            </div>
            <div
                class="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <i class="ti ti-star-filled text-amber-300"></i>
              <span>متخصص</span>
            </div>
            <div
                class="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <i class="ti ti-shield-check"></i>
              <span>تایید شده</span>
            </div>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="mt-6">
          <div class="flex flex-col md:flex-row gap-3">

            <!-- Search Input -->
            <div class="flex-1 relative group">
              <i class="ti ti-search absolute left-4 top-3.5 text-lg text-gray-400 pointer-events-none"></i>
              <input
                  v-model="state.q"
                  placeholder="جستجوی دامپزشک..."
                  class="w-full pl-12 pr-5 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none border-0 shadow-sm"
              >
            </div>

            <!-- Status Filter - Custom Dropdown -->
            <div class="relative group w-full md:w-48" dir="rtl">
              <button
                  @click="state.statusDropdownOpen = !state.statusDropdownOpen"
                  class="w-full pl-4 pr-10 py-3 rounded-xl bg-white text-gray-900 transition-all duration-300 text-right flex items-center justify-between shadow-sm"
              >
                <span class="text-sm">{{ getStatusLabel(state.status) }}</span>
              </button>
              <i class="ti ti-filter absolute right-4 top-3.5 text-lg text-gray-400 pointer-events-none"></i>
              <i class="ti ti-chevron-down absolute left-4 top-4 text-sm text-gray-400 pointer-events-none transition-transform duration-200"
                 :class="{ 'rotate-180': state.statusDropdownOpen }"></i>

              <!-- Dropdown Menu -->
              <div v-if="state.statusDropdownOpen"
                   class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                <ul class="py-1">
                  <li v-for="option in statusOptions" :key="option.value">
                    <button
                        @click="() => { state.status = option.value; state.statusDropdownOpen = false; }"
                        class="w-full px-4 py-2.5 text-right hover:bg-gray-50 transition-colors duration-200 text-gray-900 text-sm"
                        :class="{ 'bg-teal-50 text-teal-600': state.status === option.value }"
                    >
                      {{ option.label }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">

      <!-- دامپزشکان نزدیک شما -->
      <section class="mb-12">
        <!-- نمایش اطلاعیه اگر لوکیشن انتخاب شده -->
        <div v-if="state.selectedLocation"
             class="mb-4 bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center gap-3">
          <i class="ti ti-map-pin-filled text-2xl text-sky-500"></i>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">جستجو بر اساس موقعیت انتخابی</p>
            <p class="text-xs text-gray-600 mt-1">{{
                state.selectedLocation.address || state.selectedLocation.title
              }}</p>
          </div>
          <button
              @click="clearLocationFilter"
              class="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
          >
            <i class="ti ti-x text-base"></i>
            <span>حذف فیلتر</span>
          </button>
        </div>

        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i class="ti ti-map-pin text-3xl text-sky-500"></i>
            <span>نزدیک شما</span>
          </h2>
          <button
              @click="scrollToAllVets"
              class="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            <span>مشاهده همه</span>
            <i class="ti ti-arrow-left text-base"></i>
          </button>
        </div>

        <!-- نمایش گرید کارت‌ها اگر دامپزشک موجود باشد -->
        <div v-if="nearby.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <VetCard
              v-for="vet in nearby.slice(0, 5)"
              :key="vet.id"
              :vet="vet"
              :distance-km="getVetDistance(vet)"
          />
        </div>

        <!-- پیام عدم وجود دامپزشک -->
        <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
          <div
              class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
            <i class="ti ti-user-heart text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">دامپزشکی یافت نشد</h3>
          <p class="text-gray-600 mb-6">در {{ selectedCity }} دامپزشکی ثبت نشده</p>
          <button
              @click="() => setSelectedCity('تهران')"
              class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            مشاهده تهران
          </button>
        </div>
      </section>

      <!-- برترین دامپزشکان -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i class="ti ti-star-filled text-3xl text-amber-500"></i>
            <span>برترین دامپزشکان</span>
          </h2>
          <button
              @click="scrollToAllVets"
              class="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <span>مشاهده همه</span>
            <i class="ti ti-arrow-left text-base"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <VetCard
              v-for="vet in topRatedVets.slice(0, 5)"
              :key="vet.id"
              :vet="vet"
              :distance-km="getVetDistance(vet)"
          />
        </div>
      </section>

      <!-- دامپزشکان آنلاین -->
      <section v-if="onlineVets.length" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i class="ti ti-circle-dot text-3xl text-emerald-500"></i>
            <span>دامپزشکان آنلاین</span>
          </h2>
          <button
              @click="scrollToAllVets"
              class="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <span>مشاهده همه</span>
            <i class="ti ti-arrow-left text-base"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <VetCard
              v-for="vet in onlineVets.slice(0, 5)"
              :key="vet.id"
              :vet="vet"
              :distance-km="getVetDistance(vet)"
          />
        </div>
      </section>

      <!-- ===== Promotional Banner ===== -->
      <section class="mb-12">
        <div
            class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 p-5 md:p-6 lg:p-8">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div
                class="absolute top-0 left-0 w-20 md:w-32 h-20 md:h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div
                class="absolute bottom-0 right-0 w-24 md:w-48 h-24 md:h-48 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div class="relative flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div
                  class="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center">
                <i class="ti ti-heart-handshake text-3xl md:text-4xl text-white"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 text-center md:text-right">
              <h2 class="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">
                حامیان حیوانات پتومن
              </h2>
              <p class="text-white/80 text-xs md:text-sm mb-3 md:mb-4 max-w-xl">
                با کمک به پناهگاه‌ها در نجات حیوانات بی‌پناه سهیم شوید
              </p>

              <!-- Stats Row -->
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-4">
                <div class="flex items-center gap-1.5 text-white/90">
                  <i class="ti ti-home-heart text-base md:text-lg"></i>
                  <span class="font-semibold text-xs md:text-sm">+۵۰ پناهگاه</span>
                </div>
                <div class="flex items-center gap-1.5 text-white/90">
                  <i class="ti ti-paw text-base md:text-lg"></i>
                  <span class="font-semibold text-xs md:text-sm">+۲,۰۰۰ نجات‌یافته</span>
                </div>
                <div class="flex items-center gap-1.5 text-white/90">
                  <i class="ti ti-users-group text-base md:text-lg"></i>
                  <span class="font-semibold text-xs md:text-sm">+۵۰۰ حامی</span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                <NuxtLink
                    to="/supporters"
                    class="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white text-teal-700 rounded-xl font-bold text-xs md:text-sm hover:bg-teal-50 transition-all"
                >
                  <i class="ti ti-heart"></i>
                  <span>حمایت</span>
                </NuxtLink>
                <NuxtLink
                    to="/shelters"
                    class="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white/20 text-white rounded-xl font-bold text-xs md:text-sm border border-white/30 hover:bg-white/30 transition-all"
                >
                  <i class="ti ti-building-community"></i>
                  <span>پناهگاه‌ها</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- همه دامپزشکان -->
      <section id="all-vets-section">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i class="ti ti-user-heart text-3xl text-sky-500"></i>
              همه دامپزشکان
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ filteredVets.length }} دامپزشک یافت شد
            </p>
          </div>
        </div>

        <!-- Vets Grid -->
        <div v-if="pagedAll.data.length > 0"
             class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <VetCard
              v-for="vet in pagedAll.data"
              :key="vet.id"
              :vet="vet"
              :distance-km="getVetDistance(vet)"
          />
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-search text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">دامپزشکی یافت نشد</h3>
          <p class="text-gray-600">لطفاً کلمات کلیدی دیگری امتحان کنید.</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagedAll.totalPages > 1" class="flex justify-center mt-8">
          <nav class="flex items-center gap-2">
            <button
                @click="goToPage(pagedAll.page - 1)"
                :disabled="pagedAll.page === 1"
                class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevron-right text-lg"></i>
            </button>

            <div class="flex items-center gap-1">
              <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
                  :class="page === pagedAll.page
                  ? 'bg-sky-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </div>

            <button
                @click="goToPage(pagedAll.page + 1)"
                :disabled="pagedAll.page === pagedAll.totalPages"
                class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="ti ti-chevron-left text-lg"></i>
            </button>
          </nav>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>

import {useTenantStore} from "~/stores/tenant.store";
import {useSocketStore} from "~/stores/socket";
import {useAppointmentStore} from "~/stores/appointment.store";
import {computed,watch,ref} from "vue";
import {useUrlHelper} from "~/composables/useUrlHelper";
import {useCity} from "~/composables/useCity";
import {useNuxtApp} from "nuxt/app";

const {$toast}=useNuxtApp()
const selectedLocation = ref(null)
const socketStore = useSocketStore()
const tenantStore = useTenantStore()
const { resolveUrl } = useUrlHelper();
// SEO
useHead({
  title: 'پتومن - دامپزشکان متخصص',
  meta: [
    {
      name: 'description',
      content: 'یافتن بهترین دامپزشکان متخصص در نزدیکی شما، مشاوره آنلاین، ویزیت در منزل و خدمات ۲۴ ساعته'
    },
    {
      name: 'keywords',
      content: 'دامپزشک، مشاوره آنلاین، ویزیت در منزل، حیوانات خانگی، اورژانس دامپزشکی، دامپزشک متخصص'
    },
    {name: 'mobile-web-app-capable', content: 'yes'},
    {name: 'apple-mobile-web-app-capable', content: 'yes'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'}
  ]
})

/* -------- City Management -------- */
const {selectedCity, setSelectedCity} = useCity()

/* -------- State Management -------- */
const state = reactive({
  q: '',
  status: '',
  city: '',
  page: 1,
  statusDropdownOpen: false,
  selectedLocation: null
})

/* -------- Filter Options -------- */
const statusOptions = [
  {value: '', label: 'همه وضعیت‌ها'},
  {value: 'online', label: 'آنلاین'},
  {value: 'available', label: 'نوبت دارد'},
  {value: 'specialist', label: 'متخصص'}
]

const getStatusLabel = (status) => {
  const option = statusOptions.find(opt => opt.value === status)
  return option ? option.label : 'همه وضعیت‌ها'
}
const appointmentStore = useAppointmentStore();
// --- تابع کمکی برای تبدیل زمان به دقیقه ---
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}
const checkSlotAvailability = (time, dateStr) => {
  const timeInMinutes = timeToMinutes(time)

  // ۱. بررسی زمان‌های استراحت (Time Off Blocks)
  const isTimeOff = appointmentStore.timeOffBlocks.some(block => {
    const blockDate = block.date.replace(/-/g, '/')
    if (blockDate !== dateStr) return false

    const startM = timeToMinutes(block.startTime)
    const endM = timeToMinutes(block.endTime)

    return timeInMinutes >= startM && timeInMinutes < endM
  })

  if (isTimeOff) return {available: false, reason: 'time-off'}

  // ۲. بررسی نوبت‌های رزرو شده (Appointments)
  const isBooked = appointmentStore.timeAppointments.some(apt => {
    // دسترسی به تاریخ و زمان از داخل metadata
    // نکته: از اختیاری chaining (?.) استفاده می‌کنیم تا اگر order یا metadata خالی بود خطا ندهد
    const reservedDate = apt.order?.payment?.metadata?.reservedTime?.date
    const reservedTime = apt.order?.payment?.metadata?.reservedTime?.time

    // اگر داده‌ای موجود نبود، نادیده بگیر
    if (!reservedDate || !reservedTime) return false

    // نرمال‌سازی تاریخ (تبدیل - به /) و مقایسه
    const aptDate = reservedDate.replace(/-/g, '/')

    return aptDate === dateStr && reservedTime === time && apt.status !== 'cancelled'
  })

  if (isBooked) return {available: false, reason: 'booked'}

  return {available: true, reason: null}
}
const allTimes = computed(() => {
  const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
  const afternoonTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']

  return {
    morning: morningTimes.map(t => ({ value: t, label: t })),
    afternoon: afternoonTimes.map(t => ({ value: t, label: t }))
  }
})
// --- دامپزشکان (تبدیل شده به فرمت نمونه) ---
const allVets = computed(() => {
  return tenantStore.tenants
      .filter(t => t.type === 'VET')
      .map(t => {
        const vetInfoSetting = (t.tenantSettings || []).find(item => item.key === 'clinic_info')?.value || {}

        // --- منطق بررسی نوبت در هفته جاری ---
        let hasAvailableSlots = false;

        const today = new Date();

        // بررسی ۷ روز آینده
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + i);

          // فرمت تاریخ: YYYY/MM/DD
          const dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '/');

          // ادغام تمام زمان‌های صبح و عصر برای بررسی
          const timesToCheck = [...allTimes.value.morning, ...allTimes.value.afternoon];

          // بررسی تک‌تک زمان‌ها
          for (const timeObj of timesToCheck) {
            const status = checkSlotAvailability(timeObj.value, dateStr);

            if (status.available) {
              hasAvailableSlots = true;
              break; // پیدا شد، نیازی به بررسی بقیه زمان‌ها نیست
            }
          }

          if (hasAvailableSlots) break; // پیدا شد، نیازی به بررسی بقیه روزها نیست
        }


        return {
          id: t.id,
          name: t.name || t.ownerName || 'نامشخص',
          specialty: t.specialty || 'دامپزشک',
          address: [
            t.tenantAddress?.detailedAddress?.road??t.tenantAddress?.detailedAddress?.city,
            t.tenantAddress?.detailedAddress?.neighbourhood??t.tenantAddress?.detailedAddress?.district,
            t.tenantAddress?.detailedAddress?.suburb??t.tenantAddress?.detailedAddress?.state
          ]
              .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
              .join('. '),
          area: t.tenantAddress?.detailedAddress?.suburb,
          city: t.tenantAddress?.detailedAddress?.city||t.city,
          province: t.tenantAddress?.detailedAddress?.state||t.province,
          lat: t.tenantAddress?.location?.lat,
          lng: t.tenantAddress?.location?.lng,
          isOnline: tenantStore.calculateOnlineStatus(t.id, socketStore.onlineUsers) || t.isOnline, // نگاشت مستقیم
          phone: t.phone,
          rating: parseFloat(t.rating) || 0,
          reviewsCount: t.reviewsCount || 0,
          experienceYears: vetInfoSetting.experience || 0, // نگاشت experience به experienceYears
          hasAvailableSlots: hasAvailableSlots, // فرض بر این است که اگر باز باشد، وقت دارد
          clinicName: t.name || t.ownerName, // نام دامپزشک/مرکز به عنوان نام کلینیک
          //avatar: vetInfoSetting.logo|| t.documents.logo.thumbnail, // فیلد آواتار در دیتای شما نبود
          avatar: resolveUrl(vetInfoSetting.logo)|| resolveUrl(t.documents.logo.thumbnail), // فیلد آواتار در دیتای شما نبود
          services: t.services?.map(s => s.name) || [] // تبدیل آرایه آبجکت سرویس به آرایه نام
        };
      });
});
/* -------- Mock Data -------- */
/*const allVets = [
  {
    id: 1,
    name: 'دکتر محمد احمدی',
    specialty: 'جراحی حیوانات',
    address: 'خیابان ولیعصر، پلاک ۱۲۳',
    area: 'north',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7075,
    lng: 51.4010,
    isOnline: true,
    phone: '021-12345678',
    rating: 4.8,
    reviewsCount: 127,
    experienceYears: 12,
    hasAvailableSlots: true,
    clinicName: 'کلینیک دامپزشکی آریا',
    avatar: null,
    services: ['جراحی', 'ویزیت عمومی', 'واکسیناسیون']
  },
  {
    id: 2,
    name: 'دکتر سارا رضایی',
    specialty: 'بیماری‌های داخلی',
    address: 'خیابان سعادت آباد، پلاک ۴۵',
    area: 'west',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7000,
    lng: 51.4200,
    isOnline: true,
    phone: '021-87654321',
    rating: 4.9,
    reviewsCount: 189,
    experienceYears: 15,
    hasAvailableSlots: true,
    clinicName: 'مجتمع درمانی پت کلینیک',
    avatar: null,
    services: ['بیماری‌های داخلی', 'آزمایشگاه', 'تغذیه']
  },
  {
    id: 3,
    name: 'دکتر علی کریمی',
    specialty: 'دندانپزشکی حیوانات',
    address: 'خیابان نیاوران، پلاک ۶۷',
    area: 'north',
    city: 'تهران',
    province: 'تهران',
    lat: 35.6892,
    lng: 51.3890,
    isOnline: false,
    phone: '021-11223344',
    rating: 4.7,
    reviewsCount: 156,
    experienceYears: 10,
    hasAvailableSlots: true,
    clinicName: 'کلینیک رویال پت',
    avatar: null,
    services: ['دندانپزشکی', 'جرم‌گیری', 'بهداشت دهان']
  },
  {
    id: 4,
    name: 'دکتر مریم حسینی',
    specialty: 'رادیولوژی',
    address: 'خیابان پارس، پلاک ۸۹',
    area: 'east',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7500,
    lng: 51.4300,
    isOnline: false,
    phone: '021-55443322',
    rating: 4.6,
    reviewsCount: 98,
    experienceYears: 8,
    hasAvailableSlots: true,
    clinicName: 'درمانگاه تخصصی پارس',
    avatar: null,
    services: ['رادیولوژی', 'سونوگرافی', 'تصویربرداری']
  },
  {
    id: 5,
    name: 'دکتر حسن نوری',
    specialty: 'پرندگان زینتی',
    address: 'شهرک غرب، خیابان اصلی',
    area: 'west',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7200,
    lng: 51.3600,
    isOnline: true,
    phone: '021-22334455',
    rating: 4.5,
    reviewsCount: 134,
    experienceYears: 7,
    hasAvailableSlots: false,
    clinicName: 'کلینیک سینا',
    avatar: null,
    services: ['پرندگان زینتی', 'طوطی', 'پاپاگای']
  },
  {
    id: 6,
    name: 'دکتر فاطمه محمدی',
    specialty: 'اورژانس حیوانات',
    address: 'میدان انقلاب، خیابان کریمخان',
    area: 'center',
    city: 'تهران',
    province: 'تهران',
    lat: 35.6980,
    lng: 51.4020,
    isOnline: true,
    phone: '021-33445566',
    rating: 4.4,
    reviewsCount: 203,
    experienceYears: 11,
    hasAvailableSlots: true,
    clinicName: 'مرکز درمانی حیوانات شهر',
    avatar: null,
    services: ['اورژانس ۲۴ ساعته', 'مراقبت ویژه', 'بستری']
  },
  {
    id: 7,
    name: 'دکتر رضا قاسمی',
    specialty: 'پزشک عمومی',
    address: 'خیابان قائم، پلاک ۱۰۱',
    area: 'south',
    city: 'تهران',
    province: 'تهران',
    lat: 35.6500,
    lng: 51.4100,
    isOnline: false,
    phone: '021-44556677',
    rating: 4.3,
    reviewsCount: 87,
    experienceYears: 5,
    hasAvailableSlots: true,
    clinicName: 'کلینیک دامپزشکی البرز',
    avatar: null,
    services: ['ویزیت عمومی', 'واکسیناسیون', 'آزمایش']
  },
  {
    id: 8,
    name: 'دکتر زهرا اکبری',
    specialty: 'جراحی پیشرفته',
    address: 'خیابان انقلاب، میدان فردوسی',
    area: 'center',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7010,
    lng: 51.4180,
    isOnline: true,
    phone: '021-66778899',
    rating: 4.8,
    reviewsCount: 245,
    experienceYears: 18,
    hasAvailableSlots: true,
    clinicName: 'مجتمع درمانی حیوانات ایران',
    avatar: null,
    services: ['جراحی پیشرفته', 'لاپاروسکوپی', 'ترمیم شکستگی']
  }
]*/

/* -------- Computed Properties -------- */
// تابع محاسبه فاصله بین دو نقطه (به کیلومتر)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // شعاع زمین به کیلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const filteredVets = computed(() => {

  let results = allVets.value.filter(vet => {
    const matchesQuery = !state.q ||
        vet.name.toLowerCase().includes(state.q.toLowerCase()) ||
        vet.specialty.toLowerCase().includes(state.q.toLowerCase()) ||
        vet.address.toLowerCase().includes(state.q.toLowerCase())

    const matchesStatus = !state.status ||
        (state.status === 'online' && vet.isOnline) ||
        (state.status === 'available' && vet.hasAvailableSlots) ||
        (state.status === 'specialist' && vet.experienceYears >= 10)

    const matchesCity = !state.city || vet.city === state.city

    // اگر لوکیشن انتخاب شده، فقط دامپزشکان در شعاع 20 کیلومتری را نمایش بده
    let matchesLocation = true
    if (state.selectedLocation && state.selectedLocation.lat && state.selectedLocation.lng) {
      const distance = calculateDistance(
          state.selectedLocation.lat,
          state.selectedLocation.lng,
          vet.lat,
          vet.lng
      )
      matchesLocation = distance <= 20 // شعاع 20 کیلومتری
    }

    return matchesQuery && matchesStatus && matchesCity && matchesLocation
  })

  // مرتب‌سازی بر اساس فاصله اگر لوکیشن انتخاب شده
  if (state.selectedLocation && state.selectedLocation.lat && state.selectedLocation.lng) {
    results = results.sort((a, b) => {
      const distanceA = calculateDistance(
          state.selectedLocation.lat,
          state.selectedLocation.lng,
          a.lat,
          a.lng
      )
      const distanceB = calculateDistance(
          state.selectedLocation.lat,
          state.selectedLocation.lng,
          b.lat,
          b.lng
      )
      return distanceA - distanceB
    })
  }

  return results
})

const nearby = computed(() => {
  return filteredVets.value.filter(vet => vet.city === selectedCity.value)
})

const topRatedVets = computed(() => {
  return [...filteredVets.value].sort((a, b) => b.rating - a.rating)
})

const onlineVets = computed(() => {
  return filteredVets.value.filter(vet => vet.isOnline)
})

const pagedAll = computed(() => {
  const itemsPerPage = 20
  const startIndex = (state.page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return {
    data: filteredVets.value.slice(startIndex, endIndex),
    totalPages: Math.ceil(filteredVets.value.length / itemsPerPage),
    total: filteredVets.value.length,
    page: state.page
  }
})

const visiblePages = computed(() => {
  const totalPages = pagedAll.value.totalPages
  const currentPage = pagedAll.value.page
  const pages = []

  // Show up to 5 pages
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, startPage + 4)

  // Adjust start page if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

watch(selectedCity, (newCity) => {
  state.city = newCity;
});

/* -------- Methods -------- */
const handleLocationSelected = (location) => {
  // ذخیره لوکیشن انتخاب شده
  state.selectedLocation=location
  state.selectedLocation.lat = location.lat
  state.selectedLocation.lng = location.lng


  // آپدیت state.q برای جستجو
  state.q = location.title

  // می‌توانیم city را هم بر اساس لوکیشن انتخابی تنظیم کنیم
  if (location.city) {
    state.city = location.city
    setSelectedCity(location.city)
  }

  // اسکرول به بخش نتایج
  scrollToAllVets()
}

const clearLocationFilter = () => {
  state.selectedLocation = null
  state.q = ''
}

const getVetDistance = (vet) => {

  if (!selectedLocation.value || !selectedLocation.value?.lat || !selectedLocation.value?.lng) {
    return null
  }

  return calculateDistance(
      selectedLocation.value?.lat,
      selectedLocation.value?.lng,
      vet.lat,
      vet.lng
  )
}

const scrollToAllVets = () => {
  const element = document.getElementById('all-vets-section')
  if (element) {
    element.scrollIntoView({behavior: 'smooth'})
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= pagedAll.value.totalPages) {
    state.page = page
    scrollToAllVets()
  }
}

/* -------- Lifecycle -------- */
onMounted(() => {
  getUserLocation()
  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.group')) {
      state.statusDropdownOpen = false
    }
  })
})


// تابع دریافت لوکیشن و تبدیل به آدرس
const getUserLocation = async () => {
  if (!navigator.geolocation) {
    alert('مرورگر شما از سرویس موقعیت‌یاب پشتیبانی نمی‌کند.')
    return
  }

  console.log('در حال دریافت موقعیت...')

  navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // درخواست به سرویس Nominatim برای دریافت آدرس
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

          const response = await fetch(geocodeUrl, {
            headers: {
              'Accept-Language': 'fa' // تلاش برای دریافت آدرس به زبان فارسی
            }
          })

          const data = await response.json()

          if (data && data.address) {
            const addr = data.address

            // استخراج شهر (تلاش برای پیدا کردن شهر، ناحیه یا محله)
            const city = addr.city || addr.town || addr.village || addr.county || 'ناشناس'

            // استخراج محله یا منطقه
            const title = addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || 'موقعیت فعلی'

            // ساخت آدرس کامل خوانا
            const addressParts = [
              addr.road,
              addr.house_number,
              addr.neighbourhood,
              addr.suburb,
              addr.city || addr.town,
              addr.state
            ].filter(Boolean) // حذف موارد خالی

            const fullAddress = addressParts.join('، ')

            // ساخت آبجکت نهایی
            const loc = {
              lat: latitude,
              lng: longitude,
              title: title,
              address: fullAddress,
              city: city
            }


            selectedLocation.value = {
              lat: latitude,
              lng: longitude,
              title: title,
              city: city
            }

            // ارسال به تابع اصلی
            handleLocationSelected(loc)

            // آپدیت شهر انتخابی در استور
            setSelectedCity(city)

            console.log('موقعیت و آدرس دریافت شد:', loc)
          } else {
            // اگر سرویس آدرس نداد، از مقادیر پیش‌فرض استفاده کن
            const loc = {
              lat: latitude,
              lng: longitude,
              title: 'موقعیت فعلی',
              address: 'آدرس دقیق یافت نشد',
              city: 'تهران' // پیش‌فرض یا خالی
            }
            handleLocationSelected(loc)
          }

        } catch (error) {
          console.error('خطا در دریافت آدرس:', error)
          alert('موقعیت مکانی دریافت شد، اما امکان دریافت آدرس وجود نداشت.')
        }
      },
      (error) => {
        let message = 'خطایی رخ داد.'
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = 'دسترسی به موقعیت مکانی رد شد.\n\nلطفاً از تنظیمات مرورگر یا تنظیمات گوشی، دسترسی به لوکیشن را برای این سایت فعال کنید.'
            console.warn('دسترسی رد شد.')
            break
          case error.POSITION_UNAVAILABLE:
            message = 'اطلاعات موقعیت مکانی در دسترس نیست.\n\nلطفاً GPS گوشی خود را روشن کنید.'
            console.warn('موقعیت در دسترس نیست.')
            break
          case error.TIMEOUT:
            message = 'زمان درخواست موقعیت به پایان رسید. لطفاً دوباره تلاش کنید.'
            console.warn('زمان تمام شد.')
            break
          default:
            message = 'خطای نامشخص در دریافت موقعیت.'
            break
        }

        // در موبایل، alert ساده ممکن است کافی نباشد، می‌توانید از یک Modal زیباتر استفاده کنید
        //alert(message)
        $toast(message,'warn',5000)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
  )
}
</script>

<style scoped>
/* Custom styles if needed */
</style>