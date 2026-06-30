<template>
  <div class="min-h-screen bg-gray-50">
    <ClientOnly>
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900">تکمیل سفارش</h1>
        <p class="text-gray-500 text-sm mt-1">{{ cartItems.length }} محصول در سبد خرید</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Address Section -->
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="ti ti-map-pin text-blue-500"></i>
                آدرس تحویل
              </h2>
              <button
                  @click="showAddressModal = true"
                  class="text-blue-600 text-sm font-medium hover:underline"
              >
                تغییر آدرس
              </button>
            </div>

            <!-- نمایش آدرس انتخاب شده -->
            <div v-if="selectedAddress" class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-home text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ selectedAddress.title }}</h3>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ selectedAddress.fullAddress.address?.road }} .
                    {{ selectedAddress.fullAddress.address?.town??selectedAddress.fullAddress.address?.suburb }} .
                    {{ selectedAddress.fullAddress.address?.state }}
                  </p>
                  <p class="text-gray-500 text-sm mt-2">
                    <i class="ti ti-user text-gray-400 ml-1"></i>
                    {{ selectedAddress.receiver }} - {{ selectedAddress.phone }}
                  </p>
                </div>
              </div>
            </div>

            <!-- حالت خالی بودن آدرس -->
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="ti ti-map-pin-off text-3xl text-gray-400"></i>
              </div>
              <p class="text-gray-500 mb-4">آدرسی ثبت نشده است</p>
              <button
                  @click="showAddressModal = true"
                  class="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"
              >
                افزودن آدرس
              </button>
            </div>
          </div>

          <!-- Delivery Time -->
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <i class="ti ti-clock text-teal-500"></i>
              زمان تحویل
            </h2>

            <!-- Days Selection -->
            <div class="mb-5">
              <p class="text-sm text-gray-600 mb-3">انتخاب روز:</p>
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    v-for="day in deliveryDays"
                    :key="day.date"
                    @click="selectedDay = day.date"
                    :class="[
                    'flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition-all min-w-[70px]',
                    selectedDay === day.date
                      ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-blue-100 shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <span :class="[
                    'text-2xl font-bold transition-colors',
                    selectedDay === day.date ? 'text-blue-600' : 'text-gray-800'
                  ]">
                    {{ day.dateNum }}
                  </span>
                  <span :class="[
                    'text-xs font-medium mt-1 transition-colors',
                    selectedDay === day.date ? 'text-blue-600' : 'text-gray-600'
                  ]">
                    {{ day.dayName }}
                  </span>
                  <span :class="[
                    'text-[10px] mt-0.5 transition-colors',
                    selectedDay === day.date ? 'text-blue-400' : 'text-gray-400'
                  ]">
                    {{ day.monthName }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Time Slots -->
            <div>
              <p class="text-sm text-gray-600 mb-3">انتخاب بازه زمانی:</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                    v-for="slot in availableTimeSlots"
                    :key="slot.id"
                    @click="selectedTimeSlot = slot.id"
                    :disabled="!slot.available"
                    :class="[
                    'p-3 rounded-xl border-2 text-center transition-all',
                    !slot.available
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : selectedTimeSlot === slot.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <p class="font-semibold text-gray-900 text-sm">{{ slot.time }}</p>
                  <p v-if="slot.price === 0" class="text-xs text-green-600 font-medium mt-1">رایگان</p>
                  <p v-else class="text-xs text-gray-600 mt-1">{{ formatPrice(slot.price) }} تومان</p>
                  <p v-if="!slot.available" class="text-xs text-red-500 mt-1">تکمیل شد</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Shipping Method -->
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <i class="ti ti-truck text-green-500"></i>
              نحوه ارسال
            </h2>
            <div class="space-y-3">
              <button
                  v-for="method in shippingMethods"
                  :key="method.id"
                  @click="selectedShippingMethod = method.id"
                  :class="[
            'w-full p-4 rounded-xl border-2 text-right transition-all flex items-center gap-4',
            selectedShippingMethod === method.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
        ]"
              >
                <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            selectedShippingMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
          ]">
                  <i :class="[
              method.icon, 'text-xl',
              selectedShippingMethod === method.id ? 'text-blue-600' : 'text-gray-500'
            ]"></i>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-gray-900">{{ method.name }}</h4>
                    <span v-if="method.tag"
                          class="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
              {{ method.tag }}
            </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ method.description }}</p>
                </div>
                <div class="text-left flex-shrink-0">
                  <p v-if="method.price === 0" class="text-green-600 font-semibold text-sm">رایگان</p>
                  <p v-else class="text-gray-900 font-semibold text-sm">{{ formatPrice(Number(method.price)) }} تومان</p>
                </div>
                <div :class="[
            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
            selectedShippingMethod === method.id
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
          ]">
                  <i v-if="selectedShippingMethod === method.id" class="ti ti-check text-white text-xs"></i>
                </div>
              </button>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <i class="ti ti-credit-card text-indigo-500"></i>
              نحوه پرداخت
            </h2>
            <div class="space-y-3">
              <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="selectedPaymentMethod = method.id"
                  :disabled="!method.available"
                  :class="[
                   'w-full p-4 rounded-xl border-2 text-right transition-all flex items-center gap-4',
                   !method.available
                     ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                     : selectedPaymentMethod === method.id
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-200 hover:border-gray-300'
                 ]"
              >
                <div :class="[
                   'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                   selectedPaymentMethod === method.id && method.available ? 'bg-blue-100' : 'bg-gray-100'
                 ]">
                  <i :class="[
                     method.icon, 'text-xl',
                     selectedPaymentMethod === method.id && method.available ? 'text-blue-600' : 'text-gray-500'
                   ]"></i>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-gray-900">{{ method.name }}</h4>
                    <span v-if="!method.available"
                          class="text-[10px] px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full font-medium">
                       به زودی
                     </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ method.description }}</p>

                  <!-- نمایش موجودی و وضعیت کیف پول -->
                  <div v-if="method.id === 'wallet'" class="mt-2 flex flex-col gap-1">
                    <div class="flex items-center justify-start text-xs">
                      <span class="text-gray-500">موجودی:</span>
                      <span class="font-bold text-gray-700">{{ formatPrice(wallet?.balance??0) }} تومان</span>
                    </div>

                    <!-- پیام و دکمه هنگام کمبود موجودی -->
                    <div v-if="wallet?.balance < total" class="flex flex-col gap-2">
                      <div class="flex items-center gap-1 text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded-md w-fit">
                        <i class="ti ti-alert-circle"></i>
                        <span>موجودی کافی نیست (کمبود {{ formatPrice(total - wallet?.balance) }} تومان)</span>
                      </div>
                      <!-- دکمه افزایش موجودی -->
                      <button
                          @click="router.push({ path: '/profile', query: { tab: 'wallet' } })"
                          class="flex items-center justify-center gap-1 text-[10px] font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md transition-colors w-fit"
                      >
                        <i class="ti ti-plus"></i>
                        افزایش موجودی
                      </button>
                    </div>

                    <!-- پیام هنگام کافی بودن موجودی -->
                    <div v-else class="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                      <i class="ti ti-check"></i>
                      <span>موجودی کافی برای پرداخت</span>
                    </div>
                  </div>
                </div>

                <div :class="[
                   'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                   selectedPaymentMethod === method.id && method.available
                     ? 'border-blue-500 bg-blue-500'
                     : 'border-gray-300'
                 ]">
                  <i v-if="selectedPaymentMethod === method.id && method.available"
                     class="ti ti-check text-white text-xs"></i>
                </div>
              </button>
            </div>
            <!-- Payment Security Note -->
            <div class="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="ti ti-shield-check text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-green-800">پرداخت امن</p>
                <p class="text-xs text-green-600">اطلاعات پرداخت شما با رمزنگاری SSL محافظت می‌شود</p>
              </div>
            </div>
          </div>

          <!-- Cart Items -->
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <i class="ti ti-shopping-cart text-purple-500"></i>
              سبد خرید
            </h2>

            <div class="space-y-4">
              <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div class="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-20 h-20 rounded-lg object-cover"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</h4>
                  <p class="text-xs text-gray-500 mb-2">{{ item.shop }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <button
                          @click="decreaseQuantity(item.id)"
                          class="w-7 h-7 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        <i class="ti ti-minus text-sm"></i>
                      </button>
                      <span class="text-sm font-semibold w-6 text-center">{{ item.quantity }}</span>
                      <button
                          @click="increaseQuantity(item.id)"
                          class="w-7 h-7 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        <i class="ti ti-plus text-sm"></i>
                      </button>
                    </div>
                    <p class="text-sm font-bold text-blue-600">{{ formatPrice(item.price * item.quantity) }} تومان</p>
                  </div>
                </div>
                <button
                    @click="removeFromCart(item.id)"
                    class="p-2 text-gray-400 hover:text-red-500 self-start"
                >
                  <i class="ti ti-trash text-lg"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <i class="ti ti-note text-amber-500"></i>
              توضیحات سفارش
            </h2>
            <textarea
                v-model="orderNotes"
                placeholder="اگر توضیحات یا درخواست خاصی دارید، اینجا بنویسید..."
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 sticky top-24">
            <h2 class="text-lg font-bold text-gray-900 mb-4">خلاصه سفارش</h2>

            <!-- Discount Code -->
<!--            <div class="mb-4">
              <div class="flex gap-2">
                <input
                    v-model="discountCode"
                    type="text"
                    placeholder="کد تخفیف"
                    class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                    @click="applyDiscount"
                    class="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"
                >
                  اعمال
                </button>
              </div>
              <p v-if="discountApplied" class="text-green-600 text-xs mt-2 flex items-center gap-1">
                <i class="ti ti-check"></i>
                کد تخفیف اعمال شد
              </p>
            </div>-->

            <div class="space-y-3 pb-4 border-b border-gray-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">قیمت کالاها ({{ cartItems.length }})</span>
                <span class="text-gray-900">{{ formatPrice(subtotal) }} تومان</span>
              </div>
              <div v-if="totalDiscount > 0" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">تخفیف کالاها</span>
                <span class="text-red-500">{{ formatPrice(totalDiscount) }}- تومان</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">هزینه ارسال</span>
                <span :class="shippingCost === 0 ? 'text-green-600' : 'text-gray-900'">
                  {{ shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost) + ' تومان' }}
                </span>
              </div>
              <div v-if="discountApplied" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">کد تخفیف</span>
                <span class="text-red-500">{{ formatPrice(appliedDiscount.amount) }}- تومان</span>
              </div>
            </div>

            <div class="flex items-center justify-between py-4">
              <span class="font-bold text-gray-900">مبلغ قابل پرداخت</span>
              <span class="text-xl font-bold text-blue-600">{{ formatPrice(total) }} تومان</span>
            </div>

            <button
                @click="submitOrder"
                :disabled="!selectedAddress || cartItems.length === 0"
                :class="[
                'w-full py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2',
                selectedAddress && cartItems.length > 0
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              ]"
            >
              <i class="ti ti-credit-card text-xl"></i>
              پرداخت و ثبت سفارش
            </button>

            <div class="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <i class="ti ti-shield-check text-green-500"></i>
              پرداخت امن با درگاه بانکی
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
            v-if="showAddressModal"
            class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
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
                    <span v-if="address.isDefault" class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">پیش‌فرض</span>
                    <p class="text-gray-600 text-sm mt-1">{{ address.fullAddress.address?.road }} .
                      {{ address.fullAddress.address?.town??address.fullAddress.address?.suburb }} .
                      {{ address.fullAddress.address?.state }}</p>
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
                        v-model="addressData"
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
    </ClientOnly>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {storeToRefs} from "pinia";
