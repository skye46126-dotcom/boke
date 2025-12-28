# Design Document: Static Blog Conversion

## Overview

将现有动态博客系统转换为纯静态博客，使用 Next.js 的静态导出功能。核心变化是将数据源从 PostgreSQL 数据库改为本地文件系统（Markdown + JSON），构建时生成所有静态页面。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Build Time                              │
├─────────────────────────────────────────────────────────────┤
│  /content/                    │  /lib/                       │
│  ├── articles/               │  ├── articles.ts (读取MD)    │
│  │   ├── hello-world.md      │  ├── gallery.ts (读取JSON)   │
│  │   └── my-post.md          │  └── tags.ts (标签处理)      │
│  └── gallery/                │                               │
│      ├── albums.json         │                               │
│      └── images.json         │                               │
├─────────────────────────────────────────────────────────────┤
│  /public/images/gallery/     │  Next.js Static Generation   │
│  ├── album1/                 │  ├── getStaticProps          │
│  │   ├── photo1.jpg          │  └── getStaticPaths          │
│  │   └── photo2.jpg          │                               │
│  └── album2/                 │                               │
├─────────────────────────────────────────────────────────────┤
│                      Output: /out/                           │
│  ├── index.html              │  ├── gallery/                 │
│  ├── articles/               │  │   ├── index.html           │
│  │   ├── hello-world.html    │  │   └── album/[id].html      │
│  │   └── my-post.html        │  └── tags/                    │
│  └── ...                     │      ├── index.html           │
│                              │      └── [tag].html           │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Content Directory Structure

```
/content/
├── articles/
│   └── [slug].md          # Markdown 文章文件
└── gallery/
    ├── albums.json        # 相册集配置
    └── images.json        # 图片列表配置

/public/images/gallery/
└── [album-id]/
    └── [image-file]       # 实际图片文件
```

### 2. Article File Format (Markdown + Frontmatter)

```markdown
---
title: "文章标题"
slug: "article-slug"
date: "2024-01-15"
status: "published"
excerpt: "文章摘要"
cover_image: "/images/cover.jpg"
tags:
  - "技术"
  - "前端"
---

文章正文内容...
```

### 3. Gallery JSON Schema

**albums.json:**
```json
{
  "albums": [
    {
      "id": "album-1",
      "name": "相册名称",
      "description": "相册描述",
      "cover_url": "/images/gallery/album-1/cover.jpg",
      "created_at": "2024-01-15"
    }
  ]
}
```

**images.json:**
```json
{
  "images": [
    {
      "id": "img-1",
      "title": "图片标题",
      "img_url": "/images/gallery/album-1/photo1.jpg",
      "category": "风景",
      "album_id": "album-1",
      "created_at": "2024-01-15"
    }
  ]
}
```

### 4. Data Access Layer Interface

```typescript
// /lib/articles.ts
interface Article {
  slug: string;
  title: string;
  date: string;
  status: 'published' | 'draft';
  excerpt?: string;
  cover_image?: string;
  tags: string[];
  content: string;        // 渲染后的 HTML
  rawContent: string;     // 原始 Markdown
}

function getArticles(): Article[]
function getArticleBySlug(slug: string): Article | null
function getPublishedArticles(): Article[]

// /lib/gallery.ts
interface GalleryAlbum {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  image_count: number;
  images?: GalleryItem[];
}

interface GalleryItem {
  id: string;
  title: string;
  img_url: string;
  category: string;
  album_id?: string;
}

function getAlbums(): GalleryAlbum[]
function getAlbumById(id: string): GalleryAlbum | null
function getGalleryItems(): GalleryItem[]
function getCategories(): string[]

// /lib/tags.ts
interface TagInfo {
  name: string;
  count: number;
}

function getAllTags(): TagInfo[]
function getArticlesByTag(tag: string): Article[]
```

## Data Models

