import type {TenantRequest,Tenant,TenantSpecialty,ClinicService} from "~/stores/request";
import type { AxiosInstance } from 'axios'
import { useNuxtApp } from 'nuxt/app'
import { useUploader } from "~/composables/useUploader";

export const TenantService = {
    get axios(): AxiosInstance {
        const { $axios } = useNuxtApp()
        return $axios as AxiosInstance
    },

    get uploader(): ReturnType<typeof useUploader> {
        return useUploader()
    },
    async fetchTenants() : Promise<Tenant[]> {

        try {
            const { data } =await this.axios.get<Tenant[]>('/user/tenants/allTenant'); // آدرس اندپوینت خود را بگذارید
            return data
        } catch (err: any) {
            console.error('Error fetching tenants:', err);
        }
    },

    async fetchRequests(): Promise<TenantRequest[]> {
        try {
            const { data } = await this.axios.get<TenantRequest[]>('/user/tenants/requests/me')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock data')
        }
    },

    async fetchSpecialties(): Promise<TenantSpecialty[]> {
        try {
            const { data } = await this.axios.get<TenantSpecialty[]>('/user/tenants/specialties')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock data')
        }
    },

    async fetchServices(): Promise<ClinicService[]> {
        try {
            const { data } = await this.axios.get<ClinicService[]>('/user/tenants/services')
            return data
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock data')
        }
    },

    /**
     * آماده‌سازی درخواست Tenant (آپلود تصاویر و ساخت Payload)
     * این متد برای هر سه نوع دامپزشک، کلینیک و داروخانه کار می‌کند.
     */
    async prepareTenantRequest(tenantData: Partial<Tenant>, documents: any): Promise<Partial<Tenant>> {
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

        return {
            ...tenantData,
            documents: docsPayload
        }
    },

    /**
     * ارسال نهایی درخواست به سرور
     */
    async submitTenantRequest(payload: Partial<Tenant>): Promise<any> {
        const { data } = await this.axios.post<Tenant>('/user/tenants/requests', payload)
        return data
    },

    /**
     * ویرایش درخواست موجود
     */
    async updateTenantRequest(id: string, tenantData: Partial<Tenant>, documents: any): Promise<any> {
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

        const payload = {
            ...tenantData,
            ...(Object.keys(docsPayload).length > 0 && { documents: docsPayload })
        }

        const { data } = await this.axios.patch<TenantRequest>(`/user/tenants/requests/${id}`, payload)
        return data
    },

    /**
     * پاکسازی فایل‌های آپلود شده در صورت بروز خطا
     */
    async cleanupFiles(fileUrls: string[]) {
        if (!fileUrls || fileUrls.length === 0) return;
        try {
            await this.axios.post('/v1/uploads/cleanup', { urls: fileUrls });
        } catch (e) {
            console.warn('⚠️ Failed to cleanup orphaned files:', e);
        }
    }
}