<template>
  <div v-if="nextEvent" class="min-h-screen bg-gray-50">
    <!-- Hero Section - Clean and Minimal -->
    <section class="relative bg-gradient-to-b from-rose-50 to-white overflow-hidden min-h-[400px] sm:min-h-[650px] lg:min-h-[700px] flex items-center">
      <!-- Decorative Pattern Icons -->
      <div class="absolute inset-0 overflow-hidden opacity-[0.07] pointer-events-none">
        <i class="ti ti-heart-filled absolute top-20 left-10 text-rose-400 text-6xl rotate-12"></i>
        <i class="ti ti-paw-filled absolute top-40 right-20 text-rose-400 text-7xl -rotate-6"></i>
        <i class="ti ti-heart absolute top-60 left-1/4 text-rose-300 text-5xl rotate-45"></i>
        <i class="ti ti-bone absolute bottom-40 right-1/3 text-rose-400 text-6xl -rotate-12"></i>
        <i class="ti ti-dog absolute top-32 right-1/2 text-rose-300 text-8xl rotate-6"></i>
        <i class="ti ti-cat absolute bottom-32 left-1/3 text-rose-400 text-7xl -rotate-12"></i>
        <i class="ti ti-heart-filled absolute bottom-20 right-10 text-rose-300 text-5xl rotate-0"></i>
        <i class="ti ti-paw absolute top-10 right-1/4 text-rose-400 text-6xl rotate-12"></i>
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24 z-10 w-full">
        <div class="text-center">
          <!-- Hero Title -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-rose-900 mb-6 leading-tight">
            حامیان حیوانات بی‌سرپناه
          </h1>


          <p class="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            هر کمک کوچکی می‌تواند زندگی یک حیوان را تغییر دهد
          </p>
        </div>
      </div>
    </section>

    <!-- Kindness Event Section -->
    <section class="py-12 lg:py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Event Card Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Right Side - Image & Timer/Progress -->
          <div class="order-2 lg:order-1">
            <!-- Event Image -->
            <div class="relative rounded-xl overflow-hidden mb-4">
              <div class="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                <div class="text-center">
                  <template v-if="nextEvent">
                  <img :src="nextEvent.image" :alt="nextEvent.title" class="w-full h-full object-cover" />
                  </template>
                  <template v-else>
                  <i class="ti ti-paw text-gray-400 text-7xl opacity-50"></i>
                  </template>
                  <div class="absolute bottom-4 right-4 left-4">
                    <div class="flex items-center space-x-reverse space-x-2 text-gray-700 text-sm">
                      <i class="ti ti-map-pin"></i>
                      <span class="font-medium">{{ nextEvent.location }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Countdown Timer (فقط برای قرار دورهمی) -->
            <div v-if="nextEvent.type === 'volunteer'" class="bg-white rounded-xl p-3 border border-gray-200">
              <div class="text-center mb-2">
                <div class="text-gray-700 text-xs font-medium">زمان باقی‌مانده تا شروع</div>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                  <div class="text-xl font-bold text-gray-800">{{ countdown.days }}</div>
                  <div class="text-xs text-gray-600 mt-0.5">روز</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                  <div class="text-xl font-bold text-gray-800">{{ countdown.hours }}</div>
                  <div class="text-xs text-gray-600 mt-0.5">ساعت</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                  <div class="text-xl font-bold text-gray-800">{{ countdown.minutes }}</div>
                  <div class="text-xs text-gray-600 mt-0.5">دقیقه</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-200">
                  <div class="text-xl font-bold text-gray-800">{{ countdown.seconds }}</div>
                  <div class="text-xs text-gray-600 mt-0.5">ثانیه</div>
                </div>
              </div>
            </div>

            <!-- Progress Bar (فقط برای قرار مالی) -->
            <div v-else-if="nextEvent.type === 'financial'" class="bg-white rounded-xl p-4 border border-gray-200">
              <!-- Progress Stats -->
              <div class="space-y-3 mb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xs text-gray-500 mb-1">مبلغ جمع‌آوری شده</div>
                    <div class="text-lg font-bold text-rose-600">
                      {{ formatCurrency(nextEvent.current) }}
                      <span class="text-sm text-gray-500 font-normal">تومان</span>
                    </div>
                  </div>
                  <div class="text-left">
                    <div class="text-xs text-gray-500 mb-1">هدف</div>
                    <div class="text-lg font-bold text-gray-700">
                      {{ formatCurrency(nextEvent.goal) }}
                      <span class="text-sm text-gray-500 font-normal">تومان</span>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="relative">
                  <div class="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      class="bg-gradient-to-r from-rose-500 to-rose-600 h-3 rounded-full transition-all duration-500"
                      :style="{ width: progress + '%' }"
                    ></div>
                  </div>
                  <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {{ progress }}%
                  </div>
                </div>

                <!-- Supporters Count -->
                <div class="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <i class="ti ti-users text-rose-600"></i>
                  <span class="font-medium">{{ nextEvent.supporters }}</span>
                  <span>نفر حامی</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Left Side - Event Details -->
          <div class="order-1 lg:order-2">
            <div class="top-0">
              <!-- Badge -->
              <div class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                :class="nextEvent.type === 'financial' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'">
                <i :class="nextEvent.type === 'financial' ? 'ti ti-coin text-green-600' : 'ti ti-calendar-heart text-rose-600'" class="ml-2 text-sm"></i>
                {{ nextEvent.type === 'financial' ? 'قرار مالی' : 'قرار دورهمی' }}
              </div>

              <!-- Event Title & Description -->
              <div class="mb-5">
                <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {{ nextEvent.title }}
                </h3>
                <p class="text-base text-gray-600 leading-relaxed">
                  {{ nextEvent.description }}
                </p>
              </div>

              <!-- Event Details Cards -->
              <div class="space-y-2 mb-5">
                <div class="flex items-center space-x-reverse space-x-3 bg-gray-50 rounded-lg p-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <i class="ti ti-calendar text-rose-600"></i>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">{{ nextEvent.type === 'financial' ? 'مهلت' : 'تاریخ برگزاری' }}</div>
                    <div class="font-semibold text-gray-900 text-sm">{{ formatDateToJalali(nextEvent.date) }}</div>
                  </div>
                </div>

                <div v-if="nextEvent.type === 'volunteer'" class="flex items-center space-x-reverse space-x-3 bg-gray-50 rounded-lg p-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="ti ti-clock text-blue-600"></i>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">ساعت شروع</div>
                    <div class="font-semibold text-gray-900 text-sm">{{ nextEvent.time }}</div>
                  </div>
                </div>

              </div>

              <!-- CTA Buttons -->
              <div class="grid grid-cols-2 gap-4">
                <NuxtLink 
                  :to="`/kindness-events/${nextEvent.id}`"
                  class="block w-full text-center bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold py-3 px-5 rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i :class="nextEvent.type === 'financial' ? 'ti ti-coin' : 'ti ti-user-plus'" class="ml-2"></i>
                  {{ nextEvent.type === 'financial' ? 'حمایت مالی' : 'ثبت‌نام در این قرار' }}
                </NuxtLink>
                <NuxtLink 
                  to="/kindness-events"
                  class="block w-full text-center bg-white text-rose-600 font-semibold py-3 px-5 rounded-lg border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300"
                >
                  مشاهده همه قرارها
                  <i class="ti ti-arrow-left mr-2"></i>
                </NuxtLink>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section - Simplified for Mobile -->
    <section class="py-10 sm:py-16 lg:py-20 bg-white relative">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          <!-- Text Content -->
          <div class="order-2 lg:order-1">
            <div class="space-y-4 sm:space-y-6">
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">ما کی هستیم؟</h2>
              
              <div class="text-gray-600 leading-relaxed space-y-3 sm:space-y-4">
                <p class="text-sm sm:text-base lg:text-lg">
                  <strong class="text-gray-900">پتومن</strong> یک تشکل داوطلبانه است که با هدف نجات، درمان و حمایت از حیوانات بی‌سرپناه تأسیس شده است.
                </p>
                <p class="text-sm sm:text-base lg:text-lg hidden sm:block">
                  تیم ما شامل دامپزشکان، داوطلبان و عاشقان حیوانات است که شبانه‌روز برای بهبود وضعیت حیوانات آسیب‌دیده تلاش می‌کنند.
                </p>
              </div>
            </div>
          </div>

          <!-- Video Content - Compact on Mobile -->
          <div class="order-1 lg:order-2">
            <div class="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900">
              <video
                ref="aboutVideoRef"
                class="w-full aspect-video object-cover"
                :poster="aboutVideo.poster"
                preload="metadata"
                controls
              >
                <source :src="aboutVideo.src" type="video/mp4">
                <p class="text-white p-8 text-center">
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </p>
              </video>
              
              <!-- Custom Play Button Overlay -->
              <div 
                v-if="!videoStarted"
                class="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                @click="playVideo"
              >
                <div class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/90 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <i class="ti ti-player-play text-xl sm:text-2xl lg:text-3xl text-gray-900 mr-0.5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentary Videos Section -->
    <section class="py-10 sm:py-16 lg:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header - Compact on Mobile -->
        <div class="flex items-center justify-between mb-6 sm:mb-10">
          <div class="flex items-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-rose-600 rounded-full flex items-center justify-center ml-3">
              <i class="ti ti-video text-white text-lg sm:text-xl"></i>
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">مستندات حمایت</h2>
          </div>
          <NuxtLink 
            to="/documentaries"
            class="text-rose-600 hover:text-rose-700 font-medium text-sm sm:text-base flex items-center"
          >
            <span class="hidden sm:inline">مشاهده همه</span>
            <span class="sm:hidden">همه</span>
            <i class="ti ti-arrow-left text-sm sm:text-lg mr-1 sm:mr-2"></i>
          </NuxtLink>
        </div>

        <!-- Videos Swiper - 2 Columns on Mobile -->
        <Swiper
          :modules="swiperModules"
          :slides-per-view="2"
          :space-between="12"
          :navigation="false"
          :pagination="{ clickable: true }"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }"
          :breakpoints="{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
              navigation: true,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
              navigation: true,
            },
          }"
          class="documentaries-swiper"
        >
          <SwiperSlide
            v-for="video in videos"
            :key="video.id"
            class="h-auto"
          >
            <NuxtLink 
              :to="`/documentaries/${video.id}`"
              class="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 h-full border border-gray-100"
            >
              <div class="relative h-32 sm:h-40 lg:h-48 flex-shrink-0">
                <img 
                  :src="video.thumbnail" 
                  :alt="video.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >
                
                <!-- Play Button -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <i class="ti ti-player-play text-lg sm:text-xl lg:text-2xl text-rose-600 mr-0.5"></i>
                  </div>
                </div>
                
                <!-- Duration Badge -->
                <div class="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs font-medium flex items-center">
                  <i class="ti ti-clock text-xs ml-0.5 sm:ml-1"></i>
                  {{ video.duration }}
                </div>
              </div>
              
              <div class="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
                <div class="flex items-center justify-between mb-2 sm:mb-3">
                  <span class="px-2 py-0.5 sm:px-3 sm:py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                    {{ video.category.title }}
                  </span>
                  <span class="text-xs sm:text-sm text-gray-500 flex items-center">
                    <i class="ti ti-eye text-xs ml-0.5 sm:ml-1"></i>
                    <span class="hidden sm:inline">{{ video.views }}</span>
                  </span>
                </div>
                
                <h3 class="font-bold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-rose-600 transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                  {{ video.title }}
                </h3>
                
                <!-- Description - Hidden on Mobile -->
                <p class="hidden sm:block sm:line-clamp-2 text-gray-600 text-sm mt-2 leading-relaxed min-h-[2.5rem]">
                  {{ video.description }}
                </p>
                
                <!-- Footer - Hidden on Mobile -->
                <div class="hidden sm:flex items-center justify-between text-xs text-gray-500 pt-3 mt-auto border-t border-gray-100">
                  <span class="flex items-center">
                    <i class="ti ti-calendar text-xs ml-1"></i>
                    {{ formatDate(video.publishDate) }}
                  </span>
                  <span class="text-rose-600 font-medium group-hover:text-rose-700 flex items-center">
                    مشاهده
                    <i class="ti ti-arrow-left text-sm mr-1 group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </div>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <!-- Supporters Section -->
    <section class="py-10 sm:py-16 lg:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header - Compact on Mobile -->
        <div class="flex items-center justify-between mb-6 sm:mb-10">
          <div class="flex items-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-rose-600 rounded-full flex items-center justify-center ml-3">
              <i class="ti ti-users text-white text-lg sm:text-xl"></i>
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">حامیان ما</h2>
          </div>
          <NuxtLink 
            to="/supporters"
            class="text-rose-600 hover:text-rose-700 font-medium text-sm sm:text-base flex items-center"
          >
            <span class="hidden sm:inline">مشاهده همه</span>
            <span class="sm:hidden">همه</span>
            <i class="ti ti-arrow-left text-sm sm:text-lg mr-1 sm:mr-2"></i>
          </NuxtLink>
        </div>

        <!-- Supporters Swiper - 2 Columns on Mobile -->
        <Swiper
          :modules="swiperModules"
          :slides-per-view="2"
          :space-between="12"
          :navigation="false"
          :pagination="{ clickable: true }"
          :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
          }"
          :breakpoints="{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
              navigation: true,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
              navigation: true,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
              navigation: true,
            },
          }"
          class="supporters-home-swiper"
        >
          <SwiperSlide
            v-for="supporter in supporters"
            :key="supporter.id"
          >
            <div
              @click="navigateToSupporter(supporter.id)"
              class="group bg-white rounded-xl overflow-hidden transition-all duration-200 border border-gray-100 hover:border-rose-200 cursor-pointer h-full"
            >
              <!-- Header Banner - Smaller on Mobile -->
              <div class="h-16 sm:h-20 lg:h-24 bg-rose-100 relative">
                <!-- Decorative Pattern - Hidden on Mobile -->
                <div class="hidden sm:block absolute inset-0 opacity-10">
                  <div class="absolute top-2 right-4 w-6 h-6 bg-rose-400 rounded-full"></div>
                  <div class="absolute top-4 right-12 w-3 h-3 bg-rose-300 rounded-full"></div>
                  <div class="absolute bottom-3 left-6 w-4 h-4 bg-rose-400 rounded-full"></div>
                  <div class="absolute bottom-5 left-16 w-2 h-2 bg-rose-300 rounded-full"></div>
                </div>
                
                <!-- Avatar - Smaller on Mobile -->
                <div class="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-3 sm:border-4 border-white bg-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                        :src="supporter.avatar || '/images/default-avatar.jpg'"
                        :alt="supporter.firstName.charAt(0)"
                        class="object-cover w-full h-full rounded-full"
                    />
