<template>
  <div class="min-h-screen bg-gray-50 pb-20 lg:pb-6">
    <div class="space-y-6">
      
      <!-- اطلاعات عمومی داروخانه -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-building-hospital text-teal-600"></i>
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
              <div class="flex-shrink-0">
                <div class="w-32 h-32 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    v-if="pharmacyInfo.logo" 
                    :src="pharmacyInfo.logo" 
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
                  <i class="ti ti-building text-teal-600"></i>
                  نام داروخانه
                </label>
                <input
                  v-model="pharmacyInfo.name"
                  type="text"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="مثال: داروخانه دکتر احمدی"
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

          <!-- آدرس -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-base font-bold text-gray-900 mb-4">
              آدرس و موقعیت مکانی
            </h3>
            <div class="space-y-6">
              <ClientOnly>
              <AddressSelector
                v-model="shopLocationData"
                placeholder="روی نقشه موقعیت فروشگاه را انتخاب کنید"
                title="انتخاب موقعیت فروشگاه"
              />
              </ClientOnly>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">کد پستی</label>
                <input
                  v-model="pharmacyInfo.postalCode"
                  type="text"
                  maxlength="10"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                  placeholder="1234567890"
                >
              </div>
            </div>
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
                <i class="ti ti-alert-circle text-amber-600 text-xl flex-shrink-0 mt-0.5"></i>
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

      <!-- تنظیمات اعلان‌ها -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-bell text-teal-600"></i>
            تنظیمات اعلان‌ها
          </h2>
        </div>

        <div class="p-6 space-y-3">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="text-sm font-bold text-gray-900">اعلان موجودی کم</h3>
              <p class="text-xs text-gray-600 mt-0.5">دریافت هشدار برای محصولات کم‌موجود</p>
            </div>
            <label class="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.notifications.lowStock"
                class="sr-only peer"
              >
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="text-sm font-bold text-gray-900">اعلان تاریخ انقضا</h3>
              <p class="text-xs text-gray-600 mt-0.5">هشدار برای محصولات نزدیک به انقضا</p>
            </div>
            <label class="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.notifications.expiry"
                class="sr-only peer"
              >
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="text-sm font-bold text-gray-900">اعلان سفارشات جدید</h3>
              <p class="text-xs text-gray-600 mt-0.5">اطلاع‌رسانی سفارشات جدید</p>
            </div>
            <label class="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.notifications.newOrders"
                class="sr-only peer"
              >
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="text-sm font-bold text-gray-900">اعلان ایمیل</h3>
              <p class="text-xs text-gray-600 mt-0.5">ارسال اعلان‌ها به ایمیل</p>
            </div>
            <label class="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.notifications.email"
                class="sr-only peer"
              >
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 class="text-sm font-bold text-gray-900">اعلان پیامکی (SMS)</h3>
              <p class="text-xs text-gray-600 mt-0.5">ارسال اعلان‌های مهم به موبایل</p>
            </div>
            <label class="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.notifications.sms"
                class="sr-only peer"
              >
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
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
          <!-- حضور در محل -->
          <div class="border-2 rounded-xl transition-all"
            :class="settings.shipping.inPerson ? 'bg-teal-50 border-teal-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
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
                @click="settings.shipping.inPerson = !settings.shipping.inPerson"
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                :class="settings.shipping.inPerson ? 'bg-teal-600' : 'bg-gray-200'"
                dir="ltr"
              >
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="settings.shipping.inPerson ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="settings.shipping.inPerson" class="px-4 pb-4 pt-2 border-t border-teal-200">
                <label class="block text-xs font-medium text-gray-700 mb-2">
                  <i class="ti ti-clock text-teal-600 ml-1"></i>
                  زمان ارسال
                </label>
                <input 
                  v-model="settings.shipping.inPersonDeliveryTime"
                  type="text" 
                  placeholder="مثال: فوری، حداکثر 30 دقیقه"
                  class="w-full px-3 py-2 text-sm border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
              </div>
            </Transition>
          </div>

          <!-- ارسال با پیک پتومن -->
          <div class="border-2 rounded-xl transition-all"
            :class="settings.shipping.petomanCourier ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
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
                @click="settings.shipping.petomanCourier = !settings.shipping.petomanCourier"
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="settings.shipping.petomanCourier ? 'bg-blue-600' : 'bg-gray-200'"
                dir="ltr"
              >
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="settings.shipping.petomanCourier ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="settings.shipping.petomanCourier" class="px-4 pb-4 pt-2 border-t border-blue-200">
                <label class="block text-xs font-medium text-gray-700 mb-2">
                  <i class="ti ti-clock text-blue-600 ml-1"></i>
                  زمان ارسال
                </label>
                <input 
                  v-model="settings.shipping.petomanCourierDeliveryTime"
                  type="text" 
                  placeholder="مثال: 1 تا 2 ساعت، حداکثر 3 ساعت"
                  class="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </Transition>
          </div>

          <!-- ارسال با پیک داروخانه -->
          <div class="border-2 rounded-xl transition-all"
            :class="settings.shipping.pharmacyCourier ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
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
                @click="settings.shipping.pharmacyCourier = !settings.shipping.pharmacyCourier"
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                :class="settings.shipping.pharmacyCourier ? 'bg-purple-600' : 'bg-gray-200'"
                dir="ltr"
              >
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="settings.shipping.pharmacyCourier ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="settings.shipping.pharmacyCourier" class="px-4 pb-4 pt-2 border-t border-purple-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                      <i class="ti ti-clock text-purple-600 ml-1"></i>
                      زمان ارسال
                    </label>
                    <input 
                      v-model="settings.shipping.pharmacyCourierDeliveryTime"
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
                      v-model="settings.shipping.pharmacyCourierPrice"
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
            :class="settings.shipping.tipax ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
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
                @click="settings.shipping.tipax = !settings.shipping.tipax"
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                :class="settings.shipping.tipax ? 'bg-orange-600' : 'bg-gray-200'"
                dir="ltr"
              >
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="settings.shipping.tipax ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="settings.shipping.tipax" class="px-4 pb-4 pt-2 border-t border-orange-200">
                <label class="block text-xs font-medium text-gray-700 mb-2">
                  <i class="ti ti-clock text-orange-600 ml-1"></i>
                  زمان ارسال
                </label>
                <input 
                  v-model="settings.shipping.tipaxDeliveryTime"
                  type="text" 
                  placeholder="مثال: 1 تا 2 روز کاری، 24 تا 48 ساعت"
                  class="w-full px-3 py-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
              </div>
            </Transition>
          </div>

          <!-- ارسال با پست -->
          <div class="border-2 rounded-xl transition-all"
            :class="settings.shipping.post ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'">
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
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
                @click="settings.shipping.post = !settings.shipping.post"
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                :class="settings.shipping.post ? 'bg-green-600' : 'bg-gray-200'"
                dir="ltr"
              >
                <span
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="settings.shipping.post ? 'translate-x-5' : 'translate-x-0.5'"
                ></span>
              </button>
            </div>
            <Transition name="slide-down">
              <div v-if="settings.shipping.post" class="px-4 pb-4 pt-2 border-t border-green-200">
                <label class="block text-xs font-medium text-gray-700 mb-2">
                  <i class="ti ti-clock text-green-600 ml-1"></i>
                  زمان ارسال
                </label>
                <input 
                  v-model="settings.shipping.postDeliveryTime"
                  type="text" 
                  placeholder="مثال: 3 تا 5 روز کاری، یک هفته"
                  class="w-full px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
              </div>
            </Transition>
          </div>

          <!-- نکته مهم -->
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-6">
            <div class="flex items-start gap-3">
              <i class="ti ti-info-circle text-blue-600 text-xl flex-shrink-0 mt-0.5"></i>
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
import { iranCitiesData } from '~/data/iran-cities-complete'