import {useShopStore} from "../stores/shop.store.ts";
import {useAuthStore} from "../stores/auth.ts"
//import AddressSelector from "../components/AddressSelector.vue";
import AddressSelector from '../../../shared/components/AddressSelector.vue'
// فرض بر این است که useCart و useRouter نیز ایمپورت شده‌اند
import {useCart} from '../composables/useCart' // مسیر را بر اساس پروژه خود تنظیم کنید
import {useRouter} from 'vue-router'
import {usePaymentStore} from "../stores/payment.store.js";
import {useAddressStore} from "../stores/address.store.js";
import {useWalletStore} from "../stores/wallet.store.js";
import { useNuxtApp } from 'nuxt/app';
import {useRuntimeConfig} from "nuxt/app";
import moment from 'moment-jalaali';
// متغیر کمکی برای دریافت داده‌های نقشه
const addressData = ref({
  address: {},
  province: '',
  city: '',
  location: null
})
const shopStore = useShopStore()
const authStore = useAuthStore()
const addressStore=useAddressStore()
const walletStore=useWalletStore()
const router = useRouter()
const {$toast}=useNuxtApp()
const currentUrl = ref('')
const config = useRuntimeConfig()
const isAuthenticated = computed(()=>authStore.isAuthenticated)
// Use global cart
const {
  cartItems,
  cartCount,
  cartTotal,appliedDiscount,
  removeFromCart: removeItem,
  increaseQuantity: increaseItem,
  decreaseQuantity: decreaseItem,
  clearCart
} = useCart()
// استخراج شناسه فروشگاه از اولین آیتم سبد خرید
const currentShopId = computed(() => {
  if (cartItems.value && cartItems.value.length > 0) {
    return cartItems.value[0].shopId
  }
  return null
})
// --- بخش آدرس‌ها (اصلاحات انجام شد) ---
// اتصال به لیست آدرس‌های استور به صورت کاملاً داینامیک
const addresses = computed(() => addressStore.addresses)

