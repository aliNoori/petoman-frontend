<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Minimal -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white py-16 sm:py-20 overflow-hidden min-h-[450px] flex items-center">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.05] pointer-events-none">
        <i class="ti ti-file-check absolute top-16 left-24 text-rose-400 text-7xl rotate-12"></i>
        <i class="ti ti-heart absolute top-12 right-20 text-rose-400 text-6xl -rotate-6"></i>
        <i class="ti ti-shield-check absolute bottom-16 left-1/4 text-rose-300 text-6xl rotate-45"></i>
        <i class="ti ti-paw-filled absolute bottom-20 right-1/3 text-rose-400 text-6xl -rotate-12"></i>
        <i class="ti ti-certificate absolute top-1/2 right-16 text-rose-300 text-5xl rotate-6"></i>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-2xl mb-6">
          <i class="ti ti-file-check text-3xl text-rose-600"></i>
        </div>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          شرایط و قوانین عضویت
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          لطفاً قبل از عضویت در جمع حامیان پتومن، این شرایط را با دقت مطالعه کنید
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-6 sm:p-10 lg:p-12">
          <!-- Introduction -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <div class="flex items-start space-x-reverse space-x-4 bg-rose-50 rounded-xl p-5">
              <div class="flex-shrink-0 w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                <i class="ti ti-info-circle text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-2">مقدمه</h3>
                <p class="text-gray-700 leading-relaxed">
                  پتومن یک تشکل داوطلبانه و غیرانتفاعی است که با هدف نجات، درمان و حمایت از حیوانات بی‌سرپناه فعالیت می‌کند. 
                  با عضویت در این مجموعه، شما بخشی از یک خانواده بزرگ می‌شوید که برای رفاه و سلامت حیوانات تلاش می‌کند.
                </p>
              </div>
            </div>
          </div>

          <!-- Terms List -->
          <div class="space-y-8">
            <!-- Section 1 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  1
                </div>
                <h3 class="text-xl font-bold text-gray-900">شرایط عمومی عضویت</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">حداقل سن برای عضویت 18 سال تمام است</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">اطلاعات ارائه شده باید صحیح و معتبر باشد</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">علاقه واقعی به حیوانات و رفاه آن‌ها الزامی است</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">توانایی تعهد به فعالیت‌های داوطلبانه یا حمایت مالی</span>
                </li>
              </ul>
            </div>

            <!-- Section 2 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  2
                </div>
                <h3 class="text-xl font-bold text-gray-900">تعهدات اخلاقی</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">رفتار محترمانه و مهربان با تمام حیوانات</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">احترام به دیگر اعضا و داوطلبان تیم</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">حفظ اسرار و حریم خصوصی حیوانات و اعضا</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">عدم سوءاستفاده از موقعیت عضویت</span>
                </li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  3
                </div>
                <h3 class="text-xl font-bold text-gray-900">مسئولیت‌ها و وظایف</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">مشارکت فعال در فعالیت‌های داوطلبانه (در صورت انتخاب این نوع حمایت)</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">پرداخت کمک‌های مالی به موقع و در چارچوب توافق شده</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">پیروی از دستورالعمل‌های بهداشتی و ایمنی</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">اطلاع‌رسانی به موقع در صورت عدم توانایی انجام تعهدات</span>
                </li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  4
                </div>
                <h3 class="text-xl font-bold text-gray-900">حقوق اعضا</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">دریافت گواهینامه رسمی عضویت حامی پتومن</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">دسترسی به اطلاعات و گزارش‌های فعالیت سازمان</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">امکان نمایش نام در صفحه حامیان (در صورت موافقت)</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">دعوت به رویدادها و برنامه‌های ویژه حامیان</span>
                </li>
              </ul>
            </div>

            <!-- Section 5 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  5
                </div>
                <h3 class="text-xl font-bold text-gray-900">حریم خصوصی و حفاظت از اطلاعات</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">اطلاعات شخصی شما محرمانه خواهد ماند</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">عدم انتشار اطلاعات تماس بدون اجازه</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">امکان درخواست حذف اطلاعات در هر زمان</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">استفاده از اطلاعات فقط برای اهداف سازمانی</span>
                </li>
              </ul>
            </div>

            <!-- Section 6 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  6
                </div>
                <h3 class="text-xl font-bold text-gray-900">قوانین مالی</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">تمام کمک‌های مالی به صورت شفاف ثبت و گزارش می‌شود</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">رسید رسمی برای هر کمک مالی صادر می‌شود</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">کمک‌های مالی غیرقابل برگشت است (مگر در شرایط خاص)</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">گزارش مالی سه‌ماهه برای حامیان ارسال می‌شود</span>
                </li>
              </ul>
            </div>

            <!-- Section 7 -->
            <div>
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm ml-3">
                  7
                </div>
                <h3 class="text-xl font-bold text-gray-900">خروج از عضویت</h3>
              </div>
              <ul class="space-y-3 mr-11">
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">اعضا می‌توانند در هر زمان درخواست خروج دهند</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">تعهدات مالی قبلی باید تسویه شود</span>
                </li>
                <li class="flex items-start">
                  <i class="ti ti-circle-check text-rose-600 text-lg ml-2 mt-0.5 flex-shrink-0"></i>
                  <span class="text-gray-700">گواهینامه عضویت پس از خروج اعتبار خود را از دست می‌دهد</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Footer Note -->
          <div class="mt-10 pt-8 border-t border-gray-200">
            <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6">
              <div class="flex items-start space-x-reverse space-x-4">
                <div class="flex-shrink-0 w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                  <i class="ti ti-alert-circle text-white text-xl"></i>
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 mb-2">توجه مهم</h4>
                  <p class="text-gray-700 leading-relaxed mb-4">
                    با ثبت‌نام و عضویت در پتومن، شما تأیید می‌کنید که تمامی شرایط و قوانین فوق را خوانده و قبول دارید. 
                    این قوانین ممکن است در آینده با اطلاع‌رسانی قبلی به روز شوند.
                  </p>
                  <p class="text-sm text-gray-600">
                    آخرین بروزرسانی: <strong>آبان ۱۴۰۴</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <NuxtLink 
              to="/join-supporters"
              class="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-center py-4 px-6 rounded-xl font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i class="ti ti-check text-lg ml-2"></i>
              موافقم، ثبت‌نام می‌کنم
            </NuxtLink>
            <NuxtLink 
              to="/"
              class="flex-1 bg-white text-gray-700 text-center py-4 px-6 rounded-xl font-semibold border-2 border-gray-300 hover:border-rose-300 hover:text-rose-600 transition-all duration-300"
            >
              <i class="ti ti-home text-lg ml-2"></i>
              بازگشت به خانه
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'شرایط و قوانین عضویت - پتومن | حامیان حیوانات',
  description: 'شرایط و قوانین عضویت در جمع حامیان پتومن. تعهدات، حقوق و مسئولیت‌های اعضا',
  ogTitle: 'شرایط و قوانین عضویت - پتومن',
  ogDescription: 'شرایط و قوانین عضویت در جمع حامیان پتومن'
})
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #e11d48;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #be123c;
}
</style>
