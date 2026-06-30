<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
    <HeaderFilm/>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent mb-4">
            دسته‌بندی محتوا
          </h1>
          <p class="text-lg text-yellow-200/80 max-w-2xl mx-auto">
            فیلم‌ها، سریال‌ها، انیمیشن‌ها و مستندات متنوع حیوانات را کشف کنید
          </p>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="pb-20">
      <div class="max-w-7xl mx-auto px-4 space-y-16">
        <div
            v-for="category in categories"
            :key="category.id"
            class="group"
        >
          <!-- Category Header -->
          <div
              class="flex items-center gap-4 mb-8 p-8 bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 backdrop-blur-sm rounded-2xl border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 shadow-lg shadow-black/50">
            <div
                class="w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i :class="[category.icon, 'text-4xl text-yellow-400']"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-3xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-base text-yellow-200/70">
                {{ category.description }}
              </p>
            </div>
            <div class="px-6 py-3 bg-yellow-400/20 rounded-xl border border-yellow-400/30">
              <span class="text-yellow-400 font-bold text-2xl">{{ category.total }}</span>
              <span class="text-yellow-200/70 text-sm mr-2">محتوا</span>
            </div>
          </div>

          <!-- Subcategories (Types) Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
            <!-- Film -->
            <div
                v-if="category.movie > 0"
                @click="navigateToType(category, 'movie')"
                class="group/item bg-gradient-to-br from-zinc-900/70 to-zinc-800/50 backdrop-blur-sm rounded-xl border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/20"
            >
              <div class="flex items-center gap-4 mb-4">
                <div
                    class="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md">
                  <i class="ti ti-movie text-yellow-400 text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-white text-lg font-bold group-hover/item:text-yellow-300 transition-colors">فیلم</h4>
                </div>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-yellow-400/10">
                <span class="text-yellow-200/60 text-sm">تعداد محتوا</span>
                <span class="text-yellow-400 font-bold text-xl">{{ category.movie }}</span>
              </div>
            </div>

            <!-- Series -->
            <div
                v-if="category.series > 0"
                @click="navigateToType(category, 'series')"
                class="group/item bg-gradient-to-br from-zinc-900/70 to-zinc-800/50 backdrop-blur-sm rounded-xl border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/20"
            >
              <div class="flex items-center gap-4 mb-4">
                <div
                    class="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md">
                  <i class="ti ti-device-tv text-yellow-400 text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-white text-lg font-bold group-hover/item:text-yellow-300 transition-colors">سریال</h4>
                </div>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-yellow-400/10">
                <span class="text-yellow-200/60 text-sm">تعداد محتوا</span>
                <span class="text-yellow-400 font-bold text-xl">{{ category.series }}</span>
              </div>
            </div>

            <!-- Animation -->
            <div
                v-if="category.animation > 0"
                @click="navigateToType(category, 'animation')"
                class="group/item bg-gradient-to-br from-zinc-900/70 to-zinc-800/50 backdrop-blur-sm rounded-xl border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/20"
            >
              <div class="flex items-center gap-4 mb-4">
                <div
                    class="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md">
                  <i class="ti ti-palette text-yellow-400 text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-white text-lg font-bold group-hover/item:text-yellow-300 transition-colors">
                    انیمیشن</h4>
                </div>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-yellow-400/10">
                <span class="text-yellow-200/60 text-sm">تعداد محتوا</span>
                <span class="text-yellow-400 font-bold text-xl">{{ category.animation }}</span>
              </div>
            </div>

            <!-- Documentary -->
            <div
                v-if="category.documentary > 0"
                @click="navigateToType(category, 'documentary')"
                class="group/item bg-gradient-to-br from-zinc-900/70 to-zinc-800/50 backdrop-blur-sm rounded-xl border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/20"
            >
              <div class="flex items-center gap-4 mb-4">
                <div
                    class="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md">
                  <i class="ti ti-file-text text-yellow-400 text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="text-white text-lg font-bold group-hover/item:text-yellow-300 transition-colors">مستند</h4>
                </div>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-yellow-400/10">
                <span class="text-yellow-200/60 text-sm">تعداد محتوا</span>
                <span class="text-yellow-400 font-bold text-xl">{{ category.documentary }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterFilm/>
  </div>
</template>

<script setup lang="ts">
import {useCategoryStore} from "~/stores/category";
import {useCategoryTypeStore} from "~/stores/category-type";
import {computed} from "vue";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  movie: number;
  series: number;
  animation: number;
  documentary: number;
  total: number;
}

