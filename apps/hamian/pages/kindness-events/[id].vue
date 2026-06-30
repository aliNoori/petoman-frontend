<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <div v-if="event" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Hero Image -->
          <div class="relative rounded-2xl overflow-hidden h-96 bg-rose-800">
            <img 
              v-if="event.image" 
              :src="event.image" 
              :alt="event.title" 
              class="w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <i :class="event.type === 'financial' ? 'ti ti-coin' : 'ti ti-heart-handshake'" class="text-rose-200 text-9xl"></i>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <!-- Type Badge -->
            <div class="absolute top-6 left-6">
              <span class="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 flex items-center gap-2">
                <i :class="event.type === 'financial' ? 'ti ti-coin' : 'ti ti-heart-handshake'"></i>
                {{ event.type === 'financial' ? 'قرار مالی' : 'قرار دورهمی' }}
              </span>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-6 right-6">
              <span class="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                {{ event.status }}
              </span>
            </div>
          </div>

          <!-- Event Info -->
          <div class="bg-white rounded-2xl p-8">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {{ event.title }}
            </h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <!-- Date/Time fields based on type -->
              <div class="flex items-center space-x-reverse space-x-3 border border-gray-200 rounded-lg p-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-calendar text-gray-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">{{ event.type === 'financial' ? 'تاریخ شروع' : 'تاریخ برگزاری' }}</div>
                  <div class="font-medium text-gray-900">{{
                      event.type === 'financial' ?formatDateToJalali(event.date)  :
                          formatDateToJalali(event.eventDate)
                    }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-reverse space-x-3 border border-gray-200 rounded-lg p-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-clock text-gray-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">{{ event.type === 'financial' ? 'مدت زمان' : 'ساعت شروع' }}</div>
                  <div class="font-medium text-gray-900">{{ event.type === 'financial' ? event.time : event.eventTime }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-reverse space-x-3 border border-gray-200 rounded-lg p-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-map-pin text-gray-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">محل {{ event.type === 'financial' ? 'اجرا' : 'برگزاری' }}</div>
                  <div class="font-medium text-gray-900">{{ event.location }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-reverse space-x-3 border border-gray-200 rounded-lg p-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-users text-gray-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">تعداد {{ event.type === 'financial' ? 'حامیان' : 'داوطلبان' }}</div>
                  <div class="font-medium text-gray-900">
                    {{ event.remainingSlots?
                      event.remainingSlots:kindnessEventStore.registrations[0].registrations.length }} نفر</div>
                </div>
              </div>
            </div>

            <!-- Financial Progress - Only for Financial Type -->
            <div v-if="event.type === 'financial' && event.goal" class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600">پیشرفت مالی قرار</span>
                <span class="text-2xl font-bold text-rose-600">{{ event.progress }}%</span>
              </div>
              <div class="w-full bg-rose-100 rounded-full h-3 mb-4">
                <div 
                  class="bg-rose-600 h-3 rounded-full transition-all duration-500"
                  :style="{ width: `${event.progress}%` }"
                ></div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center bg-gray-50 rounded-lg p-3">
                  <div class="text-xs text-gray-500 mb-1">جمع‌آوری شده</div>
                  <div class="text-lg font-bold text-rose-600">{{ formatNumber(event.current) }}</div>
                  <div class="text-xs text-gray-500">تومان</div>
                </div>
                <div class="text-center bg-gray-50 rounded-lg p-3">
                  <div class="text-xs text-gray-500 mb-1">هدف نهایی</div>
                  <div class="text-lg font-bold text-gray-700">{{ formatNumber(event.goal) }}</div>
                  <div class="text-xs text-gray-500">تومان</div>
                </div>
              </div>
            </div>

            <!-- Volunteer Event Info -->
            <div v-if="event.type === 'volunteer'" class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i class="ti ti-info-circle text-gray-600 text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">رویداد داوطلبانه</h3>
              </div>
              <p class="text-gray-600 leading-relaxed">
                این یک رویداد داوطلبانه است و نیازی به کمک مالی ندارد. فقط حضور و مشارکت شما کافی است. 
                لطفاً در تاریخ و ساعت مشخص شده در محل حضور پیدا کنید.
              </p>
            </div>

            <!-- Description -->
            <div class="prose prose-lg max-w-none">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="ti ti-info-circle text-gray-600"></i>
                درباره این قرار مهربانی
              </h3>
              <p class="text-gray-600 leading-relaxed">{{ event.description }}</p>
            </div>

            <!-- Manager Info -->
            <div v-if="event.manager" class="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex items-center space-x-reverse space-x-3">
                <div class="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center">
                  <i class="ti ti-user text-white text-xl"></i>
                </div>
                <div>
                  <div class="text-xs text-gray-500">{{ event.type === 'financial' ? 'مدیر قرار' : 'برگزارکننده' }}</div>
                  <div class="font-medium text-gray-900">{{ event.manager }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Support/Registration Form -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <div class="bg-white rounded-2xl p-8">
              <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-lg mb-4">
                  <i class="ti ti-heart-handshake text-rose-600 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ event.type === 'financial' ? 'حمایت از قرار' : 'ثبت‌نام در دورهمی' }}
                </h2>
                <p class="text-gray-600 text-sm">فرم زیر را تکمیل کنید</p>
              </div>

              <!-- Progress Info - Only for Financial -->
              <div v-if="event.type === 'financial' && event.goal" class="bg-rose-50 rounded-lg p-4 mb-6 border border-rose-200">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">جمع‌آوری شده</span>
                  <span class="text-lg font-bold text-rose-600">{{ formatNumber(event.current) }} ت</span>
                </div>
                <div class="w-full bg-rose-200 rounded-full h-2 mb-2">
                  <div 
                    class="bg-rose-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${event.progress}%` }"
                  ></div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">هدف: {{ formatNumber(event.goal) }} تومان</span>
                  <span class="text-xs font-medium text-gray-700">{{ event.progress }}%</span>
                </div>
              </div>

              <form @submit.prevent="submitForm" class="space-y-4">
                <!-- نام کامل -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                    <span class="text-rose-600">*</span>
                  </label>
                  <input 
                    v-model="formData.fullName"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>

                <!-- شماره موبایل -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    شماره موبایل
                    <span class="text-rose-600">*</span>
                  </label>
                  <input 
                    v-model="formData.phone"
                    type="tel" 
                    required
                    pattern="[0-9]{11}"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    placeholder="09123456789"
                  />
                </div>

                <!-- مبلغ کمک - Only for Financial -->
                <div v-if="event.type === 'financial'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    مبلغ کمک (تومان)
                    <span class="text-rose-600">*</span>
                  </label>
                  <input 
                    v-model.number="formData.amount"
                    type="number" 
                    required
                    min="10000"
                    step="10000"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    placeholder="100000"
                  />
                  <div class="flex gap-2 mt-2">
                    <button 
                      type="button"
                      @click="formData.amount = 50000"
                      class="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      ۵۰ هزار
                    </button>
                    <button 
                      type="button"
                      @click="formData.amount = 100000"
                      class="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      ۱۰۰ هزار
                    </button>
                    <button 
                      type="button"
                      @click="formData.amount = 500000"
                      class="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      ۵۰۰ هزار
                    </button>
                  </div>
                </div>

                <!-- پیام -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    پیام (اختیاری)
                  </label>
                  <textarea 
                    v-model="formData.message"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                    placeholder="پیام خود را بنویسید..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-rose-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">
                    {{ event.type === 'financial' ? 'حمایت از قرار' : 'ثبت‌نام در دورهمی' }}
                  </span>
                  <span v-else>
                    <i class="ti ti-loader-2 animate-spin text-lg ml-2"></i>
                    در حال پردازش...
                  </span>
                </button>

                <div v-if="submitMessage" :class="[
                  'p-4 rounded-xl text-center text-sm font-medium',
                  submitSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ submitMessage }}
                </div>
              </form>

              <!-- Info Note -->
              <div class="mt-6 p-4 bg-blue-50 rounded-xl">
                <div class="flex items-start space-x-reverse space-x-3">
                  <i class="ti ti-info-circle text-blue-600 text-xl flex-shrink-0"></i>
                  <p class="text-sm text-blue-700">
                    پس از پرداخت، رسید از طریق پیامک برای شما ارسال می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <i class="ti ti-alert-circle text-6xl text-gray-300 mb-4"></i>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">قرار مورد نظر پیدا نشد</h2>
      <NuxtLink to="/kindness-events" class="text-rose-600 hover:text-rose-700 font-medium">
        بازگشت به لیست قرارها
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useKindnessEventsStore} from "~/stores/kindness-events.ts";
import {toJalaliDate} from "~/utils/date.ts";
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";

const route = useRoute()

// Form Data for Donation
const formData = ref({
  fullName: '',
  phone: '',
  amount: 100000,
  message: '',
  helpType:''
})
const kindnessEventStore=useKindnessEventsStore()
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)


