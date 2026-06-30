import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useNuxtApp } from "nuxt/app";
import type { AxiosInstance } from "axios";

// --- Types & Interfaces ---
export enum AppointmentType {
    IN_PERSON = 'IN_PERSON',
    HOME_VISIT = 'HOME_VISIT',
    PHONE_INSTANT = 'PHONE_INSTANT',
    PHONE_SCHEDULED = 'PHONE_SCHEDULED',
    ONLINE_CHAT = 'ONLINE_CHAT',
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    type: AppointmentType;
    icon: string;
    // استایل‌های UI
    iconBg: string;
    iconColor: string;
    iconColorActive: string;
    borderColor: string;
    bgColor: string;
    textColorActive: string;
    priceColor: string;
    headerBg: string;
    // منطق
    isInstant: boolean;
    needsTimeSelection: boolean;
}

export interface Review {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    doctorReply?: string;
}

export interface WorkingHour {
    day: string;
    hours: string;
}

export interface Clinic {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    experience: number;
    rating: number;
    reviewCount: number;
    isOnline: boolean;
    about: string;
    education: string[];
    specialties: string[];
    availableServices: string[];
    workingHours: WorkingHour[];
}

export interface QueueInfo {
    orderId: string;
    queueNumber: number;
    estimatedWaitMinutes: number;
    yourTurn: boolean;
    status: 'waiting' | 'in_progress' | 'cancelled' | 'expired';
}

export interface CapacityStatus {
    available: boolean;
    activeCount: number;
    maxCapacity: number;
    isOnline: boolean;
    serviceEnabled: boolean;
    queuePosition?: number;
    estimatedWaitMinutes?: number;
    yourTurn?: boolean;
    userInQueue?: boolean;
    queueOrderId?: string;
    message?: string;
}

// ═══════════════════════════════════════════════════════
// 🆕 Types برای پاسخ پرداخت
// ═══════════════════════════════════════════════════════
export interface PaymentQueueResult {
    status: 'CONFIRMED' | 'QUEUED' | 'FAILED';
    orderId?: string;
    queueNumber?: number;
    queuePosition?: number;
    estimatedWait?: number;
    message?: string;
}

