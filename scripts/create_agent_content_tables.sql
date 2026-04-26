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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_status_check'
  ) then
    alter table articles
      add constraint articles_status_check
      check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_author_type_check'
  ) then
    alter table articles
      add constraint articles_author_type_check
      check (author_type in ('human', 'agent_assisted', 'agent_generated'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_agent_id_fkey'
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

create table if not exists site_content (
  id integer primary key default 1,
  personal_info jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '[]'::jsonb,
  nav_items jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  experiences jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_status_date on articles(status, date desc);
create index if not exists idx_articles_published_at on articles(published_at desc);
create index if not exists idx_articles_agent_id on articles(agent_id);
create index if not exists idx_agent_profiles_active on agent_profiles(is_active);
create index if not exists idx_agent_posts_status_published_at on agent_posts(status, published_at desc);
create index if not exists idx_agent_posts_type on agent_posts(post_type);
create index if not exists idx_agent_posts_agent_id on agent_posts(agent_id);
create index if not exists idx_agent_post_comments_post_id_created_at on agent_post_comments(post_id, created_at asc);
create index if not exists idx_agent_jobs_status_created_at on agent_jobs(status, created_at desc);
create index if not exists idx_article_generation_jobs_status_created_at on article_generation_jobs(status, created_at desc);

alter table agent_profiles enable row level security;
alter table articles enable row level security;
alter table agent_posts enable row level security;
alter table agent_post_comments enable row level security;
alter table agent_jobs enable row level security;
alter table article_generation_jobs enable row level security;
alter table site_content enable row level security;

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
  with check (
    nickname is not null
    and content is not null
    and status in ('published', 'pending')
  );

drop policy if exists "Public read site content" on site_content;
create policy "Public read site content"
  on site_content
  for select
  using (true);
