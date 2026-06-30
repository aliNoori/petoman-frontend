// stores/socket.js
import {defineStore} from "pinia";
import {io} from "socket.io-client";
import {computed, triggerRef} from "vue";
import {useConsultationStore} from "~/stores/consultation";
import {useMessageStore} from "~/stores/message";
import {useNuxtApp} from '#app';

export const useSocketStore = defineStore("socket", {
    state: () => ({
        socket: null,
        isConnected: false,
        isJoinedRoom: false,
        notification: {},
        messages: [], // لیست پیام‌های اتاق فعلی
        onlineUsers: new Map(), // لیست کاربران آنلاین
        typingUsers: [], // لیست کاربرانی که در حال تایپ هستند
        currentConsultationId: null, // شناسه مشاوره‌ای که کاربر در آن است
    }),
    actions: {
        // ۱. اتصال به سرور
        connect(token) {
            // ✅ اگر در حال اتصال است یا قبلاً متصل شده، کاری نکن
            if (this.isConnecting || (this.socket && this.socket.connected)) {
                console.log("⚠️ اتصال قبلاً برقرار است یا در حال برقراری است.");
                return;
            }

            this.isConnecting = true; // ✅ قفل را فعال کن

            // ✅ اگر آبجکت سوکت وجود دارد (حتی اگر قطع باشد)، آن را کامل پاک کن
            if (this.socket) {
                console.log("🧹 پاکسازی سوکت قبلی...");
                this.socket.disconnect();
                this.socket.removeAllListeners(); // حذف تمام لیسنرهای قدیمی
                this.socket = null;
            }

            // پورت سرور شما ۳۰۰۱ بود، اگر پروکسی ندارید این آدرس صحیح است
            let socketUrl = import.meta.env.VITE_SOCKET_URL;

            if (socketUrl.startsWith('https://')) {
                socketUrl = socketUrl.replace('https://', 'ws://');
            } else if (socketUrl.startsWith('http://')) {
                socketUrl = socketUrl.replace('http://', 'ws://');
            }

            this.socket = io(socketUrl, {
                path: "/socket.io",
                query: {token},
                transports: ["websocket", "polling"],
            });

            // مدیریت رویدادهای اتصال
            this.socket.on("connect", () => {
                console.log("✅ متصل شد:", this.socket.id);
                this.isConnected = true;
                this.isConnecting = false; // ✅ قفل را باز کن
            });

            this.socket.on("disconnect", () => {
                console.log("❌ قطع شد");
                this.isConnected = false;
                this.isJoinedRoom = false;
                this.isConnecting = false; // ✅ قفل را باز کن
            });

            this.socket.on("joined-room-success", (data) => {
                if (data.consultationId === this.currentConsultationId) {
                    this.isJoinedRoom = true;
                    console.log(`✅ عضویت در اتاق ${data.consultationId} تایید شد`);
                }
            });

            // ۲. دریافت پیام جدید (از سرور)
            this.socket.on("new-message", (message) => {
                console.log("پیام جدید دریافت شد:", message);
                const exists = this.messages.find(m => m.id === message.id);
                if (!exists) {
                    this.messages.push(message);
                    this.showBrowserNotification("پیام جدید", message.text || "پیام تستی جدیدی دریافت شد");
                }
            });

            // ۲. دریافت(از سرور)
            this.socket.on("user-blocked", (data) => {
                console.log('User blocked event received:', data);

                // ۱. نمایش پیام خطا به کاربر (Toast)
                // فرض بر این است که شما یک تابع showToast دارید یا از کتابخانه‌ای استفاده می‌کنید
                // اگر از Toast ساده استفاده می‌کنید:
                alert('شما توسط ادمین مسدود شدید و از چت خارج شدید.');

                // یا اگر از سیستم Toast خودتان استفاده می‌کنید:
                // showToast('error', 'شما توسط ادمین مسدود شدید');

                // ۲. قطع اتصال سوکت برای جلوگیری از ارسال پیام‌های بیشتر
                if (this.socket) {
                    this.socket.disconnect();
                }

                // ۳. هدایت کاربر به صفحه اصلی یا صفحه لاگین
                // اگر از Vue Router استفاده می‌کنید:
                //this.$router.push('/');
                // یا
                // this.$router.push('/auth/login');

                // ۴. پاک کردن اطلاعات کاربر از LocalStorage (اختیاری)
                //localStorage.removeItem('token');
                //localStorage.removeItem('user');
            });

            // ۳. دریافت وضعیت خوانده شدن پیام
            this.socket.on("message-read", (data) => {
                // ۱. آپدیت در استور سوکت (برای هماهنگی داخلی)
                const msgInSocket = this.messages.find(m => m.id === data.messageId);
                if (msgInSocket) {
                    msgInSocket.status = 'read';
                    msgInSocket.readBy = data.readBy;
                    msgInSocket.readTime = data.readTime;
                }
                // ۲. ✅ آپدیت در استور پیام‌ها (messageStore) که در قالب استفاده می‌شود
                const messageStore = useMessageStore();
                const msgInUi = messageStore.messages.find(m => m.id === data.messageId);
                if (msgInUi) {
                    msgInUi.status = 'read';
                    msgInUi.readBy = data.readBy;
                    msgInUi.readTime = data.readTime;
                }
            });

            this.socket.on("chat-status-changed", async (data) => {

                const {useConsultationStore} = await import("@/stores/consultation.js");
                const consultationStore = useConsultationStore();
                const consultation = computed(() => consultationStore.consultations.find(c => c.id === data.consultationId))

                if (consultation) {
                    consultationStore.updateConsultation(consultation.value.id, {status: data.status})
                }
            });

            // ۴. دریافت وضعیت تایپ کردن
            this.socket.on("user-typing", (data) => {
                if (data.isTyping) {
                    // جلوگیری از تکرار در لیست
                    if (!this.typingUsers.find(u => u.userId === data.userId)) {
                        this.typingUsers.push(data);
                    }
                } else {
                    this.typingUsers = this.typingUsers.filter(u => u.userId !== data.userId);
                }
            });

            // ۵. دریافت وضعیت آنلاین/آفلاین کاربران
            this.socket.on("user-online", (data) => {
                if (data.isOnline) {
                    this.onlineUsers.set(data.userId, data);
                } else {
                    this.onlineUsers.delete(data.userId);
                }
                triggerRef(this.onlineUsers);
            });

            this.socket.on("online-users-list", (usersList) => {
                console.log("لیست آنلاین‌های اتاق دریافت شد:", usersList);

                // ❌ این خط را حذف کنید: this.onlineUsers.clear();

                if (Array.isArray(usersList)) {
                    usersList.forEach(user => {
                        // فقط اگر کاربر وجود ندارد اضافه کن (یا آپدیت کن)
                        this.onlineUsers.set(user.userId.toString(), user);
                    });
                }
                triggerRef(this.onlineUsers);
            });

            // --- اضافه شده: دریافت رویداد تایید مشاوره ---
            this.socket.on("approve-consultation", async (data) => {


                console.log("🟢 مشاوره تایید شد:", data);

                // دسترسی به استور consultation و آپدیت کردن وضعیت
                const consultationStore = useConsultationStore();

                // فرض بر این است که در استور consultation متدی به نام updateConsultationStatus دارید
                if (consultationStore.updateConsultation) {
                    await consultationStore.updateConsultation(data.consultationId, {
                        status: data.status,
                        requestStatus: data.status
                    });
                }
            });

            this.socket.on("user-left-room", (data) => {
                console.log("کاربر از اتاق خارج شد:", data);

                // ۱. حذف کاربر از لیست تایپ‌کننده‌ها (چون دیگر در اتاق نیست)
                this.typingUsers = this.typingUsers.filter(u => u.userId !== data.userId);

                // ۲. (اختیاری) اگر لیست آنلاین‌های مخصوص اتاق دارید، او را از آنجا هم حذف کنید
                if (this.onlineUsers.has(data.userId)) {
                    this.onlineUsers.delete(data.userId);
                    triggerRef(this.onlineUsers);
                }
            });

            // --- ایونت‌های مربوط به صف (Queue) و ظرفیت کلینیک ---
            // ۳.۱ دریافت نوبت شما شد
            this.socket.on("consultation_started", (data) => {
                console.log("🎉 مشاوره شما شروع شما شد:", data);

                const nuxtApp = useNuxtApp();

                // ✅ دیباگ: چک کنید آیا $toast وجود دارد
                if (!nuxtApp.$toast) {
                    console.error('❌ Error: $toast function is not available in useNuxtApp');
                    return;
                }

                console.log('🚀 Calling $toast...');
                nuxtApp.$toast('نوبت شما شروع شد! در حال انتقال به چت...', 'success', 5000);

            });

            // ۳.۱ دریافت نوبت شما شد
            this.socket.on("queue-your-turn", (data) => {
                console.log("🎉 نوبت شما شد:", data);
                const {$toast} = useNuxtApp();
                if ($toast) {
                    $toast('نوبت شما شد! لطفاً منتظر بمانید.', 'info', 4000);
                }
            });

            // ۳.۲ دریافت تغییر موقعیت در صف
            this.socket.on("queue-position-changed", (data) => {
                console.log("📍 موقعیت شما در صف تغییر کرد:", data);
                const message = `موقعیت شما: ${data.position}. زمان تقریبی: ${data.estimatedWait || '?'} دقیقه`;
                const {$toast} = useNuxtApp();
                if ($toast) {
                    $toast(message, 'info', 3000);
                }
            });

            // ۳.۳ دریافت درخواست فوری جدید (مخصوص دکترها)
            this.socket.on("new-instant-request", (data) => {
                console.log("🚨 درخواست فوری جدید:", data);
                // نمایش نوتیفیکیشن برای دکتر
                // showToast('warning', `درخواست فوری جدید از ${data.ownerName}`);
                // اضافه کردن به لیست درخواست‌های در انتظار در استور مربوطه
            });

            // ۳.۴ درخواست پذیرفته شد (مخصوص بیمار)
            this.socket.on("instant-request-accepted", (data) => {
                console.log("✅ درخواست شما پذیرفته شد:", data);
                // showToast('success', 'دکتر درخواست شما را پذیرفت');
                // هدایت به اتاق چت
                // if (data.consultationId) router.push(`/consultation/${data.consultationId}`);
            });

            // ۳.۵ درخواست رد شد (مخصوص بیمار)
            this.socket.on("instant-request-rejected", (data) => {
                console.log("❌ درخواست رد شد:", data);
                // showToast('error', `درخواست رد شد: ${data.reason}`);
            });

            // ۳.۶ درخواست لغو شد (مخصوص دکتر)
            this.socket.on("request-cancelled", (data) => {
                console.log("🚫 درخواست لغو شد:", data);
                // آپدیت UI صف برای دکتر
            });

            // ۳.۷ زمان درخواست تمدید شد (مخصوص بیمار)
            this.socket.on("request-extended", (data) => {
                console.log("⏳ زمان درخواست تمدید شد:", data);
                // showToast('info', `زمان شما به ${data.newMinutes} دقیقه تمدید شد`);
            });

            // ۳.۸ زمان درخواست منقضی شد
            this.socket.on("request-timeout", (data) => {
                console.log("⏰ زمان درخواست منقضی شد:", data);
                // showToast('error', 'زمان نوبت شما به پایان رسید');
            });

            // ۳.۹ پرداخت تکمیل شد
            this.socket.on("payment-completed", (data) => {
                console.log("💳 پرداخت تکمیل شد:", data);
                // showToast('success', 'پرداخت با موفقیت انجام شد');
                // ادامه فرآیند نوبت‌دهی
            });

            // ۳.۱۰ شروع صف/مشاوره
            this.socket.on("consultation-started", (data) => {
                console.log("🟢 مشاوره شروع شد:", data);
                // آپدیت وضعیت در استور مشاوره
                // یا نمایش پیام به کاربر که دکتر وارد چت شده است
            });

            this.socket.on("queue-started", (data) => {
                console.log("🟢 نوبت شروع شد:", data);
                // مخصوص دکتر برای اطلاع از شروع نوبت
            });

            this.socket.on('notification', (payload) => {
                console.log('notification', payload)
                const {$toast} = useNuxtApp();
                if ($toast) {
                    $toast(payload.message, 'success', 5000);
                }
            })
        },

        // ۶. پیوستن به اتاق مشاوره (Join Room)
        joinConsultation({userId, consultationId, userName}) {
            if (!this.socket || !this.socket.connected) {
                console.warn("⚠️ سوکت متصل نیست، نمی‌توان به اتاق وارد شد.");
                return;
            }

            // اگر قبلاً در همین اتاق هستیم، کاری نکن
            if (this.currentConsultationId === consultationId) {
                console.log(`✅ همین الان هم در اتاق ${consultationId} هستیم.`);
                return;
            }

            console.log(`🔗 تلاش برای عضویت در اتاق: ${consultationId}`);

            // تغییر وضعیت داخلی (بدون ارسال leave به سرور)
            // این کار باعث می‌شود اگر شبکه قطع شد، دوباره در connect() به این اتاق برگردیم
            this.currentConsultationId = consultationId;
            this.isJoinedRoom = true;

            // پاک کردن پیام‌های قبلی در UI (اختیاری)
            this.messages.splice(0, this.messages.length);

            // ارسال درخواست عضویت به سرور
            this.socket.emit("join-chat", {
                userId,
                consultationId,
                userName
            });
        },

        // ۷. ارسال پیام متنی
        sendMessage({messageText, senderId, senderName, type, prescription, file}) {
            if (this.socket && this.socket.connected) {
                this.socket.emit("send-message", {
                    consultationId: this.currentConsultationId,

                    // ✅ طبق استاندارد messageObject

                    // ۱. شناسه یکتا: در سمت کلاینت نداریم (سرور تولید می‌کند)، پس ارسال نمی‌کنیم
                    // id: ...,

                    // ۲. فرستنده: شناسه فرستنده را ارسال می‌کنیم (کلاینت تصمیم می‌گیرد doctor است یا customer)
                    senderId: senderId,

                    // ۳. نوع محتوا
                    type: type,

                    // ۴. متن پیام
                    text: messageText,

                    // ۵. زمان: سرور تولید می‌کند، پس ارسال نمی‌کنیم
                    // time: ...,

                    // ۶. وضعیت تحویل: سرور تولید می‌کند
                    // status: ...,

                    // ۷. اطلاعات فایل: چون پیام متنی است، null ارسال می‌کنیم
                    file: file,

                    // ۸. اطلاعات نسخه: چون پیام متنی است، undefined ارسال می‌کنیم
                    prescription: prescription,

                    // فیلدهای کمکی برای نمایش نام
                    senderName: senderName
                });
            } else {
                console.error("سوکت متصل نیست!");
            }
        },

        // ۸. ارسال فایل
        sendFile({file, senderId, senderName}) {
            if (this.socket && this.isConnected) {
                // نکته: فرض بر این است که فایل قبلاً آپلود شده و URL آن را دارید
                // یا اینکه آبجکت فایل را مستقیماً می‌فرستید (بسته به منطق سرور)
                this.socket.emit("send-file", {
                    consultationId: this.currentConsultationId,
                    file: file, // باید شامل name, size, type, url باشد
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    senderId,
                    senderName,
                });
            }
        },

        // ۹. اعلام شروع تایپ کردن
        startTyping({userId, userName}) {
            if (this.socket && this.isConnected) {
                this.socket.emit("typing", {
                    consultationId: this.currentConsultationId,
                    userId,
                    userName,
                    isTyping: true,
                });
            }
        },

        // ۱۰. اعلام پایان تایپ کردن
        stopTyping({userId, userName}) {
            if (this.socket && this.isConnected) {
                this.socket.emit("typing", {
                    consultationId: this.currentConsultationId,
                    userId,
                    userName,
                    isTyping: false,
                });
            }
        },

        // ۱۱. علامت‌گذاری پیام به عنوان خوانده شده
        markAsRead({messageId, readBy}) {
            if (this.socket && this.isConnected) {
                this.socket.emit("mark-as-read", {
                    messageId,
                    consultationId: this.currentConsultationId,
                    readBy,
                });
            }
        },
        // ۱۳. تایید مشاوره توسط دکتر
        approveConsultation({consultationId, doctorName}) {
            if (this.socket && this.isConnected) {
                this.socket.emit("approve-consultation", {
                    consultationId,
                    doctorName
                });
            } else {
                console.error("سوکت متصل نیست!");
            }
        },

        // ۱۲. قطع اتصال دستی
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
                this.isConnected = false;
                this.isJoinedRoom = false;
                this.onlineUsers.clear();
                this.typingUsers = [];
            }
        },
        // اکشن خروج از اتاق (اضافه شود)
        leaveConsultation() {
            if (this.socket && this.currentConsultationId) {
                this.socket.emit("leave-chat", {
                    consultationId: this.currentConsultationId,
                    userId: useAuthStore().user?.id // یا هر جایی که userId را دارید
                });
                console.log(`🚪 خروج از اتاق: ${this.currentConsultationId}`);
                this.currentConsultationId = null; // پاک کردن شناسه اتاق فعلی
                this.isJoinedRoom = false;
            }
        },
        // ۱۵. تغییر وضعیت کاربر (Online/Offline)
        changeUserStatus(status) {
            if (this.socket && this.isConnected) {
                this.socket.emit("change_user_status", {
                    status: status, // 'online' یا 'offline'
                    // userId را سرور از توکن می‌خواند
                });
            }
        },

        // ۱۶. پذیرش درخواست فوری (مخصوص دکتر)
        acceptInstantRequest({requestId}) {
            if (this.socket && this.isConnected) {
                this.socket.emit("accept-instant-request", {
                    requestId
                });
            }
        },

        // ۱۷. رد درخواست فوری (مخصوص دکتر)
        rejectInstantRequest({requestId, reason}) {
            if (this.socket && this.isConnected) {
                this.socket.emit("reject-instant-request", {
                    requestId,
                    reason: reason || ''
                });
            }
        },
        getRoomConnectionStatus() {
            return {
                connected: this.isConnected,
                joined: this.isJoinedRoom,
                room: this.currentConsultationId
            };
        },

        markConsultationRead({consultationId, userId}) {

            if (this.socket && this.isConnected) {
                this.socket.emit("mark-consultation-read", {
                    consultationId,
                    userId: userId // یا هر جایی که userId را دارید
                });
            }
        },

        showBrowserNotification(title, body) {

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

                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };

                setTimeout(() => notification.close(), 10000);
            } catch (e) {
                console.error("خطا در نمایش نوتیفیکیشن:", e);
            }
        }

    },
});