<template>
  <div id="app">
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p>در حال بررسی احراز هویت...</p>
      </div>
    </div>

    <!-- Not Authenticated -->
    <div v-else-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-red-50">
      <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl">🎬</span>
        </div>
        <h1 class="text-2xl font-bold mb-4">فیلم‌های حیوانات پتومن</h1>
        <p class="text-gray-600 mb-6">برای تماشای فیلم‌ها، ابتدا وارد شوید</p>
        <button 
          @click="redirectToAuth"
          class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 w-full"
        >
          ورود / ثبت‌نام
        </button>
      </div>
    </div>

    <!-- Authenticated -->
    <div v-else class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-red-100">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-4 space-x-reverse">
            <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold">🎬</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-red-800">فیلم‌های حیوانات پتومن</h1>
              <p class="text-sm text-gray-600">دنیای شگفت‌انگیز حیوانات</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 space-x-reverse">
            <button class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
              📁 پلی‌لیست‌ها
            </button>
            <div class="text-left">
              <p class="text-sm font-medium">{{ user?.firstName }}</p>
              <p class="text-xs text-gray-500">تماشاگر</p>
            </div>
            <button 
              @click="handleLogout"
              class="text-red-600 hover:text-red-700 text-sm"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <!-- Search Bar -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex space-x-4 space-x-reverse">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجو در فیلم‌ها و ویدیوها..."
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select v-model="selectedCategory" class="border border-gray-300 rounded-lg px-4 py-2">
              <option value="">همه دسته‌ها</option>
              <option value="documentary">مستند</option>
              <option value="educational">آموزشی</option>
              <option value="entertainment">سرگرمی</option>
              <option value="rescue">نجات</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Featured Video -->
      <div class="bg-gradient-to-l from-red-600 to-pink-600 text-white py-8">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-3xl font-bold mb-4">ویدیوی ویژه</h2>
              <h3 class="text-xl mb-3">نجات خرس قطبی در قطب شمال</h3>
              <p class="opacity-90 mb-6">مستندی فوق‌العاده از نجات خرس قطبی آسیب‌دیده توسط تیم متخصص حیات وحش</p>
              <button class="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
                ▶️ تماشا کنید
              </button>
            </div>
            <div class="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
              <div class="text-center">
                <div class="text-6xl mb-4">🐻‍❄️</div>
                <p class="text-lg">پیش‌نمایش ویدیو</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- Categories -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-6">دسته‌بندی‌ها</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="category in categories" :key="category.id"
                 @click="selectedCategory = category.value"
                 class="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer border-2"
                 :class="selectedCategory === category.value ? 'border-red-500 bg-red-50' : 'border-gray-200'">
              <div class="text-3xl mb-2">{{ category.emoji }}</div>
              <h3 class="font-medium">{{ category.name }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ category.count }} ویدیو</p>
            </div>
          </div>
        </div>

        <!-- Video Grid -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-6">
            {{ selectedCategory ? getCategoryName(selectedCategory) : 'همه ویدیوها' }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="video in filteredVideos" :key="video.id"
                 class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              
              <!-- Video Thumbnail -->
              <div class="relative h-48 bg-gray-800 flex items-center justify-center">
                <div class="text-center text-white">
                  <div class="text-4xl mb-2">{{ video.emoji }}</div>
                  <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button class="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl">
                      ▶️
                    </button>
                  </div>
                </div>
                
                <!-- Duration Badge -->
                <div class="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {{ video.duration }}
                </div>
                
                <!-- Category Badge -->
                <div class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                  {{ getCategoryName(video.category) }}
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-bold mb-2 line-clamp-2">{{ video.title }}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ video.description }}</p>
                
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span>{{ video.views.toLocaleString() }} بازدید</span>
                  <span>{{ video.date }}</span>
                </div>
                
                <div class="flex items-center mt-2">
                  <div class="flex text-yellow-400">
                    <span v-for="i in 5" :key="i">
                      {{ i <= video.rating ? '⭐' : '☆' }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500 mr-2">({{ video.rating }}/5)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recently Watched -->
        <div v-if="recentlyWatched.length > 0" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold mb-4">اخیراً تماشا کرده‌اید</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="video in recentlyWatched" :key="video.id"
                 class="flex items-center space-x-3 space-x-reverse p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div class="w-16 h-12 bg-gray-800 rounded flex items-center justify-center text-white">
                <span>{{ video.emoji }}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-sm">{{ video.title }}</h4>
                <p class="text-xs text-gray-500">{{ video.watchedAt }}</p>
                
                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div class="bg-red-600 h-1 rounded-full" :style="{ width: video.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@petoman/auth';

const { 
  isAuthenticated, 
  user, 
  isLoading, 
  logout, 
  initializeAuth 
} = useAuth();

// Search and filter
const searchQuery = ref('');
const selectedCategory = ref('');

// Categories
const categories = ref([
  { id: 1, name: 'مستند', value: 'documentary', emoji: '📺', count: 45 },
  { id: 2, name: 'آموزشی', value: 'educational', emoji: '📚', count: 32 },
  { id: 3, name: 'سرگرمی', value: 'entertainment', emoji: '🎭', count: 28 },
  { id: 4, name: 'نجات', value: 'rescue', emoji: '🚑', count: 19 }
]);

// Sample videos
const videos = ref([
  {
    id: 1,
    title: 'زندگی شیرها در آفریقا',
    description: 'مستندی بی‌نظیر از زندگی شیرها در طبیعت آفریقا',
    category: 'documentary',
    duration: '45:30',
    views: 12500,
    rating: 5,
    date: '1403/04/20',
    emoji: '🦁'
  },
  {
    id: 2,
    title: 'آموزش نگهداری از سگ',
    description: 'راهنمای کامل نگهداری و تربیت سگ‌های خانگی',
    category: 'educational',
    duration: '28:15',
    views: 8900,
    rating: 4,
    date: '1403/04/18',
    emoji: '🐕'
  },
  {
    id: 3,
    title: 'نجات گربه از آتش‌سوزی',
    description: 'لحظات هیجان‌انگیز نجات گربه از ساختمان در حال سوختن',
    category: 'rescue',
    duration: '12:45',
    views: 25600,
    rating: 5,
    date: '1403/04/15',
    emoji: '🐱'
  },
  {
    id: 4,
    title: 'بازی‌های سرگرم‌کننده با حیوانات',
    description: 'ویدیوهای خنده‌دار و سرگرم‌کننده از بازی حیوانات',
    category: 'entertainment',
    duration: '35:20',
    views: 15200,
    rating: 4,
    date: '1403/04/12',
    emoji: '🎪'
  },
  {
    id: 5,
    title: 'مهاجرت پرندگان',
    description: 'سفر شگفت‌انگیز پرندگان مهاجر در فصل‌های مختلف',
    category: 'documentary',
    duration: '52:10',
    views: 9800,
    rating: 5,
    date: '1403/04/08',
    emoji: '🦅'
  },
  {
    id: 6,
    title: 'تربیت توله سگ',
    description: 'مراحل تربیت و آموزش توله سگ‌ها از تولد تا بزرگسالی',
    category: 'educational',
    duration: '41:30',
    views: 11200,
    rating: 4,
    date: '1403/04/05',
    emoji: '🐶'
  }
]);

const recentlyWatched = ref([
  {
    id: 1,
    title: 'زندگی شیرها در آفریقا',
    emoji: '🦁',
    watchedAt: 'دیروز',
    progress: 75
  },
  {
    id: 2,
    title: 'نجات گربه از آتش‌سوزی',
    emoji: '🐱',
    watchedAt: '2 روز پیش',
    progress: 100
  }
]);

// Computed
const filteredVideos = computed(() => {
  let result = videos.value;
  
  if (selectedCategory.value) {
    result = result.filter(video => video.category === selectedCategory.value);
  }
  
  if (searchQuery.value) {
    result = result.filter(video => 
      video.title.includes(searchQuery.value) || 
      video.description.includes(searchQuery.value)
    );
  }
  
  return result;
});

// Methods
const getCategoryName = (categoryValue: string) => {
  const category = categories.value.find(cat => cat.value === categoryValue);
  return category ? category.name : categoryValue;
};

const redirectToAuth = () => {
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `http://localhost:3001?redirect=${currentUrl}`;
};

const handleLogout = async () => {
  await logout();
  redirectToAuth();
};

onMounted(() => {
  initializeAuth();
  
  // Check for token in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('petoman_auth_token', token);
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.reload();
  }
});
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
