/**
 * Product Create API
 * ایجاد محصول جدید در سیستم
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    name,
    code,
    category,
    categoryBreadcrumb,
    price,
    stock,
    description,
    isActive,
    type,
    mainImage,
    gallery
  } = body

  // Validation
  if (!name || !code || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, Code and Price are required'
    })
  }

  try {
    // TODO: Replace with real database operation
    // 1. Check if product code already exists
    // const existingProduct = await prisma.product.findUnique({
    //   where: { code }
    // })
    // 
    // if (existingProduct) {
    //   throw createError({
    //     statusCode: 409,
    //     statusMessage: 'Product code already exists'
    //   })
    // }

    // 2. Create the product
    // const product = await prisma.product.create({
    //   data: {
    //     name,
    //     code,
    //     category,
    //     categoryBreadcrumb,
    //     description,
    //     type,
    //     mainImage, // Handle file upload separately
    //     gallery, // Handle file upload separately
    //     createdAt: new Date()
    //   }
    // })

    // 3. Create seller product relation (first seller)
    // const sellerProduct = await prisma.sellerProduct.create({
    //   data: {
    //     productId: product.id,
    //     sellerId: getCurrentUser().id, // Get from session
    //     price,
    //     stock: stock || 0,
    //     isActive: isActive ?? true,
    //     createdAt: new Date()
    //   }
    // })

    // Mock response
    const mockResponse = {
      product: {
        id: Math.floor(Math.random() * 10000),
        name,
        code,
        category,
        categoryBreadcrumb,
        description,
        type,
        mainImage,
        gallery,
        createdAt: new Date()
      },
      sellerProduct: {
        id: Math.floor(Math.random() * 10000),
        price,
        stock: stock || 0,
        isActive: isActive ?? true,
        createdAt: new Date()
      }
    }

    return {
      success: true,
      message: 'Product created successfully',
      data: mockResponse
    }

  } catch (error) {
    console.error('Create failed:', error)
    
    if (error.statusCode === 409) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})
