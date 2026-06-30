<template>
  <div class="min-h-screen bg-gray-50 font-sans" dir="rtl">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="max-w-5xl mx-auto">
          <NuxtLink to="/"
                    class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors">
            <i class="ti ti-arrow-right"></i>
            بازگشت به صفحه اصلی
          </NuxtLink>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-900">
                تکمیل عضویت و عقد قرارداد
              </h1>
              <p class="text-sm text-gray-600 mt-1">
                اطلاعات خود را وارد کرده و قرارداد همکاری را مطالعه کنید
              </p>
            </div>

            <div
                v-if="currentStep > 0"
                class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm"
            >
              <i :class="typeConfig.icon" class="text-xl" :style="{ color: typeConfig.color }"></i>
              <span class="font-bold text-sm">
      {{ typeConfig.label }}
    </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Type Selection (Step 0) -->
    <div v-if="currentStep === 0" class="container mx-auto px-4 py-12">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-3">نوع خدمات خود را انتخاب کنید</h2>
          <p class="text-gray-600">یکی از گزینه‌های زیر را برای شروع ثبت‌نام انتخاب کنید</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- دامپزشک -->
          <button
              @click="selectType('vet')"
              class="group bg-white rounded-2xl border-2 border-gray-200 hover:border-sky-500 hover:hover:-translate-y-2
hover:shadow-2xl duration-500 transition-all p-6 md:p-8 text-center h-full flex flex-col"
              :class="{ 'border-sky-500 bg-sky-50 ring-2 ring-sky-100': selectedType === 'vet' }"
          >
            <div
                class="w-20 h-20 bg-sky-100 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-stethoscope text-4xl text-sky-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">دامپزشک</h3>
            <p class="text-sm text-gray-600 leading-relaxed flex-grow">ارائه خدمات ویزیت، مشاوره و درمان</p>
          </button>
          <!-- کلینیک -->
          <button
              @click="selectType('clinic')"
              class="group bg-white rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:hover:-translate-y-2
hover:shadow-2xl duration-500 transition-all p-6 md:p-8 text-center h-full flex flex-col"
              :class="{ 'border-teal-500 bg-teal-50 ring-2 ring-teal-100': selectedType === 'clinic' }"
          >
            <div
                class="w-20 h-20 bg-teal-100 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-building-hospital text-4xl text-teal-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">کلینیک دامپزشکی</h3>
            <p class="text-sm text-gray-600 leading-relaxed flex-grow">ثبت کلینیک با امکانات کامل</p>
          </button>
          <!-- داروخانه -->
          <button
              @click="selectType('pharmacy')"
              class="group bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:hover:-translate-y-2
