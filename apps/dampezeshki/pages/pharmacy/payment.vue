<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
              <i class="ti ti-arrow-right text-lg"></i>
              <span class="font-medium">بازگشت</span>
            </button>
            <div class="w-px h-6 bg-gray-200"></div>
            <h1 class="text-2xl font-bold text-gray-900">پرداخت</h1>
          </div>

          <!-- Progress Steps -->
          <div class="hidden md:flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">
                <i class="ti ti-check"></i>
              </div>
              <span class="text-emerald-600 font-medium">اطلاعات و آدرس</span>
            </div>
            <div class="w-12 h-px bg-emerald-500"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span class="text-sky-600 font-medium">پرداخت</span>
            </div>
            <div class="w-12 h-px bg-gray-200"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span class="text-gray-500">تأیید</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Payment Methods -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Payment Options -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-credit-card text-sky-500"></i>
              روش پرداخت
            </h2>

            <div class="space-y-4">
              <!-- Online Payment -->
              <!-- Payment Method Option: Online -->
              <label class="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                     :class="paymentMethod === 'online' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'">

                <!-- Radio Button -->
                <input v-model="paymentMethod" type="radio" value="online" class="text-sky-500 w-5 h-5 mt-1 md:mt-0">

                <!-- Icon and Title Section -->
                <div class="flex items-center gap-3 w-full md:w-auto">
                  <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-world text-white text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">پرداخت آنلاین</div>
                    <div class="text-sm text-gray-600">پرداخت امن از طریق درگاه بانکی</div>
                  </div>
                </div>

                <!-- Banks Info Section -->
                <!-- تغییرات: اضافه شدن md:mr-auto برای چسبیدن به چپ در دسکتاپ -->
                <div class="md:mr-auto w-full">
                  <div class="flex flex-wrap items-center gap-2">
                    <div class="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-xs text-blue-600 font-medium">ملت</div>
                    <div class="flex items-center gap-1 px-2 py-1 bg-green-100 rounded text-xs text-green-600 font-medium">پارسیان</div>
                    <div class="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded text-xs text-purple-600 font-medium">سامان</div>
                    <span class="text-xs text-gray-500">و سایر بانک‌ها</span>
                  </div>
                </div>
              </label>

              <!-- Card Payment -->
              <label class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                     :class="paymentMethod === 'card' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'">
                <input v-model="paymentMethod" type="radio" value="card" class="text-sky-500">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <i class="ti ti-credit-card text-white text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">کارت به کارت</div>
                    <div class="text-sm text-gray-600">انتقال وجه مستقیم به حساب</div>
                  </div>
                </div>
              </label>

              <!-- Wallet Payment -->
              <label class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                     :class="paymentMethod === 'wallet' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'">
                <input v-model="paymentMethod" type="radio" value="wallet" class="text-sky-500">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i class="ti ti-wallet text-white text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">کیف پول</div>
                    <div class="text-sm text-gray-600">پرداخت از موجودی حساب</div>
                  </div>
                </div>
                <div class="mr-auto text-left">
                  <div class="text-sm text-gray-500">موجودی:</div>
                  <div class="font-bold text-violet-600">{{ formatPrice(walletBalance) }} تومان</div>
                </div>
              </label>

              <!-- Cash on Delivery -->
              <label class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                     :class="paymentMethod === 'cod' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'">
                <input v-model="paymentMethod" type="radio" value="cod" class="text-sky-500">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <i class="ti ti-cash text-white text-xl"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">پرداخت در محل</div>
                    <div class="text-sm text-gray-600">پرداخت نقدی هنگام تحویل</div>
                  </div>
                </div>
                <div class="mr-auto">
                  <span class="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">+ ۱۰,۰۰۰ تومان</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Card Details (if card payment selected) -->
          <div v-if="paymentMethod === 'card'" class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات حساب</h3>
            <div class="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-6 text-white mb-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm opacity-80">شماره حساب</div>
                  <div class="text-xl font-mono">{{ defaultCard.cardNumber }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm opacity-80">بانک</div>
                  <div class="font-bold">{{ defaultCard.bankName }}</div>
                </div>
              </div>
              <div class="mt-4">
                <div class="text-sm opacity-80">نام صاحب حساب</div>
                <div class="font-bold">{{ pharmacyData.ownerName }}</div>
              </div>
            </div>

            <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex gap-3">
                <i class="ti ti-info-circle text-amber-500 text-xl flex-shrink-0 mt-0.5"></i>
                <div class="text-sm text-amber-800">
                  <p class="font-medium mb-1">راهنمای پرداخت:</p>
                  <ol class="list-decimal list-inside space-y-1">
                    <li>مبلغ {{ formatPrice(finalTotal) }} تومان را به حساب بالا واریز کنید</li>
                    <li>شماره پیگیری تراکنش را در کادر زیر وارد کنید</li>
                    <li>دکمه "تأیید پرداخت" را بزنید</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">شماره پیگیری تراکنش</label>
              <input v-model="transactionId" type="text"
                     class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                     placeholder="شماره پیگیری تراکنش خود را وارد کنید">
            </div>
          </div>

          <!-- COD Info -->
          <div v-if="paymentMethod === 'cod'" class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4">توضیحات پرداخت در محل</h3>
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex gap-3">
                <i class="ti ti-info-circle text-amber-500 text-xl flex-shrink-0 mt-0.5"></i>
                <div class="text-sm text-amber-800">
                  <ul class="space-y-1">
                    <li>• مبلغ {{ formatPrice(finalTotal) }} تومان در زمان تحویل پرداخت خواهد شد</li>
                    <li>• امکان پرداخت نقد یا با کارت در دستگاه پوز</li>
                    <li>• هزینه اضافی {{codFee.toLocaleString()}} تومان برای این سرویس</li>
                    <li>• لطفاً مبلغ نقد آماده داشته باشید</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Info Review -->
          <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-user-check text-sky-500"></i>
              اطلاعات سفارش
            </h3>

            <div class="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">

              <!-- Name -->
              <div class="flex flex-wrap items-baseline gap-x-2">
                <span class="text-gray-600 text-sm">نام و نام خانوادگی:</span>
                <span class="font-medium text-gray-900 text-sm">{{ customerInfo.firstName }} {{ customerInfo.lastName }}</span>
              </div>

              <!-- Phone -->
              <div class="flex flex-wrap items-baseline gap-x-2">
                <span class="text-gray-600 text-sm">شماره تماس:</span>
                <span class="font-medium text-gray-900 text-sm">{{ customerInfo.phone }}</span>
              </div>

              <!-- Address (Full Width on Mobile if needed, or half width on Desktop) -->
              <div class="md:col-span-2">
                <div class="flex flex-wrap items-baseline gap-x-2">
                  <span class="text-gray-600 text-sm">آدرس تحویل:</span>
                  <span class="font-medium text-gray-900 text-sm break-words">{{ fullAddress }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-receipt text-sky-500"></i>
              صورتحساب نهایی
            </h2>

            <!-- Cart Items -->
            <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
              <div v-for="item in orderSummary.items" :key="item.id" class="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" alt="product">
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 text-sm">{{ item.name }}</h4>
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span>{{ formatPrice(item.price) }} × {{ item.quantity }}</span>
                    <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>جمع محصولات:</span>
                <span>{{ formatPrice(orderSummary.subtotal) }} تومان</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>هزینه ارسال:</span>
                <span>{{ formatPrice(orderSummary.deliveryFee) }} تومان</span>
              </div>
              <div v-if="paymentMethod === 'cod'" class="flex justify-between text-amber-600">
                <span>هزینه پرداخت در محل:</span>
                <span>{{ formatPrice(codFee) }} تومان</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-bold text-gray-900">
                  <span>مبلغ نهایی:</span>
                  <span class="text-sky-600">{{ formatPrice(finalTotal) }} تومان</span>
                </div>
              </div>
            </div>

            <!-- Payment Button -->
            <button @click="processPayment" :disabled="!canProceed"
                    class="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors mb-4">
              <span v-if="isProcessing">
                <i class="ti ti-loader animate-spin ml-2"></i>
                در حال پردازش...
              </span>
              <span v-else>
                {{ paymentButtonText }}
              </span>
            </button>

            <div class="space-y-2">
              <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
                <i class="ti ti-shield-check text-emerald-500"></i>
                <span>پرداخت ۱۰۰٪ امن و محافظت شده</span>
              </div>
              <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
                <i class="ti ti-truck text-sky-500"></i>
                <span>ارسال سریع در سراسر کشور</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useWalletStore} from "~/stores/wallet.store";
import {useBankStore} from "~/stores/bank";
import {useTenantStore} from "~/stores/tenant.store";

const router = useRouter()
const { showInfo, showError, showSuccess } = useNotification()
const tenantStore=useTenantStore()
const walletStore=useWalletStore()
const walletBalance = computed(()=>walletStore.wallet.balance)
const bankStore=useBankStore()
const defaultCard=computed(()=>bankStore.card)
const {$toast}=useNuxtApp()

// Payment state
const paymentMethod = ref('online')
const transactionId = ref('')
const isProcessing = ref(false)
const pharmacyData = ref(null);
// Load saved data
const customerInfo = ref({})
const orderSummary = ref({})

// Constants
const codFee = 10000

onMounted(async () => {
  // Load customer info and order summary from localStorage
  const savedForm = localStorage.getItem('checkoutForm')
  const savedOrder = localStorage.getItem('orderSummary')

  if (savedForm) {
    customerInfo.value = JSON.parse(savedForm)
  }
  if (savedOrder) {
    orderSummary.value = JSON.parse(savedOrder)
  }

  // Redirect if no data
  if (!savedForm || !savedOrder) {
    router.push('/pharmacy/checkout')
  }

  const savedCart = localStorage.getItem('pharmacyCart');
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      // دریافت اطلاعات داروخانه از استور یا LocalStorage
      // فرض بر این است که pharmacyId در سبد خرید ذخیره شده است
      const pharmacyId = parsedCart.pharmacyId;

      if (pharmacyId) {
        await bankStore.fetchDefaultCardTenant(pharmacyId)

        const fullPharmacyData = tenantStore.getTenantById(pharmacyId);

        // روش دوم: اگر فقط آی‌دی را داریم و باید از سرور بگیریم (اگر استور خالی بود)
        // const fullPharmacyData = await $fetch(`/api/tenants/${pharmacyId}`);

        if (fullPharmacyData) {
          pharmacyData.value = fullPharmacyData;
        }

        // روش اول: اگر استور تمام تننت‌ها را دارد
      }
    } catch (e) {
      console.error('Error loading cart or pharmacy:', e);
    }
  }
})

