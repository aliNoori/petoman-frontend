import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PaymentService} from "~/services/payment.service";

export const usePaymentStore = defineStore('paymentStore', () => {
    // ────────────── State ──────────────
    const loading = ref(false)
    const fetched = ref(false)

    // ────────────── Actions ──────────────

    /**
     * ثبت نوبت کلینیک
     * این متد هم برای کیف پول و هم برای شروع پرداخت آنلاین استفاده می‌شود
     */
    const submitVetOrder = async (order: any) => {
        loading.value = true
        try {
            const response = await PaymentService.submitVetOrder(order)
            fetched.value = true
            return response
        } finally {
            loading.value = false
        }
    }

    const submitClinicOrder = async (order: any) => {
        loading.value = true
        try {
            const response = await PaymentService.submitClinicOrder(order)
            fetched.value = true
            return response
        } finally {
            loading.value = false
        }
    }

    const submitPharmacyOrder = async (order: any) => {
        loading.value = true
        try {
            const response = await PaymentService.submitPharmacyOrder(order)
            fetched.value = true
            return response
        } finally {
            loading.value = false
        }
    }

    /**
     * پرداخت آنلاین (اختیاری - اگر نیاز به مرحله جداگانه باشد)
     */
    const initiateVetOnlinePayment = async (payload: { orderId: string, amount: number, tenantId: string, meta?: any }) => {
        loading.value = true
        try {
            return await PaymentService.startVetOnlinePayment(payload)
        } finally {
            loading.value = false
        }
    }

    const initiateClinicOnlinePayment = async (payload: { orderId: string, amount: number, tenantId: string, meta?: any }) => {
        loading.value = true
        try {
            return await PaymentService.startClinicOnlinePayment(payload)
        } finally {
            loading.value = false
        }
    }

    const initiatePharmacyOnlinePayment = async (payload: { orderId: string, amount: number, tenantId: string, meta?: any }) => {
        loading.value = true
        try {
            return await PaymentService.startPharmacyOnlinePayment(payload)
        } finally {
            loading.value = false
        }
    }

    const pharmacyWalletRemainingPayment = async (payload: { orderId: string, amount: number, tenantId: string, meta?: any }) => {
        loading.value = true
        try {
            return await PaymentService.startPharmacyWalletPayment(payload)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        fetched,
        submitVetOrder,
        submitClinicOrder,
        submitPharmacyOrder,
        initiateVetOnlinePayment,
        initiateClinicOnlinePayment,
        initiatePharmacyOnlinePayment,
        pharmacyWalletRemainingPayment
    }
})