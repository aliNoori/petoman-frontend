<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div class="flex items-center gap-3">
        <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ isEditMode ? 'ویرایش دارو' : 'افزودن دارو' }}</h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ isEditMode ? 'تغییر اطلاعات دارو در لیست داروخانه' : 'جستجو و افزودن دارو به لیست داروخانه' }}</p>
        </div>
      </div>
    </div>

    <!-- Search or Create Component -->
    <MedicineSearchOrCreate
        v-if="mode === 'search' && !isEditMode"
        :key="searchComponentKey"
        @attach-medicine="handleAttachExisting"
        @create-medicine="handleCreateNew"
    />

    <!-- Form -->
    <div v-if="mode === 'attach' || mode === 'create' || isEditMode"
         class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <!-- Mode Indicator -->
      <div v-if="!isEditMode" class="mb-6 rounded-xl shadow-sm border transition-all duration-300"
           :class="mode === 'attach' ? 'bg-teal-50/80 border-teal-200' : 'bg-purple-50/80 border-purple-200'">

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">

          <!-- Left: Icon & Text -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Icon Container -->
            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                 :class="mode === 'attach' ? 'bg-teal-500' : 'bg-purple-500'">
              <i class="text-lg sm:text-xl text-white"
                 :class="mode === 'attach' ? 'ti ti-link' : 'ti ti-plus'"></i>
            </div>

            <!-- Text Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-800 text-base sm:text-lg leading-tight mb-0.5">
                {{ mode === 'attach' ? 'اتصال به داروی جهانی' : 'ایجاد دارو جدید' }}
              </h3>
              <p class="text-sm text-gray-600 leading-snug truncate sm:whitespace-normal">
                {{ mode === 'attach' ? attachedMedicine?.name : 'در حال ایجاد دارو جدید در سیستم' }}
              </p>
            </div>
          </div>

          <!-- Right: Action Button -->
          <div class="w-full sm:w-auto shrink-0">
            <button
                @click="resetMode"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              <i class="ti ti-arrow-right text-lg"></i>
              <span>بازگشت به لیست</span>
            </button>
          </div>

        </div>
      </div>

      <div class="space-y-4">

        <!-- 1. اطلاعات اصلی -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
              type="button"
              @click="toggleSection('basic')"
              class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                <i class="ti ti-info-circle text-white text-xl"></i>
              </div>
              <div class="text-right">
                <h3 class="font-bold text-gray-900">اطلاعات اصلی دارو</h3>
                <p class="text-sm text-gray-500">نام، کد و دسته‌بندی دارو</p>
              </div>
            </div>
            <i class="ti text-xl text-gray-400 transition-transform"
               :class="openSections.basic ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
          </button>

          <div v-show="openSections.basic" class="p-5 pt-0 space-y-4 border-t border-gray-100">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                <i class="ti ti-pill text-teal-600"></i>
                نام دارو
              </label>
              <!-- در حالت اتصال، فقط نمایش داده می‌شود -->
              <div v-if="mode === 'attach'"
                   class="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold">
                {{ formData.name }}
              </div>
              <input
                  v-else
                  v-model="formData.name"
                  type="text"
                  placeholder="مثال: آموکسی‌سیلین 500mg"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  required
              />
              <p v-if="errors?.name" class="text-xs text-red-600 mt-1 mr-1">
                <i class="ti ti-alert-circle"></i> {{ errors.name }}
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  <i class="ti ti-barcode text-blue-600"></i>
                  کد دارو
                </label>
                <div v-if="mode === 'attach'"
                     class="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-mono">
                  {{ formData.code }}
                </div>
                <input
                    v-else
                    v-model="formData.code"
                    type="text"
                    placeholder="مثال: MED-001"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    required
                />
                <p v-if="formData.errors?.code" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ formData.errors.code }}
                </p>
              </div>
              <div>
                <!-- 1. دسته‌بندی (اول همه) -->
                <div v-if="mode === 'create'">
                  <CategorySelector
                      v-model="formData.category"
                      type="pharmacy"
                      @update:breadcrumb="formData.categoryBreadcrumb = $event"
                  />
                  <p v-if="errors?.category" class="text-xs text-red-600 mt-1 mr-1">
                    <i class="ti ti-alert-circle"></i> {{ errors.category }}
                  </p>
                </div>

                <div v-if="mode === 'attach'" class="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    <i class="ti ti-category text-blue-600"></i>
                    دسته‌بندی محصول
                  </label>
                  <div class="text-gray-900 font-bold">
                    {{ formData.categoryBreadcrumb }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. قیمت و موجودی -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
              type="button"
              @click="toggleSection('pricing')"
              class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <i class="ti ti-moneybag text-white text-xl"></i>
              </div>
              <div class="text-right">
                <h3 class="font-bold text-gray-900">قیمت و موجودی</h3>
                <p class="text-sm text-gray-500">قیمت و تعداد موجودی دارو</p>
              </div>
            </div>
            <i class="ti text-xl text-gray-400 transition-transform"
               :class="openSections.pricing ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
          </button>

          <div v-show="openSections.pricing" class="p-5 pt-0 space-y-4 border-t border-gray-100">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">قیمت (تومان)</label>
                <input
                    :value="formData.price"
                    @input="formatPrice"
                    type="text"
                    placeholder="قیمت (تومان)"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    required
                />
                <p v-if="errors?.price" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.price }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">موجودی</label>
                <input
                    v-model.number="formData.stock"
                    type="number"
                    placeholder="موجودی"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    required
                />
                <p v-if="errors?.stock" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.stock }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. مشخصات دارویی (فقط در حالت Create یا ویرایش داروهای تایید نشده) -->
        <div v-if="mode === 'create' || (isEditMode && !isMedicineApproved)"
             class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
              type="button"
              @click="toggleSection('medical')"
              class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <i class="ti ti-medical-cross text-white text-xl"></i>
              </div>
              <div class="text-right">
                <h3 class="font-bold text-gray-900">مشخصات دارویی</h3>
                <p class="text-sm text-gray-500">ماده موثره، شکل دارویی و...</p>
              </div>
            </div>
            <i class="ti text-xl text-gray-400 transition-transform"
               :class="openSections.medical ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
          </button>

          <div v-show="openSections.medical" class="p-5 pt-0 space-y-4 border-t border-gray-100">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">ماده موثره</label>
                <input
                    v-model="formData.activeIngredient"
                    type="text"
                    placeholder="مثال: Amoxicillin"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
                <p v-if="errors?.activeIngredient" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.activeIngredient }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">شکل دارویی</label>
                <select
                    v-model="formData.dosageForm"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="tablet">قرص</option>
                  <option value="capsule">کپسول</option>
                  <option value="syrup">شربت</option>
                  <option value="injection">آمپول</option>
                  <option value="cream">پماد/کرم</option>
                  <option value="drops">قطره</option>
                  <option value="powder">پودر</option>
                </select>
                <p v-if="errors?.dosageForm" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.dosageForm }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">دوز مصرف</label>
                <input
                    v-model="formData.dosage"
                    type="text"
                    placeholder="مثال: 500mg دو بار در روز"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
                <p v-if="errors?.dosage" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.dosage }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">مناسب برای</label>
                <input
                    v-model="formData.suitableFor"
                    type="text"
                    placeholder="مثال: سگ، گربه"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
                <p v-if="errors?.suitableFor" class="text-xs text-red-600 mt-1 mr-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.suitableFor }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نحوه نگهداری</label>
              <textarea
                  v-model="formData.storage"
                  rows="2"
                  placeholder="مثال: در دمای 15-25 درجه و دور از نور"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
              ></textarea>
              <p v-if="errors?.storage" class="text-xs text-red-600 mt-1 mr-1">
                <i class="ti ti-alert-circle"></i> {{ errors.storage }}
              </p>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p class="font-bold text-gray-900">نیاز به نسخه دارد</p>
                <p class="text-sm text-gray-500">این دارو نیاز به نسخه پزشک دارد</p>
              </div>
              <button
                  @click="formData.prescriptionRequired = !formData.prescriptionRequired"
                  type="button"
                  :class="[
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                  formData.prescriptionRequired ? 'bg-red-600' : 'bg-gray-300'
                ]"
              >
                <span
                    :class="[
                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                    formData.prescriptionRequired ? 'translate-x-7 rtl:-translate-x-7' : 'translate-x-1 rtl:translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4. تاریخ انقضا -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
              type="button"
              @click="toggleSection('expiry')"
              class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <i class="ti ti-calendar-due text-white text-xl"></i>
              </div>
              <div class="text-right">
                <h3 class="font-bold text-gray-900">تاریخ انقضا</h3>
                <p class="text-sm text-gray-500">تاریخ انقضای دارو</p>
              </div>
            </div>
            <i class="ti text-xl text-gray-400 transition-transform"
               :class="openSections.expiry ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
          </button>

          <!-- Date Input Area -->
          <div v-if="openSections.expiry" class="animate-fadeIn">

            <!-- Format Switcher (Shamsi/Gregorian) -->
            <div class="flex items-center justify-between mb-3 bg-white p-2 rounded-lg border border-gray-200">
              <span class="text-xs font-medium text-gray-600 mr-2">فرمت تاریخ:</span>
              <div class="flex items-center bg-gray-100 rounded-md p-0.5">
                <button
                    @click="useGregorianExpiry = false"
                    :class="[
                              'px-3 py-1 text-xs font-bold rounded-md transition-all',
                              !useGregorianExpiry ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            ]"
                >
                  شمسی
                </button>
                <button
                    @click="useGregorianExpiry = true"
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-md transition-all',
                      useGregorianExpiry ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    ]"
                >
                  میلادی
                </button>
              </div>
            </div>

            <!-- Input Wrapper -->
            <div class="relative group">
              <input
                  v-model="formData.expiryDate"
                  @input="clearError('expiryDate')"
                  :type="useGregorianExpiry ? 'date' : 'text'"
                  :placeholder="formData.expiryDate ? '' : (useGregorianExpiry ? 'Select Date' : 'انتخاب تاریخ انقضا')"
                  @click="useGregorianExpiry ? null : openExpiryDatePicker()"
                  :readonly="!useGregorianExpiry"
                  class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none text-right shadow-sm"
                  dir="ltr"
              />

              <!-- Helper Text / Error -->
              <div class="mt-2 flex items-start gap-1.5">
                <i class="ti ti-info-circle text-gray-400 mt-0.5 text-xs"></i>
                <p class="text-xs text-gray-500 leading-relaxed">
                  {{ useGregorianExpiry ? 'فرمت YYYY-MM-DD' : 'تاریخ را از تقویم انتخاب کنید' }}
                </p>
              </div>

              <!-- Error Message -->
              <p v-if="errors?.expiryDate" class="mt-1 text-xs text-red-600 font-bold flex items-center gap-1">
                <i class="ti ti-alert-circle"></i>
                {{ errors?.expiryDate }}
              </p>
            </div>
          </div>
        </div>

        <!-- 5. تصاویر (فقط در حالت Create) -->
        <div v-if="mode === 'create'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
              type="button"
              @click="toggleSection('images')"
              class="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <i class="ti ti-photo text-white text-xl"></i>
              </div>
              <div class="text-right">
                <h3 class="font-bold text-gray-900">تصاویر دارو</h3>
                <p class="text-sm text-gray-500">آپلود تصاویر دارو (حداکثر 5 تصویر)</p>
              </div>
            </div>
            <i class="ti text-xl text-gray-400 transition-transform"
               :class="openSections.images ? 'ti-chevron-up' : 'ti-chevron-down'"></i>
          </button>

          <div v-show="openSections.images" class="p-5 pt-0 border-t border-gray-100">
            <div class="flex flex-wrap gap-3">
              <!-- Gallery Images -->
              <div
                  v-for="(img, index) in galleryImages"
                  :key="index"
                  @click="setMainImage(index)"
                  class="relative group w-24 h-24 rounded-lg border-2 overflow-hidden transition-all cursor-pointer"
                  :class="img.isMain ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-teal-300'"
              >
                <img :src="img.preview" class="w-full h-full object-cover"/>

                <!-- Main Badge -->
                <div
                    v-if="img.isMain"
                    class="absolute top-1 right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center"
                >
                  <i class="ti ti-check text-sm text-white"></i>
                </div>

                <!-- Delete Button -->
                <button
                    @click.stop="removeGalleryImage(index)"
                    type="button"
                    class="absolute top-1 left-1 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <i class="ti ti-x text-sm text-white"></i>
                </button>
              </div>

              <!-- Add Button -->
              <label v-if="galleryImages.length < 5" class="cursor-pointer inline-block">
                <input
                    type="file"
                    accept="image/*"
                    @change="handleGalleryUpload"
                    class="hidden"
                    multiple
                />
                <div
                    class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-500 bg-gray-50 hover:bg-teal-50 transition-all flex flex-col items-center justify-center gap-1">
                  <i class="ti ti-plus text-2xl text-gray-400"></i>
                  <span class="text-xs text-gray-500">افزودن</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- نمایش تصاویر در حالت Attach (فقط خواندنی) -->
        <div v-if="mode === 'attach'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label class="block text-sm font-bold text-gray-700 mb-3">
            <i class="ti ti-photo text-purple-600"></i>
            تصاویر دارو
            <span class="text-xs text-gray-500 font-normal mr-2">(تصاویر استاندارد جهانی)</span>
          </label>
          <div class="flex flex-wrap gap-3">
            <div
                v-for="(img, index) in galleryImages"
                :key="index"
                class="relative w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden"
            >
              <img :src="img.preview" class="w-full h-full object-cover"/>
              <div v-if="img.isMain"
                   class="absolute top-1 right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <i class="ti ti-check text-sm text-white"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- وضعیت -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-gray-900">فعال بودن دارو</p>
              <p class="text-sm text-gray-500">این دارو در لیست نمایش داده شود</p>
            </div>
            <button
                @click="formData.isActive = !formData.isActive"
                type="button"
                :class="[
                'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                formData.isActive ? 'bg-teal-600' : 'bg-gray-300'
              ]"
            >
              <span
                  :class="[
                  'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                  formData.isActive ? 'translate-x-7 rtl:-translate-x-7' : 'translate-x-1 rtl:translate-x-1'
                ]"
              ></span>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
              type="button"
              @click="submitForm"
              class="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <i class="ti ti-check"></i>
            {{ isEditMode ? 'ویرایش دارو' : 'ذخیره دارو' }}
          </button>
          <button
              @click="$router.back()"
              type="button"
              class="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border-2 border-gray-200"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
    <!-- *** Date Picker Modal (همیشه در دسترس) *** -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" @click="showDatePicker = false">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4" @click.stop>
        <div class="flex items-center justify-between p-6 pb-4">
          <h3 class="text-lg font-bold text-gray-900">انتخاب تاریخ</h3>
          <button @click="showDatePicker = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-600"></i>
          </button>
        </div>
        <!-- Calendar Header -->
        <div class="flex items-center justify-between px-6 pb-3 border-b-2 border-gray-100">
          <button type="button" @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-chevron-right text-xl text-gray-700"></i>
          </button>
          <div class="flex items-center gap-2">
            <div class="relative">
              <button type="button" @click.stop="showMonthDropdown = !showMonthDropdown" class="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg font-bold text-gray-900 transition-colors flex items-center gap-2">
                <!-- اگر میلادی باشد، نام انگلیسی و اگر شمسی باشد، نام فارسی -->
                <span v-if="useGregorianExpiry">{{ gregorianMonths[tempDate.month - 1] }}</span>
                <span v-else>{{ persianMonths[tempDate.month - 1] }}</span>

                <i class="ti ti-chevron-down text-sm"></i>
              </button>

              <!-- Dropdown ماه‌ها (پویا) -->
              <ul v-if="showMonthDropdown" class="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10 w-32">
                <li
                    v-for="(month, idx) in (useGregorianExpiry ? gregorianMonths : persianMonths)"
                    :key="idx"
                    @click="selectMonth(idx + 1)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="tempDate.month === idx + 1 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'"
                >
                  {{ month }}
                </li>
              </ul>
            </div>
            <div class="relative">
              <button type="button" @click.stop="showYearDropdown = !showYearDropdown" class="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg font-bold text-gray-900 transition-colors flex items-center gap-2">
                {{ tempDate.year }}
                <i class="ti ti-chevron-down text-sm"></i>
              </button>
              <ul v-if="showYearDropdown" class="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10 w-24">
                <li v-for="year in years" :key="year"
                    @click="selectYear(year)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    :class="tempDate.year === year ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'">
                  {{ year }}
                </li>
              </ul>
            </div>
          </div>
          <button type="button" @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-chevron-left text-xl text-gray-700"></i>
          </button>
        </div>
        <!-- Calendar Grid -->
        <div class="px-6 py-4">
          <!-- Week Days -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="day in weekDays" :key="day" class="text-center text-xs font-bold text-gray-500 py-2">
              {{ day }}
            </div>
          </div>
          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-1">
            <button
                v-for="day in calendarDays"
                :key="day"
                type="button"
                @click="day && selectDay(day)"
                :disabled="!day"
                class="aspect-square rounded-lg font-bold text-sm transition-all"
                :class="[
                       day ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default',
                       day === tempDate.day ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700',
                       !day ? 'invisible' : ''
                     ]"
            >
              {{ day }}
            </button>
          </div>
        </div>
        <div class="flex gap-2 p-6 pt-0">
          <button
              type="button"
              @click="selectToday"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            امروز
          </button>
          <button
              type="button"
              @click="confirmDate"
              class="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref,watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useNotification} from '@/composables/useNotification'
