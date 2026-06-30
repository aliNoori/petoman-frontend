// services/ProductService.ts
import type { AxiosInstance } from 'axios'
import { useNuxtApp } from 'nuxt/app'
import {Category} from "../types/category";

export const CategoryService = {
    USE_MOCK: false, // toggle for dev/prod

    // Get Axios instance
    get axios(): AxiosInstance {
        const { $axios } = useNuxtApp()
        return $axios as AxiosInstance
    },

    // Fetch product list
    async fetchCategories(): Promise<Category[]> {
        try {
            const { data } = await this.axios.get<Category[]>('/user/market/categories/with-products')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock products')
            return null
        }
    },
}
