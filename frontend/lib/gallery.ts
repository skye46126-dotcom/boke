/**
 * 相册数据读取层
 * 从 /content/gallery/ 目录读取 JSON 配置文件
 * 兼容 Decap CMS 管理的数据格式
 */

import fs from 'fs';
import path from 'path';

// 配置文件路径
const galleryDirectory = path.join(process.cwd(), 'content/gallery');
const albumsFile = path.join(galleryDirectory, 'albums.json');
const imagesFile = path.join(galleryDirectory, 'images.json');

// 类型定义
export interface GalleryAlbum {
  id: string;
  name: string;
  description?: string;
  cover_image?: string;
  category?: string;
  order?: number;
  image_count?: number;
  images?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  img_url: string;
  category: string;
  album_id?: string;
  order?: number;
}

interface AlbumsConfig {
  albums: Omit<GalleryAlbum, 'image_count' | 'images'>[];
}

interface ImagesConfig {
  images: GalleryItem[];
}

/**
 * 读取相册集配置
 */
function readAlbumsConfig(): AlbumsConfig {
  try {
    const content = fs.readFileSync(albumsFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return { albums: [] };
  }
}

/**
 * 读取图片配置
 */
function readImagesConfig(): ImagesConfig {
  try {
    const content = fs.readFileSync(imagesFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return { images: [] };
  }
}

/**
 * 获取所有图片
 */
export function getGalleryItems(): GalleryItem[] {
  const config = readImagesConfig();
  return config.images.sort((a, b) => {
    // 按 order 排序，order 小的在前
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });
}

/**
 * 获取所有相册集（包含图片数量）
 */
export function getAlbums(): GalleryAlbum[] {
  const albumsConfig = readAlbumsConfig();
  const images = getGalleryItems();

  return albumsConfig.albums
    .map(album => {
      const albumImages = images.filter(img => img.album_id === album.id);
      return {
        ...album,
        image_count: albumImages.length,
        // 如果没有封面，使用第一张图片作为封面
        cover_image: album.cover_image || albumImages[0]?.img_url,
      };
    })
    .sort((a, b) => {
      // 按 order 排序
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
}

/**
 * 根据 ID 获取单个相册集（包含图片列表）
 */
export function getAlbumById(id: string): GalleryAlbum | null {
  const albums = getAlbums();
  const album = albums.find(a => a.id === id);
  
  if (!album) return null;

  const images = getGalleryItems().filter(img => img.album_id === id);
  
  return {
    ...album,
    images,
  };
}

/**
 * 获取所有分类
 */
export function getCategories(): string[] {
  const images = getGalleryItems();
  const categories = new Set(images.map(img => img.category));
  return Array.from(categories).sort();
}

/**
 * 根据分类获取图片
 */
export function getGalleryItemsByCategory(category: string): GalleryItem[] {
  const images = getGalleryItems();
  if (category === 'all') return images;
  return images.filter(img => img.category === category);
}

/**
 * 获取所有相册集的 ID（用于 generateStaticParams）
 */
export function getAllAlbumIds(): string[] {
  return getAlbums().map(album => album.id);
}
