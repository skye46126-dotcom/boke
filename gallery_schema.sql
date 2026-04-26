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

alter table gallery add column if not exists album_id text;
alter table gallery add column if not exists category text default 'projects';
alter table gallery add column if not exists is_featured boolean default false;
alter table gallery add column if not exists sort_order integer default 999;
alter table gallery add column if not exists related_type text default null;
alter table gallery add column if not exists related_id text default null;
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

alter table gallery_albums enable row level security;
alter table gallery enable row level security;

drop policy if exists "Allow public read access" on gallery_albums;
create policy "Allow public read access"
  on gallery_albums for select
  using (true);

drop policy if exists "Allow public read access" on gallery;
create policy "Allow public read access"
  on gallery for select
  using (true);

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
  (
    'personal-blog',
    'Personal Blog',
    'Core screens from the blog platform, including the homepage surface and the gallery route itself.',
    'projects',
    '/images/gallery/personal-blog/cover.svg',
    array['blog', 'vue', 'content'],
    'project',
    'personal-content-platform',
    true,
    1,
    '2026-04-12T08:00:00Z',
    '2026-04-26T09:20:00Z'
  ),
  (
    'agent-forum',
    'Agent Forum',
    'Visual records for the public agent feed, post detail pages, and discussion flow inside the forum module.',
    'projects',
    '/images/gallery/agent-forum/cover.svg',
    array['agent', 'forum', 'supabase'],
    'project',
    'personal-content-platform',
    true,
    2,
    '2026-04-14T10:00:00Z',
    '2026-04-26T10:30:00Z'
  ),
  (
    'clawbot',
    'ClawBot',
    'A compact album for the hardware direction, covering concept boards and module planning.',
    'projects',
    '/images/gallery/clawbot/cover.svg',
    array['hardware', 'robot', 'prototype'],
    'project',
    'clawbot',
    false,
    3,
    '2026-04-10T07:30:00Z',
    '2026-04-22T06:00:00Z'
  ),
  (
    'catgirl-agent',
    'Catgirl Agent',
    'Portrait and sticker-oriented visuals for a softer, character-driven agent identity direction.',
    'agents',
    '/images/gallery/catgirl-agent/cover.svg',
    array['agent', 'character', 'stickers'],
    'agent',
    'agent-writing-assistant',
    true,
    1,
    '2026-04-18T11:20:00Z',
    '2026-04-24T08:40:00Z'
  ),
  (
    'local-forum-agents',
    'Local Forum Agents',
    'Profile cards and interaction snapshots for agents already appearing in the public forum flow.',
    'agents',
    '/images/gallery/local-forum-agents/cover.svg',
    array['agent', 'profiles', 'forum'],
    'agent',
    'agent-project-observer',
    false,
    2,
    '2026-04-17T12:10:00Z',
    '2026-04-23T05:20:00Z'
  ),
  (
    'terminal-code',
    'Terminal & Code',
    'A workspace collection focused on editor layouts, terminal feedback, and development flow.',
    'workspace',
    '/images/gallery/terminal-code/cover.svg',
    array['workspace', 'terminal', 'editor'],
    'project',
    'personal-content-platform',
    true,
    1,
    '2026-04-15T09:00:00Z',
    '2026-04-23T09:30:00Z'
  ),
  (
    'circuit-notes',
    'Circuit Notes',
    'Visual study notes for phasors, impedance, and hardware-related circuit concepts.',
    'notes',
    '/images/gallery/circuit-notes/cover.svg',
    array['notes', 'circuit', 'study'],
    'none',
    null,
    false,
    1,
    '2026-04-16T13:40:00Z',
    '2026-04-21T15:10:00Z'
  ),
  (
    'daily-moments',
    'Daily Moments',
    'A small life collection for desk scenes and quiet moments outside direct project work.',
    'life',
    '/images/gallery/daily-moments/cover.svg',
    array['life', 'desk', 'moments'],
    'none',
    null,
    false,
    1,
    '2026-04-11T19:00:00Z',
    '2026-04-16T20:45:00Z'
  )
on conflict (id) do nothing;

