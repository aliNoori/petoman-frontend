import { defineStore } from "pinia";
import { ref } from "vue";
import { useNuxtApp } from "nuxt/app";
import type { AxiosInstance } from "axios";

// تطبیق با انتیتی بک‌اند
export enum AppointmentType {
    IN_PERSON = 'in-person',
    HOME_VISIT = 'home-visit',
    PHONE_INSTANT = 'urgent-consult',
    PHONE_SCHEDULED = 'phone',
    ONLINE_CHAT = 'online',
}

export enum AppointmentStatus {
    REQUEST_SENT = 'request_sent',
    PENDING = 'pending',
    CONFIRMED = 'approved',
    IN_CHAT = 'in-chat',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected',
    NO_SHOW = 'no-show',
}

export interface Appointment {
    id: string;
    trackingCode: string;
    petId: string;
    petName?: string; // برای نمایش در UI
    userId: string;
    doctorId?: string;
    tenantId: string;
    type: AppointmentType;
    status: AppointmentStatus;
    service: string;
    appointmentDate: string; // ISO Date
    duration: number;
    description: string;
    finalPrice: number;
    isPaid: boolean;
    locationData?: {
        address: string;
        lat: number;
        lng: number;
    };
    createdAt: string;
}

export const useAppointmentStore = defineStore("appointment", () => {
    const appointments = ref<Appointment[]>([]);
    const timeAppointments=ref<Appointment[]>([]);
    const timeOffBlocks = ref([]);
    const timeOffLoading = ref(false);
    const timeOffError = ref(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { $axios } = useNuxtApp();
    const axios = $axios as AxiosInstance;

    /**
     * دریافت لیست نوبت‌های کاربر
     */
    const fetchAppointments = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await axios.get("/user/tenants/appointments/my-list-appointments");
            // مپ کردن داده‌ها اگر نیاز باشد (در اینجا فرض می‌کنیم ساختار یکسان است)
            appointments.value = res.data;
        } catch (err: any) {
            console.error("Error fetching appointments:", err);
            error.value = err.response?.data?.message || "خطا در دریافت لیست نوبت‌ها";
        } finally {
            loading.value = false;
        }
    };

    const fetchTenantAppointments = async (tenantId:string) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await axios.get(`/user/tenants/appointments/${tenantId}/tenant-appointments`);
            // مپ کردن داده‌ها اگر نیاز باشد (در اینجا فرض می‌کنیم ساختار یکسان است)
            timeAppointments.value = res.data;

        } catch (err: any) {
            console.error("Error fetching appointments:", err);
            error.value = err.response?.data?.message || "خطا در دریافت لیست نوبت‌ها";
        } finally {
            loading.value = false;
        }
    };

    /**
     * دریافت لیست زمان‌های استراحت از سرور
     */
    const fetchTimeOffBlocks = async (tenantId:string) => {
        timeOffLoading.value = true;
        timeOffError.value = null;
        try {
            const response = await axios.get(`user/tenants/time-off/${tenantId}/tenant-time-off`);
            timeOffBlocks.value = response.data;
        } catch (err) {
            console.error("Error fetching time off blocks:", err);
            timeOffError.value = err.response?.data?.message || 'خطا در دریافت لیست زمان‌های استراحت';
        } finally {
            timeOffLoading.value = false;
        }
    };


    /**
     * لغو نوبت
     */
    const cancelAppointment = async (id: string) => {
        loading.value = true;
        try {
            await axios.post(`/vetClinic/appointments/${id}/cancel`);
            const index = appointments.value.findIndex((a) => a.id === id);
            if (index !== -1) {
                appointments.value[index].status = AppointmentStatus.CANCELLED;
            }
        } catch (err: any) {
            console.error("Error cancelling appointment:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    let pollingInterval: NodeJS.Timeout | null = null

    async function startSlotPolling(tenantId: string) {
        // اولین بار فوری لود کن
        await fetchTenantAppointments(tenantId)

        // هر ۳۰ ثانیه refresh کن (بسته به نیاز می‌تونید کمتر کنید)
        pollingInterval = setInterval(() => {
            fetchTenantAppointments(tenantId)
        }, 30000)
    }

    function stopSlotPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval)
            pollingInterval = null
        }
    }

    function cleanup() {
        stopSlotPolling()
    }

    return {
        appointments,
        timeAppointments,
        timeOffBlocks,
        loading,
        error,
        cleanup,
        fetchAppointments,
        fetchTenantAppointments,
        fetchTimeOffBlocks,
        startSlotPolling,
        cancelAppointment,
    };
});