<template>
  <div class="space-y-4 pb-20 lg:pb-6">
    <!-- کارت‌های آماری گرادیانت -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- کل نوبت‌ها -->
      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-white/80">کل نوبت‌ها</p>
            <p class="text-3xl font-bold mt-1">{{ totalAppointments }}</p>
            <p class="text-xs text-white/70 mt-1">{{ selectedDateLabel }}</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <i class="ti ti-calendar-event text-3xl"></i>
          </div>
        </div>
      </div>

      <!-- در انتظار تایید -->
      <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-white/80">در انتظار تایید</p>
            <p class="text-3xl font-bold mt-1">{{ pendingCount }}</p>
            <p class="text-xs text-white/70 mt-1">نیاز به بررسی</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <i class="ti ti-clock-hour-4 text-3xl"></i>
          </div>
        </div>
      </div>

      <!-- تایید شده -->
      <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-white/80">تایید شده</p>
            <p class="text-3xl font-bold mt-1">{{ approvedCount }}</p>
            <p class="text-xs text-white/70 mt-1">آماده ویزیت</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <i class="ti ti-check text-3xl"></i>
          </div>
        </div>
      </div>

      <!-- انجام شده -->
      <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-white/80">انجام شده</p>
            <p class="text-3xl font-bold mt-1">{{ completedCount }}</p>
            <p class="text-xs text-white/70 mt-1">تکمیل شده</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <i class="ti ti-circle-check text-3xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- هدر و فیلترها -->
    <div class="bg-white rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">جدول نوبت‌ها</h1>
          <p class="text-sm text-gray-500">لیست نوبت‌ها به تفکیک شیفت</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <!-- تب‌های انتخاب تاریخ -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1">
            <button
                @click="selectedDate = 'today'"
                :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                selectedDate === 'today' 
                  ? 'bg-white shadow-md text-emerald-600' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <i class="ti ti-calendar-event text-lg"></i>
              امروز
              <span class="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                {{ todayAppointmentsCount }}
              </span>
            </button>
            <button
                @click="selectedDate = 'tomorrow'"
                :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                selectedDate === 'tomorrow' 
                  ? 'bg-white shadow-md text-emerald-600' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <i class="ti ti-calendar-plus text-lg"></i>
              فردا
              <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {{ tomorrowAppointmentsCount }}
              </span>
            </button>
            <button
                @click="selectedDate = 'week'"
                :class="[
                'px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                selectedDate === 'week' 
                  ? 'bg-white shadow-md text-emerald-600' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <i class="ti ti-calendar-week text-lg"></i>
              این هفته
              <span class="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                {{ weekAppointmentsCount }}
              </span>
            </button>
          </div>

          <!-- فیلتر وضعیت -->
          <select
              v-model="statusFilter"
              class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending">در انتظار تایید</option>
            <option value="approved">تایید شده</option>
            <option value="in-progress">در حال انجام</option>
            <option value="completed">انجام شده</option>
            <option value="cancelled">لغو شده</option>
          </select>

          <!-- لینک به نمای تقویمی -->
          <router-link
              to="/clinic/appointments/calendar"
              class="px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-200 transition-colors flex items-center gap-2"
          >
            <i class="ti ti-calendar"></i>
            نمای تقویم
          </router-link>
        </div>
      </div>
    </div>

    <!-- شیفت صبح -->
    <div class="bg-white rounded-xl overflow-hidden shadow-sm">
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3 text-white">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-sun text-2xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold">شیفت صبح</h2>
            <p class="text-sm text-white/80">۰۸:۰۰ تا ۱۲:۰۰</p>
          </div>
        </div>
        <div class="bg-white/20 px-3 py-1.5 rounded-lg text-white text-sm font-medium">
          {{ morningAppointments.length }} نوبت
        </div>
      </div>

      <div class="overflow-x-auto">
        <table v-if="morningAppointments.length > 0" class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">ردیف</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">ساعت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">نام حیوان</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">صاحب</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">تلفن</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">نوع ویزیت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">خدمت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">وضعیت</th>
            <th class="text-center px-4 py-3 text-xs font-medium text-gray-500">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr
              v-for="(appointment, index) in morningAppointments"
              :key="appointment.id"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <span class="font-bold text-gray-900 font-english">{{ appointment.time }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="font-medium text-gray-900">{{ appointment.petName }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ appointment.ownerName }}</td>
            <td class="px-4 py-3">
              <a :href="`tel:${appointment.ownerPhone}`"
                 class="text-sm text-emerald-600 hover:text-emerald-700 font-english">
                {{ appointment.ownerPhone }}
              </a>
            </td>
            <td class="px-4 py-3">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg',
                  getVisitTypeBadge(appointment.visitType)
                ]">
                  <i :class="getVisitTypeIcon(appointment.visitType)"></i>
                  {{ getVisitTypeLabel(appointment.visitType) }}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ appointment.service }}</td>
            <td class="px-4 py-3">
                <span :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg',
                  getStatusBadge(appointment.status)
                ]">
                  {{ getStatusLabel(appointment.status) }}
                </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <!-- ثبت کد معاینه (برای pending بدون کد تایید شده) -->
                <button
                    v-if="appointment.status === 'pending' && !appointment.examCodeVerified && (appointment.visitType === 'home-visit'||appointment.visitType === 'in-person')"
                    @click="showExamCodeModal(appointment.id)"
                    class="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                    title="ثبت کد معاینه"
                >
                  <i class="ti ti-key text-sm"></i>
                </button>
                <!-- تایید نوبت (برای pending با کد تایید شده) -->
                <button
                    v-if="appointment.status === 'pending' && appointment.examCodeVerified &&( appointment.visitType !== 'home-visit'||appointment.visitType !== 'in-person')"
                    @click="approveAppointment(appointment.id)"
                    class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="تایید نوبت"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>
                <button
                    v-if="appointment.status === 'pending' && (appointment.visitType === 'online'||appointment.visitType === 'urgent-consult'|| appointment.visitType === 'phone')"
                    @click="approveAppointment(appointment.id)"
                    class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="تایید نوبت"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>
                <!-- شروع ویزیت -->
                <button
                    v-if="appointment.status === 'approved'"
                    @click="startVisit(appointment.id)"
                    class="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="شروع ویزیت"
                >
                  <i class="ti ti-player-play text-sm"></i>
                </button>
                <button
                    title="ورود به اتاق گفتگو"
                    v-if="appointment.status === 'in-chat'"
                    @click="router.push(`/clinic/chat/${appointment.consultationId}`)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <i class="ti ti-message-circle"></i>
                </button>
                <!-- تکمیل ویزیت -->
                <button
                    v-if="appointment.status === 'in-progress'"
                    @click="completeAppointment(appointment.id)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="تکمیل ویزیت"
                >
                  <i class="ti ti-circle-check text-sm"></i>
                </button>
                <!-- جزئیات -->
                <button
                    @click="showDetails(appointment)"
                    class="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="جزئیات"
                >
                  <i class="ti ti-eye text-sm"></i>
                </button>
                <!-- لغو -->
                <button
                    v-if="appointment.status === 'pending'"
                    @click="cancelAppointment(appointment.id)"
                    class="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="لغو نوبت"
                >
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="p-8 text-center">
          <i class="ti ti-calendar-off text-4xl text-gray-300 mb-2"></i>
          <p class="text-gray-500 text-sm">نوبتی در شیفت صبح ثبت نشده</p>
        </div>
      </div>
    </div>

    <!-- شیفت عصر -->
    <div class="bg-white rounded-xl overflow-hidden shadow-sm">
      <div class="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3 text-white">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-sun-low text-2xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold">شیفت عصر</h2>
            <p class="text-sm text-white/80">۱۲:۰۰ تا ۱۸:۰۰</p>
          </div>
        </div>
        <div class="bg-white/20 px-3 py-1.5 rounded-lg text-white text-sm font-medium">
          {{ afternoonAppointments.length }} نوبت
        </div>
      </div>

      <div class="overflow-x-auto">
        <table v-if="afternoonAppointments.length > 0" class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">ردیف</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">ساعت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">نام حیوان</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">صاحب</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">تلفن</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">نوع ویزیت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">خدمت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">وضعیت</th>
            <th class="text-center px-4 py-3 text-xs font-medium text-gray-500">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr
              v-for="(appointment, index) in afternoonAppointments"
              :key="appointment.id"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <span class="font-bold text-gray-900 font-english">{{ appointment.time }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="font-medium text-gray-900">{{ appointment.petName }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ appointment.ownerName }}</td>
            <td class="px-4 py-3">
              <a :href="`tel:${appointment.ownerPhone}`"
                 class="text-sm text-emerald-600 hover:text-emerald-700 font-english">
                {{ appointment.ownerPhone }}
              </a>
            </td>
            <td class="px-4 py-3">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg',
                  getVisitTypeBadge(appointment.visitType)
                ]">
                  <i :class="getVisitTypeIcon(appointment.visitType)"></i>
                  {{ getVisitTypeLabel(appointment.visitType) }}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ appointment.service }}</td>
            <td class="px-4 py-3">
                <span :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg',
                  getStatusBadge(appointment.status)
                ]">
                  {{ getStatusLabel(appointment.status) }}
                </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <!-- ثبت کد معاینه (برای pending بدون کد تایید شده) -->
                <button
                    v-if="appointment.status === 'pending' && !appointment.examCodeVerified && (appointment.visitType === 'home-visit'||appointment.visitType === 'in-person')"
                    @click="showExamCodeModal(appointment.id)"
                    class="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                    title="ثبت کد معاینه"
                >
                  <i class="ti ti-key text-sm"></i>
                </button>
                <!-- تایید نوبت (برای pending با کد تایید شده) -->
                <button
                    v-if="appointment.status === 'pending' && appointment.examCodeVerified && ( appointment.visitType !== 'home-visit'||appointment.visitType !== 'in-person')"
                    @click="approveAppointment(appointment.id)"
                    class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="تایید نوبت"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>

                <button
                    v-if="appointment.status === 'pending' && (appointment.visitType === 'online'||appointment.visitType === 'urgent-consult'|| appointment.visitType === 'phone')"
                    @click="approveAppointment(appointment.id)"
                    class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="تایید نوبت"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>
                <!-- شروع ویزیت -->
                <button
                    v-if="appointment.status === 'approved'"
                    @click="startVisit(appointment.id)"
                    class="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="شروع ویزیت"
                >
                  <i class="ti ti-player-play text-sm"></i>
                </button>

                <button
                    title="ورود به اتاق گفتگو"
                    v-if="appointment.status === 'in-chat'"
                    @click="router.push(`/clinic/chat/${appointment.consultationId}`)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <i class="ti ti-message-circle"></i>
                </button>
                <!-- تکمیل ویزیت -->
                <button
                    v-if="appointment.status === 'in-progress'"
                    @click="completeAppointment(appointment.id)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="تکمیل ویزیت"
                >
                  <i class="ti ti-circle-check text-sm"></i>
                </button>

                <!-- جزئیات -->
                <button
                    @click="showDetails(appointment)"
                    class="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="جزئیات"
                >
                  <i class="ti ti-eye text-sm"></i>
                </button>
                <!-- لغو -->
                <button
                    v-if="appointment.status === 'pending'"
                    @click="cancelAppointment(appointment.id)"
                    class="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="لغو نوبت"
                >
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="p-8 text-center">
          <i class="ti ti-calendar-off text-4xl text-gray-300 mb-2"></i>
          <p class="text-gray-500 text-sm">نوبتی در شیفت عصر ثبت نشده</p>
        </div>
      </div>
    </div>

    <!-- شیفت شب -->
    <div class="bg-white rounded-xl overflow-hidden shadow-sm">
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3 text-white">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="ti ti-moon text-2xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold">شیفت شب</h2>
            <p class="text-sm text-white/80">۱۸:۰۰ تا ۲۲:۰۰</p>
          </div>
        </div>
        <div class="bg-white/20 px-3 py-1.5 rounded-lg text-white text-sm font-medium">
          {{ eveningAppointments.length }} نوبت
        </div>
      </div>

      <div class="overflow-x-auto">
        <table v-if="eveningAppointments.length > 0" class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">ردیف</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">ساعت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">نام حیوان</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">صاحب</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">تلفن</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">نوع ویزیت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">خدمت</th>
            <th class="text-right px-4 py-3 text-xs font-medium text-gray-500">وضعیت</th>
            <th class="text-center px-4 py-3 text-xs font-medium text-gray-500">عملیات</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr
              v-for="(appointment, index) in eveningAppointments"
              :key="appointment.id"
              class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-4 py-3">
              <span class="font-bold text-gray-900 font-english">{{ appointment.time }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="font-medium text-gray-900">{{ appointment.petName }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ appointment.ownerName }}</td>
            <td class="px-4 py-3">
              <a :href="`tel:${appointment.ownerPhone}`"
                 class="text-sm text-emerald-600 hover:text-emerald-700 font-english">
                {{ appointment.ownerPhone }}
              </a>
            </td>
            <td class="px-4 py-3">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg',
                  getVisitTypeBadge(appointment.visitType)
                ]">
                  <i :class="getVisitTypeIcon(appointment.visitType)"></i>
                  {{ getVisitTypeLabel(appointment.visitType) }}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ appointment.service }}</td>
            <td class="px-4 py-3">
                <span :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg',
                  getStatusBadge(appointment.status)
                ]">
                  {{ getStatusLabel(appointment.status) }}
                </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <!-- ثبت کد معاینه (برای pending بدون کد تایید شده) -->
                <button
                    v-if="appointment.status === 'pending' && !appointment.examCodeVerified && (appointment.visitType === 'home-visit'||appointment.visitType === 'in-person')"
                    @click="showExamCodeModal(appointment.id)"
                    class="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                    title="ثبت کد معاینه"
                >
                  <i class="ti ti-key text-sm"></i>
                </button>
                <!-- تایید نوبت (برای pending با کد تایید شده) -->
                <button
                    v-if="appointment.status === 'pending' && appointment.examCodeVerified &&( appointment.visitType !== 'home-visit'||appointment.visitType !== 'in-person')"
                    @click="approveAppointment(appointment.id)"
                    class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="تایید نوبت"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>
                <button
                    v-if="appointment.status === 'pending' && (appointment.visitType === 'online'||appointment.visitType === 'urgent-consult'|| appointment.visitType === 'phone')"
                    @click="approveAppointment(appointment.id)"
                    class="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="تایید نوبت"
                >
                  <i class="ti ti-check text-sm"></i>
                </button>
                <!-- شروع ویزیت -->
                <button
                    v-if="appointment.status === 'approved'"
                    @click="startVisit(appointment.id)"
                    class="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="شروع ویزیت"
                >
                  <i class="ti ti-player-play text-sm"></i>
                </button>

                <button
                    title="ورود به اتاق گفتگو"
                    v-if="appointment.status === 'in-chat'"
                    @click="router.push(`/clinic/chat/${appointment.consultationId}`)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <i class="ti ti-message-circle"></i>
                </button>
                <!-- تکمیل ویزیت -->
                <button
                    v-if="appointment.status === 'in-progress'"
                    @click="completeAppointment(appointment.id)"
                    class="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="تکمیل ویزیت"
                >
                  <i class="ti ti-circle-check text-sm"></i>
                </button>
                <!-- جزئیات -->
                <button
                    @click="showDetails(appointment)"
                    class="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="جزئیات"
                >
                  <i class="ti ti-eye text-sm"></i>
                </button>
                <!-- لغو -->
                <button
                    v-if="appointment.status === 'pending'"
                    @click="cancelAppointment(appointment.id)"
                    class="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="لغو نوبت"
                >
                  <i class="ti ti-x text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="p-8 text-center">
          <i class="ti ti-calendar-off text-4xl text-gray-300 mb-2"></i>
          <p class="text-gray-500 text-sm">نوبتی در شیفت شب ثبت نشده</p>
        </div>
      </div>
    </div>

    <!-- مودال جزئیات -->
    <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="detailsModal.show"
           class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
           @click="detailsModal.show = false">
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full" @click.stop>
          <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">جزئیات نوبت</h3>
            <button @click="detailsModal.show = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <i class="ti ti-x text-gray-500"></i>
            </button>
          </div>
          <div class="p-6 space-y-4" v-if="detailsModal.data">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">نام حیوان</p>
                <p class="font-bold text-gray-900">{{ detailsModal.data.petName }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">صاحب</p>
                <p class="font-bold text-gray-900">{{ detailsModal.data.ownerName }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">تاریخ</p>
                <p class="font-bold text-gray-900">{{ detailsModal.data.date }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">ساعت</p>
                <p class="font-bold text-gray-900 font-english">{{ detailsModal.data.time }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">تلفن</p>
                <a :href="`tel:${detailsModal.data.ownerPhone}`" class="font-bold text-emerald-600 font-english">
                  {{ detailsModal.data.ownerPhone }}
                </a>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-500 mb-1">کد رهگیری</p>
                <p class="font-bold text-gray-900 font-english text-xs">{{ detailsModal.data.trackingCode }}</p>
              </div>
            </div>
            <div class="bg-emerald-50 rounded-lg p-3">
              <p class="text-xs text-emerald-700 mb-1">خدمت درخواستی</p>
              <p class="font-bold text-emerald-900">{{ detailsModal.data.service }}</p>
            </div>
            <div v-if="detailsModal.data.ownerEmail" class="bg-blue-50 rounded-lg p-3">
              <p class="text-xs text-blue-700 mb-1">ایمیل</p>
              <p class="font-bold text-blue-900 font-english">{{ detailsModal.data.ownerEmail }}</p>
            </div>
          </div>
          <div class="p-4 border-t border-gray-200 flex gap-2">
            <button
                v-if="detailsModal.data && detailsModal.data.status === 'pending'"
                @click="approveAppointment(detailsModal.data.id); detailsModal.show = false"
                class="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <i class="ti ti-check ml-1"></i>
              تایید نوبت
            </button>
            <button
                v-if="detailsModal.data && detailsModal.data.status === 'approved'"
                @click="startVisit(detailsModal.data.id); detailsModal.show = false"
                class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <i class="ti ti-player-play ml-1"></i>
              شروع ویزیت
            </button>
            <button
                @click="detailsModal.show = false"
                class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

    <!-- Toast -->
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
          'fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3',
          toast.type === 'success' ? 'bg-emerald-600 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        ]"
      >
        <i :class="[
          'text-xl',
          toast.type === 'success' ? 'ti ti-circle-check' :
          toast.type === 'error' ? 'ti ti-circle-x' :
          'ti ti-info-circle'
        ]"></i>
        <span class="text-sm font-medium">{{ toast.message }}</span>
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
import {ref, computed, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useAppointmentStore} from "@/stores/vet-clinic/appointment.js"
import {all} from "axios";

const appointmentStore = useAppointmentStore()
const appointmentStartTimes = ref({}) // برای ذخیره زمان شروع هر نوبت
const router = useRouter()
// Address Modal
const addressModal = ref({
  show: false,
  customerName: '',
  phone: '',
  address: '',
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

const selectedDate = ref('today')
const statusFilter = ref('all')
// --- تابع کمکی برای تاریخ شمسی از Date object ---
const getPersianDateFromDate = (date) => {
  const formatter = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  const parts = formatter.formatToParts(date)
  const getPart = (type) => parts.find(p => p.type === type)?.value || ''

  // تبدیل اعداد فارسی به انگلیسی
  const toEnglish = (str) => str.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

  const year = toEnglish(getPart('year'))
  const month = parseInt(toEnglish(getPart('month')), 10)
  const day = parseInt(toEnglish(getPart('day')), 10)

  return `${year}/${month}/${day}`
}

// --- تابع اصلی برای گرفتن آرایه هفته از شنبه ---
function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()

  // پیدا کردن شنبه (روز ۶)
  const diff = day === 6 ? 0 : -(day + 1)
  d.setDate(d.getDate() + diff)

  // ساخت آرایه ۷ روز هفته
  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(d)
    currentDate.setDate(d.getDate() + i)
    weekDates.push(getPersianDateFromDate(currentDate))
  }

  return weekDates
}

// --- استفاده ---
const weekDates = getWeekStart() // آرایه ۷ روز از شنبه تا جمعه

// خروجی: ['1404/12/8', '1404/12/9', '1404/12/10', '1404/12/11', '1404/12/12', '1404/12/13', '1404/12/14']
// --- محاسبه تاریخ‌ها دقیقاً مشابه فرمت دیتابیس (1404/12/5) ---
const getPersianDate = (daysToAdd = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + daysToAdd)
  const options = {year: 'numeric', month: 'numeric', day: 'numeric', calendar: 'persian'}
  const parts = new Intl.DateTimeFormat('fa-IR', options).formatToParts(date)
  const year = parts.find(p => p.type === 'year').value
  const month = parts.find(p => p.type === 'month').value
  const day = parts.find(p => p.type === 'day').value
  const toEnNum = (n) => n.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  return `${toEnNum(year)}/${parseInt(toEnNum(month))}/${parseInt(toEnNum(day))}`
}

const todayPersian = getPersianDate(0)
const tomorrowPersian = getPersianDate(1)

// -----------------------------------------------------------

// Toast
const toast = ref({show: false, message: '', type: 'success'})
const showToast = (message, type = 'success') => {
  toast.value = {show: true, message, type}
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Details Modal
const detailsModal = ref({show: false, data: null})
const showDetails = (appointment) => {
  detailsModal.value = {show: true, data: appointment}
}

// لیبل تاریخ انتخاب شده
const selectedDateLabel = computed(() => {
  if (selectedDate.value === 'today') return 'امروز - ' + todayPersian
  if (selectedDate.value === 'tomorrow') return 'فردا - ' + tomorrowPersian
  return 'این هفته'
})

const allAppointments = computed(() => appointmentStore.appointments)


// --- دیباگ فیلتر وضعیت ---
// این بخش را به کنسول نگاه کنید تا ببینید فیلتر چقدر آیتم پیدا می‌کند
/*watch(statusFilter, (newVal) => {
  console.log(`🔍 فیلتر وضعیت تغییر کرد به: ${newVal}`)
  console.log(`🔍 تعداد کل نوبت‌های فیلتر شده: ${filteredByDate.value.length}`)
  // چاپ وضعیت اولین آیتم برای بررسی تطابق
  if (filteredByDate.value.length > 0) {
    console.log(`🔍 وضعیت اولین نوبت: "${filteredByDate.value[0].status}"`)
  }
})*/
// -----------------------------
const toEnglishDigits = (str) => {
  if (!str) return '';
  return str.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
};
// فیلتر نوبت‌ها بر اساس تاریخ
const filteredByDate = computed(() => {
  let filtered = []
  if (selectedDate.value === 'today') {
    filtered = allAppointments.value.filter(a => toEnglishDigits(a.date) === todayPersian && a.orderStatus === 'CUSTOMER_PAID' || a.orderStatus === 'CUSTOMER_DELIVERED')
  } else if (selectedDate.value === 'tomorrow') {
    filtered = allAppointments.value.filter(a => toEnglishDigits(a.date) === tomorrowPersian && a.orderStatus === 'CUSTOMER_PAID' || a.orderStatus === 'CUSTOMER_DELIVERED')
  } else {
    filtered = filtered = allAppointments.value.filter(a =>
        weekDates.includes(toEnglishDigits(a.date)) &&
        a.orderStatus === 'CUSTOMER_PAID' || a.orderStatus === 'CUSTOMER_DELIVERED'
    );
  }
  return filtered
})

// فیلتر نوبت‌ها بر اساس وضعیت
const appointments = computed(() => {
  let filtered = filteredByDate.value
  if (statusFilter.value !== 'all') {
    // نرمال‌سازی متن برای اطمینان از تطابق (حذف فاصله‌های اضافی و کوچک کردن حروف)
    filtered = filtered.filter(a => {
      const itemStatus = String(a.status).trim().toLowerCase()
      const filterStatus = String(statusFilter.value).trim().toLowerCase()
      return itemStatus === filterStatus
    })
  }
  return filtered
})

const todayAppointmentsCount = computed(() =>
    allAppointments.value.filter(a => toEnglishDigits(a.date) === todayPersian && a.orderStatus === 'CUSTOMER_PAID' || a.orderStatus === 'CUSTOMER_DELIVERED').length
)
const tomorrowAppointmentsCount = computed(() =>
    allAppointments.value.filter(a => toEnglishDigits(a.date) === tomorrowPersian && a.orderStatus === 'CUSTOMER_PAID' || a.orderStatus === 'CUSTOMER_DELIVERED').length
)
const weekAppointmentsCount = computed(() => {
  return allAppointments.value.filter(a => {
    const appointmentDate = toEnglishDigits(a.date);
    const isPaid = a.orderStatus === 'CUSTOMER_PAID' || a.orderStatus === 'CUSTOMER_DELIVERED';

    // چک می‌کند آیا تاریخ نوبت در آرایه weekDates (تاریخ‌های این هفته) وجود دارد
    const isInWeek = weekDates.includes(appointmentDate);

    return isInWeek && isPaid;
  }).length;
});

// آمار
const totalAppointments = computed(() => appointments.value.length)

const pendingCount = computed(() => appointments.value.filter(a => a.status === 'pending').length)
const approvedCount = computed(() => appointments.value.filter(a => a.status === 'approved').length)
const completedCount = computed(() => appointments.value.filter(a => a.status === 'completed').length)

// تقسیم‌بندی بر اساس شیفت
const getHour = (time) => parseInt(time.split(':')[0])

const morningAppointments = computed(() =>
    appointments.value.filter(a => {

      const hour = getHour(toEnglishDigits(a.time))
      return hour >= 6 && hour < 12
    }).sort((a, b) => toEnglishDigits(a.time).localeCompare(toEnglishDigits(b.time)))
)

const afternoonAppointments = computed(() =>
    appointments.value.filter(a => {
      const hour = getHour(toEnglishDigits(a.time))
      return hour >= 12 && hour < 18
    }).sort((a, b) => toEnglishDigits(a.time).localeCompare(toEnglishDigits(b.time)))
)

const eveningAppointments = computed(() =>
    appointments.value.filter(a => {
      const hour = getHour(toEnglishDigits(a.time))
      return hour >= 18 && hour <= 24
    }).sort((a, b) => toEnglishDigits(a.time).localeCompare(toEnglishDigits(b.time)))
)

// توابع کمکی
const getVisitTypeLabel = (type) => {
  const labels = {
    'in-person': 'حضوری',
    'home-visit': 'منزل',
    'online': 'آنلاین',
    'urgent': 'فوری',
    'urgent-consult': 'مشاوره فوری',
    'phone': 'تلفنی'
  }
  return labels[type] || type
}

const getVisitTypeBadge = (type) => {
  const badges = {
    'in-person': 'bg-emerald-100 text-emerald-700',
    'home-visit': 'bg-amber-100 text-amber-700',
    'online': 'bg-blue-100 text-blue-700',
    'urgent': 'bg-red-100 text-red-700',
    'urgent-consult': 'bg-red-100 text-red-700',
    'phone': 'bg-purple-100 text-purple-700'
  }
  return badges[type] || 'bg-gray-100 text-gray-700'
}

const getVisitTypeIcon = (type) => {
  const icons = {
    'in-person': 'ti ti-building-hospital',
    'home-visit': 'ti ti-home-heart',
    'online': 'ti ti-video',
    'urgent': 'ti ti-urgent',
    'urgent-consult': 'ti ti-urgent',
    'phone': 'ti ti-phone'
  }
  return icons[type] || 'ti ti-calendar'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'در انتظار',
    'approved': 'تایید شده',
    'in-chat': 'در حال گفتگو',
    'in-progress': 'در حال انجام',
    'completed': 'انجام شده',
    'cancelled': 'لغو شده'
  }
  return labels[status] || ''
}

const getStatusBadge = (status) => {
  const badges = {
    'pending': 'bg-amber-100 text-amber-700',
    'approved': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-emerald-100 text-emerald-700',
    'in-chat': 'bg-emerald-100 text-emerald-700',
    'completed': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const approveAppointment = async (id) => {
  await appointmentStore.approvedAppointment(id)
  showToast('✅ نوبت تایید شد', 'success')

}

const startVisit = async (id) => {
  const appointment = allAppointments.value.find(a => a.id === id)
  if (appointment) {
    appointmentStartTimes.value[id] = new Date().toISOString()
    await appointmentStore.changeStatusToInProgress(id)
    if (appointment.visitType === 'online') {
      await startChat(id)
    } else if (appointment.visitType === 'phone'|| appointment.visitType === 'urgent-consult') {
      await startChat(id)
    }
    showToast('🏥 ویزیت شروع شد', 'success')
  }
}

const completeAppointment = async (id) => {
  const appointment = allAppointments.value.find(a => a.id === id)
  if (appointment.visitType === 'phone' || appointment.visitType === 'urgent-consult' || appointment.visitType === 'online') {
    await completeChat(id)
    return
  }
  let actualDuration = 0
  try {

    if (appointmentStartTimes.value[id]) {
      const startTime = new Date(appointmentStartTimes.value[id])
      const endTime = new Date()
      actualDuration = Math.round((endTime - startTime) / 60000) // تبدیل به دقیقه
    }
    await appointmentStore.changeStatusToCompleted(id, {
      completedAt: new Date().toISOString(),
      duration: String(actualDuration)
    })
    showToast('✅ ویزیت تکمیل شد', 'success')
  } catch (error) {
    showToast('❌ خطا در تکمیل ویزیت', 'error')
  }
}

const cancelAppointment = async (id) => {
  if (confirm('آیا از لغو این نوبت اطمینان دارید؟')) {
    await appointmentStore.changeStatusToCancelled(id, 'reason')//TODO:change static reason
    showToast('❌ نوبت لغو شد', 'error')
  }

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

const startChat = async (id) => {
  const appointment = allAppointments.value.find(a => a.id === id)
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
  const appointment = allAppointments.value.find(a => a.id === id)

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
  const appointment = allAppointments.value.find(a => a.id === appointmentId)
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
