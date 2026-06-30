import {defineStore} from "pinia"
import {safeStorage} from "~/utils/safeStorage"
import {ref} from "vue";
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";

export enum OrderStatus {
    CUSTOMER_PENDING = 'CUSTOMER_PENDING',
    CUSTOMER_PAID = 'CUSTOMER_PAID',
    TENANT_PROCESSING = 'TENANT_PROCESSING',
    TENANT_SHIPPED = 'TENANT_SHIPPED',
    CUSTOMER_DELIVERED = 'CUSTOMER_DELIVERED',
    CUSTOMER_CANCELLED = 'CUSTOMER_CANCELLED',
}
export interface AlopeykStatus {
    alopeykStatus: string | null; // status از API الوپیک
    progress: number | null; // progress از API الوپیک
    courierName: string | null;
    trackingUrl: string | null;
    errorMessage: string | null;
}

export interface Transaction {
    id: string;
    gateway: string;
    amount: number;
    authority: string | null;
    refId: string;
    status: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    tenantId: string;
    orderId: string;
    userId: string;
    amount: string; // در JSON شما رشته است، اما بهتر است number باشد
    status: string;
    provider: any;
    referenceId: any;
    metadata: { referenceId: any };
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    tenantId: string;
    productId: string;
    orderId: string;
    userId: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
}
export interface MarketProduct {
    id: string;
    tenantId: string;
    price: number;
    discountedPrice: number;
    discountValue: number;
    discountType: string;
    hasDiscount: boolean;
    hasExpiryDate: boolean;
    stock: number;
    isActive: boolean;
    averageRating: string;
    reviews_count: number;
    average_rating: string;
    reviewsCount: number;
    createdAt: string;
    updatedAt: string;
    expiryDate: string;
    discountStartDate: string;
    discountEndDate: string;
    status: string;
    reviews: Review[]; // شامل reviews می‌شود
}

export interface Variant {
    id:string;
    name:string;
    attribute:{};
    price:number;
    image:string;
    isActive:boolean;
    stock:number;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    price: number;
    quantity: number;
    marketProduct: MarketProduct;
    variant:Variant[];
    name?: string;
    total?: number;
}

export interface OrderMetadata {
    addressId: string;
    deliveryDate: string;
    deliveryTime: string;
    shippingMethod: string;
    [key: string]: any;
}

export interface UserOrder {
    id: string;
    orderCode:string
    tenantId: string;
    userId: string;
    type: string;
    status: OrderStatus;
    totalAmount: number;
    note: string;
    metadata: OrderMetadata;
    createdAt: string;
    updatedAt: string;
    transactions: Transaction[];
    payment: Payment;
    items: OrderItem[];
    review:[];
    /** کد پیگیری سفارش (معمولاً همان id یا یک فیلد جداگانه) */
    code?: string;
    /** برچسب وضعیت به فارسی */
    statusLabel?: string;
    /** تاریخ فرمت شده */
    date?: string;
    /** مبلغ کل (معمولاً همان totalAmount) */
    total?: number;
}

