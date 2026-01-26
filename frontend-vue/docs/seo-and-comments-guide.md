# SEO Meta 标签更新 & 评论系统说明

## 1️⃣ SEO Meta 标签需要更新的内容

### 📍 位置：`src/App.vue`

### 需要替换的占位符

**在 App.vue 的 `useHead` 配置中**，找到以下内容并替换：

```javascript
useHead({
  // ========== 1. 页面标题 ==========
  title: 'Your Name - Full Stack Developer',  
  // ← 改成：'您的真实姓名 - 您的职位'
  // 例如：'张三 - 前端工程师'
  
  meta: [
    // ========== 2. 网站描述 ==========
    {
      name: 'description',
      content: '个人技术博客，分享前端开发、Vue.js、TypeScript 等技术经验'
      // ← 可以保留或修改成您的描述
    },
    
    // ========== 3. 关键词 ==========
    {
      name: 'keywords',
      content: 'Vue.js, React, TypeScript, 前端开发, Web开发, 技术博客'
      // ← 添加您的专业技能关键词
    },
    
    // ========== 4. Open Graph 标题 ==========
    {
      property: 'og:title',
      content: 'Your Name - Full Stack Developer'
      // ← 改成：'您的姓名 - 您的职位'
    },
    
    // ========== 5. OG 描述 ==========
    {
      property: 'og:description',
      content: '个人技术博客，分享前端开发经验与项目实践'
      // ← 可以保留或自定义
    },
    
    // ========== 6. 网站 URL ==========
    {
      property: 'og:url',
      content: 'https://yoursite.com'
      // ← 改成您的真实域名
      // 如果还没有域名，可以暂时保留
    },
    
    // ========== 7. OG 分享图片 ==========
    {
      property: 'og:image',
      content: 'https://yoursite.com/og-image.jpg'
      // ← 改成您的域名 + 图片路径
      // 图片尺寸：1200x630px
      // 放在 public/og-image.jpg
    },
    
    // ========== 8. Twitter Card 标题 ==========
    {
      name: 'twitter:title',
      content: 'Your Name - Full Stack Developer'
      // ← 改成：'您的姓名 - 您的职位'
    },
    
    // ========== 9. Twitter 描述 ==========
    {
      name: 'twitter:description',
      content: '个人技术博客，分享前端开发经验'
      // ← 可以保留或自定义
    }
  ],
  
  // ========== 10. Canonical URL ==========
  link: [
    {
      rel: 'canonical',
      href: 'https://yoursite.com'
      // ← 改成您的真实域名
    }
  ]
})
```

---

### ✏️ 快速替换清单

需要修改的地方（共10处）：

- [ ] 主标题（title）
- [ ] OG 标题（og:title）
- [ ] Twitter 标题（twitter:title）
- [ ] 网站 URL（og:url）
- [ ] 网站 URL（canonical href）
- [ ] OG 图片（og:image）
- [ ] 描述（可选）
- [ ] 关键词（可选）
- [ ] OG 描述（可选）
- [ ] Twitter 描述（可选）

---

### 📝 示例（完整替换）

```javascript
useHead({
  title: '张三 - 前端工程师 | Vue.js 开发者',
  meta: [
    {
      name: 'description',
      content: '张三的个人作品集，专注于 Vue.js、React 和现代前端开发'
    },
    {
      name: 'keywords',
      content: 'Vue.js, React, TypeScript, 前端开发, 张三, 前端工程师'
    },
    {
      property: 'og:title',
      content: '张三 - 前端工程师'
    },
    {
      property: 'og:description',
      content: '专注于构建高质量 Web 应用的前端工程师'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://zhangsan.dev'
    },
    {
      property: 'og:image',
      content: 'https://zhangsan.dev/og-image.jpg'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: '张三 - 前端工程师'
    },
    {
      name: 'twitter:description',
      content: '专注于 Vue.js 和现代前端开发'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zhangsan.dev'
    }
  ]
})
```

---

## 2️⃣ 评论系统 (Giscus) 说明

### 📍 位置：`src/components/Comments.vue`

### 当前实现状态

✅ **已完成的部分**：
- Giscus 组件已安装并集成
- 基础样式已配置
- 主题自适应（跟随网站深色/浅色模式）

⚠️ **需要配置的部分**：
- GitHub 仓库信息
- Giscus 应用授权

---

### Giscus 评论系统是什么？

**Giscus** 是一个基于 GitHub Discussions 的评论系统。

**优点**：
- ✅ 完全免费
- ✅ 无广告，隐私友好
- ✅ 使用 GitHub 账号登录
- ✅ 支持 Markdown、代码高亮
- ✅ 支持 emoji 反应
- ✅ 自动同步到 GitHub Discussions

**外观**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 评论 (Powered by Giscus)

┌────────────────────────────────────┐
│ 🧑 用户名           2小时前        │
│                                    │
│ 这篇文章写得很好！感谢分享！        │
│                                    │
│ 👍 5   回复                         │
└────────────────────────────────────┘

[使用 GitHub 登录评论]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 当前样式设计

