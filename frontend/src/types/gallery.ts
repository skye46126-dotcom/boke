/**
 * Gallery Types - 相册类型定义
 */

// ========================================
// 数据类型定义
// ========================================

export interface GalleryItem {
  id: string;
  title: string;
  img_url: string;
  category: string;
  description: string | null;
  album_id: string | null;
  showcase_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  image_count: number;
  created_at: string;
  updated_at: string;
  images?: GalleryItem[];
}

export type GalleryViewMode = 'grid' | 'albums';

export interface GalleryResponse {
  success: boolean;
  data: {
    items: GalleryItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface AlbumsResponse {
  success: boolean;
  data: GalleryAlbum[];
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

// ========================================
// 组件 Props 类型
// ========================================

export interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface ImagePreviewProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
}
