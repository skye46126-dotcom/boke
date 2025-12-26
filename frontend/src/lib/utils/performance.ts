/**
 * Performance Optimization Utilities
 * 客户端性能优化工具集
 * 
 * Feature: article-typography-enhancement
 * Requirements: 9.1 - Minimize JavaScript execution time and optimize RAF loops
 */

/**
 * Debounce function to limit execution frequency
 * 防抖函数，限制函数执行频率
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution rate
 * 节流函数，限制函数执行速率
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * RequestAnimationFrame throttle for smooth 60fps animations
 * RAF 节流，确保 60fps 流畅动画
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };
}

/**
 * Idle callback wrapper for non-critical tasks
 * 空闲回调包装器，用于非关键任务
 */
export function runWhenIdle(
  callback: () => void,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined') {
    const win = window as any;
    if ('requestIdleCallback' in win) {
      return win.requestIdleCallback(callback, options);
    } else {
      // Fallback for browsers without requestIdleCallback
      return win.setTimeout(callback, 1) as number;
    }
  }
  return 0;
}

/**
 * Cancel idle callback
 * 取消空闲回调
 */
export function cancelIdle(id: number): void {
  if (typeof window !== 'undefined') {
    const win = window as any;
    if ('cancelIdleCallback' in win) {
      win.cancelIdleCallback(id);
    } else {
      win.clearTimeout(id);
    }
  }
}

/**
 * Lazy load images with Intersection Observer
 * 使用 Intersection Observer 懒加载图片
 */
export function lazyLoadImages(
  selector: string = 'img[data-src]',
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;

        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);

  const images = document.querySelectorAll<HTMLImageElement>(selector);
  images.forEach((img) => imageObserver.observe(img));

  return imageObserver;
}

/**
 * Preload critical resources
 * 预加载关键资源
 */
export function preloadResource(
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch'
): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;

  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * Code splitting helper - dynamic import with error handling
 * 代码分割辅助函数 - 带错误处理的动态导入
 */
export async function loadModule<T>(
  importFn: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }

  throw lastError || new Error('Failed to load module');
}

/**
 * Performance monitoring utilities
 * 性能监控工具
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  /**
   * Mark a performance point
   * 标记性能点
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
    
    if (performance.mark) {
      performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   * 测量两个标记之间的时间
   */
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : performance.now();

    if (startTime === undefined) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    const duration = (endTime || performance.now()) - startTime;
    this.measures.set(name, duration);

    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (e) {
        // Ignore if marks don't exist in Performance API
      }
    }

    return duration;
  }

  /**
   * Get all measures
   * 获取所有测量值
   */
  getMeasures(): Map<string, number> {
    return new Map(this.measures);
  }

  /**
   * Clear all marks and measures
   * 清除所有标记和测量值
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();

    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  }

  /**
   * Log performance metrics to console
   * 将性能指标输出到控制台
   */
  log(): void {
    console.group('Performance Metrics');
    this.measures.forEach((duration, name) => {
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    });
    console.groupEnd();
  }
}

/**
 * Check if user prefers reduced motion
 * 检查用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Optimize event listeners with passive flag
 * 使用 passive 标志优化事件监听器
 */
export function addPassiveEventListener(
  element: HTMLElement | Window | Document,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): void {
  const passiveOptions: AddEventListenerOptions = {
    passive: true,
    ...options,
  };

  element.addEventListener(event, handler, passiveOptions);
}

/**
 * Batch DOM reads and writes to avoid layout thrashing
 * 批量处理 DOM 读写以避免布局抖动
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private rafId: number | null = null;

  /**
   * Schedule a DOM read operation
   * 调度 DOM 读取操作
   */
  read(callback: () => void): void {
    this.readQueue.push(callback);
    this.scheduleFlush();
  }

  /**
   * Schedule a DOM write operation
   * 调度 DOM 写入操作
   */
  write(callback: () => void): void {
    this.writeQueue.push(callback);
    this.scheduleFlush();
  }

  /**
   * Schedule flush of queued operations
   * 调度队列操作的刷新
   */
  private scheduleFlush(): void {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => this.flush());
    }
  }

  /**
   * Flush all queued operations
   * 刷新所有队列操作
   */
  private flush(): void {
    // Execute all reads first
    const reads = this.readQueue.slice();
    this.readQueue = [];
    reads.forEach((read) => read());

    // Then execute all writes
    const writes = this.writeQueue.slice();
    this.writeQueue = [];
    writes.forEach((write) => write());

    this.rafId = null;
  }

  /**
   * Clear all queued operations
   * 清除所有队列操作
   */
  clear(): void {
    this.readQueue = [];
    this.writeQueue = [];

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

/**
 * Memory-efficient event delegation
 * 内存高效的事件委托
 */
export function delegate(
  element: HTMLElement | Document,
  eventType: string,
  selector: string,
  handler: (event: Event, target: HTMLElement) => void
): () => void {
  const listener = (event: Event) => {
    const target = event.target as HTMLElement;
    const delegateTarget = target.closest(selector) as HTMLElement;

    if (delegateTarget && element.contains(delegateTarget)) {
      handler(event, delegateTarget);
    }
  };

  element.addEventListener(eventType, listener);

  // Return cleanup function
  return () => {
    element.removeEventListener(eventType, listener);
  };
}

/**
 * Singleton instance of DOMBatcher for global use
 * DOMBatcher 的单例实例，供全局使用
 */
export const domBatcher = new DOMBatcher();

/**
 * Singleton instance of PerformanceMonitor for global use
 * PerformanceMonitor 的单例实例，供全局使用
 */
export const performanceMonitor = new PerformanceMonitor();
