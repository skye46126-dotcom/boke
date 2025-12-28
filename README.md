# Personal Static Blog

超轻量级、高性能的静态个人博客系统。

## 特性

- 🚀 纯静态站点，无需后端服务器
- 📝 Markdown 文章，支持 frontmatter
- 🖼️ 本地图片相册系统
- 🏷️ 标签分类系统
- 📱 响应式像素风格设计
- ⚡ 极速加载，可部署到任何静态托管

## 技术栈

- Next.js 14 (静态导出)
- React 18
- TypeScript
- Marked.js (Markdown 渲染)
- gray-matter (Frontmatter 解析)

## 快速开始

### 安装

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 构建静态站点

```bash
npm run build
```

构建产物在 `frontend/.next` 目录。

## 内容管理

### 方式一：Decap CMS（推荐）

本项目集成了 Decap CMS，提供可视化的内容管理界面。

**本地开发使用：**

```bash
# 同时启动 Next.js 和 CMS 后端
cd frontend
npm run dev:all
```

然后访问 http://localhost:3000/admin 进入管理界面。

**生产环境：**
- 部署到 Netlify 后，通过 Netlify Identity 进行身份验证
- 访问 `https://your-site.netlify.app/admin`

### 方式二：直接编辑文件

文章存放在 `frontend/content/articles/` 目录，使用 Markdown 格式：

```markdown
---
title: 文章标题
date: 2024-01-01
status: published
excerpt: 文章摘要
cover_image: /images/cover.jpg
tags:
  - 标签1
  - 标签2
---

文章正文内容...
```

- `status: published` - 已发布（显示在网站）
- `status: draft` - 草稿（不显示）

### 相册

相册配置在 `frontend/content/gallery/` 目录：

- `albums.json` - 相册列表
- `images.json` - 图片列表

图片文件放在 `frontend/public/images/gallery/` 目录。

## 部署

静态站点可部署到：

- Vercel
- Netlify
- GitHub Pages
- 任何静态文件托管服务

## 项目结构

```
personal-blog/
├── frontend/
│   ├── content/           # 内容目录
│   │   ├── articles/      # Markdown 文章
│   │   └── gallery/       # 相册配置
│   ├── public/
│   │   └── images/        # 静态图片
│   ├── src/
│   │   ├── app/           # Next.js 页面
│   │   └── components/    # React 组件
│   └── lib/               # 数据读取层
└── package.json
```

## License

MIT
