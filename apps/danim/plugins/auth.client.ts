import { useAuthStore } from "~/stores/auth"
import { defineNuxtPlugin } from 'nuxt/app'
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    if (process.client) {
        const params = new URLSearchParams(window.location.search)
        let token = params.get("token")

        if (token) {
            token = token.replace(/^"|"$/g, "")
            auth.setToken(token)
        } else {
            auth.hydrateToken()
        }
    }
})
