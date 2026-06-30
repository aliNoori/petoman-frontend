import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { safeStorage } from '~/utils/safeStorage'
import { useNuxtApp } from '#app'
import type { AxiosInstance } from 'axios'

export interface UserSettings {
    newFilmsNotification: boolean
    commentsNotification: boolean
    publicProfile: boolean
    showFavorites: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
    newFilmsNotification: true,
    commentsNotification: false,
    publicProfile: true,
    showFavorites: true
}

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS })
    const loading = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    /* -----------------------
     Load settings
    ----------------------- */
    const loadSettings = async () => {
        loading.value = true
        try {
            // 👉 اگر بک‌اند داری
             const res = await axios.get('/users/me/settings')
             settings.value = res.data

            // 👉 فعلاً از localStorage
            // const saved = safeStorage.getItem('user_settings')
            // if (saved) {
            //     settings.value = JSON.parse(saved)
            // }
        } catch (e) {
            console.error('Failed to load settings', e)
        } finally {
            loading.value = false
        }
    }

    /* -----------------------
     Update one setting
    ----------------------- */
    const updateSetting = <K extends keyof UserSettings>(
        key: K,
        value: UserSettings[K]
    ) => {
        settings.value[key] = value
        persist()
    }

    /* -----------------------
     Save all settings
    ----------------------- */
    const saveSettings = async () => {
        loading.value = true
        try {
            // 👉 بک‌اند
            await axios.patch('/users/me/settings', settings.value)

            persist()
        } catch (e) {
            console.error('Failed to save settings', e)
        } finally {
            loading.value = false
        }
    }

    /* -----------------------
     Helpers
    ----------------------- */
    const persist = () => {
        safeStorage.setItem('user_settings', JSON.stringify(settings.value))
    }

    const resetSettings = () => {
        settings.value = { ...DEFAULT_SETTINGS }
        persist()
    }

    return {
        settings,
        loading,
        loadSettings,
        updateSetting,
        saveSettings,
        resetSettings
    }
})