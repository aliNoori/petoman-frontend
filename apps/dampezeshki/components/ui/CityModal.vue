<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-out"
        @click.stop
      >
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">انتخاب شهر</h2>
              <p class="text-sm text-gray-500 mt-1">شهر خود را برای نمایش داروخانه‌های نزدیک انتخاب کنید</p>
            </div>
            <button 
              @click="closeModal"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Search -->
          <div class="relative mt-4">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="جستجو شهر یا استان..."
              class="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            >
            <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-96 p-2">
          <!-- If no search or province not selected, show provinces -->
          <div v-if="!selectedProvince && !searchQuery" class="space-y-1">
            <h3 class="text-sm font-medium text-gray-500 px-4 py-3">انتخاب استان</h3>
            <div 
              v-for="province in iranProvinces" 
              :key="province.name"
              @click="selectProvince(province)"
              class="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg mx-2 transition-colors"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ province.name }}</p>
                  <p class="text-sm text-gray-500">{{ province.cities.length }} شهر</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- If province selected, show cities -->
          <div v-else-if="selectedProvince && !searchQuery" class="space-y-1">
            <div class="flex items-center px-4 py-3 border-b border-gray-100">
              <button 
                @click="backToProvinces"
                class="p-1 hover:bg-gray-100 rounded-full transition-colors ml-3"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h3 class="font-medium text-gray-900">{{ selectedProvince.name }}</h3>
                <p class="text-sm text-gray-500">انتخاب شهر</p>
              </div>
            </div>
            
            <div 
              v-for="city in selectedProvince.cities" 
              :key="city"
              @click="selectCity(city)"
              class="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg mx-2 transition-colors"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-6 0h2m6 0v-3.87a3.37 3.37 0 00-.94-2.61c-.26-.26-.65-.42-1.06-.42h-4c-.41 0-.8.16-1.06.42A3.37 3.37 0 007 17.13V21" />
                  </svg>
                </div>
                <span class="font-medium text-gray-900">{{ city }}</span>
              </div>
              <svg 
                v-if="selectedCity === city"
                class="w-5 h-5 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <!-- Search Results -->
          <div v-else-if="searchQuery" class="space-y-1">
            <h3 class="text-sm font-medium text-gray-500 px-4 py-3">نتایج جستجو</h3>
            <div v-if="searchResults.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p class="text-gray-500">هیچ نتیجه‌ای یافت نشد</p>
              <p class="text-sm text-gray-400 mt-1">عبارت دیگری را امتحان کنید</p>
            </div>
            <div 
              v-for="result in searchResults" 
              :key="`${result.province}-${result.city}`"
              @click="selectCity(result.city)"
              class="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg mx-2 transition-colors"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-6 0h2m6 0v-3.87a3.37 3.37 0 00-.94-2.61c-.26-.26-.65-.42-1.06-.42h-4c-.41 0-.8.16-1.06.42A3.37 3.37 0 007 17.13V21" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ result.city }}</p>
                  <p class="text-sm text-gray-500">{{ result.province }}</p>
                </div>
              </div>
              <svg 
                v-if="selectedCity === result.city"
                class="w-5 h-5 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  selectedCity: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'select'])

const searchQuery = ref('')
const selectedProvince = ref(null)

