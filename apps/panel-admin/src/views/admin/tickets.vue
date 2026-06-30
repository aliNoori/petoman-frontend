<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">تیکت‌های پشتیبانی</h1>
        <p class="text-gray-500 mt-1">مدیریت و پاسخ به درخواست‌های پشتیبانی</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm">
          <i class="ti ti-ticket ml-1"></i>
          {{ openTickets }} تیکت باز
        </span>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <i class="ti ti-clock text-orange-600"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.open }}</p>
            <p class="text-xs text-gray-500">باز / در انتظار</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <i class="ti ti-message-dots text-blue-600"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.answered }}</p>
            <p class="text-xs text-gray-500">پاسخ داده شده</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-green-600"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.closed }}</p>
            <p class="text-xs text-gray-500">بسته شده</p>
          </div>
        </div>
      </div>
      <!-- Total Stats -->
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <i class="ti ti-list-details text-gray-600"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ ticketStore.tickets.length }}</p>
            <p class="text-xs text-gray-500">کل تیکت‌ها</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
              v-model="filters.search"
              type="text"
              placeholder="جستجو در تیکت‌ها..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <AppSelect
            v-model="filters.status"
            :options="statusOptions"
            placeholder="وضعیت"
            icon="ti ti-filter"
        />
        <AppSelect
            v-model="filters.priority"
            :options="priorityOptions"
            placeholder="اولویت"
            icon="ti ti-flag"
        />
        <AppSelect
            v-model="filters.category"
            :options="categoryOptions"
            placeholder="دسته‌بندی"
            icon="ti ti-category"
        />
      </div>
    </div>

    <!-- Tickets List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="ticketStore.loading" class="p-8 text-center text-gray-500">
        <i class="ti ti-loader animate-spin text-2xl"></i>
        <p class="mt-2">در حال بارگذاری...</p>
      </div>
      <div v-else class="divide-y divide-gray-100">
        <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            @click="openTicket(ticket)"
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div class="flex items-start gap-4">
            <!-- Status Icon -->
            <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                :class="getStatusBgClass(ticket.status)"
            >
              <i :class="[getStatusIcon(ticket.status), getStatusIconClass(ticket.status)]"></i>
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-gray-900">{{ ticket.subject }}</h3>
                <span
                    class="px-2 py-0.5 text-xs rounded-full"
                    :class="getPriorityClass(ticket.priority)"
                >
                  {{ getPriorityLabel(ticket.priority) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 line-clamp-1">{{ getLastMessage(ticket) }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <i class="ti ti-user"></i>
                  {{ ticket.user?.fullName || 'کاربر' }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="ti ti-building-store"></i>
                  {{ ticket.tenant?.name || 'فروشگاه' }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="ti ti-clock"></i>
                  {{ formatTime(ticket.updatedAt) }}
                </span>
              </div>
            </div>
            <!-- Meta -->
            <div class="text-left shrink-0">
              <p class="text-xs text-gray-400">#{{ ticket.id.slice(0, 8) }}...</p>
              <p class="text-xs text-gray-500 mt-1">{{ getDepartmentLabel(ticket.department) }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Empty State -->
      <div v-if="!ticketStore.loading && filteredTickets.length === 0" class="p-12 text-center">
        <i class="ti ti-ticket-off text-5xl text-gray-300"></i>
        <p class="mt-4 text-gray-500">تیکتی یافت نشد</p>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="selectedTicket = null"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="getStatusBgClass(selectedTicket.status)"
            >
              <i :class="[getStatusIcon(selectedTicket.status), getStatusIconClass(selectedTicket.status)]"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ selectedTicket.subject }}</h3>
              <p class="text-xs text-gray-500">تیکت #{{ selectedTicket.user?.fullName }}•{{ selectedTicket.id.slice(0, 8) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <AppSelect
                v-model="selectedTicket.status"
                :options="statusOptions.slice(1)"
                widthClass="min-w-[130px]"
                :fullWidth="false"
                @change="updateTicketStatus"
            />
            <button @click="selectedTicket = null" class="p-2 hover:bg-gray-100 rounded-lg">
              <i class="ti ti-x text-gray-500"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref="messagesContainer">
          <div
              v-for="message in selectedTicket.messages"
              :key="message.id"
              :class="message.isAdmin ? 'flex-row-reverse' : ''"
              class="flex gap-3"
          >
            <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                :class="message.isAdmin ? 'bg-indigo-100' : 'bg-gray-200'"
            >
              <i :class="message.isAdmin ? 'ti ti-headset text-indigo-600' : 'ti ti-user text-gray-600'"></i>
            </div>
            <div
                class="flex-1 max-w-[80%]"
                :class="message.isAdmin ? 'text-left' : 'text-right'"
            >
              <div
                  class="inline-block p-4 rounded-2xl text-sm shadow-sm"
                  :class="message.isAdmin ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'"
              >
                <!-- Text Content -->
                <p v-if="message.content" class="whitespace-pre-wrap leading-relaxed">{{ message.content }}</p>
                <!-- Attachments -->
                <div v-if="message.attachments && message.attachments.length" class="mt-2 space-y-2">
                  <div v-for="(file, idx) in message.attachments" :key="idx">
                    <!-- Image -->
                    <img
                        v-if="isImage(file)"
                        :src="file"
                        :alt="file"
                        class="max-w-full rounded-lg cursor-pointer hover:opacity-90 border border-gray-100"
                        @click="openImagePreview(file)"
                    />
                    <!-- File (String URL) -->
                    <a
                        v-else
                        :href="file"
                        target="_blank"
                        class="flex items-center gap-2 px-3 py-2 rounded-lg"
                        :class="message.isAdmin ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-gray-100 hover:bg-gray-200'"
                    >
                      <i class="ti ti-file text-lg"></i>
                      <span class="text-xs truncate">دانلود فایل</span>
                      <i class="ti ti-download text-xs mr-auto"></i>
                    </a>
                  </div>
                </div>
                <p
                    class="text-[10px] mt-1 opacity-70"
                    :class="message.isAdmin ? 'text-indigo-100' : 'text-gray-400'"
                >
                  {{ formatTime(message.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Box -->
        <div class="p-4 border-t border-gray-200 shrink-0 bg-white">
          <!-- Attachment Preview -->
          <div v-if="attachments.length" class="mb-3 flex flex-wrap gap-2">
            <div
                v-for="(file, idx) in attachments"
                :key="idx"
                class="relative group"
            >
              <img
                  v-if="file.type.startsWith('image/')"
                  :src="file.preview"
                  class="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <div
                  v-else
                  class="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-2"
              >
                <i class="ti ti-file text-2xl text-gray-400"></i>
                <span class="text-[10px] text-gray-500 truncate w-full text-center mt-1">{{ file.name }}</span>
              </div>
              <button
                  @click="removeAttachment(idx)"
                  class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i class="ti ti-x text-xs"></i>
              </button>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="flex-1 relative">
              <textarea
                  v-model="replyText"
                  ref="replyTextarea"
                  rows="3"
                  placeholder="پاسخ خود را بنویسید... (Ctrl+V برای paste اسکرین‌شات)"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500"
                  @paste="handlePaste"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="handleDrop"
                  :class="{ 'border-indigo-500 bg-indigo-50': isDragging }"
              ></textarea>
              <!-- Drag Overlay -->
              <div
                  v-if="isDragging"
                  class="absolute inset-0 bg-indigo-100/80 rounded-xl flex items-center justify-center pointer-events-none"
              >
                <div class="text-center">
                  <i class="ti ti-upload text-3xl text-indigo-600"></i>
                  <p class="text-sm text-indigo-600 mt-1">فایل را رها کنید</p>
                </div>
              </div>
              <!-- Attachment Buttons -->
              <div class="absolute bottom-2 left-2 flex gap-1">
                <button
                    @click="$refs.fileInput.click()"
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="آپلود فایل"
                >
                  <i class="ti ti-paperclip text-gray-400"></i>
                </button>
                <button
                    @click="$refs.imageInput.click()"
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="آپلود تصویر"
                >
                  <i class="ti ti-photo text-gray-400"></i>
                </button>
              </div>
              <!-- Hidden File Inputs -->
              <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  @change="handleFileSelect"
                  multiple
              />
              <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageSelect"
                  multiple
              />
            </div>
            <div class="flex flex-col gap-2">
              <button
                  @click="sendReply"
                  :disabled="isSendingReply || (!replyText.trim() && !attachments.length)"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="ti ti-send ml-1"></i>
                {{ isSendingReply ? 'در حال ارسال...' : 'ارسال' }}
              </button>
              <button
                  @click="closeTicketAction"
                  class="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
              >
                <i class="ti ti-check ml-1"></i>
                بستن تیکت
              </button>
            </div>
          </div>
          <!-- Quick Replies -->
          <div class="flex flex-wrap gap-2 mt-3">
            <button
                v-for="quick in quickReplies"
                :key="quick"
                @click="replyText = quick"
                class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-600 transition-colors"
            >
              {{ quick }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click="previewImage = null">
      <div class="absolute inset-0 bg-black/80"></div>
      <div class="relative max-w-4xl max-h-[90vh]">
        <img :src="previewImage" class="max-w-full max-h-[90vh] object-contain rounded-lg" />
        <button
            @click="previewImage = null"
            class="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
        >
          <i class="ti ti-x text-gray-700"></i>
        </button>
        <a
            :href="previewImage"
            download
            @click.stop
            class="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
        >
          <i class="ti ti-download text-gray-700"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useTicketStore} from "@/stores/ticket.js";
import { useUploader } from "@/composables/useUploader"
import AppSelect from '@/components/AppSelect.vue'

// --- Store & Composables ---
const ticketStore = useTicketStore()
const uploader = useUploader()

// --- Refs ---
const messagesContainer = ref(null)
const replyTextarea = ref(null)
const fileInput = ref(null)
const imageInput = ref(null)

// --- State ---
const selectedTicket = ref(null)
const replyText = ref('')
const attachments = ref([])
const isDragging = ref(false)
const previewImage = ref(null)
const isSendingReply = ref(false)

// --- Lifecycle ---
onMounted(() => {
  ticketStore.fetchTickets()
})

// --- Computed Stats (Based on Store Data) ---
const stats = computed(() => {
  const all = ticketStore.tickets
  return {
    open: all.filter(t => t?.status === 'open').length,
    answered: all.filter(t => t?.status === 'answered').length,
    closed: all.filter(t => t?.status === 'closed').length
  }
})

const openTickets = computed(() => stats.value.open)

// --- Filters ---
const filters = ref({
  search: '',
  status: '',
  priority: '',
  category: ''
})

const statusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'open', label: 'در انتظار پاسخ' },
  { value: 'answered', label: 'پاسخ داده شده' },
  { value: 'closed', label: 'بسته شده' }
]

const priorityOptions = [
  { value: '', label: 'همه اولویت‌ها' },
  { value: 'high', label: 'فوری' },
  { value: 'medium', label: 'متوسط' },
  { value: 'low', label: 'کم' }
]

const categoryOptions = [
  { value: '', label: 'همه دسته‌ها' },
  { value: 'technical', label: 'فنی' },
  { value: 'financial', label: 'مالی' },
  { value: 'account', label: 'حساب کاربری' },
  { value: 'other', label: 'سایر' }
]

// --- Computed Filtered Tickets ---
const filteredTickets = computed(() => {
  return ticketStore.tickets.filter(ticket => {
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      const subject = (ticket?.subject || '').toLowerCase()
      const user = (ticket?.user?.fullName || '').toLowerCase()
      const tenant = (ticket?.tenant?.name || '').toLowerCase()
      if (!subject.includes(search) && !user.includes(search) && !tenant.includes(search)) {
        return false
      }
    }
    if (filters.value.status && ticket?.status !== filters.value.status) return false
    if (filters.value.priority && ticket?.priority !== filters.value.priority) return false
    return !(filters.value.category && ticket?.department !== filters.value.category);

  })
})

// --- Helper Functions ---
const getStatusBgClass = (status) => {
  const map = {
    open: 'bg-orange-100',
    answered: 'bg-green-100',
    closed: 'bg-gray-100'
  }
  return map[status] || 'bg-gray-100'
}

const getStatusIcon = (status) => {
  const map = {
    open: 'ti ti-clock',
    answered: 'ti ti-message-check',
    closed: 'ti ti-check'
  }
  return map[status] || 'ti ti-ticket'
}

const getStatusIconClass = (status) => {
  const map = {
    open: 'text-orange-600',
    answered: 'text-green-600',
    closed: 'text-gray-600'
  }
  return map[status] || 'text-gray-600'
}

const getPriorityClass = (priority) => {
  const map = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-gray-100 text-gray-600'
  }
  return map[priority] || 'bg-gray-100 text-gray-600'
}

const getPriorityLabel = (priority) => {
  const map = {
    high: 'فوری',
    medium: 'متوسط',
    low: 'کم'
  }
  return map[priority] || 'نامشخص'
}

const getDepartmentLabel = (dept) => {
  const map = {
    technical: 'فنی',
    financial: 'مالی',
    account: 'حساب کاربری',
    other: 'سایر'
  }
  return map[dept] || dept
}

const getLastMessage = (ticket) => {
  if (ticket.messages && ticket.messages.length > 0) {
    const last = ticket.messages[ticket.messages.length - 1]
    return last.content
  }
  return 'بدون پیام'
}

const isImage = (url) => {
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url)
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

// --- Actions ---
const quickReplies = [
  'با تشکر از صبر شما، در حال بررسی هستیم.',
  'لطفاً اسکرین‌شات از مشکل ارسال کنید.',
  'مشکل برطرف شد. در صورت نیاز مجدداً تماس بگیرید.',
  'لطفاً شماره تماس خود را ارسال کنید.'
]

const openTicket = (ticket) => {
  // کپی عمیق برای جلوگیری از تغییر مستقیم در استور قبل از ذخیره
  selectedTicket.value = JSON.parse(JSON.stringify(ticket))
  attachments.value = []
  replyText.value = ''

  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const updateTicketStatus = async () => {
  if (!selectedTicket.value) return
  await ticketStore.updateTicketStatus(selectedTicket.value.id, selectedTicket.value.status)
}

// --- File Handling ---
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addFiles(files)
  event.target.value = ''
}

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)
  addFiles(files)
  event.target.value = ''
}

