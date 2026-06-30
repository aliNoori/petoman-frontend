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
        <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
          <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">افزودن آدرس جدید</h3>
          
          <form @submit.prevent="submitAddress" class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان آدرس</label>
              <input 
                v-model="form.title"
                type="text"
                placeholder="مثلا: خانه، محل کار"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <!-- Province & City -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">استان</label>
                <select 
                  v-model="form.province"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="tehran">تهران</option>
                  <option value="isfahan">اصفهان</option>
                  <option value="mashhad">خراسان رضوی</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شهر</label>
                <select 
                  v-model="form.city"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="tehran">تهران</option>
                </select>
              </div>
            </div>
            
            <!-- Full Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">آدرس کامل</label>
              <textarea 
                v-model="form.fullAddress"
                rows="3"
                placeholder="خیابان، کوچه، پلاک، واحد"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
              ></textarea>
            </div>
            
            <!-- Postal Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">کد پستی (اختیاری)</label>
              <input 
                v-model="form.postalCode"
                type="text"
                placeholder="کد پستی ۱۰ رقمی"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit"
              class="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-colors"
            >
              ذخیره آدرس
            </button>
          </form>
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

const emit = defineEmits(['update:visible', 'address-added'])

const form = reactive({
  title: '',
  province: '',
  city: '',
  fullAddress: '',
  postalCode: ''
})

const close = () => {
  emit('update:visible', false)
}

const submitAddress = () => {
  const newAddress = {
    id: Date.now(),
    ...form
  }
  emit('address-added', newAddress)
  
  // Reset form
  Object.keys(form).forEach(key => form[key] = '')
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
