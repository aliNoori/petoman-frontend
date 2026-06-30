<template>
  <div class="min-h-screen bg-gray-50 font-vazir">
    <!-- Breadcrumb - خارج از هدر -->
    <div class="container mx-auto px-4 pt-6">
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <NuxtLink to="/" class="hover:text-teal-600 transition-colors">خانه</NuxtLink>
        <i class="ti ti-chevron-left text-xs"></i>
        <NuxtLink to="/clinics" class="hover:text-teal-600 transition-colors">کلینیکان</NuxtLink>
        <i class="ti ti-chevron-left text-xs"></i>
        <span class="text-teal-600 font-medium">{{ clinic.name }}</span>
      </nav>
    </div>

    <!-- Hero Header - با رادیوس و عرض container (استایل کلینیک اعمال شد) -->
    <div class="container mx-auto px-4 pb-6">
      <div class="relative bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 left-32 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>

        <div class="relative z-10">
          <div class="px-6 py-4">
            <nav class="flex items-center justify-between text-white">
              <button @click="$router.back()"
                      class="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                <i class="ti ti-arrow-right text-lg"></i>
                <span class="font-medium">بازگشت</span>
              </button>
              <div class="flex items-center gap-3">
                <button @click="shareClinic" class="hover:bg-white/10 p-2 rounded-lg transition-colors"
                        title="اشتراک‌گذاری"><i class="ti ti-share text-lg"></i></button>
                <button @click="showReviewModal = true" class="hover:bg-white/10 p-2 rounded-lg transition-colors"
                        title="ثبت نظر"><i class="ti ti-message-circle text-lg"></i></button>
              </div>
            </nav>
          </div>
          <div class="px-6 pb-8 pt-4">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div class="relative">
                <div
                    class="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden relative">

                  <!-- اگر عکس (logo) وجود داشت -->
                  <img
                      v-if="clinic.logo"
                      :src="clinic.logo"
                      :alt="clinic.name"
                      class="w-full h-full object-cover absolute inset-0"
                  >
                  <!-- اگر عکس نبود، حرف اول نام را نمایش بده -->
                  <span v-else class="text-4xl font-bold text-white relative z-10">{{ clinic.avatar }}</span>

                </div>
                <div v-if="clinic.isOnline"
                     class="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div class="flex-1 text-center md:text-right">
                <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ clinic.name }}</h1>
                <p class="text-teal-100 mb-3">{{ clinic.specialty }}</p>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div class="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <i class="ti ti-star-filled text-yellow-400"></i>
                    <span class="text-white font-semibold">{{ clinic.rating }}</span>
                    <span class="text-white/70">({{ clinic.reviewCount }} نظر)</span>
                  </div>
                  <div :class="clinic.isOnline ? 'bg-green-500' : 'bg-gray-500'"
                       class="px-3 py-1 rounded-full text-white text-sm font-medium">
                    {{ clinic.isOnline ? 'آنلاین' : 'آفلاین' }}
                  </div>
                  <div class="flex items-center gap-2 text-white/90 text-sm">
                    <i class="ti ti-certificate"></i>
                    <span>{{ clinic.experience }} سال تجربه</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- تب‌ها - درباره کلینیک / خدمات / نظرات کاربران (استایل کلینیک اعمال شد) -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="container mx-auto px-4">
        <div class="flex gap-1">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="scrollToSection(tab.id)"
              :class="[
              'px-6 py-4 font-medium text-sm border-b-2 transition-all',
              activeTab === tab.id
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            <i :class="['ml-2', tab.icon]"></i>
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- انتخاب نوع ویزیت -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">انتخاب نوع ویزیت</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              :class="[
              'relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200',
              selectedService?.id === service.id
                ? `${service.borderColor} ${service.bgColor}`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            ]"
          >
            <div class="flex items-start gap-3">
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center',
                selectedService?.id === service.id ? 'bg-white/50' : service.iconBg
              ]">
                <i :class="['text-2xl', service.icon, selectedService?.id === service.id ? service.iconColorActive : service.iconColor]"></i>
              </div>
              <div class="flex-1">
                <h3 :class="['font-bold', selectedService?.id === service.id ? service.textColorActive : 'text-gray-900']">
                  {{ service.name }}
                </h3>
                <p :class="['text-sm mt-1', selectedService?.id === service.id ? 'text-white/80' : 'text-gray-500']">
                  {{ service.description }}
                </p>
                <p :class="['font-bold mt-2', selectedService?.id === service.id ? 'text-white' : service.priceColor]">
                  {{ service.price }} تومان
                </p>
              </div>
            </div>
            <!-- نشانه‌گر فوری -->
            <div v-if="service.isInstant" class="absolute top-2 left-2">
              <span class="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">فوری</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 1. Pet Selection -->
      <div v-if="selectedService && selectedService.isInstant" class="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">انتخاب حیوان</h2>
          <button @click="openAddPetModal" class="text-sm text-teal-600 hover:text-teal-700 font-medium">
            + افزودن حیوان جدید
          </button>
        </div>
        <div v-if="petStore.loading" class="text-center py-4 text-gray-500">در حال بارگذاری...</div>
        <div v-else-if="petStore.pets.length === 0" class="text-center py-4 text-gray-500 bg-gray-50 rounded">
          حیوانی یافت نشد. لطفاً یک حیوان اضافه کنید.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
              v-for="pet in petStore.pets"
              :key="pet.id"
              @click="selectedPetId = pet.id"
              :class="['p-4 border rounded-lg cursor-pointer transition flex items-center gap-3', selectedPetId === pet.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300']"
          >
            <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img v-if="pet.logo" :src="pet.logo" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">🐾</div>
            </div>
            <div>
              <div class="font-bold text-gray-800">{{ pet.name }}</div>
              <div class="text-xs text-gray-500">{{ getPetTypeLabel(pet.type) }} | {{ pet.age }} ساله</div>
            </div>
            <div v-if="selectedPetId === pet.id" class="mr-auto text-teal-500">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- ستون اصلی -->
        <div class="lg:col-span-2 space-y-6">

          <!-- انتخاب تاریخ و ساعت - فقط برای خدمات نوبت‌دار (استایل کلینیک اعمال شد) -->
          <div v-if="selectedService && !selectedService.isInstant"
               class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">انتخاب تاریخ و زمان</h2>

            <!-- انتخاب تاریخ -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <i class="ti ti-calendar text-teal-500"></i>
                تاریخ مراجعه
              </h3>
              <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
                <button
                    v-for="(date, index) in availableDates"
                    :key="index"
                    @click="selectDate(date)"
                    :disabled="date.isFriday || !date.hasSlots"
                    :class="[
                    'p-3 rounded-xl text-center transition-all relative',
                    date.isFriday || !date.hasSlots
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectedDate?.fullDate === date.fullDate
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  ]"
                >
                  <div class="text-xs mb-1">{{ date.dayName }}</div>
                  <div class="font-bold text-lg">{{ date.jalaliDay }}</div>
                  <div class="text-xs mt-1">{{ date.monthName }}</div>
                  <span v-if="date.isToday" class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  <span v-if="date.isFriday" class="text-[10px] text-red-400 block mt-1">تعطیل</span>
                </button>
              </div>
            </div>

            <!-- نمایش تاریخ انتخاب شده -->
            <div v-if="selectedDate" class="bg-teal-50 rounded-xl p-3 flex items-center gap-3 mb-6">
              <i class="ti ti-calendar-check text-teal-500 text-xl"></i>
              <div>
                <span class="text-sm text-gray-600">تاریخ انتخاب شده:</span>
                <span class="font-bold text-teal-700 mr-2">{{ selectedDateDisplay }}</span>
              </div>
            </div>

            <!-- انتخاب ساعت -->
            <div v-if="selectedDate && !selectedDate.isFriday">
              <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <i class="ti ti-clock text-teal-500"></i>
                ساعت مراجعه
                <span v-if="selectedDate.dayNameFull === 'پنج‌شنبه'"
                      class="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">(نیم‌روز)</span>
              </h3>

              <!-- تب‌های صبح/عصر -->
              <div class="flex gap-2 mb-4">
                <button
                    @click="timePeriod = 'morning'"
                    :class="['px-4 py-2 rounded-lg font-medium transition-all', timePeriod === 'morning' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                >
                  صبح
                </button>
                <button
                    v-if="selectedDate.dayNameFull !== 'پنج‌شنبه'"
                    @click="timePeriod = 'afternoon'"
                    :class="['px-4 py-2 rounded-lg font-medium transition-all', timePeriod === 'afternoon' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
                >
                  عصر
                </button>
              </div>

              <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
                <button
                    v-for="time in filteredTimes"
                    :key="time.value"
                    @click="selectedTime = time.value"
                    :disabled="!time.available"
                    :class="[
                    'p-3 rounded-xl text-center transition-all font-medium',
                    !time.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                      : selectedTime === time.value
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ time.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- درباره کلینیک (استایل کلینیک اعمال شد) -->
          <div id="about" ref="aboutSection" class="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-building-hospital text-teal-500"></i>
              درباره کلینیک
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">{{ clinic.about }}</p>

            <!-- تحصیلات و سوابق -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- تحصیلات -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <i class="ti ti-certificate text-teal-500"></i>
                  تحصیلات
                </h4>
                <ul v-if="clinic.education && clinic.education.length > 0" class="space-y-2 text-sm text-gray-600">
                  <li v-for="edu in clinic.education" :key="edu">• {{ edu }}</li>
                </ul>
                <p v-else class="text-sm text-gray-400 italic">تحصیلات ثبت نشده است.</p>
              </div>

              <!-- تخصص‌ها -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <i class="ti ti-medical-cross text-teal-500"></i>
                  تخصص‌ها
                </h4>
                <ul v-if="clinic.specialties && clinic.specialties.length > 0" class="space-y-2 text-sm text-gray-600">
                  <li v-for="spec in clinic.specialties" :key="spec">• {{ spec }}</li>
                </ul>
                <p v-else class="text-sm text-gray-400 italic">تخصصی ثبت نشده است.</p>
              </div>
            </div>
          </div>

          <!-- خدمات دکتر (استایل کلینیک اعمال شد) -->
          <div id="services" ref="servicesSection" class="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-medical-cross text-sky-500"></i>
              خدمات قابل ارائه
            </h2>

            <div v-if="clinic.availableServices && clinic.availableServices.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="service in clinic.availableServices" :key="service"
                   class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm">
                <i class="ti ti-check text-green-500"></i>
                <span>{{ service }}</span>
              </div>
            </div>

            <div v-else class="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p class="text-sm text-gray-400">هنوز خدماتی ثبت نشده است.</p>
            </div>
          </div>
          <!-- نقشه و آدرس (استایل کلینیک اعمال شد) -->
          <div id="location" class="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20">
            <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-map-pin text-teal-500"></i>
              موقعیت مکانی
            </h2>

            <!-- نقشه Leaflet -->
            <div class="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
              <div ref="mapContainer" class="w-full h-full"></div>
              <!-- مارکر مرکز -->
              <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none">
                <div class="flex flex-col items-center">
                  <i class="ti ti-map-pin-filled text-4xl text-red-500 drop-shadow-lg"></i>
                </div>
              </div>
              <!-- دکمه‌های زوم -->
              <div class="absolute top-3 left-3 z-[1000] flex flex-col gap-1">
                <button @click="zoomIn"
                        class="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
                  <i class="ti ti-plus text-gray-700"></i>
                </button>
                <button @click="zoomOut"
                        class="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
                  <i class="ti ti-minus text-gray-700"></i>
                </button>
              </div>
            </div>

            <!-- آدرس و ساعت کاری -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- آدرس -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <i class="ti ti-map-pin text-teal-500 text-xl mt-0.5"></i>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 mb-1">آدرس</p>
                  <p class="text-gray-600 text-sm">{{ clinic.address }}</p>
                  <a
                      :href="`https://maps.google.com/?q=${clinic.lat},${clinic.lng}`"
                      target="_blank"
                      class="text-teal-600 text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    <i class="ti ti-external-link"></i>
                    مسیریابی
                  </a>
                </div>
              </div>

              <!-- ساعات کاری -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <i class="ti ti-clock text-teal-500 text-xl mt-0.5"></i>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 mb-2">ساعات کاری</p>
                  <div class="space-y-1 text-sm">
                    <div v-for="schedule in clinic.workingHours" :key="schedule.day" class="flex justify-between">
                      <span class="text-gray-600">{{ schedule.day }}</span>
                      <span :class="schedule.hours === 'تعطیل' ? 'text-red-500' : 'text-gray-900'">{{
                          schedule.hours
                        }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- نظرات کاربران (استایل کلینیک اعمال شد) -->
          <div id="reviews" ref="reviewsSection" class="bg-white rounded-xl border border-gray-200 p-6 scroll-mt-20">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-message-circle text-teal-500"></i>
                نظرات کاربران
                <span class="text-sm font-normal text-gray-500">({{ reviews.length }} نظر)</span>
              </h2>
              <div class="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
                <i class="ti ti-star-filled text-amber-400"></i>
                <span class="font-bold text-amber-700">{{ clinic.rating }}</span>
              </div>
            </div>

            <!-- لیست نظرات -->
            <div class="space-y-4">
              <div v-for="review in paginatedReviews" :key="review.id"
                   class="bg-white rounded-xl border border-gray-200 p-5">
                <div class="flex items-start gap-3">
                  <div
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden relative"
                  >
                    <!-- اگر آواتار وجود داشت، عکس را نمایش بده -->
                    <img
                        v-if="review.avatar"
                        :src="review.avatar"
                        :alt="review.userName"
                        class="w-full h-full object-cover absolute inset-0"
                    >
                    <!-- اگر آواتار نبود، حرف اول نام را نمایش بده -->
                    <span v-else class="relative z-10">
                       {{ review.userName.charAt(0) }}
                     </span>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-bold text-gray-900">{{ review.userName }}</h3>
                    </div>

                    <!-- ستاره‌ها و تاریخ -->
                    <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                      <div class="flex items-center gap-1">
                        <i v-for="star in 5" :key="star" :class="[
                          'ti text-base',
                          star <= review.rating ? 'ti-star-filled text-amber-500' : 'ti-star text-gray-300'
                        ]"></i>
                      </div>
                      <span>•</span>
                      <span>{{ review.date }}</span>
                    </div>

                    <!-- متن نظر -->
                    <p class="text-gray-700 leading-relaxed mb-3">{{ review.comment }}</p>

                    <!-- پاسخ دکتر -->
                    <div v-if="review.doctorReply" class="bg-teal-50 rounded-lg p-4 mt-3">
                      <div class="flex items-start gap-2 mb-2">
                        <i class="ti ti-building-hospital text-teal-600"></i>
                        <span class="text-sm font-bold text-teal-900">پاسخ دکتر:</span>
                      </div>
                      <p class="text-sm text-gray-700 leading-relaxed">{{ review.doctorReply }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- دکمه نمایش بیشتر -->
            <div v-if="reviews.length > reviewsPerPage && !showAllReviews" class="mt-6 text-center">
              <button
                  @click="showAllReviews = true"
                  class="px-6 py-3 bg-teal-50 hover:bg-teal-100 text-teal-600 font-medium rounded-xl inline-flex items-center gap-2 transition-colors"
              >
                مشاهده همه نظرات
                <i class="ti ti-chevron-down"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- ستون کناری - خلاصه رزرو (استایل کلینیک اعمال شد) -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h3 class="font-bold text-gray-900 mb-4">خلاصه رزرو</h3>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">دکتر:</span>
                <span class="font-medium text-gray-900">{{ clinic.name }}</span>
              </div>

              <div v-if="selectedService" class="flex justify-between text-sm">
                <span class="text-gray-600">نوع خدمت:</span>
                <span class="font-medium text-gray-900">{{ selectedService.name }}</span>
              </div>

              <div v-if="selectedDate && !selectedService?.isInstant" class="flex justify-between text-sm">
                <span class="text-gray-600">تاریخ:</span>
                <span class="font-medium text-gray-900">{{ selectedDateDisplay }}</span>
              </div>

              <div v-if="selectedTime && !selectedService?.isInstant" class="flex justify-between text-sm">
                <span class="text-gray-600">ساعت:</span>
                <span class="font-medium text-gray-900">{{ selectedTime }}</span>
              </div>

              <div v-if="selectedService?.isInstant" class="bg-orange-50 rounded-lg p-3 text-sm text-orange-800">
                <i class="ti ti-bolt ml-2"></i>
                این خدمت فوری است و نیاز به انتخاب زمان ندارد
              </div>

              <div v-if="selectedService" class="flex justify-between text-sm border-t pt-3">
                <span class="text-gray-600">هزینه:</span>
                <span class="font-bold text-teal-600 text-lg">{{ selectedService.price }} تومان</span>
              </div>
            </div>

            <!-- بخش انتخاب روش پرداخت -->
            <div v-if="selectedService && selectedService.isInstant" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">انتخاب روش پرداخت</label>
              <div class="space-y-3">
                <!-- گزینه کیف پول -->
                <label
                    class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors"
                    :class="selectedPaymentMethod === 'wallet' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'"
                >
                  <div class="flex items-center">
                    <input
                        type="radio"
                        v-model="selectedPaymentMethod"
                        value="wallet"
                        class="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    >
                    <span class="mr-3 text-sm font-medium text-gray-900">پرداخت از کیف پول</span>
                  </div>
                  <div class="text-left">
                    <span class="block text-xs text-gray-500">موجودی</span>
                    <span class="text-sm font-bold text-gray-900">{{ walletBalance?.toLocaleString('fa-IR') }} تومان</span>
                  </div>
                </label>
                <!-- گزینه درگاه بانکی -->
                <label
                    class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                    :class="selectedPaymentMethod === 'gateway' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'"
                >
                  <input
                      type="radio"
                      v-model="selectedPaymentMethod"
                      value="gateway"
                      class="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  >
                  <span class="mr-3 text-sm font-medium text-gray-900">پرداخت آنلاین (درگاه بانکی)</span>
                </label>
              </div>
              <!-- پیام خطا در صورت کمبود موجودی کیف پول -->
              <div v-if="selectedPaymentMethod === 'wallet' && walletBalance < selectedService.price" class="mt-2 text-xs text-red-500 flex items-center">
                <i class="ti ti-alert-circle ml-1"></i>
                موجودی کیف پول کافی نیست. لطفاً از درگاه بانکی استفاده کنید.
              </div>
            </div>

            <button
                @click="proceedToPayment"
                :disabled="!canProceed || (selectedPaymentMethod === 'wallet' && walletBalance < selectedService.price)"
                class="w-full py-3 px-4 rounded-xl font-medium transition-colors bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <span v-if="selectedPaymentMethod === 'wallet'">پرداخت از کیف پول</span>
              <span v-else>{{ selectedService?.isInstant ? 'پرداخت و شروع' : 'ادامه و پرداخت ' }}</span>
            </button>

            <p class="text-xs text-gray-500 text-center mt-3">
              <i class="ti ti-lock ml-1"></i>
              برای پرداخت باید وارد حساب کاربری شوید
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- مدال ورود (استایل کلینیک اعمال شد) -->
    <Teleport to="body">
      <div v-if="showLoginModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 relative">
          <button @click="showLoginModal = false" class="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <i class="ti ti-x text-xl"></i>
          </button>

          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="ti ti-user-circle text-3xl text-teal-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">ورود به حساب کاربری</h3>
            <p class="text-gray-600 mt-2">برای ادامه و پرداخت باید وارد حساب کاربری خود شوید</p>
          </div>

          <div class="space-y-4">
            <NuxtLink
                :to="`/auth/login?redirect=/clinic/${route.params.id}`"
                class="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-login"></i>
              ورود به حساب
            </NuxtLink>
            <NuxtLink
                :to="`/auth/register?redirect=/clinic/${route.params.id}`"
                class="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <i class="ti ti-user-plus"></i>
              ثبت‌نام
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- مدال پرداخت فوری (استایل کلینیک اعمال شد) -->
    <Teleport to="body">
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button @click="showPaymentModal = false" class="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <i class="ti ti-x text-xl"></i>
          </button>

          <!-- هدر -->
          <div :class="[selectedService?.headerBg, 'rounded-xl p-4 text-white mb-6 -mx-2 -mt-2']">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i :class="['text-2xl', selectedService?.icon]"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold">{{ selectedService?.name }}</h3>
                <p class="text-white/80 text-sm">{{ selectedService?.description }}</p>
              </div>
            </div>
          </div>

          <!-- توضیحات مشکل -->
          <div class="space-y-4 mb-6">
            <h4 class="font-bold text-gray-900">توضیحات مشکل (اختیاری)</h4>
            <textarea
                v-model="problemDescription"
                rows="3"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none resize-none"
                placeholder="توضیح کوتاهی از مشکل حیوان خود بنویسید..."
            ></textarea>
          </div>

          <!-- خلاصه پرداخت -->
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">مبلغ قابل پرداخت</span>
              <span class="text-xl font-bold text-teal-600">{{ selectedService?.price }} تومان</span>
            </div>
          </div>

          <!-- اطلاعیه -->
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <i class="ti ti-info-circle text-emerald-500 text-xl mt-0.5"></i>
            <div class="text-sm text-emerald-800">
              <p class="font-bold mb-1">توجه:</p>
              <p v-if="selectedService?.id === 'text'">بعد از پرداخت به صفحه گفتگو با دکتر منتقل می‌شوید.</p>
              <p v-else-if="selectedService?.id === 'phone'">بعد از پرداخت، دکتر در اولین فرصت با شما تماس می‌گیرد.</p>
              <p v-else>پاسخ شما در کمتر از ۱۰ دقیقه ارسال می‌شود.</p>
            </div>
          </div>

          <!-- دکمه پرداخت -->
          <button
              @click="processPayment"
              :disabled="isProcessing"
              class="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="isProcessing" class="ti ti-loader animate-spin"></i>
            <i v-else class="ti ti-credit-card"></i>
            {{ isProcessing ? 'در حال پردازش...' : 'پرداخت و شروع' }}
          </button>
        </div>
      </div>
    </Teleport>

    <!-- مدال موفقیت (استایل کلینیک اعمال شد) -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div v-if="clinic && clinic.name" class="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-check text-4xl text-green-500"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">پرداخت موفق!</h3>
          <p class="text-gray-600 mb-2">کد رهگیری: <span class="font-bold text-teal-600 font-english">{{
              trackingCode
            }}</span></p>

          <!-- بخش انتقال به چت -->
          <div v-if="selectedService?.id === 'text'" class="my-6">
            <p class="text-sm text-gray-600 mb-4">در حال انتقال به صفحه گفتگو...</p>
            <div class="flex items-center justify-center gap-2 text-teal-600">
              <i class="ti ti-loader animate-spin"></i>
              <span>لطفاً صبر کنید...</span>
            </div>
          </div>
          <div v-else-if="selectedService?.id === 'phone-scheduled'" class="my-6">
            <p class="text-sm text-gray-600">دکتر در زمان انتخابی شما (<span
                class="font-bold text-teal-600">{{ getPhoneTimeDisplay() }}</span>) با شما تماس خواهد گرفت</p>
          </div>
          <div v-else class="my-6">
            <p class="text-sm text-gray-600">دکتر به زودی با شما تماس خواهد گرفت</p>
          </div>

          <div class="flex gap-3">
            <NuxtLink to="/panel/users/consultations"
                      class="flex-1 py-3 px-4 bg-teal-500 text-white rounded-xl font-medium">
              مشاوره‌های من
            </NuxtLink>
            <button @click="closeSuccessModal"
                    class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium">
              بستن
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- مدال انتخاب زمان تماس تلفنی (استایل کلینیک اعمال شد) -->
    <Teleport to="body">
      <div v-if="showPhoneTimeModal" class="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button @click="showPhoneTimeModal = false" class="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <i class="ti ti-x text-xl"></i>
          </button>

          <!-- هدر -->
          <div class="bg-teal-600 rounded-xl p-4 text-white mb-6 -mx-2 -mt-2">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i class="ti ti-calendar-time text-2xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold">انتخاب زمان تماس</h3>
                <p class="text-white/80 text-sm">چه زمانی با شما تماس بگیریم؟</p>
              </div>
            </div>
          </div>

          <!-- گزینه‌های زمان (داینامیک) -->
          <div class="space-y-3 mb-6">
            <!-- گزینه ۱۵ دقیقه -->
            <div
                v-if="clinic.rawPhoneSchedule?.min15?.enabled"
                @click="phoneCallOption = 'min15'"
                class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="phoneCallOption === 'min15' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   :class="phoneCallOption === 'min15' ? 'bg-teal-500 text-white' : 'bg-gray-100'">
                <i class="ti ti-clock text-xl"></i>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900">۱۵ دقیقه دیگر</p>
                <p class="text-sm text-gray-500">تماس سریع</p>
              </div>
              <div class="text-left">
                <p class="font-bold text-teal-600">{{ formatPrice(clinic.rawPhoneSchedule.min15.price) }}</p>
                <p class="text-xs text-gray-500">تومان</p>
              </div>
              <i v-if="phoneCallOption === 'min15'" class="ti ti-check text-teal-500 text-xl"></i>
            </div>

            <!-- گزینه ۳۰ دقیقه -->
            <div
                v-if="clinic.rawPhoneSchedule?.min30?.enabled"
                @click="phoneCallOption = 'min30'"
                class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="phoneCallOption === 'min30' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   :class="phoneCallOption === 'min30' ? 'bg-teal-500 text-white' : 'bg-gray-100'">
                <i class="ti ti-clock text-xl"></i>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900">۳۰ دقیقه دیگر</p>
                <p class="text-sm text-gray-500">نیم ساعت بعد</p>
              </div>
              <div class="text-left">
                <p class="font-bold text-teal-600">{{ formatPrice(clinic.rawPhoneSchedule.min30.price) }}</p>
                <p class="text-xs text-gray-500">تومان</p>
              </div>
              <i v-if="phoneCallOption === 'min30'" class="ti ti-check text-teal-500 text-xl"></i>
            </div>

            <!-- گزینه ۱ ساعت -->
            <div
                v-if="clinic.rawPhoneSchedule?.hour1?.enabled"
                @click="phoneCallOption = 'hour1'"
                class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="phoneCallOption === 'hour1' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   :class="phoneCallOption === 'hour1' ? 'bg-teal-500 text-white' : 'bg-gray-100'">
                <i class="ti ti-clock-hour-1 text-xl"></i>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900">۱ ساعت دیگر</p>
                <p class="text-sm text-gray-500">یک ساعت بعد</p>
              </div>
              <div class="text-left">
                <p class="font-bold text-teal-600">{{ formatPrice(clinic.rawPhoneSchedule.hour1.price) }}</p>
                <p class="text-xs text-gray-500">تومان</p>
              </div>
              <i v-if="phoneCallOption === 'hour1'" class="ti ti-check text-teal-500 text-xl"></i>
            </div>

            <!-- گزینه زمان دلخواه -->
            <div
                v-if="clinic.rawPhoneSchedule?.custom?.enabled"
                @click="phoneCallOption = 'custom'"
                class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="phoneCallOption === 'custom' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   :class="phoneCallOption === 'custom' ? 'bg-teal-500 text-white' : 'bg-gray-100'">
                <i class="ti ti-calendar text-xl"></i>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900">زمان دلخواه</p>
                <p class="text-sm text-gray-500">انتخاب تاریخ و ساعت</p>
              </div>
              <div class="text-left">
                <p class="font-bold text-teal-600">{{ formatPrice(clinic.rawPhoneSchedule.custom.price) }}</p>
                <p class="text-xs text-gray-500">تومان</p>
              </div>
              <i v-if="phoneCallOption === 'custom'" class="ti ti-check text-teal-500 text-xl"></i>
            </div>
          </div>

          <!-- خلاصه پرداخت -->
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">مبلغ قابل پرداخت</span>
              <span class="text-xl font-bold text-teal-600">{{ getPhoneCallPrice() }} تومان</span>
            </div>
          </div>

          <!-- دکمه تایید -->
          <button
              @click="confirmPhoneTime"
              :disabled="!phoneCallOption"
              class="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i class="ti ti-check"></i>
            تایید و ادامه
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Review Modal (استایل کلینیک اعمال شد) -->
    <Teleport to="body">
      <div v-if="showReviewModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           @click.self="showReviewModal = false">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">ثبت نظر برای {{ clinic.name }}</h3>
            <button @click="showReviewModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="ti ti-x text-xl text-gray-500"></i>
            </button>
          </div>

          <!-- Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">امتیاز شما</label>
            <div class="flex items-center gap-2">
              <button
                  v-for="star in 5"
                  :key="star"
                  @click="reviewForm.rating = star"
                  class="text-3xl transition-transform hover:scale-110"
              >
                <i :class="star <= reviewForm.rating ? 'ti ti-star-filled text-yellow-400' : 'ti ti-star text-gray-300'"></i>
              </button>
              <span class="text-sm text-gray-500 mr-2">{{
                  reviewForm.rating > 0 ? reviewForm.rating + ' از 5' : ''
                }}</span>
            </div>
          </div>

          <!-- Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">نام شما</label>
            <input
                v-model="reviewForm.name"
                type="text"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="نام خود را وارد کنید"
            />
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">شماره موبایل</label>
            <input
                v-model="reviewForm.phone"
                type="tel"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="09xxxxxxxxx"
                maxlength="11"
            />
          </div>

          <!-- Comment -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">نظر شما</label>
            <textarea
                v-model="reviewForm.comment"
                rows="4"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all resize-none"
                placeholder="نظر خود را درباره این کلینیک بنویسید..."
            ></textarea>
          </div>

          <!-- Submit -->
          <button
              @click="submitReview"
              :disabled="!reviewForm.rating || !reviewForm.name || !reviewForm.comment"
              class="w-full py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ثبت نظر
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Add Pet Modal -->
    <div
        v-if="showAddPetModal"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300"
    >
      <!-- Main Card -->
      <div
          class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >

        <!-- Header: Clean & Minimal -->
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="text-xl font-bold text-slate-800">حیوان جدید</h3>
            <p class="text-xs text-slate-500 mt-0.5">اطلاعات پایه را وارد کنید</p>
          </div>
          <button
              @click="showAddPetModal = false"
              class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">

          <!-- Profile Photo Upload -->
          <div class="flex flex-col items-center justify-center">
            <label class="relative group cursor-pointer block">
              <div
                  class="w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
                <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       @change="handleImageUpload">
                <img v-if="newPet.image" :src="newPet.image" class="w-full h-full object-cover">
                <div v-else class="text-slate-300 group-hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>
              <span
                  class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">تغییر عکس</span>
            </label>
          </div>

          <!-- Basic Info Grid -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Name -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">نام حیوان</label>
              <input
                  v-model="newPet.name"
                  type="text"
                  placeholder="مثلا: پلدی"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              >
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">نوع حیوان</label>
              <div class="relative">
                <select v-model="newPet.type"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none">
                  <option value="" disabled>انتخاب کنید</option>
                  <option value="DOG">سگ 🐶</option>
                  <option value="CAT">گربه 🐱</option>
                  <option value="BIRD">پرنده 🐦</option>
                  <option value="OTHER">سایر</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Breed -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">نژاد</label>
              <input
                  v-model="newPet.breed"
                  type="text"
                  placeholder="مثلا: سیمینتار"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              >
            </div>

            <!-- Gender (Pill Style) -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">جنسیت</label>
              <div class="flex p-1 bg-slate-100 rounded-xl">
                <label class="flex-1 cursor-pointer">
                  <input type="radio" v-model="newPet.gender" value="MALE" class="peer sr-only">
                  <div
                      class="text-center py-2.5 rounded-lg text-sm font-medium text-slate-500 peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                    نر
                  </div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" v-model="newPet.gender" value="FEMALE" class="peer sr-only">
                  <div
                      class="text-center py-2.5 rounded-lg text-sm font-medium text-slate-500 peer-checked:bg-white peer-checked:text-pink-500 peer-checked:shadow-sm transition-all">
                    ماده
                  </div>
                </label>
              </div>
            </div>

            <!-- Age -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">سن (سال)</label>
              <input
                  v-model="newPet.age"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              >
            </div>

            <!-- Weight -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">وزن (کیلو)</label>
              <input
                  v-model="newPet.weight"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              >
            </div>

            <!-- Color -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">رنگ</label>
              <input
                  v-model="newPet.color"
                  type="text"
                  placeholder="مثلا: مشکی"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              >
            </div>

            <!-- Microchip -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">میکروچیپ</label>
              <input
                  v-model="newPet.microchip"
                  type="text"
                  placeholder="کد یکتا"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              >
            </div>
          </div>

          <!-- Neutered Checkbox (Clean Style) -->
          <div class="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
               @click="newPet.isNeutered = !newPet.isNeutered">
            <div class="relative flex items-center">
              <input
                  type="checkbox"
                  v-model="newPet.isNeutered"
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 checked:bg-blue-600 checked:border-transparent transition-all"
              >
              <svg
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  viewBox="0 0 14 14" fill="none">
                <path d="M3 8L6 11L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <label class="mr-3 text-sm font-medium text-slate-700 cursor-pointer select-none">عقیم‌سازی شده است</label>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">توضیحات تکمیلی</label>
            <textarea
                v-model="newPet.description"
                rows="3"
                placeholder="بیماری خاص، خوراکی‌های حساس و..."
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none placeholder:text-slate-400"
            ></textarea>
          </div>

        </div>

        <!-- Footer: Sticky Bottom -->
        <div class="p-5 bg-white border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
          <button
              type="button"
              @click="showAddPetModal = false"
              class="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            انصراف
          </button>
          <button
              type="submit"
              @click="handleAddPet"
              class="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <span>ثبت نهایی</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useTenantStore} from "~/stores/tenant.store";
import {usePaymentStore} from "~/stores/payment";
import {usePetStore} from "~/stores/pet.store";
import {useWalletStore} from "~/stores/wallet.store";
import {useReviewStore} from "~/stores/reviews.store";
import { useAppointmentStore} from "~/stores/appointment.store";
import {useSocketStore} from "~/stores/socket";
import {ref,onMounted,watch} from "vue";
import {computed} from "vue";
import {useNuxtApp} from "#app";
import {useUrlHelper} from "~/composables/useUrlHelper";
import {useUploader} from "~/composables/useUploader";
const uploader = useUploader()
const appointmentStore = useAppointmentStore();
const { resolveUrl } = useUrlHelper();
const reviewStore=useReviewStore()
const socketStore=useSocketStore()
const petStore=usePetStore()
const showAddPetModal = ref(false)
const newPet = ref({
  name: '',
  type: 'DOG',
  age: '',
  breed: '',
  gender: '', // 'MALE' یا 'FEMALE'
  weight: '',
  color: '',
  microchip: '',
  isNeutered: false,
  description: '',
  image: null // برای ذخیره URL یا Base64 تصویر
})
const getPetTypeLabel = (type: string) => {
  const types: any = { 'DOG': 'سگ', 'CAT': 'گربه', 'BIRD': 'پرنده', 'OTHER': 'سایر' }
  return types[type] || type
}
const {$toast} = useNuxtApp()
const openAddPetModal = () => { showAddPetModal.value = true }
/*const handleAddPet = async () => {
  await petStore.createPet(newPet.value)
  showAddPetModal.value = false
  if (petStore.pets.length > 0) selectedPetId.value = petStore.pets[petStore.pets.length - 1].id
}*/
const handleAddPet = async () => {

  const newPetLogoUrl = await uploader.uploadImage(newPet.value.image)
  // ساخت FormData برای ارسال تصویر و اطلاعات
  const payload = {
    name: newPet.value.name,
    type: newPet.value.type,
    age: String(newPet.value.age),
    breed: newPet.value.breed,
    gender: newPet.value.gender,
    weight: String(newPet.value.weight),
    color: newPet.value.color,
    microchip: newPet.value.microchip,
    isNeutered: String(newPet.value.isNeutered),
    description: newPet.value.description,
    logo: newPetLogoUrl
  }

  try {

    await petStore.createPet(payload)

    showAddPetModal.value = false
    // ریست کردن فرم
    newPet.value = {name: '', type: 'DOG', age: '', breed: '', gender: '', weight: '', color: '', microchip: '', isNeutered: false, description: '', image: null}

    if (petStore.pets.length > 0) {
      selectedPetId.value = petStore.pets[petStore.pets.length - 1].id
    }
  } catch (error) {
    console.error("Error adding pet:", error)
    $toast("خطا در افزودن حیوان", "error", 5000)
  }
}
const paymentStore = usePaymentStore()
const walletStore=useWalletStore()
const walletBalance = computed(() => {
  // اطمینان از اینکه مقدار عددی است، نه null یا string
  const bal = walletStore.wallet?.balance;
  return bal ? Number(bal) : 0;
});
const tenantStore = useTenantStore()
const route = useRoute()
const router = useRouter()

// Refs for sections
const aboutSection = ref<HTMLElement | null>(null)
const servicesSection = ref<HTMLElement | null>(null)
const reviewsSection = ref<HTMLElement | null>(null)

// Map refs
const mapContainer = ref<HTMLDivElement | null>(null)
let map: any = null
let L: any = null

// State
const selectedService = ref<any>(null)
const selectedDate = ref<any>(null)
const selectedTime = ref('')
const timePeriod = ref('morning')
const showLoginModal = ref(false)
const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const showPhoneTimeModal = ref(false)
const isProcessing = ref(false)
const trackingCode = ref('')
const problemDescription = ref('')
const activeTab = ref('about')
const showAllReviews = ref(false)
const reviewsPerPage = 5

// انتخاب زمان تماس تلفنی
const phoneCallOption = ref('') // 'now', '15min', '30min', '1hour', 'custom'
const phoneCallDate = ref('')
const phoneCallTime = ref('')

// فرض کنید این از استور یا کوکی میاد
const isLoggedIn = ref(false)

// Review Modal
const showReviewModal = ref(false)
const reviewForm = ref({
  rating: 0,
  name: '',
  phone: '',
  comment: ''
})

// تب‌ها
const tabs = [
  {id: 'about', name: 'درباره کلینیک', icon: 'ti ti-user'},
  {id: 'services', name: 'خدمات', icon: 'ti ti-medical-cross'},
  {id: 'reviews', name: 'نظرات کاربران', icon: 'ti ti-message-circle'}
]
const settings = computed(() => clinic.settings)

const reviews = computed(() => {
  // دریافت لیست نظرات از استور
  const rawReviews = reviewStore.reviews || [];

  return rawReviews.map((review: any) => {
    // استخراج نام کاربر از آبجکت user
    const userName = review.user?.fullName || review.user?.firstName || 'کاربر ناشناس';

    // تبدیل تاریخ میلادی به تاریخ نسبی (مثلاً 3 روز پیش) یا تاریخ شمسی ساده
    // اینجا از یک فرمت ساده تاریخ شمسی استفاده می‌کنیم.
    // اگر کتابخانه moment-jalaali یا date-fns-jalali دارید می‌توانید بهتر کنید.
    const dateStr = new Date(review.createdAt).toLocaleDateString('fa-IR');

    return {
      id: review.id,
      userName: userName,
      rating: review.rating || 0, // امتیاز ستاره‌ای
      date: dateStr, // تاریخ ثبت نظر
      comment: review.comment || '', // متن نظر
      doctorReply: review.reply || null, // پاسخ دکتر
      // اطلاعات اضافی در صورت نیاز در قالب:
      avatar: review.user?.avatar || null,
      pros: review.pros,
      cons: review.cons
    };
  });
});
const overallRating = computed(() => {
  if (reviews.value.length === 0) return '0.0';
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0);
  return (sum / reviews.value.length).toFixed(1);
});

