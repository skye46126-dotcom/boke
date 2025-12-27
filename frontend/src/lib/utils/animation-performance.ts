/**
 * 动画性能优化工具
 * 确保动画帧率≥60fps，优化GPU加速
 */

// 检测是否支持GPU加速
export function supportsGPUAcceleration(): boolean {
  if (typeof document === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (error) {
    return false;
  }
}

// 检测是否支持CSS3动画
export function supportsCSS3Animation(): boolean {
  if (typeof document === 'undefined') return false;
  
  try {
    const element = document.createElement('div');
    const properties = ['animation', 'webkitAnimation', 'mozAnimation', 'oAnimation'];
    
    return properties.some(property => property in element.style);
  } catch (error) {
    return false;
  }
}

// 检测用户是否偏好减少动画
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    return false;
  }
}

// 优化动画性能的CSS类名生成器
export function getOptimizedAnimationClass(baseClass: string): string {
  const classes = [baseClass];
  
  if (supportsGPUAcceleration()) {
    classes.push('gpu-accelerated');
  }
  
  if (prefersReducedMotion()) {
    classes.push('reduced-motion');
  }
  
  return classes.join(' ');
}

// 动画帧率监控
export class AnimationFrameMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private isRunning = false;

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  getFPS(): number {
    return this.fps;
  }

  private tick = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(this.tick);
  };
}

// 防抖动画触发器
export function debounceAnimation(callback: () => void, delay: number = 16): () => void {
  let timeoutId: NodeJS.Timeout;
  let animationId: number;

  return () => {
    clearTimeout(timeoutId);
    cancelAnimationFrame(animationId);

    timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(callback);
    }, delay);
  };
}

// 节流动画触发器
export function throttleAnimation(callback: () => void, delay: number = 16): () => void {
  let lastTime = 0;

  return () => {
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= delay) {
      requestAnimationFrame(callback);
      lastTime = currentTime;
    }
  };
}

// 检测动画性能并提供降级方案
export function getAnimationConfig() {
  const config = {
    useGPUAcceleration: supportsGPUAcceleration(),
    useCSS3Animation: supportsCSS3Animation(),
    reducedMotion: prefersReducedMotion(),
    animationDuration: {
      fast: prefersReducedMotion() ? 0 : 150,
      normal: prefersReducedMotion() ? 0 : 300,
      slow: prefersReducedMotion() ? 0 : 500,
    },
    easing: {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    }
  };

  return config;
}