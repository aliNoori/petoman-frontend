<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg">
          <i class="ti ti-arrow-right text-gray-600"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">گزارش مالی {{ storeName }}</h1>
          <p class="text-gray-500 mt-1">تراکنش‌ها، تسویه‌ها و امتیازات</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-full text-sm font-medium" :class="storeTypeClass">
          <i :class="storeTypeIcon" class="ml-1"></i>
          {{ storeTypeLabel }}
        </span>
      </div>
    </div>

    <!-- Store Info Card -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl flex items-center justify-center" :class="storeIconBg">
            <i :class="[storeTypeIcon, storeIconColor, 'text-2xl']"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">{{ storeInfo.name }}</h2>
            <p class="text-sm text-gray-500">{{ storeInfo.owner }} • {{ storeInfo.city }}</p>
            <p class="text-xs text-gray-400 mt-1">عضویت: {{ storeInfo.joinDate }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="goToDashboard" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2">
            <i class="ti ti-external-link"></i>
            ورود به داشبورد
          </button>
          <button @click="requestSettlement" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <i class="ti ti-cash"></i>
            ثبت تسویه جدید
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <i class="ti ti-cash text-emerald-600"></i>
          </div>
          <span class="text-sm text-gray-500">کل فروش</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.totalSales) }}</p>
        <p class="text-xs text-gray-400 mt-1">تومان</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <i class="ti ti-wallet text-blue-600"></i>
          </div>
          <span class="text-sm text-gray-500">تسویه شده</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.settled) }}</p>
        <p class="text-xs text-gray-400 mt-1">تومان</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <i class="ti ti-clock-dollar text-amber-600"></i>
          </div>
          <span class="text-sm text-gray-500">در انتظار تسویه</span>
        </div>
        <p class="text-2xl font-bold text-amber-600">{{ formatPrice(stats.pending) }}</p>
        <p class="text-xs text-gray-400 mt-1">تومان</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <i class="ti ti-percentage text-purple-600"></i>
          </div>
          <span class="text-sm text-gray-500">کمیسیون پلتفرم</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ formatPrice(stats.commission) }}</p>
        <p class="text-xs text-gray-400 mt-1">تومان ({{ stats.commissionRate }}%)</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        :class="activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
        <span v-if="tab.count" class="px-1.5 py-0.5 rounded-full text-xs" :class="activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- تراکنش‌ها -->
    <div v-if="activeTab === 'transactions'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-bold text-gray-900">تاریخچه تراکنش‌ها</h3>
        <div class="flex items-center gap-2">
          <AppSelect
            v-model="transactionFilter"
            :options="transactionFilterOptions"
            placeholder="همه تراکنش‌ها"
            icon="ti ti-filter"
          />
        </div>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="tx in filteredTransactions" :key="tx.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-emerald-100': tx.type === 'sale',
                  'bg-red-100': tx.type === 'refund',
                  'bg-purple-100': tx.type === 'commission'
                }"
              >
                <i :class="{
                  'ti ti-shopping-cart text-emerald-600': tx.type === 'sale',
                  'ti ti-receipt-refund text-red-600': tx.type === 'refund',
                  'ti ti-percentage text-purple-600': tx.type === 'commission'
                }"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ tx.description }}</p>
                <p class="text-xs text-gray-500">{{ tx.date }} • شماره سفارش: {{ tx.orderId }}</p>
              </div>
            </div>
            <div class="text-left">
              <p 
                class="font-bold"
                :class="{
                  'text-emerald-600': tx.type === 'sale',
                  'text-red-600': tx.type === 'refund',
                  'text-purple-600': tx.type === 'commission'
                }"
              >
                {{ tx.type === 'refund' ? '-' : '+' }}{{ formatPrice(tx.amount) }}
              </p>
              <p class="text-xs text-gray-400">تومان</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredTransactions.length === 0" class="p-12 text-center">
        <i class="ti ti-receipt-off text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500">تراکنشی یافت نشد</p>
      </div>
    </div>

    <!-- تسویه‌ها -->
    <div v-if="activeTab === 'settlements'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-bold text-gray-900">تاریخچه تسویه‌ها</h3>
        <AppSelect
          v-model="settlementFilter"
          :options="settlementFilterOptions"
          placeholder="همه وضعیت‌ها"
          icon="ti ti-filter"
        />
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="settlement in filteredSettlements" :key="settlement.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-emerald-100': settlement.status === 'completed',
                  'bg-amber-100': settlement.status === 'pending',
                  'bg-red-100': settlement.status === 'rejected'
                }"
              >
                <i :class="{
                  'ti ti-check text-emerald-600': settlement.status === 'completed',
                  'ti ti-clock text-amber-600': settlement.status === 'pending',
                  'ti ti-x text-red-600': settlement.status === 'rejected'
                }"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">درخواست تسویه #{{ settlement.id }}</p>
                <p class="text-xs text-gray-500">{{ settlement.date }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ settlement.bankInfo }}</p>
              </div>
            </div>
            <div class="text-left">
              <p class="font-bold text-gray-900">{{ formatPrice(settlement.amount) }}</p>
              <span 
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-emerald-100 text-emerald-700': settlement.status === 'completed',
                  'bg-amber-100 text-amber-700': settlement.status === 'pending',
                  'bg-red-100 text-red-700': settlement.status === 'rejected'
                }"
              >
                {{ getSettlementStatusLabel(settlement.status) }}
              </span>
            </div>
          </div>
          <div v-if="settlement.status === 'pending'" class="mt-3 flex items-center gap-2 justify-end">
            <button @click="approveSettlement(settlement)" class="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
              <i class="ti ti-check ml-1"></i>
              تأیید و واریز
            </button>
            <button @click="rejectSettlement(settlement)" class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
              <i class="ti ti-x ml-1"></i>
              رد درخواست
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredSettlements.length === 0" class="p-12 text-center">
        <i class="ti ti-wallet-off text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500">تسویه‌ای یافت نشد</p>
      </div>
    </div>

    <!-- امتیازات و بازخورد -->
    <div v-if="activeTab === 'reviews'" class="space-y-4">
      <!-- Rating Summary -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="text-center">
            <div class="text-5xl font-bold text-gray-900 mb-2">{{ storeInfo.rating }}</div>
            <div class="flex items-center justify-center gap-1 mb-2">
              <i v-for="i in 5" :key="i" class="ti" :class="i <= Math.round(storeInfo.rating) ? 'ti-star-filled text-amber-400' : 'ti-star text-gray-300'"></i>
            </div>
            <p class="text-sm text-gray-500">از {{ reviews.length }} نظر</p>
          </div>
          <div class="flex-1 space-y-2">
            <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 w-6">{{ star }}</span>
              <i class="ti ti-star-filled text-amber-400 text-sm"></i>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-amber-400 rounded-full" :style="{ width: getRatingPercent(star) + '%' }"></div>
              </div>
              <span class="text-sm text-gray-500 w-10 text-left">{{ getRatingCount(star) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">نظرات کاربران</h3>
          <AppSelect
            v-model="reviewFilter"
            :options="reviewFilterOptions"
            placeholder="همه نظرات"
            icon="ti ti-star"
          />
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="review in filteredReviews" :key="review.id" class="p-4">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-600 font-bold">{{ review.userName.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ review.userName }}</p>
                  <p class="text-xs text-gray-500">{{ review.date }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <i v-for="i in 5" :key="i" class="ti text-sm" :class="i <= review.rating ? 'ti-star-filled text-amber-400' : 'ti-star text-gray-300'"></i>
              </div>
            </div>
            <p class="text-gray-600 text-sm">{{ review.comment }}</p>
            <div v-if="review.reply" class="mt-3 pr-4 border-r-2 border-gray-200">
              <p class="text-xs text-gray-500 mb-1">پاسخ فروشگاه:</p>
              <p class="text-sm text-gray-600">{{ review.reply }}</p>
            </div>
          </div>
        </div>
        <div v-if="filteredReviews.length === 0" class="p-12 text-center">
          <i class="ti ti-message-off text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">نظری یافت نشد</p>
        </div>
      </div>
    </div>

    <!-- مودال تسویه جدید -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSettlementModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showSettlementModal = false"></div>
          <div class="relative bg-white rounded-2xl w-full max-w-md p-6">
            <button @click="showSettlementModal = false" class="absolute left-4 top-4 p-1 hover:bg-gray-100 rounded-lg">
              <i class="ti ti-x text-gray-500"></i>
            </button>

            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ti ti-cash text-3xl text-emerald-600"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900">ثبت تسویه جدید</h3>
              <p class="text-gray-500 mt-1">موجودی قابل تسویه: {{ formatPrice(stats.pending) }} تومان</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">مبلغ تسویه</label>
                <input
                  v-model="settlementAmount"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="مبلغ به تومان"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره پیگیری</label>
                <input
                  v-model="settlementTrackingCode"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="شماره پیگیری بانکی"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <textarea
                  v-model="settlementNote"
                  rows="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="توضیحات اختیاری..."
                ></textarea>
              </div>

              <div class="flex gap-3 pt-2">
                <button 
                  @click="showSettlementModal = false"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button 
                  @click="submitSettlement"
                  class="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                >
                  ثبت تسویه
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50">
        <div 
          class="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
          :class="{
            'bg-green-600 text-white': toast.type === 'success',
            'bg-red-600 text-white': toast.type === 'error'
          }"
        >
          <i :class="['ti text-xl', toast.type === 'success' ? 'ti-check' : 'ti-x']"></i>
          <span class="flex-1">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppSelect from '@/components/AppSelect.vue'

const router = useRouter()
const route = useRoute()

const storeType = ref(route.query.type || 'market') // market, pharmacy, clinic
const storeId = ref(route.query.id || 1)

const activeTab = ref('transactions')
const transactionFilter = ref('')
const settlementFilter = ref('')
const reviewFilter = ref('')
const showSettlementModal = ref(false)
const settlementAmount = ref('')
const settlementTrackingCode = ref('')
const settlementNote = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

const tabs = [
  { key: 'transactions', label: 'تراکنش‌ها', icon: 'ti ti-receipt', count: 156 },
  { key: 'settlements', label: 'تسویه‌ها', icon: 'ti ti-wallet', count: 12 },
  { key: 'reviews', label: 'امتیازات', icon: 'ti ti-star', count: 48 },
]

const transactionFilterOptions = [
  { value: '', label: 'همه تراکنش‌ها' },
  { value: 'sale', label: 'فروش', icon: 'ti ti-shopping-cart' },
  { value: 'refund', label: 'بازگشت وجه', icon: 'ti ti-receipt-refund' },
  { value: 'commission', label: 'کمیسیون', icon: 'ti ti-percentage' },
]

const settlementFilterOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'completed', label: 'واریز شده', icon: 'ti ti-check' },
  { value: 'pending', label: 'در انتظار', icon: 'ti ti-clock' },
  { value: 'rejected', label: 'رد شده', icon: 'ti ti-x' },
]

