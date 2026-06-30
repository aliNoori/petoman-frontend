/**
 * Product Search API
 * جستجوی محصولات موجود در سیستم
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string
  const categoryId = query.categoryId as string | null

  console.log('🔍 Search API Called:', { searchQuery, categoryId })

  if (!searchQuery || searchQuery.length < 3) {
    console.log('❌ Search query too short or missing')
    return []
  }

  try {
    // TODO: Replace with real database query
    // const products = await prisma.product.findMany({
    //   where: {
    //     name: {
    //       contains: searchQuery,
    //       mode: 'insensitive'
    //     },
    //     ...(categoryId && { categoryId })
    //   },
    //   include: {
    //     sellers: true,
    //     _count: {
    //       select: { sellers: true }
    //     }
    //   }
    // })

    // Mock data for testing
    const mockProducts = [
      {
        id: 1,
        name: 'کنسرو گورمت مدل گربه طعم گوشت گاو بسته 24 عددی',
        code: 'FC-C-GM-123456',
        category: 'پت شاپ > غذا > غذای گربه > کنسرو',
        categoryId: 'cat-canned',
        mainImage: 'https://picsum.photos/seed/gourmet-beef/400/400',
        gallery: [
          'https://picsum.photos/seed/gourmet-beef-1/400/400',
          'https://picsum.photos/seed/gourmet-beef-2/400/400',
          'https://picsum.photos/seed/gourmet-beef-3/400/400'
        ],
        sellerCount: 3,
        suggestedPrice: 850000,
        avgPrice: 820000,
        description: 'کنسرو گورمت با طعم گوشت گاو، حاوی پروتئین بالا و مواد مغذی مورد نیاز گربه‌های بالغ. بدون مواد نگهدارنده و رنگ مصنوعی.',
        specifications: {
          brand: 'Gourmet',
          weight: '85g × 24',
          origin: 'فرانسه',
          ingredients: 'گوشت گاو 45%, آب, ویتامین‌ها, مواد معدنی',
          protein: '12%',
          fat: '4%',
          moisture: '80%'
        },
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'کنسرو گورمت گربه طعم ماهی 85 گرم',
        code: 'FC-C-GM-789012',
        category: 'پت شاپ > غذا > غذای گربه > کنسرو',
        categoryId: 'cat-canned',
        mainImage: 'https://picsum.photos/seed/gourmet-fish/400/400',
        gallery: [
          'https://picsum.photos/seed/gourmet-fish-1/400/400',
          'https://picsum.photos/seed/gourmet-fish-2/400/400'
        ],
        sellerCount: 5,
        suggestedPrice: 45000,
        avgPrice: 42000,
        description: 'کنسرو گورمت با طعم ماهی، غنی از امگا 3 برای پوست و موی گربه. مناسب همه نژادها و سنین.',
        specifications: {
          brand: 'Gourmet',
          weight: '85g',
          origin: 'فرانسه',
          ingredients: 'ماهی تن 40%, آب, ژله, ویتامین‌ها',
          protein: '11%',
          fat: '3.5%',
          omega3: '0.5%'
        },
        createdAt: new Date()
      },
      {
        id: 3,
        name: 'غذای خشک رویال کنین مدل گربه بالغ 2 کیلوگرم',
        code: 'FD-C-RC-456789',
        category: 'پت شاپ > غذا > غذای گربه > غذای خشک',
        categoryId: 'cat-dry',
        mainImage: 'https://picsum.photos/seed/royal-cat/400/400',
        gallery: [
          'https://picsum.photos/seed/royal-cat-1/400/400',
          'https://picsum.photos/seed/royal-cat-2/400/400',
          'https://picsum.photos/seed/royal-cat-3/400/400',
          'https://picsum.photos/seed/royal-cat-4/400/400'
        ],
        sellerCount: 8,
        suggestedPrice: 1250000,
        avgPrice: 1200000,
        description: 'غذای خشک رویال کنین برای گربه‌های بالغ 1 تا 7 سال. فرمول ویژه برای حفظ سلامت دستگاه ادراری و کنترل وزن.',
        specifications: {
          brand: 'Royal Canin',
          weight: '2kg',
          origin: 'فرانسه',
          ageRange: '1-7 سال',
          ingredients: 'گوشت مرغ, برنج, ذرت, چربی حیوانی',
          protein: '32%',
          fat: '15%',
          fiber: '3%'
        },
        createdAt: new Date()
      },
      {
        id: 4,
        name: 'غذای خشک سگ رویال کنین بالغ نژاد بزرگ 15 کیلوگرم',
        code: 'FD-D-RC-111222',
        category: 'پت شاپ > غذا > غذای سگ > غذای خشک',
        categoryId: 'dog-dry',
        mainImage: 'https://picsum.photos/seed/royal-dog/400/400',
        gallery: [
          'https://picsum.photos/seed/royal-dog-1/400/400',
          'https://picsum.photos/seed/royal-dog-2/400/400'
        ],
        sellerCount: 4,
        suggestedPrice: 3500000,
        avgPrice: 3400000,
        description: 'غذای خشک رویال کنین مخصوص سگ‌های بالغ نژاد بزرگ. حاوی گلوکزامین و کندرویتین برای حفظ سلامت مفاصل.',
        specifications: {
          brand: 'Royal Canin',
          weight: '15kg',
          origin: 'فرانسه',
          breedSize: 'Large (26-44 kg)',
          ageRange: '15 ماه - 5 سال',
          protein: '26%',
          fat: '17%',
          calcium: '1.2%'
        },
        createdAt: new Date()
      },
      {
        id: 5,
        name: 'آنتی بیوتیک آموکسی سیلین تزریقی 100ml',
        code: 'MED-AB-AMOX-100',
        category: 'دامپزشکی > داروها > آنتی‌بیوتیک',
        categoryId: 'antibiotics',
        mainImage: 'https://picsum.photos/seed/amoxicillin/400/400',
        gallery: [
          'https://picsum.photos/seed/amoxicillin-1/400/400'
        ],
        sellerCount: 2,
        suggestedPrice: 450000,
        avgPrice: 430000,
        description: 'آنتی بیوتیک طیف گسترده آموکسی سیلین. موثر در درمان عفونت‌های باکتریایی دستگاه تنفسی، ادراری و پوستی.',
        specifications: {
          activeIngredient: 'Amoxicillin 150mg/ml',
          volume: '100ml',
          usage: 'تزریق عضلانی یا زیرجلدی',
          dosage: '10-15 mg/kg وزن بدن',
          prescriptionRequired: true,
          storage: 'در دمای 2-8 درجه'
        },
        createdAt: new Date()
      },
      {
        id: 6,
        name: 'خاک گربه بنتونیت معطر 10 کیلوگرم',
        code: 'HYG-CAT-LITTER-10',
        category: 'پت شاپ > بهداشت > بهداشت گربه > خاک گربه',
        categoryId: 'cat-litter',
        mainImage: 'https://picsum.photos/seed/cat-litter/400/400',
        gallery: [
          'https://picsum.photos/seed/cat-litter-1/400/400',
          'https://picsum.photos/seed/cat-litter-2/400/400'
        ],
        sellerCount: 6,
        suggestedPrice: 185000,
        avgPrice: 180000,
        description: 'خاک گربه بنتونیت با عطر لاوندر. قدرت جذب بالا، کنترل بو، بدون گرد و خاک. قابل شستشو در توالت.',
        specifications: {
          type: 'بنتونیت طبیعی',
          weight: '10kg',
          scent: 'لاوندر',
          clumping: 'بله',
          dustFree: 'کم گرد و خاک',
          flushable: 'قابل شستشو',
          duration: '30-40 روز (برای 1 گربه)'
        },
        createdAt: new Date()
      },
      {
        id: 7,
        name: 'اسباب بازی توپ پارچه‌ای سگ سایز متوسط',
        code: 'TOY-DOG-BALL-M',
        category: 'پت شاپ > اسباب‌بازی > اسباب‌بازی سگ > توپ',
        categoryId: 'dog-ball',
        mainImage: 'https://picsum.photos/seed/dog-ball/400/400',
        gallery: [
          'https://picsum.photos/seed/dog-ball-1/400/400',
          'https://picsum.photos/seed/dog-ball-2/400/400'
        ],
        sellerCount: 4,
        suggestedPrice: 45000,
        avgPrice: 42000,
        description: 'توپ پارچه‌ای مخصوص بازی سگ. ضد جویدن، قابل شستشو، رنگ‌های شاد. مناسب برای بازی در خانه و فضای باز.',
        specifications: {
          material: 'پارچه مقاوم + پلی استر',
          size: 'متوسط (10cm قطر)',
          washable: 'قابل شستشو',
          colors: 'آبی، قرمز، سبز، زرد',
          suitable: 'سگ‌های 5-15 کیلوگرم',
          features: 'ضد جویدن، سبک وزن'
        },
        createdAt: new Date()
      }
    ]

    // Filter by search query and category
    let results = mockProducts.filter(product =>
      product.name.includes(searchQuery) ||
      product.code.includes(searchQuery)
    )

    // Filter by category if provided
    if (categoryId) {
      results = results.filter(product => product.categoryId === categoryId)
    }

    console.log('✅ Search Results:', results.length, 'products found')
    return results

  } catch (error) {
    console.error('Search failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search products'
    })
  }
})
