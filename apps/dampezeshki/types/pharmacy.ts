export interface Pharmacy {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  open24: boolean
  phone: string
  rating?: number
  hasDelivery?: boolean
  hasDiscount?: boolean
}

export interface Medicine {
  id: number
  name: string
  type: string
  price: number
  category?: string
  description?: string
  inStock?: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  pharmacyId?: string
  pharmacyName?: string
  medicine?: Medicine
  pharmacy?: Pharmacy
}