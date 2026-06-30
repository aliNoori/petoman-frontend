// stores/consultation.js
import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";
import {useAuthStore} from "~/stores/auth";

export const useConsultationStore = defineStore("consultation", () => {
    // --- State ---
    const consultations = ref([]); // لیست گفتگوها
    const loading = ref(false);
    const error = ref(null);

    // --- Nuxt App & Axios ---
    const {$axios} = useNuxtApp();
    const axios = $axios as AxiosInstance;

    // --- Actions ---

    /**
     * دریافت لیست مشاوره‌های کاربر از سرور
     */
    const fetchConsultations = async () => {
        const authStore = useAuthStore(); // ✅ دسترسی به استور کاربر برای گرفتن ID
        const myUserId = authStore.user?.id;
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`/consultations/my-list`);

            // ✅ تبدیل داده‌های دیتابیس به فرمت UI مورد نیاز کامپوننت
            consultations.value = response.data.map(consultation => {

                // --- استخراج آخرین پیام ---
                // بررسی می‌کنیم آیا آرایه پیام‌ها وجود دارد و خالی نیست یا خیر
                const messagesArray = consultation.messages || [];
                const lastMessageObj = messagesArray.length > 0
                    ? messagesArray[messagesArray.length - 1]
                    : null;

                const unreadCount = messagesArray.filter(msg =>
                    !msg.seenAt && msg.senderId !== myUserId
                ).length;

                // --- تابع کمکی برای زمان نسبی ---
                const getRelativeTime = (dateString) => {
                    if (!dateString) return '';
                    try {
                        const now = new Date();
                        const date = new Date(dateString);
                        const diffInSeconds = Math.floor((now - date) / 1000);

                        if (diffInSeconds < 60) {
                            return 'همین الان';
                        }

                        const diffInMinutes = Math.floor(diffInSeconds / 60);
                        if (diffInMinutes < 60) {
                            return `${diffInMinutes} دقیقه پیش`;
                        }

                        const diffInHours = Math.floor(diffInMinutes / 60);
                        if (diffInHours < 24) {
                            return `${diffInHours} ساعت پیش`;
                        }

                        const diffInDays = Math.floor(diffInHours / 24);
                        if (diffInDays === 1) {
                            return 'دیروز';
                        } else if (diffInDays < 7) {
                            return `${diffInDays} روز پیش`;
                        } else if (diffInDays < 30) {
                            const weeks = Math.floor(diffInDays / 7);
                            return `${weeks} هفته پیش`;
                        } else {
                            // اگر قدیمی بود، تاریخ را به شمایش نمایش بده
                            return new Intl.DateTimeFormat('fa-IR', {
                                month: 'long',
                                day: 'numeric'
                            }).format(date);
                        }
                    } catch (e) {
                        return '';
                    }
                };

                // تعیین متن آخرین پیام
                let lastMsgText = 'پیامی نیست';
                if (lastMessageObj) {
                    if (lastMessageObj.type === 'image' || lastMessageObj.type === 'file') {
                        lastMsgText = '📎 فایل';
                    } else if (lastMessageObj.type === 'prescription') {
                        lastMsgText = '📝 نسخه';
                    } else {
                        lastMsgText = lastMessageObj.text || 'پیامی نیست';
                    }
                }

                // ✅ اصلاح نهایی: اطمینان از اینکه lastMessageObj وجود دارد قبل از خواندن sentAt
                const lastTime = lastMessageObj ? getRelativeTime(lastMessageObj.sentAt) : '';
                const settings = consultation.doctor.tenantSettings || [];
                const vetInfoSetting = settings.find((s: any) => s.key === 'clinic_info');

                return {
                    id: consultation.id,
                    doctorId: consultation.doctor?.id, // استفاده از optional chaining برای اطمینان
                    name: consultation.doctor?.ownerName || consultation.doctor?.name || '',
                    specialty: consultation.specialty || 'عمومی',
                    status: consultation.status,
                    isOnline: consultation.doctor?.isOnline || false,
                    unread: unreadCount || 0,

                    // ✅ مقداردهی فیلدهای محاسباتی
                    lastMsg: lastMsgText,
                    lastTime: lastTime,

                    avatar: vetInfoSetting?.value?.logo,
                    user: consultation.user,
                    consultationId: consultation.id,
                    requestStatus: consultation.requestStatus
                };
            });

        } catch (err) {
            console.error("Error fetching consultations:", err);
            error.value = err.response?.data?.message || 'خطا در دریافت لیست گفتگوها';
        } finally {
            loading.value = false;
        }
    };

    /**
     * افزودن یک مشاوره جدید به لیست (مثلاً وقتی از صفحه دکتر وارد می‌شوید)
     */
    const addConsultation = (consultationData) => {
        // بررسی تکراری نبودن
        if (!consultations.value.find(c => c.id === consultationData.id)) {
            consultations.value.unshift(consultationData);
        }
    };

    /**
     * به‌روزرسانی وضعیت یک مشاوره (مثلاً خواندن پیام یا تغییر وضعیت آنلاین)
     */
    const updateConsultation = async (id: string, updates: any) => {

        const index = consultations.value.findIndex(c => String(c.id) === String(id));

        if (index !== -1) {
            consultations.value[index] = {...consultations.value[index], ...updates};

        }
    };

    return {
        consultations,
        loading,
        error,
        fetchConsultations,
        addConsultation,
        updateConsultation
    };
});