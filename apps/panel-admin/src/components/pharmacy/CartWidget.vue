<template>
  <Teleport to="body">
    <!-- Cart Button (Fixed) -->
    <button
      v-if="!cart.isEmpty"
      @click="cart.toggleCart"
      class="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110"
    >
      <i class="ti ti-shopping-cart w-6 h-6"></i>
      <span 
        v-if="cart.totalItems > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
      >
        {{ cart.totalItems }}
      </span>
    </button>

    <!-- Cart Sidebar -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="cart.isOpen"
        class="fixed inset-y-0 right-0 z-50 w-96 bg-white dark:bg-neutral-800 shadow-xl"
      >
        <!-- Cart Header -->
        <div class="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            سبد خرید
          </h3>
          <button
            @click="cart.closeCart"
            class="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <i class="ti ti-x w-6 h-6"></i>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cart.isEmpty" class="text-center py-8">
            <i class="ti ti-shopping-cart w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4"></i>
            <p class="text-neutral-500 dark:text-neutral-400">سبد خرید شما خالی است</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="flex items-center space-x-4 space-x-reverse p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-12 h-12 object-cover rounded"
              />
              <div v-else class="w-12 h-12 bg-neutral-200 dark:bg-neutral-600 rounded flex items-center justify-center">
                <i class="ti ti-photo w-6 h-6 text-neutral-400"></i>
              </div>

              <div class="flex-1">
                <h4 class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.name }}</h4>
                <p v-if="item.pharmacyName" class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ item.pharmacyName }}
                </p>
                <p class="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {{ formatPrice(item.price) }} تومان
                </p>
              </div>

              <div class="flex items-center space-x-2 space-x-reverse">
                <button
                  @click="cart.updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-500"
                >
                  <i class="ti ti-minus w-4 h-4"></i>
                </button>
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                <button
                  @click="cart.updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-500"
                >
                  <i class="ti ti-plus w-4 h-4"></i>
                </button>
                <button
                  @click="cart.removeItem(item.id)"
                  class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
                >
                  <i class="ti ti-trash w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div v-if="!cart.isEmpty" class="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">مجموع:</span>
            <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
              {{ formatPrice(cart.totalPrice) }} تومان
            </span>
          </div>
          
          <div class="space-y-2">
            <button
              @click="proceedToCheckout"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              ادامه خرید
            </button>
            <button
              @click="cart.clearCart"
              class="w-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 py-2 rounded-lg font-medium transition-colors"
            >
              پاک کردن سبد
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cart.isOpen"
        @click="cart.closeCart"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const router = useRouter()
const cart = useCartStore()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

const proceedToCheckout = () => {
  // Navigate to checkout page
  router.push('/pharmacy/checkout')
  cart.closeCart()
}

// Expose method for adding items to cart
const addToCart = (product: any, pharmacyName = 'داروخانه') => {
  cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    pharmacyName,
    quantity: 1
  })
  cart.openCart()
}

defineExpose({
  addToCart
})
</script>
