<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

        <!-- Modal panel -->
        <div class="inline-block w-full max-w-4xl my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <i class="ti ti-shopping-cart text-white text-2xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">جزئیات سفارش {{ order?.code || '-' }}</h3>
                <p class="text-sm text-gray-600">{{ order?.date || '-' }}</p>
              </div>
            </div>
            <button @click="$emit('close')" class="p-2 hover:bg-white rounded-lg transition-colors">
              <i class="ti ti-x text-gray-600 text-xl"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <!-- Status Change Section -->
            <div class="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="ti ti-switch-horizontal text-purple-600"></i>
                تغییر وضعیت سفارش
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  @click="$emit('change-status', order.id, 'processing')"
                  :class="order.status === 'processing' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'"
                  class="px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border-2 border-blue-600"
                >
                  <i class="ti ti-loader"></i>
                  در انتظار
                </button>
                <button
                  @click="$emit('change-status', order.id, 'shipped')"
                  :class="order.status === 'shipped' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50'"
                  class="px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border-2 border-purple-600"
                >
                  <i class="ti ti-truck"></i>
                  ارسال شده
                </button>
                <button
                  @click="$emit('change-status', order.id, 'delivered')"
                  :class="order.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50'"
                  class="px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border-2 border-green-600"
                >
                  <i class="ti ti-check"></i>
                  تحویل داده شد
                </button>
                <button
                  @click="$emit('change-status', order.id, 'cancelled')"
                  :class="order.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-white text-red-600 hover:bg-red-50'"
                  class="px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border-2 border-red-600"
                >
                  <i class="ti ti-x"></i>
                  لغو شده
                </button>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="mb-6">
              <span 
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                :class="getStatusClass(order.status)"
              >
                <i :class="getStatusIcon(order.status)"></i>
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <!-- Customer Info -->
            <div class="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="ti ti-user-circle text-purple-600"></i>
                اطلاعات مشتری
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">نام و نام خانوادگی</p>
                  <p class="font-medium text-gray-900">{{ order.customer }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">شماره تماس</p>
                  <p class="font-medium text-gray-900" dir="ltr">{{ order.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Products List -->
            <div class="bg-purple-50 rounded-xl p-4 mb-4">
              <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="ti ti-package text-purple-600"></i>
                محصولات سفارش ({{ order.items.length }} محصول)
              </h4>
              <div class="space-y-2">
                <div
                  v-for="item in order.items"
                  :key="item.name"
                  class="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <i :class="`ti ${item.icon} text-purple-600`"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ item.name }}</p>
                      <p class="text-sm text-gray-600">تعداد: {{ item.quantity }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Price -->
            <div class="bg-green-50 rounded-xl p-4 mb-4">
              <div class="flex items-center justify-between">
                <span class="font-bold text-gray-900">مبلغ کل سفارش:</span>
                <span class="text-2xl font-bold text-green-700">{{ formatMoney(order.total) }} تومان</span>
              </div>
            </div>

            <!-- Existing Notes -->
            <div v-if="order.note" class="bg-blue-50 rounded-xl p-4 mb-4">
              <h4 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="ti ti-note text-blue-600"></i>
                یادداشت
              </h4>
              <p class="text-gray-700">{{ order.note }}</p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex items-center gap-2">
              <!-- Print Invoice -->
              <button
                @click="$emit('print', order)"
                class="px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <i class="ti ti-printer"></i>
                دانلود فاکتور PDF
              </button>
            </div>

            <div class="flex items-center gap-2">
              <!-- Close Button -->
              <button
                @click="$emit('close')"
                class="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2 font-bold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'print', 'change-status'])

const note = ref('')

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusIcon = (status) => {
  const icons = {
    processing: 'ti ti-loader',
    shipped: 'ti ti-truck',
    delivered: 'ti ti-check',
    cancelled: 'ti ti-x'
  }
  return icons[status] || 'ti ti-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    processing: 'در انتظار پرداخت',
    shipped: 'در حال ارسال',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده'
  }
  return labels[status] || 'نامشخص'
}

// Reset note when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    note.value = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .inline-block,
.modal-leave-active .inline-block {
  transition: all 0.3s ease;
}

.modal-enter-from .inline-block,
.modal-leave-to .inline-block {
  transform: scale(0.95) translateY(-20px);
}
</style>
