<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-yellow-400">
    <!-- Header -->
    <HeaderFilm />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 pt-32 pb-8">
      <!-- Search -->
      <div class="mb-8">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در سوالات..."
              class="w-full px-4 py-3 pr-12 border border-yellow-400/30 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-zinc-900 text-yellow-300 placeholder-gray-500"
            >
            <i class="ti ti-search absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400"></i>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="filter in filterOptions"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            class="px-6 py-2.5 rounded-lg font-medium transition-all"
            :class="selectedFilter === filter.value 
              ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30' 
              : 'bg-zinc-900 text-yellow-400 hover:bg-zinc-800 border border-yellow-400/20'"
          >
            <i :class="filter.icon" class="ml-2"></i>
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- FAQ List -->
      <div class="max-w-4xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
          <p class="text-yellow-300 mt-4">در حال بارگذاری...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredFAQs.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 border border-yellow-400/20 flex items-center justify-center">
            <i class="ti ti-search-off text-5xl text-yellow-400"></i>
          </div>
          <h3 class="text-xl font-bold text-yellow-400 mb-2">نتیجه‌ای یافت نشد</h3>
          <p class="text-gray-400">سوالی با این مشخصات پیدا نشد</p>
        </div>

        <!-- FAQ Items -->
        <div v-else class="space-y-4">
          <div
            v-for="(faq, index) in filteredFAQs"
            :key="faq.id"
            class="bg-zinc-900 rounded-xl border border-yellow-400/20 overflow-hidden hover:shadow-lg hover:shadow-yellow-400/10 transition-shadow"
          >
            <button
              @click="toggleFAQ(index)"
              class="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-zinc-800 transition-colors"
            >
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                  <i class="ti ti-help text-yellow-400 text-xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-yellow-400 mb-1">{{ faq.question }}</h3>
                  <div class="flex items-center gap-3 text-sm text-gray-400">
                    <span class="inline-flex items-center gap-1">
                      <i :class="getContentTypeIcon(faq.contentType)"></i>
                      {{ getContentTypeLabel(faq.contentType) }}
                    </span>
<!--                    <span v-if="faq.contentTitle" class="inline-flex items-center gap-1">
                      <i class="ti ti-movie"></i>
                      {{ faq.contentTitle }}
                    </span>-->
                  </div>
                </div>
              </div>
              <i
                class="ti text-xl text-yellow-400 flex-shrink-0 mr-4 transition-transform"
                :class="openFAQs.includes(index) ? 'ti-chevron-up' : 'ti-chevron-down'"
              ></i>
            </button>

            <Transition name="expand">
              <div v-if="openFAQs.includes(index)" class="px-6 pb-6">
                <div class="pt-4 border-t border-yellow-400/10">
                  <div class="prose prose-sm max-w-none">
                    <p class="text-gray-300 leading-relaxed whitespace-pre-line">{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="mt-12 max-w-2xl mx-auto">
        <div class="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 text-black text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-black/20 flex items-center justify-center">
            <i class="ti ti-message-circle text-3xl text-black"></i>
          </div>
          <h3 class="text-2xl font-bold mb-2">سوال شما پاسخ داده نشد؟</h3>
          <p class="text-black/70 mb-6">با تیم پشتیبانی ما در تماس باشید</p>
          <button class="px-8 py-3 bg-black text-yellow-400 rounded-lg font-bold hover:bg-zinc-900 transition-colors">
            تماس با پشتیبانی
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <FooterFilm />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// SEO
useHead({
  title: 'سوالات متداول',
  meta: [
    { name: 'description', content: 'پاسخ به سوالات پرتکرار درباره فیلم‌ها و سریال‌ها' }
  ]
})

const searchQuery = ref('')
const selectedFilter = ref('all')
const openFAQs = ref([])
const loading = ref(true)
const faqs = ref([])

const filterOptions = [
  { value: 'all', label: 'همه', icon: 'ti ti-list' },
  { value: 'movie', label: 'فیلم‌ها', icon: 'ti ti-movie' },
  { value: 'series', label: 'سریال‌ها', icon: 'ti ti-device-tv' },
  { value: 'general', label: 'عمومی', icon: 'ti ti-info-circle' }
]

const filteredFAQs = computed(() => {
  let filtered = faqs.value

  // Filter by type
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(faq => 
      faq.contentType === selectedFilter.value || 
      (selectedFilter.value === 'general' && !faq.contentType)
    )
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      (faq.contentTitle && faq.contentTitle.toLowerCase().includes(query))
    )
  }

  // Only show active FAQs
  filtered = filtered.filter(faq => faq.status === 'active')

  return filtered
})

