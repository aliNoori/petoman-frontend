interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  duration?: number
}

export const useNotification = () => {
  const showNotification = (message: string, options: NotificationOptions = {}) => {
    const notification = {
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration || 5000
    }
    
    // Emit event that will be caught by the Notification component
    if (process.client) {
      window.dispatchEvent(new CustomEvent('show-notification', { 
        detail: notification 
      }))
    }
  }

  const showSuccess = (message: string, title?: string) => {
    showNotification(message, { type: 'success', title })
  }

  const showError = (message: string, title?: string) => {
    showNotification(message, { type: 'error', title })
  }

  const showWarning = (message: string, title?: string) => {
    showNotification(message, { type: 'warning', title })
  }

  const showInfo = (message: string, title?: string) => {
    showNotification(message, { type: 'info', title })
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