import {useMedicineStore} from "@/stores/pharmacy/medicine.store.js";
import MedicineSearchOrCreate from "@/components/MedicineSearchOrCreate.vue";
import moment from 'moment-jalaali';
import CategorySelector from "@/components/CategorySelector.vue";
import { format, parse, isLeapYear, getDaysInMonth, startOfMonth, startOfISOWeek, getDay, addMonths, subMonths } from 'date-fns'
import { faIR } from 'date-fns/locale'
import {useUrlHelper} from "@/composables/useUrlHelper.js";
const router = useRouter()
const route = useRoute()
const {resolveUrl}=useUrlHelper()
const medicineStore = useMedicineStore()
const {showSuccess, showError} = useNotification()
const showDatePicker = ref(false)
// State
const mode = ref('search') // 'search' | 'attach' | 'create'
const attachedMedicine = ref(null)
const searchComponentKey = ref(0)
const openSections = ref({
  basic: true,
  pricing: false,
  medical: false,
  expiry: false,
  images: false
})
const galleryImages = ref([])
const isEditMode = ref(false)
const isMedicineApproved = ref(false)

const formData = ref({
  id: null,
  name: '',
  code: '',
  category: '',
  categoryBreadcrumb: '',
  price: '',
  stock: null,
  activeIngredient: '',
  dosageForm: '',
  dosage: '',
  suitableFor: '',
  storage: '',
  prescriptionRequired: false,
  expiryDate: '',
  mainImage: null,
  gallery: [],
  isActive: true,
  type: 'medicine',
  globalMedicineId: null // برای ذخیره آی‌دی دارو جهانی در حالت attach
})
// 2. تعریف errors به صورت یک ref جداگانه
const errors = ref({})

