import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import type { AxiosInstance } from 'axios'

export interface ReportPayload {
    mediaId: string
    mediaType: 'movie' | 'episode'
    problemType: string
    description: string
}

export const useReportStore = defineStore('report', () => {
    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    const sendReport = async (payload: ReportPayload) => {
        try {
            const { data } = await axios.post('/reports', payload)
            return data
        } catch (error: any) {
            throw error?.response?.data || error
        }
    }

    return {
        sendReport,
    }
})
