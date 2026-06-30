<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="border-b border-gray-200 bg-gray-50">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <!-- امتیاز کلی -->
          <div class="flex items-center gap-2">
            <i class="ti ti-star-filled text-amber-500 text-2xl"></i>
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900 font-english">{{ overallRating.toFixed(1) }}</p>
              <p class="text-xs text-gray-500">از {{ totalReviews }} نظر</p>
            </div>
          </div>
        </div>

        <!-- فیلترها -->
        <div class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all',
              selectedFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            <i :class="filter.icon" class="text-sm ml-1"></i>
            {{ filter.label }}
            <span v-if="filter.count" class="mr-1 text-xs opacity-75">({{ filter.count }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- آمار نظرات -->
    <div class="p-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <!-- کارت امتیاز کلی -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 mb-4">
              <span class="text-3xl font-bold text-amber-600 font-english">{{ overallRating.toFixed(1) }}</span>
            </div>
            <div class="flex items-center justify-center gap-1 mb-3">
              <i v-for="star in 5" :key="star" :class="[
                'ti text-2xl',
                star <= Math.floor(overallRating) ? 'ti-star-filled text-amber-500' : 
                star === Math.ceil(overallRating) && overallRating % 1 !== 0 ? 'ti-star-half-filled text-amber-500' : 
                'ti-star text-gray-300'
              ]"></i>
            </div>
            <p class="text-sm text-gray-600">بر اساس {{ totalReviews }} نظر</p>
          </div>
        </div>

        <!-- نمودار توزیع امتیازات -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h3 class="font-bold text-gray-900 mb-4">توزیع امتیازات</h3>
          <div class="space-y-3">
            <div v-for="(count, index) in [156, 78, 42, 20, 12]" :key="index" class="flex items-center gap-3">
              <div class="flex items-center gap-1 min-w-[60px]">
                <span class="text-sm text-gray-600">{{ 5 - index }}</span>
                <i class="ti ti-star-filled text-amber-500 text-xs"></i>
              </div>
              <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                  :style="{ width: `${(count / totalReviews) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 min-w-[40px] text-left font-english">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- لیست نظرات -->
      <div class="space-y-4">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div class="p-5">
            <!-- هدر نظر -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3 flex-1">
                <!-- آواتار -->
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {{ review.customerName.charAt(0) }}
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-gray-900">{{ review.customerName }}</h3>
                    <i v-if="review.isVerified" class="ti ti-circle-check-filled text-blue-500 text-sm" title="مشتری تایید شده"></i>
                  </div>
                  
                  <!-- ستاره‌ها و تاریخ -->
                  <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                    <div class="flex items-center gap-1">
                      <i v-for="star in 5" :key="star" :class="[
                        'ti text-base',
                        star <= review.rating ? 'ti-star-filled text-amber-500' : 'ti-star text-gray-300'
                      ]"></i>
                    </div>
                    <span>•</span>
                    <span>{{ review.date }}</span>
                    <span v-if="review.productName">•</span>
                    <span v-if="review.productName" class="flex items-center gap-1">
                      <i class="ti ti-package text-xs"></i>
                      {{ review.productName }}
                    </span>
                  </div>

                  <!-- متن نظر -->
                  <p class="text-gray-700 leading-relaxed mb-3">{{ review.comment }}</p>

                  <!-- تگ‌های مثبت/منفی -->
                  <div v-if="review.tags && review.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="tag in review.tags"
                      :key="tag"
                      :class="[
                        'px-2 py-1 rounded-lg text-xs font-medium',
                        tag.type === 'positive' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      ]"
                    >
                      <i :class="tag.type === 'positive' ? 'ti ti-thumb-up' : 'ti ti-thumb-down'" class="text-xs"></i>
                      {{ tag.text }}
                    </span>
                  </div>

                  <!-- پاسخ فروشگاه -->
                  <div v-if="review.response" class="bg-blue-50 rounded-lg p-4 mt-3">
                    <div class="flex items-start gap-2 mb-2">
                      <i class="ti ti-message-circle text-blue-600"></i>
                      <span class="text-sm font-bold text-blue-900">پاسخ فروشگاه:</span>
                    </div>
                    <p class="text-sm text-gray-700 leading-relaxed">{{ review.response }}</p>
                    <p class="text-xs text-gray-500 mt-2">{{ review.responseDate }}</p>
                  </div>
                </div>
              </div>

              <!-- دکمه پاسخ -->
              <button
                v-if="!review.response"
                @click="openResponseModal(review)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <i class="ti ti-message-circle"></i>
                پاسخ
              </button>
            </div>

            <!-- اقدامات -->
            <div class="pt-3 border-t border-gray-100">
            </div>
          </div>
        </div>

        <!-- پیغام خالی -->
        <div v-if="filteredReviews.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <i class="ti ti-message-off text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">نظری یافت نشد</h3>
          <p class="text-gray-600">در این بخش نظری وجود ندارد</p>
        </div>
      </div>
    </div>

    <!-- Modal پاسخ به نظر -->
    <Transition name="fade">
      <div
        v-if="responseModal.show"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeResponseModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full" @click.stop>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold">پاسخ به نظر</h3>
                <p class="text-sm opacity-90 mt-1">{{ responseModal.review?.customerName }}</p>
              </div>
              <button
                @click="closeResponseModal"
                class="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                <i class="ti ti-x text-xl"></i>
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- نظر اصلی -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="flex items-center gap-1 mb-2">
                <i v-for="star in 5" :key="star" :class="[
                  'ti text-sm',
                  star <= (responseModal.review?.rating || 0) ? 'ti-star-filled text-amber-500' : 'ti-star text-gray-300'
                ]"></i>
              </div>
              <p class="text-sm text-gray-700">{{ responseModal.review?.comment }}</p>
            </div>

            <!-- فرم پاسخ -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">پاسخ شما</label>
                <textarea
                  v-model="responseModal.text"
                  rows="5"
                  placeholder="پاسخ خود را بنویسید..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  @click="submitResponse"
                  :disabled="!responseModal.text.trim()"
                  class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  ارسال پاسخ
                </button>
                <button
                  @click="closeResponseModal"
                  class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'pet-shop'
})

