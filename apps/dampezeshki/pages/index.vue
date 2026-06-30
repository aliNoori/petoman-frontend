<template>
  <div class="min-h-screen bg-white">

    <!-- ===== Top Vets Section ===== -->
    <section class="py-10 md:py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">دامپزشکان برتر</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">بهترین دامپزشکان کشور</p>
          </div>
          <NuxtLink to="/vets" class="inline-flex items-center gap-1 text-sky-600 font-semibold text-sm">
            همه
            <i class="ti ti-chevron-left text-xs"></i>
          </NuxtLink>
        </div>

        <!-- Vets Slider (Mobile) / Grid (Desktop) -->
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
          <div 
            v-for="(vet, index) in vets" 
            :key="index"
            class="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white rounded-2xl p-4 md:p-5 border border-gray-100"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="relative">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center" :class="vet.avatarBg">
                  <img :src="vet.image" class="w-full h-full rounded-[2px] object-cover"/>
<!--                  <span class="font-bold text-base md:text-lg" :class="vet.avatarText">{{ vet.initials }}</span>-->
                </div>
                <div v-if="vet.online" class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 truncate text-sm md:text-base">{{ vet.name }}</h3>
                <p class="text-xs md:text-sm text-gray-500">{{ vet.specialty }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <i class="ti ti-star-filled text-amber-500 text-xs md:text-sm"></i>
                  <span class="text-xs md:text-sm font-semibold text-gray-700">{{ vet.rate }}</span>
                  <span class="text-xs text-gray-400">({{ vet.reviews }})</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-sky-50 text-sky-600 rounded-lg text-xs font-medium">
                {{ vet.exp }} سال تجربه
              </span>
              <span v-if="vet.online" class="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                آنلاین
              </span>
            </div>
            
            <NuxtLink 
              :to="`/vet/${vet.id}`"
              class="w-full py-2 md:py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
            >
              <i class="ti ti-calendar"></i>
              رزرو نوبت
            </NuxtLink>
          </div>
        </div>

        <!-- Load More Button (Desktop Only) -->
<!--        <div class="hidden md:flex justify-center mt-10">
          <NuxtLink 
            to="/vets"
            class="inline-flex items-center gap-3 px-8 py-4 bg-sky-50 text-sky-600 rounded-2xl font-semibold hover:bg-sky-100 transition-all"
          >
            <span>مشاهده همه دامپزشکان</span>
            <i class="ti ti-arrow-left"></i>
          </NuxtLink>
        </div>-->
      </div>
    </section>

    <!-- ===== Clinics Section ===== -->
    <section class="py-10 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">کلینیک‌های برتر</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">مجهزترین کلینیک‌های دامپزشکی</p>
          </div>
          <NuxtLink to="/clinics" class="inline-flex items-center gap-1 text-teal-600 font-semibold text-sm">
            همه
            <i class="ti ti-chevron-left text-xs"></i>
          </NuxtLink>
        </div>

        <!-- Clinics Slider (Mobile) / Grid (Desktop) -->
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible md:pb-0">
          <div 
            v-for="(clinic, index) in clinics" 
            :key="index"
            class="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white rounded-2xl p-4 md:p-5 border border-gray-100"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center" :class="clinic.cover">
                <img :src="clinic.image" class="w-full h-full rounded-[2px] object-cover"/>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 truncate text-sm md:text-base">{{ clinic.title }}</h3>
                <p class="text-xs md:text-sm text-gray-500 truncate">{{ clinic.desc }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <i class="ti ti-star-filled text-amber-500 text-xs md:text-sm"></i>
                  <span class="text-xs md:text-sm font-semibold text-gray-700">{{ clinic.rate }}</span>
                  <span class="text-xs text-gray-400">({{ clinic.reviews }})</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3">
              <i class="ti ti-map-pin text-teal-500"></i>
              {{ clinic.addr }}
            </div>
            
            <div class="flex items-center gap-2 mb-3">
              <span 
                class="px-2 py-1 rounded-lg text-xs font-medium"
                :class="clinic.open ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
              >
                {{ clinic.open ? 'باز' : 'بسته' }}
              </span>
              <span v-if="clinic.er" class="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                اورژانس ۲۴/۷
              </span>
            </div>
            
            <NuxtLink 
              :to="`/clinic/${clinic.id}`"
              class="w-full py-2 md:py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
            >
              <i class="ti ti-calendar"></i>
              رزرو نوبت
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Pharmacies Section ===== -->
    <section class="py-10 md:py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">داروخانه‌های برتر</h2>
            <p class="text-gray-500 text-sm mt-1 hidden sm:block">بهترین داروخانه‌های دامپزشکی</p>
          </div>
          <NuxtLink to="/pharmacy" class="inline-flex items-center gap-1 text-purple-600 font-semibold text-sm">
            همه
            <i class="ti ti-chevron-left text-xs"></i>
          </NuxtLink>
        </div>

        <!-- Pharmacies Slider (Mobile) / Grid (Desktop) -->
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible md:pb-0">
          <div 
            v-for="(pharmacy, index) in pharmacies" 
            :key="index"
            class="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white rounded-2xl p-4 md:p-5 border border-gray-100"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center" :class="pharmacy.cover">
                <img :src="pharmacy.image" class="w-full h-full rounded-[2px] object-cover">
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 truncate text-sm md:text-base">{{ pharmacy.title }}</h3>
                <p class="text-xs md:text-sm text-gray-500 truncate">{{ pharmacy.desc }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <i class="ti ti-star-filled text-amber-500 text-xs md:text-sm"></i>
                  <span class="text-xs md:text-sm font-semibold text-gray-700">{{ pharmacy.rate }}</span>
                  <span class="text-xs text-gray-400">({{ pharmacy.reviews }})</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3">
              <i class="ti ti-map-pin text-purple-500"></i>
              {{ pharmacy.addr }}
            </div>
            
            <div class="flex items-center gap-2 mb-3">
              <span 
                class="px-2 py-1 rounded-lg text-xs font-medium"
                :class="pharmacy.open ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
              >
                {{ pharmacy.open ? 'باز' : 'بسته' }}
              </span>
              <span v-if="pharmacy.delivery" class="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
                ارسال سریع
              </span>
            </div>
            
            <NuxtLink 
              :to="`/pharmacy/${pharmacy.id}`"
              class="block w-full py-2 md:py-2.5 bg-purple-500 text-white rounded-xl font-semibold text-center text-xs md:text-sm"
            >
              سفارش دارو
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Testimonials Section ===== -->
    <section class="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 md:mb-16">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            <i class="ti ti-quote text-base md:text-lg"></i>
            نظرات مشتریان
          </span>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2 md:mb-3">آنچه مشتریان می‌گویند</h2>
          <p class="text-gray-500 text-sm md:text-base max-w-lg mx-auto">بیش از ۱۰,۰۰۰ کاربر راضی از خدمات پتومن</p>
        </div>

        <!-- Testimonials Slider (Mobile) / Grid (Desktop) -->
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="index"
            class="flex-shrink-0 w-[300px] md:w-auto snap-start group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100"
          >
            <!-- Quote Icon -->
            <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <i class="ti ti-quote text-white text-lg md:text-xl"></i>
            </div>
            
            <!-- Stars -->
            <div class="flex items-center gap-1 mb-3 md:mb-4">
              <i v-for="n in 5" :key="n" class="ti ti-star-filled text-amber-400 text-base md:text-lg"></i>
            </div>
            
            <!-- Text -->
            <p class="text-gray-700 mb-5 md:mb-8 leading-relaxed text-sm md:text-lg">"{{ testimonial.text }}"</p>
            
            <!-- Author -->
            <div class="flex items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-100">
              <div class="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center" :class="testimonial.avatarBg">
                <span class="font-bold text-base md:text-lg" :class="testimonial.avatarText">{{ testimonial.initials }}</span>
              </div>
              <div>
                <div class="font-bold text-gray-900 text-sm md:text-lg">{{ testimonial.name }}</div>
                <div class="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                  <i class="ti ti-paw-filled text-amber-400"></i>
                  {{ testimonial.role }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Trust Indicators -->
        <div class="mt-10 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-gray-400">
          <div class="flex items-center gap-2">
            <i class="ti ti-users text-xl md:text-2xl text-sky-500"></i>
            <span class="text-gray-600 font-medium text-sm md:text-base">+۱۰,۰۰۰ کاربر</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="ti ti-star-filled text-xl md:text-2xl text-amber-400"></i>
            <span class="text-gray-600 font-medium text-sm md:text-base">۴.۹ امتیاز</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="ti ti-message-circle text-xl md:text-2xl text-teal-500"></i>
            <span class="text-gray-600 font-medium text-sm md:text-base">+۵۰,۰۰۰ مشاوره</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Animal Supporters Banner ===== -->
    <section class="py-8 md:py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-700 to-rose-800 p-5 md:p-6 lg:p-8">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-20 md:w-32 h-20 md:h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 right-0 w-24 md:w-48 h-24 md:h-48 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div class="relative flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center">
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
                  class="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white text-rose-700 rounded-xl font-bold text-xs md:text-sm hover:bg-rose-50 transition-all"
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
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useTenantStore} from "~/stores/tenant.store";
import {useSocketStore} from "~/stores/socket";
import {useUrlHelper} from "~/composables/useUrlHelper";
const socketStore=useSocketStore()
const tenantStore=useTenantStore()
const { resolveUrl } = useUrlHelper();
// SEO
useHead({
  title: 'پتومن - پلتفرم جامع دامپزشکی',
  meta: [
    { name: 'description', content: 'مراقبت از حیوان خانگی شما با بهترین دامپزشکان، مشاوره آنلاین، ویزیت در منزل و خدمات اورژانسی' },
    { name: 'keywords', content: 'دامپزشک، مشاوره آنلاین، ویزیت در منزل، حیوانات خانگی، اورژانس دامپزشکی' },
  ]
})
// Data
const features = [
  { 
    title: 'دامپزشکان مجرب', 
    desc: 'تیمی از بهترین دامپزشکان با سال‌ها تجربه', 
    icon: 'ti ti-certificate text-sky-600', 
    bg: 'bg-sky-100' 
  },
  { 
    title: 'پشتیبانی ۲۴/۷', 
    desc: 'همیشه در دسترس شما هستیم', 
    icon: 'ti ti-clock-24 text-teal-600', 
    bg: 'bg-teal-100' 
  },
  { 
    title: 'کیفیت تضمینی', 
    desc: 'ضمانت رضایت از خدمات', 
    icon: 'ti ti-shield-check text-green-600', 
    bg: 'bg-green-100' 
  }
]

// --- تابع کمکی برای محاسبه وضعیت باز بودن ---

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

const formatAddress = (fullAddress) => {
  if (!fullAddress) return 'آدرس ثبت نشده';

  const parts = fullAddress.split(',').map(p => p.trim());

  // برگرداندن شهر + ۲ بخش بعدی (مثلا: تهران، میدان آزادی، استاد معین)
  // اگر از ایندکس به بعد ۳ بخش وجود نداشت، همون چیزهایی که هست رو برمی‌گردونه
  return parts.slice(0, 2).join('، ');
};
// --- 1. لیست دامپزشکان (Vets) ---
const vets = computed(() => {
  if (!tenantStore.vets || tenantStore.vets.length === 0) return [];

  return tenantStore.vets.map((vet) => {
    // ساخت حروف اول نام برای آواتار
    const nameParts = (vet.ownerName || vet.name || 'ناشناس').split(' ');
    const initials = nameParts.length > 1
        ? (nameParts[0][0] +'.'+ nameParts[1][0])
        : (nameParts[0][0] +'.'+ (nameParts[0][1] || ''));
    const vetInfoSetting = (vet.tenantSettings || []).find(item => item.key === 'clinic_info')?.value || {}

    return {
      id: vet.id,
      name: vet.ownerName || vet.name || 'نامشخص',
      specialty: vet.specialty || vetInfoSetting.specialty || 'دامپزشک',
      exp: vetInfoSetting?.experience || 0,
      rate: parseFloat(vet.rating) || 0,
      reviews: vet.reviewsCount || 0,
      online: tenantStore.calculateOnlineStatus(vet.id,socketStore.onlineUsers)||vet.isOnline,
      initials: initials,
      // انتخاب رنگ تصادفی یا ثابت بر اساس نام
      avatarBg: 'bg-sky-100',
      avatarText: 'text-sky-700',
      // اطلاعات اضافی
      address:  [
        vet.tenantAddress?.detailedAddress?.road??vet.tenantAddress?.detailedAddress?.city,
        vet.tenantAddress?.detailedAddress?.neighbourhood??vet.tenantAddress?.detailedAddress?.district,
        vet.tenantAddress?.detailedAddress?.suburb??vet.tenantAddress?.detailedAddress?.state
      ]
          .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
          .join('. '),
      //image: vetInfoSetting?.logo || null,
      image: resolveUrl(vetInfoSetting?.logo) || null
    };
  });
});
console.log('vets',vets.value)
// --- 2. لیست کلینیک‌ها (Clinics) ---
const clinics = computed(() => {
  if (!tenantStore.clinics || tenantStore.clinics.length === 0) return [];

  return tenantStore.clinics.map((clinic) => {
    const clinicInfoSetting = (clinic.tenantSettings || []).find(item => item.key === 'clinic_info')?.value || {}
    return {
      id: clinic.id,
      title: clinic.ownerName || clinic.name || 'کلینیک',
      desc: clinic.specialty || 'خدمات دامپزشکی',
      addr: [
        clinic.tenantAddress?.detailedAddress?.road??clinic.tenantAddress?.detailedAddress?.city,
        clinic.tenantAddress?.detailedAddress?.neighbourhood??clinic.tenantAddress?.detailedAddress?.district,
        clinic.tenantAddress?.detailedAddress?.suburb??clinic.tenantAddress?.detailedAddress?.state
      ]
          .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
          .join('. '),
      rate: clinic.rating || '0.0',
      reviews:clinic.reviewsCount||0,
      open: checkIsOpen(clinic,'clinic'),
      er: false, // اگر فیلدی برای اورژانس دارید اینجا ست کنید
      cover: 'bg-gradient-to-br from-sky-400 to-sky-600', // رنگ پیش‌فرض
      //image: clinicInfoSetting?.logo || null,
      image: resolveUrl(clinicInfoSetting?.logo) || null
    };
  });
});

// --- 3. لیست داروخانه‌ها (Pharmacies) ---
const pharmacies = computed(() => {
  if (!tenantStore.pharmacies || tenantStore.pharmacies.length === 0) return [];

  return tenantStore.pharmacies.map((pharmacy) => {
    const pharmacyInfoSetting = (pharmacy.settings || []).find(item => item.key === 'pharmacyInfo')?.value || {}

    return {
      id: pharmacy.id,
      title: pharmacy.ownerName || pharmacy.name || 'داروخانه',
      desc: pharmacy.specialty || 'تامین دارو و مکمل',
      addr: [
        pharmacy.tenantAddress?.detailedAddress?.road??pharmacy.tenantAddress?.detailedAddress?.city,
        pharmacy.tenantAddress?.detailedAddress?.neighbourhood??pharmacy.tenantAddress?.detailedAddress?.district,
        pharmacy.tenantAddress?.detailedAddress?.suburb??pharmacy.tenantAddress?.detailedAddress?.state
      ]
          .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
          .join('. '),
      rate: pharmacy.rating || '0.0',
      reviews:pharmacy.reviewsCount||0,
      open: checkIsOpen(pharmacy,'pharmacy'),
      delivery: pharmacy.freeDelivery || false, // یا بررسی تنظیمات ارسال
      cover: 'bg-gradient-to-br from-purple-400 to-purple-600', // رنگ پیش‌فرض
      //image: pharmacyInfoSetting?.logo || null,
      image: resolveUrl(pharmacyInfoSetting?.logo) || null
    };
  });
});


const testimonials = [
  { text: 'خدمات فوق‌العاده‌ای دارند. دامپزشک به موقع رسید و گربه‌ام را دقیق معاینه کرد.', name: 'سارا احمدی', role: 'مالک گربه', initials: 'س.ا', avatarBg: 'bg-sky-100', avatarText: 'text-sky-700' },
  { text: 'مشاوره آنلاین عالی بود. دکتر صبور و دقیق بود و همه سوالاتم را پاسخ داد.', name: 'رضا محمدی', role: 'مالک سگ', initials: 'ر.م', avatarBg: 'bg-teal-100', avatarText: 'text-teal-700' },
  { text: 'اورژانس‌شان فوق‌العاده است. شب‌های تعطیل هم پاسخگو بودند.', name: 'مریم کریمی', role: 'مالک پرنده', initials: 'م.ک', avatarBg: 'bg-purple-100', avatarText: 'text-purple-700' }
]

const appHighlights = [
  { icon: 'ti ti-device-mobile', title: 'رابط کاربری ساده', desc: 'استفاده آسان برای همه' },
  { icon: 'ti ti-bell', title: 'اعلان‌های هوشمند', desc: 'یادآوری نوبت‌ها و واکسیناسیون' },
  { icon: 'ti ti-history', title: 'پرونده پزشکی', desc: 'سابقه کامل سلامت حیوان' }
]

</script>
