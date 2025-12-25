/**
 * Performance Metrics Collection
 * 性能指标收集
 * 
 * Feature: article-typography-enhancement
 * Requirements: 9.4, 9.5 - Monitor TTI, Lighthouse scores, and Three.js frame rate
 */

/**
 * Performance thresholds based on requirements
 * 基于需求的性能阈值
 */
export const PERFORMANCE_THRESHOLDS = {
  // Lighthouse performance score should be > 90
  LIGHTHOUSE_SCORE: 90,
  
  // Time to Interactive should be < 2s on 3G
  TTI_3G: 2000, // ms
  
  // Three.js should maintain 60fps (16.67ms per frame)
  THREEJS_FRAME_TIME: 16.67, // ms
  
  // First Contentful Paint
  FCP: 1800, // ms
  
  // Largest Contentful Paint
  LCP: 2500, // ms
  
  // Cumulative Layout Shift
  CLS: 0.1,
  
  // First Input Delay
  FID: 100, // ms
};

/**
 * Performance metrics interface
 * 性能指标接口
 */
export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  tti?: number; // Time to Interactive
  
  // Custom metrics
  threeJsFrameTime?: number; // Average Three.js frame time
  threeJsFps?: number; // Three.js frames per second
  jsExecutionTime?: number; // Total JavaScript execution time
  
  // Resource timing
  resourceLoadTime?: number; // Total resource load time
  imageLoadTime?: number; // Image load time
  
  // Network
  connectionType?: string; // Network connection type
  effectiveType?: string; // Effective connection type (4g, 3g, etc.)
}

/**
 * Performance Metrics Collector
 * 性能指标收集器
 */
export class PerformanceMetricsCollector {
  private metrics: PerformanceMetrics = {};
  private threeJsFrameTimes: number[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
  }

  /**
   * Initialize performance observers
   * 初始化性能观察器
   */
  private initObservers(): void {
    // Observe paint timing (FCP)
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (e) {
        console.warn('Paint observer not supported');
      }

      // Observe largest contentful paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observe layout shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              this.metrics.cls = clsValue;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // Observe first input delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }

    // Collect network information
    this.collectNetworkInfo();
  }

