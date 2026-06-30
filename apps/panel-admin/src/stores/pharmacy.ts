import { defineStore } from 'pinia'

interface Pharmacy {
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
  distanceKm?: number
}

interface Medicine {
  id: number
  name: string
  type: string
  category: string
  price: number
  description?: string
  inStock?: boolean
  pharmacyId?: number
}

interface CartItem {
  id: number
  medicine: Medicine
  quantity: number
  pharmacy: Pharmacy
}

interface PharmacyState {
  pharmacies: Pharmacy[]
  medicines: Medicine[]
  cart: CartItem[]
  favorites: number[]
  loading: boolean
  userLocation: { lat: number; lng: number } | null
  selectedCity: string
  filters: {
    only24: boolean
    hasDelivery: boolean
    hasDiscount: boolean
    category: string | null
  }
  searchQuery: string
  sortBy: string
}

export const usePharmacyStore = defineStore('pharmacy', {
  state: (): PharmacyState => ({
    pharmacies: [],
    medicines: [],
    cart: [],
    favorites: [],
    loading: false,
    userLocation: null,
    selectedCity: 'تهران',
    filters: {
      only24: false,
      hasDelivery: false,
      hasDiscount: false,
      category: null
    },
    searchQuery: '',
    sortBy: 'relevance'
  }),

  getters: {
    filteredPharmacies: (state) => {
      let result = [...state.pharmacies]

      // Apply search filter
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.phone.includes(query)
        )
      }

      // Apply filters
      if (state.filters.only24) {
        result = result.filter(p => p.open24)
      }
      if (state.filters.hasDelivery) {
        result = result.filter(p => p.hasDelivery)
      }
      if (state.filters.hasDiscount) {
        result = result.filter(p => p.hasDiscount)
      }

      // Apply sorting
      switch (state.sortBy) {
        case 'distance':
          result.sort((a, b) => {
            if (a.distanceKm == null && b.distanceKm == null) return 0
            if (a.distanceKm == null) return 1
            if (b.distanceKm == null) return -1
            return a.distanceKm - b.distanceKm
          })
          break
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name, 'fa'))
          break
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'open24':
          result.sort((a, b) => Number(b.open24) - Number(a.open24))
          break
        default: // relevance
          result.sort((a, b) => {
            const aScore = (a.open24 ? 1 : 0) + (a.distanceKm != null ? 1 : 0) + (a.rating || 0) * 0.1
            const bScore = (b.open24 ? 1 : 0) + (b.distanceKm != null ? 1 : 0) + (b.rating || 0) * 0.1
            return bScore - aScore
          })
      }

      return result
    },

    nearbyPharmacies: (state) => {
      if (!state.userLocation) return []
      
      return state.pharmacies
        .filter(p => p.distanceKm != null && p.distanceKm <= 5)
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    },

    cartItemsCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },

    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0)
    },

    cartPharmacies: (state) => {
      const pharmacyMap = new Map()
      state.cart.forEach(item => {
        if (!pharmacyMap.has(item.pharmacy.id)) {
          pharmacyMap.set(item.pharmacy.id, {
            pharmacy: item.pharmacy,
            items: [],
            total: 0
          })
        }
        const pharmacyData = pharmacyMap.get(item.pharmacy.id)
        pharmacyData.items.push(item)
        pharmacyData.total += item.medicine.price * item.quantity
      })
      return Array.from(pharmacyMap.values())
    },

    favoritePharmacies: (state) => {
      return state.pharmacies.filter(p => state.favorites.includes(p.id))
    }
  },

  actions: {
    async fetchPharmacies() {
      this.loading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        this.pharmacies = [
          { id: 1, name: 'داروخانه دکتر نیکنام', address: 'خیابان ولیعصر، پلاک ۱۲۳', lat: 35.7075, lng: 51.4010, open24: false, phone: '021-12345678', rating: 4.5, hasDelivery: true, hasDiscount: false },
          { id: 2, name: 'داروخانه شبانه‌روزی سروش', address: 'میدان ونک، کوچه ۵', lat: 35.7561, lng: 51.4090, open24: true, phone: '021-22223333', rating: 4.8, hasDelivery: true, hasDiscount: true },
          { id: 3, name: 'داروخانه آریا', address: 'خیابان انقلاب، نبش بهار', lat: 35.7005, lng: 51.4105, open24: false, phone: '021-66778899', rating: 4.2, hasDelivery: false, hasDiscount: true },
          { id: 4, name: 'داروخانه بهار', address: 'خیابان شریعتی، مجتمع الف', lat: 35.7440, lng: 51.4480, open24: false, phone: '021-33556677', rating: 4.6, hasDelivery: true, hasDiscount: false },
          { id: 5, name: 'داروخانه هلال', address: 'خیابان آزادی، برج ب', lat: 35.6990, lng: 51.3370, open24: true, phone: '021-44556677', rating: 4.4, hasDelivery: false, hasDiscount: true },
          { id: 6, name: 'داروخانه پارس', address: 'خیابان ستارخان، پلاک ۸۴', lat: 35.7170, lng: 51.3650, open24: false, phone: '021-44332211', rating: 4.3, hasDelivery: true, hasDiscount: false },
        ]
      } catch (error) {
        console.error('Error fetching pharmacies:', error)
      } finally {
        this.loading = false
      }
    },

    updatePharmacyDistances() {
      if (!this.userLocation) return
      
      this.pharmacies.forEach(pharmacy => {
        pharmacy.distanceKm = this.calculateDistance(this.userLocation!, pharmacy)
      })
    },

    calculateDistance(userLocation: { lat: number; lng: number }, pharmacy: Pharmacy): number {
      const toRad = (d: number) => (d * Math.PI) / 180
      const R = 6371 // Earth's radius in kilometers
      const dLat = toRad(pharmacy.lat - userLocation.lat)
      const dLng = toRad(pharmacy.lng - userLocation.lng)
      const s1 = Math.sin(dLat / 2) ** 2
      const s2 = Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(pharmacy.lat)) * (Math.sin(dLng / 2) ** 2)
      return Number((2 * R * Math.asin(Math.sqrt(s1 + s2))).toFixed(2))
    },

    setUserLocation(location: { lat: number; lng: number }) {
      this.userLocation = location
      this.updatePharmacyDistances()
    },

    // Cart actions
    addToCart(medicine: Medicine, pharmacy: Pharmacy, quantity: number = 1) {
      const existingItem = this.cart.find(
        item => item.medicine.id === medicine.id && item.pharmacy.id === pharmacy.id
      )
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.cart.push({
          id: Date.now(),
          medicine,
          pharmacy,
          quantity
        })
      }
      
      this.saveCartToStorage()
    },

    removeFromCart(itemId: number) {
      const index = this.cart.findIndex(item => item.id === itemId)
      if (index > -1) {
        this.cart.splice(index, 1)
        this.saveCartToStorage()
      }
    },

    updateCartQuantity(itemId: number, quantity: number) {
      const item = this.cart.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(itemId)
        } else {
          item.quantity = quantity
          this.saveCartToStorage()
        }
      }
    },

    clearCart() {
      this.cart = []
      this.saveCartToStorage()
    },

    // Favorites actions
    toggleFavorite(pharmacyId: number) {
      const index = this.favorites.indexOf(pharmacyId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(pharmacyId)
      }
      this.saveFavoritesToStorage()
    },

    // Filter actions
    setFilter(key: keyof typeof this.filters, value: boolean | string | null) {
      (this.filters as any)[key] = value
    },

    clearFilters() {
      this.filters = {
        only24: false,
        hasDelivery: false,
        hasDiscount: false,
        category: null
      }
      this.searchQuery = ''
    },

    // Storage actions
    saveCartToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pharmacy_cart', JSON.stringify(this.cart))
      }
    },

    saveFavoritesToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pharmacy_favorites', JSON.stringify(this.favorites))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('pharmacy_cart')
          const savedFavorites = localStorage.getItem('pharmacy_favorites')
          
          if (savedCart) this.cart = JSON.parse(savedCart)
          if (savedFavorites) this.favorites = JSON.parse(savedFavorites)
        } catch (error) {
          console.error('Error loading from localStorage:', error)
        }
      }
    }
  }
})