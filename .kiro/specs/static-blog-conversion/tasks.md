# Implementation Plan: Static Blog Conversion

## Overview

将动态博客转换为静态博客，分阶段实现：先创建内容目录结构和数据读取层，然后修改页面组件使用静态数据，最后移除后端依赖并添加数据迁移工具。

## Tasks

- [x] 1. 创建内容目录结构和示例文件
  - [x] 1.1 创建 `/content/articles/` 目录和示例 Markdown 文件
    - 创建目录结构
    - 添加 2-3 个示例文章文件，包含完整 frontmatter
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 创建 `/content/gallery/` 目录和 JSON 配置文件
    - 创建 albums.json 和 images.json
    - 添加示例数据
    - _Requirements: 2.1, 2.2_
  - [x] 1.3 创建 `/public/images/gallery/` 目录结构
    - 创建示例相册目录
    - _Requirements: 2.3_

- [x] 2. 实现文章数据读取层
  - [x] 2.1 创建 `/lib/articles.ts` 文件
    - 实现 Markdown 文件读取和 frontmatter 解析
    - 使用 gray-matter 库解析 frontmatter
    - 使用 remark/rehype 渲染 Markdown 为 HTML
    - _Requirements: 1.1, 1.2, 1.4_
  - [x] 2.2 实现 getArticles, getArticleBySlug, getPublishedArticles 函数
    - 实现文章列表获取
    - 实现按 slug 查询
    - 实现草稿过滤
    - _Requirements: 4.1, 4.2, 1.3_
  - [ ]* 2.3 编写 frontmatter 解析属性测试
    - **Property 1: Frontmatter Round-Trip Parsing**
    - **Validates: Requirements 1.2, 8.1**
  - [ ]* 2.4 编写草稿过滤属性测试
    - **Property 2: Draft Article Filtering**
    - **Validates: Requirements 1.3**

- [x] 3. 实现相册数据读取层
  - [x] 3.1 创建 `/lib/gallery.ts` 文件
    - 实现 JSON 配置文件读取
    - 定义类型接口
    - _Requirements: 2.1, 2.2_
  - [x] 3.2 实现 getAlbums, getAlbumById, getGalleryItems, getCategories 函数
    - 实现相册列表获取
    - 实现按 ID 查询（包含图片列表）
    - 实现图片列表获取
    - 实现分类列表获取
    - _Requirements: 4.3, 4.4, 4.5_
  - [ ]* 3.3 编写 JSON 配置读取属性测试
    - **Property 4: Gallery JSON Configuration Integrity**
    - **Validates: Requirements 2.1, 2.2, 2.4, 4.3, 4.5**
  - [ ]* 3.4 编写相册-图片关联属性测试
    - **Property 5: Album-Image Relationship Preservation**
    - **Validates: Requirements 4.4**

- [x] 4. 实现标签系统
  - [x] 4.1 创建 `/lib/tags.ts` 文件
    - 实现 getAllTags 函数（返回标签及文章数量）
    - 实现 getArticlesByTag 函数
    - _Requirements: 8.2, 8.3_
  - [ ]* 4.2 编写标签聚合属性测试
    - **Property 6: Tag Aggregation Correctness**
    - **Validates: Requirements 8.2**
  - [ ]* 4.3 编写标签过滤属性测试
    - **Property 7: Tag-Based Article Filtering**
    - **Validates: Requirements 8.3**

- [x] 5. Checkpoint - 确保数据层测试通过
  - 运行所有属性测试
  - 确保数据读取函数正常工作
  - 如有问题请询问用户

- [x] 6. 修改文章页面使用静态数据
  - [x] 6.1 修改 `/app/articles/page.tsx` 文章列表页
    - 移除 API 调用
    - 使用 getPublishedArticles() 获取数据
    - 添加 generateStaticParams 导出
    - _Requirements: 3.2, 5.1_
  - [x] 6.2 修改 `/app/articles/[slug]/page.tsx` 文章详情页
    - 移除 API 调用
    - 使用 getArticleBySlug() 获取数据
    - 添加 generateStaticParams 导出
    - _Requirements: 1.5, 3.2, 5.1_
  - [x] 6.3 在文章页面添加标签显示
    - 显示文章标签列表
    - 标签链接到 `/tags/[tag]`
    - _Requirements: 8.6_

