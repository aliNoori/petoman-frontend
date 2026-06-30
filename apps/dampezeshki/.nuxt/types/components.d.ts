
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

interface _GlobalComponents {
  'AppFooter': typeof import("../../components/AppFooter.vue").default
  'CategorySelector': typeof import("../../components/CategorySelector.vue").default
  'GlobalToast': typeof import("../../components/GlobalToast.vue").default
  'MedicineCategorySelector': typeof import("../../components/MedicineCategorySelector.vue").default
  'MedicineSEOBuilder': typeof import("../../components/MedicineSEOBuilder.vue").default
  'MedicineSearchOrCreate': typeof import("../../components/MedicineSearchOrCreate.vue").default
  'MedicinesList': typeof import("../../components/MedicinesList.vue").default
  'OrderDetailsModal': typeof import("../../components/OrderDetailsModal.vue").default
  'PatientCallOverlay': typeof import("../../components/PatientCallOverlay.vue").default
  'PersianCalendar': typeof import("../../components/PersianCalendar.vue").default
  'PersianDatePicker': typeof import("../../components/PersianDatePicker.vue").default
  'ProductOrderDetailsModal': typeof import("../../components/ProductOrderDetailsModal.vue").default
  'ProductSEOBuilder': typeof import("../../components/ProductSEOBuilder.vue").default
  'ProductSearchOrCreate': typeof import("../../components/ProductSearchOrCreate.vue").default
  'ProductTitleInput': typeof import("../../components/ProductTitleInput.vue").default
  'ProductVideoUploader': typeof import("../../components/ProductVideoUploader.vue").default
  'ProductsList': typeof import("../../components/ProductsList.vue").default
  'AddAddressSheet': typeof import("../../components/address/AddAddressSheet.vue").default
  'AddressListSheet': typeof import("../../components/address/AddressListSheet.vue").default
  'AddressSelectionSheet': typeof import("../../components/address/AddressSelectionSheet.vue").default
  'PharmacyDetailsCard': typeof import("../../components/cards/PharmacyDetailsCard.vue").default
  'ClinicCard': typeof import("../../components/clinic/ClinicCard.vue").default
  'MapSearchField': typeof import("../../components/clinic/MapSearchField.vue").default
  'CitySelector': typeof import("../../components/header/CitySelector.vue").default
  'SiteHeader': typeof import("../../components/header/SiteHeader.vue").default
  'SiteHeaderBackup': typeof import("../../components/header/SiteHeader_backup.vue").default
  'AdditionalServiceCard': typeof import("../../components/home/AdditionalServiceCard.vue").default
  'AiVetWidget': typeof import("../../components/home/AiVetWidget.vue").default
  'CTASection': typeof import("../../components/home/CTASection.vue").default
  'EmergencyBanner': typeof import("../../components/home/EmergencyBanner.vue").default
  'FeatureCard': typeof import("../../components/home/FeatureCard.vue").default
  'FeaturesSection': typeof import("../../components/home/FeaturesSection.vue").default
  'Hero': typeof import("../../components/home/Hero.vue").default
  'HeroSection': typeof import("../../components/home/HeroSection.vue").default
  'ServiceCard': typeof import("../../components/home/ServiceCard.vue").default
  'ServicesRow': typeof import("../../components/home/ServicesRow.vue").default
  'ServicesSection': typeof import("../../components/home/ServicesSection.vue").default
  'TestimonialCard': typeof import("../../components/home/TestimonialCard.vue").default
  'TestimonialsSection': typeof import("../../components/home/TestimonialsSection.vue").default
  'CardSkeleton': typeof import("../../components/pharmacy/CardSkeleton.vue").default
  'CartWidget': typeof import("../../components/pharmacy/CartWidget.vue").default
  'MapboxAddressSelector': typeof import("../../components/pharmacy/MapboxAddressSelector.vue").default
  'PharmacyCardOld': typeof import("../../components/pharmacy/PharmacyCard-old.vue").default
  'PharmacyCard': typeof import("../../components/pharmacy/PharmacyCard.vue").default
  'PharmacyCartWidget': typeof import("../../components/pharmacy/PharmacyCartWidget.vue").default
  'PharmacyPageSkeleton': typeof import("../../components/pharmacy/PharmacyPageSkeleton.vue").default
  'PharmacySliderCard': typeof import("../../components/pharmacy/PharmacySliderCard.vue").default
  'Avatar': typeof import("../../components/ui/Avatar.vue").default
  'Badge': typeof import("../../components/ui/Badge.vue").default
  'Button': typeof import("../../components/ui/Button.vue").default
  'Card': typeof import("../../components/ui/Card.vue").default
  'CityModal': typeof import("../../components/ui/CityModal.vue").default
  'Dropdown': typeof import("../../components/ui/Dropdown.vue").default
  'FileUploadCard': typeof import("../../components/ui/FileUploadCard.vue").default
  'Input': typeof import("../../components/ui/Input.vue").default
  'Modal': typeof import("../../components/ui/Modal.vue").default
  'Notification': typeof import("../../components/ui/Notification.vue").default
  'PersianTimePicker': typeof import("../../components/ui/PersianTimePicker.vue").default
  'Select': typeof import("../../components/ui/Select.vue").default
  'Skeleton': typeof import("../../components/ui/Skeleton.vue").default
  'USelectMenu': typeof import("../../components/ui/USelectMenu.vue").default
  'VetCard': typeof import("../../components/vet/VetCard.vue").default
  'AddressSelector': typeof import("../../../../shared/components/AddressSelector.vue").default
  'MapCitySelector': typeof import("../../../../shared/components/MapCitySelector.vue").default
  'NuxtWelcome': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/welcome.vue").default
  'NuxtLayout': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-layout").default
  'NuxtErrorBoundary': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
  'ClientOnly': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/client-only").default
  'DevOnly': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/dev-only").default
  'ServerPlaceholder': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/server-placeholder").default
  'NuxtLink': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-link").default
  'NuxtLoadingIndicator': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
  'NuxtTime': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-time.vue").default
  'NuxtRouteAnnouncer': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
  'NuxtImg': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
  'NuxtPicture': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
  'NuxtPage': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/pages/runtime/page").default
  'NoScript': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").NoScript
  'Link': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Link
  'Base': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Base
  'Title': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Title
  'Meta': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Meta
  'Style': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Style
  'Head': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Head
  'Html': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Html
  'Body': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Body
  'NuxtIsland': typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-island").default
  'LazyAppFooter': LazyComponent<typeof import("../../components/AppFooter.vue").default>
  'LazyCategorySelector': LazyComponent<typeof import("../../components/CategorySelector.vue").default>
  'LazyGlobalToast': LazyComponent<typeof import("../../components/GlobalToast.vue").default>
  'LazyMedicineCategorySelector': LazyComponent<typeof import("../../components/MedicineCategorySelector.vue").default>
  'LazyMedicineSEOBuilder': LazyComponent<typeof import("../../components/MedicineSEOBuilder.vue").default>
  'LazyMedicineSearchOrCreate': LazyComponent<typeof import("../../components/MedicineSearchOrCreate.vue").default>
  'LazyMedicinesList': LazyComponent<typeof import("../../components/MedicinesList.vue").default>
  'LazyOrderDetailsModal': LazyComponent<typeof import("../../components/OrderDetailsModal.vue").default>
  'LazyPatientCallOverlay': LazyComponent<typeof import("../../components/PatientCallOverlay.vue").default>
  'LazyPersianCalendar': LazyComponent<typeof import("../../components/PersianCalendar.vue").default>
  'LazyPersianDatePicker': LazyComponent<typeof import("../../components/PersianDatePicker.vue").default>
  'LazyProductOrderDetailsModal': LazyComponent<typeof import("../../components/ProductOrderDetailsModal.vue").default>
  'LazyProductSEOBuilder': LazyComponent<typeof import("../../components/ProductSEOBuilder.vue").default>
  'LazyProductSearchOrCreate': LazyComponent<typeof import("../../components/ProductSearchOrCreate.vue").default>
  'LazyProductTitleInput': LazyComponent<typeof import("../../components/ProductTitleInput.vue").default>
  'LazyProductVideoUploader': LazyComponent<typeof import("../../components/ProductVideoUploader.vue").default>
  'LazyProductsList': LazyComponent<typeof import("../../components/ProductsList.vue").default>
  'LazyAddAddressSheet': LazyComponent<typeof import("../../components/address/AddAddressSheet.vue").default>
  'LazyAddressListSheet': LazyComponent<typeof import("../../components/address/AddressListSheet.vue").default>
  'LazyAddressSelectionSheet': LazyComponent<typeof import("../../components/address/AddressSelectionSheet.vue").default>
  'LazyPharmacyDetailsCard': LazyComponent<typeof import("../../components/cards/PharmacyDetailsCard.vue").default>
  'LazyClinicCard': LazyComponent<typeof import("../../components/clinic/ClinicCard.vue").default>
  'LazyMapSearchField': LazyComponent<typeof import("../../components/clinic/MapSearchField.vue").default>
  'LazyCitySelector': LazyComponent<typeof import("../../components/header/CitySelector.vue").default>
  'LazySiteHeader': LazyComponent<typeof import("../../components/header/SiteHeader.vue").default>
  'LazySiteHeaderBackup': LazyComponent<typeof import("../../components/header/SiteHeader_backup.vue").default>
  'LazyAdditionalServiceCard': LazyComponent<typeof import("../../components/home/AdditionalServiceCard.vue").default>
  'LazyAiVetWidget': LazyComponent<typeof import("../../components/home/AiVetWidget.vue").default>
  'LazyCTASection': LazyComponent<typeof import("../../components/home/CTASection.vue").default>
  'LazyEmergencyBanner': LazyComponent<typeof import("../../components/home/EmergencyBanner.vue").default>
  'LazyFeatureCard': LazyComponent<typeof import("../../components/home/FeatureCard.vue").default>
  'LazyFeaturesSection': LazyComponent<typeof import("../../components/home/FeaturesSection.vue").default>
  'LazyHero': LazyComponent<typeof import("../../components/home/Hero.vue").default>
  'LazyHeroSection': LazyComponent<typeof import("../../components/home/HeroSection.vue").default>
  'LazyServiceCard': LazyComponent<typeof import("../../components/home/ServiceCard.vue").default>
  'LazyServicesRow': LazyComponent<typeof import("../../components/home/ServicesRow.vue").default>
  'LazyServicesSection': LazyComponent<typeof import("../../components/home/ServicesSection.vue").default>
  'LazyTestimonialCard': LazyComponent<typeof import("../../components/home/TestimonialCard.vue").default>
  'LazyTestimonialsSection': LazyComponent<typeof import("../../components/home/TestimonialsSection.vue").default>
  'LazyCardSkeleton': LazyComponent<typeof import("../../components/pharmacy/CardSkeleton.vue").default>
  'LazyCartWidget': LazyComponent<typeof import("../../components/pharmacy/CartWidget.vue").default>
  'LazyMapboxAddressSelector': LazyComponent<typeof import("../../components/pharmacy/MapboxAddressSelector.vue").default>
  'LazyPharmacyCardOld': LazyComponent<typeof import("../../components/pharmacy/PharmacyCard-old.vue").default>
  'LazyPharmacyCard': LazyComponent<typeof import("../../components/pharmacy/PharmacyCard.vue").default>
  'LazyPharmacyCartWidget': LazyComponent<typeof import("../../components/pharmacy/PharmacyCartWidget.vue").default>
  'LazyPharmacyPageSkeleton': LazyComponent<typeof import("../../components/pharmacy/PharmacyPageSkeleton.vue").default>
  'LazyPharmacySliderCard': LazyComponent<typeof import("../../components/pharmacy/PharmacySliderCard.vue").default>
  'LazyAvatar': LazyComponent<typeof import("../../components/ui/Avatar.vue").default>
  'LazyBadge': LazyComponent<typeof import("../../components/ui/Badge.vue").default>
  'LazyButton': LazyComponent<typeof import("../../components/ui/Button.vue").default>
  'LazyCard': LazyComponent<typeof import("../../components/ui/Card.vue").default>
  'LazyCityModal': LazyComponent<typeof import("../../components/ui/CityModal.vue").default>
  'LazyDropdown': LazyComponent<typeof import("../../components/ui/Dropdown.vue").default>
  'LazyFileUploadCard': LazyComponent<typeof import("../../components/ui/FileUploadCard.vue").default>
  'LazyInput': LazyComponent<typeof import("../../components/ui/Input.vue").default>
  'LazyModal': LazyComponent<typeof import("../../components/ui/Modal.vue").default>
  'LazyNotification': LazyComponent<typeof import("../../components/ui/Notification.vue").default>
  'LazyPersianTimePicker': LazyComponent<typeof import("../../components/ui/PersianTimePicker.vue").default>
  'LazySelect': LazyComponent<typeof import("../../components/ui/Select.vue").default>
  'LazySkeleton': LazyComponent<typeof import("../../components/ui/Skeleton.vue").default>
  'LazyUSelectMenu': LazyComponent<typeof import("../../components/ui/USelectMenu.vue").default>
  'LazyVetCard': LazyComponent<typeof import("../../components/vet/VetCard.vue").default>
  'LazyAddressSelector': LazyComponent<typeof import("../../../../shared/components/AddressSelector.vue").default>
  'LazyMapCitySelector': LazyComponent<typeof import("../../../../shared/components/MapCitySelector.vue").default>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/welcome.vue").default>
  'LazyNuxtLayout': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-layout").default>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
  'LazyClientOnly': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/client-only").default>
  'LazyDevOnly': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/dev-only").default>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/server-placeholder").default>
  'LazyNuxtLink': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-link").default>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
  'LazyNuxtTime': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
  'LazyNuxtImg': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
  'LazyNuxtPicture': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
  'LazyNuxtPage': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/pages/runtime/page").default>
  'LazyNoScript': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").NoScript>
  'LazyLink': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Link>
  'LazyBase': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Base>
  'LazyTitle': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Title>
  'LazyMeta': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Meta>
  'LazyStyle': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Style>
  'LazyHead': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Head>
  'LazyHtml': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Html>
  'LazyBody': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/head/runtime/components").Body>
  'LazyNuxtIsland': LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@3.20.2_@parcel+watcher_1b0924509a43a951d99fe8c84250ca65/node_modules/nuxt/dist/app/components/nuxt-island").default>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
