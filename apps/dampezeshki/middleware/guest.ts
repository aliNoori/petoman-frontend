export default defineNuxtRouteMiddleware((to) => {
  // Guest middleware - redirect authenticated users away from auth pages
  if (process.client) {
    const authStore = useAuthStore()

    // If user is authenticated, redirect based on their role
    if (authStore.isAuthenticated && authStore.user) {
      const role = authStore.user.role

      // Redirect based on user role
      if (role === 'VET') {
        return navigateTo('/panel/vets')
      } else if (role === 'CLINIC') {
        return navigateTo('/panel/clinics')
      } else if (role === 'PHARMACY') {
        return navigateTo('/pharmacy')
      } else if (role === 'ADMIN') {
        return navigateTo('/admin')
      } else {
        // Regular users go to home
        return navigateTo('/')
      }
    }
  }

  // If not authenticated, allow access to the auth page
})