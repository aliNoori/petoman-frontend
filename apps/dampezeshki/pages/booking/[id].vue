<template>
  <div class="pb-24 md:pb-6">
    <!-- Header موبایل -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <NuxtLink to="/booking" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="ti ti-arrow-right text-xl text-gray-700"></i>
          </NuxtLink>
          <span class="font-bold text-gray-900">{{ doctor?.name }}</span>
        </div>
      </div>
    </div>

    <div class="pt-16 lg:pt-0">
      <!-- Back Button Desktop -->
      <div class="hidden lg:flex items-center gap-2 mb-6">
        <NuxtLink to="/booking" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="ti ti-arrow-right text-xl text-gray-700"></i>
        </NuxtLink>
        <span class="text-gray-500">برگشت به لیست دکترها</span>
      </div>

      <div class="lg:grid lg:grid-cols-3 lg:gap-6 px-4 lg:px-0">
        <!-- Doctor Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden lg:sticky lg:top-4">
            <!-- Doctor Header -->
            <div class="p-4 lg:p-6 text-center border-b border-gray-100">
              <div class="relative inline-block mb-4">
                <img 
                  :src="doctor?.avatar" 
                  :alt="doctor?.name"
                  class="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl object-cover border-4 border-gray-200 mx-auto"
                >
                <div 
                  class="absolute -bottom-1 -left-1 w-6 h-6 rounded-full border-3 border-white"
                  :class="doctor?.isOnline ? 'bg-green-500' : 'bg-gray-400'"
                ></div>
              </div>
              <div class="flex items-center justify-center gap-2 mb-1">
                <h1 class="text-lg lg:text-xl font-bold text-gray-900">{{ doctor?.name }}</h1>
                <i v-if="doctor?.isVerified" class="ti ti-circle-check-filled text-blue-500"></i>
              </div>
              <p class="text-gray-600 mb-3">{{ doctor?.specialty }}</p>
              
              <div class="flex items-center justify-center gap-4 text-sm">
                <div class="flex items-center gap-1">
                  <i class="ti ti-star-filled text-yellow-500"></i>
                  <span class="font-bold">{{ doctor?.rating }}</span>
                  <span class="text-gray-400">({{ doctor?.reviewsCount }})</span>
                </div>
                <span 
                  class="px-2 py-0.5 rounded-full text-xs"
                  :class="doctor?.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ doctor?.isOnline ? 'آنلاین' : 'آفلاین' }}
                </span>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-1 p-4 bg-gray-50">
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">تجربه</p>
                <p class="font-bold text-gray-900">{{ doctor?.experience }} سال</p>
              </div>
              <div class="text-center border-x border-gray-200">
                <p class="text-xs text-gray-500 mb-1">بیماران</p>
                <p class="font-bold text-gray-900">{{ doctor?.patientsCount }}+</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-1">پاسخ</p>
                <p class="font-bold text-gray-900">{{ doctor?.responseTime }} دقیقه</p>
              </div>
            </div>

            <!-- Contact Actions - Desktop Only -->
            <div class="hidden lg:block p-4 border-t border-gray-100">
              <div class="flex gap-2">
                <button class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  <i class="ti ti-bookmark ml-1"></i>
                  ذخیره
                </button>
                <button class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  <i class="ti ti-share ml-1"></i>
                  اشتراک
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 mt-4 lg:mt-0">
          <!-- Tabs -->
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div class="flex border-b border-gray-200">
              <button 
                @click="activeTab = 'services'"
                class="flex-1 py-3 px-4 text-sm font-medium transition-colors relative"
                :class="activeTab === 'services' ? 'text-emerald-600' : 'text-gray-500'"
              >
                خدمات
                <span v-if="activeTab === 'services'" class="absolute bottom-0 right-0 left-0 h-0.5 bg-emerald-600"></span>
              </button>
              <button 
                @click="activeTab = 'about'"
                class="flex-1 py-3 px-4 text-sm font-medium transition-colors relative"
                :class="activeTab === 'about' ? 'text-emerald-600' : 'text-gray-500'"
              >
                درباره
                <span v-if="activeTab === 'about'" class="absolute bottom-0 right-0 left-0 h-0.5 bg-emerald-600"></span>
              </button>
              <button 
                @click="activeTab = 'reviews'"
                class="flex-1 py-3 px-4 text-sm font-medium transition-colors relative"
                :class="activeTab === 'reviews' ? 'text-emerald-600' : 'text-gray-500'"
              >
                نظرات
                <span v-if="activeTab === 'reviews'" class="absolute bottom-0 right-0 left-0 h-0.5 bg-emerald-600"></span>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-4">
              <!-- Services Tab -->
              <div v-if="activeTab === 'services'" class="space-y-3">
                <h2 class="font-bold text-gray-900 mb-4 hidden lg:block">نوع خدمت را انتخاب کنید</h2>
                
                <!-- Chat Service -->
                <div 
                  @click="selectService('chat')"
                  class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                  :class="selectedService === 'chat' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-message-dots text-xl text-emerald-600"></i>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">گفتگوی متنی</h3>
                        <p class="text-sm text-gray-500 mt-0.5">چت آنلاین با دکتر</p>
                      </div>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-emerald-600">{{ services.chat.price.toLocaleString('fa-IR') }}</p>
                      <p class="text-xs text-gray-500">تومان</p>
                    </div>
                  </div>
                </div>

                <!-- Instant Call Service -->
                <div 
                  @click="selectService('instantCall')"
                  class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                  :class="selectedService === 'instantCall' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-phone text-xl text-blue-600"></i>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">تماس فوری</h3>
                        <p class="text-sm text-gray-500 mt-0.5">تماس تلفنی همین الان</p>
                        <span v-if="doctor?.isOnline" class="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                          <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          دکتر آنلاین است
                        </span>
                      </div>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-blue-600">{{ services.instantCall.price.toLocaleString('fa-IR') }}</p>
                      <p class="text-xs text-gray-500">تومان / {{ services.instantCall.duration }} دقیقه</p>
                    </div>
                  </div>
                </div>

                <!-- Scheduled Call Service -->
                <div 
                  @click="selectService('scheduledCall')"
                  class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                  :class="selectedService === 'scheduledCall' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-calendar-event text-xl text-purple-600"></i>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">تماس با نوبت</h3>
                        <p class="text-sm text-gray-500 mt-0.5">رزرو وقت تماس</p>
                      </div>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-purple-600">{{ services.scheduledCall.price.toLocaleString('fa-IR') }}</p>
                      <p class="text-xs text-gray-500">تومان / {{ services.scheduledCall.duration }} دقیقه</p>
                    </div>
                  </div>
                </div>

                <!-- Clinic Visit Service -->
                <div 
                  @click="selectService('clinicVisit')"
                  class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                  :class="selectedService === 'clinicVisit' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-building-hospital text-xl text-orange-600"></i>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">ویزیت در کلینیک</h3>
                        <p class="text-sm text-gray-500 mt-0.5">مراجعه حضوری به مطب</p>
                        <p class="text-xs text-gray-400 mt-1">{{ doctor?.clinicAddress }}</p>
                      </div>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-orange-600">{{ services.clinicVisit.price.toLocaleString('fa-IR') }}</p>
                      <p class="text-xs text-gray-500">تومان</p>
                    </div>
                  </div>
                </div>

                <!-- Home Visit Service -->
                <div 
                  @click="selectService('homeVisit')"
                  class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                  :class="selectedService === 'homeVisit' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                        <i class="ti ti-home text-xl text-rose-600"></i>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">ویزیت در منزل</h3>
                        <p class="text-sm text-gray-500 mt-0.5">دکتر به محل شما می‌آید</p>
                      </div>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-rose-600">{{ services.homeVisit.price.toLocaleString('fa-IR') }}</p>
                      <p class="text-xs text-gray-500">تومان</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- About Tab -->
              <div v-else-if="activeTab === 'about'" class="space-y-4">
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">درباره دکتر</h3>
                  <p class="text-gray-600 leading-relaxed text-sm">{{ doctor?.about }}</p>
                </div>
                
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">تخصص‌ها</h3>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="spec in doctor?.specialties" 
                      :key="spec"
                      class="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg"
                    >
                      {{ spec }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="font-bold text-gray-900 mb-2">آدرس کلینیک</h3>
                  <p class="text-gray-600 text-sm">{{ doctor?.clinicAddress }}</p>
                </div>
              </div>

              <!-- Reviews Tab -->
              <div v-else-if="activeTab === 'reviews'" class="space-y-4">
                <!-- Overall Rating -->
                <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div class="text-center">
                    <p class="text-3xl font-bold text-gray-900">{{ doctor?.rating }}</p>
                    <div class="flex items-center justify-center gap-0.5 text-yellow-500 my-1">
                      <i v-for="i in 5" :key="i" class="ti ti-star-filled text-sm"></i>
                    </div>
                    <p class="text-xs text-gray-500">{{ doctor?.reviewsCount }} نظر</p>
                  </div>
                </div>

                <!-- Reviews List -->
                <div v-for="review in reviews" :key="review.id" class="pb-4 border-b border-gray-100 last:border-0">
                  <div class="flex items-start gap-3">
                    <img 
                      :src="review.avatar"
                      class="w-10 h-10 rounded-full object-cover"
                    >
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium text-gray-900">{{ review.name }}</span>
                        <span class="text-xs text-gray-400">{{ review.date }}</span>
                      </div>
                      <div class="flex items-center gap-0.5 text-yellow-500 mb-2">
                        <i v-for="i in review.rating" :key="i" class="ti ti-star-filled text-xs"></i>
                        <i v-for="i in (5 - review.rating)" :key="i" class="ti ti-star text-gray-300 text-xs"></i>
                      </div>
                      <p class="text-sm text-gray-600">{{ review.comment }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
      <div class="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div v-if="selectedService">
          <p class="text-xs text-gray-500">هزینه {{ getServiceLabel(selectedService) }}</p>
          <p class="text-lg font-bold text-emerald-600">{{ getSelectedServicePrice().toLocaleString('fa-IR') }} <span class="text-sm font-normal">تومان</span></p>
        </div>
        <div v-else>
          <p class="text-gray-500 text-sm">نوع خدمت را انتخاب کنید</p>
        </div>
        <button 
          @click="proceedToSchedule"
          :disabled="!selectedService"
          class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          ادامه
          <i class="ti ti-chevron-left mr-1"></i>
        </button>
      </div>
    </div>

    <!-- Duration Modal for Instant Call -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDurationModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDurationModal = false">
          <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-900">مدت تماس را انتخاب کنید</h3>
                <button @click="showDurationModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
                  <i class="ti ti-x text-gray-500"></i>
                </button>
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div 
                v-for="option in durationOptions" 
                :key="option.duration"
                @click="selectDuration(option)"
                class="border-2 rounded-xl p-4 cursor-pointer transition-all"
                :class="selectedDuration?.duration === option.duration ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i class="ti ti-clock text-xl text-blue-600"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">{{ option.duration }} دقیقه</h4>
                      <p class="text-sm text-gray-500">{{ option.description }}</p>
                    </div>
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-blue-600">{{ option.price.toLocaleString('fa-IR') }}</p>
                    <p class="text-xs text-gray-500">تومان</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200">
              <button 
                @click="confirmDuration"
                :disabled="!selectedDuration"
                class="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium disabled:bg-gray-300"
              >
                تایید و ادامه
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute()

// SEO
useHead({
  title: 'رزرو نوبت - پتومن'
})

// State
const activeTab = ref('services')
const selectedService = ref(null)
const showDurationModal = ref(false)
const selectedDuration = ref(null)

// Services pricing
const services = {
  chat: { price: 126000, duration: null },
  instantCall: { price: 140000, duration: 10 },
  scheduledCall: { price: 140000, duration: 10 },
  clinicVisit: { price: 250000, duration: null },
  homeVisit: { price: 400000, duration: null }
}

// Duration options for instant call
const durationOptions = [
  { duration: 10, price: 140000, description: 'مشاوره کوتاه' },
  { duration: 15, price: 196000, description: 'مشاوره استاندارد' },
  { duration: 20, price: 259000, description: 'مشاوره کامل' }
]

// Mock doctor data
const doctor = ref({
  id: route.params.id,
  name: 'دکتر علی احمدی',
  avatar: 'https://i.pravatar.cc/150?img=11',
  specialty: 'متخصص حیوانات خانگی',
  rating: 4.9,
  reviewsCount: 246,
  experience: 12,
  patientsCount: 1850,
  responseTime: 5,
  isOnline: true,
  isVerified: true,
  clinicAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۵',
  about: 'دکتر علی احمدی با بیش از ۱۲ سال تجربه در زمینه درمان حیوانات خانگی، فارغ‌التحصیل دانشگاه تهران و دارای مدرک تخصصی از آلمان. ایشان در زمینه درمان سگ، گربه و حیوانات کوچک تخصص دارند.',
  specialties: ['حیوانات خانگی', 'جراحی', 'واکسیناسیون', 'تغذیه']
})

// Mock reviews
const reviews = ref([
  {
    id: 1,
    name: 'محمد رضایی',
    avatar: 'https://i.pravatar.cc/50?img=1',
    rating: 5,
    date: '۲ روز پیش',
    comment: 'دکتر بسیار خوب و با حوصله بودند. گربه من حالش خیلی بهتر شد.'
  },
  {
    id: 2,
    name: 'سارا کریمی',
    avatar: 'https://i.pravatar.cc/50?img=5',
    rating: 4,
    date: '۵ روز پیش',
    comment: 'مشاوره تلفنی عالی بود. ممنون از راهنمایی‌های خوبشون.'
  },
  {
    id: 3,
    name: 'علی موسوی',
    avatar: 'https://i.pravatar.cc/50?img=8',
    rating: 5,
    date: '۱ هفته پیش',
    comment: 'ویزیت در منزل خیلی راحت بود. دکتر به موقع اومدن و خیلی حرفه‌ای بودن.'
  }
])

// Methods
const selectService = (service) => {
  selectedService.value = service
  if (service === 'instantCall') {
    showDurationModal.value = true
  }
}

const selectDuration = (option) => {
  selectedDuration.value = option
}

const confirmDuration = () => {
  showDurationModal.value = false
  proceedToSchedule()
}

const getServiceLabel = (service) => {
  const labels = {
    chat: 'گفتگوی متنی',
    instantCall: 'تماس فوری',
    scheduledCall: 'تماس با نوبت',
    clinicVisit: 'ویزیت در کلینیک',
    homeVisit: 'ویزیت در منزل'
  }
  return labels[service] || ''
}

const getSelectedServicePrice = () => {
  if (selectedService.value === 'instantCall' && selectedDuration.value) {
    return selectedDuration.value.price
  }
  return services[selectedService.value]?.price || 0
}

const proceedToSchedule = () => {
  if (!selectedService.value) return
  
  if (selectedService.value === 'chat') {
    // Direct to chat - go to checkout
    navigateTo(`/booking/${route.params.id}/checkout?service=chat`)
  } else if (selectedService.value === 'instantCall') {
    if (!selectedDuration.value) {
      showDurationModal.value = true
      return
    }
    // Direct call - go to checkout
    navigateTo(`/booking/${route.params.id}/checkout?service=instantCall&duration=${selectedDuration.value.duration}`)
  } else {
    // Schedule required - go to schedule page
    navigateTo(`/booking/${route.params.id}/schedule?service=${selectedService.value}`)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
