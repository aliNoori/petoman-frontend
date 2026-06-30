<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="handleBack"
                    class="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
              <i class="ti ti-arrow-right text-lg"></i>
              <span class="font-medium">بازگشت</span>
            </button>
            <div class="w-px h-6 bg-gray-200"></div>
            <h1 class="text-xl font-bold text-gray-900">سفارش دارو</h1>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-2 mt-4 overflow-x-auto pb-2">
          <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
            <div class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all" :class="getStepClasses(index)">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                   :class="getStepCircleClasses(index)">
                <i v-if="index < currentStep" class="ti ti-check text-lg"></i>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="text-sm font-medium whitespace-nowrap hidden sm:block">{{ step.title }}</span>
            </div>
            <i v-if="index < steps.length - 1" class="ti ti-chevron-left text-gray-300 mx-1"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">

          <!-- STEP 1: Medicine Selection (Prescription OR List) -->
          <div v-if="currentStep === 0" class="space-y-6 pb-24 md:pb-0">
            <!--
              توضیح: pb-24 به کل کانتینر داده شده تا در موبایل فضای خالی در پایین صفحه برای دکمه چسبان ایجاد شود.
              در دسکتاپ (md) این فاصله برداشته می‌شود چون دکمه نیاز به چسبیدن ندارد.
            -->

            <!-- Mode Selection Tabs -->
            <div class="bg-white rounded-2xl p-2 shadow-sm flex gap-2">
              <button
                  @click="orderMode = 'prescription'"
                  class="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  :class="orderMode === 'prescription' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'"
              >
                <i class="ti ti-file-certificate text-xl"></i>
                <span>ارسال تصویر نسخه</span>
              </button>
              <button
                  @click="orderMode = 'no-prescription'"
                  class="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  :class="orderMode === 'no-prescription' ? 'bg-teal-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'"
              >
                <i class="ti ti-pill text-xl"></i>
                <span>انتخاب از لیست دارو</span>
              </button>
            </div>

            <!-- A. Prescription Mode -->
            <div v-if="orderMode === 'prescription'" class="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-file-upload text-purple-500"></i>
                آپلود نسخه پزشک
              </h3>
              <p class="text-gray-600 text-sm mb-4">تصویر نسخه خود را آپلود کنید. کارشناسان ما داروها را شناسایی و آماده
                می‌کنند.</p>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div v-for="(file, index) in prescriptionFiles" :key="index"
                     class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                  <img :src="getFilePreview(file)" class="w-full h-full object-cover"/>
                  <div
                      class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button @click="removePrescriptionFile(index)"
                            class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
                <div v-if="prescriptionFiles.length < 10" @click="triggerPrescriptionUpload"
                     class="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <i class="ti ti-plus text-3xl text-gray-400"></i>
                  <span class="text-xs text-gray-500 mt-1">افزودن تصویر</span>
                </div>
              </div>
              <input ref="prescriptionInput" type="file" accept="image/*,.pdf" multiple class="hidden"
                     @change="handlePrescriptionUpload"/>
            </div>

            <!-- B. List Mode (Search & Select) -->
            <div v-if="orderMode === 'no-prescription'" class="bg-white rounded-2xl p-4 md:p-6 shadow-sm animate-fade-in">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-search text-teal-500"></i>
                جستجو و انتخاب دارو
              </h3>
              <!-- Search Input -->
              <div class="relative mb-6">
                <i class="ti ti-search absolute right-4 top-3.5 text-gray-400 text-lg"></i>
                <input
                    v-model="medicineSearchQuery"
                    type="text"
                    placeholder="نام دارو (تجاری یا ژنریک) را جستجو کنید..."
                    class="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all text-sm md:text-base"
                />
              </div>
              <!-- Medicine List -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                <div v-if="filteredMedicines.length === 0" class="col-span-1 md:col-span-2 text-center py-8 text-gray-500">
                  <i class="ti ti-mood-empty text-4xl mb-2"></i>
                  <p>دارویی با این نام یافت نشد.</p>
                </div>
                <div
                    v-for="med in filteredMedicines"
                    :key="med.id"
                    class="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-100 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 transition-all"
                >
                  <!-- Image -->
                  <div
                      class="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  >
                    <img v-if="med.image" :src="resolveUrl(med.image)" class="w-full h-full object-cover"/>
                    <i v-else class="ti ti-pill text-xl md:text-2xl text-gray-400"></i>
                  </div>
                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-gray-900 truncate text-sm md:text-base">{{ med.name }}</h4>
                    <p class="text-[10px] md:text-xs text-gray-500 truncate">{{ med.genericName }}</p>
                    <div class="flex items-center gap-2 mt-1">
                    <span v-if="med.prescriptionRequired"
                          class="text-[9px] md:text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">نسخه‌ای</span>
                      <span class="text-sm font-bold text-teal-600 whitespace-nowrap">{{ formatPrice(med.price) }} تومان</span>
                    </div>
                  </div>
                  <!-- Controls -->
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button @click="updateMedicineQty(med.id, -1)"
                            class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                      <i class="ti ti-minus text-xs md:text-sm"></i>
                    </button>
                    <span class="w-6 md:w-8 text-center font-bold text-gray-900 text-sm md:text-base">{{ getMedicineQty(med.id) }}</span>
                    <button @click="updateMedicineQty(med.id, 1)"
                            class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-colors">
                      <i class="ti ti-plus text-xs md:text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart Products (From Store) -->
            <div v-if="cartItems.length > 0" class="bg-white rounded-2xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-shopping-cart text-emerald-500"></i>
                محصولات اضافه شده از فروشگاه
                <span class="text-sm font-normal text-gray-500">({{ cartItems.length }} محصول)</span>
              </h3>
              <div class="space-y-3">
                <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div
                      class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <img v-if="item.image" :src="item.image" class="w-full h-full object-contain p-1"/>
                    <i v-else class="ti ti-package text-gray-400"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 text-sm truncate">{{ item.name }}</h4>
                    <p class="text-xs text-gray-500">{{ item.category }}</p>
                  </div>
                  <div class="text-left">
                    <div class="font-bold text-emerald-600 text-sm">{{ formatPrice(item.price) }} <span
                        class="text-[10px] font-normal text-gray-500">تومان</span></div>
                    <div class="text-xs text-gray-500">تعداد: {{ item.quantity }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-white rounded-2xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-notes text-gray-500"></i>
                توضیحات تکمیلی (اختیاری)
              </h3>
              <textarea v-model="orderDescription" rows="3"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                        placeholder="توضیحات اضافی در مورد سفارش..."></textarea>
            </div>

            <!-- Navigation (Fixed at Bottom on Mobile) -->
            <!-- تغییرات: اضافه شدن sticky, bottom-0, z-10, bg-white, border-t -->
            <div class="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 p-4 shadow-lg md:static md:bg-transparent md:border-none md:p-0 md:shadow-none md:mt-8">
              <div class="flex justify-end">
                <button @click="nextStep" :disabled="!canProceedStep1"
                        class="w-full md:w-auto px-8 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        :class="canProceedStep1 ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
                  <span>مرحله بعد</span>
                  <i class="ti ti-arrow-left"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 2: Address & Contact -->
          <div v-if="currentStep === 1" class="space-y-6">
            <!-- Customer Info -->
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="ti ti-user text-purple-500"></i>
                اطلاعات گیرنده
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.firstName" type="text"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                         placeholder="نام">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.lastName" type="text"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                         placeholder="نام خانوادگی">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس <span
                      class="text-red-500">*</span></label>
                  <input v-model="form.phone" type="tel"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                         placeholder="09123456789" dir="ltr">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل <span class="text-red-500">*</span></label>
                  <input v-model="form.email" type="email"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                         placeholder="example@gmail.com" dir="ltr">
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="ti ti-map-pin text-purple-500"></i>
                آدرس تحویل
              </h2>
              <div class="flex gap-2 mb-6">
                <button @click="addressMode = 'saved'" class="flex-1 py-3 rounded-lg font-medium transition-all"
                        :class="addressMode === 'saved' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'">
                  آدرس‌های من
                </button>
                <button @click="addressMode = 'map'" class="flex-1 py-3 rounded-lg font-medium transition-all"
                        :class="addressMode === 'map' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'">آدرس
                  جدید
                </button>
              </div>

              <!-- Saved Addresses List -->
              <div v-if="addressMode === 'saved'" class="space-y-3">
                <div v-if="savedAddresses.length === 0" class="text-center py-8 text-gray-500">
                  <p>آدرسی ثبت نشده است.</p>
                  <button @click="addressMode = 'map'" class="mt-2 text-purple-600 font-medium">ثبت آدرس جدید</button>
                </div>
                <label v-for="addr in savedAddresses" :key="addr.id"
                       class="flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all"
                       :class="selectedAddressId === addr.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'">
                  <input v-model="selectedAddressId" :value="addr.id" type="radio" class="mt-1 text-purple-500">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-bold text-gray-900">{{ addr.title }}</span>
                      <span v-if="addr.isDefault"
                            class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">پیش‌فرض</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ addr?.fullAddress?.address?.road }} .
                      {{ addr.fullAddress?.address?.town ?? addr.fullAddress?.address?.suburb }} .
                      {{ addr.fullAddress?.address?.state }}</p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span><i class="ti ti-user ml-1"></i>{{ addr.receiver }}</span>
                      <span><i class="ti ti-phone ml-1"></i>{{ addr.phone }}</span>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Map Selection (New Address) -->
              <div v-if="addressMode === 'map'" class="space-y-4">
                <ClientOnly>
                  <AddressSelector
                      v-model="newDeliveryAddress"
                      placeholder="روی نقشه آدرس تحویل را انتخاب کنید"
                      title="انتخاب آدرس تحویل سفارش"
                  />
                </ClientOnly>
                <!-- فیلدهای جدید -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">عنوان آدرس <span
                      class="text-red-500">*</span></label>
                  <input
                      v-model="newAddressTitle"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                      placeholder="مثلاً: منزل، محل کار"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نام گیرنده <span
                      class="text-red-500">*</span></label>
                  <input
                      v-model="newAddressReceiver"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                      placeholder="نام و نام خانوادگی گیرنده"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس گیرنده <span
                      class="text-red-500">*</span></label>
                  <input
                      v-model="newAddressPhone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                      placeholder="09123456789"
                      dir="ltr"
                  >
                </div>

                <!-- دکمه ذخیره آدرس -->
                <button
                    @click="saveNewAddress"
                    :disabled="isSavingAddress"
                    class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <i v-if="isSavingAddress" class="ti ti-loader animate-spin"></i>
                  <span>{{ isSavingAddress ? 'در حال ذخیره...' : 'ذخیره و انتخاب این آدرس' }}</span>
                </button>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between mt-8">
              <button @click="prevStep"
                      class="px-6 py-3 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <i class="ti ti-arrow-right"></i>
                <span>مرحله قبل</span>
              </button>
              <button @click="nextStep" :disabled="!canProceedStep2"
                      class="px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                      :class="canProceedStep2 ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
                <span>مرحله بعد</span>
                <i class="ti ti-arrow-left"></i>
              </button>
            </div>
          </div>

          <!-- STEP 3: Payment & Delivery -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="ti ti-truck text-purple-500"></i>
                روش ارسال
              </h2>

              <div v-if="pharmacyShippingMethods.length === 0"
                   class="text-center py-4 text-amber-600 bg-amber-50 rounded-lg">
                <i class="ti ti-alert-triangle"></i>
                روش ارسالی برای این داروخانه تعریف نشده است.
              </div>

              <div class="space-y-3">
                <!-- لیست پویا بر اساس تنظیمات داروخانه -->
                <label
                    v-for="method in pharmacyShippingMethods"
                    :key="method.type"
                    class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all"
                    :class="form.deliveryMethod === method.type ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'"
                >
                  <input v-model="form.deliveryMethod" type="radio" :value="method.type" class="text-sky-500">

                  <!-- آیکون و رنگ بر اساس نوع ارسال -->
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center"
                       :class="{
                                   'bg-sky-100': method.type === 'petomanCourier',
                                   'bg-violet-100': method.type === 'scheduled',
                                   'bg-amber-100': method.type === 'post' || method.type === 'tipax' || method.type==='alopeyk',
                                   'bg-emerald-100': method.type === 'shopCourier' || method.type === 'inPerson'
                                 }"
                  >
                    <i :class="{
                                    'ti ti-bike text-sky-600': method.type === 'petomanCourier',
                                    'ti ti-calendar-time text-violet-600': method.type === 'scheduled',
                                    'ti ti-package text-amber-600': method.type === 'post' || method.type === 'tipax' || method.type==='alopeyk',
                                    'ti ti-store text-emerald-600': method.type === 'shopCourier',
                                    'ti ti-user text-emerald-600': method.type === 'inPerson'
                                  }" class="text-2xl">

                    </i>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-2">
          <span class="font-bold text-gray-900">
            {{ getMethodLabel(method.type) }}
          </span>
                      <span v-if="method.deliveryTime"
                            class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {{ method.deliveryTime }} دقیقه
          </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ getMethodDescription(method.type) }}
                    </p>
                  </div>

                  <div class="text-left">
                    <div class="text-sky-600 font-bold">
                      {{ method.price === 0 ? 'رایگان' : formatPrice(method.price) }}
                    </div>
                    <div class="text-xs text-gray-500">تومان</div>
                  </div>
                </label>

                <!-- پیام اگر متدی فعال نبود -->
                <div v-if="pharmacyShippingMethods.length === 0" class="text-center py-4 text-gray-500">
                  روش ارسالی برای این داروخانه فعال نشده است.
                </div>
              </div>

            </div>

            <!-- Payment Methods -->
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="ti ti-credit-card text-purple-500"></i>
                روش پرداخت
              </h2>
              <div class="space-y-3">
                <!-- Online Payment (فعال) -->
                <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all"
                       :class="form.paymentMethod === 'online' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'">
                  <input v-model="form.paymentMethod" type="radio" value="online" class="text-purple-500">
                  <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-world text-purple-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-900">پرداخت آنلاین</div>
                    <div class="text-xs text-gray-500">پرداخت امن از طریق درگاه بانکی</div>
                  </div>
                </label>

                <!-- Wallet (فعال) -->
                <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all"
                       :class="form.paymentMethod === 'wallet' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'">
                  <input v-model="form.paymentMethod" type="radio" value="wallet" class="text-purple-500">
                  <div class="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-wallet text-violet-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-900">کیف پول</div>
                    <div class="text-xs text-gray-500">پرداخت از موجودی حساب کاربری</div>
                  </div>
                  <div class="text-left mr-2">
                    <div class="text-xs text-gray-500">موجودی:</div>
                    <div class="text-sm font-bold text-violet-600">{{
                        formatPrice(walletStore.wallet?.balance || 0)
                      }}
                    </div>
                  </div>
                </label>


                <!-- Card to Card (غیرفعال) -->
                <label
                    class="flex items-center gap-4 p-4 border rounded-xl transition-all opacity-40 pointer-events-none select-none"
                    :class="form.paymentMethod === 'card' ? 'border-purple-300 bg-gray-100' : 'border-gray-200 bg-gray-50'">
                  <input v-model="form.paymentMethod" type="radio" value="card" class="text-purple-500" disabled>
                  <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-credit-card text-gray-500 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-500">کارت به کارت</div>
                    <div class="text-xs text-gray-400">این روش در حال حاضر غیرفعال است</div>
                  </div>
                </label>
                <!-- Cash on Delivery (غیرفعال) -->
                <label
                    class="flex items-center gap-4 p-4 border rounded-xl transition-all opacity-40 pointer-events-none select-none"
                    :class="form.paymentMethod === 'cod' ? 'border-purple-300 bg-gray-100' : 'border-gray-200 bg-gray-50'">
                  <input v-model="form.paymentMethod" type="radio" value="cod" class="text-purple-500" disabled>
                  <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-cash text-gray-500 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-500">پرداخت در محل</div>
                    <div class="text-xs text-gray-400">این روش در حال حاضر غیرفعال است</div>
                  </div>
                </label>
              </div>
            </div>
            <!-- Card Details (if card payment selected) -->
            <div v-if="form.paymentMethod === 'card'" class="bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات حساب</h3>
              <div class="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-6 text-white mb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm opacity-80">شماره حساب</div>
                    <div class="text-xl font-mono">{{ defaultCard.cardNumber }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm opacity-80">بانک</div>
                    <div class="font-bold">{{ defaultCard.bankName }}</div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="text-sm opacity-80">نام صاحب حساب</div>
                  <div class="font-bold">{{ pharmacyData.ownerName }}</div>
                </div>
              </div>

              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div class="flex gap-3">
                  <i class="ti ti-info-circle text-amber-500 text-xl flex-shrink-0 mt-0.5"></i>
                  <div class="text-sm text-amber-800">
                    <p class="font-medium mb-1">راهنمای پرداخت:</p>
                    <ol class="list-decimal list-inside space-y-1">
                      <li>مبلغ {{ formatPrice(totalPayable) }} تومان را به حساب بالا واریز کنید</li>
                      <li>شماره پیگیری تراکنش را در کادر زیر وارد کنید</li>
                      <li>دکمه "تأیید پرداخت" را بزنید</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره پیگیری تراکنش</label>
                <input v-model="transactionId" type="text"
                       class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                       placeholder="شماره پیگیری تراکنش خود را وارد کنید">
              </div>
            </div>

            <!-- COD Info -->
            <div v-if="form.paymentMethod === 'cod'" class="bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">توضیحات پرداخت در محل</h3>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div class="flex gap-3">
                  <i class="ti ti-info-circle text-amber-500 text-xl flex-shrink-0 mt-0.5"></i>
                  <div class="text-sm text-amber-800">
                    <ul class="space-y-1">
                      <li>• مبلغ {{ formatPrice(totalPayable) }} تومان در زمان تحویل پرداخت خواهد شد</li>
                      <li>• امکان پرداخت نقد یا با کارت در دستگاه پوز</li>
                      <li>• هزینه اضافی {{ codFee.toLocaleString() }} تومان برای این سرویس</li>
                      <li>• لطفاً مبلغ نقد آماده داشته باشید</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between mt-8">
              <button @click="prevStep"
                      class="px-6 py-3 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <i class="ti ti-arrow-right"></i>
                <span>مرحله قبل</span>
              </button>
              <button @click="submitOrder" :disabled="!canSubmitOrder"
                      class="px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                      :class="canSubmitOrder ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
                <span>پرداخت و ثبت سفارش</span>
                <i class="ti ti-check"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- Sidebar: Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-receipt text-purple-500"></i>
              خلاصه سفارش
            </h2>

            <!-- Order Type Badge -->
            <div class="mb-4">
              <span class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                    :class="orderMode === 'prescription' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'">
                <i :class="orderMode === 'prescription' ? 'ti ti-file-certificate' : 'ti ti-pill'"></i>
                {{ orderMode === 'prescription' ? 'سفارش با نسخه' : 'انتخاب از لیست' }}
              </span>
            </div>

            <!-- Items List -->
            <div class="space-y-4 mb-6">
              <!-- Prescription Info -->
              <div v-if="orderMode === 'prescription' && prescriptionFiles.length > 0"
                   class="flex items-center gap-3 text-sm text-gray-600">
                <i class="ti ti-photo text-purple-500"></i>
                <span>{{ prescriptionFiles.length }} تصویر نسخه</span>
              </div>

              <!-- Selected Medicines -->
              <div v-if="selectedMedicinesList.length > 0">
                <h4 class="text-sm font-bold text-gray-700 mb-2">داروهای انتخاب شده:</h4>
                <div class="space-y-2">
                  <div v-for="item in selectedMedicinesList" :key="item.id" class="flex justify-between text-sm">
                    <span class="text-gray-600">{{ item.name }} <span class="text-xs text-gray-400">x{{
                        item.qty
                      }}</span></span>
                    <span class="font-medium text-gray-900">{{ formatPrice(item.price * item.qty) }}</span>
                  </div>
                </div>
              </div>

              <!-- Cart Products -->
              <div v-if="cartItems.length > 0" class="border-t border-gray-100 pt-4">
                <h4 class="text-sm font-bold text-gray-700 mb-2">محصولات فروشگاه:</h4>
                <div class="space-y-2">
                  <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm">
                    <span class="text-gray-600">{{ item.name }} <span class="text-xs text-gray-400">x{{
                        item.quantity
                      }}</span></span>
                    <span class="font-medium text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="border-t border-gray-200 pt-4 space-y-3">
              <!-- نمایش جمع کالاها فقط اگر دارو انتخاب شده باشد -->
              <div v-if="orderMode !== 'prescription' && itemsSubtotal > 0"
                   class="flex justify-between text-sm text-gray-600">
                <span>جمع کل کالاها:</span>
                <span>{{ formatPrice(itemsSubtotal) }} تومان</span>
              </div>

              <!-- هزینه بررسی نسخه (فقط در حالت نسخه) -->
              <div v-if="orderMode === 'prescription'" class="flex justify-between text-sm text-gray-600">
                <span>هزینه بررسی و تایید نسخه:</span>
                <span>{{ formatPrice(50000) }} تومان</span>
              </div>

              <div class="flex justify-between text-sm text-gray-600">
                <span>هزینه ارسال:</span>
                <span>{{ formatPrice(shippingCost) }} تومان</span>
              </div>

              <!-- پیام هشدار برای حالت نسخه -->
              <div v-if="orderMode === 'prescription'"
                   class="bg-amber-50 p-3 rounded-lg text-xs text-amber-700 flex gap-2">
                <i class="ti ti-info-circle mt-0.5"></i>
                <span>
                   هزینه داروهای نسخه پس از بررسی توسط داروخانه محاسبه و به مبلغ نهایی اضافه می‌شود.
                   مبلغ فعلی فقط برای ثبت سفارش و ارسال است.
                 </span>
              </div>

              <div class="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span class="font-bold text-gray-900">مبلغ قابل پرداخت:</span>
                <span class="text-xl font-bold text-purple-600">{{ formatPrice(totalPayable) }} تومان</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {iranCitiesData} from '~/data/iran-cities'
import {useAddressStore} from "~/stores/address.store";
import {useUploader} from "~/composables/useUploader";
import {usePaymentStore} from "~/stores/payment";
import {useWalletStore} from "~/stores/wallet.store";
import {useTenantStore} from "~/stores/tenant.store";
import {useBankStore} from "~/stores/bank";
import {onMounted, ref} from "vue";
import {useAuthStore} from "~/stores/auth";
import {useNuxtApp} from "nuxt/app";
import {useUrlHelper} from "~/composables/useUrlHelper";
const { resolveUrl } = useUrlHelper();
const authStore = useAuthStore()
const walletStore = useWalletStore()
const uploader = useUploader()
const paymentStore = usePaymentStore()
// --- Stores & Router ---
const route = useRoute()
const {$toast} = useNuxtApp()
const router = useRouter()
const tenantStore = useTenantStore()
const addressStore = useAddressStore()
const bankStore = useBankStore()
const defaultCard = computed(() => bankStore.card)
// --- متغیرهای جدید برای آدرس ---
const isSavingAddress = ref(false)
const newAddressTitle = ref('')
const newAddressReceiver = ref('')
const newAddressPhone = ref('')
// Constants
const currentUser = computed(() => authStore.user);
const codFee = 10000
const transactionId = ref('')

// Handle location from map
const newDeliveryAddress = ref({
  address: {},
  province: '',
  city: '',
  location: null
})

// Watch newDeliveryAddress and update form
watch(newDeliveryAddress, (newVal) => {
  form.address = newVal.address
  form.province = newVal.province
  form.city = newVal.city
}, {deep: true})

// متد ذخیره آدرس جدید
const saveNewAddress = async () => {
  // اعتبارسنجی
  if (!newDeliveryAddress.value.address || !newAddressTitle.value || !newAddressReceiver.value || !newAddressPhone.value) {
    showError('لطفاً تمام فیلدهای آدرس، عنوان، گیرنده و شماره تماس را تکمیل کنید', 'خطا')
    return
  }

  isSavingAddress.value = true
  try {
    // ساخت آبجکت آدرس برای ارسال به استور
    const payload = {
      title: newAddressTitle.value,
      fullAddress: newDeliveryAddress.value.address,
      receiver: newAddressReceiver.value,
      phone: newAddressPhone.value,
    }

    // فراخوانی اکشن استور
    const savedAddress = await addressStore.addUserAddress(payload)

    // انتخاب آدرس ذخیره شده به عنوان آدرس انتخابی
    selectedAddressId.value = savedAddress.id
    selectSavedAddress(savedAddress)

    // بازگشت به تب آدرس‌های ذخیره شده
    addressMode.value = 'saved'
    $toast('آدرس با موفقیت ذخیره شد', 'success', 5000)

    // پاک کردن فرم
    newAddressTitle.value = ''
    newAddressReceiver.value = ''
    newAddressPhone.value = ''
    newDeliveryAddress.value = {address: {}, province: '', city: '', location: null}
  } catch (error) {
    console.error('Error saving address:', error)
    $toast('خطا در ذخیره آدرس', 'error', 500)
  } finally {
    isSavingAddress.value = false
  }
}

// Select saved address
const selectSavedAddress = (addr) => {
  selectedAddressId.value = addr.id
  form.address = addr.fullAddress
  form.addressId = addr.id
  // در صورت نیاز می‌توانید اطلاعات گیرنده آدرس را هم به فرم اصلی منتقل کنید
  // form.firstName = addr.receiver?.split(' ')[0] // (اختیاری)
}
// --- Data ---
// اصلاحیه: خواندن صحیح پارامتر id از URL
const pharmacyId = String(route.params.pharmacyId)

const currentStep = ref(0)
const orderMode = String(route.query.type)
// Form Data
const form = reactive({
  firstName: currentUser.value?.firstName || '',
  lastName: currentUser.value?.lastName || '',
  phone: currentUser.value?.phoneNumber || '',
  email: currentUser.value?.email || '',
  province: '', city: '', address: '', postalCode: '', unit: '',
  paymentMethod: 'online',
  deliveryMethod: '' // اضافه شده برای نگهداری نوع ارسال انتخاب شده
})

// State
const prescriptionFiles = ref([])
const prescriptionInput = ref(null)
const medicineSearchQuery = ref('')
const selectedMedicinesMap = ref(new Map()) // Map<medicineId, quantity>
const orderDescription = ref('')
const addressMode = ref('saved')
const selectedAddressId = ref(null)

// Map Refs
const mapContainerRef = ref(null)
const mapInstance = ref(null)
const mapboxgl = ref(null)
const MAPBOX_TOKEN = 'pk.eyJ1IjoicGV0b21hbiIsImEiOiJjbTRvNnBhaDkwNTVsMmpzOGFld3d3OXZ5In0.Wq0VVUZ8YkFVmVjDSwrW1Q'

// --- Computed (Store Integration) ---
const pharmacyData = computed(() => tenantStore.getTenantById(pharmacyId))

// لیست داروهای تمیز شده
const pharmacyMedicines = computed(() => {
  if (!pharmacyData.value?.pharmacyMedicines) return []
  return pharmacyData.value.pharmacyMedicines.map(m => ({
    id: m.id,
    name: m.medicine?.name || 'نامشخص', // اضافه کردن optional chaining برای امنیت
    genericName: m.medicine?.genericName || '',
    price: m.price || 0,
    image: m.medicine?.image,
    prescriptionRequired: m.prescriptionRequired || false
  }))
})

// لیست محصولات تمیز شده (Market Products)
const pharmacyProducts = computed(() => {
  if (!pharmacyData.value?.products) return []
  return pharmacyData.value.products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    image: p.image,
    quantity: 1
  }))
})

