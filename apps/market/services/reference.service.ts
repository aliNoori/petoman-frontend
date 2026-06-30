import type { AxiosInstance } from 'axios'
import { useNuxtApp } from 'nuxt/app'

export const ReferenceService = {

    get axios(): AxiosInstance {
        const { $axios } = useNuxtApp()
        return $axios as AxiosInstance
    },

    async fetchAnimals(): Promise<any> {
        try {
            const { data } = await this.axios.get('/reference/animals');
            return data
        } catch (error) {
            console.error('Error fetching animals:', error);
            throw error; // پرتاب خطا برای هندلینگ در استور
        }
    },

    async fetchBrands(): Promise<any> {
        try {
            const { data } = await this.axios.get('/reference/brands');
            return data
        } catch (error) {
            console.error('Error fetching brands:', error);
            throw error;
        }
    },

    async fetchAttributes(): Promise<any> {
        try {
            const { data } = await this.axios.get('/reference/attributes');
            return data
        } catch (error) {
            console.error('Error fetching attributes:', error);
            throw error;
        }
    },
}