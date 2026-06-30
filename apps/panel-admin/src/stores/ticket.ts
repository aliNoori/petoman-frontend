import { defineStore } from 'pinia'
import { ref, inject,computed } from 'vue'
import { axiosKey} from "../plugins/axiosPlugins";
import { useAuthStore} from "./auth";
import { useUploader} from "../composables/useUploader";
import type { AxiosInstance } from "axios"

export const useTicketStore = defineStore('tickets', () => {
    // --- State ---
    const tickets = ref([])
    const loading = ref(false)
    const error = ref(null)

    const authStore = useAuthStore()
    const uploader = useUploader()
    const axios = inject<AxiosInstance>(axiosKey)

    if (!axios) throw new Error('Axios instance not injected')

    // --- Actions ---

    /**
     * دریافت لیست تیکت‌ها از سرور
     */
    const fetchTickets = async () => {
        loading.value = true
        error.value = null
        try {
            const role = authStore.user?.role.name || 'USER'
            const tenantId=localStorage.getItem('tenant_id')
            // درخواست به سرور
            const response = await axios.get(`/tickets?role=${role}&tenantId=${tenantId}`)

            // انتسین داده‌های دریافتی به استیت
            tickets.value = response.data
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching tickets:', err)
        } finally {
            loading.value = false
        }
    }

    // محاسبه آمار تیکت‌ها
    const stats = computed(() => {
        const allTickets = tickets.value || [];

        // ۱. محاسبه تعداد کل تیکت‌ها
        const total = allTickets.length;

        // ۲. محاسبه تعداد تیکت‌های باز
        // بر اساس داده‌های شما، وضعیت‌های باز شامل 'open' و 'in_progress' هستند
        const openCount = allTickets.filter(t =>
            t.status === 'open' || t.status === 'in_progress'
        ).length;

        return {
            total,
            open: openCount
        };
    });

    /**
     * حذف فایل‌های آپلود شده در صورت بروز خطا (Rollback)
     */
    const cleanupFiles = async (fileUrls: string[]) => {
        if (!fileUrls || fileUrls.length === 0) return;
        try {
            await axios.post('/v1/uploads/cleanup', { urls: fileUrls });
        } catch (e) {
            console.warn('⚠️ Failed to cleanup orphaned files:', e);
        }
    }

    /**
     * ارسال تیکت جدید
     */
    const submitTicket = async (ticketData: any) => {
        loading.value = true
        error.value = null
        const attachmentUrls: string[] = []

        try {
            // ۱. مدیریت آپلود فایل‌ها
            if (ticketData.files && ticketData.files.length > 0) {
                for (const file of ticketData.files) {
                    const url = await uploader.uploadImage(file)
                    attachmentUrls.push(url)
                }
            }

            // ۲. ساخت Payload نهایی
            const payload = {
                department: ticketData.department,
                priority: ticketData.priority,
                subject: ticketData.subject,
                message: ticketData.message,
                tenantId: ticketData.tenantId,
                attachments: attachmentUrls
            }

            // ۳. ارسال درخواست به سرور
            const response = await axios.post('/tickets', payload)

            // ۴. آپدیت لیست لوکال (اضافه کردن به ابتدای لیست)
            tickets.value.unshift(response.data)

            return { success: true }
        } catch (err: any) {
            error.value = err.message

            // ۵. Rollback: اگر فایلی آپلود شده و ارسال تیکت شکست خورد، فایل‌ها را پاک کن
            if (attachmentUrls.length > 0) {
                await cleanupFiles(attachmentUrls)
            }
            return { success: false, error: err.message }
        } finally {
            loading.value = false
        }
    }

    /**
     * ارسال پاسخ به یک تیکت موجود
     */
    const sendReply = async (ticketId: number, messageData: any) => {
        loading.value = true
        error.value = null
        const attachmentUrls: string[] = []

        try {
            // ۱. آپلود فایل‌ها در استور
            if (messageData.files && messageData.files.length > 0) {
                for (const file of messageData.files) {
                    // آپلود فایل و دریافت لینک
                    const url = await uploader.uploadImage(file)
                    attachmentUrls.push(url)
                }
            }

            // ۲. ساخت Payload برای ارسال به API
            const payload = {
                content: messageData.content,
                attachments: attachmentUrls, // ارسال لینک‌های نهایی
                isAdmin: true // یا false بسته به اینکه کاربر جاری ادمین است یا کاربر عادی
            }

            // ۳. ارسال درخواست به سرور
            await axios.post(`/tickets/${ticketId}/reply`, payload)

            // ۴. آپدیت لوکال (اختیاری - برای همگام‌سازی سریع لیست)
            const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
            if (ticketIndex !== -1) {
                const newMessage = {
                    id: Date.now(),
                    content: messageData.content,
                    attachments: attachmentUrls.map(url => ({ type: 'image', url })),
                    time: 'الان',
                    isAdmin: payload.isAdmin
                }
                tickets.value[ticketIndex].messages.push(newMessage)
                tickets.value[ticketIndex].lastMessage = messageData.content
                tickets.value[ticketIndex].lastUpdate = 'الان'

                if (tickets.value[ticketIndex].status === 'pending') {
                    tickets.value[ticketIndex].status = 'in_progress'
                }
            }

            // بازگرداندن لینک‌ها به کامپوننت برای نمایش در UI
            return { success: true, attachments: attachmentUrls }

        } catch (err: any) {
            error.value = err.message
            // پاک کردن فایل‌های آپلود شده در صورت خطا
            if (attachmentUrls.length > 0) {
                await cleanupFiles(attachmentUrls)
            }
            return { success: false, error: err.message }
        } finally {
            loading.value = false
        }
    }

    /**
     * تغییر وضعیت تیکت
     */
    const updateTicketStatus = async (ticketId: number, status: string) => {
        try {
            await axios.patch(`/tickets/${ticketId}`, { status })

            // آپدیت لوکال
            const ticket = tickets.value.find(t => t.id === ticketId)
            if (ticket) {
                ticket.status = status
            }
            return { success: true }
        } catch (err: any) {
            console.error('Error updating status:', err)
            return { success: false, error: err.message }
        }
    }

    return {
        stats,
        tickets,
        loading,
        error,
        fetchTickets,
        submitTicket,
        sendReply,
        updateTicketStatus
    }
})