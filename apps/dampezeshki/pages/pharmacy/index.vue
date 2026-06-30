<template>
  <div class="min-h-screen bg-gray-50">
    
    <div class="container mx-auto px-4 pt-6">
      <!-- Breadcrumb - Outside Header -->
      <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <NuxtLink to="/" class="hover:text-emerald-600 transition-colors">خانه</NuxtLink>
        <i class="ti ti-chevron-left text-xs"></i>
        <span class="text-purple-600 font-medium">داروخانه‌ها</span>
      </div>
      
      <!-- Page Header - With Radius -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg shadow-emerald-500/10">
        <!-- Title Row -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <i class="ti ti-medicine-syrup text-2xl text-white"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">داروخانه‌های پتومن</h1>
              <p class="text-emerald-100 text-sm">شبکه معتبر داروخانه‌های دامپزشکی</p>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="flex flex-wrap gap-2">
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>۲۴ ساعته</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <i class="ti ti-truck-delivery"></i>
              <span>تحویل سریع</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <i class="ti ti-shield-check"></i>
              <span>کیفیت تضمینی</span>
            </div>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="mt-6">
          <div class="flex flex-col md:flex-row gap-3">
            
            <!-- Search Input -->
            <div class="flex-1 relative group">
              <input
                v-model="state.q"
                placeholder="جستجوی داروخانه..."
                class="w-full pl-12 pr-5 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none border-0 shadow-sm"
              >
              <i class="ti ti-search absolute left-4 top-3.5 text-lg text-gray-400"></i>
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
              <i class="ti ti-chevron-down absolute left-4 top-4 text-sm text-gray-400 pointer-events-none transition-transform duration-200" :class="{ 'rotate-180': state.statusDropdownOpen }"></i>
              
              <!-- Dropdown Menu -->
              <div v-if="state.statusDropdownOpen" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                <ul class="py-1">
                  <li v-for="option in statusOptions" :key="option.value">
                    <button 
                      @click="() => { state.status = option.value; state.statusDropdownOpen = false; }"
                      class="w-full px-4 py-2.5 text-right hover:bg-gray-50 transition-colors duration-200 text-gray-900 text-sm"
                      :class="{ 'bg-emerald-50 text-emerald-600': state.status === option.value }"
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

      <!-- داروخانه‌های نزدیک شما -->
      <section class="mb-12">
        <!-- نمایش اطلاعیه اگر لوکیشن انتخاب شده -->
        <div v-if="state.selectedLocation" class="mb-4 bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center gap-3">
          <i class="ti ti-map-pin-filled text-2xl text-sky-500"></i>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">جستجو بر اساس موقعیت انتخابی</p>
            <p class="text-xs text-gray-600 mt-1">{{ state.selectedLocation.address || state.selectedLocation.title }}</p>
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
            @click="scrollToAllPharmacies"
            class="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            <span>مشاهده همه</span>
            <i class="ti ti-arrow-left text-base"></i>
          </button>
        </div>
        
        <!-- نمایش گرید کارت‌ها اگر داروخانه موجود باشد -->
        <div v-if="nearby.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <PharmacyCard 
            v-for="pharmacy in nearby.slice(0, 5)" 
            :key="pharmacy.id" 
            :pharmacy="pharmacy"
            :distance-km="getPharmacyDistance(pharmacy)"
          />
        </div>

        <!-- پیام عدم وجود داروخانه -->
        <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <i class="ti ti-building-hospital text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">داروخانه‌ای یافت نشد</h3>
          <p class="text-gray-600 mb-6">در {{ selectedCity }} داروخانه‌ای ثبت نشده</p>
          <button 
            @click="() => setSelectedCity('تهران')"
            class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            مشاهده تهران
          </button>
        </div>
      </section>

      <!-- برترین داروخانه‌ها -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i class="ti ti-star-filled text-3xl text-amber-500"></i>
            <span>برترین داروخانه‌ها</span>
          </h2>
          <button 
            @click="scrollToAllPharmacies"
            class="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <span>مشاهده همه</span>
            <i class="ti ti-arrow-left text-base"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <PharmacyCard 
            v-for="pharmacy in topRatedPharmacies.slice(0, 5)" 
            :key="pharmacy.id" 
            :pharmacy="pharmacy"
            :distance-km="getPharmacyDistance(pharmacy)"
          />
        </div>
      </section>

      <!-- داروخانه‌های ۲۴ ساعته -->
      <section v-if="open24Pharmacies.length" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i class="ti ti-clock-24 text-3xl text-emerald-500"></i>
            <span>داروخانه‌های ۲۴ ساعته</span>
          </h2>
          <button 
            @click="scrollToAllPharmacies"
            class="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <span>مشاهده همه</span>
            <i class="ti ti-arrow-left text-base"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <PharmacyCard 
            v-for="pharmacy in open24Pharmacies.slice(0, 5)" 
            :key="pharmacy.id" 
            :pharmacy="pharmacy"
            :distance-km="getPharmacyDistance(pharmacy)"
          />
        </div>
      </section>

      <!-- همه داروخانه‌ها -->
      <section id="all-pharmacies-section">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <i class="ti ti-building-hospital text-3xl text-sky-500"></i>
            همه داروخانه‌ها
          </h2>
        </div>

        <!-- Pharmacies Grid -->
        <div v-if="pagedAll.data.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <PharmacyCard 
            v-for="pharmacy in pagedAll.data" 
            :key="pharmacy.id" 
            :pharmacy="pharmacy"
            :distance-km="getPharmacyDistance(pharmacy)"
          />
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-search text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">نتیجه‌ای یافت نشد</h3>
          <p class="text-gray-600 mb-6">لطفاً معیارهای جستجو را تغییر دهید</p>
          <button 
            @click="() => { state.q = ''; state.city = ''; state.status = ''; }"
            class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            پاک کردن فیلترها
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="pagedAll.totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
          <button
            @click="state.page = Math.max(1, state.page - 1)"
            :disabled="state.page <= 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-right"></i>
          </button>
          
          <template v-for="page in Math.min(pagedAll.totalPages, 5)" :key="page">
            <button
              @click="state.page = page"
              :class="[
                'px-4 py-2 rounded-lg font-medium',
                state.page === page 
                  ? 'bg-sky-500 text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <button
            @click="state.page = Math.min(pagedAll.totalPages, state.page + 1)"
            :disabled="state.page >= pagedAll.totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-chevron-left"></i>
          </button>
        </div>

      </section>

    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useTenantStore} from "~/stores/tenant.store";
