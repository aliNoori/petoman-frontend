<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Minimal -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white py-16 sm:py-20 overflow-hidden min-h-[500px] flex items-center">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
        <i class="ti ti-user-heart absolute top-12 left-24 text-rose-400 text-7xl rotate-6"></i>
        <i class="ti ti-users absolute top-20 right-20 text-rose-400 text-6xl -rotate-12"></i>
        <i class="ti ti-heart-filled absolute bottom-16 left-1/3 text-rose-300 text-6xl rotate-45"></i>
        <i class="ti ti-paw absolute bottom-20 right-1/4 text-rose-400 text-7xl -rotate-6"></i>
        <i class="ti ti-heart-handshake absolute top-1/2 right-12 text-rose-300 text-6xl rotate-12"></i>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <!-- Icon -->
        <div class="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6">
          <i class="ti ti-user-plus text-3xl text-rose-600"></i>
        </div>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          به جمع حامیان پتومن بپیوندید
        </h2>
        <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          با عضویت در جمع حامیان، بخشی از خانواده بزرگ عاشقان حیوانات شوید و در نجات جان‌های بی‌گناه مشارکت کنید
        </p>
      </div>
    </section>

    <!-- Main Form -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden">
        <div class="p-4 sm:p-8 lg:p-12">
          <div class="text-center mb-6 sm:mb-8">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">فرم عضویت حامی</h3>
            <p class="text-sm sm:text-base text-gray-600">لطفاً اطلاعات خود را تکمیل کنید</p>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
            <!-- Personal Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <!-- First Name -->
              <div>
                <label for="firstName" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  نام <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  id="firstName"
                  required
                  class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  placeholder="نام خود را وارد کنید"
                >
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  نام خانوادگی <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  id="lastName"
                  required
                  class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                  placeholder="نام خانوادگی خود را وارد کنید"
                >
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                ایمیل (اختیاری)
              </label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                placeholder="example@email.com"
              >
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                شماره تماس <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.phone"
                type="tel"
                id="phone"
                required
                class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                placeholder="09xxxxxxxxx"
              >
            </div>

            <!-- Profile Photo Upload -->
            <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rose-200">
              <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <i class="ti ti-photo text-rose-600 text-lg sm:text-xl ml-2"></i>
                عکس پروفایل (اختیاری)
              </h4>
              <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-4 border-rose-200 flex items-center justify-center">
                  <img v-if="profilePreview" :src="profilePreview" alt="preview" class="w-full h-full object-cover" />
                  <img v-else src="/assets/default-avatar.svg" alt="default" class="w-full h-full object-cover opacity-50" />
                </div>
                <div class="flex-1 text-center sm:text-right">
                  <label for="profileImage" class="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-rose-300 text-rose-700 rounded-lg sm:rounded-xl font-medium hover:bg-rose-50 transition-colors cursor-pointer">
                    <i class="ti ti-upload text-base sm:text-lg ml-2"></i>
                    انتخاب تصویر
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    @change="onFileChange"
                    class="hidden"
                  />
                  <p class="text-xs sm:text-sm text-gray-600 mt-2">حداکثر 2MB - فرمت: JPG, PNG, WEBP</p>
                  <button
                    v-if="profilePreview"
                    @click="clearProfileImage"
                    type="button"
                    class="mt-2 text-xs sm:text-sm text-rose-600 hover:text-rose-700 font-medium"
                  >
                    <i class="ti ti-x text-sm ml-1"></i>
                    حذف تصویر
                  </button>
                </div>
              </div>
            </div>

            <!-- Province and City -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <!-- Province -->
              <div>
                <label for="province" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  استان <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="provinceSearch"
                    @focus="onProvinceFocus"
                    @input="filterProvinces"
                    type="text"
                    id="province"
                    required
                    class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="جستجو یا انتخاب استان..."
                    autocomplete="off"
                  >
                  <i class="ti ti-map-pin absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  
                  <!-- Province Dropdown -->
                  <div
                    v-if="showProvinceDropdown && filteredProvinces.length > 0"
                    class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto"
                  >
                    <button
                      v-for="province in filteredProvinces"
                      :key="province.id"
                      type="button"
                      @click="selectProvince(province)"
                      class="w-full px-4 py-2 text-right hover:bg-rose-50 transition-colors text-sm"
                    >
                      {{ province.name }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- City -->
              <div>
                <label for="city" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  شهر <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="citySearch"
                    @focus="onCityFocus"
                    @input="filterCities"
                    type="text"
                    id="city"
                    required
                    :disabled="!form.province"
                    class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    :placeholder="form.province ? 'جستجو یا انتخاب شهر...' : 'ابتدا استان را انتخاب کنید'"
                    autocomplete="off"
                  >
                  <i class="ti ti-building-community absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  
                  <!-- City Dropdown -->
                  <div
                    v-if="showCityDropdown && filteredCities.length > 0 && form.province"
                    class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto"
                  >
                    <button
                      v-for="city in filteredCities"
                      :key="city"
                      type="button"
                      @click="selectCity(city)"
                      class="w-full px-4 py-2 text-right hover:bg-rose-50 transition-colors text-sm"
                    >
                      {{ city }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <i class="ti ti-share text-rose-600 text-lg sm:text-xl ml-2"></i>
                شبکه‌های اجتماعی (اختیاری)
              </h4>
              <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                با اشتراک‌گذاری پروفایل‌های اجتماعی خود، به ترویج فعالیت‌های پتومن کمک کنید
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <!-- Instagram -->
                <div>
                  <label for="instagram" class="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    <i class="ti ti-brand-instagram text-pink-500 text-base sm:text-lg ml-1"></i>
                    اینستاگرام
                  </label>
                  <input
                    v-model="form.socialLinks.instagram"
                    type="text"
                    id="instagram"
                    class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="@username"
                  >
                </div>

                <!-- Telegram -->
                <div>
                  <label for="telegram" class="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    <i class="ti ti-brand-telegram text-blue-500 text-base sm:text-lg ml-1"></i>
                    تلگرام
                  </label>
                  <input
                    v-model="form.socialLinks.telegram"
                    type="text"
                    id="telegram"
                    class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="@username"
                  >
                </div>

                <!-- LinkedIn -->
                <div>
                  <label for="linkedin" class="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    <i class="ti ti-brand-linkedin text-blue-600 text-base sm:text-lg ml-1"></i>
                    لینکدین
                  </label>
                  <input
                    v-model="form.socialLinks.linkedin"
                    type="text"
                    id="linkedin"
                    class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="username"
                  >
                </div>
              </div>
            </div>

            <!-- Support Type -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                نوع حمایت مورد علاقه <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <label class="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    v-model="form.type"
                    type="radio"
                    value="financial"
                    class="text-rose-600 focus:ring-rose-500"
                  >
                  <div class="mr-3">
                    <div class="font-medium text-gray-900 text-sm sm:text-base">حمایت مالی</div>
                    <div class="text-xs sm:text-sm text-gray-600">کمک مالی برای درمان و نگهداری</div>
                  </div>
                </label>
                
                <label class="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    v-model="form.type"
                    type="radio"
                    value="volunteer"
                    class="text-rose-600 focus:ring-rose-500"
                  >
                  <div class="mr-3">
                    <div class="font-medium text-gray-900 text-sm sm:text-base">داوطلبی</div>
                    <div class="text-xs sm:text-sm text-gray-600">کمک در امور مراقبت و درمان</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Experience -->
            <div>
              <label for="experience" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                تجربه کار با حیوانات
              </label>
              <textarea
                v-model="form.experience"
                id="experience"
                rows="3"
                class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none"
                placeholder="در صورت داشتن تجربه، لطفاً توضیح دهید..."
              ></textarea>
            </div>

            <!-- Motivation -->
            <div>
              <label for="motivation" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                انگیزه شما برای حمایت از حیوانات
              </label>
              <textarea
                v-model="form.motivation"
                id="motivation"
                rows="3"
                class="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none"
                placeholder="چرا می‌خواهید حامی حیوانات باشید؟"
              ></textarea>
            </div>

            <!-- Display in Supporters List -->
            <div class="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
              <div class="flex items-start space-x-reverse space-x-3">
                <input
                  v-model="form.showInList"
                  type="checkbox"
                  id="showInList"
                  class="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                >
                <label for="showInList" class="text-xs sm:text-sm text-gray-700">
                  <div class="font-semibold text-gray-900 mb-1 flex items-center text-sm sm:text-base">
                    <i class="ti ti-eye text-blue-600 text-base sm:text-lg ml-2"></i>
                    نمایش نام من در فهرست عمومی حامیان
                  </div>
                  <p class="text-gray-600">
                    با تیک زدن این گزینه، نام و اطلاعات شما در 
                    <NuxtLink to="/supporters" class="text-blue-600 hover:text-blue-700 font-medium underline">صفحه حامیان</NuxtLink>
                    نمایش داده می‌شود و الهام‌بخش دیگران خواهید بود.
                  </p>
                </label>
              </div>
            </div>

            <!-- Agreement -->
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-start space-x-reverse space-x-3">
                <input
                  v-model="form.agreement"
                  type="checkbox"
                  id="agreement"
                  required
                  class="mt-1 text-rose-600 focus:ring-rose-500 rounded"
                >
                <label for="agreement" class="text-xs sm:text-sm text-gray-700">
                  با 
                  <NuxtLink to="/terms" target="_blank" class="text-rose-600 hover:text-rose-700 font-medium underline">شرایط و قوانین عضویت</NuxtLink>
                  موافقم و متعهد می‌شوم که در راستای اهداف سازمان فعالیت کنم.
                  <span class="text-red-500">*</span>
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-4 sm:pt-6">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-rose-600 text-white py-3 sm:py-4 px-5 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <i class="ti ti-loader-2 text-lg sm:text-xl ml-2 animate-spin"></i>
                  در حال ارسال...
                </span>
                <span v-else class="flex items-center justify-center">
                  <i class="ti ti-heart text-lg sm:text-xl ml-2"></i>
                  عضویت در جمع حامیان
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
        <div class="relative bg-white rounded-2xl max-w-lg w-full mx-auto p-8 text-center border border-rose-100">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="ti ti-clock-check text-4xl text-blue-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            ✅ <span class="text-blue-700">درخواست شما با موفقیت ثبت شد</span>
          </h3>
          <p class="text-gray-600 mb-4 leading-relaxed">
            <strong>{{ form.firstName }} {{ form.lastName }}</strong> عزیز، از ثبت درخواست عضویت شما در جمع حامیان پتومن سپاسگزاریم.
          </p>
          
          <!-- Verification Notice -->
          <div class="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div class="flex items-start gap-3 text-right">
              <i class="ti ti-message-check text-blue-600 text-2xl flex-shrink-0 mt-0.5"></i>
              <div>
                <h4 class="font-semibold text-blue-900 mb-2">مراحل بعدی:</h4>
                <ul class="text-sm text-blue-800 space-y-2 text-right">
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600">📱</span>
                    <span><strong>پیامک تایید</strong> به شماره <strong class="text-rose-600">{{ form.phone }}</strong> ارسال خواهد شد</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600">✅</span>
                    <span>پس از بررسی و تأیید اطلاعات، جزئیات کامل برای شما ارسال می‌گردد</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600">⏱️</span>
                    <span>زمان بررسی: حداکثر ۲-۳ روز کاری</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Display Status -->
          <div class="mb-6 p-4 rounded-xl" :class="form.showInList ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
            <div class="flex items-center justify-center gap-2">
              <i :class="form.showInList ? 'ti ti-eye text-green-600' : 'ti ti-eye-off text-gray-500'" class="text-xl"></i>
              <p class="text-sm font-medium" :class="form.showInList ? 'text-green-700' : 'text-gray-600'">
                <span v-if="form.showInList">
                  ✅ پس از تأیید، نام شما در صفحه حامیان نمایش داده خواهد شد
                </span>
                <span v-else>
                  🔒 اطلاعات شما به صورت خصوصی ثبت شده است
                </span>

              </p>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="closeSuccess"
              class="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 transform hover:scale-105"
            >
              <i class="ti ti-home text-lg ml-2"></i>
              بازگشت به خانه
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {useSupporterStore} from "~/stores/supporter.ts";

// SEO
useSeoMeta({
  title: 'عضویت حامی - پتومن | پیوستن به جمع حامیان حیوانات',
  description: 'با عضویت در جمع حامیان پتومن، بخشی از خانواده بزرگ عاشقان حیوانات شوید و در نجات جان‌های بی‌گناه مشارکت کنید.',
  ogTitle: 'عضویت حامی - پتومن',
  ogDescription: 'با عضویت در جمع حامیان پتومن، بخشی از خانواده بزرگ عاشقان حیوانات شوید و در نجات جان‌های بی‌گناه مشارکت کنید.'
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

// Profile image
const profileImageFile = ref<File | null>(null)
const profilePreview = ref<string | null>(null)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  type: '',
  experience: '',
  motivation: '',
  agreement: false,
  showInList: false,
  socialLinks: {
    instagram: '',
    telegram: '',
    linkedin: ''
  }
})

// Province and City data
const provinces = ref([
  { id: 1, name: 'تهران', cities: ['تهران', 'شمیرانات', 'ری', 'اسلامشهر', 'پاکدشت', 'شهریار', 'دماوند', 'فیروزکوه', 'ورامین', 'ملارد', 'قدس', 'قرچک', 'رباط‌کریم', 'لواسان', 'پردیس', 'بومهن', 'پیشوا', 'کهریزک'] },
  { id: 2, name: 'گیلان', cities: ['رشت', 'انزلی', 'لاهیجان', 'لنگرود', 'رودسر', 'تالش', 'آستارا', 'آستانه‌اشرفیه', 'رودبار', 'فومن', 'صومعه‌سرا', 'ماسال', 'شفت', 'سیاهکل', 'املش', 'رضوانشهر', 'بندر کیاشهر', 'خمام', 'منجیل', 'دیلمان', 'اسالم', 'چابکسر', 'رحیم‌آباد', 'حویق'] },
  { id: 3, name: 'آذربایجان شرقی', cities: ['تبریز', 'مراغه', 'مرند', 'میانه', 'شبستر', 'سراب', 'بناب', 'اهر', 'ملکان', 'هشترود', 'عجب‌شیر', 'بستان‌آباد', 'کلیبر', 'آذرشهر', 'ورزقان', 'اسکو', 'جلفا', 'چاراویماق', 'هریس', 'خداآفرین', 'خاروانا'] },
  { id: 4, name: 'خوزستان', cities: ['اهواز', 'دزفول', 'آبادان', 'خرمشهر', 'اندیمشک', 'بهبهان', 'ایذه', 'ماهشهر', 'شوشتر', 'شوش', 'سوسنگرد', 'امیدیه', 'هندیجان', 'دشت آزادگان', 'گتوند', 'لالی', 'مسجد سلیمان', 'شادگان', 'رامهرمز', 'باغ‌ملک', 'آغاجاری', 'هویزه', 'حمیدیه', 'اروندکنار', 'کارون', 'باوی', 'حر'] },
  { id: 5, name: 'فارس', cities: ['شیراز', 'مرودشت', 'جهرم', 'کازرون', 'فسا', 'لار', 'داراب', 'آباده', 'فیروزآباد', 'نی‌ریز', 'اقلید', 'استهبان', 'سپیدان', 'ممسنی', 'سروستان', 'خرامه', 'لامرد', 'مهر', 'گراش', 'قیر و کارزین', 'کوار', 'ارسنجان', 'خنج', 'رستم', 'زرین‌دشت', 'پاسارگاد', 'قره‌بلاغ', 'بوانات', 'فراشبند', 'خرم‌بید'] },
  { id: 6, name: 'اصفهان', cities: ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'شاهین‌شهر', 'زرین‌شهر', 'گلپایگان', 'نطنز', 'اردستان', 'فلاورجان', 'مبارکه', 'شهرضا', 'دولت‌آباد', 'آران و بیدگل', 'سمیرم', 'نایین', 'تیران و کرون', 'فریدن', 'فریدون‌شهر', 'چادگان', 'برخوار', 'بوئین و میاندشت', 'خوانسار', 'دهاقان', 'لنجان'] },
  { id: 7, name: 'خراسان رضوی', cities: ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'قوچان', 'گناباد', 'کاشمر', 'تربت جام', 'چناران', 'فریمان', 'خواف', 'تایباد', 'بردسکن', 'سرخس', 'درگز', 'بینالود', 'جوین', 'باخرز', 'رشتخوار', 'فیروزه', 'خلیل‌آباد', 'کلات', 'زاوه', 'مه‌ولات', 'بجستان', 'داورزن'] },
  { id: 8, name: 'مازندران', cities: ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'بابلسر', 'تنکابن', 'نوشهر', 'چالوس', 'نکا', 'بهشهر', 'رامسر', 'محمودآباد', 'فریدون‌کنار', 'جویبار', 'نور', 'سوادکوه', 'میانرود', 'کلاردشت', 'عباس‌آباد', 'گلوگاه', 'سوادکوه شمالی', 'سیمرغ', 'کیاسر', 'ساوجبلاغ'] },
  { id: 9, name: 'کرمان', cities: ['کرمان', 'رفسنجان', 'سیرجان', 'بم', 'جیرفت', 'بردسیر', 'شهر بابک', 'زرند', 'کهنوج', 'رابر', 'بافت', 'ارزوئیه', 'رودبار جنوب', 'انار', 'قلعه‌گنج', 'منوجان', 'ریگان', 'فارس', 'فهرج', 'نرماشیر', 'راور', 'کرمان', 'بروات', 'رفسنجان'] },
  { id: 10, name: 'آذربایجان غربی', cities: ['ارومیه', 'خوی', 'مهاباد', 'سلماس', 'بوکان', 'میاندوآب', 'نقده', 'پیرانشهر', 'ماکو', 'سردشت', 'شوط', 'چالدران', 'اشنویه', 'تکاب', 'شاهین‌دژ', 'پلدشت'] },
  { id: 11, name: 'کرمانشاه', cities: ['کرمانشاه', 'اسلام‌آباد غرب', 'کنگاور', 'سنقر', 'هرسین', 'صحنه', 'پاوه', 'قصر شیرین', 'گیلانغرب', 'سرپل ذهاب', 'جوانرود', 'روانسر', 'ثلاث باباجانی', 'دالاهو'] },
  { id: 12, name: 'کردستان', cities: ['سنندج', 'سقز', 'بانه', 'مریوان', 'قروه', 'بیجار', 'کامیاران', 'دیواندره', 'دهگلان'] },
  { id: 13, name: 'همدان', cities: ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'اسدآباد', 'کبودرآهنگ', 'رزن', 'بهار', 'فامنین'] },
  { id: 14, name: 'چهارمحال و بختیاری', cities: ['شهرکرد', 'بروجن', 'فارسان', 'لردگان', 'اردل', 'کوهرنگ', 'بن', 'سامان'] },
  { id: 15, name: 'لرستان', cities: ['خرم‌آباد', 'بروجرد', 'دورود', 'الیگودرز', 'ازنا', 'کوهدشت', 'پل‌دختر', 'نورآباد', 'الشتر', 'دلفان', 'سلسله'] },
  { id: 16, name: 'ایلام', cities: ['ایلام', 'دهلران', 'آبدانان', 'ایوان', 'مهران', 'دره‌شهر', 'ملکشاهی', 'چرداول', 'سیروان', 'بدره'] },
  { id: 17, name: 'بوشهر', cities: ['بوشهر', 'برازجان', 'کنگان', 'گناوه', 'دیر', 'دشتستان', 'دیلم', 'دشتی', 'تنگستان', 'جم'] },
  { id: 18, name: 'زنجان', cities: ['زنجان', 'ابهر', 'خدابنده', 'خرمدره', 'طارم', 'ماهنشان', 'ایجرود', 'سلطانیه'] },
  { id: 19, name: 'سمنان', cities: ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدی‌شهر', 'سرخه', 'میامی', 'آرادان'] },
  { id: 20, name: 'یزد', cities: ['یزد', 'اردکان', 'میبد', 'تفت', 'مهریز', 'بافق', 'ابرکوه', 'بهاباد', 'هرات', 'خاتم'] },
  { id: 21, name: 'هرمزگان', cities: ['بندرعباس', 'قشم', 'میناب', 'بندر لنگه', 'جاسک', 'بندر خمیر', 'حاجی‌آباد', 'رودان', 'بشاگرد', 'پارسیان', 'ابوموسی', 'کیش'] },
  { id: 22, name: 'قزوین', cities: ['قزوین', 'البرز', 'تاکستان', 'آبیک', 'بویین‌زهرا', 'اقبالیه', 'آوج'] },
  { id: 23, name: 'گلستان', cities: ['گرگان', 'گنبد کاووس', 'علی‌آباد', 'مینودشت', 'آق قلا', 'بندر گز', 'کردکوی', 'آزادشهر', 'رامیان', 'کلاله', 'گالیکش', 'مراوه‌تپه', 'گمیشان', 'بندر ترکمن'] },
  { id: 24, name: 'قم', cities: ['قم', 'جعفریه', 'کهک', 'دستجرد', 'سلفچگان'] },
  { id: 25, name: 'خراسان شمالی', cities: ['بجنورد', 'شیروان', 'اسفراین', 'جاجرم', 'فاروج', 'مانه و سملقان', 'گرمه', 'راز و جرگلان'] },
  { id: 26, name: 'خراسان جنوبی', cities: ['بیرجند', 'قاین', 'فردوس', 'طبس', 'نهبندان', 'سرایان', 'بشرویه', 'سربیشه', 'درمیان', 'زیرکوه', 'خوسف'] },
  { id: 27, name: 'البرز', cities: ['کرج', 'طالقان', 'ساوجبلاغ', 'نظرآباد', 'فردیس', 'اشتهارد', 'هشتگرد', 'محمدشهر'] },
  { id: 28, name: 'اردبیل', cities: ['اردبیل', 'پارس‌آباد', 'خلخال', 'مشکین‌شهر', 'گرمی', 'بیله‌سوار', 'نمین', 'نیر', 'سرعین', 'کوثر'] },
  { id: 29, name: 'مرکزی', cities: ['اراک', 'ساوه', 'خمین', 'محلات', 'دلیجان', 'تفرش', 'شازند', 'کمیجان', 'آشتیان', 'خنداب', 'فراهان', 'زرند'] },
  { id: 30, name: 'سیستان و بلوچستان', cities: ['زاهدان', 'زابل', 'چابهار', 'خاش', 'ایرانشهر', 'سراوان', 'نیکشهر', 'کنارک', 'سرباز', 'میرجاوه', 'راسک', 'بمپور', 'دلگان', 'هیرمند', 'فنوج', 'قصرقند', 'نیمروز', 'مهرستان', 'سیب و سوران', 'هامون'] }
])

