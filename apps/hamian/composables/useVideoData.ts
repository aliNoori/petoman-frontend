import {useDocumentaryStore} from "~/stores/documentary";
import {useCategoryTypeStore} from "~/stores/category-type.ts";

export interface VideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  publishDate: string
  category: string
  views: number
  tags: string[]
  story?: string
}

export interface CategoryData {
  id: string
  name: string
  icon: string
  description: string
  count: number
}

export const useVideoData = () => {
  const documentaryStore=useDocumentaryStore();
  const categoryTypeStore=useCategoryTypeStore()
  const documentTypeId = categoryTypeStore.idBySlug('document')
  const categoryStore=useCategoryStore()
  const categories=computed(()=>
      categoryStore.getCategories(String(documentTypeId)).map((item:any)=>{
        const id=item.slug
        const name=item.name
        const icon=item.icon
        const description=item.description
        const count=item.count

        return{
          id,
          name,
          icon,
          description,
          count
        }

  }));
  /*const categories: CategoryData[] = [
    {
      id: 'all',
      name: 'همه',
      icon: 'ti ti-list',
      description: 'تمام مستندات نجات و مراقبت از حیوانات',
      count: 0
    },
    {
      id: 'rescue',
      name: 'نجات اضطراری',
      icon: 'ti ti-heart-handshake',
      description: 'عملیات‌های نجات فوری حیوانات در شرایط اضطراری',
      count: 0
    },
    {
      id: 'treatment',
      name: 'درمان و توانبخشی',
      icon: 'ti ti-medical-cross',
      description: 'فرآیند درمان، جراحی و توانبخشی حیوانات مجروح',
      count: 0
    },
    {
      id: 'success',
      name: 'داستان‌های موفقیت',
      icon: 'ti ti-trophy',
      description: 'داستان‌های الهام‌بخش از بهبودی و موفقیت حیوانات',
      count: 0
    },
    {
      id: 'shelter',
      name: 'پناهگاه و نگهداری',
      icon: 'ti ti-home-heart',
      description: 'امکانات، فعالیت‌ها و زندگی روزانه در پناهگاه',
      count: 0
    },
    {
      id: 'training',
      name: 'آموزش و آگاهی',
      icon: 'ti ti-school',
      description: 'آموزش‌های عمومی و افزایش آگاهی درباره حیوانات',
      count: 0
    }
  ]*/

  const videos=computed(()=>documentaryStore.documentaries.map((item:any)=>{
        const id=item.id
        const title=item.title
        const description=item.description
        const thumbnail=item.thumbnailPreview
        const videoUrl=item.videoFile
        const duration=item.duration
        const publishDate=item.publishDate
        const category=item.category
        const views=item.views
        const tags=item.tags
        const story=item.story

        return{
          id,
          title,
          description,
          thumbnail,
          videoUrl,
          duration,
          publishDate,
          category,
          views,
          tags,
          story

        }
      }))
  /*const videos: VideoData[] = [
    {
      id: '1',
      title: 'نجات شگفت‌انگیز توله سگ از زیر آوار',
      description: 'داستان نجات توله سگی که زیر آوار گیر کرده بود و چگونه تیم ما موفق به نجات جان او شد. این ویدیو شامل تمام مراحل نجات از کشف تا انتقال به پناهگاه است و نشان می‌دهد که هیچ وقت نباید امید را از دست داد.',
      thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '8:45',
      publishDate: '2024-01-20',
      category: 'rescue',
      views: 15430,
      tags: ['نجات اضطراری', 'توله سگ', 'آوار', 'امداد'],
      story: 'این توله سگ کوچک در جریان زلزله زیر آوار خانه‌ای گیر کرده بود. صاحبخانه متوجه صدای ناله‌اش شده و بلافاصله با تیم نجات تماس گرفته بود. عملیات نجات ۶ ساعت طول کشید و نیاز به تجهیزات خاص داشت.'
    },
    {
      id: '2',
      title: 'درمان و بهبودی گربه مجروح',
      description: 'فرآیند کامل درمان گربه‌ای که در تصادف مجروح شده بود و بازگشت او به زندگی عادی. مشاهده تمام مراحل درمان، جراحی، مراقبت‌های پس از عمل و فیزیوتراپی تا بهبودی کامل.',
      thumbnail: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '12:20',
      publishDate: '2024-01-18',
      category: 'treatment-1',
      views: 8920,
      tags: ['درمان', 'جراحی', 'گربه', 'تصادف'],
      story: 'این گربه در تصادف با خودرو دچار شکستگی شدید در پای عقب شده بود. با مراجعه فوری به کلینیک و انجام عمل جراحی پیچیده، توانستیم پای او را نجات دهیم.'
    },
    {
      id: '3',
      title: 'اولین قدم‌های توله سگ معلول',
      description: 'لحظات احساسی اولین قدم‌های توله سگی که توانایی راه رفتن را از دست داده بود و با کمک تیم درمانی و ابزار کمکی دوباره توانست راه برود. داستانی الهام‌بخش از اراده و مقاومت.',
      thumbnail: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '6:15',
      publishDate: '2024-01-16',
      category: 'success',
      views: 25150,
      tags: ['موفقیت', 'معلولیت', 'الهام', 'توانبخشی'],
      story: 'این توله سگ بر اثر بیماری نادری توانایی راه رفتن را از دست داده بود. تیم توانبخشی با طراحی ابزار کمکی خاص و ماه‌ها فیزیوتراپی، معجزه را رقم زد.'
    },
    {
      id: '4',
      title: 'برنامه واکسیناسیون گروهی حیوانات',
      description: 'اجرای برنامه واکسیناسیون رایگان برای حیوانات خیابانی در مناطق مختلف شهر با همکاری دامپزشکان داوطلب و شهرداری. این برنامه هر ماه در مناطق مختلف اجرا می‌شود.',
      thumbnail: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '9:30',
      publishDate: '2024-01-10',
      category: 'treatment-1',
      views: 6780,
      tags: ['واکسیناسیون', 'پیشگیری', 'خیابانی', 'رایگان'],
      story: 'برنامه واکسیناسیون رایگان ما در همکاری با شهرداری و دامپزشکان داوطلب هر ماه در مناطق مختلف شهر اجرا می‌شود و تاکنون بیش از ۵۰۰ حیوان از آن بهره‌مند شده‌اند.'
    },
    {
      id: '5',
      title: 'احداث پناهگاه مدرن حیوانات',
      description: 'مراحل طراحی، ساخت و راه‌اندازی پناهگاه جدید با امکانات پیشرفته شامل بخش‌های قرنطینه، درمان، بازی و فضاهای اختصاصی برای انواع مختلف حیوانات.',
      thumbnail: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '15:45',
      publishDate: '2024-01-12',
      category: 'shelter-1',
      views: 12340,
      tags: ['پناهگاه', 'ساخت', 'امکانات', 'مدرن'],
      story: 'احداث این پناهگاه مدرن با ظرفیت ۲۰۰ حیوان و امکانات کامل درمانی، بازی و نگهداری یکی از بزرگترین پروژه‌های ما بود که ۸ ماه طول کشید.'
    },
    {
      id: '6',
      title: 'آموزش نگهداری صحیح از حیوانات خانگی',
      description: 'راهنمای کاملی برای نگهداری صحیح از حیوانات خانگی شامل تغذیه مناسب، بهداشت، ورزش و مراقبت‌های دوره‌ای. این ویدیو برای تمامی صاحبان حیوانات خانگی مفید است.',
      thumbnail: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '18:20',
      publishDate: '2024-01-08',
      category: 'training',
      views: 22340,
      tags: ['آموزش', 'نگهداری', 'تغذیه', 'بهداشت'],
      story: 'این ویدیو آموزشی شامل تمامی نکات ضروری برای نگهداری صحیح از حیوانات خانگی است که توسط متخصصان دامپزشکی و رفتارشناسان حیوانات تهیه شده است.'
    },
    {
      id: '7',
      title: 'نجات دسته‌جمعی حیوانات از سیل',
      description: 'عملیات بزرگ نجات حیوانات در زمان سیلاب و انتقال آن‌ها به مکان‌های امن. همکاری تیم‌های مختلف امداد و نقش مردم در این عملیات حساس و فوری.',
      thumbnail: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '14:10',
      publishDate: '2024-01-05',
      category: 'rescue',
      views: 18560,
      tags: ['سیل', 'امداد', 'گروهی', 'اضطراری'],
      story: 'در جریان سیل بزرگ سال گذشته، تیم ما با همکاری نیروهای امدادی موفق به نجات بیش از ۸۰ حیوان از مناطق سیل‌زده شد.'
    },
    {
      id: '8',
      title: 'بازگشت گربه وحشی به طبیعت',
      description: 'داستان بهبودی گربه وحشی پس از درمان و آمادگی برای بازگشت به زیستگاه طبیعی‌اش. فرآیند کامل توانبخشی و تطبیق مجدد با محیط طبیعی.',
      thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '10:35',
      publishDate: '2024-01-03',
      category: 'success-1',
      views: 11280,
      tags: ['وحشی', 'طبیعت', 'آزادسازی', 'موفقیت'],
      story: 'این گربه وحشی پس از درمان کامل و دوره نقاهت، آماده بازگشت به زیستگاه طبیعی‌اش شد. فرآیند آزادسازی با نظارت کامل انجام شد.'
    },
    {
      id: '9',
      title: 'کارگاه آموزش کمک‌های اولیه حیوانات',
      description: 'برگزاری کارگاه آموزشی کمک‌های اولیه برای حیوانات، آموزش تکنیک‌های ضروری که هر فرد باید بداند تا در مواقع اضطراری بتواند به حیوانات کمک کند.',
      thumbnail: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '22:45',
      publishDate: '2024-01-01',
      category: 'training',
      views: 16890,
      tags: ['آموزش', 'کمک اولیه', 'کارگاه', 'مهارت'],
      story: 'این کارگاه آموزشی توسط دامپزشکان مجرب برگزار شد و بیش از ۱۰۰ نفر در آن شرکت کردند. مهارت‌های آموخته شده در این کارگاه می‌تواند جان حیوانات را نجات دهد.'
    }
  ]*/

  const getCategoriesWithCount = () => {
    return categories.value.map(category => {
      if (category.id === 'all') {
        return { ...category, count: videos.value.length }
      }
      const count = videos.value.filter(video => video.category.slug === category.id).length
      return { ...category, count }
    })
  }

  const getVideosByCategory = (categoryId: string) => {

    if (categoryId === 'all') {

      return videos.value
    }
    return videos.value.filter(video => video.category.slug === categoryId)
  }

  const getVideoById = (id: string) => {
    return videos.value.find(video => video.id === id)
  }

  const getRelatedVideos = (videoId: string, limit: number = 3) => {
    const currentVideo = getVideoById(videoId)
    if (!currentVideo) return []
    
    return videos.value
      .filter(v => v.id !== videoId && v.category === currentVideo.category)
      .slice(0, limit)
  }

  const getCategoryById = (id: string) => {
    return categories.value.find(category => category.id === id)
  }

  const searchVideos = (query: string) => {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) return videos.value

    return videos.value.filter(video =>
      video.title.toLowerCase().includes(searchTerm) ||
      video.description.toLowerCase().includes(searchTerm) ||
      video.tags.some((tag:any) => tag.toLowerCase().includes(searchTerm))
    )
  }

  return {
    categories,
    videos,
    getCategoriesWithCount,
    getVideosByCategory,
    getVideoById,
    getRelatedVideos,
    getCategoryById,
    searchVideos
  }
}
