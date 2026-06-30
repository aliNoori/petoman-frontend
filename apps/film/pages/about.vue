<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
    <HeaderFilm />
    
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-6">
          درباره  ofilm
        </h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          پلتفرم تخصصی پخش مستندات و فیلم‌های آموزشی حیوانات و طبیعت
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="pb-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20 mb-12">
          <h2 class="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
            <svg class="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            مأموریت ما
          </h2>
          <p class="text-gray-300 text-lg leading-relaxed mb-6">
            هدف ما آشنایی بیشتر انسان‌ها با دنیای شگفت‌انگیز حیوانات و طبیعت است. از طریق ارائه مستندات باکیفیت، می‌خواهیم به حفظ محیط زیست و آگاهی‌بخشی درباره اهمیت طبیعت کمک کنیم.
          </p>
          <p class="text-gray-300 text-lg leading-relaxed">
            محتوای ما شامل مستندات علمی، فیلم‌های آموزشی نجات حیوانات، و بررسی رفتار گونه‌های مختلف حیوانی است که همگی با کیفیت HD و 4K قابل دسترسی هستند.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div class="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">محتوای باکیفیت</h3>
            <p class="text-gray-400">مستندات HD و 4K با زیرنویس فارسی</p>
          </div>

          <div class="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">آموزش تخصصی</h3>
            <p class="text-gray-400">محتوای علمی و آموزشی برای تمام سنین</p>
          </div>

          <div class="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">رایگان و آزاد</h3>
            <p class="text-gray-400">دسترسی کامل به تمام محتوا بدون هزینه</p>
          </div>

          <div class="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">به‌روزرسانی مداوم</h3>
            <p class="text-gray-400">اضافه شدن محتوای جدید به صورت منظم</p>
          </div>
        </div>
      </div>
    </section>

    <FooterFilm />
  </div>
</template>

<script setup>
// Page Meta
const title = 'درباره ما - پتو فیلم'
const description = 'آشنایی با پلتفرم تخصصی فیلم و مستندات حیوانات پتو فیلم - ارائه دهنده بهترین محتوای آموزشی طبیعت'

// Set page title and meta
if (typeof document !== 'undefined') {
  document.title = title
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = description
}
</script>
