import { defineStore } from 'pinia';
import { inject, ref,computed } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

// تعریف تایپ دسترسی‌ها
export type Permission = string;

// تعریف تایپ نقش
export interface Role {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    isSystem: boolean;
    usersCount: number;
    permissions: Permission[];
}

export const useRoleStore = defineStore('roleStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State برای نگهداری وضعیت لودینگ و خطا
    const loading = ref(false);
    const error = ref<string | null>(null);

    // State لیست نقش‌ها
    const roles = ref<Role[]>([]);

    // دریافت لیست تمام نقش‌ها
    const fetchRoles = async () => {
        loading.value = true;
        error.value = null;
        try {
            // فرض بر این است که اندپوینت شما /api/roles است
            const response = await axios.get<{ data: Role[] }>('/admin/roles');
            roles.value = response.data;
        } catch (err) {
            error.value = 'خطا در دریافت لیست نقش‌ها';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // ایجاد نقش جدید
    const createRole = async (roleData: Omit<Role, 'id' | 'usersCount' | 'isSystem'>) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post<{ data: Role }>('/admin/roles', roleData);
            roles.value.push(response.data);
            return true;
        } catch (err) {
            error.value = 'خطا در ایجاد نقش جدید';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // ویرایش نقش موجود
    const updateRole = async (id: number, roleData: Partial<Role>) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.put<{ data: Role }>(`/admin/roles/${id}`, roleData);
            const index = roles.value.findIndex(r => r.id === id);
            if (index !== -1) {
                roles.value[index] = response.data;
            }
            return true;
        } catch (err) {
            error.value = 'خطا در ویرایش نقش';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // حذف نقش
    const deleteRole = async (id: number) => {
        loading.value = true;
        error.value = null;
        try {
            await axios.delete(`/admin/roles/${id}`);
            roles.value = roles.value.filter(r => r.id !== id);
            return true;
        } catch (err) {
            error.value = 'خطا در حذف نقش';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        roles,
        loading,
        error,
        fetchRoles,
        createRole,
        updateRole,
        deleteRole,
    };
});