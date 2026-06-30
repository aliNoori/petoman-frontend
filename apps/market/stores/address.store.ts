import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useNuxtApp } from "nuxt/app"
import type { AxiosInstance } from "axios"

// تعریف اینترفیس برای مختصات
interface Coordinates {
    lat: number
    lng: number
}

// تعریف اینترفیس برای ساختار کامل آدرس دریافتی از نقشه
interface FullAddressDetails {
    display_name?: string
    lat?: number
    lng?: number
    [key: string]: any // برای سایر فیلدهای اضافی نقشه
}

export interface Address {
    id?: string | number
    title: string // مثلاً خانه، محل کار
    receiver: string // نام گیرنده
    phone: string // شماره تماس
    plaque?: string // پلاک
    unit?: string // واحد
    province?: string
    city?: string

    // این فیلد ساختار پیچیده‌تری دارد که از کامپوننت نقشه می‌آید
    fullAddress?: FullAddressDetails

    // اگر بک‌اند انتظار فیلد location به صورت جداگانه دارد:
    location?: Coordinates | null

    createdAt?: string
}

export const useAddressStore = defineStore("address", () => {
    const address = ref<Address | null>(null) // آدرس تکی (مثلاً آدرس پیش‌فرض)
    const addresses = ref<Address[]>([]) // لیست تمام آدرس‌ها
    const loading = ref(false)

    const { $axios } = useNuxtApp()
    const axios = $axios as AxiosInstance

    /**
     * افزودن آدرس جدید
     * @param payload داده‌های آدرس (مطابق اینترفیس Address)
     */
    const addUserAddress = async (payload: Address) => {
        loading.value = true
        try {
            // ارسال داده‌های آدرس به سرور
            // نکته: مطمئن شوید بک‌اند فیلد fullAddress یا location را دریافت می‌کند
            const res = await axios.post("/user/addresses", payload)

            if (res.data) {
                // اضافه کردن به لیست محلی
                addresses.value.unshift(res.data) //.unshift برای نمایش جدیدترین در ابتدا

                // اگر این آدرس به عنوان پیش‌فرض انتخاب شده، آن را به عنوان آدرس اصلی ست کنیم
                if (payload.isDefault) {
                    address.value = res.data
                }
            }
            return res.data
        } catch (err) {
            console.error("Failed to add user address:", err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * دریافت لیست آدرس‌های کاربر
     */
    const fetchUserAddresses = async () => {
        loading.value = true
        try {
            const res = await axios.get("/user/addresses")
            // مطمئن شویم که آرایه برمی‌گرداند
            const data = Array.isArray(res.data) ? res.data : []

            addresses.value = data

            // پیدا کردن آدرس پیش‌فرض به صورت خودکار
            const defaultAddr = data.find((addr: Address) => addr.isDefault === true)
            if (defaultAddr) {
                address.value = defaultAddr
            }
        } catch (err) {
            console.error("Failed to fetch user addresses:", err)
            addresses.value = [] // در صورت خطا لیست خالی شود
        } finally {
            loading.value = false
        }
    }

    /**
     * حذف آدرس
     * @param id شناسه آدرس
     */
    const deleteUserAddress = async (id: string | number) => {
        loading.value = true
        try {
            await axios.delete(`/user/addresses/${id}`)

            // حذف از لیست محلی
            addresses.value = addresses.value.filter(addr => addr.id !== id)

            // اگر آدرس حذف شده، آدرس پیش‌فرض را به‌روز کن
            if (address.value?.id === id) {
                address.value = addresses.value.find((addr: Address) => addr.isDefault === true) || null
            }
        } catch (err) {
            console.error("Failed to delete user address:", err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * ویرایش آدرس
     * @param id شناسه آدرس
     * @param payload داده‌های جدید
     */
    const updateUserAddress = async (id: string | number, payload: Partial<Address>) => {
        loading.value = true
        try {
            const res = await axios.patch(`/user/addresses/${id}`, payload)

            // به‌روزرسانی در لیست محلی
            const index = addresses.value.findIndex(addr => addr.id === id)
            if (index !== -1) {
                addresses.value[index] = res.data
            }

            return res.data
        } catch (err) {
            console.error("Failed to update user address:", err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        address,
        addresses,
        loading,
        addUserAddress,
        fetchUserAddresses,
        deleteUserAddress, // اضافه کردن متد حذف
        updateUserAddress, // اضافه کردن متد ویرایش
    }
})