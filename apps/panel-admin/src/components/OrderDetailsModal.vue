<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] overflow-y-auto" @click.self="$emit('close')">
      <div class="flex items-center justify-center min-h-screen">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50" @click="$emit('close')"></div>

        <!-- Modal panel - Full Screen -->
        <div class="relative w-full h-screen overflow-hidden text-right transition-all transform bg-white shadow-xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <i class="ti ti-pill text-teal-600 text-xl md:text-2xl"></i>
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

          <!-- Content -->
          <div class="px-3 md:px-6 py-2 md:py-3 h-[calc(100vh-140px)] overflow-y-auto">
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
                  <!-- داروهای درخواستی به صورت هشتگ -->
                  <div>
                    <p class="text-xs text-gray-600 mb-1.5">داروهای درخواستی:</p>
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
                  داروهای تجویز شده
                </h4>
                <i 
                  class="ti transition-transform text-gray-600"
                  :class="showMedicineList ? 'ti-chevron-up' : 'ti-chevron-down'"
                ></i>
              </button>

              <Transition name="collapse">
                <div v-if="showMedicineList">
                  <div class="flex justify-end mb-2">
                    <button
                      @click="addMedicine"
                      class="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <i class="ti ti-plus text-sm"></i>
                      افزودن
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
                    <span class="text-xs font-bold text-gray-700">دارو {{ index + 1 }}</span>
                    <button
                      @click="removeMedicine(index)"
                      class="p-0.5 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                    >
                      <i class="ti ti-trash text-xs"></i>
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">نام دارو *</label>
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
                    
                    <!-- Product Discount Fields -->
                    <div v-if="showProductDiscounts" class="col-span-2 bg-teal-50 rounded p-2 border border-teal-200 grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[10px] font-medium text-teal-700 mb-0.5">نوع تخفیف</label>
                        <select
                          v-model="med.discountType"
                          class="w-full px-2 py-1 border border-teal-300 rounded text-xs focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">بدون تخفیف</option>
                          <option value="percentage">درصدی</option>
                          <option value="fixed">مبلغ ثابت</option>
                        </select>
                      </div>
                      
                      <div v-if="med.discountType">
                        <label class="block text-[10px] font-medium text-teal-700 mb-0.5">
                          مقدار {{ med.discountType === 'percentage' ? '(درصد)' : '(تومان)' }}
                        </label>
                        <input
                          v-model.number="med.discountValue"
                          type="number"
                          :placeholder="med.discountType === 'percentage' ? '10' : '10000'"
                          :max="med.discountType === 'percentage' ? 100 : undefined"
                          class="w-full px-2 py-1 border border-teal-300 rounded text-xs focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div v-if="med.discountType && med.discountValue" class="col-span-2">
                        <div class="flex justify-between items-center text-xs">
                          <span class="text-teal-600">قیمت با تخفیف:</span>
                          <span class="font-bold text-teal-700">{{ formatPrice(calculateProductFinalPrice(med)) }} تومان</span>
                        </div>
                      </div>
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

              <!-- Discount Section -->
              <div v-if="medicines.length > 0" class="space-y-2 mb-2">
                <!-- Product-level Discounts Toggle -->
                <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <button
                    type="button"
                    @click="showProductDiscounts = !showProductDiscounts"
                    :class="[
                      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                      showProductDiscounts ? 'bg-teal-500' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                        showProductDiscounts ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-1 rtl:translate-x-1'
                      ]"
                    />
                  </button>
                  <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <i class="ti ti-discount-2 text-teal-600"></i>
                    <span>تخفیف محصولی</span>
                  </label>
                </div>

                <!-- Overall Discount Toggle -->
                <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <button
                    type="button"
                    @click="hasOverallDiscount = !hasOverallDiscount"
                    :class="[
                      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                      hasOverallDiscount ? 'bg-teal-500' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                        hasOverallDiscount ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-1 rtl:translate-x-1'
                      ]"
                    />
                  </button>
                  <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <i class="ti ti-percentage text-teal-600"></i>
                    <span>تخفیف کلی</span>
                  </label>
                </div>

                <!-- Overall Discount Fields -->
                <div v-if="hasOverallDiscount" class="bg-gray-50 rounded-lg p-2 border border-gray-300 space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">نوع تخفیف</label>
                      <select
                        v-model="overallDiscountType"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="percentage">درصدی</option>
                        <option value="fixed">مبلغ ثابت</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-[10px] font-medium text-gray-700 mb-0.5">
                        مقدار {{ overallDiscountType === 'percentage' ? '(درصد)' : '(تومان)' }}
                      </label>
                      <input
                        v-model.number="overallDiscountValue"
                        type="number"
                        :placeholder="overallDiscountType === 'percentage' ? '10' : '50000'"
                        :max="overallDiscountType === 'percentage' ? 100 : undefined"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total Price -->
              <div v-if="medicines.length > 0" class="bg-gray-100 rounded-lg p-2 border border-gray-300 space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-600">جمع قیمت داروها:</span>
                  <span class="font-bold text-gray-900">{{ formatPrice(subtotalPrice) }} تومان</span>
                </div>
                
                <div v-if="totalProductDiscount > 0" class="flex justify-between items-center text-xs">
                  <span class="text-teal-600">تخفیف محصولات:</span>
                  <span class="font-bold text-teal-600">- {{ formatPrice(totalProductDiscount) }} تومان</span>
                </div>
                
                <div v-if="hasOverallDiscount && overallDiscountValue > 0" class="flex justify-between items-center text-xs">
                  <span class="text-teal-600">تخفیف کلی:</span>
                  <span class="font-bold text-teal-600">- {{ formatPrice(overallDiscountAmount) }} تومان</span>
                </div>
                
                <div class="pt-1 border-t border-gray-300 flex justify-between items-center">
                  <span class="font-bold text-sm text-gray-900">مبلغ نهایی:</span>
                  <span class="text-lg font-bold text-teal-600">{{ formatPrice(finalPrice) }} تومان</span>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-4">
                <i class="ti ti-medicine-syrup text-2xl text-gray-300 mb-1"></i>
                <p class="text-xs text-gray-500">هنوز دارویی اضافه نشده</p>
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
                  داروهای تجویز شده
                </h4>
                <i 
                  class="ti transition-transform text-gray-600"
                  :class="showPrescribedMedicines ? 'ti-chevron-up' : 'ti-chevron-down'"
                ></i>
              </button>
              
              <!-- داروها به صورت هشتگ - همیشه نمایش داده میشه -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span 
                  v-for="(med, index) in order.medicines"
                  :key="index"
                  class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-300"
                >
                  #{{ med.name }}
                </span>
              </div>
              
              <!-- جزئیات کامل داروها - Collapsible -->
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
                        <div class="text-left">
                          <span class="text-xs font-bold text-gray-700">{{ formatPrice(med.price) }} تومان</span>
                          <div v-if="med.discountType && med.discountValue" class="text-[10px] text-teal-600 mt-0.5">
                            تخفیف: {{ med.discountType === 'percentage' ? `${med.discountValue}%` : `${formatPrice(med.discountValue)} تومان` }}
                          </div>
                        </div>
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
                  
                  <div class="bg-gray-100 rounded-lg p-2 border border-gray-300 space-y-1">
                    <div v-if="order.discountInfo && order.discountInfo.subtotalPrice" class="flex justify-between items-center text-xs">
                      <span class="text-gray-600">جمع قیمت داروها:</span>
                      <span class="font-bold text-gray-900">{{ formatPrice(order.discountInfo.subtotalPrice) }} تومان</span>
                    </div>
                    
                    <div v-if="order.discountInfo && order.discountInfo.totalProductDiscount > 0" class="flex justify-between items-center text-xs">
                      <span class="text-teal-600">تخفیف محصولات:</span>
                      <span class="font-bold text-teal-600">- {{ formatPrice(order.discountInfo.totalProductDiscount) }} تومان</span>
                    </div>
                    
                    <div v-if="order.discountInfo && order.discountInfo.hasOverallDiscount && order.discountInfo.overallDiscountAmount > 0" class="flex justify-between items-center text-xs">
                      <span class="text-teal-600">تخفیف کلی ({{ order.discountInfo.overallDiscountType === 'percentage' ? `${order.discountInfo.overallDiscountValue}%` : 'مبلغ ثابت' }}):</span>
                      <span class="font-bold text-teal-600">- {{ formatPrice(order.discountInfo.overallDiscountAmount) }} تومان</span>
                    </div>
                    
                    <div class="pt-1 border-t border-gray-300 flex justify-between items-center">
                      <span class="font-bold text-sm text-gray-900">مبلغ نهایی:</span>
                      <span class="text-base font-bold text-teal-600">{{ formatPrice(order.price) }} تومان</span>
                    </div>
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
                یادداشت داروخانه
              </h4>
              <p class="text-xs text-gray-700">{{ order.note }}</p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 px-3 md:px-6 py-2 md:py-3 border-t border-gray-200 bg-white sticky bottom-0 z-10">
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
                @click="emit('approve', order, note, finalPrice, medicines, {
                  showProductDiscounts: showProductDiscounts,
                  hasOverallDiscount: hasOverallDiscount,
                  overallDiscountType: overallDiscountType,
                  overallDiscountValue: overallDiscountValue,
                  subtotalPrice: subtotalPrice,
                  totalProductDiscount: totalProductDiscount,
                  overallDiscountAmount: overallDiscountAmount
                })"
                :disabled="medicines.length === 0"
                :class="medicines.length === 0 ? 'opacity-50 cursor-not-allowed' : ''"
                class="flex-1 md:flex-none px-3 py-1.5 md:px-6 md:py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg transition-all flex items-center justify-center gap-1 md:gap-2 font-bold shadow-lg text-xs md:text-sm"
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
const showProductDiscounts = ref(false)
const hasOverallDiscount = ref(false)
const overallDiscountType = ref('percentage')
const overallDiscountValue = ref(0)

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// محاسبه قیمت نهایی هر محصول با تخفیف
const calculateProductFinalPrice = (med) => {
  if (!med.price || !med.discountType || !med.discountValue) {
    return med.price || 0
  }
  
  let finalPrice = med.price
  
  if (med.discountType === 'percentage') {
    finalPrice = med.price - (med.price * med.discountValue / 100)
  } else if (med.discountType === 'fixed') {
    finalPrice = Math.max(0, med.price - med.discountValue)
  }
  
  return Math.round(finalPrice)
}

