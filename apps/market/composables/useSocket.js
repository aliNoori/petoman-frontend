export const useSocket = () => {
  const { $io } = useNuxtApp()
  
  const connect = (userId, userName) => {
    if ($io && !$io.connected) {
      $io.connect()
      $io.userId = userId
      $io.userName = userName
    }
  }

  const disconnect = () => {
    if ($io && $io.connected) {
      $io.disconnect()
    }
  }

  const joinChat = (consultationId) => {
    if ($io && $io.connected) {
      $io.emit('join-chat', {
        userId: $io.userId,
        consultationId,
        userName: $io.userName
      })
    }
  }

  const sendMessage = (consultationId, message) => {
    if ($io && $io.connected) {
      $io.emit('send-message', {
        consultationId,
        message,
        senderId: $io.userId,
        senderName: $io.userName
      })
    }
  }

  const sendFile = (consultationId, file) => {
    if ($io && $io.connected) {
      $io.emit('send-file', {
        consultationId,
        file,
        senderId: $io.userId,
        senderName: $io.userName
      })
    }
  }

  const markAsRead = (messageId, consultationId) => {
    if ($io && $io.connected) {
      $io.emit('mark-as-read', {
        messageId,
        consultationId,
        readBy: $io.userId
      })
    }
  }

  const setTyping = (consultationId, isTyping) => {
    if ($io && $io.connected) {
      $io.emit('typing', {
        consultationId,
        userId: $io.userId,
        userName: $io.userName,
        isTyping
      })
    }
  }

  const onNewMessage = (callback) => {
    if ($io) {
      $io.on('new-message', callback)
    }
  }

  const onMessageRead = (callback) => {
    if ($io) {
      $io.on('message-read', callback)
    }
  }

  const onUserOnline = (callback) => {
    if ($io) {
      $io.on('user-online', callback)
    }
  }

  const onUserTyping = (callback) => {
    if ($io) {
      $io.on('user-typing', callback)
    }
  }

  const offAllListeners = () => {
    if ($io) {
      $io.off('new-message')
      $io.off('message-read')
      $io.off('user-online')
      $io.off('user-typing')
    }
  }

  return {
    socket: $io,
    connect,
    disconnect,
    joinChat,
    sendMessage,
    sendFile,
    markAsRead,
    setTyping,
    onNewMessage,
    onMessageRead,
    onUserOnline,
    onUserTyping,
    offAllListeners
  }
}