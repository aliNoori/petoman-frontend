import badWordsData from './badwords.json'

// لیست کلمات نامناسب از فایل JSON
export const offensiveWords = badWordsData.word

// الگوهای regex
export const offensivePatterns = [
  /ک[\s\W]*ی[\s\W]*ر/gi,
  /ک[\s\W]*[سصو][\s\W]*[سص]/gi,
  /ک[\s\W]*و[\s\W]*ن/gi,
  /س[\s\W]*ک[\s\W]*س/gi,
  /ج[\s\W]*ن[\s\W]*د[\s\W]*ه/gi,
  /ف[\s\W]*ا[\s\W]*ک/gi,
  /ش[\s\W]*ی[\s\W]*ت/gi,
  /س[\s\W]*[ک]*[\s\W]*س[\s\W]*ی/gi,
  /د[\s\W]*[ی]*[\s\W]*و[\s\W]*[ث]/gi,
  /[بپ][\s\W]*[یي][\s\W]*ش[\s\W]*ع[\s\W]*و[\s\W]*ر/gi,
]

// نرمالسازی متن
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[_\-\*\.\@\#\$\%\^\&\(\)\[\]\{\}\|\\\/<>]/g, '')
    .replace(/\s+/g, '')
    // نرمال‌سازی حروف فارسی
    .replace(/[ئ]/g, 'ی')
    .replace(/[ىي]/g, 'ی')  // تبدیل ی عربی و فارسی به یکسان
    .replace(/[ك]/g, 'ک')
    .replace(/[ه]/g, 'ه')
    .replace(/[ۀ]/g, 'ه')
    // حذف اعراب
    .replace(/[\u064B-\u0652]/g, '')
}

// چک کردن محتوا
export function containsOffensiveContent(text: string): boolean {
  const normalized = normalizeText(text)
  const original = text.toLowerCase()
  
  // چک کلمات دقیق
  for (const word of offensiveWords) {
    const normalizedWord = normalizeText(word)
    
    if (normalized.includes(normalizedWord)) {
      return true
    }
    
    if (original.includes(word.toLowerCase())) {
      return true
    }
  }
  
  // چک الگوهای regex
  for (const pattern of offensivePatterns) {
    if (pattern.test(text) || pattern.test(normalized)) {
      return true
    }
  }
  
  return false
}

// چک کردن متن انگلیسی
export function containsEnglish(text: string): boolean {
  // الگوی regex برای حروف انگلیسی
  const englishPattern = /[a-zA-Z]/
  return englishPattern.test(text)
}

// چک کردن اینکه متن فقط شامل حروف فارسی، اعداد و علائم مجاز باشه
export function isValidPersianText(text: string): boolean {
  // حذف فضاهای خالی و علائم نگارشی مجاز
  const cleanText = text.replace(/[\s\u200c\u200d\u200e\u200f.,،؛:!؟\-_(){}[\]*@#$%^&]/g, '')
  
  // اگه متن خالی شد، مجازه (فقط فضا و علائم بوده)
  if (cleanText.length === 0) return true
  
  // چک کنه که فقط شامل حروف فارسی و اعداد باشه
  const persianOnlyPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF۰-۹0-9]+$/
  
  return persianOnlyPattern.test(cleanText)
}

// چک کردن لینک (URL)
export function containsUrl(text: string): boolean {
  // الگوهای مختلف URL
  const urlPatterns = [
    // http:// یا https://
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
    // www.example.com
    /www\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
    // example.com (domain)
    /(?:^|\s)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(com|ir|org|net|edu|gov|io|co|me|app|dev|tech|shop|xyz|online|site|info|biz)\b/gi,
    // t.me/username (telegram)
    /t\.me\/[a-zA-Z0-9_]+/gi,
    // @username (telegram/instagram)
    /@[a-zA-Z0-9_]{3,}/g,
    // bit.ly, goo.gl و سایر short URLs
    /(bit\.ly|goo\.gl|tinyurl\.com|ow\.ly|short\.link)\/[a-zA-Z0-9]+/gi,
  ]
  
  for (const pattern of urlPatterns) {
    if (pattern.test(text)) {
      return true
    }
  }
  
  return false
}

// چک کردن ایمیل
export function containsEmail(text: string): boolean {
  // الگوی استاندارد ایمیل
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi
  
  // الگوهای مخفی شده (مثل: example[at]gmail[dot]com)
  const obfuscatedEmailPatterns = [
    /[a-zA-Z0-9._%+-]+\s*\[at\]\s*[a-zA-Z0-9.-]+\s*\[dot\]\s*[a-zA-Z]{2,}/gi,
    /[a-zA-Z0-9._%+-]+\s*@\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}/gi,
    /[a-zA-Z0-9._%+-]+\s*(at|در|ات)\s*[a-zA-Z0-9.-]+\s*(dot|نقطه|دات)\s*[a-zA-Z]{2,}/gi,
  ]
  
  if (emailPattern.test(text)) {
    return true
  }
  
  for (const pattern of obfuscatedEmailPatterns) {
    if (pattern.test(text)) {
      return true
    }
  }
  
  return false
}

// چک کردن شماره تلفن
export function containsPhoneNumber(text: string): boolean {
  // الگوهای شماره تلفن ایران
  const phonePatterns = [
    // 09123456789
    /0\d{10}/g,
    // +98 912 345 6789
    /\+98\s*\d{3}\s*\d{3}\s*\d{4}/g,
    // 0912 345 6789
    /0\d{3}[\s-]?\d{3}[\s-]?\d{4}/g,
    // ۰۹۱۲۳۴۵۶۷۸۹ (اعداد فارسی)
    /[۰-۹]{11}/g,
  ]
  
  for (const pattern of phonePatterns) {
    if (pattern.test(text)) {
      return true
    }
  }
  
  return false
}
