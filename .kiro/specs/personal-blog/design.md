# Design Document

## Overview

个人博客系统采用 Next.js 全栈架构，为博主提供便捷的内容管理体验，为访客提供优秀的阅读体验。系统核心特点包括无登录后台、云原生存储、响应式设计和高性能渲染。

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Next.js Application"
        subgraph "Frontend Pages (访客端)"
            A[文章列表页 /] --> B[文章详情页 /articles/[slug]]
            B --> D[Markdown 渲染器]
            D --> E[语法高亮 highlight.js]
            D --> F[媒体渲染]
        end
        
        subgraph "Admin Pages (博主端)"
            G[登录页 /admin/login] --> H[管理首页 /admin]
            H --> I[文章编辑器 /admin/articles/[id]]
            I --> J[图片上传组件]
        end
        
        subgraph "API Routes"
            API1[/api/articles] --> L
            API2[/api/articles/[slug]] --> L
            API3[/api/manage/[adminPath]/articles] --> L
            API4[/api/manage/[adminPath]/upload/image] --> K
        end
    end
    
    subgraph "Data Layer"
        L[PostgreSQL 数据库]
        K[AWS S3 云存储]
        M[CDN 静态资源]
    end
    
    J --> API4
    K --> M
    F --> M
```

### Technology Stack

**Next.js 全栈架构**:
- 框架: Next.js 14+ (App Router)
- 前端: React 18+ with Server Components
- 后端: Next.js API Routes
- 样式: CSS Modules + 响应式设计
- TypeScript: 全栈类型安全

**核心库**:
- Markdown 渲染: marked.js
- HTML 清理: DOMPurify (isomorphic-dompurify)
- 语法高亮: highlight.js
- 数据库客户端: pg (PostgreSQL)
- 云存储: @aws-sdk/client-s3

**Infrastructure**:
- 数据库: PostgreSQL
- 云存储: AWS S3
- CDN: CloudFront 或 S3 + CDN
- 部署: Vercel (推荐) 或其他支持 Next.js 的平台

### Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页（文章列表）
│   │   ├── articles/
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # 文章详情页
│   │   ├── admin/             # 管理后台
│   │   │   ├── page.tsx       # 管理首页
│   │   │   ├── login/
│   │   │   │   └── page.tsx   # 登录页
│   │   │   └── articles/
│   │   │       ├── new/
│   │   │       │   └── page.tsx  # 新建文章
│   │   │       └── [id]/
│   │   │           └── page.tsx  # 编辑文章
│   │   └── api/               # API Routes
│   │       ├── articles/
│   │       │   ├── route.ts   # GET /api/articles
│   │       │   └── [slug]/
│   │       │       └── route.ts  # GET /api/articles/[slug]
│   │       └── manage/
│   │           └── [adminPath]/
│   │               ├── articles/
│   │               │   ├── route.ts      # GET, POST
│   │               │   └── [id]/
│   │               │       └── route.ts  # GET, PUT, DELETE
│   │               ├── stats/
│   │               │   └── route.ts      # GET
│   │               └── upload/
│   │                   ├── image/
│   │                   │   └── route.ts  # POST
│   │                   └── images/
│   │                       ├── route.ts  # GET
│   │                       └── [id]/
│   │                           └── route.ts  # DELETE
│   ├── components/            # React 组件
│   │   ├── ArticleList.tsx
│   │   ├── Pagination.tsx
│   │   ├── MarkdownContent.tsx
│   │   └── ArticleEditor.tsx
│   └── types/                 # TypeScript 类型定义
│       └── article.ts
├── lib/                       # 后端逻辑
│   ├── db/
│   │   ├── connection.ts      # 数据库连接
│   │   └── migrate.ts         # 数据库迁移
│   ├── models/
│   │   ├── Article.ts         # 文章模型
│   │   └── ImageAsset.ts      # 图片资产模型
│   ├── middleware/
│   │   └── validation.ts      # 验证和安全中间件
│   ├── storage/
│   │   └── s3.ts             # S3 上传逻辑
│   └── utils/
│       ├── slug.ts           # Slug 生成
│       └── markdown.ts       # Markdown 工具
└── .env.local                # 环境变量

backend/                      # 保留用于属性测试
├── src/
│   ├── models/
│   │   └── __tests__/       # 属性测试
│   ├── middleware/
│   │   └── __tests__/       # 属性测试
│   └── routes/
│       └── __tests__/       # 属性测试
```

## Components and Interfaces

### Frontend Components

