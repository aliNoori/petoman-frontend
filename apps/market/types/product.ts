export interface ProductImage {
    id: number
    url: string
    alt?: string
}

export interface ProductReview {
    id: number
    user: string
    rating: string
    comment: string
    date: string
}

export interface ProductRelation {
    id: string
    name: string
    price: number
    discount: number
    image: string
}

export interface ProductFeature {
    id: number
    text: string
}

export interface ProductSpecification {
    label: string
    value: string
}

export interface ProductVariant {
    id: number
    name: string
    price: number
    originalPrice?: number
    stock?: number,
    image?: string,
    isActive: boolean
    productId: string
    attributes: {}
}

export interface ProductSeller {
    id: number
    name: string
    rating: number
    productCount: number
}

export interface ProductBrand {
    id: number
    name: string
    slug: string
}

export interface Product {
    id: string
    name: string
    shopId: number
    shop: string

    categoryId: number
    price: number
    originalPrice?: number | null
    discount?: number | null
    discountType:string
    available: boolean

    rating: number

    isFavorite: boolean

    // Relations
    brand: ProductBrand

    category: {
        id: number
        name: string
        slug: string
    }

    reviewCount: number
    reviews: ProductReview[]
    soldCount: number

    description: string

    features: ProductFeature[]
    specifications: ProductSpecification[]
    image: string
    images: ProductImage[]

    variantLabel?: string
    variants?: ProductVariant[]

    seller: ProductSeller

    relatedProducts: ProductRelation[]
}