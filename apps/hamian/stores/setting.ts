// stores/settingStore.ts
import { defineStore } from 'pinia'
import {ref, toRaw} from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";

/* -------------------------------------------------
    Interfaces
--------------------------------------------------*/
export interface GeneralSetting {
    siteTitle: string
    siteDescription: string
    siteUrl: string

    contactEmail: string | null
    contactPhone: string | null

    language: string
    timezone: string

    projectsPerPage: number
    supportersPerPage: number
    donationsPerPage: number

    enableEmailNotifications: boolean
    enableSmsNotifications: boolean
    enableAutoReceipt: boolean
    enablePeriodicReports: boolean
}

export interface OpengraphSetting {
    title: string
    description: string
    image: string
    url: string
    type: string

    siteName: string
    locale: string
    localeAlternate: string

    // twitter
    twitterCard: string
    twitterSite: string
    twitterCreator: string

    // project defaults
    projectManager: string
    projectOrganization: string
    projectTags: string
    projectCategory: string
}

export interface PaymentSetting {
    gateway: string            // "zarinpal", "idpay", ...
    merchantId: string
    callbackUrl: string
    currency: string
    sandboxMode: boolean
}

export interface AppearanceSetting {
    metaThemeColor: string
    metaThemeColorDark: string
    logoUrl: string
    faviconUrl: string
}

export interface SchemaSetting {
    organization: any
    project: any
    breadcrumb: any
    faq: any
    howto: any
    event: any
}

export interface SeoSetting {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    canonicalUrl: string
    robots: string
    allowIndexing: boolean
    sitemapUrl: string
    changefreq: string
    structuredData: {
        charity: boolean
        person: boolean
        breadcrumb: boolean
        organization: boolean
    }
    googleAnalyticsId: string
    enableGA: boolean
    googleSearchConsoleCode: string
}

/* -------------------------------------------------
    Store
--------------------------------------------------*/
export const useSettingStore = defineStore('settingStore', () => {

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    /* ------------------ States -------------------*/
    /* ------------------ States -------------------*/
    const generalSetting = ref<GeneralSetting>({
        siteTitle: '',
        siteDescription: '',
        siteUrl: '',
        contactEmail: '',
        contactPhone: '',
        language: 'fa',
        timezone: 'Asia/Tehran',
        projectsPerPage: 12,
        supportersPerPage: 20,
        donationsPerPage: 50,
        enableEmailNotifications: false,
        enableSmsNotifications: false,
        enableAutoReceipt: false,
        enablePeriodicReports: false,
    })

    const openGraphSetting = ref<OpengraphSetting>({
        title: '',
        description: '',
        image: '',
        url: '',
        type: 'website',
        siteName: '',
        locale: 'fa_IR',
        localeAlternate: 'en_US',
        twitterCard: 'summary_large_image',
        twitterSite: '',
        twitterCreator: '',
        projectManager: '',
        projectOrganization: '',
        projectTags: '',
        projectCategory: '',
    })

    const paymentSetting = ref<PaymentSetting>({
        gateway: '',
        merchantId: '',
        callbackUrl: '',
        currency: 'IRR',
        sandboxMode: true,
    })

    const appearanceSetting = ref<AppearanceSetting>({
        metaThemeColor: '#ffffff',
        metaThemeColorDark: '#000000',
        logoUrl: '',
        faviconUrl: '',
    })

    const schemaSetting = ref<SchemaSetting>({
        organization: { enabled: false, name: '', url: '', logo: '', phone: '' },
        project: { enabled: false, manager: '', organization: '' },
        breadcrumb: { enabled: false },
        faq: { enabled: false, items: [] },
        howto: { enabled: false },
        event: { enabled: false },
    })

    const seoSetting = ref<SeoSetting>({
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        canonicalUrl: '',
        robots: 'index, follow',
        allowIndexing: true,
        sitemapUrl: '',
        changefreq: 'daily',
        structuredData: {
            charity: false,
            person: false,
            breadcrumb: false,
            organization: false,
        },
        googleAnalyticsId: '',
        enableGA: false,
        googleSearchConsoleCode: '',
    })

    const loading = ref(false)
    const fetched = ref(false)

    /* ------------------ Fetch -------------------*/
    const fetchGeneralSetting = async () => {
        try {
            const { data } = await axios.get('/settings/general')
            generalSetting.value = data
        } catch (e) {
            console.error('Error fetching general settings:', e)
        }
    }

    const fetchOpenGraphSetting = async () => {
        try {
            const { data } = await axios.get('/settings/open-graph')
            openGraphSetting.value = data
        } catch (e) {
            console.error('Error fetching OpenGraph settings:', e)
        }
    }

    const fetchAppearanceSetting = async () => {
        try {
            const { data } = await axios.get('/settings/appearance')
            appearanceSetting.value = data
        } catch (e) {
            console.error('Error fetching appearance settings:', e)
        }
    }

    const fetchSchemaSetting = async () => {
        try {
            const { data } = await axios.get('/settings/schema')
            schemaSetting.value = data
        } catch (e) {
            console.error('Error fetching schema settings:', e)
        }
    }

    const fetchSeoSetting = async () => {
        try {
            const { data } = await axios.get('/settings/seo')
            seoSetting.value = data
        } catch (e) {
            console.error('Error fetching SEO settings:', e)
        }
    }

    const fetchAll = async () => {
        if (fetched.value) return
        loading.value = true
        try {
            await Promise.all([
                fetchGeneralSetting(),
                fetchOpenGraphSetting(),
                fetchAppearanceSetting(),
                fetchSchemaSetting(),
                fetchSeoSetting()
            ])
            fetched.value = true
        } finally {
            loading.value = false
        }
    }

    return {
        generalSetting,
        openGraphSetting,
        paymentSetting,
        appearanceSetting,
        schemaSetting,
        seoSetting,
        loading,
        fetched,

        fetchGeneralSetting,
        fetchOpenGraphSetting,
        fetchAppearanceSetting,
        fetchSchemaSetting,
        fetchSeoSetting,
        fetchAll,
    }
})