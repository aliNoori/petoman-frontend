<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      
      <!-- هدر -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">مدیریت مدارک</h1>
        <p class="text-gray-600">آپلود و مدیریت مدارک رسمی پت مارکت</p>
      </div>

      <!-- پیشرفت کلی -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900">پیشرفت کلی</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ uploadedCount }} از {{ totalDocs }} مدرک آپلود شده
            </p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-blue-600">{{ progress }}%</div>
            <div class="text-sm text-gray-500 mt-1">
              <span :class="verifiedCount === uploadedCount && uploadedCount > 0 ? 'text-green-600' : 'text-orange-600'">
                {{ verifiedCount }} تایید شده
              </span>
            </div>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="h-3 rounded-full transition-all duration-500"
            :class="progress === 100 ? 'bg-green-600' : 'bg-blue-600'"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- لیست مدارک -->
      <div class="grid gap-6 mb-6">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <!-- هدر مدرک -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-4">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="doc.uploaded ? 'bg-green-100' : 'bg-gray-100'"
                >
                  <i 
                    :class="[doc.icon, 'text-2xl', doc.uploaded ? 'text-green-600' : 'text-gray-400']"
                  ></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ doc.name }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ doc.description }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <!-- وضعیت آپلود -->
                    <span 
                      v-if="doc.uploaded"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClass(doc.status)"
                    >
                      <i :class="getStatusIcon(doc.status)"></i>
                      {{ getStatusLabel(doc.status) }}
                    </span>
                    <span v-else class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      <i class="ti ti-clock"></i>
                      در انتظار آپلود
                    </span>
                    
                    <!-- سایز فایل -->
                    <span v-if="doc.uploaded && doc.fileSize" class="text-xs text-gray-500">
                      {{ formatFileSize(doc.fileSize) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- دکمه‌های اقدام -->
              <div class="flex items-center gap-2">
                <button
                  v-if="doc.uploaded"
                  @click="previewFile(doc)"
                  class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="پیش‌نمایش"
                >
                  <i class="ti ti-eye text-lg"></i>
                </button>
                <button
                  v-if="doc.uploaded"
                  @click="downloadFile(doc)"
                  class="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="دانلود"
                >
                  <i class="ti ti-download text-lg"></i>
                </button>
                <button
                  v-if="doc.uploaded"
                  @click="removeFile(doc.id)"
                  class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title="حذف"
                >
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </div>

            <!-- نمایش دلیل رد -->
            <div
              v-if="doc.status === 'rejected' && doc.rejectionReason"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start gap-2">
                <i class="ti ti-alert-circle text-red-600 text-lg mt-0.5"></i>
                <div>
                  <p class="text-sm font-medium text-red-800">دلیل رد:</p>
                  <p class="text-sm text-red-700 mt-1">{{ doc.rejectionReason }}</p>
                </div>
              </div>
            </div>

            <!-- منطقه آپلود -->
            <div
              v-if="!doc.uploaded || doc.status === 'rejected'"
              class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all"
              :class="dragOver === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
              @dragover.prevent="dragOver = doc.id"
              @dragleave.prevent="dragOver = null"
              @drop.prevent="handleDrop(doc.id, $event)"
            >
              <input
                :id="'file-' + doc.id"
                type="file"
                :accept="doc.accept"
                @change="handleFileUpload(doc.id, $event)"
                class="hidden"
              >
              <label :for="'file-' + doc.id" class="cursor-pointer">
                <i class="ti ti-cloud-upload text-5xl text-gray-400 mb-3 block"></i>
                <p class="text-base font-medium text-gray-700 mb-1">
                  کلیک کنید یا فایل را بکشید و رها کنید
                </p>
                <p class="text-sm text-gray-500">
                  فرمت‌های مجاز: {{ doc.acceptLabel }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  حداکثر حجم: {{ doc.maxSize }}MB
                </p>
              </label>
            </div>

            <!-- نمایش فایل آپلود شده -->
            <div v-else class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <i class="ti ti-file-check text-2xl text-green-600"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ doc.fileName }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  آپلود شده در {{ doc.uploadDate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- دکمه‌های عملیات -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">عملیات کلی</h3>
            <p class="text-sm text-gray-600">مدیریت تمام مدارک آپلود شده</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="downloadAll"
              :disabled="uploadedCount === 0"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <i class="ti ti-download ml-2"></i>
              دانلود همه
            </button>
            <button
              @click="submitForReview"
              :disabled="uploadedCount === 0"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              <i class="ti ti-send ml-2"></i>
              ارسال برای بررسی
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- مودال پیش‌نمایش -->
    <Teleport to="body">
      <div
        v-if="previewModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closePreview"
      >
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ previewDoc?.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ previewDoc?.fileName }}</p>
            </div>
            <button
              @click="closePreview"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i class="ti ti-x text-xl text-gray-600"></i>
            </button>
          </div>
          <div class="p-6">
            <div class="bg-gray-100 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
              <div>
                <i class="ti ti-file text-6xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">پیش‌نمایش فایل</p>
                <p class="text-sm text-gray-500 mt-2">{{ previewDoc?.fileName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'pet-shop'
})

// State
const dragOver = ref(null)
const previewModal = ref(false)
const previewDoc = ref(null)

// داده‌های مدارک
const documents = ref([
  {
    id: 1,
    name: 'پروانه فعالیت',
    description: 'پروانه رسمی فعالیت پت مارکت از وزارت بهداشت',
    icon: 'ti ti-license',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptLabel: 'PDF, JPG, PNG',
    maxSize: 5,
    uploaded: true,
    fileName: 'license-2024.pdf',
    fileSize: 2048576,
    uploadDate: '1403/07/15',
    status: 'verified',
    rejectionReason: ''
  },
  {
    id: 2,
    name: 'گواهی صلاحیت',
    description: 'گواهی صلاحیت حرفه‌ای محصولساز مسئول',
    icon: 'ti ti-certificate',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptLabel: 'PDF, JPG, PNG',
    maxSize: 5,
    uploaded: true,
    fileName: 'certificate-manager.pdf',
    fileSize: 1536000,
    uploadDate: '1403/07/15',
    status: 'pending',
    rejectionReason: ''
  },
  {
    id: 3,
    name: 'کارت ملی',
    description: 'تصویر کارت ملی مدیر مسئول پت مارکت',
    icon: 'ti ti-id-badge',
    accept: '.jpg,.jpeg,.png',
    acceptLabel: 'JPG, PNG',
    maxSize: 2,
    uploaded: true,
    fileName: 'national-id.jpg',
    fileSize: 856432,
    uploadDate: '1403/07/16',
    status: 'rejected',
    rejectionReason: 'تصویر واضح نیست. لطفاً تصویر با کیفیت بهتر آپلود کنید.'
  },
  {
    id: 4,
    name: 'مدرک تحصیلی',
    description: 'مدرک تحصیلی محصولسازی',
    icon: 'ti ti-school',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptLabel: 'PDF, JPG, PNG',
    maxSize: 5,
    uploaded: false,
    fileName: '',
    fileSize: 0,
    uploadDate: '',
    status: 'pending',
    rejectionReason: ''
  },
  {
    id: 5,
    name: 'اجاره‌نامه/سند مالکیت',
    description: 'مدرک مالکیت یا اجاره محل پت مارکت',
    icon: 'ti ti-building',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptLabel: 'PDF, JPG, PNG',
    maxSize: 5,
    uploaded: false,
    fileName: '',
    fileSize: 0,
    uploadDate: '',
    status: 'pending',
    rejectionReason: ''
  },
  {
    id: 6,
    name: 'بیمه مسئولیت',
    description: 'بیمه‌نامه مسئولیت حرفه‌ای',
    icon: 'ti ti-shield-check',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptLabel: 'PDF, JPG, PNG',
    maxSize: 5,
    uploaded: false,
    fileName: '',
    fileSize: 0,
    uploadDate: '',
    status: 'pending',
    rejectionReason: ''
  }
])

// محاسبات
const totalDocs = computed(() => documents.value.length)
const uploadedCount = computed(() => documents.value.filter(d => d.uploaded).length)
const verifiedCount = computed(() => documents.value.filter(d => d.status === 'verified').length)
const progress = computed(() => Math.round((uploadedCount.value / totalDocs.value) * 100))

// توابع
const handleFileUpload = async (docId, event) => {
  const file = event.target.files[0]
  if (!file) return

  const doc = documents.value.find(d => d.id === docId)
  if (!doc) return

  // اعتبارسنجی حجم
  if (file.size > doc.maxSize * 1024 * 1024) {
    alert(`حجم فایل نباید بیشتر از ${doc.maxSize}MB باشد`)
    return
  }

  // اعتبارسنجی نوع فایل
  const fileExt = '.' + file.name.split('.').pop().toLowerCase()
  if (!doc.accept.includes(fileExt)) {
    alert(`فرمت فایل مجاز نیست. فرمت‌های مجاز: ${doc.acceptLabel}`)
    return
  }

  // آپلود فایل
  doc.uploaded = true
  doc.fileName = file.name
  doc.fileSize = file.size
  doc.uploadDate = new Date().toLocaleDateString('fa-IR')
  doc.status = 'pending'
  doc.rejectionReason = ''

  // نمایش پیام موفقیت
  console.log(`✓ فایل ${file.name} با موفقیت آپلود شد`)
}

const handleDrop = (docId, event) => {
  dragOver.value = null
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleFileUpload(docId, fakeEvent)
  }
}

const removeFile = (docId) => {
  if (!confirm('آیا از حذف این فایل اطمینان دارید؟')) return
  
  const doc = documents.value.find(d => d.id === docId)
  if (doc) {
    doc.uploaded = false
    doc.fileName = ''
    doc.fileSize = 0
    doc.uploadDate = ''
    doc.status = 'pending'
    doc.rejectionReason = ''
  }
}

const previewFile = (doc) => {
  previewDoc.value = doc
  previewModal.value = true
}

const closePreview = () => {
  previewModal.value = false
  previewDoc.value = null
}

const downloadFile = (doc) => {
  console.log('دانلود فایل:', doc.fileName)
  alert(`دانلود ${doc.fileName}`)
}

const downloadAll = () => {
  const uploadedDocs = documents.value.filter(d => d.uploaded)
  if (uploadedDocs.length === 0) return
  
  console.log('دانلود تمام مدارک')
  alert(`${uploadedDocs.length} فایل در حال دانلود...`)
}

const submitForReview = () => {
  const uploadedDocs = documents.value.filter(d => d.uploaded)
  if (uploadedDocs.length === 0) {
    alert('لطفاً حداقل یک مدرک آپلود کنید')
    return
  }
  
  alert(`✓ ${uploadedDocs.length} مدرک برای بررسی ارسال شد\n\nزمان تقریبی بررسی: 24-48 ساعت`)
}

// توابع کمکی
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-orange-100 text-orange-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return classes[status] || classes.pending
}

const getStatusIcon = (status) => {
  const icons = {
    pending: 'ti ti-clock',
    verified: 'ti ti-check',
    rejected: 'ti ti-x'
  }
  return icons[status] || icons.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'در حال بررسی',
    verified: 'تایید شده',
    rejected: 'رد شده'
  }
  return labels[status] || labels.pending
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
/* اضافه کردن انیمیشن برای drag and drop */
@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
  }
  50% {
    transform: translateY(0);
  }
}

.bounce {
  animation: bounce 1s ease-in-out infinite;
}
</style>




