# Requirements Document: Article Typography Enhancement

## Introduction

本规范定义了个人博客文章页面的高级排版系统和"微观动力"交互层的完整重构需求。目标是创建一个具有"秩序与韵律"的阅读体验，通过精致的排版和微妙的交互动效，提升内容的专业性和吸引力。

## Glossary

- **Typography_System**: 排版系统，包含宏观布局、中观韵律和微观细节的完整视觉规范
- **Micro_Dynamics**: 微观动力，指页面中的细微交互动效和物理感知
- **Content_Area**: 内容区域，文章主体内容的显示区域
- **Baseline_Grid**: 基线网格，用于垂直韵律对齐的不可见网格系统
- **Modular_Scale**: 模块化比例，用于字体大小层级的数学比例系统
- **Magnetic_UI**: 磁吸 UI，具有向光标吸附效果的交互元素
- **Breakout_Layout**: 破格布局，突破内容区宽度限制的视觉元素
- **Rich_Content**: 富文本内容，经过服务端预处理的 HTML 内容

## Requirements

### Requirement 1: 宏观布局 - 视觉焦点漏斗

**User Story:** As a reader, I want a focused reading area with optimal line length, so that I can read comfortably without eye strain.

#### Acceptance Criteria

1. THE Content_Area SHALL have a maximum width between 720px and 800px
2. THE Content_Area SHALL have generous whitespace on both sides, between paragraphs, and between headings and body text
3. WHEN viewing on desktop, THE auxiliary elements (table of contents, share tools) SHALL float in a sidebar
4. WHEN viewing on mobile, THE table of contents SHALL be contained in a collapsible button below the main title
5. THE layout SHALL create a visual "funnel" that naturally guides the reader's eye to the content

### Requirement 2: 中观韵律 - 和谐的视觉节奏

**User Story:** As a reader, I want consistent visual rhythm throughout the article, so that the content feels professionally designed and easy to scan.

#### Acceptance Criteria

1. THE Typography_System SHALL define a baseline value (e.g., 28px)
2. ALL vertical dimensions (margin, padding, line-height) SHALL be integer or half-integer multiples of the baseline
3. THE Typography_System SHALL define a modular scale ratio (e.g., 1.333)
4. ALL heading sizes (H1-H6) SHALL be calculated from the body font size using the modular scale
5. THE vertical rhythm SHALL create an invisible baseline grid for harmonious alignment

### Requirement 3: 微观细节 - 像素级精致

**User Story:** As a reader, I want beautifully rendered text with attention to typographic details, so that the reading experience feels premium and polished.

#### Acceptance Criteria

1. THE Typography_System SHALL enable font ligatures (font-feature-settings: 'liga', 'clig')
2. THE Typography_System SHALL enable kerning optimization (text-rendering: optimizeLegibility)
3. THE Typography_System SHALL enable smooth antialiasing (font-smoothing: antialiased)
4. WHEN rendering blockquotes, THE system SHALL use academic style (italic + indent + large quote marks) or highlight style (subtle background color)
5. THE system SHALL NOT use traditional large left border style for blockquotes
6. THE system SHALL support breakout layout for specific images or code blocks to exceed content area width

### Requirement 4: 磁吸 UI 元素

**User Story:** As a user, I want interactive elements to respond subtly to my cursor, so that the interface feels alive and engaging.

#### Acceptance Criteria

1. WHEN the cursor approaches an interactive element (link, button), THE element SHALL smoothly move toward the cursor with elastic easing
2. THE magnetic effect SHALL be implemented using JavaScript mousemove events and requestAnimationFrame
3. THE system SHALL NOT use CSS :hover alone, as it cannot simulate continuous, non-linear physical attraction
4. THE magnetic effect SHALL respect prefers-reduced-motion media query
5. THE magnetic effect SHALL NOT interfere with keyboard Tab navigation or :focus-visible styles

### Requirement 5: 动态标题呈现

**User Story:** As a reader, I want section headings to subtly announce themselves when they appear, so that I notice the structure without being distracted.

#### Acceptance Criteria

1. WHEN a section heading enters the viewport for the first time, THE system SHALL trigger a non-intrusive animation lasting less than 300ms
2. THE animation SHALL be either "cursor blink" or "mask reveal" style
3. THE system SHALL NOT use typewriter effects, as they disrupt reading continuity
4. THE animation SHALL respect prefers-reduced-motion media query
5. THE animation SHALL only trigger once per heading per page load

### Requirement 6: 生命感签名图标

**User Story:** As a visitor, I want to see a subtle 3D element that adds personality to the page, so that the site feels unique and technically sophisticated.

#### Acceptance Criteria

1. THE system SHALL embed an independent, low-power Three.js Canvas in a non-core area
2. THE Canvas SHALL render a minimalist 3D geometric shape with eternal, slow, non-uniform rotation
3. THE system SHALL NOT use GIF or CSS 3D transforms for this element
4. WHEN the Canvas is outside the viewport, THE rendering loop SHALL be completely stopped (cancelAnimationFrame)
5. THE 3D element SHALL not impact page load performance or reading experience

### Requirement 7: 后端内容预处理

**User Story:** As a developer, I want the backend to preprocess article content, so that the frontend can render quickly without heavy computation.

#### Acceptance Criteria

1. WHEN fetching an article, THE API SHALL return pre-rendered HTML content
2. WHEN fetching an article, THE API SHALL return a structured table of contents array
3. WHEN fetching an article, THE API SHALL return estimated reading time in minutes
4. WHEN fetching an article, THE API SHALL return structured data for all images including responsive sources and placeholders
5. THE backend SHALL process Markdown at build time or server-side, not on the client

### Requirement 8: 富文本处理增强

**User Story:** As a content creator, I want to use custom Markdown syntax for advanced layouts, so that I can create visually rich articles.

#### Acceptance Criteria

1. THE Markdown parser SHALL support custom syntax for breakout layout (e.g., {.breakout})
2. THE Markdown parser SHALL support custom syntax for code block titles (e.g., {title="..."})
3. THE parser SHALL convert custom syntax to appropriate HTML classes or data-* attributes
4. THE system SHALL support image captions and layout hints in the Markdown
5. THE processed HTML SHALL include all necessary attributes for frontend rendering

### Requirement 9: 性能优化

**User Story:** As a user, I want the article page to load quickly and run smoothly, so that I can focus on reading without technical distractions.

#### Acceptance Criteria

1. THE system SHALL minimize client-side JavaScript execution by leveraging server-side processing
2. THE Three.js rendering loop SHALL be stopped when the Canvas is outside the viewport
3. THE system SHALL use lazy loading for images with appropriate placeholders
4. THE system SHALL achieve a Lighthouse performance score above 90
5. THE initial page load SHALL complete in under 2 seconds on a 3G connection

### Requirement 10: 可访问性

**User Story:** As a user with motion sensitivity, I want to disable animations, so that I can read comfortably without discomfort.

#### Acceptance Criteria

1. THE system SHALL respect the prefers-reduced-motion media query
2. WHEN prefers-reduced-motion is enabled, ALL micro-dynamics effects SHALL be disabled
3. THE magnetic UI effects SHALL NOT interfere with keyboard navigation
4. THE system SHALL maintain proper :focus-visible styles for all interactive elements
5. THE table of contents SHALL be keyboard accessible and screen reader friendly
