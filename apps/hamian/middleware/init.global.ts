import {defineNuxtRouteMiddleware} from "nuxt/app";
import {useAuthStore} from "../stores/auth";
import {useKindnessEventsStore} from "~/stores/kindness-events.ts";
import {useCategoryTypeStore} from "~/stores/category-type.ts";
import {useCategoryStore} from "~/stores/category.ts";
import {useDocumentaryStore} from "~/stores/documentary.ts";
import {useSupporterStore} from "~/stores/supporter.ts";
import {useFaqTypeStore} from "~/stores/faq-type.ts";
import {useFaqStore} from "~/stores/faq.ts";
import {useSettingStore} from "~/stores/setting.ts";
import {watch} from "vue";

export default defineNuxtRouteMiddleware(async (to, from) => {
    // اگر در حال رندر سمت سرور (SSR) هستیم، داده‌ها را بگیر
    // اگر در سمت کلاینت هستیم و داده‌ها قبلاً گرفته شده‌اند، کاری نکن (بهینه‌سازی)

    // if (import.meta.server || !useProductStore().products.length) {

        const authStore = useAuthStore();
        const kindnessEventStore = useKindnessEventsStore()
        const categoryTypeStore = useCategoryTypeStore()
        const categoryStore = useCategoryStore()
        const documentaryStore = useDocumentaryStore()
        const supporterStore = useSupporterStore()
        const faqTypeStore = useFaqTypeStore()
        const faqStore = useFaqStore()
        const settingStore = useSettingStore()


        try {
            // 1. بارگذاری داده‌های عمومی (همیشه نیاز است)
            // از Promise.all برای سرعت بیشتر استفاده می‌کنیم
            await Promise.all([
                 categoryTypeStore.fetchType('document'),
                 categoryTypeStore.fetchType('faq'),
                 faqTypeStore.fetchType('hamian'),
                 documentaryStore.fetchDocumentaries(),
                 kindnessEventStore.fetchKindnessEvents(),
                 supporterStore.fetchSupporters(),

            ]);

            const documentTypeId = categoryTypeStore.idBySlug('document')
            await  categoryStore.fetchCategories({ typeId: String(documentTypeId) })

            const faqTypeId = categoryTypeStore.idBySlug('faq')
            await categoryStore.fetchCategories({ typeId: String(faqTypeId), contentType: 'hamian' })

            watch(
                () => faqTypeStore.selectedType,
                async (type) => {
                    if (type?.id) {
                        await faqStore.fetchFaqs({ typeId: type.id })
                    }
                },
                { immediate: true }
            )


            // 2. بارگذاری داده‌های کاربری (فقط اگر کاربر لاگین کرده باشد)
            // نکته: فرض می‌کنیم استور auth به صورت خودکار توکن را چک می‌کند
            if (authStore.isAuthenticated) {
                // یا هر متدی که نشان‌دهنده لاگین بودن است: authStore.user !== null
                await Promise.all([
                    authStore.fetchUser(),
                ]);
            }
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های اولیه:', error);
            // در محیط تولید می‌توانید اینجا خطا را به سرویس مانیتورینگ گزارش دهید
        }
    // }
});