const paginatedReviews = computed(() => {
  if (showAllReviews.value) return reviews.value
  return reviews.value.slice(0, reviewsPerPage)
})

// تبدیل میلادی به شمسی
const toJalali = (gy: number, gm: number, gd: number) => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let jy = (gy <= 1600) ? 0 : 979
  gy -= (gy <= 1600) ? 621 : 1600
  const gy2 = (gm > 2) ? (gy + 1) : gy
  let days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1]
  jy += 33 * (Math.floor(days / 12053))
  days %= 12053
  jy += 4 * (Math.floor(days / 1461))
  days %= 1461
  jy += Math.floor((days - 1) / 365)
  if (days > 365) days = (days - 1) % 365
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30)
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30))
  return {year: jy, month: jm, day: jd}
}

const jalaliMonthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
const persianDayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه']
const persianDayNamesShort = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شنبه']

// --- تابع کمکی برای تبدیل زمان به دقیقه ---
const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}
// این تابع مشخص می‌کند آیا یک ساعت در یک تاریخ خاص آزاد است یا خیر
const checkSlotAvailability = (time: string, dateStr: string) => {
  const timeInMinutes = timeToMinutes(time)

  // ۱. بررسی زمان‌های استراحت (Time Off Blocks)
  const isTimeOff = appointmentStore.timeOffBlocks.some(block => {
    const blockDate = block.date.replace(/-/g, '/')
    if (blockDate !== dateStr) return false

    const startM = timeToMinutes(block.startTime)
    const endM = timeToMinutes(block.endTime)

    return timeInMinutes >= startM && timeInMinutes < endM
  })

  if (isTimeOff) return { available: false, reason: 'time-off' }

  // ۲. بررسی نوبت‌های رزرو شده (Appointments)
  const isBooked = appointmentStore.timeAppointments.some(apt => {
    // دسترسی به تاریخ و زمان از داخل metadata
    // نکته: از اختیاری chaining (?.) استفاده می‌کنیم تا اگر order یا metadata خالی بود خطا ندهد
    const reservedDate = apt.order?.payment?.metadata?.reservedTime?.date
    const reservedTime = apt.order?.payment?.metadata?.reservedTime?.time

    // اگر داده‌ای موجود نبود، نادیده بگیر
    if (!reservedDate || !reservedTime) return false

    // نرمال‌سازی تاریخ (تبدیل - به /) و مقایسه
    const aptDate = reservedDate.replace(/-/g, '/')

    return aptDate === dateStr && reservedTime === time && apt.status !== 'cancelled'
  })

  if (isBooked) return { available: false, reason: 'booked' }

  return { available: true, reason: null }
}
// تاریخ‌های در دسترس (۷ روز آینده)
const availableDates = computed(() => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const jalali = toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())
    const dayOfWeek = date.getDay()
    const isFriday = dayOfWeek === 5

    const dateStr = `${jalali.year}/${jalali.month}/${jalali.day}`

    dates.push({
      gregorianDate: new Date(date),
      jalaliYear: jalali.year,
      jalaliMonth: jalali.month,
      jalaliDay: jalali.day,
      dayName: persianDayNamesShort[dayOfWeek],
      dayNameFull: persianDayNames[dayOfWeek],
      monthName: jalaliMonthNames[jalali.month - 1],
      fullDate: dateStr,
      isFriday,
      isToday: i === 0,
      hasSlots: !isFriday
    })
  }
  return dates
})

