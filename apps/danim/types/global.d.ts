// Auto-imports for Nuxt 3
declare global {
  const ref: typeof import('vue')['ref']
  const reactive: typeof import('vue')['reactive']
  const computed: typeof import('vue')['computed']
  const useSeoMeta: typeof import('#app')['useSeoMeta']
  const useAuthStore: typeof import('~/stores/auth')['useAuthStore']
  const navigateTo: typeof import('#app')['navigateTo']
}

export {}
