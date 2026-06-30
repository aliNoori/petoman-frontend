import { ref, onMounted, onUnmounted, watch } from 'vue'

// وضعیت نوتیفیکیشن‌های سفارش
const orderNotifications = ref([])
const unreadOrderCount = ref(0)
const soundEnabled = ref(true)
const desktopNotificationsEnabled = ref(true)

// صدای نوتیفیکیشن با Web Audio API
let audioContext = null

const initAudio = () => {
  if (typeof window === 'undefined') return
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  } catch (e) {
    console.warn('AudioContext not supported')
  }
}

// پخش صدای سفارش جدید
const playOrderSound = (type = 'new') => {
  if (!soundEnabled.value || !audioContext) return
  
  // Resume audio context if suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  // الگوهای صدای مختلف برای انواع سفارش
  const patterns = {
    new: [
      { freq: 880, time: 0 },
      { freq: 1100, time: 0.1 },
      { freq: 1320, time: 0.2 }
    ],
    urgent: [
      { freq: 1000, time: 0 },
      { freq: 1200, time: 0.05 },
      { freq: 1000, time: 0.1 },
      { freq: 1200, time: 0.15 },
      { freq: 1400, time: 0.2 }
    ],
    medicine: [
      { freq: 660, time: 0 },
      { freq: 880, time: 0.15 },
      { freq: 1100, time: 0.3 }
    ]
  }
  
  const pattern = patterns[type] || patterns.new
  
  pattern.forEach(({ freq, time }) => {
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + time)
  })
  
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

// درخواست مجوز نوتیفیکیشن
const requestPermission = async () => {
  if (!('Notification' in window)) return false
  
  if (Notification.permission === 'granted') return true
  if (Notification.permission !== 'denied') {
    const result = await Notification.requestPermission()
    return result === 'granted'
  }
  return false
}

// نمایش نوتیفیکیشن دسکتاپ
const showDesktopNotification = (title, body, options = {}) => {
  if (!desktopNotificationsEnabled.value) return
  if (Notification.permission !== 'granted') return
  
  const notification = new Notification(title, {
    body,
    icon: '/pet.png',
    badge: '/pet.png',
    tag: options.tag || `order-${Date.now()}`,
    renotify: true,
    requireInteraction: options.urgent || false,
    vibrate: options.urgent ? [200, 100, 200] : [100],
    ...options
  })
  
  notification.onclick = () => {
    window.focus()
    if (options.onClick) options.onClick()
    notification.close()
  }
  
  // بستن خودکار
  if (!options.urgent) {
    setTimeout(() => notification.close(), 8000)
  }
  
  return notification
}

// اضافه کردن نوتیفیکیشن سفارش جدید
const addOrderNotification = (order) => {
  const notification = {
    id: order.id || Date.now(),
    type: order.type || 'product', // product, medicine, service
    customerName: order.customerName,
    itemsCount: order.itemsCount,
    total: order.total,
    urgent: order.urgent || false,
    read: false,
    timestamp: new Date(),
    ...order
  }
  
  orderNotifications.value.unshift(notification)
  unreadOrderCount.value++
  
  // پخش صدا
  const soundType = notification.urgent ? 'urgent' : 
                    notification.type === 'medicine' ? 'medicine' : 'new'
  playOrderSound(soundType)
  
  // نوتیفیکیشن دسکتاپ
  const title = notification.urgent ? '🚨 سفارش فوری!' : '🛒 سفارش جدید'
  const body = `${notification.customerName} - ${notification.itemsCount} قلم - ${notification.total?.toLocaleString()} تومان`
  
  showDesktopNotification(title, body, {
    tag: `order-${notification.id}`,
    urgent: notification.urgent,
    onClick: () => {
      markOrderAsRead(notification.id)
    }
  })
  
  return notification
}

// خواندن نوتیفیکیشن
const markOrderAsRead = (id) => {
  const notification = orderNotifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    unreadOrderCount.value = Math.max(0, unreadOrderCount.value - 1)
  }
}

// خواندن همه
const markAllOrdersAsRead = () => {
  orderNotifications.value.forEach(n => n.read = true)
  unreadOrderCount.value = 0
}

// حذف نوتیفیکیشن
const removeOrderNotification = (id) => {
  const index = orderNotifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    if (!orderNotifications.value[index].read) {
      unreadOrderCount.value = Math.max(0, unreadOrderCount.value - 1)
    }
    orderNotifications.value.splice(index, 1)
  }
}

// پاک کردن همه
const clearAllOrderNotifications = () => {
  orderNotifications.value = []
  unreadOrderCount.value = 0
}

// تنظیمات
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  localStorage.setItem('orderSoundEnabled', soundEnabled.value)
}

const toggleDesktopNotifications = () => {
  desktopNotificationsEnabled.value = !desktopNotificationsEnabled.value
  localStorage.setItem('orderDesktopEnabled', desktopNotificationsEnabled.value)
}

export function useOrderNotification() {
  onMounted(() => {
    initAudio()
    requestPermission()
    
    // بارگذاری تنظیمات از localStorage
    const savedSound = localStorage.getItem('orderSoundEnabled')
    const savedDesktop = localStorage.getItem('orderDesktopEnabled')
    
    if (savedSound !== null) soundEnabled.value = savedSound === 'true'
    if (savedDesktop !== null) desktopNotificationsEnabled.value = savedDesktop === 'true'
  })
  
  return {
    orderNotifications,
    unreadOrderCount,
    soundEnabled,
    desktopNotificationsEnabled,
    addOrderNotification,
    markOrderAsRead,
    markAllOrdersAsRead,
    removeOrderNotification,
    clearAllOrderNotifications,
    toggleSound,
    toggleDesktopNotifications,
    playOrderSound,
    requestPermission
  }
}

export default useOrderNotification
