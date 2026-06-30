import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'

const httpServer = createServer()
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Store online users
const onlineUsers = new Map()
const userSockets = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join user to a consultation room
  socket.on('join-chat', (data) => {
    const { userId, consultationId, userName } = data
    
    socket.join(`consultation-${consultationId}`)
    onlineUsers.set(userId, {
      socketId: socket.id,
      userName,
      consultationId,
      isOnline: true
    })
    userSockets.set(socket.id, userId)
    
    // Notify others in the consultation about user being online
    socket.to(`consultation-${consultationId}`).emit('user-online', {
      userId,
      userName,
      isOnline: true
    })
    
    console.log(`User ${userName} joined consultation ${consultationId}`)
  })

  // Handle sending messages
  socket.on('send-message', (data) => {
    const { consultationId, message, senderId, senderName } = data
    
    const messageData = {
      id: Date.now() + Math.random(),
      text: message.text,
      senderId,
      senderName,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      consultationId,
      file: message.file || null
    }

    // Send to all users in the consultation room
    io.to(`consultation-${consultationId}`).emit('new-message', messageData)
    
    console.log(`Message sent in consultation ${consultationId}:`, messageData.text)
  })

  // Handle message read status
  socket.on('mark-as-read', (data) => {
    const { messageId, consultationId, readBy } = data
    
    socket.to(`consultation-${consultationId}`).emit('message-read', {
      messageId,
      readBy,
      readTime: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    })
  })

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { consultationId, userId, userName, isTyping } = data
    
    socket.to(`consultation-${consultationId}`).emit('user-typing', {
      userId,
      userName,
      isTyping
    })
  })

  // Handle file sharing
  socket.on('send-file', (data) => {
    const { consultationId, file, senderId, senderName } = data
    
    const messageData = {
      id: Date.now() + Math.random(),
      text: file.type.startsWith('image/') ? '' : `فایل ارسال شد: ${file.name}`,
      senderId,
      senderName,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      consultationId,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.url
      }
    }

    io.to(`consultation-${consultationId}`).emit('new-message', messageData)
    
    console.log(`File sent in consultation ${consultationId}:`, file.name)
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = userSockets.get(socket.id)
    if (userId) {
      const user = onlineUsers.get(userId)
      if (user) {
        // Notify others in the consultation about user going offline
        socket.to(`consultation-${user.consultationId}`).emit('user-online', {
          userId,
          userName: user.userName,
          isOnline: false
        })
        
        onlineUsers.delete(userId)
      }
      userSockets.delete(socket.id)
    }
    
    console.log('User disconnected:', socket.id)
  })
})

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})