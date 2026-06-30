<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="pb-20 md:pb-0">
      <slot />
    </main>
    
    <!-- Desktop Footer -->
    <AppFooter class="hidden md:block" />
    
    <!-- Mobile Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">

import {useSettingStore} from "~/stores/setting.js";
import dayjs from "dayjs";
import 'dayjs/locale/fa'
const settingStore=useSettingStore()
useHead({
  title: settingStore.generalSetting?.siteTitle || 'پت دانیم',
  meta: [
    { name: 'description', content: settingStore.generalSetting?.siteDescription || '' },
    { property: 'og:site_name', content: settingStore.generalSetting?.siteTitle || '' },
    { property: 'og:url', content: settingStore.generalSetting?.siteUrl || '' },


    // Open Graph
    { property: 'og:title', content: settingStore.openGraphSetting?.og?.title },
    { property: 'og:description', content: settingStore.openGraphSetting?.og?.description },
    { property: 'og:image', content: settingStore.openGraphSetting?.og?.image },
    { property: 'og:url', content: settingStore.openGraphSetting?.og?.url },
    { property: 'og:type', content: settingStore.openGraphSetting?.og?.type },
    { property: 'og:site_name', content: settingStore.openGraphSetting?.og?.siteName },
    { property: 'og:locale', content: settingStore.openGraphSetting?.og?.locale },
    { property: 'og:locale:alternate', content: settingStore.openGraphSetting?.og?.localeAlternate },

    // Twitter Card
    { name: 'twitter:card', content: settingStore.openGraphSetting?.twitter?.card },
    { name: 'twitter:site', content: settingStore.openGraphSetting?.twitter?.site },
    { name: 'twitter:creator', content: settingStore.openGraphSetting?.twitter?.creator },

    // Article metadata
    { property: 'article:author', content: settingStore.openGraphSetting?.article?.author },
    { property: 'article:publisher', content: settingStore.openGraphSetting?.article?.publisher },
    { property: 'article:section', content: settingStore.openGraphSetting?.article?.section },
    { property: 'article:tag', content: settingStore.openGraphSetting?.article?.tags }
  ],

  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: settingStore.schemaSetting?.organization?.name,
        url: settingStore.schemaSetting?.organization?.url,
        logo: settingStore.schemaSetting?.organization?.logo,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: settingStore.schemaSetting?.organization?.phone,
          contactType: "customer service"
        }
      })
    },
    settingStore.schemaSetting?.article?.enabled
        ? {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            author: settingStore.schemaSetting?.article?.author,
            publisher: {
              "@type": "Organization",
              name: settingStore.schemaSetting?.article?.publisher
            }
          })
        }
        : undefined,
    settingStore.schemaSetting?.faq?.enabled
        ? {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": settingStore.schemaSetting.faq.items.map((item: any) => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }
        : undefined
  ]
})
dayjs.locale(settingStore.generalSetting?.language === 'فارسی' ? 'fa' : 'en')


onMounted(async () => {
  await settingStore.fetchGeneralSetting()
  await settingStore.fetchOpenGraphSetting()
  await settingStore.fetchSchemaSetting()
  await settingStore.fetchPerformanceSetting()
  console.log('performanceSetting',settingStore.performanceSetting)



  /*article: author: "تیم تحریریه دانیم"
    publisher: "دانیم"
    section: "مقالات آموزشی"
    tags: "حیوانات خانگی, آموزش, نگهداری"

    Og:description: "مرجع کامل آموزش و نگهداری از حیوانات خانگی با مقالات تخصصی"
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=630&fit=crop"
      locale: "fa_IR"
      localeAlternate: "en_US"
      siteName: "دانیم"
      title: "دانیم - دانشنامه حیوانات خانگی"
      type: "website"
      url: "https://danim.petoman.ir"

      twitter:card: "summary_large_image"
      creator: "@danim_ir"
      site: "@danim_ir"
      */

  /* contactEmail: "info@danim.ir"
 contactPhone: "021-12345678
 +enableComments: "true"
 +enableNotifications: "true"
 +enableSearch: "true"
 +enableSharing: "true"
 +language: "فارسی"
 +maxExcerptLength: "10"
 +maxTitleLength: "20"
 +postsPerPage: "12"
 +siteDescription: "مرجع کامل دانش و آموزش نگهداری از حیوانات خانگی با مقالات تخصصی"
 +siteTitle: "دانیم - دانشنامه حیوانات خانگی"
 +siteUrl: "https://petoman.com/danim"
 +timezone: "تهران (UTC+3:30)"*/

})
</script>
