import { ref, onMounted } from 'vue'

// وضعیت Push Notification
const isSupported = ref(false)
const permission = ref('default')
const subscription = ref(null)

// بررسی پشتیبانی مرورگر
const checkSupport = () => {
  isSupported.value = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
  if ('Notification' in window) {
    permission.value = Notification.permission
  }
  return isSupported.value
}

// درخواست مجوز
const requestPermission = async () => {
  if (!isSupported.value) {
    console.warn('Push notifications not supported')
    return false
  }

  try {
    const result = await Notification.requestPermission()
    permission.value = result
    
    if (result === 'granted') {
      await registerServiceWorker()
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return false
  }
}

// ثبت Service Worker
const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
    
    console.log('Service Worker registered:', registration)
    
    // اشتراک در Push
    await subscribeToPush(registration)
    
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

// اشتراک در Push
const subscribeToPush = async (registration) => {
  try {
    // VAPID public key (باید از سرور بگیرید)
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    })
    
    subscription.value = sub
    
    // ارسال subscription به سرور
    await sendSubscriptionToServer(sub)
    
    return sub
  } catch (error) {
    console.error('Failed to subscribe to push:', error)
    return null
  }
}

// ارسال subscription به سرور
const sendSubscriptionToServer = async (sub) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    await fetch(`${API_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('petoman_token')}`
      },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        userId: localStorage.getItem('petoman_user_id'),
        role: localStorage.getItem('petoman_role')
      })
    })
    
    console.log('Subscription sent to server')
  } catch (error) {
    console.warn('Failed to send subscription to server:', error)
  }
}

// ارسال اعلان محلی (برای تست)
const sendNotification = (title, options = {}) => {
  if (permission.value !== 'granted') {
    console.warn('Notification permission not granted')
    return
  }
  
  const defaultOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    requireInteraction: false,
    silent: false,
    dir: 'rtl',
    lang: 'fa-IR',
    ...options
  }
  
  // اگر صفحه فوکوس دارد، اعلان نشان نده
  if (document.hasFocus() && !options.forceShow) {
    return
  }
  
  try {
    const notification = new Notification(title, defaultOptions)
    
    notification.onclick = () => {
      window.focus()
      if (options.url) {
        window.location.href = options.url
      }
      notification.close()
    }
    
    // بستن خودکار بعد از 5 ثانیه
    setTimeout(() => notification.close(), options.timeout || 5000)
    
    return notification
  } catch (error) {
    console.error('Error showing notification:', error)
    return null
  }
}

// تبدیل VAPID key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  
  return outputArray
}

// لغو اشتراک
const unsubscribe = async () => {
  if (!subscription.value) return
  
  try {
    await subscription.value.unsubscribe()
    subscription.value = null
    console.log('Unsubscribed from push notifications')
  } catch (error) {
    console.error('Error unsubscribing:', error)
  }
}

// Composable اصلی
export function usePushNotifications() {
  onMounted(() => {
    checkSupport()
  })
  
  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    sendNotification,
    unsubscribe,
    checkSupport
  }
}

// اعلان‌های از پیش تعریف شده برای Pet-o-Man
export const PetomanNotifications = {
  // گفتگوی جدید
  newChat: (customerName, petName) => ({
    title: '🐾 درخواست مشاوره جدید',
    body: `${customerName} برای ${petName} درخواست مشاوره داده است`,
    tag: 'new-chat',
    icon: '/icons/chat-icon.png'
  }),
  
  // پیام جدید
  newMessage: (senderName, messagePreview) => ({
    title: '💬 پیام جدید',
    body: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
    tag: 'new-message',
    renotify: true
  }),
  
  // نوبت جدید
  newAppointment: (customerName, dateTime) => ({
    title: '📅 نوبت جدید',
    body: `${customerName} برای ${dateTime} نوبت رزرو کرد`,
    tag: 'new-appointment',
    icon: '/icons/calendar-icon.png'
  }),
  
  // یادآوری نوبت
  appointmentReminder: (customerName, remainingTime) => ({
    title: '⏰ یادآوری نوبت',
    body: `نوبت ${customerName} تا ${remainingTime} دیگر`,
    tag: 'appointment-reminder',
    requireInteraction: true
  }),
  
  // سفارش جدید
  newOrder: (orderId, totalAmount) => ({
    title: '🛒 سفارش جدید',
    body: `سفارش #${orderId} به مبلغ ${totalAmount} تومان ثبت شد`,
    tag: 'new-order',
    icon: '/icons/order-icon.png'
  }),
  
  // تغییر وضعیت سفارش
  orderStatusChange: (orderId, status) => ({
    title: '📦 بروزرسانی سفارش',
    body: `وضعیت سفارش #${orderId}: ${status}`,
    tag: `order-${orderId}`,
  }),
  
  // گزارش مالی
  financeReport: (type, amount) => ({
    title: '💰 گزارش مالی',
    body: `${type}: ${amount} تومان`,
    tag: 'finance-report',
    icon: '/icons/finance-icon.png'
  })
}

export default usePushNotifications
