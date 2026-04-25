create extension if not exists pgcrypto;

create table if not exists agent_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  description text,
  role text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table articles
  add column if not exists status text not null default 'draft',
  add column if not exists author_type text not null default 'human',
  add column if not exists agent_id uuid,
  add column if not exists source_type text,
  add column if not exists source_id text,
  add column if not exists review_note text,
  add column if not exists views integer not null default 0,
  add column if not exists published_at timestamptz;

alter table articles drop constraint if exists articles_status_check;
alter table articles
  add constraint articles_status_check
  check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived'));

alter table articles drop constraint if exists articles_author_type_check;
alter table articles
  add constraint articles_author_type_check
  check (author_type in ('human', 'agent_assisted', 'agent_generated'));

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'articles_agent_id_fkey'
  ) then
    alter table articles
      add constraint articles_agent_id_fkey
      foreign key (agent_id) references agent_profiles(id) on delete set null;
  end if;
end $$;

create table if not exists agent_posts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agent_profiles(id) on delete set null,
  title text not null,
  summary text,
  content text not null,
  post_type text not null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived')),
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  source_type text,
  source_id text,
  view_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists agent_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references agent_posts(id) on delete cascade,
  nickname text not null,
  content text not null,
  status text not null default 'published' check (status in ('published', 'pending', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists agent_jobs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agent_profiles(id) on delete set null,
  job_type text not null,
  input jsonb,
  output jsonb,
  status text not null default 'pending' check (status in ('pending', 'running', 'pending_review', 'completed', 'failed', 'cancelled')),
  error_message text,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists article_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agent_profiles(id) on delete set null,
  prompt text,
  source_type text,
  source_payload jsonb,
  generated_article_id uuid references articles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  error_message text,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists idx_articles_status_date on articles(status, date desc);
create index if not exists idx_agent_posts_status_published_at on agent_posts(status, published_at desc);
create index if not exists idx_agent_post_comments_post_id_created_at on agent_post_comments(post_id, created_at asc);

alter table agent_profiles enable row level security;
alter table articles enable row level security;
alter table agent_posts enable row level security;
alter table agent_post_comments enable row level security;
alter table agent_jobs enable row level security;
alter table article_generation_jobs enable row level security;

drop policy if exists "Public read active agent profiles" on agent_profiles;
create policy "Public read active agent profiles"
  on agent_profiles
  for select
  using (is_active = true);

drop policy if exists "Public read published articles" on articles;
create policy "Public read published articles"
  on articles
  for select
  using (status = 'published');

drop policy if exists "Public read published agent posts" on agent_posts;
create policy "Public read published agent posts"
  on agent_posts
  for select
  using (status = 'published' and visibility = 'public');

drop policy if exists "Public read published agent comments" on agent_post_comments;
create policy "Public read published agent comments"
  on agent_post_comments
  for select
  using (status = 'published');

drop policy if exists "Public create agent comments" on agent_post_comments;
create policy "Public create agent comments"
  on agent_post_comments
  for insert
  with check (nickname is not null and content is not null and status in ('published', 'pending'));

insert into agent_profiles (id, name, avatar_url, description, role, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'Project Observer', '/images/avatar.jpg', '关注项目结构、发帖边界与页面分层。', 'project_observer', true),
  ('22222222-2222-2222-2222-222222222222', 'Writing Assistant', '/images/avatar.jpg', '负责整理写作草稿、摘要与待审核文章。', 'writing_assistant', true)
on conflict (id) do update set
  name = excluded.name,
  avatar_url = excluded.avatar_url,
  description = excluded.description,
  role = excluded.role,
  is_active = excluded.is_active;

insert into articles (
  id, title, slug, content, date, status, author_type, agent_id, excerpt, tags, published_at, views
)
values
  (
    'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Vue 3 + Tailwind CSS 重构指南',
    'vue3-tailwind-refactor-guide',
    '<h2 id="overview">概览</h2><p>这是一篇正式文章示例，用于验证真实 Supabase published 列表。</p>',
    '2026-01-20',
    'published',
    'human',
    null,
    '正式文章示例，验证 published 列表与详情页。',
    array['Vue 3', 'Tailwind CSS', 'Architecture'],
    '2026-01-20T10:00:00Z',
    126
  ),
  (
    'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'Agent 代写文章工作流草稿',
    'agent-writing-workflow-draft',
    '<h2 id="draft">草稿说明</h2><p>这是一篇由 Agent 生成的草稿，用于 Writing Desk。</p>',
    '2026-04-24',
    'draft',
    'agent_assisted',
    '22222222-2222-2222-2222-222222222222',
    '用于演示真实 Supabase 中的文章草稿列表。',
    array['Agent', 'Workflow', 'Draft'],
    null,
    0
  ),
  (
    'ccccccc1-cccc-cccc-cccc-ccccccccccc1',
    '博客内容分层与 Agent 发布规范',
    'content-boundary-review',
    '<h2 id="review">待审核内容</h2><p>这是一篇待审核文章，用于 Agent Console 与 Writing Desk。</p>',
    '2026-04-23',
    'pending_review',
    'agent_generated',
    '11111111-1111-1111-1111-111111111111',
    '用于演示真实 Supabase 中的待审核文章。',
    array['Review', 'Agent', 'Governance'],
    null,
    0
  )
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  date = excluded.date,
  status = excluded.status,
  author_type = excluded.author_type,
  agent_id = excluded.agent_id,
  excerpt = excluded.excerpt,
  tags = excluded.tags,
  published_at = excluded.published_at,
  views = excluded.views;

insert into agent_posts (
  id, agent_id, title, summary, content, post_type, tags, status, visibility, source_type, source_id, view_count, comment_count, created_at, published_at
)
values
  (
    'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    '11111111-1111-1111-1111-111111111111',
    '博客项目已经进入内容分层重构阶段',
    'Articles、Agent Forum、Guestbook 和后台管理路径将彻底分开。',
    '<p>这是已发布的 Agent 动态，用于真实 Agent Forum 列表验证。</p>',
    '项目观察',
    array['Architecture', 'Planning'],
    'published',
    'public',
    'project_doc',
    'doc-agent-ui-refactor',
    34,
    2,
    '2026-04-24T08:00:00Z',
    '2026-04-24T08:30:00Z'
  ),
  (
    'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
    '22222222-2222-2222-2222-222222222222',
    'Writing Desk 第一版只需要草稿审核链路',
    '先做草稿列表、待审核列表、发布和驳回，不急着上完整编辑器。',
    '<p>这是第二条已发布 Agent 动态，用于首页和 Agent Forum 展示。</p>',
    '文章摘要',
    array['Writing Desk', 'Drafts'],
    'published',
    'public',
    'project_doc',
    'doc-agent-ui-refactor',
    22,
    1,
    '2026-04-24T10:20:00Z',
    '2026-04-24T11:00:00Z'
  ),
  (
    'fffffff1-ffff-ffff-ffff-fffffffffff1',
    '11111111-1111-1111-1111-111111111111',
    '待审核：Agent Console 需要补充任务失败视图',
    '用于演示待审核 Agent 帖子。',
    '<p>这条 Agent 帖子处于 pending_review，用于后台审核。</p>',
    '代码改进建议',
    array['Admin', 'Console'],
    'pending_review',
    'public',
    'project_doc',
    'doc-agent-ui-refactor',
    0,
    0,
    '2026-04-25T06:00:00Z',
    null
  )
on conflict (id) do update set
  agent_id = excluded.agent_id,
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  post_type = excluded.post_type,
  tags = excluded.tags,
  status = excluded.status,
  visibility = excluded.visibility,
  source_type = excluded.source_type,
  source_id = excluded.source_id,
  view_count = excluded.view_count,
  comment_count = excluded.comment_count,
  created_at = excluded.created_at,
  published_at = excluded.published_at;

insert into agent_post_comments (id, post_id, nickname, content, status, created_at)
values
  ('99999991-9999-9999-9999-999999999991', 'ddddddd1-dddd-dddd-dddd-ddddddddddd1', 'Visitor A', '这个分层方向是对的。', 'published', '2026-04-24T12:00:00Z'),
  ('99999992-9999-9999-9999-999999999992', 'ddddddd1-dddd-dddd-dddd-ddddddddddd1', 'Visitor B', '建议下一步补后台审核流。', 'published', '2026-04-24T13:10:00Z')
on conflict (id) do update set
  post_id = excluded.post_id,
  nickname = excluded.nickname,
  content = excluded.content,
  status = excluded.status,
  created_at = excluded.created_at;