// روش‌های ارسال (اصلاح شده)
const pharmacyShippingMethods = computed(() => {
  if (!pharmacyData.value?.settings) return [];
  const shippingSetting = pharmacyData.value.settings.find(s => s.key === 'shipping_methods');
  if (!shippingSetting?.value?.methods) return [];
  // فیلتر کردن متدهای فعال
  return shippingSetting.value.methods.filter(method => method.isActive !== false);
});

// سبد خرید قبلی (از LocalStorage)
const cartItems = ref([])
onMounted(async () => {
  const savedCart = localStorage.getItem('pharmacyCart')
  if (savedCart) {
    try {
      const data = JSON.parse(savedCart)
      if (String(data.pharmacyId) === pharmacyId) cartItems.value = data.items || []
    } catch (e) {
    }
  }

  if (pharmacyId) {
    await bankStore.fetchDefaultCardTenant(pharmacyId)

    const fullPharmacyData = tenantStore.getTenantById(pharmacyId);

    // روش دوم: اگر فقط آی‌دی را داریم و باید از سرور بگیریم (اگر استور خالی بود)
    // const fullPharmacyData = await $fetch(`/api/tenants/${pharmacyId}`);

    if (fullPharmacyData) {
      pharmacyData.value = fullPharmacyData;
    }

    // روش اول: اگر استور تمام تننت‌ها را دارد
  }


})