export const useOrderStore = defineStore("order", () => {

    const orders = ref<UserOrder[] | []>([])
    const currentOrder = ref<UserOrder | null>(null)
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance
    const loading = ref(false)

    const fetchUserOrders = async () => {
        loading.value = true
        try {
            const res = await axios.get("/orders/me",
                { params: {
                    orderType: [/*'APPOINTMENT', */'NONE_PRESCRIPTION', 'PRESCRIPTION','PRODUCT']
                }})
            orders.value = res.data
            safeStorage.setItem("user_orders", JSON.stringify(res.data))
        } catch (err) {
            console.error("Failed to fetch orders user:", err)
            //logout()
        } finally {
            loading.value = false
        }
    }

    // متد جدید: دریافت یک سفارش خاص بر اساس ID
    const fetchOrderById = async (orderId: string) => {
        loading.value = true
        try {
            const res = await axios.get(`/orders/${orderId}/me`)
            // فرض بر این است که API تک سفارش را در res.data یا res.data.data برمی‌گرداند
            currentOrder.value = res.data.data || res.data

            // اگر سفارش در لیست کلی وجود ندارد، به آن اضافه می‌کنیم
            const exists = orders.value.find(o => o.id === orderId)
            if (!exists) {
                orders.value.push(currentOrder.value)
            }

            return currentOrder.value
        } catch (err) {
            console.error("Failed to fetch order by ID:", err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * تغییر وضعیت سفارش
     * @param orderId شناسه سفارش
     */
    const updateOrderStatus = async (orderId: string) => {
        loading.value = true;
        try {
            // فرض بر این است که اندپوینت PATCH است و بدنه { status } را می‌پذیرد
            await axios.patch(`user/tenants/${orderId}/cancel-order-by-user`);

            // به‌روزرسانی لوکال: پیدا کردن سفارش و تغییر وضعیت آن
            const orderIndex = orders.value.findIndex((o:any) => o.id === orderId);
            if (orderIndex !== -1) {
                orders.value[orderIndex].status = OrderStatus.CUSTOMER_CANCELLED;
            }
        } catch (err) {
            console.error("Failed to update order status:", err);
            throw err; // پرتاب خطا برای مدیریت در کامپوننت
        } finally {
            loading.value = false;
        }
    };

    /**
     * بررسی وضعیت لحظه‌ای سفارش از طریق API الوپیک
     * این متد باید روی بک‌اند اجرا شود تا توکن API الوپیک لو نرود.
     * یا اگر روی کلاینت اجرا می‌شود، باید از یک اندپوینت میانی (Proxy) در بک‌اند استفاده کنید.
     *
     * نکته مهم: برای امنیت، بهتر است این درخواست به یک اندپوینت در بک‌اند شما (مثلاً /api/alopeyk/status) ارسال شود
     * و بک‌اند ما با توکن اختصاصی خود به الوپیک درخواست بزند.
     *
     * @param orderId شناسه سفارش در دیتابیس ما
     */
    const checkAlopeykStatus = async (orderId: string): Promise<AlopeykStatus> => {
        loading.value = true;
        const result: AlopeykStatus = {
            alopeykStatus: null,
            progress: null,
            courierName: null,
            trackingUrl: null,
            errorMessage: null
        };

        try {
            // پیدا کردن سفارش برای دریافت ID الوپیک از متادیتا
            const order = orders.value.find(o => o.id === orderId);
            if (!order) throw new Error("سفارش یافت نشد");

            const alopeykOrderId = order.metadata?.alopeykOrderId??_alopeykOrderId;
            if (!alopeykOrderId) {
                throw new Error("این سفارش در الوپیک ثبت نشده است.");
            }

            // درخواست به بک‌اند برای دریافت وضعیت
            const response = await axios.get(`/alopeyk/status/${alopeykOrderId}`);


            const data = response.data;

            if (data.success) {
                const alopeykData = data.data;
                result.alopeykStatus = alopeykData.status;
                result.progress = alopeykData.progress;
                result.courierName = alopeykData.courier?.name;
                result.trackingUrl = alopeykData.trackingUrl;
            } else {
                result.errorMessage = data.message || "وضعیت نامشخص است";
            }

            return result;

        } catch (err: any) {
            console.error("Failed to check Alopeyk status:", err);
            // اگر اندپوینت میانی ندارید، این بخش را کامنت کنید و مستقیماً به API الوپیک وصل نکنید (امنیت)
            result.errorMessage = "خطا در برقراری ارتباط با سرویس پست";
            return result;
        } finally {
            loading.value = false;
        }
    };

    /**
     * تبدیل وضعیت الوپیک به وضعیت قابل فهم برای کاربر
     */
    const getAlopeykStatusLabel = (status: string | null, progress: number | null): string => {
        if (!status) return "در حال بررسی وضعیت...";

        switch (status) {
            case 'new':
                return "سفارش ثبت شد، در انتظار پذیرش پیک";
            case 'scheduled':
                return "سفارش برای ارسال در تایم انتخابی ثبت شد";
            case 'accepted':
                return "پیک سفارش را پذیرفت، در مسیر مبدأ";
            case 'picking':
                return "پیک در حال برداشت بسته از مبدأ";
            case 'picked':
                return "بسته برداشت شد، در مسیر مقصد";
            case 'delivering':
                return "پیک در حال تحویل به مقصد";
            case 'delivered':
                return "سفارش تحویل داده شد";
            case 'cancelled':
                return "سفارش لغو شد";
            case 'refused':
                return "پیک از تحویل خودداری کرد";
            default:
                return `وضعیت: ${status}`;
        }
    };

    return {
        orders,
        fetchUserOrders,
        fetchOrderById,
        updateOrderStatus,
        checkAlopeykStatus,
        getAlopeykStatusLabel
    }
})