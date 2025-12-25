/**
 * Accessibility Utilities
 * 可访问性工具集
 * 
 * Feature: article-typography-enhancement
 * Requirements: 10.4, 10.5 - Keyboard navigation, screen reader compatibility, focus styles, color contrast
 */

/**
 * WCAG AA color contrast ratio threshold
 * WCAG AA 颜色对比度阈值
 */
export const WCAG_AA_CONTRAST_RATIO = 4.5;
export const WCAG_AA_LARGE_TEXT_RATIO = 3.0;

/**
 * Keyboard navigation keys
 * 键盘导航按键
 */
export const KEYBOARD_KEYS = {
  TAB: 'Tab',
  SHIFT: 'Shift',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Calculate relative luminance of a color
 * 计算颜色的相对亮度
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 * 解析十六进制颜色为 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * 计算两种颜色之间的对比度
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex format (#RRGGBB)');
  }

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG AA standards
 * 检查颜色对比度是否符合 WCAG AA 标准
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? WCAG_AA_LARGE_TEXT_RATIO : WCAG_AA_CONTRAST_RATIO;
  return ratio >= threshold;
}

/**
 * Trap focus within an element (for modals, dialogs)
 * 在元素内捕获焦点（用于模态框、对话框）
 */
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[] = [];
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.previouslyFocused = document.activeElement as HTMLElement;
    this.updateFocusableElements();
  }

  /**
   * Update list of focusable elements
   * 更新可聚焦元素列表
   */
  private updateFocusableElements(): void {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements = Array.from(
      this.element.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    this.firstFocusable = this.focusableElements[0] || null;
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  /**
   * Handle Tab key press
   * 处理 Tab 键按下
   */
  private handleTab(event: KeyboardEvent): void {
    if (event.key !== KEYBOARD_KEYS.TAB) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  }

  /**
   * Activate focus trap
   * 激活焦点捕获
   */
  activate(): void {
    this.element.addEventListener('keydown', this.handleTab.bind(this));
    this.firstFocusable?.focus();
  }

  /**
   * Deactivate focus trap and restore previous focus
   * 停用焦点捕获并恢复之前的焦点
   */
  deactivate(): void {
    this.element.removeEventListener('keydown', this.handleTab.bind(this));
    this.previouslyFocused?.focus();
  }
}

/**
 * Announce message to screen readers
 * 向屏幕阅读器宣布消息
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Add skip link for keyboard navigation
 * 添加跳过链接以便键盘导航
 */
export function addSkipLink(targetId: string, text: string = 'Skip to main content'): void {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = text;
  skipLink.setAttribute('aria-label', text);

  // Add styles
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  `;

  // Show on focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Ensure focus is visible (for :focus-visible polyfill)
 * 确保焦点可见（用于 :focus-visible polyfill）
 */
export function ensureFocusVisible(): void {
  let hadKeyboardEvent = false;
  let hadFocusVisibleRecently = false;
  let hadFocusVisibleRecentlyTimeout: NodeJS.Timeout | null = null;

  const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    'datetime-local': true,
  };

  function onKeyDown(e: KeyboardEvent) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }
    hadKeyboardEvent = true;
  }

  function onPointerDown() {
    hadKeyboardEvent = false;
  }

  function onFocus(e: FocusEvent) {
    const target = e.target as HTMLElement;

    if (
      hadKeyboardEvent ||
      target.matches(':focus-visible') ||
      (target instanceof HTMLInputElement &&
        inputTypesWhitelist[target.type as keyof typeof inputTypesWhitelist])
    ) {
      target.classList.add('focus-visible');
      hadFocusVisibleRecently = true;

      if (hadFocusVisibleRecentlyTimeout) {
        clearTimeout(hadFocusVisibleRecentlyTimeout);
      }

      hadFocusVisibleRecentlyTimeout = setTimeout(() => {
        hadFocusVisibleRecently = false;
      }, 100);
    }
  }

  function onBlur(e: FocusEvent) {
    const target = e.target as HTMLElement;
    target.classList.remove('focus-visible');
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
}

/**
 * Keyboard navigation helper
 * 键盘导航辅助器
 */
export class KeyboardNavigationHelper {
  private elements: HTMLElement[] = [];
  private currentIndex: number = -1;

  constructor(elements: HTMLElement[] | NodeListOf<HTMLElement>) {
    this.elements = Array.from(elements);
  }

  /**
   * Handle keyboard navigation
   * 处理键盘导航
   */
  handleKeyDown(event: KeyboardEvent): void {
    const { key } = event;

    switch (key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
      case KEYBOARD_KEYS.ARROW_RIGHT:
        event.preventDefault();
        this.focusNext();
        break;

      case KEYBOARD_KEYS.ARROW_UP:
      case KEYBOARD_KEYS.ARROW_LEFT:
        event.preventDefault();
        this.focusPrevious();
        break;

      case KEYBOARD_KEYS.HOME:
        event.preventDefault();
        this.focusFirst();
        break;

      case KEYBOARD_KEYS.END:
        event.preventDefault();
        this.focusLast();
        break;

      case KEYBOARD_KEYS.ENTER:
      case KEYBOARD_KEYS.SPACE:
        event.preventDefault();
        this.activateCurrent();
        break;
    }
  }

  /**
   * Focus next element
   * 聚焦下一个元素
   */
  private focusNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.elements[this.currentIndex]?.focus();
  }

  /**
   * Focus previous element
   * 聚焦上一个元素
   */
  private focusPrevious(): void {
    this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
    this.elements[this.currentIndex]?.focus();
  }

  /**
   * Focus first element
   * 聚焦第一个元素
   */
  private focusFirst(): void {
    this.currentIndex = 0;
    this.elements[this.currentIndex]?.focus();
  }

  /**
   * Focus last element
   * 聚焦最后一个元素
   */
  private focusLast(): void {
    this.currentIndex = this.elements.length - 1;
    this.elements[this.currentIndex]?.focus();
  }

  /**
   * Activate current element (click)
   * 激活当前元素（点击）
   */
  private activateCurrent(): void {
    this.elements[this.currentIndex]?.click();
  }

  /**
   * Update elements list
   * 更新元素列表
   */
  updateElements(elements: HTMLElement[] | NodeListOf<HTMLElement>): void {
    this.elements = Array.from(elements);
    this.currentIndex = -1;
  }
}

/**
 * Check if element is visible to screen readers
 * 检查元素对屏幕阅读器是否可见
 */
export function isAccessible(element: HTMLElement): boolean {
  // Check if element is hidden
  if (element.hidden || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  // Check if element has display: none or visibility: hidden
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  // Check if element has accessible name
  const hasAccessibleName =
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim();

  return !!hasAccessibleName;
}

/**
 * Add ARIA live region for dynamic content updates
 * 为动态内容更新添加 ARIA 实时区域
 */
export function createLiveRegion(
  priority: 'polite' | 'assertive' = 'polite'
): HTMLDivElement {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';

  document.body.appendChild(liveRegion);

  return liveRegion;
}

/**
 * Screen reader only CSS class
 * 仅屏幕阅读器可见的 CSS 类
 */
export const SR_ONLY_STYLES = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only-focusable:focus,
  .sr-only-focusable:active {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;

/**
 * Initialize accessibility features
 * 初始化可访问性功能
 */
export function initAccessibility(): void {
  // Add SR-only styles
  const style = document.createElement('style');
  style.textContent = SR_ONLY_STYLES;
  document.head.appendChild(style);

  // Ensure focus visible
  ensureFocusVisible();

  // Add skip link
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }
  if (mainContent?.id) {
    addSkipLink(mainContent.id);
  }
}
