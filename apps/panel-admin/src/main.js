import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import axiosPlugin from './plugins/axiosPlugins.ts'

const app = createApp(App)
app.use(router)
app.use(createPinia())

// منطق بررسی URL پارامترها باید بعد از نصب پینیا انجام شود
// چون به useAuthStore نیاز داریم
if (!import.meta.env.CLIENT) { // در Vite معادل process.client است
    const params = new URLSearchParams(window.location.search)
    let token = params.get("token")
    let tenantId = params.get("tenantId")
    let ownerId = params.get("ownerId")
    let admin_panel_type=params.get("admin_panel_type")
    console.log('tenantId','tenantId')
    //const auth = useAuthStore()

    if (token) {
        // حذف کوتیشن‌های اضافی اگر وجود داشته باشد
        token = token.replace(/^"|"$/g, "")
        //auth.setToken(token)
        localStorage.setItem('auth_token', token)

        // پاک کردن پارامترها از URL برای تمیز ماندن آدرس بار (اختیاری)
        const url = new URL(window.location.href)
        url.searchParams.delete("token")
        url.searchParams.delete("tenantId")
        window.history.replaceState({}, '', url)
    } else {
        //auth.hydrateToken()
    }

    if (tenantId) {
        tenantId = tenantId.replace(/^"|"$/g, "")
        //auth.setTenantId(tenantId)
        localStorage.setItem('tenant_id', tenantId)
        localStorage.setItem('auth_user', ownerId)
        localStorage.setItem('admin_panel_type', admin_panel_type)
    } else {
        //auth.hydrateTenantId()
    }
}

app.use(axiosPlugin)
app.mount('#app')
