<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 py-3 max-w-7xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <i class="ti ti-arrow-right text-xl text-gray-600"></i>
            </NuxtLink>
            <h1 class="text-xl font-bold text-gray-900">حساب کاربری</h1>
          </div>
          <div class="flex items-center gap-2">
            <!-- Notifications -->
            <div class="relative">
              <button
                  @click="showNotifications = !showNotifications"
                  class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <i class="ti ti-bell text-xl text-gray-600"></i>
                <span v-if="notifications.length>0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              <!-- Notifications Dropdown -->
              <Transition name="dropdown">
                <div
                    v-if="showNotifications"
                    @click.self="showNotifications = false"
                    class="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-[60] overflow-hidden"
                >
                  <div class="p-4 border-b border-gray-100 bg-gradient-to-l from-blue-50 to-teal-50">
                    <div class="flex items-center justify-between">
                      <h3 class="font-bold text-gray-900">اعلان‌ها</h3>
                      <button class="text-xs text-blue-600 hover:text-blue-700">علامت‌گذاری همه</button>
                    </div>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    <div
                        v-for="notif in notifications"
                        :key="notif.id"
                        class="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div class="flex items-start gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          notif.type === 'order' ? 'bg-blue-100' : 
                          notif.type === 'delivery' ? 'bg-green-100' : 'bg-purple-100'
                        ]">
                          <i :class="[
                            notif.type === 'order' ? 'ti ti-shopping-cart text-blue-600' :
                            notif.type === 'delivery' ? 'ti ti-truck text-green-600' : 'ti ti-gift text-purple-600'
                          ]"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-semibold text-gray-900 text-sm mb-1">{{ notif.title }}</h4>
                          <p class="text-xs text-gray-600 mb-1">{{ notif.message }}</p>
                          <span class="text-xs text-gray-400">{{ notif.time }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 border-t border-gray-100 bg-gray-50">
                    <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      مشاهده همه
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Support Button -->
            <button
                @click="showSupportModal = true"
                class="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-blue-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
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
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <ClientOnly>
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <!-- User Info -->
            <div class="p-6 border-b border-gray-100 text-center">
              <img v-if="user?.avatar" alt="" :src="user?.avatar" class="w-20 h-20 bg-gradient-to-l from-blue-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"/>
              <div v-else
                  class="w-20 h-20 bg-gradient-to-l from-blue-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {{ user?.name.charAt(0) }}
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
                  ? 'bg-blue-50 text-blue-600' 
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

            <ClientOnly>
              <form @submit.prevent="updateProfile" class="space-y-6">

                <!-- بخش آواتار -->
                <div class="flex items-center gap-4">
                  <div class="relative w-20 h-20">
                    <img
                        :src="formData.avatar"
                        alt="Avatar"
                        class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                    >
                    <label for="avatar-upload" class="absolute bottom-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full text-center cursor-pointer hover:bg-blue-600 shadow-sm">
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
            </ClientOnly>
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
                  <span :class="['font-bold text-sm', tx.type === 'CREDIT' || tx.type === 'REFUND_IN' ? 'text-green-600' : 'text-red-600']">
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
                      ? 'bg-blue-500 text-white' 
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
                      order.status === 'CUSTOMER_DELIVERED' ? 'bg-green-100' :
                      order.status === 'TENANT_PROCESSING' ? 'bg-blue-100' :
                      order.status === 'TENANT_SHIPPED' ? 'bg-amber-100' :
                      order.status === 'CUSTOMER_CANCELLED' ? 'bg-red-100' : 'bg-gray-100'
                    ]">
                      <i :class="[
                        order.status === 'CUSTOMER_DELIVERED' ? 'ti ti-check text-green-600' :
                        order.status === 'TENANT_PROCESSING' ? 'ti ti-clock text-blue-600' :
                        order.status === 'TENANT_SHIPPED' ? 'ti ti-truck text-amber-600' :
                        order.status === 'CUSTOMER_CANCELLED' ? 'ti ti-x text-red-600' : 'ti ti-package text-gray-600'
                      ]"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ order.code }}</p>
                      <p class="text-xs text-gray-500">{{ order.date }}</p>
                    </div>
                  </div>
                  <div :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    order.status === 'CUSTOMER_DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'TENANT_PROCESSING' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'TENANT_SHIPPED' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'CUSTOMER_CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
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
                        <img
                            :src="item.variant?.image?resolveUrl(item.variant?.image):resolveUrl(item.marketProduct.product.image)"
                            :alt="item.name"
                            class="w-20 h-20 rounded-lg object-cover"
                        >
                      </div>
                      <span
                          class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                        {{ item.quantity }}
                      </span>
                    </div>
                    <div v-if="order.items.length > 4"
                         class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <span class="text-gray-500 text-sm font-medium">+{{ order.items.length - 4 }}</span>
                    </div>
                  </div>

                  <!-- Order Summary -->
                  <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div class="text-sm text-gray-500">
                      {{ order.items.length }} کالا
                    </div>
                    <div class="font-bold text-blue-600">
                      {{ formatPrice(order.total) }} تومان
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
                  <button
                      v-if="order.status === 'CUSTOMER_PAID'"
                      @click="cancelOrder(order)"
                      class="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-star"></i>
                    لغو سفارش
                  </button>
                  <button
                      v-if="order.status === 'CUSTOMER_DELIVERED'"
                      @click="openReviewModal(order)"
                      class="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-star"></i>
                    ثبت نظر
                  </button>
                  <button
                      v-if="order.status === 'CUSTOMER_DELIVERED'"
                      class="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-refresh"></i>
                    سفارش مجدد
                  </button>
                  <button
                      v-if="order.status === 'TENANT_SHIPPED'"
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
            <!-- Reviews Filter Tabs -->
            <div class="bg-white rounded-2xl border border-gray-100 p-2">
              <div class="flex gap-1">
                <button
                    v-for="tab in reviewTabs"
                    :key="tab.id"
                    @click="activeReviewTab = tab.id"
                    :class="[
                    'flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2',
                    activeReviewTab === tab.id 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ tab.label }}
                  <span v-if="tab.count" :class="[
                    'text-xs px-1.5 py-0.5 rounded-full',
                    activeReviewTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  ]">
                    {{ tab.count }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Pending Reviews (products to review) -->
            <div v-if="activeReviewTab === 'pending'" class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-clock text-amber-500"></i>
                در انتظار ثبت نظر
              </h2>

              <div v-if="pendingReviews.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i class="ti ti-star-off text-3xl text-gray-300"></i>
                </div>
                <p class="text-gray-500">محصولی برای ثبت نظر ندارید</p>
              </div>

              <div v-else class="space-y-4">
                <div
                    v-for="item in pendingReviews"
                    :key="item.id"
                    class="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100"
                >
                  <div
                      class="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <img :src="item.productImage" class="w-full h-full object-cover"/>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ item.productName }}</p>
                    <p class="text-sm text-gray-500">از سفارش {{ item.orderCode }}</p>
                    <p class="text-xs text-amber-600 mt-1">خریداری شده در {{ item.purchaseDate }}</p>
                  </div>
                  <button
                      @click="openReviewModalForProduct(item)"
                      class="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    <i class="ti ti-star"></i>
                    ثبت نظر
                  </button>
                </div>
              </div>
            </div>

            <!-- My Reviews -->
            <div v-if="activeReviewTab === 'submitted'" class="space-y-4">
              <div v-if="myReviews.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i class="ti ti-message-off text-4xl text-gray-300"></i>
                </div>
                <h3 class="text-gray-900 font-semibold mb-2">نظری ثبت نکرده‌اید</h3>
                <p class="text-gray-500 text-sm">پس از خرید محصولات می‌توانید نظر خود را ثبت کنید</p>
              </div>

              <div
                  v-for="review in myReviews"
                  :key="review.id"
                  class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >

                <!-- Review Header -->
                <div class="p-4 border-b border-gray-100 flex items-center gap-4">
                  <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img :src="review.productImage" class="w-full h-full object-cover"/>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ review.productName }}</p>
                    <p class="text-xs text-gray-500">{{ review.date }}</p>
                  </div>
                  <div :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    review.status === 'approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  ]">
                    {{ review.statusLabel }}
                  </div>
                </div>

                <!-- Review Content -->
                <div class="p-4">
                  <!-- Rating -->
                  <div class="flex items-center gap-2 mb-3">
                    <div class="flex items-center gap-0.5">
                      <i
                          v-for="star in 5"
                          :key="star"
                          :class="[
                          'ti text-lg',
                          star <= review.rating ? 'ti-star-filled text-amber-400' : 'ti-star text-gray-300'
                        ]"
                      ></i>
                    </div>
                    <span class="text-sm text-gray-500">({{ review.rating }} از ۵)</span>
                  </div>

                  <!-- Review Title & Text -->
                  <h4 v-if="review.title" class="font-semibold text-gray-900 mb-2">{{ review.title }}</h4>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ review.text }}</p>

                  <!-- Pros & Cons -->
                  <div v-if="review.pros?.length || review.cons?.length" class="mt-4 space-y-2">
                    <div v-if="review.pros?.length" class="flex flex-wrap gap-2">
                      <span
                          v-for="(pro, index) in review.pros"
                          :key="'pro-' + index"
                          class="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full flex items-center gap-1"
                      >
                        <i class="ti ti-plus text-xs"></i>
                        {{ pro }}
                      </span>
                    </div>
                    <div v-if="review.cons?.length" class="flex flex-wrap gap-2">
                      <span
                          v-for="(con, index) in review.cons"
                          :key="'con-' + index"
                          class="px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full flex items-center gap-1"
                      >
                        <i class="ti ti-minus text-xs"></i>
                        {{ con }}
                      </span>
                    </div>
                  </div>
                  <!-- Likes & Actions -->
                  <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <i class="ti ti-thumb-up"></i>
                        {{ review.likesCount }} نفر این نظر را مفید دانستند
                      </span>
                    </div>
                    <div v-if="!review.isApproved" class="flex items-center gap-3">
                      <button
                          @click="editReviewFromList(review)"
                          class="text-blue-600 text-sm hover:underline flex items-center gap-1"
                      >
                        <i class="ti ti-edit text-sm"></i>
                        ویرایش
                      </button>
                      <button
                          @click="deleteMarketReview(review)"
                          class="text-red-500 text-sm hover:underline flex items-center gap-1"
                      >
                        <i class="ti ti-trash text-sm"></i>
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Discounts Section -->
          <div v-if="activeSection === 'discounts'" class="space-y-4">
            <!-- Add Discount Code -->
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-plus text-blue-500"></i>
                افزودن کد تخفیف
              </h2>
              <div class="flex gap-3">
                <input
                    v-model="newDiscountCode"
                    type="text"
                    placeholder="کد تخفیف را وارد کنید"
                    class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                >
                <button
                    @click="addDiscountCode"
                    class="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <i class="ti ti-check"></i>
                  ثبت
                </button>
              </div>
            </div>

            <!-- My Discounts -->
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-discount-2 text-blue-500"></i>
                کدهای تخفیف من
              </h2>

              <div v-if="discounts.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i class="ti ti-ticket-off text-3xl text-gray-300"></i>
                </div>
                <p class="text-gray-500">کد تخفیفی ندارید</p>
              </div>

              <div v-else class="space-y-3">
                <div
                    v-for="discount in discounts"
                    :key="discount.id"
                    :class="[
                    'border rounded-xl p-4 relative overflow-hidden',
                    discount.isExpired ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-blue-200 bg-gradient-to-l from-blue-50 to-white'
                  ]"
                >
                  <!-- Discount Pattern -->
                  <div class="absolute left-0 top-0 bottom-0 w-2"
                       :class="discount.isExpired ? 'bg-gray-300' : 'bg-blue-500'"></div>

                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3 mr-2">
                      <div :class="[
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        discount.isExpired ? 'bg-gray-200' : 'bg-blue-100'
                      ]">
                        <i :class="[
                          'ti text-xl',
                          discount.type === 'percent' ? 'ti-percentage' : 'ti-currency-dollar',
                          discount.isExpired ? 'text-gray-400' : 'text-blue-600'
                        ]"></i>
                      </div>
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          <span class="font-bold text-gray-900">{{ discount.code }}</span>
                          <span v-if="discount.isExpired"
                                class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">منقضی شده</span>
                        </div>
                        <p class="text-sm text-gray-600">{{ discount.description }}</p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span class="flex items-center gap-1">
                            <i class="ti ti-calendar"></i>
                            تا {{ formatDate(discount.expireDate) }}
                          </span>
                          <span v-if="discount.minPurchase" class="flex items-center gap-1">
                            <i class="ti ti-shopping-cart"></i>
                            حداقل {{ formatPrice(discount.minPurchase) }} تومان
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-left flex-shrink-0">
                      <p :class="[
                        'text-xl font-bold',
                        discount.isExpired ? 'text-gray-400' : 'text-blue-600'
                      ]">
                        {{ discount.type === 'percent' ? discount.value + '%' : formatPrice(discount.value) }}
                      </p>
                      <p class="text-xs text-gray-500">{{ discount.type === 'percent' ? 'درصد تخفیف' : 'تومان' }}</p>
                    </div>
                  </div>

                  <!-- Copy Button -->
                  <button
                      v-if="!discount.isExpired"
                      @click="copyDiscountCode(discount.code)"
                      class="mt-3 w-full py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <i class="ti ti-copy"></i>
                    کپی کد
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses Section -->
          <div v-if="activeSection === 'addresses'" class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-map-pin text-blue-500"></i>
                آدرس‌های من
              </h2>
              <button
                  @click="showAddAddressModal = true"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
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
                  :class="address.isDefault ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100'"
                  class="border rounded-xl p-4"
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="ti ti-map-pin text-gray-500"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-900">{{ address.title }}</span>
                      <span v-if="address.isDefault" class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">پیش‌فرض</span>
                    </div>
                    <p class="text-gray-600 text-sm">{{ address.fullAddress.address?.road }} .
                      {{ address.fullAddress.address?.town??address.fullAddress.address.suburb }} .
                      {{ address.fullAddress.address?.state }}
                    </p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{{ address.receiver }}</span>
                      <span class="ltr">{{ address.phone }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                        @click="editAddress(address)"
                        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500"
                    >
                      <i class="ti ti-edit"></i>
                    </button>
                    <button
                        @click="deleteAddress(address)"
                        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500"
                    >
                      <i class="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                      <h3 class="font-bold text-lg text-gray-800">{{ req.shopName }}</h3>
                      <p class="text-sm text-gray-500 mt-1">نوع فروشگاه: {{ req.type }}</p>
                      <p class="text-xs text-gray-400 mt-2">تاریخ ثبت: {{ req.date }}</p>
                    </div>
                    <span :class="['px-3 py-1 rounded-lg text-xs font-bold border', getReqStatusBadge(req.status)]">
            {{ getReqStatusLabel(req.status) }}
          </span>
                  </div>

                  <!-- پیام ادمین -->
                  <div v-if="req.message"
                       class="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex gap-2">
                    <i class="ti ti-alert-circle flex-shrink-0"></i>
                    <span>{{ req.message }}</span>
                  </div>

                  <div class="mt-4 flex gap-3">
                    <button
                        @click="openEditRequestModal(req)"
                        class="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <i class="ti ti-eye"></i>
                      مشاهده
                    </button>
                    <!-- دکمه اصلاح اطلاعات فقط در صورت نیاز به اصلاح نمایش داده میشود -->
                    <button
                        v-if="req.status === 'needs_revision'"
                        @click="openEditRequestModal(req)"
                        class="flex-1 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <i class="ti ti-edit"></i>
                      اصلاح اطلاعات
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
              <i class="ti ti-shield-check text-blue-500"></i>
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
                        @click="revokeSession(session.id)"
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
        </ClientOnly>
      </div>
    </div>

    <!-- Add Address Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showAddAddressModal"
            class="fixed inset-0 bg-black/50 z-[0]"
            @click="showAddAddressModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showAddAddressModal"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[0] pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[80vh] w-full md:w-[500px] overflow-hidden pointer-events-auto"
          >
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 class="font-bold text-gray-900">افزودن آدرس جدید</h3>
              <button @click="showAddAddressModal = false" class="w-8 h-8 flex items-center justify-center">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>
            <div class="p-4 space-y-4">
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">عنوان آدرس</label>
                <input
                    type="text"
                    v-model="newAddress.title"
                    placeholder="مثال: خانه، محل کار"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                >
              </div>
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">موقعیت و آدرس</label>
                <ClientOnly>
                  <!-- اصلاح: اتصال به addressData برای دریافت مختصات و اطلاعات نقشه -->
                  <AddressSelector
                      v-model="addressData"
                      placeholder="روی نقشه آدرس را انتخاب کنید"
                      title="انتخاب موقعیت آدرس"
                  />
                </ClientOnly>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">پلاک</label>
                  <input
                      type="text"
                      v-model="newAddress.plaque"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                  >
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">واحد</label>
                  <input
                      type="text"
                      v-model="newAddress.unit"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                  >
                </div>
              </div>
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">نام گیرنده</label>
                <input
                    type="text"
                    v-model="newAddress.receiver"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                >
              </div>
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">شماره تماس</label>
                <input
                    type="tel"
                    v-model="newAddress.phone"
                    placeholder="09123456789"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 ltr"
                    dir="ltr"
                >
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    v-model="newAddress.isDefault"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                >
                <span class="text-gray-700 text-sm">تنظیم به عنوان آدرس پیش‌فرض</span>
              </label>
              <button
                  type="button"
                  @click="saveAddress(newAddress)"
                  class="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                ذخیره آدرس
              </button>
            </div>
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

    <!-- Review Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showReviewModal"
            class="fixed inset-0 bg-black/50 z-50"
            @click="closeReviewModal"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showReviewModal"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[85vh] w-full md:w-[550px] overflow-hidden pointer-events-auto">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 class="font-bold text-gray-900">ثبت نظر</h3>
              <button @click="closeReviewModal" class="w-8 h-8 flex items-center justify-center">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <div class="p-4 overflow-y-auto max-h-[70vh]">
              <div v-if="isAutoReviewPrompt" class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p class="font-semibold text-amber-800">لطفاً نظر خود را ثبت کنید</p>
                <p class="mt-1 text-sm text-amber-700">محصول شما تحویل داده شده است.</p>
              </div>
              <!-- Product Info -->
              <div v-if="reviewingProduct" class="bg-gray-50 rounded-xl p-4 mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <img :src="reviewingProduct.productImage" class="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{
                        reviewingProduct.productName || reviewingProduct.name
                      }}</p>
                    <p class="text-sm text-gray-500">{{ reviewingProduct.orderCode || '' }}</p>
                  </div>
                </div>
              </div>

              <!-- Rating -->
              <div class="mb-6">
                <label class="block text-gray-700 font-medium mb-3">امتیاز شما</label>
                <div class="flex items-center gap-2">
                  <button
                      v-for="star in 5"
                      :key="star"
                      @click="newReview.rating = star"
                      class="p-1 transition-transform hover:scale-110"
                  >
                    <i :class="[
                      'ti text-3xl',
                      star <= newReview.rating ? 'ti-star-filled text-amber-400' : 'ti-star text-gray-300'
                    ]"></i>
                  </button>
                  <span class="text-gray-500 mr-2">
                    {{ newReview.rating > 0 ? ratingLabels[newReview.rating - 1] : 'انتخاب کنید' }}
                  </span>
                </div>
              </div>

              <!-- Title -->
              <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">عنوان نظر</label>
                <input
                    v-model="newReview.title"
                    type="text"
                    placeholder="یک عنوان کوتاه برای نظر خود بنویسید"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                >
              </div>

              <!-- Review Text -->
              <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">متن نظر</label>
                <textarea
                    v-model="newReview.text"
                    rows="4"
                    placeholder="تجربه خود را از این محصول بنویسید..."
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none"
                ></textarea>
              </div>

              <!-- Pros -->
              <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">
                  <i class="ti ti-plus text-green-500 ml-1"></i>
                  نقاط قوت
                </label>
                <div class="flex gap-2 mb-2">
                  <input
                      v-model="newPro"
                      type="text"
                      placeholder="مثال: کیفیت عالی"
                      class="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 text-sm"
                      @keyup.enter="addPro"
                  >
                  <button
                      @click="addPro"
                      class="px-4 py-2 bg-green-500 text-white rounded-xl text-sm hover:bg-green-600"
                  >
                    افزودن
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                      v-for="(pro, index) in newReview.pros"
                      :key="index"
                      class="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full flex items-center gap-2"
                  >
                    {{ pro }}
                    <button @click="newReview.pros.splice(index, 1)" class="hover:text-green-900">
                      <i class="ti ti-x text-xs"></i>
                    </button>
                  </span>
                </div>
              </div>

              <!-- Cons -->
              <div class="mb-6">
                <label class="block text-gray-700 font-medium mb-2">
                  <i class="ti ti-minus text-red-500 ml-1"></i>
                  نقاط ضعف
                </label>
                <div class="flex gap-2 mb-2">
                  <input
                      v-model="newCon"
                      type="text"
                      placeholder="مثال: بسته‌بندی ضعیف"
                      class="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-red-400 text-sm"
                      @keyup.enter="addCon"
                  >
                  <button
                      @click="addCon"
                      class="px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600"
                  >
                    افزودن
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                      v-for="(con, index) in newReview.cons"
                      :key="index"
                      class="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full flex items-center gap-2"
                  >
                    {{ con }}
                    <button @click="newReview.cons.splice(index, 1)" class="hover:text-red-900">
                      <i class="ti ti-x text-xs"></i>
                    </button>
                  </span>
                </div>
              </div>

              <!-- Recommend -->
              <div class="mb-6 p-4 bg-gray-50 rounded-xl">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                      type="checkbox"
                      v-model="newReview.recommend"
                      class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  >
                  <span class="text-gray-700">این محصول را به دیگران پیشنهاد می‌کنم</span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                  @click="submitReview"
                  :disabled="!newReview.rating || !newReview.text"
                  :class="[
                  'w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2',
                  newReview.rating && newReview.text
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                ]"
              >
                <i class="ti ti-send"></i>
                ثبت نظر
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showOrderDetailsModal"
            class="fixed inset-0 bg-black/50 z-50"
            @click="showOrderDetailsModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showOrderDetailsModal && selectedOrder"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
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
                    selectedOrder.status === 'CUSTOMER_DELIVERED' ? 'bg-green-100' :
                    selectedOrder.status === 'TENANT_PROCESSING' ? 'bg-blue-100' :
                    selectedOrder.status === 'TENANT_SHIPPIED' ? 'bg-amber-100' :
                    selectedOrder.status === 'CUSTOMER_CANCELLED' ? 'bg-red-100' : 'bg-gray-100'
                  ]">
                    <i :class="[
                      'text-xl',
                      selectedOrder.status === 'CUSTOMER_DELIVERED' ? 'ti ti-check text-green-600' :
                      selectedOrder.status === 'TENANT_PROCESSING' ? 'ti ti-clock text-blue-600' :
                      selectedOrder.status === 'TENANT_SHIPPED' ? 'ti ti-truck text-amber-600' :
                      selectedOrder.status === 'CUSTOMER_CANCELLED' ? 'ti ti-x text-red-600' : 'ti ti-package text-gray-600'
                    ]"></i>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ selectedOrder.statusLabel }}</p>
                    <p class="text-sm text-gray-500">{{ selectedOrder.date }}</p>
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
                    <img
                        :src="item.variant?.image?resolveUrl(item.variant?.image):resolveUrl(item.marketProduct.product.image)"
                        :alt="item.name"
                        class="w-20 h-20 rounded-lg object-cover"
                    >
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">تعداد: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-bold text-blue-600 flex-shrink-0">{{ formatPrice(item.price * item.quantity) }}
                    تومان</p>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="border-t border-gray-200 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">جمع کالاها</span>
                  <span class="text-gray-900">{{
                      formatPrice(selectedOrder.total - selectedOrder.metadata.shippingCost)
                    }} تومان</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">هزینه ارسال</span>
                  <span class="text-green-600">{{ formatPrice(selectedOrder.metadata.shippingCost) }} تومان</span>
                </div>
                <div class="flex justify-between font-bold pt-2 border-t border-gray-100">
                  <span class="text-gray-900">مبلغ کل</span>
                  <span class="text-blue-600">{{ formatPrice(selectedOrder.total) }} تومان</span>
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
                      <div class="absolute -right-4 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow animate-pulse"></div>
                      <div class="bg-amber-50 rounded-xl p-3 border border-amber-100">
                        <p class="font-bold text-amber-900">{{ alopeykStatusData.statusText }}</p>
                        <p class="text-sm text-amber-700 mt-1">{{ alopeykStatusData.statusDescription }}</p>
                        <p class="text-xs text-amber-600 mt-2">بروزرسانی: {{ getCurrentTime() }}</p>
                      </div>
                    </div>

                    <template v-if="alopeykStatusData.progress > 0">
                      <div class="relative">
                        <div class="absolute -right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
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
            <div class="p-6 border-b border-gray-100 bg-gradient-to-l from-blue-50 to-teal-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                      class="w-12 h-12 bg-gradient-to-l from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center">
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
                 class="flex items-center gap-4 p-4 bg-gradient-to-l from-blue-50 to-teal-50 rounded-2xl hover:shadow-md transition-all group">
                <div
                    class="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="ti ti-phone text-2xl text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">تماس تلفنی</p>
                  <p class="font-bold text-gray-900 ltr" dir="ltr">021-88888888</p>
                </div>
                <i class="ti ti-chevron-left text-gray-400 group-hover:text-blue-600 transition-colors"></i>
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

    <!-- Edit Request Modal (Updated) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showEditRequestModal"
            class="fixed inset-0 bg-black/50 z- backdrop-blur-sm"
            @click="showEditRequestModal = false"
        ></div>
      </Transition>
      <Transition name="slide-up">
        <div
            v-if="showEditRequestModal && editingRequest"
            class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z- pointer-events-none"
        >
          <div
              class="bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] md:max-h-[90vh] w-full md:w-[700px] overflow-hidden pointer-events-auto flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 class="font-bold text-gray-900">ویرایش درخواست فروشگاه</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ editingRequest.shopName }}</p>
              </div>
              <button @click="closeEditRequestModal"
                      class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition">
                <i class="ti ti-x text-gray-500"></i>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-6 overflow-y-auto flex-1 space-y-6">

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

              <!-- 2. Categories Section (Selectable) -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">دسته‌بندی‌های فروشگاه</label>

                <!-- Selected Categories Display -->
                <div class="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                  <span v-for="(cat, index) in editForm.categories" :key="index"
                        class="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                    <i :class="getCategoryIcon(cat.value || cat)"></i>
                    {{ cat.label || cat }}
                    <button v-if="canEdit" @click="removeCategory(index)" class="hover:text-red-600 transition">
                      <i class="ti ti-x"></i>
                    </button>
                  </span>
                  <span v-if="editForm.categories.length === 0" class="text-gray-400 text-sm py-1">هنوز دسته‌بندی انتخاب نشده</span>
                </div>

                <!-- Category Selector Dropdown -->
                <div v-if="canEdit" class="relative">
                  <button
                      @click="showCategoryDropdown = !showCategoryDropdown"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-right flex items-center justify-between hover:border-blue-400 transition"
                  >
                    <span class="text-gray-700 text-sm">انتخاب از لیست...</span>
                    <i class="ti ti-chevron-down text-gray-400"></i>
                  </button>

                  <!-- Dropdown List -->
                  <Transition name="dropdown">
                    <div
                        v-if="showCategoryDropdown"
                        @click.self="showCategoryDropdown = false"
                        class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto"
                    >
                      <div
                          v-for="cat in productCategories"
                          :key="cat.value"
                          @click="addCategory(cat)"
                          class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-50 last:border-0"
                      >
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                          <i :class="cat.icon"></i>
                        </div>
                        <span class="text-sm font-medium text-gray-700">{{ cat.label }}</span>
                        <i v-if="isCategorySelected(cat.value)" class="ti ti-check text-blue-500 mr-auto"></i>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- 2. Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نام فروشگاه</label>
                  <input type="text" :value="editingRequest.shopName" :disabled="!canEdit"
                         class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نوع فروشگاه</label>
                  <input type="text" :value="editingRequest.type"
                         :disabled="!canEdit"
                         class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">نام مالک</label>
                  <input type="text" v-model="editForm.ownerName" :disabled="!canEdit"
                         class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">شماره تماس</label>
                  <input type="tel" v-model="editForm.phone" :disabled="!canEdit"
                         class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 ltr"
                         dir="ltr">
                </div>
              </div>

              <!-- 4. Address & Location -->
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
                <textarea  v-model="localAddressText" :disabled="!canEdit" rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">استان</label>
                  <input type="text" v-model="editForm.province" :disabled="!canEdit"
                         class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">شهر</label>
                  <input type="text" v-model="editForm.city" :disabled="!canEdit"
                         class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400">
                </div>
              </div>

              <!-- 5. Financial Info -->
              <div>
                <label class="block text-gray-700 text-sm font-medium mb-2">شماره شبا (IBAN)</label>
                <input type="text" v-model="editForm.iban" :disabled="!canEdit"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 ltr font-mono"
                       dir="ltr">
              </div>

            </div>

            <!-- Footer Actions -->
            <div class="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
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

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showImagePreview" class="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4"
             @click="showImagePreview = false">
          <img :src="previewImageUrl" class="max-w-full max-h-full rounded-lg shadow-2xl">
          <button class="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70">
            <i class="ti ti-x text-2xl"></i>
          </button>
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
import {ref, computed, onMounted, nextTick, watch} from 'vue'
import {storeToRefs} from "pinia"
import {useRouter, useRoute} from 'vue-router'
import {useShopStore} from "../stores/shop.store.ts"
import {useAuthStore} from "../stores/auth.ts"
import {OrderStatus, useOrderStore} from "../stores/order.store.js";
import {useAddressStore} from "../stores/address.store.js";
import {useWalletStore} from "../stores/wallet.store.js";
import {useReviewStore} from "../stores/reviews.store.ts";
import {useDiscountStore} from "../stores/discount.store.js";
//import AddressSelector from "../components/AddressSelector.vue";
import AddressSelector from '../../../shared/components/AddressSelector.vue'
import {useNotificationStore} from "../stores/notification.store.js";
import PersianDatePicker from "../components/PersianDatePicker.vue";
import {useNuxtApp, useRuntimeConfig} from "nuxt/app";
import {useUrlHelper} from "../composables/useUrlHelper.js";

