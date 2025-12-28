-- Gallery Table Migration
-- 相册数据表

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  img_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分类索引，优化分类筛选查询
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- 创建时间索引，优化排序查询
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- 插入示例数据
INSERT INTO gallery (title, img_url, category, description) VALUES
  ('像素风景1', '/images/gallery/landscape1.jpg', '风景', '像素风格的山水画'),
  ('像素人物1', '/images/gallery/character1.jpg', '人物', '像素风格的人物肖像'),
  ('像素建筑1', '/images/gallery/building1.jpg', '建筑', '像素风格的建筑设计'),
  ('像素风景2', '/images/gallery/landscape2.jpg', '风景', '像素风格的海景'),
  ('像素人物2', '/images/gallery/character2.jpg', '人物', '像素风格的角色设计'),
  ('像素建筑2', '/images/gallery/building2.jpg', '建筑', '像素风格的城市景观')
ON CONFLICT DO NOTHING;
