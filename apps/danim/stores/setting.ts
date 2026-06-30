import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "nuxt/app";

/* -------------------------------------------------
    Interfaces
--------------------------------------------------*/

// ---------------- General ----------------
export interface GeneralSetting {
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;

    contactEmail: string;
    contactPhone: string;

    language: string;
    timezone: string;

    postsPerPage: number;
    maxTitleLength: number;
    maxExcerptLength: number;

    enableComments: boolean;
    enableSearch: boolean;
    enableSharing: boolean;
    enableNotifications: boolean;
}

// ---------------- OpenGraph ----------------
export interface OpengraphSetting {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;

    siteName: string;
    locale: string;
    localeAlternate: string;
}

export interface ArticleSetting {
    author: string;
    publisher: string;
    section: string;
    tags: string;
}

export interface TwitterSetting {
    card: string;
    site: string;
    creator: string;
}

export interface SeoSettings {
    og: OpengraphSetting;
    article: ArticleSetting;
    twitter: TwitterSetting;
}

// ---------------- Schema.org ----------------
export interface SchemaSetting {
    organization: any;
    project: any;
    breadcrumb: any;
    faq: any;
    howto: any;
    event: any;
}

// ---------------- SEO ----------------
export interface SeoSetting {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    canonicalUrl: string;
    robots: string;
    allowIndexing: boolean;
    sitemapUrl: string;
    changefreq: string;

    structuredData: {
        article: boolean;
        rating: boolean;
        breadcrumb: boolean;
        organization: boolean;
    };

    googleAnalyticsId: string;
    enableGA: boolean;
    googleSearchConsoleCode: string;
}

// ---------------- Performance ----------------
export interface PerformanceSetting {
    imageOptimization: boolean;
    browserCache: boolean;
    lazyLoading: boolean;
    minifyAssets: boolean;
}
// ---------------- Page Sections ----------------
export interface Slide {
    title: string;
    subtitle: string;
    link: string;
    linkType: 'post' | 'category' | 'custom';
    buttonText: string;
    image: string;
    openInNewTab: boolean;
    active: boolean;
}

export interface SliderSection {
    id: number;
    type: 'slider';
    visible: boolean;
    expanded: boolean;
    description: string;
    data: {
        slides: Slide[];
        autoPlay: boolean;
        speed: number;
        height: number;
        showDots: boolean;
        showArrows: boolean;
        transition: 'fade' | 'slide';
    };
}

export interface BannerSection {
    id: number;
    type: 'banner';
    visible: boolean;
    expanded: boolean;
    description: string;
    data: {
        bannerType: 'gradient' | 'image' | string;
        title: string;
        subtitle: string;
        description: string;
        gradientStart: string;
        gradientEnd: string;
        gradientDirection: string;
        primaryButton: string | null;
        primaryLink: string;
        secondaryButton: string | null;
        secondaryLink: string;
        image: string;
        link: string;
        openInNewTab: boolean;
    };
}

export interface CategoriesSection {
    id: number;
    type: 'categories';
    visible: boolean;
    expanded: boolean;
    description: string;
    data: {
        title: string;
        count: number;
        layout: 'grid' | 'carousel' | 'list';
        selectedCategories: any[];
        showCount: boolean;
        showDescription: boolean;
    };
}

export interface PostsSection {
    id: number;
    type: 'posts';
    visible: boolean;
    expanded: boolean;
    description: string;
    data: {
        title: string;
        categoryId: string;
        count: number;
        layout: 'grid' | 'list';
    };
}

export interface HeaderSection {
    id: number;
    type: 'header';
    visible: boolean;
    expanded: boolean;
    description: string;
    data: {
        logo: string;
        logoLink: string;
        logoAlt: string;
        logoSize: number;
        bgColor: string;
        position: string;
        opacity: number;
        menuItems: any[];
    };
}