// لیست تمام ساعات کاری (پایه)
const allTimes = computed(() => {
  const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
  const afternoonTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']

  return {
    morning: morningTimes.map(t => ({ value: t, label: t })),
    afternoon: afternoonTimes.map(t => ({ value: t, label: t }))
  }
})

// فیلتر کردن نهایی ساعات بر اساس تاریخ انتخاب شده
const filteredTimes = computed(() => {
  if (!selectedDate.value) return []

  // اگر جمعه است، فقط صبح (یا طبق قوانین کلینیک خالی)
  if (selectedDate.value?.dayNameFull === 'جمعه') {
    return allTimes.value.morning
  }

  const baseTimes = allTimes.value[timePeriod.value as keyof typeof allTimes.value] || []
  const dateStr = selectedDate.value.fullDate

  // استفاده از تابع کمکی برای تمیزی کد
  return baseTimes.map(slot => {
    const status = checkSlotAvailability(slot.value, dateStr)

    return {
      ...slot,
      available: status.available,
      reason: status.reason
    }
  })
})

const selectedDateDisplay = computed(() => {
  if (!selectedDate.value) return ''
  return `${selectedDate.value.dayNameFull} ${selectedDate.value.jalaliDay} ${selectedDate.value.monthName} ${selectedDate.value.jalaliYear}`
})

