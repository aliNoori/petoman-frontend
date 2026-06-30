import {defineStore} from 'pinia';
import {computed, inject, ref, toValue} from 'vue';
import {type AxiosInstance} from 'axios';
import {axiosKey} from "../../plugins/axiosPlugins";
import {useUploader} from "../../composables/useUploader";

// ────────────── Pending Edits (Admin) Types & State ──────────────
export interface PendingEditItem {
    id: string; // UUID از سرور
    entityType: 'market' | 'pharmacy' | 'clinic'; // در اینجا معمولا market است
    entityName: string; // نام فروشگاه از shopInfo.name
    owner: string; // نام صاحب امتیاز از shopInfo.ownerName
    changeType: string; // کلید فیلد تغییر کرده (مثلا logo, address)
    changeLabel: string; // برچسب فارسی برای نمایش
    oldValue: any;
    newValue: any;
    requestDate: string; // تاریخ فرمت شده
    note: string; // توضیحات (در اینجا description از دیتابیس)
}

// ────────────── Types & Interfaces ──────────────
export interface ShippingConfig {
    inPerson: boolean;
    inPersonDeliveryTime: string;
    petomanCourier: boolean;
    petomanCourierDeliveryTime: string;
    petomanCourierPrice: string | number;
    shopCourier: boolean;
    shopCourierDeliveryTime: string;
    shopCourierPrice: string | number;
    tipax: boolean;
    tipaxDeliveryTime: string;
    tipaxPrice: string | number;
    alopeyk: boolean;
    alopeykDeliveryTime: string;
    alopeykPrice: string | number;
    post: boolean;
    postDeliveryTime: string;
    postPrice: string | number;
}

export interface ShopInfo {
    logo: string;
    name: string;
    description: string;
    licenseNumber: string;
    medicalSystemCode: string;
    ownerNationalId: string;
    ownerName: string;
    phone: string;
    mobile: string;
    email: string;
    website: string;
    province: string;
    city: string;
    postalCode: string;
    address: string;
    is24Hours: boolean;
    openTime: string;
    closeTime: string;
    closedDays: string[];
    isApproved: boolean;
    pendingChanges: boolean;
}

export interface MarketSettingsApiResponse {
    shopInfo?: ShopInfo;
    shipping_methods?: { methods: ShippingMethodDto[] };
}

export interface ShippingMethodDto {
    type: string;
    isActive: boolean;
    deliveryTime?: string;
    price?: number;
}

export interface TimeSlot {
    id: string;
    time: string;
    price: number;
    available: boolean;
}

