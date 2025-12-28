/**
 * 长廊数据读取层
 * 从 /content/gallery/corridor.json 读取长廊图片数据
 * 兼容 Decap CMS 管理的数据格式
 */

import fs from 'fs';
import path from 'path';

// 配置文件路径
const corridorFile = path.join(process.cwd(), 'content/gallery/corridor.json');

// 类型定义
export interface CorridorImage {
  id: string;
  title: string;
  description?: string;
  img_url: string;
  author?: string;
  date?: string;
  order?: number;
}

interface CorridorConfig {
  images: CorridorImage[];
}

/**
 * 读取长廊配置
 */
function readCorridorConfig(): CorridorConfig {
  try {
    const content = fs.readFileSync(corridorFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return { images: [] };
  }
}

/**
 * 获取所有长廊图片
 */
export function getCorridorImages(): CorridorImage[] {
  const config = readCorridorConfig();
  return config.images.sort((a, b) => {
    // 按 order 排序，order 小的在前
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * 根据 ID 获取单张长廊图片
 */
export function getCorridorImageById(id: string): CorridorImage | null {
  const images = getCorridorImages();
  return images.find(img => img.id === id) || null;
}

/**
 * 获取长廊图片总数
 */
export function getCorridorImageCount(): number {
  return getCorridorImages().length;
}
