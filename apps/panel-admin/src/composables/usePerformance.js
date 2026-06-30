// composables/useLazyLoading.js
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

export function useLazyLoading(callback, options = {}) {
  const isIntersecting = ref(false)
  const target = ref(null)
  
  let observer = null
  
  const { 
    threshold = 0.1,
    rootMargin = '50px',
    once = true
  } = options

  onMounted(() => {
    if (!target.value) return
    
    observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.value = entry.isIntersecting
        
        if (entry.isIntersecting) {
          callback?.()
          
          if (once) {
            observer?.disconnect()
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    )
    
    observer.observe(target.value)
  })
  
  onUnmounted(() => {
    observer?.disconnect()
  })
  
  return {
    target,
    isIntersecting
  }
}

// composables/useVirtualScroll.js
export function useVirtualScroll(items, itemHeight = 200, containerHeight = 600) {
  const scrollTop = ref(0)
  const containerRef = ref(null)
  
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
  const totalHeight = computed(() => items.value.length * itemHeight)
  
  const startIndex = computed(() => 
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - 1)
  )
  
  const endIndex = computed(() => 
    Math.min(items.value.length, startIndex.value + visibleCount)
  )
  
  const visibleItems = computed(() => 
    items.value.slice(startIndex.value, endIndex.value).map((item, index) => ({
      ...item,
      index: startIndex.value + index,
      top: (startIndex.value + index) * itemHeight
    }))
  )
  
  const onScroll = (event) => {
    scrollTop.value = event.target.scrollTop
  }
  
  return {
    containerRef,
    visibleItems,
    totalHeight,
    onScroll
  }
}

// composables/useDebounce.js
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  
  watchEffect((onInvalidate) => {
    const handler = setTimeout(() => {
      debouncedValue.value = value.value
    }, delay)
    
    onInvalidate(() => {
      clearTimeout(handler)
    })
  })
  
  return debouncedValue
}

export default {
  useLazyLoading,
  useVirtualScroll,
  useDebounce
}