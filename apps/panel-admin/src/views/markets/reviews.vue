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
            <!-- حلقه روی 5 تا 1 ستاره -->
            <div v-for="star in 5" :key="star" class="flex items-center gap-3">
              <div class="flex items-center gap-1 min-w-[60px]">
                <span class="text-sm text-gray-600">{{ 6 - star }}</span> <!-- 5, 4, 3, 2, 1 -->
                <i class="ti ti-star-filled text-amber-500 text-xs"></i>
              </div>
              <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    :style="{ width: totalReviews > 0 ? `${(ratingDistribution[6 - star] / totalReviews) * 100}%` : '0%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 min-w-[40px] text-left font-english">{{ ratingDistribution[6 - star] }}</span>
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
import { ref, computed } from 'vue'
import { useReviewStore } from "@/stores/market/reviews.ts"

const reviewsStore = useReviewStore()

// --- 1. مپینگ داده‌های API به فرمت تمپلیت ---
const reviews = computed(() => {
  if (!reviewsStore.reviews || reviewsStore.reviews.length === 0) {
    return []
  }

  return reviewsStore.reviews.map(apiReview => {
    // ترکیب pros و cons برای ساخت آرایه tags
    const mappedTags = [
      ...(apiReview.pros || []).map(text => ({ text, type: 'positive' })),
      ...(apiReview.cons || []).map(text => ({ text, type: 'negative' }))
    ]

    // استخراج نام کاربر
    const fullName = apiReview.user
        ? `${apiReview.user.firstName || ''} ${apiReview.user.lastName || ''}`.trim()
        : 'کاربر'

    // تبدیل تاریخ میلادی به شمسی برای نمایش
    const persianDate = new Date(apiReview.createdAt).toLocaleDateString('fa-IR')

    return {
      id: apiReview.id,
      // نگهداری تاریخ اصلی میلادی برای مرتب‌سازی صحیح
      originalDate: new Date(apiReview.createdAt),
      customerName: fullName,
      rating: apiReview.rating,
      comment: apiReview.comment,
      date: persianDate,
      productName: apiReview.productName || 'محصول خریداری شده',
      isVerified: !!apiReview.user,
      helpful: apiReview.helpfulCount || 0,
      tags: mappedTags,
      response: apiReview.reply,
      responseDate: apiReview.replyUpdatedAt
          ? new Date(apiReview.replyUpdatedAt).toLocaleDateString('fa-IR')
          : undefined
    }
  })
})

// --- 2. محاسبات آماری (داینامیک) ---
const totalReviews = computed(() => reviews.value.length)

const overallRating = computed(() => {
  if (totalReviews.value === 0) return 0
  const sum = reviews.value.reduce((acc, curr) => acc + curr.rating, 0)
  return sum / totalReviews.value
})

// محاسبه تعداد هر ستاره برای نمودار
const ratingDistribution = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.value.forEach(r => {
    const roundedRating = Math.round(r.rating)
    if (counts[roundedRating] !== undefined) {
      counts[roundedRating]++
    }
  })
  return counts
})

// --- 3. تنظیمات فیلترها (با شمارش داینامیک) ---
const selectedFilter = ref('all')

const filters = computed(() => {
  const allCount = totalReviews.value
  const positiveCount = reviews.value.filter(r => r.rating >= 4).length
  const negativeCount = reviews.value.filter(r => r.rating <= 2).length
  const unansweredCount = reviews.value.filter(r => !r.response).length

  return [
    { value: 'all', label: 'همه نظرات', icon: 'ti ti-list', count: allCount },
    { value: 'positive', label: 'مثبت', icon: 'ti ti-thumb-up', count: positiveCount },
    { value: 'negative', label: 'منفی', icon: 'ti ti-thumb-down', count: negativeCount },
    { value: 'unanswered', label: 'بدون پاسخ', icon: 'ti ti-message-off', count: unansweredCount },
    { value: 'recent', label: 'جدیدترین', icon: 'ti ti-clock', count: null }
  ]
})

// --- 4. منطق فیلتر کردن نظرات ---
const filteredReviews = computed(() => {
  let result = [...reviews.value]

  switch (selectedFilter.value) {
    case 'positive':
      result = result.filter(r => r.rating >= 4)
      break
    case 'negative':
      result = result.filter(r => r.rating <= 2)
      break
    case 'unanswered':
      result = result.filter(r => !r.response)
      break
    case 'recent':
      // مرتب‌سازی بر اساس تاریخ اصلی میلادی (نزولی)
      result.sort((a, b) => b.originalDate - a.originalDate)
      break
  }

  return result
})

// --- 5. مدیریت Modal پاسخ ---
const responseModal = ref({
  show: false,
  review: null,
  text: ''
})

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

const submitResponse = async () => {
  if (!responseModal.value.text.trim()) return

  try {
    // پیدا کردن آبجکت نظر برای ارسال آی‌دی
    const reviewId = responseModal.value.review.id

    // فراخوانی متد استور
    await reviewsStore.submitReply(String(reviewId), responseModal.value.text)

    // بستن مودال
    closeResponseModal()

    // نمایش پیام موفقیت
    showToastMessage('پاسخ شما با موفقیت ثبت شد')

  } catch (error) {
    console.error('Error submitting reply:', error)
    showToastMessage('خطا در ثبت پاسخ. لطفاً دوباره تلاش کنید.')
  }
}

// تابع کمکی نمایش پیام (Toast)
const showToast = ref(false)
const toastMessage = ref('')
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
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
