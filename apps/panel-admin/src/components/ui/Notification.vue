<template>
  <div class="fixed top-4 left-4 z-50 space-y-2">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="[
        'min-w-80 p-4 rounded-lg shadow-lg border transform transition-all duration-300 font-vazir',
        notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
        notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
        'bg-blue-50 border-blue-200 text-blue-800'
      ]"
      class="slide-in"
    >
      <div class="flex items-start gap-3">
        <i 
          :class="[
            'text-lg mt-0.5',
            notification.type === 'success' ? 'ti ti-check-circle' :
            notification.type === 'error' ? 'ti ti-alert-circle' :
            notification.type === 'warning' ? 'ti ti-alert-triangle' :
            'ti ti-info-circle'
          ]"
        ></i>
        <div class="flex-1">
          <h4 v-if="notification.title" class="font-semibold mb-1">{{ notification.title }}</h4>
          <p class="text-sm">{{ notification.message }}</p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <i class="ti ti-x text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const notifications = ref<Notification[]>([])

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Date.now().toString()
  const newNotification = { ...notification, id }
  
  notifications.value.push(newNotification)
  
  // Auto remove after duration
  const duration = notification.duration || 5000
  setTimeout(() => {
    removeNotification(id)
  }, duration)
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Listen for custom events
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('show-notification', (event: any) => {
      addNotification(event.detail)
    })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('show-notification', () => {})
  }
})
</script>

<style scoped>
.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
