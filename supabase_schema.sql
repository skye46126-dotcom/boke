-- Table for blog articles
create table articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  date date not null default now(),
  status text check (status in ('published', 'draft')) default 'draft',
  excerpt text,
  cover_image text,
  tags text[]
);

-- Enable RLS
alter table articles enable row level security;

-- Create policy to allow public reads
create policy "Allow public read access"
  on articles for select
  using (true);