// آیا میتونه ادامه بده
const canProceed = computed(() => {
  if (!selectedService.value) return false
  if (selectedService.value.isInstant) return true
  return selectedDate.value && selectedTime.value
})
const clinicId = computed(() => String(route.params.id))
// --- اطلاعات دکتر (تبدیل شده به فرمت نمونه) ---
// --- استخراج اطلاعات از استور و تنظیمات ---
const clinic = computed(() => {
  // پیدا کردن کلینیک در لیست کلینیکان استور بر اساس ID از URL
  const clinicData = tenantStore.clinics.find((c: any) => c.id === route.params.id);

  // اگر دکتر پیدا نشد، یک آبجکت خالی برگردان تا ارور ندهد
  if (!clinicData) return {};

  // استخراج تنظیمات (tenantSettings)
  const settings = clinicData.tenantSettings || [];

  // استخراج خدمات (tenantServices)
  const services = clinicData.tenantServices || [];

  // پیدا کردن تنظیمات قیمت ویزیت
  const clinicInfoSetting = settings.find((s: any) => s.key === 'clinic_info');
  const clinicInfo = clinicInfoSetting?.value || {};

  // پیدا کردن تنظیمات قیمت ویزیت
  const visitPricingSetting = settings.find((s: any) => s.key === 'visit_pricing');
  const visitPricing = visitPricingSetting?.value || {};

  // پیدا کردن تنظیمات زمان‌بندی تماس تلفنی
  const phoneScheduleSetting = settings.find((s: any) => s.key === 'phone_schedule');
  const phoneSchedule = phoneScheduleSetting?.value?.options || {};

  // استخراج مختصات (با مقادیر پیش‌فرض در صورت نبودن)
  const lat = clinicData.tenantAddress.location?.lat || 35.7155;
  const lng = clinicData.tenantAddress.location?.lng || 51.4085;

  const servicesMap = {};
  services.forEach((srv: any) => {
    if (srv.status === 'active') { // فقط خدمات فعال را نمایش بده
      servicesMap[srv.name] = {
        id: srv.id,
        price: srv.price,
        description: srv.description,
        name: srv.name
      };
    }
  });

  return {
    id: clinicData.id,
    //logo:clinicInfo.logo,
    logo:resolveUrl(clinicInfo.logo) ,
    name: clinicData.name||clinicData.ownerName || 'نامشخص',
    avatar: clinicData.ownerName ? clinicData.ownerName.charAt(0) : '؟',
    specialty: clinicData.specialty || 'کلینیک دامپزشکی',
    specialties:clinicInfo.specialties,
    education:clinicInfo.education,
    availableServices: services
        .filter((s: any) => s.status === 'active')
        .map((s: any) => s.description || s.name),
    city: clinicData.city,
    address: [
      clinicData.tenantAddress?.detailedAddress?.road,
      clinicData.tenantAddress?.detailedAddress?.neighbourhood,
      clinicData.tenantAddress?.detailedAddress?.suburb
    ]
        .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
        .join('. '),
    lat: lat,
    lng: lng,
    experience: clinicInfo.experience || 0,
    rating: parseFloat(clinicData.rating) || 0,
    reviewCount: clinicData.reviewsCount || 0,
    isOnline: tenantStore.calculateOnlineStatus(clinicData.id,socketStore.onlineUsers)||clinicData.isOnline,
    isSuspended: clinicData.isSuspended, // وضعیت تعلیق

    // توضیحات از تنظیمات کلینیک
    about: clinicInfo?.description || 'توضیحات ثبت نشده است.',

    // داده‌های خام برای ساخت لیست خدمات
    rawVisitPricing: visitPricing,
    rawPhoneSchedule: phoneSchedule,

    workingHours: [
      {day: 'شنبه تا چهارشنبه', hours: '9:00 - 18:00'},
      {day: 'پنج‌شنبه', hours: '9:00 - 13:00'},
      {day: 'جمعه', hours: 'تعطیل'}
    ]
  };
});
// --- Helper: فرمت کردن قیمت (سه رقم سه رقم) ---
const formatPrice = (price: string | number) => {
  return new Intl.NumberFormat('fa-IR').format(Number(price));
};
// --- ساخت لیست خدمات پویا بر اساس داده‌های API ---
const services = computed(() => {
  if (!clinic.value.rawVisitPricing) return [];

  const vp = clinic.value.rawVisitPricing;
  const ps = clinic.value.rawPhoneSchedule;
  const serviceList: any[] = [];

  // 1. ویزیت حضوری
  if (vp.inPerson?.enabled) {
    serviceList.push({
      id: 'in-person',
      name: 'ویزیت حضوری',
      description: 'مراجعه به کلینیک',
      price: formatPrice(vp.inPerson.price),
      rawPrice: vp.inPerson.price, // برای محاسبات بعدی
      icon: 'ti ti-building-hospital',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      iconColorActive: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-500',
      textColorActive: 'text-white',
      priceColor: 'text-emerald-600',
      headerBg: 'bg-emerald-600',
      isInstant: false,
      needsTimeSelection: false
    });
  }

  // 2. ویزیت در منزل
  if (vp.home?.enabled) {
    serviceList.push({
      id: 'home',
      name: 'ویزیت در منزل',
      description: 'دکتر به منزل می‌آید',
      price: formatPrice(vp.home.price),
      rawPrice: vp.home.price,
      icon: 'ti ti-home-heart',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      iconColorActive: 'text-amber-600',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-500',
      textColorActive: 'text-white',
      priceColor: 'text-amber-600',
      headerBg: 'bg-amber-600',
      isInstant: false,
      needsTimeSelection: false
    });
  }

  // 3. گفتگوی آنلاین (چت)
  if (vp.chat?.enabled) {
    serviceList.push({
      id: 'text',
      name: 'گفتگوی آنلاین',
      description: 'چت با دکتر',
      price: formatPrice(vp.chat.price),
      rawPrice: vp.chat.price,
      icon: 'ti ti-message-circle',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconColorActive: 'text-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500',
      textColorActive: 'text-white',
      priceColor: 'text-blue-600',
      headerBg: 'bg-blue-600',
      isInstant: true,
      needsTimeSelection: false
    });
  }

  // 4. تماس تلفنی فوری
  if (vp.phoneInstant?.enabled) {
    serviceList.push({
      id: 'phone-instant',
      name: 'تماس تلفنی فوری',
      description: 'تماس همین الان',
      price: formatPrice(vp.phoneInstant.price),
      rawPrice: vp.phoneInstant.price,
      icon: 'ti ti-phone-call',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      iconColorActive: 'text-orange-600',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-500',
      textColorActive: 'text-white',
      priceColor: 'text-orange-600',
      headerBg: 'bg-orange-600',
      isInstant: true,
      needsTimeSelection: false
    });
  }

  // 5. تماس در زمان دلخواه (زمان‌بندی شده)
  // چک می‌کنیم که آیا اصلا تنظیمات زمان‌بندی وجود دارد و فعال است یا خیر
  const hasPhoneSchedule = ps && Object.keys(ps).length > 0;
  if (hasPhoneSchedule) {
    serviceList.push({
      id: 'phone-scheduled',
      name: 'تماس در زمان دلخواه',
      description: 'انتخاب زمان تماس',
      price: 0, // چون بسته به انتخاب زمان تغییر میکند
      rawPrice: 0,
      icon: 'ti ti-calendar-time',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      iconColorActive: 'text-purple-600',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-500',
      textColorActive: 'text-white',
      priceColor: 'text-purple-600',
      headerBg: 'bg-purple-600',
      isInstant: true,
      needsTimeSelection: true // نیاز به باز شدن مدال زمان دارد
    });
  }

  return serviceList;
});


