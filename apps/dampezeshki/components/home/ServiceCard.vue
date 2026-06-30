<template>
  <div class="group relative">
    <div 
      class="h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      :class="{
        'ring-2 ring-primary-500 ring-opacity-50': primary,
        'border-red-200 bg-red-50': urgent
      }"
    >
      <!-- Card Header -->
      <div class="p-6 pb-4">
        <div class="flex items-center mb-4">
          <div 
            class="text-4xl mr-4"
            :class="{
              'animate-pulse': urgent
            }"
          >
            {{ icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 font-vazir">
            {{ title }}
          </h3>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed font-vazir">
          {{ description }}
        </p>
      </div>

      <!-- Features List -->
      <div class="px-6 pb-4">
        <ul class="space-y-2">
          <li 
            v-for="feature in features" 
            :key="feature"
            class="flex items-start text-sm text-gray-600 font-vazir"
          >
            <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            {{ feature }}
          </li>
        </ul>
      </div>

      <!-- Action Button -->
      <div class="p-6 pt-2">
        <NuxtLink
          :to="buttonLink"
          class="block w-full text-center py-3 px-4 rounded-xl font-medium transition-all duration-200 font-vazir"
          :class="{
            'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl': primary,
            'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl animate-pulse': urgent,
            'bg-gray-100 hover:bg-gray-200 text-gray-700': !primary && !urgent
          }"
        >
          {{ buttonText }}
        </NuxtLink>
      </div>

      <!-- Decorative Element -->
      <div 
        v-if="primary || urgent"
        class="absolute top-4 left-4 w-2 h-2 rounded-full"
        :class="{
          'bg-primary-500': primary,
          'bg-red-500 animate-ping': urgent
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  primary?: boolean
  urgent?: boolean
}

defineProps<Props>()
</script>
