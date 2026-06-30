import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";

export const useAdminFaqsStore = defineStore('adminFaqsStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // State
    const loading = ref(false);
    const error = ref<string | null>(null);
    const faqs = ref([]);
    const categories = ref({}); // ساختار: { market: [], pharmacy: [], ... }

    // --- Actions ---

    // دریافت دسته‌بندی‌های یک بخش خاص
    const fetchCategories = async (section: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`/admin/faqs/categories?section=${section}`);
            // ذخیره در آبجکت دسته‌بندی‌ها
            if (!categories.value[section]) {
                categories.value[section] = [];
            }
            categories.value[section] = response.data;
        } catch (err) {
            error.value = 'خطا در دریافت دسته‌بندی‌ها';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // دریافت همه سوالات (با فیلتر اختیاری بخش)
    const fetchFaqs = async (section?: string) => {
        loading.value = true;
        error.value = null;
        try {
            const params = section ? { section } : {};
            const response = await axios.get('/admin/faqs', { params });
            faqs.value = response.data;
        } catch (err) {
            error.value = 'خطا در دریافت سوالات';
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // ایجاد سوال جدید
    const createFaq = async (payload: any) => {
        loading.value = true;
        try {
            const response = await axios.post('/admin/faqs', payload);
            faqs.value.push(response.data);
            return response.data;
        } catch (err) {
            error.value = 'خطا در ایجاد سوال';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // بروزرسانی سوال
    const updateFaq = async (id: number, payload: any) => {
        loading.value = true;
        try {
            const response = await axios.put(`/admin/faqs/${id}`, payload);
            const index = faqs.value.findIndex((f: any) => f.id === id);
            if (index !== -1) {
                faqs.value[index] = response.data;
            }
        } catch (err) {
            error.value = 'خطا در بروزرسانی سوال';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // حذف سوال
    const deleteFaq = async (id: number) => {
        loading.value = true;
        try {
            await axios.delete(`/admin/faqs/${id}`);
            faqs.value = faqs.value.filter((f: any) => f.id !== id);
        } catch (err) {
            error.value = 'خطا در حذف سوال';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // ایجاد دسته‌بندی جدید
    const createCategory = async (payload: any) => {
        try {
            const response = await axios.post('/admin/faqs/categories', payload);
            const section = payload.section;
            if (!categories.value[section]) categories.value[section] = [];
            categories.value[section].push(response.data);
            return response.data;
        } catch (err) {
            error.value = 'خطا در ایجاد دسته‌بندی';
            throw err;
        }
    };

    // بروزرسانی دسته‌بندی
    const updateCategory = async (id: number, payload: any) => {
        try {
            const response = await axios.put(`/admin/faqs/categories/${id}`, payload);
            // پیدا کردن و جایگزینی در لیست محلی
            for (const section in categories.value) {
                const index = categories.value[section].findIndex((c: any) => c.id === id);
                if (index !== -1) {
                    categories.value[section][index] = response.data;
                    break;
                }
            }
        } catch (err) {
            error.value = 'خطا در بروزرسانی دسته‌بندی';
            throw err;
        }
    };

    // حذف دسته‌بندی
    const deleteCategory = async (id: number) => {
        try {
            await axios.delete(`/admin/faqs/categories/${id}`);
            // حذف از لیست محلی
            for (const section in categories.value) {
                categories.value[section] = categories.value[section].filter((c: any) => c.id !== id);
            }
        } catch (err) {
            error.value = 'خطا در حذف دسته‌بندی';
            throw err;
        }
    };

    return {
        loading,
        error,
        faqs,
        categories,
        fetchCategories,
        fetchFaqs,
        createFaq,
        updateFaq,
        deleteFaq,
        createCategory,
        updateCategory,
        deleteCategory,
    };
});