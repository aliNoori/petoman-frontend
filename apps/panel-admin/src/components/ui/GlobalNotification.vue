<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
          v-if="visible"
          class="fixed top-5 left-5 z-50 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border-r-4"
          :class="{
          'border-green-500': type === 'success',
          'border-red-500': type === 'error',
          'border-yellow-500': type === 'warning',
          'border-blue-500': type === 'info',
        }"
          role="alert"
      >
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
          <!-- آیکون موفقیت -->
          <svg v-if="type === 'success'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <!-- آیکون خطا -->
          <svg v-if="type === 'error'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3 text-sm font-normal">{{ message }}</div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')
let timeoutId = null

const show = (detail) => {
  message.value = detail.message
  type.value = detail.type
  visible.value = true

  // پاک کردن تایمر قبلی اگر وجود داشته باشد
  if (timeoutId) clearTimeout(timeoutId)

  // مخفی کردن بعد از مدت مشخص
  timeoutId = setTimeout(() => {
    visible.value = false
  }, detail.duration || 3000)
}

onMounted(() => {
  window.addEventListener('show-notification', (e) => {
    show(e.detail)
  })
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
/* انیمیشن ظاهر شدن */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>