const reviewFilterOptions = [
  { value: '', label: 'همه نظرات' },
  { value: '5', label: '۵ ستاره', icon: 'ti ti-star-filled' },
  { value: '4', label: '۴ ستاره', icon: 'ti ti-star-filled' },
  { value: '3', label: '۳ ستاره', icon: 'ti ti-star-filled' },
  { value: '2', label: '۲ ستاره', icon: 'ti ti-star-filled' },
  { value: '1', label: '۱ ستاره', icon: 'ti ti-star-filled' },
]

// اطلاعات فروشگاه
const storeInfo = ref({
  name: 'پت‌شاپ ستاره',
  owner: 'محمد احمدی',
  city: 'تهران',
  phone: '09123456789',
  joinDate: '۱۴۰۳/۰۹/۰۱',
  rating: 4.8,
  bankAccount: 'بانک ملت - ۶۲۷۳-****-****-۱۲۳۴',
})

// آمار مالی
const stats = ref({
  totalSales: 245890000,
  settled: 189000000,
  pending: 56890000,
  commission: 24589000,
  commissionRate: 10,
})

// تراکنش‌ها
const transactions = ref([
  { id: 1, type: 'sale', description: 'فروش غذای سگ رویال کنین', amount: 2450000, date: '۱۴۰۳/۰۹/۱۵', orderId: 'ORD-1234' },
  { id: 2, type: 'commission', description: 'کمیسیون سفارش #ORD-1234', amount: 245000, date: '۱۴۰۳/۰۹/۱۵', orderId: 'ORD-1234' },
  { id: 3, type: 'sale', description: 'فروش قلاده و بند', amount: 890000, date: '۱۴۰۳/۰۹/۱۴', orderId: 'ORD-1233' },
  { id: 4, type: 'refund', description: 'بازگشت وجه - لغو سفارش', amount: 450000, date: '۱۴۰۳/۰۹/۱۳', orderId: 'ORD-1230' },
  { id: 5, type: 'sale', description: 'فروش اسباب‌بازی گربه', amount: 340000, date: '۱۴۰۳/۰۹/۱۲', orderId: 'ORD-1229' },
  { id: 6, type: 'sale', description: 'فروش خاک گربه', amount: 560000, date: '۱۴۰۳/۰۹/۱۱', orderId: 'ORD-1228' },
])

