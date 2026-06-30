import { defineStore } from 'pinia';
import { inject, ref, computed } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

export const useInfoStore = defineStore('infoStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State برای نگهداری وضعیت لودینگ و خطا
    const loading = ref(false);
    const error = ref<string | null>(null);

    // --- تغییرات جدید ---
    // ۱. تعریف state برای نگهداری آمار
    const statsData = ref({
        totalUsers: 0,
        totalMarkets: 0,
        totalPharmacies: 0,
        totalClinics: 0,
        totalVets: 0,
        totalOrders: 0,
        pendingWithdrawals: 0,
        todayConsults: 0
    });

    const stats = computed(() => statsData.value);

    // ۳. اکشن برای دریافت اطلاعات از سرور
    const fetchStats = async () => {
        loading.value = true;
        error.value = null;
        try {

            const response = await axios.get('/admin/panel/stats');

            statsData.value = response.data;

        } catch (err) {
            console.error('Error fetching stats:', err);
            error.value = 'خطا در دریافت اطلاعات آمار';
        } finally {
            loading.value = false;
        }
    };
    // ---------------------

    return {
        loading,
        error,
        statsData,
        stats,
        fetchStats
    };
});