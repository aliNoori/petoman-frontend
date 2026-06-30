<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Minimal -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white py-16 lg:py-20 overflow-hidden min-h-[400px] flex items-center">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
        <i class="ti ti-calendar-heart absolute top-10 left-16 text-rose-400 text-6xl rotate-12"></i>
        <i class="ti ti-heart-handshake absolute top-20 right-24 text-rose-400 text-7xl -rotate-6"></i>
        <i class="ti ti-paw-filled absolute bottom-16 left-1/4 text-rose-300 text-5xl rotate-45"></i>
        <i class="ti ti-heart absolute bottom-10 right-16 text-rose-400 text-6xl -rotate-12"></i>
        <i class="ti ti-users-group absolute top-1/2 left-10 text-rose-300 text-6xl rotate-6"></i>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          قرارهای مهربانی
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          با شرکت در قرارها، به حیوانات بی‌سرپناه کمک کنید
        </p>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Event Card -->
          <div 
            v-for="event in events" 
            :key="event.id"
            class="group bg-white rounded-2xl overflow-hidden transition-all duration-300"
          >
            <div class="relative h-64 overflow-hidden bg-rose-800">
              <!-- Event Image -->
              <img 
                v-if="event.image"
                :src="event.image" 
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <!-- Fallback Gradient with Icon -->
              <div v-else class="absolute inset-0 flex items-center justify-center opacity-30">
                <i :class="event.type === 'financial' ? 'ti ti-coin' : 'ti ti-heart-handshake'" class="text-white text-9xl"></i>
              </div>
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              <!-- Type Badge -->
              <div class="absolute top-4 left-4">
                <span 
                  class="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border flex items-center gap-2"
                  :class="event.type === 'financial' 
                    ? 'text-gray-700 border-gray-200' 
                    : 'text-gray-700 border-gray-200'"
                >
                  <i :class="event.type === 'financial' ? 'ti ti-coin' : 'ti ti-heart-handshake'"></i>
                  {{ event.type === 'financial' ? 'قرار مالی' : 'قرار دورهمی' }}
                </span>
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700">
                  {{ event.status }}
                </span>
              </div>
              
              <!-- Progress Bar - Only for Financial -->
              <div v-if="event.type === 'financial' && event.progress" class="absolute bottom-4 left-4 right-4">
                <div class="bg-white rounded-lg p-3 border border-gray-200">
                  <div class="flex items-center justify-between mb-2 px-1">
                    <span class="text-gray-700 text-xs font-medium">پیشرفت</span>
                    <span class="text-rose-600 text-xs font-bold">{{ event.progress }}%</span>
                  </div>
                  <div class="w-full bg-rose-100 rounded-full h-2">
                    <div 
                      class="bg-rose-600 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${event.progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="p-8">
              <div class="flex items-center space-x-reverse space-x-2 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <i class="ti ti-heart-handshake text-rose-600 text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {{ event.title }}
                  </h2>
                </div>
              </div>
              
              <p class="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                {{ event.description }}
              </p>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <!-- Date/Time based on type -->
                <div class="flex items-center space-x-reverse space-x-2 text-gray-700 border border-gray-200 rounded-lg p-3">
                  <i class="ti ti-calendar text-gray-600"></i>
                  <div>
                    <div class="text-xs text-gray-500">{{ event.type === 'financial' ? 'تاریخ شروع' : 'تاریخ برگزاری' }}</div>
                    <span class="text-sm font-medium">{{ event.type === 'financial' ? event.date : event.eventDate }}</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-reverse space-x-2 text-gray-700 border border-gray-200 rounded-lg p-3">
                  <i class="ti ti-clock text-gray-600"></i>
                  <div>
                    <div class="text-xs text-gray-500">{{ event.type === 'financial' ? 'مدت زمان' : 'ساعت شروع' }}</div>
                    <span class="text-sm font-medium">{{ event.type === 'financial' ? event.time : event.eventTime }}</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-reverse space-x-2 text-gray-700 border border-gray-200 rounded-lg p-3">
                  <i class="ti ti-users text-gray-600"></i>
                  <div>
                    <div class="text-xs text-gray-500">{{ event.type === 'financial' ? 'حامیان' : 'داوطلبان' }}</div>
                    <span class="text-sm font-medium">{{ event.remainingSlots }} نفر</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-reverse space-x-2 text-gray-700 border border-gray-200 rounded-lg p-3">
                  <i class="ti ti-map-pin text-gray-600"></i>
                  <div>
                    <div class="text-xs text-gray-500">محل</div>
                    <span class="text-sm font-medium line-clamp-1">{{ event.location }}</span>
                  </div>
                </div>
              </div>

              <!-- Financial Info - Only for Financial Type -->
              <div v-if="event.type === 'financial' && event.goal" class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">جمع‌آوری شده</span>
                  <span class="text-lg font-bold text-gray-900">{{ formatNumber(event.current) }} تومان</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">هدف نهایی</span>
                  <span class="text-sm font-medium text-gray-700">{{ formatNumber(event.goal) }} تومان</span>
                </div>
              </div>

              <!-- Volunteer Info - For Volunteer Type -->
              <div v-if="event.type === 'volunteer'" class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div class="flex items-center gap-2 text-gray-700 mb-2">
                  <i class="ti ti-info-circle"></i>
                  <span class="text-sm font-medium">رویداد داوطلبانه</span>
                </div>
                <p class="text-xs text-gray-600">بدون نیاز به کمک مالی - فقط حضور شما کافی است</p>
              </div>

              <NuxtLink 
                :to="`/kindness-events/${event.id}`"
                class="block w-full text-center font-medium py-3 px-6 rounded-lg transition-colors bg-rose-600 text-white hover:bg-rose-700"
              >
                {{ event.type === 'financial' ? 'مشاهده جزئیات و حمایت' : 'مشاهده جزئیات و ثبت‌نام' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">چطور حمایت کنم؟</h2>
          <p class="text-lg text-gray-600">سه قدم ساده تا حمایت از قرارهای مهربانی</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl mb-6">
              <span class="text-3xl font-bold text-rose-600">۱</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">قرار مورد نظر را انتخاب کنید</h3>
            <p class="text-gray-600">از بین قرارهای مختلف، یکی که بیشتر به دل‌تان نشسته را انتخاب کنید</p>
          </div>

          <div class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6">
              <span class="text-3xl font-bold text-green-600">۲</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">نوع مشارکت را انتخاب کنید</h3>
            <p class="text-gray-600">می‌توانید کمک مالی کنید یا در رویدادهای داوطلبانه شرکت کنید</p>
          </div>

          <div class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-6">
              <span class="text-3xl font-bold text-blue-600">۳</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">مشارکت خود را کامل کنید</h3>
            <p class="text-gray-600">پرداخت امن انجام دهید یا در رویداد ثبت‌نام کنید</p>
          </div>
        </div>

        <!-- Extra Info Box -->
        <div class="mt-12 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 rounded-2xl p-8 border border-rose-200">
          <div class="flex items-start space-x-reverse space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center">
                <i class="ti ti-info-circle text-white text-2xl"></i>
              </div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">💝 هر کمکی ارزشمند است</h3>
              <p class="text-gray-700 leading-relaxed">
                مهم نیست چقدر کمک می‌کنید، هر مبلغی می‌تواند در نجات و بهبود زندگی حیوانات نیازمند تاثیرگذار باشد. 
                با حمایت شما، ما می‌توانیم به صدها حیوان بی‌سرپناه غذا، درمان و سرپناه امن فراهم کنیم.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// قرارهای مهربانی - این داده‌ها بعداً از API می‌آیند
import {onMounted} from "vue";
import {useKindnessEventsStore} from "~/stores/kindness-events.ts";
const kindnessEventStore=useKindnessEventsStore()
import dayjs from 'dayjs'


const events = computed(() =>
    kindnessEventStore.kindnessEvents.map((item: any) => {
      const id = item.id
      const type = item.type // 'financial' | 'volunteer'
      const title = item.title
      const description = item.description
      const time=item.duration
      const progress=item.progress
      const goal=item.goal
      const manager=item.manager
      const current=item.current
      const startDate=item.startDate
      const eventDate=item.eventDate
      const endDate=item.endDate
      const eventTime=item.eventTime
      const endTime=item.endTime
      const remainingSlots=item.supporters
      const location = item.location || ''
      const status = item.status=='active'?'فعال':'غیرفعال'
      const image = item.image || null


      if (type === 'financial') {
        // مطابق نمونه‌ی مالی
        return {
          id,
          type,
          title,
          description,
          date:startDate,
          time,
          remainingSlots,
          status,
          progress,
          location,
          current,
          goal,
          manager,
          startDate,
          endDate,
          image,

        }
      } else {
        // volunteer مطابق نمونه‌ی دورهمی
        return {
          id,
          type,
          title,
          description,
          eventDate,
          eventTime,
          location,
          remainingSlots,
          status,
          manager,
          image
        }
      }
    })
)


/*const events = ref([
  {
    id: 1,
    type: 'financial', // قرار مالی
    title: 'کمک به حیوانات خیابانی',
    description: 'جمع‌آوری کمک برای تامین غذا و درمان حیوانات بی‌سرپناه در شهر. با کمک شما می‌توانیم به صدها حیوان نیازمند کمک کنیم.',
    date: '1403/07/01',
    time: '3 ماه',
    location: 'سراسر شهر تهران',
    remainingSlots: 124,
    status: 'فعال',
    progress: 85,
    current: 42500000,
    goal: 50000000,
    image: null
  },
  {
    id: 2,
    type: 'financial', // قرار مالی
    title: 'درمان حیوانات آسیب‌دیده',
    description: 'کمپین درمان و مراقبت از حیوانات آسیب‌دیده و بیمار. هر کمک شما می‌تواند جان یک حیوان را نجات دهد.',
    date: '1403/06/15',
    time: '6 ماه',
    location: 'کلینیک‌های دامپزشکی',
    remainingSlots: 89,
    status: 'فعال',
    progress: 65,
    current: 19500000,
    goal: 30000000,
    image: null
  },
  {
    id: 3,
    type: 'volunteer', // قرار دورهمی
    title: 'دورهمی مراقبت از گربه‌های ولگرد',
    description: 'برنامه روزانه تغذیه و مراقبت از گربه‌های ولگرد در محله‌های مختلف. به ما بپیوندید و با حضورتان به این موجودات کوچک کمک کنید.',
    eventDate: '1403/08/15',
    eventTime: '10:00',
    location: 'پارک ملت',
    remainingSlots: 15,
    status: 'فعال',
    image: null
  },
  {
    id: 4,
    type: 'financial', // قرار مالی
    title: 'واکسیناسیون حیوانات',
    description: 'برنامه جامع واکسیناسیون حیوانات خانگی و خیابانی برای پیشگیری از بیماری‌های خطرناک.',
    date: '1403/09/01',
    time: '4 ماه',
    location: 'مراکز بهداشتی',
    remainingSlots: 0,
    status: 'در انتظار',
    progress: 45,
    current: 13500000,
    goal: 30000000,
    image: null
  },
  {
    id: 5,
    type: 'volunteer', // قرار دورهمی
    title: 'روز پاکسازی و مراقبت از پناهگاه',
    description: 'به ما در تمیز کردن و سرو غذا به حیوانات پناهگاه کمک کنید. فقط چند ساعت از وقت شما نیاز است.',
    eventDate: '1403/08/20',
    eventTime: '09:00',
    location: 'پناهگاه حیوانات کرج',
    remainingSlots: 20,
    status: 'فعال',
    image: null
  },
  {
    id: 6,
    type: 'financial', // قرار مالی
    title: 'ساخت پناهگاه حیوانات',
    description: 'احداث پناهگاه حرفه‌ای برای نگهداری و مراقبت طولانی‌مدت از حیوانات بی‌سرپناه. یک سرپناه امن برای حیوانات.',
    date: '1403/10/01',
    time: '18 ماه',
    location: 'حومه شهر',
    remainingSlots: 78,
    status: 'فعال',
    progress: 30,
    current: 75000000,
    goal: 250000000,
    image: null
  }
])*/

// Format number with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fa-IR').format(num)
}

// TODO: دریافت داده‌ها از API
// onMounted(async () => {
//   const response = await fetch('/api/projects')
//   events.value = await response.json()
// })

// SEO Meta
useSeoMeta({
  title: 'قرارهای مهربانی - پتومن | پروژه‌های حمایتی',
  description: 'در قرارهای مهربانی پتومن شرکت کنید و به حیوانات بی‌سرپناه کمک کنید. غذا دادن، درمان، پاکسازی محیط و آموزش.',
  ogTitle: 'قرارهای مهربانی - پتومن',
  ogDescription: 'با شرکت در پروژه‌های حمایتی پتومن، به حیوانات بی‌سرپناه کمک کنید'
})
</script>
