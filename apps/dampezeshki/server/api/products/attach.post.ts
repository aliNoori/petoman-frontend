/**
 * Product Attach API
 * اتصال فروشنده به محصول موجود
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    productId,
    sellerId,
    price,
    stock,
    description,
    isActive
  } = body

  // Validation
  if (!productId || !sellerId || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID, Seller ID and Price are required'
    })
  }

  try {
    // TODO: Replace with real database operation
    // const sellerProduct = await prisma.sellerProduct.create({
    //   data: {
    //     productId,
    //     sellerId,
    //     price,
    //     stock: stock || 0,
    //     description,
    //     isActive: isActive ?? true,
    //     createdAt: new Date()
    //   },
    //   include: {
    //     product: true,
    //     seller: true
    //   }
    // })

    // Mock response
    const mockResponse = {
      id: Math.floor(Math.random() * 10000),
      productId,
      sellerId,
      price,
      stock: stock || 0,
      description,
      isActive: isActive ?? true,
      createdAt: new Date(),
      product: {
        id: productId,
        name: 'Mock Product Name',
        code: 'MOCK-CODE'
      }
    }

    return {
      success: true,
      message: 'Seller attached to product successfully',
      data: mockResponse
    }

  } catch (error) {
    console.error('Attach failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to attach seller to product'
    })
  }
})