// اسکرول به بخش مورد نظر
const scrollToSection = (sectionId: string) => {
  activeTab.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start'})
  }
}

// تشخیص بخش فعال بر اساس اسکرول
const handleScroll = () => {
  const sections = ['about', 'services', 'reviews']
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeTab.value = sectionId
        break
      }
    }
  }
}

// متدها
const selectService = (service: any) => {
  selectedService.value = service
  selectedDate.value = null
  selectedTime.value = ''
  timePeriod.value = 'morning'

  // اگر تماس در زمان دلخواه بود، مدال انتخاب زمان باز شود
  if (service.needsTimeSelection) {
    phoneCallOption.value = ''
    phoneCallDate.value = ''
    phoneCallTime.value = ''
    showPhoneTimeModal.value = true
  }

  if (service.id === 'phone-scheduled') {
    phoneCallOption.value = ''
    phoneCallDate.value = ''
    phoneCallTime.value = ''
    showPhoneTimeModal.value = true
  }
}

const confirmPhoneTime = () => {
  if (!phoneCallOption.value) return
  showPhoneTimeModal.value = false
  services.value.map((s) => {
    if (s.id === 'phone-scheduled') {
      s.price = getPhoneCallPrice()
    }
  })

  // ادامه به پرداخت
  showPaymentModal.value = false
}


