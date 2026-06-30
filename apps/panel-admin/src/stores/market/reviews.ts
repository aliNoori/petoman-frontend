import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AxiosInstance } from "axios"
import { axiosKey } from "../../plugins/axiosPlugins"
import { inject } from "vue";

export interface PendingReview {
    id: number;
    userName: string;          // نام کاربر (یا دکتر/فروشگاه)
    comment: string;       // متن نظر
    rating: number;        // امتیاز (۱ تا ۵)
    shopName: string;      // نام فروشگاه
    productName: string;   // نام محصول
    requestDate: string;   // تاریخ درخواست (مثلاً '۱۴۰۲/۰۹/۱۵')
}

export interface ShopReview {
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

export const useReviewStore = defineStore('review', () => {
    const reviews = ref<ShopReview[]>([]);
    const reviewsShopPending = ref<PendingReview[]>([]);
    const reviewsProductPending = ref<PendingReview[]>([]);
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
            const res = await axios.get(`/market/shops/reviews`);
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
     * دریافت لیست نظرات محصولات در انتظار تایید
     */
    const fetchPendingProductReviews = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`/admin/products/reviews/pending`);

            // مپ کردن داده‌های API به اینترفیس PendingReview
            reviewsProductPending.value = res.data.map((item: any) => ({
                id: item.id,
                name: item.userName,           // نگاشت userName به name
                comment: item.comment,
                rating: item.rating,
                shopName: '-',                // در نظرات محصول معمولا نام شاپ نیست، یا باید از سمت سرور بیاید
                productName: item.productName,
                requestDate: new Date(item.createdAt).toLocaleDateString('fa-IR'), // تبدیل تاریخ به شمسی
            }));
            console.log('vvv',reviewsProductPending.value)
            return res.data;
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * دریافت لیست نظرات فروشگاه‌ها در انتظار تایید
     */
    const fetchPendingShopReviews = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`/admin/shops/reviews/pending`);

            // مپ کردن داده‌های API به اینترفیس PendingReview
            reviewsShopPending.value = res.data.map((item: any) => ({
                id: item.id,
                name: item.userName,           // نگاشت userName به name
                comment: item.comment,
                rating: item.rating,
                shopName: item.shopName || '-', // اگر shopName در پاسخ نبود، خطا ندهد
                productName: item.productName || '-',
                requestDate: new Date(item.createdAt).toLocaleDateString('fa-IR'), // تبدیل تاریخ به شمسی
            }));

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
            const res = await axios.patch(`/market/shops/reviews/${reviewId}/reply`, {
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

    /**
     * تایید نظر
     * @param reviewId - شناسه نظر
     */
    const approveProductReview = async (reviewId: string) => {
        loading.value = true;
        try {
            const res = await axios.patch(`/admin/products/reviews/${reviewId}/approve`);

            // آپدیت لوکال: تغییر وضعیت به تایید شده
            const index = reviews.value.findIndex(r => r.id === reviewId);
            if (index !== -1) {
                reviews.value[index].isApproved = true;
            }

            return res.data;
        } catch (err) {
            console.error("Failed to approve review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * رد نظر
     * @param reviewId - شناسه نظر
     */
    const rejectProductReview = async (reviewId: string) => {
        loading.value = true;
        try {
            const res = await axios.delete(`/admin/products/reviews/${reviewId}/reject`);

            // آپدیت لوکال: حذف نظر از لیست
            reviews.value = reviews.value.filter(r => r.id !== reviewId);

            return res.data;
        } catch (err) {
            console.error("Failed to reject review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * تایید نظر
     * @param reviewId - شناسه نظر
     */
    const approveShopReview = async (reviewId: string) => {
        loading.value = true;
        try {
            const res = await axios.patch(`/admin/shops/reviews/${reviewId}/approve`);

            // آپدیت لوکال: تغییر وضعیت به تایید شده
            const index = reviews.value.findIndex(r => r.id === reviewId);
            if (index !== -1) {
                reviews.value[index].isApproved = true;
            }

            return res.data;
        } catch (err) {
            console.error("Failed to approve review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * رد نظر
     * @param reviewId - شناسه نظر
     */
    const rejectShopReview = async (reviewId: string) => {
        loading.value = true;
        try {
            const res = await axios.delete(`/admin/shops/reviews/${reviewId}/reject`);

            // آپدیت لوکال: حذف نظر از لیست
            reviews.value = reviews.value.filter(r => r.id !== reviewId);

            return res.data;
        } catch (err) {
            console.error("Failed to reject review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        reviews,
        loading,
        reviewsShopPending,
        reviewsProductPending,
        fetchReviews,
        fetchPendingProductReviews,
        fetchPendingShopReviews,
        submitReply,
        approveProductReview,
        rejectProductReview,
        approveShopReview,
        rejectShopReview,
    };
});