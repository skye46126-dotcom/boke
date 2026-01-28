-- Create the guestbook table
create table public.guestbook (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nickname text not null,
  message text,
  pixels jsonb not null, -- Stores the raw 16x16 array
  image_url text not null -- Base64 encoded image for display
);

-- Enable Row Level Security (RLS)
alter table public.guestbook enable row level security;

-- Create Policy: Allow Public Read access
create policy "Allow Public Read" on public.guestbook
  for select using (true);

-- Create Policy: Allow Public Insert access (anyone can sign)
create policy "Allow Public Insert" on public.guestbook
  for insert with check (true);

-- Enable Realtime
alter publication supabase_realtime add table public.guestbook;