// 3. تابع پاک کردن خطا (اکنون از errors.value استفاده می‌کند)
const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// Methods
const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section]
}

const resetMode = () => {
  mode.value = 'search'
  attachedMedicine.value = null
  searchComponentKey.value++
  // Reset form data partially
  formData.value = {
    ...formData.value,
    name: '', code: '', category: '', categoryBreadcrumb: '', price: '', stock: null,
    activeIngredient: '', dosageForm: '', dosage: '', suitableFor: '', storage: '',
    prescriptionRequired: false, expiryDate: '', globalMedicineId: null,
  }
  galleryImages.value = []
}

// هندلر انتخاب دارو از جستجو (Attach)
const handleAttachExisting = (medicine) => {
  mode.value = 'attach'
  attachedMedicine.value = medicine

  // پر کردن فرم با اطلاعات دارو جهانی
  formData.value.name = medicine.name
  formData.value.code = medicine.code
  formData.value.category = medicine.category
  formData.value.categoryBreadcrumb = medicine.categoryBreadcrumb
  formData.value.globalMedicineId = medicine.id
  formData.value.activeIngredient = medicine.activeIngredient
  formData.value.dosageForm = medicine.dosageForm
  formData.value.dosage = medicine.dosage
  formData.value.suitableFor = medicine.suitableFor
  formData.value.storage = medicine.storage
  formData.value.prescriptionRequired = medicine.prescriptionRequired

  // قیمت پیشنهادی (اگر وجود دارد)
  const suggestedPrice = medicine.suggestedPrice || 0
  formData.value.price = new Intl.NumberFormat('fa-IR').format(suggestedPrice)

  // نمایش تصاویر دارو جهانی (فقط خواندنی)
  galleryImages.value = []
  if (medicine.image) {
    galleryImages.value.push({
      url: medicine.image,
      preview: resolveUrl(medicine.image),
      isMain: true,
      readonly: true
    })
  }
  if (medicine.galleryImages && medicine.galleryImages.length > 0) {
    medicine.galleryImages.forEach(imgUrl => {
      galleryImages.value.push({
        url: imgUrl,
        preview: resolveUrl(imgUrl),
        isMain: false,
        readonly: true
      })
    })
  }

  errors.value = null
}

