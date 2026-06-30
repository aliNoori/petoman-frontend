<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت مالی</h1>
        <p class="text-gray-500 mt-1">درخواست‌های برداشت و تسویه حساب</p>
      </div>
      <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
        <i class="ti ti-file-spreadsheet text-green-600"></i>
        خروجی اکسل
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <i class="ti ti-clock-hour-4 text-amber-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">در انتظار تایید</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingWithdrawals.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-loader text-blue-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">در حال پردازش</p>
            <p class="text-2xl font-bold text-gray-900">{{ processingWithdrawals.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">پرداخت شده امروز</p>
            <p class="text-2xl font-bold text-gray-900">{{ paidToday.toLocaleString('fa-IR') }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-5 border border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <i class="ti ti-wallet text-indigo-600 text-2xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500">مجموع برداشت‌ها</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalWithdrawals.toLocaleString('fa-IR') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1">
      <button
          @click="activeTab = 'pending'"
          class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'pending' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        <i class="ti ti-clock-hour-4 ml-2"></i>
        در انتظار تایید ({{ pendingWithdrawals.length }})
      </button>
      <button
          @click="activeTab = 'processing'"
          class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'processing' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        <i class="ti ti-loader ml-2"></i>
        در حال پردازش ({{ processingWithdrawals.length }})
      </button>
      <button
          @click="activeTab = 'completed'"
          class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
          :class="activeTab === 'completed' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        <i class="ti ti-check ml-2"></i>
        پرداخت شده
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
              v-model="filters.search"
              type="text"
              placeholder="جستجو نام، شماره حساب..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <AppSelect
            v-model="filters.type"
            :options="typeOptions"
            placeholder="همه انواع"
            icon="ti ti-category"
        />
        <AppSelect
            v-model="filters.bank"
            :options="bankOptions"
            placeholder="همه بانک‌ها"
            icon="ti ti-building-bank"
        />
          <PersianDatePicker
              v-model="filters.date"
              placeholder="تاریخ را انتخاب کنید"
              type="date"
              display-format="jYYYY/jMM/jDD"
              format="jYYYY/jMM/jDD"
          />
      </div>
    </div>

    <!-- درخواست‌های در انتظار -->
    <div v-if="activeTab === 'pending'" class="space-y-4">
      <div v-for="item in filteredPending" :key="item.id" class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div
                class="w-14 h-14 rounded-xl flex items-center justify-center"
                :class="getTypeStyle(item.type).bg"
            >
              <i :class="[getTypeStyle(item.type).icon, getTypeStyle(item.type).color, 'text-2xl']"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ getTypeLabel(item.type) }} • {{ item.requestDate }}</p>
            </div>
          </div>
          <div class="text-left">
            <p class="text-2xl font-bold text-indigo-600">{{ item.amount.toLocaleString('fa-IR') }}</p>
            <p class="text-sm text-gray-500">تومان</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">بانک</p>
            <p class="font-medium text-gray-900">{{ item.bank }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره کارت</p>
            <p class="font-medium text-gray-900 font-mono" dir="ltr">{{ item.cardNumber }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره شبا</p>
            <p class="font-medium text-gray-900 font-mono text-xs" dir="ltr">{{ item.iban }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">موجودی قابل برداشت</p>
            <p class="font-medium text-green-600">{{ item.availableBalance.toLocaleString('fa-IR') }} تومان</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            <span>سابقه برداشت: </span>
            <span class="font-medium text-gray-900">{{ item.totalWithdrawn.toLocaleString('fa-IR') }} تومان</span>
          </div>
          <div class="flex items-center gap-3">
            <button @click="rejectWithdrawal(item)" class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
              <i class="ti ti-x"></i>
              رد درخواست
            </button>
            <button @click="approveWithdrawal(item)" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <i class="ti ti-check"></i>
              تایید و پردازش
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredPending.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه درخواست‌ها بررسی شده</h3>
        <p class="text-gray-500">درخواست برداشتی در انتظار تایید نیست</p>
      </div>
    </div>

    <!-- درخواست‌های در حال پردازش -->
    <div v-if="activeTab === 'processing'" class="space-y-4">
      <div v-for="item in filteredProcessing" :key="item.id" class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="getTypeStyle(item.type).bg"
            >
              <i :class="[getTypeStyle(item.type).icon, getTypeStyle(item.type).color, 'text-xl']"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.bank }} • {{ item.cardNumber }}</p>
            </div>
          </div>
          <div class="text-left">
            <p class="text-xl font-bold text-blue-600">{{ item.amount.toLocaleString('fa-IR') }} تومان</p>
            <p class="text-xs text-gray-500">تایید شده: {{ item.approvedDate }}</p>
          </div>
          <button @click="markAsPaid(item)" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <i class="ti ti-check"></i>
            پرداخت شد
          </button>
        </div>
      </div>
      <div v-if="filteredProcessing.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <i class="ti ti-loader text-gray-400 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">درخواستی در حال پردازش نیست</h3>
        <p class="text-gray-500">همه پرداخت‌ها انجام شده</p>
      </div>
    </div>

    <!-- پرداخت‌های انجام شده -->
    <div v-if="activeTab === 'completed'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">دریافت‌کننده</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">نوع</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">مبلغ</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">بانک</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">تاریخ پرداخت</th>
            <th class="px-6 py-4 text-right text-sm font-bold text-gray-700">کد پیگیری</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="item in filteredCompleted" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="getTypeStyle(item.type).bg"
                >
                  <i :class="[getTypeStyle(item.type).icon, getTypeStyle(item.type).color]"></i>
                </div>
                <span class="font-medium text-gray-900">{{ item.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-lg text-xs font-medium" :class="getTypeStyle(item.type).badge">
                  {{ getTypeLabel(item.type) }}
                </span>
            </td>
            <td class="px-6 py-4 font-bold text-green-600">{{ item.amount.toLocaleString('fa-IR') }} تومان</td>
            <td class="px-6 py-4 text-gray-600">{{ item.bank }}</td>
            <td class="px-6 py-4 text-gray-600">{{ item.date }}</td>
            <td class="px-6 py-4 font-mono text-sm text-gray-600">{{ item.trackingCode }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-100">
        <div v-for="item in filteredCompleted" :key="item.id" class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getTypeStyle(item.type).bg"
              >
                <i :class="[getTypeStyle(item.type).icon, getTypeStyle(item.type).color]"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ item.name }}</p>
                <p class="text-xs text-gray-500">{{ item.date }}</p>
              </div>
            </div>
            <p class="font-bold text-green-600">{{ item.amount.toLocaleString('fa-IR') }}</p>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ item.bank }}</span>
            <span class="font-mono">{{ item.trackingCode }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تایید درخواست برداشت وجه -->
    <div v-if="showWithdrawalApproveModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="showWithdrawalApproveModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <i class="ti ti-wallet text-cyan-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">تایید واریز وجه</h3>
              <p class="text-sm text-gray-500">{{ itemToAction?.amount?.toLocaleString('fa-IR') }} تومان</p>
            </div>
          </div>
          <button @click="showWithdrawalApproveModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        <div class="p-5">
          <div class="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-500">شماره کارت/شبا:</span>
              <span class="font-mono font-medium text-gray-900 dir-ltr">{{ itemToAction?.cardNumber || itemToAction?.iban }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">بانک:</span>
              <span class="font-medium text-gray-900">{{ itemToAction?.bank || '-' }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block mb-2 font-medium text-gray-900">شماره پیگیری تراکنش <span
                  class="text-red-500">*</span></label>
              <input
                  v-model="withdrawalTrackId"
                  type="text"
                  class="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="مثال: 1234567890"
              >
            </div>
            <div>
              <label class="block mb-2 font-medium text-gray-900">تاریخ واریز <span
                  class="text-red-500">*</span></label>
              <input
                  v-model="withdrawalDate"
                  type="text"
                  class="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dir-ltr text-left"
                  placeholder="1403/02/11"
              >
              <p class="text-xs text-gray-400 mt-1">فرمت: yyyy/mm/dd</p>
            </div>
          </div>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showWithdrawalApproveModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button
              @click="confirmWithdrawalApprove"
              :disabled="!withdrawalTrackId.trim() || !withdrawalDate.trim()"
              class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="ti ti-check"></i>
            ثبت تایید واریز
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import AppSelect from '@/components/AppSelect.vue'
import {useWithdrawalStore} from "@/stores/withdrawal.js";
import PersianDatePicker from "@/components/PersianDatePicker.vue";

const activeTab = ref('pending')
const filters = ref({ search: '', type: '', bank: '', date: '' })
const showWithdrawalApproveModal = ref(false)
const withdrawalTrackId = ref('')
const withdrawalDate = ref('')
const getTodayPersianDate = () => {
  // تبدیل اعداد انگلیسی به فارسی برای تطبیق دقیق با دیتابیس (اگر لازم باشد)
  // اما معمولاً مقایسه رشته‌ای با فرمت یکسان کار می‌کند.
  return new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
// ۳. محاسبه پویای پرداخت شده امروز
const paidToday = computed(() => {
  const today = normalizeDate(getTodayPersianDate())

  const todayTransactions = completedWithdrawals.value.filter(item => {
    return normalizeDate(item.date) === today
  })

  return todayTransactions.reduce((sum, item) => {
    return sum + Number(item.amount || 0)
  }, 0)
})

// ۴. محاسبه پویای مجموع تمام برداشت‌ها
const totalWithdrawals = computed(() => {
  // جمع زدن مبلغ تمام تراکنش‌های تکمیل شده
  return completedWithdrawals.value.reduce((sum, item) => sum + Number(item.amount), 0);
});
const itemToAction = ref(null)
const typeOptions = [
  { value: '', label: 'همه انواع' },
  { value: 'vet', label: 'دامپزشک', icon: 'ti ti-stethoscope' },
  { value: 'market', label: 'فروشگاه', icon: 'ti ti-building-store' },
  { value: 'pharmacy', label: 'داروخانه', icon: 'ti ti-pill' },
  { value: 'clinic', label: 'کلینیک', icon: 'ti ti-building-hospital' },
]

const bankOptions = [
  { value: '', label: 'همه بانک‌ها' },
  { value: 'mellat', label: 'ملت' },
  { value: 'melli', label: 'ملی' },
  { value: 'saderat', label: 'صادرات' },
  { value: 'parsian', label: 'پارسیان' },
  { value: 'saman', label: 'سامان' },
]
const withdrawalStore=useWithdrawalStore()

const pendingWithdrawals = computed(() => {
  // فیلتر کردن درخواست‌های در انتظار
  return withdrawalStore.withdrawals.filter(w => w.status === 'pending')
})

const processingWithdrawals = computed(() => {
  // فیلتر کردن درخواست‌های در حال پردازش
  return withdrawalStore.withdrawals.filter(w => w.status === 'processing')
})

const completedWithdrawals = computed(() => {
  // فیلتر کردن درخواست‌های کامل شده
  return withdrawalStore.withdrawals.filter(w => w.status === 'completed')
})

// --- Filtered Lists (Applied to UI) ---
const filteredPending = computed(() => {
  return pendingWithdrawals.value.filter(w => {
    if (filters.value.search && !w.name.includes(filters.value.search)) return false
    if (filters.value.type && w.type !== filters.value.type) return false
    if (filters.value.bank && w.bank !== filters.value.bank) return false
    return true
  })
})

const filteredProcessing = computed(() => {
  return processingWithdrawals.value.filter(w => {
    if (filters.value.search && !w.name.includes(filters.value.search)) return false
    if (filters.value.type && w.type !== filters.value.type) return false
    if (filters.value.bank && w.bank !== filters.value.bank) return false
    return true
  })
})
const toEnglishDigits = (str) => {
  return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
}
const normalizeDate = (dateStr) => {
  if (!dateStr) return ''

  // تبدیل اعداد فارسی به انگلیسی
  let d = toEnglishDigits(dateStr)

  const parts = d.split('/')

  if (parts.length !== 3) return d

  const year = parts[0]
  const month = parts[1].padStart(2, '0')
  const day = parts[2].padStart(2, '0')

  return `${year}/${month}/${day}`
}
const filteredCompleted = computed(() => {
  return completedWithdrawals.value.filter(w => {

    if (filters.value.search && !w.name.includes(filters.value.search))
      return false

    if (filters.value.type && w.type !== filters.value.type)
      return false

    if (filters.value.bank && w.bank !== filters.value.bank)
      return false

    if (filters.value.date) {
      const filterDate = normalizeDate(filters.value.date)
      const itemDate = normalizeDate(w.date)

      if (filterDate !== itemDate)
        return false
    }

    return true
  })
})

const getTypeLabel = (type) => ({
  vet: 'دامپزشک',
  market: 'فروشگاه',
  pharmacy: 'داروخانه',
  clinic: 'کلینیک'
}[type] || type)

const getTypeStyle = (type) => ({
  vet: { bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'ti ti-stethoscope', badge: 'bg-emerald-100 text-emerald-700' },
  market: { bg: 'bg-orange-100', color: 'text-orange-600', icon: 'ti ti-building-store', badge: 'bg-orange-100 text-orange-700' },
  pharmacy: { bg: 'bg-teal-100', color: 'text-teal-600', icon: 'ti ti-pill', badge: 'bg-teal-100 text-teal-700' },
  clinic: { bg: 'bg-rose-100', color: 'text-rose-600', icon: 'ti ti-building-hospital', badge: 'bg-rose-100 text-rose-700' }
}[type] || { bg: 'bg-gray-100', color: 'text-gray-600', icon: 'ti ti-user', badge: 'bg-gray-100 text-gray-700' })

// --- توابع کمکی (Helper Functions) ---

// تولید تاریخ شمسی امروز
const getCurrentPersianDate = () => {
  return new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// --- توابع اصلی ---
const confirmWithdrawalApprove = async () => {
  if (!withdrawalTrackId.value.trim() || !withdrawalDate.value.trim()) return

  // فراخوانی اکشن استور با پارامترهای جدید
  await withdrawalStore.approveWithdrawal(
      itemToAction.value.id,
      withdrawalTrackId.value,
      withdrawalDate.value,
      'completed'
  );
  completedWithdrawals.value = completedWithdrawals.value.filter(w => w.id !== itemToAction.value.id);

  completedWithdrawals.value.push({
    ...itemToAction.value,
    status: 'completed',
    approvedDate: withdrawalDate.value,
    trackId: withdrawalTrackId.value
  });
  showWithdrawalApproveModal.value = false
}

const markAsPaid = (item) => {
  itemToAction.value = item // ذخیره آیتم جاری
  showWithdrawalApproveModal.value = true
  // مقداردهی اولیه تاریخ با تاریخ امروز
  withdrawalDate.value = getCurrentPersianDate()
  withdrawalTrackId.value = ''
}

const rejectWithdrawal = async (item) => {
  if (confirm('آیا از رد این درخواست اطمینان دارید؟')) {

    await withdrawalStore.rejectWithdrawal(item.id, 'rejectionReason');

    pendingWithdrawals.value = pendingWithdrawals.value.filter(w => w.id !== item.id);
  }
};

const approveWithdrawal = async (item) => {

  await withdrawalStore.approveWithdrawal(
      item.id,null,null,
      'processing'
  );

  // انتقال از لیست در حال پردازش به تکمیل شده
  processingWithdrawals.value = processingWithdrawals.value.filter(w => w.id !== item.id);

  processingWithdrawals.value.unshift({...item});
};

// Export to Excel
const exportToExcel = () => {
  // Determine which data to export based on active tab
  let data = []
  let filename = ''

  if (activeTab.value === 'pending') {
    filename = 'درخواست‌های-در-انتظار-تایید'
    data = pendingWithdrawals.value.map(item => ({
      'نام': item.name,
      'نوع': getTypeLabel(item.type),
      'مبلغ (تومان)': item.amount,
      'بانک': item.bank,
      'شماره کارت': item.cardNumber,
      'شماره شبا': item.iban,
      'موجودی قابل برداشت': item.availableBalance,
      'تاریخ درخواست': item.requestDate
    }))
  } else if (activeTab.value === 'processing') {
    filename = 'درخواست‌های-در-حال-پردازش'
    data = processingWithdrawals.value.map(item => ({
      'نام': item.name,
      'نوع': getTypeLabel(item.type),
      'مبلغ (تومان)': item.amount,
      'بانک': item.bank,
      'شماره کارت': item.cardNumber,
      'تاریخ تایید': item.approvedDate
    }))
  } else {
    filename = 'تراکنش‌های-پرداخت-شده'
    data = completedWithdrawals.value.map(item => ({
      'نام': item.name,
      'نوع': getTypeLabel(item.type),
      'مبلغ (تومان)': item.amount,
      'بانک': item.bank,
      'تاریخ پرداخت': item.date,
      'کد پیگیری': item.trackingCode
    }))
  }

  if (data.length === 0) {
    alert('داده‌ای برای خروجی وجود ندارد')
    return
  }

  // Create CSV content
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        let val = row[h]
        // Handle numbers and strings with commas
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          val = `"${val.replace(/"/g, '""')}"`
        }
        return val
      }).join(',')
    )
  ].join('\n')

  // Add BOM for UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  // Download
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${new Date().toLocaleDateString('fa-IR')}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>
