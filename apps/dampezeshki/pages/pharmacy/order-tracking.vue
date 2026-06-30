<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-4">
          <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <i class="ti ti-arrow-right text-lg"></i>
            <span class="font-medium">بازگشت</span>
          </button>
          <div class="w-px h-6 bg-gray-200"></div>
          <h1 class="text-2xl font-bold text-gray-900">پیگیری سفارش</h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">

        <!-- Order Search (اختیاری: اگر بخواهید کاربر بتواند سفارش دیگری را هم جستجو کند) -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-search text-sky-500"></i>
            جستجوی سفارش
          </h2>
          <div class="flex gap-4">
            <div class="flex-1">
              <input v-model="searchOrderId" type="text"
                     class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                     placeholder="شماره سفارش را وارد کنید">
            </div>
            <button @click="searchOrder"
                    class="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors">
              <i class="ti ti-search ml-2"></i>
              جستجو
            </button>
          </div>
        </div>

        <!-- Order Details (if found) -->
        <div v-if="orderData" class="space-y-6">

          <!-- Order Info Header -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">سفارش #{{ orderData.orderCode }}</h2>
                <p class="text-gray-600">{{ formatDate(orderData.createdAt) }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600">وضعیت فعلی</div>
                <span class="inline-block px-4 py-2 rounded-full text-sm font-medium"
                      :class="currentStatusLabel.color">
                  {{ currentStatusLabel.text }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <i class="ti ti-package text-sky-500 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600">تعداد اقلام</div>
                  <div class="font-bold text-gray-900">{{ orderData.items?.length || 0 }} محصول</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i class="ti ti-cash text-emerald-500 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600">مبلغ کل</div>
                  <div class="font-bold text-sky-600">{{ formatPrice(orderData.totalAmount) }} تومان</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i class="ti ti-check text-emerald-500 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600">وضعیت پرداخت</div>
                  <div class="font-bold text-emerald-600">پرداخت شده</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i class="ti ti-truck text-purple-500 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-600">تحویل تا</div>
                  <div class="font-bold text-gray-900">{{ getDeliveryDate() }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tracking Timeline -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-timeline text-sky-500"></i>
              وضعیت سفارش
            </h3>

            <div class="relative">
              <!-- Timeline Line -->
              <div class="absolute right-4 top-6 w-px bg-gray-200 h-full"></div>

              <div class="space-y-8">
                <div v-for="(step, index) in trackingSteps" :key="index" class="relative flex items-start gap-4">
                  <!-- Step Circle -->
                  <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                       :class="getStepStyle(step.status)">
                    <i v-if="step.status === 'completed'" class="ti ti-check"></i>
                    <span v-else-if="step.status === 'current'" class="w-3 h-3 bg-white rounded-full"></span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>

                  <!-- Step Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="font-bold text-gray-900" :class="{ 'text-sky-600': step.status === 'current' }">
                        {{ step.title }}
                      </h4>
                      <span v-if="step.date" class="text-sm text-gray-500">{{ step.date }}</span>
                    </div>
                    <p class="text-gray-600 mt-1">{{ step.description }}</p>

                    <!-- Additional Info -->
                    <div v-if="step.details" class="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div v-for="detail in step.details" :key="detail.label" class="flex justify-between text-sm">
                        <span class="text-gray-600">{{ detail.label }}:</span>
                        <span class="font-medium text-gray-900">{{ detail.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-user text-gray-600"></i>
              اطلاعات تحویل
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">اطلاعات مشتری</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">نام:</span>
                    <span class="font-medium">{{ orderData.metadata?.customerInfo?.firstName || '' }} {{ orderData.metadata?.customerInfo?.lastName || '' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">تلفن:</span>
                    <span class="font-medium">{{ orderData.address?.[0]?.phone || orderData.metadata?.customerInfo?.phone || 'ثبت نشده' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">ایمیل:</span>
                    <span class="font-medium">{{ orderData.metadata?.customerInfo?.email || 'ثبت نشده' }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 mb-2">آدرس تحویل</h4>
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p class="text-sm text-gray-900">{{ fullAddress?.display_name }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-lg p-6 border border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-list text-gray-600"></i>
              محصولات سفارش
            </h3>

            <div class="space-y-3">
              <div v-for="item in orderData.items" :key="item.id"
                   class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                  <img :src="resolveUrl(item.marketProduct?.product?.image)"
                       class="w-full h-full object-cover"
                       @error="handleImageError">
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.name || item.marketProduct?.product?.name || 'محصول' }}</h4>
                  <p class="text-sm text-gray-600">{{ item.marketProduct?.product?.categoryBreadcrumb || 'دسته‌بندی' }}</p>
                  <div class="flex items-center gap-4 mt-1">
                    <span class="text-sm text-gray-600">قیمت واحد: {{ formatPrice(item.price) }} تومان</span>
                    <span class="text-sm text-gray-600">تعداد: {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ formatPrice(item.price * item.quantity) }} تومان</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button @click="printOrder"
                    class="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-300">
              <i class="ti ti-printer"></i>
              چاپ فاکتور
            </button>

            <button @click="contactSupport"
                    class="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-300">
              <i class="ti ti-headphones"></i>
              تماس با پشتیبانی
            </button>
          </div>
        </div>

        <!-- No Order Found -->
        <div v-else-if="searchAttempted" class="bg-white rounded-xl p-8 shadow-sm text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-search-off text-2xl text-red-500"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">سفارشی یافت نشد</h3>
          <p class="text-gray-600 mb-6">شماره سفارش وارد شده صحیح نمی‌باشد یا سفارش وجود ندارد.</p>
          <button @click="clearSearch"
                  class="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors">
            جستجوی مجدد
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '~/stores/order.store';
import { OrderStatus } from '~/stores/order.store';
import {useUrlHelper} from "~/composables/useUrlHelper";

const {resolveUrl}=useUrlHelper()
const route = useRoute();
const router = useRouter();
const { showInfo, showError } = useNotification();

// استفاده از استور
const orderStore = useOrderStore();

// Stateهای محلی
const searchOrderId = ref('');
const searchAttempted = ref(false);
const orderData = ref(null); // نام را به orderData تغییر دادم تا با تمپلیت هماهنگ شود

// محاسبه وضعیت فعلی
const currentStatusLabel = computed(() => {
  if (!orderData.value) return { text: 'نامشخص', color: 'bg-gray-100 text-gray-700' };

  const statusMap = {
    [OrderStatus.CUSTOMER_PENDING]: { text: 'در انتظار پرداخت', color: 'bg-amber-100 text-amber-700' },
    [OrderStatus.CUSTOMER_PAID]: { text: 'تأیید شده / در حال پردازش', color: 'bg-sky-100 text-sky-700' },
    [OrderStatus.TENANT_PROCESSING]: { text: 'در حال آماده‌سازی', color: 'bg-blue-100 text-blue-700' },
    [OrderStatus.TENANT_SHIPPED]: { text: 'ارسال شده', color: 'bg-purple-100 text-purple-700' },
    [OrderStatus.CUSTOMER_DELIVERED]: { text: 'تحویل داده شد', color: 'bg-emerald-100 text-emerald-700' },
    [OrderStatus.CUSTOMER_CANCELLED]: { text: 'لغو شده', color: 'bg-red-100 text-red-700' },
  };

  return statusMap[orderData.value.status] || { text: 'نامشخص', color: 'bg-gray-100 text-gray-700' };
});

// محاسبه مراحل پیگیری (Timeline)
const trackingSteps = computed(() => {
  if (!orderData.value) return [];

  const status = orderData.value.status;
  const createdAt = formatDate(orderData.value.createdAt);

  const steps = [
    { title: 'ثبت سفارش', description: 'سفارش شما در سیستم ثبت شد.', status: 'completed', date: createdAt },
    { title: 'پرداخت موفق', description: 'پرداخت با موفقیت انجام شد.', status: 'pending', date: null },
    { title: 'تأیید و آماده‌سازی', description: 'سفارش توسط انباردار بررسی و بسته‌بندی می‌شود.', status: 'pending', date: null },
    { title: 'ارسال به باربری', description: 'سفارش به شرکت حمل و نقل تحویل داده شد.', status: 'pending', date: null },
    { title: 'تحویل به مشتری', description: 'سفارش به آدرس شما تحویل داده شد.', status: 'pending', date: null }
  ];

  // منطق تغییر مراحل
  if (status === OrderStatus.CUSTOMER_CANCELLED) {
    steps[0].status = 'completed';
    steps[1].status = 'cancelled'; // یا pending
  } else if (status === OrderStatus.CUSTOMER_DELIVERED) {
    steps.forEach(s => s.status = 'completed');
  } else if (status === OrderStatus.TENANT_SHIPPED) {
    steps[0].status = 'completed';
    steps[1].status = 'completed';
    steps[2].status = 'completed';
    steps[3].status = 'current';
  } else if (status === OrderStatus.TENANT_PROCESSING) {
    steps[0].status = 'completed';
    steps[1].status = 'completed';
    steps[2].status = 'current';
  } else if (status === OrderStatus.CUSTOMER_PAID) {
    steps[0].status = 'completed';
    steps[1].status = 'completed';
    steps[2].status = 'current'; // آماده‌سازی شروع شده
  }

  return steps;
});

// بارگذاری اولیه
onMounted(async () => {
  const orderId = route.query.orderId;
  if (orderId) {
    searchOrderId.value = orderId;
    await searchOrder();
  }
});

const searchOrder = async () => {
  if (!searchOrderId.value.trim()) {
    showError('لطفاً شماره سفارش را وارد کنید', 'خطا');
    return;
  }

  try {
    // تلاش برای دریافت از API
    await orderStore.fetchOrderById(searchOrderId.value.trim());

    // پیدا کردن سفارش در لیست استور
    const order = orderStore.orders.find(o => o.id === searchOrderId.value.trim());

    if (order) {
      orderData.value = order;
      searchAttempted.value = false;
    } else {
      orderData.value = null;
      searchAttempted.value = true;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    orderData.value = null;
    searchAttempted.value = true;
  }
};

const clearSearch = () => {
  searchOrderId.value = '';
  orderData.value = null;
  searchAttempted.value = false;
};

// توابع فرمت‌دهی
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const getDeliveryDate = () => {
  if (orderData.value?.metadata?.deliveryDate) {
    return formatDate(orderData.value.metadata.deliveryDate);
  }
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return new Intl.DateTimeFormat('fa-IR', { month: 'long', day: 'numeric' }).format(d);
};

// Computed values
const fullAddress = computed(() => {
  if (!orderData.value) return 'آدرس ثبت نشده';

  // ۱. بررسی آرایه address (اگر کاربر آدرس انتخابی داشته باشد)
  // در لاگ دیدیم فیلد address یک آرایه از آبجکت‌های آدرس است
  if (orderData.value.address) {
    // فرض بر این است که اولین آدرس یا آدرسی که isDefault: true دارد انتخاب شده
    // یا اگر isDefault نداریم، اولین مورد را برمی‌گردانیم
    const selectedAddress = orderData.value.address;
    if (selectedAddress?.fullAddress) {
      return selectedAddress.fullAddress;
    }
    // اگر fullAddress نبود، اجزا را بسازیم
    return `${selectedAddress?.province}، ${selectedAddress?.city}، ${selectedAddress?.address}`;
  }

  // ۲. بررسی metadata
  const meta = orderData.value.metadata || {};
  if (meta.deliveryAddress) return meta.deliveryAddress;
  if (meta.addressText) return meta.addressText;

  // ۳. بررسی customerInfo در متادیتا
  if (meta.customerInfo) {
    const info = meta.customerInfo;
    return `${info.province || ''}، ${info.city || ''}، ${info.address || ''}`;
  }

  return 'آدرس ثبت نشده';
});

const getStepStyle = (status) => {
  if (status === 'completed') return 'bg-emerald-500 text-white';
  if (status === 'current') return 'bg-sky-500 text-white';
  if (status === 'cancelled') return 'bg-red-500 text-white';
  return 'bg-gray-200 text-gray-500';
};

const handleImageError = (e) => {
  //e.target.src = '/placeholder.png';
};

const printOrder = () => {
  if (orderData.value) {
    localStorage.setItem('printOrderData', JSON.stringify(orderData.value));
    window.open(`/pharmacy/print-invoice?orderId=${orderData.value.id}`, '_blank');
  } else {
    showError('سفارشی برای چاپ یافت نشد', 'خطا');
  }
};

const contactSupport = () => {
  showInfo('در حال انتقال به پشتیبانی...', 'اطلاع');
};

useHead({
  title: 'پیگیری سفارش | پتومن',
  meta: [
    { name: 'description', content: 'پیگیری وضعیت سفارش محصولات دامپزشکی' }
  ]
});
</script>