// آدرس انتخاب شده: به صورت پیش‌فرض اولین آدرس موجود
const selectedAddress = ref(addresses.value?.length > 0 ? addresses.value[0] : null)

// کنترل نمایش مودال
const showAddressModal = ref(false)

// آبجکت reactive برای ذخیره اطلاعات آدرس در حال ثبت
const newCheckoutAddress = reactive({
  address: {},
  province: '',
  city: '',
  location: null,
  lat:'',
  lng:'',
  title: '', // عنوان آدرس اضافه شد
  receiver: '', // نام گیرنده اضافه شد
  phone: '' // شماره تماس اضافه شد
})
// بررسی لاگین بودن هنگام باز شدن مودال آدرس
watch(showAddressModal, (newVal) => {
  if (newVal === true) {
    // اگر کاربر لاگین نیست
    // --- بررسی لاگین بودن کاربر ---
    if (!isAuthenticated.value) {

      // 1. Show Warning Toast
      // Note: Adjust the parameters based on your specific Toast implementation
      // Assuming $toast accepts (message, severity, life)
      if ($toast && typeof $toast === 'function') {
        $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
      }

      // 2. Redirect to Login Page with redirect URL
      // This allows the user to come back to /register after login
      // If using NuxtLink behavior via router
      // router.push(`/login?redirect=${encodeURIComponent('/register')}`);

      // Since the login button elsewhere uses an external URL, we do the same here
      window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;

    }
  }
})
// همگام‌سازی داده‌های نقشه با فرم اصلی
watch(addressData, (newVal) => {

  if (newVal) {
    const info = extractAddressInfo(newVal)
    // کپی کردن lat, lng و address به فرم اصلی
    newCheckoutAddress.address = info.address
    newCheckoutAddress.lat = info.lat
    newCheckoutAddress.lng = info.lng
    newCheckoutAddress.city = info.city
    newCheckoutAddress.province = info.province
  }
}, { deep: true })

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

