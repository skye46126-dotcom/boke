-- Gallery Albums Migration
-- 图片集数据表

-- 图片集表
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 给 gallery 表添加 album_id 字段
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES gallery_albums(id) ON DELETE SET NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_gallery_album_id ON gallery(album_id);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_created_at ON gallery_albums(created_at DESC);

-- 插入示例图片集
INSERT INTO gallery_albums (id, name, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', '风景摄影集', '收录各地风景照片'),
  ('a0000000-0000-0000-0000-000000000002', '人物肖像集', '人物摄影作品集'),
  ('a0000000-0000-0000-0000-000000000003', '建筑设计集', '建筑与城市景观')
ON CONFLICT (id) DO NOTHING;

-- 将现有图片关联到图片集（按分类）
UPDATE gallery SET album_id = 'a0000000-0000-0000-0000-000000000001' WHERE category = '风景' AND album_id IS NULL;
UPDATE gallery SET album_id = 'a0000000-0000-0000-0000-000000000002' WHERE category = '人物' AND album_id IS NULL;
UPDATE gallery SET album_id = 'a0000000-0000-0000-0000-000000000003' WHERE category = '建筑' AND album_id IS NULL;
