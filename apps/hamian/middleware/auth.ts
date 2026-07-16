import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAuthStore} from "../stores/auth";
import { useRuntimeConfig } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  // چک کردن لاگین بودن کاربر
  if (!authStore.isAuthenticated) {

    // محاسبه URL بازگشتی
    let redirectUrl: string;

    if (process.client) {
      // اگر در مرورگر هستیم، آدرس کامل فعلی را می‌گیریم
      redirectUrl = window.location.href;
    } else {
      // اگر در سرور هستیم، آدرس نسبی را می‌گیریم و با baseUrl ترکیب می‌کنیم
      // فرض بر این است که config.public.baseUrl آدرس سایت اصلی شماست
      // توجه: اگر baseUrl در public config نیست، باید از runtimeConfig عمومی استفاده کنید
      redirectUrl = `${config.public.baseUrl}${to.fullPath}`;
    }

    // هدایت به دامنه لاگین
    // چون لاگین در دامنه دیگری است، باید از window.location استفاده کنیم
    // این عملیات فقط در کلاینت معنا دارد، اما برای اطمینان از اجرا در کلاینت چک می‌کنیم

    if (process.client) {
      window.location.href = `${config.public.authBaseUrl}?redirect=${encodeURIComponent(redirectUrl)}`;
      return; // متد را متوقف کن
    }

    // اگر در سرور هستیم و کاربر لاگین نیست، معمولاً باید صفحه لاگین را رندر کنیم
    // اما چون لاگین خارجی است، بهتر است کاربر را به صفحه اصلی برگردانیم یا اجازه دهیم نوست صفحه را رندر کند
    // و در کلاینت متوجه شود که لاگین نیست
    return navigateTo('/');
  }
});