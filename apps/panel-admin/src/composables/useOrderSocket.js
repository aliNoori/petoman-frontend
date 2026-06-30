import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useOrderNotification } from './useOrderNotification'

// وضعیت اتصال
const socket = ref(null)
const isConnected = ref(false)
const connectionError = ref(null)

// شبیه‌سازی سفارشات برای تست (بدون سرور واقعی)
let mockOrderInterval = null

// اتصال به سرور واقعی Socket.io
const connectToServer = async (url) => {
  try {
    // Dynamic import برای socket.io-client
    const { io } = await import('socket.io-client')
    
    const socketUrl = url || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
    
    socket.value = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    })
    
    socket.value.on('connect', () => {
      isConnected.value = true
      connectionError.value = null
      console.log('🟢 Connected to order server')
    })
    
    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('🔴 Disconnected from order server')
    })
    
    socket.value.on('connect_error', (err) => {
      connectionError.value = err.message
      console.warn('Socket connection error:', err.message)
    })
    
    return socket.value
  } catch (e) {
    console.warn('Socket.io not available, using mock mode')
    return null
  }
}

// شروع حالت شبیه‌سازی (برای تست بدون سرور)
const startMockMode = (orderCallback, interval = 30000) => {
  if (mockOrderInterval) return
  
  const mockOrders = [
    { customerName: 'علی محمدی', itemsCount: 3, total: 450000, type: 'product' },
    { customerName: 'سارا احمدی', itemsCount: 2, total: 280000, type: 'product' },
    { customerName: 'رضا کریمی', itemsCount: 1, total: 180000, type: 'medicine', urgent: true },
    { customerName: 'مریم حسینی', itemsCount: 5, total: 720000, type: 'product' },
    { customerName: 'محمد رضایی', itemsCount: 2, total: 350000, type: 'service' },
  ]
  
  let orderIndex = 0
  
  // اولین سفارش بعد از 5 ثانیه
  setTimeout(() => {
    const order = {
      id: Date.now(),
      ...mockOrders[orderIndex % mockOrders.length],
      timestamp: new Date()
    }
    orderIndex++
    if (orderCallback) orderCallback(order)
  }, 5000)
  
  // سفارشات بعدی با interval
  mockOrderInterval = setInterval(() => {
    const order = {
      id: Date.now(),
      ...mockOrders[orderIndex % mockOrders.length],
      timestamp: new Date()
    }
    orderIndex++
    if (orderCallback) orderCallback(order)
  }, interval)
  
  isConnected.value = true
  console.log('🟡 Mock order mode started')
}

// توقف حالت شبیه‌سازی
const stopMockMode = () => {
  if (mockOrderInterval) {
    clearInterval(mockOrderInterval)
    mockOrderInterval = null
  }
}

// قطع اتصال
const disconnect = () => {
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
  }
  stopMockMode()
  isConnected.value = false
}

// گوش دادن به سفارشات جدید
const onNewOrder = (callback) => {
  if (socket.value) {
    socket.value.on('new-order', callback)
  }
}

// عضویت در room داروخانه/دامپزشکی/مارکت
const joinPanel = (panelType, panelId) => {
  if (socket.value?.connected) {
    socket.value.emit('join-panel', { panelType, panelId })
  }
}

export function useOrderSocket() {
  const { addOrderNotification } = useOrderNotification()
  
  // شروع دریافت سفارشات
  const startListening = async (options = {}) => {
    const { 
      serverUrl, 
      mockMode = true, 
      mockInterval = 30000,
      panelType = 'pharmacy',
      panelId = null
    } = options
    
    if (!mockMode && serverUrl) {
      // اتصال به سرور واقعی
      await connectToServer(serverUrl)
      
      if (socket.value) {
        // عضویت در room
        if (panelId) {
          joinPanel(panelType, panelId)
        }
        
        // گوش دادن به سفارشات
        onNewOrder((order) => {
          addOrderNotification(order)
        })
      }
    } else {
      // حالت شبیه‌سازی
      startMockMode((order) => {
        addOrderNotification(order)
      }, mockInterval)
    }
  }
  
  // توقف دریافت
  const stopListening = () => {
    disconnect()
  }
  
  onUnmounted(() => {
    stopListening()
  })
  
  return {
    socket,
    isConnected,
    connectionError,
    startListening,
    stopListening,
    onNewOrder,
    joinPanel
  }
}

export default useOrderSocket