export interface FooterSection {
    id: number;
    type: 'footer';
    visible: boolean;
    expanded: boolean;
    description: string;
    data: {
        aboutTitle: string;
        aboutText: string;
        column1Title: string;
        column2Title: string;
        address: string;
        email: string;
        phone: string;
        footerLogo: string;
        instagram: string;
        telegram: string;
        twitter: string;
        linkedin: string;
        workingHours: string;
        quickLinks: any[];
    };
}

// ترکیب همه‌ی بخش‌ها
export type PageSection =
    | SliderSection
    | BannerSection
    | CategoriesSection
    | PostsSection
    | HeaderSection
    | FooterSection;


export const useSettingStore = defineStore('settingStore', () => {

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    /* ------------------ States -------------------*/
    const generalSetting = ref<GeneralSetting | null>(null)
    const openGraphSetting = ref<OpengraphSetting | null>(null)
    const schemaSetting = ref<SchemaSetting | null>(null)
    const seoSetting = ref<SeoSetting | null>(null)
    const performanceSetting = ref<PerformanceSetting | null>(null)
    const pageSections = ref<PageSection[]>([])
    const loading = ref(false)
    const fetched = ref(false)

    /* ------------------ Fetch Helpers -------------------*/
    const fetchGeneralSetting = async () => {
        try {
            const { data } = await axios.get('/danim-settings/general')
            generalSetting.value = data
        } catch (e) {
            console.error('Error fetching general settings:', e)
        }
    }

    /* ------------------ Fetch Helpers -------------------*/
    const fetchPerformanceSetting = async () => {
        try {
            const { data } = await axios.get('/danim-settings/performance')
            performanceSetting.value = data
        } catch (e) {
            console.error('Error fetching general settings:', e)
        }
    }

    const fetchOpenGraphSetting = async () => {
        try {
            const { data } = await axios.get('/danim-settings/opengraph')
            openGraphSetting.value = data
        } catch (e) {
            console.error('Error fetching OpenGraph settings:', e)
        }
    }

    const fetchSchemaSetting = async () => {
        try {
            const { data } = await axios.get('/danim-settings/schema')
            schemaSetting.value = data
        } catch (e) {
            console.error('Error fetching schema settings:', e)
        }
    }

    const fetchSeoSetting = async () => {
        try {
            const { data } = await axios.get('/danim-settings/seo')
            seoSetting.value = data
        } catch (e) {
            console.error('Error fetching SEO settings:', e)
        }
    }

    /* ------------------ Fetch All -------------------*/
    const fetchAll = async () => {
        if (fetched.value) return
        loading.value = true
        try {
            await Promise.all([
                fetchOpenGraphSetting(),
                fetchGeneralSetting(),
                fetchSchemaSetting(),
                fetchSeoSetting(),
                fetchPageSections()
            ])
            fetched.value = true
        } finally {
            loading.value = false
        }
    }
    function normalizePageSection(raw: any) {
        return {
            id: raw.id,
            type: raw.type,
            visible: raw.visible ?? true,
            expanded: raw.expanded ?? false,
            description: raw.description || "",
            data: raw.data ? { ...raw.data } : {}
        };
    }

    /* ------------------ Fetch ------------------- */
    const fetchPageSections = async () => {
        loading.value = true;
        try {
            const { data } = await axios.get('/danim-settings/page-sections')

            pageSections.value = data.pageSections.items.map((item: any) =>
                normalizePageSection(item)
            )

            console.log("Mapped page sections:", pageSections.value)

        } catch (e) {
            console.error("Error fetching page sections:", e)
        } finally {
            loading.value = false
        }
    }
    /* ------------------ Return -------------------*/
    return {
        generalSetting,
        pageSections,
        performanceSetting,
        openGraphSetting,
        schemaSetting,
        seoSetting,
        loading,
        fetched,

        fetchGeneralSetting,
        fetchOpenGraphSetting,
        fetchSchemaSetting,
        fetchSeoSetting,
        fetchAll,
        fetchPageSections,
        fetchPerformanceSetting,
    }
})