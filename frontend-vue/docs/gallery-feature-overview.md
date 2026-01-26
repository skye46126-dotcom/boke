# 📸 相册（Gallery）功能说明

## 当前实现状态

✅ **功能完整度**：90%（已完成核心功能）

**位置**：`src/views/Gallery.vue`

---

## 🎨 设计风格

### GitHub Repo 风格

相册采用 **GitHub 仓库文件列表风格**：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Photo Gallery                    12 photos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────┬────┬────┬────┐
│ 📷 │ 📷 │ 📷 │ 📷 │  ← 网格布局
│    │    │    │    │
├────┼────┼────┼────┤
│ 📷 │ 📷 │ 📷 │ 📷 │
│    │    │    │    │
└────┴────┴────┴────┘
```

**特点**：
- 响应式网格（手机 2列，平板 3列，桌面 4列）
- 卡片边框 + Hover 高亮效果
- 悬停显示标题和描述
- 缩放动画

---

## ✨ 核心功能

### 1. 图片网格展示

**布局**：
```
手机（< 768px）：  2 列
平板（768-1024px）：3 列
桌面（> 1024px）： 4 列
```

**卡片样式**：
- 正方形（aspect-square）
- 图片自动裁剪（object-cover）
- Hover 时：
  - 边框变绿色（品牌色）
  - 图片轻微放大（scale-105）
  - 显示标题和描述遮罩层

---

### 2. 懒加载（Lazy Loading）

**实现方式**：自定义 `v-lazy` 指令

**工作原理**：
```javascript
// 只有图片进入可视区域时才加载
IntersectionObserver → 检测 → 加载图片
```

**效果**：
- ⚡ 提升性能（不一次性加载所有图片）
- 💾 节省流量
- 🎨 加载时显示骨架屏动画

**加载动画**：
```
████░░░░░░░░  ← 流动的渐变效果
```

---

### 3. 图片预览弹窗（Modal）

**功能**：
- 点击图片 → 打开全屏预览
- 显示大图 + 详细信息
- 前后切换按钮
- ESC 关闭 / 点击外部关闭

**Modal 样式**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌──────────────────────────────────┐
│                                  │
│        [大图显示]                 │
│                                  │
└──────────────────────────────────┘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
标题：Summer Vacation 2024
描述：Beautiful sunset at the beach

#travel #sunset #beach

[← Previous]  [Next →]      [Close]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Modal 功能**：
- ✅ 显示完整图片（最大70vh）
- ✅ 标题 + 描述
- ✅ 标签（Tags）
- ✅ 前后切换
- ✅ 平滑动画

---

### 4. 移动端手势支持

**手势操作**：
- 👈 **左滑**：下一张图片
- 👉 **右滑**：上一张图片

**实现**：使用 `@vueuse/core` 的 `useSwipe`

**移动端提示**：
```
👉 Swipe left or right to navigate
```

---

### 5. 键盘导航

**快捷键**：
- `ESC` - 关闭预览
- `←` - 上一张（可扩展）
- `→` - 下一张（可扩展）

---

## 🗄️ 数据来源

### Supabase 数据库

**数据表**：`gallery`

**字段结构**：
```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,           -- 图片标题
  description TEXT,               -- 描述
  url TEXT NOT NULL,              -- 图片URL
  tags TEXT[],                    -- 标签数组
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**数据获取**：
```javascript
// 从 Supabase 获取，按创建时间倒序
const { data } = await supabase
  .from('gallery')
  .select('*')
  .order('created_at', { ascending: false })
```

---

## 📊 状态管理

### 三种UI状态

**1. 加载中（Loading）**：
```
Loading gallery...
```

**2. 错误（Error）**：
```
Failed to load gallery. 
Please check your database connection.
```

**3. 正常显示（Success）**：
```
显示图片网格
```

---

## 🎬 动画效果

### 1. Modal 动画

**进入**：
- 背景淡入（opacity 0 → 1）
- 卡片放大（scale 0.95 → 1）
- 持续时间：0.3s

**退出**：
- 背景淡出
- 卡片缩小
- 持续时间：0.3s

### 2. 卡片 Hover 动画

```css
.group:hover {
  border-color: green;  /* 品牌色 */
}

.group:hover img {
  transform: scale(1.05);  /* 放大5% */
}

.group:hover .overlay {
  opacity: 1;  /* 显示标题 */
}
```

### 3. 懒加载骨架屏

