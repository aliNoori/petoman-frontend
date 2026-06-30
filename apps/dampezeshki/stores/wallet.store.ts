import {defineStore} from "pinia"
import {safeStorage} from "~/utils/safeStorage"
import {ref, computed} from "vue";
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";

export interface WalletTransaction {
    id: string
    type: string // 'inc' برای افزایش, 'dec' برای برداشت
    description: string
    amount: number
    createdAt: string
}

export interface UserWallet {
    id: string
    balance: number
    transactions: WalletTransaction[]
    createdAt: string
}

export const useWalletStore = defineStore("wallet", () => {
    const wallet = ref<UserWallet | null>(null)
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance
    const loading = ref(false)

    const fetchWalletUser = async () => {
        loading.value = true
        try {
            const res = await axios.get("/wallet/me")
            wallet.value = res.data
            safeStorage.setItem("wallet_user", JSON.stringify(res.data))
        } catch (err) {
            console.error("Failed to fetch wallet user:", err)
            //logout()
        } finally {
            loading.value = false
        }
    }


    const increaseWalletBalance = async (amount, meta = {}) => {
        loading.value = true
        try {
            // ارسال amount و meta به سرور
            const res = await axios.post("/payments/pay-wallet", {
                amount,
                meta  // متا اینجا ارسال می‌شود
            })

            // بازگرداندن لینک پرداخت
            return res.data
        } catch (err) {
            console.error("Failed to increase wallet:", err)
            throw err
        } finally {
            loading.value = false
        }
    }

// --- تابع جدید: برداشت وجه ---
    const withdrawWalletBalance = async (amount: number) => {
        loading.value = true
        try {
            // ارسال درخواست به سرور برای ثبت درخواست برداشت
            const res = await axios.post("/wallet/withdraw", { amount })

            // ✅ برای برداشت، چون درگاه بانکی در کار نیست (یا اگر هست منطقش جدا است)،
            // می‌توانید بلافاصله موجودی را کم کنید (اگر سرور تایید کرده باشد).
            // اما بهترین کار این است که صبر کنید تا سرور تایید کند و سپس دیتا را رفرش کنید.
            // برای اطمینان، بهتر است اینجا هم دست نزنید و اجازه دهید fetchWalletUser کار کند.

            return res.data
        } catch (err) {
            console.error("Failed to withdraw wallet:", err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        wallet,
        loading,
        fetchWalletUser,
        increaseWalletBalance,
        withdrawWalletBalance,
    }
})