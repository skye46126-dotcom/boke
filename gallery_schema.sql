-- 创建 Gallery 相册表
create table if not exists gallery (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  url text not null,
  tags text[],
  created_at timestamptz default now()
);

-- 开启行级安全 (RLS)
alter table gallery enable row level security;

-- 允许任何人读取相册
create policy "Allow public read access"
  on gallery for select
  using (true);

-- 插入示例图片数据
INSERT INTO gallery (title, description, url, tags)
VALUES
  ('Terminal UI Design', 'Interactive terminal component with command support', 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800', ARRAY['UI', 'Terminal', 'Design']),
  ('Code Editor Theme', 'Dark theme code editor with syntax highlighting', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800', ARRAY['Code', 'Editor', 'Theme']),
  ('GitHub Dashboard', 'Modern GitHub-style dashboard layout', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800', ARRAY['GitHub', 'Dashboard', 'UI']),
  ('VitePress Docs', 'Documentation site with VitePress design system', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', ARRAY['Docs', 'VitePress', 'Design']),
  ('Poker Card Design', 'Minimalist poker card navigation elements', 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800', ARRAY['Poker', 'Cards', 'Design']),
  ('Dark Mode UI', 'Beautiful dark mode user interface', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', ARRAY['Dark Mode', 'UI', 'Modern']);
