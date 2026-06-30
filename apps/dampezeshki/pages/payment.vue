<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from "~/stores/order.store";
import { useAppointmentStore } from "~/stores/appointment.store";
import { usePaymentStore } from "~/stores/payment";
import { useNuxtApp } from 'nuxt/app';
import {type AxiosInstance} from "axios";

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();
const {$axios} = useNuxtApp()
const axios = $axios as AxiosInstance
// استورها
const orderStore = useOrderStore();
const appointmentStore = useAppointmentStore();
const paymentStore = usePaymentStore();

// وضعیت‌ها
const isLoading = ref(true);
const isProcessing = ref(false);
const error = ref<string | null>(null);
const expireTime = ref<number>(300); // 5 دقیقه
let timer: number | null = null;

// داده‌های محلی
const orderData = ref<any>(null);
const appointmentData = ref<any>(null);
const doctorName = ref<string>('دکتر');
const clinicName = ref<string>('کلینیک');
const specialty = ref<string>('دامپزشک');

// پارامترهای URL
const orderId = computed(() => route.query.orderId as string);
const appointmentId = computed(() => route.query.appointmentId as string);
const tenantId = computed(() => route.query.tenantId as string);

// فرمت مبلغ
const formatPrice = (price: number | string) => {
  if (!price) return '۰';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fa-IR').format(num);
};

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    if (!orderId.value || !appointmentId.value) {
      throw new Error('شناسه سفارش یا نوبت در لینک موجود نیست.');
    }

    // Load Orders
    if (orderStore.orders.length === 0) {
      await orderStore.fetchUserOrders();
    }
    let foundOrder = orderStore.orders.find((o: any) => o.id === orderId.value);
    if (!foundOrder) {
      const res = await axios.get(`/orders/${orderId.value}/me`);
      foundOrder = res.data;
    }
    if (!foundOrder) throw new Error('سفارش مورد نظر یافت نشد.');
    orderData.value = foundOrder;

    // Load Appointments
    if (appointmentStore.appointments.length === 0) {
      await appointmentStore.fetchAppointments();
    }
    let foundAppointment = appointmentStore.appointments.find((a: any) => a.id === appointmentId.value);

    if (foundAppointment) {
      appointmentData.value = foundAppointment;
      if (foundAppointment.tenant) {
        doctorName.value = foundAppointment.tenant.fullName || 'دکتر';
        clinicName.value = foundAppointment.tenant.name || 'کلینیک';
        specialty.value = foundAppointment.tenant.specialty || 'متخصص';
      }
    } else {
      const res = await axios.get(`/user/tenants/appointments/${appointmentId.value}/me`);
      foundAppointment = res.data;
      appointmentData.value = foundAppointment;
      if (res.data.tenant) {
        doctorName.value = res.data.tenant.fullName || 'دکتر';
        clinicName.value = res.data.tenant.name || 'کلینیک';
        specialty.value = res.data.tenant.specialty || 'متخصص';
      }
    }
    if (!foundAppointment) throw new Error('نوبت مورد نظر یافت نشد.');

    // Check Payment Status
    if (orderData.value.payment?.status === 'PAID') {
      $toast('پرداخت شما قبلاً انجام شده است.', 'warning', 5000);
      await router.push(`/vet/${appointmentData.value?.consultation.id}`);
      return;
    }

    // Start Timer only if not paid
    startTimer();

  } catch (err: any) {
    console.error('Error loading payment page:', err);
    error.value = err.message || 'خطایی رخ داده است.';
    $toast(error.value, 'warning', 5000);
  } finally {
    isLoading.value = false;
  }
};

