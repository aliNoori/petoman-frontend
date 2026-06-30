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
          <h2 class="text-xl font-bold text-gray-900">{{ isEditMode ? 'ویرایش محصول' : 'افزودن محصول' }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ isEditMode ? 'ویرایش اطلاعات محصول' : 'جستجو و افزودن محصولات به فروشگاه' }}</p>
        </div>
      </div>
    </div>

    <!-- Search or Create -->
    <ProductSearchOrCreate
        v-if="mode === 'search' && !isEditMode"
        :key="searchComponentKey"
        :tenant-type="'PHARMACY'"
        @attach-product="handleAttachExisting"
        @create-product="handleCreateNew"
    />

    <!-- Form -->
    <div v-if="mode === 'attach' || mode === 'create' || isEditMode" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <!-- Mode Indicator -->
      <div v-if="!isEditMode" class="mb-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md"
           :class="mode === 'attach' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'">

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5">

          <!-- بخش چپ: آیکون و متن -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- آیکون -->
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                 :class="mode === 'attach' ? 'bg-blue-500' : 'bg-purple-500'">
              <i class="text-xl sm:text-2xl text-white"
                 :class="mode === 'attach' ? 'ti ti-link' : 'ti ti-plus'"></i>
            </div>

            <!-- متن -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-0.5">
                {{ mode === 'attach' ? 'اتصال به محصول موجود' : 'ایجاد محصول جدید' }}
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed truncate sm:whitespace-normal">
                {{ mode === 'attach' ? attachedProduct?.name : 'در حال ایجاد محصول جدید در سیستم' }}
              </p>
            </div>
          </div>

          <!-- دکمه بازگشت -->
          <div class="w-full sm:w-auto shrink-0">
            <button @click="resetMode"
                    type="button"
                    class="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow">
              <i class="ti ti-arrow-right text-lg"></i>
              <span>بازگشت به لیست</span>
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 1. دسته‌بندی (اول همه) -->
        <div v-if="mode === 'create'">
          <CategorySelector
              v-model="formData.category"
              type="market"
              @update:breadcrumb="formData.categoryBreadcrumb = $event; clearError('category')"
              @change="clearError('category')"
          />
          <p v-if="errors.category" class="mt-1 text-xs text-red-600 font-bold">{{ errors.category }}</p>
        </div>

        <div v-if="mode === 'attach'" class="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-category text-blue-600"></i>
            دسته‌بندی محصول
          </label>
          <div class="text-gray-900 font-bold">
            {{ formData.categoryBreadcrumb }}
          </div>
          <p v-if="errors.category" class="mt-1 text-xs text-red-600 font-bold">{{ errors.category }}</p>
        </div>

        <!-- 2. ساخت خودکار عنوان و کد (فقط در حالت Create) -->
        <ProductSEOBuilder
            v-if="mode === 'create'"
            @update:title="handleTitleUpdate"
            @update:code="handleCodeUpdate"
            @update:brand="handleUpdateBrand"
        />

        <!-- نام محصول (نمایش فقط) -->
        <div v-if="formData.name">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-writing text-blue-600"></i>
            نام محصول
          </label>
          <div class="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold">
            {{ formData.name }}
          </div>
        </div>

        <!-- کد محصول (نمایش فقط) -->
        <div v-if="formData.code">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-barcode text-blue-600"></i>
            کد محصول
          </label>
          <div class="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 font-mono font-bold">
            {{ formData.code }}
          </div>
        </div>
        <p v-if="errors.code" class="mt-1 text-xs text-red-600 font-bold">{{ errors.code }}</p>

        <!-- مشخصات محصول (فقط در حالت Attach) -->
        <div v-if="mode === 'attach' && attachedProduct?.specifications" class="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
          <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <i class="ti ti-list-details text-purple-600"></i>
            مشخصات فنی محصول
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
                v-for="(value, key) in attachedProduct.specifications"
                :key="key"
                class="flex items-start gap-2 text-sm"
            >
              <span class="text-gray-600 min-w-[100px]">{{ formatSpecKey(key) }}:</span>
              <span class="text-gray-900 font-bold">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- قیمت و موجودی -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">قیمت (تومان)</label>
            <input
                :value="formData.price"
                @input="(e) => { formatPrice(e); clearError('price'); }"
                type="text"
                placeholder="قیمت (تومان)"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                required
            />
            <!-- *** VALIDATION ***: نمایش خطای قیمت -->
            <p v-if="errors.price" class="mt-1 text-xs text-red-600 font-bold">{{ errors.price }}</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">موجودی</label>
            <input
                v-model.number="formData.stock"
                @input="clearError('stock')"
                type="number"
                placeholder="موجودی"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                required
            />
            <!-- *** VALIDATION ***: نمایش خطای موجودی -->
            <p v-if="errors.stock" class="mt-1 text-xs text-red-600 font-bold">{{ errors.stock }}</p>
          </div>
        </div>

        <!-- تخفیف -->
        <div class="space-y-4 pt-4 border-t-2 border-gray-100">
          <div class="flex items-center gap-3">
            <button
                type="button"
                @click="formData.hasDiscount = !formData.hasDiscount"
                :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                formData.hasDiscount ? 'bg-blue-500' : 'bg-gray-200'
              ]"
            >
              <span
                  :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  formData.hasDiscount ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:translate-x-1'
                ]"
              />
            </button>
            <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
              <i class="ti ti-discount-2 text-blue-600"></i>
              <span>تخفیف محصول</span>
            </label>
          </div>

          <div v-if="formData.hasDiscount" class="space-y-4 bg-gray-50 p-4 rounded-xl">
            <!-- نوع تخفیف -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">نوع تخفیف</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    @click="formData.discountType = 'percentage'"
                    class="py-3 px-4 rounded-xl font-bold text-sm transition-all"
                    :class="formData.discountType === 'percentage'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'"
                >
                  <i class="ti ti-percentage"></i>
                  درصدی
                </button>
                <button
                    type="button"
                    @click="formData.discountType = 'fixed'"
                    class="py-3 px-4 rounded-xl font-bold text-sm transition-all"
                    :class="formData.discountType === 'fixed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'"
                >
                  <i class="ti ti-coins"></i>
                  مبلغ ثابت
                </button>
              </div>
            </div>

            <!-- مقدار تخفیف -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  مقدار تخفیف {{ formData.discountType === 'percentage' ? '(درصد)' : '(تومان)' }}
                </label>
                <input
                    v-model.number="formData.discountValue"
                    @input="clearError('discountValue')"
                    type="number"
                    :placeholder="formData.discountType === 'percentage' ? 'مثلا: 20' : 'مثلا: 50000'"
                    :max="formData.discountType === 'percentage' ? 100 : undefined"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">قیمت نهایی (تومان)</label>
                <div class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-bold">
                  {{ calculateFinalPrice }}
                </div>
              </div>
            </div>

            <!-- تاریخ اعتبار -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">شروع تخفیف</label>
                <input
                    v-model="formData.discountStartDate"
                    type="text"
                    placeholder="انتخاب تاریخ"
                    @click.prevent="openDatePicker('start')"
                    @input="clearError('discountStartDate')"
                    readonly
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-right cursor-pointer"
                    dir="rtl"
                />
                <!-- *** VALIDATION ***: نمایش خطای تاریخ شروع -->
                <p v-if="errors.discountStartDate" class="mt-1 text-xs text-red-600 font-bold">{{ errors.discountStartDate }}</p>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">پایان تخفیف</label>
                <input
                    v-model="formData.discountEndDate"
                    type="text"
                    placeholder="انتخاب تاریخ"
                    @click.prevent="openDatePicker('end')"
                    @input="clearError('discountEndDate')"
                    readonly
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-right cursor-pointer"
                    dir="rtl"
                />
                <!-- *** VALIDATION ***: نمایش خطای تاریخ پایان -->
                <p v-if="errors.discountEndDate" class="mt-1 text-xs text-red-600 font-bold">{{ errors.discountEndDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Section (ویژگی‌ها) -->
        <div class="pt-4 border-t border-gray-200 mt-6">
          <label class="block text-base font-bold text-gray-800 mb-2">
            <i class="ti ti-star text-purple-600 ml-1"></i>
            ویژگی‌های محصول
          </label>
          <p class="text-xs text-gray-500 mb-3 mr-1">
            ویژگی‌های خاص مثل ارسال رایگان یا گارانتی را اضافه کنید.
          </p>

          <!-- Container for Tags and Input -->
          <div class="flex flex-wrap items-center gap-2 p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">

            <!-- Feature Tags -->
            <div v-if="formData.features.length > 0" class="flex flex-wrap gap-2">
      <span
          v-for="(feature, index) in formData.features"
          :key="index"
          class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm font-medium transition-all hover:bg-purple-100 hover:border-purple-200"
      >
        <template v-if="feature?.text">
          {{ feature.text }}
        </template>
        <template v-else>
          {{ feature }}
        </template>

        <!-- Remove Button (Icon only for cleaner look) -->
        <button
            type="button"
            @click="removeFeature(index)"
            class="text-purple-400 hover:text-red-500 transition-colors focus:outline-none p-0.5"
            title="حذف ویژگی"
        >
          <i class="ti ti-x text-sm"></i>
        </button>
      </span>
            </div>

            <!-- Input Field -->
            <input
                v-model="newFeatureInput"
                type="text"
                placeholder="ویژگی را بنویسید و اینتر بزنید..."
                @keyup.enter.prevent="addFeature"
                class="flex-1 min-w-[120px] max-w-[200px] px-3 py-1.5 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />

            <!-- Add Button (Visible mostly on mobile or for clickers) -->
            <button
                type="button"
                @click="addFeature"
                class="shrink-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
                title="افزودن ویژگی"
            >
              <i class="ti ti-plus"></i>
            </button>
          </div>

          <!-- Helper Text for Mobile -->
          <p class="text-xs text-gray-400 mt-2 sm:hidden">
            برای افزودن، نام ویژگی را تایپ و اینتر بزنید یا روی + کلیک کنید.
          </p>
        </div>

        <!-- Specifications Section -->
        <div class="pt-4 border-t border-gray-200 mt-6">
          <div class="flex items-center gap-2 mb-2">
            <i class="ti ti-list-details text-blue-600 text-xl"></i>
            <label class="block text-base font-bold text-gray-800">
              مشخصات فنی (دلخواه)
            </label>
          </div>
          <p class="text-xs text-gray-500 mb-4 mr-1">
            ویژگی‌های دقیق محصول را به صورت کلید و مقدار وارد کنید.
          </p>

          <div class="space-y-3">
            <!-- Add New Spec Inputs -->
            <div class="flex flex-wrap gap-2">
              <input
                  v-model="newSpecLabel"
                  type="text"
                  placeholder="عنوان (مثلا: وزن)"
                  class="flex-[2] min-w-[120px] px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none text-sm"
              />
              <input
                  v-model="newSpecValue"
                  type="text"
                  placeholder="مقدار (مثلا: ۲ کیلوگرم)"
                  class="flex-[3] min-w-[150px] px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none text-sm"
              />
              <button
                  type="button"
                  @click="addSpecification"
                  class="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-1 min-h-[42px]"
              >
                <i class="ti ti-plus"></i>
                <span class="sm:hidden">افزودن</span> <!-- متن فقط در موبایل نمایش داده شود -->
              </button>
            </div>

            <!-- List of Specs -->
            <div v-if="formData.specifications.length > 0" class="space-y-2">
              <div
                  v-for="(spec, index) in formData.specifications"
                  :key="index"
                  class="group flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
              >
                <!-- Spec Content -->
                <div class="flex flex-wrap items-baseline gap-2 mb-1 sm:mb-0">
          <span class="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
            {{ spec.label }}:
          </span>
                  <span class="text-sm text-gray-600 break-words">
            {{ spec.value }}
          </span>
                </div>

                <!-- Remove Button -->
                <div class="flex justify-end sm:justify-start">
                  <button
                      type="button"
                      @click="removeSpecification(index)"
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                      title="حذف مشخصه"
                  >
                    <i class="ti ti-trash text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="pt-4 border-t-2 border-gray-100">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            <i class="ti ti-align-left text-blue-600"></i>
            توضیحات محصول
          </label>
          <textarea
              v-model="formData.description"
              rows="4"
              placeholder="توضیحات کامل محصول را وارد کنید..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <!-- 7. تصاویر محصول (در پایین همه فیلدها) -->
        <div class="pt-4 border-t-2 border-gray-100">
          <label class="block text-sm font-bold text-gray-700 mb-3">
            <i class="ti ti-photo text-purple-600"></i>
            تصاویر محصول
            <span v-if="mode === 'attach'" class="text-xs text-gray-500 font-normal mr-2">
              (عکس‌های محصول اصلی - قابل ویرایش نیست)
            </span>
            <span v-else class="text-xs text-gray-500 font-normal mr-2">
              (حداکثر 5 تصویر - روی تصویر کلیک کنید تا به عنوان تصویر اصلی انتخاب شود)
            </span>
          </label>
          <div class="flex flex-wrap gap-3">
            <!-- Gallery Images -->
            <div
                v-for="(img, index) in galleryImages"
                :key="index"
                @click="!img.readonly && setMainImage(index)"
                class="relative group w-24 h-24 rounded-lg border-2 overflow-hidden transition-all"
                :class="[
                img.isMain ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200',
                img.readonly ? 'cursor-default' : 'cursor-pointer hover:border-blue-300'
              ]"
            >
              <img :src="img.preview" class="w-full h-full object-cover" />

              <!-- Main Badge -->
              <div
                  v-if="img.isMain"
                  class="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <i class="ti ti-check text-sm text-white"></i>
              </div>

              <!-- Readonly Badge -->
              <div
                  v-if="img.readonly"
                  class="absolute bottom-1 left-1 px-2 py-0.5 bg-gray-900/70 rounded text-[10px] text-white"
              >
                اصلی
              </div>

              <!-- Delete Button (فقط برای عکس‌های قابل ویرایش) -->
              <button
                  v-if="!img.readonly"
                  @click.stop="removeGalleryImage(index)"
                  type="button"
                  class="absolute top-1 left-1 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <i class="ti ti-x text-sm text-white"></i>
              </button>
            </div>

            <!-- Add Button (فقط در حالت Create) -->
            <label v-if="mode === 'create' && galleryImages.length < 5" class="cursor-pointer inline-block">
              <input
                  type="file"
                  accept="image/*"
                  @change="handleGalleryUpload"
                  class="hidden"
                  multiple
              />
              <div class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1">
                <i class="ti ti-plus text-2xl text-gray-400"></i>
                <span class="text-xs text-gray-500">افزودن</span>
              </div>
            </label>
          </div>

          <!-- Info Message for Attach Mode -->
          <div v-if="mode === 'attach'" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start gap-2 text-sm text-blue-700">
              <i class="ti ti-info-circle text-lg flex-shrink-0"></i>
              <p>
                عکس‌های بالا مربوط به محصول اصلی در سیستم است. شما فقط قیمت، موجودی و توضیحات خود را تعیین می‌کنید.
              </p>
            </div>
          </div>
        </div>

        <!-- Expiry Date Section -->
        <div class="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-5">

          <!-- Toggle Section -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <i class="ti ti-clock"></i>
              </div>
              <div>
                <p class="font-bold text-gray-800 text-sm">تاریخ انقضا دارد</p>
                <p class="text-xs text-gray-500">فعال‌سازی برای محصولات فاسدشدنی</p>
              </div>
            </div>

            <!-- Main Toggle -->
            <button
                @click="formData.hasExpiryDate = !formData.hasExpiryDate"
                type="button"
                class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                :class="formData.hasExpiryDate ? 'bg-amber-500' : 'bg-gray-300'"
            >
            <span
                class="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
                :class="formData.hasExpiryDate ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0.5'"
            ></span>
            </button>
          </div>

          <!-- Date Input Area -->
          <div v-if="formData.hasExpiryDate" class="animate-fadeIn">

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
              <p v-if="errors.expiryDate" class="mt-1 text-xs text-red-600 font-bold flex items-center gap-1">
                <i class="ti ti-alert-circle"></i>
                {{ errors.expiryDate }}
              </p>
            </div>
          </div>
        </div>

        <!-- وضعیت -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="font-bold text-gray-900">فعال بودن محصول</p>
            <p class="text-sm text-gray-500">این محصول در لیست نمایش داده شود</p>
          </div>
          <button
              @click="formData.isActive = !formData.isActive"
              type="button"
              :class="[
              'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
              formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
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

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
              type="button"
              @click="submitForm"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <i class="ti ti-check"></i>
            {{ isEditMode ? 'ویرایش محصول' : 'ذخیره محصول' }}
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
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import moment from 'moment-jalaali'
import ProductSearchOrCreate from '@/components/ProductSearchOrCreate.vue'
import CategorySelector from '@/components/CategorySelector.vue'
import ProductSEOBuilder from '@/components/ProductSEOBuilder.vue'
import {usePharmacyProductStore} from "@/stores/pharmacy/product.js";
import {toGregorian, toJalali} from "@/utils/dateHelpers.js";
import {getDay, getDaysInMonth, startOfMonth} from 'date-fns'
import {useUrlHelper} from "@/composables/useUrlHelper.js";

moment.loadPersian({ usePersianDigits: false })
const {resolveUrl}=useUrlHelper()
const productStore = usePharmacyProductStore()
const route = useRoute()
const router = useRouter()
const useGregorianExpiry = ref(false)
const isEditMode = ref(false)
const editingProductId = ref(null)

// State
const mode = ref('search') // 'search' | 'attach' | 'create'
const attachedProduct = ref(null)
const galleryImages = ref([])
const searchComponentKey = ref(0) // برای ریست کردن کامپوننت جستجو

// متغیرهای موقت برای ورودی‌های جدید
const newFeatureInput = ref('')
const newSpecLabel = ref('')
const newSpecValue = ref('')

const formData = ref({
  name: '',
  code: '',
  category: '',
  categoryBreadcrumb: '',
  categoryId: null,
  brand: '',
  price: '',
  stock: null,
  mainImage: null,
  gallery: [],
  video: null,
  hasExpiryDate: false,
  expiryDate: '',
  hasDiscount: false,
  discountType: 'percentage',
  discountValue: null,
  discountStartDate: '',
  discountEndDate: '',
  isActive: false,
  type: 'shop',
  existingProductId: null,
  // آرایه‌های جدید برای ویژگی‌ها و مشخصات
  features: [],
  specifications: []
})

// --- توابع مدیریت ویژگی‌ها (Features) ---
const addFeature = () => {
  const text = newFeatureInput.value.trim()
  if (text && !formData.value.features.includes(text)) {
    formData.value.features.push(text)
    newFeatureInput.value = ''
  }
}

const removeFeature = (index) => {
  formData.value.features.splice(index, 1)
}

// --- توابع مدیریت مشخصات (Specifications) ---
const addSpecification = () => {
  const label = newSpecLabel.value.trim()
  const value = newSpecValue.value.trim()

  if (label && value) {
    formData.value.specifications.push({ label, value })
    newSpecLabel.value = ''
    newSpecValue.value = ''
  }
}

const removeSpecification = (index) => {
  formData.value.specifications.splice(index, 1)
}
const calculateFinalPrice = computed(() => {
  // 1. بررسی وجود قیمت
  if (!formData.value.price) {
    return formData.value.price || '0'
  }
  // 2. تمیز کردن قیمت (حذف کاما و تبدیل اعداد فارسی به انگلیسی)
  let priceStr = String(formData.value.price)
  // تبدیل اعداد فارسی به انگلیسی
  priceStr = priceStr.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  // حذف کاما و کاراکترهای اضافه
  priceStr = priceStr.replace(/,/g, '').replace(/[^\d]/g, '')
  const price = parseFloat(priceStr)
  if (isNaN(price) || price <= 0) {
    return formData.value.price || '0'
  }
  // 3. بررسی فعال بودن تخفیف
  if (!formData.value.hasDiscount) {
    return new Intl.NumberFormat('fa-IR').format(price)
  }
  // 4. تبدیل مقدار تخفیف به عدد
  const discountValue = Number(formData.value.discountValue) || 0;
  if (discountValue <= 0) {
    return new Intl.NumberFormat('fa-IR').format(price)
  }
  let finalPrice = price
  // 5. محاسبه تخفیف
  if (formData.value.discountType === 'percentage') {
    const discountAmount = (price * discountValue) / 100
    finalPrice = price - discountAmount
  } else {
    finalPrice = price - discountValue
  }
  // 6. فرمت کردن نهایی
  return new Intl.NumberFormat('fa-IR').format(Math.max(0, Math.round(finalPrice)))
})

// Date Picker State
const showDatePicker = ref(false)
const showMonthDropdown = ref(false)
const showYearDropdown = ref(false)
// اضافه کردن این متغیر برای تشخیص اینکه کدام فیلد در حال پر کردن است
const datePickerTarget = ref(null)

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

const years = computed(() => {
  if (useGregorianExpiry.value) {
    const startYear = 2020;
    const endYear = 2035;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  } else {
    const currentYear = 1403;
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  }
})

const daysInMonth = computed(() => {
  if (tempDate.value.month <= 6) return 31
  if (tempDate.value.month <= 11) return 30
  return 29
})

const openDatePicker = (type) => {
  // تعیین هدف: 'start' یا 'end'
  datePickerTarget.value = type
  showDatePicker.value = true
  showMonthDropdown.value = false
  showYearDropdown.value = false

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

const selectToday = () => {
  const now = new Date()
  const jNow = moment(now)
  tempDate.value = {
    year: parseInt(jNow.format('jYYYY')),
    month: parseInt(jNow.format('jM')),
    day: parseInt(jNow.format('jD'))
  }
}

const previousMonth = () => {
  if (useGregorianExpiry.value) {
    if (tempDate.value.month === 1) {
      tempDate.value.month = 12
      tempDate.value.year--
    } else {
      tempDate.value.month--
    }
    const daysInNewMonth = getDaysInMonth(new Date(tempDate.value.year, tempDate.value.month - 1, 1))
    if (tempDate.value.day > daysInNewMonth) {
      tempDate.value.day = daysInNewMonth
    }
  } else {
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

// اصلاح شده: فقط بر اساس datePickerTarget عمل می‌کند
const confirmDate = () => {
  let dateStr = ''

  if (useGregorianExpiry.value) {
    dateStr = `${tempDate.value.year}-${String(tempDate.value.month).padStart(2, '0')}-${String(tempDate.value.day).padStart(2, '0')}`
  } else {
    dateStr = `${tempDate.value.year}/${String(tempDate.value.month).padStart(2, '0')}/${String(tempDate.value.day).padStart(2, '0')}`
  }

  if (datePickerTarget.value === 'start') {
    formData.value.discountStartDate = dateStr

  } else if (datePickerTarget.value === 'end') {
    formData.value.discountEndDate = dateStr

  } else if (datePickerTarget.value === 'expiry') {
    formData.value.expiryDate = dateStr

  }

  showDatePicker.value = false
  datePickerTarget.value = null
}

const openExpiryDatePicker = () => {
  datePickerTarget.value = 'expiry'
  showDatePicker.value = true
  showMonthDropdown.value = false
  showYearDropdown.value = false

  const existingDate = formData.value.expiryDate

  if (existingDate) {
    if (useGregorianExpiry.value) {
      if (!existingDate.includes('-')) {
        const gregorianStr = convertJalaliToGregorian(existingDate);
        if (gregorianStr) {
          const parts = gregorianStr.split('-');
          tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
        } else {
          const now = new Date();
          tempDate.value = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        }
      } else {
        const parts = existingDate.split('-');
        tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
      }
    } else {
      if (existingDate.includes('-')) {
        const jalaliStr = convertGregorianToJalali(existingDate);
        if (jalaliStr) {
          const parts = jalaliStr.split('/');
          tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
        } else {
          const jNow = moment();
          tempDate.value = { year: parseInt(jNow.format('jYYYY')), month: parseInt(jNow.format('jM')), day: parseInt(jNow.format('jD')) };
        }
      } else {
        const parts = existingDate.split('/');
        tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
      }
    }
  } else {
    const now = new Date();
    if (useGregorianExpiry.value) {
      tempDate.value = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    } else {
      const jNow = moment(now);
      tempDate.value = { year: parseInt(jNow.format('jYYYY')), month: parseInt(jNow.format('jM')), day: parseInt(jNow.format('jD')) };
    }
  }
};

const gregorianMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const calendarDays = computed(() => {
  const days = []
  if (useGregorianExpiry.value) {
    const year = tempDate.value.year
    const month = tempDate.value.month - 1
    const daysInCurrentMonth = getDaysInMonth(new Date(year, month, 1))
    const firstDayOfWeekIndex = getDay(startOfMonth(new Date(year, month, 1)))
    for (let i = 0; i < firstDayOfWeekIndex; i++) days.push(null)
    for (let day = 1; day <= daysInCurrentMonth; day++) days.push(day)
  } else {
    const totalDays = daysInMonth.value
    const firstDayOfWeek = ((tempDate.value.year * 12 + tempDate.value.month - 1) * 2 + 3) % 7
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
    for (let day = 1; day <= totalDays; day++) days.push(day)
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) days.push(null)
    }
  }
  return days
})

const discountedPrice = computed(() => {
  try {
    const basePrice = getPriceAsNumber()
    const discountValue = Number(formData.value.discountValue) || 0
    if (!formData.value.hasDiscount || discountValue <= 0 || !formData.value.discountType) return basePrice
    let finalPrice = basePrice
    if (formData.value.discountType === 'percentage') {
      const percent = Math.min(Math.max(discountValue, 0), 100)
      finalPrice = basePrice - Math.round((basePrice * percent) / 100)
    } else if (formData.value.discountType === 'fixed') {
      finalPrice = basePrice - discountValue
    }
    return Math.max(0, finalPrice)
  } catch (error) {
    console.error('❌ خطا در محاسبه قیمت:', error)
    return 0
  }
})

const formatPrice = (event) => {
  let value = event.target.value
  value = normalizeNumbers(value)
  const cleanedValue = value.replace(/[^\d]/g, '')
  if (cleanedValue === '') {
    formData.value.price = ''
    return
  }
  const numValue = parseInt(cleanedValue)
  if (numValue > 0) {
    formData.value.price = new Intl.NumberFormat('fa-IR').format(numValue)
  } else if (numValue === 0) {
    formData.value.price = ''
  }
}

const getPriceAsNumber = () => {
  if (!formData.value.price) return 0
  let priceInput = String(formData.value.price)
  priceInput = normalizeNumbers(priceInput)
  const cleaned = priceInput.replace(/[^\d]/g, '')
  const parsed = parseInt(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

const normalizeNumbers = (str) => {
  if (!str) return ''
  const map = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  }
  return str.replace(/[۰-۹٠-٩]/g, d => map[d])
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

const handleTitleUpdate = (title) => {
  formData.value.name = title
}

const handleUpdateBrand = (brand) => {
  formData.value.brand = brand.id
}

const handleCodeUpdate = (code) => {
  formData.value.code = code
}

const formatSpecKey = (key) => {
  const keyMap = {
    brand: 'برند', weight: 'وزن', origin: 'کشور سازنده', ingredients: 'مواد تشکیل دهنده',
    protein: 'پروتئین', fat: 'چربی', moisture: 'رطوبت', fiber: 'فیبر', omega3: 'امگا 3',
    ageRange: 'محدوده سنی', breedSize: 'سایز نژاد', calcium: 'کلسیم', activeIngredient: 'ماده موثره',
    volume: 'حجم', usage: 'نحوه مصرف', dosage: 'دوز مصرف', prescriptionRequired: 'نیاز به نسخه',
    storage: 'نحوه نگهداری', type: 'نوع', scent: 'رایحه', clumping: 'کلوخه شونده',
    dustFree: 'بدون گرد و خاک', flushable: 'قابل شستشو', duration: 'مدت استفاده',
    material: 'جنس', size: 'سایز', washable: 'قابل شستشو', colors: 'رنگ‌ها',
    suitable: 'مناسب برای', features: 'ویژگی‌ها'
  }
  return keyMap[key] || key
}

const handleAttachExisting = (product) => {
  mode.value = 'attach'
  attachedProduct.value = product
  formData.value.name = product.name
  formData.value.code = product.code
  formData.value.category = product.category
  formData.value.categoryBreadcrumb = product.categoryBreadcrumb
  formData.value.existingProductId = product.id
  const suggestedPrice = product.suggestedPrice || 0
  formData.value.price = new Intl.NumberFormat('fa-IR').format(suggestedPrice)
  formData.value.hasDiscount = false
  formData.value.discountType = 'percentage'
  formData.value.discountValue = 0
  galleryImages.value = []
  if (product.image) {
    galleryImages.value.push({ url: product.image, preview: resolveUrl(product.image), isMain: true, readonly: true })
  }
  if (product.galleryImages && product.galleryImages.length > 0) {
    product.galleryImages.forEach(imgUrl => {
      galleryImages.value.push({ url: imgUrl, preview: resolveUrl(imgUrl), isMain: false, readonly: true })
    })
  }
}

const handleCreateNew = (categoryId, keyword) => {
  mode.value = 'create'
  attachedProduct.value = null
  formData.value = {
    name: '', code: '', category: '', categoryBreadcrumb: '', categoryId: categoryId || null,
    price: '', stock: null, mainImage: null, gallery: [], video: null,
    hasDiscount: false, discountType: 'percentage', discountValue: null,
    discountStartDate: '', discountEndDate: '', isActive: false, type: 'shop',
    existingProductId: null, features: [], specifications: []
  }
  galleryImages.value = []
}

const resetMode = () => {
  mode.value = 'search'
  attachedProduct.value = null
  searchComponentKey.value++
  formData.value = {
    name: '', code: '', category: '', categoryBreadcrumb: '', categoryId: null,
    price: '', stock: null, mainImage: null, gallery: [], video: null,
    hasDiscount: false, discountType: 'percentage', discountValue: null,
    discountStartDate: '', discountEndDate: '', isActive: false, type: 'shop',
    existingProductId: null, features: [], specifications: []
  }
  galleryImages.value = []
}

const handleGalleryUpload = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 5 - galleryImages.value.length
  files.slice(0, remainingSlots).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const isFirstImage = galleryImages.value.length === 0
      galleryImages.value.push({
        file: file, preview: e.target.result, isMain: isFirstImage, url: null
      })
      updateFormData()
    }
    reader.readAsDataURL(file)
  })
  event.target.value = ''
}

