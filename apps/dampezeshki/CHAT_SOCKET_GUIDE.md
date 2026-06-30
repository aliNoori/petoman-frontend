# راهنمای پیاده‌سازی Socket.io برای چت

## نصب Socket.io Client

```bash
npm install socket.io-client
```

## تنظیمات در `pages/chat/[doctorId].vue`

### 1. Import کردن Socket.io

```javascript
import { io } from 'socket.io-client'
```

### 2. تنظیمات اتصال

در تابع `initializeSocket()`:

```javascript
const initializeSocket = () => {
  // اتصال به سرور Socket.io
  socket = io('http://your-server-url:3000', {
    transports: ['websocket'],
    auth: {
      token: 'USER_AUTH_TOKEN' // توکن احراز هویت کاربر
    }
  })
  
  isConnected.value = true
  setupSocketListeners()
}
```

### 3. Event Listeners

#### اتصال موفق
```javascript
socket.on('connect', () => {
  isConnected.value = true
  
  // Join به اتاق چت
  socket.emit('joinChat', {
    chatId: chatInfo.value.id,
    doctorId: chatInfo.value.doctorId,
    userId: 'CURRENT_USER_ID'
  })
})
```

#### قطع اتصال
```javascript
socket.on('disconnect', () => {
  isConnected.value = false
})
```

#### دریافت پیام جدید
```javascript
socket.on('newMessage', (message) => {
  messages.value.push({
    id: message.id,
    sender: message.sender === 'CURRENT_USER_ID' ? 'user' : 'doctor',
    type: message.type || 'text',
    text: message.text,
    imageUrl: message.imageUrl,
    time: new Date(message.timestamp).toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    status: 'delivered'
  })
  scrollToBottom()
  
  // ارسال تایید دریافت
  socket.emit('messageReceived', { messageId: message.id })
})
```

#### نشانگر تایپ
```javascript
socket.on('typing', (data) => {
  if (data.userId !== 'CURRENT_USER_ID') {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
    }, 3000)
  }
})
```

#### خوانده شدن پیام
```javascript
socket.on('messageRead', (data) => {
  const message = messages.value.find(m => m.id === data.messageId)
  if (message) {
    message.status = 'seen'
  }
})
```

#### بسته شدن چت
```javascript
socket.on('chatClosed', (data) => {
  chatInfo.value.status = 'closed'
  
  // پیام سیستمی
  messages.value.push({
    id: Date.now(),
    sender: 'system',
    type: 'text',
    text: data.reason || 'گفتگو به پایان رسید',
    time: new Date().toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  })
  
  scrollToBottom()
})
```

#### تغییر وضعیت چت
```javascript
socket.on('chatStatusChanged', (data) => {
  chatInfo.value.status = data.status
  
  if (data.status === 'active') {
    chatInfo.value.remainingTime = data.remainingTime
    chatInfo.value.doctorOnline = true
    
    // پیام سیستمی
    messages.value.push({
      id: Date.now(),
      sender: 'system',
      type: 'text',
      text: `دکتر ${chatInfo.value.doctorName} به گفتگو پیوست`,
      time: new Date().toLocaleTimeString('fa-IR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    })
  }
  
  scrollToBottom()
})
```

### 4. ارسال پیام

در تابع `sendMessage()`:

```javascript
const sendMessage = () => {
  if (!canSend.value || chatInfo.value.status !== 'active') return
  
  const messageData = {
    chatId: chatInfo.value.id,
    text: newMessage.value,
    type: attachedFile.value ? 'file' : 'text',
    file: attachedFile.value,
    timestamp: Date.now()
  }
  
  // ارسال به سرور
  socket.emit('sendMessage', messageData)
  
  // اضافه کردن به لیست پیام‌ها
  messages.value.push({
    id: messageData.timestamp,
    sender: 'user',
    type: messageData.type,
    text: messageData.text,
    time: new Date().toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    status: 'sent'
  })
  
  newMessage.value = ''
  attachedFile.value = null
  scrollToBottom()
}
```

### 5. ارسال نشانگر تایپ

```javascript
watch(newMessage, (value) => {
  if (value && socket && chatInfo.value.status === 'active') {
    socket.emit('typing', {
      chatId: chatInfo.value.id,
      userId: 'CURRENT_USER_ID',
      isTyping: true
    })
  }
})
```

### 6. آپلود فایل

```javascript
const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('chatId', chatInfo.value.id)
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    })
    
    const data = await response.json()
    
    // ارسال پیام با لینک فایل
    socket.emit('sendMessage', {
      chatId: chatInfo.value.id,
      type: 'file',
      fileUrl: data.url,
      fileName: file.name,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

## رویدادهای سرور (Server Events)

### برای پیاده‌سازی در Backend:

```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Join به اتاق چت
  socket.on('joinChat', async ({ chatId, userId }) => {
    socket.join(`chat_${chatId}`)
    
    // بررسی وضعیت چت از دیتابیس
    const chat = await getChat(chatId)
    
    socket.emit('chatStatusChanged', {
      status: chat.status,
      remainingTime: chat.remainingTime
    })
  })
  
  // دریافت و ارسال پیام
  socket.on('sendMessage', async (messageData) => {
    // ذخیره در دیتابیس
    const savedMessage = await saveMessage(messageData)
    
    // ارسال به همه در اتاق
    io.to(`chat_${messageData.chatId}`).emit('newMessage', savedMessage)
  })
  
  // نشانگر تایپ
  socket.on('typing', ({ chatId, userId }) => {
    socket.to(`chat_${chatId}`).emit('typing', { userId })
  })
  
  // خوانده شدن پیام
  socket.on('messageRead', async ({ messageId, chatId }) => {
    await markMessageAsRead(messageId)
    io.to(`chat_${chatId}`).emit('messageRead', { messageId })
  })
  
  // قطع اتصال
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})
```

## نکات مهم

1. **احراز هویت**: حتماً توکن JWT برای احراز هویت استفاده کنید
2. **مدیریت خطا**: از try-catch برای handle کردن خطاها استفاده کنید
3. **Reconnection**: Socket.io به صورت خودکار reconnect می‌کنه
4. **وضعیت چت**: همیشه وضعیت چت رو از سرور بگیرید نه از local state
5. **فایل‌ها**: فایل‌ها رو اول آپلود کنید بعد لینکشون رو ارسال کنید
6. **زمان‌بندی**: از timestamp UTC استفاده کنید و در frontend به زمان محلی تبدیل کنید

## مثال کامل Composable

می‌تونید یک composable برای socket بسازید:

```javascript
// composables/useSocket.js
import { io } from 'socket.io-client'

export const useSocket = () => {
  const socket = ref(null)
  const isConnected = ref(false)

  const connect = (url, options = {}) => {
    socket.value = io(url, options)
    
    socket.value.on('connect', () => {
      isConnected.value = true
    })
    
    socket.value.on('disconnect', () => {
      isConnected.value = false
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
    }
  }

  return {
    socket,
    isConnected,
    connect,
    disconnect
  }
}
```