// تسویه‌ها
const settlements = ref([
  { id: 1001, amount: 50000000, date: '۱۴۰۳/۰۹/۱۰', status: 'completed', bankInfo: 'بانک ملت - واریز ساتنا' },
  { id: 1002, amount: 35000000, date: '۱۴۰۳/۰۸/۲۵', status: 'completed', bankInfo: 'بانک ملت - واریز ساتنا' },
  { id: 1003, amount: 25000000, date: '۱۴۰۳/۰۹/۱۸', status: 'pending', bankInfo: 'در انتظار واریز' },
  { id: 1004, amount: 15000000, date: '۱۴۰۳/۰۷/۲۰', status: 'rejected', bankInfo: 'اطلاعات حساب نادرست' },
])

// نظرات
const reviews = ref([
  { id: 1, userName: 'سارا محمدی', rating: 5, date: '۱۴۰۳/۰۹/۱۵', comment: 'عالی بود، ارسال سریع و بسته‌بندی مناسب', reply: 'ممنون از اعتماد شما' },
  { id: 2, userName: 'علی رضایی', rating: 4, date: '۱۴۰۳/۰۹/۱۴', comment: 'کیفیت محصول خوب بود اما کمی دیر رسید', reply: null },
  { id: 3, userName: 'مریم احمدی', rating: 5, date: '۱۴۰۳/۰۹/۱۲', comment: 'بهترین فروشگاه برای خرید لوازم حیوانات', reply: 'سپاسگزاریم' },
  { id: 4, userName: 'حسین نوری', rating: 3, date: '۱۴۰۳/۰۹/۱۰', comment: 'قیمت‌ها کمی بالاست', reply: null },
  { id: 5, userName: 'فاطمه کریمی', rating: 5, date: '۱۴۰۳/۰۹/۰۸', comment: 'پشتیبانی عالی و پاسخگویی سریع', reply: 'خوشحالیم که رضایت داشتید' },
])

