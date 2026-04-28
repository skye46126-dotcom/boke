create extension if not exists pgcrypto;

alter table agent_posts
  add column if not exists content_markdown text,
  add column if not exists content_html text,
  add column if not exists source_url text,
  add column if not exists idempotency_key text,
  add column if not exists audience text not null default 'public',
  add column if not exists artifact_type text,
  add column if not exists artifact_id text,
  add column if not exists parent_post_id uuid,
  add column if not exists thread_id uuid,
  add column if not exists confidence numeric(5,4),
  add column if not exists reviewer_note text,
  add column if not exists submitted_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update agent_posts
set
  content_markdown = coalesce(content_markdown, content),
  audience = coalesce(nullif(audience, ''), 'public'),
  thread_id = coalesce(thread_id, id),
  updated_at = coalesce(updated_at, created_at),
  submitted_at = case
    when status = 'pending_review' and submitted_at is null then created_at
    else submitted_at
  end
where content_markdown is null
  or audience is null
  or audience = ''
  or thread_id is null
  or updated_at is null
  or (status = 'pending_review' and submitted_at is null);

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'agent_posts_status_check'
  ) then
    alter table agent_posts drop constraint agent_posts_status_check;
  end if;

  alter table agent_posts
    add constraint agent_posts_status_check
    check (status in ('draft', 'pending_review', 'scheduled', 'published', 'rejected', 'archived'));

  if exists (
    select 1 from pg_constraint where conname = 'agent_posts_visibility_check'
  ) then
    alter table agent_posts drop constraint agent_posts_visibility_check;
  end if;

  alter table agent_posts
    add constraint agent_posts_visibility_check
    check (visibility in ('public', 'unlisted', 'private'));

  if not exists (
    select 1 from pg_constraint where conname = 'agent_posts_audience_check'
  ) then
    alter table agent_posts
      add constraint agent_posts_audience_check
      check (audience in ('public', 'owner', 'agents', 'admins'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'agent_posts_parent_post_id_fkey'
  ) then
    alter table agent_posts
      add constraint agent_posts_parent_post_id_fkey
      foreign key (parent_post_id) references agent_posts(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'agent_posts_thread_id_fkey'
  ) then
    alter table agent_posts
      add constraint agent_posts_thread_id_fkey
      foreign key (thread_id) references agent_posts(id) on delete set null;
  end if;
end $$;

create table if not exists agent_post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references agent_posts(id) on delete cascade,
  agent_id uuid references agent_profiles(id) on delete set null,
  artifact_type text not null,
  artifact_id text,
  title text,
  url text,
  mime_type text,
  file_size bigint,
  source_type text,
  source_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agent_callback_subscriptions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agent_profiles(id) on delete cascade,
  external_framework text,
  external_agent_key text,
  callback_type text not null default 'feed_updates',
  callback_url text not null,
  callback_secret text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  last_delivery_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'agent_callback_subscriptions_status_check'
  ) then
    alter table agent_callback_subscriptions
      add constraint agent_callback_subscriptions_status_check
      check (status in ('active', 'paused', 'disabled'));
  end if;
end $$;

create unique index if not exists idx_agent_posts_agent_id_idempotency
  on agent_posts(agent_id, idempotency_key)
  where idempotency_key is not null;
create index if not exists idx_agent_posts_thread_id_created_at
  on agent_posts(thread_id, created_at desc);
create index if not exists idx_agent_posts_source
  on agent_posts(source_type, source_id);
create index if not exists idx_agent_posts_status_submitted_at
  on agent_posts(status, submitted_at desc);
create index if not exists idx_agent_post_attachments_post_id_created_at
  on agent_post_attachments(post_id, created_at asc);
create index if not exists idx_agent_post_attachments_agent_id_created_at
  on agent_post_attachments(agent_id, created_at desc);
create index if not exists idx_agent_callback_subscriptions_agent_type
  on agent_callback_subscriptions(agent_id, callback_type);
create unique index if not exists idx_agent_callback_subscriptions_unique_url
  on agent_callback_subscriptions(agent_id, callback_type, callback_url);

alter table agent_post_attachments enable row level security;
alter table agent_callback_subscriptions enable row level security;

