import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')
import bcrypt from 'bcryptjs'

// Use PrismaClient directly
const prisma = new PrismaClient()

// Use PrismaClient directly if the lib import doesn't work
const db = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.medicine.deleteMany()
  await db.message.deleteMany()
  await db.consultation.deleteMany()
  await db.review.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.partnerRequest.deleteMany()
  await prisma.vet.deleteMany()
  await prisma.clinic.deleteMany()
  await prisma.pharmacy.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('123456', 10)

  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@petoman.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      name: 'مدیر سیستم',
      phone: '09121234567',
      city: 'تهران',
      lat: 35.6892,
      lng: 51.3890,
      emailVerified: true
    }
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: hashedPassword,
      role: 'USER',
      name: 'علی احمدی',
      phone: '09121234568',
      city: 'تهران',
      lat: 35.7219,
      lng: 51.3347,
      emailVerified: true,
      wallet: {
        create: {
          balance: 500000
        }
      }
    }
  })

  // Create veterinarians
  const vetUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'vet1@example.com',
        passwordHash: hashedPassword,
        role: 'VET',
        name: 'دکتر محمد رضایی',
        phone: '09121234570',
        city: 'تهران',
        lat: 35.6961,
        lng: 51.4231,
        emailVerified: true,
        vet: {
          create: {
            slug: 'dr-mohammad-rezaei',
            specialties: JSON.stringify(['حیوانات خانگی', 'جراحی', 'پزشکی داخلی']),
            priceOnline: 150000,
            pricePhone: 100000,
            priceHome: 300000,
            hasHomeVisit: true,
            bio: 'دامپزشک با بیش از ۱۰ سال تجربه در زمینه حیوانات خانگی و جراحی دامپزشکی',
            experience: 10,
            rating: 4.8,
            reviewCount: 45,
            city: 'تهران',
            address: 'خیابان ولیعصر، نرسیده به پارک ساعی',
            isVerified: true,
            workingHours: JSON.stringify({
              saturday: '8:00-20:00',
              sunday: '8:00-20:00',
              monday: '8:00-20:00',
              tuesday: '8:00-20:00',
              wednesday: '8:00-20:00',
              thursday: '8:00-14:00',
              friday: 'closed'
            }),
            gallery: JSON.stringify(['/uploads/vet1-1.jpg', '/uploads/vet1-2.jpg'])
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'vet2@example.com',
        passwordHash: hashedPassword,
        role: 'VET',
        name: 'دکتر فاطمه احمدی',
        phone: '09121234571',
        city: 'اصفهان',
        lat: 32.6546,
        lng: 51.6680,
        emailVerified: true,
        vet: {
          create: {
            slug: 'dr-fatemeh-ahmadi',
            specialties: JSON.stringify(['حیوانات خانگی', 'پرندگان', 'پزشکی قانونی']),
            priceOnline: 120000,
            pricePhone: 80000,
            priceHome: 250000,
            hasHomeVisit: true,
            bio: 'متخصص بیماری‌های پرندگان و حیوانات خانگی',
            experience: 8,
            rating: 4.9,
            reviewCount: 32,
            city: 'اصفهان',
            address: 'خیابان چهارباغ عباسی',
            isVerified: true,
            gallery: JSON.stringify(['/uploads/vet2-1.jpg'])
          }
        }
      }
    })
  ])

  // Create clinics
  const clinicUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'clinic1@example.com',
        passwordHash: hashedPassword,
        role: 'CLINIC',
        name: 'کلینیک دامپزشکی پت کر',
        phone: '09121234572',
        city: 'تهران',
        lat: 35.7589,
        lng: 51.4082,
        emailVerified: true,
        clinic: {
          create: {
            slug: 'pet-care-clinic',
            name: 'کلینیک دامپزشکی پت کر',
            bannerUrl: '/uploads/clinic1-banner.jpg',
            services: JSON.stringify(['ویزیت', 'جراحی', 'آزمایشگاه', 'رادیولوژی', 'بستری']),
            description: 'کلینیک مجهز با امکانات کامل جراحی و تشخیصی',
            city: 'تهران',
            address: 'خیابان کریمخان زند، نبش کوچه دهم',
            phone: '02188776655',
            email: 'info@petcare.ir',
            rating: 4.7,
            reviewCount: 78,
            isVerified: true,
            workingHours: JSON.stringify({
              saturday: '8:00-22:00',
              sunday: '8:00-22:00',
              monday: '8:00-22:00',
              tuesday: '8:00-22:00',
              wednesday: '8:00-22:00',
              thursday: '8:00-22:00',
              friday: '8:00-22:00'
            }),
            gallery: JSON.stringify(['/uploads/clinic1-1.jpg', '/uploads/clinic1-2.jpg'])
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'clinic2@example.com',
        passwordHash: hashedPassword,
        role: 'CLINIC',
        name: 'بیمارستان دامپزشکی آریا',
        phone: '09121234573',
        city: 'شیراز',
        lat: 29.5918,
        lng: 52.5837,
        emailVerified: true,
        clinic: {
          create: {
            slug: 'arya-vet-hospital',
            name: 'بیمارستان دامپزشکی آریا',
            services: JSON.stringify(['ویزیت', 'جراحی', 'اورژانس', 'آزمایشگاه', 'سونوگرافی']),
            description: 'بیمارستان دامپزشکی با خدمات ۲۴ ساعته',
            city: 'شیراز',
            address: 'بلوار چمران، جنب پارک ملت',
            phone: '07133445566',
            rating: 4.6,
            reviewCount: 56,
            isVerified: true
          }
        }
      }
    })
  ])

  // Create pharmacies
  const pharmacyUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'pharmacy1@example.com',
        passwordHash: hashedPassword,
        role: 'PHARMACY',
        name: 'داروخانه دامپزشکی سلامت',
        phone: '09121234574',
        city: 'تهران',
        lat: 35.7015,
        lng: 51.4004,
        emailVerified: true,
        pharmacy: {
          create: {
            slug: 'salamat-vet-pharmacy',
            name: 'داروخانه دامپزشکی سلامت',
            city: 'تهران',
            address: 'خیابان انقلاب، بالاتر از چهارراه کالج',
            phone: '02166778899',
            email: 'info@salamat-vet.ir',
            is24h: true,
            hasDelivery: true,
            rating: 4.5,
            reviewCount: 23,
            isVerified: true
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'pharmacy2@example.com',
        passwordHash: hashedPassword,
        role: 'PHARMACY',
        name: 'داروخانه حیوانات مهر',
        phone: '09121234575',
        city: 'مشهد',
        lat: 36.2605,
        lng: 59.6168,
        emailVerified: true,
        pharmacy: {
          create: {
            slug: 'mehr-animal-pharmacy',
            name: 'داروخانه حیوانات مهر',
            city: 'مشهد',
            address: 'خیابان امام رضا، نرسیده به حرم',
            phone: '05133667788',
            hasDelivery: false,
            rating: 4.3,
            reviewCount: 15,
            isVerified: true
          }
        }
      }
    })
  ])

  // Get the first pharmacy for orders
  const firstPharmacy = await prisma.pharmacy.findFirst()

  // Create medicines for tracking
  const medicines = await Promise.all([
    prisma.medicine.upsert({
      where: { id: 'med-test-1' },
      update: {},
      create: {
        id: 'med-test-1',
        name: 'آموکسی‌سیلین 500 میلی‌گرم',
        description: 'آنتی‌بیوتیک گسترده الطیف',
        price: 45000,
        category: 'آنتی‌بیوتیک',
        brand: 'کیمیدارو'
      }
    }),
    prisma.medicine.upsert({
      where: { id: 'med-test-2' },
      update: {},
      create: {
        id: 'med-test-2',
        name: 'ویتامین B12',
        description: 'مکمل ویتامین B12',
        price: 80000,
        category: 'ویتامین',
        brand: 'زهراوی'
      }
    }),
    prisma.medicine.upsert({
      where: { id: 'med-test-3' },
      update: {},
      create: {
        id: 'med-test-3',
        name: 'قرص ضد درد',
        description: 'مسکن و ضد التهاب',
        price: 25000,
        category: 'مسکن',
        brand: 'ابوریحان'
      }
    })
  ])

  // Create test orders for tracking
  const testOrder1 = await prisma.order.upsert({
    where: { trackingCode: 'TRK-001-2025' },
    update: {},
    create: {
      trackingCode: 'TRK-001-2025',
      userId: regularUser.id,
      pharmacyId: firstPharmacy!.id,
      status: 'shipped',
      totalAmount: 150000,
      deliveryAddress: 'تهران، میدان آزادی، خیابان کریم‌خان، پلاک 45',
      deliveryPhone: '09123456789',
      notes: 'لطفاً پس از رسیدن به نزدیکی منزل تماس بگیرید.',
      confirmedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      shippedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    }
  })

  // Create order items for test order 1
  await Promise.all([
    prisma.orderItem.upsert({
      where: { id: 'order-item-1' },
      update: {},
      create: {
        id: 'order-item-1',
        orderId: testOrder1.id,
        medicineId: medicines[0].id,
        quantity: 2,
        price: 45000
      }
    }),
    prisma.orderItem.upsert({
      where: { id: 'order-item-2' },
      update: {},
      create: {
        id: 'order-item-2',
        orderId: testOrder1.id,
        medicineId: medicines[1].id,
        quantity: 1,
        price: 80000
      }
    })
  ])

  // Create delivered order
  const testOrder2 = await prisma.order.upsert({
    where: { trackingCode: 'TRK-002-2025' },
    update: {},
    create: {
      trackingCode: 'TRK-002-2025',
      userId: regularUser.id,
      pharmacyId: firstPharmacy!.id,
      status: 'delivered',
      totalAmount: 25000,
      deliveryAddress: 'تهران، میدان آزادی، خیابان کریم‌خان، پلاک 45',
      deliveryPhone: '09123456789',
      confirmedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      shippedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      deliveredAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    }
  })

  await prisma.orderItem.upsert({
    where: { id: 'order-item-3' },
    update: {},
    create: {
      id: 'order-item-3',
      orderId: testOrder2.id,
      medicineId: medicines[2].id,
      quantity: 1,
      price: 25000
    }
  })

  console.log('✅ Seed completed successfully!')
  console.log(`👤 Admin user: admin@petoman.com / 123456`)
  console.log(`👤 Regular user: user@example.com / 123456`)
  console.log(`👨‍⚕️ Vet 1: vet1@example.com / 123456`)
  console.log(`👨‍⚕️ Vet 2: vet2@example.com / 123456`)
  console.log(`🏥 Clinic 1: clinic1@example.com / 123456`)
  console.log(`🏥 Clinic 2: clinic2@example.com / 123456`)
  console.log(`💊 Pharmacy 1: pharmacy1@example.com / 123456`)
  console.log(`💊 Pharmacy 2: pharmacy2@example.com / 123456`)
  console.log(`📦 Test tracking codes:`)
  console.log(`  - TRK-001-2025 (shipped)`)
  console.log(`  - TRK-002-2025 (delivered)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
