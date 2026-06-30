export interface ShopProduct {
    id: number
    name: string
    image:string
    categoryBreadcrumb:string
    category: string
    categoryId: number
    price: number
    originalPrice: number
    discount: number
    rating: number
    reviews: number
    isFavorite: boolean
}

export interface ShopReview {
    id: number
    userName: string
    rating: number
    date: string
    comment: string
    reply: string | null
}

export interface Shop extends MarketSettingsApiResponse{
    id: number
    name: string
    slug: string
    description: string
    address: string
    cityName: string
    location:{lat:string,lng:string}

    rating: number
    reviewsCount: number

    isOpen: boolean
    verified: boolean
    freeDelivery: boolean
    fastDelivery: boolean

    avatarBg?: string

    // Detail only
    products: ShopProduct[]
    reviews: ShopReview[]
}

// ────────────── Types & Interfaces ──────────────
export interface ShippingConfig {
    inPerson: boolean;
    inPersonDeliveryTime: string;
    inPersonPrice:string|number;
    petomanCourier: boolean;
    petomanCourierDeliveryTime: string;
    petomanCourierPrice: string|number;
    shopCourier: boolean;
    shopCourierDeliveryTime: string;
    shopCourierPrice: string | number;
    tipax: boolean;
    tipaxDeliveryTime: string;
    tipaxPrice:string|number
    post: boolean;
    postDeliveryTime: string;
    postPrice:string|number
}

export interface ShopInfo {
    logo: string;
    name: string;
    description: string;
    licenseNumber: string;
    medicalSystemCode: string;
    ownerNationalId: string;
    ownerName: string;
    phone: string;
    mobile: string;
    email: string;
    website: string;
    province: string;
    city: string;
    postalCode: string;
    address: string;
    is24Hours: boolean;
    openTime: string;
    closeTime: string;
    closedDays: string[];
    isApproved: boolean;
    pendingChanges: boolean;
}

export interface MarketSettingsApiResponse {
    shopInfo?: ShopInfo;
    shipping_methods?: { methods: ShippingMethodDto[] };
}

export interface ShippingMethodDto {
    type: string;
    isActive: boolean;
    deliveryTime?: string;
    price?: number;
}