<!-- @ts-nocheck -->
<template>
  <div class="space-y-6">
    <!-- Header با فیلتر و آیکون امتیاز -->
    <div class="flex items-center justify-between gap-4">
      <!-- فیلتر زمانی -->
      <div class="flex items-center gap-2">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedPeriod === period.value 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          <i :class="period.icon + ' ml-1'"></i>
          {{ period.label }}
        </button>
      </div>

      <!-- آیکون امتیاز -->
      <button 
        @click="showRatingModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors group"
      >
        <i class="ti ti-award text-amber-500 text-xl group-hover:scale-110 transition-transform"></i>
        <div class="text-right">
          <p class="text-xs text-gray-600">عملکرد شما</p>
          <p class="text-sm font-bold text-gray-900 font-english">{{ tenant?.rating }}/5</p>
        </div>
      </button>
    </div>

    <!-- کارت‌های آماری اصلی -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      <!-- کارت درآمد کل -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-currency-toman text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+15%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کل درآمد</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ displayWholeIncome.toLocaleString() }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت کارمزد پلتفرم -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-percentage text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
              <span class="font-english">5%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">کارمزد پلتفرم</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ displayPlatformFeeIncome.toLocaleString() }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت خالص درآمد -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-cash text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
              <i class="ti ti-trending-up text-sm"></i>
              <span class="font-english">+15%</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">خالص درآمد</p>
            <p class="text-3xl font-bold text-gray-900 font-english" dir="ltr">{{ displayIncome.toLocaleString() }}</p>
            <p class="text-xs text-gray-500">تومان</p>
          </div>
        </div>
      </div>

      <!-- کارت نوبت‌ها -->
      <div class="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <i class="ti ti-calendar-check text-white text-xl"></i>
            </div>
            <div class="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
              <span class="font-english">امروز</span>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-600">نوبت‌های امروز</p>
            <p class="text-3xl font-bold text-gray-900 font-english">{{ appointmentStats?.today }}</p>
            <p class="text-xs text-gray-500">نوبت</p>
          </div>
        </div>
      </div>
    </div>

    <!-- تراکنش‌های اخیر -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="ti ti-receipt text-emerald-500"></i>
          تراکنش‌های اخیر
        </h2>
        <router-link 
          to="/clinic/financial"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          مشاهده همه
          <i class="ti ti-chevron-left text-xs"></i>
        </router-link>
      </div>

      <div class="space-y-3">
        <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  transaction.isPositive ? 'bg-emerald-100 text-emerald-600' :
                  transaction.type === 'pending_credit' ? 'bg-amber-100 text-amber-600' :
                  'bg-red-100 text-red-600'
                ]">
              <i :class="getIcon(transaction.type)" class="text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ transaction.description }}</p>
              <p class="text-xs text-gray-500 truncate">{{ transaction.detail }}</p>
              <p class="text-xs text-gray-400 mt-0.5 font-english">کد: {{ transaction.trackingCode }}</p>
            </div>
          </div>
          <div class="text-right">
            <p :class="[
                'text-base font-bold font-english',
                transaction.isPositive ? 'text-emerald-600' :
                transaction.type === 'pending_credit' ? 'text-amber-500' :'text-red-600'
              ]">
              {{ transaction.isPositive|| transaction.type === 'pending_credit' ? '+' : '-' }} {{ transaction.amount.toLocaleString() }}
            </p>
            <span :class="[
                'text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block',
                transaction.type === 'pending_credit' ? 'bg-amber-100 text-amber-700' :
                transaction.isPositive ? 'bg-emerald-100 text-emerald-700' :
                'bg-red-100 text-red-700'
              ]">
               {{ getStatusLabel(transaction.type) }}
          </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- مودال امتیاز و کارمزد -->
  <Transition name="fade">
    <div 
      v-if="showRatingModal" 
      @click="showRatingModal = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-0 lg:p-4"
    >
        <div 
          @click.stop
          class="bg-white lg:rounded-2xl shadow-2xl max-w-md w-full h-full lg:h-auto overflow-y-auto"
        >
          <!-- Header -->
          <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white overflow-hidden lg:rounded-t-2xl sticky top-0 z-10">
            <div class="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <i class="ti ti-award text-3xl"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold">عملکرد کلینیک شما</h3>
                  <p class="text-sm opacity-90">امتیاز و رتبه‌بندی</p>
                </div>
              </div>
              <button @click="showRatingModal = false" class="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>
          </div>

          <!-- محتوای امتیاز -->
          <div class="p-6 space-y-6">
            <!-- امتیاز و رتبه -->
            <div class="text-center pb-6 border-b border-gray-200">
              <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 mb-4 relative">
                <span class="text-4xl font-bold text-amber-600 font-english">{{ rating.average.toFixed(1) }}</span>
                <div class="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  عالی
                </div>
              </div>
              
              <!-- ستاره‌ها -->
              <div class="flex gap-1 justify-center mb-3">
                <i 
                  v-for="star in 5" 
                  :key="star" 
                  :class="[
                    'ti text-3xl',
                    star <= Math.floor(rating.average) ? 'ti-star-filled text-amber-500' : 
                    star === Math.ceil(rating.average) && rating.average % 1 !== 0 ? 'ti-star-half-filled text-amber-500' : 
                    'ti-star text-gray-300'
                  ]"
                ></i>
              </div>

              <p class="text-sm text-gray-600 mb-2">
                بر اساس <span class="font-bold text-gray-900 font-english">{{ rating.totalReviews }}</span> نظر مشتریان
              </p>
              
              <!-- نمایش رتبه -->
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 mt-2">
                <i class="ti ti-trophy text-amber-600 text-lg"></i>
                <div class="text-right">
                  <p class="text-xs text-gray-600">رتبه شما</p>
                  <p class="text-sm font-bold text-amber-600">رتبه 15 از 83 کلینیک</p>
                </div>
              </div>
            </div>

            <!-- توضیحات عملکرد -->
            <div class="bg-blue-50 rounded-xl p-5">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-info-circle text-white text-xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 mb-2">تاثیر امتیازات بر عملکرد</h4>
                  <p class="text-sm text-gray-700 leading-relaxed mb-3">
                    این امتیازات بر عملکرد کلینیک شما تاثیر مستقیم دارد. با حضور به‌موقع در نوبت‌ها، رفتار مناسب با مشتریان و ارائه خدمات با کیفیت، امتیاز و رتبه خود را بهبود دهید.
                  </p>
                  
                  <!-- نکات کلیدی -->
                  <div class="space-y-2 mt-3">
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <i class="ti ti-check text-green-600 text-base"></i>
                      <span>حضور به‌موقع در نوبت‌ها</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <i class="ti ti-check text-green-600 text-base"></i>
                      <span>رفتار مناسب با مشتریان</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <i class="ti ti-check text-green-600 text-base"></i>
                      <span>کیفیت بالای خدمات</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                      <i class="ti ti-check text-green-600 text-base"></i>
                      <span>پاسخگویی سریع به سوالات</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- دکمه بستن -->
            <button 
              @click="showRatingModal = false"
              class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </Transition>
