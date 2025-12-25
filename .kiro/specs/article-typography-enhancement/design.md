# Design Document: Article Typography Enhancement

## Overview

This document describes the design for implementing a sophisticated typography system and "micro-dynamics" interaction layer for article pages. The system emphasizes "order and rhythm" through mathematical precision in layout, typography, and subtle animations that enhance rather than distract from the reading experience.

The design follows a three-tier approach:
1. **Macro Layout**: Visual focus funnel with optimal reading width
2. **Meso Rhythm**: Baseline grid and modular scale for harmonious proportions
3. **Micro Details**: Pixel-perfect text rendering and subtle interactions

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Article Page (SSR)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Typography   │  │  Micro-Dynamics  │  │   Three.js  │ │
│  │     System     │  │     Engine       │  │   Canvas    │ │
│  │   (CSS Grid)   │  │  (RAF + Events)  │  │  (Isolated) │ │
│  └────────────────┘  └──────────────────┘  └─────────────┘ │
│           │                   │                     │        │
│           └───────────────────┴─────────────────────┘        │
│                              │                               │
│                    ┌─────────▼─────────┐                    │
│                    │  Rich Content API  │                    │
│                    │  (Pre-processed)   │                    │
│                    └────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
ArticlePage
├── ArticleHeader
│   ├── BackLink
│   ├── Title (with reveal animation)
│   └── Metadata (reading time, date)
├── ArticleContent
│   ├── TableOfContents (desktop: sidebar, mobile: collapsible)
│   ├── RichContent (pre-rendered HTML)
│   │   ├── Headings (with intersection observer)
│   │   ├── Paragraphs (baseline grid aligned)
│   │   ├── Blockquotes (academic/highlight style)
│   │   ├── Images (lazy loaded, breakout support)
│   │   └── CodeBlocks (with titles, breakout support)
│   └── MagneticLinks (with cursor tracking)
└── ArticleFooter
    └── SignatureIcon (Three.js 3D element)
```

## Components and Interfaces

### 1. Typography System

#### CSS Custom Properties

```css
:root {
  /* Baseline Grid */
  --baseline: 28px;
  --baseline-half: 14px;
  
  /* Modular Scale (1.333 - Perfect Fourth) */
  --font-size-base: 18px;
  --font-size-h6: calc(var(--font-size-base) * 1);      /* 18px */
  --font-size-h5: calc(var(--font-size-base) * 1.333);  /* 24px */
  --font-size-h4: calc(var(--font-size-base) * 1.777);  /* 32px */
  --font-size-h3: calc(var(--font-size-base) * 2.369);  /* 43px */
  --font-size-h2: calc(var(--font-size-base) * 3.157);  /* 57px */
  --font-size-h1: calc(var(--font-size-base) * 4.209);  /* 76px */
  
  /* Content Area */
  --content-max-width: 760px;
  --content-padding: var(--baseline);
  
  /* Spacing (baseline multiples) */
  --space-xs: var(--baseline-half);      /* 14px */
  --space-sm: var(--baseline);           /* 28px */
  --space-md: calc(var(--baseline) * 2); /* 56px */
  --space-lg: calc(var(--baseline) * 3); /* 84px */
  --space-xl: calc(var(--baseline) * 4); /* 112px */
  
  /* Typography Details */
  --font-feature-settings: 'liga' 1, 'clig' 1, 'kern' 1;
  --text-rendering: optimizeLegibility;
  --font-smoothing: antialiased;
}
```

#### Layout Structure

```typescript
// frontend/src/styles/typography.css
interface TypographyConfig {
  baseline: number;        // 28px
  modularScale: number;    // 1.333
  contentMaxWidth: number; // 760px
  breakpoints: {
    mobile: number;        // 768px
    desktop: number;       // 1024px
  };
}
```

### 2. Micro-Dynamics Engine

#### Magnetic UI System

```typescript
// frontend/src/lib/interactions/magnetic.ts
interface MagneticConfig {
  strength: number;      // 0-1, attraction strength
  radius: number;        // pixels, effective range
  easing: string;        // 'elastic' | 'spring'
  duration: number;      // ms, animation duration
}

