// src/types/category.ts

export interface Tenant {
    id: string;
    name: string;
    type: string;
    ownerName: string;
    phone: string;
    logo?: string;
    rating: string;
    isOpen: boolean;
    freeDelivery: boolean;
    fastDelivery: boolean;
}

export interface ProductDetails {
    id: string;
    name: string;
    description: string;
    image: string;
    galleryImages: string[];
    brand: string | null;
    code: string;
    categoryBreadcrumb: string;
    type: string;
}

export interface Product {
    id: string;
    shopId:string;
    shopName:string;
    tenantId: string;
    price: number;
    discountedPrice: number;
    discountValue: number;
    discountType: string;
    hasDiscount: boolean;
    stock: number;
    isActive: boolean;
    isFavorite:boolean;
    averageRating: string;
    reviewsCount: number;
    expiryDate: string | null;
    status: string;
    details: ProductDetails | null;
    tenant: Tenant | null;
}

export interface ProductTenantCategory {
    id: string;
    productId: string;
    categoryId: string;
    product: Product;
}

export interface TenantCategoryChildren {
    id: string;
    name: string;
    productCount: number;
}

export interface Category {
    id: string;
    tenantId: string;
    title: string;
    slug: string;
    icon: string;
    bgColor: string;
    iconColor: string;
    parentId: string | null;
    isActive: boolean;
    count: number;
    createdAt: string;
    updatedAt: string;
    children:TenantCategoryChildren[]
    productTenantCategories: ProductTenantCategory[];
}