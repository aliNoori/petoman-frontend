<template>
  <div class="pet-shop min-h-screen bg-gray-50">
    <!-- Store Header -->
    <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center space-x-4 space-x-reverse">
          <div class="text-5xl">🐕</div>
          <div>
            <h1 class="text-3xl font-bold">پت شاپ حرفه‌ای</h1>
            <p class="text-orange-100">خدمات و محصولات تخصصی نگهداری</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Services & Products Tabs -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex space-x-8 space-x-reverse">
          <button v-for="tab in tabs" :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'py-4 px-2 border-b-2 font-medium transition-colors',
                    activeTab === tab.id 
                      ? 'border-orange-600 text-orange-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  ]">
            {{ tab.emoji }} {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Professional Products -->
    <div v-if="activeTab === 'products'" class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">محصولات حرفه‌ای</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in professionalProducts" :key="product.id"
             class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
          
          <div class="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center relative">
            <span class="text-4xl">{{ product.emoji }}</span>
            <div class="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
              حرفه‌ای
            </div>
          </div>
          
          <div class="p-5">
            <h3 class="font-bold text-lg mb-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ product.description }}</p>
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-orange-600 font-bold text-lg">
                {{ product.price.toLocaleString() }} تومان
              </span>
              <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                {{ product.category }}
              </span>
            </div>
            
            <button class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 w-full transition-colors">
              سفارش
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Services -->
    <div v-if="activeTab === 'services'" class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">خدمات تخصصی</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="service in services" :key="service.id"
             class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border">
          
          <div class="flex items-start space-x-4 space-x-reverse">
            <div class="text-4xl">{{ service.emoji }}</div>
            <div class="flex-1">
              <h3 class="font-bold text-xl mb-2">{{ service.name }}</h3>
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-orange-600 font-bold text-lg">{{ service.price.toLocaleString() }} تومان</span>
                  <span class="text-sm text-gray-500 mr-2">{{ service.duration }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span>⭐ {{ service.rating }}</span>
                  <span class="mr-2">({{ service.reviews }} نظر)</span>
                </div>
              </div>
              
              <button class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                رزرو نوبت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Training Programs -->
    <div v-if="activeTab === 'training'" class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">برنامه‌های آموزشی</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="program in trainingPrograms" :key="program.id"
             class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
          
          <div class="h-40 bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center">
            <span class="text-4xl">{{ program.emoji }}</span>
          </div>
          
          <div class="p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-lg">{{ program.name }}</h3>
              <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {{ program.level }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-3">{{ program.description }}</p>
            
            <div class="text-sm text-gray-500 mb-4">
              <div>📅 مدت: {{ program.duration }}</div>
              <div>👥 ظرفیت: {{ program.capacity }} نفر</div>
              <div>📍 {{ program.location }}</div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-orange-600 font-bold">{{ program.price.toLocaleString() }} تومان</span>
              <button class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                ثبت‌نام
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('products');

const tabs = ref([
  { id: 'products', name: 'محصولات حرفه‌ای', emoji: '🛍️' },
  { id: 'services', name: 'خدمات تخصصی', emoji: '🔧' },
  { id: 'training', name: 'آموزش', emoji: '🎓' },
]);

const professionalProducts = ref([
  {
    id: 1,
    name: 'غذای درمانی ویژه',
    description: 'فرمول ویژه برای حیوانات بیمار',
    price: 650000,
    category: 'درمانی',
    emoji: '💊'
  },
  {
    id: 2,
    name: 'قفس حرفه‌ای پرنده',
    description: 'طراحی استاندارد برای پرندگان زینتی',
    price: 1200000,
    category: 'تجهیزات',
    emoji: '🏠'
  },
  {
    id: 3,
    name: 'سیستم تصفیه آب',
    description: 'برای آکواریوم‌های حرفه‌ای',
    price: 850000,
    category: 'آکواریوم',
    emoji: '🌊'
  },
  {
    id: 4,
    name: 'مکمل تخصصی مفاصل',
    description: 'برای سگ‌های سالمند و ورزشی',
    price: 380000,
    category: 'مکمل',
    emoji: '💪'
  },
  {
    id: 5,
    name: 'دستگاه گرمایش زمینی',
    description: 'برای خزندگان استوایی',
    price: 450000,
    category: 'تجهیزات',
    emoji: '🌡️'
  },
  {
    id: 6,
    name: 'شامپو ضد آلرژی',
    description: 'مخصوص حیوانات پوست حساس',
    price: 220000,
    category: 'بهداشت',
    emoji: '🧴'
  },
]);

const services = ref([
  {
    id: 1,
    name: 'آرایش و گرومینگ کامل',
    description: 'حمام، خشک کردن، برش ناخن، تمیز کردن گوش و چشم',
    price: 150000,
    duration: '2-3 ساعت',
    rating: 4.8,
    reviews: 124,
    emoji: '✂️'
  },
  {
    id: 2,
    name: 'معاینه سلامت عمومی',
    description: 'بررسی کامل وضعیت جسمی و تشخیص مشکلات احتمالی',
    price: 120000,
    duration: '45 دقیقه',
    rating: 4.9,
    reviews: 89,
    emoji: '🩺'
  },
  {
    id: 3,
    name: 'واکسیناسیون کامل',
    description: 'تزریق واکسن‌های ضروری و صدور کارت واکسن',
    price: 200000,
    duration: '30 دقیقه',
    rating: 5.0,
    reviews: 156,
    emoji: '💉'
  },
  {
    id: 4,
    name: 'رژیم غذایی تخصصی',
    description: 'طراحی برنامه تغذیه مناسب بر اساس نیاز حیوان',
    price: 80000,
    duration: '1 ساعت',
    rating: 4.7,
    reviews: 67,
    emoji: '📋'
  },
]);

const trainingPrograms = ref([
  {
    id: 1,
    name: 'آموزش فرمان‌های پایه',
    description: 'نشست، ایست، بیا و سایر فرمان‌های اساسی',
    price: 300000,
    duration: '4 هفته',
    capacity: 8,
    level: 'مبتدی',
    location: 'حضوری',
    emoji: '🦮'
  },
  {
    id: 2,
    name: 'آموزش رفتارهای اجتماعی',
    description: 'تعامل با انسان‌ها و سایر حیوانات',
    price: 450000,
    duration: '6 هفته',
    capacity: 6,
    level: 'متوسط',
    location: 'حضوری',
    emoji: '👥'
  },
  {
    id: 3,
    name: 'دوره نگهداری گربه',
    description: 'تکنیک‌های مراقبت و درک رفتار گربه',
    price: 180000,
    duration: '2 هفته',
    capacity: 12,
    level: 'مبتدی',
    location: 'آنلاین',
    emoji: '🐱'
  },
  {
    id: 4,
    name: 'آموزش نگهداری پرندگان',
    description: 'مراقبت کامل از پرندگان خانگی',
    price: 220000,
    duration: '3 هفته',
    capacity: 10,
    level: 'مبتدی',
    location: 'ترکیبی',
    emoji: '🦜'
  },
]);
</script>
