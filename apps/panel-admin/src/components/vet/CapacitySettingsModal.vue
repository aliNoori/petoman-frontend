<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
          v-if="isOpen"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
          @click.self="close"
      >
        <!-- تغییر: در موبایل تمام صفحه (h-screen) و در دسکتاپ max-h -->
        <div
            class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl h-[100dvh] sm:max-h-[90vh] overflow-hidden flex flex-col border-0 sm:border border-gray-200 shadow-2xl"
        >
          <!-- هدر -->
          <div class="bg-gradient-to-l from-emerald-600 to-emerald-500 p-4 sm:p-6 text-white flex items-center justify-between flex-shrink-0">
            <div>
              <h2 class="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                <i class="ti ti-settings text-xl sm:text-2xl"></i>
                <span class="hidden sm:inline">تنظیمات ظرفیت و دسترسی</span>
                <span class="sm:hidden">تنظیمات</span>
              </h2>
              <p class="text-emerald-100 text-xs sm:text-sm mt-1">
                مدیریت سرویس‌های آنی و زمان‌دار
              </p>
            </div>
            <button
                @click="close"
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <i class="ti ti-x text-base sm:text-lg"></i>
            </button>
          </div>

          <!-- محتوای اسکرول‌شدنی -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">

            <!-- ⚡ وضعیت آنلاین/آفلاین -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-5">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <i class="ti ti-power text-emerald-600"></i>
                    وضعیت حضور در سیستم
                  </h3>
                  <p class="text-xs sm:text-sm text-gray-500 mt-1">
                    وقتی آفلاین هستید، درخواست جدید دریافت نمی‌کنید
                  </p>
                </div>
                <button
                    @click="toggleOnlineStatus"
                    :class="[
                    'relative w-12 h-7 sm:w-16 sm:h-8 rounded-full transition-colors duration-300',
                    localSettings.isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                      :class="[
                      'absolute top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center',
                      localSettings.isOnline ? 'translate-x-0 sm:translate-x-0' : '-translate-x-5 sm:-translate-x-9'
                    ]"
                  >
                    <i :class="[
                      'text-xs',
                      localSettings.isOnline ? 'ti ti-check text-emerald-500' : 'ti ti-x text-gray-400'
                    ]"></i>
                  </span>
                </button>
              </div>
              <!-- حالت مزاحم نشوید -->
              <div class="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <div>
                  <p class="text-xs sm:text-sm font-medium text-gray-700">حالت مزاحم نشوید (DND)</p>
                  <p class="text-xs text-gray-500">حتی آنلاین بودن، مشاوره جدید پذیرفته نمی‌شود</p>
                </div>
                <button
                    @click="toggleDnd"
                    :class="[
                    'relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-300',
                    localSettings.doNotDisturb ? 'bg-amber-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                      :class="[
                      'absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-300',
                      localSettings.doNotDisturb ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                    ]"
                  ></span>
                </button>
              </div>
            </div>

            <!-- 💬 سرویس گفتگوی آنلاین -->
            <div
                class="bg-white border-2 rounded-2xl p-4 sm:p-5 transition-all"
                :class="localSettings.chatEnabled ? 'border-indigo-200' : 'border-gray-200 opacity-60'"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-message-circle text-lg sm:text-xl text-indigo-600"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm sm:text-base">گفتگوی آنلاین (Text)</h3>
                    <p class="text-xs sm:text-sm text-gray-500">مشاوره متنی آنی</p>
                  </div>
                </div>
                <button
                    @click="localSettings.chatEnabled = !localSettings.chatEnabled"
                    :class="[
                    'relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-300',
                    localSettings.chatEnabled ? 'bg-indigo-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                      :class="[
                      'absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-300',
                      localSettings.chatEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                    ]"
                  ></span>
                </button>
              </div>
              <div v-if="localSettings.chatEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">حداکثر ظرفیت همزان</label>
                  <div class="flex items-center gap-2">
                    <button @click="decrement('chatCapacity')" class="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                      <i class="ti ti-minus text-xs sm:text-sm"></i>
                    </button>
                    <input
                        v-model.number="localSettings.chatCapacity"
                        type="number"
                        min="1"
                        max="20"
                        class="flex-1 h-9 sm:h-10 px-2 sm:px-3 border border-gray-300 rounded-xl text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button @click="increment('chatCapacity', 20)" class="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                      <i class="ti ti-plus text-xs sm:text-sm"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">فعال: {{ currentStats.chat?.active || 0 }}</p>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">مدت هر مشاوره (دقیقه)</label>
                  <select
                      v-model="localSettings.chatDuration"
                      class="w-full h-9 sm:h-10 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="5">۵ دقیقه</option>
                    <option value="10">۱۰ دقیقه</option>
                    <option value="15">۱۵ دقیقه</option>
                    <option value="20">۲۰ دقیقه</option>
                    <option value="30">۳۰ دقیقه</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 📞 سرویس تماس فوری -->
            <div
                class="bg-white border-2 rounded-2xl p-4 sm:p-5 transition-all"
                :class="localSettings.phoneInstantEnabled ? 'border-red-200' : 'border-gray-200 opacity-60'"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-phone text-lg sm:text-xl text-red-600"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm sm:text-base">تماس فوری (Phone Instant)</h3>
                    <p class="text-xs sm:text-sm text-gray-500">تماس تلفنی آنی و بدون نوبت</p>
                  </div>
                </div>
                <button
                    @click="localSettings.phoneInstantEnabled = !localSettings.phoneInstantEnabled"
                    :class="[
                    'relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-300',
                    localSettings.phoneInstantEnabled ? 'bg-red-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                      :class="[
                      'absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-300',
                      localSettings.phoneInstantEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                    ]"
                  ></span>
                </button>
              </div>
              <div v-if="localSettings.phoneInstantEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">حداکثر ظرفیت همزان</label>
                  <div class="flex items-center gap-2">
                    <button @click="decrement('phoneInstantCapacity')" class="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <i class="ti ti-minus text-xs sm:text-sm"></i>
                    </button>
                    <input
                        v-model.number="localSettings.phoneInstantCapacity"
                        type="number"
                        min="1"
                        max="10"
                        class="flex-1 h-9 sm:h-10 px-2 sm:px-3 border border-gray-300 rounded-xl text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button @click="increment('phoneInstantCapacity', 10)" class="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <i class="ti ti-plus text-xs sm:text-sm"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">فعال: {{ currentStats.phoneInstant?.active || 0 }}</p>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">مدت هر تماس (دقیقه)</label>
                  <select
                      v-model="localSettings.phoneInstantDuration"
                      class="w-full h-9 sm:h-10 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="5">۵ دقیقه</option>
                    <option value="10">۱۰ دقیقه</option>
                    <option value="15">۱۵ دقیقه</option>
                    <option value="20">۲۰ دقیقه</option>
                    <option value="30">۳۰ دقیقه</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 📅 سرویس تماس زمان‌دار -->
            <div
                class="bg-white border-2 rounded-2xl p-4 sm:p-5 transition-all"
                :class="localSettings.phoneScheduledEnabled ? 'border-amber-200' : 'border-gray-200 opacity-60'"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-calendar-time text-lg sm:text-xl text-amber-600"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm sm:text-base">تماس زمان‌دار (Phone Scheduled)</h3>
                    <p class="text-xs sm:text-sm text-gray-500">تماس در زمان مشخص شده توسط کاربر</p>
                  </div>
                </div>
                <button
                    @click="localSettings.phoneScheduledEnabled = !localSettings.phoneScheduledEnabled"
                    :class="[
                    'relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-300',
                    localSettings.phoneScheduledEnabled ? 'bg-amber-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                      :class="[
                      'absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform duration-300',
                      localSettings.phoneScheduledEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                    ]"
                  ></span>
                </button>
              </div>
              <div v-if="localSettings.phoneScheduledEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">حداکثر ظرفیت همزان</label>
                  <div class="flex items-center gap-2">
                    <button @click="decrement('phoneScheduledCapacity')" class="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <i class="ti ti-minus text-xs sm:text-sm"></i>
                    </button>
                    <input
                        v-model.number="localSettings.phoneScheduledCapacity"
                        type="number"
                        min="1"
                        max="10"
                        class="flex-1 h-9 sm:h-10 px-2 sm:px-3 border border-gray-300 rounded-xl text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button @click="increment('phoneScheduledCapacity', 10)" class="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <i class="ti ti-plus text-xs sm:text-sm"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">فعال: {{ currentStats.phoneScheduled?.active || 0 }}</p>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">مدت هر تماس (دقیقه)</label>
                  <select
                      v-model="localSettings.phoneScheduledDuration"
                      class="w-full h-9 sm:h-10 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="10">۱۰ دقیقه</option>
                    <option value="15">۱۵ دقیقه</option>
                    <option value="20">۲۰ دقیقه</option>
                    <option value="30">۳۰ دقیقه</option>
                    <option value="45">۴۵ دقیقه</option>
                    <option value="60">۶۰ دقیقه</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 📊 تنظیمات صف انتظار -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-5 border border-blue-100">
              <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <i class="ti ti-users text-blue-600"></i>
                تنظیمات صف انتظار
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">حداکثر طول صف</label>
                  <input
                      v-model.number="localSettings.maxQueueLength"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full h-9 sm:h-10 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="۲۰"
                  />
                  <p class="text-xs text-gray-400 mt-1">۰ = بدون محدودیت</p>
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">حداکثر زمان انتظار (دقیقه)</label>
                  <input
                      v-model.number="localSettings.maxQueueWaitTime"
                      type="number"
                      min="15"
                      max="180"
                      class="w-full h-9 sm:h-10 px-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="۶۰"
                  />
                  <p class="text-xs text-gray-400 mt-1">بعد از این زمان، درخواست منقضی می‌شود</p>
                </div>
              </div>
            </div>

            <!-- نمایش آمار فعلی -->
            <div class="bg-gray-100 rounded-2xl p-4 sm:p-5">
              <h3 class="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <i class="ti ti-chart-bar text-gray-600"></i>
                وضعیت فعلی
              </h3>
              <!-- تغییر: گرید ۳ ستونه در دسکتاپ، ۱ ستونه در موبایل -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div class="bg-white rounded-xl p-3 sm:p-4">
                  <div class="flex items-center justify-center gap-2 mb-1">
                    <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span class="text-xs text-gray-500">گفتگو</span>
                  </div>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">
                    {{ currentStats.chat?.active || 0 }}
                    <span class="text-xs sm:text-sm font-normal text-gray-400">/ {{ currentStats.chat?.max || localSettings.chatCapacity }}</span>
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ currentStats.chat?.queue || 0 }} در صف</p>
                </div>
                <div class="bg-white rounded-xl p-3 sm:p-4">
                  <div class="flex items-center justify-center gap-2 mb-1">
                    <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span class="text-xs text-gray-500">تماس فوری</span>
                  </div>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">
                    {{ currentStats.phoneInstant?.active || 0 }}
                    <span class="text-xs sm:text-sm font-normal text-gray-400">/ {{ currentStats.phoneInstant?.max || localSettings.phoneInstantCapacity }}</span>
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ currentStats.phoneInstant?.queue || 0 }} در صف</p>
                </div>
                <div class="bg-white rounded-xl p-3 sm:p-4">
                  <div class="flex items-center justify-center gap-2 mb-1">
                    <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span class="text-xs text-gray-500">تماس زمان‌دار</span>
                  </div>
                  <p class="text-lg sm:text-xl font-bold text-gray-900">
                    {{ currentStats.phoneScheduled?.active || 0 }}
                    <span class="text-xs sm:text-sm font-normal text-gray-400">/ {{ currentStats.phoneScheduled?.max || localSettings.phoneScheduledCapacity }}</span>
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ currentStats.phoneScheduled?.queue || 0 }} در صف</p>
                </div>
              </div>
            </div>
          </div>

          <!-- فوتر -->
          <div class="p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 bg-white">
            <button
                @click="resetToDefaults"
                class="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
            >
              <i class="ti ti-refresh"></i>
              بازنشانی
            </button>
            <div class="flex gap-3 w-full sm:w-auto">
              <button
                  @click="close"
                  class="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                انصراف
              </button>
              <button
                  @click="saveSettings"
                  :disabled="isSaving"
                  class="flex-1 sm:flex-none px-6 py-2 sm:px-8 sm:py-2.5 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <i v-if="isSaving" class="ti ti-loader animate-spin"></i>
                <i v-else class="ti ti-check"></i>
                {{ isSaving ? 'در حال ذخیره...' : 'ذخیره' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppointmentStore} from "@/stores/vet-clinic/appointment.js";

const props = defineProps({
  isOpen: Boolean,
  currentSettings: {
    type: Object,
    default: () => ({})
  },
  currentStats: {
    type: Object,
    default: () => ({
      chat: { active: 0, max: 1, queue: 0 },
      phoneInstant: { active: 0, max: 1, queue: 0 },
      phoneScheduled: { active: 0, max: 1, queue: 0 },
    })
  }
})

const emit = defineEmits(['close', 'update:settings'])

const appointmentStore = useAppointmentStore()

const isSaving = ref(false)

const DEFAULT_SETTINGS = {
  isOnline: true,
  doNotDisturb: false,
  // گفتگوی آنلاین
  chatEnabled: true,
  chatCapacity: 3,
  chatDuration: '15',
  // تماس فوری
  phoneInstantEnabled: true,
  phoneInstantCapacity: 2,
  phoneInstantDuration: '10',
  // تماس زمان‌دار
  phoneScheduledEnabled: true,
  phoneScheduledCapacity: 5,
  phoneScheduledDuration: '15',
  // صف انتظار
  maxQueueLength: 20,
  maxQueueWaitTime: 60,
}

const localSettings = reactive({ ...DEFAULT_SETTINGS })

// همگام‌سازی با مقادیر ورودی
watch(() => props.currentSettings, (newSettings) => {
  if (newSettings && Object.keys(newSettings).length > 0) {
    Object.assign(localSettings, newSettings)
  }
}, { immediate: true, deep: true })

// توابع کمکی
function increment(field, max) {
  if (localSettings[field] < max) {
    localSettings[field]++
  }
}

function decrement(field) {
  if (localSettings[field] > 1) {
    localSettings[field]--
  }
}

function resetToDefaults() {
  Object.assign(localSettings, DEFAULT_SETTINGS)
}

async function toggleOnlineStatus() {
  localSettings.isOnline = !localSettings.isOnline
  // ارسال فوری به سرور
  try {
    await appointmentStore.updateOnlineStatus(localSettings.isOnline)
  } catch (error) {
    console.error('خطا در تغییر وضعیت آنلاین:', error)
    localSettings.isOnline = !localSettings.isOnline // برگشت به حالت قبلی
  }
}

async function toggleDnd() {
  localSettings.doNotDisturb = !localSettings.doNotDisturb
  // ارسال فوری به سرور
  try {
    await appointmentStore.updateDoNotDisturb(localSettings.doNotDisturb)
  } catch (error) {
    console.error('خطا در تغییر وضعیت مزاحم نشوید:', error)
    localSettings.doNotDisturb = !localSettings.doNotDisturb // برگشت به حالت قبلی
  }
}

async function saveSettings() {
  isSaving.value = true
  try {
    const payload = {
      // وضعیت
      isOnline: localSettings.isOnline,
      doNotDisturb: localSettings.doNotDisturb,
      // گفتگو
      chatEnabled: localSettings.chatEnabled,
      chatCapacity: localSettings.chatCapacity,
      defaultConsultationDuration: parseInt(localSettings.chatDuration),
      // تماس فوری
      phoneInstantEnabled: localSettings.phoneInstantEnabled,
      phoneInstantCapacity: localSettings.phoneInstantCapacity,
      // تماس زمان‌دار
      phoneScheduledEnabled: localSettings.phoneScheduledEnabled,
      phoneScheduledCapacity: localSettings.phoneScheduledCapacity,
      // صف
      maxQueueLength: localSettings.maxQueueLength,
      maxQueueWaitTime: localSettings.maxQueueWaitTime,
    }

    await appointmentStore.updateCapacitySettings(payload)

    emit('update:settings', { ...localSettings })
    close()
  } catch (error) {
    console.error('خطا در ذخیره تنظیمات:', error)
  } finally {
    isSaving.value = false
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>