// فیلترها
const selectedFilter = ref('all')
const filters = [
  { value: 'all', label: 'همه نظرات', icon: 'ti ti-list', count: 308 },
  { value: 'positive', label: 'مثبت', icon: 'ti ti-thumb-up', count: 276 },
  { value: 'negative', label: 'منفی', icon: 'ti ti-thumb-down', count: 32 },
  { value: 'unanswered', label: 'بدون پاسخ', icon: 'ti ti-message-off', count: 65 },
  { value: 'recent', label: 'جدیدترین', icon: 'ti ti-clock', count: null }
]

// آمار کلی
const overallRating = ref(4.5)
const totalReviews = ref(308)

// Modal پاسخ
const responseModal = ref({
  show: false,
  review: null,
  text: ''
})

// نمونه داده‌های نظرات
const reviews = ref([
  {
    id: 1,
    customerName: 'علی محمدی',
    rating: 5,
    comment: 'فروشگاه عالی با تنوع محصولات بالا. غذای سگم را با قیمت مناسب خریدم و کیفیتش هم خوب بود. تحویل هم سریع بود.',
    date: '1403/08/18',
    productName: 'غذای خشک سگ رویال کنین',
    isVerified: true,
    helpful: 18,
    tags: [
      { text: 'تنوع محصولات', type: 'positive' },
      { text: 'قیمت مناسب', type: 'positive' },
      { text: 'تحویل سریع', type: 'positive' }
    ],
    response: 'از خریدتان متشکریم. خوشحالیم که از کیفیت محصول راضی بودید.',
    responseDate: '1403/08/19'
  },
  {
    id: 2,
    customerName: 'سارا احمدی',
    rating: 4,
    comment: 'محصولات خوبی دارند اما یکی دو تا از آیتم‌های سبد خریدم موجود نبود. در کل راضی بودم.',
    date: '1403/08/16',
    productName: 'ماسه گربه بنتونیت',
    isVerified: true,
    helpful: 10,
    tags: [
      { text: 'محصولات خوب', type: 'positive' },
      { text: 'برخی کالاها موجود نبود', type: 'negative' }
    ],
    response: null
  },
  {
    id: 3,
    customerName: 'رضا کریمی',
    rating: 5,
    comment: 'بهترین پت شاپ آنلاینی که تاکنون از اون خرید کردم. همه چیز مطابق انتظار بود و بسته‌بندی هم عالی.',
    date: '1403/08/14',
    productName: 'اسباب‌بازی سگ کنگ',
    isVerified: true,
    helpful: 25,
    tags: [
      { text: 'بسته‌بندی عالی', type: 'positive' },
      { text: 'کیفیت بالا', type: 'positive' }
    ],
    response: 'سپاس از لطف شما. رضایت مشتریان برای ما اولویت است.',
    responseDate: '1403/08/15'
  },
  {
    id: 4,
    customerName: 'مریم رضایی',
    rating: 3,
    comment: 'محصولات خوب هستند اما هزینه ارسال نسبت به رقبا بالاتر است.',
    date: '1403/08/12',
    productName: 'کنسرو گربه شبا',
    isVerified: false,
    helpful: 6,
    tags: [
      { text: 'کیفیت خوب', type: 'positive' },
      { text: 'هزینه ارسال بالا', type: 'negative' }
    ],
    response: null
  },
  {
    id: 5,
    customerName: 'حسین نوری',
    rating: 5,
    comment: 'سفارش فوری داشتم و فروشگاه خیلی سریع پاسخ داد. محصولات در کمترین زمان تحویل داده شد.',
    date: '1403/08/10',
    productName: 'قلاده و لیش سگ',
    isVerified: true,
    helpful: 20,
    tags: [
      { text: 'پاسخگویی سریع', type: 'positive' },
      { text: 'ارسال فوری', type: 'positive' }
    ],
    response: 'ممنون از انتخابتان. همیشه در خدمت هستیم.',
    responseDate: '1403/08/11'
  },
  {
    id: 6,
    customerName: 'فاطمه موسوی',
    rating: 4,
    comment: 'فروشگاه خوب و معتبر. فقط پشتیبانی تلفنی کمی کند جواب می‌داد.',
    date: '1403/08/08',
    productName: 'غذای خشک گربه پرشین کت',
    isVerified: true,
    helpful: 9,
    tags: [
      { text: 'معتبر', type: 'positive' },
      { text: 'پشتیبانی کند', type: 'negative' }
    ],
    response: null
  },
  {
    id: 7,
    customerName: 'امیر صادقی',
    rating: 5,
    comment: 'تنوع محصولات فوق‌العاده و قیمت‌ها رقابتی. سایت هم کاربرپسند است و راحت می‌شود خرید کرد.',
    date: '1403/08/05',
    productName: 'استخوان جویدنی سگ',
    isVerified: true,
    helpful: 22,
    tags: [
      { text: 'تنوع عالی', type: 'positive' },
      { text: 'سایت کاربرپسند', type: 'positive' }
    ],
    response: 'از لطف شما متشکریم. تلاش می‌کنیم همیشه بهترین باشیم.',
    responseDate: '1403/08/06'
  },
  {
    id: 8,
    customerName: 'نازنین کاظمی',
    rating: 2,
    comment: 'متاسفانه کیفیت یکی از محصولاتی که دریافت کردم خوب نبود. با تماس با پشتیبانی محصول تعویض شد.',
    date: '1403/08/03',
    productName: 'ظرف غذا و آب گربه',
    isVerified: false,
    helpful: 5,
    tags: [
      { text: 'کیفیت پایین', type: 'negative' },
      { text: 'پشتیبانی خوب', type: 'positive' }
    ],
    response: null
  }
])

// فیلتر نظرات
const filteredReviews = computed(() => {
  let filtered = [...reviews.value]
  
  switch (selectedFilter.value) {
    case 'positive':
      filtered = filtered.filter(r => r.rating >= 4)
      break
    case 'negative':
      filtered = filtered.filter(r => r.rating <= 2)
      break
    case 'unanswered':
      filtered = filtered.filter(r => !r.response)
      break
    case 'recent':
      filtered = filtered.sort((a, b) => b.id - a.id)
      break
  }
  
  return filtered
})

// توابع Modal
const openResponseModal = (review) => {
  responseModal.value = {
    show: true,
    review,
    text: ''
  }
}

const closeResponseModal = () => {
  responseModal.value = {
    show: false,
    review: null,
    text: ''
  }
}

const submitResponse = () => {
  if (!responseModal.value.text.trim()) return
  
  // پیدا کردن نظر و افزودن پاسخ
  const review = reviews.value.find(r => r.id === responseModal.value.review.id)
  if (review) {
    review.response = responseModal.value.text
    review.responseDate = new Date().toLocaleDateString('fa-IR')
  }
  
  // بستن modal
  closeResponseModal()
  
  // نمایش پیام موفقیت
  alert('پاسخ شما با موفقیت ثبت شد')
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
