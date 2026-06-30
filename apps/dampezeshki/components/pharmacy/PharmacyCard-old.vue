<template><template>

  <article  <article

    class="group rounded-2xl border bg-white transition-all duration-300 hover:border-blue-300 overflow-hidden relative"    class="group rounded-2xl border bg-white transition-all duration-300 hover:border-blue-300 overflow-hidden relative"

    :class="[    :class="[

      highlight ? 'ring-2 ring-red-300' : '',      highlight ? 'ring-2 ring-red-300' : '',

      viewMode === 'list' ? 'flex items-center' : ''      viewMode === 'list' ? 'flex items-center' : ''

    ]"    ]"

  >  >

    <!-- Top Badge for Top Rated -->    <!-- Top Badge for Top Rated -->

    <div v-if="showBadge && pharmacy.rating >= 4.7" class="absolute top-3 left-3 z-10">    <div v-if="showBadge && pharmacy.rating >= 4.7" class="absolute top-3 left-3 z-10">

      <div class="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">      <div class="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">

        <i class="ti ti-crown text-sm ml-1"></i>        <i class="ti ti-crown text-sm ml-1"></i>

        برترین        برترین

      </div>      </div>

    </div>    </div>



    <!-- Header Section -->    <!-- Header Section -->

    <div class="p-4 pb-3">    <div class="p-4 pb-3">

      <div class="flex items-start justify-between gap-3 mb-3">      <div class="flex items-start justify-between gap-3 mb-3">

        <div>        <div>

          <h3 class="font-bold text-gray-900 leading-6 group-hover:text-blue-700 transition text-lg">          <h3 class="font-bold text-gray-900 leading-6 group-hover:text-blue-700 transition text-lg">

            {{ pharmacy.name }}            {{ pharmacy.name }}

          </h3>          </h3>

                    

          <!-- Rating & Reviews -->          <!-- Rating & Reviews -->

          <div class="flex items-center gap-2 mt-1">          <div class="flex items-center gap-2 mt-1">

            <div class="flex items-center gap-1">            <div class="flex items-center gap-1">

              <i class="ti ti-star-filled text-amber-400 text-sm"></i>              <i class="ti ti-star-filled text-amber-400 text-sm"></i>

              <span class="text-sm font-medium text-gray-700">{{ pharmacy.rating }}</span>              <span class="text-sm font-medium text-gray-700">{{ pharmacy.rating }}</span>

            </div>            </div>

            <span class="text-xs text-gray-500">({{ pharmacy.reviewsCount }} نظر)</span>            <span class="text-xs text-gray-500">({{ pharmacy.reviewsCount }} نظر)</span>

          </div>          </div>

        </div>        </div>



        <!-- Status Badge -->        <!-- Status Badge -->

        <div class="flex flex-col items-end gap-1">        <div class="flex flex-col items-end gap-1">

          <span          <span

            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"

            :class="statusBadgeClass"            :class="statusBadgeClass"

          >          >

            <i :class="statusIconClass" class="text-[10px]"></i>            <i :class="statusIconClass" class="text-[10px]"></i>

            {{ statusText }}            {{ statusText }}

          </span>          </span>

                    

          <!-- Open Hours -->          <!-- Open Hours -->

          <span class="text-xs text-gray-500">{{ pharmacy.openHours }}</span>          <span class="text-xs text-gray-500">{{ pharmacy.openHours }}</span>

        </div>        </div>

      </div>      </div>



      <!-- Address -->      <!-- Address -->

      <p class="text-sm text-gray-600 line-clamp-2 mb-3 truncate">      <p class="text-sm text-gray-600 line-clamp-2 mb-3 truncate">

        <i class="ti ti-map-pin text-base text-gray-400 ml-1"></i>        <i class="ti ti-map-pin text-base text-gray-400 ml-1"></i>

        {{ pharmacy.address }}        {{ pharmacy.address }}

      </p>      </p>



      <!-- Services Tags -->      <!-- Services Tags -->

      <div class="flex flex-wrap gap-1 mb-3">      <div class="flex flex-wrap gap-1 mb-3">

        <span         <span 

          v-for="service in pharmacy.services?.slice(0, 3)"           v-for="service in pharmacy.services?.slice(0, 3)" 

          :key="service"          :key="service"

          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"

        >        >

          {{ service }}          {{ service }}

        </span>        </span>

        <span         <span 

          v-if="pharmacy.services?.length > 3"          v-if="pharmacy.services?.length > 3"

          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"

        >        >

          +{{ pharmacy.services.length - 3 }}          +{{ pharmacy.services.length - 3 }}

        </span>        </span>

      </div>      </div>



      <!-- Features Row -->      <!-- Features Row -->

      <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">      <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">

        <div v-if="pharmacy.hasParking" class="flex items-center gap-1">        <div v-if="pharmacy.hasParking" class="flex items-center gap-1">

          <i class="ti ti-car text-emerald-500"></i>          <i class="ti ti-car text-emerald-500"></i>

          <span>پارکینگ</span>          <span>پارکینگ</span>

        </div>        </div>

        <div v-if="distanceKm != null" class="flex items-center gap-1">        <div v-if="distanceKm != null" class="flex items-center gap-1">

          <i class="ti ti-route text-purple-500"></i>          <i class="ti ti-route text-purple-500"></i>

          <span>{{ distanceKm.toFixed(1) }} کیلومتر</span>          <span>{{ distanceKm.toFixed(1) }} کیلومتر</span>

        </div>        </div>

      </div>      </div>

    </div>    </div>



    <!-- Footer Actions -->    <!-- Footer Actions -->

    <div class="bg-gray-50 px-4 py-3 border-t border-gray-100">    <div class="bg-gray-50 px-4 py-3 border-t border-gray-100">

      <div class="flex items-center justify-between">      <div class="flex items-center justify-between">

        <div class="flex gap-2">        <div class="flex gap-2">

          <a          <a

            :href="telHref(pharmacy.phone)"            :href="telHref(pharmacy.phone)"

            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"

            :class="pharmacy.isOpen             :class="pharmacy.isOpen 

              ? 'bg-emerald-500 text-white hover:bg-emerald-600'               ? 'bg-emerald-500 text-white hover:bg-emerald-600' 

              : 'bg-gray-300 text-gray-600 cursor-not-allowed'"              : 'bg-gray-300 text-gray-600 cursor-not-allowed'"

            :aria-label="'تماس با ' + pharmacy.name"            :aria-label="'تماس با ' + pharmacy.name"

          >          >

            <i class="ti ti-phone text-base"></i>            <i class="ti ti-phone text-base"></i>

            تماس            تماس

          </a>          </a>

                    

          <button          <button

            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"

          >          >

            <i class="ti ti-directions text-base"></i>            <i class="ti ti-directions text-base"></i>

            مسیریابی            مسیریابی

          </button>          </button>

        </div>        </div>



        <div class="flex items-center">        <div class="flex items-center">

          <!-- Favorite Toggle -->          <!-- Favorite Toggle -->

          <button           <button 

            @click="$emit('toggle-favorite', pharmacy.id)"            @click="$emit('toggle-favorite', pharmacy.id)"

            class="p-2 rounded-lg transition-colors duration-200"            class="p-2 rounded-lg transition-colors duration-200"

            :class="isFavorite             :class="isFavorite 

              ? 'text-red-500 hover:text-red-600'               ? 'text-red-500 hover:text-red-600' 

              : 'text-gray-400 hover:text-red-500'"              : 'text-gray-400 hover:text-red-500'"

            :title="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"            :title="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"

          >          >

            <i :class="isFavorite ? 'ti ti-heart-filled' : 'ti ti-heart'" class="text-lg"></i>            <i :class="isFavorite ? 'ti ti-heart-filled' : 'ti ti-heart'" class="text-lg"></i>

          </button>          </button>

        </div>        </div>

      </div>      </div>

    </div>    </div>

  </article>  </article>

