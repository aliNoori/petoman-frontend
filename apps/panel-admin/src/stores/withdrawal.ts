import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { inject } from "vue"
import type { AxiosInstance } from 'axios';
import { axiosKey } from "../plugins/axiosPlugins";

export interface WithdrawalRequest {
    id: string | number
    amount: number
    accountNumber: string // شماره شبا یا کارت
    status: 'pending' | 'processing' | 'completed' | 'rejected'
    date: string
    time: string
    note?: string
    bankName?: string
}

export const useWithdrawalStore = defineStore("withdrawal", () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State
    const withdrawals = ref<WithdrawalRequest[]>([])
    const loading = ref(false)

    // Getters
    const pendingWithdrawals = computed(() =>
        withdrawals.value.filter(w => w.status === 'pending' || w.status === 'processing')
    )

    const pendingAmount = computed(() =>
        pendingWithdrawals.value.reduce((sum, w) => sum + w.amount, 0)
    )

    const pendingCount = computed(() => pendingWithdrawals.value.length)

    // Actions
    const fetchWithdrawals = async () => {
        loading.value = true
        try {
            const res = await axios.get("/market/wallet/withdrawals")
            // مپ کردن داده‌های دریافتی از API به ساختار داخلی
            withdrawals.value = (res.data || []).map((item: any) => ({
                id: item.id,
                amount: parseFloat(item.amount),
                accountNumber: item.destinationAccount || item.iban || 'N/A',
                status: item.status,
                date: new Date(item.createdAt).toLocaleDateString('fa-IR'),
                time: new Date(item.createdAt).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}),
                note: item.note
            }))
        } catch (error) {
            console.error("Error fetching withdrawals:", error)
        } finally {
            loading.value = false
        }
    }
    const fetchShopsWithdrawals = async () => {
        loading.value = true
        try {
            const res = await axios.get("/admin/shops/withdrawals")
            // مپ کردن داده‌های دریافتی از API به ساختار داخلی
            withdrawals.value = (res.data || []).map((item: any) => ({
                id: item.id,
                name:item.tenant.name,
                type:item.tenant.type.toLowerCase(),
                amount: parseFloat(item.amount),
                trackingCode:item.trackId,
                bank:item.bankName,
                cardNumber:item.cardNumber,
                iban:item.iban,
                availableBalance:item.wallet.balance,
                totalWithdrawn:item.totalWithdrawn||0,//TODO:add to response api
                accountNumber: item.destinationAccount || item.iban || 'N/A',
                status: item.status,
                date: new Date(item.createdAt).toLocaleDateString('fa-IR'),
                time: new Date(item.createdAt).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}),
                note: item.note
            }))
        } catch (error) {
            console.error("Error fetching withdrawals:", error)
        } finally {
            loading.value = false
        }
    }

    const createWithdrawalRequest = async (payload: { amount: number, cardId: string, note?: string }) => {
        try {
            const res = await axios.post("/market/wallet/withdrawals", payload)

            // افزودن دستی به لیست برای آپدیت سریع UI (قبل از رفرش)
            const newRequest: WithdrawalRequest = {
                id: res.data.id, // یا یک ID موقت
                amount: payload.amount,
                accountNumber: 'IR************', // باید از استور بانک پر شود
                status: 'pending',
                date: new Date().toLocaleDateString('fa-IR'),
                time: new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'}),
                note: payload.note
            }

            withdrawals.value.unshift(newRequest)
            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.message || 'خطا در ثبت درخواست تسویه'
            }
        }
    }

    // در داخل export const useWithdrawalStore
    const approveWithdrawal = async (id: string | number, trackId: string, date: string,status:string) => {
        try {
            // ارسال شماره پیگیری و تاریخ به سرور
            await axios.patch(`/admin/shops/withdrawals/${id}`, {
                status: status,
                trackId: trackId,      // شماره پیگیری
                paidAt: date           // تاریخ واریز
            })

            // حذف از لیست لوکال
            const index = withdrawals.value.findIndex(w => w.id === id)
            if (index !== -1) {
                withdrawals.value.splice(index, 1)
            }
            return { success: true }
        } catch (error) {
            console.error("Error approving withdrawal:", error)
            return { success: false }
        }
    }

    const rejectWithdrawal = async (id: string | number, rejectionReason: string) => {
        try {
            // فراخوانی API رد (طبق بک‌ند شما باید status را به rejected تغییر دهد و دلیل را ارسال کند)
            await axios.patch(`/admin/shops/withdrawals/${id}`, { status: 'rejected', rejectionReason: rejectionReason })

            // حذف از لیست لوکال
            const index = withdrawals.value.findIndex(w => w.id === id)
            if (index !== -1) {
                withdrawals.value.splice(index, 1)
            }
            return { success: true }
        } catch (error) {
            console.error("Error rejecting withdrawal:", error)
            return { success: false }
        }
    }
    return {
        withdrawals,
        loading,
        pendingAmount,
        pendingCount,
        fetchWithdrawals,
        fetchShopsWithdrawals,
        createWithdrawalRequest,
        approveWithdrawal,
        rejectWithdrawal
    }
})