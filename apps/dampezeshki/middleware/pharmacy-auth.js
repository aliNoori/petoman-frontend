export default defineNuxtRouteMiddleware((to) => {
  // Check if user is authenticated as pharmacist
  if (process.client) {
    const pharmacyUser = localStorage.getItem('pharmacyUser')
    
    if (!pharmacyUser) {
      // Redirect to pharmacy login
      return navigateTo('/pharmacy/login')
    }
    
    try {
      const user = JSON.parse(pharmacyUser)
      if (user.type !== 'pharmacist') {
        return navigateTo('/pharmacy/login')
      }
    } catch (error) {
      localStorage.removeItem('pharmacyUser')
      return navigateTo('/pharmacy/login')
    }
  }
})