import {defineNuxtRouteMiddleware} from "nuxt/app";
import {useAuthStore} from '~/stores/auth';
import {useTenantStore} from '~/stores/tenant.store';
import {usePetStore} from '~/stores/pet.store';
import {useWalletStore} from '~/stores/wallet.store';
import {useAppointmentStore} from '~/stores/appointment.store';
import {useConsultationStore} from '~/stores/consultation';
import {useAddressStore} from '~/stores/address.store';
import {useOrderStore} from '~/stores/order.store';
import {useSocketStore} from "~/stores/socket";
import {useReviewStore} from "~/stores/reviews.store";
import {useCategoryStore} from "~/stores/category.store";
import {useContractStore} from "~/stores/contract";

export default defineNuxtRouteMiddleware(async (to, from) => {
    // اگر در حال رندر سمت سرور (SSR) هستیم، داده‌ها را بگیر
    // اگر در سمت کلاینت هستیم و داده‌ها قبلاً گرفته شده‌اند (بر اساس طول آرایه)، کاری نکن
    // if (import.meta.server || !useAuthStore().user) {

    const authStore = useAuthStore();
    const tenantStore = useTenantStore();
    const petStore = usePetStore();
    const walletStore = useWalletStore();
    const appointmentsStore = useAppointmentStore();
    const consultationStore = useConsultationStore();
    const addressStore = useAddressStore();
    const orderStore = useOrderStore();
    const reviewStore = useReviewStore();
    const socketStore = useSocketStore();
    const categoryStore=useCategoryStore();
    const contractStore=useContractStore()

    try {
        // ۱. بررسی وضعیت کاربر
        await authStore.fetchUser();

        // ۲. اگر کاربر لاگین است، داده‌های خصوصی را بگیر
        if (authStore.isAuthenticated) {
            await Promise.all([
                authStore.fetchSessions(),
                petStore.fetchPets(),
                walletStore.fetchWalletUser(),
                appointmentsStore.fetchAppointments(),
                consultationStore.fetchConsultations(),
                addressStore.fetchUserAddresses(),
                orderStore.fetchUserOrders(),
                tenantStore.fetchTenantRequests(),
                reviewStore.fetchReviews(),

            ]);
            socketStore.connect(authStore.token);

        }

        // ۳. داده‌های عمومی (همیشه نیاز است)
        await Promise.all([
            tenantStore.fetchTenants(),
            tenantStore.fetchTenantSpecialties(),
            tenantStore.fetchTenantServices(),
            categoryStore.fetchCategories(),
            contractStore.fetchAuditLogContract()

            // سایر داده‌های عمومی مثل دسته‌بندی‌ها یا محصولات عمومی
        ]);

    } catch (error) {
        console.error('خطا در بارگذاری داده‌های اولیه (Middleware):', error);
    }
    // }
});