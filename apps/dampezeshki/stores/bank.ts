import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";


export interface BankCard {
    id: string | number
    cardNumber: string
    iban: string
    bankName: string
    isDefault: boolean
    verified: boolean
}

export const useBankStore = defineStore("bank", () => {
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    // State
    const card = ref<BankCard>()
    const loading = ref(false)

    // Actions
    const fetchDefaultCardTenant = async (tenantId:string) => {
        loading.value = true
        try {
            const res = await axios.get(`user/tenants/${tenantId}/bank-cards`)
            card.value = res.data || []
        } catch (error) {
            console.error("Error fetching cards:", error)
        } finally {
            loading.value = false
        }
    }

    return {
        card,
        loading,
        fetchDefaultCardTenant,

    }
})