export const useVetStore = defineStore("vet", () => {
    // ─── State ───
    const clinic = ref<Clinic | null>(null);
    const services = ref<Service[]>([]);
    const reviews = ref<Review[]>([]);
    const selectedService = ref<Service | null>(null);

    // وضعیت‌های UI
    const loading = ref(false);
    const error = ref<string | null>(null);

    // ═══════════════════════════════════════════════════════
    // 🆕 State جدید برای ظرفیت و صف
    // ═══════════════════════════════════════════════════════
    const capacityStatus = ref<CapacityStatus>({
        available: true,
        activeCount: 0,
        maxCapacity: 2,
        isOnline: true,
        serviceEnabled: true,
    });

    // اطلاعات صف کاربر
    const queueInfo = ref<QueueInfo | null>(null);

    // آیا کاربر در صف است
    const isInQueue = computed(() => queueInfo.value !== null);

    // لیست صف انتظار (برای نمایش تعداد افراد جلو)
    const queueList = ref<any[]>([]);

    // polling interval references
    let queuePollingInterval: ReturnType<typeof setInterval> | null = null;
    let availabilityPollingInterval: ReturnType<typeof setInterval> | null = null;

    // ─── Nuxt App & Axios ───
    const { $axios } = useNuxtApp();
    const axios = $axios as AxiosInstance;

    // ═══════════════════════════════════════════════════════
    // 🎯 Callbacks
    // ═══════════════════════════════════════════════════════
    let onTurnReachedCallback: (() => void) | null = null;

    const setOnTurnReachedCallback = (callback: () => void) => {
        onTurnReachedCallback = callback;
    };

    const onQueueTurnReached = () => {
        console.log('🎉 نوبت شما رسید!');
        if (onTurnReachedCallback) {
            onTurnReachedCallback();
        }
    };

    // ═══════════════════════════════════════════════════════
    // 🏥 Actions اصلی
    // ═══════════════════════════════════════════════════════

    const fetchClinicDetails = async (tenantId: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`/tenants/${tenantId}/public-details`);
            clinic.value = response.data.clinic;
            services.value = mapServicesFromApi(response.data.services || []);
            reviews.value = response.data.reviews || [];

            if (services.value.length > 0) {
                selectedService.value = services.value[0];
            }

            // بررسی وضعیت ظرفیت بعد از دریافت اطلاعات
            await checkVetAvailability(tenantId);
        } catch (err: any) {
            error.value = err.response?.data?.message || 'خطا در دریافت اطلاعات کلینیک';
            console.error('Fetch Clinic Error:', err);
        } finally {
            loading.value = false;
        }
    };

    // ═══════════════════════════════════════════════════════
    // 📊 Actions ظرفیت
    // ═══════════════════════════════════════════════════════

    const checkVetAvailability = async (tenantId: string, serviceType?: string) => {
        try {
            const params: any = {};
            if (serviceType || selectedService.value) {
                params.serviceType = serviceType || selectedService.value?.type;
            }

            if(params.serviceType){
                const response = await axios.get(
                    `user/tenants/${tenantId}/availability`,
                    { params }
                );

                const data = response.data;
                // ─── به‌روزرسانی capacityStatus ───
                capacityStatus.value = {
                    available: data.available,
                    activeCount: data.activeCount,
                    maxCapacity: data.maxCapacity,
                    queuePosition: data.queuePosition,
                    isOnline: data.isOnline,
                    serviceEnabled: data.serviceEnabled,
                    estimatedWaitMinutes: data.estimatedWaitMinutes,
                    yourTurn: data.yourTurn,
                    userInQueue: data.userInQueue,
                    queueOrderId: data.queueOrderId,
                    message: data.message,
                };

                // ─── به‌روزرسانی queueInfo ───
                if (data.userInQueue && data.queueOrderId) {
                    queueInfo.value = {
                        orderId: data.queueOrderId,
                        queueNumber: data.queuePosition || 0,
                        estimatedWaitMinutes: data.estimatedWaitMinutes || 0,
                        yourTurn: data.yourTurn || false,
                        status: data.yourTurn ? 'in_progress' : 'waiting',
                    };

                    // ─── اگر نوبت کاربر رسیده ───
                    if (data.yourTurn) {
                        onQueueTurnReached();
                    }
                } else if (queueInfo.value && !data.userInQueue) {
                    // کاربر از صف خارج شده
                    queueInfo.value = null;
                    stopQueuePolling();
                }

                return capacityStatus.value;
            }


        } catch (err: any) {
            console.error('Error checking availability:', err);
            capacityStatus.value = {
                available: false,
                activeCount: 0,
                maxCapacity: 0,
                isOnline: clinic.value?.isOnline ?? false,
                serviceEnabled: false,
                message: 'خطا در بررسی وضعیت',
            };
            queueInfo.value = null;
            return capacityStatus.value;
        }
    };

    const startAvailabilityPolling = (tenantId: string) => {
        stopAvailabilityPolling();
        availabilityPollingInterval = setInterval(async () => {
            if (tenantId) {
                await checkVetAvailability(tenantId);
            }
        }, 30000);
    };

    const stopAvailabilityPolling = () => {
        if (availabilityPollingInterval) {
            clearInterval(availabilityPollingInterval);
            availabilityPollingInterval = null;
        }
    };

    // ═══════════════════════════════════════════════════════
    // 🔄 Actions صف (بدون joinQueue - در payment store هندل میشه)
    // ═══════════════════════════════════════════════════════

    /**
     * _شروع monitoring صف (بعد از پرداخت موفق)_
     * ─── این متد از payment store صدا زده میشه ───
     */
    const startQueueMonitoring = (tenantId: string, queueData: {
        orderId: string;
        queueNumber: number;
        queuePosition: number;
        estimatedWaitMinutes: number;
    }) => {
        // تنظیم اطلاعات صف
        queueInfo.value = {
            orderId: queueData.orderId,
            queueNumber: queueData.queueNumber,
            estimatedWaitMinutes: queueData.estimatedWaitMinutes,
            yourTurn: false,
            status: 'waiting',
        };

        // شروع polling
        startQueuePolling(tenantId);
    };

    /**
     * _دریافت وضعیت صف کاربر (polling)_
     */
    const getQueueStatus = async (tenantId: string) => {
        try {
            const response = await axios.get(`user/tenants/queue/status`, {
                params: { tenantId }
            });

            const data = response.data;

            // ─── به‌روزرسانی queueInfo ───
            if (data.inQueue) {
                queueInfo.value = {
                    orderId: data.orderId,
                    queueNumber: data.position,
                    estimatedWaitMinutes: data.estimatedWaitMinutes,
                    yourTurn: data.yourTurn,
                    status: data.yourTurn ? 'in_progress' : 'waiting',
                };

                // ─── نوبت کاربر رسیده! ───
                if (data.yourTurn) {
                    stopQueuePolling();
                    onQueueTurnReached();
                }
            } else if (!data.inQueue && queueInfo.value) {
                // از صف خارج شده (کنسل یا منقضی شده)
                queueInfo.value = null;
                stopQueuePolling();
            }

            return data;
        } catch (err: any) {
            console.error('Error getting queue status:', err);
            return { inQueue: false };
        }
    };

    /**
     * _polling تا زمانی که نوبت کاربر برسد_
     */
    const startQueuePolling = (tenantId: string) => {
        stopQueuePolling();

        queuePollingInterval = setInterval(async () => {
            await getQueueStatus(tenantId);
        }, 5000); // هر ۵ ثانیه
    };

    /**
     * _توقف polling صف_
     */
    const stopQueuePolling = () => {
        if (queuePollingInterval) {
            clearInterval(queuePollingInterval);
            queuePollingInterval = null;
        }
    };

    /**
     * _خروج از صف_
     */
    const leaveQueue = async (orderId: string) => {
        try {
            const response = await axios.delete(`user/tenants/queue/${orderId}`);

            stopQueuePolling();
            queueInfo.value = null;

            return { success: true, ...response.data };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'خطا در خروج از صف'
            };
        }
    };

    /**
     * _دریافت لیست صف انتظار (برای نمایش تعداد افراد جلو)_
     */
    const fetchQueueList = async (tenantId: string, serviceType?: string) => {
        try {
            const params: any = {};
            if (serviceType) params.serviceType = serviceType;

            const response = await axios.get(`user/tenants/${tenantId}/queue`, { params });
            const data = response.data;

            queueList.value = data.items || [];

            return {
                items: queueList.value,
                totalCount: data.totalCount,
                yourPosition: data.yourPosition,
            };
        } catch (err: any) {
            console.error('Error fetching queue list:', err);
            return { items: [], totalCount: 0, yourPosition: undefined };
        }
    };

    // ═══════════════════════════════════════════════════════
    // 🔧 متدهای کمکی
    // ═══════════════════════════════════════════════════════

    const mapServicesFromApi = (apiServices: any[]): Service[] => {
        const typeMap: Record<string, AppointmentType> = {
            'IN_PERSON': AppointmentType.IN_PERSON,
            'HOME_VISIT': AppointmentType.HOME_VISIT,
            'ONLINE_CHAT': AppointmentType.ONLINE_CHAT,
            'PHONE_CALL': AppointmentType.PHONE_INSTANT,
        };

        return apiServices.map((item) => {
            const type = typeMap[item.type] || AppointmentType.IN_PERSON;
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                type: type,
                icon: getServiceIcon(type),
                iconBg: getServiceStyle(type).iconBg,
                iconColor: getServiceStyle(type).iconColor,
                iconColorActive: getServiceStyle(type).iconColorActive,
                borderColor: getServiceStyle(type).borderColor,
                bgColor: getServiceStyle(type).bgColor,
                textColorActive: getServiceStyle(type).textColorActive,
                priceColor: getServiceStyle(type).priceColor,
                headerBg: getServiceStyle(type).headerBg,
                isInstant: type === AppointmentType.ONLINE_CHAT || type === AppointmentType.PHONE_INSTANT,
                needsTimeSelection: type === AppointmentType.PHONE_SCHEDULED || type === AppointmentType.IN_PERSON || type === AppointmentType.HOME_VISIT,
            };
        });
    };

    // ═══════════════════════════════════════════════════════
    // 🧹 پاکسازی
    // ═══════════════════════════════════════════════════════

    const cleanup = () => {
        stopQueuePolling();
        stopAvailabilityPolling();
        queueInfo.value = null;
    };

    // ═══════════════════════════════════════════════════════
    // 📤 Return
    // ═══════════════════════════════════════════════════════

    return {
        // State اصلی
        clinic,
        services,
        reviews,
        selectedService,
        loading,
        error,

        // State ظرفیت و صف
        capacityStatus,
        queueInfo,
        isInQueue,
        queueList,

        // Actions اصلی
        fetchClinicDetails,

        // Actions ظرفیت
        checkVetAvailability,
        startAvailabilityPolling,

        // ─── Actions صف ───
        // ❌ joinQueue حذف شد (در payment store هندل میشه)
        startQueueMonitoring,    // 🆕 شروع monitoring بعد از پرداخت
        getQueueStatus,
        startQueuePolling,
        stopQueuePolling,
        leaveQueue,
        fetchQueueList,

        // Callbacks
        setOnTurnReachedCallback,
        onQueueTurnReached,

        // Utility
        cleanup,
    };
});