class MagneticElement {
  private element: HTMLElement;
  private config: MagneticConfig;
  private rafId: number | null;
  private currentX: number;
  private currentY: number;
  private targetX: number;
  private targetY: number;
  
  constructor(element: HTMLElement, config: MagneticConfig);
  
  // Track cursor and update element position
  private onMouseMove(e: MouseEvent): void;
  
  // Smooth animation using RAF
  private animate(): void;
  
  // Calculate magnetic force
  private calculateForce(distance: number): number;
  
  // Cleanup
  public destroy(): void;
}
```

#### Heading Reveal Animation

```typescript
// frontend/src/lib/interactions/heading-reveal.ts
interface RevealConfig {
  animationType: 'cursor-blink' | 'mask-reveal';
  duration: number;  // < 300ms
  threshold: number; // Intersection observer threshold
}

class HeadingReveal {
  private observer: IntersectionObserver;
  private revealed: Set<HTMLElement>;
  
  constructor(config: RevealConfig);
  
  // Observe headings
  public observe(headings: HTMLElement[]): void;
  
  // Trigger reveal animation
  private reveal(heading: HTMLElement): void;
  
  // Cleanup
  public destroy(): void;
}
```

### 3. Three.js Signature Icon

```typescript
// frontend/src/components/SignatureIcon.tsx
interface SignatureIconProps {
  geometry: 'icosahedron' | 'torus' | 'octahedron';
  color: string;
  size: number;
  rotationSpeed: number; // radians per frame
}

class SignatureIcon {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private rafId: number | null;
  private observer: IntersectionObserver;
  
  constructor(container: HTMLElement, props: SignatureIconProps);
  
  // Animation loop
  private animate(): void;
  
  // Start/stop based on visibility
  private handleVisibility(isVisible: boolean): void;
  
  // Cleanup
  public destroy(): void;
}
```

### 4. Rich Content API

#### API Response Structure

```typescript
// frontend/src/types/rich-article.ts
interface TocItem {
  level: number;      // 1-6 for H1-H6
  text: string;       // Heading text
  id: string;         // Anchor ID
}

interface ImageObject {
  alt: string;
  src: {
    original: string;
    large: string;     // 1200px
    medium: string;    // 800px
    small: string;     // 400px
  };
  placeholder: {
    type: 'blurhash' | 'lqip';
    hash: string;
  };
  caption?: string;
  layout: 'default' | 'breakout' | 'full-width';
  width: number;
  height: number;
}

interface RichArticle {
  id: string;
  title: string;
  slug: string;
  htmlContent: string;           // Pre-rendered HTML
  tableOfContents: TocItem[];    // Structured TOC
  readingTime: number;           // Minutes
  contentImages: ImageObject[];  // All images
  excerpt: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at: string | null;
}
```

#### Backend Processing Pipeline

```typescript
// frontend/lib/utils/markdown-processor.ts
interface MarkdownProcessor {
  // Parse Markdown to HTML
  parse(markdown: string): string;
  
  // Extract table of contents
  extractToc(html: string): TocItem[];
  
  // Calculate reading time
  calculateReadingTime(text: string): number;
  
  // Extract and process images
  extractImages(html: string): ImageObject[];
  
  // Process custom syntax
  processCustomSyntax(markdown: string): string;
}

// Custom syntax examples:
// ![Image](url){.breakout}
// ```javascript{title="Example Code"}
// ```
```

## Data Models

### Enhanced Article Model

```typescript
// frontend/lib/models/RichArticle.ts
export class RichArticleModel extends ArticleModel {
  // Generate rich content from markdown
  static async generateRichContent(
    articleId: string
  ): Promise<RichArticle> {
    const article = await this.findById(articleId);
    if (!article) throw new Error('Article not found');
    
    const processor = new MarkdownProcessor();
    
    // Process markdown
    const htmlContent = processor.parse(article.content);
    const tableOfContents = processor.extractToc(htmlContent);
    const readingTime = processor.calculateReadingTime(article.content);
    const contentImages = processor.extractImages(htmlContent);
    
    return {
      ...article,
      htmlContent,
      tableOfContents,
      readingTime,
      contentImages,
    };
  }
  