- [x] 7. 修改相册页面使用静态数据
  - [x] 7.1 修改 `/app/gallery/page.tsx` 和 `GalleryClient.tsx`
    - 移除 API 调用
    - 使用 getAlbums(), getGalleryItems(), getCategories() 获取数据
    - 将数据作为 props 传递给客户端组件
    - _Requirements: 2.4, 5.1_
  - [x] 7.2 修改 `/app/gallery/album/[id]/page.tsx` 相册详情页
    - 移除 API 调用
    - 使用 getAlbumById() 获取数据
    - 添加 generateStaticParams 导出
    - _Requirements: 3.3, 5.1_

- [x] 8. 创建标签页面
  - [x] 8.1 创建 `/app/tags/page.tsx` 标签索引页
    - 显示所有标签及文章数量
    - 使用像素风格 UI
    - _Requirements: 8.5, 8.7_
  - [x] 8.2 创建 `/app/tags/[tag]/page.tsx` 标签详情页
    - 显示该标签下的所有文章
    - 添加 generateStaticParams 导出
    - _Requirements: 8.4, 8.7_
  - [ ]* 8.3 编写静态路径生成属性测试
    - **Property 8: Static Paths Generation Completeness**
    - **Validates: Requirements 1.5, 3.2, 3.3, 8.4**

- [x] 9. Checkpoint - 确保页面正常工作
  - 测试文章列表和详情页
  - 测试相册列表和详情页
  - 测试标签页面
  - 如有问题请询问用户

- [x] 10. 配置 Next.js 静态导出
  - [x] 10.1 修改 `next.config.js` 配置
    - 添加 `output: 'export'` 配置
    - 配置图片优化（使用 unoptimized 或自定义 loader）
    - _Requirements: 3.1, 3.5_
  - [x] 10.2 更新 `package.json` 构建脚本
    - 添加 `build:static` 脚本
    - _Requirements: 3.1_

- [ ] 11. 创建数据迁移工具
  - [ ] 11.1 创建 `/scripts/export-articles.ts` 脚本
    - 从数据库读取文章
    - 导出为 Markdown 文件（含 frontmatter）
    - _Requirements: 7.1, 7.3_
  - [ ] 11.2 创建 `/scripts/export-gallery.ts` 脚本
    - 从数据库读取相册和图片数据
    - 导出为 JSON 文件
    - 可选：下载远程图片到本地
    - _Requirements: 7.2, 7.4, 7.5_
  - [ ]* 11.3 编写文章导出 round-trip 测试
    - **Property 9: Article Export Round-Trip**
    - **Validates: Requirements 7.1, 7.3**
  - [ ]* 11.4 编写相册导出 round-trip 测试
    - **Property 10: Gallery Export Round-Trip**
    - **Validates: Requirements 7.2, 7.4**

- [x] 12. 清理和移除后端依赖
  - [x] 12.1 移除后端相关文件和配置
    - 删除或归档 `/backend` 目录
    - 删除 `docker-compose.yml`
    - 更新 `.gitignore`
    - _Requirements: 5.2, 5.3, 5.4_
  - [x] 12.2 清理前端中的 API 调用残留
    - 搜索并移除所有 `localhost:3001` 引用
    - 移除管理后台页面（或保留为本地开发工具）
    - _Requirements: 5.1_
  - [x] 12.3 更新项目文档
    - 更新 README.md 说明新的使用方式
    - 添加内容编辑指南
    - _Requirements: 5.5_

- [x] 13. Final Checkpoint - 完整测试
  - 运行 `npm run build` 确保静态导出成功
  - 检查 `/out` 目录内容
  - 本地预览静态站点
  - 确保所有功能正常
  - 如有问题请询问用户

## Notes

- Tasks marked with `*` are optional property-based tests
- 建议先运行迁移脚本导出现有数据，再进行页面修改
- 静态导出后，管理后台将不可用，需要直接编辑文件
- 图片建议使用相对路径 `/images/gallery/...`