import {useUrlHelper} from "~/composables/useUrlHelper";
import {useCity} from "~/composables/useCity";
import {useNuxtApp} from "nuxt/app";
const {$toast}=useNuxtApp()
const selectedLocation=ref(null)
const tenantStore=useTenantStore()
const { resolveUrl } = useUrlHelper();
/* -------- City Management -------- */
const { selectedCity, setSelectedCity } = useCity()


const checkIsOpen = (tenant, type = 'pharmacy') => {
  // تعیین کلید بر اساس نوع (توجه به حروف کوچک و بزرگ)
  const targetKey = type === 'pharmacy' ? 'pharmacyInfo' : 'clinic_info';

  // متغیر برای نگهداری تنظیمات پیدا شده
  let infoSetting = null;

  // اولویت اول: جستجو در tenantSettings (برای کلینیک‌ها)
  if (tenant.tenantSettings && tenant.tenantSettings.length > 0) {
    infoSetting = tenant.tenantSettings.find(s => s.key === targetKey);
  }

  // اولویت دوم: اگر در tenantSettings پیدا نشد، در settings جستجو کن (برای داروخانه‌ها)
  if (!infoSetting && tenant.settings && tenant.settings.length > 0) {
    infoSetting = tenant.settings.find(s => s.key === targetKey);
  }

  // اگر تنظیمات پیدا نشد یا مقدار value نداشت، false برگردان
  if (!infoSetting || !infoSetting.value) return false;

  const info = infoSetting.value;

  // بررسی ۲۴ ساعته بودن
  if (info.is24Hours) return true;

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // بررسی روزهای تعطیل
  if (info.closedDays && info.closedDays.includes(dayName)) return false;

  // بررسی وجود زمان باز و بسته شدن
  if (!info.openTime || !info.closeTime) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = info.openTime.split(':').map(Number);
  const [closeH, closeM] = info.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};
