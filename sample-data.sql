-- 示例文章数据
-- 用于快速测试博客功能

-- 插入第一篇示例文章
INSERT INTO articles (title, slug, content, excerpt, status, published_at)
VALUES (
  '欢迎来到我的博客',
  'welcome-to-my-blog',
  '# 欢迎来到我的博客

这是我的第一篇博客文章！

## 关于这个博客

这是一个使用 Next.js 14 构建的现代化个人博客系统，具有以下特点：

- **Markdown 支持**：使用 Markdown 编写文章
- **代码高亮**：支持多种编程语言的语法高亮
- **响应式设计**：完美适配各种设备
- **SEO 优化**：自动生成 meta 标签和结构化数据

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- PostgreSQL
- AWS S3
- Tailwind CSS

## 示例代码

```javascript
function hello() {
  console.log("Hello, World!");
}
```

## 列表示例

- 项目 1
- 项目 2
- 项目 3

**粗体文本** 和 *斜体文本*

> 这是一个引用块

感谢访问！',
  '这是我的第一篇博客文章，介绍了博客的功能和技术栈。',
  'published',
  NOW()
);

-- 插入第二篇示例文章
INSERT INTO articles (title, slug, content, excerpt, status, published_at)
VALUES (
  'Next.js 14 新特性介绍',
  'nextjs-14-features',
  '# Next.js 14 新特性介绍

Next.js 14 带来了许多令人兴奋的新特性。

## Server Actions

Server Actions 让服务端操作变得更加简单：

```typescript
async function createPost(formData: FormData) {
  "use server";
  
  const title = formData.get("title");
  // 处理数据...
}
```

## Turbopack

新的打包工具 Turbopack 提供了更快的开发体验。

## Partial Prerendering

部分预渲染让页面加载更快。

## 总结

Next.js 14 是一个重大更新，值得升级！',
  'Next.js 14 带来了 Server Actions、Turbopack 等新特性。',
  'published',
  NOW()
);

-- 插入第三篇示例文章（草稿）
INSERT INTO articles (title, slug, content, excerpt, status)
VALUES (
  'TypeScript 最佳实践',
  'typescript-best-practices',
  '# TypeScript 最佳实践

这篇文章还在编写中...

## 类型定义

使用 interface 还是 type？

## 泛型

如何正确使用泛型？

## 工具类型

Partial、Pick、Omit 等工具类型的使用。',
  '分享 TypeScript 开发中的最佳实践。',
  'draft'
);

-- 查看插入的文章
SELECT id, title, slug, status, created_at FROM articles ORDER BY created_at DESC;