definePageMeta({
  layout: false
})
const { resolveUrl } = useUrlHelper();
const {$toast}=useNuxtApp()
const reviewStore = useReviewStore();
const discountStore = useDiscountStore()
const currentUrl = ref('')
const config = useRuntimeConfig()
const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id)
const {sessions, loading} = storeToRefs(authStore);
const fetchSessions = authStore.fetchSessions;
const isAuthenticated = computed(()=>authStore.isAuthenticated)
const newAddressLocation = ref({
  address: '',
  province: '',
  city: '',
  location: null // مختصات نقشه
})
// Watch newAddressLocation and sync with newAddress
watch(newAddressLocation, (newVal) => {
  newAddress.value.fullAddress = newVal.address
}, {deep: true})
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

const revokeSession = (sessionId) => {
  authStore.revokeSession(sessionId);
}
const revokeAllSessions = () => {
  authStore.revokeAllSessions();
}
const shopStore = useShopStore()
const orderStore = useOrderStore()
const walletStore = useWalletStore()
const addressStore = useAddressStore()
const router = useRouter()
const route = useRoute()

// Active section
const activeSection = ref('profile')

// Modals
const showNotifications = ref(false)
const showSupportModal = ref(false)
// تابع کمکی برای انتخاب آیکون بر اساس نوع دستگاه
const getDeviceIcon = (session) => {
  // اگر deviceName وجود نداشت، یک مقدار پیش‌فرض بگذار
  const device = session.deviceName || 'Unknown';

  if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) return 'ti-device-mobile';
  if (device.toLowerCase().includes('windows') || device.toLowerCase().includes('mac') || device.toLowerCase().includes('linux')) return 'ti-device-desktop';
  return 'ti-device-laptop';
};


