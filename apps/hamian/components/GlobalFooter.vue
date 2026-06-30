<template>
  <footer class="bg-gray-100 text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Main Content -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <NuxtLink to="/" class="flex items-center">
            <img src="~/assets/logo.png" alt="پتومن" class="h-8 sm:h-10 lg:h-12 w-auto">
          </NuxtLink>
        </div>
        <p class="text-gray-700 text-sm max-w-md mx-auto mb-6">
          نجات، درمان و حمایت از حیوانات بی‌سرپناه
        </p>
      </div>

      <!-- Quick Links -->
      <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm">
        <NuxtLink to="/" class="footer-link">
          صفحه اصلی
        </NuxtLink>
        <NuxtLink to="/kindness-events" class="footer-link">
          قرارهای مهربانی
        </NuxtLink>
        <NuxtLink to="/documentaries" class="footer-link">
          مستندات
        </NuxtLink>
        <NuxtLink to="/supporters" class="footer-link">
          حامیان
        </NuxtLink>
        <NuxtLink to="/faq" class="footer-link">
          سوالات متداول
        </NuxtLink>
      </div>

      <!-- Social Media -->
      <div class="flex justify-center gap-4 mb-8">
        <a href="#" class="social-link">
          <i class="ti ti-brand-instagram text-xl"></i>
        </a>
        <a href="#" class="social-link">
          <i class="ti ti-brand-telegram text-xl"></i>
        </a>
        <a href="tel:{{ settingStore.generalSetting?.contactPhone }}" class="social-link">
          <i class="ti ti-phone text-xl"></i>
        </a>
        <a href="mailto:{{ settingStore.generalSetting?.contactEmail }}" class="social-link">
          <i class="ti ti-mail text-xl"></i>
        </a>
      </div>

      <!-- Copyright -->
      <div class="text-center text-gray-500 text-xs pt-6 border-t border-gray-200">
        <p>© {{ currentYear }} پتومن. تمامی حقوق محفوظ است.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {useSettingStore} from "~/stores/setting.ts";

const currentYear = new Date().getFullYear()
const settingStore = useSettingStore()
</script>

<style scoped>
.footer-link {
  color: rgb(35, 35, 36);
  transition: color 0.2s ease;
  text-decoration: none;
}

.footer-link:hover {
  color: rgb(225, 29, 72);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgb(31, 41, 55);
  border-radius: 9999px;
  color: rgb(209, 213, 219);
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: rgb(225, 29, 72);
  color: white;
  transform: translateY(-2px);
}
</style>