const getPhoneTimeDisplay = () => {
  if (!phoneCallOption.value) return '';
  const ps = clinic.value.rawPhoneSchedule;
  if (phoneCallOption.value === 'min15' && ps?.min15) return `۱۵ دقیقه دیگر (${formatPrice(ps.min15.price)} تومان)`;
  if (phoneCallOption.value === 'min30' && ps?.min30) return `۳۰ دقیقه دیگر (${formatPrice(ps.min30.price)} تومان)`;
  if (phoneCallOption.value === 'hour1' && ps?.hour1) return `۱ ساعت دیگر (${formatPrice(ps.hour1.price)} تومان)`;
  if (phoneCallOption.value === 'custom' && ps?.custom) return `زمان دلخواه (${formatPrice(ps.custom.price)} تومان)`;
  return '';
};

const getPhoneCallPrice = () => {
  const ps = clinic.value.rawPhoneSchedule;
  if (phoneCallOption.value === 'min15' && ps?.min15) return formatPrice(ps.min15.price);
  if (phoneCallOption.value === 'min30' && ps?.min30) return formatPrice(ps.min30.price);
  if (phoneCallOption.value === 'hour1' && ps?.hour1) return formatPrice(ps.hour1.price);
  if (phoneCallOption.value === 'custom' && ps?.custom) return formatPrice(ps.custom.price);
  return '---';
};

