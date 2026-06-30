import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  // آدرس سرور Socket.IO
  const socketUrl = 'http://localhost:3000'

  let socket: Socket | null = null

  if (process.client) {
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: false, // اتصال دستی
      timeout: 20000,
      forceNew: true
    })

    // رویدادهای پایه
    socket.on('connect', () => {
      // console.log('✅ متصل به سرور Socket.IO شد')
    })

    socket.on('disconnect', (reason: string) => {
      // console.log('❌ از سرور قطع شد:', reason)
    })

    socket.on('connect_error', (error: Error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔥 خطا در اتصال Socket.IO:', error.message)
      }
    })

    socket.on('reconnect', (attemptNumber: number) => {
      // console.log('🔄 اتصال مجدد برقرار شد، تلاش شماره:', attemptNumber)
    })

    socket.on('reconnect_error', (error: Error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔴 خطا در اتصال مجدد:', error.message)
      }
    })
  }

  return {
    provide: {
      socket: socket
    }
  }
})
