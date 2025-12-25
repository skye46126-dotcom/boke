# Implementation Plan: Personal Blog

## Overview

使用 TypeScript 和 Next.js 实现的全栈个人博客系统。采用 Next.js App Router 架构，API Routes 处理后端逻辑，数据库使用 PostgreSQL，图片存储使用云对象存储服务（AWS S3）。

## 架构说明

- **前端**：Next.js 14+ (App Router)
- **后端**：Next.js API Routes
- **数据库**：PostgreSQL
- **图片存储**：AWS S3
- **部署**：Vercel (推荐) 或其他支持 Next.js 的平台

## Tasks

- [x] 1. Next.js 项目初始化与集成架构
  - 创建 Next.js 项目并配置 TypeScript、ESLint、Prettier
  - 在 `frontend/lib/` 目录下配置数据库连接
  - 在 `.env.local` 中配置所有环境变量（数据库、AWS S3、管理路径）
  - 配置云存储 SDK
  - _Requirements: 8.4_

- [x] 2. 数据库模型和 API 基础
  - [x] 2.1 创建数据库表结构和模型
    - 在 `frontend/lib/models/` 实现 Article 和 ImageAsset 数据模型
    - 创建数据库迁移脚本（`frontend/lib/db/migrate.ts`）
    - 设置索引和约束
    - _Requirements: 5.5, 6.1_

  - [x]* 2.2 为数据模型编写属性测试
    - **Property 6: Article Data Integrity**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5, 7.4, 7.5**
    - 注：属性测试位于 `backend/src/` 目录，用于验证核心逻辑

  - [x] 2.3 在 `frontend/src/app/api/` 实现 API Routes
    - 创建文章 CRUD API 端点（`/api/articles`, `/api/articles/[slug]`）
    - 创建管理 API 端点（`/api/manage/[adminPath]/articles`）
    - 实现请求验证中间件（高阶函数包装器模式）
    - 设置统一的错误处理（`frontend/lib/middleware/validation.ts`）
    - _Requirements: 5.2, 5.3, 5.4, 7.4_

- [x] 3. 安全和认证系统
  - [x] 3.1 实现隐蔽 API 管理入口
    - 通过动态路由 `/api/manage/[adminPath]` 实现隐蔽入口
    - 实现路径验证中间件（`withAdminAuth` 高阶函数）
    - 配置安全响应处理
    - _Requirements: 4.1, 4.2_

  - [x] 3.2 实现输入验证和安全防护
    - 创建 SQL 注入防护（`sanitizeInput` 函数）
    - 实现输入验证（`withValidation` 高阶函数）
    - Next.js 内置 CSRF 保护
    - _Requirements: 4.4_

  - [x]* 3.3 为安全功能编写属性测试
    - **Property 4: Unauthorized Access Protection**
    - **Property 5: Input Validation Security**
    - **Validates: Requirements 4.3, 4.4**
    - 注：属性测试位于 `backend/src/` 目录

- [x] 4. 图片上传和云存储集成
  - [x] 4.1 实现图片上传 API Route
    - 在 `/api/manage/[adminPath]/upload/image` 实现上传逻辑
    - 使用 Next.js FormData API 处理文件上传
    - 实现 S3 上传逻辑（`frontend/lib/storage/s3.ts`）
    - 添加文件类型和大小验证
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 4.2 实现图片 URL 返回和 Markdown 生成
    - 返回可访问的图片 URL（S3 或 CDN）
    - 生成标准 Markdown 图片语法（`frontend/lib/utils/markdown.ts`）
    - 记录图片资产到数据库
    - _Requirements: 6.2, 6.3_

  - [x]* 4.3 为图片上传编写属性测试
    - **Property 7: Image Upload Workflow**
    - **Property 8: File Type Validation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
    - 注：属性测试位于 `backend/src/` 目录

- [x] 5. Checkpoint - 后端核心功能验证
  - 所有 API Routes 正常工作
  - 数据库连接和模型正常
  - 安全中间件正常工作
  - 图片上传到 S3 正常

