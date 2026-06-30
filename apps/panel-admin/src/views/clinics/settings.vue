<template>
  <div class="min-h-screen bg-gray-50 pb-20 lg:pb-6">
    <div class="space-y-6">

      <!-- اطلاعات عمومی کلینیک -->
      <div v-if="rawSettings" class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-building-hospital text-teal-600"></i>
            {{ isVet ? 'اطلاعات عمومی کلینیک' : 'اطلاعات عمومی دامپزشک' }}
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <!-- لوگو کلینیک -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              {{ isVet ? 'لوگو کلینیک' : 'لوگو دامپزشک' }}
            </label>
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                    class="w-32 h-32 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                      v-if="logoPreview"
                      :src="logoPreview"
                      :alt="isVet ? 'لوگو دامپزشک' : 'لوگو کلینیک'"
                      class="w-full h-full object-cover"
                  >
                  <div v-else class="text-center">
                    <i class="ti ti-photo text-4xl text-gray-300"></i>
                    <p class="text-xs text-gray-400 mt-2">بدون لوگو</p>
                  </div>
                </div>
              </div>

              <div class="flex-1">
                <input
                    ref="logoFileInput"
                    type="file"
                    accept="image/*"
                    @change="handleLogoUpload"
                    class="hidden"
                >
                <button
                    type="button"
                    @click="$refs.logoFileInput.click()"
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
                  {{ isVet ? 'نام کلینیک' : 'نام دامپزشک' }}
                </label>
                <input
                    v-model="rawSettings.clinicInfo.name"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    placeholder="مثال: کلینیک دکتر احمدی"
                >
              </div>

              <div>
                <label class="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <i class="ti ti-file-text text-teal-600"></i>
                  {{ isVet ? 'توضیحات کلینیک' : 'توضیحات دامپزشک' }}
                </label>
                <textarea
                    v-model="rawSettings.clinicInfo.description"
                    rows="3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
                    placeholder="توضیحات مختصری درباره کلینیک، خدمات و امکانات..."
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

                  {{ isVet ? 'شماره پروانه کلینیک' : 'شماره پروانه دامپزشک' }}
                </label>
                <input
                    v-model="rawSettings.clinicInfo.licenseNumber"
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
                    v-model="rawSettings.clinicInfo.medicalSystemCode"
                    type="text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="مثال: 0012345678"
                    dir="ltr"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  کد ملی صاحب امتیاز
                </label>
                <input
                    v-model="rawSettings.clinicInfo.ownerNationalId"
                    type="text"
                    maxlength="10"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="1234567890"
                    dir="ltr"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  نام صاحب امتیاز
                </label>
                <input
                    v-model="rawSettings.clinicInfo.ownerName"
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
                    v-model="rawSettings.clinicInfo.phone"
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
                    v-model="rawSettings.clinicInfo.mobile"
                    type="tel"
                    maxlength="11"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="09123456789"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  ایمیل کلینیک
                </label>
                <input
                    v-model="rawSettings.clinicInfo.email"
                    type="email"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="info@clinic.com"
                >
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  وبسایت (اختیاری)
                </label>
                <input
                    v-model="rawSettings.clinicInfo.website"
                    type="url"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                    placeholder="https://www.clinic.com"
                >
              </div>
            </div>
          </div>

          <!-- اطلاعات تخصصی و تحصیلی -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-user-search text-teal-600"></i>
              اطلاعات تخصصی و تحصیلی
            </h3>
            <div class="space-y-6">

              <!-- تخصص اصلی (فقط از دراپ‌داون انتخاب شود) -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  تخصص اصلی <span class="text-red-500">*</span>
                </label>

                <!-- اگر تخصص‌ها هنوز لود نشده‌اند -->
                <div v-if="!specialities || specialities.length === 0" class="text-sm text-gray-500 py-2">
                  در حال بارگذاری لیست تخصص‌ها...
                </div>

                <!-- دراپ‌داون تخصص -->
                <USelectMenu
                    v-else
                    v-model="professionalInfo.specialty"
                    :options="specialities"
                    placeholder="انتخاب تخصص"
                    :searchable="true"
                    search-placeholder="جستجو تخصص..."
                    class="w-full"
                    option-label="label"
                    option-value="id"
                    :disabled="saving"
                />

                <!-- نمایش پیام خطا اگر مقدار انتخاب نشده باشد (اختیاری) -->
                <p v-if="!professionalInfo.specialty" class="text-xs text-red-500 mt-1">
                  لطفاً تخصص خود را انتخاب کنید.
                </p>
              </div>

              <!-- سال‌های تجربه -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    سال‌های تجربه <span class="text-red-500">*</span>
                  </label>
                  <input
                      v-model.number="professionalInfo.experience"
                      type="number"
                      min="0"
                      placeholder="مثال: 10"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-english"
                      dir="ltr"
                  />
                </div>

                <!-- سابقه کار (اگر نیاز است جداگانه باشد، در غیر این صورت حذف شود) -->
                <!-- در کد اصلی شما دو فیلد تجربه وجود داشت. اینجا فقط یکی را نگه می‌داریم -->
              </div>

              <!-- تحصیلات -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">تحصیلات</label>
                <div class="space-y-2">
                  <div
                      v-for="(edu, index) in professionalInfo.education"
                      :key="index"
                      class="flex gap-2"
                  >
                    <input
                        v-model="professionalInfo.education[index]"
                        type="text"
                        class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm"
                        placeholder="مثال: دکترای دامپزشکی - دانشگاه تهران"
                    >
                    <button
                        v-if="professionalInfo.education.length > 1"
                        @click="removeEducation(index)"
                        type="button"
                        class="px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="حذف"
                    >
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>
                  <button
                      @click="addEducation"
                      type="button"
                      class="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-teal-500 hover:text-teal-600 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-plus"></i>
                    افزودن ردیف تحصیلات
                  </button>
                </div>
              </div>

              <!-- تخصص‌ها (مهارت‌های اضافی به صورت متنی) -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  حوزه‌های تخصصی (مهارت‌ها)
                </label>
                <p class="text-xs text-gray-500 mb-2">
                  مهارت‌های خاص خود را اینجا وارد کنید (مثال: جراحی ارتوپدی)
                </p>
                <div class="space-y-2">
                  <div
                      v-for="(spec, index) in professionalInfo.specialties"
                      :key="index"
                      class="flex gap-2"
                  >
                    <input
                        v-model="professionalInfo.specialties[index]"
                        type="text"
                        class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm"
                        placeholder="مثال: جراحی ارتوپدی"
                    >
                    <button
                        v-if="professionalInfo.specialties.length > 1"
                        @click="removeSpecialty(index)"
                        type="button"
                        class="px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="حذف"
                    >
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>
                  <button
                      @click="addSpecialty"
                      type="button"
                      class="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-teal-500 hover:text-teal-600 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-plus"></i>
                    افزودن حوزه تخصصی
                  </button>
                </div>
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
          <div v-if="!isVet">
            <!-- وضعیت شبانه‌روزی -->
            <div class="mb-6">
              <div class="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <i class="ti ti-24-hours text-teal-600 text-2xl"></i>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">کلینیک شبانه‌روزی</h4>
                    <p class="text-xs text-gray-600 mt-1">فعال بودن در تمام ساعات شبانه‌روز</p>
                  </div>
                </div>
                <button
                    v-if="rawSettings"
                    @click="rawSettings.clinicInfo.is24Hours = !rawSettings.clinicInfo.is24Hours"
                    type="button"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    :class="rawSettings.clinicInfo.is24Hours ? 'bg-teal-600' : 'bg-gray-200'"
                    dir="ltr"
                >
                  <span
                      class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                      :class="rawSettings.clinicInfo.is24Hours ? 'translate-x-5' : 'translate-x-0.5'"
                  ></span>
                </button>
              </div>
            </div>

            <!-- ساعات کاری معمولی -->
            <div v-if="!rawSettings.clinicInfo.is24Hours" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">ساعت شروع کار</label>
                  <input
                      v-model="rawSettings.clinicInfo.openTime"
                      type="time"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  >
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">ساعت پایان کار</label>
                  <input
                      v-model="rawSettings.clinicInfo.closeTime"
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
                      :class="rawSettings.clinicInfo.closedDays?.includes(day.value)
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-teal-500'"
                  >
                    <input
                        v-if="rawSettings"
                        type="checkbox"
                        :value="day.value"
                        v-model="rawSettings.clinicInfo.closedDays"
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
                  این کلینیک به صورت شبانه‌روزی و در تمام روزهای هفته فعال است.
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
                    تغییرات در اطلاعات کلینیک (نام، آدرس، مجوزها و...) پس از ذخیره، منتظر تایید مدیریت می‌مانند.
                    تا زمان تایید، اطلاعات قبلی در سایت نمایش داده می‌شود.
                  </p>
                </div>
              </div>
            </div>

            <button
                @click="saveClinicInfo"
                :disabled="saving"
                class="w-full lg:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="!saving" class="ti ti-send text-xl"></i>
              <i v-else class="ti ti-loader-2 text-xl animate-spin"></i>
              <span v-if="saving">در حال ارسال...</span>
              <span v-else>ارسال برای تایید مدیریت</span>
            </button>
          </div>
        </div>
      </div>

      <!-- قیمت‌گذاری خدمات و ویزیت‌ها -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="ti ti-currency-dollar text-teal-600"></i>
            قیمت‌گذاری خدمات و ویزیت‌ها
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <!-- انواع ویزیت -->
          <div>
            <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-stethoscope text-emerald-600"></i>
              انواع ویزیت
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- ویزیت حضوری -->
              <div class="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <i class="ti ti-building-hospital text-emerald-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">ویزیت حضوری</h4>
                    <p class="text-xs text-gray-500">مراجعه به کلینیک</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="visitPricing.inPerson.enabled" class="sr-only peer">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                <div v-if="visitPricing.inPerson.enabled">
                  <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                  <input
                      v-model="visitPricing.inPerson.price"
                      type="text"
                      class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-left font-english"
                      placeholder="150,000"
                      dir="ltr"
                  >
                </div>
              </div>

              <!-- ویزیت در منزل -->
              <div class="border-2 border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <i class="ti ti-home-heart text-amber-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">ویزیت در منزل</h4>
                    <p class="text-xs text-gray-500">دکتر به منزل می‌آید</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="visitPricing.home.enabled" class="sr-only peer">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                <div v-if="visitPricing.home.enabled">
                  <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                  <input
                      v-model="visitPricing.home.price"
                      type="text"
                      class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-left font-english"
                      placeholder="300,000"
                      dir="ltr"
                  >
                </div>
              </div>

              <!-- گفتگوی آنلاین -->
              <div class="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <i class="ti ti-message-circle text-blue-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">گفتگوی آنلاین</h4>
                    <p class="text-xs text-gray-500">چت با دکتر</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="visitPricing.chat.enabled" class="sr-only peer">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                <div v-if="visitPricing.chat.enabled">
                  <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                  <input
                      v-model="visitPricing.chat.price"
                      type="text"
                      class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-left font-english"
                      placeholder="80,000"
                      dir="ltr"
                  >
                </div>
              </div>

              <!-- تماس تلفنی فوری -->
              <div class="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <i class="ti ti-phone-call text-orange-600 text-xl"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">تماس تلفنی فوری</h4>
                    <p class="text-xs text-gray-500">تماس همین الان</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="visitPricing.phoneInstant.enabled" class="sr-only peer">
                    <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                <div v-if="visitPricing.phoneInstant.enabled">
                  <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                  <input
                      v-model="visitPricing.phoneInstant.price"
                      type="text"
                      class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-left font-english"
                      placeholder="200,000"
                      dir="ltr"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- تنظیمات تماس تلفنی زمان‌دار -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-calendar-time text-purple-600"></i>
                تماس تلفنی زمان‌دار
              </h3>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="phoneScheduleSettings.enabled" class="sr-only peer">
                <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <p class="text-sm text-gray-500 mb-4">
              کاربران می‌توانند زمان تماس را انتخاب کنند. قیمت‌ها بر اساس فوریت تماس متفاوت است.
            </p>

            <div v-if="phoneScheduleSettings.enabled" class="space-y-4">
              <!-- گزینه‌های زمان تماس -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 15 دقیقه دیگر -->
                <div class="border-2 border-purple-200 rounded-xl p-4 bg-purple-50/50">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <i class="ti ti-clock text-white"></i>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-gray-900">۱۵ دقیقه دیگر</h4>
                      <p class="text-xs text-gray-500">تماس سریع</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="phoneScheduleSettings.options.min15.enabled" class="sr-only peer">
                      <div
                          class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div v-if="phoneScheduleSettings.options.min15.enabled">
                    <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                    <input
                        v-model="phoneScheduleSettings.options.min15.price"
                        type="text"
                        class="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-left font-english"
                        placeholder="150,000"
                        dir="ltr"
                    >
                  </div>
                </div>

                <!-- 30 دقیقه دیگر -->
                <div class="border-2 border-purple-200 rounded-xl p-4 bg-purple-50/50">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <i class="ti ti-clock text-white"></i>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-gray-900">۳۰ دقیقه دیگر</h4>
                      <p class="text-xs text-gray-500">نیم ساعت بعد</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="phoneScheduleSettings.options.min30.enabled" class="sr-only peer">
                      <div
                          class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div v-if="phoneScheduleSettings.options.min30.enabled">
                    <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                    <input
                        v-model="phoneScheduleSettings.options.min30.price"
                        type="text"
                        class="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-left font-english"
                        placeholder="120,000"
                        dir="ltr"
                    >
                  </div>
                </div>

                <!-- 1 ساعت دیگر -->
                <div class="border-2 border-purple-200 rounded-xl p-4 bg-purple-50/50">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <i class="ti ti-clock text-white"></i>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-gray-900">۱ ساعت دیگر</h4>
                      <p class="text-xs text-gray-500">یک ساعت بعد</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="phoneScheduleSettings.options.hour1.enabled" class="sr-only peer">
                      <div
                          class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div v-if="phoneScheduleSettings.options.hour1.enabled">
                    <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                    <input
                        v-model="phoneScheduleSettings.options.hour1.price"
                        type="text"
                        class="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-left font-english"
                        placeholder="100,000"
                        dir="ltr"
                    >
                  </div>
                </div>

                <!-- زمان دلخواه -->
                <div class="border-2 border-purple-200 rounded-xl p-4 bg-purple-50/50">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <i class="ti ti-calendar text-white"></i>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-gray-900">زمان دلخواه</h4>
                      <p class="text-xs text-gray-500">انتخاب تاریخ و ساعت</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="phoneScheduleSettings.options.custom.enabled"
                             class="sr-only peer">
                      <div
                          class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div v-if="phoneScheduleSettings.options.custom.enabled">
                    <label class="block text-xs text-gray-600 mb-1">قیمت (تومان)</label>
                    <input
                        v-model="phoneScheduleSettings.options.custom.price"
                        type="text"
                        class="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-left font-english"
                        placeholder="80,000"
                        dir="ltr"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- دکمه ذخیره -->
          <div class="border-t border-gray-200 pt-6">
            <button
                @click="savePricingSettings"
                :disabled="saving"
                class="w-full lg:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="!saving" class="ti ti-device-floppy text-xl"></i>
              <i v-else class="ti ti-loader-2 text-xl animate-spin"></i>
              <span v-if="saving">در حال ذخیره...</span>
              <span v-else>ذخیره قیمت‌ها</span>
            </button>
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
                :disabled="saving || !currentPassword || !newPassword || !confirmPassword"
                class="w-full lg:w-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="!saving" class="ti ti-key text-xl"></i>
              <i v-else class="ti ti-loader-2 text-xl animate-spin"></i>
              <span v-if="saving">در حال تغییر...</span>
              <span v-else>تغییر رمز عبور</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, watchEffect,reactive} from 'vue'
