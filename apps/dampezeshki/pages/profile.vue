<template>
  <div v-if="user" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <i class="ti ti-arrow-right text-xl text-gray-600"></i>
            </NuxtLink>
            <h1 class="text-xl font-bold text-gray-900">حساب کاربری</h1>
          </div>
          <div class="flex items-center gap-2">
            <!-- Chat Icon -->
            <NuxtLink
                to="/chat"
                class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <i class="ti ti-message-circle text-xl text-gray-600"></i>
              <span v-if="chats.length>0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
            </NuxtLink>

            <!-- Notifications -->
            <div class="relative">
              <button
                  @click.stop="showNotifications = !showNotifications"
                  class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <i class="ti ti-bell text-xl text-gray-600"></i>
                <span v-if="notifications.length>0"
                      class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              <!-- Notifications Dropdown -->
              <Transition name="dropdown">
                <div
                    v-if="showNotifications"
                    v-click-outside="() => showNotifications = false"
                    class="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-[60] overflow-hidden"
                >
                  <div class="p-4 border-b border-gray-100 bg-gradient-to-l from-sky-50 to-blue-50">
                    <div class="flex items-center justify-between">
                      <h3 class="font-bold text-gray-900">اعلان‌ها</h3>
                      <button class="text-xs text-sky-600 hover:text-sky-700">علامت‌گذاری همه</button>
                    </div>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    <div
                        v-for="notif in notifications"
                        :key="notif.id"
                        class="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div class="flex gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                          notif.type === 'order' ? 'bg-blue-100' :
                          notif.type === 'chat' ? 'bg-green-100' :
                          notif.type === 'visit' ? 'bg-purple-100' : 'bg-gray-100'
                        ]">
                          <i :class="[
                            notif.type === 'order' ? 'ti ti-shopping-bag text-blue-600' :
                            notif.type === 'chat' ? 'ti ti-message-circle text-green-600' :
                            notif.type === 'visit' ? 'ti ti-stethoscope text-purple-600' : 'ti ti-bell text-gray-600'
                          ]"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900">{{ notif.title }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ notif.message }}</p>
                          <span class="text-xs text-gray-400 mt-1 block">{{ notif.time }}</span>
                        </div>
                        <span v-if="!notif.read" class="w-2 h-2 bg-sky-500 rounded-full shrink-0"></span>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 border-t border-gray-100 text-center">
                    <button
                        @click="activeSection = 'notifications'; showNotifications = false"
                        class="text-sm text-sky-600 hover:text-sky-700 font-medium"
                    >
                      مشاهده همه اعلان‌ها
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Support Button -->
            <button
                @click="showSupportModal = true"
                class="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-sky-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <i class="ti ti-headset text-lg"></i>
              <span>سوالی دارید؟</span>
            </button>

            <!-- Support Icon (Mobile) -->
            <button
                @click="showSupportModal = true"
                class="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="پشتیبانی"
            >
              <i class="ti ti-headset text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <!-- User Info -->
            <div class="p-6 border-b border-gray-100 text-center">
              <img v-if="user?.avatar" :alt="user?.name.charAt(0)" :src="user?.avatar"
                   class="w-20 h-20 bg-gradient-to-l from-blue-500 to-teal-500 rounded-full mx-auto mb-4 flex justify-center items-center align-content text-white text-2xl font-bold"/>
              <div v-if="!user?.avatar"
                   class="w-20 h-20 bg-gradient-to-l from-blue-500 to-teal-500 rounded-full mx-auto mb-4 flex justify-center items-center align-content text-white text-2xl font-bold">
                <span
                    class="text-white font-bold"
                >
                {{ user.name ? user.name.charAt(0) : '?' }}
              </span>
              </div>

              <h3 class="font-bold text-gray-900">{{ user?.name }}</h3>
              <p class="text-gray-500 text-sm ltr">{{ user?.phoneNumber }}</p>
            </div>

            <!-- Menu -->
            <nav class="p-2">
              <button
                  v-for="item in menuItems"
                  :key="item.id"
                  @click="activeSection = item.id"
                  :class="activeSection === item.id
                  ? 'bg-sky-50 text-sky-600' 
                  : 'text-gray-600 hover:bg-gray-50'"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              >
                <i :class="[item.icon, 'text-xl']"></i>
                <span class="font-medium">{{ item.label }}</span>
                <span v-if="item.badge" class="mr-auto w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              <button
                  @click="logout"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-2"
              >
                <i class="ti ti-logout text-xl"></i>
                <span class="font-medium">خروج از حساب</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Profile Section -->
          <div v-if="activeSection === 'profile'" class="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-user text-blue-500"></i>
              اطلاعات شخصی
            </h2>

            <form @submit.prevent="updateProfile" class="space-y-6">

              <!-- بخش آواتار -->
              <div class="flex items-center gap-4">
                <div class="relative w-20 h-20">
                  <img
                      :src="formData.avatar"
                      alt="Avatar"
                      class="w-full h-full rounded-full flex items-center justify-center  object-cover border-2 border-gray-200"
                  >
                  <label for="avatar-upload"
                         class="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full text-center cursor-pointer hover:bg-blue-600 shadow-sm">
                    <i class="ti ti-camera text-xs"></i>
                  </label>
                  <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarUpload"
                  >
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">عکس پروفایل</h3>
                  <p class="text-xs text-gray-500">فرمت‌های مجاز: JPG, PNG</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- نام و نام خانوادگی -->
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نام و نام خانوادگی</label>
                  <input
                      type="text"
                      v-model="formData.fullName"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                  >
                </div>
                <!-- شماره موبایل -->
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">شماره موبایل</label>
                  <input
                      type="tel"
                      v-model="formData.phoneNumber"
                      disabled
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 ltr"
                      dir="ltr"
                  >
                </div>

                <!-- ایمیل -->
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">ایمیل</label>
                  <input
                      type="email"
                      v-model="formData.email"
                      placeholder="ایمیل خود را وارد کنید"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 ltr"
                      dir="ltr"
                  >
                </div>
                <!-- تاریخ تولد -->
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">تاریخ تولد</label>
                  <PersianDatePicker
                      v-model="formData.birthday"
                      placeholder="تاریخ تولد را انتخاب کنید"
                      type="date"
                      display-format="jYYYY/jMM/jDD"
                      format="jYYYY/jMM/jDD"
                  />
                </div>
              </div>

              <!-- دکمه ذخیره -->
              <div class="pt-2">
                <button
                    type="submit"
                    class="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>

          <!-- Requests Section -->
          <div v-if="activeSection === 'requests'" class="space-y-4">
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="ti ti-file-description text-blue-500"></i>
                وضعیت درخواست‌ها
              </h2>
              <div v-if="requests.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i class="ti ti-file-off text-3xl text-gray-300"></i>
                </div>
                <p class="text-gray-500">درخواستی ثبت نشده است</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="req in requests" :key="req.id"
                     class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                  <!-- نوار رنگی کناری -->
                  <div :class="['absolute top-0 right-0 bottom-0 w-1.5', getReqStatusColor(req.status)]"></div>

                  <div class="flex justify-between items-start pr-3">
                    <div>
                      <!-- اصلاح: استفاده از tenantName -->
                      <h3 class="font-bold text-lg text-gray-800">{{ req.tenantName }}</h3>
                      <!-- اصلاح: نمایش نوع به فارسی -->
                      <p class="text-sm text-gray-500 mt-1">نوع: {{ req.typeLabel }}</p>
                      <p class="text-xs text-gray-400 mt-2">تاریخ ثبت: {{ req.date }}</p>

                      <!-- نمایش اطلاعات تکمیلی برای دامپزشک -->
                      <div v-if="req.type === 'vet'" class="mt-2 flex gap-2 text-xs text-gray-500">
                        <span v-if="req.specialty" class="bg-gray-100 px-2 py-1 rounded">تخصص: {{
                            req.specialtyLabel
                          }}</span>
                        <span v-if="req.experience" class="bg-gray-100 px-2 py-1 rounded">سابقه: {{ req.experience }} سال</span>
                      </div>
                    </div>
                    <span :class="['px-3 py-1 rounded-lg text-xs font-bold border', getReqStatusBadge(req.status)]">
                       {{ getReqStatusLabel(req.status) }}
                     </span>
                  </div>

                  <!-- پیام ادمین / دلیل رد -->
                  <div v-if="req.message"
                       class="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex gap-2">
                    <i class="ti ti-alert-circle flex-shrink-0"></i>
                    <span>{{ req.message }}</span>
                  </div>

                  <div class="mt-4 flex gap-3">
                    <button
                        @click="openEditRequestModal(req)"
                        class="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                      <i class="ti ti-eye"></i>
                      مشاهده
                    </button>
                    <!-- دکمه اصلاح اطلاعات فقط در صورت نیاز به اصلاح نمایش داده میشود -->
                    <button
                        v-if="req.status === 'needs_revision'"
                        @click="openEditRequestModal(req)"
                        class="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
                      <i class="ti ti-edit"></i>
                      اصلاح اطلاعات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Visits Section -->
          <div v-if="activeSection === 'visits'" class="space-y-4">
            <!-- Visits Filter Tabs -->
            <div class="bg-white rounded-2xl border border-gray-100 p-2">
              <div class="flex gap-1 overflow-x-auto scrollbar-hide">
                <button
                    v-for="tab in visitTabs"
                    :key="tab.id"
                    @click="activeVisitTab = tab.id"
                    :class="[
                    'flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2',
                    activeVisitTab === tab.id 
                      ? 'bg-sky-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ tab.label }}
                  <span v-if="tab.count" :class="[
                    'text-xs px-1.5 py-0.5 rounded-full',
                    activeVisitTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  ]">
                    {{ tab.count }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Visits List -->
            <div v-if="filteredVisits.length === 0"
                 class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-stethoscope text-4xl text-gray-300"></i>
              </div>
              <h3 class="text-gray-900 font-semibold mb-2">ویزیتی یافت نشد</h3>
              <p class="text-gray-500 text-sm">هنوز ویزیتی در این دسته ثبت نشده است</p>
            </div>

            <div v-else class="space-y-4">
              <div
                  v-for="visit in filteredVisits"
                  :key="visit.id"
                  class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <!-- Visit Header -->
                <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      visit.status === 'completed' ? 'bg-green-100' :
                      visit.status === 'upcoming' ? 'bg-blue-100' :
                      visit.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                    ]">
                      <i :class="[
                        visit.status === 'completed' ? 'ti ti-check text-green-600' :
                        visit.status === 'upcoming' ? 'ti ti-clock text-blue-600' :
                        visit.status === 'cancelled' ? 'ti ti-x text-red-600' : 'ti ti-stethoscope text-gray-600'
                      ]"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ visit.doctorName }}</p>
                      <p class="text-xs text-gray-500">{{ visit.date }} - {{ visit.time }}</p>
                    </div>
                  </div>
                  <div :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                    visit.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    visit.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  ]">
                    {{ visit.statusLabel }}
                  </div>
                </div>

                <!-- Visit Info -->
                <div class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <!--                      <i class="ti ti-paw text-xl text-gray-400"></i>-->
                      <img v-if="visit.petImage" :src="resolveUrl(visit.petImage)" alt="pet"
                           class="w-12 h-12 rounded-full object-cover"/>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ visit.petName }}</p>
                      <!--                      <p class="text-sm text-gray-500">{{ visit.petType }}</p>-->
                      <p class="text-sm text-gray-600 mt-2">{{ visit.reason }}</p>
                    </div>
                  </div>

                  <!-- Visit Summary -->
                  <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div class="text-sm text-gray-500">
                      {{ visit.type === 'online' ? 'مشاوره آنلاین' : 'ویزیت حضوری' }}
                    </div>
                    <div class="font-bold text-sky-600">
                      {{ formatPrice(visit.price) }} تومان
                    </div>
                  </div>
                </div>

                <!-- Visit Actions -->
                <div class="px-4 pb-4 flex gap-2">
                  <button
                      @click="viewVisitDetails(visit)"
                      class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-eye"></i>
                    جزئیات
                  </button>
                  <button
                      v-if="visit.status === 'completed' && visit.prescription"
                      @click="viewPrescription(visit)"
                      class="flex-1 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-file-text"></i>
                    نسخه
                  </button>
                  <button
                      v-if="visit.status === 'completed' && !visit.hasReview"
                      @click="openReviewModal(visit)"
                      class="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-star"></i>
                    ثبت نظر
                  </button>
                  <button
                      v-if="visit.status === 'completed' && visit.hasReview"
                      @click="editReview(visit)"
                      class="flex-1 py-2.5 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-edit"></i>
                    ویرایش نظر
                  </button>
                  <NuxtLink
                      v-if="visit.status === 'upcoming' && visit.type === 'online'&&visit.consultationId!==null"
                      :to="`/chat/${visit.consultationId}`"
                      class="flex-1 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-message"></i>
                    چت با دکتر
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Chats Section -->
          <div v-if="activeSection === 'chats'" class="space-y-4">
            <!-- Chats Filter Tabs -->
            <div class="bg-white rounded-2xl border border-gray-100 p-2">
              <div class="flex gap-1">
                <button
                    v-for="tab in chatTabs"
                    :key="tab.id"
                    @click="activeChatTab = tab.id"
                    :class="[
                    'flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2',
                    activeChatTab === tab.id 
                      ? 'bg-sky-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ tab.label }}
                  <span v-if="tab.count" :class="[
                    'text-xs px-1.5 py-0.5 rounded-full',
                    activeChatTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  ]">
                    {{ tab.count }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Chats List -->
            <div v-if="filteredChats.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-messages-off text-4xl text-gray-300"></i>
              </div>
              <h3 class="text-gray-900 font-semibold mb-2">
                {{ activeChatTab === 'active' ? 'گفتگوی فعالی ندارید' : 'گفتگوی آرشیو شده‌ای ندارید' }}
              </h3>
              <p class="text-gray-500 text-sm">
                {{
                  activeChatTab === 'active' ? 'بعد از رزرو مشاوره می‌توانید با دکتر چت کنید' : 'گفتگوهای تمام شده اینجا نمایش داده می‌شوند'
                }}
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                  v-for="chat in filteredChats"
                  :key="chat.id"
                  class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-sky-200 hover:shadow-sm transition-all cursor-pointer"
              >
                <div class="p-4">
                  <div class="flex items-start gap-3">
                    <!-- Avatar -->
                    <div class="relative shrink-0">
                      <div class="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                        <i class="ti ti-user text-sky-600 text-xl"></i>
                      </div>
                      <span
                          v-if="chat.isOnline"
                          class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                      ></span>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 class="font-bold text-gray-900">{{ chat.doctorName }}</h4>
                          <p class="text-xs text-gray-500">{{ chat.specialty }}</p>
                        </div>
                        <div class="text-left shrink-0">
                          <p class="text-xs text-gray-400">{{ chat.lastMessageTime }}</p>
                          <span
                              v-if="chat.unreadCount > 0"
                              class="inline-flex items-center justify-center w-5 h-5 bg-sky-500 text-white text-[10px] font-bold rounded-full mt-1"
                          >
                            {{ chat.unreadCount }}
                          </span>
                        </div>
                      </div>

                      <!-- Last Message -->
                      <p class="text-sm text-gray-500 mt-2 truncate">
                        <i v-if="chat.lastMessageType === 'image'" class="ti ti-photo ml-1"></i>
                        <i v-if="chat.lastMessageType === 'file'" class="ti ti-file ml-1"></i>
                        {{ chat.lastMessage }}
                      </p>

                      <!-- Tags -->
                      <div class="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                            v-if="chat.status === 'waiting'"
                            class="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1"
                        >
                          <i class="ti ti-clock-pause"></i>
                          در انتظار تأیید دکتر
                        </span>
                        <span
                            v-else-if="chat.status === 'active'"
                            class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"
                        >
                          <i class="ti ti-clock"></i>
                          {{ chat.remainingTime }}
                        </span>
                        <span
                            v-else-if="chat.status === 'closed'"
                            class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"
                        >
                          <i class="ti ti-check"></i>
                          پایان یافته
                        </span>
                        <span
                            v-if="chat.hasPrescription"
                            class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1"
                        >
                          <i class="ti ti-prescription"></i>
                          نسخه صادر شده
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Chat Actions -->
                <div class="px-4 pb-4 flex gap-2">
                  <NuxtLink
                      :to="`/chat/${chat.id}`"
                      class="flex-1 py-2.5 bg-gradient-to-l from-sky-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-sky-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <i class="ti ti-message-circle"></i>
                    ورود به گفتگو
                  </NuxtLink>
                  <button
                      v-if="chat.hasPrescription"
                      class="px-4 py-2.5 bg-white border-2 border-purple-500 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-prescription"></i>
                    نسخه
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Wallet Section -->
          <div v-if="activeSection === 'wallet'" class="space-y-6">
            <!-- Wallet Card -->
            <div
                class="bg-gradient-to-l from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div
                  class="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
              <div
                  class="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>

              <div class="relative z-10">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-emerald-100 text-sm font-medium">موجودی قابل برداشت</p>
                  <i class="ti ti-wallet text-2xl opacity-50"></i>
                </div>
                <div class="flex items-baseline gap-1 mb-6">
                  <span class="text-4xl font-bold">{{ formatPrice(walletBalance) }}</span>
                  <span class="text-lg opacity-90">تومان</span>
                </div>
                <div class="flex gap-3">
                  <button @click="openIncreaseWallet"
                          class="flex-1 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-bold shadow hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <i class="ti ti-plus"></i>
                    افزایش موجودی
                  </button>
                  <button @click="openWithdrawWallet"
                          class="flex-1 py-2.5 bg-emerald-700 bg-opacity-50 text-white rounded-xl text-sm font-bold hover:bg-opacity-70 transition border border-emerald-400 flex items-center justify-center gap-2">
                    <i class="ti ti-arrow-bar-to-down"></i>
                    برداشت وجه
                  </button>
                </div>
              </div>
            </div>
            <!-- Transactions List -->
            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-700 flex items-center gap-2">
                  <i class="ti ti-history text-gray-400"></i>
                  تراکنش‌های اخیر
                </h3>
                <button class="text-xs text-blue-600 hover:underline">مشاهده همه</button>
              </div>
              <div class="divide-y divide-gray-100">
                <div v-for="tx in walletTransactions" :key="tx.id"
                     class="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div class="flex items-center gap-3">
                    <div
                        :class="['w-10 h-10 rounded-full flex items-center justify-center', tx.type === 'CREDIT' || tx.type === 'REFUND_IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600']">
                      <i :class="['ti text-lg', tx.type === 'CREDIT' || tx.type === 'REFUND_IN' ? 'ti-arrow-up' : 'ti-arrow-down']"></i>
                    </div>
                    <div>
                      <p class="font-bold text-gray-800 text-sm">{{ tx.title }}</p>
                      <p class="text-xs text-gray-400">{{ tx.date }}</p>
                    </div>
                  </div>
                  <span
                      :class="['font-bold text-sm', tx.type === 'CREDIT' || tx.type === 'REFUND_IN' ? 'text-green-600' : 'text-red-600']">
                    {{ tx.type === 'CREDIT' || tx.type === 'REFUND_IN' ? '+' : '-' }}{{ formatPrice(tx.amount) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders Section -->
          <div v-if="activeSection === 'orders'" class="space-y-4">
            <!-- Orders Filter Tabs -->
            <div class="bg-white rounded-2xl border border-gray-100 p-2">
              <div class="flex gap-1 overflow-x-auto scrollbar-hide">
                <button
                    v-for="tab in orderTabs"
                    :key="tab.id"
                    @click="activeOrderTab = tab.id"
                    :class="[
                    'flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center gap-2',
                    activeOrderTab === tab.id 
                      ? 'bg-sky-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ tab.label }}
                  <span v-if="tab.count" :class="[
                    'text-xs px-1.5 py-0.5 rounded-full',
                    activeOrderTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  ]">
                    {{ tab.count }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Orders List -->
            <div v-if="filteredOrders.length === 0"
                 class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-shopping-bag text-4xl text-gray-300"></i>
              </div>
              <h3 class="text-gray-900 font-semibold mb-2">سفارشی یافت نشد</h3>
              <p class="text-gray-500 text-sm">هنوز سفارشی در این دسته ثبت نشده است</p>
            </div>

            <div v-else class="space-y-4">
              <div
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <!-- Order Header -->
                <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      order.status === 'delivered' ? 'bg-green-100' :
                      order.status === 'processing' ? 'bg-blue-100' :
                      order.status === 'shipping' ? 'bg-purple-100' :
                      order.status === 'pending' ? 'bg-amber-100' :
                      order.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                    ]">
                      <i :class="[
                        order.status === 'delivered' ? 'ti ti-check text-green-600' :
                        order.status === 'processing' ? 'ti ti-circle-check text-blue-600' :
                        order.status === 'shipping' ? 'ti ti-truck text-purple-600' :
                        order.status === 'pending' ? 'ti ti-clock-pause text-amber-600' :
                        order.status === 'cancelled' ? 'ti ti-x text-red-600' : 'ti ti-package text-gray-600'
                      ]"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ order.code }}</p>
                      <p class="text-xs text-gray-500">{{ new Date(order.date).toLocaleDateString('fa-IR') }}</p>
                    </div>
                  </div>
                  <div :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipping' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  ]">
                    {{ order.statusLabel }}
                  </div>
                </div>

                <!-- Order Items Preview -->
                <div class="p-4">
                  <div class="flex items-center gap-4 pt-2">
                    <div
                        v-for="item in order.items.slice(0, 4)"
                        :key="item.id"
                        class="relative flex-shrink-0"
                    >
                      <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        <img :src="resolveUrl(item.image)" class="w-full h-full rounded-[2px] object-cover"/>
                      </div>
                      <span
                          class="absolute -top-2 -right-2 w-6 h-6 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                        {{ item.quantity }}
                      </span>
                    </div>
                    <div v-if="order.items.length > 4"
                         class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <span class="text-gray-500 text-sm font-medium">+{{ order.items.length - 4 }}</span>
                    </div>
                  </div>

                  <!-- Order Summary -->
                  <div
                      class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">

                    <!-- سمت راست: تعداد کالا و مانده -->
                    <div class="text-sm text-gray-500 flex flex-col gap-1">
                      <span>تعداد اقلام: <span class="font-bold text-gray-700">{{ order.items.length }}</span></span>

                      <!-- نمایش مانده پرداخت اگر وجود داشته باشد -->
                      <span v-if="order.remainingAmount > 0"
                            class="flex items-center gap-1 text-orange-600 font-bold text-xs bg-orange-50 px-2 py-0.5 rounded-md self-start">
                        <i class="ti ti-alert-circle"></i>
                        مانده: {{ formatPrice(order.remainingAmount) }} تومان
                      </span>

                      <!-- اگر مانده صفر است یا پرداخت کامل است -->
                      <span v-else-if="order.status === 'PENDING_REMAINING_PAYMENT' || order.status === 'paid'"
                            class="text-green-600 text-xs font-medium">
                      <i class="ti ti-check"></i>
                      پرداخت کامل
                    </span>
                    </div>

                    <!-- سمت چپ: مبلغ کل نهایی -->
                    <div class="text-left sm:text-right">
                      <p class="text-xs text-gray-400 mb-1">مبلغ کل نهایی</p>
                      <div class="font-bold text-sky-600 text-lg">
                        {{ formatPrice(order.total) }} <span class="text-xs font-normal text-gray-500">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Order Actions -->
                <div class="px-4 pb-4 flex gap-2">
                  <button
                      @click="viewOrderDetails(order)"
                      class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-eye"></i>
                    جزئیات سفارش
                  </button>
                  <!-- دکمه تسویه حساب: فقط اگر وضعیت CUSTOMER_PENDING باشد -->
                  <button
                      v-if="order.status === 'pending'"
                      @click="handleSettleOrder(order)"
                      class="flex-1 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-credit-card"></i>
                    بررسی وضعیت پرداخت
                  </button>
                  <!-- دکمه پرداخت مابقی (وضعیت جدید) -->
                  <button
                      v-if="order.status === 'PENDING_REMAINING_PAYMENT'"
                      @click="handleRemainingPayment(order)"
                      class="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-orange-500/30"
                  >
                    <i class="ti ti-credit-card"></i>
                    پرداخت مابقی
                  </button>
                  <!-- دکمه کنسل کردن: فقط اگر وضعیت CUSTOMER_PAID باشد -->
                  <button
                      v-if="order.status === 'paid'"
                      @click="handleCancelOrder(order)"
                      class="flex-1 py-2.5 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-x"></i>
                    کنسل کردن
                  </button>
                  <button
                      v-if="order.status === 'delivered' && !order.hasReview"
                      @click="openOrderReviewModal(order)"
                      class="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-star"></i>
                    ثبت نظر
                  </button>
                  <button
                      v-if="order.status === 'shipping'"
                      @click="trackOrder(order)"
                      class="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-map-pin"></i>
                    پیگیری مرسوله
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div v-if="activeSection === 'reviews'" class="space-y-4">
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="ti ti-star text-amber-500"></i>
                نظرات من
              </h2>

              <div v-if="userReviews.length === 0" class="text-center py-12">
                <div class="w-20 h-20 bg-amber-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i class="ti ti-star-off text-4xl text-amber-300"></i>
                </div>
                <h3 class="text-gray-900 font-semibold mb-2">هنوز نظری ثبت نکرده‌اید</h3>
                <p class="text-gray-500 text-sm">بعد از تکمیل ویزیت می‌توانید نظر خود را ثبت کنید</p>
              </div>

              <div v-else class="space-y-4">
                <div
                    v-for="review in userReviews"
                    :key="review.id"
                    class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start gap-3">
                    <!-- آواتار با گرادیانت -->
                    <div
                        class="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {{ review.doctorName?.charAt(0) || 'د' }}
                    </div>

                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-bold text-gray-900">{{ review.doctorName }}</h3>
                      </div>

                      <!-- ستاره‌ها و تاریخ -->
                      <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                        <div class="flex items-center gap-1">
                          <i
                              v-for="star in 5"
                              :key="star"
                              :class="star <= review.rating ? 'ti ti-star-filled text-amber-500' : 'ti ti-star text-gray-300'"
                              class="text-base"
                          ></i>
                        </div>
                        <span>•</span>
                        <span>{{ review.date }}</span>
                      </div>

                      <!-- متن نظر -->
                      <p class="text-gray-700 leading-relaxed mb-3">{{ review.comment }}</p>

                      <!-- پاسخ دکتر -->
                      <div v-if="review.reply" class="bg-sky-50 rounded-lg p-4 mt-3">
                        <div class="flex items-start gap-2 mb-2">
                          <i class="ti ti-message-circle text-sky-600"></i>
                          <span class="text-sm font-bold text-sky-900">پاسخ دکتر:</span>
                        </div>
                        <p class="text-sm text-gray-700 leading-relaxed">{{ review.reply }}</p>
                      </div>

                      <!-- دکمه‌های عملیات -->
                      <div class="flex items-center gap-3 mt-4">
                        <button
                            @click="editReviewFromList(review)"
                            class="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                        >
                          <i class="ti ti-edit"></i>
                          ویرایش نظر
                        </button>
                        <button
                            @click="deleteReview(review)"
                            class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <i class="ti ti-trash"></i>
                          حذف نظر
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses Section -->
          <div v-if="activeSection === 'addresses'" class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-map-pin text-sky-500"></i>
                آدرس‌های من
              </h2>
              <button
                  @click="showAddAddressModal = true"
                  class="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors flex items-center gap-2"
              >
                <i class="ti ti-plus"></i>
                آدرس جدید
              </button>
            </div>

            <div v-if="addresses.length === 0" class="text-center py-8">
              <i class="ti ti-map-pin-off text-gray-300 text-5xl mb-4"></i>
              <p class="text-gray-500">آدرسی ثبت نشده است</p>
            </div>

            <div v-else class="space-y-4">
              <div
                  v-for="address in addresses"
                  :key="address.id"
                  :class="address.isDefault ? 'border-sky-200 bg-sky-50/50' : 'border-gray-100'"
                  class="border rounded-xl p-4 transition-all hover:shadow-md"
              >
                <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">

                  <!-- 1. آیکون -->
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-map-pin text-gray-500"></i>
                  </div>

                  <!-- 2. محتوای اصلی (اطلاعات) -->
                  <div class="flex-1 min-w-0">
                    <!-- سطر اول: عنوان و برچسب پیش‌فرض -->
                    <div class="flex items-center justify-between sm:justify-start gap-2 mb-2">
                      <h4 class="font-bold text-gray-900 truncate text-base">
                        {{ address.title }}
                      </h4>
                      <!-- برچسب پیش‌فرض: در موبایل ممکن است در خط بعد برود یا فشرده شود -->
                      <span
                          v-if="address.isDefault"
                          class="flex-shrink-0 text-xs font-medium bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200"
                      >
                      پیش‌فرض
                    </span>
                    </div>

                    <!-- سطر دوم: آدرس کامل -->
                    <p class="text-gray-600 text-sm leading-relaxed mb-2">
                    <span class="line-clamp-2 sm:line-clamp-none">
                      {{ address.fullAddress.address?.road }} .
                      {{ address.fullAddress.address?.neighbourhood ?? address.fullAddress.address?.town }} .
                      {{ address.fullAddress.address.suburb }}
                    </span>
                    </p>

                    <!-- سطر سوم: گیرنده و تلفن -->
                    <div
                        class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 border-t border-gray-100 pt-2 mt-1">
                      <div class="flex items-center gap-1">
                        <i class="ti ti-user text-gray-400 text-xs"></i>
                        <span class="truncate max-w-[150px]">{{ address.receiver }}</span>
                      </div>
                      <div class="flex items-center gap-1 ltr">
                        <i class="ti ti-phone text-gray-400 text-xs"></i>
                        <span class="font-mono text-gray-700">{{ address.phone }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                      class="flex sm:flex-col gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <button
                        @click="editAddress(address)"
                        class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                      <i class="ti ti-edit"></i>

                    </button>
                    <button
                        @click="deleteAddress(address)"
                        class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Notifications Section -->
          <div v-if="activeSection === 'notifications'" class="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-bell text-blue-500"></i>
              تنظیمات اعلان‌ها
            </h2>

            <div class="space-y-4">
              <div
                  v-for="setting in notificationSettings"
                  :key="setting.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <h4 class="font-medium text-gray-900">{{ setting.title }}</h4>
                  <p class="text-gray-500 text-sm mt-1">{{ setting.description }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <!--
                     1. v-model: وضعیت چک‌باکس را به متغیر متصل می‌کند
                     2. @change: وقتی تغییر کرد، متد آپدیت استور را صدا می‌زند
                  -->
                  <input
                      type="checkbox"
                      v-model="setting.enabled"
                      @change="handleNotificationChange(setting.id, setting.enabled)"
                      class="sr-only peer"
                  >
                  <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div v-if="activeSection === 'security'" class="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-shield-check text-sky-500"></i>
              امنیت حساب
            </h2>

            <div class="space-y-6">
              <!-- Change Password -->
              <div class="p-4 bg-gray-50 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">تغییر رمز عبور</h4>
                    <p class="text-gray-500 text-sm mt-1">رمز عبور جدید برای حساب کاربری</p>
                  </div>
                  <button
                      class="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    تغییر رمز
                  </button>
                </div>
              </div>

              <!-- Two Factor Auth -->
              <div class="p-4 bg-gray-50 rounded-xl opacity-60">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-medium text-gray-900">احراز هویت دو مرحله‌ای</h4>
                      <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">به زودی</span>
                    </div>
                    <p class="text-gray-500 text-sm mt-1">امنیت بیشتر برای حساب شما</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-not-allowed">
                    <input type="checkbox" disabled class="sr-only peer">
                    <div
                        class="w-11 h-6 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5"></div>
                  </label>
                </div>
              </div>
              <!-- Active Sessions -->
              <div class="p-4 bg-gray-50 rounded-xl">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="font-medium text-gray-900">دستگاه‌های فعال</h4>
                    <p class="text-gray-500 text-sm mt-1">مدیریت دستگاه‌های متصل</p>
                  </div>
                  <button
                      v-if="sessions.length > 0"
                      @click="revokeAllSessions"
                      class="text-xs text-red-500 hover:text-red-700"
                  >
                    خروج از همه
                  </button>
                </div>

                <div v-if="loading" class="text-center text-gray-500 py-4">
                  در حال بارگذاری...
                </div>

                <div v-else class="space-y-3">
                  <div
                      v-for="session in sessions"
                      :key="session.id"
                      class="flex items-center gap-3 p-3 bg-white rounded-lg border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <!-- پاس دادن آبجکت کامل session به تابع -->
                    <i :class="`${getDeviceIcon(session)} text-gray-400 text-xl`"></i>

                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <!-- استفاده از deviceName -->
                        <span class="text-gray-900 text-sm font-medium">{{ session.deviceName }}</span>

                        <span
                            class="text-xs mr-2"
                            :class="session.isActive ? 'text-green-500' : 'text-gray-400'"
                        >
                            {{ session.isActive ? 'فعال' : new Date(session.createdAt).toLocaleDateString('fa-IR') }}
                          </span>
                      </div>
                      <!-- نمایش سیستم عامل و آی‌پی -->
                      <div class="text-xs text-gray-400 mt-1">
                        {{ session.os }} <span v-if="session.ip">• {{ session.ip }}</span>
                      </div>
                    </div>

                    <button
                        v-if="session.isActive"
                        @click="revokeSession(session)"
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="قطع ارتباط"
                    >
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>

                  <div v-if="sessions.length === 0" class="text-center text-gray-400 text-sm py-4">
                    هیچ دستگاه فعالی یافت نشد.
                  </div>
                </div>
              </div>

              <!-- Delete Account -->
              <div class="p-4 bg-red-50 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-red-700">حذف حساب کاربری</h4>
                    <p class="text-red-500 text-sm mt-1">این عمل غیرقابل بازگشت است</p>
                  </div>
                  <button
                      class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                    حذف حساب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Address Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showAddAddressModal"
            class="fixed inset-0 bg-black/50 z-[99998]"
            @click="showAddAddressModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showAddAddressModal"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[99998] pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[80vh] w-full md:w-[500px] overflow-hidden pointer-events-auto">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 class="font-bold text-gray-900">افزودن آدرس جدید</h3>
              <button @click="showAddAddressModal = false" class="w-8 h-8 flex items-center justify-center">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <!-- داخل تگ form مربوط به showAddAddressModal -->
            <form @submit.prevent="saveAddress" class="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">عنوان آدرس</label>
                <input
                    type="text"
                    v-model="newAddress.title"
                    placeholder="مثال: خانه، محل کار"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-400"
                >
              </div>

              <!-- کامپوننت انتخاب آدرس (استان، شهر و آدرس کامل از اینجا پر می‌شود) -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">موقعیت و آدرس</label>
                <ClientOnly>
                  <AddressSelector
                      v-model="newAddressLocation"
                      placeholder="روی نقشه آدرس را انتخاب کنید"
                      title="انتخاب موقعیت آدرس"
                  />
                </ClientOnly>
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">نام گیرنده</label>
                <input
                    type="text"
                    v-model="newAddress.receiver"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-400"
                >
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">شماره تماس</label>
                <input
                    type="tel"
                    v-model="newAddress.phone"
                    placeholder="09123456789"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 ltr"
                    dir="ltr"
                >
              </div>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="newAddress.isDefault"
                    class="rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                >
                <span class="text-gray-700 text-sm">تنظیم به عنوان آدرس پیش‌فرض</span>
              </label>

              <button
                  type="submit"
                  class="w-full py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors"
              >
                ذخیره آدرس
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast">
      <div
          v-if="toast.show"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
      >
        <i :class="toast.icon"></i>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showOrderDetailsModal"
            class="fixed inset-0 bg-black/50 z-[9999]"
            @click="showOrderDetailsModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showOrderDetailsModal && selectedOrder"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[9999] pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[85vh] w-full md:w-[600px] overflow-hidden pointer-events-auto">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 class="font-bold text-gray-900">جزئیات سفارش {{ selectedOrder.code }}</h3>
              <button @click="showOrderDetailsModal = false" class="w-8 h-8 flex items-center justify-center">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <div class="p-4 overflow-y-auto max-h-[70vh]">
              <!-- Order Status -->
              <div class="bg-gray-50 rounded-xl p-4 mb-4">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    selectedOrder.status === 'delivered' ? 'bg-green-100' :
                    selectedOrder.status === 'processing' ? 'bg-blue-100' :
                    selectedOrder.status === 'shipping' ? 'bg-amber-100' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                  ]">
                    <i :class="[
                      'text-xl',
                      selectedOrder.status === 'delivered' ? 'ti ti-check text-green-600' :
                      selectedOrder.status === 'processing' ? 'ti ti-clock text-blue-600' :
                      selectedOrder.status === 'shipping' ? 'ti ti-truck text-amber-600' :
                      selectedOrder.status === 'cancelled' ? 'ti ti-x text-red-600' : 'ti ti-package text-gray-600'
                    ]"></i>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ selectedOrder.statusLabel }}</p>
                    <p class="text-sm text-gray-500">{{ new Date(selectedOrder.date).toLocaleDateString('fa-IR') }}</p>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <h4 class="font-semibold text-gray-900 mb-3">محصولات سفارش</h4>
              <div class="space-y-3 mb-4">
                <div
                    v-for="item in selectedOrder.items"
                    :key="item.id"
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div
                      class="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <img :src="resolveUrl(item.image)" class="w-full h-full rounded-[2px] object-cover"/>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">تعداد: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-bold text-sky-600 flex-shrink-0">{{ formatPrice(item.price * item.quantity) }}
                    تومان</p>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="border-t border-gray-200 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">جمع کالاها</span>
                  <span class="text-gray-900">{{ formatPrice(selectedOrder.total) }} تومان</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">هزینه ارسال</span>
                  <span class="text-green-600">{{ formatPrice(selectedOrder.shippingCost) }} تومان</span>
                </div>
                <div class="flex justify-between font-bold pt-2 border-t border-gray-100">
                  <span class="text-gray-900">مبلغ کل</span>
                  <span class="text-sky-600">{{ formatPrice(selectedOrder.total) }} تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Tracking Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showTrackingModal"
            class="fixed inset-0 bg-black/50 z-50"
            @click="showTrackingModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showTrackingModal && selectedOrder"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] w-full md:w-[500px] overflow-hidden pointer-events-auto flex flex-col"
          >
            <!-- Header -->
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 class="font-bold text-gray-900">پیگیری مرسوله</h3>
              <button @click="showTrackingModal = false" class="w-8 h-8 flex items-center justify-center">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-4 overflow-y-auto flex-1">

              <!-- Tracking Code Section -->
              <div class="bg-amber-50 rounded-xl p-4 mb-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-amber-700">کد رهگیری پستی</p>
                    <!-- اگر کد رهگیری در metadata استوریست ذخیره شده -->
                    <p class="font-bold text-amber-900 font-mono text-lg mt-1" dir="ltr">
                      {{ selectedOrder.metadata?.alopeykOrderId || '---' }}
                    </p>
                  </div>
                  <button
                      @click="copyTrackingCode(selectedOrder)"
                      class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center hover:bg-amber-200 transition-colors"
                  >
                    <i class="ti ti-copy text-amber-700"></i>
                  </button>
                </div>
              </div>

              <!-- Status Section -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-semibold text-gray-900">وضعیت مرسوله</h4>
                  <!-- لینک مستقیم به الوپیک -->
                  <a
                      v-if="alopeykStatusData.trackingUrl"
                      :href="alopeykStatusData.trackingUrl"
                      target="_blank"
                      class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    مشاهده در الوپیک
                    <i class="ti ti-external-link"></i>
                  </a>
                </div>

                <!-- Loading State -->
                <div v-if="loadingAlopeyk" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="alopeykStatusData.errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  <i class="ti ti-alert-circle mr-1"></i>
                  {{ alopeykStatusData.errorMessage }}
                </div>

                <!-- Timeline -->
                <div v-else class="relative pr-6">
                  <!-- Timeline Line -->
                  <div class="absolute right-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                  <div class="space-y-6">
                    <!-- Current Status (Highlighted) -->
                    <div class="relative">
                      <div
                          class="absolute -right-4 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow animate-pulse"></div>
                      <div class="bg-amber-50 rounded-xl p-3 border border-amber-100">
                        <p class="font-bold text-amber-900">{{ alopeykStatusData.statusText }}</p>
                        <p class="text-sm text-amber-700 mt-1">{{ alopeykStatusData.statusDescription }}</p>
                        <p class="text-xs text-amber-600 mt-2">بروزرسانی: {{ getCurrentTime() }}</p>
                      </div>
                    </div>

                    <template v-if="alopeykStatusData.progress > 0">
                      <div class="relative">
                        <div
                            class="absolute -right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                        <div class="bg-gray-50 rounded-xl p-3">
                          <p class="font-medium text-gray-900">خروج از مرکز پردازش</p>
                          <p class="text-sm text-gray-500 mt-1">سفارش در مسیر تحویل به مقصد است</p>
                          <p class="text-xs text-gray-400 mt-2">{{ getRelativeTime(2) }}</p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Visit Details Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showVisitDetailsModal"
            class="fixed inset-0 bg-black/50 z-[9999]"
            @click="showVisitDetailsModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showVisitDetailsModal && selectedVisit"
            class="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center pointer-events-none"
        >
          <!-- Backdrop -->
          <div
              class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
              @click="showVisitDetailsModal = false"
          ></div>

          <!-- Modal Content -->
          <div
              class="bg-white w-full md:w-[650px] max-h-[95vh] md:max-h-[85vh] h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col relative z-10 rounded-t-3xl md:rounded-2xl transition-all duration-300 ease-in-out"
          >

            <!-- Header -->
            <div
                class="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20 shrink-0">
              <div class="flex-1">
                <h3 class="text-base md:text-lg font-bold text-gray-900">جزئیات ویزیت</h3>
                <p class="text-xs md:text-sm text-gray-500 mt-1">
                  کد پیگیری: <span class="font-mono font-semibold text-gray-700">{{
                    selectedVisit.trackingCode || '#' + selectedVisit.examCode
                  }}</span>
                </p>
              </div>
              <button
                  @click="showVisitDetailsModal = false"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 mr-2 shrink-0"
              >
                <i class="ti ti-x text-lg"></i>
              </button>
            </div>

            <!-- Scrollable Body -->
            <div class="p-4 md:p-5 overflow-y-auto flex-1 space-y-5 md:space-y-6 custom-scrollbar">

              <!-- Status Banner -->
              <div class="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div
                    :class="[
              'w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-sm shrink-0',
              selectedVisit.status === 'completed' ? 'bg-green-100' :
              selectedVisit.status === 'upcoming' ? 'bg-blue-100' :
              selectedVisit.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
            ]"
                >
                  <i
                      :class="[
                'text-xl md:text-2xl',
                selectedVisit.status === 'completed' ? 'ti ti-check text-green-600' :
                selectedVisit.status === 'upcoming' ? 'ti ti-clock text-blue-600' :
                selectedVisit.status === 'cancelled' ? 'ti ti-x text-red-600' : 'ti ti-stethoscope text-gray-600'
              ]"
                  ></i>
                </div>
                <div class="flex-1 text-right">
            <span
                class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-1"
                :class="selectedVisit.status === 'completed' ? 'bg-green-100 text-green-700' :
                     selectedVisit.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                     selectedVisit.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'"
            >
              {{ selectedVisit.statusLabel }}
            </span>
                  <p class="text-sm md:text-base text-gray-800 font-medium">
                    {{ selectedVisit.date }} - ساعت {{ selectedVisit.time }}
                  </p>
                </div>
              </div>

              <!-- Grid: Doctor & Pet Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Doctor Info -->
                <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3 mb-3">
                    <div
                        class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 overflow-hidden">
                      <img
                          v-if="selectedVisit.doctorAvatar"
                          :src="resolveUrl(selectedVisit.doctorAvatar)"
                          alt="doctor"
                          class="w-full h-full object-cover"
                      />
                      <i v-else class="ti ti-user-circle text-xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">اطلاعات دامپزشک</h4>
                  </div>
                  <p class="font-semibold text-gray-800 text-sm leading-tight">{{ selectedVisit.doctorName }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ selectedVisit.specialty || 'متخصص داخلی' }}</p>
                  <div class="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-600 space-y-1">
                    <p><i class="ti ti-map-pin ml-1"></i> {{ selectedVisit.doctorAddress }}</p>
                    <p><i class="ti ti-phone ml-1"></i> {{ selectedVisit.doctorPhone }}</p>
                  </div>
                </div>

                <!-- Pet Info -->
                <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-center gap-3 mb-3">
                    <div
                        class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 overflow-hidden">
                      <img
                          v-if="selectedVisit.petImage"
                          :src="resolveUrl(selectedVisit.petImage)"
                          alt="pet"
                          class="w-full h-full object-cover"
                      />
                      <i v-else class="ti ti-paw text-xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">اطلاعات حیوان</h4>
                  </div>
                  <div class="space-y-1">
                    <p class="font-semibold text-gray-800 text-sm">{{ selectedVisit.petName }}</p>
                    <div class="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                      <span v-if="selectedVisit.petAge" class="bg-gray-50 px-2 py-1 rounded border border-gray-100">سن: {{
                          selectedVisit.petAge
                        }}</span>
                      <span v-if="selectedVisit.petBreed" class="bg-gray-50 px-2 py-1 rounded border border-gray-100">نژاد: {{
                          selectedVisit.petBreed
                        }}</span>
                      <span v-if="selectedVisit.petType" class="bg-gray-50 px-2 py-1 rounded border border-gray-100">نوع: {{
                          selectedVisit.petType
                        }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Visit Details (Reason & Code) -->
              <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div class="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                  <i class="ti ti-notes text-sky-600"></i>
                  <span>شرح ویزیت</span>
                </div>
                <div class="space-y-3">
                  <div>
                    <label class="text-xs text-gray-500 block mb-1.5">علت مراجعه / شکایت اصلی</label>
                    <p class="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[60px]">
                      {{ selectedVisit.reason || 'توضیحاتی ثبت نشده است.' }}
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs text-gray-500 block mb-1">کد معاینه</label>
                      <p class="text-sm font-mono font-medium text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 text-center">
                        {{ selectedVisit.examCode || '---' }}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 block mb-1">مالک حیوان</label>
                      <p class="text-sm font-medium text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 text-center">
                        {{ selectedVisit.ownerName || 'نام مالک' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Diagnosis & Treatment -->
              <div v-if="selectedVisit.diagnosis || selectedVisit.treatment"
                   class="bg-sky-50 border border-sky-100 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-3 text-sky-800 font-bold text-sm">
                  <i class="ti ti-file-medical"></i>
                  <span>تشخیص و درمان</span>
                </div>
                <div class="space-y-3">
                  <div v-if="selectedVisit.diagnosis">
                    <label class="text-xs text-sky-600 font-semibold block mb-1">تشخیص نهایی</label>
                    <p class="text-sm text-sky-900 leading-relaxed bg-white/60 p-2 rounded">
                      {{ selectedVisit.diagnosis }}
                    </p>
                  </div>
                  <div v-if="selectedVisit.treatment">
                    <label class="text-xs text-sky-600 font-semibold block mb-1">دستورات پزشک / داروها</label>
                    <p class="text-sm text-sky-900 leading-relaxed whitespace-pre-line bg-white/60 p-2 rounded">
                      {{ selectedVisit.treatment }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Cost Section -->
              <div class="border-t border-gray-200 pt-4 mt-2">
                <div
                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <div class="w-full sm:w-auto text-right sm:text-right">
                    <span class="text-gray-500 text-sm block mb-1">هزینه کل ویزیت</span>
                    <div class="flex items-center gap-2 justify-start sm:justify-start">
                      <span class="text-sm font-medium text-gray-800">{{ formatPrice(selectedVisit.price) }} <span
                          class="text-xs text-gray-500">تومان</span></span>
                      <span v-if="selectedVisit.discount" class="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">
                  تخفیف: {{ formatPrice(selectedVisit.discount) }}
                </span>
                    </div>
                  </div>
                  <div
                      class="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                    <span class="text-xs text-gray-500 block mb-1">مبلغ قابل پرداخت</span>
                    <span class="text-xl font-bold text-sky-600">{{
                        formatPrice(selectedVisit.finalPrice || selectedVisit.price)
                      }} <span class="text-sm font-normal text-gray-500">تومان</span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div
                class="p-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 justify-end shrink-0">
              <button
                  @click="showVisitDetailsModal = false"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                بستن
              </button>
              <button
                  v-if="selectedVisit.status === 'completed'"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 text-white font-medium text-sm hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200 flex items-center justify-center gap-2"
              >
                <i class="ti ti-printer"></i>
                چاپ فاکتور
              </button>
              <button
                  v-if="selectedVisit.status !== 'completed' && selectedVisit.status !== 'cancelled'"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                <i class="ti ti-check"></i>
                تکمیل ویزیت
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Review Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
            v-if="showReviewModal"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            @click.self="showReviewModal = false"
        >
          <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 bg-gradient-to-l from-amber-50 to-orange-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                      class="w-12 h-12 bg-gradient-to-l from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <i class="ti ti-star text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">ثبت نظر</h3>
                    <p class="text-xs text-gray-500">{{ reviewSubtitle }}</p>
                  </div>
                </div>
                <button
                    @click="showReviewModal = false"
                    class="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <i class="ti ti-x text-xl text-gray-600"></i>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div
                  v-if="isAutoReviewPrompt"
                  class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <div class="flex items-start gap-3">
                  <i class="ti ti-info-circle text-amber-600 text-xl mt-0.5"></i>
                  <div>
                    <p class="text-sm font-bold text-amber-900">لطفاً نظر خود را ثبت کنید</p>
                    <p class="text-xs text-amber-800 mt-1">
                      {{ reviewKind === 'visit' ? 'ویزیت شما انجام شده است.' : 'محصول شما تحویل داده شده است.' }}
                    </p>
                  </div>
                </div>
              </div>

              <form @submit.prevent="submitReview" class="space-y-4">
                <!-- Rating -->
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-3">امتیاز شما</label>
                  <div class="flex items-center gap-2 justify-center">
                    <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        @click="reviewRating = star"
                        class="text-4xl transition-all hover:scale-110"
                    >
                      <i :class="star <= reviewRating ? 'ti ti-star-filled text-amber-400' : 'ti ti-star text-gray-300'"></i>
                    </button>
                  </div>
                  <p class="text-center text-sm text-gray-500 mt-2">
                    {{
                      reviewRating === 5 ? 'عالی' : reviewRating === 4 ? 'خوب' : reviewRating === 3 ? 'متوسط' : reviewRating === 2 ? 'ضعیف' : reviewRating === 1 ? 'خیلی ضعیف' : 'امتیاز دهید'
                    }}
                  </p>
                </div>

                <!-- Comment -->
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نظر شما</label>
                  <textarea
                      v-model="reviewComment"
                      rows="4"
                      :placeholder="reviewKind === 'visit' ? 'تجربه خود را با ما به اشتراک بگذارید...' : 'تجربه خود را از این خرید با ما به اشتراک بگذارید...'"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 resize-none"
                  ></textarea>
                </div>

                <!-- Actions -->
                <div class="flex gap-3">
                  <button
                      type="button"
                      @click="closeReviewModal"
                      class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                      type="submit"
                      :disabled="reviewRating === 0 || !reviewComment.trim()"
                      :class="[
                      'flex-1 py-3 rounded-xl font-medium transition-colors',
                      reviewRating > 0 && reviewComment.trim() 
                        ? 'bg-gradient-to-l from-amber-500 to-orange-600 text-white hover:shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                  >
                    ثبت نظر
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Support Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
            v-if="showSupportModal"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            @click.self="showSupportModal = false"
        >
          <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 bg-gradient-to-l from-sky-50 to-blue-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                      class="w-12 h-12 bg-gradient-to-l from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <i class="ti ti-headset text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">پشتیبانی</h3>
                    <p class="text-xs text-gray-500">با ما در تماس باشید</p>
                  </div>
                </div>
                <button
                    @click="showSupportModal = false"
                    class="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <i class="ti ti-x text-xl text-gray-600"></i>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <!-- Phone -->
              <a href="tel:02188888888"
                 class="flex items-center gap-4 p-4 bg-gradient-to-l from-sky-50 to-blue-50 rounded-2xl hover:shadow-md transition-all group">
                <div
                    class="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="ti ti-phone text-2xl text-sky-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">تماس تلفنی</p>
                  <p class="font-bold text-gray-900 ltr" dir="ltr">021-88888888</p>
                </div>
                <i class="ti ti-chevron-left text-gray-400 group-hover:text-sky-600 transition-colors"></i>
              </a>

              <!-- WhatsApp -->
              <a href="https://wa.me/989123456789" target="_blank"
                 class="flex items-center gap-4 p-4 bg-gradient-to-l from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all group">
                <div
                    class="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="ti ti-brand-whatsapp text-2xl text-green-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">واتساپ</p>
                  <p class="font-bold text-gray-900 ltr" dir="ltr">0912 345 6789</p>
                </div>
                <i class="ti ti-chevron-left text-gray-400 group-hover:text-green-600 transition-colors"></i>
              </a>

              <!-- Telegram -->
              <a href="https://t.me/petoman_support" target="_blank"
                 class="flex items-center gap-4 p-4 bg-gradient-to-l from-blue-50 to-sky-50 rounded-2xl hover:shadow-md transition-all group">
                <div
                    class="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="ti ti-brand-telegram text-2xl text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">تلگرام</p>
                  <p class="font-bold text-gray-900">@petoman_support</p>
                </div>
                <i class="ti ti-chevron-left text-gray-400 group-hover:text-blue-600 transition-colors"></i>
              </a>

              <!-- Email -->
              <a href="mailto:support@petoman.com"
                 class="flex items-center gap-4 p-4 bg-gradient-to-l from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all group">
                <div
                    class="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="ti ti-mail text-2xl text-purple-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">ایمیل</p>
                  <p class="font-bold text-gray-900 ltr" dir="ltr">support@petoman.com</p>
                </div>
                <i class="ti ti-chevron-left text-gray-400 group-hover:text-purple-600 transition-colors"></i>
              </a>

              <!-- Working Hours -->
              <div class="mt-4 p-4 bg-gray-50 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                  <i class="ti ti-clock text-gray-600"></i>
                  <span class="font-bold text-gray-900 text-sm">ساعات پاسخگویی</span>
                </div>
                <p class="text-sm text-gray-600 mr-6">شنبه تا پنجشنبه: 9:00 - 21:00</p>
                <p class="text-sm text-gray-600 mr-6">جمعه: 10:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Edit Request Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showEditRequestModal"
            class="fixed inset-0 bg-black/50 z- backdrop-blur-sm"
            @click="closeEditRequestModal"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showEditRequestModal && editingRequest"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z- pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[90vh] w-full md:w-[700px] overflow-hidden pointer-events-auto flex flex-col shadow-2xl"
          >
            <!-- Header -->
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 class="font-bold text-gray-900">ویرایش درخواست</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ editingRequest.tenantName }}</p>
              </div>
              <button
                  @click="closeEditRequestModal"
                  class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition text-gray-500"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">

              <!-- 1. بخش کارت‌های مدارک -->
              <div>
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i class="ti ti-file-text text-blue-500"></i>
                  مدارک (قابل ویرایش)
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  <div
                      v-for="(docItem, index) in documentsList"
                      :key="docItem.key"
                      class="group relative border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white"
                  >
                    <!-- دکمه تغییر -->
                    <label
                        v-if="canEdit"
                        class="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur text-gray-700 text-xs font-bold px-2 py-1 rounded-lg shadow hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
                        @click.stop
                    >
                      <i class="ti ti-camera"></i>
                      تغییر
                      <input
                          type="file"
                          class="hidden"
                          :accept="docItem.type === 'video' ? 'video/*' : 'image/*'"
                          @change.stop="(e) => handleFileUpload(e, docItem.key)"
                      >
                    </label>

                    <!-- کانتینر پیش‌نمایش -->
                    <div
                        class="aspect-square bg-gray-100 cursor-pointer relative overflow-hidden"
                        @click="openViewer(docItem)"
                    >
                      <template v-if="docItem.type?.startsWith('video')">
                        <video :src="resolveUrl(docItem.thumbnail)" class="w-full h-full object-cover" muted preload="metadata"></video>
                        <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div class="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <i class="ti ti-player-play-filled text-blue-600 text-lg ml-0.5"></i>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <img v-if="docItem.thumbnail" :src="resolveUrl(docItem.thumbnail)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                          <i class="ti ti-photo text-2xl"></i>
                        </div>
                      </template>
                    </div>

                    <div class="p-3 text-center border-t border-gray-100">
                      <p class="text-sm font-medium text-gray-700 truncate">{{ docItem.name }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. Services Section -->
              <div v-if="editingRequest.type !== 'vet'">
                <label class="block text-gray-700 text-sm font-medium mb-2">خدمات ارائه شده</label>
                <div class="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                  <span v-for="(srv, index) in editForm.services" :key="index"
                        class="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                    <i :class="getServiceIcon(srv.value || srv)"></i>
                    {{ srv.label || srv }}
                    <button v-if="canEdit" @click="removeService(index)" class="hover:text-red-600 transition">
                      <i class="ti ti-x"></i>
                    </button>
                  </span>
                  <span v-if="editForm.services.length === 0" class="text-gray-400 text-sm py-1">خدمتی انتخاب نشده</span>
                </div>

                <div class="relative">
                  <button
                      v-if="canEdit"
                      @click="showServiceDropdown = !showServiceDropdown"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-right flex items-center justify-between hover:border-blue-400 transition"
                  >
                    <span class="text-gray-700 text-sm">انتخاب خدمات...</span>
                    <i class="ti ti-chevron-down text-gray-400"></i>
                  </button>
                  <Transition name="dropdown">
                    <div
                        v-if="showServiceDropdown"
                        @click.self="showServiceDropdown = false"
                        class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
                    >
                      <div
                          v-for="srv in availableServices"
                          :key="srv.value"
                          @click="addService(srv)"
                          class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-50 last:border-0"
                      >
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                          <i :class="srv.icon"></i>
                        </div>
                        <span class="text-sm font-medium text-gray-700">{{ srv.label }}</span>
                        <i v-if="isServiceSelected(srv.value)" class="ti ti-check text-blue-500 mr-auto"></i>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- 3. Vet Specific Fields -->
              <div v-if="editingRequest.type === 'vet'"
                   class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sky-50 p-4 rounded-xl border border-sky-100">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">تخصص</label>
                  <input  type="text" v-model="editForm.specialty" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">سال‌های تجربه</label>
                  <input type="text" v-model="editForm.experience" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                </div>
                <div class="md:col-span-2">
                  <label class="block text-gray-700 text-sm font-medium mb-2">توضیحات</label>
                  <textarea v-model="editForm.description" rows="2" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 resize-none"></textarea>
                </div>
              </div>

              <!-- 4. Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نام {{ editingRequest.type === 'vet' ? 'دامپزشک' : 'مرکز' }}</label>
                  <input type="text" :value="editingRequest.tenantName" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نوع</label>
                  <input type="text" :value="editingRequest.typeLabel" disabled class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نام مالک</label>
                  <input type="text" v-model="editForm.ownerName" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">شماره تماس</label>
                  <input type="tel" v-model="editForm.phone" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 ltr" dir="ltr">
                </div>
              </div>

              <ClientOnly>
                <AddressSelector v-if="canEdit"
                    v-model="newAddressLocation"
                    placeholder="روی نقشه آدرس را انتخاب کنید"
                    title="تغییر موقعیت آدرس"
                    @update:modelValue="onChangeLocation"
                />
              </ClientOnly>

              <!-- 5. Address & Location -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">آدرس کامل</label>
                <textarea v-model="localAddressText" :disabled="!canEdit" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">استان</label>
                  <input type="text" v-model="editForm.province" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">شهر</label>
                  <input type="text" v-model="editForm.city" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                </div>
              </div>

              <!-- 6. Financial Info -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">شماره شبا (IBAN)</label>
                <input type="text" v-model="editForm.iban" :disabled="!canEdit" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 ltr font-mono" dir="ltr">
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 sticky bottom-0 z-10">
              <button @click="closeEditRequestModal"
                      class="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition">
                انصراف
              </button>
              <button @click="saveRequestEdit"
                      :disabled="editForm.status!=='needs_revision'"
                      class="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400">
                <i class="ti ti-device-floppy"></i>
                ثبت تغییرات
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Edit Address Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showEditAddressModal"
            class="fixed inset-0 bg-black/50 z-[99998]"
            @click="showEditAddressModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showEditAddressModal"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[99998] pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[80vh] w-full md:w-[500px] overflow-hidden pointer-events-auto">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 class="font-bold text-gray-900">ویرایش آدرس</h3>
              <button @click="showEditAddressModal = false" class="w-8 h-8 flex items-center justify-center">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>
            <form @submit.prevent="updateAddress" class="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">عنوان آدرس</label>
                <input
                    type="text"
                    v-model="editAddressForm.title"
                    placeholder="مثال: خانه، محل کار"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-400"
                >
              </div>

              <!-- موقعیت و آدرس -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">موقعیت و آدرس</label>
                <ClientOnly>
                  <AddressSelector
                      v-model="editAddressLocation"
                      placeholder="روی نقشه آدرس را انتخاب کنید"
                      title="تغییر موقعیت آدرس"
                  />
                </ClientOnly>
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">نام گیرنده</label>
                <input
                    type="text"
                    v-model="editAddressForm.receiver"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-400"
                >
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">شماره تماس</label>
                <input
                    type="tel"
                    v-model="editAddressForm.phone"
                    placeholder="09123456789"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-400 ltr"
                    dir="ltr"
                >
              </div>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="editAddressForm.isDefault"
                    class="rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                >
                <span class="text-gray-700 text-sm">تنظیم به عنوان آدرس پیش‌فرض</span>
              </label>

              <button
                  type="submit"
                  class="w-full py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors"
              >
                ذخیره تغییرات
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Payment Method Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showPaymentModal"
            class="fixed inset-0 bg-black/50 z-[10000]"
            @click="closePaymentModal"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showPaymentModal && selectedPaymentOrder"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[10000] pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[500px] w-full md:w-[450px] overflow-hidden pointer-events-auto flex flex-col">

            <!-- Header -->
            <div
                class="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-l from-sky-50 to-blue-50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <i class="ti ti-credit-card text-xl text-sky-600"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">تسویه حساب</h3>
                  <p class="text-xs text-gray-500">سفارش {{ selectedPaymentOrder.code }}</p>
                </div>
              </div>
              <button @click="closePaymentModal"
                      class="w-8 h-8 flex items-center justify-center hover:bg-white/50 rounded-lg transition">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1">
              <!-- Price Summary -->
              <div class="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                <p class="text-sm text-gray-500 mb-1">مبلغ قابل پرداخت</p>
                <p class="text-2xl font-bold text-sky-600">{{ formatPrice(selectedPaymentOrder.remainingAmount) }} <span
                    class="text-sm text-gray-400 font-normal">تومان</span></p>
              </div>

              <!-- Payment Options -->
              <div class="space-y-3">
                <!-- Online Payment Option -->
                <label
                    class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-sky-200"
                    :class="selectedPaymentMethod === 'online' ? 'border-sky-500 bg-sky-50' : 'border-gray-100 bg-white'"
                >
                  <input
                      type="radio"
                      name="payment_method"
                      value="online"
                      v-model="selectedPaymentMethod"
                      class="w-5 h-5 text-sky-500 focus:ring-sky-500 border-gray-300"
                  >
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <i class="ti ti-credit-card text-lg text-gray-600"></i>
                      <span class="font-bold text-gray-900">پرداخت آنلاین</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">درگاه بانکی (زرین‌پال/ملت)</p>
                  </div>
                  <i v-if="selectedPaymentMethod === 'online'" class="ti ti-check-circle text-sky-500 text-xl"></i>
                </label>

                <!-- Wallet Payment Option -->
                <label
                    class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-green-200"
                    :class="selectedPaymentMethod === 'wallet' ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'"
                >
                  <input
                      type="radio"
                      name="payment_method"
                      value="wallet"
                      v-model="selectedPaymentMethod"
                      class="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300"
                  >
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <i class="ti ti-wallet text-lg text-gray-600"></i>
                      <span class="font-bold text-gray-900">کیف پول</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">موجودی: {{ formatPrice(walletBalance || 0) }} تومان</p>
                  </div>
                  <i v-if="selectedPaymentMethod === 'wallet'" class="ti ti-check-circle text-green-500 text-xl"></i>
                </label>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-100 bg-gray-50">
              <button
                  @click="processPayment"
                  class="w-full py-3.5 bg-gradient-to-l from-sky-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <span>تایید و پرداخت</span>
                <i class="ti ti-arrow-left"></i>
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Wallet Action Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showWalletModal"
             class="fixed inset-0 bg-black/50 z-[100]"
             @click="showWalletModal = false">
        </div>
      </Transition>
      <Transition name="slide-up">
        <div v-if="showWalletModal"
             class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[100] pointer-events-none">
          <div class="bg-white rounded-t-3xl md:rounded-2xl w-full md:w-[400px] p-6 pointer-events-auto shadow-2xl">

            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">
                {{ walletAction === 'increase' ? 'افزایش موجودی کیف پول' : 'برداشت وجه از کیف پول' }}
              </h3>
              <button @click="showWalletModal = false" class="p-2 hover:bg-gray-100 rounded-full transition">
                <i class="ti ti-x text-gray-500 text-xl"></i>
              </button>
            </div>

            <!-- Amount Input -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">مبلغ (تومان)</label>

              <!-- کانتینر Flex برای چیدمان عدد و تومان کنار هم -->
              <div
                  class="relative flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">

                <!-- ورودی عدد -->
                <input
                    v-model="walletAmount"
                    type="number"
                    placeholder="مثلاً 100000"
                    class="w-full px-4 py-3 bg-transparent text-lg font-bold outline-none ltr text-left"
                    dir="ltr"
                >

                <!-- واحد پول (تومان) -->
                <span class="pl-4 pr-4 text-gray-500 text-sm font-medium whitespace-nowrap">تومان</span>
              </div>

              <p class="text-xs text-gray-500 mt-2">
                موجودی فعلی: {{ formatPrice(walletBalance) }} تومان
              </p>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <button @click="walletAmount = 100000"
                      class="py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                ۱۰۰ هزار
              </button>
              <button @click="walletAmount = 500000"
                      class="py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                ۵۰۰ هزار
              </button>
              <button @click="walletAmount = 1000000"
                      class="py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">۱
                میلیون
              </button>
            </div>

            <!-- Submit Button -->
            <button
                @click="handleWalletAction"
                :disabled="walletLoading"
                class="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="walletLoading" class="ti ti-loader animate-spin"></i>
              <span v-else>
            {{ walletAction === 'increase' ? 'پرداخت و افزایش موجودی' : 'درخواست برداشت' }}
          </span>
            </button>

          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- 2. مودال مشاهده‌گر (Viewer Modal) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="isViewerOpen"
            class="fixed inset-0 z- bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            @click.self="closeViewer"
        >
          <button
              @click="closeViewer"
              class="absolute top-6 right-6 text-white/80 hover:text-white z-50 bg-black/30 rounded-full p-2 transition-colors"
          >
            <i class="ti ti-x text-3xl"></i>
          </button>

          <div class="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center relative">

            <video
                v-if="currentDoc?.type?.startsWith('video')"
                :src="resolveUrl(currentDoc.src)"
                controls
                autoplay
                class="max-w-full max-h-[80vh] rounded-lg shadow-2xl bg-black"
            ></video>

            <img
                v-else-if="currentDoc?.src"
                :src="resolveUrl(currentDoc.src)"
                :alt="currentDoc?.name"
                class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            >

            <div v-else class="text-white text-center">
              <i class="ti ti-photo-off text-6xl mb-4 opacity-50"></i>
              <p>منبع نمایشی موجود نیست</p>
            </div>

            <p class="text-white mt-4 text-lg font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
              {{ currentDoc?.name }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from "~/stores/auth";
import {useTenantStore} from "~/stores/tenant.store";
import {useAppointmentStore} from "~/stores/appointment.store";
import {useReviewStore} from "~/stores/reviews.store";
import {useAddressStore} from "~/stores/address.store";
import {storeToRefs} from "pinia"
import {useConsultationStore} from "~/stores/consultation";
import {useNotificationStore} from "~/stores/notification.store";
import {useOrderStore} from "~/stores/order.store";
import {useUrlHelper} from "~/composables/useUrlHelper";
//import { toJalaliDate } from '~/utils/date';
import {usePaymentStore} from "~/stores/payment";
import {useWalletStore} from "~/stores/wallet.store";
import defaultAvatar from '@/assets/user-default-96.png';

const appointmentsStore = useAppointmentStore()
const consultationStore = useConsultationStore();
// داده خام از استور
const rawConsultations = computed(() => consultationStore.consultations);
const {$toast} = useNuxtApp()
const {resolveUrl} = useUrlHelper();
const paymentStore = usePaymentStore()
// --- اضافه کردن متغیرهای جدید برای مودال پرداخت ---
const showPaymentModal = ref(false)
const selectedPaymentOrder = ref(null)
const selectedPaymentMethod = ref('online') // مقادیر پیش‌فرض: 'online' یا 'wallet'
const orderStore = useOrderStore()
const notificationStore = useNotificationStore()
definePageMeta({
  layout: false
})
const addressStore = useAddressStore()
const reviewStore = useReviewStore();
const showEditRequestModal = ref(false)
const editingRequest = ref(null)
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const walletBalance = computed(() => walletStore.wallet?.balance) || 0
// --- متغیرهای مودال کیف پول ---
const showWalletModal = ref(false)
const walletAction = ref('increase') // 'increase' یا 'withdraw'
const walletAmount = ref('')
const walletLoading = ref(false)

// وضعیت بارگذاری برای درخواست وضعیت الوپیک
const loadingAlopeyk = ref(false);

// داده‌های وضعیت الوپیک
const alopeykStatusData = ref({
  alopeykStatus: null,
  progress: null,
  courierName: null,
  trackingUrl: null,
  errorMessage: null,
  statusLabel: '',
  statusDescription: ''
});
// توابع کمکی برای تاریخ (برای نمایش دمو در صورت نبود تاریخ در API)
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleDateString('fa-IR') + ' - ' + now.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
const getRelativeTime = (hoursAgo) => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toLocaleDateString('fa-IR') + ' - ' + date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
// باز کردن مودال افزایش موجودی
const openIncreaseWallet = () => {
  return
  /*walletAction.value = 'increase'
  walletAmount.value = ''
  showWalletModal.value = true*/
}

// باز کردن مودال برداشت وجه
const openWithdrawWallet = () => {
  return
  /*walletAction.value = 'withdraw'
  walletAmount.value = ''
  showWalletModal.value = true*/
}
// تابع تبدیل تاریخ میلادی به شمسی (بدون کتابخانه)
const toJalali = (gy, gm, gd) => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return {year: jy, month: jm, day: jd};
};

// تایید و پردازش درخواست
const handleWalletAction = async () => {
  const amount = parseInt(walletAmount.value)

  // اعتبارسنجی مبلغ
  if (!amount || amount < 10000) {
    showToast('مبلغ وارد شده نامعتبر است (حداقل ۱۰,۰۰۰ تومان)', 'ti ti-alert-circle')
    return
  }

  if (walletAction.value === 'withdraw') {
    // بررسی موجودی کافی برای برداشت
    if (amount > walletBalance.value) {
      showToast('موجودی کافی نیست', 'ti ti-alert-circle')
      return
    }
  }

  walletLoading.value = true

  try {
    let response

    if (walletAction.value === 'increase') {

      const userMeta = {
        mobile: authStore.user?.phoneNumber || '0935000000', // شماره موبایل کاربر
        email: authStore.user?.email || '', // ایمیل کاربر (اختیاری)
        // می‌توانید فیلدهای دیگری مثل نام و نام خانوادگی هم اضافه کنید
      }
      // ۱. فراخوانی متد افزایش موجودی از استور
      response = await walletStore.increaseWalletBalance(amount, userMeta)

      // ۲. بررسی پاسخ سرور و هدایت به درگاه بانک
      if (response && response?.paymentUrl) {
        // اگر سرور لینک درگاه بانک را برگرداند، کاربر را هدایت کن
        window.location.href = response.paymentUrl
      } else {
        // اگر لینکی نبود (مثلاً پرداخت تستی)، پیام موفقیت نشان بده
        showToast('موجودی با موفقیت افزایش یافت', 'ti ti-check')
        showWalletModal.value = false
        walletAmount.value = ''
      }

    } else {
      // ۱. فراخوانی متد برداشت وجه از استور
      await walletStore.withdrawWalletBalance(amount)

      // ۲. پیام موفقیت
      showToast('درخواست برداشت وجه با موفقیت ثبت شد', 'ti ti-check')
      showWalletModal.value = false
      walletAmount.value = ''
    }

  } catch (error) {
    console.error('Wallet action error:', error)

    // استخراج پیام خطا از سرور (اگر وجود دارد)
    const errorMessage = error.response?.data?.message || 'خطا در انجام عملیات کیف پول'

    showToast(errorMessage, 'ti ti-alert-circle')
  } finally {
    // در هر حالت لودینگ را غیرفعال کن (مگر اینکه به درگاه هدایت شده باشیم)
    // اگر به درگاه بانک می‌رویم، لودینگ را خاموش نمی‌کنیم تا کاربر متوجه شود
    if (walletAction.value !== 'increase' || !error) {
      walletLoading.value = false
    }
  }
}

const walletTransactions = computed(() => walletStore.wallet?.transactions.map((tx) => {
  return {
    type: tx.type,
    amount: tx.amount,
    date: new Date(tx.createdAt).toLocaleDateString('fa-IR'),
    title: tx.description || 'کسر بابت سفارش #1000'
  }

}) || [])
// آبجکت موقت برای ویرایش
const formData = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
  birthday: '',
  avatar: defaultAvatar
});

const tenantStore = useTenantStore()
const tenantServices = [
  {value: 'visit', label: 'ویزیت', icon: 'ti ti-stethoscope'},
  {value: 'surgery', label: 'جراحی', icon: 'ti ti-cut'},
  {value: 'lab', label: 'آزمایشگاه', icon: 'ti ti-test-pipe'},
  {value: 'radiology', label: 'رادیولوژی', icon: 'ti ti-scan'},
  {value: 'hospitalization', label: 'بستری', icon: 'ti ti-bed'},
  {value: 'vaccination', label: 'واکسیناسیون', icon: 'ti ti-vaccine'},
  {value: 'grooming', label: 'آرایشگری', icon: 'ti ti-scissors'},
  {value: 'emergency', label: 'اورژانس', icon: 'ti ti-urgent'}
]

const specialtyOptions = [
  {value: 'general', label: 'عمومی'},
  {value: 'surgery', label: 'جراحی'},
  {value: 'internal', label: 'بیماری‌های داخلی'},
  {value: 'dental', label: 'دندانپزشکی'},
  {value: 'radiology', label: 'رادیولوژی'},
  {value: 'nutrition', label: 'تغذیه'},
  {value: 'dermatology', label: 'پوست و مو'},
  {value: 'ophthalmology', label: 'چشم‌پزشکی'},
  {value: 'orthopedics', label: 'ارتوپدی'}
]


const userId = computed(() => authStore.user?.id)
const user = computed(() => {
  const u = authStore.user
  if (!u) return null

  return {
    id: u.id, // اضافه کردن ID
    name: u.fullName || `${u.firstName} ${u.lastName}`, // اولویت با fullName
    phoneNumber: u.phoneNumber || '',
    email: u.email || '',
    //avatar: u.avatar || '',
    avatar: (u?.avatar && u.avatar !== 'null' && u.avatar.trim() !== '') ? resolveUrl(u.avatar) : null,
    birthday: u.dateOfBirth || '' // اولویت با dateOfBirth
  }
})
// مدیریت فایل آواتار
const avatarFile = ref();

// هنگام تغییر کاربر، فرم را پر کن
watch(() => authStore.user, (newUser) => {
  if (newUser) {

    formData.fullName = newUser.fullName || `${newUser.firstName} ${newUser.lastName}`
    formData.email = newUser.email || ''
    formData.phoneNumber = newUser.phoneNumber || ''
    formData.birthday = newUser.dateOfBirth || newUser.birthday || ''
    //formData.avatar: newUser.avatar || ''
    formData.avatar = (newUser?.avatar && newUser.avatar !== 'null' && newUser.avatar.trim() !== '') ? resolveUrl(newUser.avatar) : defaultAvatar


  }
}, {immediate: true});

// هندلر انتخاب عکس
const handleAvatarUpload = (event) => {
  const target = event.target;
  if (target.files && target.files[0]) {
    avatarFile.value = target.files[0];
    formData.avatar = URL.createObjectURL(target.files[0]);
    user.value.avatar = formData.avatar
  }
};
const {sessions, loading, userSetting} = storeToRefs(authStore);

const fetchSessions = authStore.fetchSessions;

const revokeSession = (session) => {
  authStore.revokeSession(session.id);
  $toast(`نشست شما در این دستگاه ${session.deviceName} با موفقیت حذف شد`, 'success', 5000)
}
const revokeAllSessions = () => {
  authStore.revokeAllSessions();
  $toast(`نشست شما در همه دستگاه ها با موفقیت حذف شدند`, 'success', 5000)
}

const getImageUrl = (fileOrUrl) => {
  if (!fileOrUrl) return '/placeholder-image.png'
  if (fileOrUrl instanceof File) {
    return URL.createObjectURL(fileOrUrl)
  }
  return fileOrUrl
}

// Active section
const activeSection = ref('profile')
const route = useRoute()
// Dropdowns
const showNotifications = ref(false)
const showSupportModal = ref(!!route.query.showSupportModal)
const showReviewModal = ref(false)
const selectedVisitForReview = ref(null)
const selectedOrderForReview = ref(null)
const reviewKind = ref('visit') // 'visit' | 'order'
const isAutoReviewPrompt = ref(false)
const reviewRating = ref(0)
const reviewComment = ref('')

const reviewSubtitle = computed(() => {
  if (reviewKind.value === 'visit') return selectedVisitForReview.value?.doctorName || ''
  return selectedOrderForReview.value?.code || ''
})

const notifications = computed(() => notificationStore.notifications)
watch(userId, async (newUserId) => {
  // فقط اگر userId مقدار دارد (یعنی یوزر لود شده)
  if (newUserId) {
    try {
      await notificationStore.fetchNotifications(newUserId, 'VET-CLINIC-PHARMACY')
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }
}, {immediate: true})
// Notifications Data
/*const notifications = ref([
  {
    id: 1,
    type: 'order',
    title: 'سفارش تایید شد',
    message: 'سفارش شما توسط داروخانه تایید و آماده ارسال است',
    time: '۱۰ دقیقه پیش',
    read: false
  },
  {
    id: 2,
    type: 'chat',
    title: 'پیام جدید از دکتر محمدی',
    message: 'نسخه برای شارلی صادر شد',
    time: '۲ ساعت پیش',
    read: false
  },
  {
    id: 3,
    type: 'visit',
    title: 'یادآوری ویزیت',
    message: 'ویزیت شما فردا ساعت ۱۰ صبح است',
    time: 'دیروز',
    read: true
  },
])*/

// Click Outside Directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
// اصلاح شده: مپ کردن دیتای درخواست‌ها
const requests = computed(() => tenantStore.requests.map((item) => {
  // پیدا کردن لیبل تخصص
  const specialtyObj = specialtyOptions.find(s => s.value === item.specialty)

  return {
    id: item.id,
    tenantName: item?.tenantName || item?.name, // فال‌بک برای نام قدیمی
    ownerName: item?.ownerName || item?.name,   // فال‌بک برای نام مالک
    phone: item?.phone,
    type: item?.type,
    typeLabel: item?.type === 'vet' ? 'دامپزشک' :
        item?.type === 'clinic' ? 'کلینیک دامپزشکی' :
            item?.type === 'pharmacy' ? 'داروخانه دامپزشکی' : item?.type,
    date: new Date(item?.createdAt).toLocaleDateString('fa-IR'),
    status: item?.status,
    province: item?.province,
    city: item?.city,
    documents: item?.documents,
    categories: item?.services, // سرویس‌ها به عنوان دسته‌بندی
    iban: item?.iban,
    address: item?.address,
    message: item?.rejectionReason,
    specialty: item?.specialty,
    specialtyLabel: specialtyObj ? specialtyObj.label : item?.specialty,
    experience: item?.experience,
    description: item?.description
  }
}))
// تبدیل داده‌های استور به فرمت مورد نیاز قالب
const visits = computed(() => {
  return appointmentsStore.appointments.map((item) => {
    // 1. استخراج اطلاعات دکتر (از آبجکت doctor یا tenant)
    const doctorInfo = item.tenant || item.doctor || {};

    // 2. فرمت کردن تاریخ و ساعت
    let dateStr = '';
    let timeStr = '';
    if (item.appointmentDate) {
      const dateObj = new Date(item.appointmentDate);
      // تبدیل تاریخ میلادی به شمسی
      const jDate = toJalali(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());
      const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      dateStr = `${jDate.day} ${monthNames[jDate.month - 1]} ${jDate.year}`;

      // استخراج ساعت
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      timeStr = `${hours}:${minutes}`;
    }

    // 3. تشخیص وضعیت (status) بر اساس AppointmentStatus
    let status = 'upcoming'; // حالت پیش‌فرض
    let statusLabel = 'نوبت آینده';

    switch (item.status) {
      case 'request_sent':
        status = 'upcoming';
        statusLabel = 'درخواست ارسال شده';
        break;

      case 'pending':
        status = 'upcoming';
        statusLabel = 'در انتظار تایید';
        break;

      case 'approved': // معادل CONFIRMED در enum
        status = 'upcoming';
        statusLabel = 'تایید شده';
        break;

      case 'in-chat':
      case 'in-progress':
        status = 'upcoming';
        statusLabel = 'در حال انجام';
        break;

      case 'completed':
        status = 'completed';
        statusLabel = 'انجام شده';
        break;

      case 'cancelled':
      case 'rejected':
      case 'no-show':
        status = 'cancelled';
        statusLabel = item.status === 'rejected' ? 'رد شده' :
            item.status === 'no-show' ? 'عدم مراجعه' : 'لغو شده';
        break;

      default:
        // بررسی وضعیت سفارش برای حالت‌های خاص (اگر لازم باشد)
        if (item.order?.status === 'CANCELLED') {
          status = 'cancelled';
          statusLabel = 'لغو شده';
        }
        break;
    }

    // 4. تشخیص نوع ویزیت (type)
    let type = 'offline'; // پیش‌فرض
    if (item.service === 'text' || item.service === 'phone-instant' || item.service === 'phone-scheduled') {
      type = 'online';
    }

    return {
      id: item.id,
      doctorId: item.tenantId,
      examCode: item.examCode,
      trackingCode: item.trackingCode,
      consultationId: item.consultationId,
      doctorName: doctorInfo.name || doctorInfo.ownerName || 'نامشخص',
      doctorAvatar: doctorInfo.documents?.logo?.thumbnail,
      doctorAddress: doctorInfo.tenantAddress?.detailedAddress.road + '-' +
          doctorInfo.tenantAddress?.detailedAddress.neighbourhood + '-' +
          doctorInfo.tenantAddress?.detailedAddress.suburb,
      doctorPhone: doctorInfo.phone,
      specialty: doctorInfo.specialty || 'دامپزشک',
      date: dateStr,
      time: timeStr,
      status: status,
      statusLabel: statusLabel,
      petName: item.pet?.name || 'حیوان',
      petType: item.pet?.type || 'نامشخص',
      petImage: item.pet?.logo || '/pet.png',
      petBreed: item.pet?.breed,
      petAge: item.pet?.age,
      isApproved: item.status === 'approved',
      ownerName: item.pet?.owner.firstName + '.' + item.pet?.owner.lastName,
      reason: item.description || item.note || 'بدون عنوان',
      type: type,
      price: Number(item.finalPrice) || 0,
      prescription: false,
      hasReview: !!item.review.length > 0
    };
  });
});

const chats = computed(() => {
  return rawConsultations.value.map(item => {
    // بررسی وضعیت برای تبدیل به متن فارسی یا مقدار مناسب
    // فرض بر این است که status در API به صورت 'active', 'waiting' و غیره می‌آید

    return {
      id: item.id,
      doctorId: item.doctorId,
      doctorName: item.name || 'نامشخص',
      specialty: item.specialty || 'عمومی',
      lastMessage: item.lastMsg || 'پیامی نیست',
      lastMessageTime: item.lastTime || '',
      lastMessageType: 'text', // چون در دیتای API نبود، پیش‌فرض گذاشته شد
      unreadCount: item.unread || 0,
      isOnline: item.isOnline || false,
      status: item.status, // باید دقیقا با activeTab شما مطابقت داشته باشد
      remainingTime: null, // در دیتای API موجود نبود
      hasPrescription: false // در دیتای API موجود نبود
    };
  });
});

// استفاده از computed برای تبدیل دیتای خام به فرمت نمایشی
const orders = computed(() => {
  if (!orderStore.orders || orderStore.orders.length === 0) return [];

  return orderStore.orders.map((order) => {
    // 1. استخراج آیتم‌ها
    const itemsList = (order.items || []).map((item) => {
      let name = 'محصول نامشخص';
      let image = '';

      if (item.pharmacyMedicine?.medicine) {
        name = item.pharmacyMedicine.medicine.name;
        image = item.pharmacyMedicine.medicine.image;
      } else if (item.marketProduct?.product) {
        name = item.marketProduct.product.name;
        image = item.marketProduct.product.image;
      }

      return {
        id: item.id,
        name: name,
        quantity: item.quantity,
        price: Number(item.price) || 0,
        image: image
      };
    });

    // 2. فرمت کردن تاریخ با استفاده از تابع موجود
    let dateStr = order.createdAt;
    //TODO:install jallali
    /*if (order.createdAt) {
      // تبدیل Date به رشته ISO برای استفاده در toJalaliDate
      const isoString = new Date(order.createdAt).toISOString();
      const jalaliDateOnly = toJalaliDate(isoString); // خروجی: "1404/12/17"

      // اضافه کردن ساعت به صورت دستی (چون تابع شما فقط تاریخ را برمی‌گرداند)
      const dateObj = new Date(order.createdAt);
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');

      dateStr = `${jalaliDateOnly} - ${hours}:${minutes}`;
    }*/

    // 3. تشخیص وضعیت
    let status = 'pending';
    let statusLabel = 'در انتظار بررسی';

    // مپ کردن وضعیت‌های بک‌اند به وضعیت‌های فرانت‌اند
    switch (order.status) {
      case 'CUSTOMER_PENDING':
        status = 'pending';
        statusLabel = 'در انتظار بررسی'; // یا "در انتظار پرداخت" بسته به منطق بیزینس
        break;
      case 'CUSTOMER_PAID':
        status = 'paid'; // وضعیت جدید برای پرداخت شده و در انتظار تایید
        statusLabel = 'پرداخت شده - در انتظار تایید';
        break;
      case 'PENDING_REMAINING_PAYMENT':
        status = 'PENDING_REMAINING_PAYMENT'; // وضعیت جدید
        statusLabel = 'نیاز به پرداخت مابقی';
        break;
      case 'TENANT_PROCESSING':
        status = 'processing';
        statusLabel = 'تایید شده - آماده ارسال';
        break;
      case 'TENANT_SHIPPED':
        status = 'shipping';
        statusLabel = 'در حال ارسال';
        break;
      case 'CUSTOMER_DELIVERED':
        status = 'delivered';
        statusLabel = 'تحویل شده';
        break;
      case 'CUSTOMER_CANCELLED':
      case 'TENANT_CANCELLED':
        status = 'cancelled';
        statusLabel = 'لغو شده';
        break;
      default:
        // برای سایر وضعیت‌ها پیش‌فرض در نظر گرفته می‌شود
        break;
    }

    const metadata = order.metadata || {};

    const finalTotal = Number(metadata.finalTotalAmount) || Number(order.totalAmount) || 0;
    const remainingAmount = Number(metadata.remainingAmount) || 0;
    const shippingCost = Number(metadata.shippingCost) || 'رایگان'

    return {
      id: order.id,
      code: order.orderCode || `ORD-${order.id.slice(0, 5)}`,
      date: dateStr,
      status: status,
      statusLabel: statusLabel,
      total: finalTotal,
      type: order.type,
      metadata: order.metadata,
      items: itemsList,
      // مقادیر مالی
      remainingAmount: remainingAmount,
      shippingCost: shippingCost,
      tenantName: order.tenant?.name || order.tenant?.ownerName || 'فروشگاه/داروخانه',
      tenantId: order.tenant?.id,
      hasReview: !!order.review?.length > 0
    };
  });
});
// Menu items
const menuItems = [
  {id: 'profile', icon: 'ti ti-user', label: 'اطلاعات شخصی'},
  {id: 'wallet', icon: 'ti ti-wallet', label: 'کیف پول'},
  {id: 'requests', icon: 'ti ti-file-description', label: 'درخواست‌ها', badge: requests.value.length},
  {id: 'visits', icon: 'ti ti-stethoscope', label: 'ویزیت‌های من', badge: visits.value.length},
  {id: 'chats', icon: 'ti ti-message-dots', label: 'پیام‌ها', badge: chats.value.length},
  {id: 'reviews', icon: 'ti ti-star', label: 'نظرات من'},
  {id: 'orders', icon: 'ti ti-shopping-bag', label: 'سفارشات من', badge: orders.value.length},
  {id: 'addresses', icon: 'ti ti-map-pin', label: 'آدرس‌ها'},
  {id: 'notifications', icon: 'ti ti-bell', label: 'اعلان‌ها'},
  {id: 'security', icon: 'ti ti-shield-check', label: 'امنیت'},
]

// 1. لیست سرویس‌ها (مشابه فرم ثبت نام)
const availableServices = [
  {value: 'visit', label: 'ویزیت', icon: 'ti ti-stethoscope'},
  {value: 'surgery', label: 'جراحی', icon: 'ti ti-cut'},
  {value: 'lab', label: 'آزمایشگاه', icon: 'ti ti-test-pipe'},
  {value: 'radiology', label: 'رادیولوژی', icon: 'ti ti-scan'},
  {value: 'hospitalization', label: 'بستری', icon: 'ti ti-bed'},
  {value: 'vaccination', label: 'واکسیناسیون', icon: 'ti ti-vaccine'},
  {value: 'grooming', label: 'آرایشگری', icon: 'ti ti-scissors'},
  {value: 'emergency', label: 'اورژانس', icon: 'ti ti-urgent'}
]

// 2. متغیر کنترل دراپ‌داون سرویس‌ها
const showServiceDropdown = ref(false)

// 3. متدهای مدیریت سرویس‌ها (جایگزین متدهای Categories)
const addService = (service) => {
  if (!isServiceSelected(service.value)) {
    editForm.value.services.push(service)
  }
  showServiceDropdown.value = false
}

const removeService = (index) => {
  editForm.value.services.splice(index, 1)
}

const isServiceSelected = (value) => {
  return editForm.value.services.some(s => (s.value || s) === value)
}

const getServiceIcon = (value) => {
  const service = availableServices.find(s => s.value === value)
  return service ? service.icon : 'ti ti-tag'
}

// 4. به‌روزرسانی editForm برای شامل شدن فیلدهای جدید
const editForm = ref({
  ownerName: '',
  phone: '',
  address: {},
  province: '',
  city: '',
  iban: '',
  services: [], // تغییر از categories به services
  specialty: '',
  experience: '',
  description: '',
  documents: {
    logo: null,
    license: null,
    nationalId: null
  },
  status: ''
})
const localAddressText = ref('')
const onChangeLocation = (data) => {

  localAddressText.value = [
    data.address?.address?.road,
    data.address?.address?.neighbourhood ?? data.address?.address?.town,
    data.address?.address?.suburb ?? data.address?.address?.state
  ]
      .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
      .join('. ')
  const rawAddressData = data.address || {};
  const fullAddressDetails = JSON.parse(JSON.stringify(rawAddressData));

  editForm.value.address = {
    display_name: fullAddressDetails.display_name || '',
    lat: parseFloat(fullAddressDetails.lat),
    lon: parseFloat(fullAddressDetails.lon),
    ...fullAddressDetails
  }
  editForm.value.city = data.city ?? data.address?.address?.city
  editForm.value.province = data.province ?? data.address?.address?.state
}

const saveRequestEdit = async () => {
  if (!editingRequest.value) return

  try {
    // ۱. ساخت آبجکت اصلی از فرم
    const payload = {
      name: editForm.value.ownerName,
      phone: editForm.value.phone,
      address: editForm.value.address,
      province: editForm.value.province,
      city: editForm.value.city,
      iban: editForm.value.iban,
      specialty: editForm.value.specialty,
      experience: editForm.value.experience,
      description: editForm.value.description,
      documents: editForm.value.documents,

      // ۲. تبدیل آرایه آبجکت‌های سرویس به آرایه رشته‌ای (مثلاً ['visit', 'surgery'])
      // توجه: نام فیلد باید services باشد (طبق دیتابیس جدید)
      services: editForm.value.services.map(s => s.value || s),
    }

    // ۵. ارسال به استور
    const response = await tenantStore.updateRequest(editingRequest.value.id, payload)

    showToast(response.message || 'درخواست با موفقیت ویرایش شد', 'ti ti-check')
    closeEditRequestModal()

    // ۶. رفرش کردن لیست درخواست‌ها برای نمایش تغییرات
    await tenantStore.fetchTenantRequests()

  } catch (error) {
    console.error('Error updating request:', error)
    showToast('خطا در ویرایش درخواست', 'ti ti-alert-circle')
  }
}

// 5. به‌روزرسانی openEditRequestModal برای پر کردن صحیح فیلدها
const openEditRequestModal = (req) => {
  const originalRequest = requests.value.find(r => r.id === req.id)
  if (originalRequest) {
    editingRequest.value = originalRequest

    // نرمالایز کردن سرویس‌ها
    const normalizedServices = (originalRequest.services || []).map(s => {
      return typeof s === 'string'
          ? availableServices.find(ts => ts.value === s) || {value: s, label: s, icon: 'ti ti-tag'}
          : s
    })


    editForm.value = {
      ownerName: originalRequest.ownerName || '',
      phone: originalRequest.phone || '',
      address: [
        originalRequest.address?.address?.road,
        originalRequest.address?.address?.neighbourhood,
        originalRequest.address?.address?.suburb
      ]
          .filter(Boolean) // حذف مقادیر null، undefined و رشته‌های خالی
          .join('. '),
      province: originalRequest.address.address.state || '',
      city: originalRequest.address.address.city || '',
      iban: originalRequest.iban || '',
      services: normalizedServices,
      specialty: originalRequest.specialty || '',
      experience: originalRequest.experience || '',
      description: originalRequest.description || '',
      documents: originalRequest.documents,
      status: originalRequest.status
    }
    localAddressText.value = editForm.value.address
    showEditRequestModal.value = true
  }
}
// 6. به‌روزرسانی closeEditRequestModal برای ریست کردن فیلدهای جدید
const closeEditRequestModal = () => {
  showEditRequestModal.value = false
  editingRequest.value = null
  showServiceDropdown.value = false // ریست دراپ‌داون
  editForm.value = {
    ownerName: '', phone: '', address: '', province: '', city: '', iban: '',
    services: [], specialty: '', experience: '', description: '',
    documents: {logo: null, license: null, nationalId: null}, status: ''
  }
}

const getReqStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500'
    case 'needs_revision':
      return 'bg-amber-500'
    case 'rejected':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

const getReqStatusBadge = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'needs_revision':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

const getReqStatusLabel = (status) => {
  switch (status) {
    case 'approved':
      return 'تایید شده'
    case 'needs_revision':
      return 'نیاز به اصلاح'
    case 'rejected':
      return 'رد شده'
    case 'pending':
      return 'در حال بررسی'
    default:
      return status
  }
}

const addresses = computed(() => addressStore.addresses)

// Visits
const activeVisitTab = ref('all');

// لیست تب‌ها با شمارش پویا
const visitTabs = computed(() => {
  // محاسبه تعداد هر وضعیت
  const counts = visits.value.reduce(
      (acc, visit) => {
        if (visit.status === 'upcoming') acc.upcoming++;
        else if (visit.status === 'completed') acc.completed++;
        else if (visit.status === 'cancelled') acc.cancelled++;
        return acc;
      },
      {upcoming: 0, completed: 0, cancelled: 0}
  );

  return [
    {id: 'all', label: 'همه', count: visits.value.length},
    {id: 'upcoming', label: 'آینده', count: counts.upcoming},
    {id: 'completed', label: 'انجام شده', count: counts.completed},
    {id: 'cancelled', label: 'لغو شده', count: counts.cancelled},
  ];
});

const filteredVisits = computed(() => {
  if (activeVisitTab.value === 'all') return visits.value
  return visits.value.filter(visit => visit.status === activeVisitTab.value)
})
const userReviews = computed(() => reviewStore.reviews)

// فیلتر کردن چت‌ها بر اساس تب فعال
const filteredChats = computed(() => {
  return chats.value.filter(chat => {
    if (activeChatTab.value === 'active') return chat.status === 'active';
    if (activeChatTab.value === 'waiting') return chat.status === 'waiting' || chat.status === 'pending' || chat.status === 'request-sent';
    return chat.status === 'closed';
  });
});
// Chats
const activeChatTab = ref('active')
// تعریف تب‌ها به صورت Computed برای محاسبه خودکار تعداد (Count)
const chatTabs = computed(() => {
  return [
    {
      id: 'active',
      label: 'فعال',
      // شمارش مشاوره‌هایی که وضعیت آن‌ها active است
      count: chats.value.filter(c => c.status === 'active').length
    },
    {
      id: 'archived',
      label: 'آرشیو شده',
      // شمارش مشاوره‌هایی که وضعیت آن‌ها archived است
      count: chats.value.filter(c => c.status === 'closed').length
    },
    {
      id: 'waiting',
      label: 'در انتظار تأیید',
      // شمارش مشاوره‌هایی که وضعیت آن‌ها waiting یا request-sent است
      count: chats.value.filter(c => c.status === 'waiting' || c.status === 'pending' || c.status === 'request-sent').length
    },
  ];
});

// Orders
const activeOrderTab = ref('all');

// لیست تب‌ها با شمارش پویا
const orderTabs = computed(() => {
  // محاسبه تعداد هر وضعیت
  const counts = orders.value.reduce(
      (acc, order) => {
        // وضعیت‌ها باید دقیقاً با چیزی که در computed قبلی تولید کردید مطابقت داشته باشند
        if (order.status === 'pending') acc.pending++;
        else if (order.status === 'paid') acc.paid++;
        else if (order.status === 'PENDING_REMAINING_PAYMENT') acc.remainder++;
        else if (order.status === 'processing') acc.processing++;
        else if (order.status === 'shipping') acc.shipping++;
        else if (order.status === 'delivered') acc.delivered++;
        else if (order.status === 'cancelled') acc.cancelled++;
        return acc;
      },
      {pending: 0, paid: 0, remainder: 0, processing: 0, shipping: 0, delivered: 0, cancelled: 0}
  );

  return [
    {id: 'all', label: 'همه', count: orders.value.length},
    {id: 'pending', label: 'منتظر تایید', count: counts.pending},
    {id: 'paid', label: 'پرداخت و در انتظار تایید', count: counts.paid},
    {id: 'PENDING_REMAINING_PAYMENT', label: 'نیاز به پرداخت مابقی', count: counts.remainder},
    {id: 'processing', label: 'تایید شده', count: counts.processing},
    {id: 'shipping', label: 'در حال ارسال', count: counts.shipping},
    {id: 'delivered', label: 'تحویل شده', count: counts.delivered},
    {id: 'cancelled', label: 'لغو شده', count: counts.cancelled},
  ];
});


const filteredOrders = computed(() => {
  if (activeOrderTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeOrderTab.value)
})

// Order Modals
const showOrderDetailsModal = ref(false)
const showTrackingModal = ref(false)
const selectedOrder = ref(null)

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDetailsModal.value = true
}

const trackOrder = (order) => {
  selectedOrder.value = {...order}
  fetchAlopeykStatus(selectedOrder.value.id);
  showTrackingModal.value = true
}
// تابع برای فرمت کردن وضعیت و توضیحات بیشتر
const updateStatusDetails = (statusData) => {
  const {alopeykStatus, progress} = statusData;
  alopeykStatusData.value.statusLabel = orderStore.getAlopeykStatusLabel(alopeykStatus, progress);

  // توضیحات تکمیلی بر اساس وضعیت
  switch (alopeykStatus) {
    case 'new':
      alopeykStatusData.value.statusDescription = 'سفارش ثبت شد، در انتظار پذیرش پیک';
      break;
    case 'scheduled':
      alopeykStatusData.value.statusDescription = 'سفارش برای ارسال در تایم انتخابی ثبت شد';
      break;
    case 'accepted':
      alopeykStatusData.value.statusDescription = 'پیک سفارش را پذیرفت، در مسیر مبدأ';
      break;
    case 'picking':
      alopeykStatusData.value.statusDescription = 'پیک در حال برداشت بسته از مبدأ';
      break;
    case 'picked':
      alopeykStatusData.value.statusDescription = 'بسته برداشت شد، در مسیر مقصد';
      break;
    case 'delivering':
      alopeykStatusData.value.statusDescription = 'پیک در حال تحویل به مقصد';
      break;
    case 'delivered':
      alopeykStatusData.value.statusDescription = 'سفارش با موفقیت تحویل داده شد';
      break;
    case 'cancelled':
      alopeykStatusData.value.statusDescription = 'سفارش لغو شد';
      break;
    case 'refused':
      alopeykStatusData.value.statusDescription = 'پیک از تحویل خودداری کرد';
      break;
    default:
      alopeykStatusData.value.statusDescription = 'وضعیت نامشخص';
  }
};
// تابع اصلی برای دریافت وضعیت از API
const fetchAlopeykStatus = async (orderId) => {
  if (!orderId) return;

  loadingAlopeyk.value = true;
  try {
    const result = await orderStore.checkAlopeykStatus(orderId);

    // به‌روزرسانی داده‌ها
    alopeykStatusData.value = {
      ...result,
      statusLabel: '',
      statusDescription: ''
    };

    // اگر خطایی وجود ندارد، جزئیات را محاسبه کن
    if (!result.errorMessage) {
      updateStatusDetails(result);
    } else {
      alopeykStatusData.value.statusLabel = 'خطا';
      alopeykStatusData.value.statusDescription = result.errorMessage;
    }
  } catch (error) {
    console.error('Error fetching tracking status:', error);
    alopeykStatusData.value.errorMessage = 'خطا در برقراری ارتباط با سرویس پست';
    alopeykStatusData.value.statusLabel = 'خطا';
    alopeykStatusData.value.statusDescription = 'لطفاً بعداً مجدداً تلاش کنید.';
  } finally {
    loadingAlopeyk.value = false;
  }
};

const copyTrackingCode = () => {
  const code = selectedOrder.value?.trackingCode || '123456789012'
  navigator.clipboard.writeText(code)
  showToast('کد رهگیری کپی شد', 'ti ti-copy')
}

// Visit Modals
const showVisitDetailsModal = ref(false)
const selectedVisit = ref(null)

const viewVisitDetails = (visit) => {
  console.log('visit', visit)
  selectedVisit.value = visit
  showVisitDetailsModal.value = true
}

const viewPrescription = (visit) => {
  showToast('نسخه در حال بارگذاری...', 'ti ti-file-text')
}

// Review functions
const openReviewModal = (visit, {auto = false} = {}) => {
  reviewKind.value = 'visit'
  selectedOrderForReview.value = null
  selectedVisitForReview.value = visit
  isAutoReviewPrompt.value = auto
  reviewRating.value = 0
  reviewComment.value = ''
  showReviewModal.value = true
}

const openOrderReviewModal = (order, {auto = false} = {}) => {
  reviewKind.value = 'order'
  selectedVisitForReview.value = null
  selectedOrderForReview.value = order
  isAutoReviewPrompt.value = auto
  reviewRating.value = 0
  reviewComment.value = ''
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  isAutoReviewPrompt.value = false
  reviewRating.value = 0
  reviewComment.value = ''
  selectedVisitForReview.value = null
  selectedOrderForReview.value = null
  reviewKind.value = 'visit'
}
const editReview = (visit) => {
  const review = userReviews.value.find(r => r.visitId === visit.id)
  if (review) {
    selectedVisitForReview.value = visit
    reviewRating.value = review.rating
    reviewComment.value = review.comment
    showReviewModal.value = true
  }
}

const editReviewFromList = (review) => {

  const visit = visits.value.find(v => v.id === review.visitId)
  if (visit) {
    selectedVisitForReview.value = visit
    reviewRating.value = review.rating
    reviewComment.value = review.comment
    showReviewModal.value = true
  }
}

const submitReview = async () => {
  if (reviewRating.value === 0 || !reviewComment.value.trim()) return

  if (reviewKind.value === 'order') {

    const order = orders.value.find(o => o.id === selectedOrderForReview.value?.id)

    if (order) {
      await reviewStore.submitReview({
        tenantId: selectedOrderForReview.value.tenantId,
        rating: reviewRating.value,
        comment: reviewComment.value,
        orderId: selectedOrderForReview.value.id
      })
      order.hasReview = true
    }
    showToast('نظر شما با موفقیت ثبت شد', 'ti ti-check')
    closeReviewModal()
    return
  }

  // Check if editing existing review
  const existingReview = userReviews.value.find(r => r.visitId === selectedVisitForReview.value.id)

  if (existingReview) {
    // Update existing review
    existingReview.rating = reviewRating.value
    existingReview.comment = reviewComment.value
    existingReview.date = new Date().toLocaleDateString('fa-IR')
    await reviewStore.submitReview({
      tenantId: selectedVisitForReview.value.tenantId,
      rating: existingReview.rating,
      comment: existingReview.comment,
      visitId: selectedVisitForReview.value.id
    })
    showToast('نظر شما با موفقیت ویرایش شد', 'ti ti-check')
  } else {
    //api
    await reviewStore.submitReview({
      tenantId: selectedVisitForReview.value.tenantId,
      rating: reviewRating.value,
      comment: reviewComment.value,
      visitId: selectedVisitForReview.value.id
    })

    // Mark visit as reviewed
    const visit = visits.value.find(v => v.id === selectedVisitForReview.value.id)
    if (visit) {
      visit.hasReview = true
    }

    showToast('نظر شما با موفقیت ثبت شد', 'ti ti-check')
  }

  closeReviewModal()
}


onMounted(async () => {

  // await authStore.fetchUser()
  // await tenantStore.fetchTenantRequests()
  // await reviewStore.fetchReviews();
  // await appointmentsStore.fetchAppointments()
  // // Auto-open review prompt if there is any completed/delivered item without review.
  // await nextTick()

  const pendingVisit = visits.value.find(v => v.status === 'completed' && !v.hasReview)
  if (pendingVisit) {
    activeSection.value = 'visits'
    activeVisitTab.value = 'completed'
    openReviewModal(pendingVisit, {auto: true})
    return
  }

  const pendingOrder = orders.value.find(o => o.status === 'delivered' && !o.hasReview)
  if (pendingOrder) {
    activeSection.value = 'orders'
    activeOrderTab.value = 'delivered'
    openOrderReviewModal(pendingOrder, {auto: true})
  }
})

const deleteReview = async (review) => {
  if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
    await reviewStore.deleteReview(review.id)
    // Remove review from list
    const index = userReviews.value.findIndex(r => r.id === review.id)
    if (index !== -1) {
      userReviews.value.splice(index, 1)
    }

    // Mark visit as not reviewed
    const visit = visits.value.find(v => v.id === review.visitId)
    if (visit) {
      visit.hasReview = false
    }

    showToast('نظر با موفقیت حذف شد', 'ti ti-trash')
  }
}

