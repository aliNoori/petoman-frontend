<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white">
    <!-- Success Animation Container -->
    <div class="container mx-auto px-4 py-8 md:py-16">
      <div class="max-w-lg mx-auto">

        <!-- Success Card -->
        <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 text-center">

          <!-- Success Icon with Animation -->
          <div class="relative mb-6">
            <div
                class="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
              <div
                  class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <i class="ti ti-check text-4xl text-white"></i>
              </div>
            </div>
            <!-- Confetti dots -->
            <div class="absolute top-0 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div class="absolute top-4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
            <div class="absolute bottom-0 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-200"></div>
          </div>

          <!-- Success Message -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">سفارش شما ثبت شد!</h1>
          <p class="text-gray-500 mb-6">با تشکر از خرید شما، سفارشتان با موفقیت ثبت شد و در حال پردازش است.</p>

          <!-- Order Info Card -->
          <div class="bg-gray-50 rounded-2xl p-4 mb-6">
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <span class="text-gray-500 text-sm">کد پیگیری</span>
              <span class="font-bold text-lg text-blue-600 font-mono" dir="ltr">{{ orderCode }}</span>
            </div>
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <span class="text-gray-500 text-sm">تاریخ ثبت</span>
              <span class="font-medium text-gray-900">{{ orderDate }}</span>
            </div>
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <span class="text-gray-500 text-sm">مبلغ پرداختی</span>
              <span class="font-bold text-green-600">{{ formatPrice(orderAmount) }} تومان</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 text-sm">وضعیت پرداخت</span>
              <span
                  class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                <i class="ti ti-check text-sm"></i>
                موفق
              </span>
            </div>
          </div>

          <!-- Payment Reference -->
          <div class="bg-blue-50 rounded-xl p-4 mb-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <i class="ti ti-receipt text-blue-500"></i>
              <span class="text-sm text-blue-700 font-medium">شماره پیگیری بانکی</span>
            </div>
            <p class="text-lg font-bold text-blue-800 font-mono" dir="ltr">{{ paymentRef }}</p>
          </div>

          <!-- Delivery Info -->
          <div class="bg-amber-50 rounded-xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="ti ti-truck text-amber-600 text-xl"></i>
              </div>
              <div class="text-right">
                <p class="font-medium text-amber-800">زمان تحویل تخمینی</p>
                <p class="text-sm text-amber-600">{{ formatDate(deliveryDate) }} - {{ deliveryTime }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <NuxtLink
                to="/profile"
                class="w-full py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-user text-xl"></i>
              پروفایل من
            </NuxtLink>

            <NuxtLink
                to="/"
                class="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-home text-xl"></i>
              بازگشت به صفحه اصلی
            </NuxtLink>
          </div>

          <!-- Share Order -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <p class="text-sm text-gray-500 mb-3">اشتراک‌گذاری سفارش</p>
            <div class="flex items-center justify-center gap-3">
              <button
                  class="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-200 transition-colors">
                <i class="ti ti-brand-whatsapp text-xl"></i>
              </button>
              <button
                  class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
                <i class="ti ti-brand-telegram text-xl"></i>
              </button>
              <button @click="copyOrderLink"
                      class="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <i class="ti ti-copy text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            در صورت هرگونه سؤال با پشتیبانی تماس بگیرید
          </p>
          <a href="tel:02191001234" class="text-blue-600 font-medium text-sm mt-1 inline-flex items-center gap-1">
            <i class="ti ti-phone"></i>
            ۰۲۱-۹۱۰۰۱۲۳۴
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const route = useRoute()

// Order Data from query params
const orderCode = ref('')
const orderDate = ref('')
const orderAmount = ref(0)
const paymentRef = ref('')
const deliveryDate = ref('')
const deliveryTime = ref('')

onMounted(() => {
  // Get data from query params or localStorage
  const query = route.query

  orderCode.value = query.code || localStorage.getItem('lastOrderCode') || 'PM-' + Math.floor(Math.random() * 100000)
  orderAmount.value = parseInt(query.amount) || parseInt(localStorage.getItem('lastOrderAmount')) || 0
  paymentRef.value = query.ref || localStorage.getItem('lastPaymentRef') || Math.floor(Math.random() * 9000000000 + 1000000000).toString()
  deliveryDate.value = query.deliveryDate || localStorage.getItem('lastDeliveryDate') || 'فردا'
  deliveryTime.value = query.deliveryTime || localStorage.getItem('lastDeliveryTime') || 'ساعت ۹ تا ۱۲'

  // Set current date
  const now = new Date()
  orderDate.value = now.toLocaleDateString('fa-IR') + ' - ' + now.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Clear localStorage after reading
  localStorage.removeItem('lastOrderCode')
  localStorage.removeItem('lastOrderAmount')
  localStorage.removeItem('lastPaymentRef')
  localStorage.removeItem('lastDeliveryDate')
  localStorage.removeItem('lastDeliveryTime')
})

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fa-IR')
}

// Copy order link
const copyOrderLink = () => {
  const text = `کد پیگیری سفارش: ${orderCode.value}`
  navigator.clipboard.writeText(text)
  alert('کد سفارش کپی شد')
}
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}
</style>
