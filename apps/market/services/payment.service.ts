import type {AxiosInstance} from 'axios'
import {useNuxtApp} from 'nuxt/app'

export const PaymentService = {
    get axios(): AxiosInstance {
        const {$axios} = useNuxtApp()
        return $axios as AxiosInstance
    },

    /**
     * Pay with wallet
     * Sends the full order object to backend to create order and deduct balance
     */
    async submitPaymentOrder(orderPayload: any): Promise<any> {
        const {data} = await this.axios.post('/payments/market/submit', orderPayload)
        return data
    },
    async startMarketPayment(payload: {
        orderId: string
        amount: number
        tenantId: string
        meta?: any
    }): Promise<any> {
        try {
            const {data} = await this.axios.post('/payments/pay-market', payload)
            return data
        } catch (e) {
            console.error('Starting online payment failed:', e)
            throw e
        }
    },
}