const selectDate = (date: any) => {
  if (date.isFriday || !date.hasSlots) return
  selectedDate.value = date
  selectedTime.value = ''
  timePeriod.value = 'morning'
}

const proceedToPayment = () => {
  // TODO: فعلاً برای تست کامنت شده - بعداً فعال شود
  // if (!isLoggedIn.value) {
  //   showLoginModal.value = true
  //   return
  // }

  if (selectedService.value?.isInstant) {
    // اگر تماس زمان‌دار است و هنوز زمانی انتخاب نشده، مدال را باز کن
    if (selectedService.value.id === 'phone-scheduled' && !phoneCallOption.value) {
      showPhoneTimeModal.value = true
    } else {
      // در غیر این صورت (چت، تماس فوری، یا تماس زمان‌دار با زمان انتخاب شده) برو به پرداخت
      showPaymentModal.value = true
    }
  } else {

    router.push({
      path: '/checkout',
      query: {
        clinic: String(clinic.value.id),
        service: selectedService.value?.id,
        date: selectedDate.value?.fullDate,
        time: selectedTime.value
      }
    })
  }
}

/*const processPayment = async () => {
  isProcessing.value = true
  await new Promise(r => setTimeout(r, 2000))

  trackingCode.value = `PT-${Date.now().toString().slice(-8)}`
  isProcessing.value = false
  showPaymentModal.value = false
  showSuccessModal.value = true

  if (selectedService.value?.id === 'text') {
    setTimeout(() => {
      router.push(`/panel/users/consultations/${trackingCode.value}`)
    }, 3000)
  }
}*/

const selectedPetId = ref<string | null>(null)
const selectedPaymentMethod = ref<'online' | 'wallet'>('online')
const processPayment = async () => {

  isProcessing.value = true;
  let amount;
  try {
    // --- 1. بررسی موجودی کیف پول (اگر روش پرداخت کیف پول باشد) ---
    if (selectedPaymentMethod.value === 'wallet') {
      if (!wallet.value || Number(wallet.value.balance) < Number(totalPrice.value)) {
        alert('موجودی کیف پول شما برای پرداخت این نوبت کافی نیست. لطفاً موجودی خود را افزایش دهید.');
        // هدایت به صفحه کیف پول
        await router.push({path: '/profile', query: {tab: 'wallet'}});
        return;
      }
    }

    // --- 2. آماده‌سازی داده‌های ارسال به بک‌اند (SubmitOrderDto) ---

    // استخراج تاریخ و ساعت انتخاب شده
    const dateObj = selectedDate.value; // آبجکت تاریخ کامل
    const timeStr = selectedTime.value; // رشته ساعت (مثلا "14:30")

    // تعیین شناسه آدرس (فقط برای ویزیت در منزل)
    let addressId = null;
    if (selectedService.value?.id === 'home') {
      // فرض بر این است که selectedAddress در کامپوننت تعریف شده است
      addressId = selectedAddress.value?.id || null;

      if (!addressId) {
        alert('لطفاً برای ویزیت در منزل، آدرس خود را انتخاب کنید.');
        return;
      }
    }

    // ساخت آبجکت reservedTime طبق DTO جدید
    const reservedTimeObj = {
      date: dateObj ? dateObj.fullDate : '', // فرمت "1403/02/15"
      time: timeStr,
      // اگر سرویس تلفنی زمان‌دار باشد، اینجا می‌توان گزینه خاص (مثل min15) را هم اضافه کرد
      // option: phoneCallOption.value
    };

    if(selectedService.value.id === 'phone-scheduled'){
      const priceString = selectedService.value.price
          .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)) // تبدیل اعداد فارسی به انگلیسی
          .replace(/[^0-9]/g, ''); // حذف کاما و هر چیزی به جز عدد

      amount = Number(priceString);
    }else{
      amount=Number(selectedService.value?.rawPrice)
    }

    const orderPayload = {
      tenantId: clinic.value.id, // شناسه کلینیک
      serviceType: selectedService.value?.id, // مثلا: 'in-person', 'home', 'text'
      addressId: addressId,
      addressDetails:undefined,
      petId:selectedPetId.value,
      clinic:undefined,//TODO:check clinic,
      reservedTime: reservedTimeObj,
      phoneCallOption:phoneCallOption.value,
      notes: problemDescription.value, // شرح مشکل حیوان
      paymentMethod: selectedPaymentMethod.value === 'gateway' ? 'online' : selectedPaymentMethod.value,// 'online' یا 'wallet'
      amount: amount || 0 // مبلغ خام (عددی)
    };

    // --- 3. ارسال درخواست به سرویس ---
    const response = await paymentStore.submitClinicOrder(orderPayload);

    if (response.status === 'QUEUED') {
      // ─── ورود به صف بعد از پرداخت ───
      vetStore.startQueueMonitoring(vetId.value, {
        orderId: response.orderId,
        queueNumber: response.queueNumber || response.queuePosition || 0,
        queuePosition: response.queuePosition || response.queueNumber || 0,
        estimatedWaitMinutes: response.estimatedWait || 0,
      });

      showPaymentModal.value = false

      return

    }

    // --- 4. بررسی پاسخ و هندل کردن سناریوها ---

    // سناریو الف: پرداخت با کیف پول موفق (بک‌اند path برمی‌گرداند)
    if (response.actionType === 'ORDER_COMPLETED' || response.data?.appointment) {
      showPaymentModal.value = false;
      const result = response.data || response;
      // اگر سرویس متنی (چت) بود، بعد از مدتی به صفحه چت هدایت کن
      if (result.appointment?.type === 'online') {
        const query=ref(null)
        setTimeout(() => {
          query.value= {
            serviceType: response.data?.serviceType,
            trackingCode: response.data?.trackingCode,
            doctor: response.data?.doctor,
            specialty: response.data?.specialty,
            consultationId: response.data?.consultationId,
            status: response.data?.status,
          }
          handleRedirectToChat(query.value)
        }, 3000);
      }else{
        trackingCode.value = result.trackingCode || 'N/A';
        showSuccessModal.value = true;

      }
      return;
    }

    // سناریو ب: پرداخت آنلاین (بک‌اند requiresAction برمی‌گرداند)
    if (response.requiresAction && response.actionType === 'ONLINE_PAYMENT_REDIRECT') {
      const {orderId, amount, tenantId} = response.data;

      // ارسال درخواست دوم برای دریافت لینک درگاه بانکی
      const gatewayResponse = await paymentStore.initiateClinicOnlinePayment({
        orderId: orderId,
        amount: amount,
        tenantId: tenantId,
        meta: {
          description: `پرداخت نوبت کلینیک ${vet.value.name}`
        }
      });

      // هدایت کاربر به درگاه بانکی
      if (gatewayResponse.paymentUrl) {
        $toast('هدایت به درگاه بانکی', 'success', 5000);
        window.location.href = gatewayResponse.paymentUrl;
      } else {
        //alert('خطا در دریافت لینک درگاه بانکی');
        $toast('خطا در دریافت لینک درگاه بانکی', 'error', 5000)
      }
    } else {
      //alert('خطایی در ثبت نوبت رخ داده است.');
      $toast('خطایی در ثبت نوبت رخ داده است.', 'error', 5000)
    }

  } catch (error) {
    console.error('Error processing vet payment:', error);
    // نمایش خطای دقیق از سرور اگر وجود داشته باشد
    const errorMessage = error.response?.data?.message || 'خطا در برقراری ارتباط با سرور. لطفاً مجددا تلاش کنید.';
    //alert(errorMessage);
    $toast(errorMessage, 'error', 5000)

  } finally {
    isProcessing.value = false;
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
}