/* -------- Mock Data -------- */
const allPharmacies = computed(() => {
  return tenantStore.tenants
      .filter(t => t.type === 'PHARMACY')
      .map(t => {
        const pharmacyInfoSetting = (t.settings || []).find(item => item.key === 'pharmacyInfo')?.value || {}
        // استخراج مختصات از آبجکت location (اگر وجود داشته باشد)
        const lat = t.tenantAddress.location?.lat || 35.6892; // پیش‌فرض تهران اگر نبود
        const lng = t.tenantAddress.location?.lng || 51.3890;

        return {
          id: t.id,
          name: t.name || t.ownerName || 'نامشخص',
          address: [
            t.tenantAddress?.detailedAddress?.road??t.tenantAddress?.detailedAddress?.city,
            t.tenantAddress?.detailedAddress?.neighbourhood??t.tenantAddress?.detailedAddress?.district,
            t.tenantAddress?.detailedAddress?.suburb??t.tenantAddress?.detailedAddress?.state
          ]
              .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
              .join('. '), // اتصال با نقطه و فاصله
          area: t.tenantAddress?.detailedAddress?.suburb,
          city: t.tenantAddress?.detailedAddress?.city||t.city,
          province: t.tenantAddress?.detailedAddress?.state||t.province,
          lat: t.tenantAddress?.location?.lat,
          lng: t.tenantAddress?.location?.lng,
          available24: t.isOpen, // نگاشت isOpen به available24
          phone: t.phone,
          //logo: pharmacyInfoSetting.logo,
          logo: resolveUrl(pharmacyInfoSetting.logo),
          rating: parseFloat(t.rating) || 0,
          reviewsCount: t.reviewsCount || 0,
          open24:pharmacyInfoSetting.is24Hours,
          isOpen: checkIsOpen(t,'pharmacy'),
          services: t.services?.map(s => s.name) || [], // استخراج نام سرویس‌ها
          hasParking: true, // فیلد پیش‌فرض (چون در دیتا نبود)
          hasEmergency: true, // فیلد پیش‌فرض
          workingHours: pharmacyInfoSetting.is24Hours?'24 ساعته':'', // متن ثابت یا می‌توانید از دیتا بخوانید
          establishedYear: pharmacyInfoSetting.experience || 0
        };
      });
});