hover:shadow-2xl duration-500 transition-all p-6 md:p-8 text-center h-full flex flex-col"
              :class="{ 'border-purple-500 bg-purple-50 ring-2 ring-purple-100': selectedType === 'pharmacy' }"
          >
            <div
                class="w-20 h-20 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="ti ti-pill text-4xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">داروخانه دامپزشکی</h3>
            <p class="text-sm text-gray-600 leading-relaxed flex-grow">عرضه داروها و مکمل‌های تخصصی</p>
          </button>
        </div>
        <div class="text-center mt-10">
          <button
              @click="nextStep"
              :disabled="!selectedType"
              class="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            ادامه ثبت‌نام
            <i class="ti ti-arrow-left"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Steps (Steps 1-4) -->
    <div v-if="currentStep > 0" class="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4 py-5">
        <div class="max-w-5xl mx-auto">

          <!-- Header: Back Button & Mobile Label -->
          <div class="flex items-center justify-between mb-8">
            <button
                @click="currentStep = 0"
                class="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-300"
            >
              <i class="ti ti-arrow-right text-lg transform group-hover:-translate-x-1 transition-transform duration-300"></i>
              <span>تغییر نوع خدمات</span>
            </button>

            <!-- Mobile Badge -->
            <div class="md:hidden flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
              <i :class="typeConfig.icon" class="text-base" :style="{ color: typeConfig.color }"></i>
              <span class="font-medium text-xs text-gray-700">{{ typeConfig.label }}</span>
            </div>
          </div>

          <!-- Progress Track & Steps -->
          <div class="relative">
            <!-- The Line (Background & Progress) -->
            <div class="absolute top-8 left-0 right-0 h-0.5 bg-gray-100 rounded-full">
              <div
                  class="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 transition-all duration-700 ease-out"
                  :style="{ width: progressWidth }"
              ></div>
            </div>

            <!-- Steps Container -->
            <div class="relative flex justify-between items-start gap-4 md:gap-0 overflow-x-auto md:overflow-visible pb-4 pt-2 no-scrollbar">
              <div
                  v-for="(step, index) in formSteps"
                  :key="index"
                  @click="goToStep(index + 1)"
                  class="flex flex-col items-center cursor-pointer min-w-[80px] group"
              >
                <!-- Circle Node -->
                <div
                    class="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border-2 z-10"
                    :class="[
                currentStep > index + 1
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : currentStep === index + 1
                  ? 'bg-white border-indigo-500 text-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-110'
                  : 'bg-white border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-400'
              ]"
                >
                  <!-- Check Icon (Completed) -->
                  <i
                      v-if="currentStep > index + 1"
                      class="ti ti-check text-lg animate-[scaleIn_0.3s_ease-out]"
                  ></i>

                  <!-- Number (Active or Pending) -->
                  <span
                      v-else
                      class="font-bold text-sm"
                      :class="currentStep === index + 1 ? 'text-indigo-600' : 'text-gray-400'"
                  >
                {{ index + 1 }}
              </span>

                  <!-- Pulse Effect for Active Step (Subtle) -->
                  <div
                      v-if="currentStep === index + 1"
                      class="absolute inset-0 rounded-full border border-indigo-500 opacity-50 animate-ping"
                  ></div>
                </div>

                <!-- Label -->
                <div class="mt-3 text-center transition-all duration-300">
                  <p
                      class="font-semibold text-xs md:text-sm whitespace-nowrap transition-colors duration-300"
                      :class="
                  currentStep >= index + 1
                    ? 'text-gray-800 opacity-100'
                    : 'text-gray-400 opacity-70'
                "
                  >
                    {{ step.title }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div v-if="currentStep > 0" class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto">

        <!-- Step 1: اطلاعات عمومی و احراز هویت موبایل -->
        <div v-if="currentStep === 1"
             class="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] ">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                 :style="{ backgroundColor: typeConfig.color + '20', color: typeConfig.color }">
              <i :class="typeConfig.icon"></i>
            </div>
            اطلاعات {{ typeConfig.label }}
          </h2>

          <div class="space-y-6">
            <!-- نام -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ selectedType === 'vet' ? 'نام و نام خانوادگی' : `نام ${typeConfig.label}` }} <span
                  class="text-red-500">*</span>
              </label>
              <input
                  v-model="formData.name"
                  type="text"
                  :placeholder="selectedType === 'vet' ? 'دکتر احمد محمدی' : `مثال: ${typeConfig.label} پتومن`"
                  class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  :class="errors.name ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'"
              />
              <p v-if="errors.name" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <i class="ti ti-alert-circle"></i> {{ errors.name }}
              </p>
            </div>

            <!-- تخصص و تجربه (فقط دامپزشک) -->
            <template v-if="selectedType === 'vet'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">تخصص <span
                      class="text-red-500">*</span></label>
                  <USelectMenu
                      v-model="formData.specialty"
                      :options="specialtyOptions"
                      placeholder="انتخاب تخصص"
                      :searchable="true"
                      search-placeholder="جستجو..."
                      class="w-full"
                  />
                  <p v-if="errors.specialty" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <i class="ti ti-alert-circle"></i> {{ errors.specialty }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">سال‌های تجربه <span
                      class="text-red-500">*</span></label>
                  <input
                      v-model="formData.experience"
                      type="number"
                      min="0"
                      placeholder="مثال: 10"
                      class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      :class="errors.experience ? 'border-red-500 bg-red-50' : 'border-gray-200'"
                  />
                  <p v-if="errors.experience" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <i class="ti ti-alert-circle"></i> {{ errors.experience }}
                  </p>
                </div>
              </div>
            </template>
            <!-- شماره تماس و ایمیل -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل <span class="text-red-500">*</span>
                </label>

                <!-- نمایش در حالت تایید شده -->
                <div v-if="isPhoneVerified" class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div
                      class="flex-1 w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-left text-gray-700 font-medium"
                  >
                    {{ formData.phone }}
                  </div>
                  <button
                      @click="resetPhoneVerification"
                      class="w-full sm:w-auto px-4 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                      title="ویرایش شماره"
                  >
                    <i class="ti ti-pencil"></i>
                    <span class="hidden sm:inline">ویرایش</span>
                  </button>
                </div>

                <!-- نمایش در حالت ویرایش/ثبت اولیه -->
                <div v-else class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                      v-model="formData.phone"
                      type="tel"
                      placeholder="09123456789"
                      class="flex-1 w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-left"
                      :class="errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'"
                  />
                  <button
                      @click="sendOtp"
                      :disabled="!canSendOtp"
                      class="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i v-if="isVerifyingIban" class="ti ti-loader animate-spin"></i>
                    <i v-else class="ti ti-message-circle"></i>
                    <span>{{ isPhoneVerified ? 'تایید شده' : 'ارسال کد' }}</span>
                  </button>
                </div>

                <p v-if="errors.phone" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.phone }}
                </p>
                <p v-if="isPhoneVerified" class="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <i class="ti ti-check-circle"></i> شماره موبایل تایید شده است.
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل <span
                    class="text-red-500">*</span></label>
                <input
                    v-model="formData.email"
                    type="email"
                    placeholder="example@email.com"
                    class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-left"
                    :class="errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'"
                />
                <p v-if="errors.email" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.email }}
                </p>
              </div>
            </div>

            <!-- موقعیت مکانی -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">موقعیت و آدرس <span
                  class="text-red-500">*</span></label>
              <ClientOnly>
                <AddressSelector
                    v-model="addressData"
                    placeholder="روی نقشه موقعیت را انتخاب کنید"
                    title="انتخاب موقعیت"
                    class="w-full"
                />
              </ClientOnly>
              <div class="mt-2 text-xs text-gray-500">
                <p>شهر: {{ formData.city || 'انتخاب نشده' }}</p>
                <p>استان: {{ formData.province || 'انتخاب نشده' }}</p>
              </div>
              <p v-if="errors.city || errors.province" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <i class="ti ti-alert-circle"></i> لطفاً موقعیت مکانی را از روی نقشه انتخاب کنید.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: مدارک و احراز هویت -->
        <div v-if="currentStep === 2" class="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <i class="ti ti-file-certificate"></i>
            </div>
            بارگذاری مدارک و احراز هویت
          </h2>

          <div class="space-y-10">

            <!-- بخش ۱: احراز هویت بیومتریک (اجباری برای همه) -->
            <div class="space-y-4">
              <h3 class="font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-user-check text-red-500"></i>
                احراز هویت چهره (ضد تقلب)
              </h3>
              <p class="text-sm text-gray-500">برای اطمینان از صحت اطلاعات، لطفاً یک سلفی واضح با کارت ملی خود بگیرید یا
                یک ویدیو کوتاه (۱۰ ثانیه) از صحبت کردن ضبط کنید.</p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- آپلود سلفی -->
                <FileUploadCard
                    label="عکس سلفی با کارت ملی"
                    description="کارت ملی باید کنار صورت شما و کاملاً خوانا باشد"
                    :file="documents.selfie"
                    @remove="documents.selfie = null"
                    @file-selected="(f) => documents.selfie = f"
                    :error="errors.selfie"
                    accept="image/*"
                />

                <!-- آپلود ویدیو -->
                <FileUploadCard
                    label="ویدیوی کوتاه معرفی"
                    description="یک ویدیو ۱۰ ثانیه‌ای از خودتان که نام و نام خانوادگی را می‌گویید"
                    :file="documents.video"
                    @remove="documents.video = null"
                    @file-selected="(f) => documents.video = f"
                    :error="errors.video"
                    accept="video/*"
                />
              </div>
            </div>

            <hr class="border-gray-100">

            <!-- بخش ۲: مدارک تخصصی بر اساس نوع کاربر -->
            <div class="space-y-6">
              <h3 class="font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-id-badge text-blue-500"></i>
                مدارک {{ typeConfig.label }}
              </h3>

              <!-- اگر دامپزشک است: عکس پرسنلی -->
              <div v-if="selectedType === 'vet'" class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">عکس پرسنلی رسمی <span
                    class="text-red-500">*</span></label>
                <FileUploadCard
                    :file="documents.personalPhoto"
                    @remove="documents.personalPhoto = null"
                    @file-selected="(f) => documents.personalPhoto = f"
                    :error="errors.personalPhoto"
                    accept="image/*"
                />
              </div>

              <!-- اگر کلینیک یا داروخانه است: لوگو و تصویر محیط/سردر -->
              <div v-if="selectedType === 'clinic' || selectedType === 'pharmacy'"
                   class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadCard
                    label="لوگو رسمی مجموعه"
                    description="فرمت PNG یا JPG با کیفیت بالا"
                    :file="documents.logo"
                    @remove="documents.logo = null"
                    @file-selected="(f) => documents.logo = f"
                    :error="errors.logo"
                    accept="image/*"
                />
                <FileUploadCard
                    label="عکس محیط / سردر مجموعه"
                    description="تصویر واضح از نمای بیرونی یا محیط داخلی"
                    :file="documents.environment"
                    @remove="documents.environment = null"
                    @file-selected="(f) => documents.environment = f"
                    :error="errors.environment"
                    accept="image/*"
                />
              </div>

              <!-- مدارک مشترک (تخصصی) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadCard
                    label="مدرک تحصیلی / جواز کسب"
                    :description="selectedType === 'vet' ? 'تصویر مدرک دکترای دامپزشکی' : 'تصویر مجوز فعالیت'"
                    :file="documents.degree"
                    @remove="documents.degree = null"
                    @file-selected="(f) => documents.degree = f"
                    :error="errors.degree"
                />
                <FileUploadCard
                    label="پروانه نظام / صنفی"
                    :description="selectedType === 'vet' ? 'پروانه اشتغال نظام دامپزشکی' : 'پروانه صنفی معتبر'"
                    :file="documents.license"
                    @remove="documents.license = null"
                    @file-selected="(f) => documents.license = f"
                    :error="errors.license"
                />
              </div>
            </div>

            <!-- اطلاعات مالی (شبا) -->
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div class="flex items-start gap-3">
                <div
                    class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <i class="ti ti-credit-card text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">شماره شبا جهت واریز <span
                        class="text-red-500">*</span></label>
                    <button
                        v-if="ibanInput && !ibanVerified"
                        @click="verifyIban"
                        class="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        :disabled="isVerifyingIban"
                    >
                      <i v-if="isVerifyingIban" class="ti ti-loader animate-spin"></i>
                      <i v-else class="ti ti-refresh"></i>
                      {{ isVerifyingIban ? 'در حال استعلام...' : 'استعلام نام صاحب حساب' }}
                    </button>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none select-none">
                      <span class="text-gray-500 font-mono font-bold text-lg">IR</span>
                    </div>
                    <input
                        v-model="ibanInput"
                        type="text"
                        placeholder="0000000000000000000000"
                        maxlength="24"
                        class="w-full px-4 py-3 pl-14 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-left"
                        :class="errors.iban ? 'border-red-500 bg-red-50' : (ibanVerified ? 'border-green-500 bg-green-50' : 'bg-white')"
                        @input="handleIbanInput"
                        dir="ltr"
                    />
                  </div>
                  <div v-if="ibanVerified"
                       class="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
                    <i class="ti ti-check-circle"></i>
                    <span>تطبیق موفق: {{ ibanOwnerName }}</span>
                  </div>
                  <div v-if="ibanMismatch"
                       class="mt-2 flex items-center gap-2 text-sm text-red-700 bg-red-50 p-2 rounded-lg border border-red-100">
                    <i class="ti ti-alert-circle"></i>
                    <span>نام صاحب حساب با نام وارد شده مطابقت ندارد.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <!-- Step 3: مطالعه و امضای قرارداد (جدید و حیاتی) -->
        <div v-if="currentStep === 3" class="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <i class="ti ti-file-text"></i>
            </div>
            مطالعه و پذیرش قرارداد همکاری
          </h2>

          <div class="space-y-6">
            <!-- اطلاعات قرارداد -->
            <div
                class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p class="text-sm text-blue-800 font-bold">نسخه قرارداد: <span class="font-mono">{{
                    contractVersion
                  }}</span></p>
                <p class="text-xs text-blue-600 mt-1">تاریخ اعتبار: ۱۴۰۵/۰۱/۰۱ الی ۱۴۰۶/۰۱/۰۱</p>
              </div>
              <div class="text-xs text-gray-500">
                <p>IP شما: <span class="font-mono text-gray-800">{{ userIp }}</span></p>
                <p>تاریخ: <span class="font-mono text-gray-800">{{ currentDate }}</span></p>
              </div>
            </div>

            <!-- متن قرارداد -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs text-gray-500 flex justify-between">
                <span>قرارداد خدمات الکترونیک پتومن</span>
                <button @click="scrollToContractBottom" class="text-blue-600 hover:underline">رفتن به انتهای متن
                </button>
              </div>
              <div ref="contractContent"
                   class="p-6 max-h-96 overflow-y-auto text-sm text-gray-700 leading-relaxed space-y-4 bg-white">
                <h3 class="font-bold text-gray-900">ماده ۱: موضوع قرارداد</h3>
                <p>این قرارداد بین شرکت پتومن (به عنوان پلتفرم واسط) و ارائه‌دهنده خدمات (شما) منعقد می‌گردد. موضوع
                  قرارداد، ارائه خدمات دامپزشکی/دارویی از طریق بستر نرم‌افزاری پتومن است.</p>

                <h3 class="font-bold text-gray-900">ماده ۲: تعهدات ارائه‌دهنده خدمات</h3>
                <ul class="list-disc list-inside space-y-1 mr-4">
                  <li>صحت داشتن تمامی مدارک ارسالی و تطابق آن با واقعیت.</li>
                  <li>پاسخگویی به درخواست‌های کاربران در بازه زمانی تعیین شده.</li>
                  <li>رعایت اصول اخلاق حرفه‌ای و قوانین جمهوری اسلامی ایران.</li>
                  <li>تعهد به حفظ حریم خصوصی کاربران و عدم افشای اطلاعات شخصی.</li>
                </ul>

                <h3 class="font-bold text-gray-900">ماده ۳: تعهدات مالی و کمیسیون</h3>
                <p>پلتفرم پتومن حق دارد به ازای هر تراکنش موفق، درصدی را به عنوان کارمزد خدمات (کمیسیون) کرده و مابقی را
                  به حساب بانکی شما واریز نماید.</p>
                <ul class="list-disc list-inside space-y-1 mr-4">
                  <li>نرخ کمیسیون: {{ commissionRate }} درصد از مبلغ هر تراکنش.</li>
                  <li>زمان‌بندی تسویه حساب: هفتگی هر روز چهارشنبه.</li>
                  <li>شرایط لغو و بازگشت وجه: طبق قوانین تجارب الکترونیکی.</li>
                </ul>

                <h3 class="font-bold text-gray-900">ماده ۴: حل اختلاف</h3>
                <p>در صورت بروز هرگونه اختلاف، تلاش بر حل مسالمت‌آمیز از طریق مذاکره خواهد بود. در غیر این صورت، مراجع
                  قضایی صالح جمهوری اسلامی ایران صالح به رسیدگی خواهند بود.</p>

                <div class="h-20"></div> <!-- Space for scrolling -->
              </div>
            </div>

            <!-- بخش امضای دیجیتال -->
            <div class="space-y-4">
              <label
                  class="flex items-start gap-3 cursor-pointer group p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                  :class="agreedToTerms ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                <div class="relative flex items-center mt-1">
                  <input
                      type="checkbox"
                      v-model="agreedToTerms"
                      class="peer sr-only"
                  />
                  <div
                      class="w-5 h-5 border-2 border-gray-300 rounded bg-white peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                    <i v-if="agreedToTerms" class="ti ti-check text-white text-xs"></i>
                  </div>
                </div>
                <div>
                  <span class="block text-sm font-medium text-gray-900">اعلام رضایت و امضای الکترونیک</span>
                  <span class="text-xs text-gray-500 block mt-1">
                    اینجانب با آگاهی کامل، تمامی شرایط مندرج در قرارداد فوق را مطالعه نموده و پذیرفته و با کلیک بر روی دکمه ثبت، امضای الکترونیک خود را اعمال می‌نمایم.
                  </span>
                </div>
              </label>

              <p v-if="errors.agreed" class="text-xs text-red-600 flex items-center gap-1">
                <i class="ti ti-alert-circle"></i> لطفاً متن قرارداد را مطالعه و تأیید کنید.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 4: وضعیت نهایی و لاگ‌ها -->
        <div v-if="currentStep === 4" class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <i class="ti ti-clipboard-check"></i>
            </div>
            وضعیت درخواست و لاگ‌های سیستمی
          </h2>

          <div class="space-y-6">
            <!-- خلاصه وضعیت مدارک -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-list-check text-gray-400"></i>
                وضعیت مدارک ارسالی
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between py-2 border-b border-gray-200 items-center">
                  <span class="text-gray-600">کارت ملی:</span>
                  <span class="font-medium text-blue-600 flex items-center gap-1"><i class="ti ti-clock"></i> در انتظار بررسی</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-200 items-center">
                  <span class="text-gray-600">پروانه نظام:</span>
                  <span class="font-medium text-blue-600 flex items-center gap-1"><i class="ti ti-clock"></i> در انتظار بررسی</span>
                </div>
                <div class="flex justify-between py-2 items-center">
                  <span class="text-gray-600">قرارداد:</span>
                  <span class="font-medium text-green-600 flex items-center gap-1"><i class="ti ti-check-circle"></i> امضا شده</span>
                </div>
              </div>
            </div>

            <!-- لاگ‌های حقوقی (برای اطمینان خاطر کاربر) -->
            <div class="bg-slate-800 text-slate-300 p-6 rounded-xl font-mono text-xs overflow-x-auto">
              <div class="flex justify-between items-center mb-4 text-slate-400">
                <span>لاگ‌های ثبت شده برای این درخواست</span>
                <i class="ti ti-lock"></i>
              </div>
              <pre class="whitespace-pre-wrap">{{ auditLog }}</pre>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div
            class="
  sticky
  bottom-0
  z-30
  bg-white/90
  backdrop-blur-xl
  border-t
  border-slate-200
  rounded-t-3xl
  p-4
  flex
  flex-col-reverse
  sm:flex-row
  justify-between
  gap-3
  mt-8
  "
        >
          <button
              v-if="currentStep > 1"
              @click="previousStep"
              class="px-6 py-3 border border-gray-200 rounded-2xl hover:scale-[1.02]