<!--                    <i class="ti ti-heart-filled text-white text-xl sm:text-2xl lg:text-3xl"></i>-->
                  </div>
                </div>
              </div>

              <!-- Content Section - More Compact on Mobile -->
              <div class="pt-8 sm:pt-10 px-3 sm:px-4 pb-3 sm:pb-4">
                <div class="text-center mb-2 sm:mb-3">
                  <h3 class="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-0.5 sm:mb-1 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {{ supporter.firstName }} {{ supporter.lastName }}
                  </h3>
                  <p class="text-rose-500 font-medium text-xs sm:text-sm line-clamp-1">{{ supporter.title }}</p>
                </div>
                
                <!-- Join Date Badge - Hidden on Mobile -->
                <div class="hidden sm:flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
                  <div class="flex items-center gap-1">
                    <i class="ti ti-calendar text-rose-400"></i>
                    <span>عضو از {{ formatDate(supporter.joinDate) }}</span>
                  </div>
                </div>
                
                <!-- Action Buttons - Simplified on Mobile -->
                <div class="flex gap-1.5 sm:gap-2">
                  <a 
                    :href="`/supporters/${supporter.id}`"
                    class="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-rose-600 text-white hover:bg-rose-700"
                    @click.stop
                  >
                    <i class="ti ti-user text-sm sm:text-base"></i>
                    <span class="hidden sm:inline">مشاهده</span>
                  </a>
                  <div class="inline-flex gap-1">
                    <template v-for="(link, platform) in supporter.socialLinks" :key="platform">
                      <a 
                        v-if="link"
                        :href="getSocialLink(platform, link)"
                        target="_blank"
                        @click.stop
                        class="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg text-xs sm:text-sm border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <i :class="`ti ti-brand-${platform}`"></i>
                      </a>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>


      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import {useCategoryTypeStore} from "~/stores/category-type.ts";
