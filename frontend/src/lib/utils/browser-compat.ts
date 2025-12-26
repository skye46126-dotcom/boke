/**
 * Browser Compatibility Utilities
 * 浏览器兼容性工具
 * 
 * Feature: article-typography-enhancement
 * Requirements: 6.3 - ES2020+ support, CSS Grid, IntersectionObserver, WebGL fallback
 */

/**
 * Feature detection results
 * 功能检测结果
 */
export interface BrowserFeatures {
  es2020: boolean;
  cssGrid: boolean;
  cssCustomProperties: boolean;
  intersectionObserver: boolean;
  webgl: boolean;
  requestAnimationFrame: boolean;
  requestIdleCallback: boolean;
  performanceObserver: boolean;
}

/**
 * Detect browser features
 * 检测浏览器功能
 */
export function detectBrowserFeatures(): BrowserFeatures {
  return {
    es2020: checkES2020Support(),
    cssGrid: checkCSSGridSupport(),
    cssCustomProperties: checkCSSCustomPropertiesSupport(),
    intersectionObserver: checkIntersectionObserverSupport(),
    webgl: checkWebGLSupport(),
    requestAnimationFrame: checkRAFSupport(),
    requestIdleCallback: checkIdleCallbackSupport(),
    performanceObserver: checkPerformanceObserverSupport(),
  };
}

/**
 * Check ES2020+ support
 * 检查 ES2020+ 支持
 */
function checkES2020Support(): boolean {
  try {
    // Check for optional chaining
    const obj: any = {};
    const test = obj?.prop?.nested;

    // Check for nullish coalescing
    const maybeNull: string | null = Math.random() > 2 ? null : 'value';
    const nullish: string = maybeNull ?? 'default';

    // Check for BigInt
    const bigInt = BigInt(9007199254740991);

    // Check for Promise.allSettled
    const hasAllSettled = typeof Promise.allSettled === 'function';

    // Check for String.prototype.matchAll
    const hasMatchAll = typeof String.prototype.matchAll === 'function';

    return hasAllSettled && hasMatchAll && bigInt !== undefined;
  } catch (e) {
    return false;
  }
}

/**
 * Check CSS Grid support
 * 检查 CSS Grid 支持
 */
function checkCSSGridSupport(): boolean {
  if (typeof window === 'undefined') return false;

  const element = document.createElement('div');
  element.style.display = 'grid';
  return element.style.display === 'grid';
}

/**
 * Check CSS Custom Properties support
 * 检查 CSS 自定义属性支持
 */
function checkCSSCustomPropertiesSupport(): boolean {
  if (typeof window === 'undefined') return false;

  return window.CSS && window.CSS.supports && window.CSS.supports('--test', '0');
}

/**
 * Check IntersectionObserver support
 * 检查 IntersectionObserver 支持
 */
function checkIntersectionObserverSupport(): boolean {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * Check WebGL support
 * 检查 WebGL 支持
 */
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Check requestAnimationFrame support
 * 检查 requestAnimationFrame 支持
 */
function checkRAFSupport(): boolean {
  return typeof window !== 'undefined' && 'requestAnimationFrame' in window;
}

/**
 * Check requestIdleCallback support
 * 检查 requestIdleCallback 支持
 */
function checkIdleCallbackSupport(): boolean {
  return typeof window !== 'undefined' && 'requestIdleCallback' in window;
}

/**
 * Check PerformanceObserver support
 * 检查 PerformanceObserver 支持
 */
function checkPerformanceObserverSupport(): boolean {
  return typeof window !== 'undefined' && 'PerformanceObserver' in window;
}

/**
 * Polyfill for requestAnimationFrame
 * requestAnimationFrame 的 polyfill
 */
export function polyfillRAF(): void {
  if (typeof window === 'undefined') return;

  if (!window.requestAnimationFrame) {
    let lastTime = 0;
    window.requestAnimationFrame = function (callback: FrameRequestCallback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id: number) {
      clearTimeout(id);
    };
  }
}

/**
 * Polyfill for requestIdleCallback
 * requestIdleCallback 的 polyfill
 */
export function polyfillIdleCallback(): void {
  if (typeof window === 'undefined') return;

  if (!window.requestIdleCallback) {
    window.requestIdleCallback = function (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) {
      const start = Date.now();
      return setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        });
      }, 1) as unknown as number;
    };
  }

  if (!window.cancelIdleCallback) {
    window.cancelIdleCallback = function (id: number) {
      clearTimeout(id);
    };
  }
}

/**
 * WebGL fallback handler
 * WebGL 降级处理器
 */
export class WebGLFallback {
  private hasWebGL: boolean;
  private fallbackElement: HTMLElement | null = null;

  constructor() {
    this.hasWebGL = checkWebGLSupport();
  }

  /**
   * Check if WebGL is supported
   * 检查是否支持 WebGL
   */
  isSupported(): boolean {
    return this.hasWebGL;
  }