const viewReview = (visit) => {
  const review = userReviews.value.find(r => r.visitId === visit.id)
  if (review) {
    activeSection.value = 'reviews'
  }
}

// Add address modal
const showAddAddressModal = ref(false)
// ویرایش متغیر newAddress
const newAddress = ref({
  title: '',
  receiver: '',
  phone: '',
  isDefault: false
})

const newAddressLocation = ref({
  address: '',
  province: '',
  city: '',
  location: null // مختصات نقشه
})
// متغیرهای مربوط به مدال ویرایش آدرس
const showEditAddressModal = ref(false)
const editingAddressId = ref(null) // برای نگهداری ID آدرسی که در حال ویرایش است

// فرم ویرایش (اطلاعات متنی)
const editAddressForm = ref({
  title: '',
  receiver: '',
  phone: '',
  isDefault: false
})

// موقعیت مکانی ویرایش (اطلاعات نقشه)
const editAddressLocation = ref({
  address: '',
  province: '',
  city: '',
  location: null
})
// Watch newAddressLocation and sync with newAddress
watch(newAddressLocation, (newVal) => {
  newAddress.value.fullAddress = newVal.address
}, {deep: true})

// Notification settings
const notificationSettings = ref([
  {
    id: 1,
    title: 'اعلان‌های ویزیت',
    description: 'دریافت اعلان زمان نوبت‌های شما',
    enabled: userSetting.value?.appointmentTimeNotifications
  },
  {
    id: 2,
    title: 'یادآور واکسیناسیون',
    description: 'یادآوری زمان واکسن حیوان خانگی',
    enabled: userSetting.value?.vaccinationNotifications
  },
  {
    id: 3,
    title: 'اعلان‌های پیامکی',
    description: 'دریافت پیامک برای نوبت‌ها',
    enabled: userSetting.value?.smsAppointmentNotifications
  },
  {
    id: 4,
    title: 'مشاوره‌های رایگان',
    description: 'دریافت اطلاعیه مشاوره‌های رایگان',
    enabled: userSetting.value?.newsletter
  },
])