// Computed
const storeName = computed(() => storeInfo.value.name)

const storeTypeLabel = computed(() => {
  const labels = { market: 'فروشگاه', pharmacy: 'داروخانه', clinic: 'کلینیک' }
  return labels[storeType.value] || 'فروشگاه'
})

const storeTypeIcon = computed(() => {
  const icons = { market: 'ti ti-building-store', pharmacy: 'ti ti-pill', clinic: 'ti ti-building-hospital' }
  return icons[storeType.value] || 'ti ti-building-store'
})

const storeTypeClass = computed(() => {
  const classes = { 
    market: 'bg-orange-100 text-orange-700', 
    pharmacy: 'bg-teal-100 text-teal-700', 
    clinic: 'bg-rose-100 text-rose-700' 
  }
  return classes[storeType.value] || 'bg-orange-100 text-orange-700'
})

const storeIconBg = computed(() => {
  const bgs = { market: 'bg-orange-100', pharmacy: 'bg-teal-100', clinic: 'bg-rose-100' }
  return bgs[storeType.value] || 'bg-orange-100'
})

const storeIconColor = computed(() => {
  const colors = { market: 'text-orange-600', pharmacy: 'text-teal-600', clinic: 'text-rose-600' }
  return colors[storeType.value] || 'text-orange-600'
})

const filteredTransactions = computed(() => {
  if (!transactionFilter.value) return transactions.value
  return transactions.value.filter(t => t.type === transactionFilter.value)
})

const filteredSettlements = computed(() => {
  if (!settlementFilter.value) return settlements.value
  return settlements.value.filter(s => s.status === settlementFilter.value)
})

const filteredReviews = computed(() => {
  if (!reviewFilter.value) return reviews.value
  return reviews.value.filter(r => r.rating === parseInt(reviewFilter.value))
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const getSettlementStatusLabel = (status) => {
  const labels = { completed: 'واریز شده', pending: 'در انتظار', rejected: 'رد شده' }
  return labels[status] || status
}

const getRatingCount = (star) => {
  return reviews.value.filter(r => r.rating === star).length
}

const getRatingPercent = (star) => {
  const count = getRatingCount(star)
  return reviews.value.length > 0 ? (count / reviews.value.length) * 100 : 0
}

const goToDashboard = () => {
  localStorage.setItem('adminAccessTo', JSON.stringify({
    type: storeType.value,
    id: storeId.value,
    name: storeInfo.value.name,
    accessTime: new Date().toISOString()
  }))
  
  const routes = { market: '/markets', pharmacy: '/pharmacies', clinic: '/clinic' }
  window.open(routes[storeType.value] || '/markets', '_blank')
}

const requestSettlement = () => {
  settlementAmount.value = ''
  settlementTrackingCode.value = ''
  settlementNote.value = ''
  showSettlementModal.value = true
}

const submitSettlement = () => {
  if (!settlementAmount.value || !settlementTrackingCode.value) {
    showToast('لطفاً مبلغ و شماره پیگیری را وارد کنید', 'error')
    return
  }
  
  settlements.value.unshift({
    id: Date.now(),
    amount: parseInt(settlementAmount.value.replace(/,/g, '')),
    date: new Date().toLocaleDateString('fa-IR'),
    status: 'completed',
    bankInfo: `واریز با پیگیری: ${settlementTrackingCode.value}`
  })
  
  showSettlementModal.value = false
  showToast('تسویه با موفقیت ثبت شد', 'success')
}

const approveSettlement = (settlement) => {
  settlement.status = 'completed'
  showToast('تسویه تأیید و واریز شد', 'success')
}

const rejectSettlement = (settlement) => {
  settlement.status = 'rejected'
  showToast('درخواست تسویه رد شد', 'error')
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
