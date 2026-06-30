<template>
  <div class="pet-store min-h-screen bg-gray-50">
    <!-- Store Header -->
    <div class="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="text-5xl">🐾</div>
          <div>
            <h1 class="text-3xl font-bold">پت استور تخصصی</h1>
            <p class="text-purple-100">برندهای معتبر سگ و گربه</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Brand Filter -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex space-x-6 space-x-reverse overflow-x-auto">
          <button v-for="brand in brands" :key="brand.id"
                  @click="selectedBrand = brand.id"
                  :class="[
                    'px-4 py-2 rounded-lg whitespace-nowrap transition-colors border',
                    selectedBrand === brand.id 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  ]">
            {{ brand.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Premium Products -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">محصولات برندی</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts" :key="product.id"
             class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border">
          <div class="relative">
            <div class="h-56 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <span class="text-5xl">{{ product.emoji }}</span>
            </div>
            <div class="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
              {{ product.brand }}
            </div>
            <div v-if="product.isNew" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              جدید
            </div>
          </div>
          
          <div class="p-5">
            <h3 class="font-bold text-lg mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ product.description }}</p>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex text-yellow-400">
                <span v-for="star in 5" :key="star">
                  {{ star <= product.rating ? '⭐' : '☆' }}
                </span>
              </div>
              <span class="text-sm text-gray-500 mr-2">({{ product.reviews }} نظر)</span>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
                  {{ product.originalPrice.toLocaleString() }}
                </span>
                <span class="text-purple-600 font-bold text-lg">
                  {{ product.price.toLocaleString() }} تومان
                </span>
              </div>
              <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const selectedBrand = ref(1);

const brands = ref([
  { id: 1, name: 'همه برندها' },
  { id: 2, name: 'Royal Canin' },
  { id: 3, name: 'Hill\'s Science' },
  { id: 4, name: 'Purina Pro Plan' },
  { id: 5, name: 'Whiskas' },
  { id: 6, name: 'Pedigree' },
]);

const products = ref([
  { 
    id: 1, 
    name: 'غذای خشک سگ رویال کنین', 
    description: 'تغذیه کامل برای سگ‌های بالغ', 
    price: 320000, 
    originalPrice: 380000,
    brandId: 2, 
    brand: 'Royal Canin',
    emoji: '🍖',
    rating: 5,
    reviews: 45,
    isNew: true
  },
  { 
    id: 2, 
    name: 'غذای درمانی هیلز ساینس', 
    description: 'مخصوص سگ‌های مشکل هضمی', 
    price: 450000, 
    brandId: 3, 
    brand: 'Hill\'s',
    emoji: '🥩',
    rating: 4,
    reviews: 23,
    isNew: false
  },
  { 
    id: 3, 
    name: 'غذای گربه ویسکاس', 
    description: 'طعم ماهی سالمون طبیعی', 
    price: 180000, 
    originalPrice: 220000,
    brandId: 5, 
    brand: 'Whiskas',
    emoji: '🐟',
    rating: 4,
    reviews: 67,
    isNew: false
  },
  { 
    id: 4, 
    name: 'تشویقی پدیگری', 
    description: 'استخوان جویدنی طبیعی', 
    price: 95000, 
    brandId: 6, 
    brand: 'Pedigree',
    emoji: '🦴',
    rating: 5,
    reviews: 34,
    isNew: true
  },
  { 
    id: 5, 
    name: 'غذای پورینا پرو پلن', 
    description: 'فرمول ویژه بچه گربه', 
    price: 280000, 
    brandId: 4, 
    brand: 'Purina',
    emoji: '🐱',
    rating: 5,
    reviews: 56,
    isNew: false
  },
  { 
    id: 6, 
    name: 'مکمل ویتامین رویال کنین', 
    description: 'تقویت سیستم ایمنی', 
    price: 150000, 
    brandId: 2, 
    brand: 'Royal Canin',
    emoji: '💊',
    rating: 4,
    reviews: 28,
    isNew: false
  },
]);

const filteredProducts = computed(() => {
  if (selectedBrand.value === 1) {
    return products.value;
  }
  return products.value.filter(p => p.brandId === selectedBrand.value);
});
</script>
