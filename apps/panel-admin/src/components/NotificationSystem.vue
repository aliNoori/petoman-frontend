<template>
  <div class="space-y-4 pb-20 lg:pb-6">

    <!-- ==================== HEADER ==================== -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div class="flex items-center justify-between gap-3">

        <div class="flex items-center gap-3">
          <div
              class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <i class="ti ti-shopping-bag text-white text-xl"></i>
          </div>

          <div>
            <h2 class="font-bold text-gray-900 text-base">
              مدیریت محصولات
            </h2>

            <p class="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {{ products.length }} محصول ثبت شده
            </p>
          </div>
        </div>

        <!-- ==================== NOTIFICATION BUTTON ==================== -->
        <div
            class="relative"
            v-click-outside="closeNotificationPanel"
        >
          <button
              @click="toggleNotificationPanel"
              :class="[
              'relative p-3 rounded-xl transition-all group',
              unreadCount > 0
                ? 'bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 ring-2 ring-orange-200'
                : 'bg-gray-50 hover:bg-gray-100'
            ]"
          >
            <i
                :class="[
                'text-2xl transition-transform',
                unreadCount > 0
                  ? 'ti ti-bell-ringing-2 text-orange-600 animate-wiggle'
                  : 'ti ti-bell text-gray-600'
              ]"
            ></i>

            <!-- Badge -->
            <transition name="badge">
              <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 ring-2 ring-white"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </transition>

            <!-- Critical pulse -->
            <span
                v-if="criticalCount > 0"
                class="absolute inset-0 rounded-xl bg-red-400 opacity-50 animate-ping"
            ></span>
          </button>

          <!-- ==================== NOTIFICATION PANEL ==================== -->
          <transition name="dropdown">
            <div
                v-if="showNotificationPanel"
                class="fixed lg:absolute top-20 lg:top-full left-4 right-4 lg:left-auto lg:right-0 mt-2 lg:translate-x-110 lg:w-[440px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-50 max-h-[calc(100vh-100px)] flex flex-col overflow-hidden"
            >

              <!-- Panel Header -->
              <div
                  class="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-5 py-4 text-white overflow-hidden"
              >

                <div class="absolute inset-0 opacity-20">
                  <div class="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300 rounded-full blur-2xl"></div>
                </div>

                <div class="relative flex items-center justify-between mb-3">

                  <div class="flex items-center gap-2.5">
                    <div
                        class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"
                    >
                      <i class="ti ti-bell-ringing text-xl"></i>
                    </div>

                    <div>
                      <h3 class="font-bold text-lg leading-tight">
                        اعلان‌ها
                      </h3>

                      <p class="text-white/80 text-xs">
                        {{ unreadCount }} پیام خوانده نشده
                      </p>
                    </div>
                  </div>

                  <button
                      v-if="unreadCount > 0"
                      @click="markAllAsRead"
                      class="text-xs px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-medium transition-all flex items-center gap-1"
                  >
                    <i class="ti ti-check-double"></i>
                    همه را خواندم
                  </button>

                </div>

                <!-- Tabs -->
                <div class="relative flex gap-1 -mx-1 px-1">

                  <button
                      v-for="tab in notificationTabs"
                      :key="tab.key"
                      @click="activeTab = tab.key"
                      :class="[
                      'flex-1 px-2 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5',
                      activeTab === tab.key
                        ? 'bg-white text-blue-700 shadow-md'
                        : 'text-white/80 hover:bg-white/10'
                    ]"
                  >
                    <i :class="tab.icon"></i>

                    <span>
                      {{ tab.label }}
                    </span>

                    <span
                        v-if="getTabCount(tab.key) > 0"
                        :class="[
                        'px-1.5 py-0.5 rounded-full text-[9px] font-extrabold',
                        activeTab === tab.key
                          ? 'bg-red-500 text-white'
                          : 'bg-white/30 text-white'
                      ]"
                    >
                      {{ getTabCount(tab.key) }}
                    </span>
                  </button>

                </div>
              </div>

              <!-- Notification List -->
              <div class="flex-1 overflow-y-auto custom-scrollbar">

                <transition-group name="notif-list">

                  <div
                      v-for="notification in filteredNotifications"
                      :key="notification.id"
                      @click="handleNotificationClick(notification)"
                      :class="[
                      'group relative p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent',
                      !notification.isRead &&
                        'bg-gradient-to-r from-blue-50/60 via-blue-50/30 to-transparent'
                    ]"
                  >

                    <!-- Unread indicator -->
                    <span
                        v-if="!notification.isRead"
                        class="absolute top-5 right-4 w-2.5 h-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 ring-2 ring-white"
                    ></span>

                    <div class="flex gap-3 pr-5">

                      <!-- Image -->
                      <div class="relative flex-shrink-0">

                        <div
                            :class="[
                            'w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shadow-md',
                            getNotificationBg(notification.type)
                          ]"
                        >

                          <img
                              v-if="notification.productImage"
                              :src="notification.productImage"
                              :alt="notification.productName"
                              class="w-full h-full object-cover"
                          />

                          <i
                              v-else
                              :class="[
                              getNotificationIcon(notification.type),
                              'text-2xl text-white drop-shadow'
                            ]"
                          ></i>

                        </div>

                        <!-- Critical indicator -->
                        <span
                            v-if="notification.urgency === 'critical'"
                            class="absolute -top-1 -right-1 flex h-3 w-3"
                        >
                          <span
                              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                          ></span>

                          <span
                              class="relative inline-flex rounded-full h-3 w-3 bg-red-500 ring-2 ring-white"
                          ></span>
                        </span>

                      </div>

                      <!-- Content -->
                      <div class="flex-1 min-w-0">

                        <div class="flex items-start justify-between gap-2 mb-1">

                          <p class="font-bold text-gray-900 text-sm leading-snug">
                            {{ notification.title }}
                          </p>

                          <span class="text-[10px] text-gray-400 whitespace-nowrap font-medium">
                            {{ formatTimeAgo(notification.timestamp) }}
                          </span>

                        </div>

                        <p class="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">
                          {{ notification.message }}
                        </p>

                        <!-- Actions -->
                        <div
                            class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        >

                          <button
                              v-if="!notification.isRead"
                              @click.stop="markAsRead(notification)"
                              class="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                          >
                            <i class="ti ti-check"></i>
                            خواندم
                          </button>

                          <button
                              @click.stop="dismissNotification(notification)"
                              class="text-[10px] text-gray-400 hover:text-red-500 font-bold flex items-center gap-1"
                          >
                            <i class="ti ti-trash"></i>
                            حذف
                          </button>

                          <button
                              v-if="notification.productId"
                              @click.stop="goToProduct(notification.productId)"
                              class="text-[10px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
                          >
                            <i class="ti ti-arrow-left"></i>
                            مشاهده محصول
                          </button>

                        </div>

                      </div>

                    </div>

                    <!-- Urgency bar -->
                    <div
                        :class="[
                        'absolute left-0 top-0 bottom-0 w-1',
                        getUrgencyGradient(notification.urgency)
                      ]"
                    ></div>

                  </div>

                </transition-group>

                <!-- Empty -->
                <div
                    v-if="filteredNotifications.length === 0"
                    class="p-10 text-center"
                >
                  <div class="relative w-24 h-24 mx-auto mb-4">

                    <div
                        class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full"
                    ></div>

                    <div class="absolute inset-0 flex items-center justify-center">
                      <i class="ti ti-bell-off text-5xl text-gray-300"></i>
                    </div>

                  </div>

                  <p class="text-gray-700 font-bold mb-1">
                    اعلانی وجود ندارد
                  </p>

                  <p class="text-xs text-gray-400">
                    در این دسته اعلان جدیدی ندارید
                  </p>
                </div>

              </div>

              <!-- Footer -->
              <div
                  class="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 flex items-center justify-between"
              >

                <button
                    @click="clearAllNotifications"
                    class="text-xs text-gray-500 hover:text-red-500 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <i class="ti ti-trash"></i>
                  پاک کردن همه
                </button>

                <button
                    @click="openSettings"
                    class="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <i class="ti ti-settings"></i>
                  تنظیمات اعلان‌ها
                </button>

              </div>

            </div>
          </transition>

        </div>

      </div>
    </div>

    <!-- ==================== TOASTS ==================== -->

    <Teleport to="body">

      <div
          class="fixed top-4 left-4 right-4 lg:left-auto lg:right-6 lg:top-6 lg:w-[380px] z-[100] space-y-3 pointer-events-none"
      >

        <transition-group
            name="toast"
            tag="div"
            class="space-y-3"
        >

          <div
              v-for="toast in toasts"
              :key="toast.id"
              :class="[
              'relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden pointer-events-auto',
              getToastBorderClass(toast.urgency)
            ]"
          >

            <div class="flex items-start gap-3 p-4">

              <div
                  :class="[
                  'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg',
                  getToastIconBg(toast.type)
                ]"
              >
                <i
                    :class="[
                    getNotificationIcon(toast.type),
                    'text-2xl text-white drop-shadow'
                  ]"
                ></i>
              </div>

              <div class="flex-1 min-w-0">

                <div class="flex items-start justify-between gap-2 mb-0.5">

                  <p class="font-extrabold text-gray-900 text-sm">
                    {{ toast.title }}
                  </p>

                  <button
                      @click="dismissToast(toast.id)"
                      class="text-gray-400 hover:text-gray-700 transition-colors -mt-1"
                  >
                    <i class="ti ti-x text-lg"></i>
                  </button>

                </div>

                <p class="text-xs text-gray-600 leading-relaxed">
                  {{ toast.message }}
                </p>

                <button
                    v-if="toast.productId"
                    @click="handleToastAction(toast)"
                    class="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  مشاهده محصول
                  <i class="ti ti-arrow-left"></i>
                </button>

              </div>

            </div>

            <!-- Progress -->
            <div class="h-1 bg-gray-100 overflow-hidden">

              <div
                  :class="[
                  'h-full transition-all ease-linear',
                  getToastProgressColor(toast.urgency)
                ]"
                  :style="{
                  width: toast.progress + '%',
                  transitionDuration: '100ms'
                }"
              ></div>

            </div>

          </div>

        </transition-group>

      </div>

    </Teleport>

    <!-- ==================== SETTINGS MODAL ==================== -->

    <Teleport to="body">

      <transition name="modal">

        <div
            v-if="showSettingsModal"
            @click.self="showSettingsModal = false"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4"
        >

          <div
              class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >

            <!-- Header -->
            <div
                class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white"
            >

              <div class="flex items-center gap-3">
                <i class="ti ti-settings text-2xl"></i>

                <h3 class="font-bold text-lg">
                  تنظیمات اعلان‌ها
                </h3>
              </div>

              <button
                  @click="showSettingsModal = false"
                  class="hover:bg-white/20 rounded-lg p-1.5"
              >
                <i class="ti ti-x text-xl"></i>
              </button>

            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">

              <!-- Enable -->
              <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >

                <div>
                  <p class="font-bold text-gray-900 text-sm">
                    اعلان‌ها فعال باشند
                  </p>

                  <p class="text-xs text-gray-500">
                    دریافت همه اعلان‌ها
                  </p>
                </div>

                <label class="relative inline-flex items-center cursor-pointer">

                  <input
                      type="checkbox"
                      v-model="settings.enabled"
                      class="sr-only peer"
                  />

                  <div
                      class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>

                </label>

              </div>

              <!-- Types -->
              <div class="space-y-3">

                <p class="text-xs font-bold text-gray-500 uppercase">
                  نوع اعلان‌ها
                </p>

                <div
                    v-for="(setting, key) in settings.types"
                    :key="key"
                    class="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                >

                  <div class="flex items-center gap-3">

                    <div
                        :class="[
                        'w-9 h-9 rounded-lg flex items-center justify-center',
                        setting.bgClass
                      ]"
                    >
                      <i :class="[setting.icon, setting.iconColor]"></i>
                    </div>

                    <div>

                      <p class="font-bold text-gray-900 text-sm">
                        {{ setting.label }}
                      </p>

                      <p class="text-xs text-gray-500">
                        {{ setting.description }}
                      </p>

                    </div>

                  </div>

                  <label class="relative inline-flex items-center cursor-pointer">

                    <input
                        type="checkbox"
                        v-model="setting.enabled"
                        class="sr-only peer"
                    />

                    <div
                        class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>

                  </label>

                </div>

              </div>

              <!-- Expiry threshold -->
              <div class="space-y-2">

                <p class="text-xs font-bold text-gray-500 uppercase">
                  هشدار انقضا
                </p>

                <div class="grid grid-cols-3 gap-2">

                  <button
                      v-for="days in expiryDayOptions"
                      :key="days"
                      @click="settings.expiryDaysThreshold = days"
                      :class="[
                      'py-2 rounded-lg font-bold text-sm transition-all',
                      settings.expiryDaysThreshold === days
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    {{ days }} روز
                  </button>

                </div>

              </div>

              <!-- Sound -->
              <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >

                <div class="flex items-center gap-3">

                  <i class="ti ti-volume text-xl text-gray-600"></i>

                  <div>

                    <p class="font-bold text-gray-900 text-sm">
                      صدای اعلان
                    </p>

                    <p class="text-xs text-gray-500">
                      پخش صدا هنگام دریافت
                    </p>

                  </div>

                </div>

                <label class="relative inline-flex items-center cursor-pointer">

                  <input
                      type="checkbox"
                      v-model="settings.soundEnabled"
                      class="sr-only peer"
                  />

                  <div
                      class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>

                </label>

              </div>

            </div>

            <!-- Footer -->
            <div
                class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end"
            >

              <button
                  @click="showSettingsModal = false"
                  class="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-all border-2 border-gray-200 text-sm"
              >
                انصراف
              </button>

              <button
                  @click="saveSettings"
                  class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 text-sm flex items-center gap-1.5"
              >
                <i class="ti ti-device-floppy"></i>
                ذخیره تنظیمات
              </button>

            </div>

          </div>

        </div>

      </transition>

    </Teleport>

  </div>