definePageMeta({
  layout: 'pet-shop'
})

// Reactive data
const settings = ref({
  notifications: {
    lowStock: true,
    expiry: true,
    newOrders: true,
    email: false,
    sms: true
  },
  shipping: {
    inPerson: true,
    inPersonDeliveryTime: '',
    petomanCourier: true,
    petomanCourierDeliveryTime: '',
    pharmacyCourier: false,
    pharmacyCourierDeliveryTime: '',
    pharmacyCourierPrice: '',
    tipax: true,
    tipaxDeliveryTime: '',
    post: false,
    postDeliveryTime: ''
  }
})

const pharmacyInfo = ref({
  // اطلاعات عمومی
  logo: '',
  name: 'داروخانه دکتر احمدی',
  description: 'داروخانه تخصصی با بیش از ۱۵ سال سابقه در ارائه خدمات دارویی با کیفیت بالا',
  
  // اطلاعات قانونی
  licenseNumber: '',
  medicalSystemCode: '',
  ownerNationalId: '',
  ownerName: '',
  
  // اطلاعات تماس
  phone: '021-12345678',
  mobile: '09123456789',
  email: 'info@pharmacy.com',
  website: '',
  
  // آدرس
  province: 'تهران',
  city: 'تهران',
  postalCode: '',
  address: '',
  
  // ساعات کاری
  is24Hours: false,
  openTime: '08:00',
  closeTime: '22:00',
  closedDays: [],
  
  // وضعیت تایید
  isApproved: true,
  pendingChanges: false
})