// نگاشت IDهای UI به نام فیلدهای دیتابیس
const settingFieldsMap = {
  1: 'appointmentTimeNotifications',
  2: 'vaccinationNotifications',
  3: 'smsAppointmentNotifications',
  4: 'newsletter'
}

const handleNotificationChange = async (id, newValue) => {
  const field = settingFieldsMap[id]

  if (!field) return

  try {
    // فراخوانی متد استور برای ارسال به بک‌اند
    await authStore.updateNotificationSetting(field, newValue)

    // نمایش پیام موفقیت (اختیاری)
    // showToast('تنظیمات ذخیره شد', 'ti ti-check')
  } catch (error) {
    // در صورت خطا، وضعیت چک‌باکس را به حالت قبل برگردانید (Rollback)
    console.error('Error updating setting:', error)

    // پیدا کردن آیتم و برگرداندن مقدار قبلی
    const setting = notificationSettings.value.find(s => s.id === id)
    if (setting) {
      setting.enabled = !newValue
    }

    showToast('خطا در ذخیره تنظیمات', 'ti ti-alert-circle')
  }
}

// Toast
const toast = ref({show: false, message: '', icon: ''})

const showToast = (message, icon = 'ti ti-check') => {
  toast.value = {show: true, message, icon}
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Actions
// تابع ارسال فرم
const updateProfile = async () => {
  if (!authStore.user?.id) return;

  const payload = {
    fullName: formData.fullName,
    email: formData.email,
    dateOfBirth: formData.birthday,
  };

  try {
    // اصلاح شده: استفاده از authStore.user.id به جای user.value.id
    await authStore.updateProfile(authStore.user.id, payload, avatarFile.value);
    //alert('پروفایل با موفقیت آپدیت شد');
    $toast('پروفایل با موفقیت آپدیت شد', 'success', 5000);

  } catch (error) {
    console.error('Error updating profile:', error);
    //alert('خطا در بروزرسانی پروفایل');
    $toast('خطا در بروزرسانی پروفایل', 'error', 5000);
  }
};

const saveAddress = async () => {
  // ۱. ساخت آبجکت نهایی با تغییر نام فیلدها
  const payload = {
    title: newAddress.value.title,
    receiver: newAddress.value.receiver,
    phone: newAddress.value.phone,
    isDefault: newAddress.value.isDefault,

    // اطلاعات موقعیت مکانی
    province: newAddressLocation.value.province,
    city: newAddressLocation.value.city,
    location: newAddressLocation.value.location, // مختصات

    // اصلاحیه: تغییر نام فیلد address به fullAddress (یا هر نامی که API قبول می‌کند)
    fullAddress: newAddressLocation.value.address
  };

  try {
    await addressStore.addUserAddress(payload);
    showAddAddressModal.value = false;
    $toast('آدرس جدید اضافه شد', 'success', 5000);

    // ریست کردن فرم‌ها
    newAddress.value = {
      title: '',
      receiver: '',
      phone: '',
      isDefault: false
    };
    newAddressLocation.value = {
      address: '',
      province: '',
      city: '',
      location: null
    };
  } catch (error) {
    console.error('Error saving address:', error);
    $toast('خطا در ذخیره آدرس', 'error', 5000);
  }
}

// ۱. تابع باز کردن مدال ویرایش (جایگزین تابع قبلی)
const editAddress = (address) => {
  return//TODO:next step
  editingAddressId.value = address.id

  // پر کردن فرم با اطلاعات موجود
  editAddressForm.value = {
    title: address.title,
    receiver: address.receiver,
    phone: address.phone,
    isDefault: address.isDefault
  }

  // پر کردن اطلاعات موقعیت مکانی
  editAddressLocation.value = {
    address: address.fullAddress || address.address || '', // اگر نام فیلد در دیتابیس address است اینجا هم تنظیم کنید
    province: address.province || '',
    city: address.city || '',
    location: address.location || null
  }

  showEditAddressModal.value = true
}

// ۲. تابع ذخیره تغییرات (ارسال به سرور)
const updateAddress = async () => {
  if (!editingAddressId.value) return

  // ترکیب اطلاعات فرم و موقعیت مکانی
  const payload = {
    title: editAddressForm.value.title,
    receiver: editAddressForm.value.receiver,
    phone: editAddressForm.value.phone,
    isDefault: editAddressForm.value.isDefault,

    // اطلاعات موقعیت
    province: editAddressLocation.value.province,
    city: editAddressLocation.value.city,
    location: editAddressLocation.value.location,

    // متن آدرس کامل (تغییر نام فیلد طبق API)
    fullAddress: editAddressLocation.value.address
  }

  try {
    await addressStore.updateUserAddress(editingAddressId.value, payload)
    showEditAddressModal.value = false
    showToast('آدرس با موفقیت ویرایش شد', 'ti ti-check')

    // پاکسازی فرم‌ها
    editAddressForm.value = {title: '', receiver: '', phone: '', isDefault: false}
    editAddressLocation.value = {address: '', province: '', city: '', location: null}
    editingAddressId.value = null
  } catch (error) {
    console.error('Error updating address:', error)
    showToast('خطا در ویرایش آدرس', 'ti ti-alert-circle')
  }
}

const deleteAddress = async (address) => {
  if (confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
    await addressStore.deleteUserAddress(address.id)
    showToast('آدرس حذف شد', 'ti ti-trash')

  }
}

const logout = () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    authStore.logout()
    router.push('/')
  }
}