// تابع مدیریت افزودن آدرس جدید (نسخه نهایی متصل به استور)
const handleNewAddress = async (newAddressData) => {

  // --- بررسی لاگین بودن کاربر ---
  if (!isAuthenticated.value) {

    // 1. Show Warning Toast
    // Note: Adjust the parameters based on your specific Toast implementation
    // Assuming $toast accepts (message, severity, life)
    if ($toast && typeof $toast === 'function') {
      $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    }

    // 2. Redirect to Login Page with redirect URL
    // This allows the user to come back to /register after login
    // If using NuxtLink behavior via router
    // router.push(`/login?redirect=${encodeURIComponent('/register')}`);

    // Since the login button elsewhere uses an external URL, we do the same here
    window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;
    return
  }
  if (!addressData) return

  const rawAddressData = addressData.value?.address || {}
  const fullAddressDetails = JSON.parse(JSON.stringify(rawAddressData))

  const completeAddressPayload = {
    display_name: fullAddressDetails.display_name || '',
    lat: parseFloat(fullAddressDetails.lat),
    lon: parseFloat(fullAddressDetails.lon),
    ...fullAddressDetails
  }

  // آماده‌سازی داده‌ها مطابق اینترفیس استور
  const payload = {
    title: newAddressData.title || newCheckoutAddress.title || 'آدرس جدید',
    receiver: newAddressData.receiver || newCheckoutAddress.receiver || '',
    phone: newAddressData.phone || newCheckoutAddress.phone || '',
    fullAddress: completeAddressPayload,

  }

  try {

    // (چون استور لیست را آپدیت کرد، اینجا فقط آی‌دی را ست می‌کنیم)
    selectedAddress.value = await addressStore.addUserAddress(payload)

    // بستن مودال
    showAddressModal.value = false

    // پاک کردن فرم
    Object.assign(newCheckoutAddress, {
      address: {}, province: '', city: '', location: null,lat:'',lng:'', title: '', receiver: '', phone: ''
    })

  } catch (error) {
    console.error('خطا در ثبت آدرس:', error)
    alert('مشکلی در ثبت آدرس پیش آمده است')
  }
}