// فیلتر داروها برای جستجو
const filteredMedicines = computed(() => {
  if (!medicineSearchQuery.value) return pharmacyMedicines.value
  const q = medicineSearchQuery.value.toLowerCase()
  return pharmacyMedicines.value.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q)
  )
})

// لیست داروهای انتخاب شده برای نمایش
const selectedMedicinesList = computed(() => {
  return Array.from(selectedMedicinesMap.value.entries()).map(([id, qty]) => {
    const med = pharmacyMedicines.value.find(m => m.id === id)
    return med ? {...med, qty} : null
  }).filter(Boolean)
})

// آدرس‌های ذخیره شده
const savedAddresses = computed(() => addressStore.addresses)

// استان و شهر
const provincesOptions = computed(() => Object.keys(iranCitiesData).map(p => ({value: p, label: p})))
const citiesOptions = computed(() => {
  if (!form.province || !iranCitiesData[form.province]) return []
  return iranCitiesData[form.province].cities.map(c => ({value: c, label: c}))
})

// Steps Definition
const steps = [
  {id: 'details', title: 'انتخاب دارو'},
  {id: 'address', title: 'آدرس'},
  {id: 'payment', title: 'پرداخت'}
]

// --- Calculations ---
const itemsSubtotal = computed(() => {
  let total = 0
  // Medicines from list (فقط در حالت انتخاب دستی دارو)
  if (orderMode !== 'prescription') {
    selectedMedicinesList.value.forEach(m => total += (m.price * m.qty))
  }
  // Cart products
  cartItems.value.forEach(c => total += (c.price * c.quantity))
  return total
})

