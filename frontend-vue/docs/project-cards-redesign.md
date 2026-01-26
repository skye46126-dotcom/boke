# Featured Projects 重设计文档
## 时间线风格 + 毛玻璃效果

**设计方向**：将时间线的程序员感与毛玻璃的现代美学结合，创造既有科技感又优雅的项目展示

---

## 🎨 视觉设计

### 最终效果预览

```
Featured Work
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────┐
│ •──────────╮                       │
│ │          ╰───────────────────╮   │
│ │  ┌──────────────────────────┐│   │
│ │  │ ░░░░░░ 毛玻璃背景 ░░░░░░  ││   │ ← 半透明卡片
│ │  │                          ││   │
│ │  │  📝 Personal Blog System ││   │
│ │  │                          ││   │
│ │  │  使用 Vue 3 + Supabase   ││   │
│ │  │  构建的全栈博客系统...    ││   │
│ │  │                          ││   │
│ │  │  Vue.js · Vite · Supabase││   │
│ │  │                          ││   │
│ │  │  GitHub →  Demo →        ││   │
│ │  └──────────────────────────┘│   │
│ ╰────────────────────────────────╯   │
│                                      │
│ •──────────╮                         │
│ │          ╰───────────────────╮     │
│ │  ┌──────────────────────────┐│     │
│ │  │ ░░░░░░ 第二个项目 ░░░░░░  ││     │
│ │  │  💻 Interactive Terminal ││     │
│ │  │  ...                     ││     │
│ │  └──────────────────────────┘│     │
│ ╰────────────────────────────────╯   │
└────────────────────────────────────┘
```

---

## 📐 组件结构

### HTML 层级

```html
<div class="timeline-projects">
  <h3 class="section-subtitle">Featured Work</h3>
  
  <div class="timeline-container">
    <!-- 项目 1 -->
    <div class="timeline-item">
      <!-- 时间线装饰 -->
      <div class="timeline-marker">
        <div class="timeline-dot"></div>
        <div class="timeline-line"></div>
      </div>
      
      <!-- 毛玻璃卡片 -->
      <div class="project-glass-card">
        <div class="glass-background"></div> <!-- 毛玻璃层 -->
        <div class="glass-content">
          <div class="project-header">
            <span class="project-icon">📝</span>
            <h4 class="project-title">Personal Blog System</h4>
          </div>
          
          <p class="project-description">
            使用 Vue 3 + Supabase 构建的全栈博客系统，
            支持 Markdown 编辑、代码高亮、评论系统等功能。
          </p>
          
          <div class="project-tech">
            <span class="tech-item">Vue.js</span>
            <span class="tech-divider">·</span>
            <span class="tech-item">Vite</span>
            <span class="tech-divider">·</span>
            <span class="tech-item">Supabase</span>
          </div>
          
          <div class="project-links">
            <a href="#" class="project-link">
              GitHub →
            </a>
            <a href="#" class="project-link">
              Live Demo →
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 项目 2 -->
    <div class="timeline-item">
      ...
    </div>
  </div>
</div>
```

---

## 🎯 核心设计元素

### 1. 时间线装饰

**左侧垂直线 + 圆点装饰**

```css
时间线标记：
  • ← 渐变色圆点（绿→紫）
  │ ← 垂直虚线
  │
  •
  │
```

**CSS 规格**：
- **圆点直径**：12px
- **圆点颜色**：渐变 `linear-gradient(135deg, #00dc82, #a855f7)`
- **连接线**：2px 虚线，颜色 `rgba(0, 220, 130, 0.3)`
- **间距**：圆点到卡片 24px

---

### 2. 毛玻璃卡片

**Glassmorphism 效果**

```css
背景：半透明白色 rgba(255, 255, 255, 0.05)
边框：1px rgba(255, 255, 255, 0.1)
模糊：backdrop-filter: blur(10px)
阴影：微妙的阴影 0 8px 32px rgba(0, 0, 0, 0.1)
圆角：12px
```

**层次结构**：
1. **底层**：模糊背景（backdrop-filter）
2. **中层**：半透明色彩层
3. **顶层**：内容文字

---

### 3. 颜色系统

**主题色**：
- 品牌绿：`#00dc82`
- 品牌紫：`#a855f7`
- 渐变：`linear-gradient(135deg, #00dc82, #a855f7)`

