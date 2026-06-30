// services/ProductService.ts
import type { Product } from '../types/product'
import type { ProductDetail } from '../types/product-detail'
import { mockProducts } from '../mocks/products.mock'
import type { AxiosInstance } from 'axios'
import { useNuxtApp } from 'nuxt/app'

export const ProductService = {
    USE_MOCK: false, // toggle for dev/prod

    // Get Axios instance
    get axios(): AxiosInstance {
        const { $axios } = useNuxtApp()
        return $axios as AxiosInstance
    },

    // Fetch product list
    async fetchProducts(): Promise<any[]> {
        if (this.USE_MOCK) {
            await new Promise(r => setTimeout(r, 300)) // simulate network delay
            return mockProducts
        }

        try {
            const { data } = await this.axios.get<any[]>('/user/products')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock products')
            //return mockProducts
        }
    },
    // Fetch product list
    async submitProductReview(productId:string,payload:any): Promise<any> {

        try {
            const { data } = await this.axios.post(`/products/${productId}/reviews`,
                payload)
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed')
        }
    },

    // Fetch bestSelling products
    async fetchBestSellingProducts(): Promise<any[]> {

        try {
            // آدرس باید با اندپوینت بک‌اند مطابقت داشته باشد
            const { data } = await this.axios.get<any[]>('orders/products/best-selling');
            return data;
        } catch (e) {
            console.warn('⚠️ Failed to fetch best selling products', e);
            return [];
        }
    },

    // Toggle Like/Dislike
    async toggleLike(productId: string, isLike: boolean): Promise<any> {
        try {
            const { data } = await this.axios.post(`/user/products/${productId}/like`, {
                isLike: isLike
            });
            return data;
        } catch (e) {
            console.warn('⚠️ Failed to toggle like', e);
            throw e;
        }
    },

    // Get Like Status
    async getLikeStatus(productId: string): Promise<any> {
        try {
            const { data } = await this.axios.get(`/user/products/${productId}/like-status`);
            return data;
        } catch (e) {
            console.warn('⚠️ Failed to fetch like status', e);
            // در صورت خطا وضعیت پیش‌فرض برگردانده می‌شود
            return { liked: false, disliked: false };
        }
    },
    async toggleReviewReaction ({ reviewId, type }) {
        try {
            const { data } = await this.axios.patch(`/products/${reviewId}/reviews/reaction`, { type });

            return data;
        } catch (error) {
            console.error('Error toggling reaction:', error);
            throw error;
        }
    }
}
