import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { inject } from "vue"
import type { AxiosInstance } from 'axios';
import { axiosKey } from "../plugins/axiosPlugins";

export interface BankCard {
    id: string | number
    cardNumber: string
    iban: string
    bankName: string
    isDefault: boolean
    verified: boolean
}

export const useBankStore = defineStore("bank", () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State
    const cards = ref<BankCard[]>([])
    const loading = ref(false)
    const verifying = ref(false)

    // Getters
    const defaultCard = computed(() => cards.value.find(c => c.isDefault) || null)

    // Actions
    const fetchCards = async () => {
        loading.value = true
        try {
            const res = await axios.get("/market/shops/bank-cards")
            cards.value = res.data || []
        } catch (error) {
            console.error("Error fetching cards:", error)
        } finally {
            loading.value = false
        }
    }

    const addCard = async (cardData: { cardNumber?: string, iban: string }) => {
        verifying.value = true
        try {
            // ارسال درخواست به سرور برای استعلام و ثبت
            const res = await axios.post("/market/shops/bank-cards/add-card", cardData)

            const newCard: BankCard = {
                id: res.data.id,
                cardNumber: res.data.cardNumber || cardData.cardNumber || '',
                iban: res.data.iban,
                bankName: res.data.bankName || 'بانک نامشخص',
                isDefault: cards.value.length === 0, // اگر اولین کارت است پیش‌فرض شود
                verified: true
            }

            cards.value.push(newCard)
            return { success: true, data: newCard }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.message || 'خطا در ثبت کارت بانکی'
            }
        } finally {
            verifying.value = false
        }
    }

    const setDefaultCard = async (cardId: string | number) => {
        try {
            await axios.patch(`/market/shops/bank-cards/${cardId}/set-default`)
            // آپدیت لوکال
            cards.value.forEach(c => c.isDefault = (c.id === cardId))
            return { success: true }
        } catch (error) {
            return { success: false, error: 'خطا در تغییر کارت پیش‌فرض' }
        }
    }

    const removeCard = async (cardId: string | number) => {
        try {
            await axios.delete(`market/shops/bank-cards/${cardId}`)
            cards.value = cards.value.filter(c => c.id !== cardId)

            // اگر کارت پیش‌فرض حذف شد، یکی دیگری را پیش‌فرض کن
            if (cards.value.length > 0 && !cards.value.some(c => c.isDefault)) {
                cards.value[0].isDefault = true
            }
            return { success: true }
        } catch (error) {
            return { success: false, error: 'خطا در حذف کارت' }
        }
    }

    return {
        cards,
        loading,
        verifying,
        defaultCard,
        fetchCards,
        addCard,
        setDefaultCard,
        removeCard
    }
})