// src/plugins/axios.ts
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { App } from 'vue'

export const axiosKey = Symbol('axios') // ✅ کلید یکتا برای inject

export default {
    install(app: App) {
        const instance = axios.create({baseURL:import.meta.env.VITE_API_URL})

        instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`

                }

                const tenantId = localStorage.getItem('tenant_id')

                if(tenantId){
                    config.headers['X-Tenant-Id']= `${tenantId}`
                }
                //config.headers['X-Tenant-Id']= '4ac8eb81-41d6-42cb-b4dd-fee921da6f8b'
                return config
            },
            (error) => Promise.reject(error)
        )

        app.provide(axiosKey, instance) // ✅ provide کردن Axios
    }
}