// تابع برای دکمه تسویه حساب
const handleSettleOrder = async (order) => {
  try {
    // فراخوانی API برای پرداخت یا تغییر وضعیت
    // await orderStore.payOrder(order.id);
    showToast('در حال انتقال به درگاه پرداخت...', 'ti ti-credit-card');
    // یا تغییر مستقیم وضعیت اگر منطق خاصی دارید
  } catch (error) {
    showToast('خطا در پردازش پرداخت', 'ti ti-alert-circle');
  }
};

// تابع برای دکمه کنسل کردن
const handleCancelOrder = async (order) => {
  if (confirm('آیا از کنسل کردن این سفارش اطمینان دارید؟')) {
    try {
      // فراخوانی API برای کنسل کردن
      await orderStore.updateOrderStatus(order.id)
      showToast('سفارش با موفقیت کنسل شد', 'ti ti-x');
    } catch (error) {
      showToast('خطا در کنسل کردن سفارش', 'ti ti-alert-circle');
    }
  }
};


// --- تغییر متد handleRemainingPayment ---
// تابع برای پرداخت مابقی سفارش
const handleRemainingPayment = async (order) => {
  if (order.remainingAmount <= 0) return;

  // 1. ذخیره اطلاعات سفارش در متغیر
  selectedPaymentOrder.value = order;
  // 2. باز کردن مودال
  showPaymentModal.value = true;
};

