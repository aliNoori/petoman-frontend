export const useNotification = () => {
  const showNotification = (title, message, type = 'success', duration = 5000) => {
    // Create notification event
    const event = new CustomEvent('show-notification', {
      detail: { title, message, type, duration }
    })
    window.dispatchEvent(event)
  }

  return {
    success: (title, message, duration) => showNotification(title, message, 'success', duration),
    error: (title, message, duration) => showNotification(title, message, 'error', duration),
    warning: (title, message, duration) => showNotification(title, message, 'warning', duration),
    info: (title, message, duration) => showNotification(title, message, 'info', duration)
  }
}
