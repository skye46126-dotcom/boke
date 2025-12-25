# 性能优化指南

本文档描述了个人博客系统的性能优化策略和最佳实践。

## 已实施的优化

### 1. 图片优化

#### Next.js Image 组件配置
- **自动格式转换**：支持 AVIF 和 WebP 格式，自动选择最优格式
- **响应式图片**：配置多种设备尺寸，自动生成适配图片
- **懒加载**：图片默认懒加载，减少初始加载时间
- **CDN 支持**：配置 AWS S3 和 CloudFront 域名白名单

```javascript
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.amazonaws.com' },
    { protocol: 'https', hostname: '**.cloudfront.net' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

### 2. 缓存策略

#### API 路由缓存
- **文章列表**：60 秒缓存 + 5 分钟 stale-while-revalidate
- **文章详情**：5 分钟缓存 + 10 分钟 stale-while-revalidate
- **管理接口**：完全禁用缓存
- **静态资源**：长期缓存（1 年）

```typescript
// 使用示例
import { withCacheHeaders } from '@/lib/utils/cache';

const response = NextResponse.json({ data });
return withCacheHeaders(response, 'ARTICLE_LIST');
```

### 3. SEO 优化

#### 自动生成的 SEO 资源
- **sitemap.xml**：自动生成站点地图，包含所有文章
- **robots.txt**：配置搜索引擎爬虫规则
- **JSON-LD 结构化数据**：文章、网站、面包屑导航
- **Open Graph 标签**：社交媒体分享优化
- **Twitter Cards**：Twitter 分享优化

### 4. 构建优化

#### Next.js 配置
- **SWC 编译器**：使用 Rust 编写的快速编译器
- **压缩**：启用 gzip/brotli 压缩
- **Tree Shaking**：自动移除未使用的代码
- **代码分割**：按路由自动分割代码

### 5. Markdown 渲染优化

- **客户端渲染**：使用 `'use client'` 避免服务端渲染开销
- **HTML 清理**：使用 DOMPurify 确保安全性
- **语法高亮**：仅在需要时加载 highlight.js
- **懒加载图片**：Markdown 中的图片自动懒加载

## CDN 配置建议

### AWS CloudFront 配置

1. **创建 CloudFront 分发**
   - Origin: S3 存储桶
   - 启用 HTTPS
   - 启用压缩

2. **缓存策略**
   ```
   图片资源：
   - TTL: 31536000 秒（1 年）
   - 压缩: 启用
   - 查询字符串: 忽略
   ```

3. **更新环境变量**
   ```bash
   # .env.local
   NEXT_PUBLIC_CDN_URL=https://your-cdn-domain.cloudfront.net
   ```

### 使用 CDN URL

更新 S3 上传逻辑以返回 CDN URL：

```typescript
// frontend/lib/storage/s3.ts
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
const imageUrl = cdnUrl 
  ? `${cdnUrl}/${key}`
  : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
```

## 性能监控

### Web Vitals

使用 Next.js 内置的 Web Vitals 报告：

```typescript
// frontend/src/app/layout.tsx
import { reportWebVitals } from '@/lib/performance';

export { reportWebVitals };
```

### 关键指标

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

## 部署优化

### Vercel 部署（推荐）

Vercel 自动提供：
- **全球 CDN**：自动分发到全球边缘节点
- **自动压缩**：Brotli/Gzip 压缩
- **HTTP/2**：支持多路复用
- **自动缓存**：智能缓存策略

### 环境变量配置

```bash
# Vercel 项目设置
NEXT_PUBLIC_API_URL=https://your-domain.com
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_S3_BUCKET=...
NEXT_PUBLIC_CDN_URL=https://your-cdn-domain.cloudfront.net
ADMIN_PATH=your-secret-admin-path
```

## 性能测试

### 使用 Lighthouse

```bash
# 安装 Lighthouse CLI
npm install -g lighthouse

# 运行测试
lighthouse https://your-domain.com --view
```

### 目标分数

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

## 进一步优化建议

### 1. 数据库优化
- 为常用查询添加索引
- 使用连接池
- 实施查询缓存

### 2. 服务端渲染优化
- 使用 `generateStaticParams` 预渲染热门文章
- 实施增量静态再生成（ISR）

### 3. 客户端优化
- 实施 Service Worker 离线缓存
- 使用 React.lazy() 懒加载组件
- 优化 JavaScript 包大小

### 4. 监控和分析
- 集成 Google Analytics
- 使用 Sentry 错误追踪
- 实施自定义性能指标

## 故障排查

### 图片加载慢
1. 检查 CDN 配置
2. 验证图片格式转换
3. 确认懒加载正常工作

### API 响应慢
1. 检查数据库查询性能
2. 验证缓存策略
3. 考虑添加数据库索引

### 构建时间长
1. 检查依赖包大小
2. 使用 `next build --profile` 分析
3. 考虑使用 Turbopack（实验性）

## 参考资源

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)
- [Vercel Analytics](https://vercel.com/analytics)
