// src/utils/errorHandler.ts

/**
 * تبدیل خطاهای فنی به پیام‌های فارسی قابل فهم برای کاربر
 * @param error - شیء خطا یا رشته
 * @returns پیام فارسی مناسب برای نمایش به کاربر
 */
export const getErrorMessage = (error: any): string => {
    // اگر خطا یک رشته است
    if (typeof error === 'string') {
        return error
    }

    // اگر خطا پاسخ سرور است (مثلاً خطای ۴۰۰ یا ۵۰۰)
    if (error?.response?.data) {
        const data = error.response.data

        // اگر سرور پیام خاصی فرستاده (مثلاً خطای اعتبارسنجی)
        if (data.message) return data.message

        // اگر سرور لیستی از خطاها فرستاده (مثلاً فیلدهای اشتباه)
        if (data.errors) {
            // تبدیل آبجکت خطاها به متن
            return Object.values(data.errors).flat().join(' ، ')
        }
    }

    // خطاهای عمومی شبکه
    if (error?.message === 'Network Error') {
        return 'اتصال به اینترنت برقرار نیست. لطفاً ارتباط خود را بررسی کنید.'
    }

    // حالت پیش‌فرض
    return 'خطایی غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.'
}