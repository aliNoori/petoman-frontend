import { defineStore } from 'pinia'

export interface Banner {
    id: string
    title: string
    description?: string
    ctaText: string
    link: string
    badge: string
    icon: string
    gradientFrom: string
    gradientTo: string
    image: string
    bgClass?: string
    categorySlug?: string // اگر بخوای بنر به یک دسته خاص وصل باشه
}

export const useBannerStore = defineStore('banner', {
    state: () => ({
        banners: [] as Banner[]
    }),

    actions: {
    },

    getters: {
        allBanners: (state) => state.banners,
        bannersByCategory: (state) => {
            return (slug: string) => state.banners.filter(b => b.categorySlug === slug)
        }
    }
})