// جمع قیمت اصلی داروها (بدون تخفیف)
const subtotalPrice = computed(() => {
  return medicines.value.reduce((sum, med) => sum + (med.price || 0), 0)
})

// مجموع تخفیف‌های محصولی
const totalProductDiscount = computed(() => {
  if (!showProductDiscounts.value) return 0
  
  return medicines.value.reduce((sum, med) => {
    const originalPrice = med.price || 0
    const finalPrice = calculateProductFinalPrice(med)
    return sum + (originalPrice - finalPrice)
  }, 0)
})

// قیمت بعد از تخفیف محصولی
const priceAfterProductDiscount = computed(() => {
  return subtotalPrice.value - totalProductDiscount.value
})

// مقدار تخفیف کلی
const overallDiscountAmount = computed(() => {
  if (!hasOverallDiscount.value || !overallDiscountValue.value) return 0
  
  const basePrice = priceAfterProductDiscount.value
  
  if (overallDiscountType.value === 'percentage') {
    return Math.round(basePrice * overallDiscountValue.value / 100)
  } else {
    return Math.min(overallDiscountValue.value, basePrice)
  }
})

// قیمت نهایی
const finalPrice = computed(() => {
  return Math.max(0, priceAfterProductDiscount.value - overallDiscountAmount.value)
})

const totalPrice = computed(() => {
  return finalPrice.value
})

const addMedicine = () => {
  medicines.value.push({
    name: '',
    price: 0,
    quantity: '',
    expiryDate: '',
    dosage: '',
    notes: '',
    discountType: '',
    discountValue: 0
  })
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
    pending: 'در انتظار تایید داروخانه',
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
    showProductDiscounts.value = false
    hasOverallDiscount.value = false
    overallDiscountType.value = 'percentage'
    overallDiscountValue.value = 0
  } else {
    // Set initial medicines if exists
    if (props.order.medicines && props.order.medicines.length > 0) {
      medicines.value = JSON.parse(JSON.stringify(props.order.medicines))
    } else {
      medicines.value = []
    }
    
    // Reset discount settings for new modal
    showProductDiscounts.value = false
    hasOverallDiscount.value = false
    overallDiscountType.value = 'percentage'
    overallDiscountValue.value = 0
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
