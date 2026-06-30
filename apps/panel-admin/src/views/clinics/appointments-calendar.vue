<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- هدر -->
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <!-- عنوان و توضیحات -->
      <div class="mb-4">
        <h1 class="text-xl font-bold text-gray-900">تقویم نوبت‌ها</h1>
        <p class="text-sm text-gray-500">مدیریت نوبت‌های هفتگی به تفکیک روز و شیفت</p>
      </div>

      <!-- بخش کنترل‌ها -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <!-- بخش ۱: ناوبری هفته و نمایش تاریخ -->
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <!-- نمایش بازه تاریخ (در موبایل بالای دکمه‌ها یا کنار آن) -->
          <div
              class="bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 whitespace-nowrap">
            {{ weekRangeDisplay }}
          </div>

          <!-- دکمه‌های ناوبری -->
          <div class="flex items-center gap-2">
            <button
                @click="previousWeek"
                :disabled="!canGoPrevious()"
                :class="[
            'p-2 rounded-lg transition-colors border border-gray-200',
            canGoPrevious() ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-50 text-gray-300 cursor-not-allowed border-transparent'
          ]"
            >
              <i class="ti ti-chevron-right"></i>
            </button>

            <button
                @click="goToCurrentWeek"
                class="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
            >
              این هفته
            </button>

            <button
                @click="nextWeek"
                :disabled="!canGoNext()"
                :class="[
            'p-2 rounded-lg transition-colors border border-gray-200',
            canGoNext() ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-50 text-gray-300 cursor-not-allowed border-transparent'
          ]"
            >
              <i class="ti ti-chevron-left"></i>
            </button>
          </div>
        </div>

        <!-- بخش ۲: لینک‌های نما و ابزارها -->
        <!-- flex-1 باعث می‌شود این بخش کل فضای باقی‌مانده را بگیرد -->
        <div class="flex items-center gap-2 w-full sm:w-auto flex-1 sm:flex-none">

          <!-- دکمه استراحت -->
          <button
              @click="openTimeOffModal()"
              class="flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-100"
              title="غیرفعال کردن بازه زمانی (استراحت)"
          >
            <i class="ti ti-coffee text-lg"></i>
            <span class="hidden sm:inline">استراحت</span>
          </button>

          <!-- جداکننده عمودی (فقط دسکتاپ) -->
          <div class="hidden sm:block w-px h-6 bg-gray-300 mx-1"></div>

          <!-- لینک به جدول -->
          <router-link
              to="/clinic/appointments/table"
              class="flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-200"
          >
            <i class="ti ti-table text-lg"></i>
            <span class="hidden sm:inline">جدول</span>
          </router-link>

          <!-- لینک به کارت -->
          <router-link
              to="/clinic/appointments"
              class="flex items-center justify-center flex-1 sm:flex-none gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-200"
          >
            <i class="ti ti-layout-grid text-lg"></i>
            <span class="hidden sm:inline">کارت</span>
          </router-link>

        </div>
      </div>
    </div>

    <!-- ساعات غیرفعال (استراحت) این هفته -->
    <div v-if="timeOffBlocksThisWeek.length" class="bg-white rounded-xl p-4">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 bg-red-50 text-red-700 rounded-lg flex items-center justify-center">
            <i class="ti ti-coffee"></i>
          </div>
          <div>
            <div class="font-bold text-gray-900">ساعت‌های غیرفعال (استراحت) این هفته</div>
            <div class="text-xs text-gray-500">این بازه‌ها برای رزرو جدید نباید قابل انتخاب باشند (فعلاً داده‌ها محلی
              هستند).
            </div>
          </div>
        </div>

        <button
            @click="openTimeOffModal()"
            class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <i class="ti ti-plus"></i>
          افزودن
        </button>
      </div>

      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div
            v-for="block in timeOffBlocksThisWeek"
            :key="block.id"
            class="p-3 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-center justify-between gap-3"
        >
          <div class="min-w-0">
            <div class="font-bold text-sm truncate">{{ getDayLabel(block.date) }}</div>
            <div class="text-xs mt-1">{{ toPersianTime(block.startTime) }} تا {{ toPersianTime(block.endTime) }}</div>
            <div v-if="block.note" class="text-xs opacity-80 mt-1 truncate">{{ block.note }}</div>
          </div>
          <button
              @click="removeTimeOffBlock(block.id)"
              class="w-9 h-9 rounded-lg bg-white/60 hover:bg-white transition-colors flex items-center justify-center"
              title="حذف"
          >
            <i class="ti ti-trash text-red-700"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- آمار هفته -->
    <div class="grid grid-cols-2 md:grid-cols-6 gap-3">
      <div
          class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-emerald-100">کل نوبت‌ها</p>
            <p class="text-2xl font-bold mt-1">{{ weekStats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-calendar-event text-2xl"></i>
          </div>
        </div>
      </div>
      <div
          class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-lg shadow-amber-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-amber-100">در انتظار</p>
            <p class="text-2xl font-bold mt-1">{{ weekStats.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-clock text-2xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-100">تایید شده</p>
            <p class="text-2xl font-bold mt-1">{{ weekStats.approved }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-check text-2xl"></i>
          </div>
        </div>
      </div>
      <div
          class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-100">در حال ویزیت</p>
            <p class="text-2xl font-bold mt-1">{{ weekStats.inProgress }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-stethoscope text-2xl"></i>
          </div>
        </div>
      </div>
      <div
          class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg shadow-green-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-100">انجام شده</p>
            <p class="text-2xl font-bold mt-1">{{ weekStats.completed }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-circle-check text-2xl"></i>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg shadow-red-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-100">لغو شده</p>
            <p class="text-2xl font-bold mt-1">{{ weekStats.cancelled }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-x text-2xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- راهنمای رنگ‌ها -->
    <div class="bg-white rounded-xl p-4">
      <div class="flex items-center flex-wrap gap-4 text-sm">
        <span class="text-gray-500">راهنما:</span>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-amber-500 rounded-full"></span>
          <span class="text-gray-600">در انتظار</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span class="text-gray-600">تایید شده</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
          <span class="text-gray-600">در حال ویزیت</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-green-500 rounded-full"></span>
          <span class="text-gray-600">انجام شده</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 bg-red-500 rounded-full"></span>
          <span class="text-gray-600">لغو شده</span>
        </div>
      </div>
    </div>

    <!-- کانتینر اصلی -->
    <div class="w-full overflow-x-auto scrollbar-hide">
      <!-- جدول با عرض ثابت -->
      <div class="min-w-[800px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">

        <!-- هدر روزهای هفته (استفاده از Grid برای جداسازی دقیق ستون ثابت) -->
        <div class="grid grid-cols-[120px_1fr] border-b border-gray-200 bg-gray-50">
          <!-- ستون ثابت هدر -->
          <div
              class="sticky left-0 z-20 bg-gray-50 p-3 font-medium text-gray-500 text-sm flex items-center justify-center border-r border-gray-200 shrink-0">
            <span class="hidden sm:block">شیفت</span>
            <i class="ti ti-layout-grid text-gray-400 sm:hidden"></i>
          </div>
          <!-- روزهای هفته (قابل اسکرول) -->
          <div class="flex overflow-x-auto">
            <div v-for="day in weekDays" :key="day.date"
                 :class="[
               'p-2 sm:p-3 text-center border-b sm:border-b-0 border-l border-gray-200 first:border-l-0 flex-1 min-w-0',
               day.isToday ? 'bg-emerald-50/50' : 'bg-white'
             ]">
              <div :class="['font-bold text-sm sm:text-base', day.isToday ? 'text-emerald-600' : 'text-gray-700']">
                {{ day.dayName }}
              </div>
              <div :class="['text-xs mt-1', day.isToday ? 'text-emerald-500' : 'text-gray-500']">
                {{ day.dateDisplay }}
              </div>
              <div v-if="day.isToday" class="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-wider">
                امروز
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col">

          <!-- شیفت صبح -->
          <div class="grid grid-cols-[120px_1fr] border-b border-gray-100">
            <!-- ستون ثابت شیفت صبح -->
            <div
                class="sticky left-0 z-10 bg-gradient-to-r from-orange-50 to-orange-50/50 p-3 flex flex-col justify-center items-center gap-1 border-r border-gray-200 shrink-0">
              <i class="ti ti-sunrise text-orange-500 text-xl"></i>
              <div class="text-center">
                <div class="font-bold text-orange-700 text-sm">صبح</div>
                <div class="text-[10px] text-orange-500">۰۸:۰۰ - ۱۲:۰۰</div>
              </div>
            </div>
            <!-- روزهای هفته -->
            <div class="flex overflow-x-auto">
              <div v-for="day in weekDays" :key="'morning-' + day.date"
                   :class="[
                 'p-1 sm:p-2 border-r border-gray-100 first:border-l-0 flex-1 min-w-0',
                 'min-h-[100px] sm:min-h-[120px]',
                 day.isToday ? 'bg-emerald-50/20' : 'bg-white'
               ]">
                <div class="space-y-1.5">
                  <!-- بلوک‌های استراحت -->
                  <div v-for="block in getTimeOffBlocksByDayAndShift(day.date, 'morning')"
                       :key="'block-morning-' + block.id"
                       class="p-1.5 rounded-md text-[10px] sm:text-xs bg-red-50 text-red-700 border border-red-100 flex items-center justify-between gap-1">
                    <div class="min-w-0 flex-1">
                      <div class="font-bold truncate">استراحت</div>
                      <div class="opacity-80 truncate">{{ toPersianTime(block.startTime) }} -
                        {{ toPersianTime(block.endTime) }}
                      </div>
                    </div>
                    <button @click.stop="removeTimeOffBlock(block.id)"
                            class="w-5 h-5 rounded bg-white/80 hover:bg-white flex items-center justify-center shrink-0">
                      <i class="ti ti-x text-[10px]"></i>
                    </button>
                  </div>
                  <!-- نوبت‌ها -->
                  <div v-for="apt in getAppointmentsByDayAndShift(day.date, 'morning')" :key="apt.id"
                       :class="[
                     'p-1.5 sm:p-2 rounded-lg text-xs transition-all hover:shadow-md relative group border border-transparent',
                     getStatusClass(apt.status)
                   ]">
                    <div class="flex items-start justify-between gap-1">
                      <div class="flex-1 min-w-0 cursor-pointer" @click="openAppointmentDetails(apt)">
                        <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.petName }}</div>
                        <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.time }}</div>
                        <div class="text-[9px] sm:text-[10px] opacity-70 truncate">{{ apt.ownerName }}</div>
                      </div>
                      <div class="flex flex-col gap-1 shrink-0">
                        <button
                            v-if="apt.status === 'pending' && !apt.examCodeVerified && (apt.visitType === 'home-visit'||apt.visitType === 'in-person')"
                            @click.stop="showExamCodeModal(apt.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 text-white rounded flex items-center justify-center hover:bg-amber-600 shadow-sm">
                          <i class="ti ti-key text-[10px]"></i></button>
                        <button
                            v-if="apt.status === 'pending' && apt.examCodeVerified &&(apt.visitType === 'home-visit'||apt.visitType === 'in-person')"
                            @click.stop="approveAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 shadow-sm">
                          <i class="ti ti-check text-[10px]"></i>
                        </button>
                        <button
                            v-if="apt.status === 'pending' && (apt.visitType === 'online'||apt.visitType === 'urgent-consult'|| apt.visitType === 'phone')"
                            @click.stop="approveAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 shadow-sm">
                          <i class="ti ti-check text-[10px]"></i>
                        </button>
                        <button
                            v-if="apt.status === 'approved'&& (apt.visitType === 'urgent-consult'|| apt.visitType === 'online')"
                            @click.stop="startAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded flex items-center justify-center hover:bg-purple-600 shadow-sm">
                          <i class="ti ti-player-play text-[10px]"></i></button>
                        <button v-if="apt.status === 'in-chat'"
                                @click="router.push(`/clinic/chat/${apt.consultationId}`)"
                                class="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 text-green-600 rounded flex items-center justify-center hover:bg-green-200">
                          <i class="ti ti-circle-check text-[10px]"></i></button>
                        <button v-if="apt.status === 'in-progress'" @click.stop="completeAppointment(apt)"
                                class="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 shadow-sm">
                          <i class="ti ti-circle-check text-[10px]"></i>
                        </button>

                        <button
                            v-if="apt.status === 'pending'"
                            @click.stop="cancelAppointment(apt.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded flex items-center justify-center hover:bg-red-200 shadow-sm">
                          <i class="ti ti-x text-[10px]"></i></button>
                      </div>
                    </div>
                    <div v-if="apt.status === 'in-progress'"
                         class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse border border-white"></div>
                  </div>
                  <div
                      v-if="getAppointmentsByDayAndShift(day.date, 'morning').length === 0 && getTimeOffBlocksByDayAndShift(day.date, 'morning').length === 0"
                      class="h-full flex items-center justify-center text-gray-200 text-xs">-
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- شیفت عصر -->
          <div class="grid grid-cols-[120px_1fr] border-b border-gray-100">
            <div
                class="sticky left-0 z-10 bg-gradient-to-r from-blue-50 to-blue-50/50 p-3 flex flex-col justify-center items-center gap-1 border-r border-gray-200 shrink-0">
              <i class="ti ti-sun text-blue-500 text-xl"></i>
              <div class="text-center">
                <div class="font-bold text-blue-700 text-sm">عصر</div>
                <div class="text-[10px] text-blue-500">۱۲:۰۰ - ۱۸:۰۰</div>
              </div>
            </div>
            <div class="flex overflow-x-auto">
              <div v-for="day in weekDays" :key="'afternoon-' + day.date"
                   :class="[
                 'p-1 sm:p-2 border-r border-gray-100 first:border-l-0 flex-1 min-w-0',
                 'min-h-[100px] sm:min-h-[120px]',
                 day.isToday ? 'bg-emerald-50/20' : 'bg-white'
               ]">
                <div class="space-y-1.5">
                  <div v-for="block in getTimeOffBlocksByDayAndShift(day.date, 'afternoon')"
                       :key="'block-afternoon-' + block.id"
                       class="p-1.5 rounded-md text-[10px] sm:text-xs bg-red-50 text-red-700 border border-red-100 flex items-center justify-between gap-1">
                    <div class="min-w-0 flex-1">
                      <div class="font-bold truncate">استراحت</div>
                      <div class="opacity-80 truncate">{{ toPersianTime(block.startTime) }} -
                        {{ toPersianTime(block.endTime) }}
                      </div>
                    </div>
                    <button @click.stop="removeTimeOffBlock(block.id)"
                            class="w-5 h-5 rounded bg-white/80 hover:bg-white flex items-center justify-center shrink-0">
                      <i class="ti ti-x text-[10px]"></i>
                    </button>
                  </div>
                  <div v-for="apt in getAppointmentsByDayAndShift(day.date, 'afternoon')" :key="apt.id"
                       :class="[
                     'p-1.5 sm:p-2 rounded-lg text-xs transition-all hover:shadow-md relative border border-transparent',
                     getStatusClass(apt.status)
                   ]">
                    <div class="flex items-start justify-between gap-1">
                      <div class="flex-1 min-w-0 cursor-pointer" @click="openAppointmentDetails(apt)">
                        <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.petName }}</div>
                        <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.time }}</div>
                        <div class="text-[9px] sm:text-[10px] opacity-70 truncate">{{ apt.ownerName }}</div>
                      </div>
                      <div class="flex flex-col gap-1 shrink-0">
                        <button
                            v-if="apt.status === 'pending' && !apt.examCodeVerified && (apt.visitType === 'home-visit'||apt.visitType === 'in-person')"
                            @click.stop="showExamCodeModal(apt.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 text-white rounded flex items-center justify-center hover:bg-amber-600 shadow-sm">
                          <i class="ti ti-key text-[10px]"></i>
                        </button>
                        <button
                            v-if="apt.status === 'pending' && (apt.visitType === 'online'||apt.visitType === 'urgent-consult'|| apt.visitType === 'phone')"
                            @click.stop="approveAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 shadow-sm">
                          <i class="ti ti-check text-[10px]"></i>
                        </button>
                        <button
                            v-if="apt.status === 'pending' && apt.examCodeVerified &&(apt.visitType === 'home-visit'||apt.visitType === 'in-person')"
                            @click.stop="approveAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 shadow-sm">
                          <i class="ti ti-check text-[10px]"></i>
                        </button>
                        <button
                            v-if="apt.status === 'approved'&& (apt.visitType === 'urgent-consult'|| apt.visitType === 'online')"
                            @click.stop="startAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded flex items-center justify-center hover:bg-purple-600 shadow-sm">
                          <i class="ti ti-player-play text-[10px]"></i>
                        </button>
                        <button v-if="apt.status === 'in-chat'"
                                @click="router.push(`/clinic/chat/${apt.consultationId}`)"
                                class="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 text-green-600 rounded flex items-center justify-center hover:bg-green-200">
                          <i class="ti ti-circle-check text-[10px]"></i>
                        </button>
                        <button v-if="apt.status === 'in-progress'" @click.stop="completeAppointment(apt)"
                                class="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 shadow-sm">
                          <i class="ti ti-circle-check text-[10px]"></i>
                        </button>

                        <button
                            v-if="apt.status === 'pending'"
                            @click.stop="cancelAppointment(apt.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded flex items-center justify-center hover:bg-red-200 shadow-sm">
                          <i class="ti ti-x text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                    <div v-if="apt.status === 'in-progress'"
                         class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse border border-white"></div>
                  </div>
                  <div
                      v-if="getAppointmentsByDayAndShift(day.date, 'afternoon').length === 0 && getTimeOffBlocksByDayAndShift(day.date, 'afternoon').length === 0"
                      class="h-full flex items-center justify-center text-gray-200 text-xs">-
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- شیفت شب -->
          <div class="grid grid-cols-[120px_1fr]">
            <div
                class="sticky left-0 z-10 bg-gradient-to-r from-purple-50 to-purple-50/50 p-3 flex flex-col justify-center items-center gap-1 border-r border-gray-200 shrink-0">
              <i class="ti ti-moon text-purple-500 text-xl"></i>
              <div class="text-center">
                <div class="font-bold text-purple-700 text-sm">شب</div>
                <div class="text-[10px] text-purple-500">۱۸:۰۰ - ۲۲:۰۰</div>
              </div>
            </div>
            <div class="flex overflow-x-auto">
              <div v-for="day in weekDays" :key="'evening-' + day.date"
                   :class="[
                 'p-1 sm:p-2 border-r border-gray-100 first:border-l-0 flex-1 min-w-0',
                 'min-h-[100px] sm:min-h-[120px]',
                 day.isToday ? 'bg-emerald-50/20' : 'bg-white'
               ]">
                <div class="space-y-1.5">
                  <div v-for="block in getTimeOffBlocksByDayAndShift(day.date, 'evening')"
                       :key="'block-evening-' + block.id"
                       class="p-1.5 rounded-md text-[10px] sm:text-xs bg-red-50 text-red-700 border border-red-100 flex items-center justify-between gap-1">
                    <div class="min-w-0 flex-1">
                      <div class="font-bold truncate">استراحت</div>
                      <div class="opacity-80 truncate">{{ toPersianTime(block.startTime) }} -
                        {{ toPersianTime(block.endTime) }}
                      </div>
                    </div>
                    <button @click.stop="removeTimeOffBlock(block.id)"
                            class="w-5 h-5 rounded bg-white/80 hover:bg-white flex items-center justify-center shrink-0">
                      <i class="ti ti-x text-[10px]"></i>
                    </button>
                  </div>
                  <div v-for="apt in getAppointmentsByDayAndShift(day.date, 'evening')" :key="apt.id"
                       :class="[
                     'p-1.5 sm:p-2 rounded-lg text-xs transition-all hover:shadow-md relative border border-transparent',
                     getStatusClass(apt.status)
                   ]">
                    <div class="flex items-start justify-between gap-1">
                      <div class="flex-1 min-w-0 cursor-pointer" @click="openAppointmentDetails(apt)">
                        <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.petName }}</div>
                        <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.time }}</div>
                        <div class="text-[9px] sm:text-[10px] opacity-70 truncate">{{ apt.ownerName }}</div>
                      </div>
                      <div class="flex flex-col gap-1 shrink-0">
                        <button
                            v-if="apt.status === 'pending' && !apt.examCodeVerified && (apt.visitType === 'home-visit'||apt.visitType === 'in-person')"
                            @click.stop="showExamCodeModal(apt.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 text-white rounded flex items-center justify-center hover:bg-amber-600 shadow-sm">
                          <i class="ti ti-key text-[10px]"></i></button>
                        <button
                            v-if="apt.status === 'pending' && apt.examCodeVerified &&(apt.visitType === 'home-visit'||apt.visitType === 'in-person')"
                            @click.stop="approveAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 shadow-sm">
                          <i class="ti ti-check text-[10px]"></i>
                        </button>
                        <button
                            v-if="apt.status === 'pending' && (apt.visitType === 'urgent-consult'|| apt.visitType === 'phone')"
                            @click.stop="approveAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center hover:bg-blue-600 shadow-sm">
                          <i class="ti ti-check text-[10px]"></i>
                        </button>

                        <button
                            v-if="apt.status === 'pending' && (apt.visitType === 'online'||apt.visitType === 'urgent-consult'|| apt.visitType === 'phone')"
                            @click.stop="startAppointment(apt)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded flex items-center justify-center hover:bg-purple-600 shadow-sm">
                          <i class="ti ti-player-play text-[10px]"></i>
                        </button>
                        <button v-if="apt.status === 'in-chat'"
                                @click="router.push(`/clinic/chat/${apt.consultationId}`)"
                                class="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 text-green-600 rounded flex items-center justify-center hover:bg-green-200">
                          <i class="ti ti-circle-check text-[10px]"></i>
                        </button>
                        <button v-if="apt.status === 'in-progress'" @click.stop="completeAppointment(apt)"
                                class="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 shadow-sm">
                          <i class="ti ti-circle-check text-[10px]"></i>
                        </button>

                        <button
                            v-if="apt.status === 'pending'"
                            @click.stop="cancelAppointment(apt.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded flex items-center justify-center hover:bg-red-200 shadow-sm">
                          <i class="ti ti-x text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                    <div v-if="apt.status === 'in-progress'"
                         class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse border border-white"></div>
                  </div>
                  <div
                      v-if="getAppointmentsByDayAndShift(day.date, 'evening').length === 0 && getTimeOffBlocksByDayAndShift(day.date, 'evening').length === 0"
                      class="h-full flex items-center justify-center text-gray-200 text-xs">-
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- لیست نوبت‌های روز انتخابی -->
    <div class="bg-white rounded-xl p-4" v-if="selectedDayAppointments.length > 0">
      <h2 class="font-bold text-gray-900 mb-4">
        نوبت‌های {{ selectedDayName }}
        <span class="text-sm font-normal text-gray-500">({{ selectedDayAppointments.length }} نوبت)</span>
      </h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="bg-gray-50">
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">ساعت</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">شیفت</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">حیوان</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">صاحب</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">تلفن</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">نوع ویزیت</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">وضعیت</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="apt in selectedDayAppointments" :key="apt.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ apt.time }}</td>
            <td class="px-4 py-3">
                <span :class="getShiftBadgeClass(apt.shift)">
                  {{ getShiftName(apt.shift) }}
                </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <img :src="apt.petAvatar" class="w-8 h-8 rounded-full object-cover"/>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ apt.petName }}</div>
                  <div class="font-bold text-[11px] sm:text-xs truncate">{{ apt.time }}</div>
                  <div class="text-xs text-gray-500">{{ apt.petType }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ apt.ownerName }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 font-mono">{{ apt.phone }}</td>
            <td class="px-4 py-3">
                <span :class="getVisitTypeBadgeClass(apt.visitType)">
                  {{ getVisitTypeName(apt.visitType) }}
                </span>
            </td>
            <td class="px-4 py-3">
                <span :class="getStatusBadgeClass(apt.status)">
                  {{ getStatusName(apt.status) }}
                </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <!-- ثبت کد معاینه -->
                <button
                    v-if="apt.status === 'pending' && (apt.examCodeVerified === true || apt.examCodeVerified === undefined)"
                    @click="showExamCodeModal(apt.id)"
                    class="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                    title="ثبت کد معاینه"
                >
                  <i class="ti ti-key text-sm"></i>
                </button>
                <!-- تایید نوبت -->
                <button
                    v-if="apt.status === 'pending' && apt.examCodeVerified"
                    @click="approveAppointment(apt)"
                    class="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="تایید"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>
                <!-- شروع ویزیت -->
                <button
                    v-if="apt.status === 'approved'"
                    @click="startAppointment(apt)"
                    class="p-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    title="شروع ویزیت"
                >
                  <i class="ti ti-player-play text-sm"></i>
                </button>

                <button
                    v-if="apt.status === 'in-chat'"
                    @click="router.push(`/clinic/chat/${apt.consultationId}`)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <i class="ti ti-message-circle"></i>
                  ورود به اتاق گفتگو
                </button>
                <!-- پایان ویزیت -->
                <button
                    v-if="apt.status === 'in-progress'"
                    @click="completeAppointment(apt)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="پایان ویزیت"
                >
                  <i class="ti ti-circle-check text-sm"></i>
                </button>
                <!-- جزئیات -->
                <button
                    @click="openAppointmentDetails(apt)"
                    class="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="جزئیات"
                >
                  <i class="ti ti-eye text-sm"></i>
                </button>
                <!-- لغو -->
                <button
                    v-if="apt.status !== 'completed' && apt.status !== 'cancelled'"
                    @click="cancelAppointment(apt)"
                    class="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="لغو"
                >
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- مودال جزئیات نوبت -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="showDetailsModal = false">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">جزئیات نوبت</h3>
          <button @click="showDetailsModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>
        <div class="p-4 space-y-4" v-if="selectedAppointment">
          <!-- اطلاعات حیوان -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <img :src="resolveUrl(selectedAppointment.petAvatar)" class="w-16 h-16 rounded-full object-cover"/>
            <div>
              <h4 class="font-bold text-gray-900">{{ selectedAppointment.petName }}</h4>
              <p class="text-sm text-gray-500">{{ selectedAppointment.petType }} - {{
                  selectedAppointment.petBreed
                }}</p>
            </div>
          </div>

          <!-- اطلاعات صاحب -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-500">صاحب حیوان</label>
              <p class="font-medium text-gray-900">{{ selectedAppointment.ownerName }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">تلفن</label>
              <p class="font-medium text-gray-900 font-mono">{{ selectedAppointment.phone }}</p>
            </div>
          </div>

          <!-- اطلاعات نوبت -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-500">تاریخ</label>
              <p class="font-medium text-gray-900">{{ selectedAppointment.date }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">ساعت</label>
              <p class="font-medium text-gray-900">{{ selectedAppointment.time }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">شیفت</label>
              <span :class="getShiftBadgeClass(selectedAppointment.shift)">
                {{ getShiftName(selectedAppointment.shift) }}
              </span>
            </div>
            <div>
              <label class="text-xs text-gray-500">نوع ویزیت</label>
              <span :class="getVisitTypeBadgeClass(selectedAppointment.visitType)">
                {{ getVisitTypeName(selectedAppointment.visitType) }}
              </span>
            </div>
          </div>

          <!-- خدمت و وضعیت -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-500">خدمت</label>
              <p class="font-medium text-gray-900">{{ selectedAppointment.service }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500">وضعیت</label>
              <span :class="getStatusBadgeClass(selectedAppointment.status)">
                {{ getStatusName(selectedAppointment.status) }}
              </span>
            </div>
          </div>

          <!-- کد رهگیری -->
          <div>
            <label class="text-xs text-gray-500">کد رهگیری</label>
            <p class="font-mono text-lg font-bold text-emerald-600">{{ selectedAppointment.trackingCode }}</p>
          </div>

          <!-- توضیحات -->
          <div v-if="selectedAppointment.notes">
            <label class="text-xs text-gray-500">توضیحات</label>
            <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedAppointment.notes }}</p>
          </div>

          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <!-- ثبت کد معاینه -->
            <button
                v-if="selectedAppointment.status === 'pending' && !selectedAppointment.examCodeVerified"
                @click="showExamCodeModal(selectedAppointment.id); showDetailsModal = false"
                class="flex-1 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              <i class="ti ti-key ml-1"></i>
              ثبت کد معاینه
            </button>
            <!-- تایید نوبت -->
            <button
                v-if="selectedAppointment.status === 'pending' && selectedAppointment.examCodeVerified"
                @click="approveAppointment(selectedAppointment); showDetailsModal = false"
                class="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              تایید نوبت
            </button>
            <button
                v-if="selectedAppointment.status === 'approved'"
                @click="startAppointment(selectedAppointment); showDetailsModal = false"
                class="flex-1 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              شروع ویزیت
            </button>
            <button
                v-if="selectedAppointment.status === 'in-progress'"
                @click="completeAppointment(selectedAppointment); showDetailsModal = false"
                class="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              پایان ویزیت
            </button>
            <button
                v-if="selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled'"
                @click="cancelAppointment(selectedAppointment); showDetailsModal = false"
                class="flex-1 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              لغو نوبت
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال غیرفعال‌کردن ساعات (استراحت) -->
    <div
        v-if="showTimeOffModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="closeTimeOffModal"
    >
      <div class="bg-white rounded-2xl w-full max-w-md">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">غیرفعال‌کردن بازه زمانی (استراحت)</h3>
          <button @click="closeTimeOffModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>

        <div class="p-4 space-y-4">
          <div v-if="timeOffError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {{ timeOffError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تاریخ</label>
            <select
                v-model="timeOffForm.date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="" disabled>انتخاب کنید</option>
              <option v-for="d in weekDays" :key="'opt-timeoff-' + d.date" :value="d.date">
                {{ d.dayName }} {{ d.dateDisplay }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">از ساعت</label>
              <input
                  v-model="timeOffForm.startTime"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">تا ساعت</label>
              <input
                  v-model="timeOffForm.endTime"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">یادداشت (اختیاری)</label>
            <input
                v-model="timeOffForm.note"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="مثلاً استراحت / جلسه / کار اداری"
            />
          </div>

          <div class="flex items-center justify-end gap-2">
            <button @click="closeTimeOffModal"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              انصراف
            </button>
            <button @click="addTimeOffBlock"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              ثبت
            </button>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js";
import {toJalaali} from "jalaali-js";
import {useRouter} from "vue-router";
import {useUrlHelper} from "@/composables/useUrlHelper.js";

const router = useRouter()
const {resolveUrl} = useUrlHelper();
const appointmentStore = useAppointmentStore()
const appointmentStartTimes = ref({}) // برای ذخیره زمان شروع هر نوبت
// وضعیت‌ها
const currentWeekStart = ref(new Date())
const showDetailsModal = ref(false)
const selectedAppointment = ref(null)
const selectedDay = ref(null)
// Address Modal
const addressModal = ref({
  show: false,
  customerName: '',
  phone: '',
  address: {},
  notes: ''
})
// Close address modal
const closeAddressModal = () => {
  addressModal.value.show = false
}
// Exam Code Modal
const examCodeModal = ref({
  show: false,
  appointmentId: null,
  code: '',
  error: '',
  loading: false
})
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
const timeOffBlocks = computed(() => appointmentStore.timeOffBlocks)
const showTimeOffModal = ref(false)
const timeOffError = ref('')
const timeOffForm = ref({
  date: '',
  startTime: '13:00',
  endTime: '14:00',
  note: ''
})

const appointments = computed(() => appointmentStore.appointments)

const weekDays = computed(() => {
  const days = []
  const start = getWeekStart(currentWeekStart.value)
  const persianDayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']

  for (let i = 0; i < 7; i++) {  // ← تغییر اینجا
    const date = new Date(start)
    date.setDate(start.getDate() + i)

    const dayIndex = (date.getDay() + 1) % 7
    const correctDayName = persianDayNames[dayIndex]

    const {jy, jm, jd} = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
    const persianDateStr = `${jy}/${jm}/${jd}`

    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    days.push({
      date: persianDateStr,
      dayName: correctDayName,
      dateDisplay: toPersianDate(date),
      isToday,
      fullDate: date
    })
  }

  return days
})

// محدوده هفته
const weekRangeDisplay = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[6]
  return `${start.dateDisplay} تا ${end.dateDisplay}`
})

const timeOffBlocksThisWeek = computed(() => {
  const weekDates = new Set(weekDays.value.map(d => d.date))

  return (timeOffBlocks.value || [])
      .filter(b => {
        // اصلاحیه: تبدیل فرمت تاریخ سرور (1404-12-15) به فرمت هفته (1404/12/15)
        const normalizedDate = b.date.replace(/-/g, '/')
        return weekDates.has(normalizedDate)
      })
      .slice()
      .sort((a, b) => {
        // در اینجا هم بهتر است از تاریخ نرمال شده استفاده کنیم
        const dateA = a.date.replace(/-/g, '/')
        const dateB = b.date.replace(/-/g, '/')

        if (dateA !== dateB) return dateA.localeCompare(dateB)
        return a.startTime.localeCompare(b.startTime)
      })
})
const toEnglishDigits = (str) => {
  if (!str) return '';
  return str.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
};
// آمار هفته
const weekStats = computed(() => {
  const weekAppointments = appointments.value.filter(apt => {
    const isThisWeek = weekDays.value.some(day => day.date === toEnglishDigits(apt.date));
    // شرط پرداخت: بررسی order.status یا orderStatus
    const isPaid = apt.orderStatus === 'CUSTOMER_PAID' || apt.orderStatus === 'CUSTOMER_DELIVERED';

    return isThisWeek && isPaid;
  });

  return {
    total: weekAppointments.length,
    pending: weekAppointments.filter(a => a.status === 'pending').length,
    approved: weekAppointments.filter(a => a.status === 'approved').length,
    inProgress: weekAppointments.filter(a => a.status === 'in-progress').length,
    completed: weekAppointments.filter(a => a.status === 'completed').length,
    cancelled: weekAppointments.filter(a => a.status === 'cancelled').length
  }
})

// نوبت‌های روز انتخابی
const selectedDayAppointments = computed(() => {
  const today = new Date()
  const todayStr = formatDate(today)
  const day = selectedDay.value || todayStr

  return appointments.value
      .filter(apt => toEnglishDigits(apt.date) === day)
      .sort((a, b) => a.time.localeCompare(b.time))
})

const selectedDayName = computed(() => {
  const today = new Date()
  const todayStr = formatDate(today)
  const day = selectedDay.value || todayStr

  const found = weekDays.value.find(d => d.date === day)
  return found ? `${found.dayName} ${found.dateDisplay}` : 'امروز'
})

// توابع کمکی
function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 6 ? 0 : -day - 1) // شنبه اول هفته
  d.setDate(diff + 1)
  return d
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function toPersianDate(date) {
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function toPersianTime(time) {
  if (!time || typeof time !== 'string') return ''
  const [h, m] = time.split(':').map(n => Number(n))
  if (!Number.isFinite(h) || !Number.isFinite(m)) return time
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function timeToMinutes(time) {
  const [h, m] = String(time || '').split(':').map(n => Number(n))
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

function getShiftRange(shift) {
  const ranges = {
    morning: {start: '08:00', end: '12:00'},
    afternoon: {start: '12:00', end: '18:00'},
    evening: {start: '18:00', end: '22:00'}
  }
  return ranges[shift] || ranges.morning
}

function overlapsTimeRange(startA, endA, startB, endB) {
  const a0 = timeToMinutes(startA)
  const a1 = timeToMinutes(endA)
  const b0 = timeToMinutes(startB)
  const b1 = timeToMinutes(endB)
  if (a0 == null || a1 == null || b0 == null || b1 == null) return false
  return a0 < b1 && a1 > b0
}

function getTimeOffBlocksByDayAndShift(date, shift) {
  const range = getShiftRange(shift)
  return (timeOffBlocks.value || []).filter(b => {
    // اصلاحیه: نرمال‌سازی تاریخ برای تطابق فرمت سرور و کلاینت
    const normalizedBlockDate = b.date.replace(/-/g, '/')

    if (normalizedBlockDate !== date) return false

    return overlapsTimeRange(b.startTime, b.endTime, range.start, range.end)
  })
}

function getDayLabel(dateStr) {
  // اصلاحیه: نرمال‌سازی ورودی برای جستجو
  const normalizedDateStr = dateStr.replace(/-/g, '/')
  const found = weekDays.value.find(d => d.date === normalizedDateStr)
  return found ? `${found.dayName} ${found.dateDisplay}` : dateStr
}

function openTimeOffModal(dateStr) {
  timeOffError.value = ''
  const todayStr = formatDate(new Date())
  const fallbackDate = weekDays.value.find(d => d.date === todayStr)?.date || weekDays.value[0]?.date || ''
  timeOffForm.value = {
    date: dateStr || timeOffForm.value.date || fallbackDate,
    startTime: timeOffForm.value.startTime || '13:00',
    endTime: timeOffForm.value.endTime || '14:00',
    note: ''
  }
  showTimeOffModal.value = true
}

function closeTimeOffModal() {
  showTimeOffModal.value = false
  timeOffError.value = ''
}

async function addTimeOffBlock() {
  // پاک کردن خطاهای قبلی
  timeOffError.value = ''

  const {date, startTime, endTime, note} = timeOffForm.value || {}

  // --- اعتبارسنجی‌های سمت کلاینت (Validation) ---
  if (!date) {
    timeOffError.value = 'لطفاً تاریخ را انتخاب کنید.'
    return
  }

  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  if (start === null || end === null) {
    timeOffError.value = 'لطفاً ساعت شروع/پایان را درست وارد کنید.'
    return
  }

  if (end <= start) {
    timeOffError.value = 'ساعت پایان باید بعد از ساعت شروع باشد.'
    return
  }

  // --- ارسال به سرور ---
  try {
    // فراخوانی متد استور
    const result = await appointmentStore.addTimeOffBlock({
      date,
      startTime,
      endTime,
      note: String(note || '').trim()
    })

    // بررسی نتیجه
    if (result.success) {
      // اگر موفق بود، لیست را از سرور مجدداً بگیریم تا همگام شود
      await appointmentStore.fetchTimeOffBlocks()
      closeTimeOffModal()
    } else {
      // اگر سرور خطایی برگرداند (مثلاً تداخل زمانی)
      timeOffError.value = result.message || 'خطا در ثبت زمان استراحت'
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    timeOffError.value = 'خطایی در ارتباط با سرور رخ داد.'
  }
}

async function removeTimeOffBlock(id) {
  if (!id) return

  // نمایش دیالوگ تایید به کاربر
  if (!confirm('این بازه غیرفعال حذف شود؟')) return

  try {
    // فراخوانی متد حذف از استور
    const result = await appointmentStore.deleteTimeOffBlock(id)

    if (result.success) {

      await appointmentStore.fetchTimeOffBlocks()
    } else {
      // نمایش خطای احتمالی از سمت سرور
      alert(result.message || 'خطا در حذف زمان استراحت')
    }
  } catch (err) {
    console.error('Error deleting time off block:', err)
    alert('خطایی در ارتباط با سرور رخ داد.')
  }
}

// محدودیت ۶۰ روز (۲ ماه)
const MAX_DAYS = 60

function canGoPrevious() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekStart = getWeekStart(currentWeekStart.value)
  return weekStart > today
}

function canGoNext() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + MAX_DAYS)

  const weekEnd = getWeekStart(currentWeekStart.value)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return weekEnd < maxDate
}

function previousWeek() {
  if (!canGoPrevious()) return
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
}

function nextWeek() {
  if (!canGoNext()) return
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
}

function goToCurrentWeek() {
  currentWeekStart.value = new Date()
}

function getShift(time) {
  const hour = parseInt(time.split(':')[0])
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}

function getAppointmentsByDayAndShift(date, shift) {

  return appointments.value.filter(apt => {
    return toEnglishDigits(apt.date) === date && (apt.orderStatus === 'CUSTOMER_PAID' || apt.orderStatus === 'CUSTOMER_DELIVERED') && apt.shift === shift
  })
}

function getStatusClass(status) {
  const classes = {
    'pending': 'bg-amber-100 text-amber-800 border border-amber-200',
    'approved': 'bg-blue-100 text-blue-800 border border-blue-200',
    'in-chat': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'in-progress': 'bg-purple-100 text-purple-800 border border-purple-200',
    'completed': 'bg-green-100 text-green-800 border border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border border-red-200'
  }
  return classes[status] || classes['pending']
}

function getStatusBadgeClass(status) {
  const classes = {
    'pending': 'px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium',
    'approved': 'px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium',
    'in-chat': 'px-2 py-1 bg-emerald-100 text-purple-700 rounded-lg text-xs font-medium',
    'in-progress': 'px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium',
    'completed': 'px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium',
    'cancelled': 'px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium'
  }
  return classes[status] || classes['pending']
}

function getStatusName(status) {
  const names = {
    'pending': 'در انتظار',
    'approved': 'تایید شده',
    'in-progress': 'در حال ویزیت',
    'in-chat': 'در حال گفتگو',
    'completed': 'انجام شده',
    'cancelled': 'لغو شده'
  }
  return names[status] || status
}

function getShiftBadgeClass(shift) {
  const classes = {
    'morning': 'px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium',
    'afternoon': 'px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium',
    'evening': 'px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium'
  }
  return classes[shift] || classes['morning']
}

function getShiftName(shift) {
  const names = {
    'morning': 'صبح',
    'afternoon': 'عصر',
    'evening': 'شب'
  }
  return names[shift] || shift
}

function getVisitTypeBadgeClass(type) {
  const classes = {
    'in-person': 'px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium',
    'home-visit': 'px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium',
    'online': 'px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium',
    'urgent': 'px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium',
    'urgent-consult': 'px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium'
  }
  return classes[type] || classes['in-person']
}

function getVisitTypeName(type) {
  const names = {
    'in-person': 'حضوری',
    'home-visit': 'ویزیت در منزل',
    'online': 'آنلاین',
    'urgent': 'اورژانسی',
    'urgent-consult': 'مشاوره فوری'
  }
  return names[type] || type
}

function openAppointmentDetails(apt) {
  selectedAppointment.value = apt
  showDetailsModal.value = true
}

async function approveAppointment(apt) {

  apt.status = 'approved'
  await appointmentStore.approvedAppointment(apt.id)
}

async function startAppointment(apt) {
  apt.status = 'in-progress'
  appointmentStartTimes.value[apt.id] = new Date().toISOString()

  if (apt) {
    appointmentStartTimes.value[apt.id] = new Date().toISOString()
    await appointmentStore.changeStatusToInProgress(apt.id)
    if (apt.visitType === 'online') {
      await startChat(apt.id)
    } else if (apt.visitType === 'phone' || apt.visitType === 'urgent-consult') {
      await startChat(apt.id)
    }
    showToast('🏥 ویزیت شروع شد', 'success')
  }

}

async function completeAppointment(apt) {

  if (apt.visitType === 'phone' || apt.visitType === 'urgent-consult' || apt.visitType === 'online') {
    await completeChat(apt.id)
    return
  }
  let actualDuration = 0
  apt.status = 'completed'
  if (appointmentStartTimes.value[apt.id]) {
    const startTime = new Date(appointmentStartTimes.value[apt.id])
    const endTime = new Date()
    actualDuration = Math.round((endTime - startTime) / 60000) // تبدیل به دقیقه
  }
  await appointmentStore.changeStatusToCompleted(apt.id, {
    completedAt: new Date().toISOString(),
    duration: String(actualDuration)
  })
}

async function cancelAppointment(apt) {
  if (confirm('آیا از لغو این نوبت اطمینان دارید؟')) {
    apt.status = 'cancelled'
    await appointmentStore.changeStatusToCancelled(apt.id, 'reason')//TODO:change static reason
  }
}

// ایجاد داده‌های نمونه
function generateSampleData() {
  const pets = [
    {name: 'مکس', type: 'سگ', breed: 'گلدن رتریور', avatar: 'https://placedog.net/100/100?id=1'},
    {name: 'لوسی', type: 'گربه', breed: 'پرشین', avatar: 'https://placekitten.com/100/100'},
    {name: 'راکی', type: 'سگ', breed: 'ژرمن شپرد', avatar: 'https://placedog.net/100/100?id=2'},
    {name: 'بلا', type: 'گربه', breed: 'اسکاتیش', avatar: 'https://placekitten.com/101/101'},
    {name: 'چارلی', type: 'سگ', breed: 'پودل', avatar: 'https://placedog.net/100/100?id=3'},
    {name: 'میلو', type: 'خرگوش', breed: 'هلندی', avatar: 'https://placedog.net/100/100?id=4'}
  ]

  const owners = [
    {name: 'علی محمدی', phone: '۰۹۱۲۳۴۵۶۷۸۹'},
    {name: 'سارا احمدی', phone: '۰۹۱۲۸۷۶۵۴۳۲'},
    {name: 'رضا کریمی', phone: '۰۹۱۲۵۵۵۴۴۴۳'},
    {name: 'مریم حسینی', phone: '۰۹۱۲۱۱۱۲۲۲۳'},
    {name: 'حسین رضایی', phone: '۰۹۱۲۹۸۷۶۵۴۳'}
  ]

  const services = ['واکسیناسیون', 'معاینه عمومی', 'دندانپزشکی', 'جراحی', 'آزمایش خون', 'سونوگرافی']
  const visitTypes = ['in-person', 'home-visit', 'online', 'urgent']
  const statuses = ['pending', 'approved', 'in-progress', 'completed', 'cancelled']
  const times = {
    morning: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
    afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    evening: ['18:00', '19:00', '20:00', '21:00']
  }

  const data = []
  let id = 1

  // ایجاد نوبت برای هر روز هفته
  weekDays.value.forEach(day => {
    const numAppointments = Math.floor(Math.random() * 6) + 3 // 3-8 نوبت در روز

    for (let i = 0; i < numAppointments; i++) {
      const pet = pets[Math.floor(Math.random() * pets.length)]
      const owner = owners[Math.floor(Math.random() * owners.length)]
      const shift = ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)]
      const time = times[shift][Math.floor(Math.random() * times[shift].length)]

      data.push({
        id: id++,
        date: day.date,
        dateDisplay: day.dateDisplay,
        time,
        shift,
        petName: pet.name,
        petType: pet.type,
        petBreed: pet.breed,
        petAvatar: pet.logo,
        ownerName: owner.name,
        phone: owner.phone,
        service: services[Math.floor(Math.random() * services.length)],
        visitType: visitTypes[Math.floor(Math.random() * visitTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        trackingCode: `APT-${1000 + id}`,
        notes: Math.random() > 0.7 ? 'حیوان نیاز به مراقبت ویژه دارد' : ''
      })
    }
  })

  appointments.value = data
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

    const response = await appointmentStore.changeExamCodeVerified(examCodeModal.value.appointmentId, examCodeModal.value.code)

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
          address: response.data.address.address.road + '-' +
              response.data.address.address.neighbourhood + '-' +
              response.data.address.address.suburb,
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

onMounted(async () => {
  await appointmentStore.fetchTimeOffBlocks()
})

const startChat = async (id) => {

  const appointment = appointments.value.find(a => a.id === id)
  if (appointment) {

    // اگر مشاوره فوری یا تلفنی بود
    if (appointment.visitType === 'phone' || appointment.visitType === 'urgent-consult') {
      // ۱. تغییر وضعیت به in-chat
      await appointmentStore.changeStatusToInChat(id)
      await router.push({
        path: '/clinic/urgent-requests',
        query: {
          appointmentId: appointment.id
        }
      })
      // ۲. شروع تایمر
      /*if (appointment.duration) {
        startTimer(id, appointment.duration)
      }*/

      // ۳. برقراری تماس خودکار
      //makePhoneCall(appointment)

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
    await appointmentStore.changeStatusToCompleted(id, {completedAt: new Date().toISOString(), duration: ''})

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

// تابع برقراری تماس تلفنی واقعی
const makePhoneCall = (appointment) => {
  // استفاده از پروتکل tel: برای باز کردن شماره‌گیر گوشی
  window.location.href = `tel:${appointment.ownerPhone}`;
}
</script>
<!-- استایل مخفی کردن اسکرول بار برای بخش لینک‌ها در موبایل -->
<style>

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