/*const allPharmacies = [
  {
    id: 1,
    name: 'داروخانه دکتر نیکنام',
    address: 'خیابان ولیعصر، پلاک ۱۲۳',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7075,
    lng: 51.4010,
    open24: false,
    phone: '021-12345678',
    rating: 4.8,
    reviewsCount: 127,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره دارویی'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-building-hospital'
  },
  {
    id: 2,
    name: 'داروخانه شبانه‌روزی صحت',
    address: 'خیابان انقلاب، میدان فردوسی',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7000,
    lng: 51.4200,
    open24: true,
    phone: '021-87654321',
    rating: 4.6,
    reviewsCount: 89,
    isOpen: true,
    services: ['تحویل دارو', 'اورژانس'],
    hasParking: false,
    acceptsInsurance: true,
    logo: 'ti-clock-24'
  },
  {
    id: 3,
    name: 'داروخانه پارس',
    address: 'خیابان کریمخان، پلاک ۴۵',
    city: 'تهران',
    province: 'تهران',
    lat: 35.6892,
    lng: 51.3890,
    open24: false,
    phone: '021-33333333',
    rating: 4.7,
    reviewsCount: 156,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-pill'
  },
  {
    id: 4,
    name: 'داروخانه ایران اصفهان',
    address: 'خیابان چهارباغ، پلاک ۶۷',
    city: 'اصفهان',
    province: 'اصفهان',
    lat: 32.6546,
    lng: 51.6800,
    open24: true,
    phone: '031-44444444',
    rating: 4.9,
    reviewsCount: 201,
    isOpen: true,
    services: ['تحویل دارو', 'اورژانس'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-heart-plus'
  },
  {
    id: 5,
    name: 'داروخانه امام رضا مشهد',
    address: 'خیابان امام رضا، پلاک ۸۹',
    city: 'مشهد',
    province: 'خراسان رضوی',
    lat: 36.2970,
    lng: 59.6062,
    open24: false,
    phone: '051-55555555',
    rating: 4.5,
    reviewsCount: 134,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-stethoscope'
  },
  {
    id: 6,
    name: 'داروخانه شریعتی خوی',
    address: 'خیابان شریعتی، پلاک ۱۲',
    city: 'خوی',
    province: 'آذربایجان غربی',
    lat: 38.5500,
    lng: 44.9700,
    open24: true,
    phone: '044-66666666',
    rating: 4.4,
    reviewsCount: 78,
    isOpen: true,
    services: ['تحویل دارو', 'اورژانس'],
    hasParking: false,
    acceptsInsurance: true,
    logo: 'ti-medical-cross'
  },
  {
    id: 7,
    name: 'داروخانه سعدی شیراز',
    address: 'خیابان سعدی، پلاک ۱۵۶',
    city: 'شیراز',
    province: 'فارس',
    lat: 29.5918,
    lng: 52.5837,
    open24: false,
    phone: '071-11111111',
    rating: 4.7,
    reviewsCount: 189,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-first-aid-kit'
  },
  {
    id: 8,
    name: 'داروخانه آزادگان کرج',
    address: 'خیابان آزادگان، پلاک ۴۵۶',
    city: 'کرج',
    province: 'البرز',
    lat: 35.8327,
    lng: 50.9916,
    open24: true,
    phone: '026-11111111',
    rating: 4.7,
    reviewsCount: 201,
    isOpen: true,
    services: ['تحویل دارو', 'اورژانس'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-shield-check'
  },
  {
    id: 9,
    name: 'داروخانه کیانپارس اهواز',
    address: 'کیانپارس، فاز ۳، پلاک ۲۳۴',
    city: 'اهواز',
    province: 'خوزستان',
    lat: 31.2975,
    lng: 48.7037,
    open24: false,
    phone: '061-11111111',
    rating: 4.6,
    reviewsCount: 167,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-vaccine'
  },
  {
    id: 10,
    name: 'داروخانه لاکانی رشت',
    address: 'خیابان لاکانی، پلاک ۱۵۶',
    city: 'رشت',
    province: 'گیلان',
    lat: 37.2808,
    lng: 49.5883,
    open24: false,
    phone: '013-11111111',
    rating: 4.5,
    reviewsCount: 134,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-capsule'
  },
  {
    id: 11,
    name: 'داروخانه جمهوری کرمان',
    address: 'خیابان جمهوری، پلاک ۳۷۸',
    city: 'کرمان',
    province: 'کرمان',
    lat: 30.2839,
    lng: 57.0834,
    open24: false,
    phone: '034-11111111',
    rating: 4.6,
    reviewsCount: 145,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-thermometer'
  },
  {
    id: 12,
    name: 'داروخانه حکیم اصفهان',
    address: 'خیابان حکیم نظامی، پلاک ۱۲۳',
    city: 'اصفهان',
    province: 'اصفهان',
    lat: 32.6719,
    lng: 51.6746,
    open24: false,
    phone: '031-55555555',
    rating: 4.8,
    reviewsCount: 178,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-bandage'
  },
  {
    id: 13,
    name: 'داروخانه فردوسی مشهد',
    address: 'خیابان فردوسی، پلاک ۲۵۶',
    city: 'مشهد',
    province: 'خراسان رضوی',
    lat: 36.3156,
    lng: 59.5684,
    open24: true,
    phone: '051-66666666',
    rating: 4.7,
    reviewsCount: 198,
    isOpen: true,
    services: ['تحویل دارو', 'اورژانس'],
    hasParking: false,
    acceptsInsurance: true,
    logo: 'ti-emergency-bed'
  },
  {
    id: 14,
    name: 'داروخانه شهدای خوی',
    address: 'خیابان شهدا، پلاک ۳۴۵',
    city: 'خوی',
    province: 'آذربایجان غربی',
    lat: 38.5421,
    lng: 44.9582,
    open24: false,
    phone: '044-77777777',
    rating: 4.3,
    reviewsCount: 92,
    isOpen: true,
    services: ['تحویل دارو', 'مشاوره'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-nurse'
  },
  {
    id: 15,
    name: 'داروخانه معینی تهران',
    address: 'خیابان گاندی، پلاک ۹۸۷',
    city: 'تهران',
    province: 'تهران',
    lat: 35.7219,
    lng: 51.3347,
    open24: true,
    phone: '021-99999999',
    rating: 4.9,
    reviewsCount: 245,
    isOpen: true,
    services: ['تحویل دارو', 'اورژانس'],
    hasParking: true,
    acceptsInsurance: true,
    logo: 'ti-medicine-syrup'
  }
]*/

/* -------- State Management -------- */
const state = reactive({
  q: '',
  status: '',
  page: 1,
  perPage: 9,
  statusDropdownOpen: false,
  selectedLocation: null
})

