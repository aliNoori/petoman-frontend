// ~/plugins/toast.client.ts
import { defineNuxtPlugin, useState } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    // ✅ دیباگ: چک کنید آیا useState کار می‌کند
    const toasts = useState('toasts', () => {
        console.log('🔔 Toast State Initialized')
        return []
    })

    const toast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000) => {
        console.log('📢 Toast Triggered:', message, type) // ✅ دیباگ: چک کنید آیا این خط اجرا می‌شود
        const id = Date.now() + Math.random()
        const newToast = { id, message, type }

        toasts.value.push(newToast)

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    const removeToast = (id: number) => {
        console.log('❌ Toast Removed:', id) // ✅ دیباگ
        toasts.value = toasts.value.filter((t: any) => t.id !== id)
    }

    nuxtApp.provide('toast', toast)
    nuxtApp.provide('toasts', toasts)
    nuxtApp.provide('removeToast', removeToast)
})