active:scale-[0.98]
duration-300 font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
          >
            <i class="ti ti-arrow-right"></i>
            مرحله قبل
          </button>
          <div v-else class="w-[160px]"></div>

          <button
              v-if="currentStep < 3"
              @click="nextStep"
              :disabled="!canProceed"
              class="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:scale-[1.02]
active:scale-[0.98]
duration-300 font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            مرحله بعد
            <i class="ti ti-arrow-left"></i>
          </button>

          <button
              v-else
              @click="submitForm"
              :disabled="!canProceed || !agreedToTerms || isSubmitting"
              class="px-8 py-3 bg-green-600 text-white rounded-2xl hover:scale-[1.02]
active:scale-[0.98]
duration-300 font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
          >
            <i v-if="!isSubmitting" class="ti ti-file-symlink"></i>
            <i v-else class="ti ti-loader animate-spin"></i>
            {{ isSubmitting ? 'در حال ثبت نهایی...' : 'ثبت نهایی و امضای قرارداد' }}
          </button>
        </div>
      </div>
    </div>

    <!-- OTP Verification Modal -->
    <Teleport to="body">
      <div v-if="showOtpModal"
           class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl transform transition-all scale-100">
          <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="ti ti-message-circle text-3xl text-blue-600"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">تایید شماره موبایل</h3>
          <p class="text-sm text-gray-600 mb-6">
            کد <span class="font-bold text-gray-900">۶ رقمی</span> ارسال شده به شماره
            <span class="font-bold text-gray-900" dir="ltr">{{ formData.phone }}</span> را
            وارد کنید.
          </p>

          <!-- بخش OTP: استفاده از v-for روی div والد برای جلوگیری از مشکلات رندرینگ -->
          <div class="flex justify-center gap-2 mb-6" dir="ltr">
            <div v-for="(digit, index) in 6" :key="index" class="w-12 h-12">
              <input
                  ref="otpInputs"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  :value="otpDigits[index] || ''"
                  @input="(e) => handleOtpInput(e, index)"
                  @keydown.backspace="handleBackspace(index)"
                  @focus="currentInputIndex = index"
                  class="w-full h-full text-center text-2xl font-bold border-2 rounded-xl transition-all duration-300 outline-none bg-gray-50 focus:bg-white focus:border-blue-500"
                  :class="getOtpInputClass(index)"
              />
            </div>
          </div>

          <!-- اگر خطا در کد وجود داشته باشد -->
          <p v-if="errors.otp" class="text-xs text-red-500 mb-4">
            <i class="ti ti-alert-circle"></i> {{ errors.otp }}
          </p>

          <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
            <button
                @click="resendOtp"
                :disabled="otpTimer > 0"
                class="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed">
              {{ otpTimer > 0 ? `ارسال مجدد (${otpTimer} ثانیه)` : 'ارسال مجدد کد' }}
            </button>
            <button @click="showOtpModal = false" class="text-gray-500 hover:text-gray-800">
              انصراف
            </button>
          </div>

          <button
              @click="verifyOtp"
              class="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            تایید و ادامه
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal"
           class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl transform transition-all scale-100">
          <div class="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
            <i class="ti ti-check text-5xl text-green-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">درخواست شما با موفقیت ثبت شد!</h3>
          <p class="text-gray-600 mb-8 leading-relaxed">
            مدارک و قرارداد شما دریافت شد. وضعیت مدارک در بخش پنل کاربری قابل پیگیری است. نتیجه بررسی توسط تیم حقوقی
            پتومن ظرف ۲۴ ساعت اعلام خواهد شد.
          </p>
          <NuxtLink
              to="/"
              class="w-full px-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all inline-block"
          >
            بازگشت به صفحه اصلی
          </NuxtLink>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useNuxtApp} from "nuxt/app";
