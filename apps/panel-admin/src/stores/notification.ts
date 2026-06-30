// stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import { axiosKey } from '../plugins/axiosPlugins'
import { useAuthStore } from './auth'
import type {AxiosInstance} from "axios";

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref([])
    const activeFilter = ref('all')
    const loading = ref(false)
    const error = ref(null)
    const authStore = useAuthStore()

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    const stats = computed(() => {
        const all = notifications.value;

        // تعداد کل
        const total = all.length;

        // تعداد نخوانده شده (isRead برابر false است)
        const unreadCount = all.filter((n: any) => !n.isRead).length;

        // تعداد خوانده شده (isRead برابر true است)
        const readCount = total - unreadCount;

        return {
            total,
            read: readCount,
            unread: unreadCount
        };
    });

    // دریافت نوتیفیکیشن‌ها
    const fetchNotifications = async (userId:string,panelType:string) => {

        loading.value = true
        try {
            const { data } = await axios.get(`/notifications/user/${userId}`, {params: {panelType}})
            notifications.value = data.map((n:any) => ({
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                time: formatTime(new Date(n.createdAt)),
                isRead: !!n.readAt,
                icon: n.icon,
                color: n.color,
            }))

        } catch (e:any) {
            console.error('❌ خطا در دریافت نوتیفیکیشن‌ها:', e)
            error.value = e.message
        } finally {
            loading.value = false
        }
    }
    const formatTime = (date: Date): string => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (minutes < 60)
        {
            if(minutes<1){
                return `لحظاتی پیش`
            }else{
                return `${minutes} دقیقه پیش`
            }

        } else if (hours < 24) {
            return `${hours} ساعت پیش`
        } else {
            return `${days} روز پیش`
        }
    }

    // فیلتر نوتیفیکیشن‌ها
    const filteredNotifications = computed(() => {
        if (activeFilter.value === 'all') {
            return notifications.value
        }
        return notifications.value.filter((n:any) => n.type === activeFilter.value)
    })

    // خواندن یک نوتیفیکیشن
    const markAsRead = async (id:string) => {
        const notif:any = notifications.value.find((n:any) => n.id === id)
        if (notif && !notif.isRead) {
            notif.isRead = true // optimistic update
            try {
                await axios.patch(`/notifications/read/${id}`)
            } catch (err) {
                notif.isRead = false
                console.error('❌ خطا در خواندن نوتیفیکیشن:', err)
            }
        }
    }

    // خواندن همه نوتیفیکیشن‌ها
    const markAllAsRead = async () => {
        notifications.value.forEach((n:any) => (n.isRead = true))
        try {
            await axios.patch(`/notifications/user/${authStore.user?.id}/readAll`)
        } catch (err) {
            console.error('❌ خطا در خواندن همه نوتیفیکیشن‌ها:', err)
        }
    }

    return {
        notifications,
        stats,
        filteredNotifications,
        activeFilter,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        formatTime,
    }
})