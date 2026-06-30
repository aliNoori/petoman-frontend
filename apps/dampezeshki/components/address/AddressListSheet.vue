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
          
          <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">آدرس‌های من</h3>
          
          <div v-if="addresses.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ti ti-map-pin-off text-3xl text-gray-400"></i>
            </div>
            <p class="text-gray-500">هنوز آدرسی ثبت نکرده‌اید</p>
          </div>
          
          <div v-else class="space-y-3">
            <button 
              v-for="address in addresses"
              :key="address.id"
              @click="selectAddress(address)"
              class="w-full flex items-start gap-4 p-4 bg-gray-50 hover:bg-sky-50 rounded-2xl transition-colors text-right"
            >
              <div class="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <i class="ti ti-map-pin text-sky-500"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ address.title }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ address.fullAddress }}</p>
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

const emit = defineEmits(['update:visible', 'address-selected'])

// Mock addresses - replace with actual data
const addresses = ref([
  { id: 1, title: 'خانه', fullAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۳' },
  { id: 2, title: 'محل کار', fullAddress: 'تهران، میدان ونک، برج آسمان' }
])

const close = () => {
  emit('update:visible', false)
}

const selectAddress = (address) => {
  emit('address-selected', address)
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
