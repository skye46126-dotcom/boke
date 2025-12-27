# Requirements Document: Pixel Portfolio Homepage

## Introduction

本规格说明定义了一个像素风格的扑克牌主页系统。该系统将复用现有的 PostgreSQL + Express 后端和 Next.js 前端，通过标签系统将文章转换为可交互的扑克牌展示。

## Glossary

- **Portfolio Card**: 在主页上以扑克牌形式展示的内容卡片
- **Card Category**: 卡片的类型分类（关于我、技能、文章精选、相册等）
- **Tag System**: 现有的文章标签系统，用于标记和分类内容
- **Pixel Style**: 复古像素艺术风格的视觉设计
- **Draw Animation**: 抽牌动画效果

## Requirements

### Requirement 1: 后端标签系统配置

**User Story:** 作为管理员，我希望通过标签系统来定义主页卡片的类型和内容，这样我就可以灵活管理主页展示的内容。

#### Acceptance Criteria

1. THE System SHALL support creating tags with specific slugs to identify portfolio cards
2. WHEN an article is tagged with `portfolio-card`, THE System SHALL make it available for homepage display
3. WHEN an article has category tags (e.g., `category-about`, `category-skill`), THE System SHALL use these to determine card rendering style
4. THE System SHALL support the following predefined tag slugs:
   - `portfolio-card` (required for all homepage cards)
   - `category-about` (for "About Me" cards)
   - `category-skill` (for skill showcase cards)
   - `category-featured-article` (for featured article cards)
   - `category-album` (for photo album entry cards)
   - `gallery` (for styling gallery pages)

### Requirement 2: API 端点增强

**User Story:** 作为前端开发者，我希望能够通过标签筛选文章，这样我就可以获取特定类型的内容用于主页展示。

#### Acceptance Criteria

1. WHEN a GET request is made to `/api/articles` with a `tag` query parameter, THE System SHALL return only articles that have that tag
2. WHEN articles are returned, THE System SHALL include associated tag information in the response
3. THE API SHALL maintain backward compatibility with existing queries without the `tag` parameter
4. THE API SHALL return articles in a format that includes: id, title, content, slug, status, created_at, updated_at, and tags array

### Requirement 3: PixelPortfolio 容器组件

**User Story:** 作为用户，我希望看到一个像素风格的主页，展示扑克牌式的内容卡片，这样我就可以以有趣的方式浏览网站内容。

#### Acceptance Criteria

1. WHEN the homepage loads, THE PixelPortfolio Component SHALL fetch articles tagged with `portfolio-card`
2. WHEN data is loading, THE Component SHALL display a loading indicator
3. WHEN data is loaded, THE Component SHALL display a card deck with a "Draw Card" button
4. WHEN the "Draw Card" button is clicked, THE Component SHALL play a draw animation
5. WHEN a card is drawn, THE Component SHALL display the card content with appropriate styling based on its category
6. THE Component SHALL manage state for: cards array, loading status, current card index, and animation status
7. THE Component SHALL transform API Post data into Card component props format

### Requirement 4: Card 展示组件

**User Story:** 作为用户，我希望每张卡片根据其类型显示不同的内容和样式，这样我就可以快速识别卡片的用途。

#### Acceptance Criteria

1. WHEN a card has a `targetUrl`, THE Card Component SHALL render as a clickable Next.js Link
2. WHEN a card has no `targetUrl`, THE Card Component SHALL render as a non-interactive div
3. WHEN a card's category is "article_link" or "album_link", THE Card SHALL display a thumbnail image
4. WHEN a card's category is "skill", THE Card SHALL display an icon
5. WHEN a card's category is "about", THE Card SHALL display text content with appropriate formatting
6. THE Card SHALL apply pixel-style visual design consistent with the overall theme

### Requirement 5: 主页集成

**User Story:** 作为网站访问者，我希望主页展示像素扑克牌界面，这样我就可以通过独特的方式探索网站内容。

#### Acceptance Criteria

1. WHEN a user visits the root path `/`, THE System SHALL display the PixelPortfolio component
2. THE PixelPortfolio SHALL replace the current homepage content
3. THE System SHALL maintain access to the blog article list through a different route (e.g., `/articles` or `/blog`)

### Requirement 6: 样式隔离与像素字体

**User Story:** 作为开发者，我希望像素风格样式不影响博客文章页面，这样两种风格就可以共存。

#### Acceptance Criteria

1. THE System SHALL use CSS Modules for all PixelPortfolio-related styles
2. THE System SHALL load pixel fonts (e.g., "Press Start 2P") only for the PixelPortfolio component
3. THE System SHALL NOT apply pixel fonts to blog article pages
4. THE System SHALL maintain existing blog styling unchanged

### Requirement 7: 相册页面样式

**User Story:** 作为用户，当我访问标记为相册的文章时，我希望看到网格布局的图片展示，这样我就可以浏览照片集。

#### Acceptance Criteria

1. WHEN an article is tagged with `gallery`, THE System SHALL apply special gallery page styling
2. WHEN rendering a gallery page, THE System SHALL use a grid layout for images
3. THE Gallery page SHALL display images in an optimized, responsive grid
4. THE Gallery page SHALL maintain the pixel aesthetic consistent with the homepage

### Requirement 8: Markdown 链接约定

**User Story:** 作为内容创建者，我希望能够在文章内容中定义卡片的跳转链接，这样我就可以控制卡片点击后的目标页面。

#### Acceptance Criteria

1. WHEN an article's content starts with `[link](URL)` format, THE System SHALL extract this as the card's target URL
2. WHEN extracting the link, THE System SHALL remove it from the displayed card content
3. WHEN no link is present, THE Card SHALL be non-interactive
4. THE Link extraction SHALL support both relative paths (e.g., `/articles/slug`) and absolute URLs

### Requirement 9: 动画与音效

**User Story:** 作为用户，我希望抽牌时有流畅的动画和音效反馈，这样交互体验就更加生动有趣。

#### Acceptance Criteria

1. WHEN the "Draw Card" button is clicked, THE System SHALL play a card draw animation
2. THE Animation SHALL last approximately 300-500ms
3. WHEN a card is drawn, THE System MAY play a sound effect (optional)
4. THE Animation SHALL be smooth and performant (60fps)
5. THE System SHALL respect user's `prefers-reduced-motion` setting

### Requirement 10: 响应式设计

**User Story:** 作为移动设备用户，我希望像素主页在小屏幕上也能正常显示和交互，这样我就可以在任何设备上使用。

#### Acceptance Criteria

1. WHEN viewed on mobile devices, THE PixelPortfolio SHALL adapt its layout
2. THE Card size SHALL scale appropriately for different screen sizes
3. THE "Draw Card" button SHALL remain accessible on touch devices
4. THE Pixel font size SHALL be readable on small screens
5. THE Layout SHALL maintain usability on screens as small as 320px wide
