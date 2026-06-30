<template>
  <div class="min-h-screen bg-gray-50 font-vazir py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center gap-4 mb-4">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="ti ti-arrow-right text-gray-600"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">درخواست مشاوره آنلاین</h1>
            <p class="text-gray-600">با دکتر {{ vetName }} گفتگو کنید</p>
          </div>
        </div>
        
        <!-- Vet Info -->
        <div v-if="vetInfo" class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <img :src="vetInfo.avatar" :alt="vetInfo.name" class="w-16 h-16 rounded-full object-cover">
          <div>
            <h3 class="font-bold text-gray-900">{{ vetInfo.name }}</h3>
            <p class="text-gray-600">{{ vetInfo.specialty }}</p>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex items-center gap-1">
                <i class="ti ti-star-filled text-yellow-500"></i>
                <span class="text-sm font-medium">{{ vetInfo.rating }}</span>
              </div>
              <span class="text-sm text-gray-500">({{ vetInfo.reviewCount }} نظر)</span>
              <span 
                :class="vetInfo.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ vetInfo.isOnline ? 'آنلاین' : 'آفلاین' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Consultation Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">اطلاعات حیوان خانگی</h2>
        
        <form @submit.prevent="submitConsultation" class="space-y-6">
          <!-- Pet Name -->
          <div>
            <label for="petName" class="block text-sm font-medium text-gray-700 mb-2">
              نام حیوان خانگی
            </label>
            <input
              v-model="form.petName"
              type="text"
              id="petName"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="نام حیوان خانگی شما"
            />
          </div>

          <!-- Pet Type -->
          <div>
            <label for="petType" class="block text-sm font-medium text-gray-700 mb-2">
              نوع حیوان
            </label>
            <select
              v-model="form.petType"
              id="petType"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              <option value="dog">سگ</option>
              <option value="cat">گربه</option>
              <option value="bird">پرنده</option>
              <option value="rabbit">خرگوش</option>
              <option value="fish">ماهی</option>
              <option value="other">سایر</option>
            </select>
          </div>

          <!-- Pet Age -->
          <div>
            <label for="petAge" class="block text-sm font-medium text-gray-700 mb-2">
              سن حیوان
            </label>
            <input
              v-model="form.petAge"
              type="text"
              id="petAge"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="مثال: 2 سال"
            />
          </div>

          <!-- Issue Description -->
          <div>
            <label for="issueDescription" class="block text-sm font-medium text-gray-700 mb-2">
              شرح مشکل یا سوال
            </label>
            <textarea
              v-model="form.issueDescription"
              id="issueDescription"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="لطفاً مشکل یا سوال خود را به تفصیل بنویسید..."
            ></textarea>
          </div>

          <!-- Urgency Level -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              میزان فوریت
            </label>
            <div class="grid grid-cols-3 gap-3">
              <label class="relative">
                <input v-model="form.urgency" type="radio" value="low" class="sr-only">
                <div :class="form.urgency === 'low' ? 'border-green-500 bg-green-50' : 'border-gray-300'"
                     class="border-2 rounded-lg p-3 cursor-pointer text-center transition-colors">
                  <i class="ti ti-clock text-green-600 text-xl mb-1"></i>
                  <div class="font-medium text-gray-900">غیر فوری</div>
                </div>
              </label>
              <label class="relative">
                <input v-model="form.urgency" type="radio" value="medium" class="sr-only">
                <div :class="form.urgency === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'"
                     class="border-2 rounded-lg p-3 cursor-pointer text-center transition-colors">
                  <i class="ti ti-alert-triangle text-yellow-600 text-xl mb-1"></i>
                  <div class="font-medium text-gray-900">متوسط</div>
                </div>
              </label>
              <label class="relative">
                <input v-model="form.urgency" type="radio" value="high" class="sr-only">
                <div :class="form.urgency === 'high' ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                     class="border-2 rounded-lg p-3 cursor-pointer text-center transition-colors">
                  <i class="ti ti-alert-circle text-red-600 text-xl mb-1"></i>
                  <div class="font-medium text-gray-900">فوری</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Preferred Time -->
          <div>
            <label for="preferredTime" class="block text-sm font-medium text-gray-700 mb-2">
              زمان مطلوب (اختیاری)
            </label>
            <input
              v-model="form.preferredTime"
              type="datetime-local"
              id="preferredTime"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="ti ti-loader-2 animate-spin"></i>
              <i v-else class="ti ti-send"></i>
              {{ loading ? 'در حال ارسال...' : 'ارسال درخواست مشاوره' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Pricing Info -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">اطلاعات تعرفه</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">مشاوره آنلاین</span>
            <span class="font-bold text-gray-900">{{ vetInfo?.onlinePrice || '50,000' }} تومان</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">زمان تقریبی</span>
            <span class="font-bold text-gray-900">15-30 دقیقه</span>
          </div>
          <div class="pt-3 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              <i class="ti ti-info-circle ml-1"></i>
              پرداخت پس از تأیید زمان مشاوره توسط دکتر انجام می‌شود
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Component -->
    <Notification />
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'درخواست مشاوره آنلاین - پتومن',
  meta: [
    { name: 'description', content: 'درخواست مشاوره آنلاین با دامپزشک' }
  ]
})

const route = useRoute()
const router = useRouter()
const { showNotification } = useNotification()

// Get vet info from query params
const vetId = route.query.vet
const vetName = computed(() => {
  if (vetId === 'dr-mohammad-rezaei') return 'دکتر محمد رضایی'
  return 'دامپزشک'
})

// Mock vet data - در پروژه واقعی از API دریافت می‌شود
const vetInfo = ref({
  id: vetId,
  name: 'دکتر محمد رضایی',
  specialty: 'متخصص حیوانات خانگی',
  rating: 4.8,
  reviewCount: 127,
  isOnline: true,
  avatar: '/avatars/vet1.jpg',
  onlinePrice: '50,000'
})

// Form data
const form = reactive({
  petName: '',
  petType: '',
  petAge: '',
  issueDescription: '',
  urgency: 'medium',
  preferredTime: ''
})

const loading = ref(false)

const submitConsultation = async () => {
  loading.value = true
  
  try {
    // شبیه‌سازی ارسال درخواست به API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showNotification('درخواست مشاوره با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.', 'success')
    
    // انتقال به صفحه وضعیت درخواست یا پنل کاربری
    setTimeout(() => {
      router.push('/dashboard/consultations')
    }, 2000)
    
  } catch (error) {
    showNotification('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