// هندلر ایجاد دارو جدید
const handleCreateNew = () => {
  mode.value = 'create'
  attachedMedicine.value = null
  // ریست فرم
  formData.value = {
    id: null,
    name: '',
    code: '',
    category: '',
    categoryBreadcrumb: '',
    price: '',
    stock: null,
    activeIngredient: '',
    dosageForm: '',
    dosage: '',
    suitableFor: '',
    storage: '',
    prescriptionRequired: false,
    expiryDate: '',
    mainImage: null,
    gallery: [],
    isActive: true,
    type: 'medicine',
    globalMedicineId: null
  }
  galleryImages.value = []
}

// فرمت قیمت
const formatPrice = (event) => {
  let value = event.target.value
  let rawValue = value.replace(/,/g, '')
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  persianNumbers.forEach((num, index) => {
    rawValue = rawValue.replace(new RegExp(num, 'g'), index)
  })
  rawValue = rawValue.replace(/\D/g, '')
  if (rawValue) {
    formData.value.price = new Intl.NumberFormat('fa-IR').format(rawValue)
  } else {
    formData.value.price = ''
  }
}

const handleGalleryUpload = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 5 - galleryImages.value.length
  files.slice(0, remainingSlots).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const isFirstImage = galleryImages.value.length === 0
      galleryImages.value.push({
        file: file,
        preview: e.target.result,
        isMain: isFirstImage
      })
      updateFormData()
    }
    reader.readAsDataURL(file)
  })
  event.target.value = ''
}

const setMainImage = (index) => {
  galleryImages.value.forEach(img => img.isMain = false)
  galleryImages.value[index].isMain = true
  updateFormData()
}

const removeGalleryImage = (index) => {
  const wasMain = galleryImages.value[index].isMain
  galleryImages.value.splice(index, 1)
  if (wasMain && galleryImages.value.length > 0) {
    galleryImages.value[0].isMain = true
  }
  updateFormData()
}