import {provinces, getCitiesByProvince} from '@/data/iran-cities'
import AppSelect from '@/components/AppSelect.vue'
import {useVetClinicSettingsStore} from "@/stores/vet-clinic/settings.ts";
import {useAuthStore} from "@/stores/auth.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";
import AddressSelector from "@/components/AddressSelector.vue"
import {storeToRefs} from "pinia";
import USelectMenu from "@/components/ui/USelectMenu.vue";

const {resolveUrl} = useUrlHelper()
// استفاده از استور
const vetClinicStore = useVetClinicSettingsStore()
const {rawSettings, specialities} = storeToRefs(vetClinicStore)

// --- اطلاعات تخصصی و تحصیلی ---
const professionalInfo = ref({
  specialty: '',
  experience: null,
  education: [''],
  specialties: ['']
})
// دسترسی به computed های استور
const clinicInfo = computed(() => vetClinicStore.clinicInfo)

const authStore = useAuthStore()
const addressData = ref({
  address: {},
  province: '',
  city: '',
  location: null
})
const {tenant} = storeToRefs(authStore)
let isVet = reactive()
watch(tenant, (newVal) => {
  isVet = tenant.value?.type === 'VET' ;
});
const localAddressText = ref(rawSettings.value?.clinicInfo.address.display_name || null)
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

  rawSettings.value.clinicInfo.address = {
    display_name: fullAddressDetails.display_name || '',
    lat: parseFloat(fullAddressDetails.lat),
    lon: parseFloat(fullAddressDetails.lon),
    ...fullAddressDetails
  }
  rawSettings.value.clinicInfo.city = data.city ?? data.address?.address?.city
  rawSettings.value.clinicInfo.province = data.province ?? data.address?.address?.state
}

