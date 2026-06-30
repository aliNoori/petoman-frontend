<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">مدیریت فروشگاه‌ها</h1>
        <p class="text-gray-500 mt-1">فروشگاه‌های فعال سیستم</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <i class="ti ti-file-spreadsheet text-green-600"></i>
          خروجی اکسل
        </button>
        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {{ activeMarkets.length }} فروشگاه فعال
        </span>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <i class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
              v-model="filters.search"
              type="text"
              placeholder="جستجو نام فروشگاه..."
              class="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <AppSelect
            v-model="filters.category"
            :options="categoryOptions"
            placeholder="همه دسته‌بندی‌ها"
        />
        <AppSelect
            v-model="filters.city"
            :options="cityOptions"
            placeholder="همه شهرها"
        />
      </div>
    </div>

    <!-- Markets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="market in filteredMarkets"
          :key="market.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Header with Store Icon -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
              <img v-if="market.logo" :src="market.logo" class="w-full h-full object-cover" alt="logo">
              <i v-else class="ti ti-building-store text-orange-600 text-2xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ market.name }}</h3>
              <p class="text-xs text-gray-500">{{ market.owner }}</p>
            </div>
          </div>

          <!-- Dropdown Actions -->
          <AppDropdown
              :items="getMarketActions(market)"
              @select="handleMarketAction($event, market)"
              position="bottom-end"
          >
            <template #trigger>
              <i class="ti ti-dots-vertical text-gray-500"></i>
            </template>
          </AppDropdown>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-3">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-map-pin"></i>
            <span>{{ market.city }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-phone"></i>
            <span class="font-mono">{{ market.phone }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-category"></i>
            <span>{{ market.category }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="ti ti-calendar"></i>
            <span>عضویت: {{ market.registerDate }}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="px-4 py-3 bg-gray-50 grid grid-cols-3 gap-2 text-center">
          <div>
            <p class="text-lg font-bold text-gray-900">{{ market.productsCount }}</p>
            <p class="text-xs text-gray-500">محصول</p>
          </div>
          <div>
            <p class="text-lg font-bold text-gray-900">{{ market.ordersCount }}</p>
            <p class="text-xs text-gray-500">سفارش</p>
          </div>
          <div>
            <p class="text-lg font-bold text-emerald-600">{{ market.rating }}</p>
            <p class="text-xs text-gray-500">امتیاز</p>
          </div>
        </div>

        <!-- Footer Status -->
        <div class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="market.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >
            {{ market.isSuspended ? 'محدود شده' : 'فعال' }}
          </span>
          <button
              @click="goToMarketDashboard(market)"
              class="text-sm text-orange-600 hover:underline flex items-center gap-1"
          >
            <i class="ti ti-external-link text-xs"></i>
            ورود به پنل
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredMarkets.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
        <i class="ti ti-building-store text-orange-500 text-2xl"></i>
      </div>
      <h3 class="font-bold text-gray-900 mb-2">فروشگاهی یافت نشد</h3>
      <p class="text-gray-500">فروشگاهی با این مشخصات وجود ندارد</p>
    </div>

    <!-- مودال تأیید محدودیت -->
    <div v-if="showSuspendModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showSuspendModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b border-gray-100">
          <h3 class="font-bold text-gray-900 text-lg">{{ selectedMarket?.isSuspended ? 'رفع محدودیت' : 'محدود کردن فروشگاه' }}</h3>
        </div>
        <div class="p-5">
          <div v-if="!selectedMarket?.isSuspended" class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div class="flex items-start gap-2">
              <i class="ti ti-alert-triangle text-amber-600 mt-0.5"></i>
              <p class="text-sm text-amber-700">
                با محدود کردن فروشگاه، تمام محصولات آن از دسترس خارج شده و امکان ثبت سفارش جدید وجود نخواهد داشت.
              </p>
            </div>
          </div>
          <div v-if="!selectedMarket?.isSuspended">
            <label class="block mb-2 font-medium text-gray-900">دلیل محدودیت</label>
            <textarea
                v-model="suspendReason"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="دلیل محدود کردن فروشگاه..."
            ></textarea>
          </div>
          <div v-else class="text-center py-4">
            <i class="ti ti-lock-open text-5xl text-green-500 mb-4"></i>
            <p class="text-gray-600">آیا از رفع محدودیت فروشگاه <span class="font-bold">{{ selectedMarket?.name }}</span> اطمینان دارید؟</p>
          </div>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showSuspendModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button
              @click="confirmSuspend"
              :class="selectedMarket?.isSuspended ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
              class="px-4 py-2 text-white rounded-lg flex items-center gap-2"
          >
            <i :class="selectedMarket?.isSuspended ? 'ti ti-lock-open' : 'ti ti-lock'"></i>
            {{ selectedMarket?.isSuspended ? 'رفع محدودیت' : 'محدود کردن' }}
          </button>
        </div>
      </div>
    </div>

    <!-- مودال جزئیات فروشگاه -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDetailsModal = false">
      <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
              <img v-if="selectedMarket?.logo" :src="selectedMarket.logo" class="w-full h-full object-cover" alt="logo">
              <i v-else class="ti ti-building-store text-orange-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ selectedMarket?.name }}</h3>
              <p class="text-sm text-gray-500">{{ selectedMarket?.owner }}</p>
            </div>
          </div>
          <button @click="showDetailsModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 px-5 shrink-0">
          <div class="flex gap-6">
            <button
                @click="detailsTab = 'info'"
                :class="['py-3 text-sm font-medium border-b-2 -mb-px transition-colors', detailsTab === 'info' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
            >
              <i class="ti ti-info-circle ml-1"></i>
              اطلاعات فروشگاه
            </button>
            <button
                @click="detailsTab = 'finance'"
                :class="['py-3 text-sm font-medium border-b-2 -mb-px transition-colors', detailsTab === 'finance' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
            >
              <i class="ti ti-chart-bar ml-1"></i>
              گزارش مالی
            </button>
            <button
                @click="detailsTab = 'reviews'"
                :class="['py-3 text-sm font-medium border-b-2 -mb-px transition-colors', detailsTab === 'reviews' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
            >
              <i class="ti ti-star ml-1"></i>
              امتیازات و نظرات
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-5">
          <!-- اطلاعات فروشگاه -->
          <div v-if="detailsTab === 'info'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- اطلاعات اصلی -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                <h4 class="font-bold text-gray-900 flex items-center gap-2">
                  <i class="ti ti-building-store text-orange-500"></i>
                  اطلاعات اصلی
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500">نام فروشگاه:</span>
                    <span class="font-medium text-gray-900">{{ selectedMarket?.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">مالک:</span>
                    <span class="font-medium text-gray-900">{{ selectedMarket?.owner }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">دسته‌بندی:</span>
                    <span class="font-medium text-gray-900">{{ selectedMarket?.category }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">تاریخ عضویت:</span>
                    <span class="font-medium text-gray-900">{{ selectedMarket?.registerDate }}</span>
                  </div>
                </div>
              </div>

              <!-- اطلاعات تماس -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                <h4 class="font-bold text-gray-900 flex items-center gap-2">
                  <i class="ti ti-phone text-blue-500"></i>
                  اطلاعات تماس
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500">شماره تماس:</span>
                    <span class="font-medium text-gray-900 font-mono">{{ selectedMarket?.phone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">ایمیل:</span>
                    <span class="font-medium text-gray-900 text-sm">{{ selectedMarket?.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">شهر:</span>
                    <span class="font-medium text-gray-900">{{ selectedMarket?.city }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-gray-500">آدرس:</span>
                    <span class="font-medium text-gray-900 text-sm text-right">{{ selectedMarket?.address.displayName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- آمار کلی -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ selectedMarket?.productsCount }}</p>
                <p class="text-sm text-blue-700 mt-1">محصول فعال</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-green-600">{{ selectedMarket?.ordersCount }}</p>
                <p class="text-sm text-green-700 mt-1">سفارش</p>
              </div>
              <div class="bg-amber-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-amber-600">{{ selectedMarket?.rating }}</p>
                <p class="text-sm text-amber-700 mt-1">امتیاز</p>
              </div>
              <div class="bg-purple-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-purple-600">{{ selectedMarket?.reviewsCount }}</p>
                <p class="text-sm text-purple-700 mt-1">نظر</p>
              </div>
            </div>

            <!-- وضعیت -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-3">
                <div :class="['w-3 h-3 rounded-full', selectedMarket?.isSuspended ? 'bg-red-500' : 'bg-green-500']"></div>
                <span class="font-medium text-gray-900">{{ selectedMarket?.isSuspended ? 'محدود شده' : 'فعال' }}</span>
              </div>
              <button
                  @click="showDetailsModal = false; openSuspendModal(selectedMarket)"
                  :class="['px-4 py-2 rounded-lg text-sm font-medium', selectedMarket?.isSuspended ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200']"
              >
                {{ selectedMarket?.isSuspended ? 'رفع محدودیت' : 'محدود کردن' }}
              </button>
            </div>
          </div>

          <!-- گزارش مالی -->
          <div v-if="detailsTab === 'finance'" class="space-y-6">
            <!-- خلاصه مالی -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-green-600">موجودی کیف پول</p>
                    <p class="text-2xl font-bold text-green-700 mt-1">{{ formatCurrency(selectedMarket?.walletBalance) }}</p>
                    <p class="text-xs text-green-500 mt-1">تومان</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <i class="ti ti-wallet text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-blue-600">کل فروش (تایید شده)</p>
                    <p class="text-2xl font-bold text-blue-700 mt-1">{{ formatCurrency(selectedMarket?.totalSales) }}</p>
                    <p class="text-xs text-blue-500 mt-1">تومان</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i class="ti ti-chart-pie text-blue-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-amber-600">سفارشات موفق</p>
                    <p class="text-2xl font-bold text-amber-700 mt-1">{{ selectedMarket?.completedOrdersCount }}</p>
                    <p class="text-xs text-amber-500 mt-1">عدد</p>
                  </div>
                  <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <i class="ti ti-shopping-cart text-amber-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- تراکنش‌های اخیر -->
            <div class="bg-gray-50 rounded-xl p-4">
              <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-list text-gray-500"></i>
                تراکنش‌های اخیر کیف پول
              </h4>
              <div v-if="selectedMarket?.transactions && selectedMarket.transactions.length > 0" class="space-y-3">
                <div v-for="txn in selectedMarket.transactions.slice(0, 5)" :key="txn.id" class="bg-white rounded-lg p-3 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', txn.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100']">
                      <i :class="['ti', txn.type === 'CREDIT' ? 'ti-arrow-down-right text-green-600' : 'ti-arrow-up-left text-red-600']"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 text-sm">{{ txn.description }}</p>
                      <p class="text-xs text-gray-500">{{ new Date(txn.createdAt).toLocaleDateString('fa-IR') }}</p>
                    </div>
                  </div>
                  <p :class="['font-bold text-sm', txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600']">
                    {{ txn.type === 'CREDIT' ? '+' : '-' }}{{ formatCurrency(txn.amount) }}
                  </p>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                تراکنشی ثبت نشده است
              </div>
            </div>
          </div>

          <!-- امتیازات و نظرات -->
          <div v-if="detailsTab === 'reviews'" class="space-y-6">
            <!-- خلاصه امتیازات -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-8">
                <!-- امتیاز کلی -->
                <div class="text-center shrink-0">
                  <p class="text-5xl font-bold text-amber-600">{{ selectedMarket?.rating || '0.0' }}</p>
                  <div class="flex items-center justify-center gap-1 mt-2">
                    <i v-for="n in 5" :key="n"
                       :class="['ti ti-star-filled text-lg', n <= Math.floor(selectedMarket?.rating || 0) ? 'text-amber-500' : 'text-gray-300']">
                    </i>
                  </div>
                  <p class="text-sm text-amber-700 mt-2">
                    از {{ selectedMarket?.reviewsCount || 0 }} نظر
                  </p>
                </div>
                <!-- نمودار میله‌ای امتیازات -->
                <div class="flex-1 space-y-2">
                  <template v-for="star in 5" :key="star">
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-600 w-8">{{ 6 - star }}</span>
                      <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full transition-all duration-500"
                             :style="{ width: getRatingPercentage(6 - star) + '%' }">
                        </div>
                      </div>
                      <span class="text-sm text-gray-500 w-10">{{ getRatingCount(6 - star) }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- لیست نظرات -->
            <div class="space-y-4">
              <h4 class="font-bold text-gray-900">نظرات اخیر</h4>
              <!-- حالت خالی -->
              <div v-if="!selectedMarket?.reviews || selectedMarket.reviews.length === 0"
                   class="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <i class="ti ti-message-off text-4xl text-gray-300 mb-2"></i>
                <p class="text-gray-500">هنوز نظری برای این فروشگاه ثبت نشده است.</p>
              </div>
              <!-- لیست -->
              <div v-else v-for="review in selectedMarket.reviews" :key="review.id"
                   class="bg-white border border-gray-200 rounded-xl p-4 transition-shadow hover:shadow-md">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                      {{ (review.userId || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">کاربر</p>
                      <p class="text-xs text-gray-500">{{ new Date(review.createdAt).toLocaleDateString('fa-IR') }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <i v-for="n in 5" :key="n"
                       :class="['ti ti-star-filled text-sm', n <= review.rating ? 'text-amber-500' : 'ti ti-star text-gray-300']">
                    </i>
                  </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">{{ review.comment }}</p>
                <!-- پاسخ فروشگاه -->
                <div v-if="review.reply" class="mt-3 pr-4 border-r-2 border-orange-300 bg-orange-50/50 py-2 rounded-r-lg">
                  <p class="text-xs text-orange-700 font-bold mb-1 flex items-center gap-1">
                    <i class="ti ti-brand-telegram"></i> پاسخ فروشگاه:
                  </p>
                  <p class="text-sm text-gray-800">{{ review.reply }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <button @click="goToMarketDashboard(selectedMarket)" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
            <i class="ti ti-external-link"></i>
            ورود به پنل فروشگاه
          </button>
          <button @click="showDetailsModal = false" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            بستن
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-70">
        <div :class="[
          'px-5 py-3 rounded-xl shadow-lg flex items-center gap-3',
          toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]">
          <i :class="toastType === 'success' ? 'ti ti-check text-xl' : 'ti ti-x text-xl'"></i>
          <span class="font-medium">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppDropdown from '@/components/AppDropdown.vue'
import AppSelect from '@/components/AppSelect.vue'
import { useRequestShopStore } from "@/stores/market/request-shop.js";
import {useTenantStore} from "@/stores/tenant.js";

const router = useRouter()
const requestShopStore = useRequestShopStore()

// State
const filters = ref({ search: '', category: '', city: '' })
const showSuspendModal = ref(false)
const showDetailsModal = ref(false)
const detailsTab = ref('info')
const selectedMarket = ref(null)
const suspendReason = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Helper: Format Currency
const formatCurrency = (value) => {
  if (!value) return '۰'
  return Number(value).toLocaleString('fa-IR')
}

// Helper: Get Market Reviews (Real Data)
const getMarketReviews = (tenant) => {
  if (!tenant.reviews || tenant.reviews.length === 0) {
    return []
  }
  return tenant.reviews.map(review => ({
    id: review.id,
    user: 'کاربر', // Since user object isn't fully detailed in JSON, default to User
    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString('fa-IR') : '-',
    rating: review.rating || 0,
    comment: review.comment || '',
    reply: review.reply || null
  })).sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Helper: Rating Percentage
const getRatingPercentage = (starValue) => {
  if (!selectedMarket.value?.reviews) return 0
  const total = selectedMarket.value.reviews.length
  if (total === 0) return 0
  const count = selectedMarket.value.reviews.filter(r => Math.round(r.rating) === starValue).length
  return Math.round((count / total) * 100)
}

// Helper: Rating Count
const getRatingCount = (starValue) => {
  if (!selectedMarket.value?.reviews) return 0
  return selectedMarket.value.reviews.filter(r => Math.round(r.rating) === starValue).length
}

// Filter Options
const categoryOptions = [
  { value: '', label: 'همه دسته‌بندی‌ها', icon: 'ti ti-list' },
  { value: 'pet-shop', label: 'پت‌شاپ', icon: 'ti ti-building-store', iconColor: 'text-orange-500' },
  { value: 'food', label: 'غذای حیوانات', icon: 'ti ti-bowl', iconColor: 'text-green-500' },
  { value: 'accessories', label: 'لوازم جانبی', icon: 'ti ti-box', iconColor: 'text-purple-500' }
]

const cityOptions = [
  { value: '', label: 'همه شهرها', icon: 'ti ti-map-pin' },
  { value: 'tehran', label: 'تهران', icon: 'ti ti-map-pin', iconColor: 'text-blue-500' },
  { value: 'mashhad', label: 'مشهد', icon: 'ti ti-map-pin', iconColor: 'text-green-500' },
  { value: 'isfahan', label: 'اصفهان', icon: 'ti ti-map-pin', iconColor: 'text-orange-500' },
  { value: 'shirvan', label: 'شیروان', icon: 'ti ti-map-pin', iconColor: 'text-gray-500' }
]
const tenantStore = useTenantStore()
const rawMarkets = computed(() => tenantStore.markets || [])
// Processed Markets Data
const markets = computed(() => {

  return rawMarkets.value.map(tenant => {
    // Calculate Products
    const productsCount = tenant.marketProducts ? tenant.marketProducts.length : 0

    // Calculate Orders
    const ordersCount = tenant.orders ? tenant.orders.length : 0

    // Calculate Reviews
    const reviewsCount = tenant.reviews ? tenant.reviews.length : 0

    // Calculate Financials
    const walletBalance = tenant.wallet?.balance || 0
    const transactions = tenant.wallet?.transactions || []

    // Calculate Total Sales (Sum of orders with status PAID, SHIPPED, DELIVERED)
    const completedOrders = tenant.orders ? tenant.orders.filter(o =>
        ['CUSTOMER_PAID', 'TENANT_PROCESSING', 'TENANT_SHIPPED', 'DELIVERED'].includes(o.status)
    ) : []

    const totalSales = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    // Format Categories
    const category = tenant.categories && tenant.categories.length > 0
        ? tenant.categories.join('، ')
        : '-'

    return {
      id: tenant.id,
      name: tenant.name,
      owner: tenant.ownerName || '-',
      ownerUserId:tenant.ownerUserId,
      phone: tenant.phone,
      email: tenant.email,
      address: tenant.tenantAddress,
      city: tenant.city || '-',
      category: category,
      registerDate: tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString('fa-IR') : '-',
      productsCount: productsCount,
      ordersCount: ordersCount,
      reviewsCount: reviewsCount,
      rating: tenant.rating || '0',
      isSuspended:tenant.isSuspended, //tenant.status !== 'active',
      logo: tenant.documents?.logo?.thumbnail || null,

      // Financial Data for Details Modal
      walletBalance: walletBalance,
      totalSales: totalSales,
      completedOrdersCount: completedOrders.length,
      transactions: transactions,

      // Nested Data for Details Modal
      reviews: tenant.reviews || [],
      originalData: tenant
    }
  })
})

// Active Markets Count
const activeMarkets = computed(() => markets.value.filter(m => !m.isSuspended))

// Filter Logic
const filteredMarkets = computed(() => {
  return markets.value.filter(m => {
    if (filters.value.search && !m.name.includes(filters.value.search) && !m.owner.includes(filters.value.search)) return false
    // Simple category filter check (can be improved for multiple categories)
    if (filters.value.category && !m.category.includes(filters.value.category)) return false
    if (filters.value.city && !m.city.includes(filters.value.city === 'tehran' ? 'تهران' : filters.value.city === 'mashhad' ? 'مشهد' : filters.value.city === 'shirvan' ? 'شیروان' : 'اصفهان')) return false
    return true
  })
})

// Actions
const getMarketActions = (market) => {
  const actions = [
    { label: 'مشاهده جزئیات', icon: 'ti ti-eye', action: 'view' },
    { label: 'ورود به داشبورد', icon: 'ti ti-external-link', action: 'dashboard' },
    { divider: true },
  ]

  if (market.isSuspended) {
    actions.push({ label: 'رفع محدودیت', icon: 'ti ti-lock-open', action: 'unsuspend', success: true })
  } else {
    actions.push({ label: 'محدود کردن', icon: 'ti ti-lock', action: 'suspend', danger: true })
  }

  return actions
}

const handleMarketAction = (action, market) => {
  switch (action) {
    case 'view':
      viewMarket(market)
      break
    case 'dashboard':
      goToMarketDashboard(market)
      break
    case 'suspend':
    case 'unsuspend':
      openSuspendModal(market)
      break
  }
}
const goToMarketDashboard = (market) => {
  // اصلاح ساختار URL: پارامتر اول با ? و پارامتر دوم با & جدا می‌شود
  const admin_panel_type='MARKET'
  const url = `/markets?token=${localStorage.getItem('auth_token')}&tenantId=${market.id}&admin_panel_type=${admin_panel_type}`;

  window.open(
      url,
      'MarketDashboardWindow', // نام پنجره (اگر باز باشد همان را فوکوس می‌کند)
      'width=1200,height=800,top=100,left=100,resizable=yes,scrollbars=yes'
  )
  showToastMessage(`در حال ورود به پنل ${market.name}...`);
};

const viewMarket = (market) => {
  selectedMarket.value = market
  detailsTab.value = 'info'
  showDetailsModal.value = true
}

const openSuspendModal = (market) => {
  selectedMarket.value = market
  suspendReason.value = ''
  showSuspendModal.value = true
}

const confirmSuspend = async () => {

  try {
    // ارسال وضعیت معکوس به سرور (اگر true است false می‌فرستیم و برعکس)
    const newStatus = !selectedMarket.value.isSuspended;

    await requestShopStore.toggleSuspend(selectedMarket.value.id, newStatus);

    // نمایش پیام موفقیت
    if (newStatus) {
      showToastMessage(`${selectedMarket.value.name} محدود شد`, 'error');
    } else {
      showToastMessage(`محدودیت ${selectedMarket.value.name} برداشته شد`);
    }

    showSuspendModal.value = false;
  } catch (error) {
    // مدیریت خطا (مثلاً اگر سرور پاسخ نداد)
    console.error(error);
    showToastMessage('عملیات با خطا مواجه شد', 'error');
  }
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const exportToExcel = () => {
  const data = filteredMarkets.value.map(market => ({
    'نام فروشگاه': market.name,
    'مالک': market.owner,
    'شماره موبایل': market.phone,
    'شهر': market.city,
    'دسته‌بندی': market.category,
    'امتیاز': market.rating,
    'تعداد محصولات': market.productsCount,
    'تعداد سفارشات': market.ordersCount,
    'موجودی کیف پول': market.walletBalance,
    'وضعیت': market.isSuspended ? 'محدود شده' : 'فعال'
  }))

  if (data.length === 0) {
    showToastMessage('داده‌ای برای خروجی وجود ندارد', 'error')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
        headers.map(h => {
          let val = row[h]
          if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
            val = `"${val.replace(/"/g, '""')}"`
          }
          return val
        }).join(',')
    )
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `فروشگاه‌ها-${new Date().toLocaleDateString('fa-IR')}.csv`
  link.click()
  URL.revokeObjectURL(link.href)

  showToastMessage('خروجی اکسل با موفقیت دانلود شد')
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>