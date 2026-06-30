<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900">علاقه‌مندی‌ها</h1>
        <p class="text-gray-500 text-sm mt-1">محصولاتی که ذخیره کرده‌اید</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Empty State -->
      <div v-if="favorites.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="ti ti-heart-off text-gray-400 text-4xl"></i>
        </div>
        <h3 class="font-bold text-gray-900 text-lg">لیست علاقه‌مندی خالی است</h3>
        <p class="text-gray-500 mt-2">محصولات مورد علاقه خود را ذخیره کنید</p>
        <NuxtLink 
          to="/products"
          class="inline-block mt-6 px-8 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          مشاهده محصولات
        </NuxtLink>
      </div>

      <!-- Favorites Grid -->
      <div v-else>
        <!-- Actions Bar -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-500 text-sm">{{ favorites.length }} محصول</span>
          <button 
            @click="clearAllFavorites"
            class="text-red-500 text-sm hover:underline flex items-center gap-1"
          >
            <i class="ti ti-trash"></i>
            حذف همه
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="product in favorites" 
            :key="product.id"
            class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
          >
            <!-- Product Image -->
            <div class="relative aspect-square bg-gray-100">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              >
              <div v-if="product.discount" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                {{ product.discount }}% تخفیف
              </div>
              <button 
                @click="removeFromFavorites(product)"
                class="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50"
              >
                <i class="ti ti-heart-filled text-red-500"></i>
              </button>
              <div v-if="!product.available" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span class="text-white font-bold text-sm">ناموجود</span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <NuxtLink :to="`/product/${product.id}`">
                <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-500 transition-colors">
                  {{ product.name }}
                </h3>
              </NuxtLink>

              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs text-gray-500">{{ product.brand }}</span>
                <div class="flex items-center gap-1">
                  <i class="ti ti-star-filled text-yellow-400 text-xs"></i>
                  <span class="text-xs text-gray-600">{{ product.rating }}</span>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between">
                <div>
                  <div v-if="product.discount" class="text-xs text-gray-400 line-through">
                    {{ product.originalPrice.toLocaleString() }}
                  </div>
                  <div class="font-bold text-blue-600">
                    {{ product.price.toLocaleString() }}
                    <span class="text-xs font-normal text-gray-500">تومان</span>
                  </div>
                </div>
                <button 
                  v-if="product.available"
                  @click="addToCart(product)"
                  class="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <i class="ti ti-shopping-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Favorites (mock data)
const favorites = ref([
  { id: 1, name: 'غذای خشک سگ بالغ رویال کنین مدل Medium Adult', brand: 'Royal Canin', price: 850000, originalPrice: 950000, discount: 10, rating: 4.8, image: 'https://placehold.co/400x400/3b82f6/white?text=Dog+Food', available: true },
  { id: 2, name: 'غذای تر گربه ویسکاس طعم مرغ', brand: 'Whiskas', price: 65000, originalPrice: 75000, discount: 13, rating: 4.6, image: 'https://placehold.co/400x400/f97316/white?text=Cat+Food', available: true },
  { id: 3, name: 'تشویقی سگ دنتال استیکس', brand: 'Pedigree', price: 120000, originalPrice: 150000, discount: 20, rating: 4.5, image: 'https://placehold.co/400x400/14b8a6/white?text=Treats', available: true },
  { id: 4, name: 'شامپو سگ ضد کک و کنه', brand: 'Happy Dog', price: 185000, originalPrice: 185000, discount: 0, rating: 4.7, image: 'https://placehold.co/400x400/8b5cf6/white?text=Shampoo', available: true },
  { id: 5, name: 'خاک گربه ون کت معطر', brand: 'Van Cat', price: 180000, originalPrice: 200000, discount: 10, rating: 4.4, image: 'https://placehold.co/400x400/ec4899/white?text=Litter', available: false },
  { id: 6, name: 'اسباب‌بازی توپ سگ', brand: 'Kong', price: 95000, originalPrice: 95000, discount: 0, rating: 4.9, image: 'https://placehold.co/400x400/10b981/white?text=Toy', available: true },
])

// Toast
const toast = ref({ show: false, message: '', icon: '' })

const showToast = (message, icon = 'ti ti-check') => {
  toast.value = { show: true, message, icon }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

// Actions
const removeFromFavorites = (product) => {
  const index = favorites.value.findIndex(f => f.id === product.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
    showToast('از علاقه‌مندی‌ها حذف شد', 'ti ti-heart')
  }
}

const clearAllFavorites = () => {
  if (confirm('آیا از حذف همه علاقه‌مندی‌ها اطمینان دارید؟')) {
    favorites.value = []
    showToast('همه علاقه‌مندی‌ها حذف شدند', 'ti ti-trash')
  }
}

const addToCart = (product) => {
  showToast('به سبد خرید اضافه شد', 'ti ti-shopping-cart-plus')
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
  transform: translate(-50%, 20px);
}
</style>
