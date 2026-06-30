<template>
  <section class="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="text-center lg:text-right">
          <h1 class="text-4xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            مراقبت از حیوان خانگی‌تان
            <span class="text-primary">آسان‌تر از همیشه</span>
          </h1>
          
          <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
            دامپزشکان متخصص، مشاوره آنلاین و تلفنی، ویزیت در منزل و کلینیک‌های مجهز در خدمت حیوان خانگی شما
          </p>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              class="px-8 py-4"
              @click="$router.push('/consult')"
            >
              مشاوره آنلاین
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.906A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              class="px-8 py-4"
              @click="openEmergencyConsult"
            >
              مشاوره فوری
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </div>
          
          <!-- Stats -->
          <div class="flex flex-wrap gap-8 justify-center lg:justify-start mt-12">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary mb-1">500+</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400">دامپزشک</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary mb-1">1200+</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400">مشاوره موفق</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary mb-1">24/7</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400">پاسخگویی</div>
            </div>
          </div>
        </div>
        
        <!-- Image -->
        <div class="relative">
          <div class="relative z-10 bg-white rounded-2xl p-8 shadow-2xl">
            <!-- Hero Image Placeholder -->
            <div class="w-full h-64 bg-gradient-to-br from-sky-100 to-blue-200 rounded-xl flex items-center justify-center">
              <div class="text-center">
                <svg class="w-20 h-20 mx-auto text-sky-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p class="text-sky-700 font-medium">مراقبت از حیوانات خانگی</p>
              </div>
            </div>
          </div>
          
          <!-- Floating cards -->
          <div class="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium">دامپزشکان آنلاین</span>
            </div>
          </div>
          
          <div class="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
            <div class="flex items-center space-x-3 space-x-reverse">
              <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium">پاسخ سریع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const router = useRouter()

const openEmergencyConsult = () => {
  router.push('/consult?urgent=true')
}
</script>
