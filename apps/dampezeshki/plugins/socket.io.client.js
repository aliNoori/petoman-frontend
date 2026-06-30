import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  let socket = null

  if (process.client) {
    socket = io('http://localhost:3000', {
      autoConnect: false
    })

    // Connection event listeners
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })
  }

  return {
    provide: {
      io: socket
    }
  }
})