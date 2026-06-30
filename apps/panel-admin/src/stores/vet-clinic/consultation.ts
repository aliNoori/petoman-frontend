// stores/consultation.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {inject} from "vue";
import {type AxiosInstance} from "axios";
import {axiosKey} from "../../plugins/axiosPlugins";
import {useAuthStore} from "../auth";

export const useConsultationStore = defineStore("consultation", () => {
    // --- State ---
    const consultations = ref([]); // لیست گفتگوها
    const loading = ref(false);
    const error = ref(null);
    const authStore = useAuthStore();
    const myUserId = authStore.user?.id;
    const axios = inject<AxiosInstance>(axiosKey);
    if (!axios) throw new Error('Axios instance not injected');

    // --- Actions ---

    /**
     * دریافت لیست مشاوره‌های کاربر از سرور
     */
    const fetchConsultations = async () => {
        loading.value = true;
        error.value = null;
        try {
            // فرض بر این است که اندپوینت شما این است
            const response = await axios.get(`vetClinic/tenants/consultations`);

            // تبدیل داده‌های دیتابیس به فرمت UI مورد نیاز کامپوننت
            consultations.value = response.data.map(consultation => {

                const messagesArray = consultation.messages || [];
                const lastMessageObj = messagesArray.length > 0
                    ? messagesArray[messagesArray.length - 1]
                    : null;

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

                const unreadCount = messagesArray.filter(msg =>
                    !msg.seenAt && msg.senderId !== myUserId
                ).length;

                return {
                    id: consultation.id,
                    name: consultation.doctorName || consultation.participantName, // نام طرف مقابل
                    user: consultation.user,
                    pet: consultation.pet,
                    specialty: consultation.specialty || 'عمومی',
                    status: consultation.status, // active, closed, pending
                    isOnline: consultation.isOnline || false,
                    unread: unreadCount || 0,
                    lastMsg: lastMsgText,
                    lastTime: lastTime,
                    avatar: consultation.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${consultation.id}`,
                    consultationId: consultation.id, // شناسه واقعی برای ارسال پیام
                    messages: consultation.messages,
                    requestStatus: consultation.requestStatus, // اگر وضعیت درخواست جدا است
                    updatedAt:consultation.updatedAt
                }
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
    const updateConsultation = (id, updates) => {
        const index = consultations.value.findIndex(c => c.id === id);
        if (index !== -1) {
            consultations.value[index] = { ...consultations.value[index], ...updates };
        }
    };

    const getConsultationMessages = (consultationId) => {
        // جستجو در لیست مشاوره‌ها برای پیدا کردن مورد نظر
        const consultation = consultations.value.find(c => c.id === consultationId);

        // اگر مشاوره پیدا شد، پیام‌های آن را برمی‌گرداند، در غیر این صورت آرایه خالی
        return consultation ? consultation.messages : [];
    };

    return {
        consultations,
        loading,
        error,
        fetchConsultations,
        addConsultation,
        getConsultationMessages,
        updateConsultation
    };
});