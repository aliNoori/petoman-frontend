import { ref, onMounted, onUnmounted } from 'vue'

// سیستم نوتیفیکیشن نوبت‌ها
export function useAppointmentNotifications() {
  const notifications = ref([])
  const unreadCount = ref(0)
  const isConnected = ref(false)
  let socket = null
  let notificationCheckInterval = null

  // درخواست مجوز Push Notification
  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('این مرورگر از نوتیفیکیشن پشتیبانی نمی‌کند')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // نمایش Push Notification دسکتاپ
  function showDesktopNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/pet-icon.png',
        badge: '/icons/badge.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options
      })

      notification.onclick = () => {
        window.focus()
        if (options.onClick) {
          options.onClick()
        }
        notification.close()
      }

      // بستن خودکار بعد از 10 ثانیه
      setTimeout(() => notification.close(), 10000)

      return notification
    }
  }

  // نمایش نوتیفیکیشن یادآوری نوبت
  function showAppointmentReminder(appointment, minutesUntil) {
    const timeText = minutesUntil === 60 ? 'یک ساعت دیگر' : 
                     minutesUntil === 30 ? 'نیم ساعت دیگر' :
                     minutesUntil === 15 ? '۱۵ دقیقه دیگر' :
                     minutesUntil === 5 ? '۵ دقیقه دیگر' : `${minutesUntil} دقیقه دیگر`

    // نوتیفیکیشن داخل اپ
    const inAppNotification = {
      id: Date.now(),
      type: 'appointment-reminder',
      title: `یادآوری نوبت - ${timeText}`,
      message: `نوبت ${appointment.petName} (${appointment.ownerName}) ساعت ${appointment.time}`,
      appointment,
      time: new Date(),
      read: false,
      priority: minutesUntil <= 15 ? 'high' : 'normal'
    }
    
    notifications.value.unshift(inAppNotification)
    unreadCount.value++

    // Push Notification دسکتاپ
    showDesktopNotification(`🐾 نوبت ${timeText}`, {
      body: `${appointment.petName} - ${appointment.ownerName}\nساعت ${appointment.time} - ${appointment.service}`,
      tag: `appointment-${appointment.id}`,
      data: { appointmentId: appointment.id },
      onClick: () => {
        // باز کردن جزئیات نوبت
        window.dispatchEvent(new CustomEvent('open-appointment', { detail: appointment }))
      }
    })

    // پخش صدا
    playNotificationSound()
  }

  // نمایش نوتیفیکیشن درخواست فوری (گفتگو یا تماس)
  function showUrgentRequest(request) {
    const typeText = request.type === 'online-chat' ? 'گفتگوی آنلاین' : 'تماس فوری'
    const icon = request.type === 'online-chat' ? '💬' : '📞'

    const inAppNotification = {
      id: Date.now(),
      type: 'urgent-request',
      title: `${icon} درخواست ${typeText} فوری`,
      message: `${request.ownerName} درخواست ${typeText} دارد`,
      request,
      time: new Date(),
      read: false,
      priority: 'urgent'
    }
    
    notifications.value.unshift(inAppNotification)
    unreadCount.value++

    // Push Notification فوری
    showDesktopNotification(`🚨 درخواست ${typeText} فوری`, {
      body: `${request.petName} - ${request.ownerName}\n${request.description || 'نیاز به کمک فوری'}`,
      tag: `urgent-${request.id}`,
      requireInteraction: true,
      data: { requestId: request.id, type: request.type },
      onClick: () => {
        window.dispatchEvent(new CustomEvent('open-urgent-request', { detail: request }))
      }
    })

    // پخش صدای فوری
    playUrgentSound()
  }

  // نمایش خلاصه نوبت‌های امروز
  function showTodaySummary(appointments) {
    if (appointments.length === 0) return

    const inAppNotification = {
      id: Date.now(),
      type: 'daily-summary',
      title: `📅 نوبت‌های امروز`,
      message: `شما امروز ${appointments.length} نوبت دارید`,
      appointments,
      time: new Date(),
      read: false,
      priority: 'normal'
    }
    
    notifications.value.unshift(inAppNotification)
    unreadCount.value++

    showDesktopNotification(`📅 نوبت‌های امروز: ${appointments.length} نوبت`, {
      body: appointments.slice(0, 3).map(a => `${a.time} - ${a.petName}`).join('\n') + 
            (appointments.length > 3 ? `\n... و ${appointments.length - 3} نوبت دیگر` : ''),
      tag: 'daily-summary'
    })
  }

  // پخش صدای نوتیفیکیشن
  function playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (e) {}
  }

  // پخش صدای فوری
  function playUrgentSound() {
    try {
      const audio = new Audio('/sounds/urgent.mp3')
      audio.volume = 0.7
      audio.play().catch(() => {})
    } catch (e) {}
  }

  // اتصال به WebSocket برای نوتیفیکیشن‌های Real-time
  function connectWebSocket(clinicId) {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
    
    try {
      socket = new WebSocket(`${wsUrl}/clinic/${clinicId}/notifications`)

      socket.onopen = () => {
        isConnected.value = true
        console.log('WebSocket connected for notifications')
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (e) {
          console.error('Error parsing WebSocket message:', e)
        }
      }

      socket.onclose = () => {
        isConnected.value = false
        console.log('WebSocket disconnected, reconnecting...')
        // تلاش مجدد برای اتصال بعد از 5 ثانیه
        setTimeout(() => connectWebSocket(clinicId), 5000)
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (e) {
      console.error('Failed to connect WebSocket:', e)
    }
  }

  // پردازش پیام‌های WebSocket
  function handleWebSocketMessage(data) {
    switch (data.type) {
      case 'appointment-reminder':
        showAppointmentReminder(data.appointment, data.minutesUntil)
        break
      case 'urgent-chat-request':
        showUrgentRequest({ ...data.request, type: 'online-chat' })
        break
      case 'urgent-call-request':
        showUrgentRequest({ ...data.request, type: 'phone-call' })
        break
      case 'new-appointment':
        showNewAppointmentNotification(data.appointment)
        break
      case 'appointment-cancelled':
        showAppointmentCancelledNotification(data.appointment)
        break
    }
  }

  // نوتیفیکیشن نوبت جدید
  function showNewAppointmentNotification(appointment) {
    const inAppNotification = {
      id: Date.now(),
      type: 'new-appointment',
      title: '🆕 نوبت جدید',
      message: `${appointment.petName} (${appointment.ownerName}) - ${appointment.dateDisplay} ساعت ${appointment.time}`,
      appointment,
      time: new Date(),
      read: false,
      priority: 'normal'
    }
    
    notifications.value.unshift(inAppNotification)
    unreadCount.value++

    showDesktopNotification('🆕 نوبت جدید ثبت شد', {
      body: `${appointment.petName} - ${appointment.ownerName}\n${appointment.dateDisplay} ساعت ${appointment.time}`,
      tag: `new-appointment-${appointment.id}`
    })

    playNotificationSound()
  }

  // نوتیفیکیشن لغو نوبت
  function showAppointmentCancelledNotification(appointment) {
    const inAppNotification = {
      id: Date.now(),
      type: 'appointment-cancelled',
      title: '❌ نوبت لغو شد',
      message: `نوبت ${appointment.petName} در ${appointment.dateDisplay} ساعت ${appointment.time} لغو شد`,
      appointment,
      time: new Date(),
      read: false,
      priority: 'normal'
    }
    
    notifications.value.unshift(inAppNotification)
    unreadCount.value++

    showDesktopNotification('❌ نوبت لغو شد', {
      body: `${appointment.petName} - ${appointment.ownerName}\n${appointment.dateDisplay} ساعت ${appointment.time}`,
      tag: `cancelled-${appointment.id}`
    })
  }

  // علامت‌گذاری به عنوان خوانده شده
  function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  // علامت‌گذاری همه به عنوان خوانده شده
  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
  }

  // حذف نوتیفیکیشن
  function removeNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
    }
  }

  // پاکسازی نوتیفیکیشن‌های قدیمی (بیش از 24 ساعت)
  function cleanOldNotifications() {
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    
    notifications.value = notifications.value.filter(n => {
      if (n.time > oneDayAgo) return true
      if (!n.read) unreadCount.value = Math.max(0, unreadCount.value - 1)
      return false
    })
  }

  // بررسی نوبت‌های نزدیک (برای حالت آفلاین)
  function checkUpcomingAppointments(appointments) {
    const now = new Date()
    const reminderMinutes = [60, 30, 15, 5] // یادآوری در 60، 30، 15 و 5 دقیقه قبل

    appointments.forEach(apt => {
      if (apt.status !== 'approved') return

      const [hours, minutes] = apt.time.split(':').map(Number)
      const aptTime = new Date()
      aptTime.setHours(hours, minutes, 0, 0)

      const diffMinutes = Math.round((aptTime - now) / (1000 * 60))

      // بررسی آیا باید یادآوری بفرستیم
      reminderMinutes.forEach(reminderMin => {
        if (diffMinutes === reminderMin) {
          // چک کردن که قبلاً ارسال نشده باشد
          const alreadySent = notifications.value.some(n => 
            n.type === 'appointment-reminder' && 
            n.appointment?.id === apt.id &&
            n.title.includes(reminderMin === 60 ? 'یک ساعت' : `${reminderMin}`)
          )
          
          if (!alreadySent) {
            showAppointmentReminder(apt, reminderMin)
          }
        }
      })
    })
  }

  // شروع بررسی دوره‌ای نوبت‌ها
  function startAppointmentCheck(getAppointments) {
    // بررسی هر دقیقه
    notificationCheckInterval = setInterval(() => {
      const todayAppointments = getAppointments()
      checkUpcomingAppointments(todayAppointments)
    }, 60000) // هر 60 ثانیه
  }

  // قطع اتصال
  function disconnect() {
    if (socket) {
      socket.close()
      socket = null
    }
    if (notificationCheckInterval) {
      clearInterval(notificationCheckInterval)
      notificationCheckInterval = null
    }
  }

  onMounted(() => {
    requestNotificationPermission()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    notifications,
    unreadCount,
    isConnected,
    requestNotificationPermission,
    showAppointmentReminder,
    showUrgentRequest,
    showTodaySummary,
    showNewAppointmentNotification,
    connectWebSocket,
    markAsRead,
    markAllAsRead,
    removeNotification,
    cleanOldNotifications,
    startAppointmentCheck,
    disconnect
  }
}
