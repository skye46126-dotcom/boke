-- Add tags support for portfolio cards
-- Migration: 001_add_tags

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_tag_slug UNIQUE (slug)
);

-- Article-Tag relationship table (many-to-many)
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (article_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);

-- Insert system tags for portfolio cards
INSERT INTO tags (name, slug) VALUES
  ('Portfolio Card', 'portfolio-card'),
  ('Category: About', 'category-about'),
  ('Category: Skill', 'category-skill'),
  ('Category: Featured', 'category-featured-article'),
  ('Category: Album', 'category-album'),
  ('Gallery Page', 'gallery')
ON CONFLICT (slug) DO NOTHING;
