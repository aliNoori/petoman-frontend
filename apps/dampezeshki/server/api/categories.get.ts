/**
 * Categories API
 * دریافت لیست دسته‌بندی‌های سه‌سطحی
 */

import categoriesData from '@/data/categories.json'

export default defineEventHandler(async (event) => {
  try {
    // بازگردانی دسته‌بندی‌ها از فایل JSON
    return categoriesData.categories

  } catch (error) {
    console.error('Failed to fetch categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
