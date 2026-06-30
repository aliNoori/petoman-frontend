<template>
  <div class="seo-slider-container" ref="sliderContainer">
    <!-- SEO-friendly fallback content -->
    <div class="slider-content" :class="{ 'slider-active': isSliderActive }">
      <!-- Visible slides grid for SEO -->
      <div 
        class="slides-grid" 
        ref="slidesGrid"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <slot />
      </div>
      
      <!-- Navigation arrows -->
      <button 
        v-if="showNavigation && canScrollLeft"
        @click="scrollLeft"
        class="nav-arrow nav-arrow-left"
        aria-label="اسلاید قبلی"
        type="button"
      >
        <Icon name="chevron-left" size="md" />
      </button>
      
      <button 
        v-if="showNavigation && canScrollRight"
        @click="scrollRight"
        class="nav-arrow nav-arrow-right"
        aria-label="اسلاید بعدی"
        type="button"
      >
        <Icon name="chevron-right" size="md" />
      </button>
    </div>
    
    <!-- Dots indicator -->
    <div v-if="showDots && totalPages > 1" class="dots-container">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="scrollToPage(page - 1)"
        :class="['dot', { 'dot-active': currentPage === page - 1 }]"
        :aria-label="`صفحه ${page}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween: number }>
  showNavigation?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  slidesPerView: 'auto',
  spaceBetween: 16,
  breakpoints: () => ({}),
  showNavigation: true,
  showDots: false,
  autoplay: false,
  autoplayDelay: 3000
})

const sliderContainer = ref<HTMLElement>()
const slidesGrid = ref<HTMLElement>()
const currentPage = ref(0)
const totalPages = ref(1)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const isSliderActive = ref(false)
const autoplayInterval = ref<NodeJS.Timeout>()
const isDragging = ref(false)
const startX = ref(0)
const dragStartScrollLeft = ref(0)

// Compute current slides per view based on breakpoints
const currentSlidesPerView = computed(() => {
  if (typeof window === 'undefined') return props.slidesPerView
  
  const width = window.innerWidth
  const breakpointKeys = Object.keys(props.breakpoints)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const breakpoint of breakpointKeys) {
    if (width >= breakpoint) {
      return props.breakpoints[breakpoint].slidesPerView
    }
  }
  
  return props.slidesPerView
})

const currentSpaceBetween = computed(() => {
  if (typeof window === 'undefined') return props.spaceBetween
  
  const width = window.innerWidth
  const breakpointKeys = Object.keys(props.breakpoints)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const breakpoint of breakpointKeys) {
    if (width >= breakpoint) {
      return props.breakpoints[breakpoint].spaceBetween
    }
  }
  
  return props.spaceBetween
})

function updateSliderState() {
  if (!slidesGrid.value) return
  
  const container = slidesGrid.value
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
  
  // Calculate current page
  const slideWidth = clientWidth / (typeof currentSlidesPerView.value === 'number' ? currentSlidesPerView.value : 1)
  currentPage.value = Math.round(scrollLeft / slideWidth)
  
  // Calculate total pages
  const children = container.children.length
  totalPages.value = Math.ceil(children / (typeof currentSlidesPerView.value === 'number' ? currentSlidesPerView.value : children))
}

function scrollLeft() {
  if (!slidesGrid.value) return
  
  const container = slidesGrid.value
  const scrollAmount = container.clientWidth * 0.8
  
  container.scrollTo({
    left: container.scrollLeft - scrollAmount,
    behavior: 'smooth'
  })
}

function scrollRight() {
  if (!slidesGrid.value) return
  
  const container = slidesGrid.value
  const scrollAmount = container.clientWidth * 0.8
  
  container.scrollTo({
    left: container.scrollLeft + scrollAmount,
    behavior: 'smooth'
  })
}

function scrollToPage(pageIndex: number) {
  if (!slidesGrid.value) return
  
  const container = slidesGrid.value
  const slideWidth = container.clientWidth / (typeof currentSlidesPerView.value === 'number' ? currentSlidesPerView.value : 1)
  
  container.scrollTo({
    left: pageIndex * slideWidth,
    behavior: 'smooth'
  })
}

// Drag functionality
function handleMouseDown(e: MouseEvent) {
  if (!slidesGrid.value) return
  
  isDragging.value = true
  startX.value = e.pageX - slidesGrid.value.offsetLeft
  dragStartScrollLeft.value = slidesGrid.value.scrollLeft
  slidesGrid.value.style.cursor = 'grabbing'
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value || !slidesGrid.value) return
  
  e.preventDefault()
  const x = e.pageX - slidesGrid.value.offsetLeft
  const walk = (x - startX.value) * 2
  slidesGrid.value.scrollLeft = dragStartScrollLeft.value - walk
}