const shippingCost = computed(() => {
  const method = pharmacyShippingMethods.value.find(m => m.type === form.deliveryMethod)
  return method ? (method.price || 0) : 0
})

// تعریف هزینه ثابت برای بررسی نسخه (مثلا ۵۰,۰۰۰ تومان)
const PRESCRIPTION_FEE = 50000

const totalPayable = computed(() => {
  const shipping = shippingCost.value

  if (orderMode === 'prescription') {
    // در حالت نسخه: هزینه ارسال + هزینه بررسی نسخه
    // (قیمت داروها بعدا توسط داروخانه محاسبه می‌شود)
    return shipping + PRESCRIPTION_FEE
  } else {
    // در حالت انتخاب دستی: قیمت داروها + هزینه ارسال
    return itemsSubtotal.value + shipping
  }
})

// --- Validation ---
const canProceedStep1 = computed(() => {
  console.log('')
  if (orderMode === 'prescription') {
    return prescriptionFiles.value.length > 0
  } else {
    return selectedMedicinesMap.value.size > 0 || cartItems.value.length > 0
  }
})
const canProceedStep2 = computed(() => {
  const hasInfo = form.firstName && form.lastName && form.phone
  let hasAddress = false

  if (addressMode.value === 'saved') {
    hasAddress = selectedAddressId.value !== null
  } else {
    // بررسی فیلدهای جدید برای آدرس جدید
    hasAddress = form.province && form.city && form.address &&
        newAddressTitle.value && newAddressReceiver.value && newAddressPhone.value
  }

  return hasInfo && hasAddress
})

