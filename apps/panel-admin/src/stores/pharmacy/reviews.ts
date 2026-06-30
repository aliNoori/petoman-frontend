import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AxiosInstance } from "axios"
import { axiosKey } from "../../plugins/axiosPlugins"
import { inject } from "vue";

export interface PharmacyReview {
    id: string;
    tenantId: string;
    userId: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    reply?: string | null;       // متن پاسخ فروشگاه
    replyUpdatedAt?: string;     // تاریخ به‌روزرسانی پاسخ
    helpfulCount?: number;
    isHelpfulByMe?: boolean;
    tags?: { text: string; type: 'positive' | 'negative' }[];
}

export const usePharmacyReviewStore = defineStore('pharmacyReview', () => {
    const reviews = ref<PharmacyReview[]>([]);
    const loading = ref(false);

    // تزریق Axios
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    /**
     * دریافت لیست نظرات
     */
    const fetchReviews = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`/pharmacy/reviews/all-reviews`);
            reviews.value = res.data;
            return res.data;
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * ثبت پاسخ فروشگاه به یک نظر
     * @param reviewId - شناسه نظر
     * @param replyText - متن پاسخ
     */
    const submitReply = async (reviewId: string, replyText: string) => {
        loading.value = true;
        try {
            // ارسال درخواست به سرور (فرض بر این است که اندپوینت PATCH است)
            const res = await axios.patch(`/pharmacy/reviews/${reviewId}/reply`, {
                reply: replyText
            });

            // آپدیت لوکال: پیدا کردن نظر و به‌روزرسانی آن
            const index = reviews.value.findIndex(r => r.id === reviewId);
            if (index !== -1) {
                reviews.value[index] = {
                    ...reviews.value[index],
                    reply: res.data.reply || replyText,
                    replyUpdatedAt: res.data.replyUpdatedAt || new Date().toISOString()
                };
            }

            return res.data;
        } catch (err) {
            console.error("Failed to submit reply:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };


    return {
        reviews,
        loading,
        fetchReviews,
        submitReply,
    };
});