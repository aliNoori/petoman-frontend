import { defineStore } from "pinia";
import { safeStorage } from "../utils/safeStorage";
import { ref, computed } from "vue";
import { useNuxtApp } from "nuxt/app";
import type { AxiosInstance } from "axios";

// تعریف اینترفیس تخفیف
export interface Discount {
    id: string;
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    description?: string;
    minPurchase?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usedCount: number;
    expireDate: string;
    isActive: boolean;
    isExpired?: boolean;
    createdAt: string;
}

export const useDiscountStore = defineStore("discount", () => {
    const discounts = ref<Discount[]>([]);
    const { $axios } = useNuxtApp();
    const axios = $axios as AxiosInstance;
    const loading = ref(false);

    /**
     * دریافت لیست کدهای تخفیف کاربر
     */
    const fetchMyDiscounts = async () => {
        loading.value = true;
        try {
            const res = await axios.get("/discounts/my");
            // محاسبه وضعیت انقضا برای هر آیتم و ذخیره در استیت
            discounts.value = res.data.map((item: any) => ({
                ...item,
                isExpired: item.expireDate ? new Date(item.expireDate) < new Date() : false
            }));
            safeStorage.setItem("my_discounts", JSON.stringify(discounts.value));
        } catch (err) {
            console.error("Failed to fetch discounts:", err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * دریافت (Claim) کردن یک کد تخفیف برای کاربر
     */
    const claimDiscountCode = async (code: string) => {
        loading.value = true;
        try {
            const res = await axios.post("/discounts/claim", { code });

            // آپدیت کردن لیست لوکال (اختیاری: اگر سرور آبجکت کامل را برمی‌گرداند)
            // در اینجا فرض می‌کنیم سرور آبجکت کد تخفیف را برمی‌گرداند
            const claimedDiscount = {
                ...res.data,
                isExpired: res.data.expireDate ? new Date(res.data.expireDate) < new Date() : false
            };

            // اضافه کردن به لیست اگر وجود نداشته باشد
            const exists = discounts.value.find(d => d.id === claimedDiscount.id);
            if (!exists) {
                discounts.value.unshift(claimedDiscount);
            } else {
                // اگر وجود داشت (مثلاً آپدیت شد)، جایگزین می‌کنیم
                const index = discounts.value.findIndex(d => d.id === claimedDiscount.id);
                if (index !== -1) {
                    discounts.value[index] = claimedDiscount;
                }
            }

            return claimedDiscount;
        } catch (err) {
            console.error("Failed to claim discount:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * اعمال کد تخفیف
     */
    const applyDiscountCode = async (code: string, cartTotal: number) => {
        loading.value = true;
        try {
            const res = await axios.post("/discounts/apply", { code, cartTotal });
            return res.data;
        } catch (err) {
            console.error("Failed to apply discount:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        discounts,
        loading,
        fetchMyDiscounts,
        claimDiscountCode,
        applyDiscountCode,
    };
});