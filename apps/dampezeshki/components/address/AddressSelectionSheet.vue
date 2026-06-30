<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="visible" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="close"
        ></div>
        
        <!-- Sheet -->
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">انتخاب آدرس</h3>
          
          <div class="space-y-4">
            <!-- Use Current Location -->
            <button 
              @click="useCurrentLocation"
              class="w-full flex items-center gap-4 p-4 bg-sky-50 hover:bg-sky-100 rounded-2xl transition-colors"
            >
              <div class="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                <i class="ti ti-current-location text-white text-xl"></i>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">موقعیت فعلی من</p>
                <p class="text-sm text-gray-500">استفاده از GPS</p>
              </div>
            </button>
            
            <!-- My Addresses -->
            <button 
              @click="$emit('open-my-addresses')"
              class="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <div class="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <i class="ti ti-bookmark text-gray-600 text-xl"></i>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">آدرس‌های من</p>
                <p class="text-sm text-gray-500">انتخاب از آدرس‌های ذخیره شده</p>
              </div>
            </button>
            
            <!-- Add New Address -->
            <button 
              @click="$emit('open-add-address')"
              class="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <div class="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <i class="ti ti-plus text-gray-600 text-xl"></i>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">افزودن آدرس جدید</p>
                <p class="text-sm text-gray-500">ثبت آدرس روی نقشه</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'open-add-address', 'open-my-addresses'])

const close = () => {
  emit('update:visible', false)
}

const useCurrentLocation = () => {
  // TODO: Implement geolocation
  close()
}
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
