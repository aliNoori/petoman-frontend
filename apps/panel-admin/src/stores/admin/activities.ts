import { defineStore } from 'pinia';
import { inject, ref, computed } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";
import moment from 'moment-jalaali';

// تعریف تایپ‌ها (اختیاری اما توصیه می‌شود)
interface ActivityLog {
    id: string;
    userId: string;
    actorName: string;
    entityType: string;
    entityId: string;
    action: string;
    title: string;
    description: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

export const useActivitiesStore = defineStore('activitiesStore', () => {
    // ۱. تزریق Axios
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // ۲. State (وضعیت)
    const activities = ref<ActivityLog[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // ۳. Getters (محاسباتی - تبدیل داده خام به فرمت ویجت)

    // لیست فعالیت‌های آماده برای نمایش در داشبورد
    const recentActivities = computed(() => {
        return activities.value.map(log => {
            // مقادیر پیش‌فرض
            let icon = 'ti ti-info-circle';
            let bgClass = 'bg-gray-100';
            let iconClass = 'text-gray-600';

            // انتخاب آیکون و رنگ بر اساس نوع عملیات (Action)
            switch (log.action) {
                case 'CREATE':
                    icon = 'ti ti-plus';
                    bgClass = 'bg-blue-100';
                    iconClass = 'text-blue-600';
                    break;
                case 'UPDATE':
                    icon = 'ti ti-edit';
                    bgClass = 'bg-orange-100';
                    iconClass = 'text-orange-600';
                    break;
                case 'DELETE':
                    icon = 'ti ti-trash';
                    bgClass = 'bg-red-100';
                    iconClass = 'text-red-600';
                    break;
                case 'STATUS_CHANGE':
                    icon = 'ti ti-arrows-left-right';
                    bgClass = 'bg-purple-100';
                    iconClass = 'text-purple-600';
                    break;
                case 'PAYMENT':
                    icon = 'ti ti-credit-card';
                    bgClass = 'bg-emerald-100';
                    iconClass = 'text-emerald-600';
                    break;
                case 'LOGIN':
                    icon = 'ti ti-login';
                    bgClass = 'bg-teal-100';
                    iconClass = 'text-teal-600';
                    break;
                default:
                    icon = 'ti ti-bell';
                    bgClass = 'bg-gray-100';
                    iconClass = 'text-gray-600';
            }

            // محاسبه زمان نسبی (مثلاً ۵ دقیقه پیش)
            const timeAgo = moment(log.createdAt).fromNow();

            return {
                id: log.id,
                title: log.title,
                description: log.description,
                time: timeAgo,
                icon,
                bgClass,
                iconClass
            };
        });
    });

    // ۴. Actions (توابع)

    // دریافت لیست فعالیت‌ها از سرور
    const fetchActivities = async (limit: number = 10) => {
        loading.value = true;
        error.value = null;
        try {
            // فرض می‌کنیم اندپوینت شما /activities است
            const response = await axios.get<ActivityLog[]>(`/activities?limit=${limit}`);
            activities.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'خطا در دریافت فعالیت‌ها';
            console.error('Error fetching activities:', err);
        } finally {
            loading.value = false;
        }
    };

    // افزودن یک فعالیت دستی (لوکال) - اگر نیاز داشتید
    const addActivity = (activity: ActivityLog) => {
        activities.value.unshift(activity);
    };

    // پاک کردن لیست
    const clearActivities = () => {
        activities.value = [];
    };

    // ────────────── Return ──────────────
    return {
        // State
        activities,
        loading,
        error,

        // Getters
        recentActivities,

        // Actions
        fetchActivities,
        addActivity,
        clearActivities,
    };
});