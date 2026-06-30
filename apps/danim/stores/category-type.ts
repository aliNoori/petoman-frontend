// stores/categoryTypeStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "#app";

export interface CategoryType {
    id: string
    name: string
    displayName?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export const useCategoryTypeStore = defineStore('categoryTypeStore', () => {
    const categoryTypes = ref<CategoryType[]>([])
    const selectedType = ref<CategoryType | null>(null)
    const fetched = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    // fetch all types
    const fetchTypes = async () => {
        try {
            const { data } = await axios.get('/category-types')
            categoryTypes.value = data
            fetched.value = true
        } catch (error) {
            console.error('❌ خطا در دریافت نوع دسته‌بندی‌ها:', error)
        }
    }

    // fetch single type
    const fetchType = async (name: string) => {
        try {
            const { data } = await axios.get(`/category-types/${name}`)
            selectedType.value = data
        } catch (error) {
            console.error('❌ خطا در دریافت نوع دسته‌بندی:', error)
        }
    }

    return {
        categoryTypes,
        selectedType,
        fetched,
        fetchTypes,
        fetchType,
    }
})