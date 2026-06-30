<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-30">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <i class="ti ti-arrow-right text-lg"></i>
              <span class="font-medium hidden sm:inline">بازگشت</span>
            </button>
            <div class="w-px h-6 bg-gray-200 hidden sm:block"></div>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <i class="ti ti-shopping-cart text-blue-500"></i>
              سبد خرید
            </h1>
          </div>
          <span v-if="cartItems.length > 0" class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {{ cartCount }} محصول
          </span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <!-- Empty Cart -->
      <div v-if="cartItems.length === 0" class="text-center py-20">
        <div class="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <i class="ti ti-shopping-cart-off text-6xl text-gray-300"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">سبد خرید شما خالی است</h2>
        <p class="text-gray-500 mb-6">محصولات مورد نظر خود را به سبد خرید اضافه کنید</p>
        <NuxtLink to="/products" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
          <i class="ti ti-package"></i>
          مشاهده محصولات
        </NuxtLink>
      </div>

      <!-- Cart with Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cartItems" :key="item.id" class="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex gap-4">
              <!-- Product Image -->
              <div class="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                <i v-else class="ti ti-package text-3xl md:text-4xl text-gray-300"></i>
                <div class="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full w-6 h-6 flex items-center justify-center shadow-sm text-xs font-bold text-gray-700">
                  {{ item.quantity }}
                </div>
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <p v-if="item.shopName" class="text-xs text-blue-500 mb-1 flex items-center gap-1">
                        <i class="ti ti-building-store"></i>
                        {{ item.shopName }}
                      </p>
                      <NuxtLink :to="`/product/${item.productId}`" class="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {{ item.name }}
                      </NuxtLink>
                      <div v-if="item.variant" class="mt-1.5 flex items-center gap-1.5">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {{ item.variant }}
                        </span>
                      </div>
                      <p v-if="item.category" class="text-xs text-gray-400 mt-1">{{ item.category }}</p>
                    </div>
                    <button @click="removeFromCart(item.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" title="حذف از سبد">
                      <i class="ti ti-trash text-lg"></i>
                    </button>
                  </div>
                </div>

                <div class="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                  <!-- Quantity Controls -->
                  <div class="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                    <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1" class="w-8 h-8 bg-white hover:bg-red-50 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-sm flex items-center justify-center transition-colors">
                      <i class="ti ti-minus text-sm"></i>
                    </button>
                    <span class="w-10 text-center font-bold text-gray-800 text-sm">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.id)" class="w-8 h-8 bg-white hover:bg-blue-50 hover:text-blue-600 rounded shadow-sm flex items-center justify-center transition-colors">
                      <i class="ti ti-plus text-sm"></i>
                    </button>
                  </div>

                  <!-- Price Section -->
                  <div class="text-left">
                    <div class="flex items-center justify-end gap-2 mb-1">
                      <span class="text-xs text-gray-500">قیمت واحد:</span>
                      <span class="text-sm font-bold text-gray-800">{{ formatPrice(item.price) }}</span>
                    </div>
                    <div class="flex items-center justify-end gap-2">
                      <span class="text-xs text-gray-400 line-through" v-if="item.originalPrice && item.originalPrice > item.price">
                        {{ formatPrice(item.originalPrice * item.quantity) }}
                      </span>
                      <span class="text-lg font-black text-blue-600">
                        {{ formatPrice(item.price * item.quantity) }}
                        <span class="text-xs font-normal text-gray-500 mr-1">تومان</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-gray-100 p-6 sticky top-36 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="ti ti-receipt text-blue-500"></i>
              خلاصه سفارش
            </h3>

            <div class="space-y-4 mb-6">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">قیمت کالاها ({{ cartCount }})</span>
                <span class="font-medium text-gray-900">{{ formatPrice(cartTotalWithDiscount) }} تومان</span>
              </div>

              <!-- نمایش تخفیف محصول -->
              <div v-if="cartTotalWithDiscount > cartTotal" class="flex items-center justify-between text-sm text-green-600">
                <span>تخفیف محصولات</span>
                <span>{{ formatPrice(cartTotalWithDiscount - cartTotal) }}-</span>
              </div>

              <!-- نمایش تخفیف کد کاربر -->
              <div v-if="appliedDiscount" class="flex items-center justify-between text-sm text-blue-600">
                <span>تخفیف کد: {{ appliedDiscount.code }}</span>
                <span>{{ formatPrice(appliedDiscount.amount) }}-</span>
              </div>

              <div class="border-t border-gray-100 pt-4 mt-4">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-900">مبلغ قابل پرداخت</span>
                  <span class="text-xl font-black text-blue-600">{{ formatPrice(finalCartTotal) }} تومان</span>
                </div>
              </div>
            </div>

            <!-- Discount Code Section -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">کد تخفیف</label>
              <div class="flex gap-2">
                <input
                    v-model="discountCode"
                    type="text"
                    placeholder="کد تخفیف دارید؟"
                    class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                    :disabled="isApplying"
                />
                <button
                    @click="handleApplyDiscount"
                    :disabled="isApplying"
                    class="px-4 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                >
                  <span v-if="isApplying">...</span>
                  <span v-else>اعمال</span>
                </button>
              </div>

              <!-- پیام‌های خطا یا موفقیت -->
              <p v-if="discountMessage" :class="discountMessage.type === 'error' ? 'text-red-500' : 'text-green-500'" class="text-xs mt-2">
                {{ discountMessage.text }}
              </p>

              <!-- دکمه حذف کد تخفیف -->
              <button v-if="appliedDiscount" @click="handleRemoveDiscount" class="text-xs text-red-500 hover:text-red-700 mt-2 underline">
                حذف کد تخفیف
              </button>
            </div>

            <!-- Checkout Button -->
            <NuxtLink
                to="/checkout"
                class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
            >
              <i class="ti ti-credit-card text-lg"></i>
              ادامه فرآیند خرید
            </NuxtLink>

            <!-- Continue Shopping -->
            <NuxtLink
                to="/products"
                class="w-full flex items-center justify-center gap-2 mt-3 px-6 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors text-sm"
            >
              <i class="ti ti-arrow-right"></i>
              انتخاب محصولات دیگر
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// استفاده از کامپوزابل جدید
const {
  cartItems,
  cartCount,
  cartTotal,
  cartTotalWithDiscount,
  cartDiscount,
  finalCartTotal,
  appliedDiscount,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  applyDiscount,
  removeDiscount
} = useCart()

