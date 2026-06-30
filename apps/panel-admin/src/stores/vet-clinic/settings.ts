import { defineStore } from 'pinia';
import { computed, inject, ref, toValue } from 'vue';
import { type AxiosInstance } from 'axios';
import { axiosKey } from "../../plugins/axiosPlugins";
import { useUploader } from "../../composables/useUploader";

// ────────────── Types & Interfaces ──────────────
export interface TenantSpecialty {
    id: string;
    code: string;
    label: string;
    isActive: boolean;
}
export interface PendingEditItem {
    id: string; // شناسه یکتا برای هر ردیف (ترکیب requestId و فیلد)
    requestId: string; // شناسه اصلی درخواست برای ارسال به سرور
    entityType: 'market' | 'pharmacy' | 'clinic';
    entityName: string;
    owner: string;
    changeType: string; // نام فیلد (مثلا logo, address)
    changeLabel: string; // برچسب فارسی
    oldValue: any; // مقدار قبلی آن فیلد خاص
    newValue: any; // مقدار جدید آن فیلد خاص
    requestDate: string;
    note: string;
}

export interface VetClinicInfo {
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
    isApproved: boolean;
    pendingChanges: boolean;
    // --- فیلدهای جدید اضافه شده ---
    specialty?: string;
    experience?: string;
    education?: string[];
    specialties?: string[];
}

export interface VisitPricing {
    inPerson: { enabled: boolean; price: string };
    home: { enabled: boolean; price: string };
    chat: { enabled: boolean; price: string };
    phoneInstant: { enabled: boolean; price: string };
}

export interface PhoneScheduleOptions {
    min15: { enabled: boolean; price: string };
    min30: { enabled: boolean; price: string };
    hour1: { enabled: boolean; price: string };
    custom: { enabled: boolean; price: string };
}

export interface PhoneScheduleSettings {
    enabled: boolean;
    options: PhoneScheduleOptions;
}

export interface VetClinicSettingsApiResponse {
    clinicInfo?: VetClinicInfo;
    visitPricing?: VisitPricing;
    phoneScheduleSettings?: PhoneScheduleSettings;
}

// لیست برچسب‌های فارسی برای فیلدها
const fieldLabels: Record<string, string> = {
    logo: 'لوگو',
    name: 'نام کلینیک',
    description: 'توضیحات',
    licenseNumber: 'شماره پروانه',
    medicalSystemCode: 'کد نظام پزشکی',
    ownerNationalId: 'کد ملی مالک',
    ownerName: 'نام مالک',
    phone: 'تلفن ثابت',
    mobile: 'موبایل',
    email: 'ایمیل',
    website: 'وب‌سایت',
    province: 'استان',
    city: 'شهر',
    postalCode: 'کد پستی',
    address: 'آدرس',
    // --- برچسب‌های جدید ---
    specialty: 'تخصص اصلی',
    experience: 'سابقه کار',
    education: 'تحصیلات',
    specialties: 'حوزه‌های تخصصی',
    // برای قیمت‌گذاری (اگر نیاز به تفکیک ریز داشتید)
    enabled: 'وضعیت فعال‌سازی',
    price: 'قیمت'
};