/*const categories: Category[] = [
  {
    id: 'wildlife',
    name: 'حیوانات وحشی',
    description: 'مستندات شگفت‌انگیز از دنیای حیوانات وحشی',
    icon: 'ti ti-deer',
    movie: 25,
    series: 15,
    animation: 5,
    documentary: 8,
    total: 53
  },
  {
    id: 'marine',
    name: 'حیوانات دریایی',
    description: 'کشف اعماق اقیانوس‌ها و موجودات دریایی',
    icon: 'ti ti-fish',
    movie: 18,
    series: 10,
    animation: 4,
    documentary: 6,
    total: 38
  },
  {
    id: 'birds',
    name: 'پرندگان',
    description: 'دنیای رنگارنگ و زیبای پرندگان',
    icon: 'ti ti-feather',
    movie: 22,
    series: 12,
    animation: 4,
    documentary: 5,
    total: 43
  },
  {
    id: 'pets',
    name: 'حیوانات خانگی',
    description: 'راهنمای نگهداری و آموزش حیوانات خانگی',
    icon: 'ti ti-paw',
    movie: 15,
    series: 8,
    animation: 5,
    documentary: 3,
    total: 31
  },
  {
    id: 'insects',
    name: 'حشرات',
    description: 'دنیای کوچک و شگفت‌انگیز حشرات',
    icon: 'ti ti-bug',
    movie: 10,
    series: 6,
    animation: 3,
    documentary: 4,
    total: 23
  },
  {
    id: 'farm',
    name: 'حیوانات مزرعه',
    description: 'زندگی در مزرعه و پرورش حیوانات',
    icon: 'ti ti-milk',
    movie: 14,
    series: 7,
    animation: 3,
    documentary: 2,
    total: 26
  },
  {
    id: 'reptiles',
    name: 'خزندگان',
    description: 'دنیای مرموز مارها، مارمولک‌ها و تمساح‌ها',
    icon: 'ti ti-snake',
    movie: 12,
    series: 5,
    animation: 2,
    documentary: 3,
    total: 22
  },
  {
    id: 'arctic',
    name: 'حیوانات قطبی',
    description: 'زندگی در سردترین نقاط کره زمین',
    icon: 'ti ti-snowflake',
    movie: 16,
    series: 6,
    animation: 3,
    documentary: 5,
    total: 30
  },
  {
    id: 'jungle',
    name: 'حیوانات جنگل',
    description: 'تنوع زیستی در جنگل‌های استوایی',
    icon: 'ti ti-tree',
    movie: 20,
    series: 9,
    animation: 4,
    documentary: 7,
    total: 40
  }
]*/

import { useRouter} from "nuxt/app";

type CategoryType = 'movie' | 'series' | 'animation' | 'documentary'

const router = useRouter()

const navigateToType = (category: Category, type: CategoryType) => {
  console.log('clicked',category)
  router.push(`/category/${category.id}/${type}`)
}

const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const filmTypeId = categoryTypeStore.idBySlug('film')
const categories = computed(() => {
  if (!filmTypeId) return []

  return categoryStore
      .getCategories(String(filmTypeId))
      .map((item: any) => ({
        id: item.slug,
        name: item.name,
        icon: item.icon??'ti ti-tree',
        description: item.description??'',
        movie: item.movie ?? 0,
        series: item.series ?? 0,
        animation: item.animation ?? 0,
        documentary: item.documentary ?? 0,
        total: item.total ?? 0,
      }))
})

</script>
