# 部署指南

本文档提供个人博客系统的完整部署指南，包括 Vercel 部署（推荐）和其他平台部署选项。

## 前置要求

- Node.js 18+ 
- PostgreSQL 数据库（推荐使用云数据库服务）
- AWS S3 存储桶（用于图片存储）
- Git 仓库（GitHub、GitLab 或 Bitbucket）

---

## 方案一：Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的开箱即用体验。

### 1. 准备数据库

#### 选项 A: Vercel Postgres（推荐）

```bash
# 在 Vercel 项目中添加 Postgres 存储
# 1. 访问 Vercel Dashboard
# 2. 选择项目 > Storage > Create Database
# 3. 选择 Postgres
# 4. Vercel 会自动设置 DATABASE_URL 环境变量
```

#### 选项 B: 其他云数据库

推荐服务：
- **Neon**: https://neon.tech （免费套餐，PostgreSQL）
- **Supabase**: https://supabase.com （免费套餐，PostgreSQL）
- **Railway**: https://railway.app （PostgreSQL）
- **AWS RDS**: https://aws.amazon.com/rds/ （生产级）

### 2. 准备 AWS S3

```bash
# 1. 创建 S3 存储桶
aws s3 mb s3://your-blog-images

# 2. 配置 CORS（允许前端上传）
cat > cors.json << EOF
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
EOF

aws s3api put-bucket-cors --bucket your-blog-images --cors-configuration file://cors.json

# 3. 配置公共读取权限（仅图片）
aws s3api put-bucket-policy --bucket your-blog-images --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-blog-images/*"
    }
  ]
}'

# 4. 创建 IAM 用户并获取访问密钥
# - 访问 AWS IAM Console
# - 创建新用户，附加 S3 权限策略
# - 生成访问密钥（Access Key ID 和 Secret Access Key）
```

### 3. 部署到 Vercel

#### 方法 A: 通过 Vercel Dashboard（推荐）

1. **连接 Git 仓库**
   ```bash
   # 1. 访问 https://vercel.com
   # 2. 点击 "Add New Project"
   # 3. 导入你的 Git 仓库
   # 4. 选择 "frontend" 作为根目录
   ```

2. **配置项目设置**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **配置环境变量**
   
   在 Vercel Dashboard > Settings > Environment Variables 中添加：

   ```bash
   # 数据库
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   
   # AWS S3
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-blog-images
   
   # CDN（可选，如果使用 CloudFront）
   NEXT_PUBLIC_CDN_URL=https://your-cdn.cloudfront.net
   
   # 应用配置
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   ADMIN_PATH=your-secret-admin-path-here
   
   # Node 环境
   NODE_ENV=production
   ```

4. **部署**
   ```bash
   # Vercel 会自动部署
   # 每次推送到 main 分支都会触发自动部署
   ```

#### 方法 B: 通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 在项目根目录运行
cd frontend
vercel

# 4. 按照提示配置项目
# 5. 设置环境变量
vercel env add DATABASE_URL
vercel env add AWS_ACCESS_KEY_ID
# ... 添加所有环境变量

# 6. 部署到生产环境
vercel --prod
```

### 4. 初始化数据库

```bash
# 方法 1: 使用 Vercel CLI 运行迁移
vercel env pull .env.local
npm run db:migrate

# 方法 2: 直接连接数据库执行 SQL
psql $DATABASE_URL < frontend/lib/db/schema.sql
```

### 5. 配置自定义域名

1. 在 Vercel Dashboard > Settings > Domains
2. 添加你的域名（例如：blog.example.com）
3. 按照提示配置 DNS 记录：
   ```
   Type: CNAME
   Name: blog (或 @)
   Value: cname.vercel-dns.com
   ```
4. 等待 DNS 传播（通常 5-30 分钟）
5. Vercel 会自动配置 SSL 证书

### 6. 验证部署

```bash
# 检查网站是否正常运行
curl https://your-domain.com

# 检查 API
curl https://your-domain.com/api/articles

# 检查 sitemap
curl https://your-domain.com/sitemap.xml

# 检查 robots.txt
curl https://your-domain.com/robots.txt
```

---

## 方案二：Docker 部署

适用于自托管或其他云平台（AWS EC2、DigitalOcean、Railway 等）。

### 1. 创建 Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. 更新 next.config.js

```javascript
// frontend/next.config.js
const nextConfig = {
  // ... 现有配置
  output: 'standalone', // 添加这一行
};
```

### 3. 创建 docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: blog
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://bloguser:${DB_PASSWORD}@postgres:5432/blog
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      ADMIN_PATH: ${ADMIN_PATH}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 4. 部署

```bash
# 1. 创建 .env 文件
cat > .env << EOF
DB_PASSWORD=your_secure_password
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
NEXT_PUBLIC_API_URL=https://your-domain.com
ADMIN_PATH=your-secret-path
EOF