const updateFormData = () => {
  const mainImg = galleryImages.value.find(img => img.isMain)
  formData.value.mainImage = mainImg ? (mainImg.file || mainImg.url) : null
  formData.value.gallery = galleryImages.value.map(img => img.file || img.url)
}

const isFile = (input) => {
  return input instanceof File || input instanceof Blob;
}

const errors = ref({})
const clearError = (field) => {
  if (errors.value[field]) delete errors.value[field]
}

const validateForm = () => {
  const newErrors = {}
  if (!formData.value.category && !formData.value.categoryBreadcrumb) newErrors.category = 'انتخاب دسته‌بندی الزامی است.'
  if (mode.value === 'create' && !formData.value.code) newErrors.code = 'کد محصول (SKU) الزامی است.'
  if (!formData.value.price || getPriceAsNumber() === 0) newErrors.price = 'لطفا قیمت معتبر وارد کنید.'
  if (formData.value.stock === null || formData.value.stock === undefined || formData.value.stock < 0) newErrors.stock = 'لطفا موجودی معتبر (صفر یا بیشتر) وارد کنید.'

  if (formData.value.hasDiscount) {
    if (!formData.value.discountStartDate) newErrors.discountStartDate = 'تاریخ شروع تخفیف الزامی است.'
    if (!formData.value.discountEndDate) newErrors.discountEndDate = 'تاریخ پایان تخفیف الزامی است.'
    if (formData.value.discountStartDate && formData.value.discountEndDate && formData.value.discountStartDate > formData.value.discountEndDate) {
      newErrors.discountEndDate = 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.'
    }
  }

  if (formData.value.hasExpiryDate && !formData.value.expiryDate) newErrors.expiryDate = 'تاریخ انقضا الزامی است.'

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    if (typeof window.showToast === 'function') window.showToast('لطفا خطاهای فرم را برطرف کنید', 'warning', 5000);
    return
  }

  try {
    const finalPrice = getPriceAsNumber()
    let mainImageUrl = null
    const currentMainImgObj = galleryImages.value.find(img => img.isMain)
    if (currentMainImgObj) {
      mainImageUrl = isFile(currentMainImgObj.file) ? currentMainImgObj.file : currentMainImgObj.url
    }

    const galleryUrls = []
    for (const imgObj of galleryImages.value) {
      if (imgObj?.isMain) continue
      if (isFile(imgObj.file)) galleryUrls.push(imgObj.file)
      else if (imgObj.url) galleryUrls.push(imgObj.url)
    }

    const cleanFeatures = formData.value.features
        .filter(f => f && (f.text || typeof f === 'string'))
        .map(f => typeof f === 'string' ? f : f.text)

    const cleanSpecifications = formData.value.specifications
        .filter(s => s && (s.label || s.value))
        .map(s => ({ label: s.label || '', value: s.value || '' }))

    //const isExpiryGregorian = formData.value.expiryDate.includes('-');

    const payload = {
      name: formData.value.name,
      code: formData.value.code || `PRD-${Date.now()}`,
      type: 'shop',
      categoryBreadcrumb: formData.value.categoryBreadcrumb,
      categoryId: formData.value.category,
      categoryIds: [formData.value.category],
      price: finalPrice,
      stock: formData.value.stock || 0,
      isActive: formData.value.isActive,
      description: formData.value?.description || '',
      image: mainImageUrl,
      galleryImages: galleryUrls,
      brand: formData.value.brand || null,
      hasDiscount: formData.value.hasDiscount,
      discountStartDate: formData.value.hasDiscount ? formData.value.discountStartDate : null,
      discountEndDate: formData.value.hasDiscount ? formData.value.discountEndDate: null,
      discountType: formData.value.hasDiscount ? formData.value.discountType : null,
      discountValue: formData.value.hasDiscount ? formData.value.discountValue : 0,
      discountedPrice: formData.value.hasDiscount ? discountedPrice.value : finalPrice,
      hasExpiryDate: formData.value.hasExpiryDate,
      expiryDate: formData.value.hasExpiryDate ? formData.value.expiryDate : null,
      globalProductId: formData.value.existingProductId,
      features: cleanFeatures,
      specifications: cleanSpecifications
    }

    let res
    if (isEditMode.value && editingProductId.value) {
      res = await productStore.updateProduct(editingProductId.value, payload)
      if (typeof window.showToast === 'function' && res.statusCode === 200) window.showToast(`محصول "${formData.value.name}" با موفقیت ویرایش شد!`, 'success', 5000);
    } else if (mode.value === 'attach') {
      res = await productStore.attachProduct(payload)
      if (typeof window.showToast === 'function' && res.statusCode === 200) window.showToast(`شما به محصول "${formData.value.name}" متصل شدید!`, 'success', 5000);
    } else {
      res = await productStore.createProduct(payload)
      if (typeof window.showToast === 'function' && res.statusCode === 200) window.showToast(`محصول "${formData.value.name}" با موفقیت ایجاد شد!`, 'success', 5000);
    }
    await router.push('/pharmacies/products')
  } catch (err) {
    let errorMessage = 'خطایی رخ داد و ثبت محصول انجام نشد.';
    const status = err.response?.status;
    const responseData = err.response?.data;
    if (status === 400 && Array.isArray(responseData.message)) errorMessage = responseData.message.join(' | ');
    else if (status === 400) errorMessage = responseData.message;
    else if (status === 401) errorMessage = 'شناسایی نشد. لطفا وارد حساب کاربری شوید.';
    else if (status === 403) errorMessage = 'دسترسی غیرمجاز است.';
    else if (status >= 500) errorMessage = 'خطا در سرور رخ داده است. لطفا بعدا تلاش کنید.';
    else errorMessage = err.message || 'ارتباط با سرور برقرار نشد.';

    if (typeof window.showToast === 'function') {
      const safeMessage = errorMessage.replace(/(.+)/, '<strong>$1</strong>');
      window.showToast(safeMessage, 'error', 5000, status);
    }
  }
}