const updateFormData = () => {
  const mainImg = galleryImages.value.find(img => img.isMain)
  formData.value.mainImage = mainImg ? mainImg.file : null
  formData.value.gallery = galleryImages.value.map(img => img.file)
}

const convertToIsoDate = (dateString) => {
  if (!dateString) return null;
  if (dateString.includes('-') && dateString.startsWith('20')) {
    return dateString;
  }
  try {
    const m = moment(dateString, 'jYYYY/jMM/jDD');
    return m.format('YYYY-MM-DD');
  } catch (e) {
    console.error('Date conversion error', e);
    return dateString;
  }
}

const loadMedicineForEdit = async () => {
  const id = route.query.id
  if (id) {
    try {
      const data = await medicineStore.getById(id)
      if (data) {
        isEditMode.value = true
        isMedicineApproved.value = data.medicine?.isApproved || data.isApproved || false
        const medicineData = data.medicine ? data.medicine : data;

        // اگر دارو جهانی دارد، حالت را روی attach تنظیم می‌کنیم (برای نمایش صحیح)
        if (data.medicineId && data.medicine.isApproved) {
          mode.value = 'attach'
          attachedMedicine.value = medicineData
          formData.value.globalMedicineId = data.medicineId
        } else {
          mode.value = 'create'
        }

        formData.value = {
          id: data.id,
          name: medicineData.name || '',
          code: medicineData.code || '',
          category: medicineData.category || '',
          categoryBreadcrumb: medicineData.categoryBreadcrumb,
          price: new Intl.NumberFormat('fa-IR').format(data.price || 0),
          stock: data.stock || 0,
          activeIngredient: medicineData.activeIngredient || '',
          dosageForm: medicineData.dosageForm || '',
          dosage: medicineData.dosage || '',
          suitableFor: medicineData.suitableFor || '',
          storage: medicineData.storage || '',
          prescriptionRequired: medicineData.prescriptionRequired || false,
          expiryDate: data.expiryDate,
          isActive: data.isActive !== undefined ? data.isActive : true,
          type: 'medicine',
          //globalMedicineId: data.medicineId || null
        }

        // مدیریت تصاویر
        galleryImages.value = []
        const mainImgUrl = medicineData.image || data.image;
        if (medicineData.galleryImages && Array.isArray(medicineData.galleryImages)) {
          medicineData.galleryImages.forEach((imgUrl) => {
            galleryImages.value.push({file: null, preview: resolveUrl(imgUrl), isMain: false})
          })
        }
      }
    } catch (error) {
      console.error('Error loading medicine:', error)
      showError('خطا در دریافت اطلاعات دارو', '❌ خطا')
    }
  }
}

function normalizeNumbers(str) {
  if (!str) return ''
  const map = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  }
  return str.replace(/[۰-۹٠-٩]/g, d => map[d])
}

