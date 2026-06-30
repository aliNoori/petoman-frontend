<template>
  <div class="min-h-screen bg-gray-50 font-sans" dir="rtl">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-0">
      <div class="container mx-auto px-4 py-4">
        <div class="max-w-5xl mx-auto">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors">
            <i class="ti ti-arrow-right"></i>
            بازگشت به صفحه اصلی
          </NuxtLink>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-gray-900">ثبت‌نام فروشگاه در پتومن</h1>
              <p class="text-sm text-gray-600 mt-1">فروشگاه خود را ثبت کنید و به هزاران مشتری دسترسی پیدا کنید</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <div class="max-w-5xl mx-auto">
          <div class="flex items-center justify-between relative px-2">
            <!-- Background Line -->
            <div class="absolute right-10 left-0 top-5 h-1 bg-gray-100 rounded-full mx-12 hidden md:block"></div>

            <!-- Active Line -->
            <div
                class="absolute right-10 top-5 h-1 bg-blue-500 rounded-full transition-all duration-500 hidden md:block"
                :style="{ width: progressWidth, transform: 'translateX(0)' }"
            ></div>

            <div
                v-for="(step, index) in formSteps"
                :key="index"
                class="flex flex-col items-center relative z-10 cursor-pointer group"
                @click="goToStep(index + 1)"
            >
              <div
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 shadow-sm"
                  :class="getStepStatusClass(index)"
              >
                <i v-if="currentStep > index + 1" class="ti ti-check text-sm"></i>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="mt-3 text-center">
                <p class="font-bold text-xs md:text-sm transition-colors whitespace-nowrap" :class="currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400'">
                  {{ step.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">

        <!-- Step 1: اطلاعات فروشگاه -->
        <div v-if="currentStep === 1" class="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-100 text-sky-600">
              <i class="ti ti-building-store"></i>
            </div>
            اطلاعات فروشگاه
          </h2>

          <div class="space-y-6">
            <!-- لوگو فروشگاه -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                لوگوی فروشگاه <span class="text-red-500">*</span>
              </label>
              <FileUploadCard
                  label="آپلود لوگو"
                  description="تصویر مربعی - حداکثر 2MB (JPG, PNG)"
                  :file="documents.logo"
                  @remove="documents.logo = null"
                  @file-selected="(f) => documents.logo = f"
                  :error="errors.logo"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام فروشگاه <span class="text-red-500">*</span></label>
                <input
                    v-model="formData.shopName"
                    type="text"
                    placeholder="مثال: پت شاپ رز"
                    class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    :class="errors.shopName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'"
                />
                <p v-if="errors.shopName" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.shopName }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام مالک <span class="text-red-500">*</span></label>
                <input
                    v-model="formData.ownerName"
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    :class="errors.ownerName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'"
                />
                <p v-if="errors.ownerName" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.ownerName }}
                </p>
              </div>
            </div>

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
                <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل <span class="text-red-500">*</span></label>
                <input
                    v-model="formData.email"
                    type="email"
                    placeholder="example@email.com"
                    class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-left"
                    :class="errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'"
                />
                <p v-if="errors.email" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <i class="ti ti-alert-circle"></i> {{ errors.email }}
                </p>
              </div>
            </div>

            <!-- موقعیت مکانی -->
            <div >
              <label class="block text-sm font-medium text-gray-700 mb-2">موقعیت و آدرس <span class="text-red-500">*</span></label>
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

            <!-- دسته‌بندی محصولات -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی محصولات <span class="text-red-500">*</span>
              </label>
              <ClientOnly>
                <USelectMenu
                    v-model="formData.categories"
                    :options="categoryOptions"
                    placeholder="انتخاب دسته‌بندی (چند مورد مجاز است)"
                    :searchable="true"
                    search-placeholder="جستجوی دسته‌بندی..."
                    :multiple="true"
                    class="w-full"
                />
              </ClientOnly>
              <p v-if="errors.categories" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <i class="ti ti-alert-circle"></i> {{ errors.categories }}
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
                مدارک فروشگاه
              </h3>

              <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
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

              <div
                   class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!--                <FileUploadCard
                    label="لوگو رسمی مجموعه"
                    description="فرمت PNG یا JPG با کیفیت بالا"
                    :file="documents.logo"
                    @remove="documents.logo = null"
                    @file-selected="(f) => documents.logo = f"
                    :error="errors.logo"
                    accept="image/*"
                />-->
                <FileUploadCard
                    label="مدرک تحصیلی / جواز کسب"
                    :description="'تصویر مجوز فعالیت'"
                    :file="documents.degree"
                    @remove="documents.degree = null"
                    @file-selected="(f) => documents.degree = f"
                    :error="errors.degree"
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
<!--              <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FileUploadCard
                    label="مدرک تحصیلی / جواز کسب"
                    :description="'تصویر مجوز فعالیت'"
                    :file="documents.degree"
                    @remove="documents.degree = null"
                    @file-selected="(f) => documents.degree = f"
                    :error="errors.degree"
                />
