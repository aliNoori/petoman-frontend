import type { CartItem } from '~/types/pharmacy'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0),
    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
      const existingItem = this.items.find((i: CartItem) => i.id === item.id)
      
      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        this.items.push({
          ...item,
          quantity: item.quantity || 1
        })
      }
      
      // Save to localStorage
      this.saveToStorage()
    },

    removeItem(itemId: string) {
      const index = this.items.findIndex((item: CartItem) => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToStorage()
      }
    },

    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find((i: CartItem) => i.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else {
          item.quantity = quantity
          this.saveToStorage()
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },

    saveToStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dampezeshki-cart', JSON.stringify(this.items))
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('dampezeshki-cart')
        if (saved) {
          this.items = JSON.parse(saved)
        }
      }
    }
  }
})