import {useAuthStore} from "~/stores/auth";
import {useContractStore} from "~/stores/contract";
const authStore=useAuthStore()
const {user}=storeToRefs(authStore)
const contractStore=useContractStore()
// --- Data & State ---
const currentStep = ref(0);
const selectedType = ref('');
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const agreedToTerms = ref(false);
const {$toast}=useNuxtApp()
// --- OTP Related State ---
const showOtpModal = ref(false);
const otpCode = ref('');
const otpTimer = ref(0);
let otpInterval = null;
const otpInputs = ref([]);

// Type Configuration
const typeConfig = computed(() => {
  const configs = {
    vet: {label: 'دامپزشک', icon: 'ti ti-stethoscope', color: '#0ea5e9'},
    clinic: {label: 'کلینیک دامپزشکی', icon: 'ti ti-building-hospital', color: '#0d9488'},
    pharmacy: {label: 'داروخانه دامپزشکی', icon: 'ti ti-pill', color: '#9333ea'},
  };
  return configs[selectedType.value] || {};
});

// Form Data
const formData = ref({
  name: '',
  specialty: '',
  experience: '',
  phone: '',
  email: '',
  city: '',
  province: '',
  description: '',
  services: '',
});

const documents = ref({
  degree: null,
  license: null,
  selfie: null,      // جدید: سلفی با کارت ملی
  video: null,       // جدید: ویدیو معرفی
  personalPhoto: null, // جدید: عکس پرسنلی (دامپزشک)
  logo: null,        // جدید: لوگو (کلینیک/داروخانه)
  environment: null  // جدید: تصویر محیط (کلینیک/داروخانه)
});