&lt;!&ndash;                <FileUploadCard
                    label="پروانه نظام / صنفی"
                    :description="'پروانه صنفی معتبر'"
                    :file="documents.license"
                    @remove="documents.license = null"
                    @file-selected="(f) => documents.license = f"
                    :error="errors.license"
                />&ndash;&gt;
              </div>-->
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

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between gap-4 mt-8 pb-10">
          <button
              v-if="currentStep > 1"
              @click="previousStep"
              class="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
          >
            <i class="ti ti-arrow-right"></i>
            مرحله قبل
          </button>
          <div v-else class="w-[160px]"></div> <!-- Spacer for alignment -->

          <button
              v-if="currentStep < 3"
              @click="nextStep"
              :disabled="!canProceed"
              class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            مرحله بعد
            <i class="ti ti-arrow-left"></i>
          </button>

          <button
              v-else
              @click="submitForm"
              :disabled="!canProceed || !agreedToTerms || isSubmitting"
              class="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
          >
            <i v-if="!isSubmitting" class="ti ti-check"></i>
            <i v-else class="ti ti-loader animate-spin"></i>
            {{ isSubmitting ? 'در حال ارسال...' : 'ثبت نهایی درخواست' }}
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
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl transform transition-all scale-100">
          <div class="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
            <i class="ti ti-check text-5xl text-green-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">درخواست شما ثبت شد!</h3>
          <p class="text-gray-600 mb-8 leading-relaxed">
            اطلاعات فروشگاه با موفقیت ارسال شد. تیم بررسی پتومن مدارک شما را در بازه زمانی ۲۴ تا ۴۸ ساعت بررسی خواهد کرد و نتیجه را از طریق پیامک و ایمیل به شما اطلاع می‌دهد.
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
import { ref, computed,onMounted, watch } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import { useCategoryStore} from "../../stores/category.store";
import { useShopStore} from "../../stores/shop.store";
import { iranCitiesData} from "../../data/iran-cities";
import AddressSelector from '../../../../shared/components/AddressSelector.vue'
import USelectMenu from "../../components/ui/USelectMenu.vue";
//import AddressSelector from "../../components/AddressSelector.vue";

import FileUploadCard from "../../components/ui/FileUploadCard.vue";
import {useContractStore} from "../../stores/contract.js";

definePageMeta({
  middleware: 'auth'
})

const { $toast } = useNuxtApp()
const contractStore=useContractStore()
const currentStep = ref(1)
const agreedToTerms = ref(false)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const showOtpModal = ref(false);
const otpCode = ref('');
const otpTimer = ref(0);
let otpInterval = null;
const otpInputs = ref([]);
// IBAN Input Handling
const ibanInput = ref('')
const ibanVerified = ref(false);
const ibanOwnerName = ref('');
const ibanMismatch = ref(false);
const handleIbanInput = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  ibanInput.value = value.slice(0, 24)
  ibanVerified.value = false;
  ibanMismatch.value = false;
};
// وضعیت تایید شماره موبایل
const isPhoneVerified = ref(false);