#### ArticleList Component
```typescript
interface ArticleListProps {
  articles: Article[]
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}
```

#### Pagination Component
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}
```

#### ArticleDetail Component (Server Component)
```typescript
// 服务端组件，直接获取数据
async function getArticle(slug: string): Promise<Article | null>
```

#### MarkdownRenderer Component
```typescript
interface MarkdownRendererProps {
  content: string
}

// 使用 marked + DOMPurify + highlight.js
```

#### ArticleEditor Component
```typescript
interface ArticleEditorProps {
  initialTitle?: string
  initialSlug?: string
  initialContent?: string
  initialExcerpt?: string
  initialStatus?: 'draft' | 'published'
  onSave: (data: ArticleData) => Promise<void>
  onCancel: () => void
  saving?: boolean
```

### API Routes (Next.js)

#### Public API Routes

**GET /api/articles**
- 获取已发布文章列表（分页）
- Query: `page`, `limit`
- Response: `{ success: boolean, data: PaginatedArticles }`

**GET /api/articles/[slug]**
- 根据 slug 获取文章详情
- 只返回已发布的文章
- Response: `{ success: boolean, data: Article }`

#### Admin API Routes

所有管理 API 都需要正确的 `adminPath`：

**GET /api/manage/[adminPath]/articles**
- 获取所有文章（包括草稿）
- Response: `{ success: boolean, data: Article[] }`

**POST /api/manage/[adminPath]/articles**
- 创建新文章
- Body: `{ title, content, excerpt?, slug?, status }`
- Response: `{ success: boolean, data: Article }`

**GET /api/manage/[adminPath]/articles/[id]**
- 根据 ID 获取文章
- Response: `{ success: boolean, data: Article }`

**PUT /api/manage/[adminPath]/articles/[id]**
- 更新文章
- Body: `{ title?, content?, excerpt?, slug?, status? }`
- Response: `{ success: boolean, data: Article }`

**DELETE /api/manage/[adminPath]/articles/[id]**
- 删除文章
- Response: `{ success: boolean, message: string }`

**GET /api/manage/[adminPath]/stats**
- 获取统计信息
- Response: `{ success: boolean, data: { total, published, draft } }`

**POST /api/manage/[adminPath]/upload/image**
- 上传图片到 S3
- Body: FormData with `image` field
- Response: `{ success: boolean, data: { id, url, filename, size, markdown } }`

**GET /api/manage/[adminPath]/upload/images**
- 获取所有上传的图片
- Query: `limit`
- Response: `{ success: boolean, data: ImageAsset[] }`

**DELETE /api/manage/[adminPath]/upload/images/[id]**
- 删除图片记录（不删除 S3 文件）
- Response: `{ success: boolean, message: string }`

### Middleware (High-Order Functions)

#### withErrorHandler
```typescript
export function withErrorHandler<T extends any[]>(
  handler: (request: NextRequest, ...parameters: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...parameters: T): Promise<NextResponse> => {
    try {
      return await handler(request, ...parameters);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
```

#### withAdminAuth
```typescript
export function withAdminAuth<T extends any[]>(
  handler: (request: NextRequest, ...parameters: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...parameters: T): Promise<NextResponse> => {
    const adminPath = process.env.ADMIN_PATH;
    const url = new URL(request.url);
    
    if (!adminPath || !url.pathname.includes(adminPath)) {
      return NextResponse.json(
        { success: false, message: 'Not found' },
        { status: 404 }
      );
    }
    
    return await handler(request, ...parameters);
  };
}
```

#### withValidation
```typescript
export function withValidation<T extends any[]>(
  handler: (request: NextRequest, ...parameters: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...parameters: T): Promise<NextResponse> => {
    const body = await request.json().catch(() => ({}));
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams);
    
    // SQL 注入检查
    if (sanitizeInput(body) || sanitizeInput(query)) {
      return NextResponse.json(
        { success: false, message: 'Invalid input detected' },
        { status: 400 }
      );
    }
    
    return await handler(request, ...parameters);
  };
}
```

## Data Models

### Article Model
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published'))
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
```

### Image Assets Model
```sql
CREATE TABLE image_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/gif', 'image/webp'))
);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Article List Ordering and Filtering
*For any* collection of articles with mixed statuses and timestamps, the frontend article list should only include published articles and display them in descending order by publication date.
**Validates: Requirements 1.1, 1.4**

### Property 2: Pagination Calculation
*For any* total number of articles and page size, the pagination system should correctly calculate the number of pages and return the appropriate subset of articles for each page.
**Validates: Requirements 1.2**

### Property 3: Comprehensive Markdown Rendering
*For any* valid Markdown content containing links, images, videos, and code blocks, the renderer should produce valid HTML with proper link navigation, image display, iframe embedding, and syntax highlighting.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 4: Unauthorized Access Protection
*For any* request to non-existent or unauthorized admin URLs, the system should return generic error responses without revealing the existence of admin functionality.
**Validates: Requirements 4.3**

### Property 5: Input Validation Security
*For any* user input containing potential SQL injection patterns, the system should sanitize or reject the input without executing malicious code.
**Validates: Requirements 4.4**

### Property 6: Article Data Integrity
*For any* article creation, update, or status change operation, all article properties (title, content, status, timestamps) should be preserved accurately and persist correctly in storage.
**Validates: Requirements 5.2, 5.3, 5.4, 5.5, 7.4, 7.5**

### Property 7: Image Upload Workflow
*For any* valid image file upload, the system should store the file to cloud storage, return a valid accessible URL, and generate correct Markdown syntax for editor insertion.
**Validates: Requirements 6.1, 6.2, 6.3**

### Property 8: File Type Validation
*For any* file upload attempt, the system should accept only valid image formats and reject non-image files with appropriate error messages.
**Validates: Requirements 6.4, 6.5**

### Property 9: Article Management Data Completeness
*For any* article in the management interface, the displayed data should include all required fields (title, status, creation time) and provide accurate information.
**Validates: Requirements 7.2**

### Property 10: SEO Meta Tag Generation
*For any* page in the system, the generated HTML should include appropriate title and meta tags that accurately reflect the page content.
**Validates: Requirements 8.2**

## Error Handling

### Frontend Error Handling
- **网络错误**: 显示友好的错误提示，提供重试选项
- **404 错误**: 自定义 404 页面，引导用户返回首页
- **Markdown 渲染错误**: 降级显示原始文本，记录错误日志
- **图片加载失败**: 显示占位符，避免布局破坏

### Backend Error Handling
- **文件上传错误**: 
  - 文件大小超限: 返回 413 状态码和明确错误信息
  - 文件类型不支持: 返回 400 状态码和支持格式列表
  - 云存储失败: 返回 500 状态码，记录详细错误日志
- **数据库错误**:
  - 连接失败: 返回 503 状态码，启动重试机制
  - 约束违反: 返回 400 状态码和具体错误信息
  - 查询超时: 返回 504 状态码，优化查询性能
- **输入验证错误**:
  - 必填字段缺失: 返回 400 状态码和字段列表
  - 格式不正确: 返回 400 状态码和格式要求
  - SQL 注入尝试: 记录安全日志，返回通用错误

### Security Error Handling
- **未授权访问**: 返回通用 404 错误，不暴露管理接口存在
- **CSRF 攻击**: 返回 403 错误，记录攻击日志
- **文件上传攻击**: 严格验证文件类型，拒绝可执行文件

## Testing Strategy

### Dual Testing Approach
系统将采用单元测试和基于属性的测试相结合的方法：

**单元测试**:
- 验证具体示例和边界情况
- 测试错误处理和异常情况
- 验证组件集成点
- 测试特定的用户交互场景

**基于属性的测试**:
- 验证跨所有输入的通用属性
- 通过随机化实现全面的输入覆盖
- 每个属性测试最少运行 100 次迭代
- 每个正确性属性对应一个属性测试

### Property-Based Testing Configuration
- **测试框架**: 根据实现语言选择 (如 JavaScript 使用 fast-check, Python 使用 Hypothesis)
- **测试标记格式**: **Feature: personal-blog, Property {number}: {property_text}**
- **迭代次数**: 每个属性测试最少 100 次
- **数据生成器**: 为文章、用户输入、文件等创建智能生成器

### Testing Coverage Areas

**Frontend Testing**:
- Markdown 渲染组件的属性测试
- 响应式布局的视觉回归测试
- 用户交互的集成测试
- 性能基准测试

**Backend Testing**:
- API 端点的属性测试
- 数据库操作的事务测试
- 文件上传流程的集成测试
- 安全防护的渗透测试

**End-to-End Testing**:
- 完整的文章发布流程
- 图片上传和显示流程
- 管理界面的核心操作流程

### Test Data Management
- 使用工厂模式生成测试数据
- 为属性测试创建约束性数据生成器
- 测试环境使用独立的数据库
- 自动清理测试产生的云存储文件