const selectAddress = (address) => {
  selectedAddress.value = address
  showAddressModal.value = false
}

// --- بقیه کدها (بدون تغییر یا با اصلاحات جزئی) ---

const {shipping} = storeToRefs(shopStore)

// Delivery Days - Generate dynamic days
const persianWeekDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

const toPersianNum = (num) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  return num.toString().replace(/\d/g, (d) => persianDigits[d])
}

const deliveryDays = computed(() => {
  const days = [];
  const today = moment(); // ساعت تهران
  today.hours(0).minutes(0).seconds(0).milliseconds(0);

  for (let i = 0; i < 7; i++) {
    const date = moment(today).add(i, 'days');
    const jalaliDay = date.jDate();
    const jalaliMonth = date.jMonth() + 1; // jMonth از 0 شروع می‌شود
    const jalaliYear = date.jYear();

    const weekDay = date.day(); // 0=یکشنبه, 5=جمعه
    const persianWeekDay = persianWeekDays[weekDay];

    let dayName = '';
    if (i === 0) dayName = 'امروز';
    else if (i === 1) dayName = 'فردا';
    else dayName = persianWeekDay;

    days.push({
      date: date.format('YYYY-MM-DD'), // تاریخ میلادی برای فریم‌ورک
      dayName,
      dateNum: toPersianNum(jalaliDay),
      monthName: persianMonths[jalaliMonth - 1],
      dateLabel: `${toPersianNum(jalaliDay)} ${persianMonths[jalaliMonth - 1]}`,
      weekDay: persianWeekDay,
      isFriday: weekDay === 5
    });
  }
  return days;
});

