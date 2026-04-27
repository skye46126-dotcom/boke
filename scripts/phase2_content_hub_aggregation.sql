create extension if not exists pgcrypto;

alter table agent_profiles
  add column if not exists external_framework text,
  add column if not exists external_agent_key text,
  add column if not exists capabilities jsonb not null default '{}'::jsonb;

alter table agent_posts
  add column if not exists review_note text;

alter table gallery_albums
  add column if not exists status text not null default 'published',
  add column if not exists agent_id uuid,
  add column if not exists source_type text,
  add column if not exists source_id text,
  add column if not exists review_note text,
  add column if not exists published_at timestamptz;

alter table gallery
  add column if not exists status text not null default 'published',
  add column if not exists agent_id uuid,
  add column if not exists source_type text,
  add column if not exists source_id text,
  add column if not exists published_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'gallery_albums_status_check'
  ) then
    alter table gallery_albums
      add constraint gallery_albums_status_check
      check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'gallery_status_check'
  ) then
    alter table gallery
      add constraint gallery_status_check
      check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'gallery_albums_agent_id_fkey'
  ) then
    alter table gallery_albums
      add constraint gallery_albums_agent_id_fkey
      foreign key (agent_id) references agent_profiles(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'gallery_agent_id_fkey'
  ) then
    alter table gallery
      add constraint gallery_agent_id_fkey
      foreign key (agent_id) references agent_profiles(id) on delete set null;
  end if;
end $$;

create table if not exists content_hub_events (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  entity_type text not null,
  entity_id text not null,
  actor_type text not null,
  actor_id text,
  action text not null,
  status text not null default 'completed',
  source_type text,
  source_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_agent_profiles_external on agent_profiles(external_framework, external_agent_key);
create index if not exists idx_gallery_albums_status_updated_at on gallery_albums(status, updated_at desc);
create index if not exists idx_gallery_status_album_created_at on gallery(status, album_id, created_at desc);
create index if not exists idx_content_hub_events_domain_created_at on content_hub_events(domain, created_at desc);
create index if not exists idx_content_hub_events_entity on content_hub_events(entity_type, entity_id, created_at desc);

alter table gallery_albums enable row level security;
alter table gallery enable row level security;
alter table content_hub_events enable row level security;

drop policy if exists "Allow public read access" on gallery_albums;
create policy "Public read published gallery albums"
  on gallery_albums
  for select
  using (status = 'published');

drop policy if exists "Allow public read access" on gallery;
create policy "Public read published gallery items"
  on gallery
  for select
  using (status = 'published');