const shopLocationData = ref({
  address: '',
  province: '',
  city: '',
  location: null
})

// Watch shopLocationData and sync with pharmacyInfo
watch(shopLocationData, (newVal) => {
  pharmacyInfo.value.address = newVal.address
  pharmacyInfo.value.province = newVal.province
  pharmacyInfo.value.city = newVal.city
}, { deep: true })

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

// استان‌ها و شهرها
const provinces = computed(() => {
  return Object.keys(iranCitiesData).sort()
})

const provinceOptions = computed(() => {
  return provinces.value.map(p => ({ value: p, label: p }))
})

const availableCities = computed(() => {
  if (!pharmacyInfo.value.province) return []
  return iranCitiesData[pharmacyInfo.value.province]?.cities || []
})

const cityOptions = computed(() => {
  return availableCities.value.map(c => ({ value: c, label: c }))
})

const onProvinceChange = () => {
  // Reset city when province changes
  pharmacyInfo.value.city = ''
}

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
    alert('خطاهای زیر را برطرف کنید:\n' + errors.join('\n'))
    return
  }

  pharmacyLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Save to localStorage
    if (process.client) {
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
    }

    alert('✅ اطلاعات با موفقیت ثبت شد و منتظر تایید مدیریت است\n\nتغییرات شما پس از تایید مدیریت در پروفایل داروخانه نمایش داده خواهد شد.')

  } catch (error) {
    console.error('Error saving pharmacy info:', error)
    alert('❌ خطا در ذخیره اطلاعات داروخانه')
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
  if (process.client) {
    const savedSettings = localStorage.getItem('pharmacySettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        
        // Load notifications settings
        if (parsed.notifications) {
          settings.value.notifications = { 
            ...settings.value.notifications, 
            ...parsed.notifications 
          }
        }
        
        // Load shipping settings
        if (parsed.shipping) {
          settings.value.shipping = { 
            ...settings.value.shipping, 
            ...parsed.shipping 
          }
        }
        
        // Load pharmacy info
        if (parsed.pharmacyInfo) {
          pharmacyInfo.value = { 
            ...pharmacyInfo.value, 
            ...parsed.pharmacyInfo 
          }
        }
        
        console.log('✅ تنظیمات از localStorage بارگذاری شد')
      } catch (error) {
        console.error('❌ خطا در بارگذاری تنظیمات:', error)
      }
    }
  }
})

// Save notification settings when changed
watch(() => settings.value.notifications, (newNotifications) => {
  if (process.client) {
    try {
      const currentData = JSON.parse(localStorage.getItem('pharmacySettings') || '{}')
      localStorage.setItem('pharmacySettings', JSON.stringify({ 
        ...currentData, 
        notifications: newNotifications,
        lastUpdated: new Date().toISOString()
      }))
      console.log('✅ تنظیمات اعلان‌ها ذخیره شد')
    } catch (error) {
      console.error('❌ خطا در ذخیره تنظیمات:', error)
    }
  }
}, { deep: true })

// Save shipping settings when changed
watch(() => settings.value.shipping, (newShipping) => {
  if (process.client) {
    try {
      const currentData = JSON.parse(localStorage.getItem('pharmacySettings') || '{}')
      localStorage.setItem('pharmacySettings', JSON.stringify({ 
        ...currentData, 
        shipping: newShipping,
        lastUpdated: new Date().toISOString()
      }))
      console.log('✅ تنظیمات حمل و نقل ذخیره شد')
    } catch (error) {
      console.error('❌ خطا در ذخیره تنظیمات:', error)
    }
  }
}, { deep: true })
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