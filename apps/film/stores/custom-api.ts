// stores/custom-api.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFilmSettingStore } from './setting'
import type { AxiosInstance } from 'axios'
import {useNuxtApp} from "nuxt/app";

interface CustomApiConfig {
    name: string
    baseUrl: string
    apiKey?: string
    enabled: boolean
    headerName?: string
    headerValue?: string
}

export const useCustomApiStore = defineStore('customApi', () => {
    const settingStore = useFilmSettingStore()
    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance
    const apis = ref<Record<string, AxiosInstance>>({})

    const init = async () => {
        await settingStore.fetchAll()
        const configs: CustomApiConfig[] = settingStore.settings?.api.customApis ?? []

        const result: Record<string, AxiosInstance> = {}

        configs.forEach(api => {
            if (!api.enabled) return

            const headers: Record<string, string> = {}
            if (api.headerName && api.headerValue) {
                headers[api.headerName] = api.headerValue.replace('{apiKey}', api.apiKey ?? '')
            }

            result[api.name] = axios.create({
                baseURL: api.baseUrl,
                headers
            })
        })

        apis.value = result
    }

    const getApi = (name: string) => apis.value[name] || null

    return {
        apis,
        init,
        getApi
    }
})