// متد نهایی برای انجام پرداخت بعد از انتخاب کاربر
const processPayment = async () => {
  if (!selectedPaymentOrder.value) return;

  const order = selectedPaymentOrder.value;

  // لودینگ یا نمایش پیام
  showToast('در حال پردازش...', 'ti ti-loader');

  try {
    if (selectedPaymentMethod.value === 'online') {
      // انتقال به درگاه پرداخت آنلاین
      const gatewayResponse = await paymentStore.initiatePharmacyOnlinePayment({
        orderId: order.id,
        amount: order.remainingAmount,
        tenantId: order.tenantId,
        meta: {type: 'remaining'}
      });
      // نکته: اگر تابع initiatePharmacyOnlinePayment ریدایرکت انجام می‌دهد، نیازی به بستن مودال نیست.
      // اگر فقط URL را برمی‌گرداند، باید window.location.href = url را انجام دهید.
      if (gatewayResponse.paymentUrl) {
        window.location.href = gatewayResponse.paymentUrl;
      } else {
        alert('خطا در دریافت لینک درگاه بانکی');
      }
    } else if (selectedPaymentMethod.value === 'wallet') {

      if (walletStore.wallet.balance > order.remainingAmount) {
        const response = await paymentStore.pharmacyWalletRemainingPayment({
          orderId: order.id,
          amount: order.remainingAmount,
          tenantId: order.tenantId,
          meta: {type: 'remaining'}
        });
        // نکته: کسر موجودی معمولاً باید توسط سرور انجام شود، نه کلاینت
        walletStore.wallet.balance -= order.remainingAmount

        await router.push(`/pharmacy/order-status/${order.id}`)

        // اگر پرداخت موفق بود:
        showToast('پرداخت با موفقیت انجام شد', 'ti ti-check');

      } else {
        alert('موجودی کم است')
      }
      showPaymentModal.value = false;


      // رفرش لیست سفارشات
      //await orderStore.fetchOrders(); // فرض بر این است که متدی برای فچ کردن دارید
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    showToast('خطا در پردازش پرداخت', 'ti ti-alert-circle');
  }
};

// بستن مودال پرداخت
const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedPaymentOrder.value = null;
  selectedPaymentMethod.value = 'online';
};

