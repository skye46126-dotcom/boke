# Portfolio 数据填写清单

> **位置**: `src/data/portfolio.js`  
> **状态**: ⚠️ 当前使用示例数据，需要替换成真实信息

---

## ✅ 填写清单

### 1. 个人基础信息

```javascript
export const personalInfo = {
  name: 'Your Name',              // ← 填写您的真实姓名
  title: 'Full-Stack Developer',  // ← 填写您的职位/身份
  tagline: 'Building the web...',  // ← 填写您的个性签名/标语
  email: 'your@email.com'         // ← 填写您的联系邮箱
}
```

**示例**：
```javascript
name: '张三',
title: '全栈开发工程师',
tagline: '热爱开源，专注前端技术',
email: 'zhangsan@example.com'
```

---

### 2. 社交链接

```javascript
export const socialLinks = [
  { 
    name: 'GitHub',
    url: 'https://github.com',      // ← 改成您的GitHub主页
    icon: 'github',
    ariaLabel: 'Visit GitHub profile'
  },
  { 
    name: 'Twitter',
    url: 'https://twitter.com',     // ← 改成您的Twitter
    icon: 'twitter',
    ariaLabel: 'Visit Twitter profile'
  },
  { 
    name: 'LinkedIn',
    url: 'https://linkedin.com',    // ← 改成您的LinkedIn
    icon: 'linkedin',
    ariaLabel: 'Visit LinkedIn profile'
  },
  { 
    name: 'Email',
    url: 'mailto:your@email.com',  // ← 改成您的邮箱
    icon: 'email',
    ariaLabel: 'Send email'
  }
]
```

**提示**：
- 不需要的社交链接可以删除
- 可以添加其他平台（如微博、知乎等）

---

### 3. 技能标签

```javascript
export const skills = [
  'Vue.js',          // ← 根据您的实际技能修改
  'React',
  'TypeScript',
  // ... 添加更多
]
```

**建议**：
- 8-12个核心技能
- 按熟练度或重要性排序
- 可以包括框架、语言、工具

---

### 4. 工作经历

```javascript
export const experiences = [
  {
    period: '2024-Present',           // ← 工作时间段
    title: 'Senior Frontend Developer', // ← 职位
    company: 'Tech Company A',        // ← 公司名
    description: [                     // ← 工作内容（2-4条）
      '负责核心产品的前端架构设计...',
      '带领团队完成从 Vue 2 到 Vue 3 的迁移...',
      '性能优化使首屏加载速度提升 50%...'
    ],
    technologies: [                    // ← 使用的技术栈
      'Vue.js', 'TypeScript', 'Vite'
    ]
  },
  // 第二份工作...
]
```

**填写指南**：
- **period**: 格式建议 `YYYY-Present` 或 `YYYY-YYYY`
- **description**: 用数据说话（提升XX%、完成XX项目）
- **technologies**: 3-6个核心技术

---

### 5. 精选项目

```javascript
export const projects = [
  {
    title: 'Personal Blog System',    // ← 项目名称
    description: '使用 Vue 3...',      // ← 项目描述（一句话）
    emoji: '📝',                       // ← 项目图标（emoji）
    technologies: [                    // ← 技术栈
      'Vue 3', 'Vite', 'Supabase'
    ],
    github: 'https://github.com/...',  // ← GitHub仓库（可选）
    demo: 'https://example.com'        // ← 在线演示（可选）
  },
  // 第二个项目...
]
```

**填写指南**：
- **emoji**: 选择代表项目的表情符号
- **description**: 简洁明了，突出亮点
- **github/demo**: 至少填一个，没有可设为 `null`

**Emoji 建议**：
- 博客系统：📝 ✍️ 📚
- 工具应用：🛠️ ⚙️ 🔧
- 电商项目：🛒 🏪 💰
- 游戏娱乐：🎮 🎲 🎯
- AI/机器学习：🤖 🧠 ⚡
- 数据可视化：📊 📈 📉

---

## 📋 完整示例

```javascript
// 真实示例参考
export const personalInfo = {
  name: '李明',
  title: '前端架构师',
  tagline: '专注于构建高性能 Web 应用',
  email: 'liming@tech.com'
}

export const socialLinks = [
  { 
    name: 'GitHub',
    url: 'https://github.com/liming',
    icon: 'github',
    ariaLabel: 'Visit GitHub profile'
  },
  { 
    name: 'Email',
    url: 'mailto:liming@tech.com',
    icon: 'email',
    ariaLabel: 'Send email'
  }
]

export const skills = [
  'Vue.js', 'React', 'TypeScript', 'Node.js',
  'Webpack', 'Vite', 'Tailwind CSS', 'Docker'
]

export const experiences = [
  {
    period: '2023-Present',
    title: '前端架构师',
    company: '某科技公司',
    description: [
      '负责公司核心产品的前端架构设计',
      '搭建微前端架构，支持多团队协作',
      '制定前端规范，提升团队代码质量'
    ],
    technologies: ['Vue 3', 'TypeScript', 'Micro Frontend', 'Vite']
  }
]

export const projects = [
  {
    title: '开发者工具箱',
    description: '集成常用开发工具的浏览器扩展，已有10万+用户',
    emoji: '🛠️',
    technologies: ['Vue', 'Chrome Extension API', 'IndexedDB'],
    github: 'https://github.com/liming/dev-toolkit',
    demo: 'https://chrome.google.com/...'
  }
]
```

---

## ⚠️ 注意事项

1. **隐私保护**：如果不想公开真实信息，可以使用：
   - 昵称代替真名
   - 只填写GitHub等公开平台
   - 使用专门的联系邮箱

2. **内容真实性**：
   - 工作经历尽量真实
   - 项目描述不要夸大
   - 技能列表只列熟悉的

3. **SEO优化**：
   - 使用关键词（如：前端开发、Vue专家）
   - 描述清晰明了
   - 避免特殊字符

---

## ✅ 填写完成检查

- [ ] 个人信息已更新（姓名、职位、标语、邮箱）
- [ ] 社交链接已更新（至少2个）
- [ ] 技能列表已调整（8-12个）
- [ ] 工作经历已填写（至少1段）
- [ ] 项目列表已填写（至少2个）
- [ ] 所有链接可访问
- [ ] 无拼写错误

---

**完成后，页面将显示您的真实作品集！** 🎉
