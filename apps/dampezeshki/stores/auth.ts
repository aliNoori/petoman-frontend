import {defineStore} from "pinia"
import {safeStorage} from "~/utils/safeStorage";
import {useRouter} from "vue-router";
import {useNuxtApp} from "nuxt/app";
import type {AxiosInstance} from "axios";
import {useUploader} from "~/composables/useUploader";
import {ref, computed} from "vue";

// تعریف اینترفیس کاربر
export interface User {
  id: string
  name:string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  avatar?: string
  dateOfBirth: string
  role: string
  createdAt: string
}
export interface UserSetting {
  id: string;

  /* -------- Notifications -------- */
  newFilmsNotification: boolean;
  commentsNotification: boolean;

  /* -------- Privacy -------- */
  publicProfile: boolean;
  showFavorites: boolean;

  // --- تنظیمات سفارش ---
  appointmentTimeNotifications: boolean;

  // --- تنظیمات تخفیف‌ها ---
  vaccinationNotifications: boolean;

  // --- تنظیمات پیامک ---
  smsAppointmentNotifications: boolean;

  // --- تنظیمات خبرنامه ---
  newsletter: boolean;

  /* -------- Relations -------- */
  user?: User; // آبجکت کاربر (اختیاری برای جلوگیری از Circular Dependency)
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  deviceName: string;  // تغییر از device به deviceName
  os: string;          // سیستم عامل
  ip: string;          // آی‌پی
  isActive: boolean;   // وضعیت فعال بودن
  createdAt: string;   // تاریخ ساخت (به جای lastActive)
}
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const userSetting=ref<UserSetting | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const router=useRouter()
  const sessions = ref<Session[]>([])
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === "admin")
  const isModerator = computed(() =>
      ["admin", "moderator"].includes(user.value?.role || "")
  )



  const setToken = (newToken: string) => {
    const {$toast} = useNuxtApp()
    if ($toast && typeof $toast === 'function') {
      ($toast as any)('شما با موفقیت وارد شدید', 'success', 5000)
    }
    token.value = newToken
    safeStorage.setItem("auth_token", newToken)
  }

  const fetchUser = async () => {
    if (!token.value) return
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance
    loading.value = true
    try {
      const res = await axios.get("/v1/auth/me", {
        headers: {Authorization: `Bearer ${token.value}`},
      })

      user.value = res.data
      userSetting.value=res.data.settings
      safeStorage.setItem("auth_user", JSON.stringify(res.data))
    } catch (err) {
      console.error("Failed to fetch user:", err)
      if(err.response?.data?.statusCode===401){
        await logout()
      }
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (id: string, payload: User, avatarFile?: File) => {
    const uploader = useUploader()
    let avatarUrl: string | undefined
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    if (avatarFile) {
      avatarUrl = await uploader.upload(avatarFile, '/v1/uploads/image')
    }

    const updatedPayload = {
      fullName: payload.name,
      //firstName: payload.firstName,
      //lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      dateOfBirth:payload.dateOfBirth,
      avatar: avatarUrl || payload.avatar
    }

    const res = await axios.patch(`/users/${id}`, updatedPayload, {
      headers: {Authorization: `Bearer ${token.value}`}
    })

    user.value = res.data
    safeStorage.setItem("auth_user", JSON.stringify(res.data))
  }

  const logout = async () => {
    try {
      const {$axios,$toast} = useNuxtApp()
      const axios = $axios as AxiosInstance
      // ۱. ارسال درخواست به سرور برای باطل کردن نشست در دیتابیس
      await axios.post('/v1/auth/logout');
    } catch (error) {
      console.error('خطا در ارتباط با سرور', error);
    } finally {
      const {$toast} = useNuxtApp()
      // ۲. پاکسازی کامل حافظه مرورگر (صرف‌نظر از نتیجه سرور)
      if ($toast) {
        ($toast as any)('شما با موفقیت خارج شدید', 'success', 5000)
      }
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
        const cookieName = cookieParts.shift().trim();
        // تنظیم تاریخ انقضا به گذشته برای حذف کوکی
        // path=/ ضروری است تا کوکی‌های مسیرهای مختلف هم پاک شوند
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // ج) پاک کردن متغیرهای وضعیت (State)
      user.value = null;
      token.value = null;

      // د) هدایت کاربر به صفحه ورود (اختیاری)
      await router.push('/');
    }
  }

  const hydrateToken = () => {

    const savedToken = safeStorage.getItem("auth_token")
    if (savedToken) {
      token.value = savedToken
      // fetchUser() // اگر می‌خواهید هیدریت شدن یوزر هم انجام شود
    }
  }

  const updateNotificationSetting = async (field: string, enabled: boolean) => {
    loading.value = true;
    try {
      const {$axios} = useNuxtApp()
      const axios = $axios as AxiosInstance
      const res = await axios.post("/users/update-notification-setting", { field, enabled });
      return res.data;
    } catch (err) {
      console.error("Failed to update notification setting:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSessions = async () => {
    loading.value = true
    try {
      const {$axios} = useNuxtApp()
      const axios = $axios as AxiosInstance
      const res = await axios.get("/sessions", {
        headers: {Authorization: `Bearer ${token.value}`},
      })
      sessions.value = res.data
    } catch (err) {
      console.error("Failed to fetch sessions:", err)
    } finally {
      loading.value = false
    }
  }

  // متد برای حذف یک جلسه خاص
  const revokeSession = async (sessionId: string) => {
    try {
      const {$axios} = useNuxtApp()
      const axios = $axios as AxiosInstance
      await axios.delete(`/sessions/${sessionId}`, {
        headers: {Authorization: `Bearer ${token.value}`}
      })
      // حذف از لیست محلی
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
    } catch (err) {
      console.error("Failed to revoke session:", err)
    }
  }

  const revokeAllSessions = async () => {
    try {
      const {$axios} = useNuxtApp()
      const axios = $axios as AxiosInstance
      await axios.delete(`/sessions/revoke/revoke-all`, {
        headers: {Authorization: `Bearer ${token.value}`}
      })
    } catch (err) {
      console.error("Failed to revoke all sessions:", err)
    }
  }
  const initAuth = async () => {
    const savedToken = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')
    if (savedToken && userStr) {
      try {
        token.value = savedToken
        user.value = JSON.parse(userStr)
      } catch (error) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        await logout()
      }
    }
  }

  return {
    initAuth,
    user,
    userSetting,
    token,
    sessions,
    loading,
    isAuthenticated,
    isAdmin,
    isModerator,
    setToken,
    fetchUser,
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    updateProfile,
    logout,
    hydrateToken,
    updateNotificationSetting
  }
})