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
    logo:string
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export const useCategoryStore = defineStore('categoryStore', () => {
    // state
    const categories = ref<Category[]>([])
    const categoryTree = ref<Category[]>([])
    const selectedCategory = ref<Category | null>(null)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // fetch all categories flat
    const fetchCategories = async (filters?: { typeId?: string; contentType?: string; activeOnly?: boolean }) => {
        try {
            const { data } = await axios.get('/categories', { params: filters })

            categories.value = (data || []).map((c: any) => ({
                id: c.id,
                name: c.title,
                image:c.cover,
                color:c.color,
                description:c.description,
                slug:c.slug,
                icon: c.slug ?? 'default',   // اگر آیکون نداشت
                count: c.posts.length?.toString() ?? '0', // تبدیل به متن مثل نمونه تو
                href: `/categories/${c.slug || c.id}`,
            }))

            fetched.value = true

        } catch (error) {
            console.error('❌ خطا در دریافت دسته‌بندی‌ها:', error)
        }
    }

    // fetch tree by type
    const fetchCategoryTree = async (typeId?: string,contentType?:string) => {
        try {
            const { data } = await axios.get('/categories/tree', { params: { typeId,contentType } })
            categoryTree.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت درخت دسته‌بندی‌ها:', error)
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
    return {
        categories,
        categoryTree,
        selectedCategory,
        fetched,
        fetchCategories,
        fetchCategoryTree,
        fetchCategory,
    }
})