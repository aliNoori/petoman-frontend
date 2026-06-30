<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900">دسته‌بندی‌ها</h1>
        <p class="text-gray-500 text-sm mt-1">انواع محصولات برای حیوانات خانگی</p>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <NuxtLink 
          v-for="category in categories" 
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group text-center"
        >
          <div 
            class="w-20 h-20 md:w-24 md:h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
            :class="category.bgColor"
          >
            <i :class="[category.icon, 'text-4xl md:text-5xl', category.iconColor]"></i>
          </div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">{{ category.name }}</h3>
          <p class="text-sm text-gray-500">{{ category.count }} محصول</p>
          <p class="text-xs text-gray-400 mt-2">{{ category.description }}</p>
        </NuxtLink>
      </div>

      <!-- Sub Categories Section -->
      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900 mb-6">دسته‌بندی‌های پرطرفدار</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <NuxtLink 
            v-for="sub in popularSubCategories" 
            :key="sub.id"
            :to="`/category/${sub.slug}`"
            class="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center"
          >
            <div 
              class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              :class="sub.bgColor"
            >
              <i :class="[sub.icon, 'text-xl', sub.iconColor]"></i>
            </div>
            <h4 class="font-semibold text-gray-900 text-sm">{{ sub.name }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ sub.count }} محصول</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Brands Section -->
      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900 mb-6">برندهای محبوب</h2>
        <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="brand in brands" 
            :key="brand.id"
            class="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all flex items-center justify-center aspect-video cursor-pointer"
          >
            <span class="font-bold text-gray-600 text-center">{{ brand.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useCategoryStore} from "../stores/category.store.ts";
import {useReferenceStore} from "../stores/reference.store.js";

const categoryStore=useCategoryStore()
// Main Categories
/*const categories = ref([
  { id: 1, name: 'غذای سگ', slug: 'dog-food', icon: 'ti ti-bone', bgColor: 'bg-amber-100', iconColor: 'text-amber-600', count: 245, description: 'انواع غذای خشک و تر' },
  { id: 2, name: 'غذای گربه', slug: 'cat-food', icon: 'ti ti-cat', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', count: 189, description: 'غذای باکیفیت برای گربه' },
  { id: 3, name: 'اسباب‌بازی', slug: 'toys', icon: 'ti ti-ball-tennis', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', count: 156, description: 'اسباب‌بازی‌های متنوع' },
  { id: 4, name: 'بهداشتی', slug: 'hygiene', icon: 'ti ti-droplet', bgColor: 'bg-teal-100', iconColor: 'text-teal-600', count: 98, description: 'شامپو، خاک و محصولات بهداشتی' },
  { id: 5, name: 'لوازم جانبی', slug: 'accessories', icon: 'ti ti-hanger', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', count: 234, description: 'قلاده، ظرف غذا و...' },
  { id: 6, name: 'پرندگان', slug: 'birds', icon: 'ti ti-feather', bgColor: 'bg-green-100', iconColor: 'text-green-600', count: 67, description: 'غذا و لوازم پرندگان' },
  { id: 7, name: 'آکواریوم', slug: 'aquarium', icon: 'ti ti-fish', bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600', count: 134, description: 'ماهی و لوازم آکواریوم' },
  { id: 8, name: 'جوندگان', slug: 'rodents', icon: 'ti ti-paw', bgColor: 'bg-pink-100', iconColor: 'text-pink-600', count: 45, description: 'همستر، خرگوش و...' },
])*/
const categories=computed(()=>categoryStore.categories)
const popularSubCategories=computed(()=>categoryStore.categories)
// Popular Sub Categories
/*const popularSubCategories = ref([
  { id: 1, name: 'غذای خشک سگ', slug: 'dry-dog-food', icon: 'ti ti-bone', bgColor: 'bg-amber-50', iconColor: 'text-amber-500', count: 120 },
  { id: 2, name: 'غذای تر گربه', slug: 'wet-cat-food', icon: 'ti ti-cat', bgColor: 'bg-orange-50', iconColor: 'text-orange-500', count: 89 },
  { id: 3, name: 'شامپو سگ', slug: 'dog-shampoo', icon: 'ti ti-droplet', bgColor: 'bg-teal-50', iconColor: 'text-teal-500', count: 34 },
  { id: 4, name: 'خاک گربه', slug: 'cat-litter', icon: 'ti ti-box', bgColor: 'bg-gray-100', iconColor: 'text-gray-500', count: 56 },
  { id: 5, name: 'قلاده سگ', slug: 'dog-collar', icon: 'ti ti-circle', bgColor: 'bg-purple-50', iconColor: 'text-purple-500', count: 78 },
  { id: 6, name: 'تخت حیوانات', slug: 'pet-bed', icon: 'ti ti-bed', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', count: 45 },
  { id: 7, name: 'توپ بازی', slug: 'play-ball', icon: 'ti ti-ball-tennis', bgColor: 'bg-green-50', iconColor: 'text-green-500', count: 67 },
  { id: 8, name: 'ظرف غذا', slug: 'food-bowl', icon: 'ti ti-bowl', bgColor: 'bg-red-50', iconColor: 'text-red-500', count: 89 },
  { id: 9, name: 'قفس پرنده', slug: 'bird-cage', icon: 'ti ti-home', bgColor: 'bg-lime-50', iconColor: 'text-lime-500', count: 23 },
  { id: 10, name: 'غذای ماهی', slug: 'fish-food', icon: 'ti ti-fish', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500', count: 34 },
  { id: 11, name: 'ویتامین', slug: 'vitamins', icon: 'ti ti-pill', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', count: 56 },
  { id: 12, name: 'حمل و نقل', slug: 'carriers', icon: 'ti ti-briefcase', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', count: 28 },
])*/

// Brands
/*const brands = ref([
  { id: 1, name: 'Royal Canin' },
  { id: 2, name: 'Whiskas' },
  { id: 3, name: 'Pedigree' },
  { id: 4, name: 'Reflex' },
  { id: 5, name: 'Josera' },
  { id: 6, name: 'Pro Plan' },
  { id: 7, name: 'Hills' },
  { id: 8, name: 'Brit' },
  { id: 9, name: 'Eukanuba' },
  { id: 10, name: 'Happy Dog' },
  { id: 11, name: 'Nutram' },
  { id: 12, name: 'Orijen' },
])*/

const referenceStore=useReferenceStore()
const brands=referenceStore.brands
</script>
