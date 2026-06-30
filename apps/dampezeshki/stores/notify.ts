interface Notification {
  id: string
  type: string
  title: string
  body: string
  data?: any
  readAt?: string
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
}

export const useNotifyStore = defineStore('notifications', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    loading: false
  }),

  getters: {
    unreadNotifications: (state) => 
      state.notifications.filter(n => !n.readAt),
    
    readNotifications: (state) => 
      state.notifications.filter(n => n.readAt)
  },

  actions: {
    async fetchNotifications() {
      this.loading = true
      try {
        const { data } = await $fetch('/api/notifications', {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        
        this.notifications = data.notifications
        this.unreadCount = data.unreadCount
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId: string) {
      try {
        await $fetch(`/api/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        
        // Update local state
        const notification = this.notifications.find(n => n.id === notificationId)
        if (notification && !notification.readAt) {
          notification.readAt = new Date().toISOString()
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    },

    async markAllAsRead() {
      try {
        await $fetch('/api/notifications/read-all', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        
        // Update local state
        const now = new Date().toISOString()
        this.notifications.forEach(notification => {
          if (!notification.readAt) {
            notification.readAt = now
          }
        })
        this.unreadCount = 0
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
      }
    },

    addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      this.notifications.unshift(newNotification)
      if (!newNotification.readAt) {
        this.unreadCount++
      }
    },

    showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
      // This could integrate with a toast library
      const toast = {
        message,
        type,
        id: Date.now().toString(),
        duration: 5000
      }
      
      // You can emit an event or use a composable for toast display
      console.log(`Toast: ${type.toUpperCase()} - ${message}`)
    }
  }
})
