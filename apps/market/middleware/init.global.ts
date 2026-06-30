import {defineNuxtRouteMiddleware} from "nuxt/app";
import {useAuthStore} from "../stores/auth";
import {useProductStore} from "../stores/product.store";
import {useCategoryStore} from "../stores/category.store";
import {useShopStore} from "../stores/shop.store";
import {useReferenceStore} from "../stores/reference.store";
import {useOrderStore} from "../stores/order.store";
import {useDiscountStore} from "../stores/discount.store";
import {useWalletStore} from "../stores/wallet.store";
import {useAddressStore} from "../stores/address.store";
// سایر استورهایی که نیاز به بارگذاری اولیه دارند را اینجا ایمپورت کنید

export default defineNuxtRouteMiddleware(async (to, from) => {
    // اگر در حال رندر سمت سرور (SSR) هستیم، داده‌ها را بگیر
    // اگر در سمت کلاینت هستیم و داده‌ها قبلاً گرفته شده‌اند، کاری نکن (بهینه‌سازی)

    // if (import.meta.server || !useProductStore().products.length) {

        const authStore = useAuthStore();
        const productStore = useProductStore();
        const categoryStore = useCategoryStore();
        const shopStore = useShopStore();
        const referenceStore = useReferenceStore();
        const orderStore = useOrderStore()
        const discountStore = useDiscountStore()
        const walletStore = useWalletStore()
        const addressStore = useAddressStore()


        try {
            // 1. بارگذاری داده‌های عمومی (همیشه نیاز است)
            // از Promise.all برای سرعت بیشتر استفاده می‌کنیم
            await Promise.all([
                productStore.fetchProducts(),
                productStore.fetchBestSellingProducts(),
                categoryStore.fetchCategories(),
                shopStore.fetchShops(),
                referenceStore.fetchBrands(),
            ]);


            // 2. بارگذاری داده‌های کاربری (فقط اگر کاربر لاگین کرده باشد)
            // نکته: فرض می‌کنیم استور auth به صورت خودکار توکن را چک می‌کند
            if (authStore.isAuthenticated) {
                // یا هر متدی که نشان‌دهنده لاگین بودن است: authStore.user !== null
                await Promise.all([
                    authStore.fetchUser(),
                    authStore.fetchSessions(),
                    orderStore.fetchUserOrders(),
                    walletStore.fetchWalletUser(),
                    discountStore.fetchMyDiscounts(),
                    addressStore.fetchUserAddresses(),
                    shopStore.fetchRequests(),
                ]);
            }
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های اولیه:', error);
            // در محیط تولید می‌توانید اینجا خطا را به سرویس مانیتورینگ گزارش دهید
        }
    // }
});