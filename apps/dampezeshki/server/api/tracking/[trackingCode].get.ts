import { defineEventHandler, getRouterParam, createError } from 'h3'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')
import moment from 'moment-jalaali'

// ایجاد instance از Prisma
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const trackingCode = getRouterParam(event, 'trackingCode')
    
    if (!trackingCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'کد پیگیری الزامی است'
      })
    }

    // جستجوی سفارش با کد پیگیری
    const order = await prisma.order.findFirst({
      where: {
        trackingCode: trackingCode
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            medicine: {
              select: {
                name: true,
                price: true,
                image: true
              }
            }
          }
        },
        pharmacy: {
          select: {
            name: true,
            address: true,
            phone: true,
            city: true
          }
        }
      }
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'سفارش با این کد پیگیری یافت نشد'
      })
    }

    // محاسبه تعداد کل محصولات
    const itemsCount = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)

    // تبدیل تاریخ به شمسی
    const persianDate = moment(order.createdAt).format('jYYYY/jMM/jDD')
    const persianTime = moment(order.createdAt).format('HH:mm')

    // ایجاد timeline برای نمایش مراحل سفارش
    const timeline = []
    
    // مرحله ثبت سفارش
    timeline.push({
      id: 1,
      title: 'ثبت سفارش',
      description: 'سفارش شما با موفقیت ثبت شد',
      date: persianDate,
      time: persianTime,
      status: 'completed',
      icon: 'shopping-cart'
    })

    // مرحله تأیید سفارش
    if (order.status !== 'pending') {
      const confirmDate = order.confirmedAt ? 
        moment(order.confirmedAt).format('jYYYY/jMM/jDD') : 
        persianDate
      const confirmTime = order.confirmedAt ? 
        moment(order.confirmedAt).format('HH:mm') : 
        persianTime
        
      timeline.push({
        id: 2,
        title: 'تأیید سفارش',
        description: 'سفارش شما توسط داروخانه تأیید شد',
        date: confirmDate,
        time: confirmTime,
        status: 'completed',
        icon: 'check-circle'
      })
    }

    // مرحله آماده‌سازی
    if (['preparing', 'ready', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        id: 3,
        title: 'آماده‌سازی',
        description: 'سفارش شما در حال آماده‌سازی است',
        date: persianDate,
        time: persianTime,
        status: order.status === 'preparing' ? 'in-progress' : 'completed',
        icon: 'package'
      })
    }

    // مرحله آماده برای ارسال
    if (['ready', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        id: 4,
        title: 'آماده ارسال',
        description: 'سفارش شما آماده تحویل به پیک است',
        date: persianDate,
        time: persianTime,
        status: order.status === 'ready' ? 'in-progress' : 'completed',
        icon: 'truck'
      })
    }

    // مرحله ارسال
    if (['shipped', 'delivered'].includes(order.status)) {
      const shippedDate = order.shippedAt ? 
        moment(order.shippedAt).format('jYYYY/jMM/jDD') : 
        persianDate
      const shippedTime = order.shippedAt ? 
        moment(order.shippedAt).format('HH:mm') : 
        persianTime
        
      timeline.push({
        id: 5,
        title: 'در حال ارسال',
        description: 'سفارش شما تحویل پیک شده و در مسیر تحویل است',
        date: shippedDate,
        time: shippedTime,
        status: order.status === 'shipped' ? 'in-progress' : 'completed',
        icon: 'car'
      })
    }

    // مرحله تحویل
    if (order.status === 'delivered') {
      const deliveredDate = order.deliveredAt ? 
        moment(order.deliveredAt).format('jYYYY/jMM/jDD') : 
        persianDate
      const deliveredTime = order.deliveredAt ? 
        moment(order.deliveredAt).format('HH:mm') : 
        persianTime
        
      timeline.push({
        id: 6,
        title: 'تحویل داده شد',
        description: 'سفارش شما با موفقیت تحویل داده شد',
        date: deliveredDate,
        time: deliveredTime,
        status: 'completed',
        icon: 'check'
      })
    }

    // آماده‌سازی پاسخ نهایی
    const response = {
      id: order.id,
      trackingCode: order.trackingCode,
      status: order.status,
      statusText: getStatusText(order.status),
      totalAmount: order.totalAmount,
      itemsCount,
      persianDate,
      persianTime,
      city: order.pharmacy?.city || 'نامشخص',
      user: order.user,
      pharmacy: order.pharmacy,
      items: order.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        medicine: item.medicine
      })),
      timeline,
      deliveryAddress: order.deliveryAddress,
      deliveryPhone: order.deliveryPhone,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }

    return response

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching order:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'خطا در دریافت اطلاعات سفارش'
    })
  }
})

function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    'pending': 'در انتظار تأیید',
    'confirmed': 'تأیید شده',
    'preparing': 'در حال آماده‌سازی',
    'ready': 'آماده ارسال',
    'shipped': 'ارسال شده',
    'delivered': 'تحویل داده شد',
    'cancelled': 'لغو شده',
    'returned': 'مرجوعی'
  }
  
  return statusTexts[status] || status
}