</template></template>

    <!-- Header Section -->

<script setup>    <div class="p-4 pb-3">

import { computed } from "vue";      <div class="flex items-start justify-between gap-3 mb-3">

        <div>

const props = defineProps({          <h3 class="font-bold text-gray-900 leading-6 group-hover:text-sky-700 transition text-lg">

  pharmacy: { type: Object, required: true },            {{ pharmacy.name }}

  distanceKm: { type: Number, default: null },          </h3>

  highlight: { type: Boolean, default: false },          

  isFavorite: { type: Boolean, default: false },          <!-- Rating & Reviews -->

  showBadge: { type: Boolean, default: false },          <div class="flex items-center gap-2 mt-1">

  viewMode: { type: String, default: 'grid' }, // 'grid' | 'list'            <div class="flex items-center gap-1">

})              <i class="ti ti-star-filled text-amber-400 text-sm"></i>

              <span class="text-sm font-medium text-gray-700">{{ pharmacy.rating }}</span>

const emit = defineEmits(['toggle-favorite']);            </div>

            <span class="text-xs text-gray-500">({{ pharmacy.reviewsCount }} نظر)</span>

const statusBadgeClass = computed(() => {          </div>

  if (props.pharmacy.open24) {        </div>

    return "bg-emerald-50 text-emerald-700 border border-emerald-200"

  } else if (props.pharmacy.isOpen) {        <!-- Status Badge -->

    return "bg-green-50 text-green-700 border border-green-200"        <div class="flex flex-col items-end gap-1">

  } else {          <span

    return "bg-red-50 text-red-700 border border-red-200"            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"

  }            :class="statusBadgeClass"

})          >

            <i :class="statusIconClass" class="text-[10px]"></i>

