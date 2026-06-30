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
    TENANT_CANCELLED = 'TENANT_CANCELLED',
}

export interface OrderUser {
    id: string;
    fullName: string;
    firstName: string;
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
    orderCode: string
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
    address: Address;
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

        const activeOrders = orders.value.filter(order =>
            order.status !== OrderStatus.CUSTOMER_CANCELLED &&
            order.status !== OrderStatus.TENANT_CANCELLED
        );

        // گرفتن ۵ مورد اول از لیست سفارشات
        const rawOrders = activeOrders.slice(0, 5);

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
    const fetchMarketOrders = async (page: number = 1, limit: number = 10) => {
        loading.value = true;
        try {
            // ارسال پارامترهای صفحه‌بندی به سرور
            const res = await axios.get<OrdersResponse>("/market/orders/shop/list", {
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

            // ذخیره در لوکال استوریج (اختیاری - توجه داشته باشید که ذخیره لیست‌های بزرگ در لوکال استوریج ممکن است بهینه نباشد)
            // safeStorage.setItem("market_orders", JSON.stringify(res.data.data));

        } catch (err) {
            console.error("Failed to fetch orders market:", err);
            // logout()
        } finally {
            loading.value = false;
        }
    };

    /**
     * تغییر وضعیت سفارش
     * @param orderId شناسه سفارش
     * @param status وضعیت جدید
     */
    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        loading.value = true;
        try {
            // فرض بر این است که اندپوینت PATCH است و بدنه { status } را می‌پذیرد
            const res= await axios.patch(`/market/orders/${orderId}/status`, {status});

            // به‌روزرسانی لوکال: پیدا کردن سفارش و تغییر وضعیت آن
            const orderIndex = orders.value.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                orders.value[orderIndex].status = status;
            }
            return res.data
        } catch (err) {
            console.error("Failed to update order status:", err);
            throw err; // پرتاب خطا برای مدیریت در کامپوننت
        } finally {
            loading.value = false;
        }
    };

