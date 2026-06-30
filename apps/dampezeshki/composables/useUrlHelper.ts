export const useUrlHelper = () => {
    // آدرس IP سرور یا آدرسی که می‌خواهید مبدل به آن شود
    // می‌توانید این را از متغیرهای محیطی (env) نیز بخوانید
    //const networkBaseUrl = 'http://192.168.100.3:3000';
    const networkBaseUrl = 'http://192.168.100.3:3000';
    const localBaseUrl = 'http://localhost:3000';

    /**
     * آدرس تصویر یا مسیر را دریافت کرده و در صورت نیاز آن را تبدیل می‌کند
     * @param path آدرس ورودی (مثلاً یک مسیر نسبی یا آدرس کامل)
     * @returns آدرس نهایی
     */
    const resolveUrl = (path: string | null | undefined): string | null => {
        // اگر path وجود نداشته باشد (null, undefined, یا رشته خالی)
        if (!path || typeof path !== 'string') {
            return null; // تغییر مهم: به جای '', null برگردان
        }

        if (path.startsWith('http')) {
            if (path.includes('localhost') || path.includes('127.0.0.1')) {
                try {
                    const urlObj = new URL(path);
                    return `${networkBaseUrl}${urlObj.pathname}${urlObj.search}`;
                } catch (e) {
                    return null;
                }
            }
            return path;
        }

        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${networkBaseUrl}${cleanPath}`;
    };

    return {
        resolveUrl
    };
};