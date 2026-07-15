import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocketStore = defineStore("socket", {
    state: () => ({
        socket: null,
    }),
    actions: {
        connect(token) {
            if (!this.socket) {
                let socketUrl = import.meta.env.VITE_SOCKET_URL;

                // تشخیص خودکار پروتکل
                // اگر URL با https شروع شد، اما سرور ما http است، باید آن را به ws تبدیل کنیم
                // یا اگر URL با http شروع شد، به ws تبدیل شود

                // روش ۱: اجبار به استفاده از ws اگر سرور HTTP است
                // فرض بر این است که سرور شما روی پورت 3000 و بدون SSL است
                if (socketUrl.startsWith('https://')) {
                    socketUrl = socketUrl.replace('https://', 'ws://');
                } else if (socketUrl.startsWith('http://')) {
                    socketUrl = socketUrl.replace('http://', 'ws://');
                }

                console.log("Connecting to socket:", socketUrl); // برای دیباگ

                this.socket = io(socketUrl, {
                    path: "/socket.io",
                    query: { token },
                    transports: ["websocket", "polling"], // polling را هم اضافه کنید برای اطمینان
                });

                // اضافه کردن ایونت‌های دیباگ (اختیاری)
                this.socket.on('connect', () => {
                    console.log('Socket connected successfully');
                });

                this.socket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err);
                });
            }
        },
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
        }
    },
});