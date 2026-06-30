<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto">
        <!-- Success Animation -->
        <div class="text-center mb-8">
          <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="ti ti-check text-4xl text-emerald-500"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">سفارش شما با موفقیت ثبت شد!</h1>
          <p class="text-gray-600">از خرید شما متشکریم. سفارش شما در حال آماده‌سازی است.</p>
        </div>

        <!-- Order Info -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-package text-sky-500"></i>
            اطلاعات سفارش
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <i class="ti ti-hash text-sky-500"></i>
              </div>
              <div>
                <div class="text-sm text-gray-600">شماره سفارش</div>
                <div class="font-bold text-gray-900">{{ orderData?.orderCode}}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i class="ti ti-calendar text-emerald-500"></i>
              </div>
              <div>
                <div class="text-sm text-gray-600">تاریخ ثبت</div>
                <div class="font-bold text-gray-900">{{ formatDate(orderData?.createdAt) }}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <i class="ti ti-cash text-amber-500"></i>
              </div>
              <div>
                <div class="text-sm text-gray-600">مبلغ کل</div>
                <div class="font-bold text-sky-600">{{ formatPrice(orderData?.totalAmount) }} تومان</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="ti ti-credit-card text-purple-500"></i>
              </div>
              <div>
                <div class="text-sm text-gray-600">وضعیت پرداخت</div>
                <div class="font-bold text-emerald-600">پرداخت شده</div>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="border-t border-gray-100 pt-4">
            <h3 class="font-bold text-gray-900 mb-3">اطلاعات تحویل</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">نام:</span>
                  <span class="font-medium text-gray-900 mr-2">
                    {{ orderData?.metadata?.customerInfo?.firstName || '' }} {{ orderData?.metadata?.customerInfo?.lastName || '' }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-600">تلفن:</span>
                  <span class="font-medium text-gray-900 mr-2">
                    {{ orderData?.address?.[0]?.phone || orderData?.metadata?.customerInfo?.phone || 'ثبت نشده' }}
                  </span>
                </div>
                <div class="md:col-span-2">
                  <span class="text-gray-600">آدرس:</span>
                  <span class="font-medium text-gray-900 mr-2">{{ fullAddress?.display_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-list text-sky-500"></i>
            محصولات سفارش
          </h2>
          <div class="space-y-3">
            <div v-if="orderData?.items && orderData.items.length > 0">
              <div v-for="item in orderData.items" :key="item.id" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img :src="resolveUrl(item.marketProduct?.product.image)"
                       class="w-full h-full object-cover"
                       alt="product"
                       @error="handleImageError">
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.marketProduct?.product.name }}</h4>
                  <p class="text-sm text-gray-600">{{ item.marketProduct?.product.categoryBreadcrumb}}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ formatPrice(item.price) }} تومان</div>
                  <div class="text-sm text-gray-600">تعداد: {{ item.quantity }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <i class="ti ti-package text-4xl mb-2"></i>
              <p>هیچ محصولی در سفارش یافت نشد</p>
            </div>
          </div>
        </div>

        <!-- Delivery Timeline (Dynamic) -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-truck text-sky-500"></i>
            مراحل سفارش
          </h2>
          <div class="space-y-4">
            <!-- Step 1: Registered -->
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">
                <i class="ti ti-check"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">سفارش ثبت شد</div>
                <div class="text-sm text-gray-600">{{ formatDate(orderData?.createdAt) }}</div>
              </div>
            </div>

            <!-- Step 2: Paid/Confirmed -->
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm" :class="getStepStatusStyle(2).bg">
                <i v-if="getStepStatus(2) === 'completed'" class="ti ti-check text-white"></i>
                <span v-else class="text-white font-bold">{{ 2 }}</span>
              </div>
              <div class="flex-1">
                <div class="font-medium" :class="getStepStatus(2) === 'completed' ? 'text-gray-900' : 'text-gray-500'">
                  تأیید و پرداخت
                </div>
                <div class="text-sm text-gray-600">سفارش شما تأیید و در صف آماده‌سازی قرار گرفت</div>
              </div>
            </div>

            <!-- Step 3: Processing -->
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm" :class="getStepStatusStyle(3).bg">
                <i v-if="getStepStatus(3) === 'completed'" class="ti ti-check text-white"></i>
                <span v-else-if="getStepStatus(3) === 'current'" class="w-3 h-3 bg-white rounded-full"></span>
                <span v-else class="text-white font-bold">{{ 3 }}</span>
              </div>
              <div class="flex-1">
                <div class="font-medium" :class="getStepStatus(3) === 'current' ? 'text-sky-600' : (getStepStatus(3) === 'completed' ? 'text-gray-900' : 'text-gray-500')">
                  در حال آماده‌سازی
                </div>
                <div class="text-sm text-gray-600">تا ۲۴ ساعت آینده</div>
              </div>
            </div>

            <!-- Step 4: Shipped -->
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm" :class="getStepStatusStyle(4).bg">
                <i v-if="getStepStatus(4) === 'completed'" class="ti ti-check text-white"></i>
                <span v-else-if="getStepStatus(4) === 'current'" class="w-3 h-3 bg-white rounded-full"></span>
                <span v-else class="text-white font-bold">{{ 4 }}</span>
              </div>
              <div class="flex-1">
                <div class="font-medium" :class="getStepStatus(4) === 'current' ? 'text-sky-600' : 'text-gray-500'">
                  ارسال شده
                </div>
                <div class="text-sm text-gray-500">تحویل به باربری</div>
              </div>
            </div>

            <!-- Step 5: Delivered -->
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm" :class="getStepStatusStyle(5).bg">
                <i v-if="getStepStatus(5) === 'completed'" class="ti ti-check text-white"></i>
                <span v-else-if="getStepStatus(5) === 'current'" class="w-3 h-3 bg-white rounded-full"></span>
                <span v-else class="text-white font-bold">{{ 5 }}</span>
              </div>
              <div class="flex-1">
                <div class="font-medium" :class="getStepStatus(5) === 'current' ? 'text-sky-600' : 'text-gray-500'">
                  تحویل داده شد
                </div>
                <div class="text-sm text-gray-500">تخمین: {{ getDeliveryDate() }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button @click="printOrder" class="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-medium transition-colors">
            <i class="ti ti-printer"></i>
            چاپ فاکتور
          </button>
          <button @click="trackOrder" class="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-medium transition-colors">
            <i class="ti ti-map-pin"></i>
            پیگیری سفارش
          </button>
          <button @click="continueShopping" class="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-medium transition-colors">
            <i class="ti ti-shopping-cart"></i>
            ادامه خرید
          </button>
        </div>

        <!-- Support Info -->
        <div class="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 text-center">
          <h3 class="font-bold text-gray-900 mb-2">نیاز به پشتیبانی دارید؟</h3>
          <p class="text-gray-600 mb-4">تیم پشتیبانی ما آماده کمک به شماست</p>
          <div class="flex items-center justify-center gap-6">
            <a href="tel:02123456789" class="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors">
              <i class="ti ti-phone"></i>
              <span class="font-medium">۰۲۱-۲۳۴۵۶۷۸۹</span>
            </a>
            <a href="mailto:support@petoman.ir" class="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors">
              <i class="ti ti-mail"></i>
              <span class="font-medium">support@petoman.ir</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOrderStore} from "~/stores/order.store";
import { OrderStatus} from "~/stores/order.store";
import {useUrlHelper} from "~/composables/useUrlHelper";

const {resolveUrl}=useUrlHelper()
const router = useRouter();
const route = useRoute();
const { showInfo } = useNotification();
const orderStore = useOrderStore();

// State for the order
const orderData = ref(null);

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

const getStepStatus = (stepNumber) => {
  if (!orderData.value) return 'pending';

  const status = orderData.value.status;

  // حالت لغو شده: همه مراحل بعد از ثبت غیرفعال یا قرمز می‌شوند (در اینجا ساده‌سازی شده)
  if (status === OrderStatus.CUSTOMER_CANCELLED) {
    // می‌توانید منطق جداگانه برای "لغو شده" اضافه کنید
    return stepNumber === 1 ? 'completed' : 'cancelled';
  }

  // حالت تحویل داده شده: همه مراحل تکمیل شده
  if (status === OrderStatus.CUSTOMER_DELIVERED) {
    return 'completed';
  }

  // حالت ارسال شده: مراحل ۱ تا ۴ تکمیل، مرحله ۵ در انتظار
  if (status === OrderStatus.TENANT_SHIPPED) {
    if (stepNumber <= 4) return 'completed';
    if (stepNumber === 5) return 'pending';
  }

  // حالت آماده‌سازی (Processing): مرحله ۳ جاری است، ۱ و ۲ تکمیل، ۴ و ۵ در انتظار
  if (status === OrderStatus.TENANT_PROCESSING) {
    if (stepNumber === 3) return 'current'; // الان اینجا هستیم
    if (stepNumber < 3) return 'completed';  // قبلی‌ها تمام شده
    if (stepNumber > 3) return 'pending';    // بعدی‌ها هنوز نیامده
  }

  // حالت پرداخت شده (Paid): مرحله ۲ تکمیل، مرحله ۳ در انتظار (یا جاری بسته به استراتژی شما)
  // معمولاً وقتی پرداخت تایید می‌شود، مرحله آماده‌سازی شروع می‌شود.
  if (status === OrderStatus.CUSTOMER_PAID) {
    if (stepNumber <= 2) return 'completed';
    if (stepNumber === 3) return 'current'; // آماده‌سازی شروع شده
    if (stepNumber > 3) return 'pending';
  }

  // حالت در انتظار پرداخت (Pending): مرحله ۱ تکمیل، مرحله ۲ جاری
  if (status === OrderStatus.CUSTOMER_PENDING) {
    if (stepNumber === 1) return 'completed';
    if (stepNumber === 2) return 'current';
    return 'pending';
  }

  return 'pending';
};

const getStepStatusStyle = (stepNumber) => {
  const status = getStepStatus(stepNumber);
  if (status === 'completed') return { bg: 'bg-emerald-500 text-white' };
  if (status === 'current') return { bg: 'bg-sky-500 text-white' };
  return { bg: 'bg-gray-300 text-gray-600' };
};

onMounted(async () => {
  const orderId = route.query.orderId; // یا route.query.code بسته به ریدایرکت
  const refId = route.query.ref;

  if (orderId) {
    try {

      let found = orderStore.orders.find(o => o.id === orderId);

      if (!found) {
        // تلاش برای فچ کردن از API (نیاز به اضافه کردن متد در استور دارید)
        await orderStore.fetchOrderById(String(orderId));
        found = orderStore.orders.find(o => o.id === orderId);
        orderData.value = found;
      } else {
        orderData.value = found;
      }

      // اگر هنوز داده‌ای نداریم، از Query Params استفاده می‌کنیم (روش fallback)
      if (!orderData.value) {
        const queryAmount = route.query.amount;
        const queryItems = route.query.items;
        const queryCustomerInfo = route.query.customerInfo;

        let parsedItems = [];
        try { if (queryItems) parsedItems = JSON.parse(queryItems); } catch (e) {}

        let parsedCustomerInfo = {};
        try { if (queryCustomerInfo) parsedCustomerInfo = JSON.parse(queryCustomerInfo); } catch (e) {}

        const cleanItems = parsedItems.map(item => ({
          ...item,
          marketProduct: item.marketProduct || {} // برای سازگاری با تمپلیت
        }));

        orderData.value = {
          id: route.query.code || orderId,
          totalAmount: Number(queryAmount) || 0,
          status: OrderStatus.CUSTOMER_PAID, // فرض بر پرداخت موفق
          createdAt: new Date().toISOString(),
          customerInfo: parsedCustomerInfo,
          items: cleanItems,
          metadata: {
            deliveryDate: route.query.deliveryDate,
            deliveryTime: route.query.deliveryTime
          }
        };
      }

    } catch (error) {
      console.error("Error fetching order:", error);
      showInfo('خطا در بارگذاری اطلاعات سفارش', 'خطا');
    }
  } else {
    await router.push('/pharmacy');
  }
});

// Methods
const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0';
  return new Intl.NumberFormat('fa-IR').format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return 'تاریخ نامشخص';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'تاریخ نامشخص';
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return 'تاریخ نامشخص';
  }
};

const getDeliveryDate = () => {
  if (orderData.value?.metadata?.deliveryDate) {
    return orderData.value.metadata.deliveryDate + (orderData.value.metadata.deliveryTime ? `- ${orderData.value.metadata.deliveryTime}` : '');
  }
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return new Intl.DateTimeFormat('fa-IR', { month: 'long', day: 'numeric' }).format(d);
};

const handleImageError = (e) => {
  //e.target.src = '/favicon.icon'; // یک تصویر پیش‌فرض
};

const trackOrder = () => {
  if (orderData.value?.id) {
    router.push(`/pharmacy/order-tracking?orderId=${orderData.value.id}`);
  }
};

const continueShopping = () => {
  router.push('/pharmacy');
};

const printOrder = () => {
  if (orderData.value) {
    localStorage.setItem('printOrderData', JSON.stringify(orderData.value));
    window.open(`/pharmacy/print-invoice?orderId=${orderData.value.id}`, '_blank');
  }
};

useHead({
  title: 'سفارش با موفقیت ثبت شد | پتومن',
  meta: [
    { name: 'description', content: 'سفارش شما با موفقیت ثبت شد و در حال آماده‌سازی است' }
  ]
});
</script>