const statusIconClass = computed(() => {            {{ statusText }}

  if (props.pharmacy.open24) {          </span>

    return "ti ti-clock-24 text-emerald-600"          

  } else if (props.pharmacy.isOpen) {          <!-- Open Hours -->

    return "ti ti-circle-filled text-green-600"          <span class="text-xs text-gray-500">{{ pharmacy.openHours }}</span>

  } else {        </div>

    return "ti ti-circle-filled text-red-600"      </div>

  }

})      <!-- Address -->

      <p class="text-sm text-gray-600 line-clamp-2 mb-3 truncate">

const statusText = computed(() => {        <i class="ti ti-map-pin text-base text-gray-400 ml-1"></i>

  if (props.pharmacy.open24) {        {{ pharmacy.address }}

    return "شبانه‌روزی"      </p>

  } else if (props.pharmacy.isOpen) {

    return "باز"      <!-- Services Tags -->

  } else {      <div class="flex flex-wrap gap-1 mb-3">

    return "بسته"        <span 

  }          v-for="service in pharmacy.services?.slice(0, 3)" 

})          :key="service"

          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"

function telHref(phone) {        >

  return phone ? `tel:${phone.replaceAll("-", "").replaceAll(" ", "")}` : "#";          {{ service }}

}        </span>

</script>        <span 

          v-if="pharmacy.services?.length > 3"

<style scoped>          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"

.line-clamp-2 {        >

  display: -webkit-box;          +{{ pharmacy.services.length - 3 }}

  -webkit-line-clamp: 2;        </span>

  line-clamp: 2;      </div>

  -webkit-box-orient: vertical;

  overflow: hidden;      <!-- Features Row -->

}      <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">

</style>        <div v-if="pharmacy.hasParking" class="flex items-center gap-1">
          <i class="ti ti-car text-emerald-500"></i>
          <span>پارکینگ</span>
        </div>
        <div v-if="pharmacy.acceptsInsurance" class="flex items-center gap-1">
          <i class="ti ti-shield-check text-blue-500"></i>
          <span>بیمه</span>
        </div>
        <div v-if="distanceKm != null" class="flex items-center gap-1">
          <i class="ti ti-route text-purple-500"></i>
          <span>{{ distanceKm.toFixed(1) }} کیلومتر</span>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="bg-gray-50 px-4 py-3 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <a
            :href="telHref(pharmacy.phone)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="pharmacy.isOpen 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'"
            :aria-label="'تماس با ' + pharmacy.name"
          >
            <i class="ti ti-phone text-base"></i>
            تماس
          </a>
          
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
          >
            <i class="ti ti-directions text-base"></i>
            مسیریابی
          </button>
        </div>

        <div class="flex items-center">
          <!-- Favorite Toggle -->
          <button 
            @click="$emit('toggle-favorite', pharmacy.id)"
            class="p-2 rounded-lg transition-colors duration-200"
            :class="isFavorite 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-red-500'"
            :title="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
          >
            <i :class="isFavorite ? 'ti ti-heart-filled' : 'ti ti-heart'" class="text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pharmacy: { type: Object, required: true },
  distanceKm: { type: Number, default: null },
  highlight: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  showBadge: { type: Boolean, default: false },
  viewMode: { type: String, default: 'grid' }, // 'grid' | 'list'
})

const emit = defineEmits(['toggle-favorite']);

const statusBadgeClass = computed(() => {
  if (props.pharmacy.open24) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200"
  } else if (props.pharmacy.isOpen) {
    return "bg-green-50 text-green-700 border border-green-200"
  } else {
    return "bg-red-50 text-red-700 border border-red-200"
  }
})

const statusIconClass = computed(() => {
  if (props.pharmacy.open24) {
    return "ti ti-clock-24 text-emerald-600"
  } else if (props.pharmacy.isOpen) {
    return "ti ti-circle-filled text-green-600"
  } else {
    return "ti ti-circle-filled text-red-600"
  }
})

const statusText = computed(() => {
  if (props.pharmacy.open24) {
    return "شبانه‌روزی"
  } else if (props.pharmacy.isOpen) {
    return "باز"
  } else {
    return "بسته"
  }
})

function telHref(phone) {
  return phone ? `tel:${phone.replaceAll("-", "").replaceAll(" ", "")}` : "#";
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