const selectedDay = ref(deliveryDays.value[1]?.date || deliveryDays.value[0]?.date)

// Time Slots
const timeSlots = ref([
  {id: 1, time: 'ساعت ۹ تا ۱۲', price: 0, available: true},
  {id: 2, time: 'ساعت ۱۲ تا ۱۵', price: 0, available: true},
  {id: 3, time: 'ساعت ۱۵ تا ۱۸', price: 0, available: true},
  {id: 4, time: 'ساعت ۱۸ تا ۲۱', price: 15000, available: true},
  {id: 5, time: 'ساعت ۲۱ تا ۲۴', price: 25000, available: false},
])

const availableTimeSlots = computed(() => {
  const selectedDayData = deliveryDays.value.find(d => d.date === selectedDay.value)

  if (selectedDayData?.dayName === 'امروز') {
    const now = new Date()
    const currentHour = now.getHours()

    return timeSlots.value.map(slot => {
      const startHour = parseInt(slot.time.match(/\d+/)?.[0]) || 0
      const isPast = currentHour >= startHour

      return {
        ...slot,
        available: slot.available && !isPast
      }
    })
  }

  if (selectedDayData?.isFriday) {
    return timeSlots.value.map(slot => ({
      ...slot,
      available: slot.id <= 3
    }))
  }

  return timeSlots.value
})

const selectedTimeSlot = ref(1)

// Shipping Methods
const shippingMethods = ref([])


const updateShippingMethods = () => {
  if (!shipping.value) return

  const methods = [
    {
      id: 'alopeyk',
      name: 'الوپیک',
      description: shipping.value.alopeykDeliveryTime || 'ارسال سریع الوپیک',
      icon: 'ti ti-package',
      price: parseInt(shipping.value.alopeykPrice),
      tag: null,
      active: shipping.value.alopeyk
    },
    {
      id: 'inPerson',
      name: 'تحویل حضوری',
      description: shipping.value.inPersonDeliveryTime || 'دریافت از فروشگاه',
      icon: 'ti ti-building-store',
      price: parseInt(shipping.value.inPersonPrice),
      tag: null,
      active: shipping.value.inPerson
    },
    {
      id: 'petomanCourier',
      name: 'پیک پتومن',
      description: shipping.value.petomanCourierDeliveryTime || 'ارسال توسط پیک فروشگاه',
      icon: 'ti ti-motorbike',
      price: parseInt(shipping.value.petomanCourierPrice),
      tag: 'سریع',
      active: shipping.value.petomanCourier
    },
    {
      id: 'shopCourier',
      name: 'پست فروشگاه',
      description: shipping.value.shopCourierDeliveryTime || 'ارسال معمولی',
      icon: 'ti ti-truck',
      price: parseInt(shipping.value.shopCourierPrice) || 0,
      tag: null,
      active: shipping.value.shopCourier
    },
    {
      id: 'tipax',
      name: 'تیپاکس',
      description: shipping.value.tipaxDeliveryTime || 'ارسال سریع تیپاکس',
      icon: 'ti ti-package',
      price: parseInt(shipping.value.tipaxPrice),
      tag: null,
      active: shipping.value.tipax
    },
    {
      id: 'post',
      name: 'پست جمهوری اسلامی',
      description: shipping.value.postDeliveryTime || 'ارسال سراسری',
      icon: 'ti ti-world',
      price: parseInt(shipping.value.postPrice),
      tag: null,
      active: shipping.value.post
    }
  ]
  shippingMethods.value = methods.filter(m => m.active)
}

watch(shipping, () => {
  updateShippingMethods()
}, {immediate: true})