const timeAgo = (date) => {
  // اینجا یک لاجیک ساده برای نمایش "فعال" یا "زمان گذشته" است
  // در پروژه واقعی از کتابخانه استفاده کنید
  return date;
};
// --- Notifications Data (می‌تواند بعداً از استور لود شود) ---
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

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

// --- User Data ---
// اصلاح شده: استفاده مستقیم از authStore.user برای دسترسی به ID و فیلدهای خام

const user = computed(() => {
  const u = authStore.user
  if (!u) return null

  return {
    id: u.id, // اضافه کردن ID
    name: u.fullName || `${u.firstName} ${u.lastName}`, // اولویت با fullName
    phoneNumber: u.phoneNumber || '',
    email: u.email || '',
    //avatar: u.avatar || '',
    avatar: resolveUrl(u.avatar) || '',
    birthday: u.dateOfBirth || '' // اولویت با dateOfBirth
  }
})

// آبجکت موقت برای ویرایش
const formData = ref({
  fullName: '',
  email: '',
  phoneNumber: '',
  birthday: '',
  avatar: ''
});

// مدیریت فایل آواتار
const avatarFile = ref();

// هنگام تغییر کاربر، فرم را پر کن
watch(() => authStore.user, (newUser) => {
  if (newUser) {

    formData.value = {
      fullName: newUser.fullName || `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email || '',
      phoneNumber: newUser.phoneNumber || '',
      birthday: newUser.dateOfBirth || newUser.birthday || '',
      //avatar: newUser.avatar || '',
      avatar: resolveUrl(newUser.avatar) || ''
    };
  }
}, { immediate: true });

// هندلر انتخاب عکس
const handleAvatarUpload = (event) => {
  const target = event.target;
  if (target.files && target.files[0]) {
    avatarFile.value = target.files[0];
    formData.value.avatar = URL.createObjectURL(target.files[0]);
  }
};
// تابع ارسال فرم
const updateProfile = async () => {
  if (!authStore.user?.id) return;

  const payload = {
    fullName: formData.value.fullName,
    email: formData.value.email,
    dateOfBirth: formData.value.birthday,
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

// --- Addresses (از استور) ---
const addresses = computed(() => addressStore.addresses)

// --- Orders Logic (از استور) ---
const activeOrderTab = ref('ALL')
const orderTabs = computed(() => {
  const all = orderStore.orders.length
  const pending = orderStore.orders.filter(o => o.status === 'CUSTOMER_PENDING').length
  const paid = orderStore.orders.filter(o => o.status === 'CUSTOMER_PAID').length
  const processing = orderStore.orders.filter(o => o.status === 'TENANT_PROCESSING').length
  const shipping = orderStore.orders.filter(o => o.status === 'TENANT_SHIPPED').length
  const delivered = orderStore.orders.filter(o => o.status === 'CUSTOMER_DELIVERED').length
  const cancelled = orderStore.orders.filter(o => o.status === 'CUSTOMER_CANCELLED').length

  return [
    {id: 'ALL', label: 'همه', count: all},
    {id: 'CUSTOMER_PENDING', label: 'در انتظار پرداخت', count: pending},
    {id: 'CUSTOMER_PAID', label: 'در انتظار تایید', count: paid},
    {id: 'TENANT_PROCESSING', label: 'در حال پردازش', count: processing},
    {id: 'TENANT_SHIPPED', label: 'در حال ارسال', count: shipping},
    {id: 'CUSTOMER_DELIVERED', label: 'تحویل شده', count: delivered},
    {id: 'CUSTOMER_CANCELLED', label: 'لغو شده', count: cancelled},
  ]
})

// تبدیل سفارشات خام API به فرمت تمپلیت
const formattedOrders = computed(() => {
  return orderStore.orders.map(order => {
    // پیدا کردن اولین تراکنش موفق برای شماره پیگیری
    const successTx = order.transactions?.find(t => t.status === 'success')
    const refId = successTx?.refId || order.payments?.[0]?.referenceId || '-'

    return {
      ...order,
      code: order.orderCode, // ساخت کد کوتاه
      date: new Date(order.createdAt).toLocaleDateString('fa-IR') + ' - ' + new Date(order.createdAt).toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      statusLabel: getStatusLabel(order.status),
      total: order.totalAmount,
      trackingCode: refId, // اضافه کردن کد رهگیری
      items: order.items.map(item => ({
        ...item,
        name: item.marketProduct.product.name || `محصول شماره ${item.productId}`
      }))
    }
  })
})

const filteredOrders = computed(() => {
  if (activeOrderTab.value === 'ALL') return formattedOrders.value
  return formattedOrders.value.filter(order => order.status === activeOrderTab.value)
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


// --- Reviews (ثابت یا از استور) ---
/*const activeReviewTab = ref('pending')
const reviewTabs = [
  { id: 'pending', label: 'در انتظار نظر', count: 3 },
  { id: 'submitted', label: 'نظرات من', count: 2 },
]

const pendingReviews = ref([
  { id: 1, productName: 'غذای خشک سگ رویال کنین', orderCode: 'PM-83215', purchaseDate: '۲۰ آذر ۱۴۰۴' },
  { id: 2, productName: 'تشک سگ سایز بزرگ', orderCode: 'PM-83215', purchaseDate: '۲۰ آذر ۱۴۰۴' },
  { id: 3, productName: 'شامپو سگ', orderCode: 'PM-82156', purchaseDate: '۱۵ آذر ۱۴۰۴' },
])

const myReviews = ref([
  {
    id: 1,
    productName: 'غذای گربه ویسکاس ۳ کیلوگرمی',
    date: '۱۰ آذر ۱۴۰۴',
    rating: 5,
    title: 'عالی و با کیفیت',
    text: 'گربه من عاشق این غذاست. کیفیت عالی داره و بسته‌بندیش هم خیلی خوب بود. قیمتش هم نسبت به کیفیتش مناسبه.',
    pros: ['کیفیت عالی', 'بسته‌بندی مناسب', 'قیمت مناسب'],
    cons: [],
    status: 'approved',
    statusLabel: 'تأیید شده',
    likes: 12
  },
  {
    id: 2,
    productName: 'قلاده سگ چرمی',
    date: '۵ آذر ۱۴۰۴',
    rating: 4,
    title: 'کیفیت خوب ولی سایزش کوچک بود',
    text: 'کیفیت چرم خوبه ولی سایزش یکم کوچکتر از چیزی بود که فکر می‌کردم. در کل راضی هستم.',
    pros: ['کیفیت چرم', 'طراحی زیبا'],
    cons: ['سایز کوچک'],
    status: 'approved',
    statusLabel: 'تأیید شده',
    likes: 5
  },
])*/


// استفاده از computed های استور
const activeReviewTab = ref('pending');

const reviewTabs = computed(() => [
  {
    id: 'pending',
    label: 'در انتظار نظر',
    count: reviewStore.pendingCount
  },
  {
    id: 'submitted',
    label: 'نظرات من',
    count: reviewStore.submittedCount
  },
]);


// دسترسی مستقیم به لیست‌ها
const pendingReviews = computed(() => reviewStore.pendingReviews);

const myReviews = computed(() => reviewStore.myReviews);

// Review Modal
const showReviewModal = ref(false)
const reviewingProduct = ref(null)
const isAutoReviewPrompt = ref(false)
const ratingLabels = ['خیلی بد', 'بد', 'معمولی', 'خوب', 'عالی']
const newPro = ref('')
const newCon = ref('')
const newReview = ref({
  rating: 0,
  title: '',
  text: '',
  pros: [],
  cons: [],
  recommend: true
})

const openReviewModal = (order, {auto = false} = {}) => {
  activeSection.value = 'reviews'
  activeReviewTab.value = 'pending'
  /*if (order.items?.length > 0) {
    reviewingProduct.value = {
      productName: order.items[0].name,
      orderCode: order.code
    }
    isAutoReviewPrompt.value = auto
    resetReviewForm()
    showReviewModal.value = true
  }*/
}

const openReviewModalForProduct = (item, {auto = false} = {}) => {
  reviewingProduct.value = item
  isAutoReviewPrompt.value = auto
  resetReviewForm()
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  resetReviewForm()
  reviewingProduct.value = null
  isAutoReviewPrompt.value = false
}

const resetReviewForm = () => {
  newReview.value = {
    rating: 0,
    title: '',
    text: '',
    pros: [],
    cons: [],
    recommend: true
  }
  newPro.value = ''
  newCon.value = ''
}

const addPro = () => {
  if (newPro.value.trim()) {
    newReview.value.pros.push(newPro.value.trim())
    newPro.value = ''
  }
}

const addCon = () => {
  if (newCon.value.trim()) {
    newReview.value.cons.push(newCon.value.trim())
    newCon.value = ''
  }
}
const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fa-IR')
}


const submitReview = async () => {

  // اعتبارسنجی ساده
  if (!newReview.value.rating || !newReview.value.text) return

  // استخراج اطلاعات لازم از محصول در حال بررسی
  // فرض بر این است که reviewingProduct شامل _raw است که اطلاعات کامل سفارش را دارد
  const rawProduct = reviewingProduct.value?._raw
  const variantId = rawProduct?.variantId && rawProduct?.variantId.trim() !== '' ? rawProduct.variantId : null
  const productId = rawProduct?.productId || reviewingProduct.value?.id || newReview.value.productId
  const orderId = rawProduct?.orderId || reviewingProduct.value?.orderCode || newReview.value.orderId

  if (!productId || !orderId) {
    console.error('Product ID or Order ID is missing')
    return
  }

  try {
    // فراخوانی متد استور برای ثبت یا ویرایش نظر
    await reviewStore.submitProductReview({
      productId: productId,
      variantId: variantId,
      orderId: orderId,
      rating: newReview.value.rating,
      comment: newReview.value.text, // متن نظر در فیلد comment ارسال می‌شود
      title: newReview.value.title,
      pros: newReview.value.pros,
      cons: newReview.value.cons,
      item: rawProduct
    })
    // پیام موفقیت بر اساس وضعیت قبلی (ویرایش یا ثبت جدید)
    const existingReview = reviewStore.myReviews.find(r =>
        r.productName === (reviewingProduct.value?.productName || reviewingProduct.value?.name)
    )

    if (existingReview) {
      showToast('نظر شما با موفقیت ویرایش شد', 'ti ti-check')
    } else {
      showToast('نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود', 'ti ti-check')
    }


    // بستن مودال و ریست کردن فرم
    isAutoReviewPrompt.value = false
    showReviewModal.value = false
    resetReviewForm()
    reviewingProduct.value = null

    // تغییر تب به نظرات من
    activeReviewTab.value = 'submitted'

  } catch (error) {
    console.error('Error submitting review:', error)
    showToast('خطا در ثبت نظر. لطفاً دوباره تلاش کنید.', 'ti ti-alert-circle')
  }
}

onMounted(async () => {
  currentUrl.value = window.location.href;
  fetchSessions();
  // ۱. دریافت داده‌هایی که وابستگی مستقیم به userId ندارند (یا استور خودش هندل می‌کند)
  await Promise.all([
    orderStore.fetchUserOrders(),
    reviewStore.fetchReviewsFromOrders(),
    addressStore.fetchUserAddresses(),
    walletStore.fetchWalletUser() // اگر این هم نیاز به userId دارد، بهتر است اینجا نباشد
  ])

  // بررسی نظرات معلق
  if (pendingReviews.value.length > 0) {
    activeSection.value = 'reviews'
    activeReviewTab.value = 'pending'
    await nextTick()
    openReviewModalForProduct(pendingReviews.value[0], {auto: true})
  }
})

// ۲. واچ کردن userId برای دریافت نوتیفیکیشن‌ها
watch(userId, async (newUserId) => {
  // فقط اگر userId مقدار دارد (یعنی یوزر لود شده)
  if (newUserId) {
    try {
      await notificationStore.fetchNotifications(newUserId, 'MARKET')
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }
}, {immediate: true})

const editReviewFromList = (review) => {

  reviewingProduct.value = {
    productName: review.productName,
    productImage: review.productImage,
    orderCode: review.orderCode,
    name: review.productName,
    _raw: review._raw
  }

  newReview.value = {
    orderId: review.orderId,
    productId: review.productId,
    rating: review.rating,
    title: review.title || '',
    text: review.text,
    pros: review.pros ? [...review.pros] : [],
    cons: review.cons ? [...review.cons] : [],
    recommend: true
  }

  showReviewModal.value = true
}

const deleteMarketReview = async (review) => {
  if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
    try {
      // ۱. حذف نظر از طریق استور (API و State اصلی)
      await reviewStore.deleteReview(review.id)

      // ۲. بررسی اینکه آیا این محصول قبلاً در لیست در انتظار نظر وجود دارد یا خیر
      // چون pendingReviews یک computed است، باید در reviews.value اصلی استور جستجو کنیم
      const isAlreadyPending = reviewStore.reviews.some(
          (r) => r.productId === review.productId &&
              r.orderId === review.orderId &&
              r.id.startsWith('temp_') // فقط آیتم‌های موقت (در انتظار نظر) را چک می‌کنیم
      )

      // ۳. اگر در لیست در انتظار نبود، آن را دوباره به آن لیست اضافه کن
      if (!isAlreadyPending) {
        // ساخت یک آیتم موقت برای افزودن به استور
        const pendingItem = {
          id: `temp_${Date.now()}`, // شناسه موقت
          productId: review.productId,
          orderId: review.orderId,
          tenantId: review.tenantId || "", // اگر موجود نیست
          userId: review.userId || "",     // اگر موجود نیست
          rating: 0,
          comment: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isApproved: false,
          product: {
            id: review.productId,
            name: review.productName,
            image: review.productImage || ""
          }
        }

        // افزودن به آرایه اصلی استور (computed خودکار آپدیت می‌شود)
        reviewStore.reviews.unshift(pendingItem)
      }

      showToast('نظر حذف شد', 'ti ti-trash')

    } catch (error) {
      console.error('Error deleting review:', error)
      showToast('خطا در حذف نظر', 'ti ti-alert-circle')
    }
  }
}
const deleteReview = deleteMarketReview

// Discounts (ثابت)
const newDiscountCode = ref('')
const discounts = computed(() => discountStore.discounts)
/*const discounts = ref([
  {
    id: 1,
    code: 'WELCOME20',
    description: 'تخفیف خوش‌آمدگویی برای اولین خرید',
    type: 'percent',
    value: 20,
    expireDate: '۳۰ آذر ۱۴۰۴',
    minPurchase: 500000,
    isExpired: false
  },
  {
    id: 2,
    code: 'PET50K',
    description: '۵۰ هزار تومان تخفیف خرید',
    type: 'amount',
    value: 50000,
    expireDate: '۱۵ دی ۱۴۰۴',
    minPurchase: 300000,
    isExpired: false
  },
  {
    id: 3,
    code: 'FREESHIP',
    description: 'ارسال رایگان',
    type: 'amount',
    value: 35000,
    expireDate: '۲۵ دی ۱۴۰۴',
    minPurchase: null,
    isExpired: false
  },
  {
    id: 4,
    code: 'SUMMER10',
    description: 'تخفیف تابستانه',
    type: 'percent',
    value: 10,
    expireDate: '۱ آذر ۱۴۰۴',
    minPurchase: 200000,
    isExpired: true
  },
])*/

const addDiscountCode = async () => {
  if (!newDiscountCode.value.trim()) {
    showToast('لطفاً کد تخفیف را وارد کنید', 'ti ti-alert-circle')
    return
  }

  try {
    // فراخوانی متد استور برای ثبت کد تخفیف
    await discountStore.claimDiscountCode(newDiscountCode.value)

    showToast('کد تخفیف با موفقیت اضافه شد', 'ti ti-check')
    newDiscountCode.value = ''
  } catch (error) {
    // مدیریت خطا (پیام خطا از سمت سرور یا پیام پیش‌فرض)
    const errorMessage = error.response?.data?.message || 'خطا در ثبت کد تخفیف'
    showToast(errorMessage, 'ti ti-alert-circle')
  }
}

const copyDiscountCode = (code) => {
  navigator.clipboard.writeText(code)
  showToast('کد تخفیف کپی شد', 'ti ti-copy')
}

// Add address modal
const showAddAddressModal = ref(false)
const newAddress = ref({
  title: '',
  province: '',
  city: '',
  address: {},
  plaque: '',
  unit: '',
  receiver: '',
  phone: '',
  isDefault: false
})

const addressData = ref({
  address: {},
  province: '',
  city: '',
  location: null
})
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'wallet') {
    activeSection.value = 'wallet'
  }
  // می‌توانید برای سایر تب‌ها هم شرط بگذارید، مثلا:
  // else if (newTab === 'orders') activeSection.value = 'orders'
}, {immediate: true})

watch(addressData, (newVal) => {
  if(newVal){
    const info = extractAddressInfo(newVal)
    newAddress.address = info.address
    newAddress.lat = info.lat
    newAddress.lng = info.lng
    newAddress.city = info.city
    newAddress.province = info.province
  }

}, {deep: true})

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
// Notification settings
const notificationSettings = ref([
  {
    id: 1,
    title: 'اعلان‌های سفارش',
    description: 'دریافت اعلان وضعیت سفارشات',
    enabled: authStore.userSetting?.orderNotifications
  },
  {
    id: 2,
    title: 'تخفیف‌ها و پیشنهادات',
    description: 'دریافت اعلان تخفیف‌های ویژه',
    enabled: authStore.userSetting?.discountNotifications
  },
  {
    id: 3,
    title: 'اعلان‌های پیامکی',
    description: 'دریافت پیامک برای سفارشات',
    enabled: authStore.userSetting?.smsNotifications
  },
  {id: 4, title: 'خبرنامه', description: 'دریافت ایمیل خبرنامه هفتگی', enabled: authStore.userSetting?.newsletter},
])
// نگاشت IDهای UI به نام فیلدهای دیتابیس
const settingFieldsMap = {
  1: 'orderNotifications',
  2: 'discountNotifications',
  3: 'smsNotifications',
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

// Security
const twoFactorEnabled = ref(false)

// Province and City options
const provinces = ['تهران', 'اصفهان', 'مشهد', 'شیراز', 'تبریز', 'کرج']
const citiesByProvince = {
  'تهران': ['تهران', 'شهریار', 'اسلامشهر'],
  'اصفهان': ['اصفهان', 'کاشان', 'نجف‌آباد'],
  'مشهد': ['مشهد', 'نیشابور', 'سبزوار'],
  'شیراز': ['شیراز', 'مرودشت'],
  'تبریز': ['تبریز', 'مراغه'],
  'کرج': ['کرج', 'مهرشهر'],
}
const availableCities = ref([])

const provinceOptions = computed(() => provinces.map(p => ({value: p, label: p})))
const cityOptions = computed(() => availableCities.value.map(c => ({value: c, label: c})))

const requests = computed(() => shopStore.requests.map((item) => {
  return {
    id: item.id,
    ownerName: item?.ownerName,
    phone: item?.phone,
    shopName: item?.shopName,
    type: item.type === 'MARKET' ? 'فروشگاه' : item.type,
    date: new Date(item?.createdAt).toLocaleDateString('fa-IR'),
    status: item?.status,
    province: item?.province,
    city: item?.city,
    documents: item?.documents,
    categories: item?.categories,
    iban: item?.iban,
    address: item?.address,
    message: item?.rejectionReason
  }
}))

const onProvinceChange = (value) => {
  newAddress.value.city = ''
  availableCities.value = citiesByProvince[value] || []
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

const saveAddress = async (newAddressData) => {
  if (!isAuthenticated.value) {
    if ($toast && typeof $toast === 'function') {
      $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    }
    window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;
    return;
  }

  if (!addressData.value || !addressData.value.address) {
    $toast('لطفاً ابتدا آدرس را روی نقشه انتخاب کنید', 'warning', 3000);
    return;
  }

  const rawAddressData = addressData.value.address || {};
  const fullAddressDetails = JSON.parse(JSON.stringify(rawAddressData));

  const completeAddressPayload = {
    display_name: fullAddressDetails.display_name || '',
    lat: parseFloat(fullAddressDetails.lat),
    lon: parseFloat(fullAddressDetails.lon),
    ...fullAddressDetails
  };

  const payload = {
    title: newAddressData.title || 'آدرس جدید',
    receiver: newAddressData.receiver || '',
    phone: newAddressData.phone || '',
    plaque: newAddressData.plaque || '',
    unit: newAddressData.unit || '',
    fullAddress: completeAddressPayload,
    isDefault: newAddressData.isDefault || false
  };

  try {
    if (editingAddressId.value) {
      // حالت ویرایش: آپدیت آدرس موجود
      await addressStore.updateUserAddress(editingAddressId.value, payload);
      $toast('آدرس با موفقیت ویرایش شد', 'success', 3000);
    } else {
      // حالت افزودن آدرس جدید
      await addressStore.addUserAddress(payload);
      $toast('آدرس جدید با موفقیت اضافه شد', 'success', 3000);
    }

    // بستن مودال و ریست کردن فرم
    showAddAddressModal.value = false;
    editingAddressId.value = null; // ریست کردن ID ویرایش

    newAddress.value = {
      title: '',
      province: '',
      city: '',
      address: {},
      plaque: '',
      unit: '',
      receiver: '',
      phone: '',
      isDefault: false
    };
    addressData.value = {
      address: {},
      province: '',
      city: '',
      location: null
    };

  } catch (error) {
    console.error('Error saving address:', error);
    $toast('خطا در ثبت آدرس', 'error', 3000);
  }
}

// متغیر کمکی برای ذخیره ID آدرسی که در حال ویرایش است
const editingAddressId = ref(null);

const editAddress = (address) => {
  // پر کردن فرم با اطلاعات آدرس انتخاب شده
  newAddress.value = {
    title: address.title || '',
    province: address.province || '',
    city: address.city || '',
    address: address.fullAddress || {}, // ساختار آدرس نقشه
    plaque: address.plaque || '',
    unit: address.unit || '',
    receiver: address.receiver || '',
    phone: address.phone || '',
    isDefault: address.isDefault || false
  };

  // ذخیره ID آدرس برای تشخیص در هنگام ذخیره
  editingAddressId.value = address.id;

  // باز کردن مودال
  showAddAddressModal.value = true;
}

const deleteAddress = async (address) => {
  if (confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
    try {
      // فراخوانی متد حذف از استور
      await addressStore.deleteUserAddress(address.id);
      $toast('آدرس با موفقیت حذف شد', 'success', 3000);
    } catch (error) {
      console.error('Error deleting address:', error);
      $toast('خطا در حذف آدرس', 'error', 3000);
    }
  }
}

const logout = () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    authStore.logout()
    router.push('/login')
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

// --- Wallet Data & Logic (از استور) ---
const walletBalance = computed(() => walletStore.wallet?.balance || 0)
const walletTransactions = computed(() => walletStore.wallet?.transactions.map((tx) => {
  return {
    type: tx.type,
    amount: tx.amount,
    date: new Date(tx.createdAt).toLocaleDateString('fa-IR'),
    title: tx.description || 'کسر بابت سفارش #1000'
  }

}) || [])

// --- متغیرهای مودال کیف پول ---
const showWalletModal = ref(false)
const walletAction = ref('increase') // 'increase' یا 'withdraw'
const walletAmount = ref('')
const walletLoading = ref(false)

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
        mobile: authStore.user?.phoneNumber || '09355851170', // شماره موبایل کاربر
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

// --- Helper Functions ---
const getStatusLabel = (status) => {
  switch (status) {
    case 'CUSTOMER_PENDING':
      return 'در انتظار پرداخت'
    case 'CUSTOMER_PAID':
      return 'پرداخت شده و در انتظار تایید'
    case 'TENANT_PROCESSING':
      return 'در حال پردازش'
    case 'TENANT_SHIPPED':
      return 'در حال ارسال'
    case 'CUSTOMER_DELIVERED':
      return 'تحویل داده شده'
    case 'CUSTOMER_CANCELLED':
      return 'لغو شده'
    default:
      return status
  }
}

// --- Edit Request Modal Logic ---
const showEditRequestModal = ref(false)
const showImagePreview = ref(false)
const showCategoryDropdown = ref(false)
const previewImageUrl = ref('')
const editingRequest = ref(null)

const editForm = ref({
  ownerName: '',
  phone: '',
  address: '',
  province: '',
  city: '',
  iban: '',
  categories: []
})

const previewImage = (url) => {
  if (url) {
    previewImageUrl.value = url
    showImagePreview.value = true
  }
}

const productCategories = [
  {value: 'food', label: 'غذا و تغذیه', icon: 'ti ti-bowl'},
  {value: 'accessories', label: 'لوازم جانبی', icon: 'ti ti-package'},
  {value: 'toys', label: 'اسباب‌بازی', icon: 'ti ti-ball-tennis'},
  {value: 'health', label: 'بهداشت و درمان', icon: 'ti ti-medical-cross'},
  {value: 'clothing', label: 'لباس و پوشاک', icon: 'ti ti-shirt'},
  {value: 'grooming', label: 'آرایشی', icon: 'ti ti-scissors'},
  {value: 'aquarium', label: 'آکواریوم', icon: 'ti ti-fish'},
  {value: 'birds', label: 'پرندگان', icon: 'ti ti-feather'},
  {value: 'other', label: 'سایر', icon: 'ti ti-dots'}
]

const openEditRequestModal = (req) => {
  const originalRequest = requests.value.find(r => r.id === req.id)

  if (originalRequest) {
    editingRequest.value = originalRequest

    const normalizedCategories = (originalRequest.categories || []).map(c => {
      return typeof c === 'string'
          ? productCategories.find(pc => pc.value === c) || {value: c, label: c, icon: 'ti ti-tag'}
          : c
    })

    editForm.value = {
      ownerName: originalRequest.ownerName || '',
      phone: originalRequest.phone || '',
      address: originalRequest.address.display_name || '',
      province: originalRequest.province || '',
      city: originalRequest.city || '',
      iban: originalRequest.iban || '',
      categories: normalizedCategories,
      documents: originalRequest.documents,
      status: originalRequest.status
    }
    localAddressText.value = editForm.value.address
    showEditRequestModal.value = true
  }
}

const closeEditRequestModal = () => {
  showEditRequestModal.value = false
  editingRequest.value = null
  showCategoryDropdown.value = false
  editForm.value = {
    ownerName: '', phone: '', address: '', province: '', city: '', iban: '',
    categories: [],
    documents: {logo: null, license: null, nationalId: null}
  }
}

const addCategory = (categoryObj) => {
  if (!editForm.value.categories.some(c => (c.value || c) === categoryObj.value)) {
    editForm.value.categories.push(categoryObj)
  }
  showCategoryDropdown.value = false
}

const removeCategory = (index) => {
  editForm.value.categories.splice(index, 1)
}

const isCategorySelected = (value) => {
  return editForm.value.categories.some(c => (c.value || c) === value)
}

const getCategoryIcon = (catValueOrObj) => {
  const val = typeof catValueOrObj === 'object' ? catValueOrObj.value : catValueOrObj
  const found = productCategories.find(c => c.value === val)
  return found ? found.icon : 'ti ti-tag'
}

// const handleFileUpload = (event, docType) => {
//   const file = event.target.files[0]
//   if (file) {
//     editForm.value.documents[docType] = file
//   }
// }

const getImageUrl = (fileOrUrl) => {
  if (!fileOrUrl) return '/placeholder-image.png'
  if (fileOrUrl instanceof File) {
    return URL.createObjectURL(fileOrUrl)
  }
  return resolveUrl(fileOrUrl)
}

const saveRequestEdit = async () => {
  if (!editingRequest.value) return

  try {
    const payload = {
      ...editForm.value,
      categories: editForm.value.categories.map(c => c.value || c),
    }

    //remove status
    const {status, ...reset} = payload

    const response = await shopStore.updateRequest(editingRequest.value.id, reset)

    showToast(response.message, 'ti ti-check')
    closeEditRequestModal()
  } catch (error) {
    console.error('Error updating request:', error)
    showToast('خطا در ویرایش درخواست', 'ti ti-alert-circle')
  }
}


const cancelOrder = async (order) => {
  // این متد باید در استور پیاده‌سازی شود
  await orderStore.updateOrderStatus(order.id)
  console.log('سفارش کنسل شد .', order.id)
  //alert('سفارش تایید شد')
  $toast('سفارش کنسل شد', 'success', 5000);
}

const trackStatus = async (activeOrderId) => {
  const status = await orderStore.checkAlopeykStatus(activeOrderId);
  if (status.errorMessage) {
    alert(status.errorMessage);
  } else {
    const label = orderStore.getAlopeykStatusLabel(status.alopeykStatus, status.progress);
    console.log("وضعیت فعلی:", label);
    console.log("نام پیک:", status.courierName);
  }
};

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

// تابع برای فرمت کردن وضعیت و توضیحات بیشتر
const updateStatusDetails = (statusData) => {
  const { alopeykStatus, progress } = statusData;
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

// کپی کردن کد رهگیری
const copyTrackingCode = (order) => {
  if (order.metadata?.alopeykOrderId) {
    navigator.clipboard.writeText(order.metadata.alopeykOrderId);
    $toast('کد رهگیری کپی شد','success',5000)
  }
};

// مشاهده در سایت الوپیک
const openAlopeykLink = () => {
  if (alopeykStatusData.value.trackingUrl) {
    window.open(alopeykStatusData.value.trackingUrl, '_blank');
  }
};

// توابع کمکی برای تاریخ (برای نمایش دمو در صورت نبود تاریخ در API)
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleDateString('fa-IR') + ' - ' + now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

const getRelativeTime = (hoursAgo) => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toLocaleDateString('fa-IR') + ' - ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

// Menu items
const menuItems = [
  {id: 'profile', icon: 'ti ti-user', label: 'اطلاعات شخصی'},
  {id: 'wallet', icon: 'ti ti-wallet', label: 'کیف پول'},
  {id: 'orders', icon: 'ti ti-shopping-bag', label: 'سفارش‌های من', badge: orderStore.orders.length},
  {id: 'reviews', icon: 'ti ti-star', label: 'نظرات من', badge: pendingReviews.value.length},
  {id: 'discounts', icon: 'ti ti-discount-2', label: 'تخفیفات من', badge: discounts.value.length},
  {id: 'addresses', icon: 'ti ti-map-pin', label: 'آدرس‌ها'},
  {id: 'requests', icon: 'ti ti-file-description', label: 'درخواست‌ها',badge: requests.value.length},
  {id: 'notifications', icon: 'ti ti-bell', label: 'اعلان‌ها', badge: notifications.value.length},
  {id: 'security', icon: 'ti ti-shield-check', label: 'امنیت'},
]
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

.ltr {
  direction: ltr;
}
</style>
