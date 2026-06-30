<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Minimal -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white overflow-hidden min-h-[450px] flex items-center">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.06] pointer-events-none">
        <i class="ti ti-help absolute top-16 left-20 text-rose-400 text-7xl rotate-12"></i>
        <i class="ti ti-question-mark absolute top-32 right-24 text-rose-400 text-6xl -rotate-6"></i>
        <i class="ti ti-message-circle absolute bottom-20 left-1/3 text-rose-300 text-6xl rotate-45"></i>
        <i class="ti ti-bulb absolute bottom-24 right-1/4 text-rose-400 text-7xl -rotate-12"></i>
        <i class="ti ti-book absolute top-1/2 right-16 text-rose-300 text-6xl rotate-6"></i>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <!-- Icon -->
        <div class="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6">
          <i class="ti ti-help text-3xl text-rose-600"></i>
        </div>
        
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          سوالات متداول
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          پاسخ سوالات رایج در مورد نجات و حمایت از حیوانات
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <!-- Search -->
      <div class="mb-8">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در سوالات..."
            class="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
          <i class="ti ti-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="selectedCategory === category.id 
              ? 'bg-rose-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
          >
            <i :class="category.icon" class="ml-2"></i>
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div
          v-for="faq in filteredFAQs"
          :key="faq.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <button
            @click="toggleFAQ(faq.id)"
            class="w-full px-6 py-4 text-right hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 flex-1">
                {{ faq.question }}
              </h3>
              <i 
                class="ti ti-chevron-down text-gray-400 transition-transform duration-200"
                :class="{ 'transform rotate-180': openFAQs.includes(faq.id) }"
              ></i>
            </div>
          </button>
          
          <div 
            v-if="openFAQs.includes(faq.id)"
            class="px-6 pb-4"
          >
            <div class="pt-4 border-t border-gray-100">
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">
                {{ faq.answer }}
              </p>
              
              <div v-if="faq.links && faq.links.length > 0" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">لینک های مرتبط:</p>
                <div class="space-y-1">
                  <NuxtLink
                    v-for="link in faq.links"
                    :key="link.url"
                    :to="link.url"
                    class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <i class="ti ti-external-link text-xs ml-1"></i>
                    {{ link.title }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredFAQs.length === 0" class="text-center py-12">
        <i class="ti ti-search text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-700 mb-2">
          نتیجه‌ای یافت نشد
        </h3>
        <p class="text-gray-500">
          متأسفانه سوالی با این کلمات پیدا نشد. لطفاً کلمات دیگری امتحان کنید.
        </p>
      </div>

      <!-- Contact Section -->
      <div class="mt-16 bg-white rounded-xl p-8 text-center shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          سوال شما پاسخ داده نشد؟
        </h2>
        <p class="text-gray-600 mb-6">
          با تیم ما در تماس باشید تا پاسخ سوال‌تان را دریافت کنید
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:02112345678"
            class="inline-flex items-center justify-center px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            <i class="ti ti-phone text-sm ml-2"></i>
            تماس تلفنی
          </a>
          <a
            href="mailto:info@petoman.org"
            class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i class="ti ti-mail text-sm ml-2"></i>
            ارسال ایمیل
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useFaqStore} from "~/stores/faq.ts";
import {useCategoryTypeStore} from "~/stores/category-type.ts";
import {useCategoryStore} from "~/stores/category.ts";

const searchQuery = ref('')
const selectedCategory = ref('all')
const openFAQs = ref<string[]>([])
const categoryTypeStore=useCategoryTypeStore()
const categoryStore=useCategoryStore()

const faqTypeId = computed(()=>categoryTypeStore.idBySlug('faq'))


const categories = computed(() => {
  const base = categoryStore.getCategories(String(faqTypeId.value), 'hamian').map(c => ({
    id: c.slug,
    name: c.name,          // یا c.title بسته به استور
    icon: c.logo || 'ti ti-list'
  }))
  // آیتم‌های ثابت رو هم اضافه کن
  return [
    { id: 'all', name: 'همه', icon: 'ti ti-list' },
    ...base
  ]
})

