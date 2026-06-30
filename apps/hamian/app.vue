<template>
  <div>
    <GlobalHeader />
    <main class="pb-16 lg:pb-0">
      <NuxtPage />
    </main>
    <!-- Footer - Hidden on Mobile, Bottom Nav Instead -->
    <div class="hidden lg:block">
      <GlobalFooter />
    </div>
    <GlobalBottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useKindnessEventsStore } from "~/stores/kindness-events.ts";
import { useCategoryTypeStore } from "~/stores/category-type.ts";
import { useCategoryStore } from "~/stores/category.ts";
import { useDocumentaryStore } from "~/stores/documentary.ts";
import { useSupporterStore } from "~/stores/supporter.ts";
import { useFaqStore } from "~/stores/faq.ts";
import { useFaqTypeStore } from "~/stores/faq-type.ts";
import { useSettingStore } from "~/stores/setting.ts";

const kindnessEventStore = useKindnessEventsStore()
const categoryTypeStore = useCategoryTypeStore()
const categoryStore = useCategoryStore()
const documentaryStore = useDocumentaryStore()
const supporterStore = useSupporterStore()
const faqTypeStore = useFaqTypeStore()
const faqStore = useFaqStore()
const settingStore = useSettingStore()

onMounted(async () => {
  await settingStore.fetchAll()


  const schemaScripts: any[] = []

// Organization Schema
  if (settingStore.schemaSetting?.organization?.enabled) {
    schemaScripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": settingStore.schemaSetting.organization.name,
        "url": settingStore.schemaSetting.organization.url,
        "logo": settingStore.schemaSetting.organization.logo,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": settingStore.schemaSetting.organization.phone,
          "contactType": "customer service"
        }
      })
    })
  }

// Breadcrumb Schema
  if (settingStore.schemaSetting?.breadcrumb?.enabled) {
    schemaScripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "خانه",
            "item": "https://hamian.petoman.ir"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "پروژه‌ها",
            "item": "https://hamian.petoman.ir/projects"
          }
        ]
      })
    })
  }

// Project Schema
  if (settingStore.schemaSetting?.project?.enabled) {
    schemaScripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Project",
        "name": settingStore.schemaSetting.project.organization,
        "creator": settingStore.schemaSetting.project.manager
      })
    })
  }

// اضافه کردن همه اسکریپت‌ها به head
  if (schemaScripts.length) {
    useHead({ script: schemaScripts })
  }



  // ✅ SEO Meta
  useSeoMeta({
    title: settingStore.seoSetting?.metaTitle || settingStore.generalSetting?.siteTitle,
    description: settingStore.seoSetting?.metaDescription || settingStore.generalSetting?.siteDescription,
    keywords: settingStore.seoSetting?.metaKeywords,
  })

  // ✅ Head tags
  useHead({
    htmlAttrs: { lang: 'fa', dir: 'rtl' },
    link: [
      { rel: 'canonical', href: settingStore.seoSetting?.canonicalUrl || settingStore.generalSetting?.siteUrl },
      { rel: 'sitemap', href: settingStore.seoSetting?.sitemapUrl },
      // Favicon
      { rel: 'icon', type: 'image/png', href: settingStore.appearanceSetting?.favicon },
      { rel: 'apple-touch-icon', href: settingStore.appearanceSetting?.favicon }
    ],
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'utf-8' },
      { name: 'robots', content: settingStore.seoSetting?.robots },
      { property: 'og:title', content: settingStore.seoSetting?.metaTitle },
      { property: 'og:description', content: settingStore.seoSetting?.metaDescription },
      { property: 'og:url', content: settingStore.seoSetting?.canonicalUrl },
      { name: 'google-site-verification', content: settingStore.seoSetting?.googleSearchConsoleCode },
      // --- Open Graph ---
      { property: 'og:title', content: settingStore.openGraphSetting?.og.title },
      { property: 'og:description', content: settingStore.openGraphSetting?.og.description },
      { property: 'og:image', content: settingStore.openGraphSetting?.og.image },
      { property: 'og:url', content: settingStore.seoSetting?.canonicalUrl || settingStore.generalSetting?.siteUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: settingStore.openGraphSetting?.project.organization },

// --- Twitter Card ---
      { name: 'twitter:card', content: settingStore.openGraphSetting?.twitter.card },
      { name: 'twitter:site', content: settingStore.openGraphSetting?.twitter.site },
      { name: 'twitter:creator', content: settingStore.openGraphSetting?.twitter.creator },
      { name: 'twitter:title', content: settingStore.openGraphSetting?.og.title },
      { name: 'twitter:description', content: settingStore.openGraphSetting?.og.description },
      { name: 'twitter:image', content: settingStore.openGraphSetting?.og.image },

      // Theme colors
      { name: 'theme-color', content: settingStore.appearanceSetting?.metaThemeColor },
      { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: settingStore.appearanceSetting?.metaThemeColorDark }

    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settingStore.seoSetting?.metaTitle,
          "url": settingStore.seoSetting?.canonicalUrl,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": settingStore.generalSetting?.contactPhone,
            "email": settingStore.generalSetting?.contactEmail
          }
        })
      }
    ]
  })

  // ✅ Google Analytics
  if (settingStore.seoSetting?.enableGA && settingStore.seoSetting?.googleAnalyticsId) {
    useHead({
      script: [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${settingStore.seoSetting.googleAnalyticsId}`,
          async: true
        },
        {
          children: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settingStore.seoSetting.googleAnalyticsId}');
          `
        }
      ]
    })
  }

  // سایر fetch ها
  await categoryTypeStore.fetchType('document')
  await categoryTypeStore.fetchType('faq')
  await faqTypeStore.fetchType('hamian')
  await documentaryStore.fetchDocumentaries()
  await kindnessEventStore.fetchKindnessEvents()
  await supporterStore.fetchSupporters()

  const documentTypeId = categoryTypeStore.idBySlug('document')
  await categoryStore.fetchCategories({ typeId: String(documentTypeId) })
  const faqTypeId = categoryTypeStore.idBySlug('faq')
  await categoryStore.fetchCategories({ typeId: String(faqTypeId), contentType: 'hamian' })
})

watch(
    () => faqTypeStore.selectedType,
    async (type) => {
      if (type?.id) {
        await faqStore.fetchFaqs({ typeId: type.id })
      }
    },
    { immediate: true }
)
</script>
