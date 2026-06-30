export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware for non-panel routes
  if (!to.path.startsWith('/panel')) {
    return
  }

  // Pharmacy panel - check authentication
  if (to.path.startsWith('/panel/pharmacies')) {
    // Skip authentication for demo purposes
    return // Allow pharmacy panel access
  }

  // Vet and Clinic panels - share authentication (professional users)
  if (to.path.startsWith('/panel/vets') || to.path.startsWith('/panel/clinics')) {
    // Add vet/clinic authentication check here
    // For now, allow access
    return
  }

  // User panel - regular user authentication
  if (to.path.startsWith('/panel/users')) {
    // Add user authentication check here
    // For now, allow access
    return
  }

  // Handle old routing patterns - redirect to new structure
  if (to.path.startsWith('/panel/user/')) {
    const subPath = to.path.replace('/panel/user/', '')
    return `/panel/users/${subPath}`
  }
  
  if (to.path === '/panel/user') {
    return '/panel/users'
  }

  // If accessing /panel root, redirect to users by default
  if (to.path === '/panel' || to.path === '/panel/') {
    return '/panel/users'
  }
})