const canSubmitOrder = computed(() => {
  // اصلاحیه: بررسی انتخاب روش ارسال بر اساس form.deliveryMethod
  return canProceedStep2.value && form.deliveryMethod && form.paymentMethod
})

// --- Helper Methods for Shipping Labels ---
const getMethodLabel = (type) => {
  const labels = {
    'petomanCourier': 'پیک پتومن',
    'scheduled': 'تحویل زمان‌بندی شده',
    'post': 'پست پیشتاز',
    'tipax': 'تیپاکس',
    'alopeyk': 'الوپیک',
    'shopCourier': 'پیک فروشگاه',
    'inPerson': 'دریافت حضوری'
  }
  return labels[type] || 'سایر'
}

const getMethodDescription = (type) => {
  const descs = {
    'petomanCourier': 'ارسال سریع با پیک اختصاصی',
    'scheduled': 'انتخاب زمان تحویل توسط شما',
    'post': 'ارسال با پست جمهوری اسلامی',
    'tipax': 'ارسال سریع با تیپاکس',
    'alopeyk': 'ارسال سریع با الوپیک',
    'shopCourier': 'ارسال توسط پیک خود داروخانه',
    'inPerson': 'مراجعه به داروخانه و دریافت سفارش'
  }
  return descs[type] || ''
}

