import { defineStore } from 'pinia';
import { inject, ref, computed } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

// تعریف تایپ نقش (ساده شده برای استفاده در کاربر)
export interface UserRole {
    id: number | string;
    name: string;
    color: string;
    permissions?: string[];
}

// تعریف تایپ کاربر عادی
export interface RegularUser {
    id: number | string;
    name: string;
    avatar:string;
    email: string;
    phone: string;
    joinDate: string;
    ordersCount: number;
    status: 'active' | 'inactive' | 'blocked';
    lastLogin?: string;
    lastOrder?: string;
}

// تعریف تایپ مدیر
export interface AdminUser {
    id: number | string;
    name: string;
    avatar:string;
    email: string;
    phone: string;
    joinDate: string;
    status: 'active' | 'inactive';
    roles: UserRole[];
}

export const useUsersStore = defineStore('usersStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State برای نگهداری وضعیت لودینگ و خطا
    const loading = ref(false);
    const error = ref<string | null>(null);

    // State لیست کاربران و مدیران
    const regularUsers = ref<RegularUser[]>([]);
    const adminUsers = ref<AdminUser[]>([]);
    const allRoles = ref<UserRole[]>([]);

    // دریافت لیست کاربران عادی
    const fetchRegularUsers = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<{ data: RegularUser[] }>('/admin/users/regular');
            regularUsers.value = response.data;
        } catch (err) {
            error.value = 'خطا در دریافت لیست کاربران';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // دریافت لیست مدیران
    const fetchAdminUsers = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<{ data: AdminUser[] }>('/admin/users/admins');
            adminUsers.value = response.data;
        } catch (err) {
            error.value = 'خطا در دریافت لیست مدیران';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // دریافت لیست نقش‌ها (برای استفاده در مودال‌ها)
    const fetchRoles = async () => {
        try {
            const response = await axios.get<{ data: UserRole[] }>('/admin/roles');
            allRoles.value = response.data;
        } catch (err) {
            console.error('خطا در دریافت نقش‌ها', err);
        }
    };

    // تغییر وضعیت کاربر (فعال/مسدود)
    const toggleUserStatus = async (userId: number | string) => {
        loading.value = true;
        error.value = null;
        try {
            // فرض بر این است که اندپوینت وضعیت را تغییر می‌دهد
            await axios.patch(`/admin/users/${userId}/toggle-status`);

            // آپدیت لوکال (برای سرعت بخشیدن به UI)
            const user = regularUsers.value.find(u => u.id === userId);
            if (user) {
                user.status = user.status === 'blocked' ? 'active' : 'blocked';
            }
            return true;
        } catch (err) {
            error.value = 'خطا در تغییر وضعیت کاربر';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // ایجاد مدیر جدید
    const createAdmin = async (adminData: Omit<AdminUser, 'id' | 'joinDate' | 'roles'> & { password: string; roleIds: (string | number)[] }) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post<{ data: AdminUser }>('/admin/users/admins', adminData);
            adminUsers.value.push(response.data);
            return true;
        } catch (err) {
            error.value = 'خطا در ایجاد مدیر جدید';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // ویرایش مدیر
    const updateAdmin = async (id: number | string, adminData: Partial<AdminUser> & { roleIds?: (string | number)[] }) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.put<{ data: AdminUser }>(`/admin/users/admins/${id}`, adminData);
            const index = adminUsers.value.findIndex(a => a.id === id);
            if (index !== -1) {
                adminUsers.value[index] = response.data;
            }
            return true;
        } catch (err) {
            error.value = 'خطا در ویرایش مدیر';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // حذف مدیر
    const deleteAdmin = async (id: number | string) => {
        loading.value = true;
        error.value = null;
        try {
            await axios.delete(`/admin/users/admins/${id}`);
            adminUsers.value = adminUsers.value.filter(a => a.id !== id);
            return true;
        } catch (err) {
            error.value = 'خطا در حذف مدیر';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    // تخصیص نقش به مدیر
    const assignRolesToAdmin = async (adminId: number | string, roleIds: (string | number)[]) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.patch<{ data: AdminUser }>(`/admin/users/admins/${adminId}/roles`, { roleIds });
            const index = adminUsers.value.findIndex(a => a.id === adminId);
            if (index !== -1) {
                adminUsers.value[index] = response.data;
            }
            return true;
        } catch (err) {
            error.value = 'خطا در تخصیص نقش';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        regularUsers,
        adminUsers,
        allRoles,
        fetchRegularUsers,
        fetchAdminUsers,
        fetchRoles,
        toggleUserStatus,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        assignRolesToAdmin,
    };
});