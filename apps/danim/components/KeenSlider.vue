<template>
  <div class="keen-slider-wrapper">
    <div ref="sliderRef" class="keen-slider overflow-hidden">
      <slot />
    </div>

    <!-- Navigation arrows -->
    <button
      v-if="showNavigation && sliderReady && totalSlides > 1"
      @click="handlePrev"
      @mousedown.prevent
      class="slider-arrow slider-arrow--left"
      :disabled="!canGoPrev"
      type="button"
      aria-label="اسلاید قبلی"
    >
      <Icon name="chevron-left" size="md" />
    </button>

    <button
      v-if="showNavigation && sliderReady && totalSlides > 1"
      @click="handleNext"
      @mousedown.prevent
      class="slider-arrow slider-arrow--right"
      :disabled="!canGoNext"
      type="button"
      aria-label="اسلاید بعدی"
    >
      <Icon name="chevron-right" size="md" />
    </button>

    <!-- Dots indicator -->
    <div v-if="showPagination && totalSlides > 1" class="slider-dots">
      <button
        v-for="idx in totalSlides"
        :key="idx"
        @click="handleGoTo(idx - 1)"
        :class="['slider-dot', { 'slider-dot--active': currentSlide === idx - 1 }]"
        :aria-label="`اسلاید ${idx}`"
        type="button"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useKeenSlider } from 'keen-slider/vue.es'

interface Props {
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  breakpoints?: Record<string, { slidesPerView: number; spaceBetween?: number }>
  showNavigation?: boolean
  showPagination?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  mode?: 'snap' | 'free' | 'free-snap'
  rtl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  slidesPerView: 1,
  spaceBetween: 16,
  breakpoints: () => ({}),
  showNavigation: true,
  showPagination: false,
  autoplay: false,
  autoplayDelay: 3000,
  loop: false,
  mode: 'snap',
  rtl: true
})

const currentSlide = ref(0)
const totalSlides = ref(0)
const sliderReady = ref(false)

// Configure keen-slider options
const sliderOptions = computed(() => {
  const options: any = {
    slides: {
      perView: props.slidesPerView,
      spacing: props.spaceBetween
    },
    mode: props.mode,
    loop: props.loop,
    rtl: props.rtl,
    drag: true,
    rubberband: false,
    slideChanged: (s: any) => {
      currentSlide.value = s.track.details.rel
    },
    created: (s: any) => {
      totalSlides.value = s.slides.length
      sliderReady.value = true
    },
    updated: (s: any) => {
      totalSlides.value = s.slides.length
      sliderReady.value = true
    }
  }

  // Add breakpoints if provided
  if (Object.keys(props.breakpoints).length > 0) {
    options.breakpoints = {}
    Object.entries(props.breakpoints).forEach(([breakpoint, config]) => {
      options.breakpoints[`(min-width: ${breakpoint}px)`] = {
        slides: {
          perView: config.slidesPerView,
          spacing: config.spaceBetween || props.spaceBetween
        }
      }
    })
  }

  return options
})

// Initialize keen-slider
const [sliderRef, sliderInstance] = useKeenSlider<HTMLElement>(sliderOptions)

// Navigation functions
const handlePrev = () => {
  if (sliderInstance.value) {
    sliderInstance.value.prev()
  }
}

const handleNext = () => {
  if (sliderInstance.value) {
    sliderInstance.value.next()
  }
}

const handleGoTo = (index: number) => {
  if (sliderInstance.value) {
    sliderInstance.value.moveToIdx(index)
  }
}

// Navigation state
const canGoPrev = computed(() => {
  return props.loop || currentSlide.value > 0
})

const canGoNext = computed(() => {
  return props.loop || currentSlide.value < totalSlides.value - 1
})

// Auto-play functionality
let autoplayTimer: NodeJS.Timeout | null = null

function startAutoplay() {
  if (!props.autoplay || !sliderInstance.value) return
  
  autoplayTimer = setInterval(() => {
    if (sliderInstance.value) {
      if (props.loop || currentSlide.value < totalSlides.value - 1) {
        sliderInstance.value.next()
      } else {
        sliderInstance.value.moveToIdx(0)
      }
    }
  }, props.autoplayDelay)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  if (props.autoplay) {
    startAutoplay()
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
})

// Watch for prop changes
watch(() => props.autoplay, (newVal) => {
  if (newVal) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
})
</script>

<style scoped>
.keen-slider-wrapper {
  position: relative;
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.keen-slider {
  width: 100%;
  overflow: hidden !important;
  touch-action: pan-y;
}

/* Ensure slides are properly sized */
.keen-slider[data-keen-slider] .keen-slider__slide {
  min-height: 0;
  overflow: hidden;
  flex-shrink: 0;
  width: auto !important;
}

/* Navigation arrows - positioned over the slider */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #fed7aa;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ea580c;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  user-select: none;
  backdrop-filter: blur(8px);
}

.slider-arrow:hover:not(:disabled) {
  background: #ea580c;
  color: white;
  border-color: #ea580c;
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
  transform: translateY(-50%) scale(1.1);
}

.slider-arrow:active:not(:disabled) {
  transform: translateY(-50%) scale(0.95);
}

.slider-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.slider-arrow--left {
  left: 12px;
}

.slider-arrow--right {
  right: 12px;
}

/* Hide arrows on mobile */
@media (max-width: 768px) {
  .slider-arrow {
    display: none;
  }
}

/* Dots indicator */
.slider-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.slider-dot:hover,
.slider-dot--active {
  background: #ea580c;
}

.slider-dot--active {
  transform: scale(1.2);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .slider-arrow {
    width: 40px;
    height: 40px;
  }

  .slider-arrow--left {
    left: -20px;
  }

  .slider-arrow--right {
    right: -20px;
  }
}

@media (max-width: 480px) {
  .slider-arrow--left {
    left: -15px;
  }

  .slider-arrow--right {
    right: -15px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .slider-arrow {
    transition: none;
  }

  .slider-dot {
    transition: none;
  }
}

/* Focus states for keyboard navigation */
.slider-arrow:focus-visible {
  outline: 2px solid #ea580c;
  outline-offset: 2px;
}

.slider-dot:focus-visible {
  outline: 2px solid #ea580c;
  outline-offset: 2px;
}
</style>