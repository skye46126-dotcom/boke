# 📝 网站定制完整清单

**目的**：将所有需要填写真实信息的地方汇总到一起

---

## 1️⃣ 个人信息数据（最重要）

### 文件：`src/data/portfolio.js`

```javascript
// ================================
// 1. 个人基础信息
// ================================
export const personalInfo = {
  name: 'Your Name',              // ← 改：您的真实姓名
  title: 'Full-Stack Developer',  // ← 改：您的职位/身份
  tagline: 'Building the web...',  // ← 改：您的个性签名
  email: 'your@email.com'         // ← 改：您的邮箱
}

// ================================
// 2. 社交链接
// ================================
export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com',      // ← 改：您的 GitHub
    icon: 'github',
    ariaLabel: 'Visit GitHub profile'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',     // ← 改：您的 Twitter
    icon: 'twitter',
    ariaLabel: 'Visit Twitter profile'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',    // ← 改：您的 LinkedIn
    icon: 'linkedin',
    ariaLabel: 'Visit LinkedIn profile'
  },
  {
    name: 'Email',
    url: 'mailto:your@email.com',  // ← 改：您的邮箱
    icon: 'email',
    ariaLabel: 'Send email'
  }
]

// ================================
// 3. 技能标签（8-12个）
// ================================
export const skills = [
  'Vue.js',          // ← 改：根据您的实际技能调整
  'React',
  'TypeScript',
  // ... 继续添加
]

// ================================
// 4. 工作经历（至少1段）
// ================================
export const experiences = [
  {
    period: '2024-Present',           // ← 改：实际时间
    title: 'Senior Frontend Developer', // ← 改：职位
    company: 'Tech Company A',        // ← 改：公司名
    description: [                     // ← 改：工作内容（2-4条）
      '负责核心产品的前端架构设计...',
      '带领团队完成从 Vue 2 到 Vue 3...',
      '性能优化使首屏加载速度提升 50%...'
    ],
    technologies: [                    // ← 改：使用的技术
      'Vue.js', 'TypeScript', 'Vite'
    ]
  }
  // 可以添加更多工作经历
]

// ================================
// 5. 精选项目（至少2个）
// ================================
export const projects = [
  {
    title: 'Personal Blog System',    // ← 改：项目名
    description: '使用 Vue 3...',      // ← 改：项目描述
    emoji: '📝',                       // ← 改：项目图标
    technologies: [                    // ← 改：技术栈
      'Vue 3', 'Vite', 'Supabase'
    ],
    github: 'https://github.com',      // ← 改：GitHub仓库（可选）
    demo: 'https://example.com'        // ← 改：在线演示（可选）
  }
  // 可以添加更多项目
]
```

---

## 2️⃣ SEO 配置

### 文件：`src/App.vue`

**在 `<script setup>` 中找到 `useHead` 配置**：

```javascript
useHead({
  // ===== 1. 页面标题 =====
  title: 'Your Name - Full Stack Developer',  // ← 改：您的名字 + 简介
  
  meta: [
    // ===== 2. 描述 =====
    {
      name: 'description',
      content: '个人技术博客，分享前端开发...'  // ← 改：网站描述
    },
    
    // ===== 3. 关键词 =====
    {
      name: 'keywords',
      content: 'Vue.js, React, TypeScript...'  // ← 改：相关关键词
    },
    
    // ===== 4. Open Graph (社交分享) =====
    {
      property: 'og:title',
      content: 'Your Name - Full Stack Developer'  // ← 改：分享标题
    },
    {
      property: 'og:description',
      content: '个人技术博客...'  // ← 改：分享描述
    },
    {
      property: 'og:url',
      content: 'https://yoursite.com'  // ← 改：您的域名
    },
    {
      property: 'og:image',
      content: 'https://yoursite.com/og-image.jpg'  // ← 改：分享图片URL
    },
    
    // ===== 5. Twitter Card =====
    {
      name: 'twitter:title',
      content: 'Your Name - Full Stack Developer'  // ← 改：Twitter标题
    },
    {
      name: 'twitter:description',
      content: '个人技术博客...'  // ← 改：Twitter描述
    }
  ],
  
  link: [
    {
      rel: 'canonical',
      href: 'https://yoursite.com'  // ← 改：您的域名
    }
  ]
})
```