// تابع کمکی برای انتخاب آیکون بر اساس نوع دستگاه
const getDeviceIcon = (session) => {
  // اگر deviceName وجود نداشت، یک مقدار پیش‌فرض بگذار
  const device = session.deviceName || 'Unknown';

  if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) return 'ti-device-mobile';
  if (device.toLowerCase().includes('windows') || device.toLowerCase().includes('mac') || device.toLowerCase().includes('linux')) return 'ti-device-desktop';
  return 'ti-device-laptop';
};

// --- مدیریت وضعیت مودال مشاهده‌گر (Viewer) ---
const isViewerOpen = ref(false);
const currentDoc = ref(null);
const canEdit = computed(() => {
  if (!editingRequest.value) return false;
  return ['needs_revision'].includes(editingRequest.value.status);
});

// باز کردن مودال مشاهده‌گر
const openViewer = (doc) => {
  // اطمینان از اینکه doc کامل است
  currentDoc.value = {
    name: doc.name || 'مدارک',
    type: doc.type || 'image', // یا 'video'
    // اولویت با thumbnail، اگر نبود خود فایل
    src: doc.thumbnail || doc.file || doc.url,
    thumbnail: doc.thumbnail
  };
  isViewerOpen.value = true;
  document.body.style.overflow = 'hidden'; // جلوگیری از اسکرول صفحه اصلی
};

