<template>
  <div class="min-h-screen flex items-center justify-center bg-green-50">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      <div class="text-green-600 text-6xl mb-4">✔</div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        پرداخت با موفقیت انجام شد
      </h1>

      <p class="text-gray-600 mb-6">
        از حمایت شما سپاسگزاریم 🌱
      </p>

      <div class="bg-gray-100 rounded-lg p-4 text-sm text-right mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-500">شماره سفارش:</span>
          <span class="font-medium">{{ orderId }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">کد رهگیری:</span>
          <span class="font-medium">{{ refId }}</span>
        </div>
      </div>

      <button
          @click="goHome"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
      >
        بازگشت به صفحه اصلی
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = route.query.order as string || '-'
const refId = route.query.ref as string || '-'

const goHome = () => {
  router.push('/')
}
</script>