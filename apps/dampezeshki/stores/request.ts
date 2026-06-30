export interface TenantRequest {
    id: string;
    tenantName: string;
    ownerName: string;
    phone: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
    address: string;
    province: string;
    city: string;
    location: { lat: string; lng: string } | null;
    services: string[];
    iban: string;
    type: string;
    documents: {};
    createdAt: string;
    rejectionReason?: string;
}

export interface Tenant{

}
export interface TenantSpecialty {
    id: string;
    code: string;
    label: string;
    isActive: boolean;
}

export interface ClinicService {
    id: string;
    code: string;
    label: string;
    icon:string;
    isActive: boolean;
}