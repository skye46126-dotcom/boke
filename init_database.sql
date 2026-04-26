-- ========================================
-- 一键执行：文章 + 相册数据填充脚本
-- ========================================

-- 步骤 1: 创建 Gallery 相册表（如果不存在）
-- ========================================
create table if not exists gallery_albums (
  id text primary key,
  title text not null,
  description text,
  category text not null default 'projects',
  cover_url text,
  tags text[] default '{}',
  related_type text default null,
  related_id text default null,
  is_featured boolean default false,
  sort_order integer default 999,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists gallery (
  id uuid default uuid_generate_v4() primary key,
  album_id text,
  title text not null,
  description text,
  url text not null,
  tags text[] default '{}',
  category text default 'projects',
  is_featured boolean default false,
  sort_order integer default 999,
  related_type text default null,
  related_id text default null,
  created_at timestamptz default now()
);

alter table gallery add column if not exists category text default 'projects';
alter table gallery add column if not exists is_featured boolean default false;
alter table gallery add column if not exists sort_order integer default 999;
alter table gallery add column if not exists related_type text default null;
alter table gallery add column if not exists related_id text default null;
alter table gallery add column if not exists album_id text;
alter table gallery alter column tags set default '{}';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'gallery_album_id_fkey'
  ) then
    alter table gallery
      add constraint gallery_album_id_fkey
      foreign key (album_id)
      references gallery_albums(id)
      on delete set null;
  end if;
end $$;

-- 开启行级安全 (RLS)
alter table gallery_albums enable row level security;
alter table gallery enable row level security;

drop policy if exists "Allow public read access" on gallery_albums;
create policy "Allow public read access"
  on gallery_albums for select
  using (true);

-- 删除旧的 policy（如果存在）
drop policy if exists "Allow public read access" on gallery;

-- 允许任何人读取相册
create policy "Allow public read access"
  on gallery for select
  using (true);


-- 步骤 2: 插入 3 篇测试文章
-- ========================================

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
) ON CONFLICT (slug) DO NOTHING;

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
) ON CONFLICT (slug) DO NOTHING;

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
) ON CONFLICT (slug) DO NOTHING;


-- 步骤 3: 插入 Gallery Album 与 Photo 示例数据
-- ========================================
insert into gallery_albums (
  id,
  title,
  description,
  category,
  cover_url,
  tags,
  related_type,
  related_id,
  is_featured,
  sort_order,
  created_at,
  updated_at
)
values
  ('personal-blog', 'Personal Blog', 'Core screens from the blog platform, including the homepage surface and the gallery route itself.', 'projects', '/images/gallery/personal-blog/cover.svg', array['blog', 'vue', 'content'], 'project', 'personal-content-platform', true, 1, '2026-04-12T08:00:00Z', '2026-04-26T09:20:00Z'),
  ('agent-forum', 'Agent Forum', 'Visual records for the public agent feed, post detail pages, and discussion flow inside the forum module.', 'projects', '/images/gallery/agent-forum/cover.svg', array['agent', 'forum', 'supabase'], 'project', 'personal-content-platform', true, 2, '2026-04-14T10:00:00Z', '2026-04-26T10:30:00Z'),
  ('clawbot', 'ClawBot', 'A compact album for the hardware direction, covering concept boards and module planning.', 'projects', '/images/gallery/clawbot/cover.svg', array['hardware', 'robot', 'prototype'], 'project', 'clawbot', false, 3, '2026-04-10T07:30:00Z', '2026-04-22T06:00:00Z'),
  ('catgirl-agent', 'Catgirl Agent', 'Portrait and sticker-oriented visuals for a softer, character-driven agent identity direction.', 'agents', '/images/gallery/catgirl-agent/cover.svg', array['agent', 'character', 'stickers'], 'agent', 'agent-writing-assistant', true, 1, '2026-04-18T11:20:00Z', '2026-04-24T08:40:00Z'),
  ('local-forum-agents', 'Local Forum Agents', 'Profile cards and interaction snapshots for agents already appearing in the public forum flow.', 'agents', '/images/gallery/local-forum-agents/cover.svg', array['agent', 'profiles', 'forum'], 'agent', 'agent-project-observer', false, 2, '2026-04-17T12:10:00Z', '2026-04-23T05:20:00Z'),
  ('terminal-code', 'Terminal & Code', 'A workspace collection focused on editor layouts, terminal feedback, and development flow.', 'workspace', '/images/gallery/terminal-code/cover.svg', array['workspace', 'terminal', 'editor'], 'project', 'personal-content-platform', true, 1, '2026-04-15T09:00:00Z', '2026-04-23T09:30:00Z'),
  ('circuit-notes', 'Circuit Notes', 'Visual study notes for phasors, impedance, and hardware-related circuit concepts.', 'notes', '/images/gallery/circuit-notes/cover.svg', array['notes', 'circuit', 'study'], 'none', null, false, 1, '2026-04-16T13:40:00Z', '2026-04-21T15:10:00Z'),
  ('daily-moments', 'Daily Moments', 'A small life collection for desk scenes and quiet moments outside direct project work.', 'life', '/images/gallery/daily-moments/cover.svg', array['life', 'desk', 'moments'], 'none', null, false, 1, '2026-04-11T19:00:00Z', '2026-04-16T20:45:00Z')
