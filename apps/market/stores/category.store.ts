import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Category} from "../types/category";
import {CategoryService} from "../services/category.service";
import {useUrlHelper} from "../composables/useUrlHelper";

export const useCategoryStore = defineStore('categoryStore', () => {
    // ────────────── State ──────────────
    const categories = ref<Category[]>([]);
    const { resolveUrl } = useUrlHelper();
    const loading = ref(false);
    const fetched = ref(false);

    // ────────────── Actions ──────────────
    const fetchCategories = async () => {
        loading.value = true;
        try {
            // دریافت داده خام از سرویس
            const rawData = await CategoryService.fetchCategories();

            categories.value = rawData.map((category: any) => {
                // استخراج لیست محصولات برای استفاده مجدد
                const productsList = category.productTenantCategories || [];
                return {
                    id: category.id,
                    name: category.title,
                    slug: category.slug,
                    icon: category.icon,
                    bgColor: category.bgColor,
                    iconColor: category.iconColor,
                    parentId: category.parentId,
                    isActive: category.isActive,
                    count: productsList.length,

                    // --- Mapping Products & Relations ---
                    productTenantCategories: (category.productTenantCategories || []).map((ptc: any) => {
                        const productData = ptc.product;
                        const tenantData = productData?.tenant;
                        const detailsData = productData?.product;

                        return {
                            product: {
                                id: productData.id,
                                shopId:productData.tenant.id,
                                shopName:productData.tenant.name,
                                tenantId: productData.tenantId,
                                price: productData.price,
                                discountedPrice: productData.discountedPrice,
                                discountValue: productData.discountValue,
                                discountType: productData.discountType,
                                hasDiscount: productData.hasDiscount,
                                stock: productData.stock,
                                isActive: productData.isActive,
                                isFavorite:productData.isFavorite,
                                averageRating: productData.averageRating,
                                reviewsCount: productData.reviewsCount,
                                expiryDate: productData.expiryDate,
                                status: productData.status,

                                // جزئیات اصلی محصول (Nested Product)
                                details: detailsData ? {
                                    name: detailsData.name,
                                    description: detailsData.description,
                                    //image: detailsData.image,
                                    image: resolveUrl(detailsData.image),
                                    galleryImages: detailsData.galleryImages,
                                    brand: detailsData.brand?.name||'بدون برند',
                                    code: detailsData.code,
                                    categoryBreadcrumb: detailsData.categoryBreadcrumb,
                                    type: detailsData.type,
                                } : null,

                                // اطلاعات فروشگاه (Tenant)
                                tenant: tenantData ? {
                                    id: tenantData.id,
                                    name: tenantData.name,
                                    type: tenantData.type,
                                    ownerName: tenantData.ownerName,
                                    phone: tenantData.phone,
                                    logo: tenantData.documents?.logo?.thumbnail,
                                    rating: tenantData.rating,
                                    isOpen: tenantData.isOpen,
                                    freeDelivery: tenantData.freeDelivery,
                                    fastDelivery: tenantData.fastDelivery,
                                } : null,
                            }
                        };
                    }),
                    children: category.children || []
                };
            });

            fetched.value = true;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // هندل کردن خطا در صورت نیاز
        } finally {
            loading.value = false;
        }
    };

    // ────────────── Getters / Helpers ──────────────
    /**
     * پیدا کردن دسته‌بندی بر اساس slug
     * @param slug - اسلاگ دسته‌بندی مورد نظر
     * @returns آبجکت دسته‌بندی یا undefined
     */
    const getCategoryBySlug = (slug: string): Category | undefined => {
        return categories.value.find(category => category.slug === slug);
    };

    /**
     * دریافت لیست محصولات یک دسته‌بندی بر اساس slug با فرمت استاندارد
     * @param slug - اسلاگ دسته‌بندی مورد نظر
     * @returns آرایه‌ای از محصولات با ساختار جدید
     */
    const getProductsBySlug = (slug: string) => {
        const category = categories.value.find(cat => cat.slug === slug);

        if (!category) return [];

        return category.productTenantCategories.map((ptc) => {
            const p = ptc.product;
            const details = p.details;

            return {
                id: p.id,
                shopId:p.shopId,
                shopName:p.shopName,
                name: details?.name || 'بدون نام',
                brand: details?.brand || 'بدون برند',
                price: p.discountedPrice, // قیمت نهایی
                originalPrice: p.price,   // قیمت اصلی
                discount: p.discountValue, // مقدار تخفیف
                rating: parseFloat(p.averageRating) || 0, // تبدیل رشته به عدد
                image: details?.image || '',
                available: p.stock > 0 && p.isActive, // موجود بودن بر اساس موجودی و فعال بودن
                isFavorite: p.isFavorite, // مقدار پیش‌فرض (چون در دیتابیس نبود)
                description: details?.description || '',
                _originalRef: p
            };
        });
    };


    /**
     * دریافت لیست زیردسته‌های یک دسته‌بندی بر اساس slug
     * خروجی: [{ id, name, count }, ...]
     */
    const getSubCategoriesBySlug = (slug: string) => {
        const category = categories.value.find(cat => cat.slug === slug);

        if (!category || !category.children || category.children.length === 0) {
            return [];
        }

        return category.children.map((child: any) => {
            return {
                id: child.id,
                name: child.title || child.name,
                count: child.productCount || 0
            };
        });
    };

    return {
        categories,
        loading,
        fetched,
        fetchCategories,
        getCategoryBySlug,
        getProductsBySlug,
        getSubCategoriesBySlug
    };
});