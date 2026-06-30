import { defineStore } from 'pinia';
import { ref, computed,inject } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins"; // مسیر ایمپورت پلاگین آکسیوس شما

// ────────────── Types & Interfaces ──────────────

export enum ServiceStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    INACTIVE = 'inactive',
    REJECTED = 'rejected'
}

export interface VetService {
    id: string | number; // UUID از سرور یا عدد موقت
    name: string;
    description: string;
    price: string; // قیمت فرمت شده (مثلا "1,200,000")
    status: ServiceStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceFormData {
    name: string;
    description: string;
    price: string;
}

export const useVetClinicServicesStore = defineStore('vetClinicServicesStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // ────────────── State ──────────────

    const services = ref<VetService[]>([]);
    const pendingServices= ref<VetService[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    // ────────────── Actions ──────────────

    const createService = async (payload: any) => {
        // ۱. ارسال درخواست به سرور
        const response = await axios.post<VetService>('/vetClinic/tenants/services', payload);
        const newService = response.data;

        // ۲. افزودن به لیست استور (با وضعیت pending طبق منطق شما)
        // اگر سرور status را برنگرداند، اینجا ست می‌کنیم
        services.value.unshift({
            ...newService,
            status: ServiceStatus.PENDING
        });

        return newService;
    };

    const updateService = async (id: string | number, payload: any) => {
        // ۱. ارسال درخواست به سرور
        const response = await axios.put<VetService>(`/vetClinic/tenants/services/${id}`, payload);
        const updatedService = response.data;

        // ۲. پیدا کردن ایندکس سرویس در لیست
        const index = services.value.findIndex(s => s.id === id);

        // ۳. آپدیت کردن آیتم در لیست استور
        if (index !== -1) {
            services.value[index] = {
                ...services.value[index], // حفظ سایر فیلدها
                ...updatedService,        // اعمال تغییرات جدید
                status: ServiceStatus.PENDING         // تغییر وضعیت به در انتظار تایید
            };
        }

        return updatedService;
    };

    // فقط ارسال درخواست DELETE به سرور
    const deleteService = async (id: string | number) => {
        await axios.delete(`/vetClinic/tenants/services/${id}`);

        const index = services.value.findIndex(s => s.id === id);

        if (index !== -1) {
            services.value.splice(index, 1); // حذف فیزیکی از آرایه
        }
    };

    // دریافت لیست
    const fetchServices = async () => {
        const response = await axios.get<VetService[]>('/vetClinic/tenants/services');
        services.value=response.data
        return response.data;
    };

    const fetchPendingServices = async () => {
        const response = await axios.get<VetService[]>('/admin/tenants/services/pending');
        pendingServices.value=response.data
        return response.data;
    };

    const processServiceStatus = async (serviceId: string, payload: { isApproved: boolean; reason?: string }) => {
        // ارسال پارامترهای isApproved و reason به بک‌اند
        const response = await axios.patch<VetService[]>(`/admin/tenants/services/${serviceId}/process`, payload);

        // آپدیت کردن لیست سرویس‌های در انتظار در استور
        pendingServices.value = response.data;

        return response.data;
    };
    // ────────────── Return ──────────────
    return {
        // State
        services,
        pendingServices,
        loading,
        error,

        // Actions
        fetchPendingServices,
        processServiceStatus,
        fetchServices,
        createService,
        updateService,
        deleteService,
    };
});