const selectedShippingMethod = ref('alopeyk')
const wallet = computed(()=>walletStore.wallet)
// Payment Methods
const paymentMethods = ref([
  {
    id: 'online',
    name: 'پرداخت آنلاین',
    description: 'پرداخت از طریق درگاه بانکی',
    icon: 'ti ti-credit-card',
    available: true
  },
  {
    id: 'wallet',
    name: 'کیف پول',
    description: 'پرداخت از موجودی کیف پول',
    icon: 'ti ti-wallet',
    available: true
  },
  {
    id: 'installment',
    name: 'خرید اقساطی',
    description: 'پرداخت به صورت اقساط',
    icon: 'ti ti-calendar-dollar',
    available: false
  },
])

const selectedPaymentMethod = ref('online')

// Discount
const discountCode = ref('')
const discountApplied = ref(appliedDiscount.value!==null)

// Notes
const orderNotes = ref('')

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.originalPrice || item.price) * item.quantity, 0)
})

const totalDiscount = computed(() => {
  return cartItems.value.reduce((total, item) => {
    if (item.originalPrice) {
      return total + (item.originalPrice - item.price) * item.quantity
    }
    return total
  }, 0)
})

const shippingCost = computed(() => {
  const method = shippingMethods.value.find(m => m.id === selectedShippingMethod.value)
  const slot = availableTimeSlots.value.find(s => s.id === selectedTimeSlot.value)
  return (method?.price || 0) + (slot?.price || 0)
})

const total = computed(() => {
  let amount = subtotal.value - totalDiscount.value + Number(shippingCost.value)
  if (discountApplied.value) {
    amount -= appliedDiscount.value.amount
  }
  return Math.max(0, amount)
})

// Methods
const increaseQuantity = (productId) => {
  increaseItem(productId)
}

const decreaseQuantity = (productId) => {
  decreaseItem(productId)
}

const removeFromCart = (productId) => {
  removeItem(productId)
}