**透明度层级**：
- 卡片背景：`rgba(255, 255, 255, 0.05)` (5%)
- 卡片边框：`rgba(255, 255, 255, 0.1)` (10%)
- Hover背景：`rgba(255, 255, 255, 0.08)` (8%)
- 文字：`rgba(255, 255, 255, 0.9)` (90%)

---

## ✨ 交互效果

### Hover 状态

**卡片 Hover**：
```css
变化：
  - 背景透明度：5% → 8%
  - 边框亮度：10% → 20%
  - 阴影扩大：8px → 16px
  - 轻微上浮：translateY(-4px)
  - 时间线圆点放大：12px → 14px
  - 时间线圆点发光
```

**过渡时间**：300ms ease-out

---

### 点击状态

**链接点击**：
```css
箭头动画：→ 向右移动 4px
文字颜色：变为品牌渐变色
```

---

## 🔤 文字排版

**标题（Project Title）**：
- 字号：1.25rem (20px)
- 字重：700 (Bold)
- 颜色：`#ffffff`
- 间距：与 emoji 间距 0.5rem

**描述文字**：
- 字号：0.875rem (14px)
- 字重：400 (Regular)
- 颜色：`rgba(255, 255, 255, 0.7)`
- 行高：1.6
- 最大行数：3行，超出显示省略号

**技术标签**：
- 字号：0.75rem (12px)
- 字重：500 (Medium)
- 颜色：品牌绿 `#00dc82`
- 分隔符：`·` 圆点，颜色 `rgba(255, 255, 255, 0.3)`

**链接文字**：
- 字号：0.875rem (14px)
- 字重：600 (SemiBold)
- 颜色：品牌绿 `#00dc82`
- Hover：渐变色

---

## 📏 间距规范

**卡片内部**：
```
padding: 1.5rem (24px)

项目头部（icon + title）
  ↓ 0.75rem (12px)
描述文字
  ↓ 1rem (16px)
技术标签
  ↓ 1rem (16px)
链接区域
```

**卡片之间**：
```
margin-bottom: 2rem (32px)
```

**时间线到卡片**：
```
margin-left: 2rem (32px) // 从时间线圆点到卡片左边缘
```

---

## 🎭 动画细节

### 1. 入场动画（可选）

**从左滑入 + 渐显**：
```css
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-item {
  animation: slide-in-left 0.6s ease-out;
  animation-delay: calc(var(--index) * 0.1s); // 依次出现
}
```

---

### 2. 毛玻璃脉动（Hover时）

**背景微光效果**：
```css
@keyframes glass-glow {
  0%, 100% {
    background: rgba(255, 255, 255, 0.08);
  }
  50% {
    background: rgba(0, 220, 130, 0.1);
  }
}

.project-glass-card:hover .glass-background {
  animation: glass-glow 2s ease-in-out infinite;
}
```

---

## 📱 响应式设计

### 桌面端（>768px）

```css
.timeline-marker {
  display: block; // 显示时间线
}

.project-glass-card {
  max-width: 600px; // 限制卡片宽度
}
```

---

### 移动端（<768px）

```css
.timeline-marker {
  display: none; // 隐藏时间线装饰
}

.timeline-item {
  margin-left: 0; // 卡片靠左
}

.project-glass-card {
  width: 100%;
  padding: 1.25rem; // 减小padding
}
```

---

## 🔧 CSS 实现要点

### 毛玻璃效果（关键）

```css
.project-glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

/* 兼容性：如果不支持backdrop-filter，添加半透明背景 */
@supports not (backdrop-filter: blur(10px)) {
  .project-glass-card {
    background: rgba(22, 27, 34, 0.9); /* 深色半透明 */
  }
}
```

---

### 渐变圆点

```css
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00dc82, #a855f7);
  box-shadow: 0 0 10px rgba(0, 220, 130, 0.5);
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-dot {
  width: 14px;
  height: 14px;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.8);
}
```

---

### 虚线连接

```css
.timeline-line {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 2px;
  height: calc(100% + 2rem); /* 延伸到下一个元素 */
  background: linear-gradient(
    to bottom,
    rgba(0, 220, 130, 0.3) 0%,
    rgba(0, 220, 130, 0.3) 50%,
    transparent 50%,
    transparent 100%
  );
  background-size: 2px 8px; /* 虚线效果 */
  transform: translateX(-50%);
}

/* 最后一个项目不显示连接线 */
.timeline-item:last-child .timeline-line {
  display: none;
}
```