---

## 3️⃣ SEO 文件

### 文件：`public/robots.txt`

```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://yoursite.com/sitemap.xml  # ← 改：您的域名
```

### 文件：`public/sitemap.xml`

```xml
<!-- 将所有 https://yoursite.com 改为您的域名 -->
<loc>https://yoursite.com/</loc>              <!-- ← 改 -->
<loc>https://yoursite.com/articles</loc>      <!-- ← 改 -->
<loc>https://yoursite.com/gallery</loc>       <!-- ← 改 -->

<!-- 更新日期 -->
<lastmod>2024-01-01</lastmod>  <!-- ← 改：当前日期 YYYY-MM-DD -->
```

---

## 4️⃣ 可选配置

### A. OG Image（社交分享图片）

**步骤**：
1. 设计一张 1200x630px 的图片
2. 保存为 `public/og-image.jpg`
3. 图片应包含：
   - 您的名字
   - 职位或标语
   - 简洁的背景设计

### B. Favicon（网站图标）

**文件**：`public/vite.svg`

**步骤**：
1. 替换为您自己的 favicon
2. 或者使用工具生成：https://favicon.io/

### C. 页面 Footer

**文件**：`src/App.vue`

```vue
<footer class="pixel-ink-footer">
  <p class="pixel-font">
    © 2024 Pixel Blog. Powered by Vue & Supabase.
  </p>
  <!-- ↑ 改：Your Name. Powered by ... -->
</footer>
```

---

## ✅ 完整检查清单

### 数据内容
- [ ] `portfolio.js` - personalInfo（姓名、职位、标语、邮箱）
- [ ] `portfolio.js` - socialLinks（GitHub、Twitter等链接）
- [ ] `portfolio.js` - skills（技能标签）
- [ ] `portfolio.js` - experiences（工作经历，至少1段）
- [ ] `portfolio.js` - projects（项目，至少2个）

> ✅ **About Section 内容已自动化！**  
> 填写 `portfolio.js` 后，About 页面会自动显示您的信息，无需手动编辑 AboutSection.vue

### SEO 配置
- [ ] `App.vue` - useHead title（页面标题）
- [ ] `App.vue` - meta description（描述）
- [ ] `App.vue` - meta keywords（关键词）
- [ ] `App.vue` - Open Graph 标签（og:title, og:url, og:image）
- [ ] `App.vue` - Twitter Card 标签
- [ ] `App.vue` - canonical URL

### SEO 文件
- [ ] `public/robots.txt` - Sitemap URL
- [ ] `public/sitemap.xml` - 所有 URL 和日期

### Google Analytics（新增）
- [ ] 创建 Google Analytics 账号
- [ ] 获取 Measurement ID (G-XXXXXXXXXX)
- [ ] 更新 `index.html` 中的两处 ID

### 可选
- [ ] `public/og-image.jpg` - 社交分享图片
- [ ] `public/vite.svg` - Favicon
- [ ] `App.vue` - Footer 文字

---

## 🚀 填写顺序建议

**第一优先级**（必须）：
1. `portfolio.js` 个人信息（最重要！）
2. `App.vue` SEO meta 标签中的域名和标题

**第二优先级**（建议）：
3. `robots.txt` 和 `sitemap.xml` 域名
4. 上传 OG Image

**第三优先级**（可选）：
5. 自定义 Favicon
6. 修改 Footer 文字

---

## 📝 示例参考

### 真实示例（供参考）

```javascript
// 真实填写示例
personalInfo: {
  name: '张明',
  title: '前端工程师',
  tagline: '热爱开源，专注 Vue 生态',
  email: 'zhangming@example.com'
}

// SEO 标题示例
title: '张明 - 前端工程师 | Vue.js 开发者'

// 描述示例
description: '张明的个人博客，分享 Vue.js、TypeScript、前端工程化等技术文章'
```

---

## ⚠️ 注意事项

1. **域名占位符**：所有 `https://yoursite.com` 都需要改
2. **邮箱**：确保邮箱在多处保持一致
3. **日期格式**：sitemap.xml 使用 `YYYY-MM-DD`
4. **链接有效性**：确保所有社交链接可访问
5. **隐私**：不想公开真名可以使用昵称

---

**填写完成后，您的个人网站就完全定制化了！** ✨
