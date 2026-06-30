<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- هدر -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">درخواست‌های فوری</h1>
          <p class="text-sm text-gray-500">گفتگوی آنلاین و تماس تلفنی - آنی و بدون نوبت</p>
        </div>
        <!-- دکمه تنظیمات در هدر -->
        <div class="flex items-center gap-3">
          <!-- دکمه تنظیمات ظرفیت -->
          <button
              @click="openCapacitySettings"
              class="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
              title="تنظیمات ظرفیت"
          >
            <i class="ti ti-settings"></i>
            <span class="hidden sm:inline">ظرفیت</span>
          </button>

          <span :class="[
    'px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2',
    isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
  ]">
    <span :class="[
      'w-2.5 h-2.5 rounded-full',
      isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
    ]"></span>
    {{ isOnline ? 'آنلاین هستید' : 'آفلاین هستید' }}
  </span>
        </div>

        <!-- کامپوننت تنظیمات -->
        <CapacitySettingsModal
            :isOpen="showCapacityModal"
            :currentSettings="capacitySettings"
            :currentStats="capacityStats"
            @close="showCapacityModal = false"
            @update:settings="onCapacitySettingsUpdate"
        />
      </div>
    </div>

    <!-- هشدار نوتیفیکیشن -->
    <div v-if="notificationPermission === 'denied'"
         class="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
      <p class="text-yellow-800 text-sm">
        <i class="ti ti-bell-off ml-2"></i>
        نوتیفیکیشن‌ها مسدود شده‌اند.
        <button
            @click="openNotificationSettings"
            class="underline text-blue-600 hover:text-blue-800"
        >
          برای فعال‌سازی کلیک کنید
        </button>
      </p>
    </div>
    <div v-else-if="notificationPermission === 'default'"
         class="bg-blue-100 border border-blue-300 rounded-xl p-4">
      <p class="text-blue-800 text-sm">
        <i class="ti ti-bell ml-2"></i>
        برای دریافت هشدارهای صوتی،
        <button
            @click="requestNotificationPermission"
            class="underline text-blue-600 hover:text-blue-800 font-medium"
        >
          اجازه نوتیفیکیشن
        </button>
        دهید.
      </p>
    </div>

    <!-- Toast هشدار -->
    <Transition name="slide-fade">
      <div v-if="alertMessage" class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div class="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
          <i class="ti ti-bell text-xl"></i>
          <span class="font-medium">{{ alertMessage }}</span>
        </div>
      </div>
    </Transition>

    <!-- سوییچر نما -->
    <div class="bg-white rounded-xl p-3 shadow-sm">
      <!-- کانتینر اصلی -->
      <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-full">

        <router-link
            to="/clinic/appointments"
            class="flex-1 sm:flex-none px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2"
            :class="$route.path === '/clinic/appointments'
        ? 'bg-white text-emerald-700 shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'"
        >
          <i class="ti ti-layout-grid text-base sm:text-lg"></i>
          <span class="hidden sm:inline whitespace-nowrap">کارت</span>
        </router-link>

        <router-link
            to="/clinic/appointments/calendar"
            class="flex-1 sm:flex-none px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2"
            :class="$route.path.includes('/clinic/appointments/calendar')
        ? 'bg-white text-emerald-700 shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'"
        >
          <i class="ti ti-calendar text-base sm:text-lg"></i>
          <span class="hidden sm:inline whitespace-nowrap">تقویم</span>
        </router-link>

        <router-link
            to="/clinic/appointments/table"
            class="flex-1 sm:flex-none px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2"
            :class="$route.path.includes('/clinic/appointments/table')
        ? 'bg-white text-emerald-700 shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'"
        >
          <i class="ti ti-table text-base sm:text-lg"></i>
          <span class="hidden sm:inline whitespace-nowrap">جدول</span>
        </router-link>

        <router-link
            to="/clinic/urgent-requests"
            class="flex-1 sm:flex-none px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2"
            :class="$route.path.includes('/clinic/urgent-requests')
        ? 'bg-white text-emerald-700 shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'"
        >
          <i class="ti ti-bolt text-base sm:text-lg"></i>
          <span class="hidden sm:inline whitespace-nowrap">فوری</span>
        </router-link>

      </div>
    </div>

    <!-- آمار امروز -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-indigo-100">گفتگوهای امروز</p>
            <p class="text-2xl font-bold mt-1">{{ todayStats.chats }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-message-circle text-2xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-linear-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-100">تماس‌های امروز</p>
            <p class="text-2xl font-bold mt-1">{{ todayStats.calls }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-phone text-2xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-linear-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-amber-100">در انتظار</p>
            <p class="text-2xl font-bold mt-1">{{ pendingRequests.length }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-clock text-2xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-emerald-100">کل زمان ویزیت</p>
            <p class="text-2xl font-bold mt-1">{{ todayStats.totalMinutes }} دقیقه</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-clock-hour-4 text-2xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ بخش درخواست‌های منقضی‌شده -->
    <div v-if="expiredRequestsList.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-red-600">⚠️ درخواست‌های منقضی‌شده</h2>
        <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium animate-pulse">
      {{ expiredRequestsList.length }} درخواست
    </span>
      </div>

      <!-- تغییر: استفاده از lg و xl برای کنترل بهتر عرض در دسکتاپ -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
            v-for="request in expiredRequestsList"
            :key="request.id"
            class="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex flex-col h-full"
        >
          <div class="flex items-start gap-4">
            <!-- آواتار -->
            <div class="relative flex-shrink-0">
              <img :src="resolveUrl(request.petAvatar)" class="w-14 h-14 rounded-2xl object-cover"/>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <i class="ti ti-alert text-white text-xs"></i>
              </div>
            </div>
            <!-- اطلاعات -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-lg truncate">{{ request.petName }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ request.ownerName }} • {{ request.petType }}</p>
                </div>
                <span class="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium whitespace-nowrap">
              ⏰ منقضی
            </span>
              </div>

              <!-- توضیحات -->
              <div v-if="request.description" class="p-3 bg-white border border-red-200 rounded-xl mb-3">
                <p class="text-sm text-red-800">
                  <i class="ti ti-alert-circle ml-1"></i>
                  {{ request.description }}
                </p>
              </div>

              <!-- اطلاعات تماس -->
              <div class="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              <i class="ti ti-phone"></i>
              <span class="font-mono">{{ request.phone }}</span>
            </span>
              </div>

              <!-- دکمه‌های عملیات -->
              <div class="flex flex-wrap gap-2 mt-auto">
                <!-- پذیرش -->
                <button
                    @click="acceptExpiredRequest(request)"
                    :disabled="!!activeSession"
                    class="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i class="ti ti-phone"></i>
                  تماس فوری
                </button>

                <!-- تمدید زمان -->
                <button
                    @click="extendExpiredRequest(request)"
                    class="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-amber-500 text-white hover:bg-amber-600 whitespace-nowrap"
                >
                  <i class="ti ti-clock-plus"></i>
                  +۵ دقیقه
                </button>

                <!-- رد درخواست -->
                <button
                    @click="rejectExpiredRequest(request)"
                    class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  رد
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ درخواست‌های در انتظار -->
    <div v-if="activePendingRequests.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">درخواست‌های در انتظار</h2>
        <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium animate-pulse">
      {{ activePendingRequests.length }} درخواست جدید
    </span>
      </div>

      <!-- تغییر: گرید ۳ ستونه در دسکتاپ بزرگ -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
            v-for="request in activePendingRequests"
            :key="request.id"
            class="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col h-full"
            :class="request.type === 'online' ? 'border-r-4 border-r-indigo-500' :
              request.type === 'phone' ? 'border-r-4 border-r-amber-500' : 'border-r-4 border-r-red-500'"
        >
          <div class="flex items-start gap-4">
            <!-- آواتار -->
            <div class="relative flex-shrink-0">
              <img :src="resolveUrl(request.petAvatar)" class="w-14 h-14 rounded-2xl object-cover"/>
              <div :class="[
                'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-bounce',
                request.type === 'online' ? 'bg-indigo-500' :
                request.type === 'phone' ? 'bg-amber-500' : 'bg-red-500'
              ]">
                <i :class="[
                  'text-white text-xs',
                  request.type === 'online' ? 'ti ti-message-circle' :
                  request.type === 'phone' ? 'ti ti-calendar-time' : 'ti ti-phone-incoming'
                ]"></i>
              </div>
            </div>

            <!-- اطلاعات -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-lg truncate">{{ request.petName }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ request.ownerName }} • {{ request.petType }}</p>
                </div>
                <span :class="[
                  'px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap',
                  request.type === 'online' ? 'bg-indigo-100 text-indigo-700' :
                  request.type === 'phone' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                ]">
              {{
                    request.type === 'online' ? '💬 آنلاین' :
                        request.type === 'phone' ? '📅 زمان‌دار' : '📞 فوری'
                  }}
            </span>
              </div>

              <div v-if="request.description" class="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-3">
                <p class="text-sm text-amber-800">
                  <i class="ti ti-alert-circle ml-1"></i>
                  {{ request.description }}
                </p>
              </div>

              <!-- تایمر -->
              <div v-if="request.type === 'phone' || request.type === 'urgent-consult'"
                   :class="[
                 'p-3 rounded-xl flex items-center gap-2 mb-3',[10,5,1,0].includes(request.remainingMinutes)
                   ? 'bg-red-100 border-2 border-red-500 animate-pulse'
                   : 'bg-amber-50 border border-amber-100'
               ]">
                <i :class="[
                  'ti text-lg',[10,5,1,0].includes(request.remainingMinutes)
                    ? 'ti-alert text-red-500'
                    : 'ti-clock text-amber-500'
                ]"></i>
                <p :class="[
                  'text-sm font-medium',[10,5,1,0].includes(request.remainingMinutes)
                    ? 'text-red-700'
                    : 'text-amber-800'
                ]">
                  {{ request.remainingMinutes }} دقیقه دیگر
                </p>
              </div>

              <!-- اطلاعات تماس -->
              <div class="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span class="flex items-center gap-1">
              <i class="ti ti-clock"></i>
              <span>{{ formatWaitTime(request.createdAt) }}</span>
            </span>
                <span class="flex items-center gap-1">
              <i class="ti ti-phone"></i>
              <span class="font-mono">{{ request.phone }}</span>
            </span>
              </div>

              <!-- دکمه‌های عملیات -->
              <div class="flex flex-wrap gap-2 mt-auto">
                <button
                    @click="acceptRequest(request)"
                    :class="[
                'flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 hover:scale-105 whitespace-nowrap',
                request.type === 'online'
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600' :
                  request.type === 'phone'
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              ]"
                >
                  <i :class="request.type === 'online' ? 'ti ti-message-circle' :
                         request.type === 'phone' ? 'ti ti-calendar-time' : 'ti ti-phone'"></i>
                  {{
                    request.type === 'online' ? 'شروع گفتگو' :
                        request.type === 'phone' ? 'شروع تماس' : 'برقراری تماس'
                  }}
                </button>

                <button
                    @click="rejectRequest(request)"
                    class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  رد کردن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ حالت خالی - فقط وقتی هیچ درخواستی نداریم -->
    <div v-if="activePendingRequests.length === 0 && expiredRequestsList.length === 0 && isOnline" class="bg-white rounded-2xl p-12 text-center">
      <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="ti ti-mood-smile text-5xl text-emerald-500"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">درخواست فوری جدیدی ندارید</h3>
      <p class="text-gray-500 max-w-md mx-auto">
        شما آنلاین هستید و آماده پاسخگویی. به محض دریافت درخواست گفتگو یا تماس، به شما اطلاع داده می‌شود.
      </p>
    </div>

    <!-- حالت آفلاین -->
    <div v-if="!isOnline" class="bg-white rounded-2xl p-12 text-center">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="ti ti-power-off text-5xl text-gray-400"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">شما آفلاین هستید</h3>
      <p class="text-gray-500 max-w-md mx-auto mb-6">
        برای دریافت درخواست‌های گفتگوی آنلاین و تماس فوری، وضعیت خود را فعال کنید.
      </p>
    </div>

    <!-- تاریخچه امروز -->
    <div v-if="todayHistory.length > 0" class="bg-white rounded-2xl overflow-hidden">
      <div class="p-4 border-b border-gray-100">
        <h2 class="font-bold text-gray-900">تاریخچه امروز</h2>
      </div>
      <div class="divide-y divide-gray-50">
        <div
            v-for="item in todayHistory"
            :key="item.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              item.type === 'online-chat' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'
            ]">
              <i :class="item.type === 'online-chat' ? 'ti ti-message-circle text-xl' : 'ti ti-phone text-xl'"></i>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ item.petName }}</p>
              <p class="text-sm text-gray-500">{{ item.ownerName }}</p>
            </div>
          </div>
          <div class="text-left">
            <p class="text-sm text-gray-700">{{ item.time }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500">{{ item.duration }} دقیقه</span>
              <span :class="[
                'text-xs px-2 py-0.5 rounded-full',
                item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]">
                {{ item.status === 'completed' ? 'انجام شد' : 'رد شد' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال جلسه فعال -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="activeSession"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-gray-200">
            <!-- هدر -->
            <div :class="[
              'p-6 text-white relative overflow-hidden',
              activeSession.type === 'online' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' : 'bg-gradient-to-br from-red-500 to-red-600'
            ]">
              <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div class="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <img :src="resolveUrl(activeSession.petAvatar)"
                       class="w-16 h-16 rounded-2xl object-cover border-2 border-white/30"/>
                  <div>
                    <h3 class="font-bold text-xl">{{ activeSession.petName }}</h3>
                    <p class="text-sm opacity-80">{{ activeSession.ownerName }}</p>
                  </div>
                </div>
                <div class="text-left">
                  <div class="text-3xl font-mono font-bold">{{ formatDuration(sessionDuration) }}</div>
                  <p class="text-xs opacity-80 mt-1">
                    {{ activeSession.type === 'online' ? '💬 گفتگوی آنلاین' : '📞 تماس تلفنی' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- محتوا -->
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs text-gray-500 mb-1">نوع حیوان</p>
                  <p class="font-medium text-gray-900">{{ activeSession.petType }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs text-gray-500 mb-1">شماره تماس</p>
                  <p class="font-medium text-gray-900 font-mono">{{ activeSession.phone }}</p>
                </div>
              </div>

              <div v-if="activeSession.description" class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                <p class="text-xs text-amber-600 mb-1 font-medium">توضیحات بیمار</p>
                <p class="text-sm text-amber-800">{{ activeSession.description }}</p>
              </div>

              <!-- دکمه‌ها -->
              <div class="flex gap-3">
                <button
                    @click="endSession"
                    class="flex-1 py-3.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <i class="ti ti-check"></i>
                  پایان و ثبت ویزیت
                </button>

                <a
                    v-if="activeSession.type === 'phone' || activeSession.type === 'urgent-consult'"
                    :href="getTelHref(activeSession.phone)"
                    @click.prevent="startPhoneCall(activeSession.phone)"
                    class="px-6 py-3.5 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
                >
                  <i class="ti ti-phone"></i>
                  تماس
                </a>

                <button
                    v-if="activeSession.type === 'online'"
                    @click="openChatWindow"
                    class="px-6 py-3.5 bg-indigo-100 text-indigo-600 rounded-xl font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2"
                >
                  <i class="ti ti-message-circle"></i>
                  چت
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js"
import {useSocketStore} from "@/stores/socket.js";
import {useAuthStore} from "@/stores/auth.js"
import CapacitySettingsModal from "@/components/vet/CapacitySettingsModal.vue";
import {useUrlHelper} from "@/composables/useUrlHelper.js";
const route=useRoute()
let appointment = ref(null)
const {resolveUrl}=useUrlHelper()
const authStore = useAuthStore()
const socketStore = useSocketStore()
const appointmentStore = useAppointmentStore()
const router = useRouter()

// --- متغیرهای اصلی ---
const alertedRequests = ref([])      // هشدارهای نمایش‌داده‌شده
const expiredRequests = ref([])     // آیدی درخواست‌های منقضی‌شده
const alertMessage = ref('')
const tick = ref(0)
let tickInterval = null

// تایمرهای شمارش معکوس
const scheduledCountdowns = ref({})
let countdownInterval = null

// نوتیفیکیشن
const notificationPermission = ref('default')
const notificationSupported = ref(false)

// --- State ---
const isOnline = computed(async () => {
  const onlineUsers = socketStore.onlineUsers
  return authStore.calculateOnlineStatus(onlineUsers)
})

const activeSession = ref(null)
const sessionDuration = ref(0)
const sessionStartedAt = ref(null)
let durationInterval = null

const URGENT_SESSION_STORAGE_KEY = 'panelAdmin.clinic.urgentSession.v1'

// --- Computed ---
const allAppointments = computed(() => appointmentStore.appointments || [])

// ۱. لیست درخواست‌های در انتظار
const pendingRequests = computed(() => {
  void tick.value
  void scheduledCountdowns.value

  return allAppointments.value
      .filter(apt =>
          apt.status === 'pending' ||
          apt.status === 'confirmed' ||
          apt.status === 'in-chat'
      )
      .filter(apt => apt.visitType === 'phone' || apt.visitType === 'urgent-consult')
      .map(apt => {
        let remainingMinutes = null

        if (apt.visitType === 'phone' || apt.visitType === 'urgent-consult') {
          const baseMinutes = getDurationMinutes(apt.duration)
          if (baseMinutes !== null) {
            remainingMinutes = scheduledCountdowns.value[apt.id] ?? baseMinutes
          }
        }

        return {
          id: apt.id,
          consultationId: apt.consultationId,
          type: apt.visitType,
          petName: apt.petName || 'حیوان خانگی',
          petType: apt.petType || 'نامشخص',
          petAvatar: apt.petAvatar || `https://ui-avatars.com/api/?name=${apt.ownerName}&background=random`,
          ownerName: apt.ownerName || 'کاربر',
          phone: apt.phone || apt.ownerPhone || '',
          remainingMinutes: remainingMinutes,
          duration: apt.duration,
          description: apt.description || apt.notes || '',
          createdAt: apt.createdAt,
          trackingCode: apt.trackingCode,
          originalData: apt
        }
      })
})

// ✅ درخواست‌های فعال (منقضی‌نشده)
const activePendingRequests = computed(() => {
  return pendingRequests.value.filter(req => {
    // اگر نوع تماس زمان‌دار است و به صفر رسیده، نمایش نده
    if ((req.type === 'phone' || req.type === 'urgent-consult') && req.remainingMinutes === 0) {
      return false
    }
    return true
  })
})

// ✅ درخواست‌های منقضی‌شده (برای نمایش در بخش جداگانه)
const expiredRequestsList = computed(() => {
  return pendingRequests.value.filter(req => {
    if (req.type !== 'phone' && req.type !== 'urgent-consult') return false
    if (req.remainingMinutes !== 0) return false
    return true
  })
})

// ۲. تاریخچه امروز
const todayHistory = computed(() => {
  return allAppointments.value
      // ۱. فیلتر کردن بر اساس وضعیت (کامپلت یا کنسل شده)
      .filter(apt =>
          apt.status === 'completed' ||
          apt.status === 'cancelled' ||
          apt.cancelled === true
      )
      // ۲. فیلتر کردن برای حذف in-person (فقط phone و online باقی بمانند)
      .filter(apt => apt.visitType === 'phone' || apt.visitType === 'online' || apt.visitType === 'urgent-consult' )
      .map(apt => {
        // تعیین نوع بر اساس visitType
        let type = 'phone-call'
        if (apt.visitType === 'online') {
          type = 'online-chat'
        }

        let duration = 0
        if (typeof apt.duration === 'string' && apt.duration.startsWith('min')) {
          duration = parseInt(apt.duration.replace('min', ''))
        } else if (typeof apt.duration === 'string') {
          duration = apt.duration
        }

        return {
          id: apt.id,
          type: type,
          petName: apt.petName,
          ownerName: apt.ownerName,
          duration: duration,
          time: apt.time || '00:00',
          status: apt.status === 'completed' ? 'completed' : 'rejected'
        }
      })
      .sort((a, b) => b.id.localeCompare(a.id))
})

// آمار امروز
const todayStats = computed(() => ({
  chats: todayHistory.value.filter(h => h.type === 'online-chat' && h.status === 'completed').length,
  calls: todayHistory.value.filter(h => h.type === 'phone-call' && h.status === 'completed').length,
  totalMinutes: todayHistory.value.reduce((sum, h) => sum + (h.status === 'completed' ? Number(h.duration) : 0), 0)
}))

// --- توابع اصلی ---

function startScheduledCountdowns() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  updateCountdowns()
  countdownInterval = setInterval(() => {
    updateCountdowns()
  }, 60000)
}

function updateCountdowns() {
  pendingRequests.value.forEach(request => {
    if (request.type !== 'phone' && request.type !== 'urgent-consult') return

    const minutes = getDurationMinutes(request.duration)
    if (minutes === null) return

    const currentMinutes = scheduledCountdowns.value[request.id] ?? minutes
    const newMinutes = Math.max(0, currentMinutes - 1)

    scheduledCountdowns.value[request.id] = newMinutes

    // هشدارها
    if ([10, 5, 1, 0].includes(newMinutes)) {
      const alertKey = `${request.id}-${newMinutes}`
      if (!alertedRequests.value.includes(alertKey)) {
        alertedRequests.value.push(alertKey)
        showAlert(newMinutes, request.petName)
      }
    }
  })
}

function showAlert(minutes, petName = '') {
  const message = minutes === 0
      ? `⏰ زمان تماس با ${petName} به پایان رسید!`
      : `تماس زمان‌دار ${minutes} دقیقه دیگر فرا می‌رسد!`

  showNotification('یادآوری تماس', {
    body: message,
    icon: '/favicon.ico',
    tag: `call-${minutes}`,
    requireInteraction: true
  })

  alertMessage.value = message
  setTimeout(() => {
    alertMessage.value = ''
  }, 5000)
}

function showToast(message) {
  alertMessage.value = message
  setTimeout(() => {
    alertMessage.value = ''
  }, 4000)
}

function getDurationMinutes(duration) {
  if (!duration) return null
  const str = String(duration).trim().toLowerCase()
  if (/^\d+$/.test(str)) {
    return parseInt(str)
  }
  if (str.includes('min')) {
    return parseInt(str.replace(/\D/g, ''))
  }
  if (str.includes('hour') || str.includes('ساعت')) {
    const hours = parseInt(str.replace(/\D/g, ''))
    return hours * 60
  }
  return null
}

// ✅ رد درخواست منقضی‌شده
async function rejectExpiredRequest(request) {
  try {
    await appointmentStore.changeStatusToCancelled(request.id, 'expired')
    console.log(`درخواست ${request.id} به دلیل انقضا رد شد`)
  } catch (error) {
    console.error('خطا در رد درخواست:', error)
  }
}

// ✅ تمدید زمان
async function extendExpiredRequest(request) {
  try {
    const extraMinutes = 5
    const currentMinutes = scheduledCountdowns.value[request.id] ?? 0
    scheduledCountdowns.value[request.id] = currentMinutes + extraMinutes

    if (socketStore.isConnected) {
      socketStore.emit('request-extended', {
        requestId: request.id,
        newMinutes: currentMinutes + extraMinutes,
        reason: 'extended-by-doctor'
      })
    }

    showToast(`زمان تماس با ${request.petName} به مدت ${extraMinutes} دقیقه تمدید شد`)
  } catch (error) {
    console.error('خطا در تمدید زمان:', error)
  }
}

// ✅ پذیرش درخواست منقضی‌شده
async function acceptExpiredRequest(request) {
  if (activeSession.value) {
    showToast('شما در حال حاضر یک جلسه فعال دارید')
    return
  }
  await acceptRequest(request)
}

// --- توابع کمکی ---

function formatWaitTime(date) {
  const dateObj = new Date(date)
  const time = dateObj.getTime()
  if (isNaN(time)) return 'زمان نامشخص'
  const diffMs = Date.now() - time
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'کمتر از یک دقیقه'
  if (minutes < 60) return `${minutes} دقیقه`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ساعت`
  const days = Math.floor(hours / 24)
  return `${days} روز`
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function normalizePhoneForTel(phone) {
  if (!phone) return ''
  const fa = '۰۱۲۳۴۵۶۷۸۹'
  const ar = '٠١٢٣٤٥٦٧٨٩'
  const en = '0123456789'
  const asString = String(phone)
  let out = ''
  for (const ch of asString) {
    const faIndex = fa.indexOf(ch)
    if (faIndex >= 0) { out += en[faIndex]; continue }
    const arIndex = ar.indexOf(ch)
    if (arIndex >= 0) { out += en[arIndex]; continue }
    out += ch
  }
  out = out.trim().replace(/\s+/g, '').replace(/(?!^)\+/g, '').replace(/[^0-9+]/g, '')
  return out
}

function getTelHref(phone) {
  const normalized = normalizePhoneForTel(phone)
  return normalized ? `tel:${normalized}` : '#'
}

function startPhoneCall(phone) {
  const href = getTelHref(phone)
  if (href === '#') return
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

// --- مدیریت Session ---

function clearSessionTimer() {
  if (durationInterval) {
    clearInterval(durationInterval)
    durationInterval = null
  }
}

function syncSessionDuration() {
  if (!sessionStartedAt.value) {
    sessionDuration.value = 0
    return
  }
  sessionDuration.value = Math.max(0, Math.floor((Date.now() - sessionStartedAt.value) / 1000))
}

function startSessionTimer(startedAt) {
  sessionStartedAt.value = startedAt
  syncSessionDuration()
  clearSessionTimer()
  durationInterval = setInterval(() => {
    syncSessionDuration()
  }, 1000)
}

function persistActiveSession() {
  try {
    localStorage.setItem(
        URGENT_SESSION_STORAGE_KEY,
        JSON.stringify({activeSession: activeSession.value, startedAt: sessionStartedAt.value})
    )
  } catch {}
}

function clearPersistedSession() {
  try {
    localStorage.removeItem(URGENT_SESSION_STORAGE_KEY)
  } catch {}
}

function restoreActiveSession() {
  try {
    const raw = localStorage.getItem(URGENT_SESSION_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return
    if (!parsed.activeSession || !parsed.startedAt) return
    activeSession.value = parsed.activeSession
    startSessionTimer(Number(parsed.startedAt))
  } catch {}
}

async function acceptRequest(request) {
  activeSession.value = request
  startSessionTimer(Date.now())

  const payload = {
    appointmentDate: new Date()
  }
  await appointmentStore.approvedAppointment(request.id)
  await appointmentStore.changeStatusToInProgress(request.id, payload)
  persistActiveSession()

  // // ✅ اصلاح: بررسی نوع درست
  // if (request.type === 'phone' || request.type === 'urgent-consult') {
  //   startPhoneCall(request.phone)
  // }
}

async function rejectRequest(request) {
  await appointmentStore.changeStatusToCancelled(request.id, 'rejectedReason')
  console.log('Request rejected:', request.id)
}

async function endSession() {
  syncSessionDuration()
  clearSessionTimer()

  const durationInMinutes = Math.ceil(sessionDuration.value / 60)
  const payload = {
    completedAt: new Date(),
    duration: String(durationInMinutes)
  }

  await appointmentStore.changeStatusToCompleted(activeSession.value.id, payload)

  activeSession.value = null
  sessionDuration.value = 0
  sessionStartedAt.value = null
  clearPersistedSession()
}

async function openChatWindow() {
  if (activeSession.value && activeSession.value.id) {
    await appointmentStore.changeStatusToInChat(activeSession.value.id)
    await router.push(`/clinics/chat/${activeSession.value.consultationId}`)
  }
}

function startTick() {
  tickInterval = setInterval(() => {
    tick.value++
  }, 60000)
}

// --- نوتیفیکیشن ---

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    notificationSupported.value = false
    return false
  }

  notificationSupported.value = true

  if (Notification.permission === 'granted') {
    notificationPermission.value = 'granted'
    return true
  }

  if (Notification.permission === 'denied') {
    notificationPermission.value = 'denied'
    return false
  }

  const permission = await Notification.requestPermission()
  notificationPermission.value = permission
  return permission === 'granted'
}

function showNotification(title, options = {}) {
  if (!notificationSupported.value) return null
  if (Notification.permission !== 'granted') return null

  try {
    const notification = new Notification(title, {
      body: options.body || '',
      icon: options.icon || '/favicon.ico',
      tag: options.tag || 'default',
      requireInteraction: options.requireInteraction ?? true,
      silent: options.silent ?? false,
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    setTimeout(() => notification.close(), 10000)
    return notification
  } catch (error) {
    console.error('خطا در نمایش نوتیفیکیشن:', error)
    return null
  }
}

function openNotificationSettings() {
  if (navigator.userAgent.includes('Chrome')) {
    window.open('chrome://settings/content/notifications', '_blank')
  } else if (navigator.userAgent.includes('Firefox')) {
    window.open('about:preferences#privacy', '_blank')
  } else {
    alert('لطفاً در تنظیمات مرورگر، نوتیفیکیشن‌ها را فعال کنید.')
  }
}

// --- Lifecycle ---

onMounted(async () => {
  restoreActiveSession()
  startTick()
  startScheduledCountdowns()
  await requestNotificationPermission()

  if (route.query.appointmentId) {
    try {
      appointment.value=pendingRequests.value.find((a)=>String(a.id)===String(route.query.appointmentId))

      await acceptRequest(appointment.value)
    } catch (e) {
      console.error('Error parsing appointment:', e)
    }
  }
})

onUnmounted(() => {
  clearSessionTimer()
  if (tickInterval) clearInterval(tickInterval)
  if (countdownInterval) clearInterval(countdownInterval)
})

// متغیرهای جدید
const showCapacityModal = ref(false)
const capacitySettings = ref({})
const capacityStats = ref({
  chat: { active: 0, max: 1, queue: 0 },
  phoneInstant: { active: 0, max: 1, queue: 0 },
  phoneScheduled: { active: 0, max: 1, queue: 0 },
})

// --- توابع جدید ---
async function openCapacitySettings() {
  try {
    // دریافت تنظیمات فعلی از سرور
    capacitySettings.value = await appointmentStore.fetchCapacitySettings()

    // دریافت آمار فعلی
    capacityStats.value = await appointmentStore.fetchCapacityStats()

    showCapacityModal.value = true
  } catch (error) {
    console.error('خطا در دریافت تنظیمات:', error)
  }
}

function onCapacitySettingsUpdate(newSettings) {
  capacitySettings.value = newSettings
  // به‌روزرسانی وضعیت محلی
  updateLocalOnlineStatus(newSettings.isOnline)
}

function updateLocalOnlineStatus(isOnline) {
  if (socketStore.isConnected) {
    socketStore.emit('change_user_status', { status: isOnline ? 'online' : 'offline' })
  }
}

// --- آمار ظرفیت از computed ---
const liveCapacityStats = computed(() => {
  const appointments = allAppointments.value
  const now = Date.now()
  const RECENT_WINDOW_MS = 30 * 60 * 1000 // ۳۰ دقیقه

  const recentAppointments = appointments.filter(apt => {
    const aptTime = new Date(apt.createdAt).getTime()
    return (now - aptTime) < RECENT_WINDOW_MS
  })

  const chatAppointments = recentAppointments.filter(apt =>
      apt.visitType === 'online' && apt.status === 'in-progress'
  )
  const phoneInstantAppointments = recentAppointments.filter(apt =>
      apt.visitType === 'urgent-consult' && apt.status === 'in-progress'
  )
  const phoneScheduledAppointments = recentAppointments.filter(apt =>
      apt.visitType === 'phone' && apt.status === 'in-progress'
  )

  const queueAppointments = appointments.filter(apt =>
      apt.status === 'queued'
  )

  return {
    chat: {
      active: chatAppointments.length,
      max: capacitySettings.value.chatCapacity || 3,
      queue: queueAppointments.filter(q => q.visitType === 'online').length
    },
    phoneInstant: {
      active: phoneInstantAppointments.length,
      max: capacitySettings.value.phoneInstantCapacity || 2,
      queue: queueAppointments.filter(q => q.visitType === 'urgent-consult').length
    },
    phoneScheduled: {
      active: phoneScheduledAppointments.length,
      max: capacitySettings.value.phoneScheduledCapacity || 5,
      queue: queueAppointments.filter(q => q.visitType === 'phone').length
    }
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}
/* مخفی کردن اسکرول‌بار در مرورگرهای مدرن برای زیبایی بیشتر */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>