// Format number with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fa-IR').format(num)
}

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

// قرارهای مهربانی - این داده‌ها بعداً از API می‌آیند
/*const events = [
  {
    id: '1',
    type: 'financial', // قرار مالی
    title: 'کمک به حیوانات خیابانی',
    description: 'جمع‌آوری کمک برای تامین غذا و درمان حیوانات بی‌سرپناه در شهر. با کمک شما می‌توانیم به صدها حیوان نیازمند کمک کنیم و برای آن‌ها غذای مناسب، درمان و مراقبت لازم را فراهم کنیم. این پروژه شامل توزیع غذای روزانه، واکسیناسیون و درمان حیوانات آسیب‌دیده می‌شود.',
    date: '1403/07/01',
    time: '3 ماه',
    location: 'سراسر شهر تهران',
    remainingSlots: 124,
    status: 'فعال',
    progress: 85,
    current: 42500000,
    goal: 50000000,
    manager: 'احمد محمدی',
    startDate: '1403/07/01',
    endDate: '1403/10/01',
    image: null
  },
  {
    id: '2',
    type: 'financial', // قرار مالی
    title: 'درمان حیوانات آسیب‌دیده',
    description: 'کمپین درمان و مراقبت از حیوانات آسیب‌دیده و بیمار. هر کمک شما می‌تواند جان یک حیوان را نجات دهد. این پروژه شامل ارائه خدمات دامپزشکی رایگان، جراحی‌های ضروری و مراقبت‌های پس از عمل برای حیوانات نیازمند است.',
    date: '1403/06/15',
    time: '6 ماه',
    location: 'کلینیک‌های دامپزشکی',
    remainingSlots: 89,
    status: 'فعال',
    progress: 65,
    current: 19500000,
    goal: 30000000,
    manager: 'فاطمه احمدی',
    startDate: '1403/06/15',
    endDate: '1403/12/15',
    image: null
  },
  {
    id: '3',
    type: 'volunteer', // قرار دورهمی
    title: 'دورهمی مراقبت از گربه‌های ولگرد',
    description: 'برنامه روزانه تغذیه و مراقبت از گربه‌های ولگرد در محله‌های مختلف. به ما بپیوندید و با حضورتان به این موجودات کوچک کمک کنید. این دورهمی شامل نصب ظروف غذا و آب، تهیه غذای مخصوص و نظارت بر سلامت گربه‌های محله است.',
    eventDate: '1403/08/15',
    eventTime: '10:00',
    location: 'پارک ملت',
    remainingSlots: 15,
    status: 'فعال',
    manager: 'محمد رضایی',
    image: null
  },
  {
    id: '4',
    type: 'financial', // قرار مالی
    title: 'واکسیناسیون حیوانات',
    description: 'برنامه جامع واکسیناسیون حیوانات خانگی و خیابانی برای پیشگیری از بیماری‌های خطرناک. این پروژه با همکاری دامپزشکان متخصص انجام می‌شود و شامل واکسن هاری، سرفه سگی و سایر واکسن‌های ضروری است.',
    date: '1403/09/01',
    time: '4 ماه',
    location: 'مراکز بهداشتی',
    remainingSlots: 0,
    status: 'در انتظار',
    progress: 45,
    current: 13500000,
    goal: 30000000,
    manager: 'سارا کریمی',
    startDate: '1403/09/01',
    endDate: '1403/12/30',
    image: null
  },
  {
    id: '5',
    type: 'volunteer', // قرار دورهمی
    title: 'روز پاکسازی و مراقبت از پناهگاه',
    description: 'به ما در تمیز کردن و سرو غذا به حیوانات پناهگاه کمک کنید. این یک دورهمی داوطلبانه است که در آن می‌توانید با حضور خود و کار دستتان به بهبود شرایط حیوانات کمک کنید. فقط چند ساعت از وقت شما نیاز است.',
    eventDate: '1403/08/20',
    eventTime: '09:00',
    location: 'پناهگاه حیوانات کرج',
    remainingSlots: 20,
    status: 'فعال',
    manager: 'علی حسینی',
    image: null
  }
]*/