const pharmacyCard = computed(() => {

});

// Computed values
const finalTotal = computed(() => {
  const base = orderSummary.value.total || 0
  return paymentMethod.value === 'cod' ? base + codFee : base
})

// بررسی کافی بودن موجودی کیف پول
const isWalletSufficient = computed(() => {
  return walletBalance.value >= finalTotal.value
})

const fullAddress = computed(() => {
  const info = customerInfo.value
  //return `${info.city}، ${info.address}، کدپستی: ${info.postalCode}`
  return customerInfo.value?.address?.display_name
})


const canProceed = computed(() => {
  if (paymentMethod.value === 'card') {
    return transactionId.value.length > 0
  }
  if (paymentMethod.value === 'wallet') {
    return isWalletSufficient.value
  }
  return true
})

const paymentButtonText = computed(() => {
  switch (paymentMethod.value) {
    case 'online':
      return 'انتقال به درگاه پرداخت'
    case 'card':
      return 'تأیید پرداخت'
    case 'cod':
      return 'ثبت نهایی سفارش'
    case 'wallet':
      return 'پرداخت از کیف پول'
    default:
      return 'ادامه'
  }
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}
import {usePaymentStore} from "~/stores/payment";
import{onMounted} from "vue";

const paymentStore = usePaymentStore()
const processPayment = async () => {
  if (!canProceed.value) {
    showError('لطفاً اطلاعات مورد نیاز را تکمیل کنید', 'خطا')
    return
  }

  isProcessing.value = true

  try {
    // --- ۱. دریافت اطلاعات از LocalStorage ---
    const savedForm = JSON.parse(localStorage.getItem('checkoutForm') || '{}')
    const savedCart = JSON.parse(localStorage.getItem('pharmacyCart') || '{}')

    // شناسه آدرس (اگر در فرم ذخیره شده باشد)
    const addressId = savedForm.selectedAddressId || savedForm.addressId || null

    // شناسه فروشنده/داروخانه
    const sellerId = savedCart.pharmacyId || null

    // --- ۲. ساخت Payload مطابق DTO جدید ---
    const orderPayload = {
      // فیلدهای اختیاری (اگر مقدار ندارند null بفرستید تا خطای Validation نداشته باشید)
      addressId: addressId,
      sellerId: sellerId,

      // اطلاعات زمان تحویل (اگر از مرحله قبل پاس داده نشده، مقدار پیش‌فرض بگذارید)
      deliveryDate: orderSummary.value.deliveryDate || {
        date: new Date().toISOString().split('T')[0], // تاریخ امروز
        dateLabel: 'امروز',
        dateNum: '1',
        dayName: 'امروز',
        isFriday: false,
        monthName: 'اسفند',
        weekDay: 'شنبه'
      },

      deliveryTimeSlot: orderSummary.value.deliveryTimeSlot || {
        id: 1,
        time: 'سریع‌ترین زمان ممکن',
        price: 0,
        available: true
      },

      shippingMethod: orderSummary.value.deliveryMethod || 'standard',
      //shippingCost: orderSummary.value.deliveryFee || 0,
      codFee: paymentMethod.value==='cod'?codFee : 0,
      paymentMethod: paymentMethod.value, // 'wallet', 'online', 'cash', 'card','cod'

      // لیست آیتم‌ها
      items: orderSummary.value.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        shopId: sellerId,
        productId: item.id
      })),

      discountCode: null, // یا کد تخفیف اگر دارید
      notes: savedForm.notes || '',

      // --- فیلدهای جدید اضافه شده ---

      // اطلاعات مشتری (مطابق CustomerInfoDto)
      customerInfo: {
        firstName: savedForm.firstName || '',
        lastName: savedForm.lastName || '',
        phone: savedForm.phone || '',
        email: savedForm.email || null
      },

      // شماره پیگیری (فقط برای کارت به کارت پر می‌شود)
      transactionId: paymentMethod.value === 'card' ? transactionId.value : null
    }

    const response = await paymentStore.submitPharmacyOrder(orderPayload);

    if (response.data.actionType==='ORDER_COMPLETED') {
      $toast(response.message, 'success', 5000);

      const encodedCustomerInfo = encodeURIComponent(JSON.stringify(response.data.customerInfo));
      const encodedItems = encodeURIComponent(JSON.stringify(response.data.items));

      await router.push({
        path: '/pharmacy/order-success',
        query: {
          orderId:response.data.orderId,
          code: response.data.orderCode,
          ref: response.data.ref,
          amount: response.data.amount,
          deliveryDate: response.data.deliveryDate,
          deliveryTime: response.data.deliveryTime,
          customerInfo:encodedCustomerInfo,
          items:encodedItems
        }
      });
      return;
    }

    // الف) پرداخت آنلاین
    if (response.data.requiresAction && response.data.actionType === 'ONLINE_PAYMENT_REDIRECT') {

      const { orderId, amount, tenantId } = response.data.data;

      const gatewayResponse = await paymentStore.initiatePharmacyOnlinePayment({
        orderId: orderId,
        amount: amount,
        tenantId: tenantId,
        meta: { description: `پرداخت سفارش شماره ${orderId}` }
      });

      if (gatewayResponse.paymentUrl) {

        $toast('هدایت به درگاه بانکی', 'success', 5000);

        // --- ۳. پاکسازی ---
        localStorage.removeItem('checkoutForm')
        localStorage.removeItem('orderSummary')

        window.location.href = gatewayResponse.paymentUrl;
      }  else {

        $toast('خطا در دریافت لینک درگاه بانکی', 'error', 5000);
      }
    }else {

      $toast('خطا در برقراری ارتباط با سرور. لطفاً مجددا تلاش کنید.', 'error', 5000);
    }

    // --- ۳. پاکسازی ---
    localStorage.removeItem('checkoutForm')
    localStorage.removeItem('orderSummary')

  } catch (err) {
    let errorMessage = 'خطایی رخ داد و ثبت سفارش انجام نشد.';

    // 1. بررسی وضعیت (Status Code)
    const status = err.response?.status;
    const responseData = err.response?.data;

    if (status === 400 && Array.isArray(responseData.message)) {
      // اگر خطا 400 بود و پیام‌ها آرایه باشند
      errorMessage = responseData.message.join(' | ');

    }else if (status === 400) {
      errorMessage = responseData.message;
    } else if (status === 401) {
      errorMessage = 'شناسایی نشد. لطفا وارد حساب کاربری شوید.';
    } else if (status === 403) {
      errorMessage = 'دسترسی غیرمجاز است.';
    } else if (status >= 500) {
      errorMessage = 'خطا در سرور رخ داده است. لطفا بعدا تلاش کنید.';
    } else {
      // خطای عمومی یا شبکه
      errorMessage = err.message || 'ارتباط با سرور برقرار نشد.';
    }
    $toast(errorMessage, 'warning', 5000,status);
  }
}

// SEO
useHead({
  title: 'پرداخت | پتومن',
  meta: [
    { name: 'description', content: 'پرداخت امن سفارش محصولات دامپزشکی' }
  ]
})
</script>