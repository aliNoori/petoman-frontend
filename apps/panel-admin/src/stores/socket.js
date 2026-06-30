// stores/socket.js
import {defineStore} from "pinia";
import {io} from "socket.io-client";
import {ref, shallowRef, triggerRef, markRaw, computed, watch} from "vue";
import {useAuthStore} from "./auth.js";
import {useConsultationStore} from "./vet-clinic/consultation.js";
import {useAppointmentStore} from "./vet-clinic/appointment.js";

export const useSocketStore = defineStore("socket", () => {

    // ═══════════════════════════════════════════════════════
    // 🔷 State
    // ═══════════════════════════════════════════════════════
    const socket = shallowRef(null);
    const isConnected = ref(false);
    const isConnecting = ref(false);

    // پیام‌های مربوط به اتاق فعلی
    const messages = ref([]);

    // کاربران آنلاین در اتاق فعلی
    const onlineUsers = ref(new Map());

    // لیست کاربران در حال تایپ
    const typingUsers = ref([]);

    // شناسه اتاق فعلی
    const currentConsultationId = ref(null);

    // دکمه‌های pendig (برای نمایش toast)
    const toast = ref({visible: false, message: "", type: "info"});

    // وقتی currentConsultationId تغییر کرد، به اتاق جدید بپیوند
    watch(currentConsultationId, (newId, oldId) => {
        if (!socket.value) return;

        // اگر قبلاً در اتاقی بودیم، خارج شو
        if (oldId) {
            console.log(`🚪 خروج از اتاق قبلی: ${oldId}`);
            emit("leave-chat", {consultationId: oldId});
        }

        // اگر آی‌دی جدیدی داریم و سوکت متصل است، وارد اتاق شو
        if (newId && socket.value.connected) {
            console.log(`🚪 ورود به اتاق جدید: ${newId}`);
            // فرض می‌کنیم اطلاعات کاربر در authStore موجود است
            const authStore = useAuthStore();
            const user = authStore.user;

            emit("join-chat", {
                userId: user?.id,
                consultationId: newId,
                userName: user?.firstName || 'User'
            });
        }
    });

    // ═══════════════════════════════════════════════════════
    // 🔷 متدهای کمکی
    // ═══════════════════════════════════════════════════════

    function showToast(message, type = "info", duration = 4000) {
        toast.value = {visible: true, message, type};
        setTimeout(() => {
            toast.value.visible = false;
        }, duration);
    }

    function getStore(name) {
        try {
            switch (name) {
                case "consultation":
                    return useConsultationStore();
                case "appointment":
                    return useAppointmentStore();
                case "auth":
                    return useAuthStore();
                default:
                    return null;
            }
        } catch (e) {
            console.warn(`Store ${name} not available:`, e);
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 اتصال به سرور
    // ═══════════════════════════════════════════════════════
    function connect(token) {
        // جلوگیری از اتصال همزمان
        if (isConnecting.value || (socket.value && socket.value.connected)) {
            console.log("⚠️ اتصال قبلاً برقرار است یا در حال برقراری است.");
            return;
        }

        // پاکسازی سوکت قبلی
        if (socket.value) {
            console.log("🧹 پاکسازی سوکت قبلی...");
            socket.value.removeAllListeners();
            socket.value.disconnect();
            socket.value = null;
        }

        isConnecting.value = true;

        //||'http://192.168.100.3:3000' FOR NETWORK

        let socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

        if (socketUrl.startsWith('https://')) {
            socketUrl = socketUrl.replace('https://', 'ws://');
        } else if (socketUrl.startsWith('http://')) {
            socketUrl = socketUrl.replace('http://', 'ws://');
        }

        socket.value = io(socketUrl, {
            path: "/socket.io",
            query: {token},
            transports: ["websocket", "polling"],
            // forceNew: true,
            // reconnection: true,
            // reconnectionAttempts: 5,
            // reconnectionDelay: 1000,
            // reconnectionDelayMax: 5000,
            // timeout: 20000,
        });

        // ══ رویدادهای اتصال ══
        socket.value.on("connect", () => {
            console.log("✅ متصل شد:", socket.value.id);
            /*if (typeof window.showToast === 'function') {
                window.showToast('متصل شد:', 'success', 5000);
            }*/
            isConnected.value = true;
            isConnecting.value = false;

            // ارسال وضعیت آنلاین
            emit("change_user_status", {
                status: "online"
            });
        });

        socket.value.on("connect_error", (error) => {
            console.error("❌ خطا در اتصال:", error.message);
            /*if (typeof window.showToast === 'function') {
                window.showToast('خطا در اتصال:', 'error', 5000);
            }*/
            isConnecting.value = false;
        });

        socket.value.on("disconnect", (reason) => {
            console.log("❌ قطع شد:", reason);

            if (typeof window.showToast === 'function') {
                window.showToast('قطع شد:', 'error', 5000);
            }

            isConnected.value = false;
            isConnecting.value = false;

            if (reason === "io server disconnect") {
                // سرور قطع کرد، تلاش برای اتصال مجدد
                socket.value.connect();
            }
        });

        socket.value.on("reconnect", (attemptNumber) => {
            console.log("🔄 اتصال مجدد - تلاش شماره:", attemptNumber);
            if (typeof window.showToast === 'function') {
                window.showToast('اتصال مجدد - تلاش شماره:', 'warning', 5000);
            }
            isConnected.value = true;
        });

        socket.value.on('notification', (payload) => {
            const status = payload.statusLabel ?? 'warning'
            if (typeof window.showToast === 'function') {
                window.showToast(payload.message, status, 5000);
            }
        })

        socket.value.on("reconnect", (attemptNumber) => {
            console.log("🔄 اتصال مجدد موفق - تلاش شماره:", attemptNumber);
            isConnected.value = true;

            // اگر در اتاقی بودیم، دوباره به آن بپیوندیم
            if (currentConsultationId.value && socket.value.connected) {
                console.log(`🔄 تلاش برای پیوستن مجدد به اتاق: ${currentConsultationId.value}`);
                const authStore = useAuthStore();
                const user = authStore.user;

                emit("join-chat", {
                    userId: user?.id,
                    consultationId: currentConsultationId.value,
                    userName: user?.firstName || 'User'
                });
            }
        });

        setupAllHandlers()

        // ══ رویدادهای پیام ══
        //setupMessageHandlers();

        // ══ رویدادهای حضور و وضعیت ══
        //setupPresenceHandlers();
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 مدیریت رویدادهای پیام
    // ═══════════════════════════════════════════════════════
    function setupMessageHandlers() {
        if (!socket.value) return;

        // ۱. دریافت پیام جدید
        socket.value.on("new-message", (message) => {
            console.log("📩 پیام جدید:", message);

            // جلوگیری از تکرار
            const exists = messages.value.find(m => m.id === message.id);
            if (exists) return;

            // اضافه کردن به لیست محلی
            messages.value.push(message);

            // به‌روزرسانی store مربوطه
            const consultationStore = getStore("consultation");
            if (consultationStore) {
                const consultation = consultationStore.consultations.find(
                    c => c.id === currentConsultationId.value
                );
                if (consultation) {
                    // بررسی وجود پیام
                    if (!consultation.messages) {
                        consultation.messages = [];
                    }
                    const msgExists = consultation.messages.find(m => m.id === message.id);
                    if (!msgExists) {
                        consultation.messages.push(message);
                    }
                }
            }

            // ارسال نوتیفیکیشن مرورگر
            if (message.senderId !== getStore("auth")?.user?.id) {
                showBrowserNotification("پیام جدید", message.text || "پیام جدیدی دریافت شد");
            }
        });

        // ۲. وضعیت خوانده شدن
        socket.value.on("message-read", (data) => {
            // آپدیت در messages محلی
            const localMsg = messages.value.find(m => m.id === data.messageId);
            if (localMsg) {
                localMsg.status = "read";
                localMsg.readBy = data.readBy;
                localMsg.readTime = data.readTime;
            }

            // آپدیت در store
            const consultationStore = getStore("consultation");
            if (consultationStore) {
                const consultation = consultationStore.consultations.find(
                    c => c.id === currentConsultationId.value
                );
                if (consultation?.messages) {
                    const msg = consultation.messages.find(m => m.id === data.messageId);
                    if (msg) {
                        msg.status = "read";
                        msg.readBy = data.readBy;
                        msg.readTime = data.readTime;
                    }
                }
            }
        });

        // ۳. وضعیت تایپ کردن
        socket.value.on("user-typing", (data) => {
            if (data.isTyping) {
                if (!typingUsers.value.find(u => u.userId === data.userId)) {
                    typingUsers.value.push(data);
                }
            } else {
                typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId);
            }
        });

        // ۴. پیام‌های سیستمی
        socket.value.on("system-message", (data) => {
            showToast(data.text, "info");
            const localMsg = messages.value.find(m => m.id === data.messageId);
            if (!localMsg && data.messageId) {
                messages.value.push({
                    id: data.messageId,
                    text: data.text,
                    type: "system",
                    time: new Date().toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    senderId: "SYSTEM",
                    status: "delivered"
                });
            }
        });
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 مدیریت رویدادهای حضور
    // ═══════════════════════════════════════════════════════
    function setupPresenceHandlers() {
        if (!socket.value) return;

        // ۱. کاربر آنلاین/آفلاین شد
        socket.value.on("user-online", (data) => {
            if (data.isOnline) {
                onlineUsers.value.set(data.userId.toString(), data);
            } else {
                onlineUsers.value.delete(data.userId.toString());
                // حذف از لیست تایپ‌کننده‌ها
                typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId);
            }
            triggerRef(onlineUsers);
        });

        // ۲. لیست کاربران آنلاین اتاق
        socket.value.on("online-users-list", (usersList) => {
            console.log("👥 لیست آنلاین‌های اتاق:", usersList);
            if (Array.isArray(usersList)) {
                usersList.forEach(user => {
                    onlineUsers.value.set(user.userId.toString(), user);
                });
            }
            triggerRef(onlineUsers);
        });

        // ۳. تغییر وضعیت کاربر
        socket.value.on("user_status_changed", (data) => {
            if (data.status === "offline") {
                onlineUsers.value.delete(data.userId.toString());
                typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId);
            }
            triggerRef(onlineUsers);
        });

        // ۴. خروج از اتاق
        socket.value.on("user-left-room", (data) => {
            console.log("🚪 کاربر از اتاق خارج شد:", data);
            typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId);
            if (onlineUsers.value.has(data.userId)) {
                onlineUsers.value.delete(data.userId);
                triggerRef(onlineUsers);
            }
        });

        // ۵. کاربر مسدود شد
        socket.value.on("user-blocked", (data) => {
            console.log("🚫 کاربر مسدود شد:", data);
            showToast("کاربر مسدود شد", "warning");
        });

        // ۶. خطا از سرور
        socket.value.on("error", (data) => {
            console.error("❌ خطای سوکت:", data.message);
            showToast(data.message || "خطایی رخ داد", "error");
        });
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 رویدادهای مربوط به مشاوره
    // ═══════════════════════════════════════════════════════
    function setupConsultationHandlers() {
        if (!socket.value) return;

        // تایید مشاوره
        socket.value.on("approve-consultation", (data) => {
            console.log("✅ مشاوره تایید شد:", data);
            showToast("مشاوره تایید شد. می‌توانید گفتگو کنید.", "success");

            const consultationStore = getStore("consultation");
            if (consultationStore?.updateConsultation) {
                consultationStore.updateConsultation(data.consultationId, {
                    status: "active",
                    requestStatus: "confirmed"
                });
            }

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.updateAppointmentStatus) {
                appointmentStore.updateAppointmentStatus(data.consultationId, "in-progress");
            }
        });

        // تغییر وضعیت چت
        socket.value.on("chat-status-changed", (data) => {
            console.log("💬 وضعیت چت تغییر کرد:", data);

            const consultationStore = getStore("consultation");
            if (consultationStore?.updateConsultation) {
                consultationStore.updateConsultation(data.consultationId, {
                    status: data.status
                });
            }

            if (data.status === "closed") {
                showToast("مشاوره پایان یافت", "info");
            }
        });
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 رویدادهای مربوط به سرویس‌های آنی (ظرفیت)
    // ═══════════════════════════════════════════════════════
    function setupCapacityHandlers() {
        if (!socket.value) return;

        // درخواست جدید مشاوره فوری
        socket.value.on("new-instant-request", (data) => {
            console.log("🔔 درخواست فوری جدید:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.addAppointment) {
                appointmentStore.addAppointment(data.appointment);
            }

            // نوتیفیکیشن صوتی
            playNotificationSound();
            showBrowserNotification("درخواست جدید", `درخواست مشاوره فوری از ${data.ownerName || "کاربر"}`);
            showToast(`درخواست جدید از ${data.petName || "کاربر"}!`, "info");
        });

        // تمدید زمان درخواست
        socket.value.on("request-extended", (data) => {
            console.log("⏰ زمان درخواست تمدید شد:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.appointments) {
                const apt = appointmentStore.appointments.find(a => a.id === data.requestId);
                if (apt) {
                    apt.remainingTime = data.newMinutes;
                }
            }

            showToast(`زمان تماس تا ${data.newMinutes} دقیقه تمدید شد`, "warning");
        });

        // لغو درخواست
        socket.value.on("request-cancelled", (data) => {
            console.log("❌ درخواست لغو شد:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.appointments) {
                appointmentStore.appointments = appointmentStore.appointments.filter(
                    a => a.id !== data.requestId
                );
            }

            showToast("درخواست لغو شد", "warning");
        });

        // نوبت کاربر رسید
        socket.value.on("queue-your-turn", (data) => {
            console.log("🎉 نوبت شما رسید!", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.updateAppointmentStatus) {
                appointmentStore.updateAppointmentStatus(data.requestId, "queued", {
                    yourTurn: true
                });
            }

            playNotificationSound();
            showBrowserNotification("نوبت شما رسید!", "مشاوره شما آماده است. لطفاً وارد صفحه مشاوره شوید.");
            showToast("🎉 نوبت شما رسید! مشاوره آماده است.", "success", 10000);
        });

        // وضعیت صف تغییر کرد
        socket.value.on("queue-position-changed", (data) => {
            console.log("📊 موقعیت صف تغییر کرد:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.appointments) {
                const apt = appointmentStore.appointments.find(a => a.id === data.requestId);
                if (apt) {
                    apt.queueNumber = data.position;
                    apt.estimatedWaitMinutes = data.estimatedWait;
                }
            }
        });

        // تایم‌اوت درخواست
        socket.value.on("request-timeout", (data) => {
            console.log("⏰ درخواست منقضی شد:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.updateAppointmentStatus) {
                appointmentStore.updateAppointmentStatus(data.requestId, "expired");
            }

            showToast("درخواست منقضی شد", "error");
        });

        // پرداخت تکمیل شد
        socket.value.on("payment-completed", (data) => {
            console.log("💳 پرداخت تکمیل شد:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.appointments) {
                const apt = appointmentStore.appointments.find(a => a.id === data.requestId);
                if (apt) {
                    apt.isPaid = true;
                    apt.paymentId = data.paymentId;
                }
            }
        });

        // وضعیت آنلاین دکتر تغییر کرد
        socket.value.on("vet-status-changed", (data) => {
            console.log("🔴 وضعیت آنلاین دکتر:", data);

            const appointmentStore = getStore("appointment");
            if (appointmentStore?.capacitySettings) {
                appointmentStore.capacitySettings.isOnline = data.isOnline;
            }
        });
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 متدهای ارسال (Emit)
    // ═══════════════════════════════════════════════════════

    function emit(eventName, payload) {
        if (socket.value && socket.value.connected) {
            socket.value.emit(eventName, payload);
        } else {
            console.warn(`⚠️ نمی‌توان ${eventName} ارسال کرد - سوکت متصل نیست`);
        }
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 Actions
    // ═══════════════════════════════════════════════════════

    // پیوستن به اتاق مشاوره
    function joinConsultation({userId, consultationId, userName}) {
        if (!socket.value || !socket.value.connected) {
            console.error("❌ سوکت متصل نیست، نمی‌توان به اتاق پیوست.");
            return;
        }

        currentConsultationId.value = consultationId;
        messages.value = [];
        onlineUsers.value = new Map();
        typingUsers.value = [];

        emit("join-chat", {userId, consultationId, userName});
        console.log(`🚪 پیوستن به اتاق: ${consultationId}`);
    }

    // خروج از اتاق مشاوره
    function leaveConsultation(userId) {
        if (!socket.value || !currentConsultationId.value) return;

        emit("leave-chat", {
            consultationId: currentConsultationId.value,
            userId
        });

        console.log(`🚪 خروج از اتاق: ${currentConsultationId.value}`);

        currentConsultationId.value = null;
        messages.value = [];
        onlineUsers.value = new Map();
        typingUsers.value = [];
    }

    // تایید مشاوره
    function approveConsultation({consultationId, doctorName}) {
        if (!socket.value || !socket.value.connected) {
            console.error("❌ سوکت متصل نیست!");
            return;
        }

        currentConsultationId.value = consultationId;
        messages.value = [];

        // آپدیت store
        const consultationStore = getStore("consultation");
        if (consultationStore?.updateConsultation) {
            consultationStore.updateConsultation(consultationId, {
                status: "active",
                requestStatus: "confirmed"
            });
        }

        const appointmentStore = getStore("appointment");
        if (appointmentStore?.updateAppointmentStatus) {
            appointmentStore.updateAppointmentStatus(consultationId, "in-progress", {
                appointmentDate: new Date()
            });
        }

        emit("approve-consultation", {consultationId, doctorName});
        console.log(`✅ تایید مشاوره: ${consultationId}`);
    }

    // بستن چت
    function closeChat({chatId, rating, review, note}) {
        if (!socket.value || !socket.value.connected) {
            console.error("❌ سوکت متصل نیست!");
            return;
        }

        const consultationId = chatId || currentConsultationId.value;

        // آپدیت store
        const consultationStore = getStore("consultation");
        if (consultationStore?.updateConsultation) {
            consultationStore.updateConsultation(consultationId, {
                status: "closed"
            });
        }

        emit("close-chat", {
            consultationId,
            rating,
            review,
            note
        });

        console.log(`❌ بستن چت: ${consultationId}`);
    }

    // ارسال پیام متنی
    function sendMessage({messageText, senderId, senderName, type = "text", prescription, file}) {
        console.log('dddd', !socket.value, !socket.value.connected, !currentConsultationId.value)
        /*if (!socket.value || !socket.value.connected || !currentConsultationId.value) {
            console.error("❌ شرایط ارسال پیام فراهم نیست!");
            return;
        }*/

        emit("send-message", {
            consultationId: currentConsultationId.value,
            senderId,
            senderName,
            type,
            text: messageText,
            file: file || null,
            prescription: prescription || undefined
        });
    }

    // ارسال فایل
    function sendFile({file, senderId, senderName}) {
        if (!socket.value || !socket.value.connected || !currentConsultationId.value) {
            console.error("❌ شرایط ارسال فایل فراهم نیست!");
            return;
        }

        const fileType = file.type?.startsWith("image/") ? "image" : "file";

        emit("send-file", {
            consultationId: currentConsultationId.value,
            file,
            type: fileType,
            senderId,
            senderName
        });
    }

    // ارسال نسخه
    function sendPrescription({prescription, senderId, senderName, text}) {
        if (!socket.value || !socket.value.connected || !currentConsultationId.value) {
            console.error("❌ شرایط ارسال نسخه فراهم نیست!");
            return;
        }

        emit("send-prescription", {
            consultationId: currentConsultationId.value,
            senderId,
            senderName,
            text: text || "نسخه تجویز شد",
            type: "prescription",
            prescription
        });
    }

    // شروع تایپ
    function startTyping({userId, userName}) {
        if (!socket.value || !socket.value.connected || !currentConsultationId.value) return;

        emit("typing", {
            consultationId: currentConsultationId.value,
            userId,
            userName,
            isTyping: true
        });
    }

    // پایان تایپ
    function stopTyping({userId, userName}) {
        if (!socket.value || !socket.value.connected || !currentConsultationId.value) return;

        emit("typing", {
            consultationId: currentConsultationId.value,
            userId,
            userName,
            isTyping: false
        });
    }

    // خوانده شدن پیام
    function markAsRead({messageId, readBy}) {
        if (!socket.value || !socket.value.connected || !currentConsultationId.value) return;

        emit("mark-as-read", {
            messageId,
            consultationId: currentConsultationId.value,
            readBy
        });
    }

    // مسدود کردن کاربر
    function blockUser({userIdToBlocked, blockReason}) {
        if (!socket.value || !socket.value.connected || !currentConsultationId.value) {
            console.error("❌ شرایط مسدود کردن فراهم نیست!");
            return;
        }

        emit("block-user", {
            consultationId: currentConsultationId.value,
            userIdToBlocked,
            blockReason
        });
    }

    // تغییر وضعیت آنلاین/آفلاین
    function changeUserStatus({status}) {
        if (!socket.value || !socket.value.connected) {
            console.error("❌ سوکت متصل نیست!");
            return;
        }

        emit("change_user_status", {status});

        // به‌روزرسانی store
        const appointmentStore = getStore("appointment");
        if (appointmentStore) {
            appointmentStore.setOnlineStatusLocally(status === "online");
        }
    }

    // پذیرش درخواست فوری
    function acceptInstantRequest(requestId) {
        if (!socket.value || !socket.value.connected) return;

        emit("accept-instant-request", {requestId});
    }

    // رد درخواست فوری
    function rejectInstantRequest(requestId, reason) {
        if (!socket.value || !socket.value.connected) return;

        emit("reject-instant-request", {requestId, reason});
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 توابع کمکی نوتیفیکیشن
    // ═══════════════════════════════════════════════════════

    function showBrowserNotification(title, body) {
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted") return;

        try {
            const notification = new Notification(title, {
                body,
                icon: "/favicon.ico",
                tag: `notify-${Date.now()}`,
                requireInteraction: false,
                silent: false
            });
            console.log('notification', notification)
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            setTimeout(() => notification.close(), 10000);
        } catch (e) {
            console.error("خطا در نمایش نوتیفیکیشن:", e);
        }
    }

    function playNotificationSound() {
        try {
            const audio = new Audio("/sounds/notification.mp3");
            audio.volume = 0.5;
            audio.play().catch(() => {
            });
        } catch (e) {
            // صدا پشتیبانی نمی‌شود
        }
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 قطع اتصال
    // ═══════════════════════════════════════════════════════

    function disconnect() {
        if (socket.value) {
            // ارسال وضعیت آفلاین قبل از قطع
            if (isConnected.value) {
                emit("change_user_status", {status: "offline"});
            }

            socket.value.removeAllListeners();
            socket.value.disconnect();
            socket.value = null;
        }

        isConnected.value = false;
        isConnecting.value = false;
        currentConsultationId.value = null;
        messages.value = [];
        onlineUsers.value = new Map();
        typingUsers.value = [];

        console.log("🔌 سوکت قطع شد");
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 راه‌اندازی اولیه تمام handler ها
    // ═══════════════════════════════════════════════════════

    function setupAllHandlers() {
        setupMessageHandlers();
        setupPresenceHandlers();
        setupConsultationHandlers();
        setupCapacityHandlers();
    }

    // ═══════════════════════════════════════════════════════
    // 🔷 Computed
    // ═══════════════════════════════════════════════════════

    const onlineUsersArray = computed(() => {
        return Array.from(onlineUsers.value.values());
    });

    const isUserOnline = (userId) => {
        return onlineUsers.value.has(userId?.toString());
    };

    const setConsultationId = (newId) => {
        const oldId = currentConsultationId.value;

        // اگر آی‌دی تغییر نکرده، کاری نکن
        if (oldId === newId) return;

        // اگر سوکت متصل است، ابتدا از اتاق قبلی خارج شو
        if (socket.value && socket.value.connected && oldId) {
            console.log(`🚪 خروج از اتاق قبلی: ${oldId}`);
            emit("leave-chat", {consultationId: oldId});
        }

        // تغییر وضعیت
        currentConsultationId.value = newId;

        // اگر آی‌دی جدیدی داریم و سوکت متصل است، وارد اتاق شو
        if (newId && socket.value && socket.value.connected) {
            console.log(`🚪 ورود به اتاق جدید: ${newId}`);
            const authStore = useAuthStore();
            const user = authStore.user;

            emit("join-chat", {
                userId: user?.id,
                consultationId: newId,
                userName: user?.firstName || 'User'
            });
        }
    }

    const markConsultationRead = ({consultationId, userId}) => {

        if (socket.value && socket.value.isConnected) {
            emit("mark-consultation-read", {
                consultationId,
                userId: userId // یا هر جایی که userId را دارید
            });
        }
    }

    return {
        // State
        socket,
        isConnected,
        isConnecting,
        messages,
        onlineUsers,
        typingUsers,
        currentConsultationId,
        toast,

        // Computed
        onlineUsersArray,
        isUserOnline,

        // Actions
        connect,
        disconnect,
        emit,

        // مشاوره
        setConsultationId,
        joinConsultation,
        leaveConsultation,
        approveConsultation,
        closeChat,
        sendMessage,
        sendFile,
        sendPrescription,
        startTyping,
        stopTyping,
        markAsRead,
        blockUser,

        // حضور
        changeUserStatus,

        // سرویس‌های آنی
        acceptInstantRequest,
        rejectInstantRequest,

        // نوتیفیکیشن
        showToast,
        showBrowserNotification,

        // Setup
        markConsultationRead,
        setupAllHandlers,
    };
});