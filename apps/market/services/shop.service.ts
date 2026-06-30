import type {MarketSettingsApiResponse, Shop, ShopRequest} from '../types/shop'
import {mockShops} from '../mocks/shops.mock'
import type {AxiosInstance} from 'axios'
import {useNuxtApp} from 'nuxt/app'
import {useUploader} from "../composables/useUploader";

export const ShopService = {
    USE_MOCK: false,

    get axios(): AxiosInstance {
        const {$axios} = useNuxtApp()
        return $axios as AxiosInstance
    },
    get uploader():useUploader{

        return useUploader()

    },

    async fetchShops(): Promise<any> {
        if (this.USE_MOCK) {
            await new Promise(r => setTimeout(r, 300))
            return mockShops
        }

        try {
            const {data} = await this.axios.get('/user/shops')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock shops')
            return mockShops
        }
    },
    async fetchShopSettings(shopId:string): Promise<MarketSettingsApiResponse> {

        try {
            const {data} = await this.axios.get<MarketSettingsApiResponse>(`/user/shops/${shopId}/settings`)
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock shops')
        }
    },

    async fetchRatingAndReviews(shopId:string):Promise<any>{

        if (this.USE_MOCK) {
            await new Promise(r => setTimeout(r, 300))
            return mockShops
        }

        try {
            const {data} = await this.axios.post(`/shops/${shopId}/rating/recalc`)
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock shops')
            return mockShops
        }

    },

    async fetchRequests(): Promise<ShopRequest[]> {
        /*if (this.USE_MOCK) {
            await new Promise(r => setTimeout(r, 300))
            return mockShops
        }*/

        try {
            const {data} = await this.axios.get<ShopRequest[]>('/user/shops/requests/me')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock shops')
            return mockShops
        }
    },

    /**
     * Prepare the shop creation request payload.
     * Uploads images and returns the final data object ready to be sent.
     */
    async prepareShopRequest(shopData: Partial<Shop>, documents: any): Promise<Partial<Shop>> {

        // 1. Handle Documents Upload
        const docsPayload: any = {}

        // لیست کلیدهای مدارک برای بررسی پویا
        const documentKeys = ['logo', 'license','degree', 'selfie','personalPhoto','environment','video']

        for (const key of documentKeys) {
            const doc = documents[key]
            // بررسی اینکه آیا فایل انتخاب شده است (نمونه فایل)
            if (doc?.thumbnail instanceof File) {
                console.log('doc',doc)
                try {
                    if(doc.thumbnail.type.startsWith('image/') ){
                        const url = await this.uploader.uploadImage(doc.thumbnail)
                        docsPayload[key] = {
                            thumbnail: url,
                            name: doc.name,
                            type: doc.type
                        }
                    }

                    if(doc.thumbnail.type.startsWith('video/')){
                        const url = await this.uploader.uploadVideo(doc.thumbnail)
                        docsPayload[key] = {
                            thumbnail: url,
                            name: doc.name,
                            type: doc.type
                        }
                    }
                } catch (error) {
                    console.error(`Failed to upload ${key}:`, error)
                    throw new Error(`آپلود فایل ${key} با مشکل مواجه شد`)
                }
            }
        }

        // 3. Return the prepared payload object
        return {
            ...shopData,
            documents: docsPayload
        }
    },

    /**
     * Send the prepared payload to the backend to create the shop
     */
    async submitShopRequest(payload: Partial<Shop>): Promise<any> {
        const {data} = await this.axios.post<Shop>('/user/shops/requests', payload)
        return data
    },

    /**
     * Update an existing shop request
     * Handles image uploads and data patching
     */
    async updateShopRequest(id: string, shopData: Partial<Shop>, documents: any): Promise<any> {
        // 1. Handle Documents Upload (فقط اگر فایل جدید انتخاب شده باشد)
        const docsPayload: any = {}

        // بررسی لوگو
        if (documents.logo instanceof File) {
            const logoUrl = await this.uploader.uploadImage(documents.logo)
            docsPayload.logo = {
                thumbnail: logoUrl,
                name: documents.logo.name,
                type: documents.logo.type
            }
        } else if (documents.logo) {
            //docsPayload.logo = documents.logo
        }

        // بررسی مجوز
        if (documents.license instanceof File) {
            const licenseUrl = await this.uploader.uploadImage(documents.license)
            docsPayload.license = {
                thumbnail: licenseUrl,
                name: documents.license.name,
                type: documents.license.type
            }
        } else if (documents.license) {
            //docsPayload.license = documents.license
        }

        // بررسی کارت ملی
        if (documents.nationalId instanceof File) {
            const nationalIdUrl = await this.uploader.uploadImage(documents.nationalId)
            docsPayload.nationalId = {
                thumbnail: nationalIdUrl,
                name: documents.nationalId.name,
                type: documents.nationalId.type
            }
        } else if (documents.nationalId) {
            //docsPayload.nationalId = documents.nationalId
        }

        // 2. ساخت Payload نهایی
        const payload = {
            ...shopData,
            // فقط اگر مدارکی تغییر کرده باشد آن‌ها را ارسال کن
            ...(Object.keys(docsPayload).length > 0 && { documents: docsPayload })
        }

        const {data} = await this.axios.patch<ShopRequest>(`/user/shops/requests/${id}`, payload)

        return data
    },

    /**
     * حذف فایل‌های آپلود شده در صورت بروز خطا (Rollback)
     */
    async cleanupFiles(fileUrls: string[]) {
        if (!fileUrls || fileUrls.length === 0) return;

        try {
            // فرض بر این است که اندپوینتی برای حذف فایل دارید
            // اگر اندپوینت ندارید، باید از تیم بک‌endid بخواهید آن را بسازند
            await this.axios.post('/v1/uploads/cleanup', { urls: fileUrls });
        } catch (e) {
            console.warn('⚠️ Failed to cleanup orphaned files:', e);
            // اینجا ارور را پرتاب نمی‌کنیم چون کاربر اصلی درگیر خطای اصلی است
        }
    }
}