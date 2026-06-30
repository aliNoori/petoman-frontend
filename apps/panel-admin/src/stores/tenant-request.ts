import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { type AxiosInstance } from 'axios'
import { axiosKey} from "../plugins/axiosPlugins";
import {PharmacyMedicine} from "./pharmacy/medicine.store";


export interface TenantRequest {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
    address: string;
    province: string;
    city: string;
    location: { lat: string; lng: string } | null;
    services: string[];
    iban: string;
    type: string;
    documents: {};
    createdAt: string;
    rejectionReason?: string;
}

export const useTenantRequestStore = defineStore('tenantRequestStore', () => {
    // ────────────── State ──────────────
    const requests = ref<TenantRequest[]>([])
    const medicines=ref<PharmacyMedicine[]>([])
    const loading = ref(false)
    const fetched = ref(false)
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // ────────────── API Actions ──────────────

    /**
     * _Fetch all shop requests_
     */
    const fetchTenantRequest = async () => {
        loading.value = true
        try {
            const res = await axios.get<TenantRequest[]>('/admin/tenants/requests')
            requests.value = res.data
            fetched.value = true
        } catch (error) {
            console.error('Error fetching shop requests:', error)
        } finally {
            loading.value = false
        }
    }

    /**
     * _Approve a shop request_
     */
    const approveTenantRequest = async (id: string) => {
        loading.value = true
        try {
            const res = await axios.patch(`/admin/tenants/requests/${id}/approve`);
            const index = requests.value.findIndex(r => r.id === id);
            if (index !== -1) {
                requests.value[index].status = 'approved';
            }
            return res.data;
        } catch (error) {
            console.error('Error approving tenant request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * _Reject a shop request_
     * @param id - شناسه درخواست
     * @param reason - علت رد درخواست
     */
    const rejectTenantRequest = async (id: string, reason: string) => {
        loading.value = true
        try {
            // ارسال علت به همراه درخواست
            const res = await axios.patch(`/admin/tenants/requests/${id}/reject`, { reason });

            const index = requests.value.findIndex(r => r.id === id);
            if (index !== -1) {
                requests.value[index].status = 'rejected';
                requests.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error rejecting tenant request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * _Request revision for a shop request_
     * @param id - شناسه درخواست
     * @param reason - توضیحات برای کاربر جهت اصلاح
     */
    const requestTenantRevision = async (id: string, reason: string) => {
        loading.value = true
        try {

            const res = await axios.patch(`/admin/tenants/requests/${id}/revision`, { reason });

            const index = requests.value.findIndex(r => r.id === id);
            if (index !== -1) {
                requests.value[index].status = 'needs_revision';
                requests.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error requesting revision:', error)
            throw error
        } finally {
            loading.value = false
        }
    }


    ///==================Section admin medicines======================/////
    const fetchRequestPendingMedicines = async () => {
        loading.value = true
        const res = await axios.get('/admin/tenants/pending/medicines')
        medicines.value = res.data
        loading.value = false
    }

    /**
     * _Request revision for a medicine request_
     * @param id - شناسه درخواست
     * @param reason - توضیحات برای کاربر جهت اصلاح
     */
    const medicineRequestRevision = async (id: string, reason: string) => {
        loading.value = true
        try {

            const res = await axios.patch(`/admin/tenants/medicines/${id}/revision`, { reason });

            const index = medicines.value.findIndex(r => r.id === id);
            if (index !== -1) {
                medicines.value[index].status = 'needs_revision';
                medicines.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error requesting revision:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * _Reject a medicine request_
     * @param id - شناسه درخواست
     * @param reason - علت رد درخواست
     */
    const rejectMedicineRequest = async (id: string, reason: string) => {
        loading.value = true
        try {

            const res = await axios.patch(`/admin/tenants/medicines/${id}/reject`, { reason });

            const index = medicines.value.findIndex(r => r.id === id);
            if (index !== -1) {
                medicines.value[index].status = 'rejected';
                medicines.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error rejecting medicine request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * _Approve a medicine request_
     */
    const approveMedicineRequest = async (id: string) => {
        loading.value = true
        try {
            const res = await axios.patch(`/admin/tenants/medicines/${id}/approve`);
            const index = medicines.value.findIndex(r => r.id === id);
            if (index !== -1) {
                medicines.value[index].status = 'approved';
            }
            return res.data;
        } catch (error) {
            console.error('Error approving medicine request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * _Toggle suspend status for a tenant_
     * @param id - شناسه فروشگاه
     * @param status - وضعیت جدید (true برای محدود، false برای فعال)
     */
    const toggleSuspend = async (id: string, status: boolean) => {
        loading.value = true
        try {
            // ارسال درخواست به سرور (فرض بر این است که اندپوینت patch است)
            await axios.patch(`/admin/tenants/${id}/suspend`, { isSuspended: status });

            // آپدیت کردن لیست در سمت کلاینت (Optimistic Update)
            const index = tenants.value.findIndex(t => t.id === id);
            if (index !== -1) {
                tenants.value[index].isSuspended = status;
            }
        } catch (error) {
            console.error('Error toggling suspend status:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        requests,
        medicines,
        loading,
        fetched,
        medicineRequestRevision,
        approveMedicineRequest,
        fetchTenantRequest,
        fetchRequestPendingMedicines,
        approveTenantRequest,
        rejectTenantRequest,
        requestTenantRevision,
        rejectMedicineRequest,
        toggleSuspend,
    }
})