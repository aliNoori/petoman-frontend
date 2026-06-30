<template>
  <div class="min-h-screen bg-gray-50 pb-20 lg:pb-6">
    <div class="space-y-6">

      <!-- اطلاعات عمومی داروخانه -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-building-store text-teal-600"></i>
            اطلاعات عمومی داروخانه
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <!-- لوگو داروخانه -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              لوگو داروخانه
            </label>
            <div class="flex items-start gap-6">
              <!-- نمایش لوگو -->
              <div class="shrink-0">
                <div class="w-32 h-32 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                      v-if="pharmacyInfo.logo"
                      :src="localLogoPreview"
                      alt="لوگو داروخانه"
                      class="w-full h-full object-cover"
                  >
                  <div v-else class="text-center">
                    <i class="ti ti-photo text-4xl text-gray-300"></i>
                    <p class="text-xs text-gray-400 mt-2">بدون لوگو</p>
                  </div>
                </div>
              </div>

              <!-- آپلود لوگو -->
              <div class="flex-1">
                <input
                    ref="logoInput"
                    type="file"
                    accept="image/*"
                    @change="handleLogoUpload"
                    class="hidden"
                >
                <button
                    type="button"
                    @click="$refs.logoInput.click()"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <i class="ti ti-upload"></i>
                  انتخاب لوگو جدید
                </button>
                <p class="text-xs text-gray-500 mt-2">
                  فرمت‌های مجاز: JPG، PNG (حداکثر 2MB)
                </p>
                <p class="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <i class="ti ti-alert-circle"></i>
                  تغییر لوگو نیاز به تایید مدیریت دارد
                </p>
              </div>
            </div>
          </div>

          <!-- نام و توضیحات -->
          <div class="border-t border-gray-200 pt-6">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <i class="ti ti-building-store text-teal-600"></i>
                  نام داروخانه
                </label>
                <input
                    v-model="pharmacyInfo.name"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    placeholder="مثال: پت‌شاپ دکتر احمدی"
                >
              </div>

              <div>
                <label class="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <i class="ti ti-file-text text-teal-600"></i>
                  توضیحات داروخانه
                </label>
                <textarea
                    v-model="pharmacyInfo.description"
                    rows="3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
                    placeholder="توضیحات مختصری درباره داروخانه، خدمات و امکانات..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- اطلاعات قانونی -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-base font-bold text-gray-900 mb-4">
              اطلاعات قانونی و مجوزها
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  شماره پروانه داروخانه
                </label>
                <input
                    v-model="pharmacyInfo.licenseNumber"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    placeholder="مثال: 12345/98"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  کد نظام پزشکی (صاحب امتیاز)
                </label>
                <input
                    v-model="pharmacyInfo.medicalSystemCode"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    placeholder="مثال: 123456"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  کد ملی صاحب امتیاز
                </label>
                <input
                    v-model="pharmacyInfo.ownerNationalId"
                    type="text"
                    maxlength="10"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="مثال: 0012345678"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  نام صاحب امتیاز
                </label>
                <input
                    v-model="pharmacyInfo.ownerName"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    placeholder="نام و نام خانوادگی"
                >
              </div>
            </div>
          </div>

          <!-- اطلاعات تماس -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-base font-bold text-gray-900 mb-4">
              اطلاعات تماس
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  شماره تماس ثابت
                </label>
                <input
                    v-model="pharmacyInfo.phone"
                    type="tel"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="021-12345678"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  شماره موبایل
                </label>
                <input
                    v-model="pharmacyInfo.mobile"
                    type="tel"
                    maxlength="11"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="09123456789"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  ایمیل داروخانه
                </label>
                <input
                    v-model="pharmacyInfo.email"
                    type="email"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="info@pharmacy.com"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  وبسایت (اختیاری)
                </label>
                <input
                    v-model="pharmacyInfo.website"
                    type="url"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="https://www.pharmacy.com"
                >
              </div>
            </div>
          </div>

          <AddressSelector
              v-model="addressData"
              placeholder="روی نقشه آدرس را انتخاب کنید"
              title="تغییر موقعیت آدرس"
              @update:modelValue="onChangeLocation"
          />
          <!-- 5. Address & Location -->
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">آدرس کامل</label>
            <textarea v-model="localAddressText" rows="3"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none"></textarea>
          </div>

          <!-- ساعات کاری -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-base font-bold text-gray-900 mb-4">
              ساعات کاری و نوع فعالیت
            </h3>

            <!-- وضعیت شبانه‌روزی -->
            <div class="mb-6">
              <div class="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <i class="ti ti-24-hours text-teal-600 text-2xl"></i>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">داروخانه شبانه‌روزی</h4>
                    <p class="text-xs text-gray-600 mt-1">فعال بودن در تمام ساعات شبانه‌روز</p>
                  </div>
                </div>
                <button
                    @click="pharmacyInfo.is24Hours = !pharmacyInfo.is24Hours"
                    type="button"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    :class="pharmacyInfo.is24Hours ? 'bg-teal-600' : 'bg-gray-200'"
                    dir="ltr"
                >
                  <span
                      class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                      :class="pharmacyInfo.is24Hours ? 'translate-x-5' : 'translate-x-0.5'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- ساعات کاری معمولی -->
            <div v-if="!pharmacyInfo.is24Hours" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">ساعت شروع کار</label>
                  <input
                      v-model="pharmacyInfo.openTime"
                      type="time"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  >
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">ساعت پایان کار</label>
                  <input
                      v-model="pharmacyInfo.closeTime"
                      type="time"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">روزهای تعطیل</label>
                <div class="flex flex-wrap gap-2">
                  <label
                      v-for="day in daysOfWeek"
                      :key="day.value"
                      class="flex items-center gap-2 px-4 py-2 border-2 rounded-xl cursor-pointer transition-all"
                      :class="pharmacyInfo.closedDays.includes(day.value)
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-teal-500'"
                  >
                    <input
                        type="checkbox"
                        :value="day.value"
                        v-model="pharmacyInfo.closedDays"
                        class="rounded text-teal-600"
                    >
                    <span class="text-sm font-medium">{{ day.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div class="flex items-center gap-3">
                <i class="ti ti-check-circle text-green-600 text-2xl"></i>
                <p class="text-sm font-medium text-green-700">
                  این داروخانه به صورت شبانه‌روزی و در تمام روزهای هفته فعال است.
                </p>
              </div>
            </div>
          </div>

          <!-- هشدار تایید -->
          <div class="border-t border-gray-200 pt-6">
            <div class="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
              <div class="flex items-start gap-3">
                <i class="ti ti-alert-circle text-amber-600 text-xl shrink-0 mt-0.5"></i>
                <div>
                  <h4 class="text-sm font-bold text-amber-900 mb-1">نیاز به تایید مدیریت</h4>
                  <p class="text-xs text-amber-700">
                    تغییرات در اطلاعات داروخانه (نام، آدرس، مجوزها و...) پس از ذخیره، منتظر تایید مدیریت می‌مانند.
                    تا زمان تایید، اطلاعات قبلی در سایت نمایش داده می‌شود.
                  </p>
                </div>
              </div>
            </div>

            <button
                @click="savePharmacyInfo"
                :disabled="pharmacyLoading"
                class="w-full lg:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="!pharmacyLoading" class="ti ti-send text-xl"></i>
              <i v-else class="ti ti-loader-2 text-xl animate-spin"></i>
              <span v-if="pharmacyLoading">در حال ارسال...</span>
              <span v-else>ارسال برای تایید مدیریت</span>
            </button>
          </div>
        </div>
      </div>

      <!-- تنظیمات حمل و نقل -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-truck-delivery text-teal-600"></i>
            روش‌های حمل و نقل
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            انتخاب روش‌های ارسال که به مشتریان ارائه می‌دهید
          </p>
        </div>

        <div class="p-6 space-y-4">
          <!-- ارسال با الوپیک -->
          <div class="border-2 rounded-xl transition-all"
               :class="localShipping.alopeyk ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0">
                  <i class="ti ti-package text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-bold text-gray-900 mb-1">ارسال با الوپیک</h3>
                  <p class="text-xs text-gray-600 mb-2">ارسال به شهرستان‌ها و شهرهای اطراف</p>
                  <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-1 bg-white rounded-full text-orange-700 font-medium border border-orange-200">
                <i class="ti ti-clock text-xs ml-1"></i>
                24-48 ساعت
              </span>
                    <span class="px-2 py-1 bg-white rounded-full text-orange-700 font-medium border border-orange-200">
                <i class="ti ti-map-2 text-xs ml-1"></i>
                سراسر کشور
              </span>
                  </div>
                </div>
              </div>
              <button
                  @click="localShipping.alopeyk = !localShipping.alopeyk"
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  :class="localShipping.alopeyk ? 'bg-orange-600' : 'bg-gray-200'"
                  dir="ltr"
              >
          <span
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="localShipping.alopeyk ? 'translate-x-5' : 'translate-x-0.5'"
          ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="localShipping.alopeyk" class="px-4 pb-4 pt-2 border-t border-orange-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-clock text-orange-600 ml-1"></i>
                      زمان ارسال
                    </label>
                    <input
                        v-model="localShipping.alopeykDeliveryTime"
                        type="text"
                        placeholder="مثال: 1 تا 2 روز کاری"
                        class="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-coin text-orange-600 ml-1"></i>
                      هزینه ارسال (تومان)
                    </label>
                    <input
                        v-model="localShipping.alopeykPrice"
                        type="number"
                        placeholder="مثال: 50000"
                        class="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- حضور در محل -->
          <div class="border-2 rounded-xl transition-all"
               :class="localShipping.inPerson ? 'bg-teal-50 border-teal-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center shrink-0">
                  <i class="ti ti-home text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-bold text-gray-900 mb-1">حضور در محل</h3>
                  <p class="text-xs text-gray-600 mb-2">مشتری به داروخانه مراجعه می‌کند</p>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="px-2 py-1 bg-white rounded-full text-teal-700 font-medium border border-teal-200">
                      <i class="ti ti-clock text-xs ml-1"></i>
                      تحویل فوری
                    </span>
                    <span class="px-2 py-1 bg-white rounded-full text-teal-700 font-medium border border-teal-200">
                      <i class="ti ti-coin text-xs ml-1"></i>
                      رایگان
                    </span>
                  </div>
                </div>
              </div>
              <button
                  @click="localShipping.inPerson = !localShipping.inPerson"
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  :class="localShipping.inPerson ? 'bg-teal-600' : 'bg-gray-200'"
                  dir="ltr"
              >
                <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                    :class="localShipping.inPerson ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="localShipping.inPerson" class="px-4 pb-4 pt-2 border-t border-teal-200">
                <label class="block text-xs font-medium text-gray-700 mb-2">
                  <i class="ti ti-clock text-teal-600 ml-1"></i>
                  زمان ارسال
                </label>
                <input
                    v-model="localShipping.inPersonDeliveryTime"
                    type="text"
                    placeholder="مثال: فوری، حداکثر 30 دقیقه"
                    class="w-full px-3 py-2 text-sm border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
              </div>
            </Transition>
          </div>

          <!-- ارسال با پیک پتومن -->
          <div class="border-2 rounded-xl transition-all"
               :class="localShipping.petomanCourier ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                  <i class="ti ti-motorbike text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-sm font-bold text-gray-900">ارسال با پیک پتومن</h3>
                    <span class="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-bold">پیشنهاد ویژه</span>
                  </div>
                  <p class="text-xs text-gray-600 mb-2">ارسال سریع در سطح شهر توسط پیک‌های پتومن</p>
                  <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-1 bg-white rounded-full text-blue-700 font-medium border border-blue-200">
                <i class="ti ti-clock text-xs ml-1"></i>
                تا 2 ساعت
              </span>
                    <span class="px-2 py-1 bg-white rounded-full text-blue-700 font-medium border border-blue-200">
                <i class="ti ti-map-pin text-xs ml-1"></i>
                داخل شهر
              </span>
                  </div>
                </div>
              </div>
              <button
                  @click="localShipping.petomanCourier = !localShipping.petomanCourier"
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :class="localShipping.petomanCourier ? 'bg-blue-600' : 'bg-gray-200'"
                  dir="ltr"
              >
          <span
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="localShipping.petomanCourier ? 'translate-x-5' : 'translate-x-0.5'"
          ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="localShipping.petomanCourier" class="px-4 pb-4 pt-2 border-t border-blue-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-clock text-blue-600 ml-1"></i>
                      زمان ارسال
                    </label>
                    <input
                        v-model="localShipping.petomanCourierDeliveryTime"
                        type="text"
                        placeholder="مثال: 1 تا 2 ساعت"
                        class="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-coin text-blue-600 ml-1"></i>
                      هزینه پیک (تومان)
                    </label>
                    <input
                        v-model="localShipping.petomanCourierPrice"
                        type="number"
                        placeholder="مثال: 40000"
                        class="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ارسال با پیک داروخانه -->
          <div class="border-2 rounded-xl transition-all"
               :class="localShipping.pharmacyCourier ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0">
                  <i class="ti ti-bike text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-bold text-gray-900 mb-1">ارسال با پیک داروخانه</h3>
                  <p class="text-xs text-gray-600 mb-2">ارسال با پیک اختصاصی داروخانه در سطح شهر</p>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="px-2 py-1 bg-white rounded-full text-purple-700 font-medium border border-purple-200">
                      <i class="ti ti-clock text-xs ml-1"></i>
                      سفارشی
                    </span>
                    <span class="px-2 py-1 bg-white rounded-full text-purple-700 font-medium border border-purple-200">
                      <i class="ti ti-map-pin text-xs ml-1"></i>
                      داخل شهر
                    </span>
                  </div>
                </div>
              </div>
              <button
                  @click="localShipping.pharmacyCourier = !localShipping.pharmacyCourier"
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  :class="localShipping.pharmacyCourier ? 'bg-purple-600' : 'bg-gray-200'"
                  dir="ltr"
              >
                <span
                    class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                    :class="localShipping.pharmacyCourier ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="localShipping.pharmacyCourier" class="px-4 pb-4 pt-2 border-t border-purple-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-clock text-purple-600 ml-1"></i>
                      زمان ارسال
                    </label>
                    <input
                        v-model="localShipping.pharmacyCourierDeliveryTime"
                        type="text"
                        placeholder="مثال: 2 تا 4 ساعت"
                        class="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-coin text-purple-600 ml-1"></i>
                      هزینه پیک (تومان)
                    </label>
                    <input
                        v-model="localShipping.pharmacyCourierPrice"
                        type="number"
                        placeholder="مثال: 40000"
                        class="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ارسال با تیپاکس -->
          <div class="border-2 rounded-xl transition-all"
               :class="localShipping.tipax ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0">
                  <i class="ti ti-package text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-bold text-gray-900 mb-1">ارسال با تیپاکس</h3>
                  <p class="text-xs text-gray-600 mb-2">ارسال به شهرستان‌ها و شهرهای اطراف</p>
                  <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-1 bg-white rounded-full text-orange-700 font-medium border border-orange-200">
                <i class="ti ti-clock text-xs ml-1"></i>
                24-48 ساعت
              </span>
                    <span class="px-2 py-1 bg-white rounded-full text-orange-700 font-medium border border-orange-200">
                <i class="ti ti-map-2 text-xs ml-1"></i>
                سراسر کشور
              </span>
                  </div>
                </div>
              </div>
              <button
                  @click="localShipping.tipax = !localShipping.tipax"
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  :class="localShipping.tipax ? 'bg-orange-600' : 'bg-gray-200'"
                  dir="ltr"
              >
          <span
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="localShipping.tipax ? 'translate-x-5' : 'translate-x-0.5'"
          ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="localShipping.tipax" class="px-4 pb-4 pt-2 border-t border-orange-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-clock text-orange-600 ml-1"></i>
                      زمان ارسال
                    </label>
                    <input
                        v-model="localShipping.tipaxDeliveryTime"
                        type="text"
                        placeholder="مثال: 1 تا 2 روز کاری"
                        class="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-coin text-orange-600 ml-1"></i>
                      هزینه ارسال (تومان)
                    </label>
                    <input
                        v-model="localShipping.tipaxPrice"
                        type="number"
                        placeholder="مثال: 50000"
                        class="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ارسال با پست -->
          <div class="border-2 rounded-xl transition-all"
               :class="localShipping.post ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shrink-0">
                  <i class="ti ti-mail text-white text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-bold text-gray-900 mb-1">ارسال با پست</h3>
                  <p class="text-xs text-gray-600 mb-2">ارسال پستی به شهرستان‌ها و شهرهای اطراف</p>
                  <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-1 bg-white rounded-full text-green-700 font-medium border border-green-200">
                <i class="ti ti-clock text-xs ml-1"></i>
                3-5 روز کاری
              </span>
                    <span class="px-2 py-1 bg-white rounded-full text-green-700 font-medium border border-green-200">
                <i class="ti ti-map-2 text-xs ml-1"></i>
                سراسر کشور
              </span>
                  </div>
                </div>
              </div>
              <button
                  @click="localShipping.post = !localShipping.post"
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  :class="localShipping.post ? 'bg-green-600' : 'bg-gray-200'"
                  dir="ltr"
              >
          <span
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="localShipping.post ? 'translate-x-5' : 'translate-x-0.5'"
          ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="localShipping.post" class="px-4 pb-4 pt-2 border-t border-green-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-clock text-green-600 ml-1"></i>
                      زمان ارسال
                    </label>
                    <input
                        v-model="localShipping.postDeliveryTime"
                        type="text"
                        placeholder="مثال: 3 تا 5 روز کاری"
                        class="w-full px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-coin text-green-600 ml-1"></i>
                      هزینه پست (تومان)
                    </label>
                    <input
                        v-model="localShipping.postPrice"
                        type="number"
                        placeholder="مثال: 35000"
                        class="w-full px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- نکته مهم -->
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-6">
            <div class="flex items-start gap-3">
              <i class="ti ti-info-circle text-blue-600 text-xl shrink-0 mt-0.5"></i>
              <div>
                <h4 class="text-sm font-bold text-blue-900 mb-1">نکات مهم</h4>
                <ul class="text-xs text-blue-700 space-y-1 mr-4">
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500">•</span>
                    <span><strong>حضور در محل و پیک‌ها:</strong> برای سفارشات داخل شهر مناسب است</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500">•</span>
                    <span><strong>تیپاکس و پست:</strong> برای ارسال به شهرستان‌ها و شهرهای اطراف</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500">•</span>
                    <span>حداقل یک روش ارسال باید فعال باشد</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500">•</span>
                    <span>هزینه ارسال بر اساس روش انتخابی محاسبه می‌شود</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- دکمه ذخیره تنظیمات حمل و نقل -->
        <div class="mt-2 flex justify-end">
          <button
              @click="saveShippingSettings"
              class="mb-5 ml-5 px-6 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <i class="ti ti-device-floppy"></i>
            ذخیره تغییرات حمل و نقل
          </button>
        </div>
      </div>

      <!-- تنظیمات امنیتی -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-lock text-teal-600"></i>
            تنظیمات امنیتی
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">رمز عبور فعلی</label>
            <div class="relative">
              <input
                  v-model="currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="رمز عبور فعلی"
                  dir="ltr"
              >
              <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <i :class="showCurrentPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-xl"></i>
              </button>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">رمز عبور جدید</label>
                <div class="relative">
                  <input
                      v-model="newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                      placeholder="رمز عبور جدید"
                      dir="ltr"
                  >
                  <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    <i :class="showNewPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-xl"></i>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">تکرار رمز عبور جدید</label>
                <div class="relative">
                  <input
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                      placeholder="تکرار رمز عبور"
                      dir="ltr"
                  >
                  <button
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    <i :class="showConfirmPassword ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-xl"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="newPassword" class="mt-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-bold text-gray-700">قدرت رمز عبور:</span>
                <span
                    class="text-xs font-bold"
                    :class="passwordStrengthColor"
                >
                  {{ passwordStrengthText }}
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    class="h-full transition-all duration-300 rounded-full"
                    :class="passwordStrengthColor.replace('text-', 'bg-')"
                    :style="{ width: passwordStrength + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <button
                @click="changePassword"
                :disabled="passwordLoading || !currentPassword || !newPassword || !confirmPassword"
                class="w-full lg:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="!passwordLoading" class="ti ti-key text-xl"></i>
              <i v-else class="ti ti-loader-2 text-xl animate-spin"></i>
              <span v-if="passwordLoading">در حال تغییر...</span>
              <span v-else>تغییر رمز عبور</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted,nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { iranCitiesData, provinces, getCitiesByProvince } from '@/data/iran-cities'
import AppSelect from '@/components/AppSelect.vue'
import {usePharmacySettingsStore} from "@/stores/pharmacy/settings.js";
import AddressSelector from "@/components/AddressSelector.vue";
import {useUrlHelper} from "@/composables/useUrlHelper.js";
const {resolveUrl} = useUrlHelper()
// Initialize Store
const pharmacySettingsStore = usePharmacySettingsStore()
const { shipping, pharmacyInfo, loading, saving,rawSettings } = storeToRefs(pharmacySettingsStore)
const { fetchSettings, savePharmacyInfo: apiSavePharmacyInfo, saveShippingSettings: apiSaveShipping } = pharmacySettingsStore

const localLogoPreview = ref(null)

watch((pharmacyInfo), (newVal) => {
  localLogoPreview.value= resolveUrl(pharmacyInfo.value.logo)
}, { immediate: true })

const addressData = ref({
  address: {},
  province: '',
  city: '',
  location: null
})
const localAddressText = ref(pharmacyInfo.value.address.display_name || null)
const onChangeLocation = (data) => {

  localAddressText.value = data.address.display_name/*[
    data.address?.address?.road,
    data.address?.address?.neighbourhood??data.address?.address?.town,
    data.address?.address?.suburb??data.address?.address?.state
  ]
      .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
      .join('. ')*/
  const rawAddressData = data.address || {};
  const fullAddressDetails = JSON.parse(JSON.stringify(rawAddressData));

  pharmacyInfo.value.address = {
    display_name: fullAddressDetails.display_name || '',
    lat: parseFloat(fullAddressDetails.lat),
    lon: parseFloat(fullAddressDetails.lon),
    ...fullAddressDetails
  }
  pharmacyInfo.value.city = data.city ?? data.address?.address?.city
  pharmacyInfo.value.province = data.province ?? data.address?.address?.state
}

const daysOfWeek = [
  { value: 'saturday', label: 'شنبه' },
  { value: 'sunday', label: 'یکشنبه' },
  { value: 'monday', label: 'دوشنبه' },
  { value: 'tuesday', label: 'سه‌شنبه' },
  { value: 'wednesday', label: 'چهارشنبه' },
  { value: 'thursday', label: 'پنجشنبه' },
  { value: 'friday', label: 'جمعه' }
]

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordLoading = ref(false)
const pharmacyLoading = ref(false)

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength calculator
const passwordStrength = computed(() => {
  const password = newPassword.value
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 25
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
  if (/\d/.test(password)) strength += 15
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10

  return Math.min(strength, 100)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'ضعیف'
  if (strength < 60) return 'متوسط'
  if (strength < 90) return 'خوب'
  return 'عالی'
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'text-red-600'
  if (strength < 60) return 'text-orange-600'
  if (strength < 90) return 'text-yellow-600'
  return 'text-green-600'
})

// استان‌ها و شهرها - از فایل @/data/iran-cities import شده

const availableCities = computed(() => {
  if (!pharmacyInfo.value.province) return []
  return getCitiesByProvince(pharmacyInfo.value.province)
})

// مدیریت آپلود لوگو
const logoInput = ref(null)

const handleLogoUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // اعتبارسنجی نوع فایل
  if (!file.type.startsWith('image/')) {
    alert('❌ فقط فایل‌های تصویری مجاز است')
    return
  }

  // اعتبارسنجی حجم فایل (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('❌ حجم فایل باید کمتر از 2 مگابایت باشد')
    return
  }

  // خواندن و تبدیل به base64
  const reader = new FileReader()
  reader.onload = (e) => {
    localLogoPreview.value = e.target.result
    pharmacyInfo.value.logo = e.target.result

    pharmacyInfo.value.pendingChanges = true
  }
  reader.onerror = () => {
    alert('❌ خطا در بارگذاری تصویر')
  }
  reader.readAsDataURL(file)
}

