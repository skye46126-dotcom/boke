# Requirements Document

## Introduction

将现有的动态博客系统（Next.js + Express + PostgreSQL）转换为纯静态博客。所有内容存储为本地文件（Markdown 和 JSON），构建时生成静态 HTML，无需后端服务器和数据库。

## Glossary

- **Static_Blog**: 纯静态博客系统，所有页面在构建时生成，无需运行时服务器
- **Content_Directory**: 存放文章和相册数据的目录 `/content/`
- **Article_File**: Markdown 格式的文章文件，包含 frontmatter 元数据
- **Gallery_Config**: JSON 格式的相册配置文件
- **Build_Process**: Next.js 静态导出过程，读取内容文件生成 HTML
- **Frontmatter**: Markdown 文件头部的 YAML 格式元数据

## Requirements

### Requirement 1: 文章内容文件化

**User Story:** As a 博客作者, I want 将文章存储为 Markdown 文件, so that 我可以直接编辑文件管理内容，无需数据库。

#### Acceptance Criteria

1. THE Static_Blog SHALL 从 `/content/articles/` 目录读取所有 `.md` 文件作为文章源
2. WHEN 解析文章文件时, THE Static_Blog SHALL 提取 frontmatter 中的 title、slug、date、status、excerpt、cover_image 字段
3. WHEN 文章 status 为 "draft" 时, THE Static_Blog SHALL 在生产构建中排除该文章
4. THE Static_Blog SHALL 将 Markdown 内容渲染为 HTML，保留现有的排版样式
5. FOR ALL 文章文件, THE Static_Blog SHALL 根据 slug 生成对应的静态页面 `/articles/[slug]`

### Requirement 2: 相册内容文件化

**User Story:** As a 博客作者, I want 将相册数据存储为 JSON 文件和本地图片, so that 我可以直接管理图片文件，无需上传到服务器。

#### Acceptance Criteria

1. THE Static_Blog SHALL 从 `/content/gallery/albums.json` 读取相册集配置
2. THE Static_Blog SHALL 从 `/content/gallery/images.json` 读取图片列表配置
3. THE Static_Blog SHALL 从 `/public/images/gallery/` 目录读取图片文件
4. WHEN 构建相册页面时, THE Static_Blog SHALL 根据 JSON 配置生成相册集和图片列表
5. THE Static_Blog SHALL 保留现有的像素风格 UI 和图片预览功能

### Requirement 3: 静态页面生成

**User Story:** As a 博客作者, I want 构建时生成所有静态页面, so that 我可以部署到任何静态托管服务。

#### Acceptance Criteria

1. THE Build_Process SHALL 使用 `next export` 或 `output: 'export'` 配置生成静态 HTML
2. THE Build_Process SHALL 为每篇文章生成独立的 HTML 页面
3. THE Build_Process SHALL 为每个相册集生成独立的 HTML 页面
4. THE Build_Process SHALL 生成文章列表页、相册页、首页等索引页面
5. WHEN 构建完成后, THE Static_Blog SHALL 输出到 `/out` 目录，可直接部署

### Requirement 4: 内容数据读取层

**User Story:** As a 开发者, I want 统一的数据读取接口, so that 页面组件可以方便地获取文章和相册数据。

#### Acceptance Criteria

1. THE Static_Blog SHALL 提供 `getArticles()` 函数返回所有已发布文章列表
2. THE Static_Blog SHALL 提供 `getArticleBySlug(slug)` 函数返回单篇文章内容
3. THE Static_Blog SHALL 提供 `getAlbums()` 函数返回所有相册集列表
4. THE Static_Blog SHALL 提供 `getAlbumById(id)` 函数返回单个相册集及其图片
5. THE Static_Blog SHALL 提供 `getGalleryItems()` 函数返回所有图片列表
6. FOR ALL 数据读取函数, THE Static_Blog SHALL 在构建时执行，不依赖运行时 API

### Requirement 5: 移除后端依赖

**User Story:** As a 博客作者, I want 完全移除后端服务器依赖, so that 我只需要静态文件托管即可运行博客。

#### Acceptance Criteria

1. THE Static_Blog SHALL 移除所有对 `http://localhost:3001` 的 API 调用
2. THE Static_Blog SHALL 移除 Express 后端代码依赖
3. THE Static_Blog SHALL 移除 PostgreSQL 数据库依赖
4. THE Static_Blog SHALL 移除 Docker 容器配置
5. WHEN 部署时, THE Static_Blog SHALL 仅需要静态文件服务器（如 Nginx、Vercel、GitHub Pages）

### Requirement 6: 保留现有功能和样式

**User Story:** As a 用户, I want 博客保留现有的所有功能和视觉效果, so that 转换后的体验与之前一致。

#### Acceptance Criteria

1. THE Static_Blog SHALL 保留像素风格的 UI 设计和主题切换功能
2. THE Static_Blog SHALL 保留文章的排版样式和打字机效果
3. THE Static_Blog SHALL 保留相册的平铺/图片集视图切换
4. THE Static_Blog SHALL 保留图片预览弹窗功能
5. THE Static_Blog SHALL 保留响应式布局适配

### Requirement 7: 数据迁移工具

**User Story:** As a 博客作者, I want 将现有数据库数据导出为文件, so that 我可以无缝迁移到静态博客。

#### Acceptance Criteria

1. THE Static_Blog SHALL 提供脚本将数据库文章导出为 Markdown 文件
2. THE Static_Blog SHALL 提供脚本将数据库相册数据导出为 JSON 文件
3. WHEN 导出文章时, THE Static_Blog SHALL 保留所有元数据（标题、日期、状态等）
4. WHEN 导出相册时, THE Static_Blog SHALL 保留相册集结构和图片关联
5. IF 图片 URL 为远程地址, THEN THE Static_Blog SHALL 提供下载图片到本地的选项

### Requirement 8: 标签系统

**User Story:** As a 博客作者, I want 为文章添加标签, so that 读者可以按标签浏览相关文章。

#### Acceptance Criteria

1. THE Static_Blog SHALL 支持在文章 frontmatter 中定义 tags 字段（数组格式）
2. THE Static_Blog SHALL 提供 `getAllTags()` 函数返回所有标签及其文章数量
3. THE Static_Blog SHALL 提供 `getArticlesByTag(tag)` 函数返回指定标签的所有文章
4. THE Build_Process SHALL 为每个标签生成独立的标签页面 `/tags/[tag]`
5. THE Static_Blog SHALL 生成标签索引页 `/tags` 展示所有标签
6. WHEN 显示文章时, THE Static_Blog SHALL 在文章页面展示该文章的所有标签
7. THE Static_Blog SHALL 为标签页面使用像素风格的 UI 设计