# 2. 构建并启动
docker-compose up -d

# 3. 初始化数据库
docker-compose exec app npm run db:migrate

# 4. 查看日志
docker-compose logs -f app
```

---

## 方案三：其他平台

### Railway

```bash
# 1. 安装 Railway CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 初始化项目
railway init

# 4. 添加 PostgreSQL
railway add postgresql

# 5. 设置环境变量
railway variables set AWS_ACCESS_KEY_ID=xxx
railway variables set AWS_SECRET_ACCESS_KEY=xxx
# ... 其他变量

# 6. 部署
railway up
```

### Netlify

Netlify 主要用于静态站点，但也支持 Next.js：

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化
netlify init

# 4. 配置 netlify.toml
cat > netlify.toml << EOF
[build]
  command = "cd frontend && npm run build"
  publish = "frontend/.next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
EOF

# 5. 部署
netlify deploy --prod
```

---

## 部署后检查清单

### 功能测试

- [ ] 首页加载正常
- [ ] 文章列表显示正常
- [ ] 文章详情页可访问
- [ ] Markdown 渲染正确
- [ ] 图片显示正常
- [ ] 管理后台可访问（通过隐藏路径）
- [ ] 登录功能正常
- [ ] 创建文章功能正常
- [ ] 编辑文章功能正常
- [ ] 删除文章功能正常
- [ ] 图片上传功能正常

### SEO 检查

- [ ] sitemap.xml 可访问
- [ ] robots.txt 可访问
- [ ] Meta 标签正确显示
- [ ] Open Graph 标签正确
- [ ] JSON-LD 结构化数据正确

### 性能测试

```bash
# 使用 Lighthouse
lighthouse https://your-domain.com --view

# 目标分数
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 95
```

### 安全检查

- [ ] HTTPS 已启用
- [ ] 管理路径不可猜测
- [ ] API 路径受保护
- [ ] 环境变量未泄露
- [ ] CORS 配置正确
- [ ] SQL 注入防护正常

---

## 监控和维护

### 1. 设置监控

#### Vercel Analytics（推荐）

```bash
# 在 Vercel Dashboard 中启用 Analytics
# 自动收集 Web Vitals 和访问数据
```

#### Google Analytics

```typescript
// frontend/src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. 错误追踪

#### Sentry

```bash
# 安装 Sentry
npm install @sentry/nextjs

# 初始化
npx @sentry/wizard@latest -i nextjs

# 配置环境变量
SENTRY_DSN=your_sentry_dsn
```

### 3. 日志管理

```bash
# Vercel 自动收集日志
# 在 Dashboard > Logs 中查看

# 或使用 Vercel CLI
vercel logs
```

### 4. 备份策略

```bash
# 数据库备份（每日）
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# S3 备份（使用 AWS Backup 或版本控制）
aws s3 sync s3://your-blog-images s3://your-blog-images-backup
```

---

## 故障排查

### 构建失败

```bash
# 检查构建日志
vercel logs --build

# 常见问题：
# 1. 环境变量缺失 -> 检查 Vercel 环境变量配置
# 2. 依赖安装失败 -> 检查 package.json
# 3. TypeScript 错误 -> 本地运行 npm run build
```

### 数据库连接失败

```bash
# 测试数据库连接
psql $DATABASE_URL

# 检查：
# 1. DATABASE_URL 格式正确
# 2. 数据库服务运行中
# 3. 防火墙规则允许连接
# 4. SSL 配置正确（某些云数据库需要）
```

### 图片上传失败

```bash
# 检查 S3 配置
aws s3 ls s3://your-blog-images

# 检查：
# 1. AWS 凭证正确
# 2. S3 存储桶存在
# 3. CORS 配置正确
# 4. IAM 权限足够
```

---

## 成本估算

### Vercel 免费套餐

- 100 GB 带宽/月
- 无限部署
- 自动 HTTPS
- 全球 CDN
- **适合个人博客**

### 数据库

- Vercel Postgres: $0.10/GB 存储
- Neon: 免费套餐 3 GB
- Supabase: 免费套餐 500 MB

### AWS S3

- 存储: $0.023/GB/月
- 请求: $0.0004/1000 请求
- 传输: 前 100 GB 免费
- **预估**: $1-5/月（取决于流量）

### 总成本

- **小型博客**: $0-10/月（使用免费套餐）
- **中型博客**: $10-50/月
- **大型博客**: $50+/月

---

## 参考资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [AWS S3 文档](https://docs.aws.amazon.com/s3/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