</template>

<script setup>
import { ref, computed,watch,onMounted} from 'vue'
import {useWalletStore} from "@/stores/wallet.js";
import {useAuthStore} from "@/stores/auth.js";
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js";
import {storeToRefs} from "pinia";
import {toGregorian} from "jalaali-js";
const walletStore = useWalletStore()
const appointmentStore=useAppointmentStore()
const {appointmentStats}=storeToRefs(appointmentStore)
const { transactions,platformFeeTransactions } = storeToRefs(walletStore)

const authStore=useAuthStore()
const {tenant}=storeToRefs(authStore)
// --- محاسبه درآمدها بر اساس بازه‌های زمانی ---
const income = computed(() => {
  if (!transactions.value || transactions.value.length === 0) {
    return { today: 0, thisWeek: 0, thisMonth: 0, last3Months: 0 };
  }

  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now);
  startOfMonth.setMonth(now.getMonth() - 1);
  const startOf3Months = new Date(now);
  startOf3Months.setMonth(now.getMonth() - 3);

  let totalToday = 0;
  let totalWeek = 0;
  let totalMonth = 0;
  let total3Months = 0;

  transactions.value.forEach(t => {
    if (t.type === 'income') {
      // --- تبدیل اعداد فارسی به انگلیسی ---
      // این خط اعداد "۱۴۰۴" را به "1404" تبدیل می‌کند
      const persianDate = t.date.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

      // جدا کردن و تبدیل به عدد (حالا اعداد انگلیسی هستند)
      const [jy, jm, jd] = persianDate.split('/').map(Number);

      // فراخوانی کتابخانه
      const gregorianObj = toGregorian(jy, jm, jd);

      // ساخت آبجکت Date (ماه را منهای یک می‌کنیم چون از ۰ شروع می‌شود)
      const tDate = new Date(gregorianObj.gy, gregorianObj.gm - 1, gregorianObj.gd);

      if (tDate && !isNaN(tDate.getTime())) {
        const amount = parseFloat(t.amount) || 0;

        if (tDate >= startOfToday) totalToday += amount;
        if (tDate >= startOfWeek) totalWeek += amount;
        if (tDate >= startOfMonth) totalMonth += amount;
        if (tDate >= startOf3Months) total3Months += amount;
      }
    }
  });

  return {
    today: totalToday,
    thisWeek: totalWeek,
    thisMonth: totalMonth,
    last3Months: total3Months
  };
});
const platformFeeIncome = computed(() => {
  if (!platformFeeTransactions.value || platformFeeTransactions.value.length === 0) {
    return { today: 0, thisWeek: 0, thisMonth: 0, last3Months: 0 };
  }

  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now);
  startOfMonth.setMonth(now.getMonth() - 1);
  const startOf3Months = new Date(now);
  startOf3Months.setMonth(now.getMonth() - 3);

  let totalToday = 0;
  let totalWeek = 0;
  let totalMonth = 0;
  let total3Months = 0;

  platformFeeTransactions.value.forEach(t => {
    if (t.type === 'fee_income') {
      // --- تبدیل اعداد فارسی به انگلیسی ---
      // این خط اعداد "۱۴۰۴" را به "1404" تبدیل می‌کند
      const persianDate = t.date.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

      // جدا کردن و تبدیل به عدد (حالا اعداد انگلیسی هستند)
      const [jy, jm, jd] = persianDate.split('/').map(Number);

      // فراخوانی کتابخانه
      const gregorianObj = toGregorian(jy, jm, jd);

      // ساخت آبجکت Date (ماه را منهای یک می‌کنیم چون از ۰ شروع می‌شود)
      const tDate = new Date(gregorianObj.gy, gregorianObj.gm - 1, gregorianObj.gd);

      if (tDate && !isNaN(tDate.getTime())) {
        const amount = parseFloat(t.amount) || 0;

        if (tDate >= startOfToday) totalToday += amount;
        if (tDate >= startOfWeek) totalWeek += amount;
        if (tDate >= startOfMonth) totalMonth += amount;
        if (tDate >= startOf3Months) total3Months += amount;
      }
    }
  });

  return {
    today: totalToday,
    thisWeek: totalWeek,
    thisMonth: totalMonth,
    last3Months: total3Months
  };
});