on conflict (id) do nothing;

INSERT INTO gallery (
  album_id,
  title,
  description,
  url,
  tags,
  category,
  is_featured,
  sort_order,
  related_type,
  related_id,
  created_at
)
VALUES
  (
    'personal-blog',
    'Blog Home Surface',
    'The homepage layout with navigation cards, sections, and the public-facing content structure.',
    '/images/gallery/personal-blog/cover.svg',
    ARRAY['home', 'layout', 'blog'],
    'projects',
    true,
    1,
    'project',
    'personal-content-platform',
    '2026-04-26T09:20:00Z'
  ),
  (
    'personal-blog',
    'Gallery Route View',
    'The gallery route as part of the wider content platform structure and navigation flow.',
    '/images/gallery/personal-blog/detail.svg',
    ARRAY['gallery', 'route', 'ui'],
    'projects',
    false,
    2,
    'project',
    'personal-content-platform',
    '2026-04-26T09:25:00Z'
  ),
  (
    'agent-forum',
    'Agent Forum Feed',
    'A feed-style overview showing agent posts, tags, and the current publishing rhythm.',
    '/images/gallery/agent-forum/cover.svg',
    ARRAY['feed', 'agent', 'forum'],
    'projects',
    true,
    1,
    'project',
    'personal-content-platform',
    '2026-04-26T10:30:00Z'
  ),
  (
    'agent-forum',
    'Agent Forum Detail',
    'Post detail, comments, and contextual metadata shown together inside the discussion view.',
    '/images/gallery/agent-forum/detail.svg',
    ARRAY['detail', 'comments', 'post'],
    'projects',
    false,
    2,
    'project',
    'personal-content-platform',
    '2026-04-26T10:35:00Z'
  ),
  (
    'clawbot',
    'ClawBot Concept Board',
    'A concept-level board describing the prototype direction, modules, and hardware scope.',
    '/images/gallery/clawbot/cover.svg',
    ARRAY['concept', 'hardware', 'planning'],
    'projects',
    false,
    1,
    'project',
    'clawbot',
    '2026-04-22T06:00:00Z'
  ),
  (
    'clawbot',
    'ClawBot Module Map',
    'A simplified breakdown of display, camera, power, and control modules for the prototype.',
    '/images/gallery/clawbot/detail.svg',
    ARRAY['modules', 'board', 'robot'],
    'projects',
    false,
    2,
    'project',
    'clawbot',
    '2026-04-22T06:10:00Z'
  ),
  (
    'catgirl-agent',
    'Catgirl Agent Portrait',
    'A portrait-oriented visual used as the base identity for the character-style agent direction.',
    '/images/gallery/catgirl-agent/cover.svg',
    ARRAY['portrait', 'agent', 'avatar'],
    'agents',
    true,
    1,
    'agent',
    'agent-writing-assistant',
    '2026-04-24T08:40:00Z'
  ),
  (
    'catgirl-agent',
    'Catgirl Sticker Grid',
    'A compact sticker grid exploring reactions, moods, and lightweight expressive states.',
    '/images/gallery/catgirl-agent/detail.svg',
    ARRAY['stickers', 'expressions', 'agent'],
    'agents',
    false,
    2,
    'agent',
    'agent-writing-assistant',
    '2026-04-24T08:48:00Z'
  ),
  (
    'local-forum-agents',
    'Forum Agent Cards',
    'Profile cards and short summaries for agents active in the public forum surface.',
    '/images/gallery/local-forum-agents/cover.svg',
    ARRAY['cards', 'profiles', 'forum'],
    'agents',
    false,
    1,
    'agent',
    'agent-project-observer',
    '2026-04-23T05:20:00Z'
  ),
  (
    'local-forum-agents',
    'Forum Agent Interaction',
    'A scene showing agent post activity, replies, and the visual hierarchy of interaction.',
    '/images/gallery/local-forum-agents/detail.svg',
    ARRAY['interaction', 'posts', 'comments'],
    'agents',
    false,
    2,
    'agent',
    'agent-project-observer',
    '2026-04-23T05:35:00Z'
  ),
  (
    'terminal-code',
    'Editor Split View',
    'The code editor, side navigation, and surrounding panels arranged for day-to-day project work.',
    '/images/gallery/terminal-code/cover.svg',
    ARRAY['editor', 'workspace', 'code'],
    'workspace',
    true,
    1,
    'project',
    'personal-content-platform',
    '2026-04-23T09:30:00Z'
  ),
  (
    'terminal-code',
    'Deployment Terminal',
    'A terminal-first view of logs, task output, and iteration feedback during development.',
    '/images/gallery/terminal-code/detail.svg',
    ARRAY['terminal', 'logs', 'debug'],
    'workspace',
    false,
    2,
    'project',
    'personal-content-platform',
    '2026-04-23T09:42:00Z'
  ),
  (
    'circuit-notes',
    'Phasor Method Sheet',
    'A note sheet recording phasor reasoning and the structure of alternating current analysis.',
    '/images/gallery/circuit-notes/cover.svg',
    ARRAY['phasor', 'ac', 'notes'],
    'notes',
    false,
    1,
    'none',
    null,
    '2026-04-21T15:10:00Z'
  ),
  (
    'circuit-notes',
    'Impedance Notes',
    'A companion sheet for impedance, admittance, and their practical relationships in exercises.',
    '/images/gallery/circuit-notes/detail.svg',
    ARRAY['impedance', 'admittance', 'study'],
    'notes',
    false,
    2,
    'none',
    null,
    '2026-04-21T15:22:00Z'
  ),
  (
    'daily-moments',
    'Night Desk',
    'A quiet desk scene after coding and planning, used as a softer non-project visual note.',
    '/images/gallery/daily-moments/cover.svg',
    ARRAY['desk', 'night', 'life'],
    'life',
    false,
    1,
    'none',
    null,
    '2026-04-16T20:45:00Z'
  ),
  (
    'daily-moments',
    'City Walk',
    'A minimal city scene that keeps the gallery grounded in daily observation, not only project work.',
    '/images/gallery/daily-moments/detail.svg',
    ARRAY['city', 'walk', 'moments'],
    'life',
    false,
    2,
    'none',
    null,
    '2026-04-16T21:10:00Z'
  );


-- ========================================
-- 执行完成！
-- ========================================
-- 现在你应该有：
-- ✅ 3 篇文章在 articles 表
-- ✅ 8 个相册在 gallery_albums 表
-- ✅ 16 张图片在 gallery 表
-- ✅ Gallery / Gallery Albums 的 RLS 策略已启用
-- 
-- 下一步：刷新浏览器查看效果
-- - Articles: http://localhost:5173/articles
-- - Gallery: http://localhost:5173/gallery
-- ========================================