```css
/* 流动的渐变加载动画 */
@keyframes loading {
  0%   { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
```

---

## 📁 文件结构

```
src/
  views/
    Gallery.vue           ← 相册主页面（完整实现）
  
  lib/
    supabase.js          ← Supabase 客户端配置
```

---

## ⚙️ 配置要求

### 需要配置 Supabase

**1. 创建数据表**

运行 SQL（在 Supabase Dashboard）：

```sql
-- 创建 gallery 表
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS（行级安全）
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取
CREATE POLICY "Allow public read access"
  ON gallery FOR SELECT
  USING (true);
```

**2. 添加示例数据**

```sql
INSERT INTO gallery (title, description, url, tags) VALUES
  (
    'Beautiful Sunset', 
    'A stunning sunset over the ocean',
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913',
    ARRAY['nature', 'sunset', 'ocean']
  ),
  (
    'Mountain Landscape',
    'Majestic mountain peaks',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    ARRAY['nature', 'mountain', 'landscape']
  ),
  (
    'City Lights',
    'Urban cityscape at night',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    ARRAY['city', 'night', 'urban']
  );
```

**3. 配置 Supabase 客户端**

确保 `src/lib/supabase.js` 已配置：

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 🧪 测试相册功能

### 本地测试步骤

**1. 访问相册页面**
```
http://localhost:5173/gallery
```

**2. 应该看到**：
- 如果已配置 Supabase：显示图片网格
- 如果未配置：显示错误信息

**3. 测试功能**：
- 点击图片 → 打开预览
- 在预览中点击 Next/Previous
- 移动端测试滑动手势
- 按 ESC 关闭预览

---

## 🎨 视觉效果预览

### 网格视图（桌面）
```
┌─────────┬─────────┬─────────┬─────────┐
│         │         │         │         │
│  📷 1   │  📷 2   │  📷 3   │  📷 4   │
│         │         │         │         │
├─────────┼─────────┼─────────┼─────────┤
│         │         │         │         │
│  📷 5   │  📷 6   │  📷 7   │  📷 8   │
│         │         │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

### Hover 效果
```
┌─────────────────────┐
│                     │
│      [图片]         │  ← 轻微放大
│                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  ← 渐变遮罩
│ 📷 Beautiful Sunset │
│ A stunning sunset...│
└─────────────────────┘
    ↑ 绿色边框
```

### Modal 预览
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [大图完整显示]               │
│                                     │
│                                     │
└─────────────────────────────────────┘

📸 Beautiful Sunset
A stunning sunset over the ocean

#nature  #sunset  #ocean

[← Previous]  [Next →]        [Close]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 优势与特色

### 性能优化
- ✅ 懒加载（只加载可见图片）
- ✅ 响应式图片
- ✅ 平滑动画（GPU 加速）

### 用户体验
- ✅ GitHub 风格，简洁专业
- ✅ 移动端手势支持
- ✅ 键盘快捷键
- ✅ 加载状态提示

### 技术实现
- ✅ 现代 Vue 3 Composition API
- ✅ VueUse 工具库
- ✅ Supabase 实时数据
- ✅ 自定义懒加载指令

---

## ⚠️ 当前限制

### 需要手动配置的部分：

1. **Supabase 数据库**
   - 创建 gallery 表
   - 添加图片数据

2. **图片存储**
   - 图片需要上传到云存储（Supabase Storage 或其他）
   - 获取图片 URL

3. **Header 占位符**
   - `YourName` 需要替换（第7行）

---

## 📝 下一步建议

### 如果您想使用相册功能：

**立即需要**：
1. 配置 Supabase（创建表、添加数据）
2. 上传图片到云存储
3. 测试功能

**可选增强**：
- 添加图片上传功能
- 添加相册分类
- 添加图片搜索
- 添加点赞/评论

### 如果暂时不需要：

可以：
- 从导航中移除 Gallery 链接
- 或者保留，等以后再配置

---

## ✅ 总结

**相册功能已完整实现**，包括：
- ✅ 响应式网格布局
- ✅ 懒加载优化
- ✅ 图片预览 Modal
- ✅ 移动端手势
- ✅ GitHub 风格设计
- ✅ 平滑动画

**唯一需要的**：配置 Supabase 数据库

**建议**：如果近期不需要相册功能，可以暂时跳过配置，专注于完善其他部分（如 portfolio.js 数据填写）。

---

**需要我帮您配置 Supabase 相册数据库吗？** 😊