// Complete Iranian provinces and cities
const iranProvinces = ref([
  {
    name: 'تهران',
    cities: ['تهران', 'ری', 'شمیرانات', 'دماوند', 'فیروزکوه', 'اسلامشهر', 'ورامین', 'پاکدشت', 'قدس', 'ملارد', 'شهریار', 'رباط‌کریم', 'بهارستان']
  },
  {
    name: 'اصفهان',
    cities: ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'فلاورجان', 'شاهین‌شهر', 'مبارکه', 'خوانسار', 'گلپایگان', 'دهاقان', 'تیران', 'اردستان', 'نائین']
  },
  {
    name: 'فارس',
    cities: ['شیراز', 'کازرون', 'مرودشت', 'فسا', 'لار', 'جهرم', 'داراب', 'فیروزآباد', 'آباده', 'اقلید', 'سپیدان', 'ممسنی', 'لامرد']
  },
  {
    name: 'خراسان رضوی',
    cities: ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'قوچان', 'کاشمر', 'گناباد', 'تربت جام', 'خواف', 'تایباد', 'فردوس', 'بردسکن', 'درگز']
  },
  {
    name: 'آذربایجان شرقی',
    cities: ['تبریز', 'مراغه', 'میانه', 'شبستر', 'بناب', 'اهر', 'مرند', 'ملکان', 'سراب', 'هریس', 'ورزقان', 'آذرشهر', 'جلفا']
  },
  {
    name: 'آذربایجان غربی',
    cities: ['ارومیه', 'خوی', 'مهاباد', 'بوکان', 'میاندوآب', 'سلماس', 'نقده', 'سردشت', 'پیرانشهر', 'چالدران', 'شاهین‌دژ', 'تکاب', 'مکو']
  },
  {
    name: 'گیلان',
    cities: ['رشت', 'انزلی', 'لاهیجان', 'لنگرود', 'رودسر', 'آستارا', 'تالش', 'صومعه‌سرا', 'فومن', 'شفت', 'رودبار', 'ماسال', 'املش']
  },
  {
    name: 'مازندران',
    cities: ['ساری', 'بابل', 'آمل', 'قائمشهر', 'بابلسر', 'نوشهر', 'چالوس', 'تنکابن', 'رامسر', 'محمودآباد', 'فریدونکنار', 'گلوگاه', 'جویبار']
  },
  {
    name: 'اردبیل',
    cities: ['اردبیل', 'پارس‌آباد', 'خلخال', 'مشگین‌شهر', 'گرمی', 'نمین', 'نیر', 'کوثر', 'بیله‌سوار', 'سرعین', 'اصلاندوز', 'رضی', 'کلور']
  },
  {
    name: 'البرز',
    cities: ['کرج', 'نظرآباد', 'هشتگرد', 'ساوجبلاغ', 'طالقان', 'فردیس', 'محمدشهر', 'مهرشهر', 'اشتهارد', 'تنکمان', 'چهارباغ', 'کوهسار', 'گلشهر']
  },
  {
    name: 'خوزستان',
    cities: ['اهواز', 'آبادان', 'خرمشهر', 'دزفول', 'اندیمشک', 'مسجدسلیمان', 'شوشتر', 'بهبهان', 'ایذه', 'لالی', 'باغ‌ملک', 'شوش', 'هویزه']
  },
  {
    name: 'کرمان',
    cities: ['کرمان', 'رفسنجان', 'جیرفت', 'بم', 'سیرجان', 'شهربابک', 'کهنوج', 'بردسیر', 'زرند', 'راور', 'انار', 'ریگان', 'عنبرآباد']
  },
  {
    name: 'قم',
    cities: ['قم', 'سلفچگان', 'جعفریه', 'کهک', 'دستجرد', 'قنوات', 'آبگرم']
  },
  {
    name: 'مرکزی',
    cities: ['اراک', 'ساوه', 'خمین', 'محلات', 'شازند', 'تفرش', 'دلیجان', 'آشتیان', 'زرندیه', 'کمیجان', 'خنداب', 'نراق', 'فراهان']
  },
  {
    name: 'هرمزگان',
    cities: ['بندرعباس', 'کیش', 'قشم', 'بندر لنگه', 'میناب', 'بستک', 'جاسک', 'پارسیان', 'رودان', 'حاجی‌آباد', 'سیریک', 'دهبارز', 'قشم']
  },
  {
    name: 'یزد',
    cities: ['یزد', 'میبد', 'اردکان', 'بافق', 'تفت', 'ابرکوه', 'خاتم', 'مهریز', 'اشکذر', 'زارچ', 'هرات', 'ندوشن', 'مروست']
  },
  {
    name: 'همدان',
    cities: ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'کبودرآهنگ', 'اسدآباد', 'بهار', 'رزن', 'قهاوند', 'فامنین', 'لالجین', 'سامن', 'جوکار']
  },
  {
    name: 'کردستان',
    cities: ['سنندج', 'مریوان', 'بانه', 'سقز', 'قروه', 'بیجار', 'کامیاران', 'دیواندره', 'دهگلان', 'سروآباد', 'اورامان', 'شویشه', 'چناره']
  },
  {
    name: 'لرستان',
    cities: ['خرم‌آباد', 'بروجرد', 'دورود', 'کوهدشت', 'الیگودرز', 'ازنا', 'نورآباد', 'پل‌دختر', 'دلفان', 'سلسله', 'چگنی', 'اشترینان', 'فیروزآباد']
  },
  {
    name: 'کرمانشاه',
    cities: ['کرمانشاه', 'اسلام‌آباد غرب', 'پاوه', 'جوانرود', 'سنقر', 'صحنه', 'هرسین', 'کنگاور', 'گیلان غرب', 'قصرشیرین', 'سرپل ذهاب', 'روانسر', 'داشت']
  },
  {
    name: 'بوشهر',
    cities: ['بوشهر', 'برازجان', 'گناوه', 'دشتستان', 'جم', 'کنگان', 'خارک', 'دیلم', 'دشتی', 'عسلویه', 'کاکی', 'آبپخش', 'امام حسن']
  },
  {
    name: 'زنجان',
    cities: ['زنجان', 'ابهر', 'خدابنده', 'خرمدره', 'طارم', 'ماهنشان', 'قیدار', 'سلطانیه', 'آب‌بر', 'سهرورد', 'هیدج', 'چورزق', 'گرماب']
  },
  {
    name: 'سمنان',
    cities: ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدی‌شهر', 'میامی', 'سرخه', 'آرادان', 'بسطام', 'دیباج', 'کلاته', 'کهن', 'لاسجرد']
  },
  {
    name: 'سیستان و بلوچستان',
    cities: ['زاهدان', 'چابهار', 'زابل', 'ایرانشهر', 'خاش', 'سراوان', 'کنارک', 'نیک‌شهر', 'سرباز', 'بمپور', 'قصرقند', 'هیرمند', 'دلگان']
  },
  {
    name: 'گلستان',
    cities: ['گرگان', 'گنبد کاووس', 'آق‌قلا', 'بندر گز', 'کردکوی', 'کلاله', 'مینودشت', 'آزادشهر', 'علی‌آباد', 'مراوه', 'رامیان', 'اینچه برون', 'فاضل‌آباد']
  },
  {
    name: 'چهارمحال و بختیاری',
    cities: ['شهرکرد', 'بروجن', 'فارسان', 'لردگان', 'اردل', 'کوهرنگ', 'کیان', 'سامان', 'گندمان', 'نافچ', 'چلگرد', 'بلداجی', 'سودجان']
  },
  {
    name: 'کهگیلویه و بویراحمد',
    cities: ['یاسوج', 'دوگنبدان', 'سی‌سخت', 'گچساران', 'دهدشت', 'لیکک', 'چرام', 'باشت', 'لنده', 'مارگون', 'پاتاوه', 'قلعه رئیسی', 'دیشموک']
  },
  {
    name: 'خراسان شمالی',
    cities: ['بجنورد', 'شیروان', 'اسفراین', 'فاروج', 'جاجرم', 'گرمه', 'آشخانه', 'راز', 'درق', 'صفی‌آباد', 'تیتکانلو', 'پیش‌قلعه', 'ایور']
  },
  {
    name: 'خراسان جنوبی',
    cities: ['بیرجند', 'قاین', 'فردوس', 'نهبندان', 'طبس', 'سرایان', 'درمیان', 'سربیشه', 'خوسف', 'بشرویه', 'آرین‌شهر', 'مود', 'زهان']
  },
  {
    name: 'ایلام',
    cities: ['ایلام', 'دهلران', 'مهران', 'آبدانان', 'دره‌شهر', 'ایوان', 'ملکشاهی', 'شیروان چرداول', 'هلیلان', 'سراب', 'بدره', 'موسیان', 'چوار']
  }
])

// Search functionality
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  const results = []
  
  iranProvinces.value.forEach(province => {
    // Search in province name
    if (province.name.toLowerCase().includes(query)) {
      province.cities.forEach(city => {
        results.push({ province: province.name, city })
      })
    } else {
      // Search in cities
      province.cities.forEach(city => {
        if (city.toLowerCase().includes(query)) {
          results.push({ province: province.name, city })
        }
      })
    }
  })
  
  return results.slice(0, 20) // Limit results
})

// Methods
const closeModal = () => {
  emit('close')
  // Reset state
  selectedProvince.value = null
  searchQuery.value = ''
}

const selectProvince = (province) => {
  selectedProvince.value = province
}

const backToProvinces = () => {
  selectedProvince.value = null
}

const selectCity = (city) => {
  emit('select', city)
  closeModal()
}

// Watch for modal open/close to manage body scroll
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
    selectedProvince.value = null
    searchQuery.value = ''
  }
})
</script>