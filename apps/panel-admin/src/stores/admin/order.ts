import {defineStore} from "pinia";
import {computed, inject, ref} from "vue";
import {type AxiosInstance} from 'axios';
import {axiosKey} from "../../plugins/axiosPlugins";

export enum OrderStatus {
    CUSTOMER_PENDING = 'CUSTOMER_PENDING',
    CUSTOMER_PAID = 'CUSTOMER_PAID',
    TENANT_PROCESSING = 'TENANT_PROCESSING',
    TENANT_SHIPPED = 'TENANT_SHIPPED',
    CUSTOMER_DELIVERED = 'CUSTOMER_DELIVERED',
    CUSTOMER_CANCELLED = 'CUSTOMER_CANCELLED',
}

export interface OrderUser {
    id: string;
    fullName: string;
    firstName: string;
}

export interface OrderTenant {
    id: string;
    name: string;
    ownerName: string;
    type:string
}

export interface Product {
    id: string;
    tenantId: string;
    name: string;
    description: string;
    image: string;
    galleryImages: string[];
    brandId: string;
    code: string;
    categoryBreadcrumb: string;
    categoryId: string;
    categoryIds: string[];
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    rejectionReason: string;
    productId: string;
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

    product: Product;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    price: number;
    quantity: number;
    createdAt: string;

    marketProduct: MarketProduct;

    name?: string;
    total?: number;
}

export interface OrderMetadata {
    addressId: string;
    deliveryDate: string;
    deliveryTime: string;
    shippingMethod: string;
    [key: string]: string | number | boolean;
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
    amount: number;
    status: string;
    provider: string | null;
    referenceId: string | null;
    metadata: { referenceId: string | null };
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: string;
    userId: string;
    title: string;
    fullAddress: string;
    province: string;
    city: string;
    receiver: string;
    phone: string;
    postalCode: string | null;
    isDefault: boolean;
    location: any;
    createdAt: string;
    updatedAt: string;
}

export interface MarketOrder {
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

    // Relations
    user: OrderUser;
    tenant:OrderTenant;
    address:Address;
    items: OrderItem[];
    transactions: Transaction[];
    payments: Payment[];

    // Helper fields
    code?: string;
    statusLabel?: string;
    date?: string;
    total?: number;
}

export interface OrdersResponse {
    data: MarketOrder[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const useOrderStore = defineStore("order", () => {
    // تغییر تایپ به MarketOrder برای یکسان‌سازی
    const orders = ref<MarketOrder[]>([]);

    // متغیرهای جدید برای مدیریت وضعیت صفحه‌بندی
    const pagination = ref({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    const loading = ref(false);

    const stats = computed(() => {
        const allOrders = orders.value;


        return {
            totalOrders: allOrders.length,
            pendingOrders: allOrders.filter(o => o.status === OrderStatus.CUSTOMER_PENDING).length,
            paidOrders: allOrders.filter(o => o.status === OrderStatus.CUSTOMER_PAID).length,
            processingOrders: allOrders.filter(o => o.status === OrderStatus.TENANT_PROCESSING).length,
            shippingOrders: allOrders.filter(o => o.status === OrderStatus.TENANT_SHIPPED).length,
            deliveredOrders: allOrders.filter(o => o.status === OrderStatus.CUSTOMER_DELIVERED).length,
            cancelledOrders: allOrders.filter(o => o.status === OrderStatus.CUSTOMER_CANCELLED).length,

            // محاسبه مجموع فروش سفارشات تحویل داده شده (اختیاری)
            totalRevenue: allOrders
                .filter(o => o.status === OrderStatus.CUSTOMER_DELIVERED)
                .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        };
    });

    /**
     * دریافت جدیدترین سفارشات (محاسبه شده از لیست اصلی)
     * این متد درخواست API نمی‌فرستد، بلکه از orders.value استفاده می‌کند.
     */
    const recentOrders = computed(() => {
        // گرفتن ۵ مورد اول از لیست سفارشات
        const rawOrders = orders.value.slice(0, 5);

        return rawOrders.map(order => {
            // 1. استخراج نام مشتری
            const customerName = order.user
                ? `${order.user.firstName || ''} ${order.user.fullName || ''}`.trim()
                : 'مشتری ناشناس';

            // 2. ساخت لیست آیتم‌ها
            const itemsList = order.items && order.items.length > 0
                ? order.items.map(item => {
                    const productName = item.marketProduct?.product?.name || item.name || 'محصول';
                    return `${productName} (${item.quantity})`;
                }).join(' + ')
                : 'بدون آیتم';

            return {
                id: order.orderCode || order.id,
                customer: customerName,
                items: itemsList,
                amount: order.totalAmount || 0
            };
        });
    });

    /**
     * دریافت لیست سفارشات با پشتیبانی از صفحه‌بندی
     * @param page شماره صفحه (پیش‌فرض 1)
     * @param limit تعداد آیتم در هر صفحه (پیش‌فرض 10)
     */
    const fetchTenantAllOrders = async (page: number = 1, limit: number = 10) => {
        loading.value = true;
        try {
            // ارسال پارامترهای صفحه‌بندی به سرور
            const res = await axios.get<OrdersResponse>("/admin/tenants/all-orders", {
                params: {
                    page,
                    limit
                }
            });
            // به‌روزرسانی لیست سفارشات
            orders.value = res.data.data;

            const calculatedTotalPages = Math.ceil(res.data.total / limit);
            // به‌روزرسانی اطلاعات صفحه‌بندی
            pagination.value = {
                page: res.data.page,
                limit: res.data.limit,
                total: res.data.total,
                totalPages: res.data.totalPages || calculatedTotalPages
            };
        } catch (err) {
            console.error("Failed to fetch orders market:", err);
            // logout()
        } finally {
            loading.value = false;
        }
    };

    /**
     * محاسبه تعداد سفارشات بر اساس وضعیت‌های مختلف
     */
    const ordersByStatus = computed(() => {
        const counts = {
            pending: 0,        // در انتظار تایید (CUSTOMER_PENDING)
            paid: 0,           // پرداخت شده (CUSTOMER_PAID)
            processing: 0,     // در حال آماده‌سازی (TENANT_PROCESSING)
            shipped: 0,        // ارسال شده (TENANT_SHIPPED)
            delivered: 0,      // تحویل داده شده (CUSTOMER_DELIVERED)
            cancelled: 0,      // لغو شده (CUSTOMER_CANCELLED)
            total: 0           // کل سفارشات
        };

        orders.value.forEach(order => {
            counts.total++; // افزایش کل

            switch (order.status) {
                case OrderStatus.CUSTOMER_PENDING:
                    counts.pending++;
                    break;
                case OrderStatus.CUSTOMER_PAID:
                    counts.paid++;
                    break;
                case OrderStatus.TENANT_PROCESSING:
                    counts.processing++;
                    break;
                case OrderStatus.TENANT_SHIPPED:
                    counts.shipped++;
                    break;
                case OrderStatus.CUSTOMER_DELIVERED:
                    counts.delivered++;
                    break;
                case OrderStatus.CUSTOMER_CANCELLED:
                    counts.cancelled++;
                    break;
            }
        });

        return counts;
    });

    return {
        orders,
        stats,
        pagination,
        ordersByStatus,
        fetchTenantAllOrders,
        recentOrders,
    };

});