/*const categories = [
  { id: 'all', name: 'همه', icon: 'ti ti-list' },
  { id: 'rescue', name: 'نجات', icon: 'ti ti-heart' },
  { id: 'adoption', name: 'فرزندخواندگی', icon: 'ti ti-home-heart' },
  { id: 'donation', name: 'کمک مالی', icon: 'ti ti-coins' },
  { id: 'volunteer', name: 'داوطلبی', icon: 'ti ti-hand-rock' },
  { id: 'care', name: 'مراقبت', icon: 'ti ti-medical-cross' }
]*/
const faqStore=useFaqStore()
const faqs=computed(()=>faqStore.faqs.map((item:any)=>{

  const id=item.id
  const category=item.category
  const question=item.question
  const answer=item.answer
  const links=item.links

  return {
    id,
    category,
    question,
    answer,
    links
  }


}))
/*const faqs = [
  {
    id: '1',
    category: 'rescue',
    question: 'چگونه حیوان آسیب‌دیده گزارش دهم؟',
    answer: `برای گزارش حیوان آسیب‌دیده می‌توانید:

1. با شماره تماس اضطراری ما تماس بگیرید: ۰۲۱-۱۲۳۴۵۶۷۸
2. از طریق پیام‌رسان‌های اجتماعی با ما در تماس باشید
3. فرم گزارش آنلاین را پر کنید

لطفاً اطلاعات زیر را آماده داشته باشید:
- موقعیت دقیق حیوان
- وضعیت ظاهری و نوع آسیب
- عکس از حیوان (در صورت امکان)
- شماره تماس شما برای هماهنگی`,
    links: [
      { title: 'فرم گزارش آنلاین', url: '/report' }
    ]
  },
  {
    id: '2',
    category: 'adoption',
    question: 'شرایط فرزندخواندگی چیست؟',
    answer: `برای فرزندخواندگی باید شرایط زیر را داشته باشید:

1. سن بالای ۱۸ سال
2. داشتن محل مناسب نگهداری
3. تعهد به مراقبت طولانی‌مدت
4. توانایی تأمین هزینه‌های درمانی و غذایی
5. گذراندن دوره آموزشی کوتاه

مراحل فرزندخواندگی:
- پر کردن فرم درخواست
- بازدید از پناهگاه و آشنایی با حیوان
- بررسی شرایط نگهداری
- امضای قرارداد فرزندخواندگی
- پیگیری دوره‌ای توسط تیم ما`,
    links: [
      { title: 'فرم درخواست فرزندخواندگی', url: '/adopt' }
    ]
  },
  {
    id: '3',
    category: 'donation',
    question: 'چگونه می‌توانم کمک مالی کنم؟',
    answer: `روش‌های کمک مالی:

1. کمک آنلاین از طریق سایت
2. واریز به حساب بانکی سازمان
3. پرداخت نقدی در محل پناهگاه

انواع کمک:
- کمک مالی عمومی
- تأمین هزینه درمان حیوان خاص
- خرید تجهیزات و غذا
- حمایت از پروژه‌های خاص

تمام کمک‌ها قابل کسر از مالیات هستند و رسید رسمی دریافت خواهید کرد.`,
    links: [
      { title: 'صفحه کمک مالی', url: '/donate' }
    ]
  },
  {
    id: '4',
    category: 'volunteer',
    question: 'چگونه داوطلب شوم؟',
    answer: `برای داوطلبی:

1. فرم ثبت‌نام داوطلب را پر کنید
2. در جلسه معارفه شرکت کنید
3. دوره آموزشی را بگذرانید
4. فعالیت‌تان را شروع کنید

زمینه‌های داوطلبی:
- مراقبت از حیوانات
- تمیزکاری پناهگاه
- کمک در درمان‌ها
- فعالیت‌های آموزشی
- مدیریت رسانه‌های اجتماعی
- ترابری حیوانات

حداقل تعهد زمانی: ۴ ساعت در هفته`,
    links: [
      { title: 'فرم ثبت‌نام داوطلب', url: '/volunteer' }
    ]
  },
  {
    id: '5',
    category: 'care',
    question: 'چگونه از حیوان خانگی‌ام مراقبت کنم؟',
    answer: `نکات مهم مراقبت:

تغذیه:
- غذای مناسب سن و نوع حیوان
- آب تمیز و تازه
- جلوگیری از غذاهای مضر

بهداشت:
- واکسیناسیون منظم
- بررسی‌های دوره‌ای دامپزشک
- مراقبت از دندان و ناخن

محیط:
- جای امن و تمیز
- ورزش و بازی کافی
- محیط محفوظ از خطرات

توجه ویژه به علائم بیماری و مراجعه فوری به دامپزشک در صورت مشکل.`,
    links: [
      { title: 'راهنمای کامل مراقبت', url: '/care-guide' }
    ]
  },
  {
    id: '6',
    category: 'rescue',
    question: 'در صورت پیدا کردن حیوان گمشده چه کنم؟',
    answer: `مراحل پیدا کردن حیوان گمشده:

1. بررسی وجود شناسه (قلاده، چیپ)
2. عکس گرفتن و انتشار در شبکه‌های اجتماعی
3. گزارش به پلیس و شهرداری
4. تماس با پناهگاه‌های محلی
5. نگهداری موقت ایمن

نکات مهم:
- با احتیاط نزدیک شوید
- غذا و آب ارائه دهید
- در صورت آسیب به دامپزشک مراجعه کنید
- اطلاعات تماس خود را ثبت کنید

ما می‌توانیم در پیدا کردن صاحب کمک‌تان کنیم.`
  },
  {
    id: '7',
    category: 'donation',
    question: 'آیا می‌توانم غیر از پول کمک کنم؟',
    answer: `البته! موارد مورد نیاز:

غذا و لوازم:
- غذای خشک و کنسرو
- اسباب‌بازی و تجهیزات بازی
- پتو و حوله
- قلاده و بند

تجهیزات پزشکی:
- دارو و ویتامین
- گاز و باند
- سرم و سرنگ

لوازم نظافت:
- مواد ضدعفونی کننده
- جاروبرقی و وسایل تمیزکاری
- کیسه زباله

لطفاً قبل از آوردن، با ما هماهنگ کنید تا از نیاز بودن اطمینان حاصل شود.`
  },
  {
    id: '8',
    category: 'care',
    question: 'چه زمانی باید حیوانم را به دامپزشک ببرم؟',
    answer: `علائم اضطراری:

فوری:
- عدم تنفس یا تنفس سخت
- خونریزی شدید
- بی‌هوشی یا تشنج
- مسمومیت
- شکستگی ظاهری

در اسرع وقت:
- تب بالا
- استفراغ مداوم
- اسهال خونی
- عدم تحرک
- درد شدید

بررسی منظم:
- واکسیناسیون سالانه
- چک‌آپ شش‌ماهه برای حیوانات مسن
- مراقبت از دندان و ناخن

در صورت شک، بهتر است زودتر مراجعه کنید.`
  }
]*/

const filteredFAQs = computed(() => {
  let filtered = faqs.value
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category.slug === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})

const toggleFAQ = (id: string) => {
  const index = openFAQs.value.indexOf(id)
  if (index > -1) {
    openFAQs.value.splice(index, 1)
  } else {
    openFAQs.value.push(id)
  }
}

// SEO
useHead({
  title: 'سوالات متداول - پتومن',
  meta: [
    { name: 'description', content: 'پاسخ سوالات رایج در مورد نجات، فرزندخواندگی و حمایت از حیوانات در پتومن' }
  ]
})
</script>
