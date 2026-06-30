import {defineStore} from 'pinia'
import {axiosKey} from "../plugins/axiosPlugins";
import {inject, ref} from "vue";
import type {AxiosInstance} from 'axios'
import {safeStorage} from "../utils/safeStorage"
import {useRouter} from "vue-router";
import {MarketOrder} from "./market/order";
import {ShopReview} from "./market/reviews";
import {MarketProduct} from "./market/product";

export interface User {
    id: number
    name: string
    fullName: string
    username: string
    password: string
    isActive: boolean
    email: string
    phoneNumber: string
    roles: []
    role: { id: string, name: string }
    location: string
    avatar?: string | File | null
    createdAt: string
    lastLogin: string
    updatedAt: string
}

export interface TenantReview {
    id: string;
    tenantId: string;
    appointmentId: string;
    orderId: string;
    userId: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    reply?: string | null;       // متن پاسخ فروشگاه
    replyUpdatedAt?: string;     // تاریخ به‌روزرسانی پاسخ
    helpfulCount?: number;
    isHelpfulByMe?: boolean;
    tags?: { text: string; type: 'positive' | 'negative' }[];
}

export interface Tenant {
    id: string;
    name: string;
    type: 'MARKET' | string; // می‌توانید نوع‌های دیگر را هم اینجا اضافه کنید
    status: 'active' | string;
    ownerUserId: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    city: string;
    location: {
        lat: number;
        lng: number;
    };
    categories: string[];
    iban: string;
    documents: {
        logo: {
            // نوع داده‌های داخل لوگو بسته به نیاز شما می‌تواند متفاوت باشد (مثلاً رشته آدرس فایل یا آبجکت فایل)
            [key: string]: any;
        };
        license: {
            [key: string]: any;
        };
        nationalId: {
            [key: string]: any;
        };
    };
    rating: string; // یا number اگر مقدار عددی است
    reviewsCount: number;
    isOpen: boolean;
    freeDelivery: boolean;
    fastDelivery: boolean;
    createdAt: string;
    orders: MarketOrder[]
    reviews: ShopReview[]
    tenantReviews: TenantReview[]
    products: MarketProduct[]
    isSuspended: boolean
}

