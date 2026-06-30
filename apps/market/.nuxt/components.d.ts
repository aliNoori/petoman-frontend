
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const AddressSelector: typeof import("../components/AddressSelector.vue").default
export const AppFooter: typeof import("../components/AppFooter.vue").default
export const CategorySelector: typeof import("../components/CategorySelector.vue").default
export const GlobalToast: typeof import("../components/GlobalToast.vue").default
export const MapCitySelector: typeof import("../components/MapCitySelector.vue").default
export const OrderDetailsModal: typeof import("../components/OrderDetailsModal.vue").default
export const PersianDatePicker: typeof import("../components/PersianDatePicker.vue").default
export const ProductOrderDetailsModal: typeof import("../components/ProductOrderDetailsModal.vue").default
export const ProductSEOBuilder: typeof import("../components/ProductSEOBuilder.vue").default
export const ProductSearchOrCreate: typeof import("../components/ProductSearchOrCreate.vue").default
export const HeaderSiteHeader: typeof import("../components/header/SiteHeader.vue").default
export const UiFileUploadCard: typeof import("../components/ui/FileUploadCard.vue").default
export const UiUSelectMenu: typeof import("../components/ui/USelectMenu.vue").default
export const NuxtWelcome: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/welcome.vue").default
export const NuxtLayout: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-layout").default
export const NuxtErrorBoundary: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
export const ClientOnly: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/client-only").default
export const DevOnly: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/dev-only").default
export const ServerPlaceholder: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/server-placeholder").default
export const NuxtLink: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-link").default
export const NuxtLoadingIndicator: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
export const NuxtTime: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-time.vue").default
export const NuxtRouteAnnouncer: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
export const NuxtImg: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
export const NuxtPicture: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
export const NuxtPage: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/pages/runtime/page").default
export const NoScript: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").NoScript
export const Link: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Link
export const Base: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Base
export const Title: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Title
export const Meta: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Meta
export const Style: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Style
export const Head: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Head
export const Html: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Html
export const Body: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Body
export const NuxtIsland: typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-island").default
export const LazyAddressSelector: LazyComponent<typeof import("../components/AddressSelector.vue").default>
export const LazyAppFooter: LazyComponent<typeof import("../components/AppFooter.vue").default>
export const LazyCategorySelector: LazyComponent<typeof import("../components/CategorySelector.vue").default>
export const LazyGlobalToast: LazyComponent<typeof import("../components/GlobalToast.vue").default>
export const LazyMapCitySelector: LazyComponent<typeof import("../components/MapCitySelector.vue").default>
export const LazyOrderDetailsModal: LazyComponent<typeof import("../components/OrderDetailsModal.vue").default>
export const LazyPersianDatePicker: LazyComponent<typeof import("../components/PersianDatePicker.vue").default>
export const LazyProductOrderDetailsModal: LazyComponent<typeof import("../components/ProductOrderDetailsModal.vue").default>
export const LazyProductSEOBuilder: LazyComponent<typeof import("../components/ProductSEOBuilder.vue").default>
export const LazyProductSearchOrCreate: LazyComponent<typeof import("../components/ProductSearchOrCreate.vue").default>
export const LazyHeaderSiteHeader: LazyComponent<typeof import("../components/header/SiteHeader.vue").default>
export const LazyUiFileUploadCard: LazyComponent<typeof import("../components/ui/FileUploadCard.vue").default>
export const LazyUiUSelectMenu: LazyComponent<typeof import("../components/ui/USelectMenu.vue").default>
export const LazyNuxtWelcome: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/welcome.vue").default>
export const LazyNuxtLayout: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-layout").default>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
export const LazyClientOnly: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/client-only").default>
export const LazyDevOnly: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/dev-only").default>
export const LazyServerPlaceholder: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/server-placeholder").default>
export const LazyNuxtLink: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-link").default>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
export const LazyNuxtTime: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
export const LazyNuxtImg: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
export const LazyNuxtPicture: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
export const LazyNuxtPage: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/pages/runtime/page").default>
export const LazyNoScript: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").NoScript>
export const LazyLink: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Link>
export const LazyBase: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Base>
export const LazyTitle: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Title>
export const LazyMeta: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Meta>
export const LazyStyle: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Style>
export const LazyHead: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Head>
export const LazyHtml: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Html>
export const LazyBody: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/head/runtime/components").Body>
export const LazyNuxtIsland: LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_0321988bd9ca055348f0e562d4a3ca45/node_modules/nuxt/dist/app/components/nuxt-island").default>

export const componentNames: string[]
