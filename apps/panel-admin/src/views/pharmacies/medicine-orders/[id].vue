<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900">جزئیات سفارش دارو</h2>
          <p class="text-sm text-gray-500 mt-1">کد سفارش: {{ order?.code }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl p-12 text-center">
      <i class="ti ti-loader animate-spin text-4xl text-gray-400 mb-2"></i>
      <p class="text-sm text-gray-500">در حال بارگذاری...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!order" class="bg-white rounded-2xl p-12 text-center">
      <i class="ti ti-alert-circle text-4xl text-red-500 mb-2"></i>
      <p class="text-sm text-gray-600">سفارش مورد نظر یافت نشد</p>
    </div>

    <!-- Order Details -->
    <div v-else class="space-y-4">
      <!-- وضعیت سفارش -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('status')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
              <i class="ti ti-info-circle text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">وضعیت سفارش</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform" 
             :class="openSections.status ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.status" class="p-5 pt-0 space-y-4 border-t border-gray-100">
          <div class="flex items-center justify-between p-4 rounded-xl" :class="getStatusBgClass(order.status)">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="getStatusIconBgClass(order.status)">
                <i class="text-2xl" :class="getStatusIcon(order.status)"></i>
              </div>
              <div>
                <p class="text-sm font-medium" :class="getStatusTextClass(order.status)">{{ getStatusLabel(order.status) }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ order.date }} - {{ order.time }}</p>
              </div>
            </div>
            <span 
              class="px-4 py-2 rounded-xl text-sm font-bold"
              :class="getStatusBadgeClass(order.status)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <!-- نوار پیشرفت -->
          <div class="relative pt-4">
            <div class="flex justify-between mb-2">
              <span class="text-xs font-medium text-gray-600">پیشرفت سفارش</span>
              <span class="text-xs font-medium text-teal-600">{{ getStatusProgress(order.status) }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                :style="{ width: getStatusProgress(order.status) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- اطلاعات حیوان و صاحب -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('owner')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <i class="ti ti-user text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">اطلاعات صاحب حیوان</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.owner ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.owner" class="p-5 pt-0 space-y-3 border-t border-gray-100">
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-user text-blue-600 text-xl"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-900">{{ order.owner }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <i class="ti ti-phone text-gray-400"></i>
                <span class="font-english">{{ order.phone }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <i class="ti ti-paw text-purple-600 text-xl"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-900">{{ order.pet.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs px-2 py-1 bg-white rounded-lg text-gray-600">{{ order.pet.species }}</span>
                <span class="text-xs px-2 py-1 bg-white rounded-lg text-gray-600">{{ order.pet.breed }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- اطلاعات دارو -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('medicine')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <i class="ti ti-pill text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">اطلاعات دارو</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.medicine ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.medicine" class="p-5 pt-0 space-y-3 border-t border-gray-100">
          <!-- نسخه پزشک -->
          <div v-if="order.hasPrescription" class="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <i class="ti ti-file-description text-amber-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-gray-900 mb-1">نسخه پزشک ضمیمه شده</p>
                <p class="text-xs text-gray-600 mb-3">این سفارش دارای نسخه پزشک می‌باشد</p>
                <button @click="downloadPrescription" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                  <i class="ti ti-download"></i>
                  دانلود نسخه
                </button>
              </div>
            </div>
          </div>

          <!-- لیست داروها اضافه شده -->
          <div v-if="medicines.length > 0" class="space-y-2">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-bold text-gray-900">داروهای اضافه شده:</p>
              <span class="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-lg">{{ medicines.length }} قلم</span>
            </div>
            <div 
              v-for="(med, index) in medicines" 
              :key="index"
              class="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"
            >
              <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <i class="ti ti-pill text-green-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900">{{ med.name }}</p>
                <div class="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                  <div class="flex items-center gap-1">
                    <i class="ti ti-box text-gray-400"></i>
                    <span>تعداد: {{ med.quantity }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="ti ti-currency-toman text-gray-400"></i>
                    <span>قیمت: {{ formatMoney(med.price) }}</span>
                  </div>
                </div>
                <p v-if="med.instructions" class="text-xs text-gray-600 mt-2 p-2 bg-white rounded-lg">{{ med.instructions }}</p>
              </div>
              <button 
                v-if="order.status === 'processing'"
                @click="removeMedicine(index)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>

          <!-- فرم افزودن دارو (فقط برای سفارشات در حال پردازش) -->
          <div v-if="order.status === 'processing'" class="border-t border-gray-200 pt-4 space-y-3">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <i class="ti ti-plus text-teal-600"></i>
              </div>
              <p class="text-sm font-bold text-gray-900">افزودن دارو به سفارش</p>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">نام دارو *</label>
                <input
                  v-model="newMedicine.name"
                  type="text"
                  placeholder="نام دارو را وارد کنید"
                  class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">تعداد *</label>
                  <input
                    v-model.number="newMedicine.quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">قیمت (تومان) *</label>
                  <input
                    v-model="newMedicine.price"
                    @input="formatNewMedicinePrice"
                    type="text"
                    placeholder="0"
                    class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">دستورالعمل مصرف</label>
                <textarea
                  v-model="newMedicine.instructions"
                  rows="2"
                  placeholder="نحوه مصرف دارو..."
                  class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button
                @click="addMedicine"
                class="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <i class="ti ti-plus"></i>
                افزودن دارو
              </button>
            </div>
          </div>

          <!-- دکمه ارسال به مشتری -->
          <div v-if="order.status === 'processing' && medicines.length > 0" class="border-t border-gray-200 pt-4">
            <button
              @click="sendToCustomer"
              class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <i class="ti ti-send"></i>
              ارسال به مشتری برای تایید ({{ formatMoney(calculateTotal()) }} تومان)
            </button>
          </div>
        </div>
      </div>

      <!-- اطلاعات مالی -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('payment')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <i class="ti ti-currency-toman text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">اطلاعات مالی</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.payment ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.payment" class="p-5 pt-0 space-y-3 border-t border-gray-100">
          <div class="space-y-2">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">قیمت دارو</span>
              <span class="text-sm font-bold text-gray-900 font-english">{{ formatMoney(order.amount) }} تومان</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">هزینه ارسال</span>
              <span class="text-sm font-bold text-gray-900 font-english">{{ formatMoney(order.deliveryFee || 0) }} تومان</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
              <span class="text-sm font-bold text-gray-900">مبلغ نهایی</span>
              <span class="text-base font-bold text-teal-600 font-english">{{ formatMoney(order.totalAmount) }} تومان</span>
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 rounded-xl" :class="order.isPaid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="order.isPaid ? 'bg-green-100' : 'bg-red-100'">
              <i class="text-xl" :class="order.isPaid ? 'ti ti-check text-green-600' : 'ti ti-x text-red-600'"></i>
            </div>
            <div>
              <p class="text-sm font-bold" :class="order.isPaid ? 'text-green-900' : 'text-red-900'">
                {{ order.isPaid ? 'پرداخت شده' : 'پرداخت نشده' }}
              </p>
              <p class="text-xs text-gray-600 mt-1">{{ order.paymentMethod || 'آنلاین' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- آدرس تحویل -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('address')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
              <i class="ti ti-map-pin text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">آدرس تحویل</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.address ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.address" class="p-5 pt-0 border-t border-gray-100">
          <div class="p-4 bg-red-50 rounded-xl">
            <div class="flex items-start gap-3">
              <i class="ti ti-map-pin text-red-600 text-xl flex-shrink-0 mt-1"></i>
              <p class="text-sm text-gray-700 leading-relaxed">{{ order.address || 'آدرس تحویل ثبت نشده است' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- یادداشت ها -->
      <div v-if="order.notes" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          type="button"
          @click="toggleSection('notes')"
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <i class="ti ti-note text-white text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900">یادداشت ها</h3>
          </div>
          <i class="ti text-xl text-gray-400 transition-transform"
             :class="openSections.notes ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
        </button>
        
        <div v-show="openSections.notes" class="p-5 pt-0 border-t border-gray-100">
          <div class="p-4 bg-amber-50 rounded-xl">
            <p class="text-sm text-gray-700 leading-relaxed">{{ order.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <button
          @click="downloadReceipt"
          v-if="order.isPaid"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <i class="ti ti-receipt"></i>
          دانلود رسید
        </button>
        <button
          @click="contactCustomer"
          class="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <i class="ti ti-phone"></i>
          تماس با مشتری
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()
const loading = ref(true)
const order = ref(null)
const medicines = ref([])

const newMedicine = ref({
  name: '',
  quantity: 1,
  price: '',
  instructions: ''
})

const openSections = ref({
  status: true,
  owner: true,
  medicine: true,
  payment: false,
  address: false,
  notes: false
})

const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section]
}

// Mock data - در نسخه واقعی از API دریافت می‌شود
const mockOrders = [
  {
    id: 1,
    code: 'MED-2024-001',
    owner: 'علی محمدی',
    phone: '09123456789',
    pet: {
      name: 'ماکس',
      species: 'سگ',
      breed: 'ژرمن شپرد'
    },
    amount: 0,
    deliveryFee: 30000,
    totalAmount: 0,
    status: 'processing',
    date: '1403/08/05',
    time: '14:30',
    isPaid: false,
    paymentMethod: 'پرداخت آنلاین',
    hasPrescription: true,
    address: 'تهران، خیابان ولیعصر، کوچه شهید فلاحی، پلاک 25، واحد 3',
    notes: 'لطفاً دارو را در جعبه اصلی و با بسته بندی مناسب ارسال کنید',
    medicines: [] // سفارش در حال پردازش - باید داروخانه داروها رو اضافه کنه
  },
  {
    id: 2,
    code: 'MED-2024-002',
    owner: 'مریم رضایی',
    phone: '09122334455',
    pet: {
      name: 'میمی',
      species: 'گربه',
      breed: 'پرشین'
    },
    amount: 180000,
    deliveryFee: 25000,
    totalAmount: 205000,
    status: 'delivered',
    date: '1403/08/04',
    time: '10:15',
    isPaid: true,
    paymentMethod: 'پرداخت آنلاین',
    hasPrescription: false,
    address: 'تهران، میدان آزادی، خیابان استقلال، پلاک 10',
    medicines: [
      {
        name: 'قطره گوش',
        quantity: 1,
        price: 180000,
        instructions: '3 قطره در هر گوش، دو بار در روز'
      }
    ]
  },
  {
    id: 3,
    code: 'MED-2024-003',
    owner: 'حسین احمدی',
    phone: '09121112233',
    pet: {
      name: 'رکس',
      species: 'سگ',
      breed: 'بولداگ'
    },
    amount: 0,
    deliveryFee: 35000,
    totalAmount: 0,
    status: 'processing',
    date: '1403/08/06',
    time: '09:15',
    isPaid: false,
    paymentMethod: 'پرداخت آنلاین',
    hasPrescription: true,
    address: 'تهران، خیابان انقلاب، کوچه دانشگاه، پلاک 15',
    notes: 'سفارش فوری - لطفاً در اسرع وقت پردازش شود',
    medicines: []
  }
]

onMounted(() => {
  loadOrder()
})

const loadOrder = () => {
  try {
    const orderId = route.params.id
    
    // اول از store بخون
    const storeOrder = ordersStore.getOrderById(orderId)
    
    if (storeOrder) {
      // تبدیل فرمت store به فرمت این صفحه
      order.value = {
        id: storeOrder.id,
        code: storeOrder.code,
        owner: storeOrder.owner,
        phone: storeOrder.phone,
        pet: {
          name: storeOrder.pet || 'نامشخص',
          species: storeOrder.petType || 'نامشخص',
          breed: ''
        },
        amount: storeOrder.total || 0,
        deliveryFee: storeOrder.shipping || 30000,
        totalAmount: storeOrder.total || 0,
        status: storeOrder.status,
        date: storeOrder.date,
        time: '',
        isPaid: storeOrder.isPaid,
        paymentMethod: 'پرداخت آنلاین',
        hasPrescription: storeOrder.hasPrescription,
        address: storeOrder.address,
        notes: storeOrder.notes || '',
        medicines: storeOrder.medicines || []
      }
      
      if (order.value.medicines && order.value.medicines.length > 0) {
        medicines.value = [...order.value.medicines]
      }
    } else {
      // اگه در store نبود از mock data بخون
      const mockOrder = mockOrders.find(o => o.id === parseInt(orderId))
      order.value = mockOrder || null
      
      if (order.value?.medicines && order.value.medicines.length > 0) {
        medicines.value = [...order.value.medicines]
      }
    }
    
    // Calculate total if not set
    if (order.value && !order.value.totalAmount && order.value.amount) {
      order.value.totalAmount = order.value.amount + (order.value.deliveryFee || 0)
    }
  } catch (error) {
    console.error('Error loading order:', error)
  } finally {
    loading.value = false
  }
}

const formatMoney = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('fa-IR').format(value)
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'در انتظار',
    'processing': 'در حال پردازش',
    'waiting-customer': 'در انتظار تایید مشتری',
    'ready': 'آماده تحویل',
    'delivered': 'تحویل شده',
    'rejected': 'رد شده'
  }
  return labels[status] || status
}

const getStatusIcon = (status) => {
  const icons = {
    'pending': 'ti ti-clock text-orange-600',
    'processing': 'ti ti-package text-blue-600',
    'waiting-customer': 'ti ti-user-check text-purple-600',
    'ready': 'ti ti-truck text-teal-600',
    'delivered': 'ti ti-check text-green-600',
    'rejected': 'ti ti-x text-red-600'
  }
  return icons[status] || 'ti ti-info-circle text-gray-600'
}

const getStatusBgClass = (status) => {
  const classes = {
    'pending': 'bg-orange-50',
    'processing': 'bg-blue-50',
    'waiting-customer': 'bg-purple-50',
    'ready': 'bg-teal-50',
    'delivered': 'bg-green-50',
    'rejected': 'bg-red-50'
  }
  return classes[status] || 'bg-gray-50'
}

const getStatusIconBgClass = (status) => {
  const classes = {
    'pending': 'bg-orange-100',
    'processing': 'bg-blue-100',
    'waiting-customer': 'bg-purple-100',
    'ready': 'bg-teal-100',
    'delivered': 'bg-green-100',
    'rejected': 'bg-red-100'
  }
  return classes[status] || 'bg-gray-100'
}

const getStatusTextClass = (status) => {
  const classes = {
    'pending': 'text-orange-900',
    'processing': 'text-blue-900',
    'waiting-customer': 'text-purple-900',
    'ready': 'text-teal-900',
    'delivered': 'text-green-900',
    'rejected': 'text-red-900'
  }
  return classes[status] || 'text-gray-900'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'bg-orange-600 text-white',
    'processing': 'bg-blue-600 text-white',
    'waiting-customer': 'bg-purple-600 text-white',
    'ready': 'bg-teal-600 text-white',
    'delivered': 'bg-green-600 text-white',
    'rejected': 'bg-red-600 text-white'
  }
  return classes[status] || 'bg-gray-600 text-white'
}

const getStatusProgress = (status) => {
  const progress = {
    'pending': 20,
    'processing': 40,
    'waiting-customer': 60,
    'ready': 80,
    'delivered': 100,
    'rejected': 0
  }
  return progress[status] || 0
}

const downloadPrescription = () => {
  if (!order.value?.hasPrescription) {
    alert('این سفارش نسخه پزشکی ندارد')
    return
  }
  
  // آدرس عکس نسخه - در نسخه واقعی از سرور می‌آید
  const imageUrl = order.value.prescriptionUrl || '/images/sample-prescription.jpg'
  
  // دانلود عکس
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `prescription-${order.value.code}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadReceipt = () => {
  alert('دانلود رسید در حال توسعه است')
}

const contactCustomer = () => {
  if (order.value?.phone) {
    window.location.href = `tel:${order.value.phone}`
  }
}

const formatNewMedicinePrice = (event) => {
  let value = event.target.value.replace(/,/g, '')
  if (value) {
    newMedicine.value.price = new Intl.NumberFormat('fa-IR').format(value)
  }
}

const addMedicine = () => {
  if (!newMedicine.value.name || !newMedicine.value.quantity || !newMedicine.value.price) {
    alert('لطفاً تمام فیلدهای ضروری را پر کنید')
    return
  }

  const priceValue = newMedicine.value.price.replace(/,/g, '')
  
  medicines.value.push({
    name: newMedicine.value.name,
    quantity: newMedicine.value.quantity,
    price: parseInt(priceValue),
    instructions: newMedicine.value.instructions
  })

  // Reset form
  newMedicine.value = {
    name: '',
    quantity: 1,
    price: '',
    instructions: ''
  }
}

const removeMedicine = (index) => {
  if (confirm('آیا از حذف این دارو اطمینان دارید؟')) {
    medicines.value.splice(index, 1)
  }
}

const calculateTotal = () => {
  return medicines.value.reduce((sum, med) => sum + (med.price * med.quantity), 0)
}

const sendToCustomer = () => {
  if (medicines.value.length === 0) {
    alert('لطفاً حداقل یک دارو اضافه کنید')
    return
  }

  if (confirm(`آیا از ارسال این سفارش به مشتری برای تایید اطمینان دارید؟\n\nمبلغ کل: ${formatMoney(calculateTotal())} تومان`)) {
    // Update order status
    order.value.status = 'waiting-customer'
    order.value.amount = calculateTotal()
    order.value.totalAmount = calculateTotal() + (order.value.deliveryFee || 0)
    
    // Save medicines to order
    order.value.medicines = [...medicines.value]
    
    alert('سفارش با موفقیت برای مشتری ارسال شد')
    
    // In real app, save to backend/localStorage
    // Then navigate back
    setTimeout(() => {
      router.push('/pharmacies/medicine-orders')
    }, 1000)
  }
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>