import {useCategoryStore} from "~/stores/category.ts";

// Swiper modules
const swiperModules = [Navigation, Pagination, Autoplay]

// SEO Meta with JSON-LD Structured Data
useSeoMeta({
  title: 'حامیان حیوانات - پتومن | نجات و حمایت از حیوانات بی‌سرپناه',
  description: 'به جمع حامیان حیوانات پتومن بپیوندید و در نجات جان‌های بی‌گناه مشارکت کنید. مستندات نجات و راه‌های حمایت مالی.',
  ogTitle: 'حامیان حیوانات - پتومن | نجات و حمایت از حیوانات بی‌سرپناه',
  ogDescription: 'به جمع حامیان حیوانات پتومن بپیوندید. مستندات نجات و راه‌های مختلف حمایت از حیوانات بی‌سرپناه.',
  ogType: 'website',
  ogUrl: 'https://hamian.petoman.ir',
  ogImage: '/images/og-hamian.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'حامیان حیوانات - پتومن',
  twitterDescription: 'نجات و حمایت از حیوانات بی‌سرپناه. به جمع حامیان ما بپیوندید.',
  twitterImage: '/images/og-hamian.jpg'
})

// JSON-LD Structured Data
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "پتومن - حامیان حیوانات",
        "description": "نجات، درمان و حمایت از حیوانات بی‌سرپناه",
        "url": "https://hamian.petoman.ir",
        "logo": "https://hamian.petoman.ir/images/logo.png",
        "foundingDate": "2023",
        "areaServed": "ایران",
        "sameAs": [
          "https://t.me/petoman_hamian",
          "https://instagram.com/petoman.ir"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+98-912-345-6789",
          "contactType": "Emergency Rescue"
        }
      })
    }
  ]
})

