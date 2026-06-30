import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import { useNuxtApp } from '#app'

export interface CategoryType {
    id: string
    name: string
    displayName?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export const useCategoryTypeStore = defineStore('categoryTypeStore', () => {

    const typesBySlug = ref<Record<string, CategoryType>>({})
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance


    const fetchTypes = async () => {
        try {
            const { data } = await axios.get('/category-types')
            // فرض: data یک آرایه از CategoryType است
            data.forEach((type: CategoryType) => {
                typesBySlug.value[type.name] = type
            })
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت نوع دسته‌بندی‌ها:', error)
        }
    }

    // گرفتن یک type بر اساس slug
    const fetchType = async (name: string) => {
        try {
            const { data } = await axios.get(`/category-types/${name}`)
            typesBySlug.value[name] = data
        } catch (error) {
            console.error(`❌ خطا در دریافت نوع دسته‌بندی "${name}":`, error)
        }
    }

    // دسترسی سریع به type یا id بر اساس slug
    const typeBySlug = (slug: string): CategoryType | null =>
        typesBySlug.value[slug] || null

    const idBySlug = (slug: string): string | null =>
        typesBySlug.value[slug]?.id || null

    return {
        typesBySlug,
        fetched,
        fetchTypes,
        fetchType,
        typeBySlug,
        idBySlug
    }
})