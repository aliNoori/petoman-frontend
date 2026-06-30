import { ref, computed } from 'vue';

export interface VueTimerOptions {
  duration: number; // in seconds
  onComplete?: () => void;
}

export const createVueTimer = (options: VueTimerOptions) => {
  const { duration, onComplete } = options;
  
  const timeLeft = ref(0);
  const isActive = ref(false);
  let intervalId: number | null = null;

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const start = () => {
    if (isActive.value) return;
    
    timeLeft.value = duration;
    isActive.value = true;
    
    intervalId = window.setInterval(() => {
      timeLeft.value--;
      
      if (timeLeft.value <= 0) {
        stop();
        onComplete?.();
      }
    }, 1000);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isActive.value = false;
    timeLeft.value = 0;
  };

  const reset = () => {
    stop();
    timeLeft.value = duration;
  };

  return {
    timeLeft: computed(() => timeLeft.value),
    formattedTime,
    isActive: computed(() => isActive.value),
    start,
    stop,
    reset,
  };
};