const discountCode = ref('')
const isApplying = ref(false)
const discountMessage = ref({ text: '', type: '' })

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// تابع اعمال کد تخفیف
const handleApplyDiscount = async () => {
  if (!discountCode.value.trim()) {
    discountMessage.value = { text: 'لطفاً کد تخفیف را وارد کنید.', type: 'error' }
    return
  }

  isApplying.value = true
  discountMessage.value = { text: '', type: '' }

  try {
    await applyDiscount(discountCode.value)
    discountMessage.value = { text: 'کد تخفیف با موفقیت اعمال شد.', type: 'success' }
    discountCode.value = '' // پاک کردن اینپوت
  } catch (error) {
    // خطا از سمت سرویس پرتاب می‌شود
    discountMessage.value = {
      text: error.response?.data?.message || 'کد تخفیف نامعتبر است.',
      type: 'error'
    }
  } finally {
    isApplying.value = false
  }
}

// تابع حذف کد تخفیف
const handleRemoveDiscount = () => {
  removeDiscount()
  discountMessage.value = { text: '', type: '' }
}

// پاک کردن خودکار پیام پس از ۳ ثانیه
watch(discountMessage, (newVal) => {
  if (newVal.text) {
    setTimeout(() => {
      discountMessage.value = { text: '', type: '' }
    }, 3000)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>