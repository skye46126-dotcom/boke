---
title: "使用 Next.js 构建静态博客"
slug: "nextjs-static-blog"
date: "2024-12-15"
status: "published"
excerpt: "介绍如何使用 Next.js 的静态导出功能构建一个纯静态的个人博客。"
cover_image: "/images/covers/nextjs.jpg"
tags:
  - "技术"
  - "前端"
  - "Next.js"
---

# 使用 Next.js 构建静态博客

Next.js 是一个强大的 React 框架，它支持静态站点生成（SSG），非常适合构建博客。

## 为什么选择静态博客？

静态博客有很多优点：

- **速度快**：纯 HTML 文件，加载速度极快
- **安全**：没有后端，没有数据库，攻击面小
- **便宜**：可以免费托管在 GitHub Pages、Vercel 等平台
- **简单**：直接编辑 Markdown 文件即可发布

## 技术栈

本博客使用以下技术：

```
- Next.js 14 (App Router)
- TypeScript
- Markdown + gray-matter
- CSS Modules
```

## 目录结构

```
/content/
├── articles/
│   └── *.md          # Markdown 文章
└── gallery/
    ├── albums.json   # 相册配置
    └── images.json   # 图片配置
```

## 总结

静态博客是个人博客的绝佳选择，简单、快速、安全。