// بستن مودال مشاهده‌گر
const closeViewer = () => {
  isViewerOpen.value = false;
  currentDoc.value = null;
  document.body.style.overflow = ''; // آزادسازی اسکرول
};

// --- لیست مدارک داینامیک ---
// فرض بر این است که editForm.value.documents یک آبجکت است با کلیدهای داینامیک
const documentsList = computed(() => {
  if (!editForm.value?.documents) return [];

  return Object.entries(editForm.value.documents).map(([key, value]) => {
    // نرمال‌سازی داده‌ها
    const docType = value.type || (value.file ? (value.file.type.startsWith('video') ? 'video' : 'image') : 'image');

    return {
      key: key, // کلید داینامیک (مثلا logo, license)
      name: value.name || key, // نام نمایشی
      type: docType,
      // اگر thumbnail دارد از آن استفاده کن، اگر نه لینک فایل اصلی
      thumbnail: value.thumbnail || value.url || value.file,
      file: value.file // برای آپلود بعدی
    };
  });
});

const handleFileUpload = async (event, fieldName) => {
  // 1. گرفتن لیست فایل‌ها
  const fileList = event.target.files;

  // 2. اگر لیست خالی بود، هیچ کاری نکن
  if (!fileList || fileList.length === 0) {
    console.log("No file selected");
    return;
  }

  // 3. *** استخراج دقیق اولین فایل ***
  // استفاده از destructuring برای اطمینان از اینکه فقط فایل را می‌گیریم
  const [file] = fileList;

  // 4. بررسی نهایی: آیا file یک آبجکت File واقعی است؟
  if (!file || !(file instanceof File)) {
    console.error("File object is invalid:", file);
    return;
  }

  console.log("Successfully extracted File object:", file);

  const reader = new FileReader();

  reader.onload = (e) => {
    // به‌روزرسانی موقت در فرم برای پیش‌نمایش
    if (!editForm.value.documents[fieldName]) {
      editForm.value.documents[fieldName] = {};
    }

    editForm.value.documents[fieldName].thumbnail = e.target.result;
    editForm.value.documents[fieldName].file = file;
    editForm.value.documents[fieldName].type = file.type;
  };

  reader.onerror = () => {
    console.error("Error reading file");
  };

  // 5. خواندن فایل
  reader.readAsDataURL(file);
};
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: scale(0.95);
    opacity: 0;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.ltr {
  direction: ltr;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* مخفی کردن اسکرول بار در کروم/سافاری */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* رنگ خاکستری روشن */
  border-radius: 20px;
}
</style>
