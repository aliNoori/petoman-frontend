<template>
  <div class="h-full flex flex-col" dir="rtl">
    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <i class="ti ti-user-circle text-2xl text-purple-600"></i>
        <div>
          <p class="text-sm text-gray-500">گفتگو با</p>
          <p class="font-bold text-gray-900">دکتر {{ doctorId }}</p>
        </div>
      </div>
      <router-link to="/users/chat" class="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">
        لیست گفتگوها
      </router-link>
    </div>

    <!-- Body -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-sm text-gray-600">صفحه چت (نمونه) برای رفع خطای import ساخته شد.</p>
      </div>
    </div>

    <!-- Composer -->
    <div class="shrink-0 bg-white border-t border-gray-200 p-4">
      <div class="flex items-center gap-2">
        <input
          disabled
          class="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500"
          placeholder="ارسال پیام (در حال توسعه)"
        />
        <button disabled class="px-4 py-3 rounded-xl bg-purple-600 text-white opacity-50">
          <i class="ti ti-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const doctorId = computed(() => route.params.doctorId)
</script>
