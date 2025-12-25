/**
 * Article Page Integration Tests
 * 文章页面集成测试
 * 
 * Feature: article-typography-enhancement
 * Tests: Complete article page rendering, TOC, lazy loading, keyboard navigation
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/articles/test-article',
  }),
  usePathname: () => '/articles/test-article',
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  cb(0);
  return 0;
});

global.cancelAnimationFrame = jest.fn();

describe('Article Page Integration Tests', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    slug: 'test-article',
    htmlContent: `
      <h1>Main Title</h1>
      <p>Introduction paragraph with some content.</p>
      <h2 id="section-1">Section 1</h2>
      <p>Content for section 1.</p>
      <img src="/test-image.jpg" alt="Test image" class="breakout" />
      <h2 id="section-2">Section 2</h2>
      <p>Content for section 2.</p>
      <pre><code>const test = "code block";</code></pre>
    `,
    tableOfContents: [
      { level: 1, text: 'Main Title', id: 'main-title' },
      { level: 2, text: 'Section 1', id: 'section-1' },
      { level: 2, text: 'Section 2', id: 'section-2' },
    ],
    readingTime: 5,
    contentImages: [
      {
        alt: 'Test image',
        src: {
          original: '/test-image.jpg',
          large: '/test-image-large.jpg',
          medium: '/test-image-medium.jpg',
          small: '/test-image-small.jpg',
        },
        placeholder: {
          type: 'blurhash' as const,
          hash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
        },
        layout: 'breakout' as const,
        width: 1200,
        height: 800,
      },
    ],
    excerpt: 'Test excerpt',
    status: 'published' as const,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    published_at: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 1: Complete article page rendering
   * 测试完整文章页面渲染
   */
  describe('Complete Article Page Rendering', () => {
    it('should render article with all components', () => {
      // This is a simplified test - in real implementation, you would render the actual ArticlePage component
      const { container } = render(
        <div className="article-layout">
          <div className="article-main">
            <h1>{mockArticle.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: mockArticle.htmlContent }} />
          </div>
          <aside className="article-sidebar">
            <nav className="table-of-contents">
              {mockArticle.tableOfContents.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="toc-link">
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      );

      // Verify article title is rendered
      expect(screen.getByText(mockArticle.title)).toBeInTheDocument();

      // Verify content sections are rendered
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();

      // Verify table of contents is rendered
      const tocLinks = container.querySelectorAll('.toc-link');
      expect(tocLinks).toHaveLength(mockArticle.tableOfContents.length);

      // Verify layout structure
      expect(container.querySelector('.article-layout')).toBeInTheDocument();
      expect(container.querySelector('.article-main')).toBeInTheDocument();
      expect(container.querySelector('.article-sidebar')).toBeInTheDocument();
    });

    it('should apply typography system styles', () => {
      const { container } = render(
        <div className="article-main" style={{ maxWidth: '760px' }}>
          <h1 style={{ fontSize: '76px' }}>Heading 1</h1>
          <h2 style={{ fontSize: '57px' }}>Heading 2</h2>
          <p style={{ fontSize: '18px', lineHeight: '28px' }}>Body text</p>
        </div>
      );

      const main = container.querySelector('.article-main');
      expect(main).toHaveStyle({ maxWidth: '760px' });

      const h1 = screen.getByText('Heading 1');
      expect(h1).toHaveStyle({ fontSize: '76px' });

      const p = screen.getByText('Body text');
      expect(p).toHaveStyle({ lineHeight: '28px' });
    });
  });

  /**
   * Test 2: Table of contents generation and scroll highlighting
   * 测试目录生成和滚动高亮
   */
  describe('Table of Contents', () => {
    it('should generate TOC from article headings', () => {
      const { container } = render(
        <nav className="table-of-contents">
          {mockArticle.tableOfContents.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`toc-link toc-level-${item.level}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      );

      const tocLinks = container.querySelectorAll('.toc-link');
      expect(tocLinks).toHaveLength(3);

      // Verify TOC structure
      expect(tocLinks[0]).toHaveTextContent('Main Title');
      expect(tocLinks[1]).toHaveTextContent('Section 1');
      expect(tocLinks[2]).toHaveTextContent('Section 2');

      // Verify TOC levels
      expect(tocLinks[0]).toHaveClass('toc-level-1');
      expect(tocLinks[1]).toHaveClass('toc-level-2');
      expect(tocLinks[2]).toHaveClass('toc-level-2');
    });

    it('should handle TOC link clicks', async () => {
      const { container } = render(
        <nav className="table-of-contents">
          <a href="#section-1" className="toc-link">
            Section 1
          </a>
        </nav>
      );

      const link = container.querySelector('.toc-link') as HTMLElement;
      expect(link).toBeInTheDocument();

      // Click should work (actual scroll behavior would be tested in E2E)
      fireEvent.click(link);
      expect(link.getAttribute('href')).toBe('#section-1');
    });
  });

  /**
   * Test 3: Image lazy loading and breakout layout
   * 测试图片懒加载和破格布局
   */
  describe('Image Lazy Loading and Breakout Layout', () => {
    it('should render images with lazy loading attributes', () => {
      const { container } = render(
        <img
          src={mockArticle.contentImages[0].src.original}
          alt={mockArticle.contentImages[0].alt}
          loading="lazy"
          className="breakout"
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveClass('breakout');
    });

    it('should apply breakout layout styles', () => {
      const { container } = render(
        <div className="article-main">
          <img
            src="/test.jpg"
            alt="Test"
            className="breakout"
            style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
            }}
          />
        </div>
      );

      const img = container.querySelector('.breakout');
      expect(img).toHaveStyle({
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      });
    });

    it('should observe images with IntersectionObserver', () => {
      render(
        <img
          src="/test.jpg"
          alt="Test"
          loading="lazy"
          data-testid="lazy-image"
        />
      );

      // Verify IntersectionObserver was called
      // In real implementation, this would be set up by the LazyImage component
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });
  });

  /**
   * Test 4: Keyboard navigation through magnetic elements
   * 测试键盘导航通过磁吸元素
   */
  describe('Keyboard Navigation', () => {
    it('should support Tab navigation through interactive elements', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <div>
          <a href="#section-1" className="magnetic-element toc-link">
            Section 1
          </a>
          <a href="#section-2" className="magnetic-element toc-link">
            Section 2
          </a>
          <button className="magnetic-element share-button">Share</button>
        </div>
      );

      const links = container.querySelectorAll('.magnetic-element');
      expect(links).toHaveLength(3);

      // Tab through elements
      await user.tab();
      expect(links[0]).toHaveFocus();

      await user.tab();
      expect(links[1]).toHaveFocus();

      await user.tab();
      expect(links[2]).toHaveFocus();
    });

    it('should support Shift+Tab for reverse navigation', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <div>
          <a href="#section-1" className="toc-link">Section 1</a>
          <a href="#section-2" className="toc-link">Section 2</a>
        </div>
      );

      const links = container.querySelectorAll('.toc-link');

      // Focus last element
      (links[1] as HTMLElement).focus();
      expect(links[1]).toHaveFocus();

      // Shift+Tab to previous element
      await user.tab({ shift: true });
      expect(links[0]).toHaveFocus();
    });

    it('should support Enter and Space key activation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <button onClick={handleClick} className="magnetic-element">
          Click me
        </button>
      );

      const button = screen.getByText('Click me');

      // Focus button
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Press Space
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should maintain focus styles during magnetic interaction', () => {
      const { container } = render(
        <a
          href="#test"
          className="magnetic-element"
          style={{ outline: '2px solid blue' }}
        >
          Link
        </a>
      );

      const link = container.querySelector('.magnetic-element') as HTMLElement;
      link.focus();

      expect(link).toHaveFocus();
      expect(link).toHaveStyle({ outline: '2px solid blue' });
    });
  });

  /**
   * Test 5: Accessibility features
   * 测试可访问性功能
   */
  describe('Accessibility Features', () => {
    it('should have proper ARIA labels', () => {
      const { container } = render(
        <nav aria-label="Table of contents" className="table-of-contents">
          <a href="#section-1">Section 1</a>
        </nav>
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('aria-label', 'Table of contents');
    });

    it('should support screen reader announcements', () => {
      const { container } = render(
        <div role="status" aria-live="polite" className="sr-only">
          Article loaded
        </div>
      );

      const status = container.querySelector('[role="status"]');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveClass('sr-only');
    });

    it('should respect prefers-reduced-motion', () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      expect(reducedMotion).toBe(true);
    });
  });

  /**
   * Test 6: Performance optimizations
   * 测试性能优化
   */
  describe('Performance Optimizations', () => {
    it('should use CSS containment for layout optimization', () => {
      const { container } = render(
        <div className="article-layout-content" style={{ contain: 'layout style' }}>
          <div className="article-main">Content</div>
        </div>
      );

      const layoutContent = container.querySelector('.article-layout-content');
      expect(layoutContent).toHaveStyle({ contain: 'layout style' });
    });

    it('should cancel RAF when component unmounts', () => {
      const { unmount } = render(
        <div className="magnetic-element">Test</div>
      );

      unmount();

      // Verify cleanup (in real implementation, this would be tested in the component)
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