  // Get rich article by slug
  static async findRichBySlug(slug: string): Promise<RichArticle | null> {
    const article = await this.findBySlug(slug);
    if (!article) return null;
    
    return this.generateRichContent(article.id);
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Content Area Width Constraint
*For any* viewport width, the content area width should never exceed 800px and should be at least 720px on desktop viewports.
**Validates: Requirements 1.1**

### Property 2: Baseline Grid Alignment
*For any* element with vertical spacing (margin, padding, line-height), the computed value should be an integer or half-integer multiple of the baseline (28px).
**Validates: Requirements 2.2**

### Property 3: Modular Scale Typography
*For any* heading element (H1-H6), the font size should equal the base font size multiplied by 1.333 raised to the appropriate power.
**Validates: Requirements 2.4**

### Property 4: Magnetic UI Cursor Tracking
*For any* interactive element with magnetic behavior, when the cursor is within the effective radius, the element should move toward the cursor position with smooth easing.
**Validates: Requirements 4.1**

### Property 5: Reduced Motion Compliance
*For any* animated element, when `prefers-reduced-motion: reduce` is set, no animations should execute.
**Validates: Requirements 4.4, 5.4, 10.2**

### Property 6: Heading Reveal Timing
*For any* heading element, the reveal animation duration should be less than 300ms.
**Validates: Requirements 5.1**

### Property 7: Heading Reveal Uniqueness
*For any* heading element, the reveal animation should trigger exactly once per page load.
**Validates: Requirements 5.5**

### Property 8: Three.js Performance Optimization
*For any* Three.js canvas, when the element is outside the viewport, the requestAnimationFrame loop should be cancelled.
**Validates: Requirements 6.4**

### Property 9: API Rich Content Structure
*For any* article fetched from the API, the response should contain htmlContent (string), tableOfContents (array), readingTime (number), and contentImages (array).
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 10: Breakout Layout Width
*For any* element with breakout layout class, the element width should exceed the content area max-width.
**Validates: Requirements 3.6**

### Property 11: Custom Markdown Syntax Processing
*For any* markdown content with {.breakout} syntax, the generated HTML should contain the corresponding CSS class.
**Validates: Requirements 8.1**

### Property 12: Keyboard Navigation Preservation
*For any* interactive element with magnetic behavior, keyboard Tab navigation should function normally and focus styles should be visible.
**Validates: Requirements 4.5, 10.3**

## Error Handling

### Typography System Errors

```typescript
// Fallback for unsupported font features
@supports not (font-feature-settings: 'liga') {
  body {
    /* Fallback typography */
  }
}

// Baseline grid validation
function validateBaselineGrid(element: HTMLElement): boolean {
  const computed = window.getComputedStyle(element);
  const baseline = 28;
  
  const margin = parseFloat(computed.marginTop);
  const padding = parseFloat(computed.paddingTop);
  
  return (
    margin % (baseline / 2) === 0 &&
    padding % (baseline / 2) === 0
  );
}
```

### Interaction Errors

```typescript
// Graceful degradation for magnetic UI
try {
  const magnetic = new MagneticElement(element, config);
} catch (error) {
  console.warn('Magnetic UI failed, using standard hover', error);
  // Fallback to CSS :hover
}

// Three.js initialization error handling
try {
  const icon = new SignatureIcon(container, props);
} catch (error) {
  console.warn('Three.js failed to initialize', error);
  // Hide container or show static fallback
  container.style.display = 'none';
}
```

### API Error Handling

```typescript
// Fallback to client-side markdown parsing
async function getRichArticle(slug: string): Promise<RichArticle> {
  try {
    const response = await fetch(`/api/articles/${slug}/rich`);
    if (!response.ok) throw new Error('API failed');
    return await response.json();
  } catch (error) {
    console.warn('Rich content API failed, falling back', error);
    
    // Fallback: fetch regular article and process client-side
    const article = await fetch(`/api/articles/${slug}`).then(r => r.json());
    return processArticleClientSide(article);
  }
}
```

## Testing Strategy

### Unit Tests

**Typography System**:
- Test baseline grid calculations
- Test modular scale font size calculations
- Test CSS custom property values
- Test responsive breakpoints

**Micro-Dynamics**:
- Test magnetic force calculations
- Test animation easing functions
- Test intersection observer callbacks
- Test RAF loop start/stop

**Three.js**:
- Test scene initialization
- Test geometry creation
- Test visibility observer
- Test cleanup/disposal

### Property-Based Tests

**Property 1: Content Width Constraint**
```typescript
// Generate random viewport widths
// Verify content area never exceeds 800px
fc.assert(
  fc.property(fc.integer(320, 3840), (viewportWidth) => {
    const contentWidth = calculateContentWidth(viewportWidth);
    return contentWidth <= 800 && (viewportWidth < 1024 || contentWidth >= 720);
  }),
  { numRuns: 100 }
);
```

**Property 2: Baseline Grid Alignment**
```typescript
// Generate random spacing values
// Verify all are multiples of baseline/2
fc.assert(
  fc.property(fc.array(fc.integer(0, 10)), (multipliers) => {
    const baseline = 28;
    const spacings = multipliers.map(m => m * (baseline / 2));
    return spacings.every(s => s % (baseline / 2) === 0);
  }),
  { numRuns: 100 }
);
```

**Property 5: Reduced Motion Compliance**
```typescript
// Test that all animations respect prefers-reduced-motion
fc.assert(
  fc.property(fc.boolean(), (reducedMotion) => {
    setReducedMotionPreference(reducedMotion);
    const animations = getAllActiveAnimations();
    return reducedMotion ? animations.length === 0 : true;
  }),
  { numRuns: 100 }
);
```

### Integration Tests

- Test complete article page rendering with rich content
- Test table of contents generation and scroll highlighting
- Test image lazy loading and breakout layouts
- Test keyboard navigation through magnetic elements
- Test Three.js canvas lifecycle (mount, unmount, visibility changes)

### Performance Tests

- Measure Lighthouse performance score (target: > 90)
- Measure Time to Interactive (target: < 2s on 3G)
- Measure JavaScript execution time (target: < 500ms)
- Measure Three.js frame rate (target: 60fps)
- Measure memory usage with Three.js canvas

### Accessibility Tests

- Test keyboard navigation (Tab, Shift+Tab, Enter, Space)
- Test screen reader compatibility (ARIA labels, semantic HTML)
- Test focus-visible styles
- Test prefers-reduced-motion compliance
- Test color contrast ratios (WCAG AA minimum)

## Implementation Notes

### Phase 1: Typography System
1. Define CSS custom properties for baseline grid and modular scale
2. Update global styles with typography enhancements
3. Implement responsive layout with content area constraints
4. Add font feature settings and text rendering optimizations

### Phase 2: Rich Content API
1. Create markdown processor with custom syntax support
2. Implement TOC extraction and reading time calculation
3. Add image processing and responsive source generation
4. Update Article model with rich content methods
5. Create new API endpoint for rich articles

### Phase 3: Micro-Dynamics
1. Implement magnetic UI system with RAF and cursor tracking
2. Add heading reveal animations with intersection observer
3. Implement Three.js signature icon component
4. Add prefers-reduced-motion support throughout

### Phase 4: Integration & Testing
1. Update article detail page to use rich content
2. Add table of contents component (responsive)
3. Implement breakout layout support
4. Write property-based tests
5. Performance optimization and testing

### Dependencies

```json
{
  "dependencies": {
    "three": "^0.160.0",
    "marked": "^11.0.0",
    "blurhash": "^2.0.5"
  },
  "devDependencies": {
    "fast-check": "^3.15.0",
    "@types/three": "^0.160.0"
  }
}
```

### Browser Support

- Modern browsers with ES2020+ support
- CSS Grid and Custom Properties required
- IntersectionObserver API required
- RequestAnimationFrame API required
- WebGL support required for Three.js (graceful degradation if unavailable)

### Performance Considerations

1. **Server-Side Processing**: All markdown parsing and content processing happens server-side
2. **Lazy Loading**: Images use native lazy loading with blurhash placeholders
3. **RAF Optimization**: Animation loops only run when elements are visible
4. **Code Splitting**: Three.js loaded dynamically only when needed
5. **CSS Containment**: Use `contain` property for isolated components
6. **Will-Change**: Use sparingly only for actively animating elements

---

**Design Status**: Complete and ready for task breakdown.
