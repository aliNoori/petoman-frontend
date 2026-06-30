import { defineStore } from 'pinia';
import { inject,ref } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

export const useAdminSettingsStore = defineStore('adminSettingsStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State برای نگهداری وضعیت لودینگ و خطا
    const loading = ref(false);
    const error = ref<string | null>(null);

    // دریافت تنظیمات از سرور
    const fetchSettings = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get('/admin/settings');
            // فرض بر این است که بک‌اند یک آبجکت کامل برمی‌گرداند
            // اگر ساختار پاسخ متفاوت است، اینجا را اصلاح کنید
            if (response.data && typeof response.data === 'object') {
                // ادغام داده‌های دریافتی با state اصلی (که در کامپوننت تعریف شده)
                // توجه: در کامپوننت شما settings یک ref است.
                // برای اینکه استور بتواند آن را کنترل کند، بهتر است settings را به استور منتقل کنید
                // یا متد fetchSettings را در کامپوننت صدا بزنید و نتیجه را در settings.value بریزید.
                return response.data;
            }
        } catch (err) {
            error.value = 'خطا در دریافت تنظیمات';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // ذخیره تنظیمات روی سرور
    const saveSettings = async (settingsData: Record<string, any>) => {
        loading.value = true;
        error.value = null;
        try {
            // ارسال کل آبجکت settings به بک‌اند
            await axios.put('/admin/settings', { settings: settingsData });
            return true;
        } catch (err) {
            error.value = 'خطا در ذخیره تنظیمات';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        fetchSettings,
        saveSettings,
    };
});