export const useVetClinicSettingsStore = defineStore('vetClinicSettingsStore', () => {
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');
    const uploader = useUploader();

    // State های مربوط به ادمین
    const pendingEdits = ref<PendingEditItem[]>([]);
    const specialities=ref<TenantSpecialty[]>([])
    const loadingPending = ref(false);

    // State
    const loading = ref(false);
    const saving = ref(false);
    const error = ref<string | null>(null);
    const rawSettings = ref<VetClinicSettingsApiResponse | null>(null);

    // ────────────── Computed ──────────────

    const clinicInfo = computed<VetClinicInfo>(() => {
        const defaults: VetClinicInfo = {
            logo: '', name: '', description: '',
            licenseNumber: '', medicalSystemCode: '', ownerNationalId: '', ownerName: '',
            phone: '', mobile: '', email: '', website: '',
            province: '', city: '', postalCode: '', address: '',
            isApproved: true, pendingChanges: false,// مقادیر پیش‌فرض جدید
            specialty: '',
            experience: '0',
            education: [],
            specialties: []
        };
        if (!rawSettings.value?.clinicInfo) return defaults;
        return { ...defaults, ...rawSettings.value.clinicInfo };
    });

    const visitPricing = computed<VisitPricing>(() => {
        const defaults: VisitPricing = {
            inPerson: { enabled: false, price: '' },
            home: { enabled: false, price: '' },
            chat: { enabled: false, price: '' },
            phoneInstant: { enabled: false, price: '' }
        };
        if (!rawSettings.value?.visitPricing) return defaults;
        return {
            inPerson: { ...defaults.inPerson, ...rawSettings.value.visitPricing.inPerson },
            home: { ...defaults.home, ...rawSettings.value.visitPricing.home },
            chat: { ...defaults.chat, ...rawSettings.value.visitPricing.chat },
            phoneInstant: { ...defaults.phoneInstant, ...rawSettings.value.visitPricing.phoneInstant }
        };
    });

    const phoneScheduleSettings = computed<PhoneScheduleSettings>(() => {
        const defaults: PhoneScheduleSettings = {
            enabled: false,
            options: {
                min15: { enabled: false, price: '' },
                min30: { enabled: false, price: '' },
                hour1: { enabled: false, price: '' },
                custom: { enabled: false, price: '' }
            }
        };
        if (!rawSettings.value?.phoneScheduleSettings) return defaults;
        const serverOptions = rawSettings.value.phoneScheduleSettings.options || {};
        return {
            enabled: rawSettings.value.phoneScheduleSettings.enabled,
            options: {
                min15: { ...defaults.options.min15, ...serverOptions.min15 },
                min30: { ...defaults.options.min30, ...serverOptions.min30 },
                hour1: { ...defaults.options.hour1, ...serverOptions.hour1 },
                custom: { ...defaults.options.custom, ...serverOptions.custom }
            }
        };
    });

    // ────────────── Actions ──────────────

    const fetchSettings = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get<VetClinicSettingsApiResponse>('/vetClinic/settings/all');
            rawSettings.value = response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'خطا در بارگذاری تنظیمات';
            console.error('Error fetching settings:', err);
        } finally {
            loading.value = false;
        }
    };

    const base64ToFile = async (base64String: string, filename = 'upload.png'): Promise<File> => {
        const blob = await fetch(base64String).then(res => res.blob());
        return new File([blob], filename, { type: blob.type });
    };

    const saveClinicInfo = async (infoData: Partial<VetClinicInfo>) => {
        saving.value = true;
        error.value = null;
        let logoUrl: string | undefined | File = undefined;
        try {
            const rawData = toValue(infoData);
            if (typeof rawData.logo === 'string' && rawData.logo.startsWith('data:image')) {
                const file = await base64ToFile(rawData.logo, 'image.png');
                logoUrl = await uploader.uploadImage(file);
            } else if (rawData.logo instanceof File) {
                logoUrl = await uploader.uploadImage(rawData.logo);
            } else {
                logoUrl = rawData.logo;
            }
            const plainData = JSON.parse(JSON.stringify(rawData));

            const payload = { ...plainData, logo: logoUrl };

            await axios.put('/vetClinic/settings/info', payload);

            if (rawSettings.value) {
                rawSettings.value.clinicInfo = { ...rawSettings.value.clinicInfo, ...payload };
            } else {
                rawSettings.value = { clinicInfo: payload as VetClinicInfo };
            }
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'خطا در ذخیره اطلاعات کلینیک';
            //await cleanupFiles([logoUrl]);
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const savePricingSettings = async (pricingData: VisitPricing, scheduleData: PhoneScheduleSettings) => {
        saving.value = true;
        error.value = null;
        try {
            const payload = {
                visitPricing: pricingData,
                phoneScheduleSettings: scheduleData
            };
            await axios.put('/vetClinic/settings/pricing', payload);
            if (rawSettings.value) {
                rawSettings.value.visitPricing = pricingData;
                rawSettings.value.phoneScheduleSettings = scheduleData;
            } else {
                rawSettings.value = payload;
            }
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'خطا در ذخیره قیمت‌ها';
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const changePassword = async (passwords: { current: string; new: string }) => {
        saving.value = true;
        error.value = null;
        try {
            await axios.post('/vetClinic/settings/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            return true;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'خطا در تغییر رمز عبور';
            throw err;
        } finally {
            saving.value = false;
        }
    };

    const cleanupFiles = async (fileUrls: string[]) => {
        if (!fileUrls || fileUrls.length === 0) return;
        try {
            await axios.post('/v1/uploads/cleanup', { urls: fileUrls });
        } catch (e) {
            console.warn('⚠️ Failed to cleanup orphaned files:', e);
        }
    };

    // ────────────── Admin Actions ──────────────

    /**
     * تابع کمکی برای تبدیل آبجکت‌های تو در تو به لیست فلت تغییرات
     * این تابع دو آبجکت old و new را مقایسه کرده و فیلدهای تغییر یافته را برمی‌گرداند
     */
    const flattenChanges = (
        oldObj: any,
        newObj: any,
        prefix: string = ''
    ): PendingEditItem[] => {
        const items: PendingEditItem[] = [];
        const targetOld = oldObj || {};
        const targetNew = newObj || {};
        const allKeys = new Set([...Object.keys(targetOld), ...Object.keys(targetNew)]);

        allKeys.forEach(key => {
            const valOld = targetOld[key];
            const valNew = targetNew[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;

            // بررسی تغییر
            if (JSON.stringify(valOld) !== JSON.stringify(valNew)) {

                // اگر مقدار آرایه بود، آن را به عنوان یک آیتم واحد اضافه کن
                if (Array.isArray(valNew) || Array.isArray(valOld)) {
                    items.push({
                        id: '',
                        requestId: '',
                        entityType: 'clinic',
                        entityName: '',
                        owner: '',
                        changeType: fullKey,
                        changeLabel: fieldLabels[fullKey] || fieldLabels[key] || `تغییر ${key}`,
                        oldValue: valOld,
                        newValue: valNew,
                        requestDate: '',
                        note: ''
                    });
                }
                // اگر مقدار آبجکت تو در تو بود (غیر آرایه)
                else if (typeof valNew === 'object' && valNew !== null) {
                    const nestedItems = flattenChanges(valOld, valNew, fullKey);
                    items.push(...nestedItems);
                }
                // اگر مقدار اولیه (رشته، عدد و ...) بود
                else {
                    items.push({
                        id: '',
                        requestId: '',
                        entityType: 'clinic',
                        entityName: '',
                        owner: '',
                        changeType: fullKey,
                        changeLabel: fieldLabels[fullKey] || fieldLabels[key] || `تغییر ${key}`,
                        oldValue: valOld,
                        newValue: valNew,
                        requestDate: '',
                        note: ''
                    });
                }
            }
        });
        return items;
    };

    const fetchPendingEdits = async () => {
        loadingPending.value = true;
        try {
            const response = await axios.get<any[]>('/admin/tenants/settings-requests');

            const result: PendingEditItem[] = [];

            response.data.forEach((item) => {
                const proposedData = item.proposedValue || {};
                const currentData = item.currentValue || {};

                // استخراج نام کلینیک و مالک
                const clinicName = proposedData.name || currentData.name || item.tenant?.name || 'کلینیک';
                const ownerName = proposedData.ownerName || currentData.ownerName || item.tenant?.ownerName || '-';
                const requestDate = new Date(item.createdAt).toLocaleDateString('fa-IR');

                // استفاده از تابع flattenChanges برای شکستن آبجکت‌ها
                const changes = flattenChanges(currentData, proposedData);

                // اضافه کردن اطلاعات مشترک به هر آیتم تغییر یافته
                changes.forEach(change => {
                    result.push({
                        ...change,
                        // ساخت یک ID منحصر به فرد برای هر ردیف (ترکیب requestId و نام فیلد)
                        id: `${item.id}_${change.changeType}`,
                        // شناسه اصلی درخواست برای ارسال به سرور
                        requestId: item.id,
                        entityName: clinicName,
                        owner: ownerName,
                        requestDate: requestDate,
                        note: item.rejectionReason || ''
                    });
                });
            });

            pendingEdits.value = result;
        } catch (err: any) {
            console.error('Error fetching pending edits:', err);
        } finally {
            loadingPending.value = false;
        }
    };

    /**
     * تایید یا رد کردن درخواست تغییر
     * @param item آیتم انتخاب شده از لیست
     * @param isApproved true برای تایید، false برای رد
     * @param reason دلیل رد
     */
    const approveChange = async (item: PendingEditItem, isApproved: boolean, reason?: string) => {
        try {
            // ما از item.requestId استفاده می‌کنیم که شناسه واقعی درخواست در دیتابیس است
            await axios.patch(`/admin/tenants/settings-requests/${item.requestId}/process`, {
                isApproved,
                reason
            });

            // رفرش لیست
            await fetchPendingEdits();
            return true;
        } catch (err: any) {
            console.error('Error processing change:', err);
            throw err;
        }
    };


    const fetchSpecialties=async ():Promise<TenantSpecialty[]>=> {
        try {
            const res = await axios.get<TenantSpecialty[]>('/user/tenants/specialties')
            specialities.value=res.data
            console.log('specialities',specialities.value)
        } catch (e) {
            console.warn('⚠️ Axios request failed, using mock data')
        }
    }
    // ────────────── Return ──────────────
    return {
        loading,
        saving,
        error,
        specialities,
        rawSettings,
        clinicInfo,
        visitPricing,
        phoneScheduleSettings,
        fetchSettings,
        fetchSpecialties,
        saveClinicInfo,
        savePricingSettings,
        changePassword,
        // Admin related
        pendingEdits,
        loadingPending,
        fetchPendingEdits,
        approveChange
    };
});