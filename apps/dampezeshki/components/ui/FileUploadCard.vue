<template>
  <div class="border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300">
    <div class="flex items-start gap-4 mb-4">
      <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <i class="ti ti-file-upload text-blue-600 text-2xl"></i>
      </div>
      <div class="flex-1">
        <h3 class="font-bold text-gray-900 mb-1">{{ label }}</h3>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </div>

    <!-- حالت انتخاب نشده -->
    <div v-if="!file" class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
      <label class="cursor-pointer block w-full h-full">
        <input type="file" accept="image/*,.pdf,video/*" @change="onFileChange" class="hidden" />
        <i class="ti ti-cloud-upload text-4xl text-gray-400 mb-2 block"></i>
        <p class="text-sm text-gray-600">کلیک کنید یا فایل را بکشید</p>
        <p class="text-xs text-gray-400 mt-1">PDF, JPG, PNG (حداکثر 5MB)</p>
      </label>
    </div>

    <!-- حالت انتخاب شده (پیش‌نمایش) -->
    <div v-else class="relative group">
      <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <!-- تصویر یا آیکون -->
        <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
          <img
              v-if="isImage(file)"
              :src="getFileUrl(file)"
              class="w-full h-full object-cover"
              alt="Preview"
          />
          <!-- ویدیو -->
          <video
              v-else-if="isVideo(file)"
              :src="getFileUrl(file)"
              class="w-full h-full object-cover"
              controls
              muted
          ></video>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <i class="ti ti-file-text text-2xl"></i>
          </div>
        </div>

        <!-- اطلاعات فایل -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
          <p class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
        </div>

        <!-- دکمه حذف -->
        <button
            @click.stop="$emit('remove')"
            class="w-8 h-8 rounded-full bg-white border border-gray-200 text-red-500 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all"
            title="حذف فایل"
        >
          <i class="ti ti-trash"></i>
        </button>
      </div>
      <p v-if="error" class="mt-2 text-xs text-red-600 flex items-center gap-1">
        <i class="ti ti-alert-circle"></i> {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  description: String,
  file: Object,
  error: String
})

const emit = defineEmits(['remove', 'file-selected'])

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('file-selected', file)
  }
}

const isImage = (file) => {
  return file && file.type.startsWith('image/')
}

const isVideo = (file) => {
  return file && file.type.startsWith('video/')
}

const getFileUrl = (file) => {
  return URL.createObjectURL(file)
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
</script>