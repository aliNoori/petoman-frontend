<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- Toast Notification -->
    <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
    >
      <div
          v-if="toast.show"
          :class="[
          'fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl border border-white/20 flex items-center gap-3 min-w-80',
          toast.type === 'success' ? 'bg-emerald-600 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        ]"
      >
        <i :class="[
          'text-2xl',
          toast.type === 'success' ? 'ti ti-circle-check' :
          toast.type === 'error' ? 'ti ti-circle-x' :
          'ti ti-info-circle'
        ]"></i>
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- هدر -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">نوبت‌دهی</h1>
          <p class="text-sm text-gray-500">مدیریت نوبت‌های آنلاین کلینیک</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">

        <router-link
            to="/clinic/appointments"
            class="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all"
            :class="route.path === '/clinic/appointments'
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <i class="ti ti-layout-grid text-xl"></i>
          <span>کارت</span>
        </router-link>

        <router-link
            to="/clinic/appointments/calendar"
            class="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all"
            :class="route.path.includes('/clinic/appointments/calendar')
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <i class="ti ti-calendar text-xl"></i>
          <span>تقویم</span>
        </router-link>

        <router-link
            to="/clinic/appointments/table"
            class="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all"
            :class="route.path.includes('/clinic/appointments/table')
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <i class="ti ti-table text-xl"></i>
          <span>جدول</span>
        </router-link>

        <router-link
            to="/clinic/urgent-requests"
            class="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all"
            :class="route.path.includes('/clinic/urgent-requests')
        ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <i class="ti ti-bolt text-xl text-orange-500"></i>
          <span>فوری</span>
        </router-link>

      </div>
    </div>

    <div class="flex justify-end mb-4 mt-[-10px]"> <!-- mt-[-10px] برای نزدیکی به باکس بالا -->
      <button
          @click="openQueueModal"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
      >
        <i class="ti ti-queue"></i>
        <span>صف انتظار ({{ queueList?.length }})</span>
      </button>
    </div>


    <!-- کارت‌های نوع ویزیت -->
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-3">
      <button
          @click="activePage = 'in-person'"
          :class="[
            'p-4 rounded-xl text-right transition-all',
            activePage === 'in-person' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
          ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              activePage === 'in-person' ? 'bg-white/20' : 'bg-emerald-100'
            ]">
            <i :class="[
                'ti ti-home-check text-xl',
                activePage === 'in-person' ? 'text-white' : 'text-emerald-600'
              ]"></i>
          </div>
          <div class="text-2xl font-bold">{{ stats.inPerson }}</div>
        </div>
        <div class="text-sm font-medium">نوبت‌های حضوری</div>
      </button>

      <button
          @click="activePage = 'home-visit'"
          :class="[
            'p-4 rounded-xl text-right transition-all',
            activePage === 'home-visit' ? 'bg-amber-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
          ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              activePage === 'home-visit' ? 'bg-white/20' : 'bg-amber-100'
            ]">
            <i :class="[
                'ti ti-home-heart text-xl',
                activePage === 'home-visit' ? 'text-white' : 'text-amber-600'
              ]"></i>
          </div>
          <div class="text-2xl font-bold">{{ stats.homeVisit }}</div>
        </div>
        <div class="text-sm font-medium">ویزیت منزل</div>
      </button>

      <button
          @click="activePage = 'online'"
          :class="[
            'p-4 rounded-xl text-right transition-all',
            activePage === 'online' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
          ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              activePage === 'online' ? 'bg-white/20' : 'bg-blue-100'
            ]">
            <i :class="[
                'ti ti-message-circle text-xl',
                activePage === 'online' ? 'text-white' : 'text-blue-600'
              ]"></i>
          </div>
          <div class="text-2xl font-bold">{{ stats.online }}</div>
        </div>
        <div class="text-sm font-medium">گفتگوی آنلاین</div>
      </button>

      <button
          @click="activePage = 'urgent-consult'"
          :class="[
            'p-4 rounded-xl text-right transition-all',
            activePage === 'urgent-consult' ? 'bg-orange-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
          ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              activePage === 'urgent-consult' ? 'bg-white/20' : 'bg-orange-100'
            ]">
            <i :class="[
                'ti ti-bolt text-xl',
                activePage === 'urgent-consult' ? 'text-white' : 'text-orange-600'
              ]"></i>
          </div>
          <div class="text-2xl font-bold">{{ stats.urgentConsult }}</div>
        </div>
        <div class="text-sm font-medium">مشاوره فوری</div>
      </button>

      <button
          @click="activePage = 'phone'"
          :class="[
            'p-4 rounded-xl text-right transition-all',
            activePage === 'phone' ? 'bg-purple-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
          ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              activePage === 'phone' ? 'bg-white/20' : 'bg-purple-100'
            ]">
            <i :class="[
                'ti ti-phone text-xl',
                activePage === 'phone' ? 'text-white' : 'text-purple-600'
              ]"></i>
          </div>
          <div class="text-2xl font-bold">{{ stats.phone }}</div>
        </div>
        <div class="text-sm font-medium">مشاوره تلفنی</div>
      </button>

      <button
          @click="activePage = 'history'"
          :class="[
            'p-4 rounded-xl text-right transition-all',
            activePage === 'history' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
          ]"
      >
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              activePage === 'history' ? 'bg-white/20' : 'bg-gray-100'
            ]">
            <i :class="[
                'ti ti-history text-xl',
                activePage === 'history' ? 'text-white' : 'text-gray-600'
              ]"></i>
          </div>
          <div class="text-2xl font-bold">{{ stats.completed }}</div>
        </div>
        <div class="text-sm font-medium">ویزیت‌های سابق</div>
      </button>
    </div>

    <!-- جستجو -->
    <div class="bg-white rounded-xl p-4">
      <div class="relative">
        <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="جستجو نام بیمار، صاحب، کد رهگیری..."
            class="w-full pr-10 pl-3 py-2.5 bg-gray-50 rounded-lg outline-none"
        />
      </div>
    </div>

    <!-- گرید نوبت‌ها -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="filteredAppointments.length === 0" class="col-span-full bg-white rounded-xl p-12 text-center">
        <i class="ti ti-calendar-off text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">نوبتی یافت نشد</p>
      </div>

      <div
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="bg-white rounded-xl p-4 border border-gray-200"
      >
        <!-- آیکون و نوع -->
        <div class="flex items-start justify-between mb-3">
          <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              getVisitTypeColor(appointment.visitType).bg
            ]">
            <i :class="[
                'text-xl',
                getVisitTypeColor(appointment.visitType).icon
              ]"></i>
          </div>
          <span v-if="appointment.status" :class="[
              'px-2 py-1 text-xs font-medium rounded-lg',
              getStatusColor(appointment.status)
            ]">
              {{ getStatusLabel(appointment.status) }}
            </span>
        </div>

        <!-- نام -->
        <h3 class="text-base font-bold text-gray-900 mb-1">{{ appointment.petName }}</h3>
        <p class="text-sm text-gray-600 mb-1">{{ appointment.ownerName }}</p>

        <!-- نوع ویزیت (فقط در ویزیت‌های سابق) -->
        <div v-if="appointment.completed" class="mb-3">
            <span :class="[
              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg',
              getVisitTypeColor(appointment.visitType).badge
            ]">
              <i :class="[
                'text-sm',
                getVisitTypeColor(appointment.visitType).icon.split(' ')[0],
                getVisitTypeColor(appointment.visitType).icon.split(' ')[1]
              ]"></i>
              {{ getVisitTypeLabel(appointment.visitType) }}
            </span>
        </div>

        <!-- اطلاعات نوبت‌گیرنده -->
        <div class="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
          <div class="flex items-center gap-2 text-sm text-gray-700">
            <i class="ti ti-user text-gray-400"></i>
            <span class="font-medium">{{ appointment.ownerName }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600 font-english">
            <i class="ti ti-phone text-gray-400"></i>
            <a :href="`tel:${appointment.ownerPhone}`" class="hover:text-emerald-600">
              {{ appointment.ownerPhone }}
            </a>
          </div>
          <div v-if="appointment.ownerEmail" class="flex items-center gap-2 text-sm text-gray-600 font-english">
            <i class="ti ti-mail text-gray-400"></i>
            <a :href="`mailto:${appointment.ownerEmail}`" class="hover:text-emerald-600 truncate">
              {{ appointment.ownerEmail }}
            </a>
          </div>
        </div>

        <!-- جزئیات -->
        <div class="space-y-2 mb-3 text-sm">
          <div class="flex items-center gap-2 text-gray-600">
            <i class="ti ti-calendar text-gray-400"></i>
            <span>{{ appointment.date }}</span>
            <span class="mr-auto font-medium">{{ appointment.time }}</span>
          </div>

          <!-- برای نوبت‌های تمام شده -->
          <div v-if="appointment.completed && appointment.duration" class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-clock text-gray-400"></i>
            <span>مدت زمان: {{ toPersianDigits(appointment.duration) }} دقیقه</span>
          </div>

          <!-- نمایش ساعت پایان برای مشاوره فوری و تلفنی - فقط در حالت in-chat -->
          <div
              v-if="(appointment.visitType === 'urgent-consult' || appointment.visitType === 'phone') && appointment.duration && appointment.status === 'in-chat'"
              class="flex items-center gap-2 text-gray-600"
          >
            <i class="ti ti-clock text-gray-400"></i>
            <span class="text-xs">
                <span class="font-medium">{{ appointment.time }}</span>
                <span class="mx-1">تا</span>
                <span class="font-medium">{{ calculateEndTime(appointment.time, appointment.duration) }}</span>
                <span class="text-gray-500 mr-1">({{ toPersianDigits(parseDuration(appointment?.duration)) }} دقیقه)</span>
              </span>
          </div>

          <div class="flex items-center gap-2 text-gray-600">
            <i class="ti ti-stethoscope text-gray-400"></i>
            <span class="truncate">{{ appointment.service }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 font-english">
            <i class="ti ti-qrcode text-gray-400"></i>
            <span class="text-xs">{{ appointment.trackingCode }}</span>
          </div>

          <!-- دلیل لغو (اگر لغو شده باشد) -->
          <div
              v-if="appointment.status === 'cancelled' && appointment.cancelReason"
              class="flex items-start gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg"
          >
            <i class="ti ti-info-circle text-lg shrink-0 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-xs font-medium mb-1">دلیل لغو:</p>
              <p class="text-xs">{{ appointment.cancelReason }}</p>
            </div>
          </div>

          <!-- تایمر برای تماس‌های تلفنی یا مشاوره فوری -->
          <div
              v-if="(appointment.visitType === 'phone' || appointment.visitType === 'urgent-consult') && appointment.remainingTime !== null"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-lg font-english',
                appointment.visitType === 'phone' ? 'text-purple-600 bg-purple-50' : 'text-orange-600 bg-orange-50'
              ]"
          >
            <i class="ti ti-clock text-lg"></i>
            <span class="text-base font-bold">{{ formatTime(appointment.remainingTime) }}</span>
            <span class="text-xs mr-auto">باقیمانده</span>
          </div>
        </div>

        <!-- اطلاعات خاص صف انتظار -->
        <div v-if="activePage === 'queue'" class="mt-2 text-xs text-gray-500">
          <p>شماره نوبت: <span class="font-bold text-gray-800">{{ appointment.queueNumber || '-' }}</span></p>
          <p>زمان پیوستن: <span class="font-english">{{ appointment.joinedQueueAt }}</span></p>
        </div>

        <!-- دکمه‌ها -->
        <div class="flex flex-col gap-2 pt-3 border-t">

          <!-- حالت مخصوص صف انتظار -->
          <template v-if="activePage === 'queue'">
            <button
                @click="startQueueAppointment(appointment)"
                class="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-700"
            >
              <i class="ti ti-player-play"></i>
              پذیرش نوبت
            </button>
            <button
                @click="handleRejectQueueAppointment(appointment)"
                class="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-200"
            >
              <i class="ti ti-ban"></i>
              رد / حذف از صف
            </button>
          </template>
          <!-- گفتگوی آنلاین، تلفنی، یا مشاوره فوری -->
          <template
              v-if="appointment.visitType === 'online' || appointment.visitType === 'phone' || appointment.visitType === 'urgent-consult'">
            <template v-if="appointment.status === 'pending'">
              <button
                  @click="approveAppointment(appointment.id)"
                  class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <i class="ti ti-check"></i>
                تایید درخواست
              </button>
            </template>
            <button
                v-if="appointment.status === 'approved'"
                @click="startChat(appointment.id)"
                :class="[
                  'w-full px-3 py-2 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2',
                  appointment.visitType === 'urgent-consult' ? 'bg-orange-600' : 'bg-emerald-600'
                ]"
            >
              <i :class="appointment.visitType === 'online' ? 'ti ti-message-circle' : 'ti ti-phone'"></i>
              {{ appointment.visitType === 'online' ? 'شروع گفتگو' : 'شروع تماس' }}
            </button>
            <!-- دکمه‌های حالت in-chat -->
            <template v-if="appointment.status === 'in-chat'||appointment.status === 'in-progress'">
              <!-- دکمه ورود به اتاق گفتگو (فقط برای آنلاین) -->
              <button
                  v-if="appointment.visitType === 'online'"
                  @click="router.push(`/clinic/chat/${appointment.consultationId}`)"
                  class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <i class="ti ti-message-circle"></i>
                ورود به اتاق گفتگو
              </button>

              <!-- دکمه تماس مجدد (برای تلفنی و فوری) -->
              <button
                  v-if="appointment.visitType === 'phone' || appointment.visitType === 'urgent-consult'"
                  @click="makePhoneCall(appointment)"
                  class="w-full px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 mb-2"
              >
                <i class="ti ti-phone"></i>
                تماس مجدد با {{ appointment.ownerPhone }}
              </button>

              <!-- دکمه اتمام گفتگو -->
              <button
                  @click="completeChat(appointment.id)"
                  class="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <i class="ti ti-check"></i>
                اتمام مشاوره
              </button>
            </template>
          </template>

          <!-- حضوری یا منزل -->
          <template v-if="appointment.visitType === 'in-person' || appointment.visitType === 'home-visit'">
            <!-- منتظر کد تأیید برای هر دو نوع ویزیت -->
            <div
                v-if="!appointment.examCodeVerified"
                class="space-y-2"
            >
              <div
                  class="w-full px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
              >
                <i class="ti ti-key"></i>
                منتظر کد تأیید از مشتری
              </div>
              <button
                  @click="showExamCodeModal(appointment.id)"
                  class="w-full px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <i class="ti ti-key"></i>
                {{ appointment.visitType === 'home-visit' ? 'ثبت کد معاینه' : 'ثبت کد تأیید' }}
              </button>
            </div>

            <!-- دکمه ویزیت انجام شد (فقط وقتی کد تأیید شده) -->
            <button
                v-else-if="appointment.status==='pending'"
                @click="approveAppointment(appointment.id)"
                class="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <i class="ti ti-check"></i>
              تایید نوبت
            </button>

            <button
                v-else-if="appointment.status==='approved'"
                @click="startVisit(appointment.id)"
                class="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <i class="ti ti-check"></i>
              شروع ویزیت
            </button>

            <button
                v-else-if="appointment.status==='in-progress'"
                @click="completeVisit(appointment.id)"
                class="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <i class="ti ti-check"></i>
              ویزیت انجام شد
            </button>
            <div
                v-else
                class="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <i class="ti ti-circle-check"></i>
              انجام شده
            </div>
          </template>

          <!-- لغو -->
          <button
              v-if="appointment.status !== 'cancelled' && !appointment.completed && appointment.status !== 'pending'"
              @click="showCancelModal(appointment.id)"
              class="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            <i class="ti ti-x"></i>
            لغو نوبت
          </button>

          <!-- رد درخواست (فقط برای pending) -->
          <button
              v-if="appointment.status === 'pending'"
              @click="showCancelModal(appointment.id)"
              class="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
          >
            <i class="ti ti-ban"></i>
            رد درخواست
          </button>
        </div>
      </div>
    </div>


    <!-- Exam Code Modal -->

    <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="examCodeModal.show"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
           @click="closeExamCodeModal">
        <div class="relative bg-white rounded-xl border border-gray-200 max-w-md w-full" @click.stop>
          <Transition
              enter-active-class="transition-all duration-250 ease-out delay-50"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div v-if="examCodeModal.show">
              <!-- Header -->
              <div class="border-b border-gray-200 p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-amber-100 rounded-lg">
                    <i class="ti ti-key text-amber-600 text-xl"></i>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900">ثبت کد معاینه</h3>
                </div>
                <button @click="closeExamCodeModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <i class="ti ti-x w-5 h-5"></i>
                </button>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start gap-2">
                    <i class="ti ti-info-circle text-blue-600 text-lg shrink-0 mt-0.5"></i>
                    <div class="text-sm text-blue-800">
                      <p class="font-medium mb-1">درباره کد معاینه</p>
                      <p class="text-xs">کد معاینه 8 رقمی که از طریق پیامک برای مشتری ارسال شده است را وارد کنید. این کد
                        برای تایید رزرو ویزیت در منزل الزامی است.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">کد معاینه (8 رقم)</label>
                  <input
                      v-model="examCodeModal.code"
                      type="text"
                      maxlength="8"
                      placeholder="b31c0ac1"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-english text-center text-2xl tracking-widest"
                      @input="examCodeModal.code = examCodeModal.code.replace(/\DW/g, '')"
                  >
                  <p class="text-xs text-gray-500 mt-1">کد معاینه ترکیبی ار اعداد و حروف انگلیسی می باشد</p>
                </div>

                <div v-if="examCodeModal.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div class="flex items-center gap-2 text-red-700 text-sm">
                    <i class="ti ti-alert-circle"></i>
                    <span>{{ examCodeModal.error }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 p-4 flex items-center justify-between gap-3">
                <button
                    @click="closeExamCodeModal"
                    class="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  انصراف
                </button>
                <button
                    @click="verifyExamCode"
                    :disabled="examCodeModal.code.length !== 8 || examCodeModal.loading"
                    class="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i v-if="!examCodeModal.loading" class="ti ti-check"></i>
                  <div v-else
                       class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {{ examCodeModal.loading ? 'در حال بررسی...' : 'تایید و ادامه' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>


    <!-- Address Display Modal -->

    <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="addressModal.show"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
           @click="closeAddressModal">
        <div class="relative bg-white rounded-xl border border-gray-200 max-w-lg w-full" @click.stop>
          <Transition
              enter-active-class="transition-all duration-250 ease-out delay-50"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div v-if="addressModal.show">
              <!-- Header -->
              <div class="border-b border-gray-200 p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <i class="ti ti-circle-check text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">کد تایید شد!</h3>
                    <p class="text-sm text-gray-600">اطلاعات آدرس مشتری</p>
                  </div>
                </div>
                <button @click="closeAddressModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <i class="ti ti-x w-5 h-5"></i>
                </button>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div class="flex items-center gap-2 text-green-700 mb-2">
                    <i class="ti ti-check text-lg"></i>
                    <span class="font-medium">رزرو با موفقیت ثبت شد</span>
                  </div>
                  <p class="text-sm text-green-600">کد معاینه با موفقیت تایید شد و رزرو نهایی گردید.</p>
                </div>

                <div class="space-y-3">
                  <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <i class="ti ti-user text-gray-600 text-lg mt-0.5"></i>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500 mb-1">نام مشتری</p>
                      <p class="font-medium text-gray-900">{{ addressModal.customerName }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <i class="ti ti-phone text-gray-600 text-lg mt-0.5"></i>
                    <div class="flex-1">
                      <p class="text-xs text-gray-500 mb-1">شماره تماس</p>
                      <a :href="`tel:${addressModal.phone}`"
                         class="font-medium text-emerald-600 hover:text-emerald-700 font-english">
                        {{ addressModal.phone }}
                      </a>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <i class="ti ti-map-pin text-amber-600 text-lg mt-0.5"></i>
                    <div class="flex-1">
                      <p class="text-xs text-amber-700 mb-1 font-medium">آدرس محل ویزیت</p>
                      <p class="text-sm text-gray-900 leading-relaxed">{{ addressModal.address }}</p>
                    </div>
                  </div>

                  <div v-if="addressModal.notes"
                       class="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <i class="ti ti-note text-blue-600 text-lg mt-0.5"></i>
                    <div class="flex-1">
                      <p class="text-xs text-blue-700 mb-1 font-medium">توضیحات مشتری</p>
                      <p class="text-sm text-gray-900 leading-relaxed">{{ addressModal.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 p-4 flex items-center gap-3">
                <button
                    @click="closeAddressModal"
                    class="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  متوجه شدم
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>


    <!-- Cancel/Reject Modal -->

    <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="cancelModal.show"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
           @click="closeCancelModal">
        <div class="relative bg-white rounded-xl border border-gray-200 max-w-md w-full" @click.stop>
          <Transition
              enter-active-class="transition-all duration-250 ease-out delay-50"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div v-if="cancelModal.show">
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i class="ti ti-ban text-xl text-red-600"></i>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">دلیل لغو/رد نوبت</h3>
                </div>
                <button
                    @click="closeCancelModal"
                    class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i class="ti ti-x text-gray-500"></i>
                </button>
              </div>

              <!-- Body -->
              <div class="p-6">
                <p class="text-sm text-gray-600 mb-4">
                  لطفاً دلیل لغو یا رد این نوبت را به صورت واضح مشخص کنید.
                </p>

                <!-- Reason textarea -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">دلیل:</label>
                  <textarea
                      v-model="cancelModal.reason"
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                      placeholder="مثال: به دلیل پر بودن نوبت‌های امروز، امکان پذیرش وجود ندارد..."
                  ></textarea>
                </div>

                <!-- Error message -->
                <div v-if="cancelModal.error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-600">{{ cancelModal.error }}</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 p-4 flex items-center gap-3">
                <button
                    @click="closeCancelModal"
                    class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  انصراف
                </button>
                <button
                    @click="submitCancelReason"
                    :disabled="!cancelModal.reason.trim() || cancelModal.loading"
                    :class="[
                      'flex-1 px-4 py-2.5 rounded-lg transition-colors font-medium',
                      cancelModal.reason.trim() && !cancelModal.loading
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                >
                  <span v-if="!cancelModal.loading">تایید لغو/رد</span>
                  <div v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال ثبت...
                  </div>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Queue Management Modal -->
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
      <div
          v-if="queueModal.show"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closeQueueModal"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden" @click.stop>

          <!-- Header -->
          <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 shrink-0">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-100 rounded-lg">
                <i class="ti ti-queue text-indigo-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">صف انتظار نوبت‌ها</h3>
                <p class="text-xs text-gray-500">مدیریت و شروع مشاوره برای مراجعین در انتظار</p>
              </div>
            </div>
            <button
                @click="closeQueueModal"
                class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i class="ti ti-x text-xl"></i>
            </button>
          </div>

          <!-- Body (List) -->
          <div class="p-4 overflow-y-auto flex-1 bg-gray-50/50">
            <!-- Loading State -->
            <div v-if="appointmentStore.queueLoading" class="flex flex-col items-center justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p class="text-gray-500 mt-3 text-sm">در حال دریافت لیست صف...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="queueList.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <i class="ti ti-circle-check text-3xl text-green-600"></i>
              </div>
              <h4 class="text-lg font-medium text-gray-900">صف انتظار خالی است</h4>
              <p class="text-sm text-gray-500 mt-1">هیچ نوبتی در صف انتظار وجود ندارد.</p>
            </div>

            <!-- Queue Items -->
            <div v-else class="space-y-3">
              <div
                  v-for="item in queueList"
                  :key="item.id || item.orderId"
                  class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group"
              >
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <!-- Info Section -->
                  <div class="flex-1 space-y-2">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                        نوبت: {{ item.position || '---' }}
                      </span>
                      <span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {{ getVisitTypeName(item.appointmentType) }}
                      </span>
                    </div>

                    <div>
                      <h4 class="font-bold text-gray-900 text-base">{{ item.appointment?.pet?.name || 'بیمار ناشناس' }}</h4>
                      <p class="text-sm text-gray-600">
                        {{ item.appointment?.pet?.owner?.fullName ||
                      item.appointment?.pet?.owner?.firstName||
                      item.appointment?.pet?.owner?.lastName|| 'صاحب بیمار' }}</p>
                    </div>

                    <div class="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <div class="flex items-center gap-1">
                        <i class="ti ti-clock text-gray-400"></i>
                        <span>ورود: {{ formatTimeOnly(item.createdAt) }}</span>
                      </div>
                      <div class="flex items-center gap-1" v-if="item.estimatedWaitMinutes">
                        <i class="ti ti-hourglass text-gray-400"></i>
                        <span>زمان تقریبی: {{ item.estimatedWaitMinutes }} دقیقه</span>
                      </div>
                    </div>
                  </div>

                  <!-- Actions Section -->
                  <div class="flex sm:flex-col gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-r border-gray-100 pt-3 sm:pt-0 sm:pr-4">
                    <button
                        @click="startQueueAppointment(item)"
                        :disabled="appointmentStore.queueLoading"
                        class="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-200"
                    >
                      <i class="ti ti-player-play"></i>
                      <span>پذیرش نوبت</span>
                    </button>
                    <button
                        @click="rejectQueueAppointment(item)"
                        :disabled="appointmentStore.queueLoading"
                        class="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <i class="ti ti-ban"></i>
                      <span>رد / حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex justify-between items-center">
            <p class="text-xs text-gray-500">
              تعداد نوبت‌های در انتظار: <span class="font-bold text-gray-900">{{ queueList?.length }}</span>
            </p>
            <button
                @click="closeQueueModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import {computed, onUnmounted,onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js";

const appointmentStore = useAppointmentStore()
const appointments = computed(() => appointmentStore.appointments)
console.log('app',appointments.value)
const appointmentStartTimes = ref({}) // برای ذخیره زمان شروع هر نوبت
const router = useRouter()
const route = useRoute()
// در بخش script setup
const queueList = computed(() => appointmentStore.queueList);
const searchQuery = ref('')
const activePage = ref('in-person') // صفحه فعال

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success' // success, error, info
})

const showToast = (message, type = 'success') => {
  toast.value = {show: true, message, type}
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Exam Code Modal
const examCodeModal = ref({
  show: false,
  appointmentId: null,
  code: '',
  error: '',
  loading: false
})

// Address Modal
const addressModal = ref({
  show: false,
  customerName: '',
  phone: '',
  address: '',
  notes: ''
})

// Cancel/Reject Modal
const cancelModal = ref({
  show: false,
  appointmentId: null,
  reason: '',
  loading: false,
  error: ''
})

const showCancelModal = (id) => {
  cancelModal.value = {
    show: true,
    appointmentId: id,
    reason: '',
    loading: false,
    error: ''
  }
}

const closeCancelModal = () => {
  cancelModal.value.show = false
}

// Show exam code modal
const showExamCodeModal = (appointmentId) => {

  examCodeModal.value = {
    show: true,
    appointmentId,
    code: '',
    error: '',
    loading: false
  }
}

// Close exam code modal
const closeExamCodeModal = () => {
  examCodeModal.value.show = false
  setTimeout(() => {
    examCodeModal.value = {
      show: false,
      appointmentId: null,
      code: '',
      error: '',
      loading: false
    }
  }, 300)
}

// Close address modal
const closeAddressModal = () => {
  addressModal.value.show = false
}

// Verify exam code
const verifyExamCode = async () => {
  if (examCodeModal.value.code.length !== 8) {
    examCodeModal.value.error = 'کد معاینه باید 8 رقم باشد'
    return
  }

  examCodeModal.value.loading = true
  examCodeModal.value.error = ''

  try {

    const response = await appointmentStore.changeExamCodeVerified(examCodeModal.value.appointmentId,examCodeModal.value.code)

    // اگر موفق بود
    if (response.data.success) {
      // پیدا کردن نوبت در لیست لوکال برای آپدیت UI
      const appointment = appointments.value.find(a => a.id === examCodeModal.value.appointmentId);
      if (appointment) {
        appointment.examCodeVerified = true;
      }

      // فقط برای ویزیت در منزل آدرس نمایش داده شود
      if (appointment.visitType === 'home-visit') {
        addressModal.value = {
          show: true,
          customerName: response.data.customerName,
          phone: response.data.phone,
          address: response.data.address,
          notes: response.data.notes
        }
      }

      closeExamCodeModal();
      showToast('✅ کد معاینه تایید شد و رزرو نهایی گردید', 'success');
    }

  } catch (error) {
    // مدیریت خطا
    console.error(error);
    examCodeModal.value.error = error.response?.data?.message || 'خطا در تایید کد';
  } finally {
    examCodeModal.value.loading = false;
  }
}
const startVisit = async (id) => {
  const appointment = appointments.value.find(a => a.id === id)
  if (appointment) {
    appointmentStartTimes.value[id] = new Date().toISOString()
    await appointmentStore.changeStatusToInProgress(id)
    if (appointment.visitType === 'online') {
      await router.push(`/clinic/chat/${id}`)
    } else if (appointment.visitType === 'phone') {
      window.location.href = `tel:${appointment.ownerPhone}`
    }
    showToast('🏥 ویزیت شروع شد', 'success')
  }
}

// تایمرها برای تماس‌های تلفنی
const timers = ref({})

const startTimer = (appointmentId, duration) => {
  const appointment = appointments.value.find(a => a.id === appointmentId)
  if (!appointment) return

  appointment.remainingTime = duration * 60 // تبدیل دقیقه به ثانیه

  timers.value[appointmentId] = setInterval(() => {
    if (appointment.remainingTime > 0) {
      appointment.remainingTime--
    } else {
      clearInterval(timers.value[appointmentId])
      delete timers.value[appointmentId]
      showToast('⏰ زمان تماس به پایان رسید', 'info')
    }
  }, 1000)
}

const formatTime = (seconds) => {
  if (!seconds) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
onMounted(async () => {
  // ابتدا لیست را بگیر
  await appointmentStore.fetchAppointments();

  // سپس پالیگ را روشن کن تا تغییرات جدید را ببیند
  await appointmentStore.startPolling();

  // لود کردن لیست صف برای استفاده در تب مربوطه
  await appointmentStore.fetchQueueList();
});
// پاک کردن تایمرها هنگام خروج
onUnmounted(async () => {
  await appointmentStore.stopPolling();
  Object.values(timers.value).forEach(timer => clearInterval(timer))
})

// آمار
const stats = computed(() => ({
  inPerson: appointments.value.filter(a => a.visitType === 'in-person' && !a.completed && a.orderStatus==='CUSTOMER_PAID').length,
  homeVisit: appointments.value.filter(a => a.visitType === 'home-visit' && !a.completed && a.orderStatus==='CUSTOMER_PAID').length,
  online: appointments.value.filter(a => a.visitType === 'online' && !a.completed && a.orderStatus==='CUSTOMER_PAID').length,
  urgentConsult: appointments.value.filter(a => a.visitType === 'urgent-consult' && !a.completed && a.orderStatus==='CUSTOMER_PAID').length,
  phone: appointments.value.filter(a => a.visitType === 'phone' && !a.completed && a.orderStatus==='CUSTOMER_PAID').length,
  completed: appointments.value.filter(a => a.completed).length
}))

// فیلتر بر اساس صفحه فعال
const filteredAppointments = computed(() => {
  let result

  if (activePage.value === 'queue') {
    // اگر تب صف انتظار انتخاب شده، لیست queueList را از استور بگیر
    return appointmentStore.queueList;
  }

  if (activePage.value === 'history') {
    // نمایش تمام ویزیت‌های تمام شده
    result = appointments.value.filter(a => a.completed === true)
  } else {
    // نمایش فقط ویزیت‌های فعال از نوع انتخاب شده
    result = appointments.value.filter(a =>
        a.visitType === activePage.value && !a.completed && a.orderStatus==='CUSTOMER_PAID'
    )
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
        a.petName.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q) ||
        a.trackingCode.toLowerCase().includes(q)
    )
  }

  return result
})

// توابع کمکی
const getVisitTypeLabel = (type) => {
  const labels = {
    'in-person': 'حضوری',
    'home-visit': 'منزل',
    'online': 'آنلاین',
    'urgent-consult': 'مشاوره فوری',
    'phone': 'تلفنی'
  }
  return labels[type] || type
}

const getVisitTypeColor = (type) => {
  const colors = {
    'in-person': {
      bg: 'bg-emerald-100',
      icon: 'ti ti-home-check text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    'home-visit': {
      bg: 'bg-amber-100',
      icon: 'ti ti-home-heart text-amber-600',
      badge: 'bg-amber-100 text-amber-700'
    },
    'online': {
      bg: 'bg-blue-100',
      icon: 'ti ti-message-circle text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    'urgent-consult': {
      bg: 'bg-orange-100',
      icon: 'ti ti-bolt text-orange-600',
      badge: 'bg-orange-100 text-orange-700'
    },
    'phone': {
      bg: 'bg-purple-100',
      icon: 'ti ti-phone text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    }
  }
  return colors[type] || colors['in-person']
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'در انتظار تایید',
    'approved': 'تایید شده',
    'in-chat': 'در حال گفتگو',
    'in-progress':'در حال انجام',
    'completed': 'اتمام یافته',
    'cancelled': 'لغو شده'
  }
  return labels[status] || ''
}

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-amber-100 text-amber-700',
    'approved': 'bg-blue-100 text-blue-700',
    'in-chat': 'bg-emerald-100 text-emerald-700',
    'in-progress': 'bg-emerald-100 text-emerald-700',
    'completed': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}
const toEnglishDigits = (str) => {
  return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
}

// تابع استخراج عدد از فرمت‌های مختلف مثل "min30", "30 min", "30"
const parseDuration = (duration) => {
  if (!duration) return 0

  // اگر عدد خالی بود
  if (typeof duration === 'number') return duration

  // استخراج عدد از رشته با regex
  const match = String(duration).match(/[\d]+/)
  return match ? parseInt(match[0]) : 0
}

// تابع تبدیل اعداد انگلیسی به فارسی
const toPersianDigits = (str) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return str.toString().replace(/[0-9]/g, d => persianDigits[d])
}

// تابع محاسبه ساعت پایان
const calculateEndTime = (startTime, duration) => {
  console.log('startTime', startTime)
  console.log('duration', duration)
  if (!startTime || !duration) return ''

  // تبدیل اعداد فارسی به انگلیسی برای محاسبه
  const englishStartTime = toEnglishDigits(startTime)

  // ✅ استخراج عدد از فرمت‌های مختلف
  const durationMinutes = parseDuration(duration)

  const [hours, minutes] = englishStartTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + durationMinutes

  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60

  // ساخت خروجی با اعداد انگلیسی و سپس تبدیل به فارسی
  const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`

  console.log('endHours', endHours)
  console.log('endMinutes', endMinutes)

  return toPersianDigits(endTime)
}

// اکشن‌ها برای آنلاین/تلفنی
const approveAppointment = async (id) => {
  await appointmentStore.approvedAppointment(id)

  showToast('✅ درخواست تایید شد', 'success')
}
// تابع برقراری تماس تلفنی واقعی
const makePhoneCall = (appointment) => {
  // استفاده از پروتکل tel: برای باز کردن شماره‌گیر گوشی
  window.location.href = `tel:${appointment.ownerPhone}`;
}
// رد درخواست - حذف شده، از showCancelModal استفاده می‌شود

const startChat = async (id) => {
  const appointment = appointments.value.find(a => a.id === id)
  if (appointment) {

    // اگر مشاوره فوری یا تلفنی بود
    if (appointment.visitType === 'phone' || appointment.visitType === 'urgent-consult') {
      // ۱. تغییر وضعیت به in-chat
      await appointmentStore.changeStatusToInChat(id)

      // ۲. شروع تایمر
      if (appointment.duration) {
        startTimer(id, appointment.duration)
      }

      // ۳. برقراری تماس خودکار
      makePhoneCall(appointment)

      const emoji = appointment.visitType === 'urgent-consult' ? '⚡' : '📞'
      showToast(`${emoji} تماس برقرار شد - تایمر شروع گردید`, 'info')
    }
    // اگر گفتگوی آنلاین بود
    else if (appointment.visitType === 'online') {
      await appointmentStore.changeStatusToInChat(id)
      await router.push(`/clinic/chat/${appointment.consultationId}`)
    }
  }
}

const completeChat = async (id) => {
  const appointment = appointments.value.find(a => a.id === id)

  if (appointment) {
    appointment.status = 'completed'
    appointment.completed = true
    await appointmentStore.changeStatusToCompleted(id,{completedAt:new Date().toISOString(),duration:''})

    // پاک کردن تایمر اگر وجود داشت
    if (timers.value[id]) {
      clearInterval(timers.value[id])
      delete timers.value[id]
    }

    const message = appointment.visitType === 'urgent-consult' ? '✅ مشاوره فوری به پایان رسید' :
        appointment.visitType === 'phone' ? '✅ تماس به پایان رسید' :
            '✅ گفتگو به پایان رسید'
    showToast(message, 'success')
  }
}

// اکشن‌ها برای حضوری/منزل
const completeVisit = async (id) => {
  const appointment = appointments.value.find(a => a.id === id)
  if (appointment) {
    let actualDuration = 0
    if (appointmentStartTimes.value[id]) {
      const startTime = new Date(appointmentStartTimes.value[id])
      const endTime = new Date()
      actualDuration = Math.round((endTime - startTime) / 60000) // تبدیل به دقیقه
    }
    appointment.completed = true
    await appointmentStore.changeStatusToCompleted(id, {
      completedAt: new Date().toISOString(),
      duration: String(actualDuration)
    })
    showToast('✅ ویزیت انجام شد', 'success')
  }
}

// لغو نوبت با دلیل
const submitCancelReason = async () => {
  if (!cancelModal.value.reason.trim()) {
    cancelModal.value.error = 'لطفاً دلیل لغو/رد را وارد کنید'
    return
  }

  cancelModal.value.loading = true
  cancelModal.value.error = ''

  const appointment = appointments.value.find(a => a.id === cancelModal.value.appointmentId)
  if (appointment) {
    appointment.status = 'cancelled'
    appointment.cancelReason = cancelModal.value.reason
    appointment.cancelledAt = new Date().toISOString()
    appointment.completed = true // به سابقه منتقل شود

    await appointmentStore.changeStatusToCancelled(appointment.id, cancelModal.value.reason)

    showToast('❌ نوبت لغو شد و دلیل برای مشتری ارسال گردید', 'error')
  }

  closeCancelModal()
}

// --- متغیرهای جدید برای مودال صف ---
const queueModal = ref({
  show: false,
  processingId: null // برای جلوگیری از کلیک تکراری
});

// --- توابع جدید برای مدیریت مودال و صف ---

// باز کردن مودال
const openQueueModal = async () => {
  queueModal.value.show = true;
  queueModal.value.processingId = null;
  // لود کردن لیست اگر خالی است
  if (appointmentStore.queueList.length === 0) {
    await appointmentStore.fetchQueueList();
  }
};

// بستن مودال
const closeQueueModal = () => {
  queueModal.value.show = false;
  queueModal.value.processingId = null;
};

// توابع جدید برای مدیریت صف
const handleStartQueueAppointment = async (queueItem) => {
  try {
    // نمایش لودینگ یا غیرفعال کردن دکمه
    await appointmentStore.takeAppointmentFromQueue(queueItem.appointmentId);
    showToast('✅ نوبت با موفقیت شروع شد', 'success');

    // رفرش لیست صف
    await appointmentStore.fetchQueueList();
  } catch (error) {
    showToast('❌ خطا در شروع نوبت', 'error');
  }
};

const handleRejectQueueAppointment = async (queueItem) => {
  if (!confirm('آیا مطمئن هستید که می‌خواهید این نوبت را از صف حذف کنید؟')) return;

  try {
    await appointmentStore.removeFromQueue(queueItem.appointmentId);
    showToast('نوبت از صف حذف شد', 'info');
    await appointmentStore.fetchQueueList();
  } catch (error) {
    showToast('خطا در حذف نوبت', 'error');
  }
};

// شروع مشاوره از صف
const startQueueAppointment = async (item) => {
  console.log('qm',queueModal.processingId)
  console.log('qm',queueModal.value.processingId)
  if (queueModal.value.processingId) return; // جلوگیری از کلیک تکراری

  queueModal.value.processingId = item.id || item.orderId;

  try {
    const result = await appointmentStore.takeAppointmentFromQueue(item.appointmentId);

    showToast(result.message, 'success');

    // بستن مودال
    closeQueueModal();



    // اگر نوع ویزیت آنلاین است، به صفحه چت برو
    // نکته: باید اطلاعات کامل نوبت را از استور بگیریم
    if(!result.requiresPayment){
      // رفرش لیست نوبت‌های اصلی تا نوبت شروع شده نمایش داده شود
      await appointmentStore.fetchAppointments();

      const updatedAppointment = appointmentStore.appointments.find(a => a.orderId === item.orderId);

      if (updatedAppointment) {
        if (updatedAppointment.visitType === 'online') {
          await router.push(`/clinic/chat/${updatedAppointment.consultationId}`);
        } else if (['phone', 'urgent-consult'].includes(updatedAppointment.visitType)) {
          // برای تلفنی، می‌توان مستقیم تماس گرفت یا به صفحه اصلی برگشت تا دکمه تماس فعال شود
          showToast(`📞 تماس با ${updatedAppointment.ownerPhone} برقرار شد`, 'info');
          window.location.href = `tel:${updatedAppointment.ownerPhone}`;
        }
      }
    }


  } catch (error) {
    console.error(error);
    showToast('❌ خطا در شروع نوبت', 'error');
  } finally {
    queueModal.value.processingId = null;
  }
};

// رد نوبت از صف
const rejectQueueAppointment = async (item) => {
  if (!confirm('آیا مطمئن هستید که می‌خواهید این نوبت را از صف حذف کنید؟')) return;

  try {
    await appointmentStore.removeFromQueue(item.appointmentId);
    showToast('نوبت از صف حذف شد', 'info');
  } catch (error) {
    showToast('خطا در حذف نوبت', 'error');
  }
};

// تابع کمکی برای فرمت زمان (اگر در کد قبلی نیست)
const formatTimeOnly = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

// تابع کمکی برای نام نوع ویزیت (اگر در کد قبلی نیست)
const getVisitTypeName = (type) => {
  const names = {
    'in-person': 'حضوری',
    'home-visit': 'ویزیت منزل',
    'online': 'آنلاین',
    'phone': 'تلفنی',
    'urgent-consult': 'مشاوره فوری'
  };
  return names[type] || type;
};
</script>
<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
