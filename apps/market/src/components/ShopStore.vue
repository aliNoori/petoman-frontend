<template>
  <div class="shop-store min-h-screen bg-gray-50">
    <!-- Store Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="text-5xl">🏪</div>
          <div>
            <h1 class="text-3xl font-bold">شاپ عمومی پتومن</h1>
            <p class="text-blue-100">همه چیز برای حیوانات خانگی شما</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex space-x-6 space-x-reverse overflow-x-auto">
          <button v-for="category in categories" :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'px-4 py-2 rounded-lg whitespace-nowrap transition-colors',
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]">
            {{ category.emoji }} {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts" :key="product.id"
             class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="h-48 bg-gray-200 flex items-center justify-center">
            <span class="text-4xl">{{ product.emoji }}</span>
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ product.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-blue-600 font-bold">{{ product.price.toLocaleString() }} تومان</span>
              <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                افزودن
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

const selectedCategory = ref(1);

const categories = ref([
  { id: 1, name: 'همه محصولات', emoji: '🛒' },
  { id: 2, name: 'غذای حیوانات', emoji: '🍖' },
  { id: 3, name: 'اسباب‌بازی', emoji: '🧸' },
  { id: 4, name: 'لوازم نگهداری', emoji: '🏠' },
  { id: 5, name: 'بهداشت و سلامت', emoji: '🧴' },
]);

const products = ref([
  { id: 1, name: 'غذای خشک سگ', description: 'غذای کامل و متعادل', price: 150000, categoryId: 2, emoji: '🍖' },
  { id: 2, name: 'اسباب‌بازی توپی', description: 'برای سرگرمی گربه', price: 45000, categoryId: 3, emoji: '⚽' },
  { id: 3, name: 'ظرف آب و غذا', description: 'ضد خش و قابل شستشو', price: 85000, categoryId: 4, emoji: '🥣' },
  { id: 4, name: 'شامپو حیوانات', description: 'مخصوص پوست حساس', price: 95000, categoryId: 5, emoji: '🧴' },
  { id: 5, name: 'غذای گربه', description: 'طعم ماهی و گوشت', price: 120000, categoryId: 2, emoji: '🐟' },
  { id: 6, name: 'قلاده سگ', description: 'قابل تنظیم و راحت', price: 65000, categoryId: 4, emoji: '🦮' },
  { id: 7, name: 'خاک گربه', description: 'جاذب بو و رطوبت', price: 75000, categoryId: 4, emoji: '🏠' },
  { id: 8, name: 'ویتامین حیوانات', description: 'تقویت سیستم ایمنی', price: 180000, categoryId: 5, emoji: '💊' },
]);

const filteredProducts = computed(() => {
  if (selectedCategory.value === 1) {
    return products.value;
  }
  return products.value.filter(p => p.categoryId === selectedCategory.value);
});
</script>