const toggleFAQ = (index) => {
  const idx = openFAQs.value.indexOf(index)
  if (idx > -1) {
    openFAQs.value.splice(idx, 1)
  } else {
    openFAQs.value.push(index)
  }
}

const getContentTypeIcon = (type) => {
  const icons = {
    movie: 'ti ti-movie',
    series: 'ti ti-device-tv'
  }
  return icons[type] || 'ti ti-question-mark'
}

const getContentTypeLabel = (type) => {
  const labels = {
    movie: 'فیلم',
    series: 'سریال'
  }
  return labels[type] || 'عمومی'
}
const faqStore=useFaqStore()

onMounted(async () => {
  loading.value = true
  try {
    // فرض می‌کنیم fetchFaqs داخل استور قبلا اجرا شده و faqs آماده است
    faqs.value = faqStore.faqs.map(f => ({
      id: f.id,
      contentType: f.contentType,
      contentTitle: f.contentTitle || '',
      question: f.question,
      answer: f.answer,
      status: f.status,
      date: new Date(f.createdAt || f.updatedAt || Date.now()).toLocaleDateString('fa-IR')
    }))
  } catch (e) {
    console.error('Error loading FAQs from store:', e)
  }
  loading.value = false
})

// Load FAQs from localStorage (simulating API call)
/*onMounted(async () => {
  loading.value = true
  console.log('faqs',faqStore.faqs)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Try to load from localStorage
  try {
    const saved = localStorage.getItem('film-faqs')
    if (saved) {
      faqs.value = JSON.parse(saved)
    } else {
      // Default FAQs if none exist
      faqs.value = [
        {
          id: 1,
          contentType: 'general',
          contentTitle: '',
          question: 'چگونه می‌توانم فیلم یا سریال مورد نظرم را پیدا کنم؟',
          answer: 'می‌توانید از نوار جستجوی بالای صفحه استفاده کنید یا از بخش دسته‌بندی‌ها فیلم مورد نظرتان را انتخاب کنید. همچنین می‌توانید فیلم‌ها را بر اساس ژانر، سال تولید و امتیاز فیلتر کنید.',
          status: 'active',
          date: new Date().toLocaleDateString('fa-IR')
        },
        {
          id: 2,
          contentType: 'general',
          contentTitle: '',
          question: 'آیا نیاز به ثبت‌نام دارم؟',
          answer: 'بله، برای تماشای فیلم‌ها و سریال‌ها باید ابتدا ثبت‌نام کنید. ثبت‌نام رایگان است و تنها چند دقیقه زمان می‌برد.',
          status: 'active',
          date: new Date().toLocaleDateString('fa-IR')
        },
        {
          id: 3,
          contentType: 'movie',
          contentTitle: '',
          question: 'چگونه می‌توانم کیفیت ویدیو را تغییر دهم؟',
          answer: 'در حین پخش فیلم، روی آیکون تنظیمات (چرخ دنده) کلیک کنید و کیفیت دلخواه خود را انتخاب کنید. کیفیت‌های 480p تا 4K در دسترس هستند بسته به فیلم.',
          status: 'active',
          date: new Date().toLocaleDateString('fa-IR')
        },
        {
          id: 4,
          contentType: 'series',
          contentTitle: '',
          question: 'چگونه قسمت بعدی سریال را تماشا کنم؟',
          answer: 'پس از پایان هر قسمت، به صورت خودکار قسمت بعدی پخش می‌شود. همچنین می‌توانید از لیست قسمت‌ها در پایین پلیر، قسمت دلخواه را انتخاب کنید.',
          status: 'active',
          date: new Date().toLocaleDateString('fa-IR')
        },
        {
          id: 5,
          contentType: 'general',
          contentTitle: '',
          question: 'آیا می‌توانم فیلم‌ها را دانلود کنم؟',
          answer: 'در حال حاضر امکان دانلود فیلم‌ها وجود ندارد. شما می‌توانید فیلم‌ها را به صورت آنلاین و استریم تماشا کنید.',
          status: 'active',
          date: new Date().toLocaleDateString('fa-IR')
        },
        {
          id: 6,
          contentType: 'general',
          contentTitle: '',
          question: 'آیا می‌توانم نظر بدهم؟',
          answer: 'بله! پس از تماشای هر فیلم یا سریال می‌توانید نظر خود را ثبت کنید و به فیلم امتیاز دهید. نظرات شما به سایر کاربران در انتخاب فیلم کمک می‌کند.',
          status: 'active',
          date: new Date().toLocaleDateString('fa-IR')
        }
      ]
    }
  } catch (e) {
    console.error('Error loading FAQs:', e)
  }

  loading.value = false
})*/
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

.prose p {
  margin: 0;
}
</style>