### Article Frontmatter Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | 文章标题 |
| slug | string | Yes | URL 路径标识 |
| date | string (ISO) | Yes | 发布日期 |
| status | enum | Yes | published / draft |
| excerpt | string | No | 文章摘要 |
| cover_image | string | No | 封面图片路径 |
| tags | string[] | No | 标签数组 |

### Gallery Album Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | 唯一标识 |
| name | string | Yes | 相册名称 |
| description | string | No | 相册描述 |
| cover_url | string | No | 封面图片路径 |
| created_at | string | No | 创建日期 |

### Gallery Image Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | 唯一标识 |
| title | string | Yes | 图片标题 |
| img_url | string | Yes | 图片路径 |
| category | string | Yes | 分类 |
| album_id | string | No | 所属相册 ID |
| created_at | string | No | 创建日期 |



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Frontmatter Round-Trip Parsing

*For any* valid article frontmatter containing title, slug, date, status, excerpt, cover_image, and tags fields, parsing the Markdown file should extract all fields with their original values intact.

**Validates: Requirements 1.2, 8.1**

### Property 2: Draft Article Filtering

*For any* collection of articles with mixed status values (published/draft), the `getPublishedArticles()` function should return only articles where status equals "published", and the count should equal the number of published articles in the source.

**Validates: Requirements 1.3**

### Property 3: Article Slug Lookup Consistency

*For any* article slug that exists in the content directory, `getArticleBySlug(slug)` should return the corresponding article. For any slug that does not exist, it should return null.

**Validates: Requirements 4.2, 1.5**

### Property 4: Gallery JSON Configuration Integrity

*For any* valid albums.json and images.json configuration, `getAlbums()` and `getGalleryItems()` should return data structures that match the JSON content exactly, preserving all fields and relationships.

**Validates: Requirements 2.1, 2.2, 2.4, 4.3, 4.5**

### Property 5: Album-Image Relationship Preservation

*For any* album ID, `getAlbumById(id)` should return the album with its `images` array containing exactly the images where `album_id` matches the album's ID.

**Validates: Requirements 4.4**

### Property 6: Tag Aggregation Correctness

*For any* collection of articles with tags, `getAllTags()` should return a list where each tag's count equals the number of articles containing that tag, and no tags are missing or duplicated.

**Validates: Requirements 8.2**

### Property 7: Tag-Based Article Filtering

*For any* tag that exists in at least one article, `getArticlesByTag(tag)` should return exactly the articles that contain that tag in their tags array.

**Validates: Requirements 8.3**

### Property 8: Static Paths Generation Completeness

*For any* set of articles, albums, and tags, the `getStaticPaths()` functions should generate paths that cover all published articles (by slug), all albums (by id), and all unique tags.

**Validates: Requirements 1.5, 3.2, 3.3, 8.4**

### Property 9: Article Export Round-Trip

*For any* article data from the database, exporting to Markdown and then parsing back should produce equivalent data (title, slug, date, status, excerpt, tags match the original).

**Validates: Requirements 7.1, 7.3**

### Property 10: Gallery Export Round-Trip

*For any* gallery data from the database (albums and images), exporting to JSON and then parsing back should produce equivalent data structures.

**Validates: Requirements 7.2, 7.4**

## Error Handling

| Scenario | Handling |
|----------|----------|
| Missing content directory | Return empty array, log warning |
| Invalid frontmatter format | Skip article, log error with filename |
| Invalid JSON format | Throw error with descriptive message |
| Missing required fields | Use default values where possible, skip otherwise |
| Image file not found | Keep reference in data, handle gracefully in UI |
| Duplicate slugs | Use first occurrence, log warning |

## Testing Strategy

### Unit Tests
- Test frontmatter parsing with various field combinations
- Test JSON schema validation
- Test edge cases: empty files, missing fields, special characters

### Property-Based Tests
- Use fast-check library for TypeScript
- Minimum 100 iterations per property test
- Generate random but valid content structures
- Tag format: **Feature: static-blog-conversion, Property N: [property_text]**

### Integration Tests
- Test full build process with sample content
- Verify output directory structure
- Test page rendering with sample data