// IBAN Verification State
const ibanInput = ref('');
const ibanVerified = ref(false);
const ibanMismatch = ref(false);
const ibanOwnerName = ref('');
const isVerifyingIban = ref(false);

// Contract Data
const contractVersion = ref(contractStore.auditLog?.contractVersion);
const commissionRate = ref(contractStore.auditLog?.commissionRate);
const userIp = ref(contractStore.auditLog?.acceptedIp);
const currentDate = ref(new Date().toLocaleString('fa-IR'));
const auditLog = ref('');

// Errors
const errors = ref({});

// Steps Definition
const formSteps = [
  {title: 'اطلاعات اولیه'},
  {title: 'مدارک و احراز هویت'},
  {title: 'قرارداد همکاری'},
  {title: 'تکمیل و ثبت'}
];

// --- Computed ---
const progressWidth = computed(() => {
  if (currentStep.value === 0) return '0%';
  const percentage = ((currentStep.value - 1) / 2) * 100;
  return `${percentage}%`;
});

// بررسی صحت فرمت شماره موبایل برای فعال کردن دکمه ارسال OTP
const canSendOtp = computed(() => {
  const phoneRegex = /^09[0-9]{9}$/;
  return phoneRegex.test(formData.value.phone) && !isPhoneVerified.value;
});