// Search and filter states
const provinceSearch = ref('')
const citySearch = ref('')
const showProvinceDropdown = ref(false)
const showCityDropdown = ref(false)
const filteredProvinces = ref(provinces.value)
const filteredCities = ref<string[]>([])

// Methods for province/city selection
const onProvinceFocus = () => {
  filteredProvinces.value = provinces.value
  showProvinceDropdown.value = true
}

const filterProvinces = () => {
  const query = provinceSearch.value.trim()
  if (!query) {
    filteredProvinces.value = provinces.value
  } else {
    filteredProvinces.value = provinces.value.filter(p => 
      p.name.includes(query) || p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
  showProvinceDropdown.value = true
}

const selectProvince = (province: { id: number; name: string; cities: string[] }) => {
  form.province = province.name
  provinceSearch.value = province.name
  form.city = ''
  citySearch.value = ''
  filteredCities.value = province.cities
  showProvinceDropdown.value = false
}

const onCityFocus = () => {
  const selectedProvince = provinces.value.find(p => p.name === form.province)
  if (selectedProvince) {
    filteredCities.value = selectedProvince.cities
    showCityDropdown.value = true
  }
}

const filterCities = () => {
  const selectedProvince = provinces.value.find(p => p.name === form.province)
  if (!selectedProvince) return
  
  const query = citySearch.value.trim()
  if (!query) {
    filteredCities.value = selectedProvince.cities
  } else {
    filteredCities.value = selectedProvince.cities.filter(c => 
      c.includes(query) || c.toLowerCase().includes(query.toLowerCase())
    )
  }
  showCityDropdown.value = true
}

const selectCity = (city: string) => {
  form.city = city
  citySearch.value = city
  showCityDropdown.value = false
}

// Profile image handlers
const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0] || null

  if (!file) {
    clearProfileImage()
    return
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('⚠️ حجم تصویر نباید بیش از 2 مگابایت باشد')
    input.value = ''
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('⚠️ لطفاً فقط فایل تصویری انتخاب کنید')
    input.value = ''
    return
  }

  profileImageFile.value = file
  
  // Create preview
  if (profilePreview.value) {
    try { URL.revokeObjectURL(profilePreview.value) } catch (e) {}
  }
  profilePreview.value = URL.createObjectURL(file)
}