const products = computed(() => productStore.products)

const loadProductForEdit = (productId, productsList) => {
  isEditMode.value = true
  editingProductId.value = productId
  const product = productsList.find(p => p.id === productId)
  if (!product) { console.error('Product not found:', productId); return }

  const isGregorianExpiry = product.expiryDate && product.expiryDate.includes('-');
  useGregorianExpiry.value = false;

  mode.value = 'create'
  formData.value = {
    name: product.name,
    code: product.code,
    category: product.category?.id,
    categoryBreadcrumb: product.categoryBreadcrumb,
    categoryId: product.categoryId,
    price: new Intl.NumberFormat('fa-IR').format(product.price),
    stock: product.stock,
    mainImage: null,
    gallery: [],
    video: null,
    hasExpiryDate: product.hasExpiryDate || false,
    expiryDate: isGregorianExpiry ? product.expiryDate : product.expiryDate,
    hasDiscount: product.hasDiscount || false,
    discountType: product.discountType || 'percentage',
    discountValue: product.discountValue || null,
    discountStartDate: product.discountStartDate ? product?.discountStartDate : null,
    discountEndDate: product.discountEndDate ? product?.discountEndDate : null,
    isActive: product.isActive,
    type: product.type,
    description:product.description,
    existingProductId: null,
    features: product.features || [],
    specifications: product.specifications || []
  }

  if (product.image) {
    galleryImages.value.push({ url: product.image, preview: resolveUrl(product.image), isMain: true })
  }
  if (product.galleryImages && product.galleryImages.length > 0) {
    product.galleryImages.forEach(imgUrl => {
      galleryImages.value.push({ url: imgUrl, preview: resolveUrl(imgUrl), isMain: false })
    })
  }
}

