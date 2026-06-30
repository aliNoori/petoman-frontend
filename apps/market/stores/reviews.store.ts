import {defineStore} from "pinia";
import {safeStorage} from "../utils/safeStorage";
import {ref, computed} from "vue";
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";
import {useOrderStore} from "./order.store";
import {OrderStatus} from "./order.store";
import {ProductVariant} from "../types/product";

export interface CreateReviewDto {
    rating: number;
    comment?: string;
    title?: string;
    pros?: string[];
    cons?: string[];
    recommended?: boolean;
    orderId?: string;
    productId?: string;
    variantId?: string;
}
// Interfaces
export interface BaseReview {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    isApproved?: boolean;
}

export interface ProductReview extends BaseReview {
    productId: string;
    variantId: string;
    orderId: string;
    tenantId: string;
    product?: {
        id: string;
        name: string;
        image: string;
    };
    variant?: ProductVariant;
    // Fields for mapping to component structure
    productName?: string;
    orderCode?: string;
    purchaseDate?: string;
    title?: string;
    text?: string;
    pros?: string[];
    cons?: string[];
    status?: string;
    statusLabel?: string;
    isApproved:boolean;
    likes?: number;
    likesCount?:number;
    dislikesCount?:number
}

export interface ShopReview extends BaseReview {
    tenantId: string;
    shop?: {
        id: string;
        name: string;
        logo: string;
    };
}

