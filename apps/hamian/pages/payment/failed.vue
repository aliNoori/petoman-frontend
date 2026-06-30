<template>
  <div class="min-h-screen flex items-center justify-center bg-red-50">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      <div class="text-red-600 text-6xl mb-4">✖</div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        پرداخت ناموفق بود
      </h1>

      <p class="text-gray-600 mb-6">
        متأسفانه پرداخت شما انجام نشد 😔
      </p>

      <div
          v-if="orderId"
          class="bg-gray-100 rounded-lg p-4 text-sm text-right mb-6"
      >
        <div class="flex justify-between">
          <span class="text-gray-500">شماره سفارش:</span>
          <span class="font-medium">{{ orderId }}</span>
        </div>
      </div>

      <div
          v-if="error"
          class="text-sm text-red-600 mb-4"
      >
        کد خطا: {{ error }}
      </div>

      <div class="flex gap-3">
        <button
            @click="goHome"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition"
        >
          صفحه اصلی
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = route.query.order as string || '-'
const error = route.query.error as string ||'-'

const goHome = () => {
  router.push('/')
}
</script>