  /**
   * Collect network information
   * 收集网络信息
   */
  private collectNetworkInfo(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionType = connection.type;
      this.metrics.effectiveType = connection.effectiveType;
    }
  }

  /**
   * Record Three.js frame time
   * 记录 Three.js 帧时间
   */
  recordThreeJsFrame(frameTime: number): void {
    this.threeJsFrameTimes.push(frameTime);
    
    // Keep only last 60 frames (1 second at 60fps)
    if (this.threeJsFrameTimes.length > 60) {
      this.threeJsFrameTimes.shift();
    }

    // Calculate average frame time and FPS
    const avgFrameTime = this.threeJsFrameTimes.reduce((a, b) => a + b, 0) / this.threeJsFrameTimes.length;
    this.metrics.threeJsFrameTime = avgFrameTime;
    this.metrics.threeJsFps = 1000 / avgFrameTime;
  }

  /**
   * Calculate Time to Interactive (TTI)
   * 计算可交互时间
   */
  calculateTTI(): number {
    if (!performance.timing) {
      return 0;
    }

    const timing = performance.timing;
    const tti = timing.domInteractive - timing.navigationStart;
    this.metrics.tti = tti;
    return tti;
  }

  /**
   * Calculate JavaScript execution time
   * 计算 JavaScript 执行时间
   */
  calculateJSExecutionTime(): number {
    if (!performance.getEntriesByType) {
      return 0;
    }

    const entries = performance.getEntriesByType('measure');
    let totalTime = 0;

    entries.forEach((entry) => {
      if (entry.name.includes('script') || entry.name.includes('js')) {
        totalTime += entry.duration;
      }
    });

    this.metrics.jsExecutionTime = totalTime;
    return totalTime;
  }

  /**
   * Calculate resource load time
   * 计算资源加载时间
   */
  calculateResourceLoadTime(): number {
    if (!performance.getEntriesByType) {
      return 0;
    }

    const resources = performance.getEntriesByType('resource');
    let totalTime = 0;
    let imageTime = 0;

    resources.forEach((entry: any) => {
      totalTime += entry.duration;
      
      if (entry.initiatorType === 'img') {
        imageTime += entry.duration;
      }
    });

    this.metrics.resourceLoadTime = totalTime;
    this.metrics.imageLoadTime = imageTime;
    
    return totalTime;
  }

  /**
   * Get all collected metrics
   * 获取所有收集的指标
   */
  getMetrics(): PerformanceMetrics {
    // Update calculated metrics
    this.calculateTTI();
    this.calculateJSExecutionTime();
    this.calculateResourceLoadTime();

    return { ...this.metrics };
  }

  /**
   * Check if metrics meet performance thresholds
   * 检查指标是否满足性能阈值
   */
  checkThresholds(): { passed: boolean; failures: string[] } {
    const metrics = this.getMetrics();
    const failures: string[] = [];

    if (metrics.tti && metrics.tti > PERFORMANCE_THRESHOLDS.TTI_3G) {
      failures.push(`TTI (${metrics.tti}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS.TTI_3G}ms)`);
    }

    if (metrics.fcp && metrics.fcp > PERFORMANCE_THRESHOLDS.FCP) {
      failures.push(`FCP (${metrics.fcp}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS.FCP}ms)`);
    }

    if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.LCP) {
      failures.push(`LCP (${metrics.lcp}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS.LCP}ms)`);
    }

    if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.CLS) {
      failures.push(`CLS (${metrics.cls}) exceeds threshold (${PERFORMANCE_THRESHOLDS.CLS})`);
    }

    if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.FID) {
      failures.push(`FID (${metrics.fid}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS.FID}ms)`);
    }

    if (metrics.threeJsFrameTime && metrics.threeJsFrameTime > PERFORMANCE_THRESHOLDS.THREEJS_FRAME_TIME) {
      failures.push(`Three.js frame time (${metrics.threeJsFrameTime.toFixed(2)}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS.THREEJS_FRAME_TIME}ms)`);
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  /**
   * Log metrics to console
   * 将指标输出到控制台
   */
  log(): void {
    const metrics = this.getMetrics();
    const thresholdCheck = this.checkThresholds();

    console.group('📊 Performance Metrics');
    
    console.group('Core Web Vitals');
    console.log(`FCP: ${metrics.fcp?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.FCP}ms)`);
    console.log(`LCP: ${metrics.lcp?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.LCP}ms)`);
    console.log(`CLS: ${metrics.cls?.toFixed(3)} (threshold: ${PERFORMANCE_THRESHOLDS.CLS})`);
    console.log(`FID: ${metrics.fid?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.FID}ms)`);
    console.log(`TTI: ${metrics.tti?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.TTI_3G}ms)`);
    console.groupEnd();

    console.group('Custom Metrics');
    console.log(`Three.js Frame Time: ${metrics.threeJsFrameTime?.toFixed(2)}ms`);
    console.log(`Three.js FPS: ${metrics.threeJsFps?.toFixed(2)}`);
    console.log(`JS Execution Time: ${metrics.jsExecutionTime?.toFixed(2)}ms`);
    console.log(`Resource Load Time: ${metrics.resourceLoadTime?.toFixed(2)}ms`);
    console.log(`Image Load Time: ${metrics.imageLoadTime?.toFixed(2)}ms`);
    console.groupEnd();

    console.group('Network');
    console.log(`Connection Type: ${metrics.connectionType || 'unknown'}`);
    console.log(`Effective Type: ${metrics.effectiveType || 'unknown'}`);
    console.groupEnd();

    console.group('Threshold Check');
    if (thresholdCheck.passed) {
      console.log('✅ All thresholds passed');
    } else {
      console.warn('❌ Some thresholds failed:');
      thresholdCheck.failures.forEach((failure) => console.warn(`  - ${failure}`));
    }
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * Send metrics to analytics endpoint
   * 将指标发送到分析端点
   */
  async sendToAnalytics(endpoint: string): Promise<void> {
    const metrics = this.getMetrics();
    
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Failed to send metrics to analytics:', error);
    }
  }

  /**
   * Cleanup observers
   * 清理观察器
   */
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.threeJsFrameTimes = [];
  }
}

/**
 * Singleton instance for global use
 * 单例实例供全局使用
 */
export const metricsCollector = new PerformanceMetricsCollector();

/**
 * Helper function to log performance metrics after page load
 * 辅助函数，在页面加载后记录性能指标
 */
export function logPerformanceMetrics(delay: number = 3000): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      metricsCollector.log();
    }, delay);
  });
}
