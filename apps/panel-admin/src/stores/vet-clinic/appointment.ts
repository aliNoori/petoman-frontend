import {defineStore} from 'pinia';
import {computed, inject, ref} from 'vue';
import {type AxiosInstance} from "axios";
import {axiosKey} from "../../plugins/axiosPlugins";
import {toGregorian, toJalaali} from 'jalaali-js';
import {PharmacyMedicine} from "../pharmacy/medicine.store";

export const useAppointmentStore = defineStore("appointment", () => {
    // --- State ---
    const appointments = ref([]);
    const globalMedicines = ref<PharmacyMedicine[]>([])
    const timeOffBlocks = ref([]);
    const timeOffLoading = ref(false);
    const timeOffError = ref(null);
    const loading = ref(false);
    const error = ref(null);
    // --- State جدید برای صف انتظار ---
    const queueList = ref([]); // لیست نوبت‌های در انتظار
    const queueLoading = ref(false);
    const queueError = ref(null);
    const axios = inject<AxiosInstance>(axiosKey);
    let pollingInterval: any = null;
    if (!axios) throw new Error('Axios instance not injected');

    // ═══════════════════════════════════════════════════════
    // 🆕 State جدید برای مدیریت ظرفیت
    // ═══════════════════════════════════════════════════════
    const capacitySettings = ref({
        // وضعیت
        isOnline: true,
        doNotDisturb: false,
        // گفتگوی آنلاین
        chatEnabled: true,
        chatCapacity: 3,
        chatDuration: '15',
        // تماس فوری
        phoneInstantEnabled: true,
        phoneInstantCapacity: 2,
        phoneInstantDuration: '10',
        // تماس زمان‌دار
        phoneScheduledEnabled: true,
        phoneScheduledCapacity: 5,
        phoneScheduledDuration: '15',
        // صف انتظار
        maxQueueLength: 20,
        maxQueueWaitTime: 60,
    });

    const capacityStats = ref({
        chat: { active: 0, max: 3, queue: 0 },
        phoneInstant: { active: 0, max: 2, queue: 0 },
        phoneScheduled: { active: 0, max: 5, queue: 0 },
    });

    const capacityLoading = ref(false);
    const capacityError = ref(null);
    // ═══════════════════════════════════════════════════════

    // --- Actions ---
    const toPersianDigits = (str) => {
        const persianMap = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.toString().replace(/\d/g, (d) => persianMap[d]);
    };
    // تابع کمکی برای تبدیل تاریخ میلادی به شمسی و فرمت زمان
    const formatDateTime = (dateString) => {
        if (!dateString) return { date: '-', time: '-' };

        const dateObj = new Date(dateString);

        // تبدیل به شمسی
        const { jy, jm, jd } = toJalaali(
            dateObj.getFullYear(),
            dateObj.getMonth() + 1,
            dateObj.getDate()
        );

        // فرمت تاریخ (مثال: ۱۴۰۴/۱۲/۰۵)
        const dateStr = `${jy}/${jm}/${jd}`;

        // فرمت زمان (مثال: ۰۹:۰۰)
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        return { date: toPersianDigits(dateStr), time: toPersianDigits(timeStr) };
    };

    const toEnglishDigits = (str) => {
        if (!str) return '';
        return str.toString().replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    };

    const getVisitTypeName = (type)=> {
        const names = {
            'in-person': 'حضوری',
            'home-visit': 'ویزیت در منزل',
            'online': 'آنلاین',
            'phone':'مشاوره تلفنی',
            'urgent-consult': 'مشاوره فوری'
        }
        return names[type] || type
    }

    /**
     * دریافت لیست نوبت‌های کاربر از سرور و تبدیل به فرمت استاتیک
     */
    const fetchAppointments = async () => {
        loading.value = true;
        error.value = null;
        try {
            // دریافت داده‌ها از سرور
            const response = await axios.get(`vetClinic/appointments/tenants/my-list`);

            // تبدیل داده‌های دیتابیس به فرمت UI مورد نظر
            appointments.value = response.data.map(item => {
                // 1. استخراج اطلاعات حیوان خانگی
                const pet = item.pet || {};
                const petName = pet.name || 'نامشخص';
                // 2. استخراج اطلاعات دکتر/کلینیک
                const doctor = item.doctor || item.tenant || {};
                const doctorName = doctor.name || 'پزشک';
                const specialty = doctor.specialty || 'مشاوره عمومی';

                // استفاده در شرط‌ها
                let dateStr, timeStr;

                if (item.appointmentDate) {
                    const formatted = formatDateTime(item.appointmentDate);
                    dateStr = formatted.date;
                    timeStr = formatted.time;
                } else {
                    const formatted = formatDateTime(item.createdAt);
                    dateStr = formatted.date;
                    timeStr = formatted.time;
                }

                // 4. تعیین نوع ویزیت (visitType) بر اساس فیلد type
                let visitType = 'in-person';
                if (item.service === 'home') visitType = 'home-visit';
                else if (item.service === 'text') visitType = 'online';
                else if (item.service === 'phone-instant') visitType = 'urgent-consult';
                else if (item.service === 'phone-scheduled') visitType = 'phone';

                // 6. آواتار (ساخت تصادفی بر اساس آیدی دکتر)
                const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id || item.id}`;

                return {
                    id: item.id,
                    petName: petName,
                    petType: item.pet.type||'', // اضافه شده برای استفاده احتمالی
                    petBreed: item.pet.breed,
                    breed:item.pet.breed,
                    petAvatar: item.pet?.logo,
                    ownerName: item.pet.owner?.fullName || item.pet.owner?.firstName + ' ' + item.pet.owner?.lastName || 'کاربر', // اگر user لود شده باشد
                    ownerPhone: item.pet.owner?.phoneNumber || '0912-000-0000', // شماره تماس کلینیک
                    phone: item.pet.owner?.phoneNumber || '0912-000-0000', // شماره تماس کلینیک
                    ownerEmail: item.pet.owner?.email || 'user@example.com',
                    address:item.order.address,
                    description:item.description,
                    notes:item.description,
                    date: dateStr,
                    displayDate:dateStr,
                    time: timeStr,
                    shift: (() => {
                        const hour = parseInt(toEnglishDigits(timeStr).split(':')[0]);
                        if (hour >= 8 && hour < 12) return 'morning';
                        if (hour >= 12 && hour < 18) return 'afternoon';
                        return 'evening';
                    })(),
                    service: getVisitTypeName(visitType), // یا item.service
                    visitType: visitType,
                    peerId:item.peerId,
                    orderId:item.orderId,
                    orderStatus:item.order.status,
                    status: item.status,
                    cancelReason:item.cancelledReason,
                    trackingCode: item.trackingCode,
                    examCode:item.examCode,
                    completed: item.status === 'completed',
                    cancelled:item.status==='cancelled',

                    // فیلدهای مربوط به چت
                    avatar: avatar,
                    lastMsg: item.lastMsg || 'پیامی نیست',
                    lastTime: item.lastTime || '',
                    unread: item.unread || 0,
                    isOnline: doctor.isOnline || false,
                    consultationId: item.consultationId,

                    // فیلدهای اضافی
                    examCodeVerified: item.examCodeVerified || false,
                    duration: item.duration || null,
                    remainingTime: item.remainingTime || null,
                    completedAt: item.completedAt ? new Date(item.completedAt).toLocaleDateString('fa-IR') : null,
                    createdAt:item.createdAt,
                    queueNumber: item.queueNumber || null,
                    joinedQueueAt: item.joinedQueueAt || null,
                    estimatedWaitMinutes: item.estimatedWaitMinutes || null,
                };
            });

            // ═══════════════════════════════════════════════
            // 🆕 به‌روزرسانی آمار ظرفیت زنده از روی appointments
            // ═══════════════════════════════════════════════
            updateLiveCapacityStats();
        } catch (err) {
            console.error("Error fetching appointments:", err);
            error.value = err.response?.data?.message || 'خطا در دریافت لیست نوبت‌ها';
        } finally {
            loading.value = false;
        }
    };

    const startPolling = () => {
        if (pollingInterval) return; // اگر تایمر قبلا روشن است، دوباره اجرا نشود

        // ۱. چک کردن وضعیت نوبت‌های فعال (برای آپدیت statusها مثل in-progress, completed)
        pollingInterval = setInterval(async () => {
            try {
                // فرض بر این است که یک اندپوینت برای دریافت وضعیت‌های تغییر یافته دارید
                // اگر ندارید، می‌توانید کل لیست را fetch کنید (کندتر است اما ساده‌تر)
                // در اینجا فرض می‌کنیم fetchAppointments آخرین لیست را می‌گیرد

                // بهینه‌سازی: فقط نوبت‌های فعال را چک کنید یا کل لیست را رفرش کنید
                // اگر سرور API خاصی برای "تغییرات جدید" ندارد:
                await fetchAppointments();

            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 5000); // هر ۵ ثانیه یکبار چک کن
    };

    const stopPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    };

    // ═══════════════════════════════════════════════════════
    // 🆕 به‌روزرسانی آمار ظرفیت از روی لیست appointments (بدون کوئری اضافی)
    // ═══════════════════════════════════════════════════════
    function updateLiveCapacityStats() {
        const now = Date.now();
        const RECENT_WINDOW_MS = 30 * 60 * 1000; // ۳۰ دقیقه

        const activeAppointments = appointments.value.filter(apt => {
            if (!apt.createdAt) return false;
            const aptTime = new Date(apt.createdAt).getTime();
            return (apt.status === 'in-progress' || apt.status === 'in-chat');
        });

        capacityStats.value = {
            chat: {
                active: activeAppointments.filter(apt => apt.visitType === 'online').length,
                max: capacitySettings.value.chatCapacity || 3,
                queue: appointments.value.filter(apt =>
                    apt.visitType === 'online' && apt.status === 'queued'
                ).length,
            },
            phoneInstant: {
                active: activeAppointments.filter(apt => apt.visitType === 'urgent-consult').length,
                max: capacitySettings.value.phoneInstantCapacity || 2,
                queue: appointments.value.filter(apt =>
                    apt.visitType === 'urgent-consult' && apt.status === 'queued'
                ).length,
            },
            phoneScheduled: {
                active: activeAppointments.filter(apt => apt.visitType === 'phone').length,
                max: capacitySettings.value.phoneScheduledCapacity || 5,
                queue: appointments.value.filter(apt =>
                    apt.visitType === 'phone' && apt.status === 'queued'
                ).length,
            },
        };
    }

    /**
     _به‌روزرسانی وضعیت یک نوبت و آمار ظرفیت_
     */
    const updateAppointmentStatus = (id, newStatus, extraData = {}) => {
        const index = appointments.value.findIndex(a => a.id === id);
        if (index !== -1) {
            appointments.value[index] = {
                ...appointments.value[index],
                status: newStatus,
                ...extraData
            };
            // به‌روزرسانی آمار ظرفیت
            updateLiveCapacityStats();
        }
    };

    /**
     * افزودن یک نوبت جدید به لیست
     */
    const addAppointment = (appointmentData) => {
        // بررسی تکراری نبودن
        if (!appointments.value.find(a => a.id === appointmentData.id)) {
            appointments.value.unshift(appointmentData);
            // به‌روزرسانی آمار
            updateLiveCapacityStats();
        }
    };

    /**
     * به‌روزرسانی وضعیت یک نوبت
     */
    const approvedAppointment = async (id) => {
        try{

            const response = await axios.patch(`vetClinic/tenants/appointments/status/${id}`,{status:'approved'});
            const index = appointments.value.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments.value[index] = { ...appointments.value[index], status:'approved' };
            }

        }catch(e:any){

        }

    };

    const changeStatusToInChat = async (id:string) => {
        try{

            const response = await axios.patch(`vetClinic/tenants/appointments/status/${id}`,{status:'in-chat'});
            const index = appointments.value.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments.value[index] = { ...appointments.value[index], status:'in-chat' };
            }

        }catch(e:any){

        }

    };

    const changeStatusToCompleted = async (id: string, payload?: any) => {
        try {
            const response = await axios.patch(`vetClinic/tenants/appointments/status/${id}`, {
                status: 'completed',
                duration: payload?.duration,
                completedAt: payload?.completedAt || new Date().toISOString()
            });

            const index = appointments.value.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments.value[index] = {
                    ...appointments.value[index],
                    status: 'completed',
                    duration: payload?.duration,
                    completedAt: payload?.completedAt || new Date().toISOString()
                };
            }

            return response.data;
        } catch (e: any) {
            console.error('Error completing appointment:', e);
            throw e;
        }
    };


    const changeStatusToCancelled = async (id:string,reason:string) => {
        try{

            const response = await axios.patch(`vetClinic/tenants/appointments/status/${id}`,{status:'cancelled',reason:reason});
            const index = appointments.value.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments.value[index] = { ...appointments.value[index], status:'cancelled' };
            }

        }catch(e:any){

        }

    };

    const changeStatusToInProgress = async (id: string, payload?: any) => {
        try {
            // ارسال وضعیت و زمان شروع به سرور
            const response = await axios.patch(`vetClinic/tenants/appointments/status/${id}`, {
                status: 'in-progress',
                appointmentDate: payload?.appointmentDate // اضافه کردن زمان شروع
            });

            // آپدیت کردن لیست لوکال
            const index = appointments.value.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments.value[index] = {
                    ...appointments.value[index],
                    status: 'in-progress',
                    appointmentDate: payload?.appointmentDate // ذخیره زمان شروع در لوکال
                };
            }
        } catch (e: any) {
            console.error('Error changing status to in-progress:', e);
            throw e;
        }
    };

    const changeExamCodeVerified = async (id:string,examCode:string) => {
        try{

            const response = await axios.patch(`vetClinic/tenants/appointments/${id}/verify-exam-code`,{examCode:examCode});
            const index = appointments.value.findIndex(a => a.id === id);
            if (index !== -1) {
                appointments.value[index] = { ...appointments.value[index], examCodeVerified:true };
            }
            return response

        }catch(e:any){

        }

    };


    ////////////////   Time Off
    /**
     * دریافت لیست زمان‌های استراحت از سرور
     */
    const fetchTimeOffBlocks = async () => {
        timeOffLoading.value = true;
        timeOffError.value = null;
        try {
            const response = await axios.get(`vetClinic/tenants/time-off`);
            timeOffBlocks.value = response.data;
        } catch (err) {
            console.error("Error fetching time off blocks:", err);
            timeOffError.value = err.response?.data?.message || 'خطا در دریافت لیست زمان‌های استراحت';
        } finally {
            timeOffLoading.value = false;
        }
    };

    /**
     * ثبت یک زمان استراحت جدید
     */
    const addTimeOffBlock = async (blockData) => {
        timeOffError.value = null;
        try {
            const response = await axios.post(`vetClinic/tenants/time-off`, blockData);
            // اضافه کردن به لیست لوکال برای نمایش سریع‌تر
            timeOffBlocks.value.push(response.data);
            return { success: true };
        } catch (err) {
            console.error("Error adding time off block:", err);
            const msg = err.response?.data?.message || 'خطا در ثبت زمان استراحت';
            timeOffError.value = msg;
            return { success: false, message: msg };
        }
    };

    /**
     * حذف یک زمان استراحت
     */
    const deleteTimeOffBlock = async (id) => {
        timeOffError.value = null;
        try {
            await axios.delete(`vetClinic/tenants/time-off/${id}`);
            // حذف از لیست لوکال
            timeOffBlocks.value = timeOffBlocks.value.filter(block => block.id !== id);
            return { success: true };
        } catch (err) {
            console.error("Error deleting time off block:", err);
            const msg = err.response?.data?.message || 'خطا در حذف زمان استراحت';
            timeOffError.value = msg;
            return { success: false, message: msg };
        }
    };

    // ═══════════════════════════════════════════════════════
    // 🆕 توابع مدیریت ظرفیت (Capacity Management)
    // ═══════════════════════════════════════════════════════

    /**
     _دریافت تنظیمات ظرفیت از سرور_
     */
    const fetchCapacitySettings = async () => {
        capacityLoading.value = true;
        capacityError.value = null;
        try {
            const response = await axios.get(`vetClinic/tenants/capacity/settings`);

            // اگر سرور تنظیمات کامل برگرداند
            if (response.data) {
                const data = response.data;

                capacitySettings.value = {
                    // وضعیت آنلاین
                    isOnline: data.isOnline ?? true,
                    doNotDisturb: data.doNotDisturb ?? false,
                    // گفتگوی آنلاین
                    chatEnabled: data.chatEnabled ?? true,
                    chatCapacity: data.chatCapacity ?? 3,
                    chatDuration: data.chatDuration
                        ? String(data.chatDuration)
                        : String(data.defaultConsultationDuration || '15'),
                    // تماس فوری
                    phoneInstantEnabled: data.phoneInstantEnabled ?? true,
                    phoneInstantCapacity: data.phoneInstantCapacity ?? 2,
                    phoneInstantDuration: data.phoneInstantDuration || '10',
                    // تماس زمان‌دار
                    phoneScheduledEnabled: data.phoneScheduledEnabled ?? true,
                    phoneScheduledCapacity: data.phoneScheduledCapacity ?? 5,
                    phoneScheduledDuration: data.phoneScheduledDuration || '15',
                    // صف انتظار
                    maxQueueLength: data.maxQueueLength ?? 20,
                    maxQueueWaitTime: data.maxQueueWaitTime ?? 60,
                };

                // اگر آمار هم برگردیده
                if (data.stats) {
                    capacityStats.value = data.stats;
                }
            }

            return capacitySettings.value;
        } catch (err) {
            console.error("Error fetching capacity settings:", err);
            capacityError.value = err.response?.data?.message || 'خطا در دریافت تنظیمات ظرفیت';
            // مقدار پیش‌فرض برگردانده می‌شود
            return capacitySettings.value;
        } finally {
            capacityLoading.value = false;
        }
    };

    /**
     _دریافت آمار زنده ظرفیت از سرور_
     */
    const fetchCapacityStats = async () => {
        try {
            const response = await axios.get(`vetClinic/tenants/capacity/stats`);
            capacityStats.value = response.data;
            return response.data;
        } catch (err) {
            console.error("Error fetching capacity stats:", err);
            // اگر خطا داد، از آمار محلی استفاده کن
            updateLiveCapacityStats();
            return capacityStats.value;
        }
    };

    /**
     _به‌روزرسانی تنظیمات ظرفیت_
     */
    const updateCapacitySettings = async (payload: {
        isOnline?: boolean;
        doNotDisturb?: boolean;
        chatEnabled?: boolean;
        chatCapacity?: number;
        defaultConsultationDuration?: number;
        phoneInstantEnabled?: boolean;
        phoneInstantCapacity?: number;
        phoneScheduledEnabled?: boolean;
        phoneScheduledCapacity?: number;
        maxQueueLength?: number;
        maxQueueWaitTime?: number;
    }) => {
        capacityLoading.value = true;
        capacityError.value = null;
        try {
            const response = await axios.put(
                `vetClinic/tenants/capacity/settings`,  // ✅ اصلاح شد
                payload
            );
            // به‌روزرسانی state محلی
            if (payload.isOnline !== undefined) capacitySettings.value.isOnline = payload.isOnline;
            if (payload.doNotDisturb !== undefined) capacitySettings.value.doNotDisturb = payload.doNotDisturb;
            if (payload.chatEnabled !== undefined) capacitySettings.value.chatEnabled = payload.chatEnabled;
            if (payload.chatCapacity !== undefined) capacitySettings.value.chatCapacity = payload.chatCapacity;
            if (payload.defaultConsultationDuration !== undefined) {
                capacitySettings.value.chatDuration = String(payload.defaultConsultationDuration);
            }
            if (payload.phoneInstantEnabled !== undefined) capacitySettings.value.phoneInstantEnabled = payload.phoneInstantEnabled;
            if (payload.phoneInstantCapacity !== undefined) capacitySettings.value.phoneInstantCapacity = payload.phoneInstantCapacity;
            if (payload.phoneScheduledEnabled !== undefined) capacitySettings.value.phoneScheduledEnabled = payload.phoneScheduledEnabled;
            if (payload.phoneScheduledCapacity !== undefined) capacitySettings.value.phoneScheduledCapacity = payload.phoneScheduledCapacity;
            if (payload.maxQueueLength !== undefined) capacitySettings.value.maxQueueLength = payload.maxQueueLength;
            if (payload.maxQueueWaitTime !== undefined) capacitySettings.value.maxQueueWaitTime = payload.maxQueueWaitTime;

            updateLiveCapacityStats();
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Error updating capacity settings:", err);
            const msg = err.response?.data?.message || 'خطا در به‌روزرسانی تنظیمات ظرفیت';
            capacityError.value = msg;
            return { success: false, message: msg };
        } finally {
            capacityLoading.value = false;
        }
    };


    /**
     _تغییر وضعیت آنلاین/آفلاین دکتر_
     */
    const updateOnlineStatus = async (isOnline: boolean) => {
        try {
            const response = await axios.post(`vetClinic/tenants/capacity/set-online`, { isOnline });
            capacitySettings.value.isOnline = isOnline;
            return { success: true };
        } catch (err) {
            console.error("Error updating online status:", err);
            // برگشت به حالت قبلی
            capacitySettings.value.isOnline = !isOnline;
            return { success: false, message: 'خطا در تغییر وضعیت' };
        }
    };

    /**
     _به‌روزرسانی سریع فقط وضعیت آنلاین (بدون کوئری به سرور)_
     */
    function setOnlineStatusLocally(isOnline: boolean) {
        capacitySettings.value.isOnline = isOnline;
    }
    /**
     _به‌روزرسانی DND (مزاحم نشوید)_
     */
    const updateDoNotDisturb = async (doNotDisturb: boolean) => {
        try {
            const response = await axios.post(`vetClinic/tenants/capacity/toggle-dnd`, { doNotDisturb });
            capacitySettings.value.doNotDisturb = doNotDisturb;
            return { success: true };
        } catch (err) {
            console.error("Error updating DND status:", err);
            capacitySettings.value.doNotDisturb = !doNotDisturb;
            return { success: false };
        }
    };

    // --- Helper: تبدیل تاریخ شمسی رشته‌ای به آبجکت برای مقایسه ---
    const parseJalaliDate = (dateStr:string) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('/').map(Number);
        return { year, month, day };
    };
    // --- Helper: محاسبه اختلاف روز بین دو تاریخ شمسی ---
    const getDaysDifference = (dateStr1, dateStr2) => {
        const d1 = parseJalaliDate(dateStr1);
        const d2 = parseJalaliDate(dateStr2);
        if (!d1 || !d2) return 0;

        // تبدیل به میلادی
        const g1 = toGregorian(d1.year, d1.month, d1.day);
        const g2 = toGregorian(d2.year, d2.month, d2.day);

        // ساخت آبجکت Date
        const date1 = new Date(g1.gy, g1.gm - 1, g1.gd);
        const date2 = new Date(g2.gy, g2.gm - 1, g2.gd);

        // اصلاح شده: استفاده از getTime() برای تبدیل به عدد (Timestamp)
        const diffTime = Math.abs(date2.getTime() - date1.getTime());

        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // --- Computed: آمار نوبت‌ها ---
    const appointmentStats = computed(() => {
        // تاریخ امروز شمسی
        const todayJalali = new Date().toLocaleDateString('fa-IR'); // مثلاً "1404/12/22"

        let todayCount = 0;
        let thisWeekCount = 0;
        let thisMonthCount = 0;

        appointments.value.forEach(apt => {

            if (apt.orderStatus !== 'CUSTOMER_PAID') {
                return;
            }

            // اگر نوبت لغو شده باشد، در آمار نباید شامل شود (اگر نیاز دارید)
            if (apt.status === 'cancelled') {
                return;
            }

            const aptDate = apt.date; // فرمت "YYYY/MM/DD"

            // 1. بررسی امروز
            if (aptDate === todayJalali) {
                todayCount++;
            }

            // 2. بررسی این هفته (اخیر تا ۷ روز قبل)
            const daysDiff = getDaysDifference(todayJalali, aptDate);
            if (daysDiff <= 7 && daysDiff >= 0) {
                thisWeekCount++;
            }

            // 3. بررسی این ماه (ماه و سال برابر باشد)
            const todayParts = parseJalaliDate(todayJalali);
            const aptParts = parseJalaliDate(aptDate);

            if (aptParts && todayParts &&
                aptParts.year === todayParts.year &&
                aptParts.month === todayParts.month) {
                thisMonthCount++;
            }
        });

        return {
            today: todayCount,
            thisWeek: thisWeekCount,
            thisMonth: thisMonthCount
        };
    });

    /**
     * دریافت لیست نوبت‌های در انتظار صف
     */
    const fetchQueueList = async () => {
        queueLoading.value = true;
        queueError.value = null;
        try {
            // فرض بر این است که API شما لیست صف را برمی‌گرداند
            // اگر API شما لیست را با اطلاعات کامل نوبت برنمی‌گرداند، ممکن است نیاز به join داشته باشید
            const response = await axios.get(`vetClinic/tenants/queue`);
            queueList.value = response.data;
        } catch (err) {
            console.error("Error fetching queue:", err);
            queueError.value = err.response?.data?.message || 'خطا در دریافت صف انتظار';
        } finally {
            queueLoading.value = false;
        }
    };

    /**
     * شروع مشاوره برای نوبت از صف (خواندن نوبت)
     */
    const takeAppointmentFromQueue = async (appointmentId: string) => {
        try {
            const response = await axios.post(`vetClinic/tenants/queue/${appointmentId}/start`);

            // 1. حذف نوبت از لیست صف لوکال
            queueList.value = queueList.value.filter(q => q.appointmentId !== appointmentId);

            if (response.data.appointment) {
                updateAppointmentStatus(response.data.appointment.id, response.data.appointment.status);
            } else {
                // اگر داده کامل برنگشت، یک رفرش کوچک انجام دهیم
                await fetchAppointments();
            }

            return { success: true,requiresPayment:response.data.requiresPayment,message:response.data.message };
        } catch (err) {
            console.error("Error taking appointment from queue:", err);
            throw err;
        }
    };

    /**
     * حذف نوبت از صف (رد نوبت)
     */
    const removeFromQueue = async (appointmentId: string) => {
        try {
            await axios.delete(`vetClinic/tenants/queue/${appointmentId}`);
            queueList.value = queueList.value.filter(q => q.orderId !== orderId);
            return { success: true };
        } catch (err) {
            console.error("Error removing from queue:", err);
            throw err;
        }
    };

    const fetchGlobalMedicines = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get('/vetClinic/medicines/global-medicines')
            globalMedicines.value = res.data
        } catch (err: any) {
            error.value = err.message
            console.error('Error fetching medicines:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        appointments,
        globalMedicines,
        appointmentStats,
        loading,
        error,
        timeOffBlocks,
        timeOffLoading,
        timeOffError,
        queueList,
        queueLoading,
        queueError,
        startPolling,
        stopPolling,
        fetchTimeOffBlocks,
        addTimeOffBlock,
        deleteTimeOffBlock,
        fetchAppointments,
        fetchGlobalMedicines,
        addAppointment,
        updateAppointmentStatus,
        approvedAppointment,
        changeStatusToInChat,
        changeStatusToCompleted,
        changeStatusToCancelled,
        changeExamCodeVerified,
        changeStatusToInProgress,
        fetchCapacitySettings,
        fetchCapacityStats,
        updateCapacitySettings,
        updateOnlineStatus,
        updateDoNotDisturb,
        fetchQueueList,
        takeAppointmentFromQueue,
        removeFromQueue,
    };
});