const saving = computed(() => vetClinicStore.saving)
const error = computed(() => vetClinicStore.error)

// --- متغیرهای موقت برای فرم (استان و شهر) ---
const formProvince = ref(clinicInfo.value.province || '')
const formCity = ref(clinicInfo.value.city || '')
// --- اصلاحیه مهم: استفاده از formProvince در computed ها ---

// لیست شهرها بر اساس استان انتخاب شده در فرم
const availableCities = computed(() => {
  // تغییر: استفاده از formProvince.value به جای clinicInfo.value.province
  if (!formProvince.value) return []
  return getCitiesByProvince(formProvince.value)
})

const daysOfWeek = [
  {value: 'saturday', label: 'شنبه'},
  {value: 'sunday', label: 'یکشنبه'},
  {value: 'monday', label: 'دوشنبه'},
  {value: 'tuesday', label: 'سه‌شنبه'},
  {value: 'wednesday', label: 'چهارشنبه'},
  {value: 'thursday', label: 'پنجشنبه'},
  {value: 'friday', label: 'جمعه'}
]


// متغیرهای محلی برای فرم رمز عبور
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// --- مدیریت لوگو ---
const logoPreview = ref(null)
const logoFileInput = ref(null)

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
  return 'text-sky-600'
})

// --- تنظیمات قیمت‌گذاری ویزیت‌ها ---
const visitPricing = ref({
  inPerson: {enabled: true, price: '150,000'},
  home: {enabled: true, price: '300,000'},
  chat: {enabled: true, price: '80,000'},
  phoneInstant: {enabled: true, price: '200,000'}
})

