import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { type AxiosInstance } from 'axios'
import { axiosKey } from "../../plugins/axiosPlugins";
import {MarketProduct} from "./product";
import {Tenant} from "../auth";


export interface ShopRequest {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    email: string;
    // اضافه کردن وضعیت‌های جدید
    status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
    address: string;
    province: string;
    city: string;
    location: { lat: string; lng: string } | null;
    categories: string[];
    iban: string;
    type: string;
    documents: {};
    createdAt: string;
    // فیلد جدید برای ذخیره علت رد یا درخواست ویرایش
    rejectionReason?: string;
}

export const useRequestShopStore = defineStore('requestShopStore', () => {
    // ────────────── State ──────────────
    const requests = ref<ShopRequest[]>([])
    const tenants=ref<Tenant[]>([])
    const products = ref<MarketProduct[]>([])
    const loading = ref(false)
    const fetched = ref(false)
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // ────────────── API Actions ──────────────

    /**
     * _Fetch all shop requests_
     */
    const fetchRequestShops = async () => {
        loading.value = true
        try {
            const res = await axios.get<ShopRequest[]>('/admin/shops/requests')
            requests.value = res.data
            fetched.value = true
        } catch (error) {
            console.error('Error fetching shop requests:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchAllShops = async () => {
        loading.value = true
        try {
            const res = await axios.get<Tenant[]>('/admin/shops/tenants')
            tenants.value = res.data
            fetched.value = true
        } catch (error) {
            console.error('Error fetching shop requests:', error)
        } finally {
            loading.value = false
        }
    }

    ///==================Section admin products======================/////
    const fetchRequestProducts = async () => {
        loading.value = true
        const res = await axios.get('/admin/products')
        products.value = res.data
        loading.value = false
    }

    /**
     * _Approve a shop request_
     */
    const approveProductRequest = async (id: string) => {
        loading.value = true
        try {
            const res = await axios.patch(`/admin/products/${id}/approve`);
            const index = products.value.findIndex(r => r.id === id);
            if (index !== -1) {
                products.value[index].status = 'approved';
            }
            return res.data;
        } catch (error) {
            console.error('Error approving product request:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * _Reject a product request_
     * @param id - شناسه درخواست
     * @param reason - علت رد درخواست
     */
    const rejectProductRequest = async (id: string, reason: string) => {
        loading.value = true
        try {

            const res = await axios.patch(`/admin/products/${id}/reject`, { reason });

            const index = products.value.findIndex(r => r.id === id);
            if (index !== -1) {
                products.value[index].status = 'rejected';
                products.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error rejecting product request:', error)
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
    const productRequestRevision = async (id: string, reason: string) => {
        loading.value = true
        try {

            const res = await axios.patch(`/admin/products/${id}/revision`, { reason });

            const index = products.value.findIndex(r => r.id === id);
            if (index !== -1) {
                products.value[index].status = 'needs_revision';
                products.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error requesting revision:', error)
            throw error
        } finally {
            loading.value = false
        }
    }



    ///////////////////////////////////////////////

    /**
     * _Approve a shop request_
     */
    const approveRequest = async (id: string) => {
        loading.value = true
        try {
            const res = await axios.patch(`/admin/shops/requests/${id}/approve`);
            const index = requests.value.findIndex(r => r.id === id);
            if (index !== -1) {
                requests.value[index].status = 'approved';
            }
            return res.data;
        } catch (error) {
            console.error('Error approving shop request:', error)
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
    const rejectRequest = async (id: string, reason: string) => {
        loading.value = true
        try {
            // ارسال علت به همراه درخواست
            const res = await axios.patch(`/admin/shops/requests/${id}/reject`, { reason });

            const index = requests.value.findIndex(r => r.id === id);
            if (index !== -1) {
                requests.value[index].status = 'rejected';
                requests.value[index].rejectionReason = reason;
            }
            return res.data;
        } catch (error) {
            console.error('Error rejecting shop request:', error)
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
    const requestRevision = async (id: string, reason: string) => {
        loading.value = true
        try {

            const res = await axios.patch(`/admin/shops/requests/${id}/revision`, { reason });

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

    /**
     * _Toggle suspend status for a tenant_
     * @param id - شناسه فروشگاه
     * @param status - وضعیت جدید (true برای محدود، false برای فعال)
     */
    const toggleSuspend = async (id: string, status: boolean) => {
        loading.value = true
        try {
            // ارسال درخواست به سرور (فرض بر این است که اندپوینت patch است)
            await axios.patch(`/admin/shops/tenants/${id}/suspend`, { isSuspended: status });

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
        products,
        tenants,
        loading,
        fetched,
        toggleSuspend,
        fetchAllShops,
        fetchRequestShops,
        fetchRequestProducts,
        approveProductRequest,
        productRequestRevision,
        rejectProductRequest,
        approveRequest,
        rejectRequest, // اضافه شده
        requestRevision // اضافه شده
    }
})