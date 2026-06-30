<script setup lang="ts">
import {ref, computed} from 'vue'
import {generateSlug, extractIdFromSlug} from '~/utils/slugUtils.ts'
import {useSupporterStore} from "~/stores/supporter.ts";

const route = useRoute()
const router = useRouter()
const pending = ref(false)

const supporterId = route.params.id as string

// Types
interface SupporterData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  supportType: 'financial' | 'volunteer'
  experience: string
  motivation: string
  bio: string
  avatar: string
  joinDate: string
  totalDonation: string
  animalsSaved: number
  volunteerHours: number
  specialties?: string[]
  achievements?: Array<{
    title: string
    date: string
    icon: string
  }>
  socialLinks?: {
    instagram?: string
    telegram?: string
    linkedin?: string
    twitter?: string
  }
}

const supporterStore = useSupporterStore()
const supportersData = computed(() =>
    supporterStore.supporterCases.map(item => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      title: item.title,
      supportType: item.type, // volunteer یا financial
      experience: item.experience,
      motivation: item.motivation,
      bio: item.bio,
      avatar: item.avatar,
      joinDate: item.joinDate,
      totalDonation: item.totalDonation,
      animalsSaved: item.animalsSaved,
      volunteerHours: item.volunteerHours,
      specialties: item.specialties || [],
      achievements: item.achievements || [],
      socialLinks: item.socialLinks || {}
    }))
)
// Mock supporter data - حامی خودش بیوگرافیش رو نوشته
/*const supportersData: SupporterData[] = [
  {
    id: '1',
    firstName: 'سارا',
    lastName: 'احمدی',
    email: 'sara.ahmadi@email.com',
    phone: '09121234567',
    title: 'دامپزشک تیم نجات',
    supportType: 'volunteer',
    experience: 'بیش از ۱۰ سال تجربه در جراحی حیوانات کوچک و درمان حیوانات صدمه دیده. عضو نظام دامپزشکی و متخصص در حوزه مراقبت‌های اورژانسی حیوانات.',
    motivation: 'از کودکی عاشق حیوانات بودم و همیشه آرزو داشتم که بتوانم در کاهش درد و رنج آن‌ها نقش داشته باشم. باور دارم که هر موجود زنده‌ای حق زندگی کرامتمندانه دارد.',
    bio: 'سلام! من سارا هستم. از کودکی با حیوانات زندگی کرده‌ام و عاشق آن‌ها بودم. دانشکده دامپزشکی تهران رو رفتم و الان بیش از ۱۰ سال تجربه کار دارم. تو پتومن به عنوان دامپزشک داوطلب کار می‌کنم و تا حالا صدها حیوان رو درمان کردم. فکر می‌کنم این کار نه صرفاً شغل، بلکه رسالت زندگیمه.',
    avatar: '/images/supporter1.jpg',
    joinDate: '2023-03-15',
    totalDonation: '۲۵,۰۰۰,۰۰۰',
    animalsSaved: 156,
    volunteerHours: 420,
    specialties: ['جراحی اورژانس', 'طب داخلی', 'رادیولوژی', 'مراقبت‌های ویژه'],
    achievements: [
      { title: 'نجات ۱۰۰ حیوان', date: '2024-09-15', icon: 'ti ti-award' },
      { title: 'داوطلب برتر سال', date: '2024-12-29', icon: 'ti ti-trophy' },
      { title: 'حامی نمونه', date: '2025-03-01', icon: 'ti ti-medal' }
    ],
    socialLinks: {
      instagram: '@dr.sara.ahmadi',
      telegram: '@sara_vet'
    }
  },
  {
    id: '2',
    firstName: 'علی',
    lastName: 'کریمی',
    email: 'ali.karimi@email.com',
    phone: '09129876543',
    title: 'رئیس تیم داوطلبان',
    supportType: 'volunteer',
    experience: 'مدیریت تیم‌های داوطلب و هماهنگی عملیات نجات. تجربه ۸ ساله در سازمان‌های غیرانتفاعی و مدیریت پروژه‌های اجتماعی.',
    motivation: 'معتقدم که جامعه‌ای که به حیوانات رحم کند، جامعه‌ای انسان‌تر خواهد بود. می‌خواهم نسل آینده را در محیطی رشد دهم که مهربانی و عطوفت در آن حکمفرماست.',
    bio: 'من علی هستم، مدیر تیم داوطلبان پتومن. از ۸ سال پیش که تو این حوزه فعالیت می‌کنم و تجربه کار با سازمان‌های مختلف رو دارم. اینجا مسئولیت هماهنگی عملیات نجات و آموزش داوطلبان جدید رو برعهده دارم. برام خیلی مهمه که بتونیم یه تیم قوی و منسجم داشته باشیم تا بتونیم به بهترین شکل کمک کنیم.',
    avatar: '/images/supporter2.jpg',
    joinDate: '2023-02-10',
    totalDonation: '۱۸,۵۰۰,۰۰۰',
    animalsSaved: 203,
    volunteerHours: 680,
    specialties: ['مدیریت عملیات', 'هماهنگی تیم', 'آموزش داوطلبان', 'برنامه‌ریزی'],
    achievements: [
      { title: 'مدیر نمونه', date: '2024-12-10', icon: 'ti ti-users' },
      { title: 'سازمان‌دهی ۵۰ عملیات نجات', date: '2024-11-20', icon: 'ti ti-calendar-check' },
      { title: 'آموزش ۱۰۰ داوطلب', date: '2025-01-15', icon: 'ti ti-school' }
    ],
    socialLinks: {
      instagram: '@ali_rescue',
      linkedin: 'ali-karimi-social'
    }
  },
  {
    id: '3',
    firstName: 'مریم',
    lastName: 'صادقی',
    email: 'maryam.sadeghi@email.com',
    phone: '09123456789',
    title: 'مسئول روابط عمومی',
    supportType: 'financial',
    experience: 'کارشناس ارتباطات با ۶ سال تجربه در حوزه روابط عمومی و رسانه. مسلط به طراحی محتوا و استراتژی‌های دیجیتال مارکتینگ.',
    motivation: 'باور دارم که آگاهی‌بخشی و اطلاع‌رسانی می‌تواند تغییر بزرگی در نگرش جامعه نسبت به حیوانات ایجاد کند. هر پست، هر محتوا می‌تواند زندگی یک حیوان را نجات دهد.',
    bio: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. اینجا مسئولیت اطلاع‌رسانی فعالیت‌ها و ارتباط با رسانه‌ها رو دارم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم و نگرششون نسبت به حیوانات رو تغییر بدم. فکر می‌کنم هر محتوا می‌تونه زندگی یه حیوان رو نجات بده.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    totalDonation: '۱۲,۰۰۰,۰۰۰',
    animalsSaved: 89,
    volunteerHours: 320,
    specialties: ['تولید محتوا', 'روابط رسانه', 'دیجیتال مارکتینگ', 'عکاسی'],
    achievements: [
      { title: 'بهترین کمپین تبلیغاتی', date: '2024-10-25', icon: 'ti ti-camera' },
      { title: '۱ میلیون بازدید محتوا', date: '2024-01-05', icon: 'ti ti-eye' },
      { title: 'رسانه‌ای برتر', date: '2025-02-10', icon: 'ti ti-microphone' }
    ],
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  }
]*/

