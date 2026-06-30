import { defineStore } from 'pinia';
import { ref, computed, inject } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../plugins/axiosPlugins";
import { Tenant } from "../auth";

export const useTenantStore = defineStore('tenantStore', () => {
    // ۱. تزریق Axios
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // ۲. State (وضعیت)
    const tenants = ref<Tenant[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // ۳. Getters (محاسباتی - داینامیک)

    // فیلتر کردن انواع فروشگاه‌ها
    const clinics = computed(() => tenants.value.filter(t => t.type === 'CLINIC'));
    const markets = computed(() => tenants.value.filter(t => t.type === 'MARKET'));
    const pharmacies = computed(() => tenants.value.filter(t => t.type === 'PHARMACY'));
    const vets = computed(() => tenants.value.filter(t => t.type === 'VET'));

    // --- KPIs ---
    const totalRevenue = computed(() => {
        return tenants.value.reduce((sum, tenant) => {
            // محاسبه مجموع سفارشات موفق (status: CUSTOMER_PAID)
            const tenantRevenue = tenant.orders?.reduce((orderSum, order) => {
                return order.status === 'CUSTOMER_PAID' || order.status === 'CUSTOMER_DELIVERED' ? orderSum + order.totalAmount : orderSum;
            }, 0) || 0;
            return sum + tenantRevenue;
        }, 0);
    });

    const totalTransactions = computed(() => {
        return tenants.value.reduce((sum, tenant) => sum + (tenant.orders?.length || 0), 0);
    });

    const activeStores = computed(() => {
        return tenants.value.filter(t => t.status === 'active').length;
    });

    // --- آمار برای جدول جزئیات ---
    // تبدیل داده‌های خام به فرمت مناسب جدول گزارش
    const storeDetails = computed(() => {
        return tenants.value.map(tenant => {
            const revenue = tenant.orders?.reduce((sum, order) =>
                order.status === 'CUSTOMER_PAID'|| order.status === 'CUSTOMER_DELIVERED' ? sum + order.totalAmount : sum, 0) || 0;

            const transactions = tenant.orders?.length || 0;

            // محاسبه رشد (فرضی برای مثال، چون داده تاریخی نداریم)
            const growth = Math.floor(Math.random() * 20) - 5;

            return {
                id: tenant.id,
                name: tenant.name||tenant.ownerName,
                owner: tenant.ownerName,
                type: getTypeLabel(tenant.type),
                city: tenant.city,
                revenue: revenue,
                transactions: transactions,
                growth: growth,
                rating: parseFloat(tenant.rating || "0"),
                status: tenant.status
            };
        });
    });

    // --- توزیع فروشگاه‌ها (برای نمودار دایره‌ای) ---
    const storeDistribution = computed(() => {
        const total = tenants.value.length;
        return {
            pharmacies: pharmacies.value.length,
            pharmaciesCount: pharmacies.value.length,
            markets: markets.value.length,
            marketsCount: markets.value.length,
            clinics: clinics.value.length,
            clinicsCount: clinics.value.length,
            total: total
        };
    });

    // --- پرفروش‌ترین‌ها ---
    const topStores = computed(() => {
        return storeDetails.value
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    });

    // ۴. Actions (توابع)
    const fetchTenants = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<Tenant[]>('/admin/tenants/allTenant');
            tenants.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'خطا در دریافت لیست';
            console.error('Error fetching tenants:', err);
        } finally {
            loading.value = false;
        }
    };

    const getTenantById = (id: string) => {
        return tenants.value.find(t => t.id === id);
    };

    // تابع کمکی برای تبدیل نوع به فارسی
    function getTypeLabel(type: string) {
        const map: Record<string, string> = {
            'MARKET': 'پت‌شاپ',
            'CLINIC': 'کلینیک',
            'PHARMACY': 'داروخانه',
            'VET': 'دامپزشک'
        };
        return map[type] || type;
    }

    // ────────────── Return ──────────────
    return {
        // State
        tenants,
        loading,
        error,

        // Getters (داینامیک)
        clinics,
        vets,
        markets,
        pharmacies,
        totalRevenue,
        totalTransactions,
        activeStores,
        storeDetails,
        storeDistribution,
        topStores,

        // Actions
        fetchTenants,
        getTenantById,
    };
});