const getPriceAsNumber = () => {
  if (!formData.value.price) return 0
  let priceInput = String(formData.value.price)
  // استفاده از تابع normalizeNumbers
  priceInput = normalizeNumbers(priceInput)
  // حذف تمام کاراکترهای غیر عددی
  const cleaned = priceInput.replace(/[^\d]/g, '')
  const parsed = parseInt(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

const validateForm = () => {
  errors.value = {}
  const cleanPrice = String(formData.value.price).replace(/[^\d]/g, '')
  const priceValue = parseInt(cleanPrice, 10) || 0

  // 1. Validate Basic Info
  if (!formData.value.name.trim()) {
    errors.value.name = 'نام دارو الزامی است'
  }
  if (!formData.value.code.trim()) {
    errors.value.code = 'کد دارو الزامی است'
  }
  if (mode.value === 'create' && !formData.value.category) {
    errors.value.category = 'دسته‌بندی الزامی است'
  }

  // 2. Validate Pricing
  if (!formData.value.price || getPriceAsNumber() === 0) {
    errors.value.price = 'قیمت باید بزرگتر از صفر باشد'
  }
  if (formData.value.stock === null || formData.value.stock === '' || formData.value.stock < 0) {
    errors.value.stock = 'موجودی باید یک عدد مثبت باشد'
  }

  // 3. Validate Medical (Only for Create or Edit unapproved)
  if (mode.value === 'create' || (isEditMode.value && !isMedicineApproved.value)) {
    if (!formData.value.dosageForm) {
      errors.value.dosageForm = 'شکل دارویی الزامی است'
    }
  }

  // 4. Validate Expiry
  if (!formData.value.expiryDate.trim()) {
    errors.value.expiryDate = 'تاریخ انقضا الزامی است'
  }

  const hasErrors = Object.keys(errors.value).length > 0

  // اگر خطا وجود دارد، آبجکت را به ref ویو منتقل کن تا در فرم نمایش داده شود
  if (hasErrors) {
    errors.value = { ...errors.value } // Force reactivity update
  }

  return !hasErrors
}

const submitForm = async () => {
  const isValid = validateForm()
  if (!isValid) {

    if (typeof window.showToast === 'function') {
      window.showToast('لطفا خطاهای فرم را برطرف کنید', 'error', 5000);
    }

    // باز کردن خودکار بخش‌هایی که خطا دارند
    if (errors.value.name || errors.value.code || errors.value.category) {
      openSections.value.basic = true
    }
    if (errors.value.price || errors.value.stock) {
      openSections.value.pricing = true
    }
    if (errors.value.dosageForm) {
      openSections.value.medical = true
    }
    if (errors.value.expiryDate) {
      openSections.value.expiry = true
    }
    return
  }
  // تمیز کردن قیمت
  let priceValue = formData.value.price;
  let priceString = String(priceValue);
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  persianNumbers.forEach((num, index) => {
    priceString = priceString.replace(new RegExp(num, 'g'), index);
  });
  priceString = priceString.replace(/[^\d.-]/g, '');
  const finalPrice = parseInt(priceString, 10) || 0;

  let medicinePayload = {};

  // منطق ارسال بر اساس حالت (Attach vs Create)
  if (mode.value === 'attach' || isMedicineApproved.value) {
    // اتصال به دارو جهانی: فقط اطلاعات داروخانه ارسال می‌شود
    medicinePayload = {
      globalMedicineId: formData.value.globalMedicineId,
      price: finalPrice,
      stock: formData.value.stock || 0,
      isActive: formData.value.isActive,
      expiryDate: formData.value.expiryDate ? convertToIsoDate(formData.value.expiryDate) : null,
    };
  } else {
    // ایجاد دارو جدید: همه فیلدها ارسال می‌شود
    const preparedGallery = galleryImages.value.map(img => img.file || img.preview)
    const mainImagePayload = galleryImages.value.find(img => img.isMain)?.file ||
        galleryImages.value.find(img => img.isMain)?.preview;

    medicinePayload = {
      name: formData.value.name,
      code: formData.value.code,
      category: formData.value.category,
      categoryBreadcrumb: formData.value.categoryBreadcrumb,
      price: finalPrice,
      stock: formData.value.stock || 0,
      isActive: formData.value.isActive,
      activeIngredient: formData.value.activeIngredient,
      dosageForm: formData.value.dosageForm,
      dosage: formData.value.dosage,
      suitableFor: formData.value.suitableFor,
      storage: formData.value.storage,
      prescriptionRequired: formData.value.prescriptionRequired,
      expiryDate: formData.value.expiryDate ? formData.value.expiryDate : null,
      image: mainImagePayload,
      galleryImages: preparedGallery
    };
  }

  try {

    let res

    if (isEditMode.value) {

      res = await medicineStore.updateMedicine(formData.value.id, medicinePayload)

      if (typeof window.showToast === 'function' && res.statusCode === 200) {
        window.showToast(`دارو "${formData.value.name}" با موفقیت ویرایش شد!`, 'success', 5000);
      }
    } else {
      // اگر attach است، متد attachMedicine و اگر create است متد createMedicine
      if (mode.value === 'attach') {
        res = await medicineStore.attachMedicine(medicinePayload)

        if (typeof window.showToast === 'function' && res.statusCode === 200) {
          window.showToast(`شما به دارو "${formData.value.name}" متصل شدید!`, 'success', 5000);
        }
      } else {
        res = await medicineStore.createMedicine(medicinePayload)

        if (typeof window.showToast === 'function' && res.statusCode === 200) {
          window.showToast(`دارو "${formData.value.name}" با موفقیت ایجاد شد!`, 'success', 5000);
        }
      }
    }
    setTimeout(() => {
      router.push('/pharmacies/products')
    }, 1000)
  } catch (err) {

    let errorMessage = 'خطایی رخ داد و ثبت محصول انجام نشد.';

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
    // بدون نیاز به تغییر در منطق، فقط پیام را زیباتر کنید
    if (typeof window.showToast === 'function') {
      // متن را با تگ bold زیبا کنید
      const safeMessage = errorMessage.replace(/(.+)/, '<strong>$1</strong>');
      window.showToast(safeMessage, 'error', 5000, status);
    }
  }
}

onMounted(() => {
  loadMedicineForEdit()
})

// Date Picker
const showMonthDropdown = ref(false)
const showYearDropdown = ref(false)
const datePickerType = ref('start') // 'start' or 'end'
const tempDate = ref({
  year: 1403,
  month: 8,
  day: 6
})

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]
const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

/*const years = computed(() => {
  const currentYear = 1403
  return Array.from({ length: 10 }, (_, i) => currentYear + i)
})*/
const years = computed(() => {
  if (useGregorianExpiry.value) {
    // برای میلادی: از ۲۰۲۰ تا ۲۰۳۵ (مثال)
    const startYear = 2020;
    const endYear = 2035;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  } else {
    // برای شمسی: از ۱۴۰۳ تا ۱۴۱۲ (کد قبلی شما)
    const currentYear = 1403;
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  }
})

const daysInMonth = computed(() => {
  if (tempDate.value.month <= 6) return 31
  if (tempDate.value.month <= 11) return 30
  return 29
})

/*const calendarDays = computed(() => {
  const days = []
  const totalDays = daysInMonth.value
  // محاسبه روز اول ماه (شنبه = 0)
  // برای سادگی، از یک الگوی ساده استفاده می‌کنیم
  const firstDayOfWeek = ((tempDate.value.year * 12 + tempDate.value.month - 1) * 2 + 3) % 7
  // اضافه کردن فضای خالی برای روزهای قبل از اول ماه
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  // اضافه کردن روزهای ماه
  for (let day = 1; day <= totalDays; day++) {
    days.push(day)
  }
  // اضافه کردن فضای خالی برای تکمیل آخرین هفته
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      days.push(null)
    }
  }
  return days
})*/

const openDatePicker = (type) => {
  datePickerType.value = type
  showDatePicker.value = true
  showMonthDropdown.value = false
  showYearDropdown.value = false
  // Parse existing date if available
  const existingDate = type === 'start' ? formData.value.discountStartDate : formData.value.discountEndDate
  if (existingDate) {
    const parts = existingDate.split('/')
    if (parts.length === 3) {
      tempDate.value = {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2])
      }
    }
  } else {
    // تنظیم به امروز
    const now = new Date()
    const jNow = moment(now)
    tempDate.value = {
      year: parseInt(jNow.format('jYYYY')),
      month: parseInt(jNow.format('jM')),
      day: parseInt(jNow.format('jD'))
    }
  }
}

const selectMonth = (month) => {
  tempDate.value.month = month
  showMonthDropdown.value = false
  // اگر روز انتخاب شده از تعداد روزهای ماه جدید بیشتر باشد، آخرین روز ماه را انتخاب کن
  if (tempDate.value.day > daysInMonth.value) {
    tempDate.value.day = daysInMonth.value
  }
}