const handlePaste = (event) => {
  const items = event.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item?.type.startsWith('image/')) {
      const file = item?.getAsFile()
      if (file) addFiles([file])
    }
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  addFiles(files)
}

const addFiles = (files) => {
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      attachments.value.push({
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const openImagePreview = (url) => {
  previewImage.value = url
}

const sendReply = async () => {
  if (!replyText.value?.trim() && !attachments.value.length) return

  isSendingReply.value = true
  try {
    // 1. Prepare Data
    // بررسی می‌کنیم که آیا آیتم‌ها فایل خام (File Object) هستند یا خیر
    // اگر فایل خام باشند، آن‌ها را لیست می‌کنیم، در غیر این صورت آرایه خالی می‌فرستیم
    const filesToSend = attachments.value.map(att => {
      // اگر att خودش فایل است (مثلا از input file آمده)
      if (att instanceof File) return att
      // اگر att آبجکت باشد و پراپرتی file داشته باشد (مثل ساختار کاربر)
      if (att?.file && att.file instanceof File) return att.file
      return null
    }).filter(item => item !== null) // حذف مقادیر نال

    const payload = {
      content: replyText.value,
      files: filesToSend // ارسال لیست فایل‌های خام به استور
    }

    // 2. Call Store Action
    const result = await ticketStore.sendReply(selectedTicket.value.id, payload)

    if (result.success) {
      // 3. Update Local UI
      const newMessage = {
        id: Date.now(),
        content: replyText.value,
        attachments: result.attachments || [], // لینک‌های نهایی از سرور
        createdAt: new Date().toISOString(),
        isAdmin: true
      }

      selectedTicket.value.messages.push(newMessage)

      // Update status locally
      if (selectedTicket.value.status === 'open') {
        selectedTicket.value.status = 'answered'
      }

      // Clear inputs
      replyText.value = ''
      attachments.value = []

      // Scroll to bottom
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    } else {
      alert(result.error || 'خطا در ارسال پاسخ')
    }
  } catch (error) {
    console.error(error)
    alert('خطا در ارسال پاسخ')
  } finally {
    isSendingReply.value = false
  }
}

const closeTicketAction = async () => {
  if (selectedTicket.value) {
    await ticketStore.updateTicketStatus(selectedTicket.value.id, 'closed')
    selectedTicket.value.status = 'closed'
    selectedTicket.value = null
  }
}
</script>