    /**
     * ثبت کد رهگیری سفارش
     * @param orderId شناسه سفارش
     * @param trackingCode کد پیگیری / بارنامه
     * @param provider نام شرکت پستی (مثلا tipax, post, alopeyk)
     */
    const updateTrackingCode = async (orderId: string, trackingCode: string, provider: string = 'manual') => {
        loading.value = true;
        try {
            // ارسال درخواست به بک‌اند
            await axios.post(`/market/orders/${orderId}/tracking`, {
                trackingCode,
                provider
            });

            // به‌روزرسانی لوکال: اضافه کردن کد رهگیری به متادیتای سفارش
            const orderIndex = orders.value.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                // اطمینان از وجود آبجکت متادیتا
                if (!orders.value[orderIndex].metadata) {
                    orders.value[orderIndex].metadata = {} as OrderMetadata;
                }
                // ذخیره کد و ارائه‌دهنده در متادیتا
                orders.value[orderIndex].metadata.trackingCode = trackingCode;
                // اگر فیلدی برای provider در اینترفیس ندارید، می‌توانید آن را به صورت داینامیک اضافه کنید
                (orders.value[orderIndex].metadata as any).shippingProvider = provider;
            }
        } catch (err) {
            console.error("Failed to update tracking code:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };


    /**
     * درخواست ایجاد سفارش پستی از طریق بک‌اند
     * این متد به جای تماس مستقیم با الوپیک، به بک‌اند ما درخواست می‌زند
     */
    const requestShipment = async (orderId: string, provider: string, tenant: TenantInfo) => {
        loading.value = true;
        try {
            const order = orders.value.find(o => o.id === orderId);
            if (!order) throw new Error("سفارش یافت نشد");

            // 1. آماده‌سازی داده‌های مبدا و مقصد
            const origin = {
                type: "origin",
                lat: String(tenant.tenantAddress?.location?.lat || 35.6997),
                lng: String(tenant.tenantAddress?.location?.lng || 51.3380),
                description: tenant.tenantAddress.fullAddress || "آدرس فروشگاه",
                unit: "",
                number: "",
                person_fullname: tenant.name || "مدیر فروشگاه",
                person_phone: tenant.phone || "02100000000"
            };

            // 2. استخراج و پردازش تاریخ و زمان
            const deliveryDate = order.metadata?.deliveryDate || ''; // فرمت: YYYY-MM-DD
            let deliveryTimeRaw = order.metadata?.deliveryTime || ''; // فرمت: "ساعت ۹ تا ۱۲"

            // تابع کمکی برای تبدیل متن فارسی به فرمت استاندارد HH:mm
            const convertPersianTimeToStandard = (timeStr: string): string => {
                if (!timeStr) return '00:00';

                // 1. حذف پیشوند "ساعت" و پسوندهای احتمالی
                let cleanTime = timeStr.replace('ساعت', '').trim();

                // 2. جدا کردن بازه زمانی (اگر "تا" دارد)
                if (cleanTime.includes('تا')) {
                    const parts = cleanTime.split('تا');
                    cleanTime = parts[0].trim(); // فقط ساعت شروع را می‌گیریم
                }

                // 3. تبدیل اعداد فارسی به انگلیسی
                const persianToEnglish = (str: string) => {
                    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
                };

                cleanTime = persianToEnglish(cleanTime);

                // 4. اگر فقط عدد ساعت است (مثلا "9")، آن را به فرمت "09:00" تبدیل کن
                if (/^\d{1,2}$/.test(cleanTime)) {
                    return cleanTime.padStart(2, '0') + ':00';
                }

                // اگر فرمت "9:30" بود، مطمئن شو دقیقه هم دارد
                if (/^\d{1,2}:\d{1,2}$/.test(cleanTime)) {
                    const [h, m] = cleanTime.split(':').map(n => n.padStart(2, '0'));
                    return `${h}:${m}`;
                }

                return '00:00'; // پیش‌فرض در صورت خطا
            };

            const deliveryTimeStandard = convertPersianTimeToStandard(deliveryTimeRaw);
            const scheduleAt = deliveryDate ? `${deliveryDate} ${deliveryTimeStandard}` : '';


            const destination = {
                type: "destination",
                lat: String(order.address.location?.lat), // فرض بر این است که آدرس در متادیتا ذخیره شده
                lng: String(order.address.location?.lng),
                description: order.address?.fullAddress?.display_name,
                unit: "",
                number: "",
                person_fullname: order.user?.lastName + '.' + order.user?.firstName,
                person_phone: order.user?.phoneNumber,
                schedule_at: scheduleAt,
            };

            let response;

            if (provider.toLowerCase() === 'alopeyk') {
                // 2. ارسال درخواست به بک‌اند
                response = await axios.post(`/alopeyk/${orderId}/ship-alopeyk`, {
                    tenantToken: tenant.id,
                    origin: origin,
                    destination: destination,
                    transportType: "motorbike",
                    cashed: false,
                    schedule_at: scheduleAt,
                    extraParams: {
                        order_id: order.id,
                        order_code: order.orderCode
                    }
                });

                // 3. بازگرداندن اطلاعات
                return {
                    success: true,
                    trackingCode: response.data.data.trackingCode,
                    invoiceNumber: response.data.data.invoiceNumber,
                    alopeykOrderId: response.data.data.alopeykOrderId,
                };

            } else if (provider.toLowerCase() === 'tipax') {
                // منطق تیپاکس (اگر بک‌اند آن را هم پیاده‌سازی کردید)
                // ... مشابه بالا، درخواست به بک‌اند برای تیپاکس ...
                throw new Error("پشتیبانی از تیپاکس در این نسخه پیاده‌سازی نشده است.");
            } else {
                throw new Error("ارائه‌دهنده پستی پشتیبانی نمی‌شود");
            }

        } catch (err: any) {
            console.error(`Failed to request shipment via ${provider}:`, err);
            const message = err.response?.data?.message || err.message || `خطا در درخواست پستی ${provider}`;
            if (typeof window.showToast === 'function') {
                window.showToast(message, 'error', 5000);
            }
            throw new Error(message);
        } finally {
            loading.value = false;
        }
    };

    /**
     * بررسی وضعیت سفارش از طریق بک‌اند
     */
    const checkAlopeykStatus = async (orderId: string,_alopeykOrderId:string): Promise<any> => {
        loading.value = true;
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

            const statusData = response.data.data;
            const newStatus = statusData.status; // فرض بر این است که وضعیت در فیلد status برگردانده می‌شود

            // بررسی وضعیت: اگر Finished بود، وضعیت سیستم را به TENANT_DELIVERED تغییر بده
            if (newStatus === 'finished') {
                await updateOrderStatus(order.id,OrderStatus.CUSTOMER_DELIVERED)
            }

            return response.data.data;

        } catch (err: any) {
            console.error("Failed to check status:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * لغو سفارش پستی
     * این متد فقط زمانی کار می‌کند که پیک سفارش را قبول نکرده باشد.
     */
    const cancelShipment = async (orderId: string): Promise<boolean> => {
        loading.value = true;
        try {
            // درخواست به بک‌اند برای لغو سفارش در الوپیک
            await axios.post(`/alopeyk/${orderId}/cancel-shipment`);

            if (typeof window.showToast === 'function') {
                window.showToast('ارسال سفارش با موفقیت لغو شد', 'success', 5000);
            }
            return true;

        } catch (err: any) {
            console.error("Failed to cancel shipment:", err);

            // پیام خطای مناسب برای کاربر
            const errorMsg = err.response?.data?.message || 'خطا در لغو سفارش. ممکن است پیک آن را پذیرفته باشد.';

            if (typeof window.showToast === 'function') {
                window.showToast(errorMsg, 'error', 5000);
            }
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * محاسبه پرفروش‌ترین محصولات
     * این متد آیتم‌های تمام سفارشات را تجمیع کرده و محصولات پرفروش را برمی‌گرداند.
     */
    const topSellingProducts = computed(() => {
        // 1. ایجاد یک Map برای تجمیع داده‌ها بر اساس productId
        const productStats = new Map<string, {
            name: string;
            category: string;
            totalSales: number;
            totalRevenue: number;
            icon: string; // آیکون پیش‌فرض
        }>();

        // 2. پیمایش روی تمام سفارشات و آیتم‌های آن‌ها
        orders.value.forEach(order => {
            // فقط سفارشات تحویل داده شده را در نظر بگیرید (اختیاری)
            if (order.status === OrderStatus.CUSTOMER_CANCELLED || order.status === OrderStatus.TENANT_CANCELLED) return;

            order.items.forEach(item => {
                const productId = item.productId;
                const productName = item.marketProduct?.product?.name || item.name || 'محصول نامشخص';
                const category = item.marketProduct?.product?.categoryBreadcrumb || 'عمومی';
                const quantity = item.quantity;
                const revenue = item.price * quantity;

                if (productStats.has(productId)) {
                    // اگر محصول قبلاً در Map وجود دارد، مقادیر را اضافه کن
                    const existing = productStats.get(productId)!;
                    existing.totalSales += quantity;
                    existing.totalRevenue += revenue;
                } else {
                    // اگر محصول جدید است، آن را به Map اضافه کن
                    productStats.set(productId, {
                        name: productName,
                        category: category,
                        totalSales: quantity,
                        totalRevenue: revenue,
                        icon: 'ti ti-package' // آیکون پیش‌فرض
                    });
                }
            });
        });

        // 3. تبدیل Map به آرایه، مرتب‌سازی بر اساس تعداد فروش و گرفتن ۵ تای اول
        return Array.from(productStats.values())
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 5);
    });

    // --- تنظیمات بازه زمانی (می‌تواند در کامپوننت هم باشد اما اینجا مرکزی‌تر است) ---
    const selectedPeriod = ref<'weekly' | 'monthly' | 'quarterly'>('weekly');

    /**
     * محاسبه آمار فروش بر اساس بازه زمانی انتخاب شده
     */
    const periodStats = computed(() => {
        const now = new Date();
        let startDate = new Date();

        // 1. تعیین تاریخ شروع بر اساس بازه انتخاب شده
        if (selectedPeriod.value === 'weekly') {
            // ۷ روز قبل
            startDate.setDate(now.getDate() - 7);
        } else if (selectedPeriod.value === 'monthly') {
            // ۳۰ روز قبل
            startDate.setDate(now.getDate() - 30);
        } else if (selectedPeriod.value === 'quarterly') {
            // ۹۰ روز قبل
            startDate.setDate(now.getDate() - 90);
        }

        // 2. فیلتر کردن سفارشات در بازه زمانی
        // (اختیاری: می‌توانید فقط سفارشات تحویل داده شده را بگیرید)
        const filteredOrders = orders.value.filter(order => {
            const orderDate = new Date(order.createdAt);
            const isInDateRange = orderDate >= startDate && orderDate <= now;
            // فرض بر این است که مقدار وضعیت در فیلد status به صورت رشته 'TENANT_CANCELLED','CUSTOMER_CANCELLED' ذخیره می‌شود
            const isNotCancelled = ![OrderStatus.TENANT_CANCELLED, OrderStatus.CUSTOMER_CANCELLED].includes(order.status);

            return isInDateRange && isNotCancelled;
        });

        // 3. محاسبه مقادیر
        const totalSales = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = filteredOrders.length;

        // فرض بر این است که کارمزد پلتفرم ۵ درصد است
        const platformFeeRate = 0.05;
        const platformFee = totalSales * platformFeeRate;
        const netIncome = totalSales - platformFee;

        // 4. محاسبه درصد رشد (نسبت به بازه قبل)
        // برای سادگی، بازه قبل را هم به همان اندازه محاسبه می‌کنیم
        let prevStartDate = new Date(startDate);
        let prevEndDate = new Date(startDate); // پایان بازه قبل، شروع بازه فعلی است

        if (selectedPeriod.value === 'weekly') {
            prevStartDate.setDate(now.getDate() - 14);
        } else if (selectedPeriod.value === 'monthly') {
            prevStartDate.setDate(now.getDate() - 60);
        } else if (selectedPeriod.value === 'quarterly') {
            prevStartDate.setDate(now.getDate() - 180);
        }

        const prevOrders = orders.value.filter(order => {
            const orderDate = new Date(order.createdAt);
            const isInPrevRange = orderDate >= prevStartDate && orderDate < prevEndDate;
            const isNotCancelled = ![OrderStatus.TENANT_CANCELLED, OrderStatus.CUSTOMER_CANCELLED].includes(order.status);
            return isInPrevRange && isNotCancelled;
        });

        const prevTotalSales = prevOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const prevTotalOrders = prevOrders.length;

        // فرمول محاسبه درصد رشد: ((جدید - قدیم) / قدیم) * 100
        const salesGrowth = prevTotalSales > 0
            ? ((totalSales - prevTotalSales) / prevTotalSales) * 100
            : 0;

        const ordersGrowth = prevTotalOrders > 0
            ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100
            : 0;

        return {
            totalSales,
            platformFee,
            netIncome,
            totalOrders,
            salesGrowth: parseFloat(salesGrowth.toFixed(1)), // گرد کردن تا یک رقم اعشار
            ordersGrowth: parseFloat(ordersGrowth.toFixed(1))
        };
    });

    /**
     * تولید داده‌های نمودار بر اساس بازه زمانی انتخاب شده
     */
    const chartData = computed(() => {
        const now = new Date();
        let startDate = new Date();
        let labels: string[] = [];
        let dataMap: { [key: string]: number } = {};

        // 1. تعیین بازه زمانی و تولید لیبل‌ها (محور X)
        if (selectedPeriod.value === 'weekly') {
            // هفتگی: ۷ روز گذشته
            startDate.setDate(now.getDate() - 6);
            for (let i = 0; i < 7; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                // فرمت نام روز (مثلاً شنبه)
                const dayName = new Intl.DateTimeFormat('fa-IR', {weekday: 'long'}).format(d);
                labels.push(dayName);
                dataMap[dayName] = 0; // مقدار اولیه صفر
            }
        } else if (selectedPeriod.value === 'monthly') {
            // ماهانه: ۶ ماه گذشته
            startDate.setMonth(now.getMonth() - 5);
            for (let i = 0; i < 6; i++) {
                const d = new Date(startDate);
                d.setMonth(startDate.getMonth() + i);
                // فرمت نام ماه (مثلاً فروردین)
                const monthName = new Intl.DateTimeFormat('fa-IR', {month: 'long'}).format(d);
                labels.push(monthName);
                dataMap[monthName] = 0;
            }
        } else if (selectedPeriod.value === 'quarterly') {
            // سه‌ماهه: ۱۲ ماه گذشته
            startDate.setMonth(now.getMonth() - 11);
            for (let i = 0; i < 12; i++) {
                const d = new Date(startDate);
                d.setMonth(startDate.getMonth() + i);
                const monthName = new Intl.DateTimeFormat('fa-IR', {month: 'long'}).format(d);
                labels.push(monthName);
                dataMap[monthName] = 0;
            }
        }

        // 2. فیلتر کردن سفارشات در بازه زمانی انتخاب شده
        const filteredOrders = orders.value.filter(order => {
            const orderDate = new Date(order.createdAt);

            const isInPrevRange = orderDate >= startDate && orderDate <= now;
            const isNotCancelled = ![OrderStatus.TENANT_CANCELLED, OrderStatus.CUSTOMER_CANCELLED].includes(order.status);
            return isInPrevRange && isNotCancelled;
        });

        // 3. پر کردن داده‌ها (محاسبه مجموع فروش برای هر لیبل)
        filteredOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            let key = '';

            if (selectedPeriod.value === 'weekly') {
                key = new Intl.DateTimeFormat('fa-IR', {weekday: 'long'}).format(orderDate);
            } else {
                key = new Intl.DateTimeFormat('fa-IR', {month: 'long'}).format(orderDate);
            }

            // اگر کلید در لیبل‌های ما وجود داشت، مبلغ را اضافه کن
            if (dataMap.hasOwnProperty(key)) {
                dataMap[key] += order.totalAmount || 0;
            }
        });

        // 4. تبدیل به فرمت استاندارد نمودار
        return labels.map(label => ({
            label: label,
            sales: dataMap[label] || 0
        }));
    });

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
                case OrderStatus.TENANT_CANCELLED:
                    counts.cancelled++;
                    break;
            }
        });