// تغییر ساختار به Setup Store
export const useAuthStore = defineStore('auth', () => {


    // ۱. تزریق axios در سطح بالای استور (مشابه setup)
    const axios = inject<AxiosInstance>(axiosKey)
    if (!axios) throw new Error('Axios instance not injected')

    // ۲. تعریف State به صورت ref
    const user = ref<User>(null)
    //const userSetting=ref<UserSetting | null>(null)
    const tenant = ref<Tenant>(null)
    const wallet = ref(null)
    const token = ref(null)
    const tenantId = ref(null)
    const adminPanelType = ref(null)
    const isAuthenticated = ref(false)
    const router = useRouter()

    // ۳. تعریف Actions به صورت توابع معمولی
    const sendOtpCode = async (phoneNumber: any) => {
        try {
            // اکنون می‌توانید از axios استفاده کنید
            const response = await axios.post('/v1/auth/send-otp', {phoneNumber})
            return response.data
        } catch (error) {
            console.error('Error sending OTP:', error)
            return {success: false, error: 'خطا در ارسال کد تایید'}
        }
    }
    const loginWithPhone = async (phoneNumber: any, otpCode: any, shopId: any) => {
        try {

            // فراخوانی API واقعی
            const response = await axios.post('/v1/auth/check-user',
                {
                    phoneNumber: phoneNumber,
                    code: otpCode,
                    shopId: shopId
                })


            token.value = response.data.token
            user.value = response.data.user
            tenantId.value = response.data.tenantId
            adminPanelType.value = response.data.adminPanelType
            isAuthenticated.value = true

            localStorage.setItem('auth_token', token.value)
            localStorage.setItem('tenant_id', tenantId.value)
            localStorage.setItem('admin_panel_type', adminPanelType.value)
            localStorage.setItem('auth_user', JSON.stringify(user.value))

            return response
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'خطا در ورود'
            }
        }
    }
    const login = async (email, password) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            let userRole = 'USER'
            if (email.includes('vet')) userRole = 'VET'
            else if (email.includes('clinic')) userRole = 'CLINIC'
            else if (email.includes('pharmacy')) userRole = 'PHARMACY'
            else if (email.includes('admin')) userRole = 'ADMIN'

            const mockUser = {
                id: '1',
                email: email,
                name: 'کاربر تست',
                role: userRole
            }

            token.value = 'mock-token-' + Date.now()
            user.value = mockUser
            isAuthenticated.value = true
            localStorage.setItem('petoman_token', token.value)
            localStorage.setItem('petoman_user', JSON.stringify(user.value))
            return {success: true}
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'خطا در ورود'
            }
        }
    }
    const register = async (userData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            let userRole = 'USER'
            if (userData.email?.includes('vet')) userRole = 'VET'
            else if (userData.email?.includes('clinic')) userRole = 'CLINIC'
            else if (userData.email?.includes('pharmacy')) userRole = 'PHARMACY'
            else if (userData.email?.includes('admin')) userRole = 'ADMIN'

            const mockUser = {
                id: '1',
                email: userData.email,
                name: userData.name,
                role: userRole,
                phone: userData.phone,
                city: userData.city
            }

            token.value = 'mock-token-' + Date.now()
            user.value = mockUser
            isAuthenticated.value = true
            localStorage.setItem('petoman_token', token.value)
            localStorage.setItem('petoman_user', JSON.stringify(user.value))
            return {success: true}
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ثبت نام'
            }
        }
    }
    const logout = async () => {
        try {
            user.value = null
            token.value = null
            isAuthenticated.value = false
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            localStorage.removeItem('tenant_id')
            localStorage.removeItem('admin_panel_type')
            // ۱. ارسال درخواست به سرور برای باطل کردن نشست در دیتابیس
            await axios.post('/v1/auth/logout');
        } catch (error) {
            console.error('خطا در ارتباط با سرور', error);
        } finally {
            // ۲. پاکسازی کامل حافظه مرورگر (صرف‌نظر از نتیجه سرور)

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
            await router.push('/login');
        }
    }
    const fetchUser = async () => {
        /*if (!token.value) return*/

        try {
            const res = await axios.get("/v1/auth/me", {
                headers: {Authorization: `Bearer ${token.value}`},
            })
            user.value = res.data
            //userSetting.value=res.data.settings
            safeStorage.setItem("auth_user", JSON.stringify(res.data))
        } catch (err) {
            console.error("Failed to fetch user:", err)
            //await logout()
        } finally {
        }
    }
    const fetchTenant = async (tenantId: string) => {
        try {

            const response = await axios.get(`/market/${tenantId}`)
            tenant.value = response.data
        } catch (error) {
            return {success: false, error: 'خطا در دریافت اطلاعات فروشگاه'}
        }
    }
    const fetchVetClinicTenant = async (tenantId: string) => {
        try {

            const response = await axios.get(`/vetClinic/${tenantId}`)
            tenant.value = response.data
        } catch (error) {
            return {success: false, error: 'خطا در دریافت اطلاعات فروشگاه'}
        }
    }
    const fetchWalletTenant = async () => {

        try {

            const response = await axios.get('/wallet/tenant')
            wallet.value = response.data
        } catch (error) {
            console.error('Error sending OTP:', error)
            return {success: false, error: 'خطا در دریافت کیف پول فروشگاه'}
        }

    }
    const updateProfile = async (userData) => {
        try {
            user.value = {...user.value, ...userData}
            localStorage.setItem('petoman_user', JSON.stringify(user.value))
            return {success: true}
        } catch (error) {
            return {
                success: false,
                error: 'خطا در بروزرسانی پروفایل'
            }
        }
    }
    const setToken = (newToken: string) => {
        token.value = newToken
        safeStorage.setItem("auth_token", newToken)
    }
    const hydrateToken = () => {
        const savedToken = safeStorage.getItem("auth_token")
        if (savedToken) {
            token.value = savedToken
            // fetchUser() // اگر می‌خواهید هیدریت شدن یوزر هم انجام شود
        }
    }
    const setTenantId = (newTenantId: string) => {
        tenantId.value = newTenantId
        safeStorage.setItem("tenant_id", newTenantId)
    }
    const hydrateTenantId = () => {
        const savedTenantId = safeStorage.getItem("tenant_id")
        if (savedTenantId) {
            tenantId.value = savedTenantId
            // fetchUser() // اگر می‌خواهید هیدریت شدن یوزر هم انجام شود
        }
    }
    const initAuth = () => {
        const savedToken = localStorage.getItem('auth_token')
        const savedTenantId = localStorage.getItem('tenant_id')
        const savedAdminPanelType = localStorage.getItem('admin_panel_type')
        const userStr = localStorage.getItem('auth_user')
        if (savedToken && userStr && savedAdminPanelType) {
            try {
                token.value = savedToken
                tenantId.value = savedTenantId
                adminPanelType.value = savedAdminPanelType
                user.value = JSON.parse(userStr)
                isAuthenticated.value = true
            } catch (error) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('admin_panel_type')
                localStorage.removeItem('tenant_id')
                localStorage.removeItem('auth_user')
                logout()
            }
        }
    }
    const saveTokenToServer = async (token:string) => {
        try {
            const res=await axios.post('/users/notification-token', {token})

        } catch (error) {
            return {success: false, error: 'خطا در ذخیره توکن'}
        }
    }

    // در فایل auth.ts یا استور مربوطه
    const calculateOnlineStatus = (onlineUsersList: any): boolean => {
        if (!tenant.value) return false;

        let usersArray: any[] = [];

        // تبدیل ورودی به آرایه
        if (Array.isArray(onlineUsersList)) {
            usersArray = onlineUsersList;
        } else if (typeof onlineUsersList.values === 'function') {
            usersArray = Array.from(onlineUsersList.values());
        } else {
            return false;
        }

        if (usersArray.length === 0) {
            return false;
        }

        // استخراج لیست IDها
        const onlineIds = usersArray.map(user => user.userId);

        // فقط محاسبه و برگرداندن نتیجه (بدون تغییر tenant)
        return onlineIds.includes(tenant.value.ownerUserId);
    };

    // ۴. بازگرداندن state و actions
    return {
        user,
        tenant,
        tenantId,
        wallet,
        token,
        setToken,
        saveTokenToServer,
        hydrateToken,
        setTenantId,
        hydrateTenantId,
        isAuthenticated,
        calculateOnlineStatus,
        sendOtpCode,
        loginWithPhone,
        login,
        register,
        logout,
        fetchUser,
        fetchTenant,
        fetchVetClinicTenant,
        fetchWalletTenant,
        updateProfile,
        initAuth
    }
})