-- 插入测试文章数据

-- 文章 1: Vue 3 + Tailwind CSS 重构指南
INSERT INTO articles (title, slug, content, excerpt, status, tags, date)
VALUES (
  'Vue 3 + Tailwind CSS 重构指南',
  'vue3-tailwind-refactor-guide',
  '<h2 id="introduction">简介</h2>
<p>本文将介绍如何将一个现有的 Vue 项目迁移到 Tailwind CSS v4，同时保持代码的可维护性和性能。</p>

<h2 id="setup">环境配置</h2>
<p>首先安装必要的依赖：</p>
<pre><code>npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/postcss</code></pre>

<h3 id="postcss-config">PostCSS 配置</h3>
<p>创建 <code>postcss.config.js</code> 文件：</p>
<pre><code>export default {
  plugins: {
    ''@tailwindcss/postcss'': {},
    autoprefixer: {},
  },
}</code></pre>

<h2 id="theme-system">主题系统</h2>
<p>Tailwind v4 使用新的 <code>@theme</code> 指令定义设计 tokens：</p>
<pre><code>@import "tailwindcss";

@theme {
  --color-gh-bg: #0d1117;
  --color-gh-text: #c9d1d9;
  --color-vp-c-brand: #3eaf7c;
}</code></pre>

<h2 id="conclusion">总结</h2>
<p>Tailwind CSS v4 带来了更简洁的配置方式和更好的性能。通过使用 <code>@theme</code> 指令，我们可以轻松定义和管理设计系统。</p>',
  '了解如何将 Vue 3 项目迁移到 Tailwind CSS v4，包含完整的配置指南和实战技巧。',
  'published',
  ARRAY['Vue 3', 'Tailwind CSS', 'Web Development'],
  '2026-01-20'
);

-- 文章 2: GitHub 风格博客设计
INSERT INTO articles (title, slug, content, excerpt, status, tags, date)
VALUES (
  'GitHub 风格博客设计实现',
  'github-style-blog-design',
  '<h2 id="design-philosophy">设计理念</h2>
<p>GitHub 的界面设计以简洁、专业著称。本文将分享如何在博客中复刻这种设计风格。</p>

<h2 id="color-system">配色方案</h2>
<p>GitHub 使用的深色主题配色：</p>
<ul>
  <li>背景色：<code>#0d1117</code></li>
  <li>卡片背景：<code>#161b22</code></li>
  <li>边框：<code>#30363d</code></li>
  <li>文字主色：<code>#c9d1d9</code></li>
  <li>文字次色：<code>#8b949e</code></li>
</ul>

<h3 id="implementation">实现细节</h3>
<p>使用 CSS 变量可以轻松切换主题：</p>
<pre><code>:root {
  --color-gh-bg: #0d1117;
  --color-gh-card: #161b22;
}

.dark {
  --color-gh-bg: #ffffff;
  --color-gh-card: #f6f8fa;
}</code></pre>

<h2 id="components">关键组件</h2>
<p>实现 GitHub Issues 风格的文章列表需要以下元素：</p>
<ol>
  <li>绿色圆点图标</li>
  <li>标题 + 摘要布局</li>
  <li>标签系统</li>
  <li>时间戳显示</li>
</ol>',
  '学习如何设计一个具有 GitHub 专业感的技术博客，包含配色方案、组件设计等。',
  'published',
  ARRAY['Design', 'CSS', 'GitHub'],
  '2026-01-18'
);

-- 文章 3: 交互式终端组件开发
INSERT INTO articles (title, slug, content, excerpt, status, tags, date)
VALUES (
  '构建交互式终端组件',
  'interactive-terminal-component',
  '<h2 id="overview">概述</h2>
<p>终端（Terminal）组件为博客增添了独特的极客风格。本文介绍如何使用 Vue 3 构建一个功能完整的终端模拟器。</p>

<h2 id="features">核心功能</h2>
<p>一个基础的终端组件应该包含：</p>
<ul>
  <li>命令历史记录</li>
  <li>命令自动补全</li>
  <li>自定义命令系统</li>
  <li>样式定制</li>
</ul>

<h3 id="command-system">命令系统设计</h3>
<p>使用对象映射实现命令处理：</p>
<pre><code>const commands = {
  help: () => `Available commands: help, about, skills`,
  about: () => `Hi! I''m a developer...`,
  skills: () => `Frontend: Vue.js, React, Tailwind CSS`,
}</code></pre>

<h2 id="styling">样式设计</h2>
<p>使用 JetBrains Mono 等等宽字体，配合深色背景和绿色文字，营造真实的终端氛围。</p>',
  '从零开始构建一个 Vue 3 交互式终端组件，让你的博客更具极客范儿。',
  'published',
  ARRAY['Vue 3', 'Components', 'UI'],
  '2026-01-25'
);