// Validation
const validatePharmacyInfo = () => {
  const errors = []

  if (!pharmacyInfo.value.name.trim()) {
    errors.push('نام داروخانه الزامی است')
  }

  if (pharmacyInfo.value.ownerNationalId && pharmacyInfo.value.ownerNationalId.length !== 10) {
    errors.push('کد ملی باید ۱۰ رقم باشد')
  }

  if (pharmacyInfo.value.mobile && !pharmacyInfo.value.mobile.match(/^09\d{9}$/)) {
    errors.push('فرمت شماره موبایل صحیح نیست')
  }

  if (pharmacyInfo.value.email && !pharmacyInfo.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('فرمت ایمیل صحیح نیست')
  }

  if (pharmacyInfo.value.postalCode && pharmacyInfo.value.postalCode.length !== 10) {
    errors.push('کد پستی باید ۱۰ رقم باشد')
  }

  return errors
}

// Methods
const savePharmacyInfo = async () => {

  const errors = validatePharmacyInfo()

  if (errors.length > 0) {
    //alert('خطاهای زیر را برطرف کنید:\n' + errors.join('\n'))
    if (typeof window.showToast === 'function') {
      window.showToast('خطاهای زیر را برطرف کنید:\n' + errors.join('\n'), 'error', 5000);
    }
    return
  }

  pharmacyLoading.value = true

  try {
    apiSavePharmacyInfo(pharmacyInfo)

    // Save to localStorage
    const currentData = JSON.parse(localStorage.getItem('pharmacySettings') || '{}')

    // تنظیم وضعیت انتظار برای تایید
    pharmacyInfo.value.isApproved = false
    pharmacyInfo.value.pendingChanges = true

    localStorage.setItem('pharmacySettings', JSON.stringify({
      ...currentData,
      pharmacyInfo: pharmacyInfo.value,
      approvalStatus: 'pending',
      approvalRequestedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }))

    //alert('✅ اطلاعات با موفقیت ثبت شد و منتظر تایید مدیریت است\n\nتغییرات شما پس از تایید مدیریت در پروفایل داروخانه نمایش داده خواهد شد.')
    if (typeof window.showToast === 'function') {
      window.showToast(' اطلاعات با موفقیت ثبت شد و منتظر تایید مدیریت است\n\nتغییرات شما پس از تایید مدیریت در پروفایل داروخانه نمایش داده خواهد شد.', 'success', 5000);
    }
  } catch (error) {
    console.error('Error saving pharmacy info:', error)
    //alert('❌ خطا در ذخیره اطلاعات داروخانه')
    if (typeof window.showToast === 'function') {
      window.showToast(err.response?.data?.message, 'error', 5000);
    }
  } finally {
    pharmacyLoading.value = false
  }
}

