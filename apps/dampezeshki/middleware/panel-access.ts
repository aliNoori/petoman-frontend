export default defineNuxtRouteMiddleware((to) => {
  // TEMPORARILY DISABLED FOR TESTING
  // Check if user is authenticated and has panel access
  /*
  if (process.client) {
    const authStore = useAuthStore()

    // Check if user is authenticated
    if (!authStore.isAuthenticated || !authStore.user) {
      // Redirect to login
      return navigateTo('/auth/login')
    }

    // Check if user has panel access (vet, clinic, pharmacy, admin)
    const allowedRoles = ['VET', 'CLINIC', 'PHARMACY', 'ADMIN']
    if (!allowedRoles.includes(authStore.user.role)) {
      // Redirect to home or unauthorized page
      return navigateTo('/')
    }
  }
  */
})