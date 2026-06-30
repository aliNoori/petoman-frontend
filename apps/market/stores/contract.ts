import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";


export interface AuditLog {
    userId: string | number
    acceptedIp: string
    contractVersion: string
    userAgent:string
    commissionRate:string|number
}

export const useContractStore = defineStore("contract", () => {
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    // State
    const auditLog = ref<AuditLog>()
    const loading = ref(false)

    // Actions
    const fetchAuditLogContract = async () => {
        loading.value = true
        try {
            const res = await axios.get(`contracts/user/audit-log`)
            auditLog.value = res.data || []
        } catch (error) {
            console.error("Error fetching cards:", error)
        } finally {
            loading.value = false
        }
    }

    return {
        auditLog,
        loading,
        fetchAuditLogContract,

    }
})