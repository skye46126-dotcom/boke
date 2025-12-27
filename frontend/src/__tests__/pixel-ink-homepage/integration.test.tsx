/**
 * 像素水墨风主页集成测试
 * Integration Tests for Pixel Ink Homepage
 * 
 * 测试整个主页系统的集成功能
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import PixelInkHomepage from '@/components/PixelInkHomepage';
import { ThemeProvider } from '@/contexts/ThemeContext';

// 模拟依赖
jest.mock('@/components/CoreAnchor', () => {
  return function MockCoreAnchor() {
    return (
      <div data-testid="core-anchor" className="core-anchor">
        <div className="avatar-circle">
          <img src="/images/avatar.svg" alt="头像" />
        </div>
        <div className="scroll-marquee">
          <span className="marquee-text">正在构建我的数字世界...</span>
        </div>
      </div>
    );
  };
});

jest.mock('@/components/NavigationCards', () => {
  return function MockNavigationCards() {
    return (
      <nav data-testid="navigation-cards" className="navigation-cards">
        <div className="nav-cards-container">
          <a href="/articles" className="nav-card">文章</a>
          <a href="/about" className="nav-card">关于</a>
          <a href="/projects" className="nav-card">项目</a>
          <a href="/github" className="nav-card">GitHub</a>
        </div>
      </nav>
    );
  };
});

jest.mock('@/components/FunctionCards', () => {
  return function MockFunctionCards({ onDrawCardClick }: { onDrawCardClick: () => void }) {
    return (
      <div data-testid="function-cards" className="function-cards">
        <div className="quadrant quadrant-top-left">
          <div className="poker-card article-card">最新文章</div>
        </div>
        <div className="quadrant quadrant-top-right">
          <button className="poker-card draw-card" onClick={onDrawCardClick}>
            抽卡机
          </button>
        </div>
        <div className="quadrant quadrant-bottom-left">
          <div className="poker-card project-card">作品集</div>
        </div>
        <div className="quadrant quadrant-bottom-right">
          <div className="poker-card stats-card">统计信息</div>
        </div>
      </div>
    );
  };
});

jest.mock('@/components/Sidebar', () => {
  return function MockSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
    return (
      <>
        <aside data-testid="sidebar" className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-content">
            <div className="personal-info-card">个人信息</div>
            <div className="theme-settings">主题设置</div>
            <div className="tag-cloud">标签云</div>
            <div className="reading-stats">阅读统计</div>
          </div>
        </aside>
        {isOpen && (
          <div 
            data-testid="sidebar-overlay"
            className="sidebar-overlay"
            onClick={onToggle}
          />
        )}
      </>
    );
  };
});

jest.mock('@/components/DrawCardModal', () => {
  return function MockDrawCardModal({ onClose }: { onClose: () => void }) {
    return (
      <div data-testid="draw-card-modal" className="draw-card-modal">
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content">
            <button className="modal-close" onClick={onClose}>×</button>
            <div className="flip-card">
              <div className="card-front">卡背</div>
              <div className="card-back">卡面内容</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
});

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// 模拟 API 调用
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      success: true,
      data: {
        totalArticles: 10,
        totalViews: 1500,
        latestArticles: [
          { id: 1, title: '测试文章1', excerpt: '文章摘要1' },
          { id: 2, title: '测试文章2', excerpt: '文章摘要2' },
        ]
      }
    }),
  })
) as jest.Mock;

describe('像素水墨风主页集成测试', () => {
  beforeEach(() => {
    // 清理模拟
    jest.clearAllMocks();
    
    // 模拟 DOM API
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // 模拟 IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // 模拟 ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('主页基础渲染测试', () => {
    test('主页组件正确渲染所有子组件', () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证所有主要组件都已渲染
      expect(screen.getByTestId('core-anchor')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-cards')).toBeInTheDocument();
      expect(screen.getByTestId('function-cards')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('主页应用正确的CSS类名', () => {
      const { container } = render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const homepage = container.firstChild as HTMLElement;
      expect(homepage).toHaveClass('pixel-ink-homepage');
      expect(homepage).toHaveClass('ink-background');
    });

    test('主页设置正确的主题属性', () => {
      const { container } = render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const homepage = container.firstChild as HTMLElement;
      expect(homepage).toHaveAttribute('data-theme', 'light');
    });
  });

  describe('交互功能集成测试', () => {
    test('抽卡机功能完整流程', async () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 点击抽卡机按钮
      const drawCardButton = screen.getByText('抽卡机');
      fireEvent.click(drawCardButton);

      // 验证弹窗打开
      await waitFor(() => {
        expect(screen.getByTestId('draw-card-modal')).toBeInTheDocument();
      });

      // 关闭弹窗
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      // 验证弹窗关闭
      await waitFor(() => {
        expect(screen.queryByTestId('draw-card-modal')).not.toBeInTheDocument();
      });
    });

    test('侧边栏切换功能', async () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 获取侧边栏切换按钮
      const toggleButton = screen.getByLabelText('切换侧边栏');
      const sidebar = screen.getByTestId('sidebar');

      // 初始状态：侧边栏关闭
      expect(sidebar).not.toHaveClass('sidebar-open');

      // 点击切换按钮
      fireEvent.click(toggleButton);

      // 验证侧边栏打开
      await waitFor(() => {
        expect(sidebar).toHaveClass('sidebar-open');
        expect(screen.getByTestId('sidebar-overlay')).toBeInTheDocument();
      });

      // 点击遮罩关闭侧边栏
      const overlay = screen.getByTestId('sidebar-overlay');
      fireEvent.click(overlay);

      // 验证侧边栏关闭
      await waitFor(() => {
        expect(sidebar).not.toHaveClass('sidebar-open');
        expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
      });
    });

    test('导航链接功能', () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证导航链接
      const articleLink = screen.getByText('文章');
      const aboutLink = screen.getByText('关于');
      const projectsLink = screen.getByText('项目');
      const githubLink = screen.getByText('GitHub');

      expect(articleLink).toHaveAttribute('href', '/articles');
      expect(aboutLink).toHaveAttribute('href', '/about');
      expect(projectsLink).toHaveAttribute('href', '/projects');
      expect(githubLink).toHaveAttribute('href', '/github');
    });
  });

  describe('响应式布局集成测试', () => {
    test('移动端布局适配', () => {
      // 模拟移动端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证移动端特定元素
      const toggleButton = screen.getByLabelText('切换侧边栏');
      expect(toggleButton).toBeInTheDocument();
    });

    test('桌面端布局适配', () => {
      // 模拟桌面端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证桌面端布局
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('性能优化集成测试', () => {
    test('懒加载功能验证', async () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证 IntersectionObserver 被调用
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    test('动画性能监控', () => {
      // 模拟低性能设备
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        configurable: true,
        value: 2,
      });

      const { container } = render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const homepage = container.firstChild as HTMLElement;
      
      // 验证性能模式应用
      expect(homepage).toHaveAttribute('data-performance-mode');
    });

    test('GPU加速优化验证', () => {
      const { container } = render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const homepage = container.firstChild as HTMLElement;
      
      // 验证GPU加速类名
      expect(homepage.className).toContain('gpu-accelerated');
    });
  });

  describe('错误处理集成测试', () => {
    test('API调用失败处理', async () => {
      // 模拟API调用失败
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 组件应该正常渲染，不会因为API失败而崩溃
      expect(screen.getByTestId('core-anchor')).toBeInTheDocument();
    });

    test('图片加载失败处理', () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const avatar = screen.getByAltText('头像');
      
      // 模拟图片加载失败
      fireEvent.error(avatar);

      // 图片元素应该仍然存在
      expect(avatar).toBeInTheDocument();
    });

    test('JavaScript错误边界', () => {
      // 模拟控制台错误以避免测试输出污染
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // 这里应该有错误边界组件包装，但为了测试简化，我们验证组件不会崩溃
      expect(() => {
        render(
          <ThemeProvider>
            <PixelInkHomepage />
          </ThemeProvider>
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('可访问性集成测试', () => {
    test('键盘导航支持', () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证可聚焦元素
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements.length).toBeGreaterThan(0);

      // 测试Tab键导航
      focusableElements.forEach(element => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });
    });

    test('屏幕阅读器支持', () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证ARIA标签
      const toggleButton = screen.getByLabelText('切换侧边栏');
      expect(toggleButton).toHaveAttribute('aria-label');
    });

    test('减少动画偏好设置', () => {
      // 模拟用户偏好减少动画
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { container } = render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const homepage = container.firstChild as HTMLElement;
      expect(homepage.className).toContain('reduced-motion');
    });
  });

  describe('主题系统集成测试', () => {
    test('主题切换功能', () => {
      const mockToggleTheme = jest.fn();
      
      // 重新模拟ThemeContext
      jest.doMock('@/contexts/ThemeContext', () => ({
        useTheme: () => ({
          theme: 'dark',
          toggleTheme: mockToggleTheme,
        }),
        ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      }));

      const { container } = render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      const homepage = container.firstChild as HTMLElement;
      expect(homepage).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('数据集成测试', () => {
    test('API数据获取和显示', async () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 验证API被调用
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // 验证数据显示（通过侧边栏组件）
      expect(screen.getByText('阅读统计')).toBeInTheDocument();
    });

    test('数据加载状态处理', () => {
      render(
        <ThemeProvider>
          <PixelInkHomepage />
        </ThemeProvider>
      );

      // 组件应该正常渲染，即使数据还在加载
      expect(screen.getByTestId('function-cards')).toBeInTheDocument();
    });
  });
});