- [x] 6. 前端文章展示系统
  - [x] 6.1 实现文章列表页面
    - 创建首页（`frontend/src/app/page.tsx`）
    - 创建文章列表组件（`ArticleList.tsx`）
    - 实现分页组件（`Pagination.tsx`）
    - 添加响应式布局
    - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3_

  - [x] 6.2 实现文章详情页面
    - 创建动态路由（`frontend/src/app/articles/[slug]/page.tsx`）
    - 创建文章详情组件
    - 集成 Markdown 渲染器
    - 添加语法高亮支持（highlight.js）
    - _Requirements: 2.1, 2.5_

  - [x] 6.3 实现 Markdown 内容渲染
    - 创建 MarkdownContent 组件
    - 使用 marked 解析 Markdown
    - 使用 DOMPurify 清理 HTML
    - 支持链接、图片、视频（iframe）渲染
    - 优化媒体内容加载（懒加载）
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ]* 6.4 为前端渲染编写属性测试
    - **Property 1: Article List Ordering and Filtering**
    - **Property 2: Pagination Calculation**
    - **Property 3: Comprehensive Markdown Rendering**
    - **Validates: Requirements 1.1, 1.2, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 7. 后台管理界面
  - [x] 7.1 创建文章管理列表页面
    - 创建管理后台首页（`frontend/src/app/admin/page.tsx`）
    - 创建登录页面（`frontend/src/app/admin/login/page.tsx`）
    - 实现文章列表展示（表格形式）
    - 添加编辑和删除操作
    - 显示文章状态和时间信息
    - 显示统计信息（总数、已发布、草稿）
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 7.2 实现 Markdown 编辑器
    - 创建 ArticleEditor 组件
    - 添加实时预览功能
    - 集成图片上传功能
    - 自动生成 URL slug
    - _Requirements: 5.1, 6.3_

  - [x] 7.3 实现文章创建和编辑功能
    - 创建新建文章页面（`/admin/articles/new`）
    - 创建编辑文章页面（`/admin/articles/[id]`）
    - 实现草稿和发布状态切换
    - 添加表单验证
    - _Requirements: 5.2, 5.3_

  - [ ] 7.4 为管理界面编写属性测试
    - **Property 9: Article Management Data Completeness**
    - **Validates: Requirements 7.2**

- [ ] 8. SEO 和性能优化
  - [x] 8.1 实现 SEO meta 标签生成
    - 为每个页面生成动态 title 和 description
    - 添加 Open Graph 和 Twitter Card 标签
    - 实现 JSON-LD 结构化数据（文章、网站、面包屑）
    - 使用 Next.js Metadata API
    - _Requirements: 8.2_

  - [x] 8.2 配置 CDN 和性能优化
    - 配置 Next.js Image 组件（AVIF/WebP 格式、响应式尺寸）
    - 实现 API 缓存策略（文章列表、详情页）
    - 自动生成 sitemap.xml 和 robots.txt
    - 添加性能监控工具
    - 创建性能优化文档（PERFORMANCE.md）
    - _Requirements: 8.3_

  - [ ]* 8.3 为 SEO 功能编写属性测试
    - **Property 10: SEO Meta Tag Generation**
    - **Validates: Requirements 8.2**

- [ ] 9. 集成测试和部署准备
  - [ ] 9.1 实现端到端测试
    - 测试完整的文章发布流程
    - 测试图片上传和显示流程
    - 测试管理界面核心操作
    - _Requirements: All_

  - [ ]* 9.2 编写单元测试
    - 为关键组件编写单元测试
    - 测试错误处理和边界情况
    - 验证组件集成点
    - _Requirements: All_

  - [x] 9.3 配置生产环境部署
    - 创建完整部署指南（DEPLOYMENT.md）
    - 包含 Vercel 部署步骤（推荐）
    - 包含 Docker 部署方案
    - 包含其他平台部署选项（Railway、Netlify）
    - 配置环境变量清单
    - 部署后检查清单
    - 监控和维护指南
    - _Requirements: 8.4_
    - 配置数据库连接（生产环境）
    - 配置自定义域名
    - _Requirements: 8.4_

- [ ] 10. Final Checkpoint - 完整系统验证
  - 确保所有功能正常工作
  - 验证生产环境部署
  - 性能测试
  - 安全检查

## Notes

- **架构变更**：已从 Express + Next.js 迁移到 Next.js 集成架构
- **后端代码位置**：`backend/` 目录保留用于属性测试，实际 API 在 `frontend/src/app/api/`
- **标记 `*` 的任务**：可选任务，可以跳过以加快 MVP 开发
- **属性测试**：使用 fast-check 库，最少 100 次迭代
- **部署推荐**：Vercel 原生支持 Next.js，部署最简单