  /**
   * Create fallback element for Three.js components
   * 为 Three.js 组件创建降级元素
   */
  createFallback(container: HTMLElement, options?: {
    message?: string;
    showIcon?: boolean;
  }): HTMLElement {
    const message = options?.message || 'WebGL is not supported in your browser';
    const showIcon = options?.showIcon !== false;

    const fallback = document.createElement('div');
    fallback.className = 'webgl-fallback';
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', message);

    fallback.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: var(--color-background-subtle, #f5f5f5);
      border: 1px solid var(--color-border, #d1d1d1);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      color: var(--color-text-secondary, #666);
    `;

    if (showIcon) {
      fallback.innerHTML = `
        <div>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style="margin-top: 12px; font-size: 14px;">${message}</p>
        </div>
      `;
    } else {
      fallback.textContent = message;
    }

    container.appendChild(fallback);
    this.fallbackElement = fallback;

    return fallback;
  }

  /**
   * Remove fallback element
   * 移除降级元素
   */
  removeFallback(): void {
    if (this.fallbackElement && this.fallbackElement.parentNode) {
      this.fallbackElement.parentNode.removeChild(this.fallbackElement);
      this.fallbackElement = null;
    }
  }
}

/**
 * IntersectionObserver polyfill (basic implementation)
 * IntersectionObserver polyfill（基本实现）
 */
export function polyfillIntersectionObserver(): void {
  if (typeof window === 'undefined') return;
  if ('IntersectionObserver' in window) return;

  // Basic polyfill using scroll events
  class IntersectionObserverPolyfill {
    private callback: IntersectionObserverCallback;
    private elements: Set<Element> = new Set();
    private options: IntersectionObserverInit;

    constructor(
      callback: IntersectionObserverCallback,
      options: IntersectionObserverInit = {}
    ) {
      this.callback = callback;
      this.options = options;

      // Use scroll event as fallback
      window.addEventListener('scroll', this.checkIntersections.bind(this), {
        passive: true,
      });
      window.addEventListener('resize', this.checkIntersections.bind(this), {
        passive: true,
      });
    }

    observe(element: Element): void {
      this.elements.add(element);
      this.checkIntersections();
    }

    unobserve(element: Element): void {
      this.elements.delete(element);
    }

    disconnect(): void {
      this.elements.clear();
    }

    private checkIntersections(): void {
      const entries: IntersectionObserverEntry[] = [];

      this.elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isIntersecting =
          rect.top < window.innerHeight && rect.bottom > 0;

        entries.push({
          target: element,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: rect,
          intersectionRect: rect,
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry);
      });

      if (entries.length > 0) {
        this.callback(entries, this as any);
      }
    }
  }

  (window as any).IntersectionObserver = IntersectionObserverPolyfill;
}

/**
 * CSS Grid fallback using flexbox
 * 使用 flexbox 的 CSS Grid 降级
 */
export function applyCSSGridFallback(): void {
  if (checkCSSGridSupport()) return;

  // Add fallback class to body
  document.body.classList.add('no-css-grid');

  // Add fallback styles
  const style = document.createElement('style');
  style.textContent = `
    .no-css-grid .article-layout-content {
      display: flex;
      flex-direction: column;
    }

    .no-css-grid .article-sidebar {
      order: -1;
      margin-bottom: 2rem;
    }

    @media (min-width: 1024px) {
      .no-css-grid .article-layout-content {
        flex-direction: row;
      }

      .no-css-grid .article-main {
        flex: 1;
      }

      .no-css-grid .article-sidebar {
        width: 280px;
        margin-left: 2rem;
        margin-bottom: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize all polyfills and fallbacks
 * 初始化所有 polyfills 和降级方案
 */
export function initBrowserCompat(): BrowserFeatures {
  const features = detectBrowserFeatures();

  // Apply polyfills
  if (!features.requestAnimationFrame) {
    polyfillRAF();
  }

  if (!features.requestIdleCallback) {
    polyfillIdleCallback();
  }

  if (!features.intersectionObserver) {
    polyfillIntersectionObserver();
  }

  if (!features.cssGrid) {
    applyCSSGridFallback();
  }

  // Log compatibility status
  if (process.env.NODE_ENV === 'development') {
    console.group('Browser Compatibility');
    console.log('ES2020+:', features.es2020 ? '✅' : '❌');
    console.log('CSS Grid:', features.cssGrid ? '✅' : '❌');
    console.log('CSS Custom Properties:', features.cssCustomProperties ? '✅' : '❌');
    console.log('IntersectionObserver:', features.intersectionObserver ? '✅' : '❌');
    console.log('WebGL:', features.webgl ? '✅' : '❌');
    console.log('RequestAnimationFrame:', features.requestAnimationFrame ? '✅' : '❌');
    console.log('RequestIdleCallback:', features.requestIdleCallback ? '✅' : '❌');
    console.log('PerformanceObserver:', features.performanceObserver ? '✅' : '❌');
    console.groupEnd();
  }

  return features;
}

/**
 * Singleton WebGL fallback instance
 * WebGL 降级单例实例
 */
export const webglFallback = new WebGLFallback();