// --- تنظیمات تماس تلفنی زمان‌دار ---
const phoneScheduleSettings = ref({
  enabled: true,
  options: {
    min15: {enabled: true, price: '150,000'},
    min30: {enabled: true, price: '120,000'},
    hour1: {enabled: true, price: '100,000'},
    custom: {enabled: true, price: '80,000'}
  }
})


// توابع مدیریت لیست‌ها (افزودن/حذف)
const addEducation = () => {
  professionalInfo.value.education.push('')
}

const removeEducation = (index) => {
  professionalInfo.value.education.splice(index, 1)
}

const addSpecialty = () => {
  professionalInfo.value.specialties.push('')
}

const removeSpecialty = (index) => {
  professionalInfo.value.specialties.splice(index, 1)
}

// مدیریت آپلود لوگو
const handleLogoUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('❌ فقط فایل‌های تصویری مجاز است')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('❌ حجم فایل باید کمتر از 2 مگابایت باشد')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.onerror = () => {
    alert('❌ خطا در بارگذاری تصویر')
  }
  reader.readAsDataURL(file)
}

// Validation
const validateClinicInfo = (data) => {
  const errors = []
  if (!data.name.trim()) {
    errors.push('نام کلینیک الزامی است')
  }
  if (data.ownerNationalId && data.ownerNationalId.length !== 10) {
    errors.push('کد ملی باید ۱۰ رقم باشد')
  }
  if (data.mobile && !data.mobile.match(/^09\d{9}$/)) {
    errors.push('فرمت شماره موبایل صحیح نیست')
  }
  if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('فرمت ایمیل صحیح نیست')
  }
  if (data.postalCode && data.postalCode.length !== 10) {
    errors.push('کد پستی باید ۱۰ رقم باشد')
  }
  return errors
}

