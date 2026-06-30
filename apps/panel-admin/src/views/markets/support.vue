<template>
  <div class="space-y-6">
    <!-- Notification Toast -->
    <Transition name="slide-in">
      <div
          v-if="notification.show"
          :class="[
          'fixed top-4 left-4 z-50 min-w-80 p-4 rounded-lg shadow-lg border transform transition-all duration-300',
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          'bg-red-50 border-red-200 text-red-800'
        ]"
      >
        <div class="flex items-start gap-3">
          <i
              :class="[
                'text-2xl mt-0.5',
                notification.type === 'success' ? 'ti ti-circle-check' : 'ti ti-alert-circle'
              ]"
          ></i>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <button
              @click="notification.show = false"
              class="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <i class="ti ti-x text-lg"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">پشتیبانی فروشگاه‌های پتومن</h1>
          <p class="text-blue-100">ارسال تیکت و دریافت پشتیبانی از تیم پتومن</p>
        </div>
        <div class="hidden md:block">
          <div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i class="ti ti-headset text-5xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Contact Info -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-6">
        <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
          <i class="ti ti-phone text-white text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">تماس تلفنی</h3>
        <p class="text-gray-600 text-sm mb-2">شنبه تا چهارشنبه</p>
        <p class="text-blue-600 font-bold" dir="ltr">021-1234-5678</p>
      </div>
      <div class="bg-white rounded-xl p-6">
        <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
          <i class="ti ti-mail text-white text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">ایمیل</h3>
        <p class="text-gray-600 text-sm mb-2">پاسخگویی 24 ساعته</p>
        <p class="text-blue-600 font-bold">shop-support@petoman.com</p>
      </div>
      <div class="bg-white rounded-xl p-6">
        <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4">
          <i class="ti ti-clock text-white text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">ساعات کاری</h3>
        <p class="text-gray-600 text-sm mb-2">شنبه تا چهارشنبه</p>
        <p class="text-gray-900 font-bold">9:00 - 18:00</p>
      </div>
    </div>

    <!-- Ticket Form -->
    <div class="bg-white rounded-xl p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <i class="ti ti-ticket text-blue-600 text-2xl"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">ارسال تیکت جدید</h2>
          <p class="text-sm text-gray-500">لطفاً مشکل یا سوال خود را با جزئیات بیان کنید</p>
        </div>
      </div>

      <form @submit.prevent="submitTicket" class="space-y-6">
        <!-- Department -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="ti ti-category text-gray-400 ml-1"></i>
            دپارتمان <span class="text-red-500">*</span>
          </label>
          <button
              type="button"
              @click="showDepartmentDropdown = !showDepartmentDropdown"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right flex items-center justify-between"
              :class="!ticketForm.department ? 'text-gray-400' : 'text-gray-900'"
          >
            <span>{{ selectedDepartmentLabel || 'انتخاب دپارتمان...' }}</span>
            <i class="ti ti-chevron-down transition-transform" :class="showDepartmentDropdown ? 'rotate-180' : ''"></i>
          </button>
          <Transition name="slide-down">
            <ul
                v-if="showDepartmentDropdown"
                class="absolute top-full right-0 left-0 mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden z-10 shadow-lg"
            >
              <li
                  v-for="dept in departments"
                  :key="dept.value"
                  @click="selectDepartment(dept)"
                  class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
                  :class="ticketForm.department === dept.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'"
              >
                <i :class="dept.icon" class="text-xl"></i>
                <span>{{ dept.label }}</span>
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="ti ti-alert-circle text-gray-400 ml-1"></i>
            اولویت <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-3 gap-3">
            <label
                v-for="priority in priorities"
                :key="priority.value"
                class="relative cursor-pointer"
            >
              <input
                  v-model="ticketForm.priority"
                  type="radio"
                  :value="priority.value"
                  class="peer sr-only"
                  required
              >
              <div
                  class="p-3 border-2 border-gray-200 rounded-lg text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50">
                <i :class="[priority.icon, 'text-2xl mb-1', priority.color]"></i>
                <p class="text-sm font-medium text-gray-900">{{ priority.label }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="ti ti-text text-gray-400 ml-1"></i>
            موضوع <span class="text-red-500">*</span>
          </label>
          <input
              v-model="ticketForm.subject"
              type="text"
              required
              placeholder="عنوان مشکل یا سوال خود را بنویسید..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
        </div>

        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="ti ti-message text-gray-400 ml-1"></i>
            توضیحات کامل <span class="text-red-500">*</span>
          </label>
          <textarea
              v-model="ticketForm.message"
              required
              rows="6"
              placeholder="لطفاً مشکل یا سوال خود را با جزئیات کامل توضیح دهید..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">حداقل 20 کاراکتر</p>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="ti ti-paperclip text-gray-400 ml-1"></i>
            پیوست فایل (اختیاری)
          </label>
          <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
                type="file"
                @change="handleFileUpload"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                class="hidden"
                id="fileUpload"
            >
            <label for="fileUpload" class="cursor-pointer">
              <i class="ti ti-cloud-upload text-4xl text-gray-400 mb-2 block"></i>
              <p class="text-sm text-gray-600 mb-1">برای انتخاب فایل کلیک کنید</p>
              <p class="text-xs text-gray-500">تصاویر، PDF، Word (حداکثر 5MB)</p>
            </label>
            <div v-if="ticketForm.files.length > 0" class="mt-4 space-y-2">
              <div
                  v-for="(file, index) in ticketForm.files"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span class="text-sm text-gray-700 truncate max-w-[80%]">{{ file.name }}</span>
                <button
                    @click="removeFile(index)"
                    type="button"
                    class="text-red-500 hover:text-red-700 p-1"
                >
                  <i class="ti ti-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center gap-4">
          <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-send ml-2"></i>
            {{ isSubmitting ? 'در حال ارسال...' : 'ارسال تیکت' }}
          </button>
          <button
              type="button"
              @click="resetForm"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            <i class="ti ti-refresh ml-2"></i>
            پاک کردن
          </button>
        </div>
      </form>
    </div>

    <!-- Recent Tickets -->
    <div class="bg-white rounded-xl p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">تیکت‌های اخیر شما</h2>

      <div v-if="ticketStore.loading" class="text-center py-8 text-gray-500">
        <i class="ti ti-loader animate-spin text-2xl mb-2"></i>
        <p>در حال بارگذاری...</p>
      </div>

      <div v-else-if="ticketStore.tickets.length === 0" class="text-center py-8 text-gray-400">
        <i class="ti ti-ticket-off text-4xl mb-2"></i>
        <p>هنوز تیکتی ثبت نکرده‌اید.</p>
      </div>

      <div v-else class="space-y-3">
        <div
            v-for="ticket in ticketStore.tickets"
            :key="ticket.id"
            @click="openTicketDetail(ticket)"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div class="flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                :class="getStatusClass(ticket.status)"
            >
              <i :class="getStatusIcon(ticket.status)" class="text-2xl"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-medium text-gray-900 truncate">{{ ticket.subject }}</h3>
              <p class="text-sm text-gray-500 text-xs mt-1">
                {{ getDepartmentLabel(ticket.department) }} • {{ formatDate(ticket.createdAt) }}
              </p>
            </div>
          </div>
          <span
              class="px-3 py-1 rounded-full text-xs font-bold shrink-0"
              :class="getStatusBadgeClass(ticket.status)"
          >
            {{ getStatusLabel(ticket.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Ticket Detail Modal (Chat) -->
    <div v-if="selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeTicketDetail"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        <!-- Modal Header -->
        <div class="p-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="getStatusClass(selectedTicket.status)"
            >
              <i :class="getStatusIcon(selectedTicket.status)" class="text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ selectedTicket.subject }}</h3>
              <p class="text-xs text-gray-500">{{ getDepartmentLabel(selectedTicket.department) }}</p>
            </div>
          </div>
          <button @click="closeTicketDetail" class="p-2 hover:bg-gray-200 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref="messagesContainer">
          <div v-if="selectedTicket.messages && selectedTicket.messages.length > 0">
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
                  <p v-if="message.content" class="whitespace-pre-wrap leading-relaxed">{{ message.content }}</p>
                  <!-- Attachments -->
                  <div v-if="message.attachments && message.attachments.length" class="mt-2 space-y-2">
                    <div v-for="(file, idx) in message.attachments" :key="idx">
                      <img
                          v-if="isImage(file)"
                          :src="file"
                          class="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                          @click="previewImage = file"
                      />
                      <a
                          v-else
                          :href="file"
                          target="_blank"
                          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        <i class="ti ti-file"></i>
                        <span class="text-xs">دانلود فایل</span>
                      </a>
                    </div>
                  </div>
                  <p class="text-[10px] mt-1 opacity-70" :class="message.isAdmin ? 'text-indigo-100' : 'text-gray-400'">
                    {{ formatTime(message.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-4">
            پیامی وجود ندارد.
          </div>
        </div>

        <!-- Reply Box -->
        <div class="p-4 border-t border-gray-200 shrink-0 bg-white">
          <!-- پیام هشدار در صورت عدم امکان ارسال -->
          <div v-if="!canUserReply" class="mb-3 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm flex items-center gap-2">
            <i class="ti ti-info-circle"></i>
            <span>شما در حال حاضر نمی‌توانید پیام ارسال کنید. لطفاً تا پاسخ پشتیبان صبر کنید.</span>
          </div>
          <!-- Attachment Preview -->
          <div v-if="replyAttachments.length" class="mb-3 flex flex-wrap gap-2">
            <div
                v-for="(file, idx) in replyAttachments"
                :key="idx"
                class="relative group"
            >
              <img
                  v-if="file.type.startsWith('image/')"
                  :src="file.preview"
                  class="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <div
                  v-else
                  class="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-1"
              >
                <i class="ti ti-file text-xl text-gray-400"></i>
              </div>
              <button
                  @click="removeReplyAttachment(idx)"
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
                  rows="3"
                  placeholder="پاسخ خود را بنویسید..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <div class="absolute bottom-2 left-2 flex gap-1">
                <button
                    @click="$refs.replyFileInput.click()"
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="آپلود فایل"
                >
                  <i class="ti ti-paperclip text-gray-400"></i>
                </button>
                <input
                    ref="replyFileInput"
                    type="file"
                    class="hidden"
                    @change="handleReplyFileSelect"
                    multiple
                />
              </div>
            </div>
            <button
                @click="sendReply"
                :disabled="isSendingReply || (!replyText.trim() && !replyAttachments.length )|| !canUserReply"
                class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              <i class="ti ti-send ml-1"></i>
              {{ isSendingReply ? 'در حال ارسال...' : 'ارسال' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="fixed inset-0 z-[60] flex items-center justify-center p-4"
         @click="previewImage = null">
      <div class="absolute inset-0 bg-black/80"></div>
      <img :src="previewImage" class="relative max-w-full max-h-[90vh] object-contain rounded-lg"/>
    </div>

  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick} from 'vue'
import {useTicketStore} from "@/stores/ticket.js";
import {useUploader} from "@/composables/useUploader";

const ticketStore = useTicketStore()
const uploader = useUploader()

// --- State ---
const tenantId = computed(() => {
  const tenantStr = localStorage.getItem('tenant_id')
  return tenantStr || null
})

const ticketForm = ref({
  tenantId: tenantId.value,
  department: '',
  priority: '',
  subject: '',
  message: '',
  files: []
})

const showDepartmentDropdown = ref(false)
const notification = ref({show: false, type: 'success', message: ''})
const isSubmitting = ref(false)

// --- Chat / Modal State ---
const selectedTicket = ref(null)
const replyText = ref('')
const replyAttachments = ref([])
const isSendingReply = ref(false)
const previewImage = ref(null)
const messagesContainer = ref(null)

// --- Data Lists ---
const departments = [
  {value: 'technical', label: 'پشتیبانی فنی', icon: 'ti ti-settings'},
  {value: 'financial', label: 'امور مالی و تسویه', icon: 'ti ti-wallet'},
  {value: 'orders', label: 'مشکلات سفارشات', icon: 'ti ti-shopping-cart'},
  {value: 'products', label: 'مدیریت محصولات', icon: 'ti ti-package'},
  {value: 'account', label: 'مشکلات حساب کاربری', icon: 'ti ti-user'},
  {value: 'other', label: 'سایر موارد', icon: 'ti ti-dots'}
]

const priorities = [
  {value: 'low', label: 'کم', icon: 'ti ti-arrow-down', color: 'text-green-500'},
  {value: 'medium', label: 'متوسط', icon: 'ti ti-minus', color: 'text-orange-500'},
  {value: 'high', label: 'بالا', icon: 'ti ti-arrow-up', color: 'text-red-500'}
]

// --- Computed ---
const selectedDepartmentLabel = computed(() => {
  const dept = departments.find(d => d.value === ticketForm.value.department)
  return dept ? dept.label : ''
})

// --- Methods: Create Ticket ---
const selectDepartment = (dept) => {
  ticketForm.value.department = dept.value
  showDepartmentDropdown.value = false
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  ticketForm.value.files.push(...files)
}

const removeFile = (index) => {
  ticketForm.value.files.splice(index, 1)
}

const submitTicket = async () => {
  if (!ticketForm.value.department) {
    showNotification('error', 'لطفاً دپارتمان را انتخاب کنید')
    return
  }
  if (!ticketForm.value.priority) {
    showNotification('error', 'لطفاً اولویت تیکت را مشخص کنید')
    return
  }
  if (!ticketForm.value.subject.trim()) {
    showNotification('error', 'لطفاً موضوع تیکت را وارد کنید')
    return
  }
  if (ticketForm.value.message.length < 20) {
    showNotification('error', 'لطفاً توضیحات بیشتری ارائه دهید (حداقل 20 کاراکتر)')
    return
  }

  isSubmitting.value = true
  ticketForm.value.tenantId = tenantId.value

  const result = await ticketStore.submitTicket(ticketForm.value)

  if (result.success) {
    showNotification('success', 'تیکت شما با موفقیت ثبت شد.')
    resetForm()
    await ticketStore.fetchTickets()
  } else {
    showNotification('error', result.error || 'خطایی در ثبت تیکت رخ داد')
  }

  isSubmitting.value = false
}

const showNotification = (type, message) => {
  notification.value = {show: true, type, message}
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const resetForm = () => {
  ticketForm.value = {
    tenantId: tenantId.value,
    department: '',
    priority: '',
    subject: '',
    message: '',
    files: []
  }
}

// --- Methods: Chat / Reply ---
const openTicketDetail = async (ticket) => {
  // دریافت جزئیات کامل تیکت (شامل پیام‌ها) از سرور
  // اگر استور شما متد findOne دارد که پیام‌ها را لود می‌کند، از آن استفاده کنید
  // در اینجا فرض می‌کنیم ticket.messages در لیست اولیه پر نشده و باید لود شود

  // روش ساده: استفاده از همان آبجکت اگر پیام‌ها را دارد
  // روش بهتر: ریکوئست جداگانه
  selectedTicket.value = {...ticket}

  // اگر پیام‌ها لود نشده‌اند، باید از استور بخواهیم دوباره لود کند (اختیاری)
  // await ticketStore.fetchTicketDetail(ticket.id)

  replyText.value = ''
  replyAttachments.value = []

  await nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const closeTicketDetail = () => {
  selectedTicket.value = null
}

const handleReplyFileSelect = (event) => {
  const files = Array.from(event.target.files)
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      replyAttachments.value.push({
        file,
        name: file.name,
        type: file.type,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

const removeReplyAttachment = (index) => {
  replyAttachments.value.splice(index, 1)
}
// بررسی اینکه آیا آخرین پیام از طرف ادمین بوده یا خیر
const canUserReply = computed(() => {
  if (!selectedTicket.value || !selectedTicket.value.messages || selectedTicket.value.messages.length === 0) {
    return true // اگر پیامی نیست، کاربر می‌تواند اولین پیام را بفرستد
  }
  const lastMessage = selectedTicket.value.messages[selectedTicket.value.messages.length - 1]
  return lastMessage.isAdmin // فقط اگر آخرین پیام ادمین بوده، کاربر می‌تواند پاسخ دهد
})
const sendReply = async () => {
  // بررسی مجوز ارسال
  if (!canUserReply.value) {
    showNotification('error', 'لطفاً تا پاسخ پشتیبانی صبر کنید.')
    return
  }

  if (!replyText.value.trim() && !replyAttachments.value.length) return

  isSendingReply.value = true
  try {
    const payload = {
      content: replyText.value,
      files: replyAttachments.value.map(att => att?.file)
    }

    const result = await ticketStore.sendReply(selectedTicket.value.id, payload)
    if (result.success) {
      const newMessage = {
        id: Date.now(),
        content: payload.content,
        attachments: result.attachments || [],
        createdAt: new Date().toISOString(),
        isAdmin: false
      }
      if (!selectedTicket.value.messages) selectedTicket.value.messages = []
      selectedTicket.value.messages.push(newMessage)

      // وضعیت را به "در انتظار پاسخ" تغییر می‌دهیم چون کاربر پیام فرستاده
      selectedTicket.value.status = 'open'

      replyText.value = ''
      replyAttachments.value = []
      await nextTick(() => {
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
// --- Helpers ---
const getStatusClass = (status) => {
  const classes = {
    open: 'bg-blue-100',
    answered: 'bg-green-100',
    closed: 'bg-gray-100'
  }
  return classes[status] || 'bg-gray-100'
}

const getStatusIcon = (status) => {
  const icons = {
    open: 'ti ti-clock text-blue-600',
    answered: 'ti ti-message-check text-green-600',
    closed: 'ti ti-check text-gray-600'
  }
  return icons[status] || 'ti ti-help'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    open: 'bg-blue-100 text-blue-700',
    answered: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'در انتظار پاسخ',
    answered: 'پاسخ داده شده',
    closed: 'بسته شده'
  }
  return labels[status] || 'نامشخص'
}

const getDepartmentLabel = (value) => {
  const dept = departments.find(d => d.value === value)
  return dept ? dept.label : value
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fa-IR')
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isImage = (url) => {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

// --- Lifecycle ---
onMounted(() => {
  ticketStore.fetchTickets()
})
</script>