const selectYear = (year) => {
  tempDate.value.year = year
  showYearDropdown.value = false
}

const selectDay = (day) => {
  tempDate.value.day = day
}

/*const previousMonth = () => {
  if (tempDate.value.month === 1) {
    tempDate.value.month = 12
    tempDate.value.year--
  } else {
    tempDate.value.month--
  }
  // اگر روز انتخاب شده از تعداد روزهای ماه جدید بیشتر باشد
  if (tempDate.value.day > daysInMonth.value) {
    tempDate.value.day = daysInMonth.value
  }
}*/

/*const nextMonth = () => {
  if (tempDate.value.month === 12) {
    tempDate.value.month = 1
    tempDate.value.year++
  } else {
    tempDate.value.month++
  }
  // اگر روز انتخاب شده از تعداد روزهای ماه جدید بیشتر باشد
  if (tempDate.value.day > daysInMonth.value) {
    tempDate.value.day = daysInMonth.value
  }
}*/

const selectToday = () => {
  const now = new Date()
  const jNow = moment(now)
  tempDate.value = {
    year: parseInt(jNow.format('jYYYY')),
    month: parseInt(jNow.format('jM')),
    day: parseInt(jNow.format('jD'))
  }
}

/*const confirmDate = () => {
  const dateStr = `${tempDate.value.year}/${String(tempDate.value.month).padStart(2, '0')}/${String(tempDate.value.day).padStart(2, '0')}`
  if (datePickerType.value === 'start') {
    formData.value.discountStartDate = dateStr;
  } else if (datePickerType.value === 'end') {
    formData.value.discountEndDate = dateStr;
  } else if (datePickerType.value === 'expiry') {
    formData.value.expiryDate = dateStr;
  }
  showDatePicker.value = false
}*/

/*const openExpiryDatePicker = () => {
  // 1. تنظیم نوع تقویم روی 'expiry'
  datePickerType.value = 'expiry';

  // 2. باز کردن مودال
  showDatePicker.value = true;
  showMonthDropdown.value = false;
  showYearDropdown.value = false;

  // 3. تنظیم تاریخ اولیه اگر وجود دارد
  const existingDate = formData.value.expiryDate;
  if (existingDate) {
    const parts = existingDate.split('/');
    if (parts.length === 3) {
      tempDate.value = {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2])
      };
    }
  } else {
    // پیش‌فرض: تاریخ امروز
    const now = new Date();
    const jNow = moment(now);
    tempDate.value = {
      year: parseInt(jNow.format('jYYYY')),
      month: parseInt(jNow.format('jM')),
      day: parseInt(jNow.format('jD'))
    };
  }
};*/

////////////////////////////////////
const useGregorianExpiry = ref(false)