watch(products, (newProducts) => {
  const productId = route.query.id
  if (productId && newProducts && newProducts.length > 0) {
    loadProductForEdit(String(productId), newProducts)
  }
}, { immediate: true })

const convertGregorianToJalali = (gregorianDateStr) => {
  if (!gregorianDateStr) return '';
  const dateParts = gregorianDateStr.split('-');
  const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  const jMoment = moment(date);
  if (jMoment.isValid()) {
    return `${jMoment.format('jYYYY')}/${jMoment.format('jMM')}/${jMoment.format('jDD')}`;
  }
  return '';
};

const convertJalaliToGregorian = (jalaliDateStr) => {
  if (!jalaliDateStr) return '';
  const parts = jalaliDateStr.split('/');
  if (parts.length !== 3) return '';
  const gMoment = moment.jalali(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  if (gMoment.isValid()) {
    return gMoment.format('YYYY-MM-DD');
  }
  return '';
};

watch(useGregorianExpiry, (newValue) => {
  if (showDatePicker.value && formData.value.expiryDate) {
    if (newValue) {
      const gregorianStr = convertJalaliToGregorian(formData.value.expiryDate);
      if (gregorianStr) {
        const parts = gregorianStr.split('-');
        tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
      }
    } else {
      const jalaliStr = convertGregorianToJalali(formData.value.expiryDate);
      if (jalaliStr) {
        const parts = jalaliStr.split('/');
        tempDate.value = { year: parseInt(parts[0]), month: parseInt(parts[1]), day: parseInt(parts[2]) };
      }
    }
  }
});
</script>

<style scoped>
/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade In Animation */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>