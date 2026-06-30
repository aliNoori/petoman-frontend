// stores/omdb.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFilmSettingStore } from './setting'
import { useNuxtApp } from '#app'
import type { AxiosInstance } from 'axios'

export const useOmdbStore = defineStore('omdb', () => {
    const settingStore = useFilmSettingStore()
    const enabled = ref(false)
    const apiKey = ref('')
    const client = ref<AxiosInstance | null>(null) // این اضافه شد

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    const init = async () => {
        await settingStore.fetchAll()

        if (!settingStore.settings?.api.omdb.enabled) {
            enabled.value = false
            console.warn('OMDB API is disabled')
            return
        }

        enabled.value = true
        apiKey.value = settingStore.settings.api.omdb.apiKey

        client.value = axios.create({
            baseURL: 'https://www.omdbapi.com/',
            params: {
                apikey: apiKey.value
            }
        })
    }

    const search = async (title: string) => {
        if (!enabled.value || !client.value) return null
        const res = await client.value.get('', { params: { s: title } })
        return res.data
    }

    const getById = async (imdbId: string) => {
        if (!enabled.value || !client.value) return null
        const res = await client.value.get('', { params: { i: imdbId } })
        return res.data
    }

    return {
        enabled,
        init,
        search,
        getById
    }
})