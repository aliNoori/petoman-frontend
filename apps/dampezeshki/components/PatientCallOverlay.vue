<template>
  <!-- پنل تماس ورودی (Overlay) -->
  <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
  >
    <div
        v-if="isIncomingCall"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center">

        <!-- هدر پنل -->
        <div class="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
          <div class="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-md border-4 border-white/30 animate-pulse">
            <i class="ti ti-phone-incoming text-5xl"></i>
          </div>
          <h2 class="text-2xl font-bold mb-1">تماس ورودی</h2>
          <p class="text-emerald-100 text-sm">پزشک شما در حال تماس است...</p>
        </div>

        <!-- اطلاعات تماس -->
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-center gap-3 text-gray-700">
            <i class="ti ti-stethoscope text-xl text-emerald-600"></i>
            <span class="font-medium text-lg">کلینیک دامپزشکی</span>
          </div>

          <p class="text-gray-500 text-sm">
            لطفاً برای برقراری ارتباط صوتی، دکمه سبز را فشار دهید.
          </p>

          <!-- المان صوتی مخفی برای پخش صدای دکتر -->
          <audio ref="remoteAudio" autoplay></audio>
        </div>

        <!-- دکمه‌های کنترل -->
        <div class="p-6 bg-gray-50 flex items-center justify-center gap-6">
          <!-- دکمه رد تماس -->
          <button
              @click="rejectCall"
              class="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <i class="ti ti-phone-off text-2xl"></i>
          </button>

          <!-- دکمه پاسخ به تماس -->
          <button
              v-if="!isCallConnected"
              @click="answerCall"
              class="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-bounce"
          >
            <i class="ti ti-phone text-3xl"></i>
          </button>

          <!-- دکمه قطع تماس (بعد از وصل شدن) -->
          <button
              v-else
              @click="endCall"
              class="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <i class="ti ti-phone-off text-3xl"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Peer } from 'peerjs'
import { useAuthStore} from "~/stores/auth";
import { useAppointmentStore} from "~/stores/appointment.store";

const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()

// --- متغیرها ---
const peer = ref(null)
const currentCall = ref(null)
const localStream = ref(null)
const remoteStream = ref(null)
const remoteAudio = ref(null)

const isIncomingCall = ref(false)
const isCallConnected = ref(false)

// --- توابع ---

// ۱. راه‌اندازی Peer بیمار
const initPeer = async () => {
  // دریافت PeerID از دیتابیس یا پروفایل کاربر
  // اگر کاربر هنوز peerId ندارد، باید یک بار ساخته شود و ذخیره گردد
  let myPeerId = authStore.user?.peerId

  if (!myPeerId) {
    // تولید ID تصادفی اگر وجود ندارد
    myPeerId = 'patient_' + Math.random().toString(36).substr(2, 9)
    // اینجا باید آپدیت شود روی سرور
    await authStore.updatePeerId(myPeerId)
  }

  peer.value = new Peer(myPeerId)

  peer.value.on('open', (id) => {
    console.log('Patient Peer ID is: ' + id)
  })

  // گوش دادن به تماس ورودی
  peer.value.on('call', async (call) => {
    // نمایش پنل تماس ورودی
    isIncomingCall.value = true

    // ذخیره آبجکت تماس برای پاسخ دادن بعداً
    currentCall.value = call

    // پخش صدای زنگ (اختیاری)
    // playRingtone()
  })
}

// ۲. پاسخ به تماس
const answerCall = async () => {
  try {
    // دریافت دسترسی میکروفون
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })

    // پاسخ دادن به تماس با ارسال استریم خودمان
    currentCall.value.answer(localStream.value)

    // دریافت استریم دکتر
    currentCall.value.on('stream', (userStream) => {
      remoteStream.value = userStream
      isCallConnected.value = true

      // اتصال استریم به تگ audio برای پخش صدا
      if (remoteAudio.value) {
        remoteAudio.value.srcObject = userStream
      }
    })

    // وقتی تماس قطع شد
    currentCall.value.on('close', () => {
      resetCallUI()
    })

  } catch (err) {
    console.error('Error answering call:', err)
    alert('دسترسی به میکروفون رد شد. تماس برقرار نمی‌شود.')
  }
}

// ۳. رد کردن تماس (قبل از وصل شدن)
const rejectCall = () => {
  if (currentCall.value) {
    currentCall.value.close() // بستن کانال
  }
  resetCallUI()
}

// ۴. قطع تماس (بعد از وصل شدن)
const endCall = () => {
  if (currentCall.value) {
    currentCall.value.close()
  }
  resetCallUI()
}

// ریست کردن UI
const resetCallUI = () => {
  isIncomingCall.value = false
  isCallConnected.value = false
  currentCall.value = null

  // قطع میکروفون
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop())
    localStream.value = null
  }
  remoteStream.value = null
}

// راه‌اندازی هنگام لود کامپوننت
onMounted(() => {
  initPeer()
})

// پاکسازی هنگام خروج
onUnmounted(() => {
  if (peer.value) peer.value.destroy()
})
</script>