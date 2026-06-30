interface LocationState {
  selectedCity: string | null
  latitude: number | null
  longitude: number | null
  isLocationEnabled: boolean
}

export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    selectedCity: null,
    latitude: null,
    longitude: null,
    isLocationEnabled: false
  }),

  getters: {
    hasLocation: (state) => state.latitude !== null && state.longitude !== null,
    hasCity: (state) => state.selectedCity !== null
  },

  actions: {
    setSelectedCity(city: string) {
      this.selectedCity = city
      
      // Store in localStorage
      if (process.client) {
        localStorage.setItem('selectedCity', city)
      }
    },

    setLocation(lat: number, lng: number) {
      this.latitude = lat
      this.longitude = lng
      this.isLocationEnabled = true
      
      // Store in localStorage
      if (process.client) {
        localStorage.setItem('location', JSON.stringify({ lat, lng }))
      }
    },

    clearLocation() {
      this.latitude = null
      this.longitude = null
      this.isLocationEnabled = false
      
      // Clear from localStorage
      if (process.client) {
        localStorage.removeItem('location')
      }
    },

    loadFromStorage() {
      if (!process.client) return
      
      // Load saved city
      const savedCity = localStorage.getItem('selectedCity')
      if (savedCity) {
        this.selectedCity = savedCity
      }
      
      // Load saved location
      const savedLocation = localStorage.getItem('location')
      if (savedLocation) {
        try {
          const { lat, lng } = JSON.parse(savedLocation)
          this.latitude = lat
          this.longitude = lng
          this.isLocationEnabled = true
        } catch (error) {
          console.error('Error parsing saved location:', error)
        }
      }
    },

    // Calculate distance between two points using Haversine formula
    calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
      const R = 6371 // Earth's radius in kilometers
      const dLat = this.toRad(lat2 - lat1)
      const dLng = this.toRad(lng2 - lng1)
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },

    toRad(degrees: number): number {
      return degrees * (Math.PI / 180)
    },

    getDistanceFromUser(targetLat: number, targetLng: number): number | null {
      if (!this.hasLocation) return null
      return this.calculateDistance(
        this.latitude!,
        this.longitude!,
        targetLat,
        targetLng
      )
    }
  }
})