// وضعیت تایید شماره موبایل
const isPhoneVerified = ref(false);

// 2. منطق فعال شدن دکمه در مرحله 2
const canProceed = computed(() => {
  if (currentStep.value === 2) {
    // الف) مدارک مشترک و حیاتی
    const hasCommonDocs =
        documents.value.video &&
        documents.value.selfie &&
        documents.value.degree &&
        documents.value.license &&
        ibanVerified.value; // شبا تایید شده باشد

    // ب) مدارک اختصاصی بر اساس نوع کاربر
    let hasSpecificDocs = true;

    if (selectedType.value === 'vet') {
      hasSpecificDocs = documents.value.personalPhoto !== null;
    } else if (selectedType.value === 'clinic' || selectedType.value === 'pharmacy') {
      hasSpecificDocs = documents.value.logo !== null && documents.value.environment !== null;
    }

    // ج) نتیجه نهایی
    return hasCommonDocs && hasSpecificDocs;
  }

  // سایر مراحل
  if (currentStep.value === 1) return formData.value.name && formData.value.phone && formData.value.email && formData.value.city && isPhoneVerified.value;
  if (currentStep.value === 3) return agreedToTerms.value;

  return true;
});

// --- Methods ---

const selectType = (type) => {
  selectedType.value = type;
};

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
    window.scrollTo(0, 0);
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo(0, 0);
  }
};

const goToStep = (stepIndex) => {
  if (stepIndex <= currentStep.value) {
    currentStep.value = stepIndex;
    window.scrollTo(0, 0);
  }
};

const getStepStatusClass = (index) => {
  const stepNum = index + 1;
  if (currentStep.value > stepNum) return 'bg-blue-600 border-blue-200 text-white';
  if (currentStep.value === stepNum) return 'bg-white border-blue-500 text-blue-600';
  return 'bg-white border-gray-200 text-gray-400';
};

const handleIbanInput = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  ibanInput.value = value.slice(0, 24)
  ibanVerified.value = false;
  ibanMismatch.value = false;
};

const verifyIban = async () => {
  if (ibanInput.value.length !== 24) return;

  isVerifyingIban.value = true;

  // شبیه‌سازی درخواست به بک‌اند
  setTimeout(() => {
    isVerifyingIban.value = false;

    // در نسخه واقعی، نام را از API دریافت کنید
    const mockOwnerName = formData.value.name;//"سید احمد محمدی";//TODO:next set api in backend

    if (mockOwnerName===formData.value.name) {
      ibanVerified.value = true;
      ibanOwnerName.value = mockOwnerName;
      generateAuditLog()

    } else {
      ibanMismatch.value = true;
    }
  }, 1500);
};