---

## 🎨 完整 CSS 规格表

| 元素 | 属性 | 值 |
|------|------|-----|
| **时间线圆点** | 直径 | 12px |
| | 渐变 | 135deg, #00dc82 → #a855f7 |
| | 阴影 | 0 0 10px rgba(0,220,130,0.5) |
| **连接线** | 宽度 | 2px |
| | 样式 | 虚线（8px重复） |
| | 颜色 | rgba(0,220,130,0.3) |
| **毛玻璃卡片** | 背景 | rgba(255,255,255,0.05) |
| | 模糊 | blur(10px) |
| | 边框 | 1px rgba(255,255,255,0.1) |
| | 圆角 | 12px |
| | 阴影 | 0 8px 32px rgba(0,0,0,0.1) |
| **项目标题** | 字号 | 1.25rem |
| | 字重 | 700 |
| | 颜色 | #ffffff |
| **描述** | 字号 | 0.875rem |
| | 行高 | 1.6 |
| | 颜色 | rgba(255,255,255,0.7) |
| **技术标签** | 字号 | 0.75rem |
| | 颜色 | #00dc82 |

---

## ⚡ 性能优化

### 1. GPU 加速

```css
.project-glass-card {
  will-change: transform;
  transform: translateZ(0); /* 强制GPU渲染 */
}
```

---

### 2. 动画节流

```css
/* 只在Hover时启用复杂动画 */
.timeline-item:not(:hover) .glass-background {
  animation: none;
}
```

---

### 3. 减少重绘

```css
/* 使用 transform 而非 margin/padding 改变位置 */
.project-glass-card:hover {
  transform: translateY(-4px); /* ✅ GPU加速 */
  /* margin-top: -4px; ❌ 会引起重排 */
}
```

---

## 🧪 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| backdrop-filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |
| linear-gradient | ✅ | ✅ | ✅ | ✅ |
| transform | ✅ | ✅ | ✅ | ✅ |

**降级方案**：
- 不支持 `backdrop-filter` 时，使用深色半透明背景
- 不支持渐变时，使用纯色

---

## 📦 组件 Props

```typescript
interface ProjectCardProps {
  title: string          // 项目名称
  description: string    // 项目描述
  emoji: string         // emoji 图标
  technologies: string[] // 技术栈数组
  github?: string       // GitHub链接（可选）
  demo?: string         // Demo链接（可选）
  index?: number        // 索引（用于动画延迟）
}
```

---

## 🎬 实现步骤

1. **创建基础HTML结构** (5min)
   - Timeline容器
   - 单个项目卡片

2. **实现毛玻璃效果** (10min)
   - backdrop-filter
   - 半透明背景
   - 边框和阴影

3. **添加时间线装饰** (10min)
   - 渐变圆点
   - 虚线连接

4. **文字排版和间距** (10min)
   - 标题、描述、标签
   - 合理的padding和margin

5. **Hover交互效果** (10min)
   - 卡片上浮
   - 圆点放大
   - 链接箭头动画

6. **响应式适配** (10min)
   - 移动端隐藏时间线
   - 调整间距

7. **性能优化** (5min)
   - GPU加速
   - will-change

**总计**: 约60分钟

---

## ✅ 验收标准

### 视觉效果
- [ ] 毛玻璃效果清晰可见
- [ ] 渐变色圆点和虚线对齐
- [ ] 文字层次分明
- [ ] 整体透明度和谐

### 交互体验
- [ ] Hover时卡片平滑上浮
- [ ] 圆点发光效果自然
- [ ] 链接点击有视觉反馈
- [ ] 所有动画流畅（60fps）

### 响应式
- [ ] 桌面端显示完整时间线
- [ ] 移动端隐藏装饰，卡片居中
- [ ] 各尺寸下文字可读

### 性能
- [ ] 无卡顿
- [ ] CPU使用率低
- [ ] 兼容主流浏览器

---

## 🎉 设计亮点总结

1. **时间线 + 毛玻璃** = 科技感 + 优雅
2. **极简布局** 去掉多余图片，聚焦内容
3. **渐变装饰** 与整体配色呼应
4. **细节动画** 每个元素都有反馈
5. **性能优先** GPU加速，流畅体验

---

这个设计将会让 Featured Work 区域成为整个页面的视觉亮点！🚀
