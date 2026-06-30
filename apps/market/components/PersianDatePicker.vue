<template>
  <!-- استفاده از ClientOnly برای جلوگیری از خطای سمت سرور -->
  <ClientOnly>
    <div class="persian-datepicker-wrapper">
      <DatePicker
          v-model="dateValue"
          :placeholder="placeholder"
          :format="format"
          :display-format="displayFormat"
          :type="type"
          :auto-submit="autoSubmit"
          :clearable="clearable"
          :editable="false"
          class="w-full"
          color="#f97316"
      />
    </div>

    <!-- یک Placeholder ساده برای زمانی که هنوز لود نشده (اختیاری) -->
    <template #fallback>
      <div class="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 animate-pulse">
        در حال بارگذاری تقویم...
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, watch } from 'vue'
// ایمپورت باید داخل اسکریپت باشد، اما اجرای آن توسط ClientOnly کنترل می‌شود
import DatePicker from 'vue3-persian-datetime-picker'

const props = defineProps({
  modelValue: {
    type: [String, Number, Date, null, undefined],
    default: null
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  },
  displayFormat: {
    type: String,
    default: 'jYYYY/jMM/jDD HH:mm'
  },
  type: {
    type: String,
    default: 'datetime'
  },
  autoSubmit: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: 'انتخاب تاریخ و زمان شمسی...'
  }
})

const emit = defineEmits(['update:modelValue'])
const dateValue = ref(props.modelValue || null)

watch(() => props.modelValue, (newVal) => {
  dateValue.value = newVal || null
})

watch(dateValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
.persian-datepicker-wrapper {
  width: 100%;
}

:deep(.vpd-input-group input) {
  width: 100%;
  padding: 12px 40px 12px 12px;
  font-family: Vazirmatn, Vazir, sans-serif !important;
  direction: rtl !important;
  text-align: right !important;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: #fff;
  cursor: pointer;
}

:deep(.vpd-input-group input:focus) {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

:deep(.vpd-container) {
  font-family: Vazirmatn, Vazir, sans-serif !important;
  direction: rtl !important;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.vpd-header) {
  background-color: #f97316 !important;
  color: white !important;
  border-radius: 12px 12px 0 0;
}

:deep(.vpd-actions button) {
  font-family: Vazirmatn, Vazir, sans-serif !important;
}
</style>