const handlePay = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    // Unwrap Vue refs and Deep Clone to avoid Axios circular JSON errors
    const orderIdValue = orderId.value;
    const tenantIdValue = tenantId.value;
    const orderDataCopy = JSON.parse(JSON.stringify(orderData.value));

    const paymentPayload = {
      orderId: orderIdValue,
      amount: orderDataCopy.totalAmount,
      tenantId: tenantIdValue,
      meta: {
        description: `پرداخت نوبت ${clinicName.value}`
      }
    };

    const gatewayResponse = await paymentStore.initiateVetOnlinePayment(paymentPayload);

    if (gatewayResponse.paymentUrl) {
      window.location.href = gatewayResponse.paymentUrl;
    } else {
      $toast('خطا در دریافت لینک درگاه بانکی', 'error');
    }
  } catch (error) {
    console.error("Payment error:", error);
    $toast('خطا در پردازش پرداخت رخ داد.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const startTimer = () => {
  timer = window.setInterval(() => {
    if (expireTime.value > 0) {
      expireTime.value--;
    } else {
      clearInterval(timer!);
      $toast('لینک پرداخت منقضی شد.', 'warning', 5000);
      router.push('/appointments');
    }
  }, 1000);
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// محاسبه درصد تایمر برای نوار پیشرفت
const progressPercentage = computed(() => {
  return ((expireTime.value / 300) * 100).toFixed(0);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8" dir="rtl">
    <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

      <!-- Header -->
      <div class="bg-gradient-to-l from-indigo-600 to-indigo-700 px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">تکمیل پرداخت</h2>
            <p class="text-indigo-100 text-sm mt-1">امن و سریع</p>
          </div>
          <div class="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-16 flex flex-col items-center justify-center space-y-4">
        <div class="relative">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div class="absolute inset-0 rounded-full border-2 border-indigo-200 opacity-30"></div>
        </div>
        <p class="text-slate-500 font-medium text-sm animate-pulse">در حال بارگذاری اطلاعات...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-10 text-center space-y-4">
        <div class="mx-auto h-16 w-16 text-red-100 bg-red-50 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-800">خطا در بارگذاری</h3>
          <p class="text-sm text-slate-500 mt-2 leading-relaxed">{{ error }}</p>
        </div>
        <button @click="router.push('/appointments')" class="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition-colors duration-200">
          بازگشت به نوبت‌ها
        </button>
      </div>

      <!-- Content -->
      <div v-else class="p-8 space-y-8">

        <!-- Doctor Info -->
        <div class="flex items-start gap-4">
          <div class="relative">
            <div class="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img v-if="appointmentData?.tenant?.avatar" :src="appointmentData.tenant.avatar" alt="Doctor" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center text-slate-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
            <div class="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">{{ specialty }}</p>
            <h3 class="text-lg font-bold text-slate-800 mt-1 truncate">{{ doctorName }}</h3>
            <p class="text-sm text-slate-500 truncate">{{ clinicName }}</p>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 text-sm">نوع نوبت</span>
            <span class="text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-200">
              {{ appointmentData?.type === 'online' ? 'آنلاین' :
                appointmentData?.type === 'urgent-consult' ? 'فوری' :
                    appointmentData?.type === 'phone' ? 'تلفنی' : 'حضوری' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 text-sm">تاریخ</span>
            <span class="text-sm font-medium text-slate-700">{{ appointmentData?.appointmentDate || 'لحظه‌ای' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 text-sm">کد پیگیری</span>
            <span class="text-sm font-mono font-bold text-slate-800 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-200" dir="ltr">
              {{ orderData?.orderCode || orderId }}
            </span>
          </div>
        </div>

        <!-- Price Section -->
        <div class="space-y-3">
          <div class="flex justify-between items-end border-b border-slate-100 pb-4">
            <span class="text-slate-500 font-medium">مبلغ قابل پرداخت</span>
            <div class="text-left">
              <span class="text-3xl font-extrabold text-slate-800 tracking-tight">{{ formatPrice(orderData?.totalAmount) }}</span>
              <span class="text-sm text-slate-500 mr-1">تومان</span>
            </div>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            <svg class="inline w-3 h-3 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            پرداخت امن از طریق درگاه بانکی. پس از پرداخت موفق، لینک ویزیت برای شما ارسال می‌شود.
          </p>
        </div>

        <!-- Action Area -->
        <div class="space-y-4 pt-2">
          <button
              @click="handlePay"
              :disabled="isProcessing"
              class="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform active:scale-[0.98]"
          >
            <svg v-if="!isProcessing" class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'در حال انتقال به درگاه...' : 'پرداخت و شروع ویزیت' }}
          </button>

          <!-- Timer with Progress Bar -->
          <div v-if="!isProcessing && expireTime > 0" class="bg-red-50 rounded-xl p-3 border border-red-100">
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center text-red-600 text-xs font-bold">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                منقضی شدن در: <span class="mr-1 font-mono">{{ expireTime }} ثانیه</span>
              </div>
              <span class="text-xs text-red-500 font-medium">{{ progressPercentage }}%</span>
            </div>
            <div class="w-full bg-red-200 rounded-full h-1.5 overflow-hidden">
              <div
                  class="bg-red-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                  :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>