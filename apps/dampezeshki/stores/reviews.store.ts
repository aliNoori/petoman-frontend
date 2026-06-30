import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useNuxtApp } from "nuxt/app";
import type { AxiosInstance } from "axios";

// --- Interfaces ---
export interface TenantReview {
    id: string;
    tenantId: string;
    appointmentId:string;
    orderId:string;
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

export interface VisitReview {
    id: string;
    visitId: string;
    doctorName: string;
    rating: number;
    comment: string;
    date: string; // تاریخ شمسی
    reply?: string | null; // پاسخ دکتر
}

export interface OrderReview {
    id: string;
    orderId: string;
    orderCode: string;
    rating: number;
    comment: string;
    date: string;
}

export interface CreateReviewDto {
    rating: number;
    comment: string;
    // برای ویزیت
    visitId?: string;
    // برای سفارش
    orderId?: string;
    //
    tenantId:string;
}

export const useReviewStore = defineStore("review", () => {
    // --- State ---
    const reviews = ref<(VisitReview | OrderReview)[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // --- Computed ---

    // لیست تمام نظرات (برای نمایش در بخش "نظرات من")
    const allReviews = computed(() => reviews.value);

    // بررسی وجود نظر برای یک ویزیت خاص
    const getVisitReview = (visitId: string) => {
        return reviews.value.find(
            (r): r is VisitReview => "visitId" in r && r.visitId === visitId
        );
    };

    // بررسی وجود نظر برای یک سفارش خاص
    const getOrderReview = (orderId: string) => {
        return reviews.value.find(
            (r): r is OrderReview => "orderId" in r && r.orderId === orderId
        );
    };

    // --- Actions ---

    /**
     * دریافت لیست نظرات کاربر از سرور
     */
    const fetchReviews = async () => {
        loading.value = true;
        try {
            const { $axios } = useNuxtApp();
            const axios = $axios as AxiosInstance;

            // فرض بر این است که اندپوینت یک لیست یکپارچه برمی‌گرداند
            const res = await axios.get("user/tenants/reviews/myReviews");

            // نگاشت داده‌های دریافتی به فرمت استور
            reviews.value = res.data.map((item: any) => {
                if (item.appointmentId) {
                    return {
                        id: item.id,
                        visitId: item.appointmentId,
                        doctorName: item.tenant.name || item.tenant.ownerName || "دکتر", // نام دکتر باید از بک‌اند بیاید
                        rating: item.rating,
                        comment: item.comment,
                        date: new Date(item.createdAt).toLocaleDateString("fa-IR"),
                        reply: item.reply || null,
                    } as VisitReview;
                } else {
                    return {
                        id: item.id,
                        orderId: item.orderId,
                        orderCode: item.targetCode || "سفارش",
                        rating: item.rating,
                        comment: item.comment,
                        date: new Date(item.createdAt).toLocaleDateString("fa-IR"),
                    } as OrderReview;
                }
            });
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * ثبت یا ویرایش نظر
     * اگر قبلاً نظر وجود داشته باشد، آپدیت می‌کند، در غیر این صورت جدید می‌سازد.
     */
    const submitReview = async (payload: CreateReviewDto) => {
        loading.value = true;
        try {
            const { $axios } = useNuxtApp();
            const axios = $axios as AxiosInstance;

            let res: any;

            // 1. بررسی نوع نظر (ویزیت یا سفارش)
            const isVisit = !!payload.visitId;
            const targetId = isVisit ? payload.visitId : payload.orderId;

            // 2. جستجوی نظر قبلی در لیست لوکال
            const existingIndex = reviews.value.findIndex((r) =>
                isVisit ? ("visitId" in r && r.visitId === targetId) : ("orderId" in r && r.orderId === targetId)
            );

            if (existingIndex > -1) {
                // --- ویرایش نظر موجود ---
                const existingReview = reviews.value[existingIndex];

                // فرض: آپدیت با PUT یا PATCH
                res = await axios.patch(`user/tenants/${existingReview.id}/reviews`, {
                    rating: payload.rating,
                    comment: payload.comment,
                });

                // آپدیت لوکال
                reviews.value[existingIndex] = {
                    ...reviews.value[existingIndex],
                    rating: payload.rating,
                    comment: payload.comment,
                    // تاریخ را هم آپدیت می‌کنیم اگر لازم بود
                };
            } else {
                const {tenantId,...rest}=payload
                // --- ثبت نظر جدید ---
                // ارسال به بک‌اند
                res = await axios.post(`user/tenants/${tenantId}/reviews`, rest);

                // ساخت آبجکت جدید برای لیست
                const newReview: VisitReview | OrderReview = {
                    id: res.data.id,
                    rating: payload.rating,
                    comment: payload.comment,
                    date: new Date().toLocaleDateString("fa-IR"),
                };

                if (isVisit && payload.visitId) {
                    (newReview as VisitReview).visitId = payload.visitId;
                    (newReview as VisitReview).doctorName = res.data.tenant.name || "نامشخص"; // باید از بک‌اند بیاید
                    (newReview as VisitReview).reply = null;
                } else if (!isVisit && payload.orderId) {
                    (newReview as OrderReview).orderId = payload.orderId;
                    (newReview as OrderReview).orderCode = res.data.targetCode || "سفارش";
                }

                // افزودن به ابتدای لیست
                reviews.value.unshift(newReview);
            }

            return true;
        } catch (err) {
            console.error("Failed to submit review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * حذف نظر
     */
    const deleteReview = async (reviewId: string) => {
        loading.value = true;
        try {
            const { $axios } = useNuxtApp();
            const axios = $axios as AxiosInstance;

            await axios.delete(`user/tenants/${reviewId}/reviews`);

            // حذف از استیت لوکال
            const index = reviews.value.findIndex((r) => r.id === reviewId);
            if (index !== -1) {
                reviews.value.splice(index, 1);
            }

            return true;
        } catch (err) {
            console.error("Failed to delete review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const fetchTenantReviews = async (tenantId:string) => {
        loading.value = true;
        error.value = null;
        try {
            const { $axios } = useNuxtApp();
            const axios = $axios as AxiosInstance;

            const response = await axios.get<TenantReview[]>(`/user/tenants/${tenantId}/reviews`); // آدرس اندپوینت
            reviews.value = response.data;
        } catch (err: any) {
            error.value = err.message || 'خطا در دریافت نظرات';
            console.error('Error fetching tenantReviews:', err);
        } finally {
            loading.value = false;
        }
    };

    return {
        reviews,
        loading,
        allReviews,
        getVisitReview,
        getOrderReview,
        fetchReviews,
        fetchTenantReviews,
        submitReview,
        deleteReview,
    };
});