<template>
  <!-- AI Widget Button -->
  <div 
    v-if="!isOpen"
    class="fixed bottom-6 left-6 z-50"
  >
    <Button
      @click="toggleWidget"
      class="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
      :class="isTyping ? 'animate-pulse' : ''"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.906A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
      </svg>
      
      <!-- Notification dot -->
      <div 
        v-if="hasUnreadMessage"
        class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
      >
        <span class="text-xs text-white font-bold">!</span>
      </div>
    </Button>
  </div>

  <!-- AI Chat Widget -->
  <div 
    v-if="isOpen"
    class="fixed bottom-6 left-6 w-96 h-[500px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
      <div class="flex items-center space-x-3 space-x-reverse">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-neutral-900 dark:text-white">دستیار هوشمند دامپزشکی</h3>
          <p class="text-xs text-neutral-500">آنلاین</p>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        @click="toggleWidget"
        class="p-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex',
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-xs px-4 py-2 rounded-2xl',
            message.sender === 'user' 
              ? 'bg-primary text-white ml-2' 
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white mr-2'
          ]"
        >
          <p class="text-sm">{{ message.content }}</p>
          <span class="text-xs opacity-70 mt-1 block">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>
      </div>
      
      <!-- Typing indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-2xl mr-2">
          <div class="flex space-x-1 space-x-reverse">
            <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-neutral-200 dark:border-neutral-700">
      <div class="flex space-x-2 space-x-reverse">
        <Input
          v-model="currentMessage"
          placeholder="سوال خود را بپرسید..."
          @keydown.enter="sendMessage"
          :disabled="isTyping"
          class="flex-1"
        />
        <Button
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isTyping"
          size="sm"
          class="px-4"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>
      
      <!-- Quick actions -->
      <div class="flex flex-wrap gap-2 mt-3">
        <Button
          v-for="action in quickActions"
          :key="action.text"
          variant="ghost"
          size="sm"
          @click="selectQuickAction(action.text)"
          class="text-xs"
        >
          {{ action.text }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// State
const isOpen = ref(false)
const currentMessage = ref('')
const isTyping = ref(false)
const hasUnreadMessage = ref(false)
const messagesContainer = ref<HTMLElement>()

const messages = ref<Message[]>([
  {
    id: '1',
    content: 'سلام! من دستیار هوشمند دامپزشکی پتومن هستم. چطور می‌تونم کمکتان کنم؟',
    sender: 'ai',
    timestamp: new Date()
  }
])

const quickActions = [
  { text: 'گربه من غذا نمی‌خورد' },
  { text: 'سگ من سرفه می‌کند' },
  { text: 'نزدیک‌ترین دامپزشک' },
  { text: 'داروخانه ۲۴ ساعته' }
]

// Methods
const toggleWidget = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasUnreadMessage.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage: Message = {
    id: Date.now().toString(),
    content: currentMessage.value,
    sender: 'user',
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageContent = currentMessage.value
  currentMessage.value = ''

  nextTick(() => {
    scrollToBottom()
  })

  // Simulate AI response
  isTyping.value = true
  
  try {
    const response = await $fetch('/api/ai/ask', {
      method: 'POST',
      body: { message: messageContent }
    })

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response.answer || 'متاسفانه در حال حاضر قادر به پاسخ‌گویی نیستم. لطفاً با دامپزشک مشورت کنید.',
      sender: 'ai',
      timestamp: new Date()
    }

    messages.value.push(aiMessage)
  } catch (error) {
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'خطا در دریافت پاسخ. لطفاً دوباره تلاش کنید.',
      sender: 'ai',
      timestamp: new Date()
    }

    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const selectQuickAction = (text: string) => {
  currentMessage.value = text
  sendMessage()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

// Auto-scroll when new messages arrive
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>
