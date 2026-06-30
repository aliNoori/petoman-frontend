import type { AxiosInstance } from 'axios'
import { useNuxtApp } from 'nuxt/app'

export const PaymentService = {
    get axios(): AxiosInstance {
        const { $axios } = useNuxtApp()
        return $axios as AxiosInstance
    },

    /**
     * ثبت نوبت و پرداخت (کیف پول یا شروع پرداخت آنلاین)
     * این متد با اندپوینت submit کلینیک ارتباط برقرار می‌کند
     */
    async submitVetOrder(orderPayload: any): Promise<any> {
        try {
            // ارسال به اندپوینت اختصاصی کلینیک
            const { data } = await this.axios.post('/payments/vet-clinic/submit', orderPayload)
            return data
        } catch (e) {
            console.error('Vet order submission failed:', e)
            throw e
        }
    },

    async submitClinicOrder(orderPayload: any): Promise<any> {
        try {
            // ارسال به اندپوینت اختصاصی کلینیک
            const { data } = await this.axios.post('/payments/vet-clinic/submit', orderPayload)
            return data
        } catch (e) {
            console.error('Clinic order submission failed:', e)
            throw e
        }
    },

    async submitPharmacyOrder(orderPayload: any): Promise<any> {
        try {
            // ارسال به اندپوینت اختصاصی کلینیک
            const { data } = await this.axios.post('/payments/pharmacy/submit', orderPayload)
            return data
        } catch (e) {
            console.error('Vet order submission failed:', e)
            throw e
        }
    },

    /**
     * شروع پرداخت آنلاین (در صورت نیاز به مرحله جداگانه)
     * اگر بک‌اند مرحله پرداخت آنلاین را جدا کرده باشد از این استفاده می‌کنیم
     * اما در کد بک‌اند قبلی همه چیز در submit بود. این متد را برای احتیاط نگه می‌داریم.
     */
    async startVetOnlinePayment(payload: {
        orderId: string
        amount: number
        tenantId: string
        meta?: any
    }): Promise<any> {
        try {
            // اگر اندپوینت جداگانه‌ای برای شروع پرداخت آنلاین دارید اینجا آدرس دهید
            // در غیر این صورت submitVetOrder کافی است.
            const { data } = await this.axios.post('/payments/pay-vet-clinic', payload)
            return data
        } catch (e) {
            console.error('Starting vet online payment failed:', e)
            throw e
        }
    },

    async startClinicOnlinePayment(payload: {
        orderId: string
        amount: number
        tenantId: string
        meta?: any
    }): Promise<any> {
        try {
            // اگر اندپوینت جداگانه‌ای برای شروع پرداخت آنلاین دارید اینجا آدرس دهید
            // در غیر این صورت submitVetOrder کافی است.
            const { data } = await this.axios.post('/payments/pay-vet-clinic', payload)
            return data
        } catch (e) {
            console.error('Starting vet online payment failed:', e)
            throw e
        }
    },

    async startPharmacyOnlinePayment(payload: {
        orderId: string
        amount: number
        tenantId: string
        meta?: any
    }): Promise<any> {
        try {
            // اگر اندپوینت جداگانه‌ای برای شروع پرداخت آنلاین دارید اینجا آدرس دهید
            // در غیر این صورت submitVetOrder کافی است.
            const { data } = await this.axios.post('/payments/pay-pharmacy', payload)
            return data
        } catch (e) {
            console.error('Starting vet online payment failed:', e)
            throw e
        }
    },

    async startPharmacyWalletPayment(payload: {
        orderId: string
        amount: number
        tenantId: string
        meta?: any
    }): Promise<any> {
        try {
            // اگر اندپوینت جداگانه‌ای برای شروع پرداخت آنلاین دارید اینجا آدرس دهید
            // در غیر این صورت submitVetOrder کافی است.
            const { data } = await this.axios.post('/payments/pharmacy/pay-wallet-remaining', payload)
            return data
        } catch (e) {
            console.error('Starting vet online payment failed:', e)
            throw e
        }
    },
}