const paymentStore = usePaymentStore()
const submitOrder = async () => {

  // --- بررسی لاگین بودن کاربر ---
  if (!isAuthenticated.value) {

    // 1. Show Warning Toast
    // Note: Adjust the parameters based on your specific Toast implementation
    // Assuming $toast accepts (message, severity, life)
    if ($toast && typeof $toast === 'function') {
      $toast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning', 5000);
    }

    // 2. Redirect to Login Page with redirect URL
    // This allows the user to come back to /register after login
    // If using NuxtLink behavior via router
    // router.push(`/login?redirect=${encodeURIComponent('/register')}`);

    // Since the login button elsewhere uses an external URL, we do the same here
    window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(currentUrl.value)}`;
  }

  // --- بررسی موجودی کیف پول ---
  if (selectedPaymentMethod.value === 'wallet') {
    if (!wallet.value || wallet.value.balance < total.value) {
      alert('موجودی کیف پول شما برای پرداخت این سفارش کافی نیست. لطفاً موجودی خود را افزایش دهید.')
      // هدایت به صفحه کیف پول
      await router.push({ path: '/profile', query: { tab: 'wallet' } })
      return
    }
  }
  // --- Start of Validation: Check Single Seller ---
  // بررسی می‌کند که آیا همه محصولات متعلق به یک فروشگاه هستند یا خیر
  let sellerId = null; // تعریف متغیر برای نگهداری شناسه فروشنده

  if (cartItems.value && cartItems.value.length > 0) {
    // دریافت شناسه فروشنده از اولین محصول به عنوان مرجع
    sellerId = cartItems.value[0].shopId;

    // بررسی اینکه آیا بقیه محصولات همان فروشنده را دارند یا خیر
    const hasMultipleSellers = cartItems.value.some(item => item.shopId !== sellerId);

    if (hasMultipleSellers) {
      alert('لطفاً فقط محصولات یک فروشگاه را در سبد خرید خود داشته باشید. امکان ثبت سفارش از چند فروشگاه مختلف وجود ندارد.');
      return; // توقف عملیات ثبت سفارش
    }
  }
  // --- End of Validation ---

  // ۱. دریافت اطلاعات زمان تحویل
  const selectedDayData = deliveryDays.value.find(d => d.date === selectedDay.value);
  const selectedSlot = availableTimeSlots.value.find(s => s.id === selectedTimeSlot.value);
  const{id,time,available}=selectedSlot

  const cleanItems = cartItems.value.map(item => ({
    id: item.id,
    quantity: item.quantity,
    shopId: item.shopId,
    productId:item.productId,
    variantId:item.variantId
  }));


  // آماده‌سازی داده‌های سفارش
  const orderPayload = {
    addressId: selectedAddress.value?.id,
    shippingMethod: selectedShippingMethod.value,
    deliveryDate: selectedDayData,
    deliveryTimeSlot: {id:id,time:time,available:available},
    paymentMethod: selectedPaymentMethod.value,
    discountCode: appliedDiscount.value?.code ? appliedDiscount.value.code : null,
    notes: orderNotes.value,
    items: cleanItems,
    sellerId: sellerId
  };

  try {
    // ۲. ارسال درخواست ثبت سفارش
    const response = await paymentStore.submitPaymentOrder(orderPayload);

    if (response.data.actionType==='ORDER_COMPLETED') {
      $toast(response.message, 'success', 5000);
      clearCart();
      await router.push({
        path: 'order/success',
        query: {
          code: response.data.data.code,
          amount: response.data.data.amount,
          ref: response.data.data.ref,
          deliveryDate: response.data.data.deliveryDate,
          deliveryTime: response.data.data.deliveryTime
        }
      });
      return;
    }

    // حالت سوم: پرداخت آنلاین است (بک‌اند اطلاعات لازم را برگردانده است)
    if (response.data.requiresAction && response.data.actionType === 'ONLINE_PAYMENT_REDIRECT') {

      const { orderId, amount, tenantId } = response.data.data;

      const gatewayResponse = await paymentStore.initiateMarketPayment({
        orderId: orderId,
        amount: amount,
        tenantId: tenantId,
        meta: { description: `پرداخت سفارش شماره ${orderId}` }
      });

      // ۴. هدایت کاربر به درگاه بانکی
      if (gatewayResponse.paymentUrl) {
        $toast('هدایت به درگاه بانکی', 'success', 5000);
        clearCart();
        window.location.href = gatewayResponse.paymentUrl;
      } else {

        $toast('خطا در دریافت لینک درگاه بانکی', 'error', 5000);
      }
    } else {

      $toast('خطا در برقراری ارتباط با سرور. لطفاً مجددا تلاش کنید.', 'error', 5000);
    }

  } catch (err) {
    let errorMessage = 'خطایی رخ داد و ثبت سفارش انجام نشد.';

    // 1. بررسی وضعیت (Status Code)
    const status = err.response?.status;
    const responseData = err.response?.data;

    if (status === 400 && Array.isArray(responseData.message)) {
      // اگر خطا 400 بود و پیام‌ها آرایه باشند
      errorMessage = responseData.message.join(' | ');

    }else if (status === 400) {
      errorMessage = responseData.message;
    } else if (status === 401) {
      errorMessage = 'شناسایی نشد. لطفا وارد حساب کاربری شوید.';
    } else if (status === 403) {
      errorMessage = 'دسترسی غیرمجاز است.';
    } else if (status >= 500) {
      errorMessage = 'خطا در سرور رخ داده است. لطفا بعدا تلاش کنید.';
    } else {
      // خطای عمومی یا شبکه
      errorMessage = err.message || 'ارتباط با سرور برقرار نشد.';
    }
    $toast(errorMessage, 'warning', 5000,status);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

onMounted(async () => {

  currentUrl.value = window.location.href;

  if (currentShopId.value) {

    await shopStore.fetchShopSettings(String(currentShopId.value))
    timeSlots.value=shopStore.rawSettings.timeSlots.slots
  } else {
    await router.push('/cart')
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
</style>