insert into gallery (
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
values
  ('personal-blog', 'Blog Home Surface', 'The homepage layout with navigation cards, sections, and the public-facing content structure.', '/images/gallery/personal-blog/cover.svg', array['home', 'layout', 'blog'], 'projects', true, 1, 'project', 'personal-content-platform', '2026-04-26T09:20:00Z'),
  ('personal-blog', 'Gallery Route View', 'The gallery route as part of the wider content platform structure and navigation flow.', '/images/gallery/personal-blog/detail.svg', array['gallery', 'route', 'ui'], 'projects', false, 2, 'project', 'personal-content-platform', '2026-04-26T09:25:00Z'),
  ('agent-forum', 'Agent Forum Feed', 'A feed-style overview showing agent posts, tags, and the current publishing rhythm.', '/images/gallery/agent-forum/cover.svg', array['feed', 'agent', 'forum'], 'projects', true, 1, 'project', 'personal-content-platform', '2026-04-26T10:30:00Z'),
  ('agent-forum', 'Agent Forum Detail', 'Post detail, comments, and contextual metadata shown together inside the discussion view.', '/images/gallery/agent-forum/detail.svg', array['detail', 'comments', 'post'], 'projects', false, 2, 'project', 'personal-content-platform', '2026-04-26T10:35:00Z'),
  ('clawbot', 'ClawBot Concept Board', 'A concept-level board describing the prototype direction, modules, and hardware scope.', '/images/gallery/clawbot/cover.svg', array['concept', 'hardware', 'planning'], 'projects', false, 1, 'project', 'clawbot', '2026-04-22T06:00:00Z'),
  ('clawbot', 'ClawBot Module Map', 'A simplified breakdown of display, camera, power, and control modules for the prototype.', '/images/gallery/clawbot/detail.svg', array['modules', 'board', 'robot'], 'projects', false, 2, 'project', 'clawbot', '2026-04-22T06:10:00Z'),
  ('catgirl-agent', 'Catgirl Agent Portrait', 'A portrait-oriented visual used as the base identity for the character-style agent direction.', '/images/gallery/catgirl-agent/cover.svg', array['portrait', 'agent', 'avatar'], 'agents', true, 1, 'agent', 'agent-writing-assistant', '2026-04-24T08:40:00Z'),
  ('catgirl-agent', 'Catgirl Sticker Grid', 'A compact sticker grid exploring reactions, moods, and lightweight expressive states.', '/images/gallery/catgirl-agent/detail.svg', array['stickers', 'expressions', 'agent'], 'agents', false, 2, 'agent', 'agent-writing-assistant', '2026-04-24T08:48:00Z'),
  ('local-forum-agents', 'Forum Agent Cards', 'Profile cards and short summaries for agents active in the public forum surface.', '/images/gallery/local-forum-agents/cover.svg', array['cards', 'profiles', 'forum'], 'agents', false, 1, 'agent', 'agent-project-observer', '2026-04-23T05:20:00Z'),
  ('local-forum-agents', 'Forum Agent Interaction', 'A scene showing agent post activity, replies, and the visual hierarchy of interaction.', '/images/gallery/local-forum-agents/detail.svg', array['interaction', 'posts', 'comments'], 'agents', false, 2, 'agent', 'agent-project-observer', '2026-04-23T05:35:00Z'),
  ('terminal-code', 'Editor Split View', 'The code editor, side navigation, and surrounding panels arranged for day-to-day project work.', '/images/gallery/terminal-code/cover.svg', array['editor', 'workspace', 'code'], 'workspace', true, 1, 'project', 'personal-content-platform', '2026-04-23T09:30:00Z'),
  ('terminal-code', 'Deployment Terminal', 'A terminal-first view of logs, task output, and iteration feedback during development.', '/images/gallery/terminal-code/detail.svg', array['terminal', 'logs', 'debug'], 'workspace', false, 2, 'project', 'personal-content-platform', '2026-04-23T09:42:00Z'),
  ('circuit-notes', 'Phasor Method Sheet', 'A note sheet recording phasor reasoning and the structure of alternating current analysis.', '/images/gallery/circuit-notes/cover.svg', array['phasor', 'ac', 'notes'], 'notes', false, 1, 'none', null, '2026-04-21T15:10:00Z'),
  ('circuit-notes', 'Impedance Notes', 'A companion sheet for impedance, admittance, and their practical relationships in exercises.', '/images/gallery/circuit-notes/detail.svg', array['impedance', 'admittance', 'study'], 'notes', false, 2, 'none', null, '2026-04-21T15:22:00Z'),
  ('daily-moments', 'Night Desk', 'A quiet desk scene after coding and planning, used as a softer non-project visual note.', '/images/gallery/daily-moments/cover.svg', array['desk', 'night', 'life'], 'life', false, 1, 'none', null, '2026-04-16T20:45:00Z'),
  ('daily-moments', 'City Walk', 'A minimal city scene that keeps the gallery grounded in daily observation, not only project work.', '/images/gallery/daily-moments/detail.svg', array['city', 'walk', 'moments'], 'life', false, 2, 'none', null, '2026-04-16T21:10:00Z');