export const useMarketSettingsStore = defineStore('marketSettingsStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    const uploader = useUploader();

    const loading = ref(false);
    const saving = ref(false);
    const error = ref<string | null>(null);
    const rawSettings = ref<MarketSettingsApiResponse | null>(null);

    // State های مربوط به ادمین
    const pendingEdits = ref<PendingEditItem[]>([]);
    const loadingPending = ref(false);

    // نگاشت کلیدهای دیتابیس به برچسب‌های فارسی
    const fieldLabels: Record<string, string> = {
        logo: 'تغییر لوگو',
        name: 'تغییر نام',
        address: 'تغییر آدرس',
        phone: 'تغییر شماره تماس',
        mobile: 'تغییر موبایل',
        email: 'تغییر ایمیل',
        description: 'تغییر توضیحات',
        // سایر فیلدها را در صورت نیاز اضافه کنید
    };

    // ────────────── Computed ──────────────
    const shipping = computed<ShippingConfig>(() => {
        const defaults: ShippingConfig = {
            inPerson: false, inPersonDeliveryTime: '',
            petomanCourier: false, petomanCourierDeliveryTime: '', petomanCourierPrice: '',
            shopCourier: false, shopCourierDeliveryTime: '', shopCourierPrice: '',
            tipax: false, tipaxDeliveryTime: '', tipaxPrice: '',
            alopeyk: false, alopeykDeliveryTime: '', alopeykPrice: '',
            post: false, postDeliveryTime: '', postPrice: ''
        };

        // اصلاحیه: بررسی وجود shipping_methods و سپس methods
        if (!rawSettings.value?.shipping_methods?.methods) return defaults;

        const mapped: Partial<ShippingConfig> = {};

        // اصلاحیه: استفاده از shipping_methods به جای shipping
        rawSettings.value.shipping_methods.methods.forEach((method) => {
            if (method.type === 'inPerson') {
                mapped.inPerson = method.isActive;
                mapped.inPersonDeliveryTime = method.deliveryTime || '';
            } else if (method.type === 'petomanCourier') {
                mapped.petomanCourier = method.isActive;
                mapped.petomanCourierDeliveryTime = method.deliveryTime || '';
                mapped.petomanCourierPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'shopCourier') {
                mapped.shopCourier = method.isActive;
                mapped.shopCourierDeliveryTime = method.deliveryTime || '';
                mapped.shopCourierPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'tipax') {
                mapped.tipax = method.isActive;
                mapped.tipaxDeliveryTime = method.deliveryTime || '';
                mapped.tipaxPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'post') {
                mapped.post = method.isActive;
                mapped.postDeliveryTime = method.deliveryTime || '';
                mapped.postPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'alopeyk') {
                mapped.alopeyk = method.isActive;
                mapped.alopeykDeliveryTime = method.deliveryTime || '';
                mapped.alopeykPrice = method.price ? String(method.price) : '';
            }
        });

        return {...defaults, ...mapped};
    });

    const shopInfo = ref<ShopInfo>(() => {
        const defaults: ShopInfo = {
            logo: '', name: '', description: '',
            licenseNumber: '', medicalSystemCode: '', ownerNationalId: '', ownerName: '',
            phone: '', mobile: '', email: '', website: '',
            province: '', city: '', postalCode: '', address: {},
            is24Hours: false, openTime: '', closeTime: '', closedDays: [],
            isApproved: true, pendingChanges: false
        };

        if (!rawSettings.value?.shopInfo) return defaults;

        return {...defaults, ...rawSettings.value.shopInfo};
    });

    const timeSlots = computed<TimeSlot[]>(() => {
        // ۱. تعریف دیتای پیش‌فرض به عنوان یک آرایه
        const defaults: TimeSlot[] = [
            {id: 1, time: 'ساعت ۹ تا ۱۲', price: 0, available: true},
            {id: 2, time: 'ساعت ۱۲ تا ۱۵', price: 0, available: true},
            {id: 3, time: 'ساعت ۱۵ تا ۱۸', price: 0, available: true},
            {id: 4, time: 'ساعت ۱۸ تا ۲۱', price: 0, available: false},
            {id: 5, time: 'ساعت ۲۱ تا ۲۴', price: 0, available: false},
        ];

        // ۲. اگر دیتا از سرور آمده، آن را جایگزین کنیم
        if (rawSettings.value?.timeSlots?.slots && Array.isArray(rawSettings.value.timeSlots.slots)) {
            // استفاده از دیتای سرور
            return rawSettings.value.timeSlots.slots;
        }

        // ۳. در غیر این صورت دیتای پیش‌فرض
        return defaults;
    });

    // ────────────── Actions ──────────────
    const fetchSettings = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<MarketSettingsApiResponse>('/market/shop/settings');
            rawSettings.value = response.data;
            // مهم: مقداردهی pharmacyInfo از روی داده‌های دریافتی
            if (response.data?.shopInfo) {
                shopInfo.value = { ...shopInfo.value, ...response.data.shopInfo };
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to load settings';
            console.error('Error fetching settings:', err);
        } finally {
            loading.value = false;
        }
    };

    const base64ToFile = async (base64String: string, filename = 'upload.png'): Promise<File> => {
        const blob = await fetch(base64String).then(res => res.blob());
        return new File([blob], filename, {type: blob.type});
    };

    const saveShopInfo = async (infoData: Partial<ShopInfo>) => {
        saving.value = true;
        error.value = null;
        try {
            // ۱. استخراج مقدار خام
            const rawData = toValue(infoData);

            // ۲. مدیریت آپلود لوگو
            let logoUrl;
            let file;
            if (typeof rawData.logo === 'string' && rawData.logo.startsWith('data:image')) {
                file = await base64ToFile(rawData.logo, 'image.png');
                logoUrl = await uploader.uploadImage(file);
            } else if (rawData.logo instanceof File) {
                logoUrl = await uploader.uploadImage(rawData.logo);
            } else {
                logoUrl = rawData.logo;
            }

            // ۳. ساخت یک کپی تمیز
            const plainData = JSON.parse(JSON.stringify(rawData));

            // ۴. آماده‌سازی نهایی payload
            const payload = {...plainData, logo: logoUrl};

            // ارسال به سرور
            await axios.put('/market/shop/settings/bulk', {shopInfo: payload});

            // آپدیت وضعیت محلی
            if (rawSettings.value) {
                rawSettings.value.shopInfo = {...rawSettings.value.shopInfo, ...payload};
            } else {
                rawSettings.value = {shopInfo: payload as ShopInfo};
            }
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to save shop info';
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const saveShippingSettings = async (shippingData: ShippingConfig) => {
        saving.value = true;
        error.value = null;
        try {
            const methods: ShippingMethodDto[] = [
                {type: 'inPerson', isActive: shippingData.inPerson, deliveryTime: shippingData.inPersonDeliveryTime, price: Number(0)},
                {type: 'petomanCourier', isActive: shippingData.petomanCourier, deliveryTime: shippingData.petomanCourierDeliveryTime, price: Number(shippingData.petomanCourierPrice) || 0},
                {type: 'shopCourier', isActive: shippingData.shopCourier, deliveryTime: shippingData.shopCourierDeliveryTime, price: Number(shippingData.shopCourierPrice) || 0},
                {type: 'tipax', isActive: shippingData.tipax, deliveryTime: shippingData.tipaxDeliveryTime, price: Number(shippingData.tipaxPrice) || 0},
                {type: 'alopeyk', isActive: shippingData.alopeyk, deliveryTime: shippingData.alopeykDeliveryTime, price: Number(shippingData.alopeykPrice) || 0},
                {type: 'post', isActive: shippingData.post, deliveryTime: shippingData.postDeliveryTime, price: Number(shippingData.postPrice) || 0}
            ];

            // ارسال به سرور
            await axios.put('/market/shop/settings/shipping', {methods});

            // اصلاحیه: آپدیت کردن rawSettings با ساختار صحیح (shipping_methods)
            if (rawSettings.value) {
                // اگر قبلا آبجکت shipping_methods وجود نداشت، آن را می‌سازیم
                if (!rawSettings.value.shipping_methods) {
                    rawSettings.value.shipping_methods = {methods: []};
                }
                rawSettings.value.shipping_methods.methods = methods;
            } else {
                rawSettings.value = {shipping_methods: {methods}};
            }
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to save shipping settings';
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const updateTimeSlots = async (timeSlots: TimeSlot) => {

        try {
            // ارسال به سرور
            await axios.put('/market/shop/settings/timeSlots', {timeSlots});

            if (rawSettings.value) {

                if (!rawSettings.value.timeSlots) {
                    rawSettings.value.timeSlots = {timeSlots: []};
                }
                rawSettings.value.timeSlots = timeSlots;
            } else {
                rawSettings.value = {timeSlots: {timeSlots}};
            }
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to save shipping settings';
            throw err;
        } finally {
            saving.value = false;
        }
    };

    // تابع کمکی برای فرمت کردن تاریخ
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fa-IR');
    };

    // ────────────── Actions (Admin) ──────────────
    /**
     * دریافت لیست تغییرات در انتظار تایید
     */
    const fetchPendingEdits = async () => {
        loadingPending.value = true;
        try {
            const response = await axios.get<any[]>('/admin/shops/settings/pending-changes');

            // تبدیل داده‌های خام به فرمت مورد نظر پنل
            pendingEdits.value = response.data.map((item) => {
                console.log('changedKeys', !item.changes, !item.changes.newValues)
                // بررسی وجود آبجکت changes و newValues
                if (!item.changes || !item.changes.newValues) {

                    return [];
                }

                // استخراج کلیدهای فیلدهای تغییر کرده از newValues
                const changedKeys = Object.keys(item.changes.newValues);

                // اگر چند فیلد همزمان تغییر کرده باشد، برای هر کدام یک آیتم می‌سازیم
                return changedKeys.map((key) => {
                    return {
                        id: item.id,
                        tenantId: item.tenant?.id,
                        entityType: 'market', // چون این استور مارکت است
                        entityName: item.tenant?.name || 'فروشگاه',
                        owner: item.tenant?.ownerName || '-',
                        changeType: key,
                        changeLabel: fieldLabels[key] || `تغییر ${key}`,
                        // مقدار قبلی را از oldValues می‌خوانیم
                        oldValue: item.changes.oldValues ? item.changes.oldValues[key] : undefined,
                        // مقدار جدید را از newValues می‌خوانیم
                        newValue: item.changes.newValues[key],
                        requestDate: formatDate(item.createdAt),
                        note: `تغییر ${key}` || item.description || ''
                    };
                });
            }).flat();
        } catch (err: any) {
            console.error('Error fetching pending edits:', err);
            // مدیریت خطا
        } finally {
            loadingPending.value = false;
        }
    };

    /**
     * تایید، رد یا درخواست اصلاح یک تغییر
     */
    const approveChange = async (tenantId: string, status: 'approved' | 'rejected' | 'correction_required', reason?: string) => {
        try {
            await axios.post('/admin/shops/settings/approve-change', {
                tenantId,
                status,
                reason
            });
            // رفرش لیست پس از موفقیت
            await fetchPendingEdits();
            return true;
        } catch (err: any) {
            console.error('Error approving change:', err);
            throw err;
        }
    };

    // ────────────── Return ──────────────
    return {
        loading,
        saving,
        error,
        rawSettings,
        timeSlots,
        shipping,
        shopInfo,
        fetchSettings,
        saveShopInfo,
        saveShippingSettings,
        // موارد جدید مربوط به مدیریت
        pendingEdits,
        loadingPending,
        fetchPendingEdits,
        approveChange,
        updateTimeSlots
    };
});