// --- OTP Logic ---
const { $axios } = useNuxtApp()

const sendOtp = async () => {
  const phoneRegex = /^09[0-9]{9}$/;

  if (!phoneRegex.test(formData.value.phone)) {
    errors.value.phone = 'شماره موبایل معتبر نیست';
    return;
  }

  errors.value.phone = '';

  try {
    // اصلاح مهم: ارسال به صورت آبجکت با کلید مشخص (مثلاً phone یا mobile)
    // چک کنید که در بک‌اند (Controller) کلید ورودی چه نامی دارد (phone, mobile, number و...)
    const response = await $axios.post('/v1/auth/send-otp', {
      phoneNumber: formData.value.phone
    });

    showOtpModal.value = true;
    $toast(response.data.message || 'کد تایید ارسال شد', 'success', 5000);
  } catch (error) {
    console.error('Error sending OTP:', error);
    // مدیریت خطا در صورتی که شماره فرمت نادرست داشته باشد یا سرور خطا دهد
    if (error.response) {
      $toast(error.response.data.message || 'خطا در ارسال کد', 'error', 5000);
    } else {
      $toast('خطایی رخ داد', 'error', 5000);
    }
  }
};

// --- State جدید برای OTP ---
const otpDigits = ref(['', '', '', '','','']); // آرایه‌ای برای نگهداری مقدار هر اینپوت
const currentInputIndex = ref(0); // ایندکس اینپوتی که فوکوس دارد

// --- متد محاسبه کلاس‌ها ---
const getOtpInputClass = (index) => {
  let classes = 'bg-white text-gray-900'; // کلاس پایه

  // اگر این اینپوت فوکوس دارد
  if (index === currentInputIndex.value) {
    classes += ' border-blue-500 ring-4 ring-blue-100 scale-105 z-10 shadow-lg';
  } else {
    classes += ' border-gray-200';
  }

  // اگر این اینپوت پر شده است
  if (otpDigits.value[index]) {
    classes += ' bg-blue-50 border-green-400 text-green-700';
  }

  return classes;
};

// --- منطق ورودی و خروجی ---
const handleOtpInput = (e, index) => {
  const value = e.target.value;

  // فقط مجاز به ورود یک رقم
  if (value.length > 1) {
    e.target.value = value.slice(0, 1);
  }

  // ذخیره مقدار در آرایه
  otpDigits.value[index] = e.target.value;

  // اگر مقدار وارد شد، به اینپوت بعدی برو
  if (e.target.value && index < 5) {
    const nextInput = otpInputs.value[index + 1];
    if (nextInput) {
      nextInput.focus();
    }
  }

  // اگر کاربر بک‌اسپ کرد و اینپوت خالی شد، به اینپوت قبلی برگرد
  // (این بخش در handleBackspace هندل می‌شود اما برای اطمینان اینجا هم چک می‌کنیم)
};

const handleBackspace = (index) => {
  // اگر اینپوت خالی بود و بک‌اسپ زده شد، به اینپوت قبلی برو
  if (index > 0 && !otpDigits.value[index]) {
    const prevInput = otpInputs.value[index - 1];
    if (prevInput) {
      prevInput.focus();
      // مقدار اینپوت قبلی را هم خالی کنیم تا کاربر بتواند دوباره تایپ کند
      otpDigits.value[index - 1] = '';
    }
  }
};

const verifyOtp = async () => {
  // 1. ترکیب آرایه برای ساخت کد نهایی
  const code = otpDigits.value.join('');

  // 2. بررسی طول کد (اگر کد 4 رقمی است)
  if (code.length !== 6) {
    alert('لطفاً کد 6 رقمی را کامل وارد کنید.');
    return;
  }

  try {
    // 3. ارسال درخواست به سرور
    // نکته: مطمئن شوید که در بک‌اند کلیدها phoneNumber و code هستند.
    const response = await $axios.post('/v1/auth/verify-otp', {
      phoneNumber: formData.value.phone,
      code: code,
      isVerifiedPhone:true
    });

    // 4. بررسی موفقیت‌آمیز بودن پاسخ
    // معمولاً اگر وضعیت 200 باشد یعنی موفق بوده
    if (response.status === 200 || response.data.success) {
      isPhoneVerified.value = true;
      showOtpModal.value = false;

      // پاک کردن آرایه برای دفعات بعد
      otpDigits.value = ['', '', '', '','',''];

      $toast('شماره موبایل با موفقیت تایید شد.','success',5000);

    } else {
      // 5. مدیریت خطا در صورتی که سرور کد را قبول نکند
      $toast('کد وارد شده اشتباه است یا منقضی شده است.','error',5000);
    }

  } catch (error) {
    console.error('خطا در تایید کد:', error);

    // مدیریت خطاهای شبکه یا خطاهای سرور (مثلا کد اشتباه)
    if (error.response) {
      // اگر سرور خطای 400 یا 422 داد (کد غلط)
      $toast(error.response.data.message || 'کد وارد شده اشتباه است.','error',5000);
    } else {
      // خطای شبکه یا سرور
      $toast('خطایی در ارتباط با سرور رخ داد.','error',5000);
    }
  }
};

const startOtpTimer = () => {
  otpTimer.value = 60;
  otpInterval = setInterval(() => {
    if (otpTimer.value > 0) {
      otpTimer.value--;
    } else {
      stopOtpTimer();
    }
  }, 1000);
};

