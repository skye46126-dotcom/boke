'use client';

/**
 * GalleryClient - 相册客户端组件（像素风格）
 * 
 * 核心功能：
 * 1. 【视图切换】- 图片平铺 / 图片集分组
 * 2. 【分类筛选】- 像素风格按钮
 * 3. 【响应式网格】- 像素卡片布局
 * 4. 【图片预览】- 像素风格弹窗
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import '@/styles/gallery-pixel.css';

// 类型定义
interface GalleryAlbum {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  image_count?: number;
}

interface GalleryItem {
  id: string;
  title: string;
  img_url: string;
  category: string;
  album_id?: string | null;
}

type GalleryViewMode = 'grid' | 'albums';

interface GalleryClientProps {
  initialAlbums: GalleryAlbum[];
  initialItems: GalleryItem[];
  initialCategories: string[];
}

// ========================================
// 像素风格图标
// ========================================

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

const AlbumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="4" width="12" height="10" />
    <rect x="4" y="2" width="8" height="2" />
  </svg>
);

// ========================================
// 主组件
// ========================================

export default function GalleryClient({ 
  initialAlbums, 
  initialItems, 
  initialCategories 
}: GalleryClientProps) {
  const [viewMode, setViewMode] = useState<GalleryViewMode>('grid');
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [albums] = useState<GalleryAlbum[]>(initialAlbums);
  const [categories] = useState<string[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // 分类筛选
  useEffect(() => {
    if (activeCategory === 'all') {
      setItems(initialItems);
    } else {
      setItems(initialItems.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, initialItems]);

  const handleClosePreview = useCallback(() => setPreviewItem(null), []);

  // ESC 关闭预览
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClosePreview();
    };
    if (previewItem) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [previewItem, handleClosePreview]);

  return (
    <>
      {/* 视图切换 - 像素按钮 */}
      <div className="pixel-view-toggle">
        <button
          className={`pixel-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          <GridIcon />
          <span>平铺</span>
        </button>
        <button
          className={`pixel-toggle-btn ${viewMode === 'albums' ? 'active' : ''}`}
          onClick={() => setViewMode('albums')}
        >
          <AlbumIcon />
          <span>图片集</span>
        </button>
      </div>

      {/* 分类筛选 - 仅平铺视图 */}
      {viewMode === 'grid' && categories.length > 0 && (
        <div className="pixel-category-filter">
          <button
            className={`pixel-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pixel-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 内容区域 */}
      {viewMode === 'grid' ? (
        // 图片平铺网格 - 纯净模式
        items.length > 0 ? (
          <div className="pixel-gallery-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className="pixel-gallery-item"
                onClick={() => setPreviewItem(item)}
              >
                <img
                  src={item.img_url}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="pixel-empty-state">暂无作品</div>
        )
      ) : (
        // 图片集网格
        albums.length > 0 ? (
          <div className="pixel-albums-grid">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/album/${album.id}`}
                className="pixel-album-card"
              >
                <div className="pixel-album-cover">
                  {album.cover_url ? (
                    <img src={album.cover_url} alt={album.name} loading="lazy" />
                  ) : (
                    <div className="no-cover">📷</div>
                  )}
                  <span className="pixel-album-count">{album.image_count} 张</span>
                </div>
                <div className="pixel-album-info">
                  <h3>{album.name}</h3>
                  {album.description && <p>{album.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="pixel-empty-state">暂无图片集</div>
        )
      )}

      {/* 图片预览弹窗 - 纯净模式 */}
      {previewItem && (
        <div className="pixel-preview-overlay" onClick={handleClosePreview}>
          <button className="pixel-preview-close" onClick={handleClosePreview}>
            ×
          </button>
          <div className="pixel-preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewItem.img_url} alt={previewItem.title} />
          </div>
        </div>
      )}
    </>
  );
}
