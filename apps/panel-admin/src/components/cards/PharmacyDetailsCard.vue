<template>
  <Card hover class="h-full">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3 space-x-reverse">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg text-neutral-900 dark:text-white flex items-center">
              {{ pharmacy.name }}
              <svg 
                v-if="pharmacy.isVerified"
                class="w-5 h-5 text-primary mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </h3>
            <div class="flex items-center space-x-2 space-x-reverse text-sm text-neutral-600 dark:text-neutral-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ pharmacy.city }}</span>
            </div>
          </div>
        </div>
        
        <!-- Rating -->
        <div class="text-left">
          <div class="flex items-center space-x-1 space-x-reverse">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-sm font-medium">{{ pharmacy.rating }}</span>
          </div>
          <p class="text-xs text-neutral-500">{{ pharmacy.reviewCount }} نظر</p>
        </div>
      </div>

      <!-- Features -->
      <div class="mb-6">
        <div class="grid grid-cols-2 gap-3">
          <!-- 24/7 Status -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <div :class="[
              'w-3 h-3 rounded-full',
              pharmacy.is24h ? 'bg-green-500' : 'bg-yellow-500'
            ]"></div>
            <span class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ pharmacy.is24h ? '۲۴ ساعته' : 'ساعت کاری محدود' }}
            </span>
          </div>
          
          <!-- Delivery -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg 
              :class="[
                'w-4 h-4',
                pharmacy.hasDelivery ? 'text-green-600' : 'text-neutral-400'
              ]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4l4 4m0 0l-4-4m4 4V3" />
            </svg>
            <span class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ pharmacy.hasDelivery ? 'ارسال دارد' : 'فقط حضوری' }}
            </span>
          </div>
          
          <!-- Prescription -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm text-neutral-600 dark:text-neutral-400">
              پذیرش نسخه
            </span>
          </div>
          
          <!-- Consultation -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.906A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            <span class="text-sm text-neutral-600 dark:text-neutral-400">
              مشاوره دارویی
            </span>
          </div>
        </div>
      </div>

      <!-- Popular Products -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">محصولات محبوب:</h4>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
            <span class="text-neutral-600 dark:text-neutral-400">ویتامین‌ها</span>
          </div>
          <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
            <span class="text-neutral-600 dark:text-neutral-400">ضد انگل</span>
          </div>
          <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
            <span class="text-neutral-600 dark:text-neutral-400">شامپو</span>
          </div>
          <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2">
            <span class="text-neutral-600 dark:text-neutral-400">غذای خشک</span>
          </div>
        </div>
      </div>

      <!-- Distance -->
      <div v-if="distance" class="mb-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-neutral-600 dark:text-neutral-400">فاصله:</span>
          <span class="text-neutral-700 dark:text-neutral-300">{{ distance }} کیلومتر</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-2 space-x-reverse">
        <Button
          @click="viewProfile"
          class="flex-1"
          size="sm"
        >
          نمایش پروفایل
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          @click="callPharmacy"
          class="px-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 11.008c-.273.136-.442.427-.442.744v.016a1.001 1.001 0 00.442.744l4.064 2.032a1 1 0 00.896 0l4.064-2.032a1.001 1.001 0 00.442-.744v-.016c0-.317-.169-.608-.442-.744L11.2 9.387a1 1 0 01-.502-1.21L12.196 3.684A1 1 0 0113.144 3H16.5a2 2 0 012 2v.5" />
          </svg>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          @click="getDirections"
          class="px-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Pharmacy {
  id: string
  name: string
  slug: string
  city: string
  is24h: boolean
  hasDelivery: boolean
  rating: number
  reviewCount: number
  isVerified: boolean
  phone?: string
  lat?: number
  lng?: number
}

interface Props {
  pharmacy: Pharmacy
  distance?: number
}

const props = defineProps<Props>()
const router = useRouter()
const locationStore = useLocationStore()

const viewProfile = () => {
  router.push(`/pharmacy/store/${props.pharmacy.id}`)
}

const callPharmacy = () => {
  if (props.pharmacy.phone) {
    window.open(`tel:${props.pharmacy.phone}`, '_self')
  }
}

const getDirections = () => {
  if (props.pharmacy.lat && props.pharmacy.lng) {
    const url = `https://maps.google.com/maps?daddr=${props.pharmacy.lat},${props.pharmacy.lng}`
    window.open(url, '_blank')
  }
}

// Calculate distance if location is available
const distance = computed(() => {
  if (props.distance) return props.distance.toFixed(1)
  
  if (locationStore.hasLocation && props.pharmacy.lat && props.pharmacy.lng) {
    const dist = locationStore.getDistanceFromUser(props.pharmacy.lat, props.pharmacy.lng)
    return dist ? dist.toFixed(1) : null
  }
  
  return null
})
</script>
