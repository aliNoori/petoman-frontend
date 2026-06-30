<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">سوالات متداول فروشندگان</h1>
          <p class="text-purple-100">پاسخ به سوالات رایج درباره پنل فروشندگان پتومن</p>
        </div>
        <div class="hidden md:block">
          <div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i class="ti ti-help text-5xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Box -->
    <div class="bg-white rounded-xl p-6">
      <div class="relative">
        <i class="ti ti-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو در سوالات متداول..."
          class="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
      </div>
    </div>

    <!-- FAQ Categories -->
    <div class="grid md:grid-cols-4 gap-4">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="p-4 rounded-xl text-right transition-all"
        :class="selectedCategory === cat.id 
          ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' 
          : 'bg-white hover:bg-gray-50'"
      >
        <i :class="cat.icon" class="text-2xl mb-2 block"></i>
        <h3 class="font-bold text-sm">{{ cat.label }}</h3>
        <p class="text-xs mt-1" :class="selectedCategory === cat.id ? 'text-purple-100' : 'text-gray-500'">
          {{ cat.count }} سوال
        </p>
      </button>
    </div>

    <!-- FAQ Items -->
    <div class="space-y-4">
      <div
        v-for="(faq, index) in filteredFAQs"
        :key="index"
        class="bg-white rounded-xl overflow-hidden"
      >
        <button
          @click="toggleFAQ(index)"
          class="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start gap-4 flex-1">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="expandedFAQs.includes(index) ? 'bg-purple-100' : 'bg-gray-100'"
            >
              <i
                :class="expandedFAQs.includes(index) ? 'ti ti-question-mark text-purple-600' : 'ti ti-question-mark text-gray-600'"
                class="text-xl"
              ></i>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 text-base">{{ faq.question }}</h3>
            </div>
          </div>
          <i
            class="ti ti-chevron-down text-gray-400 transition-transform flex-shrink-0 mr-4"
            :class="expandedFAQs.includes(index) ? 'rotate-180' : ''"
          ></i>
        </button>

        <Transition name="slide-down">
          <div v-if="expandedFAQs.includes(index)" class="px-6 pb-6">
            <div class="pr-14 text-gray-600 leading-relaxed">
              <p>{{ faq.answer }}</p>
              <div v-if="faq.note" class="mt-4 p-4 bg-purple-50 rounded-lg border-r-4 border-purple-500">
                <p class="text-sm text-purple-900">
                  <i class="ti ti-info-circle ml-1"></i>
                  <strong>نکته:</strong> {{ faq.note }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Still Have Questions? -->
    <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
        <i class="ti ti-message-circle text-3xl text-white"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">سوال دیگری دارید؟</h3>
      <p class="text-gray-600 mb-6">تیم پشتیبانی ما آماده پاسخگویی به شماست</p>
      <router-link
        to="/pharmacies/support"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all"
      >
        <i class="ti ti-headset"></i>
        ارسال تیکت پشتیبانی
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const searchQuery = ref('')
const selectedCategory = ref('all')
const expandedFAQs = ref([])

const categories = [
  { id: 'all', label: 'همه دسته‌ها', icon: 'ti ti-layout-grid', count: 15 },
  { id: 'orders', label: 'سفارشات', icon: 'ti ti-shopping-cart', count: 5 },
  { id: 'products', label: 'محصولات', icon: 'ti ti-package', count: 4 },
  { id: 'financial', label: 'مالی', icon: 'ti ti-wallet', count: 3 },
  { id: 'technical', label: 'فنی', icon: 'ti ti-settings', count: 3 }
]

const faqs = [
  {
    category: 'orders',
    question: 'چگونه سفارشات دارویی را تایید کنم؟',
    answer: 'برای تایید سفارشات دارویی، به بخش "سفارشات > سفارشات دارو" بروید. سفارشاتی که دارای نسخه هستند نیاز به تایید شما دارند. بعد از بررسی نسخه، می‌توانید سفارش را تایید یا رد کنید. سفارشات بدون نسخه به صورت خودکار پردازش می‌شوند.',
    note: 'بررسی دقیق نسخه‌های پزشکی الزامی است و مسئولیت تایید نسخه بر عهده داروخانه است.'
  },
  {
    category: 'orders',
    question: 'چرا برخی سفارشات نیاز به تایید ندارند؟',
    answer: 'سفارشاتی که شامل داروهای بدون نسخه (OTC) یا محصولات بهداشتی هستند، نیاز به تایید ندارند و به صورت خودکار به فرآیند ارسال می‌روند. فقط سفارشات حاوی داروهای تجویزی که نیاز به نسخه دارند باید توسط شما تایید شوند.'
  },
  {
    category: 'orders',
    question: 'زمان پردازش سفارشات چقدر است؟',
    answer: 'توصیه می‌شود سفارشات را حداکثر تا 24 ساعت پس از ثبت، بررسی و تایید کنید. این موضوع در رضایت مشتریان و رتبه‌بندی داروخانه شما تاثیر مستقیم دارد. سفارشات فوری باید در کمتر از 4 ساعت پردازش شوند.',
    note: 'تاخیر در پردازش سفارشات می‌تواند منجر به کاهش امتیاز داروخانه شود.'
  },
  {
    category: 'orders',
    question: 'نحوه لغو یا مرجوعی سفارشات چگونه است؟',
    answer: 'مشتری تا قبل از تایید سفارش توسط شما می‌تواند آن را لغو کند. پس از ارسال، در صورت درخواست مرجوعی توسط مشتری، باید دلیل را بررسی کرده و در صورت تایید، مرجوعی را انجام دهید. مبلغ سفارش طبق قوانین پلتفرم به مشتری برگردانده می‌شود.',
    note: 'نرخ لغو و مرجوعی بالا می‌تواند روی رتبه داروخانه تاثیر منفی بگذارد.'
  },
  {
    category: 'orders',
    question: 'چگونه می‌توانم کد رهگیری ارسال را ثبت کنم؟',
    answer: 'پس از تایید و آماده‌سازی سفارش، در بخش جزئیات سفارش می‌توانید کد رهگیری مرسوله پستی را ثبت کنید. این کد به مشتری نمایش داده می‌شود و امکان پیگیری مرسوله را فراهم می‌کند.'
  },
  {
    category: 'products',
    question: 'چگونه محصول جدید اضافه کنم؟',
    answer: 'به بخش "محصولات" بروید و روی دکمه "افزودن محصول" کلیک کنید. اطلاعات کامل محصول شامل نام، دسته‌بندی، قیمت، موجودی، تصاویر و توضیحات را وارد کنید. محصولات دارویی نیاز به کد IRC و اطلاعات تکمیلی دارند.',
    note: 'محصولات شما پس از تایید مدیریت پتومن در فروشگاه نمایش داده می‌شوند.'
  },
  {
    category: 'products',
    question: 'چرا محصول من تایید نمی‌شود؟',
    answer: 'دلایل احتمالی: 1) اطلاعات ناقص یا نادرست 2) تصاویر با کیفیت پایین 3) قیمت غیرمنطبق با بازار 4) عدم ارائه مجوزهای لازم برای داروهای تجویزی. پیام رد محصول را در بخش محصولات بررسی کنید و اصلاحات لازم را انجام دهید.'
  },
  {
    category: 'products',
    question: 'نحوه مدیریت موجودی محصولات چگونه است؟',
    answer: 'در بخش محصولات، می‌توانید موجودی هر محصول را مشاهده و ویرایش کنید. سیستم به صورت خودکار با هر فروش، موجودی را کم می‌کند. توصیه می‌شود موجودی را به روز نگه دارید تا از سفارشات بدون موجودی جلوگیری شود.',
    note: 'هشدار موجودی کم برای محصولاتی که به کمتر از 10 عدد رسیده‌اند نمایش داده می‌شود.'
  },
  {
    category: 'products',
    question: 'آیا می‌توانم تخفیف روی محصولات بگذارم؟',
    answer: 'بله، می‌توانید برای هر محصول درصد تخفیف تعیین کنید. تخفیف‌ها می‌توانند محدود به زمان خاصی باشند یا دائمی. همچنین می‌توانید در کمپین‌های تخفیف پتومن شرکت کنید.'
  },
  {
    category: 'financial',
    question: 'زمان واریز درآمد چه موقع است؟',
    answer: 'تسویه حساب به صورت هفتگی انجام می‌شود. درآمد سفارشات تحویل شده تا پایان هفته، در هفته بعد به حساب شما واریز می‌گردد. می‌توانید جزئیات تراکنش‌ها را در بخش "امور مالی" مشاهده کنید.',
    note: 'برای واریز وجه، لطفا اطلاعات بانکی خود را در تنظیمات تکمیل کنید.'
  },
  {
    category: 'financial',
    question: 'کارمزد پلتفرم چقدر است؟',
    answer: 'کارمزد پلتفرم پتومن بین 8 تا 12 درصد متغیر است که بسته به حجم فروش، نوع محصول و رتبه داروخانه محاسبه می‌شود. داروخانه‌های با عملکرد بهتر از کارمزد کمتری بهره‌مند می‌شوند.'
  },
  {
    category: 'financial',
    question: 'چگونه صورتحساب دریافت کنم؟',
    answer: 'در بخش "امور مالی > صورتحساب‌ها" می‌توانید صورتحساب هر دوره تسویه را مشاهده و دانلود کنید. صورتحساب‌ها شامل جزئیات کامل فروش، کارمزد و مبلغ قابل پرداخت هستند.'
  },
  {
    category: 'technical',
    question: 'چگونه رمز عبور خود را تغییر دهم؟',
    answer: 'به بخش "تنظیمات > امنیت" بروید و گزینه "تغییر رمز عبور" را انتخاب کنید. رمز عبور فعلی، رمز جدید و تکرار آن را وارد کنید. توصیه می‌شود از رمز عبور قوی استفاده کنید.'
  },
  {
    category: 'technical',
    question: 'آیا می‌توانم چند کاربر برای پنل تعریف کنم؟',
    answer: 'بله، در بخش "تنظیمات > کاربران" می‌توانید کاربران جدید با سطوح دسترسی مختلف (مدیر، اپراتور، انباردار) تعریف کنید. هر کاربر با نام کاربری و رمز عبور خود وارد پنل می‌شود.',
    note: 'دسترسی کاربران را بر اساس وظایف آن‌ها محدود کنید.'
  },
  {
    category: 'technical',
    question: 'مشکل فنی دارم، چه کنم؟',
    answer: 'در صورت بروز مشکل فنی: 1) صفحه را رفرش کنید 2) کش مرورگر را پاک کنید 3) از آخرین نسخه مرورگر استفاده کنید. اگر مشکل حل نشد، از طریق بخش "پشتیبانی" تیکت فنی ارسال کنید یا با شماره پشتیبانی تماس بگیرید.'
  }
]

const filteredFAQs = computed(() => {
  let filtered = faqs

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value)
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

const toggleFAQ = (index) => {
  const globalIndex = faqs.indexOf(filteredFAQs.value[index])
  if (expandedFAQs.value.includes(globalIndex)) {
    expandedFAQs.value = expandedFAQs.value.filter(i => i !== globalIndex)
  } else {
    expandedFAQs.value.push(globalIndex)
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
