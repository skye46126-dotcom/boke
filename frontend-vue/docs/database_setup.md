# Supabase 数据库配置指南

## 📊 当前状态

浏览器测试结果显示：
- ✅ **前端代码**：所有组件正常部署
- ❌ **数据库**：缺少测试数据（articles 和 gallery 表为空或不存在）

## 🎯 需要执行的 SQL 文件

### 1. sample_articles.sql
**位置**：`/Users/Zhuanz/boke/sample_articles.sql`

**包含内容**：
- 3 篇测试文章（已包含完整的 HTML 格式内容）
- 标题、摘要、标签、日期等字段

**文章列表**：
1. Vue 3 + Tailwind CSS 重构指南
2. GitHub 风格博客设计实现
3. 构建交互式终端组件

### 2. gallery_schema.sql
**位置**：`/Users/Zhuanz/boke/gallery_schema.sql`

**包含内容**：
- `gallery` 表结构定义
- RLS（行级安全）策略
- 6 张示例图片（使用 Unsplash 链接）

---

## 🚀 执行步骤

### 方法 1：Supabase Dashboard（推荐）

1. **打开 Supabase Dashboard**
   - 访问 https://supabase.com/dashboard
   - 选择你的项目

2. **进入 SQL Editor**
   - 左侧菜单 → `SQL Editor`
   - 点击 `New Query`

3. **运行 sample_articles.sql**
   ```sql
   -- 复制 /Users/Zhuanz/boke/sample_articles.sql 的完整内容
   -- 粘贴到 SQL Editor
   -- 点击 "Run" 或按 Cmd+Enter
   ```

4. **运行 gallery_schema.sql**
   ```sql
   -- 复制 /Users/Zhuanz/boke/gallery_schema.sql 的完整内容
   -- 粘贴到新的 Query 窗口
   -- 点击 "Run"
   ```

5. **验证数据**
   - 左侧菜单 → `Table Editor`
   - 检查 `articles` 表是否有 3 条记录
   - 检查 `gallery` 表是否有 6 条记录

### 方法 2：使用 Supabase CLI（可选）

```bash
# 1. 确保已安装 Supabase CLI
# brew install supabase/tap/supabase

# 2. 进入项目目录
cd /Users/Zhuanz/boke

# 3. 运行 SQL 文件
supabase db execute < sample_articles.sql
supabase db execute < gallery_schema.sql
```

---

## ✅ 预期结果

执行成功后，你应该看到：

### Articles 表
```
| id | title | slug | status | tags | date |
|----|-------|------|--------|------|------|
| 1  | Vue 3 + Tailwind CSS 重构指南 | vue3-tailwind-refactor-guide | published | ["Vue 3", "Tailwind CSS", ...] | 2026-01-20 |
| 2  | GitHub 风格博客设计实现 | github-style-blog-design | published | ["Design", "CSS", ...] | 2026-01-18 |
| 3  | 构建交互式终端组件 | interactive-terminal-component | published | ["Vue 3", "Components", ...] | 2026-01-25 |
```

### Gallery 表
```
| id | title | url | tags |
|----|-------|-----|------|
| 1  | Terminal UI Design | https://images.unsplash.com/... | ["UI", "Terminal", ...] |
| 2  | Code Editor Theme | https://images.unsplash.com/... | ["Code", "Editor", ...] |
| ... | ... | ... | ... |
```

---

## 🧪 测试新功能

数据填充完成后，在浏览器中访问：

### 1. 文章列表
```
http://localhost:5173/articles
```
应该看到 3 篇文章的 GitHub Issues 风格列表

### 2. 文章详情（测试所有新功能）
```
http://localhost:5173/articles/vue3-tailwind-refactor-guide
```

**需要验证的功能**：
- ✅ **阅读进度条**：页面顶部渐变细线，滚动时跟随进度
- ✅ **目录高亮**：左侧 TOC 自动高亮当前阅读的标题
- ✅ **滑块指示器**：绿色竖线随着高亮移动（Stripe 风格）
- ✅ **Giscus 评论**：页面底部显示 GitHub Discussions 评论框

### 3. 相册
```
http://localhost:5173/gallery
```
应该看到 6 张图片的网格布局

---

## 🐛 常见问题

### Q1: "Cannot coerce the result to a single JSON object"
**原因**：articles 表为空  
**解决**：运行 `sample_articles.sql`

### Q2: "Could not find the table 'public.gallery'"
**原因**：gallery 表不存在  
**解决**：运行 `gallery_schema.sql`

### Q3: Giscus 评论显示 "Discussion not found"
**原因**：需要配置 Giscus  
**解决**：
1. 访问 https://giscus.app
2. 输入你的 GitHub 仓库信息
3. 复制生成的配置
4. 更新 `src/components/Comments.vue` 中的 `config` 对象

---

## 📝 下一步

执行完 SQL 后：
1. 刷新浏览器页面
2. 测试上述所有功能
3. 如果发现问题，告诉我具体的错误信息

**准备好继续了吗？** 🚀
