// src/utils/date.ts
import jalaali from 'jalaali-js'

/**
 * تبدیل تاریخ میلادی (ISO) به شمسی
 * @param isoDate - مثل "2025-11-06"
 * @returns - مثل "1404/08/15"
 */
export const toJalaliDate = (isoDate: string): string => {
    const date = new Date(isoDate)

    const { jy, jm, jd } = jalaali.toJalaali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    )

    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`
        .replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
}

/**
 * تبدیل تاریخ شمسی به میلادی (ISO)
 * @param jalaliDate - مثل "1404/08/15"
 * @returns - مثل "2025-11-06"
 */
export const toGregorianDate = (jalaliDate: string): string => {
    const [jy, jm, jd] = jalaliDate.split('/').map(Number)
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd)
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}