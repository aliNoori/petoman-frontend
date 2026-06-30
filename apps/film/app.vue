<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">

import {onMounted, computed, watch,ref} from "vue";
import {useCategoryTypeStore} from "~/stores/category-type";
import {useCategoryStore} from "~/stores/category";
import {useMovieStore} from "~/stores/movie";
import {useSeriesStore} from "~/stores/series";
import {useAuthStore} from "~/stores/auth";
import {useMediaStore} from "~/stores/media";
import {useFaqTypeStore} from "~/stores/faq-type";
import {useFaqStore} from "~/stores/faq";
import {useFilmSettingStore} from "~/stores/setting";
import { useHead} from "nuxt/app";


const categoryTypeStore=useCategoryTypeStore()
const categoryStore=useCategoryStore()
const faqTypeStore=useFaqTypeStore()
const faqStore=useFaqStore()
const movieStore=useMovieStore()
const seriesStore=useSeriesStore()
const auth = useAuthStore()
const mediaStore=useMediaStore()
const settingStore=useFilmSettingStore()
const general = computed(() => settingStore.settings?.general)

onMounted(async () => {
  await settingStore.fetchAll()

  auth.hydrateToken()
  await auth.fetchUser()

  await mediaStore.fetchWatched()
  await movieStore.fetchMovies()
  await seriesStore.fetchSeries()

  await categoryTypeStore.fetchType('film')
  const filmTypeId = categoryTypeStore.idBySlug('film')
  await categoryStore.fetchCategories({ typeId: String(filmTypeId) })

  await faqTypeStore.fetchType('film')


  const adv = settingStore.settings?.advanced
  if (!adv) return

  const inject = (id: string, html: string, target: 'head' | 'body') => {
    if (!html || document.getElementById(id)) return
    const el = document.createElement('div')
    el.id = id
    el.innerHTML = html
    document[target].appendChild(el)
  }

  inject('ga-script', adv.googleAnalytics, 'head')
  inject('gtm-script', adv.googleTagManager, 'head')
  inject('fb-pixel', adv.facebookPixel, 'head')
  inject('custom-head', adv.customHead, 'head')
  inject('custom-body', adv.customBody, 'body')
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
useHead(() => {
  const seo = settingStore.settings?.seo
  const og = settingStore.settings?.opengraph
  const social = settingStore.settings?.social
  const g = settingStore.settings?.general

  const sameAs = social
      ? Object.values(social)
          .filter(Boolean)
          .map(url =>
              url.startsWith('http') ? url : `https://${url}`
          )
      : []

  return {
    // ---------- General ----------
    title: seo?.metaTitle ?? g?.siteName ?? 'نام سایت',

    htmlAttrs: {
      lang: g?.language ?? 'fa'
    },

    link: [
      ...(g?.favicon
          ? [{ rel: 'icon', type: 'image/png', href: g.favicon }]
          : []),

      ...(seo?.canonicalUrl
          ? [{ rel: 'canonical', href: seo.canonicalUrl }]
          : [])
    ],

    meta: [
      // ---------- SEO ----------
      {
        name: 'description',
        content:
            seo?.metaDescription ??
            g?.description ??
            'توضیحات پیش‌فرض سایت'
      },
      {
        name: 'keywords',
        content: seo?.keywords ?? 'فیلم، سریال، مستند'
      },
      {
        name: 'robots',
        content: 'index, follow'
      },

      // ---------- OpenGraph ----------
      {
        property: 'og:title',
        content: og?.title ?? seo?.metaTitle ?? g?.siteName
      },
      {
        property: 'og:description',
        content:
            og?.description ??
            seo?.metaDescription ??
            g?.description
      },
      {
        property: 'og:image',
        content: og?.image ?? g?.logo ?? '/default-og.jpg'
      },
      {
        property: 'og:type',
        content: og?.type ?? 'website'
      }
    ],

    // ---------- Social / Schema ----------
    script: sameAs.length
        ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: g?.siteName ?? 'نام سایت',
              url: 'https://site.com',
              sameAs
            })
          }
        ]
        : []
  }
})



</script>