// --- متغیر selectedPeriod برای فیلتر ---
const selectedPeriod = ref('monthly');



const reportData = ref([])

const loadReport = async (period) => {
  reportData.value = await walletStore.fetchRevenueReport(selectedPeriod.value)
}
watch(selectedPeriod, (newPeriod) => {
  loadReport(newPeriod);
});

onMounted(() => {
  loadReport(selectedPeriod.value);
});

// --- مقدار نمایشی بر اساس فیلتر انتخاب شده ---
const displayIncome = computed(() => {
  switch (selectedPeriod.value) {
    case 'weekly': return income.value.thisWeek;
    case 'quarterly': return income.value.last3Months;
    case 'monthly':
    default: return income.value.thisMonth;
  }
});

const displayPlatformFeeIncome = computed(() => {
  switch (selectedPeriod.value) {
    case 'weekly': return platformFeeIncome.value.thisWeek;
    case 'quarterly': return platformFeeIncome.value.last3Months;
    case 'monthly':
    default: return platformFeeIncome.value.thisMonth;
  }
});

const displayWholeIncome = computed(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return 0;
  }
  // جمع زدن کل مبالغ موجود در گزارش (چون بک‌اند داده‌های گروه‌بندی شده را برگردانده)
  return reportData.value.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
});

// --- آپدیت کردن recentTransactions برای استفاده در قالب ---
const recentTransactions = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return [];

  return transactions.value.map(t => {
    let status = 'completed';
    if (t.description.includes('(Pending)')) {
      status = 'pending';
    }

    return {
      id: t.id,
      description: t.title,
      detail: t.description,
      amount: t.amount,
      time: t.time,
      date: t.date,
      type: t.type,
      status: status,
      isPositive:t.isPositive,
      trackingCode: t.trackingCode
    };
  });
});

// State
const stats = ref({
  totalPatients: 156
})

// تابع کمکی برای آیکون‌ها
const getIcon = (type) => {
  const icons = {
    income: 'ti ti-arrow-up-circle',
    outcome: 'ti ti-arrow-down-circle',
    fee: 'ti ti-coin',
    fee_income: 'ti ti-coin',
    pending_credit: 'ti ti-clock',
    refund: 'ti ti-rotate-2'
  };
  return icons[type] || 'ti ti-circle';
};

// تابع کمکی برای متن وضعیت
const getStatusLabel = (type) => {
  const labels = {
    income: 'واریز شده',
    outcome: 'کسر شده',
    fee: 'کارمزد',
    fee_income: 'کارمزد',
    pending_credit: 'در انتظار پرداخت',
    refund: 'برگشت خورده'
  };
  return labels[type] || 'نامشخص';
};