// --- Methods ---
const getStepClasses = (index) => {
  if (index < currentStep.value) return 'bg-green-50'
  if (index === currentStep.value) return 'bg-purple-50'
  return 'bg-gray-50'
}

const getStepCircleClasses = (index) => {
  if (index < currentStep.value) return 'bg-green-500 text-white'
  if (index === currentStep.value) return 'bg-purple-500 text-white'
  return 'bg-gray-200 text-gray-500'
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({top: 0, behavior: 'smooth'})
    if (currentStep.value === 1 && addressMode.value === 'map') initMap()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
}

const handleBack = () => {
  if (currentStep.value === 0) router.back()
  else prevStep()
}

// File Handling
const triggerPrescriptionUpload = () => prescriptionInput.value?.click()
const handlePrescriptionUpload = (e) => {
  const files = Array.from(e.target.files)
  prescriptionFiles.value.push(...files.slice(0, 10 - prescriptionFiles.value.length))
  e.target.value = ''
}
const removePrescriptionFile = (index) => prescriptionFiles.value.splice(index, 1)
const getFilePreview = (file) => URL.createObjectURL(file)

// Medicine List Handling
const getMedicineQty = (id) => selectedMedicinesMap.value.get(id) || 0
const updateMedicineQty = (id, change) => {
  const current = getMedicineQty(id)
  const newQty = current + change
  if (newQty <= 0) {
    selectedMedicinesMap.value.delete(id)
  } else {
    selectedMedicinesMap.value.set(id, newQty)
  }
}

