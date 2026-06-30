import moment from 'moment-jalaali'

// بارگذاری تنظیمات فارسی (یکبار کافی است)
moment.loadPersian({ usePersianDigits: false })

/**
 * تبدیل تاریخ شمسی (مثلاً "1403/08/06") به میلادی ISO String
 */
export const toGregorian = (jalaliDateStr) => {
    if (!jalaliDateStr) return null
    // اگر قبلاً میلادی است (برای حالت‌هایی که دیتابیس مستقیم برمی‌گرداند)
    if (jalaliDateStr.includes('T') || (jalaliDateStr.includes('-') && !jalaliDateStr.includes('/'))) {
        return jalaliDateStr
    }

    const parts = jalaliDateStr.split('/')
    if (parts.length !== 3) return null

    const jy = parseInt(parts[0])
    const jm = parseInt(parts[1])
    const jd = parseInt(parts[2])

    return moment(`${jy}/${jm}/${jd}`, 'jYYYY/jMM/jDD').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
}

/**
 * تبدیل تاریخ میلادی (ISO String) به شمسی (مثلاً "1403/08/06")
 */
export const toJalali = (gregorianDateStr) => {
    if (!gregorianDateStr) return ''
    return moment(gregorianDateStr).format('jYYYY/jMM/jDD')
}