// Methods
const saveClinicInfo = async () => {

  const dataToSend = {
    ...rawSettings.value.clinicInfo,
    logo: logoPreview.value,
    openTime: clinicInfo.value.openTime,
    // اضافه کردن فیلدهای جدید
    specialty: professionalInfo.value.specialty,
    experience: String(professionalInfo.value.experience),
    education: professionalInfo.value.education.filter(e => e.trim() !== ''),
    specialties: professionalInfo.value.specialties.filter(s => s.trim() !== '')
  }


  const {isApproved, services, postalCode, pendingChanges, ...rest} = dataToSend

  const errors = validateClinicInfo(rest)
  if (errors.length > 0) {
    if (typeof window.showToast === 'function') {
      window.showToast('خطاهای زیر را برطرف کنید:\n' + errors.join('\n'), 'error', 5000);
    }
    return
  }

  try {
    await vetClinicStore.saveClinicInfo(rest)
    //alert('✅ اطلاعات با موفقیت ثبت شد و منتظر تایید مدیریت است\n\nتغییرات شما پس از تایید مدیریت در پروفایل کلینیک نمایش داده خواهد شد.')
    if (typeof window.showToast === 'function') {
      window.showToast(' اطلاعات با موفقیت ثبت شد و منتظر تایید مدیریت است\n\nتغییرات شما پس از تایید مدیریت در پروفایل کلینیک نمایش داده خواهد شد.', 'success', 5000);
    }
  } catch (err) {
    console.error('Error saving clinic info:', err)
    const errorMsg = vetClinicStore.error || 'خطا در ذخیره اطلاعات کلینیک'
    //alert('❌ ' + errorMsg)
    if (typeof window.showToast === 'function') {
      window.showToast(err.response?.data?.message, 'error', 5000);
    }
  }
}