const stopOtpTimer = () => {
  if (otpInterval) clearInterval(otpInterval);
};

const resendOtp = async () => {
  if (otpTimer.value > 0) return;
  otpCode.value = '';
  startOtpTimer();
  console.log('Resending OTP...');
  alert('کد جدید ارسال شد (کد نمونه: 1234)');
};

const resetPhoneVerification = () => {
  isPhoneVerified.value = false;
  formData.phone = '';
  otpCode.value = '';
  // پاک کردن مقادیر اینپوت‌های OTP برای جلوگیری از خطا
  if (otpInputs.value) {
    otpInputs.value.forEach(input => input.value = '');
  }
};

const scrollToContractBottom = () => {
  const contractContent = document.querySelector('.max-h-96');
  if (contractContent) contractContent.scrollTop = contractContent.scrollHeight;
};
const generateAuditLog = () => {
  const log = {
    userId:contractStore.auditLog?.userId,
    contractVersion: contractStore.auditLog?.contractVersion,
    acceptedAt: new Date().toISOString(),
    acceptedIp: contractStore.auditLog?.acceptedIp,
    userAgent: contractStore.auditLog?.userAgent,
    documentsStatus: {
      degree: documents.value.degree ? 'uploaded' : 'missing',
      license: documents.value.license ? 'uploaded' : 'missing',
      selfie: documents.value.selfie ? 'uploaded' : 'missing',
      ibanVerified: ibanVerified.value,
      phoneVerified: isPhoneVerified.value
    },
    commissionAccepted: true
  };
  auditLog.value = JSON.stringify(log, null, 2).replace(/\"/g, '').replace(/:/g, ': ').replace(/{/g, '{\n  ').replace(/}/g, '\n}');
};

const submitForm = async () => {
  if (!canProceed.value) return;

  isSubmitting.value = true;

  try {

    const docsPayload = {
      logo: {
        thumbnail: documents.value.logo,
        name: 'لوگوی کسب و کار',
        type: documents.value.logo?.type
      },
      personalPhoto: {
        thumbnail: documents.value.personalPhoto,
        name: 'عکس متقاضی درخواست',
        type: documents.value.personalPhoto?.type
      },
      degree: {
        thumbnail: documents.value.degree,
        name: 'مدرک تحصیلی',
        type: documents.value.degree?.type
      },
      license: {
        thumbnail: documents.value.license,
        name: 'جواز کسب',
        type: documents.value.license?.type
      },
      selfie: {
        thumbnail: documents.value.selfie,
        name: 'تصویر کارت ملی',
        type: documents.value.selfie?.type
      },
      environment: {
        thumbnail: documents.value.environment,
        name: 'تصویر محیط',
        type: documents.value.environment?.type
      },
      video: {
        thumbnail: documents.value.video,
        name: 'ویدیو احراز هویت',
        type: documents.value.video?.type
      },
    }

    const rawAddressData = addressData.value?.address || {}
    const fullAddressDetails = JSON.parse(JSON.stringify(rawAddressData))

    const completeAddressPayload = {
      display_name: fullAddressDetails.display_name || '',
      lat: parseFloat(fullAddressDetails.lat),
      lon: parseFloat(fullAddressDetails.lon),
      ...fullAddressDetails
    }

    const selectedSpecialty = specialtyOptions.value.find(s => s.value === formData.value.specialty)

    const selectedServiceIds = clinicServices.value
        .filter(s => formData.value.services.includes(s.value))
        .map(s => s.id);

    const payloadForSend = {
      ...formData.value,
      type: selectedType.value,
      iban: 'IR' + ibanInput.value,
      specialty: selectedSpecialty?.id,
      services: selectedServiceIds,
      address: completeAddressPayload,
      addressString: formData.value.address?.display_name || ''
    }

    const payload = await tenantStore.createTenantRequest(payloadForSend, docsPayload)

    const res= await tenantStore.submitTenant(payload)
    $toast(res.message, 'success', 5000)
    showSuccessModal.value = true

  } catch (error) {
    console.error('Registration failed:', error)
    $toast(error.response?.data?.message, 'error', 5000)
  } finally {
    isSubmitting.value = false
  }
};
const tenantStore = useTenantStore()
// Mock Data
const specialtyOptions = computed(() => tenantStore.specialties)

const clinicServices = computed(() => tenantStore.services)

const addressData = ref({
  address: {},
  province: '',
  city: '',
  location: null
})
watch(addressData, (newVal) => {
  if (!newVal) return
  const info = extractAddressInfo(newVal)
  formData.value.address = info.address
  formData.value.city = info.city
  formData.value.province = info.province || info.address.address.state
  errors.value.city = ''
  errors.value.province = ''
}, {deep: true})
// Helper: Extract Address Info
const extractAddressInfo = (rawData) => {
  if (!rawData) return {}
  const cityFromTop = rawData.city || ''
  const provinceFromTop = rawData.province || ''
  const mapData = rawData.address || {}
  const cityFromMap = mapData.city || mapData.town || mapData.village || mapData.municipality || ''
  const provinceFromMap = mapData.state || ''

  return {
    address: mapData,
    city: cityFromTop || cityFromMap,
    province: provinceFromTop || provinceFromMap,
    postalCode: mapData.postcode || '',
    lat: parseFloat(mapData.lat),
    lon: parseFloat(mapData.lon)
  }
}

onMounted(() => {
  currentDate.value = new Date().toLocaleString('fa-IR');
});
</script>
<style>
@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>