-- 005_add_showcase_order.sql
-- 为 gallery 表添加长廊展示排序字段

-- 添加 showcase_order 字段
-- NULL 表示不在长廊展示，数字表示展示顺序（越小越靠前）
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS showcase_order INTEGER DEFAULT NULL;

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_gallery_showcase ON gallery (showcase_order) WHERE showcase_order IS NOT NULL;
