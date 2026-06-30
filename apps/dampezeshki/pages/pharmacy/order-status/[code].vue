<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/pharmacy" class="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
              <i class="ti ti-arrow-right text-lg"></i>
              <span class="font-medium">بازگشت به داروخانه‌ها</span>
            </NuxtLink>
          </div>
          <div class="text-sm text-gray-500">
            کد پیگیری: <span class="font-mono font-bold text-gray-900">{{ orderCode }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">

      <!-- Error/Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <i class="ti ti-loader-2 animate-spin text-4xl text-purple-500"></i>
      </div>

      <div v-else-if="orderData" class="space-y-6">

        <!-- Success/Info Message -->
        <div v-if="isNewOrder" class="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <i class="ti ti-check text-2xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-green-800 mb-1">سفارش شما با موفقیت ثبت شد</h2>
              <p class="text-green-700 text-sm">سفارش شما در سیستم ثبت شد. مراحل زیر را دنبال کنید.</p>
            </div>
          </div>
        </div>

        <!-- Cancellation Message -->
        <div v-if="isCancelled" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
              <i class="ti ti-x-circle text-2xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-red-800 mb-1">سفارش لغو شد</h2>
              <p class="text-red-700 text-sm">{{ orderData.note || 'این سفارش توسط شما یا داروخانه لغو شده است.' }}</p>
            </div>
          </div>
        </div>

        <!-- Order Status Timeline -->
        <div class="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="ti ti-timeline-event text-purple-500"></i>
            وضعیت سفارش
          </h3>

          <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <!-- Timeline Steps -->
            <div class="space-y-8">
              <!-- Step 1: Order Submitted -->
              <div class="relative flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-full flex items-center justify-center z-10"
                    :class="getStepClass(0)"
                >
                  <i v-if="getStepStatus(0) === 'completed'" class="ti ti-file-check text-xl"></i>
                  <i v-else-if="getStepStatus(0) === 'cancelled'" class="ti ti-x-circle text-xl"></i>
                  <span v-else class="font-bold">1</span>
                </div>
                <div class="flex-1 pb-8">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold" :class="getStepTextClass(0)">ثبت سفارش</h4>
                    <span v-if="getStepStatus(0) !== 'pending'" class="text-xs text-gray-500">{{ formatDate(orderData.createdAt) }}</span>
                  </div>
                  <p class="text-sm mt-1" :class="getStepTextClass(0)">سفارش شما با موفقیت ثبت شد</p>
                </div>
              </div>

              <!-- Step 2: Payment/Confirmation -->
              <div class="relative flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-full flex items-center justify-center z-10"
                    :class="getStepClass(1)"
                >
                  <i v-if="getStepStatus(1) === 'completed'" class="ti ti-credit-card text-xl"></i>
                  <i v-else-if="getStepStatus(1) === 'current'" class="ti ti-loader animate-spin text-xl"></i>
                  <span v-else class="font-bold">2</span>
                </div>
                <div class="flex-1 pb-8">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold" :class="getStepTextClass(1)">پرداخت / تأیید</h4>
                    <span v-if="getStepStatus(1) === 'completed'" class="text-xs text-gray-500">{{ formatDate(getPaymentDate()) }}</span>
                  </div>
                  <p class="text-sm mt-1" :class="getStepTextClass(1)">
                    {{ getStepStatus(1) === 'completed' ? 'پرداخت انجام و سفارش تأیید شد' : 'در انتظار پرداخت یا تأیید' }}
                  </p>
                </div>
              </div>

              <!-- Step 3: Preparing -->
              <div class="relative flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-full flex items-center justify-center z-10"
                    :class="getStepClass(2)"
                >
                  <i v-if="getStepStatus(2) === 'completed'" class="ti ti-package-check text-xl"></i>
                  <i v-else-if="getStepStatus(2) === 'current'" class="ti ti-loader animate-spin text-xl"></i>
                  <span v-else class="font-bold">3</span>
                </div>
                <div class="flex-1 pb-8">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold" :class="getStepTextClass(2)">در حال آماده‌سازی</h4>
                    <span v-if="getStepStatus(2) === 'completed'" class="text-xs text-gray-500">{{ formatDate(orderData.updatedAt) }}</span>
                  </div>
                  <p class="text-sm mt-1" :class="getStepTextClass(2)">
                    {{ getStepStatus(2) === 'current' ? 'سفارش شما در حال بسته‌بندی است' : 'سفارش توسط داروخانه آماده می‌شود' }}
                  </p>
                </div>
              </div>

              <!-- Step 4: Shipping -->
              <div class="relative flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-full flex items-center justify-center z-10"
                    :class="getStepClass(3)"
                >
                  <i v-if="getStepStatus(3) === 'completed'" class="ti ti-truck-delivery text-xl"></i>
                  <i v-else-if="getStepStatus(3) === 'current'" class="ti ti-loader animate-spin text-xl"></i>
                  <span v-else class="font-bold">4</span>
                </div>
                <div class="flex-1 pb-8">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold" :class="getStepTextClass(3)">در حال ارسال</h4>
                    <span v-if="getStepStatus(3) === 'completed'" class="text-xs text-gray-500">{{ formatDate(orderData.updatedAt) }}</span>
                  </div>
                  <p class="text-sm mt-1" :class="getStepTextClass(3)">
                    {{ getStepStatus(3) === 'current' ? 'پیک در حال ارسال سفارش شماست' : 'سفارش به باربری تحویل داده شد' }}
                  </p>

                  <!-- Tracking Info -->
                  <div v-if="getStepStatus(3) === 'current' || getStepStatus(3) === 'completed'"
                       class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2 text-blue-700">
                        <i class="ti ti-map-pin"></i>
                        <span class="text-sm">وضعیت ارسال:</span>
                      </div>
                      <span class="font-mono font-bold text-blue-800">
                        {{ orderData.metadata?.shippingMethod || 'در حال بررسی' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 5: Delivered -->
              <div class="relative flex items-start gap-4">
                <div
                    class="w-12 h-12 rounded-full flex items-center justify-center z-10"
                    :class="getStepClass(4)"
                >
                  <i v-if="getStepStatus(4) === 'completed'" class="ti ti-circle-check text-xl"></i>
                  <span v-else class="font-bold">5</span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold" :class="getStepTextClass(4)">تحویل داده شد</h4>
                    <span v-if="getStepStatus(4) === 'completed'" class="text-xs text-gray-500">{{ formatDate(orderData.updatedAt) }}</span>
                  </div>
                  <p class="text-sm mt-1" :class="getStepTextClass(4)">
                    {{ getStepStatus(4) === 'completed' ? 'سفارش شما با موفقیت تحویل داده شد' : 'در انتظار تحویل' }}
                  </p>

                  <!-- Rate Order (Only if Delivered) -->
                  <div v-if="getStepStatus(4) === 'completed'" class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h5 class="font-medium text-amber-800 mb-3 flex items-center gap-2">
                      <i class="ti ti-star"></i>
                      <span>نظر شما چیست؟</span>
                    </h5>
                    <div class="flex items-center gap-2 mb-3">
                      <button
                          v-for="star in 5"
                          :key="star"
                          @click="rating = star"
                          class="text-2xl transition-colors"
                          :class="star <= rating ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'"
                      >
                        <i class="ti ti-star-filled"></i>
                      </button>
                    </div>
                    <textarea
                        v-model="reviewText"
                        rows="2"
                        class="w-full p-3 border border-amber-200 rounded-lg resize-none focus:border-amber-400 outline-none"
                        placeholder="نظر خود را بنویسید..."
                    ></textarea>
                    <button
                        @click="submitReview"
                        class="mt-3 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
                    >
                      ثبت نظر
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="ti ti-file-description text-purple-500"></i>
            جزئیات سفارش
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-700 mb-2">نوع سفارش</h4>
              <div
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                  :class="orderData.type === 'PRESCRIPTION' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'"
              >
                <i :class="orderData.type === 'PRESCRIPTION' ? 'ti ti-file-certificate' : 'ti ti-pill'"></i>
                <span class="font-medium">{{ orderData.type === 'PRESCRIPTION' ? 'با نسخه پزشک' : 'بدون نسخه' }}</span>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-700 mb-2">داروخانه</h4>
              <div class="flex items-center gap-2">
                <i class="ti ti-building-hospital text-gray-400"></i>
                <span class="text-gray-900">{{ tenantName || 'نامشخص' }}</span>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-700 mb-2">تاریخ ثبت</h4>
              <div class="flex items-center gap-2">
                <i class="ti ti-calendar text-gray-400"></i>
                <span class="text-gray-900">{{ formatDate(orderData.createdAt) }}</span>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-700 mb-2">گیرنده</h4>
              <div class="flex items-center gap-2">
                <i class="ti ti-user text-gray-400"></i>
                <span class="text-gray-900">{{ customerName }}</span>
              </div>
            </div>
          </div>

          <!-- Medicines/Items List -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="font-medium text-gray-700 mb-3">اقلام سفارش</h4>
            <div class="space-y-3">
              <div
                  v-for="item in orderData.items"
                  :key="item.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden">
                    <img
                        v-if="item.pharmacyMedicine?.medicine?.image"
                        :src="item.pharmacyMedicine?.medicine?.image"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                    />
                    <i v-else class="ti ti-pill text-2xl text-gray-300"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">{{ item.pharmacyMedicine?.medicine?.name }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ item.pharmacyMedicine?.medicine?.categoryBreadcrumb }}
                    </div>
                  </div>
                </div>
                <div class="text-left">
                  <div class="font-bold text-gray-900">{{ formatPrice(item.price) }} <span class="text-xs font-normal text-gray-500">تومان</span></div>
                  <div class="text-xs text-gray-500">تعداد: {{ item.quantity }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="font-medium text-gray-700 mb-3">آدرس تحویل</h4>
            <div class="flex items-start gap-2 text-gray-600">
              <i class="ti ti-map-pin text-gray-400 mt-1"></i>
              <span>{{ fullAddress }}</span>
            </div>
          </div>
        </div>

        <!-- Support -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900 mb-1">سؤالی دارید؟</h3>
              <p class="text-sm text-gray-600">با پشتیبانی تماس بگیرید</p>
            </div>
            <a
                href="tel:02112345678"
                class="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
            >
              <i class="ti ti-phone"></i>
              <span>تماس با پشتیبانی</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ti ti-search-off text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">سفارش یافت نشد</h3>
        <p class="text-gray-600">لطفاً کد پیگیری را بررسی کنید یا با پشتیبانی تماس بگیرید.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '~/stores/order.store';
import { OrderStatus } from '~/stores/order.store';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

// State
const orderData = ref(null);
const loading = ref(true);
const rating = ref(0);
const reviewText = ref('');

// Computed Properties
const orderId = computed(() => route.params.code || route.query.orderId);
const orderCode = computed(() => route.query.orderCode || orderData.value?.orderCode || orderId.value);
const isNewOrder = computed(() => route.query.new === 'true');
const isCancelled = computed(() => orderData.value?.status === OrderStatus.CUSTOMER_CANCELLED);

const customerName = computed(() => {
  if (!orderData.value) return '';
  const info = orderData.value.metadata?.customerInfo || {};
  return `${info.firstName || ''} ${info.lastName || ''}`.trim() || 'کاربر';
});

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

const tenantName = computed(() => {
  if (!orderData.value) return '';
  return orderData.value.tenant?.ownerName || orderData.value.tenant?.name || 'داروخانه';
});


// Methods
const formatPrice = (price) => {
  if (!price) return '۰';
  return new Intl.NumberFormat('fa-IR').format(price);
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getPaymentDate = () => {
  if (orderData.value?.transaction) return orderData.value.transaction.createdAt;
  if (orderData.value?.payment) return orderData.value.payment.createdAt;
  return orderData.value?.updatedAt;
};

// --- Core Logic for Steps ---

const getStepStatus = (stepNumber) => {
  if (!orderData.value) return 'pending';
  const status = orderData.value.status;

  if (status === OrderStatus.CUSTOMER_CANCELLED) {
    return stepNumber === 0 ? 'completed' : 'cancelled';
  }
  if (status === OrderStatus.CUSTOMER_DELIVERED) {
    return 'completed';
  }
  if (status === OrderStatus.TENANT_SHIPPED) {
    if (stepNumber <= 3) return 'completed';
    if (stepNumber === 4) return 'pending';
  }
  if (status === OrderStatus.TENANT_PROCESSING) {
    if (stepNumber === 2) return 'current';
    if (stepNumber < 2) return 'completed';
    if (stepNumber > 2) return 'pending';
  }
  if (status === OrderStatus.CUSTOMER_PAID) {
    if (stepNumber <= 1) return 'completed';
    if (stepNumber === 2) return 'current';
    if (stepNumber > 2) return 'pending';
  }
  if (status === OrderStatus.CUSTOMER_PENDING) {
    if (stepNumber === 0) return 'completed';
    if (stepNumber === 1) return 'current';
    return 'pending';
  }
  return 'pending';
};

const getStepClass = (stepNumber) => {
  const status = getStepStatus(stepNumber);
  if (status === 'completed') return 'bg-emerald-500 text-white';
  if (status === 'current') return 'bg-purple-500 text-white';
  if (status === 'cancelled') return 'bg-red-500 text-white';
  return 'bg-gray-200 text-gray-400';
};

const getStepTextClass = (stepNumber) => {
  const status = getStepStatus(stepNumber);
  if (status === 'current') return 'text-purple-600 font-bold';
  if (status === 'completed') return 'text-gray-900';
  if (status === 'cancelled') return 'text-red-600';
  return 'text-gray-400';
};

const handleImageError = (e) => {
  e.target.src = '/placeholder.png';
};

const submitReview = () => {
  if (rating.value === 0) return;
  // Logic to submit review
  alert('نظر شما ثبت شد');
};

// Fetch Data
onMounted(async () => {
  try {
    if (orderId.value) {
      await orderStore.fetchUserOrders(); // Load list first if needed
      await orderStore.fetchOrderById(orderId.value);

      orderData.value = orderStore.orders.find(o => o.id === orderId.value) || null;
    }
  } catch (error) {
    console.error("Failed to fetch order:", error);
  } finally {
    loading.value = false;
  }
});

useHead({
  title: `پیگیری سفارش ${orderCode.value} | داروخانه پتومن`
});
</script>