// Reactive Data
const aboutVideoRef = ref<HTMLVideoElement>()
const videoStarted = ref(false)
import {useKindnessEventsStore} from "~/stores/kindness-events.ts";
import {toJalaliDate} from "~/utils/date.ts";
import {useVideoData} from "~/composables/useVideoData.ts";
import {useDocumentaryStore} from "~/stores/documentary.ts";
import {useSupporterStore} from "~/stores/supporter.ts";
import {computed} from "vue";
const kindnessEventStore=useKindnessEventsStore()
// Next Kindness Event Data - با فیلتر showOnHomepage
// TODO: دریافت از API با فیلتر showOnHomepage: true
const allEvents = computed(() =>
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
      const showOnHomepage=item.showOnHomepage||true


      if (type === 'financial') {
        // مطابق نمونه‌ی مالی
        return {
          id,
          type,
          title,
          description,
          date:startDate,
          endTime,
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
          showOnHomepage

        }
      } else {
        // volunteer مطابق نمونه‌ی دورهمی
        return {
          id,
          type,
          title,
          description,
          eventDate,
          date:eventDate,
          eventTime,
          time:eventTime,
          location,
          remainingSlots,
          status,
          manager,
          image,
          showOnHomepage
        }
      }
    })
)
/*const allEvents = ref([
  {
    id: 1,
    type: 'volunteer',
    title: 'غذا دادن به حیوانات بی‌پناه',
    description: 'در این قرار، داوطلبان در پارک ملت جمع می‌شوند تا به حیوانات بی‌پناه غذا بدهند و مراقبت کنند.',
    date: 'جمعه ۱۵ آذر ۱۴۰۴',
    time: '۱۰:۰۰ صبح',
    location: 'پارک ملت - درب شمالی',
    remainingSlots: 15,
    eventDate: new Date('2025-12-06T10:00:00'),
    showOnHomepage: false // تغییر دادیم که قرار مالی نمایش داده بشه
  },
  {
    id: 2,
    type: 'financial',
    title: 'کمک به درمان حیوانات آسیب‌دیده',
    description: 'با کمک شما می‌توانیم به حیوانات زخمی و بیمار درمان و مراقبت لازم را ارائه دهیم. هر کمک کوچکی می‌تواند یک جان را نجات دهد.',
    date: 'تا ۳۱ اسفند ۱۴۰۴',
    time: '۶ ماه',
    location: 'کلینیک دامپزشکی پتومن',
    goal: 50000000, // مبلغ هدف (50 میلیون تومان)
    current: 32500000, // مبلغ جمع‌آوری شده (32.5 میلیون تومان)
    supporters: 128, // تعداد حامیان
    showOnHomepage: true // این در صفحه اصلی نمایش داده می‌شود
  }
])*/