/* -------- Status Options -------- */
const statusOptions = [
  { value: '', label: 'همه داروخانه‌ها' },
  { value: 'open', label: 'فعال و باز' },
  { value: '24h', label: '۲۴ ساعته' }
]

/* -------- Helper Functions -------- */
const getStatusLabel = (value) => {
  const option = statusOptions.find(opt => opt.value === value)
  return option ? option.label : 'همه داروخانه‌ها'
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  state.statusDropdownOpen = false
}

// Add click outside listener
onMounted(async () => {
  await getUserLocation()
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative.group')) {
      closeDropdowns()
    }
  })
})
watch(selectedCity, (newCity) => {
  state.city = newCity;
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
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
  scrollToAllPharmacies()
}

const getPharmacyDistance = (pharmacy) => {

  if (!selectedLocation.value || !selectedLocation.value?.lat || !selectedLocation.value?.lng) {
    return null
  }

  return calculateDistance(
      selectedLocation.value.lat,
      selectedLocation.value.lng,
      pharmacy.lat,
      pharmacy.lng
  )
}
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

/* -------- Computed Values -------- */
// داروخانه‌های نزدیک (فقط شهر انتخابی)
const nearby = computed(() => {
  return filteredAll.value
    .filter(p => p.city === selectedCity.value)
    .slice(0, 6)
})
const clearLocationFilter = () => {
  state.selectedLocation = null
  state.q = ''
}

// برترین داروخانه‌ها از تمام شهرها
const topRatedPharmacies = computed(() => {
  return filteredAll.value
    .filter(p => p.rating >= 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
})

// داروخانه‌های ۲۴ ساعته از تمام شهرها
const open24Pharmacies = computed(() => {
  return filteredAll.value
    .filter(p => p.open24)
    .slice(0, 6)
})

// تمام داروخانه‌ها با فیلتر

const filteredAll = computed(() => {

  let results = allPharmacies.value.filter(phar => {
    const matchesQuery = !state.q ||
        phar.name.toLowerCase().includes(state.q.toLowerCase()) ||
        phar.address.toLowerCase().includes(state.q.toLowerCase())

    const matchesStatus = !state.status ||
        (state.status === 'open' && phar.isOpen) ||
        (state.status === '24h' && phar.available24)

    const matchesCity = !state.city || phar.city === state.city

    // اگر لوکیشن انتخاب شده، فقط کلینیک‌های در شعاع 20 کیلومتری را نمایش بده
    let matchesLocation = true
    if (state.selectedLocation && state.selectedLocation.lat && state.selectedLocation.lng) {
      const distance = calculateDistance(
          state.selectedLocation.lat,
          state.selectedLocation.lng,
          phar.lat,
          phar.lng
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


// صفحه‌بندی
const pagedAll = computed(() => {

  const total = filteredAll.value.length
  const totalPages = Math.ceil(total / state.perPage)
  const start = (state.page - 1) * state.perPage
  const end = start + state.perPage

  return {
    data: filteredAll.value.slice(start, end),
    total,
    totalPages,
    currentPage: state.page
  }
})

// Functions
const scrollToAllPharmacies = () => {
  const allPharmaciesSection = document.querySelector('#all-pharmacies-section')
  if (allPharmaciesSection) {
    allPharmaciesSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
/* Custom RTL Select Styles */
select {
  background-image: none;
}

/* RTL Select with proper text alignment */
select[dir="rtl"] {
  text-align: right;
  padding-right: 3rem;
  padding-left: 3rem;
}

select[dir="rtl"] option {
  text-align: right;
  direction: rtl;
}

/* Enhanced focus states */
.group:hover select {
  border-color: rgb(14 165 233);
}

.group:hover i {
  color: rgb(14 165 233);
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(12px);
  }
}

/* Animation for icons */
.group i {
  transition: color 0.3s ease;
}

/* Dropdown animations */
.group button {
  transition: all 0.3s ease;
}

.group .ti-chevron-down {
  transition: transform 0.2s ease;
}

.group .rotate-180 {
  transform: rotate(180deg);
}

/* Custom dropdown scrollbar */
.max-h-60::-webkit-scrollbar {
  width: 4px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Gradient hover effects */
.bg-gradient-to-r:hover {
  background: linear-gradient(to right, rgb(240 249 255), rgb(236 253 245));
}
</style>