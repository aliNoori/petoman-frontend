<script setup lang="ts">
import { computed } from 'vue'
import { usePageStore } from '~/stores/page'
const pageStore = usePageStore()
const loading = ref(true)
const route = useRoute()
const slug = computed(() => route.params.slug as string)
const staticPages: Record<string, any> = {
  about: {
    title: 'درباره ما',
    icon: 'info-circle',
    content: `
      <p>پت دانیم یک پلتفرم جامع اطلاع‌رسانی درباره حیوانات خانگی است...</p>
    `
  },
  terms: {
    title: 'قوانین و مقررات',
    icon: 'file-text',
    content: `
      <h3>۱. پذیرش قوانین</h3>
      <p>با استفاده از این وب‌سایت، شما قوانین و مقررات زیر را می‌پذیرید.</p>
    `
  },
  privacy: {
    title: 'حریم خصوصی',
    icon: 'shield-check',
    content: `
      <h3>۱. جمع‌آوری اطلاعات</h3>
      <p>ما اطلاعات شخصی شما را فقط برای بهبود خدمات جمع‌آوری می‌کنیم.</p>
    `
  },
  contact: {
    title: 'تماس با ما',
    icon: 'mail',
    content: `
      <p>برای ارتباط با ما می‌توانید از راه‌های زیر استفاده کنید:</p>
      <p>ایمیل: info@petdanim.com</p>
      <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
      <p>آدرس: تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
    `
  }
}

const allPages = computed(() => {
  const storePages: Record<string, any> = {}
  pageStore.pages.forEach((p:any) => {
    storePages[p.slug || p.id] = {
      title: p.title,
      icon: p.icon || 'file-text',
      image:p.image,
      ogTitle:p.ogTitle,
      ogDescription:p.ogDescription,
      ogImage:p.ogImage,
      metaTitle:p.metaTitle,
      metaDescription:p.metaDescription,
      content: p.content
    }
  })
  return { ...staticPages, ...storePages }
})
// Mock data - در واقعیت از API میگیرید
const pageData = computed(() => {
  if (!slug.value) return null
  return allPages.value[slug.value] || null
})

watch(pageData, (val) => {
  if (!val) return
  useSeoMeta({
    // Title و Description
    title: () => val.metaTitle || `${val.title} - پت دانیم`,
    description: () => val.metaDescription || `${val.excerpt || val.title} - پلتفرم جامع اطلاع‌رسانی حیوانات خانگی`,

    // Open Graph
    ogTitle: () => val.ogTitle || val.metaTitle || val.title,
    ogDescription: () => val.ogDescription || val.metaDescription || val.excerpt,
    ogImage: () => val.ogImage || val.image,
    ogType: 'website',
    ogUrl: () => `https://petoman.com/danim/${val.slug || ''}`,

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterTitle: () => val.metaTitle || val.title,
    twitterDescription: () => val.metaDescription || val.excerpt,
    twitterImage: () => val.ogImage || val.image,
  })
})


onMounted(async () => {
  await pageStore.fetchPages()
  loading.value = false
})
</script>

<template>
  <div v-if="slug" class="min-h-screen bg-gray-50 pt-20 md:pt-0">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Page Header -->
      <div class="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon :name="pageData.icon" size="lg" class="text-orange-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-800">{{ pageData.title }}</h1>
        </div>
      </div>

      <!-- Page Content -->
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div class="prose prose-slate max-w-none" v-html="pageData.content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.8;
}

.prose :deep(p) {
  margin-bottom: 1.25rem;
  color: #4b5563;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.prose :deep(.contact-info) {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.prose :deep(.contact-item) {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
}

.prose :deep(.icon-box) {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.prose :deep(.contact-item h4) {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.prose :deep(.contact-item p) {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
