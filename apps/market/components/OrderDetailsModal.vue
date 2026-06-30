<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
      <!-- Modal panel - Centered -->
      <div class="relative w-full max-w-4xl max-h-[90vh] flex flex-col text-right transition-all transform bg-white shadow-xl rounded-2xl overflow-hidden">
          <!-- Header - Sticky -->
          <div class="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <i class="ti ti-pill text-blue-600 text-xl md:text-2xl"></i>
              </div>
              <div>
                <h3 class="text-base md:text-lg font-bold text-gray-900">جزئیات سفارش {{ order.code }}</h3>
                <p class="text-xs md:text-sm text-gray-600">{{ order.date }}</p>
              </div>
            </div>
            <button @click="$emit('close')" class="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-gray-600 text-lg md:text-xl"></i>
            </button>
          </div>

          <!-- Content - Scrollable -->
          <div class="flex-1 overflow-y-auto px-3 md:px-6 py-2 md:py-3">
            <!-- Status Badge -->
            <div class="mb-3">
              <span 
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border-2"
                :class="getStatusClass(order.status)"
              >
                <i :class="getStatusIcon(order.status)"></i>
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <!-- Customer Info -->
            <div class="bg-white rounded-lg p-3 mb-3 border border-gray-200">
              <h4 class="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <i class="ti ti-user-circle text-gray-600"></i>
                اطلاعات صاحب حیوان
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs text-gray-600">نام و نام خانوادگی</p>
                  <p class="font-medium text-sm text-gray-900">{{ order.owner }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">شماره تماس</p>
                  <p class="font-medium text-sm text-gray-900" dir="ltr">{{ order.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Pet Info -->
            <div class="bg-white rounded-lg p-3 mb-3 border border-gray-200">
              <h4 class="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <i class="ti ti-paw text-gray-600"></i>
                اطلاعات حیوان خانگی
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs text-gray-600">نام حیوان</p>
                  <p class="font-medium text-sm text-gray-900">{{ order.pet }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">نوع حیوان</p>
                  <p class="font-medium text-sm text-gray-900">{{ order.petType }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Request Info - Collapsible -->
            <div class="bg-white rounded-lg p-3 mb-3 border border-gray-300">
              <button 
                @click="showCustomerRequest = !showCustomerRequest"
                class="w-full flex items-center justify-between text-right"
              >
                <h4 class="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <i class="ti ti-list text-gray-600"></i>
                  درخواست مشتری
                </h4>
                <i 
                  class="ti transition-transform text-gray-600"
                  :class="showCustomerRequest ? 'ti-chevron-up' : 'ti-chevron-down'"
                ></i>
              </button>
              
              <Transition name="collapse">
                <div v-if="showCustomerRequest" class="mt-3 space-y-2">
                  <!-- محصولات درخواستی به صورت هشتگ -->
                  <div>
                    <p class="text-xs text-gray-600 mb-1.5">محصولات درخواستی:</p>
                    <div class="flex flex-wrap gap-1.5">
                      <span 
                        v-for="(drug, idx) in order.medicine.split('،')" 
                        :key="idx"
                        class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-300"
                      >
                        #{{ drug.trim() }}
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="order.dosage">
                    <p class="text-xs text-gray-600 mb-1">توضیحات مشتری:</p>
                    <p class="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">{{ order.dosage }}</p>
                  </div>
                  
                  <div>
                    <span 
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border"
                      :class="order.hasPrescription ? 'bg-gray-100 text-gray-700 border-gray-300' : 'bg-gray-50 text-gray-600 border-gray-200'"
                    >
                      <i :class="order.hasPrescription ? 'ti ti-file-description' : 'ti ti-file-off'"></i>
                      {{ order.hasPrescription ? 'با نسخه دامپزشک' : 'بدون نسخه' }}
                    </span>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Medicine List Section (Only for pending orders) - Collapsible -->
            <div v-if="order.status === 'pending'" class="bg-white rounded-lg p-3 mb-3 border border-gray-300">
              <button 
                @click="showMedicineList = !showMedicineList"
                class="w-full flex items-center justify-between text-right mb-2"
              >
                <h4 class="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <i class="ti ti-pills text-gray-600"></i>
                  محصولات تجویز شده
                </h4>
                <i 
                  class="ti transition-transform text-gray-600"
                  :class="showMedicineList ? 'ti-chevron-up' : 'ti-chevron-down'"
                ></i>
              </button>

              <Transition name="collapse">
                <div v-if="showMedicineList">
                  <!-- Search Products Section -->
                  <div class="mb-3">
                    <div class="relative">
                      <input
                        v-model="searchTerm"
                        type="text"
                        placeholder="جستجوی محصول در موجودی فروشگاه..."
                        class="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      <i class="ti ti-search absolute right-2.5 top-2.5 text-gray-400 text-sm"></i>
                    </div>
                    
                    <!-- Search Results Dropdown -->
                    <div 
                      v-if="searchTerm && filteredProducts.length > 0" 
                      class="mt-1 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
                    >
                      <button
                        v-for="product in filteredProducts"
                        :key="product.id"
                        @click="addProductFromInventory(product)"
                        class="w-full px-3 py-2 text-right hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div class="flex items-center gap-2">
                          <img 
                            v-if="product.image" 
                            :src="product.image" 
                            :alt="product.name"
                            class="w-8 h-8 rounded object-cover"
                          />
                          <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center" v-else>
                            <i class="ti ti-package text-gray-400 text-sm"></i>
                          </div>
                          <div class="flex-1">
                            <p class="text-xs font-medium text-gray-900">{{ product.name }}</p>
                            <div class="flex items-center gap-2 text-[10px] text-gray-600">
                              <span>{{ formatPrice(product.price) }} تومان</span>
                              <span class="text-gray-400">|</span>
                              <span>موجودی: {{ product.stock }}</span>
                            </div>
                          </div>
                          <i class="ti ti-plus text-blue-600"></i>
                        </div>
                      </button>
                    </div>
                    
                    <!-- No Results -->
                    <div 
                      v-else-if="searchTerm && filteredProducts.length === 0" 
                      class="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center"
                    >
                      <p class="text-xs text-gray-500">محصولی با این نام یافت نشد</p>
                    </div>
                  </div>

                  <div class="flex justify-end mb-2">
                    <button
                      @click="addMedicine"
                      class="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <i class="ti ti-plus text-sm"></i>
                      افزودن دستی
                    </button>
                  </div>

                  <!-- Medicine List -->
                  <div v-if="medicines.length > 0" class="space-y-2 mb-2">
                <div
                  v-for="(med, index) in medicines"
                  :key="index"
                  class="bg-gray-50 rounded-lg p-2 border border-gray-300"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-gray-700">محصول {{ index + 1 }}</span>
                    <button
                      @click="removeMedicine(index)"
                      class="p-0.5 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                    >
                      <i class="ti ti-trash text-xs"></i>
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">نام محصول *</label>
                      <input
                        v-model="med.name"
                        type="text"
                        placeholder="مثال: آموکسی‌سیلین"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">قیمت (تومان) *</label>
                      <input
                        v-model.number="med.price"
                        type="number"
                        placeholder="150000"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">تعداد *</label>
                      <input
                        v-model="med.quantity"
                        type="text"
                        placeholder="1 بسته"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">تاریخ انقضاء</label>
                      <input
                        v-model="med.expiryDate"
                        type="text"
                        placeholder="1405/01/01"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div class="col-span-2">
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">نحوه مصرف *</label>
                      <input
                        v-model="med.dosage"
                        type="text"
                        placeholder="روزی 2 بار"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div class="col-span-2">
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">توضیحات</label>
                      <textarea
                        v-model="med.notes"
                        rows="1"
                        placeholder="توضیحات و هشدارها"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-500 focus:border-transparent resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total Price -->
              <div v-if="medicines.length > 0" class="bg-gray-100 rounded-lg p-2 border border-gray-300">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-sm text-gray-900">جمع کل:</span>
                  <span class="text-lg font-bold text-gray-900">{{ formatPrice(totalPrice) }} تومان</span>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-4">
                <i class="ti ti-medicine-syrup text-2xl text-gray-300 mb-1"></i>
                <p class="text-xs text-gray-500">هنوز محصولیی اضافه نشده</p>
              </div>
                </div>
              </Transition>
            </div>

            <!-- Display Medicines for other statuses - Collapsible -->
            <div v-else-if="order.medicines && order.medicines.length > 0" class="bg-white rounded-lg p-3 mb-3 border border-gray-300">
              <button 
                @click="showPrescribedMedicines = !showPrescribedMedicines"
                class="w-full flex items-center justify-between text-right mb-3"
              >
                <h4 class="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <i class="ti ti-pills text-gray-600"></i>
                  محصولات تجویز شده
                </h4>
                <i 
                  class="ti transition-transform text-gray-600"
                  :class="showPrescribedMedicines ? 'ti-chevron-up' : 'ti-chevron-down'"
                ></i>
              </button>
              
              <!-- محصولها به صورت هشتگ - همیشه نمایش داده میشه -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span 
                  v-for="(med, index) in order.medicines"
                  :key="index"
                  class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-300"
                >
                  #{{ med.name }}
                </span>
              </div>
              
              <!-- جزئیات کامل محصولها - Collapsible -->
              <Transition name="collapse">
                <div v-if="showPrescribedMedicines">
                  <div class="space-y-2 mb-2">
                    <div
                      v-for="(med, index) in order.medicines"
                      :key="index"
                      class="bg-gray-50 rounded-lg p-2 border border-gray-200"
                    >
                      <div class="flex justify-between items-start mb-1">
                        <h5 class="font-medium text-sm text-gray-900">{{ med.name }}</h5>
                        <span class="text-xs font-bold text-gray-700">{{ formatPrice(med.price) }} تومان</span>
                      </div>
                      <div class="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        <div>
                          <span>تعداد:</span>
                          <span class="font-medium text-gray-900 mr-1">{{ med.quantity }}</span>
                        </div>
                        <div v-if="med.expiryDate">
                          <span>انقضاء:</span>
                          <span class="font-medium text-gray-900 mr-1">{{ med.expiryDate }}</span>
                        </div>
                        <div class="col-span-2">
                          <span>نحوه مصرف:</span>
                          <span class="font-medium text-gray-900 mr-1">{{ med.dosage }}</span>
                        </div>
                        <div v-if="med.notes" class="col-span-2">
                          <span>توضیحات:</span>
                          <p class="text-gray-700 text-[10px] mt-0.5">{{ med.notes }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-2 border-t border-gray-300 flex justify-between items-center">
                    <span class="font-bold text-sm text-gray-900">جمع کل:</span>
                    <span class="text-base font-bold text-gray-900">{{ formatPrice(order.price) }} تومان</span>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Notes Section -->
            <div v-if="order.status === 'pending'" class="bg-gray-50 rounded-lg p-2 mb-2 border border-gray-300">
              <p class="text-xs text-gray-700"><i class="ti ti-alert-circle text-gray-600 ml-1"></i>لطفاً جزئیات را بررسی و یادداشت خود را بنویسید.</p>
            </div>

            <!-- Note Input -->
            <div v-if="order.status === 'pending'" class="mb-2">
              <label class="block text-xs font-bold text-gray-700 mb-1">یادداشت برای مشتری</label>
              <textarea
                v-model="note"
                rows="2"
                placeholder="توضیحات و یادداشت..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-gray-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <!-- Existing Notes -->
            <div v-if="order.note" class="bg-gray-50 rounded-lg p-2 mb-2 border border-gray-300">
              <h4 class="font-bold text-xs text-gray-900 mb-1 flex items-center gap-1">
                <i class="ti ti-note text-gray-600"></i>
                یادداشت محصولخانه
              </h4>
              <p class="text-xs text-gray-700">{{ order.note }}</p>
            </div>
          </div>

          <!-- Footer Actions - Sticky -->
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 px-3 md:px-6 py-2 md:py-3 border-t border-gray-200 bg-white flex-shrink-0">
            <div class="flex items-center gap-2 order-2 md:order-1">
              <!-- Download Prescription -->
              <button
                v-if="order.hasPrescription"
                @click="$emit('download-prescription', order)"
                class="px-2 py-1.5 md:px-4 md:py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center gap-1 md:gap-2 font-medium text-xs md:text-sm"
              >
                <i class="ti ti-file-download text-sm md:text-base"></i>
                <span class="hidden sm:inline">دانلود نسخه</span>
                <span class="sm:hidden">نسخه</span>
              </button>
              
              <!-- Download Receipt (Only if paid) -->
              <button
                v-if="order.isPaid && (order.status === 'processing' || order.status === 'ready' || order.status === 'delivered')"
                @click="$emit('download-receipt', order)"
                class="px-2 py-1.5 md:px-4 md:py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-1 md:gap-2 font-medium text-xs md:text-sm"
              >
                <i class="ti ti-receipt text-sm md:text-base"></i>
                <span class="hidden sm:inline">دانلود فاکتور</span>
                <span class="sm:hidden">فاکتور</span>
              </button>
            </div>

            <div class="flex items-center gap-1.5 md:gap-2 order-1 md:order-2">
              <!-- Reject Button -->
              <button
                v-if="order.status === 'pending'"
                @click="$emit('reject', order, note)"
                class="flex-1 md:flex-none px-3 py-1.5 md:px-6 md:py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 font-bold text-xs md:text-sm"
              >
                <i class="ti ti-x text-sm md:text-base"></i>
                <span class="hidden sm:inline">رد سفارش</span>
                <span class="sm:hidden">رد</span>
              </button>

              <!-- Waiting for Customer Button -->
              <button
                v-if="order.status === 'pending'"
                @click="$emit('waiting-customer', order, note)"
                class="flex-1 md:flex-none px-3 py-1.5 md:px-6 md:py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 font-bold text-xs md:text-sm"
              >
                <i class="ti ti-user-check text-sm md:text-base"></i>
                <span class="hidden sm:inline">در انتظار تایید مشتری</span>
                <span class="sm:hidden">انتظار</span>
              </button>

              <!-- Approve Button -->
              <button
                v-if="order.status === 'pending'"
                @click="emit('approve', order, note, totalPrice, medicines)"
                :disabled="medicines.length === 0"
                :class="medicines.length === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                class="flex-1 md:flex-none px-3 py-1.5 md:px-6 md:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all flex items-center justify-center gap-1 md:gap-2 font-bold shadow-lg text-xs md:text-sm"
              >
                <i class="ti ti-check text-sm md:text-base"></i>
                <span class="hidden sm:inline">تایید سفارش</span>
                <span class="sm:hidden">تایید</span>
              </button>

              <!-- Close Button -->
              <button
                v-if="order.status !== 'pending'"
                @click="$emit('close')"
                class="flex-1 md:flex-none px-3 py-1.5 md:px-6 md:py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 font-bold text-xs md:text-sm"
              >
                بستن
              </button>
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

const emit = defineEmits(['close', 'approve', 'reject', 'waiting-customer', 'download-prescription', 'download-receipt'])

const note = ref('')
const medicines = ref([])
const showCustomerRequest = ref(false)
const showPrescribedMedicines = ref(false)
const showMedicineList = ref(true)
const searchTerm = ref('')
const allProducts = ref([])

// Load products from localStorage
const loadProducts = () => {
  try {
    const savedProducts = localStorage.getItem('pet_shop_products')
    if (savedProducts) {
      allProducts.value = JSON.parse(savedProducts).filter(p => p.isActive && p.stock > 0)
    }
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

// Filter products based on search term
const filteredProducts = computed(() => {
  if (!searchTerm.value) return []
  
  const term = searchTerm.value.toLowerCase().trim()
  return allProducts.value.filter(product => 
    product.name.toLowerCase().includes(term) ||
    (product.code && product.code.toLowerCase().includes(term))
  ).slice(0, 5) // Show max 5 results
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const totalPrice = computed(() => {
  return medicines.value.reduce((sum, med) => sum + (med.price || 0), 0)
})

const addMedicine = () => {
  medicines.value.push({
    name: '',
    price: 0,
    quantity: '',
    expiryDate: '',
    dosage: '',
    notes: ''
  })
}

const addProductFromInventory = (product) => {
  medicines.value.push({
    name: product.name,
    price: product.price,
    quantity: '1 عدد',
    expiryDate: product.expiryDate || '',
    dosage: '',
    notes: `موجودی: ${product.stock}`
  })
  
  // Clear search after adding
  searchTerm.value = ''
}

const removeMedicine = (index) => {
  medicines.value.splice(index, 1)
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-white text-orange-700 border-orange-300',
    'waiting-customer': 'bg-white text-amber-700 border-amber-300',
    processing: 'bg-white text-blue-700 border-blue-300',
    ready: 'bg-white text-purple-700 border-purple-300',
    delivered: 'bg-white text-green-700 border-green-300'
  }
  return classes[status] || 'bg-white text-gray-700 border-gray-300'
}

const getStatusIcon = (status) => {
  const icons = {
    pending: 'ti ti-clock',
    'waiting-customer': 'ti ti-user-check',
    processing: 'ti ti-loader',
    ready: 'ti ti-package',
    delivered: 'ti ti-check'
  }
  return icons[status] || 'ti ti-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'در انتظار تایید محصولخانه',
    'waiting-customer': 'در انتظار تایید مشتری',
    processing: 'در انتظار پرداخت',
    ready: 'آماده تحویل',
    delivered: 'تحویل داده شده'
  }
  return labels[status] || 'نامشخص'
}

// Reset when modal closes or opens
watch(() => props.show, (newVal) => {
  if (!newVal) {
    note.value = ''
    medicines.value = []
    searchTerm.value = ''
  } else {
    // Load products from localStorage
    loadProducts()
    
    // Set initial medicines if exists
    if (props.order.medicines && props.order.medicines.length > 0) {
      medicines.value = JSON.parse(JSON.stringify(props.order.medicines))
    } else {
      medicines.value = []
    }
  }
})

// Load products on mount
onMounted(() => {
  loadProducts()
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

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

