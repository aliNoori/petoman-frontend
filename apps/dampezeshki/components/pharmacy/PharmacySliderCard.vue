<template>
  <div class="bg-white rounded-xl border overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
    <!-- Main Content -->
    <div class="p-5">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ pharmacy.name }}
        </h3>
        
        <!-- Rating & Status -->
        <div class="flex items-center gap-2 mb-3">
          <div class="flex items-center gap-1">
            <i class="ti ti-star-filled text-amber-400 text-sm"></i>
            <span class="font-medium text-gray-800">{{ pharmacy.rating }}</span>
          </div>
          <span class="text-sm text-gray-500">({{ pharmacy.reviewsCount }})</span>
          
          <div 
            class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ml-auto"
            :class="statusBadgeClass"
          >
            <i :class="statusIconClass" class="text-xs"></i>
            {{ statusText }}
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="mb-4">
        <p class="text-sm text-gray-600">
          <i class="ti ti-map-pin text-gray-400 ml-1"></i>
          {{ pharmacy.address }}
        </p>
      </div>

      <!-- Action -->
      <div class="flex gap-2">
        <a
          :href="telHref(pharmacy.phone)"
          class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="pharmacy.isOpen 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
        >
          <i class="ti ti-phone text-sm"></i>
          تماس
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pharmacy: { type: Object, required: true },
  distanceKm: { type: Number, default: null },
});

// Phone link helper
const telHref = (phone) => `tel:${phone}`;

// Status badge classes
const statusBadgeClass = computed(() => {
  if (props.pharmacy.open24) {
    return 'bg-green-100 text-green-800 border border-green-200';
  }
  if (props.pharmacy.isOpen) {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  }
  return 'bg-red-100 text-red-800 border border-red-200';
});

const statusIconClass = computed(() => {
  if (props.pharmacy.open24) return 'ti ti-clock-24';
  if (props.pharmacy.isOpen) return 'ti ti-circle-check';
  return 'ti ti-circle-x';
});

const statusText = computed(() => {
  if (props.pharmacy.open24) return '۲۴ ساعته';
  if (props.pharmacy.isOpen) return 'باز';
  return 'بسته';
});
</script>