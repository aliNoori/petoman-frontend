import {defineStore} from 'pinia'
import {inject, ref} from 'vue'
import {useUploader} from "../../composables/useUploader";
import {axiosKey} from "../../plugins/axiosPlugins";
import {AxiosInstance} from "axios";

// تعریف تایپ‌ها
export interface PharmacyMedicine {
    id: string
    name: string
    code: string
    type: 'medicine'
    category: string
    categoryId: number | null
    description: string
    image: string | null
    galleryImages: string[]
    price: number
    stock: number
    isActive: boolean
    activeIngredient: string
    dosageForm: string
    dosage: string
    suitableFor: string
    storage: string
    prescriptionRequired: boolean
    expiryDate: string | null
    createdAt: string
    updatedAt?: string
}

export const useMedicineStore = defineStore('medicineStore', () => {
    // ────────────── State ──────────────
    const medicines = ref<PharmacyMedicine[]>([])
    const globalMedicines = ref<PharmacyMedicine[]>([])
    const loading = ref(false)
    const error = ref(null)
    const uploader = useUploader()
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // ────────────── Helper: Cleanup ──────────────
    /**
     * پاکسازی فایل‌های آپلود شده در صورت بروز خطا
     */
    const cleanupFiles = async (fileUrls: string[]) => {
        if (!fileUrls || fileUrls.length === 0) return;
        try {
            // فرض بر این است که اندپوینت cleanup در سرور دارید
            await axios.post('/v1/uploads/cleanup', {urls: fileUrls});
        } catch (e) {
            console.warn('⚠️ Failed to cleanup orphaned files:', e);
        }
    }

    // ────────────── API Actions ──────────────

    // دریافت لیست داروها
    const fetchMedicines = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('/pharmacy/medicines')
            medicines.value = res.data.data
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching medicines:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchGlobalMedicines = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('/pharmacy/medicines/global/global-medicines')
            globalMedicines.value = res.data.data
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching medicines:', err)
        } finally {
            loading.value = false
        }
    }

    // دریافت یک دارو بر اساس ID
    const getById = async (id: string) => {
        const res = await axios.get(`/pharmacy/medicines/${id}`)
        return res.data.data
    }

    // افزودن داروی جدید
    const createMedicine = async (data: any) => {
        // 1. آپلود تصویر اصلی
        let mainImageUrl = null
        if (data.image instanceof File) {
            mainImageUrl = await uploader.uploadImage(data.image)
        }

        // 2. آپلود گالری تصاویر
        const galleryUrls: string[] = []
        if (data.galleryImages && Array.isArray(data.galleryImages)) {
            for (const img of data.galleryImages) {
                if (img instanceof File) {
                    const url = await uploader.uploadImage(img)
                    if (url) {
                        galleryUrls.push(url)
                    }
                } else if (typeof img === 'string') {
                    galleryUrls.push(img)
                }
            }
        }

        // 3. ساخت Payload نهایی
        const payload = {
            ...data,
            type: 'medicine',
            image: mainImageUrl,
            galleryImages: galleryUrls
        }

        // 4. ارسال به سرور
        const res = await axios.post('/pharmacy/medicines', payload)

        // 5. افزودن به لیست لوکال
        medicines.value = res.data.data
        return res.data
    }

    // ویرایش دارو
    const updateMedicine = async (id: string, data: any) => {

        // 1. مدیریت تصویر اصلی
        let mainImageUrl = data.image
        if (data.image instanceof File) {
            mainImageUrl = await uploader.uploadImage(data.image)
        }

        // 2. مدیریت گالری تصاویر
        const galleryUrls: string[] = []
        if (data.galleryImages && Array.isArray(data.galleryImages)) {
            for (const img of data.galleryImages) {
                if (img instanceof File) {
                    const url = await uploader.uploadImage(img)
                    if (url) {
                        galleryUrls.push(url)
                    }
                } else if (typeof img === 'string') {
                    galleryUrls.push(img)
                }
            }
        }

        // 3. ساخت Payload
        const payload = {
            ...data,
            image: mainImageUrl,
            galleryImages: galleryUrls
        }

        // 4. ارسال درخواست Patch
        const res = await axios.patch(`/pharmacy/medicines/${id}`, payload)

        // 5. آپدیت لوکال استیت
        const index = medicines.value.findIndex(p => p.id === id)
        if (index !== -1) {
            medicines.value[index] = res.data.data
        }
        return res.data
    }

    // حذف دارو
    const deleteMedicine = async (id: string) => {

        await axios.delete(`/pharmacy/medicines/${id}`)
        const index = medicines.value.findIndex(p => p.id === id)
        if (index !== -1) {
            medicines.value.splice(index, 1)
        }
        return true
    }

    // تغییر وضعیت فعال/غیرفعال
    const updateMedicineStatus = async (productId: string, isActive: boolean) => {

        await axios.patch(`/pharmacy/medicines/update-status/${productId}`, {
            isActive: isActive
        })
        const productIndex = medicines.value.findIndex(p => p.id === productId)
        if (productIndex !== -1) {
            medicines.value[productIndex].isActive = isActive
        }
    }

    const attachMedicine = async (data: any) => {

        const payload = {
            globalMedicineId: data.globalMedicineId,
            price: data.price,
            stock: data.stock,
            isActive: data.isActive,
            hasDiscount: data.hasDiscount,
            discountType: data.discountType,
            discountValue: data.discountValue,
            discountedPrice: data.discountedPrice,
            hasExpiryDate: data.hasExpiryDate,
            expiryDate: data.expiryDate,
        };


        const res = await axios.post('/pharmacy/medicines/new/attach', payload);

        // 4. افزودن به لیست محصولات لوکال
        medicines.value = res.data.data;

        return res.data;
    }


    return {
        medicines,
        globalMedicines,
        loading,
        error,
        fetchMedicines,
        fetchGlobalMedicines,
        getById,
        createMedicine,
        attachMedicine,
        updateMedicine,
        deleteMedicine,
        updateMedicineStatus
    }
})