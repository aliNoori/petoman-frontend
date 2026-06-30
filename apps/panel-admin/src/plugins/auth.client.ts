import { useAuthStore} from "../stores/auth";
import { defineNuxtPlugin } from 'nuxt/app'
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    if (process.client) {
        const params = new URLSearchParams(window.location.search)
        let token = params.get("token")
        let tenantId = params.get("tenantId")
        let adminPanelType=params.get('admin_panel_type')

        if (token) {
            token = token.replace(/^"|"$/g, "")
            auth.setToken(token)
            localStorage.setItem('auth_token', token)

        } else {
            auth.hydrateToken()
        }
        if (tenantId) {
            tenantId = tenantId.replace(/^"|"$/g, "")
            auth.setTenantId(tenantId)
            localStorage.setItem('tenant_id', tenantId)
            localStorage.setItem('admin_panel_type', adminPanelType)
            //localStorage.setItem('auth_user', JSON.stringify(user.value))

        } else {
            auth.hydrateTenantId()
        }
    }
})
