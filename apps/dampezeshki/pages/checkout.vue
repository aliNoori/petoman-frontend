<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Site Header -->
    <SiteHeader />

    <!-- Checkout Form View -->
    <template v-if="!showReceipt">
      <!-- Steps Header -->
      <div class="bg-white border-b sticky top-0 z-10">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-xl font-bold text-gray-800">تکمیل رزرو نوبت</h1>
          </div>
          <!-- Steps -->
          <div class="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm">
            <div class="flex items-center gap-1 md:gap-2">
              <div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>
              <span class="hidden md:inline text-gray-600">انتخاب دامپزشک</span>
            </div>
            <div class="w-4 md:w-8 h-px bg-gray-300"></div>
            <div class="flex items-center gap-1 md:gap-2">
              <div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>
              <span class="hidden md:inline text-gray-600">انتخاب زمان</span>
            </div>
            <div class="w-4 md:w-8 h-px bg-gray-300"></div>
            <div class="flex items-center gap-1 md:gap-2">
              <div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
              <span class="font-medium text-gray-800">تکمیل اطلاعات</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Form Column -->
          <div class="lg:col-span-2 space-y-6">

            <!-- 1. Pet Selection -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-gray-800">انتخاب حیوان</h2>
                <button @click="openAddPetModal" class="text-sm text-blue-500 hover:text-blue-600 font-medium">
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
                    :class="['p-4 border rounded-lg cursor-pointer transition flex items-center gap-3', selectedPetId === pet.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300']"
                >
                  <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img v-if="pet.logo" :src="resolveUrl(pet.logo)" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">🐾</div>
                  </div>
                  <div>
                    <div class="font-bold text-gray-800">{{ pet.name }}</div>
                    <div class="text-xs text-gray-500">{{ getPetTypeLabel(pet.type) }} | {{ pet.age }} ساله</div>
                  </div>
                  <div v-if="selectedPetId === pet.id" class="mr-auto text-blue-500">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Problem Description -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4">توضیح مشکل</h2>
              <textarea
                  v-model="problemDescription"
                  rows="4"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                  placeholder="لطفاً علائم یا مشکل حیوان را توضیح دهید..."
              ></textarea>
            </div>

            <!-- 3. Address Section (Conditional) -->
            <div v-if="serviceType === 'home'" class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold text-gray-800">آدرس محل ویزیت</h2>
                <!-- تغییر: دکمه افزودن اکنون مودال جدید را باز می‌کند -->
                <button @click="openAddressModal" class="text-sm text-blue-500 hover:text-blue-600 font-medium">
                  مدیریت آدرس‌ها
                </button>
              </div>

              <!-- نمایش آدرس انتخاب شده -->
              <div v-if="selectedAddress" class="p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-start gap-3">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i class="ti ti-map-pin text-blue-500"></i>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h4 class="font-bold text-gray-800">{{ selectedAddress.title }}</h4>
                    <button @click="openAddressModal" class="text-xs text-blue-500 underline">تغییر</button>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ selectedAddress.address }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ selectedAddress.receiver }} - {{ selectedAddress.phone }}</p>
                </div>
              </div>

              <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p class="text-gray-500 mb-2">هنوز آدرسی انتخاب نشده است</p>
                <button @click="openAddressModal" class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                  انتخاب یا افزودن آدرس
                </button>
              </div>

            </div>

            <!-- 4. Payment Method -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4">روش پرداخت</h2>
              <div class="space-y-3">
                <label
                    class="relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group"
                    :class="paymentMethod === 'wallet'
    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
                >
                  <!-- Radio Button Custom Style -->
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <input
                          type="radio"
                          v-model="paymentMethod"
                          value="wallet"
                          class="peer sr-only"
                      >
                      <div class="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600">
                        <div class="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                    </div>

                    <div>
                      <div class="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">کیف پول الکترونیک</div>
                      <div class="text-xs text-slate-500 mt-0.5">
                        موجودی: <span class="font-semibold text-slate-700">{{ formatPrice(walletStore.wallet?.balance) }}</span> تومان
                      </div>
                    </div>
                  </div>

                  <!-- Status Indicator -->
                  <div class="flex items-center gap-2">
    <span
        class="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
        :class="walletStore.wallet?.balance >= finalPrice
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-red-100 text-red-700'"
    >
      {{ walletStore.wallet?.balance >= finalPrice ? 'موجودی کافی' : 'موجودی ناکافی' }}
    </span>

                    <!-- Icon based on status -->
                    <svg
                        v-if="walletStore.wallet?.balance >= finalPrice"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-emerald-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </label>
                <label
                    class="relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group"
                    :class="paymentMethod === 'gateway'
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
                >
                  <!-- Radio Button Custom Style -->
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <input
                          type="radio"
                          v-model="paymentMethod"
                          value="gateway"
                          class="peer sr-only"
                      >
                      <div class="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600">
                        <div class="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                    </div>

                    <div>
                      <div class="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">درگاه بانکی امن</div>
                      <div class="text-xs text-slate-500 mt-0.5">
                        پرداخت آنلاین با تمام کارت‌های عضو شتاب
                      </div>
                    </div>
                  </div>

                  <!-- Icon Container -->
                  <div
                      class="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                      :class="paymentMethod === 'gateway' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'"
                  >
                    <!-- Credit Card Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>

          </div>

          <!-- Summary Column -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 class="text-lg font-bold text-gray-800 mb-4">خلاصه رزرو</h2>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">{{ providerLabel }}</span>
                  <span class="font-medium text-left">{{ providerName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">نوع خدمت:</span>
                  <span class="font-medium">{{ serviceName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">تاریخ:</span>
                  <span class="font-medium">{{ selectedDate }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">ساعت:</span>
                  <span class="font-medium">{{ selectedTime }}</span>
                </div>
              </div>
              <div class="border-t mt-4 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">مبلغ قابل پرداخت:</span>
                  <span class="text-xl font-bold text-green-600">{{ servicePrice }} تومان</span>
                </div>
              </div>
              <button
                  @click="submitBooking"
                  :disabled="!canSubmit || isProcessing"
                  class="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <span v-if="isProcessing" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>{{ isProcessing ? 'در حال پردازش...' : 'پرداخت و ثبت نوبت' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Payment Receipt View -->
    <template v-else>
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-lg mx-auto">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 class="text-2xl font-bold">پرداخت موفق</h2>
              <p class="text-green-100 mt-2">نوبت شما با موفقیت ثبت شد</p>
            </div>
            <div class="p-6">
              <div class="bg-gray-50 rounded-xl p-5 space-y-4 text-sm">
                <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span class="text-gray-500">کد پیگیری</span>
                  <span class="font-bold text-lg text-gray-800 dir-ltr">{{ trackingCode }}</span>
                </div>
<!--                <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span class="text-gray-500">شماره مرجع</span>
                  <span class="font-mono text-gray-800 dir-ltr">{{ paymentRef }}</span>
                </div>-->
                <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span class="text-gray-500">تاریخ پرداخت</span>
                  <span class="text-gray-800">{{ new Date(paymentDate).toLocaleDateString('fa-IR') }}</span>
                </div>
                <div class="flex justify-between items-center pt-2">
                  <span class="text-gray-600 font-medium">مبلغ پرداختی</span>
                  <span class="font-bold text-xl text-green-600">{{ serviceAmount }} تومان</span>
                </div>
              </div>
              <div class="flex gap-4 mt-6">
                <NuxtLink to="/profile" class="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition text-center">
                  مشاهده نوبت‌ها
                </NuxtLink>
                <NuxtLink to="/" class="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition text-center">
                  صفحه اصلی
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

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
    <!-- Address Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showAddressModal"
            class="fixed inset-0 bg-black/50 z-[99998] flex items-center justify-center p-4"
            @click.self="showAddressModal = false"
        >
          <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900">انتخاب آدرس</h3>
              <button @click="showAddressModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="ti ti-x text-xl text-gray-500"></i>
              </button>
            </div>

            <div class="p-4 space-y-3">
              <!-- لیست آدرس‌های موجود -->
              <button
                  v-for="address in addresses"
                  :key="address.id"
                  @click="selectAddress(address)"
                  :class="[
                  'w-full p-4 rounded-xl border-2 text-right transition-all',
                  selectedAddress?.id === address.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-home text-gray-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ address.title }}</h4>
                    <p class="text-gray-600 text-sm">{{ address.fullAddress.address?.road }} .
                      {{ address.fullAddress.address?.town??address.fullAddress.address.suburb }} .
                      {{ address.fullAddress.address?.state }}
                    </p>
                    <p class="text-gray-500 text-sm mt-1">{{ address.receiver }} - {{ address.phone }}</p>
                  </div>
                  <div v-if="selectedAddress?.id === address.id"
                       class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <i class="ti ti-check text-white text-sm"></i>
                  </div>
                </div>
              </button>

              <!-- بخش افزودن آدرس جدید -->
              <div class="border-t border-gray-200 pt-4 mt-2">
                <h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <i class="ti ti-plus text-blue-500"></i>
                  افزودن آدرس جدید
                </h4>

                <div class="space-y-3">
                  <!-- ورودی‌های جزئیات آدرس -->
                  <div class="grid grid-cols-2 gap-3">
                    <input
                        v-model="newCheckoutAddress.title"
                        type="text"
                        placeholder="عنوان (مثلاً خانه)"
                        class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        v-model="newCheckoutAddress.receiver"
                        type="text"
                        placeholder="نام گیرنده"
                        class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <input
                      v-model="newCheckoutAddress.phone"
                      type="tel"
                      placeholder="شماره تماس"
                      class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <ClientOnly>
                    <!-- کامپوننت نقشه -->
                    <AddressSelector
                        v-model="tempAddressData"
                        placeholder="روی نقشه آدرس تحویل را انتخاب کنید"
                        title="انتخاب آدرس تحویل سفارش"
                    />
                  </ClientOnly>
                  <!-- دکمه ثبت آدرس جدید -->
                  <button
                      @click="handleNewAddress(newCheckoutAddress)"
                      :disabled="!newCheckoutAddress.title?.trim() ||
                      !newCheckoutAddress.receiver?.trim() ||
                      !newCheckoutAddress.phone?.trim() ||
                      !newCheckoutAddress.lat"
                      class="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-check"></i>
                    ثبت آدرس جدید
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <AppFooter />
  </div>
</template>

<script setup>
import {useUploader} from "~/composables/useUploader";

definePageMeta({ layout: false })
import {computed, ref, onMounted, reactive,watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTenantStore } from "~/stores/tenant.store"
import { usePetStore } from "~/stores/pet.store"
import { useWalletStore } from "~/stores/wallet.store"
import { useAuthStore } from "~/stores/auth"
import { useAddressStore } from "~/stores/address.store"
import { useAppointmentStore } from "~/stores/appointment.store" // اضافه شده
import {usePaymentStore} from "~/stores/payment";
import {useNuxtApp} from 'nuxt/app';
import {useUrlHelper} from "~/composables/useUrlHelper";
const {$toast}=useNuxtApp()
const uploader = useUploader()
const route = useRoute()
const {resolveUrl} = useUrlHelper();
const router = useRouter()
const tenantStore = useTenantStore()
const petStore = usePetStore()
const walletStore = useWalletStore()
const userStore = useAuthStore()
const addressStore = useAddressStore()
const appointmentStore = useAppointmentStore() // اضافه شده
let serviceAmount;

// --- Data Fetching ---
onMounted(async () => {

  await petStore.fetchPets()
  await walletStore.fetchWalletUser()
  await addressStore.fetchUserAddresses()

  if(route.query.trackingCode){

    trackingCode.value=String(route.query.trackingCode)
    paymentRef.value=String(route.query.paymentRef)
    paymentDate.value=String(route.query.paymentDate)
    serviceAmount=String(route.query.servicePrice)
    showReceipt.value=true

  }
})

// --- Logic: Vet/Clinic Info ---
const vetId = computed(() => route.query.vet || '')
const clinicId = computed(() => route.query.clinic || '')
const isClinic = computed(() => !!clinicId.value)
const addresses = computed(() => addressStore.addresses)

const vet = computed(() => {
  const currentId = vetId.value || clinicId.value
  if (!currentId) return {}
  const sourceList = isClinic.value ? tenantStore.clinics : tenantStore.vets
  const vetData = sourceList.find((v) => v.id === currentId)
  if (!vetData) return {}
  const settings = vetData.tenantSettings || []
  const visitPricingSetting = settings.find((s) => s.key === 'visit_pricing')
  const visitPricing = visitPricingSetting?.value || {}
  return {
    id: vetData.id,
    name: vetData.name||vetData.ownerName,
    rawVisitPricing: visitPricing,
  }
})

// --- Logic: Service & Price ---
const serviceType = computed(() => route.query.service || 'in-person')
const selectedDate = computed(() => route.query.date || '')
const selectedTime = computed(() => route.query.time || '')

const selectedServiceInfo = computed(() => {
  const type = serviceType.value
  const pricing = vet.value.rawVisitPricing
  let name = 'سرویس نامشخص'
  let price = 0
  if (type === 'in-person' && pricing?.inPerson?.enabled) {
    name = 'ویزیت حضوری'
    price = pricing.inPerson.price
  } else if (type === 'home' && pricing?.home?.enabled) {
    name = 'ویزیت در منزل'
    price = pricing.home.price
  } else if (type === 'text' && pricing?.chat?.enabled) {
    name = 'گفتگوی آنلاین'
    price = pricing.chat.price
  } else if (type === 'phone-instant' && pricing?.phoneInstant?.enabled) {
    name = 'تماس تلفنی فوری'
    price = pricing.phoneInstant.price
  } else if (type === 'phone-scheduled') {
    name = 'تماس در زمان دلخواه'
    price = pricing?.phoneScheduled?.price || 0
  }
  return { name, price }
})

const serviceName = computed(() => selectedServiceInfo.value.name)
const finalPrice = computed(() => selectedServiceInfo.value.price)
const servicePrice = computed(() => new Intl.NumberFormat('fa-IR').format(finalPrice.value))
const providerName = computed(() => vet.value.name || 'نامشخص')
const providerLabel = computed(() => isClinic.value ? 'کلینیک' : 'دامپزشک')

// --- Form State ---
const problemDescription = ref('')
const selectedPetId = ref(null)
const selectedAddressId = ref(null)
const addressDetails = ref('')
const paymentMethod = ref('gateway')
const isProcessing = ref(false)

// --- Modals State ---
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

// --- Address Modal State ---
const showAddressModal = ref(false)
const selectedAddress = ref(null) // آبجکت کامل آدرس انتخاب شده
const tempAddressData = ref({}) // داده‌های نقشه
const isSubmittingAddress = ref(false)
// آبجکت reactive برای ذخیره اطلاعات آدرس در حال ثبت
const newCheckoutAddress = reactive({
  address: '',
  province: '',
  city: '',
  location: null,
  lat:'',
  lng:'',
  title: '', // عنوان آدرس اضافه شد
  receiver: '', // نام گیرنده اضافه شد
  phone: '' // شماره تماس اضافه شد
})

// --- Receipt State ---
const showReceipt = ref(false)
const trackingCode = ref('')
const paymentRef = ref('')
const paymentDate = ref('')

// --- Helpers ---
const getPetTypeLabel = (type) => {
  const map = { DOG: 'سگ', CAT: 'گربه', BIRD: 'پرنده', OTHER: 'سایر' }
  return map[type] || type
}
const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price)

// --- Actions ---
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

// --- Address Actions ---
const openAddressModal = () => { showAddressModal.value = true }

const selectAddress = (address) => {
  selectedAddress.value = address
  selectedAddressId.value = address.id
  showAddressModal.value = false // بستن مودال بعد از انتخاب
}

watch(tempAddressData, (newVal) => {
  if (newVal && newVal.location) {
    // اصلاح شده: خواندن مختصات از داخل location
    Object.assign(newCheckoutAddress, {
      lat: newVal.location.lat,
      lng: newVal.location.lng,
      location: newVal.location,
      address: newVal.address,
      city: newVal.city,
      province: newVal.province
    })
  }
}, { deep: true })

// تابع مدیریت افزودن آدرس جدید (نسخه نهایی متصل به استور)
const handleNewAddress = async (addressData) => {
  if (!addressData) return

  // آماده‌سازی داده‌ها مطابق اینترفیس استور
  const payload = {
    title: addressData.title || newCheckoutAddress.title || 'آدرس جدید',
    fullAddress: addressData.address || addressData.address_text || '',
    receiver: addressData.receiver || newCheckoutAddress.receiver || '',
    phone: addressData.phone || newCheckoutAddress.phone || '',
    province: addressData.province ||newCheckoutAddress.province|| '',
    city: addressData.city ||newCheckoutAddress.city|| '',
    location: addressData.location || null
  }

  // بررسی اعتبار حداقلی
  /*if (!payload.fullAddress && !payload.location) {
    alert('لطفاً آدرس را روی نقشه انتخاب کنید')
    return
  }*/

  try {
    // فراخوانی متد استور برای ذخیره در سرور
    // انتخاب آدرس جدید در فرانت‌اند
    // (چون استور لیست را آپدیت کرد، اینجا فقط آی‌دی را ست می‌کنیم)
    selectedAddress.value = await addressStore.addUserAddress(payload)

    // بستن مودال
    showAddressModal.value = false

    // پاک کردن فرم
    Object.assign(newCheckoutAddress, {
      address: '', province: '', city: '', location: null,lat:'',lng:'', title: '', receiver: '', phone: ''
    })

  } catch (error) {
    console.error('خطا در ثبت آدرس:', error)
    alert('مشکلی در ثبت آدرس پیش آمده است')
  }
}

// --- Validation ---
const canSubmit = computed(() => {
  if (!selectedPetId.value) return false
  if (!problemDescription.value.trim()) return false
  if (serviceType.value === 'home' && !selectedAddressId.value) return false
  if (paymentMethod.value === 'wallet' && walletStore.wallet?.balance < finalPrice.value) return false
  return true
})

const paymentStore=usePaymentStore()
// --- Submit ---
const submitBooking = async () => {
  if (!canSubmit.value) return;

  isProcessing.value = true;

  try {
    const bookingData = {
      tenantId: vetId.value?vetId.value:clinicId.value,
      clinicId: clinicId.value || undefined,
      serviceType: serviceType.value,
      reservedTime: {
        date: selectedDate.value,
        time: selectedTime.value
      },
      petId: selectedPetId.value,
      notes: problemDescription.value,
      addressId: selectedAddressId.value,
      addressDetails: addressDetails.value,
      // اصلاح amount: تبدیل رشته به عدد
      amount: Number(finalPrice.value),
      //phoneCallOption: null,
      paymentMethod: paymentMethod.value === 'gateway' ? 'online' : paymentMethod.value,
    };

    const response = await paymentStore.submitVetOrder(bookingData);

    // بررسی پاسخ موفقیت‌آمیز (پرداخت کیف پول یا نهایی شده)
    if (response.actionType === 'ORDER_COMPLETED' || response.data?.appointment) {
      const result = response.data || response;

      // نمایش رسید
      trackingCode.value = result.trackingCode || 'N/A';
      paymentRef.value = result.paymentId;
      paymentDate.value=result.paymentDate;
      serviceAmount = result.amount;
      showReceipt.value = true; // نمایش کامپوننت رسید

    } else if (response.requiresAction && response.actionType === 'ONLINE_PAYMENT_REDIRECT') {
      // هندل کردن پرداخت آنلاین
      const { orderId, amount, tenantId } = response.data;

      // ارسال درخواست دوم برای دریافت لینک درگاه بانکی
      const gatewayResponse = await paymentStore.initiateVetOnlinePayment({
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
        $toast('خطا در دریافت لینک درگاه بانکی', 'error', 5000)
      }
    } else {
      //throw new Error('لینک درگاه پرداخت دریافت نشد');
      $toast('لینک درگاه پرداخت دریافت نشد', 'error', 5000)
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

const handleImageUpload = (event) => {
  const target = event.target
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
</script>