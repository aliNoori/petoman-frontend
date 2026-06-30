// stores/message.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore} from "~/stores/auth";
import { useNuxtApp } from "nuxt/app";
import type { AxiosInstance} from "axios";
import {useUploader} from "~/composables/useUploader";

export const useMessageStore = defineStore("message", () => {
    // --- State ---
    const messages = ref([]); // لیست پیام‌های لود شده
    const loading = ref(false);
    const error = ref(null);
    const uploader=useUploader();

    // --- Nuxt App & Axios ---
    const { $axios } = useNuxtApp();
    const axios = $axios as AxiosInstance;

    // --- Actions ---

    /**
     * دریافت پیام‌های یک اتاق مشاوره خاص از سرور
     */
    const fetchConsultationMessages = async (consultationId) => {
        loading.value = true;
        error.value = null;

        try {
            // دریافت از کنترلر NestJS
            const response = await axios.get(`/messages/consultation`, {
                params: { consultationId }
            });

            const authStore = useAuthStore();
            const currentUserId = authStore.user?.id;

            // تبدیل (Map) داده‌های دیتابیس به فرمت UI
            messages.value = response.data.map(msg => ({
                id: msg.id,
                text: msg.text,
                senderId: msg.senderId,
                isMe: msg.senderId === currentUserId, // بررسی اینکه فرستنده خودمان هستیم
                time: new Date(msg.sentAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                file: msg.file, // آبجکت فایل شامل name, url, type
                prescription:msg.prescription,
                status: msg.seenAt ? 'read' : (msg.isDelivered ? 'delivered' : 'sent'),
                type: msg.type
            }));

        } catch (err) {
            console.error("Error fetching messages:", err);
            error.value = err.response?.data?.message || 'خطا در دریافت پیام‌ها';
        } finally {
            loading.value = false;
        }
    };

    /**
     * پاک کردن لیست پیام‌ها (مثلاً هنگام خروج از چت)
     */
    const clearMessages = () => {
        messages.value = [];
    };

    /**
     * افزودن یک پیام جدید به لیست (برای پیام‌های Real-time سوکت)
     */
    const addMessage = (messageData) => {
        console.log('messages',messages.value,'messageData',messageData)
        console.log('find',messages.value.find(m => String(m.id) === String(messageData.id)))
        // جلوگیری از تکرار
        if (!messages.value.find(m => String(m.id) === String(messageData.id))) {
            messages.value.push(messageData);
        }
    };

    /**
     * دریافت پیام‌های خصوصی بین کاربر جاری و کاربر هدف
     */
    const fetchPrivateMessages = async (targetUserId) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await $axios.get(`/messages/private`, {
                params: { targetUserId }
            });

            const authStore = useAuthStore();
            const currentUserId = authStore.user?.id;

            // تبدیل داده‌ها به فرمت UI
            messages.value = response.data.map(msg => ({
                id: msg.id,
                text: msg.text,
                senderId: msg.senderId,
                isMe: msg.senderId === currentUserId,
                time: new Date(msg.sentAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                file: msg.file,
                status: msg.seenAt ? 'read' : (msg.isDelivered ? 'delivered' : 'sent'),
                type: msg.file ? (msg.file.type?.startsWith('image/') ? 'image' : 'file') : 'text'
            }));

        } catch (err) {
            console.error("Error fetching private messages:", err);
            error.value = err.response?.data?.message || 'خطا در دریافت پیام‌های خصوصی';
        } finally {
            loading.value = false;
        }
    };

    const uploadFile = async (file) => {
        let fileUrl = '';
        // اگر تصویر اصلی یک فایل (File) بود، آن را آپلود کن
        // اگر رشته (string) بود یعنی URL قبلی است و دست نمی‌زنیم
        if (file instanceof File) {
            fileUrl = await uploader.uploadImage(file);
        }
        return fileUrl;
    };

    // --- Return ---
    return {
        messages,
        loading,
        error,
        fetchPrivateMessages,
        fetchConsultationMessages,
        clearMessages,
        uploadFile,
        addMessage
    };
});