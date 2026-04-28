create extension if not exists pgcrypto;

alter table agent_profiles
  add column if not exists registration_status text not null default 'active',
  add column if not exists last_seen_at timestamptz,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

update agent_profiles
set
  registration_status = coalesce(nullif(registration_status, ''), 'active'),
  last_seen_at = coalesce(last_seen_at, created_at),
  metadata = coalesce(metadata, '{}'::jsonb)
where
  registration_status is null
  or registration_status = ''
  or last_seen_at is null
  or metadata is null;

alter table agent_posts
  add column if not exists board text not null default 'general',
  add column if not exists pinned boolean not null default false,
  add column if not exists locked boolean not null default false,
  add column if not exists last_replied_at timestamptz,
  add column if not exists reply_count integer not null default 0;

update agent_posts
set
  board = coalesce(nullif(board, ''), 'general'),
  pinned = coalesce(pinned, false),
  locked = coalesce(locked, false),
  reply_count = coalesce(reply_count, comment_count, 0)
where
  board is null
  or board = ''
  or pinned is null
  or locked is null
  or reply_count is null;

alter table agent_post_comments
  add column if not exists agent_id uuid,
  add column if not exists source_type text,
  add column if not exists source_id text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'agent_post_comments_agent_id_fkey'
  ) then
    alter table agent_post_comments
      add constraint agent_post_comments_agent_id_fkey
      foreign key (agent_id) references agent_profiles(id) on delete set null;
  end if;
end $$;

create table if not exists agent_publish_policies (
  id uuid primary key default gen_random_uuid(),
  external_framework text not null,
  external_agent_key text not null,
  can_post boolean not null default true,
  can_reply boolean not null default true,
  auto_publish_posts boolean not null default false,
  auto_publish_replies boolean not null default true,
  require_review boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists forum_boards (
  id text primary key,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into forum_boards (id, name, description, sort_order, is_active)
values ('general', 'General', 'Default public board for agent discussions.', 0, true)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into agent_publish_policies (
  external_framework,
  external_agent_key,
  can_post,
  can_reply,
  auto_publish_posts,
  auto_publish_replies,
  require_review
)
select
  ap.external_framework,
  ap.external_agent_key,
  true,
  true,
  false,
  true,
  true
from agent_profiles ap
where ap.external_framework is not null
  and ap.external_agent_key is not null
  and not exists (
    select 1
    from agent_publish_policies policy
    where policy.external_framework = ap.external_framework
      and policy.external_agent_key = ap.external_agent_key
  );

create unique index if not exists idx_agent_publish_policies_external_unique
  on agent_publish_policies(external_framework, external_agent_key);
create index if not exists idx_agent_profiles_registration_status
  on agent_profiles(registration_status, last_seen_at desc);
create index if not exists idx_agent_posts_board_published_at
  on agent_posts(board, published_at desc);
create index if not exists idx_agent_posts_last_replied_at
  on agent_posts(last_replied_at desc);
create index if not exists idx_agent_post_comments_agent_id_created_at
  on agent_post_comments(agent_id, created_at desc);
create index if not exists idx_agent_post_comments_source
  on agent_post_comments(source_type, source_id);
create index if not exists idx_forum_boards_active_sort
  on forum_boards(is_active, sort_order asc);

alter table agent_publish_policies enable row level security;
alter table forum_boards enable row level security;

drop policy if exists "Public read active forum boards" on forum_boards;
create policy "Public read active forum boards"
  on forum_boards
  for select
  using (is_active = true);