function handleMouseUp() {
  if (!slidesGrid.value) return
  
  isDragging.value = false
  slidesGrid.value.style.cursor = 'grab'
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  updateSliderState()
}

// Touch functionality
function handleTouchStart(e: TouchEvent) {
  if (!slidesGrid.value) return
  
  isDragging.value = true
  startX.value = e.touches[0].pageX - slidesGrid.value.offsetLeft
  dragStartScrollLeft.value = slidesGrid.value.scrollLeft
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value || !slidesGrid.value) return
  
  const x = e.touches[0].pageX - slidesGrid.value.offsetLeft
  const walk = (x - startX.value) * 2
  slidesGrid.value.scrollLeft = dragStartScrollLeft.value - walk
}

function handleTouchEnd() {
  isDragging.value = false
  updateSliderState()
}

function startAutoplay() {
  if (!props.autoplay) return
  
  autoplayInterval.value = setInterval(() => {
    if (canScrollRight.value) {
      scrollRight()
    } else {
      // Reset to beginning
      scrollToPage(0)
    }
  }, props.autoplayDelay)
}

function stopAutoplay() {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = undefined
  }
}

// Setup responsive CSS custom properties
function updateCSSProperties() {
  if (!sliderContainer.value) return
  
  const container = sliderContainer.value
  container.style.setProperty('--slides-per-view', String(currentSlidesPerView.value))
  container.style.setProperty('--space-between', `${currentSpaceBetween.value}px`)
}

onMounted(() => {
  isSliderActive.value = true
  updateSliderState()
  updateCSSProperties()
  
  // Add scroll listener
  if (slidesGrid.value) {
    slidesGrid.value.addEventListener('scroll', updateSliderState, { passive: true })
    // Prevent default drag behavior for images
    slidesGrid.value.addEventListener('dragstart', (e) => e.preventDefault())
  }
  
  // Add resize listener
  window.addEventListener('resize', () => {
    updateCSSProperties()
    updateSliderState()
  }, { passive: true })
  
  // Start autoplay
  if (props.autoplay) {
    startAutoplay()
    
    // Pause on hover
    sliderContainer.value?.addEventListener('mouseenter', stopAutoplay)
    sliderContainer.value?.addEventListener('mouseleave', startAutoplay)
  }
})

onUnmounted(() => {
  stopAutoplay()
  
  if (slidesGrid.value) {
    slidesGrid.value.removeEventListener('scroll', updateSliderState)
  }
})

// Update on props change
watch([currentSlidesPerView, currentSpaceBetween], () => {
  updateCSSProperties()
  updateSliderState()
})
</script>

<style scoped>
.seo-slider-container {
  position: relative;
  width: 100%;
  --slides-per-view: auto;
  --space-between: 16px;
}

.slider-content {
  position: relative;
  overflow: hidden;
}

.slides-grid {
  display: flex;
  gap: var(--space-between);
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 4px;
  cursor: grab;
  user-select: none;
}

.slides-grid::-webkit-scrollbar {
  display: none;
}

.slides-grid:active {
  cursor: grabbing;
}

/* When slider is active, show only visible slides */
.slider-active .slides-grid {
  scroll-snap-type: x mandatory;
}

.slider-active .slides-grid > :deep(*) {
  flex-shrink: 0;
  scroll-snap-align: start;
  width: calc((100% - (var(--slides-per-view) - 1) * var(--space-between)) / var(--slides-per-view));
}

/* Navigation arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.nav-arrow:hover {
  background: #f97316;
  color: white;
  border-color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.nav-arrow-left {
  left: -20px;
}

.nav-arrow-right {
  right: -20px;
}

/* Dots indicator */
.dots-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot-active,
.dot:hover {
  background: #f97316;
  transform: scale(1.2);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .nav-arrow {
    width: 36px;
    height: 36px;
  }
  
  .nav-arrow-left {
    left: -18px;
  }
  
  .nav-arrow-right {
    right: -18px;
  }
}

/* Fallback for non-JS */
@media (prefers-reduced-motion: reduce) {
  .slides-grid {
    scroll-behavior: auto;
  }
}

/* Print styles */
@media print {
  .nav-arrow,
  .dots-container {
    display: none;
  }
  
  .slides-grid {
    overflow: visible;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
}
</style>