export const useReviewStore = defineStore("review", () => {
    const reviews = ref<(ProductReview | ShopReview)[]>([]);
    const {$axios} = useNuxtApp();
    const axios = $axios as AxiosInstance;
    const loading = ref(false);

    /**
     * Computed: List of items waiting for review (Pending)
     * Includes items from orders that have NO reviews in marketProduct.reviews.
     */
    const pendingReviews = computed(() => {

        return reviews.value
            .filter((item): item is ProductReview => 'productId' in item && !item.isApproved && item.rating === 0)
            .map((item) => ({
                id: item.id,
                productName: item.product?.name || item.productName || "محصول",
                productImage: item.product.image,
                orderCode: item.orderId,
                purchaseDate: new Date(item.createdAt).toLocaleDateString('fa-IR'),
                _raw: item
            }));
    });

    /**
     * Computed: List of submitted reviews (History)
     * Includes items found in marketProduct.reviews.
     */
    const myReviews = computed(() => {

        return reviews.value
            .filter((item): item is ProductReview => 'productId' in item && item.rating > 0)
            .map((item) => ({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                productName: item.product?.name || item.productName || "محصول",
                productImage: item.product?.image || '',
                date: new Date(item.createdAt).toLocaleDateString('fa-IR'),
                rating: item.rating,
                title: item.title || "بدون عنوان",
                text: item.comment || item.text || "",
                pros: item.pros || [],
                cons: item.cons || [],
                status: item.isApproved ? 'approved' : 'pending',
                statusLabel: item.isApproved ? 'تأیید شده' : 'در انتظار تأیید',
                likes: item.likes || 0,
                likesCount:item.likesCount,
                dislikesCount:item.dislikesCount,
                isApproved:item.isApproved,
                _raw: item
            }));
    });

    const pendingCount = computed(() => pendingReviews.value.length);
    const submittedCount = computed(() => myReviews.value.length);

    // ... (Other methods like fetchUserProductReviews, createProductReview, etc. remain the same) ...
    const fetchUserProductReviews = async () => {
        loading.value = true;
        try {
            const res = await axios.get("/product/reviews/me");
            reviews.value = res.data;
            safeStorage.setItem("user_product_reviews", JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to fetch reviews user:", err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Submit or Update a product review.
     * Handles logic for moving items from Pending to Submitted (History).
     */
    const submitProductReview = async (payload: {
        productId: string;
        variantId: string; // مطمئن شوید این مقدار پر می‌شود
        orderId: string;
        rating: number;
        comment: string;
        title?: string;
        pros?: string[];
        cons?: string[];
        item: any
    }) => {

        loading.value = true;
        try {
            let productName = "";
            let productImage = "";

            if (payload.item.variant) {
                // اگر ورینت دارد
                const mainName = payload.item.product?.name || "محصول";
                productName = `${mainName} (${payload.item.variant.name})`;
                productImage = payload.item.variant.image || "";

            } else {
                // اگر محصول ساده است
                productName = payload.item.product?.name || payload.item.name || "محصول";
                productImage = payload.item.product?.image || "";

            }
            // 1. Check if a review already exists for this product AND variant in this order
            const existingReviewIndex = reviews.value.findIndex(
                (r) => {
                    // شرط پایه: محصول و سفارش باید یکی باشند
                    const isSameProductAndOrder = r.productId === payload.productId && r.orderId === payload.orderId;

                    const isNotTemp = !r.id.startsWith('temp_');

                    // بررسی ورینت:
                    // اگر payload.variantId مقدار دارد (null یا خالی نیست)، باید بررسی کنیم که آیا با رکورد موجود یکی است یا خیر.
                    // اگر payload.variantId ندارد، یعنی محصول ساده است و نباید روی variantId فیلتر کنیم.
                    const isSameVariant = payload.variantId
                        ? r.variantId === payload.variantId
                        : true; // اگر ورینت نداریم، این شرط همیشه تایید است

                    return isSameProductAndOrder && isNotTemp && isSameVariant;
                }
            );

            if (existingReviewIndex > -1) {
                // --- UPDATE EXISTING REVIEW ---
                const apiPayload = {
                    productId: payload.productId,
                    orderId: payload.orderId,
                    variantId: payload.variantId, // <--- اضافه شده برای آپدیت
                    rating: payload.rating,
                    comment: payload.comment,
                    title: payload.title,
                    pros: payload.pros,
                    cons: payload.cons
                };

                const res = await axios.patch(`/products/${reviews.value[existingReviewIndex].id}/reviews`, apiPayload);

                reviews.value[existingReviewIndex] = {
                    ...reviews.value[existingReviewIndex],
                    ...res.data,
                    rating: payload.rating,
                    comment: payload.comment,
                    title: payload.title,
                    text: payload.comment,
                    variantId: payload.variantId, // <--- اضافه شده برای آپدیت لوکال
                    pros: payload.pros || [],
                    cons: payload.cons || [],
                    status: 'pending',
                    statusLabel: 'در انتظار تأیید',
                    updatedAt: new Date().toISOString()
                };
                return reviews.value[existingReviewIndex];
            } else {

                // --- CREATE NEW REVIEW ---
                const res = await axios.post(`/products/${payload.productId}/reviews/`, {
                    rating: payload.rating,
                    comment: payload.comment,
                    title: payload.title,
                    variantId: payload.variantId, // <--- اضافه شده برای ساخت
                    pros: payload.pros,
                    cons: payload.cons
                });

                const newReview: ProductReview = {
                    ...res.data,
                    productId: payload.productId,
                    orderId: payload.orderId,
                    variantId: payload.variantId, // <--- اضافه شده برای آبجکت نهایی
                    tenantId: res.data.tenantId || "",
                    userId: res.data.userId || "",
                    rating: payload.rating,
                    comment: payload.comment,
                    title: payload.title,
                    text: payload.comment,
                    pros: payload.pros || [],
                    cons: payload.cons || [],
                    status: 'pending',
                    statusLabel: 'در انتظار تأیید',
                    likes: 0,
                    likesCount:0,
                    dislikesCount:0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    product: res.data.product || {
                        id: payload.productId,
                        name: productName,
                        image: productImage
                    }
                };

                reviews.value.unshift(newReview);

                // Remove temp item logic...
                const tempItemIndex = reviews.value.findIndex(
                    (r) => r.productId === payload.productId &&
                        r.orderId === payload.orderId &&
                        r.id.startsWith('temp_')
                );
                if (tempItemIndex > -1) {
                    reviews.value.splice(tempItemIndex, 1);
                }
                return newReview;
            }
        } catch (err) {
            console.error("Failed to submit product review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * ثبت نظر جدید (هماهنگ با بک‌اند createReview)
     */
    const submitShopReview = async (tenantId: string, dto:CreateReviewDto) => {
        loading.value = true;
        try {
            // ارسال درخواست به اندپوینت متناظر با متد بک‌اند
            // فرض بر این است که مسیر به صورت /market/shops/:tenantId/reviews تنظیم شده است
            const res = await axios.post(`/user/shops/${tenantId}/reviews`, dto);

            // ساخت آبجکت نظر جدید بر اساس داده‌های بازگشتی از سرور
            // سرور آبجکت ذخیره شده را برمی‌گرداند که شامل ID و تاریخ است
            const newReview: ShopReview = {
                id: res.data.id,
                tenantId: res.data.tenantId,
                userId: res.data.userId,
                rating: res.data.rating,
                comment: res.data.comment,
                isApproved: res.data.isApproved,
                createdAt: res.data.createdAt,
                // نگاشت pros و cons به فرمت تگ‌های فرانت (برای نمایش در لیست)
                tags: [
                    ...(res.data.pros || []).map(p => ({ text: p, type: 'positive' })),
                    ...(res.data.cons || []).map(c => ({ text: c, type: 'negative' }))
                ] as { text: string, type: 'positive' | 'negative' }[]
            };

            reviews.value.unshift(newReview);

            return newReview;
        } catch (err) {
            console.error("Failed to create review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateReview = async (reviewId: string, data: { rating: number; comment: string }) => {
        loading.value = true;
        try {
            const res = await axios.patch(`/reviews/${reviewId}`, data);
            const index = reviews.value.findIndex((r) => r.id === reviewId);
            if (index !== -1) {
                reviews.value[index] = {...reviews.value[index], ...res.data};
            }
            return res.data;
        } catch (err) {
            console.error("Failed to update review:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Load items from orders.
     * Logic:
     * 1. Iterate through order items.
     * 2. Check if item.marketProduct.reviews has any reviews.
     * 3. If yes -> Add to My Reviews (History).
     * 4. If no -> Add to Pending Reviews.
     */
    const fetchReviewsFromOrders = async () => {
        loading.value = true;
        try {
            const orderStore = useOrderStore();

            // Ensure orders are loaded
            if (!orderStore.orders || orderStore.orders.length === 0) {
                await orderStore.fetchUserOrders();
            }

            // Filter orders
            const targetOrders = orderStore.orders.filter(
                (order) => order.status === OrderStatus.CUSTOMER_DELIVERED // TODO:DELIVERED
            );

            const finalList: (ProductReview | ShopReview)[] = [];

            targetOrders.forEach((order) => {
                order.items.forEach((item) => {

                    // --- استخراج اطلاعات محصول/ورینت ---
                    let productName = "محصول";
                    let productImage = "";
                    let variantId = "";

                    if (item.variant) {
                        const mainProductName = item.marketProduct?.product?.name || "محصول";
                        productName = `${mainProductName} (${item.variant.name})`;
                        productImage = item.variant.image || "";
                        variantId = item.variantId;
                    } else {
                        productName = item.marketProduct?.product?.name || item.name || "محصول";
                        productImage = item.marketProduct?.product?.image || "";
                    }

                    // --- منطق بررسی نظرات (بدون فیلتر userId) ---
                    let reviewsList: any[] = [];

                    if (item.variant) {
                        // اولویت با نظرات ورینت است
                        reviewsList = item.variant.reviews || [];
                    } else {
                        // در غیر این صورت نظرات محصول اصلی را چک می‌کنیم
                        reviewsList = item.marketProduct?.reviews || [];
                    }

                    // اگر هر نوع نظری (برای این محصول یا ورینت در این سفارش) وجود داشت
                    if (reviewsList.length > 0) {
                        reviewsList.forEach((rev: any) => {
                            finalList.push({
                                id: rev.id,
                                productId: item.productId,
                                variantId: variantId,
                                orderId: rev.orderId || order.id,
                                tenantId: order.tenantId,
                                userId: order.userId,
                                rating: rev.rating,
                                comment: rev.comment,
                                createdAt: rev.createdAt,
                                updatedAt: rev.updatedAt,
                                product: {
                                    id: item.marketProduct.id,
                                    name: productName,
                                    image: productImage
                                },
                                variant: item.variant,
                                title: "",
                                text: rev.comment,
                                pros: rev.pros,
                                cons: rev.cons,
                                likes: 0,
                                likesCount:rev.likesCount,
                                dislikesCount:rev.dislikesCount,
                                statusLabel: rev.isApproved ? 'تأیید شده' : 'در انتظار تأیید',
                                isApproved:rev.isApproved
                            });
                        });
                    } else {
                        // اگر نظری وجود نداشت، به عنوان "در انتظار نظر" اضافه کن
                        finalList.push({
                            id: `temp_${item.id}`,
                            productId: item.productId,
                            variantId: variantId,
                            orderId: order.id,
                            tenantId: order.tenantId,
                            userId: order.userId,
                            rating: 0,
                            comment: "",
                            createdAt: order.updatedAt,
                            updatedAt: order.updatedAt,
                            isApproved: false,
                            product: {
                                id: item.marketProduct.id,
                                name: productName,
                                image: productImage
                            },
                            variant: item.variant
                        });
                    }
                });
            });

            // --- مرحله حذف تکراری‌ها (اصلاح شده) ---
            const uniqueMap = new Map<string, any>();

            finalList.forEach((item) => {
                let key: string;

                // منطق کلید:
                // اگر variantId دارد (یعنی ورینت است)، کلید باید variantId باشد تا ورینت‌های یکسان حذف شوند.
                // اگر variantId ندارد (یعنی محصول ساده است)، کلید باید productId باشد.
                // با این کار، نظر محصول اصلی با نظر ورینت قاطی نمی‌شود.
                if (item.variantId) {
                    key = `variant_${item.variantId}`;
                } else {
                    key = `product_${item.productId}`;
                }

                // اگر قبلاً این کلید وجود داشت، آن را با آیتم جدیدتر جایگزین کن
                uniqueMap.set(key, item);
            });

            // تبدیل Map به آرایه
            const deduplicatedList = Array.from(uniqueMap.values());

            // مرتب‌سازی نهایی (جدیدترین اول)
            deduplicatedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            reviews.value = deduplicatedList;

        } catch (err) {
            console.error("Failed to process reviews from orders:", err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete a product review
     */
    const deleteReview = async (reviewId: string) => {
        loading.value = true;
        try {
            await axios.delete(`/products/${reviewId}/reviews`);

            // Remove from local state
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

    return {
        reviews,
        loading,
        pendingReviews,
        myReviews,
        pendingCount,
        submittedCount,
        fetchUserReviews: fetchUserProductReviews,
        submitProductReview,
        submitShopReview,
        updateReview,
        deleteReview,
        fetchReviewsFromOrders,
    };
});