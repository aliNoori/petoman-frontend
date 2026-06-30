export interface TimerOptions {
  duration: number; // in seconds
  onComplete?: () => void;
}

export const createTimer = (options: TimerOptions) => {
  const { duration, onComplete } = options;
  
  // Use simple reactive values instead of Vue refs for standalone timer
  let timeLeft = 0;
  let isActive = false;
  let intervalId: number | null = null;

  const getFormattedTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (isActive) return;
    
    timeLeft = duration;
    isActive = true;
    
    intervalId = window.setInterval(() => {
      timeLeft--;
      
      if (timeLeft <= 0) {
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
    isActive = false;
    timeLeft = 0;
  };

  const reset = () => {
    stop();
    timeLeft = duration;
  };

  return {
    get timeLeft() { return timeLeft; },
    get formattedTime() { return getFormattedTime(); },
    get isActive() { return isActive; },
    start,
    stop,
    reset,
  };
};
