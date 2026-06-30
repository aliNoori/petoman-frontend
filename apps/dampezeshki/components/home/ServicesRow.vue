<template>
  <section class="py-16 bg-white dark:bg-neutral-900">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          خدمات پتومن
        </h2>
        <p class="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          از دامپزشکان متخصص تا کلینیک‌های مجهز و داروخانه‌های کامل، همه چیز در یک مکان
        </p>
      </div>

      <!-- Services Grid -->
      <div class="space-y-16">
        <!-- Veterinarians Section -->
        <div>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">
              دامپزشکان متخصص
            </h3>
            <Button 
              variant="outline"
              @click="$router.push('/vets')"
            >
              مشاهده همه
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VetCard
              v-for="vet in featuredVets"
              :key="vet.id"
              :vet="vet"
            />
          </div>
        </div>

        <!-- Clinics Section -->
        <div>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">
              کلینیک‌های مجهز
            </h3>
            <Button 
              variant="outline"
              @click="$router.push('/clinics')"
            >
              مشاهده همه
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ClinicCard
              v-for="clinic in featuredClinics"
              :key="clinic.id"
              :clinic="clinic"
            />
          </div>
        </div>

        <!-- Pharmacies Section -->
        <div>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white">
              داروخانه‌های دامپزشکی
            </h3>
            <Button 
              variant="outline"
              @click="$router.push('/pharmacies')"
            >
              مشاهده همه
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PharmacyCard
              v-for="pharmacy in featuredPharmacies"
              :key="pharmacy.id"
              :pharmacy="pharmacy"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Mock data - In real app, this would come from API
const featuredVets = ref([
  {
    id: '1',
    name: 'دکتر محمد رضایی',
    slug: 'dr-mohammad-rezaei',
    specialties: ['حیوانات خانگی', 'جراحی'],
    priceOnline: 150000,
    rating: 4.8,
    reviewCount: 45,
    city: 'تهران',
    hasOnline: true,
    hasPhone: true,
    hasHomeVisit: true,
    avatar: '/avatars/vet1.jpg',
    isVerified: true
  },
  {
    id: '2',
    name: 'دکتر فاطمه احمدی',
    slug: 'dr-fatemeh-ahmadi',
    specialties: ['پرندگان', 'حیوانات خانگی'],
    priceOnline: 120000,
    rating: 4.9,
    reviewCount: 32,
    city: 'اصفهان',
    hasOnline: true,
    hasPhone: true,
    hasHomeVisit: false,
    avatar: '/avatars/vet2.jpg',
    isVerified: true
  },
  {
    id: '3',
    name: 'دکتر علی کریمی',
    slug: 'dr-ali-karimi',
    specialties: ['حیوانات بزرگ', 'اورژانس'],
    priceOnline: 180000,
    rating: 4.7,
    reviewCount: 28,
    city: 'شیراز',
    hasOnline: true,
    hasPhone: true,
    hasHomeVisit: true,
    avatar: '/avatars/vet3.jpg',
    isVerified: true
  }
])

const featuredClinics = ref([
  {
    id: '1',
    name: 'کلینیک دامپزشکی پت کر',
    slug: 'pet-care-clinic',
    city: 'تهران',
    bannerUrl: '/clinics/clinic1-banner.jpg',
    services: ['ویزیت', 'جراحی', 'آزمایشگاه'],
    rating: 4.7,
    reviewCount: 78,
    isVerified: true
  },
  {
    id: '2',
    name: 'بیمارستان دامپزشکی آریا',
    slug: 'arya-vet-hospital',
    city: 'شیراز',
    bannerUrl: '/clinics/clinic2-banner.jpg',
    services: ['اورژانس', 'بستری', 'سونوگرافی'],
    rating: 4.6,
    reviewCount: 56,
    isVerified: true
  },
  {
    id: '3',
    name: 'کلینیک ایران وت',
    slug: 'iran-vet-clinic',
    city: 'مشهد',
    bannerUrl: '/clinics/clinic3-banner.jpg',
    services: ['ویزیت', 'رادیولوژی', 'دندانپزشکی'],
    rating: 4.8,
    reviewCount: 41,
    isVerified: true
  }
])

const featuredPharmacies = ref([
  {
    id: '1',
    name: 'داروخانه دامپزشکی سلامت',
    slug: 'salamat-vet-pharmacy',
    city: 'تهران',
    is24h: true,
    hasDelivery: true,
    rating: 4.5,
    reviewCount: 23,
    isVerified: true
  },
  {
    id: '2',
    name: 'داروخانه حیوانات مهر',
    slug: 'mehr-animal-pharmacy',
    city: 'مشهد',
    is24h: false,
    hasDelivery: false,
    rating: 4.3,
    reviewCount: 15,
    isVerified: true
  },
  {
    id: '3',
    name: 'داروخانه پت فارم',
    slug: 'pet-pharm',
    city: 'اصفهان',
    is24h: false,
    hasDelivery: true,
    rating: 4.6,
    reviewCount: 19,
    isVerified: true
  }
])
</script>
