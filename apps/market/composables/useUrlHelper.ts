export const useUrlHelper = () => {
    // آدرس IP سرور یا آدرسی که می‌خواهید مبدل به آن شود
    // می‌توانید این را از متغیرهای محیطی (env) نیز بخوانید
    const networkBaseUrl = 'http://192.168.100.3:3000';
    //const networkBaseUrl = 'http://10.203.239.195:3000';
    const localBaseUrl = 'http://localhost:3000';

    /**
     * آدرس تصویر یا مسیر را دریافت کرده و در صورت نیاز آن را تبدیل می‌کند
     * @param path آدرس ورودی (مثلاً یک مسیر نسبی یا آدرس کامل)
     * @returns آدرس نهایی
     */
    const resolveUrl = (path: string): string => {
        if (!path) return '';

        // اگر آدرس از قبل http یا https شروع می‌شود، بررسی کنیم که آیا لوکال است یا خیر
        if (path.startsWith('http')) {
            // اگر آدرس لوکال است، آن را با آدرس شبکه جایگزین کن
            if (path.includes('localhost') || path.includes('127.0.0.1')) {
                // پورت و مسیر را استخراج می‌کنیم
                const urlObj = new URL(path);
                return `${networkBaseUrl}${urlObj.pathname}${urlObj.search}`;
            }
            // اگر آدرس از قبل خارجی یا شبکه است، همان را برگردان
            return path;
        }

        // اگر آدرس نسبی است (مثلاً /uploads/... یا uploads/...)
        // اطمینان حاصل می‌کنیم که با اسلش شروع شود
        const cleanPath = path.startsWith('/') ? path : `/${path}`;

        return `${networkBaseUrl}${cleanPath}`;
    };

    return {
        resolveUrl
    };
};