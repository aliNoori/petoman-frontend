import { defineStore } from 'pinia'
import { inject,ref } from 'vue'
import {type AxiosInstance} from 'axios'
import {axiosKey} from "../../plugins/axiosPlugins";
import {useUploader} from "../../composables/useUploader";


export interface GlobalProduct {
    id: string
    name: string
    code: string
    type: 'shop'
    categoryBreadcrumb:string
    category: string
    categoryId: number | null

    description: string
    image: string | null
    galleryImages: string[]

    brand: string | null

    createdAt: string
    updatedAt?: string
}

export interface MarketProduct extends GlobalProduct{
    price: number
    stock: number
    isActive: boolean

    hasDiscount: boolean
    discountType: 'percentage' | 'fixed' | null
    discountValue: number
    discountedPrice: number
    rejectionReason:string

    hasExpiryDate: boolean
    expiryDate: string | null

    variants:[]
}

export const useMarketProductStore = defineStore('marketProductStore', () => {
    // ────────────── State ──────────────
    const products = ref<MarketProduct[]>([])
    const globalProducts = ref<GlobalProduct[]>([])
    const loading = ref(false)
    const fetched = ref(false)

    const uploader = useUploader()

    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')


    // ────────────── API Actions ──────────────

    const fetchGlobalProducts = async () => {
        loading.value = true
        const res = await axios.get('/market/products/global')
        globalProducts.value = res.data.data
        loading.value = false
    }

    const fetchProducts = async () => {
        loading.value = true
        const res = await axios.get('/market/products')
        products.value = res.data.data
        loading.value = false
    }

    const updateProductStatus = async (productId: string, isActive: boolean) => {
        loading.value = true;
        try {
            // Send request to backend to update status
            await axios.patch(`/market/products/update-status/${productId}`, {
                isActive: isActive
            });

            // Find the product in the local list by ID
            const productIndex = products.value.findIndex(p => p.id === productId);

            // If product exists, update its status locally
            if (productIndex !== -1) {
                products.value[productIndex].isActive = isActive;
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            loading.value = false;
        }
    };

    const getById = async (id: string) => {
        const res = await axios.get(`/market/products/${id}`)
        return res.data.data
    }

    const createProduct = async (data: any) => {

        let mainImageUrl = null
        if (data.image) {
            mainImageUrl = await uploader.uploadImage(data.image)
        }

        const galleryUrls = []
        for (const img of data.galleryImages || []) {
            const url = await uploader.uploadImage(img)
            galleryUrls.push(url)
        }

        const payload = { ...data, image: mainImageUrl, galleryImages: galleryUrls }
        const res = await axios.post('/market/products', payload)
        products.value.push(res.data.data)
        return res.data
    }

    const updateProduct = async (id: string, data: any) => {
        // 1. مدیریت تصویر اصلی (Main Image)
        let mainImageUrl = data.image;

        // اگر تصویر اصلی یک فایل (File) بود، آن را آپلود کن
        // اگر رشته (string) بود یعنی URL قبلی است و دست نمی‌زنیم
        if (data.image instanceof File) {
            mainImageUrl = await uploader.uploadImage(data.image);
        }

        // 2. مدیریت گالری (Gallery Images)
        const galleryUrls = [];

        if (data.galleryImages && Array.isArray(data.galleryImages)) {
            for (const img of data.galleryImages) {
                if (img instanceof File) {
                    // اگر آیتم جاری فایل جدید است، آپلود کن و URL بگیر
                    const url = await uploader.uploadImage(img);
                    galleryUrls.push(url);
                } else if (typeof img === 'string') {
                    // اگر آیتم جاری رشته (URL) است، همان را نگه دار
                    galleryUrls.push(img);
                }
                // اگر نوع دیگری بود (مثلا null) نادیده بگیر
            }
        }

        // 3. ساخت payload نهایی با URLهای نهایی
        const payload = {
            ...data,
            image: mainImageUrl,
            galleryImages: galleryUrls
        };

        // 4. ارسال درخواست آپدیت به سرور
        const res = await axios.patch(`/market/products/${id}`, payload);

        // 5. آپدیت لوکال استیت
        const index = products.value.findIndex(p => p.id === id);
        if (index !== -1) products.value[index] = res.data.data;

        return res.data;
    }

    const attachProduct = async (data: any) => {

        const payload = {
            globalProductId: data.globalProductId,
            price: data.price,
            stock: data.stock,
            isActive: data.isActive,
            hasDiscount: data.hasDiscount,
            discountType: data.discountType,
            discountValue: data.discountValue,
            discountedPrice: data.discountedPrice,
            hasExpiryDate: data.hasExpiryDate,
            expiryDate: data.expiryDate,
            discountStartDate: data.discountStartDate,
            discountEndDate: data.discountEndDate,
            description:data.description
        };


        const res = await axios.post('/market/products/attach', payload);

        // 4. افزودن به لیست محصولات لوکال
        products.value.push(res.data.data);

        return res.data;
    }

    const deleteProduct = async (id: string) => {
        const res = await axios.delete(`/market/products/${id}`)
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
            products.value.splice(index, 1)
        }
        return res.data
    }

    const syncVariants = async (productId: string, variants: any[]) => {
        try {
            // ۱. آپلود تصاویر (خارج از تراکنش دیتابیس)
            const variantsWithUrls = await Promise.all(
                variants.map(async (variant) => {
                    let imageUrl = variant.image; // نگهداری URL قبلی

                    // اگر فایل جدیدی انتخاب شده بود، آپلود کن
                    if (variant.imageFile instanceof File) {
                        imageUrl = await uploader.uploadImage(variant.imageFile);
                    }

                    return {
                        id: variant.id, // اگر ویرایش است ID دارد، اگر جدید است null است
                        name: variant.name,
                        attributes: variant.attributes,
                        price: variant.price,
                        stock: variant.stock,
                        isActive: variant.isActive,
                        image: imageUrl // ارسال URL نهایی
                    };
                })
            );

            // ۲. ارسال لیست نهایی به بک‌اند برای همگام‌سازی اتمیک
            const res = await axios.post(`/market/products/${productId}/variants/sync`, {
                variants: variantsWithUrls
            });

            // ۳. آپدیت لوکال
            const productIndex = products.value.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                // جایگزینی کامل لیست واریانت‌ها با لیست جدید از سرور
                products.value[productIndex].variants = res.data.data;
            }

            return res.data;

        } catch (error) {
            console.error('Error syncing variants:', error);
            throw error;
        }
    }

    return {
        products,
        globalProducts,
        loading,
        fetchProducts,
        fetchGlobalProducts,
        updateProductStatus,
        syncVariants,
        getById,
        createProduct,
        updateProduct,
        attachProduct,
        deleteProduct,
    }
})

