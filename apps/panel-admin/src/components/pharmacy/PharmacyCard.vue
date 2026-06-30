<template>
  <div class="bg-white rounded-xl overflow-hidden hover:shadow-sm transition-all duration-200 shadow-sm">
    <!-- Header Banner -->
    <div class="h-20 bg-gray-100 relative">
      <!-- Decorative Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-2 right-4 w-6 h-6 bg-gray-400 rounded-full"></div>
        <div class="absolute top-4 right-12 w-3 h-3 bg-gray-300 rounded-full"></div>
        <div class="absolute bottom-3 left-6 w-4 h-4 bg-gray-400 rounded-full"></div>
        <div class="absolute bottom-5 left-16 w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
      
      <!-- Logo - Absolute positioned on header -->
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <i :class="`ti ${pharmacy.logo || 'ti-building-hospital'}`" class="text-xl text-gray-600"></i>
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
      <div v-if="pharmacy.open24" class="absolute top-2 right-3">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800">
          <i class="ti ti-clock-24 text-xs"></i>
          ۲۴ ساعته
        </span>
      </div>
    </div>
    
    <div class="p-4 pt-8">
      
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-lg mb-2 text-center">
            {{ pharmacy.name }}
          </h3>
          
          <!-- Rating -->
          <div class="flex items-center justify-center gap-1">
            <i class="ti ti-star-filled text-sky-400 text-sm"></i>
            <span class="font-medium text-gray-700">{{ pharmacy.rating }}</span>
            <span class="text-xs text-gray-500">({{ pharmacy.reviewsCount }} نظر)</span>
          </div>
        </div>
      </div>

      <!-- Address -->
      <p class="text-sm text-gray-600 mb-4 text-center">
        <i class="ti ti-map-pin text-sky-400 ml-1"></i>
        {{ pharmacy.address }}
      </p>

      <!-- View Pharmacy Button -->
      <router-link
        :to="`/pharmacy/${pharmacy.id}`"
        class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="pharmacy.isOpen 
          ? 'bg-sky-500 text-white hover:bg-sky-600' 
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
      >
        <i class="ti ti-eye text-sm"></i>
        مشاهده داروخانه
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pharmacy: { type: Object, required: true },
  distanceKm: { type: Number, default: null },
  highlight: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  showBadge: { type: Boolean, default: false },
  viewMode: { type: String, default: 'grid' }
});

const statusBadgeClass = computed(() => {
  if (props.pharmacy.open24) {
    return "bg-emerald-100 text-emerald-800";
  } else if (props.pharmacy.isOpen) {
    return "bg-green-100 text-green-800";
  } else {
    return "bg-red-100 text-red-800";
  }
});

const statusBadgeTextClass = computed(() => {
  if (props.pharmacy.open24) {
    return "text-emerald-600";
  } else if (props.pharmacy.isOpen) {
    return "text-green-600";
  } else {
    return "text-red-600";
  }
});

const statusIconClass = computed(() => {
  if (props.pharmacy.open24) {
    return "ti ti-clock-24";
  } else if (props.pharmacy.isOpen) {
    return "ti ti-circle-check";
  } else {
    return "ti ti-circle-x";
  }
});

const statusText = computed(() => {
  if (props.pharmacy.open24) {
    return "۲۴ ساعته";
  } else if (props.pharmacy.isOpen) {
    return "باز";
  } else {
    return "بسته";
  }
});

function telHref(phone) {
  return phone ? `tel:${phone}` : "#";
}
</script>