const savePricingSettings = async () => {
  try {
    await vetClinicStore.savePricingSettings(visitPricing.value, phoneScheduleSettings.value)
    alert('✅ قیمت‌ها با موفقیت ذخیره شد!')
  } catch (err) {
    console.error('Error saving pricing settings:', err)
    const errorMsg = vetClinicStore.error || 'خطا در ذخیره قیمت‌ها'
    alert('❌ ' + errorMsg)
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
  try {
    await vetClinicStore.changePassword({
      current: currentPassword.value,
      new: newPassword.value
    })
    alert('✅ رمز عبور با موفقیت تغییر کرد!')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  } catch (err) {
    console.error('Error changing password:', err)
    const errorMsg = vetClinicStore.error || 'خطا در تغییر رمز عبور'
    alert('❌ ' + errorMsg)
  }
}
onMounted(async () => {
  await vetClinicStore.fetchSettings()

  if (vetClinicStore.specialities && vetClinicStore.specialities.length > 0) {
    console.log('Specialities count:', vetClinicStore.specialities.length)
  } else {
    console.warn('Specialities is empty! Check backend response.')
  }

  if (clinicInfo.value.logo) {
    logoPreview.value = resolveUrl(clinicInfo.value.logo)
  }
  if (clinicInfo.value.address) {
    localAddressText.value = clinicInfo.value.address.display_name
  }

  // مقداردهی اولیه استان و شهر
  formProvince.value = clinicInfo.value.province || ''
  formCity.value = clinicInfo.value.city || ''

  // --- مقداردهی اولیه اطلاعات تخصصی ---
  if (clinicInfo.value.specialty) professionalInfo.value.specialty = clinicInfo.value.specialty
  if (clinicInfo.value.experience) professionalInfo.value.experience = clinicInfo.value.experience
  if (clinicInfo.value.education && clinicInfo.value.education.length > 0) {
    professionalInfo.value.education = [...clinicInfo.value.education]
  }
  if (clinicInfo.value.specialties && clinicInfo.value.specialties.length > 0) {
    professionalInfo.value.specialties = [...clinicInfo.value.specialties]
  }

  const storeVisitPricing = vetClinicStore.visitPricing
  if (!storeVisitPricing || Object.keys(storeVisitPricing).length === 0) {
    console.log('Using default visit pricing')
  } else {
    visitPricing.value = {...storeVisitPricing}
  }

  const storePhoneSchedule = vetClinicStore.phoneScheduleSettings
  if (!storePhoneSchedule || !storePhoneSchedule.options || Object.keys(storePhoneSchedule.options).length === 0) {
    console.log('Using default phone schedule')
  } else {
    phoneScheduleSettings.value = {...storePhoneSchedule}
  }
})
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
  box-shadow: 0 4px 6 -1px rgba(0, 0, 0, 0.1);
}

/* Checkbox custom style */
input[type="checkbox"]:checked {
  background-color: #14b8a6;
  border-color: #14b8a6;
}
</style>