const resetForm = () => {
  selectedService.value = services.value[0] // برگشت به پیش‌فرض ویزیت حضوری
  selectedDate.value = null
  selectedTime.value = ''
  problemDescription.value = ''
}

// Load Leaflet from CDN
const loadLeaflet = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).L) {
      L = (window as any).L
      resolve()
      return
    }

    // Load CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(css)
    }

    // Load JS
    if (!document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => {
        L = (window as any).L
        resolve()
      }
      document.head.appendChild(script)
    } else {
      L = (window as any).L
      resolve()
    }
  })
}

const initMap = async () => {
  if (!mapContainer.value || map) return

  await loadLeaflet()
  if (!L) return

  map = L.map(mapContainer.value, {
    center: [clinic.value.lat, clinic.value.lng],
    zoom: 16,
    zoomControl: false,
    scrollWheelZoom: false
  })

  // Use OpenStreetMap tiles (works in Iran)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)
}

const destroyMap = () => {
  if (map) {
    map.remove()
    map = null
  }
}

const zoomIn = () => {
  if (map) map.zoomIn()
}

const zoomOut = () => {
  if (map) map.zoomOut()
}

// این بخش را قبل از onMounted اضافه کنید
const foundService = computed(() => {
  if (!services.value || services.value.length === 0) return null;
  const serviceType = String(route.query.serviceType || '');
  return services.value.find(s => s.id === serviceType);
});

// واچر برای نظارت بر لود شدن سرویس‌ها و ست کردن آن‌ها
watch([services, () => route.query.serviceType], ([newServices]) => {
  // اگر سرویس‌ها لود شده‌اند و هنوز سرویسی انتخاب نشده (یا سرویس پیش‌فرض است)
  if (newServices && newServices.length > 0) {
    const serviceType = String(route.query.serviceType || '');

    // اگر در URL پارامتر serviceType وجود دارد، آن را پیدا کن
    if (serviceType) {
      const targetService = newServices.find((s: any) => s.id === serviceType);
      if (targetService) {
        selectedService.value = targetService;
      }
    }
    // اگر پارامتری نیست و سرویسی انتخاب نشده، اولین سرویس را پیش‌فرض بگیر
    else if (!selectedService.value) {
      selectedService.value = newServices[0];
    }
  }
}, { immediate: true }); // immediate: true باعث می‌شود بلافاصله بعد از لود کامپوننت هم چک شود
// پیش‌فرض ویزیت حضوری
onMounted(async () => {
  await appointmentStore.fetchTenantAppointments(String(route.params.id))
  await appointmentStore.fetchTimeOffBlocks(String(route.params.id))
  await reviewStore.fetchTenantReviews(String(route.params.id))
  window.addEventListener('scroll', handleScroll)

  // Initialize map after a small delay
  setTimeout(() => {
    initMap()
  }, 100)

  // فقط ست کردن مدال موفقیت و کد رهگیری
  if (route.query.trackingCode) {
    trackingCode.value = String(route.query.trackingCode);
    showSuccessModal.value = true;
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  destroyMap()
})

// Share clinic profile
const shareClinic = async () => {
  const shareData = {
    title: clinic.value.name,
    text: `${clinic.value.name} - ${clinic.value.specialty}`,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Share cancelled')
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(window.location.href)
    alert('لینک کپی شد!')
  }
}

// Scroll to reviews section
const scrollToReviews = () => {
  const reviewsSection = document.getElementById('reviews')
  if (reviewsSection) {
    reviewsSection.scrollIntoView({behavior: 'smooth'})
  }
}

// Submit review
const submitReview = () => {
  if (!reviewForm.value.rating || !reviewForm.value.name || !reviewForm.value.comment) return

  // Here you would send to API
  console.log('Review submitted:', reviewForm.value)

  // Update clinic review count
  clinic.value.reviewCount++

  // Reset form and close modal
  reviewForm.value = {rating: 0, name: '', phone: '', comment: ''}
  showReviewModal.value = false

  alert('نظر شما با موفقیت ثبت شد!')
}

// متغیرهای مربوط به تایمر برای جلوگیری از اجرای چندباره
let redirectTimer: NodeJS.Timeout | null = null;

// واچر برای نظارت بر باز شدن مدال
watch(showSuccessModal, (isOpen) => {
  handleRedirectToChat();
  if (isOpen) {
    // اگر مدال باز شد و سرویس چت است
    if (selectedService.value?.id === 'text') {
      handleRedirectToChat();
      // پاک کردن تایمر قبلی اگر وجود داشته باشد
      if (redirectTimer) clearTimeout(redirectTimer);

      // تنظیم تایمر برای ۳ ثانیه بعد
      redirectTimer = setTimeout(() => {
        handleRedirectToChat();
      }, 3000);
    }
  } else {
    // اگر مدال بسته شد، تایمر را لغو کن
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      redirectTimer = null;
    }
  }
});

// تابع ساخت URL و ریدایرکت
const handleRedirectToChat = () => {
  // مقادیر مورد نیاز را از route یا متغیرهای状态 می‌خوانیم
  // توجه: در اینجا فرض شده که consultationId و سایر اطلاعات در route.query موجود هستند
  // اگر نه، باید آن‌ها را در هنگام لود صفحه در متغیرهای دیگری ذخیره کرده باشید.

  const query = route.query;
  // ساخت آبجکت پارامترها
  const params = {
    serviceType: String(query.serviceType || ''),
    trackingCode: String(query.trackingCode || ''),
    doctor: String(query.doctor || ''),
    specialty: String(query.specialty || ''),
    consultationId: String(query.consultationId || ''),
    status: String(query.status || 'request-sent'),
  };


  // ریدایرکت به صفحه لیست چت با پارامترها
  navigateTo({
    path: `/chat/${clinicId.value}`, // یا آدرس دقیق صفحه چت شما
    query: params
  });
};
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // خواندن فایل به صورت Base64 برای پیش‌نمایش
    const reader = new FileReader()
    reader.onload = (e) => {
      newPet.value.image = e.target?.result
    }
    reader.readAsDataURL(file)

    // نکته: در تابع handleAddPet باید فایل واقعی (file object) را نیز برای بک‌اند ارسال کنید
    // یا اگر فقط URL ذخیره می‌شود، همین کار کافی است.
    // برای ارسال به بک‌اند معمولاً بهتر است فایل را در FormData قرار دهید.
  }
}
// استفاده از computed برای head
useHead({
  title: computed(() => `${clinic.value?.name || 'در حال بارگذاری'} - رزرو نوبت | پتومن`),
  meta: [
    {
      name: 'description',
      content: computed(() => `رزرو نوبت از ${clinic.value?.name || 'این کلینیک'}`)
    }
  ]
})
</script>