const clearProfileImage = () => {
  profileImageFile.value = null
  if (profilePreview.value) {
    try { URL.revokeObjectURL(profilePreview.value) } catch (e) {}
  }
  profilePreview.value = null
  
  // Clear file input
  const fileInput = document.getElementById('profileImage') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

// Close dropdowns when clicking outside
if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('#province') && !target.closest('#city')) {
      showProvinceDropdown.value = false
      showCityDropdown.value = false
    }
  })
}
const supporterStore=useSupporterStore()
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Prepare form data (if profile image exists, we'd use FormData)
    if (profileImageFile.value) {
      console.log('✅ عکس پروفایل انتخاب شده:', profileImageFile.value.name, '-', (profileImageFile.value.size / 1024).toFixed(2), 'KB')
      // In real app: create FormData and send to API
      // const formData = new FormData()
      // formData.append('profileImage', profileImageFile.value)
      // ... append other fields
    }
    
    console.log('📝 اطلاعات فرم:', { ...form, hasProfileImage: !!profileImageFile.value })

    await supporterStore.addSupporter(form,profileImageFile.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success modal
    showSuccess.value = true
    
    // Reset form
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      province: '',
      city: '',
      type: '',
      experience: '',
      motivation: '',
      agreement: false,
      showInList: false,
      socialLinks: {
        instagram: '',
        telegram: '',
        linkedin: ''
      }
    })
    
    // Reset search fields
    provinceSearch.value = ''
    citySearch.value = ''
    filteredCities.value = []
    
    // Clear profile image
    clearProfileImage()
  } catch (error) {
    console.error('خطا در ارسال فرم:', error)
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  navigateTo('/')
}

