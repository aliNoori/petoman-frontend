import { defineNuxtPlugin } from 'nuxt/app'
import { useAuthStore} from "~/stores/auth";
import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    //const config = useRuntimeConfig()
    const api = axios.create({baseURL:import.meta.env.VITE_API_URL})

    api.interceptors.request.use((config:any) => {
        const authStore = useAuthStore()

        authStore.hydrateToken() // Restore token on page load

        const token = authStore.token


        if (token) {
            config.headers['Authorization'] = `Bearer ${token}` // Set Authorization header if token exists
        }

        return config
    }, (error:any) => {
        return Promise.reject(error) // Pass the error if there's a request setup issue
    })

    // Make Axios instance available via `useNuxtApp().$axios`
    nuxtApp.provide('axios', api)
})