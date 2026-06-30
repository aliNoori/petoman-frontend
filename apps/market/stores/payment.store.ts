import {defineStore} from 'pinia'
import {ref} from 'vue'
import {PaymentService} from "../services/payment.service";

export const usePaymentStore = defineStore('paymentStore', () => {
    // ────────────── State ──────────────
    const loading = ref(false)
    const fetched = ref(false)


    // ────────────── Actions ──────────────
    const submitPaymentOrder = async (order: any) => {

        const response = await PaymentService.submitPaymentOrder(order)
        fetched.value = true
        return response


    }
    const initiateMarketPayment = async (payload: { orderId: string, amount: number, tenantId: string, meta?: any }) => {
        loading.value = true
        try {
            // فراخوانی متد جدید در سرویس که به اندپوینت pay-market وصل می‌شود
            return await PaymentService.startMarketPayment(payload)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        fetched,

        initiateMarketPayment,
        submitPaymentOrder,

    }
})