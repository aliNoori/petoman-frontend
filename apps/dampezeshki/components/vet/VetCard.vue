<template>
  <div class="bg-white rounded-xl overflow-hidden hover:shadow-sm transition-all duration-200 shadow-sm">
    <!-- Header Banner -->
    <div class="h-20 bg-sky-100 relative">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-2 right-4 w-6 h-6 bg-sky-400 rounded-full"></div>
        <div class="absolute top-4 right-12 w-3 h-3 bg-sky-300 rounded-full"></div>
        <div class="absolute bottom-3 left-6 w-4 h-4 bg-sky-400 rounded-full"></div>
        <div class="absolute bottom-5 left-16 w-2 h-2 bg-sky-300 rounded-full"></div>
      </div>
      
      <!-- Avatar - Absolute positioned on header -->
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          <img :src="vet.avatar" class="w-full h-full rounded-full object-cover"/>
<!--          <span class="text-sm font-bold text-sky-600">{{ vet.avatar }}</span>-->
        </div>
      </div>
      
      <!-- Status Badge on Banner -->
      <div class="absolute top-2 left-3">
        <span
          class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm"
          :class="statusBadgeTextClass"
        >
          <i :class="statusIconClass" class="text-xs"></i>
          {{ statusText }}
        </span>
      </div>
      
      <!-- 24h Badge if applicable -->
      <div v-if="vet.available24" class="absolute top-2 right-3">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800">
          <i class="ti ti-clock-24 text-xs"></i>
          ۲۴ ساعته
        </span>
      </div>
    </div>
    
    <div class="p-4 pt-8">
      
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-lg mb-1 text-center">
            {{ vet.name }}
          </h3>
          <p class="text-sm text-gray-600 mb-2 text-center">{{ vet.specialty }}</p>
          
          <!-- Rating and Experience -->
          <div class="flex items-center justify-center gap-3 text-xs">
            <div class="flex items-center gap-1">
              <i class="ti ti-star-filled text-amber-400"></i>
              <span class="font-medium text-gray-700">{{ vet.rating }}</span>
            </div>
            <span class="text-gray-400">•</span>
            <div class="flex items-center gap-1">
              <i class="ti ti-certificate text-sky-400"></i>
              <span class="text-gray-600">{{ vet.experienceYears }} سال</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Address -->
      <p class="text-sm text-gray-600 mb-2 text-center truncate">
        <i class="ti ti-map-pin text-sky-400 ml-1"></i>
        {{ vet.address }}
      </p>

      <!-- Distance (if available) -->
      <div v-if="distanceKm !== null" class="mb-4 flex justify-center">
        <div class="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 rounded-full text-xs font-medium text-sky-700">
          <i class="ti ti-route text-sm"></i>
          <span>{{ formatDistance(distanceKm) }} از شما</span>
        </div>
      </div>
      
      <div v-else class="mb-4"></div>

      <!-- Services Tags -->
      <div class="flex flex-wrap gap-1 mb-4 justify-center">
        <span 
          v-for="service in vet.services.slice(0, 2)" 
          :key="service"
          class="px-2 py-1 text-xs bg-sky-50 text-sky-700 rounded-full"
        >
          {{ service }}
        </span>
        <span 
          v-if="vet.services.length > 2"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
        >
          +{{ vet.services.length - 2 }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <!-- Book Appointment Button -->
        <NuxtLink
          :to="`/vet/${vet.id}`"
          class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="vet.hasAvailableSlots 
            ? 'bg-sky-500 text-white hover:bg-sky-600' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
        >
          <i class="ti ti-calendar text-sm"></i>
          {{ vet.hasAvailableSlots ? 'رزرو نوبت' : 'نوبتی ندارد' }}
        </NuxtLink>
        
        <!-- Profile Button -->
        <NuxtLink
            :to="canAccessProfile ? `/vet/${vet.id}/profile` : null"
            class="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium border border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors"
            :class="{ 'pointer-events-none opacity-50': !canAccessProfile }"
        >
          <i class="ti ti-user text-sm"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  vet: { type: Object, required: true },
  distanceKm: { type: Number, default: null },
  highlight: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  canAccessProfile: { type: Boolean, default: false },
  showBadge: { type: Boolean, default: false },
  viewMode: { type: String, default: 'grid' }
});

const statusBadgeTextClass = computed(() => {
  if (props.vet.available24) {
    return "text-emerald-600";
  } else if (props.vet.isOnline) {
    return "text-green-600";
  } else {
    return "text-gray-600";
  }
});

const statusIconClass = computed(() => {
  if (props.vet.available24) {
    return "ti ti-clock-24";
  } else if (props.vet.isOnline) {
    return "ti ti-circle-check";
  } else {
    return "ti ti-circle-x";
  }
});

const statusText = computed(() => {
  if (props.vet.available24) {
    return "۲۴ ساعته";
  } else if (props.vet.isOnline) {
    return "آنلاین";
  } else {
    return "آفلاین";
  }
});

const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)} متر`;
  }
  return `${km.toFixed(1)} کیلومتر`;
};
</script>