**样式特点**：
- GitHub 风格的评论框
- 与网站主题色一致
- 深色模式自适应
- 圆角卡片设计
- 响应式布局

**CSS 自定义**：
```css
.giscus {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--color-gh-card);
  border: 1px solid var(--color-gh-border);
  border-radius: 12px;
}
```

---

### 如何配置 Giscus？

#### 步骤 1：准备 GitHub 仓库

**需要**：
- 一个公开的 GitHub 仓库
- 启用 Discussions 功能

**操作**：
1. 进入您的 GitHub 仓库
2. Settings → General
3. 勾选 ✅ Discussions

#### 步骤 2：安装 Giscus 应用

1. 访问 https://github.com/apps/giscus
2. 点击 "Install"
3. 选择授权给您的仓库

#### 步骤 3：获取配置信息

1. 访问 https://giscus.app/
2. 填写仓库信息
3. 选择 Discussion 分类
4. 复制生成的配置代码

#### 步骤 4：更新 Comments.vue

在 `Comments.vue` 中，找到并替换：

```vue
<Giscus
  repo="YOUR-USERNAME/YOUR-REPO"        ← 改成您的仓库
  repo-id="YOUR-REPO-ID"                ← 从 giscus.app 复制
  category="Announcements"              ← 选择分类
  category-id="YOUR-CATEGORY-ID"        ← 从 giscus.app 复制
  mapping="pathname"
  strict="0"
  reactions-enabled="1"
  emit-metadata="0"
  input-position="top"
  theme="preferred_color_scheme"
  lang="zh-CN"
  loading="lazy"
/>
```

---

### 完整示例配置

```vue
<Giscus
  repo="zhangsan/my-portfolio"
  repo-id="R_kgDOKxxxxx"
  category="General"
  category-id="DIC_kwDOKxxxxx"
  mapping="pathname"
  strict="0"
  reactions-enabled="1"
  emit-metadata="0"
  input-position="top"
  theme="preferred_color_scheme"
  lang="zh-CN"
  loading="lazy"
/>
```

---

### 评论系统在哪里显示？

**当前位置**：文章详情页（ArticleDetail.vue）

访问任意文章，滚动到底部即可看到评论区。

**示例 URL**：
```
http://localhost:5173/articles/your-article-slug
```

---

### 测试评论系统

**本地测试**：
1. 访问文章详情页
2. 滚动到底部
3. 应该看到 Giscus 评论框
4. 点击"使用 GitHub 登录"
5. 发表测试评论

**注意**：
- 本地开发时，评论会同步到 GitHub Discussions
- 删除测试评论：在 GitHub Discussions 中删除

---

### 评论系统的外观预览

**未登录状态**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 评论

还没有评论，成为第一个评论的人吧！

[使用 GitHub 登录以发表评论]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**已登录状态**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 评论

┌────────────────────────────────────┐
│ 写下您的评论...                     │
│                                    │
│ [Markdown 支持]  [预览]            │
│                                    │
│                        [发表评论]   │
└────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**有评论时**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 2 条评论

┌────────────────────────────────────┐
│ 👤 张三              1天前          │
│ ────────────────────────────────   │
│ 非常棒的文章！学到了很多 🎉        │
│                                    │
│ 👍 3  ❤️ 1  回复                    │
│                                    │
│   └─ 💬 李四  20小时前               │
│       感谢分享！                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 👤 王五              2天前          │
│ ────────────────────────────────   │
│ 请问这个问题怎么解决？              │
│ ```js                              │
│ const foo = 'bar'                  │
│ ```                                │
│                                    │
│ 👍 1  回复                          │
└────────────────────────────────────┘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 是否需要立即配置评论系统？

### 选项 A：现在配置（如果您有 GitHub 仓库）

**适合**：
- 网站即将上线
- 想要测试评论功能
- 已有 GitHub 仓库

**操作**：按照上面的"如何配置 Giscus"步骤

---

### 选项 B：暂时跳过（推荐）

**适合**：
- 还在开发阶段
- 没有 GitHub 仓库
- 暂时不需要评论功能

**原因**：
- 评论系统可以随时添加
- 不影响网站其他功能
- 可以等网站上线后再配置

---

### 选项 C：移除评论组件

如果不需要评论功能：

**操作**：
1. 打开 `ArticleDetail.vue`
2. 找到 `<Comments />` 组件
3. 删除或注释掉

---

## 📝 总结

### SEO Meta 标签
- **位置**：`src/App.vue`
- **需要改**：10处占位符
- **重点**：姓名、域名、图片URL

### 评论系统 (Giscus)
- **位置**：`src/components/Comments.vue`
- **状态**：已集成，需配置
- **样式**：GitHub风格，深色模式自适应
- **是否必需**：❌ 不是必需的，可以随时添加

---

**建议操作顺序**：
1. 先更新 SEO Meta 标签 ⭐（重要）
2. 填写 portfolio.js 数据 ⭐⭐（最重要）
3. 等网站上线后配置评论系统（可选）

**需要我帮您更新 SEO Meta 标签吗？** 😊
