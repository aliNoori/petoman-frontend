import { defineStore } from "pinia"
import { safeStorage } from "~/utils/safeStorage"
import {useNuxtApp,useRouter} from "nuxt/app";
import type {AxiosInstance} from "axios";
import {useUploader} from "~/composables/useUploader";
import {ref, computed, readonly} from "vue";

export interface User {
  id: string
  firstName: string
  lastName: string
  phoneNumber:string
  email: string
  avatar?: string
  posts:number
  role: string
  createdAt: string
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const router=useRouter()
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === "admin")
  const isModerator = computed(() =>
      ["admin", "moderator"].includes(user.value?.role || "")
  )
  const { $axios } = useNuxtApp()
  const axios = $axios as AxiosInstance

  const setToken = (newToken: string) => {
    token.value = newToken
    safeStorage.setItem("auth_token", newToken)
  }

  const fetchUser = async () => {

    if (!token.value) return
    loading.value = true
    try {
      console.log("axios instance:", axios)

      const res = await axios.get("/v1/auth/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = res.data
      safeStorage.setItem("auth_user", JSON.stringify(res.data))
    } catch (err) {
      console.error("Failed to fetch user:", err)
      logout()
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (id: string, payload: User, avatarFile?: File) => {
    const uploader = useUploader()
    let avatarUrl: string | undefined

    // اگر فایل جدیدی انتخاب شده بود، آپلود کن
    if (avatarFile) {
      avatarUrl = await uploader.upload(avatarFile, '/v1/uploads/image')
    }

    // فقط فیلدهای قابل ویرایش
    const updatedPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      avatar: avatarUrl || payload.avatar
    }

    const res = await axios.patch(`/users/${id}`, updatedPayload, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    user.value = res.data
    safeStorage.setItem("auth_user", JSON.stringify(res.data))
  }

  const logout = async () => {
    try {
      // ۱. ارسال درخواست به سرور برای باطل کردن نشست در دیتابیس
      await axios.post('/v1/auth/logout');
    } catch (error) {
      console.error('خطا در ارتباط با سرور', error);
    } finally {
      // ۲. پاکسازی کامل حافظه مرورگر (صرف‌نظر از نتیجه سرور)
      // if ($toast) {
      //   ($toast as any)('شما با موفقیت خارج شدید', 'success', 5000)
      // }
      // الف) پاک کردن LocalStorage و SessionStorage
      // اگر safeStorage یک آبجکت wrapper است، از متدهای خودش استفاده کنید:
      if (safeStorage && typeof safeStorage.clear === 'function') {
        safeStorage.clear(); // این روش تمام آیتم‌ها را پاک می‌کند
      } else {
        // در غیر این صورت تک‌تک آیتم‌ها را حذف کنید
        safeStorage.removeItem("auth_token");
        safeStorage.removeItem("auth_user");
        // اگر آیتم‌های دیگری دارید اینجا اضافه کنید
      }

      // ب) پاک کردن تمام کوکی‌ها (Cookies)
      // جاوااسکریپت به صورت مستقیم متدی برای پاک کردن "همه" کوکی‌ها ندارد
      // بنابراین باید آن‌ها را پیدا کرده و تاریخ انقضای آن‌ها را به گذشته برگردانیم
      document.cookie.split(";").forEach((c) => {
        const cookieParts = c.split("=");
        const cookieName = cookieParts.shift()?.trim();
        // تنظیم تاریخ انقضا به گذشته برای حذف کوکی
        // path=/ ضروری است تا کوکی‌های مسیرهای مختلف هم پاک شوند
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // ج) پاک کردن متغیرهای وضعیت (State)
      user.value = null;
      token.value = null;

      window.location.href = '/'

      // د) هدایت کاربر به صفحه ورود (اختیاری)
      await router.push('/');
    }
  }

  const hydrateToken = () => {
    const savedToken = safeStorage.getItem("auth_token")
    if (savedToken) {
      token.value = savedToken
      //fetchUser()
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    isAuthenticated,
    isAdmin,
    isModerator,
    setToken,
    fetchUser,
    updateProfile,
    logout,
    hydrateToken,
  }
})