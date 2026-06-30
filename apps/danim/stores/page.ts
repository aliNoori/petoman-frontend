// stores/pageStore.ts
import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "nuxt/app";
export interface Page {
    id: number | string
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDescription?: string
    status: 'draft' | 'published'
    showInMenu: boolean
    featuredImage?: string
    createdAt: string
    updatedAt: string
    views: number
}

export const usePageStore = defineStore('pageStore', () => {
    const pages = ref<Page[]>([])
    const page = ref<Page>()
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    const fetchPage = async (id:string) => {
        try {
            const { data } = await axios.get(`/v1/pages/${id}`)
            page.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ Failed to fetch pages', error)
        }
    }

    const fetchPages = async () => {
        try {
            const { data } = await axios.get('/v1/danim-pages')
            pages.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ Failed to fetch pages', error)
        }
    }

    const getPageById = (id: string | number) =>
        pages.value.find(p => p.id === id)

    const publishedPages = computed(() => pages.value.filter(p => p.status === 'published').length)
    const totalPages = computed(() => pages.value.length)

    return {
        pages,
        page,
        fetched,
        fetchPages,
        fetchPage,
        getPageById,
        publishedPages,
        totalPages
    }
})