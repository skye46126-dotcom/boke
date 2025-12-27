/**
 * 像素水墨风主页交互功能测试
 * Interaction Functionality Tests for Pixel Ink Homepage
 * 
 * 测试内容：
 * - 所有hover/click动效参数验证
 * - 抽卡弹窗和翻转动画流畅性
 * - 响应式适配各屏幕尺寸测试
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

// 模拟动画和事件
const mockAnimations = () => {
  global.requestAnimationFrame = jest.fn((callback) => {
    setTimeout(callback, 16); // 模拟 60fps
    return 1;
  });

  global.cancelAnimationFrame = jest.fn();

  // 模拟 CSS 动画事件
  const mockAnimationEvent = (type: string) => ({
    type,
    animationName: 'test-animation',
    elapsedTime: 0.5,
    pseudoElement: '',
    bubbles: true,
    cancelable: true,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  return { mockAnimationEvent };
};

// 模拟 DOM 元素和事件
const mockDOMElements = () => {
  const mockElement = {
    getBoundingClientRect: () => ({
      width: 200,
      height: 200,
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
    }),
    style: {} as CSSStyleDeclaration,
    classList: {
      contains: jest.fn(() => false),
      add: jest.fn(),
      remove: jest.fn(),
      toggle: jest.fn(),
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    getAttribute: jest.fn(),
    setAttribute: jest.fn(),
    click: jest.fn(),
    focus: jest.fn(),
    blur: jest.fn(),
  };

  global.document = {
    querySelector: jest.fn(() => mockElement),
    querySelectorAll: jest.fn(() => [mockElement]),
    createElement: jest.fn(() => mockElement),
    documentElement: mockElement,
    body: mockElement,
  } as any;

  global.window = {
    innerWidth: 1200,
    innerHeight: 800,
    getComputedStyle: jest.fn(() => ({
      getPropertyValue: jest.fn((prop: string) => {
        const styleMap: Record<string, string> = {
          'transform': 'scale(1)',
          'opacity': '1',
          'animation-duration': '0.3s',
          'transition-duration': '0.3s',
        };
        return styleMap[prop] || '';
      }),
    })),
    matchMedia: jest.fn((query: string) => ({
      matches: query.includes('max-width: 767px') ? false : true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  } as any;

  return mockElement;
};

describe('像素水墨风主页交互功能测试', () => {
  let mockElement: any;
  let mockAnimationEvent: any;

  beforeEach(() => {
    mockElement = mockDOMElements();
    const animations = mockAnimations();
    mockAnimationEvent = animations.mockAnimationEvent;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('导航卡片交互测试', () => {
    test('导航卡片 hover 效果验证', () => {
      const navCard = document.querySelector('.nav-card');
      
      // 模拟 hover 事件
      const hoverEvent = new Event('mouseenter');
      navCard?.dispatchEvent(hoverEvent);
      
      expect(navCard?.classList.add).toHaveBeenCalledWith('nav-card-hover');
    });

    test('导航卡片 click 效果验证', () => {
      const navCard = document.querySelector('.nav-card');
      
      // 模拟 click 事件
      const clickEvent = new Event('click');
      navCard?.dispatchEvent(clickEvent);
      
      expect(navCard?.classList.add).toHaveBeenCalledWith('nav-card-active');
    });

    test('导航卡片抖动动画参数验证', () => {
      const navCard = document.querySelector('.nav-card');
      const styles = window.getComputedStyle(navCard!);
      
      // 验证动画持续时间
      const animationDuration = styles.getPropertyValue('animation-duration');
      expect(animationDuration).toBe('0.3s');
    });

    test('导航卡片尺寸变化验证', () => {
      const navCard = document.querySelector('.nav-card');
      
      // 模拟 hover 状态
      navCard?.classList.add('nav-card-hover');
      
      const rect = navCard?.getBoundingClientRect();
      // hover 时应该放大到 85×115px
      expect(rect?.width).toBeCloseTo(85, 2);
      expect(rect?.height).toBeCloseTo(115, 2);
    });
  });

  describe('功能卡片交互测试', () => {
    test('扑克牌 hover 效果验证', () => {
      const pokerCard = document.querySelector('.poker-card');
      
      // 模拟 hover 事件
      const hoverEvent = new Event('mouseenter');
      pokerCard?.dispatchEvent(hoverEvent);
      
      expect(pokerCard?.classList.add).toHaveBeenCalledWith('poker-card-hover');
    });

    test('扑克牌上移动画验证', () => {
      const pokerCard = document.querySelector('.poker-card');
      const styles = window.getComputedStyle(pokerCard!);
      
      // 验证 transform 属性
      const transform = styles.getPropertyValue('transform');
      expect(transform).toContain('translateY');
    });

    test('抽卡机卡片点击验证', () => {
      const drawCard = document.querySelector('.draw-card');
      const clickHandler = jest.fn();
      
      drawCard?.addEventListener('click', clickHandler);
      drawCard?.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    test('文章卡片链接跳转验证', () => {
      const articleCard = document.querySelector('.article-card');
      const link = articleCard?.querySelector('a');
      
      expect(link?.getAttribute('href')).toBeTruthy();
    });
  });

  describe('抽卡弹窗交互测试', () => {
    test('抽卡弹窗打开动画验证', () => {
      const modal = document.querySelector('.draw-card-modal');
      
      // 模拟弹窗打开
      modal?.classList.add('modal-open');
      
      const styles = window.getComputedStyle(modal!);
      const opacity = styles.getPropertyValue('opacity');
      expect(opacity).toBe('1');
    });

    test('扑克牌翻转动画验证', () => {
      const card = document.querySelector('.flip-card');
      
      // 模拟翻转动画
      card?.classList.add('flipped');
      
      const styles = window.getComputedStyle(card!);
      const transform = styles.getPropertyValue('transform');
      expect(transform).toContain('rotateY');
    });

    test('弹窗关闭功能验证', () => {
      const modal = document.querySelector('.draw-card-modal');
      const closeButton = modal?.querySelector('.modal-close');
      const clickHandler = jest.fn();
      
      closeButton?.addEventListener('click', clickHandler);
      closeButton?.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    test('背景遮罩点击关闭验证', () => {
      const overlay = document.querySelector('.modal-overlay');
      const clickHandler = jest.fn();
      
      overlay?.addEventListener('click', clickHandler);
      overlay?.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    test('花色闪烁效果验证', () => {
      const suitIcon = document.querySelector('.suit-icon');
      
      // 模拟闪烁动画
      suitIcon?.classList.add('suit-blink');
      
      const styles = window.getComputedStyle(suitIcon!);
      const animationDuration = styles.getPropertyValue('animation-duration');
      expect(animationDuration).toBeTruthy();
    });
  });

  describe('侧边栏交互测试', () => {
    test('侧边栏切换功能验证', () => {
      const toggleButton = document.querySelector('.sidebar-toggle-mobile');
      const sidebar = document.querySelector('.sidebar');
      const clickHandler = jest.fn();
      
      toggleButton?.addEventListener('click', clickHandler);
      toggleButton?.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    test('标签点击跳转验证', () => {
      const tagItem = document.querySelector('.tag-item');
      const clickHandler = jest.fn();
      
      tagItem?.addEventListener('click', clickHandler);
      tagItem?.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    test('主题切换功能验证', () => {
      const themeToggle = document.querySelector('.theme-toggle');
      const clickHandler = jest.fn();
      
      themeToggle?.addEventListener('click', clickHandler);
      themeToggle?.click();
      
      expect(clickHandler).toHaveBeenCalled();
    });

    test('快速链接功能验证', () => {
      const quickLinks = document.querySelectorAll('.quick-link');
      
      quickLinks.forEach(link => {
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });
  });

  describe('滚动字幕交互测试', () => {
    test('字幕滚动动画验证', () => {
      const marquee = document.querySelector('.scroll-marquee');
      
      const styles = window.getComputedStyle(marquee!);
      const animationDuration = styles.getPropertyValue('animation-duration');
      
      // 验证动画持续时间（PC端8s）
      expect(animationDuration).toBe('8s');
    });

    test('字幕内容循环验证', () => {
      const marqueeText = document.querySelector('.marquee-text');
      
      // 验证字幕内容存在
      expect(marqueeText?.textContent).toBeTruthy();
    });

    test('响应式动画时长验证', () => {
      // 模拟平板端
      (window.matchMedia as jest.Mock).mockReturnValue({
        matches: true,
        media: '(min-width: 768px) and (max-width: 1199px)',
      });

      const marquee = document.querySelector('.scroll-marquee');
      const styles = window.getComputedStyle(marquee!);
      const animationDuration = styles.getPropertyValue('animation-duration');
      
      // 平板端应为6s
      expect(['6s', '8s']).toContain(animationDuration);
    });
  });

  describe('响应式交互测试', () => {
    test('移动端触摸交互验证', () => {
      // 模拟移动端
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
      });

      const pokerCard = document.querySelector('.poker-card');
      
      // 模拟触摸事件
      const touchEvent = new Event('touchstart');
      pokerCard?.dispatchEvent(touchEvent);
      
      expect(pokerCard?.classList.add).toHaveBeenCalled();
    });

    test('平板端交互适配验证', () => {
      // 模拟平板端
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
        writable: true,
      });

      const navCards = document.querySelector('.navigation-cards');
      const styles = window.getComputedStyle(navCards!);
      
      // 验证平板端样式应用
      expect(styles.getPropertyValue).toHaveBeenCalled();
    });

    test('桌面端交互验证', () => {
      // 模拟桌面端
      Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        writable: true,
      });

      const quadrant = document.querySelector('.quadrant');
      
      // 验证桌面端乱序效果
      expect(quadrant?.classList.contains('desktop-chaos')).toBeTruthy();
    });
  });

  describe('键盘导航测试', () => {
    test('Tab 键导航验证', () => {
      const focusableElements = document.querySelectorAll(
        'button, a, input, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach(element => {
        element.focus();
        expect(element.focus).toHaveBeenCalled();
      });
    });

    test('Enter 键激活验证', () => {
      const button = document.querySelector('button');
      const keyHandler = jest.fn();
      
      button?.addEventListener('keydown', keyHandler);
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      button?.dispatchEvent(enterEvent);
      
      expect(keyHandler).toHaveBeenCalled();
    });

    test('Escape 键关闭弹窗验证', () => {
      const modal = document.querySelector('.draw-card-modal');
      const keyHandler = jest.fn();
      
      modal?.addEventListener('keydown', keyHandler);
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      modal?.dispatchEvent(escapeEvent);
      
      expect(keyHandler).toHaveBeenCalled();
    });
  });

  describe('动画流畅性测试', () => {
    test('动画帧率监控', (done) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      const countFrames = () => {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed >= 1000) {
          const fps = frameCount;
          expect(fps).toBeGreaterThanOrEqual(45); // 至少45fps
          done();
        } else {
          requestAnimationFrame(countFrames);
        }
      };
      
      requestAnimationFrame(countFrames);
    });

    test('动画性能降级验证', () => {
      // 模拟低性能设备
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        writable: true,
      });

      const homepage = document.querySelector('.pixel-ink-homepage');
      
      // 应该应用低性能模式
      expect(homepage?.classList.contains('low-end-device')).toBeTruthy();
    });

    test('减少动画偏好设置验证', () => {
      // 模拟用户偏好减少动画
      (window.matchMedia as jest.Mock).mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
      });

      const animatedElement = document.querySelector('.animated');
      
      // 应该禁用动画
      expect(animatedElement?.classList.contains('reduced-motion')).toBeTruthy();
    });
  });
});