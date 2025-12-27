/**
 * 像素水墨风主页视觉验收测试
 * Visual Validation Tests for Pixel Ink Homepage
 * 
 * 测试内容：
 * - 像素肌理规范符合性检查
 * - 色彩精准度验证（误差≤±5 RGB）
 * - 布局参数精度检查（误差≤±2px）
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

// 模拟 DOM 环境
const mockDOM = () => {
  const mockElement = {
    getBoundingClientRect: () => ({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
    }),
    style: {},
    classList: {
      contains: (className: string) => true,
      add: (className: string) => {},
      remove: (className: string) => {},
    },
    getAttribute: (attr: string) => null,
    setAttribute: (attr: string, value: string) => {},
  };

  global.document = {
    querySelector: () => mockElement,
    querySelectorAll: () => [mockElement],
    createElement: () => mockElement,
    documentElement: mockElement,
  } as any;

  global.window = {
    getComputedStyle: () => ({
      getPropertyValue: (prop: string) => {
        const styleMap: Record<string, string> = {
          'border-width': '2px',
          'border-radius': '2px',
          'background-color': 'rgb(74, 122, 150)', // #4a7a96
          'color': 'rgb(245, 242, 239)', // #f5f2ef
          'width': '200px',
          'height': '200px',
        };
        return styleMap[prop] || '';
      },
    }),
    matchMedia: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  } as any;
};

describe('像素水墨风主页视觉验收测试', () => {
  beforeEach(() => {
    mockDOM();
  });

  afterEach(() => {
    // 清理
  });

  describe('像素肌理规范符合性检查', () => {
    test('边框宽度应符合像素规范', () => {
      const element = document.querySelector('.poker-card');
      const styles = window.getComputedStyle(element!);
      const borderWidth = styles.getPropertyValue('border-width');
      
      // 边框应为 1px 或 2px
      expect(['1px', '2px']).toContain(borderWidth);
    });

    test('圆角应符合像素规范', () => {
      const element = document.querySelector('.poker-card');
      const styles = window.getComputedStyle(element!);
      const borderRadius = styles.getPropertyValue('border-radius');
      
      // 圆角应为 2px
      expect(borderRadius).toBe('2px');
    });

    test('图片应使用像素化渲染', () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        const styles = window.getComputedStyle(img);
        const imageRendering = styles.getPropertyValue('image-rendering');
        
        // 应包含像素化渲染属性
        expect(['pixelated', '-moz-crisp-edges', 'crisp-edges']).toContain(imageRendering);
      });
    });
  });

  describe('色彩精准度验证', () => {
    // 核心色彩定义
    const coreColors = {
      stoneBlue: { r: 74, g: 122, b: 150 }, // #4a7a96
      ochre: { r: 140, g: 107, b: 72 }, // #8c6b48
      inkBlack: { r: 44, g: 44, b: 44 }, // #2c2c2c
      inkPaper: { r: 245, g: 242, b: 239 }, // #f5f2ef
      inkGray: { r: 102, g: 102, b: 102 }, // #666666
      vermillion: { r: 204, g: 85, b: 68 }, // #cc5544
    };

    const parseRGB = (rgbString: string) => {
      const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) return null;
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    };

    const colorDistance = (color1: any, color2: any) => {
      return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
      );
    };

    test('石青色精准度验证', () => {
      const element = document.querySelector('.stone-blue-element');
      const styles = window.getComputedStyle(element!);
      const bgColor = parseRGB(styles.getPropertyValue('background-color'));
      
      if (bgColor) {
        const distance = colorDistance(bgColor, coreColors.stoneBlue);
        // RGB 误差应≤±5
        expect(distance).toBeLessThanOrEqual(5);
      }
    });

    test('赭石色精准度验证', () => {
      const element = document.querySelector('.ochre-element');
      const styles = window.getComputedStyle(element!);
      const bgColor = parseRGB(styles.getPropertyValue('background-color'));
      
      if (bgColor) {
        const distance = colorDistance(bgColor, coreColors.ochre);
        expect(distance).toBeLessThanOrEqual(5);
      }
    });

    test('水墨黑色精准度验证', () => {
      const element = document.querySelector('.ink-black-element');
      const styles = window.getComputedStyle(element!);
      const bgColor = parseRGB(styles.getPropertyValue('background-color'));
      
      if (bgColor) {
        const distance = colorDistance(bgColor, coreColors.inkBlack);
        expect(distance).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('布局参数精度检查', () => {
    test('扑克牌尺寸精度验证', () => {
      const cardSizes = {
        small: { width: 150, height: 200 },
        medium: { width: 225, height: 300 },
        large: { width: 300, height: 400 },
      };

      Object.entries(cardSizes).forEach(([size, dimensions]) => {
        const element = document.querySelector(`.poker-card-${size}`);
        const rect = element?.getBoundingClientRect();
        
        if (rect) {
          // 误差应≤±2px
          expect(Math.abs(rect.width - dimensions.width)).toBeLessThanOrEqual(2);
          expect(Math.abs(rect.height - dimensions.height)).toBeLessThanOrEqual(2);
        }
      });
    });

    test('头像容器尺寸精度验证', () => {
      const avatarSizes = {
        desktop: { width: 200, height: 200 },
        tablet: { width: 160, height: 180 },
        mobile: { width: 120, height: 140 },
      };

      // 模拟不同屏幕尺寸
      Object.entries(avatarSizes).forEach(([device, dimensions]) => {
        const element = document.querySelector('.avatar-circle');
        const rect = element?.getBoundingClientRect();
        
        if (rect) {
          expect(Math.abs(rect.width - dimensions.width)).toBeLessThanOrEqual(2);
          expect(Math.abs(rect.height - dimensions.height)).toBeLessThanOrEqual(2);
        }
      });
    });

    test('侧边栏宽度精度验证', () => {
      const sidebar = document.querySelector('.sidebar');
      const rect = sidebar?.getBoundingClientRect();
      
      if (rect) {
        // 侧边栏宽度应为 240px
        expect(Math.abs(rect.width - 240)).toBeLessThanOrEqual(2);
      }
    });

    test('象限布局精度验证', () => {
      const quadrants = document.querySelectorAll('.quadrant');
      
      quadrants.forEach((quadrant, index) => {
        const rect = quadrant.getBoundingClientRect();
        
        // 检查象限是否在正确位置
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);
      });
    });
  });

  describe('响应式布局验证', () => {
    test('移动端布局适配验证', () => {
      // 模拟移动端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const mainContent = document.querySelector('.homepage-main');
      const styles = window.getComputedStyle(mainContent!);
      const paddingLeft = styles.getPropertyValue('padding-left');
      
      // 移动端应该没有左边距
      expect(paddingLeft).toBe('0px');
    });

    test('平板端布局适配验证', () => {
      // 模拟平板端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      const mainContent = document.querySelector('.homepage-main');
      const styles = window.getComputedStyle(mainContent!);
      const paddingLeft = styles.getPropertyValue('padding-left');
      
      // 平板端应该有 200px 左边距
      expect(paddingLeft).toBe('200px');
    });

    test('桌面端布局适配验证', () => {
      // 模拟桌面端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const mainContent = document.querySelector('.homepage-main');
      const styles = window.getComputedStyle(mainContent!);
      const paddingLeft = styles.getPropertyValue('padding-left');
      
      // 桌面端应该有 240px 左边距
      expect(paddingLeft).toBe('240px');
    });
  });

  describe('主题适配验证', () => {
    test('深色主题色彩验证', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      
      const element = document.querySelector('.pixel-ink-homepage');
      const styles = window.getComputedStyle(element!);
      const bgColor = styles.getPropertyValue('background-color');
      
      // 深色主题应使用水墨黑背景
      expect(bgColor).toContain('44'); // #2c2c2c 的 RGB 值
    });

    test('浅色主题色彩验证', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      
      const element = document.querySelector('.pixel-ink-homepage');
      const styles = window.getComputedStyle(element!);
      const bgColor = styles.getPropertyValue('background-color');
      
      // 浅色主题应使用水墨纸背景
      expect(bgColor).toContain('245'); // #f5f2ef 的 RGB 值
    });
  });
});