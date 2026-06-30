import { defineStore } from 'pinia';
import { ref, computed, inject } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../plugins/axiosPlugins";
import { TenantReview} from "./auth";

export const useTenantReviewsStore = defineStore('tenantReviewsStore', () => {
    // ۱. تزریق Axios
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // ۲. State (وضعیت)
    const reviews = ref<TenantReview[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    /**
     * دریافت لیست تمام نظرات از سرور
     */
    const fetchTenantReviews = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<TenantReview[]>('/vetClinic/tenants/reviews'); // آدرس اندپوینت
            reviews.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'خطا در دریافت نظرات';
            console.error('Error fetching tenantReviews:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * ارسال پاسخ به یک نظر خاص
     * @param reviewId - شناسه نظر
     * @param replyText - متن پاسخ
     */
    const replyReview = async (reviewId: string, replyText: string) => {
        loading.value = true;
        error.value = null;
        try {
            // ارسال درخواست PATCH به سرور
            // آدرس باید با کنترلر بک‌اند شما همخوانی داشته باشد
            await axios.patch(`/vetClinic/tenants/reviews/${reviewId}/reply`, { reply: replyText });

            // آپدیت کردن لیست لوکال (برای نمایش سریع در UI)
            updateLocalReview(reviewId, replyText);

            return true; // نشان‌دهنده موفقیت
        } catch (err: any) {
            error.value = err.message || 'خطا در ثبت پاسخ';
            console.error('Error replying to review:', err);
            throw err; // پرتاب خطا برای مدیریت در کامپوننت
        } finally {
            loading.value = false;
        }
    };

    /**
     * آپدیت کردن یک نظر در لیست لوکال (بدون رفرش از سرور)
     */
    const updateLocalReview = (reviewId: string, replyText: string) => {
        const index = reviews.value.findIndex(r => r.id === reviewId);
        if (index !== -1) {
            reviews.value[index].reply = replyText;
            // اگر فیلد updatedAt برای پاسخ دارید می‌توانید آن را هم آپدیت کنید
            reviews.value[index].replyUpdatedAt = new Date().toISOString();
        }
    };

    // ────────────── Return ──────────────
    return {
        // State
        reviews,
        loading,
        error,
        // Actions
        fetchTenantReviews,
        replyReview, // اکشن جدید
    };
});