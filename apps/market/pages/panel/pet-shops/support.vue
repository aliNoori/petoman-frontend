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
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
          <i class="ti ti-phone text-white text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">تماس تلفنی</h3>
        <p class="text-gray-600 text-sm mb-2">شنبه تا چهارشنبه</p>
        <p class="text-blue-600 font-bold" dir="ltr">021-1234-5678</p>
      </div>

      <div class="bg-white rounded-xl p-6">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
          <i class="ti ti-mail text-white text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">ایمیل</h3>
        <p class="text-gray-600 text-sm mb-2">پاسخگویی 24 ساعته</p>
        <p class="text-blue-600 font-bold">shop-support@petoman.com</p>
      </div>

      <div class="bg-white rounded-xl p-6">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4">
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
              class="absolute top-full right-0 left-0 mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden z-10"
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
              <div class="p-3 border-2 border-gray-200 rounded-lg text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50">
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
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                <span class="text-sm text-gray-700">{{ file.name }}</span>
                <button
                  @click="removeFile(index)"
                  type="button"
                  class="text-red-500 hover:text-red-700"
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
      <div class="space-y-3">
        <div
          v-for="ticket in recentTickets"
          :key="ticket.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="getStatusClass(ticket.status)"
            >
              <i :class="getStatusIcon(ticket.status)" class="text-2xl"></i>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ ticket.subject }}</h3>
              <p class="text-sm text-gray-500">{{ ticket.department }} • {{ ticket.date }}</p>
            </div>
          </div>
          <span
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="getStatusBadgeClass(ticket.status)"
          >
            {{ getStatusLabel(ticket.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'pet-shop'
})

const ticketForm = ref({
  department: '',
  priority: '',
  subject: '',
  message: '',
  files: []
})

const showDepartmentDropdown = ref(false)

const notification = ref({
  show: false,
  type: 'success',
  message: ''
})

const departments = [
  { value: 'technical', label: 'پشتیبانی فنی', icon: 'ti ti-settings' },
  { value: 'financial', label: 'امور مالی و تسویه', icon: 'ti ti-wallet' },
  { value: 'orders', label: 'مشکلات سفارشات', icon: 'ti ti-shopping-cart' },
  { value: 'products', label: 'مدیریت محصولات', icon: 'ti ti-package' },
  { value: 'account', label: 'مشکلات حساب کاربری', icon: 'ti ti-user' },
  { value: 'other', label: 'سایر موارد', icon: 'ti ti-dots' }
]

const selectedDepartmentLabel = computed(() => {
  const dept = departments.find(d => d.value === ticketForm.value.department)
  return dept ? dept.label : ''
})

const selectDepartment = (dept) => {
  ticketForm.value.department = dept.value
  showDepartmentDropdown.value = false
}

const priorities = [
  { value: 'low', label: 'کم', icon: 'ti ti-arrow-down', color: 'text-green-500' },
  { value: 'medium', label: 'متوسط', icon: 'ti ti-minus', color: 'text-orange-500' },
  { value: 'high', label: 'بالا', icon: 'ti ti-arrow-up', color: 'text-red-500' }
]

const isSubmitting = ref(false)

const recentTickets = ref([
  {
    id: 1,
    subject: 'مشکل در پرداخت تسویه',
    department: 'امور مالی',
    date: '1403/08/04',
    status: 'open'
  },
  {
    id: 2,
    subject: 'سوال درباره مدیریت موجودی',
    department: 'پشتیبانی فنی',
    date: '1403/08/02',
    status: 'answered'
  },
  {
    id: 3,
    subject: 'درخواست فعالسازی ویژگی جدید',
    department: 'سایر موارد',
    date: '1403/07/28',
    status: 'closed'
  }
])

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

  // Simulate API call
  setTimeout(() => {
    showNotification('success', 'تیکت شما با موفقیت ثبت شد. به زودی پاسخ داده خواهد شد.')
    resetForm()
    isSubmitting.value = false
  }, 2000)
}

const showNotification = (type, message) => {
  notification.value = {
    show: true,
    type,
    message
  }
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const resetForm = () => {
  ticketForm.value = {
    department: '',
    priority: '',
    subject: '',
    message: '',
    files: []
  }
}

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

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showDepartmentDropdown.value = false
    }
  })
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  max-height: 300px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-in-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