        return counts;
    });

    /**
     * محاسبه پرفروش‌ترین محصولات "امروز"
     */
    const topProductsToday = computed(() => {
        // 1. دریافت تاریخ امروز (شروع و پایان روز)
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        // 2. فیلتر کردن سفارشات امروز
        const todaysOrders = orders.value.filter(order => {
            const orderDate = new Date(order.createdAt);
            const isInPrevRange = orderDate >= startOfDay && orderDate < endOfDay;
            const isNotCancelled = ![OrderStatus.TENANT_CANCELLED, OrderStatus.CUSTOMER_CANCELLED].includes(order.status);
            return isInPrevRange && isNotCancelled;
        });

        // 3. تجمیع تعداد فروش برای هر محصول
        const productStats = new Map<string, { name: string; sales: number }>();

        todaysOrders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.productId;
                // استفاده از نام محصول از دیتابیس، در غیر این صورت نام پیش‌فرض
                const productName = item.marketProduct?.product?.name || item.name || 'محصول نامشخص';

                if (productStats.has(productId)) {
                    productStats.get(productId)!.sales += item.quantity;
                } else {
                    productStats.set(productId, {
                        name: productName,
                        sales: item.quantity
                    });
                }
            });
        });

        // 4. مرتب‌سازی و برگرداندن ۳ تای اول
        return Array.from(productStats.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 3);
    });

    return {
        orders,
        stats,
        pagination,
        topSellingProducts,
        ordersByStatus,
        topProductsToday,
        fetchMarketOrders,
        updateOrderStatus,
        updateTrackingCode,
        requestShipment,
        checkAlopeykStatus,
        cancelShipment,
        recentOrders,
        selectedPeriod,
        periodStats,
        chartData,
    };

});