const verifyIban = async () => {
  if (ibanInput.value.length !== 24) return;

  isVerifyingIban.value = true;

  // شبیه‌سازی درخواست به بک‌اند
  setTimeout(() => {
    isVerifyingIban.value = false;

    // در نسخه واقعی، نام را از API دریافت کنید
    const mockOwnerName = formData.value.shopName;//"سید احمد محمدی";//TODO:next set api in backend

    if (mockOwnerName===formData.value.shopName) {
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
const isVerifyingIban = ref(false);

const canSendOtp = computed(() => {
  const phoneRegex = /^09[0-9]{9}$/;
  return phoneRegex.test(formData.value.phone) && !isPhoneVerified.value;
});

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

// Contract Data
const contractVersion = ref(contractStore.auditLog?.contractVersion);
const commissionRate = ref(contractStore.auditLog?.commissionRate);
const userIp = ref(contractStore.auditLog?.acceptedIp);
const currentDate = ref(new Date().toLocaleString('fa-IR'));
const auditLog = ref('');
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

const formSteps = [
  { title: 'اطلاعات فروشگاه', subtitle: 'مشخصات اولیه' },
  { title: 'مدارک', subtitle: 'بارگذاری مدارک' },
  { title: 'تایید نهایی', subtitle: 'بررسی و ثبت' }
]

const progressWidth = computed(() => {
  if (currentStep.value === 1) return '0%'
  if (currentStep.value === 2) return '50%'
  return '93%'
})

const getStepStatusClass = (index) => {
  const stepNum = index + 1
  if (currentStep.value > stepNum) return 'bg-blue-500 text-white border-blue-500'
  if (currentStep.value === stepNum) return 'bg-white text-blue-600 border-blue-500 ring-4 ring-blue-100'
  return 'bg-gray-100 text-gray-400 border-gray-200'
}

const goToStep = (step) => {
  if (step < currentStep.value) {
    currentStep.value = step
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Data
const formData = ref({
  shopName: '',
  ownerName: '',
  phone: '',
  email: '',
  province: '',
  city: '',
  categories: [],
  address: {},
  location: null,
  type:'MARKET'
})

const addressData = ref({
  address: {},
  province: '',
  city: '',
  location: null
})

const documents = ref({
  logo: null,
  license: null,
  nationalId: null
})

const errors = ref({
  shopName: '',
  ownerName: '',
  phone: '',
  email: '',
  city: '',
  province: '',
  categories: '',
  logo: '',
  license: '',
  nationalId: '',
  iban: '',
  agreed: ''
})

// Watchers
watch(addressData, (newVal) => {
  if (!newVal) return
  const info = extractAddressInfo(newVal)
  formData.value.address = info.address
  formData.value.city = info.city
  formData.value.province = info.province||info.address.address.state
  errors.value.city = ''
  errors.value.province = ''
}, { deep: true })

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

// Computed
const categoryStore = useCategoryStore()
const productCategories = computed(() => categoryStore.categories.map((c) => ({
  id:c.id,
  value: c.slug,
  label: c.name,
  icon: c.icon
})))

const categoryOptions = computed(() => {
  return productCategories.value.map(cat => ({
    id:cat.id,
    value: cat.label,
    label: cat.label
  }))
})

// Validation
const validatePhone = () => {
  const phone = formData.value.phone.replace(/\D/g, '')
  formData.value.phone = phone

  if (!phone) {
    errors.value.phone = ''
    return
  }

  if (!phone.startsWith('09')) {
    errors.value.phone = 'شماره موبایل باید با 09 شروع شود'
    return
  }

  if (phone.length < 11) {
    errors.value.phone = 'شماره موبایل باید 11 رقم باشد'
    return
  }

  errors.value.phone = ''
}

const validateStep = () => {
  // پاک کردن خطاهای مرحله فعلی قبل از اعتبارسنجی
  Object.keys(errors.value).forEach(key => errors.value[key] = '')

  if (currentStep.value === 1) {
    if (!formData.value.shopName.trim()) {
      errors.value.shopName = 'نام فروشگاه الزامی است';
      return false
    }
    if (!formData.value.ownerName.trim()) {
      errors.value.ownerName = 'نام مالک الزامی است';
      return false
    }

    // اعتبارسنجی شماره موبایل
    if (!formData.value.phone.trim() || !/^(09)\d{9}$/.test(formData.value.phone)) {
      errors.value.phone = 'شماره موبایل معتبر وارد کنید';
      return false
    }
    if (!isPhoneVerified.value) {
      errors.value.phone = 'لطفاً ابتدا شماره موبایل را تایید کنید.';
      return false
    }

    if (!formData.value.email.trim() || !/\S+@\S+\.\S+/.test(formData.value.email)) {
      errors.value.email = 'ایمیل معتبر وارد کنید';
      return false
    }

    if (!formData.value.city || !formData.value.province) {
      errors.value.city = 'موقعیت مکانی الزامی است';
      return false
    }
    if (formData.value.categories.length === 0) {
      errors.value.categories = 'حداقل یک دسته‌بندی انتخاب کنید';
      return false
    }
    if (!documents.value.logo) {
      errors.value.logo = 'بارگذاری لوگو الزامی است';
      return false
    }
  }

  if (currentStep.value === 2) {
    // بررسی مدارک اجباری در مرحله ۲
    if (!documents.value.selfie) {
      errors.value.selfie = 'بارگذاری سلفی با کارت ملی الزامی است';
      return false
    }
    if (!documents.value.video) {
      errors.value.video = 'بارگذاری ویدیو الزامی است';
      return false
    }
    if (!documents.value.personalPhoto) {
      errors.value.personalPhoto = 'بارگذاری عکس پرسنلی الزامی است';
      return false
    }
    if (!documents.value.degree) {
      errors.value.degree = 'بارگذاری مدرک تحصیلی یا جواز الزامی است';
      return false
    }
    if (!documents.value.environment) {
      errors.value.environment = 'بارگذاری عکس محیط الزامی است';
      return false
    }

    // بررسی وضعیت IBAN
    if (!ibanInput.value || ibanInput.value.length !== 24) {
      errors.value.iban = 'لطفاً 24 رقم شبا را وارد کنید';
      return false
    }
    if (!ibanVerified.value) {
      errors.value.iban = 'لطفاً نام صاحب حساب را استعلام و تایید کنید.';
      return false
    }
  }

  if (currentStep.value === 3) {
    if (!agreedToTerms.value) {
      errors.value.agreed = 'پذیرش قوانین الزامی است';
      return false
    }
  }

  return true
}

const canProceed = computed(() => {
  // در مرحله ۱، اگر شماره تایید شده باشد یا دکمه ارسال کد غیرفعال نباشد، می‌توان رد شد
  // اما منطق کلی validateStep کافی است.
  return validateStep()
})

const nextStep = () => {
  if (validateStep()) {
    if (currentStep.value < 3) {
      currentStep.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else {
    $toast('لطفا خطاهای فرم را برطرف کنید', 'error', 3000)
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// File Upload
const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (file) {
    if (type === 'logo') {
      if (file.size > 2 * 1024 * 1024) {
        $toast('حجم فایل لوگو نباید بیشتر از 2 مگابایت باشد', 'error', 3000)
        return
      }
    }
    documents.value[type] = file
  }
}

// Submit
const shopStore = useShopStore()

const submitForm = async () => {
  console.log('aaaaa')
  if (!validateStep() || !agreedToTerms.value) return
  isSubmitting.value = true
  console.log('bbbbb')
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

    const selectedCategoryIds = categoryOptions.value
        .filter(c => formData.value.categories.includes(c.value))
        .map(c => c.id);

    const payloadForSend = {
      ...formData.value,
      iban: 'IR' + ibanInput.value,
      address: completeAddressPayload,
      categories:selectedCategoryIds,
      addressString: formData.value.address?.display_name || ''
    }

    const payload = await shopStore.createShopRequest(payloadForSend, docsPayload)
    await shopStore.submitShop(payload)

    showSuccessModal.value = true
  } catch (error) {
    console.error('Registration failed:', error)
    const errMessage=error.response.data?.message
    $toast(errMessage, 'error', 5000)
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>


@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(0); }
}
</style>