// محاسبه درصد پیشرفت قرار مالی
const progress = computed(() => {
  if (nextEvent.value?.type === 'financial' && nextEvent.value?.goal) {
    return Math.round((nextEvent.value.current / nextEvent.value.goal) * 100)
  }
  return 0
})

// فرمت کردن مبلغ با جداکننده هزارگان
const formatCurrency = (amount?: number) => {
  const value = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  return new Intl.NumberFormat('fa-IR').format(value)
}
// Countdown Timer
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

// فقط رویدادهایی که showOnHomepage === true است
const nextEvent = computed(() => {
  const homepageEvent = allEvents.value.find(event => event.showOnHomepage)

  return homepageEvent || allEvents.value[0] // اگر هیچکدام تیک نخورده، اولین را نشان بده
})
const formatDateToJalali=(date:string)=>{

  return toJalaliDate(date)

}

// Update countdown every second
const updateCountdown = () => {
  // فقط برای قرار دورهمی countdown محاسبه می‌شود
  if (nextEvent.value?.type !== 'volunteer') {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  const now = Date.now()
  const eventDateStr = nextEvent.value?.eventDate
  const eventTimeStr = nextEvent.value?.eventTime || '00:00'

  // اگر تاریخ وجود نداشت
  if (!eventDateStr) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  // ساختن شیء Date از رشته
  const eventDate = new Date(`${eventDateStr}T${eventTimeStr}:00`)

  if (isNaN(eventDate.getTime())) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  const distance = eventDate.getTime() - now

  if (distance > 0) {
    countdown.value.days = Math.floor(distance / (1000 * 60 * 60 * 24))
    countdown.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    countdown.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    countdown.value.seconds = Math.floor((distance % (1000 * 60)) / 1000)
  } else {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

// Initialize countdown
onMounted(async () => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})

// About Video Data
const aboutVideo = ref({
  title: 'ماموریت پتومن: نجات جان‌های بی‌گناه',
  description: 'در این ویدیو با اهداف، روش‌های کار و تیم پتومن آشنا شوید و ببینید چگونه هر روز برای نجات جان حیوانات تلاش می‌کنیم.',
  src: '/videos/about-petoman.mp4',
  poster: '/images/about-video-poster.jpg',
  duration: '۴:۳۲',
  publishDate: '2024-01-15'
})
const documentaryStore=useDocumentaryStore()
const videos=computed(()=>documentaryStore.documentaries.map((item:any)=>{
  const id=item.id
  const title=item.title
  const description=item.description
  const thumbnail=item.thumbnailPreview
  const videoUrl=item.videoFile
  const duration=item.duration
  const publishDate=item.publishDate
  const category=item.category
  const views=item.views
  const tags=item.tags
  const story=item.story

  return{
    id,
    title,
    description,
    thumbnail,
    videoUrl,
    duration,
    publishDate,
    category,
    views,
    tags,
    story

  }
}))
// Featured Videos
const featuredVideos = ref([
  {
    id: 1,
    title: 'نجات شگفت‌انگیز توله سگ از زیر آوار',
    description: 'داستان نجات توله سگی که زیر آوار گیر کرده بود و چگونه تیم ما موفق به نجات جان او شد. این ویدیو شامل تمام مراحل نجات از کشف تا انتقال به پناهگاه است.',
    thumbnail: '/images/video1-thumb.jpg',
    duration: '۸:۴۵',
    category: 'نجات اضطراری',
    views: '۱۵.۴K',
    publishDate: '2024-01-20'
  },
  {
    id: 2,
    title: 'درمان و بهبودی گربه مجروح',
    description: 'فرآیند کامل درمان گربه‌ای که در تصادف مجروح شده بود و بازگشت او به زندگی عادی.',
    thumbnail: '/images/video2-thumb.jpg',
    duration: '۱۲:۲۰',
    category: 'درمان و توانبخشی',
    views: '۸.۹K',
    publishDate: '2024-01-18'
  },
  {
    id: 3,
    title: 'اولین قدم‌های توله سگ معلول',
    description: 'لحظات احساسی اولین قدم‌های توله سگی که توانایی راه رفتن را از دست داده بود.',
    thumbnail: '/images/video3-thumb.jpg',
    duration: '۶:۱۵',
    category: 'داستان‌های موفقیت',
    views: '۲۵.۱K',
    publishDate: '2024-01-16'
  },
  {
    id: 4,
    title: 'برنامه واکسیناسیون گروهی حیوانات',
    description: 'اجرای برنامه واکسیناسیون رایگان برای حیوانات خیابانی در مناطق مختلف شهر.',
    thumbnail: '/images/video4-thumb.jpg',
    duration: '۹:۳۰',
    category: 'درمان و توانبخشی',
    views: '۶.۸K',
    publishDate: '2024-01-10'
  },
  {
    id: 5,
    title: 'احداث پناهگاه مدرن حیوانات',
    description: 'مراحل طراحی، ساخت و راه‌اندازی پناهگاه جدید با امکانات پیشرفته.',
    thumbnail: '/images/video5-thumb.jpg',
    duration: '۱۵:۴۵',
    category: 'پناهگاه و نگهداری',
    views: '۱۲.۳K',
    publishDate: '2024-01-12'
  },
  {
    id: 6,
    title: 'آموزش نگهداری صحیح از حیوانات خانگی',
    description: 'راهنمای کاملی برای نگهداری صحیح از حیوانات خانگی و نکات مهم سلامتی.',
    thumbnail: '/images/video6-thumb.jpg',
    duration: '۱۸:۲۰',
    category: 'آموزش و آگاهی',
    views: '۲۲.۳K',
    publishDate: '2024-01-08'
  }
])

const supporterStore=useSupporterStore()
const supporters=computed(()=>
    supporterStore.supporterCases.map((item)=>{

      const id=item.id
      const firstName=item.firstName
      const lastName=item.lastName
      const title=item.title
      const bioExcerpt=item.bio
      const avatar=item.avatar
      const supportType=item.type
      const joinDate=item.joinDate
      const animalsSaved=item.animalsSaved
      const initial=item.initials
      const socialLinks=item.socialLinks||{}

      return{
        id,
        firstName,
        lastName,
        title,
        bioExcerpt,
        avatar,
        supportType,
        joinDate,
        animalsSaved,
        initial,
        socialLinks
      }

    }))
// Featured Supporters
const featuredSupporters = ref([
  {
    id: 1,
    firstName: 'سارا',
    lastName: 'احمدی',
    title: 'دامپزشک تیم نجات',
    bioExcerpt: 'سلام! من سارا هستم. از کودکی با حیوانات زندگی کرده‌ام و عاشق آن‌ها بودم. تو پتومن به عنوان دامپزشک داوطلب کار می‌کنم و تا حالا صدها حیوان رو درمان کردم.',
    avatar: '/images/supporter1.jpg',
    joinDate: '2023-03-15',
    socialLinks: {
      instagram: '@dr.sara.ahmadi',
      telegram: '@sara_vet'
    }
  },
  {
    id: 2,
    firstName: 'علی',
    lastName: 'کریمی',
    title: 'رئیس تیم داوطلبان',
    bioExcerpt: 'من علی هستم، مدیر تیم داوطلبان پتومن. از ۸ سال پیش که تو این حوزه فعالیت می‌کنم و تجربه کار با سازمان‌های مختلف رو دارم. اینجا مسئولیت هماهنگی عملیات نجات رو برعهده دارم.',
    avatar: '/images/supporter2.jpg',
    joinDate: '2023-02-10',
    socialLinks: {
      instagram: '@ali_rescue',
      linkedin: 'ali-karimi-social'
    }
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صادقی',
    title: 'مسئول روابط عمومی',
    bioExcerpt: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صادقی',
    title: 'مسئول روابط عمومی',
    bioExcerpt: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صادقی',
    title: 'مسئول روابط عمومی',
    bioExcerpt: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صادقی',
    title: 'مسئول روابط عمومی',
    bioExcerpt: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صادقی',
    title: 'مسئول روابط عمومی',
    bioExcerpt: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  },
  {
    id: 3,
    firstName: 'مریم',
    lastName: 'صادقی',
    title: 'مسئول روابط عمومی',
    bioExcerpt: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم.',
    avatar: '/images/supporter3.jpg',
    joinDate: '2023-04-22',
    socialLinks: {
      instagram: '@maryam_petoman',
      twitter: '@maryam_pr'
    }
  }
])

// Methods
const navigateToSupporter = (supporterId: string) => {
  navigateTo(`/supporters/${supporterId}`)
}

const playVideo = () => {
  if (aboutVideoRef.value) {
    aboutVideoRef.value.play()
    videoStarted.value = true
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getSocialLink = (platform: string, username: string) => {
  const links = {
    instagram: `https://instagram.com/${username.replace('@', '')}`,
    telegram: `https://t.me/${username.replace('@', '')}`,
    linkedin: `https://linkedin.com/in/${username}`,
    twitter: `https://twitter.com/${username.replace('@', '')}`
  }
  return links[platform as keyof typeof links] || '#'
}

// Lifecycle
onMounted(() => {
  if (aboutVideoRef.value) {
    aboutVideoRef.value.addEventListener('play', () => {
      videoStarted.value = true
    })
    
    aboutVideoRef.value.addEventListener('pause', () => {
      videoStarted.value = false
    })
  }
})
</script>

<style scoped>
/* Swiper Custom Styles for Supporters Section */
:deep(.supporters-home-swiper) {

  padding-bottom: 50px;
}

:deep(.supporters-home-swiper .swiper-button-next),
:deep(.supporters-home-swiper .swiper-button-prev) {
  color: #e11d48;
  background: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}

:deep(.supporters-home-swiper .swiper-button-next:hover),
:deep(.supporters-home-swiper .swiper-button-prev:hover) {
  background: #e11d48;
  color: white;
}

:deep(.supporters-home-swiper .swiper-button-prev) {
  right: 0;
  left: auto;
}

:deep(.supporters-home-swiper .swiper-button-prev::after) {
  content: '';
  display: none;
}

:deep(.supporters-home-swiper .swiper-button-prev::before) {
  font-family: 'tabler-icons';
  content: '\ea61';
  font-size: 20px;
  display: block;
  transform: rotate(180deg);
}

:deep(.supporters-home-swiper .swiper-button-next) {
  left: 0;
  right: auto;
}

:deep(.supporters-home-swiper .swiper-button-next::after) {
  content: '';
  display: none;
}

:deep(.supporters-home-swiper .swiper-button-next::before) {
  font-family: 'tabler-icons';
  content: '\ea61';
  font-size: 20px;
  display: block;
}

:deep(.supporters-home-swiper .swiper-button-next:hover) {
  transform: scale(1.1);
}

:deep(.supporters-home-swiper .swiper-button-prev:hover) {
  transform: scale(1.1);
}

:deep(.supporters-home-swiper .swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: #d1d5db;
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.supporters-home-swiper .swiper-pagination-bullet-active) {
  background: #e11d48;
  width: 24px;
  border-radius: 5px;
}

/* Swiper Custom Styles for Documentaries Section */
:deep(.documentaries-swiper) {

  padding-bottom: 50px;
}

:deep(.documentaries-swiper .swiper-button-next),
:deep(.documentaries-swiper .swiper-button-prev) {
  color: #e11d48;
  background: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}

:deep(.documentaries-swiper .swiper-button-next:hover),
:deep(.documentaries-swiper .swiper-button-prev:hover) {
  background: #e11d48;
  color: white;
}

:deep(.documentaries-swiper .swiper-button-prev) {
  right: 0;
  left: auto;
}

:deep(.documentaries-swiper .swiper-button-prev::after) {
  content: '';
  display: none;
}

:deep(.documentaries-swiper .swiper-button-prev::before) {
  font-family: 'tabler-icons';
  content: '\ea61';
  font-size: 22px;
  display: block;
  transform: rotate(180deg);
}

:deep(.documentaries-swiper .swiper-button-next) {
  left: 0;
  right: auto;
}

:deep(.documentaries-swiper .swiper-button-next::after) {
  content: '';
  display: none;
}

:deep(.documentaries-swiper .swiper-button-next::before) {
  font-family: 'tabler-icons';
  content: '\ea61';
  font-size: 22px;
  display: block;
}

:deep(.documentaries-swiper .swiper-button-next:hover) {
  transform: scale(1.1);
}

:deep(.documentaries-swiper .swiper-button-prev:hover) {
  transform: scale(1.1);
}

:deep(.documentaries-swiper .swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #d1d5db;
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.documentaries-swiper .swiper-pagination-bullet-active) {
  background: #e11d48;
  width: 30px;
  border-radius: 5px;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RTL Adjustments */
[dir="rtl"] .mr-1 {
  margin-right: 0;
  margin-left: 0.25rem;
}

[dir="rtl"] .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

[dir="rtl"] .mr-3 {
  margin-right: 0;
  margin-left: 0.75rem;
}

/* Hide Scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
