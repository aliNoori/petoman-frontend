// stores/categoryStore.ts
import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {AxiosInstance} from 'axios'
import {useNuxtApp} from "#app";

export interface Category {
    id: string
    title: string
    slug: string
    description?: string
    typeId?: string
    type?: { id: string; name: string; displayName?: string }
    parentId?: string | null
    parent?: Category | null
    children?: Category[]
    color:string
    cover:string
    icon:string
    logo:string
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export const useCategoryStore = defineStore('categoryStore', () => {
    // state
    const categoriesByType = ref<Record<string, Category[]>>({})
    const categoryTree = ref<Category[]>([])
    const selectedCategory = ref<Category | null>(null)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // fetch all categories flat
    const fetchCategories = async (filters?: { typeId?: string; contentType?: string; activeOnly?: boolean }) => {

        try {
            const { data } = await axios.get('/categories', { params: filters })
            const mapped = (data || []).map((c: any) => ({
                id: c.id,
                name: c.title,
                contentType:c.contentType,
                image: c.cover,
                color: c.color,
                description: c.description,
                slug: c.slug,
                icon: c.icon,
                count: c.documents?.length?.toString() ?? '0',
                href: `/categories/${c.slug || c.id}`,
                movie: c.movies.length??0,
                series: c.series.length??0,
                //animation: c.animation.length??0,
                documentary: c.documents.length??0,
                total: (c.movies?.length ?? 0) + (c.series?.length ?? 0) + (c.animation?.length ?? 0) + (c.documents?.length ?? 0)
            }))

            const key = filters?.contentType
                ? `${filters.typeId}_${filters.contentType}`
                : filters?.typeId || 'default'

            categoriesByType.value[key] = mapped
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت دسته‌بندی‌ها:', error)
        }
    }
    // fetch single category
    const fetchCategory = async (id: string) => {
        try {
            const { data } = await axios.get(`/categories/${id}`)
            selectedCategory.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت دسته‌بندی:', error)
        }
    }

    const getCategories = (typeId: string, contentType?: string) => {
        const key = contentType ? `${typeId}_${contentType}` : typeId
        return categoriesByType.value[key] || []
    }

    return {
        categoryTree,
        selectedCategory,
        fetched,
        categoriesByType,
        fetchCategories,
        fetchCategory,
        getCategories
    }
})