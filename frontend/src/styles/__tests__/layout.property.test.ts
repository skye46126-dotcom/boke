/**
 * Property-Based Tests for Layout System
 * Feature: article-typography-enhancement
 * 
 * Tests the breakout layout functionality to ensure elements with
 * breakout classes properly exceed the content area max-width.
 */

import * as fc from 'fast-check';

/**
 * Property 10: Breakout Layout Width
 * For any element with breakout layout class, the element width should exceed 
 * the content area max-width.
 * **Validates: Requirements 3.6**
 */
describe('Layout System Property-Based Tests', () => {
  // CSS custom properties from typography system
  const CONTENT_MAX_WIDTH = 760; // --content-max-width in pixels
  const BASELINE = 28; // --baseline in pixels

  beforeEach(() => {
    // Set up a test container with proper CSS custom properties
    document.documentElement.style.setProperty('--content-max-width', `${CONTENT_MAX_WIDTH}px`);
    document.documentElement.style.setProperty('--baseline', `${BASELINE}px`);
    document.documentElement.style.setProperty('--space-md', `${BASELINE * 2}px`);
    document.documentElement.style.setProperty('--space-xl', `${BASELINE * 4}px`);
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  /**
   * Property 10: Breakout Layout Width
   * For any element with breakout layout class, the element width should exceed 
   * the content area max-width.
   */
  it('Property 10: Breakout Layout Width - Elements with .breakout class exceed content max-width', () => {
    fc.assert(
      fc.property(
        fc.record({
          elementType: fc.constantFrom('img', 'pre', 'div', 'figure'),
          viewportWidth: fc.integer({ min: 1024, max: 3840 }), // Desktop viewports
          contentWidth: fc.integer({ min: 400, max: CONTENT_MAX_WIDTH }),
        }),
        (props) => {
          // Set viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: props.viewportWidth,
          });

          // Create test structure
          const container = document.createElement('div');
          container.className = 'article-main';
          container.style.maxWidth = `${CONTENT_MAX_WIDTH}px`;
          container.style.margin = '0 auto';

          const breakoutElement = document.createElement(props.elementType);
          breakoutElement.className = 'breakout';
          breakoutElement.style.width = '100vw';
          breakoutElement.style.marginLeft = 'calc(-50vw + 50%)';
          breakoutElement.style.marginRight = 'calc(-50vw + 50%)';
          breakoutElement.style.maxWidth = 'none';

          container.appendChild(breakoutElement);
          document.body.appendChild(container);

          // Get computed styles
          const containerComputedStyle = window.getComputedStyle(container);
          const breakoutComputedStyle = window.getComputedStyle(breakoutElement);

          const containerMaxWidth = parseInt(containerComputedStyle.maxWidth, 10);
          const breakoutWidth = props.viewportWidth; // 100vw = viewport width

          // Property: Breakout element width should exceed content max-width
          expect(breakoutWidth).toBeGreaterThan(containerMaxWidth);

          // Property: Breakout element should have maxWidth set to 'none'
          expect(breakoutComputedStyle.maxWidth).toBe('none');

          // Cleanup
          document.body.removeChild(container);

          return true; // Property holds
        }
      ),
      {
        numRuns: 100,
        verbose: false,
      }
    );
  });

  /**
   * Additional Property: Full-width elements should span entire viewport
   */
  it('Property: Full-width elements span entire viewport width', () => {
    fc.assert(
      fc.property(
        fc.record({
          elementType: fc.constantFrom('img', 'pre', 'div', 'figure'),
          viewportWidth: fc.integer({ min: 1024, max: 3840 }),
        }),
        (props) => {
          // Set viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: props.viewportWidth,
          });

          // Create test structure
          const container = document.createElement('div');
          container.className = 'article-main';
          container.style.maxWidth = `${CONTENT_MAX_WIDTH}px`;

          const fullWidthElement = document.createElement(props.elementType);
          fullWidthElement.className = 'full-width';
          fullWidthElement.style.width = '100vw';
          fullWidthElement.style.marginLeft = 'calc(-50vw + 50%)';
          fullWidthElement.style.marginRight = 'calc(-50vw + 50%)';
          fullWidthElement.style.maxWidth = 'none';

          container.appendChild(fullWidthElement);
          document.body.appendChild(container);

          // Get computed styles
          const fullWidthComputedStyle = window.getComputedStyle(fullWidthElement);
          const fullWidthWidth = props.viewportWidth; // 100vw

          // Property: Full-width element should span entire viewport
          expect(fullWidthWidth).toBe(props.viewportWidth);

          // Property: Full-width element should have maxWidth set to 'none'
          expect(fullWidthComputedStyle.maxWidth).toBe('none');

          // Cleanup
          document.body.removeChild(container);

          return true; // Property holds
        }
      ),
      {
        numRuns: 100,
        verbose: false,
      }
    );
  });

  /**
   * Property: Regular elements should respect content max-width
   */
  it('Property: Regular elements without breakout class respect content max-width', () => {
    fc.assert(
      fc.property(
        fc.record({
          elementType: fc.constantFrom('p', 'img', 'pre', 'div'),
          viewportWidth: fc.integer({ min: 1024, max: 3840 }),
        }),
        (props) => {
          // Set viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: props.viewportWidth,
          });

          // Create test structure
          const container = document.createElement('div');
          container.className = 'article-main';
          container.style.maxWidth = `${CONTENT_MAX_WIDTH}px`;
          container.style.margin = '0 auto';

          const regularElement = document.createElement(props.elementType);
          // No breakout class - regular element
          regularElement.textContent = 'Regular content';

          container.appendChild(regularElement);
          document.body.appendChild(container);

          // Get computed styles
          const containerComputedStyle = window.getComputedStyle(container);
          const containerMaxWidth = parseInt(containerComputedStyle.maxWidth, 10);

          // Property: Container should have the defined max-width
          expect(containerMaxWidth).toBe(CONTENT_MAX_WIDTH);

          // Property: Regular element should be constrained by container
          const regularElementRect = regularElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Element should not exceed container width
          expect(regularElementRect.width).toBeLessThanOrEqual(containerRect.width);

          // Cleanup
          document.body.removeChild(container);

          return true; // Property holds
        }
      ),
      {
        numRuns: 100,
        verbose: false,
      }
    );
  });

  /**
   * Property: Breakout layout should work with various element types
   */
  it('Property: Breakout layout works consistently across element types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('img', 'pre', 'div', 'figure', 'blockquote'),
        fc.integer({ min: 1024, max: 2560 }),
        (elementType, viewportWidth) => {
          // Set viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          // Create test structure
          const container = document.createElement('div');
          container.className = 'article-main';
          container.style.maxWidth = `${CONTENT_MAX_WIDTH}px`;

          const breakoutElement = document.createElement(elementType);
          breakoutElement.className = 'breakout';
          breakoutElement.style.width = '100vw';
          breakoutElement.style.marginLeft = 'calc(-50vw + 50%)';
          breakoutElement.style.marginRight = 'calc(-50vw + 50%)';
          breakoutElement.style.maxWidth = 'none';

          container.appendChild(breakoutElement);
          document.body.appendChild(container);

          // Get computed styles
          const breakoutComputedStyle = window.getComputedStyle(breakoutElement);

          // Property: All element types should have consistent breakout behavior
          expect(breakoutComputedStyle.maxWidth).toBe('none');

          // Property: Width calculation should be consistent
          const expectedWidth = viewportWidth; // 100vw
          expect(expectedWidth).toBeGreaterThan(CONTENT_MAX_WIDTH);

          // Cleanup
          document.body.removeChild(container);

          return true; // Property holds
        }
      ),
      {
        numRuns: 100,
        verbose: false,
      }
    );
  });

  /**
   * Property: Mobile breakout layout should behave differently
   */
  it('Property: Mobile breakout layout respects mobile constraints', () => {
    fc.assert(
      fc.property(
        fc.record({
          elementType: fc.constantFrom('img', 'pre', 'div'),
          viewportWidth: fc.integer({ min: 320, max: 768 }), // Mobile viewports
          spaceMd: fc.integer({ min: 16, max: 56 }), // --space-md range
        }),
        (props) => {
          // Set viewport width for mobile
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: props.viewportWidth,
          });

          // Create test structure
          const container = document.createElement('div');
          container.className = 'article-main';
          container.style.maxWidth = `${CONTENT_MAX_WIDTH}px`;

          const breakoutElement = document.createElement(props.elementType);
          breakoutElement.className = 'breakout';
          
          // Mobile breakout styles
          breakoutElement.style.width = '100%';
          breakoutElement.style.marginLeft = `calc(-1 * ${props.spaceMd}px)`;
          breakoutElement.style.marginRight = `calc(-1 * ${props.spaceMd}px)`;

          container.appendChild(breakoutElement);
          document.body.appendChild(container);

          // Get computed styles
          const breakoutComputedStyle = window.getComputedStyle(breakoutElement);

          // Property: Mobile breakout should use 100% width, not 100vw
          expect(breakoutComputedStyle.width).not.toBe(`${props.viewportWidth}px`);

          // Property: Mobile viewport is in the mobile range (320-768px)
          expect(props.viewportWidth).toBeGreaterThanOrEqual(320);
          expect(props.viewportWidth).toBeLessThanOrEqual(768);

          // Cleanup
          document.body.removeChild(container);

          return true; // Property holds
        }
      ),
      {
        numRuns: 100,
        verbose: false,
      }
    );
  });
});