// Map Logic (Simplified)
const initMap = async () => {
  if (!process.client || mapInstance.value) return
  try {
    const mb = await import('mapbox-gl')
    mapboxgl.value = mb.default
    mapboxgl.value.accessToken = MAPBOX_TOKEN
    mapInstance.value = new mapboxgl.value.Map({
      container: 'order-map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [51.3890, 35.6892],
      zoom: 14
    })
  } catch (e) {
    console.error('Map error', e)
  }
}
const walletBalance = computed(() => walletStore.wallet.balance)
const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price)
// بررسی کافی بودن موجودی کیف پول
const isWalletSufficient = computed(() => {
  return walletBalance.value >= totalPayable.value
})

const canProceed = computed(() => {

  if (form.paymentMethod === 'card') {
    return transactionId.value.length > 0
  }

  if (form.paymentMethod === 'wallet') {
    return isWalletSufficient.value
  }
  return true
})

const isProcessing = ref(false)
const submitOrder = async () => {

  if (!canProceed.value) {
    alert('لطفاً اطلاعات مورد نیاز را تکمیل کنید')
    return
  }

  isProcessing.value = true

  let prescriptionUrls = []
  try {
    // --- ۱. آپلود تصاویر نسخه (اگر وجود دارد) ---

    if (orderMode === 'prescription' && prescriptionFiles.value.length > 0) {
      // فرض بر این است که uploadFile آرایه فایل‌ها را می‌گیرد و آرایه URL برمی‌گرداند
      // اگر تابع شما فایل را تکی می‌گیرد، باید از map و Promise.all استفاده کنید.
      // اینجا فرض می‌کنیم uploader شما هندل می‌کند یا آرایه می‌گیرد:
      prescriptionUrls = await Promise.all(
          prescriptionFiles.value.map(file => uploader.uploadImage(file))
      )
    }

    // --- ۲. تعیین AddressId ---
    // اگر آدرس ذخیره شده انتخاب شده، همان id را می‌فرستیم
    // اگر آدرس جدید است، null می‌فرستیم تا بک‌اند آدرس را بسازد
    const finalAddressId = addressMode.value === 'saved' ? selectedAddressId.value : null

    // --- ۳. آماده‌سازی Payload ---
    const orderPayload = {
      sellerId: pharmacyId,
      mode: orderMode,
      prescriptionUrls: prescriptionUrls, // ارسال URLهای آپلود شده
      medicines: Array.from(selectedMedicinesMap.value.entries()).map(([id, qty]) => ({id, qty})),
      items: cartItems.value,
      customerInfo: {
        firstName: form.firstName || '',
        lastName: form.lastName || '',
        phone: form.phone || '',
        email: form.email || null
      },
      addressId: finalAddressId,
      // اطلاعات زمان تحویل (اگر از مرحله قبل پاس داده نشده، مقدار پیش‌فرض بگذارید)
      deliveryDate: {
        date: new Date().toISOString().split('T')[0], // تاریخ امروز
        dateLabel: 'امروز',
        dateNum: '1',
        dayName: 'امروز',
        isFriday: false,
        monthName: 'اسفند',
        weekDay: 'شنبه'
      },

      deliveryTimeSlot: {
        id: 1,
        time: 'سریع‌ترین زمان ممکن',
        price: 0,
        available: true
      },
      shippingMethod: form.deliveryMethod,
      paymentMethod: form.paymentMethod,
      notes: orderDescription.value
    }

    // --- ۴. ارسال به سرور ---
    const response = await paymentStore.submitPharmacyOrder(orderPayload)

    // ساخت کد سفارش برای ریدایرکت (اگر سرور کد نداده، از لوکال می‌سازیم)
    const orderId = response.data.orderId
    // --- ۵. مدیریت مسیر بر اساس نوع پرداخت ---

    if (response.data.actionType === 'ORDER_COMPLETED') {
      $toast(response.message, 'success', 5000);
      await router.push({
        path: `/pharmacy/order-status/${response.data.orderId}`
      });
      return;
    }

    // الف) پرداخت آنلاین
    if (response.data.requiresAction && response.data.actionType === 'ONLINE_PAYMENT_REDIRECT') {
      const {orderId, amount, tenantId} = response.data.data;

      const gatewayResponse = await paymentStore.initiatePharmacyOnlinePayment({
        orderId: orderId,
        amount: amount,
        tenantId: tenantId,
        meta: {description: `پرداخت سفارش شماره ${orderId}`}
      });

      if (gatewayResponse.paymentUrl) {
        $toast('هدایت به درگاه بانکی', 'success', 5000);
        window.location.href = gatewayResponse.paymentUrl;
      } else {
        $toast('خطا در دریافت لینک درگاه بانکی', 'error', 5000);
      }
    } else {

      $toast('خطا در برقراری ارتباط با سرور. لطفاً مجددا تلاش کنید.', 'error', 5000);
    }

  } catch (err) {
    let errorMessage = 'خطایی رخ داد و ثبت سفارش انجام نشد.';

    // 1. بررسی وضعیت (Status Code)
    const status = err.response?.status;
    const responseData = err.response?.data;

    if (status === 400 && Array.isArray(responseData.message)) {
      // اگر خطا 400 بود و پیام‌ها آرایه باشند
      errorMessage = responseData.message.join(' | ');

    } else if (status === 400) {
      errorMessage = responseData.message;
    } else if (status === 401) {
      errorMessage = 'شناسایی نشد. لطفا وارد حساب کاربری شوید.';
    } else if (status === 403) {
      errorMessage = 'دسترسی غیرمجاز است.';
    } else if (status >= 500) {
      errorMessage = 'خطا در سرور رخ داده است. لطفا بعدا تلاش کنید.';
    } else {
      // خطای عمومی یا شبکه
      errorMessage = err.message || 'ارتباط با سرور برقرار نشد.';
    }
    $toast(errorMessage, 'warning', 5000, status);
  }
}

useHead({title: 'سفارش دارو | داروخانه پتومن'})

</script>