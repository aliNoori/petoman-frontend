import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

import type {Tenant, TenantRequest, TenantSpecialty,ClinicService} from "~/stores/request";
import {TenantService} from "~/services/tenant.service";

export const useTenantStore = defineStore('tenantStore', () => {
    // ────────────── State ──────────────
    const requests = ref<TenantRequest[]>([])
    const tenants = ref<Tenant[]>([]);
    const specialties=ref<TenantSpecialty[]>([])
    const services=ref<ClinicService[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null);
    const fetched = ref(false)

    //////////////////----------------TENANT----------------//////////
    // ۳. Getters (محاسباتی)
    // مثال: دریافت فقط کلینیک‌ها
    const clinics = computed(() =>
        tenants.value?.filter(t => t.type === 'CLINIC') || []
    );

    // مثال: دریافت فقط دامپزشکان
    const vets = computed(() =>
        tenants.value?.filter(t => t.type === 'VET') || []
    );

    // مثال: دریافت فقط داروخانه‌ها
    const pharmacies = computed(() =>
        tenants.value?.filter(t => t.type === 'PHARMACY') || []
    );

    // ۴. Actions (توابع)

    /**
     * دریافت لیست تمام مستأجران از سرور
     */
    const fetchTenants = async () => {
        const data = await TenantService.fetchTenants();
        // ✅ اطمینان از اینکه داده‌ها آرایه هستند
        tenants.value = Array.isArray(data) ? data : [];
    };

    /**
     * دریافت یک مستأجر خاص با ID
     */
    const getTenantById = (id: string) => {
        return tenants.value.find(t => t.id === id);
    };

    /**
     * محاسبه و آپدیت وضعیت آنلاین بودن یک تننت خاص
     * @param targetId - شناسه تننت (مثلاً ID کلینیک)
     * @param onlineUsersList - لیست کاربران آنلاین از سوکت (آرایه ای از اشیاء)
     * @returns boolean
     */
    const calculateOnlineStatus = (targetId: string, onlineUsersList: any): boolean => {
        // پیدا کردن تننت در استور
        const tenant = tenants.value.find(t => t.id === targetId);

        if (!tenant) return false;

        let usersArray: any[] = [];

        // تبدیل ورودی به آرایه (پشتیبانی از Map، Proxy و Array)
        if (Array.isArray(onlineUsersList)) {
            usersArray = onlineUsersList;
        } else if (typeof onlineUsersList.values === 'function') {
            // اگر Map یا Proxy روی Map باشد
            usersArray = Array.from(onlineUsersList.values());
        } else {
            return false;
        }

        if (usersArray.length === 0) {
            tenant.isOnline = false;
            return false;
        }

        // استخراج لیست IDها
        const onlineIds = usersArray.map(user => user.userId);

        // بررسی وجود ID صاحب کلینیک در لیست آنلاین‌ها
        const isOnline = onlineIds.includes(tenant.ownerUserId);

        // آپدیت وضعیت
        tenant.isOnline = isOnline;

        return isOnline;
    };


    ////////////////---------------REQUEST----------------///////////////

    const fetchTenantRequests = async () => {
        if (fetched.value) return
        loading.value = true
        try {
            requests.value = await TenantService.fetchRequests()
            fetched.value = true
        } finally {
            loading.value = false
        }
    }

    const fetchTenantSpecialties = async () => {

        specialties.value = await TenantService.fetchSpecialties()

    }

    const fetchTenantServices = async () => {

        services.value = await TenantService.fetchServices()

    }


    /**
     * آماده‌سازی درخواست (آپلود مدارک)
     */
    const createTenantRequest = async (tenantData: Partial<Tenant>, documents: any): Promise<Partial<Tenant>> => {
        loading.value = true
        try {
            return await TenantService.prepareTenantRequest(tenantData, documents)
        } catch (error) {
            console.error('Failed to prepare tenant request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * ارسال نهایی به سرور
     */
    const submitTenant = async (payload: Partial<Tenant>) => {
        loading.value = true
        try {
            const result = await TenantService.submitTenantRequest(payload)
            // فرض بر این است که ساختار بازگشتی شامل data است
            if (result.data) {
                requests.value.push(result.data)
            } else {
                requests.value.push(result)
            }
            return result
        } catch (error) {
            // استخراج URLها برای پاکسازی در صورت خطا
            let uploadedUrls: string[] = []
            if (payload.documents && typeof payload.documents === 'object') {
                const docsArray = Object.values(payload.documents)
                uploadedUrls = docsArray
                    .map((doc: any) => doc?.thumbnail)
                    .filter(url => url && typeof url === 'string')
            }

            if (uploadedUrls.length > 0) {
                console.log('Cleaning up files due to error:', uploadedUrls)
                await TenantService.cleanupFiles(uploadedUrls)
            }
            throw error
        } finally {
            loading.value = false
        }
    }

    // متد ویرایش
    const updateRequest = async (id: string, formData: any) => {
        loading.value = true
        try {
            const {documents, ...data} = formData

            const updatedRequest = await TenantService.updateTenantRequest(id, data, documents)

            const index = requests.value.findIndex(r => r.id === id)
            if (index !== -1) {
                requests.value[index] = updatedRequest.data || updatedRequest
            }
            return updatedRequest
        } catch (error) {
            console.error('Failed to update request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }


    return {
        requests,
        tenants,
        specialties,
        services,
        clinics,
        vets,
        pharmacies,
        loading,
        fetched,
        calculateOnlineStatus,
        fetchTenants,
        fetchTenantSpecialties,
        fetchTenantRequests,
        fetchTenantServices,
        createTenantRequest,
        getTenantById,
        submitTenant,
        updateRequest
    }
})