export interface ShopRequest {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    email: string;
    // اضافه کردن وضعیت‌های جدید
    status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
    address: string;
    province: string;
    city: string;
    location: { lat: string; lng: string } | null;
    categories: string[];
    iban: string;
    type: string;
    documents: {};
    createdAt: string;
    rejectionReason?: string;
}