const downloadCertificate = async () => {
  try {
    console.log('شروع تولید گواهینامه...')
    console.log('کل اطلاعات فرم:', form)
    
    // Generate certificate as Instagram Story format
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      console.error('خطا در ایجاد Canvas')
      return
    }
    
    console.log('Canvas ایجاد شد')
    
    // Set canvas size for Instagram Story (9:16 ratio)
    canvas.width = 1080
    canvas.height = 1920
    
    // Set text alignment to center by default
    ctx.textAlign = 'center'
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#fdf2f8')
  gradient.addColorStop(0.3, '#fce7f3')
  gradient.addColorStop(0.7, '#f3e8ff')
  gradient.addColorStop(1, '#e0e7ff')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Add subtle pattern overlay
  ctx.fillStyle = 'rgba(236, 72, 153, 0.05)'
  for (let i = 0; i < canvas.width; i += 60) {
    for (let j = 0; j < canvas.height; j += 60) {
      ctx.fillRect(i, j, 30, 30)
    }
  }
  
  // Top section with logo area
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 60, canvas.width - 120, 300)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 4
  ctx.strokeRect(60, 60, canvas.width - 120, 300)
  
  // Logo circle background
  ctx.fillStyle = '#ec4899'
  ctx.beginPath()
  ctx.arc(canvas.width / 2, 180, 60, 0, 2 * Math.PI)
  ctx.fill()
  
  // Logo inner circle
  ctx.fillStyle = '#fce7f3'
  ctx.beginPath()
  ctx.arc(canvas.width / 2, 180, 45, 0, 2 * Math.PI)
  ctx.fill()
  
  // Animal icons around logo
  ctx.font = '36px Arial'
  ctx.textAlign = 'center'
  
  // Position animal emojis in circle around logo
  const animals = ['🐕', '🐱', '🐰', '🦔']
  animals.forEach((animal, index) => {
    const angle = (index * Math.PI * 2) / animals.length - Math.PI / 2
    const x = canvas.width / 2 + Math.cos(angle) * 140
    const y = 200 + Math.sin(angle) * 140
    ctx.fillText(animal, x, y)
  })
  
  // Heart decorations
  ctx.fillText('❤️', canvas.width / 2 - 200, 200)
  ctx.fillText('�', canvas.width / 2 + 200, 200)
  
  // Title
  ctx.fillStyle = '#be185d'
  ctx.font = 'bold 48px Arial'
  ctx.fillText('گواهینامه عضویت', canvas.width / 2, 280)
  
  ctx.fillStyle = '#ec4899'
  ctx.font = 'bold 32px Arial'
  ctx.fillText('پتومن', canvas.width / 2, 320)
  
  // Main content section
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 400, canvas.width - 120, 600)
  ctx.strokeStyle = '#f9a8d4'
  ctx.lineWidth = 3
  ctx.strokeRect(60, 400, canvas.width - 120, 600)
  
  // Member name section
  ctx.fillStyle = '#831843'
  ctx.font = 'bold 56px Arial'
  const firstName = form.firstName || 'کاربر'
  const lastName = form.lastName || 'گرامی'
  
  console.log('نام کاربر:', firstName, lastName)
  console.log('مقادیر فرم:', form.firstName, form.lastName)
  
  // Center the name vertically in the content area
  ctx.fillText(firstName, canvas.width / 2, 520)
  ctx.fillText(lastName, canvas.width / 2, 590)
  
  // Membership text
  ctx.fillStyle = '#be185d'
  ctx.font = 'bold 42px Arial'
  ctx.fillText('به جمع حامیان', canvas.width / 2, 680)
  ctx.fillText('حیوانات پیوست', canvas.width / 2, 730)
  
  // Support type with icon
  const supportTypeText = form.type === 'financial' ? 'حامی مالی' : 'داوطلب'
  const supportIcon = form.type === 'financial' ? '💰' : '🤝'
  
  ctx.fillStyle = '#fce7f3'
  ctx.fillRect(120, 770, canvas.width - 240, 80)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 2
  ctx.strokeRect(120, 770, canvas.width - 240, 80)
  
  ctx.fillStyle = '#831843'
  ctx.font = 'bold 36px Arial'
  ctx.fillText(`${supportIcon} ${supportTypeText}`, canvas.width / 2, 820)
  
  // Date section
  const today = new Date()
  const persianDate = today.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  ctx.fillStyle = '#be185d'
  ctx.font = '28px Arial'
  ctx.fillText(`📅 ${persianDate}`, canvas.width / 2, 900)
  
  // Bottom decorative section
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 1050, canvas.width - 120, 400)
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 4
  ctx.strokeRect(60, 1050, canvas.width - 120, 400)
  
  // Thank you message
  ctx.fillStyle = '#6b7280'
  ctx.font = '24px Arial'
  ctx.fillText('با تشکر از حمایت گرم شما', canvas.width / 2, 1150)
  ctx.fillText('در نجات جان حیوانات', canvas.width / 2, 1190)
  
  // Animal parade
  ctx.font = '40px Arial'
  ctx.fillText('🐕 🐱 🐰', canvas.width / 2, 1280)
  ctx.fillText('🦔 🐦 🐹', canvas.width / 2, 1340)
  
  // Organization signature
  ctx.fillStyle = '#831843'
  ctx.font = 'bold 24px Arial'
  ctx.fillText('مدیریت سازمان پتومن', canvas.width / 2, 1400)
  
  // Certificate ID
  const certificateId = `PET-${Date.now().toString().slice(-6)}`
  ctx.fillStyle = '#9ca3af'
  ctx.font = '18px Arial'
  ctx.fillText(`شناسه: ${certificateId}`, canvas.width / 2, 1430)
  
  // Social media ready watermark
  ctx.fillStyle = 'rgba(236, 72, 153, 0.1)'
  ctx.font = '16px Arial'
  ctx.fillText('📱 آماده اشتراک‌گذاری', canvas.width / 2, 1850)
  
  console.log('گواهینامه طراحی شد، شروع دانلود...')
  
  // Download with optimal settings for social media
  const link = document.createElement('a')
  link.download = `گواهینامه-استوری-${form.firstName || 'کاربر'}-${form.lastName || 'گرامی'}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
  
  console.log('فایل دانلود شد!')
  
  } catch (error) {
    console.error('خطا در تولید گواهینامه:', error)
    alert('متاسفانه در تولید گواهینامه خطایی رخ داد. لطفاً دوباره تلاش کنید.')
  }
}

const shareSuccess = () => {
  const supportTypeText = form.type === 'financial' ? 'حامی مالی' : 'داوطلب'
  const supportIcon = form.type === 'financial' ? '💰' : '🤝'
  
  const text = `🎉 من ${form.firstName} ${form.lastName} به جمع حامیان حیوانات پیوستم! 
  
${supportIcon} نوع حمایت: ${supportTypeText}
🐕🐱 سازمان پتومن به نجات و مراقبت از حیوانات بی‌سرپناه می‌پردازد.
❤️ با حمایت هر کدام از ما، جان‌های بی‌گناه نجات پیدا می‌کنند.

#پتومن #حامیان_حیوانات #نجات_حیوانات #عضویت_جدید
🐾 بیایید با هم دنیای بهتری برای حیوانات بسازیم!`
  
  if (navigator.share) {
    navigator.share({
      title: `${form.firstName} ${form.lastName} - عضویت در پتومن`,
      text: text,
      url: window.location.origin
    })
  } else {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard?.writeText(text + '\n\n' + window.location.origin)
    alert('متن برای اشتراک‌گذاری کپی شد! 📋✨')
  }
}
</script>

<style scoped>
/* Custom scrollbar for dropdowns */
.max-h-60 {
  scrollbar-width: thin;
  scrollbar-color: #f472b6 #fce7f3;
}

.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #fce7f3;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #f472b6;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #ec4899;
}
</style>