// 2. تعریف ماه‌های میلادی
const gregorianMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const calendarDays = computed(() => {
  const days = []

  if (useGregorianExpiry.value) {
    // --- منطق تقویم میلادی ---
    const year = tempDate.value.year
    const month = tempDate.value.month - 1 // ماه در date-fns از 0 شروع می‌شود

    const daysInCurrentMonth = getDaysInMonth(new Date(year, month, 1))

    // محاسبه روز هفته برای روز اول ماه (0=Sunday, 6=Saturday)
    // ما می‌خواهیم هفته از شنبه شروع شود (مثل تقویم شمسی شما)، اما استاندارد میلادی از یکشنبه است.
    // برای هماهنگی با گرید 7 تایی، باید بدانیم اول ماه چه روزی است.
    const firstDayOfWeekIndex = getDay(startOfMonth(new Date(year, month, 1)))

    // اگر می‌خواهید هفته از شنبه شروع شود، باید آرایه را جابجا کنیم.
    // اما برای سادگی و استاندارد بودن، معمولا میلادی را یکشنبه شروع می‌کنند.
    // بیایید فرض کنیم می‌خواهیم استاندارد (یکشنبه شروع) باشد:
    for (let i = 0; i < firstDayOfWeekIndex; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      days.push(day)
    }

  } else {
    // --- منطق تقویم شمسی (کد قبلی شما) ---
    const totalDays = daysInMonth.value
    const firstDayOfWeek = ((tempDate.value.year * 12 + tempDate.value.month - 1) * 2 + 3) % 7

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= totalDays; day++) {
      days.push(day)
    }
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(null)
      }
    }
  }
  return days
})
const previousMonth = () => {
  if (useGregorianExpiry.value) {
    // منطق میلادی
    if (tempDate.value.month === 1) {
      tempDate.value.month = 12
      tempDate.value.year--
    } else {
      tempDate.value.month--
    }
    // تنظیم روز اگر بیشتر از روزهای ماه جدید بود
    const daysInNewMonth = getDaysInMonth(new Date(tempDate.value.year, tempDate.value.month - 1, 1))
    if (tempDate.value.day > daysInNewMonth) {
      tempDate.value.day = daysInNewMonth
    }
  } else {
    // منطق شمسی (کد قبلی)
    if (tempDate.value.month === 1) {
      tempDate.value.month = 12
      tempDate.value.year--
    } else {
      tempDate.value.month--
    }
    if (tempDate.value.day > daysInMonth.value) {
      tempDate.value.day = daysInMonth.value
    }
  }
}
const nextMonth = () => {
  if (useGregorianExpiry.value) {
    // منطق میلادی
    if (tempDate.value.month === 12) {
      tempDate.value.month = 1
      tempDate.value.year++
    } else {
      tempDate.value.month++
    }
    const daysInNewMonth = getDaysInMonth(new Date(tempDate.value.year, tempDate.value.month - 1, 1))
    if (tempDate.value.day > daysInNewMonth) {
      tempDate.value.day = daysInNewMonth
    }
  } else {
    // منطق شمسی (کد قبلی)
    if (tempDate.value.month === 12) {
      tempDate.value.month = 1
      tempDate.value.year++
    } else {
      tempDate.value.month++
    }
    if (tempDate.value.day > daysInMonth.value) {
      tempDate.value.day = daysInMonth.value
    }
  }
}
const confirmDate = () => {
  if (useGregorianExpiry.value) {
    // فرمت میلادی: YYYY-MM-DD
    const dateStr = `${tempDate.value.year}-${String(tempDate.value.month).padStart(2, '0')}-${String(tempDate.value.day).padStart(2, '0')}`

    if (datePickerType.value === 'expiry') {
      formData.value.expiryDate = dateStr;
    } else {
      // برای سایر فیلدها اگر نیاز بود
      if (datePickerType.value === 'start') {
        formData.value.discountStartDate = dateStr;
      } else if (datePickerType.value === 'end') {
        formData.value.discountEndDate = dateStr;
      }
    }
  } else {
    // فرمت شمسی: YYYY/MM/DD
    const dateStr = `${tempDate.value.year}/${String(tempDate.value.month).padStart(2, '0')}/${String(tempDate.value.day).padStart(2, '0')}`
    if (datePickerType.value === 'start') {
      formData.value.discountStartDate = dateStr;
    } else if (datePickerType.value === 'end') {
      formData.value.discountEndDate = dateStr;
    } else if (datePickerType.value === 'expiry') {
      formData.value.expiryDate = dateStr;
    }
  }
  showDatePicker.value = false
}
const openExpiryDatePicker = () => {
  datePickerType.value = 'expiry';
  showDatePicker.value = true;
  showMonthDropdown.value = false;
  showYearDropdown.value = false;

  const existingDate = formData.value.expiryDate;

  if (existingDate) {
    if (useGregorianExpiry.value) {
      // اگر تقویم میلادی است و تاریخ شمسی داریم، تبدیل کن
      if (!existingDate.includes('-')) {
        const gregorianStr = convertJalaliToGregorian(existingDate);
        if (gregorianStr) {
          const parts = gregorianStr.split('-');
          tempDate.value = {
            year: parseInt(parts[0]),
            month: parseInt(parts[1]),
            day: parseInt(parts[2])
          };
        } else {
          // اگر تبدیل شکست خورد، به امروز برگرد
          const now = new Date();
          tempDate.value = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        }
      } else {
        // اگر تاریخ از قبل میلادی است
        const parts = existingDate.split('-');
        tempDate.value = {
          year: parseInt(parts[0]),
          month: parseInt(parts[1]),
          day: parseInt(parts[2])
        };
      }
    } else {
      // اگر تقویم شمسی است و تاریخ میلادی داریم، تبدیل کن
      if (existingDate.includes('-')) {
        const jalaliStr = convertGregorianToJalali(existingDate);
        if (jalaliStr) {
          const parts = jalaliStr.split('/');
          tempDate.value = {
            year: parseInt(parts[0]),
            month: parseInt(parts[1]),
            day: parseInt(parts[2])
          };
        } else {
          const jNow = moment();
          tempDate.value = {
            year: parseInt(jNow.format('jYYYY')),
            month: parseInt(jNow.format('jM')),
            day: parseInt(jNow.format('jD'))
          };
        }
      } else {
        // اگر تاریخ از قبل شمسی است
        const parts = existingDate.split('/');
        tempDate.value = {
          year: parseInt(parts[0]),
          month: parseInt(parts[1]),
          day: parseInt(parts[2])
        };
      }
    }
  } else {
    // اگر تاریخی نیست، به امروز ست کن
    const now = new Date();
    if (useGregorianExpiry.value) {
      tempDate.value = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    } else {
      const jNow = moment(now);
      tempDate.value = {
        year: parseInt(jNow.format('jYYYY')),
        month: parseInt(jNow.format('jM')),
        day: parseInt(jNow.format('jD'))
      };
    }
  }
};
// تبدیل تاریخ میلادی (فرمت YYYY-MM-DD) به شمسی
const convertGregorianToJalali = (gregorianDateStr) => {
  if (!gregorianDateStr) return '';
  // ساخت آبجکت Date از رشته میلادی
  const dateParts = gregorianDateStr.split('-');
  const date = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1, // ماه در JS از 0 شروع می‌شود
      parseInt(dateParts[2])
  );

  // تبدیل به شمسی با moment
  const jMoment = moment(date);
  if (jMoment.isValid()) {
    return `${jMoment.format('jYYYY')}/${jMoment.format('jMM')}/${jMoment.format('jDD')}`;
  }
  return '';
};

// تبدیل تاریخ شمسی (فرمت YYYY/MM/DD) به میلادی
const convertJalaliToGregorian = (jalaliDateStr) => {
  if (!jalaliDateStr) return '';
  const parts = jalaliDateStr.split('/');
  if (parts.length !== 3) return '';

  // تبدیل به میلادی با moment
  const gMoment = moment.jalali(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  if (gMoment.isValid()) {
    return gMoment.format('YYYY-MM-DD');
  }
  return '';
};

watch(useGregorianExpiry, (newValue) => {
  if (showDatePicker.value && formData.value.expiryDate) {
    // اگر تقویم باز است و تاریخی انتخاب شده، آن را تبدیل کن
    if (newValue) {
      // تبدیل به میلادی برای نمایش
      const gregorianStr = convertJalaliToGregorian(formData.value.expiryDate);
      if (gregorianStr) {
        const parts = gregorianStr.split('-');
        tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
      }
    } else {
      // تبدیل به شمسی برای نمایش
      const jalaliStr = convertGregorianToJalali(formData.value.expiryDate);
      if (jalaliStr) {
        const parts = jalaliStr.split('/');
        tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
      }
    }
  } else if (formData.value.expiryDate) {
    // اگر تقویم بسته است، فقط تاریخ را در پس‌زمینه تبدیل کن تا دفعه بعد درست باشد
    // (این بخش اختیاری است، چون در openExpiryDatePicker هندل می‌شود)
  }
});
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}
</style>