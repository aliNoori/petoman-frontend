import {defineStore} from 'pinia';
import {computed, inject, ref, toValue} from 'vue';
import {type AxiosInstance} from 'axios';
import {axiosKey} from "../../plugins/axiosPlugins";
import {useUploader} from "../../composables/useUploader";

// ────────────── Pending Edits (Admin) Types & State ──────────────
export interface PendingEditItem {
    id: string; // UUID از سرور
    entityType: 'market' | 'pharmacy' | 'clinic'; // در اینجا معمولا market است
    entityName: string; // نام فروشگاه از pharmacyInfo.name
    owner: string; // نام صاحب امتیاز از pharmacyInfo.ownerName
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
    pharmacyCourier: boolean;
    pharmacyCourierDeliveryTime: string;
    pharmacyCourierPrice: string | number;
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

export interface PharmacyInfo {
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

export interface PharmacySettingsApiResponse {
    pharmacyInfo?: PharmacyInfo;
    shipping_methods?: { methods: ShippingMethodDto[] };
}

export interface ShippingMethodDto {
    type: string;
    isActive: boolean;
    deliveryTime?: string;
    price?: number;
}

export const usePharmacySettingsStore = defineStore('pharmacySettingsStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    const uploader = useUploader();

    const loading = ref(false);
    const saving = ref(false);
    const error = ref<string | null>(null);
    const rawSettings = ref<PharmacySettingsApiResponse | null>(null);

    // ────────────── Computed ──────────────
    const shipping = computed<ShippingConfig>(() => {
        const defaults: ShippingConfig = {
            inPerson: false, inPersonDeliveryTime: '',
            petomanCourier: false, petomanCourierDeliveryTime: '',petomanCourierPrice:'',
            pharmacyCourier: false, pharmacyCourierDeliveryTime: '', pharmacyCourierPrice: '',
            tipax: false, tipaxDeliveryTime: '',tipaxPrice:'',
            alopeyk: false, alopeykDeliveryTime: '',alopeykPrice:'',
            post: false, postDeliveryTime: '',postPrice:''
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
            } else if (method.type === 'pharmacyCourier') {
                mapped.pharmacyCourier = method.isActive;
                mapped.pharmacyCourierDeliveryTime = method.deliveryTime || '';
                mapped.pharmacyCourierPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'tipax') {
                mapped.tipax = method.isActive;
                mapped.tipaxDeliveryTime = method.deliveryTime || '';
                mapped.tipaxPrice = method.price ? String(method.price) : '';
            } else if (method.type === 'post') {
                mapped.post = method.isActive;
                mapped.postDeliveryTime = method.deliveryTime || '';
                mapped.postPrice = method.price ? String(method.price) : '';
            }else if (method.type === 'alopeyk') {
                mapped.alopeyk = method.isActive;
                mapped.alopeykDeliveryTime = method.deliveryTime || '';
                mapped.alopeykPrice = method.price ? String(method.price) : '';
            }
        });

        return { ...defaults, ...mapped };
    });

    // ────────────── State & Refs ──────────────
    const pharmacyInfo = ref<PharmacyInfo>({
        logo: '', name: '', description: '',
        licenseNumber: '', medicalSystemCode: '', ownerNationalId: '', ownerName: '',
        phone: '', mobile: '', email: '', website: '',
        province: '', city: '', postalCode: '', address: '',
        is24Hours: false, openTime: '', closeTime: '', closedDays: [],
        isApproved: true, pendingChanges: false
    });

// ────────────── Actions ──────────────

    const fetchSettings = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<PharmacySettingsApiResponse>('/pharmacy/all/settings');
            rawSettings.value = response.data;

            // مهم: مقداردهی pharmacyInfo از روی داده‌های دریافتی
            if (response.data?.pharmacyInfo) {
                pharmacyInfo.value = { ...pharmacyInfo.value, ...response.data.pharmacyInfo };
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
        return new File([blob], filename, { type: blob.type });
    };

    const savePharmacyInfo = async (infoData: Partial<PharmacyInfo>) => {
        saving.value = true;
        error.value = null;
        try {
            const rawData = toValue(infoData);

            // مدیریت لوگو (همان کد قبلی)
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

            const plainData = JSON.parse(JSON.stringify(rawData));
            const payload = { ...plainData, logo: logoUrl };

            await axios.put('/pharmacy/all/settings/bulk', { pharmacyInfo: payload });

            // آپدیت کردن pharmacyInfo محلی بعد از ذخیره موفق
            pharmacyInfo.value = { ...pharmacyInfo.value, ...payload };

            // همچنین rawSettings را هم آپدیت کنید برای هماهنگی
            if (rawSettings.value) {
                rawSettings.value.pharmacyInfo = pharmacyInfo.value;
            }

            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to save pharmacy info';
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
                { type: 'inPerson', isActive: shippingData.inPerson, deliveryTime: shippingData.inPersonDeliveryTime,price: Number(0) },
                { type: 'petomanCourier', isActive: shippingData.petomanCourier, deliveryTime: shippingData.petomanCourierDeliveryTime ,price: Number(shippingData.petomanCourierPrice) || 0 },
                { type: 'pharmacyCourier', isActive: shippingData.pharmacyCourier, deliveryTime: shippingData.pharmacyCourierDeliveryTime, price: Number(shippingData.pharmacyCourierPrice) || 0 },
                { type: 'tipax', isActive: shippingData.tipax, deliveryTime: shippingData.tipaxDeliveryTime,price: Number(shippingData.tipaxPrice) || 0  },
                { type: 'alopeyk', isActive: shippingData.alopeyk, deliveryTime: shippingData.alopeykDeliveryTime,price: Number(shippingData.alopeykPrice) || 0  },
                { type: 'post', isActive: shippingData.post, deliveryTime: shippingData.postDeliveryTime,price: Number(shippingData.postPrice) || 0 }
            ];

            // ارسال به سرور
            await axios.put('/pharmacy/all/settings/shipping', { methods });

            // اصلاحیه: آپدیت کردن rawSettings با ساختار صحیح (shipping_methods)
            if (rawSettings.value) {
                // اگر قبلا آبجکت shipping_methods وجود نداشت، آن را می‌سازیم
                if (!rawSettings.value.shipping_methods) {
                    rawSettings.value.shipping_methods = { methods: [] };
                }
                rawSettings.value.shipping_methods.methods = methods;
            } else {
                rawSettings.value = { shipping_methods: { methods } };
            }
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to save shipping settings';
            throw err;
        } finally {
            saving.value = false;
        }
    };
    // ────────────── Return ──────────────
    return {
        loading,
        saving,
        error,
        rawSettings,
        shipping,
        pharmacyInfo,
        fetchSettings,
        savePharmacyInfo,
        saveShippingSettings,
    };
});