const timePeriods = [
  { label: 'هفتگی', value: 'weekly', icon: 'ti ti-calendar-week' },
  { label: 'ماهانه', value: 'monthly', icon: 'ti ti-calendar-month' },
  { label: '3 ماهه', value: 'quarterly', icon: 'ti ti-calendar-time' }
]

const rating = ref({
  average: 4.6,
  totalReviews: 219
})

// مودال امتیاز و کارمزد
const showRatingModal = ref(false)
const platformFee = 5

/*const recentTransactions = ref([
  {
    id: 1,
    description: 'واریز از پلتفرم پتومن',
    detail: 'تسویه نوبت‌های هفته سوم',
    amount: 2500000,
    time: '10 دقیقه پیش',
    date: '1403/07/29',
    type: 'income',
    status: 'completed',
    trackingCode: 'PTF1403072901'
  },
  {
    id: 2,
    description: 'واریز از پلتفرم پتومن',
    detail: 'تسویه نوبت‌های هفته دوم',
    amount: 3200000,
    time: '3 روز پیش',
    date: '1403/07/26',
    type: 'income',
    status: 'completed',
    trackingCode: 'PTF1403072602'
  },
  {
    id: 3,
    description: 'کسر کارمزد پلتفرم',
    detail: 'کارمزد 10% از درآمد هفته دوم',
    amount: 320000,
    time: '3 روز پیش',
    date: '1403/07/26',
    type: 'fee',
    status: 'completed',
    trackingCode: 'FEE1403072603'
  },
  {
    id: 4,
    description: 'واریز از پلتفرم پتومن',
    detail: 'تسویه نوبت‌های هفته اول',
    amount: 1800000,
    time: '1 هفته پیش',
    date: '1403/07/22',
    type: 'income',
    status: 'completed',
    trackingCode: 'PTF1403072203'
  },
  {
    id: 5,
    description: 'واریز از پلتفرم پتومن',
    detail: 'تسویه نوبت‌های ماه گذشته',
    amount: 4500000,
    time: '2 هفته پیش',
    date: '1403/07/15',
    type: 'income',
    status: 'completed',
    trackingCode: 'PTF1403071504'
  }
])*/

const todayAppointments = ref([
  { 
    id: 3, 
    patientName: 'سگ باکسر', 
    ownerName: 'علی رضایی', 
    ownerPhone: '0912-111-2222',
    ownerEmail: 'ali@email.com',
    service: 'جراحی', 
    date: '1403/07/29',
    time: '11:00', 
    status: 'completed', 
    type: 'in-person', 
    priority: 'normal',
    trackingCode: 'PET12345ABC'
  },
  { 
    id: 4, 
    patientName: 'گربه میو', 
    ownerName: 'زهرا کریمی', 
    ownerPhone: '0912-222-3333',
    ownerEmail: 'zahra@email.com',
    service: 'دندانپزشکی', 
    date: '1403/07/29',
    time: '14:00', 
    status: 'in-progress', 
    type: 'online', 
    priority: 'urgent',
    trackingCode: 'PET12346DEF'
  },
  { 
    id: 5, 
    patientName: 'سگ رکس', 
    ownerName: 'رضا محمدی', 
    ownerPhone: '0912-333-4444',
    ownerEmail: 'reza@email.com',
    service: 'آرایش', 
    date: '1403/07/29',
    time: '15:30', 
    status: 'completed', 
    type: 'phone', 
    priority: 'normal',
    trackingCode: 'PET12347GHI'
  }
])

// Methods
const getStatusColor = (status) => {
  const colors = {
    completed: {
      badge: 'bg-sky-100 text-sky-500'
    },
    'in-progress': {
      badge: 'bg-blue-100 text-blue-700'
    },
    pending: {
      badge: 'bg-amber-100 text-amber-700'
    },
    cancelled: {
      badge: 'bg-red-100 text-red-700'
    }
  }
  return colors[status] || colors.pending
}

/*const getStatusLabel = (status) => {
  const labels = {
    completed: 'انجام شده',
    'in-progress': 'در حال انجام',
    pending: 'در انتظار',
    cancelled: 'لغو شده'
  }
  return labels[status] || 'نامشخص'
}*/

const getTypeColor = (type) => {
  const colors = {
    'online': {
      bg: 'bg-blue-100',
      icon: 'ti ti-message-circle text-blue-600'
    },
    'phone': {
      bg: 'bg-purple-100',
      icon: 'ti ti-phone text-purple-600'
    },
    'in-person': {
      bg: 'bg-sky-100',
      icon: 'ti ti-home-check text-sky-400'
    }
  }
  return colors[type] || colors['in-person']
}


</script>