const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('لطفاً همه فیلدها را پر کنید')
    return
  }

  if (newPassword.value.length < 8) {
    alert('رمز عبور جدید باید حداقل ۸ کاراکتر باشد')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('رمز عبور جدید و تکرار آن مطابقت ندارند')
    return
  }

  if (passwordStrength.value < 50) {
    if (!confirm('قدرت رمز عبور شما ضعیف است. آیا مطمئن هستید؟')) {
      return
    }
  }

  passwordLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert('✅ رمز عبور با موفقیت تغییر کرد!')

    // Clear form
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false

  } catch (error) {
    console.error('Error changing password:', error)
    alert('❌ خطا در تغییر رمز عبور')
  } finally {
    passwordLoading.value = false
  }
}

// Load settings on mount
onMounted(() => {
  fetchSettings()

})

// کپی کردن تنظیمات ارسال در یک متغیر محلی برای جلوگیری از لوپ
const localShipping = ref({ ...shipping.value })

// همگام‌سازی زمانی که تنظیمات از سرور لود می‌شود
watch(() => shipping.value, (newVal) => {
  localShipping.value = { ...newVal }
}, { deep: true })

const saveShippingSettings = async () => {
  const errors = []

  // بررسی پیک پتومن
  if (localShipping.value.petomanCourier) {
    if (!localShipping.value.petomanCourierDeliveryTime || !localShipping.value.petomanCourierPrice) {
      errors.push('برای ارسال با پیک پتومن، زمان و هزینه الزامی است')
    }
  }

  // بررسی پیک داروخانه
  if (localShipping.value.pharmacyCourier) {
    if (!localShipping.value.pharmacyCourierDeliveryTime || !localShipping.value.pharmacyCourierPrice) {
      errors.push('برای ارسال با پیک داروخانه، زمان و هزینه الزامی است')
    }
  }

  // بررسی تیپاکس
  if (localShipping.value.tipax) {
    if (!localShipping.value.tipaxDeliveryTime || !localShipping.value.tipaxPrice) {
      errors.push('برای ارسال با تیپاکس، زمان و هزینه الزامی است')
    }
  }

  // بررسی تیپاکس
  if (localShipping.value.alopeyk) {
    if (!localShipping.value.alopeykDeliveryTime || !localShipping.value.alopeykPrice) {
      errors.push('برای ارسال با الوپیک، زمان و هزینه الزامی است')
    }
  }

  // بررسی پست
  if (localShipping.value.post) {
    if (!localShipping.value.postDeliveryTime || !localShipping.value.postPrice) {
      errors.push('برای ارسال با پست، زمان و هزینه الزامی است')
    }
  }

  // اگر خطایی وجود داشت
  if (errors.length > 0) {
    alert('لطفاً خطاهای زیر را برطرف کنید:\n' + errors.join('\n'))
    return
  }

  try {
    // ذخیره در استور
    await apiSaveShipping(localShipping.value)

    // ذخیره در LocalStorage
    const currentData = JSON.parse(localStorage.getItem('pharmacySettings') || '{}')
    localStorage.setItem('pharmacySettings', JSON.stringify({
      ...currentData,
      shipping: localShipping.value,
      lastUpdated: new Date().toISOString()
    }))

    alert('✅ تنظیمات حمل و نقل با موفقیت ذخیره شد')
  } catch (error) {
    console.error('❌ خطا در ذخیره تنظیمات:', error)
    alert('❌ خطا در ذخیره تنظیمات')
  }
}


</script>

<style scoped>
/* Animation for spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* English font for numbers and emails */
.font-english {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: ltr;
  text-align: left;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #14b8a6;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0d9488;
}

/* Input focus effect */
input:focus,
textarea:focus,
select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Checkbox custom style */
input[type="checkbox"]:checked {
  background-color: #14b8a6;
  border-color: #14b8a6;
}
</style>