// Computed
const supporter = computed(() => {
console.log('supporterId',supporterId)
  if (!supporterId) return null
  return supportersData.value.find(s => s.id === supporterId)
})

const supporterSlug = computed(() => {
  if (!supporter.value) return ''
  return generateSlug(supporter.value.id, supporter.value.firstName, supporter.value.lastName)
})

// Methods
const getSupportTypeName = (type: string) => {
  const types = {
    financial: 'حامی مالی',
    volunteer: 'داوطلب'
  }
  return types[type as keyof typeof types] || 'حامی'
}

const handleEdit = () => {
  if (supporter.value) {
    router.push(`/supporters/${supporterSlug.value}/edit`)
  }
}

const getSupportTypeBadge = (type: string) => {
  const badges = {
    financial: 'bg-green-100 text-green-800',
    volunteer: 'bg-blue-100 text-blue-800'
  }
  return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

const getSupportTypeIcon = (type: string) => {
  const icons = {
    financial: 'ti ti-coin',
    volunteer: 'ti ti-users'
  }
  return icons[type as keyof typeof icons] || 'ti ti-user'
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('fa-IR', options)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}


</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="ti ti-loader animate-spin text-4xl text-rose-600 mb-4"></i>
        <p class="text-gray-600">در حال بارگذاری...</p>
      </div>
    </div>

    <!-- Supporter Not Found -->
    <div v-else-if="!supporter" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="ti ti-user-off text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">حامی یافت نشد</h2>
        <p class="text-gray-600 mb-6">حامی مورد نظر شما وجود ندارد یا حذف شده است.</p>
        <NuxtLink
            to="/supporters"
            class="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
        >
          <i class="ti ti-arrow-right text-lg ml-3"></i>
          بازگشت به حامیان
        </NuxtLink>
      </div>
    </div>

    <!-- Supporter Profile -->
    <div v-else class="pt-[73px]">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-[73px] z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between py-4">
            <NuxtLink to="/supporters"
                      class="flex items-center space-x-reverse space-x-3 text-gray-900 hover:text-rose-600 transition-colors">
              <i class="ti ti-chevron-right text-lg"></i>
              <span class="font-medium">بازگشت به لیست</span>
            </NuxtLink>
            <h1 class="text-lg font-bold text-gray-900">پروفایل حامی</h1>
          </div>
        </div>
      </header>      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 gap-8">
          <!-- Main Profile -->
          <div class="space-y-8">
            <!-- Profile Header -->
            <div class="bg-white rounded-3xl overflow-hidden">
              <!-- Cover -->
              <div class="relative bg-gradient-to-br from-rose-500 to-rose-600 h-48 lg:h-64">
                <div
                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-full"></div>
                <div class="absolute bottom-6 left-6 right-6">
                  <div class="flex items-end space-x-reverse space-x-6">
                    <!-- Avatar -->
                    <div class="relative">
                      <img
                          :src="supporter.avatar"
                          :alt="supporter.firstName + ' ' + supporter.lastName"
                          class="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white"
                      />
                      <div
                          class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <!-- Info -->
                    <div class="flex-1 min-w-0 text-white">
                      <h1 class="text-2xl lg:text-3xl font-bold mb-1">{{ supporter.firstName }} {{
                          supporter.lastName
                        }}</h1>
                      <p class="text-rose-100 font-medium text-lg">{{ supporter.title }}</p>
                      <div class="flex items-center mt-2 text-sm text-rose-100">
                        <i class="ti ti-calendar text-sm ml-1"></i>
                        حامی از {{ formatDate(supporter.joinDate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact & Social Info -->
              <div class="p-6 lg:p-8">
                <div class="flex flex-col space-y-3 mb-6">
                  <div class="flex items-center space-x-reverse space-x-3 text-gray-600">
                    <i class="ti ti-mail text-rose-600"></i>
                    <span class="text-sm">{{ supporter.email }}</span>
                  </div>
                  <div class="flex items-center space-x-reverse space-x-3 text-gray-600">
                    <i class="ti ti-phone text-rose-600"></i>
                    <span class="text-sm" dir="ltr">{{ supporter.phone }}</span>
                  </div>
                </div>

                <!-- Social Links -->
                <div v-if="supporter.socialLinks" class="flex gap-3">
                  <a
                      v-if="supporter.socialLinks.instagram"
                      :href="`https://instagram.com/${supporter.socialLinks.instagram.replace('@', '')}`"
                      target="_blank"
                      class="flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm transition-all"
                  >
                    <i class="ti ti-brand-instagram text-lg ml-2"></i>
                    اینستاگرام
                  </a>

                  <a
                      v-if="supporter.socialLinks.telegram"
                      :href="`https://t.me/${supporter.socialLinks.telegram.replace('@', '')}`"
                      target="_blank"
                      class="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm transition-all"
                  >
                    <i class="ti ti-brand-telegram text-lg ml-2"></i>
                    تلگرام
                  </a>

                  <a
                      v-if="supporter.socialLinks.linkedin"
                      :href="`https://linkedin.com/in/${supporter.socialLinks.linkedin}`"
                      target="_blank"
                      class="flex items-center px-3 py-2 bg-blue-700 text-white rounded-lg text-sm transition-all"
                  >
                    <i class="ti ti-brand-linkedin text-lg ml-2"></i>
                    لینکدین
                  </a>

                  <a
                      v-if="supporter.socialLinks.twitter"
                      :href="`https://twitter.com/${supporter.socialLinks.twitter.replace('@', '')}`"
                      target="_blank"
                      class="flex items-center px-3 py-2 bg-sky-500 text-white rounded-lg text-sm transition-all"
                  >
                    <i class="ti ti-brand-twitter text-lg ml-2"></i>
                    توییتر
                  </a>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-white rounded-2xl p-6 text-center">
                <div class="text-3xl font-bold text-rose-600 mb-2">{{ formatCurrency(supporter.animalsSaved) }}</div>
                <div class="text-sm text-gray-600">حیوان نجات یافته</div>
              </div>
              <div class="bg-white rounded-2xl p-6 text-center">
                <div class="text-3xl font-bold text-rose-600 mb-2">{{ formatCurrency(supporter.volunteerHours??0) }}</div>
                <div class="text-sm text-gray-600">ساعت فعالیت داوطلبانه</div>
              </div>
            </div>

            <!-- About -->
            <div class="bg-white rounded-2xl p-6 lg:p-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">درباره {{ supporter.firstName }}</h2>
              <div class="prose prose-lg max-w-none">
                <p class="text-gray-600 leading-relaxed">{{ supporter.bio }}</p>
              </div>
            </div>

            <!-- Experience & Motivation -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">تجربه و تخصص</h3>
                <p class="text-gray-600 leading-relaxed mb-6">{{ supporter.experience }}</p>
                <div v-if="supporter.specialties" class="flex flex-wrap gap-2">
                  <span
                      v-for="specialty in supporter.specialties"
                      :key="specialty"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {{ specialty }}
                  </span>
                </div>
              </div>
              <div class="bg-white rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">انگیزه و هدف</h3>
                <p class="text-gray-600 leading-relaxed">{{ supporter.motivation }}</p>
              </div>
            </div>

            <!-- Achievements -->
            <div v-if="supporter.achievements" class="bg-white rounded-2xl p-6 lg:p-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">دستاوردها</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="achievement in supporter.achievements"
                    :key="achievement.title"
                    class="flex items-center space-x-reverse space-x-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div class="flex-shrink-0">
                    <i :class="achievement.icon" class="text-2xl text-rose-600"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 mb-1">{{ achievement.title }}</div>
                    <div class="text-sm text-gray-500">{{ formatDate(achievement.date) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>