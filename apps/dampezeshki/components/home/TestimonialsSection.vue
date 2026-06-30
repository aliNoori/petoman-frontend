<template>
  <section class="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4 font-vazir">
          نظرات مشتریان
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto font-vazir">
          تجربه واقعی مشتریان ما از خدمات پتومن
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Testimonial 1 -->
        <TestimonialCard
          name="مریم احمدی"
          role="صاحب سگ پرشین"
          avatar="👩‍💼"
          rating="5"
          text="واقعاً فوق‌العاده بود! دامپزشک خیلی مهربان و حرفه‌ای بود. سگم رو خیلی سریع درمان کرد و حالش خوب شد."
        />

        <!-- Testimonial 2 -->
        <TestimonialCard
          name="احمد رضایی"
          role="صاحب گربه پرشین"
          avatar="👨‍💻"
          rating="5"
          text="مشاوره آنلاین عالی بود. خیلی سریع جواب دادن و راهنمایی‌هاشون دقیق بود. حتماً دوباره استفاده می‌کنم."
        />

        <!-- Testimonial 3 -->
        <TestimonialCard
          name="فاطمه موسوی"
          role="صاحب پرنده"
          avatar="👩‍🔬"
          rating="5"
          text="ویزیت در منزل خیلی راحت بود. پرنده‌ام استرس نگرفت و تو محیط آشناش درمان شد. عالی بود!"
        />

        <!-- Testimonial 4 -->
        <TestimonialCard
          name="محمد کریمی"
          role="صاحب سگ ژرمن"
          avatar="👨‍🏫"
          rating="4"
          text="سرویس اورژانسی‌تون فوق‌العاده است. شب دیر سگم مشکل پیدا کرد، خیلی سریع کمکم کردین."
        />

        <!-- Testimonial 5 -->
        <TestimonialCard
          name="زهرا صادقی"
          role="صاحب گربه نارنجی"
          avatar="👩‍⚕️"
          rating="5"
          text="تیم حرفه‌ای و باتجربه. گربه‌ام بعد از درمان کاملاً خوب شد. قیمت‌ها هم خیلی منصفانه بود."
        />

        <!-- Testimonial 6 -->
        <TestimonialCard
          name="علی حسینی"
          role="صاحب خرگوش"
          avatar="👨‍🔬"
          rating="5"
          text="واقعاً ممنونم از تیم پتومن. خرگوشم مشکل گوارشی داشت، خیلی سریع و موثر درمانش کردن."
        />
      </div>

      <!-- Trust Indicators -->
      <div class="mt-16 text-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="flex flex-col items-center">
            <div class="text-2xl mb-2">⭐</div>
            <div class="text-2xl font-bold text-gray-900 font-vazir">۴.۹</div>
            <div class="text-sm text-gray-600 font-vazir">امتیاز کلی</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-2xl mb-2">👥</div>
            <div class="text-2xl font-bold text-gray-900 font-vazir">۵۰,۰۰۰+</div>
            <div class="text-sm text-gray-600 font-vazir">مشتری راضی</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-2xl mb-2">🏆</div>
            <div class="text-2xl font-bold text-gray-900 font-vazir">۹۸%</div>
            <div class="text-sm text-gray-600 font-vazir">رضایت</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-2xl mb-2">🔄</div>
            <div class="text-2xl font-bold text-gray-900 font-vazir">۹۵%</div>
            <div class="text-sm text-gray-600 font-vazir">بازگشت مشتری</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No additional logic needed for now
</script>
