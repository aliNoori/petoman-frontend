import { ref, computed, readonly } from 'vue'
import type { Pharmacy, Medicine, CartItem } from '../types/pharmacy'

// Global state for pharmacy functionality
const cart = ref<CartItem[]>([])
const favorites = ref<number[]>([])
const recentSearches = ref<string[]>([])

export const usePharmacy = () => {
  // Cart management
  const addToCart = (medicine: Medicine, pharmacy: Pharmacy, quantity: number = 1) => {
    const existingItem = cart.value.find(
      (item: CartItem) => item.medicine?.id === medicine.id && item.pharmacy?.id === pharmacy.id
    )
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        id: Date.now().toString(),
        name: medicine.name,
        price: medicine.price,
        quantity,
        medicine,
        pharmacy,
        pharmacyId: pharmacy.id.toString(),
        pharmacyName: pharmacy.name
      })
    }
  }

  const removeFromCart = (itemId: string) => {
    const index = cart.value.findIndex((item: CartItem) => item.id === itemId)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
  }

  const updateCartQuantity = (itemId: string, quantity: number) => {
    const item = cart.value.find((item: CartItem) => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  // Favorites management
  const toggleFavorite = (pharmacyId: number) => {
    const index = favorites.value.indexOf(pharmacyId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(pharmacyId)
    }
  }

  const isFavorite = (pharmacyId: number) => {
    return favorites.value.includes(pharmacyId)
  }

  // Search history
  const addToSearchHistory = (query: string) => {
    if (query.trim() && !recentSearches.value.includes(query)) {
      recentSearches.value.unshift(query)
      // Keep only last 10 searches
      if (recentSearches.value.length > 10) {
        recentSearches.value.pop()
      }
    }
  }

  const clearSearchHistory = () => {
    recentSearches.value = []
  }

  // Computed values
  const cartItemsCount = computed(() => {
    return cart.value.reduce((total: number, item: CartItem) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cart.value.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
  })

  const cartPharmacies = computed(() => {
    const pharmacyMap = new Map()
    cart.value.forEach((item: CartItem) => {
      const pharmacyId = item.pharmacy?.id || item.pharmacyId
      if (!pharmacyMap.has(pharmacyId)) {
        pharmacyMap.set(pharmacyId, {
          pharmacy: item.pharmacy,
          items: [],
          total: 0
        })
      }
      const pharmacyData = pharmacyMap.get(pharmacyId)
      pharmacyData.items.push(item)
      pharmacyData.total += item.price * item.quantity
    })
    return Array.from(pharmacyMap.values())
  })

  // Location utilities
  const toRad = (d: number) => (d * Math.PI) / 180

  const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const s1 = Math.sin(dLat / 2) ** 2
    const s2 = Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * (Math.sin(dLng / 2) ** 2)
    return 2 * R * Math.asin(Math.sqrt(s1 + s2))
  }

  const calculateDistance = (userLocation: { lat: number; lng: number }, pharmacy: Pharmacy) => {
    return Number(haversineKm(userLocation, pharmacy).toFixed(2))
  }

  // Local storage persistence
  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pharmacy_cart', JSON.stringify(cart.value))
      localStorage.setItem('pharmacy_favorites', JSON.stringify(favorites.value))
      localStorage.setItem('pharmacy_searches', JSON.stringify(recentSearches.value))
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pharmacy_cart')
        const savedFavorites = localStorage.getItem('pharmacy_favorites')
        const savedSearches = localStorage.getItem('pharmacy_searches')
        
        if (savedCart) cart.value = JSON.parse(savedCart)
        if (savedFavorites) favorites.value = JSON.parse(savedFavorites)
        if (savedSearches) recentSearches.value = JSON.parse(savedSearches)
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }
  }

  // Watch for changes and save to localStorage
  if (typeof window !== 'undefined') {
    // Note: In a real app, you'd use Vue's watch() here
    // This is a simplified version for demonstration
  }

  return {
    // State
    cart: readonly(cart),
    favorites: readonly(favorites),
    recentSearches: readonly(recentSearches),
    
    // Cart methods
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // Favorites methods
    toggleFavorite,
    isFavorite,
    
    // Search methods
    addToSearchHistory,
    clearSearchHistory,
    
    // Computed
    cartItemsCount,
    cartTotal,
    cartPharmacies,
    
    // Utilities
    calculateDistance,
    haversineKm,
    
    // Persistence
    saveToLocalStorage,
    loadFromLocalStorage
  }
}

// Export types for use in components
export type { Pharmacy, Medicine, CartItem }