</template>

<script>
export default {
  name: 'ProductNotifications',

  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  emits: ['view-product'],

  data() {
    return {
      notifications: [],
      toasts: [],

      showNotificationPanel: false,
      showSettingsModal: false,

      activeTab: 'all',

      previousStocks: {},
      stockAlertLocks: {},

      dismissedKeys: new Set(),

      expiryDayOptions: [1, 3, 5, 7, 14, 30],

      audioContext: null,

      checkInterval: null,

      settings: {
        enabled: true,

        soundEnabled: false,

        expiryDaysThreshold: 7,

        types: {
          stock: {
            enabled: true,
            label: 'موجود شدن محصول',
            description: 'وقتی محصول ناموجود، موجود شد',
            icon: 'ti ti-package-import',
            iconColor: 'text-green-600',
            bgClass: 'bg-green-100'
          },

          expiry: {
            enabled: true,
            label: 'تاریخ انقضا',
            description: 'هشدار قبل از انقضای محصول',
            icon: 'ti ti-alarm',
            iconColor: 'text-orange-600',
            bgClass: 'bg-orange-100'
          },

          discount: {
            enabled: true,
            label: 'پایان تخفیف',
            description: 'هشدار قبل از اتمام تخفیف',
            icon: 'ti ti-tag',
            iconColor: 'text-purple-600',
            bgClass: 'bg-purple-100'
          }
        }
      },

      notificationTabs: [
        {
          key: 'all',
          label: 'همه',
          icon: 'ti ti-list'
        },

        {
          key: 'stock',
          label: 'موجودی',
          icon: 'ti ti-package'
        },

        {
          key: 'expiry',
          label: 'انقضا',
          icon: 'ti ti-alarm'
        },

        {
          key: 'discount',
          label: 'تخفیف',
          icon: 'ti ti-tag'
        }
      ]
    };
  },

  computed: {
    unreadCount() {
      return this.notifications.filter(
          notification => !notification.isRead
      ).length;
    },

    criticalCount() {
      return this.notifications.filter(
          notification =>
              !notification.isRead &&
              notification.urgency === 'critical'
      ).length;
    },

    filteredNotifications() {
      if (this.activeTab === 'all') {
        return this.notifications;
      }

      return this.notifications.filter(
          notification =>
              notification.category === this.activeTab
      );
    }
  },

  watch: {
    products: {
      deep: true,

      handler(newProducts) {

        this.checkProductAlerts(newProducts);
      }
    }
  },

  mounted() {
    this.loadSettings();

    this.loadDismissedKeys();

    this.loadPreviousStocks();

    this.loadStockAlertLocks();

    this.checkProductAlerts(this.products);

    this.checkInterval = setInterval(() => {
      this.checkProductAlerts(this.products);
    }, 30000);

    this.setupAudioUnlock();
  },

  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    if (this.audioContext) {
      this.audioContext.close();
    }
  },

  methods: {
    // =====================================================
    // PRODUCT ALERTS
    // =====================================================

    checkProductAlerts(products) {
      if (!this.settings.enabled) {
        return;
      }

      if (!Array.isArray(products)) {
        return;
      }

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      products.forEach(product => {
        this.checkStockAlert(product);

        if (
            product.expiryDate &&
            this.settings.types.expiry.enabled
        ) {
          this.checkExpiryAlert(product, today);
        }

        if (
            product.hasDiscount === true &&
            product.discountEndDate &&
            this.settings.types.discount.enabled
        ) {
          this.checkDiscountAlert(product, today);
        }
      });

      this.saveDismissedKeys();
    },

    // =====================================================
    // STOCK
    // =====================================================

    checkStockAlert(product) {
      if (!this.settings.types.stock.enabled) {
        return;
      }

      if (!product || !product.id) {
        return;
      }

      const productId = product.id;

      const currentStock = Number(
          product.stock ?? 0
      );

      const previousStock =
          this.previousStocks[productId];

      /*
       * اولین بار که محصول دیده می‌شود.
       *
       * در این مرحله اعلان نمی‌دهیم،
       * چون هنوز تغییر واقعی نداریم.
       */
      if (previousStock === undefined) {
        this.previousStocks[productId] =
            currentStock;

        this.savePreviousStocks();

        return;
      }

      /*
       * فقط انتقال واقعی زیر اعلان می‌دهد:
       *
       * 0 -> عدد مثبت
       */
      const becameAvailable =
          previousStock === 0 &&
          currentStock > 0;

      if (becameAvailable) {
        const alertKey =
            `${previousStock}->${currentStock}`;

        const lastAlertKey =
            this.stockAlertLocks[productId];

        /*
         * اگر همین انتقال قبلاً پردازش نشده،
         * اعلان ایجاد می‌کنیم.
         */
        if (lastAlertKey !== alertKey) {
          this.addNotification({
            type: 'stock_available',

            category: 'stock',

            productId: product.id,

            productName: product.name,

            productImage: product.image,

            title: 'محصول موجود شد! 🎉',

            message:
                `محصول «${product.name}» با موجودی ` +
                `${this.toPersianNumber(currentStock)} ` +
                `عدد دوباره در دسترس قرار گرفت.`,

            urgency: 'high'
          });

          /*
           * ثبت آخرین انتقالی که برای آن اعلان ساخته شد
           */
          this.stockAlertLocks[productId] =
              alertKey;

          this.saveStockAlertLocks();
        }
      }

      /*
       * بسیار مهم:
       *
       * موجودی فعلی همیشه تبدیل به موجودی قبلی بعدی می‌شود.
       */
      this.previousStocks[productId] =
          currentStock;

      this.savePreviousStocks();
    },

    // =====================================================
    // EXPIRY
    // =====================================================

    checkExpiryAlert(product, today) {
      const expiryDate =
          this.parseDateOnly(
              product.expiryDate
          );

      if (!expiryDate) {
        return;
      }

      const diffDays =
          this.getDaysDifference(
              today,
              expiryDate
          );

      const uniqueKey =
          `expiry_${product.id}_${diffDays}_${this.getDateKey(today)}`;

      if (
          this.dismissedKeys.has(uniqueKey)
      ) {
        return;
      }

      if (diffDays < 0) {
        this.addNotification({
          type: 'expired',

          category: 'expiry',

          productId: product.id,

          productName: product.name,

          productImage: product.image,

          title: 'محصول منقضی شد! 🚨',

          message:
              `محصول «${product.name}» ` +
              `${this.toPersianNumber(
                  Math.abs(diffDays)
              )} روز پیش منقضی شده است.`,

          urgency: 'critical'
        });

        this.dismissedKeys.add(uniqueKey);

        return;
      }

      if (diffDays === 0) {
        this.addNotification({
          type: 'expiring_today',

          category: 'expiry',

          productId: product.id,

          productName: product.name,

          productImage: product.image,

          title: 'تاریخ انقضا امروز است! ⚠️',

          message:
              `محصول «${product.name}» امروز ` +
              `منقضی می‌شود.`,

          urgency: 'critical'
        });

        this.dismissedKeys.add(uniqueKey);

        return;
      }

      if (
          diffDays <=
          this.settings.expiryDaysThreshold
      ) {
        let urgency = 'medium';

        if (diffDays <= 2) {
          urgency = 'critical';
        } else if (diffDays <= 5) {
          urgency = 'high';
        }

        this.addNotification({
          type: 'expiring_soon',

          category: 'expiry',

          productId: product.id,

          productName: product.name,

          productImage: product.image,

          title: 'تاریخ انقضا نزدیک است ⏰',

          message:
              `محصول «${product.name}» ` +
              `${this.toPersianNumber(diffDays)} ` +
              `روز دیگر منقضی می‌شود.`,

          urgency
        });

        this.dismissedKeys.add(uniqueKey);
      }
    },

    // =====================================================
    // DISCOUNT
    // =====================================================

    checkDiscountAlert(product, today) {
      if (
          product.hasDiscount !== true ||
          !product.discountEndDate
      ) {
        return;
      }

      const discountEndDate =
          this.parseDateOnly(
              product.discountEndDate
          );

      if (!discountEndDate) {
        return;
      }

      const diffDays =
          this.getDaysDifference(
              today,
              discountEndDate
          );

      const uniqueKey =
          `discount_${product.id}_${diffDays}_${this.getDateKey(today)}`;

      if (
          this.dismissedKeys.has(uniqueKey)
      ) {
        return;
      }

      const discountValue =
          Number(
              product.discountValue || 0
          );

      if (diffDays < 0) {
        this.addNotification({
          type: 'discount_ended',

          category: 'discount',

          productId: product.id,

          productName: product.name,

          productImage: product.image,

          title: 'تخفیف به پایان رسید 💔',

          message:
              `تخفیف ${this.toPersianNumber(
                  discountValue
              )}٪ محصول «${product.name}» ` +
              `به پایان رسیده است.`,

          urgency: 'low'
        });

        this.dismissedKeys.add(uniqueKey);

        return;
      }

      if (diffDays === 0) {
        this.addNotification({
          type: 'discount_ending_today',

          category: 'discount',

          productId: product.id,

          productName: product.name,

          productImage: product.image,

          title: 'آخرین روز تخفیف! 🔥',

          message:
              `تخفیف ${this.toPersianNumber(
                  discountValue
              )}٪ محصول «${product.name}» ` +
              `امروز تمام می‌شود.`,

          urgency: 'high'
        });

        this.dismissedKeys.add(uniqueKey);

        return;
      }

      if (diffDays <= 3) {
        const urgency =
            diffDays === 1
                ? 'high'
                : 'medium';

        this.addNotification({
          type: 'discount_ending',

          category: 'discount',

          productId: product.id,

          productName: product.name,

          productImage: product.image,

          title: 'تخفیف رو به پایان است! 💰',

          message:
              `تخفیف ${this.toPersianNumber(
                  discountValue
              )}٪ محصول «${product.name}» ` +
              `${this.toPersianNumber(diffDays)} ` +
              `روز دیگر به پایان می‌رسد.`,

          urgency
        });

        this.dismissedKeys.add(uniqueKey);
      }
    },

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    addNotification(data) {
      const notification = {
        id:
            `${Date.now()}_${Math.random()}`,

        timestamp: new Date(),

        isRead: false,

        ...data
      };

      this.notifications.unshift(
          notification
      );

      if (
          this.notifications.length > 50
      ) {
        this.notifications =
            this.notifications.slice(0, 50);
      }

      if (
          notification.urgency === 'high' ||
          notification.urgency === 'critical'
      ) {
        this.showToast(notification);
      }

      if (
          this.settings.soundEnabled
      ) {
        this.playNotificationSound(
            notification.urgency
        );
      }
    },

    showToast(notification) {
      const toast = {
        id:
            `${Date.now()}_${Math.random()}`,

        ...notification,

        progress: 100
      };

      this.toasts.push(toast);

      if (this.toasts.length > 3) {
        this.toasts.shift();
      }

      const duration =
          notification.urgency === 'critical'
              ? 8000
              : 5000;

      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed =
            Date.now() - startTime;

        toast.progress =
            Math.max(
                0,
                100 -
                (elapsed / duration) *
                100
            );

        if (
            toast.progress <= 0
        ) {
          clearInterval(interval);

          this.dismissToast(
              toast.id
          );
        }
      }, 100);
    },

    dismissToast(id) {
      const index =
          this.toasts.findIndex(
              toast => toast.id === id
          );

      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },

    handleToastAction(toast) {
      if (toast.productId) {
        this.goToProduct(
            toast.productId
        );
      }

      this.dismissToast(toast.id);
    },

    toggleNotificationPanel() {
      this.showNotificationPanel =
          !this.showNotificationPanel;
    },

    closeNotificationPanel() {
      this.showNotificationPanel = false;
    },

    handleNotificationClick(
        notification
    ) {
      if (!notification.isRead) {
        this.markAsRead(
            notification
        );
      }
    },

    markAsRead(notification) {
      notification.isRead = true;
    },

    markAllAsRead() {
      this.notifications.forEach(
          notification => {
            notification.isRead = true;
          }
      );
    },

    dismissNotification(
        notification
    ) {
      const index =
          this.notifications.findIndex(
              item =>
                  item.id === notification.id
          );

      if (index !== -1) {
        this.notifications.splice(
            index,
            1
        );
      }
    },

    clearAllNotifications() {
      if (
          confirm(
              'آیا از پاک کردن همه اعلان‌ها مطمئن هستید؟'
          )
      ) {
        this.notifications = [];
      }
    },

    goToProduct(productId) {
      const product =
          this.products.find(
              product =>
                  product.id === productId
          );

      if (product) {
        this.$emit(
            'view-product',
            product
        );
      }

      this.closeNotificationPanel();
    },

    // =====================================================
    // SETTINGS
    // =====================================================

    openSettings() {
      this.showSettingsModal = true;

      this.closeNotificationPanel();
    },

    saveSettings() {
      localStorage.setItem(
          'notification_settings',
          JSON.stringify(
              this.settings
          )
      );

      this.showSettingsModal = false;

      if (this.$toast?.success) {
        this.$toast.success(
            'تنظیمات اعلان‌ها ذخیره شد'
        );
      }
    },

    loadSettings() {
      const saved =
          localStorage.getItem(
              'notification_settings'
          );

      if (!saved) {
        return;
      }

      try {
        const parsed =
            JSON.parse(saved);

        this.settings = {
          ...this.settings,

          ...parsed,

          types: {
            ...this.settings.types,

            ...(parsed.types || {})
          }
        };
      } catch (error) {
        console.error(
            'خطا در بارگذاری تنظیمات اعلان‌ها:',
            error
        );
      }
    },

    // =====================================================
    // PREVIOUS STOCKS
    // =====================================================

    loadPreviousStocks() {
      const saved =
          localStorage.getItem(
              'previous_product_stocks'
          );

      if (!saved) {
        return;
      }

      try {
        this.previousStocks =
            JSON.parse(saved);
      } catch (error) {
        console.error(
            'خطا در بارگذاری موجودی قبلی:',
            error
        );

        this.previousStocks = {};
      }
    },

    savePreviousStocks() {
      localStorage.setItem(
          'previous_product_stocks',
          JSON.stringify(
              this.previousStocks
          )
      );
    },

    // =====================================================
    // STOCK ALERT LOCKS
    // =====================================================

    loadStockAlertLocks() {
      const saved =
          localStorage.getItem(
              'stock_alert_locks'
          );

      if (!saved) {
        return;
      }

      try {
        this.stockAlertLocks =
            JSON.parse(saved);
      } catch (error) {
        console.error(
            'خطا در بارگذاری قفل اعلان موجودی:',
            error
        );

        this.stockAlertLocks = {};
      }
    },

    saveStockAlertLocks() {
      localStorage.setItem(
          'stock_alert_locks',
          JSON.stringify(
              this.stockAlertLocks
          )
      );
    },

    // =====================================================
    // DISMISSED KEYS
    // =====================================================

    loadDismissedKeys() {
      const saved =
          localStorage.getItem(
              'dismissed_notif_keys'
          );

      if (!saved) {
        return;
      }

      try {
        this.dismissedKeys =
            new Set(
                JSON.parse(saved)
            );
      } catch (error) {
        console.error(
            'خطا در بارگذاری کلیدهای اعلان:',
            error
        );

        this.dismissedKeys =
            new Set();
      }
    },

    saveDismissedKeys() {
      const keys =
          Array.from(
              this.dismissedKeys
          ).slice(-500);

      localStorage.setItem(
          'dismissed_notif_keys',
          JSON.stringify(keys)
      );
    },

    // =====================================================
    // DATE HELPERS
    // =====================================================

    parseDateOnly(dateValue) {
      if (!dateValue) {
        return null;
      }

      let date;

      // اگر مقدار ISO کامل است
      if (
          typeof dateValue === 'string' &&
          dateValue.includes('T')
      ) {
        date = new Date(dateValue);
      }

      // اگر فقط تاریخ است: YYYY-MM-DD
      else if (
          typeof dateValue === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
      ) {
        const [year, month, day] =
            dateValue.split('-').map(Number);

        date = new Date(
            year,
            month - 1,
            day
        );
      }

      else {
        date = new Date(dateValue);
      }

      if (
          Number.isNaN(date.getTime())
      ) {
        return null;
      }

      date.setHours(
          0,
          0,
          0,
          0
      );

      return date;
    },

    getDaysDifference(
        fromDate,
        toDate
    ) {
      const millisecondsPerDay =
          1000 *
          60 *
          60 *
          24;

      return Math.ceil(
          (toDate - fromDate) /
          millisecondsPerDay
      );
    },

    getDateKey(date) {
      return [
        date.getFullYear(),

        String(
            date.getMonth() + 1
        ).padStart(2, '0'),

        String(
            date.getDate()
        ).padStart(2, '0')
      ].join('-');
    },

    // =====================================================
    // UI HELPERS
    // =====================================================

    getNotificationIcon(type) {
      const icons = {
        stock_available:
            'ti ti-package-import',

        expiring_today:
            'ti ti-clock-exclamation',

        expiring_soon:
            'ti ti-alarm',

        expired:
            'ti ti-alert-octagon',

        discount_ending:
            'ti ti-discount',

        discount_ending_today:
            'ti ti-flame',

        discount_ended:
            'ti ti-tag-off'
      };

      return (
          icons[type] ||
          'ti ti-bell'
      );
    },

    getNotificationBg(type) {
      const backgrounds = {
        stock_available:
            'bg-gradient-to-br from-green-400 to-emerald-600',

        expiring_today:
            'bg-gradient-to-br from-amber-400 to-orange-500',

        expiring_soon:
            'bg-gradient-to-br from-orange-400 to-red-500',

        expired:
            'bg-gradient-to-br from-red-500 to-rose-600',

        discount_ending:
            'bg-gradient-to-br from-purple-400 to-fuchsia-600',

        discount_ending_today:
            'bg-gradient-to-br from-pink-500 to-rose-600',

        discount_ended:
            'bg-gradient-to-br from-gray-400 to-gray-600'
      };

      return (
          backgrounds[type] ||
          'bg-gradient-to-br from-blue-400 to-blue-600'
      );
    },

    getUrgencyGradient(urgency) {
      const gradients = {
        low:
            'bg-gradient-to-b from-gray-300 to-gray-400',

        medium:
            'bg-gradient-to-b from-yellow-400 to-amber-500',

        high:
            'bg-gradient-to-b from-orange-500 to-red-500',

        critical:
            'bg-gradient-to-b from-red-600 to-rose-700'
      };

      return (
          gradients[urgency] ||
          'bg-gray-300'
      );
    },

    getToastIconBg(type) {
      return this.getNotificationBg(
          type
      );
    },

    getToastBorderClass(urgency) {
      const classes = {
        low:
            'border-r-4 border-r-gray-400',

        medium:
            'border-r-4 border-r-yellow-400',

        high:
            'border-r-4 border-r-orange-500',

        critical:
            'border-r-4 border-r-red-500 animate-pulse-border'
      };

      return classes[urgency] || '';
    },

    getToastProgressColor(urgency) {
      const colors = {
        low:
            'bg-gradient-to-r from-gray-400 to-gray-500',

        medium:
            'bg-gradient-to-r from-yellow-400 to-amber-500',

        high:
            'bg-gradient-to-r from-orange-500 to-red-500',

        critical:
            'bg-gradient-to-r from-red-500 to-rose-600'
      };

      return (
          colors[urgency] ||
          'bg-blue-500'
      );
    },

    getTabCount(key) {
      if (key === 'all') {
        return this.unreadCount;
      }

      return this.notifications.filter(
          notification =>
              notification.category === key &&
              !notification.isRead
      ).length;
    },

    toPersianNumber(value) {
      const persianNumbers = [
        '۰',
        '۱',
        '۲',
        '۳',
        '۴',
        '۵',
        '۶',
        '۷',
        '۸',
        '۹'
      ];

      return String(value).replace(
          /\d/g,
          digit =>
              persianNumbers[digit]
      );
    },

    formatTimeAgo(date) {
      const timestamp =
          date instanceof Date
              ? date
              : new Date(date);

      const now = new Date();

      const seconds =
          Math.floor(
              (now - timestamp) /
              1000
          );

      if (seconds < 60) {
        return 'هم اکنون';
      }

      if (seconds < 3600) {
        return `${this.toPersianNumber(
            Math.floor(
                seconds / 60
            )
        )} دقیقه پیش`;
      }

      if (seconds < 86400) {
        return `${this.toPersianNumber(
            Math.floor(
                seconds / 3600
            )
        )} ساعت پیش`;
      }

      if (seconds < 604800) {
        return `${this.toPersianNumber(
            Math.floor(
                seconds / 86400
            )
        )} روز پیش`;
      }

      return timestamp.toLocaleDateString(
          'fa-IR'
      );
    },

    // =====================================================
    // AUDIO
    // =====================================================

    setupAudioUnlock() {
      const unlock = async () => {
        try {
          if (!this.audioContext) {
            this.audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();
          }

          if (
              this.audioContext.state ===
              'suspended'
          ) {
            await this.audioContext.resume();
          }

          document.removeEventListener(
              'click',
              unlock
          );

          document.removeEventListener(
              'keydown',
              unlock
          );

          document.removeEventListener(
              'touchstart',
              unlock
          );
        } catch (error) {
          console.warn(
              'AudioContext unlock failed:',
              error
          );
        }
      };

      document.addEventListener(
          'click',
          unlock,
          { once: true }
      );

      document.addEventListener(
          'keydown',
          unlock,
          { once: true }
      );

      document.addEventListener(
          'touchstart',
          unlock,
          { once: true }
      );
    },

    async playNotificationSound(
        urgency
    ) {
      if (
          !this.settings.soundEnabled
      ) {
        return;
      }

      try {
        if (!this.audioContext) {
          this.audioContext =
              new (
                  window.AudioContext ||
                  window.webkitAudioContext
              )();
        }

        if (
            this.audioContext.state ===
            'suspended'
        ) {
          await this.audioContext.resume();
        }

        const soundConfig = {
          critical: {
            freq: 880,
            duration: 0.15,
            gap: 0.05,
            repeat: 4,
            type: 'square',
            volume: 0.15
          },

          high: {
            freq: 660,
            duration: 0.2,
            gap: 0.1,
            repeat: 2,
            type: 'sine',
            volume: 0.1
          },

          medium: {
            freq: 523,
            duration: 0.2,
            gap: 0,
            repeat: 1,
            type: 'sine',
            volume: 0.08
          },

          low: {
            freq: 392,
            duration: 0.2,
            gap: 0,
            repeat: 1,
            type: 'sine',
            volume: 0.05
          }
        };

        const config =
            soundConfig[urgency] ||
            soundConfig.medium;

        const now =
            this.audioContext.currentTime;

        for (
            let i = 0;
            i < config.repeat;
            i++
        ) {
          const startTime =
              now +
              i *
              (
                  config.duration +
                  config.gap
              );

          const oscillator =
              this.audioContext
                  .createOscillator();

          const gain =
              this.audioContext
                  .createGain();

          oscillator.type =
              config.type;

          oscillator.frequency.value =
              config.freq;

          gain.gain.setValueAtTime(
              0,
              startTime
          );

          gain.gain.linearRampToValueAtTime(
              config.volume,
              startTime + 0.01
          );

          gain.gain.exponentialRampToValueAtTime(
              0.001,
              startTime +
              config.duration
          );

          oscillator.connect(gain);

          gain.connect(
              this.audioContext.destination
          );

          oscillator.start(startTime);

          oscillator.stop(
              startTime +
              config.duration
          );
        }
      } catch (error) {
        console.warn(
            'Notification sound failed:',
            error
        );
      }
    }
  },

  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside =
            event => {
              if (
                  !(
                      el === event.target ||
                      el.contains(
                          event.target
                      )
                  )
              ) {
                binding.value(event);
              }
            };

        document.addEventListener(
            'click',
            el._clickOutside
        );
      },

      unmounted(el) {
        document.removeEventListener(
            'click',
            el._clickOutside
        );
      }
    }
  }
};
</script>


<style scoped>
/* ==================== ANIMATIONS ==================== */

@keyframes wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-10deg);
  }

  75% {
    transform: rotate(10deg);
  }
}

@keyframes pulse-border {
  0%,
  100% {
    border-color: rgba(239, 68, 68, 1);
  }

  50% {
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out infinite;
  transform-origin: top center;
}

.animate-pulse-border {
  animation: pulse-border 1.5s ease-in-out infinite;
}

/* ==================== TRANSITIONS ==================== */

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(120%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(120%);
}

.toast-move {
  transition: transform 0.3s ease;
}

.badge-enter-active,
.badge-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.badge-enter-from,
.badge-leave-to {
  transform: scale(0);
}

.notif-list-enter-active,
.notif-list-leave-active {
  transition: all 0.4s ease;
}

.notif-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.notif-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notif-list-move {
  transition: transform 0.4s ease;
}

/* ==================== SCROLLBAR ==================== */

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>