import { ref } from 'vue'

export interface SupporterData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  supportType: 'financial' | 'volunteer'
  experience: string
  motivation: string
  bio: string
  avatar: string
  joinDate: string
  totalDonation: string
  animalsSaved: number
  volunteerHours: number
  specialties?: string[]
  achievements?: Array<{
    title: string
    date: string
    icon: string
  }>
  socialLinks?: {
    instagram?: string
    telegram?: string
    linkedin?: string
    twitter?: string
  }
}

export const useSupporters = () => {
  const supporters = ref<SupporterData[]>([
    {
      id: 1,
      firstName: 'سارا',
      lastName: 'احمدی',
      email: 'sara.ahmadi@email.com',
      phone: '09121234567',
      title: 'دامپزشک تیم نجات',
      supportType: 'volunteer',
      experience: 'بیش از ۱۰ سال تجربه در جراحی حیوانات کوچک و درمان حیوانات صدمه دیده. عضو نظام دامپزشکی و متخصص در حوزه مراقبت‌های اورژانسی حیوانات.',
      motivation: 'از کودکی عاشق حیوانات بودم و همیشه آرزو داشتم که بتوانم در کاهش درد و رنج آن‌ها نقش داشته باشم. باور دارم که هر موجود زنده‌ای حق زندگی کرامتمندانه دارد.',
      bio: 'سلام! من سارا هستم. از کودکی با حیوانات زندگی کرده‌ام و عاشق آن‌ها بودم. دانشکده دامپزشکی تهران رو رفتم و الان بیش از ۱۰ سال تجربه کار دارم. تو پتومن به عنوان دامپزشک داوطلب کار می‌کنم و تا حالا صدها حیوان رو درمان کردم. فکر می‌کنم این کار نه صرفاً شغل، بلکه رسالت زندگیمه.',
      avatar: '/images/supporter1.jpg',
      joinDate: '2023-03-15',
      totalDonation: '۲۵,۰۰۰,۰۰۰',
      animalsSaved: 156,
      volunteerHours: 420,
      specialties: ['جراحی اورژانس', 'طب داخلی', 'رادیولوژی', 'مراقبت‌های ویژه'],
      achievements: [
        { title: 'نجات ۱۰۰ حیوان', date: '2024-09-15', icon: 'ti ti-award' },
        { title: 'داوطلب برتر سال', date: '2024-12-29', icon: 'ti ti-trophy' },
        { title: 'حامی نمونه', date: '2025-03-01', icon: 'ti ti-medal' }
      ],
      socialLinks: {
        instagram: '@dr.sara.ahmadi',
        telegram: '@sara_vet'
      }
    },
    {
      id: 2,
      firstName: 'علی',
      lastName: 'کریمی',
      email: 'ali.karimi@email.com',
      phone: '09129876543',
      title: 'رئیس تیم داوطلبان',
      supportType: 'volunteer',
      experience: 'مدیریت تیم‌های داوطلب و هماهنگی عملیات نجات. تجربه ۸ ساله در سازمان‌های غیرانتفاعی و مدیریت پروژه‌های اجتماعی.',
      motivation: 'معتقدم که جامعه‌ای که به حیوانات رحم کند، جامعه‌ای انسان‌تر خواهد بود. می‌خواهم نسل آینده را در محیطی رشد دهم که مهربانی و عطوفت در آن حکمفرماست.',
      bio: 'من علی هستم، مدیر تیم داوطلبان پتومن. از ۸ سال پیش که تو این حوزه فعالیت می‌کنم و تجربه کار با سازمان‌های مختلف رو دارم. اینجا مسئولیت هماهنگی عملیات نجات و آموزش داوطلبان جدید رو برعهده دارم. برام خیلی مهمه که بتونیم یه تیم قوی و منسجم داشته باشیم تا بتونیم به بهترین شکل کمک کنیم.',
      avatar: '/images/supporter2.jpg',
      joinDate: '2023-02-10',
      totalDonation: '۱۸,۵۰۰,۰۰۰',
      animalsSaved: 203,
      volunteerHours: 680,
      specialties: ['مدیریت عملیات', 'هماهنگی تیم', 'آموزش داوطلبان', 'برنامه‌ریزی'],
      achievements: [
        { title: 'مدیر نمونه', date: '2024-12-10', icon: 'ti ti-users' },
        { title: 'سازمان‌دهی ۵۰ عملیات نجات', date: '2024-11-20', icon: 'ti ti-calendar-check' },
        { title: 'آموزش ۱۰۰ داوطلب', date: '2025-01-15', icon: 'ti ti-school' }
      ],
      socialLinks: {
        instagram: '@ali_rescue',
        linkedin: 'ali-karimi-social'
      }
    },
    {
      id: 3,
      firstName: 'مریم',
      lastName: 'صادقی',
      email: 'maryam.sadeghi@email.com',
      phone: '09123456789',
      title: 'مسئول روابط عمومی',
      supportType: 'financial',
      experience: 'کارشناس ارتباطات با ۶ سال تجربه در حوزه روابط عمومی و رسانه. مسلط به طراحی محتوا و استراتژی‌های دیجیتال مارکتینگ.',
      motivation: 'باور دارم که آگاهی‌بخشی و اطلاع‌رسانی می‌تواند تغییر بزرگی در نگرش جامعه نسبت به حیوانات ایجاد کند. هر پست، هر محتوا می‌تواند زندگی یک حیوان را نجات دهد.',
      bio: 'سلام، من مریم هستم! کارشناس روابط عمومی پتومن. از ۶ سال پیش تو حوزه رسانه و محتوا کار می‌کنم. اینجا مسئولیت اطلاع‌رسانی فعالیت‌ها و ارتباط با رسانه‌ها رو دارم. خیلی دوست دارم با محتواهایی که تولید می‌کنم، دل مردم رو نرم کنم و نگرششون نسبت به حیوانات رو تغییر بدم. فکر می‌کنم هر محتوا می‌تونه زندگی یه حیوان رو نجات بده.',
      avatar: '/images/supporter3.jpg',
      joinDate: '2023-04-22',
      totalDonation: '۱۲,۰۰۰,۰۰۰',
      animalsSaved: 89,
      volunteerHours: 320,
      specialties: ['تولید محتوا', 'روابط رسانه', 'دیجیتال مارکتینگ', 'عکاسی'],
      achievements: [
        { title: 'بهترین کمپین تبلیغاتی', date: '2024-10-25', icon: 'ti ti-camera' },
        { title: '۱ میلیون بازدید محتوا', date: '2024-01-05', icon: 'ti ti-eye' },
        { title: 'رسانه‌ای برتر', date: '2025-02-10', icon: 'ti ti-microphone' }
      ],
      socialLinks: {
        instagram: '@maryam_petoman',
        twitter: '@maryam_pr'
      }
    }
  ])

  const getSupporterById = (id: number) => {
    return supporters.value.find(s => s.id === id)
  }

  const updateSupporter = (id: number, data: Partial<SupporterData>) => {
    const index = supporters.value.findIndex(s => s.id === id)
    if (index !== -1) {
      supporters.value[index] = { ...supporters.value[index], ...data }
    }
  }

  return {
    supporters,
    getSupporterById,
    updateSupporter
  }
}

export default useSupporters