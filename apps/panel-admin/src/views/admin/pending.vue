<template>
  <div class="space-y-6 pb-24 md:pb-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">موارد در انتظار تایید</h1>
        <p class="text-gray-500 mt-1">بررسی و تایید درخواست‌های جدید</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
          {{ totalPending }} مورد در انتظار
        </span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 p-1.5">
      <div class="flex flex-wrap gap-1">
        <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="activeTab === tab.key ? tab.activeClass : 'text-gray-600 hover:bg-gray-100'"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
          <span
              v-if="tab.count > 0"
              class="px-1.5 py-0.5 rounded-full text-xs"
              :class="activeTab === tab.key ? 'bg-white/30' : 'bg-gray-200'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- داروخانه‌ها در انتظار -->
    <div v-if="activeTab === 'pharmacies'" class="space-y-4">
      <div v-for="item in pendingPharmacies" :key="item.id"
           class="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300">
        <!-- هدر کارت -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                 :class="getStatusIconBg(item.status)">
              <i class="ti ti-pill text-2xl transition-colors" :class="getStatusIconColor(item.status)"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.manager }} • {{ item.city }}</p>
            </div>
          </div>
          <!-- نشانگر وضعیت -->
          <span class="px-3 py-1 rounded-full text-sm font-medium border"
                :class="getStatusBadgeClass(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
        </div>

        <!-- جزئیات -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره تماس</p>
            <p class="font-medium text-gray-900 font-mono">{{ item.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">آدرس</p>
            <p class="font-medium text-gray-900 text-sm">{{ item.address }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره مجوز</p>
            <p class="font-medium text-gray-900 font-mono">{{ item.description }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">مدارک</p>
            <button @click="openDetails('pharmacy', item)"
                    class="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <i class="ti ti-file-download"></i>
              مشاهده مدارک
            </button>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <!-- پیام وضعیت تایید شده -->
          <div v-if="item.status === 'approved'" class="flex items-center gap-2 text-green-600 font-medium">
            <i class="ti ti-circle-check-filled"></i>
            داروخانه تایید و فعال شده است
          </div>
          <div v-else-if="item.status === 'rejected'" class="flex items-center gap-2 text-red-600 font-medium">
            <i class="ti ti-circle-x-filled"></i>
            داروخانه مورد نظر تایید نشد
          </div>
          <!-- دکمه‌ها برای وضعیت‌های دیگر -->
          <template v-else>
            <!-- دکمه نیاز به ویرایش -->
            <button
                @click="requestEdit('pharmacy', item)"
                class="px-4 py-2 border rounded-lg flex items-center gap-2 transition-all"
                :class="[
                  item.status === 'needs_revision'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                    : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                ]">
              <i class="ti ti-pencil"></i>
              نیاز به ویرایش
            </button>
            <!-- دکمه رد درخواست -->
            <button
                @click="rejectItem('pharmacy', item)"
                class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-all">
              <i class="ti ti-x"></i>
              رد درخواست
            </button>
            <!-- دکمه تایید -->
            <button
                @click="approveItem('pharmacy', item)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm"
                :class="{ 'opacity-50 cursor-not-allowed': item.status === 'needs_revision' }"
                :disabled="item.status === 'needs_revision'">
              <i class="ti ti-check"></i>
              تایید و فعال‌سازی
            </button>
          </template>
        </div>
      </div>

      <div v-if="pendingPharmacies.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">داروخانه‌ای در انتظار تایید نیست</p>
      </div>
    </div>

    <!-- کلینیک‌ها در انتظار -->
    <div v-if="activeTab === 'clinics'" class="space-y-4">
      <div v-for="item in pendingClinics" :key="item.id"
           class="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300">
        <!-- هدر کارت -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                 :class="getStatusIconBg(item.status)">
              <i class="ti ti-building-hospital text-2xl transition-colors"
                 :class="getStatusIconColor(item.status)"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.manager }} • {{ item.city }}</p>
            </div>
          </div>
          <!-- نشانگر وضعیت -->
          <span class="px-3 py-1 rounded-full text-sm font-medium border"
                :class="getStatusBadgeClass(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
        </div>

        <!-- جزئیات -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره تماس</p>
            <p class="font-medium text-gray-900 font-mono">{{ item.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">آدرس</p>
            <p class="font-medium text-gray-900 text-sm">{{ item.address }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">توضیحات تکمیلی</p>
            <p class="font-medium text-gray-900">{{ item.description }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">مدارک</p>
            <button @click="openDetails('clinic', item)"
                    class="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <i class="ti ti-file-download"></i>
              مشاهده مدارک
            </button>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <!-- پیام وضعیت تایید شده -->
          <div v-if="item.status === 'approved'" class="flex items-center gap-2 text-green-600 font-medium">
            <i class="ti ti-circle-check-filled"></i>
            کلینیک تایید و فعال شده است
          </div>
          <div v-else-if="item.status === 'rejected'" class="flex items-center gap-2 text-red-600 font-medium">
            <i class="ti ti-circle-x-filled"></i>
            کلینیک مورد نظر تایید نشد
          </div>
          <!-- دکمه‌ها برای وضعیت‌های دیگر -->
          <template v-else>
            <!-- دکمه نیاز به ویرایش -->
            <button
                @click="requestEdit('clinic', item)"
                class="px-4 py-2 border rounded-lg flex items-center gap-2 transition-all"
                :class="[
                  item.status === 'needs_revision'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                    : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                ]">
              <i class="ti ti-pencil"></i>
              نیاز به ویرایش
            </button>
            <!-- دکمه رد درخواست -->
            <button
                @click="rejectItem('clinic', item)"
                class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-all">
              <i class="ti ti-x"></i>
              رد درخواست
            </button>
            <!-- دکمه تایید -->
            <button
                @click="approveItem('clinic', item)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm"
                :class="{ 'opacity-50 cursor-not-allowed': item.status === 'needs_revision' }"
                :disabled="item.status === 'needs_revision'">
              <i class="ti ti-check"></i>
              تایید و فعال‌سازی
            </button>
          </template>
        </div>
      </div>

      <div v-if="pendingClinics.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">کلینیکی در انتظار تایید نیست</p>
      </div>
    </div>

    <!-- دامپزشکان در انتظار -->
    <div v-if="activeTab === 'vets'" class="space-y-4">
      <div v-for="item in pendingVets" :key="item.id"
           class="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300">
        <!-- هدر کارت -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
                 :class="getStatusIconBg(item.status)">
              <span class="font-bold text-xl transition-colors"
                    :class="getStatusIconColor(item.status)">{{ item.name.charAt(0) }}</span>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.specialty }} • {{ item.city }}</p>
            </div>
          </div>
          <!-- نشانگر وضعیت -->
          <span class="px-3 py-1 rounded-full text-sm font-medium border"
                :class="getStatusBadgeClass(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
        </div>

        <!-- جزئیات -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره موبایل</p>
            <p class="font-medium text-gray-900 font-mono">{{ item.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">سابفه کار</p>
            <p class="font-medium text-gray-900 font-mono">{{ item.experience }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">توضیحات تکمیلی</p>
            <p class="font-medium text-gray-900 text-sm">{{ item.description }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">مدارک</p>
            <button @click="openDetails('vet', item)"
                    class="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <i class="ti ti-file-download"></i>
              مشاهده مدارک
            </button>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <!-- پیام وضعیت تایید شده -->
          <div v-if="item.status === 'approved'" class="flex items-center gap-2 text-green-600 font-medium">
            <i class="ti ti-circle-check-filled"></i>
            دامپزشک تایید و فعال شده است
          </div>
          <div v-else-if="item.status === 'rejected'" class="flex items-center gap-2 text-red-600 font-medium">
            <i class="ti ti-circle-x-filled"></i>
            دامپزشک مورد نظر تایید نشد
          </div>
          <!-- دکمه‌ها برای وضعیت‌های دیگر -->
          <template v-else>
            <!-- دکمه نیاز به ویرایش -->
            <button
                @click="requestEdit('vet', item)"
                class="px-4 py-2 border rounded-lg flex items-center gap-2 transition-all"
                :class="[
                  item.status === 'needs_revision'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                    : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                ]">
              <i class="ti ti-pencil"></i>
              نیاز به ویرایش
            </button>
            <!-- دکمه رد درخواست -->
            <button
                @click="rejectItem('vet', item)"
                class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-all">
              <i class="ti ti-x"></i>
              رد درخواست
            </button>
            <!-- دکمه تایید -->
            <button
                @click="approveItem('vet', item)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm"
                :class="{ 'opacity-50 cursor-not-allowed': item.status === 'needs_revision' }"
                :disabled="item.status === 'needs_revision'">
              <i class="ti ti-check"></i>
              تایید و فعال‌سازی
            </button>
          </template>
        </div>
      </div>

      <div v-if="pendingVets.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">دامپزشکی در انتظار تایید نیست</p>
      </div>
    </div>

    <!-- فروشگاه‌ها در انتظار -->
    <div v-if="activeTab === 'markets'" class="space-y-4">
      <div v-for="item in pendingMarkets" :key="item.id"
           class="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300">
        <!-- هدر کارت -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                 :class="getStatusIconBg(item.status)">
              <i class="ti ti-building-store text-2xl transition-colors"
                 :class="getStatusIconColor(item.status)"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.owner }} • {{ item.city }}</p>
            </div>
          </div>
          <!-- نشانگر وضعیت -->
          <span class="px-3 py-1 rounded-full text-sm font-medium border"
                :class="getStatusBadgeClass(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
        </div>

        <!-- جزئیات -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره تماس</p>
            <p class="font-medium text-gray-900 font-mono">{{ item.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">آدرس</p>
            <p class="font-medium text-gray-900 text-sm truncate">{{ item.address }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">دسته‌بندی</p>
            <p class="font-medium text-gray-900">{{ item.category }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">مدارک</p>
            <button @click="openDetails('market', item)"
                    class="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <i class="ti ti-file-download"></i>
              مشاهده مدارک
            </button>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <!-- پیام وضعیت تایید شده -->
          <div v-if="item.status === 'approved'" class="flex items-center gap-2 text-green-600 font-medium">
            <i class="ti ti-circle-check-filled"></i>
            فروشگاه تایید و فعال شده است
          </div>
          <div v-else-if="item.status === 'rejected'" class="flex items-center gap-2 text-red-600 font-medium">
            <i class="ti ti-circle-check-filled"></i>
            فروشگاه مورد نظر تایید نشده است
          </div>
          <!-- دکمه‌ها برای وضعیت‌های دیگر -->
          <template v-else>
            <!-- دکمه نیاز به ویرایش -->
            <button
                @click="requestEdit('market', item)"
                class="px-4 py-2 border rounded-lg flex items-center gap-2 transition-all"
                :class="[
                  item.status === 'needs_revision'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                    : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                ]">
              <i class="ti ti-pencil"></i>
              نیاز به ویرایش
            </button>
            <!-- دکمه رد درخواست -->
            <button
                @click="rejectItem('market', item)"
                class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-all">
              <i class="ti ti-x"></i>
              رد درخواست
            </button>
            <!-- دکمه تایید -->
            <button
                @click="approveItem('market', item)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm"
                :class="{ 'opacity-50 cursor-not-allowed': item.status === 'needs_revision' }"
                :disabled="item.status === 'needs_revision'">
              <i class="ti ti-check"></i>
              تایید و فعال‌سازی
            </button>
          </template>
        </div>
      </div>

      <!-- حالت خالی بودن لیست -->
      <div v-if="pendingMarkets.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">فروشگاهی در انتظار تایید نیست</p>
      </div>
    </div>

    <!-- محصولات در انتظار -->
    <div v-if="activeTab === 'products'" class="space-y-4">
      <!-- Sub-tabs for product types -->
      <div class="bg-white rounded-xl border border-gray-200 p-1.5">
        <div class="flex gap-1">
          <button
              @click="productSubTab = 'market'"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="productSubTab === 'market' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <i class="ti ti-building-store"></i>
            <span>محصولات فروشگاه‌ها</span>
            <span class="px-2 py-0.5 rounded-full text-xs"
                  :class="productSubTab === 'market' ? 'bg-white/20' : 'bg-gray-200'">
          {{ pendingMarketProducts.length }}
        </span>
          </button>
          <button
              @click="productSubTab = 'pharmacy'"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="productSubTab === 'pharmacy' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <i class="ti ti-pill"></i>
            <span>محصولات داروخانه‌ها</span>
            <span class="px-2 py-0.5 rounded-full text-xs"
                  :class="productSubTab === 'pharmacy' ? 'bg-white/20' : 'bg-gray-200'">
          {{ pendingPharmacyProducts.length }}
        </span>
          </button>
        </div>
      </div>

      <!-- Market Products Management -->
      <div v-if="productSubTab === 'market'" class="space-y-4">

        <div v-for="item in pendingMarketProducts" :key="item.id"
             class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">

          <!-- بخش تصویر (سمت راست در دسکتاپ) -->
          <div class="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-50 relative group">
            <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <i class="ti ti-package text-4xl"></i>
            </div>

            <!-- نشانگر وضعیت روی تصویر -->
            <div class="absolute top-2 right-2">
        <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm backdrop-blur-sm bg-white/90"
              :class="getStatusBadgeClass(item.status)">
          {{ getStatusLabel(item.status) }}
        </span>
            </div>
          </div>

          <!-- بخش محتوا -->
          <div class="flex-1 p-4 sm:p-5 flex flex-col justify-between">

            <!-- هدر: نام، فروشگاه و قیمت -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 text-lg leading-snug line-clamp-2 mb-1">
                  {{ item.name }}
                </h3>

                <!-- نام فروشگاه و دسته‌بندی -->
                <p class="text-xs text-gray-500 mb-2 flex flex-wrap items-center gap-1">
                  <i class="ti ti-store text-gray-400"></i>
                  {{ item.storeName }}
                  <span class="mx-1 text-gray-300">•</span>
                  <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
              <i class="ti ti-category-2 text-[10px]"></i>
              {{ item.category }}
            </span>
                </p>
              </div>

              <!-- قیمت -->
              <div class="text-left sm:text-right">
                <p class="text-xl font-extrabold text-emerald-600 leading-tight">
                  {{ item.price.toLocaleString('fa-IR') }}
                </p>
                <span class="text-xs text-gray-500">تومان</span>
              </div>
            </div>

            <!-- توضیحات محصول (حفظ شد) -->
            <div v-if="item.description" class="p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
              <p class="text-xs text-gray-500 mb-1 font-medium">توضیحات محصول:</p>
              <p class="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {{ item.description }}
              </p>
            </div>

            <!-- دکمه‌های عملیات -->
            <div class="mt-auto pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-3">

              <!-- پیام وضعیت تایید شده -->
              <div v-if="item.status === 'approved'"
                   class="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium w-full sm:w-auto justify-center sm:justify-start">
                <i class="ti ti-circle-check-filled"></i>
                محصول تایید و منتشر شده است
              </div>

              <!-- پیام وضعیت رد شده -->
              <div v-else-if="item.status === 'rejected'"
                   class="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium w-full sm:w-auto justify-center sm:justify-start">
                <i class="ti ti-circle-x-filled"></i>
                محصول تایید نشد
              </div>

              <!-- دکمه‌ها برای وضعیت‌های دیگر -->
              <template v-else>
                <!-- دکمه نیاز به ویرایش -->
                <button
                    :disabled="item.status === 'needs_revision'"
                    @click="requestEdit('product', item)"
                    class="flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2"
                    :class="item.status === 'needs_revision'
              ? 'bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600'"
                >
                  <i class="ti ti-pencil"></i>
                  نیاز به ویرایش
                </button>

                <!-- دکمه رد درخواست -->
                <button
                    @click="rejectItem('product', item)"
                    class="flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium border bg-white text-red-600 border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <i class="ti ti-x"></i>
                  رد محصول
                </button>

                <!-- دکمه تایید -->
                <button
                    @click="approveItem('product', item)"
                    :disabled="item.status === 'needs_revision'"
                    class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="ti ti-check"></i>
                  تایید و انتشار
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- حالت خالی بودن لیست -->
        <div v-if="pendingMarketProducts.length === 0"
             class="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <i class="ti ti-check text-green-500 text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
          <p class="text-gray-500">محصولی از فروشگاه‌ها در انتظار تایید نیست</p>
        </div>
      </div>

      <!-- Pharmacy Products Management -->
      <div v-if="productSubTab === 'pharmacy'" class="space-y-4">

        <div v-for="item in pendingPharmacyProducts" :key="item.id"
             class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">

          <!-- بخش تصویر (سمت راست در دسکتاپ) -->
          <div class="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-50 relative group">
            <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <i class="ti ti-pill text-4xl"></i>
            </div>

            <!-- نشانگر وضعیت روی تصویر -->
            <div class="absolute top-2 right-2">
        <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm backdrop-blur-sm bg-white/90"
              :class="getStatusBadgeClass(item.status)">
          {{ getStatusLabel(item.status) }}
        </span>
            </div>
          </div>

          <!-- بخش محتوا -->
          <div class="flex-1 p-4 sm:p-5 flex flex-col justify-between">

            <!-- هدر: نام، کتگوری و قیمت -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 text-lg leading-snug line-clamp-2">
                    {{ item.name }}
                  </h3>
                  <span v-if="item.requiresPrescription"
                        class="mt-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold border border-red-200 whitespace-nowrap">
              نسخه‌ای
            </span>
                </div>

                <!-- نام داروخانه و دسته‌بندی (بازگردانده شد) -->
                <p class="text-xs text-gray-500 mb-2 flex flex-wrap items-center gap-1">
                  <i class="ti ti-building-pharmacy"></i>
                  {{ item.pharmacyName }}
                  <span class="mx-1 text-gray-300">•</span>
                  <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
              <i class="ti ti-category-2 text-[10px]"></i>
              {{ item.category }}
            </span>
                </p>
              </div>

              <!-- قیمت -->
              <div class="text-left sm:text-right">
                <p class="text-xl font-extrabold text-purple-600 leading-tight">
                  {{ Math.floor(item.price).toLocaleString('fa-IR') }}
                </p>
                <span class="text-xs text-gray-500 font-medium">تومان</span>
              </div>
            </div>

            <!-- توضیحات دارو (حفظ شد) -->
            <div v-if="item.description" class="p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
              <p class="text-xs text-gray-500 mb-1 font-medium">توضیحات دارو:</p>
              <p class="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {{ item.description }}
              </p>
            </div>

            <!-- دکمه‌های عملیات -->
            <div class="mt-auto pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:gap-3">

              <!-- پیام وضعیت تایید شده -->
              <div v-if="item.status === 'approved'"
                   class="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium w-full sm:w-auto justify-center sm:justify-start">
                <i class="ti ti-circle-check-filled"></i>
                دارو تایید و منتشر شده است
              </div>

              <!-- پیام وضعیت رد شده -->
              <div v-else-if="item.status === 'rejected'"
                   class="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium w-full sm:w-auto justify-center sm:justify-start">
                <i class="ti ti-circle-x-filled"></i>
                دارو تایید نشد
              </div>

              <!-- دکمه‌ها برای وضعیت‌های دیگر -->
              <template v-else>
                <!-- دکمه نیاز به ویرایش -->
                <button
                    @click="requestEdit('medicine', item)"
                    class="flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2"
                    :class="item.status === 'needs_revision'
              ? 'bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600'"
                >
                  <i class="ti ti-pencil"></i>
                  نیاز به ویرایش
                </button>

                <!-- دکمه رد درخواست -->
                <button
                    @click="rejectItem('medicine', item)"
                    class="flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium border bg-white text-red-600 border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <i class="ti ti-x"></i>
                  رد محصول
                </button>

                <!-- دکمه تایید -->
                <button
                    @click="approveItem('medicine', item)"
                    :disabled="item.status === 'needs_revision'"
                    class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="ti ti-check"></i>
                  تایید و انتشار
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- حالت خالی بودن لیست -->
        <div v-if="pendingPharmacyProducts.length === 0"
             class="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
            <i class="ti ti-check text-purple-500 text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
          <p class="text-gray-500">محصولی از داروخانه‌ها در انتظار تایید نیست</p>
        </div>
      </div>
    </div>

    <!-- ویرایش‌های تنظیمات -->
    <div v-if="activeTab === 'edits'" class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <i class="ti ti-info-circle text-blue-600 text-xl mt-0.5"></i>
          <div>
            <p class="font-medium text-blue-900">ویرایش‌های تنظیمات فروشگاه‌ها</p>
            <p class="text-sm text-blue-700 mt-1">این بخش شامل تغییرات پروفایل، لوگو، بنر، آدرس و سایر اطلاعات
              فروشگاه‌ها است که نیاز به بررسی و تایید دارند.</p>
          </div>
        </div>
      </div>

      <div v-for="item in pendingEdits" :key="item.id" class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" :class="getEntityColor(item.entityType)">
              <i :class="getEntityIcon(item.entityType)" class="text-2xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.entityName }}</h3>
              <p class="text-sm text-gray-500">{{ item.owner }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span
                class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
              <i :class="getChangeIcon(item.changeType)" class="text-sm"></i>
              {{ item.changeLabel }}
            </span>
            <span class="text-xs text-gray-400">{{ item.requestDate }}</span>
          </div>
        </div>

        <!-- جزئیات تغییر -->
        <div class="p-4 bg-gray-50 rounded-xl mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- مقدار قبلی -->
            <div v-if="item.oldValue" class="border border-gray-200 rounded-lg p-3 bg-white">
              <p class="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <i class="ti ti-arrow-back-up text-red-400"></i>
                مقدار قبلی
              </p>
              <div v-if="['logo', 'banner'].includes(item.changeType)"
                   class="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <img v-if="item.oldValue" :src="resolveUrl(item.oldValue)"
                     class="w-full h-full object-cover rounded-lg"/>
                <i v-else class="ti ti-photo text-gray-400 text-2xl"></i>

              </div>
              <div v-else-if="item.changeType === 'address'" class="flex items-center gap-2">
                <span class="text-purple-700 text-sm">{{ item.oldValue.display_name }}</span>
              </div>
              <p v-else class="text-gray-700 font-mono text-sm">{{ item.oldValue }}</p>
            </div>
            <!-- مقدار جدید -->
            <div class="border-2 border-purple-200 rounded-lg p-3 bg-purple-50/50">
              <p class="text-xs text-purple-600 mb-2 flex items-center gap-1">
                <i class="ti ti-arrow-forward-up"></i>
                مقدار جدید
              </p>
              <div v-if="['logo', 'banner'].includes(item.changeType)"
                   class="w-full h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img v-if="item.newValue" :src="resolveUrl(item.newValue)"
                     class="w-full h-full object-cover rounded-lg"/>
                <div v-else class="text-center">
                  <i class="ti ti-photo-plus text-purple-400 text-2xl"></i>
                  <p class="text-xs text-purple-500 mt-1">تصویر جدید</p>
                </div>
              </div>
              <div v-else-if="item.changeType === 'documents'" class="flex items-center gap-2">
                <i class="ti ti-file-certificate text-purple-600"></i>
                <span class="text-purple-700 text-sm">فایل مدرک جدید</span>
                <button class="text-purple-600 hover:underline text-xs mr-auto">مشاهده</button>
              </div>
              <div v-else-if="item.changeType === 'address'" class="flex items-center gap-2">
                <span class="text-purple-700 text-sm">{{ item.newValue.display_name }}</span>
              </div>
              <p v-else class="text-purple-800 font-medium">{{ item.newValue }}</p>
            </div>
          </div>
          <!-- یادداشت -->
          <div v-if="item.note" class="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <i class="ti ti-note text-gray-400 mt-0.5"></i>
            <span>{{ item.note }}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3">
          <button @click="requestEditCorrection(item)"
                  class="px-4 py-2 border border-amber-300 text-amber-600 rounded-lg hover:bg-amber-50 flex items-center gap-2">
            <i class="ti ti-pencil"></i>
            نیاز به اصلاح
          </button>
          <button @click="rejectEdit(item)"
                  class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
            <i class="ti ti-x"></i>
            رد تغییرات
          </button>
          <button @click="approveEdit(item)"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <i class="ti ti-check"></i>
            تایید تغییرات
          </button>
        </div>
      </div>

      <div v-if="pendingEdits.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">ویرایشی در انتظار تایید نیست</p>
      </div>
    </div>

    <!-- نظرات کاربران در انتظار تایید -->
    <div v-if="activeTab === 'reviews'" class="space-y-4">
      <!-- Sub-tabs for review types -->
      <div class="bg-white rounded-xl border border-gray-200 p-1.5">
        <div class="flex gap-1">
          <button
              @click="reviewSubTab = 'shop'"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="reviewSubTab === 'shop' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <i class="ti ti-building-store"></i>
            <span>نظرات فروشگاه‌ها</span>
            <span class="px-2 py-0.5 rounded-full text-xs"
                  :class="reviewSubTab === 'shop' ? 'bg-white/20' : 'bg-gray-200'">
          {{ pendingShopReviews.length }}
        </span>
          </button>
          <button
              @click="reviewSubTab = 'product'"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="reviewSubTab === 'product' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <i class="ti ti-package"></i>
            <span>نظرات محصولات</span>
            <span class="px-2 py-0.5 rounded-full text-xs"
                  :class="reviewSubTab === 'product' ? 'bg-white/20' : 'bg-gray-200'">
          {{ pendingProductReviews.length }}
        </span>
          </button>
        </div>
      </div>

      <!-- Shop Reviews -->
      <div v-if="reviewSubTab === 'shop'">
        <div v-for="item in pendingShopReviews" :key="item.id"
             class="bg-white rounded-xl border border-gray-200 p-5 mb-4 transition-all duration-300">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center">
                <i class="ti ti-building-store text-rose-600 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.shopName }}</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              {{ item.requestDate }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p class="text-xs text-gray-500 mb-1">امتیاز کاربر</p>
              <div class="flex items-center gap-1">
                <i v-for="n in 5" :key="n"
                   class="text-lg"
                   :class="n <= item.rating ? 'ti ti-star-filled text-amber-400' : 'ti ti-star text-gray-300'"></i>
                <span class="mr-2 font-medium text-gray-900">({{ item.rating }} از ۵)</span>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">متن نظر</p>
              <p class="font-medium text-gray-900 text-sm leading-relaxed">{{ item.comment }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button @click="rejectItem('review-shop', item)"
                    class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
              <i class="ti ti-x"></i>
              رد نظر
            </button>
            <button @click="approveItem('review-shop', item)"
                    class="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2">
              <i class="ti ti-check"></i>
              تایید و انتشار
            </button>
          </div>
        </div>

        <!-- حالت خالی بودن لیست -->
        <div v-if="pendingShopReviews.length === 0"
             class="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
          <p class="text-gray-500">نظری برای فروشگاه‌ها در انتظار تایید نیست</p>
        </div>
      </div>

      <!-- Product Reviews -->
      <div v-if="reviewSubTab === 'product'">
        <div v-for="item in pendingProductReviews" :key="item.id"
             class="bg-white rounded-xl border border-gray-200 p-5 mb-4 transition-all duration-300">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
                <i class="ti ti-package text-indigo-600 text-2xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.productName }} • {{ item.shopName }}</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              {{ item.requestDate }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p class="text-xs text-gray-500 mb-1">امتیاز کاربر</p>
              <div class="flex items-center gap-1">
                <i v-for="n in 5" :key="n"
                   class="text-lg"
                   :class="n <= item.rating ? 'ti ti-star-filled text-amber-400' : 'ti ti-star text-gray-300'"></i>
                <span class="mr-2 font-medium text-gray-900">({{ item.rating }} از ۵)</span>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">متن نظر</p>
              <p class="font-medium text-gray-900 text-sm leading-relaxed">{{ item.comment }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button @click="rejectItem('review-product', item)"
                    class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
              <i class="ti ti-x"></i>
              رد نظر
            </button>
            <button @click="approveItem('review-product', item)"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <i class="ti ti-check"></i>
              تایید و انتشار
            </button>
          </div>
        </div>

        <!-- حالت خالی بودن لیست -->
        <div v-if="pendingProductReviews.length === 0"
             class="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
          <p class="text-gray-500">نظری برای محصولات در انتظار تایید نیست</p>
        </div>
      </div>
    </div>

    <!-- مودال مشاهده جزئیات و مدارک -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="closeDetailsModal">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="getDetailTypeStyle.bg"
            >
              <i :class="[getDetailTypeStyle.icon, getDetailTypeStyle.color, 'text-xl']"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ selectedItem?.name }}</h3>
              <p class="text-sm text-gray-500">{{ getDetailTypeLabel }}</p>
            </div>
          </div>
          <button @click="closeDetailsModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500 text-xl"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-5 overflow-y-auto flex-1">
          <!-- اطلاعات پایه -->
          <div class="mb-6">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i class="ti ti-info-circle text-blue-500"></i>
              اطلاعات پایه
            </h4>
            <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div v-for="(value, key) in getBasicInfo" :key="key">
                <p class="text-xs text-gray-500 mb-1">{{ key }}</p>
                <p class="font-medium text-gray-900">{{ value }}</p>
              </div>
            </div>
          </div>

          <!-- مدارک -->
          <div class="mb-6">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i class="ti ti-files text-emerald-500"></i>
              مدارک ارسالی
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="(doc, index) in selectedItem?.documents || defaultDocuments"
                   :key="index"
                   class="border border-gray-200 rounded-xl p-3 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                   @click="viewDocument(doc)">

                <!-- بخش پیش‌نمایش تصویر یا ویدیو -->
                <div
                    class="w-full aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center mb-2 overflow-hidden relative">

                  <!-- اگر نوع فایل ویدیو باشد -->
                  <video v-if="isVideo(doc.type)"
                         :src="resolveUrl(doc.thumbnail || doc.url)"
                         class="w-full h-full object-cover"
                         controls
                         muted>
                  </video>

                  <!-- اگر عکس باشد -->
                  <img v-else-if="doc.thumbnail"
                       :src="resolveUrl(doc.thumbnail)"
                       :alt="doc.name"
                       class="w-full h-full object-cover"
                  />

                  <!-- آیکون پیش‌فرض اگر نه عکس باشد نه ویدیو -->
                  <i v-else-if="!isVideo(doc.type)"
                     class="ti ti-file-text text-gray-400 text-3xl"></i>
                </div>

                <!-- نام و نوع فایل -->
                <p class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</p>
                <p class="text-xs text-gray-500">{{ doc.type }}</p>

                <!-- دکمه مشاهده -->
                <button
                    class="mt-2 w-full py-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg group-hover:bg-blue-100 flex items-center justify-center gap-1">
                  <i class="ti ti-eye"></i>
                  مشاهده
                </button>
              </div>
            </div>
          </div>

          <!-- توضیحات -->
          <div v-if="selectedItem?.description || selectedItem?.notes">
            <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i class="ti ti-notes text-amber-500"></i>
              توضیحات
            </h4>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-sm text-gray-700 leading-relaxed">
                {{ selectedItem?.description || selectedItem?.notes || 'توضیحات اضافی ثبت نشده است.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-5 border-t border-gray-100 flex flex-wrap items-center justify-end gap-3 shrink-0">
          <button @click="closeDetailsModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            بستن
          </button>
          <button @click="requestEditFromModal"
                  class="px-4 py-2 border border-amber-300 text-amber-600 rounded-lg hover:bg-amber-50 flex items-center gap-2">
            <i class="ti ti-pencil"></i>
            نیاز به ویرایش
          </button>
          <button @click="rejectFromModal"
                  class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
            <i class="ti ti-x"></i>
            رد درخواست
          </button>
          <button @click="approveFromModal"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <i class="ti ti-check"></i>
            تایید
          </button>
        </div>
      </div>
    </div>

    <!-- مودال مشاهده تصویر -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
         @click.self="showImageModal = false">
      <div class="relative max-w-4xl w-full">
        <button
            @click="showImageModal = false"
            class="absolute -top-12 left-0 p-2 text-white hover:bg-white/20 rounded-lg"
        >
          <i class="ti ti-x text-2xl"></i>
        </button>
        <img
            :src="resolveUrl(selectedDocument?.thumbnail) || '/images/placeholder-doc.jpg'"
            :alt="selectedDocument?.name"
            class="w-full rounded-xl"
        />
        <p class="text-white text-center mt-4">{{ selectedDocument?.name }}</p>
      </div>
    </div>

    <!-- مودال تأیید درخواست -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="showApproveModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <i class="ti ti-check text-green-600 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">تأیید درخواست</h3>
          <p class="text-gray-500 mb-2">آیا از تأیید <span class="font-bold text-gray-900">{{
              itemToAction?.name
            }}</span> اطمینان دارید؟</p>
          <p class="text-sm text-gray-400">با تأیید، این {{ getActionTypeLabel }} فعال می‌شود و در سیستم نمایش داده
            می‌شود.</p>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-center gap-3">
          <button @click="showApproveModal = false"
                  class="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button @click="confirmApprove"
                  class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <i class="ti ti-check"></i>
            تأیید و فعال‌سازی
          </button>
        </div>
      </div>
    </div>

    <!-- مودال رد درخواست با دلیل -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="showRejectModal = false">
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <i class="ti ti-x text-red-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">رد درخواست</h3>
              <p class="text-sm text-gray-500">{{ itemToAction?.name }}</p>
            </div>
          </div>
          <button @click="showRejectModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>

        <div class="p-5">
          <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div class="flex items-start gap-2">
              <i class="ti ti-alert-triangle text-amber-600 mt-0.5"></i>
              <p class="text-sm text-amber-700">
                دلیل رد درخواست از طریق پیامک به متقاضی ارسال خواهد شد.
              </p>
            </div>
          </div>

          <label class="block mb-2 font-medium text-gray-900">دلیل رد درخواست <span
              class="text-red-500">*</span></label>
          <textarea
              v-model="rejectReason"
              rows="4"
              class="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              placeholder="دلیل رد درخواست را بنویسید... (این متن به متقاضی ارسال می‌شود)"
          ></textarea>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
                v-for="reason in commonRejectReasons"
                :key="reason"
                @click="rejectReason = reason"
                class="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            >
              {{ reason }}
            </button>
          </div>
        </div>

        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showRejectModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button
              @click="confirmReject"
              :disabled="!rejectReason.trim()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-send"></i>
            رد و ارسال پیامک
          </button>
        </div>
      </div>
    </div>

    <!-- مودال نیاز به ویرایش -->
    <div v-if="showEditRequiredModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="showEditRequiredModal = false">
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <i class="ti ti-pencil text-amber-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">درخواست ویرایش</h3>
              <p class="text-sm text-gray-500">{{ itemToAction?.name }}</p>
            </div>
          </div>
          <button @click="showEditRequiredModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>

        <div class="p-5">
          <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div class="flex items-start gap-2">
              <i class="ti ti-info-circle text-blue-600 mt-0.5"></i>
              <p class="text-sm text-blue-700">
                توضیحات نیاز به ویرایش از طریق پیامک به متقاضی ارسال خواهد شد. درخواست در وضعیت انتظار باقی می‌ماند.
              </p>
            </div>
          </div>

          <label class="block mb-2 font-medium text-gray-900">موارد نیاز به ویرایش <span
              class="text-red-500">*</span></label>
          <textarea
              v-model="editRequiredReason"
              rows="4"
              class="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
              placeholder="مثال: لطفاً تصویر مجوز فعالیت را با کیفیت بالاتر ارسال کنید..."
          ></textarea>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
                v-for="reason in commonEditReasons"
                :key="reason"
                @click="editRequiredReason = editRequiredReason ? editRequiredReason + '\n' + reason : reason"
                class="text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 border border-amber-200"
            >
              <i class="ti ti-plus text-xs ml-1"></i>
              {{ reason }}
            </button>
          </div>
        </div>

        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showEditRequiredModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button
              @click="confirmEditRequired"
              :disabled="!editRequiredReason.trim()"
              class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="ti ti-send"></i>
            ارسال درخواست ویرایش
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[70]">
        <div :class="[
          'px-5 py-3 rounded-xl shadow-lg flex items-center gap-3',
          toastType === 'success' ? 'bg-green-600 text-white' : 
          toastType === 'error' ? 'bg-red-600 text-white' : 
          'bg-amber-600 text-white'
        ]">
          <i :class="[
            'text-xl',
            toastType === 'success' ? 'ti ti-check' : 
            toastType === 'error' ? 'ti ti-x' : 
            'ti ti-pencil'
          ]"></i>
          <span class="font-medium">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
    <!-- درخواست‌های نقد کردن کیف پول -->
    <div v-if="activeTab === 'withdrawals'" class="space-y-4">
      <div v-for="item in pendingWithdrawals" :key="item.id" class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
              <i class="ti ti-wallet text-cyan-600 text-2xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.amount.toLocaleString('fa-IR') }} تومان</h3>
              <p class="text-sm text-gray-500">{{ item.bankName || 'بانک نامشخص' }} • {{ item.date }}</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
        {{ item.time }}
      </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">شماره شبا/کارت</p>
            <p class="font-medium text-gray-900 font-mono dir-ltr">{{ item.accountNumber }}</p>
          </div>
          <div v-if="item.note">
            <p class="text-xs text-gray-500 mb-1">توضیحات</p>
            <p class="font-medium text-gray-900 text-sm">{{ item.note }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button @click="rejectItem('withdrawal', item)"
                  class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
            <i class="ti ti-x"></i>
            رد درخواست
          </button>
          <button @click="approveItem('withdrawal', item)"
                  class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
            <i class="ti ti-check"></i>
            تایید و پرداخت
          </button>
        </div>
      </div>

      <div v-if="pendingWithdrawals.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">درخواست برداشتی برای تایید وجود ندارد</p>
      </div>
    </div>
    <!-- مودال تایید درخواست برداشت وجه -->
    <div v-if="showWithdrawalApproveModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         @click.self="showWithdrawalApproveModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
              <i class="ti ti-wallet text-cyan-600 text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">تایید واریز وجه</h3>
              <p class="text-sm text-gray-500">{{ itemToAction?.amount?.toLocaleString('fa-IR') }} تومان</p>
            </div>
          </div>
          <button @click="showWithdrawalApproveModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-x text-gray-500"></i>
          </button>
        </div>

        <div class="p-5">
          <div class="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-500">شماره کارت/شبا:</span>
              <span class="font-mono font-medium text-gray-900 dir-ltr">{{ itemToAction?.accountNumber }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">بانک:</span>
              <span class="font-medium text-gray-900">{{ itemToAction?.bankName || '-' }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block mb-2 font-medium text-gray-900">شماره پیگیری تراکنش <span
                  class="text-red-500">*</span></label>
              <input
                  v-model="withdrawalTrackId"
                  type="text"
                  class="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="مثال: 1234567890"
              >
            </div>

            <div>
              <label class="block mb-2 font-medium text-gray-900">تاریخ واریز <span
                  class="text-red-500">*</span></label>
              <input
                  v-model="withdrawalDate"
                  type="text"
                  class="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dir-ltr text-left"
                  placeholder="1403/02/11"
              >
              <p class="text-xs text-gray-400 mt-1">فرت: yyyy/mm/dd</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 flex items-center justify-end gap-3">
          <button @click="showWithdrawalApproveModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            انصراف
          </button>
          <button
              @click="confirmWithdrawalApprove"
              :disabled="!withdrawalTrackId.trim() || !withdrawalDate.trim()"
              class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="ti ti-check"></i>
            ثبت تایید واریز
          </button>
        </div>
      </div>
    </div>

    <!-- سرویس‌های کلینیک در انتظار تایید -->
    <div v-if="activeTab === 'services'" class="space-y-4">
      <div v-for="item in pendingServices" :key="item.id"
           class="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300">

        <!-- هدر کارت -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                 :class="getStatusIconBg(item.status)">
              <i class="ti ti-list-details text-2xl transition-colors" :class="getStatusIconColor(item.status)"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">کلینیک:
                {{ item.tenantId ? 'شناسه ' + item.tenantId.substring(0, 8) + '...' : '-' }}</p>
            </div>
          </div>
          <!-- نشانگر وضعیت -->
          <span class="px-3 py-1 rounded-full text-sm font-medium border"
                :class="getStatusBadgeClass(item.status)">
            {{ getStatusLabel(item.status) }}
          </span>
        </div>

        <!-- جزئیات -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p class="text-xs text-gray-500 mb-1">توضیحات</p>
            <p class="font-medium text-gray-900 text-sm">{{ item.description || 'توضیحات ندارد' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">قیمت (تومان)</p>
            <p class="font-bold text-emerald-600 font-mono">
              {{ Number(item.price).toLocaleString('fa-IR') }}
            </p>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <!-- پیام وضعیت تایید شده -->
          <div v-if="item.status === 'active'" class="flex items-center gap-2 text-green-600 font-medium">
            <i class="ti ti-circle-check-filled"></i>
            سرویس تایید و فعال شده است
          </div>
          <div v-else-if="item.status === 'inactive'" class="flex items-center gap-2 text-red-600 font-medium">
            <i class="ti ti-circle-x-filled"></i>
            سرویس مورد نظر تایید نشد
          </div>

          <!-- دکمه‌ها برای وضعیت‌های دیگر (Pending) -->
          <template v-else>
            <!-- دکمه رد درخواست -->
            <button @click="rejectItem('service', item)"
                    class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-all">
              <i class="ti ti-x"></i>
              رد درخواست
            </button>
            <!-- دکمه تایید -->
            <button @click="approveItem('service', item)"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-sm">
              <i class="ti ti-check"></i>
              تایید و فعال‌سازی
            </button>
          </template>
        </div>
      </div>

      <!-- حالت خالی بودن لیست -->
      <div v-if="pendingServices.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <i class="ti ti-check text-green-600 text-2xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 mb-2">همه موارد بررسی شده</h3>
        <p class="text-gray-500">سرویسی در انتظار تایید نیست</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useRequestShopStore} from "@/stores/market/request-shop.ts";
import {useMarketSettingsStore} from "@/stores/market/settings.ts";
import {useReviewStore} from "@/stores/market/reviews.ts";
import {storeToRefs} from "pinia";
import {useWithdrawalStore} from "@/stores/withdrawal.ts";
import {useTenantRequestStore} from "@/stores/tenant-request.ts";
import {useVetClinicSettingsStore} from "@/stores/vet-clinic/settings.js";
import {useVetClinicServicesStore} from "@/stores/vet-clinic/service.js";
import {useUrlHelper} from "@/composables/useUrlHelper.js";

const {resolveUrl} = useUrlHelper()
const withdrawalStore = useWithdrawalStore()
const reviewsStore = useReviewStore()
const requestShopStore = useRequestShopStore()
const reviewStore = useReviewStore()
const route = useRoute()
const activeTab = ref('pharmacies')
const productSubTab = ref('market') // تب فرعی محصولات: market یا pharmacy
const reviewSubTab = ref('shop') // تب فرعی نظرات: shop یا product
const showDetailsModal = ref(false)
const showImageModal = ref(false)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showEditRequiredModal = ref(false)
const selectedItem = ref(null)
const selectedItemType = ref(null)
const selectedDocument = ref(null)
const itemToAction = ref(null)
const actionType = ref(null)
const rejectReason = ref('')
const editRequiredReason = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
// متغیرهای مودال برداشت وجه
const showWithdrawalApproveModal = ref(false)
const withdrawalTrackId = ref('')
const withdrawalDate = ref('')
// دلایل رایج رد درخواست
const commonRejectReasons = [
  'مدارک ناقص است',
  'تصاویر مدارک خوانا نیست',
  'اطلاعات وارد شده صحیح نیست',
  'مجوز فعالیت معتبر نیست',
  'آدرس نامعتبر است',
]

// دلایل رایج نیاز به ویرایش
const commonEditReasons = [
  'تصویر مجوز واضح نیست',
  'تصویر کارت ملی ناخوانا است',
  'شماره تماس اشتباه است',
  'آدرس کامل نیست',
  'اطلاعات تحصیلی ناقص است',
]

// ۲. تابع برای دریافت داده‌ها از سرور (بدون استفاده از computed)
const fetchReviewsData = async () => {
  try {
    // دریافت نظرات فروشگاه‌ها
    await reviewsStore.fetchPendingShopReviews()

    // دریافت نظرات محصولات
    await reviewsStore.fetchPendingProductReviews()

  } catch (error) {
    console.error('Error fetching reviews:', error)
  }
}
// خواندن تب از URL
onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
  fetchReviewsData()
})

// نمایش Toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// لیبل نوع برای اکشن
const getActionTypeLabel = computed(() => {
  const labels = {
    pharmacy: 'داروخانه',
    clinic: 'کلینیک',
    vet: 'دامپزشک',
    market: 'فروشگاه',
    product: 'محصول',
    edit: 'ویرایش تنظیمات',
    review: 'نظر کاربر',
    service: 'سرویس',
  }
  return labels[actionType.value] || ''
})

// مدارک پیش‌فرض
const defaultDocuments = [
  {name: 'تصویر مجوز فعالیت', type: 'PDF', thumbnail: null, url: '/images/placeholder-doc.jpg'},
  {name: 'کارت ملی مسئول', type: 'تصویر', thumbnail: null, url: '/images/placeholder-doc.jpg'},
  {name: 'تصویر مدرک تحصیلی', type: 'تصویر', thumbnail: null, url: '/images/placeholder-doc.jpg'},
]

const tabs = computed(() => [
  {
    key: 'pharmacies',
    label: 'داروخانه‌ها',
    icon: 'ti ti-pill',
    count: pendingPharmacies.value.length,
    activeClass: 'bg-teal-500 text-white'
  },
  {
    key: 'clinics',
    label: 'کلینیک‌ها',
    icon: 'ti ti-building-hospital',
    count: pendingClinics.value.length,
    activeClass: 'bg-rose-500 text-white'
  },
  {
    key: 'vets',
    label: 'دامپزشکان',
    icon: 'ti ti-stethoscope',
    count: pendingVets.value.length,
    activeClass: 'bg-emerald-500 text-white'
  },
  {
    key: 'markets',
    label: 'فروشگاه‌ها',
    icon: 'ti ti-building-store',
    count: pendingMarkets.value.length,
    activeClass: 'bg-orange-500 text-white'
  },
  {
    key: 'products',
    label: 'محصولات',
    icon: 'ti ti-package',
    count: pendingProducts.value.length,
    activeClass: 'bg-blue-500 text-white'
  },
  {
    key: 'edits',
    label: 'ویرایش‌های تنظیمات',
    icon: 'ti ti-settings-cog',
    count: pendingEdits.value.length,
    activeClass: 'bg-purple-500 text-white'
  },
  {
    key: 'reviews',
    label: 'نظرات کاربران',
    icon: 'ti ti-message-circle',
    count: pendingShopReviews.value.length + pendingProductReviews.value.length,
    activeClass: 'bg-rose-500 text-white'
  },
  {
    key: 'withdrawals',
    label: 'درخواست‌های وجه',
    icon: 'ti ti-wallet',
    count: pendingWithdrawals.value.length,
    activeClass: 'bg-cyan-500 text-white'
  },
  {
    key: 'services',
    label: 'سرویس‌ها',
    icon: 'ti ti-list-details',
    count: pendingServices.value.length,
    activeClass: 'bg-indigo-500 text-white'
  },
])

const totalPending = computed(() =>
    pendingPharmacies.value.length +
    pendingClinics.value.length +
    pendingVets.value.length +
    pendingMarkets.value.length +
    pendingProducts.value.length +
    pendingEdits.value.length +
    pendingShopReviews.value.length +
    pendingProductReviews.value.length +
    pendingWithdrawals.value.length +
    pendingServices.value.length
)
const pendingWithdrawals = computed(() => {
  // فیلتر کردن درخواست‌های در انتظار یا در حال پردازش
  return withdrawalStore.withdrawals.filter(w => w.status === 'pending' || w.status === 'processing')
})
// استایل نوع در مودال
const getDetailTypeStyle = computed(() => {
  const styles = {
    pharmacy: {bg: 'bg-teal-100', color: 'text-teal-600', icon: 'ti ti-pill'},
    clinic: {bg: 'bg-rose-100', color: 'text-rose-600', icon: 'ti ti-building-hospital'},
    vet: {bg: 'bg-emerald-100', color: 'text-emerald-600', icon: 'ti ti-stethoscope'},
    market: {bg: 'bg-orange-100', color: 'text-orange-600', icon: 'ti ti-building-store'},
    product: {bg: 'bg-blue-100', color: 'text-blue-600', icon: 'ti ti-package'},
    edit: {bg: 'bg-purple-100', color: 'text-purple-600', icon: 'ti ti-settings-cog'},
  }
  return styles[selectedItemType.value] || styles.pharmacy
})

const getDetailTypeLabel = computed(() => {
  const labels = {
    pharmacy: 'داروخانه',
    clinic: 'کلینیک',
    vet: 'دامپزشک',
    market: 'فروشگاه',
    product: 'محصول',
    edit: 'ویرایش تنظیمات',
  }
  return labels[selectedItemType.value] || ''
})

// اطلاعات پایه بر اساس نوع
const getBasicInfo = computed(() => {
  if (!selectedItem.value) return {}

  const item = selectedItem.value
  switch (selectedItemType.value) {
    case 'pharmacy':
      return {
        'نام داروخانه': item.name,
        'مسئول فنی': item.manager || item.name,
        'شهر': item.city,
        'شماره تماس': item.phone,
        'آدرس': item.address,
        'توضیحات تکمیلی': item.description,
        'تاریخ درخواست': item.requestDate,
      }
    case 'clinic':
      return {
        'نام کلینیک': item.name,
        'مدیر': item.manager,
        'شهر': item.city,
        'شماره تماس': item.phone,
        'آدرس': item.address,
        'توضیحات تکمیلی': item.description,
        'تاریخ درخواست': item.requestDate,
      }
    case 'vet':
      return {
        'نام': item.name,
        'تخصص': item.specialty,
        'شهر': item.city,
        'شماره تماس': item.phone,
        'سابقه کار': item.experience,
        'توضیحات تکمیلی': item.description,
        'تاریخ درخواست': item.requestDate,
      }
    case 'market':
      return {
        'نام فروشگاه': item.name,
        'مالک': item.owner,
        'شهر': item.city,
        'شماره تماس': item.phone,
        'آدرس': item.address,
        'دسته‌بندی': item.category,
        'تاریخ درخواست': item.requestDate,
      }
    case 'product':
      return {
        'نام محصول': item.name,
        'فروشگاه': item.storeName,
        'دسته‌بندی': item.category,
        'قیمت': item.price?.toLocaleString('fa-IR') + ' تومان',
        'تاریخ درخواست': item.requestDate,
      }
    default:
      return {}
  }
})
const tenantReqStore = useTenantRequestStore()
const SPECIALTIES = [
  {value: 'general', label: 'عمومی'},
  {value: 'surgery', label: 'جراحی'},
  {value: 'internal', label: 'بیماری‌های داخلی'},
  {value: 'dental', label: 'دندانپزشکی'},
  {value: 'radiology', label: 'رادیولوژی'},
  {value: 'nutrition', label: 'تغذیه'},
  {value: 'dermatology', label: 'پوست و مو'},
  {value: 'ophthalmology', label: 'چشم‌پزشکی'},
  {value: 'orthopedics', label: 'ارتوپدی'},
  {value: 'vet', label: 'دامپزشکی'}, // اگر نیاز به نمایش تخصص دامپزشکی هم دارید
];
const getSpecialtyLabel = (value) => {
  const found = SPECIALTIES.find((s) => s.value === value);
  return found ? found.label : value; // اگر پیدا نشد، خود مقدار را برگردان
};
// ۱. لیست داروخانه‌ها (فقط نوع pharmacy)
const pendingPharmacies = computed(() => {
  return tenantReqStore.requests
      .filter(req => req.type === 'pharmacy')
      .map(req => ({
        id: req.id,
        name: req.name || req.tenantName, // استفاده از name یا tenantName
        manager: req.ownerName, // نام مالک به عنوان مدیر
        city: req.city,
        phone: req.phone,
        address: req.address.display_name,
        licenseNumber: '-', // اگر فیلد جداگانه شماره مجوز ندارید
        description: req.description,
        requestDate: new Date(req.createdAt).toLocaleDateString('fa-IR'),
        status: req.status,
        documents: req.documents
      }))
})

// ۲. لیست کلینیک‌ها (فقط نوع clinic)
const pendingClinics = computed(() => {
  return tenantReqStore.requests
      .filter(req => req.type === 'clinic')
      .map(req => ({
        id: req.id,
        name: req.name || req.tenantName,
        manager: req.name,
        city: req.city,
        phone: req.phone,
        address: req.address.display_name,
        description: req.description,
        vetsCount: '-', // اگر تعداد دامپزشکان را ذخیره نمی‌کنید
        requestDate: new Date(req.createdAt).toLocaleDateString('fa-IR'),
        services: req.services || [], // لیست سرویس‌ها
        status: req.status,
        documents: req.documents
      }))
})

// ۳. لیست دامپزشکان (فقط نوع vet)
const pendingVets = computed(() => {
  return tenantReqStore.requests
      .filter(req => req.type === 'vet')
      .map(req => ({
        id: req.id,
        name: req.name || req.tenantName,
        specialty: getSpecialtyLabel(req.specialty),
        city: req.city,
        phone: req.phone,
        licenseNumber: '-', // شماره پروانه
        education: req.description || '-', // توضیحات به عنوان تحصیلات
        experience: req.experience ? `${req.experience} سال سابقه` : '-',
        description: req.description,
        requestDate: new Date(req.createdAt).toLocaleDateString('fa-IR'),
        status: req.status,
        documents: req.documents
      }))
})

// ۱. دریافت رفرنس‌ها از استور (بدون تغییر)
const {reviewsProductPending, reviewsShopPending} = storeToRefs(reviewsStore)


// ۴. تعریف computedها برای نمایش در قالب (بدون async)
const pendingShopReviews = computed(() => {
  return reviewsShopPending.value || []
})

const pendingProductReviews = computed(() => {
  return reviewsProductPending.value || []
})
const pendingMarkets = computed(() => {
  return requestShopStore.requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((req) => ({
        id: req.id,
        name: req.shopName,
        owner: req.ownerName,
        city: req.city,
        phone: req.phone,
        address: req.address.display_name,
        category: req.categories && req.categories.length > 0 ? req.categories.join('، ') : '-',
        requestDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString('fa-IR') : '-',
        status: req.status,
        province: req.province,
        email: req.email,
        iban: req.iban,
        type: req.type,
        location: req.location,
        documents: req.documents
      }));
});

const pendingMarketProducts = computed(() => {

  const products = requestShopStore.products || [];

  return products
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((req) => ({
        id: req.id,
        name: req.name,
        storeName: req.tenant,
        category: req.categoryBreadcrumb,
        price: req.price,
        description: req.description,
        //image: req.image,
        image: resolveUrl(req.image),
        status: req.status,
        requestDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString('fa-IR') : '-',
      }));
});

const pendingPharmacyProducts = computed(() => {

  const medicines = tenantReqStore.medicines || [];

  return medicines
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((req) => ({
        id: req.id,
        name: req.name,
        pharmacyName: req.tenant,
        category: req.categoryBreadcrumb,
        price: req.price,
        description: req.description,
        //image: req.image,
        image: resolveUrl(req.image),
        status: req.status,
        requiresPrescription: req.prescriptionRequired,
        requestDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString('fa-IR') : '-',
      }));
});


// محصولات ترکیبی برای محاسبه تعداد کل
const pendingProducts = computed(() => [...pendingMarketProducts.value, ...pendingPharmacyProducts.value])
const settingStore = useMarketSettingsStore()
const vetClinicSettingStore = useVetClinicSettingsStore()
const vetClinicServiceStore = useVetClinicServicesStore()

const pendingServices = computed(() => vetClinicServiceStore.pendingServices)

// ترکیب لیست مارکت و کلینیک و مرتب‌سازی بر اساس تاریخ
const pendingEdits = computed(() => {
  const market = settingStore.pendingEdits || [];
  const vet = vetClinicSettingStore.pendingEdits || [];

  // ادغام دو آرایه
  const combined = [...market, ...vet];

  // مرتب‌سازی نزولی (جدیدترین‌ها اول)
  // نکته: تاریخ‌ها فرمت فارسی دارند، برای مرتب‌سازی دقیق بهتر است از timestamp استفاده کنید
  // اما اگر فرمت استاندارد باشد، مرتب‌سازی رشته‌ای هم کار می‌کند.
  return combined.sort((a, b) => b.requestDate.localeCompare(a.requestDate));
});

// ویرایش‌های تنظیمات فروشگاه‌ها (تغییرات پروفایل، لوگو، اطلاعات و...)
/*const pendingEdits = ref([
  { 
    id: 1, 
    entityType: 'market',
    entityName: 'پت‌شاپ ستاره', 
    owner: 'محمد رضایی', 
    changeType: 'logo',
    changeLabel: 'تغییر لوگو',
    oldValue: null,
    newValue: '/images/new-logo.jpg',
    requestDate: '۱۴۰۳/۰۹/۱۸',
    note: 'لوگوی جدید با کیفیت بالاتر'
  },
  { 
    id: 2, 
    entityType: 'pharmacy',
    entityName: 'داروخانه سلامت پت', 
    owner: 'دکتر کریمی', 
    changeType: 'address',
    changeLabel: 'تغییر آدرس',
    oldValue: 'تهران، ونک، کوچه گلها، پلاک 12',
    newValue: 'تهران، سعادت‌آباد، بلوار فرهنگ، پلاک 45',
    requestDate: '۱۴۰۳/۰۹/۱۷',
    note: 'انتقال به شعبه جدید'
  },
  { 
    id: 3, 
    entityType: 'market',
    entityName: 'فروشگاه پتومارکت', 
    owner: 'علی احمدی', 
    changeType: 'phone',
    changeLabel: 'تغییر شماره تماس',
    oldValue: '09132345678',
    newValue: '09191234567',
    requestDate: '۱۴۰۳/۰۹/۱۷',
    note: ''
  },
  { 
    id: 4, 
    entityType: 'clinic',
    entityName: 'کلینیک پارسیان', 
    owner: 'دکتر محمدی', 
    changeType: 'documents',
    changeLabel: 'آپلود مجوز جدید',
    oldValue: null,
    newValue: '/docs/new-license.pdf',
    requestDate: '۱۴۰۳/۰۹/۱۶',
    note: 'تمدید مجوز فعالیت'
  },
  { 
    id: 5, 
    entityType: 'market',
    entityName: 'آکواریوم پارس', 
    owner: 'رضا نوری', 
    changeType: 'banner',
    changeLabel: 'تغییر بنر',
    oldValue: null,
    newValue: '/images/new-banner.jpg',
    requestDate: '۱۴۰۳/۰۹/۱۵',
    note: 'بنر کمپین تخفیف زمستانی'
  },
  { 
    id: 6, 
    entityType: 'pharmacy',
    entityName: 'داروخانه حیوانات مهر', 
    owner: 'دکتر رضایی', 
    changeType: 'name',
    changeLabel: 'تغییر نام',
    oldValue: 'داروخانه حیوانات مهر',
    newValue: 'داروخانه دامپزشکی مهر پت',
    requestDate: '۱۴۰۳/۰۹/۱۵',
    note: 'ریبرندینگ فروشگاه'
  },
])*/

// باز کردن مودال جزئیات
const openDetails = (type, item) => {
  selectedItemType.value = type
  selectedItem.value = item
  showDetailsModal.value = true
}

// بستن مودال
const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedItem.value = null
  selectedItemType.value = null
}

// مشاهده مدرک
const viewDocument = (doc) => {
  selectedDocument.value = doc
  showImageModal.value = true
}

// تایید از مودال
const approveFromModal = () => {

  approveItem(selectedItemType.value, selectedItem.value)
}

// رد از مودال
const rejectFromModal = () => {
  rejectItem(selectedItemType.value, selectedItem.value)
}

// درخواست ویرایش از مودال
const requestEditFromModal = () => {
  requestEdit(selectedItemType.value, selectedItem.value)
}

// باز کردن مودال تأیید
const approveItem = (type, item) => {
  actionType.value = type
  itemToAction.value = item
  if (type === 'withdrawal') {
    // باز کردن مودال اختصاصی برای برداشت وجه
    showWithdrawalApproveModal.value = true
    // ریست کردن فرم
    withdrawalTrackId.value = ''
    withdrawalDate.value = ''
  } else {
    // برای سایر موارد مودال معمولی را باز کن
    showApproveModal.value = true
  }
}
const confirmWithdrawalApprove = async () => {
  if (!withdrawalTrackId.value.trim() || !withdrawalDate.value.trim()) return

  // فراخوانی اکشن استور با پارامترهای جدید
  await withdrawalStore.approveWithdrawal(
      itemToAction.value.id,
      withdrawalTrackId.value,
      withdrawalDate.value,
      'completed'
  )

  // حذف از لیست نمایشی (UI)
  removeItem('withdrawal', itemToAction.value)

  showWithdrawalApproveModal.value = false
  showToastMessage('درخواست برداشت با موفقیت تایید و ثبت شد')
}

// تأیید نهایی
const confirmApprove = async () => {

  removeItem(actionType.value, itemToAction.value)
  showApproveModal.value = false
  if (actionType.value === 'market') {
    await requestShopStore.approveRequest(itemToAction.value.id)
  }
  if (actionType.value === 'vet' || actionType.value === 'clinic' || actionType.value === 'pharmacy') {
    await tenantReqStore.approveTenantRequest(itemToAction.value.id)
  }

  if (actionType.value === 'product') {
    await requestShopStore.approveProductRequest(itemToAction.value.id)
  }

  if (actionType.value === 'medicine') {
    await tenantReqStore.approveMedicineRequest(itemToAction.value.id)
  }

  if (actionType.value === 'edit' && itemToAction.value.entityType === 'clinic') {
    await vetClinicSettingStore.approveChange(itemToAction.value, true, '');
  }

  if (actionType.value === 'edit' && itemToAction.value.entityType === 'market') {
    await settingStore.approveChange(itemToAction.value.tenantId, 'approved');
  }

  if (actionType.value === 'review-product') {
    await reviewStore.approveProductReview(itemToAction.value.id)
  }
  if (actionType.value === 'review-shop') {
    await reviewStore.approveShopReview(itemToAction.value.id)
  }

  if (actionType.value === 'service') {
    await vetClinicServiceStore.processServiceStatus(itemToAction.value.id, {
      isApproved: true
    });
  }

  closeDetailsModal()
  showToastMessage(`${getActionTypeLabel.value} با موفقیت تأیید و فعال شد`)
}

// باز کردن مودال رد
const rejectItem = (type, item) => {
  actionType.value = type
  itemToAction.value = item
  rejectReason.value = ''
  showRejectModal.value = true
}

// رد نهایی
const confirmReject = async () => {
  // ارسال پیامک با rejectReason.value
  console.log('ارسال پیامک رد:', rejectReason.value)
  if (actionType.value === 'market') {
    await requestShopStore.rejectRequest(itemToAction.value.id, rejectReason.value)
  }

  if (actionType.value === 'vet' || actionType.value === 'clinic' || actionType.value === 'pharmacy') {
    await tenantReqStore.rejectTenantRequest(itemToAction.value.id, rejectReason.value)
  }

  if (actionType.value === 'product') {
    await requestShopStore.rejectProductRequest(itemToAction.value.id, rejectReason.value)
  }

  if (actionType.value === 'medicine') {
    await tenantReqStore.rejectMedicineRequest(itemToAction.value.id, rejectReason.value)
  }

  if (actionType.value === 'edit' && itemToAction.value.entityType === 'market') {
    await settingStore.approveChange(
        itemToAction.value.tenantId, 'rejected', rejectReason.value);
  }
  if (actionType.value === 'edit' && itemToAction.value.entityType === 'clinic') {
    await vetClinicSettingStore.approveChange(itemToAction.value, true, rejectReason.value);
  }

  if (actionType.value === 'review-product') {
    await reviewStore.rejectProductReview(itemToAction.value.id)
  }
  if (actionType.value === 'review-shop') {
    await reviewStore.rejectShopReview(itemToAction.value.id)
  }

  if (actionType.value === 'withdrawal') {
    // فرض بر این است که متدی در استور برای تایید وجود دارد یا باید ساخته شود
    await withdrawalStore.rejectWithdrawal(itemToAction.value.id, rejectReason.value)
    // یا فراخوانی مستقیم API اگر اکشن ندارید
  }

  if (actionType.value === 'service') {
    await vetClinicServiceStore.processServiceStatus(itemToAction.value.id, {
      isApproved: false,
      reason: rejectReason.value
    });
  }

  removeItem(actionType.value, itemToAction.value)
  showRejectModal.value = false
  closeDetailsModal()
  showToastMessage(`درخواست ${itemToAction.value?.name} رد شد و پیامک ارسال شد`, 'error')
}

// باز کردن مودال درخواست ویرایش
const requestEdit = (type, item) => {
  actionType.value = type
  itemToAction.value = item
  editRequiredReason.value = ''
  showEditRequiredModal.value = true
}

// ارسال درخواست ویرایش
const confirmEditRequired = async () => {

  if (actionType.value === 'market') {
    await requestShopStore.requestRevision(itemToAction.value.id, editRequiredReason.value)
  }
  if (actionType.value === 'vet' || actionType.value === 'clinic' || actionType.value === 'pharmacy') {
    await tenantReqStore.requestTenantRevision(itemToAction.value.id, editRequiredReason.value)
  }

  if (actionType.value === 'product') {
    await requestShopStore.productRequestRevision(itemToAction.value.id, editRequiredReason.value)
  }

  if (actionType.value === 'medicine') {
    await tenantReqStore.medicineRequestRevision(itemToAction.value.id, editRequiredReason.value)
  }

  if (actionType.value === 'edit') {
    await settingStore.approveChange(
        itemToAction.value.tenantId, 'correction_required', editRequiredReason.value);
  }
  // ارسال پیامک با editRequiredReason.value
  console.log('ارسال پیامک ویرایش:', editRequiredReason.value)
  showEditRequiredModal.value = false
  closeDetailsModal()
  showToastMessage(`درخواست ویرایش برای ${itemToAction.value?.name} ارسال شد`, 'warning')
}

// حذف آیتم از لیست
const removeItem = (type, item) => {
  switch (type) {
    case 'pharmacy':
      pendingPharmacies.value = pendingPharmacies.value.filter(p => p.id !== item.id)
      break
    case 'clinic':
      pendingClinics.value = pendingClinics.value.filter(c => c.id !== item.id)
      break
    case 'vet':
      pendingVets.value = pendingVets.value.filter(v => v.id !== item.id)
      break
    case 'market':
      pendingMarkets.value = pendingMarkets.value.filter(m => m.id !== item.id)
      break
    case 'product':
      if (item.storeName) {
        pendingMarketProducts.value = pendingMarketProducts.value.filter(p => p.id !== item.id)
      } else if (item.pharmacyName) {
        pendingPharmacyProducts.value = pendingPharmacyProducts.value.filter(p => p.id !== item.id)
      }
      break
    case 'edit':
      pendingEdits.value = pendingEdits.value.filter(e => e.id !== item.id)
      break
    case 'review-product':
      const prodReviewIdx = reviewsStore.reviewsProductPending.findIndex(r => r.id === item.id)
      if (prodReviewIdx !== -1) {
        reviewsStore.reviewsProductPending.splice(prodReviewIdx, 1)
      }
      break
    case 'review-shop':
      const shopReviewIdx = reviewsStore.reviewsShopPending.findIndex(r => r.id === item.id)
      if (shopReviewIdx !== -1) {
        reviewsStore.reviewsShopPending.splice(shopReviewIdx, 1)
      }
      break
    case 'withdrawal':
      const withdrawalIdx = withdrawalStore.withdrawals.findIndex(w => w.id === item.id)
      if (withdrawalIdx !== -1) {
        withdrawalStore.withdrawals.splice(withdrawalIdx, 1)
      }
      break
    case 'service':
      const serviceIdx = vetClinicServiceStore.pendingServices.findIndex(s => s.id === item.id)
      if (serviceIdx !== -1) {
        vetClinicServiceStore.pendingServices.splice(serviceIdx, 1)
      }
      break
  }
}

// تایید ویرایش
const approveEdit = async (item) => {
  removeItem('edit', item)
  actionType.value = 'edit'
  itemToAction.value = item
  showApproveModal.value = true
  //showToastMessage(`${item.changeLabel} ${item.entityName} تایید شد`)
}

// رد ویرایش
const rejectEdit = async (item) => {
  actionType.value = 'edit'
  itemToAction.value = {...item, name: item.entityName}
  rejectReason.value = ''
  showRejectModal.value = true
}

// نیاز به اصلاح ویرایش
const requestEditCorrection = async (item) => {
  actionType.value = 'edit'
  itemToAction.value = {...item, name: item.entityName}

  editRequiredReason.value = ''
  showEditRequiredModal.value = true
}

// آیکون نوع entity
const getEntityIcon = (type) => {
  const icons = {
    market: 'ti ti-building-store',
    pharmacy: 'ti ti-pill',
    clinic: 'ti ti-building-hospital',
    vet: 'ti ti-stethoscope',
  }
  return icons[type] || 'ti ti-building-store'
}

// رنگ نوع entity
const getEntityColor = (type) => {
  const colors = {
    market: 'text-orange-600 bg-orange-100',
    pharmacy: 'text-teal-600 bg-teal-100',
    clinic: 'text-rose-600 bg-rose-100',
    vet: 'text-emerald-600 bg-emerald-100',
  }
  return colors[type] || 'text-orange-600 bg-orange-100'
}

// آیکون نوع تغییر
const getChangeIcon = (type) => {
  const icons = {
    logo: 'ti ti-photo',
    banner: 'ti ti-photo-plus',
    address: 'ti ti-map-pin',
    phone: 'ti ti-phone',
    name: 'ti ti-edit',
    documents: 'ti ti-file-upload',
    description: 'ti ti-align-left',
  }
  return icons[type] || 'ti ti-settings'
}

// متدهای کمکی برای تعیین استایل و متن بر اساس وضعیت
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'needs_revision':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'pending':
    default:
      return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const getStatusIconBg = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100';
    case 'needs_revision':
      return 'bg-purple-100';
    case 'rejected':
      return 'text-red-100';
    default:
      return 'bg-orange-100';
  }
};

const getStatusIconColor = (status) => {
  switch (status) {
    case 'approved':
      return 'text-green-600';
    case 'needs_revision':
      return 'text-purple-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-orange-600';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'approved':
      return 'تایید شده';
    case 'needs_revision':
      return 'نیاز به اصلاح';
    case 'pending':
      return 'در انتظار بررسی';
    case 'rejected':
      return 'رد درخواست';
    default:
      return status;
  }
};
const isVideo = (type) => {
  if (!type) return false;
  // بررسی پسوند یا MIME Type ویدیو
  return type.includes('video') ||
      type.includes('.mp4') ||
      type.includes('.mov') ||
      type.includes('.webm');
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
