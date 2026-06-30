<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-20">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Logo & About -->
        <div class="flex flex-col items-center md:items-start gap-5">
          <!-- Brand logo -->
          <NuxtLink :to="footerSection?.data.logoLink || '/'" class="flex items-center gap-3 group">
            <div class="w-10 h-10 relative bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-1.5">
              <img
                  :src="footerSection?.data.footerLogo || '/assets/img/pet.png'"
                  :alt="footerSection?.data.aboutTitle || 'لوگو'"
                  class="w-full h-full object-contain rounded-lg"
              />
            </div>
            <span class="text-2xl font-extrabold bg-gradient-to-l from-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight">
              {{ footerSection?.data.aboutTitle || 'پت دانیم' }}
            </span>
          </NuxtLink>

          <!-- About text -->
          <p class="text-sm text-gray-600 mt-2">{{ footerSection?.data.aboutText }}</p>

          <!-- Social -->
          <div class="flex flex-wrap gap-2 mt-4">
            <a v-if="footerSection?.data.instagram" :href="footerSection.data.instagram" target="_blank">
              <Icon name="brand-instagram" size="md" class="text-pink-500" />
            </a>
            <a v-if="footerSection?.data.telegram" :href="footerSection.data.telegram" target="_blank">
              <Icon name="brand-telegram" size="md" class="text-blue-500" />
            </a>
            <a v-if="footerSection?.data.twitter" :href="footerSection.data.twitter" target="_blank">
              <Icon name="brand-twitter" size="md" class="text-sky-500" />
            </a>
            <a v-if="footerSection?.data.linkedin" :href="footerSection.data.linkedin" target="_blank">
              <Icon name="brand-linkedin" size="md" class="text-blue-700" />
            </a>
          </div>
        </div>

        <!-- Quick Links Column 1 -->
        <div class="flex flex-col items-center md:items-start gap-4">
          <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {{ footerSection?.data.column1Title }}
          </h4>
          <ul class="space-y-2">
            <li v-for="(link, idx) in footerSection?.data.quickLinks.slice(0, Math.ceil(footerSection.data.quickLinks.length/2))" :key="idx">
              <NuxtLink :to="link.link" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                <Icon name="link" size="sm" /> {{ link.label || 'لینک' }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Quick Links Column 2 -->
        <div class="flex flex-col items-center md:items-start gap-4">
          <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {{ footerSection?.data.column2Title }}
          </h4>
          <ul class="space-y-2">
            <li v-for="(link, idx) in footerSection?.data.quickLinks.slice(Math.ceil(footerSection.data.quickLinks.length/2))" :key="idx">
              <NuxtLink :to="link.link" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                <Icon name="link" size="sm" /> {{ link.label || 'لینک' }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <Icon name="map-pin" size="sm" class="text-orange-500" />
          <span>{{ footerSection?.data.address }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="phone" size="sm" class="text-orange-500" />
          <span>{{ footerSection?.data.phone }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="mail" size="sm" class="text-orange-500" />
          <span>{{ footerSection?.data.email }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="clock" size="sm" class="text-orange-500" />
          <span>{{ footerSection?.data.workingHours }}</span>
        </div>
      </div>


      <!-- Brand Bar -->
      <div class="mt-10">
        <div class="h-px w-full bg-gradient-to-r from-transparent via-primary-300/50 to-transparent mb-6"></div>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>© {{ currentYear }} پت دانیم – تمام حقوق محفوظ است</span>
          <span>{{ footerSection?.description }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {computed} from 'vue'
import {useSettingStore} from "~/stores/setting.js"
import Icon from "~/components/Icon.vue"

const currentYear = new Date().getFullYear()
const settingStore = useSettingStore()

const footerSection = computed(() =>
    settingStore.pageSections.find(s => s.type === "footer")
)
</script>