const event = events.value.find((e:any) => e.id === route.params.id)
const formatDateToJalali=(date:string)=>{

  return toJalaliDate(date)

}
// SEO
useSeoMeta({
  title: event ? `${event.title} - قرارهای مهربانی پتومن` : 'قرار مهربانی - پتومن',
  description: event?.description || 'جزئیات قرار مهربانی پتومن'
})


// Submit Donation Form
const submitForm = async () => {
  isSubmitting.value = true
  submitMessage.value = ''

  try {
    // TODO: ارسال به API
    if(event?.type=='volunteer')
    {
      await kindnessEventStore.createKindnessMeetingRegistration(String(route.params.id),{...formData.value,helpType:'volunteer',amount:0})
    }
    else{
      const { $axios } = useNuxtApp()
      const axios = $axios as AxiosInstance

      const supporterInfo={
        donorName:formData.value.fullName,
        donorPhone:formData.value.phone,
        isAnonymous:false,
        message:formData.value.message,
        purpose:'',
        acceptTerms:false,
        meetingId:String(route.params.id)

      }

      // سرور باید لینک redirectUrl رو برگردونه
      const { data } = await axios.post('/payments/pay', {
        supporterInfo: JSON.parse(JSON.stringify(supporterInfo)),
        amount: formData.value.amount,
        meta: { mobile: formData.value.phone,email:'info@example.com'}
      }, {
        headers: { 'Content-Type': 'application/json' } // بهتره صریح ست بشه
      })

      // حالا کاربر رو به لینک زرین‌پال هدایت کن
      window.location.href = data   // اگر سرور فقط لینک رو برگردونه
      // یا اگر سرور آبجکت برگردونه:
      // window.location.href = data.redirectUrl

      // اگر بخوای قبل از هدایت مودال نشون بدی:
      // showSuccess.value = true

      submitSuccess.value = true
      //submitMessage.value = 'در حال انتقال به درگاه پرداخت...'
      // window.location.href = '/payment-gateway'
    }
    // Reset form
    setTimeout(() => {
      formData.value = {
        fullName: '',
        phone: '',
        amount: 100000,
        message: '',
        helpType:''
      }
    }, 2000)
  } catch (error) {
    submitSuccess.value = false
    submitMessage.value = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'
  } finally {
    isSubmitting.value = false
  }
}
onMounted(async () => {

  await kindnessEventStore.fetchKindnessRegistrations(String(route.params.id))

})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
